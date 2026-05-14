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
async def chat(req: ChatRequest):

    reassurance_score, patterns_found = detect_reassurance(req.message)

    detected_labels = []

    for pattern in patterns_found:

        if pattern in spiral_labels:
            detected_labels.append(
                spiral_labels[pattern]
            )

    reflection_context = ""

    if reassurance_score > 0:

        reflection_context = f"""
        The user may be engaging in:
        {', '.join(detected_labels)}

        Your response should:
        - gently identify the reassurance loop
        - avoid certainty
        - encourage uncertainty tolerance
        - reinforce disengagement from compulsive checking
        """

    completion = client.chat.completions.create(
        model="gpt-4.1-mini",
        temperature=0.7,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "system",
                "content": reflection_context
            },
            *req.history,
            {
                "role": "user",
                "content": req.message
            }
        ]
    )

    response_text = completion.choices[0].message.content

    return {
        "response": response_text,
        "reassurance_score": reassurance_score,
        "patterns_detected": detected_labels
    }