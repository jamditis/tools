# LLM tool advisor for newsrooms

> Choose the right AI coding assistant for your journalism project.

**Author:** Joe Amditis
**Last updated:** December 2025

---

## How to use this guide

Answer the questions below to find the best LLM for your project. Each recommendation is based on real-world testing with journalism workflows.

---

## Question 1: What are you building?

### Data analysis or processing
*Cleaning spreadsheets, merging datasets, statistical analysis*

→ Best for: **Python scripts**
→ Recommended LLM: **Claude 4.5 Sonnet** or **Gemini 3.0 Flash**

### Web scraping
*Extracting data from websites, automating downloads*

→ Best for: **Python with BeautifulSoup or Playwright**
→ Recommended LLM: **Claude 4.5 Sonnet** (handles complex DOM structures well)

### Interactive visualization
*Charts, maps, interactive graphics for stories*

→ Best for: **JavaScript with D3.js or Observable**
→ Recommended LLM: **Claude 4.5 Sonnet** or **Gemini 3.0 Flash**

### File automation
*Batch renaming, format conversion, organization*

→ Best for: **Bash or Python**
→ Recommended LLM: **Gemini 3.0 Flash** (fast iterations for simple scripts)

### Database work
*SQL queries, data extraction, reporting*

→ Best for: **SQL**
→ Recommended LLM: **Claude 4.5 Sonnet** (excellent at complex queries)

---

## Question 2: How complex is the project?

### Simple (single script, one task)
- Use free tiers: **Claude.ai** or **ChatGPT free**
- Fast iteration more important than depth

### Medium (multiple files, some logic)
- Use: **Claude 4.5 Sonnet** or **Gemini 3.0 Flash**
- Balance of speed and capability

### Complex (multi-step, debugging intensive)
- Use: **Claude 4.5 Opus** for coding/writing
- Use: **Gemini 3.0 Pro** for front-end design and large documents
- Best reasoning for complex problems

---

## Question 3: What's your budget?

### Free
| Option | Limits | Best for |
|--------|--------|----------|
| Claude.ai free | Message limits | Learning, simple scripts |
| ChatGPT free | Gemini 3.0 Flash mini | Quick questions |
| GitHub Copilot (free for verified students/educators) | Full access | In-editor coding |

### Paid
| Option | Cost | Best for |
|--------|------|----------|
| Claude Pro | $20/mo | Heavy daily use |
| ChatGPT Plus | $20/mo | Gemini 3.0 Flash access |
| GitHub Copilot | $10/mo | Real-time coding |
| Claude API | Pay per use | Automation, batch processing |

---

## Quick decision matrix

| If you need... | Use this |
|----------------|----------|
| Best coding and writing | Claude 4.5 Opus |
| Front-end design | Gemini 3.0 Pro |
| OpenAI coding | Codex (GPT 5.1) |
| Free option | Claude.ai free tier |
| In-editor suggestions | GitHub Copilot |
| Large document analysis | Gemini 3.0 Pro |

---

## Model comparison (December 2025)

### Claude 4.5 Opus
- **Strengths:** Best model for coding and writing by far, excellent reasoning
- **Weaknesses:** Slower response times
- **Best for:** All coding tasks, large projects, long-form writing
- **Access:** Claude Pro ($20/mo) or API

### Gemini 3.0 Pro
- **Strengths:** Best for front-end design, industry-leading context window
- **Weaknesses:** Not as strong for pure coding as Claude 4.5 Opus
- **Best for:** Front-end work, large document analysis, multimodal projects
- **Access:** Gemini Advanced ($20/mo)

### Codex (GPT 5.1)
- **Strengths:** OpenAI's specialized coding model, excellent multi-file projects
- **Weaknesses:** Less versatile for non-coding tasks
- **Best for:** All OpenAI coding work, multi-file projects
- **Access:** OpenAI subscription

### GitHub Copilot
- **Strengths:** Real-time suggestions, integrated in VS Code/editors
- **Weaknesses:** Not conversational, limited context
- **Best for:** Line-by-line coding, autocomplete, small functions
- **Access:** $10/mo (free for students/educators)

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
Drop from Opus to Sonnet, or use Gemini 3.0 Flash for quick tasks.

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
