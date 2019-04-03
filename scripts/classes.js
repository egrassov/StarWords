class Background {
  constructor(w, h, ctx) {
    this.ctx = ctx
    this.img = new Image();
    var fondo = Math.floor(Math.random() * (4) + 1);
    this.img.src = "../images/universe" + fondo + ".jpg";
    this.h = h
    this.w = w
  
    this.x = 0;
    this.y = 0;
  
    this.dx = 2;
  }
  
  draw() {
    //this.ctx.drawImage(this.img, 0, 0, this.w, this.h)
    this.ctx.save();
    //this.ctx.moveTo(this.x/2,this.y/2);
    //this.ctx.rotate(-15 * Math.PI/180);

    this.ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.w,
      this.h
    );
    this.ctx.drawImage(
      this.img,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );  
    this.ctx.restore();
  }

  move() {
    this.x -= this.dx;
  
    if (this.x < -this.w) this.x = 0;
  }
}  
  
class StarShip {
  constructor(w, h, x, y, ctx, keys) {
    this.ctx = ctx;
    this.img=new Image();
    this.img.src = "../images/starship.png";
    this.audiorayo = new Audio('../audios/rayo.wav');
    

    this.w=130;
    this.h=60;
    this.canvasW = w;
    this.canvasH = h;
    this.x=x-this.w/2;
    this.y=y-this.h/2;

    this.angle=0;  
    this.lasers = []; 
    this.letra="a";
    this.color='#FF0000';
    this.setListeners();
  }  

  draw() {
    this.ctx.save();
    //this.ctx.translate(this.canvas.width/2,this.canvas.height/2);
    //this.ctx.rotate(this.angle*Math.PI/180);
       
    this.ctx.translate(this.x+this.w/2,this.y+this.h/2);
    this.ctx.rotate(-this.angle * Math.PI/180);
    this.ctx.translate(-this.w/2,-this.h/2);
    this.ctx.drawImage(this.img, 0, 0, this.w, this.h)
    
    this.ctx.restore();
    this.lasers = this.lasers.filter(laser => {
      return (laser.x < this.canvasW) && (laser.x > 0) && (laser.y < this.canvasH) && (laser.y > 0) && (laser.active === true);     
    });
          
    this.lasers.forEach(function(laser) {
      laser.draw();
      laser.move();
    });
  }
 
  rotateShip(angle){
    this.angle+=angle;
  }

  setListeners() {
    document.onkeydown = function(e) {

      if (e.keyCode === 37) this.angle+=2 //left
      else if (e.keyCode === 39) this.angle-=2 //right
      else if (e.keyCode ===  40) this.angle=-180 //down
      else if (e.keyCode === 38) this.angle=0 //down
      else if (e.keyCode >=65 && e.keyCode<=90) this.shoot();     
      /*switch (e.keyCode) {
        case 37: //left
          this.angle+=2;
          break;
        case 39: //right
          this.angle-=2;
          break;          
        case 40: //down
          this.angle=-180;
          break;
        case 38: //down
          this.angle=0;
          break; 
        case e.keyCode>= 65 && e.keyCode<=90
          this.shoot();
          break;    
      }*/
      if (this.angle<0) this.angle=360+this.angle;
      if (this.angle>360) this.angle=this.angle-360;
    }.bind(this);
  }

  shoot() {
    var posX=this.canvasW/2, posY=this.canvasH/2;
    this.audiorayo.play();
    if (this.angle===0) {
      posX=posX + this.w / 2;
      posY=this.y + this.h / 2;
    }        
    else if (this.angle===90){
      posX=this.x + this.w / 2;
      posY=this.y - this.h / 2;
    }
    else if (this.angle===180){
      posX=posX - this.w / 2;
      posY=this.y + this.h / 2;
    }
    else if (this.angle===270){
      posX=this.x + this.w / 2;
      posY=posY + this.h;
    }        
    else {
      posY = posY - Math.sin(this.angle* Math.PI/180)*(this.w / 2);
      posX = posX + Math.cos(this.angle* Math.PI/180)*(this.w / 2);
    } 

    /*if (this.angle===0) {
      posX=this.x + this.w / 2;
      posY=this.y + this.h / 2;
    }        
    else if (this.angle===90){
      posX=this.x + this.w / 2;
      posY=this.y + this.h / 2;
    }
    else if (this.angle===180){
      posX=this.x + this.w / 2;
      posY=this.y + this.h / 2;
    }
    else if (this.angle===270){
      posX=this.x + this.w / 2;
      posY=this.y + this.h / 2;
    }
    if ((this.angle > 0 && this.angle < 90) || this.angle > 270){
      posY = posY - Math.sin(this.angle* Math.PI/180)*(this.w / 2);
      posX = posX + Math.cos(this.angle* Math.PI/180)*(this.w / 2);
    } 
    else{
      posY = posY - Math.sin(this.angle* Math.PI/180)*(this.w / 2);
      posX = posX + Math.cos(this.angle* Math.PI/180)*(this.w / 2);          
    }*/
    var laser = new Laser(
      posX,
      posY,
      this.letra,
      this.color,
      this.angle,
      this.ctx
    );
    this.lasers.push(laser);
  }      
}

class Laser {
  constructor(x, y, letra, color, angle, ctx) {
    this.x = x;
    this.xBase= x;
    this.y = y;
    this.yBase = y;
    this.letra = letra;
    this.color = color;
    this.angle = angle;
    this.ctx = ctx;
    this.r = 4;
    this.vx = 10;
    this.active=true;
  }
    
  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }
    
  move() {
    //this.y += this.x/Math.tan(360-this.angle);
    if (this.angle===0)
      this.x += this.vx;
    else if (this.angle===90)
      this.y -= this.vx*0.8;
    else if (this.angle===180)
      this.x -= this.vx; 
    else if (this.angle===270)
      this.y += this.vx*0.8;
    else {
      if ((this.angle > 0 && this.angle < 90) || this.angle > 270){
        if (this.angle > 0 && this.angle < 90) 
          //this.x = this.x + 0.1 + (this.vx-0.1)/-90 * (this.angle-90);
          this.x = this.x + this.vx - ((this.angle)/90)*(this.vx-0.1);    
        else
          this.x = this.x + this.vx - ((360-this.angle)/90)*(this.vx-0.1);
        //this.x += this.vx;
        this.y = this.yBase-(this.x-this.xBase)*Math.tan(this.angle* Math.PI/180);
      } 
      else{
        if (this.angle > 90 && this.angle < 180){
          this.x = this.x - this.vx + ((180-this.angle)/90)*(this.vx-0.1);
          this.y = this.yBase-(this.x-this.xBase)*Math.tan(this.angle* Math.PI/180);
        }
        else{
          this.x = this.x + this.vx - ((360-this.angle)/90)*(this.vx-0.1);
          this.y = this.yBase-(this.x-this.xBase)*Math.tan(this.angle* Math.PI/180);
        }
        //this.x -= this.vx;
        //this.y = this.yBase-(this.x-this.xBase)*Math.tan(this.angle* Math.PI/180); 
      }
    } 
  }  
}             

class Enemie {
  constructor(ctx, w, h) {
    this.img = new Image();
    this.img.src = "../images/borg.png";
    this.audioenemie = new Audio('../audios/borg.wav');
    this.w = 60;
    this.h = 60;
    this.letra = String.fromCharCode(this.getRndInteger(65, 90));
    this.arrColor = ["#00FF1C", "#E8FF29", "#FF960F", "#FF00CC", "#FF00CC", "#FF000D"];
    this.color = this.arrColor[this.getRndInteger(0, 5)];
    this.velocidad = this.getRndInteger(0, 4);
    this.eje = this.getRndInteger(0, 3);
    this.canvasW = w;
    this.canvasH = h;
    this.vx = 1;
    this.audioenemie.play();

    //this.eje=0;
    //this.x = this.canvasW/2+300;
    //this.y = -this.h;
    //this.relacion=(this.canvasH/2-this.y) / (this.x-this.canvasW/2);

    /*switch (this.eje) {
      case 0:
        this.vieneX=true;
        this.x = this.getRndInteger(0, this.canvasW);
        //this.y = 0;
        this.y = -this.h;
        if (this.x>this.canvasW/2){
          this.relacion=(this.canvasH/2-this.y) / (this.x-this.canvasW/2);
        }
        else {          
          this.relacion=(this.canvasH/2-this.y) / (this.canvasW/2-this.x);
        }
        break;
      case 1:
        this.vieneX=false;
        this.x = this.canvasW;;
        this.y = this.getRndInteger(0, this.canvasH)
        break;
      case 2:
        this.vieneX=true;
        this.x = this.getRndInteger(0, this.canvasW);
        this.y = this.canvasH;
        this.relacion=(this.canvasH/2-this.y) / (this.canvasH/2-this.x);
        break;
      case 3:
        this.vieneX=false;
        this.x = 0;
        this.y = this.getRndInteger(0, this.canvasH);
    }*/    

    switch (this.eje) {
      case 0:
        this.x = this.getRndInteger(0, this.canvasW);
        this.y = -this.h;
        break;
      case 1:
        this.x = this.canvasW+this.w;
        this.y = this.getRndInteger(0, this.canvasH)
        break;
      case 2:
        this.x = this.getRndInteger(0, this.canvasW);
        this.y = this.canvasH+this.h;
        break;
      case 3:
        this.x = -this.h;
        this.y = this.getRndInteger(0, this.canvasH);
    }

    //this.origin = new Victor(this.canvasW / 2, this.canvasH / 2);
    //this.destination = this.origin.subtract(new Victor(this.x, this.y));
    this.origin = new Victor(this.x, this.y)
    this.destination = this.origin.subtract(new Victor((this.canvasW-this.w)/2, (this.canvasH-this.h)/2));
    
    this.ctx = ctx;
    this.active = true;
  }

  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  draw() {
    /*this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();*/
    this.ctx.save();
    //this.ctx.translate(this.canvas.width/2,this.canvas.height/2);
    //this.ctx.rotate(this.angle*Math.PI/180);
    //this.ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
    //this.ctx.rotate(-this.angle * Math.PI / 180);
    //this.ctx.translate(-this.w / 2, -this.h / 2);
    //this.ctx.drawImage(this.img, 0, 0, this.w, this.h)
    this.ctx.translate((this.canvasW-this.w)/2, (this.canvasH-this.h)/2);
    this.ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    this.ctx.font = 'bold 25px sans-serif';
    this.ctx.fillStyle = this.color;
    this.ctx.textAlign = "center";
    this.ctx.fillText(this.letra, this.x+this.w/2+17, this.y+this.h/2+12);
    this.ctx.restore();
  }

  move() {
    this.vx -= 0.00001;
    this.destination = this.destination.multiply(new Victor(this.vx, this.vx))
    this.x=this.destination.x;
    this.y=this.destination.y;

 /*   if (this.vieneX){
      if (this.posY<this.canvasH/2){
        if (this.posX === this.canvasH/2){
          this.y += this.vx * 0.8;
        }else if (this.posX < this.canvasH/2){
          this.x += this.vx 
          this.y = this.y+this.vx*(this.canvasH/2 - this.posX)/ (this.canvasW/2-0)
        }else{
          this.x -= this.vx
          this.y = this.y+this.vx*this.relacion
        }
      } else{
        if (this.posX === this.canvasH/2){
          this.y -= this.vx * 0.8;
        }else if (this.posX < this.canvasH/2){
          this.x += this.vx 
          this.y = this.y-this.vx*(this.canvasH/2 - this.posX)/ (this.canvasW/2-0)
        }else{
          this.x -= this.vx
          this.y = this.y-this.vx*(this.posXthis.canvasH/2)/ (this.canvasW/2-0)
        }        
      }
    }  */


    /*
    //this.y += this.x/Math.tan(360-this.angle);
    if (this.angle === 0)
      this.x += this.vx;
    else if (this.angle === 90)
      this.y -= this.vx * 0.8;
    else if (this.angle === 180)
      this.x -= this.vx;
    else if (this.angle === 270)
      this.y += this.vx * 0.8;
    else {
      if ((this.angle > 0 && this.angle < 90) || this.angle > 270) {
        if (this.angle > 0 && this.angle < 90)
          //this.x = this.x + 0.1 + (this.vx-0.1)/-90 * (this.angle-90);
          this.x = this.x + this.vx - ((this.angle) / 90) * (this.vx - 0.1);
        else
          this.x = this.x + this.vx - ((360 - this.angle) / 90) * (this.vx - 0.1);
        //this.x += this.vx;
        this.y = this.yBase - (this.x - this.xBase) * Math.tan(this.angle * Math.PI / 180);
      }
      else {
        if (this.angle > 90 && this.angle < 180) {
          this.x = this.x - this.vx + ((180 - this.angle) / 90) * (this.vx - 0.1);
          this.y = this.yBase - c(this.x - this.xBase) * Math.tan(this.angle * Math.PI / 180);
        }
        else {
          this.x = this.x + this.vx - ((360 - this.angle) / 90) * (this.vx - 0.1);
          this.y = this.yBase - (this.x - this.xBase) * Math.tan(this.angle * Math.PI / 180);
        }
        //this.x -= this.vx;
        //this.y = this.yBase-(this.x-this.xBase)*Math.tan(this.angle* Math.PI/180); 
      }
    }  */      
  }
}
