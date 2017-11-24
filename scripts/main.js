

//
// Matrix utility functions
//
// mvPush   ... push current matrix on matrix stack
// mvPop    ... pop top matrix from stack
// degToRad ... convert degrees to radians
//
function mvPushMatrix() {
  var copy = mat4.create();
  mat4.set(mvMatrix, copy);
  mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

//
// initGL
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initGL(canvas) {
  var gl = null;
  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch(e) {}

  // If we don't have a GL context, give up now
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }
  return gl;
}

//
// getShader
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader(gl, id) {
  var shaderScript = document.getElementById(id);

  // Didn't find an element with the specified ID; abort.
  if (!shaderScript) {
    return null;
  }
  
  // Walk through the source element's children, building the
  // shader source string.
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) {
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
  
  // Now figure out what type of shader script we have,
  // based on its MIME type.
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }

  // Send the source to the shader object
  gl.shaderSource(shader, shaderSource);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

//
// initShaders
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");
  
  // Create the shader program
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  
  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }
  
  // start using shading program for rendering
  gl.useProgram(shaderProgram);
  
  // store location of aVertexPosition variable defined in shader
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  
  // turn on vertex position attribute at specified position
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  // store location of aVertexNormal variable defined in shader
  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");

  // turn on vertex normal attribute at specified position
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  // store location of aTextureCoord variable defined in shader
  shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");

  // turn on vertex texture coordinates attribute at specified position
  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

  // store location of uPMatrix variable defined in shader - projection matrix 
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

  // store location of uMVMatrix variable defined in shader - model-view matrix 
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

  // store location of uNMatrix variable defined in shader - normal matrix 
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

  // store location of uSampler variable defined in shader
  shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

  // store location of uAmbientColor variable defined in shader
  shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");

  // store location of uLightingDirection variable defined in shader
  shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");

  // store location of uDirectionalColor variable defined in shader
  shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
}

//
// setMatrixUniforms
//
// Set the uniforms in shaders.
//
function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

  var normalMatrix = mat3.create();
  mat4.toInverseMat3(mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}
//
// initTextures
//
// Initialize the textures we'll be using, then initiate a load of
// the texture images. The handleTextureLoaded() callback will finish
// the job; it gets called each time a texture finishes loading.
//

//
// handleLoadedWorld
//
// Initialisation of world 
//
function handleLoadedWorld(data) {
  var lines = data.split("\n");
  var vertexCount = 0;
  var vertexPositions = [];
  var vertexTextureCoords = [];
  for (var i in lines) {
    var vals = lines[i].replace(/^\s+/, "").split(/\s+/);
    if (vals.length == 5 && vals[0] != "//") {
      // It is a line describing a vertex; get X, Y and Z first
      vertexPositions.push(parseFloat(vals[0]));
      vertexPositions.push(parseFloat(vals[1]));
      vertexPositions.push(parseFloat(vals[2]));

      // And then the texture coords
      vertexTextureCoords.push(parseFloat(vals[3]));
      vertexTextureCoords.push(parseFloat(vals[4]));

      vertexCount += 1;
    }
  }

  var vertexNormalsCoords = [
  0.0,  0.0,  1.0,
  0.0,  0.0,  1.0,
  0.0,  0.0,  1.0,

  0.0,  0.0,  1.0,
  0.0,  0.0,  1.0,
  0.0,  0.0,  1.0
  ];

  worldVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);
  worldVertexPositionBuffer.itemSize = 3;
  worldVertexPositionBuffer.numItems = vertexCount;

  worldVertexNormalsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexNormalsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormalsCoords), gl.STATIC_DRAW);
  worldVertexNormalsBuffer.itemSize = 3;
  worldVertexNormalsBuffer.numItems = vertexCount;


  worldVertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexTextureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords), gl.STATIC_DRAW);
  worldVertexTextureCoordBuffer.itemSize = 2;
  worldVertexTextureCoordBuffer.numItems = vertexCount;

  document.getElementById("loadingtext").textContent = "";
}





//
// 
// LOAD OBJ FILES
//
//

// Get X,Y,Z scale of OBJ model (for collision detection)
function getOBJSize(mesh){
  var x = [];
  var y = [];
  var z = [];

  for (var i = 0; i < mesh.vertices.length ; i++) {
    if(i%3==0){
      x.push(mesh.vertices[i]);
    }else if(i%3==1){
      y.push(mesh.vertices[i]);      
    }else{
      z.push(mesh.vertices[i]);
    }
  }
  var maxX = Math.max.apply(Math,x);
  var minX = Math.min.apply(Math,x);

  var maxY = Math.max.apply(Math,y);
  var minY = Math.min.apply(Math,y);

  var maxZ = Math.max.apply(Math,z);
  var minZ = Math.min.apply(Math,z);
  
  return [Math.abs(maxX) + Math.abs(minX), Math.abs(maxY) + Math.abs(minY), Math.abs(maxZ) + Math.abs(minZ)]
}


//
// 
//
// 
// LOAD TEXTURES
//
//
function initTextures() {
  wallTexture = gl.createTexture();
  wallTexture.image = new Image();
  wallTexture.image.onload = function () {
    handleTextureLoaded(wallTexture)
  }
  wallTexture.image.src = "./assets/wall.png";

  midTexture = gl.createTexture();
  midTexture.image = new Image();
  midTexture.image.onload = function () {
    handleTextureLoaded(midTexture)
  }
  midTexture.image.src = "./assets/textureJPG.jpg";

  bombTexture = gl.createTexture();
  bombTexture.image = new Image();
  bombTexture.image.onload = function () {
    handleTextureLoaded(bombTexture)
  }
  bombTexture.image.src = "./assets/bombtext.png";

  houseTexture = gl.createTexture();
  houseTexture.image = new Image();
  houseTexture.image.onload = function () {
    handleTextureLoaded(houseTexture)
  }
  houseTexture.image.src = "./assets/farmhouseT.jpg";
  
  ammoTexture = gl.createTexture();
  ammoTexture.image = new Image();
  ammoTexture.image.onload = function () {
    handleTextureLoaded(ammoTexture)
  }
  ammoTexture.image.src = "./assets/D.png";

  bulletTexture = gl.createTexture();
  bulletTexture.image = new Image();
  bulletTexture.image.onload = function () {
    handleTextureLoaded(bulletTexture)
  }
  bulletTexture.image.src = "./assets/Bullet_Texture.jpg";

  rockTexture = gl.createTexture();
  rockTexture.image = new Image();
  rockTexture.image.onload = function () {
    handleTextureLoaded(rockTexture)
  }
  rockTexture.image.src = "./assets/rock1text.jpg";


}




function handleTextureLoaded(texture) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Third texture usus Linear interpolation approximation with nearest Mipmap selection
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.generateMipmap(gl.TEXTURE_2D);

  gl.bindTexture(gl.TEXTURE_2D, null);

  // when texture loading is finished we can draw scene.
  texturesLoaded = true;
  textureCounter=textureCounter+1;
}

//
// 

//
// drawScene
//
// Draw the scene.
//
function drawScene() {
  // set the rendering environment to full canvas size
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // If buffers are empty we stop loading the application.
  if (worldVertexTextureCoordBuffer == null || worldVertexPositionBuffer == null) {
    return;
  }
  
  // Establish the perspective with which we want to view the
  // scene. Our field of view is 45 degrees, with a width/height
  // ratio of 640:480, and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  mat4.identity(mvMatrix);

  // Now move the drawing position a bit to where we want to start
  // drawing the world.



  mat4.rotate(mvMatrix, degToRad(60), [1, 0, 0]);
  if(isCollision){
    mat4.translate(mvMatrix, [-bodysMY[0].position[0], -20, -bodysMY[0].position[2]-15]);
  }else{
    mat4.translate(mvMatrix, [-xPosition, -20, -zPosition-15]);
  }
  mvPushMatrix();

  gl.uniform3f(shaderProgram.ambientColorUniform,0.5,0.5,0.7);

  var lightingDirection = [-0.25,-0.25,0.25];
  var adjustedLD = vec3.create();
  vec3.normalize(lightingDirection, adjustedLD);
  vec3.scale(adjustedLD, -2);
  //console.log(adjustedLD);
  gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

  gl.uniform3f(shaderProgram.directionalColorUniform,1.0,0.6,0.0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, wallTexture);
  
  gl.uniform1i(shaderProgram.samplerUniform, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, worldVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexNormalsBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, worldVertexNormalsBuffer.itemSize, gl.FLOAT, false, 0, 0);

  
  gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, worldVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);


  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, worldVertexPositionBuffer.numItems);

  // ^^^^^^^
  //  WORLD
  


  for (var i = 0; i < rocks.length; i++) {
    mvPopMatrix();
    mvPushMatrix();

    mat4.translate(mvMatrix, [rocks[i].position[0], rocks[i].position[1], rocks[i].position[2]]);

    drawOBJ(rockMesh,rockTexture);


  }

  for (var i = 0; i < meshes.length; i++) {
    // restore last location
    mvPopMatrix();

    // store current location
    mvPushMatrix();

    if (i==0) {
      //soldier

      //mat4.translate(mvMatrix, meshes[i].position);
      mat4.translate(mvMatrix, [bodysMY[i].position[0], bodysMY[i].position[1], bodysMY[i].position[2]+6]);
      mat4.rotate(mvMatrix, degToRad(rotMouse), [0, -1, 0]);
      drawOBJ(mesh,midTexture);

    }else if(i==1){
      //house

      mat4.translate(mvMatrix, meshes[i].position);
      drawOBJ(house,houseTexture);

    }else{
      //bomb
      mat4.translate(mvMatrix, meshes[i].position);
      drawOBJ(bomb,bombTexture);
    }
  }
  
  // draw bullet 
  if (fire) {
    mvPopMatrix();
    mvPushMatrix();

    mat4.translate(mvMatrix, [bulletMesh.xBulletPosition, 2.25, bulletMesh.zBulletPosition+6]);

    mat4.rotate(mvMatrix, degToRad(bulletMesh.bulletRot), [0, -1, 0]);

    drawOBJ(bulletMesh,bulletTexture);
  }
  
  // draw ammo
  if (ammoActive) {
   mvPopMatrix();
   mvPushMatrix();
   mat4.translate(mvMatrix, ammo.position);

   drawOBJ(ammo,ammoTexture);
 }

}


function drawOBJ(obj,texture){

  // Draw the world by binding the array buffer to the world's vertices
  // array, setting attributes, and pushing it to GL.
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, obj.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // Set the texture coordinates attribute for the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.textureBuffer);
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, obj.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, obj.normalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, obj.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);


  // Activate textures
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.uniform1i(shaderProgram.samplerUniform, 0);


  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
  setMatrixUniforms();

  gl.drawElements(gl.TRIANGLES, obj.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

//
// animate
//
// Called every time before redeawing the screen.
//

function animate() {

  var currentX = xPosition;
  var currentZ = zPosition;

  var clickedX = false;
  var clickedZ = false;

  var timeNow = new Date().getTime();
  if (lastTime != 0) {
    var elapsed = timeNow - lastTime;

    if (speedForward != 0) {
      zPosition -= speedForward * elapsed;
      clickedZ == true;
    }

    if (speedSide != 0) {
      xPosition -= speedSide * elapsed;
      clickedX == true;
    }


    // collision detection --> soldier & house
    var io = bodysMY[0];
    io.setPosition([meshes[0].position[0]+xPosition,meshes[0].position[1],meshes[0].position[2]+zPosition+7.5]);		// | offseting zaradi perspektive
    collision = io.detectCollision(bodysMY[1]);																			// | ker sva sla iz 45stopinj na 60stopinj, je zdaj player & bullet po Z osi transliran drugače,
    if(collision != null){																								// | zato: [namest -1.5 je +6 --> 6-(-1.5)=7.5 --> tu popravimo Z position za 7.5] 
      if (speedForward != 0 && speedSide != 0) {																		// ---------------------------------------------------------------------------------------------
        zPosition = currentZ;
        xPosition = currentX;
      }else if(speedForward != 0){
        zPosition = currentZ;        
      }else{
        xPosition = currentX;
      }
    }

	io.setPosition([io.position[0],io.position[1],io.position[2]-7.5]);													// offseting zaradi perspektive - restore
	
	// collision detection --> soldier & rocks										
	for (var i = 0; i < rocks.length; i++) {
	  collision = collisionCheck(bodysMY[0], rocks[i], 1.25);
      if(collision){
        if (speedForward != 0 && speedSide != 0) {
          zPosition = currentZ;
          xPosition = currentX;
        } else if(speedForward != 0) {
          zPosition = currentZ;        
        } else {
          xPosition = currentX;
        }
      }
    }

	// bounds
	if (Math.abs(xPosition) > 29 || Math.abs(zPosition+6) > 29) {
      if (speedForward != 0 && speedSide != 0) {
        zPosition = currentZ;
        xPosition = currentX;
      } else if (speedForward != 0) {
        zPosition = currentZ;        
      } else {
        xPosition = currentX;
      }
    }
    bodysMY[0].setPosition([xPosition,bodysMY[0].position[1],zPosition]);

	// update the game timer
    if(gameActive)
      timer += elapsed;

  }
  lastTime = timeNow;

  // ammo
  if (!ammoActive && timeNow - lastAmmoPickup > ammoSpawnInterval) {
    spawnAmmo();
    console.log("spawn ammo");  
  }
  if (ammoActive && distance([xPosition, zPosition+6], [ammo.position[0], ammo.position[2]]) < 1) {
    lastAmmoPickup = timeNow;
    ammoCount += 5;
    document.getElementById("ammo-count").innerHTML = ammoCount;
    ammoActive = false;

    playAmmoPickup();
  }
 
  // bombs
  if (timeNow - lastSpawn > spawnInterval) {
    if (lastSpawn != 0) 
      spawnBombs();
    lastSpawn = timeNow;
  }
  updateBombDirection();
  animateBombs(elapsed);

  // bullet
  if (fire) {
    var angle = degToRad(bulletMesh.bulletRot);
    bulletMesh.xBulletPosition -= Math.sin(angle)*bulletSpeed;
    bulletMesh.zBulletPosition -= Math.cos(angle)*(-bulletSpeed);
    bulletBody.setPosition([bulletMesh.xBulletPosition, 2.25, bulletMesh.zBulletPosition]);
  }
  if (timeNow - lastFire > bulletLifetime) {
    fire = false;
  }


  checkCollisions();

  updatePhysics();

}


// Function for moving/animating bombs
function animateBombs(elapsed) {
	for (var i = 0; i < bombList.length; i++) {
		bombList[i].position[0] += bombSpeed * elapsed * bombList[i].direction[0];
		bombList[i].position[2] += bombSpeed * elapsed * bombList[i].direction[1];
		bombList[i].aliveFor += elapsed;
		bodysMY[i+2].setPosition(bombList[i].position);
	}
}

//
// Function for spawning bombs and a helper function for randomizing spawn point
function spawnBombs() {
  spawnIndex = getSpawnIndex(bombSpawnPoints.length);
  bombList.push(importOBJ(bombResponseText));
  var tempIdx = bombList.length-1;
  bombList[tempIdx].position = bombSpawnPoints[spawnIndex].slice();
  bombList[tempIdx].rotation = [0,0,0];
  bombList[tempIdx].size = bombSize;
  bombList[tempIdx].program = bombMoveProgram[spawnIndex];
  bombList[tempIdx].currStep = 0;
  bombList[tempIdx].aliveFor = 0;
  meshes[meshes.length] = bombList[tempIdx];
  bodysMY[bodysMY.length] = new OBJmodel(bombList[tempIdx].size, bombList[tempIdx].position, "bomb");
  bombsSpawned++;
}

function removeAllBombs(){
  for (var i = 0; i < bombList.length; i++) {
    bombList.splice(i,1);
    meshes.splice(i+2,1);
    bodysMY.splice(i+2,1);
  }
}

function removeAllBombs(){
  for (var i = 0; i < bombList.length; i++) {
    bombList.splice(i,1);
    meshes.splice(i+2,1);
    bodysMY.splice(i+2,1);
  }
}

function getSpawnIndex(upTo) {
  var rand = Math.floor(Math.random() * upTo);
  while (rand == lastSpawnIndex)
	rand = Math.floor(Math.random() * upTo);
  lastSpawnIndex = rand;
  return rand;
}

// Destroy bomb at index i
function destroyBomb(i) {
  bombList.splice(i,1);
  meshes.splice(i+2,1);
  playExplosion();
}

// Update the direction of bombs
function updateBombDirection() {
	for (var i = 2; i < meshes.length; i++) {
		//meshes[i].direction = moveBomb([meshes[i].position[0], meshes[i].position[2]], [0, 0]);
		var curr = meshes[i];
		meshes[i].direction = moveBomb([meshes[i].position[0], meshes[i].position[2]], curr.program[curr.currStep])
		
		var distToNextStep = distance([curr.position[0], curr.position[2]], curr.program[curr.currStep]);
		if (distToNextStep < 0.25)
			meshes[i].currStep++;
	}
}
//Function for moving bomb from point a to point b
function moveBomb(p1, p2) {
	var x1 = p1[0];
	var x2 = p2[0];
	var y1 = p1[1];
	var y2 = p2[1];
	var dir = [(x2-x1), (y2-y1)];
	var dist = distance(p1, p2);
	var moveVector= [dir[0]/dist, dir[1]/dist];
	return moveVector;
}


// Helper: get distance between point p1 and p2
function distance(p1, p2) {
	var x1 = p1[0];
	var x2 = p2[0];
	var y1 = p1[1];
	var y2 = p2[1];
	return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}


//
// Keyboard handling helper functions
//
// handleKeyDown    ... called on keyDown event
// handleKeyUp      ... called on keyUp event
//
function handleKeyDown(event) {
  // storing the pressed state for individual key
  currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
  // reseting the pressed state for individual key
  currentlyPressedKeys[event.keyCode] = false;
}

//
// handleKeys
//
// Called every time before redeawing the screen for keyboard
// input handling. Function continuisly updates helper variables.
//
function handleKeys() {

  if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
    // Left cursor key or A
    speedSide = movingSpeed;
  } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
    // Right cursor key or D
    speedSide = -movingSpeed;
  } else {
    speedSide = 0;
  }

  if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
    // Up cursor key or W
    speedForward = movingSpeed;
  } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
    // Down cursor key
    speedForward = -movingSpeed;
  } else {
    speedForward = 0;
  }
  
  if (currentlyPressedKeys[16]) {
	speedSide *= 1.5;
	speedForward *= 1.5;
	sprinting = true;
  }
  else
	sprinting = false;

  if (currentlyPressedKeys[32]) {
    // delete bomb that spawned first
    destroyBomb(0);
  }
}

// rotate soldier
function mouseRotation(x,y){
  xx = x - (gl.viewportWidth/2);
  yy = y - (gl.viewportHeight/2);
  rotMouse = angle(xx, yy, 0, 75);
}
//get angle
function angle(a1, a2, b1, b2) {
  theta = Math.atan2(b1 - a1, a2 - b2);
  if (theta < 0.0)
    theta += 2*Math.PI
  return theta/ Math.PI * 180;
}




function getBombBody(i) {
	return bodysMY[i+2];
}

// Add new ammo crate
function spawnAmmo() {
  var spawnIndex = ++ammoLastSpawn;
  ammo.position[0] = ammoSpawnPoints[spawnIndex][0];
  ammo.position[1] = 0;
  ammo.position[2] = ammoSpawnPoints[spawnIndex][2];
  ammoActive = true;
}


//
// inicializacija okolja
function initPhy() {
  populate();
}

//
// Collision detection
function checkCollisions(){
    // Soldier vs Bombs
  for (var i = 0; i < bombList.length; i++) {
  //if(bodysMY[0].detectCollision(getBombBody(i)) != null){
    if (collisionCheck(bodysMY[0], getBombBody(i), 0.75)) {
      destroyBomb(i); 
      //Soldier dies
      playerHP -= 10;
      document.getElementById("health-soldier").innerHTML = playerHP;

function updatePhysics() {
  var collision, imesh, bodyMY, moveX, moveZ, i = bodysMY.length;
  while (i--){
    bodyMY = bodysMY[i];
    imesh = meshes[i];

    if (i == 0){
      bodysMY[0].setPosition([imesh.position[0]+xPosition,imesh.position[1],imesh.position[2]+zPosition]);                
    }
  }
  drawScene();
}



//
// Collision detection
function checkCollisions(){
  // Soldier vs Bombs
  for (var i = 0; i < bombList.length; i++) {
    if (collisionCheck(bodysMY[0], getBombBody(i), 0.75)) {
      destroyBomb(i); 
      //Soldier dies
      playerHP -= 10;
      document.getElementById("health-soldier").innerHTML = playerHP;

    }
  }

  //House vs Bombs
  for (var j = 0; j < bombList.length; j++) {
    if(bodysMY[1].detectCollision(getBombBody(j)) != null) {
      destroyBomb(j);   
      houseHP -= 100;
      document.getElementById("health-house").innerHTML = houseHP
      if (houseHP == 0) {
        gameActive = false;
      }
    }
  }


  //Bullet vs Bombs
  for (var j = 0; j < bombList.length; j++) {
    if (fire && collisionCheck(bulletBody, getBombBody(j), 0.5)) {

	  fire = false;
	  // določi oceno 	--> če bombice ne uničimo v manj kot 10 sekundah (od njenega spawna), dobimo samo 10 točk
	  //				--> če jo uničimo prej kot v 10 sekundah, potem dobimo točke določene po formuli  'score' = 'procent preostalega časa za uničenje bombice' * 100   (score je lahko najmanj 10 in največ 100)
	  var score = 10;
	  if (bombList[j].aliveFor <= 10000)
		  score = Math.max(10, (1 - (bombList[j].aliveFor/10000)) * 100);
	  console.log("score: " + score);
	  totalScore += score;
	  
	  bombsKilled++;
      destroyBomb(j);
    }
  }
  
  //Bullet vs Nature (rocks, trees)
  if (fire) {
	bulletBody.setPosition([bulletBody.position[0],bulletBody.position[1],bulletBody.position[2]-1]);					// spet offseting, tokrat zato ker je metek dvignjen na Y osi, skala pa ni (je na Y=0)
	for (var j = 0; j < rocks.length; j++) {																			//   --> treba popravit Z os metka, da deluje collision kot je treba tudi če streljamo iz strani
      if (collisionCheck(bulletBody, rocks[j], 1.25)) {
        fire = false;
      }
    }

	bulletBody.setPosition([bulletBody.position[0],bulletBody.position[1],bulletBody.position[2]+1]);
  }


  //Bullet vs House
  if (fire) {
	  var io = bulletBody;
	  io.setPosition([bulletBody.position[0],bulletBody.position[1],bulletBody.position[2]+7.5]);						// standard offseting zaradi hiše
	  if (bodysMY[1].detectCollision(bulletBody) != null) {
		fire = false;
	  }
	  io.setPosition([io.position[0],io.position[1],io.position[2]-7.5]);
  }
  
}

//
// Funkcija za collision detection med telesoma body1 & body2  [primitivna -> gleda samo 2 dimenziji in računa razdaljo med centroma (zato uporabna samo za kvadratne/okorgle objekte)]
function collisionCheck(body1, body2, dist) {
	var originIsPlayer = 0;
	if (body1.name === "soldier" || body1.name === "bullet")
		originIsPlayer = 6;
	var p1 = [body1.position[0], body1.position[2]+originIsPlayer];
	var p2 = [body2.position[0], body2.position[2]];
	return distance(p1, p2) < dist;
}




//
// start
//
// Called when the canvas is created to get the ball rolling.
// Figuratively, that is. There's nothing moving in this demo.
//

function initHUD(){
  $("#container").css("width", $("#glcanvas").width());
  $("#container").css("height", $("#glcanvas").height());
}

function start() {
  canvas = document.getElementById("glcanvas");
  infos = document.getElementById("info");
  $("#overlay-gameover").hide();
  $("#restart-wrapper").hide();
  //mouse movement listner
  initHUD();
  canvas.addEventListener("mousemove", function(evt) {
    var xMouse = evt.offsetX || (evt.pageX - canvas.offsetLeft);
    var yMouse = evt.offsetY || (evt.pageY - canvas.offsetTop);
    mouseRotation(xMouse,yMouse);
  }, false
  );
  //mouse click listener
  canvas.addEventListener("mousedown", function(evt) {
    if(evt.button != 0)
      return;
    var currTime = new Date().getTime();
    if ((currTime - lastFire > fireCooldown || lastFire == 0) && ammoCount > 0 && !sprinting) {
      lastFire = currTime;
      fire = true;
      ammoCount--;
      document.getElementById("ammo-count").innerHTML = ammoCount;
      bulletMesh.xBulletPosition = xPosition;
      bulletMesh.zBulletPosition = zPosition;
      bulletMesh.bulletRot = rotMouse;
	  bulletBody = new OBJmodel(getOBJSize(bulletMesh), [xPosition,2.25,zPosition], "bullet");

      playShot();
    }
    if(ammoCount == 0) {
      playEmptyPickup();
    } 
  }, false
  );

  
    gl = initGL(canvas);      // Initialize the GL context

  // Only continue if WebGL is available and working
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
    gl.clearDepth(1.0);                                     // Clear everything
    gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
    gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things

    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.
    initShaders();
    
    // Next, load and set up the textures we'll be using.
    initTextures();
    // Initialise world objects
    loadObjects();
    playAmbientAudio();
    playStartingSound();

    document.getElementById("health-house").innerHTML = houseHP;
    document.getElementById("health-soldier").innerHTML = playerHP;
    document.getElementById("bomb-counter").innerHTML = "Bombs destroyed: " + bombsKilled;
    setTimeout(
      function() 
      {
        initPhy();

      //console.log(getOBJSize(mesh));
      // Bind keyboard handling functions to document handlers
      document.onkeydown = handleKeyDown;
      document.onkeyup = handleKeyUp;
      
      // Set up to draw the scene periodically.
      var intervalID = setInterval(function() {
        if (textureCounter >=targetLoadedTextures && loadedMeshes >=targetLoadedMeshes){          
          if (!gameActive)
            clearInterval(intervalID);
        requestAnimationFrame(animate);
        handleKeys();
        setTimer(timer);
        if (timer > endTime || houseHP <= 0 || playerHP <= 0) {
          showEnd();
        }
      }
    }, 1000/60);
    }, 500);
  }
}

function restartGame(){
  $("#overlay-gameover").hide();
  $("#restart-wrapper").hide();
  gameActive = true;
  playStartingSound();
  removeAllBombs();
  //Restart position, counters, hide GAME OVER text
  timer = 0;

  lastTime = 0;
  houseHP = 1000;
  playerHP = 100;
  bombsSpawned = 0;
  bombsKilled = 0;
  totalScore = 0;
  
  ammoCount = 5;
  ammoLastSpawn = 0;

  xPosition = 0;
  zPosition = 0;
  document.getElementById("health-house").innerHTML = houseHP;
  document.getElementById("health-soldier").innerHTML = playerHP;
  document.getElementById("ammo-count").innerHTML = ammoCount;
  start();
}

function showEnd(){
  $("#overlay-gameover").show();
  $("#restart-wrapper").show();
  gameActive = false;
  playEndingSound();
  document.getElementById("bomb-counter").innerHTML = "Score: " + Math.round(totalScore);

  document.getElementById("bomb-counter").innerHTML = "Total score: " + Math.round(totalScore);

}

function setTimer(time){
  $("#timer").html(Math.ceil((endTime-timer)/1000));
}

