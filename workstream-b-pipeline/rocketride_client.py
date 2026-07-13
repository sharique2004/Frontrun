import argparse
import asyncio
import json
import os
from pathlib import Path
from typing import Any

from rocketride import RocketRideClient


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PIPELINE = ROOT / "pipeline.json"


async def run_rocketride(args: argparse.Namespace) -> dict[str, Any]:
    payload = {
        "domain": args.domain,
        "persist": args.persist,
        "includeFunds": args.include_funds,
    }
    payload = {key: value for key, value in payload.items() if value not in (None, False)}

    async with RocketRideClient(uri=args.uri) as client:
        result = await client.use(filepath=str(args.pipeline))
        token = result["token"]
        response = await client.send(token, json.dumps(payload))
        status = await client.get_task_status(token)

    return {
        "token": token,
        "state": status.get("state"),
        "status": status,
        "response": response,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the Frontrun Track B pipeline through RocketRide.")
    parser.add_argument("--uri", default=os.getenv("ROCKETRIDE_URI", "http://localhost:5565"))
    parser.add_argument("--pipeline", type=Path, default=DEFAULT_PIPELINE)
    parser.add_argument("--domain", help="Optional company domain for enrichment.")
    parser.add_argument("--persist", action="store_true", help="Persist via InsForge if configured.")
    parser.add_argument("--include-funds", action="store_true", help="Allow fund/LP Form D filings.")
    return parser.parse_args()


async def main() -> None:
    result = await run_rocketride(parse_args())
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
