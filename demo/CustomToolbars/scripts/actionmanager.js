var Actions = {
    // doAction for common works to run actions
    doAction: function (spread, strName, action) {
        // spread.getActiveSheet().doCommand(action);
        var sheetName = spread.getActiveSheet().name();
        runCommand(spread, strName, action, {sheetName: sheetName});
    },
    _reset: function (spread) {
        spread.undoManager().clear();
    },
    setTextBold: function (spread, options) {
        var action = new SetTextBoldAction(spread, options);
        Actions.doAction(spread, "SetTextBold", action);
    },
    setTextItalic: function (spread, options) {
        var action = new SetTextItalicAction(spread, options);
        Actions.doAction(spread, "setTextItalic", action);
    },
    setTextUnderline: function (spread, options) {
        var action = new SetTextUnderlineAction(spread, options);
        Actions.doAction(spread, "setTextUnderline", action);
    },
    setTextOverline: function (spread, options) {
        var action = new SetTextOverlineAction(spread, options);
        Actions.doAction(spread, "setTextOverline", action);
    },
    setTextStrikethrough: function (spread, options) {
        var action = new SetTextStrikethroughAction(spread, options);
        Actions.doAction(spread, "setTextStrikethrough", action);
    },
    setTextFontFamily: function (spread, options) {
        var action = new SetTextFontFamilyAction(spread, options);
        Actions.doAction(spread, "setTextFontFamily", action);
    },
    setTextFontSize: function (spread, options) {
        var action = new SetTextFontSizeAction(spread, options);
        Actions.doAction(spread, "setTextFontSize", action);
    },
    setTextBackColor: function (spread, options) {
        var action = new SetTextBackColorAction(spread, options);
        Actions.doAction(spread, "setTextBackColor", action);
    },
    setTextForeColor: function (spread, options) {
        var action = new SetTextForeColorAction(spread, options);
        Actions.doAction(spread, "setTextForeColor", action);
    },
    setBorder: function (spread, options) {
        var action = new SetBorderAction(spread, options);
        Actions.doAction(spread, "setBorder", action);
    },
    setTextAligns: function (spread, options) {
        var action = new SetTextAlignsAction(spread, options);
        Actions.doAction(spread, "setTextAligns", action);
    },
    setCellType: function (spread, options) {
        var action = new SetCellTypeAction(spread, options);
        Actions.doAction(spread, "setCellType", action);
    },
    setWrapText: function (spread, options) {
        var action = new SetWrapTextAction(spread, options);
        Actions.doAction(spread, "setWrapText", action);
    },
    setMergeCenter: function (spread, options) {
        var action = new SetMergeCenterAction(spread, options);
        Actions.doAction(spread, "setMergeCenter", action);
    },
    indent: function (spread, options) {
        var action = new IndentAction(spread, options);
        Actions.doAction(spread, "indent", action);
    },
    setCellFormat: function (spread, options) {
        var action = new SetCellFormatAction(spread, options);
        Actions.doAction(spread, "setCellFormat", action);
    },
    increaseDecimal: function (spread, options) {
        var action = new IncreaseDecimalAction(spread, options);
        Actions.doAction(spread, "increaseDecimal", action);
    },
    decreaseDecimal: function (spread, options) {
        var action = new DecreaseDecimalAction(spread, options);
        Actions.doAction(spread, "decreaseDecimal", action);
    },
    setCellLock: function (spread, options) {
        var action = new SetCellLockAction(spread, options);
        Actions.doAction(spread, "setCellLock", action);
    },
    setIsProtected: function (spread, options) {
        var action = new SetIsProtectAction(spread, options);
        Actions.doAction(spread, "setIsProtected", action);
    },
    clearAll: function (spread) {
        var action = new ClearAllAction(spread);
        Actions.doAction(spread, "clearAll", action);
    },
    clearFormatting: function (spread) {
        var action = new ClearFormattingAction(spread);
        Actions.doAction(spread, "clearFormatting", action);
    },
    clearData: function (spread) {
        var action = new ClearDataAction(spread);
        Actions.doAction(spread, "clearData", action);
    },

    insertRows: function (spread, options) {
        var action = new InsertRowsAction(spread, options);
        Actions.doAction(spread, "insertRows", action);
        Actions._reset(spread);
    },
    insertColumns: function (spread, options) {
        var action = new InsertColumnsAction(spread, options);
        Actions.doAction(spread, "insertColumns", action);
        Actions._reset(spread);
    },
    insertRightCells: function (spread, options) {
        var action = new InsertRightCellsAction(spread, options);
        Actions.doAction(spread, "insertRightCells", action);
        Actions._reset(spread);
    },
    insertDownCells: function (spread, options) {
        var action = new InsertDownCellsAction(spread, options);
        Actions.doAction(spread, "insertDownCells", action);
        Actions._reset(spread);
    },
    deleteRows: function (spread, options) {
        var action = new DeleteRowsAction(spread, options);
        Actions.doAction(spread, "deleteRows", action);
        Actions._reset(spread);
    },
    deleteColumns: function (spread, options) {
        var action = new DeleteColumnsAction(spread, options);
        Actions.doAction(spread, "deleteColumns", action);
        Actions._reset(spread);
    },
    deleteLeftCells: function (spread, options) {
        var action = new DeleteLeftCellsAction(spread, options);
        Actions.doAction(spread, "deleteLeftCells", action);
        Actions._reset(spread);
    },
    deleteUpCells: function (spread, options) {
        var action = new DeleteUpCellsAction(spread, options);
        Actions.doAction(spread, "deleteUpCells", action);
        Actions._reset(spread);
    },

    addTable: function (spread) {
        var action = new AddTableAction(spread);
        Actions.doAction(spread, "addTable", action);
    },
    addPicture: function (spread, options) {
        var action = new AddPictureAction(spread, options);
        Actions.doAction(spread, "addPicture", action);
    },
    insertComment: function (spread) {
        var action = new InsertCommentAction(spread);
        Actions.doAction(spread, "insertComment", action);
    },
    setCommentFontSize: function (spread, options) {
        var action = new SetCommentFontSizeAction(spread, options);
        Actions.doAction(spread, "setCommentFontSize", action);
    },
    setCommentFontFamily: function (spread, options) {
        var action = new SetCommentFontFamilyAction(spread, options);
        Actions.doAction(spread, "setCommentFontFamily", action);
    },
    setCommentFontStyle: function (spread, options) {
        var action = new SetCommentFontStyleAction(spread, options);
        Actions.doAction(spread, "setCommentFontStyle", action);
    },
    setCommentFontWeight: function (spread, options) {
        var action = new SetCommentFontWeightAction(spread, options);
        Actions.doAction(spread, "setCommentFontWeight", action);
    },
    setCommentTextDecoration: function (spread, options) {
        var action = new SetCommentTextDecorationAction(spread, options);
        Actions.doAction(spread, "setCommentTextDecoration", action);
    },
    setCommentBorderWidth: function (spread, options) {
        var action = new SetCommentBorderWidthAction(spread, options);
        Actions.doAction(spread, "setCommentBorderWidth", action);
    },
    setCommentBorderStyle: function (spread, options) {
        var action = new SetCommentBorderStyleAction(spread, options);
        Actions.doAction(spread, "setCommentBorderStyle", action);
    },
    setCommentBorderColor: function (spread, options) {
        var action = new SetCommentBorderColorAction(spread, options);
        Actions.doAction(spread, "setCommentBorderColor", action);
    },
    setCommentHorizontalAlign: function (spread, options) {
        var action = new SetCommentHorizontalAlignAction(spread, options);
        Actions.doAction(spread, "setCommentHorizontalAlign", action);
    },
    setCommentForeColor: function (spread, options) {
        var action = new SetCommentForeColorAction(spread, options);
        Actions.doAction(spread, "setCommentForeColor", action);
    },
    setCommentBackColor: function (spread, options) {
        var action = new SetCommentBackColorAction(spread, options);
        Actions.doAction(spread, "setCommentBackColor", action);
    },
    setCommentOpacity: function (spread, options) {
        var action = new SetCommentOpacityAction(spread, options);
        Actions.doAction(spread, "setCommentOpacity", action);
    },
    setCommentDisplayMode: function (spread, options) {
        var action = new SetCommentDisplayModeAction(spread, options);
        Actions.doAction(spread, "setCommentDisplayMode", action);
    },
    setCommentPadding: function (spread, options) {
        var action = new SetCommentPaddingAction(spread, options);
        Actions.doAction(spread, "setCommentPadding", action);
    },
    setCommentShowShadow: function (spread, options) {
        var action = new SetCommentShowShadowAction(spread, options);
        Actions.doAction(spread, "setCommentShowShadow", action);
    },
    setCommentDynamicSize: function (spread, options) {
        var action = new SetCommentDynamicSizeAction(spread, options);
        Actions.doAction(spread, "setCommentDynamicSize", action);
    },
    setCommentDynamicMove: function (spread, options) {
        var action = new SetCommentDynamicMoveAction(spread, options);
        Actions.doAction(spread, "setCommentDynamicMove", action);
    },
    setCommentLockText: function (spread, options) {
        var action = new SetCommentLockTextAction(spread, options);
        Actions.doAction(spread, "setCommentLockText", action);
    },
    setFormulaSparkline: function (spread, options) {
        var action = new SetFormulaSparklineAction(spread, options);
        Actions.doAction(spread, "setFormulaSparkline", action);
    },

    groupRows: function (spread, options) {
        var sheet = spread.getActiveSheet();
        var sheetName = sheet.name();
        var _commandManager = spread.commandManager();
        var selection = options.value;
        _commandManager.execute({
            cmd: "outlineRow",
            sheetName: sheetName,
            index: selection.row,
            count: selection.rowCount
        });
    },
    groupColumns: function (spread, options) {
        var sheet = spread.getActiveSheet();
        var sheetName = sheet.name();
        var _commandManager = spread.commandManager();
        var selection = options.value;
        _commandManager.execute({
            cmd: "outlineColumn",
            sheetName: sheetName,
            index: selection.col,
            count: selection.colCount
        });
    },

    ungroupRows: function (spread, options) {
        var sheet = spread.getActiveSheet();
        var sheetName = sheet.name();
        var _commandManager = spread.commandManager();
        var selection = options.value;
        _commandManager.execute({
            cmd: "removeRowOutline",
            sheetName: sheetName,
            index: selection.row,
            count: selection.rowCount
        });
    },

    ungroupColumns: function (spread, options) {
        var sheet = spread.getActiveSheet();
        var sheetName = sheet.name();
        var _commandManager = spread.commandManager();
        var selection = options.value;
        _commandManager.execute({
            cmd: "removeColumnOutline",
            sheetName: sheetName,
            index: selection.col,
            count: selection.colCount
        });
    },
    expandGroup: function (spread) {
        var action = new ExpandGroup(spread);
        Actions.doAction(spread, "expandGroup", action);
    }
};

var registedCommand = {};
function runCommand(spread, name, action, options) {
    var commandManager = spread.commandManager();
    var commandName = "designer." + name;
    if (!registedCommand[commandName]) {
        commandManager.register(commandName, action, null, false, false, false, false);
        registedCommand[commandName] = true;
    }
    options.cmd = commandName;
    options.__action = action;
    commandManager.execute(options);
}

function setBaseClass(type, baseType) {
    type.prototype = Object.create(baseType.prototype);
    type.prototype.constructor = type;
}

function DesignerActionBase(spread) {
    //GC.Spread.Sheets.UndoRedo.ActionBase.call(this);
    this._spread = spread;
    this._original = {};
    var sheet = this._sheet = spread && spread.getActiveSheet();
    this._selections = sheet && sheet.getSelections();
    this._selectionRanges = util.getSelectionRanges(sheet);
}
//setBaseClass(DesignerActionBase, GC.Spread.Sheets.UndoRedo.ActionBase);
DesignerActionBase.prototype.execInSelections = function (sheet, styleProperty, func) {
    var self = this, i, j;
    var selections = self._selections;
    for (var k = 0; k < selections.length; k++) {
        var selection = selections[k];
        var col = selection.col, row = selection.row, rowCount = selection.rowCount, colCount = selection.colCount;
        if ((col === -1 || row === -1) && styleProperty) {
            var style, r, c;
            if (col === -1 && row === -1) {
                for (r = 0; r < rowCount; r++) {
                    if ((style = sheet.getStyle(r, -1)) && style[styleProperty] !== undefined) {
                        func(sheet, r, -1);
                    }
                }
                for (c = 0; c < colCount; c++) {
                    if ((style = sheet.getStyle(-1, c)) && style[styleProperty] !== undefined) {
                        func(sheet, -1, c);
                    }
                }
            }
            if (col === -1) {
                col = 0;
            }
            if (row === -1) {
                row = 0;
            }
            for (i = 0; i < rowCount; i++) {
                r = row + i;
                for (j = 0; j < colCount; j++) {
                    c = col + j;
                    if ((style = sheet.getStyle(r, c)) && style[styleProperty] !== undefined) {
                        func(sheet, r, c);
                    }
                }
            }
        }
        if (col == -1 && row == -1) {
            func(sheet, -1, -1);
        }
        else if (row == -1) {
            for (i = 0; i < colCount; i++) {
                func(sheet, -1, col + i);
            }
        }
        else if (col == -1) {
            for (i = 0; i < rowCount; i++) {
                func(sheet, row + i, -1);
            }
        }
        else {
            for (i = 0; i < rowCount; i++) {
                for (j = 0; j < colCount; j++) {

                    func(sheet, row + i, col + j);
                }
            }
        }
    }
};
DesignerActionBase.prototype.canUndo = function () {
    return true;
};
DesignerActionBase.prototype.getActualFont = function (sheet, row, column) {
    return sheet.getActualStyle(row, column).font;
};
DesignerActionBase.prototype.getActualDecoration = function (sheet, row, column) {
    return sheet.getActualStyle(row, column).textDecoration;
};
DesignerActionBase.prototype.getKey = function (row, column) {
    return [row, column].join(',');
};
DesignerActionBase.prototype.getPosition = function (key) {
    var items = key && key.split(',');
    if (items && items.length === 2) {
        return {row: +items[0], column: +items[1]};
    }
    return null;
};
DesignerActionBase.prototype.setFontStyle = function (style, attribute, value, row, column) {
    var self = this, sheet = self._sheet;
    if (!style.font) {
        style.font = self.getActualFont(sheet, row, column);
    }
    var fontElement = $("<span></span>");
    fontElement.css("font", style.font);
    fontElement.css(attribute, value);
    style.font = fontElement.css("font");
    sheet.setStyle(row, column, style);
};
DesignerActionBase.prototype.undoSetStyle = function (property) {
    var self = this, sheet = self._sheet, spread = self._spread, styles = self._original.styles;
    if (styles) {
        spread.suspendPaint();
        for (var key in styles) {
            var pos = self.getPosition(key),
                oldValue = styles[key];
            if (pos) {
                var row = pos.row, column = pos.column;
                var style = sheet.getStyle(row, column);
                if (property == 'backColor') {
                    style[property] = oldValue || undefined;    // replace null with undefined to avoid border been effected
                }
                else {
                    style[property] = oldValue;
                }
                sheet.setStyle(row, column, style);
            }
        }
        spread.resumePaint();
    }
    return true;
};
DesignerActionBase.prototype.setStyle = function (attribute, property, value, adjustValue, additionArgs) {
    var self = this, sheet = self._sheet, spread = self._spread;
    var original = self._original = {styles: {}}; // prepare object to save related original information
    spread.suspendPaint();
    self.execInSelections(sheet, attribute, function (sheet, row, column) {
        var style = sheet.getStyle(row, column);
        original.styles[self.getKey(row, column)] = style && style[property];     // save related information, use row, column as the key
        if (!style) {
            style = new GC.Spread.Sheets.Style();
        }
        if (adjustValue) {
            value = adjustValue.apply(self, [sheet, row, column, style, value].concat(additionArgs || []));
            style[property] = value;
            sheet.setStyle(row, column, style);
        }
        if (["font-size", "font-family", "font-weight", "font-style"].indexOf(attribute) >= 0) {
            self.setFontStyle(style, attribute, value, row, column);
        } else {
            style[property] = value;
            sheet.setStyle(row, column, style);
        }
    });
    spread.resumePaint();
};
DesignerActionBase.prototype.selectionsRowCol = function (sheet, selections, func) {
    for (var index = 0; index < selections.length; index++) {
        var selection = selections[index];
        var row = selection.row == -1 ? 0 : selection.row, col = selection.col == -1 ? 0 : selection.col, rowCount = selection.rowCount, colCount = selection.colCount;
        for (var i = row; i < row + rowCount; i++) {
            for (var j = col; j < col + colCount; j++) {
                func(sheet, i, j);
            }
        }
    }
};
DesignerActionBase.prototype.saveStyle = function (property, selections) {
    var self = this, sheet = self._sheet;
    var original = self._original = {values: {}, styles: {}, spans: {}};
    self.execInSelections(sheet, property, function (sheet, row, column) {
        var style = sheet.getStyle(row, column);
        var value = sheet.getValue(row, column);
        var activeKey = self.getKey(row, column);
        original.values[activeKey] = value;
        original.styles[activeKey] = style;
    });
    for (var index = 0; index < selections.length; index++) {
        var selection = selections[index];
        var row = selection.row, col = selection.col, rowCount = selection.rowCount, colCount = selection.colCount;
        for (var i = row; i < row + rowCount; i++) {
            for (var j = col; j < col + colCount; j++) {
                var span = sheet.getSpan(i, j);
                if (span) {
                    original.spans[self.getKey(i, j)] = span;   // only save span
                    i += span.rowCount - 1;
                    j += span.colCount - 1;
                }
            }
        }
    }
};
DesignerActionBase.prototype.setValueStyleSpan = function () {
    var self = this, sheet = self._sheet,
        styles = self._original.styles, values = self._original.values, spans = self._original.spans;
    if (styles && values) {
        for (var key in styles) {
            var pos = self.getPosition(key), oldStyle = styles[key], oldValue = values[key];
            if (pos) {
                var row = pos.row, column = pos.column;
                sheet.setStyle(row, column, oldStyle);
                sheet.setValue(row, column, oldValue);
            }
        }
        for (var key in spans) {
            var pos = self.getPosition(key), oldSpan = spans[key];
            if (pos) {
                if (oldSpan !== null) {
                    var row = oldSpan.row, col = oldSpan.col, rowCount = oldSpan.rowCount, colCount = oldSpan.colCount;
                    sheet.addSpan(row, col, rowCount, colCount);
                }
                else {
                    var row = pos.row, col = pos.column;
                    sheet.removeSpan(row, col);
                }
            }
        }
    }
};
DesignerActionBase.prototype.getTextDecoration = function (sheet, row, column, style, value, flag) {
    var self = this;
    if (!style.textDecoration) {
        style.textDecoration = self.getActualDecoration(sheet, row, column);
    }
    var textDecoration = style.textDecoration;
    if (value) {
        textDecoration |= flag;
    } else {
        textDecoration ^= flag;
    }
    return textDecoration;
};
DesignerActionBase.prototype.updateCommentProperty = function (comment, property, oldValue, value) {
    if (comment) {
        var spread = this._spread, original = this._original = {};
        spread.suspendPaint();
        original.value = oldValue;              //only hold over one property
        comment[property](value);
        spread.resumePaint();
    }
};
DesignerActionBase.prototype.undoUpdateCommentProperty = function (comment, property) {
    if (comment) {
        var spread = this._spread;
        var value = this._original.value;
        spread.suspendPaint();
        comment[property](value);
        spread.resumePaint();
    }
    return true;
};

function SetFormulaSparklineAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._row = options.row;
    this._col = options.col;
    this._formula = options.formula;
}
setBaseClass(SetFormulaSparklineAction, DesignerActionBase);
SetFormulaSparklineAction.prototype.canExecute = function () {
    return true;
};
SetFormulaSparklineAction.prototype.undo = function () {
    var spread = this._spread, sheet = this._sheet, formulas = this._original.formulas;
    spread.suspendPaint();
    if (formulas) {
        for (var key in formulas) {
            var pos = this.getPosition(key), oldFormula = formulas[key];
            if (pos) {
                var row = pos.row, column = pos.column;
                sheet.setFormula(row, column, oldFormula);
            }
        }
    }
    this.setValueStyleSpan();
    spread.resumePaint();
    return true;
};
SetFormulaSparklineAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action, spread = self._spread, row = self._row, col = self._col, formulaStr = self._formula;
    var original = self._original = {values: {}, styles: {}, spans: {}, formulas: {}};
    var activeKey = self.getKey(row, col);
    var value = sheet.getValue(row, col), style = sheet.getStyle(row, col), span = sheet.getSpan(row, col), formula = sheet.getFormula(row, col);
    spread.suspendPaint();
    original.values[activeKey] = value;
    original.styles[activeKey] = style;
    original.spans[activeKey] = span;
    original.formulas[activeKey] = formula;
    sheet.setFormula(row, col, formulaStr);
    sheet.setActiveCell(row, col);
    spread.resumePaint();
};

function SetCommentLockTextAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "lockText";
}
setBaseClass(SetCommentLockTextAction, DesignerActionBase);
SetCommentLockTextAction.prototype.canExecute = function () {
    return true;
};
SetCommentLockTextAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentLockTextAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var lockText = comment.lockText();
    self.updateCommentProperty(comment, property, lockText, value)
};

function SetCommentDynamicSizeAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "dynamicSize";
}
setBaseClass(SetCommentDynamicSizeAction, DesignerActionBase);
SetCommentDynamicSizeAction.prototype.canExecute = function () {
    return true;
};
SetCommentDynamicSizeAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentDynamicSizeAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var dynamicSize = comment.dynamicSize();
    self.updateCommentProperty(comment, property, dynamicSize, value)
};

function SetCommentDynamicMoveAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "dynamicMove";
}
setBaseClass(SetCommentDynamicMoveAction, DesignerActionBase);
SetCommentDynamicMoveAction.prototype.canExecute = function () {
    return true;
};
SetCommentDynamicMoveAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentDynamicMoveAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var dynamicMove = comment.dynamicMove();
    self.updateCommentProperty(comment, property, dynamicMove, value)
};

function SetCommentShowShadowAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "showShadow";
}
setBaseClass(SetCommentShowShadowAction, DesignerActionBase);
SetCommentShowShadowAction.prototype.canExecute = function () {
    return true;
};
SetCommentShowShadowAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentShowShadowAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var showShadow = comment.showShadow();
    self.updateCommentProperty(comment, property, showShadow, value)
};

function SetCommentPaddingAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
}
setBaseClass(SetCommentPaddingAction, DesignerActionBase);
SetCommentPaddingAction.prototype.canExecute = function () {
    return true;
};
SetCommentPaddingAction.prototype.undo = function () {
    var self = this, spread = self._sheet, comment = self._comment;
    var original = self._original;
    spread.suspendPaint();
    if (comment) {
        var value = original.styles;
        if (value) {
            comment.padding(new GC.Spread.Sheets.Padding(parseInt(value.left, 10), parseInt(value.top, 10), parseInt(value.right, 10), parseInt(value.bottom, 10)));
        } else {
            comment.padding(null);
        }
    }
    spread.resumePaint();
    return true;
};
SetCommentPaddingAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var spread = self._sheet, comment = self._comment, value = self._value;
    var original = self._original = {styles: {}};
    spread.suspendPaint();
    if (comment && value) {
        var padding = comment.padding();
        original.styles = padding;
        var para = value.split(",");
        if (para.length === 1) {
            comment.padding(new GC.Spread.Sheets.Comments.Padding(parseInt(para[0], 10)));
        } else if (para.length === 4) {
            comment.padding(new GC.Spread.Sheets.Comments.Padding(parseInt(para[0], 10), parseInt(para[1], 10), parseInt(para[2], 10), parseInt(para[3], 10)));
        }
    }
    spread.resumePaint();
};

function SetCommentDisplayModeAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "displayMode";
}
setBaseClass(SetCommentDisplayModeAction, DesignerActionBase);
SetCommentDisplayModeAction.prototype.canExecute = function () {
    return true;
};
SetCommentDisplayModeAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentDisplayModeAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var displayMode = comment.displayMode();
    self.updateCommentProperty(comment, property, displayMode, value)
};

function SetCommentOpacityAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "opacity";
}
setBaseClass(SetCommentOpacityAction, DesignerActionBase);
SetCommentOpacityAction.prototype.canExecute = function () {
    return true;
};
SetCommentOpacityAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentOpacityAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var opacity = comment.opacity();
    self.updateCommentProperty(comment, property, opacity, value)
};

function SetCommentForeColorAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "foreColor";
}
setBaseClass(SetCommentForeColorAction, DesignerActionBase);
SetCommentForeColorAction.prototype.canExecute = function () {
    return true;
};
SetCommentForeColorAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentForeColorAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var foreColor = comment.foreColor();
    self.updateCommentProperty(comment, property, foreColor, value)
};

function SetCommentBackColorAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "backColor";
}
setBaseClass(SetCommentBackColorAction, DesignerActionBase);
SetCommentBackColorAction.prototype.canExecute = function () {
    return true;
};
SetCommentBackColorAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentBackColorAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var backColor = comment.backColor();
    self.updateCommentProperty(comment, property, backColor, value)
};

function SetCommentHorizontalAlignAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "horizontalAlign";
}
setBaseClass(SetCommentHorizontalAlignAction, DesignerActionBase);
SetCommentHorizontalAlignAction.prototype.canExecute = function () {
    return true;
};
SetCommentHorizontalAlignAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentHorizontalAlignAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var horizontalAlign = comment.horizontalAlign();
    self.updateCommentProperty(comment, property, horizontalAlign, value)
};

function SetCommentBorderColorAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "borderColor";
}
setBaseClass(SetCommentBorderColorAction, DesignerActionBase);
SetCommentBorderColorAction.prototype.canExecute = function () {
    return true;
};
SetCommentBorderColorAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentBorderColorAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var borderColor = comment.borderColor();
    self.updateCommentProperty(comment, property, borderColor, value)
};

function SetCommentBorderStyleAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "borderStyle";
}
setBaseClass(SetCommentBorderStyleAction, DesignerActionBase);
SetCommentBorderStyleAction.prototype.canExecute = function () {
    return true;
};
SetCommentBorderStyleAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentBorderStyleAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var borderStyle = comment.borderStyle();
    self.updateCommentProperty(comment, property, borderStyle, value)
};

function SetCommentBorderWidthAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "borderWidth";
}
setBaseClass(SetCommentBorderWidthAction, DesignerActionBase);
SetCommentBorderWidthAction.prototype.canExecute = function () {
    return true;
};
SetCommentBorderWidthAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentBorderWidthAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var borderWidth = comment.borderWidth();
    self.updateCommentProperty(comment, property, borderWidth, value)
};

function SetCommentTextDecorationAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "textDecoration";
}
setBaseClass(SetCommentTextDecorationAction, DesignerActionBase);
SetCommentTextDecorationAction.prototype.canExecute = function () {
    return true;
};
SetCommentTextDecorationAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentTextDecorationAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var textDecoration = comment.textDecoration();
    self.updateCommentProperty(comment, property, textDecoration, textDecoration ^ value)
};

function SetCommentFontWeightAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "fontWeight";
}
setBaseClass(SetCommentFontWeightAction, DesignerActionBase);
SetCommentFontWeightAction.prototype.canExecute = function () {
    return true;
};
SetCommentFontWeightAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentFontWeightAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var fontWeight = comment.fontWeight();
    self.updateCommentProperty(comment, property, fontWeight, value)
};

function SetCommentFontStyleAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "fontStyle";
}
setBaseClass(SetCommentFontStyleAction, DesignerActionBase);
SetCommentFontStyleAction.prototype.canExecute = function () {
    return true;
};
SetCommentFontStyleAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentFontStyleAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var fontStyle = comment.fontStyle();
    self.updateCommentProperty(comment, property, fontStyle, value)
};

function SetCommentFontFamilyAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "fontFamily";
}
setBaseClass(SetCommentFontFamilyAction, DesignerActionBase);
SetCommentFontFamilyAction.prototype.canExecute = function () {
    return true;
};
SetCommentFontFamilyAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentFontFamilyAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var fontFamily = comment.fontFamily();
    self.updateCommentProperty(comment, property, fontFamily, value)
};

function SetCommentFontSizeAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._comment = options.comment;
    this._value = options.value;
    this._property = "fontSize"
}
setBaseClass(SetCommentFontSizeAction, DesignerActionBase);
SetCommentFontSizeAction.prototype.canExecute = function () {
    return true;
};
SetCommentFontSizeAction.prototype.undo = function () {
    return this.undoUpdateCommentProperty(this._comment, this._property);
};
SetCommentFontSizeAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var comment = self._comment, value = self._value, property = self._property;
    var fontSize = comment.fontSize();
    self.updateCommentProperty(comment, property, fontSize, value)
};

function InsertCommentAction(spread) {
    DesignerActionBase.call(this, spread);
}
setBaseClass(InsertCommentAction, DesignerActionBase);
InsertCommentAction.prototype.canExecute = function () {
    return true;
};
InsertCommentAction.prototype.undo = function () {
    var self = this, sheet = self._sheet, spread = self._sheet;
    var selection = self._selections[self._selections.length - 1];
    var row = selection.row, col = selection.col;
    var comment = sheet.getComment(row, col);
    spread.suspendPaint();
    if (comment) {
        sheet.setComment(row, col, null);
    }
    spread.resumePaint();
    return true;
};
InsertCommentAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var sheet = self._sheet, spread = self._spread;
    var selection = self._selections[self._selections.length - 1];
    var row = selection.row, col = selection.col;
    sheet.comments.add(row, col);
    var comment = sheet.comments.get(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex());
    if (comment) {
        comment.commentState(2);
    }

};

function SetTextBoldAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._value = options.value;
    this._property = "font";
}
setBaseClass(SetTextBoldAction, DesignerActionBase);
SetTextBoldAction.prototype.canExecute = function () {
    return true;
};
SetTextBoldAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
SetTextBoldAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var value = !!self._value ? "bold" : "normal", property = self._property, attribute = "font-weight";
    self.setStyle(attribute, property, value);
};

function SetTextItalicAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._value = options.value;
    this._property = "font";
}
setBaseClass(SetTextItalicAction, DesignerActionBase);
SetTextItalicAction.prototype.canExecute = function () {
    return true;
};
SetTextItalicAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
SetTextItalicAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var value = !!self._value ? "italic" : "normal", property = self._property, attribute = "font-style";
    self.setStyle(attribute, property, value);
};

function SetTextUnderlineAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._value = options.value;
    this._property = "textDecoration";
}
setBaseClass(SetTextUnderlineAction, DesignerActionBase);
SetTextUnderlineAction.prototype.canExecute = function () {
    return true;
};
SetTextUnderlineAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
SetTextUnderlineAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var value = !!self._value, property = self._property, attribute = property;
    var flag = GC.Spread.Sheets.TextDecorationType.underline;
    self.setStyle(attribute, property, value, self.getTextDecoration, [flag]);
};

function SetTextStrikethroughAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._value = options.value;
    this._property = "textDecoration";
}
setBaseClass(SetTextStrikethroughAction, DesignerActionBase);
SetTextStrikethroughAction.prototype.canExecute = function () {
    return true;
};
SetTextStrikethroughAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
SetTextStrikethroughAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var value = !!self._value, property = self._property, attribute = property;
    var flag = GC.Spread.Sheets.TextDecorationType.lineThrough;
    self.setStyle(attribute, property, value, self.getTextDecoration, [flag]);
};

function SetTextOverlineAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._value = options.value;
    this._property = "textDecoration";
}
setBaseClass(SetTextOverlineAction, DesignerActionBase);
SetTextOverlineAction.prototype.canExecute = function () {
    return true;
};
SetTextOverlineAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
SetTextOverlineAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var value = !!self._value, property = self._property, attribute = property;
    var flag = GC.Spread.Sheets.TextDecorationType.overline;
    self.setStyle(attribute, property, value, self.getTextDecoration, [flag]);
};

function SetTextFontFamilyAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._value = options.value;
    this._property = "font";
}
setBaseClass(SetTextFontFamilyAction, DesignerActionBase);
SetTextFontFamilyAction.prototype.canExecute = function () {
    return true;
};
SetTextFontFamilyAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
SetTextFontFamilyAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var value = self._value, property = self._property, attribute = "font-family";
    self.setStyle(attribute, property, value);
};

function SetTextFontSizeAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._value = options.value;
    this._property = "font";
}
setBaseClass(SetTextFontSizeAction, DesignerActionBase);
SetTextFontSizeAction.prototype.canExecute = function () {
    return true;
};
SetTextFontSizeAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
SetTextFontSizeAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var value = self._value, property = self._property, attribute = "font-size";
    self.setStyle(attribute, property, value);
};

function SetTextBackColorAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._value = options.value;
    this._property = "backColor";
}
setBaseClass(SetTextBackColorAction, DesignerActionBase);
SetTextBackColorAction.prototype.canExecute = function () {
    return true;
};
SetTextBackColorAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
SetTextBackColorAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var value = self._value, property = self._property, attribute = "backColor";
    self.setStyle(attribute, property, value);
};

function SetTextForeColorAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._value = options.value;
    this._property = "foreColor";
}
setBaseClass(SetTextForeColorAction, DesignerActionBase);
SetTextForeColorAction.prototype.canExecute = function () {
    return true;
};
SetTextForeColorAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
SetTextForeColorAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var value = self._value, property = self._property, attribute = "foreColor";
    self.setStyle(attribute, property, value);
};

function SetBorderAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._value = options;
}
setBaseClass(SetBorderAction, DesignerActionBase);
SetBorderAction.prototype.canExecute = function () {
    return true;
};
SetBorderAction.prototype.undo = function () {
    var self = this, sheet = self._sheet, spread = self._spread, styles = self._original.styles, selections = self._selections;
    spread.suspendPaint();
    for (var i = 0; i < selections.length; i++) {
        sheet.setBorder(selections[i], 0, {all: true});
        self.setBorderStyle(selections[i], {all: true});
    }
    selections = sheet.getSelections();
    var selection = self._original.ranges;
    if (styles) {
        for (var key in styles) {
            var pos = self.getPosition(key),
                oldValue = styles[key];
            if (pos) {
                selection.row = pos.row;
                selection.col = pos.column;
                selection.rowCount = 1;
                selection.colCount = 1;
                if (oldValue.borderBottom) {
                    sheet.setBorder(selection, oldValue.borderBottom, {bottom: true});
                    self.setBorderStyle(selection, {bottom: true});
                }
                if (oldValue.borderTop) {
                    sheet.setBorder(selection, oldValue.borderTop, {top: true});
                    self.setBorderStyle(selection, {top: true});
                }
                if (oldValue.borderLeft) {
                    sheet.setBorder(selection, oldValue.borderLeft, {left: true});
                    self.setBorderStyle(selection, {left: true});
                }
                if (oldValue.borderRight) {
                    sheet.setBorder(selection, oldValue.borderRight, {right: true});
                    self.setBorderStyle(selection, {right: true});
                }
            }
        }
    }
    selection = selections[selections.length - 1];    //recover selection options.
    spread.resumePaint();
    return true;
};
SetBorderAction.prototype.execute = function (context, options, isUndo) {
    var self = this, sheet = self._sheet, spread = self._spread, value = self._value, selections = self._selections;
    var original = self._original = {ranges: [], styles: {}};
    spread.suspendPaint();
    self.selectionsRowCol(sheet, selections, function (sheet, row, column) {
        var activeCell = sheet.getCell(row, column);
        var borderLeft = activeCell.borderLeft(), borderRight = activeCell.borderRight(), borderTop = activeCell.borderTop(), borderBottom = activeCell.borderBottom();
        if (borderLeft === undefined) {
            borderLeft = sheet.getCell(row, column - 1).borderRight();
        }
        if (borderRight === undefined) {
            borderRight = sheet.getCell(row, column + 1).borderLeft();
        }
        if (borderTop === undefined) {
            borderTop = sheet.getCell(row - 1, column).borderBottom();
        }
        if (borderBottom === undefined) {
            borderBottom = sheet.getCell(row + 1, column).borderTop();
        }
        original.styles[self.getKey(row, column)] = {
            borderLeft: borderLeft, borderTop: borderTop, borderRight: borderRight, borderBottom: borderBottom
        }
    });     // if activeCell(row, col).borderRight exist, the activeCell(row+1, col).borderLeft can't get.
    for (var temp = value.length; temp > 0; temp--) {
        for (var i = 0; i < selections.length; i++) {
            var selection = selections[i];
            var activeValue = value[temp - 1];
            sheet.setBorder(selection, activeValue.lineBorder, activeValue.value);
            self.setBorderStyle(selection, activeValue.value);
        }
    }
    spread.resumePaint();
};
SetBorderAction.prototype.setBorderStyle = function (range, index) {
    var self = options.__action;
    var sheet = self._sheet, value = index, outline = value.all || value.outline, rowCount = sheet.getRowCount(), columnCount = sheet.getColumnCount(), startRow = range.row, endRow = startRow + range.rowCount - 1, startCol = range.col, endCol = startCol + range.colCount - 1;
    if ((startCol > 0) && (outline || value.left)) {
        sheet.getCells(startRow, startCol - 1, endRow, startCol - 1).borderRight(undefined);
    }
    if ((startRow > 0) && (outline || value.top)) {
        sheet.getCells(startRow - 1, startCol, startRow - 1, endCol).borderBottom(undefined);
    }
    if ((endCol < columnCount - 1) && (outline || value.right)) {
        sheet.getCells(startRow, endCol + 1, endRow, endCol + 1).borderLeft(undefined);
    }
    if ((endRow < rowCount - 1) && (outline || value.bottom)) {
        sheet.getCells(endRow + 1, startCol, endRow + 1, endCol).borderTop(undefined);
    }
};

function SetTextAlignsAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._value = options.value.value;
    this._property = options.value.align;
}
setBaseClass(SetTextAlignsAction, DesignerActionBase);
SetTextAlignsAction.prototype.canExecute = function () {
    return true;
};
SetTextAlignsAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
SetTextAlignsAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var value, property = self._property, attribute = property;
    if (["top", "middle", "bottom"].indexOf(self._value) >= 0) {
        value = ["top", "middle", "bottom"].indexOf(self._value);
    }
    if (["left", "center", "right"].indexOf(self._value) >= 0) {
        value = ["left", "center", "right"].indexOf(self._value);
    }
    self.setStyle(attribute, property, value);
};

function SetCellTypeAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._value = options;
    this._property = 'cellType';
}
setBaseClass(SetCellTypeAction, DesignerActionBase);
SetCellTypeAction.prototype.canExecute = function () {
    return true;
};
SetCellTypeAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
SetCellTypeAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var value = self._value, property = self._property, attribute = property;
    self.setStyle(attribute, property, value);
};

function SetWrapTextAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._value = options.value;
    this._property = "wordWrap";
}
setBaseClass(SetWrapTextAction, DesignerActionBase);
SetWrapTextAction.prototype.canExecute = function () {
    return true;
};
SetWrapTextAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
SetWrapTextAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var value = self._value, property = self._property, attribute = property;
    self.setStyle(attribute, property, value);
};

function SetMergeCenterAction(spread, options) {
    DesignerActionBase.call(this, spread);
    //self = this;
    this._value = options;
}
setBaseClass(SetMergeCenterAction, DesignerActionBase);
SetMergeCenterAction.prototype.canExecute = function () {
    return true;
};
SetMergeCenterAction.prototype.undo = function () {
    var self = this, sheet = self._sheet, spread = self._spread, items = self._original.items;
    var isMerge = self._value;

    spread.suspendPaint();
    if (isMerge) {
        // merged cells, unmerge first
        self._selectionRanges.forEach(function (range) {
            sheet.removeSpan(range.row, range.col);
        });
    }
    // restore old spans and style
    if (items) {
        for (var key in items) {
            var pos = self.getPosition(key), oldItems = items[key];
            if (pos) {
                if (oldItems) {
                    var oldSpan = oldItems.span;
                    var row = oldSpan.row, col = oldSpan.col, rowCount = oldSpan.rowCount, colCount = oldSpan.colCount;
                    sheet.addSpan(row, col, rowCount, colCount);
                    sheet.setStyle(row, col, oldItems.style);
                }
            }
        }
    }

    spread.resumePaint();

    return true;
};
SetMergeCenterAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var sheet = self._sheet, spread = self._spread, selectionRanges = self._selectionRanges;
    var isMerge = self._value;
    var original = self._original = {items: {}}, items = original.items, spans = [];

    spread.suspendPaint();

    selectionRanges.forEach(function (range) {
        var row = range.row, col = range.col, rowCount = range.rowCount, colCount = range.colCount;
        for (var i = 0, r; i < rowCount; i++) {
            r = row + i;
            for (var j = 0, c; j < colCount; j++) {
                c = col + j;
                if (!spans.some(function (range) {
                        return range.contains(r, c);
                    })) {
                    var span = sheet.getSpan(r, c);
                    if (span) {
                        spans.push(span);
                        items[self.getKey(r, c)] = {span: span, style: sheet.getStyle(r, c)};
                    }
                }
            }
        }
    });

    if (isMerge) {
        // do merge and update style
        selectionRanges.forEach(function (range) {
            var row = range.row, col = range.col, rowCount = range.rowCount, colCount = range.colCount;
            sheet.addSpan(row, col, rowCount, colCount);
            var style = sheet.getStyle(row, col);
            if (!style) {
                style = new GC.Spread.Sheets.Style();
            }
            style.hAlign = 1;
            sheet.setStyle(row, col, style);
        });
    } else {
        // unmerge
        spans.forEach(function (range) {
            sheet.removeSpan(range.row, range.col);
        });
    }

    spread.resumePaint();
};

function IndentAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._value = options.value;
    this._property = "textIndent";
}
setBaseClass(IndentAction, DesignerActionBase);
IndentAction.prototype.canExecute = function () {
    return true;
};
IndentAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
IndentAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var value = self._value, property = self._property, attribute = property;
    self.setStyle(attribute, property, value, getTextIndent)
    function getTextIndent(sheet, row, column, style, value) {
        var indent = style.textIndent;
        if (isNaN(indent))
            indent = 0;
        indent += value;
        if (indent < 0) {
            indent = 0;
        }
        return indent;
    }
};

function SetCellFormatAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._value = options.value;
    this._property = "formatter";
}
setBaseClass(SetCellFormatAction, DesignerActionBase);
SetCellFormatAction.prototype.canExecute = function () {
    return true;
};
SetCellFormatAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
SetCellFormatAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var value = self._value, property = self._property, attribute = property;
    self.setStyle(attribute, property, value);
};

function IncreaseDecimalAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._property = "formatter";
}
setBaseClass(IncreaseDecimalAction, DesignerActionBase);
IncreaseDecimalAction.prototype.canExecute = function () {
    return true;
};
IncreaseDecimalAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
IncreaseDecimalAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var sheet = self._sheet, spread = self._spread, property = self._property, attribute = property, selection = self._selections[self._selections.length - 1];
    var original = self._original = {styles: {}};
    spread.suspendPaint();
    self.execInSelections(sheet, attribute, function (sheet, row, column) {
        var style = sheet.getStyle(row, column);
        original.styles[self.getKey(row, column)] = style && style[property];     // save related information, use row, column as the key
        if (!style) {
            style = new GC.Spread.Sheets.Style();
        }
        var activeCell = sheet.getCell(selection.row, selection.col);
        var activeCellValue = activeCell.value();
        var activeCellFormatter = activeCell.formatter();
        var activeCellText = activeCell.text();
        if (activeCellValue) {
            var formatString = null;
            var zero = "0";
            var numberSign = "#";
            var decimalPoint = ".";
            var zeroPointZero = "0" + decimalPoint + "0";
            var scientificNotationCheckingFormatter = self.getScientificNotationCheckingFormatter(activeCellFormatter);
            if (!activeCellFormatter || ((activeCellFormatter == "General" || (scientificNotationCheckingFormatter && (scientificNotationCheckingFormatter.indexOf("E") >= 0 || scientificNotationCheckingFormatter.indexOf('e') >= 0))))) {
                if (!isNaN(activeCellValue)) {
                    var result = activeCellText.split('.');
                    if (result.length == 1) {
                        if (result[0].indexOf('E') >= 0 || result[0].indexOf('e') >= 0)
                            formatString = zeroPointZero + "E+00";
                        else
                            formatString = zeroPointZero;
                    }
                    else if (result.length == 2) {
                        result[0] = "0";
                        var isScience = false;
                        var sb = "";
                        for (var i = 0; i < result[1].length + 1; i++) {
                            sb = sb + '0';
                            if (i < result[1].length && (result[1].charAt(i) == 'e' || result[1].charAt(i) == 'E')) {
                                isScience = true;
                                break;
                            }
                        }
                        if (isScience)
                            sb = sb + "E+00";
                        if (sb) {
                            result[1] = sb.toString();
                            formatString = result[0] + decimalPoint + result[1];
                        }
                    }
                }
            }
            else {
                formatString = activeCellFormatter;
                if (formatString) {
                    var formatters = formatString.split(';');
                    for (var i = 0; i < formatters.length && i < 2; i++) {
                        if (formatters[i] && formatters[i].indexOf("/") < 0 && formatters[i].indexOf(":") < 0 && formatters[i].indexOf("?") < 0) {
                            var indexOfDecimalPoint = formatters[i].lastIndexOf(decimalPoint);
                            if (indexOfDecimalPoint != -1) {
                                formatters[i] = formatters[i].slice(0, indexOfDecimalPoint + 1) + zero + formatters[i].slice(indexOfDecimalPoint + 1);
                            }
                            else {
                                var indexOfZero = formatters[i].lastIndexOf(zero);
                                var indexOfNumberSign = formatters[i].lastIndexOf(numberSign);
                                var insertIndex = indexOfZero > indexOfNumberSign ? indexOfZero : indexOfNumberSign;
                                if (insertIndex >= 0)
                                    formatters[i] = formatters[i].slice(0, insertIndex + 1) + decimalPoint + zero + formatters[i].slice(insertIndex + 1);
                            }
                        }
                    }
                    formatString = formatters.join(";");
                }
            }
            style[property] = formatString;
            sheet.setStyle(row, column, style);
        }
    })
    spread.resumePaint();
};
IncreaseDecimalAction.prototype.getScientificNotationCheckingFormatter = function (formatter) {
    if (!formatter) {
        return formatter;
    }
    var self = this, i;
    var signalQuoteSubStrings = self.getSubStrings(formatter, '\'', '\'');
    for (i = 0; i < signalQuoteSubStrings.length; i++) {
        formatter = formatter.replace(signalQuoteSubStrings[i], '');
    }
    var doubleQuoteSubStrings = self.getSubStrings(formatter, '\"', '\"');
    for (i = 0; i < doubleQuoteSubStrings.length; i++) {
        formatter = formatter.replace(doubleQuoteSubStrings[i], '');
    }
    var colorStrings = this.getSubStrings(formatter, '[', ']');
    for (i = 0; i < colorStrings.length; i++) {
        formatter = formatter.replace(colorStrings[i], '');
    }
    return formatter;
};
IncreaseDecimalAction.prototype.getSubStrings = function (source, beginChar, endChar) {
    if (!source) {
        return [];
    }
    var subStrings = [], tempSubString = '', inSubString = false;
    for (var index = 0; index < source.length; index++) {
        if (!inSubString && source[index] === beginChar) {
            inSubString = true;
            tempSubString = source[index];
            continue;
        }
        if (inSubString) {
            tempSubString += source[index];
            if (source[index] === endChar) {
                subStrings.push(tempSubString);
                tempSubString = "";
                inSubString = false;
            }
        }
    }
    return subStrings;
};

function DecreaseDecimalAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._property = "formatter";
}
setBaseClass(DecreaseDecimalAction, DesignerActionBase);
DecreaseDecimalAction.prototype.canExecute = function () {
    return true;
};
DecreaseDecimalAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
DecreaseDecimalAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var sheet = self._sheet, spread = self._spread, property = self._property, attribute = property, selection = self._selections[self._selections.length - 1];
    var original = self._original = {styles: {}};
    spread.suspendPaint();
    self.execInSelections(sheet, attribute, function (sheet, row, column) {
        var style = sheet.getStyle(row, column);
        original.styles[self.getKey(row, column)] = style && style[property];     // save related information, use row, column as the key
        if (!style) {
            style = new GC.Spread.Sheets.Style();
        }
        var activeCell = sheet.getCell(selection.row, selection.col);
        var activeCellValue = activeCell.value();
        var activeCellFormatter = activeCell.formatter();
        var activeCellText = activeCell.text();
        if (activeCellValue) {
            var decimalPoint = ".";
            var formatString = null;
            if (!activeCellFormatter || activeCellFormatter == "General") {
                if (!isNaN(activeCellValue)) {
                    var result = activeCellText.split('.');
                    if (result.length == 2) {
                        result[0] = "0";
                        var isScience = false;
                        var sb = "";
                        for (var i = 0; i < result[1].length - 1; i++) {
                            if ((i + 1 < result[1].length) && (result[1].charAt(i + 1) == 'e' || result[1].charAt(i + 1) == 'E')) {
                                isScience = true;
                                break;
                            }
                            sb = sb + ('0');
                        }
                        if (isScience)
                            sb = sb + ("E+00");
                        if (sb != null) {
                            result[1] = sb.toString();
                            formatString = result[0] + (result[1] !== "" ? decimalPoint + result[1] : "");
                        }
                    }
                }
            }
            else {
                formatString = activeCellFormatter;
                if (formatString) {
                    var formatters = formatString.split(';');
                    for (var i = 0; i < formatters.length && i < 2; i++) {
                        if (formatters[i] && formatters[i].indexOf("/") < 0 && formatters[i].indexOf(":") < 0 && formatters[i].indexOf("?") < 0) {
                            var indexOfDecimalPoint = formatters[i].lastIndexOf(decimalPoint);
                            if (indexOfDecimalPoint != -1 && indexOfDecimalPoint + 1 < formatters[i].length) {
                                formatters[i] = formatters[i].slice(0, indexOfDecimalPoint + 1) + formatters[i].slice(indexOfDecimalPoint + 2);
                                var tempString = indexOfDecimalPoint + 1 < formatters[i].length ? formatters[i].substr(indexOfDecimalPoint + 1, 1) : "";
                                if (tempString == "" || tempString != "0")
                                    formatters[i] = formatters[i].slice(0, indexOfDecimalPoint) + formatters[i].slice(indexOfDecimalPoint + 1);
                            }
                            else {
                            }
                        }
                    }
                    formatString = formatters.join(";");
                }
            }
            style.formatter = formatString;
            sheet.setStyle(row, column, style);
        }
    })
    spread.resumePaint();
};

function SetCellLockAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._value = options.value;
    this._property = "locked";
}
setBaseClass(SetCellLockAction, DesignerActionBase);
SetCellLockAction.prototype.canExecute = function () {
    return true;
};
SetCellLockAction.prototype.undo = function () {
    return this.undoSetStyle(this._property);
};
SetCellLockAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var value = self._value, property = self._property, attribute = property;
    self.setStyle(attribute, property, value);
};

function SetIsProtectAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._value = options.value;
}
setBaseClass(SetIsProtectAction, DesignerActionBase);
SetIsProtectAction.prototype.canExecute = function () {
    return true;
};
SetIsProtectAction.prototype.execute = function (context, options, isUndo) {
    // self._sheet.setIsProtected(self._value);
    var self = options.__action;
    self._sheet.options.isProtected = self._value;
};
SetIsProtectAction.prototype.canUndo = function (context, options, isUndo) {
    return false;
};

function ClearActionBase(spread) {
    DesignerActionBase.call(this, spread);
}
setBaseClass(ClearActionBase, DesignerActionBase);
ClearActionBase.prototype.clear = function (property, flag) {
    var self = this, sheet = self._sheet, spread = self._spread, selections = self._selections;
    spread.suspendPaint();
    self.saveStyle(property, selections);
    for (var i in selections) {
        var selection = selections[i];
        sheet.clear(selection.row, selection.col, selection.rowCount, selection.colCount, 3, flag);
        self.clearSpansInSelection(sheet, selection);
    }
    spread.resumePaint();
};
ClearActionBase.prototype.undoSetClear = function () {
    var spread = this._spread;
    spread.suspendPaint();
    this.setValueStyleSpan();
    spread.resumePaint();
    return true;
};
ClearActionBase.prototype.clearSpansInSelection = function (sheet, selection) {
    if (sheet && selection) {
        var ranges = new Array(), row = selection.row, col = selection.col, rowCount = selection.rowCount, colCount = selection.colCount;
        sheet.getSpans().forEach(function (range) {
            if (range.intersect(row, col, rowCount, colCount)) {
                ranges.push(range);
            }
        });
        ranges.forEach(function (range) {
            sheet.removeSpan(range.row, range.col);
        });
    }
};

function ClearAllAction(spread) {
    ClearActionBase.call(this, spread);
    this._property = "clearall";
}
setBaseClass(ClearAllAction, ClearActionBase);
ClearAllAction.prototype.canExecute = function () {
    return true;
};
ClearAllAction.prototype.undo = function () {
    return this.undoSetClear();
};
ClearAllAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var property = self._property, flag = 64 | 32 | 16 | 8 | 4 | 2 | 1;
    self.clear(property, flag);
};

function ClearFormattingAction(spread) {
    ClearActionBase.call(this, spread);
    this._property = "clearformatting";
}
setBaseClass(ClearFormattingAction, ClearActionBase);
ClearFormattingAction.prototype.canExecute = function () {
    return true;
};
ClearFormattingAction.prototype.undo = function () {
    return this.undoSetClear();
};
ClearFormattingAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var property = self._property, flag = 2;
    self.clear(property, flag);
};

function ClearDataAction(spread) {
    ClearActionBase.call(this, spread);
    this._property = "cleatData";
}
setBaseClass(ClearDataAction, ClearActionBase);
ClearDataAction.prototype.canExecute = function () {
    return true;
};
ClearDataAction.prototype.undo = function () {
    return this.undoSetClear();
};
ClearDataAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var property = self._property, flag = 1;
    self.clear(property, flag = 1);
};

function TableActionBase(spread) {
    DesignerActionBase.call(this, spread);
}
setBaseClass(TableActionBase, DesignerActionBase);
TableActionBase.prototype.clearMergeInRange = function (range) {
    var self = this, sheet = self._sheet;
    var col = range.col == -1 ? 0 : range.col, row = range.row == -1 ? 0 : range.row, rowCount = range.rowCount, colCount = range.colCount;
    for (var i = 0; i < rowCount; i++) {
        for (var j = 0; j < colCount; j++) {
            sheet.removeSpan(row + i, col + j);
        }
    }
};
TableActionBase.prototype.getNewTableName = function () {
    var suffix = 0;
    for (var sheetIndex = 0; sheetIndex < this._spread.sheets.length; sheetIndex++) {
        // var tables = this._spread.sheets[sheetIndex].getTables();
        var tables = this._spread.sheets[sheetIndex].tables.all();
        for (var tableIndex = 0; tableIndex < tables.length; tableIndex++) {
            var tableName = tables[tableIndex].name();
            if (tableName && tableName.length > 5 && tableName.substring(0, 5).toLowerCase() == 'table') {
                var temp = tableName.substring(5, tableName.length);
                if ($.isNumeric(temp) && Number(temp) >= suffix) {
                    suffix = Number(temp);
                }
            }
        }
    }
    return 'Table' + (suffix + 1).toString();
};

function AddTableAction(spread) {
    TableActionBase.call(this, spread);
    this._property = "addtable";
}
setBaseClass(AddTableAction, TableActionBase);
AddTableAction.prototype.canExecute = function () {
    return true;
};
AddTableAction.prototype.undo = function () {
    var self = this, sheet = self._sheet, spread = self._spread;
    var selection = self._selections[0];
    var row = selection.row == -1 ? 0 : selection.row;
    var col = selection.col == -1 ? 0 : selection.col;
    var table = sheet.findTable(row, col);
    spread.suspendPaint();
    sheet.removeTable(table);
    self.setValueStyleSpan();
    spread.resumePaint();
    return true;
};
AddTableAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var sheet = self._sheet, spread = self._spread, property = self._property;
    var selections = self._selections, selection = selections[0];
    var row = selection.row == -1 ? 0 : selection.row, col = selection.col == -1 ? 0 : selection.col, rowCount = selection.rowCount, colCount = selection.colCount;
    spread.suspendPaint();
    self.saveStyle(property, selections);
    self.clearMergeInRange(selection);
    // sheet.addTable(self.getNewTableName(), row, col, rowCount, colCount);
    var rc = rowCount === 1 ? 2 : rowCount;
    sheet.tables.add(self.getNewTableName(), row, col, rc, colCount);
    spread.resumePaint();
};

function AddPictureAction(spread, options) {
    DesignerActionBase.call(this, spread);
    this._name = options.name;
    this._pictureUrl = options.url;
}
setBaseClass(AddPictureAction, DesignerActionBase);
AddPictureAction.prototype.canExecute = function () {
    return true;
};
AddPictureAction.prototype.undo = function () {
    var self = this, sheet = self._sheet, spread = self._spread;
    spread.suspendPaint();
    var picture = sheet.getPictures();
    if (picture) {
        var name = picture[picture.length - 1]._name;
    }
    sheet.removePicture(name);
    spread.resumePaint();
    return true;
};
// AddPictureAction.prototype.execute = function (context, options, isUndo) {
//     var sheet = self._sheet, spread = self._spread, pictureUrl = self._pictureUrl;
//     var selection = self._selections[0];
//     var PICTURE_ROWCOUNT = 8, PICTURE_COLUMNCOUNT = 5;
//     spread.suspendPaint();
//     if (pictureUrl != "" && selection) {
//         var name = self._name;
//         var row = selection.row, col = selection.col, rowCount = sheet.getRowCount(), columnCount = sheet.getColumnCount(),
//             endRow = row + PICTURE_ROWCOUNT, endColumn = col + PICTURE_COLUMNCOUNT;
//         if (endRow > rowCount) {
//             endRow = rowCount - 1;
//             row = endRow - PICTURE_ROWCOUNT;
//         }
//         if (endColumn > columnCount) {
//             endColumn = columnCount - 1;
//             col = endColumn - PICTURE_COLUMNCOUNT;
//         }
//         // var picture = sheet.addPicture(name, pictureUrl, row, col, endRow, endColumn).backColor("#FFFFFF").borderColor("#000000").borderStyle("solid").borderWidth(1).borderRadius(3);
//         var picture = sheet.pictures.add(name, pictureUrl, row, col, endRow, endColumn).backColor("#FFFFFF").borderColor("#000000").borderStyle("solid").borderWidth(1).borderRadius(3);
//     }
//     spread.focus();
//     picture.isSelected(true);
//     spread.resumePaint();
// };

AddPictureAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var sheet = self._sheet, spread = self._spread, pictureUrl = self._pictureUrl;
    var selection = self._selections[0];
    spread.suspendPaint();
    if (pictureUrl != "" && selection) {
        var name = self._name;
        var startRow = selection.row, startCol = selection.col,
            defaults = sheet.defaults, rowHeight = defaults.rowHeight, colWidth = defaults.colWidth;
        var picture = sheet.pictures.add(name, pictureUrl, startCol * colWidth, startRow * rowHeight);
    }
    spread.focus();
    picture.isSelected(true);
    spread.resumePaint();
};


// Actions from designer w/ modify
function InsertAndDeleteBase(spread) {
    DesignerActionBase.call(this, spread);
}
setBaseClass(InsertAndDeleteBase, DesignerActionBase);
InsertAndDeleteBase.prototype.canUndo = function () {
    return false;
};
InsertAndDeleteBase.prototype.canDoInsertOrDeleteRow = function () {
    return !this._selections.some(function (selection, index, array) {
        return selection.row === -1;
    });
};
InsertAndDeleteBase.prototype.canDoInsertOrDeleteColumn = function () {
    return !this._selections.some(function (selection, index, array) {
        return selection.col === -1;
    });
};
InsertAndDeleteBase.prototype.getSortedMergedSelections = function (byRow) {
    var ranges = getMergedSelections(this._selections, byRow);

    ranges.reverse();

    return ranges;
};
InsertAndDeleteBase.prototype.getSortedSelections = function (byRow) {
    return getSortedSelections(this._selections, byRow);
};
InsertAndDeleteBase.prototype.processWithRowColumns = function (isRow, callback) {
    var sortedRanges = this.getSortedMergedSelections(isRow);
    sortedRanges.forEach(function (range) {
        var start = range.start, count = range.count;
        callback(start, count);
    });
};


function InsertRowsAction(spread) {
    InsertAndDeleteBase.call(this, spread);
}
setBaseClass(InsertRowsAction, InsertAndDeleteBase);
InsertRowsAction.prototype.canExecute = function () {
    return this.canDoInsertOrDeleteRow();
};
InsertRowsAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    self.processWithRowColumns(true, function (row, rowCount) {
        self._sheet.addRows(row, rowCount);
        util.setSpanStyleWhenInsertRowsColumns(self._sheet, row, -1, rowCount);
    });
};

function InsertColumnsAction(spread) {
    InsertAndDeleteBase.call(this, spread);
}
setBaseClass(InsertColumnsAction, InsertAndDeleteBase);
InsertColumnsAction.prototype.canExecute = function () {
    return this.canDoInsertOrDeleteColumn();
};
InsertColumnsAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    self.processWithRowColumns(false, function (col, colCount) {
        self._sheet.addColumns(col, colCount);
        util.setSpanStyleWhenInsertRowsColumns(self._sheet, -1, col, colCount);
    });
};


function InsertRightCellsAction(spread) {
    InsertAndDeleteBase.call(this, spread);
}
setBaseClass(InsertRightCellsAction, InsertAndDeleteBase);
InsertRightCellsAction.prototype.canExecute = function () {
    return true;
};
InsertRightCellsAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    if (getSelectionType(self._selections) === SelectionRangeType.OnlyCells) {
        var sortedRanges = self.getSortedSelections(false),
            colCount = self._sheet.getColumnCount(),
            length = sortedRanges.length,
            i, r;

        for (i = 0; i < length; i++) {
            r = sortedRanges[i];
            // TODO: how to process with the private API
            //if (!this._sheet._checkArrayFormula(r.row, r.col, r.rowCount, colCount - r.col)) {
            //    return;
            //}
        }
        // TODO: Why w/o comment (4)
        var option = 0x1FF; // 256 /* BindingPath */ | 2 /* Formula */ | 8 /* RangeGroup */ | 32 /* Span */ | 16 /* Sparkline */ | 64 /* Style */ | 128 /* Tag */ | 1 /* Value */;
        for (i = 0; i < length; i++) {
            r = sortedRanges[i];
            self._sheet.addColumns(colCount, r.colCount);
            self._sheet.moveTo(r.row, r.col, r.row, r.col + r.colCount, r.rowCount, colCount - r.col, option);
        }
    }
};


function InsertDownCellsAction(spread) {
    InsertAndDeleteBase.call(this, spread);
}
setBaseClass(InsertDownCellsAction, InsertAndDeleteBase);
InsertDownCellsAction.prototype.canExecute = function () {
    return true;
};
InsertDownCellsAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    if (getSelectionType(self._selections) === SelectionRangeType.OnlyCells) {
        var sortedRanges = self.getSortedSelections(true),
            rowCount = self._sheet.getRowCount(),
            length = sortedRanges.length,
            i, r;

        for (i = 0; i < length; i++) {
            r = sortedRanges[i];
            // TODO: how to process with the private API
            //if (!this._sheet._checkArrayFormula(r.row, r.col, rowCount - r.row, r.colCount)) {
            //    return;
            //}
        }

        // TODO: Why w/o comment (4)
        var option = 0x1FF; // 256 /* BindingPath */ | 2 /* Formula */ | 8 /* RangeGroup */ | 32 /* Span */ | 16 /* Sparkline */ | 64 /* Style */ | 128 /* Tag */ | 1 /* Value */;
        for (i = 0; i < length; i++) {
            r = sortedRanges[i];
            self._sheet.addRows(rowCount, r.rowCount);
            self._sheet.moveTo(r.row, r.col, r.row + r.rowCount, r.col, rowCount - r.row, r.colCount, option);
        }
    }
};


function DeleteRowsAction(spread) {
    InsertAndDeleteBase.call(this, spread);
}
setBaseClass(DeleteRowsAction, InsertAndDeleteBase);
DeleteRowsAction.prototype.canExecute = function () {
    return this.canDoInsertOrDeleteRow() && !this._isTableHeaderInRange();
};
DeleteRowsAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    self.processWithRowColumns(true, function (row, rowCount) {
        self._sheet.deleteRows(row, rowCount);
    });
};
DeleteRowsAction.prototype._isTableHeaderInRange = function () {
    var sortedRanges = this.getSortedMergedSelections(true);
    var tables = this._sheet.getTables();
    for (var tableItem in tables) {
        for (var rangeItem in sortedRanges) {
            if (tables[tableItem].headerIndex() === sortedRanges[rangeItem].start) {
                return true;
            }
        }
    }
    return false;
};

function DeleteColumnsAction(spread) {
    InsertAndDeleteBase.call(this, spread);
}
setBaseClass(DeleteColumnsAction, InsertAndDeleteBase);
DeleteColumnsAction.prototype.canExecute = function () {
    return this.canDoInsertOrDeleteColumn();
};
DeleteColumnsAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    self.processWithRowColumns(false, function (col, colCount) {
        self._sheet.deleteColumns(col, colCount);
    });
};

function DeleteLeftCellsAction(spread) {
    InsertAndDeleteBase.call(this, spread);
}
setBaseClass(DeleteLeftCellsAction, InsertAndDeleteBase);
DeleteLeftCellsAction.prototype.canExecute = function () {
    return true;
};
DeleteLeftCellsAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var sortedRanges = self.getSortedSelections(false);
    for (var i = 0; i < sortedRanges.length; i++) {
        var r = sortedRanges[i];
        // TODO: Why w/o comment (4)
        var option = 256 /* BindingPath */ | 2 /* Formula */ | 8 /* RangeGroup */ | 32 /* Span */ | 16 /* Sparkline */ | 64 /* Style */ | 128 /* Tag */ | 1 /* Value */;
        self._sheet.moveTo(r.row, r.col + r.colCount, r.row, r.col, r.rowCount, self._sheet.getColumnCount() - (r.col + r.colCount), option);
    }
};

function DeleteUpCellsAction(spread) {
    InsertAndDeleteBase.call(this, spread);
}
setBaseClass(DeleteUpCellsAction, InsertAndDeleteBase);
DeleteUpCellsAction.prototype.canExecute = function () {
    return true;
};
DeleteUpCellsAction.prototype.execute = function (context, options, isUndo) {
    var self = options.__action;
    var sortedRanges = self.getSortedSelections(true);
    for (var i = 0; i < sortedRanges.length; i++) {
        var r = sortedRanges[i];
        // TODO: Why w/o comment (4)
        var option = 256 /* BindingPath */ | 2 /* Formula */ | 8 /* RangeGroup */ | 32 /* Span */ | 16 /* Sparkline */ | 64 /* Style */ | 128 /* Tag */ | 1 /* Value */;
        self._sheet.moveTo(r.row + r.rowCount, r.col, r.row, r.col, self._sheet.getRowCount() - (r.row + r.rowCount), r.colCount, option);
    }
};


function GroupBase(spread) {
    DesignerActionBase.call(this, spread);
}

setBaseClass(GroupBase, DesignerActionBase);

GroupBase.prototype.expandRowGroup = function (index, level, isCollapse) {
    self._spread.commandManager().execute({
        cmd: "expandRowOutline",
        sheetName: self._sheet.name(),
        index: index,
        level: level,
        collapsed: isCollapse
    });
};

GroupBase.prototype.expandColumnGroup = function (index, level, isCollapse) {
    self._spread.commandManager().execute({
        cmd: "expandColumnOutline",
        sheetName: self._sheet.name(),
        index: index,
        level: level,
        collapsed: isCollapse
    });
};

GroupBase.prototype.exec = function (isCollapse) {
    if (this._sheet.getSelections().length > 1) {
        designer.MessageBox.show("The command cannot be used on multiple selections", "Spread Designer", 1 /* info */, 0 /* ok */);
        return;
    }
    var range = this._sheet.getSelections()[0];
    if (!range) {
        return;
    }

    for (var i = 0; i < range.rowCount; i++) {
        var index = range.row + i;
        if (isCollapse) {
            var level = this._getExpandLevel(this._sheet.rowOutlines, index);
        } else {
            var level = this._getCollapsedLevel(this._sheet.rowOutlines, index);
        }

        if (level >= 0) {
            var rangeGroupInfo = this._sheet.rowOutlines.find(index, level);
            if (rangeGroupInfo != null) {
                var summaryIndex = this._sheet.rowOutlines.direction() == 1 /* Forward */ ? rangeGroupInfo.end + 1 : rangeGroupInfo.start - 1;
                this.expandRowGroup(summaryIndex, level, isCollapse);
                break;
            }
        }
    }

    for (var j = 0; j < range.colCount; j++) {
        var index = range.col + j;
        if (isCollapse) {
            var level = this._getExpandLevel(this._sheet.columnOutlines, index);
        } else {
            var level = this._getCollapsedLevel(this._sheet.columnOutlines, index);
        }
        if (level >= 0) {
            var rangeGroupInfo = this._sheet.columnOutlines.find(index, level);
            if (rangeGroupInfo != null) {
                var summaryIndex = this._sheet.columnOutlines.direction() == 1 /* Forward */ ? rangeGroupInfo.end + 1 : rangeGroupInfo.start - 1;
                self.expandColumnGroup(summaryIndex, level, isCollapse);
                break;
            }
        }
    }
};


function ExpandGroup(spread) {
    GroupBase.call(this, spread);
}

setBaseClass(ExpandGroup, GroupBase);

ExpandGroup.prototype.execute = function (context, options, isUndo) {
    self.exec(false);
};
ExpandGroup.prototype._getCollapsedLevel = function (rangeGroup, index) {
    var level = rangeGroup.getLevel(index);
    if (level <= 0) {
        return level;
    } else {
        var finalLevel = -1;
        for (var i = level; i >= 0; i--) {
            var info = rangeGroup.find(index, i);
            if (info.state() == 1 /* Collapsed */) {
                finalLevel = i;
            } else {
                info = info.parent;
            }
        }
        return finalLevel;
    }
};
//end Action


function getSortedSelections(selections, byRow) {
    function sortByColumnDesc(a, b) {
        return b.col - a.col;
    }

    function sortByRowDesc(a, b) {
        return b.row - a.row;
    }

    // make a copy and do sort
    var items = selections.slice();
    return items.sort(byRow ? sortByRowDesc : sortByColumnDesc);
}

function getMergedSelections(selections, byRow) {
    function mergeRange(a, b) {
        if (a.start > b.end + 1 || b.start > a.end + 1) {
            return null;
        } else {
            return {
                start: a.start > b.start ? b.start : a.start,
                end: a.end > b.end ? a.end : b.end
            };
        }
    }

    function SortedList() {
        this.items = [];
        this.ranges = [];
    }

    SortedList.prototype.addRange = function (start, count) {
        var end = start + count - 1, i,
            item = {start: start, end: end};

        // TODO: remove one of items or ranges (current two different methods are provided as a draft, need check if no diff and select one as the final)

        if (this.ranges.length) {
            var length = this.ranges.length, merge;
            for (i = 0; i < length; i++) {
                var current = this.ranges[i];
                merge = mergeRange(item, current);
                if (merge) {
                    this.ranges[i] = merge;
                    break;
                }
            }
            if (!merge) {
                this.ranges.push(item);
            }
        } else {
            this.ranges.push(item);
        }
        this.ranges.sort(function (a, b) {
            return a.start - b.start;
        });

        for (i = 0; i < count; i++) {
            this.items.push(start + i);
        }
    };

    SortedList.prototype.getRanges = function () {
        var len = this.items.length;

        // process with empty or single one, others will use reduce
        if (len === 0) {
            return [];
        }

        if (len === 1) {
            return [{start: this.items[0], count: 1}];
        }

        this.items.sort(function (a, b) {
            return a - b;
        });

        var result = [], last;

        this.items.reduce(function (previous, current) {
            if (!last) {
                last = {start: previous, count: 1};
            }

            var diff = current - previous;

            if (diff > 1) {
                result.push(last);
                last = {start: current, count: 1};
            } else {
                if (diff > 0) {
                    last.count++;
                }
            }

            return current;
        });
        result.push(last);

        //console.log('By items', JSON.stringify(result.map(function (item) { return { start: item.start, end: item.start + item.count - 1 }; })));

        var result2 = [], ranges = this.ranges, length = ranges.length, merge;

        if (length > 0) {
            last = this.ranges[0];
            this.ranges.reduce(function (previous, current) {
                last = current;
                merge = mergeRange(current, previous);

                if (!merge) {
                    result2.push(previous);
                }

                return merge || current;
            });
            result2.push(merge || last);
        }

        //console.log('By ranges', JSON.stringify(result2));

        if (result.length != result2.length) {
            console.log('diff size', result.length, result2.length);
        } else {
            for (var i = 0; i < result.length; i++) {
                var a = result[i], b = result2[i];
                if (a.start != b.start || a.start + a.count != b.end + 1) {
                    console.log('diff item', a, b);
                    break;
                }
            }
        }

        return result;
    };

    var list = new SortedList(),
        props = byRow ? ["row", "rowCount"] : ["col", "colCount"];

    selections.forEach(function (range) {
        list.addRange(range[props[0]], range[props[1]]);
    });

    return list.getRanges();
}

// selection related items
var SelectionRangeType = {
    Sheet: 0,
    OnlyRow: 1,
    OnlyColumn: 2,
    OnlyCells: 3,
    Mixture: 4
};

//Get the selection area's type
function getSelectionType(selections) {
    var selectionType;
    for (var i = 0; i < selections.length; i++) {
        var selection = selections[i];
        if (selection.col == -1 && selection.row == -1) {
            return SelectionRangeType.Sheet;
        }
        else if (selection.row == -1) {
            if (selectionType === undefined) {
                selectionType = SelectionRangeType.OnlyColumn;
            }
            else if (selectionType != SelectionRangeType.OnlyColumn) {
                return SelectionRangeType.Mixture;
            }
        }
        else if (selection.col == -1) {
            if (selectionType === undefined) {
                selectionType = SelectionRangeType.OnlyRow;
            }
            else if (selectionType != SelectionRangeType.OnlyRow) {
                return SelectionRangeType.Mixture;
            }
        }
        else {
            if (selectionType === undefined) {
                selectionType = SelectionRangeType.OnlyCells;
            }
            else if (selectionType != SelectionRangeType.OnlyCells) {
                return SelectionRangeType.Mixture;
            }
        }
    }
    return selectionType;
}
// selection related items (end)


var util = {};
(function (util) {
    var SheetArea = GC.Spread.Sheets.SheetArea;

    function setStyleToInsertRowsInSpan(sheet, spans, insertRow, count, sheetArea) {
        for (var i = 0, len = spans.length; i < len; i++) {
            var span = spans[i];
            if (insertRow > span.row && insertRow < span.row + span.rowCount) {
                var firstCellStyle = sheet.getStyle(span.row, span.col, sheetArea);
                if (firstCellStyle) {
                    for (var row = insertRow; row < insertRow + count; row++) {
                        for (var col = span.col; col < span.col + span.colCount; col++) {
                            sheet.setStyle(row, col, firstCellStyle, sheetArea);
                        }
                    }
                }
            }
        }
    }

    function setStyleToInsertColumnsInSpan(sheet, spans, insertCol, count, sheetArea) {
        for (var i = 0, len = spans.length; i < len; i++) {
            var span = spans[i];
            if (insertCol > span.col && insertCol < span.col + span.colCount) {
                var firstCellStyle = sheet.getStyle(span.row, span.col, sheetArea);
                if (firstCellStyle) {
                    for (var col = insertCol; col < insertCol + count; col++) {
                        for (var row = span.row; row < span.row + span.rowCount; row++) {
                            sheet.setStyle(row, col, firstCellStyle, sheetArea);
                        }
                    }
                }
            }
        }
    }

    function setSpanStyleWhenInsertRowsColumns(sheet, insertRow, insertColumn, count) {
        if (!sheet) {
            return;
        }
        var viewportSpans = sheet.getSpans(undefined, SheetArea.viewport);
        if (insertRow >= 0) {
            setStyleToInsertRowsInSpan(sheet, viewportSpans, insertRow, count, SheetArea.viewport);
            setStyleToInsertRowsInSpan(sheet, sheet.getSpans(undefined, SheetArea.rowHeader), insertRow, count, SheetArea.rowHeader);
        } else if (insertColumn >= 0) {
            setStyleToInsertColumnsInSpan(sheet, viewportSpans, insertColumn, count, SheetArea.viewport);
            setStyleToInsertColumnsInSpan(sheet, sheet.getSpans(undefined, SheetArea.colHeader), insertColumn, count, SheetArea.colHeader);
        }
    }

    util.setSpanStyleWhenInsertRowsColumns = setSpanStyleWhenInsertRowsColumns;

    function isInRange(range, row, col) {
        return range.contains(row, col);
    }

    util.isInRange = isInRange;

    function getActualRange(range, maxRowCount, maxColCount) {
        var row = range.row < 0 ? 0 : range.row;
        var col = range.col < 0 ? 0 : range.col;
        var rowCount = range.rowCount < 0 ? maxRowCount : range.rowCount;
        var colCount = range.colCount < 0 ? maxColCount : range.colCount;

        return new GC.Spread.Sheets.Range(row, col, rowCount, colCount);
    }

    util.getActualRange = getActualRange;

    function getSelectionRanges(sheet) {
        var ranges = [];
        if (sheet) {
            var rowCount = sheet.getRowCount(), colCount = sheet.getColumnCount();
            sheet.getSelections().forEach(function (selection) {
                ranges.push(getActualRange(selection, rowCount, colCount));
            });
        }
        return ranges;
    }

    util.getSelectionRanges = getSelectionRanges;

})(util);
