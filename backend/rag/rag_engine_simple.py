import json
import logging
import os
from collections.abc import AsyncIterator
from pathlib import Path
from typing import Any

import chromadb
from chromadb.utils import embedding_functions
from openai import AsyncOpenAI
from pypdf import PdfReader
from docx import Document

from .config import settings

logger = logging.getLogger(__name__)


class QueenRAGEngine:
    """
    Simplified RAG engine using ChromaDB directly with OpenAI embeddings.
    """

    def __init__(self) -> None:
        # Debug: Check all OpenAI-related env vars
        import sys
        logger.info(f"All env vars containing 'OPENAI': {[k for k in os.environ.keys() if 'OPENAI' in k]}")
        logger.info(f"Raw OPENAI_API_KEY from environ: {repr(os.environ.get('OPENAI_API_KEY'))}")

        # Get API key directly from environment or settings
        # TEMP FIX: Railway has variable with trailing space
        api_key = os.getenv("OPENAI_API_KEY ") or os.getenv("OPENAI_API_KEY") or settings.openai_api_key

        # Strip whitespace if present
        if api_key:
            api_key = api_key.strip()

        # Debug: Log what we got
        logger.info(f"API Key from os.getenv: {os.getenv('OPENAI_API_KEY')[:20] if os.getenv('OPENAI_API_KEY') else 'None'}")
        logger.info(f"API Key from settings: {settings.openai_api_key[:20] if settings.openai_api_key else 'Empty'}")
        logger.info(f"Final API key: {api_key[:20] if api_key else 'None/Empty'}")

        # Initialize OpenAI client
        self.openai_client = AsyncOpenAI(api_key=api_key)

        # Initialize ChromaDB with OpenAI embeddings
        self.chroma_client = chromadb.PersistentClient(
            path=settings.chroma_persist_directory
        )

        # Create embedding function
        self.embedding_function = embedding_functions.OpenAIEmbeddingFunction(  # type: ignore[attr-defined]
            api_key=api_key,
            model_name=settings.openai_embedding_model
        )

        # Collection will be initialized in async initialize()
        self.collection: chromadb.Collection | None = None

        # Track loaded documents
        self.loaded_documents: set[str] = set()

        logger.info("QueenRAGEngine initialized")

    async def initialize(self) -> None:
        """
        Async initialization of the RAG engine.
        """
        try:
            # Get or create collection
            self.collection = self.chroma_client.get_or_create_collection(
                name=settings.chroma_collection_name,
                embedding_function=self.embedding_function
            )

            # Load metadata of existing documents
            await self._load_document_metadata()

            logger.info(f"RAG engine initialized with {len(self.loaded_documents)} documents")

        except Exception as e:
            logger.error(f"Failed to initialize RAG engine: {e}")
            raise

    async def _load_document_metadata(self) -> None:
        """
        Load metadata about existing documents and process them into ChromaDB if needed.
        This enables pre-loaded documents in Docker images to work automatically.
        """
        doc_path = Path(settings.upload_directory)
        if not doc_path.exists():
            logger.info("No documents directory found, skipping auto-load")
            return

        # Get all documents currently in ChromaDB
        if self.collection is None:
            logger.warning("Collection not initialized, cannot load documents")
            return

        # Get existing document IDs from ChromaDB
        try:
            all_items = self.collection.get()
            existing_docs = set()
            if all_items['metadatas']:
                for metadata in all_items['metadatas']:
                    if isinstance(metadata, dict) and 'filename' in metadata:
                        existing_docs.add(metadata['filename'])
        except Exception as e:
            logger.warning(f"Could not retrieve existing documents from ChromaDB: {e}")
            existing_docs = set()

        # Process all documents in the directory
        processed_count = 0
        skipped_count = 0

        for file_path in doc_path.iterdir():
            if not file_path.is_file() or file_path.name.endswith('.meta.json'):
                continue

            filename = file_path.name

            # Check if already in ChromaDB
            if filename in existing_docs:
                self.loaded_documents.add(filename)
                skipped_count += 1
                continue

            # Load document into ChromaDB
            try:
                logger.info(f"Auto-loading document: {filename}")

                # Load metadata if exists
                metadata = None
                metadata_path = file_path.with_suffix('.meta.json')
                if metadata_path.exists():
                    with open(metadata_path) as f:
                        metadata = json.load(f)

                # Add document to RAG (this will chunk, embed, and store it)
                result = await self.add_document(str(file_path), metadata)

                if result.get('status') == 'success':
                    processed_count += 1
                    logger.info(f"Successfully auto-loaded: {filename}")
                else:
                    logger.warning(f"Failed to auto-load {filename}: {result.get('message')}")

            except Exception as e:
                logger.error(f"Error auto-loading {filename}: {e}")

        logger.info(f"Auto-load complete: {processed_count} documents processed, {skipped_count} already existed")

    def _extract_content(self, file_path: str) -> str:
        """
        Extract content from various file formats.
        Supports: PDF, DOCX, TXT, MD, and other text files.
        """
        file_path_obj = Path(file_path)
        suffix = file_path_obj.suffix.lower()

        try:
            if suffix == '.pdf':
                # Extract text from PDF
                content = []
                reader = PdfReader(file_path)
                for page in reader.pages:
                    content.append(page.extract_text())
                return '\n'.join(content)

            elif suffix == '.docx':
                # Extract text from DOCX
                doc = Document(file_path)
                content = []
                for para in doc.paragraphs:
                    content.append(para.text)
                return '\n'.join(content)

            else:
                # Treat as text file (MD, TXT, etc.)
                with open(file_path, encoding='utf-8') as f:
                    return f.read()

        except UnicodeDecodeError:
            # If UTF-8 fails, try with latin-1 encoding
            logger.warning(f"UTF-8 decode failed for {file_path_obj.name}, trying latin-1")
            with open(file_path, encoding='latin-1') as f:
                return f.read()

    async def add_document(self, file_path: str, metadata: dict[str, Any] | None = None) -> dict[str, Any]:
        """
        Add a new document to the RAG knowledge base.
        """
        try:
            file_path_obj = Path(file_path)
            file_name = file_path_obj.name

            # Check if document already exists
            if file_name in self.loaded_documents:
                logger.warning(f"Document {file_name} already exists in knowledge base")
                return {
                    "status": "exists",
                    "filename": file_name,
                    "message": "Document already in knowledge base"
                }

            # Read document content with proper file type handling
            content = self._extract_content(file_path)

            # Split content into chunks
            chunks = self._split_text(content)

            # Add to ChromaDB
            ids = [f"{file_name}_chunk_{i}" for i in range(len(chunks))]
            metadatas = [
                {
                    "filename": file_name,
                    "chunk": i,
                    "total_chunks": len(chunks),
                    **(metadata or {})
                }
                for i in range(len(chunks))
            ]

            if self.collection is None:
                raise RuntimeError("Collection not initialized")
            self.collection.add(
                documents=chunks,
                ids=ids,
                metadatas=metadatas  # type: ignore[arg-type]
            )

            # Add to tracked documents
            self.loaded_documents.add(file_name)

            # Store metadata if provided
            if metadata:
                metadata_path = file_path_obj.with_suffix('.meta.json')
                with open(metadata_path, 'w') as f:
                    json.dump(metadata, f)

            logger.info(f"Successfully added document: {file_name}")

            return {
                "status": "success",
                "filename": file_name,
                "chunks": len(chunks),
                "message": "Document added to knowledge base"
            }

        except Exception as e:
            logger.error(f"Failed to add document {file_path}: {e}")
            raise

    def _split_text(self, text: str, chunk_size: int | None = None, chunk_overlap: int | None = None) -> list[str]:
        """
        Split text into chunks.
        """
        chunk_size = chunk_size or settings.rag_chunk_size
        chunk_overlap = chunk_overlap or settings.rag_chunk_overlap

        chunks = []
        start = 0

        while start < len(text):
            end = min(start + chunk_size, len(text))
            chunks.append(text[start:end])
            start += chunk_size - chunk_overlap

        return chunks

    async def remove_document(self, filename: str) -> dict[str, Any]:
        """
        Remove a document from the knowledge base.
        """
        try:
            file_path = Path(settings.upload_directory) / filename

            if filename not in self.loaded_documents:
                return {
                    "status": "not_found",
                    "filename": filename,
                    "message": "Document not found in knowledge base"
                }

            # Remove from ChromaDB
            if self.collection is None:
                raise RuntimeError("Collection not initialized")
            results = self.collection.get(
                where={"filename": filename}
            )

            if results['ids']:
                self.collection.delete(ids=results['ids'])

            # Remove the file
            if file_path.exists():
                file_path.unlink()

            # Remove metadata if exists
            metadata_path = file_path.with_suffix('.meta.json')
            if metadata_path.exists():
                metadata_path.unlink()

            # Remove from tracked documents
            self.loaded_documents.discard(filename)

            logger.info(f"Successfully removed document: {filename}")

            return {
                "status": "success",
                "filename": filename,
                "message": "Document removed from knowledge base"
            }

        except Exception as e:
            logger.error(f"Failed to remove document {filename}: {e}")
            raise

    def _generate_contextual_insights(self, query: str) -> str:
        """
        Generate Europe's Gate contextual insights based on the user's query.
        """
        query_lower = query.lower()
        insights = []

        # Steel island synergies
        if any(word in query_lower for word in ["steel", "slag", "energy", "hydrogen", "land"]):
            insights.append(
                "💡 **Steel Island Synergy**: The 30M tons/year slag production (0.3 tons per ton steel) "
                "reclaims 1.9 km² annually - this becomes the foundation for expanding the hydrogen hub AND "
                "future circular economy businesses on the island."
            )

        # Financial & SPV structure
        if any(word in query_lower for word in ["invest", "finance", "cost", "spv", "revenue", "roi"]):
            insights.append(
                "💰 **Multi-SPV De-risking**: The project splits risk across Bridge (stable toll revenues), "
                "Steel Island (industrial cash generator), and Hydrogen Hub (growth market). This structure "
                "appeals to different investor types and distributes downside risk."
            )

        # Governance & timeline
        if any(word in query_lower for word in ["governance", "timeline", "phase", "sprint", "closure", "management"]):
            insights.append(
                "⏱️ **Critical Path Moments**: The 12-month sprint generates proof-of-concept (presales, heat Phase 1, EU bonds), "
                "feeding momentum into the 18-month investment closure. Early visibility reduces investor perception of risk."
            )

        # EU strategy & policy
        if any(word in query_lower for word in ["eu", "green deal", "strategic", "policy", "funding", "subsidy", "csrd"]):
            insights.append(
                "🇪🇺 **EU Strategic Alignment**: Europe's Gate delivers on EU Green Deal (emissions reduction), "
                "autonomy agenda (green steel + hydrogen), and CSRD materiality (double-sided impact on emissions + market risk). "
                "This positioning makes it attractive to EU funding instruments and institutional investors."
            )

        # Technical & construction
        if any(word in query_lower for word in ["construction", "engineering", "technical", "build", "modular", "dfma"]):
            insights.append(
                "🏗️ **Modular Advantage**: DfMA (Design-for-Manufacture & Assembly) reduces construction time → lower financing costs. "
                "Prefabrication also enables staged opening (segments as soon as functional) for early revenue generation."
            )

        # Urban nodes & living lab
        if any(word in query_lower for word in ["urban", "node", "city", "living lab", "tourism", "development"]):
            insights.append(
                "🏙️ **Living Lab Value**: The 10+ circular nodes aren't just development - they're innovation hubs for "
                "testing sustainable urban models. This creates IP licensing revenue (€50-100M/year executive education + licenses) "
                "and attracts academic/corporate partnerships."
            )

        # Risk management
        if any(word in query_lower for word in ["risk", "mitigation", "challenge", "issue", "delay", "problem"]):
            insights.append(
                "⚠️ **Risk Mitigation Structure**: 10 major risk categories have been mapped with specific mitigations "
                "(permitting, market, construction, financial, operational, environmental, political, reputation, tech, timing). "
                "Overall project risk assessed as MEDIUM with proper governance."
            )

        # Circular economy
        if any(word in query_lower for word in ["circular", "sustainability", "circular economy", "waste", "recycl"]):
            insights.append(
                "♻️ **Circularity Story**: >60% recycled materials in construction, >95% waste reduction, slag land reclamation, "
                "waste heat networks, seaweed farming, vertical agriculture. This isn't greenwashing - it's structural to the business model."
            )

        return "\n\n".join(insights) if insights else ""

    async def search(self, query: str, top_k: int | None = None) -> list[dict[str, Any]]:
        """
        Search for relevant documents using semantic search.
        """
        try:
            top_k = top_k or settings.rag_top_k_results

            # Query ChromaDB - this creates embeddings and performs vector search
            if self.collection is None:
                raise RuntimeError("Collection not initialized")
            results = self.collection.query(
                query_texts=[query],
                n_results=top_k
            )

            # Format results
            formatted_results = []
            if (results['documents'] and results['documents'][0] and
                results['metadatas'] and results['metadatas'][0] and
                results['distances'] and results['distances'][0]):
                for idx, (doc, metadata, distance) in enumerate(zip(
                    results['documents'][0],
                    results['metadatas'][0],
                    results['distances'][0], strict=False
                )):
                    similarity_score = 1.0 - (distance / 2.0)  # Convert distance to similarity score
                    formatted_results.append({
                        "index": idx,
                        "content": doc,
                        "metadata": metadata,
                        "score": similarity_score
                    })

            # Log search results with top-K info
            logger.debug(f"Search query: '{query}' returned top {len(formatted_results)} most similar results")

            return formatted_results

        except Exception as e:
            logger.error(f"Search failed for query '{query}': {e}")
            raise

    async def chat(
        self,
        message: str,
        history: list[dict[str, str]] | None = None,
        use_rag: bool = True,
        stream: bool = True,
        images: list[dict[str, Any]] | None = None
    ) -> AsyncIterator[str]:
        """
        Chat with the AI using RAG-enhanced context.
        """
        try:
            history = history or []

            # Build messages list
            messages = []

            # Add system message - Europe's Gate specialized
            system_prompt = (
                "You are the Europe's Gate Knowledge Specialist - expert advisor for a visionary €50-100B megaproject "
                "connecting London to Amsterdam/Rotterdam via a 360km North Sea bridge, integrated with green steel production "
                "(100M tons/year), hydrogen infrastructure (5-10 GW), and circular urban nodes.\n\n"

                "Your specialized expertise spans:\n"
                "• Financial engineering (multi-SPV structure, investment phases, cost strategies)\n"
                "• Technical delivery (bridge specs, modular construction, steel island operations)\n"
                "• EU strategic alignment (Green Deal, industrial autonomy, CSRD compliance)\n"
                "• Risk mitigation (10 major risk categories with practical solutions)\n"
                "• Stakeholder coordination (7 SPVs, governance, partnerships)\n"
                "• Circular economy integration (slag land reclamation, waste heat networks, living labs)\n\n"

                "Your approach:\n"
                "1. Ground all responses in the Europe's Gate knowledge base\n"
                "2. Always cite sources clearly: [Source: Document Name - Section]\n"
                "3. Highlight how different components interconnect (bridge → energy → industrial → urban)\n"
                "4. Consider project phases (12-month sprint, 18-month investment closure, 10-15 year construction)\n"
                "5. Structure answers for clarity: direct answer → project context → strategic implications → quick reference\n"
                "6. Add strategic insights where relevant (e.g., cross-SPV synergies, EU positioning, de-risking opportunities)\n"
                "7. Use confidence indicators ('clearly states', 'suggests', 'appears to indicate')\n"
                "8. Flag when knowledge base doesn't have detailed info, offer framework for thinking through the issue\n\n"

                "Remember: You're helping develop a transformative project. Responses should help the client "
                "understand connections, evaluate trade-offs, and navigate this complex ecosystem with confidence."
            )
            messages.append({"role": "system", "content": system_prompt})

            # Add RAG context if enabled
            if use_rag and self.collection:
                # Perform vector search to find relevant context
                context_results = await self.search(message, top_k=settings.rag_top_k_results)

                if context_results:
                    # Build context from retrieved chunks with improved formatting
                    context_parts = []
                    for _idx, r in enumerate(context_results, 1):
                        filename = r['metadata'].get('filename', 'Unknown')
                        chunk_num = r['metadata'].get('chunk', 0) + 1
                        total_chunks = r['metadata'].get('total_chunks', 'Unknown')
                        score = r.get('score', 0)

                        # Include all top-K results with similarity scores for LLM to evaluate
                        context_parts.append(
                            f"[📄 {filename} | Section {chunk_num}/{total_chunks} | Confidence: {score:.0%}]\n"
                            f"{r['content']}"
                        )

                    if context_parts:
                        context_text = "\n\n---\n\n".join(context_parts)

                        # Generate contextual insights for Europe's Gate
                        contextual_insights = self._generate_contextual_insights(message)

                        context_message = (
                            f"# Europe's Gate Knowledge Context\n\n"
                            f"Relevant sections from the Europe's Gate knowledge base (ranked by relevance):\n\n"
                            f"{context_text}\n\n"
                            f"---\n\n"
                            f"**How to answer:**\n"
                            f"- Draw from the above context to answer the user's question\n"
                            f"- Focus on the highest-confidence sections\n"
                            f"- Always cite which document you're referencing\n"
                            f"- If relevant sections don't fully answer the question, acknowledge the gap and provide framework-based thinking\n"
                        )

                        # Add contextual insights if available
                        if contextual_insights:
                            context_message += f"\n**Strategic Insights for This Question:**\n\n{contextual_insights}"

                        messages.append({"role": "system", "content": context_message})

            # Add chat history
            messages.extend(history)

            # Add current message (with images if present)
            if images:
                # For vision models, create message with text and images
                user_content = [{"type": "text", "text": message}]
                user_content.extend(images)
                messages.append({"role": "user", "content": user_content})  # type: ignore[dict-item]
                logger.info(f"Processing message with {len(images)} image(s)")
                logger.debug(f"Message structure for vision: {len(user_content)} content parts")
            else:
                messages.append({"role": "user", "content": message})

            # Get response from OpenAI
            # gpt-4o has built-in vision capabilities
            response = await self.openai_client.chat.completions.create(
                model=settings.openai_model,
                messages=messages,  # type: ignore
                stream=stream,
                temperature=0.7,
                max_tokens=2000
            )

            if stream:
                # Stream response chunks
                async for chunk in response:  # type: ignore
                    if chunk.choices[0].delta.content:
                        yield chunk.choices[0].delta.content
            else:
                # Return complete response
                yield response.choices[0].message.content  # type: ignore

        except Exception as e:
            logger.error(f"Chat failed for message '{message}': {e}")
            raise

    async def get_document_list(self) -> list[dict[str, Any]]:
        """
        Get list of all documents in the knowledge base.
        """
        documents = []
        doc_path = Path(settings.upload_directory)

        if doc_path.exists():
            for file_path in doc_path.iterdir():
                if file_path.is_file() and not file_path.name.endswith('.meta.json'):
                    # Get file stats
                    stats = file_path.stat()

                    # Load metadata if exists
                    metadata = {}
                    metadata_path = file_path.with_suffix('.meta.json')
                    if metadata_path.exists():
                        with open(metadata_path) as f:
                            metadata = json.load(f)

                    documents.append({
                        "filename": file_path.name,
                        "size": stats.st_size,
                        "modified": stats.st_mtime,
                        "type": file_path.suffix[1:] if file_path.suffix else "unknown",
                        "metadata": metadata
                    })

        return documents

    async def cleanup(self) -> None:
        """
        Cleanup resources when shutting down.
        """
        try:
            # ChromaDB handles its own cleanup
            logger.info("QueenRAGEngine cleaned up successfully")

        except Exception as e:
            logger.error(f"Error during cleanup: {e}")

    async def health_check(self) -> dict[str, Any]:
        """
        Check health status of the RAG engine.
        """
        return {
            "status": "healthy" if self.collection else "unhealthy",
            "documents_count": len(self.loaded_documents),
            "vector_store": "chroma",
            "model": settings.openai_model,
            "embedding_model": settings.openai_embedding_model,
            "initialized": self.collection is not None
        }
