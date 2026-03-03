import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pinecone } from '@pinecone-database/pinecone';
import { createClient } from '@supabase/supabase-js';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

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
        const { message, history, product = '소니 WH-1000XM5' } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }

        // Embed the message for search
        const queryEmbedding = await pc.inference.embed(
            'llama-text-embed-v2',
            [message],
            { inputType: 'query' }
        );

        const queryVector = (queryEmbedding.data[0] as any).values as number[];

        // Search Pinecone for relevant context
        const index = pc.index('review-chatbot');
        const results = await index.namespace('reviews').query({
            vector: queryVector,
            topK: 5,
            includeMetadata: true,
            filter: { product }
        });

        // Build context from search results
        const context = (results.matches || [])
            .map((m: any) => m.metadata?.text || '')
            .filter(Boolean)
            .join('\n\n---\n\n');

        // Generate response using OpenAI
        const llm = new ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: 'gpt-5-nano',
        });

        const promptTemplate = PromptTemplate.fromTemplate(`
당신은 상품 리뷰를 바탕으로 사용자의 질문에 답변하는 친절한 AI 어시스턴트입니다.
아래 제공된 '관련 리뷰 문맥(Context)' 정보만을 사용하여 질문에 답변하세요.
문맥에 충분한 정보가 없다면 "제공된 리뷰 데이터에서는 해당 정보를 찾을 수 없습니다."라고 답변하세요.

--- 관련 리뷰 문맥 (Context) ---
{context}

--- 질문 ---
{question}

답변:
`);

        const chain = promptTemplate.pipe(llm).pipe(new StringOutputParser());

        let answer = '';
        if (context) {
            answer = await chain.invoke({
                context: context,
                question: message
            });
        } else {
            answer = '죄송합니다, 관련된 리뷰를 찾지 못했습니다. 다른 질문을 해보시겠어요?';
        }

        // Log to Supabase
        try {
            await supabase.from('search_logs').insert({
                query: message,
                results_count: results.matches?.length || 0,
            });
        } catch (logError) {
            console.warn('Failed to log to Supabase:', logError);
        }

        res.json({ success: true, answer, context_count: results.matches?.length || 0 });
    } catch (error: any) {
        console.error('Chat error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
