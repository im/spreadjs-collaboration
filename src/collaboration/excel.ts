
const collaUrl = 'ws://localhost:80'

import ReconnectingWebsocket from 'reconnecting-websocket'
import Connection from './connection'

export default class Excel {
    connection: any = null
    spread: any = null
    constructor(spread: any) {
        this.spread = spread

        this.initConnection()

        this.initCommand()

    }

    initCommand() {
        const _this = this
        this.spread.commandManager().addListener("anyscLicenser", function () {
            for (let i = 0; i < arguments.length; i++) {
                const cmd = arguments[i].command;
                if (cmd.clipboardText) {
                    cmd.fromSheet = null;
                    cmd.fromRanges = null;
                }
                _this.connection.send(cmd)
            }
        })
    }

    initConnection() {
        const socket = new ReconnectingWebsocket(collaUrl, [], {
            maxRetries: 1,
            connectionTimeout: 5000
        })
        this.connection = new Connection(socket, this.spread)
    }

}