from fastapi import APIRouter

router = APIRouter()


@router.get("/guests")
def list_guests():
    return {"guests": []}
