from sqlalchemy.orm import Session
from app.repositories.scan_repository import ScanRepository
from app.repositories.plant_repository import PlantRepository
from app.dto.scan_dto import CreateScanDTO, ScanResponseDTO
from app.errors.exceptions import ScanNotFoundError, PlantNotFoundError, UnauthorizedError


class ScanService:
    def __init__(self, db: Session):
        self.scan_repo = ScanRepository(db)
        self.plant_repo = PlantRepository(db)

    def create(self, user_id: int, data: CreateScanDTO) -> ScanResponseDTO:
        plant = self.plant_repo.find_by_id(data.plant_id)
        if not plant:
            raise PlantNotFoundError(data.plant_id)
        if plant.user_id != user_id:
            raise UnauthorizedError()

        scan_data = {
            "plant_id": data.plant_id,
            "plant_name": data.plant_name,
            "emoji": data.emoji,
            "image_url": data.image_url,
            "cnn_gradcam_url": data.cnn_gradcam_url,
            "eff_gradcam_url": data.eff_gradcam_url,
            "cnn_disease": data.cnn.disease,
            "cnn_severity": data.cnn.severity,
            "cnn_confidence": data.cnn.confidence,
            "eff_disease": data.efficient.disease,
            "eff_severity": data.efficient.severity,
            "eff_confidence": data.efficient.confidence,
            "disease": data.efficient.disease,
            "severity": data.efficient.severity,
            "confidence": data.efficient.confidence,
            "advice": data.advice,
        }

        scan = self.scan_repo.create(user_id, scan_data)

        severity_colors = {"Healthy": "#4CAF50", "Mild": "#FFC107", "Moderate": "#FF9800", "Severe": "#F44336"}
        status_color = severity_colors.get(scan.severity, "#9E9E9E")
        self.plant_repo.update_after_scan(data.plant_id, scan.disease, status_color)

        return ScanResponseDTO.from_orm_scan(scan)

    def get_all(self, user_id: int) -> list[ScanResponseDTO]:
        scans = self.scan_repo.find_all_by_user(user_id)
        return [ScanResponseDTO.from_orm_scan(s) for s in scans]

    def get_by_id(self, user_id: int, scan_id: int) -> ScanResponseDTO:
        scan = self.scan_repo.find_by_id(scan_id)
        if not scan:
            raise ScanNotFoundError(scan_id)
        if scan.user_id != user_id:
            raise UnauthorizedError()
        return ScanResponseDTO.from_orm_scan(scan)
