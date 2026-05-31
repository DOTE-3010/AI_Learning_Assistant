from __future__ import annotations

from typing import Any

from openai import APIConnectionError, AuthenticationError, OpenAI

from backend.core.model_settings import SettingsError


def test_openai_compatible_provider(profile: dict[str, Any], api_key: str) -> dict[str, Any]:
    client = OpenAI(api_key=api_key, base_url=profile["base_url"], timeout=5.0)
    try:
        client.models.list()
    except AuthenticationError as exc:
        raise SettingsError(
            502,
            "provider_auth_failed",
            "The model provider rejected the API key.",
        ) from exc
    except APIConnectionError as exc:
        raise SettingsError(
            502,
            "provider_unavailable",
            "The model provider is unreachable.",
        ) from exc
    except Exception as exc:
        raise SettingsError(
            502,
            "provider_unavailable",
            "The model provider test failed.",
        ) from exc
    return {"ok": True, "provider": profile["provider"], "model": profile["model"]}
