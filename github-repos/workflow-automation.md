# ⚡ Workflow Automation & AI Agent Repositories

Self-hosted alternatives to cloud automation platforms and frameworks for orchestrating multi-agent AI systems.

---

### 1. [n8n](https://github.com/n8n-io/n8n)
> Fair-code workflow automation platform with native AI agent nodes, vector store integrations, and 400+ app connectors.

- **Replaces:** Zapier ($20-$100+/mo) / Make.com ($10-$30/mo)
- **Official Repo:** [n8n-io/n8n](https://github.com/n8n-io/n8n)
- **License:** Sustainable Use License
- **Best For:** Visual low-code AI workflows connecting Webhooks, Telegram/Slack bots, LLMs, and databases.

#### 💻 One-Click Launch (Docker)
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```
> Open browser at `http://localhost:5678`

---

### 2. [Flowise](https://github.com/FlowiseAI/Flowise)
> Drag & drop UI to build customized LLM flows, autonomous agents, and RAG pipelines using LangChain.

- **Replaces:** Proprietary AI Bot Builders ($50-$200/mo)
- **Official Repo:** [FlowiseAI/Flowise](https://github.com/FlowiseAI/Flowise)
- **License:** Apache-2.0
- **Best For:** Visually wiring Ollama, ChromaDB, vector search, and web scrapers without writing code.

#### 💻 One-Click Install & Run (NodeJS / NPX)
```bash
npx flowise start
```
> Open browser at `http://localhost:3000`
