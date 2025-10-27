"""Simple persistent token usage tracker with JSON storage."""
import json
import logging
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

# OpenAI Pricing (as of December 2024) in USD per 1M tokens
PRICING = {
    "gpt-4o": {"input": 2.50, "output": 10.00},
    "gpt-4o-mini": {"input": 0.15, "output": 0.60},
    "gpt-4-turbo": {"input": 10.00, "output": 30.00},
    "gpt-3.5-turbo": {"input": 0.50, "output": 1.50},
}

# USD to EUR conversion rate (update periodically)
USD_TO_EUR = 0.92


class TokenTracker:
    """Track token usage with JSON persistence and cost calculation."""

    def __init__(self, storage_path: str = "./storage/token_usage.json") -> None:
        """Initialize the tracker."""
        self.storage_path = Path(storage_path)
        # Store daily usage: {date_str: {tokens: int, requests: int, cost: float}}
        self.daily_usage: dict[str, dict[str, float]] = defaultdict(
            lambda: {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0, "requests": 0, "cost_eur": 0.0}
        )
        self.total_prompt_tokens = 0
        self.total_completion_tokens = 0
        self.total_tokens = 0
        self.total_requests = 0
        self.total_cost_eur = 0.0

        # Load existing data
        self._load()

    def _load(self) -> None:
        """Load usage data from JSON file."""
        try:
            if self.storage_path.exists():
                with open(self.storage_path) as f:
                    data = json.load(f)
                    self.daily_usage = defaultdict(
                        lambda: {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0, "requests": 0, "cost_eur": 0.0},
                        data.get("daily_usage", {})
                    )
                    self.total_prompt_tokens = data.get("total_prompt_tokens", 0)
                    self.total_completion_tokens = data.get("total_completion_tokens", 0)
                    self.total_tokens = data.get("total_tokens", 0)
                    self.total_requests = data.get("total_requests", 0)
                    self.total_cost_eur = data.get("total_cost_eur", 0.0)
                    logger.info(f"Loaded token usage: {self.total_tokens} tokens, €{self.total_cost_eur:.2f}, {self.total_requests} requests")
        except Exception as e:
            logger.warning(f"Failed to load token usage data: {e}")

    def _save(self) -> None:
        """Save usage data to JSON file."""
        try:
            self.storage_path.parent.mkdir(parents=True, exist_ok=True)
            with open(self.storage_path, 'w') as f:
                json.dump({
                    "daily_usage": dict(self.daily_usage),
                    "total_prompt_tokens": self.total_prompt_tokens,
                    "total_completion_tokens": self.total_completion_tokens,
                    "total_tokens": self.total_tokens,
                    "total_requests": self.total_requests,
                    "total_cost_eur": round(self.total_cost_eur, 2),
                    "last_updated": datetime.now().isoformat()
                }, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save token usage data: {e}")

    def calculate_cost(self, prompt_tokens: int, completion_tokens: int, model: str = "gpt-4o") -> float:
        """Calculate cost in EUR for given token usage."""
        if model not in PRICING:
            logger.warning(f"Unknown model {model}, using gpt-4o pricing")
            model = "gpt-4o"

        pricing = PRICING[model]
        cost_usd = (prompt_tokens * pricing["input"] / 1_000_000) + (completion_tokens * pricing["output"] / 1_000_000)
        cost_eur = cost_usd * USD_TO_EUR
        return cost_eur

    def add_usage(self, prompt_tokens: int, completion_tokens: int, model: str = "gpt-4o") -> None:
        """Add token usage for today with cost calculation."""
        total_tokens = prompt_tokens + completion_tokens
        cost_eur = self.calculate_cost(prompt_tokens, completion_tokens, model)

        today = datetime.now().strftime("%Y-%m-%d")
        self.daily_usage[today]["prompt_tokens"] += prompt_tokens
        self.daily_usage[today]["completion_tokens"] += completion_tokens
        self.daily_usage[today]["total_tokens"] += total_tokens
        self.daily_usage[today]["requests"] += 1
        self.daily_usage[today]["cost_eur"] += cost_eur

        self.total_prompt_tokens += prompt_tokens
        self.total_completion_tokens += completion_tokens
        self.total_tokens += total_tokens
        self.total_requests += 1
        self.total_cost_eur += cost_eur

        # Save after each update
        self._save()

        logger.info(f"💰 Token usage: +{total_tokens} tokens (€{cost_eur:.4f}) | Total: {self.total_tokens} tokens, €{self.total_cost_eur:.2f}")

    def get_last_7_days(self) -> list[dict[str, Any]]:
        """Get usage for the last 7 days."""
        result = []
        for i in range(6, -1, -1):  # 6 days ago to today
            date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
            usage = self.daily_usage.get(date, {"total_tokens": 0, "requests": 0, "cost_eur": 0.0})
            result.append({
                "day": i,
                "date": date,
                "tokens": usage.get("total_tokens", 0),
                "requests": usage.get("requests", 0),
                "cost_eur": usage.get("cost_eur", 0.0)
            })
        return result

    def get_stats(self) -> dict[str, Any]:
        """Get current usage statistics."""
        return {
            "total_prompt_tokens": self.total_prompt_tokens,
            "total_completion_tokens": self.total_completion_tokens,
            "total_tokens": self.total_tokens,
            "total_requests": self.total_requests,
            "total_cost_eur": round(self.total_cost_eur, 2),
            "daily_usage": self.get_last_7_days()
        }

    def reset(self) -> None:
        """Reset all usage data (for testing or new billing period)."""
        self.daily_usage.clear()
        self.total_prompt_tokens = 0
        self.total_completion_tokens = 0
        self.total_tokens = 0
        self.total_requests = 0
        self.total_cost_eur = 0.0
        self._save()
        logger.info("Token usage data reset")


# Global tracker instance
token_tracker = TokenTracker()
