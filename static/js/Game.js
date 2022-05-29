import { createElement as c } from "./amog.js";
export default class Game {

    constructor(ui) {
        this.ui = ui;
        this.board = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1]
        ];

        this.pawns = [
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1]
        ]

        this.gamers = []

        this.selected = [];

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x808080);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();

        this.camera.position.set(0, 1500, 1000)
        this.camera.lookAt(this.scene.position)

        this.axes = new THREE.AxesHelper(1000)
        this.scene.add(this.axes)

        document.getElementById("root").append(this.renderer.domElement);

        this.render()
        this.startGame()

    }

    startGame = () => {
        this.renderBoard()
        this.renderPawns()
    }

    setCameraPos = (x, y, z) => {
        this.camera.position.set(x, y, z)
        this.camera.lookAt(this.scene.position)
    }

    renderBoard = () => {
        let geometry = new THREE.BoxGeometry(100, 50, 100)
        for (let y in this.board) {
            for (let x in this.board) {
                let posx = -350 + y * 100;
                let posz = -350 + x * 100;
                let tile = new Tile(posz, 0, posx, geometry, (this.board[y][x] == 1) ? 1 : 0)
                this.scene.add(tile)
            }
        }
    }

    renderPawns = () => {
        let geometry = new THREE.CylinderGeometry(50, 50, 25, 16)
        //change pawn into an object you can edit
        for (let y in this.pawns) {
            for (let x in this.pawns) {
                if (this.pawns[y][x] != 0) {
                    let posx = -350 + y * 100;
                    let posz = -350 + x * 100;
                    let pawn = new Pawn(posz, 50, posx, geometry, (this.pawns[y][x] == 2) ? 2 : 1)
                    this.gamers.push(pawn)
                    this.scene.add(pawn)

                }

            }
        }
    }

    onWindowResize = () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    onMouseDown = (ev) => {
        if(this.ui.status == 4 || this.ui.status == 5) return
        this.mouseVector.x = (ev.clientX / window.innerWidth) * 2 - 1;
        this.mouseVector.y = -(ev.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouseVector, this.camera)

        const intersects = this.raycaster.intersectObjects(this.scene.children)
        if (intersects.length > 1) {
            //console.log(intersects[0].object)
            //console.log(this.pawns)
            if (intersects[0].object.geometry.type == "CylinderGeometry") {
                if (intersects[0].object.color == this.ui._playingAs) {
                    intersects[0].object.selected = true;
                    if (this.selected.length != 0) {
                        this.selected[0].selected = false;
                        this.selected = [];
                    }
                    this.selected[0] = intersects[0].object;

                }

            } else if (intersects[0].object.geometry.type == "BoxGeometry") {
                if (this.selected.length == 0) return
                if (intersects[0].object.color == 1) {
                    let oldy = (this.selected[0].pawnX + 350) / 100; //y
                    let oldx = (this.selected[0].pawnZ + 350) / 100;
                    this.pawns[oldx][oldy] = 0;
                
                   

                    let y = (intersects[0].object.tileX + 350) / 100; //y
                    let x = (intersects[0].object.tileZ + 350) / 100; //x

                    if(this.pawns[x][y] == 0) {
                        this.selected[0].movePawn(intersects[0].object.tileX, intersects[0].object.tileZ)
                        this.pawns[x][y] = this.selected[0].color
                        console.log(this.pawns)
                        this.selected = []
                        
                        if(oldy != y || oldx != x) {
                            this.handleMove(this.pawns)
                            this.startTimer();
    
                    }
                    }

                    

                }
            }
        }

    }


    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
        TWEEN.update();

    }

    loadFromServer = () => {
        let headers = { "Content-Type": "application/json" }
        let body = JSON.stringify({ "yep": "coq" })
        fetch("/getBoard", { method: "POST", body, headers })
            .then(response => response.json())
            .then(data => {
                this.pawns = data.pawns
                for (let x in this.gamers) {
                    this.scene.remove(this.gamers[x])
                }
                this.renderPawns()
            })
    }

    handleMove = () => {
        let headers = { "Content-Type": "application/json" }
        let body = JSON.stringify({ pawns: this.pawns, turn: this.ui._playingAs })
        fetch("/move", { method: "POST", body, headers })
            .then(response => response.json())
            .then(data => {
                this.loadFromServer();
            })
    }

    createBoard = () => {
        if(this.gamerBoard) document.body.removeChild(this.gamerBoard)

        this.gamerBoard = c("div", {className: "gamer-board"})
    }

    startTimer = () => {
        if(this.interval) clearInterval(this.interval)
        let time = 10;
        const body = JSON.stringify({nya: "arigatou"});
        const headers = { "Content-Type": "application/json" }
        this.interval = setInterval(() => {
            
            console.log(this.last)
            fetch("/checkTurn", { method: "POST", body, headers })
                .then(response => response.json())
                .then(data => {
                    if(data.turn == this.ui._playingAs) {
                        if(this.last=="not") time = 10
                        this.loadFromServer()
                        if(this.timerBar) document.body.removeChild(this.timerBar)
                        this.timerBar = undefined;
                        this.last = "player"
                    } else {
                        if(this.last=="player") time = 10
                        if(this.timerBar) document.body.removeChild(this.timerBar)
            
                        this.timerBar = c("div", {id: 'bruh-moment'}, 
                            c("h1", {id: "bruh-momento"}, `${time}`)
                        )
                        this.last = "not";
                        document.body.append(this.timerBar)
                    }
                })
            if(time == 0) {

                clearInterval(this.interval)
                this.loadFromServer()
                fetch("/checkTurn", { method: "POST", body, headers })
                .then(response => response.json())
                .then(data => {
                    if(data.turn == this.ui._playingAs) {
                        this.ui.setStatus(5)
                    } else {
                        this.ui.setStatus(4)
                    }
                })
            }
            time--;
        }, 1000)
    }

    waitForOpponent = () => {
        this.opponentBar = c("div", {id: 'bruh-moment'}, 
                c("h1", {id: "oponentg-momento"}, `WAITING FOR OPPONENT..`)
            )
        const body = JSON.stringify({nya: "arigatou"});
        const headers = { "Content-Type": "application/json" }
        document.body.append(this.opponentBar)
        let interval = setInterval(() => {

            let opponentFound = false;
            fetch("/checkForAnotherUser", { method: "POST", body, headers })
                .then(response => response.json())
                .then(data => {
                    if(data.res == "yeah") opponentFound = true;
                    if(opponentFound)  {
                    
                        clearInterval(interval)
                        if(data.turn != this.ui._playingAs) this.startTimer()
                        document.body.removeChild(this.opponentBar)
                        this.ui.setStatus(1)
                    }
                })
            

        }, 1000)
    }

    // set pawns(value) {
    //     this.load()
    // }

}

let matblack = new THREE.MeshBasicMaterial({
    color: 0x808080,
    map: new THREE.TextureLoader().load('../textures/light.jpg'),
})

let matwhite = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    map: new THREE.TextureLoader().load('../textures/light.jpg'),

})

let matselected = new THREE.MeshBasicMaterial({
    color: 0x00f0f0,
    map: new THREE.TextureLoader().load('../textures/light.jpg'),

})

let matdark = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load('../textures/dark.jpg')
})

let matlight = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load('../textures/light.jpg')
})

class Pawn extends THREE.Mesh {
    constructor(x, y, z, geometry, color) {
        let mat = color == 1 ? matblack : matwhite;
        super(geometry, mat)
        this.mat = mat
        this.position.set(x, y, z)
        this.pawnX = x;
        this.pawnZ = z;
        this.selected = false;
        this.color = color
    }

    set selected(value) {
        this.material = value ? matselected : this.mat
    }


    movePawn = (x, z) => {
    
        new TWEEN.Tween(this.position)
        .to({ x: x, y: 50, z: z }, 500 )
        .easing(TWEEN.Easing.Bounce.Out) 
        .start();
        this.pawnX = x;
        this.pawnY = z;
    }
}

class Tile extends THREE.Mesh {
    constructor(x, y, z, geometry, color) {
        let mat = color == 1 ? matdark : matlight;
        super(geometry, mat)
        this.mat = mat
        this.position.set(x, y, z)
        this.tileX = x;
        this.tileZ = z;
        this.selected = false;
        this.color = color
    }

    set selected(value) {
        this.material = value ? matselected : this.mat
    }

}