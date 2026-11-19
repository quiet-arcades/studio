--!strict
-- Adds playful background scenery (flying geese + toy planes) and Giant Rolling Cat Balls on Stage 2!

local RunService = game:GetService("RunService")
local Workspace = game:GetService("Workspace")

local decorFolder = Instance.new("Folder")
decorFolder.Name = "SkyhopFunExtras"
decorFolder.Parent = Workspace

local function makeAnchoredPart(name: string, size: Vector3, color: Color3, material: Enum.Material?): Part
	local p = Instance.new("Part")
	p.Name = name
	p.Size = size
	p.Color = color
	p.Material = material or Enum.Material.SmoothPlastic
	p.Anchored = true
	p.CanCollide = false
	p.TopSurface = Enum.SurfaceType.Smooth
	p.BottomSurface = Enum.SurfaceType.Smooth
	return p
end

local function weldOffset(parent: BasePart, child: BasePart, offset: CFrame)
	child.CFrame = parent.CFrame * offset
	child.Anchored = false
	child.Massless = true
	child.Parent = parent
	local weld = Instance.new("WeldConstraint")
	weld.Part0 = parent
	weld.Part1 = child
	weld.Parent = parent
end

--------------------------------------------------------------------------------
-- 1. Flying Geese (V-formation gliding in a wide circle high in the sky)
--------------------------------------------------------------------------------
type Goose = {
	body: Part,
	leftWing: Part,
	rightWing: Part,
	offset: Vector3,
	phase: number,
}

local geese: { Goose } = {}
local gooseOffsets = {
	Vector3.new(0, 0, 0),
	Vector3.new(-7, 0.5, 6),
	Vector3.new(7, 0.5, 6),
	Vector3.new(-14, 1, 12),
	Vector3.new(14, 1, 12),
}

for i, offset in ipairs(gooseOffsets) do
	local body = makeAnchoredPart("Goose_" .. i, Vector3.new(2, 1.4, 4.5), Color3.fromRGB(248, 249, 250))
	body.Parent = decorFolder

	local beak = makeAnchoredPart("Beak", Vector3.new(0.8, 0.5, 1.2), Color3.fromRGB(255, 152, 0))
	weldOffset(body, beak, CFrame.new(0, 0.1, -2.7))

	local leftWing = makeAnchoredPart("LeftWing", Vector3.new(3.2, 0.25, 1.8), Color3.fromRGB(230, 235, 240))
	leftWing.Parent = body

	local rightWing = makeAnchoredPart("RightWing", Vector3.new(3.2, 0.25, 1.8), Color3.fromRGB(230, 235, 240))
	rightWing.Parent = body

	table.insert(geese, {
		body = body,
		leftWing = leftWing,
		rightWing = rightWing,
		offset = offset,
		phase = i * 0.6,
	})
end

--------------------------------------------------------------------------------
-- 2. Flying Toy Planes (colorful planes circling the sky)
--------------------------------------------------------------------------------
type Plane = {
	body: Part,
	propeller: Part,
	center: Vector3,
	radius: number,
	speed: number,
	phase: number,
}

local planes: { Plane } = {}
local planeConfigs = {
	{ color = Color3.fromRGB(239, 83, 80), center = Vector3.new(0, 38, -110), radius = 85, speed = 0.28, phase = 0 },
	{ color = Color3.fromRGB(66, 165, 245), center = Vector3.new(0, 46, -180), radius = 95, speed = -0.22, phase = 2.5 },
}

for i, cfg in ipairs(planeConfigs) do
	local body = makeAnchoredPart("ToyPlane_" .. i, Vector3.new(2.6, 2.2, 8), cfg.color)
	body.Parent = decorFolder

	local wings = makeAnchoredPart("Wings", Vector3.new(11, 0.4, 2.6), Color3.fromRGB(255, 245, 157))
	weldOffset(body, wings, CFrame.new(0, 0.2, -0.5))

	local tail = makeAnchoredPart("Tail", Vector3.new(0.4, 2.2, 1.8), cfg.color)
	weldOffset(body, tail, CFrame.new(0, 1.4, 3.2))

	local prop = makeAnchoredPart("Propeller", Vector3.new(3.8, 0.4, 0.3), Color3.fromRGB(60, 60, 60))
	prop.Parent = body

	table.insert(planes, {
		body = body,
		propeller = prop,
		center = cfg.center,
		radius = cfg.radius,
		speed = cfg.speed,
		phase = cfg.phase,
	})
end

--------------------------------------------------------------------------------
-- 3. Giant Rolling Cat Balls on Stage 2 (Cat Ball Alley)
--------------------------------------------------------------------------------
local catColors = {
	Color3.fromRGB(255, 183, 77),  -- Orange tabby
	Color3.fromRGB(245, 245, 245), -- White kitty
	Color3.fromRGB(176, 190, 197), -- Gray kitty
}

type CatBallEntry = {
	ball: Part,
	endZ: number,
	speed: number,
}

local activeCatBalls: { CatBallEntry } = {}
local catSpawnLanes = { -6.5, 0, 6.5 }
local megaSpawnLanes = { -8, 0, 8 }
local laneIndex = 1
local megaLaneIndex = 2
local catColorIndex = 1

local function spawnCatBall(spawnPos: Vector3, diameter: number, endZ: number, rollSpeed: number)
	local mainColor = catColors[catColorIndex]
	catColorIndex = (catColorIndex % #catColors) + 1

	local scale = diameter / 7
	local ball = Instance.new("Part")
	ball.Name = "GiantCatBall"
	ball.Shape = Enum.PartType.Ball
	ball.Size = Vector3.new(diameter, diameter, diameter)
	ball.Position = spawnPos
	ball.Color = mainColor
	ball.Material = Enum.Material.SmoothPlastic
	ball.Anchored = false
	ball.CanCollide = true
	ball.Parent = decorFolder

	-- Cute blocky cat ears, eyes, and pink nose welded so they roll with the ball!
	local leftEar = makeAnchoredPart("LeftEar", Vector3.new(1.8, 1.8, 1.2) * scale, mainColor)
	weldOffset(ball, leftEar, CFrame.new(-2.1 * scale, 3.1 * scale, 0) * CFrame.Angles(0, 0, math.rad(20)))

	local rightEar = makeAnchoredPart("RightEar", Vector3.new(1.8, 1.8, 1.2) * scale, mainColor)
	weldOffset(ball, rightEar, CFrame.new(2.1 * scale, 3.1 * scale, 0) * CFrame.Angles(0, 0, math.rad(-20)))

	local leftEye = makeAnchoredPart("LeftEye", Vector3.new(1.0, 1.1, 0.5) * scale, Color3.fromRGB(30, 30, 35), Enum.Material.Neon)
	weldOffset(ball, leftEye, CFrame.new(-1.3 * scale, 0.7 * scale, 3.4 * scale))

	local rightEye = makeAnchoredPart("RightEye", Vector3.new(1.0, 1.1, 0.5) * scale, Color3.fromRGB(30, 30, 35), Enum.Material.Neon)
	weldOffset(ball, rightEye, CFrame.new(1.3 * scale, 0.7 * scale, 3.4 * scale))

	local nose = makeAnchoredPart("Nose", Vector3.new(1.0, 0.7, 0.5) * scale, Color3.fromRGB(255, 138, 165))
	weldOffset(ball, nose, CFrame.new(0, -0.2 * scale, 3.5 * scale))

	-- Gentle playful bounce when touching a player (no instant kill!)
	local hitDebounce: { [Model]: boolean } = {}
	ball.Touched:Connect(function(hit)
		local character = hit.Parent
		if not character or not character:IsA("Model") or hitDebounce[character] then
			return
		end
		local root = character:FindFirstChild("HumanoidRootPart")
		if root and root:IsA("BasePart") then
			hitDebounce[character] = true
			local pushDir = (root.Position - ball.Position)
			pushDir = Vector3.new(pushDir.X, 0, pushDir.Z)
			if pushDir.Magnitude < 0.1 then
				pushDir = Vector3.new(1, 0, 1)
			end
			root.AssemblyLinearVelocity = pushDir.Unit * 22 + Vector3.new(0, 26, 0)
			task.delay(0.4, function()
				hitDebounce[character] = nil
			end)
		end
	end)

	table.insert(activeCatBalls, { ball = ball, endZ = endZ, speed = rollSpeed })
end

-- Spawn Giant Cat Balls on Stage 2 and Mega Cat Balls on Stage 7
task.spawn(function()
	while true do
		local laneX = catSpawnLanes[laneIndex]
		laneIndex = (laneIndex % #catSpawnLanes) + 1
		spawnCatBall(Vector3.new(laneX, 11, -103), 7, -68, 15)

		local megaX = megaSpawnLanes[megaLaneIndex]
		megaLaneIndex = (megaLaneIndex % #megaSpawnLanes) + 1
		spawnCatBall(Vector3.new(megaX, 36, -443), 9, -407, 17)

		task.wait(2.4)
	end
end)

--------------------------------------------------------------------------------
-- Animation & Rolling Loop
--------------------------------------------------------------------------------
local startTime = os.clock()
RunService.Heartbeat:Connect(function()
	local t = os.clock() - startTime

	-- Animate geese V-formation
	local flockAngle = t * 0.18
	local flockCenter = Vector3.new(math.cos(flockAngle) * 75, 42 + math.sin(t * 0.8) * 2, -135 + math.sin(flockAngle) * 110)
	local nextAngle = flockAngle + 0.05
	local flockAhead = Vector3.new(math.cos(nextAngle) * 75, 42 + math.sin((t + 0.05) * 0.8) * 2, -135 + math.sin(nextAngle) * 110)
	local flockCF = CFrame.lookAt(flockCenter, flockAhead)

	for _, g in ipairs(geese) do
		g.body.CFrame = flockCF * CFrame.new(g.offset)
		local flap = math.sin(t * 7 + g.phase) * 0.45
		g.leftWing.CFrame = g.body.CFrame * CFrame.new(-2.1, 0.2, 0) * CFrame.Angles(0, 0, flap)
		g.rightWing.CFrame = g.body.CFrame * CFrame.new(2.1, 0.2, 0) * CFrame.Angles(0, 0, -flap)
	end

	-- Animate toy planes
	for _, p in ipairs(planes) do
		local a = t * p.speed + p.phase
		local pos = p.center + Vector3.new(math.cos(a) * p.radius, math.sin(t * 1.1 + p.phase) * 3, math.sin(a) * p.radius)
		local aNext = a + (p.speed >= 0 and 0.05 or -0.05)
		local nextPos = p.center + Vector3.new(math.cos(aNext) * p.radius, math.sin((t + 0.05) * 1.1 + p.phase) * 3, math.sin(aNext) * p.radius)
		local bank = p.speed >= 0 and math.rad(15) or math.rad(-15)
		p.body.CFrame = CFrame.lookAt(pos, nextPos) * CFrame.Angles(0, 0, bank)
		p.propeller.CFrame = p.body.CFrame * CFrame.new(0, 0, -4.2) * CFrame.Angles(0, 0, t * 18)
	end

	-- Keep Giant Cat Balls rolling gently toward the player (+Z) and clean up past the runway
	for i = #activeCatBalls, 1, -1 do
		local entry = activeCatBalls[i]
		local ball = entry.ball
		if not ball.Parent or ball.Position.Z > entry.endZ or ball.Position.Y < -10 then
			if ball.Parent then
				ball:Destroy()
			end
			table.remove(activeCatBalls, i)
		else
			local vel = ball.AssemblyLinearVelocity
			ball.AssemblyLinearVelocity = Vector3.new(0, vel.Y, entry.speed)
		end
	end
end)
