# 🕷️ AI Web Scraping & Crawling Repositories

Open-source tools to turn complex websites, JavaScript apps, and documentation into clean, LLM-ready Markdown and structured JSON.

---

### 1. [Crawl4AI](https://github.com/unclecode/crawl4ai)
> Open-source LLM-friendly web crawler & scraper designed for AI pipelines. Blazing fast, extracts clean Markdown and structured data.

- **Replaces:** Firecrawl Cloud ($20-$100/mo) / Apify
- **Official Repo:** [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai)
- **License:** Apache-2.0
- **Best For:** Extracting clean markdown, images, and text from complex JS pages for RAG pipelines.

#### 💻 One-Click Install
```bash
pip install crawl4ai
crawl4ai-setup
```

#### 🐍 Copyable Python Snippet
```python
import asyncio
from crawl4ai import AsyncWebCrawler

async def main():
    async with AsyncWebCrawler(verbose=True) as crawler:
        result = await crawler.arun(url="https://news.ycombinator.com")
        print(result.markdown[:1000])

asyncio.run(main())
```

---

### 2. [ScrapeGraphAI](https://github.com/ScrapeGraphAI/Scrapegraph-ai)
> Python scraper library that uses LLMs and direct graph logic to create scraping pipelines for websites and local documents (XML, HTML, JSON).

- **Replaces:** Manual CSS selector coding / brittle scrapers
- **Official Repo:** [ScrapeGraphAI/Scrapegraph-ai](https://github.com/ScrapeGraphAI/Scrapegraph-ai)
- **License:** Apache-2.0
- **Best For:** Prompt-based web scraping (e.g. "Extract all laptop prices and product names from this URL").

#### 💻 Quick Install
```bash
pip install scrapegraphai
playwright install
```

#### 🐍 Copyable Python Snippet
```python
from scrapegraphai.graphs import SmartScraperGraph

graph_config = {
    "llm": {
        "model": "ollama/llama3.1",
        "base_url": "http://localhost:11434",
    },
}

smart_scraper = SmartScraperGraph(
    prompt="List all top projects and their descriptions.",
    source="https://github.com/trending",
    config=graph_config
)

result = smart_scraper.run()
print(result)
```
