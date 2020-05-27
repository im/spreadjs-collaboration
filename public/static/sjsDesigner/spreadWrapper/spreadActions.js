(function () {
    'use strict';

    var designer = GC.Spread.Sheets.Designer;
    var keyword_undefined = void 0;
    var rowHigh = {};
    var Sheets = GC.Spread.Sheets;
    var Charts = Sheets.Charts;
    var shapes = Sheets.Shapes;
    var rangeToFormula = Sheets.CalcEngine.rangeToFormula;
    var formulaToRange = Sheets.CalcEngine.formulaToRange;
    var chartHelper = designer.util.chartHelper;
    var getSelectedChart = chartHelper.getSelectedChart;
    var outlineDirection = Sheets.Outlines.OutlineDirection;
    var Range = Sheets.Range;
    var spreadActions = {};
    if (!designer.dialog) {
        designer.dialog = {};
    }

    var Commands = {};

    var MENUITEM_NAME_PREFIX = "designer.";
    var CUT = "cut",
        COPY = "copy",
        PASTE_FORMATTING = "pasteFormatting",
        PASTE_VALUES = "pasteValues",
        PASTE_FORMULA = "pasteFormula",
        PASTE_ALL = "pasteAll",
        PASTE_VALUES_FORMATTING = "pasteValuesFormatting",
        PASTE_FORMULA_FORMATTING = "pasteFormulaFormatting",
        INSERT_DIALOG = 'insert_dialog',
        DELETE_DIALOG = 'delete_dialog',
        PROTECT_SHEET = "protectSheet",
        CONFIRM_PROTECT_SHEET = "confirmProtectSheet",
        FORMAT_CELLS = 'formatCells',
        EDIT_CELLTYPE = 'editCellType',
        EDIT_CELL_DROPDOWNS = 'editCellDropdowns',
        RICH_TEXT = 'richText',
        CUSTOM_SORT = 'customSort',
        DEFINE_NAME = 'defineName',
        CELL_TAG = 'cellTag',
        COL_TAG = 'colTag',
        SHEET_TAG = 'sheetTag',
        ROW_TAG = 'rowTag',
        ROW_HEIGHT = 'rowHeight',
        COL_WIDTH = 'columnWidth',
        FORMAT_COMMENT = "formatComment",
        SLICER_SORT_ASCEND = 'slicerSortAscend',
        SLICER_SORT_DESCEND = 'slicerSortDescend',
        SLICER_PROPERTY = 'slicerProperty',
        SLICER_SETTING = 'slicerSetting',
        COLUMN_HEADERS = "columnHeaders",
        OUTLINE_COLUMN = "outlineColumn ",
        ROW_HEADERS = 'rowHeaders',
        TAB_COLOR = "tabColor",
        CHANGE_CHART_TYPE_DIALOG = 'changeChartTypeDialog',
        SELECT_CHART_DATA_DIALOG = 'selectChartDataDialog',
        MOVE_CHART_DIALOG = 'moveChartDialog',
        FORMAT_CHART = 'formatChart',
        FLOATING_OBJECT_CUT = 'floatingObjectCut',
        FLOATING_OBJECT_COPY = 'floatingObjectCopy',
        RESET_CHART_COLOR = 'resetChartColor',
        CUT_SHAPES = 'cutShapes',
        COPY_SHAPES = 'copyShapes',
        PASTE_SHAPES = 'pasteShapes',
        GROUP_SHAPES = 'groupShapes',
        UNGROUP_SHAPES = 'ungroupShapes',
        FORMAT_SHAPES = 'formatShapes',
        NAMED_STYLE_NORMAL = 'Normal',
        GRAND = 'Grand',
        TOTAL_ROW = "Totals Row",
        TO_RANGE = "tableToRange",
        SUBTOTAL = 'SUBTOTAL',
        MORE_FUNCTIONS = 'more-functions',
        ARRAY = 'array',
        RESIZE_TABLE_HANDLE = "resizeTableHandleButton",
        TABLE = 'table';
    var SUBTOTAL_FUNCTION_NAME = {
        '9': 'Total',
        '3': 'Count',
        '1': 'Average',
        '4': 'Max',
        '5': 'Min',
        '6': 'Product'
    };

    var STYLE_PROPERTY_DICT = {
        backColor: null,
        backgroundImage: null,
        backgroundImageLayout: null,
        borderBottom: null,
        borderLeft: null,
        borderRight: null,
        borderTop: null,
        cellPadding: null,
        cellType: null,
        diagonalDown: null,
        diagonalUp: null,
        font: null,
        foreColor: null,
        formatter: null,
        hAlign: null,
        imeMode: null,
        isVerticalText: null,
        labelOptions: null,
        locked: null,
        name: null,
        parentName: null,
        quotePrefix: null,
        shrinkToFit: null,
        tabStop: null,
        textDecoration: null,
        textIndent: null,
        themeFont: null,
        vAlign: null,
        validator: null,
        watermark: null,
        wordWrap: null
    };
    function triggerChartChanged(chart) {
        designer.util.triggerDesignerEvent('chartChanged', chart);
    }
    function triggerShapeChanged(shape) {
        designer.util.triggerDesignerEvent('shapeChanged', shape);
    }

    function initDesignerCommands(commandManager) {
        //CLipboard
        //Copy
        commandManager.register(MENUITEM_NAME_PREFIX + COPY, Commands[COPY], null, false, false, false, false);
        //Cut
        commandManager.register(MENUITEM_NAME_PREFIX + CUT, Commands[CUT], null, false, false, false, false);
        //PasteAll
        commandManager.register(MENUITEM_NAME_PREFIX + PASTE_ALL, Commands[PASTE_ALL], null, false, false, false, false);
        //PasteFormular
        commandManager.register(MENUITEM_NAME_PREFIX + PASTE_FORMULA, Commands[PASTE_FORMULA], null, false, false, false, false);
        //PasteFormatting
        commandManager.register(MENUITEM_NAME_PREFIX + PASTE_FORMATTING, Commands[PASTE_FORMATTING], null, false, false, false, false);
        //PasteValue
        commandManager.register(MENUITEM_NAME_PREFIX + PASTE_VALUES, Commands[PASTE_VALUES], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + PASTE_VALUES_FORMATTING, Commands[PASTE_VALUES_FORMATTING], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + PASTE_FORMULA_FORMATTING, Commands[PASTE_FORMULA_FORMATTING], null, false, false, false, false);

        //Dialog
        //InsertDialog
        commandManager.register(MENUITEM_NAME_PREFIX + INSERT_DIALOG, Commands[INSERT_DIALOG], null, false, false, false, false);
        //deleteDialog
        commandManager.register(MENUITEM_NAME_PREFIX + DELETE_DIALOG, Commands[DELETE_DIALOG], null, false, false, false, false);
        //protectSheet
        commandManager.register(MENUITEM_NAME_PREFIX + PROTECT_SHEET, Commands[PROTECT_SHEET], null, false, false, false, false);
        //formatCells
        commandManager.register(MENUITEM_NAME_PREFIX + FORMAT_CELLS, Commands[FORMAT_CELLS], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + EDIT_CELLTYPE, Commands[EDIT_CELLTYPE], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + EDIT_CELL_DROPDOWNS, Commands[EDIT_CELL_DROPDOWNS], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + RICH_TEXT, Commands[RICH_TEXT], null, false, false, false, false);
        //customSort
        commandManager.register(MENUITEM_NAME_PREFIX + CUSTOM_SORT, Commands[CUSTOM_SORT], null, false, false, false, false);
        //defineName
        commandManager.register(MENUITEM_NAME_PREFIX + DEFINE_NAME, Commands[DEFINE_NAME], null, false, false, false, false);
        //cellTag
        commandManager.register(MENUITEM_NAME_PREFIX + CELL_TAG, Commands[CELL_TAG], null, false, false, false, false);
        //columnTag
        commandManager.register(MENUITEM_NAME_PREFIX + COL_TAG, Commands[COL_TAG], null, false, false, false, false);
        //rowTag
        commandManager.register(MENUITEM_NAME_PREFIX + SHEET_TAG, Commands[SHEET_TAG], null, false, false, false, false);
        //sheetTag
        commandManager.register(MENUITEM_NAME_PREFIX + ROW_TAG, Commands[ROW_TAG], null, false, false, false, false);
        //rowHeight
        commandManager.register(MENUITEM_NAME_PREFIX + ROW_HEIGHT, Commands[ROW_HEIGHT], null, false, false, false, false);
        //columnWidth
        commandManager.register(MENUITEM_NAME_PREFIX + COL_WIDTH, Commands[COL_WIDTH], null, false, false, false, false);
        //formatComment
        commandManager.register(MENUITEM_NAME_PREFIX + FORMAT_COMMENT, Commands[FORMAT_COMMENT], null, false, false, false, false);
        //slicerProperty
        commandManager.register(MENUITEM_NAME_PREFIX + SLICER_PROPERTY, Commands[SLICER_PROPERTY], null, false, false, false, false);
        //slicerSetting
        commandManager.register(MENUITEM_NAME_PREFIX + SLICER_SETTING, Commands[SLICER_SETTING], null, false, false, false, false);
        //columnHeaders
        commandManager.register(MENUITEM_NAME_PREFIX + COLUMN_HEADERS, Commands[COLUMN_HEADERS], null, false, false, false, false);
        //rowHeaders
        commandManager.register(MENUITEM_NAME_PREFIX + ROW_HEADERS, Commands[ROW_HEADERS], null, false, false, false, false);

        commandManager.register(MENUITEM_NAME_PREFIX + OUTLINE_COLUMN, Commands[OUTLINE_COLUMN], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + TOTAL_ROW, Commands[TOTAL_ROW], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + TO_RANGE, Commands[TO_RANGE], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + RESIZE_TABLE_HANDLE, Commands[RESIZE_TABLE_HANDLE], null, false, false, false, false);
        //Sort
        //A To Z
        commandManager.register(MENUITEM_NAME_PREFIX + SLICER_SORT_ASCEND, Commands[SLICER_SORT_ASCEND], null, false, false, false, false);
        //Z To A
        commandManager.register(MENUITEM_NAME_PREFIX + SLICER_SORT_DESCEND, Commands[SLICER_SORT_DESCEND], null, false, false, false, false);

        //TabColor
        commandManager.register(MENUITEM_NAME_PREFIX + TAB_COLOR, Commands[TAB_COLOR], null, false, false, false, false);

        commandManager.register(MENUITEM_NAME_PREFIX + MORE_FUNCTIONS, Commands[MORE_FUNCTIONS], null, false, false, false, false);

        //chart
        commandManager.register(MENUITEM_NAME_PREFIX + CHANGE_CHART_TYPE_DIALOG, Commands[CHANGE_CHART_TYPE_DIALOG], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + SELECT_CHART_DATA_DIALOG, Commands[SELECT_CHART_DATA_DIALOG], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + MOVE_CHART_DIALOG, Commands[MOVE_CHART_DIALOG], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + FORMAT_CHART, Commands[FORMAT_CHART], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + RESET_CHART_COLOR, Commands[RESET_CHART_COLOR], null, false, false, false, false);


        // chart Copy
        commandManager.register(MENUITEM_NAME_PREFIX + FLOATING_OBJECT_COPY, Commands[FLOATING_OBJECT_COPY], null, false, false, false, false);
        // chart Cut
        commandManager.register(MENUITEM_NAME_PREFIX + FLOATING_OBJECT_CUT, Commands[FLOATING_OBJECT_CUT], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + CUT_SHAPES, Commands[CUT_SHAPES], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + COPY_SHAPES, Commands[COPY_SHAPES], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + PASTE_SHAPES, Commands[PASTE_SHAPES], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + GROUP_SHAPES, Commands[GROUP_SHAPES], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + UNGROUP_SHAPES, Commands[UNGROUP_SHAPES], null, false, false, false, false);
        commandManager.register(MENUITEM_NAME_PREFIX + FORMAT_SHAPES, Commands[FORMAT_SHAPES], null, false, false, false, false);
    }

    spreadActions.initDesignerCommands = initDesignerCommands;
    function getSheetNames(spread) {
        return spread.sheets.map(function (sheet) {
            return sheet.name();
        });
    }

    //#endregion
    //#region DesignerActionBase
    //All designer action is inherited from this action
    var DesignerActionBase = (function (_super) {
        designer.extends(DesignerActionBase, _super);

        function DesignerActionBase(spread, options) {
            _super.call(this);
            this._spread = spread;
            this._sheet = spread.getSheetFromName(options.sheetName);
            this._selections = options.selections;
            this._options = options;
            this.canUndo = false;
        }

        DesignerActionBase.prototype.spread = function () {
            return this._spread;
        };
        DesignerActionBase.prototype.sheet = function () {
            return this._sheet;
        };
        DesignerActionBase.prototype.getSelections = function () {
            return this._selections;
        };
        DesignerActionBase.prototype.executeImp = function (context, options, isUndo) {
        };
        DesignerActionBase.prototype.undoImp = function (context, options, isUndo) {    /* NOSONAR: UnusedFunctionArgument*/
            context.suspendPaint();
            var considerAllSheets = options.considerAllSheets, sheetName;
            if (considerAllSheets) {
                sheetName = options.sheetName;  // backup value for restore later
                options.sheetName = getSheetNames(this.spread());   // replace with all sheetNames let undoTransaction process all sheets
            }
            GC.Spread.Sheets.Commands.undoTransaction(context, options);
            if (considerAllSheets) {
                options.sheetName = sheetName;  // restore
            }
            context.resumePaint();
            return true;
        };
        DesignerActionBase.prototype.execute = function (context, options, isUndo) { /* NOSONAR: UnusedFunctionArgument*/
            var self = this, flag = false;
            if (isUndo) { /* NOSONAR: UnusedFunctionArgument*/
                flag = self.undoImp.call(self, context, options, isUndo);
            } else if (self.canExecute()) {
                var considerAllSheets = options.considerAllSheets, sheetName;
                if (considerAllSheets) {
                    sheetName = options.sheetName;  // backup value for restore later
                    options.sheetName = getSheetNames(self.spread());   // replace with all sheetNames let start/endTransaction process all sheets
                }
                var commands = GC.Spread.Sheets.Commands;
                commands.startTransaction(context, options);
                context.suspendPaint();
                try {
                    flag = self.executeImp(context, options, isUndo);
                } finally {
                    context.resumePaint();
                    commands.endTransaction(context, options);
                }
                if (considerAllSheets) {
                    options.sheetName = sheetName;  // restore
                }
            }
            if (flag !== undefined && flag !== false) {
                designer.ribbon.updateRibbonAll(options.style);
            }
            return flag;
        };

        //Implement ralated function for all selected ranges in active sheet
        //Event range is mini unit range: one Cell, one Column, one Row and one Sheet
        DesignerActionBase.prototype.execInSelections = function (sheet, func) {
            var i, j;
            var selections = this.getSelections();
            for (var k = 0; k < selections.length; k++) {
                var selection = selections[k];
                var col = selection.col, row = selection.row, rowCount = selection.rowCount,
                    colCount = selection.colCount;
                if (col === -1 && row === -1) {
                    func(sheet, -1, -1);
                } else if (row === -1) {
                    for (i = 0; i < colCount; i++) {
                        func(sheet, -1, col + i);
                    }
                } else if (col === -1) {
                    for (i = 0; i < rowCount; i++) {
                        func(sheet, row + i, -1);
                    }
                } else {
                    for (i = 0; i < rowCount; i++) {
                        for (j = 0; j < colCount; j++) {

                            func(sheet, row + i, col + j);
                        }
                    }
                }
            }
        };
        DesignerActionBase.prototype.execInSelectionsForSetStyle = function (sheet, func) {
            var i, j;
            var selections = this.getSelections();
            for (var k = 0; k < selections.length; k++) {
                var selection = selections[k];
                var col = selection.col, row = selection.row, rowCount = selection.rowCount,
                    colCount = selection.colCount;
                var r, c;
                if (col === -1 || row === -1) {
                    if (col === -1 && row === -1) {
                        for (r = 0; r < rowCount; r++) {
                            func(sheet, r, -1);
                        }
                        for (c = 0; c < colCount; c++) {
                            func(sheet, -1, c);
                        }
                        for (r = 0; r < rowCount; r++) {
                            for (c = 0; c < colCount; c++) {
                                func(sheet, r, c);
                            }
                        }
                    } else if (col === -1) {
                        for (r = 0; r < rowCount; r++) {
                            func(sheet, r + row, -1);
                        }
                        for (r = 0; r < rowCount; r++) {
                            for (c = 0; c < colCount; c++) {
                                func(sheet, r + row, c);
                            }
                        }
                    } else if (row === -1) {
                        for (c = 0; c < colCount; c++) {
                            func(sheet, -1, c + col);
                        }
                        for (r = 0; r < rowCount; r++) {
                            for (c = 0; c < colCount; c++) {
                                func(sheet, r, c + col);
                            }
                        }
                    }
                } else {
                    for (i = 0; i < rowCount; i++) {
                        for (j = 0; j < colCount; j++) {
                            func(sheet, row + i, col + j);
                        }
                    }
                }
            }
        };
        //Implement related function for all selected ranges in active sheet
        //Based on row, for example, set all selection ranges' row height, or hide rows etc.
        DesignerActionBase.prototype.execInSelectionsForRow = function (sheet, func) {
            var selections = this.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = selections[i];
                var row = selection.row === -1 ? 0 : selection.row;
                for (var j = 0; j < selection.rowCount; j++) {
                    func(sheet, row + j);
                }
            }
        };

        //Implement related function for all selected ranges in active sheet
        //Based on column, for example, set all selection ranges' columns width, or hide columns etc.
        DesignerActionBase.prototype.execInSelectionsForCol = function (sheet, func) {
            var selections = this.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = selections[i];
                var col = selection.col === -1 ? 0 : selection.col;
                for (var j = 0; j < selection.colCount; j++) {
                    func(sheet, col + j);
                }
            }
        };

        //Implement related function for all selected ranges in active sheet
        //Based on single cell, for example, set property for every cell
        DesignerActionBase.prototype.execInSelectionsForCell = function (sheet, func) {
            var selections = this.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = selections[i];
                var col = selection.col === -1 ? 0 : selection.col;
                var row = selection.row === -1 ? 0 : selection.row;
                for (var r = 0; r < selection.rowCount; r++) {
                    for (var c = 0; c < selection.colCount; c++) {
                        func(sheet, row + r, col + c);
                    }
                }
            }
        };

        // get actual font of the cell in the specifed sheet' position, use default if not set yet
        DesignerActionBase.prototype.getActualFont = function (sheet, row, column) {
            return sheet.getActualStyle(row, column).font || designer.res.defaultFont;
        };

        DesignerActionBase.prototype.clearSpansInSelection = function (sheet, selection) {
            if (sheet && selection) {
                var ranges = [], row = selection.row, col = selection.col, rowCount = selection.rowCount,
                    colCount = selection.colCount;

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

        //used to support undoRedo, record properties
        DesignerActionBase.prototype.getKey = function (row, column) {
            return [row, column].join(',');
        };
        DesignerActionBase.prototype.getPosition = function (key) {
            var items = key && key.split(',');
            if (items && items.length === 2) {
                return { row: +items[0], column: +items[1] };
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
        DesignerActionBase.prototype.undoSetStyle = function (property, options) {
            var self = this, sheet = self._sheet, spread = self._spread, styles = options._styles;
            if (styles) {
                spread.suspendPaint();
                for (var key in styles) { /* NOSONAR: ForIn */
                    var pos = self.getPosition(key),
                        oldValue = styles[key];
                    if (pos) {
                        var row = pos.row, column = pos.column;
                        var style = sheet.getStyle(row, column);
                        if (property === 'backColor') {
                            style[property] = oldValue || undefined;    // replace null with undefined to avoid border been effected
                        } else {
                            style[property] = oldValue;
                        }
                        sheet.setStyle(row, column, style);
                    }
                }
                spread.resumePaint();
            }
            return true;
        };
        DesignerActionBase.prototype.setStyle = function (attribute, property, value, options, adjustValue, additionArgs) {
            var self = this, sheet = self._sheet, spread = self._spread;
            options._styles = {}; // prepare object to save related original information
            spread.suspendPaint();
            self.execInSelectionsForSetStyle(sheet, function (_sheet, row, column) {
                var style = _sheet.getStyle(row, column);
                if (!style) {
                    style = new GC.Spread.Sheets.Style();
                }
                options._styles[self.getKey(row, column)] = style[property];     // save related information, use row, column as the key

                if (adjustValue) {
                    value = adjustValue.apply(self, [_sheet, row, column, style, value].concat(additionArgs || []));
                    style[property] = value;
                    _sheet.setStyle(row, column, style);
                }
                if (["font-size", "font-weight", "font-style"].indexOf(attribute) >= 0) {
                    self.setFontStyle(style, attribute, value, row, column);
                } else if ("font-family" === attribute) {
                    style.themeFont = keyword_undefined;
                    var newValue = value;
                    //fix bug sjs-1389 and sjs-1122 in format dialog set fontfamily will add "'", in ribbon set will add '"';
                    if (value && value.indexOf("'") === -1 && value.indexOf('"') === -1) {
                        newValue = '"' + value + '"';
                    }
                    self.setFontStyle(style, attribute, newValue, row, column);
                } else {
                    style[property] = value;
                    _sheet.setStyle(row, column, style);
                    if (property === 'wordWrap' && !rowHigh[row] && self._sheet.defaults.rowHeight === self._sheet.getRowHeight(row)) {
                        _sheet.autoFitRow(row);
                    }
                }
            });
            spread.resumePaint();
        };
        DesignerActionBase.prototype.updateRibbon = function () {
            $(designer).trigger("updateRibbon");
        };

        DesignerActionBase.prototype.getTextDecoration = function (sheet, row, column, style, value, flag) {
            var self = this;
            if (!style.textDecoration) {
                style.textDecoration = self.getActualDecoration(sheet, row, column);
            }
            var textDecoration = style.textDecoration;
            if (value) {
                if ((textDecoration & 1) === 1 && (flag & 8) === 8) {
                    textDecoration ^= 1;
                    textDecoration |= 8;
                } else if ((textDecoration & 8) === 8 && (flag & 1) === 1) {
                    textDecoration ^= 8;
                    textDecoration |= 1;
                } else {
                    textDecoration |= flag;
                }
            } else {
                textDecoration ^= flag;
            }
            return textDecoration;
        };

        DesignerActionBase.prototype.getActualDecoration = function (sheet, row, column) {
            return sheet.getActualStyle(row, column).textDecoration;
        };
        return DesignerActionBase;
    })(Sheets.Commands.ActionBase);
    spreadActions.DesignerActionBase = DesignerActionBase;

    //#endregion
    //#region CutCopyPaste Actions
    //copy
    var CopyAction = (function (_super) {
        designer.extends(CopyAction, _super);

        function CopyAction(spread, options) {
            _super.call(this, spread, options);
        }

        CopyAction.prototype.executeImp = function (context, options, isUndo) {
            var spread = this._spread;
            var sheetName = options.sheetName;
            var command = {};
            command.cmd = "copy";
            command.sheetName = sheetName;
            command.ignoreClipboard = true;
            var callback = function () {
                designer.util.clipboard.copyText = command.copyData.copyText;
                designer.util.clipboard.copyHtml = command.copyData.copyHtml;
            };
            command.callback = callback;
            spread.commandManager().execute(command);
        };
        return CopyAction;
    })(DesignerActionBase);
    Commands[COPY] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new CopyAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function copy(spread, options) {
        runCommand(spread, COPY, Commands[COPY], options);
    }

    spreadActions.copy = copy;

    var CutAction = (function (_super) {
        designer.extends(CutAction, _super);

        function CutAction(spread, options) {
            _super.call(this, spread, options);
        }

        CutAction.prototype.executeImp = function (context, options, isUndo) {
            var spread = this._spread;
            var sheetName = options.sheetName;
            var command = {};
            command.cmd = "cut";
            command.sheetName = sheetName;
            command.ignoreClipboard = true;
            var callback = function () {
                designer.util.clipboard.copyText = command.cutData.copyText;
                designer.util.clipboard.copyHtml = command.cutData.copyHtml;
            };
            command.callback = callback;
            spread.commandManager().execute(command);
        };
        return CutAction;
    })(DesignerActionBase);
    Commands[CUT] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new CutAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function cut(spread, options) {
        runCommand(spread, CUT, Commands[CUT], options);
    }

    spreadActions.cut = cut;


    var PasteAction = (function (_super) {
        designer.extends(PasteAction, _super);

        function PasteAction(spread, options) {
            _super.call(this, spread, options);
        }

        PasteAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._value = options.value;
            var sheet = self._sheet;
            var oldClipOption = sheet.options.clipBoardOptions;
            sheet.options.clipBoardOptions = self._value;
            if (sheet.isPasteFloatingObject()) {
                self._spread.commandManager().execute({
                    cmd: "pasteFloatingObjects",
                    sheetName: sheet.name()
                });
            } else if (sheet.isPasteShapes && sheet.isPasteShapes()) {
                self._spread.commandManager().execute({
                    cmd: "pasteShapes",
                    sheetName: sheet.name()
                });
            } else {
                var result, clipboardHtml, cellDelimiter;
                result = designer.util.clipboard.copyText;
                clipboardHtml = designer.util.clipboard.copyHtml;

                var callback = function () {
                    sheet.options.clipBoardOptions = oldClipOption;
                };
                context.commandManager().execute({
                    cmd: "paste",
                    sheetName: sheet.name(),
                    pasteText: result,
                    pasteHtml: clipboardHtml,
                    callback: callback
                });
            }

        };
        return PasteAction;
    })(DesignerActionBase);

    Commands[PASTE_ALL] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new PasteAction(context, options);
            var pasteOptions = {
                value: 0 /* All */,
                spread: context
            };
            return cmd.execute(context, pasteOptions, isUndo);
        }
    };

    Commands[PASTE_FORMULA] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new PasteAction(context, options);
            var pasteOptions = {
                value: 3 /* Formulas */,
                spread: context
            };
            return cmd.execute(context, pasteOptions, isUndo);
        }
    };

    Commands[PASTE_FORMATTING] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new PasteAction(context, options);
            var pasteOptions = {
                value: 2 /* Formatting */,
                spread: context
            };
            return cmd.execute(context, pasteOptions, isUndo);
        }
    };

    Commands[PASTE_VALUES] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new PasteAction(context, options);
            var pasteOptions = {
                value: 1 /* Values */,
                spread: context
            };
            return cmd.execute(context, pasteOptions, isUndo);
        }
    };

    Commands[PASTE_VALUES_FORMATTING] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new PasteAction(context, options);
            var pasteOptions = {
                value: 4 /* valuesAndFormatting */,
                spread: context
            };
            return cmd.execute(context, pasteOptions, isUndo);
        }
    };
    Commands[PASTE_FORMULA_FORMATTING] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new PasteAction(context, options);
            var pasteOptions = {
                value: 5 /* formulasAndFormatting */,
                spread: context
            };
            return cmd.execute(context, pasteOptions, isUndo);
        }
    };
    var commands_paste = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new PasteAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    function paste(spread, paramters) {
        runCommand(spread, "paste", commands_paste, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }
    spreadActions.paste = paste;
    var SetSheetTabColorAction = (function (_super) {
        designer.extends(SetSheetTabColorAction, _super);
        function SetSheetTabColorAction(spread, options) {
            _super.call(this, spread, options);
        }
        SetSheetTabColorAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._sheet.options.sheetTabColor = options.value;
        };
        return SetSheetTabColorAction;
    })(DesignerActionBase);
    var commands_setSheetTabColor = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetSheetTabColorAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    function setSheetTabColor(spread, paramters) {
        runCommand(spread, "setSheetTabColor", commands_setSheetTabColor, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }
    spreadActions.setSheetTabColor = setSheetTabColor;
    var InsertDialogAction = (function (_super) {
        designer.extends(InsertDialogAction, _super);

        function InsertDialogAction(spread, options) {
            _super.call(this, spread, options);
        }

        InsertDialogAction.prototype.executeImp = function (context, options, isUndo) {
            var selectionType = getSelectionTypeWithSelections(options.selections);
            switch (selectionType) {
                case 0 /* Sheet */
                    :
                    designer.MessageBox.show(designer.res.insertCellInSheet, designer.res.title, 2 /* warning */);
                    break;
                case 4 /* Mixture */
                    :
                    designer.MessageBox.show(designer.res.insertCellInMixtureRange, designer.res.title, 2 /* warning */);
                    break;
                case 3 /* OnlyCells */
                    :
                    if (designer && designer.dialog) {
                        if (designer.dialog.insertCellsDialog === undefined) {
                            designer.dialog.insertCellsDialog = new designer.InsertCellsDialog();
                        }
                        designer.dialog.insertCellsDialog.open();
                    }
                    break;
                default:
                    break;
            }
        };
        return InsertDialogAction;
    })(DesignerActionBase);
    Commands[INSERT_DIALOG] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new InsertDialogAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    var DeleteDialogAction = (function (_super) {
        designer.extends(DeleteDialogAction, _super);

        function DeleteDialogAction(spread, options) {
            _super.call(this, spread, options);
        }

        DeleteDialogAction.prototype.executeImp = function (context, options, isUndo) {
            var selectionType = getSelectionTypeWithSelections(options.selections);
            switch (selectionType) {
                case 0 /* Sheet */
                    :
                    var activeSheet = context.getSheetFromName(options.sheetName);
                    activeSheet.clear(0, 0, activeSheet.getRowCount(), activeSheet.getColumnCount(), 3 /* viewport */, 2 /* Style */ | 1 /* Data */ | 16 /* Sparkline */ | 32 /* Axis */);
                    return;
                case 4 /* Mixture */
                    :
                    designer.MessageBox.show(designer.res.insertCellInMixtureRange, designer.res.title, 2 /* warning */);
                    break;
                case 3 /* OnlyCells */
                    :
                    if (designer && designer.dialog) {
                        if (designer.dialog.deleteCellsDialog === undefined) {
                            designer.dialog.deleteCellsDialog = new designer.DeleteCellsDialog();
                        }
                        designer.dialog.deleteCellsDialog.open();
                    }
                    break;
                default:
                    break;
            }
            return false;
        };
        return DeleteDialogAction;
    })(DesignerActionBase);
    Commands[DELETE_DIALOG] = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new DeleteDialogAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    var ProtectSheetAction = (function (_super) {
        designer.extends(ProtectSheetAction, _super);

        function ProtectSheetAction(spread, options) {
            _super.call(this, spread, options);
        }

        ProtectSheetAction.prototype.executeImp = function (context, options, isUndo) {
            var activeSheet = context.getSheetFromName(options.sheetName);
            var isProtected = activeSheet.options.isProtected;
            if (designer && designer.dialog) {
                if (!isProtected) {
                    if (designer.dialog.protectionOptionDialog === undefined) {
                        designer.dialog.protectionOptionDialog = new designer.ProtectionOptionDialog();
                    }
                    designer.dialog.protectionOptionDialog.open();
                } else {
                    activeSheet.options.isProtected = !!options.value;
                    designer.actions.isFileModified = true;
                }
            }
        };
        return ProtectSheetAction;
    })(DesignerActionBase);
    Commands[PROTECT_SHEET] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new ProtectSheetAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    var ConfirmProtectSheetAction = (function (_super) {
        designer.extends(ConfirmProtectSheetAction, _super);

        function ConfirmProtectSheetAction(spread, options) {
            _super.call(this, spread, options);
        }
        ConfirmProtectSheetAction.prototype.executeImp = function (context, options, isUndo) {
            var activeSheet = context.getSheetFromName(options.sheetName);
            var protectionOption = options.value;
            activeSheet.options.protectionOptions = protectionOption;
            activeSheet.options.isProtected = true;
            designer.wrapper.spread.undoManager().clear();
        };
        return ConfirmProtectSheetAction;
    })(DesignerActionBase);
    Commands[CONFIRM_PROTECT_SHEET] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new ConfirmProtectSheetAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    var FormatCellsAction = (function (_super) {
        designer.extends(FormatCellsAction, _super);

        function FormatCellsAction(spread, options) {
            _super.call(this, spread, options);
        }

        FormatCellsAction.prototype.executeImp = function (context, options, isUndo) {
            if (designer && designer.dialog) {
                if (designer.dialog.formatCellDialog === undefined) {
                    designer.dialog.formatCellDialog = new designer.FormatDialog();
                }
                designer.dialog.formatCellDialog.open('number');
            }
        };
        return FormatCellsAction;
    })(DesignerActionBase);
    Commands[FORMAT_CELLS] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new FormatCellsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    var EditCellDropdownsAction = (function (_super) {
        designer.extends(EditCellDropdownsAction, _super);
        function EditCellDropdownsAction(spread, options) {
            _super.call(this, spread, options);
        }
        EditCellDropdownsAction.prototype.executeImp = function (context, options, isUndo) {
            var style = context.getActiveSheet().getStyle(options.activeRow, options.activeCol);
            if (style && style.cellButtons && style.cellButtons.length > 0) {
                var formatCellDialog = designer.formatCellDialog;
                if (formatCellDialog === undefined) {
                    formatCellDialog = new designer.FormatDialog();
                    designer.formatCellDialog = formatCellDialog;
                }
                formatCellDialog.open('cellbutton', undefined, undefined, undefined, undefined, undefined);
            }
        };
        return EditCellDropdownsAction;
    })(DesignerActionBase);
    Commands[EDIT_CELL_DROPDOWNS] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new EditCellDropdownsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    var EditCellTypeAction = (function (_super) {
        designer.extends(EditCellTypeAction, _super);
        function EditCellTypeAction(spread, options) {
            _super.call(this, spread, options);
        }
        EditCellTypeAction.prototype.executeImp = function (context, options, isUndo) {
            var style = context.getActiveSheet().getStyle(options.activeRow, options.activeCol);
            if (style && style.cellType) {
                switch (style.cellType.typeName) {
                    case "5":
                        if (designer.ribbon.checkBoxCellTypeDialog === undefined) {
                            designer.ribbon.checkBoxCellTypeDialog = new designer.CheckBoxCellTypeDialog();
                        }
                        designer.ribbon.checkBoxCellTypeDialog.open();
                        break;
                    case "6":
                        if (designer.ribbon.buttonCellTypeDialog === undefined) {
                            designer.ribbon.buttonCellTypeDialog = new designer.ButtonCellTypeDialog();
                        }
                        designer.ribbon.buttonCellTypeDialog.open();
                        break;
                    case "7":
                        if (designer.ribbon.comboBoxCellTypeDialog === undefined) {
                            designer.ribbon.comboBoxCellTypeDialog = new designer.ComboBoxCellTypeDialog();
                        }
                        designer.ribbon.comboBoxCellTypeDialog.open();
                        break;
                    case "8":
                        if (designer.ribbon.hyperLinkCellTypeDialog === undefined) {
                            designer.ribbon.hyperLinkCellTypeDialog = new designer.HyperLinkCellTypeDialog();
                        }
                        designer.ribbon.hyperLinkCellTypeDialog.open();
                        break;
                    case "11":
                        if (designer.ribbon.checkListCellTypeDialog === undefined) {
                            designer.ribbon.checkListCellTypeDialog = new designer.CheckListCellTypeDialog();
                        }
                        designer.ribbon.checkListCellTypeDialog.open();
                        break;
                    case "12":
                        if (designer.ribbon.checkListCellTypeDialog === undefined) {
                            designer.ribbon.checkListCellTypeDialog = new designer.CheckListCellTypeDialog();
                        }
                        designer.ribbon.checkListCellTypeDialog.open(true);
                        break;
                    case "13":
                        if (designer.ribbon.senmentedCellTypeDialog === undefined) {
                            designer.ribbon.senmentedCellTypeDialog = new designer.ButtonListCellTypeDialog();
                        }
                        designer.ribbon.senmentedCellTypeDialog.open();
                        break;
                }
                return;
            }
        };
        return EditCellTypeAction;
    })(DesignerActionBase);
    Commands[EDIT_CELLTYPE] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new EditCellTypeAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    var RichTextAction = (function (_super) {
        designer.extends(RichTextAction, _super);
        function RichTextAction(spread, options) {
            _super.call(this, spread, options);
        }
        RichTextAction.prototype.executeImp = function (context, options, isUndo) {
            if (designer && designer.dialog) {
                if (designer.dialog.richTextDialog === undefined) {
                    designer.dialog.richTextDialog = new designer.RichTextDialog();
                }
                designer.dialog.richTextDialog.open();
            }
        };
        return RichTextAction;
    })(DesignerActionBase);
    Commands[RICH_TEXT] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new RichTextAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    var CustomSortAction = (function (_super) {
        designer.extends(CustomSortAction, _super);

        function CustomSortAction(spread, options) {
            _super.call(this, spread, options);
        }

        CustomSortAction.prototype.executeImp = function (context, options, isUndo) {
            if (designer && designer.dialog) {
                if (!designer.dialog.sortDialog) {
                    designer.dialog.sortDialog = new designer.SortDialog();
                }
                designer.dialog.sortDialog.open();
            }
        };
        return CustomSortAction;
    })(DesignerActionBase);
    Commands[CUSTOM_SORT] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new CustomSortAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    var DefineNameAction = (function (_super) {
        designer.extends(DefineNameAction, _super);

        function DefineNameAction(spread, options) {
            _super.call(this, spread, options);
        }

        DefineNameAction.prototype.executeImp = function (context, options, isUndo) {
            if (designer && designer.dialog) {
                if (designer.dialog.newNameDialog === undefined) {
                    designer.dialog.newNameDialog = new designer.NewNameDialog();
                }
                designer.dialog.newNameDialog.open("new", undefined);
            }
        };
        return DefineNameAction;
    })(DesignerActionBase);
    Commands[DEFINE_NAME] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new DefineNameAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    var TagAction = (function (_super) {
        designer.extends(TagAction, _super);

        function TagAction(spread, options) {
            _super.call(this, spread, options);
        }

        TagAction.prototype.executeImp = function (context, options, isUndo) {
            if (designer && designer.dialog) {
                if (designer.dialog.tagDialog === undefined) {
                    designer.dialog.tagDialog = new designer.TagDialog();
                }
                designer.dialog.tagDialog.open(options.type);
                designer.wrapper.spread.focus(false);
            }
        };
        return TagAction;
    })(DesignerActionBase);
    Commands[SHEET_TAG] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new TagAction(context, options);
            options.type = 'sheet';
            return cmd.execute(context, options, isUndo);
        }
    };

    Commands[CELL_TAG] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new TagAction(context, options);
            options.type = 'cell';
            return cmd.execute(context, options, isUndo);
        }
    };

    Commands[COL_TAG] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new TagAction(context, options);
            options.type = 'column';
            return cmd.execute(context, options, isUndo);
        }
    };

    Commands[ROW_TAG] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new TagAction(context, options);
            options.type = 'row';
            return cmd.execute(context, options, isUndo);
        }
    };

    var OutlineColumnAction = (function (_super) {
        designer.extends(OutlineColumnAction, _super);
        function OutlineColumnAction(spread, options) {
            _super.call(this, spread, options);
        }
        OutlineColumnAction.prototype.executeImp = function (context, options, isUndo) {
            if (designer && designer.dialog) {
                if (designer.dialog.outlineColumnDialog === undefined) {
                    designer.dialog.outlineColumnDialog = new designer.OutlineColumnDialog();
                }
                designer.dialog.outlineColumnDialog.open();
            }
        };
        return OutlineColumnAction;
    })(DesignerActionBase);
    Commands[OUTLINE_COLUMN] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new OutlineColumnAction(context, options);
            options.type = 'column';
            return cmd.execute(context, options, isUndo);
        }
    };
    Commands[TOTAL_ROW] = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var table = context.getActiveSheet().tables.find(options.activeRow, options.activeCol);
            $("#table-total-row").find(".ui-icon").toggleClass("gcui-ribbon-checked").toggleClass("gcui-ribbon-unchecked");
            if (table instanceof Sheets.Tables.Table) {
                var flag = table.showFooter();
                table.useFooterDropDownList(!flag);
                table.showFooter(!flag);
                var len = table.endColumn() - table.startColumn() + 1;
                for (var i = 0; i < len; i++) {
                    var arr = table.footerRowDropDowns(i)[0].option.items;
                    if (arr.length < 10) {
                        arr.push({
                            text: designer.res.ribbon.tableDesign.moreFunctions,
                            value: "more-functions"
                        });
                        table.footerRowDropDowns(i,
                            {
                                listOption: {
                                    items: arr
                                },
                                submitCommand: "designer.more-functions"
                            });
                    }
                }
            }
        }
    };
    Commands[MORE_FUNCTIONS] = {//NOSONAR
        canUndo: false,
        execute: function (context, options, isUndo) {
            if (options.newValue === "more-functions") {
                if (!designer.insertFunctionDialog) {
                    designer.insertFunctionDialog = new designer.InsertFunctionDialog(true);
                }
                designer.insertFunctionDialog.open();
            } else {
                context.commandManager().execute({
                    cmd: "tableTotalRowFormula",
                    col: options.col,
                    row: options.row,
                    newValue: options.newValue,
                    sheetName: options.sheetName
                });
                designer.formulaBar.refresh();
            }
        }
    }
    Commands[TO_RANGE] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            designer.MessageBox.show(designer.res.tableErrDialog.tableToRange, designer.res.title, 2, 1, function (e, result) {//NOSONAR
                if (result === 1) {
                    context.commandManager().execute({
                        cmd: "tableToRange",
                        sheetName: options.sheetName,
                        tableName: options.tableName
                    });
                    designer.ribbon.updateTable();
                }
            })
        }
    };
    var RowHeightAction = (function (_super) {
        designer.extends(RowHeightAction, _super);

        function RowHeightAction(spread, options) {
            _super.call(this, spread, options);
        }

        RowHeightAction.prototype.executeImp = function (context, options, isUndo) {
            if (designer && designer.dialog) {
                if (designer.dialog.setRowHeightDialog === undefined) {
                    designer.dialog.setRowHeightDialog = new designer.RowHeightDialog();
                }
                designer.dialog.setRowHeightDialog.open();
            }
        };
        return RowHeightAction;
    })(DesignerActionBase);
    Commands[ROW_HEIGHT] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new RowHeightAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    var ColumnWidthAction = (function (_super) {
        designer.extends(ColumnWidthAction, _super);

        function ColumnWidthAction(spread, options) {
            _super.call(this, spread, options);
        }

        ColumnWidthAction.prototype.executeImp = function (context, options, isUndo) {
            if (designer && designer.dialog) {
                if (designer.dialog.setColumnWidthDialog === undefined) {
                    designer.dialog.setColumnWidthDialog = new designer.ColumnWidthDialog();
                }
                designer.dialog.setColumnWidthDialog.open();
            }
        };
        return ColumnWidthAction;
    })(DesignerActionBase);
    Commands[COL_WIDTH] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new ColumnWidthAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    var FormatCommentAction = (function (_super) {
        designer.extends(FormatCommentAction, _super);

        function FormatCommentAction(spread, options) {
            _super.call(this, spread, options);
        }

        FormatCommentAction.prototype.executeImp = function (context, options, isUndo) {
            var activeSheet = context.getSheetFromName(options.sheetName);
            if (designer && designer.dialog) {
                if (designer.dialog.fcDialog === undefined) {
                    designer.dialog.fcDialog = new designer.FormatCommentDialog();
                }
                var row = options.activeRow;
                var col = options.activeCol;
                var comment = activeSheet.comments.get(row, col);
                var option = { row: row, col: col };
                if (comment) {
                    designer.dialog.fcDialog.open(option);
                }
            }
        };
        return FormatCommentAction;
    })(DesignerActionBase);
    Commands[FORMAT_COMMENT] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new FormatCommentAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    var SlicerPropertyAction = (function (_super) {
        designer.extends(SlicerPropertyAction, _super);

        function SlicerPropertyAction(spread, options) {
            _super.call(this, spread, options);
        }

        SlicerPropertyAction.prototype.executeImp = function (context, options, isUndo) {
            var activeSheet = context.getSheetFromName(options.sheetName);
            if (designer && designer.dialog) {
                if (!designer.dialog.formatSlicerDialog) {
                    designer.dialog.formatSlicerDialog = new designer.FormatSlicerDialog();
                }
                if (designer.util.isSlicerSelected(activeSheet)) {
                    designer.dialog.formatSlicerDialog.open();
                }
            }
        };
        return SlicerPropertyAction;
    })(DesignerActionBase);
    Commands[SLICER_PROPERTY] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new SlicerPropertyAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    var SlicerSettingAction = (function (_super) {
        designer.extends(SlicerSettingAction, _super);

        function SlicerSettingAction(spread, options) {
            _super.call(this, spread, options);
        }

        SlicerSettingAction.prototype.executeImp = function (context, options, isUndo) {
            var activeSheet = context.getSheetFromName(options.sheetName);
            if (designer) {
                if (!designer.ribbon.slicerSettingDialog) {
                    designer.ribbon.slicerSettingDialog = new designer.SlicerSettingDialog();
                }
                if (designer.util.isSlicerSelected(activeSheet)) {
                    designer.ribbon.slicerSettingDialog.open();
                }
            }
        };
        return SlicerSettingAction;
    })(DesignerActionBase);
    Commands[SLICER_SETTING] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new SlicerSettingAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    var HeadersAction = (function (_super) {
        designer.extends(HeadersAction, _super);

        function HeadersAction(spread, options) {
            _super.call(this, spread, options);
        }

        HeadersAction.prototype.executeImp = function (context, options, isUndo) {
            if (designer && designer.dialog) {
                if (designer.dialog.headerCellsDialog === undefined) {
                    designer.dialog.headerCellsDialog = new designer.HeaderCellsDialog();
                }
                designer.dialog.headerCellsDialog.open(options.type);
            }
        };
        return HeadersAction;
    })(DesignerActionBase);
    Commands[COLUMN_HEADERS] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new HeadersAction(context, options);
            options.type = "col";
            return cmd.execute(context, options, isUndo);
        }
    };

    Commands[ROW_HEADERS] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new HeadersAction(context, options);
            options.type = "row";
            return cmd.execute(context, options, isUndo);
        }
    };

    var TabColorAction = (function (_super) {
        designer.extends(TabColorAction, _super);

        function TabColorAction(spread, options) {
            _super.call(this, spread, options);
        }

        TabColorAction.prototype.executeImp = function (context, options, isUndo) {
            var value = options.commandOptions.value;
            if (!value) {
                return false;
            }
            if (value.name) {
                runCommand(context, "setSheetTabColor", commands_setSheetTabColor, {
                    value: value.name,
                    selections: options.selections,
                    sheetName: options.sheetName
                });
            } else {
                runCommand(context, "setSheetTabColor", commands_setSheetTabColor, {
                    value: value.color,
                    selections: options.selections,
                    sheetName: options.sheetName
                });
            }
        };
        return TabColorAction;
    })(DesignerActionBase);
    Commands[TAB_COLOR] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new TabColorAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    //#region chart context menu comman
    Commands[CHANGE_CHART_TYPE_DIALOG] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            if (!designer.ribbon.selectChartDialog) {
                designer.ribbon.selectChartDialog = new designer.SelectChartDialog();
            }
            var selectedChart = chartHelper.getSelectedChart(context.getSheetFromName(options.sheetName));
            designer.ribbon.selectChartDialog.open(designer.SelectChartDialog.dialogType.changeChartType, selectedChart);
        }
    };

    Commands[SELECT_CHART_DATA_DIALOG] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            if (!designer.ribbon.chartSelectDataDialog) {
                designer.ribbon.chartSelectDataDialog = new designer.ChartSelectDataDialog();
            }
            var selectedChart = chartHelper.getSelectedChart(context.getSheetFromName(options.sheetName));
            designer.ribbon.chartSelectDataDialog.open(selectedChart);
        }
    };

    Commands[MOVE_CHART_DIALOG] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            if (!designer.ribbon.moveChartDialog) {
                designer.ribbon.moveChartDialog = new designer.MoveChartDialog();
            }
            designer.ribbon.moveChartDialog.open();
        }
    };

    Commands[FORMAT_CHART] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var sheet = context.getSheetFromName(options.sheetName);
            options.commandOptions.chart = chartHelper.getSelectedChart(sheet);
            designer.ribbon.chartDoubleClicked(null, options.commandOptions);
        }
    };


    var ResetChartColorAction = (function (_super) {
        designer.extends(ResetChartColorAction, _super);

        function ResetChartColorAction(spread, options) {
            _super.call(this, spread, options);
        }

        ResetChartColorAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var sheet = self._sheet;
            var selectedChart = chartHelper.getSelectedChart(sheet);
            if (selectedChart) {
                var defaultColor = selectedChart.colorAndStyle && selectedChart.colorAndStyle.color;
                chartHelper.applyChartSeriesTheme(selectedChart, defaultColor || {});
                triggerChartChanged(selectedChart);
            }
        };
        return ResetChartColorAction;
    })(DesignerActionBase);
    Commands[RESET_CHART_COLOR] = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new ResetChartColorAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };


    Commands[FLOATING_OBJECT_COPY] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            context.commandManager().execute({ cmd: "copyFloatingObjects", sheetName: options.sheetName });
        }
    };

    Commands[FLOATING_OBJECT_CUT] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            context.commandManager().execute({ cmd: "cutFloatingObjects", sheetName: options.sheetName });
        }
    };
    //#endregion


    function runCommand(spread, name, command, options) {
        var commandManager = spread.commandManager();
        var commandName = "designer." + name;
        console.log('spreadActions.js: runCommand ', commandName);
        if (!commandManager.getCommand(commandName)) {
            commandManager.register(commandName, command, null, false, false, false, false);
        }
        options.cmd = commandName;
        commandManager.execute(options);
    }

    //#endregion
    //#region Font Actions

    var SetFontFamilytAction = (function (_super) {
        designer.extends(SetFontFamilytAction, _super);

        //value parameter is a font family string, for example, "Arial", "Verdana" etc
        function SetFontFamilytAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetFontFamilytAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.setStyle("font-family", "font", options.value, options);
            self.updateRibbon();
        };
        return SetFontFamilytAction;
    })(DesignerActionBase);
    var commands_setFontFamily = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetFontFamilytAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    //value parameter is a font family string, for example, "Arial", "Verdana" etc
    function setFontFamily(spread, paramters) {
        runCommand(spread, "setFontFamily", commands_setFontFamily, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setFontFamily = setFontFamily;

    var SetFontSizeAction = (function (_super) {
        designer.extends(SetFontSizeAction, _super);

        //value parameter is a font size string with pt unit, for example, "11pt", "20pt"
        function SetFontSizeAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetFontSizeAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.setStyle("font-size", "font", options.value, options);
            self.updateRibbon();
        };
        return SetFontSizeAction;
    })(DesignerActionBase);
    var commands_setFontSize = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetFontSizeAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    //value parameter is a font size string with pt unit, for example, "11pt", "20pt"
    function setFontSize(spread, paramters) {
        runCommand(spread, "setFontSize", commands_setFontSize, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setFontSize = setFontSize;

    var SetFontWeightAction = (function (_super) {
        designer.extends(SetFontWeightAction, _super);

        //value parameter is a font weight string including 2 memebers, "bold" and "normal"
        function SetFontWeightAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetFontWeightAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            //var ret = self.undoSetStyle("font", options);
            //self.updateRibbon();
            //return ret;
            self.setStyle("font-weight", "font", options.value, options);
            self.updateRibbon();
        };
        return SetFontWeightAction;
    })(DesignerActionBase);
    var commands_setFontWeight = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetFontWeightAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    //value parameter is a font weight string including 2 memebers, "bold" and "normal"
    function setFontWeight(spread, paramters) {
        runCommand(spread, "setFontWeight", commands_setFontWeight, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setFontWeight = setFontWeight;

    var SetUnderlineAction = (function (_super) {
        designer.extends(SetUnderlineAction, _super);

        function SetUnderlineAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetUnderlineAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var flag = GC.Spread.Sheets.TextDecorationType.underline;
            self.setStyle("textDecoration", "textDecoration", options.value, options, self.getTextDecoration, [flag]);
            self.updateRibbon();
        };
        return SetUnderlineAction;
    })(DesignerActionBase);
    var commands_setUnderline = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetUnderlineAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setUnderline(spread, paramters) {
        runCommand(spread, "setUnderline", commands_setUnderline, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setUnderline = setUnderline;

    var SetDoubleUnderlineAction = (function (_super) {
        designer.extends(SetDoubleUnderlineAction, _super);
        function SetDoubleUnderlineAction(spread, options) {
            _super.call(this, spread, options);
        }
        SetDoubleUnderlineAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var flag = GC.Spread.Sheets.TextDecorationType.doubleUnderline;
            self.setStyle("textDecoration", "textDecoration", options.value, options, self.getTextDecoration, [flag]);
            self.updateRibbon();
        };
        return SetDoubleUnderlineAction;
    })(DesignerActionBase);
    var commands_setDoubleUnderline = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetDoubleUnderlineAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    function setDoubleUnderline(spread, paramters) {
        runCommand(spread, "setDoubleUnderline", commands_setDoubleUnderline, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }
    spreadActions.setDoubleUnderline = setDoubleUnderline;
    var SetFontStyleAction = (function (_super) {
        designer.extends(SetFontStyleAction, _super);

        //value parameter is a font weight string including 2 memebers, "italic" and "normal"
        function SetFontStyleAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetFontStyleAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.setStyle("font-style", "font", options.value, options);
            self.updateRibbon();
        };
        return SetFontStyleAction;
    })(DesignerActionBase);
    var commands_setFontStyle = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetFontStyleAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    //value parameter is a font weight string including 2 memebers, "italic" and "normal"
    function setFontStyle(spread, paramters) {
        runCommand(spread, "setFontStyle", commands_setFontStyle, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setFontStyle = setFontStyle;

    //#endregion
    //#region BackColor/ForeColor Actions
    var SetBackColorAction = (function (_super) {
        designer.extends(SetBackColorAction, _super);

        //value parameter is a color string, for example, "red","blue","rgb(100,100,100)" etc
        function SetBackColorAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetBackColorAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.setStyle("backColor", "backColor", options.value, options);
            self.updateRibbon();
        };
        return SetBackColorAction;
    })(DesignerActionBase);
    var commands_setBackColor = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetBackColorAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    //value parameter is a color string, for example, "red","blue","rgb(100,100,100)" etc
    function setBackColor(spread, paramters) {
        runCommand(spread, "setBackColor", commands_setBackColor, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setBackColor = setBackColor;

    var SetForeColorAction = (function (_super) {
        designer.extends(SetForeColorAction, _super);

        //value parameter is a color string, for example, "red","blue","rgb(100,100,100)" etc
        function SetForeColorAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetForeColorAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.setStyle("foreColor", "foreColor", options.value, options);
            self.updateRibbon();
        };
        return SetForeColorAction;
    })(DesignerActionBase);
    var commands_setForeColor = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetForeColorAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    //value parameter is a color string, for example, "red","blue","rgb(100,100,100)" etc
    function setForeColor(spread, paramters) {
        runCommand(spread, "setForeColor", commands_setForeColor, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setForeColor = setForeColor;

    //#endregion

    //#region HorizontalAlign/VerticalAlign Actions
    var SetHAlignAction = (function (_super) {
        designer.extends(SetHAlignAction, _super);

        //value parameter is HorizontalAlign enum, including left,center and right.
        function SetHAlignAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetHAlignAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.setStyle("hAlign", "hAlign", options.value, options);
            self.updateRibbon();
        };
        return SetHAlignAction;
    })(DesignerActionBase);
    var commands_setHAlign = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetHAlignAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    //value parameter is HorizontalAlign enum, including left,center and right.
    function setHAlign(spread, paramters) {
        runCommand(spread, "setHAlign", commands_setHAlign, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setHAlign = setHAlign;

    var SetVAlignAction = (function (_super) {
        designer.extends(SetVAlignAction, _super);

        //value parameter is Vertical enum, including top,center and bottom.
        function SetVAlignAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetVAlignAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.setStyle("vAlign", "vAlign", options.value, options);
            self.updateRibbon();
        };
        return SetVAlignAction;
    })(DesignerActionBase);
    var commands_setVAlign = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetVAlignAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    //value parameter is VerticalAlign enum, including left,center and right.
    function setVAlign(spread, paramters) {
        runCommand(spread, "setVAlign", commands_setVAlign, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setVAlign = setVAlign;

    //#endregion
    //#region Number Format Actions
    var SetFormatterAction = (function (_super) {
        designer.extends(SetFormatterAction, _super);

        function SetFormatterAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetFormatterAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.setStyle("formatter", "formatter", options.value, options);
            self.updateRibbon();
        };
        return SetFormatterAction;
    })(DesignerActionBase);
    var commands_setFormatter = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetFormatterAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    //Set cell's formatter
    function setFormatter(spread, paramters) {
        runCommand(spread, "setFormatter", commands_setFormatter, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setFormatter = setFormatter;

    //Increase Decimal
    var IncreaseDecimal = (function (_super) {
        designer.extends(IncreaseDecimal, _super);

        function IncreaseDecimal(spread, options) {
            _super.call(this, spread, options);
        }

        IncreaseDecimal.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.setStyle("formatter", options);
        };
        IncreaseDecimal.prototype.setStyle = function (attribute, options) {
            var self = this, formatString, zero, numberSign, decimalPoint, zeroPointZero;
            for (var p = 0; p < self._selections.length; p++) {
                var selectCells = self._selections[p];
                var defaultActiveCell = self._sheet.getCell(selectCells.row, selectCells.col);
                var defaultFormatter = defaultActiveCell.formatter();
                var defaultText = defaultActiveCell.value();
                var i;
                if (defaultText !== keyword_undefined && defaultText !== null) {
                    zero = "0";
                    numberSign = "#";
                    decimalPoint = ".";
                    zeroPointZero = "0" + decimalPoint + "0";

                    var scientificNotationCheckingFormatter = self.getScientificNotationCheckingFormattter(defaultFormatter);
                    if (!defaultFormatter || (defaultFormatter === "General" || (scientificNotationCheckingFormatter && (scientificNotationCheckingFormatter.indexOf("E") >= 0 || scientificNotationCheckingFormatter.indexOf('e') >= 0)))) {
                        scientificNotationCheckingFormatter = zeroPointZero;
                        if ((!isNaN(defaultText)) && ((defaultText + "").split(".").length > 1)) {

                            var afterPointZero = (defaultText + "").split(".")[1].length;
                            for (var m = 0; m < afterPointZero; m++) {
                                scientificNotationCheckingFormatter = scientificNotationCheckingFormatter + "0";
                            }
                        }
                    } else {
                        formatString = defaultFormatter;
                        var formatters = formatString.split(';');
                        for (i = 0; i < formatters.length && i < 2; i++) {
                            if (formatters[i] && formatters[i].indexOf("/") < 0 && formatters[i].indexOf(":") < 0 && formatters[i].indexOf("?") < 0) {
                                var indexOfDecimalPoint = formatters[i].lastIndexOf(decimalPoint);
                                if (indexOfDecimalPoint !== -1) {
                                    formatters[i] = formatters[i].slice(0, indexOfDecimalPoint + 1) + zero + formatters[i].slice(indexOfDecimalPoint + 1);
                                } else {
                                    var indexOfZero = formatters[i].lastIndexOf(zero);
                                    var indexOfNumberSign = formatters[i].lastIndexOf(numberSign);
                                    var insertIndex = indexOfZero > indexOfNumberSign ? indexOfZero : indexOfNumberSign;
                                    if (insertIndex >= 0) {
                                        formatters[i] = formatters[i].slice(0, insertIndex + 1) + decimalPoint + zero + formatters[i].slice(insertIndex + 1);
                                    }
                                }
                            }
                        }
                        formatString = formatters.join(";");
                        scientificNotationCheckingFormatter = formatString;
                    }
                    for (var r = selectCells.row; r < selectCells.rowCount + selectCells.row; r++) {
                        for (var c = selectCells.col; c < selectCells.colCount + selectCells.col; c++) {
                            var style = self._sheet.getActualStyle(r, c);
                            style.formatter = scientificNotationCheckingFormatter;
                            self._sheet.setStyle(r, c, style);
                        }
                    }
                }
            }
        };

        //This method is used to get the formatter which not include the string and color
        //in order to not misleading with the charactor 'e' / 'E' in scientific notation.
        IncreaseDecimal.prototype.getScientificNotationCheckingFormattter = function (formatter) {
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

        IncreaseDecimal.prototype.getSubStrings = function (source, beginChar, endChar) {
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
        return IncreaseDecimal;
    })(DesignerActionBase);
    var commands_increaseDecimal = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new IncreaseDecimal(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function increaseDecimal(spread, paramters) {
        var sheet = paramters.sheet;
        var activeRowIndex = sheet.getActiveRowIndex();
        var activeColIndex = sheet.getActiveColumnIndex();
        runCommand(spread, "increaseDecimal", commands_increaseDecimal, {
            selections: paramters.selections,
            activeRowIndex: activeRowIndex,
            activeColIndex: activeColIndex,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.increaseDecimal = increaseDecimal;

    //Decrease Decimal
    var DecreaseDecimal = (function (_super) {
        designer.extends(DecreaseDecimal, _super);

        function DecreaseDecimal(spread, options) {
            _super.call(this, spread, options);
        }

        DecreaseDecimal.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.setStyle("formatter", options);
        };
        DecreaseDecimal.prototype.setStyle = function (attribute, options) {
            var self = this, decimalPoint;
            for (var p = 0; p < self._selections.length; p++) {
                var selectCells = self._selections[p];
                var defaultActiveCell = self._sheet.getCell(selectCells.row, selectCells.col);
                var defaultFormatter = defaultActiveCell.formatter();
                var defaultText = defaultActiveCell.value();
                decimalPoint = ".";
                var i;
                if (defaultText !== keyword_undefined && defaultText !== null) {
                    var formatString = null;
                    if (!defaultFormatter || defaultFormatter === "General") {
                        if (!isNaN(defaultText)) {
                            var result = defaultText.split('.');
                            if (result.length === 2) {
                                result[0] = "0";
                                var isScience = false;
                                var sb = "";
                                for (i = 0; i < result[1].length - 1; i++) {
                                    if ((i + 1 < result[1].length) && (result[1].charAt(i + 1) === 'e' || result[1].charAt(i + 1) === 'E')) {
                                        isScience = true;
                                        break;
                                    }
                                    sb = sb + ('0');
                                }

                                if (isScience) {
                                    sb = sb + ("E+00");
                                }
                                result[1] = sb.toString();
                                formatString = result[0] + (result[1] !== "" ? decimalPoint + result[1] : "");
                            }
                        }
                    } else {
                        formatString = defaultFormatter;
                        var formatters = formatString.split(';');
                        for (i = 0; i < formatters.length && i < 2; i++) {
                            if (formatters[i] && formatters[i].indexOf("/") < 0 && formatters[i].indexOf(":") < 0 && formatters[i].indexOf("?") < 0) {
                                var indexOfDecimalPoint = formatters[i].lastIndexOf(decimalPoint);
                                if (indexOfDecimalPoint !== -1 && indexOfDecimalPoint + 1 < formatters[i].length) {
                                    formatters[i] = formatters[i].slice(0, indexOfDecimalPoint + 1) + formatters[i].slice(indexOfDecimalPoint + 2);
                                    var tempString = indexOfDecimalPoint + 1 < formatters[i].length ? formatters[i].substr(indexOfDecimalPoint + 1, 1) : "";
                                    if (tempString === "" || tempString !== "0") {
                                        formatters[i] = formatters[i].slice(0, indexOfDecimalPoint) + formatters[i].slice(indexOfDecimalPoint + 1);
                                    }
                                } else {
                                    //do nothing.
                                }
                            }
                        }
                        formatString = formatters.join(";");
                    }
                    for (var r = selectCells.row; r < selectCells.rowCount + selectCells.row; r++) {
                        for (var c = selectCells.col; c < selectCells.colCount + selectCells.col; c++) {
                            var style = self._sheet.getActualStyle(r, c);
                            style.formatter = formatString;
                            self._sheet.setStyle(r, c, style);
                        }
                    }
                }
            }
        };
        return DecreaseDecimal;
    })(DesignerActionBase);
    var commands_decreaseDecimal = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new DecreaseDecimal(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function decreaseDecimal(spread, paramters) {
        var sheet = paramters.sheet;
        var activeRowIndex = sheet.getActiveRowIndex();
        var activeColIndex = sheet.getActiveColumnIndex();
        runCommand(spread, "decreaseDecimal", commands_decreaseDecimal, {
            selections: paramters.selections,
            activeRowIndex: activeRowIndex,
            activeColIndex: activeColIndex,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.decreaseDecimal = decreaseDecimal;

    //#endregion
    //#region Border Actions
    //Set selection ranges' border. Value is a object with {lineborder:LineBorder, options:any}
    var SetBorderAction = (function (_super) {
        designer.extends(SetBorderAction, _super);

        function SetBorderAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetBorderAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var selections = self.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = selections[i];
                self.setRangeBorder(selection, options.value);
            }
        };

        SetBorderAction.prototype.setRangeBorder = function (range, value) {
            var sheet = this._sheet;
            var startRow = range.row, startCol = range.col, rowCount = range.rowCount, colCount = range.colCount;
            sheet.getRange(startRow, startCol, rowCount, colCount).setBorder(value.lineborder, value.options);
        };
        return SetBorderAction;
    })(DesignerActionBase);
    var commands_setBorder = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetBorderAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    //options include:all,top,left,bottom,top,outline,inside, innerHorizontal, and innerVertical, for example, {left:true, right:true}
    function setBorder(spread, paramters) {
        runCommand(spread, "setBorder", commands_setBorder, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setBorder = setBorder;

    var setAllBorderAction = (function (_super) {
        designer.extends(setAllBorderAction, _super);
        function setAllBorderAction(spread, options) {
            _super.call(this, spread, options);
        }
        setAllBorderAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var selections = self.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = selections[i];
                var borderType = options.borderType;
                var orignalBorder = options.orignalBorder;
                if (!self.borderLineEquals(borderType.topLineBorder, orignalBorder.borderTop)) {
                    self.setRangeBorder(selection, {
                        lineborder: borderType.topLineBorder,
                        options: { top: true }
                    });
                }
                if (!self.borderLineEquals(borderType.bottomLineBorder, orignalBorder.borderBottom)) {
                    self.setRangeBorder(selection, {
                        lineborder: borderType.bottomLineBorder,
                        options: { bottom: true }
                    });
                }
                if (!self.borderLineEquals(borderType.rightLineBorder, orignalBorder.borderRight)) {
                    self.setRangeBorder(selection, {
                        lineborder: borderType.rightLineBorder,
                        options: { right: true }
                    });
                }
                if (!self.borderLineEquals(borderType.leftLineBorder, orignalBorder.borderLeft)) {
                    self.setRangeBorder(selection, {
                        lineborder: borderType.leftLineBorder,
                        options: { left: true }
                    });
                }
                if (!self.borderLineEquals(borderType.innerHorizontalLineBorder, orignalBorder.borderHorizontal)) {
                    self.setRangeBorder(selection, {
                        lineborder: borderType.innerHorizontalLineBorder,
                        options: { innerHorizontal: true }
                    });
                }
                if (!self.borderLineEquals(borderType.innerVerticalLineBorder, orignalBorder.borderVertical)) {
                    self.setRangeBorder(selection, {
                        lineborder: borderType.innerVerticalLineBorder,
                        options: { innerVertical: true }
                    });
                }
                if (!self.borderLineEquals(borderType.diagonalUpBorder, orignalBorder.diagonalUpBorder)) {
                    self.setRangeBorder(selection, {
                        lineborder: borderType.diagonalUpBorder,
                        options: { diagonalUp: true }
                    });
                }
                if (!self.borderLineEquals(borderType.diagonalDownBorder, orignalBorder.diagonalDownBorder)) {
                    self.setRangeBorder(selection, {
                        lineborder: borderType.diagonalDownBorder,
                        options: { diagonalDown: true }
                    });
                }
            }
        };
        setAllBorderAction.prototype.borderLineEquals = function (line1, line2) {
            if (line1 === line2) {
                return true;
            }
            if (!line1 || !line2) {
                return false;
            }
            return line1.style === line2.style && line1.level === line2.level && line1.color === line2.color;
        };
        setAllBorderAction.prototype.setRangeBorder = function (range, value) {
            var sheet = this._sheet;
            var startRow = range.row, startCol = range.col, rowCount = range.rowCount, colCount = range.colCount;
            sheet.getRange(startRow, startCol, rowCount, colCount).setBorder(value.lineborder, value.options);
        };
        return setAllBorderAction;
    })(DesignerActionBase);
    var commands_setAllBorder = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new setAllBorderAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    function setAllBorder(spread, paramters) {
        runCommand(spread, "setAllBorder", commands_setAllBorder, {
            orignalBorder: paramters.options.orignalBorder,
            borderType: paramters.options.borderType,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }
    spreadActions.setAllBorder = setAllBorder;
    //#endregion
    //#region Indent Actions
    var SetIndentAction = (function (_super) {
        designer.extends(SetIndentAction, _super);
        //value parameter is a number, if number is greater than 0, that means to increase indent, otherwise, to decrease indent.
        //In most of case, please pass 1 or -1 to value parameter.
        function SetIndentAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetIndentAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.setIndent(options);
            self.updateRibbon();
        };
        SetIndentAction.prototype.setIndent = function (options) {
            var self = this;
            self.execInSelections(self._sheet, function (sheet, row, column) {
                var actualStyle = sheet.getActualStyle(row, column);
                var style = sheet.getStyle(row, column);
                if (!style) {
                    style = new Sheets.Style();
                }
                var oldIndent = actualStyle.textIndent || style.textIndent;
                if (isNaN(oldIndent)) {
                    oldIndent = 0;
                }
                var newIndent = oldIndent + options.value;
                if (newIndent < 0) {
                    newIndent = 0;
                }
                style.textIndent = newIndent;
                sheet.setStyle(row, column, style);
                sheet.outlineColumn.refresh();
            });
        };
        return SetIndentAction;
    })(DesignerActionBase);
    var commands_setIndent = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetIndentAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    //value parameter is a number, if number is greater than 0, that means to increase indent, otherwise, to decrease indent.
    function setIndent(spread, paramters) {
        runCommand(spread, "setIndent", commands_setIndent, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setIndent = setIndent;

    //#endregion
    var SetTextOrientationAction = (function (_super) {
        designer.extends(SetTextOrientationAction, _super);
        //In most of case, please pass 1 or -1 to value parameter.
        function SetTextOrientationAction(spread, options) {
            _super.call(this, spread, options);
        }
        SetTextOrientationAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            if (options.value === true || options.value === false) {
                self.setStyle("isVerticalText", "isVerticalText", options.value, options);
            } else {
                self.setStyle("textOrientation", "textOrientation", options.value, options);
            }
            self.updateRibbon();
        };
        return SetTextOrientationAction;
    })(DesignerActionBase);
    var commands_setTextOrientation = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetTextOrientationAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    function setTextOrientation(spread, paramters) {
        runCommand(spread, "setTextOrientation", commands_setTextOrientation, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }
    spreadActions.setTextOrientation = setTextOrientation;
    //#region WordWrap Actions
    var SetWordWrapAction = (function (_super) {
        designer.extends(SetWordWrapAction, _super);

        //value parameter is bool type. True means wraping text
        function SetWordWrapAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetWordWrapAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.setStyle("wordWrap", "wordWrap", options.value, options);
            self.updateRibbon();
        };
        return SetWordWrapAction;
    })(DesignerActionBase);
    var commands_setWordWrap = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetWordWrapAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    //value parameter is bool type. True means wraping text
    function setWordWrap(spread, paramters) {
        runCommand(spread, "setWordWrap", commands_setWordWrap, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setWordWrap = setWordWrap;

    //#endregion
    //#region Merge Actions
    var MergeCenterAction = (function (_super) {
        designer.extends(MergeCenterAction, _super);

        function MergeCenterAction(spread, options) {
            _super.call(this, spread, options);
        }
        MergeCenterAction.prototype.canExecute = function () {
            var flag = true, selections = this.getSelections(), len = selections.length;
            for (var i = 0; i < len; i++) {
                for (var j = i + 1; j < len; j++) {
                    if (selections[i].intersect(selections[j].row, selections[j].col, selections[j].rowCount, selections[j].colCount)) {
                        flag = false;
                        break;
                    }
                }
                if (!flag) {
                    break;
                }
            }
            return flag;

        };
        MergeCenterAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var selections = self.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = selections[i];
                var row = selection.row === -1 ? 0 : selection.row;
                var col = selection.col === -1 ? 0 : selection.col;
                self._sheet.addSpan(row, col, selection.rowCount, selection.colCount);
                var style = self._sheet.getStyle(row, col);
                if (!style) {
                    style = new Sheets.Style();
                }
                style.hAlign = 1 /* center */;
                self._sheet.setStyle(row, col, style);
            }
        };
        return MergeCenterAction;
    })(DesignerActionBase);
    var commands_mergeCenter = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new MergeCenterAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function mergeCenter(spread, paramters) {
        runCommand(spread, "mergeCenter", commands_mergeCenter, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.mergeCenter = mergeCenter;

    var MergeAcrossAction = (function (_super) {
        designer.extends(MergeAcrossAction, _super);

        function MergeAcrossAction(spread, options) {
            _super.call(this, spread, options);
        }

        MergeAcrossAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var selections = self.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = selections[i];
                var row = selection.row === -1 ? 0 : selection.row;
                var col = selection.col === -1 ? 0 : selection.col;

                for (var m = 0; m < selection.rowCount; m++) {
                    for (var n = 0; n < selection.colCount; n++) {
                        self._sheet.removeSpan(row + m, col + n);
                    }
                }

                for (var j = 0; j < selection.rowCount; j++) {
                    self._sheet.addSpan(row + j, col, 1, selection.colCount);
                }
            }
        };
        return MergeAcrossAction;
    })(DesignerActionBase);
    var commands_mergeAcross = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new MergeAcrossAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function mergeAcross(spread, paramters) {
        runCommand(spread, "mergeAcross", commands_mergeAcross, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.mergeAcross = mergeAcross;

    var MergeCellsAction = (function (_super) {
        designer.extends(MergeCellsAction, _super);

        function MergeCellsAction(spread, options) {
            _super.call(this, spread, options);
        }

        MergeCellsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var selections = self.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = selections[i];
                var row = selection.row === -1 ? 0 : selection.row;
                var col = selection.col === -1 ? 0 : selection.col;
                self._sheet.addSpan(row, col, selection.rowCount, selection.colCount);
            }
        };
        return MergeCellsAction;
    })(DesignerActionBase);
    var commands_mergeCells = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new MergeCellsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function mergeCells(spread, paramters) {
        runCommand(spread, "mergeCells", commands_mergeCells, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.mergeCells = mergeCells;

    var UnMergeCellsAction = (function (_super) {
        designer.extends(UnMergeCellsAction, _super);

        function UnMergeCellsAction(spread, options) {
            _super.call(this, spread, options);
        }

        UnMergeCellsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var selections = self.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = selections[i];
                var row = selection.row === -1 ? 0 : selection.row;
                var col = selection.col === -1 ? 0 : selection.col;
                for (var m = 0; m < selection.rowCount; m++) {
                    for (var n = 0; n < selection.colCount; n++) {
                        self._sheet.removeSpan(row + m, col + n);
                    }
                }
            }
        };
        return UnMergeCellsAction;
    })(DesignerActionBase);
    var commands_unmergeCells = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new UnMergeCellsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function unmergeCells(spread, paramters) {
        runCommand(spread, "unmergeCells", commands_unmergeCells, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.unmergeCells = unmergeCells;

    //#endregion
    //#region Insert/Delete Actions
    //#region Insert/Delete ActionBase
    var InsertAndDeleteBase = (function (_super) {
        designer.extends(InsertAndDeleteBase, _super);

        function InsertAndDeleteBase(spread, options) {
            _super.call(this, spread, options);
        }

        InsertAndDeleteBase.prototype.canDoInsertOrDeleteRow = function () {
            return true;
        };

        InsertAndDeleteBase.prototype.canDoInsertOrDeleteColumn = function () {
            return true;
        };

        InsertAndDeleteBase.prototype.getSortedRowSelections = function () {
            var sortedRanges = this.getSelections();
            for (var i = 0; i < sortedRanges.length - 1; i++) {
                for (var j = i + 1; j < sortedRanges.length; j++) {
                    if (sortedRanges[i].row < sortedRanges[j].row) {
                        var temp = sortedRanges[i];
                        sortedRanges[i] = sortedRanges[j];
                        sortedRanges[j] = temp;
                    }
                }
            }
            return sortedRanges;
        };

        InsertAndDeleteBase.prototype.getSortedColumnSelections = function () {
            var sortedRanges = this.getSelections();
            for (var i = 0; i < sortedRanges.length - 1; i++) {
                for (var j = i + 1; j < sortedRanges.length; j++) {
                    if (sortedRanges[i].col < sortedRanges[j].col) {
                        var temp = sortedRanges[i];
                        sortedRanges[i] = sortedRanges[j];
                        sortedRanges[j] = temp;
                    }
                }
            }
            return sortedRanges;
        };
        return InsertAndDeleteBase;
    })(DesignerActionBase);
    spreadActions.InsertAndDeleteBase = InsertAndDeleteBase;

    //#endregion
    //#region Insert/Delete Cells Actions
    //Insert right
    var InsertRightCellsAction = (function (_super) {
        designer.extends(InsertRightCellsAction, _super);

        function InsertRightCellsAction(spread, options) {
            _super.call(this, spread, options);
        }

        InsertRightCellsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            if (getSelectionTypeWithSelections(self.getSelections()) === 3 /* OnlyCells */) {
                var sortedRanges = self.getSortedColumnSelections();
                var colCount = self._sheet.getColumnCount();
                var canInsertRightRet = self.canInsertRight(sortedRanges);
                if (!canInsertRightRet.ret) {
                    var message = canInsertRightRet.type === TABLE ? designer.res.changePartOfTableWarning : designer.res.changePartOfArrayWarning;
                    designer.MessageBox.show(message, designer.res.title, 2 /* warning */, 0 /* ok */, function () {
                        $(".fill-content").focus();
                    });
                    return false;
                }
                for (var i = 0; i < sortedRanges.length; i++) {
                    var r = sortedRanges[i];
                    var option = GC.Spread.Sheets.CopyToOptions.all;
                    self._sheet.addColumns(colCount, r.colCount);
                    self._sheet.moveTo(r.row, r.col, r.row, r.col + r.colCount, r.rowCount, colCount - r.col, option);
                }
            }
        };

        InsertRightCellsAction.prototype.canInsertRight = function (sortedRanges) {
            var sheet = this._sheet;
            var result = true;
            for (var i = 0; i < sortedRanges.length; i++) {
                var range = sortedRanges[i];
                var arrayFormulaRanges = [];
                var row = range.row;
                var col = range.col;
                var endRow = range.row + range.rowCount;
                var endCol = range.col + range.colCount;
                var affectRange = new Range(row, col, endRow - row + 1, sheet.getColumnCount());
                var tableAffectRet = canShiftCell(sheet, affectRange);
                if (tableAffectRet) {
                    return tableAffectRet;
                }
                //find if the selection has a arrayFormula, if it has, push it's range to an Array
                for (var r = row; r < endRow; r++) {
                    for (var c = col; c < endCol; c++) {
                        var index;
                        for (index = 0; index < arrayFormulaRanges.length; index++) {
                            if (arrayFormulaRanges[index].contains(r, c)) {
                                break;
                            }
                        }
                        if (index === arrayFormulaRanges.length && sheet.getFormulaInformation(r, c).isArrayFormula) {
                            arrayFormulaRanges.push(sheet.getFormulaInformation(r, c).baseRange);
                        }
                    }
                }
                if (arrayFormulaRanges.length === 0) {
                    return { ret: result, type: ARRAY };
                }
                //find the border of all the arrayFormula Ranges.
                var left = arrayFormulaRanges[0].col;
                var top = arrayFormulaRanges[0].row;
                var bottom = arrayFormulaRanges[0].row + arrayFormulaRanges[0].rowCount;
                for (var j = 1; j < arrayFormulaRanges.length; j++) {
                    if (arrayFormulaRanges[j].col < left) {
                        left = arrayFormulaRanges[j].col;
                    }
                    if (arrayFormulaRanges[j].row < top) {
                        top = arrayFormulaRanges[j].row;
                    }
                    if (arrayFormulaRanges[j].row + arrayFormulaRanges[j].rowCount < bottom) {
                        bottom = arrayFormulaRanges[j].row + arrayFormulaRanges[j].rowCount;
                    }
                }
                //if meet these conditions, then can't insert and shift cells right
                if (left < range.col || top < range.row || bottom > range.row + range.rowCount) {
                    result = false;
                    break;
                }
            }
            return { ret: result, type: ARRAY };
        };
        return InsertRightCellsAction;
    })(InsertAndDeleteBase);
    var commands_insertRightCells = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            options.considerAllSheets = true;
            var cmd = new InsertRightCellsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function insertRightCells(spread, paramters) {
        runCommand(spread, "insertRightCells", commands_insertRightCells, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.insertRightCells = insertRightCells;

    function canShiftCell(sheet, affectRange) {
        var tables = sheet.tables.all(), tableRange;
        for (var t = 0; t < tables.length; t++) {
            tableRange = tables[t].range();
            if (!(affectRange.containsRange(tableRange) || tableRange.containsRange(affectRange)) &&
                affectRange.intersect(tableRange.row, tableRange.col, tableRange.rowCount, tableRange.colCount)) {
                return { ret: false, type: TABLE };
            }
        }
    }
    //Insert Down
    var InsertDownCellsAction = (function (_super) {
        designer.extends(InsertDownCellsAction, _super);

        function InsertDownCellsAction(spread, options) {
            _super.call(this, spread, options);
        }

        InsertDownCellsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            if (getSelectionTypeWithSelections(self.getSelections()) === 3 /* OnlyCells */) {
                var sortedRanges = self.getSortedRowSelections();
                var rowCount = self._sheet.getRowCount();
                var canInsertDownRet = self.canInsertDown(sortedRanges);
                if (!canInsertDownRet.ret) {
                    var message = canInsertDownRet.type === TABLE ? designer.res.changePartOfTableWarning : designer.res.changePartOfArrayWarning;
                    designer.MessageBox.show(message, designer.res.title, 2 /* warning */, 0 /* ok */, function () {
                        $(".fill-content").focus();
                    });
                    return false;
                }
                for (var i = 0; i < sortedRanges.length; i++) {
                    var r = sortedRanges[i];
                    var option = GC.Spread.Sheets.CopyToOptions.all;
                    self._sheet.addRows(rowCount, r.rowCount);
                    self._sheet.moveTo(r.row, r.col, r.row + r.rowCount, r.col, rowCount - r.row, r.colCount, option);
                }
            }
        };

        InsertDownCellsAction.prototype.canInsertDown = function (sortedRanges) {
            var sheet = this._sheet;
            var result = true;
            for (var i = 0; i < sortedRanges.length; i++) {
                var range = sortedRanges[i];
                var arrayFormulaRanges = [];
                var row = range.row;
                var col = range.col;
                var endRow = range.row + range.rowCount;
                var endCol = range.col + range.colCount;
                var affectRange = new Range(row, col, sheet.getRowCount(), endCol - col + 1);
                var tableAffectRet = canShiftCell(sheet, affectRange);
                if (tableAffectRet) {
                    return tableAffectRet;
                }
                //find if the selection has a arrayFormula, if it has, push it's range to an Array
                for (var r = row; r < endRow; r++) {
                    for (var c = col; c < endCol; c++) {
                        var index;
                        for (index = 0; index < arrayFormulaRanges.length; index++) {
                            if (arrayFormulaRanges[index].contains(r, c)) {
                                break;
                            }
                        }
                        if (index === arrayFormulaRanges.length && sheet.getFormulaInformation(r, c).isArrayFormula) {
                            arrayFormulaRanges.push(sheet.getFormulaInformation(r, c).baseRange);
                        }
                    }
                }
                if (arrayFormulaRanges.length === 0) {
                    return { ret: result, type: ARRAY };
                }
                //find the border of all the arrayFormula Ranges.
                var left = arrayFormulaRanges[0].col;
                var top = arrayFormulaRanges[0].row;
                var right = arrayFormulaRanges[0].col + arrayFormulaRanges[0].colCount;
                for (var j = 1; j < arrayFormulaRanges.length; j++) {
                    if (arrayFormulaRanges[j].col < left) {
                        left = arrayFormulaRanges[j].col;
                    }
                    if (arrayFormulaRanges[j].row < top) {
                        top = arrayFormulaRanges[j].row;
                    }
                    if (arrayFormulaRanges[j].col + arrayFormulaRanges[j].colCount < right) {
                        right = arrayFormulaRanges[j].row + arrayFormulaRanges[j].rowCount;
                    }
                }
                //if meet these conditions, then can't insert and shift cells down
                if (left < range.col || top < range.row || right > range.col + range.colCount) {
                    result = false;
                    break;
                }
            }
            return { ret: result, type: ARRAY };
        };
        return InsertDownCellsAction;
    })(InsertAndDeleteBase);
    var commands_insertDownCells = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            options.considerAllSheets = true;
            var cmd = new InsertDownCellsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function insertDownCells(spread, paramters) {
        runCommand(spread, "insertDownCells", commands_insertDownCells, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.insertDownCells = insertDownCells;

    //Delete left
    var DeleteLeftCellsAction = (function (_super) {
        designer.extends(DeleteLeftCellsAction, _super);

        function DeleteLeftCellsAction(spread, options) {
            _super.call(this, spread, options);
        }

        DeleteLeftCellsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var sortedRanges = self.getSortedColumnSelections();
            for (var i = 0; i < sortedRanges.length; i++) {
                var r = sortedRanges[i];
                var option = GC.Spread.Sheets.CopyToOptions.all;
                var copyColCount = self._sheet.getColumnCount() - (r.col + r.colCount);
                self._sheet.moveTo(r.row, r.col + r.colCount, r.row, r.col, r.rowCount, copyColCount, option);
                if (copyColCount <= r.colCount) { // means copyRowCount is not enough
                    var clearRow = r.row;
                    var clearCol = r.col + copyColCount;
                    var clearRangeColCount = r.col + r.colCount;
                    var clearRangeRowCount = r.rowCount;
                    self._sheet.clear(clearRow, clearCol, clearRangeRowCount, clearRangeColCount, 3, 32 /* Axis */ | 64 /* BindingPath */ | 1 /* Data */ | 16 /* Sparkline */ | 2 /* Style */ | 4 /* Comment */);
                }
            }
        };
        return DeleteLeftCellsAction;
    })(InsertAndDeleteBase);
    var commands_deleteLeftCells = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            options.considerAllSheets = true;
            var cmd = new DeleteLeftCellsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function deleteLeftCells(spread, paramters) {
        runCommand(spread, "deleteLeftCells", commands_deleteLeftCells, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.deleteLeftCells = deleteLeftCells;

    //Delete UP
    var DeleteUpCellsAction = (function (_super) {
        designer.extends(DeleteUpCellsAction, _super);

        function DeleteUpCellsAction(spread, options) {
            _super.call(this, spread, options);
        }

        DeleteUpCellsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var sortedRanges = self.getSortedRowSelections();
            for (var i = 0; i < sortedRanges.length; i++) {
                var r = sortedRanges[i];
                var option = GC.Spread.Sheets.CopyToOptions.all;
                var copyRowCount = self._sheet.getRowCount() - (r.row + r.rowCount);
                self._sheet.moveTo(r.row + r.rowCount, r.col, r.row, r.col, copyRowCount, r.colCount, option);
                if (copyRowCount <= r.rowCount) { // means copyRowCount is not enough
                    var clearRow = r.row + copyRowCount;
                    var clearCol = r.col;
                    var clearRangeColCount = r.colCount;
                    var clearRangeRowCount = r.row + r.rowCount;
                    self._sheet.clear(clearRow, clearCol, clearRangeRowCount, clearRangeColCount, 3, 32 /* Axis */ | 64 /* BindingPath */ | 1 /* Data */ | 16 /* Sparkline */ | 2 /* Style */ | 4 /* Comment */);
                }
            }
        };
        return DeleteUpCellsAction;
    })(InsertAndDeleteBase);
    var commands_deleteUpCells = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            options.considerAllSheets = true;
            var cmd = new DeleteUpCellsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function deleteUpCells(spread, paramters) {
        runCommand(spread, "deleteUpCells", commands_deleteUpCells, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.deleteUpCells = deleteUpCells;

    //#endregion
    //#region Insert/Delete Row Actions
    var InsertRowsAction = (function (_super) {
        designer.extends(InsertRowsAction, _super);

        function InsertRowsAction(spread, options) {
            _super.call(this, spread, options);
        }

        InsertRowsAction.prototype.canExecute = function () {
            return this.canDoInsertOrDeleteRow();
        };
        InsertRowsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var sortedRanges = self.getSortedRowSelections();
            for (var i = 0; i < sortedRanges.length; i++) {
                if (sortedRanges[i].row === -1 && sortedRanges[i].rowCount === 0) {
                    sortedRanges[i].row = 0;
                    sortedRanges[i].rowCount = 1;
                }
                self._sheet.addRows(sortedRanges[i].row, sortedRanges[i].rowCount);
                designer.util.setSpanStyleWhenInsertRowsColumns(self._sheet, sortedRanges[i].row, -1, sortedRanges[i].rowCount);
            }
        };

        return InsertRowsAction;
    })(InsertAndDeleteBase);
    var commands_insertRows = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            options.considerAllSheets = true;
            var cmd = new InsertRowsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function insertRows(spread, paramters) {
        runCommand(spread, "insertRows", commands_insertRows, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.insertRows = insertRows;

    var DeleteRowsAction = (function (_super) {
        designer.extends(DeleteRowsAction, _super);

        function DeleteRowsAction(spread, options) {
            _super.call(this, spread, options);
        }

        DeleteRowsAction.prototype.canExecute = function () {
            return this.canDoInsertOrDeleteRow() && !this._isTableHeaderInRange();
        };

        DeleteRowsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var sortedRanges = self.getSortedRowSelections();
            var sheet = self._sheet;
            var filterInfo = sheet.filterRowsVisibleInfo && sheet.filterRowsVisibleInfo.rowsVisibleInfo;
            var haveFilter = filterInfo && Object.keys(filterInfo).length > 0;
            for (var i = 0; i < sortedRanges.length; i++) {
                var range = sortedRanges[i];
                if (haveFilter) { //Fix SJS-1217 that delete rows should skip the filtered rows.
                    var zone = this.getUnFilteredRows(range, filterInfo);
                    for (var index = zone.length - 1; index >= 0; index--) {
                        sheet.deleteRows(zone[index][0], zone[index][1]);
                    }
                } else {
                    sheet.deleteRows(range.row, range.rowCount);
                }
            }
        };
        DeleteRowsAction.prototype.getUnFilteredRows = function (range, filterInfo) {
            var zone = [], start = -1, index;
            for (index = range.row; index < range.row + range.rowCount; index++) {
                if (filterInfo[index] !== false && start === -1) {
                    start = index;
                }
                if (filterInfo[index] === false && start !== -1) {
                    zone.push([start, index - start]);
                    start = -1;
                }
            }
            if (start !== -1) {
                zone.push([start, index - start]);
            }
            return zone;
        };

        DeleteRowsAction.prototype._isTableHeaderInRange = function () {
            var self = this;
            var sortedRanges = self.getSortedRowSelections();
            var tables = self._sheet.tables.all();
            for (var tableItem in tables) { /* NOSONAR: ForIn */
                for (var rangeItem in sortedRanges) {
                    if (tables[tableItem].headerIndex() === sortedRanges[rangeItem].row) {
                        return true;
                    }
                }
            }
            return false;
        };
        return DeleteRowsAction;
    })(InsertAndDeleteBase);
    var commands_deleteRows = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            options.considerAllSheets = true;
            var cmd = new DeleteRowsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function deleteRows(spread, paramters) {
        runCommand(spread, "deleteRows", commands_deleteRows, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.deleteRows = deleteRows;

    //#endregion
    //#region Insert/Delete Column Actions
    var InsertColumnsAction = (function (_super) {
        designer.extends(InsertColumnsAction, _super);

        function InsertColumnsAction(spread, options) {
            _super.call(this, spread, options);
        }

        InsertColumnsAction.prototype.canExecute = function () {
            return this.canDoInsertOrDeleteColumn();
        };
        InsertColumnsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var sortedRanges = self.getSortedColumnSelections();
            for (var i = 0; i < sortedRanges.length; i++) {
                if (sortedRanges[i].col === -1 && sortedRanges[i].colCount === 0) {
                    sortedRanges[i].col = 0;
                    sortedRanges[i].colCount = 1;
                }
                self._sheet.addColumns(sortedRanges[i].col, sortedRanges[i].colCount);
                designer.util.setSpanStyleWhenInsertRowsColumns(self._sheet, -1, sortedRanges[i].col, sortedRanges[i].colCount);
            }
        };

        return InsertColumnsAction;
    })(InsertAndDeleteBase);
    var commands_insertColumns = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            options.considerAllSheets = true;
            var cmd = new InsertColumnsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function insertColumns(spread, paramters) {
        runCommand(spread, "insertColumns", commands_insertColumns, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.insertColumns = insertColumns;

    var DeleteColumnsAction = (function (_super) {
        designer.extends(DeleteColumnsAction, _super);

        function DeleteColumnsAction(spread, options) {
            _super.call(this, spread, options);
        }

        DeleteColumnsAction.prototype.canExecute = function () {
            return this.canDoInsertOrDeleteColumn();
        };

        DeleteColumnsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var sortedRanges = self.getSortedColumnSelections();
            for (var i = 0; i < sortedRanges.length; i++) {
                self._sheet.deleteColumns(sortedRanges[i].col, sortedRanges[i].colCount);
            }
        };
        return DeleteColumnsAction;
    })(InsertAndDeleteBase);
    var commands_deleteColumns = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            options.considerAllSheets = true;
            var cmd = new DeleteColumnsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function deleteColumns(spread, paramters) {
        runCommand(spread, "deleteColumns", commands_deleteColumns, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.deleteColumns = deleteColumns;

    //#endregion
    //#region Insert/Delete Sheet Actions
    var InsertSheetAction = (function (_super) {
        designer.extends(InsertSheetAction, _super);

        function InsertSheetAction(spread, options) {
            _super.call(this, spread, options);
        }

        InsertSheetAction.prototype.execute = function (context, options, isUndo) {
            var self = this;
            if (self.canExecute()) {
                self.spread().addSheet(self.spread().getSheetIndex(self.sheet().name()));
                designer.actions.isFileModified = true;
                return true;
            } else {
                return false;
            }
        };
        return InsertSheetAction;
    })(DesignerActionBase);
    var commands_insertSheet = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new InsertSheetAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function insertSheet(spread, paramters) {
        runCommand(spread, "insertSheet", commands_insertSheet, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.insertSheet = insertSheet;

    var DeleteSheetAction = (function (_super) {
        designer.extends(DeleteSheetAction, _super);

        function DeleteSheetAction(spread, options) {
            _super.call(this, spread, options);
        }

        DeleteSheetAction.prototype.canExecute = function () {
            return this.spread().getSheetCount() > 1;
        };

        DeleteSheetAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            if (self.spread().getSheetCount() > 1) {
                self.spread().removeSheet(self.spread().getSheetIndex(self.sheet().name()));
                designer.actions.isFileModified = true;
                self.spread().undoManager().clear();
            } else {
                designer.MessageBox.show(designer.res.contextMenu.comments, designer.res.title, 2 /* warning */, 0 /* ok */);
                return false;
            }
        };
        return DeleteSheetAction;
    })(DesignerActionBase);
    var commands_deleteSheet = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new DeleteSheetAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function deleteSheet(spread, paramters) {
        runCommand(spread, "deleteSheet", commands_deleteSheet, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.deleteSheet = deleteSheet;

    //#endregion
    //#region Insert picture
    var InsertPictureAction = (function (_super) {
        designer.extends(InsertPictureAction, _super);

        function InsertPictureAction(spread, options) {
            _super.call(this, spread, options);
        }

        InsertPictureAction.prototype._getPictureName = function () {
            var self = this;
            var pictures = self._sheet.pictures.all();
            var len = pictures.length;
            var name = "";
            var names = [];
            for (var j = 0; j < len; j++) {
                names.push(pictures[j].name());
            }
            for (var i = 0; i < len; i++) {
                name = "picture" + i;
                if ($.inArray(name, names) < 0) {
                    return name;
                }
            }
            name = "picture" + len;
            return name;
        };

        InsertPictureAction.prototype._open = function (options) {
            var self = this;
            var startRow = options.activeRowIndex;
            var startCol = options.activeColIndex;
            var rowHeight = options.rowHeight;
            var colWidth = options.colWidth;
            try {
                var name = self._getPictureName();
                var path = options.fileName;
                self._sheet.pictures.add(name, path, startCol * colWidth, startRow * rowHeight);
                designer.actions.isFileModified = true;
            } catch (e) {
            }
        };

        InsertPictureAction.prototype.executeImp = function (context, options, isUndo) {
            this._open(options);
        };
        return InsertPictureAction;
    })(DesignerActionBase);
    var commands_insertPicture = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new InsertPictureAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function insertPicture(spread, paramters) {
        var sheet = paramters.sheet;
        var activeRowIndex = sheet.getActiveRowIndex();
        var activeColIndex = sheet.getActiveColumnIndex();
        var rowHeight = sheet.defaults.rowHeight;
        var colWidth = sheet.defaults.colWidth;
        runCommand(spread, "insertPicture", commands_insertPicture, {
            selections: paramters.selections,
            sheetName: paramters.sheetName,
            activeRowIndex: activeRowIndex,
            activeColIndex: activeColIndex,
            fileName: paramters.options,
            rowHeight: rowHeight,
            colWidth: colWidth
        });
    }

    spreadActions.insertPicture = insertPicture;

    //#endregion
    //#region Hide/UnHide Sheet Actions
    var hideSheetsStack = [];

    var HideSheetAction = (function (_super) {
        designer.extends(HideSheetAction, _super);

        function HideSheetAction(spread, options) {
            _super.call(this, spread, options);
        }

        HideSheetAction.prototype.canExecute = function () {
            var self = this;
            var sheets = self.spread().sheets;
            var visibleSheetCount = 0;
            for (var i = 0; i < sheets.length; i++) {
                if (sheets[i].visible()) {
                    visibleSheetCount++;
                }
            }
            var result = visibleSheetCount >= 2 ? true : false;
            if (!result) {
                designer.MessageBox.show(designer.res.contextMenu.comments, designer.res.title, 2 /* warning */, 0 /* ok */);
            } else {
                return result;
            }
        };

        HideSheetAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            if (self._sheet) {
                hideSheetsStack.push(self._sheet);
                self._sheet.visible(false);
                designer.wrapper.setFocusToSpread();
                designer.actions.isFileModified = true;
                designer.wrapper.spread.undoManager().clear();
            }
        };
        return HideSheetAction;
    })(DesignerActionBase);
    var commands_hideSheet = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new HideSheetAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function hideSheet(spread, paramters) {
        runCommand(spread, "hideSheet", commands_hideSheet, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.hideSheet = hideSheet;

    var UnhideSheetAction = (function (_super) {
        designer.extends(UnhideSheetAction, _super);

        function UnhideSheetAction(spread, options) {
            _super.call(this, spread, options);
            this._sheets = this.spread().sheets;
        }

        UnhideSheetAction.prototype.canExecute = function () {
            var self = this;
            var len = self._sheets.length;
            for (var i = 0; i < len; i++) {
                if (!self._sheets[i].visible()) {
                    return true;
                }
            }
            return false;
        };

        UnhideSheetAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var spread = self.spread();
            if (hideSheetsStack.length === 0) {
                var sheets = spread.sheets;
                for (var i = 0; i < sheets.length; i++) {
                    if (!sheets[i].visible()) {
                        hideSheetsStack.push(sheets[i]);
                    }
                }
            }
            if (hideSheetsStack.length > 0) {
                var tempSheet = hideSheetsStack.pop();
                tempSheet.visible(true);
                spread.setActiveSheet(tempSheet.name());
                designer.actions.isFileModified = true;
            }
            designer.wrapper.setFocusToSpread();
        };
        return UnhideSheetAction;
    })(DesignerActionBase);
    var commands_unhideSheet = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new UnhideSheetAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function unhideSheet(spread, paramters) {
        runCommand(spread, "unhideSheet", commands_unhideSheet, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.unhideSheet = unhideSheet;

    //#endregion
    //#endregion
    //#region Row Operation Actions
    //Set Row Height
    var SetRowsHeightAction = (function (_super) {
        designer.extends(SetRowsHeightAction, _super);

        function SetRowsHeightAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetRowsHeightAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.execInSelectionsForRow(self._sheet, function (sheet, row) {
                self._sheet.setRowHeight(row, options.height);
                rowHigh[row] = true;
            });
        };
        return SetRowsHeightAction;
    })(DesignerActionBase);
    var commands_setRowsHeight = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetRowsHeightAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setRowsHeight(spread, paramters) {
        runCommand(spread, "setRowsHeight", commands_setRowsHeight, {
            height: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setRowsHeight = setRowsHeight;

    //AutoFit Row
    var AutoFitRowsAction = (function (_super) {
        designer.extends(AutoFitRowsAction, _super);

        function AutoFitRowsAction(spread, options) {
            _super.call(this, spread, options);
        }

        AutoFitRowsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.execInSelectionsForRow(self._sheet, function (sheet, row) {
                self._sheet.autoFitRow(row);
                rowHigh[row] = false;
            });
        };
        return AutoFitRowsAction;
    })(DesignerActionBase);
    var commands_autofitRows = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new AutoFitRowsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function autofitRows(spread, paramters) {
        runCommand(spread, "autofitRows", commands_autofitRows, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.autofitRows = autofitRows;

    //Hide Row
    var HideRowsAction = (function (_super) {
        designer.extends(HideRowsAction, _super);

        function HideRowsAction(spread, options) {
            _super.call(this, spread, options);
        }

        HideRowsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.execInSelectionsForRow(self._sheet, function (sheet, row) {
                self._sheet.setRowVisible(row, false);
            });
        };
        return HideRowsAction;
    })(DesignerActionBase);
    var commands_hideRows = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new HideRowsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function hideRows(spread, paramters) {
        runCommand(spread, "hideRows", commands_hideRows, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.hideRows = hideRows;

    //UnHide Row
    var UnHideRowsAction = (function (_super) {
        designer.extends(UnHideRowsAction, _super);

        function UnHideRowsAction(spread, options) {
            _super.call(this, spread, options);
        }

        function setRowVisible(sheet, row) {
            sheet.setRowVisible(row, true);
        }

        UnHideRowsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var sheet = self._sheet;
            var selections = self.getSelections();
            if (selections.length === 1 && selections[0].rowCount === 1) {
                var selection = selections[0];
                var firstVisibleRow = 0;
                for (var r = 0; r <= selection.row; r++) {
                    if (sheet.getRowVisible(r)) {
                        firstVisibleRow = r;
                        break;
                    }
                }
                if (selection.row === firstVisibleRow || firstVisibleRow !== 0) {
                    sheet.setRowVisible(firstVisibleRow - 1, true);
                    sheet.showRow(firstVisibleRow - 1);
                }
            } else {
                self.execInSelectionsForRow(sheet, setRowVisible);
            }
        };
        return UnHideRowsAction;
    })(DesignerActionBase);
    var commands_unHideRows = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new UnHideRowsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function unHideRows(spread, paramters) {
        runCommand(spread, "unHideRows", commands_unHideRows, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.unHideRows = unHideRows;

    //Default Row Height
    var SetDefaultRowHeightAction = (function (_super) {
        designer.extends(SetDefaultRowHeightAction, _super);

        function SetDefaultRowHeightAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetDefaultRowHeightAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._sheet.defaults.rowHeight = options.height;
        };
        return SetDefaultRowHeightAction;
    })(DesignerActionBase);
    var commands_defaultRowHeight = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetDefaultRowHeightAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function defaultRowHeight(spread, paramters) {
        runCommand(spread, "defaultRowHeight", commands_defaultRowHeight, {
            height: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.defaultRowHeight = defaultRowHeight;

    //#endregion
    //#region Column Operation Actions
    //Set Column Width
    var SetColumnsWidthtAction = (function (_super) {
        designer.extends(SetColumnsWidthtAction, _super);

        function SetColumnsWidthtAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetColumnsWidthtAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.execInSelectionsForCol(self._sheet, function (sheet, column) {
                self._sheet.setColumnWidth(column, options.width);
            });
        };
        return SetColumnsWidthtAction;
    })(DesignerActionBase);
    var commands_setColumnsWidth = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetColumnsWidthtAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setColumnsWidth(spread, paramters) {
        runCommand(spread, "setColumnsWidth", commands_setColumnsWidth, {
            width: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setColumnsWidth = setColumnsWidth;

    //AutoFit Column
    var AutoFitColumnsAction = (function (_super) {
        designer.extends(AutoFitColumnsAction, _super);

        function AutoFitColumnsAction(spread, options) {
            _super.call(this, spread, options);
        }

        AutoFitColumnsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.execInSelectionsForCol(self._sheet, function (sheet, column) {
                self._sheet.autoFitColumn(column);
            });
        };
        return AutoFitColumnsAction;
    })(DesignerActionBase);
    var commands_autofitColumns = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new AutoFitColumnsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function autofitColumns(spread, paramters) {
        runCommand(spread, "autofitColumns", commands_autofitColumns, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.autofitColumns = autofitColumns;

    //Hide Column
    var HideColumnsAction = (function (_super) {
        designer.extends(HideColumnsAction, _super);

        function HideColumnsAction(spread, options) {
            _super.call(this, spread, options);
        }

        HideColumnsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.execInSelectionsForCol(self._sheet, function (sheet, column) {
                self._sheet.setColumnVisible(column, false);
            });
        };
        return HideColumnsAction;
    })(DesignerActionBase);
    var commands_hideColumns = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new HideColumnsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function hideColumns(spread, paramters) {
        runCommand(spread, "hideColumns", commands_hideColumns, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.hideColumns = hideColumns;

    //UnHide Column
    var UnHideColumnsAction = (function (_super) {
        designer.extends(UnHideColumnsAction, _super);

        function UnHideColumnsAction(spread, options) {
            _super.call(this, spread, options);
        }

        function setColumnVisible(sheet, column) {
            sheet.setColumnVisible(column, true);
        }

        UnHideColumnsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var sheet = self._sheet;
            var selections = self.getSelections();
            if (selections.length === 1 && selections[0].colCount === 1) {
                var selection = selections[0];
                var firstVisibleColumn = 0;
                for (var c = 0; c <= selection.col; c++) {
                    if (sheet.getColumnVisible(c)) {
                        firstVisibleColumn = c;
                        break;
                    }
                }
                if (selection.col === firstVisibleColumn || firstVisibleColumn !== 0) {
                    sheet.setColumnVisible(firstVisibleColumn - 1, true);
                    sheet.showColumn(firstVisibleColumn - 1);
                }
            } else {
                self.execInSelectionsForCol(sheet, setColumnVisible);
            }
        };
        return UnHideColumnsAction;
    })(DesignerActionBase);
    var commands_unHideColumns = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new UnHideColumnsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function unHideColumns(spread, paramters) {
        runCommand(spread, "unHideColumns", commands_unHideColumns, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.unHideColumns = unHideColumns;

    //Default Column Width
    var SetDefaultColumnWidthAction = (function (_super) {
        designer.extends(SetDefaultColumnWidthAction, _super);

        function SetDefaultColumnWidthAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetDefaultColumnWidthAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._sheet.defaults.colWidth = options.width;
        };
        return SetDefaultColumnWidthAction;
    })(DesignerActionBase);
    var commands_defaultColumnWidth = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetDefaultColumnWidthAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function defaultColumnWidth(spread, paramters) {
        runCommand(spread, "defaultColumnWidth", commands_defaultColumnWidth, {
            width: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.defaultColumnWidth = defaultColumnWidth;

    //#endregion
    //#region protectSheet & lockCell
    //protect sheet
    function protectSheet(spread, paramters) {
        runCommand(spread, "protectSheet", Commands[PROTECT_SHEET], {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.protectSheet = protectSheet;

    function confirmProtectSheet(spread, paramters) {
        runCommand(spread, "confirmProtectSheet", Commands[CONFIRM_PROTECT_SHEET], {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.confirmProtectSheet = confirmProtectSheet;

    //Lock Cells
    var LockCellsAction = (function (_super) {
        designer.extends(LockCellsAction, _super);

        function LockCellsAction(spread, options) {
            _super.call(this, spread, options);
        }

        LockCellsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.execInSelections(self._sheet, function (sheet, row, column) {
                var style = sheet.getStyle(row, column);
                if (!style) {
                    style = new Sheets.Style();
                }
                style.locked = options.value;
                sheet.setStyle(row, column, style);
            });
        };
        return LockCellsAction;
    })(DesignerActionBase);
    var commands_LockCells = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new LockCellsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function LockCells(spread, paramters) {
        runCommand(spread, "LockCells", commands_LockCells, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.LockCells = LockCells;
    //#endregion

    //#region AutoFill Actions
    //Fill by direction, value is a
    var AutoFillByDirectionAction = (function (_super) {
        designer.extends(AutoFillByDirectionAction, _super);

        function AutoFillByDirectionAction(spread, options) {
            _super.call(this, spread, options);
        }

        AutoFillByDirectionAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var i;
            var selections = self.getSelections();
            if ($.isArray(options.value)) {
                var actionOptionList = options.value;
                for (i = 0; i < actionOptionList.length; i++) {
                    self.sheet().fillAuto(actionOptionList[i].startRange, actionOptionList[i].wholeRange, actionOptionList[i].fillAutoOptions);
                }
            } else {
                for (i = 0; i < selections.length; i++) {
                    var selection = selections[i];
                    var startRange;
                    switch (options.value) {
                        case 3 /* Down */
                            :
                            startRange = new Sheets.Range(selection.row, selection.col, 1, selection.colCount);
                            break;
                        case 2 /* Up */
                            :
                            var startRow = selection.row;
                            if (startRow === -1) {
                                startRow = self._sheet.getRowCount() - 1;
                            } else {
                                startRow = selection.row + selection.rowCount - 1;
                            }
                            startRange = new Sheets.Range(startRow, selection.col, 1, selection.colCount);
                            break;
                        case 1 /* Right */
                            :
                            startRange = new Sheets.Range(selection.row, selection.col, selection.rowCount, 1);
                            break;
                        case 0 /* Left */
                            :
                            var startCol = selection.col;
                            if (startCol === -1) {
                                startCol = self._sheet.getColumnCount() - 1;
                            } else {
                                startCol = selection.col + selection.colCount - 1;
                            }
                            startRange = new Sheets.Range(selection.row, startCol, selection.rowCount, 1);
                            break;
                    }
                    self.sheet().fillAuto(startRange, selection, { fillType: 0, direction: options.value });
                }
            }

        };
        return AutoFillByDirectionAction;
    })(DesignerActionBase);
    var commands_autoFillByDirection = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new AutoFillByDirectionAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function autoFillByDirection(spread, paramters) {
        runCommand(spread, "autoFillByDirection", commands_autoFillByDirection, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.autoFillByDirection = autoFillByDirection;

    //#endregion
    //#region Clear Actions
    //Clear All
    var ClearSheetAllCell = (function (_super) {
        designer.extends(ClearSheetAllCell, _super);

        function ClearSheetAllCell(spread, options) {
            _super.call(this, spread, options);
        }

        ClearSheetAllCell.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var sheet = self.sheet();
            sheet.clear(0, 0, sheet.getRowCount(), sheet.getColumnCount(), 3 /* viewport */, 2 /* Style */ | 1 /* Data */ | 16 /* Sparkline */ | 32 /* Axis */);
        };
        return ClearSheetAllCell;
    })(DesignerActionBase);
    var commands_clearSheetAllCell = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new ClearSheetAllCell(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function clearSheetAllCell(spread, paramters) {
        runCommand(spread, "clearSheetAllCell", commands_clearSheetAllCell, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.clearSheetAllCell = clearSheetAllCell;
    //Clear All
    var ClearAllAction = (function (_super) {
        designer.extends(ClearAllAction, _super);

        function ClearAllAction(spread, options) {
            _super.call(this, spread, options);
        }

        ClearAllAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var selections = self.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = selections[i];
                self.sheet().clear(selection.row, selection.col, selection.rowCount, selection.colCount, 3 /* viewport */, 32 /* Axis */ | 64 /* BindingPath */ | 1 /* Data */ | 16 /* Sparkline */ | 2 /* Style */ | 4 /* Comment */);
                self.clearSpansInSelection(self._sheet, selection);
            }
        };
        return ClearAllAction;
    })(DesignerActionBase);
    var commands_clearAll = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new ClearAllAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function clearAll(spread, paramters) {
        runCommand(spread, "clearAll", commands_clearAll, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.clearAll = clearAll;

    //Clear Format
    var ClearFormatAction = (function (_super) {
        designer.extends(ClearFormatAction, _super);

        function ClearFormatAction(spread, options) {
            _super.call(this, spread, options);
        }

        ClearFormatAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var selections = self.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = selections[i];
                self._sheet.clear(selection.row, selection.col, selection.rowCount, selection.colCount, 3 /* viewport */, 2 /* Style */);
                self.clearSpansInSelection(self._sheet, selection);
            }
        };
        return ClearFormatAction;
    })(DesignerActionBase);
    var commands_clearFormat = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new ClearFormatAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function clearFormat(spread, paramters) {
        runCommand(spread, "clearFormat", commands_clearFormat, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.clearFormat = clearFormat;

    //Clear Content
    var ClearContentAction = (function (_super) {
        designer.extends(ClearContentAction, _super);

        function ClearContentAction(spread, options) {
            _super.call(this, spread, options);
        }

        ClearContentAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var selections = self.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = selections[i];
                self._sheet.clear(selection.row, selection.col, selection.rowCount, selection.colCount, 3 /* viewport */, 1 /* Data */);
            }
        };
        return ClearContentAction;
    })(DesignerActionBase);
    var commands_clearContent = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new ClearContentAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function clearContent(spread, paramters) {
        runCommand(spread, "clearContent", commands_clearContent, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.clearContent = clearContent;

    //Clear Comments
    var ClearCommentsAction = (function (_super) {
        designer.extends(ClearCommentsAction, _super);

        function ClearCommentsAction(spread, options) {
            _super.call(this, spread, options);
        }

        ClearCommentsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var selections = self.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = selections[i];
                self.sheet().clear(selection.row, selection.col, selection.rowCount, selection.colCount, 3 /* viewport */, 4 /* Comment */);
            }
        };
        return ClearCommentsAction;
    })(DesignerActionBase);
    var commands_clearComments = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new ClearCommentsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function clearComments(spread, paramters) {
        runCommand(spread, "clearComments", commands_clearComments, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.clearComments = clearComments;

    //#endregion
    //#region Sort Actions
    //The value is a bool parameter, "true" means ascending, "false" means descending.
    var SortRangeAction = (function (_super) {
        designer.extends(SortRangeAction, _super);

        function SortRangeAction(spread, options) {
            _super.call(this, spread, options);
        }

        SortRangeAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var selections = self.getSelections();
            if (!selections || selections.length === 0) {
                return;
            }
            if (selections.length > 1) {
                designer.MessageBox.show(designer.res.NotExecInMultiRanges, designer.res.title, 3 /* error */);
                return false;
            }
            var selection = selections[0];
            self._sheet.sortRange(selection.row, selection.col, selection.rowCount, selection.colCount, true, [{
                index: selection.col === -1 ? 0 : selection.col,
                ascending: options.value
            }]);
        };
        return SortRangeAction;
    })(DesignerActionBase);
    var commands_sortRange = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SortRangeAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function sortRange(spread, paramters) {
        runCommand(spread, "sortRange", commands_sortRange, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.sortRange = sortRange;

    //#endregion
    //#region Filter Actions
    //Set and Remove filter
    //The value is a bool parameter, "true" is ribbon filter behavior, "false" is contextmenu filter behavior.
    var SetRowFilterAction = (function (_super) {
        designer.extends(SetRowFilterAction, _super);

        function SetRowFilterAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetRowFilterAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var selections = self.getSelections();
            if (selections.length > 1) {
                designer.MessageBox.show(designer.res.NotExecInMultiRanges, designer.res.title, 3 /* error */);
                return false;
            }
            var selection = selections[0];
            if (!self._sheet.rowFilter()) {
                self._sheet.rowFilter(new Sheets.Filter.HideRowFilter(selection));
                return;
            }
            if (options.isRibbonFilter) {
                self._sheet.rowFilter().unfilter();
                self._sheet.rowFilter(null);
            } else {
                self._sheet.rowFilter().unfilter();
                self._sheet.rowFilter(new Sheets.Filter.HideRowFilter(selection));
            }
        };
        return SetRowFilterAction;
    })(DesignerActionBase);
    var commands_setRowFilter = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetRowFilterAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setRowFilter(spread, paramters) {
        runCommand(spread, "setRowFilter", commands_setRowFilter, {
            isRibbonFilter: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setRowFilter = setRowFilter;

    //Clear Filter
    var ClearRowFilterAction = (function (_super) {
        designer.extends(ClearRowFilterAction, _super);

        function ClearRowFilterAction(spread, options) {
            _super.call(this, spread, options);
        }

        ClearRowFilterAction.prototype.canExecute = function () {
            var self = this;
            if (self._sheet.rowFilter() && self._sheet.rowFilter().isFiltered()) {
                return true;
            }
            return false;
        };
        ClearRowFilterAction.prototype.executeImp = function (context, options, isUndo) {
            this._sheet.rowFilter().unfilter();
        };
        return ClearRowFilterAction;
    })(DesignerActionBase);
    var commands_clearRowFilter = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new ClearRowFilterAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function clearRowFilter(spread, paramters) {
        runCommand(spread, "clearRowFilter", commands_clearRowFilter, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.clearRowFilter = clearRowFilter;

    //Reapply Filter
    var ReApplyRowFilterAction = (function (_super) {
        designer.extends(ReApplyRowFilterAction, _super);

        function ReApplyRowFilterAction(spread, options) {
            _super.call(this, spread, options);
        }

        ReApplyRowFilterAction.prototype.canExecute = function () {
            var self = this;
            if (self._sheet.rowFilter() && self._sheet.rowFilter().isFiltered()) {
                return true;
            }
            return false;
        };
        ReApplyRowFilterAction.prototype.executeImp = function (context, options, isUndo) {
            this._sheet.rowFilter().filter();
        };
        return ReApplyRowFilterAction;
    })(DesignerActionBase);
    var commands_reApplyRowFilter = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new ReApplyRowFilterAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function reApplyRowFilter(spread, paramters) {
        runCommand(spread, "reApplyRowFilter(", commands_reApplyRowFilter, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.reApplyRowFilter = reApplyRowFilter;

    //#endregion
    //#region Group Actions
    //Group Rows
    function groupRows(spread) {
        var sheet = spread.getActiveSheet();
        var sheetName = sheet.name();
        var _commandManager = spread.commandManager();
        var selections = sheet.getSelections();
        if (!selections || selections.length === 0) {
            return;
        }
        var selection = selections[0];
        _commandManager.execute({
            cmd: "outlineRow",
            sheetName: sheetName,
            index: selection.row,
            count: selection.rowCount
        });
    }

    spreadActions.groupRows = groupRows;

    //Group Columns
    function groupColumns(spread) {
        var sheet = spread.getActiveSheet();
        var sheetName = sheet.name();
        var _commandManager = spread.commandManager();
        var selections = sheet.getSelections();
        if (!selections || selections.length === 0) {
            return;
        }
        var selection = selections[0];
        _commandManager.execute({
            cmd: "outlineColumn",
            sheetName: sheetName,
            index: selection.col,
            count: selection.colCount
        });
    }

    spreadActions.groupColumns = groupColumns;

    //UnGroup Rows
    function ungroupRows(spread) {
        var sheet = spread.getActiveSheet();
        var sheetName = sheet.name();
        var _commandManager = spread.commandManager();
        var selections = sheet.getSelections();
        if (!selections || selections.length === 0) {
            return;
        }
        var selection = selections[0];
        _commandManager.execute({
            cmd: "removeRowOutline",
            sheetName: sheetName,
            index: selection.row,
            count: selection.rowCount
        });
    }

    spreadActions.ungroupRows = ungroupRows;

    //UnGroup Columns
    function ungroupColumns(spread) {
        var sheet = spread.getActiveSheet();
        var sheetName = sheet.name();
        var _commandManager = spread.commandManager();
        var selections = sheet.getSelections();
        if (!selections || selections.length === 0) {
            return;
        }
        var selection = selections[0];
        _commandManager.execute({
            cmd: "removeColumnOutline",
            sheetName: sheetName,
            index: selection.col,
            count: selection.colCount
        });
    }

    spreadActions.ungroupColumns = ungroupColumns;

    var RemoveSubtotalAction = (function (_super) {
        designer.extends(RemoveSubtotalAction, _super);
        function RemoveSubtotalAction(spread, options) {
            _super.call(this, spread, options);
            this.range = options.range;
            this.sheet = options.sheet;
        }
        RemoveSubtotalAction.prototype.executeImp = function (context, options, isUndo) {
            if (this._hasSubtotal()) {
                this._unGroup();
                this._removeAll();
            }
        };
        RemoveSubtotalAction.prototype._hasSubtotal = function () {
            var i, j;
            for (i = this.range.row; i < this.range.row + this.range.rowCount; i++) {
                for (j = this.range.col; j < this.range.col + this.range.colCount; j++) {
                    if (String(this.sheet.getCell(i, j).formula()).indexOf(SUBTOTAL) !== -1) {
                        return true;
                    }
                }
            }
            return false;
        };
        RemoveSubtotalAction.prototype._unGroup = function () {
            for (var i = 0; i < 8; i++) {
                this.sheet.rowOutlines.ungroupRange(this.range.row, this.range.rowCount);
            }
        };
        RemoveSubtotalAction.prototype._removeAll = function (options) {
            var i, j;
            var selectionRowCount = this.range.row + this.range.rowCount - 1;
            for (i = this.range.row; i < selectionRowCount; i++) {
                for (j = this.range.col; j < this.range.col + this.range.colCount; j++) {
                    if (String(this.sheet.getCell(i, j).formula()).indexOf(SUBTOTAL) !== -1) {
                        this.sheet.setRowPageBreak(i, false);
                        this.sheet.setRowPageBreak(i + 1, false);
                        this.sheet.deleteRows(i, 1);
                        selectionRowCount -= 1;
                        this.range.rowCount -= 1;
                        j = this.range.col - 1;
                    }
                }
            }
        };
        return RemoveSubtotalAction;
    })(DesignerActionBase);
    var commands_removeSubtotal = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new RemoveSubtotalAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    function removeSubtotal(spread, parameters) {
        runCommand(spread, "removeSubtotal", commands_removeSubtotal, {
            sheet: parameters.sheet,
            sheetName: parameters.sheet.name(),
            selection: parameters.selections[0],
            range: parameters.options.range
        });
    }
    spreadActions.removeSubtotal = removeSubtotal;
    var AddSubtotalAction = (function (_super) {
        designer.extends(AddSubtotalAction, _super);
        function AddSubtotalAction(spread, options) {
            _super.call(this, spread, options);
            this.options = options;
            this.context = spread;
            this.originOperationInfo = options.operationInfo;
            this.sheet = options.sheet;
        }
        AddSubtotalAction.prototype.executeImp = function (context, options, isUndo) {
            this._cacheVariable();
            if (options.operationInfo.isReplace) {
                this._replaceSubtotal(context, options);
            }
            this._dealMergedCell();
            this._insertGroupRow();
            this._addSubtotal();
            this._insertTitle();
            this._groupRow();
            this._drawPrintLine();
        };
        AddSubtotalAction.prototype._cacheVariable = function () {
            this.operationInfo = {};
            this.operationInfo.isReplace = this.originOperationInfo.isReplace;
            this.operationInfo.formulaNumber = this.originOperationInfo.formulaNumber;
            this.operationInfo.groupColIndex = this.originOperationInfo.groupColIndex;
            this.operationInfo.summaryBelowData = this.originOperationInfo.summaryBelowData;
            this.operationInfo.subtotalItem = this.originOperationInfo.subtotalItem.concat();
            var orignRange = this.originOperationInfo.range;
            this.range = new Range(orignRange.row, orignRange.col, orignRange.rowCount, orignRange.colCount);
            this.groupedInfo = [];
            this.subtotalRowIndex = [];
        };
        AddSubtotalAction.prototype._replaceSubtotal = function (context, options) {
            runCommand(context, "removeSubtotal", commands_removeSubtotal, {
                sheet: options.sheet,
                sheetName: options.sheetName,
                selection: options.selection,
                range: this.range
            });
        };
        AddSubtotalAction.prototype._dealMergedCell = function () {
            var row = this.range.row, rowCount = this.range.rowCount, col = this.range.col,
                colCount = this.range.colCount,
                groupCol = this.operationInfo.groupColIndex;
            var mergedCell = this.sheet.getSpan(row, groupCol);
            if (mergedCell) {
                var newRow = row + mergedCell.rowCount - 1; // The last row of merged title cell.
                var newRowCount = rowCount - mergedCell.rowCount + 1; // Reduce the merged title to one row and apply it to range.
                this.range = new Range(newRow, col, newRowCount, colCount);
            }
        };
        AddSubtotalAction.prototype._getValue = function (row, col) {
            var mergedCell = this.sheet.getSpan(row, col);
            if (mergedCell) {
                return this.sheet.getValue(mergedCell.row, mergedCell.col);
            } else {
                return this.sheet.getValue(row, col);
            }
        };
        AddSubtotalAction.prototype._insertGroupRow = function () {
            var groupAimColumnIndex = this.operationInfo.groupColIndex, i = 1, grandIndex, nextCellRowIndex;
            var dataStartRowIndex = this.range.row + 1; /* data start from the row below the title row */
            this.dataRowCount = this.range.rowCount - 1; /* data expect the first title row */
            if (this.operationInfo.summaryBelowData) {
                this.sheet.addRows(dataStartRowIndex + this.dataRowCount, 1 /* Grand subtotal row */);
            } else {
                grandIndex = dataStartRowIndex;
                this.sheet.addRows(dataStartRowIndex, 1 /* insert row for grand subtotal */);
                var firstNotSubtotalRowIndex = this._getNextNotSubtotalRow(dataStartRowIndex + 1);
                this.dataRowCount = this.dataRowCount - (firstNotSubtotalRowIndex - (dataStartRowIndex + 1));
                this.sheet.addRows(firstNotSubtotalRowIndex, 1 /* current first subtotal row */);
                this.subtotalRowIndex.push(firstNotSubtotalRowIndex);
                dataStartRowIndex = firstNotSubtotalRowIndex + 1;
            }
            var preCellValue = this._getValue(dataStartRowIndex, groupAimColumnIndex);
            var nextCellValue = this._getValue(dataStartRowIndex + 1, groupAimColumnIndex);
            this._pushGroupStartIndex(dataStartRowIndex);
            for (i; i < this.dataRowCount; i++) {
                if (nextCellValue !== preCellValue) {
                    nextCellRowIndex = dataStartRowIndex + i; /* next cell row index */
                    if (this._notSubtotalRow(nextCellRowIndex)) {
                        this._pushCurrGroupCount(nextCellRowIndex);
                        this.sheet.addRows(nextCellRowIndex, 1);
                        this.subtotalRowIndex.push(nextCellRowIndex);
                        this._pushGroupStartIndex(nextCellRowIndex + 1);
                        this.dataRowCount += 1;
                        i += 1;
                    } else {
                        this._pushCurrGroupCount(dataStartRowIndex + i);
                    }
                }
                preCellValue = nextCellValue;
                nextCellValue = this._getValue(dataStartRowIndex + i + 1, groupAimColumnIndex);
            }
            this._pushCurrGroupCount(dataStartRowIndex + i);
            if (this.operationInfo.summaryBelowData) {
                var lastNotGrandRow = this._getNotGrandSubtotalRow(dataStartRowIndex + this.dataRowCount - 1, false);
                this.sheet.addRows(lastNotGrandRow + 1, 1 /* last (not grand) subtotal row */);
                this.subtotalRowIndex.push(lastNotGrandRow + 1);
                grandIndex = dataStartRowIndex + this.dataRowCount + 1;
            }
            this.dataRowCount += 1;
            this._pushGrandGroupInfo(dataStartRowIndex, grandIndex);
        };
        AddSubtotalAction.prototype._groupRow = function () {
            var direction = this.operationInfo.summaryBelowData ? outlineDirection.forward : outlineDirection.backward;
            this._groupGrandSubtotal();
            for (var i = 0; i < this.groupedInfo.length; i++) {
                this.sheet.rowOutlines.group(this.groupedInfo[i].startIndex, this.groupedInfo[i].count);
            }
            this.sheet.rowOutlines.direction(direction);
        };
        AddSubtotalAction.prototype._groupGrandSubtotal = function () {
            var grandGroupInfo = this.groupedInfo[this.groupedInfo.length - 1];
            var grandGroupIndex = this.subtotalRowIndex[this.subtotalRowIndex.length - 1];
            if (this.operationInfo.summaryBelowData) {
                grandGroupInfo.count = grandGroupIndex - grandGroupInfo.startIndex;
            } else {
                grandGroupInfo.count += grandGroupInfo.startIndex - grandGroupIndex - 1; /* -1 means not include the grand total row itself */
                grandGroupInfo.startIndex = grandGroupIndex + 1; /* +1 means grand group start index start from the row below grand subtotal */
            }
        };
        AddSubtotalAction.prototype._addSubtotal = function () {
            var currentGroupInfo, currentSubtotalItem, cell, i, j, len;
            for (i = 0; i < this.subtotalRowIndex.length; i++) {
                currentGroupInfo = this.groupedInfo[i];
                for (j = 0, len = this.operationInfo.subtotalItem.length; j < len; j++) {
                    currentSubtotalItem = this.operationInfo.subtotalItem[j];
                    if (currentSubtotalItem.isChecked) {
                        cell = this.sheet.getCell(this.subtotalRowIndex[i], parseInt(currentSubtotalItem.index, 10));
                        this._insertFormula(cell, currentGroupInfo, designer.util.indexToLetters(parseInt(currentSubtotalItem.index, 10) + 1));
                    }
                }
            }
        };
        AddSubtotalAction.prototype._insertFormula = function (cell, groupInfo, colHeader) {
            cell.formula('=SUBTOTAL(' + this.operationInfo.formulaNumber + ','
                + colHeader + (groupInfo.startIndex /* start index is 0 base */ + 1 /* formula use 1 base */) + ':'
                + colHeader + (groupInfo.startIndex + groupInfo.count) + ')');
        };
        AddSubtotalAction.prototype._drawPrintLine = function () {
            this.operationInfo.summaryBelowData ? this._drawBelowDataPrintLine() : this._drawAboveDataPrintLine();
        };
        AddSubtotalAction.prototype._drawBelowDataPrintLine = function () {
            for (var i = 0; i < this.subtotalRowIndex.length; i++) {
                if (i !== this.subtotalRowIndex.length - 2) {
                    this.sheet.setRowPageBreak(this.subtotalRowIndex[i] + 1, true);
                }
            }
        };
        AddSubtotalAction.prototype._drawAboveDataPrintLine = function () {
            for (var i = 1; i < this.subtotalRowIndex.length; i++) {
                if (i !== this.subtotalRowIndex.length - 1) {
                    this.sheet.setRowPageBreak(this.subtotalRowIndex[i], true);
                }
            }
        };
        AddSubtotalAction.prototype._insertTitle = function () {
            var columnsIndexWithSubtotal = [];
            var titleColumnIndex;
            var titleName;
            var font;
            var functionName = SUBTOTAL_FUNCTION_NAME[this.operationInfo.formulaNumber];
            for (var j = 0; j < this.operationInfo.subtotalItem.length; j++) {
                if (this.operationInfo.subtotalItem[j].isChecked) {
                    columnsIndexWithSubtotal.push(parseInt(this.operationInfo.subtotalItem[j].index, 10));
                }
            }
            for (var i = this.operationInfo.groupColIndex; i >= this.range.col; i--) {
                if (columnsIndexWithSubtotal.indexOf(i) === -1) {
                    titleColumnIndex = i;
                    break;
                }
            }
            if (titleColumnIndex === undefined) {
                this.sheet.addColumns(this.range.col, 1);
                titleColumnIndex = this.range.col;
                this.operationInfo.groupColIndex += 1;
            }
            for (i = 0; i < this.subtotalRowIndex.length; i++) {
                if (i === this.subtotalRowIndex.length - 1) {
                    titleName = GRAND + ' ' + functionName;
                } else {
                    var cellValue = this.sheet.getValue(this.groupedInfo[i].startIndex, this.operationInfo.groupColIndex);
                    cellValue = cellValue === null ? 'Null' : cellValue;
                    titleName = cellValue + ' ' + functionName;
                }
                font = designer.util.boldFont(this.sheet.getCell(this.subtotalRowIndex[i], titleColumnIndex).font());
                this.sheet.getCell(this.subtotalRowIndex[i], titleColumnIndex).text(titleName).font(font);
            }
        };
        AddSubtotalAction.prototype._notSubtotalRow = function (rowIndex) {
            var colCount = this.range.colCount;
            var colStartIndex = this.range.col;
            for (var i = 0; i < colCount; i++) {
                var cellFormula = this.sheet.getFormula(rowIndex, colStartIndex + i);
                if (cellFormula && String(cellFormula).indexOf(SUBTOTAL) !== -1) {
                    return false;
                }
            }
            return true;
        };
        AddSubtotalAction.prototype._pushGroupStartIndex = function (index) {
            var startIndex = this._getNextNotSubtotalRow(index);
            this.groupedInfo.push({ startIndex: startIndex });
        };
        AddSubtotalAction.prototype._pushCurrGroupCount = function (rowIndexBelowData) {
            var currGroupInfoIndex = this.groupedInfo.length - 1;
            var currGroupInfo = this.groupedInfo[currGroupInfoIndex];
            if (!currGroupInfo.count) {
                currGroupInfo.count = rowIndexBelowData - currGroupInfo.startIndex;
            }
        };
        AddSubtotalAction.prototype._pushGrandGroupInfo = function (dataStartRowIndex, grandIndex) {
            this.subtotalRowIndex.push(grandIndex);
            var grandTotalStartIndex = this._getNextNotSubtotalRow(dataStartRowIndex);
            var dataEndRowGroupInfo = this.groupedInfo[this.groupedInfo.length - 1];
            var count = dataEndRowGroupInfo.startIndex + dataEndRowGroupInfo.count - grandTotalStartIndex;
            this.groupedInfo.push({ startIndex: grandTotalStartIndex, count: count });
        };
        AddSubtotalAction.prototype._getNextNotSubtotalRow = function (index) {
            while (!this._notSubtotalRow(index)) {
                index += 1;
            }
            return index;
        };
        AddSubtotalAction.prototype._notGrandSubtotalRow = function (rowIndex) {
            var isSubtotalRow = !this._notSubtotalRow(rowIndex);
            if (!isSubtotalRow) {
                return true;
            }
            var colCount = this.range.colCount;
            var colStartIndex = this.range.col;
            for (var i = 0; i < colCount; i++) {
                var cellValue = this.sheet.getValue(rowIndex, colStartIndex + i);
                if (cellValue && String(cellValue).indexOf(GRAND) !== -1) {
                    return false;
                }
            }
            return true;
        };
        AddSubtotalAction.prototype._getNotGrandSubtotalRow = function (index, direction) {
            var delta = direction ? 1 /* from up to down to find */ : -1 /* from down to up to find */;
            while (!this._notGrandSubtotalRow(index)) {
                index += delta;
            }
            return index;
        };
        return AddSubtotalAction;
    })(DesignerActionBase);
    var commands_addSubtotal = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new AddSubtotalAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    function addSubtotal(spread, parameters) {
        runCommand(spread, "addSubtotal", commands_addSubtotal, {
            operationInfo: parameters.options,
            sheet: parameters.sheet,
            sheetName: parameters.sheet.name(),
            selection: parameters.selections[0]
        });
    }
    spreadActions.addSubtotal = addSubtotal;
    // Show Details, expand groups
    var GroupBase = (function (_super) {
        designer.extends(GroupBase, _super);
        var self;

        function GroupBase(spread, options) {
            _super.call(this, spread, options);
            self = this;
        }

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
            if (this.getSelections().length > 1) {
                designer.MessageBox.show("The command cannot be used on multiple selections", "Spread Designer", 1 /* info */, 0 /* ok */);
                return false;
            }
            var range = this.getSelections()[0];
            if (!range) {
                return;
            }

            var index, level, rangeGroupInfo, summaryIndex;
            for (var i = 0; i < range.rowCount; i++) {
                index = range.row + i;
                if (isCollapse) {
                    level = this._getExpandLevel(this._sheet.rowOutlines, index);
                } else {
                    level = this._getCollapsedLevel(this._sheet.rowOutlines, index);
                }

                if (level >= 0) {
                    rangeGroupInfo = this._sheet.rowOutlines.find(index, level);
                    if (rangeGroupInfo != null) {
                        summaryIndex = this._sheet.rowOutlines.direction() === 1 /* Forward */ ? rangeGroupInfo.end + 1 : rangeGroupInfo.start - 1;
                        this.expandRowGroup(summaryIndex, level, isCollapse);
                        break;
                    }
                }
            }

            for (var j = 0; j < range.colCount; j++) {
                index = range.col + j;
                if (isCollapse) {
                    level = this._getExpandLevel(this._sheet.columnOutlines, index);
                } else {
                    level = this._getCollapsedLevel(this._sheet.columnOutlines, index);
                }
                if (level >= 0) {
                    rangeGroupInfo = this._sheet.columnOutlines.find(index, level);
                    if (rangeGroupInfo != null) {
                        summaryIndex = this._sheet.columnOutlines.direction() === 1 /* Forward */ ? rangeGroupInfo.end + 1 : rangeGroupInfo.start - 1;
                        self.expandColumnGroup(summaryIndex, level, isCollapse);
                        break;
                    }
                }
            }
        };

        return GroupBase;
    })(DesignerActionBase);

    var ExpandGroup = (function (_super) {
        designer.extends(ExpandGroup, _super);

        function ExpandGroup(spread, options) {
            _super.call(this, spread, options);
        }

        ExpandGroup.prototype.executeImp = function (context, options, isUndo) {
            this.exec(false);
        };
        ExpandGroup.prototype._getCollapsedLevel = function (rangeGroup, index) {
            var level = rangeGroup.getLevel(index);
            if (level <= 0) {
                return level;
            } else {
                var finalLevel = -1;
                for (var i = level; i >= 0; i--) {
                    var info = rangeGroup.find(index, i);
                    if (info.state() === 1 /* Collapsed */) {
                        finalLevel = i;
                    }
                }
                return finalLevel;
            }
        };
        return ExpandGroup;
    })(GroupBase);
    var commands_expandGroup = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new ExpandGroup(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function expandGroup(spread, paramters) {
        runCommand(spread, "expandGroup", commands_expandGroup, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.expandGroup = expandGroup;

    //Hide detail, collapse group
    var CollapseGroup = (function (_super) {
        designer.extends(CollapseGroup, _super);

        function CollapseGroup(spread, options) {
            _super.call(this, spread, options);
        }

        CollapseGroup.prototype.executeImp = function (context, options, isUndo) {
            this.exec(true);
        };

        CollapseGroup.prototype._getExpandLevel = function (rangeGroup, index) {
            var level = rangeGroup.getLevel(index);
            if (level <= 0) {
                return level;
            } else {
                for (var i = level; i >= 0; i--) {
                    var info = rangeGroup.find(index, i);
                    if (info.state() === 0 /* Expanded */) {
                        return i;
                    }
                }
                return -1;
            }
        };
        return CollapseGroup;
    })(GroupBase);
    var commands_collapseGroup = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new CollapseGroup(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function collapseGroup(spread, paramters) {
        runCommand(spread, "collapseGroup", commands_collapseGroup, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.collapseGroup = collapseGroup;

    //#endregion
    //#region Show/Hide Actions
    //Show/Hide Row Header
    var ShowHideRowHeaderAction = (function (_super) {
        designer.extends(ShowHideRowHeaderAction, _super);

        function ShowHideRowHeaderAction(spread, options) {
            _super.call(this, spread, options);
        }

        ShowHideRowHeaderAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._sheet.options.rowHeaderVisible = !self._sheet.options.rowHeaderVisible;
        };
        return ShowHideRowHeaderAction;
    })(DesignerActionBase);
    var commands_showHideRowHeader = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new ShowHideRowHeaderAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function showHideRowHeader(spread, paramters) {
        runCommand(spread, "showHideRowHeader", commands_showHideRowHeader, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.showHideRowHeader = showHideRowHeader;

    //Show/Hide Column Header
    var ShowHideColumnHeaderAction = (function (_super) {
        designer.extends(ShowHideColumnHeaderAction, _super);

        function ShowHideColumnHeaderAction(spread, options) {
            _super.call(this, spread, options);
        }

        ShowHideColumnHeaderAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._sheet.options.colHeaderVisible = !self._sheet.options.colHeaderVisible;
        };
        return ShowHideColumnHeaderAction;
    })(DesignerActionBase);
    var commands_showHideColumnHeader = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new ShowHideColumnHeaderAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function showHideColumnHeader(spread, paramters) {
        runCommand(spread, "showHideColumnHeader", commands_showHideColumnHeader, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.showHideColumnHeader = showHideColumnHeader;

    //Show/Hide Vertical GridLine
    var ShowHideVGridLineAction = (function (_super) {
        designer.extends(ShowHideVGridLineAction, _super);

        function ShowHideVGridLineAction(spread, options) {
            _super.call(this, spread, options);
        }

        ShowHideVGridLineAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._sheet.options.gridline.showVerticalGridline = !self._sheet.options.gridline.showVerticalGridline;
        };
        return ShowHideVGridLineAction;
    })(DesignerActionBase);
    var commands_showHideVGridLine = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new ShowHideVGridLineAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function showHideVGridLine(spread, paramters) {
        runCommand(spread, "showHideVGridLine", commands_showHideVGridLine, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.showHideVGridLine = showHideVGridLine;

    //Show/Hide Horizontal GridLine
    var ShowHideHGridLineAction = (function (_super) {
        designer.extends(ShowHideHGridLineAction, _super);

        function ShowHideHGridLineAction(spread, options) {
            _super.call(this, spread, options);
        }

        ShowHideHGridLineAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._sheet.options.gridline.showHorizontalGridline = !self._sheet.options.gridline.showHorizontalGridline;
        };
        return ShowHideHGridLineAction;
    })(DesignerActionBase);
    var commands_showHideHGridLine = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new ShowHideHGridLineAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function showHideHGridLine(spread, paramters) {
        runCommand(spread, "showHideHGridLine", commands_showHideHGridLine, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.showHideHGridLine = showHideHGridLine;

    //Show/Hide TabStrip
    var ShowHideTabStripAction = (function (_super) {
        designer.extends(ShowHideTabStripAction, _super);

        function ShowHideTabStripAction(spread, options) {
            _super.call(this, spread, options);
        }

        ShowHideTabStripAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._spread.options.tabStripVisible = !self._spread.options.tabStripVisible;
        };
        return ShowHideTabStripAction;
    })(DesignerActionBase);
    var commands_showHideTabStrip = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new ShowHideTabStripAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function showHideTabStrip(spread, paramters) {
        runCommand(spread, "showHideTabStrip", commands_showHideTabStrip, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.showHideTabStrip = showHideTabStrip;

    //Show/Hide New Tab
    var ShowHideNewTabAction = (function (_super) {
        designer.extends(ShowHideNewTabAction, _super);

        function ShowHideNewTabAction(spread, options) {
            _super.call(this, spread, options);
        }

        ShowHideNewTabAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._spread.options.newTabVisible = !self._spread.options.newTabVisible;
        };
        return ShowHideNewTabAction;
    })(DesignerActionBase);
    var commands_showHideNewTab = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new ShowHideNewTabAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function showHideNewTab(spread, paramters) {
        runCommand(spread, "showHideNewTab", commands_showHideNewTab, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.showHideNewTab = showHideNewTab;

    //#endregion
    //#region Zoom Actions
    //Zoom to a special value
    var zoomAction = (function (_super) {
        designer.extends(zoomAction, _super);

        function zoomAction(spread, options) {
            _super.call(this, spread, options);
        }

        zoomAction.prototype.executeImp = function (content, option, isUndo) {
            var value = option.value;
            this._sheet.zoom(value);
        };
        zoomAction.prototype.undoImp = function (context, options, isUndo) {
            context.suspendPaint();
            GC.Spread.Sheets.Commands.undoTransaction(context, options);
            context.resumePaint();
            return true;
        };
        return zoomAction;

    })(DesignerActionBase);

    var commands_zoomAction = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new zoomAction(context, options);
            cmd.execute(context, options, isUndo);
        }

    };

    function zoom(spread, paramters) {
        runCommand(spread, "zoom", commands_zoomAction, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.zoom = zoom;

    //Zoom to default: 100%
    function zoomDefault(spread, paramters) {
        runCommand(spread, "zoom", commands_zoomAction, {
            value: 1,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.zoomDefault = zoomDefault;

    //Zoom to selection
    function zoomSelection(spread, paramters) {
        var sheet = spread.getActiveSheet();
        var zoomInfo = designer.actions._getPreferredZoomInfo();
        if (zoomInfo && zoomInfo.topRow && zoomInfo.leftCol) {
            sheet.showCell(zoomInfo.topRow, zoomInfo.leftCol, 0 /* top */, 0 /* left */);
        }
        if (zoomInfo) {
            runCommand(spread, "zoom", commands_zoomAction, {
                value: zoomInfo.zoom,
                selections: paramters.selections,
                sheetName: paramters.sheetName
            });
        }
    }

    spreadActions.zoomSelection = zoomSelection;

    //#endregion
    //#region Freeze
    var FreezeAction = (function (_super) {
        designer.extends(FreezeAction, _super);

        function FreezeAction(spread, options) {
            _super.call(this, spread, options);
        }

        FreezeAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            if (options.value.row !== undefined) {
                self._sheet.frozenRowCount(Number(options.value.row));
            }
            if (options.value.col !== undefined) {
                self._sheet.frozenColumnCount(Number(options.value.col));
            }
            if (options.value.trailingRow !== undefined) {
                self._sheet.frozenTrailingRowCount(Number(options.value.trailingRow));
            }
            if (options.value.trailingCol !== undefined) {
                self._sheet.frozenTrailingColumnCount(Number(options.value.trailingCol));
            }
        };
        return FreezeAction;
    })(DesignerActionBase);
    var commands_freeze = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new FreezeAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function freeze(spread, paramters) {
        runCommand(spread, "freeze", commands_freeze, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.freeze = freeze;


    var UnFreezeAction = (function (_super) {
        designer.extends(UnFreezeAction, _super);

        function UnFreezeAction(spread, options) {
            _super.call(this, spread, options);
        }

        UnFreezeAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._sheet.frozenRowCount(0);
            self._sheet.frozenColumnCount(0);
            self._sheet.frozenTrailingColumnCount(0);
            self._sheet.frozenTrailingRowCount(0);
        };
        return UnFreezeAction;
    })(DesignerActionBase);
    var commands_unfreeze = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new UnFreezeAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function unfreeze(spread, paramters) {
        runCommand(spread, "unfreeze", commands_unfreeze, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.unfreeze = unfreeze;

    //#endregion
    //#region Formula
    //Calculate Now
    function calculateNow(spread) {
        //V1 runtime doesn't support it
    }

    spreadActions.calculateNow = calculateNow;

    //Set calculation to Auto or Manual
    function autoCalculate(spread, value) {
        //V1 runtime doesn't support it
    }

    spreadActions.autoCalculate = autoCalculate;

    //#endregion
    //#region Style
    var SetStyleAction = (function (_super) {
        designer.extends(SetStyleAction, _super);

        //value parameter is HorizontalAlign enum, including left,center and right.
        function SetStyleAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetStyleAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.setStyle("", options.value, options);
            self.updateRibbon();
        };
        SetStyleAction.prototype.setStyle = function (attribute, value, options) {
            var self = this, sheet = self._sheet, spread = self._spread;
            spread.suspendPaint();
            self.execInSelections(sheet, function (_sheet, row, column) {
                var newStyle = value.clone();

                var style = _sheet.getStyle(row, column);
                if (style) {
                    for (var loop in style) {
                        if (loop !== "_id" && newStyle[loop] === keyword_undefined) {
                            newStyle[loop] = style[loop];
                        }
                    }
                }


                _sheet.setStyle(row, column, newStyle);
            });
            spread.resumePaint();
        };
        return SetStyleAction;
    })(DesignerActionBase);
    var commands_setStyle = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetStyleAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setStyle(spread, paramters) {
        runCommand(spread, "setStyle", commands_setStyle, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setStyle = setStyle;


    var SetStyleObjectAction = (function (_super) {
        designer.extends(SetStyleObjectAction, _super);

        function SetStyleObjectAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetStyleObjectAction.prototype.executeImp = function (condex, options, isUndo) {
            var self = this;
            self.execInSelections(self._sheet, function (sheet, row, column) {
                sheet.setStyleName(row, column, options.value);
            });
        };
        return SetStyleObjectAction;
    })(DesignerActionBase);
    var commands_setStyleByName = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetStyleObjectAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setStyleByName(spread, paramters) {
        runCommand(spread, "setStyleByName", commands_setStyleByName, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setStyleByName = setStyleByName;

    var AddNamedStyleAction = (function (_super) {
        designer.extends(AddNamedStyleAction, _super);

        function AddNamedStyleAction(spread, options) {
            _super.call(this, spread, options);
        }

        AddNamedStyleAction.prototype.executeImp = function (context, options, isUndo) {
            this.spread().addNamedStyle(options.value);
        };
        return AddNamedStyleAction;
    })(DesignerActionBase);
    var commands_addNamedStyle = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new AddNamedStyleAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function addNamedStyle(spread, paramters) {
        runCommand(spread, "addNameStyle", commands_addNamedStyle, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.addNamedStyle = addNamedStyle;

    //#endregion
    //#region DataValidation
    var SetDataValidation = (function (_super) {
        designer.extends(SetDataValidation, _super);

        function SetDataValidation(spread, options) {
            _super.call(this, spread, options);
        }

        SetDataValidation.prototype.executeImp = function (context, options, isUndo) {
            var self = this, sheet = self._sheet, validator = options.value;
            self._selections.forEach(function (range) {
                sheet.setDataValidator(range.row, range.col, range.rowCount, range.colCount, validator);
            });
        };
        return SetDataValidation;
    })(DesignerActionBase);
    var commands_setDataValidation = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetDataValidation(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setDataValidation(spread, paramters) {
        runCommand(spread, "setDataValidation", commands_setDataValidation, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setDataValidation = setDataValidation;


    var CircleInvalidData = (function (_super) {
        designer.extends(CircleInvalidData, _super);

        function CircleInvalidData(spread, options) {
            _super.call(this, spread, options);
        }

        CircleInvalidData.prototype.executeImp = function (context, options, isUndo) {
            this.spread().options.highlightInvalidData = true;
        };
        return CircleInvalidData;
    })(DesignerActionBase);
    var commands_circleInvalidData = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new CircleInvalidData(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function circleInvalidData(spread, paramters) {
        runCommand(spread, "circleInvalidData", commands_circleInvalidData, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.circleInvalidData = circleInvalidData;


    var UnCircleInvalidData = (function (_super) {
        designer.extends(UnCircleInvalidData, _super);

        function UnCircleInvalidData(spread, options) {
            _super.call(this, spread, options);
        }

        UnCircleInvalidData.prototype.executeImp = function (context, options, isUndo) {
            this.spread().options.highlightInvalidData = false;
        };
        return UnCircleInvalidData;
    })(DesignerActionBase);
    var commands_unCircleInvalidData = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new UnCircleInvalidData(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function unCircleInvalidData(spread, paramters) {
        runCommand(spread, "unCircleInvalidData", commands_unCircleInvalidData, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.unCircleInvalidData = unCircleInvalidData;

    //#endregion
    //#region Enum
    (function (SelectionRangeType) {
        SelectionRangeType[SelectionRangeType["Sheet"] = 0] = "Sheet"/* NOSONAR: AssignmentWithinCondition */;
        SelectionRangeType[SelectionRangeType["OnlyRow"] = 1] = "OnlyRow"/* NOSONAR: AssignmentWithinCondition */;
        SelectionRangeType[SelectionRangeType["OnlyColumn"] = 2] = "OnlyColumn"/* NOSONAR: AssignmentWithinCondition */;
        SelectionRangeType[SelectionRangeType["OnlyCells"] = 3] = "OnlyCells"/* NOSONAR: AssignmentWithinCondition */;
        SelectionRangeType[SelectionRangeType["Mixture"] = 4] = "Mixture"/* NOSONAR: AssignmentWithinCondition */;
        spreadActions.SelectionRangeType = SelectionRangeType;
    })(spreadActions.SelectionRangeType || ({}));

    //#endregion
    //#region Help function
    //Get the selection area's type
    function getSelectionType(spread) {
        var selections = spread.getActiveSheet().getSelections();
        return getSelectionTypeWithSelections(selections);
    }

    function getSelectionTypeWithSelections(selections) {
        var selectionType;
        for (var i = 0; i < selections.length; i++) {
            var selection = selections[i];
            if (selection.col === -1 && selection.row === -1) {
                return 0 /* Sheet */;
            } else if (selection.row === -1) {
                if (selectionType === undefined) {
                    selectionType = 2 /* OnlyColumn */;
                } else if (selectionType != 2 /* OnlyColumn */) {
                    return 4 /* Mixture */;
                }
            } else if (selection.col === -1) {
                if (selectionType === undefined) {
                    selectionType = 1 /* OnlyRow */;
                } else if (selectionType != 1 /* OnlyRow */) {
                    return 4 /* Mixture */;
                }
            } else {
                if (selectionType === undefined) {
                    selectionType = 3 /* OnlyCells */;
                } else if (selectionType != 3 /* OnlyCells */) {
                    return 4 /* Mixture */;
                }
            }
        }
        return selectionType;
    }

    spreadActions.getSelectionType = getSelectionType;

    //#endregion
    //#region CellType
    var SetCellTypeAction = (function (_super) {
        designer.extends(SetCellTypeAction, _super);

        function SetCellTypeAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetCellTypeAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.execInSelections(self._sheet, function (sheet, row, column) {
                var style = sheet.getStyle(row, column);
                if (!style) {
                    style = new Sheets.Style();
                }
                style.cellType = options.value;
                sheet.setStyle(row, column, style);
            });
        };
        return SetCellTypeAction;
    })(DesignerActionBase);
    var commands_setCellType = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetCellTypeAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setCellType(spread, paramters) {
        runCommand(spread, "setCellType", commands_setCellType, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setCellType = setCellType;

    //#endregion
    //#region clearCellType
    var ClearCellTypeAction = (function (_super) {
        designer.extends(ClearCellTypeAction, _super);

        function ClearCellTypeAction(spread, options) {
            _super.call(this, spread, options);
        }

        ClearCellTypeAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.execInSelections(self._sheet, function (sheet, row, column) {
                var style = sheet.getStyle(row, column);
                if (!style) {
                    style = new Sheets.Style();
                }

                //undefined will as inherit.
                style.cellType = keyword_undefined;
                sheet.setStyle(row, column, style);
            });
        };
        return ClearCellTypeAction;
    })(DesignerActionBase);
    var commands_clearCellType = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new ClearCellTypeAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function clearCellType(spread, paramters) {
        runCommand(spread, "clearCellType", commands_clearCellType, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.clearCellType = clearCellType;
    var ClearCellDropdownsAction = (function (_super) {
        designer.extends(ClearCellDropdownsAction, _super);
        function ClearCellDropdownsAction(spread, options) {
            _super.call(this, spread, options);
        }
        ClearCellDropdownsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.execInSelections(self._sheet, function (sheet, row, column) {
                var style = sheet.getStyle(row, column);
                if (!style) {
                    style = new Sheets.Style();
                }
                //undefined will as inherit.
                style.cellButtons = keyword_undefined;
                sheet.setStyle(row, column, style);
            });
        };
        return ClearCellDropdownsAction;
    })(DesignerActionBase);
    var commands_clearDropdowns = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new ClearCellDropdownsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    function clearCellDropdowns(spread, paramters) {
        runCommand(spread, "clearCellDropdowns", commands_clearDropdowns, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }
    spreadActions.clearCellDropdowns = clearCellDropdowns;

    //#endregion
    //#region setAutoFormula
    var SetAutoFormulaAction = (function (_super) {
        designer.extends(SetAutoFormulaAction, _super);

        function SetAutoFormulaAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetAutoFormulaAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._sheet.suspendCalcService();
            if (getSelectionTypeWithSelections(self.getSelections()) === 3 /* OnlyCells */) {
                var selections = self.getSelections();
                for (var i = 0; i < selections.length; i++) {
                    //Validate whether the range's last row reach the sheet's bottom
                    if (selections[i].row + selections[i].rowCount === self._sheet.getRowCount()) {
                        continue;
                    } else {
                        self._setFormulaForSingleRange(selections[i], options.formulaName);
                    }
                }
            }
            self._sheet.resumeCalcService();
        };
        SetAutoFormulaAction.prototype._setFormulaForSingleRange = function (range, formulaName) {
            var self = this;
            for (var i = 0; i < range.colCount; i++) {
                var formula = rangeToFormula(range, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allAbsolute, self._spread.options.referenceStyle === 1/* useR1C1 */);
                formula = "=" + formulaName + "(" + formula + ")";
                self._sheet.setFormula(range.row + range.rowCount, range.col + i, formula);
            }
        };
        return SetAutoFormulaAction;
    })(DesignerActionBase);
    var commands_setAutoFormula = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetAutoFormulaAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setAutoFormula(spread, paramters) {
        runCommand(spread, "setAutoFormula", commands_setAutoFormula, {
            formulaName: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setAutoFormula = setAutoFormula;
    //#endregion
    //#region Sparkline
    var SetFormulaSparklineWithoutDatarangeAction = (function (_super) {
        designer.extends(SetFormulaSparklineWithoutDatarangeAction, _super);

        function SetFormulaSparklineWithoutDatarangeAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetFormulaSparklineWithoutDatarangeAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var locationRange = options.value.locationRange;
            var locationSheet = options.value.locationSheet;
            var formula = options.value.formula;
            if (locationRange) {
                if (locationRange.rowCount === 1 && locationRange.colCount === 1) {
                    var sheet = self._sheet;
                    if (locationSheet) {
                        sheet = self._spread.getSheetFromName(locationSheet);
                    }
                    sheet.setFormula(locationRange.row, locationRange.col, formula);
                } else {
                    designer.MessageBox.show(designer.res.createSparklineDialog.notSingleCell, designer.res.title, 2 /* warning */, 0 /* ok */);
                    return false;
                }
            } else {
                var row = self._options.activeRowIndex;
                var col = self._options.activeColIndex;
                if (formula) {
                    self._sheet.setFormula(row, col, formula);
                }
            }
        };
        return SetFormulaSparklineWithoutDatarangeAction;
    })(DesignerActionBase);
    var commands_setFormulaSparklineWithoutDatarange = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetFormulaSparklineWithoutDatarangeAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setFormulaSparklineWithoutDatarange(spread, paramters) {
        var sheet = paramters.sheet;
        var activeRowIndex = sheet.getActiveRowIndex();
        var activeColIndex = sheet.getActiveColumnIndex();
        runCommand(spread, "setFormulaSparklineWithoutDatarange", commands_setFormulaSparklineWithoutDatarange, {
            value: paramters.options,
            selections: paramters.selections,
            activeRowIndex: activeRowIndex,
            activeColIndex: activeColIndex,
            sheetName: paramters.sheetName
        });

    }

    spreadActions.setFormulaSparklineWithoutDatarange = setFormulaSparklineWithoutDatarange;

    function getRangeInfo(sheet, formula, baseRow, baseCol) {
        var result = Sheets.CalcEngine.formulaToRanges(sheet, formula, baseRow, baseCol), rangeItem = result[0];
        var range = rangeItem && rangeItem.ranges && rangeItem.ranges[0];
        if (range) {
            return {
                range: range,
                sheetName: rangeItem.sheetName
            };
        }
        return null;
    }

    var SetFormulaSparklineAction = (function (_super) {
        designer.extends(SetFormulaSparklineAction, _super);

        function SetFormulaSparklineAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetFormulaSparklineAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._value = options.value;
            var locationRange = options.value.locationRange;
            var sparklineType = options.value.type;
            var activeRow = options.activeRowIndex;
            var activeCol = options.activeColumnIndex;
            var formula = options.value.formula;
            var sheet = self._sheet;
            var dataRange;
            var dataRangeObj = getRangeInfo(sheet, self._value.dataRange, activeRow, activeCol);
            if (dataRangeObj) {
                dataRange = dataRangeObj.range;
            } else {
                designer.MessageBox.show(designer.res.compatibleSparklineDialog.errorMessage, designer.res.title, 2 /* warning */, 0 /* ok */);
                return false;
            }
            if (!locationRange) {
                if (designer.MultiRangeFormulaType[designer.FormulaSparklineType[sparklineType]] !== undefined) {
                    var parameterSets = self._value.parameterSets;
                    if (!parameterSets) {
                        return false;
                    }
                    var selections = self.getSelections();
                    if (selections && selections.length > 0) {
                        var allowEdit = self._allowMultiCellFormulaEdit();
                        if (!allowEdit) {
                            designer.MessageBox.show(designer.res.multiCellFormula.warningText, designer.res.title, 2 /* warning */, 0 /* ok */);
                            return false;
                        }
                        var len = selections.length;
                        var isSingleCell = (len === 1 && selections[0].rowCount === 1 && selections[0].colCount === 1);
                        self.execInSelections(sheet, function (_sheet, _row, _col) {
                            var newFormula = self._reCalcMultiRangeFormula(_row, _col, sparklineType, parameterSets, isSingleCell);
                            if (newFormula) {
                                _sheet.setFormula(_row, _col, newFormula);
                            }
                        });
                    }
                } else {
                    var row = options.activeRowIndex;
                    var col = options.activeColumnIndex;
                    if (sparklineType === 3 /* compatible */ && dataRange.rowCount !== 1 && dataRange.colCount !== 1) {
                        designer.MessageBox.show(designer.res.createSparklineDialog.notSingleCell, designer.res.title, 2 /* warning */, 0 /* ok */);
                        return false;
                    }
                    if (formula) {
                        sheet.setFormula(row, col, formula);
                    }
                }
            } else {
                var locationSheet = options.value.locationSheet;
                if (locationSheet) {
                    sheet = self._spread.getSheetFromName(locationSheet);
                }
                if (sparklineType === 3 /* compatible */) {
                    var i;
                    if (locationRange.colCount === 1 && locationRange.rowCount === dataRange.rowCount) {
                        for (i = 0; i < dataRange.rowCount; i++) {
                            sheet.setFormula(locationRange.row + i, locationRange.col, self._createFormula(i));
                        }
                    } else if (locationRange.rowCount === 1 && locationRange.colCount === dataRange.colCount) {
                        for (i = 0; i < dataRange.colCount; i++) {
                            sheet.setFormula(locationRange.row, locationRange.col + i, self._createFormula(i));
                        }
                    } else {
                        designer.MessageBox.show(designer.res.createSparklineDialog.warningText, designer.res.title, 2 /* warning */, 0 /* ok */);
                        return false;
                    }
                } else if (designer.MultiRangeFormulaType[designer.FormulaSparklineType[sparklineType]] !== undefined) {
                    self._setMultiRangeFormula(dataRange, locationRange, sheet);
                } else {
                    if (locationRange.rowCount === 1 && locationRange.colCount === 1) {
                        sheet.setFormula(locationRange.row, locationRange.col, self._createFormula());
                    } else {
                        designer.MessageBox.show(designer.res.createSparklineDialog.notSingleCell, designer.res.title, 2 /* warning */, 0 /* ok */);
                        return false;
                    }
                }
                sheet.setSelection(locationRange.row, locationRange.col, locationRange.rowCount, locationRange.colCount);
            }
        };

        SetFormulaSparklineAction.prototype._getFormulaSparklineType = function (formula) {
            var formulaName;
            var equalIndex = formula.indexOf("=");
            var bracketIndex = formula.indexOf("(");
            if (bracketIndex === -1) {
                return null;
            }
            var startIndex;
            if (bracketIndex < equalIndex) {
                startIndex = 0;
                formulaName = formula.substr(startIndex, bracketIndex + 1);
            } else {
                startIndex = equalIndex === -1 ? 0 : 1;
                formulaName = formula.substr(startIndex, bracketIndex - startIndex);
            }
            formulaName = formulaName.toLowerCase();
            switch (formulaName) {
                case "piesparkline":
                    return 0 /* pie */;
                case "areasparkline":
                    return 1 /* area */;
                case "scattersparkline":
                    return 2 /* scatter */;
                case "linesparkline":
                case "columnsparkline":
                case "winlosssparkline":
                    return 3 /* compatible */;
                case "bulletsparkline":
                    return 4 /* bullet */;
                case "spreadsparkline":
                    return 5 /* spread */;
                case "stackedsparkline":
                    return 6 /* stacked */;
                case "hbarsparkline":
                    return 7 /* hbar */;
                case "vbarsparkline":
                    return 8 /* vbar */;
                case "variancesparkline":
                    return 9 /* variance */;
                case "boxplotsparkline":
                    return 10 /* boxplot */;
                case "cascadesparkline":
                    return 11 /* cascade */;
                case "paretosparkline":
                    return 12 /* pareto */;
                default:
                    return null;
            }
        };

        SetFormulaSparklineAction.prototype._allowMultiCellFormulaEdit = function () {
            var self = this;
            var firstInfo, firstType;
            var hasFirstInfo = false;
            self.execInSelections(self._sheet, function (sheet, row, col) {
                var info = sheet.getFormulaInformation(row, col);
                if (info.hasFormula) {
                    if (!hasFirstInfo) {
                        firstInfo = info;
                        firstType = self._getFormulaSparklineType(firstInfo.formula);
                        hasFirstInfo = true;
                    } else {
                        var type = self._getFormulaSparklineType(info.formula);
                        if (firstType !== type || firstInfo.isArrayFormula !== info.isArrayFormula) {
                            return false;
                        }
                    }
                }
            });
            return hasFirstInfo;
        };

        SetFormulaSparklineAction.prototype._reCalcMultiRangeFormula = function (row, col, type, parameters, isSingleCell) {
            var expr = designer.util.parseFormulaSparkline(row, col);
            var formulaArgs;
            if (!expr || !expr.arguments) {
                return null;
            } else {
                formulaArgs = expr.arguments;
                if (!formulaArgs || formulaArgs.length <= 0) {
                    return null;
                }
            }
            var formula = "";
            switch (type) {
                case 11 /* cascade */
                    :
                    formula += "CASCADESPARKLINE";
                    if (!isSingleCell) {
                        parameters[1] = designer.util.unParseFormula(formulaArgs[1], row, col);
                    }
                    break;
                case 12 /* pareto */
                    :
                    formula += "PARETOSPARKLINE";
                    if (!isSingleCell) {
                        parameters[1] = designer.util.unParseFormula(formulaArgs[1], row, col);
                    }
                    break;
                default:
                    break;
            }
            var params = "";
            for (var i = 0; i < parameters.length; i++) {
                var item = parameters[i];
                if (item !== undefined && item !== null) {
                    params += item + ",";
                } else {
                    params += ",";
                }
            }
            params = this._removeContinuousComma(params);
            formula += "(" + params + ")";
            return formula;
        };

        SetFormulaSparklineAction.prototype._removeContinuousComma = function (parameter) {
            var len = parameter.length;
            while (len > 0 && parameter[len - 1] === ",") {
                len--;
            }
            return parameter.substr(0, len);
        };

        SetFormulaSparklineAction.prototype._setMultiRangeFormula = function (dataRange, locationRange, sheet) {
            var count = 0;
            var index = 1;
            var vertical;
            var base = 0;
            var formula = "";
            var totalNumbers = dataRange.rowCount * dataRange.colCount;
            if (locationRange.rowCount < locationRange.colCount) {
                vertical = true;
                base = locationRange.col;
                count = Math.min(totalNumbers, locationRange.colCount);
            } else {
                vertical = false;
                base = locationRange.row;
                count = Math.min(totalNumbers, locationRange.rowCount);
            }
            if (vertical) {
                for (var c = base; c < base + count; c++) {
                    formula = this._createMultiRangeFormula(index, vertical);
                    sheet.setFormula(locationRange.row, c, formula);
                    index++;
                }
            } else {
                for (var r = base; r < base + count; r++) {
                    formula = this._createMultiRangeFormula(index, vertical);
                    sheet.setFormula(r, locationRange.col, formula);
                    index++;
                }
            }
        };

        SetFormulaSparklineAction.prototype._createMultiRangeFormula = function (index, vertical) {
            var dataRangeString = this._value.dataRange;
            var sparklineType = this._value.type;
            var formula;
            switch (sparklineType) {
                case 11 /* cascade */
                    :
                    if (vertical) {
                        formula = "=CASCADESPARKLINE(" + dataRangeString + "," + index + ",,,,,,true" + ")";
                    } else {
                        formula = "=CASCADESPARKLINE(" + dataRangeString + "," + index + ",,,,,,false" + ")";
                    }
                    break;
                case 12 /* pareto */
                    :
                    if (vertical) {
                        formula = "=PARETOSPARKLINE(" + dataRangeString + "," + index + ",,,,,,true" + ")";
                    } else {
                        formula = "=PARETOSPARKLINE(" + dataRangeString + "," + index + ",,,,,,false" + ")";
                    }
                    break;
            }
            return formula;
        };

        SetFormulaSparklineAction.prototype._createFormula = function (index) {
            var compatibleType = this._value.compatibleType;
            var locationRange = this._value.locationRange;
            var dataRangeString = this._value.dataRange;
            var activeRow = this._options.activeRowIndex;
            var activeCol = this._options.activeColumnIndex;
            var referenceStyle = this._options.referenceStyle;
            var sheet = this._sheet;
            var locationSheet = this._value.locationSheet;
            if (locationSheet) {
                sheet = this._spread.getSheetFromName(locationSheet);
            }
            var dataRangeObj = getRangeInfo(this._sheet, dataRangeString, activeRow, activeCol);
            if (!dataRangeObj) {
                return null;
            }
            var dataRange = dataRangeObj.range;
            var dataSheetName = dataRangeObj.sheetName;

            var locationRangeRow = locationRange.row, locationRangeCol = locationRange.col,
                locationRangeRowCount = locationRange.rowCount, locationRangeColCount = locationRange.colCount;
            var sparklineType = this._value.type;
            var formula;
            var range;
            var rangeString;

            if (sparklineType === 3 /* compatible */) {
                var dataOrientation = (dataRange && dataRange.colCount === 1) ? 0 /* Vertical */ : 1 /* Horizontal */;

                if (dataRange) {
                    if (dataRange.colCount !== 1 && dataRange.rowCount !== 1) {
                        dataOrientation = locationRangeColCount === 1 ? 1 /* Horizontal */ : 0 /* Vertical */;
                    }
                    if (locationRangeRowCount === 1 && locationRangeColCount !== 1) {
                        range = new Sheets.Range(dataRange.row, dataRange.col + index, dataRange.rowCount, 1);
                    } else if (locationRangeRowCount !== 1 && locationRangeColCount === 1) {
                        range = new Sheets.Range(dataRange.row + index, dataRange.col, 1, dataRange.colCount);
                    } else {
                        range = dataRange;
                    }
                }

                rangeString = designer.CEUtility.parseExternalRangeToString({ "range": range }, locationRangeRow, locationRangeCol, referenceStyle);
                if (dataSheetName !== sheet.name()) {
                    rangeString = dataSheetName + "!" + rangeString;
                }
                switch (compatibleType) {
                    case "line":
                        formula = "=LINESPARKLINE(" + rangeString + "," + dataOrientation + ")";
                        break;
                    case "column":
                        formula = "=COLUMNSPARKLINE(" + rangeString + "," + dataOrientation + ")";
                        break;
                    case "winloss":
                        formula = "=WINLOSSSPARKLINE(" + rangeString + "," + dataOrientation + ")";
                        break;
                    default:
                        break;
                }
            } else {
                rangeString = designer.CEUtility.parseExternalRangeToString({ "range": dataRange }, locationRangeRow, locationRangeCol, referenceStyle);
                if (dataSheetName !== sheet.name()) {
                    rangeString = dataSheetName + "!" + rangeString;
                }
                switch (sparklineType) {
                    case 0 /* pie */
                        :
                        formula = "=PIESPARKLINE(" + rangeString + ")";
                        break;
                    case 1 /* area */
                        :
                        formula = "=AREASPARKLINE(" + rangeString + ")";
                        break;
                    case 2 /* scatter */
                        :
                        formula = "=SCATTERSPARKLINE(" + rangeString + ")";
                        break;
                    case 5 /* spread */
                        :
                        formula = "=SPREADSPARKLINE(" + rangeString + ")";
                        break;
                    case 6 /* stacked */
                        :
                        formula = "=STACKEDSPARKLINE(" + rangeString + ")";
                        break;
                    case 10 /* boxplot */
                        :
                        formula = "=BOXPLOTSPARKLINE(" + rangeString + ")";
                        break;
                    default:
                        break;
                }
            }
            return formula;
        };
        return SetFormulaSparklineAction;
    })(DesignerActionBase);
    var commands_setFormulaSparkline = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetFormulaSparklineAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setFormulaSparkline(spread, paramters) {
        var sheet = spread.getSheetFromName(paramters.sheetName);
        var activeRowIndex = sheet.getActiveRowIndex();
        var activeColumnIndex = sheet.getActiveColumnIndex();
        runCommand(spread, "setFormulaSparkline", commands_setFormulaSparkline, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName,
            activeRowIndex: activeRowIndex,
            activeColumnIndex: activeColumnIndex,
            referenceStyle: spread.options.referenceStyle
        });
    }

    spreadActions.setFormulaSparkline = setFormulaSparkline;


    var SetDefaultSparklineAction = (function (_super) {
        designer.extends(SetDefaultSparklineAction, _super);

        function SetDefaultSparklineAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetDefaultSparklineAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._value = options.value;
            var sparklines = [];
            var dataRange = self._value.dataRange;
            var dataSheetName, sheet = self._sheet;
            var locationSheet = options.value.locationSheet;
            if (locationSheet) {
                sheet = self._spread.getSheetFromName(locationSheet);
            }
            var locationRange = self._value.locationRange, sheetName = sheet.name();
            var activeRowIndex = options.activeRowIndex;
            var activeColumnIndex = options.activeColumnIndex;
            if (typeof dataRange === 'string') {
                var rangeInfo = getRangeInfo(sheet, dataRange, activeRowIndex, activeColumnIndex);
                if (!rangeInfo) {
                    return false;
                }
                dataRange = rangeInfo.range;
                dataSheetName = rangeInfo.sheetName;
            }
            var sparklineType = self._value.sparklineType;
            var setting = self._value.setting;
            var i, sparkline;

            if (locationRange.colCount === 1 && locationRange.rowCount === dataRange.rowCount) {
                for (i = 0; i < dataRange.rowCount; i++) {
                    sparkline = sheet.setSparkline(locationRange.row + i, locationRange.col, new Sheets.Range(dataRange.row + i, dataRange.col, 1, dataRange.colCount), 1 /* Horizontal */, sparklineType, new Sheets.Sparklines.SparklineSetting(setting));
                    if (dataSheetName && dataSheetName !== sheetName) {
                        sparkline.dataSheetName(dataSheetName);
                    }
                    sparklines.push(sparkline);
                }
            } else if (locationRange.rowCount === 1 && locationRange.colCount === dataRange.colCount) {
                for (i = 0; i < dataRange.colCount; i++) {
                    sparkline = sheet.setSparkline(locationRange.row, locationRange.col + i, new Sheets.Range(dataRange.row, dataRange.col + i, dataRange.rowCount, 1), 0 /* Vertical */, sparklineType, new Sheets.Sparklines.SparklineSetting(setting));
                    if (dataSheetName && dataSheetName !== sheetName) {
                        sparkline.dataSheetName(dataSheetName);
                    }
                    sparklines.push(sparkline);
                }
            } else {
                designer.MessageBox.show(designer.res.createSparklineDialog.warningText, designer.res.title, 2 /* warning */, 0 /* ok */);
                return false;
            }

            sheet.groupSparkline(sparklines);
            sheet.setSelection(locationRange.row, locationRange.col, locationRange.rowCount, locationRange.colCount);
        };
        return SetDefaultSparklineAction;
    })(DesignerActionBase);
    var commands_setDefaultSparkline = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetDefaultSparklineAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setDefaultSparkline(spread, paramters) {
        var sheet = spread.getSheetFromName(paramters.sheetName);
        var activeRowIndex = sheet.getActiveRowIndex();
        var activeColumnIndex = sheet.getActiveColumnIndex();
        runCommand(spread, "setDefaultSparkline", commands_setDefaultSparkline, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName,
            activeRowIndex: activeRowIndex,
            activeColumnIndex: activeColumnIndex
        });
    }

    spreadActions.setDefaultSparkline = setDefaultSparkline;


    var AddOrRemoveCellStatesAction = (function (_super) {
        designer.extends(AddOrRemoveCellStatesAction, _super);
        function AddOrRemoveCellStatesAction(spread, options) {
            _super.call(this, spread, options);
        }
        AddOrRemoveCellStatesAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this, sheet = self._sheet;
            self._value = options.value;
            var selectRanges = options.value.selectRanges, cellStatesType = options.value.cellStatesType, style = options.value.style, type = options.value.type;
            for (var i = 0, len = selectRanges.length; i < len; i++) {
                if (type === "add") {
                    sheet.cellStates.add(selectRanges[i], cellStatesType, style);
                } else if (type === "remove") {
                    sheet.cellStates.remove(selectRanges[i], cellStatesType);
                }
            }
            designer.actions.isFileModified = true;
        };
        return AddOrRemoveCellStatesAction;
    })(DesignerActionBase);
    var commands_addCellStates = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new AddOrRemoveCellStatesAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    function addorRemoveCellStates(spread, paramters) {
        var sheet = spread.getSheetFromName(paramters.sheetName);
        var activeRowIndex = sheet.getActiveRowIndex();
        var activeColumnIndex = sheet.getActiveColumnIndex();
        runCommand(spread, "addorRemoveCellStates", commands_addCellStates, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName,
            activeRowIndex: activeRowIndex,
            activeColumnIndex: activeColumnIndex
        });
    }
    spreadActions.addorRemoveCellStates = addorRemoveCellStates;
    var SetSparklineTypeAction = (function (_super) {
        designer.extends(SetSparklineTypeAction, _super);

        function SetSparklineTypeAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetSparklineTypeAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._sparklineType = options.sparklineType;
            self.execInSelectionsForCell(self._sheet, function (sheet, row, column) {
                var sparkline = sheet.getSparkline(row, column);
                if (sparkline) {
                    sparkline.sparklineType(self._sparklineType);
                }
            });
        };
        return SetSparklineTypeAction;
    })(DesignerActionBase);
    var commands_setSparklineType = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetSparklineTypeAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setSparklineType(spread, paramters) {
        runCommand(spread, "setSparklineType", commands_setSparklineType, {
            sparklineType: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setSparklineType = setSparklineType;


    var SetSparklineSettingAction = (function (_super) {
        designer.extends(SetSparklineSettingAction, _super);

        function SetSparklineSettingAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetSparklineSettingAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.execInSelectionsForCell(self._sheet, function (sheet, row, column) {
                var sparkline = sheet.getSparkline(row, column);
                if (sparkline) {
                    var setting = sparkline.setting();
                    setting.options[options.property] = options.value;
                    sparkline.setting(setting);
                }
            });
        };
        return SetSparklineSettingAction;
    })(DesignerActionBase);
    var commands_setSparklineSetting = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetSparklineSettingAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setSparklineSetting(spread, paramters) {
        var value = paramters.options.length > 0 ? paramters.options[0] : undefined;
        var property = paramters.options.length > 1 ? paramters.options[1] : undefined;
        runCommand(spread, "setSparklineSetting", commands_setSparklineSetting, {
            value: value,
            property: property,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setSparklineSetting = setSparklineSetting;


    var GroupSparklineAction = (function (_super) {
        designer.extends(GroupSparklineAction, _super);

        function GroupSparklineAction(spread, options) {
            _super.call(this, spread, options);
        }

        GroupSparklineAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var sparklines = [], sparkline;
            self.execInSelectionsForCell(self._sheet, function (sheet, row, column) {
                sparkline = sheet.getSparkline(row, column);
                if (sparkline) {
                    sparklines.push(sparkline);
                }
            });
            if (sparklines.length > 1) {
                self._sheet.groupSparkline(sparklines);
            }
        };
        return GroupSparklineAction;
    })(DesignerActionBase);
    var commands_groupSparkline = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new GroupSparklineAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function groupSparkline(spread, paramters) {
        runCommand(spread, "groupSparkline", commands_groupSparkline, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.groupSparkline = groupSparkline;


    var UnGroupSparklineAction = (function (_super) {
        designer.extends(UnGroupSparklineAction, _super);

        function UnGroupSparklineAction(spread, options) {
            _super.call(this, spread, options);
        }

        UnGroupSparklineAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this, sparkline;
            self.execInSelectionsForCell(self._sheet, function (sheet, row, column) {
                sparkline = sheet.getSparkline(row, column);
                if (sparkline) {
                    sheet.ungroupSparkline(sparkline.group());
                }
            });
        };
        return UnGroupSparklineAction;
    })(DesignerActionBase);
    var commands_unGroupSparkline = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new UnGroupSparklineAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function unGroupSparkline(spread, paramters) {
        runCommand(spread, "unGroupSparkline", commands_unGroupSparkline, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.unGroupSparkline = unGroupSparkline;


    var ClearSparklineAction = (function (_super) {
        designer.extends(ClearSparklineAction, _super);

        function ClearSparklineAction(spread, options) {
            _super.call(this, spread, options);
        }

        ClearSparklineAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.execInSelectionsForCell(self._sheet, function (sheet, row, column) {
                sheet.removeSparkline(row, column);
            });
        };
        return ClearSparklineAction;
    })(DesignerActionBase);
    var commands_clearSparkline = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new ClearSparklineAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function clearSparkline(spread, paramters) {
        runCommand(spread, "clearSparkline", commands_clearSparkline, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.clearSparkline = clearSparkline;


    var ClearSparklineGroupAction = (function (_super) {
        designer.extends(ClearSparklineGroupAction, _super);

        function ClearSparklineGroupAction(spread, options) {
            _super.call(this, spread, options);
        }

        ClearSparklineGroupAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self.execInSelectionsForCell(self._sheet, function (sheet, row, column) {
                var selectedSparkline = sheet.getSparkline(row, column);
                var group = selectedSparkline ? selectedSparkline.group() : null;
                if (group !== null && group.count() > 1) {
                    var sparklines = group.all(selectedSparkline);// it's an internal api
                    while (sparklines.length > 0) {
                        self._sheet.removeSparkline(sparklines[sparklines.length - 1].row, sparklines[sparklines.length - 1].column);
                    }
                }
            });
        };
        return ClearSparklineGroupAction;
    })(DesignerActionBase);
    var commands_clearSparklineGroup = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new ClearSparklineGroupAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function clearSparklineGroup(spread, paramters) {
        runCommand(spread, "clearSparklineGroup", commands_clearSparklineGroup, {
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.clearSparklineGroup = clearSparklineGroup;
    //#endregion
    //#region table
    var TableActionBase = (function (_super) {
        designer.extends(TableActionBase, _super);

        function TableActionBase() {
            _super.apply(this, arguments);
        }

        TableActionBase.prototype.getNewTableName = function () {
            var suffix = 0;
            for (var sheetIndex = 0; sheetIndex < this.spread().sheets.length; sheetIndex++) {
                var tables = this.spread().sheets[sheetIndex].tables.all();
                for (var tableIndex = 0; tableIndex < tables.length; tableIndex++) {
                    var tableName = tables[tableIndex].name();
                    if (tableName && tableName.length > 5 && tableName.substring(0, 5).toLowerCase() === TABLE) {
                        var temp = tableName.substring(5, tableName.length);
                        if ($.isNumeric(temp) && Number(temp) >= suffix) {
                            suffix = Number(temp);
                        }
                    }
                }
            }
            return 'Table' + (suffix + 1).toString();
        };

        TableActionBase.prototype.clearMergeInRange = function (range, sheet) {
            var col = range.col === -1 ? 0 : range.col;
            var row = range.row === -1 ? 0 : range.row;
            for (var i = 0; i < range.rowCount; i++) {
                for (var j = 0; j < range.colCount; j++) {
                    sheet.removeSpan(row + i, col + j);
                }
            }
        };
        return TableActionBase;
    })(DesignerActionBase);


    var CreateDefaultTableAction = (function (_super) {
        designer.extends(CreateDefaultTableAction, _super);

        function CreateDefaultTableAction(spread, options) {
            _super.call(this, spread, options);
        }

        CreateDefaultTableAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._range = options.exRange.ranges[0];
            var row = self._range.row === -1 ? 0 : self._range.row;
            var col = self._range.col === -1 ? 0 : self._range.col;
            var sheet = designer.wrapper.spread.getSheetFromName(options.exRange.sheetName);
            self.clearMergeInRange(self._range, sheet);
            sheet.tables.add(self.getNewTableName(), row, col, self._range.rowCount, self._range.colCount);
        };
        return CreateDefaultTableAction;
    })(TableActionBase);
    var commands_createDefaultTable = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new CreateDefaultTableAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function createDefaultTable(spread, paramters) {
        var sheet = paramters.sheet;
        var activeTable = sheet.tables.find(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex());
        runCommand(spread, "createDefaultTable", commands_createDefaultTable, {
            exRange: paramters.options,
            activeTable: activeTable,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.createDefaultTable = createDefaultTable;


    var FormatAsTableAction = (function (_super) {
        designer.extends(FormatAsTableAction, _super);

        function FormatAsTableAction(spread, options) {
            _super.call(this, spread, options);
        }

        FormatAsTableAction.prototype.executeImp = function (context, options, isUndo) {
            //var sm = (<any>this._sheet)._selectionModel;
            // Should support only for one selection (Excel disabled when multi selections)
            var self = this;
            self._tableStyle = options.tableStyle;
            var range = self.getSelections()[0];
            if (!range) {
                return;
            }
            var row = range.row === -1 ? 0 : range.row;
            var col = range.col === -1 ? 0 : range.col;
            var table = null;
            if (options.tableName) {
                table = self._sheet.tables.findByName(options.tableName);
            }
            if (table instanceof Sheets.Tables.Table) {
                table.style(self._tableStyle);
            } else {
                self.clearMergeInRange(range, self._sheet);
                var addedTable = self._sheet.tables.add(self.getNewTableName(), row, col, range.rowCount, range.colCount, self._tableStyle);
                if (!options.tableName) {
                    options.tableName = addedTable.name();
                } else {
                    addedTable.name(options.tableName);
                }
            }
        };
        return FormatAsTableAction;
    })(TableActionBase);
    var commands_formatAsTable = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new FormatAsTableAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function formatAsTable(spread, paramters) {
        var sheet = paramters.sheet;
        var table = sheet.tables.find(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex());
        var activeTableName = table ? table.name() : null;
        runCommand(spread, "formatAsTable", commands_formatAsTable, {
            tableStyle: paramters.options,
            tableName: activeTableName,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.formatAsTable = formatAsTable;


    var SetTableHeaderRowAction = (function (_super) {
        designer.extends(SetTableHeaderRowAction, _super);

        function SetTableHeaderRowAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetTableHeaderRowAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._value = options.value;
            var activeTable = self._sheet.tables.findByName(options.tableName);
            if (activeTable instanceof Sheets.Tables.Table) {
                activeTable.showHeader(self._value);
            }
        };

        return SetTableHeaderRowAction;
    })(DesignerActionBase);
    var commands_setTableHeaderRow = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetTableHeaderRowAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setTableHeaderRow(spread, paramters) {
        var sheet = paramters.sheet;
        var activeTableName = sheet.tables.find(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex()).name();
        runCommand(spread, "setTableHeaderRow", commands_setTableHeaderRow, {
            value: paramters.options,
            tableName: activeTableName,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setTableHeaderRow = setTableHeaderRow;


    var SetTableTotalRowAction = (function (_super) {
        designer.extends(SetTableTotalRowAction, _super);

        function SetTableTotalRowAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetTableTotalRowAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._value = options.value;
            var activeTable = self._sheet.tables.findByName(options.tableName);
            if (activeTable instanceof Sheets.Tables.Table) {
                activeTable.showFooter(self._value, true /* isFooterInserted */);
            }
        };
        return SetTableTotalRowAction;
    })(DesignerActionBase);
    var commands_setTableTotalRow = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetTableTotalRowAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setTableTotalRow(spread, paramters) {
        var sheet = paramters.sheet;
        var activeTableName = sheet.tables.find(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex()).name();
        runCommand(spread, "setTableTotalRow", commands_setTableTotalRow, {
            value: paramters.options,
            tableName: activeTableName,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setTableTotalRow = setTableTotalRow;


    var SetTableBandedRowsAction = (function (_super) {
        designer.extends(SetTableBandedRowsAction, _super);

        function SetTableBandedRowsAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetTableBandedRowsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._value = options.value;
            var activeTable = self._sheet.tables.findByName(options.tableName);
            if (activeTable instanceof Sheets.Tables.Table) {
                activeTable.bandRows(self._value);
            }
        };
        return SetTableBandedRowsAction;
    })(DesignerActionBase);
    var commands_setTableBandedRows = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetTableBandedRowsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setTableBandedRows(spread, paramters) {
        var sheet = paramters.sheet;
        var activeTableName = sheet.tables.find(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex()).name();
        runCommand(spread, "setTableBandedRows", commands_setTableBandedRows, {
            value: paramters.options,
            tableName: activeTableName,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setTableBandedRows = setTableBandedRows;


    var SetTableFirstColumnAction = (function (_super) {
        designer.extends(SetTableFirstColumnAction, _super);

        function SetTableFirstColumnAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetTableFirstColumnAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._value = options.value;
            var activeTable = self._sheet.tables.findByName(options.tableName);
            if (activeTable instanceof Sheets.Tables.Table) {
                activeTable.highlightFirstColumn(self._value);
            }
        };
        return SetTableFirstColumnAction;
    })(DesignerActionBase);
    var commands_setTableFirstColumn = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetTableFirstColumnAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setTableFirstColumn(spread, paramters) {
        var sheet = paramters.sheet;
        var activeTableName = sheet.tables.find(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex()).name();
        runCommand(spread, "setTableFirstColumn", commands_setTableFirstColumn, {
            value: paramters.options,
            tableName: activeTableName,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setTableFirstColumn = setTableFirstColumn;


    var SetTableLastColumnAction = (function (_super) {
        designer.extends(SetTableLastColumnAction, _super);

        function SetTableLastColumnAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetTableLastColumnAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._value = options.value;
            var activeTable = self._sheet.tables.findByName(options.tableName);
            if (activeTable instanceof Sheets.Tables.Table) {
                activeTable.highlightLastColumn(self._value);
            }
        };
        return SetTableLastColumnAction;
    })(DesignerActionBase);
    var commands_setTableLastColumn = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetTableLastColumnAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setTableLastColumn(spread, paramters) {
        var sheet = paramters.sheet;
        var activeTableName = sheet.tables.find(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex()).name();
        runCommand(spread, "setTableLastColumn", commands_setTableLastColumn, {
            value: paramters.options,
            tableName: activeTableName,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setTableLastColumn = setTableLastColumn;


    var SetTableBandedColumnsAction = (function (_super) {
        designer.extends(SetTableBandedColumnsAction, _super);

        function SetTableBandedColumnsAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetTableBandedColumnsAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._value = options.value;
            var activeTable = self._sheet.tables.findByName(options.tableName);
            if (activeTable instanceof Sheets.Tables.Table) {
                activeTable.bandColumns(self._value);
            }
        };
        return SetTableBandedColumnsAction;
    })(DesignerActionBase);
    var commands_setTableBandedColumns = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetTableBandedColumnsAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setTableBandedColumns(spread, paramters) {
        var sheet = paramters.sheet;
        var activeTableName = sheet.tables.find(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex()).name();
        runCommand(spread, "setTableBandedColumns", commands_setTableBandedColumns, {
            value: paramters.options,
            tableName: activeTableName,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setTableBandedColumns = setTableBandedColumns;

    Commands[RESIZE_TABLE_HANDLE] = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new resizeTableHandleButtonAction(context, options);//NOSONAR
            return cmd.execute(context, options, isUndo);
        }
    };
    var resizeTableHandleButtonAction = (function (_super) {
        designer.extends(resizeTableHandleButtonAction, _super);
        function resizeTableHandleButtonAction(spread, options) {
            _super.call(this, spread, options);
        }
        resizeTableHandleButtonAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._value = options.value;
            var activeTable = self._sheet.tables.findByName(options.tableName);
            if (activeTable instanceof Sheets.Tables.Table) {
                activeTable.showResizeHandle(self._value);
            }
        };
        return resizeTableHandleButtonAction;
    })(DesignerActionBase);
    function resizeTableHandleButton(spread, paramters) {
        var sheet = paramters.sheet;
        var activeTableName = sheet.tables.find(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex()).name();
        runCommand(spread, "resizeTableHandleButton", Commands[RESIZE_TABLE_HANDLE], {
            value: paramters.options,
            tableName: activeTableName,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }
    spreadActions.resizeTableHandleButton = resizeTableHandleButton;

    var SetTableFilterButtonAction = (function (_super) {
        designer.extends(SetTableFilterButtonAction, _super);

        function SetTableFilterButtonAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetTableFilterButtonAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._value = options.value;
            var activeTable = self._sheet.tables.findByName(options.tableName);
            if (activeTable instanceof Sheets.Tables.Table) {
                var tableRange = activeTable.range();
                if (typeof tableRange.colCount === 'number') {
                    self._sheet.suspendPaint();
                    for (var i = 0; i < tableRange.colCount; i++) {
                        activeTable.filterButtonVisible(i, self._value);
                    }
                    self._sheet.resumePaint();
                }
            }
        };
        return SetTableFilterButtonAction;
    })(DesignerActionBase);
    var commands_setTableFilterButton = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetTableFilterButtonAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setTableFilterButton(spread, paramters) {
        var sheet = paramters.sheet;
        var activeTableName = sheet.tables.find(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex()).name();
        runCommand(spread, "setTableFilterButton", commands_setTableFilterButton, {
            value: paramters.options,
            tableName: activeTableName,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setTableFilterButton = setTableFilterButton;


    var SetTableNameAction = (function (_super) {
        designer.extends(SetTableNameAction, _super);

        function SetTableNameAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetTableNameAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._value = options.value;
            var activeTable = self._sheet.tables.findByName(options.tableName);
            if (activeTable instanceof Sheets.Tables.Table) {
                activeTable.name(self._value);
            }
        };
        return SetTableNameAction;
    })(DesignerActionBase);
    var commands_setTableName = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetTableNameAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setTableName(spread, paramters) {
        var activeTableName = paramters.options.activeTableName;
        var newTableName = paramters.options.newTableName;
        runCommand(spread, "setTableName", commands_setTableName, {
            value: newTableName,
            tableName: activeTableName,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setTableName = setTableName;


    var ResizeTableAction = (function (_super) {
        designer.extends(ResizeTableAction, _super);

        function ResizeTableAction(spread, options) {
            _super.call(this, spread, options);
        }

        ResizeTableAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._value = options.value;
            var sheet = self._sheet;
            var table = sheet.tables.findByName(options.tableName);
            if (table instanceof Sheets.Tables.Table) {
                sheet.tables.resize(table, self._value);
            }
        };
        return ResizeTableAction;
    })(DesignerActionBase);
    var commands_resizeTable = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            options.considerAllSheets = true;
            var cmd = new ResizeTableAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function resizeTable(spread, paramters) {
        var sheet = paramters.sheet;
        var activeTableName = sheet.tables.find(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex()).name();
        runCommand(spread, "resizeTable", commands_resizeTable, {
            value: paramters.options,
            tableName: activeTableName,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.resizeTable = resizeTable;
    //#endregion

    //#region condition format
    var AddRuleAction = (function (_super) {
        designer.extends(AddRuleAction, _super);

        function AddRuleAction(spread, options) {
            _super.call(this, spread, options);
        }

        AddRuleAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var isRemove = options.value.isRemove;
            var formats = self._sheet.conditionalFormats;
            var rule;
            if (isRemove) {
                rule = options.value.rule;
                // remove rule because want to be same with excel
                for (var i = formats.count() - 1; i >= 0; i--) {
                    var iRule = formats.getRule(i);
                    if ((iRule.ruleType() === rule.ruleType()) && (JSON.stringify(iRule.ranges()) === JSON.stringify(rule.ranges()))) {
                        formats.removeRule(iRule);
                        break;
                    }
                }
            } else {
                rule = options.value;
            }
            formats.addRule(rule);
        };
        return AddRuleAction;
    })(DesignerActionBase);
    var commands_addRule = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new AddRuleAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function addRule(spread, paramters) {
        runCommand(spread, "addRule", commands_addRule, {
            value: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.addRule = addRule;


    var ClearRuleAction = (function (_super) {
        designer.extends(ClearRuleAction, _super);

        function ClearRuleAction(spread, options) {
            _super.call(this, spread, options);
        }

        ClearRuleAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            self._value = options.isFromEntireSheet;
            var ranges = self.getSelections();
            if (self._value) {
                self._sheet.conditionalFormats.clearRule();
            } else {
                for (var i = 0; i < ranges.length; i++) {
                    self._sheet.conditionalFormats.removeRuleByRange(ranges[i].row, ranges[i].col, ranges[i].rowCount, ranges[i].colCount);
                }
            }
        };
        return ClearRuleAction;
    })(DesignerActionBase);
    var commands_clearRule = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new ClearRuleAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function clearRule(spread, paramters) {
        runCommand(spread, "clearRule", commands_clearRule, {
            isFromEntireSheet: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.clearRule = clearRule;
    //#endregion
    //#region comments

    function setCommentProperty(spread, value) {
        var activeSheet = spread.getActiveSheet();
        var comment = activeSheet.comments.get(activeSheet.getActiveRowIndex(), activeSheet.getActiveColumnIndex());
        if (comment) {
            spread.commandManager().execute({
                cmd: "changeComment",
                sheetName: activeSheet.name(),
                comment: comment,
                oldValue: value.options.oldValue,
                newValue: value.options.newValue,
                propertyName: value.options.propertyName
            });
        }
    }

    spreadActions.setCommentProperty = setCommentProperty;
    //#endregion
    //#region Slicer Actions


    //Slicer cut action
    function floatingObjectCut(spread) {
        // TODO: slicer cut support
        //app.setClipboardText(spread.getActiveSheet()._doFloatingObjectCut(true));
        spread.commandManager().execute({
            cmd: "cutFloatingObjects",
            sheetName: spread.getActiveSheet().name(),
        });
    }

    spreadActions.floatingObjectCut = floatingObjectCut;

    //Slicer copy action
    function floatingObjectCopy(spread) {
        spread.commandManager().execute({
            cmd: "copyFloatingObjects",
            sheetName: spread.getActiveSheet().name(),
        });
    }

    spreadActions.floatingObjectCopy = floatingObjectCopy;

    var setSlicerStyleAction = (function (_super) {
        designer.extends(setSlicerStyleAction, _super);

        function setSlicerStyleAction(spread, options) {
            _super.call(this, spread, options);
        }

        setSlicerStyleAction.prototype.executeImp = function (content, option, isUndo) {
            var style = option.value.slicerStyle;
            var slicersName = option.slicersName;
            if (!slicersName || slicersName.length === 0) {
                return false;
            } else {
                for (var index in slicersName) { /* NOSONAR: ForIn */
                    var slicer = this.sheet().slicers.get(slicersName[index]);
                    slicer.style(style);
                }
            }
        };
        return setSlicerStyleAction;

    })(DesignerActionBase);

    var commands_setSlicerStyle = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new setSlicerStyleAction(context, options);
            cmd.execute(context, options, isUndo);
        }

    };

    function setSlicerStyle(spread, paramters) {
        var sheet = paramters.sheet;
        var selectedSlicers = designer.util.getSelectedSlicers(sheet) || [];
        var slicersName = [];
        for (var index = 0; index < selectedSlicers.length; index++) {
            slicersName.push(selectedSlicers[index].name());
        }
        runCommand(spread, "setSlicerStyle", commands_setSlicerStyle, {
            value: paramters.options,
            slicersName: slicersName,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setSlicerStyle = setSlicerStyle;

    var sortSlicerItemsAction = (function (_super) {
        designer.extends(sortSlicerItemsAction, _super);

        function sortSlicerItemsAction(spread, options) {
            _super.call(this, spread, options);
        }

        sortSlicerItemsAction.prototype.executeImp = function (content, option, isUndo) {
            var value = option.value;
            var slicersName = option.slicersName;
            if (!slicersName || slicersName.length === 0) {
                return false;
            } else {
                for (var index in slicersName) { /* NOSONAR: ForIn */
                    var slicer = this.sheet().slicers.get(slicersName[index]);
                    slicer.sortState(value);
                }
            }
        };
        return sortSlicerItemsAction;

    })(DesignerActionBase);

    var commands_sortSlicerItem = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new sortSlicerItemsAction(context, options);
            cmd.execute(context, options, isUndo);
        }

    };

    function sortSlicerItems(spread, paramters) {
        var sheet = paramters.sheet;
        var selectedSlicers = designer.util.getSelectedSlicers(sheet) || [];
        var slicersName = [];
        for (var index = 0; index < selectedSlicers.length; index++) {
            slicersName.push(selectedSlicers[index].name());
        }
        runCommand(spread, "sortSlicerItems", commands_sortSlicerItem, {
            value: paramters.options,
            slicersName: slicersName,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.sortSlicerItems = sortSlicerItems;

    var SetTagAction = (function (_super) {
        designer.extends(SetTagAction, _super);

        function SetTagAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetTagAction.prototype.executeImp = function (context, options, isUndo) {
            var tag = options.value;
            var type = options.type;
            var sheet = this.sheet();
            var selections = this.getSelections();
            var r, c, rowIndex, colIndex, endRow, endCol;
            switch (type) {
                case "sheet":
                    sheet.tag(tag);
                    break;
                case "cell":
                    selections.forEach(function (selection) {
                        rowIndex = selection.row !== -1 ? selection.row : 0;
                        colIndex = selection.col !== -1 ? selection.col : 0;
                        endRow = rowIndex + selection.rowCount;
                        endCol = colIndex + selection.colCount;
                        for (r = rowIndex; r < endRow; r++) {
                            for (c = colIndex; c < endCol; c++) {
                                sheet.setTag(r, c, tag);
                            }
                        }
                    });
                    break;
                case "row":
                    selections.forEach(function (selection) {
                        endRow = selection.row + selection.rowCount;
                        for (r = selection.row; r < endRow; r++) {
                            sheet.setTag(r, -1, tag);
                        }
                    });
                    break;
                case "column":
                    selections.forEach(function (selection) {
                        endCol = selection.col + selection.colCount;
                        for (c = selection.col; c < endCol; c++) {
                            sheet.setTag(-1, c, tag);
                        }
                    });
                    break;
            }
        };
        return SetTagAction;
    })(DesignerActionBase);
    var commands_setTag = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SetTagAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setTag(spread, paramters) {
        var value = paramters.options.length > 0 ? paramters.options[0] : undefined;
        var type = paramters.options.length > 1 ? paramters.options[1] : undefined;
        runCommand(spread, "setTag", commands_setTag, {
            value: value,
            type: type,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setTag = setTag;

    var propertyChangeAction = (function (_super) {
        designer.extends(propertyChangeAction, _super);

        function propertyChangeAction(spread, options) {
            _super.call(this, spread, options);
        }

        propertyChangeAction.prototype.executeImp = function (context, options, isUndo) {
            var selectedSlicers = [];
            var slicersName = options.slicersName;
            if (!slicersName || slicersName.length === 0) {
                return false;
            } else {
                for (var index in slicersName) { /* NOSONAR: ForIn */
                    var slicerItem = this.sheet().slicers.get(slicersName[index]);
                    selectedSlicers.push(slicerItem);
                }
            }
            var property = options.property, value = options.value;
            var slicer, itemValue;
            var isArray = value instanceof Array;
            for (var i = 0; i < selectedSlicers.length; i++) {
                slicer = selectedSlicers[i];
                if (isArray) {
                    itemValue = value[i];
                } else {
                    itemValue = value;
                }
                if (slicer[property] && itemValue !== undefined && itemValue !== null) {
                    slicer[property](itemValue);
                }
            }
        };
        return propertyChangeAction;
    })(DesignerActionBase);
    var commands_propertyChange = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new propertyChangeAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function slicerPropertyChanged(spread, paramters) {
        var property = paramters.options.length > 0 ? paramters.options[0] : undefined;
        var value = paramters.options.length > 1 ? paramters.options[1] : undefined;
        var selectedSlicers = paramters.options.length > 2 ? paramters.options[2] : [];
        var slicersName = [];
        for (var index = 0; index < selectedSlicers.length; index++) {
            slicersName.push(selectedSlicers[index].name());
        }
        runCommand(spread, "slicerPropertyChanged", commands_propertyChange, {
            property: property,
            value: value,
            slicersName: slicersName,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.slicerPropertyChanged = slicerPropertyChanged;

    designer.loader.ready(function () {
        if (!designer.wrapper.spread.notWorking) {
            var spread = designer.wrapper.spread;
            initDesignerCommands(spread.commandManager());
        }
    });
    //#endregion
    //#region sortRange
    var SortCustomRangeAction = (function (_super) {
        designer.extends(SortCustomRangeAction, _super);

        function SortCustomRangeAction(spread, options) {
            _super.call(this, spread, options);
        }

        SortCustomRangeAction.prototype.executeImp = function (context, options, isUndo) {
            var selections = this.getSelections();
            var byRows = options.byRows;
            var sortInfos = options.sortInfos;
            var activeSheet = this.sheet();
            for (var k = 0; k < selections.length; k++) {
                var activeSelection = selections[k];
                activeSheet.sortRange(activeSelection.row, activeSelection.col, activeSelection.rowCount, activeSelection.colCount, byRows, sortInfos);
            }
        };
        return SortCustomRangeAction;
    })(DesignerActionBase);
    var commands_customSortRange = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SortCustomRangeAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function sortCustomRange(spread, paramters) {
        runCommand(spread, "sortCustomRange", commands_customSortRange, {
            byRows: paramters.options.byRows,
            sortInfos: paramters.options.sortInfos,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.sortCustomRange = sortCustomRange;

    //#endregion
    //#region chart
    //base chart action
    var DesignerChartActionBase = (function (_super) {
        designer.extends(chartActionBase, _super);

        function chartActionBase(spread, options) {
            _super.call(this, spread, options);
        }

        chartActionBase.prototype.undoImp = function (context, options, isUndo) {    /* NOSONAR: UnusedFunctionArgument*/
            context.suspendPaint();
            GC.Spread.Sheets.Commands.undoTransaction(context, options);
            if (this.isSendEvent()) {
                var chart = this._sheet.charts.get(options.chartName);
                triggerChartChanged(chart);
            }
            context.resumePaint();
            return true;
        };
        chartActionBase.prototype.isSendEvent = function (context, options, isUndo) {
            return true;
        };
        return chartActionBase;
    })(DesignerActionBase);
    var insertChartAction = (function (_super) {
        designer.extends(InsertChartAction, _super);

        function InsertChartAction(spread, options) {
            _super.call(this, spread, options);
        }

        InsertChartAction.prototype.executeImp = function (context, options, isUndo) {
            try {
                var self = this;
                var sheet = self.sheet();
                var dataFormula = options.dataFormula;
                var category = options.category;
                var chartType = Charts.ChartType[options.chartType];
                var dataRange = formulaToRange(sheet, dataFormula);
                var positionRow = dataRange.row, positionCol = dataRange.col + dataRange.colCount;
                var chartPosition = self._getChartPositionInXY(sheet, positionRow, positionCol);
                var chartName = '';
                var chart, i, series;
                var rowCol = options.dataOrientation;
                if (category === chartHelper.chartTypeDict["0"].chartGroup) {
                    chart = sheet.charts.add(chartName, Charts.ChartType.columnClustered, chartPosition.x, chartPosition.y, 480, 300);
                    series = chart.series();
                    for (i = 0; i < options.series.length; i++) {
                        series.add(options.series[i]);
                    }
                } else if (category === chartHelper.chartTypeDict["52"].chartGroup
                    || chartType === Charts.ChartType.pie) {
                    chart = sheet.charts.add(chartName, chartType, chartPosition.x, chartPosition.y, 480, 300, dataFormula);
                } else {
                    chart = sheet.charts.add(chartName, chartType, chartPosition.x, chartPosition.y, 480, 300, dataFormula, rowCol);
                }
                // For fix bug:actual it is dv's bug,but for designer not crash,do special handle here.if series count>8,hide legend

                chartHelper.resetChartsFocus(sheet);
                chart.isSelected(true);
                designer.actions.isFileModified = true;
            } catch (e) {
                designer.MessageBox.show(designer.res.selectChartDialog.errorPrompt.unexpectedErrorMsg, designer.res.title, 2 /* warning */);
                return false;
            }
        };

        InsertChartAction.prototype.isSendEvent = function (context, options, isUndo) {
            return false;
        };

        InsertChartAction.prototype._getChartPositionInXY = function (sheet, row, col) {
            var x = 20, y = 20; // default offset
            for (var c = 0; c < col; c++) {
                x += sheet.getColumnWidth(c);
            }
            for (var r = 0; r < row; r++) {
                y += sheet.getRowHeight(r);
            }
            return { x: x, y: y };
        };

        return InsertChartAction;
    })(DesignerChartActionBase);

    var commands_insertChart = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new insertChartAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function insertChart(spread, paramters) {
        runCommand(spread, "insertChart", commands_insertChart, {
            selections: paramters.selections,
            sheetName: paramters.sheetName,
            category: paramters.options.category,
            chartType: paramters.options.chartType,
            dataOrientation: paramters.options.dataOrientation,
            series: paramters.options.series,
            dataFormula: paramters.options.dataFormula
        });
    }

    spreadActions.insertChart = insertChart;

    var moveChartAction = (function (_super) {
        designer.extends(MoveChartAction, _super);

        function MoveChartAction(spread, options) {
            _super.call(this, spread, options);
        }

        MoveChartAction.prototype.executeImp = function (context, options, isUndo) {
            var spread = context;
            var commandManager = spread.commandManager();
            var activeSheet = this.sheet();
            if (activeSheet.name() === options.targetSheetName) {
                return;
            }
            var type = options.type;
            var targetSheet;
            if (type === "newSheet") {
                var sheets = spread.sheets;
                var i = 0, count = sheets.length;
                for (; i < count; i++) {
                    if (options.targetSheetName === sheets[i].name()) {
                        designer.MessageBox.show(designer.res.moveChartDialog.errorPrompt.sameSheetNameError, designer.res.title, 2 /* warning */);
                        return false;
                    }
                }
                targetSheet = new GC.Spread.Sheets.Worksheet(options.targetSheetName);
                spread.addSheet(0, targetSheet);
            }
            // chart's operate doesn't support undo now:2017/11/14
            var cutFloatingObjectsCommand = commandManager.getCommand("cutFloatingObjects");
            var deleteFloatingObjectsCommand = commandManager.getCommand("deleteFloatingObjects");
            var canUndoMethod = deleteFloatingObjectsCommand.canUndo;
            deleteFloatingObjectsCommand.canUndo = function () {
                return false;
            };
            cutFloatingObjectsCommand.execute(spread, { sheetName: activeSheet.name() });
            deleteFloatingObjectsCommand.canUndo = canUndoMethod;
            var pasteFloatingObjectsCommand = commandManager.getCommand("pasteFloatingObjects");
            canUndoMethod = pasteFloatingObjectsCommand.canUndo;
            pasteFloatingObjectsCommand.canUndo = function () {
                return false;
            };
            pasteFloatingObjectsCommand.execute(spread, { sheetName: options.targetSheetName });
            pasteFloatingObjectsCommand.canUndo = canUndoMethod;
            designer.wrapper.spread.undoManager().clear();
        };

        return MoveChartAction;
    })(DesignerChartActionBase);

    var commands_moveChart = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new moveChartAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function moveChart(spread, paramters) {
        var sheet = spread.getActiveSheet();
        var chart = getSelectedChart(sheet);
        runCommand(spread, "moveChart", commands_moveChart, {
            chart: chart,
            selections: paramters.selections,
            sheetName: paramters.sheetName,
            targetSheetName: paramters.options.targetSheetName,
            type: paramters.options.type
        });
    }

    spreadActions.moveChart = moveChart;

    var changeChartTypeAction = (function (_super) {
        designer.extends(ChangeChartTypeAction, _super);

        function ChangeChartTypeAction(spread, options) {
            _super.call(this, spread, options);
        }

        ChangeChartTypeAction.prototype.executeImp = function (context, options, isUndo) {
            var sheet = this.sheet();
            var chart = sheet.charts.get(options.chartName);
            var isSwitchDataOrientation = options.isSwitchDataOrientation;
            var category = options.category;
            var chartType = Charts.ChartType[options.chartType];
            try {
                if (category !== chartHelper.chartTypeDict["0"].chartGroup) {
                    chart.chartType(chartType);
                    if (isSwitchDataOrientation) {
                        chart.switchDataOrientation();
                    }
                } else if (options.series && options.series.length > 0) {
                    var series = chart.series();
                    var i, count = series.get().length;
                    for (i = 0; i < count; i++) {
                        var oldSeries = series.get(0);
                        options.series[i].errorBars = oldSeries.errorBars; //When change chart type, needs keep errorBars and trendlines.
                        options.series[i].trendlines = oldSeries.trendlines;
                        series.remove(0);
                    }
                    count = options.series.length;
                    for (i = 0; i < count; i++) {
                        series.add(options.series[i]);
                    }
                }
                if (chart.colorAndStyle && chart.colorAndStyle.color) {
                    chartHelper.applyChartSeriesTheme(chart, chart.colorAndStyle.color);
                }
            } catch (e) {
                designer.MessageBox.show(designer.res.selectData.errorPrompt.unexpectedErrorMsg, designer.res.title, 2/* warning */);
                return false;
            }
            chartHelper.resetChartsFocus(sheet);
            chart.isSelected(true);
            triggerChartChanged(chart);
        };

        return ChangeChartTypeAction;
    })(DesignerChartActionBase);

    var commands_changeChartType = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new changeChartTypeAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function changeChartType(spread, paramters) {
        runCommand(spread, "changeChartType", commands_changeChartType, {
            selections: paramters.selections,
            sheetName: paramters.sheetName,
            chartType: paramters.options.chartType,
            isSwitchDataOrientation: paramters.options.isSwitchDataOrientation,
            series: paramters.options.series,
            dataFormula: paramters.options.dataFormula,
            category: paramters.options.category,
            chartName: paramters.options.chart.name()
        });
    }

    spreadActions.changeChartType = changeChartType;


    var setChartStyleAction = (function (_super) {
        designer.extends(SetChartStyleAction, _super);

        function SetChartStyleAction(spread, options) {
            _super.call(this, spread, options);
        }

        SetChartStyleAction.prototype.executeImp = function (context, options, isUndo) {
            var sheet = this.sheet();
            var chart = sheet.charts.get(options.chartName);
            var templatesChartStyle = options.chartStyle.templatesChartStyle;
            var defaultChartStyle = options.chartStyle.defaultChartStyle;
            //apply chartArea will effect other chart property,like chart title's fontSize etc.
            chartHelper.SetChartStyle(chart, defaultChartStyle, 'default');
            chartHelper.SetChartStyle(chart, templatesChartStyle, 'templetes');
        };
        return SetChartStyleAction;
    })(DesignerChartActionBase);

    var commands_setChartStyle = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new setChartStyleAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setChartStyle(spread, paramters) {
        var sheet = spread.getActiveSheet();
        var chartName = getSelectedChart(sheet).name();
        runCommand(spread, "setChartStyle", commands_setChartStyle, {
            chartName: chartName,
            selections: paramters.selections,
            sheetName: paramters.sheetName,
            chartStyle: paramters.options.chartStyle
        });
    }

    spreadActions.setChartStyle = setChartStyle;

    var setChartLayoutAction = (function (_super) {
        designer.extends(setChartLayoutAction, _super);

        function setChartLayoutAction(spread, options) {
            _super.call(this, spread, options);
        }

        setChartLayoutAction.prototype.executeImp = function (context, options, isUndo) {
            var sheet = this.sheet();
            var chart = sheet.charts.get(options.chartName);
            var layouts = options.layouts;
            for (var layoutType in layouts) {
                if (layouts.hasOwnProperty(layoutType)) {
                    var layoutDetail = layouts[layoutType];
                    chart[layoutType](layoutDetail);
                }
            }
            triggerChartChanged(chart);
        };
        return setChartLayoutAction;
    })(DesignerChartActionBase);

    var commands_setChartLayout = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new setChartLayoutAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function setChartLayout(spread, paramters) {
        var sheet = spread.getActiveSheet();
        var chartName = getSelectedChart(sheet).name();
        runCommand(spread, "setChartLayout", commands_setChartLayout, {
            chartName: chartName,
            layouts: paramters.options.layouts,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.setChartLayout = setChartLayout;


    var updateChartSeriesAction = (function (_super) {
        designer.extends(updateChartSeriesAction, _super);

        function updateChartSeriesAction(spread, options) {
            _super.call(this, spread, options);
        }

        updateChartSeriesAction.prototype.executeImp = function (context, options, isUndo) {
            var sheet = this.sheet();
            var chart = sheet.charts.get(options.chartName);
            var ChartType = GC.Spread.Sheets.Charts.ChartType;
            var seriesCollection = chart.series();
            var value = options.series.value;
            if (chart) {
                if ((chart.chartType() === ChartType.sunburst || chart.chartType() === ChartType.treemap) && value.isFillSetting === true) {
                    seriesCollection.set(options.series.index, { backColor: null });
                }
                if (options.series.index === undefined || options.series.index === null) {
                    seriesCollection.set(value);
                } else {
                    seriesCollection.set(options.series.index, value);
                }
            }
            //triggerChartChanged(chart);
        };
        return updateChartSeriesAction;
    })(DesignerChartActionBase);

    var commands_updateChartSeries = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new updateChartSeriesAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function updateChartSeries(spread, paramters) {
        runCommand(spread, "updateChartSeries", commands_updateChartSeries, {
            selections: paramters.selections,
            sheetName: paramters.sheetName,
            chartName: paramters.options.chart.name(),
            series: paramters.options.element
        });
    }

    spreadActions.updateChartSeries = updateChartSeries;

    var SwitchChartRowColAction = (function (_super) {
        designer.extends(SwitchChartRowColAction, _super);

        function SwitchChartRowColAction(spread, options) {
            _super.call(this, spread, options);
        }

        SwitchChartRowColAction.prototype.executeImp = function (context, options, isUndo) {
            var sheet = this.sheet();
            var selectedChart = sheet.charts.get(options.chartName);
            var chartGroupString = chartHelper.getChartGroupString(selectedChart.chartType());
            if (selectedChart) {
                if (chartGroupString === chartHelper.chartTypeDict["50"].chartGroup ||
                    chartGroupString === chartHelper.chartTypeDict["57"].chartGroup ||
                    chartGroupString === chartHelper.chartTypeDict["58"].chartGroup) {
                    designer.MessageBox.show(designer.res.selectData.errorPrompt.cantSwitchRowColumn, designer.res.title, 2/* warning */);
                    return false;
                }
                try {
                    var isSuccess = selectedChart.switchDataOrientation();
                    if (isSuccess) {
                        var themeOptions = selectedChart.colorAndStyle && selectedChart.colorAndStyle.color;
                        if (themeOptions) {
                            chartHelper.applyChartSeriesTheme(selectedChart, themeOptions);
                        }
                        triggerChartChanged(selectedChart);
                        return true;
                    } else {
                        designer.MessageBox.show(designer.res.selectData.errorPrompt.cantSwitchRowColumn, designer.res.title, 2/* warning */);
                        return false;
                    }
                } catch (e) {
                    designer.MessageBox.show(designer.res.selectData.errorPrompt.cantSwitchRowColumn, designer.res.title, 2/* warning */);
                    return false;
                }
            }
        };

        return SwitchChartRowColAction;
    })(DesignerChartActionBase);

    var commands_switchChartRowCol = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new SwitchChartRowColAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function switchChartRowCol(spread, paramters) {
        var sheet = spread.getActiveSheet();
        var chartName = getSelectedChart(sheet).name();
        runCommand(spread, "switchChartRowCol", commands_switchChartRowCol, {
            chartName: chartName,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.switchChartRowCol = switchChartRowCol;

    var updateChartAllSeriesAction = (function (_super) {

        designer.extends(updateChartAllSeriesAction, _super);

        function updateChartAllSeriesAction(spread, options) {
            _super.call(this, spread, options);
        }

        updateChartAllSeriesAction.prototype.executeImp = function (context, options, isUndo) {
            var allSeries = options.seriesArray;
            var sheet = this.sheet();
            var chart = sheet.charts.get(options.chartName);
            var beforeSeriesCount = chart.series().get().length;
            //remove
            if (0 < beforeSeriesCount) {
                for (var j = beforeSeriesCount; j > 0; j--) {
                    chart.series().remove(j - 1);
                }
            }
            //add or update
            chart.series().add(allSeries);
            triggerChartChanged(chart);
        };
        return updateChartAllSeriesAction;

    })(DesignerChartActionBase);

    var commands_updateChartAllSeries = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new updateChartAllSeriesAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };

    function updateChartAllSeries(spread, paramters) {
        runCommand(spread, "updateChartAllSeries", commands_updateChartAllSeries, {
            selections: paramters.selections,
            sheetName: paramters.sheetName,
            seriesArray: paramters.options.seriesArray,
            chartName: paramters.options.chart.name()
        });
    }

    spreadActions.updateChartAllSeries = updateChartAllSeries;


    var ChangeChartSeriesColor = (function (_super) {
        designer.extends(ChangeChartSeriesColor, _super);

        function ChangeChartSeriesColor(spread, options) {
            _super.call(this, spread, options);
        }

        ChangeChartSeriesColor.prototype.executeImp = function (context, options, isUndo) {
            var sheet = this.sheet();
            var chart = sheet.charts.get(options.chartName);
            if (chart) {
                if (!chart.colorAndStyle) {
                    chart.colorAndStyle = {};
                }
                chart.colorAndStyle.color = { group: options.group, index: options.index };
                chartHelper.applyChartSeriesTheme(chart, options);
                if (!options.ignoreEvent) {
                    triggerChartChanged(chart);
                }
            }
        };
        return ChangeChartSeriesColor;
    })(DesignerChartActionBase);

    var commands_changeChartSeriesColor = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new ChangeChartSeriesColor(context, options);
            cmd.execute(context, options, isUndo);
        }
    };

    function changeChartSeriesColor(spread, paramters) {
        var sheet = spread.getActiveSheet();
        var chartName = getSelectedChart(sheet).name();
        runCommand(spread, "changeChartSeriesColor", commands_changeChartSeriesColor, {
            sheetName: paramters.sheetName,
            selections: paramters.selections,
            group: paramters.options.group,
            index: paramters.options.index,
            type: paramters.options.type,
            ignoreEvent: paramters.options.ignoreEvent,
            chartName: chartName
        });
    }

    spreadActions.changeChartSeriesColor = changeChartSeriesColor;

    function updateChartSize(spread, options) {
        var sheetName = options.sheetName;
        var _commandManager = spread.commandManager();
        var chartOptions = options.options;
        _commandManager.execute({
            cmd: "resizeFloatingObjects",
            sheetName: sheetName,
            floatingObjects: chartOptions.name,
            offsetX: chartOptions.x,
            offsetY: chartOptions.y,
            offsetWidth: chartOptions.width,
            offsetHeight: chartOptions.height
        });
    }

    spreadActions.updateChartSize = updateChartSize;

    var UpdateChartElement = (function (_super) {
        designer.extends(UpdateChartElement, _super);

        function UpdateChartElement(spread, options) {
            _super.call(this, spread, options);
        }

        UpdateChartElement.prototype.executeImp = function (content, option, isUndo) {
            var sheet = this.sheet();
            var chart = sheet.charts.get(option.chartName);
            var elementObj = option.elementObj;
            if (chart) {
                for (var key in elementObj) {
                    if (elementObj.hasOwnProperty(key)) {
                        chart[key](elementObj[key]);
                    }
                }
            }
            triggerChartChanged(chart);
        };
        return UpdateChartElement;

    })(DesignerChartActionBase);

    var commands_updateChartElement = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new UpdateChartElement(context, options);
            cmd.execute(context, options, isUndo);
        }

    };

    function changeChartElement(spread, paramters) {
        var sheet = spread.getActiveSheet();
        var chartName = getSelectedChart(sheet).name();
        runCommand(spread, "changeChartElement", commands_updateChartElement, {
            chartName: chartName,
            elementObj: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.changeChartElement = changeChartElement;

    var UpdateChartFormatProperty = (function (_super) {
        designer.extends(UpdateChartFormatProperty, _super);

        function UpdateChartFormatProperty(spread, options) {
            _super.call(this, spread, options);
        }

        UpdateChartFormatProperty.prototype.executeImp = function (content, option, isUndo) {
            var sheet = this.sheet();
            var chart = sheet.charts.get(option.chartName);
            var elementObj = option.elementObj;
            if (chart) {
                for (var key in elementObj) {
                    if (elementObj.hasOwnProperty(key)) {
                        chart[key](elementObj[key]);
                    }
                }
            }
        };
        return UpdateChartFormatProperty;

    })(DesignerChartActionBase);

    var commands_updateChartFormatProperty = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new UpdateChartFormatProperty(context, options);
            cmd.execute(context, options, isUndo);
        }

    };

    function changeChartFormatProperty(spread, paramters) {
        runCommand(spread, "changeChartFormatProperty", commands_updateChartFormatProperty, {
            chartName: paramters.options.chart.name(),
            elementObj: paramters.options.element,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.changeChartFormatProperty = changeChartFormatProperty;
    var UpdateChartDataPointProperty = (function (_super) {
        designer.extends(UpdateChartDataPointProperty, _super);
        function UpdateChartDataPointProperty(spread, options) {
            _super.call(this, spread, options);
        }
        UpdateChartDataPointProperty.prototype.executeImp = function (content, option, isUndo) {
            var sheet = this.sheet();
            var chart = sheet.charts.get(option.chartName);
            var dataPointIndex = option.elementObj.dataPointIndex;
            var dataPointOption = option.elementObj.dataPointOption;
            if (chart) {
                chart.series().dataPoints().set(dataPointIndex, dataPointOption);
            }
        };
        return UpdateChartDataPointProperty;
    })(DesignerChartActionBase);
    var commands_updateChartDataPointProperty = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new UpdateChartDataPointProperty(context, options);
            cmd.execute(context, options, isUndo);
        }
    };
    function changeDataPointProperty(spread, paramters) {
        runCommand(spread, "changeDataPointProperty", commands_updateChartDataPointProperty, {
            chartName: paramters.options.chart.name(),
            elementObj: paramters.options,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }
    spreadActions.changeDataPointProperty = changeDataPointProperty;
    //#endregion

    var DesignerShapeActionBase = (function (_super) {
        designer.extends(shapeActionBase, _super);
        function shapeActionBase(spread, options) {
            _super.call(this, spread, options);
        }
        shapeActionBase.prototype.undoImp = function (context, options, isUndo) {    /* NOSONAR: UnusedFunctionArgument*/
            context.suspendPaint();
            GC.Spread.Sheets.Commands.undoTransaction(context, options);
            if (this.isSendEvent()) {
                triggerShapeChanged(options.shape);
            }
            context.resumePaint();
            return true;
        };
        shapeActionBase.prototype.isSendEvent = function (context, options, isUndo) {
            return true;
        };
        return shapeActionBase;
    })(DesignerActionBase);
    var insertShapeAction = (function (_super) {
        designer.extends(InsertShapeAction, _super);
        function InsertShapeAction(spread, options) {
            _super.call(this, spread, options);
        }
        InsertShapeAction.prototype.executeImp = function (context, options, isUndo) {
            var self = this;
            var sheet = self.sheet();
            var autoShapeType = shapes.AutoShapeType;
            var connectorType = shapes.ConnectorType;
            var arrowheadLength = shapes.ArrowheadLength;
            var arrowheadStyle = shapes.ArrowheadStyle;
            var arrowheadWidth = shapes.ArrowheadWidth;
            var shapeInfo = options.shapeInfo;
            var shapePosition = options.position;
            var isConnectorType = options.isConnectorType;
            var connectorShape, type;
            designer.actions.isFileModified = true;
            if (isConnectorType) {
                type = connectorType[shapeInfo.type];
                connectorShape = sheet.shapes.addConnector('', type, shapePosition.x, shapePosition.y, shapePosition.x + 100, shapePosition.y + 100);
                var arrowStyle = connectorShape.style();
                if (shapeInfo.beginArrowhead !== undefined) {
                    arrowStyle.line.beginArrowheadStyle = arrowheadStyle[shapeInfo.beginArrowhead.beginArrowheadStyle];
                    arrowStyle.line.beginArrowheadWidth = arrowheadWidth[shapeInfo.beginArrowhead.beginArrowheadWidth];
                    arrowStyle.line.beginArrowheadLength = arrowheadLength[shapeInfo.beginArrowhead.beginArrowheadLength];
                    connectorShape.style(arrowStyle);
                }
                if (shapeInfo.endArrowhead !== undefined) {
                    arrowStyle.line.endArrowheadStyle = arrowheadStyle[shapeInfo.endArrowhead.endArrowheadStyle];
                    arrowStyle.line.endArrowheadWidth = arrowheadWidth[shapeInfo.endArrowhead.endArrowheadWidth];
                    arrowStyle.line.endArrowheadLength = arrowheadLength[shapeInfo.endArrowhead.endArrowheadLength];
                    connectorShape.style(arrowStyle);
                }
            } else {
                type = autoShapeType[shapeInfo.type];
                if (shapeInfo.type === 'leftRightArrow' || shapeInfo.type === 'leftRightArrowCallout' || shapeInfo.type === 'leftRightRibbon') {
                    sheet.shapes.add('', type, shapePosition.x, shapePosition.y, 200, 150);
                } else if (shapeInfo.type === 'upDownArrow' || shapeInfo.type === 'upDownArrowCallout') {
                    sheet.shapes.add('', type, shapePosition.x, shapePosition.y, 150, 200);
                } else {
                    sheet.shapes.add('', type, shapePosition.x, shapePosition.y, 150, 150);
                }
            }
        };
        InsertShapeAction.prototype.isSendEvent = function (context, options, isUndo) {
            return false;
        };
        return InsertShapeAction;
    })(DesignerShapeActionBase);
    var commands_insertShape = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new insertShapeAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    function insertShape(spread, paramters) {
        runCommand(spread, "insertShape", commands_insertShape, {
            sheetName: paramters.sheetName,
            shapeInfo: paramters.options.shapeInfo,
            isConnectorType: paramters.options.isConnectorType,
            selections: paramters.selections,
            position: paramters.options.position
        });
    }
    spreadActions.insertShape = insertShape;
    var changeShapeTypeAction = (function (_super) {
        designer.extends(changeShapeTypeAction, _super);
        function changeShapeTypeAction(spread, options) {
            _super.call(this, spread, options);
        }
        changeShapeTypeAction.prototype.executeImp = function (context, options, isUndo) {
            var selectShapes = options.selectShapes;
            var autoShapeType = shapes.AutoShapeType;
            var newShapeType = autoShapeType[options.newShapeType.type];
            for (var i = 0; i < selectShapes.length; i++) {
                if (selectShapes[i] instanceof GC.Spread.Sheets.Shapes.Shape) {
                    selectShapes[i].type(newShapeType);
                }
                if (selectShapes[i] instanceof GC.Spread.Sheets.Shapes.GroupShape) {
                    var childShapes = selectShapes[i].all();
                    childShapes.forEach(function (shape) {
                        if (shape instanceof GC.Spread.Sheets.Shapes.Shape) {
                            shape.type(newShapeType);
                        }
                    });
                }
            }
        };
        return changeShapeTypeAction;
    })(DesignerShapeActionBase);
    var commands_changeShapeType = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new changeShapeTypeAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    function changeShapeType(spread, paramters) {
        runCommand(spread, "changeShapeType", commands_changeShapeType, {
            sheetName: paramters.sheetName,
            selectShapes: paramters.options.selectShapes,
            newShapeType: paramters.options.newShapeType
        })
            ;
    }
    spreadActions.changeShapeType = changeShapeType;
    var changeShapeStyleAction = (function (_super) {
        designer.extends(changeShapeStyleAction, _super);
        function changeShapeStyleAction(spread, options) {
            _super.call(this, spread, options);
        }
        function _mergeStyle(oldStyle, newStyle) {
            for (var key in newStyle) {
                if (oldStyle[key] && typeof oldStyle[key] === 'object') {
                    _mergeStyle(oldStyle[key], newStyle[key]);
                } else {
                    oldStyle[key] = newStyle[key];
                }
            }
            return oldStyle;
        }
        function _setShapeStyle(selectedShape, style) {
            if (selectedShape && selectedShape instanceof GC.Spread.Sheets.Shapes.GroupShape) {
                var children = selectedShape.all();
                for (var j = 0; j < children.length; j++) {
                    _setShapeStyle(children[j], style);
                }
            } else {
                selectedShape.style(_mergeStyle(selectedShape.style(), style));
            }
        }
        changeShapeStyleAction.prototype.executeImp = function (context, options, isUndo) {
            var newStyle = options.style;
            var selectedShapeArray = options.selectedShape;
            for (var i = 0; i < selectedShapeArray.length; i++) {
                _setShapeStyle(selectedShapeArray[i], newStyle);
            }
            if (!options.ignoreEvent) {
                triggerShapeChanged(selectedShapeArray);
            }
        };
        return changeShapeStyleAction;
    })(DesignerShapeActionBase);
    var commands_changeShapeStyle = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new changeShapeStyleAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    function changeShapeStyle(spread, paramters) {
        runCommand(spread, "changeShapeStyle", commands_changeShapeStyle, {
            selectedShape: paramters.options.selectShape,
            style: paramters.options.style,
            sheetName: paramters.sheetName,
            ignoreEvent: paramters.options.ignoreEvent,
        });
    }
    spreadActions.changeShapeStyle = changeShapeStyle;
    var changeShapeSizeAndPropertiesAction = (function (_super) {
        designer.extends(changeShapeSizeAndPropertiesAction, _super);
        function changeShapeSizeAndPropertiesAction(spread, options) {
            _super.call(this, spread, options);
        }
        changeShapeSizeAndPropertiesAction.prototype.executeImp = function (context, options, isUndo) {
            var width = options.width;
            var height = options.height;
            var angle = options.angle;
            var moveSizeRelationship = options.moveSizeRelationship;
            var locked = options.locked;
            var printObject = options.printObject;
            var rotateFlag = options.rotateFlag;
            var selectedShapeArray = options.selectedShape;
            var tempShape;
            for (var i = 0; i < selectedShapeArray.length; i++) {
                tempShape = selectedShapeArray[i];
                if (width !== undefined) {
                    tempShape.width(width);
                }
                if (height !== undefined) {
                    tempShape.height(height);
                }
                if (angle !== undefined) {
                    if (rotateFlag) {
                        var nowAngle = tempShape.rotate();
                        tempShape.rotate(nowAngle + angle);
                    } else {
                        tempShape.rotate(angle);
                    }
                }
                if (locked !== undefined) {
                    this.updateProp(tempShape, "isLocked", locked);
                }
                if (printObject !== undefined) {
                    this.updateProp(tempShape, "canPrint", printObject);
                }
                if (moveSizeRelationship !== undefined) {
                    if (moveSizeRelationship === 0) {
                        this.updateProp(tempShape, "dynamicMove", true);
                        this.updateProp(tempShape, "dynamicSize", true);
                    }
                    if (moveSizeRelationship === 1) {
                        this.updateProp(tempShape, "dynamicMove", true);
                        this.updateProp(tempShape, "dynamicSize", false);
                    }
                    if (moveSizeRelationship === 2) {
                        this.updateProp(tempShape, "dynamicMove", false);
                        this.updateProp(tempShape, "dynamicSize", false);
                    }
                }
            }
            if (!options.ignoreEvent) {
                triggerShapeChanged(selectedShapeArray);
            }
        };
        changeShapeSizeAndPropertiesAction.prototype.updateProp = function (shape, prop, value) {
            shape[prop](value);
            var self = this;
            if (shape instanceof GC.Spread.Sheets.Shapes.GroupShape) {
                shape.all().forEach(function (sp) {
                    self.updateProp(sp, prop, value);
                });
            }
        };
        return changeShapeSizeAndPropertiesAction;
    })(DesignerShapeActionBase);
    var commands_changeShapeSizeAndProperties = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new changeShapeSizeAndPropertiesAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    function changeShapeSizeAndProperties(spread, paramters) {
        runCommand(spread, "changeShapeSizeAndProperties", commands_changeShapeSizeAndProperties, {
            selectedShape: paramters.options.selectShape,
            width: paramters.options.width,
            height: paramters.options.height,
            angle: paramters.options.angle,
            moveSizeRelationship: paramters.options.moveSizeRelationship,
            locked: paramters.options.locked,
            printObject: paramters.options.printObject,
            sheetName: paramters.sheetName,
            ignoreEvent: paramters.options.ignoreEvent,
            rotateFlag: paramters.options.rotateFlag
        });
    }
    spreadActions.changeShapeSizeAndProperties = changeShapeSizeAndProperties;
    var shapeGroupAction = (function (_super) {
        designer.extends(shapeGroupAction, _super);
        function shapeGroupAction(spread, options) {
            _super.call(this, spread, options);
        }
        shapeGroupAction.prototype.executeImp = function (context, options, isUndo) {
            var activeSheet = this.sheet();
            var selectedShapeArray = options.selectedShape;
            var type = options.type;
            if (type === 'group') {
                var groupShape = activeSheet.shapes.group(selectedShapeArray);
                groupShape.isSelected(true);
                if (options.groupShapeName) {
                    groupShape.name(options.groupShapeName);
                } else {
                    options.groupShapeName = groupShape.name();
                }
            }
            if (type === 'ungroup') {
                for (var i = 0; i < selectedShapeArray.length; i++) {
                    if (selectedShapeArray[i] instanceof GC.Spread.Sheets.Shapes.GroupShape) {
                        var childrenShapes = selectedShapeArray[i].all();
                        activeSheet.shapes.ungroup(selectedShapeArray[i]);
                        childrenShapes.forEach(function (shape) {
                            shape.isSelected(true);
                        });
                    }
                }
            }
            if (!options.ignoreEvent) {
                triggerShapeChanged(selectedShapeArray);
            }
        };
        return shapeGroupAction;
    })(DesignerShapeActionBase);
    Commands[CUT_SHAPES] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            context.commandManager().execute({ cmd: "cutShapes", sheetName: options.sheetName });
        }
    };
    Commands[COPY_SHAPES] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            context.commandManager().execute({ cmd: "copyShapes", sheetName: options.sheetName });
        }
    };
    Commands[PASTE_SHAPES] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            var cmd = new PasteAction(context, options);
            var pasteOptions = {
                value: 0 /* All */,
                spread: context
            };
            return cmd.execute(context, pasteOptions, isUndo);
        }
    };
    Commands[GROUP_SHAPES] = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var spread = designer.wrapper.spread;
            var sheet = spread.getActiveSheet();
            var allShapes = sheet.shapes.all();
            var selectedShapes = options.selectedShape;
            if (!selectedShapes) {
                selectedShapes = [];
                for (var i = 0; i < allShapes.length; i++) {
                    if (allShapes[i].isSelected()) {
                        selectedShapes.push(allShapes[i]);
                    }
                }
                options.selectedShape = selectedShapes;
            }
            options.type = 'group';
            options.sheetName = sheet.name();
            var cmd = new shapeGroupAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    Commands[UNGROUP_SHAPES] = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var spread = designer.wrapper.spread;
            var sheet = spread.getActiveSheet();
            var allShapes = sheet.shapes.all();
            var selectedShapes = [];
            for (var i = 0; i < allShapes.length; i++) {
                if (allShapes[i].isSelected()) {
                    selectedShapes.push(allShapes[i]);
                }
            }
            options.selectedShape = selectedShapes;
            options.type = 'ungroup';
            options.sheetName = sheet.name();
            var cmd = new shapeGroupAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    Commands[FORMAT_SHAPES] = {
        canUndo: false,
        execute: function (context, options, isUndo) {
            designer.ribbon.shapeDbClicked();
        }
    };
    var commands_shapeGroup = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new shapeGroupAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    function shapeGroup(spread, paramters) {
        runCommand(spread, "shapeGroup", commands_shapeGroup, {
            selectedShape: paramters.options.selectShape,
            type: paramters.options.type,
            sheetName: paramters.sheetName,
            ignoreEvent: paramters.options.ignoreEvent,
        });
    }
    spreadActions.shapeGroup = shapeGroup;
    var setShapeTextAction = (function (_super) {
        designer.extends(setShapeTextAction, _super);
        function setShapeTextAction(spread, options) {
            _super.call(this, spread, options);
        }
        function _setShapeText(selectedShape, textContent) {
            if (textContent !== undefined) {
                if (selectedShape && selectedShape instanceof GC.Spread.Sheets.Shapes.GroupShape) {
                    var children = selectedShape.all();
                    for (var j = 0; j < children.length; j++) {
                        _setShapeText(children[j], textContent);
                    }
                } else if (selectedShape.text) {
                    selectedShape.text(textContent);
                }
            }
        }
        setShapeTextAction.prototype.executeImp = function (context, options, isUndo) {
            var selectedShapeArray = options.selectedShape;
            var textContent = options.text;
            for (var i = 0; i < selectedShapeArray.length; i++) {
                _setShapeText(selectedShapeArray[i], textContent);
            }
        };
        return setShapeTextAction;
    })(DesignerShapeActionBase);
    var commands_setShapeText = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new setShapeTextAction(context, options);
            return cmd.execute(context, options, isUndo);
        }
    };
    function setShapeText(spread, paramters) {
        runCommand(spread, "setShapeText", commands_setShapeText, {
            selectedShape: paramters.options.selectShape,
            text: paramters.options.text,
            sheetName: paramters.sheetName,
        });
    }
    spreadActions.setShapeText = setShapeText;
    //#region base Dialog Command
    var baseDialogAction = (function (_super) {
        designer.extends(baseDialogAction, _super);

        function baseDialogAction(spread, options) {
            _super.call(this, spread, options);
        }

        baseDialogAction.prototype.executeImp = function (content, option, isUndo) {
            if (option.execute) {
                return option.execute.call(this, content, option, isUndo);
            }
        };
        return baseDialogAction;

    })(DesignerActionBase);

    var commands_baseDialogCommand = {
        canUndo: true,
        execute: function (context, options, isUndo) {
            var cmd = new baseDialogAction(context, options);
            cmd.execute(context, options, isUndo);
        }

    };

    function baseDialogCommand(spread, paramters) {
        runCommand(spread, "baseDialogCommand", commands_baseDialogCommand, {
            execute: paramters.options.execute,
            value: paramters.options.value,
            selections: paramters.selections,
            sheetName: paramters.sheetName
        });
    }

    spreadActions.baseDialogCommand = baseDialogCommand;


    spreadActions.dialogAction = {};
    var newNameDialoagApplySetting = function (context, options, isUndo) {
        var arg = options.value.arg, scope = options.value.scope, name = options.value.name,
            commentValue = options.value.commentValue, nameValue = options.value.nameValue,
            referToValue = options.value.referToValue, sheetIndex = options.value.sheetIndex,
            inWorkbook = options.value.inWorkbook, activeRowIndex = options.value.activeRowIndex,
            activeColumnIndex = options.value.activeColumnIndex;
        if (arg === "edit") {
            if (scope === designer.res.newNameDialog.scope.workbook) {
                designer.wrapper.spread.removeCustomName(name);
            } else {
                var index;
                for (var i = 0; i < designer.wrapper.spread.sheets.length; i++) {
                    if (designer.wrapper.spread.sheets[i].name() === scope) {
                        index = i;
                        break;
                    }
                }
                designer.wrapper.spread.sheets[index].removeCustomName(name);
            }
        }
        var commentString = commentValue.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, "&quot;").replace(/'/g, "&#039;");
        //Add new name.
        if (inWorkbook) {
            designer.wrapper.spread.addCustomName(nameValue, referToValue, activeRowIndex, activeColumnIndex, commentString);
        } else {
            designer.wrapper.spread.sheets[sheetIndex].addCustomName(nameValue, referToValue, activeRowIndex, activeColumnIndex, commentString);
        }

    };
    spreadActions.dialogAction.newNameDialoagApplySetting = newNameDialoagApplySetting;

    var insertFunctionDiaplogApplySetting = function (context, options, isUndo) {
        var txt = options.value.txt, activeRowIndex = options.value.activeRowIndex,
            activeColumnIndex = options.value.activeColumnIndex;
        var sheet = this.sheet();
        sheet.setFormula(activeRowIndex, activeColumnIndex, txt);
    };
    spreadActions.dialogAction.insertFunctionDiaplogApplySetting = insertFunctionDiaplogApplySetting;

    var headerCellsApplySetting = function (context, options, isUndo) {

        var rowSheet = options.value.rowSheet, colSheet = options.value.colSheet;
        var targetSheet = this.sheet();
        var i, j;


        var copyCells = function (sourceSheet, row, col, sourceArea, targetArea) {
            var style = sourceSheet.getStyle(row, col, sourceArea);

            targetSheet.setStyle(row, col, style, targetArea);

            var value = sourceSheet.getValue(row, col, sourceArea);
            var targetValue = targetSheet.getValue(row, col, targetArea);
            if (value !== targetValue) {
                targetSheet.setValue(row, col, value, targetArea);
            }
            var columnWidth = sourceSheet.getColumnWidth(col, sourceArea);
            if (columnWidth !== undefined && columnWidth >= 0) {
                targetSheet.setColumnWidth(col, columnWidth, targetArea);
            }
            var rowHeight = sourceSheet.getRowHeight(row, sourceArea);
            if (rowHeight !== undefined && rowHeight >= 0) {
                targetSheet.setRowHeight(row, rowHeight, targetArea);
            }
            var columnVisible = sourceSheet.getColumnVisible(col, sourceArea);
            targetSheet.setColumnVisible(col, columnVisible, targetArea);
            var rowVisible = sourceSheet.getRowVisible(row, sourceArea);
            targetSheet.setRowVisible(row, rowVisible, targetArea);
            var columnResizable = sourceSheet.getColumnResizable(col, sourceArea);
            targetSheet.setColumnResizable(col, columnResizable, targetArea);
            var rowResizable = sourceSheet.getRowResizable(row, sourceArea);
            targetSheet.setRowResizable(row, rowResizable, targetArea);
        };

        var copySheet = function (sourceSheet, sourceArea, targetArea) {
            //Load ribbon bar setting.
            //MergeInfo.
            var spans = targetSheet.getSpans(undefined, targetArea);
            for (i = 0; i < spans.length; i++) {
                targetSheet.removeSpan(spans[i].row, spans[i].col, targetArea);
            }

            spans = sourceSheet.getSpans(undefined, sourceArea);
            if (spans.length !== 0) {
                for (i = 0; i < spans.length; i++) {
                    targetSheet.addSpan(spans[i].row, spans[i].col, spans[i].rowCount, spans[i].colCount, targetArea);
                }
            }
        };

        var synColRowCount = function (rowSheet1, colSheet1) {
            var rowColumnCount1 = rowSheet1.getColumnCount(3 /* viewport */);
            var colColumnCount1 = colSheet1.getColumnCount(3 /* viewport */);
            var rowRowCount1 = rowSheet1.getRowCount(3 /* viewport */);
            var colRowCount1 = colSheet1.getRowCount(3 /* viewport */);
            targetSheet.setColumnCount(rowColumnCount1, 2 /* rowHeader */);
            targetSheet.setRowCount(rowRowCount1, 2 /* rowHeader */);
            targetSheet.setColumnCount(colColumnCount1, 1 /* colHeader */);
            targetSheet.setRowCount(colRowCount1, 1 /* colHeader */);
        };

        synColRowCount(rowSheet, colSheet);

        for (i = 0; i < rowSheet.getRowCount(); i++) {
            for (j = 0; j < rowSheet.getColumnCount(); j++) {
                copyCells(rowSheet, i, j, 3 /* viewport */, 2 /* rowHeader */);
            }
        }
        for (i = 0; i < colSheet.getRowCount(); i++) {
            for (j = 0; j < colSheet.getColumnCount(); j++) {
                copyCells(colSheet, i, j, 3 /* viewport */, 1 /* colHeader */);
            }
        }

        for (j = 0; j < rowSheet.getColumnCount(); j++) {
            copyCells(rowSheet, -1, j, 3 /* viewport */, 2 /* rowHeader */);
        }
        for (j = 0; j < colSheet.getColumnCount(); j++) {
            copyCells(colSheet, -1, j, 3 /* viewport */, 1 /* colHeader */);
        }

        for (i = 0; i < rowSheet.getRowCount(); i++) {
            copyCells(rowSheet, i, -1, 3 /* viewport */, 2 /* rowHeader */);
        }
        for (i = 0; i < colSheet.getRowCount(); i++) {
            copyCells(colSheet, i, -1, 3 /* viewport */, 1 /* colHeader */);
        }

        //Set all sheets.
        copyCells(rowSheet, -1, -1, 3 /* viewport */, 2 /* rowHeader */);
        copyCells(colSheet, -1, -1, 3 /* viewport */, 1 /* colHeader */);

        copySheet(rowSheet, 3 /* viewport */, 2 /* rowHeader */);
        copySheet(colSheet, 3 /* viewport */, 1 /* colHeader */);

    };
    spreadActions.dialogAction.headerCellsApplySetting = headerCellsApplySetting;

    var managerRulesApplySetting = function (context, options, isUndo) {
        var formats = options.value.formats, tempFormats = options.value.tempFormats;
        formats.clearRule();
        for (var i = 0; i < tempFormats.count(); i++) {
            var rule = tempFormats.getRule(i);
            if (rule.condition) {
                delete rule.condition;
            }

            // Fixed bug 152190 (Cells with conditional formatting applied always remain locked even on unlocking), delete rule' style.locked if present
            if (rule.style.locked !== undefined) {
                delete rule.style.locked;
            }
            formats.addRule(rule);
        }
    };
    spreadActions.dialogAction.managerRulesApplySetting = managerRulesApplySetting;

    var addAndSetStyleByName = function (context, options, isUndo) {
        var styleName = options.value.styleName;
        var spread = this.spread();
        var key = styleName.toLowerCase();
        if (!spread.getNamedStyle(styleName)) {
            if (designer.CellStyleDialog.buildInCellStyle.hasOwnProperty(key)) {
                this.spread().addNamedStyle(designer.CellStyleDialog.buildInCellStyle[key]);
            } else if (designer.CellStyleDialog.existedCustomCellStyle.hasOwnProperty(key)) {
                this.spread().addNamedStyle(designer.CellStyleDialog.existedCustomCellStyle[key]);
            }
        }
        this.execInSelections(this.sheet(), function (sheet, row, column) {
            var style;
            if (styleName === NAMED_STYLE_NORMAL) {
                style = new GC.Spread.Sheets.Style();
            } else {
                style = sheet.getActualStyle(row, column);
                var namedStyle = sheet.getNamedStyle(styleName) || spread.getNamedStyle(styleName);
                for (var item in namedStyle) {
                    if ((style[item] !== undefined) && style.hasOwnProperty(item) && STYLE_PROPERTY_DICT.hasOwnProperty(item)) {
                        style[item] = keyword_undefined;
                    }
                }
            }
            style.themeFont = undefined;
            style.parentName = styleName;
            sheet.setStyle(row, column, style);
        });
    };
    spreadActions.dialogAction.addAndSetStyleByName = addAndSetStyleByName;

    var formatDialogApplySetting = function (context, options, isUndo) {
        var styleInfo = options.value.styleInfo;
        var fontInfo = options.value.fontInfo;
        var borderInfo = options.value.borderInfo;
        var mergeInfo = options.value.mergeInfo;
        if (!styleInfo.watermark) {
            styleInfo.labelOptions = keyword_undefined;
        }
        // exclude font since it will be set later depends on detail setting
        styleInfo.font = keyword_undefined;
        if (!styleInfo.foreColor) {
            styleInfo.foreColor = keyword_undefined;
        }
        if (styleInfo.borderTop) {
            styleInfo.borderTop = keyword_undefined;
        }
        if (styleInfo.borderLeft) {
            styleInfo.borderLeft = keyword_undefined;
        }
        if (styleInfo.borderBottom) {
            styleInfo.borderBottom = keyword_undefined;
        }
        if (styleInfo.borderRight) {
            styleInfo.borderRight = keyword_undefined;
        }
        if (styleInfo.diagonalUp) {
            styleInfo.diagonalUp = keyword_undefined;
        }
        if (styleInfo.diagonalDown) {
            styleInfo.diagonalDown = keyword_undefined;
        }
        runCommand(context, "setStyle", commands_setStyle, {
            value: styleInfo,
            selections: options.selections,
            sheetName: options.sheetName
        });

        if (fontInfo.fontFamily !== undefined) {
            runCommand(context, "setFontFamily", commands_setFontFamily, {
                value: fontInfo.fontFamily,
                selections: options.selections,
                sheetName: options.sheetName
            });
        }
        if (fontInfo.fontSize !== undefined) {
            runCommand(context, "setFontSize", commands_setFontSize, {
                value: fontInfo.fontSize + 'pt',
                selections: options.selections,
                sheetName: options.sheetName
            });
        }
        if (fontInfo.fontStyle !== undefined) {
            runCommand(context, "setFontStyle", commands_setFontStyle, {
                value: fontInfo.fontStyle,
                selections: options.selections,
                sheetName: options.sheetName
            });
        }
        if (fontInfo.fontWeight !== undefined) {
            runCommand(context, "setFontWeight", commands_setFontWeight, {
                value: fontInfo.fontWeight,
                selections: options.selections,
                sheetName: options.sheetName
            });
        }
        if (borderInfo !== undefined) {
            runCommand(context, "setAllBorder", commands_setAllBorder, {
                orignalBorder: borderInfo.orignalBorder,
                borderType: borderInfo.borderType,
                selections: options.selections,
                sheetName: options.sheetName
            });
        }
        if (mergeInfo.merged && mergeInfo.merged !== designer.BaseMetaObject.indeterminateValue) {
            var ranges = options.selections;

            for (var i = 0; i < ranges.length; i++) {
                for (var j = i + 1; j < ranges.length; j++) {
                    if (ranges[i].intersect(ranges[j].row, ranges[j].col, ranges[j].rowCount, ranges[j].colCount)) {
                        return;
                    }
                }
            }
            runCommand(context, "mergeCells", commands_mergeCells, {
                selections: options.selections,
                sheetName: options.sheetName
            });
        }
    };
    spreadActions.dialogAction.formatDialogApplySetting = formatDialogApplySetting;

    var getAutoSlicerName = function (spread, columnName) {
        var autoID = 1;
        var newName = columnName;
        for (var i = 0; i < spread.sheets.length; i++) {
            var sheet = spread.sheets[i];
            while (sheet.slicers.get(newName)) {
                newName = columnName + '_' + autoID;
                autoID++;
            }
        }
        return newName;
    };
    var insertSlicerForDialog = function (context, options, isUndo) {
        var tableName = options.value.tableName, columnsChecked = options.value.columnsChecked;
        var sheet = this.sheet();
        var table = sheet.tables.findByName(tableName);
        var posX = 100, posY = 200;
        var slicer;
        for (var i = 0; i < columnsChecked.length; i++) {
            var columnName = table.getColumnName(columnsChecked[i]);
            var slicerName = getAutoSlicerName(context, columnName);
            slicer = sheet.slicers.add(slicerName, table.name(), columnName);
            slicer.position(new GC.Spread.Sheets.Point(posX, posY));
            posX = posX + 30;
            posY = posY + 30;
        }
        if (slicer) {
            slicer.isSelected(true);
        }
    };
    spreadActions.dialogAction.insertSlicerForDialog = insertSlicerForDialog;

    var SlicerSettingForDialog = function (context, options, isUndo) {
        var slicerSettings = options.value.slicerSettings;
        var selectedSlicers = options.value.selectedSlicers;
        var length = selectedSlicers.length;
        if (!selectedSlicers || length === 0) {
            return;
        }

        for (var i = 0; i < length; i++) {
            var slicer = selectedSlicers[i];
            var slicerName = slicerSettings[0];
            if (length === 1) {
                slicer.name(slicerName);
            }
            slicer.showHeader(slicerSettings[1]);
            slicer.captionName(slicerSettings[2]);
            if (slicerSettings[3] === "ascending") {
                slicer.sortState(1 /* Ascending */);
            } else {
                slicer.sortState(2 /* Descending */);
            }
            slicer.showNoDataItems(!slicerSettings[4]);
            slicer.visuallyNoDataItems(slicerSettings[5]);
            slicer.showNoDataItemsInLast(slicerSettings[6]);
        }

    };
    spreadActions.dialogAction.SlicerSettingForDialog = SlicerSettingForDialog;

    var FormatSlicerForDialog = function (context, options, isUndo) {
        var selectedSlicers = options.value.selectedSlicers, formatOption = options.value.formatOption;
        var horizontal = formatOption.horizontal;
        var vertical = formatOption.vertical;
        var columnCount = formatOption.columnCount;
        var itemHeight = formatOption.itemHeight;
        var slicerHeight = formatOption.slicerHeight;
        var slicerWidth = formatOption.slicerWidth;

        var disableResizingAndMoving = formatOption.disableResizingAndMoving;
        var locked = formatOption.locked;
        var noMoveSize = formatOption.noMoveSize;
        var moveNoSize = formatOption.moveNoSize;
        var moveSize = formatOption.moveSize;

        var slicer;

        for (var item in selectedSlicers) { /* NOSONAR: ForIn */
            slicer = selectedSlicers[item];
            if (!item) {
                continue;
            }

            if ($.isNumeric(formatOption.horizontal) && $.isNumeric(formatOption.vertical)) {
                var posX, posY, newPosition;
                posX = parseInt(horizontal);
                posY = parseInt(vertical);
                newPosition = new GC.Spread.Sheets.Point(posX, posY);
                slicer.position(newPosition);
            }
            if ($.isNumeric(columnCount)) {
                columnCount = parseInt(columnCount);
                if (columnCount > 0) {
                    slicer.columnCount(columnCount);
                }
            }
            if ($.isNumeric(itemHeight)) {
                itemHeight = designer.util.formatNumber(itemHeight);
                slicer.itemHeight(itemHeight);
            }
            if ($.isNumeric(slicerHeight)) {
                slicerHeight = designer.util.formatNumber(slicerHeight);
                slicer.height(slicerHeight);
            }
            if ($.isNumeric(slicerWidth)) {
                slicerWidth = designer.util.formatNumber(slicerWidth);
                slicer.width(slicerWidth);
            }
            if (disableResizingAndMoving) {
                slicer.disableResizingAndMoving(true);
            } else {
                slicer.disableResizingAndMoving(false);
            }
            if (locked) {
                slicer.isLocked(true);
            } else {
                slicer.isLocked(false);
            }
            if (noMoveSize) {
                slicer.dynamicMove(false);
                slicer.dynamicSize(false);
            }
            if (moveNoSize) {
                slicer.dynamicMove(true);
                slicer.dynamicSize(false);
            }
            if (moveSize) {
                slicer.dynamicMove(true);
                slicer.dynamicSize(true);
            }
        }
    };
    spreadActions.dialogAction.FormatSlicerForDialog = FormatSlicerForDialog;
    //#endregion
    designer.spreadActions = spreadActions;
})();
