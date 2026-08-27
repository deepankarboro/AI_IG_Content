import{_ as s,o as a,c as n,a4 as t}from"./chunks/framework.CogcvB8Q.js";const h=JSON.parse('{"title":"💻 High-Leverage AI Prompts for Developers","description":"","frontmatter":{},"headers":[],"relativePath":"prompts/coding-assistants.md","filePath":"prompts/coding-assistants.md"}'),o={name:"prompts/coding-assistants.md"};function i(p,e,r,l,c,d){return a(),n("div",null,[...e[0]||(e[0]=[t(`<h1 id="💻-high-leverage-ai-prompts-for-developers" tabindex="-1">💻 High-Leverage AI Prompts for Developers <a class="header-anchor" href="#💻-high-leverage-ai-prompts-for-developers" aria-label="Permalink to &quot;💻 High-Leverage AI Prompts for Developers&quot;">​</a></h1><p>Tested, copy-paste prompt templates designed for ChatGPT, Claude 3.5 Sonnet, DeepSeek-V3, and local LLMs.</p><hr><h3 id="_1-the-zero-hallucination-senior-code-reviewer" tabindex="-1">1. The &quot;Zero-Hallucination Senior Code Reviewer&quot; <a class="header-anchor" href="#_1-the-zero-hallucination-senior-code-reviewer" aria-label="Permalink to &quot;1. The &quot;Zero-Hallucination Senior Code Reviewer&quot;&quot;">​</a></h3><blockquote><p>Force the LLM into a rigorous adversarial code review mode focusing only on security, edge cases, and performance regressions.</p></blockquote><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>You are an adversarial Senior Principal Software Engineer and Security Auditor.</span></span>
<span class="line"><span>Review the following code block strictly based on the following criteria:</span></span>
<span class="line"><span>1. Security vulnerabilities (OWASP top 10, injection, unchecked bounds, auth flaws).</span></span>
<span class="line"><span>2. Performance bottlenecks &amp; memory allocations.</span></span>
<span class="line"><span>3. Edge cases and boundary condition failures.</span></span>
<span class="line"><span>4. Maintainability and anti-patterns.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Rules:</span></span>
<span class="line"><span>- Do not compliment the code.</span></span>
<span class="line"><span>- Prioritize issues by Severity: [CRITICAL], [HIGH], [MEDIUM], [LOW].</span></span>
<span class="line"><span>- Provide exact code snippets illustrating the bug and the suggested fix.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Code to review:</span></span>
<span class="line"><span>\`\`\`&lt;PASTE_CODE_HERE&gt;\`\`\`</span></span></code></pre></div><hr><h3 id="_2-the-automated-unit-test-generator" tabindex="-1">2. The &quot;Automated Unit Test Generator&quot; <a class="header-anchor" href="#_2-the-automated-unit-test-generator" aria-label="Permalink to &quot;2. The &quot;Automated Unit Test Generator&quot;&quot;">​</a></h3><blockquote><p>Generates comprehensive test suites covering happy paths, edge cases, and mocks.</p></blockquote><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Write a production-grade test suite for the provided code using &lt;FRAMEWORK, e.g., PyTest / Jest / Go Test&gt;.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Requirements:</span></span>
<span class="line"><span>- 100% coverage of edge cases, empty inputs, null pointer checks, and timeout conditions.</span></span>
<span class="line"><span>- Mock all external I/O (network, filesystem, database).</span></span>
<span class="line"><span>- Use descriptive test naming conventions: test_&lt;function&gt;_&lt;condition&gt;_&lt;expected_result&gt;.</span></span>
<span class="line"><span>- Structure tests into: Arrange, Act, Assert.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Target Code:</span></span>
<span class="line"><span>\`\`\`&lt;PASTE_CODE_HERE&gt;\`\`\`</span></span></code></pre></div>`,10)])])}const g=s(o,[["render",i]]);export{h as __pageData,g as default};
