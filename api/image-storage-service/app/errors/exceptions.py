from fastapi import HTTPException, status


class ImageNotFoundError(HTTPException):
    def __init__(self, image_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Image with id {image_id} not found",
        )


class InvalidImageFormatError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only JPEG, PNG and WEBP are allowed.",
        )


class FileTooLargeError(HTTPException):
    def __init__(self, max_mb: int = 10):
        super().__init__(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size is {max_mb}MB.",
        )
