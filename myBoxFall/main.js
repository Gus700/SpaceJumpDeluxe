title = "Box Fall";

description = `
Avoid the boxes
`;

characters = [
`
 l l l 
lllllll
ll l ll
ll l ll
lllllll
ll   ll
ll   ll
`,`
lllll
lllll
lllll
`
];

const G = {
	WIDTH: 100,
	HEIGHT: 150,

    PLATFORM_X: 0,
    PLATFORM_Y: 140,
    PLATFORM_SIZE_X: 100,
    PLATFORM_SIZE_Y: 10,

	BOX_SPEED: 1.0,
    MAX_BOXES: 12,

    PLAYER_SPEED: 1
}

const COLORS = ["red", "blue", "yellow", "purple"];

// JSDocs
/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * clr: string
 * }} Box
 */

/**
 * @type { Box [] }
 */
let boxes;

/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * direction: number
 * }} Player
 */

/**
 * @type { Player }
 */
let player;


options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
    isCapturing: true,
    isCapturingGameCanvasOnly: true,
    captureCanvasScale: 2,
    seed: 1,
    isPlayingBgm: true,
    isReplayEnabled: true,
    theme: "dark"
};

function update() {
	if (!ticks) {
        player = {
            pos: vec(G.WIDTH/2, G.PLATFORM_Y - 2),
            speed: G.PLAYER_SPEED,
            direction: 1
        }

        boxes = [];
	}

    // Create Platform
    color("cyan");
    rect(G.PLATFORM_X, G.PLATFORM_Y, G.PLATFORM_SIZE_X, G.PLATFORM_SIZE_Y);

    // Draw Player
    color("red");
    char("a", player.pos);

    // Spawn Boxes
    if (boxes.length < G.MAX_BOXES) {
        // const posX1 = rnd(5, G.WIDTH/2)
        // const posX2 = rnd(G.WIDTH/2, G.WIDTH - 5);
        // const posY = rnd(75, 100);

        // boxes.push({pos: vec(posX1, posY) , speed: G.BOX_SPEED});
        // boxes.push({pos: vec(posX2, posY) , speed: G.BOX_SPEED});   

        for (let i=0; i < G.MAX_BOXES - boxes.length; i++) {
            const posX = rnd(0, G.WIDTH);
            const posY = rnd(0, -150);
            boxes.push({
                pos: vec(posX, posY),
                speed: G.BOX_SPEED,
                clr: COLORS[Math.floor(Math.random()*COLORS.length)]
            });
        }
    }

    if (input.isJustPressed || (player.pos.x < 0 && player.direction < 0) || (player.pos.x > G.WIDTH && player.direction > 0) ) {
        player.direction *= -1;
    }
    player.pos.x += player.direction * sqrt(difficulty);


    // Remove Boxes
    remove(boxes, (b) => {
        b.pos.y += G.BOX_SPEED;
        // color("yellow");
        // let rnd_color = COLORS[Math.floor(Math.random()*COLORS.length)];
        // color(rnd_color);
        // char("b", b.pos);
        // box(b.pos, 2);

        color(b.clr);
        const isCollidingWithPlatform = char("b", b.pos).isColliding.rect.cyan;
        if (isCollidingWithPlatform) {
            // let rnd_color = COLORS[Math.floor(Math.random()*COLORS.length)];
            // color(rnd_color);
            // color("red");
            play("explosion");
            particle(b.pos);
            addScore(1);
        }

        const isCollidingWithPlayer = char("b", b.pos).isColliding.char.a;

        if (isCollidingWithPlayer) {
            end();
            play("powerUp");
        }

        return (b.pos.y > G.PLATFORM_Y);
    });

}
