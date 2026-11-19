--!strict
-- Builds the Skyhop course from LevelData and manages checkpoints, stars, bounce/speed pads, and respawns.

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")
local Workspace = game:GetService("Workspace")

local sharedFolder = ReplicatedStorage:WaitForChild("Shared")
local LevelData = require(sharedFolder:WaitForChild("LevelData"))

local stageEvent = Instance.new("RemoteEvent")
stageEvent.Name = "StageEvent"
stageEvent.Parent = ReplicatedStorage

local courseFolder = Instance.new("Folder")
courseFolder.Name = "SkyhopCourse"
courseFolder.Parent = Workspace

local checkpointSpawns: { [number]: BasePart } = {}
local checkpointLights: { [number]: PointLight } = {}
local playerStage: { [Player]: number } = {}
local playerStars: { [Player]: number } = {}
local playerFinished: { [Player]: boolean } = {}
local respawnDebounce: { [Player]: boolean } = {}
local speedBoostToken: { [Player]: number } = {}
local starParts: { BasePart } = {}

local function toVector3(coords: { number }): Vector3
	return Vector3.new(coords[1], coords[2], coords[3])
end

local function toColor3(rgb: { number }): Color3
	return Color3.fromRGB(rgb[1], rgb[2], rgb[3])
end

local function getStatValue(player: Player, statName: string): IntValue?
	local stats = player:FindFirstChild("leaderstats")
	if not stats then
		return nil
	end
	local val = stats:FindFirstChild(statName)
	if val and val:IsA("IntValue") then
		return val
	end
	return nil
end

local function respawnAtCheckpoint(player: Player)
	if respawnDebounce[player] then
		return
	end
	respawnDebounce[player] = true

	local stage = playerStage[player] or 1
	local pad = checkpointSpawns[stage] or checkpointSpawns[1]
	local character = player.Character
	if character and pad then
		local root = character:FindFirstChild("HumanoidRootPart")
		local humanoid = character:FindFirstChildOfClass("Humanoid")
		if root and root:IsA("BasePart") then
			root.AssemblyLinearVelocity = Vector3.zero
			root.CFrame = pad.CFrame + Vector3.new(0, 4, 0)
		end
		if humanoid then
			humanoid.Health = humanoid.MaxHealth
			humanoid.WalkSpeed = 16
		end
	end

	task.delay(0.35, function()
		respawnDebounce[player] = nil
	end)
end

local function setPlayerStage(player: Player, newStage: number, notify: boolean)
	playerStage[player] = newStage
	local stageVal = getStatValue(player, "Stage")
	if stageVal then
		stageVal.Value = newStage
	end
	if notify then
		stageEvent:FireClient(player, "checkpoint", newStage, LevelData.StageNames[newStage] or "")
	end
end

local function resetStarsForAll()
	for _, star in ipairs(starParts) do
		star.Transparency = 0
		star:SetAttribute("Collected", false)
	end
end

local function restartPlayer(player: Player)
	playerFinished[player] = false
	playerStars[player] = 0
	local starsVal = getStatValue(player, "Stars")
	if starsVal then
		starsVal.Value = 0
	end
	resetStarsForAll()
	setPlayerStage(player, 1, false)
	respawnAtCheckpoint(player)
	stageEvent:FireClient(player, "checkpoint", 1, LevelData.StageNames[1])
	stageEvent:FireClient(player, "stars", 0, "")
end

local function createPart(spec: any): BasePart
	local part: BasePart
	if spec.id == "s1_spawn" then
		local spawn = Instance.new("SpawnLocation")
		spawn.Duration = 0
		part = spawn
	else
		part = Instance.new("Part")
	end

	part.Name = spec.id
	part.Size = toVector3(spec.size)
	part.Position = toVector3(spec.position)
	part.Color = toColor3(spec.color)
	part.Anchored = true
	part.TopSurface = Enum.SurfaceType.Smooth
	part.BottomSurface = Enum.SurfaceType.Smooth

	if spec.kind == "hazard" then
		part.Material = Enum.Material.Neon
		part.Touched:Connect(function(hit)
			local character = hit.Parent
			local player = character and Players:GetPlayerFromCharacter(character)
			if player then
				respawnAtCheckpoint(player)
			end
		end)
	elseif spec.kind == "checkpoint" then
		part.Material = Enum.Material.SmoothPlastic
		checkpointSpawns[spec.stage] = part

		local light = Instance.new("PointLight")
		light.Color = Color3.fromRGB(82, 196, 128)
		light.Range = 16
		light.Brightness = 1.2
		light.Parent = part
		checkpointLights[spec.stage] = light

		part.Touched:Connect(function(hit)
			local character = hit.Parent
			local player = character and Players:GetPlayerFromCharacter(character)
			if player and (playerStage[player] or 1) < spec.stage then
				setPlayerStage(player, spec.stage, true)
			end
		end)
	elseif spec.kind == "moving" and spec.moveOffset then
		part.Material = Enum.Material.SmoothPlastic
		local startPos = part.Position
		local endPos = startPos + toVector3(spec.moveOffset)
		local tweenInfo = TweenInfo.new(
			spec.moveDuration or 3.0,
			Enum.EasingStyle.Sine,
			Enum.EasingDirection.InOut,
			-1,
			true
		)
		TweenService:Create(part, tweenInfo, { Position = endPos }):Play()
	elseif spec.kind == "bounce" then
		part.Material = Enum.Material.Neon
		local power = spec.bouncePower or 75
		part.Touched:Connect(function(hit)
			local character = hit.Parent
			if not character then
				return
			end
			local root = character:FindFirstChild("HumanoidRootPart")
			if root and root:IsA("BasePart") then
				local vel = root.AssemblyLinearVelocity
				root.AssemblyLinearVelocity = Vector3.new(vel.X, power, vel.Z)
			end
		end)
	elseif spec.kind == "speed" then
		part.Material = Enum.Material.Neon
		part.CanCollide = false
		part.Touched:Connect(function(hit)
			local character = hit.Parent
			local player = character and Players:GetPlayerFromCharacter(character)
			local humanoid = character and character:FindFirstChildOfClass("Humanoid")
			if player and humanoid then
				local nextToken = (speedBoostToken[player] or 0) + 1
				speedBoostToken[player] = nextToken
				humanoid.WalkSpeed = 28
				task.delay(2.5, function()
					if speedBoostToken[player] == nextToken and humanoid.Parent then
						humanoid.WalkSpeed = 16
					end
				end)
			end
		end)
	elseif spec.kind == "star" then
		part.Material = Enum.Material.Neon
		part.CanCollide = false
		part.Shape = Enum.PartType.Ball
		table.insert(starParts, part)

		local spinInfo = TweenInfo.new(2.0, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut, -1)
		TweenService:Create(part, spinInfo, { Orientation = Vector3.new(0, 360, 0) }):Play()

		part.Touched:Connect(function(hit)
			if part:GetAttribute("Collected") then
				return
			end
			local character = hit.Parent
			local player = character and Players:GetPlayerFromCharacter(character)
			if player then
				part:SetAttribute("Collected", true)
				part.Transparency = 1
				local newStars = (playerStars[player] or 0) + 1
				playerStars[player] = newStars
				local starsVal = getStatValue(player, "Stars")
				if starsVal then
					starsVal.Value = newStars
				end
				stageEvent:FireClient(player, "stars", newStars, "")
			end
		end)
	elseif spec.kind == "finish" then
		part.Material = Enum.Material.Neon
		part.Touched:Connect(function(hit)
			local character = hit.Parent
			local player = character and Players:GetPlayerFromCharacter(character)
			if player and not playerFinished[player] then
				playerFinished[player] = true
				stageEvent:FireClient(player, "finish", LevelData.TotalStages, "Great Job!")
			end
		end)
	elseif spec.kind == "restart" then
		part.Material = Enum.Material.Neon
		part.Touched:Connect(function(hit)
			local character = hit.Parent
			local player = character and Players:GetPlayerFromCharacter(character)
			if player and playerFinished[player] then
				restartPlayer(player)
			end
		end)
	else
		part.Material = Enum.Material.SmoothPlastic
	end

	part.Parent = courseFolder
	return part
end

for _, spec in ipairs(LevelData.Parts) do
	createPart(spec)
end

stageEvent.OnServerEvent:Connect(function(player, action)
	if action == "restart" then
		restartPlayer(player)
	end
end)

Players.PlayerAdded:Connect(function(player)
	local leaderstats = Instance.new("Folder")
	leaderstats.Name = "leaderstats"
	leaderstats.Parent = player

	local stageVal = Instance.new("IntValue")
	stageVal.Name = "Stage"
	stageVal.Value = 1
	stageVal.Parent = leaderstats

	local starsVal = Instance.new("IntValue")
	starsVal.Name = "Stars"
	starsVal.Value = 0
	starsVal.Parent = leaderstats

	playerStage[player] = 1
	playerStars[player] = 0
	playerFinished[player] = false

	player.CharacterAdded:Connect(function()
		task.wait(0.1)
		respawnAtCheckpoint(player)
		stageEvent:FireClient(player, "init", playerStage[player], LevelData.StageNames[playerStage[player]] or "")
		stageEvent:FireClient(player, "stars", playerStars[player] or 0, "")
	end)
end)

Players.PlayerRemoving:Connect(function(player)
	playerStage[player] = nil
	playerStars[player] = nil
	playerFinished[player] = nil
	respawnDebounce[player] = nil
	speedBoostToken[player] = nil
end)

RunService.Heartbeat:Connect(function()
	for _, player in ipairs(Players:GetPlayers()) do
		local character = player.Character
		if character then
			local root = character:FindFirstChild("HumanoidRootPart")
			if root and root:IsA("BasePart") and root.Position.Y < LevelData.FallLimitY then
				respawnAtCheckpoint(player)
			end
		end
	end
end)
