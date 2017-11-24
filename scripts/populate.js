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
  ammo.position = [10,0,-10];
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
  rock1.position = [10,0,-4];
  // spodaj levo
  rock2.position = [-20,0,3];
  rock3.position = [-16,0,12];
  rock4.position = [2,0,27];
  rock5.position = [-22,0,22];
  rock6.position = [-10,0,18];
  zeros = [0, 0, 0];
  rock1.rotation = zeros;
  rock2.rotation = zeros;
  rock3.rotation = zeros;
  rock4.rotation = zeros;
  rock5.rotation = zeros;
  rock6.rotation = zeros;
  // zgoraj levo
  rock7.position = [-5,0,-10];
  rock8.position = [0,0,-12];
  rock9.position = [-15,0,-22];
  rock7.rotation = zeros;
  rock8.rotation = zeros;
  rock9.rotation = zeros;
  //desno
  rock10.position = [22,0,-22];
  rock10.rotation = zeros;
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


}