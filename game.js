const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ui = {
  mode: document.getElementById("mode"),
  p1Fighter: document.getElementById("p1Fighter"),
  p2Fighter: document.getElementById("p2Fighter"),
  start: document.getElementById("start"),
  status: document.getElementById("matchStatus"),
  p1Name: document.getElementById("p1Name"),
  p2Name: document.getElementById("p2Name"),
  p1Percent: document.getElementById("p1Percent"),
  p2Percent: document.getElementById("p2Percent"),
  p1Stocks: document.getElementById("p1Stocks"),
  p2Stocks: document.getElementById("p2Stocks"),
  p1BioName: document.getElementById("p1BioName"),
  p2BioName: document.getElementById("p2BioName"),
  p1Bio: document.getElementById("p1Bio"),
  p2Bio: document.getElementById("p2Bio")
};

const W = canvas.width;
const H = canvas.height;
const keys = new Set();
const touches = new Set();
const PLAYER_SCALE = 1.35;

const fighters = [
  {
    id: "connor",
    name: "Connor",
    title: "Bad-Back Psyborg",
    bio: "Balanced distance and close fighter with back-brace tech, cyborg optics, and suspicious posture.",
    color: "#4aa8ff",
    glow: "#bfe6ff",
    speed: 5.15,
    jump: 12.5,
    weight: 1,
    w: 42,
    h: 66,
    moves: {
      neutralAttack: move("Back-Brace Bash", "BRACE", 7, 56, 44, 8, 17),
      sideAttack: move("Servo Spine Lariat", "LARIAT", 10, 76, 46, 11, 24, { dash: 3.8 }),
      upAttack: move("Posture Corrector", "POSTURE", 9, 54, 78, 11, 23, { y: -22, angle: "up" }),
      downAttack: move("Lumbar Sweep", "SWEEP", 8, 68, 28, 8, 20, { y: 44, angle: "low" }),
      airAttack: move("Cyborg Dropkick", "DROP KICK", 9, 64, 48, 10, 21),
      neutralSpecial: move("Sciatica Spine Beam", "SPINE BEAM", 13, 142, 34, 12, 34),
      sideSpecial: move("Brace Rocket", "ROCKET", 12, 94, 42, 13, 33, { dash: 8 }),
      upSpecial: move("Emergency Chiropractor Boost", "BOOST", 10, 56, 78, 12, 40, { recoverY: -14, recoverX: 4, y: -30 }),
      downSpecial: move("Back Spasm Counter", "SPASM", 14, 66, 54, 14, 38, { armor: true })
    }
  },
  {
    id: "hoban",
    name: "Hoban",
    title: "Clumsy Heavy Lifter",
    bio: "Heavy and clumsy. His lifting moves hit hard, and his down special buffs him if he gets time to chug protein.",
    color: "#d07749",
    glow: "#ffe0b0",
    speed: 3.9,
    jump: 10.4,
    weight: 1.32,
    w: 54,
    h: 76,
    moves: {
      neutralAttack: move("Clumsy Plate Jab", "PLATE", 9, 56, 48, 10, 22),
      sideAttack: move("Dropped Dumbbell", "DUMBBELL", 14, 70, 58, 14, 31),
      upAttack: move("Overhead Press", "PRESS", 13, 58, 86, 14, 30, { y: -28, angle: "up" }),
      downAttack: move("Leg Day Sweep", "LEG DAY", 11, 76, 34, 11, 27, { y: 50, angle: "low" }),
      airAttack: move("Flying Kettlebell", "KETTLE", 12, 66, 54, 13, 28),
      neutralSpecial: move("Nut Tap", "NUT TAP", 16, 48, 34, 18, 34, { y: 42, lowBlow: true }),
      sideSpecial: move("Bench Press Charge", "BENCH", 17, 88, 56, 18, 44, { dash: 5.5 }),
      upSpecial: move("Power Clean Hop", "CLEAN", 13, 60, 78, 14, 44, { recoverY: -11, recoverX: 2.5, y: -26 }),
      downSpecial: { type: "buff", name: "Protein Shake", label: "PROTEIN", lag: 95, buffDuration: 520, buffPower: 1.35 }
    }
  },
  {
    id: "ronak",
    name: "Ronak",
    title: "Bad-Knee Crutch Sniper",
    bio: "Slow distance character with bad knees and crutches. He cannot move fast, but he hits from far away and hits pretty hard.",
    color: "#9f86ff",
    glow: "#ddd5ff",
    speed: 3.65,
    jump: 10.8,
    weight: 1.05,
    w: 42,
    h: 68,
    moves: {
      neutralAttack: move("Crutch Check", "CRUTCH", 10, 92, 42, 11, 25),
      sideAttack: move("Two-Crutch Poke", "POKE", 13, 128, 34, 13, 33),
      upAttack: move("Knee Brace Uppercut", "KNEE UP", 11, 64, 82, 13, 29, { y: -28, angle: "up" }),
      downAttack: move("Bad Knee Trip", "TRIP", 10, 82, 30, 10, 26, { y: 48, angle: "low" }),
      airAttack: move("Air Crutch Swipe", "AIR CRUTCH", 11, 96, 44, 12, 28),
      neutralSpecial: move("Knee Brace Launcher", "LAUNCHER", 16, 158, 34, 15, 42),
      sideSpecial: move("Crutch Javelin", "JAVELIN", 14, 176, 28, 13, 40),
      upSpecial: move("Crutch Vault", "VAULT", 10, 66, 76, 12, 42, { recoverY: -13, recoverX: 3, y: -24 }),
      downSpecial: move("Knee Lockdown", "LOCKDOWN", 12, 84, 34, 15, 35, { y: 48, angle: "low" })
    }
  },
  {
    id: "ben-meyerson",
    name: "Ben-Meyerson",
    title: "Chaotic Rude Menace",
    bio: "Light, fast, chaotic, and rude. His jokes come out too fast, and he is super effective on Ben Long.",
    color: "#ff4faf",
    glow: "#ffd1eb",
    speed: 6.7,
    jump: 14.2,
    weight: 0.78,
    w: 38,
    h: 60,
    moves: {
      neutralAttack: move("Uncalled-For Comment", "RUDE", 7, 62, 42, 9, 15),
      sideAttack: move("Personal Attack Dash", "PERSONAL", 9, 82, 44, 11, 20, { dash: 6.2 }),
      upAttack: move("Roast From Below", "ROAST", 8, 56, 76, 11, 19, { y: -24, angle: "up" }),
      downAttack: move("Ankle-Biting Take", "LOW TAKE", 8, 74, 30, 9, 18, { y: 46, angle: "low" }),
      airAttack: move("Chaotic Elbow", "ELBOW", 9, 68, 48, 11, 17),
      neutralSpecial: move("Group Chat Violation", "NO FILTER", 12, 108, 46, 13, 27),
      sideSpecial: move("Absolutely Feral Dash", "FERAL", 11, 96, 42, 12, 24, { dash: 9 }),
      upSpecial: move("Panic Bounce", "BOUNCE", 8, 56, 74, 11, 31, { recoverY: -15, recoverX: 5, y: -24 }),
      downSpecial: move("Too Specific Insult", "SPECIFIC", 13, 78, 40, 15, 32)
    }
  },
  {
    id: "ben-long",
    name: "Ben Long",
    title: "Tiny Generic Club Swordsman",
    bio: "Painfully generic swordsman, except his sword is just a golf club. Simple, honest, tiny, and painfully default.",
    color: "#ffce44",
    glow: "#fff3a7",
    speed: 5.05,
    jump: 11.8,
    weight: 0.82,
    w: 34,
    h: 46,
    moves: {
      neutralAttack: move("Regular Golf Club Swipe", "CLUB", 8, 74, 34, 9, 18),
      sideAttack: move("Default Fairway Slash", "SIDE CLUB", 10, 94, 36, 11, 25),
      upAttack: move("Plain Nine-Iron Up Slash", "9 IRON", 9, 66, 76, 11, 24, { y: -26, angle: "up" }),
      downAttack: move("Little Boot Sweep", "SWEEP", 7, 66, 26, 8, 18, { y: 36, angle: "low" }),
      airAttack: move("Tiny Air Club", "AIR CLUB", 8, 78, 36, 10, 20),
      neutralSpecial: move("Golf Ball Drive", "GOLF BALL", 11, 148, 30, 12, 32, { luckyGolf: true }),
      sideSpecial: move("Generic Golf Club Dash", "DASH CLUB", 11, 104, 34, 12, 30, { dash: 7 }),
      upSpecial: move("Basic Recovery Spin", "SPIN", 10, 66, 70, 12, 36, { recoverY: -13, recoverX: 4, y: -22 }),
      downSpecial: move("Normal Counter Pose", "COUNTER", 13, 58, 42, 13, 34, { armor: true })
    }
  }
];

const fighterLooks = {
  connor: {
    skin: "#d6aa86",
    skinShade: "#b98263",
    hair: "#2b211c",
    shirt: "#2d78a8",
    shirtShade: "#163a58",
    pants: "#172236",
    shoes: "#111827",
    build: 1,
    hairStyle: "messy"
  },
  hoban: {
    skin: "#c88f6a",
    skinShade: "#996345",
    hair: "#3a2418",
    shirt: "#9b4b2b",
    shirtShade: "#5b2618",
    pants: "#20242c",
    shoes: "#1b1716",
    build: 1.32,
    hairStyle: "short"
  },
  ronak: {
    skin: "#b77b55",
    skinShade: "#875239",
    hair: "#17110e",
    shirt: "#6654b8",
    shirtShade: "#362a70",
    pants: "#22213a",
    shoes: "#16151f",
    build: 0.92,
    hairStyle: "neat"
  },
  "ben-meyerson": {
    skin: "#e0b693",
    skinShade: "#b47a5a",
    hair: "#24170f",
    shirt: "#ce3f87",
    shirtShade: "#6b1f48",
    pants: "#171923",
    shoes: "#111116",
    build: 0.82,
    hairStyle: "spiky"
  },
  "ben-long": {
    skin: "#e4bd93",
    skinShade: "#ba855d",
    hair: "#5a3d25",
    shirt: "#d9bc3d",
    shirtShade: "#8b6f1b",
    pants: "#2b3038",
    shoes: "#1f2937",
    build: 0.78,
    hairStyle: "curly"
  },
  default: {
    skin: "#d8aa84",
    skinShade: "#a86e50",
    hair: "#2d211b",
    shirt: "#64748b",
    shirtShade: "#334155",
    pants: "#1f2937",
    shoes: "#111827",
    build: 1,
    hairStyle: "short"
  }
};

const stages = [
  { x: 130, y: 610, w: 1180, h: 34, type: "solid" },
  { x: 270, y: 468, w: 220, h: 20, type: "plat" },
  { x: 610, y: 374, w: 220, h: 20, type: "plat" },
  { x: 950, y: 468, w: 220, h: 20, type: "plat" },
  { x: 430, y: 250, w: 170, h: 18, type: "plat" },
  { x: 840, y: 250, w: 170, h: 18, type: "plat" }
];

const edge = {
  left: -310,
  right: W + 310,
  top: -260,
  bottom: H + 260
};

let p1;
let p2;
let particles = [];
let winner = null;
let cameraShake = 0;
let hitStop = 0;
let lastTime = performance.now();
let started = false;

fighters.forEach((fighter) => {
  ui.p1Fighter.append(new Option(fighter.name, fighter.id));
  ui.p2Fighter.append(new Option(fighter.name, fighter.id));
});
ui.p2Fighter.value = "ben-long";

function move(name, label, damage, reach, height, knock, lag, extras = {}) {
  return {
    type: "hit",
    name,
    label,
    damage,
    reach,
    height,
    knock,
    lag,
    active: Math.max(7, Math.floor(lag * 0.46)),
    y: 22,
    ...extras
  };
}

function fighterById(id) {
  return fighters.find((fighter) => fighter.id === id) || fighters[0];
}

function makePlayer(slot, fighter, x, facing) {
  return {
    slot,
    fighter,
    x,
    y: 285,
    vx: 0,
    vy: 0,
    w: Math.round((fighter.w || 42) * PLAYER_SCALE),
    h: Math.round((fighter.h || 64) * PLAYER_SCALE),
    facing,
    grounded: false,
    jumps: 2,
    percent: 0,
    stocks: 3,
    invuln: 90,
    moveTimer: 0,
    moveActive: 0,
    moveKey: null,
    moveData: null,
    hitOnce: false,
    shield: false,
    shieldHealth: 100,
    dodgeTimer: 0,
    buffTimer: 0,
    buffPending: null,
    stun: 0,
    respawn: 0,
    dropTimer: 0,
    coyoteTime: 0,
    jumpBuffer: 0,
    shortHopWindow: 0,
    ledgeHang: false,
    ledgeSide: 0,
    ledgeCooldown: 0,
    grabbedBy: null,
    grabbedTimer: 0,
    grabTarget: null,
    grabHoldTimer: 0,
    grabHoldGrace: 0,
    grabThrowReady: false,
    cpuThink: 0,
    cpuInput: {},
    attackReady: true,
    specialReady: true,
    grabReady: true,
    dodgeReady: true,
    jumpReady: true
  };
}

function resetMatch() {
  p1 = makePlayer(1, fighterById(ui.p1Fighter.value), 485, 1);
  p2 = makePlayer(2, fighterById(ui.p2Fighter.value), 955, -1);
  particles = [];
  winner = null;
  cameraShake = 0;
  hitStop = 0;
  started = true;
  ui.status.textContent = ui.mode.value === "cpu"
    ? `${p1.fighter.name} vs CPU ${p2.fighter.name}. Knock them offstage.`
    : `${p1.fighter.name} vs ${p2.fighter.name}. Local battle.`;
  syncHud();
}

function syncHud() {
  ui.p1Name.textContent = p1.fighter.name;
  ui.p2Name.textContent = p2.fighter.name;
  ui.p1Percent.textContent = `${Math.round(p1.percent)}%`;
  ui.p2Percent.textContent = `${Math.round(p2.percent)}%`;
  ui.p1Stocks.textContent = `${p1.stocks} stock${p1.stocks === 1 ? "" : "s"}`;
  ui.p2Stocks.textContent = `${p2.stocks} stock${p2.stocks === 1 ? "" : "s"}`;
  ui.p1BioName.textContent = `${p1.fighter.name}: ${p1.fighter.title}`;
  ui.p2BioName.textContent = `${p2.fighter.name}: ${p2.fighter.title}`;
  ui.p1Bio.textContent = moveSummary(p1);
  ui.p2Bio.textContent = moveSummary(p2);
}

function moveSummary(player) {
  const moves = player.fighter.moves;
  const base = `${player.fighter.bio} Attacks: jab, side, up, down, and aerial. Specials: ${moves.neutralSpecial.name}, ${moves.sideSpecial.name}, ${moves.upSpecial.name}, ${moves.downSpecial.name}. Grab throws through shields.`;
  if (player.buffPending) return `${base} Currently locked into ${player.buffPending.name}.`;
  if (player.buffTimer > 0) return `${base} Buff active for ${Math.ceil(player.buffTimer / 60)}s.`;
  return base;
}

function pressed(player, action) {
  if (player.slot === 1) {
    if (action === "left") return keys.has("KeyA") || touches.has("left");
    if (action === "right") return keys.has("KeyD") || touches.has("right");
    if (action === "up") return keys.has("KeyW") || touches.has("jump");
    if (action === "down") return keys.has("KeyS") || touches.has("shield");
    if (action === "jump") return keys.has("KeyW") || touches.has("jump");
    if (action === "shield") return keys.has("KeyS") || touches.has("shield");
    if (action === "attack") return keys.has("KeyJ") || touches.has("attack");
    if (action === "special") return keys.has("KeyK") || touches.has("special");
    if (action === "grab") return keys.has("KeyL") || touches.has("grab");
    if (action === "dodge") return keys.has("Semicolon") || touches.has("dodge");
  }

  if (ui.mode.value === "cpu") return Boolean(player.cpuInput[action]);

  if (action === "left") return keys.has("ArrowLeft");
  if (action === "right") return keys.has("ArrowRight");
  if (action === "up") return keys.has("ArrowUp");
  if (action === "down") return keys.has("ArrowDown");
  if (action === "jump") return keys.has("ArrowUp");
  if (action === "shield") return keys.has("ArrowDown");
  if (action === "attack") return keys.has("KeyZ");
  if (action === "special") return keys.has("KeyX");
  if (action === "grab") return keys.has("KeyC");
  if (action === "dodge") return keys.has("KeyV");
  return false;
}

function heldDirection(player) {
  const horizontal = (pressed(player, "right") ? 1 : 0) - (pressed(player, "left") ? 1 : 0);
  const vertical = (pressed(player, "down") ? 1 : 0) - (pressed(player, "up") ? 1 : 0);
  return { horizontal, vertical };
}

function chooseMove(player, button) {
  const { horizontal, vertical } = heldDirection(player);
  const moves = player.fighter.moves;
  if (button === "grab") return "grab";
  if (button === "attack") {
    if (!player.grounded) return "airAttack";
    if (vertical < 0) return "upAttack";
    if (vertical > 0) return "downAttack";
    if (horizontal !== 0) return "sideAttack";
    return "neutralAttack";
  }
  if (vertical < 0) return "upSpecial";
  if (vertical > 0) return "downSpecial";
  if (horizontal !== 0) return "sideSpecial";
  return moves.neutralSpecial ? "neutralSpecial" : "sideSpecial";
}

function updateCpu(cpu, target) {
  cpu.cpuThink--;
  if (cpu.cpuThink > 0) return;
  const dx = target.x - cpu.x;
  const dy = target.y - cpu.y;
  const ideal = cpu.fighter.id === "ronak" ? 150 : 74;
  const tooClose = Math.abs(dx) < 44;
  const far = Math.abs(dx) > ideal;
  const useSpecial = Math.abs(dx) < 180 && Math.abs(dy) < 110 && Math.random() < 0.28;
  cpu.cpuInput = {
    left: (far && dx < 0) || (tooClose && dx > 0),
    right: (far && dx > 0) || (tooClose && dx < 0),
    up: dy < -55 || Math.random() < 0.12,
    down: Math.random() < 0.14,
    jump: cpu.grounded && (dy < -40 || Math.random() < 0.04),
    shield: Math.abs(dx) < 95 && target.moveActive > 0 && Math.random() < 0.58,
    dodge: Math.abs(dx) < 85 && target.moveActive > 0 && Math.random() < 0.22,
    grab: Math.abs(dx) < 92 && Math.abs(dy) < 88 && Math.random() < 0.2,
    attack: Math.abs(dx) < 110 && Math.abs(dy) < 86 && Math.random() < 0.52,
    special: useSpecial
  };
  cpu.cpuThink = 7 + Math.floor(Math.random() * 12);
}

function startMove(player, key) {
  if (player.moveTimer > 0 || player.stun > 0 || player.respawn > 0 || player.dodgeTimer > 0) return;
  if (key === "grab") {
    player.moveKey = key;
    player.moveData = { type: "grab", name: "Grab", label: "GRAB", damage: 0, reach: 96, height: 84, knock: 12, lag: 32, active: 20, y: 38, dash: 5.8 };
  } else {
    player.moveKey = key;
    player.moveData = player.fighter.moves[key];
  }
  const data = player.moveData;
  if (!data) return;
  player.moveTimer = data.lag;
  player.moveActive = data.type === "buff" ? 0 : data.active || Math.max(6, Math.floor(data.lag * 0.45));
  player.hitOnce = false;

  if (data.recoverY) {
    player.vy = data.recoverY;
    player.vx = player.facing * (data.recoverX || 0);
    player.jumps = Math.min(player.jumps, 1);
  }
  if (data.dash) player.vx += player.facing * data.dash;
  if (data.armor) player.invuln = Math.max(player.invuln, 12);
  applyMoveMotion(player, key, data);

  if (data.type === "buff") {
    player.buffPending = data;
    ui.status.textContent = `${player.fighter.name}: ${data.name}.`;
    burst(player.x, player.y + 28, "#f4ead1", 10);
  } else {
    ui.status.textContent = `${player.fighter.name}: ${data.name}.`;
    burst(player.x + player.facing * 34, player.y + 22, player.fighter.glow, 7);
  }
}

function applyMoveMotion(player, key, data) {
  if (!data || data.type === "buff") {
    player.vx *= 0.45;
    return;
  }

  const grounded = player.grounded;
  let impulseX = 0;
  let impulseY = 0;
  if (key === "neutralAttack") impulseX = 2.1;
  else if (key === "sideAttack") impulseX = data.dash ? 0.8 : 6.4;
  else if (key === "upAttack") {
    impulseX = 1.2;
    impulseY = grounded ? -3.3 : -1.5;
  } else if (key === "downAttack") impulseX = grounded ? 3.2 : 1.4;
  else if (key === "airAttack") {
    impulseX = 4.6;
    impulseY = -1.2;
  } else if (key === "neutralSpecial") impulseX = data.reach > 120 ? -1.8 : 2.2;
  else if (key === "sideSpecial") impulseX = data.dash ? 1.4 : 7.6;
  else if (key === "upSpecial") impulseX = data.recoverX ? 0 : 2.2;
  else if (key === "downSpecial") {
    impulseX = grounded ? -0.7 : 0.8;
    player.vx *= data.armor ? 0.35 : 0.55;
  } else if (key === "grab") impulseX = 2.4;

  player.vx += player.facing * impulseX;
  player.vy += impulseY;
}

function applyMoveDrift(player) {
  const key = player.moveKey || "";
  const data = player.moveData;
  if (!data || data.type === "buff") return;

  let drift = 0;
  let lift = 0;
  if (data.type === "grab") drift = 0.38;
  else if (key === "neutralAttack") drift = 0.12;
  else if (key === "sideAttack") drift = 0.32;
  else if (key === "downAttack") drift = 0.18;
  else if (key === "airAttack") {
    drift = 0.24;
    lift = -0.05;
  } else if (key === "neutralSpecial") drift = data.reach > 120 ? -0.06 : 0.12;
  else if (key === "sideSpecial") drift = 0.44;
  else if (key === "upAttack" || key === "upSpecial") {
    drift = 0.1;
    lift = -0.12;
  } else if (key === "downSpecial") drift = -0.05;

  player.vx += player.facing * drift;
  player.vy += lift;
}

function startDodge(player) {
  if (player.dodgeTimer > 0 || player.stun > 0 || player.moveTimer > 0 || player.respawn > 0) return;
  const { horizontal, vertical } = heldDirection(player);
  player.dodgeTimer = player.grounded ? 22 : 28;
  player.invuln = Math.max(player.invuln, player.grounded ? 18 : 20);
  player.shield = false;
  player.vx = (horizontal || -player.facing) * (player.grounded ? 8.5 : 5.5);
  if (!player.grounded && vertical < 0) player.vy = -5;
  if (!player.grounded && vertical > 0) player.vy = 5;
  burst(player.x, player.y + player.h / 2, "#dbeafe", 12);
  ui.status.textContent = `${player.fighter.name} dodged.`;
}

function updateGrabHold(holder) {
  const target = holder.grabTarget;
  if (!target || target.respawn > 0 || target.stocks <= 0) {
    releaseGrab(holder);
    return;
  }

  holder.grabHoldTimer--;
  if (holder.grabHoldGrace > 0) holder.grabHoldGrace--;
  holder.vx *= 0.45;
  holder.vy = Math.min(holder.vy + 0.18, 1.5);
  holder.moveTimer = 0;
  holder.moveActive = 0;
  holder.hitOnce = true;
  positionGrabbedTarget(holder, target);

  const throwButtonHeld = pressed(holder, "attack") || pressed(holder, "special") || pressed(holder, "grab") || pressed(holder, "dodge");
  if (holder.grabHoldGrace <= 0 && !throwButtonHeld) holder.grabThrowReady = true;
  const throwPressed = holder.grabThrowReady && throwButtonHeld;

  if (throwPressed || holder.grabHoldTimer <= 0) {
    executeThrow(holder, target, holder.grabHoldTimer <= 0);
  } else {
    ui.status.textContent = `${holder.fighter.name} is holding ${target.fighter.name}. Pick a direction and throw.`;
  }
}

function positionGrabbedTarget(holder, target) {
  target.grabbedBy = holder;
  target.grabbedTimer = holder.grabHoldTimer;
  target.shield = false;
  target.ledgeHang = false;
  target.moveTimer = 0;
  target.moveActive = 0;
  target.stun = Math.max(target.stun, 4);
  target.invuln = 0;
  target.vx = 0;
  target.vy = 0;
  target.facing = -holder.facing;
  target.x = holder.x + holder.facing * (holder.w * 0.62 + target.w * 0.42);
  target.y = holder.y + Math.max(-10, (holder.h - target.h) * 0.28);
}

function releaseGrab(holder) {
  if (holder.grabTarget) {
    holder.grabTarget.grabbedBy = null;
    holder.grabTarget.grabbedTimer = 0;
  }
  holder.grabTarget = null;
  holder.grabHoldTimer = 0;
  holder.grabHoldGrace = 0;
  holder.grabThrowReady = false;
}

function executeThrow(holder, target, timedOut = false) {
  const dir = heldDirection(holder);
  const vertical = dir.vertical;
  const horizontal = dir.horizontal || holder.facing;
  const throwName = vertical < 0 ? "up throw" : vertical > 0 ? "down throw" : horizontal === holder.facing ? "forward throw" : "back throw";
  const damage = timedOut ? 5 : 8;
  const baseKnock = 12 + target.percent * 0.12;

  positionGrabbedTarget(holder, target);
  releaseGrab(holder);

  target.percent += damage;
  target.stun = 22 + Math.floor(target.percent * 0.05);
  if (vertical < 0) {
    target.vx = holder.facing * 2.5;
    target.vy = -Math.max(9, baseKnock * 0.85 / target.fighter.weight);
  } else if (vertical > 0) {
    target.vx = holder.facing * 4.2;
    target.vy = Math.max(4, baseKnock * 0.18 / target.fighter.weight);
  } else {
    target.vx = horizontal * Math.max(10, baseKnock) / target.fighter.weight;
    target.vy = -Math.max(4, baseKnock * 0.48 / target.fighter.weight);
  }

  holder.vx = -horizontal * 1.4;
  holder.moveTimer = 12;
  holder.moveActive = 0;
  burst(target.x, target.y + target.h * 0.5, "#fef3c7", 30);
  impactSpark(target.x, target.y + target.h * 0.5, "#ffffff", 18);
  cameraShake = Math.max(cameraShake, 10);
  hitStop = Math.max(hitStop, 5);
  ui.status.textContent = `${holder.fighter.name} ${throwName}s ${target.fighter.name}.`;
}

function updateLedgeHang(player) {
  const main = stages[0];
  const ledgeX = player.ledgeSide < 0 ? main.x : main.x + main.w;
  player.x = ledgeX + player.ledgeSide * 9;
  player.y = main.y - player.h + 34;
  player.vx = 0;
  player.vy = 0;
  player.grounded = false;
  player.jumps = 2;
  player.invuln = Math.max(player.invuln, 8);
  player.ledgeCooldown = 16;
  player.facing = player.ledgeSide < 0 ? 1 : -1;

  const away = player.ledgeSide < 0 ? pressed(player, "left") : pressed(player, "right");
  if (pressed(player, "jump") || pressed(player, "up")) {
    player.ledgeHang = false;
    player.x += player.facing * 30;
    player.y -= 26;
    player.vy = -player.fighter.jump * 0.92;
    player.vx = player.facing * 5.5;
    player.shortHopWindow = 0;
    burst(player.x, player.y + player.h, "#eaf7ff", 10);
    ui.status.textContent = `${player.fighter.name} ledge jumped.`;
  } else if (pressed(player, "attack")) {
    player.ledgeHang = false;
    player.x += player.facing * 38;
    player.y -= 18;
    player.invuln = Math.max(player.invuln, 14);
    startMove(player, "neutralAttack");
    ui.status.textContent = `${player.fighter.name} ledge attacked.`;
  } else if (pressed(player, "down") || away) {
    player.ledgeHang = false;
    player.y += 22;
    player.vy = 2.5;
    player.jumps = 1;
    ui.status.textContent = `${player.fighter.name} dropped from ledge.`;
  }
}

function tryLedgeGrab(player) {
  if (player.grounded || player.vy < -1 || player.ledgeCooldown > 0 || player.moveTimer > 0 || player.stun > 0) return;
  const main = stages[0];
  const grabY = player.y + player.h;
  if (grabY < main.y - 28 || grabY > main.y + 42) return;
  const leftDist = Math.abs(player.x - main.x);
  const rightDist = Math.abs(player.x - (main.x + main.w));
  const grabbingLeft = leftDist < 34 && (pressed(player, "right") || player.x < main.x);
  const grabbingRight = rightDist < 34 && (pressed(player, "left") || player.x > main.x + main.w);
  if (!grabbingLeft && !grabbingRight) return;
  player.ledgeHang = true;
  player.ledgeSide = grabbingLeft ? -1 : 1;
  player.moveTimer = 0;
  player.moveActive = 0;
  player.vx = 0;
  player.vy = 0;
  player.invuln = Math.max(player.invuln, 18);
  burst(player.x, player.y + player.h - 10, "#bfdbfe", 10);
  ui.status.textContent = `${player.fighter.name} grabbed the ledge.`;
}

function updatePlayer(player, opponent) {
  if (player.respawn > 0) {
    player.respawn--;
    player.x = player.slot === 1 ? 485 : 955;
    player.y = 120;
    player.vx = 0;
    player.vy = 0;
    player.invuln = Math.max(player.invuln, 35);
    return;
  }

  if (player.grabbedBy) {
    positionGrabbedTarget(player.grabbedBy, player);
    return;
  }

  if (player.grabTarget) {
    updateGrabHold(player);
    return;
  }

  if (player.ledgeHang) {
    updateLedgeHang(player);
    return;
  }

  if (ui.mode.value === "cpu" && player.slot === 2) updateCpu(player, opponent);

  if (player.buffTimer > 0) player.buffTimer--;
  if (player.dropTimer > 0) player.dropTimer--;
  if (player.dodgeTimer > 0) player.dodgeTimer--;
  if (player.jumpBuffer > 0) player.jumpBuffer--;
  if (player.shortHopWindow > 0) player.shortHopWindow--;
  if (player.ledgeCooldown > 0) player.ledgeCooldown--;

  const doingMove = player.moveTimer > 0;
  const busyBuff = player.buffPending && doingMove;
  const usingButton = pressed(player, "attack") || pressed(player, "special") || pressed(player, "grab") || pressed(player, "dodge");
  player.shield = pressed(player, "shield") && !usingButton && player.stun <= 0 && !doingMove && player.shieldHealth > 0;
  const control = player.stun <= 0 && !player.shield && !busyBuff;
  const accel = control && !doingMove ? 0.88 : 0.27;
  const maxSpeed = player.fighter.speed * (player.buffTimer > 0 ? 1.07 : 1);

  if (control && pressed(player, "left")) {
    player.vx -= accel;
    player.facing = -1;
  }
  if (control && pressed(player, "right")) {
    player.vx += accel;
    player.facing = 1;
  }
  player.vx = clamp(player.vx, -maxSpeed, maxSpeed);
  if (player.moveActive > 0) applyMoveDrift(player);

  if (control && pressed(player, "jump") && player.jumpReady) {
    player.jumpBuffer = 8;
    player.jumpReady = false;
  }

  if (control && player.jumpBuffer > 0) {
    if (player.grounded && pressed(player, "down")) {
      player.dropTimer = 18;
      player.y += 8;
      player.jumpBuffer = 0;
    } else if (player.grounded || player.coyoteTime > 0 || player.jumps > 0) {
      player.vy = -player.fighter.jump;
      player.grounded = false;
      if (player.coyoteTime <= 0) player.jumps--;
      player.coyoteTime = 0;
      player.jumpBuffer = 0;
      player.shortHopWindow = 9;
      burst(player.x, player.y + player.h, "#eaf7ff", 9);
    }
  }
  if (!pressed(player, "jump")) {
    if (player.shortHopWindow > 0 && player.vy < -4) {
      player.vy *= 0.58;
      player.shortHopWindow = 0;
    }
    player.jumpReady = true;
  }

  if (pressed(player, "attack") && player.attackReady) {
    startMove(player, chooseMove(player, "attack"));
    player.attackReady = false;
  }
  if (!pressed(player, "attack")) player.attackReady = true;

  if (pressed(player, "special") && player.specialReady) {
    startMove(player, chooseMove(player, "special"));
    player.specialReady = false;
  }
  if (!pressed(player, "special")) player.specialReady = true;

  if (pressed(player, "grab") && player.grabReady) {
    startMove(player, "grab");
    player.grabReady = false;
  }
  if (!pressed(player, "grab")) player.grabReady = true;

  if (pressed(player, "dodge") && player.dodgeReady) {
    startDodge(player);
    player.dodgeReady = false;
  }
  if (!pressed(player, "dodge")) player.dodgeReady = true;

  player.vy += 0.62;
  if (!player.grounded && pressed(player, "down") && player.vy > -1) {
    player.vy += 0.65;
    if (Math.random() < 0.25) burst(player.x, player.y + player.h, "rgba(234, 247, 255, 0.75)", 1);
  }
  if (player.shield) {
    player.vx *= 0.8;
    player.shieldHealth = Math.max(0, player.shieldHealth - 0.16);
  } else {
    player.shieldHealth = Math.min(100, player.shieldHealth + 0.12);
    player.vx *= player.grounded ? 0.84 : 0.96;
  }

  player.x += player.vx;
  player.y += player.vy;

  player.grounded = false;
  tryLedgeGrab(player);
  if (player.ledgeHang) return;
  for (const platform of stages) collidePlatform(player, platform);
  if (player.grounded) player.coyoteTime = 7;
  else if (player.coyoteTime > 0) player.coyoteTime--;

  if (player.moveTimer > 0) {
    player.moveTimer--;
    if (player.moveTimer === 0 && player.buffPending) {
      player.buffTimer = player.buffPending.buffDuration || 420;
      player.buffPending = null;
      burst(player.x, player.y + 28, "#f4ead1", 26);
      ui.status.textContent = `${player.fighter.name}'s buff is active.`;
    }
  }
  if (player.moveActive > 0) player.moveActive--;
  if (player.stun > 0) player.stun--;
  if (player.invuln > 0) player.invuln--;

  if (player.moveActive > 0 && !player.hitOnce) resolveHit(player, opponent);
  checkKo(player);
}

function collidePlatform(player, platform) {
  const prevBottom = player.y + player.h - player.vy;
  const bottom = player.y + player.h;
  const withinX = player.x + player.w / 2 > platform.x && player.x - player.w / 2 < platform.x + platform.w;
  const falling = player.vy >= 0;
  const landing = prevBottom <= platform.y + 8 && bottom >= platform.y;
  if (platform.type === "plat" && player.dropTimer > 0) return;
  if (withinX && falling && landing) {
    player.y = platform.y - player.h;
    player.vy = 0;
    player.grounded = true;
    player.jumps = 2;
  }
}

function resolveHit(attacker, defender) {
  const data = attacker.moveData;
  if (!data || data.type === "buff") return;
  if (defender.respawn > 0 || defender.dodgeTimer > 0) return;
  if (defender.invuln > 0 && data.type !== "grab") return;
  const hx = attacker.x + attacker.facing * (attacker.w / 2 + data.reach / 2);
  const hy = attacker.y + (data.y ?? 22);
  const hit = Math.abs(defender.x - hx) < data.reach / 2 + defender.w / 2
    && Math.abs(defender.y + defender.h / 2 - hy) < data.height / 2 + defender.h / 2;

  if (!hit) return;
  attacker.hitOnce = true;
  if (defender.grabTarget) releaseGrab(defender);
  if (defender.grabbedBy) releaseGrab(defender.grabbedBy);

  if (data.type === "grab") {
    if (attacker.grabTarget || defender.grabbedBy) return;
    defender.shield = false;
    defender.invuln = 0;
    defender.stun = 8;
    attacker.grabTarget = defender;
    attacker.grabHoldTimer = 70;
    attacker.grabHoldGrace = 14;
    attacker.grabThrowReady = false;
    attacker.moveTimer = 0;
    attacker.moveActive = 0;
    defender.grabbedBy = attacker;
    defender.grabbedTimer = attacker.grabHoldTimer;
    positionGrabbedTarget(attacker, defender);
    burst(defender.x, defender.y + defender.h * 0.45, "#bfdbfe", 24);
    impactSpark(defender.x, defender.y + defender.h * 0.45, "#ffffff", 10);
    cameraShake = Math.max(cameraShake, 4);
    ui.status.textContent = `${attacker.fighter.name} grabbed ${defender.fighter.name}.`;
    return;
  }

  let damage = data.damage;
  let knock = data.knock + defender.percent * 0.09;
  let power = attacker.buffTimer > 0 ? attacker.fighter.moves.downSpecial.buffPower || 1.25 : 1;
  if (attacker.fighter.id === "ben-meyerson" && defender.fighter.id === "ben-long") {
    power *= 1.5;
    ui.status.textContent = "Ben-Meyerson is super effective on Ben Long.";
  }
  if (data.luckyGolf && Math.random() < 0.1) {
    power *= 2.35;
    ui.status.textContent = `${attacker.fighter.name} hit the 1-in-10 golf ball sweet spot.`;
    burst(defender.x, defender.y + 24, "#ffffff", 34);
    impactSpark(defender.x, defender.y + 24, "#fff7cc", 18);
    hitStop = Math.max(hitStop, 7);
  }
  if (data.lowBlow) {
    defender.stun += 8;
    ui.status.textContent = `${attacker.fighter.name} landed the nut tap.`;
  }
  damage *= power;
  knock *= power;
  knock += damage * 0.16;

  if (defender.shield) {
    const shieldDamage = damage * 4.2;
    defender.shieldHealth -= shieldDamage;
    damage *= 0.22;
    knock *= 0.3;
    defender.stun = defender.shieldHealth <= 0 ? 70 : 6;
    defender.shield = false;
    if (defender.shieldHealth <= 0) {
      defender.shieldHealth = 25;
      burst(defender.x, defender.y + 25, "#ffffff", 32);
      impactSpark(defender.x, defender.y + 25, "#bfdbfe", 16);
      ui.status.textContent = `${defender.fighter.name}'s shield broke.`;
    } else {
      burst(defender.x, defender.y + 25, "#92b7ff", 14);
    }
  } else {
    defender.stun = Math.max(defender.stun, 10 + Math.floor(data.damage * 0.55));
    burst(defender.x, defender.y + 28, attacker.fighter.glow, 22);
    impactSpark(defender.x, defender.y + 28, attacker.fighter.glow, data.lowBlow ? 18 : 12);
    cameraShake = Math.max(cameraShake, data.lowBlow ? 12 : 8);
    hitStop = Math.max(hitStop, data.lowBlow ? 6 : 4);
  }

  defender.percent += damage;
  const di = heldDirection(defender);
  const diX = di.horizontal * knock * 0.18;
  const diY = di.vertical * knock * 0.12;
  defender.vx = (attacker.facing * knock + diX) / defender.fighter.weight;
  if (data.angle === "up") defender.vy = (-Math.max(7, knock * 0.72) + diY) / defender.fighter.weight;
  else if (data.angle === "low") defender.vy = (-Math.max(2.5, knock * 0.32) + diY) / defender.fighter.weight;
  else defender.vy = (-Math.max(4, knock * 0.58) + diY) / defender.fighter.weight;
}

function checkKo(player) {
  if (player.x < edge.left || player.x > edge.right || player.y < edge.top || player.y > edge.bottom) {
    if (player.grabTarget) releaseGrab(player);
    if (player.grabbedBy) releaseGrab(player.grabbedBy);
    player.stocks--;
    burst(clamp(player.x, 40, W - 40), clamp(player.y, 40, H - 40), "#ffffff", 36);
    cameraShake = 18;
    if (player.stocks <= 0) {
      winner = player.slot === 1 ? p2 : p1;
      ui.status.textContent = `Player ${winner.slot} wins.`;
    } else {
      player.percent = 0;
      player.respawn = 75;
      player.invuln = 130;
      player.buffTimer = 0;
      player.buffPending = null;
      player.moveTimer = 0;
      player.moveActive = 0;
    }
    syncHud();
  }
}

function updateParticles() {
  particles = particles.filter((particle) => {
    particle.life--;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.angle += particle.spin || 0;
    particle.vy += 0.12;
    return particle.life > 0;
  });
}

function burst(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.2 + Math.random() * 5;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      size: 2 + Math.random() * 5,
      angle,
      spin: (Math.random() - 0.5) * 0.3,
      life: 18 + Math.random() * 20
    });
  }
}

function impactSpark(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 7;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      size: 9 + Math.random() * 16,
      angle,
      spin: (Math.random() - 0.5) * 0.55,
      line: true,
      life: 12 + Math.random() * 12
    });
  }
}

function draw() {
  ctx.save();
  ctx.clearRect(0, 0, W, H);
  if (cameraShake > 0) {
    ctx.translate((Math.random() - 0.5) * cameraShake, (Math.random() - 0.5) * cameraShake);
    cameraShake *= 0.86;
  }

  drawStage();
  drawGrabLinks();
  drawPlayer(p1);
  drawPlayer(p2);
  particles.forEach(drawParticle);
  if (!started) drawOverlay("Pick fighters", "Choose a mode and start the match.");
  if (winner) drawOverlay(`Player ${winner.slot} wins`, "Press Start Match to run it back.");
  ctx.restore();
}

function drawGrabLinks() {
  [p1, p2].forEach((holder) => {
    if (!holder || !holder.grabTarget) return;
    const target = holder.grabTarget;
    ctx.save();
    ctx.strokeStyle = "#bfdbfe";
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(holder.x + holder.facing * holder.w * 0.48, holder.y + holder.h * 0.46);
    ctx.lineTo(target.x - holder.facing * target.w * 0.32, target.y + target.h * 0.42);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(191, 219, 254, 0.25)";
    ctx.beginPath();
    ctx.arc(target.x, target.y + target.h * 0.42, Math.max(24, target.w * 0.55), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#eaf7ff";
    ctx.font = "900 14px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("HELD", target.x, target.y - 28);
    ctx.restore();
  });
}

function drawStage() {
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, "#182340");
  gradient.addColorStop(0.5, "#405f8d");
  gradient.addColorStop(1, "#0e1420");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.globalAlpha = 0.42;
  const beam = ctx.createLinearGradient(0, 80, 0, 650);
  beam.addColorStop(0, "rgba(255, 255, 255, 0.36)");
  beam.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = beam;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    const x = 170 + i * 365;
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 190, 660);
    ctx.lineTo(x - 190, 660);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  ctx.fillStyle = "rgba(7, 12, 24, 0.38)";
  for (let i = 0; i < 18; i++) {
    const x = i * 86;
    const h = 80 + (i % 5) * 18;
    ctx.fillRect(x, 190 - h, 62, h);
    ctx.fillRect(x + 8, 178 - h, 46, 12);
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  for (let y = 148; y < 612; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y + Math.sin(y * 0.02) * 18);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 652, W, 160);
  ctx.fillStyle = "rgba(255, 209, 92, 0.12)";
  for (let x = 0; x < W; x += 28) {
    ctx.fillRect(x, 690 + ((x / 28) % 4) * 7, 10, 10);
  }

  ctx.save();
  ctx.strokeStyle = "rgba(255, 91, 98, 0.22)";
  ctx.lineWidth = 3;
  ctx.setLineDash([18, 16]);
  ctx.strokeRect(18, 18, W - 36, H - 36);
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(255, 209, 92, 0.35)";
  ctx.font = "900 13px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("BLAST ZONE", W / 2, 36);
  ctx.restore();

  stages.forEach((platform) => {
    ctx.fillStyle = platform.type === "solid" ? "#2b3242" : "#3b4660";
    ctx.strokeStyle = "#9fb2d7";
    ctx.lineWidth = 3;
    roundRect(platform.x, platform.y, platform.w, platform.h, 8);
    ctx.fill();
    ctx.stroke();
    const top = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.h);
    top.addColorStop(0, "rgba(255, 255, 255, 0.22)");
    top.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = top;
    roundRect(platform.x + 4, platform.y + 3, platform.w - 8, Math.max(5, platform.h / 3), 5);
    ctx.fill();
    ctx.fillStyle = "#151a25";
    ctx.fillRect(platform.x + 10, platform.y + platform.h - 6, platform.w - 20, 4);
    ctx.strokeStyle = "rgba(8, 16, 29, 0.7)";
    ctx.lineWidth = 2;
    for (let x = platform.x + 26; x < platform.x + platform.w - 20; x += 44) {
      ctx.beginPath();
      ctx.moveTo(x, platform.y + platform.h);
      ctx.lineTo(x + 20, platform.y + platform.h + 26);
      ctx.stroke();
    }
  });
}

function drawPlayer(player) {
  if (player.respawn > 0) return;
  const flash = player.invuln > 0 && Math.floor(player.invuln / 5) % 2 === 0;
  if (flash) ctx.globalAlpha = 0.45;
  if (player.dodgeTimer > 0) ctx.globalAlpha = 0.35;
  drawNameTag(player);

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.scale(player.facing, 1);

  if (player.moveActive > 0) drawHitbox(player);
  if (player.shield) drawShield(player);

  ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  ctx.beginPath();
  ctx.ellipse(0, player.h + 22, player.w * 0.75, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  drawRealisticFighter(player);
  drawGimmick(player);
  if (player.buffTimer > 0) drawBuffAura(player);
  if (player.percent >= 80) drawDamageSmoke(player);

  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawRealisticFighter(player) {
  const look = fighterLooks[player.fighter.id] || fighterLooks.default;
  const pose = fighterPose(player);
  const build = look.build;
  const shoulderY = 30;
  const hipY = player.h - 10;
  const headY = 1;
  const headW = Math.max(22, player.w * 0.58);
  const headH = Math.max(27, player.w * 0.72);
  const shoulders = player.w * (0.9 + build * 0.22);
  const hips = player.w * (0.44 + build * 0.08);
  const legWidth = Math.max(8, player.w * 0.18);
  const armWidth = Math.max(7, player.w * 0.16);
  const handR = Math.max(4, player.w * 0.11);

  ctx.save();
  ctx.translate(pose.lean, pose.crouch);

  drawLeg(-hips * 0.28, hipY, -pose.legSpread, player.h + 20, legWidth, look, player);
  drawLeg(hips * 0.28, hipY, pose.legSpread, player.h + 20, legWidth, look, player);
  drawArm(-shoulders * 0.5, shoulderY + 8, -shoulders * 0.82, shoulderY + 42, armWidth, handR, look);
  drawArm(shoulders * 0.5, shoulderY + 7, pose.handX, pose.handY, armWidth, handR, look);

  ctx.shadowColor = player.fighter.glow;
  ctx.shadowBlur = player.moveTimer > 0 ? 18 : 7;
  const torso = ctx.createLinearGradient(0, shoulderY, 0, hipY);
  torso.addColorStop(0, look.shirt);
  torso.addColorStop(0.62, look.shirtShade);
  torso.addColorStop(1, "#121827");
  ctx.fillStyle = torso;
  ctx.strokeStyle = "#07101d";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-shoulders * 0.5, shoulderY);
  ctx.quadraticCurveTo(-shoulders * 0.38, shoulderY + 18, -hips * 0.5, hipY);
  ctx.lineTo(hips * 0.5, hipY);
  ctx.quadraticCurveTo(shoulders * 0.38, shoulderY + 18, shoulders * 0.5, shoulderY);
  ctx.quadraticCurveTo(0, shoulderY - 8, -shoulders * 0.5, shoulderY);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
  ctx.beginPath();
  ctx.moveTo(-shoulders * 0.38, shoulderY + 8);
  ctx.quadraticCurveTo(-shoulders * 0.22, shoulderY + 28, -hips * 0.25, hipY - 8);
  ctx.lineTo(-hips * 0.02, hipY - 8);
  ctx.quadraticCurveTo(-shoulders * 0.12, shoulderY + 26, -shoulders * 0.2, shoulderY + 8);
  ctx.fill();

  ctx.fillStyle = look.pants;
  roundRect(-hips * 0.58, hipY - 2, hips * 1.16, 13, 4);
  ctx.fill();
  ctx.strokeStyle = "#07101d";
  ctx.lineWidth = 2;
  ctx.stroke();

  drawNeckAndHead(look, headY, headW, headH, player);
  ctx.restore();
}

function fighterPose(player) {
  const moving = clamp(player.vx / Math.max(1, player.fighter.speed), -1, 1);
  const attacking = player.moveTimer > 0;
  const low = player.moveData && player.moveData.angle === "low";
  const up = player.moveData && player.moveData.angle === "up";
  const special = player.moveKey && player.moveKey.includes("Special");
  return {
    lean: moving * 5 + (attacking ? 4 : 0),
    crouch: player.shield ? 7 : low ? 5 : 0,
    legSpread: player.grounded ? 13 + Math.abs(moving) * 8 : 8,
    handX: attacking ? (special ? 54 : 42) : 26,
    handY: up ? -10 : low ? player.h - 2 : attacking ? 29 : 54
  };
}

function drawLeg(hipX, hipY, footX, footY, width, look, player) {
  const kneeX = hipX + (footX - hipX) * 0.42;
  const kneeY = hipY + (footY - hipY) * 0.48;
  drawSegment(hipX, hipY, kneeX, kneeY, width, look.pants, "#07101d");
  drawSegment(kneeX, kneeY, footX, footY, width * 0.86, look.pants, "#07101d");
  ctx.fillStyle = look.shoes;
  ctx.strokeStyle = "#07101d";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(footX + 5, footY + 2, width * 1.15, width * 0.52, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawArm(shoulderX, shoulderY, handX, handY, width, handR, look) {
  const elbowX = shoulderX + (handX - shoulderX) * 0.48;
  const elbowY = shoulderY + (handY - shoulderY) * 0.52 - 8;
  drawSegment(shoulderX, shoulderY, elbowX, elbowY, width, look.shirtShade, "#07101d");
  drawSegment(elbowX, elbowY, handX, handY, width * 0.82, look.skin, "#07101d");
  ctx.fillStyle = look.skin;
  ctx.strokeStyle = "#07101d";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(handX, handY, handR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawSegment(x1, y1, x2, y2, width, fill, stroke) {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width + 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.strokeStyle = fill;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawNeckAndHead(look, headY, headW, headH, player) {
  ctx.fillStyle = look.skinShade;
  roundRect(-7, 18, 14, 17, 5);
  ctx.fill();

  const skin = ctx.createRadialGradient(-6, headY - 6, 4, 0, headY + 3, headH * 0.75);
  skin.addColorStop(0, "#ffe1bd");
  skin.addColorStop(0.45, look.skin);
  skin.addColorStop(1, look.skinShade);
  ctx.fillStyle = skin;
  ctx.strokeStyle = "#07101d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, headY, headW * 0.5, headH * 0.56, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  drawHair(look, headY, headW, headH);
  drawFace(look, headY, headW, headH, player);
}

function drawHair(look, headY, headW, headH) {
  ctx.fillStyle = look.hair;
  ctx.beginPath();
  if (look.hairStyle === "curly") {
    for (let i = 0; i < 6; i++) {
      ctx.moveTo(-headW * 0.45 + i * headW * 0.18, headY - headH * 0.42);
      ctx.arc(-headW * 0.38 + i * headW * 0.16, headY - headH * 0.44 + (i % 2) * 2, headW * 0.15, 0, Math.PI * 2);
    }
  } else if (look.hairStyle === "spiky") {
    ctx.moveTo(-headW * 0.5, headY - headH * 0.22);
    for (let i = 0; i < 6; i++) {
      const x = -headW * 0.45 + i * headW * 0.18;
      ctx.lineTo(x, headY - headH * (0.58 + (i % 2) * 0.14));
      ctx.lineTo(x + headW * 0.13, headY - headH * 0.28);
    }
    ctx.closePath();
  } else if (look.hairStyle === "messy") {
    ctx.moveTo(-headW * 0.48, headY - headH * 0.24);
    ctx.bezierCurveTo(-headW * 0.3, headY - headH * 0.62, -headW * 0.02, headY - headH * 0.68, headW * 0.43, headY - headH * 0.28);
    ctx.lineTo(headW * 0.34, headY - headH * 0.04);
    ctx.bezierCurveTo(headW * 0.1, headY - headH * 0.2, -headW * 0.2, headY - headH * 0.12, -headW * 0.48, headY - headH * 0.24);
  } else {
    ctx.ellipse(0, headY - headH * 0.3, headW * 0.48, headH * 0.22, 0, Math.PI, Math.PI * 2);
  }
  ctx.fill();
}

function drawFace(look, headY, headW, headH, player) {
  ctx.fillStyle = "#07101d";
  const eyeY = headY - 2;
  ctx.beginPath();
  ctx.ellipse(-headW * 0.18, eyeY, 2.4, 3.1, 0, 0, Math.PI * 2);
  ctx.ellipse(headW * 0.18, eyeY, 2.4, 3.1, 0, 0, Math.PI * 2);
  ctx.fill();

  if (player.fighter.id === "connor") {
    ctx.fillStyle = "#79f2ff";
    ctx.beginPath();
    ctx.arc(headW * 0.18, eyeY, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#07101d";
    ctx.fillRect(headW * 0.14, eyeY - 1, 8, 2);
  }

  ctx.strokeStyle = look.skinShade;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(1, eyeY + 4);
  ctx.lineTo(-2, eyeY + 11);
  ctx.lineTo(3, eyeY + 12);
  ctx.stroke();

  ctx.strokeStyle = "#401f18";
  ctx.lineWidth = 2;
  ctx.beginPath();
  const smile = player.moveTimer > 0 ? 3 : 0;
  ctx.moveTo(-headW * 0.16, headY + headH * 0.23);
  ctx.quadraticCurveTo(0, headY + headH * (0.27 + smile * 0.01), headW * 0.16, headY + headH * 0.23);
  ctx.stroke();
}

function drawShield(player) {
  const radius = 34 + player.shieldHealth * 0.16;
  ctx.fillStyle = "rgba(119, 171, 255, 0.24)";
  ctx.strokeStyle = "#9fd4ff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 32, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawNameTag(player) {
  ctx.save();
  ctx.font = "900 16px system-ui";
  ctx.textAlign = "center";
  const label = `P${player.slot} ${player.fighter.name}`;
  const width = ctx.measureText(label).width + 20;
  const x = player.x;
  const y = player.y - 42;
  ctx.fillStyle = "rgba(5, 8, 14, 0.7)";
  roundRect(x - width / 2, y - 20, width, 27, 7);
  ctx.fill();
  ctx.strokeStyle = player.slot === 1 ? "#55a7ff" : "#ff5b62";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#f7f0dc";
  ctx.fillText(label, x, y);
  ctx.restore();
}

function drawHitbox(player) {
  const data = player.moveData;
  if (!data || data.type === "buff") return;
  const alpha = data.type === "grab" ? 0.32 : player.moveKey && player.moveKey.includes("Special") ? 0.35 : 0.25;
  ctx.fillStyle = data.type === "grab" ? `rgba(147, 197, 253, ${alpha})` : `rgba(255, 244, 166, ${alpha})`;
  ctx.strokeStyle = data.type === "grab" ? "#bfdbfe" : player.fighter.glow;
  ctx.lineWidth = 3;
  roundRect(player.w / 2, (data.y ?? 22) - data.height / 2, data.reach, data.height, 16);
  ctx.fill();
  ctx.stroke();
  if (data.label) {
    ctx.fillStyle = "#08101d";
    ctx.font = "800 11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(data.label, player.w / 2 + data.reach / 2, data.y ?? 22);
  }
}

function drawGimmick(player) {
  const id = player.fighter.id;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (id === "connor") {
    ctx.strokeStyle = "#07101d";
    ctx.lineWidth = 3;
    ctx.strokeRect(-player.w / 2 + 5, 20, player.w - 10, player.h - 26);
    ctx.fillStyle = "#9af2ff";
    ctx.fillRect(5, -5, 11, 7);
    ctx.strokeStyle = "#9af2ff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-player.w / 2 - 4, 22);
    ctx.lineTo(-player.w / 2 - 14, player.h - 8);
    ctx.stroke();
  }

  if (id === "hoban") {
    ctx.strokeStyle = "#1a1110";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-34, 26);
    ctx.lineTo(34, 18);
    ctx.stroke();
    ctx.fillStyle = "#282018";
    ctx.fillRect(-42, 18, 10, 22);
    ctx.fillRect(32, 10, 10, 22);
    if (player.buffPending || player.buffTimer > 0) {
      ctx.fillStyle = "#f4ead1";
      roundRect(15, -28, 20, 28, 5);
      ctx.fill();
      ctx.fillStyle = "#d07749";
      ctx.fillRect(18, -17, 14, 5);
    }
  }

  if (id === "ronak") {
    ctx.strokeStyle = "#e9e9f4";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-30, 32);
    ctx.lineTo(-43, player.h + 26);
    ctx.moveTo(30, 32);
    ctx.lineTo(43, player.h + 26);
    ctx.stroke();
    ctx.strokeStyle = "#2a2148";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-13, player.h - 5);
    ctx.lineTo(-1, player.h + 5);
    ctx.moveTo(4, player.h - 5);
    ctx.lineTo(16, player.h + 5);
    ctx.stroke();
  }

  if (id === "ben-meyerson") {
    ctx.fillStyle = "#08101d";
    ctx.font = "900 16px system-ui";
    ctx.fillText("?!", 12, -24);
    ctx.strokeStyle = "#ffd1eb";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-22, 24);
    ctx.lineTo(-38, 12);
    ctx.lineTo(-30, 34);
    ctx.stroke();
  }

  if (id === "ben-long") {
    ctx.strokeStyle = "#d9dee8";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(player.w / 2 + 6, 36);
    ctx.lineTo(player.w / 2 + 48, 8);
    ctx.stroke();
    ctx.fillStyle = "#b7c1cf";
    ctx.beginPath();
    ctx.ellipse(player.w / 2 + 52, 5, 12, 6, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#08101d";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = "#6b7280";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(player.w / 2 + 15, 30);
    ctx.lineTo(player.w / 2 + 22, 26);
    ctx.moveTo(player.w / 2 + 22, 26);
    ctx.lineTo(player.w / 2 + 29, 21);
    ctx.stroke();
    if (player.moveData && player.moveData.luckyGolf) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(player.w / 2 + 66, 16, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#08101d";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawBuffAura(player) {
  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.ellipse(0, 32, player.w + 22, player.h / 2 + 24, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawDamageSmoke(player) {
  const heat = clamp((player.percent - 80) / 110, 0, 1);
  ctx.save();
  ctx.globalAlpha = 0.25 + heat * 0.35;
  ctx.fillStyle = player.slot === 1 ? "#55a7ff" : "#ff5b62";
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(-18 + i * 12, 8 - Math.sin((performance.now() / 180) + i) * 6, 8 + heat * 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawParticle(particle) {
  ctx.globalAlpha = Math.max(0, particle.life / 35);
  if (particle.line) {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.angle);
    ctx.strokeStyle = particle.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-particle.size * 0.5, 0);
    ctx.lineTo(particle.size * 0.5, 0);
    ctx.stroke();
    ctx.restore();
  } else {
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawOverlay(title, subtitle) {
  ctx.fillStyle = "rgba(5, 8, 14, 0.66)";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#ffd15c";
  ctx.textAlign = "center";
  ctx.font = "800 58px system-ui";
  ctx.fillText(title, W / 2, H / 2 - 24);
  ctx.fillStyle = "#f7f0dc";
  ctx.font = "700 22px system-ui";
  ctx.fillText(subtitle, W / 2, H / 2 + 24);
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

function tick(now) {
  const steps = Math.min(3, Math.max(1, Math.round((now - lastTime) / 16.67)));
  lastTime = now;
  if (started && !winner) {
    if (hitStop > 0) {
      hitStop--;
      updateParticles();
    } else {
      for (let i = 0; i < steps; i++) {
        updatePlayer(p1, p2);
        updatePlayer(p2, p1);
        updateParticles();
      }
    }
    syncHud();
  } else {
    updateParticles();
  }
  draw();
  requestAnimationFrame(tick);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

window.addEventListener("keydown", (event) => {
  keys.add(event.code);
  const gameplayKeys = [
    "KeyW", "KeyA", "KeyS", "KeyD", "KeyJ", "KeyK", "KeyL", "Semicolon",
    "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "KeyZ", "KeyX", "KeyC", "KeyV"
  ];
  if (gameplayKeys.includes(event.code)) event.preventDefault();
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.code);
});

document.querySelectorAll("[data-touch]").forEach((button) => {
  const action = button.dataset.touch;
  const start = (event) => {
    event.preventDefault();
    touches.add(action);
  };
  const end = (event) => {
    event.preventDefault();
    touches.delete(action);
  };
  button.addEventListener("pointerdown", start);
  button.addEventListener("pointerup", end);
  button.addEventListener("pointercancel", end);
  button.addEventListener("pointerleave", end);
});

ui.start.addEventListener("click", resetMatch);
[ui.mode, ui.p1Fighter, ui.p2Fighter].forEach((control) => {
  control.addEventListener("change", resetMatch);
});

window.__clashDebug = () => ({
  p1: {
    fighter: p1.fighter.id,
    percent: p1.percent,
    stocks: p1.stocks,
    buffTimer: p1.buffTimer,
    shieldHealth: p1.shieldHealth,
    move: p1.moveData ? p1.moveData.name : null
  },
  p2: {
    fighter: p2.fighter.id,
    percent: p2.percent,
    stocks: p2.stocks,
    buffTimer: p2.buffTimer,
    shieldHealth: p2.shieldHealth,
    move: p2.moveData ? p2.moveData.name : null
  },
  winner: winner ? winner.slot : null
});

resetMatch();
requestAnimationFrame(tick);
