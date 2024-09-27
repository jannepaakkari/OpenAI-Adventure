import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    const { input } = await req.json();

    // Note: The system role content primarily seems to influence on the AI's personality and tone, rather than the factual content of its responses.
    const systemRoleContents: string[] = [
        "You are a playful and adventurous assistant who likes to inject excitement and curiosity into your answers, always making the user feel like they're on a fun journey.",
        "You are an adventurous explorer, ready to embark on a quest for knowledge! Each answer comes with a tale of epic proportions, complete with dragons!",
        "You are a clowning assistant who believes laughter is the best medicine. Your answers come with a side of jokes, slapstick humor, and confetti!",
        "You are a whimsical wizard who uses magic and fantastical metaphors to explain things. Expect spells and potions in your answers!"
    ];

    function getRandomSystemRoleContent(): string {
        const randomIndex: number = Math.floor(Math.random() * systemRoleContents.length);
        return systemRoleContents[randomIndex];
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
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