from fastapi import Depends, HTTPException, status, Request
from app.database.manager import DatabaseManager


def get_current_user(
    request: Request,
    db=Depends(DatabaseManager.get_db)
):
    """
    Authenticate user via cookie (dev/proxy) or X-User-Email header (production cross-origin).
    """
    email = request.cookies.get("user_email") or request.headers.get("X-User-Email")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    user = DatabaseManager.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")

    return user
