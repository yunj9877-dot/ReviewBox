import { Router } from 'express';
import { Pinecone } from '@pinecone-database/pinecone';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as dotenv from 'dotenv';

dotenv.config();

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

router.post('/', async (req, res) => {
    try {
        console.log('Starting indexing process...');

        // 1. Define files and their corresponding product names
        const filesConfig = [
            { file: 'reviews.csv', product: '소니 WH-1000XM5' },
            { file: 'airpods_reviews.csv', product: '에어팟 프로 2세대' },
            { file: 'bose_reviews.csv', product: '보스 QC45' }
        ];

        let allSplitDocs: Document[] = [];

        for (const config of filesConfig) {
            const csvPath = path.resolve(__dirname, `../../samples/${config.file}`);
            const fileContent = fs.readFileSync(csvPath, 'utf-8');
            const records = parse(fileContent, { columns: true, skip_empty_lines: true });
            console.log(`Parsed ${records.length} records from ${config.file}.`);

            // 2. Create documents and split
            const docs = records.map((record: any) => {
                const pageContent = `Title: ${record.title}\nRating: ${record.rating}\nContent: ${record.content}`;
                return new Document({
                    pageContent,
                    metadata: {
                        id: record.id,
                        author: record.author,
                        date: record.date,
                        rating: record.rating,
                        verified: record.verified_purchase,
                        product: config.product // Inject product name for filtering
                    }
                });
            });

            const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
            const splitDocs = await splitter.splitDocuments(docs);
            allSplitDocs = allSplitDocs.concat(splitDocs);
            console.log(`Split ${config.file} into ${splitDocs.length} chunks.`);
        }

        // 3. Embed in batches and upsert directly
        const BATCH_SIZE = 90;
        const index = pc.index('review-chatbot');
        let totalUpserted = 0;

        for (let i = 0; i < allSplitDocs.length; i += BATCH_SIZE) {
            const batch = allSplitDocs.slice(i, i + BATCH_SIZE);
            const texts = batch.map(doc => doc.pageContent);
            console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: embedding ${texts.length} texts...`);

            const embeddingResponse = await pc.inference.embed({
                model: 'llama-text-embed-v2',
                inputs: texts,
                parameters: { inputType: 'passage' }
            });

            const vectorRecords = embeddingResponse.data.map((emb, idx) => {
                // Filter metadata to only include flat values (Pinecone requirement)
                const rawMeta = { text: batch[idx].pageContent, ...batch[idx].metadata };
                const cleanMeta: Record<string, string | number | boolean> = {};
                for (const [key, val] of Object.entries(rawMeta)) {
                    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                        cleanMeta[key] = val;
                    }
                }
                return {
                    id: `review-${i + idx}-${Date.now()}`,
                    values: emb.values as number[],
                    metadata: cleanMeta
                };
            });

            await index.namespace('reviews').upsert({ records: vectorRecords } as any);
            totalUpserted += vectorRecords.length;
            console.log(`Upserted ${vectorRecords.length} vectors (total: ${totalUpserted}).`);
        }

        console.log(`Indexing complete! Total: ${totalUpserted} vectors.`);
        res.json({ success: true, message: `Successfully indexed ${totalUpserted} chunks.` });
    } catch (error: any) {
        console.error('Indexing error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
