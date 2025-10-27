import logging
from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, HTTPException

from utils.token_tracker import token_tracker

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/usage", tags=["usage"])


@router.get("/credits")
async def get_credits_usage() -> dict[str, Any]:
    """
    Get OpenAI API usage and credit information.
    Returns real-time usage data tracked from actual API calls.
    """
    try:
        # Get stats from token tracker
        stats = token_tracker.get_stats()

        # Calculate usage percentage (assuming 100k token limit for display)
        # Adjust this based on your actual OpenAI plan
        total_limit = 100000
        used_tokens = stats["total_tokens"]
        usage_percentage = min(100.0, (used_tokens / total_limit) * 100)

        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)

        return {
            "total_credits": total_limit,
            "used_credits": used_tokens,
            "usage_percentage": round(usage_percentage, 2),
            "total_cost_eur": stats["total_cost_eur"],
            "daily_usage": stats["daily_usage"],
            "current_period": {
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "total_requests": stats["total_requests"],
                "total_tokens": stats["total_tokens"],
                "total_cost_eur": stats["total_cost_eur"],
            },
            "status": "active",
            "last_updated": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"Failed to fetch usage data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch usage data: {str(e)}")
