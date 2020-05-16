

export default class Connection {

    socket: any = null
    spread: any = null


    constructor(socket: any, spread: any) {
        this.socket = socket
        this.spread = spread

        this.bindToSocket()
    }

    bindToSocket() {
        this.socket.onopen = this.open.bind(this)
        this.socket.onmessage = this.handleMessage.bind(this)
        this.socket.onclose = this.close.bind(this)
    }

    open() {

    }

    close() {

    }

    handleMessage(message: any) {
        const commandManager = this.spread.commandManager()
        const cmd = JSON.parse(message.data)
        commandManager.execute(cmd)
    }

    send(message: any) {
        this.socket.send(JSON.stringify(message))
    }

}