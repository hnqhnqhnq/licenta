from sqlalchemy.orm import Session
from app.repositories.plant_repository import PlantRepository
from app.dto.plant_dto import CreatePlantDTO, UpdatePlantDTO, PlantResponseDTO
from app.errors.exceptions import PlantNotFoundError, UnauthorizedError


class PlantService:
    def __init__(self, db: Session):
        self.repo = PlantRepository(db)

    def create(self, user_id: int, data: CreatePlantDTO) -> PlantResponseDTO:
        plant = self.repo.create(user_id, data.plant_type_id, data.name, data.emoji)
        return PlantResponseDTO.model_validate(plant)

    def get_all(self, user_id: int) -> list[PlantResponseDTO]:
        plants = self.repo.find_all_by_user(user_id)
        return [PlantResponseDTO.model_validate(p) for p in plants]

    def update(self, user_id: int, plant_id: int, data: UpdatePlantDTO) -> PlantResponseDTO:
        plant = self.repo.find_by_id(plant_id)
        if not plant:
            raise PlantNotFoundError(plant_id)
        if plant.user_id != user_id:
            raise UnauthorizedError()
        plant = self.repo.update(plant, data.name)
        return PlantResponseDTO.model_validate(plant)

    def delete(self, user_id: int, plant_id: int) -> None:
        plant = self.repo.find_by_id(plant_id)
        if not plant:
            raise PlantNotFoundError(plant_id)
        if plant.user_id != user_id:
            raise UnauthorizedError()
        self.repo.delete(plant)
