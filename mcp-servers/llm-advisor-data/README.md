# LLM Advisor data validation

Decision-tree writes validate the existing document and the proposed result against the same nested shape. Nodes permit `question` and `options`. Options require nonblank `text` and `next`, and permit optional string `track` and recommendation-array `tools`.

Every present `tools` array must be nonempty, including on intermediate options: the browser workflow selector reads its first recommendation. Terminal options targeting `recommendation` must provide this array. Each recommendation requires nonempty strings `name`, `description`, and `prompt`, plus a nonempty array of nonempty model-name strings in `tools`. Optional `tips` must be a string. Unsupported node, option, and recommendation fields are rejected before persistence.

Graph validation runs on the proposed result, so adding a missing destination can still repair a dangling edge. Existing malformed nested shapes must be corrected before a write can proceed.

The data-write suite uses `npm test` in this directory (Node.js 20 or newer).
It is separate from the GitHub-hosted Content checks job, which validates
the shipped JSON and content. This public repository runs CI on GitHub-hosted
runners, not fleet machines. Tests use temporary copies and synthetic malformed nodes; they do not edit the shipped catalog.
