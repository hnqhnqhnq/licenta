from pydantic import BaseModel
from datetime import datetime


class ModelResultDTO(BaseModel):
    disease: str
    severity: str
    confidence: float


class CreateScanDTO(BaseModel):
    plant_id: int
    plant_name: str
    emoji: str
    image_url: str | None = None
    cnn_gradcam_url: str | None = None
    eff_gradcam_url: str | None = None
    cnn: ModelResultDTO
    efficient: ModelResultDTO
    advice: str | None = None


class ScanResponseDTO(BaseModel):
    id: int
    user_id: int
    plant_id: int
    plant_name: str
    emoji: str
    image_url: str | None
    cnn_gradcam_url: str | None
    eff_gradcam_url: str | None
    cnn: ModelResultDTO
    efficient: ModelResultDTO
    disease: str
    severity: str
    confidence: float
    advice: str | None
    scanned_at: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_scan(cls, scan):
        return cls(
            id=scan.id,
            user_id=scan.user_id,
            plant_id=scan.plant_id,
            plant_name=scan.plant_name,
            emoji=scan.emoji,
            image_url=scan.image_url,
            cnn_gradcam_url=scan.cnn_gradcam_url,
            eff_gradcam_url=scan.eff_gradcam_url,
            cnn=ModelResultDTO(disease=scan.cnn_disease, severity=scan.cnn_severity, confidence=scan.cnn_confidence),
            efficient=ModelResultDTO(disease=scan.eff_disease, severity=scan.eff_severity, confidence=scan.eff_confidence),
            disease=scan.disease,
            severity=scan.severity,
            confidence=scan.confidence,
            advice=scan.advice,
            scanned_at=scan.scanned_at,
        )
