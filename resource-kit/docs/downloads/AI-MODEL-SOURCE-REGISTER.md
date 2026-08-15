# AI model source register

> Verified August 15, 2026 against provider documentation and release posts. Model access, pricing, aliases, licenses, and preview status can change without notice.

Use this register to check a model name before you publish guidance or start a production integration. Treat provider claims and benchmarks as claims to test, not independent proof.

## Current starting points

| Need | Starting point |
|---|---|
| Maximum-capability Anthropic work | Claude Fable 5 |
| Advanced Anthropic coding and reasoning | Claude Opus 5 |
| Balanced Anthropic work | Claude Sonnet 5 |
| OpenAI repository and agent work | GPT-5.6 Sol |
| Balanced or high-volume OpenAI work | GPT-5.6 Terra or Luna |
| Google coding and agents | Gemini 3.7 Flash |
| Highest hosted Qwen evaluation | Qwen 3.8 Max preview |
| Stable hosted Qwen work | Qwen 3.7 Plus |

## Language and agent models

| Provider or lab | Current tracked model | Status | Primary source |
|---|---|---|---|
| Anthropic | Claude Fable 5, Opus 5, Sonnet 5, Haiku 4.5 | Hosted | [Model guide](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model) |
| OpenAI | GPT-5.6 Sol, Terra, Luna | Hosted | [Model catalog](https://developers.openai.com/api/docs/models/all) |
| Google | Gemini 3.7 Flash | Hosted; new release | [Release post](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/) |
| SpaceXAI, formerly xAI | Grok 4.5 | Hosted | [Model guide](https://docs.x.ai/developers/grok-4-5) |
| Alibaba Cloud | Qwen 3.8 Max preview, Qwen 3.7 Max and Plus | Hosted; 3.8 is preview | [Model catalog](https://help.aliyun.com/en/model-studio/models) |
| Qwen Team, Alibaba | Qwen3.6-35B-A3B | Apache 2.0 open weights | [Official model repository](https://github.com/QwenLM/Qwen3.6) |
| Moonshot AI | Kimi K3 | Hosted and open weights; custom license | [Model repository](https://github.com/MoonshotAI/Kimi-K3) |
| DeepSeek | DeepSeek V4 Pro and Flash | Hosted and MIT-licensed open weights | [Release post](https://api-docs.deepseek.com/news/news260424/) |
| Z.ai | GLM-5.2 | Hosted and MIT-licensed open weights | [Release post](https://z.ai/blog/glm-5.2) |
| MiniMax | MiniMax M3 | Hosted and open weights; MiniMax Community License | [Official model card and weights](https://huggingface.co/MiniMaxAI/MiniMax-M3) |
| Mistral AI | Mistral Medium 3.5, Mistral Small 4 | Hosted and open weights; licenses differ | [Model catalog](https://docs.mistral.ai/models) |
| StepFun | Step-3.7-Flash | Apache 2.0 open weights | [Model repository](https://github.com/stepfun-ai/Step-3.7-Flash) |
| Xiaomi | MiMo-V2-Flash | Apache 2.0 open weights | [Model repository](https://github.com/XiaomiMiMo/MiMo-V2-Flash) |
| Tencent | Hy3 | Apache 2.0 open weights | [Model repository](https://github.com/Tencent-Hunyuan/Hy3) |
| Baidu | ERNIE 5.1 | Hosted | [Release post](https://ernie.baidu.com/blog/posts/ernie-5.1-0508-release/) |
| ByteDance | Seed2.0 | Hosted through Doubao, TRAE, and Volcano Engine | [Model catalog](https://seed.bytedance.com/en/models) |
| Cohere | Command A+ | Hosted and Apache 2.0 open weights | [Model documentation](https://docs.cohere.com/v1/docs/models) |
| NVIDIA | Nemotron 3 Ultra | Open weights and recipes | [Release guide](https://developer.nvidia.com/blog/nvidia-nemotron-3-ultra-powers-faster-more-efficient-reasoning-for-long-running-agents/) |
| Meta | Llama 4 Scout and Maverick | Open weights; custom Llama license | [Release post](https://ai.meta.com/blog/llama-4-multimodal-intelligence/) |

## Search, voice, image, and video models

| Provider | Current tracked product or model | Primary source |
|---|---|---|
| OpenAI | GPT Image 2; GPT Realtime 2.1 and 2.1 mini; GPT Realtime Whisper | [Model catalog](https://developers.openai.com/api/docs/models/all) |
| SpaceXAI, formerly xAI | Grok Imagine API; Grok Voice API | [Model guide](https://docs.x.ai/developers/models) |
| Perplexity | Sonar, Sonar Pro, Sonar Reasoning Pro, Sonar Deep Research | [Sonar model guide](https://docs.perplexity.ai/docs/sonar/models) |
| ElevenLabs | Eleven v3, Flash v2.5, Multilingual v2, Scribe v2, Music v2 | [Model catalog](https://elevenlabs.io/docs/overview/models) |
| Midjourney | V8.2 | [Release post](https://updates.midjourney.com/version-8-2/) |
| Google | Nano Banana 2 and Veo 3.1 | [Image guide](https://ai.google.dev/gemini-api/docs/image-generation), [video guide](https://ai.google.dev/gemini-api/docs/video) |
| Meta | Muse Image; Muse Video preview | [Release post](https://ai.meta.com/blog/introducing-muse-image-muse-video-msl/) |
| MiniMax | Hailuo 2.3, Speech 2.8, Music 3.0 | [Model and product index](https://www.minimax.io/news) |
| ByteDance | Seedream 5.0 Lite, Seedance 2.0 | [Model catalog](https://seed.bytedance.com/en/models) |
| Mistral AI | Voxtral TTS, OCR 4 | [Model catalog](https://docs.mistral.ai/models) |

OpenAI lists Sora 2 and Sora 2 Pro as legacy models. Do not start a new video integration on those aliases. Google plans to shut down Imagen API models on August 17, 2026 and recommends Nano Banana models instead.

## Prompt and tool guidance

| Provider or family | Current guidance |
|---|---|
| OpenAI GPT-5.6 | [Latest-model guide](https://developers.openai.com/api/docs/guides/latest-model) |
| Anthropic Claude 5 | [Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) |
| Google Gemini and Nano Banana | [Prompt strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies), [image prompting](https://ai.google.dev/gemini-api/docs/image-generation) |
| SpaceXAI Grok | [Grok 4.5 guide](https://docs.x.ai/developers/grok-4-5) |
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

- Claude Opus 5 uses adaptive thinking by default. Set effort for the task and leave enough output space for thinking plus the answer.
- GPT-5.6 models work best with a clear goal, constraints, tools, and an explicit completion check. Use the current OpenAI model guide before pinning an alias.
- Gemini 3.7 Flash is the current Google workhorse for coding and agents. Use direct instructions and test the exact tool and product surface because rollout can differ.
- Kimi K3 always uses thinking. For multi-turn tool calls, return the complete assistant message, including `reasoning_content` and `tool_calls`.
- DeepSeek V4 supports thinking and non-thinking modes. The `deepseek-chat` and `deepseek-reasoner` aliases retired on July 24, 2026.
- GLM-5.2 supports adjustable effort. Z.ai documents `GLM-5.2[1m]` for the one-million-token Claude Code route.
- Qwen 3.8 Max is a preview. Qwen 3.7 Plus is the safer stable starting point for hosted agent work.
- Qwen3.6-35B-A3B is the current efficient open-weight Qwen option tracked here. It uses about three billion active parameters and an Apache 2.0 license.
- MiMo-V2-Flash recommends lower temperature for agent and tool work than for writing or mathematics. Preserve reasoning content across tool turns.
- MiniMax M3 now has published weights. Use its `thinking` control intentionally and review the MiniMax Community License before private deployment.
- Grok 4.5 does not receive current web or X information unless you enable its search tools. Use a conversation cache key for long agent loops.
- For image and voice models, write the output format, composition, timing, pronunciation, and revision criteria directly into the prompt.
- Open weights do not always mean open source. Read the exact license before redistribution, commercial use, fine-tuning, or hosted deployment.

## Publication checks

1. Confirm the exact model ID and status on the provider page.
2. Confirm the license for every open-weight model.
3. Confirm the privacy and data-retention terms for the selected account and API.
4. Test citations, tool use, long context, and structured output on the actual workload.
5. Record the verification date beside any model recommendation.
