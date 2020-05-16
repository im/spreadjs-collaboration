(function () {
    'use strict';

    var designer = GC.Spread.Sheets.Designer;

    var actions = {};
    actions.currentFilePath = "";

    function getActionFuncName(action) {
        var s = action.split('-');
        for (var i = 1; i < s.length; i++) {
            var p = s[i];
            s[i] = p[0].toUpperCase() + p.slice(1);
        }
        return s.join('');
    }

    function doAction(actionName, spread, options, ignoreSetFocus) {
        //Suspend to improve performance
        spread.suspendPaint();
        try {
            designer.util.assert(typeof actionName === 'string' && actionName !== 'doAction', 'actionName invalid');

            actionName = getActionFuncName(actionName);

            var action = this[actionName];
            var needAdjustOptions = false;
            if (action === undefined) {
                action = designer.spreadActions[actionName];
                needAdjustOptions = true;
            }

            designer.util.assert(action !== undefined, 'cannot found the action "' + actionName + '".');
            var sheet = spread.getActiveSheet();
            var args;
            if (needAdjustOptions) {
                var paramters = {
                    sheet: sheet,
                    selections: sheet.getSelections(),
                    options: options,
                    sheetName: sheet.name()
                };
                args = [spread, paramters];
            } else {
                args = [spread, options];
            }
            action.apply(null, args);
        } catch (e) {
            spread.resumePaint();
            throw e;
        }
        spread.resumePaint();

        if (!ignoreSetFocus) {
            //Let Spread got focus
            spread.focus(true);
        }
    }

    actions.doAction = doAction;

    function getFileExtension(fileName) {
        return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    }

    function save(spread, callback) {
        if (actions.currentFilePath) {
            saveCore(spread, actions.currentFilePath, null, false, callback);
        } else {
            saveAs(spread, null, null, callback);
        }
    }

    actions.save = save;

    function saveAs(spread, dialogArgs, exportOptions, callback) {
        var dialogInfo = dialogArgs;
        if (!dialogInfo) {
            dialogInfo = {
                title: designer.res.saveFileDialogTitle,
                fileExtension: '.ssjson',
                nameFilters: [
                    designer.res.spreadFileFilter,
                    designer.res.ssJSONToJSFilter,
                    designer.res.excelFileFilter
                ]
            };
        }

        var jsonOptions = (exportOptions === null || exportOptions === undefined) ? null : JSON.stringify(exportOptions);

        var saveCallback = function (result) {
            if (result.status === 'cancelled') {
                return;
            }
            saveCore(spread, result.fileName, jsonOptions, false, callback);
        };
        app.showSaveDialog(dialogInfo, saveCallback);
    }

    actions.saveAs = saveAs;
    function saveCore(spread, fileName, options, isExporting, callback) {
        var ext = getFileExtension(fileName);
        switch (ext) {
            case 'ssjson':
            case 'json':
                saveJson(spread, fileName, options, isExporting, callback, false);
                break;
            case 'js':
                saveJson(spread, fileName, options, isExporting, callback, true);
                break;
            case 'csv':
            case 'pdf':
                saveOtherFormat(spread, fileName, options, isExporting, callback);
                break;
            case 'xlsx':
                saveOtherFormat(spread, fileName, options, isExporting, callback);
                break;
        }
    }

    function spreadToJSON(spread, options) {
        if (!options) {
            options = {};
        }
        options.includeBindingSource = true;
        return spread.toJSON(options);
    }

    function saveJson(spread, fileName, options, isExporting, callback, isJSFile) {
        addBindingpathDirtyData(spread);
        var toJSONObj;
        if (options === null || options === undefined || options.sheetIndex === 0) {
            toJSONObj = spreadToJSON(spread);
        } else {
            toJSONObj = spread.sheets[options.sheetIndex - 1].toJSON();
        }
        if (spread["designerBindingPathSchema"]) {
            toJSONObj["designerBindingPathSchema"] = spread["designerBindingPathSchema"];
        }
        _saveFile(fileName, JSON.stringify(toJSONObj), { saveAsJS: isJSFile }, isExporting, callback);
    }
    function _saveFile(fileName, data, options, isExporting, callback) {
        app.save(fileName, data, function (result) {
            if (result.status === 'failed') {
                designer.MessageBox.show(result.message, designer.res.title, 3 /* error */);
            } else {
                if (!isExporting) {
                    actions.currentFilePath = fileName;
                    actions.isFileModified = false;
                    updateWindowTitle();
                    designer.fileMenu.updateRecentList(fileName);
                }
                designer.fileMenu.closeFileScreen();
            }
            if (callback) {
                callback.call(null);
            }
        }, options);
    }

    function addBindingpathDirtyData(spread) {
        //just for designer binding path view tree.
        var bindingpathTree = $.fn.zTree.getZTreeObj("ztree-container");
        var rootNode = null, parent;
        if (bindingpathTree) {
            parent = [];
            rootNode = bindingpathTree.getNodes()[0];
            designer.ribbon.treeNodeToArray(rootNode.children, parent);
            var result = designer.util.saveJSONSchema(parent);
            if (!$.isEmptyObject(result)) {
                spread["designerBindingPathSchema"] = result;
            }
        }
    }

    function saveOtherFormat(spread, fileName, options, isExporting, callback) {
        $(".loading-placeholder").removeClass('hidden');
        var ext = getFileExtension(fileName);
        var data;
        if (options) {
            switch (ext) {
                case 'xlsx':
                    data = {
                        spread: spreadToJSON(spread, options.excelSaveFlags),
                        exportFileType: ext
                    };
                    break;
                case 'csv':
                    var spreadData;
                    try {
                        spreadData = spread.sheets[options.sheetIndex].getCsv(options.row, options.column, options.rowCount, options.columnCount, options.rowDelimiter, options.columnDelimiter);
                    } catch (e) {
                        designer.MessageBox.show(e.message, designer.res.title, 2 /* warning */, 0 /* ok */);
                        $(".loading-placeholder").addClass('hidden');
                        return;
                    }
                    data = {
                        spread: spreadData,
                        exportFileType: ext
                    };
                    break;
                case 'pdf':
                    data = {
                        spread: spread,
                        exportFileType: ext
                    };
                    break;
            }
        } else {
            data = {
                spread: spreadToJSON(spread),
                exportFileType: ext
            };
        }

        _saveFile(fileName, data, options, isExporting, function () {
            callback && callback.call(null);
            $(".loading-placeholder").addClass('hidden');
        });
    }

    function _export(spread, dialogArgs, exportOptions) {
        var dialogInfo = dialogArgs;
        if (!dialogInfo) {
            dialogInfo = {
                title: designer.res.exportFileDialogTitle,
                nameFilters: [
                    designer.res.spreadFileFilter,
                    designer.res.ssJSONToJSFilter,
                    designer.res.excelFileFilter,
                    designer.res.csvFileFilter,
                    designer.res.allFileFilter
                ]
            };
        }

        var callback = function (result) {
            if (result.status === 'cancelled') {
                return;
            }
            saveCore(spread, result.fileName, exportOptions, true);
        };
        app.showSaveDialog(dialogInfo, callback);
    }

    function exportJson(spread, options) {
        var dialogArgs = {
            title: designer.res.exportFileDialogTitle,
            fileExtension: '.ssjson',
            nameFilters: [
                designer.res.spreadFileFilter
            ]
        };
        _export(spread, dialogArgs, options);
    }

    actions.exportJson = exportJson;
    function exportJS(spread, options) {
        var dialogArgs = {
            title: designer.res.exportFileDialogTitle,
            fileExtension: '.js',
            nameFilters: [
                designer.res.ssJSONToJSFilter
            ]
        };
        _export(spread, dialogArgs, options);
    }

    actions.exportJS = exportJS;
    function exportExcel(spread, options) {
        var dialogArgs = {
            title: designer.res.exportFileDialogTitle,
            fileExtension: '.xlsx',
            nameFilters: [
                designer.res.excelFileFilter
            ]
        };
        _export(spread, dialogArgs, options);
    }

    actions.exportExcel = exportExcel;
    function exportCsv(spread, options) {
        var dialogArgs = {
            title: designer.res.exportFileDialogTitle,
            fileExtension: '.csv',
            nameFilters: [
                designer.res.csvFileFilter
            ]
        };
        _export(spread, dialogArgs, options);
    }

    actions.exportCsv = exportCsv;
    function exportPdf(spread, options) {
        var dialogArgs = {
            title: designer.res.exportFileDialogTitle,
            nameFilters: [
                designer.res.pdfFileFilter
            ]
        };
        _export(spread, dialogArgs, options);
    }

    actions.exportPdf = exportPdf;

    function open(spread, dialogArgs) {
        var dialogInfo = dialogArgs;
        if (!dialogInfo) {
            dialogInfo = {
                title: designer.res.openFileDialogTitle,
                nameFilters: [
                    designer.res.allSpreadFileFilter,
                    designer.res.spreadFileFilter,
                    designer.res.excelFileFilter,
                    designer.res.csvFileFilter
                ]
            };
        }
        dialogInfo.action = "open";
        dialogInfo.filters = ".ssjson, .xlsx, .csv";

        var callback = function (result) {
            if (result.status === 'cancelled' || !result.file) {
                return;
            }
            var fileName = result.file.name;
            var ext = app.getExtension(fileName);
            switch (ext.toLowerCase()) {
                case 'ssjson':
                    openJson(spread, fileName, result);
                    break;
                case 'xlsx':
                case 'csv':
                    openOtherFormat(spread, fileName, ext, result);
                    break;
                default:
                    designer.MessageBox.show(designer.res.openFileFormatError, designer.res.title, 3 /* error */);
                    return;
            }
        };
        app.showOpenDialog(dialogInfo, callback);
    }

    actions.open = open;
    function _import(spread, dialogArgs, importOptions) {
        var dialogInfo = dialogArgs;
        if (!dialogInfo) {
            dialogInfo = {
                title: designer.res.importFileDialogTitle,
                nameFilters: [
                    designer.res.spreadFileFilter,
                    designer.res.excelFileFilter,
                    //designer.res.excelFileFilter2,
                    designer.res.csvFileFilter,
                    designer.res.allFileFilter
                ]
            };
        }
        dialogInfo.action = "import";
        var callback = function (result) {
            if (result.status === 'cancelled') {
                return;
            }
            var fileName = result.file.name;
            var ext = app.getExtension(fileName);
            switch (ext.toLowerCase()) {
                case 'ssjson':
                    openJson(spread, fileName, result, true);
                    break;
                case 'xlsx':
                case 'csv':
                    openOtherFormat(spread, fileName, ext, result, importOptions, true);
                    break;
            }
        };
        app.showOpenDialog(dialogInfo, callback, importOptions);
    }

    actions._import = _import;

    function showUnsavedWarning(callback) {
        designer.MessageBox.show(designer.res.closingNotification, designer.res.title, 2 /* warning */, 2 /* yesNoCancel */, callback);
    }

    actions.showUnsavedWarning = showUnsavedWarning;

    function openTemplate(spread, templateName) {
        if (templateName === "Blank") {
            actions.reset();
            designer.fileMenu.closeFileScreen();
            return;
        }

        var openCore = function (template) {
            $.ajax({
                url: "../resources/templates/" + template + ".ssjson",
                //async: false,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    try {
                        designer.wrapper.reset();
                        designer.wrapper.spread.fromJSON(data);
                        actions.currentFilePath = "";
                        actions.isFileModified = false;
                        updateWindowTitle();
                        designer.ribbon.updateRibbonBarStyle();
                        designer.wrapper.spreadElement.trigger("FileOpened");
                        designer.fileMenu.closeFileScreen();
                    } catch (ex) {
                        designer.fileMenu.closeFileScreen();
                    }
                },
                error: function () {
                    return designer.MessageBox.show(designer.res.requestTempalteFail, designer.res.title, 3 /* error */);
                }
            });
        };
        if (actions.isFileModified) {
            showUnsavedWarning(function (evt, result) {
                switch (result) {
                    case 2 /* yes */
                        :
                        save(spread, function () {
                            openCore(templateName);
                        });
                        break;
                    case 3 /* no */
                        :
                        openCore(templateName);
                        break;
                    case 4 /* cancel */
                        :
                        return;
                }
            });
        } else {
            openCore(templateName);
        }
    }

    actions.openTemplate = openTemplate;

    //throws: "no sheet"
    function checkOpenFileFormat(spread) {
        if (!spread.getActiveSheet()) {
            if (spread.getSheetCount() > 0) {
                spread.setActiveSheetIndex(0);
            } else {
                throw "no sheet";
            }
        }
        for (var i = 0; i < spread.getSheetCount(); i++) {
            var columnIndex = spread.getSheet(i).getActiveColumnIndex();
            var rowIndex = spread.getSheet(i).getActiveRowIndex();
            if (columnIndex !== undefined && rowIndex !== undefined) {
                spread.getSheet(i).setActiveCell(rowIndex, columnIndex);
            } else {
                spread.getSheet(i).setActiveCell(0, 0);
            }
        }
    }

    function _setTableDefaultDropdownList(spread) {
        var sheetCount = spread.getSheetCount();
        for (var i = 0; i < sheetCount; i++) {
            var sheet = spread.getSheet(i);
            var tables = sheet.tables.all();
            for (var j = 0; j < tables.length; j++) {
                var table = tables[j];
                if (table.showFooter()) {
                    table.useFooterDropDownList(true);
                    var len = table.endColumn() - table.startColumn() + 1;
                    for (var k = 0; k < len; k++) {
                        var arr = table.footerRowDropDowns(k)[0].option.items;
                        if (arr.length < 10) {
                            arr.push({
                                text: designer.res.ribbon.tableDesign.moreFunctions,
                                value: "more-functions"
                            });
                            table.footerRowDropDowns(k, {
                                listOption: {
                                    items: arr
                                },
                                submitCommand: "designer.more-functions"
                            });
                        }
                    }
                }
            }
        }
    }
    function openJson(spread, fileName, operationResult, isImporting) {
        var openCore = function (workbook, result) {
            if (result.status === 'failed') {
                designer.MessageBox.show(result.message, designer.res.title, 3 /* error */);
            } else {
                try {
                    var jsonData = result.data;
                    // check and ignore the leading BOM if present to avoid parse fail
                    var firstChar = jsonData[0],
                        withBOM = firstChar === '\uFEFF' || firstChar === '\FFFE';
                    var data = JSON.parse(withBOM ? jsonData.substr(1) : jsonData);

                    if (!isImporting) {
                        designer.wrapper.reset();
                        designer.wrapper.spread.fromJSON(data);
                        if (data["designerBindingPathSchema"]) {
                            designer.wrapper.spread["designerBindingPathSchema"] = data["designerBindingPathSchema"];
                        }
                        checkOpenFileFormat(designer.wrapper.spread);
                        actions.currentFilePath = result.fileName;
                        actions.isFileModified = false;
                    } else {
                        workbook.fromJSON(data);
                        if (data["designerBindingPathSchema"]) {
                            designer.wrapper.spread["designerBindingPathSchema"] = data["designerBindingPathSchema"];
                        }
                        checkOpenFileFormat(workbook);
                        actions.isFileModified = true;
                    }
                    designer.fileMenu.closeFileScreen();
                    updateWindowTitle();
                    designer.ribbon.updateRibbonBarStyle();
                    designer.wrapper.spreadElement.trigger("FileOpened");
                    _setTableDefaultDropdownList(designer.wrapper.spread);
                } catch (ex) {
                    if (ex === "no sheet" || ex.message.indexOf("fromJSON") !== -1) {
                        designer.wrapper.reset();
                        designer.MessageBox.show(designer.res.openFileFormatError, designer.res.title, 3 /* error */);
                    }
                }
            }
        };

        if (actions.isFileModified) {
            showUnsavedWarning(function (evt, result) {
                switch (result) {
                    case 2 /* yes */
                        :
                        save(spread, function () {
                            openCore(spread, operationResult);
                        });
                        break;
                    case 3 /* no */
                        :
                        openCore(spread, operationResult);
                        break;
                    case 4 /* cancel */
                        :
                        return;
                }
            });
        } else {
            openCore(spread, operationResult);
        }
    }

    actions.openJson = openJson;
    var passwordDialog;

    function openOtherFormat(spread, fileName, extension, operationResult, importOptions, isImporting) {
        var openCore = function (workbook, file) {
            function importCsvData(data) {
                //import csv file
                var sheet = designer.wrapper.spread.getActiveSheet();
                sheet.setCsv(0, 0, data, importOptions.rowDelimiter || "\r\n", importOptions.columnDelimiter || ",");
                designer.fileMenu.closeFileScreen();
                updateWindowTitle();
                designer.ribbon.updateRibbonBarStyle();
            }

            function processLoadedExcel(result) {
                if (result.status === 'success') {
                    var data = result.data;

                    try {
                        if (typeof data === "string") {
                            data = JSON.parse(data);
                        }
                    } catch (e) {
                        designer.fileMenu.closeFileScreen();
                        designer.MessageBox.show("Parse file data error.", designer.res.title, 3 /* error */);
                        $(".loading-placeholder").addClass('hidden');
                        return;
                    }
                    try {
                        if (!isImporting) {
                            designer.wrapper.reset();
                            designer.wrapper.spread.fromJSON(data);
                            checkOpenFileFormat(designer.wrapper.spread);
                            actions.currentFilePath = file;
                            actions.isFileModified = false;
                        } else {
                            workbook.fromJSON(data, importOptions.excelOpenFlags);
                            checkOpenFileFormat(workbook);
                            actions.isFileModified = true;
                        }
                        designer.fileMenu.closeFileScreen();
                        updateWindowTitle();
                        designer.ribbon.updateRibbonBarStyle();
                        designer.wrapper.spreadElement.trigger("FileOpened");
                        _setTableDefaultDropdownList(designer.wrapper.spread);
                    } catch (ex) {
                        if (ex === "no sheet") {
                            designer.wrapper.reset();
                            designer.MessageBox.show(designer.res.openFileFormatError, designer.res.title, 3 /* error */);
                        }
                    }
                } else {
                    if (result.errorData) {
                        if (isImporting) {
                            designer.MessageBox.show(result.errorData.errorMessage, designer.res.title, 3 /* error */);
                        } else {
                            if (result.errorData.errorCode === 0 || result.errorData.errorCode === 1) {
                                designer.MessageBox.show(result.errorData.errorMessage, designer.res.title, 3 /* error */);
                            } else {
                                if (passwordDialog === undefined) {
                                    passwordDialog = new designer.PasswordDialog();
                                }
                                passwordDialog.open(workbook, file, importOptions, isImporting, result.errorData.errorMessage);
                            }
                        }
                    } else {
                        designer.MessageBox.show(result.message, designer.res.title, 3 /* error */);
                    }
                }
                $(".loading-placeholder").addClass('hidden');
            }
            $(".loading-placeholder").removeClass('hidden');

            var fileData = operationResult.data;
            setTimeout(function () {
                switch (extension) {
                    case 'csv':
                        importCsvData(fileData);
                        break;
                    case 'xlsx':
                        processLoadedExcel(operationResult);
                        break;
                }
                $(".loading-placeholder").addClass('hidden');
            }, 400);
        };

        if (actions.isFileModified) {
            showUnsavedWarning(function (evt, result) {
                switch (result) {
                    case 2 /* yes */
                        :
                        save(spread, function () {
                            openCore(spread, fileName);
                        });
                        break;
                    case 3 /* no */
                        :
                        openCore(spread, fileName);
                        break;
                    case 4 /* cancel */
                        :
                        return;
                }
            });
        } else {
            openCore(spread, fileName);
        }
    }

    actions.openOtherFormat = openOtherFormat;

    function importJson(spread, options) {
        var dialogArgs = {
            title: designer.res.importFileDialogTitle,
            filters: ".ssjson",
            nameFilters: [
                designer.res.spreadFileFilter
            ]
        };
        _import(spread, dialogArgs, options);
    }

    actions.importJson = importJson;
    function importExcel(spread, options) {
        var dialogArgs = {
            title: designer.res.importFileDialogTitle,
            filters: ".xlsx",
            nameFilters: [
                designer.res.excelFileFilter
            ]
        };
        _import(spread, dialogArgs, options);
    }

    actions.importExcel = importExcel;
    function importCsv(spread, options) {
        var dialogArgs = {
            title: designer.res.importFileDialogTitle,
            filters: ".csv",
            nameFilters: [
                designer.res.csvFileFilter
            ]
        };
        _import(spread, dialogArgs, options);
    }

    actions.importCsv = importCsv;

    function reset() {
        var resetCore = function () {
            designer.wrapper.reset();
            designer.ribbon.updateRibbonBarStyle();
            actions.currentFilePath = "";
            actions.isFileModified = false;
            updateWindowTitle();
        };

        if (actions.isFileModified) {
            showUnsavedWarning(function (evt, result) {
                switch (result) {
                    case 2 /* yes */
                        :
                        save(designer.wrapper.spread, resetCore);
                        break;
                    case 3 /* no */
                        :
                        resetCore();
                        break;
                    case 4 /* cancel */
                        :
                        return;
                }
            });
        } else {
            resetCore();
        }
    }

    actions.reset = reset;
    function undo(spread) {
        spread.undoManager().undo();
    }
    actions.undo = undo;
    function redo(spread) {
        spread.undoManager().redo();
    }
    actions.redo = redo;

    function _getPreferredZoomInfo() {
        var sheet = designer.wrapper.spread.getActiveSheet();
        var viewPortWidth = sheet.getViewportWidth(1);
        var viewPortHeight = sheet.getViewportHeight(1);
        var selections = sheet.getSelections();
        if (!selections || selections.length === 0) {
            return null;
        }
        var selection = selections[0];
        var selectionWidth = 0;
        var selectionHeight = 0;
        var i;
        if (selections.length > 1) {
            for (i = 1; i < selections.length; i++) {
                selection = selection.union(selections[i]);
            }
        }
        for (i = 0; i < selection.rowCount; i++) {
            selectionHeight += sheet.getRowHeight(selection.row + i);
        }
        for (var j = 0; j < selection.colCount; j++) {
            selectionWidth += sheet.getColumnWidth(selection.col + j);
        }
        var ratio = Math.min(viewPortWidth / selectionWidth, viewPortHeight / selectionHeight);
        return {
            zoom: ratio,
            topRow: selection.row,
            leftCol: selection.col
        };
    }

    actions._getPreferredZoomInfo = _getPreferredZoomInfo;

    actions.isFileModified = false;
    var _modifiedFileName;

    function updateWindowTitle() {
        var fileName;
        var currentFilePath = actions.currentFilePath;

        if (actions.isFileModified === true) {
            if (currentFilePath !== "" && $('title').text() !== _modifiedFileName) {
                fileName = app.getFileInfo(currentFilePath).fileName;
                _modifiedFileName = '* ' + fileName + ' - ' + designer.res.title;
                $('title').text(_modifiedFileName);
            }
        } else {
            if (currentFilePath !== "") {
                fileName = app.getFileInfo(currentFilePath).fileName;
                $('title').text(fileName + ' - ' + designer.res.title);
                designer.wrapper.shouldModifiedHandlerExecute = true;
            } else {
                $('title').text(designer.res.title);
            }
        }
    }

    actions.updateWindowTitle = updateWindowTitle;

    designer.actions = actions;
})();
