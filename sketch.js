var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOverImg,gameOver;
var restart,restartImg;
var playerImg, player;
var enemy1, enemy2, enemyGroup;
var spaceBgImg, spaceBg;
var fuelImg, fuel,fuelGroup;
var distance=0;
var fuelLeft=100;
var astronautImg,astronaut,astronautGroup;
var youWinImg,youwin;
var gameOversound,checkpointSound,youWinSound;
var playerGroup;


function preload(){
gameOverImg=loadImage("gameOver.png");
restartImg=loadImage("restart.png");
playerImg=loadImage("spacecraft.png");
spaceBgImg=loadImage("spacebg.jpg");
fuelImg=loadImage("fuel.png");
enemy1=loadImage("enemy.png");
enemy2=loadImage("enemy1.png");
astronautImg=loadImage("astronaut.jpg");
youWinImg=loadImage("youwin.png");
checkpointSound=loadSound("checkpoint.mp3");
gameOversound=loadSound("gameOver.mp3");
youWinSound=loadSound("Winning.mp3");
}

function setup(){
createCanvas(500,600)
  //for groups
  fuelGroup=createGroup();
  enemyGroup=createGroup();
  astronautGroup=createGroup();
  playerGroup=createGroup();
  //for bg
  spaceBg=createSprite(250,300);
  spaceBg.addImage(spaceBgImg);
  spaceBg.velocityY=(1+(frameCount%50===0));
  console.log(spaceBg.velocityY);
  spaceBg.scale=2.7;
  
  //for gameOver
  gameOver=createSprite(248,300,30,30)
  gameOver.addImage(gameOverImg);
  gameOver.scale=1.5;
  gameOver.visible=false;
  
  //for restart
  restart=createSprite(250,410,30,30);
  restart.addImage(restartImg);
  restart.scale=0.2;
  restart.visible=false;
  
  //for player
  player=createSprite(250,510,30,30);
  player.addImage(playerImg);
  player.scale=0.2;
  //player.debug=true;
  player.setCollider("rectangle",0,0,230,400);
  
  
  
  //for you win
  youwin=createSprite(255,300,50,50)
  youwin.addImage(youWinImg);
  youwin.visible=false;
  youwin.scale=1.2;
  
}

function draw(){
  background(0)
      
  if(gameState===PLAY){
    
    //for sound
    //rocketSound.play();
    
    //background reset
    if(spaceBg.y>510){
    spaceBg.y=300;
    }
    //for movement
    if(keyDown("d")&&player.x<450){
      player.x=player.x+5;
    }
    
    if(keyDown("a")&&player.x>50){
      player.x=player.x-5;
    }
    if(keyDown("w")&&player.y>50){
      player.y=player.y-5;
    }
    if(keyDown("s")&&player.y<550){
      player.y=player.y+5;
    }
    //for player\
    playerGroup.add(player);
    
    //for fuel
    if(fuelGroup.isTouching(player)&&fuelLeft<120){
      fuelLeft=fuelLeft+5;
      fuelGroup.destroyEach();
      checkpointSound.play();
    }
    
    //for spawning
    spawnFuel();
    spawnEnemy();
    spawnAstronaut();
    
    
    //for calculation
    distance=Math.floor(frameCount/frameRate());
    if(distance%10===0){
       fuelLeft=fuelLeft-0.3;
      
    }
    

    //for ending
    if(enemyGroup.isTouching(player)||fuelLeft<0){
      gameState=END;
      gameOversound.play();
      
    }
    //for surprise
    if(astronautGroup.isTouching(player)){
    spaceBg.velocityY=0;
    enemyGroup.setVelocityYEach(0);
    enemyGroup.setLifetimeEach(-1);
    fuelGroup.setVelocityYEach(0);
    fuelGroup.setLifetimeEach(-1);
    astronautGroup.destroyEach();
    distance=0;
    frameCount=0;
    restart.visible=true;
    youwin.visible=true;
    gameState=END;
    youWinSound.play();
    if(mousePressedOver(restart)){
    reset();
    }
}
  
  }else if(gameState===END){
    //rocketSound.stop();
    gameOver.visible=true;
    restart.visible=true;
    spaceBg.velocityY=0;
    distance=0;
    frameCount=0;
    enemyGroup.setVelocityYEach(0);
    enemyGroup.setLifetimeEach(-1);
    fuelGroup.setVelocityYEach(0);
    fuelGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)){
      reset();
    }
    enemyGroup.setDepthEach(1);
    fuelGroup.setDepthEach(1)
    playerGroup.setDepthEach(1)
  }
      drawSprites();
  //for text
  //for ditance travelled
  stroke(0);
  textSize(20);
  fill(215, 103, 254);
  text("Distance Travelled:"+distance+"   Million KM",10,50);
    
    stroke(0);
  textSize(20);
  fill(215, 103, 254);
  text("Fuel Left:"+fuelLeft,381,570); 
    
    if(distance<4&&gameState===PLAY){
  textSize(20);
  fill(255);
  text("W,A,S,D to move",180,300); 
    }
    
}

//for reset
function reset(){
  //logic
gameState=PLAY;
player.x=250;
player.y=510;
  gameOver.visible=false;
  restart.visible=false;
  youwin.visible=false;
  enemyGroup.destroyEach();
  fuelGroup.destroyEach();
  distance=Math.floor(frameCount/frameRate());
  fuelLeft=100;
  spaceBg.velocityY=(1+(frameCount%50===0));
  
  
}

function spawnAstronaut(){
  if(frameCount%10000===0){ 
    astronaut=createSprite(250,150,20,20);
    astronaut.addImage(astronautImg);
    //fuel.x=Math.round(random(50,420));
    astronaut.velocityY=5;
    astronaut.lifetime=125;
    astronautGroup.add(astronaut)
    astronaut.scale=0.2;
  }
}

//for fuel
function spawnFuel(){
  if(frameCount%117===0&&fuelLeft<120){ 
    fuel=createSprite(240,10,20,20);
    fuel.addImage(fuelImg);
    fuel.x=Math.round(random(50,420));
    fuel.velocityY=(5+(frameCount%50===0));
    fuel.lifetime=125;
    fuelGroup.add(fuel);
    fuel.scale=0.1;
    
    fuel.depth=gameOver.depth
    gameOver.depth=gameOver.depth+1
  }
}
//for enemy
function spawnEnemy(){
 if (frameCount % 220 === 0){
   var enemy = createSprite(600,10,10,40);
   enemy.velocityY = (6 + (frameCount%50===0));
   enemy.x=Math.round(random(100,350))
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: enemy.addImage(enemy1);
              break;
      case 2: enemy.addImage(enemy2);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    enemy.scale = 0.5;
   enemy.lifetime = 150;
   
   //add each obstacle to the group
    enemyGroup.add(enemy);
   
   
   
 }
}



