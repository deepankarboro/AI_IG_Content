# 🗄️ RAG, Knowledge Graphs & Vector Databases

Curated repositories for building Retrieval-Augmented Generation (RAG) pipelines, semantic search, and document question-answering systems.

---

### 1. [Qdrant](https://github.com/qdrant/qdrant)
> Vector similarity search engine and vector database written in Rust. Fast, scalable, and memory-efficient.

- **Replaces:** Pinecone ($70-$500+/mo) / Weaviate Cloud
- **Official Repo:** [qdrant/qdrant](https://github.com/qdrant/qdrant)
- **License:** Apache-2.0
- **Best For:** Production-grade semantic search with payload filtering and payload indexing.

#### 💻 One-Click Launch (Docker)
```bash
docker run -p 6333:6333 -p 6334:6334 \
    -v $(pwd)/qdrant_storage:/qdrant/storage:z \
    qdrant/qdrant
```

#### 🐍 Copyable Python Snippet
```python
from qdrant_client import QdrantClient

client = QdrantClient(host="localhost", port=6333)
print(client.get_collections())
```

---

### 2. [Dify](https://github.com/langgenius/dify)
> Open-source LLM app development platform. Combines AI workflow, RAG pipeline, agent capabilities, and model management in a visual UI.

- **Replaces:** Voiceflow / Flowise / Custom RAG backends
- **Official Repo:** [langgenius/dify](https://github.com/langgenius/dify)
- **License:** Apache-2.0
- **Best For:** Enterprise-ready visual RAG orchestration and AI assistant builders.

#### 💻 One-Click Launch (Docker Compose)
```bash
git clone https://github.com/langgenius/dify.git
cd dify/docker
cp .env.example .env
docker compose up -d
```
> Access at `http://localhost/install`

---

### 3. [LightRAG](https://github.com/HKUDS/LightRAG)
> Simple and fast Knowledge-Graph-enhanced RAG framework.

- **Replaces:** Complex multi-hop search algorithms
- **Official Repo:** [HKUDS/LightRAG](https://github.com/HKUDS/LightRAG)
- **License:** MIT
- **Best For:** Dual-level retrieval (low-level specific entities + high-level thematic relationships).

#### 💻 One-Click Install
```bash
pip install lightrag-hku
```
