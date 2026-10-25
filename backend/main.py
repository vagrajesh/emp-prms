"""API routes. Run with: uvicorn main:app --reload --port 8000"""

from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import service
from db import pool
from model import Employee, ErrorResponse, Review, ReviewCreate, ReviewPeriod


@asynccontextmanager
async def lifespan(app: FastAPI):
    pool.open()
    yield
    pool.close()


app = FastAPI(title="Employee Performance Review API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(service.ServiceError)
def handle_service_error(request: Request, exc: service.ServiceError):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(code=exc.code, message=exc.message).model_dump(),
    )


router = APIRouter(prefix="/api")


@router.get("/employees", response_model=list[Employee])
def get_employees():
    return service.list_employees()


@router.get("/review-periods", response_model=list[ReviewPeriod])
def get_review_periods():
    return service.list_review_periods()


@router.get("/reviews", response_model=list[Review])
def get_reviews(employee_id: int | None = None, period_id: int | None = None):
    return service.list_reviews(employee_id, period_id)


@router.get(
    "/reviews/{employee_id}",
    response_model=list[Review],
    responses={404: {"model": ErrorResponse}},
)
def get_reviews_for_employee(employee_id: int):
    return service.list_reviews_for_employee(employee_id)


@router.post(
    "/reviews",
    response_model=Review,
    status_code=201,
    responses={
        400: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
        409: {"model": ErrorResponse},
    },
)
def create_review(body: ReviewCreate):
    return service.create_review(body)


app.include_router(router)
