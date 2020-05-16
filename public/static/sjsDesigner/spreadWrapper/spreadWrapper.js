(function () {
    'use strict';

    var Sheets = GC.Spread.Sheets;
    var designer = GC.Spread.Sheets.Designer;

    var wrapper = {};
    var element;
    // var STEP = 5;
    wrapper.spreadElement;

    function getThemeColors() {
        var themeColor = wrapper.spread.getActiveSheet().currentTheme().colors();
        return [
            {
                name: 'Background 1',
                baseColor: themeColor.getColor('Background 1')
            },
            {
                name: 'Text 1',
                baseColor: themeColor.getColor('Text 1')
            },
            {
                name: 'Background 2',
                baseColor: themeColor.getColor('Background 2')
            },
            {
                name: 'Text 2',
                baseColor: themeColor.getColor('Text 2')
            },
            {
                name: 'Accent 1',
                baseColor: themeColor.getColor('Accent 1')
            },
            {
                name: 'Accent 2',
                baseColor: themeColor.getColor('Accent 2')
            },
            {
                name: 'Accent 3',
                baseColor: themeColor.getColor('Accent 3')
            },
            {
                name: 'Accent 4',
                baseColor: themeColor.getColor('Accent 4')
            },
            {
                name: 'Accent 5',
                baseColor: themeColor.getColor('Accent 5')
            },
            {
                name: 'Accent 6',
                baseColor: themeColor.getColor('Accent 6')
            }
        ];
    }

    wrapper.getThemeColors = getThemeColors;

    wrapper.shouldModifiedHandlerExecute = true;

    function reset(init) {

        if (typeof init === "undefined") {
            init = false;
        }
        if (!init) {
            wrapper.spread.destroy();
            element.empty();
            wrapper.spread = null;
        }
        try {
            wrapper.spread = new Sheets.Workbook(element[0]);
            wrapper.spread.setSheetCount(2);
            wrapper.spreadElement = element;
            designer.formulaBar.initFormulaBar(init);
            designer.contextMenu.initContextMenu();
            !init && designer.statusBar.bindContext();
            // 'z_' is for a workaround. make this listener execute after command has been pushed into undo stack
            wrapper.spread.commandManager().addListener('z_' + 'commandExecuted.designer', designer.ribbon.updateUndoRedo);
        } catch (ex) {
            wrapper.spread.notWorking = true;
            return;
        }
        wrapper.shouldModifiedHandlerExecute = true;
        var fileModifiedCallback = function () {
            designer.actions.isFileModified = true;
            if (wrapper.shouldModifiedHandlerExecute) {
                designer.actions.updateWindowTitle();
                wrapper.shouldModifiedHandlerExecute = false;
            }
        };
        var updateTableFooterStyle = function (e, f) {
            var activeSheet = wrapper.spread.getActiveSheet();
            var activeTable = activeSheet.tables.find(f.row, f.col);
            if (activeTable && activeTable.showFooter() && activeTable.useFooterDropDownList()) {
                var len = activeTable.endColumn() - activeTable.startColumn() + 1;
                for (var i = 0; i < len; i++) {
                    var arr = activeTable.footerRowDropDowns(i)[0].option.items;
                    if (arr.length < 10) {
                        arr.push({
                            text: designer.res.ribbon.tableDesign.moreFunctions,
                            value: "more-functions"
                        });
                        activeTable.footerRowDropDowns(i, {
                            listOption: {
                                items: arr
                            },
                            submitCommand: "designer.more-functions"
                        });
                    }
                }
            }
        }
        wrapper.spread.bind(Sheets.Events.CellClick, updateTableFooterStyle);
        wrapper.spread.bind(Sheets.Events.CellChanged, fileModifiedCallback);
        wrapper.spread.bind(Sheets.Events.RowChanged, fileModifiedCallback);
        wrapper.spread.bind(Sheets.Events.ColumnChanged, fileModifiedCallback);
        wrapper.spread.bind(Sheets.Events.ActiveSheetChanged, fileModifiedCallback);
        wrapper.spread.bind(Sheets.Events.InvalidOperation, function (e, args) {
            if (args.invalidType === 5 /* ChangeSheetName */) {
                designer.MessageBox.show(args.message, designer.res.title, 3 /* error */);
            }
            if (args.invalidType === 1 /* copyPaste */) {
                designer.MessageBox.show(args.message, designer.res.title, 3 /* error */);
            }
            if (args.invalidType === 6 /* tableErr */) {
                designer.MessageBox.show(args.message, designer.res.title, 3 /* error */);
            }
        });

        wrapper.spread.bind(Sheets.Events.RangeChanged, function (event, args) {
            var sheet = wrapper.spread.getActiveSheet();
            var row = sheet.getActiveRowIndex();
            var col = sheet.getActiveColumnIndex();
            if (args.action === 0 /* DragDrop */) {
                designer.ribbon.updateRibbonAll();
                // $(".ribbon-bar").gcuiribbon("setTabPageVisible", "tableTab", sheet.tables.find(row, col));
            }
            if (args.action === 2 /* Clear */) {
                hideRibbonDesignTab();

                if (sheet.tables.find(row, col)) {
                    // If sparkline is in table, table tab should be selected when sparkline is deleted.
                    $(".ribbon-bar").gcuiribbon("setTabPageVisible", "tableTab", true);
                    $(".ribbon-bar").gcuitabs("select", "tableTab");
                    return;
                }

                // When table is deleted, insert table button should be enabled.
                $(".ribbon-bar").gcuiribbon("setButtonDisabled", "insert-table", false);

                // Change to home tab when table or sparkline is deleted.
                $(".ribbon-bar").gcuiribbon("setTabPageVisible", "homeTab", true);
                $(".ribbon-bar").gcuitabs("select", "homeTab");
            }
        });
        wrapper.spread.bind(Sheets.Events.FloatingObjectRemoved, function (event, args) {
            if (args.floatingObject instanceof Sheets.Slicers.Slicer) {
                hideRibbonDesignTab();
                var sheet = wrapper.spread.getActiveSheet();
                var row = sheet.getActiveRowIndex();
                var col = sheet.getActiveColumnIndex();

                // Change ribbon tab when slicer is deleted.
                if (sheet.tables.find(row, col)) {
                    $(".ribbon-bar").gcuiribbon("setTabPageVisible", "tableTab", true);
                    $(".ribbon-bar").gcuitabs("select", "tableTab");
                } else {
                    $(".ribbon-bar").gcuiribbon("setTabPageVisible", "homeTab", true);
                    $(".ribbon-bar").gcuitabs("select", "homeTab");
                }
            }
        });
        wrapper.spread.bind(Sheets.Events.TableRowsChanged, function (event, args) {
            if (args.propertyName === 'tableInsertRows') {
                var sheet = args.sheet, table = args.table, tableRow = args.row, count = args.count, isAfter = args.isAfter,
                    tableStartCol = table.startColumn(), tableEndCol = table.endColumn();
                var row = tableRow + table.dataRange().row, findRow = isAfter ? row : row - 1, sparklines = [], col, sparkline;
                for (col = tableStartCol; col <= tableEndCol; col++) {
                    sparkline = sheet.getSparkline(findRow, col);
                    if (sparkline) {
                        sparklines.push(sparkline);
                    }
                }
                var length = sparklines.length, oldSparkline, dataRange, dataOrientation, sparklineType, sparklineSetting, dateAxisData, dateAxisOrientation;
                for (var i = 0; i < length; i++) {
                    oldSparkline = sparklines[i];
                    dataRange = oldSparkline.data();
                    dataOrientation = oldSparkline.dataOrientation();
                    sparklineType = oldSparkline.sparklineType();
                    sparklineSetting = oldSparkline.setting();
                    dateAxisData = oldSparkline.dateAxisData();
                    dateAxisOrientation = oldSparkline.dateAxisOrientation();
                    for (var j = 1; j <= count; j++) {
                        var column = oldSparkline.column, newRow = findRow + j;
                        var newDataRange = new Sheets.Range(newRow, dataRange.col, dataRange.rowCount, dataRange.colCount);
                        sheet.setSparkline(newRow, column, newDataRange, dataOrientation, sparklineType, sparklineSetting, dateAxisData, dateAxisOrientation);
                    }
                }
            }
        });
        wrapper.spread.bind(Sheets.Events.TableColumnsChanged, function (event, args) {
            if (args.propertyName === 'tableInsertColumns') {
                var sheet = args.sheet, table = args.table, tableCol = args.col, count = args.count, isAfter = args.isAfter,
                    tableStartRow = table.startRow(), tableEndRow = table.endRow();
                var col = tableCol + table.dataRange().col, findCol = isAfter ? col : col - 1, sparklines = [], row, sparkline;
                for (row = tableStartRow; row <= tableEndRow; row++) {
                    sparkline = sheet.getSparkline(row, findCol);
                    if (sparkline) {
                        sparklines.push(sparkline);
                    }
                }
                var length = sparklines.length, oldSparkline, dataRange, dataOrientation, sparklineType, sparklineSetting, dateAxisData, dateAxisOrientation;
                for (var i = 0; i < length; i++) {
                    oldSparkline = sparklines[i];
                    dataRange = oldSparkline.data();
                    dataOrientation = oldSparkline.dataOrientation();
                    sparklineType = oldSparkline.sparklineType();
                    sparklineSetting = oldSparkline.setting();
                    dateAxisData = oldSparkline.dateAxisData();
                    dateAxisOrientation = oldSparkline.dateAxisOrientation();
                    for (var j = 1; j <= count; j++) {
                        var oldRow = oldSparkline.row, newCol = findCol + j;
                        var newDataRange = new Sheets.Range(dataRange.row, newCol, dataRange.rowCount, dataRange.colCount);
                        sheet.setSparkline(oldRow, newCol, newDataRange, dataOrientation, sparklineType, sparklineSetting, dateAxisData, dateAxisOrientation);
                    }
                }
            }
        });

        // init table custom style and slicer custom style
        initCustomStyle();

        designer.ribbon.attachEvent(!init);
        setFocusToSpread();
        designer.ribbon.resetSpreadNamedStyle();
    }

    wrapper.reset = reset;

    function hideRibbonDesignTab() {
        // File tab will show in electron designer, so the first hidden tab number is 6.
        var LAST_SHOW_TAB_NUMBER = 6;
        $(".ribbon-bar>ul").find("li:gt(" + LAST_SHOW_TAB_NUMBER + ")").css("display", "none");
        $(".ribbon-bar>div:gt(" + LAST_SHOW_TAB_NUMBER + ")").attr("aria-hidden", true);
    }

    function initCustomStyle() {
        $(".custom-format-table").css("display", "none");
        $(".custom-preview").find(".table-format-preview").css("display", "none");
        designer.FormatTableDialog.customTableStyle = {};
        designer.FormatTableDialog.currentId = 1;

        $(".custom-format-slicer").css("display", "none");
        $(".slicer-custom-preview").find(".slicer-format-preview").css("display", "none");
        designer.SlicerStyleDialog.customSlicerStyle = {};
        designer.SlicerStyleDialog.currentId = 1;
    }

    function setFocusToSpread() {
        if (wrapper.spread.getActiveSheet()) {
            wrapper.spread.focus(true);
        }
    }

    wrapper.setFocusToSpread = setFocusToSpread;
    designer.loader.ready(function () {
        element = $(".spreadWrapper .ss");
        reset(true);
    });

    // dexter
    wrapper.resetElement = function(){
        element = $(".spreadWrapper .ss");
    }
    
    designer.wrapper = wrapper;
})();
