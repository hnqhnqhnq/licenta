from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.plant_service import PlantService
from app.dto.plant_dto import CreatePlantDTO, UpdatePlantDTO, PlantResponseDTO

router = APIRouter(prefix="/plants", tags=["plants"])


def get_user_id(x_user_id: int = Header(...)) -> int:
    return x_user_id


@router.post("", response_model=PlantResponseDTO, status_code=201)
def create_plant(data: CreatePlantDTO, user_id: int = Depends(get_user_id), db: Session = Depends(get_db)):
    return PlantService(db).create(user_id, data)


@router.get("", response_model=list[PlantResponseDTO])
def get_plants(user_id: int = Depends(get_user_id), db: Session = Depends(get_db)):
    return PlantService(db).get_all(user_id)


@router.put("/{plant_id}", response_model=PlantResponseDTO)
def update_plant(plant_id: int, data: UpdatePlantDTO, user_id: int = Depends(get_user_id), db: Session = Depends(get_db)):
    return PlantService(db).update(user_id, plant_id, data)


@router.delete("/{plant_id}", status_code=204)
def delete_plant(plant_id: int, user_id: int = Depends(get_user_id), db: Session = Depends(get_db)):
    PlantService(db).delete(user_id, plant_id)
