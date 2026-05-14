import os
import httpx
import torch
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.models import load_cnn, load_efficientnet
from app.inference import predict

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"

CNN_PATH = os.getenv("CNN_MODEL_PATH", "/app/models/n03_cnn_custom_scratch.pth")
EFF_PATH = os.getenv("EFF_MODEL_PATH", "/app/models/n04_efficientnet_b4_final.pth")

device = torch.device("cpu")

app = FastAPI(title="Inference Service")

cnn_model = None
eff_model = None


@app.on_event("startup")
def load_models():
    global cnn_model, eff_model
    cnn_model = load_cnn(CNN_PATH, device)
    eff_model = load_efficientnet(EFF_PATH, device)


@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=400, detail="Unsupported image format")

    image_bytes = await file.read()
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large")

    result = predict(image_bytes, cnn_model, eff_model, device)
    return result


class AdviceRequest(BaseModel):
    disease: str
    severity: str
    plant: str


@app.post("/advice")
async def get_advice(body: AdviceRequest):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=503, detail="Advice service not configured")

    prompt = (
        f"A plant disease detection app detected the following:\n"
        f"- Plant: {body.plant}\n"
        f"- Disease: {body.disease}\n"
        f"- Severity: {body.severity}\n\n"
        f"Give 3 short, practical treatment and care tips for this situation. "
        f"Be concise, use simple language, no markdown, no bullet symbols, just plain numbered list."
    )

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            GROQ_URL,
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": GROQ_MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 300,
                "temperature": 0.5,
            },
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Advice service failed")

    advice = resp.json()["choices"][0]["message"]["content"].strip()
    return {"advice": advice}


@app.get("/health")
def health():
    return {"status": "ok"}
