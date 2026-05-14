from pydantic import BaseModel
from datetime import datetime


class CreatePlantDTO(BaseModel):
    plant_type_id: str
    name: str
    emoji: str


class UpdatePlantDTO(BaseModel):
    name: str


class PlantResponseDTO(BaseModel):
    id: int
    user_id: int
    plant_type_id: str
    name: str
    emoji: str
    added_date: datetime
    last_scan: datetime | None
    status: str
    status_color: str

    model_config = {"from_attributes": True}
