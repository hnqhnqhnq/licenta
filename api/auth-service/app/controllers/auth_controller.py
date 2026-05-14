from fastapi import APIRouter, Depends, Request, Response
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.dto.register_dto import RegisterDTO
from app.dto.login_dto import LoginDTO
from app.dto.token_dto import TokenDTO, UserResponseDTO
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)


@router.post("/register", response_model=UserResponseDTO, status_code=201)
def register(data: RegisterDTO, service: AuthService = Depends(get_auth_service)):
    return service.register(data)


@router.post("/login", response_model=TokenDTO)
def login(data: LoginDTO, service: AuthService = Depends(get_auth_service)):
    return service.login(data.email, data.password)


@router.get("/me", response_model=UserResponseDTO)
def me(
    token: str = Depends(oauth2_scheme),
    service: AuthService = Depends(get_auth_service),
):
    return service.get_current_user(token)


@router.get("/validate")
def validate(request: Request, service: AuthService = Depends(get_auth_service)):
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return Response(status_code=401)
    token = auth_header[7:]
    try:
        user = service.get_current_user(token)
        return Response(status_code=200, headers={"X-User-Id": str(user.id)})
    except Exception:
        return Response(status_code=401)
