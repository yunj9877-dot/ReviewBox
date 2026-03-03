import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pinecone } from '@pinecone-database/pinecone';
import { createClient } from '@supabase/supabase-js';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { query, product = '소니 WH-1000XM5' } = req.body;

        if (!query) {
            return res.status(400).json({ success: false, error: 'Query is required' });
        }

        const queryEmbedding = await pc.inference.embed({
            model: 'llama-text-embed-v2',
            inputs: [query],
            parameters: { inputType: 'query' }
        });

        const queryVector = queryEmbedding.data[0].values as number[];

        const index = pc.index('review-chatbot');
        const results = await index.namespace('reviews').query({
            vector: queryVector,
            topK: 5,
            includeMetadata: true,
            filter: { product }
        });

        // Log search to Supabase
        try {
            await supabase.from('search_logs').insert({
                query,
                results_count: results.matches?.length || 0,
            });
        } catch (logError) {
            console.warn('Failed to log search to Supabase:', logError);
        }

        res.json({
            success: true,
            results: results.matches?.map(m => ({
                score: m.score,
                text: m.metadata?.text,
                metadata: m.metadata
            })) || []
        });
    } catch (error: any) {
        console.error('Search error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
