var nave;
var fondoJuego;
var fondoJuego2;
var fondovelocidad=4;
//cursores
var cursores;
//laser
var balas;
var tiempoEntreBalas=400;
var tiempo =0;
//enemigos
var malos;
var timer;
var loop=2000;
var veloz=100;
//puntaje
var puntos;
var txtPuntos;
var punto;
var nivel2 = true;
var dispa;
//vidas
var vidas;
var txtVidas;
var dead = false;
//GANASTES
var ganastes = false;

var Juego={
	preload: function () {
		juego.load.spritesheet('nave','img/nave.png',58,66);
		juego.load.image('laser','img/laser.png');
		juego.load.image('malo','img/rosa.png');
		juego.load.image('malo2','img/azul.png');
		juego.load.image('malo3','img/green.png');
		juego.load.image('bg','img/bg.png');
		juego.load.image('bg2','img/bg2.png');
		//sonidos
		juego.load.audio('moneda','sound/explosion.wav');
		juego.load.audio('disparo','sound/disparo.wav');
	},

	create: function(){
		//fondo juego
		fondoJuego=juego.add.tileSprite(0,0,400,540,'bg');
		//animacion sprite
		
		juego.physics.startSystem(Phaser.Physics.ARCADE);

		nave = juego.add.sprite(juego.width/2, 485, 'nave'); //habilitamos arcade
		nave.anchor.setTo(0.5); //punto de apollo
		
		juego.physics.arcade.enable(nave, true); //habilitamos arcade
		
		////balas
		balas = juego.add.group();
		balas.enableBody = true; //cuerpo
		balas.setBodyType = Phaser.Physics.ARCADE; //arcade
		balas.createMultiple(50, 'laser') //muchas balas, 50
		balas.setAll ('anchor.x',0.5);
		balas.setAll ('anchor.y',0.5); //punto de apoyo
		balas.setAll ('checkWorldBounds', true); 
		balas.setAll ('outOfBoundsKill',true); //se eliminan al sarlir del escenario

		////Enemigos
		malos = juego.add.group();
		malos.enableBody = true;
		malos.setBodyType = Phaser.Physics.ARCADE; 
		
		malos.createMultiple(20, 'malo')
		malos.setAll ('anchor.x',0.5);
		malos.setAll ('anchor.y',0.5); 
		malos.setAll ('checkWorldBounds', true); 
		malos.setAll ('outOfBoundsKill',true);

		timer=juego.time.events.loop(loop,this.crearEnemigo,this);
		//cada 2000 milisegundos crear enemigo

		//CURSORES
		cursores=juego.input.keyboard.createCursorKeys();

		//DEFINIENDO ELPUNTAJE
		puntos =0;
		juego.add.text(20,20, "Puntos: ",{font:"14px Arial", fill:"#FFF"});
		txtPuntos=juego.add.text(80,20, "0",{font:"14px Arial",fill:"#FFF"});

		//definiendo vidas
		vidas = 3;
		juego.add.text(310, 20, "Vidas: ", {font:"14px Arial", fill:"#FFF"});
		txtVidas=juego.add.text(360,20, "3",{font: "14px Arial", fill: "#FFF"});

		//MUSIC
		punto = juego.add.audio('moneda');
		dispa = juego.add.audio('disparo');


		

	},
	update: function(){
		//funcion
		

		fondoJuego.tilePosition.y-=fondovelocidad;
		if (puntos > 3){
		fondoJuego2.tilePosition.y-=fondovelocidad; }
		nave.rotation = juego.physics.arcade.angleToPointer(nave) + Math.PI/2;

		if (juego.input.activePointer.isDown){
			this.disparar();
		}

		//MOVIMIENTO
		if (cursores.right.isDown) {
			nave.x+=2; 
		}   else if (cursores.left.isDown){
            nave.x-=2;
        }

		//COLISION bala
		juego.physics.arcade.overlap(balas,malos,this.colision,null,this);
		//COLISION bala
		juego.physics.arcade.overlap(nave,malos,this.colision2,null,this);


	},

	disparar:function(){
		if (dead) {

		}else if(juego.time.now > tiempo && balas.countDead() > 0) {
			dispa.play();
			tiempo = juego.time.now + tiempoEntreBalas;
			var bala = balas.getFirstDead(); //usar bala en cola
			bala.anchor.setTo(0.5);
			bala.reset(nave.x, nave.y); //el punto de apoyo es posicion de la nave
			bala.rotation = juego.physics.arcade.angleToPointer(bala)+ Math.PI/2;
			//rotaran segun el angulo de inclinacion de la bala
			juego.physics.arcade.moveToPointer(bala,200);
			//bala se mueve al cursos, a velocidad 200
		}
	},

	crearEnemigo: function(){
		var enem = malos.getFirstDead();
		var num = Math.floor(Math.random()*10+1) //posicion aleatoria, donde apareceran
		enem.reset(num*38,0); //posicion enemigos
		enem.anchor.setTo(0.5);
		enem.body.velocity.y=veloz; //velocidad aparicion
		enem.checkWorldBounds = true;
		enem.outOfBoundsKill = true; //se eliminan al salir del limite del juego

		
	},

	colision: function(b,m){
		b.kill();
		m.kill();
		puntos++;
		//sonido
		punto.play();
		txtPuntos.text = puntos;
		if (puntos > 3 && nivel2) {
			nivel2=false;
			this.nivel2();
		}

		if (puntos == 10) {
			ganastes=true;
			malos.createMultiple(0, 'malo')
			juego.add.text(50, 100, "GANASTES", {font:"50px Arial", fill:"#FFF"});
			veloz=-100;
		}

	},

	colision2: function(b,NA){
		NA.kill();
		vidas--;
		if (vidas == 0){b.kill();
		dead = true;
		//texto muerte
		juego.add.text(50, 100, "GAME OVER", {font:"50px Arial", fill:"#FFF"});
		}
		puntos++;
		txtVidas.text = vidas;

	},

	nivel2: function(){
		juego.add.text(130, 20, "NIVEL 2", {font:"14px Arial", fill:"#FFF"});
		fondoJuego2=juego.add.tileSprite(0,0,400,540,'bg2');
		loop=800;
		veloz=180;
		fondovelocidad=10;
	}


};