(function () {
    'use strict';

    var designer = GC.Spread.Sheets.Designer;

    var Menu = (function () {
        function Menu(rootElem) {
            this.rootElem = rootElem;
            this.selectedTab = null;
            this.onSelectItem = null;
            this._bindClickHandler();

            this.selectedTab = rootElem.find('a:first').closest('li');
            this.showTab(this.selectedTab.children("a").attr("href"));
        }

        Menu.prototype.showTab = function (hrefValue) {
            if (this.selectedTab) {
                var viewPage = $(this.selectedTab.children(":first").attr("href"));
                viewPage.hide();
                this.selectedTab.removeClass("menu-item-selected");
            }

            this.selectedTab = $("li > a[href=" + hrefValue + "]").parent();
            this.selectedTab.addClass("menu-item-selected");

            this.hideUnselectedViews();
            $(hrefValue).show("fast");
        };

        Menu.prototype.hideUnselectedViews = function () {
            var tabs = this.rootElem.children("li:not(.selected)");

            tabs.each(function (index, element) {
                var selector = $(element).children("a").attr("href");
                $(selector).hide();
            });
        };

        Menu.prototype._bindClickHandler = function () {
            var _this = this;
            this.rootElem.find("a").on("click", function (e) {
                _this._onClickItem(e);
                return false;
            });
        };

        Menu.prototype._onClickItem = function (e) {
            var selector = $(e.target).attr("href");
            if ($(selector).length !== 0) {
                this.showTab(selector);
            }
            if (this.onSelectItem) {
                this.onSelectItem.call(null, e);
            }
        };
        return Menu;
    })();
    designer.Menu = Menu;

    var FileMenu = (function () {
        function FileMenu() {
            this.mainMenu = new Menu($(".menu-panel ul"));
            this.importMenu = new Menu($("#import-page .left-view ul"));
            this.exportMenu = new Menu($("#export-page .left-view ul"));
        }

        FileMenu.isNotSupportFileApi = function () {
            var win = window;
            return !win.File && !win.FileReader;
        };
        FileMenu.showNotSupportFileApiDialog = function () {
            designer.MessageBox.show(designer.res.fileAPINotSupported, designer.res.title, designer.MessageBoxIcon.warning);
        };
        FileMenu.checkFileApiSupport = function () {
            if (FileMenu.isNotSupportFileApi()) {
                FileMenu.showNotSupportFileApiDialog();
                return false;
            }
            return true;
        };
        FileMenu.checkBolbSupport = function () {
            if (!window.Blob) {
                designer.MessageBox.show(designer.res.blobNotSupported, designer.res.title, designer.MessageBoxIcon.warning);
                return false;
            }
            return true;
        };

        FileMenu.prototype.reRenderSheetList = function () {
            var html = "<option>" + designer.res.fileMenu.allSheet + "</option>";
            var sheets = designer.wrapper.spread.sheets;
            var sheetCounts = sheets.length;
            if (sheetCounts <= 0) {
                return null;
            }
            for (var i = 0; i < sheetCounts; i++) {
                html += "<option>" + sheets[i].name() + "</option>"
            }
            $("#export-json-page #export-json-select").html(html)[0].selectedIndex = 0;
        };
        //init export PDF selected sheet
        FileMenu.prototype._initPDFExportSheetSelect = function () {
            var sheets = designer.wrapper.spread.sheets;
            var sheetCounts = sheets.length;
            if (sheetCounts <= 0) {
                return null;
            }
            var parent = $(".export-sheet-select");
            if (!parent) {
                return;
            }
            if (parent.children().length > 0) {
                parent.empty();
            }
            $("<option>").text(designer.res.fileMenu.allSheet).appendTo(parent);
            for (var i = 0; i < sheetCounts; i++) {
                $("<option>").text(sheets[i].name()).appendTo(parent);
            }
        };

        FileMenu.prototype.showFileScreen = function () {
            if ($(".file-menu").hasClass("hidden")) {
                $(".file-menu").removeClass("hidden");
            }
        };
        FileMenu.prototype.closeFileScreen = function () {
            if (!$(".file-menu").hasClass("hidden")) {
                $(".file-menu").addClass("hidden");
            }
        };

        FileMenu.prototype.clickOnMainMenuTab = function (e) {
            if (e.target.getAttribute('href') === '#') {
                return;
            }
            $(".menu-title span").text(e.target.textContent);
        };

        FileMenu.prototype.bindNavigatorHandlers = function () {
            var _this = this;
            $("#file-menu-goback").on("click", function () {
                return _this.closeFileScreen();
            });
            this.mainMenu.onSelectItem = this.clickOnMainMenuTab;
        };

        FileMenu.prototype.initPage = function () {
            this._initAllPages();

            $(".menu-title span").text(designer.res.fileMenu.new);
            this.mainMenu.showTab("#new-page");

            this.bindNavigatorHandlers();
        };

        FileMenu.prototype._initAllPages = function () {
            this._initNewPage();
            this._initImportPage();
            this._initExportPage();
        };

        //#region New page
        FileMenu.prototype._initNewPage = function () {
            var self = this;
            // $.ajax({
            //     url: "../resources/templates/templatesconfig.js",
            //     type: 'GET',
            //     dataType: 'json',
            //     success: function (data) {
            //         return self._fillAllTemplates(data);
            //     },
            //     error: function () {
            //         return designer.MessageBox.show(designer.res.requestTemplateConfigFail, designer.res.title, 3 /* error */);
            //     }
            // });
        };

        FileMenu.prototype._createTemplateItem = function (template) {
            var _this = this;
            var container = $("<div>");
            container.addClass("template-item");
            var thumb = $("<div>");
            thumb.addClass("template-item-thumb").addClass(template.thumbClass);
            thumb.appendTo(container);
            var label = $("<span>");
            label.text(template.name);
            label.appendTo(container);

            container.on('click', function () {
                return _this._onClickTemplateItem(template.name);
            });
            return container;
        };

        FileMenu.prototype._onClickTemplateItem = function (templateName) {
            designer.actions.openTemplate(designer.wrapper.spread, templateName);
        };

        FileMenu.prototype._fillAllTemplates = function (templates) {
            var container = $("#new-page");
            for (var i = 0; i < templates.length; i++) {
                var item = this._createTemplateItem(templates[i]);
                item.appendTo(container);
            }
        };

        //#endregion
        //#region Import page
        FileMenu.prototype._initImportPage = function () {
            this._addImportListeners();
        };

        FileMenu.prototype._addImportListeners = function () {
            $("#import-json").on('click', function (e) {
                if (!FileMenu.checkFileApiSupport()) {
                    return false;
                }
                var button = $(e.currentTarget), action = button.data('action'), actionArgs = button.data('actionArgs');

                designer.actions.doAction(action, designer.wrapper.spread, actionArgs, true /* ignoreSetFocus */);
            });

            $("#import_excel_rowAndColumnHeaders").on('click', function (e) {
                var value = $(e.currentTarget).prop('checked');
                $("#import_excel_rowHeaders").prop('checked', value);
                $("#import_excel_columnHeaders").prop('checked', value);
            });
            $("#import_excel_rowHeaders").on('click', function () {
                var andValue = $("#import_excel_rowHeaders").prop('checked') && $("#import_excel_columnHeaders").prop('checked');
                $("#import_excel_rowAndColumnHeaders").prop('checked', andValue);
            });
            $("#import_excel_columnHeaders").on('click', function () {
                var andValue = $("#import_excel_rowHeaders").prop('checked') && $("#import_excel_columnHeaders").prop('checked');
                $("#import_excel_rowAndColumnHeaders").prop('checked', andValue);
            });

            $("#import-excel").on('click', function (e) {
                if (!FileMenu.checkFileApiSupport()) {
                    return false;
                }
                var button = $(e.currentTarget), action = button.data('action');

                var ignoreStyle = !!$('#import_excel_ignoreStyle').prop('checked'), ignoreFormula = !!$('#import_excel_ignoreFormula').prop('checked'), rowHeaders = !!$('#import_excel_rowHeaders').prop('checked'), columnHeaders = !!$('#import_excel_columnHeaders').prop('checked'), doNotRecalculateAfterLoad = !!$('#import_excel_doNotRecalculateAfterLoad').prop('checked');

                var importOptions = {
                    excelOpenFlags: {
                        ignoreStyle: ignoreStyle,
                        ignoreFormula: ignoreFormula,
                        frozenColumnsAsRowHeaders: rowHeaders,
                        frozenRowsAsColumnHeaders: columnHeaders,
                        doNotRecalculateAfterLoad: doNotRecalculateAfterLoad
                    },
                    password: $('#import_excel_password').val()
                };

                designer.actions.doAction(action, designer.wrapper.spread, importOptions, true /* ignoreSetFocus */);
            });
            $("#import-csv").on('click', function (e) {
                var button = $(e.currentTarget), action = button.data('action');
                var includeRowHeaders = $('#import_csv_includeRowHeader').prop('checked') ? 1 : 0, dataAndFormulasOnly = $('#import_csv_includeColumnHeader').prop('checked') ? 2 : 0, unformatted = $('#import_csv_unformatted').prop('checked') ? 8 : 0, importFormula = $('#import_csv_importFormula').prop('checked') ? 16 : 0;

                var importOptions = {
                    textFileOpenFlags: (includeRowHeaders | dataAndFormulasOnly | unformatted | importFormula).toString(),
                    rowDelimiter: FileMenu._delimiterParser($('#import_csv_rowDelimiter').val()),
                    columnDelimiter: FileMenu._delimiterParser($('#import_csv_columnDelimiter').val()),
                    cellDelimiter: FileMenu._delimiterParser($('#import_csv_cellDelimiter').val()),
                    encoding: $('#import_csv_encoding').val()
                };

                designer.actions.doAction(action, designer.wrapper.spread, importOptions, true /* ignoreSetFocus */);
            });
        };

        //#endregion
        //#region Export page
        FileMenu.prototype._initExportPage = function () {
            this._addExportListeners();
        };

        FileMenu.prototype._getExportSheetIndex = function () {
            var index = $(".export-setting-input").get(0).selectedIndex;
            if (index === 0) {
                return undefined;
            } else {
                return index - 1;
            }
        };

        FileMenu.prototype._addExportListeners = function () {
            $("#export-json, #export-js").on('click', function (e) {
                if (!FileMenu.checkBolbSupport()) {
                    return false;
                }
                var button = $(e.currentTarget), action = button.data('action'), actionArgs = button.data('actionArgs');
                var sheetIndex = $("#export-json-select")[0].selectedIndex;
                if (!actionArgs) {
                    actionArgs = { sheetIndex: sheetIndex }
                } else {
                    actionArgs.sheetIndex = sheetIndex;
                }
                designer.actions.doAction(action, designer.wrapper.spread, actionArgs, true /* ignoreSetFocus */);
            });

            $("#export_excel_saveBothCustomRowAndColumnHeaders").on('click', function (e) {
                var value = $(e.currentTarget).prop('checked');
                $("#export_excel_saveCustomRowHeaders").prop('checked', value);
                $("#export_excel_saveCustomColumnHeaders").prop('checked', value);
            });
            $("#export_excel_saveCustomRowHeaders").on('click', function () {
                var andValue = $("#export_excel_saveCustomRowHeaders").prop('checked') && $("#export_excel_saveCustomColumnHeaders").prop('checked');
                $("#export_excel_saveBothCustomRowAndColumnHeaders").prop('checked', andValue);
            });
            $("#export_excel_saveCustomColumnHeaders").on('click', function () {
                var andValue = $("#export_excel_saveCustomRowHeaders").prop('checked') && $("#export_excel_saveCustomColumnHeaders").prop('checked');
                $("#export_excel_saveBothCustomRowAndColumnHeaders").prop('checked', andValue);
            });

            $("#export-excel").on('click', function (e) {
                var button = $(e.currentTarget), action = button.data('action');
                var ignoreStyle = !!$('#export_excel_ignoreStyle').prop('checked'), ignoreFormulas = !!$('#export_excel_ignoreFormulas').prop('checked'), saveCustomRowHeaders = !!$('#export_excel_saveCustomRowHeaders').prop('checked'), saveCustomColumnHeaders = !!$('#export_excel_saveCustomColumnHeaders').prop('checked');

                var exportOptions = {
                    excelSaveFlags: {
                        ignoreStyle: ignoreStyle,
                        ignoreFormula: ignoreFormulas,
                        rowHeadersAsFrozenColumns: saveCustomRowHeaders,
                        columnHeadersAsFrozenRows: saveCustomColumnHeaders
                    },
                    password: $('#export_excel_password').val()
                };

                designer.actions.doAction(action, designer.wrapper.spread, exportOptions, true /* ignoreSetFocus */);
            });
            $("#export-csv").on('click', function (e) {
                var button = $(e.currentTarget), action = button.data('action');
                var includeRowHeader = $('#export_csv_includeRowHeader').prop('checked') ? 1 : 0, includeColumnHeader = $('#export_csv_includeColumnHeader').prop('checked') ? 2 : 0, unFormatted = $('#export_csv_unFormatted').prop('checked') ? 8 : 0, exportFormula = $('#export_csv_exportFormula').prop('checked') ? 16 : 0, asViewed = $('#export_csv_asViewed').prop('checked') ? 32 : 0;

                var exportOptions = {
                    saveFlags: includeRowHeader | includeColumnHeader | unFormatted | exportFormula | asViewed,
                    sheetIndex: FileMenu._intParser($('#export_csv_sheetIndex').val()),
                    encoding: $('#export_csv_encoding').val(),
                    row: FileMenu._intParser($('#export_csv_row').val()),
                    column: FileMenu._intParser($('#export_csv_column').val()),
                    rowCount: FileMenu._intParser($('#export_csv_rowCount').val()),
                    columnCount: FileMenu._intParser($('#export_csv_columnCount').val()),
                    rowDelimiter: FileMenu._delimiterParser($('#export_csv_rowDelimiter').val()),
                    columnDelimiter: FileMenu._delimiterParser($('#export_csv_columnDelimiter').val()),
                    cellDelimiter: FileMenu._delimiterParser($('#export_csv_cellDelimiter').val())
                };
                if (!designer.wrapper.spread.sheets[exportOptions.sheetIndex]) {
                    designer.MessageBox.show(designer.res.exportCsvSheetIndexError, designer.res.title, 2 /* warning */, 0 /* ok */);
                    return;
                }
                designer.actions.doAction(action, designer.wrapper.spread, exportOptions, true /* ignoreSetFocus */);
            });

            var self = this;
            $("#export-pdf").on('click', function (e) {
                var button = $(e.currentTarget), action = button.data('action');

                var settings = {
                    title: $(".pdf-title").val(),
                    author: $(".pdf-author").val(),
                    subject: $(".pdf-subject").val(),
                    creator: $(".pdf-application").val(),
                    keywords: $(".pdf-keywords").val()
                };

                var exportOptions = {
                    sheetIndex: self._getExportSheetIndex(),
                    setting: settings
                };
                designer.actions.doAction(action, designer.wrapper.spread, exportOptions, true /* ignoreSetFocus */);
            });

            // $(".export-pdf-printer").on('click', function (e) {
            //     if (self._exportPDFPrinter === undefined) {
            //         self._exportPDFPrinter = new designer.PDFPrinterDialog();
            //     }
            //     self._exportPDFPrinter.open();
            // });
        };

        //#endregion
        FileMenu._intParser = function (val) {
            val = parseInt(val);
            if (isNaN(val)) {
                return null;
            }
            return val;
        };
        FileMenu._delimiterParser = function (val) {
            return val.replace(/\\r/g, '\r').replace(/\\n/g, '\n');
        };
        return FileMenu;
    })();
    designer.FileMenu = FileMenu;

    designer.fileMenu;

    designer.loader.ready(function () {
        designer.fileMenu = new FileMenu();
        $("#file-menu-tab").on("click", function () {
            designer.fileMenu.showFileScreen();
            designer.fileMenu._initPDFExportSheetSelect();
            designer.fileMenu.reRenderSheetList();
        });
        designer.fileMenu.initPage();
    });
})();