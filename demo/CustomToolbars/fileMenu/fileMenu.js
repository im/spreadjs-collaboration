var app = app || {};

var FileMenu = (function () {
    function FileMenu() {
        this.mainMenu = new Menu($(".menu-panel ul"));
        this.openMenu = new Menu($("#open-page .left-view ul"));

        this.recentFiles = [];
        this.currentFolder = null;
        this.recentFolders = [];

        //#region recent files and folders list
        if (app.isNative) {
            this.recentFiles = app.config("recentFiles") || [];
            this.currentFolder = app.config("currentFolder") || null;
            this.recentFolders = app.config("recentFolders") || [];
        }
    }

    FileMenu.prototype._updateRecentFileList = function (openedFilePath) {
        var fullPath = openedFilePath.replace(/\//g, '\\');

        var ext = fullPath.substring(fullPath.lastIndexOf('.') + 1), fileName = fullPath.substring(fullPath.lastIndexOf('\\') + 1), filePath = fullPath.substring(0, fullPath.lastIndexOf('\\'));

        var isFileExist = false;
        var firstFile;
        var fileTypeClass = "";
        switch (ext.toLowerCase()) {
            case 'ssjson':
                fileTypeClass = "ssjson-icon";
                break;
            case 'js':
                fileTypeClass = "ssjson-icon";
                break;
            case 'xls':
                fileTypeClass = "xls-icon";
                break;
            case 'xlsx':
                fileTypeClass = "xlsx-icon";
                break;
            case 'csv':
                fileTypeClass = "csv-icon";
                break;
            case 'pdf':
                fileTypeClass = "pdf-icon";
                break;
        }

        for (var i = 0; i < this.recentFiles.length; i++) {
            if (fullPath === this.recentFiles[i].path + '\\' + this.recentFiles[i].name) {
                firstFile = this.recentFiles[i];
                this.recentFiles.splice(i, 1);
                isFileExist = true;
                break;
            }
        }
        if (!isFileExist) {
            firstFile = {
                iconClass: fileTypeClass,
                path: filePath,
                name: fileName
            };
        }

        var len = this.recentFiles.unshift(firstFile);
        if (len > 20) {
            this.recentFiles.splice(20, len - 20);
        }
        app.config("recentFiles", this.recentFiles);
    };

    FileMenu.prototype._updateRecentFolderList = function (path) {
        var fullPath = path.replace(/\//g, '\\');

        var filePath = fullPath.substring(0, fullPath.lastIndexOf('\\')), dirName = filePath.substring(filePath.lastIndexOf('\\') + 1);

        var isDirExist = false;
        var firstFolder;

        for (var i = 0; i < this.recentFolders.length; i++) {
            if (filePath === this.recentFolders[i].path) {
                firstFolder = this.recentFolders[i];
                this.recentFolders.splice(i, 1);
                isDirExist = true;
                break;
            }
        }
        if (!isDirExist) {
            firstFolder = {
                path: filePath,
                name: dirName
            };
        }

        this.currentFolder = {path: filePath, name: dirName};
        var len = this.recentFolders.unshift(firstFolder);
        if (len > 20) {
            this.recentFolders.splice(20, len - 20);
        }
        app.config("currentFolder", this.currentFolder);
        app.config("recentFolders", this.recentFolders);
    };

    FileMenu.prototype.updateRecentList = function (filePath) {
        this._updateRecentFileList(filePath);
        this._updateRecentFolderList(filePath);
        this._fillRecentWorkbooksPage(this.recentFiles);
        this._fillCurrentFolderList(this.currentFolder);
        this._fillRecentFoldersList(this.recentFolders);
    };

    FileMenu.prototype.showFileScreen = function () {
        // always show the "open page" as default
        this.mainMenu.showTab("#open-page");
        $("#openPassword").val('');
        $("#savePassword").val('');
        $("#download").hide();
        if ($(".fileMenu").hasClass("hidden")) {
            $(".fileMenu").removeClass("hidden");
        }
    };
    FileMenu.prototype.closeFileScreen = function () {
        if (!$(".fileMenu").hasClass("hidden")) {
            $(".fileMenu").addClass("hidden");
        }
        $("#download").hide();
    };

    FileMenu.prototype.clickOnMainMenuTab = function (e) {
        if (e.target.getAttribute('href') === '#') {
            return;
        }
        $(".menu-title span").text(e.target.textContent);
    };

    FileMenu.prototype.bindNavigatorHandlers = function () {
        var self = this;
        $("#file-menu-goback").on("click", function () {
            return self.closeFileScreen();
        });
        self.mainMenu.onSelectItem = self.clickOnMainMenuTab;
    };

    FileMenu.prototype.initPage = function () {
        var self = this;

        this._initAllPages();

        this.mainMenu.showTab("#open-page");

        this.bindNavigatorHandlers();

        $("#filemenu-new").on('click', function (e) {
            app.reset();
            self.closeFileScreen();
        });

        $("#filemenu-close").on('click', function (e) {
            app.reset();
            self.closeFileScreen();
        });

        $(window).on("keypress.licensed-feature", function (e) {
            if (!((e.which === 115 && e.ctrlKey) || (e.which === 19)))
                return true;

            app.actions.save(app.wrapper.spread);

            e.preventDefault();
            return false;
        });

        $(document).on("click", "#sheetNameList li", function () {
            // TODO
        });
    };

    FileMenu.prototype._initAllPages = function () {
        this._initOpenPage();
    };

    //#region Open page
    FileMenu.prototype._initOpenPage = function () {
        this._fillRecentWorkbooksPage(this.recentFiles);
        this._fillComputerPage(this.currentFolder, this.recentFolders);
    };

    FileMenu.prototype._createFileItem = function (file) {
        var _this = this;
        var container = $("<li>");
        var iconDiv = $("<div>");
        var labelDiv = $("<div>");
        var fileNameLabel = $("<div>");
        var filePathLabel = $("<div>");

        labelDiv.addClass("file-label");
        container.addClass("list-item");

        iconDiv.addClass("list-item-big-icon").addClass(file.iconClass);
        fileNameLabel.text(file.name).addClass("file-name").appendTo(labelDiv);
        filePathLabel.text(file.path).addClass("file-path").appendTo(labelDiv);

        container.append(iconDiv).append(labelDiv);
        container.addClass("only-for-licensed");

        container.on('click', function () {
            return _this._onClickFileListItem(file);
        });
        return container;
    };

    FileMenu.prototype._onClickFileListItem = function (file) {
        var ext = file.name.substring(file.name.lastIndexOf('.') + 1);
        switch (ext.toLowerCase()) {
            case 'ssjson':
                app.actions.openJson(app.wrapper.spread, file.path + '\\' + file.name);
                break;
            case 'xls':
            case 'xlsx':
            case 'csv':
                app.actions.openOtherFormat(app.wrapper.spread, file.path + '\\' + file.name);
                break;
        }
    };

    FileMenu.prototype._fillRecentWorkbooksPage = function (recentList) {
        $("#recent-workbooks-page").find('span').remove();
        $("#recent-workbooks-page").find('ul').remove();

        if (recentList.length === 0) {
            var tips = $("<span>");
            tips.text('noRecentWorkbooks');
            tips.appendTo($("#recent-workbooks-page"));
        } else {
            var container = $("<ul>");
            container.appendTo($("#recent-workbooks-page"));
            for (var i = 0; i < recentList.length; i++) {
                var fileInfo = recentList[i];
                var item = this._createFileItem(fileInfo);
                item.appendTo(container);
            }
        }
    };

    FileMenu.prototype._createFolderItem = function (folder) {
        var _this = this;
        var container = $("<li>");
        var iconDiv = $("<div>");
        var labelDiv = $("<div>");
        var folderNameLabel = $("<div>");
        var folderPathLabel = $("<div>");

        labelDiv.addClass("file-label");
        container.addClass("list-item");

        iconDiv.addClass("directory-icon");
        folderNameLabel.text(folder.name).addClass("file-name").appendTo(labelDiv);
        folderPathLabel.text(folder.path).addClass("file-path").appendTo(labelDiv);

        container.append(iconDiv).append(labelDiv);
        container.addClass("only-for-licensed");

        container.on('click', function (e) {
            return _this._onClickFolderListItem(e, folder);
        });

        return container;
    };

    FileMenu.prototype._onClickFolderListItem = function (e, folder) {
        var target = e.target;

        var dialogArgs;

        if ($.contains($('#open-page')[0], target)) {
            dialogArgs = {
                title: 'Open File', //designer.res.openFileDialogTitle,
                nameFilters: [
                    app.res.allSpreadFileFilter,
                    app.res.spreadFileFilter,
                    app.res.excelFileFilter,
                    app.res.excelFileFilter2,
                    app.res.csvFileFilter,
                    app.res.allFileFilter
                ],
                dirName: folder.path
            };
            app.actions.open(app.wrapper.spread, dialogArgs);
        } else {
            dialogArgs = {
                title: 'Save File', //designer.res.saveFileDialogTitle,
                nameFilters: [
                    app.res.spreadFileFilter,
                    app.res.excelFileFilter,
                    app.res.excelFileFilter2,
                    app.res.csvFileFilter,
                    app.res.allFileFilter
                ],
                dirName: folder.path
            };
            app.actions.saveAs(app.wrapper.spread, dialogArgs);
        }
    };

    FileMenu.prototype._fillCurrentFolderList = function (currentFolder) {
        $(".current-folder").find('ul').remove();

        if (currentFolder === null) {
            $(".current-folder").prev().hide();
            $(".current-folder").hide();
        } else {
            $(".current-folder").prev().show();
            $(".current-folder").show();

            var currentFolderContainer = $("<ul>");
            var item = this._createFolderItem(currentFolder);
            item.appendTo(currentFolderContainer);
            $(".current-folder").append(currentFolderContainer);
        }
    };

    FileMenu.prototype._fillRecentFoldersList = function (recentFolders) {
        $(".recent-folders").find('span').remove();
        $(".recent-folders").find('ul').remove();

        if (recentFolders.length === 0) {
            var tips = $("<span>");
            tips.text('noRecentFolders');
            tips.appendTo($(".recent-folders"));
        } else {
            var currentFolderContainer = $("<ul>");
            for (var i = 0; i < recentFolders.length; i++) {
                var item = this._createFolderItem(recentFolders[i]);
                item.appendTo(currentFolderContainer);
            }
            $(".recent-folders").append(currentFolderContainer);
        }
    };

    FileMenu.prototype._fillComputerPage = function (currentFolder, recentFolders) {
        this._fillCurrentFolderList(currentFolder);
        this._fillRecentFoldersList(recentFolders);
        this._addBrowserListeners();
        this._addPrintSettingListeners();
    };

    FileMenu.prototype._addBrowserListeners = function () {
        $("#open-browser").on('click', function (e) {
            // TODO, create app method to provide the function
            $("#fileSelector").data("action", "doImport");
            $("#fileSelector").attr("accept", ".ssjson, .json, .xlsx");
            $("#fileSelector").click();
        });
        $("#browser-save").on('click', function (e) {
            app.saveBrowserFile($("#saveAsFileName").val() || "export");
        });
    };

    FileMenu.prototype._addPrintSettingListeners = function () {
        $(".insertWaterMark").on('click', function (e) {
            $("#fileSelector").data("action", "addWaterMark");
            $("#fileSelector").attr("accept", "image/*");
            $("#fileSelector").click();
        });
		
        $("#removeWaterMark").on('click', function (e) {
            $(".insertWaterMark").val("");
            $("#removeWaterMark").addClass("hidden");
        });

        $("#print-setting textarea").on('click', function (e) {
            $("#print-setting textarea.active").removeClass("active");
            $(this).addClass("active");
        });
        $("#customPrintHeader, #customPrintFooter").on('click', function (e) {
            var $prev = $(this).prev(),
                setting = $prev.data("value") || {};
            app.printSettingSectionNames.forEach(function (name, index) {
                var textarea = $("textarea.printSetting")[index];
                $(textarea).val(setting[name]).data("value", setting[getWithImageSuffix(name)]);
            });
            $("textarea.printSetting.active").removeClass("active");
            $("textarea.printSetting").first().addClass("active");

            $("#print-setting .printHeaderFooterDetail")
                .data("source", $(this).data("name"))
                .insertAfter(this)
                .removeClass("hidden");
        });
        $("#customInsert").on('click', function (e) {
            var value = $(this).parent().data("value");
            var $textarea = $("textarea.printSetting.active");

            app.insertText($textarea[0], value);
            $textarea.trigger("change");
        });
        $("textarea.printSetting").on('change', function () {
            var propertyName = $("#print-setting .printHeaderFooterDetail").data("source"),
                options = {}, values = {};

            $("textarea.printSetting").each(function (index) {
                var name = app.printSettingSectionNames[index];
                values[name] = app.getPreviewDisplayString($(this).val());
                values[getWithImageSuffix(name)] = $(this).data("value");
            });
            options[propertyName] = values;
            app.updatePreview(options);
        });
        $("#insertPicture").on('click', function (e) {
            var value = $(this).parent().data("value");
            if (value) {
                var $textarea = $("textarea.printSetting.active");
                // set data-value before update text since the corresponding change event will use it
                $textarea.data("value", value);
                app.insertText($textarea[0], printImageFormat);
                $textarea.trigger("change");
            }
        });
        $("#print-setting .button-group>button").on('click', function () {
            var name = $(this).data("name");

            switch (name) {
                case "ok":
                    var propertyName = $("#print-setting .printHeaderFooterDetail").data("source"),
                        values = {};

                    $("textarea.printSetting").each(function (index) {
                        var name = app.printSettingSectionNames[index],
                            imageName = $(this).data("value");

                        values[name] = $(this).val();
                        if (imageName) {
                            values[getWithImageSuffix(name)] = imageName;
                        }
                    });
                    // save and update dropdown
                    var $li = createListItem({value: values});

                    var $ul = $(["#printHeaderList", "#printFooterList"][["header", "footer"].indexOf(propertyName)]),
                        index = $ul.parent().data("index");

                    if (index !== undefined) {
                        var $selectedItem = $($('li', $ul)[index]);

                        if ($selectedItem.hasClass("builtin")) {
                            // add new item
                            $ul.append($li);
                        } else {
                            // replace old one
                            $li.insertBefore($selectedItem);
                            $selectedItem.remove();
                        }
                    }

                    // sync related items
                    $("a", $li).click();
                    break;

                case "cancel":
                    // restore preview to use current selected items
                    app.updatePreview({
                        header: $("#printHeaderList").parent().data().$element.data("sections"),
                        footer: $("#printFooterList").parent().data().$element.data("sections")
                    });
                    break;
            }

            // apply with the current selected item

            $("#print-setting .printHeaderFooterDetail").addClass("hidden");
        });
        $("#printSpread").on('click', function () {
            var printInfo = new GC.Spread.Sheets.Print.PrintInfo(),
                headerInfo = $("#printHeaderList").parent().data("value"),
                footerInfo = $("#printFooterList").parent().data("value");

            printInfo.showBorder(getCheckValue("printShowBorder"));
            printInfo.showGridLine(getCheckValue("printShowGridline"));

            if (headerInfo) {
                printInfo.headerLeft(headerInfo.left);
                printInfo.headerLeftImage(app.uploadImages[headerInfo.leftImage]);
                printInfo.headerCenter(headerInfo.center);
                printInfo.headerCenterImage(app.uploadImages[headerInfo.centerImage]);
                printInfo.headerRight(headerInfo.right);
                printInfo.headerRightImage(app.uploadImages[headerInfo.rightImage]);
            }
            if (footerInfo) {
                printInfo.footerLeft(footerInfo.left);
                printInfo.footerLeftImage(app.uploadImages[footerInfo.leftImage]);
                printInfo.footerCenter(footerInfo.center);
                printInfo.footerCenterImage(app.uploadImages[footerInfo.centerImage]);
                printInfo.footerRight(footerInfo.right);
                printInfo.footerRightImage(app.uploadImages[footerInfo.rightImage]);
            }

            var waterMark = $(".insertWaterMark").val()
            if (waterMark) {
                var imageWidth = 260;
                var imageHeight = 260;
                var beginX = printInfo.paperSize().width() - imageWidth;
                printInfo.watermark([{ x: beginX, y: 0, width: imageWidth, height: imageHeight, imageSrc: app.uploadWaterMark.url, page: "all" }]);
            }
            var printRange = getDropDownValue("printRange");

            app.printSpread(printRange, printInfo);
        });
    };

    return FileMenu;
})();
app.FileMenu = FileMenu;

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

        if (hrefValue === "#open-page") {
            if (!app.isNative) {
                $(".left-view", hrefValue).hide();
                $(".right-view", hrefValue).hide();
                $("#open-browser").prependTo($("#open-page"));
            }
        } else if (hrefValue === "#app-setting") {
            app.fillSheetNameList();
        } else if (hrefValue === "#print-setting") {
            app.initPrintSetting();
            // open options by default
            var $optionsGroup = $("#print-setting .pane-group-title").first();
            if ($(">span>span:first", $optionsGroup).hasClass("glyphicon-triangle-right")) {
                $optionsGroup.click();
            }
        }

        $(hrefValue).show("fast");

        $(".menu-title span").text($("a", this.selectedTab).text());
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
app.Menu = Menu;

$(document).ready(function () {
    app.fileMenu = new FileMenu();
    $("#file-menu-tab").on("click", function () {
        app.fileMenu.showFileScreen();
    });
    app.fileMenu.initPage();
});
