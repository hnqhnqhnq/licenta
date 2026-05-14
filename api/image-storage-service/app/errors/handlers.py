from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [{"field": ".".join(str(l) for l in e["loc"] if l != "body"), "message": e["msg"]} for e in exc.errors()]
    return JSONResponse(status_code=422, content={"error": "ValidationError", "details": errors})


async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"error": "InternalServerError", "message": "An unexpected error occurred"})
