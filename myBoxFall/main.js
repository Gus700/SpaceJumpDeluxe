title = "SpaceJumpDeluxe";

description = `
`;

characters = [
`
 cccc 
cccccc
 cccc
cccccc
  cc
cc  cc
`
];
const G = {
	WIDTH: 150,
	HEIGHT: 100,
	STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.0,
	MAX_JUMP_HEIGHT: 35
};

options = { 
	viewSize: {x:G.WIDTH, y:G.HEIGHT},
	theme: "dark",
	isReplayEnabled: true,
	seed: 30,
	isPlayingBgm: true
};

/**
* @typedef {{
* pos: Vector,
* speed: number
* }} Star
*/

/**
* @type { Star [] }
*/
let stars;

/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * sizeX: number,
 * sizeY: number
 * }} Obst
 */

/**
 * @type { Obst [] }
 */
let obst = [];

/**
 * @type { Obst [] }
 */
 let topObst = [];

/**
 * @typedef {{
 * pos: Vector,
 * }} Player
 */

/** 
 * @type { Player }
*/
let player;

let jumping = false;
let falling = false;
let ObstSpawnX = G.WIDTH;
let ObstSpawnY = G.HEIGHT * 0.9;
let ObstSpeed = 1;
function update() {
	// The init function running at startup
	if (!ticks) {
		//initialize the stars
		stars = times(20, () => {
			const posX = rnd(0, G.WIDTH);
			const posY = rnd(0, G.HEIGHT * 0.7);
			return {
				pos: vec(posX, posY),
				speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
			};
		});
		// initialize the obstacles
		topObst = [];
		obst = times(3 , () => {
			const posX = ObstSpawnX += 100;
			const posY = rnd(ObstSpawnY, ObstSpawnY - 15)
			// initialize the complimentary top Obstacles
			topObst.push({
				pos: vec(posX, posY - 60),
				speed: ObstSpeed,
				sizeX: 5, 
				sizeY: 60
			});
			return {
				pos: vec(posX, posY),
				speed: ObstSpeed,
				sizeX: 5, 
				sizeY: 20
			};

		});
		//initialize the player
		player = {
			pos: vec(G.WIDTH * 0.4, G.HEIGHT * 0.7)
		};
	}
	// update for the stars that were created above
	stars.forEach((s) => {
		s.pos.x -= s.speed;
		s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
		color("yellow");
		box(s.pos, 1);
	});
	// draw obstacles
	obst.forEach((o) => {
		o.pos.x -= o.speed;
		o.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
		color("blue");
		box(o.pos, o.sizeX, o.sizeY);
	});
	//draw top Obstacles
	topObst.forEach((o) => {
		o.pos.x -= o.speed;
		o.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
		color("blue");
		box(o.pos, o.sizeX, o.sizeY);
	});
	// draw floor
	color("blue");
	box (G.WIDTH * 0.5, G.HEIGHT * 0.9, G.WIDTH, 20);
	// draw the player
	color("cyan");
    char("a", player.pos);
	// jump when pressing the button
	if (input.isJustPressed) {
		jumping = true;
	}
	// hold to jump higher
	if (input.isPressed) {
		if (player.pos.y > (G.HEIGHT * 0.7 - G.MAX_JUMP_HEIGHT) && jumping == true && falling != true) {
			player.pos.y -= 3;
		} else { // if reached max jumping height then signal jump is over
		jumping = false;
		}
	}
	// if button is release early, signal jump over
	if (input.isJustReleased){
		jumping = false;
	}
	// makes sure the player is brought down
	if (!(char("a", player.pos).isColliding.rect.blue) && jumping == false ||
	((char("a", player.pos).isColliding.rect.blue) && player.pos.y < G.HEIGHT * 0.6)) {
		falling = true;
		player.pos.y += 2;
	} else {
		falling = false;
	}
	// collisions with obstacle or floor will move the character back
	if (char("a", player.pos).isColliding.rect.blue) {
		//console.log("Collided with an obstacle")
		player.pos.x -= ObstSpeed;

	// keep the character moving foward if they are not on the ground or touching an obstacle
	} else if (!(char("a", player.pos).isColliding.rect.blue) && player.pos.x < G.WIDTH * 0.6) {
		player.pos.x += ObstSpeed / 4;
		particle(
            player.pos.x, // x coordinate
            player.pos.y, // y coordinate
            4, // The number of particles
            1, // The speed of the particles
            -PI/1, // The emitting angle
            PI/4  // The emitting width
        );
	}
	// if the player has reached the end of the screen then make it end
	if( player.pos.x <= 0) {
		topObst = [];
		end();
	}
	addScore(1);

	player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
}
