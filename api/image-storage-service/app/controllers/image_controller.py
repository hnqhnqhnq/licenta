import base64
from fastapi import APIRouter, Depends, UploadFile, File, Body
from fastapi.responses import FileResponse
from pathlib import Path
from sqlalchemy.orm import Session
import os

from app.database import get_db
from app.services.image_service import ImageService, STORAGE_PATH
from app.dto.image_dto import ImageUploadResponseDTO
from app.errors.exceptions import ImageNotFoundError

router = APIRouter(prefix="/images", tags=["images"])


def get_service(db: Session = Depends(get_db)) -> ImageService:
    return ImageService(db)


@router.post("/upload", response_model=ImageUploadResponseDTO, status_code=201)
async def upload(file: UploadFile = File(...), service: ImageService = Depends(get_service)):
    return await service.upload(file)


@router.post("/upload-base64", response_model=ImageUploadResponseDTO, status_code=201)
def upload_base64(payload: dict = Body(...), service: ImageService = Depends(get_service)):
    data = base64.b64decode(payload["data"])
    return service.upload_bytes(data, suffix=".jpg")


@router.get("/{image_id}", response_model=ImageUploadResponseDTO)
def get_image_info(image_id: int, service: ImageService = Depends(get_service)):
    return service.get(image_id)


@router.get("/file/{filename}")
def serve_file(filename: str):
    path = STORAGE_PATH / filename
    if not path.exists():
        raise ImageNotFoundError(0)
    return FileResponse(path)
