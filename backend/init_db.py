"""Drop and recreate the tables, then load seed data. Wipes all existing data."""

from pathlib import Path

from db import check_connection, get_connection, pool

SQL_DIR = Path(__file__).resolve().parent.parent / "database"
SQL_FILES = ["schema.sql", "seed_employees.sql", "seed_review_periods.sql"]


def main():
    print("Connected:", check_connection())
    with get_connection() as conn:
        for name in SQL_FILES:
            conn.execute((SQL_DIR / name).read_text(encoding="utf-8"))
            print("Ran", name)
        for table in ["employees", "review_periods", "performance_reviews"]:
            count = conn.execute(f"SELECT COUNT(*) AS n FROM {table}").fetchone()["n"]
            print(f"{table}: {count} rows")


if __name__ == "__main__":
    try:
        main()
    finally:
        pool.close()
