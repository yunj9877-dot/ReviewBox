import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pinecone } from '@pinecone-database/pinecone';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('Starting indexing process...');

        const filesConfig = [
            { file: 'reviews.csv', product: '소니 WH-1000XM5' },
            { file: 'airpods_reviews.csv', product: '에어팟 프로 2세대' },
            { file: 'bose_reviews.csv', product: '보스 QC45' }
        ];

        let allSplitDocs: Document[] = [];

        for (const config of filesConfig) {
            const csvPath = path.join(process.cwd(), 'samples', config.file);
            const fileContent = fs.readFileSync(csvPath, 'utf-8');
            const records = parse(fileContent, { columns: true, skip_empty_lines: true });
            console.log(`Parsed ${records.length} records from ${config.file}.`);

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
                        product: config.product
                    }
                });
            });

            const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
            const splitDocs = await splitter.splitDocuments(docs);
            allSplitDocs = allSplitDocs.concat(splitDocs);
        }

        const BATCH_SIZE = 90;
        const index = pc.index('review-chatbot');
        let totalUpserted = 0;

        for (let i = 0; i < allSplitDocs.length; i += BATCH_SIZE) {
            const batch = allSplitDocs.slice(i, i + BATCH_SIZE);
            const texts = batch.map(doc => doc.pageContent);

            const embeddingResponse = await pc.inference.embed({
                model: 'llama-text-embed-v2',
                inputs: texts,
                parameters: { inputType: 'passage' }
            });

            const vectorRecords = embeddingResponse.data.map((emb, idx) => {
                const rawMeta = { text: batch[idx].pageContent, ...batch[idx].metadata };
                const cleanMeta: Record<string, string | number | boolean> = {};
                for (const [key, val] of Object.entries(rawMeta)) {
                    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                        cleanMeta[key] = val;
                    }
                }
                return {
                    id: `review-${i + idx}-${Date.now()}`,
                    values: (emb as any).values as number[],
                    metadata: cleanMeta
                };
            });

            await index.namespace('reviews').upsert({ records: vectorRecords } as any);
            totalUpserted += vectorRecords.length;
        }

        res.json({ success: true, message: `Successfully indexed ${totalUpserted} chunks.` });
    } catch (error: any) {
        console.error('Indexing error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
