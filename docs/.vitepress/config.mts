import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "⚡ AI & Open-Source Hub",
  description: "Curated, copy-paste-ready AI tools, GitHub repos, workflows, and prompts extracted from social media.",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'GitHub Repos', link: '/github-repos/local-llms' },
      { text: 'Prompts', link: '/prompts/coding-assistants' },
      { text: 'Workflows', link: '/workflows/local-ai-stack' }
    ],
    sidebar: [
      {
        text: '🔥 Curated GitHub Repos',
        items: [
          { text: '🦙 Local LLMs', link: '/github-repos/local-llms' },
          { text: '🎨 Image Generation & Media', link: '/github-repos/image-generation' },
          { text: '🎙️ Speech & Audio AI', link: '/github-repos/speech-and-audio' },
          { text: '⚡ Workflow Automation', link: '/github-repos/workflow-automation' },
          { text: '🛠️ Developer & Privacy Tools', link: '/github-repos/developer-tools' }
        ]
      },
      {
        text: '💬 Prompt Library',
        items: [
          { text: '💻 Coding Assistants', link: '/prompts/coding-assistants' }
        ]
      },
      {
        text: '🧩 End-to-End Workflows',
        items: [
          { text: '🖥️ Offline Local AI Workstation', link: '/workflows/local-ai-stack' }
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
      message: 'Curated for fast copy-pasting from social media to production.',
      copyright: 'MIT Licensed | Open Source AI Hub'
    }
  }
})
