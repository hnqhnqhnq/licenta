from fastapi import HTTPException, status


class PlantNotFoundError(HTTPException):
    def __init__(self, plant_id: int):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=f"Plant with id {plant_id} not found")


class ScanNotFoundError(HTTPException):
    def __init__(self, scan_id: int):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=f"Scan with id {scan_id} not found")


class UnauthorizedError(HTTPException):
    def __init__(self):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have access to this resource")
