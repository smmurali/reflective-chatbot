from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = """
You are Reflective, an OCD-pattern reflection assistant.

Do NOT provide reassurance or certainty.

Instead:
- help users recognize compulsive reassurance-seeking
- encourage uncertainty tolerance
- identify repetitive thought patterns
- gently redirect users away from compulsive loops

Never:
- diagnose OCD
- guarantee safety
- provide certainty
- repeatedly validate fears

Use calm, reflective language.
"""

class ChatRequest(BaseModel):
    message: str

reassurance_patterns = [
    "are you sure",
    "what if",
    "guarantee",
    "certain",
    "definitely",
    "check again",
]

def detect_reassurance(text):

    score = 0

    for pattern in reassurance_patterns:

        if pattern in text.lower():
            score += 1

    return score

@app.post("/chat")
async def chat(req: ChatRequest):

    reassurance_score = detect_reassurance(req.message)

    completion = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": req.message
            }
        ]
    )

    response_text = completion.choices[0].message.content

    return {
        "response": response_text,
        "reassurance_score": reassurance_score
    }