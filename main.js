let friction = 1;
let acceleration = 1000000;
let maxSpeed = 500;
let radius = 10;

let ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");


ASSET_MANAGER.downloadAll(function () {
    let canvas = document.getElementById('gameWorld');
    let ctx = canvas.getContext('2d');
    let gameEngine = new GameEngine(ctx);

    gameEngine.addTurrent();

    for (let i = 0; i < 20; i++) {
        let circle1 = new Circle(gameEngine, radius + Math.random() * (800 - radius * 2), radius + Math.random() * (800 - radius * 2), radius, maxSpeed, friction);

        gameEngine.addEntity(circle1);
    }
    gameEngine.init();
    gameEngine.start();

    let socket = io.connect("http://24.16.255.56:8888");

    socket.on("load", function (data) {
        console.log(data);
        gameEngine.entities = [];
        gameEngine.shots = [];
        for (let i = 0; i < data.ballData.length; i++) {
            let b = data.ballData[i];
            let circle = new Circle(gameEngine, b.X, b.Y, radius, maxSpeed, friction);
            circle.velocity = b.V;
            gameEngine.addEntity(circle);
        }
        for (let i = 0; i < data.projectileData.length; i++) {
            let s = data.projectileData[i];
            let shot = new Projectile(gameEngine, s.X, s.Y, 50, s.Direction, s.color);
            gameEngine.shots.push(shot);
        }
        gameEngine.addTurrent();

    });
    window.onload = () => {
        let label = document.getElementById("label");
        let saveButton = document.getElementById("save");
        let loadButton = document.getElementById("load");

        saveButton.onclick = () => {
            label.innerHTML = "Saved.";
            let ballStateArray = [];
            let projStateArray = [];
            for (let i = 0; i < gameEngine.entities.length; i++) {
                let b = gameEngine.entities[i];
                ballStateArray.push({X: b.x, Y: b.y, V: b.velocity, Alive: b.alive})
            }
            console.log(ballStateArray);
            for (let i = 0; i < gameEngine.shots.length; i++) {
                let s = gameEngine.shots[i];
                projStateArray.push({X: s.x, Y: s.y, Direction: s.direction, Speed: s.Speed, Color: s.color});
            }
            console.log(projStateArray);

            socket.emit("save", {
                studentname: "David Saelee",
                statename: "saveDataID",
                ballData: ballStateArray,
                projectileData: projStateArray
            });
        };

        loadButton.onclick = () => {
            label.innerHTML = "Loaded."
            socket.emit("load", {studentname: "David Saelee", statename: "saveDataID"});
        };
    };
});

