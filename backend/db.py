"""PostgreSQL connection helpers. Reads DATABASE_URL from the project's .env file."""

import os
from contextlib import contextmanager
from pathlib import Path

import psycopg
from dotenv import load_dotenv
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set in .env")

pool = ConnectionPool(
    DATABASE_URL,
    min_size=1,
    max_size=10,
    kwargs={"row_factory": dict_row},
    open=False,
)


@contextmanager
def get_connection():
    """Yield a pooled connection. Commits on success, rolls back on error."""
    if pool.closed:
        pool.open()
    with pool.connection() as conn:
        yield conn


def check_connection() -> str:
    with get_connection() as conn:
        return conn.execute("SELECT version() AS version").fetchone()["version"]
