import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "⚡ AI & Open-Source Hub",
  description: "Curated, copy-paste-ready AI tools, GitHub repos, workflows, and prompts extracted from social media.",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: '⚡ Extractor Tool', link: '/extractor' },
      { text: 'GitHub Repos', link: '/github-repos/local-llms' },
      { text: 'Prompts', link: '/prompts/coding-assistants' },
      { text: 'Workflows', link: '/workflows/local-ai-stack' }
    ],
    sidebar: [
      {
        text: '🛠️ Online Tools',
        items: [
          { text: '⚡ Social Media Extractor', link: '/extractor' }
        ]
      },
      {
        text: '🔥 Curated GitHub Repos',
        items: [
          { text: '🦙 Local LLMs & Inference', link: '/github-repos/local-llms' },
          { text: '🤖 AI Coding Agents', link: '/github-repos/ai-coding-agents' },
          { text: '🎨 Image Generation & Media', link: '/github-repos/image-generation' },
          { text: '🎙️ Speech & Audio AI', link: '/github-repos/speech-and-audio' },
          { text: '⚡ Workflow Automation', link: '/github-repos/workflow-automation' },
          { text: '🕷️ Web Scraping & Crawling', link: '/github-repos/web-scraping-and-crawling' },
          { text: '🗄️ RAG & Vector DBs', link: '/github-repos/rag-and-vector-databases' },
          { text: '🛠️ Developer & Privacy Tools', link: '/github-repos/developer-tools' }
        ]
      },
      {
        text: '💬 Prompt Library',
        items: [
          { text: '💻 Coding Assistants', link: '/prompts/coding-assistants' },
          { text: '✍️ Content Creation & Growth', link: '/prompts/content-creation' },
          { text: '🔬 Deep Research & Synthesis', link: '/prompts/deep-research-and-analysis' }
        ]
      },
      {
        text: '🧩 End-to-End Workflows',
        items: [
          { text: '🖥️ Offline Local AI Workstation', link: '/workflows/local-ai-stack' },
          { text: '🕷️ AI Web Scraping Pipeline', link: '/workflows/web-scraping-ai-pipeline' }
        ]
      }
    ],
    search: {
      provider: 'local'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/deepankarboro/AI_IG_Content' }
    ],
    footer: {
      message: 'Curated for fast copy-pasting from social media to production. Star us on GitHub!',
      copyright: 'MIT Licensed | Open Source AI Hub'
    }
  }
})
