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
You are Reflective.

Reflective is an ERP-informed OCD reflection assistant.

Your role is NOT to:
- provide reassurance
- provide certainty
- answer compulsive hypotheticals directly
- reinforce reassurance loops
- guarantee safety

Your role IS to:
- identify reassurance-seeking patterns
- help users recognize spiraling thought loops
- encourage uncertainty tolerance
- support behavioral disengagement
- encourage reflective awareness

Always:
- use calm language
- remain emotionally validating WITHOUT giving reassurance
- externalize OCD from the user
- redirect certainty-seeking toward reflection

Never:
- diagnose OCD
- act like a therapist
- guarantee outcomes
- intensify fears
"""

class ChatRequest(BaseModel):
    message: str
    history: list = []

reassurance_patterns = [
    "are you sure",
    "what if",
    "guarantee",
    "certain",
    "definitely",
    "check again",
    "just one more time",
    "please confirm",
    "but what if",
    "i need to know",
]

spiral_labels = {
    "what if": "catastrophic thinking",
    "are you sure": "certainty-seeking",
    "check again": "checking compulsion",
    "please confirm": "reassurance-seeking",
    "just one more time": "repetitive checking",
}

def detect_reassurance(text):

    text = text.lower()

    score = 0
    patterns_found = []

    for pattern in reassurance_patterns:

        if pattern in text:
            score += 1
            patterns_found.append(pattern)

    return score, patterns_found

@app.post("/chat")
async def chat(request: ChatRequest):

    try:

        user_message = request.message

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            temperature=0.7,
            max_tokens=300,
        )

        reply = response.choices[0].message.content

        return {
            "response": reply
        }

    except Exception as e:

        print("ERROR:", e)

        return {
            "response": f"Reflective encountered an issue: {str(e)}"
        }