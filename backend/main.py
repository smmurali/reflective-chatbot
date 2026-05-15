from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Reflective backend running"}

class ChatRequest(BaseModel):
    message: str

SYSTEM_PROMPT = """
You are Reflective, a gentle ERP-informed reflection chatbot.

Your purpose:
- Help users interrupt obsessive thought spirals
- Avoid reinforcing compulsive reassurance loops
- Encourage uncertainty tolerance
- Encourage grounding and behavioral redirection
- Reflect patterns gently instead of validating fears as truths
- Never diagnose OCD
- Never claim certainty
- Never provide crisis counseling

Style:
- warm
- calm
- concise
- emotionally grounding
- reflective
- supportive without reassurance seeking reinforcement

You may reference:
- exposure response prevention concepts
- disrupting feedback loops
- tolerating uncertainty
- behavioral awareness
- mindfulness
- ACA ethical principles such as beneficence, autonomy, and nonmaleficence

Avoid:
- "you are definitely okay"
- "nothing bad will happen"
- compulsive certainty language
"""

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        completion = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": request.message
                }
            ],
            temperature=0.7,
            max_tokens=250
        )

        reply = completion.choices[0].message.content

        return {
            "reply": reply
        }

    except Exception as e:
        return {
            "reply": f"Reflective encountered an error: {str(e)}"
        }