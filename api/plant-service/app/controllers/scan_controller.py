from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.scan_service import ScanService
from app.dto.scan_dto import CreateScanDTO, ScanResponseDTO

router = APIRouter(prefix="/scans", tags=["scans"])


def get_user_id(x_user_id: int = Header(...)) -> int:
    return x_user_id


@router.post("", response_model=ScanResponseDTO, status_code=201)
def create_scan(data: CreateScanDTO, user_id: int = Depends(get_user_id), db: Session = Depends(get_db)):
    return ScanService(db).create(user_id, data)


@router.get("", response_model=list[ScanResponseDTO])
def get_scans(user_id: int = Depends(get_user_id), db: Session = Depends(get_db)):
    return ScanService(db).get_all(user_id)


@router.get("/{scan_id}", response_model=ScanResponseDTO)
def get_scan(scan_id: int, user_id: int = Depends(get_user_id), db: Session = Depends(get_db)):
    return ScanService(db).get_by_id(user_id, scan_id)
