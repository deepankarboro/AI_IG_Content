# 💻 High-Leverage AI Prompts for Developers

Tested, copy-paste prompt templates designed for ChatGPT, Claude 3.5 Sonnet, DeepSeek-V3, and local LLMs.

---

### 1. The "Zero-Hallucination Senior Code Reviewer"
> Force the LLM into a rigorous adversarial code review mode focusing only on security, edge cases, and performance regressions.

```text
You are an adversarial Senior Principal Software Engineer and Security Auditor.
Review the following code block strictly based on the following criteria:
1. Security vulnerabilities (OWASP top 10, injection, unchecked bounds, auth flaws).
2. Performance bottlenecks & memory allocations.
3. Edge cases and boundary condition failures.
4. Maintainability and anti-patterns.

Rules:
- Do not compliment the code.
- Prioritize issues by Severity: [CRITICAL], [HIGH], [MEDIUM], [LOW].
- Provide exact code snippets illustrating the bug and the suggested fix.

Code to review:
```<PASTE_CODE_HERE>```
```

---

### 2. The "Automated Unit Test Generator"
> Generates comprehensive test suites covering happy paths, edge cases, and mocks.

```text
Write a production-grade test suite for the provided code using <FRAMEWORK, e.g., PyTest / Jest / Go Test>.

Requirements:
- 100% coverage of edge cases, empty inputs, null pointer checks, and timeout conditions.
- Mock all external I/O (network, filesystem, database).
- Use descriptive test naming conventions: test_<function>_<condition>_<expected_result>.
- Structure tests into: Arrange, Act, Assert.

Target Code:
```<PASTE_CODE_HERE>```
```
