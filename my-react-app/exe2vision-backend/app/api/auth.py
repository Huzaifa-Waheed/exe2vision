from fastapi import APIRouter, Depends, Response, Request, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.auth import RegisterSchema, LoginSchema, ResetPasswordSchema
from app.services.account_manager import AccountManager
from app.database.manager import DatabaseManager
from app.core.security import hash_password

ADMIN_EMAIL = "admin@admin.com"
ADMIN_PASSWORD = "Admin@123"
ADMIN_NAME = "admin"

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register(
    data: RegisterSchema,
    response: Response,
    db: Session = Depends(DatabaseManager.get_db)
):
    user = AccountManager.register_user(db, data)
    # Auto-login the user by setting a session cookie
    response.set_cookie(key="user_email", value=user.email, httponly=True, samesite="lax")
    return {
        "message": "User registered successfully",
        "user": user.to_dict()
    }

@router.post("/login")
def login(
    data: LoginSchema,
    response: Response,
    db: Session = Depends(DatabaseManager.get_db)
):
    user = AccountManager.login_user(db, data.email, data.password)
    # Set a simple session cookie to indicate authentication on subsequent requests
    response.set_cookie(key="user_email", value=user.email, httponly=True, samesite="lax")
    return {
        "message": "Login successful",
        "user": user.to_dict()
    }

@router.post("/logout")
def logout(
    response: Response
):
    response.delete_cookie("user_email")
    return {"message": "Logged out"}


@router.get("/me")
def get_me(
    request: Request,
    db: Session = Depends(DatabaseManager.get_db)
):
    email = request.cookies.get("user_email") or request.headers.get("X-User-Email")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    user = DatabaseManager.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")
    return {"user": user.to_dict()}

@router.post("/request-reset")
def request_password_reset(
    data: dict,
    db: Session = Depends(DatabaseManager.get_db)
):
    # expected body: {"email": "user@example.com"}
    email = data.get("email")
    if not email:
        return {"message": "Email is required"}
    AccountManager.send_otp(db, email)
    return {"message": "OTP sent if email exists"}

@router.post("/reset-password")
def reset_password(
    data: ResetPasswordSchema,
    db: Session = Depends(DatabaseManager.get_db)
):
    AccountManager.reset_password(db, data.email, data.otp_code, data.new_password)
    return {"message": "Password has been reset. Please login."}


@router.post("/ensure-admin")
def ensure_admin(
    response: Response,
    db: Session = Depends(DatabaseManager.get_db)
):
    """Seed admin account if it doesn't exist, then log in as admin."""
    user = DatabaseManager.get_user_by_email(db, ADMIN_EMAIL)
    if not user:
        user = DatabaseManager.create_user(
            db=db,
            name=ADMIN_NAME,
            email=ADMIN_EMAIL,
            password_hash=hash_password(ADMIN_PASSWORD),
            role="admin"
        )
    response.set_cookie(key="user_email", value=user.email, httponly=True, samesite="lax")
    return {"message": "Admin ready", "user": user.to_dict()} 
