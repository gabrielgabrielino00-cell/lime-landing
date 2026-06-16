import type { ModelId } from "@/types/models";

function buildLuauFromPrompt(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes("coin") || p.includes("leaderstat") || p.includes("obby")) {
    return `-- LimeForge · Leaderstats / coins
local Players = game:GetService("Players")

local function setupLeaderstats(player: Player)
\tlocal folder = Instance.new("Folder")
\tfolder.Name = "leaderstats"
\tfolder.Parent = player

\tlocal coins = Instance.new("IntValue")
\tcoins.Name = "Coins"
\tcoins.Value = 0
\tcoins.Parent = folder
end

Players.PlayerAdded:Connect(setupLeaderstats)`;
  }

  if (p.includes("datastore") || p.includes("save") || p.includes("daily")) {
    return `-- LimeForge · DataStore daily reward
local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")
local store = DataStoreService:GetDataStore("DailyRewards_v1")

local function claimReward(player: Player)
\tlocal key = "u_" .. player.UserId
\tlocal ok, last = pcall(function()
\t\treturn store:GetAsync(key)
\tend)
\tif not ok then return end
\tlocal now = os.time()
\tif last and now - last < 86400 then return end
\tpcall(function()
\t\tstore:SetAsync(key, now)
\tend)
\t-- grant reward here
end

Players.PlayerAdded:Connect(function(player)
\tplayer.CharacterAdded:Connect(function()
\t\tclaimReward(player)
\tend)
end)`;
  }

  if (p.includes("shop") || p.includes("gui") || p.includes("ui")) {
    return `-- LimeForge · Shop UI
local Players = game:GetService("Players")

local function createShopGui(player: Player)
\tlocal gui = Instance.new("ScreenGui")
\tgui.Name = "ShopUI"
\tgui.ResetOnSpawn = false
\tgui.Parent = player:WaitForChild("PlayerGui")

\tlocal frame = Instance.new("Frame")
\tframe.Size = UDim2.fromScale(0.35, 0.5)
\tframe.Position = UDim2.fromScale(0.325, 0.25)
\tframe.BackgroundColor3 = Color3.fromRGB(18, 18, 28)
\tframe.Parent = gui
end

Players.PlayerAdded:Connect(createShopGui)`;
  }

  return `-- LimeForge · Generated module
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local module = {}

function module.init()
\tprint("[LimeForge] System ready")
end

Players.PlayerAdded:Connect(function(player)
\tmodule.init()
end)

return module`;
}

export function buildMockResponse(prompt: string, modelId: ModelId): string {
  const trimmed = prompt.trim().slice(0, 160);
  const code = buildLuauFromPrompt(prompt);

  return `**LimeForge** (${modelId}) generated Luau for your request:

> ${trimmed || "New Roblox script"}

\`\`\`lua
${code}
\`\`\`

**Next steps**
- Review the script in the editor panel
- Click **Sync** to push to Roblox Studio via plugin
- Edit manually if needed — LimeForge keeps version history`;
}

export async function* streamMockResponse(
  prompt: string,
  modelId: ModelId,
): AsyncGenerator<string> {
  const full = buildMockResponse(prompt, modelId);
  const chunks: string[] = [];
  for (let i = 0; i < full.length; i += 24) {
    chunks.push(full.slice(i, i + 24));
  }

  for (const chunk of chunks) {
    await new Promise((r) => setTimeout(r, 12));
    yield chunk;
  }
}

export function extractCodeBlock(text: string): string {
  const match = text.match(/```(?:lua|luau)?\n([\s\S]*?)```/);
  return match?.[1]?.trim() ?? text;
}