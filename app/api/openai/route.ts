import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    const { input } = await req.json();

    // TODO: more system roles for variability, though this does not seem to matter as much as other factors.
    const systemRoleContents: string[] = [
        "###You will be provided a location. You should surpise the user with a fun fact about the location and suggest accordingly.### Focus on the accuracy of the information.",
        "###For each location provided, deliver an intriguing, lesser-known fact and recommend something accordingly.### Be sure the information is both accurate and exciting.",
    ];

    function getRandomSystemRoleContent(): string {
        const randomIndex: number = Math.floor(Math.random() * systemRoleContents.length);
        return systemRoleContents[randomIndex];
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            frequency_penalty: 2,
            messages: [
                { role: "user", content: input },
                { "role": "system", "content": getRandomSystemRoleContent() },
            ],
        });
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}