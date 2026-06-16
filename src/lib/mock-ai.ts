import type { ModelId } from "@/types/models";

const LUA_SAMPLE = `-- LimeForge · Roblox Studio sync ready
local Players = game:GetService("Players")

local function onPlayerAdded(player: Player)
\tlocal leaderstats = Instance.new("Folder")
\tleaderstats.Name = "leaderstats"
\tleaderstats.Parent = player

\tlocal coins = Instance.new("IntValue")
\tcoins.Name = "Coins"
\tcoins.Value = 100
\tcoins.Parent = leaderstats
end

Players.PlayerAdded:Connect(onPlayerAdded)`;

export function buildMockResponse(prompt: string, modelId: ModelId): string {
  const trimmed = prompt.trim().slice(0, 120);
  return `**LimeForge** (${modelId}) generated a Luau module for your request:

> ${trimmed || "New Roblox script"}

\`\`\`lua
${LUA_SAMPLE}
\`\`\`

**Sync status:** Ready to push to Roblox Studio via plugin.
- File: \`Server/Leaderstats.server.lua\`
- Changes: +18 lines`;
}

export async function* streamMockResponse(
  prompt: string,
  modelId: ModelId,
): AsyncGenerator<string> {
  const full = buildMockResponse(prompt, modelId);
  const chunks: string[] = [];
  for (let i = 0; i < full.length; i += 18) {
    chunks.push(full.slice(i, i + 18));
  }

  for (const chunk of chunks) {
    await new Promise((r) => setTimeout(r, 28));
    yield chunk;
  }
}

export function extractCodeBlock(text: string): string {
  const match = text.match(/```(?:lua|luau)?\n([\s\S]*?)```/);
  return match?.[1]?.trim() ?? text;
}