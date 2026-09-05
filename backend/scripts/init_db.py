from pathlib import Path

import psycopg

from app.core.config import get_settings


def main() -> None:
    database_url = get_settings().database_url
    if not database_url:
        raise SystemExit("DATABASE_URL is required")
    schema = Path(__file__).resolve().parents[1] / "sql" / "schema.sql"
    with psycopg.connect(database_url) as connection:
        connection.execute(schema.read_text(encoding="utf-8"))
    print("PostgreSQL schema initialized")


if __name__ == "__main__":
    main()