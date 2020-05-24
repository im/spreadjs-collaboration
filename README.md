# spreadjs collaboration



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

1. 工作表保护后，有些功能不能用，比如右键菜单的许多功能，是否有其他锁定单元格的方式？

* [x] 编辑单元格
* [ ] 插入行列
* [x] 复制粘贴
* [x] 剪切
* [ ] 格式类、清除格式
* [ ] 删除
* [ ] 公式
* [ ] 图表
* [ ] 插入删除图片、图片挪动、图片大小
* [x] 首次插入图片位置不对
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





