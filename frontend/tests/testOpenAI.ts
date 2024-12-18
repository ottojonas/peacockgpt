import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ChatCompletionRequestMessage = {
  role: 'system' | 'user' | 'assistant'; 
  content: string
}

async function testOpenAI() {
  try {
    const messages: ChatCompletionRequestMessage[] = [{ role: 'user', content: 'What is the capital of France?' }];
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', 
      messages: messages,
      max_tokens: 150, 
      n: 1, 
      stop: null, 
      temperature: 0.5,
    });

    console.log('response from PeacockGPT:', response.choices?.[0]?.message?.content?.trim());
  } catch (error) {
    console.error('error testing PeacockGPT:', error);
  }
}

testOpenAI();