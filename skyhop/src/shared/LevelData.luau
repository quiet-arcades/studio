--!strict
-- Single source of truth for Skyhop's 5-stage kid-friendly & Xbox-ready obstacle course.
-- Designed for 5-year-olds on a controller: wide platforms (>= 10 studs), gentle gaps,
-- spinning stars to guide the way, bounce pads, speed pads, and zero unfair traps.

export type PartKind = "platform" | "checkpoint" | "hazard" | "moving" | "bounce" | "speed" | "star" | "finish" | "restart"

export type PartSpec = {
	id: string,
	stage: number,
	kind: PartKind,
	position: { number }, -- { x, y, z }
	size: { number }, -- { x, y, z }
	color: { number }, -- { r, g, b } 0-255
	moveOffset: { number }?, -- optional { dx, dy, dz } for "moving" parts
	moveDuration: number?, -- seconds one-way
	bouncePower: number?, -- upward velocity for "bounce" pads
}

local LevelData = {}

LevelData.TotalStages = 8
LevelData.FallLimitY = -20

LevelData.StageNames = {
	[1] = "Cloudy Steps",
	[2] = "Cat Ball Alley",
	[3] = "Bouncy Meadow",
	[4] = "Floating Boat",
	[5] = "Rainbow Zig-Zag",
	[6] = "Super Bounce",
	[7] = "Mega Cat Bridge",
	[8] = "Summit Party",
}

LevelData.Parts = {
	-- Stage 1: Cloudy Steps (wide, easy hops + guiding stars)
	{ id = "s1_spawn", stage = 1, kind = "checkpoint", position = { 0, 4, 0 }, size = { 18, 2, 18 }, color = { 82, 196, 128 } },
	{ id = "s1_p1", stage = 1, kind = "platform", position = { 0, 4.5, -16 }, size = { 12, 2, 12 }, color = { 100, 181, 246 } },
	{ id = "s1_star1", stage = 1, kind = "star", position = { 0, 8, -16 }, size = { 2.5, 2.5, 2.5 }, color = { 255, 213, 79 } },
	{ id = "s1_p2", stage = 1, kind = "platform", position = { 3, 5, -31 }, size = { 12, 2, 12 }, color = { 100, 181, 246 } },
	{ id = "s1_star2", stage = 1, kind = "star", position = { 3, 8.5, -31 }, size = { 2.5, 2.5, 2.5 }, color = { 255, 213, 79 } },
	{ id = "s1_p3", stage = 1, kind = "platform", position = { -2, 5.5, -46 }, size = { 12, 2, 12 }, color = { 100, 181, 246 } },

	-- Stage 2: Cat Ball Alley (wide runway with speed pad & giant rolling cat balls to dodge!)
	{ id = "s2_cp", stage = 2, kind = "checkpoint", position = { 0, 6, -62 }, size = { 16, 2, 16 }, color = { 82, 196, 128 } },
	{ id = "s2_runway", stage = 2, kind = "platform", position = { 0, 6, -89 }, size = { 22, 2, 34 }, color = { 207, 216, 220 } },
	{ id = "s2_speed1", stage = 2, kind = "speed", position = { 0, 7.1, -76 }, size = { 10, 0.3, 6 }, color = { 41, 182, 246 } },
	{ id = "s2_star1", stage = 2, kind = "star", position = { -6, 9.5, -88 }, size = { 2.5, 2.5, 2.5 }, color = { 255, 213, 79 } },
	{ id = "s2_star2", stage = 2, kind = "star", position = { 6, 9.5, -96 }, size = { 2.5, 2.5, 2.5 }, color = { 255, 213, 79 } },
	{ id = "s2_p1", stage = 2, kind = "platform", position = { 0, 6.5, -114 }, size = { 12, 2, 12 }, color = { 100, 181, 246 } },

	-- Stage 3: Bouncy Meadow (trampoline bounce pad onto a big upper island)
	{ id = "s3_cp", stage = 3, kind = "checkpoint", position = { 0, 7, -130 }, size = { 16, 2, 16 }, color = { 82, 196, 128 } },
	{ id = "s3_p1", stage = 3, kind = "platform", position = { 0, 7, -148 }, size = { 14, 2, 14 }, color = { 129, 199, 132 } },
	{ id = "s3_bounce1", stage = 3, kind = "bounce", position = { 0, 8.2, -148 }, size = { 8, 0.6, 8 }, color = { 240, 98, 146 }, bouncePower = 75 },
	{ id = "s3_star1", stage = 3, kind = "star", position = { 0, 15, -158 }, size = { 2.5, 2.5, 2.5 }, color = { 255, 213, 79 } },
	{ id = "s3_upper", stage = 3, kind = "platform", position = { 0, 13, -166 }, size = { 16, 2, 16 }, color = { 129, 199, 132 } },

	-- Stage 4: Floating Boat (slow, wide moving island)
	{ id = "s4_cp", stage = 4, kind = "checkpoint", position = { 0, 13.5, -186 }, size = { 16, 2, 16 }, color = { 82, 196, 128 } },
	{ id = "s4_boat", stage = 4, kind = "moving", position = { -4, 13.5, -204 }, size = { 14, 2, 14 }, color = { 186, 104, 200 }, moveOffset = { 8, 0, 0 }, moveDuration = 3.2 },
	{ id = "s4_star1", stage = 4, kind = "star", position = { 0, 17, -204 }, size = { 2.5, 2.5, 2.5 }, color = { 255, 213, 79 } },
	{ id = "s4_p1", stage = 4, kind = "platform", position = { 0, 14, -222 }, size = { 14, 2, 14 }, color = { 100, 181, 246 } },

	-- Stage 5: Rainbow Zig-Zag (bright colorful wide islands)
	{ id = "s5_cp", stage = 5, kind = "checkpoint", position = { 0, 14.5, -242 }, size = { 16, 2, 16 }, color = { 82, 196, 128 } },
	{ id = "s5_r1", stage = 5, kind = "platform", position = { -6, 15, -258 }, size = { 12, 2, 12 }, color = { 239, 83, 80 } },
	{ id = "s5_star1", stage = 5, kind = "star", position = { -6, 18.5, -258 }, size = { 2.5, 2.5, 2.5 }, color = { 255, 213, 79 } },
	{ id = "s5_r2", stage = 5, kind = "platform", position = { 6, 15.5, -272 }, size = { 12, 2, 12 }, color = { 255, 167, 38 } },
	{ id = "s5_star2", stage = 5, kind = "star", position = { 6, 19, -272 }, size = { 2.5, 2.5, 2.5 }, color = { 255, 213, 79 } },
	{ id = "s5_r3", stage = 5, kind = "platform", position = { -6, 16, -286 }, size = { 12, 2, 12 }, color = { 255, 238, 88 } },
	{ id = "s5_r4", stage = 5, kind = "platform", position = { 0, 16.5, -300 }, size = { 14, 2, 12 }, color = { 171, 71, 188 } },

	-- Stage 6: Super Bounce (double trampoline climb!)
	{ id = "s6_cp", stage = 6, kind = "checkpoint", position = { 0, 17, -318 }, size = { 16, 2, 16 }, color = { 82, 196, 128 } },
	{ id = "s6_p1", stage = 6, kind = "platform", position = { 0, 17, -338 }, size = { 14, 2, 14 }, color = { 129, 199, 132 } },
	{ id = "s6_bounce1", stage = 6, kind = "bounce", position = { 0, 18.2, -338 }, size = { 8, 0.6, 8 }, color = { 240, 98, 146 }, bouncePower = 78 },
	{ id = "s6_star1", stage = 6, kind = "star", position = { 0, 25, -349 }, size = { 2.5, 2.5, 2.5 }, color = { 255, 213, 79 } },
	{ id = "s6_p2", stage = 6, kind = "platform", position = { 0, 23, -358 }, size = { 16, 2, 16 }, color = { 129, 199, 132 } },
	{ id = "s6_bounce2", stage = 6, kind = "bounce", position = { 0, 24.2, -358 }, size = { 8, 0.6, 8 }, color = { 240, 98, 146 }, bouncePower = 78 },
	{ id = "s6_star2", stage = 6, kind = "star", position = { 0, 31, -369 }, size = { 2.5, 2.5, 2.5 }, color = { 255, 213, 79 } },
	{ id = "s6_p3", stage = 6, kind = "platform", position = { 0, 29, -378 }, size = { 16, 2, 16 }, color = { 129, 199, 132 } },

	-- Stage 7: Mega Cat Bridge (super-wide bridge + speed pad + 9-stud Mega Cat Balls!)
	{ id = "s7_cp", stage = 7, kind = "checkpoint", position = { 0, 29.5, -398 }, size = { 16, 2, 16 }, color = { 82, 196, 128 } },
	{ id = "s7_bridge", stage = 7, kind = "platform", position = { 0, 29.5, -427 }, size = { 26, 2, 36 }, color = { 207, 216, 220 } },
	{ id = "s7_speed1", stage = 7, kind = "speed", position = { 0, 30.6, -413 }, size = { 12, 0.3, 6 }, color = { 41, 182, 246 } },
	{ id = "s7_star1", stage = 7, kind = "star", position = { -8, 33, -427 }, size = { 2.5, 2.5, 2.5 }, color = { 255, 213, 79 } },
	{ id = "s7_star2", stage = 7, kind = "star", position = { 8, 33, -435 }, size = { 2.5, 2.5, 2.5 }, color = { 255, 213, 79 } },
	{ id = "s7_p1", stage = 7, kind = "platform", position = { 0, 30, -455 }, size = { 14, 2, 14 }, color = { 100, 181, 246 } },

	-- Stage 8: Summit Party (big finish island + walk-on Play Again pad)
	{ id = "s8_cp", stage = 8, kind = "checkpoint", position = { 0, 30.5, -474 }, size = { 16, 2, 16 }, color = { 82, 196, 128 } },
	{ id = "s8_p1", stage = 8, kind = "platform", position = { 0, 31.5, -492 }, size = { 12, 2, 12 }, color = { 255, 183, 77 } },
	{ id = "s8_star1", stage = 8, kind = "star", position = { 0, 35, -492 }, size = { 2.5, 2.5, 2.5 }, color = { 255, 213, 79 } },
	{ id = "s8_finish", stage = 8, kind = "finish", position = { 0, 32.5, -514 }, size = { 24, 2, 24 }, color = { 255, 213, 79 } },
	{ id = "s8_restart", stage = 8, kind = "restart", position = { 0, 33.7, -519 }, size = { 8, 0.5, 8 }, color = { 56, 139, 253 } },
}

return LevelData
