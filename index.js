const express = require('express');

const app = express();
app.use(express.json())
app.use(express.static('static'));


users = []
board = [
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1]
]

bruh = {
    oldx: null,
    oldy: null,
    x: null,
    y: null
}
turn = 1;
app.get('/', (req, res) => {
    res.send('index.html')
})

app.post("/add", (req, res) => {
    res.setHeader('content-type', 'application/json')
    if (users.indexOf(req.body.user) != -1) {
        return res.end(JSON.stringify({ res: "err", err: 0 }));
    }
    if (users.length >= 2) {
        return res.end(JSON.stringify({ res: "err", err: 1 }));
    }

    users.push(req.body.user)
    //console.log(req.body)
    res.end(JSON.stringify({ user: users[users.length - 1], current: users.length, res: "success", turn: turn }));

})

app.post("/reset", (req, res) => {
    users = [];
    board = [
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1]
    ]
    turn =1;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ res: "wiped" }));
})

app.post("/move", (req, res) => {
board = req.body.pawns;
    turn = (req.body.turn == 1) ? 2 : 1;
    res.end(JSON.stringify({ res: "ok" }))
    console.log(turn)
    
})

app.post("/getBoard", (req, res) => {
    res.end(JSON.stringify({ pawns: board }))
})


app.post("/checkForAnotherUser", (req, res) => {
    if(users.length == 2) res.end(JSON.stringify({ res: "yeah" }))
    else res.end(JSON.stringify({ res: "no", turn: turn}))
})


app.post("/checkTurn", (req, res) => {
    res.end(JSON.stringify({turn: turn}))
})

app.listen(2137, () => {
    console.log("startedd;ddd (@ 2137)")
})

