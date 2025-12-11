# Gemini 3 Prompting: Best Practices for General Usage

November 19, 20256 minute read

I have been using Gemini 3 Pro for a bit and let me put it simply. It is so much better at literal everything than 2.5 Pro! This post shares the principles and structural patterns that are currently working best for me. This isn't meant to be treated as the gold standard, but rather as a starting point to help you refine your own strategies. Take what works, tweak what doesn't, and keep iterating.

## [](https://www.philschmid.de/gemini-3-prompt-practices#core-principles)Core Principles

Gemini 3 favors directness over persuasion and logic over verbosity. To maximize performance, adhere to these core principles:

-   **Precise Instructions:** Be concise in your input prompts. Gemini 3 responds best to direct, clear instructions. State your goal clearly without fluff.
-   **Consistency & Defined Parameters:** Maintain a uniform structure throughout your prompts (e.g., standardized XML tags) and explicitly define ambiguous terms.
-   **Output Verbosity:** By default, Gemini 3 is less verbose and prefers providing direct, efficient answers. If you require a more conversational or "chatty" persona, you must explicitly ask for it.
-   **Multimodal Coherence:** Text, images, audio, or video should all be treated as equal-class inputs. Instructions should reference specific modalities clearly to ensure the model synthesizes across them rather than analyzing them in isolation.
-   **Constraint Placement:** Place behavioral constraints and role definitions in the System Instruction or at the very top of the prompt to ensure they anchor the model's reasoning process.
-   **Long Context Structure:** When working with large contexts (books, codebases, long videos), place your specific instructions at the **end** of the prompt (after the data context).
-   **Context Anchoring:** When transitioning from a large block of data to your query, explicitly bridge the gap. Use a framing phrase like _"Based on the information above..."_ before your question.

## [](https://www.philschmid.de/gemini-3-prompt-practices#reasoning-and-planning)Reasoning and Planning

**Explicit Planning & Decomposition**

    Before providing the final answer, please:
    1. Parse the stated goal into distinct sub-tasks.
    2. Is the input information complete? If not, stop and ask for it.
    3. Are there tools, shortcuts, or "power user" methods that solve this problem better than the standard approach? (e.g., "Don't just list specs, suggest a workaround").
    4. Create a structured outline to achieve the goal.
    5. Validate your understanding before proceeding.
    

**Self-updating TODO Tracker**

    Create a TODO list to track progress:
    
    - [ ] Primary objective
    - [ ] Task 1
    - [ ] Task 2
    ....
    - [ ] Review
    

**Critique its own output**

    Before returning your final response, review your generated output against the user's original constraints. 
    
    1. Did I answer the user's *intent*, not just their literal words?
    2. Is the tone authentic to the requested persona?
    3. If I made an assumption due to missing data, did I flag it?
    

## [](https://www.philschmid.de/gemini-3-prompt-practices#structured-prompting)Structured Prompting

Use XML-style tagging or Markdown to structure prompts. This provides unambiguous boundaries that help the model distinguish between instructions and data. Don't mix XML or Markdown, choose one format for consistency.

**XML Example:**

    <rules>
        1. Be objective.
        2. Cite sources.
    </rules>
     
    <planning_process>
        1. Analyze the Request: Identify the core goal and all explicit constraints.
        2. Decompose: Break the problem into logical sub-tasks or variables.
        3. Strategize: Outline the step-by-step methodology to solve each sub-task.
        4. Verify: Check your plan for logical gaps or edge cases.
    </planning_process>
     
    <error_handling>
        IF <context> is empty, missing code, or lacks necessary data:
        DO NOT attempt to generate a solution.
        DO NOT make up data.
        Output a polite request for the missing information.
    </error_handling>
     
    <context>
        [Insert User Input Here - The model knows this is data, not instructions]
    </context>

**Markdown Example:**

    # Identity
    You are a senior solution architect.
    
    # Constraints
    - No external libraries allowed.
    - Python 3.11+ syntax only.
    
    # Output Format
    Return a single code block.
    

## [](https://www.philschmid.de/gemini-3-prompt-practices#agentic-tool-use)Agentic Tool Use

**The Persistence Directive**

    You are an autonomous agent.
    - Continue working until the user's query is COMPLETELY resolved.
    - If a tool fails, analyze the error and try a different approach.
    - Do NOT yield control back to the user until you have verified the solution.
    

**Pre-Computation Reflection**

    Before calling any tool, explicitly state:
    1. Why you are calling this tool.
    2. What specific data you expect to retrieve.
    3. How this data helps solve the user's problem.
    

## [](https://www.philschmid.de/gemini-3-prompt-practices#domain-specific-use-cases)Domain Specific Use Cases

**Research and Analysis**

    1. Decompose the topic into key research questions
    2. Search for/Analyze provided sources for each question independently
    3. Synthesize findings into a cohesive report
    4. CITATION RULE: If you make a specific claim, you must cite a source. If no source is available, state that it is a general estimate. Every claim must be immediately followed by a reference [Source ID]
    

**Creative Writing**

    1. Identify the target audience and the specific goal (e.g., empathy vs. authority).
    2. If the task requires empathy or casualness, strictly avoid corporate jargon (e.g., "synergy," "protocols," "ensure").
    3. Draft the content.
    4. Read the draft internally. Does this sound like a human or a template? If it sounds robotic, rewrite it.
    

**Problem-Solving**

    1. Restate the problem in your own words.
    2. Identify the "Standard Solution."
    3. Identify the "Power User Solution" (Is there a trick, a specific tool, or a nuance most people miss?).
    4. Present the solution, prioritizing the most effective method, even if it deviates slightly from the user's requested format.
    5. Sanity check: Does this solve the root problem?
    

**Education Content**

    1. Assess the user's current knowledge level based on their query.
    2. Define key terms before using them.
    3. Explain the concept using a relevant analogy.
    4. Provide a "Check for Understanding" question at the end.
    

## [](https://www.philschmid.de/gemini-3-prompt-practices#example-template)Example Template

This template combines best practices (Caching-friendly structure, Planning, and XML delimiters) into a reusable baseline.

**⚠️ Note: The Engineering Mindset**  
There is no "perfect" template or context structure. Context engineering is an empirical effort, not a fixed syntax. The optimal structure depends heavily on your specific data, latency constraints, and domain complexity. Treat the patterns below as robust baselines, but expect to iterate, measure, and refine based on your specific use case.

**System Instruction**

    <role>
    You are Gemini 3, a specialized assistant for [Insert Domain, e.g., Data Science].
    You are precise, analytical, and persistent.
    </role>
    
    <instructions>
    1. **Plan**: Analyze the task and create a step-by-step plan into distinct sub tasks.  tags. 
    2. **Execute**: Carry out the plan. If using tools, reflect before every call. Track you progress in TODO List use [ ] for pending, [x] for complete. 
    3. **Validate**: Review your output against the user's task. 
    4. **Format**: Present the final answer in the requested structure.
    </instructions>
    
    <constraints>
    - Verbosity: [Low/Medium/High]
    - Tone: [Formal/Casual/Technical]
    - Handling Ambiguity: Ask clarifying questions ONLY if critical info is missing; otherwise, make reasonable assumptions and state them.
    </constraints>
    
    <output_format>
    Structure your response as follows:
    2. **Executive Summary**: [2 sentence overview]
    3. **Detailed Response**: [The main content]
    </output_format>
    

**User Prompt**

    
    <context>
    [Insert relevant documents, code snippets, or background info here]
    </context>
    
    <task>
    [Insert specific user request here]
    </task>
    
    <final_instruction>
    Remember to think step-by-step before answering.
    </final_instruction>
    
    

* * *

Thanks for reading! If you have any questions or feedback, please let me know on [Twitter](https://twitter.com/_philschmid) or [LinkedIn](https://www.linkedin.com/in/philipp-schmid-a6a2bb196/).