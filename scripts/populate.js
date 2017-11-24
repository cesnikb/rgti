function populate() {
  //soldier
  mesh.position = [0,0,0];
  mesh.rotation = [0,0,0];
  mesh.size = getOBJSize(mesh);
  meshes[0] = mesh;

  bodysMY[0] = new OBJmodel(mesh.size, mesh.position, "soldier");

  //house
  house.position = [10,0,10];
  house.rotation = [0,0,0];
  house.size = getOBJSize(house); 
  meshes[1] = house;

  bodysMY[1] = new OBJmodel(house.size, house.position, "house");

  // ammo
  ammo.position = ammoSpawnPoints[0];
  ammo.rotation = [0,0,0];
  ammo.size = getOBJSize(ammo);

  //addBomb();

  // rocks
  var rock1 = importOBJ(rockResponseText);
  var rock2 = importOBJ(rockResponseText);
  var rock3 = importOBJ(rockResponseText);
  var rock4 = importOBJ(rockResponseText);
  var rock5 = importOBJ(rockResponseText);
  var rock6 = importOBJ(rockResponseText);
  var rock7 = importOBJ(rockResponseText);
  var rock8 = importOBJ(rockResponseText);
  var rock9 = importOBJ(rockResponseText);
  var rock10 = importOBJ(rockResponseText);
  var rock11 = importOBJ(rockResponseText);
  var rock12 = importOBJ(rockResponseText);

  var rock13 = importOBJ(rockResponseText);
  var rock14 = importOBJ(rockResponseText);
  var rock15 = importOBJ(rockResponseText);
  var rock16 = importOBJ(rockResponseText);
  var rock17 = importOBJ(rockResponseText);
  var rock18 = importOBJ(rockResponseText);
  var rock19 = importOBJ(rockResponseText);
  var rock20 = importOBJ(rockResponseText);
  var rock21 = importOBJ(rockResponseText);
  var rock22 = importOBJ(rockResponseText);
  var rock23 = importOBJ(rockResponseText);

  rock1.position = [12,0,-6];
  // spodaj levo
  rock2.position = [-20,0,3];
  rock3.position = [-15,0,12];
  rock4.position = [2,0,25];
  rock5.position = [-22,0,22];
  rock6.position = [-6,0,18];
  rock12.position = [13,0,27];

  zeros = [0, 0, 0];
  rock1.rotation = zeros;
  rock2.rotation = zeros;
  rock3.rotation = zeros;
  rock4.rotation = zeros;
  rock5.rotation = zeros;
  rock6.rotation = zeros;

  rock12.rotation = zeros;
  // zgoraj levo
  rock7.position = [-5,0,-10];
  rock8.position = [2,0,-13];
  rock9.position = [-20,0,-18];
  rock10.position = [-14,0,-4];
  rock13.position = [1,0,-3];
  rock14.position = [-10,0,-16];
  rock15.position = [-22,0,-10];
  rock16.position = [-2,0,-22];

  rock7.rotation = zeros;
  rock8.rotation = zeros;
  rock9.rotation = zeros;
  rock10.rotation = zeros;

  rock13.rotation = zeros;
  //desno
  rock11.position = [22,0,-22];
  rock17.position = [22,0,3];
  rock18.position = [18,0,-12];
  rock19.position = [10,0,-18];
  rock20.position = [25,0,24];
  rock21.position = [20,0,20];
  rock22.position = [24,0,12];
  rock23.position = [26,0,-16];
  rock11.rotation = zeros;
  rock17.rotation = zeros;
  rock18.rotation = zeros;
  rock19.rotation = zeros;
  rock20.rotation = zeros;
  rock21.rotation = zeros;
  rock22.rotation = zeros;
  rock23.rotation = zeros;
  // size

  rock1.size = rockSize;
  rock2.size = rockSize;
  rock3.size = rockSize;
  rock4.size = rockSize;
  rock5.size = rockSize;
  rock6.size = rockSize;
  rock7.size = rockSize;
  rock8.size = rockSize;
  rock9.size = rockSize;
  rock10.size = rockSize;
  rock11.size = rockSize;
  rock12.size = rockSize;
  rock13.size = rockSize;
  rock14.size = rockSize;
  rock15.size = rockSize;
  rock16.size = rockSize;
  rock17.size = rockSize;
  rock18.size = rockSize;
  rock19.size = rockSize;
  rock20.size = rockSize;
  rock21.size = rockSize;
  rock22.size = rockSize;
  rock23.size = rockSize;

  rock1 = new OBJmodel(rock1.size, rock1.position, "rock");
  rock2 = new OBJmodel(rock2.size, rock2.position, "rock");
  rock3 = new OBJmodel(rock3.size, rock3.position, "rock");
  rock4 = new OBJmodel(rock4.size, rock4.position, "rock");
  rock5 = new OBJmodel(rock5.size, rock5.position, "rock");
  rock6 = new OBJmodel(rock6.size, rock6.position, "rock");
  rock7 = new OBJmodel(rockSize, rock7.position, "rock");
  rock8 = new OBJmodel(rockSize, rock8.position, "rock");
  rock9 = new OBJmodel(rockSize, rock9.position, "rock");
  rock10 = new OBJmodel(rockSize, rock10.position, "rock");
  rock11 = new OBJmodel(rockSize, rock11.position, "rock");
  rock12 = new OBJmodel(rockSize, rock12.position, "rock");
  rock13 = new OBJmodel(rockSize, rock13.position, "rock");
  rock14 = new OBJmodel(rockSize, rock14.position, "rock");
  rock15 = new OBJmodel(rockSize, rock15.position, "rock");
  rock16 = new OBJmodel(rockSize, rock16.position, "rock");
  rock17 = new OBJmodel(rockSize, rock17.position, "rock");
  rock18 = new OBJmodel(rockSize, rock18.position, "rock");
  rock19 = new OBJmodel(rockSize, rock19.position, "rock");
  rock20 = new OBJmodel(rockSize, rock20.position, "rock");
  rock21 = new OBJmodel(rockSize, rock21.position, "rock");
  rock22 = new OBJmodel(rockSize, rock22.position, "rock");
  rock23 = new OBJmodel(rockSize, rock23.position, "rock");

  rocks[0] = rock1;
  rocks[1] = rock2;
  rocks[2] = rock3;
  rocks[3] = rock4;
  rocks[4] = rock5;
  rocks[5] = rock6;
  rocks[6] = rock7;
  rocks[7] = rock8;
  rocks[8] = rock9;
  rocks[9] = rock10;
  rocks[10] = rock11;
  rocks[11] = rock12;
  rocks[12] = rock13;
  rocks[13] = rock14;
  rocks[14] = rock15;
  rocks[15] = rock16;
  rocks[16] = rock17;
  rocks[17] = rock18;
  rocks[18] = rock19;
  rocks[19] = rock20;
  rocks[20] = rock21;
  rocks[21] = rock22;
  rocks[22] = rock23;


}