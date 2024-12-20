import { OpenAI } from 'openai';
import dotenv from 'dotenv';

// * load environment variables from .env file 
dotenv.config();

// * initialise openai with api key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// * define structure of chat completion request message 
type ChatCompletionRequestMessage = {
  role: 'system' | 'user' | 'assistant'; // * role of message sender 
  content: string // * content of string 
}

// * async function to test openai chat completion 
async function testOpenAI() {
  try {
    // * define message to be sent to openai
    const messages: ChatCompletionRequestMessage[] = [{ role: 'user', content: 'What is the capital of France?' }];
    // * send message to openai and get response
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', 
      messages: messages,
      max_tokens: 150, 
      n: 1, 
      stop: null, 
      temperature: 0.5,
    });

    // * log response from openai
    // * console.log('response from PeacockGPT:', response.choices?.[0]?.message?.content?.trim());
  } catch (error) {
    // * handle any errors 
    console.error('error testing PeacockGPT:', error);
  }
}

// * call the testOpenAI function to test openai's chat completion
testOpenAI();