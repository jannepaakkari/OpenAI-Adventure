import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    const { input } = await req.json();

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            frequency_penalty: 2,
            messages: [
                { role: "user", content: input },
                {
                    role: "system",
                    content: `You are a personal assistant called Plan my Adventure. 
                    You will give suggestions for activities based on the user's location which will be provided by the user.  
                    Your answers will be short and concise, as they need to fit on a mobile device display. 
                    Try not repeat actions i.e. do not suggest that user should eat whole day.
                    Focus on accuracy of information if you do not know name of restaurant you are allowed to use generic language i.e. visit at local restaurant.`,
                },
            ],
        });
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}