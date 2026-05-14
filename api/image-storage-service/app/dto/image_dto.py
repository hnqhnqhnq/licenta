from pydantic import BaseModel
from datetime import datetime


class ImageUploadResponseDTO(BaseModel):
    id: int
    filename: str
    url: str
    size_bytes: int
    created_at: datetime

    model_config = {"from_attributes": True}
