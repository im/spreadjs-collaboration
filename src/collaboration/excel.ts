
const collaUrl = 'ws://localhost:80'

import ReconnectingWebsocket from 'reconnecting-websocket'
import Connection from './connection'
import { v4 as uuidv4 } from 'uuid'

export default class Excel {
    connection: any = null
    spread: any = null
    designer: any = null
    spreadActions: any = null
    commandManager: any = null
    undoManager: any = null
    uuid = uuidv4()
    registerFlag = false
    constructor(designer: any) {
        this.designer = designer
        this.spread = designer.wrapper.spread
        this.spreadActions = this.designer.spreadActions
        this.commandManager = this.spread.commandManager()
        this.undoManager = this.spread.undoManager()

        this.initConnection()

        this.initCommand()

    }

    initCommand() {
        const _this = this
        this.commandManager.addListener("anyscLicenser", function () {
            if (_this.registerFlag) return _this.registerFlag = false

            for (let i = 0; i < arguments.length; i++) {
                const cmd = arguments[i].command;
                console.log('cmd: ', cmd)
                if (!cmd.uuid) {
                    cmd.uuid = _this.uuid
                    _this.connection.send(cmd)
                }

            }
        })

        const oldUndo = this.undoManager.undo;
        this.undoManager.undo = function () {
            return oldUndo.apply(this, arguments);
        }
        const oldRedo = this.undoManager.redo;
        this.undoManager.redo = () => {
            return oldRedo.apply(this, arguments);
        }
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
            shapeInfo,
            isConnectorType,
            position,
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
        } else if (cmd === 'designer.insertShape') {
            params.options = {
                shapeInfo,
                isConnectorType,
                position
            }
        } else {
            params.options = value
        }
    }

    getCommand (cmd: string) {
        return this.commandManager.getCommand(cmd)
    }

    isDesignerCommand (cmd: string) {
        return ~cmd.indexOf('designer')
    }

    getCommandName (cmd: string) {
        if (this.isDesignerCommand(cmd)) {
            return cmd.split('.')[1]
        }
        return cmd
    }

    // 菜单栏 里面的指令 如果不操作是没有初始化的 这样会导致菜单栏的所有指定无法同步
    // 如果当前指定没有注册 调用spreadActions 里面的注册方法注册指定
    // 因为所有的指定对应的参数不同 使用formatParams 格式化 options
    handleCommand(params: any) {
        const commandManager = this.commandManager
        const { cmd, value } = params
        console.log('是否有当前指令', commandManager.getCommand(cmd) , cmd)
        if (cmd && !this.getCommand(cmd)) {
            this.registerFlag = true
            const cmdName = this.getCommandName(cmd)
            const registerCommand = this.spreadActions[cmdName]

            this.formatParams(params)
            
            registerCommand(this.spread, params)
        } else {
            if (cmd) {
                commandManager.execute(params)
            }
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