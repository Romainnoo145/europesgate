#!/usr/bin/env python3
"""
Re-index all documents in the knowledge base by uploading them through the API.
This rebuilds the ChromaDB vector index.
"""

import asyncio
import os
from pathlib import Path

import httpx


async def reindex_documents():
    """Upload all documents to rebuild the vector index."""
    api_url = "http://localhost:8006"
    docs_path = Path("./storage/documents")

    if not docs_path.exists():
        print(f"Error: Documents directory not found at {docs_path}")
        return

    # Get all document files (skip .meta.json files)
    doc_files = [
        f for f in docs_path.iterdir()
        if f.is_file() and not f.name.endswith('.meta.json')
    ]

    print(f"Found {len(doc_files)} documents to re-index")
    print("-" * 60)

    async with httpx.AsyncClient(timeout=60.0) as client:
        for doc_file in doc_files:
            print(f"Uploading: {doc_file.name}... ", end="", flush=True)

            try:
                with open(doc_file, 'rb') as f:
                    files = {'file': (doc_file.name, f, 'application/octet-stream')}

                    response = await client.post(
                        f"{api_url}/api/documents/upload",
                        files=files
                    )

                    if response.status_code == 200:
                        result = response.json()
                        print(f"✅ {result.get('status', 'success')} - {result.get('chunks', 0)} chunks")
                    else:
                        print(f"❌ Failed: {response.status_code}")

            except Exception as e:
                print(f"❌ Error: {e}")

    print("-" * 60)
    print("✅ Re-indexing complete!")


if __name__ == "__main__":
    asyncio.run(reindex_documents())
