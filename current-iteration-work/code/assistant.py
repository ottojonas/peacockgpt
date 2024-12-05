import os

from dotenv import load_dotenv
from icecream import ic
from openai import OpenAI


class Assistant:
    def __init__(self):
        self.api_key = self.load_environment()
        self.openai_client = OpenAI(api_key=self.api_key)
        self.peacockgpt = self.create_assistant()

    def load_environment(self):
        load_dotenv()
        return os.getenv("OPENAI_API_KEY")

    def create_assistant(self):
        client = OpenAI()
        self.peacockgpt = client.beta.assistants.create(
            instructions="You are a chatbot that helps new employees understand and learn the training documents by just providing the relevant information to their questions. The information is stored in pdf files",
            name="PeacockGPT",
            tools=[{"type": "file_search"}],
            # tool_resources={"file_search": {"vector_store_ids": ["vs_123"]}},
            model="gpt-4o",
            temperature=0.2,
        )
        ic(self.peacockgpt)
        return self.peacockgpt

    def ask_question(self, question):
        if not self.peacockgpt:
            return "assistant not available"
        response = self.openai_client.chat.completions.create(
            model=self.peacockgpt.model,
            messages=[{"role": "user", "content": question}],
            temperature=self.peacockgpt.temperature,
            max_tokens=150,
        )
        return response["choices"][0]["message"]["content"]


if __name__ == "__main__":
    assistant = Assistant()
    if assistant.peacockgpt:
        response = assistant.ask_question("how do i create a nav account?")
        print(response)
    else:
        ic("assistant could not be created")
