from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id", ondelete="CASCADE"), nullable=False)
    plant_name = Column(String(100), nullable=False)
    emoji = Column(String(10), nullable=False)
    image_url = Column(String(500), nullable=True)
    cnn_gradcam_url = Column(String(500), nullable=True)
    eff_gradcam_url = Column(String(500), nullable=True)

    # CNN result
    cnn_disease = Column(String(100), nullable=False)
    cnn_severity = Column(String(20), nullable=False)
    cnn_confidence = Column(Float, nullable=False)

    # EfficientNet result
    eff_disease = Column(String(100), nullable=False)
    eff_severity = Column(String(20), nullable=False)
    eff_confidence = Column(Float, nullable=False)

    # Final (EfficientNet wins)
    disease = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False)
    confidence = Column(Float, nullable=False)

    advice = Column(String(2000), nullable=True)

    scanned_at = Column(DateTime(timezone=True), server_default=func.now())
