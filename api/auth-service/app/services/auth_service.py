from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
import os

from app.repositories.user_repository import UserRepository
from app.entities.user import User
from app.dto.register_dto import RegisterDTO
from app.dto.token_dto import TokenDTO, UserResponseDTO
from app.errors.exceptions import (
    UserAlreadyExistsError,
    InvalidCredentialsError,
    UserNotFoundError,
    InvalidTokenError,
)

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "licenta")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def register(self, data: RegisterDTO) -> UserResponseDTO:
        if self.repo.find_by_email(data.email):
            raise UserAlreadyExistsError(data.email)

        hashed = pwd_context.hash(data.password)
        user = self.repo.create(
            first_name=data.first_name,
            last_name=data.last_name,
            email=data.email,
            hashed_password=hashed,
        )
        return UserResponseDTO.model_validate(user)

    def login(self, email: str, password: str) -> TokenDTO:
        user = self.repo.find_by_email(email)
        if not user or not pwd_context.verify(password, user.hashed_password):
            raise InvalidCredentialsError()

        token = self._create_token({"sub": str(user.id)})
        return TokenDTO(access_token=token)

    def get_current_user(self, token: str) -> UserResponseDTO:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = int(payload.get("sub"))
        except (JWTError, TypeError, ValueError):
            raise InvalidTokenError()

        user = self.repo.find_by_id(user_id)
        if not user:
            raise UserNotFoundError(user_id)

        return UserResponseDTO.model_validate(user)

    def _create_token(self, data: dict) -> str:
        payload = data.copy()
        payload["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
