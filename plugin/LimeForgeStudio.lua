--[[
  LimeForge Studio Plugin
  Install: Roblox Studio → Plugins → Plugin Folder → save this file
  Configure API key + project ID in plugin widget
]]

local HttpService = game:GetService("HttpService")
local Selection = game:GetService("Selection")

local API_BASE = "http://localhost:3000" -- change for production
local API_KEY = "" -- set from LimeForge Settings
local PROJECT_ID = "" -- set from app URL /app/[projectId]

local toolbar = plugin:CreateToolbar("LimeForge")
local syncButton = toolbar:CreateButton(
  "Sync",
  "Pull latest Luau from LimeForge",
  "rbxassetid://6031075938"
)

local function pullLatest()
  if API_KEY == "" or PROJECT_ID == "" then
    warn("[LimeForge] Set API_KEY and PROJECT_ID in plugin source")
    return
  end

  local ok, response = pcall(function()
    return HttpService:RequestAsync({
      Url = API_BASE .. "/api/sync/pull",
      Method = "GET",
      Headers = {
        ["x-limeforge-key"] = API_KEY,
        ["x-project-id"] = PROJECT_ID,
      },
    })
  end)

  if not ok or not response.Success then
    warn("[LimeForge] Pull failed", response and response.StatusCode)
    return
  end

  local data = HttpService:JSONDecode(response.Body)
  local file = data.files and data.files[1]
  if not file then
    warn("[LimeForge] No files in response")
    return
  end

  local target = Selection:Get()[1]
  if target and target:IsA("LuaSourceContainer") then
    target.Source = file.content
    print("[LimeForge] Synced to", target:GetFullName())
  else
    local script = Instance.new("Script")
    script.Name = file.name:gsub("%.server%.lua", "")
    script.Source = file.content
    script.Parent = game.ServerScriptService
    print("[LimeForge] Created", script.Name, "in ServerScriptService")
  end
end

syncButton.Click:Connect(pullLatest)
print("[LimeForge] Plugin loaded. Set API_KEY + PROJECT_ID then click Sync.")