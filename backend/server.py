from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

from seed_data import SEED_CONTENT, DIALECTS, CATEGORIES

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
EMERGENT_LLM_KEY = os.environ['EMERGENT_LLM_KEY']

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ------------------------- Models -------------------------
class ContentItem(BaseModel):
    id: str
    category: str
    dialect: str
    title: str
    title_native: str
    body: str
    tags: List[str] = []
    badge: Optional[str] = None


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    topic: str
    dialect: Optional[str] = None
    message: str


class GenerateRequest(BaseModel):
    category: str
    dialect: str
    topic: str
    vibe: Optional[str] = "viral"


class GenerateResponse(BaseModel):
    text: str


# ------------------------- Helpers -------------------------
def dialect_label(code: str) -> str:
    for d in DIALECTS:
        if d["code"] == code:
            return f'{d["name_en"]} ({d["name_native"]})'
    return code


def build_prompt(req: GenerateRequest) -> str:
    label = dialect_label(req.dialect)
    if req.category == "tiktok-scripts":
        return (
            f"Write a short-form TikTok video script about \"{req.topic}\" with a {req.vibe} vibe. "
            f"Write the script entirely in {label} dialect (native script). "
            f"Structure it clearly with three labeled parts using emojis: a scroll-stopping Hook (first 3 seconds), "
            f"a Body, and a Call-to-Action. Keep it punchy and natural to how people actually speak in that dialect. "
            f"Do not add any explanation before or after the script."
        )
    if req.category == "ai-prompts":
        return (
            f"Create ONE highly-detailed English AI image-generation prompt (for Midjourney/Flux/DALL-E) "
            f"about \"{req.topic}\" with a {req.vibe} aesthetic, culturally rooted in the world of "
            f"{label} speakers (Middle Eastern / Kurdish visual culture). "
            f"Include subject, setting, lighting, lens, mood, and end with technical parameters like --ar and --v 6. "
            f"Return only the prompt text."
        )
    # content-ideas
    return (
        f"Give a numbered list of 7 fresh, trending short-video content ideas about \"{req.topic}\" "
        f"for a creator, with a {req.vibe} vibe. Write the ideas entirely in {label} dialect (native script). "
        f"Keep each idea to one short line. Return only the list."
    )


async def run_llm(prompt: str) -> str:
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=str(uuid.uuid4()),
        system_message=(
            "You are an expert TikTok content strategist and AI prompt engineer, "
            "fluent in all Arabic dialects and Kurdish (Sorani & Kurmanji). "
            "You write authentic, culturally accurate content that sounds native."
        ),
    ).with_model("gemini", "gemini-3-flash-preview")

    result = ""
    async for event in chat.stream_message(UserMessage(text=prompt)):
        if isinstance(event, TextDelta):
            result += event.content
        elif isinstance(event, StreamDone):
            break
    return result.strip()


# ------------------------- Routes -------------------------
@api_router.get("/")
async def root():
    return {"message": "AI Content Creator Hub API"}


@api_router.get("/dialects")
async def get_dialects():
    return DIALECTS


@api_router.get("/content", response_model=List[ContentItem])
async def get_content(category: Optional[str] = None, dialect: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if dialect:
        query["dialect"] = dialect
    docs = await db.content.find(query, {"_id": 0}).to_list(1000)
    return docs


@api_router.get("/content/{item_id}", response_model=ContentItem)
async def get_content_item(item_id: str):
    doc = await db.content.find_one({"id": item_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Content not found")
    return doc


@api_router.post("/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    if req.category not in CATEGORIES:
        raise HTTPException(status_code=400, detail="Invalid category")
    try:
        text = await run_llm(build_prompt(req))
    except Exception as e:
        logger.exception("Generation failed")
        raise HTTPException(status_code=500, detail=f"Generation failed: {e}")
    return GenerateResponse(text=text)


@api_router.post("/contact")
async def submit_contact(payload: ContactCreate):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.contacts.insert_one(doc)
    return {"success": True, "id": doc["id"]}


# ------------------------- Startup -------------------------
@app.on_event("startup")
async def seed_content():
    count = await db.content.count_documents({})
    if count == 0:
        await db.content.insert_many([dict(item) for item in SEED_CONTENT])
        logger.info("Seeded %d content items", len(SEED_CONTENT))


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
