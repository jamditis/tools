# LLM tool advisor for newsrooms

> Choose the right AI coding assistant for your journalism project.

**Author:** Joe Amditis
**Verified:** November 2, 2026

Model names, access, prices, and privacy terms change quickly. Verify the current provider documentation before production use.

---

## How to use this guide

Answer the questions below to find the best LLM for your project. Each recommendation is based on real-world testing with journalism workflows.

---

## Question 1: What are you building?

### Data analysis or processing
*Cleaning spreadsheets, merging datasets, statistical analysis*

→ Best for: **Python scripts**
→ Recommended LLM: **Claude Sonnet 5.5** or **Gemini 3.8 Flash**

### Web scraping
*Extracting data from websites, automating downloads*

→ Best for: **Python with BeautifulSoup or Playwright**
→ Recommended LLM: **Claude Sonnet 5.5** (handles complex DOM structures well)

### Interactive visualization
*Charts, maps, interactive graphics for stories*

→ Best for: **JavaScript with D3.js or Observable**
→ Recommended LLM: **Claude Sonnet 5.5** or **Gemini 3.8 Flash**

### File automation
*Batch renaming, format conversion, organization*

→ Best for: **Bash or Python**
→ Recommended LLM: **Gemini 3.8 Flash** (fast iterations for simple scripts)

### Database work
*SQL queries, data extraction, reporting*

→ Best for: **SQL**
→ Recommended LLM: **Claude Sonnet 5.5** (excellent at complex queries)

---

## Question 2: How complex is the project?

### Simple (single script, one task)
- Use free tiers: **Claude.ai** or **ChatGPT free**
- Fast iteration more important than depth

### Medium (multiple files, some logic)
- Use: **Claude Sonnet 5.5** or **Gemini 3.8 Flash**
- Balance of speed and capability

### Complex (multi-step, debugging intensive)
- Use: **Claude Fable 5.1** or **Claude Opus 5.5** for difficult Anthropic workflows
- Use: **GPT-6.1 Sol** for complex OpenAI agent work
- Use: **Gemini 4 Argon** for difficult multimodal reasoning, or **Gemini 3.8 Flash** for a lower-cost option

---

## Question 3: What's your budget?

Free tiers, subscriptions, and API rates change frequently and differ by region. Check the current plan page for Claude, ChatGPT, Gemini, GitHub Copilot, or your chosen hosted open-model provider before budgeting.

---

## Quick decision matrix

| If you need... | Use this |
|----------------|----------|
| Maximum-capability Anthropic work | Claude Fable 5.1 |
| Advanced Anthropic coding and reasoning | Claude Opus 5.5 |
| Balanced Anthropic coding | Claude Sonnet 5.5 |
| Current Google coding and agents | Gemini 3.8 Flash |
| OpenAI coding | Codex (GPT-6.1 Sol) |
| Open-weight long-horizon agents | GLM-5.3 |
| Efficient local coding | Qwen3.6-35B-A3B |
| Top hosted Qwen tier | Qwen 3.8 Max |
| Stable hosted Qwen agents | Qwen 3.7 Plus |

---

## Model comparison

### Claude Fable 5.1 and Claude Opus 5.5
- **Strengths:** High-capability long-running agents, coding, writing, and complex reasoning
- **Weaknesses:** Slower response times
- **Best for:** Difficult repository work, complex research, long-form writing
- **Access:** Check the current Anthropic plan and model matrix

### Gemini 3.8 Flash and Gemini 4 Argon
- **Strengths:** Strong multimodal input, long context, and tool use
- **Weaknesses:** Gemini 4 Argon has no free API tier, and its price doubles on December 1, 2026
- **Best for:** Agentic multimodal work and large-document analysis
- **Access:** Check the current Google model page

### Codex (GPT-6.1 Sol)
- **Strengths:** OpenAI's coding agent, excellent multi-file projects. It defaults to GPT-6.1 Sol and also runs GPT-6 Astra, GPT-6.1 Terra, and GPT-6 Luna, depending on your plan
- **Weaknesses:** Less versatile for non-coding tasks
- **Best for:** All OpenAI coding work, multi-file projects
- **Access:** Check current Codex and OpenAI plan support

### Open-weight options
- **GLM-5.3:** Long-horizon, one-million-token agent workflows
- **DeepSeek V4 Pro/Flash:** Long-context coding and tools
- **Qwen3.6-35B-A3B:** Efficient local agentic coding
- **Kimi K3:** Long-horizon coding, visual understanding, and end-to-end knowledge work
- **Access:** Open weights do not mean free operation; budget for hardware or hosted inference

---

## Tips for better results

### Include context
Tell the LLM your environment:
- Operating system (Windows, Mac, Linux)
- Language version (Python 3.11, Node 18)
- Any frameworks or libraries you're using

### Show sample data
Include examples of your input and expected output:
```
Input: CSV with columns [name, date, amount]
Output: JSON grouped by month with totals
```

### Ask for chunks
Don't request entire applications. Ask for:
1. The core function first
2. Error handling second
3. Edge cases third

### Verify everything
LLMs make mistakes. Always:
- Test with real data
- Check edge cases
- Verify calculations manually on a sample

---

## When to switch LLMs

**Same error 3+ times?**
Try a different model. Each has different training data and approaches.

**Too slow?**
Drop from Opus to Sonnet, or use Gemini 3.8 Flash for quick tasks.

**Too expensive?**
Use free tiers for exploration, paid for production code.

**Need real-time help?**
GitHub Copilot for in-editor, conversational LLM for debugging.

---

## Resources

- **Vibe coding guide:** Learn the workflow for AI-assisted development
- **Quick reference:** Printable cheat sheet
- **Changelog template:** Document your coding sessions

---

*From [Center for Cooperative Media](https://centerforcooperativemedia.org) AI Tools for Newsrooms*
