class Projectile extends Entity {

    constructor(game, x, y, radius, direction, color) {
        super(game, x, y, radius);
        this.game = game;
        this.direction = direction;
        this.colors = color;
        this.speed = 700;
        this.colors = ["Red", "Green", "Blue", "White"];
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.alive = true;
        this.visualRadius = 50;
        this.color = 0;

    }

    checkCollisions() {

        for (let i = 0; i < this.game.entities.length; i++) {
            let ent = this.game.entities[i];
            for (let j = 0; j < this.game.shots.length; j++) {
                let shot = this.game.shots[j];
                if (ent.collide(shot)) {

                    ent.alive = false;
                    return true;
                }
            }
        }
        return false;
    }

    update() {

        this.selectPosition(this.direction);
        this.checkCollisions();

    };

    //Draws the projectile
    draw() {
        this.game.ctx.beginPath();
        this.game.ctx.fillStyle = this.colors[this.color];
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.fill();
        this.game.ctx.closePath();
    }

    south() {
        this.y += this.game.clockTick * this.speed;
    }

    north() {
        this.y -= this.game.clockTick * this.speed;
    }

    east() {
        this.x += this.game.clockTick * this.speed;
    }

    west() {
        this.x -= this.game.clockTick * this.speed;
    }


    selectPosition(direction) {

        switch (direction) {
            case 0:
                this.south();
                break;
            case 1:
                this.north();
                break;
            case 2:
                this.east();
                break;
            case 3:
                this.west();
                break;

        }
    }

}
