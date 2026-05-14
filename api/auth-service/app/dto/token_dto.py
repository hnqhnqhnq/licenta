from pydantic import BaseModel


class TokenDTO(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponseDTO(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str

    model_config = {"from_attributes": True}
