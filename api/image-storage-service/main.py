from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError

from app.database import Base, engine
from app.controllers.image_controller import router as image_router
from app.errors.handlers import validation_exception_handler, global_exception_handler

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Image Storage Service", version="1.0.0", redirect_slashes=False)

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

app.include_router(image_router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "image-storage-service"}
