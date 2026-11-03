# AI model source register

> Verified November 2, 2026 against provider documentation for Anthropic, OpenAI, Google, SpaceXAI, Alibaba Cloud, Moonshot AI, DeepSeek, Z.ai, MiniMax, Mistral AI, Cohere, Perplexity, and ElevenLabs. Other rows were last checked on August 15, 2026. Model access, pricing, aliases, licenses, and preview status can change without notice.

Use this register to check a model name before you publish guidance or start a production integration. Treat provider claims and benchmarks as claims to test, not independent proof.

## Current starting points

| Need | Starting point |
|---|---|
| Most Anthropic coding and knowledge work | Claude Opus 5.5 |
| Hardest Anthropic reasoning and long agent runs | Claude Fable 5.1 |
| Balanced Anthropic work | Claude Sonnet 5.5 |
| High-volume Anthropic work | Claude Haiku 5.5 |
| OpenAI repository and agent work | GPT-6.1 Sol |
| Hardest OpenAI reasoning | GPT-6 Astra |
| Balanced or high-volume OpenAI work | GPT-6.1 Terra or GPT-6 Luna |
| Google coding and agents | Gemini 3.8 Flash |
| Hardest Google reasoning | Gemini 4 Argon |
| Top hosted Qwen tier | Qwen 3.8 Max |
| Balanced or fast hosted Qwen work | Qwen 3.7 Plus or Qwen 3.8 Flash |

## API prices

Prices are in US dollars per million tokens, as input and output. Check the provider page before you budget.

| Model | Input | Output | Note |
|---|---|---|---|
| Claude Fable 5.1 | $10 | $50 | |
| Claude Opus 5.5 | $4 | $20 | Fast mode is $8 and $40 |
| Claude Sonnet 5.5 | $2 | $10 | |
| Claude Haiku 5.5 | $0.10 | $0.50 | $0.50 and $2.50 for prompts over 100K tokens |
| GPT-6 Astra | $10 | $50 | 2x input and 1.5x output for prompts over 272K tokens |
| GPT-6.1 Sol | $2 | $10 | 2x input and 1.5x output for prompts over 272K tokens |
| GPT-6.1 Terra | $1 | $5 | 2x input and 1.5x output for prompts over 272K tokens |
| GPT-6 Luna | $0.10 | $0.50 | 2x input and 1.5x output for prompts over 272K tokens |
| Gemini 4 Argon | $2 | $10 | $4 and $20 after November 30, 2026 |
| Gemini 3.8 Flash | $0.75 | $3.75 | $1.50 and $7.50 after December 31, 2026 |
| Grok 4.7 | $2 | $6 | Higher rates for requests over 200K tokens |

## Language and agent models

| Provider or lab | Current tracked model | Status | Primary source |
|---|---|---|---|
| Anthropic | Claude Fable 5.1, Opus 5.5, Sonnet 5.5, Haiku 5.5 | Hosted | [Model overview](https://platform.claude.com/docs/en/about-claude/models/overview) |
| OpenAI | GPT-6 Astra, GPT-6.1 Sol and Terra, GPT-6 Luna | Hosted | [Latest-model guide](https://developers.openai.com/api/docs/guides/latest-model) |
| Google | Gemini 4 Argon, Gemini 3.8 Flash, Gemini 3.5 Flash-Lite | Hosted | [Model catalog](https://ai.google.dev/gemini-api/docs/models) |
| SpaceXAI, formerly xAI | Grok 4.7 | Hosted | [Model guide](https://docs.x.ai/developers/models/grok-4.7) |
| Alibaba Cloud | Qwen 3.8 Max and Flash, Qwen 3.7 Plus | Hosted | [Model catalog](https://help.aliyun.com/en/model-studio/models) |
| Qwen Team, Alibaba | Qwen3.6-35B-A3B | Apache 2.0 open weights | [Official model repository](https://github.com/QwenLM/Qwen3.6) |
| Moonshot AI | Kimi K3, hosted Kimi K3.1 Pro and Highspeed | Hosted and open weights; Kimi K3 License | [Model repository](https://github.com/MoonshotAI/Kimi-K3) |
| DeepSeek | DeepSeek V4 Pro, V4.1 Flash | V4 Pro has MIT-licensed open weights; confirm the V4.1 Flash license | [API changelog](https://api-docs.deepseek.com/updates) |
| Z.ai | GLM-5.3, GLM-5.3-Flash and FlashX | Hosted; GLM-5.3 has open weights under the GLM-5.3 License | [Model card and license](https://huggingface.co/zai-org/GLM-5.3) |
| MiniMax | MiniMax M3, M3.1 Flash | Hosted and open weights; MiniMax Community License | [Official model card and weights](https://huggingface.co/MiniMaxAI/MiniMax-M3) |
| Mistral AI | Mistral Large 4, Mistral Small 4 | Hosted and open weights; licenses differ | [Model catalog](https://docs.mistral.ai/models) |
| StepFun | Step-3.7-Flash | Apache 2.0 open weights | [Model repository](https://github.com/stepfun-ai/Step-3.7-Flash) |
| Xiaomi | MiMo-V2-Flash | Apache 2.0 open weights | [Model repository](https://github.com/XiaomiMiMo/MiMo-V2-Flash) |
| Tencent | Hy3 | Apache 2.0 open weights | [Model repository](https://github.com/Tencent-Hunyuan/Hy3) |
| Baidu | ERNIE 5.1 | Hosted | [Release post](https://ernie.baidu.com/blog/posts/ernie-5.1-0508-release/) |
| ByteDance | Seed2.0 | Hosted through Doubao, TRAE, and Volcano Engine | [Model catalog](https://seed.bytedance.com/en/models) |
| Cohere | Command A+ | Hosted and Apache 2.0 open weights | [Model documentation](https://docs.cohere.com/v1/docs/models) |
| NVIDIA | Nemotron 3 Ultra | Open weights and recipes | [Release guide](https://developer.nvidia.com/blog/nvidia-nemotron-3-ultra-powers-faster-more-efficient-reasoning-for-long-running-agents/) |
| Meta | Llama 4 Scout and Maverick | Open weights; custom Llama license | [Release post](https://ai.meta.com/blog/llama-4-multimodal-intelligence/) |

## Agent tools

The commands below are for macOS, Linux, and WSL. On Windows, use the PowerShell commands on the [terminal setup page](https://tools.amditis.tech/terminal-setup/).

| Tool | Install | Current notes | Primary source |
|---|---|---|---|
| Claude Code | `curl -fsSL https://claude.ai/install.sh \| bash` | Default model is Opus 5.5. Reads CLAUDE.md. Reads AGENTS.md only if no CLAUDE.md is present, or through an `@AGENTS.md` import | [Best practices](https://code.claude.com/docs/en/best-practices) |
| Codex | `curl -fsSL https://chatgpt.com/codex/install.sh \| sh` | Default model is GPT-6.1 Sol at medium effort. Reads AGENTS.md | [Best practices](https://developers.openai.com/codex/learn/best-practices) |
| Antigravity CLI | `curl -fsSL https://antigravity.google/cli/install.sh \| bash` | For free accounts, Google AI Pro and Ultra, and Gemini 4 Argon | [CLI docs](https://antigravity.google/docs/cli) |
| Gemini CLI | `npm install -g @google/gemini-cli` | For Gemini Code Assist Standard and Enterprise. No free tier | [Repository](https://github.com/google-gemini/gemini-cli) |
| GitHub Copilot CLI | `npm install -g @github/copilot` | Uses a Copilot subscription | [Supported models](https://docs.github.com/en/copilot/reference/ai-models/supported-models) |

## Search, voice, image, and video models

| Provider | Current tracked product or model | Primary source |
|---|---|---|
| OpenAI | GPT Image 2.5; GPT Realtime 2.1 and 2.1 mini; GPT Realtime Translate; GPT Realtime Whisper | [Model catalog](https://developers.openai.com/api/docs/models/all) |
| SpaceXAI, formerly xAI | Grok Imagine Image 2.0 and Video 1.5; Grok Voice API | [Model guide](https://docs.x.ai/developers/models) |
| Perplexity | Agent API, which replaced Sonar Chat Completions support on September 27, 2026 | [Agent API guide](https://docs.perplexity.ai/docs/agent-api/quickstart) |
| ElevenLabs | Eleven v4 and v4 Turbo, Realtime v1 Mini and Max, Scribe v2, Music v2.5 | [Model catalog](https://elevenlabs.io/docs/overview/models) |
| Midjourney | V8.2; check the updates page for later releases | [Release post](https://updates.midjourney.com/version-8-2/) |
| Google | Nano Banana 2.1, Gemini Omni Flash, Gemini 3.8 Live and TTS, Lyria 3.5 | [Model catalog](https://ai.google.dev/gemini-api/docs/models) |
| Meta | Muse Image; Muse Video preview | [Release post](https://ai.meta.com/blog/introducing-muse-image-muse-video-msl/) |
| MiniMax | H3 video, Speech 2.8, Music 3.0 | [Model and product index](https://www.minimax.io/news) |
| ByteDance | Seedream 5.0 Lite, Seedance 2.0 | [Model catalog](https://seed.bytedance.com/en/models) |
| Mistral AI | Voxtral TTS 3, Voxtral Mini Transcribe 3, OCR 4.1 | [Model catalog](https://docs.mistral.ai/models) |

## Scheduled changes

- Google: Gemini 4 Argon's price doubles after November 30, 2026, and Gemini 3.8 Flash's price doubles after December 31, 2026. Gemini 2.5 Pro and 2.5 Flash route to current models on December 1, 2026.
- Anthropic: Claude Sonnet 4.5 retires on November 30, 2026.
- OpenAI: gpt-5, gpt-5-mini, gpt-5-nano, gpt-5-pro, o3, and o3-pro shut down on December 11, 2026. GPT-4o, 4o-mini, 4.1, and 4.1-mini shut down on January 14, 2027. gpt-5.3-codex, gpt-5.4-nano, and gpt-5.1 shut down on April 1, 2027.

## Prompt and tool guidance

| Provider or family | Current guidance |
|---|---|
| OpenAI GPT-6 | [Latest-model guide](https://developers.openai.com/api/docs/guides/latest-model) |
| OpenAI Codex | [Best practices](https://developers.openai.com/codex/learn/best-practices) |
| Anthropic Claude 5 | [Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) |
| Claude Code | [Best practices](https://code.claude.com/docs/en/best-practices) |
| Google Gemini and Nano Banana | [Prompt strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies), [image prompting](https://ai.google.dev/gemini-api/docs/image-generation) |
| SpaceXAI Grok | [Grok 4.7 guide](https://docs.x.ai/developers/models/grok-4.7) |
| Alibaba Qwen | [Function calling](https://help.aliyun.com/en/model-studio/qwen-function-calling), [thinking modes](https://help.aliyun.com/en/model-studio/deep-thinking), [Qwen3.6 open-model usage](https://github.com/QwenLM/Qwen3.6) |
| Moonshot Kimi K3 | [Model usage and preserved-thinking rules](https://github.com/MoonshotAI/Kimi-K3#6-model-usage) |
| DeepSeek V4 | [Thinking mode](https://api-docs.deepseek.com/guides/thinking_mode), [tool calls](https://api-docs.deepseek.com/guides/tool_calls) |
| MiniMax M3 | [M-series usage tips](https://platform.minimax.io/docs/token-plan/prompting-best-practices), [model card](https://huggingface.co/MiniMaxAI/MiniMax-M3) |
| Mistral | [Prompting guide](https://docs.mistral.ai/studio-api/conversations/chat-completion/prompting) |
| Xiaomi MiMo-V2-Flash | [System prompt, sampling, and tool-use guidance](https://github.com/XiaomiMiMo/MiMo-V2-Flash#6-inference--deployment) |
| Tencent Hy3 | [Reasoning controls and training format](https://github.com/Tencent-Hunyuan/Hy3/blob/main/finetune/README.md) |
| Cohere Command A+ | [Text generation and prompt tutorial](https://docs.cohere.com/docs/text-generation-tutorial) |
| ElevenLabs | [Model selection guide](https://elevenlabs.io/docs/eleven-api/choosing-the-right-model) |

## Prompting and integration notes

- Claude models use adaptive thinking, which is always on for Fable and Opus. Set effort for the task and leave enough output space for thinking plus the answer. Default effort is high for Fable. Check the model table for the others, because product defaults differ.
- GPT-6 models work best with a clear goal, constraints, tools, and an explicit completion check. OpenAI recommends the Responses API. Review the migration guidance if you still use `gpt-6-sol`.
- Gemini 4 and Gemini 3.6 or later ignore custom `temperature`, `top_p`, and `top_k` values. New paid Gemini API projects store requests by default since October 26, 2026, so review that setting before you send sensitive material.
- Kimi K3 always uses thinking. For multi-turn tool calls, return the complete assistant message, including `reasoning_content` and `tool_calls`.
- DeepSeek V4 Pro continues on the API, and V4 Flash is retired there. Use `deepseek-flash` for V4.1 Flash.
- Qwen3.6-35B-A3B is the current efficient open-weight Qwen option tracked here. It uses about three billion active parameters and an Apache 2.0 license.
- MiMo-V2-Flash recommends lower temperature for agent and tool work than for writing or mathematics. Preserve reasoning content across tool turns.
- MiniMax M3 has published weights. Use its `thinking` control intentionally and review the MiniMax Community License before private deployment.
- Grok 4.7 does not receive current web or X information unless you enable its search tools.
- For image and voice models, write the output format, composition, timing, pronunciation, and revision criteria directly into the prompt.
- Open weights do not always mean open source. Read the exact license before redistribution, commercial use, fine-tuning, or hosted deployment.

## Publication checks

1. Confirm the exact model ID and status on the provider page.
2. Confirm the license for every open-weight model.
3. Confirm the privacy and data-retention terms for the selected account and API.
4. Test citations, tool use, long context, and structured output on the actual workload.
5. Record the verification date beside any model recommendation.
