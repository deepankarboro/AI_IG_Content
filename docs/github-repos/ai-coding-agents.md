# 🤖 AI Coding Assistants & Autonomous Agents

Curated open-source coding agents and IDE extensions that work directly inside your terminal or VS Code, pairing with local or cloud LLMs.

---

### 1. [Aider](https://github.com/Aider-AI/aider)
> AI pair programming in your terminal. Edits code across multiple files in your local git repository.

- **Replaces:** Cursor ($20/mo) / GitHub Copilot ($10-$19/mo)
- **Official Repo:** [Aider-AI/aider](https://github.com/Aider-AI/aider)
- **License:** Apache-2.0
- **Best For:** Terminal-first autonomous coding, multi-file refactoring, and auto-git commits.

#### 💻 One-Click Install & Run
```bash
# Install with pipx or pip
pip install aider-chat

# Launch in any git repository with DeepSeek, Claude, or local Ollama
aider --model deepseek/deepseek-chat
# or with local Ollama
aider --model ollama/llama3.1
```

---

### 2. [Continue](https://github.com/continuedev/continue)
> Open-source AI code assistant for VS Code and JetBrains. Connect any model (local or cloud).

- **Replaces:** GitHub Copilot / Supermaven
- **Official Repo:** [continuedev/continue](https://github.com/continuedev/continue)
- **License:** Apache-2.0
- **Best For:** Autocomplete and chat sidebar inside VS Code using 100% offline local LLMs (Ollama / LM Studio).

#### 💻 Quick Setup
1. Install from VS Code Marketplace: Search for **Continue**.
2. Select your provider: Choose **Ollama**, **Anthropic**, or **OpenAI**.

---

### 3. [Browser-Use](https://github.com/browser-use/browser-use)
> Make websites accessible for AI agents. Open-source web automation library powered by LLMs.

- **Replaces:** Expensive web RPA / manual browser automation
- **Official Repo:** [browser-use/browser-use](https://github.com/browser-use/browser-use)
- **License:** MIT
- **Best For:** Automating web tasks (booking tickets, filling forms, researching companies).

#### 💻 Quick Install & Run
```bash
pip install browser-use playwright
playwright install
```

#### 🐍 Copyable Python Snippet
```python
from langchain_openai import ChatOpenAI
from browser_use import Agent
import asyncio

async def main():
    agent = Agent(
        task="Go to GitHub, search for trending Python AI repositories, and summarize the top 3.",
        llm=ChatOpenAI(model="gpt-4o"),
    )
    result = await agent.run()
    print(result)

asyncio.run(main())
```
