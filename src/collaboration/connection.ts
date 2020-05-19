export default class Connection {
    socket: any = null
    excel: any = null

    constructor(socket: any, excel: any) {
        this.socket = socket
        this.excel = excel

        this.bindToSocket()
    }

    bindToSocket() {
        this.socket.onopen = this.open.bind(this)
        this.socket.onmessage = this.handleMessage.bind(this)
        this.socket.onclose = this.close.bind(this)
    }

    open() {}

    close() {}

    handleMessage(message: any) {
        if (!message || !message.data) return
        this.excel.handleCommand(JSON.parse(message.data))
    }

    send(message: any) {
        this.socket.send(JSON.stringify(message))
    }
}
