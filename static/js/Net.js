import { createElement as c } from "./amog.js";

export default class Net {
    constructor(game, ui) {
        this.startConnection()
        this.ui = ui
        this.game = game

    }

    startConnection = () => {
        this.bad = c("div", { "id": "bruh-moment" });
        this.login = c("div", { "id": "login-field" },
            c("h2", { className: "main-login-text" }, "Login"),
            (this.input = c("input", { className: "login-input", id: "login-input", placeholder: "Name" })),
            c("div", { className: "flex-column" },
                c("button", { onclick: this.handleLogin }, "Login"),
                c("button", { onclick: this.handleReset }, "Reset")
            )
        )




        document.body.append(this.login)
        document.body.append(this.bad)

    }

    handleLogin = () => {
        const user = this.input.value
        const body = JSON.stringify({ user: user })
        const headers = { "Content-Type": "application/json" }
        fetch("/add", { method: "POST", body, headers })
            .then(response => response.json())
            .then(data => {
                if (data.res === "err") {
                    console.log((data.err == 1) ? "too many users active" : "username already active")

                } else {
                    console.log(`Logged in as ${data.user}. Currently active: ${data.current}. You're playing as ${(data.current == 1 ? "black" : "white")}`)
                    document.body.removeChild(this.login)
                    document.body.removeChild(this.bad)
                    this.ui.setStatus(1, data.current, data.user)
                    if(data.current == 1) {
                        this.ui.setStatus(2)
                        this.game.waitForOpponent()
                    }
                    else if (data.current == 2) {
                        this.game.setCameraPos(0, 1500, -1000)
                        if(data.turn != this.current) this.game.startTimer()
                    }

                    


                }
            })
        // this.gamer = c("button", { onclick: this.game.loadFromServer, className: "grr" }, "load")
        // document.body.append(this.gamer)
    }

    handleReset = () => {
        const body = JSON.stringify({ uwu: "owo" })
        const headers = { "Content-Type": "application/json" }
        fetch("/reset", { method: "POST", body, headers })
            .then(response => response.json())
            .then(data => console.log(data))
    }
}