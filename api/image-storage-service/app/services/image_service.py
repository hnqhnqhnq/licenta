import os
import uuid
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.repositories.image_repository import ImageRepository
from app.dto.image_dto import ImageUploadResponseDTO
from app.errors.exceptions import ImageNotFoundError, InvalidImageFormatError, FileTooLargeError

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE_BYTES = 10 * 1024 * 1024  # 10MB
STORAGE_PATH = Path(os.getenv("STORAGE_PATH", "/data/images"))
BASE_URL = os.getenv("BASE_URL", "http://localhost")


class ImageService:
    def __init__(self, db: Session):
        self.repo = ImageRepository(db)

    async def upload(self, file: UploadFile) -> ImageUploadResponseDTO:
        if file.content_type not in ALLOWED_TYPES:
            raise InvalidImageFormatError()

        contents = await file.read()
        if len(contents) > MAX_SIZE_BYTES:
            raise FileTooLargeError()

        ext = Path(file.filename).suffix or ".jpg"
        filename = f"{uuid.uuid4().hex}{ext}"

        STORAGE_PATH.mkdir(parents=True, exist_ok=True)
        (STORAGE_PATH / filename).write_bytes(contents)

        record = self.repo.create(
            filename=filename,
            original_name=file.filename,
            size_bytes=len(contents),
        )

        return ImageUploadResponseDTO(
            id=record.id,
            filename=record.filename,
            url=f"{BASE_URL}/images/file/{filename}",
            size_bytes=record.size_bytes,
            created_at=record.created_at,
        )

    def upload_bytes(self, data: bytes, suffix: str = ".jpg") -> ImageUploadResponseDTO:
        filename = f"{uuid.uuid4().hex}{suffix}"
        STORAGE_PATH.mkdir(parents=True, exist_ok=True)
        (STORAGE_PATH / filename).write_bytes(data)
        record = self.repo.create(
            filename=filename,
            original_name=filename,
            size_bytes=len(data),
        )
        return ImageUploadResponseDTO(
            id=record.id,
            filename=record.filename,
            url=f"{BASE_URL}/images/file/{filename}",
            size_bytes=record.size_bytes,
            created_at=record.created_at,
        )

    def get(self, image_id: int) -> ImageUploadResponseDTO:
        record = self.repo.find_by_id(image_id)
        if not record:
            raise ImageNotFoundError(image_id)
        return ImageUploadResponseDTO(
            id=record.id,
            filename=record.filename,
            url=f"{BASE_URL}/images/{record.filename}",
            size_bytes=record.size_bytes,
            created_at=record.created_at,
        )
