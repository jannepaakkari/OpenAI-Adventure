import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    const { input } = await req.json(); // Reading the JSON body directly

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { "role": "system", "content": "You are a witty assistant with a knack for making people chuckle while providing help." },
                { role: "user", content: input },
            ],
        });

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}