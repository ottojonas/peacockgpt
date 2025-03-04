import os

import openai
from dotenv import load_dotenv
from icecream import ic

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


def annotate_document(document):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an NLP annotation assistant."},
            {
                "role": "user",
                "content": f"Annotate the following document for NLP training:\n\n{document}",
            },
        ],
        max_tokens=150,
        n=1,
        stop=None,
        temperature=0.5,
    )
    return response.choices[0].message["content"].strip()


def main():
    input_dir = "data/training-documents"
    output_dir = "data/annotated-documents"

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for filename in os.listdir(input_dir):
        if filename.endswith(".txt"):
            with open(os.path.join(input_dir, filename), "r", encoding="utf-8") as file:
                document = file.read()
                annotation = annotate_document(document)
                with open(
                    os.path.join(output_dir, f"{filename}.annotated"),
                    "w",
                    encoding="utf-8",
                ) as output_file:
                    output_file.write(annotation)
            ic(f"annotated {filename}")


if __name__ == "__main__":
    main()
