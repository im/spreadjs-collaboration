var app = (function () {
    var _fileSelectorEventAdded = false;
    var $emptyFileSelector;
    var _saveAsDialog;

    function processSelectedFile(file, action, callback, options) {
        if (file) {
            var operationResult = { status: 'success', file: file };
            switch (action) {
                case "insertPicture":
                    readFile(operationResult, "dataurl", callback);
                    break;
                default:
                    readFile(operationResult, "", callback, options);
                    break;
            }
        }
    }

    function getFileInfo(fullPath) {
        var result = { dir: '', fileName: '' };

        if (fullPath) {
            var found = false, pos;
            ['\\', '/'].forEach(function (c) {
                if (!found && (pos = fullPath.lastIndexOf(c)) !== -1) {
                    found = true;
                }
            });
            result.fileName = fullPath.substr(pos + 1);
            if (found) {
                result.dir = fullPath.substr(0, pos);
            }
        }

        return result;
    }

    function getExtension(fileName, detail) {
        var pos = fileName.lastIndexOf('.');
        if (detail) {
            detail.pos = pos;
            detail.name = fileName.substr(0, pos);
        }
        return pos === -1 ? "" : fileName.substring(pos + 1).toLowerCase();
    }

    function readFile(target, type, callback, options) {
        if (target && target.file) {
            var file = target.file;
            if (!type) {
                type = getExtension(file.name);
            }

            var reader = new FileReader();
            reader.onload = function () {
                if (type === "xlsx") {
                    importExcel(this.result, options, callback, file);
                } else {
                    target.data = this.result;
                    callback(target);
                }
            };
            switch (type) {
                case "dataurl":
                    reader.readAsDataURL(file);
                    break;
                case "xlsx":
                    reader.readAsArrayBuffer(file);
                    break;
                default:
                    reader.readAsText(file);
                    break;
            }
        }
    }

    function getFilters(nameFilters) {
        function convert(filterString) {
            var items = filterString.split('('),
                name = items[0].trim(),
                patterns = items[1].trim().replace(')', ''),
                extensions = patterns.split(' ').map(function (v) {
                    return v.replace('*.', '.');
                });
            return {
                name: name,
                extensions: extensions
            };
        }

        return nameFilters && nameFilters.map(convert) || [];
    }

    function importExcel(buffer, options, callback, file) {
        var excelIo = new GC.Spread.Excel.IO();
        excelIo.open(buffer, function (json) {
            callback && callback({
                status: 'success',
                data: json,
                file: file
            });
        }, function (err) {
            //process error
            callback && callback({
                status: 'failed',
                errorData: err,
                file: file
            });
        }, options);
    }

    function exportExcel(spreadJson, exportOptions, callback) {
        var options = { password: exportOptions.password };
        var excelIo = new GC.Spread.Excel.IO();
        excelIo.save(spreadJson, function (data) {
            callback && callback({
                status: 'success',
                data: data
            });
        }, function (err) {
            callback && callback({
                status: 'failed',
                errorData: err
            });
        }, options);
    }

    return {
        showSaveDialog: function (options, callback) {
            if (!_saveAsDialog) {
                _saveAsDialog = new GC.Spread.Sheets.Designer.SaveAsDialog();
            }
            var fileExtension = options.fileExtension || getFilters(options.nameFilters)[0].extensions[0];
            _saveAsDialog.open({
                fileExtension: fileExtension,
                done: function (result) {
                    var fileName = result && result.fileName, cancelled = result && result.cancelled;
                    if (cancelled || !fileName) {
                        callback({ status: 'cancelled' });
                    } else {
                        callback({ status: 'success', fileName: fileName + fileExtension });
                    }
                }
            });
        },
        showOpenDialog: function (options, callback, importOptions) {
            if (!$emptyFileSelector) {
                $emptyFileSelector = $("#fileSelector").clone();
            } else {
                // clear (with cloned object (.val("") not works for IE)) to make sure change event occurs even when same file selected again
                $("#fileSelector").replaceWith($emptyFileSelector.clone());
            }
            if (!_fileSelectorEventAdded) {
                $(document.body).on("change", "#fileSelector", function () {
                    var files = this.files,
                        file = files && files[0],
                        action = $(this).data("action"),
                        callback = $(this).data("callback"),
                        options = $(this).data("importOptions");
                    if (!file) {
                        return false;
                    }
                    processSelectedFile(file, action, callback, options);
                });
                _fileSelectorEventAdded = true;
            }

            var $fileSelector = $("#fileSelector");
            $fileSelector.data("action", options.action);
            $fileSelector.data("callback", callback);
            $fileSelector.data("importOptions", importOptions);
            var filters = options.filters || getFilters(options.nameFilters)[0].extensions.join(" ");
            $fileSelector.attr("accept", filters || "");
            $fileSelector.click();
        },
        save: function (fileName, saveData, callback, options) {
            function getVariableName(fileName) {
                var detail = {};
                getExtension(fileName, detail);
                var name = detail.name;

                if (/^[_a-zA-Z\$]{1}[_a-zA-Z0-9\$]*$/.test(name)) {
                    return name;
                } else {
                    return '_' + name.replace(/[ \.]/g, '_');
                }
            }

            function saveFile(fileName, data, mimeType, callback, encoding) {
                try {
                    var blobConfig = { type: mimeType };
                    if (encoding) {
                        blobConfig.encoding = encoding;
                    }
                    saveAs(new Blob([data], blobConfig), fileName);
                    callback({ status: 'success' });
                } catch (ex) {
                    callback({ status: 'failed', message: ex });
                }
            }

            var data = saveData.spread || saveData;

            var isJSFile = options && options.saveAsJS;

            if (isJSFile) {
                data = 'var ' + getVariableName(fileName) + ' = ' + data + ';';
            }

            var ext = saveData.exportFileType,
                mimeType = "text/plain;charset=utf-8",
                encoding = null;

            switch (ext) {
                case 'xlsx':
                    mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    exportExcel(data, options, function (result) {
                        if (result.status === 'success') {
                            saveFile(fileName, result.data, mimeType, callback);
                        } else {
                            callback({
                                status: 'failed',
                                message: result.errorData
                            });
                        }
                    });
                    return;
                case 'pdf':
                    saveData.spread.savePDF(function (blob) {
                        saveAs(blob, fileName);
                        callback({ status: 'success' });
                    }, function (ex) {
                        callback({ status: 'failed', message: ex });
                    }, options.setting, options.sheetIndex);
                    return;
                case 'csv':
                    mimeType = 'text/csv;charset=utf-8';
                    encoding = options && options.encoding;
                    break;
            }

            saveFile(fileName, data, mimeType, callback, encoding);
        },
        notify: function () { return ""; },
        openUrl: function () { return false; },
        notifyReady: function () { },
        getFileInfo: getFileInfo,
        getExtension: getExtension
    };
})();
