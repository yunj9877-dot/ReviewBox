import { Embeddings, type EmbeddingsParams } from "@langchain/core/embeddings";
import { Pinecone } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export class CompatiblePineconeEmbeddings extends Embeddings {
    client: Pinecone;
    model: string;
    batchSize = 90; // Pinecone limit for llama-text-embed-v2 is 96. Using 90 for safety.

    constructor(fields: EmbeddingsParams & { model: string; apiKey: string }) {
        super(fields);
        this.client = new Pinecone({ apiKey: fields.apiKey });
        this.model = fields.model;
    }

    async embedDocuments(texts: string[]): Promise<number[][]> {
        console.log(`[CompatiblePineconeEmbeddings] embedDocuments called with ${texts?.length} texts`);
        if (!texts || texts.length === 0) return [];

        const results: number[][] = [];

        for (let i = 0; i < texts.length; i += this.batchSize) {
            const batch = texts.slice(i, i + this.batchSize);
            console.log(`[CompatiblePineconeEmbeddings] Processing batch ${i / this.batchSize + 1} (${batch.length} texts)`);

            try {
                const response = await this.client.inference.embed({
                    model: this.model,
                    inputs: batch,
                    parameters: { inputType: 'passage' }
                });
                const batchEmbeddings = response.data.map(d => d.values as number[]);
                results.push(...batchEmbeddings);
            } catch (err) {
                console.error(`[CompatiblePineconeEmbeddings] Error in batch ${i / this.batchSize + 1}:`, err);
                throw err;
            }
        }

        console.log(`[CompatiblePineconeEmbeddings] Finished embedding ${results.length} documents.`);
        return results;
    }

    async embedQuery(text: string): Promise<number[]> {
        try {
            const response = await this.client.inference.embed({
                model: this.model,
                inputs: [text],
                parameters: { inputType: 'query' }
            });
            return response.data[0].values as number[];
        } catch (err) {
            console.error('[CompatiblePineconeEmbeddings] Error in embedQuery:', err);
            throw err;
        }
    }
}

export const embeddings = new CompatiblePineconeEmbeddings({
    model: 'llama-text-embed-v2',
    apiKey: process.env.PINECONE_API_KEY!,
});
