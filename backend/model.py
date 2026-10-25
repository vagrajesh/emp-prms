"""Request/response models."""

from datetime import date, datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


class Employee(BaseModel):
    id: int
    employee_id: str
    name: str
    department: Optional[str] = None
    email: Optional[str] = None
    status: Optional[str] = None


class ReviewPeriod(BaseModel):
    id: int
    name: str
    start_date: date
    end_date: date
    status: Optional[str] = None


class ReviewCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    employee_id: int = Field(ge=1)
    period_id: int = Field(ge=1)
    quality_rating: int = Field(ge=1, le=5)
    delivery_rating: int = Field(ge=1, le=5)
    teamwork_rating: int = Field(ge=1, le=5)
    comments: str = Field(min_length=1, pattern=r"\S")


class Review(BaseModel):
    id: int
    employee_id: int
    employee_code: str
    employee_name: str
    period_id: int
    period_name: str
    quality_rating: int
    delivery_rating: int
    teamwork_rating: int
    average_rating: float
    comments: str
    status: Literal["Completed"] = "Completed"
    created_at: datetime


class ErrorResponse(BaseModel):
    code: str
    message: str
