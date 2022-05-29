import { createElement as c } from "./amog.js";
const statuses = ["not connected", "connected", "waiting", "err", "victory", "loss"]

export default class Ui {
    constructor() {

        this._status = 0
        this._playingAs = 0
        this.updateBar()

    }

    updateBar = () => {
        const gamer = c("h1", { id: "status" }, `STATUS: ${statuses[this._status]} ${this._playingAs != 0 ? this._playingAs == 1 ? `| ${this._username} PLAYING AS: BLACK` : `| ${this._username} PLAYING AS: WHITE` : ""}`)
        const bar = document.querySelector("#status-bar")
        if (bar.children.length > 0) bar.removeChild(this.currentgamer);
        this.currentgamer = gamer;
        bar.append(gamer)
    }


    setStatus(status, playingAs, username, ) {
        this._status = status;
        if(playingAs) this._playingAs = playingAs;
        if(username) this._username = username;
        this.updateBar()

    }
    

    set status(val) {
        this._status = val
        this.updateBar()
    }

    get status() {
        return this._status
    }
}