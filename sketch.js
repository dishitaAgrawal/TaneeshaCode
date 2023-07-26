var PLAY = 1;
var END = 0;

var mountain, mountainIMG;
var plane, planeImg, planeAnimation;
var bulletGroup, bullet, bulletIMG;

var obstacleGroup, obstacle, obstacleIMG;
var fighterJetGroup, fighterJet, fighterJetIMG;
var spaceship, spaceshipIMG;
var spaceshipBulletGroup, spaceshipBullet, spaceshipBulletIMG;
var collison, collisionIMG;

var counter = 0
var gameState= "stage1"
var score;
var gameOverImg, restartImg;

var stage2Bg;
var stage3Bg;

var stage3PlaneLife;
var stage3SpaceshipLife;

function preload(){
 mountainIMG = loadAnimation("hero-image.png");
 planeImg= loadAnimation('plane1.png');
 collisionIMG = loadAnimation("explosion.png");
 obstacleIMG = loadImage('obstacle.png');
 fighterJetIMG = loadImage('villan.png');
 spaceshipIMG = loadImage('spaceship.png');
 bulletIMG = loadImage('bullet.png');
 spaceshipBulletIMG = loadImage('spaceshipBullet.png');
 
 restartImg = loadImage('restart.png');
 gameOverImg = loadImage('gameOver.png');
 stage2Bg = loadAnimation("bg2.avif");
 stage3Bg = loadAnimation("bg3.avif");
}

function setup(){
  createCanvas(600,300);

  

  mountain = createSprite(250,120,600,300);
  mountain.addAnimation("stage1",mountainIMG);
  mountain.addAnimation("stage2",stage2Bg);
  mountain.addAnimation("stage3",stage3Bg);
  mountain.velocityX = -3;

  plane = createSprite(65,140,10,10);
  plane.addAnimation("stationary",planeImg);
  plane.scale= 1.5;

  spaceship = createSprite(550,5,10,10);
  spaceship.addImage(spaceshipIMG);
  spaceship.scale = 0.2

  //collision = createSprite(550,5,10,10);
  //collison.addAnimation("collide",collisionIMG);
  //collison.scale = 0.5

  gameOver = createSprite(295,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.4

  restart = createSprite(300,183);
  restart.addImage(restartImg);

  gameOver.visible = false;
  restart.visible = false;
  spaceship.visible = false;
  //collision.visible = false;

  plane.setCollider("rectangle",0,0,plane.width,plane.height);
  plane.debug = true;
  

  obstacleGroup = createGroup();
  fighterJetGroup = createGroup();
  bulletGroup = createGroup();
  spaceshipBulletGroup = createGroup();
  stage3PlaneLife = 185;
  stage3SpaceshipLife = 10;
}

function draw(){
  background(0);
  
  
  if(gameState =="stage1"){

    if(mountain.x<0){
      mountain.x=mountain.width/2;  
      counter+=1
   }

    if(keyDown(UP_ARROW)){
      plane.velocityY= -3
    }
    
    plane.velocityY =plane.velocityY + 0.5

    if(obstacleGroup.isTouching(plane)){
      gameState = "end";
    }
    
  // if (counter==5){
  //   gameState= "stage2"
  // }
  if (counter==2){
    
    plane.velocityX = 0;
    plane.velocityY = 0;
    
    obstacleGroup.destroyEach()
    stage3()


  }

  drawObstacles();
  }
  
  else if(gameState=="stage2"){
    mountain.changeAnimation('stage2');
    
    if(fighterJetGroup.isTouching(plane)){
      gameState = "end2"
    }
    if(keyDown(UP_ARROW)){
      plane.velocityY= -3
    }
    
    plane.velocityY =plane.velocityY + 0.5

    drawFighterJets()}

    else if(gameState=="stage3"){
      console.log("stage3 happened")
      mountain.changeAnimation('stage3');
      mountain.velocityX=0;
      spaceship.visible = true;


      if(spaceship.y>265){
        spaceship.velocityY = -3;
      }else if(spaceship.y<40) {
        spaceship.velocityY = 3;
      }

      if(keyDown(UP_ARROW)){
        console.log("up happened")
        if(plane.y>40){
                plane.y = plane.y - 3
        }
      }
      if(keyDown(DOWN_ARROW)){      
 
          console.log("down happened")
          if(plane.y<265){
                  plane.y = plane.y + 3
          }
      }

      shootSpaceshipBullet();

      spaceshipBulletGroup.overlap(plane, function(collector, collected){
        collector.destroy()
        stage3PlaneLife-=185/4
      })

      bulletGroup.overlap(spaceship, function(collector, collected){
        collector.destroy()
        stage3SpaceshipLife-=1
      })

      if(stage3PlaneLife<=0){
          gameState="end3"
      }
      if(stage3SpaceshipLife<=0){
        gameState="end3"
    }
    }

    else if(gameState === "end2"){
      gameOver.visible = true;
      restart.visible = true;
      fighterJetGroup.destroyEach();
      plane.velocityX = 0;
      plane.velocityY = 0;
      mountain.velocityX = 0;
    }
    
    else if(gameState === "end"){
      gameOver.visible = true;
      restart.visible = true;
      obstacleGroup.destroyEach();
      plane.velocityX = 0;
      plane.velocityY = 0;
      mountain.velocityX = 0;
    }   
    
    else if(gameState === "end3"){
      gameOver.visible = true;
      restart.visible = true;
      spaceshipBulletGroup.destroyEach();
      plane.velocityX = 0;
      plane.velocityY = 0;
      spaceship.velocityY=0

    }

    else if(gameState==="win"){
      gameOver.visible = true;
      restart.visible = true;
      obstacleGroup.destroyEach();
      plane.velocityX = 0;
      plane.velocityY = 0;
      mountain.velocityX = 0;
      
    }

    if(mousePressedOver(restart)){
      reset()
    }

drawSprites();
if(gameState=="stage3"){
  push();
  fill("white");
  rect(200, 100, 185, 20);
  fill("#f50057");
  rect(200, 100,stage3PlaneLife, 20);
  noStroke();
  pop();
}
}

function keyPressed(){
  if(keyCode == 32 && gameState=="stage3"){

      shootBullet();
  }
}

function drawObstacles(){
  if (frameCount % 60 ===0){
    obstacle = createSprite(500,random(20,600),10,40);
    obstacle.addImage(obstacleIMG);
    obstacle.scale = 0.5;
    obstacle.velocityX= -3;
    obstacle.lifetime = 300;
    obstacleGroup.add(obstacle);}
  }

function drawFighterJets(){
  if (frameCount % 75 ===0){
    fighterJet = createSprite(500,random(20,600),10,40);
    fighterJet.addImage(fighterJetIMG);
    fighterJet.scale = 0.2;
    fighterJet.velocityX= -3;
    fighterJet.lifetime = 300;
    fighterJetGroup.add(fighterJet);}
  }

  function shootBullet(){
   bullet = createSprite(150, width/4, 50,20)
   bullet.y = plane.y-20;
   bullet.addImage(bulletIMG);
   bullet.scale = 0.08;
   bullet.velocityX = 6;
   bullet.lifetime = 100
   bulletGroup.add(bullet)

  }

  function shootSpaceshipBullet(){
    if(frameCount % 75 === 0){
    spaceshipBullet = createSprite(spaceship.x,spaceship.y,50,20)
    spaceshipBullet.addImage(spaceshipBulletIMG);
    spaceshipBullet.scale = 0.03;
    spaceshipBullet.velocityX = -6;
    spaceshipBullet.lifetime = 100
    spaceshipBulletGroup.add(spaceshipBullet);
  }
    
  }

  function reset(){
    gameState = "stage1";
    gameOver.visible = false;
    restart.visible = false;
  }

  function stage3(){
    swal( 
      {
      title: `Welcome to Stage 3!`,
      text: "Use the Up and Down Arrow keys to dodge bullets and use the space key to shoot the spaceship and destory it! Good luck!",
      confirmButtonText: "Continue Playing"
    },
    function(isConfirm) {
      if (isConfirm){
      gameState = "stage3"
      mountain.changeAnimation('stage3');
       }
      } 
    );
  }

  

