--!strict
-- Big, TV-friendly & Xbox-gamepad-ready HUD for Skyhop.

local GuiService = game:GetService("GuiService")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")
local sharedFolder = ReplicatedStorage:WaitForChild("Shared")
local LevelData = require(sharedFolder:WaitForChild("LevelData"))
local stageEvent = ReplicatedStorage:WaitForChild("StageEvent") :: RemoteEvent

local screenGui = Instance.new("ScreenGui")
screenGui.Name = "SkyhopHud"
screenGui.ResetOnSpawn = false
screenGui.Parent = playerGui

-- Top-center stage pill (large text for living-room TV viewing)
local stageLabel = Instance.new("TextLabel")
stageLabel.Name = "StageLabel"
stageLabel.Size = UDim2.fromOffset(340, 52)
stageLabel.Position = UDim2.new(0.5, -170, 0, 18)
stageLabel.BackgroundColor3 = Color3.fromRGB(24, 30, 41)
stageLabel.BackgroundTransparency = 0.12
stageLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
stageLabel.Font = Enum.Font.GothamBold
stageLabel.TextSize = 22
stageLabel.Text = ("Stage 1 / %d · %s"):format(LevelData.TotalStages, LevelData.StageNames[1])
stageLabel.Parent = screenGui

local stageCorner = Instance.new("UICorner")
stageCorner.CornerRadius = UDim.new(0, 14)
stageCorner.Parent = stageLabel

-- Star counter pill
local starLabel = Instance.new("TextLabel")
starLabel.Name = "StarLabel"
starLabel.Size = UDim2.fromOffset(150, 52)
starLabel.Position = UDim2.new(0.5, 186, 0, 18)
starLabel.BackgroundColor3 = Color3.fromRGB(24, 30, 41)
starLabel.BackgroundTransparency = 0.12
starLabel.TextColor3 = Color3.fromRGB(255, 213, 79)
starLabel.Font = Enum.Font.GothamBold
starLabel.TextSize = 22
starLabel.Text = "Stars: 0"
starLabel.Parent = screenGui

local starCorner = Instance.new("UICorner")
starCorner.CornerRadius = UDim.new(0, 14)
starCorner.Parent = starLabel

-- Checkpoint toast
local toastLabel = Instance.new("TextLabel")
toastLabel.Name = "ToastLabel"
toastLabel.Size = UDim2.fromOffset(360, 52)
toastLabel.Position = UDim2.new(0.5, -180, 0, 82)
toastLabel.BackgroundColor3 = Color3.fromRGB(46, 160, 67)
toastLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
toastLabel.Font = Enum.Font.GothamBold
toastLabel.TextSize = 22
toastLabel.Visible = false
toastLabel.Parent = screenGui

local toastCorner = Instance.new("UICorner")
toastCorner.CornerRadius = UDim.new(0, 12)
toastCorner.Parent = toastLabel

-- Finish banner (supports both Xbox gamepad focus and walking onto the blue Play Again pad)
local finishFrame = Instance.new("Frame")
finishFrame.Name = "FinishBanner"
finishFrame.Size = UDim2.fromOffset(400, 170)
finishFrame.Position = UDim2.new(0.5, -200, 0.35, -85)
finishFrame.BackgroundColor3 = Color3.fromRGB(24, 30, 41)
finishFrame.Visible = false
finishFrame.Parent = screenGui

local finishCorner = Instance.new("UICorner")
finishCorner.CornerRadius = UDim.new(0, 18)
finishCorner.Parent = finishFrame

local finishTitle = Instance.new("TextLabel")
finishTitle.Size = UDim2.new(1, -24, 0, 50)
finishTitle.Position = UDim2.fromOffset(12, 14)
finishTitle.BackgroundTransparency = 1
finishTitle.TextColor3 = Color3.fromRGB(255, 213, 79)
finishTitle.Font = Enum.Font.GothamBold
finishTitle.TextSize = 28
finishTitle.Text = "You Did It!"
finishTitle.Parent = finishFrame

local finishHint = Instance.new("TextLabel")
finishHint.Size = UDim2.new(1, -24, 0, 28)
finishHint.Position = UDim2.fromOffset(12, 64)
finishHint.BackgroundTransparency = 1
finishHint.TextColor3 = Color3.fromRGB(200, 210, 225)
finishHint.Font = Enum.Font.Gotham
finishHint.TextSize = 16
finishHint.Text = "Step on the blue pad or press Play Again!"
finishHint.Parent = finishFrame

local replayButton = Instance.new("TextButton")
replayButton.Size = UDim2.fromOffset(200, 48)
replayButton.Position = UDim2.new(0.5, -100, 1, -64)
replayButton.BackgroundColor3 = Color3.fromRGB(56, 139, 253)
replayButton.TextColor3 = Color3.fromRGB(255, 255, 255)
replayButton.Font = Enum.Font.GothamBold
replayButton.TextSize = 20
replayButton.Text = "Play Again"
replayButton.Selectable = true
replayButton.Parent = finishFrame

local buttonCorner = Instance.new("UICorner")
buttonCorner.CornerRadius = UDim.new(0, 12)
buttonCorner.Parent = replayButton

replayButton.MouseButton1Click:Connect(function()
	finishFrame.Visible = false
	GuiService.SelectedObject = nil
	stageEvent:FireServer("restart")
end)

local toastToken = 0
local function showToast(message: string)
	toastToken += 1
	local currentToken = toastToken
	toastLabel.Text = message
	toastLabel.Visible = true
	task.delay(2.2, function()
		if toastToken == currentToken then
			toastLabel.Visible = false
		end
	end)
end

stageEvent.OnClientEvent:Connect(function(kind: string, value: number, label: string)
	if kind == "init" or kind == "checkpoint" then
		finishFrame.Visible = false
		GuiService.SelectedObject = nil
		stageLabel.Text = ("Stage %d / %d · %s"):format(value, LevelData.TotalStages, label)
		if kind == "checkpoint" and value > 1 then
			showToast(("Stage %d · %s!"):format(value, label))
		end
	elseif kind == "stars" then
		starLabel.Text = ("Stars: %d"):format(value)
	elseif kind == "finish" then
		finishFrame.Visible = true
		GuiService.SelectedObject = replayButton
	end
end)
