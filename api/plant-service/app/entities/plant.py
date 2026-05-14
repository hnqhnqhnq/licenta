from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Plant(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    plant_type_id = Column(String(50), nullable=False)
    name = Column(String(100), nullable=False)
    emoji = Column(String(10), nullable=False)
    added_date = Column(DateTime(timezone=True), server_default=func.now())
    last_scan = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="Not scanned")
    status_color = Column(String(10), default="#9E9E9E")
