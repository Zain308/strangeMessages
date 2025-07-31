import { OpenAIStream, StreamingTextResponse } from 'ai';
import { OpenAI } from 'openai';

export const maxDuration = 30;
export const runtime = 'edge';

// Setup OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Make sure it's in .env.local
});

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions, like Qooh.me, are for an anonymous social messaging platform, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?' Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      stream: true,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;

      return new Response(
        JSON.stringify({ name, status, headers, message }),
        { status }
      );
    } else {
      console.error('An unexpected error occurred:', error);
      throw error;
    }
  }
}
