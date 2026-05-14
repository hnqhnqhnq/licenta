from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.entities.plant import Plant


class PlantRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: int, plant_type_id: str, name: str, emoji: str) -> Plant:
        plant = Plant(user_id=user_id, plant_type_id=plant_type_id, name=name, emoji=emoji)
        self.db.add(plant)
        self.db.commit()
        self.db.refresh(plant)
        return plant

    def find_all_by_user(self, user_id: int) -> list[Plant]:
        return self.db.query(Plant).filter(Plant.user_id == user_id).all()

    def find_by_id(self, plant_id: int) -> Plant | None:
        return self.db.query(Plant).filter(Plant.id == plant_id).first()

    def update_after_scan(self, plant_id: int, status: str, status_color: str) -> Plant:
        plant = self.find_by_id(plant_id)
        plant.status = status
        plant.status_color = status_color
        plant.last_scan = func.now()
        self.db.commit()
        self.db.refresh(plant)
        return plant

    def update(self, plant: Plant, name: str) -> Plant:
        plant.name = name
        self.db.commit()
        self.db.refresh(plant)
        return plant

    def delete(self, plant: Plant) -> None:
        self.db.delete(plant)
        self.db.commit()
