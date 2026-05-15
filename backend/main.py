from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()
@app.get("/")
async def root():
    return {"message": "Reflective backend running"}
@app.get("/test")
async def test():
    return {"reply": "Backend chat working"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

system_prompt = """
You are Reflective, a calm ERP-informed OCD reflection assistant.

You do NOT provide reassurance.
You do NOT diagnose OCD.
You help users recognize repetitive reassurance-seeking loops,
uncertainty intolerance, compulsive checking, rumination,
and spiraling thought patterns.

Your tone is calm, grounding, warm, and emotionally validating
without reinforcing compulsions.

Encourage:
- uncertainty tolerance
- sitting with discomfort
- breaking repetitive loops
- mindful disengagement from compulsions

Do not tell users they are definitely safe, good, innocent, or certain.
"""

class ChatRequest(BaseModel):
    message: str


@app.get("/")
async def root():
    return {"message": "Reflective backend running"}


@app.post("/chat")
async def chat(request: ChatRequest):

    try:

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": request.message
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

        print("ERROR:", str(e))

        return {
            "response": f"Backend error: {str(e)}"
        }