import asyncio
import os

import httpx
import pytest

os.environ.setdefault("TESTING", "1")

from backend.main import app


class ASGISyncClient:
    def __init__(self, asgi_app, base_url: str = "http://testserver"):
        self.asgi_app = asgi_app
        self.base_url = base_url

    def __enter__(self):
        return self

    def __exit__(self, _exc_type, _exc, _tb):
        return None

    def get(self, url: str, **kwargs):
        return self.request("GET", url, **kwargs)

    def post(self, url: str, **kwargs):
        return self.request("POST", url, **kwargs)

    def put(self, url: str, **kwargs):
        return self.request("PUT", url, **kwargs)

    def patch(self, url: str, **kwargs):
        return self.request("PATCH", url, **kwargs)

    def request(self, method: str, url: str, **kwargs):
        return asyncio.run(self._request(method, url, **kwargs))

    async def _request(self, method: str, url: str, **kwargs):
        transport = httpx.ASGITransport(app=self.asgi_app)
        async with httpx.AsyncClient(
            transport=transport,
            base_url=self.base_url,
        ) as async_client:
            response = await async_client.request(method, url, **kwargs)
            await response.aread()
            return response


@pytest.fixture(scope="function")
def client():
    with ASGISyncClient(app) as c:
        yield c
    app.dependency_overrides.clear()
