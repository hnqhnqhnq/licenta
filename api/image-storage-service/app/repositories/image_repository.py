from sqlalchemy.orm import Session
from app.entities.image_record import ImageRecord


class ImageRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, filename: str, original_name: str, size_bytes: int) -> ImageRecord:
        record = ImageRecord(filename=filename, original_name=original_name, size_bytes=size_bytes)
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def find_by_id(self, image_id: int) -> ImageRecord | None:
        return self.db.query(ImageRecord).filter(ImageRecord.id == image_id).first()

    def find_by_filename(self, filename: str) -> ImageRecord | None:
        return self.db.query(ImageRecord).filter(ImageRecord.filename == filename).first()
