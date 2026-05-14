from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from app.database import engine, Base
from app.controllers.plant_controller import router as plant_router
from app.controllers.scan_controller import router as scan_router
from app.errors.handlers import validation_exception_handler, global_exception_handler

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Plant Service")

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

app.include_router(plant_router)
app.include_router(scan_router)


@app.get("/health")
def health():
    return {"status": "ok"}
