var PLAY = 1;
var backgroundImg;
var END = 0;
var gameState = PLAY;



var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 0;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  sunImg = loadImage("sun.png")
  backgroundImg = loadImage("backgroundImg.png")
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
 
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkpoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  sun = createSprite(width-50,100,10,10);
  sun.addImage("sun", sunImg)
  sun.scale = 0.5;

  
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.08;
       
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
   gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;
  
  
  //crear grupos de obstáculos y nubes
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hola" + 5);
  
  trex.setCollider("circle",0,0,40);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(backgroundImg);
  //mostrar puntuación
  text("Puntuación: "+ score, 500,50);
  
  console.log("esto es ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //mover el suelo
    ground.velocityX = -(4 + 3 * score / 100)
    //puntuación
    score = score + Math.round(frameCount/60);
    
   if(score>0 && score %100 === 0){
    checkPointSound.play()
   }

    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //hacer que el trex salte al presionar la barra espaciadora
    if(keyDown("space")&& trex.y >= 100) {
      trex.velocityY = -12;
      jumpSound.play()
  }
    
    //agregar gravedad
    trex.velocityY = trex.velocityY + 0.8
  
    //aparecer las nubes
    spawnClouds();
  
    //aparecer obstáculos en el suelo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //cambiar la animación del trex
      trex.changeAnimation("collided", trex_collided);
     
      //establecer lifetime de los objetos del juego para que no sean destruidos nunca
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  //evitar que el trex caiga
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)){
    resset();
  }
    
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,height-95,20,30);
   obstacle.velocityX = -(6 + score / 100);
   
    //generar obstáculos al azar
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      
      default: break;
    }
   
    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escribir aquí el código para aparecer las nubes
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar lifetime a la variable
    cloud.lifetime = 134;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar cada nube al grupo
   cloudsGroup.add(cloud);
    }
}

function resset()  {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
} 