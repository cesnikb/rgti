// Global variable definitionvar canvas;
var canvas;
var gl;
var shaderProgram;



// Buffers
var worldVertexPositionBuffer = null;
var worldVertexTextureCoordBuffer = null;
var mesh = null;
var bomb = null;
var house = null;
var ammo;
var bulletMesh;
var rockMesh;
var bombList = [];
var loadedMeshes = 0;
//set how many meshes needs to be loaded
var targetLoadedMeshes = 7;
var textureCounter = 0;
//set how many textures needs to be loaded
var targetLoadedTextures = 7;

// Model-view and projection matrix and model-view matrix stack
var mvMatrixStack = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

// Variables for storing textures
var wallTexture = null;
var midTexture = null;
var bombTexture = null;
var houseTexture = null;
var ammoTexture = null;
var bulletTexture = null;
var rockTexture = null;
// Variable that stores  loading state of textures.
var texturesLoaded = false;

// Keyboard handling helper variable for reading the status of keys
var currentlyPressedKeys = {};

// Variables for storing current position and speed
var xPosition = 0;
var yPosition = 3;
var zPosition = 0;
var speedForward = 0;
var speedSide = 0;

//mouse position
var xMouse = 0;
var yMouse = 0;
var rotMouse = 0;
var movingSpeed = 0.008;

var spawnPosition = [1,0,0];

// Helper variable for animation
var lastTime = 0;


var isCollision = false;

//
// Firing
var fire=false;

var sprinting = false;
var lastFire = 0;
var ammoCount = 5;
var fireCooldown = 1000;
var bulletLifetime = 900;
var xBulletPosition;
var zBulletPosition;
var bulletRot;
var bulletSpeed = 0.4;
var bulletBody;
//
// Moving bombs
var bombSpeed = 0.004;

var bombSize;
var bombResponseText;

var lastSpawn = 0;
var spawnInterval = 2000;
var lastSpawnIndex = 0;

var bombSpawnPoints = [
	[10,0,-23],
	[-20,0,-20],
	[0,0,-25],

	[-15,0,-20],
	[-23,0,-14]];
	//[10,0,29]];
var bombMoveProgram = [
	[[18,-18], [24, -12], [16, -8], [24, -2], [10, 10]],				// zgoraj desno
	[[-10,-12], [-18, -8], [-14, 0], [-7, 3], [6, 10]],				// zgoraj levo
	[[5, -20], [-8, -16], [2, -8], [-5, -5], [8, 8]],				// še bolj zgoraj desno
	[[-10, -23], [-2, -14], [5, -13], [8, -2], [12, 10]],
	[[-27, -2], [-20, 12], /*[-16, 10],*/ [-14, 5], [8, 12]]];				// skrajno levo				
	//[[-5, 28], [-12, 22], [-16, 18], [-7, 16], /*[-3, 14],*/ [6, 8]]];		// spodaj levo
	
//
// Ammo
var ammoActive = true;
var lastAmmoPickup = 0;
var ammoSpawnInterval = 3000;
var ammoLastSpawn = 0;
var ammoSpawnPoints = [
	[18,0,-2],
	[-12,0,-2],
	[-12,0,16],
	[8,0,20],
	[18,0,-2],
	[-12,0,-2],
	[-12,0,16],
	[8,0,20],
	[18,0,-2],
	[-12,0,-2],
	[-12,0,16],
	[8,0,20],
	[18,0,-2],
	[-12,0,-2],
	[-12,0,16],
	[8,0,20]];

//
// Nature
var rocks;
var rockResponseText;
var rockSize;

//
// Game
var timer = 0;
var houseHP = 1000;
var playerHP = 100;
var bombsKilled = 0;
var bombsSpawned = 0;
var gameActive = true;
var totalScore = 0;

var endTime = 45000;



var meshes = [];
var meshesPositions = [];
var bodysMY = [];
var rocks = [];
var infos;
var rock;
