class Entity {

    constructor(game, x, y, radius) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    update() {
    }

    draw() {
        if (this.game.showOutlines && this.radius) {
            this.game.ctx.beginPath();
            this.game.ctx.strokeStyle = "green";
            this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.game.ctx.stroke();
            this.game.ctx.closePath();
        }
    }
}