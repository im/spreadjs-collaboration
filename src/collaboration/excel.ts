
const collaUrl = 'ws://localhost:80'

import ReconnectingWebsocket from 'reconnecting-websocket'
import Connection from './connection'
import { v4 as uuidv4 } from 'uuid'

export default class Excel {
    connection: any = null
    spread: any = null
    designer: any = null
    spreadActions: any = null
    uuid = uuidv4()
    registerFlag = false
    constructor(designer: any) {
        this.designer = designer
        this.spread = designer.wrapper.spread
        this.spreadActions = this.designer.spreadActions

        this.initConnection()

        this.initCommand()

    }

    initCommand() {
        const _this = this
        this.spread.commandManager().addListener("anyscLicenser", function () {
            if (_this.registerFlag) {
                return _this.registerFlag = false
            }
            for (let i = 0; i < arguments.length; i++) {

                const cmd = arguments[i].command;
                console.log('cmd: ', cmd)
                if (!cmd.uuid) {
                    cmd.uuid = _this.uuid
                    _this.connection.send(cmd)
                }

            }
        })
    }

    // 兼容 doAction 方法
    // 这里面问题还挺多， 各种类型的样式可能都要做一下兼容， 目前先这样
    // 不知道有没有默认就能初始化菜单栏的 command 方法
    formatParams (params: any) {
        const sheet = this.spread.getActiveSheet()
        const {
            value,
            cmd,
            fileName,
            category,
            chartType,
            dataFormula,
            dataOrientation } = params
        
        params.sheet = sheet

        if (cmd === 'designer.insertPicture') {
            params.options = fileName
        } else if (cmd === 'designer.insertChart') {
            params.options = {
                category,
                chartType,
                dataFormula,
                dataOrientation
            }
        } else {
            params.options = value
        }
    }

    // 菜单栏 里面的指令 如果不操作是没有初始化的 这样会导致菜单栏的所有指定无法同步
    // 如果当前指定没有注册 调用spreadActions 里面的注册方法注册指定
    // 因为所有的指定对应的参数不同 使用formatParams 格式化 options
    handleCommand(params: any) {
        const commandManager = this.spread.commandManager()
        const { cmd, value } = params
        if (cmd && !commandManager.getCommand(cmd)) {
            this.registerFlag = true

            const cmdName = cmd.split('.')[1]
            const registerCommand = this.spreadActions[cmdName]

            this.formatParams(params)
            
            registerCommand(this.spread, params)
        } else {
            commandManager.execute(params)
        }
    }

    initConnection() {
        const socket = new ReconnectingWebsocket(collaUrl, [], {
            maxRetries: 1,
            connectionTimeout: 5000
        })
        this.connection = new Connection(socket, this)
    }

}