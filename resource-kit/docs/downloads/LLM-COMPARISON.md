# LLM comparison chart for journalism projects

> Verified July 24, 2026. The AI landscape changes fast—verify current pricing, availability, privacy terms, and capabilities with the provider before production use.

---

## At a glance

| Model | Best for | Speed | Cost | Free tier? |
|-------|----------|-------|------|------------|
| Claude Fable 5 | Maximum-capability long-running agents | Slower | Higher | Check plan |
| Claude Opus 4.8 | Complex agentic coding and writing | Slower | Higher | Check plan |
| Claude Sonnet 5 | Balanced day-to-day agents | Fast | Medium | Check plan |
| Gemini 3.6 Flash | Stable agentic and multimodal work | Fast | Lower | Check plan |
| Gemini 3.1 Pro (preview) | Difficult multimodal reasoning | Slower | Medium | Check plan |
| Codex (GPT-5.6 Sol) | OpenAI repository work | Varies | Check plan | Check plan |
| GLM-5.2 (open) | Long-horizon open-weight agents | Varies | Hosting | Self-host |
| DeepSeek V4 Pro/Flash (open) | Long-context coding and tools | Varies | Hosting/API | Self-host |
| Qwen3.6-35B-A3B (open) | Efficient local agentic coding | Varies | Hosting | Self-host |
| Kimi K2.5 (open) | Multimodal and multi-agent workflows | Varies | Hosting | Self-host |

---

## Detailed breakdown

### Claude Opus 4.8

**Strengths:**
- Strong complex reasoning and agentic coding
- Excellent code architecture decisions
- Thorough debugging—explains *why* things break
- Long context window for large codebases
- Unmatched code generation quality

**Weaknesses:**
- Slower response time
- Higher cost per query

**Best for:** All coding tasks, large projects, difficult bugs, long-form writing

---

### Claude Sonnet 5

**Strengths:**
- Great balance of speed and capability
- Excellent at following instructions precisely
- Strong at explaining code clearly
- Good at iterating on feedback

**Weaknesses:**
- Less capable on very complex tasks than Claude Opus 4.8
- Better for brainstorming than production code

**Best for:** Daily tasks, brainstorming, quick iterations

---

### Gemini 3.1 Pro

**Strengths:**
- Best for front-end design work
- Industry-leading context window for large documents
- Excellent multimodal capabilities
- Good integration with Google products

**Weaknesses:**
- Not as strong for pure coding as Claude Opus 4.8
- May train on data unless opted out

**Best for:** Front-end design, large document analysis, multimodal projects

---

### Codex (GPT-5.6 Sol)

**Strengths:**
- Specialized for coding tasks
- Excellent at multi-file projects
- Strong debugging capabilities

**Weaknesses:**
- Less versatile for non-coding tasks
- Requires OpenAI subscription

**Best for:** All OpenAI coding work, multi-file projects

---

### GPT-5.6 Sol

**Strengths:**
- Top-tier reasoning for complex problems
- Powers the 'Deep Research' feature
- Highly steerable for specific tasks

**Weaknesses:**
- Higher cost
- Can be overly thorough on simple tasks

**Best for:** Deep research, complex reasoning, investigative work

---

### GitHub Copilot

**Strengths:**
- Integrated into your editor (VS Code, etc.)
- Real-time suggestions as you type
- Great for boilerplate code
- Affordable monthly price

**Weaknesses:**
- Less capable than chat-based AI for complex tasks
- Suggestions without explanation
- Requires code editor setup

**Best for:** Writing code when you know what you want, reducing typing

---

## Cost comparison

Pricing and plan access change too quickly for a durable static table. Check each provider's official pricing page immediately before budgeting or deployment.

---

## Which should you start with?

### Complete beginner, no budget
→ **Claude.ai free tier** or **Gemini free tier**

### Some experience, willing to pay $20/month
→ **Claude Pro** (best for coding and writing)

### Regular coding work
→ **Claude Opus 4.8** + **GitHub Copilot** for in-editor

### Front-end design or large documents
→ **Gemini 3.1 Pro** (best context window and multimodal)

### Building production tools for newsroom
→ **Claude Opus 4.8** for all coding tasks

---

## Tips for effective prompting

1. **Include your environment** — "I'm using Python 3.11 on Mac with pandas 2.0"

2. **Show sample data** — Paste a few rows of your actual data

3. **State your goal, not just the task** — "I need to identify trends" is better than "make a graph"

4. **Ask for chunks, not everything** — Build incrementally

5. **When stuck, explain context** — "This is for a story about X, and I'm trying to show Y"

---

*From [Center for Cooperative Media](https://centerforcooperativemedia.org) AI Tools for Newsrooms*
