#Create .env.local
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your_api_key
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini

#Create app/config.py
import os
from dotenv import load_dotenv

load_dotenv(".env.local")

AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT")

if not AZURE_OPENAI_ENDPOINT:
    raise ValueError("AZURE_OPENAI_ENDPOINT is missing in .env.local")

if not AZURE_OPENAI_API_KEY:
    raise ValueError("AZURE_OPENAI_API_KEY is missing in .env.local")

if not AZURE_OPENAI_DEPLOYMENT:
    raise ValueError("AZURE_OPENAI_DEPLOYMENT is missing in .env.local")

#Create app/services/llm_service.py
from openai import AzureOpenAI
from app.config import (
    AZURE_OPENAI_ENDPOINT,
    AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_DEPLOYMENT
)

client = AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    api_version="2024-02-15-preview",
    azure_endpoint=AZURE_OPENAI_ENDPOINT
)


class LLMService:

    @staticmethod
    def generate_question(role: str, experience: str):

        prompt = f"""
        You are a senior interviewer.

        Role: {role}
        Experience: {experience}

        Ask ONE technical interview question.
        """

        response = client.chat.completions.create(
            model=AZURE_OPENAI_DEPLOYMENT,
            messages=[
                {"role": "system", "content": "You are an AI interviewer."},
                {"role": "user", "content": prompt}
            ]
        )

        return response.choices[0].message.content


    @staticmethod
    def evaluate_answer(question: str, answer: str):

        prompt = f"""
        Question: {question}
        Answer: {answer}

        Give:
        - score (0-10)
        - feedback
        """

        response = client.chat.completions.create(
            model=AZURE_OPENAI_DEPLOYMENT,
            messages=[
                {"role": "system", "content": "You are a strict evaluator."},
                {"role": "user", "content": prompt}
            ]
        )

        return response.choices[0].message.content
