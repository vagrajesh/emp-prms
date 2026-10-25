"""SQL queries."""

from decimal import Decimal

from db import get_connection

REVIEW_SELECT = """
    SELECT r.id, r.employee_id, e.employee_id AS employee_code, e.name AS employee_name,
           r.period_id, p.name AS period_name,
           r.quality_rating, r.delivery_rating, r.teamwork_rating,
           r.average_rating, r.comments, r.created_at
    FROM performance_reviews r
    JOIN employees e ON e.id = r.employee_id
    JOIN review_periods p ON p.id = r.period_id
"""


def fetch_employees() -> list[dict]:
    with get_connection() as conn:
        return conn.execute(
            """
            SELECT id, employee_id, name, department, email, status
            FROM employees
            ORDER BY id
            """
        ).fetchall()


def employee_exists(employee_id: int) -> bool:
    with get_connection() as conn:
        return conn.execute(
            "SELECT 1 FROM employees WHERE id = %s", (employee_id,)
        ).fetchone() is not None


def fetch_review_periods() -> list[dict]:
    with get_connection() as conn:
        return conn.execute(
            """
            SELECT id, name, start_date, end_date, status
            FROM review_periods
            ORDER BY start_date
            """
        ).fetchall()


def fetch_review_period(period_id: int) -> dict | None:
    with get_connection() as conn:
        return conn.execute(
            "SELECT id, name, start_date, end_date, status FROM review_periods WHERE id = %s",
            (period_id,),
        ).fetchone()


def fetch_reviews(employee_id: int | None = None, period_id: int | None = None) -> list[dict]:
    with get_connection() as conn:
        return conn.execute(
            REVIEW_SELECT
            + """
            WHERE (%(employee_id)s::int IS NULL OR r.employee_id = %(employee_id)s)
              AND (%(period_id)s::int IS NULL OR r.period_id = %(period_id)s)
            ORDER BY r.created_at DESC, r.id DESC
            """,
            {"employee_id": employee_id, "period_id": period_id},
        ).fetchall()


def fetch_review(review_id: int) -> dict | None:
    with get_connection() as conn:
        return conn.execute(REVIEW_SELECT + " WHERE r.id = %s", (review_id,)).fetchone()


def insert_review(
    employee_id: int,
    period_id: int,
    quality_rating: int,
    delivery_rating: int,
    teamwork_rating: int,
    average_rating: Decimal,
    comments: str,
) -> int | None:
    """Insert a review and return its id, or None if one already exists for this employee and period."""
    with get_connection() as conn:
        row = conn.execute(
            """
            INSERT INTO performance_reviews
                (employee_id, period_id, quality_rating, delivery_rating,
                 teamwork_rating, average_rating, comments)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (employee_id, period_id) DO NOTHING
            RETURNING id
            """,
            (employee_id, period_id, quality_rating, delivery_rating,
             teamwork_rating, average_rating, comments),
        ).fetchone()
        return row["id"] if row else None
