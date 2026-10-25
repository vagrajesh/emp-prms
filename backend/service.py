"""Business rules."""

from decimal import ROUND_HALF_UP, Decimal

import repository
from model import Employee, Review, ReviewCreate, ReviewPeriod


class ServiceError(Exception):
    def __init__(self, status_code: int, code: str, message: str):
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message


def list_employees() -> list[Employee]:
    return [Employee(**row) for row in repository.fetch_employees()]


def list_review_periods() -> list[ReviewPeriod]:
    return [ReviewPeriod(**row) for row in repository.fetch_review_periods()]


def list_reviews(employee_id: int | None = None, period_id: int | None = None) -> list[Review]:
    return [Review(**row) for row in repository.fetch_reviews(employee_id, period_id)]


def list_reviews_for_employee(employee_id: int) -> list[Review]:
    if not repository.employee_exists(employee_id):
        raise ServiceError(404, "EMPLOYEE_NOT_FOUND", f"Employee with id {employee_id} was not found.")
    return list_reviews(employee_id=employee_id)


def calculate_average(quality: int, delivery: int, teamwork: int) -> Decimal:
    return (Decimal(quality + delivery + teamwork) / 3).quantize(Decimal("0.01"), ROUND_HALF_UP)


def create_review(data: ReviewCreate) -> Review:
    if not repository.employee_exists(data.employee_id):
        raise ServiceError(404, "EMPLOYEE_NOT_FOUND", f"Employee with id {data.employee_id} was not found.")

    period = repository.fetch_review_period(data.period_id)
    if period is None:
        raise ServiceError(404, "REVIEW_PERIOD_NOT_FOUND", f"Review period with id {data.period_id} was not found.")
    if period["status"] != "Open":
        raise ServiceError(400, "REVIEW_PERIOD_CLOSED", "Only Open review periods accept new reviews.")

    review_id = repository.insert_review(
        data.employee_id,
        data.period_id,
        data.quality_rating,
        data.delivery_rating,
        data.teamwork_rating,
        calculate_average(data.quality_rating, data.delivery_rating, data.teamwork_rating),
        data.comments,
    )
    if review_id is None:
        raise ServiceError(409, "DUPLICATE_REVIEW", "A review already exists for this employee and period.")

    return Review(**repository.fetch_review(review_id))
