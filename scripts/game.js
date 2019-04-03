var Game = {
  canvas: undefined,
  ctx: undefined,
  //scoreBoard: undefined,
  keys: {
    TOP_KEY: 38,
    SPACE: 32
  },
  init: function(canvasId) {
    this.canvas = document.querySelector(`#${canvasId}`);
    /** @type {CanvasRenderingContext2D} */
    this.ctx = this.canvas.getContext("2d");
    this.w = window.innerWidth-150
    this.h = window.innerHeight
    this.h2 = this.h / 2
    this.w2 = (this.w) / 2
    this.PI2 = 2 * Math.PI   
    this.canvas.width = this.w;
    this.canvas.height = this.h;

    //ScoreBoard.init(this.ctx);

    this.start();
  },
  start: function() {
    this.fps = 60;

    this.reset();

    this.interval = setInterval(() => {
      this.background.move();
      this.clear();
      this.drawAll();


      this.framesCounter++;

      // controlamos que frameCounter no sea superior a 1000
      //if (this.framesCounter > 1000) {
      //  this.framesCounter = 0;
      //}

      // controlamos la velocidad de generación de obstáculos
      if (this.framesCounter >= 300) {
        this.generateEnemies();
        this.framesCounter = 0;
      }

      this.clearEnemies();

     /* this.score += 0.01;

      this.moveAll();
      this.drawAll();

      // eliminamos obstáculos fuera del canvas
    */  

      if (this.isCollision()) {
        this.gameOver();
      }
    }, 1000 / this.fps);
  },
  stop: function() {
    clearInterval(this.interval);
  },
  //fin del juego
  gameOver: function() {
    this.stop();

    if (confirm("GAME OVER. Play again?")) {
      this.reset();
      this.start();
    }
  },
  //reseteamos todos los elementos del juego para empezar en un estado limpio
  reset: function() {
    this.background = new Background(this.w, this.h, this.ctx);
    this.starShip = new StarShip(this.w, this.h, this.w2, this.h2, this.ctx, this.keys);
    //this.scoreBoard = ScoreBoard;
    this.framesCounter = 0;
    this.enemies = [];
    this.score = 0;
  },
  //chequea si ha sucedido una colisión
  isCollision: function() {
    // colisiones genéricas
    // (p.x + p.w > o.x && o.x + o.w > p.x && p.y + p.h > o.y && o.y + o.h > p.y )
    // esto chequea que el personaje no estén en colisión con cualquier obstáculo
    return this.enemies.some(enemie => {
      var status = Math.abs(enemie.y)<30 && Math.abs(enemie.x)<30;
      //var status =this.starShip.x + this.starShip.w >= enemie.x &&
      //this.starShip.x < enemie.x + enemie.w &&
      //this.starShip.y + (this.starShip.h - 20) >= enemie.y;
      return (status)
    });
  },
  //esto elimina los obstáculos del array que estén fuera de la pantalla
  clearEnemies: function() {
    this.enemies = this.enemies.filter(function(enemie) {
      return enemie.active ===true;
    });
  },
  //generamos nuevos obstáculos
  generateEnemies: function() {
    this.enemies.push(
      new Enemie(this.ctx, this.canvas.width, this.canvas.height)
    );
  },
  //limpieza de la pantalla
  clear: function() {
    this.ctx.clearRect(0, 0, this.w, this.h);
  },
  //dibuja todos los assets del juego
  drawAll: function() {
    this.background.draw();
    this.starShip.draw();
    this.enemies.forEach(function(enemie) {
      enemie.draw();
      enemie.move();
    });
    //this.drawScore();
  },
  //mueve todos los objetos del escenario, el fondo, el jugador y los obstáculos
 /* moveAll: function() {
    this.background.move();
    this.player.move();
    this.obstacles.forEach(function(obstacle) {
      obstacle.move();
    });
  }*/
  //pinta el marcador
  //drawScore: function() {
  //  this.scoreBoard.update(this.score);
  //}
};











/*
window.onload = function() {
  startGame();
}

function drawImages(ctx, x, y){
  var bgImage = new Image();
  var starShip = new StarShip();
  bgImage.src = "../images/universe2.jpg";
  bgImage.onload = function(){
    ctx.drawImage(bgImage,0,0, window.innerWidth-150,  window.innerHeight);
    starShip.img.src = "../images/starship.png";
    starShip.img.onl ctx.drawImage(starShip.img,x-starShip.w/2,y-starShip.h/2,starShip.w,starShip.h);oad = function(){
    
    };
  };
};

function startGame() {
  var canvas = document.querySelector("#canvasGame");
  canvas.setAttribute("height", window.innerHeight)
  canvas.setAttribute("width", window.innerWidth-150)
  /** @type {CanvasRenderingContext2D} */
/*  var ctx = canvas.getContext("2d");
  var w = window.innerWidth
  var h = window.innerHeight
  var h2 = h / 2
  var w2 = (w-150) / 2
  var PI2 = 2 * Math.PI    
  drawImages(ctx, w2, h2);
}*/
