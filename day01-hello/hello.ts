import { config } from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Load ANTHROPIC_API_KEY from the .env file in the parent folder (relative to this script).
const here = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(here, "..", ".env") });

// The SDK reads ANTHROPIC_API_KEY from the environment automatically.
const client = new Anthropic();

const message = await client.beta.messages.create({
  model: "claude-sonnet-5-5",
  max_tokens: 1024,
  betas: ["server-side-fallback-2026-07-01"],
  fallbacks: "default",
  messages: [
    { role: "user", content: "In two sentences, what is a general ledger?" },
  ],
});

if (message.stop_reason === "refusal") {
  console.log("Model declined:", message.stop_details?.explanation ?? "no explanation");
} else {
  for (const block of message.content) {
    if (block.type === "text") console.log(block.text);
  }
}

console.log(message.usage.input_tokens);
console.log(message.usage.output_tokens);
