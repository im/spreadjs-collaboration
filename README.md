# spreadjs collaboration


### 数据结构

```
{
    baseVer: 0,
    uuid: '7fb54558-18f6-455d-a7ea-f94398acf211',
    cmd: 'editCell',
    sheetName: 'sheet1',  // 同一个sheet的操作才需要合并
    pos: {                // 编辑/插入图片等的位置
        col: 1,
        colCount: 1,      // 比如插入图表，需要将 dataFormula: "$G$7:$H$9" 转换成相应 col、colCount、row、rowCount
        row: 2,
        rowCount: 1
    },
    offset: {             // 移动操作的偏移量
        x: 20,
        y: 20
    },
    op: {
        cmd: 'editCell',
        sheetName: 'sheet1',
        // ...
    }
}
```

### 需要做OT的场景

- 存在可能影响其他 cmd 的操作位置的 cmd，比如

1. 插入单元格、行、列；
2. 删除单元格、行、列；
3. 删除整个sheet（这时忽略同一个sheet上的其他操作？）;

- 同时存在多个 moveSheet 的操作



### TODO

* [x] 图表同步  
* [x] 字体样式同步 
* [x] 菜单栏指定注册 
* [x] 形状插入无法同步  
* [x] clipboardPaste 指定无法注册 无法复制   
* [ ] 如何初始化内置指令  
* [ ] 表格插入无法同步
* [ ] 图片如果太大会有性能问题
* [ ] 光标问题
* [x] 右键菜单复杂粘贴无法同步
* [ ] 公式求值无法同步


### SPLIT

* [x] 进入单元格
* [ ] 锁定单元格

https://gcdn.grapecity.com.cn/showtopic-58249-1-5.html

1. 不管是通过 getCell(row, col).locked(true) 还是 style.locked = true 来锁定单元格，前提都需要先保护工作表，但工作表设置 isProtected = true 后，有些功能不能用，比如右键菜单的许多功能，如何保持这些功能可用？

* [x] 编辑单元格
* [x] 插入行列
* [x] 复制粘贴
* [x] 剪切
* [ ] 格式类、清除格式
* [x] 删除
* [ ] 公式
* [ ] 图表
* [x] 插入删除图片、图片挪动、图片大小
* [x] 首次插入图片位置不对
* [x] 通过 delete 删除图片无法同步
* [ ] sheet 管理、顺序

1. 没有合适的事件用于判断用户从 tab 的编辑框上失焦

SheetNameChanged Event 只能监听到 tab 失焦并且值被修改了，值没有修改过然后失焦，监听不到

2. 没有合适的事件监听到有人开始 drag tab 了，从而锁定其他用户的 tabs，不让他们 drag

3. 无法监听到 add sheet

并没有监听到 gc.spread.contextMenu.insertSheet 这个 command

https://gcdn.grapecity.com.cn/showtopic-74198-1-1.html


* [x] 冻结
* [ ] 批注
* [ ] 撤销和重做

目前实现了简单的撤销，某些其他用户传来的 cmd 会被推入当前用户的 undoList，这里还有坑

* [ ] 筛选排序是否需要
* [x] 如何区分自己和别人的操作



### PROBLEM

1. 工具栏的命令要触发一次后才会注册，协同时，A 执行了工具栏的 cmd，B 还没触发过，还没注册，所以在 B 收到相关 cmd 的时候，我们需要手动给它注册

- 能不能在初始化的时候一次性注册？
- 如何注册？目前是直接调用 spreadActions[cmdName]
- 大部分 cmd 在注册的时候都需要传入额外的 options，这些 options 是在具体操作发生的时候，比如点击了某个操作按钮，才会传进注册指令的方法，有没有什么方法可以拿到每个指令的 options？







##### 不同cmd包含的位置信息

1. 插入图片
    activeColIndex: 1
    activeRowIndex: 4
    colWidth: 62
    rowHeight: 20
2. 插入图表
    dataFormula: "$G$7:$H$9"
3. 移动图表/图片
    offsetX: 80
    offsetY: 20
4. 插入形状
    position: {
        x: 80,
        y: 20
    }
5. 移动形状
    changes: [{
        offsetHeight: 0
        offsetWidth: 0
        offsetX: 196
        offsetY: 0
    }]
6. 插入表格
    exRange: {
        ranges: [{
            col: 2
            colCount: 1
            row: 4
            rowCount: 1
        }]
    }
