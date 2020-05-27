const collaUrl = 'ws://localhost:8888'

import ReconnectingWebsocket from 'reconnecting-websocket'
import Connection from './connection'
import { v4 as uuidv4 } from 'uuid'

export default class Excel {
    MENUITEM_NAME_PREFIX = 'designer.'

    connection: any = null
    spread: any = null
    designer: any = null
    spreadActions: any = null
    commandManager: any = null
    undoManager: any = null
    uuid = uuidv4()
    registerFlag = false
    insertPictureFlag = true

    cutRange: any = {}

    constructor(designer: any) {
        const _this = this
        this.designer = designer
        this.spread = designer.wrapper.spread
        this.spreadActions = this.designer.spreadActions
        this.commandManager = this.spread.commandManager()
        this.undoManager = this.spread.undoManager()

        this.initConnection()

        this.initCommand()

        this.initEvents()  // 直接在spread上绑定事件
        this.lockSheet()   // 只能一个sheet一个sheet去锁定
        this.spread.bind(GC.Spread.Sheets.Events.ActiveSheetChanging, function (sender, args) {
            _this.lockSheet()
        })
    }

    lockSheet() {
        // TODO 加个判断，已经初始化过的不再初始化
        // TODO 这种锁定方式有问题，会导致很多功能不能用
        const activeSheet = this.spread.getActiveSheet()
        const sheetStyle = activeSheet.getDefaultStyle()
        sheetStyle.locked = false
        activeSheet.setDefaultStyle(sheetStyle)
        // activeSheet.options.isProtected = true
    }

    initCommand() {
        const _this = this
        this.commandManager.addListener('anyscLicenser', function() {
            if (_this.registerFlag) return (_this.registerFlag = false)

            for (let i = 0; i < arguments.length; i++) {
                const cmd = arguments[i].command
                const cmdName = cmd.cmd
                console.log('执行指令: ', cmdName, cmd)

                if (cmdName) {
                    // 复制/打开弹框的cmd不需要同步
                    if (~cmdName.toLowerCase().indexOf('dialog') || ~cmdName.toLowerCase().indexOf('copy')) return

                    // 保存剪切范围
                    if (cmdName === 'designer.cut') {
                        _this.cutRange.sheetName = cmd.sheetName
                        _this.cutRange.selections = cmd.selections
                    }
                    // 粘贴时将剪切范围也send出去
                    if (cmdName === 'clipboardPaste' && cmd.isCutting) {
                        cmd.cutRange = _this.cutRange
                    }
                }

                if (cmd.clipboardText) {
                    cmd.fromSheet = null
                    cmd.fromRanges = null
                }
                if (!cmd.uuid) {
                    cmd.uuid = _this.uuid
                    _this.connection.send(cmd)
                }
            }
        })

        const oldUndo = this.undoManager.undo
        this.undoManager.undo = function(isManual: boolean) {
            // if (!this.undoManager.canUndo()) return
            console.log('触发undo，是否手动触发：', isManual)

            // 代码手动触发的undo不需要同步
            if (!isManual) {
                // 过滤掉undoList中非当前用户的操作（通过代码execute的command会被插入undoList中，但显然不能撤销别人的操作）
                this.Ac = this.Ac.filter(v => v.uuid === _this.uuid)
                const undoList = this.Ac || []

                const cmd = {
                    cmd: 'undo',
                    undoData: undoList[undoList.length - 1],
                    uuid: _this.uuid
                }
                _this.connection.send(cmd)
            }
            return oldUndo.apply(this, arguments)
        }
        const oldRedo = this.undoManager.redo
        this.undoManager.redo = () => {
            console.log('redo: ')
            return oldRedo.apply(this, arguments)
        }
    }

    // 兼容 doAction 方法
    // 这里面问题还挺多， 各种类型的样式可能都要做一下兼容， 目前先这样
    // 不知道有没有默认就能初始化菜单栏的 command 方法
    formatOptions(params: any) {
        const sheet = this.spread.getActiveSheet()
        const {
            value,
            cmd,
            fileName,
            category,
            chartName,
            chartType,
            dataFormula,
            shapeInfo,
            isConnectorType,
            position,
            dataOrientation,
            isSwitchDataOrientation,
            series,
            formulaName
        } = params

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
        } else if (cmd === 'designer.changeChartType') {
            params.options = {
                chartType,
                isSwitchDataOrientation,
                series,
                dataFormula,
                category,
                chart: {
                    name: function() {
                        return chartName 
                    }
                }
            }
        } else if (cmd === 'designer.setAutoFormula') {
            params.options = formulaName
        } else {
            params.options = value
        }
    }

    getCommand(cmd: string) {
        return this.commandManager.getCommand(cmd)
    }

    isDesignerCommand(cmd: string) {
        return ~cmd.indexOf(this.MENUITEM_NAME_PREFIX)
    }

    getCommandName(cmd: string) {
        if (this.isDesignerCommand(cmd)) {
            return cmd.split('.')[1]
        }
        return cmd
    }

    // 菜单栏 里面的指令 如果不操作是没有初始化的 这样会导致菜单栏的所有指定无法同步
    // 如果当前指定没有注册 调用spreadActions 里面的注册方法注册指定
    // 因为所有的指定对应的参数不同 使用formatOptions 格式化 options
    handleCommand(params: any) {
        const spread = this.spread
        const commandManager = this.commandManager
        const undoManager = this.undoManager
        const { value, sheetName } = params
        let cmd = params.cmd

        const sheet = spread.getSheetFromName(sheetName)

        // console.log('是否有当前指令', cmd, params)
        console.log('收到指令：', cmd, params)
        
        // 直接执行同步过来的剪切操作会有问题
        // 执行designer.cut的时候会去执行cut（cut是基于当前用户定位的单元格做剪切，而不是真正执行了剪切的位置）
        // 所以改成在粘贴的时候手动清空剪切范围
        if (cmd === 'cut') return
        if (cmd === 'designer.cut' && params.uuid && params.uuid !== this.uuid) return

        // 右键/工具栏粘贴会同时触发paste、designer.pasteAll和clipboardPaste，只保留clipboardPaste
        if (cmd && ~cmd.indexOf('paste') && cmd !== 'clipboardPaste') return

        // 剪切后的粘贴，先清空剪切范围的内容
        if (cmd && cmd === 'clipboardPaste' && params.isCutting) {
            const { selections } = params.cutRange
            const { row, col, rowCount, colCount } = selections[0]
            for (const p in GC.Spread.Sheets.StorageType) {
                if (Number(p)) continue
                sheet.clear(row, col, rowCount, colCount, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType[p])
            }
            params.isCutting = false
        }

        // 锁定/解锁单元格
        if (cmd === 'lockCell' || cmd === 'unlockCell') {
            this.lockCell(params, cmd === 'lockCell')
            return
        }

        // 锁定/解锁Sheet Tab
        if (cmd === 'lockSheetTab' || cmd === 'unlockSheetTab') {
            spread.options.tabEditable = cmd !== 'lockSheetTab'
            return
        }

        // 添加sheet

        // 移动sheet
        if (cmd === 'moveSheet') {
            const { sheetName, oldIndex, newIndex } = params
            const isActive = spread.getActiveSheet() === sheet

            if (oldIndex > newIndex) {
                const sheets = spread.sheets.splice(oldIndex, 1)
                spread.sheets.splice(newIndex, 0 , sheets[0])
            } else {
                spread.sheets[newIndex] = spread.sheets.splice(oldIndex, 1, spread.sheets[newIndex])[0]
            }
            if (isActive) spread.setActiveSheet(sheetName)  // 如果被移动的是当前sheet，需要重新setActiveSheet
            spread.refresh()
            return
        }

        // 右键菜单
        if (cmd && ~cmd.indexOf('gc.spread.contextMenu')) {
            cmd = this.handleContextMenuCommand(params)
            // return
        }

        // delete删除图片无法同步，手动移除
        if (cmd === 'deleteFloatingObjects') {
            const name = params.floatingObjects[0]
            if (~name.toLowerCase().indexOf('picture')) {
                sheet.pictures.remove(name)
                sheet.floatingObjects.remove(name)
                console.log('手动移除：', name)
                return
            }
        }

        // 将收到的需要undo的cmd推入当前manager的undoList
        if (cmd === 'undo') {
            const undoList = undoManager.Ac
            undoList.push(params.undoData)
            console.log('收到撤销指令后更新undoList: ', undoList)
            undoManager.undo.call(undoManager, true)
            return
        }

        if (cmd && !this.getCommand(cmd)) {
            if (cmd === 'designer.insertPicture') this.insertPictureFlag = false
            this.registerFlag = true
            const cmdName = this.getCommandName(cmd)
            const registerCommand = this.spreadActions[cmdName]

            this.formatOptions(params)

            console.log('registerCommand: ', cmdName)
            registerCommand(spread, params)
        } else {
            if (cmd) {
                if (cmd === 'editCell') {
                    // 单元格被锁定后，无法在其上执行 cmd，改用 cell.value()
                    // const { sheetName, row, col } = params
                    // const sheet = spread.getSheetFromName(sheetName)
                    // const cell = sheet.getCell(row, col)
                    // if (cell.locked()) {
                    //     cell.value(params.newValue)
                    // } else {
                    //     commandManager.execute(params)
                    // }

                    // 先解锁，才能执行cmd
                    this.lockCell(params, false)
                }
                commandManager.execute(params)
            }
        }

        // 插入图片后
        if (cmd === 'designer.insertPicture') {
            this.autoMovePicture(params)
        }
    }

    initConnection() {
        const socket = new ReconnectingWebsocket(collaUrl, [], {
            maxRetries: 1,
            connectionTimeout: 5000
        })
        this.connection = new Connection(socket, this)
    }

    initEvents() {
        const _this = this
        const spread = this.spread

        spread.bind(GC.Spread.Sheets.Events.EditStarting, function (sender, args) {
            console.log(`进入单元格：（${args.col}，${args.row}）`)
            // 锁定单元格
            const cmd = {
                cmd: 'lockCell',
                row: args.row,
                col: args.col,
                sheetName: args.sheetName,
                uuid: _this.uuid
            }
            _this.connection.send(cmd)
        })

        spread.bind(GC.Spread.Sheets.Events.EditEnded, function (sender, args) {
            console.log(`离开单元格：（${args.col}，${args.row}）`)
            // 解锁单元格
            const cmd = {
                cmd: 'unlockCell',
                row: args.row,
                col: args.col,
                sheetName: args.sheetName,
                uuid: _this.uuid
            }
            _this.connection.send(cmd)
        })

        spread.bind(GC.Spread.Sheets.Events.SheetTabDoubleClick, function (e, info) {    
            if (!spread.options.tabEditable) return  // 如果当前已经是锁定状态，不需要发出cmd
            console.log('编辑sheetName：', info.sheetName)
            // 锁定Sheet Tab
            const cmd = {
                cmd: 'lockSheetTab',
                sheetName: info.sheetName,
                uuid: _this.uuid
            }
            _this.connection.send(cmd)
        })

        spread.bind(GC.Spread.Sheets.Events.SheetMoved, function (e, info) {    
            console.log('移动sheet：', info.sheetName)
            // 移动sheet
            const cmd = {
                cmd: 'moveSheet',
                sheetName: info.sheetName,
                oldIndex: info.oldIndex,
                newIndex: info.newIndex,
                uuid: _this.uuid
            }
            _this.connection.send(cmd)
        })
    }

    handleContextMenuCommand(params: any) {
        const cmd = params.cmd
        const menuData = this.spread.contextMenu.menuData
        const item = menuData.filter(v => v.command === cmd)[0]
        return ~item.name.indexOf(this.MENUITEM_NAME_PREFIX)
            ? item.name
            : cmd

        // TODO createMenuItemElement貌似行不通
        // this.spread.contextMenu.menuView.createMenuItemElement(item)
        // this.commandManager.execute(params)
    }

    lockCell(params: any, isLock: boolean) {
        const { sheetName, row, col } = params
        const sheet = this.spread.getSheetFromName(sheetName)
        sheet.getCell(row, col).locked(isLock)
        // var style = new Gc.Spread.Sheets.Style()
        // style.locked = true
        // style.backColor = 'red'
        // sheet.setStyle(row, col, style)
    }

    // 首次手动执行cmd: insertPicture，需要先注册cmd，这时会走spreadActions: insertPicture方法
    // 该方法会把图片插入到（sheet.getActiveColumnIndex(), sheet.getActiveRowIndex()）的位置，需要手动移动到正确的位置
    // 后续直接执行注册好的cmd不存在这个问题，会以传入的（col, row）为准
    autoMovePicture(params: any) {
        if (this.insertPictureFlag) return
        this.insertPictureFlag = true

        const sheetName = params.sheetName
        const sheet = this.spread.getSheetFromName(sheetName)
        const pictures = sheet.pictures.all()
        const target = pictures[pictures.length - 1]._ps.name  // 刚插入的图片的名称

        const sourceRow = sheet.getActiveRowIndex()
        const sourceCol = sheet.getActiveColumnIndex()
        const { activeRowIndex: targetRow, activeColIndex: targetCol, uuid } = params
        const { x: targetX, y: targetY } = sheet.getCellRect(targetRow, targetCol)
        const { x: sourceX, y: sourceY } = sheet.getCellRect(sourceRow, sourceCol)

        const cmd = {
            cmd: 'moveFloatingObjects',
            floatingObjects: [target],
            offsetX: targetX - sourceX,
            offsetY: targetY - sourceY,
            sheetName,
            uuid
        }

        this.commandManager.execute(cmd)
    }
}
