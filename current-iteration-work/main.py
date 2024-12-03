import json
import os
import time

from dotenv import load_dotenv
from icecream import ic
from langchain.text_splitter import CharacterTextSplitter
from numpy import dot
from openai import OpenAI
from PyPDF2 import PdfReader

# Load environment variables from a .env file
load_dotenv()

# Start time for performance measurement
start_time = time.time()

# File paths and constants
EXTRACTED_TEXT_FILE_PATH = "EXTRACTED_TEXT_PDF.pdf"
EXTRACTED_JSON_FILE_PATH = "EXTRACTED_JSON.json"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
EMBEDDING_MODEL = "text-embedding-ada-002"
GPT_MODEL = "gpt-3.5-turbo"
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
CONFIDENCE_SCORE = 0.5


# Function to extract text from a PDF file
def extract_text_from_pdf(file_path: str):
    reader = PdfReader(file_path)
    number_of_pages = len(reader.pages)
    pdf_text = ""

    # Extract text from each page of the PDF
    for pdf_page in range(number_of_pages):
        page = reader.pages[pdf_page]
        pdf_text += page.extract_text()
        pdf_text += "\n"

    # Save the extracted text to a file
    file_path = EXTRACTED_TEXT_FILE_PATH
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(pdf_text)

    ic(f"{EXTRACTED_TEXT_FILE_PATH} file created and saved")


# Function to create embeddings from the extracted text
def create_embeddings(file_path: str):
    snippets = []
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len,
    )
    # Read the extracted text from the file
    with open(file_path, "r", encoding="utf-8") as file:
        file_text = file.read()
    snippets = text_splitter.split_text(file_text)

    # Set the OpenAI API key
    OpenAI.api_key = OPENAI_API_KEY
    client = OpenAI()

    # Create embeddings for the text snippets
    response = client.embeddings.create(input=snippets, model=EMBEDDING_MODEL)
    embedding_list = [response_object.embedding for response_object in response.data]
    embedding_json = {"embeddings": embedding_list, "snippets": snippets}

    # Log the response time and response details
    response_time = time.time() - start_time
    ic(f"full response received {response_time:.2f} seconds after request")
    ic(f"full response received {response}")
    for chunk in response:
        ic(chunk)
        ic(chunk.choices[0].delta.content)

    # Save the embeddings and snippets to a JSON file
    json_object = json.dumps(embedding_json, indent=4)
    with open(EXTRACTED_JSON_FILE_PATH, "w", encoding="utf-8") as file:
        file.write(json_object)


# Function to get embeddings and snippets from the JSON file
def get_embeddings():
    with open(EXTRACTED_JSON_FILE_PATH, "r") as file:
        embedding_json = json.load(file)

    ic(embedding_json)
    return embedding_json["embeddings"], embedding_json["snippets"]


# Function to create an embedding for a user's question
def user_question_embedding_creator(question):
    client = OpenAI()
    response = client.embeddings.create(input=question, model=EMBEDDING_MODEL)
    ic(response.data[0].embedding)
    return response.data[0].embedding


# Function to answer user questions based on the embeddings
def answer_user_questions(user_question):
    try:
        user_question_embedding = user_question_embedding_creator(user_question)
        ic(user_question_embedding)
    except Exception as e:
        ic(f"an error occurred while creating embedding: {str(e)}")
        return

    cosine_similarities = []
    for embedding in embeddings:
        cosine_similarities.append(dot(user_question_embedding, embedding))
    ic(cosine_similarities)

    # Score and sort the snippets based on similarity to the user's question
    scored_snippets = zip(snippets, cosine_similarities)
    sorted_snippets = sorted(scored_snippets, key=lambda x: x[1], reverse=True)
    ic(sorted_snippets)

    # Filter the top results based on confidence score
    formatted_top_results = [
        snipps for snipps, _score in sorted_snippets if _score > CONFIDENCE_SCORE
    ]
    ic(formatted_top_results)
    if len(formatted_top_results) > 5:
        formatted_top_results = formatted_top_results[:5]

    messages = []

    try:
        client = OpenAI()
        # Create a chat completion based on the user's question
        completion = client.chat.completions.create(
            model=GPT_MODEL, messages=messages, temperature=0, stream=False
        )
        # Create a training assistant for the chatbot
        training_assistant = client.beta.assistant.create(
            model=GPT_MODEL,
            instructions="you are a chat bot that intakes information from pdf files and help new employees learn how to different aspects of their job by helping them find specific information from the pdf files",
            name="trainer",
            tools=[{"type": "file_search"}],
            tool_resources={"file_search": {"vector_store_ids": ["vs_123"]}},
        )
        ic(training_assistant)
        ic(completion)
    except Exception as e:
        ic(f"an error occurred with chatbot: {str(e)}")


# Main script execution
pdf_file_path = (
    "training-documents/how-to-open-a-new-account-nav.pdf"  # Path to the PDF file
)
extract_text_from_pdf(pdf_file_path)  # Extract text from the PDF
create_embeddings(EXTRACTED_TEXT_FILE_PATH)  # Create embeddings from the extracted text
embeddings, snippets = (
    get_embeddings()
)  # Retrieve embeddings and snippets from the JSON file
pdf_description = ""

# Interactive loop to answer user questions
while True:
    print("user: ")
    user_question = input("")  # Get user question
    if user_question == "":
        break  # Exit loop if no question is entered
    else:
        print("response: ")
        print(
            answer_user_questions(user_question=user_question)
        )  # Answer user question
