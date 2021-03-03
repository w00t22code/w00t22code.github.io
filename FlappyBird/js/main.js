window.addEventListener('DOMContentLoaded', function () {
   const canvas = document.getElementById('canvas');
   const ctx = canvas.getContext("2d");
   const buttonFly = document.querySelector('.button');
   const modal = document.querySelector('.modal');
   const modalResult = document.querySelector('.modal__main-text span');
   const modalClose = document.querySelector('.modal__header__exit');
   const modalNewGame = document.querySelector('.modal__buttons__agree');

   modalClose.addEventListener('click', function() {
      modal.classList.remove('open');
   })

   modalNewGame.addEventListener('click', function() {
      document.location.reload();
   })

   const bird = {
      width: 30,
      height: 30,
      x: 50,
      y: canvas.height/2,
      fly: 10,
      flyTime: 0,
      frame: [2, 30, 58]
   };

   // переменные перемещения
   let move = 0;
   let move1 = 0;
   
   // константы движения 5 4
   const g = 5;
   const speed = 4;

   // константа времени 5
   const flyTime = 5;

   // смена картинки птицы
   let frame = 0;

   class Tube {
      constructor(positionY) {
         this.width = 45;
         this.height = 180;
         this.positionY = positionY;
         this.move = 0;
      }
   }
   // ground
   class TubeG extends Tube {
      constructor(positionY) {
         super();
         this.positionY = positionY;
      }

      draw(x) {
         ctx.drawImage(image, 84, 323, 26, 160, x, this.positionY, this.width, this.height); 
      }
   }
   // heaven
   class TubeH extends Tube {
      constructor(positionY) {
         super();
         this.positionY = positionY;
      }

      draw(x) {
         ctx.drawImage(image, 56, 323, 26, 160, x, this.positionY, this.width, this.height); 
      }
   }

   // Создание трубок
   let tubesH = [];
   let tubesG = [];

   // Score
   let score = 0;

   var image = new Image();
   image.src = 'fp.png';

   document.addEventListener('keydown', function(event) {
      if (event.code == 'Space' && bird.y > bird.height/2) {
         bird.flyTime = flyTime;
         // bird.y = bird.y - bird.fly;
      }
   });

   buttonFly.addEventListener('click', function(event) {
      if (bird.y > bird.height/2) {
         bird.flyTime = flyTime;
         // bird.y = bird.y - bird.fly;
      }
   })

   function drawBg() {
      ctx.drawImage(image, 0, 0, 140, 200, move, 0, canvas.width, canvas.height);
   }

   function drawBg1() {
      ctx.drawImage(image, 0, 0, 140, 200, canvas.width + move, 0, canvas.width, canvas.height);
   }

   function drawBird(index) {
      ctx.drawImage(image, bird.frame[index], 490, 18, 18, bird.x, bird.y, bird.width, bird.height);
   }

   function drawScore() {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#000000";
      ctx.fillText("Score: " + score, 8, 20);
   }

   function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
   }

  

   function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if(bird.y + 20 > canvas.height) {
         modal.classList.add('open');
         modalResult.textContent = score;
         clearInterval(interval);
      } else if(bird.flyTime > 0) {
         bird.y = bird.y - bird.fly;
         bird.flyTime--;
      } else {
         bird.y = bird.y + g;
      }

      // для смены фона
      if(move - speed <= -canvas.width) {
         move = 0;
      } else {
         move = move - speed;
      }

      drawBg();
      drawBg1();

      // смена картинки
      if( move % 24 === 0) {
         frame = 0;
      } else if ( move % 40 === 0) {
         frame = 1;
      } else if ( move % 64 === 0) {
         frame = 2;
      }
      drawBird(frame);
      
      // появление новых столбов + score
      if(move1 - speed + 45 <= -canvas.width * 2) {
         move1 = 0;
      } else {
         move1 = move1 - speed;
         if(move1%140 === 0) {
            let index = -move1/140 - 1;
            score ++;
            let randNumber = getRandomInt(160);
            
            yH = -160 + randNumber;
            yG = 140 + randNumber;

            tubesH[index] = new TubeH(yH);
            tubesG[index] = new TubeG(yG);
         }
      }

      

      tubesH.forEach(function(el) {
         el.move = el.move - speed;
         el.draw(canvas.width + el.move)
         if(bird.x + bird.width > canvas.width + el.move && 
            bird.x < canvas.width + el.move + el.width && 
            bird.y > el.positionY && 
            bird.y < el.positionY + el.height) {
               modal.classList.add('open')
               modalResult.textContent = score;
               clearInterval(interval);
         }
      })


      tubesG.forEach(function(el) {
         el.move = el.move - speed;
         el.draw(canvas.width + el.move)

         if(bird.x + bird.width > canvas.width + el.move && 
            bird.x < canvas.width + el.move + el.width && 
            bird.y + bird.height - 5 > el.positionY &&                 // -5 изза прозрачного фона -> поменять картинку и убрать -5
            bird.y < el.positionY + el.height) {
               modal.classList.add('open')
               modalResult.textContent = score;
               clearInterval(interval);
         }
      })
      drawScore();
   }

   var interval = setInterval(draw, 40);
});


// info

// ctx.drawImage(image, x in img, y in img, width in img, height in img, x in canvas, y in canvas, width in canvas, height in canvas);
