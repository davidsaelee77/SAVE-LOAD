// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

class GameEngine {

    constructor(ctx) {
        this.showOutlines = false;
        this.ctx = ctx;
        this.surfaceWidth = null;
        this.surfaceHeight = null;
        this.entities = [];
        this.shots = [];
        this.turrent = null;
        this.timer = new Timer();
    }


    init() {
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.startInput();
        console.log('game initialized');
    }

    start() {
        console.log("starting game");
        let that = this;
        (function gameLoop() {
            that.loop();
            requestAnimFrame(gameLoop, that.ctx.canvas);
        })();
    }

    startInput() {
        console.log('Starting input');
        let that = this;

        let getXandY = function (e) {
            let x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
            let y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

            return {x: x, y: y};
        };

        console.log('Input started');
    }

    addEntity(entity) {
        console.log('added entity');
        this.entities.push(entity);
    }

    addTurrent() {

        this.turrent = new Circle(this, 400, 400, radius * 3, maxSpeed, friction);
        this.turrent.setIt();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.save();

        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].draw();
        }
        for (let i = 0; i < this.shots.length; i++) {
            this.shots[i].draw();
        }
        this.turrent.draw();

        this.ctx.restore();
    }

    update() {

        let entitiesCount = this.entities.length;
        let shotsCount = this.shots.length;

        for (let i = 0; i < shotsCount; i++) {
            let shot = this.shots[i];
            shot.update();

        }
        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
        this.turrent.update();
    }

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    }

}


class Timer {

    constructor() {
        this.gameTime = 0;
        this.maxStep = 0.05;
        this.wallLastTimestamp = 0;
    }

    tick() {
        let wallCurrent = Date.now();
        let wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
        this.wallLastTimestamp = wallCurrent;

        let gameDelta = Math.min(wallDelta, this.maxStep);
        this.gameTime += gameDelta;
        return gameDelta;
    }
}

