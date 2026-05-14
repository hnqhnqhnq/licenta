from sqlalchemy.orm import Session
from app.entities.scan import Scan


class ScanRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: int, data: dict) -> Scan:
        scan = Scan(user_id=user_id, **data)
        self.db.add(scan)
        self.db.commit()
        self.db.refresh(scan)
        return scan

    def find_all_by_user(self, user_id: int) -> list[Scan]:
        return self.db.query(Scan).filter(Scan.user_id == user_id).order_by(Scan.scanned_at.desc()).all()

    def find_by_id(self, scan_id: int) -> Scan | None:
        return self.db.query(Scan).filter(Scan.id == scan_id).first()
