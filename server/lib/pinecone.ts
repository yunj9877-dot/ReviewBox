import { Pinecone } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not set');
}

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export const indexName = 'review-chatbot';
export const pineconeIndex = pinecone.index(indexName);
