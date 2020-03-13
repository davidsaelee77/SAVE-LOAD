class Circle extends Entity {

    constructor(game, x, y, radius, maxSpeed, friction) {
        super(game, x, y, radius);
        this.game = game;
        this.visualRadius = 50;
        this.colors = ["Red", "Green", "Blue", "White"];
        this.friction = friction;
        this.velocity = {x: Math.random() * 1000, y: Math.random() * 1000};
        this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (this.speed > maxSpeed) {
            let ratio = maxSpeed / this.speed;
            this.velocity.x *= ratio;
            this.velocity.y *= ratio;
        }
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.shot = new Projectile(game, x, y, 50, this.direction, this.colors);
        this.count = 0;
        this.alive = true;
        this.it = false;
        this.color = 3;
    }

    update() {

        this.count += this.game.clockTick;
        if (this.it) {
            if (this.count > 2.0) {
                this.Shot();
                this.count = 0;
            }
        } else {
            this.dodge();
        }
    }

    draw() {

        if (this.alive) {
            this.game.ctx.beginPath();
            this.game.ctx.fillStyle = this.colors[this.color];
            this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.game.ctx.fill();
            this.game.ctx.closePath();
        }

    };


    movement() {

        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;

        if (this.collideLeft() || this.collideRight()) {
            this.velocity.x = -this.velocity.x * this.friction;
            if (this.collideLeft()) this.x = this.radius;
            if (this.collideRight()) this.x = 800 - this.radius;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
        }

        if (this.collideTop() || this.collideBottom()) {
            this.velocity.y = -this.velocity.y * this.friction;
            if (this.collideTop()) this.y = this.radius;
            if (this.collideBottom()) this.y = 800 - this.radius;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
        }

        for (let i = 0; i < this.game.entities.length; i++) {
            let ent = this.game.entities[i];

            if (ent !== this && this.collide(ent)) {
                let temp = {x: this.velocity.x, y: this.velocity.y};

                let dist = this.distance(this, ent);
                let delta = this.radius + ent.radius - dist;
                let difX = (this.x - ent.x) / dist;
                let difY = (this.y - ent.y) / dist;

                this.x += difX * delta / 2;
                this.y += difY * delta / 2;
                ent.x -= difX * delta / 2;
                ent.y -= difY * delta / 2;

                this.velocity.x = ent.velocity.x * this.friction;
                this.velocity.y = ent.velocity.y * this.friction;
                ent.velocity.x = temp.x * this.friction;
                ent.velocity.y = temp.y * this.friction;
                this.x += this.velocity.x * this.game.clockTick;
                this.y += this.velocity.y * this.game.clockTick;
                ent.x += ent.velocity.x * this.game.clockTick;
                ent.y += ent.velocity.y * this.game.clockTick;
            }

            if (ent !== this && this.collide({x: ent.x, y: ent.y, radius: this.visualRadius})) {
                let dist = this.distance(this, ent);
                if (this.it && dist > this.radius + ent.radius + 10) {
                    let difX = (ent.x - this.x) / dist;
                    let difY = (ent.y - this.y) / dist;
                    this.velocity.x += difX * acceleration / (dist * dist);
                    this.velocity.y += difY * acceleration / (dist * dist);
                    let speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                    if (speed > maxSpeed) {
                        var ratio = maxSpeed / speed;
                        this.velocity.x *= ratio;
                        this.velocity.y *= ratio;
                    }
                }
                if (ent.it && dist > this.radius + ent.radius) {
                    let difX = (ent.x - this.x) / dist;
                    let difY = (ent.y - this.y) / dist;
                    this.velocity.x -= difX * acceleration / (dist * dist);
                    this.velocity.y -= difY * acceleration / (dist * dist);
                    if (this.speed > maxSpeed) {
                        let ratio = maxSpeed / this.speed;
                        this.velocity.x *= ratio;
                        this.velocity.y *= ratio;
                    }
                }
            }
        }

        this.velocity.x -= (1 - this.friction) * this.game.clockTick * this.velocity.x;
        this.velocity.y -= (1 - this.friction) * this.game.clockTick * this.velocity.y;
    }

    distance(a, b) {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    //Sets IT circle red.
    setIt() {
        this.it = true;
        this.color = 0;
        this.visualRadius = 10;
    };

    Shot() {

        let direction = Math.floor(Math.random() * 4);
        this.shot = new Projectile(this.game, this.x, this.y, 50, direction, this.colors);
        this.game.shots.push(this.shot);

    }

    predictCollision(other) {
        return this.distance(this, other) < this.visualRadius + other.visualRadius;
    };

    collide(other) {
        return this.distance(this, other) < this.radius + other.radius;
    };

    collideLeft() {
        return (this.x - this.radius) < 0;
    };

    collideRight() {
        return (this.x + this.radius) > 800;
    };

    collideTop() {
        return (this.y - this.radius) < 0;
    };

    collideBottom() {
        return (this.y + this.radius) > 800;
    };

    dodge() {
        let move = false;

        for (let j = 0; j < this.game.shots.length; j++) {
            let shot = this.game.shots[j];

            if (this.predictCollision(shot)) {
                move = true;
                let xDistance = this.x - shot.x;
                let yDistance = this.y - shot.y;

                if (xDistance > 0) {
                    this.velocity.x = Math.abs(this.velocity.x);
                }
                if (xDistance < 0) {
                    this.velocity.x = -Math.abs(this.velocity.x);
                }
                if (yDistance > 0) {
                    this.velocity.y = Math.abs(this.velocity.y);
                }
                if (yDistance < 0) {
                    this.velocity.y = -Math.abs(this.velocity.y);

                }
                this.x += this.velocity.x * this.game.clockTick;
                this.y += this.velocity.y * this.game.clockTick;

                return true;

            }

        }

        if (move === false) {
            this.movement();
        }
        return false;
    }
}