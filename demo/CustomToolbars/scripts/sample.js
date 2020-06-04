/*jshint -W030 */   // Expected an assignment or function call and instead saw an expression (a && a.fun1())
/*jshint -W004 */   // {a} is already defined (can use let instead of var in es6)
/* jshint laxbreak: true */

var app = app || {};
var spreadNS = GC.Spread.Sheets;
var Calc = GC.Spread.CalcEngine;
var spread, excelIO;
var ribbon;
var settingCache = {backColor: "white", foreColor: "black", tableStyles: 'medium2'};
var tableIndex = 1, pictureIndex = 1;
var fbx, isShiftKey = false;
var resourceMap = {},
    conditionalFormatTexts = {};
var Barcode = spreadNS.Barcode;
var $tableStyleDropdown;
var colorPicker, $colorPickerContainer;
var Actions = GC.Spread.Sheets.designer.spreadActions;
var isSafari = (function () {
    var tem, M = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (!/trident/i.test(M[1]) && M[1] !== 'Chrome') {
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = navigator.userAgent.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M[0].toLowerCase() === "safari";
    }
    return false;
})();
var isIE = navigator.userAgent.toLowerCase().indexOf('compatible') < 0 && /(trident)(?:.*? rv ([\w.]+)|)/.exec(navigator.userAgent.toLowerCase()) !== null;
var mergable = false, unmergable = false;
var defaultParagraphSeparator = 'p';

function getRichText() {
    var iterator = document.createNodeIterator(document.getElementsByClassName('rich-editor-content')[0], NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
    var root = iterator.nextNode();// root
    var richText = [];
    var style = {};
    var text = '';
    var node = iterator.nextNode();
    var underlineNode = null, lineThroughNode = null, pNode = null;
    while (node !== null) {
        if (node.nodeType === 3/*TextNode*/) {
            text = node.nodeValue;
            style = document.defaultView.getComputedStyle(node.parentElement, null);
            if (underlineNode && underlineNode.contains(node) === false) {
                underlineNode = null;
            }
            if (lineThroughNode && lineThroughNode.contains(node) === false) {
                lineThroughNode = null;
            }
            if (pNode && getLastTextNode(pNode) === node && getLastTextNode(root) !== node) {
                text = text + '\r\n';
                pNode = null;
            }
            var richTextStyle = getRichStyle(style, underlineNode, lineThroughNode);
            handleSuperAndSubScript(root,node,richTextStyle);
            richText.push({
                style: richTextStyle,
                text: text
            });
        } else if (node.nodeName.toLowerCase() === defaultParagraphSeparator) {
            pNode = node;
        } else if (node.nodeName.toLowerCase() === 'u') {
            underlineNode = node;
        } else if (node.nodeName.toLowerCase() === 'strike') {
            lineThroughNode = node;
        }

        node = iterator.nextNode();
    }
    return richText;
}

function handleSuperAndSubScript(root,node,style){
    if (root === node){
        return;
    }
    while(node.parentNode !== root){
        if(node.nodeName.toLowerCase() === 'sub'){
            style.vertAlign = 2;
            break;
        }
        if(node.nodeName.toLowerCase() === 'sup'){
            style.vertAlign = 1;
            break;
        }
        node = node.parentNode;
    }
}

function getRichStyle(style, isUnderlineNode, isLineThroughNode) {// getComputedStyle can't get inherit textDecoration
    return {
        font: (style.fontWeight === '700' ? 'bold ' : '') + (style.fontStyle === 'italic' ? 'italic ' : '') + style.fontSize + ' ' + style.fontFamily,
        foreColor: style.color,
        textDecoration: (isUnderlineNode ? 1 : 0) | (isLineThroughNode ? 2 : 0)
    };
}

function getLastTextNode(root) {
    if (root && root.nodeType === 1) {
        var child = root.lastChild;
        return getLastTextNode(child);
    } else {
        return root;
    }
}

function toggleGroupDisplay() {
    var $element = $(this),
        $content = $element.siblings(".pane-group-content"),
        $target = $('>span>span:first', $element),
        collapsed = $target.hasClass("glyphicon-triangle-right");

    // TODO: slideToggle makes the display of content a mess, need time to find a solution to resolve it
    if (collapsed) {
        $target.removeClass("glyphicon-triangle-right").addClass("glyphicon-triangle-bottom");
        //$content.slideToggle();
        $content.show();
    } else {
        $target.addClass("glyphicon-triangle-right").removeClass("glyphicon-triangle-bottom");
        //$content.slideToggle();
        $content.hide();
    }
}

var _mergeState = {};
function updateMergeState() {
    var sheet = spread.getActiveSheet();
    var sels = sheet.getSelections(), hasMergeCells = false;
    mergable = false, unmergable = false;


    sels.forEach(function (range) {
        var ranges = sheet.getSpans(range),
            spanCount = ranges.length;

        if (!hasMergeCells) {
            hasMergeCells = spanCount > 0;
        }

        if (!mergable) {
            if (spanCount > 1 || (spanCount === 0 && (range.rowCount > 1 || range.colCount > 1))) {
                mergable = true;
            } else if (spanCount === 1) {
                var range2 = ranges[0];
                if (range2.row !== range.row || range2.col !== range.col ||
                    range2.rowCount !== range2.rowCount || range2.colCount !== range.colCount) {
                    mergable = true;
                }
            }
        }
        if (!unmergable) {
            unmergable = spanCount > 0;
        }
    });

    _mergeState.mergable = mergable;
    _mergeState.unmergable = unmergable;

    // use active cell's merge state
    ribbon.setToggleButton('cellmerge', !!sheet.getSpan(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex()));
}

function updateCellStyleState(sheet, row, column) {
    var style = sheet.getActualStyle(row, column);

    if (style) {
        var sfont = style.font;

        // Font
        if (sfont) {
            var font = parseFont(sfont);

            ribbon.setToggleButton('bold', ["bold", "bolder", "700", "800", "900"].indexOf(font.fontWeight) !== -1);
            ribbon.setToggleButton("italic", font.fontStyle !== 'normal');
            ribbon.setInputValue('fontFamily', font.fontFamily.replace(/'/g, ""));
            ribbon.setInputValue('fontSize', parseFloat(font.fontSize));
        }

        var underline = spreadNS.TextDecorationType.underline,
            linethrough = spreadNS.TextDecorationType.lineThrough,
            overline = spreadNS.TextDecorationType.overline,
            doubleUnderline = spreadNS.TextDecorationType.doubleUnderline,
            textDecoration = style.textDecoration;

        ribbon.setToggleButton("underline", textDecoration && ((textDecoration & underline) === underline));
        ribbon.setToggleButton("strikethrough", textDecoration && ((textDecoration & linethrough) === linethrough));
        ribbon.setToggleButton("overline", textDecoration && ((textDecoration & overline) === overline));
        ribbon.setToggleButton("doubleUnderline", textDecoration && ((textDecoration & doubleUnderline) === doubleUnderline));

        // Alignment
        ribbon.setToggleButton('wordwrap', style.wordwrap);

        // general (3, auto detect) without setting button just like Excel
        var alignType = ['left', 'center', 'right'][style.hAlign];
        ribbon.setToggleButton('halign-' + (alignType || 'left'), !!alignType);

        alignType = ['top', 'center', 'bottom'][style.vAlign];
        ribbon.setToggleButton('valign-' + (alignType || 'top'), !!alignType);

        // locked
        ribbon.setToggleButton('unlockcells', style.locked);
    }
}

function markFontStyleButtonActive(name, active) {
    var $target = $("#setting-pane button[data-name='" + name + "']");

    if (active) {
        $target.addClass("toggle on");
    } else {
        $target.removeClass("toggle on");
    }
}

function parseFont(font) {
    var fontFamily = null,
        fontSize = null,
        fontStyle = "normal",
        fontWeight = "normal",
        fontVariant = "normal",
        lineHeight = "normal";

    var elements = font.split(/\s+/);
    var element;
    while ((element = elements.shift())) {
        switch (element) {
            case "normal":
                break;

            case "italic":
            case "oblique":
                fontStyle = element;
                break;

            case "small-caps":
                fontVariant = element;
                break;

            case "bold":
            case "bolder":
            case "lighter":
            case "100":
            case "200":
            case "300":
            case "400":
            case "500":
            case "600":
            case "700":
            case "800":
            case "900":
                fontWeight = element;
                break;

            default:
                if (!fontSize) {
                    var parts = element.split("/");
                    fontSize = parts[0];
                    if (fontSize.indexOf("px") !== -1) {
                        fontSize = px2pt(parseFloat(fontSize)) + 'pt';
                    }
                    if (parts.length > 1) {
                        lineHeight = parts[1];
                        if (lineHeight.indexOf("px") !== -1) {
                            lineHeight = px2pt(parseFloat(lineHeight)) + 'pt';
                        }
                    }
                    break;
                }

                fontFamily = element;
                if (elements.length)
                    fontFamily += " " + elements.join(" ");

                return {
                    "fontStyle": fontStyle,
                    "fontVariant": fontVariant,
                    "fontWeight": fontWeight,
                    "fontSize": fontSize,
                    "lineHeight": lineHeight,
                    "fontFamily": fontFamily
                };
        }
    }

    return {
        "fontStyle": fontStyle,
        "fontVariant": fontVariant,
        "fontWeight": fontWeight,
        "fontSize": fontSize,
        "lineHeight": lineHeight,
        "fontFamily": fontFamily
    };
}

var tempSpan = $("<span></span>");
function px2pt(pxValue) {
    tempSpan.css({
        "font-size": "96pt",
        "display": "none"
    });
    tempSpan.appendTo($(document.body));
    var tempPx = tempSpan.css("font-size");
    if (tempPx.indexOf("px") !== -1) {
        var tempPxValue = parseFloat(tempPx);
        return Math.round(pxValue * 96 / tempPxValue);
    }
    else {  // when browser have not convert pt to px, use 96 DPI.
        return Math.round(pxValue * 72 / 96);
    }
}

function setReferenceStyle(name) {
    var referenceStyle, columnHeaderAutoText;

    if (name === "a1style") {
        referenceStyle = spreadNS.ReferenceStyle.a1;
        columnHeaderAutoText = spreadNS.HeaderAutoText.letters;
    } else {
        referenceStyle = spreadNS.ReferenceStyle.r1c1;
        columnHeaderAutoText = spreadNS.HeaderAutoText.numbers;
    }

    spread.options.referenceStyle = referenceStyle;
    spread.sheets.forEach(function (sheet) {
        sheet.options.colHeaderAutoText = columnHeaderAutoText;
    });
    updatePositionBox(spread.getActiveSheet());
}

function radioButtonClicked() {
    var $this = $(this), name = $this.attr('name'), value = $this.data('value');

    switch (name) {
        case "referenceStyle":
            setReferenceStyle(value);
            break;

        case "slicerMoveAndSize":
            setSlicerSetting("moveSize", value);
            break;
    }
}

function checkedChanged() {
    var $element = $(this),
        name = $element.parent().data("name");

    if ($element.hasClass("disabled")) {
        return;
    }

    var sheet = spread.getActiveSheet();

    var value = $element.prop('checked');

    spread.suspendPaint();

    switch (name) {
        case "cutCopyIndicatorVisible":
            spread.options.cutCopyIndicatorVisible = value;
            break;

        case "showVerticalScrollbar":
            spread.options.showVerticalScrollbar = value;
            break;

        case "showHorizontalScrollbar":
            spread.options.showHorizontalScrollbar = value;
            break;

        case "scrollIgnoreHidden":
            spread.options.scrollIgnoreHidden = value;
            break;

        case "scrollbarMaxAlign":
            spread.options.scrollbarMaxAlign = value;
            break;

        case "scrollbarShowMax":
            spread.options.scrollbarShowMax = value;
            break;

        case "tabStripVisible":
            spread.options.tabStripVisible = value;
            break;

        case "newTabVisible":
            spread.options.newTabVisible = value;
            break;

        case "tabEditable":
            spread.options.tabEditable = value;
            break;

        case "showTabNavigation":
            spread.options.tabNavigationVisible = value;
            break;

        case "showDragDropTip":
            spread.options.showDragDropTip = value;
            break;

        case "showDragFillTip":
            spread.options.showDragFillTip = value;
            break;

        case "showPrintLine":
            sheet.isPrintLineVisible(value);

        case "sheetVisible":
            var sheetIndex = $element.data("sheetIndex"),
                sheetName = $element.data("sheetName"),
                selectedSheet = spread.sheets[sheetIndex];

            // be sure related sheet not changed (such add / remove sheet, rename sheet)
            if (selectedSheet && selectedSheet.name() === sheetName) {
                selectedSheet.visible(value);
            } else {
                console.log("selected sheet' info was changed, please select the sheet and set visible again.");
            }
            break;

        case "canUserDragDrop":
            spread.options.allowUserDragDrop = value;
            break;

        case "canUserDragFill":
            spread.options.allowUserDragFill = value;
            break;

        case "allowZoom":
            spread.options.allowUserZoom = value;
            break;

        case "allowOverflow":
            spread.sheets.forEach(function (sheet) {
                sheet.options.allowCellOverflow = value;
            });
            break;

        case "showDragFillSmartTag":
            spread.options.showDragFillSmartTag = value;
            break;

        case "allowUserDeselect":
            spread.options.allowUserDeselect = value;
            break;

        case "showRowRangeGroup":
            sheet.showRowRangeGroup(value);
            break;

        case "showColumnRangeGroup":
            sheet.showColumnRangeGroup(value);
            break;

        case "highlightInvalidData":
            spread.options.highlightInvalidData = value;
            break;

        /* table realted items */
        case "tableFilterButton":
            _activeTable && _activeTable.filterButtonVisible(value);
            break;

        case "tableHeaderRow":
            _activeTable && _activeTable.showHeader(value);
            break;

        case "tableTotalRow":
            _activeTable && _activeTable.showFooter(value);
            break;

        case "tableBandedRows":
            _activeTable && _activeTable.bandRows(value);
            break;

        case "tableBandedColumns":
            _activeTable && _activeTable.bandColumns(value);
            break;

        case "tableFirstColumn":
            _activeTable && _activeTable.highlightFirstColumn(value);
            break;

        case "tableLastColumn":
            _activeTable && _activeTable.highlightLastColumn(value);
            break;
        /* table realted items (end) */

        /* comment related items */
        case "commentDynamicSize":
            _activeComment.dynamicSize(value);
            break;

        case "commentDynamicMove":
            _activeComment.dynamicMove(value);
            break;

        case "commentLockText":
            _activeComment.lockText(value);
            break;

        case "commentShowShadow":
            _activeComment.showShadow(value);
            break;
        /* comment related items (end) */

        /* slicer related items */
        case "displaySlicerHeader":
            setSlicerSetting("showHeader", value);
            break;

        case "lockSlicer":
            setSlicerSetting("lock", value);
            break;

        case "hide-no-data":
            enableRelatedItems(["mark-no-data", "show-no-data-last"], !value);
            setSlicerSetting("showNoDataItems", !value);
            break;

        case "mark-no-data":
            enableRelatedItems(["show-no-data-last"], value);
            setSlicerSetting("visuallyNoDataItems", value);
            break;

        case "show-no-data-last":
            setSlicerSetting("showNoDataItemsInLast", value);
            break;
        /* slicer related items (end) */
    }
    spread.resumePaint();
}

function enableRelatedItems(names, enable) {
    names.forEach(function (name) {
        var $target = $("#setting-pane label[data-name='" + name + "']"),
            $input = $("input", $target);
        $target.attr("disabled", !enable);
        $input.prop("disabled", !enable);
    });
}

function updateNumberProperty() {
    var $element = $(this),
        name = $element.data("name"),
        value = parseInt($element.val(), 10);

    if (isNaN(value)) {
        return;
    }

    var sheet = spread.getActiveSheet();

    spread.suspendPaint();
    switch (name) {
        case "commentBorderWidth":
            _activeComment.borderWidth(value);
            break;

        case "commentOpacity":
            _activeComment.opacity(value / 100);
            break;

        case "slicerColumnNumber":
            setSlicerSetting("columnCount", value);
            break;

        case "slicerButtonHeight":
            setSlicerSetting("itemHeight", value);
            break;

        case "slicerButtonWidth":
            setSlicerSetting("itemWidth", value);
            break;

        default:
            console.log("updateNumberProperty need add for", name);
            break;
    }
    spread.resumePaint();
}

function updateStringProperty() {
    var $element = $(this),
        name = $element.data("name"),
        value = $element.val();

    var sheet = spread.getActiveSheet();

    switch (name) {
        case "commentPadding":
            var paddingArray = value.split(',').map(function (v) {
                return parseFloat(v)
            });
            var padding = new GC.Spread.Sheets.Comments.Padding(paddingArray[0], paddingArray[1], paddingArray[2], paddingArray[3]);
            _activeComment.padding(padding);
            break;

        case "slicerName":
            setSlicerSetting("name", value);
            break;

        case "slicerCaptionName":
            setSlicerSetting("captionName", value);
            break;

        default:
            console.log("updateStringProperty w/o process of ", name);
            break;
    }
}

app.fillSheetNameList = function () {
    var $ul = $("#sheetNameList");
    $ul.empty();
    spread.sheets.forEach(function (sheet, index) {
        $('<li><a class="text" data-value="' + index + '">' + sheet.name() + '</a></li>').appendTo($ul);
    });
    $("a", $("li", $ul).first()).click();
};

function syncSpreadPropertyValues() {
    // General
    setCheckValue("canUserDragDrop", spread.options.allowUserDragDrop);
    setCheckValue("canUserDragFill", spread.options.allowUserDragFill);
    setCheckValue("allowUserDeselect", spread.options.allowUserDeselect);
    setCheckValue("allowZoom", spread.options.allowUserZoom);
    setCheckValue("allowOverflow", spread.getActiveSheet().options.allowCellOverflow);
    setCheckValue("showDragFillSmartTag", spread.options.showDragFillSmartTag);

    // Calculation
    setRadioItemChecked("referenceStyle", spread.options.referenceStyle === spreadNS.ReferenceStyle.r1c1 ? "r1c1style" : "a1style");

    // Scroll Bar
    setCheckValue("showVerticalScrollbar", spread.options.showVerticalScrollbar);
    setCheckValue("showHorizontalScrollbar", spread.options.showHorizontalScrollbar);
    setCheckValue("scrollbarMaxAlign", spread.options.scrollbarMaxAlign);
    setCheckValue("scrollbarShowMax", spread.options.scrollbarShowMax);
    setCheckValue("scrollIgnoreHidden", spread.options.scrollIgnoreHidden);

    // TabStrip
    setCheckValue("tabStripVisible", spread.options.tabStripVisible);
    setCheckValue("newTabVisible", spread.options.newTabVisible);
    setCheckValue("tabEditable", spread.options.tabEditable);
    setCheckValue("showTabNavigation", spread.options.tabNavigationVisible);

    // Color
    setColorValue("spreadBackcolor", spread.options.backColor);
    setColorValue("grayAreaBackcolor", spread.options.grayAreaBackColor);

    // Tip
    setDropDown("scrollTip", spread.options.showScrollTip);
    setDropDown("resizeTip", spread.options.showResizeTip);
    setCheckValue("showDragDropTip", spread.options.showDragDropTip);
    setCheckValue("showDragFillTip", spread.options.showDragFillTip);

    // Cut / Copy Indicator
    setCheckValue("cutCopyIndicatorVisible", spread.options.cutCopyIndicatorVisible);
    setColorValue("cutCopyIndicatorBorderColor", spread.options.cutCopyIndicatorBorderColor);

    // Data validation
    ribbon.setToggleButton('circleInvalidData', spread.options.highlightInvalidData);
    ribbon.setCheckboxButton('showSheetTabs', spread.options.tabStripVisible);

    // Custom Lists
    syncDragFillCustomList();
}

function getBuildInCustomList(cultureInfo, buildinlist) {
    var dateTimeFormat = cultureInfo.DateTimeFormat;
    var names, containMonth;
    var buildinKey = ['abbreviatedDayNames', 'dayNames', 'abbreviatedMonthNames', 'monthNames'];
    buildinKey.forEach(function (key) {
        names = dateTimeFormat[key];
        if (names instanceof Array && names.length > 0) {
            containMonth = key.indexOf('month') > -1 || key.indexOf('Month') > -1;
            names = containMonth ? names.slice(0, 12) : names;
            buildinlist.push(names);
        }
    });
    return buildinlist;
}

function syncDragFillCustomList() {
    //get buildin custom lists
    var cm = GC.Spread.Common.CultureManager;
    var buildinlist = [];
    var en = cm.getCultureInfo('en-US'), setting = cm.getCultureInfo();
    getBuildInCustomList(en, buildinlist);
    if (setting && en !== setting) {
        getBuildInCustomList(setting, buildinlist);
    }
    spread._fillBuildinList = buildinlist;
    var list = $("#fill-custom-lists");
    list.empty();
    list.append("<option value='0' selected>" + getResource("spreadTab.customList.newList") + "</option>");
    for (var i = 0; i < buildinlist.length; i++) {
        list.append("<option value='" + (-1 - i) + "'>" + buildinlist[i].toString() + "</option>");
    }

    var customList = spread.options.customList || [];
    spread._fillCustomList = customList;
    for (var i = 0; i < customList.length; i++) {
        list.append("<option value='" + (i + 1) + "'>" + customList[i].toString() + "</option>");
    }
    spread._selectCustomListIndex = 0;
    var viewTxt = $("#fill-custom-list-view");

    viewTxt.val("");
}

function syncSheetPropertyValues() {
    var sheet = spread.getActiveSheet();

    // let colorpicker update theme colors if required
    colorPicker.updateThemeColors(sheet);

    // Grid Line
    var options = sheet.options.gridline;
    ribbon.setCheckboxButton('showGridlines', options.showHorizontalGridline && options.showVerticalGridline);

    // Header
    ribbon.setCheckboxButton('showHeadings', sheet.options.rowHeaderVisible && sheet.options.colHeaderVisible);

    // Protection
    var isProtected = sheet.options.isProtected;

    ribbon.setToggleButton("protectsheet", isProtected);

    updateCellStyleState(sheet, sheet.getActiveRowIndex(), sheet.getActiveColumnIndex());

    if (!$(sheet).data("bind")) {
        $(sheet).data("bind", true);
        sheet.bind(spreadNS.Events.RangeChanged, function (event, args) {
            if (args.action === spreadNS.RangeChangedAction.Clear) {
                // check special type items and switch to cell tab (laze process)
                if (isSpecialTabSelected()) {
                    onCellSelected();
                }
            }
        });

        sheet.bind(spreadNS.Events.CommentRemoved, function (event, args) {
            // check special type items and switch to cell tab (laze process)
            if (isSpecialTabSelected()) {
                onCellSelected();
            }
        });
    }
}

function setNumberValue(name, value) {
    $(".setting-container input[data-name='" + name + "']").val(value);
}

function getNumberValue(name) {
    return +$("input[data-name='" + name + "']").val();
}

function setTextValue(name, value) {
    $(".setting-container input[data-name='" + name + "']").val(value);
}

function getTextValue(name) {
    return $(".setting-container input[data-name='" + name + "']").val();
}

function setCheckValue(name, value, options) {
    var $input = $(".setting-container label[data-name='" + name + "'] input");

    $input.prop('checked', value);

    if (options) {
        $input.data(options);
    }
}

function getCheckValue(name) {
    return $(".setting-container label[data-name='" + name + "']>input").prop('checked');
}

function setColorValue(name, value) {
    $("div[data-name='" + name + "'] div.color-picker").css("background-color", value || "");
}

function processDropDownClicked(name, numberValue, value, nameValue, $element, $group) {
    switch (name) {
        case "scrollTip":
            spread.options.showScrollTip = numberValue;
            break;

        case "resizeTip":
            spread.options.showResizeTip = numberValue;
            break;

        case "selectionPolicy":
            sheet.selectionPolicy(numberValue);
            break;

        case "selectionUnit":
            sheet.selectionUnit(numberValue);
            break;

        case "sheetName":
            var selectedSheet = spread.sheets[numberValue];
            setCheckValue("sheetVisible", selectedSheet.visible(), {
                sheetIndex: numberValue,
                sheetName: selectedSheet.name()
            });
            break;

        case "commentFontFamily":
            _activeComment.fontFamily(value);
            break;

        case "commentFontSize":
            value += "pt";
            _activeComment.fontSize(value);
            break;

        case "commentDisplayMode":
            _activeComment.displayMode(numberValue);
            break;

        case "commentFontStyle":
            _activeComment.fontStyle(nameValue);
            break;

        case "commentFontWeight":
            _activeComment.fontWeight(nameValue);
            break;

        case "commentBorderStyle":
            _activeComment.borderStyle(nameValue);
            break;

        case "commentHorizontalAlign":
            _activeComment.horizontalAlign(numberValue);
            break;

        case "zoomSpread":
            processZoomSetting(nameValue, value);
            break;

        case "commonFormat":
            if (nameValue === "custom") {
                _customFormatInput.focus();
            } else {
                var formatter = nameValue === 'nullValue' ? null : nameValue;
                Actions.setCellFormat(spread, {name: name, value: formatter});
                _customFormatInput.val(formatter || '');
            }
            break;

        case "minAxisType":
            updateManual(nameValue, "manualMin");
            break;

        case "maxAxisType":
            updateManual(nameValue, "manualMax");
            break;

        case "slicerItemSorting":
            processSlicerItemSorting(numberValue);
            break;

        case "spreadTheme":
            processChangeSpreadTheme(nameValue);
            break;

        case "resizeZeroIndicator":
            spread.resizeZeroIndicator(numberValue);
            break;

        case "printHeader":
            updatePreview({header: $element.data("sections")});
            break;

        case "printFooter":
            updatePreview({footer: $element.data("sections")});
            break;

        case "image-content":
            if (!app.isInit) {
                if (!$element.data("value")) {
                    // clear data to avoid wrong result if user canceled
                    $group.data("value", null);

                    // browse to add image
                    $("#fileSelector").data("action", "addPrintImage");
                    $("#fileSelector").attr("accept", "image/*");
                    $("#fileSelector").click();
                }
            }
            break;
/*
        case "waterMark-content":
            if (!app.isInit) {
                if (!$element.data("value")) {
                    // clear data to avoid wrong result if user canceled
                    $group.data("value", null);

                    // browse to add image
                    $("#fileSelector").data("action", "addWaterMark");
                    $("#fileSelector").attr("accept", "image/*");
                    $("#fileSelector").click();
                }
            }
            break;*/

        case "sparklineExType":
            processSparklineSetting(nameValue);
            break;

        case "barCodeExType":
            processBarCodeSetting(nameValue);
            break;

        case "validatorType":
            processDataValidationSetting(nameValue);
            break;

        case "dateValidatorComparisonOperator": 
            processdataValidatorComparisonOperatorSetting(nameValue);
            break;
        case "numberValidatorComparisonOperator":
            processnumberValidatorComparisonOperatorSetting(nameValue);
            break;
        case "textLengthValidatorComparisonOperator":
            processtexeLengthValidatorComparisonOperatorSetting(nameValue);
            break;

        case "highlightType":
            showHighlightSetting(nameValue);
            break;

        default:
            console.log("TODO add processDropDownClicked for ", name, value);
            break;
    }
}

function processtexeLengthValidatorComparisonOperatorSetting(nameValue){
    switch(nameValue) {
        case 6:
        case 7:{
            $("#textLengthValue").hide();
            $("#textLengthBetweenOperator").show();
            break;
        }
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:{
            $("#textLengthValue").show();
            $("#textLengthBetweenOperator").hide();
            break;
        }
    }
}

function processdataValidatorComparisonOperatorSetting(nameValue){
    switch(nameValue) {
        case 6:
        case 7:{
            $("#dateValue").hide();
            $("#dateBetweenOperator").show();
            break;
        }
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:{
            $("#dateValue").show();
            $("#dateBetweenOperator").hide();
            break;
        }
    }
}

function processnumberValidatorComparisonOperatorSetting(nameValue){
    switch(nameValue) {
        case 6:
        case 7:{
            $("#numberValue").hide();
            $("#numberBetweenOperator").show();
            break;
        }
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:{
            $("#numberValue").show();
            $("#numberBetweenOperator").hide();
            break;
        }
    }
}

function showHighlightSetting(nameValue) {
    switch (nameValue) {
        case 0:
            $("#dogearPositionLabel").hide();
            $("#dogearPositionList").hide();
            $("#iconPositionLabel").hide();
            $("#iconPositionList").hide();
            $("#datavalidationSelectFile").hide();

            break;
        case 1:
            $("#dogearPositionLabel").show();
            $("#dogearPositionList").show();
            $("#iconPositionLabel").hide();
            $("#iconPositionList").hide();
            $("#datavalidationSelectFile").hide();
            break;
        case 2:
            $("#dogearPositionLabel").hide();
            $("#dogearPositionList").hide();
            $("#iconPositionLabel").show();
            $("#iconPositionList").show();
            $("#datavalidationSelectFile").show();
            break;
        default:
            break;
    }

}

function getDropDownValue(name) {
    var value = $("div[data-name='" + name + "']").data("value");

    /*jshint eqnull:true */
    if (value == null) {
        console.log('get dropdown value null / undefined', name);
    }

    return value;
}

function colorSelected(event, eventData) {
    var themeColor = eventData.themeColor,
        value = eventData.color,
        type = eventData.type;

    var data = $(colorPicker).data(),
        name = data.name,
        $target = data.target;

    var sheet = spread.getActiveSheet();

    // No Fills need special process
    if (name === "backColor" && type === "nofill") {
        value = undefined;
    }

    if ($target) {
        $target.css("background-color", value);
        // save to help selected corresponding color in color picker
        $target.data('themeColor', themeColor);
    }

    spread.suspendPaint();
    switch (name) {
        case "spreadBackcolor":
            spread.options.backColor = value;
            break;

        case "grayAreaBackcolor":
            spread.options.grayAreaBackColor = value;
            break;

        case "cutCopyIndicatorBorderColor":
            spread.options.cutCopyIndicatorBorderColor = value;
            break;

        case "foreColor":
            Actions.setForeColor(spread, themeColor || value);

            // save to cache for reuse by quick set with one-click
            settingCache[name] = themeColor || value;
            break;

        case "backColor":
            Actions.setBackColor(spread, themeColor || value);

            // save to cache for reuse by quick set with one-click
            settingCache[name] = themeColor || value;
            break;

        case "commentBorderColor":
            _activeComment.borderColor(value);
            break;

        case "commentForeColor":
            _activeComment.foreColor(value);
            break;

        case "commentBackColor":
            _activeComment.backColor(value);
            break;

        case "shapeFillColor":
        case "shapeOutlineColor":
            // todo ~~~
            setShapeColor(ShapeHelper.getSelectedShapes(sheet), value, name);
            break;
        default:
            if (!$target) {
                console.log("TODO colorSelected", name);
            }
            break;
    }
    spread.resumePaint();

    colorPicker.hide();
    var $dropdown = data.dropdown;
    if ($dropdown) {
        $dropdown.removeClass('open');
        $dropdown.parents("div.dropdown.open").data("keepopen", false);
    }
}

/**
 * set shape colors
 * @param {array} shapes shapes
 * @param {string} color color value
 * @param {string} type shapeFillColor or shapeOutlineColor
 */
function setShapeColor(shapes, color, type) {
    shapes.forEach(function(shape){
        var shapeType = ShapeHelper.getShapeType(shape);
        if( shapeType === 'shapeGroup') {
            setShapeColor(shape.all(), color, type);
        } else {
            var style = shape.style();
            if(type === "shapeFillColor" && style.fill && style.fill.color ) {
                style.fill.color = color;
            } else if(type === "shapeOutlineColor") {
                style.line.color = color;
            }
            shape.style(style);
        }
    });
}

function sortData(sheet, ascending) {
    var sels = sheet.getSelections();
    var rowCount = sheet.getRowCount(),
        columnCount = sheet.getColumnCount();

    for (var n = 0; n < sels.length; n++) {
        var sel = getActualCellRange(sels[n], rowCount, columnCount);
        sheet.sortRange(sel.row, sel.col, sel.rowCount, sel.colCount, true,
            [
                {index: sel.col, ascending: ascending}
            ]);
    }
}

function updateFilter(sheet) {
    if (sheet.rowFilter()) {
        sheet.rowFilter(null);
    } else {
        var sels = sheet.getSelections();
        if (sels.length > 0) {
            var sel = sels[0];
            sheet.rowFilter(new spreadNS.Filter.HideRowFilter(sel));
        }
    }
}

function addGroup(sheet) {
    var sels = sheet.getSelections();
    var sel = sels[0];

    if (!sel) return;

    if (sel.col === -1) // row selection
    {
        Actions.groupRows(spread, {value: sel});
    }
    else if (sel.row === -1) // column selection
    {
        Actions.groupColumns(spread, {value: sel})
    }
    else // cell range selection
    {
        alert(getResource("messages.rowColumnRangeRequired"));
    }
}

function removeGroup(sheet) {
    var sels = sheet.getSelections();
    var sel = sels[0];

    if (!sel) return;

    if (sel.col === -1 && sel.row === -1) // sheet selection
    {
        // sheet.rowRangeGroup.ungroup(0, sheet.getRowCount());
        // sheet.colRangeGroup.ungroup(0, sheet.getColumnCount());
        sheet.outlines.ungroup();
    }
    else if (sel.col === -1) // row selection
    {
        // var groupExtent = new GC.Spread.Sheets.UndoRedo.GroupExtent(sel.row, sel.rowCount);
        // var action = new GC.Spread.Sheets.UndoRedo.RowUngroupUndoAction(sheet, groupExtent);
        // spread.doCommand(action);
        Actions.ungroupRows(spread, {value: sel});
    }
    else if (sel.row === -1) // column selection
    {
        // var groupExtent = new GC.Spread.Sheets.UndoRedo.GroupExtent(sel.col, sel.colCount);
        // var action = new GC.Spread.Sheets.UndoRedo.ColumnUngroupUndoAction(sheet, groupExtent);
        // spread.doCommand(action);
        Actions.ungroupColumns(spread, {value: sel});
    }
    else // cell range selection
    {
        alert(getResource("messages.rowColumnRangeRequired"));
    }
}

function convertRichText2HTML(richTextObj, $container) {
    var textDecorationType = GC.Spread.Sheets.TextDecorationType;
    var vertAlign = GC.Spread.Sheets.VertAlign;
    var texts = richTextObj.richText;
    var placeholder = '%placeholder%';

    var _innerElement = function (_htmlStr, eleName, style) {
        style = style ? ' ' + style : '';
        var eleHtml = '<' + eleName + style + '>' + placeholder + '<' + eleName + '/>'
        return _htmlStr.replace(placeholder, eleHtml);
    }

    texts.forEach(function (text) {
        var ele = document.createElement('span');
        var $ele = $(ele)[0];
        var eleStyle = text.style;
        $ele.style.color = eleStyle.color || eleStyle.foreColor || $ele.style.color;
        $ele.style.font = eleStyle.font || $ele.style.font;
        var fontValues = eleStyle.font.split(' ');
        var fontSize = 0;
        fontValues.some(function(_fValue) {
            if(_fValue.indexOf('px') >= 0) {
                fontSize = parseFloat(_fValue.substring(0, _fValue.indexOf('px')));
                return true;
            } else {
                return false;
            }
        });

        var htmlStr = placeholder;
        if (eleStyle.textDecoration === textDecorationType.underline) {
            htmlStr = _innerElement(htmlStr, 'u');
        }
        if (eleStyle.textDecoration === textDecorationType.lineThrough) {
            htmlStr = _innerElement(htmlStr, 'strike');
        }
        if (eleStyle.textDecoration === 3) {
            htmlStr = _innerElement(htmlStr, 'u');
            htmlStr = _innerElement(htmlStr, 'strike');
        }
        if (eleStyle.vertAlign === vertAlign.subscript) {
            var originFontsize = fontSize / 0.75;
            htmlStr = _innerElement(htmlStr, 'span', 'style="font-size:' + originFontsize + 'px"');
            htmlStr = _innerElement(htmlStr, 'sub');
        } else if (eleStyle.vertAlign === vertAlign.superscript) {
            var originFontsize = fontSize / 0.75;
            htmlStr = _innerElement(htmlStr, 'span', 'style="font-size:' + originFontsize + 'px"');
            htmlStr = _innerElement(htmlStr, 'sup');
        }
        htmlStr = htmlStr.replace(placeholder, text.text);
        $ele.innerHTML = htmlStr;
        $container.append($ele);
    });
}

function showModal(title, width, content, callback) {
    var sheet = spread.getActiveSheet(),
        row = sheet.getActiveRowIndex(),
        col = sheet.getActiveColumnIndex();
    if(content && content.prevObject && content.prevObject.selector === '#richtextdialog') {
        var container = $(".rich-editor-content")[0];
        var $container = $(container)
        $container.text('');
        var richTextObj = sheet.getValue(row, col, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.ValueType.richText);
        var ele, $ele;
        if(richTextObj && richTextObj.text) {
            convertRichText2HTML(richTextObj, $container);
        } else if (richTextObj) {
            ele = document.createElement('span');
            $ele = $(ele)[0];
            $ele.innerText = richTextObj;
            $container.append($ele);
        }
    }

    var $dialog = $("#modalTemplate"),
        $body = $(".modal-body", $dialog);

    $(".modal-title", $dialog).text(title);
    $dialog.data("content-parent", content.parent());
    $body.append(content);
    // remove old and add new event handler since this modal is common used (reused)
    $("#dialogConfirm").off("click");
    $("#dialogConfirm").on("click", function () {
        var result = callback();

        // return an object with  { canceled: true } to tell not close the modal, otherwise close the modal
        if (!(result && result.canceled)) {
            $("#modalTemplate").modal("hide");
        }
    });

    if (!$dialog.data("event-attached")) {
        $dialog.on("hidden.bs.modal", function () {
            var $originalParent = $(this).data("content-parent");
            if ($originalParent) {
                $originalParent.append($(".modal-body", this).children());
            }
        });
        $dialog.data("event-attached", true);
    }

    // set width of the dialog
    $(".modal-dialog", $dialog).css({width: width});

    $dialog.modal("show");
}

function addMenu(){
    if (isMenuItemExist(spread.contextMenu.menuData, "editRichText")) {
        spread.contextMenu.menuData.forEach(function (item, index) {
            if (item && item.name === "editRichText") {
                spread.contextMenu.menuData.splice(index, 1);
            }
        });
        return;
    }
    var commandManager = spread.commandManager();
    var editRichTextInfo = {
        text: "Edit Rich Text",
        name: "editRichText",
        workArea: "viewport",
        command: "editRichText"
    };
    spread.contextMenu.menuData.push(editRichTextInfo);
    var editRichTextCommand = {
        canUndo: false,
        execute: function (spread, options) {
            var RICHTEXT_DIALOG_WIDTH = 500;
            showModal(uiResource.richTextDialog.editRichText, RICHTEXT_DIALOG_WIDTH, $("#richtextdialog").children(), addRichTextEvent);
        }
    };
    commandManager.register("editRichText", editRichTextCommand, null, false, false, false, false);
    function CustomMenuView() {
    }

    CustomMenuView.prototype = new GC.Spread.Sheets.ContextMenu.MenuView();
    spread.contextMenu.menuView = new CustomMenuView();
}

function isMenuItemExist(menuData, menuItemName) {
    var i = 0, count = menuData.length;
    for (; i < count; i++) {
        if (menuItemName === menuData[i].name) {
            return true;
        }
    }
}

function addRichTextEvent() {
    var spread = $("#ss").data("workbook");
    var sheet = spread.getActiveSheet();
    var richText = getRichText();
    if (richText.length > 0) {
        sheet.setValue(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex(), {
            richText: richText
        });
    }
}

function toggleGroupDetail(expand) {
    if (expand) {
        Actions.expandGroup(spread);
    } else {
        Actions.collapseGroup(spread);
    }


    // var sels = sheet.getSelections();
    // var sel = sels[0];
    //
    // if (!sel) return;
    //
    // if (sel.col === -1 && sel.row === -1) // sheet selection
    // {
    //     sheet.rowOutlines.ungroup();
    //     sheet.columnOutlines.ungroup();
    // }
    // else if (sel.col === -1) // row selection
    // {
    //     for (var i = 0; i < sel.rowCount; i++) {
    //         var rgi = sheet.outline.find(sel.row + i, 0);
    //         if (rgi) {
    //             sheet.outline.expand(rgi.level, expand);
    //         }
    //     }
    // }
    // else if (sel.row === -1) // column selection
    // {
    //     for (var i = 0; i < sel.colCount; i++) {
    //         var rgi = sheet.outline.find(sel.col + i, 0);
    //         if (rgi) {
    //             sheet.outline.expand(rgi.level, expand);
    //         }
    //     }
    // }
    // else // cell range selection
    // {
    //
    // }
}

var MARGIN_BOTTOM = 4;

function adjustSpreadSize() {
    var height = $("#inner-content-container").height() - ($("#formulaBar:visible").length > 0 ? $("#formulaBar").height() : 0) - MARGIN_BOTTOM,
        spreadHeight = $("#ss").height(),
        statusBarHeight = $("#statusBar").height();

    if (spreadHeight !== height - statusBarHeight) {
        $("#controlPanel").height(height - statusBarHeight);
        $("#ss").height(height - statusBarHeight);
        // $("#ss").data("spread").refresh();
        $("#ss").data("workbook").refresh();
    }
}

function screenAdoption() {
    function adjustSettingPaneContentHeight() {
        var $container = $("#setting-pane");
        var height = $container.innerHeight() - $('.pane-header', $container).outerHeight();

        $('.pane-content').outerHeight(height);
    }

    function setTableStyleDropdownWidth() {
        var width = $("#inner-content-container").width();

        // set drop down width to make sure 7 or 6 style items shown one row
        $tableStyleDropdown.css({width: width > 640 ? '510px' : '444px'});
    }

    // close popup
    $(".dropdown-menu:visible").parent().removeClass('open');
    $("#colorpicker").hide();

    adjustSpreadSize();

    // explicit set formula box' width instead of 100% because it's contained in table
    var width = $("#inner-content-container").width() - $("#positionbox").outerWidth() - 1; // 1: border' width of td contains formulabox (left only)
    $("#formulabox").css({width: width});

    ribbon.resize();

    setTableStyleDropdownWidth();

    //adjustSettingPaneContentHeight();
}

function doPrepareWork() {
    function addEventHandlers() {
        $("div.pane-group-title").click(toggleGroupDisplay);
        $(document).on("colorSelected", colorSelected);
    }

    addEventHandlers();

    $("input[type='number']:not('.not-min-zero')").attr("min", 0);
    $("input[data-name='commentOpacity']").attr("max", 100);

    // set default values
    var value = "anyvalue-validator";
    setDropDown("validatorType", value);
    processDataValidationSetting(value);         // Data Validation Setting
    //value = GC.Spread.Sheets.ComparisonOperator.Between;
    //value = GC.Spread.Sheets.DataValidation.comparisonOperator(6);
    value = GC.Spread.Sheets.ConditionalFormatting.ComparisonOperators.between;
    setDropDown("numberValidatorComparisonOperator", value);        // NumberValidator Comparison Operator
    processNumberValidatorComparisonOperatorSetting(value);
    setDropDown("dateValidatorComparisonOperator", value);          // DateValidator Comparison Operator
    processDateValidatorComparisonOperatorSetting(value);
    setDropDown("textLengthValidatorComparisonOperator", value);    // TextLengthValidator Comparison Operator
    processTextLengthValidatorComparisonOperatorSetting(value);

    conditionalFormatTexts = uiResource.conditionalFormat.texts;
}

function initSpread() {
    // $.get("files/excel-demo-intro.json", function (data) {
    //         importSpreadFromJSON(null, data);
    //
    //         //Change default allowCellOverflow the same with Excel.
    //         spread.sheets.forEach(function (sheet) {
    //             // sheet.allowCellOverflow(true);
    //             sheet.options.allowCellOverFlow = true;
    //         });
    //     },
    //     "text"  /* dataType, the file is spread export format (ssjson, renamed to .json to avoid server not support access .ssjson file) */);
    var sheet = spread.getActiveSheet();
    var statusBar = new GC.Spread.Sheets.StatusBar.StatusBar(
        document.getElementById('statusBar')
    );
    statusBar.bind(spread);
    sheet.name("Welcome");
    sheet.suspendPaint();
    sheet.addSpan(1, 1, 1, 12);
    sheet.addSpan(2, 1, 1, 12);
    sheet.addSpan(4, 1, 1, 12);
    sheet.addSpan(5, 1, 1, 12);
    sheet.addSpan(6, 1, 1, 12);
    sheet.setRowHeight(1, 36);
    sheet.setRowHeight(2, 64);
    sheet.setRowHeight(3, 25);
    sheet.setRowHeight(4, 40);
    sheet.setValue(1, 1, "About This Application");
    var border = new GC.Spread.Sheets.LineBorder("rgb(0,0,0)", 5);
    sheet.getRange(1, 1, 1, 12).borderBottom(border).foreColor("Text 1").hAlign(0).font("29.3333px Calibri");
    sheet.setValue(2, 1, "This is a web application built with the GrapeCity SpreadJS JavaScript Spreadsheet component. It mimics much of the functionality and UI you see in with Microsoft Windows Store Excel application. This application was built to showcase the features and extensibility you will find in SpreadJS");
    sheet.getRange(2, 1, 1, 12).hAlign(0).vAlign(2).wordWrap(true);
    sheet.setValue(4, 1, "Using This Application");
    sheet.getRange(4, 1, 1, 12).borderBottom(border).foreColor("Text 1").hAlign(0).font("29.3333px Calibri");
    sheet.setValue(5, 1, "- You can create a new workbook by choosing \"New\" from the file menu.");
    sheet.setValue(6, 1, "- This application will save and load .SSJSON or .XLSX files which are readable by SpreadJS");
    sheet.resumePaint()
    syncSpreadPropertyValues()
}

function getCellInfo(sheet, row, column) {
    var result = {type: ""}, object;
    if ((object = sheet.comments.get(row, column))) {
        result.type = "comment";
    } else if ((object = sheet.tables.find(row, column))) {
        result.type = "table";
    } else if ((object = ChartHelper.getSelectedChart(sheet))) {
        result.type = "chart"
    } else {
        var shapes = ShapeHelper.getSelectedShapes(sheet);
        if (shapes.length === 1) {
            object = shapes[0];
            result.type = "shape";
        } else if (shapes.length > 1) {
            result.type = "shapes";
            object = shapes;
        }
    }
    result.object = object;

    return result;
}

var specialTabNames = ["table", "chart", "shape"];
var specialTabRefs = specialTabNames.map(function (name) {
    return "#" + name;
});
var $specialTabs;

function isSpecialTabSelected() {
    var href = $(".toolbar>ul>li.active a").attr("href");

    return specialTabRefs.indexOf(href) !== -1;
}

function getSpecialTabs() {
    $specialTabs = $specialTabs || $(".toolbar>ul>li").filter(function () {
            return specialTabRefs.indexOf($('a', this).attr('href')) !== -1;
        });

    return $specialTabs;
}

function getSpecialDropdownItems() {
    return $("#tabDropdown li").filter(function () {
        return specialTabRefs.indexOf($('a', this).attr('data-href')) !== -1;
    });
}

function getVisibleSpecialItems() {
    var result = [];

    result.push(getSpecialTabs().filter(function () {
        return $(this).is(":visible");
    }));
    result.push(getSpecialDropdownItems());

    return result;
}

function getTabItem(tabName) {
    return $(".toolbar>ul>li>a[href='#" + tabName + "']").parent();
}

function getActiveChart() {
    var sheet = spread.getActiveSheet();
    var activeChart = null;
    sheet.charts.all().forEach(function (chart) {
        if (chart.isSelected()) {
            activeChart = chart;
        }
    });
    return activeChart;
}

function setActiveTab(tabName, needProcessSpecialItems) {
    //TODO, rename and don't call it if not required
    if (needProcessSpecialItems === undefined) {
        return;
    }

    // show / hide tabs
    var $target = getTabItem(tabName);
    if (specialTabNames.indexOf(tabName) >= 0) {
        if ($target.hasClass("hidden")) {
            hideSpecialTabs(false);

            ribbon.showTab($target, true);
            if(tabName === "chart") {
                var chart = getActiveChart();
                var chartGroup = ChartHelper.getChartGroupString(chart.chartType());
                if(chartGroup === "TreeGroup"){
                    $("#chart>div").hide();
                    $("#chart>div:nth-child(3)").show();
                    $("#chart>div:nth-child(4)").show();
                } else if(chartGroup === "RadarGroup") {
                    $("#chart>div").show();
                    $("#chart>div:nth-child(2)").hide();
                } else if(chartGroup === "ComboGroup") {
                    $("#chart>div").show();
                    $("#chart>div:nth-child(1)").hide();
                    $("#chart>div:nth-child(2)").hide();
                } else {
                    $("#chart>div").show();
                }
            }
        }
    } else {
        var $active = $(".toolbar>ul>li.active");
        if (isSpecialTabSelected()) {
            ribbon.hideTab([$active], true, $target);
        } else {
            if (needProcessSpecialItems) {
                var $items = getVisibleSpecialItems();
                ribbon.hideTab($items, true);
            }
        }
        var oldComment = _activeComment;
        hideSpecialTabs(true);
        if (tabName == "comment") {
            _activeComment = oldComment;
        }
    }
}

// TODO: update according the requirement, current only table need process with
function shouldProcessSpecialTab() {
    /*jshint eqnull:true */
    return _activeTable != null;
}


function hideSpecialTabs(clearCache) {
    specialTabNames.forEach(function (name) {
        getTabItem(name).addClass("hidden");
    });

    if (clearCache) {
        clearCachedItems();
    }
}

function getActualRange(range, maxRowCount, maxColCount) {
    var row = range.row < 0 ? 0 : range.row;
    var col = range.col < 0 ? 0 : range.col;
    var rowCount = range.rowCount < 0 ? maxRowCount : range.rowCount;
    var colCount = range.colCount < 0 ? maxColCount : range.colCount;

    return new spreadNS.Range(row, col, rowCount, colCount);
}

function getActualCellRange(cellRange, rowCount, columnCount) {
    if (cellRange.row === -1 && cellRange.col === -1) {
        return new spreadNS.Range(0, 0, rowCount, columnCount);
    }
    else if (cellRange.row === -1) {
        return new spreadNS.Range(0, cellRange.col, rowCount, cellRange.colCount);
    }
    else if (cellRange.col === -1) {
        return new spreadNS.Range(cellRange.row, 0, cellRange.rowCount, columnCount);
    }

    return cellRange;
}

function attachEvents() {
    attachSpreadEvents();
    attachDataValidationEvents();
    attachOtherEvents();
    attachCellTypeEvents();
    attachSparklineSettingEvents();
    attachFindEvents();
    attachSettingPaneEvents();

    $(document).on('click', "li.item label", function (e) {
        // avoid dropdown to be closed when click
        e.stopPropagation();
    });

    var $positionbox = $("#positionbox");
    var insertFormulaTitle = $("#formulas button[data-name=insertFormula]").data("header");
    $positionbox.click(function (e) {
        displaySettingPane(insertFormulaTitle, $('#functionBuiilder'));
    });

    $("#borderSetting .border-line-style ul.dropdown-menu>li").on('click', function () {
        var $li = $(this),
            value = $li.attr('data-value'),
            $target = $('>button>span:first', $li.parents('div.btn-group'));

        if (value === 'none') {
            $target.text($li.text());
        } else {
            $target.text('');
        }
        $target.removeClass().addClass(($('>a>div', $li).attr('class') || '') + ' border-line-style ');
        $li.siblings('.selected').removeClass('selected');
        $li.addClass('selected');
    });

    $("#borderSetting .border-type-item").on('click', function () {
        var borderType = $(this).data("name");
        setCellsBorder(borderType);
    });

    // used to avoid dropdown been closed by default
    // $("#tableStyles").click(ignoreEvent);

    $(document).on('click', ".pane-color-picker>button", function () {
        if (colorPicker.isVisible()) {
            colorPicker.hide();
            return;
        }

        if ($colorPickerContainer.parent()[0] !== document.body) {
            $colorPickerContainer.appendTo($(document.body));
        }

        var $this = $(this),
            name = $this.parents('div.btn-group').attr('data-name'),
            $target = $('.color-picker', $this);
        $(colorPicker).data({name: name, target: $target});

        var offset, position;
        var $settingPane = $('#setting-pane');
        if ($.contains($settingPane[0], this)) {
            offset = $settingPane.offset();
            position = {left: offset.left - $('#colorPicker').innerWidth(), top: offset.top};
        } else {
            offset = $this.offset();
            // TODO: adjust position to avoid out of screen
            position = {
                left: offset.left + $this.outerWidth() + 20,
                top: offset.top - ( $('#colorPicker').height() - $this.outerHeight() ) / 2
            };
        }

        colorPicker.show(position, {}, $target.data('themeColor') || $target.css("background-color"));
    });
}

// Border Type related items
function getBorderLineType(className) {
    switch (className) {
        case "line-style-none":
            return GC.Spread.Sheets.LineStyle.empty;

        case "line-style-hair":
            return GC.Spread.Sheets.LineStyle.hair;

        case "line-style-dotted":
            return GC.Spread.Sheets.LineStyle.dotted;

        case "line-style-dash-dot-dot":
            return GC.Spread.Sheets.LineStyle.dashDotDot;

        case "line-style-dash-dot":
            return GC.Spread.Sheets.LineStyle.dashDot;

        case "line-style-dashed":
            return GC.Spread.Sheets.LineStyle.dashed;

        case "line-style-thin":
            return GC.Spread.Sheets.LineStyle.thin;

        case "line-style-medium-dash-dot-dot":
            return GC.Spread.Sheets.LineStyle.mediumDashDotDot;

        case "line-style-slanted-dash-dot":
            return GC.Spread.Sheets.LineStyle.slantedDashDot;

        case "line-style-medium-dash-dot":
            return GC.Spread.Sheets.LineStyle.mediumDashDot;

        case "line-style-medium-dashed":
            return GC.Spread.Sheets.LineStyle.mediumDashed;

        case "line-style-medium":
            return GC.Spread.Sheets.LineStyle.medium;

        case "line-style-thick":
            return GC.Spread.Sheets.LineStyle.thick;

        case "line-style-double":
            return GC.Spread.Sheets.LineStyle.double;
    }
}
// Border Type related items (end)

function attachOtherEvents() {
    $("div.table-format-item").click(changeTableStyle);
    $("div.slicer-format-item").click(changeSlicerStyle);
    $("#fileSelector").change(processFileSelected);
}

function processFileSelected() {
    var file = this.files[0],
        action = $(this).data("action");

    if (!file) return false;

    // clear to make sure change event occures even when same file selected again
    $("#fileSelector").val("");
    $("#fileSelector").attr("accept", null);

    if (action === "doImport") {
        return importFile(file);
    }

    if (!/image\/\w+/.test(file.type)) {
        alert(getResource("messages.imageFileRequired"));
        return false;
    }
    var reader = new FileReader();
    reader.onload = function () {
        switch (action) {
            case "addpicture":
                Actions.insertPicture(spread, {name: "Picture" + pictureIndex++, url: this.result});
                break;

            case "addPrintImage":
                var name = file.name, dataUrl = this.result;

                addUploadedImage(name, dataUrl);

                addImageListItem(name);

                console.log("addPrintImage ....", file.name);
                break;

            case "addWaterMark":
                var name = file.name, dataUrl = this.result;
                app.uploadWaterMark = {name: name, url: dataUrl};
                $(".insertWaterMark").val(file.name);
                $("#removeWaterMark").removeClass("hidden");
                console.log("addPrintImage ....", file.name);
                break;
        }
    };
    reader.readAsDataURL(file);
}

function addUploadedImage(name, dataUrl) {
    if (!app.uploadImages) {
        app.uploadImages = {};
    }
    app.uploadImages[name] = dataUrl;
}

function addImageListItem(name) {
    var $li = $("<li></li>"), $a = $("<a></a>");

    $a.text(name).data({value: name}).appendTo($li);

    $("#imageContentList").append($li);
    $a.click();
}

function updatePositionBox(sheet) {
    var selection = sheet.getSelections().slice(-1)[0];
    if (selection) {
        var position;
        if (!isShiftKey) {
            position = getCellPositionString(sheet,
                sheet.getActiveRowIndex() + 1,
                sheet.getActiveColumnIndex() + 1, selection);
        }
        else {
            position = getSelectedRangeString(sheet, selection);
        }

        $("#positionbox").text(position);
    }
}

function syncCellRelatedItems() {
    updateMergeState();

    // sync cell type related information
    syncCellTypeInfo();
}

function syncCellTypeInfo() {
    function updateButtonCellTypeInfo(cellType) {
        setNumberValue("buttonCellTypeMarginTop", cellType.marginTop());
        setNumberValue("buttonCellTypeMarginRight", cellType.marginRight());
        setNumberValue("buttonCellTypeMarginBottom", cellType.marginBottom());
        setNumberValue("buttonCellTypeMarginLeft", cellType.marginLeft());
        setTextValue("buttonCellTypeText", cellType.text());
        setColorValue("buttonCellTypeBackColor", cellType.buttonBackColor());
    }

    function updateCheckBoxCellTypeInfo(cellType) {
        setTextValue("checkboxCellTypeCaption", cellType.caption());
        setTextValue("checkboxCellTypeTextTrue", cellType.textTrue());
        setTextValue("checkboxCellTypeTextIndeterminate", cellType.textIndeterminate());
        setTextValue("checkboxCellTypeTextFalse", cellType.textFalse());
        setDropDown("checkboxCellTypeTextAlign", cellType.textAlign());
        setCheckValue("checkboxCellTypeIsThreeState", cellType.isThreeState());
    }

    function updateComboBoxCellTypeInfo(cellType) {
        setDropDown("comboboxCellTypeEditorValueType", cellType.editorValueType());
        var items = cellType.items(),
            texts = items.map(function (item) {
                return item.text || item;
            }).join(","),
            values = items.map(function (item) {
                return item.value || item;
            }).join(",");

        setTextValue("comboboxCellTypeItemsText", texts);
        setTextValue("comboboxCellTypeItemsValue", values);
    }

    function updateHyperLinkCellTypeInfo(cellType) {
        setColorValue("hyperlinkCellTypeLinkColor", cellType.linkColor());
        setColorValue("hyperlinkCellTypeVisitedLinkColor", cellType.visitedLinkColor());
        setTextValue("hyperlinkCellTypeText", cellType.text());
        setTextValue("hyperlinkCellTypeLinkToolTip", cellType.linkToolTip());
    }

    var sheet = spread.getActiveSheet(),
        index,
        cellType = sheet.getCell(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex()).cellType();

    if (cellType instanceof spreadNS.CellTypes.Button) {
        index = 0;
        updateButtonCellTypeInfo(cellType);
    } else if (cellType instanceof spreadNS.CellTypes.CheckBox) {
        index = 1;
        updateCheckBoxCellTypeInfo(cellType);
    } else if (cellType instanceof spreadNS.CellTypes.ComboBox) {
        index = 2;
        updateComboBoxCellTypeInfo(cellType);
    } else if (cellType instanceof spreadNS.CellTypes.HyperLink) {
        index = 3;
        updateHyperLinkCellTypeInfo(cellType);
    } else {
        index = -1;
    }

    if (index >= 0) {
        var $groups = $('#cellTypeSetting .group-celltype');
        $groups.addClass('hidden');
        $($groups[index]).removeClass('hidden');

        var title = $('div[data-name="celltype"] ul.dropdown-menu>li:eq(' + index + ')>a').text();

        displaySettingPane(title, $('#cellTypeSetting'));
    }
}

function onCellSelected() {
    var sheet = spread.getActiveSheet(),
        row = sheet.getActiveRowIndex(),
        column = sheet.getActiveColumnIndex();
    if (showSparklineSetting(row, column)) {
        displaySettingPane(uiResource.sparklineDialog.detail, $("#sparklineDetailSetting"));
        return;
    }else if(showBarCodeSetting(row, column)){
        displaySettingPane(uiResource.barCodeDialog.detail, $("#barCodeDetailSetting"));
        return;
    }
    var cellInfo = getCellInfo(sheet, row, column),
        cellType = cellInfo.type;

    syncCellRelatedItems();
    updatePositionBox(sheet);
    updateCellStyleState(sheet, row, column);

    var tabType = "home";

    // check with special tab before clear cache which it depends on
    var needProcessSpecialItems = shouldProcessSpecialTab();
    clearCachedItems();

    // add map from cell type to tab type here
    if (cellType === "table") {
        tabType = "table";
        syncTablePropertyValues(sheet, cellInfo.object);
        //$("#addslicer").removeClass("hidden");
    } else if (cellType === "comment") {
        tabType = "comment";
        syncCommentPropertyValues(sheet, cellInfo.object);
    } else if (cellType === "chart") {
        tabType = "chart";
    } else if (cellType === "shape") {
        tabType = "shape";
    } else if (cellType === "shapes") {
        tabType = "shape";
    }
    setActiveTab(tabType, needProcessSpecialItems);
    if(cellType === "shape") {
        if(ShapeHelper.getShapeType(cellInfo.object) === "shapeGroup") {
            $("#shape .shape-group").parent().show()
            $("#shape .shape-group+label").text('Ungroup');
            $('#shape .shape-group').css('backgroundImage','url(css/images/ungroup.png)');
        } else {
            $("#shape .shape-group").parent().hide();
        }
    } else {
        $("#shape .shape-group").parent().show()
        $("#shape .shape-group+label").text('Group')
        $('#shape .shape-group').css('backgroundImage','url(css/images/group.png)');
    }
}

var _activeComment;

function syncCommentPropertyValues(sheet, comment) {
    _activeComment = comment;
    // General
    setCheckValue("commentDynamicSize", comment.dynamicSize());
    setCheckValue("commentDynamicMove", comment.dynamicMove());
    setCheckValue("commentLockText", comment.lockText());
    setCheckValue("commentShowShadow", comment.showShadow());

    // Font
    setDropDown("commentFontFamily", comment.fontFamily());
    setDropDown("commentFontSize", parseFloat(comment.fontSize()));
    setDropDown("commentFontStyle", comment.fontStyle());
    setDropDown("commentFontWeight", comment.fontWeight());
    var textDecoration = comment.textDecoration();
    var TextDecorationType = spreadNS.TextDecorationType;
    markFontStyleButtonActive("comment-underline", (textDecoration & TextDecorationType.Underline) === TextDecorationType.Underline);
    markFontStyleButtonActive("comment-overline", (textDecoration & TextDecorationType.Overline) === TextDecorationType.Overline);
    markFontStyleButtonActive("comment-strikethrough", (textDecoration & TextDecorationType.LineThrough) === TextDecorationType.LineThrough);

    // Border
    setNumberValue("commentBorderWidth", comment.borderWidth());
    setDropDown("commentBorderStyle", comment.borderStyle());
    setColorValue("commentBorderColor", comment.borderColor());

    // Appearance
    setDropDown("commentHorizontalAlign", spreadNS.HorizontalAlign[comment.horizontalAlign()]);
    setDropDown("commentDisplayMode", comment.displayMode());
    setColorValue("commentForeColor", comment.foreColor());
    setColorValue("commentBackColor", comment.backColor());
    setTextValue("commentPadding", getPaddingString(comment.padding()));
    setNumberValue("commentOpacity", comment.opacity() * 100);

    displaySettingPane(uiResource.settingPane.title.comment, $('#commentSetting'));
}

function getPaddingString(padding) {
    if (!padding) return "";

    return [padding.top, padding.right, padding.bottom, padding.left].join(", ");
}

function clearCachedItems() {
    _activePicture = null;
    _activeComment = null;
    _activeTable = null;
}

var _activeTable;
function syncTablePropertyValues(sheet, table) {
    _activeTable = table;

    ribbon.setToggleButton("tableHeaderRow", table.showHeader());
    ribbon.setToggleButton("tableTotalRow", table.showFooter());

    ribbon.setToggleButton("tableFirstColumn", table.highlightFirstColumn());
    ribbon.setToggleButton("tableLastColumn", table.highlightLastColumn());
    ribbon.setToggleButton("tableBandedRows", table.bandRows());
    ribbon.setToggleButton("tableBandedColumns", table.bandColumns());
    var tableStyle = table.style(),
        styleName = tableStyle && table.style().name();

    $("#tableStyles .table-format-item").removeClass("table-format-item-selected");
    if (styleName) {
        $("#tableStyles .table-format-item div[data-name='" + styleName.toLowerCase() + "']").parent().addClass("table-format-item-selected");
    }
    ribbon.setInputValue("tableName", table.name());
}

function setTableStyle(table, styleName) {
    if (table) {
        // var tableStyle = styleName === "none" ? new spreadNS.TableStyle() : spreadNS.TableStyles[styleName]();
        var tableStyle = styleName === "none" ? new spreadNS.Tables.TableTheme() : spreadNS.Tables.TableThemes[styleName];

        table.style(tableStyle);
    }
}

function changeTableStyle() {
    if (_activeTable) {
        spread.suspendPaint();

        var $item = $(".table-format-icon", this),
            styleName = $item.data("name"),
            tooltip = $item.parent().attr("title");

        setTableStyle(_activeTable, styleName);

        $("#tableStyles .table-format-item").removeClass("table-format-item-selected");
        $(this).addClass("table-format-item-selected");

        spread.resumePaint();

        // close drop down
        $tableStyleDropdown.parent().removeClass('open');

        // Save to cache as the quick set by left icon
        settingCache.tableStyles = styleName;
        // update tooltip for icon
        $tableStyleDropdown.parent().prev().attr("title", tooltip);
    }
}

var _activePicture;

function processSelectionChanged() {
    syncCellRelatedItems();
    updatePositionBox(spread.getActiveSheet());
}

function attachSpreadEvents(rebind) {
    spread.bind(spreadNS.Events.EnterCell, onCellSelected);

    spread.bind(spreadNS.Events.ValueChanged, function (sender, args) {
        var row = args.row, col = args.col, sheet = args.sheet;

        if (sheet.getCell(row, col).wordWrap()) {
            sheet.autoFitRow(row);
        }
    });

    spread.bind(spreadNS.Events.RangeChanged, function (sender, args) {
        var sheet = args.sheet, row = args.row, rowCount = args.rowCount;
        if (args.action === spreadNS.RangeChangedAction.Paste) {
            for (var i = 0; i < rowCount; i++) {
                sheet.autoFitRow(row + i);
            }
        }
    });

    spread.bind(spreadNS.Events.ActiveSheetChanged, function () {
        syncSheetPropertyValues();
        syncCellRelatedItems();

        var sheet = spread.getActiveSheet(),
            picture;
        // var slicers = sheet.getSlicers();
        var slicers = sheet.slicers.all();
        for (var item in slicers) {
            slicers[item].isSelected(false);
        }
        sheet.setActiveCell(0, 0);

        onCellSelected();

        var value = getCheckValue("allowOverflow");
        if (sheet.options.allowCellOverflow !== value) {
            sheet.options.allowCellOverflow = value;
        }
    });

    spread.bind(spreadNS.Events.SelectionChanging, function () {
        var sheet = spread.getActiveSheet();
        var selection = sheet.getSelections().slice(-1)[0];
        if (selection) {
            var position = getSelectedRangeString(sheet, selection);
            $("#positionbox").text(position);
        }
    });

    spread.bind(spreadNS.Events.SelectionChanged, function () {
        onCellSelected();
    });

    spread.bind(spreadNS.Events.CommentChanged, function (event, args) {
        var sheet = args.sheet, comment = args.comment, propertyName = args.propertyName;

        if (propertyName === "commentState" && comment) {
            if (comment.commentState() === spreadNS.Comments.CommentState.edit) {
                syncCommentPropertyValues(sheet, comment);
            }
        }
    });

    spread.bind(spreadNS.Events.ValidationError, function (event, data) {
        var dv = data.validator;
        if (dv) {
            var defaultMessage = "This value doesn't match the data validation restrictions defined for this cell."
            var result = confirm(dv.errorMessage() || defaultMessage);
            if (result) {
                data.validationResult = spreadNS.DataValidation.DataValidationResult.retry;
            } else {
                data.validationResult = spreadNS.DataValidation.DataValidationResult.discard
            }
        }
    });

    spread.bind(spreadNS.Events.SlicerChanged, function (event, args) {
        var sheet = args.sheet, slicer = args.slicer, propertyName = args.propertyName;

        if (!slicer) return;

        if (propertyName === "isSelected") {
            syncSlicerPropertyValues(sheet);
            if (slicer.isSelected()) {
                // display setting pane
                displaySettingPane(uiResource.settingPane.title.slicer, $("#slicerSetting"));
            }
        } else {
            changeSlicerInfo(slicer, propertyName);
        }
    });

    spread.bind(spreadNS.Events.FloatingObjectChanged, function (event, args) {
        var floatingObject = args.floatingObject;
        if (floatingObject && floatingObject instanceof spreadNS.Charts.Chart) {
            bindChartEvents(args.sheet, floatingObject, args.propertyName);
        }
    });

    spread.bind(spreadNS.Events.ShapeSelectionChanged, onCellSelected);

    if (!rebind) {
        $(document).bind("keydown", function (event) {
            if (event.shiftKey) {
                isShiftKey = true;
            }
        });
        $(document).bind("keyup", function (event) {
            if (!event.shiftKey) {
                isShiftKey = false;

                var sheet = spread.getActiveSheet(),
                    position = getCellPositionString(sheet, sheet.getActiveRowIndex() + 1, sheet.getActiveColumnIndex() + 1);
                $("#positionbox").text(position);
            }
        });
    }
}

function bindChartEvents(sheet, chart, propertyName) {
    if (propertyName === "isSelected") {
        onCellSelected();
    }
}

// function updateChartTab(chart) {
//     var sheet = spread.getActiveSheet();
//     var selectedChart = chart || ChartHelper.getSelectedChart(sheet);
//
    // if (selectedChart && selectedChart.isSelected() && (sheet.options.protectionOptions.allowEditObjects || !(sheet.options.isProtected && selectedChart.isLocked()))) {
    //     showChartTab();
    // } else {
    //     hideChartTab();
    // }
// }

function getBackgroundColor(name) {
    return $("div[data-name='" + name + "'] div.color-picker").css("background-color");
}

// Cell Type related items
function linkify(address) {
    if (address && address.length) {
        if (address.startsWith("http://") || address.startsWith("https://")) {
            return address;
        }
        return "http://" + address;
    }

    return null;
}

function attachCellTypeEvents() {
    $("#setCellTypeButton").click(function () {
        var currentCellType = $('#cellTypeSetting .group-celltype:visible').data('name') + '-celltype'; //getDropDownValue("cellTypes");
        var cellType = applyCellType(currentCellType);
        if (currentCellType === "hyperlink-celltype") {
            var cellValue = linkify(getTextValue("hyperlinkCellTypeAddress"));
            if (!cellValue) {
                alert("Please provides the address for the link.");
                return;
            }
            var sheet = spread.getActiveSheet();
            var selections = sheet.getSelections();
            sheet.suspendPaint();
            selections.forEach(function (selection) {
                sheet.getRange(selection.row, selection.col, selection.rowCount, selection.colCount).value(cellValue);
            });
            sheet.resumePaint();
        }
        Actions.setCellType(spread, cellType);
    });
}

function applyCellType(name) {
    var sheet = spread.getActiveSheet();
    var cellType;
    switch (name) {
        case "button-celltype":
            cellType = new GC.Spread.Sheets.CellTypes.Button();
            cellType.marginTop(getNumberValue("buttonCellTypeMarginTop"));
            cellType.marginRight(getNumberValue("buttonCellTypeMarginRight"));
            cellType.marginBottom(getNumberValue("buttonCellTypeMarginBottom"));
            cellType.marginLeft(getNumberValue("buttonCellTypeMarginLeft"));
            cellType.text(getTextValue("buttonCellTypeText"));
            cellType.buttonBackColor(getBackgroundColor("buttonCellTypeBackColor"));
            break;

        case "checkbox-celltype":
            cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
            cellType.caption(getTextValue("checkboxCellTypeCaption"));
            cellType.textTrue(getTextValue("checkboxCellTypeTextTrue"));
            cellType.textIndeterminate(getTextValue("checkboxCellTypeTextIndeterminate"));
            cellType.textFalse(getTextValue("checkboxCellTypeTextFalse"));
            cellType.textAlign(getDropDownValue("checkboxCellTypeTextAlign"));
            cellType.isThreeState(getCheckValue("checkboxCellTypeIsThreeState"));
            break;

        case "combobox-celltype":
            cellType = new GC.Spread.Sheets.CellTypes.ComboBox();
            cellType.editorValueType(getDropDownValue("comboboxCellTypeEditorValueType"));
            var comboboxItemsText = getTextValue("comboboxCellTypeItemsText");
            var comboboxItemsValue = getTextValue("comboboxCellTypeItemsValue");
            var itemsText = comboboxItemsText.split(",");
            var itemsValue = comboboxItemsValue.split(",");
            var itemsLength = itemsText.length > itemsValue.length ? itemsText.length : itemsValue.length;
            var items = [];
            for (var count = 0; count < itemsLength; count++) {
                var t = itemsText.length > count && itemsText[0] !== "" ? itemsText[count] : undefined;
                var v = itemsValue.length > count && itemsValue[0] !== "" ? itemsValue[count] : undefined;
                if (t !== undefined && v !== undefined) {
                    items[count] = {text: t, value: v};
                }
                else if (t !== undefined) {
                    items[count] = {text: t};
                } else if (v !== undefined) {
                    items[count] = {value: v};
                }
            }
            cellType.items(items);
            break;

        case "hyperlink-celltype":
            cellType = new GC.Spread.Sheets.CellTypes.HyperLink();
            cellType.linkColor(getBackgroundColor("hyperlinkCellTypeLinkColor"));
            cellType.visitedLinkColor(getBackgroundColor("hyperlinkCellTypeVisitedLinkColor"));
            cellType.text(getTextValue("hyperlinkCellTypeText"));
            cellType.linkToolTip(getTextValue("hyperlinkCellTypeLinkToolTip"));
            break;
    }

    return cellType;
}

function clearCellType() {
    var sheet = spread.getActiveSheet();
    var sels = sheet.getSelections();
    var rowCount = sheet.getRowCount(),
        columnCount = sheet.getColumnCount();
    sheet.suspendPaint();
    for (var i = 0; i < sels.length; i++) {
        var sel = getActualCellRange(sels[i], rowCount, columnCount);
        sheet.clear(sel.row, sel.col, sel.rowCount, sel.colCount, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.StorageType.Style);
    }
    sheet.resumePaint();
}
// Cell Type related items (end)

// Data Validation related items
function processDataValidationSetting(name) {
    $("#dataValidationErrorAlertMessage").val("");
    $("#dataValidationErrorAlertTitle").val("");
    $("#dataValidationInputTitle").val("");
    $("#dataValidationInputMessage").val("");
    switch (name) {
        case "anyvalue-validator":
            $("#validatorNumberType").hide();
            $("#validatorListType").hide();
            $("#validatorFormulaListType").hide();
            $("#validatorDateType").hide();
            $("#validatorTextLengthType").hide();
            break;

        case "number-validator":
            $("#validatorNumberType").show();
            $("#validatorListType").hide();
            $("#validatorFormulaListType").hide();
            $("#validatorDateType").hide();
            $("#validatorTextLengthType").hide();
            processNumberValidatorComparisonOperatorSetting(getDropDownValue("numberValidatorComparisonOperator"));

            setTextValue("numberMinimum", 0);
            setTextValue("numberMaximum", 0);
            setTextValue("numberValue", 0);
            break;

        case "list-validator":
            $("#validatorNumberType").hide();
            $("#validatorListType").show();
            $("#validatorFormulaListType").hide();
            $("#validatorDateType").hide();
            $("#validatorTextLengthType").hide();

            setTextValue("listSource", "1,2,3");
            break;

        case "formulalist-validator":
            $("#validatorNumberType").hide();
            $("#validatorListType").hide();
            $("#validatorFormulaListType").show();
            $("#validatorDateType").hide();
            $("#validatorTextLengthType").hide();

            setTextValue("formulaListFormula", "=ISERROR(FIND(\" \",A1))");
            break;

        case "date-validator":
            $("#validatorNumberType").hide();
            $("#validatorListType").hide();
            $("#validatorFormulaListType").hide();
            $("#validatorDateType").show();
            $("#validatorTextLengthType").hide();
            processDateValidatorComparisonOperatorSetting(getDropDownValue("dateValidatorComparisonOperator"));

            var date = getCurrentTime();
            setTextValue("startDate", date);
            setTextValue("endDate", date);
            setTextValue("dateValue", date);
            break;

        case "textlength-validator":
            $("#validatorNumberType").hide();
            $("#validatorListType").hide();
            $("#validatorFormulaListType").hide();
            $("#validatorDateType").hide();
            $("#validatorTextLengthType").show();
            processTextLengthValidatorComparisonOperatorSetting(getDropDownValue("textLengthValidatorComparisonOperator"));

            setNumberValue("textLengthMinimum", 0);
            setNumberValue("textLengthMaximum", 0);
            setNumberValue("textLengthValue", 0);
            break;

        case "formula-validator":
            $("#validatorNumberType").hide();
            $("#validatorListType").hide();
            $("#validatorFormulaListType").show();
            $("#validatorDateType").hide();
            $("#validatorTextLengthType").hide();

            setTextValue("formulaListFormula", "E5:I5");
            break;

        default:
            console.log("processDataValidationSetting not process with ", name);
            break;
    }
}

function processNumberValidatorComparisonOperatorSetting(value) {
    //if (value === GC.Spread.Sheets.ComparisonOperator.Between || value === GC.Spread.Sheets.ComparisonOperator.NotBetween) {
    if (value === GC.Spread.Sheets.ConditionalFormatting.ComparisonOperators.between || value === GC.Spread.Sheets.ConditionalFormatting.ComparisonOperators.notBetween) {
        //value = GC.Spread.Sheets.ConditionalFormatting.ComparisonOperators.between;
        $("#numberValue").hide();
        $("#numberBetweenOperator").show();
    }
    else {
        $("#numberBetweenOperator").hide();
        $("#numberValue").show();
    }
}

function processDateValidatorComparisonOperatorSetting(value) {
    //if (value === GC.Spread.Sheets.ComparisonOperator.Between || value === GC.Spread.Sheets.ComparisonOperator.NotBetween) {
    if (value === GC.Spread.Sheets.ConditionalFormatting.ComparisonOperators.between || value === GC.Spread.Sheets.ConditionalFormatting.ComparisonOperators.notBetween) {
        $("#dateValue").hide();
        $("#dateBetweenOperator").show();
    }
    else {
        $("#dateBetweenOperator").hide();
        $("#dateValue").show();
    }
}

function processTextLengthValidatorComparisonOperatorSetting(value) {
    //if (value === GC.Spread.Sheets.ComparisonOperator.Between || value === GC.Spread.Sheets.ComparisonOperator.NotBetween) {
    if (value === GC.Spread.Sheets.ConditionalFormatting.ComparisonOperators.between || value === GC.Spread.Sheets.ConditionalFormatting.ComparisonOperators.notBetween) {
        $("#textLengthValue").hide();
        $("#textLengthBetweenOperator").show();
    }
    else {
        $("#textLengthBetweenOperator").hide();
        $("#textLengthValue").show();
    }
}

function setDataValidator() {
    var validatorType = getDropDownValue("validatorType");
    var defaultDataValidator = GC.Spread.Sheets.DataValidation;
    var currentDataValidator = null;
    var dropDownValue;

    var formulaListFormula = getTextValue("formulaListFormula");

    switch (validatorType) {
        case "anyvalue-validator":
            currentDataValidator = new GC.Spread.Sheets.DataValidation.DefaultDataValidator();
            currentDataValidator.type(0); //anyvalue
            break;
        case "number-validator":
            var numberMinimum = getTextValue("numberMinimum");
            var numberMaximum = getTextValue("numberMaximum");
            var numberValue = getTextValue("numberValue");
            var isInteger = getCheckValue("isInteger");
            dropDownValue = getDropDownValue("numberValidatorComparisonOperator");
            if (dropDownValue !== GC.Spread.Sheets.ConditionalFormatting.ComparisonOperators.between && dropDownValue !== GC.Spread.Sheets.ConditionalFormatting.ComparisonOperators.notBetween) {
                numberMinimum = numberValue;
            }
            if (isInteger) {
                currentDataValidator = defaultDataValidator.createNumberValidator(dropDownValue,
                    isNaN(numberMinimum) ? numberMinimum : parseInt(numberMinimum, 10),
                    isNaN(numberMaximum) ? numberMaximum : parseInt(numberMaximum, 10),
                    true);
            } else {
                currentDataValidator = defaultDataValidator.createNumberValidator(dropDownValue,
                    isNaN(numberMinimum) ? numberMinimum : parseFloat(numberMinimum, 10),
                    isNaN(numberMaximum) ? numberMaximum : parseFloat(numberMaximum, 10),
                    false);
            }
            break;
        case "list-validator":
            var listSource = getTextValue("listSource");
            currentDataValidator = defaultDataValidator.createListValidator(listSource);
            break;
        case "formulalist-validator":
            currentDataValidator = defaultDataValidator.createFormulaListValidator(formulaListFormula);
            break;
        case "date-validator":
            var startDate = getTextValue("startDate");
            var endDate = getTextValue("endDate");
            var dateValue = getTextValue("dateValue");
            var isTime = getCheckValue("isTime");
            dropDownValue = getDropDownValue("dateValidatorComparisonOperator");
            if (dropDownValue !== GC.Spread.Sheets.ConditionalFormatting.ComparisonOperators.between && dropDownValue !== GC.Spread.Sheets.ConditionalFormatting.ComparisonOperators.notBetween) {
                startDate = dateValue;
            }
            if (isTime) {
                currentDataValidator = defaultDataValidator.createDateValidator(dropDownValue,
                    isNaN(startDate) ? startDate : new Date(startDate),
                    isNaN(endDate) ? endDate : new Date(endDate),
                    true);
            } else {
                currentDataValidator = defaultDataValidator.createDateValidator(dropDownValue,
                    isNaN(startDate) ? startDate : new Date(startDate),
                    isNaN(endDate) ? endDate : new Date(endDate),
                    false);
            }
            break;
        case "textlength-validator":
            var textLengthMinimum = getNumberValue("textLengthMinimum");
            var textLengthMaximum = getNumberValue("textLengthMaximum");
            var textLengthValue = getNumberValue("textLengthValue");
            dropDownValue = getDropDownValue("textLengthValidatorComparisonOperator");
            if (dropDownValue !== GC.Spread.Sheets.ConditionalFormatting.ComparisonOperators.between && dropDownValue !== GC.Spread.Sheets.ConditionalFormatting.ComparisonOperators.notBetween) {
                textLengthMinimum = textLengthValue;
            }
            currentDataValidator = defaultDataValidator.createTextLengthValidator(dropDownValue, textLengthMinimum, textLengthMaximum);
            break;
        case "formula-validator":
            currentDataValidator = defaultDataValidator.createFormulaValidator(formulaListFormula);
            break;
    }

    if (currentDataValidator) {
        currentDataValidator.errorMessage($("#dataValidationErrorAlertMessage").val());
        currentDataValidator.errorStyle(getDropDownValue("errorAlert"));
        currentDataValidator.errorTitle($("#dataValidationErrorAlertTitle").val());
        currentDataValidator.showErrorMessage(getCheckValue("showErrorAlert"));
        currentDataValidator.ignoreBlank(getCheckValue("ignoreBlank"));
        var showInputMessage = getCheckValue("showInputMessage");
        if (showInputMessage) {
            currentDataValidator.inputTitle($("#dataValidationInputTitle").val());
            currentDataValidator.inputMessage($("#dataValidationInputMessage").val());
        }
        var highLightStyle = parseInt($("#highlightStyleType").find('li.selected a').attr("data-value"));
        var dogearPosition =  parseInt($("#dogearPositionList").find('li.selected a').attr("data-value"));
        var iconPosition =  parseInt($("#iconPositionList").find('li.selected a').attr("data-value"));
        var highlightStyleColor = $("#high-color").css('background-color');
        if (highLightStyle === 0) {
            currentDataValidator.highlightStyle({
                type: GC.Spread.Sheets.DataValidation.HighlightType.circle,
                color: highlightStyleColor
            });
        } else if (highLightStyle === 1 && dogearPosition === 0) {
            currentDataValidator.highlightStyle({
                type: GC.Spread.Sheets.DataValidation.HighlightType.dogEar,
                color: highlightStyleColor,
                position: GC.Spread.Sheets.DataValidation.HighlightPosition.topLeft
            });
        } else if (highLightStyle === 1 && dogearPosition === 1) {
            currentDataValidator.highlightStyle({
                type: GC.Spread.Sheets.DataValidation.HighlightType.dogEar,
                color: highlightStyleColor,
                position: GC.Spread.Sheets.DataValidation.HighlightPosition.topRight
            });
        } else if (highLightStyle === 1 && dogearPosition === 2) {
            currentDataValidator.highlightStyle({
                type: GC.Spread.Sheets.DataValidation.HighlightType.dogEar,
                color: highlightStyleColor,
                position: GC.Spread.Sheets.DataValidation.HighlightPosition.bottomLeft
            });
        } else if (highLightStyle === 1 && dogearPosition === 3) {
            currentDataValidator.highlightStyle({
                type: GC.Spread.Sheets.DataValidation.HighlightType.dogEar,
                color: highlightStyleColor,
                position: GC.Spread.Sheets.DataValidation.HighlightPosition.bottomRight
            });
        } else if (highLightStyle === 2 && iconPosition === 0) {
            currentDataValidator.highlightStyle({
                type: GC.Spread.Sheets.DataValidation.HighlightType.icon,
                color: highlightStyleColor,
                position: GC.Spread.Sheets.DataValidation.HighlightPosition.outsideLeft,
                image: this.imageBase64
            });
        } else if (highLightStyle === 2 && iconPosition === 1) {
            currentDataValidator.highlightStyle({
                type: GC.Spread.Sheets.DataValidation.HighlightType.icon,
                color: highlightStyleColor,
                position: GC.Spread.Sheets.DataValidation.HighlightPosition.outsideRight,
                image: this.imageBase64
            });
        }
        setDataValidatorInRange(currentDataValidator);
    }
}

function setDataValidatorInRange(dataValidator) {
    var sheet = spread.getActiveSheet();
    sheet.suspendPaint();
    var sels = sheet.getSelections();
    var rowCount = sheet.getRowCount(),
        columnCount = sheet.getColumnCount();

    for (var i = 0; i < sels.length; i++) {
        var sel = getActualCellRange(sels[i], rowCount, columnCount);
        sheet.setDataValidator(sel.row, sel.col, sel.rowCount, sel.colCount, dataValidator);
    }
    sheet.resumePaint();
}

function getCurrentTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var strDate = year + "-";
    if (month < 10)
        strDate += "0";
    strDate += month + "-";
    if (day < 10)
        strDate += "0";
    strDate += day;

    return strDate;
}

function attachDataValidationEvents() {
    $("#setDataValidator").click(function () {
        var currentValidatorType = getDropDownValue("validatorType");
        setDataValidator(currentValidatorType);
    });
    $("#clearDataValidatorSettings").click(function () {
        // reset to default
        var value = "anyvalue-validator";
        setDropDown("validatorType", value);
        processDataValidationSetting(value);
        setDropDown("errorAlert", 0);
        setCheckValue("showInputMessage", true);
        setCheckValue("showErrorAlert", true);
        clearHighlightStyle();
    });
}
// Data Validation related items (end)


function clearHighlightStyle() {
    setDropDown("iconPosition", 0);
    setDropDown("highlightType", 0);
    setDropDown("dogearPosition", 0);
    $("#dogearPositionLabel").hide();
    $("#dogearPositionList").hide();
    $("#iconPositionLabel").hide();
    $("#iconPositionList").hide();
    $("#datavalidationSelectFile").hide();
    $("#highlightColor").val("");
    $("#high-color").css('background-color',"rgb(255,0,0)");
}

// Sparkline related items
function processAddSparklineEx(sparklineType) {
    var sheet = spread.getActiveSheet();
    var selection = sheet.getSelections()[0];
    if (!selection) {
        return;
    }

    var $typeInfo = $("#sparklineSetting ul.dropdown-menu.sparklineExType a[data-value='" + sparklineType + "']");
    if ($typeInfo.length > 0) {
        setDropDown("sparklineExType", sparklineType);
        processSparklineSetting(sparklineType);
    }
    else {
        processSparklineSetting(getDropDownValue("sparklineExType"));
    }
    setTextValue("txtLineDataRange", parseRangeToExpString(selection));
    setTextValue("txtLineLocationRange", "");

    displaySettingPane(uiResource.sparklineDialog.title, $('#sparklineSetting'));
}

function processAddBarCodeEx(barCodeType) {
    var sheet = spread.getActiveSheet();
    var selection = sheet.getSelections()[0];
    if (!selection) {
        return;
    }

    var $typeInfo = $("#barCodeSetting ul.dropdown-menu.barCodeExType a[data-value='" + barCodeType + "']");
    if ($typeInfo.length > 0) {
        setDropDown("barCodeExType", barCodeType);
        processBarCodeSetting(barCodeType);
    }
    else {
        processBarCodeSetting(getDropDownValue("barCodeExType"));
    }
    setTextValue("txtEAN8DataRange", parseRangeToExpString(selection));
    setTextValue("txtEAN8LocationRange", "");

    displaySettingPane(uiResource.barCodeDialog.title, $('#barCodeSetting'));
}

// ChartType List
function createChartTypeList(list) {


}

function unParseFormula(expr, row, col) {
    var sheet = spread.getActiveSheet();
    if (!sheet || !expr) {
        return null;
    }
    var calcService = sheet.getCalcService();
    return calcService.unparse(null, expr, row, col);
}

function processSparklineSetting(name, title) {
    //Show only when data range is illegal.
    $("#dataRangeError").parent().hide();
    $("#singleDataRangeError").parent().hide();
    //Show only when location range is illegal.
    $("#locationRangeError").parent().hide();

    switch (name) {
        case "line":
        case "column":
        case "winloss":
        case "pie":
        case "area":
        case "scatter":
        case "spread":
        case "stacked":
        case "boxplot":
        case "cascade":
        case "pareto":
            $("#lineContainer").show();
            $("#bulletContainer").hide();
            $("#hbarContainer").hide();
            $("#varianceContainer").hide();
            break;

        case "bullet":
            $("#lineContainer").hide();
            $("#bulletContainer").show();
            $("#hbarContainer").hide();
            $("#varianceContainer").hide();

            setTextValue("txtBulletMeasure", "");
            setTextValue("txtBulletTarget", "");
            setTextValue("txtBulletMaxi", "");
            setTextValue("txtBulletGood", "");
            setTextValue("txtBulletBad", "");
            setTextValue("txtBulletForecast", "");
            setTextValue("txtBulletTickunit", "");
            setCheckValue("checkboxBulletVertial", false);
            break;

        case "hbar":
        case "vbar":
            $("#lineContainer").hide();
            $("#bulletContainer").hide();
            $("#hbarContainer").show();
            $("#varianceContainer").hide();

            setTextValue("txtHbarValue", "");
            break;

        case "vari":
            $("#lineContainer").hide();
            $("#bulletContainer").hide();
            $("#hbarContainer").hide();
            $("#varianceContainer").show();

            setTextValue("txtVariance", "");
            setTextValue("txtVarianceReference", "");
            setTextValue("txtVarianceMini", "");
            setTextValue("txtVarianceMaxi", "");
            setTextValue("txtVarianceMark", "");
            setTextValue("txtVarianceTickUnit", "");
            setCheckValue("checkboxVarianceLegend", false);
            setCheckValue("checkboxVarianceVertical", false);
            break;

        default:
            console.log("processSparklineSetting not process with ", name, title);
            break;
    }
}

function processBarCodeSetting(name, title) {
    //Show only when data range is illegal.
    $("#dataRangeErrorBarCode").parent().hide();
    $("#singleDataRangeErrorBarCode").parent().hide();
    //Show only when location range is illegal.
    $("#locationRangeErrorBarCode").parent().hide();
    switch (name) {
        case "ean8":
        case "gs1_128":
        case "ean13":
        case "code93":
        case "code39":
        case "code49":
        case "code128":
        case "pdf417":
        case "codabar":
        case "dataMatrix":
        case "qrCode":
            $("#ean8Container").show();
            $("#gs1Container").hide();
            $("#ean13Container").hide();
            $("#code93Container").hide();
            $("#code39Container").hide();
            $("#code49Container").hide();
            $("#code128Container").hide();
            $("#pdfContainer").hide();
            $("#codabarContainer").hide();
            $("#dataMatrixContainer").hide();
            $("#qrCodeContainer").hide();

            break;

        default:
            console.log("processSparklineSetting not process with ", name, title);
            break;
    }
}

function addSparklineEvent() {
    var sheet = spread.getActiveSheet(),
        selection = sheet.getSelections()[0],
        isValid = true;

    var name = getDropDownValue("sparklineExType"),
        sparklineExType = name.toUpperCase() + "SPARKLINE";
    if (selection) {
        var range = getActualRange(selection, sheet.getRowCount(), sheet.getColumnCount());
        var formulaStr = '', row = range.row, col = range.col, direction = 0;
        switch (name) {
            case "bullet":
                var measure = getTextValue("txtBulletMeasure"),
                    target = getTextValue("txtBulletTarget"),
                    maxi = getTextValue("txtBulletMaxi"),
                    good = getTextValue("txtBulletGood"),
                    bad = getTextValue("txtBulletBad"),
                    forecast = getTextValue("txtBulletForecast"),
                    tickunit = getTextValue("txtBulletTickunit"),
                    colorScheme = getBackgroundColor("colorBulletColorScheme"),
                    vertical = getCheckValue("checkboxBulletVertial");
                formulaStr = '=' + sparklineExType + '(' + measure + ',' + target + ',' + maxi + ',' + good + ',' + bad + ',' + forecast + ',' + tickunit + ',' + '"' + colorScheme + '"' + ',' + vertical + ')';

                sheet.setFormula(row, col, formulaStr);

                break;
            case "hbar":
                var value = getTextValue("txtHbarValue"),
                    colorScheme = getBackgroundColor("colorHbarColorScheme");

                formulaStr = '=' + sparklineExType + '(' + value + ',' + '"' + colorScheme + '"' + ')';

                sheet.setFormula(row, col, formulaStr);
                break;
            case "vbar":
                var value = getTextValue("txtHbarValue"),
                    colorScheme = getBackgroundColor("colorHbarColorScheme");

                formulaStr = '=' + sparklineExType + '(' + value + ',' + '"' + colorScheme + '"' + ')';

                sheet.setFormula(row, col, formulaStr);
                break;
            case "vari":
                var variance = getTextValue("txtVariance"),
                    reference = getTextValue("txtVarianceReference"),
                    mini = getTextValue("txtVarianceMini"),
                    maxi = getTextValue("txtVarianceMaxi"),
                    mark = getTextValue("txtVarianceMark"),
                    tickunit = getTextValue("txtVarianceTickunit"),
                    colorPositive = getBackgroundColor("colorVariancePositive"),
                    colorNegative = getBackgroundColor("colorVarianceNegative"),
                    legend = getCheckValue("checkboxVarianceLegend"),
                    vertical = getCheckValue("checkboxVarianceVertical");

                formulaStr = '=' + sparklineExType + '(' + variance + ',' + reference + ',' + mini + ',' + maxi + ',' + mark + ',' + tickunit + ',' + legend + ',' + '"' + colorPositive + '"' + ',' + '"' + colorNegative + '"' + ',' + vertical + ')';

                sheet.setFormula(row, col, formulaStr);
                break;
            case "cascade":
            case "pareto":
                var dataRangeStr = getTextValue("txtLineDataRange"),
                    locationRangeStr = getTextValue("txtLineLocationRange"),
                    dataRangeObj = parseStringToExternalRanges(dataRangeStr, sheet),
                    locationRangeObj = parseStringToExternalRanges(locationRangeStr, sheet),
                    vertical = false,
                    dataRange, locationRange;
                if (dataRangeObj && dataRangeObj.length > 0 && dataRangeObj[0].range) {
                    dataRange = dataRangeObj[0].range;
                }
                if (locationRangeObj && locationRangeObj.length > 0 && locationRangeObj[0].range) {
                    locationRange = locationRangeObj[0].range;
                }
                if (locationRange && locationRange.rowCount < locationRange.colCount) {
                    vertical = true;
                }
                if (!dataRange) {
                    isValid = false;
                    $("#dataRangeError").parent().show();
                }
                if (!locationRange) {
                    isValid = false;
                    $("#locationRangeError").parent().show();
                }
                if (isValid) {
                    var pointCount = dataRange.rowCount * dataRange.colCount,
                        i = 1;

                    // TODO: should in one action instead of multi-actions
                    for (var r = locationRange.row; r < locationRange.row + locationRange.rowCount; r++) {
                        for (var c = locationRange.col; c < locationRange.col + locationRange.colCount; c++) {
                            if (i <= pointCount) {
                                formulaStr = '=' + sparklineExType + '(' + dataRangeStr + ',' + i + ',,,,,,' + vertical + ')';

                                sheet.setFormula(row, col, formulaStr);
                                sheet.setActiveCell(r, c);
                                i++;
                            }
                        }
                    }
                }
                break;

            default:
                var dataRangeStr = getTextValue("txtLineDataRange"),
                    locationRangeStr = getTextValue("txtLineLocationRange"),
                    dataRangeObj = parseStringToExternalRanges(dataRangeStr, sheet),
                    locationRangeObj = parseStringToExternalRanges(locationRangeStr, sheet),
                    dataRange, locationRange;
                if (dataRangeObj && dataRangeObj.length > 0 && dataRangeObj[0].range) {
                    dataRange = dataRangeObj[0].range;
                }
                if (locationRangeObj && locationRangeObj.length > 0 && locationRangeObj[0].range) {
                    locationRange = locationRangeObj[0].range;
                }
                if (!dataRange) {
                    isValid = false;
                    $("#dataRangeError").parent().show();
                }
                if (!locationRange) {
                    isValid = false;
                    $("#locationRangeError").parent().show();
                }
                if (isValid) {
                    if (["line", "column", "winloss"].indexOf(name) >= 0) {
                        if (dataRange.rowCount === 1) {
                            direction = 1;
                        }
                        else if (dataRange.colCount === 1) {
                            direction = 0;
                        }
                        else {
                            $("#singleDataRangeError").parent().show();
                            isValid = false;
                        }
                        if (isValid) {
                            formulaStr = '=' + sparklineExType + '(' + dataRangeStr + ',' + direction + ')';
                        }
                    }
                    else {
                        formulaStr = '=' + sparklineExType + '(' + dataRangeStr + ')';
                    }
                    if (isValid) {
                        row = locationRange.row;
                        col = locationRange.col;

                        sheet.setFormula(row, col, formulaStr);
                        sheet.setActiveCell(row, col);
                    }
                }
                break;
        }
    }
    if (!isValid) {
        return {canceled: true};
    }
    else {
        if (showSparklineSetting(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex())) {
            updateFormulaBar();
            setActiveTab("sparklineEx");
            displaySettingPane(uiResource.sparklineDialog.detail, $("#sparklineDetailSetting"));
            return;
        }
        console.log("Added sparkline", sparklineExType);
    }
}

function addBarCodeEvent() {
    var sheet = spread.getActiveSheet(),
        selection = sheet.getSelections()[0],
        isValid = true;

    var name = getDropDownValue("barCodeExType"),
        barCodeExType = 'BC_' + name.toUpperCase();
    if (selection) {
        var range = getActualRange(selection, sheet.getRowCount(), sheet.getColumnCount());
        var formulaStr = '';
        switch (name) {
            case "ean8":
            case 'gs1_128':
            case 'ean13':
            case 'qrCode':
            case 'code93':
            case 'code39':
            case 'code128':
            case 'code49':
            case 'pdf417':
            case 'codabar':
            case 'dataMatrix':
                var dataRangeStr = getTextValue("txtEAN8DataRange"),
                    locationRangeStr = getTextValue("txtEAN8LocationRange"),
                    dataRangeObj = parseStringToExternalRanges(dataRangeStr, sheet),
                    locationRangeObj = parseStringToExternalRanges(locationRangeStr, sheet),
                    dataRange, locationRange;

                if (dataRangeObj && dataRangeObj.length > 0 && dataRangeObj[0].range) {
                    dataRange = dataRangeObj[0].range;
                }
                if (locationRangeObj && locationRangeObj.length > 0 && locationRangeObj[0].range) {
                    locationRange = locationRangeObj[0].range;
                }
                if (!dataRange) {
                    isValid = false;
                    $("#dataRangeError").show();
                }
                if (!locationRange) {
                    isValid = false;
                    $("#locationRangeError").show();
                }
                if (isValid) {
                    var row = locationRange.row, col = locationRange.col;
                    formulaStr = '=' + barCodeExType + '(' + dataRangeStr + ')';
                    sheet.setFormula(row, col, formulaStr);
                    sheet.setActiveCell(row, col);
                }
                break;

            default:
                break;
        }
    }
    if (!isValid) {
        return {canceled: true};
    }
    else {
        if (showBarCodeSetting(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex())) {
            updateFormulaBar();
            setActiveTab("barCodeEx");
            displaySettingPane(uiResource.barCodeDialog.detail, $("#barCodeDetailSetting"));
            return;
        }
        console.log("Added barCode", barCodeExType);
    }
}

function parseRangeToExpString(range) {
    // var Calc = GC.Spread.Sheets.Calc;
    var Calc = GC.Spread.Sheets.CalcEngine;
    return Calc.rangeToFormula(range, 0, 0, Calc.RangeReferenceRelative.allRelative);
}

function parseStringToExternalRanges(expString, sheet) {
    // var Calc = GC.Spread.Sheets.Calc;
    var Calc = GC.Spread.Sheets.CalcEngine;
    var results = [];
    var exps = expString.split(",");
    try {
        for (var i = 0; i < exps.length; i++) {
            var range = Calc.formulaToRange(sheet, exps[i]);
            results.push({"range": range});
        }
    }
    catch (e) {
        return null;
    }
    return results;
}

function parseFormulaSparkline(row, col) {
    var sheet = spread.getActiveSheet();
    if (!sheet) {
        return null;
    }
    var formula = sheet.getFormula(row, col);
    if (!formula) {
        return null;
    }
    var calcService = sheet.getCalcService();
    try {
        var expr = calcService.parse(null, formula, row, col);
        // if (expr instanceof spreadNS.Calc.Expressions.FunctionExpression) {
        if (expr.type == GC.Spread.CalcEngine.ExpressionType.function) {
            var fnName = expr.functionName;
            if (fnName && spread.getSparklineEx(fnName)) {
                return expr;
            }
        }
    }
    catch (ex) {
    }
    return null;
}

function parseColorExpression(colorExpression, row, col) {
    if (!colorExpression) {
        return null;
    }
    var sheet = spread.getActiveSheet();
    if (colorExpression.type == GC.Spread.CalcEngine.ExpressionType.string) {
        return colorExpression.value;
    }
    else if (colorExpression.type == GC.Spread.CalcEngine.ExpressionType.missingArgument) {
        return null;
    }
    else {
        var formula = null;
        try {
            formula = unParseFormula(colorExpression, row, col);
        }
        catch (ex) {
        }
        return spreadNS.CalcEngine.evaluateFormula(sheet, formula, row, col);
    }
}

function parseSparklineColorOptions(str) {
    return '"' + str + '"';
}

function unparseSparklineStringOptions(str){
    return str = str.replace(/\"/g, "");
}

function unparseBraceOptions(str){
    return str = str.substring(1,str.length-1);
}

function getAreaSparklineSetting(formulaArgs, row, col) {
    var defaultValue = {colorPositive: "#787878", colorNegative: "#CB0000"};
    if (formulaArgs[0]) {
        setTextValue("areaSparklinePoints", unParseFormula(formulaArgs[0], row, col));
    }
    else {
        setTextValue("areaSparklinePoints", "");
    }
    var inputList = ["areaSparklineMinimumValue", "areaSparklineMaximumValue", "areaSparklineLine1", "areaSparklineLine2"];
    var len = inputList.length;
    for (var i = 1; i <= len; i++) {
        if (formulaArgs[i]) {
            setNumberValue(inputList[i - 1], unParseFormula(formulaArgs[i], row, col));
        }
        else {
            setNumberValue(inputList[i - 1], "");
        }
    }
    var positiveColor = parseColorExpression(formulaArgs[5], row, col);
    if (positiveColor) {
        setColorValue("areaSparklinePositiveColor", positiveColor);
    }
    else {
        setColorValue("areaSparklinePositiveColor", defaultValue.colorPositive);
    }
    var negativeColor = parseColorExpression(formulaArgs[6], row, col);
    if (negativeColor) {
        setColorValue("areaSparklineNegativeColor", negativeColor);
    }
    else {
        setColorValue("areaSparklineNegativeColor", defaultValue.colorNegative);
    }
}

function getBoxPlotSparklineSetting(formulaArgs, row, col) {
    var Calc = GC.Spread.CalcEngine;
    var defaultValue = {boxplotClass: "5ns", style: 0, colorScheme: "#D2D2D2", vertical: false, showAverage: false};
    if (formulaArgs && formulaArgs.length > 0) {
        var pointsValue = unParseFormula(formulaArgs[0], row, col);
        var boxPlotClassValue = formulaArgs[1] && formulaArgs[1].type === GC.Spread.CalcEngine.ExpressionType.string ? formulaArgs[1].value : null;
        var showAverageValue = formulaArgs[2] && formulaArgs[2].type === GC.Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[2].value : null;
        var scaleStartValue = unParseFormula(formulaArgs[3], row, col);
        var scaleEndValue = unParseFormula(formulaArgs[4], row, col);
        var acceptableStartValue = unParseFormula(formulaArgs[5], row, col);
        var acceptableEndValue = unParseFormula(formulaArgs[6], row, col);
        var colorValue = parseColorExpression(formulaArgs[7], row, col);
        var styleValue = formulaArgs[8] ? unParseFormula(formulaArgs[8], row, col) : null;
        var verticalValue = formulaArgs[9] && formulaArgs[9].type === GC.Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[9].value : null;

        setTextValue("boxplotSparklinePoints", pointsValue);
        setDropDown("boxplotClassType", boxPlotClassValue === null ? defaultValue.boxplotClass : boxPlotClassValue);
        setTextValue("boxplotSparklineScaleStart", scaleStartValue);
        setTextValue("boxplotSparklineScaleEnd", scaleEndValue);
        setTextValue("boxplotSparklineAcceptableStart", acceptableStartValue);
        setTextValue("boxplotSparklineAcceptableEnd", acceptableEndValue);
        setColorValue("boxplotSparklineColorScheme", colorValue === null ? defaultValue.colorScheme : colorValue);
        setDropDown("boxplotSparklineStyleType", styleValue === null ? defaultValue.style : styleValue);
        setCheckValue("boxplotSparklineShowAverage", showAverageValue === null ? defaultValue.showAverage : showAverageValue);
        setCheckValue("boxplotSparklineVertical", verticalValue === null ? defaultValue.vertical : verticalValue);
    }
    else {
        setTextValue("boxplotSparklinePoints", "");
        setDropDown("boxplotClassType", defaultValue.boxplotClass);
        setTextValue("boxplotSparklineScaleStart", "");
        setTextValue("boxplotSparklineScaleEnd", "");
        setTextValue("boxplotSparklineAcceptableStart", "");
        setTextValue("boxplotSparklineAcceptableEnd", "");
        setColorValue("boxplotSparklineColorScheme", defaultValue.colorScheme);
        setDropDown("boxplotSparklineStyleType", defaultValue.style);
        setCheckValue("boxplotSparklineShowAverage", defaultValue.showAverage);
        setCheckValue("boxplotSparklineVertical", defaultValue.vertical);
    }
}

function getBulletSparklineSetting(formulaArgs, row, col) {
    var Calc = GC.Spread.CalcEngine;
    var defaultValue = {vertical: false, colorScheme: "#A0A0A0"};
    if (formulaArgs && formulaArgs.length > 0) {
        var measureValue = unParseFormula(formulaArgs[0], row, col);
        var targetValue = unParseFormula(formulaArgs[1], row, col);
        var maxiValue = unParseFormula(formulaArgs[2], row, col);
        var goodValue = unParseFormula(formulaArgs[3], row, col);
        var badValue = unParseFormula(formulaArgs[4], row, col);
        var forecastValue = unParseFormula(formulaArgs[5], row, col);
        var tickunitValue = unParseFormula(formulaArgs[6], row, col);
        var colorSchemeValue = parseColorExpression(formulaArgs[7], row, col);
        var verticalValue = formulaArgs[8] && formulaArgs[8].type === GC.Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[8].value : null;

        setTextValue("bulletSparklineMeasure", measureValue);
        setTextValue("bulletSparklineTarget", targetValue);
        setTextValue("bulletSparklineMaxi", maxiValue);
        setTextValue("bulletSparklineForecast", forecastValue);
        setTextValue("bulletSparklineGood", goodValue);
        setTextValue("bulletSparklineBad", badValue);
        setTextValue("bulletSparklineTickUnit", tickunitValue);
        setColorValue("bulletSparklineColorScheme", colorSchemeValue ? colorSchemeValue : defaultValue.colorScheme);
        setCheckValue("bulletSparklineVertical", verticalValue ? verticalValue : defaultValue.vertical);
    }
    else {
        setTextValue("bulletSparklineMeasure", "");
        setTextValue("bulletSparklineTarget", "");
        setTextValue("bulletSparklineMaxi", "");
        setTextValue("bulletSparklineForecast", "");
        setTextValue("bulletSparklineGood", "");
        setTextValue("bulletSparklineBad", "");
        setTextValue("bulletSparklineTickUnit", "");
        setColorValue("bulletSparklineColorScheme", defaultValue.colorScheme);
        setCheckValue("bulletSparklineVertical", defaultValue.vertical);
    }
}

function getCascadeSparklineSetting(formulaArgs, row, col) {
    var Calc = GC.Spread.CalcEngine;
    var defaultValue = {colorPositive: "#8CBF64", colorNegative: "#D6604D", vertical: false};

    if (formulaArgs && formulaArgs.length > 0) {
        var pointsRangeValue = unParseFormula(formulaArgs[0], row, col);
        var pointIndexValue = unParseFormula(formulaArgs[1], row, col);
        var labelsRangeValue = unParseFormula(formulaArgs[2], row, col);
        var minimumValue = unParseFormula(formulaArgs[3], row, col);
        var maximumValue = unParseFormula(formulaArgs[4], row, col);
        var colorPositiveValue = parseColorExpression(formulaArgs[5], row, col);
        var colorNegativeValue = parseColorExpression(formulaArgs[6], row, col);
        var verticalValue = formulaArgs[7] && formulaArgs[7].type === GC.Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[7].value : null;

        setTextValue("cascadeSparklinePointsRange", pointsRangeValue);
        setTextValue("cascadeSparklinePointIndex", pointIndexValue);
        setTextValue("cascadeSparklineLabelsRange", labelsRangeValue);
        setTextValue("cascadeSparklineMinimum", minimumValue);
        setTextValue("cascadeSparklineMaximum", maximumValue);
        setColorValue("cascadeSparklinePositiveColor", colorPositiveValue ? colorPositiveValue : defaultValue.colorPositive);
        setColorValue("cascadeSparklineNegativeColor", colorNegativeValue ? colorNegativeValue : defaultValue.colorNegative);
        setCheckValue("cascadeSparklineVertical", verticalValue ? verticalValue : defaultValue.vertical);
    }
    else {
        setTextValue("cascadeSparklinePointsRange", "");
        setTextValue("cascadeSparklinePointIndex", "");
        setTextValue("cascadeSparklineLabelsRange", "");
        setTextValue("cascadeSparklineMinimum", "");
        setTextValue("cascadeSparklineMaximum", "");
        setColorValue("cascadeSparklinePositiveColor", defaultValue.colorPositive);
        setColorValue("cascadeSparklineNegativeColor", defaultValue.colorNegative);
        setCheckValue("cascadeSparklineVertical", defaultValue.vertical);
    }
}

function parseSetting(jsonSetting) {
    var setting = {}, inBracket = false, inProperty = true, property = "", value = "";
    if (jsonSetting) {
        jsonSetting = jsonSetting.substr(1, jsonSetting.length - 2);
        for (var i = 0, len = jsonSetting.length; i < len; i++) {
            var char = jsonSetting.charAt(i);
            if (char === ":") {
                inProperty = false;
            }
            else if (char === "," && !inBracket) {
                setting[property] = value;
                property = "";
                value = "";
                inProperty = true;
            }
            else if (char === "\'" || char === "\"") {
                // discard
            }
            else {
                if (char === "(") {
                    inBracket = true;
                }
                else if (char === ")") {
                    inBracket = false;
                }
                if (inProperty) {
                    property += char;
                }
                else {
                    value += char;
                }
            }
        }
        if (property) {
            setting[property] = value;
        }
        for (var p in setting) {
            var v = setting[p];
            if (v !== null && typeof (v) !== "undefined") {
                if (v.toUpperCase() === "TRUE") {
                    setting[p] = true;
                } else if (v.toUpperCase() === "FALSE") {
                    setting[p] = false;
                } else if (!isNaN(v) && isFinite(v)) {
                    setting[p] = parseFloat(v);
                }
            }
        }
    }
    return setting;
}

function updateManual(type, inputDataName) {
    var $manualInput = $("input[data-name='" + inputDataName + "']");
    var $manualDiv = $manualInput.parent();
    if (type !== "custom") {
        $manualInput.attr("disabled", "disabled");
        $manualDiv.addClass("manual-disable");
    }
    else {
        $manualInput.removeAttr("disabled");
        $manualDiv.removeClass("manual-disable");
    }
}

function updateStyleSetting(settings) {
    var defaultValue = {
        negativePoints: "#A52A2A", markers: "#244062", highPoint: "#0000FF",
        lowPoint: "#0000FF", firstPoint: "#95B3D7", lastPoint: "#95B3D7",
        series: "#244062", axis: "#000000"
    };
    setColorValue("compatibleSparklineNegativeColor", settings.negativeColor ? settings.negativeColor : defaultValue.negativePoints);
    setColorValue("compatibleSparklineMarkersColor", settings.markersColor ? settings.markersColor : defaultValue.markers);
    setColorValue("compatibleSparklineAxisColor", settings.axisColor ? settings.axisColor : defaultValue.axis);
    setColorValue("compatibleSparklineSeriesColor", settings.seriesColor ? settings.seriesColor : defaultValue.series);
    setColorValue("compatibleSparklineHighMarkerColor", settings.highMarkerColor ? settings.highMarkerColor : defaultValue.highPoint);
    setColorValue("compatibleSparklineLowMarkerColor", settings.lowMarkerColor ? settings.lowMarkerColor : defaultValue.lowPoint);
    setColorValue("compatibleSparklineFirstMarkerColor", settings.firstMarkerColor ? settings.firstMarkerColor : defaultValue.firstPoint);
    setColorValue("compatibleSparklineLastMarkerColor", settings.lastMarkerColor ? settings.lastMarkerColor : defaultValue.lastPoint);
    setTextValue("compatibleSparklineLastLineWeight", settings.lineWeight || settings.lw);
}

function updateSparklineSetting(setting) {
    if (!setting) {
        return;
    }
    var defaultSetting = {
        rightToLeft: false,
        displayHidden: false,
        displayXAxis: false,
        showFirst: false,
        showHigh: false,
        showLast: false,
        showLow: false,
        showNegative: false,
        showMarkers: false
    };

    /*    setDropDown("emptyCellDisplayType", setting.options.displayEmptyCellsAs ? setting.options.displayEmptyCellsAs : -1);
     setCheckValue("showDataInHiddenRowOrColumn", setting.options.displayHidden ? setting.options.displayHidden : defaultSetting.displayHidden);
     setCheckValue("compatibleSparklineShowFirst", setting.options.showFirst ? setting.options.showFirst : defaultSetting.showFirst);
     setCheckValue("compatibleSparklineShowLast", setting.options.showLast ? setting.options.showLast : defaultSetting.showLast);
     setCheckValue("compatibleSparklineShowHigh", setting.options.showHigh ? setting.options.showHigh : defaultSetting.showHigh);
     setCheckValue("compatibleSparklineShowLow", setting.options.showLow ? setting.options.showLow : defaultSetting.showLow);
     setCheckValue("compatibleSparklineShowNegative", setting.options.showNegative ? setting.options.showNegative : defaultSetting.showNegative);
     setCheckValue("compatibleSparklineShowMarkers", setting.options.showMarkers ? setting.options.showMarkers : defaultSetting.showMarkers);
     var minAxisType = spreadNS.Sparklines.SparklineAxisMinMax[setting.options.minAxisType];
     setDropDown("minAxisType", minAxisType ? minAxisType : "");
     setTextValue("manualMin", setting.options.manualMin ? setting.options.manualMin : "");
     var maxAxisType = spreadNS.Sparklines.SparklineAxisMinMax[setting.options.maxAxisType];
     setDropDown("maxAxisType", maxAxisType ? maxAxisType : "");
     setTextValue("manualMax", setting.options.manualMax ? setting.options.manualMax : "");
     setCheckValue("rightToLeft", setting.options.rightToLeft ? setting.options.rightToLeft : defaultSetting.rightToLeft);
     setCheckValue("displayXAxis", setting.options.displayXAxis ? setting.options.displayXAxis : defaultSetting.displayXAxis); */


    setDropDown("emptyCellDisplayType", setting.displayEmptyCellsAs ? setting.displayEmptyCellsAs : -1);
    setCheckValue("showDataInHiddenRowOrColumn", setting.displayHidden ? setting.displayHidden : defaultSetting.displayHidden);
    setCheckValue("compatibleSparklineShowFirst", setting.showFirst ? setting.showFirst : defaultSetting.showFirst);
    setCheckValue("compatibleSparklineShowLast", setting.showLast ? setting.showLast : defaultSetting.showLast);
    setCheckValue("compatibleSparklineShowHigh", setting.showHigh ? setting.showHigh : defaultSetting.showHigh);
    setCheckValue("compatibleSparklineShowLow", setting.showLow ? setting.showLow : defaultSetting.showLow);
    setCheckValue("compatibleSparklineShowNegative", setting.showNegative ? setting.showNegative : defaultSetting.showNegative);
    setCheckValue("compatibleSparklineShowMarkers", setting.showMarkers ? setting.showMarkers : defaultSetting.showMarkers);
    var minAxisType = spreadNS.Sparklines.SparklineAxisMinMax[setting.minAxisType];
    setDropDown("minAxisType", minAxisType ? minAxisType : "");
    setTextValue("manualMin", setting.manualMin ? setting.manualMin : "");
    var maxAxisType = spreadNS.Sparklines.SparklineAxisMinMax[setting.maxAxisType];
    setDropDown("maxAxisType", maxAxisType ? maxAxisType : "");
    setTextValue("manualMax", setting.manualMax ? setting.manualMax : "");
    setCheckValue("rightToLeft", setting.rightToLeft ? setting.rightToLeft : defaultSetting.rightToLeft);
    setCheckValue("displayXAxis", setting.displayXAxis ? setting.displayXAxis : defaultSetting.displayXAxis);

    var type = getDropDownValue("minAxisType");
    updateManual(type, "manualMin");
    type = getDropDownValue("maxAxisType");
    updateManual(type, "manualMax");
}

function getCompatibleSparklineSetting(formulaArgs, row, col) {
    var Calc = GC.Spread.CalcEngine;
    var sparklineSetting = {};

    setTextValue("compatibleSparklineData", unParseFormula(formulaArgs[0], row, col));
    setDropDown("dataOrientationType", formulaArgs[1].value);
    if (formulaArgs[2]) {
        setTextValue("compatibleSparklineDateAxisData", unParseFormula(formulaArgs[2], row, col));
    }
    else {
        setTextValue("compatibleSparklineDateAxisData", "");
    }
    if (formulaArgs[3]) {
        setDropDown("dateAxisOrientationType", formulaArgs[3].value);
    }
    else {
        setDropDown("dateAxisOrientationType", -1);
    }
    var colorExpression = parseColorExpression(formulaArgs[4], row, col);
    if (colorExpression) {
        sparklineSetting = parseSetting(colorExpression);
    }
    updateSparklineSetting(sparklineSetting);
    updateStyleSetting(sparklineSetting);
}

function getScatterSparklineSetting(formulaArgs, row, col) {
    var Calc = GC.Spread.CalcEngine;
    var defaultValue = {
        tags: false,
        drawSymbol: true,
        drawLines: false,
        dash: false,
        color1: "#969696",
        color2: "#CB0000"
    };
    var inputList = ["scatterSparklinePoints1", "scatterSparklinePoints2", "scatterSparklineMinX", "scatterSparklineMaxX",
        "scatterSparklineMinY", "scatterSparklineMaxY", "scatterSparklineHLine", "scatterSparklineVLine",
        "scatterSparklineXMinZone", "scatterSparklineXMaxZone", "scatterSparklineYMinZone", "scatterSparklineYMaxZone"];
    for (var i = 0; i < inputList.length; i++) {
        var formula = "";
        if (formulaArgs[i]) {
            formula = unParseFormula(formulaArgs[i], row, col);
        }
        setTextValue(inputList[i], formula);
    }

    var color1 = parseColorExpression(formulaArgs[15], row, col);
    var color2 = parseColorExpression(formulaArgs[16], row, col);
    var tags = formulaArgs[12] && formulaArgs[12].type === GC.Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[12].value : null;
    var drawSymbol = formulaArgs[13] && formulaArgs[13].type === GC.Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[13].value : null;
    var drawLines = formulaArgs[14] && formulaArgs[14].type === GC.Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[14].value : null;
    var dashLine = formulaArgs[17] && formulaArgs[17].type === GC.Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[17].value : null;

    setColorValue("scatterSparklineColor1", (color1 !== null) ? color1 : defaultValue.color1);
    setColorValue("scatterSparklineColor2", (color2 !== null) ? color2 : defaultValue.color2);
    setCheckValue("scatterSparklineTags", tags !== null ? tags : defaultValue.tags);
    setCheckValue("scatterSparklineDrawSymbol", drawSymbol !== null ? drawSymbol : defaultValue.drawSymbol);
    setCheckValue("scatterSparklineDrawLines", drawLines !== null ? drawLines : defaultValue.drawLines);
    setCheckValue("scatterSparklineDashLine", dashLine !== null ? dashLine : defaultValue.dash);
}

function getHBarSparklineSetting(formulaArgs, row, col) {
    var defaultValue = {colorScheme: "#969696"};

    var value = unParseFormula(formulaArgs[0], row, col);
    var colorScheme = parseColorExpression(formulaArgs[1], row, col);

    setTextValue("hbarSparklineValue", value);
    setColorValue("hbarSparklineColorScheme", (colorScheme !== null) ? colorScheme : defaultValue.colorScheme);
}

function getVBarSparklineSetting(formulaArgs, row, col) {
    var defaultValue = {colorScheme: "#969696"};

    var value = unParseFormula(formulaArgs[0], row, col);
    var colorScheme = parseColorExpression(formulaArgs[1], row, col);

    setTextValue("vbarSparklineValue", value);
    setColorValue("vbarSparklineColorScheme", (colorScheme !== null) ? colorScheme : defaultValue.colorScheme);
}

function getParetoSparklineSetting(formulaArgs, row, col) {
    var Calc = GC.Spread.CalcEngine;
    var defaultValue = {label: 0, vertical: false};

    if (formulaArgs && formulaArgs.length > 0) {
        var pointsRangeValue = unParseFormula(formulaArgs[0], row, col);
        var pointIndexValue = unParseFormula(formulaArgs[1], row, col);
        var colorRangeValue = unParseFormula(formulaArgs[2], row, col);
        var targetValue = unParseFormula(formulaArgs[3], row, col);
        var target2Value = unParseFormula(formulaArgs[4], row, col);
        var highlightPositionValue = unParseFormula(formulaArgs[5], row, col);
        var labelValue = formulaArgs[6] && formulaArgs[6].type === GC.Spread.CalcEngine.ExpressionType.number ? formulaArgs[6].value : null;
        var verticalValue = formulaArgs[7] && formulaArgs[7].type === GC.Spread.CalcEngine.ExpressionType.number ? formulaArgs[7].value : null;

        setTextValue("paretoSparklinePoints", pointsRangeValue);
        setTextValue("paretoSparklinePointIndex", pointIndexValue);
        setTextValue("paretoSparklineColorRange", colorRangeValue);
        setTextValue("paretoSparklineHighlightPosition", highlightPositionValue);
        setTextValue("paretoSparklineTarget", targetValue);
        setTextValue("paretoSparklineTarget2", target2Value);
        setDropDown("paretoLabelType", labelValue === null ? defaultValue.label : labelValue);
        setCheckValue("paretoSparklineVertical", verticalValue === null ? defaultValue.vertical : verticalValue);
    }
    else {
        setTextValue("paretoSparklinePoints", "");
        setTextValue("paretoSparklinePointIndex", "");
        setTextValue("paretoSparklineColorRange", "");
        setTextValue("paretoSparklineHighlightPosition", "");
        setTextValue("paretoSparklineTarget", "");
        setTextValue("paretoSparklineTarget2", "");
        setDropDown("paretoLabelType", defaultValue.label);
        setCheckValue("paretoSparklineVertical", defaultValue.vertical);
    }
}

function getSpreadSparklineSetting(formulaArgs, row, col) {
    var Calc = GC.Spread.CalcEngine;
    var defaultValue = {showAverage: false, style: 4, colorScheme: "#646464", vertical: false};

    if (formulaArgs && formulaArgs.length > 0) {
        var pointsValue = unParseFormula(formulaArgs[0], row, col);
        var showAverageValue = formulaArgs[1] && formulaArgs[1].type === GC.Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[1].value : null;
        var scaleStartValue = unParseFormula(formulaArgs[2], row, col);
        var scaleEndValue = unParseFormula(formulaArgs[3], row, col);
        var styleValue = formulaArgs[4] ? unParseFormula(formulaArgs[4], row, col) : null;
        var colorSchemeValue = parseColorExpression(formulaArgs[5], row, col);
        var verticalValue = formulaArgs[6] && formulaArgs[6].type === GC.Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[6].value : null;

        setTextValue("spreadSparklinePoints", pointsValue);
        setCheckValue("spreadSparklineShowAverage", showAverageValue ? showAverageValue : defaultValue.showAverage);
        setTextValue("spreadSparklineScaleStart", scaleStartValue);
        setTextValue("spreadSparklineScaleEnd", scaleEndValue);
        setDropDown("spreadSparklineStyleType", styleValue ? styleValue : defaultValue.style);
        setColorValue("spreadSparklineColorScheme", colorSchemeValue ? colorSchemeValue : defaultValue.colorScheme);
        setCheckValue("spreadSparklineVertical", verticalValue ? verticalValue : defaultValue.vertical);
    }
    else {
        setTextValue("spreadSparklinePoints", "");
        setCheckValue("spreadSparklineShowAverage", defaultValue.showAverage);
        setTextValue("spreadSparklineScaleStart", "");
        setTextValue("spreadSparklineScaleEnd", "");
        setDropDown("spreadSparklineStyleType", defaultValue.style);
        setColorValue("spreadSparklineColorScheme", defaultValue.colorScheme);
        setCheckValue("spreadSparklineVertical", defaultValue.vertical);
    }
}

function getStackedSparklineSetting(formulaArgs, row, col) {
    var Calc = GC.Spread.CalcEngine;
    var defaultValue = {color: "#646464", vertical: false, textOrientation: 0};

    if (formulaArgs && formulaArgs.length > 0) {
        var pointsValue = unParseFormula(formulaArgs[0], row, col);
        var colorRangeValue = unParseFormula(formulaArgs[1], row, col);
        var labelRangeValue = unParseFormula(formulaArgs[2], row, col);
        var maximumValue = unParseFormula(formulaArgs[3], row, col);
        var targetRedValue = unParseFormula(formulaArgs[4], row, col);
        var targetGreenValue = unParseFormula(formulaArgs[5], row, col);
        var targetBlueValue = unParseFormula(formulaArgs[6], row, col);
        var targetYellowValue = unParseFormula(formulaArgs[7], row, col);
        var colorValue = parseColorExpression(formulaArgs[8], row, col);
        var highlightPositionValue = unParseFormula(formulaArgs[9], row, col);
        var verticalValue = formulaArgs[10] && formulaArgs[10].type === GC.Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[10].value : null;
        var textOrientationValue = unParseFormula(formulaArgs[11], row, col);
        var textSizeValue = unParseFormula(formulaArgs[12], row, col);

        setTextValue("stackedSparklinePoints", pointsValue);
        setTextValue("stackedSparklineColorRange", colorRangeValue);
        setTextValue("stackedSparklineLabelRange", labelRangeValue);
        setNumberValue("stackedSparklineMaximum", maximumValue);
        setNumberValue("stackedSparklineTargetRed", targetRedValue);
        setNumberValue("stackedSparklineTargetGreen", targetGreenValue);
        setNumberValue("stackedSparklineTargetBlue", targetBlueValue);
        setNumberValue("stackedSparklineTargetYellow", targetYellowValue);
        setColorValue("stackedSparklineColor", "stacked-color-span", colorValue ? colorValue : defaultValue.color);
        setNumberValue("stackedSparklineHighlightPosition", highlightPositionValue);
        setCheckValue("stackedSparklineVertical", verticalValue ? verticalValue : defaultValue.vertical);
        setDropDown("stackedSparklineTextOrientation", textOrientationValue ? textOrientationValue : defaultValue.textOrientation);
        setNumberValue("stackedSparklineTextSize", textSizeValue);
    }
    else {
        setTextValue("stackedSparklinePoints", "");
        setTextValue("stackedSparklineColorRange", "");
        setTextValue("stackedSparklineLabelRange", "");
        setNumberValue("stackedSparklineMaximum", "");
        setNumberValue("stackedSparklineTargetRed", "");
        setNumberValue("stackedSparklineTargetGreen", "");
        setNumberValue("stackedSparklineTargetBlue", "");
        setNumberValue("stackedSparklineTargetYellow", "");
        setColorValue("stackedSparklineColor", "stacked-color-span", defaultValue.color);
        setNumberValue("stackedSparklineHighlightPosition", "");
        setCheckValue("stackedSparklineVertical", defaultValue.vertical);
        setDropDown("stackedSparklineTextOrientation", defaultValue.textOrientation);
        setNumberValue("stackedSparklineTextSize", "");
    }
}

function getVariSparklineSetting(formulaArgs, row, col) {
    var Calc = spreadNS.Calc;
    var defaultValue = {legend: false, colorPositive: "green", colorNegative: "red", vertical: false};

    if (formulaArgs && formulaArgs.length > 0) {
        var varianceValue = unParseFormula(formulaArgs[0], row, col);
        var referenceValue = unParseFormula(formulaArgs[1], row, col);
        var miniValue = unParseFormula(formulaArgs[2], row, col);
        var maxiValue = unParseFormula(formulaArgs[3], row, col);
        var markValue = unParseFormula(formulaArgs[4], row, col);
        var tickunitValue = unParseFormula(formulaArgs[5], row, col);
        var legendValue = formulaArgs[6] && formulaArgs[6].type === GC.Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[6].value : null;
        var colorPositiveValue = parseColorExpression(formulaArgs[7], row, col);
        var colorNegativeValue = parseColorExpression(formulaArgs[8], row, col);
        var verticalValue = formulaArgs[9] && formulaArgs[9].type === GC.Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[9].value : null;

        setTextValue("variSparklineVariance", varianceValue);
        setTextValue("variSparklineReference", referenceValue);
        setTextValue("variSparklineMini", miniValue);
        setTextValue("variSparklineMaxi", maxiValue);
        setTextValue("variSparklineMark", markValue);
        setTextValue("variSparklineTickUnit", tickunitValue);
        setColorValue("variSparklineColorPositive", colorPositiveValue ? colorPositiveValue : defaultValue.colorPositive);
        setColorValue("variSparklineColorNegative", colorNegativeValue ? colorNegativeValue : defaultValue.colorNegative);
        setCheckValue("variSparklineLegend", legendValue);
        setCheckValue("variSparklineVertical", verticalValue);
    }
    else {
        setTextValue("variSparklineVariance", "");
        setTextValue("variSparklineReference", "");
        setTextValue("variSparklineMini", "");
        setTextValue("variSparklineMaxi", "");
        setTextValue("variSparklineMark", "");
        setTextValue("variSparklineTickUnit", "");
        setColorValue("variSparklineColorPositive", defaultValue.colorPositive);
        setColorValue("variSparklineColorNegative", defaultValue.colorNegative);
        setCheckValue("variSparklineLegend", defaultValue.legend);
        setCheckValue("variSparklineVertical", defaultValue.vertical);
    }
}

function addPieSparklineColor(count, color, isMinusSymbol) {
    var defaultColor = "rgb(237, 237, 237)";
    color = color ? color : defaultColor;
    var symbolFunClass, symbolClass;
    if (isMinusSymbol) {
        symbolFunClass = "remove-pie-color";
        symbolClass = "ui-pie-sparkline-icon-minus";
    }
    else {
        symbolFunClass = "add-pie-color";
        symbolClass = "ui-pie-sparkline-icon-plus";
    }
    var $pieSparklineColorContainer = $("#pieSparklineColorContainer");
    var pieColorDataName = "pieColorName";

    var $colorDiv = $("#pie-color-item-template").children().clone();
    $('label', $colorDiv).text(uiResource.sparklineExTab.pieSparkline.values.color + count);
    $('.pane-color-picker', $colorDiv).attr('data-name', pieColorDataName + count);
    $('.color-picker', $colorDiv).css('background-color', color);
    $('.insp-inline-row-item', $colorDiv).addClass(symbolFunClass);
    $('.ui-pie-sparkline-icon', $colorDiv).addClass(symbolClass);

    $colorDiv.appendTo($pieSparklineColorContainer);
}

function addPieColor(count, color, isMinusSymbol) {
    var $colorSpanDiv = $(".add-pie-color");
    $colorSpanDiv.addClass("remove-pie-color").removeClass("add-pie-color");
    $colorSpanDiv.find("span").addClass("ui-pie-sparkline-icon-minus").removeClass("ui-pie-sparkline-icon-plus");
    addPieSparklineColor(count, color, isMinusSymbol);
    $(".add-pie-color").unbind("click");
    $(".add-pie-color").bind("click", function (evt) {
        var count = $("#pieSparklineColorContainer").find("span").length;
        addPieColor(count + 1);
    });
    $(".remove-pie-color").unbind("click");
    $(".remove-pie-color").bind("click", function (evt) {
        resetPieColor($(evt.target));
    });
}

function resetPieColor($colorSpanDiv) {
    if (!$colorSpanDiv.hasClass("ui-pie-sparkline-icon")) {
        return;
    }
    var $colorDiv = $colorSpanDiv.closest('div.pane-row');
    $colorDiv.remove();
    var $pieSparklineColorContainer = $("#pieSparklineColorContainer");
    var colorArray = [];
    $pieSparklineColorContainer.find(".color-picker").each(function () {
        colorArray.push($(this).css("background-color"));
    });
    $pieSparklineColorContainer.empty();
    addMultiPieColor(colorArray);
}

function addMultiPieColor(colorArray) {
    if (!colorArray || colorArray.length === 0) {
        return;
    }
    var length = colorArray.length;
    var i = 0;
    for (i; i < length - 1; i++) {
        addPieSparklineColor(i + 1, colorArray[i], true);
    }
    addPieColor(i + 1, colorArray[i]);
}

function getPieSparklineSetting(formulaArgs, row, col) {
    var Calc = GC.Spread.CalcEngine;
    var defaultValue = {legend: false, colorPositive: "green", colorNegative: "red", vertical: false};

    var agrsLength = formulaArgs.length;
    if (formulaArgs && agrsLength > 0) {
        var range = unParseFormula(formulaArgs[0], row, col);
        setTextValue("pieSparklinePercentage", range);

        var actualLen = agrsLength - 1;
        if (actualLen === 0) {
            addPieColor(1);
        }
        else {
            var colorArray = [];
            for (var i = 1; i <= actualLen; i++) {
                var colorItem = null;
                var color = parseColorExpression(formulaArgs[i], row, col);
                colorArray.push(color);
            }
            addMultiPieColor(colorArray);
        }
    }
}

function getQRCodeSparklineSetting(formulaArgs, row, col){
    var defaultValue = {color: "#000", backgroundColor: "#fff", level: "L", model: 2, version: "auto", mask: "auto", connection: false, connectionNo: 0, charCode: "", charset: "UTF-8", quietZoneLeft: 4, quietZoneRight: 4, quietZoneTop: 4, quietZoneBottom: 4};
    if(formulaArgs){
        var dataRangestr = unParseFormula(formulaArgs[0], row, col),
            color = parseColorExpression(formulaArgs[1], row, col),
            backgroundColor = parseColorExpression(formulaArgs[2], row, col),
            level = unParseFormula(formulaArgs[3], row, col),
            model = unParseFormula(formulaArgs[4], row, col),
            version = unParseFormula(formulaArgs[5], row, col),
            mask = unParseFormula(formulaArgs[6], row, col),
            connection = formulaArgs[7]  && formulaArgs[7].value,
            connectionNo = unParseFormula(formulaArgs[8], row, col),
            charCode = unParseFormula(formulaArgs[9], row, col),
            charset = unParseFormula(formulaArgs[10], row, col),
            quietZoneLeft = unParseFormula(formulaArgs[11], row, col),
            quietZoneRight = unParseFormula(formulaArgs[12], row, col),
            quietZoneTop = unParseFormula(formulaArgs[13], row, col),
            quietZoneBottom = unParseFormula(formulaArgs[14], row, col);

        setTextValue("qrCodeData", dataRangestr);
        setColorValue("qrCodeColor", color ? color : defaultValue.color);
        setColorValue("qrCodeBackgroundColor", backgroundColor ? backgroundColor : defaultValue.backgroundColor);
        setDropDown("qrCodeLevel", level ? unparseSparklineStringOptions(level) : defaultValue.level);
        setDropDown("qrCodeModel", model ? model : defaultValue.model);
        setDropDown("qrCodeVersion", version ? unparseSparklineStringOptions(version) : defaultValue.version);
        setDropDown("qrCodeMask", mask ? unparseSparklineStringOptions(mask) : defaultValue.mask);
        setCheckValue("qrCodeConnection", connection);
        setDropDown("qrCodeConnectionNo", connectionNo ? connectionNo : defaultValue.connectionNo);
        setDropDown("qrCodeCharset", charset ? unparseSparklineStringOptions(charset) : defaultValue.charset);
        setTextValue("qrCodeCharCode", charCode ? unparseBraceOptions(charCode) : defaultValue.charCode);
        setNumberValue("qrCodeLeft", quietZoneLeft ? quietZoneLeft : defaultValue.quietZoneLeft);
        setNumberValue("qrCodeRight", quietZoneRight ? quietZoneRight : defaultValue.quietZoneRight);
        setNumberValue("qrCodeTop", quietZoneTop ? quietZoneTop : defaultValue.quietZoneTop);
        setNumberValue("qrCodeBottom", quietZoneBottom ? quietZoneBottom : defaultValue.quietZoneBottom);
    }
    else {
        setTextValue("qrCodeData", "");
        setColorValue("qrCodeColor", defaultValue.color);
        setColorValue("qrCodeBackgroundColor", defaultValue.backgroundColor);
        setDropDown("qrCodeLevel", defaultValue.level);
        setDropDown("qrCodeModel", defaultValue.model);
        setDropDown("qrCodeVersion", defaultValue.version);
        setDropDown("qrCodeMask", defaultValue.mask);
        setCheckValue("qrCodeConnection", defaultValue.connection);
        setDropDown("qrCodeConnectionNo", defaultValue.connectionNo);
        setDropDown("qrCodeCharset", defaultValue.charCode);
        setTextValue("qrCodeCharCode", defaultValue.charset);
        setNumberValue("qrCodeLeft", quietZoneLeft ? quietZoneLeft : defaultValue.quietZoneLeft);
        setNumberValue("qrCodeRight", quietZoneRight ? quietZoneRight : defaultValue.quietZoneRight);
        setNumberValue("qrCodeTop", quietZoneTop ? quietZoneTop : defaultValue.quietZoneTop);
        setNumberValue("qrCodeBottom", quietZoneBottom ? quietZoneBottom : defaultValue.quietZoneBottom);
    }
}

function getEAN8SparklineSetting(formulaArgs, row, col){
    var defaultValue = {color: "#000", backgroundColor: "#fff", showLabel: 1, labelPosition: "bottom", fontFamily: "sans-serif", fontStyle: "normal", fontWeight: "normal", fontTextDecoration: "none", fontTextAlign: "center", fontSize: 12, quietZoneLeft: 11, quietZoneRight: 7, quietZoneTop: 0, quietZoneBottom: 0};
    if(formulaArgs){
        var dataRangestr = unParseFormula(formulaArgs[0], row, col),
            color = parseColorExpression(formulaArgs[1], row, col),
            backgroundColor = parseColorExpression(formulaArgs[2], row, col),
            showLabel = unParseFormula(formulaArgs[3], row, col),
            labelPosition = unParseFormula(formulaArgs[4], row, col),
            fontFamily = unParseFormula(formulaArgs[5], row, col),
            fontStyle = unParseFormula(formulaArgs[6], row, col),
            fontWeight = unParseFormula(formulaArgs[7], row, col),
            fontTextDecoration = unParseFormula(formulaArgs[8], row, col),
            fontTextAlign = unParseFormula(formulaArgs[9], row, col),
            fontSize = unParseFormula(formulaArgs[10], row, col),
            quietZoneLeft = unParseFormula(formulaArgs[11], row, col),
            quietZoneRight = unParseFormula(formulaArgs[12], row, col),
            quietZoneTop = unParseFormula(formulaArgs[13], row, col),
            quietZoneBottom = unParseFormula(formulaArgs[14], row, col);

        setTextValue("ean8Data", dataRangestr);
        setColorValue("ean8Color", color ? color : defaultValue.color);
        setColorValue("ean8BackgroundColor", backgroundColor ? backgroundColor : defaultValue.backgroundColor);
        setNumberValue("ean8ShowLabel", showLabel ? showLabel : defaultValue.showLabel);
        setDropDown("ean8LabelPosition", labelPosition ? unparseSparklineStringOptions(labelPosition) : defaultValue.labelPosition);
        setDropDown("ean8FontFamily", fontFamily ? unparseSparklineStringOptions(fontFamily) : defaultValue.fontFamily);
        setDropDown("ean8FontStyle", fontStyle ? unparseSparklineStringOptions(fontStyle) : defaultValue.fontStyle);
        setDropDown("ean8FontWeight", fontWeight ? unparseSparklineStringOptions(fontWeight) : defaultValue.fontWeight);
        setDropDown("ean8FontTextDecoration", fontTextDecoration ? unparseSparklineStringOptions(fontTextDecoration) : defaultValue.fontTextDecoration);
        setDropDown("ean8FontTextAlign", fontTextAlign ? unparseSparklineStringOptions(fontTextAlign) : defaultValue.fontTextAlign);
        setDropDown("ean8FontSize", fontSize ? fontSize : defaultValue.fontSize);
        setNumberValue("ean8Left", quietZoneLeft ? quietZoneLeft : defaultValue.quietZoneLeft);
        setNumberValue("ean8Right", quietZoneRight ? quietZoneRight : defaultValue.quietZoneRight);
        setNumberValue("ean8Top", quietZoneTop ? quietZoneTop : defaultValue.quietZoneTop);
        setNumberValue("ean8Bottom", quietZoneBottom ? quietZoneBottom : defaultValue.quietZoneBottom);
    }
    else {
        setTextValue("ean8Data", "");
        setColorValue("ean8Color", defaultValue.color);
        setColorValue("ean8BackgroundColor", defaultValue.backgroundColor);
        setNumberValue("ean8ShowLabel", defaultValue.showLabel);
        setDropDown("ean8LabelPosition",  defaultValue.labelPosition);
        setDropDown("ean8FontFamily", defaultValue.fontFamily);
        setDropDown("ean8FontStyle", defaultValue.fontStyle);
        setDropDown("ean8FontWeight", defaultValue.fontWeight);
        setDropDown("ean8FontTextDecoration", defaultValue.fontTextDecoration);
        setDropDown("ean8FontTextAlign", defaultValue.fontTextAlign);
        setDropDown("ean8FontSize", defaultValue.fontSize);
        setNumberValue("ean8Left", defaultValue.quietZoneLeft);
        setNumberValue("ean8Right", defaultValue.quietZoneRight);
        setNumberValue("ean8Top", defaultValue.quietZoneTop);
        setNumberValue("ean8Bottom",defaultValue.quietZoneBottom);
    }
}

function getEAN13SparklineSetting(formulaArgs, row, col){
    var defaultValue = {color: "#000", backgroundColor: "#fff", showLabel: 1, labelPosition: "bottom", addOn: "", addOnLabelPosition: "bottom", fontFamily: "sans-serif", fontStyle: "normal", fontWeight: "normal", fontTextDecoration: "none", fontTextAlign: "center", fontSize: 12, quietZoneLeft: 11, quietZoneRight: 7, quietZoneTop: 0, quietZoneBottom: 0};
    if(formulaArgs){
        var dataRangestr = unParseFormula(formulaArgs[0], row, col),
            color = parseColorExpression(formulaArgs[1], row, col),
            backgroundColor = parseColorExpression(formulaArgs[2], row, col),
            showLabel = unParseFormula(formulaArgs[3], row, col),
            labelPosition = unParseFormula(formulaArgs[4], row, col),
            addOn = unParseFormula(formulaArgs[5], row, col),
            addOnLabelPosition = unParseFormula(formulaArgs[6], row, col),
            fontFamily = unParseFormula(formulaArgs[7], row, col),
            fontStyle = unParseFormula(formulaArgs[8], row, col),
            fontWeight = unParseFormula(formulaArgs[9], row, col),
            fontTextDecoration = unParseFormula(formulaArgs[10], row, col),
            fontTextAlign = unParseFormula(formulaArgs[11], row, col),
            fontSize = unParseFormula(formulaArgs[12], row, col),
            quietZoneLeft = unParseFormula(formulaArgs[13], row, col),
            quietZoneRight = unParseFormula(formulaArgs[14], row, col),
            quietZoneTop = unParseFormula(formulaArgs[15], row, col),
            quietZoneBottom = unParseFormula(formulaArgs[16], row, col);

        setTextValue("ean13Data", dataRangestr);
        setColorValue("ean13Color", color ? color : defaultValue.color);
        setColorValue("ean13BackgroundColor", backgroundColor ? backgroundColor : defaultValue.backgroundColor);
        setNumberValue("ean13ShowLabel", showLabel ? showLabel : defaultValue.showLabel);
        setDropDown("ean13LabelPosition", labelPosition ? unparseSparklineStringOptions(labelPosition) : defaultValue.labelPosition);
        setTextValue("ean13AddOn", addOn ? unparseSparklineStringOptions(addOn) : defaultValue.addOn);
        setDropDown("ean13AddOnLabelPosition", addOnLabelPosition ? unparseSparklineStringOptions(addOnLabelPosition) : defaultValue.addOnLabelPosition);
        setDropDown("ean13FontFamily", fontFamily ? unparseSparklineStringOptions(fontFamily) : defaultValue.fontFamily);
        setDropDown("ean13FontStyle", fontStyle ? unparseSparklineStringOptions(fontStyle) : defaultValue.fontStyle);
        setDropDown("ean13FontWeight", fontWeight ? unparseSparklineStringOptions(fontWeight) : defaultValue.fontWeight);
        setDropDown("ean13FontTextDecoration", fontTextDecoration ? unparseSparklineStringOptions(fontTextDecoration) : defaultValue.fontTextDecoration);
        setDropDown("ean13FontTextAlign", fontTextAlign ? unparseSparklineStringOptions(fontTextAlign) : defaultValue.fontTextAlign);
        setDropDown("ean13FontSize", fontSize ? fontSize : defaultValue.fontSize);
        setNumberValue("ean13Left", quietZoneLeft ? quietZoneLeft : defaultValue.quietZoneLeft);
        setNumberValue("ean13Right", quietZoneRight ? quietZoneRight : defaultValue.quietZoneRight);
        setNumberValue("ean13Top", quietZoneTop ? quietZoneTop : defaultValue.quietZoneTop);
        setNumberValue("ean13Bottom", quietZoneBottom ? quietZoneBottom : defaultValue.quietZoneBottom);
    }
    else {
        setTextValue("ean13Data", "");
        setColorValue("ean13Color", defaultValue.color);
        setColorValue("ean13BackgroundColor", defaultValue.backgroundColor);
        setNumberValue("ean13ShowLabel", defaultValue.showLabel);
        setDropDown("ean13LabelPosition",  defaultValue.labelPosition);
        setTextValue("ean13AddOn",  defaultValue.addOn);
        setDropDown("ean13AddOnLabelPosition",  defaultValue.addOnLabelPosition);
        setDropDown("ean13FontFamily", defaultValue.fontFamily);
        setDropDown("ean13FontStyle", defaultValue.fontStyle);
        setDropDown("ean13FontWeight", defaultValue.fontWeight);
        setDropDown("ean13FontTextDecoration", defaultValue.fontTextDecoration);
        setDropDown("ean13FontTextAlign", defaultValue.fontTextAlign);
        setDropDown("ean13FontSize", defaultValue.fontSize);
        setNumberValue("ean13Left", defaultValue.quietZoneLeft);
        setNumberValue("ean13Right", defaultValue.quietZoneRight);
        setNumberValue("ean13Top", defaultValue.quietZoneTop);
        setNumberValue("ean13Bottom", defaultValue.quietZoneBottom);
    }
}

function getGS1SparklineSetting(formulaArgs, row, col){
    var defaultValue = {color: "#000", backgroundColor: "#fff", showLabel: 1, labelPosition: "bottom", fontFamily: "sans-serif", fontStyle: "normal", fontWeight: "normal", fontTextDecoration: "none", fontTextAlign: "center", fontSize: 12, quietZoneLeft: 10, quietZoneRight: 10, quietZoneTop: 0, quietZoneBottom: 0};
    if(formulaArgs){
        var dataRangestr = unParseFormula(formulaArgs[0], row, col),
            color = parseColorExpression(formulaArgs[1], row, col),
            backgroundColor = parseColorExpression(formulaArgs[2], row, col),
            showLabel = unParseFormula(formulaArgs[3], row, col),
            labelPosition = unParseFormula(formulaArgs[4], row, col),
            fontFamily = unParseFormula(formulaArgs[5], row, col),
            fontStyle = unParseFormula(formulaArgs[6], row, col),
            fontWeight = unParseFormula(formulaArgs[7], row, col),
            fontTextDecoration = unParseFormula(formulaArgs[8], row, col),
            fontTextAlign = unParseFormula(formulaArgs[9], row, col),
            fontSize = unParseFormula(formulaArgs[10], row, col),
            quietZoneLeft = unParseFormula(formulaArgs[11], row, col),
            quietZoneRight = unParseFormula(formulaArgs[12], row, col),
            quietZoneTop = unParseFormula(formulaArgs[13], row, col),
            quietZoneBottom = unParseFormula(formulaArgs[14], row, col);

        setTextValue("gsData", dataRangestr);
        setColorValue("gsColor", color ? color : defaultValue.color);
        setColorValue("gsBackgroundColor", backgroundColor ? backgroundColor : defaultValue.backgroundColor);
        setNumberValue("gsShowLabel", showLabel ? showLabel : defaultValue.showLabel);
        setDropDown("gsLabelPosition", labelPosition ? unparseSparklineStringOptions(labelPosition) : defaultValue.labelPosition);
        setDropDown("gsFontFamily", fontFamily ? unparseSparklineStringOptions(fontFamily) : defaultValue.fontFamily);
        setDropDown("gsFontStyle", fontStyle ? unparseSparklineStringOptions(fontStyle) : defaultValue.fontStyle);
        setDropDown("gsFontWeight", fontWeight ? unparseSparklineStringOptions(fontWeight) : defaultValue.fontWeight);
        setDropDown("gsFontTextDecoration", fontTextDecoration ? unparseSparklineStringOptions(fontTextDecoration) : defaultValue.fontTextDecoration);
        setDropDown("gsFontTextAlign", fontTextAlign ? unparseSparklineStringOptions(fontTextAlign) : defaultValue.fontTextAlign);
        setDropDown("gsFontSize", fontSize ? fontSize : defaultValue.fontSize);
        setNumberValue("gsLeft", quietZoneLeft ? quietZoneLeft : defaultValue.quietZoneLeft);
        setNumberValue("gsRight", quietZoneRight ? quietZoneRight : defaultValue.quietZoneRight);
        setNumberValue("gsTop", quietZoneTop ? quietZoneTop : defaultValue.quietZoneTop);
        setNumberValue("gsBottom", quietZoneBottom ? quietZoneBottom : defaultValue.quietZoneBottom);
    }
    else {
        setTextValue("gsData", "");
        setColorValue("gsColor", defaultValue.color);
        setColorValue("gsBackgroundColor", defaultValue.backgroundColor);
        setNumberValue("gsShowLabel", defaultValue.showLabel);
        setDropDown("gsLabelPosition",  defaultValue.labelPosition);
        setDropDown("gsFontFamily", defaultValue.fontFamily);
        setDropDown("gsFontStyle", defaultValue.fontStyle);
        setDropDown("gsFontWeight", defaultValue.fontWeight);
        setDropDown("gsFontTextDecoration", defaultValue.fontTextDecoration);
        setDropDown("gsFontTextAlign", defaultValue.fontTextAlign);
        setDropDown("gsFontSize", defaultValue.fontSize);
        setNumberValue("gsLeft", defaultValue.quietZoneLeft);
        setNumberValue("gsRight", defaultValue.quietZoneRight);
        setNumberValue("gsTop", defaultValue.quietZoneTop);
        setNumberValue("gsBottom", defaultValue.quietZoneBottom);
    }
}

function getCodabarSparklineSetting(formulaArgs, row, col){
    var defaultValue = {color: "#000", backgroundColor: "#fff", showLabel: 1, labelPosition: "bottom", checkDigit: false, nwRatio: 3, fontFamily: "sans-serif", fontStyle: "normal", fontWeight: "normal", fontTextDecoration: "none", fontTextAlign: "center", fontSize: 12, quietZoneLeft: 10, quietZoneRight: 10, quietZoneTop: 0, quietZoneBottom: 0};
    if(formulaArgs){
        var dataRangestr = unParseFormula(formulaArgs[0], row, col),
            color = parseColorExpression(formulaArgs[1], row, col),
            backgroundColor = parseColorExpression(formulaArgs[2], row, col),
            showLabel = unParseFormula(formulaArgs[3], row, col),
            labelPosition = unParseFormula(formulaArgs[4], row, col),
            checkDigit = formulaArgs[5] && formulaArgs[5].value,
            nwRatio = unParseFormula(formulaArgs[6], row, col),
            fontFamily = unParseFormula(formulaArgs[7], row, col),
            fontStyle = unParseFormula(formulaArgs[8], row, col),
            fontWeight = unParseFormula(formulaArgs[9], row, col),
            fontTextDecoration = unParseFormula(formulaArgs[10], row, col),
            fontTextAlign = unParseFormula(formulaArgs[11], row, col),
            fontSize = unParseFormula(formulaArgs[12], row, col),
            quietZoneLeft = unParseFormula(formulaArgs[13], row, col),
            quietZoneRight = unParseFormula(formulaArgs[14], row, col),
            quietZoneTop = unParseFormula(formulaArgs[15], row, col),
            quietZoneBottom = unParseFormula(formulaArgs[16], row, col);

        setTextValue("codabarData", dataRangestr);
        setColorValue("codabarColor", color ? color : defaultValue.color);
        setColorValue("codabarBackgroundColor", backgroundColor ? backgroundColor : defaultValue.backgroundColor);
        setNumberValue("codabarShowLabel", showLabel ? showLabel : defaultValue.showLabel);
        setDropDown("codabarLabelPosition", labelPosition ? unparseSparklineStringOptions(labelPosition) : defaultValue.labelPosition);
        setCheckValue("codabarCheckDigit", checkDigit ? checkDigit : defaultValue.checkDigit);
        setDropDown("codabarNwRatio", nwRatio ? nwRatio : defaultValue.nwRatio);
        setDropDown("codabarFontFamily", fontFamily ? unparseSparklineStringOptions(fontFamily) : defaultValue.fontFamily);
        setDropDown("codabarFontStyle", fontStyle ? unparseSparklineStringOptions(fontStyle) : defaultValue.fontStyle);
        setDropDown("codabarFontWeight", fontWeight ? unparseSparklineStringOptions(fontWeight) : defaultValue.fontWeight);
        setDropDown("codabarFontTextDecoration", fontTextDecoration ? unparseSparklineStringOptions(fontTextDecoration) : defaultValue.fontTextDecoration);
        setDropDown("codabarFontTextAlign", fontTextAlign ? unparseSparklineStringOptions(fontTextAlign) : defaultValue.fontTextAlign);
        setDropDown("codabarFontSize", fontSize ? fontSize : defaultValue.fontSize);
        setNumberValue("codabarLeft", quietZoneLeft ? quietZoneLeft : defaultValue.quietZoneLeft);
        setNumberValue("codabarRight", quietZoneRight ? quietZoneRight : defaultValue.quietZoneRight);
        setNumberValue("codabarTop", quietZoneTop ? quietZoneTop : defaultValue.quietZoneTop);
        setNumberValue("codabarBottom", quietZoneBottom ? quietZoneBottom : defaultValue.quietZoneBottom);

    }
    else {
        setTextValue("codabarData", "");
        setColorValue("codabarColor", defaultValue.color);
        setColorValue("codabarBackgroundColor", defaultValue.backgroundColor);
        setNumberValue("codabarShowLabel", defaultValue.showLabel);
        setDropDown("codabarLabelPosition",  defaultValue.labelPosition);
        setCheckValue("codabarCheckDigit", defaultValue.checkDigit);
        setDropDown("codabarNwRatio", defaultValue.nwRatio);
        setDropDown("codabarFontFamily", defaultValue.fontFamily);
        setDropDown("codabarFontStyle", defaultValue.fontStyle);
        setDropDown("codabarFontWeight", defaultValue.fontWeight);
        setDropDown("codabarFontTextDecoration", defaultValue.fontTextDecoration);
        setDropDown("codabarFontTextAlign", defaultValue.fontTextAlign);
        setDropDown("codabarFontSize", defaultValue.fontSize);
        setNumberValue("codabarLeft", defaultValue.quietZoneLeft);
        setNumberValue("codabarRight", defaultValue.quietZoneRight);
        setNumberValue("codabarTop", defaultValue.quietZoneTop);
        setNumberValue("codabarBottom", defaultValue.quietZoneBottom);
    }
}

function getCode93SparklineSetting(formulaArgs, row, col){
    var defaultValue = {color: "#000", backgroundColor: "#fff", showLabel: 1, labelPosition: "bottom", checkDigit: false, fullASCII: false, fontFamily: "sans-serif", fontStyle: "normal", fontWeight: "normal", fontTextDecoration: "none", fontTextAlign: "center", fontSize: 12, quietZoneLeft: 10, quietZoneRight: 10, quietZoneTop: 0, quietZoneBottom: 0};
    if(formulaArgs){
        var dataRangestr = unParseFormula(formulaArgs[0], row, col),
            color = parseColorExpression(formulaArgs[1], row, col),
            backgroundColor = parseColorExpression(formulaArgs[2], row, col),
            showLabel = unParseFormula(formulaArgs[3], row, col),
            labelPosition = unParseFormula(formulaArgs[4], row, col),
            checkDigit = formulaArgs[5] && formulaArgs[5].value,
            fullASCII = formulaArgs[6] && formulaArgs[6].value,
            fontFamily = unParseFormula(formulaArgs[7], row, col),
            fontStyle = unParseFormula(formulaArgs[8], row, col),
            fontWeight = unParseFormula(formulaArgs[9], row, col),
            fontTextDecoration = unParseFormula(formulaArgs[10], row, col),
            fontTextAlign = unParseFormula(formulaArgs[11], row, col),
            fontSize = unParseFormula(formulaArgs[12], row, col),
            quietZoneLeft = unParseFormula(formulaArgs[13], row, col),
            quietZoneRight = unParseFormula(formulaArgs[14], row, col),
            quietZoneTop = unParseFormula(formulaArgs[15], row, col),
            quietZoneBottom = unParseFormula(formulaArgs[16], row, col);

        setTextValue("code93Data", dataRangestr);
        setColorValue("code93Color", color ? color : defaultValue.color);
        setColorValue("code93BackgroundColor", backgroundColor ? backgroundColor : defaultValue.backgroundColor);
        setNumberValue("code93ShowLabel", showLabel ? showLabel : defaultValue.showLabel);
        setDropDown("code93LabelPosition", labelPosition ? unparseSparklineStringOptions(labelPosition) : defaultValue.labelPosition);
        setCheckValue("code93CheckDigit", checkDigit ? checkDigit : defaultValue.checkDigit);
        setCheckValue("code93FullASCII", fullASCII ? fullASCII : defaultValue.fullASCII);
        setDropDown("code93FontFamily", fontFamily ? unparseSparklineStringOptions(fontFamily) : defaultValue.fontFamily);
        setDropDown("code93FontStyle", fontStyle ? unparseSparklineStringOptions(fontStyle) : defaultValue.fontStyle);
        setDropDown("code93FontWeight", fontWeight ? unparseSparklineStringOptions(fontWeight) : defaultValue.fontWeight);
        setDropDown("code93FontTextDecoration", fontTextDecoration ? unparseSparklineStringOptions(fontTextDecoration) : defaultValue.fontTextDecoration);
        setDropDown("code93FontTextAlign", fontTextAlign ? unparseSparklineStringOptions(fontTextAlign) : defaultValue.fontTextAlign);
        setDropDown("code93FontSize", fontSize ? fontSize : defaultValue.fontSize);
        setNumberValue("code93Left", quietZoneLeft ? quietZoneLeft : defaultValue.quietZoneLeft);
        setNumberValue("code93Right", quietZoneRight ? quietZoneRight : defaultValue.quietZoneRight);
        setNumberValue("code93Top", quietZoneTop ? quietZoneTop : defaultValue.quietZoneTop);
        setNumberValue("code93Bottom", quietZoneBottom ? quietZoneBottom : defaultValue.quietZoneBottom);

    }
    else {
        setTextValue("code93Data", "");
        setColorValue("code93Color", defaultValue.color);
        setColorValue("code93BackgroundColor", defaultValue.backgroundColor);
        setNumberValue("code93ShowLabel", defaultValue.showLabel);
        setDropDown("code93LabelPosition",  defaultValue.labelPosition);
        setCheckValue("code93CheckDigit", defaultValue.checkDigit);
        setCheckValue("code93FullASCII", defaultValue.fullASCII);
        setDropDown("code93FontFamily", defaultValue.fontFamily);
        setDropDown("code93FontStyle", defaultValue.fontStyle);
        setDropDown("code93FontWeight", defaultValue.fontWeight);
        setDropDown("code93FontTextDecoration", defaultValue.fontTextDecoration);
        setDropDown("code93FontTextAlign", defaultValue.fontTextAlign);
        setDropDown("code93FontSize", defaultValue.fontSize);
        setNumberValue("code93Left", defaultValue.quietZoneLeft);
        setNumberValue("code93Right", defaultValue.quietZoneRight);
        setNumberValue("code93Top", defaultValue.quietZoneTop);
        setNumberValue("code93Bottom", defaultValue.quietZoneBottom);
    }
}

function getCode39SparklineSetting(formulaArgs, row, col){
    var defaultValue = {color: "#000", backgroundColor: "#fff", showLabel: 1, labelPosition: "bottom", checkDigit: false, fullASCII: false, labelWithStartAndStopCharacter: false, nwRatio: 3, fontFamily: "sans-serif", fontStyle: "normal", fontWeight: "normal", fontTextDecoration: "none", fontTextAlign: "center", fontSize: 12, quietZoneLeft: 10, quietZoneRight: 10, quietZoneTop: 0, quietZoneBottom: 0};
    if(formulaArgs){
        var dataRangestr = unParseFormula(formulaArgs[0], row, col),
            color = parseColorExpression(formulaArgs[1], row, col),
            backgroundColor = parseColorExpression(formulaArgs[2], row, col),
            showLabel = unParseFormula(formulaArgs[3], row, col),
            labelPosition = unParseFormula(formulaArgs[4], row, col),
            character = formulaArgs[5] && formulaArgs[5].value,
            nwRatio = unParseFormula(formulaArgs[7], row, col),
            checkDigit = formulaArgs[6] && formulaArgs[6].value,
            fullASCII = formulaArgs[8] && formulaArgs[8].value,
            fontFamily = unParseFormula(formulaArgs[9], row, col),
            fontStyle = unParseFormula(formulaArgs[10], row, col),
            fontWeight = unParseFormula(formulaArgs[11], row, col),
            fontTextDecoration = unParseFormula(formulaArgs[12], row, col),
            fontTextAlign = unParseFormula(formulaArgs[13], row, col),
            fontSize = unParseFormula(formulaArgs[14], row, col),
            quietZoneLeft = unParseFormula(formulaArgs[15], row, col),
            quietZoneRight = unParseFormula(formulaArgs[16], row, col),
            quietZoneTop = unParseFormula(formulaArgs[17], row, col),
            quietZoneBottom = unParseFormula(formulaArgs[18], row, col);

        setTextValue("code39Data", dataRangestr);
        setColorValue("code39Color", color ? color : defaultValue.color);
        setColorValue("code39BackgroundColor", backgroundColor ? backgroundColor : defaultValue.backgroundColor);
        setNumberValue("code39ShowLabel", showLabel ? showLabel : defaultValue.showLabel);
        setDropDown("code39LabelPosition", labelPosition ? unparseSparklineStringOptions(labelPosition) : defaultValue.labelPosition);
        setCheckValue("Code39Character", character ? character : defaultValue.character);
        setDropDown("code39NWRatio", nwRatio ? nwRatio : defaultValue.nwRatio);
        setCheckValue("code39CheckDigit", checkDigit ? checkDigit : defaultValue.checkDigit);
        setCheckValue("code39FullASCII", fullASCII ? fullASCII : defaultValue.fullASCII);
        setDropDown("code39FontFamily", fontFamily ? unparseSparklineStringOptions(fontFamily) : defaultValue.fontFamily);
        setDropDown("code39FontStyle", fontStyle ? unparseSparklineStringOptions(fontStyle) : defaultValue.fontStyle);
        setDropDown("code39FontWeight", fontWeight ? unparseSparklineStringOptions(fontWeight) : defaultValue.fontWeight);
        setDropDown("code39FontTextDecoration", fontTextDecoration ? unparseSparklineStringOptions(fontTextDecoration) : defaultValue.fontTextDecoration);
        setDropDown("code39FontTextAlign", fontTextAlign ? unparseSparklineStringOptions(fontTextAlign) : defaultValue.fontTextAlign);
        setDropDown("code39FontSize", fontSize ? fontSize : defaultValue.fontSize);
        setNumberValue("code39Left", quietZoneLeft ? quietZoneLeft : defaultValue.quietZoneLeft);
        setNumberValue("code39Right", quietZoneRight ? quietZoneRight : defaultValue.quietZoneRight);
        setNumberValue("code39Top", quietZoneTop ? quietZoneTop : defaultValue.quietZoneTop);
        setNumberValue("code39Bottom", quietZoneBottom ? quietZoneBottom : defaultValue.quietZoneBottom);

    }
    else {
        setTextValue("code39Data", "");
        setColorValue("code39Color", defaultValue.color);
        setColorValue("code39BackgroundColor", defaultValue.backgroundColor);
        setNumberValue("code39ShowLabel", defaultValue.showLabel);
        setDropDown("code39LabelPosition",  defaultValue.labelPosition);
        setCheckValue("Code39Character", defaultValue.character);
        setDropDown("code39NWRatio",defaultValue.nwRatio);
        setCheckValue("code39CheckDigit", defaultValue.checkDigit);
        setCheckValue("code39FullASCII", defaultValue.fullASCII);
        setDropDown("code39FontFamily", defaultValue.fontFamily);
        setDropDown("code39FontStyle", defaultValue.fontStyle);
        setDropDown("code39FontWeight", defaultValue.fontWeight);
        setDropDown("code39FontTextDecoration", defaultValue.fontTextDecoration);
        setDropDown("code39FontTextAlign", defaultValue.fontTextAlign);
        setDropDown("code39FontSize", defaultValue.fontSize);
        setNumberValue("code39Left", defaultValue.quietZoneLeft);
        setNumberValue("code39Right", defaultValue.quietZoneRight);
        setNumberValue("code39Top", defaultValue.quietZoneTop);
        setNumberValue("code39Bottom", defaultValue.quietZoneBottom);
    }
}

function getCode49SparklineSetting(formulaArgs, row, col){
    var defaultValue = {color: "#000", backgroundColor: "#fff", showLabel: 1, labelPosition: "bottom", grouping: false, groupNoValue: 0, fontFamily: "sans-serif", fontStyle: "normal", fontWeight: "normal", fontTextDecoration: "none", fontTextAlign: "center", fontSize: 12, quietZoneLeft: 10, quietZoneRight: 1, quietZoneTop: 0, quietZoneBottom: 0};
    if(formulaArgs){
        var dataRangestr = unParseFormula(formulaArgs[0], row, col),
            color = parseColorExpression(formulaArgs[1], row, col),
            backgroundColor = parseColorExpression(formulaArgs[2], row, col),
            showLabel = unParseFormula(formulaArgs[3], row, col),
            labelPosition = unParseFormula(formulaArgs[4], row, col),
            grouping = formulaArgs[5] && formulaArgs[5].value,
            groupNoValue = unParseFormula(formulaArgs[6], row, col),
            fontFamily = unParseFormula(formulaArgs[7], row, col),
            fontStyle = unParseFormula(formulaArgs[8], row, col),
            fontWeight = unParseFormula(formulaArgs[9], row, col),
            fontTextDecoration = unParseFormula(formulaArgs[10], row, col),
            fontTextAlign = unParseFormula(formulaArgs[11], row, col),
            fontSize = unParseFormula(formulaArgs[12], row, col),
            quietZoneLeft = unParseFormula(formulaArgs[13], row, col),
            quietZoneRight = unParseFormula(formulaArgs[14], row, col),
            quietZoneTop = unParseFormula(formulaArgs[15], row, col),
            quietZoneBottom = unParseFormula(formulaArgs[16], row, col);

        setTextValue("code49Data", dataRangestr);
        setColorValue("code49Color", color ? color : defaultValue.color);
        setColorValue("code49BackgroundColor", backgroundColor ? backgroundColor : defaultValue.backgroundColor);
        setNumberValue("code49ShowLabel", showLabel ? showLabel : defaultValue.showLabel);
        setDropDown("code49LabelPosition", labelPosition ? unparseSparklineStringOptions(labelPosition) : defaultValue.labelPosition);
        setCheckValue("code49Grouping", grouping ? grouping : defaultValue.grouping);
        setNumberValue("code49GroupNo", groupNoValue ? groupNoValue : defaultValue.groupNoValue);
        setDropDown("code49FontFamily", fontFamily ? unparseSparklineStringOptions(fontFamily) : defaultValue.fontFamily);
        setDropDown("code49FontStyle", fontStyle ? unparseSparklineStringOptions(fontStyle) : defaultValue.fontStyle);
        setDropDown("code49FontWeight", fontWeight ? unparseSparklineStringOptions(fontWeight) : defaultValue.fontWeight);
        setDropDown("code49FontTextDecoration", fontTextDecoration ? unparseSparklineStringOptions(fontTextDecoration) : defaultValue.fontTextDecoration);
        setDropDown("code49FontTextAlign", fontTextAlign ? unparseSparklineStringOptions(fontTextAlign) : defaultValue.fontTextAlign);
        setDropDown("code49FontSize", fontSize ? fontSize : defaultValue.fontSize);
        setNumberValue("code49Left", quietZoneLeft ? quietZoneLeft : defaultValue.quietZoneLeft);
        setNumberValue("code49Right", quietZoneRight ? quietZoneRight : defaultValue.quietZoneRight);
        setNumberValue("code49Top", quietZoneTop ? quietZoneTop : defaultValue.quietZoneTop);
        setNumberValue("code49Bottom", quietZoneBottom ? quietZoneBottom : defaultValue.quietZoneBottom);
    }
    else {
        setTextValue("code49Data", "");
        setColorValue("code49Color", defaultValue.color);
        setColorValue("code49BackgroundColor", defaultValue.backgroundColor);
        setNumberValue("code49ShowLabel", defaultValue.showLabel);
        setDropDown("code49LabelPosition",  defaultValue.labelPosition);
        setCheckValue("code49Grouping", defaultValue.grouping);
        setNumberValue("code49GroupNo", defaultValue.groupNoValue);
        setDropDown("code49FontFamily", defaultValue.fontFamily);
        setDropDown("code49FontStyle", defaultValue.fontStyle);
        setDropDown("code49FontWeight", defaultValue.fontWeight);
        setDropDown("code49FontTextDecoration", defaultValue.fontTextDecoration);
        setDropDown("code49FontTextAlign", defaultValue.fontTextAlign);
        setDropDown("code49FontSize", defaultValue.fontSize);
        setNumberValue("code49Left", defaultValue.quietZoneLeft);
        setNumberValue("code49Right", defaultValue.quietZoneRight);
        setNumberValue("code49Top", defaultValue.quietZoneTop);
        setNumberValue("code49Bottom", defaultValue.quietZoneBottom);
    }
}

function getCode128SparklineSetting(formulaArgs, row, col){
    var defaultValue = {color: "#000", backgroundColor: "#fff", showLabel: 1, labelPosition: "bottom", codeset: "auto", fontFamily: "sans-serif", fontStyle: "normal", fontWeight: "normal", fontTextDecoration: "none", fontTextAlign: "center", fontSize: 12, quietZoneLeft: 10, quietZoneRight: 10, quietZoneTop: 0, quietZoneBottom: 0};
    if(formulaArgs){
        var dataRangestr = unParseFormula(formulaArgs[0], row, col),
            color = parseColorExpression(formulaArgs[1], row, col),
            backgroundColor = parseColorExpression(formulaArgs[2], row, col),
            showLabel = unParseFormula(formulaArgs[3], row, col),
            labelPosition = unParseFormula(formulaArgs[4], row, col),
            codeset = unParseFormula(formulaArgs[5], row, col),
            fontFamily = unParseFormula(formulaArgs[6], row, col),
            fontStyle = unParseFormula(formulaArgs[7], row, col),
            fontWeight = unParseFormula(formulaArgs[8], row, col),
            fontTextDecoration = unParseFormula(formulaArgs[9], row, col),
            fontTextAlign = unParseFormula(formulaArgs[10], row, col),
            fontSize = unParseFormula(formulaArgs[11], row, col),
            quietZoneLeft = unParseFormula(formulaArgs[12], row, col),
            quietZoneRight = unParseFormula(formulaArgs[13], row, col),
            quietZoneTop = unParseFormula(formulaArgs[14], row, col),
            quietZoneBottom = unParseFormula(formulaArgs[15], row, col);

        setTextValue("code128Data", dataRangestr);
        setColorValue("code128Color", color ? color : defaultValue.color);
        setColorValue("code128BackgroundColor", backgroundColor ? backgroundColor : defaultValue.backgroundColor);
        setNumberValue("code128ShowLabel", showLabel ? showLabel : defaultValue.showLabel);
        setDropDown("code128LabelPosition", labelPosition ? unparseSparklineStringOptions(labelPosition) : defaultValue.labelPosition);
        setDropDown("code128CodeSet", codeset ? unparseSparklineStringOptions(codeset) : defaultValue.codeset);
        setDropDown("code128FontFamily", fontFamily ? unparseSparklineStringOptions(fontFamily) : defaultValue.fontFamily);
        setDropDown("code128FontStyle", fontStyle ? unparseSparklineStringOptions(fontStyle) : defaultValue.fontStyle);
        setDropDown("code128FontWeight", fontWeight ? unparseSparklineStringOptions(fontWeight) : defaultValue.fontWeight);
        setDropDown("code128FontTextDecoration", fontTextDecoration ? unparseSparklineStringOptions(fontTextDecoration) : defaultValue.fontTextDecoration);
        setDropDown("code128FontTextAlign", fontTextAlign ? unparseSparklineStringOptions(fontTextAlign) : defaultValue.fontTextAlign);
        setDropDown("code128FontSize", fontSize ? fontSize : defaultValue.fontSize);
        setNumberValue("code128Left", quietZoneLeft ? quietZoneLeft : defaultValue.quietZoneLeft);
        setNumberValue("code128Right", quietZoneRight ? quietZoneRight : defaultValue.quietZoneRight);
        setNumberValue("code128Top", quietZoneTop ? quietZoneTop : defaultValue.quietZoneTop);
        setNumberValue("code128Bottom", quietZoneBottom ? quietZoneBottom : defaultValue.quietZoneBottom);
    }
    else {
        setTextValue("code128Data", "");
        setColorValue("code128Color", defaultValue.color);
        setColorValue("code128BackgroundColor", defaultValue.backgroundColor);
        setNumberValue("code128ShowLabel", defaultValue.showLabel);
        setDropDown("code128LabelPosition",  defaultValue.labelPosition);
        setDropDown("code128CodeSet", defaultValue.codeset);
        setDropDown("code128FontFamily", defaultValue.fontFamily);
        setDropDown("code128FontStyle", defaultValue.fontStyle);
        setDropDown("code128FontWeight", defaultValue.fontWeight);
        setDropDown("code128FontTextDecoration", defaultValue.fontTextDecoration);
        setDropDown("code128FontTextAlign", defaultValue.fontTextAlign);
        setDropDown("code128FontSize", defaultValue.fontSize);
        setNumberValue("code128Left", defaultValue.quietZoneLeft);
        setNumberValue("code128Right", defaultValue.quietZoneRight);
        setNumberValue("code128Top", defaultValue.quietZoneTop);
        setNumberValue("code128Bottom", defaultValue.quietZoneBottom);
    }
}

function getPDFSparklineSetting(formulaArgs, row, col){
    var defaultValue = {color: "#000", backgroundColor: "#fff", errorCorrectionLevel: "auto", rows: "auto", columns: "auto", compact: false, quietZoneLeft: 2, quietZoneRight: 2, quietZoneTop: 2, quietZoneBottom: 2};;
    if(formulaArgs){
        var dataRangestr = unParseFormula(formulaArgs[0], row, col),
            color = parseColorExpression(formulaArgs[1], row, col),
            backgroundColor = parseColorExpression(formulaArgs[2], row, col),
            errorCorrectionLevel = unParseFormula(formulaArgs[3], row, col),
            rows = unParseFormula(formulaArgs[4], row, col),
            columns = unParseFormula(formulaArgs[5], row, col),
            compact = formulaArgs[6] && formulaArgs[6].value,
            quietZoneLeft = unParseFormula(formulaArgs[7], row, col),
            quietZoneRight = unParseFormula(formulaArgs[8], row, col),
            quietZoneTop = unParseFormula(formulaArgs[9], row, col),
            quietZoneBottom = unParseFormula(formulaArgs[10], row, col);

        setTextValue("pdfData", dataRangestr);
        setColorValue("pdfColor", color ? color : defaultValue.color);
        setColorValue("pdfBackgroundColor", backgroundColor ? backgroundColor : defaultValue.backgroundColor);
        setDropDown("pdfLevel", errorCorrectionLevel ? unparseSparklineStringOptions(errorCorrectionLevel) : defaultValue.errorCorrectionLevel);
        setDropDown("pdfRows", rows ? unparseSparklineStringOptions(rows) : defaultValue.rows);
        setDropDown("pdfColumns", columns ? unparseSparklineStringOptions(columns) : defaultValue.columns);
        setCheckValue("pdfCompact", compact ? compact : defaultValue.compact);
        setNumberValue("pdfLeft", quietZoneLeft ? quietZoneLeft : defaultValue.quietZoneLeft);
        setNumberValue("pdfRight", quietZoneRight ? quietZoneRight : defaultValue.quietZoneRight);
        setNumberValue("pdfTop", quietZoneTop ? quietZoneTop : defaultValue.quietZoneTop);
        setNumberValue("pdfBottom", quietZoneBottom ? quietZoneBottom : defaultValue.quietZoneBottom);
    }
    else {
        setTextValue("pdfData", "");
        setColorValue("pdfColor", defaultValue.color);
        setColorValue("pdfBackgroundColor", defaultValue.backgroundColor);
        setDropDown("pdfLevel", defaultValue.errorCorrectionLevel);
        setDropDown("pdfRows", defaultValue.rows);
        setDropDown("pdfColumns", defaultValue.columns);
        setCheckValue("pdfCompact", defaultValue.compact);
        setNumberValue("pdfLeft", defaultValue.quietZoneLeft);
        setNumberValue("pdfRight", defaultValue.quietZoneRight);
        setNumberValue("pdfTop", defaultValue.quietZoneTop);
        setNumberValue("pdfBottom", defaultValue.quietZoneBottom);
    }
}

function getDataMatrixSparklineSetting(formulaArgs, row, col){
    var defaultValue = {color: "#000", backgroundColor: "#fff", eccMode: "ECC000", ecc200SymbolSize: "squareAuto", ecc200EndcodingMode: "auto", ecc00_140Symbole: "auto", structureAppend: false, structureNumber: 0, fileIdentifier: 0, quietZoneLeft: 4, quietZoneRight: 4, quietZoneTop: 4, quietZoneBottom: 4};
    if(formulaArgs){
        var dataRangestr = unParseFormula(formulaArgs[0], row, col);
            color = parseColorExpression(formulaArgs[1], row, col);
            backgroundColor = parseColorExpression(formulaArgs[2], row, col);
            eccMode = unParseFormula(formulaArgs[3], row, col);
            ecc200SymbolSize = unParseFormula(formulaArgs[4], row, col);
            ecc200EndcodingMode = unParseFormula(formulaArgs[5], row, col);
            ecc00_140Symbole = unParseFormula(formulaArgs[6], row, col);
            structureNumber = unParseFormula(formulaArgs[8], row, col);
            fileIdentifier = unParseFormula(formulaArgs[9], row, col);
            structureAppend = formulaArgs[7] && formulaArgs[7].value;
            quietZoneLeft = unParseFormula(formulaArgs[10], row, col),
            quietZoneRight = unParseFormula(formulaArgs[11], row, col),
            quietZoneTop = unParseFormula(formulaArgs[12], row, col),
            quietZoneBottom = unParseFormula(formulaArgs[13], row, col);

        setTextValue("dataMatrixData", dataRangestr);
        setColorValue("dataMatrixColor", color ? color : defaultValue.color);
        setColorValue("dataMatrixBackgroundColor", backgroundColor ? backgroundColor : defaultValue.backgroundColor);
        setDropDown("dataMatrixEccMode", eccMode ? unparseSparklineStringOptions(eccMode) : defaultValue.eccMode);
        setTextValue("dataMatrixSymbolSize", ecc200SymbolSize ? unparseSparklineStringOptions(ecc200SymbolSize) : defaultValue.ecc200SymbolSize);
        setTextValue("dataMatrixEndcodingMode", ecc200EndcodingMode ? unparseSparklineStringOptions(ecc200EndcodingMode) : defaultValue.ecc200EndcodingMode);
        setTextValue("dataMatrixSymbole", ecc00_140Symbole ? unparseSparklineStringOptions(ecc00_140Symbole) : defaultValue.ecc00_140Symbole);
        setDropDown("dataMatrixStructureNumber", structureNumber ? structureNumber : defaultValue.structureNumber);
        setNumberValue("dataMatrixFileIdentifier", fileIdentifier ? fileIdentifier : defaultValue.fileIdentifier);
        setCheckValue("dataMatrixStructureAppend", structureAppend ? structureAppend : defaultValue.structureAppend);
        setNumberValue("dataMatrixLeft", quietZoneLeft ? quietZoneLeft : defaultValue.quietZoneLeft);
        setNumberValue("dataMatrixRight", quietZoneRight ? quietZoneRight : defaultValue.quietZoneRight);
        setNumberValue("dataMatrixTop", quietZoneTop ? quietZoneTop : defaultValue.quietZoneTop);
        setNumberValue("dataMatrixBottom", quietZoneBottom ? quietZoneBottom : defaultValue.quietZoneBottom);
    }
    else {
        setTextValue("dataMatrixData", "");
        setColorValue("dataMatrixColor", defaultValue.color);
        setColorValue("dataMatrixBackgroundColor", defaultValue.backgroundColor);
        setDropDown("dataMatrixEccMode", defaultValue.eccMode);
        setTextValue("dataMatrixSymbolSize", defaultValue.ecc200SymbolSize);
        setTextValue("dataMatrixEndcodingMode", defaultValue.ecc200EndcodingMode);
        setTextValue("dataMatrixSymbole", defaultValue.ecc00_140Symbole);
        setDropDown("dataMatrixStructureNumber", defaultValue.structureNumber);
        setNumberValue("dataMatrixFileIdentifier", defaultValue.fileIdentifier);
        setCheckValue("dataMatrixStructureAppend", defaultValue.structureAppend);
        setNumberValue("dataMatrixLeft", defaultValue.quietZoneLeft);
        setNumberValue("dataMatrixRight", defaultValue.quietZoneRight);
        setNumberValue("dataMatrixTop", defaultValue.quietZoneTop);
        setNumberValue("dataMatrixBottom", defaultValue.quietZoneBottom);
    }
}

var sparklineName;
function showSparklineSetting(row, col) {
    var expr = parseFormulaSparkline(row, col);
    if (!expr || !expr.arguments) {
        return false;
    }
    var formulaSparkline = spread.getSparklineEx(expr.functionName);

    if (formulaSparkline) {
        var $sparklineSettingDiv = $("#sparklineDetailSetting>div");
        // var $barCodeSettingDiv = $("#barCodeDetailSetting>div");
        var formulaArgs = expr.arguments;
        $sparklineSettingDiv.hide();
        // $barCodeSettingDiv.hide();
        if (formulaSparkline instanceof GC.Spread.Sheets.Sparklines.PieSparkline) {
            $("#pieSparklineSetting").show();
            $("#pieSparklineColorContainer").empty();
            getPieSparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if (formulaSparkline instanceof GC.Spread.Sheets.Sparklines.AreaSparkline) {
            $("#areaSparklineSetting").show();
            getAreaSparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if (formulaSparkline instanceof GC.Spread.Sheets.Sparklines.BoxPlotSparkline) {
            $("#boxplotSparklineSetting").show();
            getBoxPlotSparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if (formulaSparkline instanceof GC.Spread.Sheets.Sparklines.BulletSparkline) {
            $("#bulletSparklineSetting").show();
            getBulletSparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if (formulaSparkline instanceof GC.Spread.Sheets.Sparklines.CascadeSparkline) {
            $("#cascadeSparklineSetting").show();
            getCascadeSparklineSetting(formulaArgs, row, col);
            return true;
        }
        // else if (formulaSparkline instanceof GC.Spread.Sheets.Sparklines.CompatibleSparkline) {
        //     $("#compatibleSparklineSetting").show();
        //     if (expr.fn.name) {
        //         sparklineName = expr.fn.name;
        //     }
        //     getCompatibleSparklineSetting(formulaArgs, row, col);
        //     return true;
        // }
        else if (formulaSparkline instanceof GC.Spread.Sheets.Sparklines.ScatterSparkline) {
            $("#scatterSparklineSetting").show();
            getScatterSparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if (formulaSparkline instanceof GC.Spread.Sheets.Sparklines.HBarSparkline) {
            $("#hbarSparklineSetting").show();
            getHBarSparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if (formulaSparkline instanceof GC.Spread.Sheets.Sparklines.VBarSparkline) {
            $("#vbarSparklineSetting").show();
            getVBarSparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if (formulaSparkline instanceof GC.Spread.Sheets.Sparklines.ParetoSparkline) {
            $("#paretoSparklineSetting").show();
            getParetoSparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if (formulaSparkline instanceof GC.Spread.Sheets.Sparklines.SpreadSparkline) {
            $("#spreadSparklineSetting").show();
            getSpreadSparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if (formulaSparkline instanceof GC.Spread.Sheets.Sparklines.StackedSparkline) {
            $("#stackedSparklineSetting").show();
            getStackedSparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if (formulaSparkline instanceof GC.Spread.Sheets.Sparklines.VariSparkline) {
            $("#variSparklineSetting").show();
            getVariSparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if (formulaSparkline instanceof GC.Spread.Sheets.Sparklines.LineSparkline ||
            formulaSparkline instanceof GC.Spread.Sheets.Sparklines.ColumnSparkline ||
            formulaSparkline instanceof GC.Spread.Sheets.Sparklines.WinlossSparkline) {
            $("#compatibleSparklineSetting").show();
            if (expr.function.name) {
                sparklineName = expr.function.name;
            }
            getCompatibleSparklineSetting(formulaArgs, row, col);
            return true;
        }
        // else if (formulaSparkline instanceof Barcode.QRCode){
        //     $("#qrCodeSetting").show();
        //     getQRCodeSparklineSetting(formulaArgs, row, col);
        //     return true;
        // }
        // else if(formulaSparkline instanceof Barcode.EAN8){
        //     $("#ean8Setting").show();
        //     getEAN8SparklineSetting(formulaArgs, row, col);
        //     return true;
        // }
        // else if(formulaSparkline instanceof Barcode.EAN13){
        //     $("#ean13Setting").show();
        //     getEAN13SparklineSetting(formulaArgs, row, col);
        //     return true;
        // }
        // else if(formulaSparkline instanceof Barcode.GS1_128){
        //     $("#gs1Setting").show();
        //     getGS1SparklineSetting(formulaArgs, row, col);
        //     return true;
        // }
        // else if(formulaSparkline instanceof Barcode.Codabar){
        //     $("#codabarSetting").show();
        //     getCodabarSparklineSetting(formulaArgs, row, col);
        //     return true;
        // }
        // else if(formulaSparkline instanceof Barcode.DataMatrix){
        //     $("#dataMatrixSetting").show();
        //     getDataMatrixSparklineSetting(formulaArgs, row, col);
        //     return true;
        // }
        // else if(formulaSparkline instanceof Barcode.PDF417){
        //     $("#pdfSetting").show();
        //     getPDFSparklineSetting(formulaArgs, row, col);
        //     return true;
        // }
        // else if(formulaSparkline instanceof Barcode.Code39){
        //     $("#code39Setting").show();
        //     getCode39SparklineSetting(formulaArgs, row, col);
        //     return true;
        // }
        // else if(formulaSparkline instanceof Barcode.Code49){
        //     $("#code49Setting").show();
        //     getCode49SparklineSetting(formulaArgs, row, col);
        //     return true;
        // }
        // else if(formulaSparkline instanceof Barcode.Code93){
        //     $("#code93Setting").show();
        //     getCode93SparklineSetting(formulaArgs, row, col);
        //     return true;
        // }
        // else if(formulaSparkline instanceof Barcode.Code128){
        //     $("#code128Setting").show();
        //     getCode128SparklineSetting(formulaArgs, row, col);
        //     return true;
        // }
    }
    return false;
}

function showBarCodeSetting(row, col) {
    var expr = parseFormulaSparkline(row, col);
    if (!expr || !expr.arguments) {
        return false;
    }
    var formulaSparkline = spread.getSparklineEx(expr.functionName);

    if (formulaSparkline) {
        var $barCodeSettingDiv = $("#barCodeDetailSetting>div");
        var formulaArgs = expr.arguments;
        $barCodeSettingDiv.hide();
        if (formulaSparkline instanceof Barcode.QRCode){
            $("#qrCodeSetting").show();
            getQRCodeSparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if(formulaSparkline instanceof Barcode.EAN8){
            $("#ean8Setting").show();
            getEAN8SparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if(formulaSparkline instanceof Barcode.EAN13){
            $("#ean13Setting").show();
            getEAN13SparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if(formulaSparkline instanceof Barcode.GS1_128){
            $("#gs1Setting").show();
            getGS1SparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if(formulaSparkline instanceof Barcode.Codabar){
            $("#codabarSetting").show();
            getCodabarSparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if(formulaSparkline instanceof Barcode.DataMatrix){
            $("#dataMatrixSetting").show();
            getDataMatrixSparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if(formulaSparkline instanceof Barcode.PDF417){
            $("#pdfSetting").show();
            getPDFSparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if(formulaSparkline instanceof Barcode.Code39){
            $("#code39Setting").show();
            getCode39SparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if(formulaSparkline instanceof Barcode.Code49){
            $("#code49Setting").show();
            getCode49SparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if(formulaSparkline instanceof Barcode.Code93){
            $("#code93Setting").show();
            getCode93SparklineSetting(formulaArgs, row, col);
            return true;
        }
        else if(formulaSparkline instanceof Barcode.Code128){
            $("#code128Setting").show();
            getCode128SparklineSetting(formulaArgs, row, col);
            return true;
        }
    }
    return false;
}

function attachSparklineSettingEvents() {
    $("#setAreaSparkline").click(applyAreaSparklineSetting);
    $("#setBoxPlotSparkline").click(applyBoxPlotSparklineSetting);
    $("#setBulletSparkline").click(applyBulletSparklineSetting);
    $("#setCascadeSparkline").click(applyCascadeSparklineSetting);
    $("#setCompatibleSparkline").click(applyCompatibleSparklineSetting);
    $("#setScatterSparkline").click(applyScatterSparklineSetting);
    $("#setHbarSparkline").click(applyHbarSparklineSetting);
    $("#setVbarSparkline").click(applyVbarSparklineSetting);
    $("#setParetoSparkline").click(applyParetoSparklineSetting);
    $("#setSpreadSparkline").click(applySpreadSparklineSetting);
    $("#setStackedSparkline").click(applyStackedSparklineSetting);
    $("#setVariSparkline").click(applyVariSparklineSetting);
    $("#setPieSparkline").click(applyPieSparklineSetting);
    $("#setEAN8").click(applyEAN8SparklineSetting);
    $("#setEAN13").click(applyEAN13SparklineSetting);
    $("#setGS").click(applyGS1SparklineSetting);
    $("#setCodabar").click(applyCodabarSparklineSetting);
    $("#setCode93").click(applyCode93SparklineSetting);
    $("#setCode39").click(applyCode39SparklineSetting);
    $("#setCode49").click(applyCode49SparklineSetting);
    $("#setCode128").click(applyCode128SparklineSetting);
    $("#setPDF").click(applyPDFSparklineSetting);
    $("#setDataMatrix").click(applyDataMatrixSparklineSetting);
    $("#setQRCode").click(applyQRCodeSparklineSetting);
}

function updateFormulaBar() {
    var sheet = spread.getActiveSheet();
    var formulaBar = $("#formulabox");
    if (formulaBar.length > 0) {
        var formula = sheet.getFormula(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex());
        if (formula) {
            formula = "=" + formula;
            formulaBar.text(formula);
        }
    }
}

function removeContinuousComma(parameter) {
    var len = parameter.length;
    while (len > 0 && parameter[len - 1] === ",") {
        len--;
    }
    return parameter.substr(0, len);
}

function formatFormula(paraArray) {
    var params = "";
    for (var i = 0; i < paraArray.length; i++) {
        var item = paraArray[i];
        if (item !== undefined && item !== null) {
            params += item + ",";
        }
        else {
            params += ",";
        }
    }
    params = removeContinuousComma(params);
    return params;
}

function getFormula(params) {
    var len = params.length;
    while (len > 0 && params[len - 1] === "") {
        len--;
    }
    var temp = "";
    for (var i = 0; i < len; i++) {
        temp += params[i];
        if (i !== len - 1) {
            temp += ",";
        }
    }
    return "=AREASPARKLINE(" + temp + ")";
}

function setFormulaSparkline(formula) {
    var sheet = spread.getActiveSheet();
    var row = sheet.getActiveRowIndex();
    var col = sheet.getActiveColumnIndex();
    if (formula) {
        sheet.setFormula(row, col, formula);
    }
}

function applyAreaSparklineSetting() {
    var points = getTextValue("areaSparklinePoints");
    var mini = getNumberValue("areaSparklineMinimumValue");
    var maxi = getNumberValue("areaSparklineMaximumValue");
    var line1 = getNumberValue("areaSparklineLine1");
    var line2 = getNumberValue("areaSparklineLine2");
    var colorPositive = "\"" + getBackgroundColor("areaSparklinePositiveColor") + "\"";
    var colorNegative = "\"" + getBackgroundColor("areaSparklineNegativeColor") + "\"";
    var paramArr = [points, mini, maxi, line1, line2, colorPositive, colorNegative];
    var formula = getFormula(paramArr);

    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyBoxPlotSparklineSetting() {
    var pointsValue = getTextValue("boxplotSparklinePoints");
    var boxPlotClassValue = getDropDownValue("boxplotClassType");
    var showAverageValue = getCheckValue("boxplotSparklineShowAverage");
    var scaleStartValue = getTextValue("boxplotSparklineScaleStart");
    var scaleEndValue = getTextValue("boxplotSparklineScaleEnd");
    var acceptableStartValue = getTextValue("boxplotSparklineAcceptableStart");
    var acceptableEndValue = getTextValue("boxplotSparklineAcceptableEnd");
    var colorValue = getBackgroundColor("boxplotSparklineColorScheme");
    var styleValue = getDropDownValue("boxplotSparklineStyleType");
    var verticalValue = getCheckValue("boxplotSparklineVertical");

    var boxplotClassStr = boxPlotClassValue ? "\"" + boxPlotClassValue + "\"" : null;
    var colorStr = colorValue ? "\"" + colorValue + "\"" : null;
    var paraPool = [
        pointsValue,
        boxplotClassStr,
        showAverageValue,
        scaleStartValue,
        scaleEndValue,
        acceptableStartValue,
        acceptableEndValue,
        colorStr,
        styleValue,
        verticalValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=BOXPLOTSPARKLINE(" + params + ")";

    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyBulletSparklineSetting() {
    var measureValue = getTextValue("bulletSparklineMeasure");
    var targetValue = getTextValue("bulletSparklineTarget");
    var maxiValue = getTextValue("bulletSparklineMaxi");
    var goodValue = getTextValue("bulletSparklineGood");
    var badValue = getTextValue("bulletSparklineBad");
    var forecastValue = getTextValue("bulletSparklineForecast");
    var tickunitValue = getTextValue("bulletSparklineTickUnit");
    var colorSchemeValue = getBackgroundColor("bulletSparklineColorScheme");
    var verticalValue = getCheckValue("bulletSparklineVertical");

    var colorSchemeString = colorSchemeValue ? "\"" + colorSchemeValue + "\"" : null;
    var paraPool = [
        measureValue,
        targetValue,
        maxiValue,
        goodValue,
        badValue,
        forecastValue,
        tickunitValue,
        colorSchemeString,
        verticalValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=BULLETSPARKLINE(" + params + ")";
    var sheet = spread.getActiveSheet();
    var sels = sheet.getSelections();

    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyCascadeSparklineSetting() {
    var pointsRangeValue = getTextValue("cascadeSparklinePointsRange");
    var pointIndexValue = getTextValue("cascadeSparklinePointIndex");
    var labelsRangeValue = getTextValue("cascadeSparklineLabelsRange");
    var minimumValue = getTextValue("cascadeSparklineMinimum");
    var maximumValue = getTextValue("cascadeSparklineMaximum");
    var colorPositiveValue = getBackgroundColor("cascadeSparklinePositiveColor");
    var colorNegativeValue = getBackgroundColor("cascadeSparklineNegativeColor");
    var verticalValue = getCheckValue("cascadeSparklineVertical");
    var colorPositiveStr = colorPositiveValue ? "\"" + colorPositiveValue + "\"" : null;
    var colorNegativeStr = colorNegativeValue ? "\"" + colorNegativeValue + "\"" : null;
    var paraPool = [
        pointsRangeValue,
        pointIndexValue,
        labelsRangeValue,
        minimumValue,
        maximumValue,
        colorPositiveStr,
        colorNegativeStr,
        verticalValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=CASCADESPARKLINE(" + params + ")";

    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyCompatibleSparklineSetting() {
    var data = getTextValue("compatibleSparklineData");
    var dataOrientation = getDropDownValue("dataOrientationType");
    var dateAxisData = getTextValue("compatibleSparklineDateAxisData");
    var dateAxisOrientation = getDropDownValue("dateAxisOrientationType");
    if (dateAxisOrientation === undefined) {
        dateAxisOrientation = "";
    }
    var sparklineSetting = {}, minAxisType, maxAxisType;

    sparklineSetting.displayEmptyCellsAs = getDropDownValue("emptyCellDisplayType");
    sparklineSetting.displayHidden = getCheckValue("showDataInHiddenRowOrColumn");
    sparklineSetting.showFirst = getCheckValue("compatibleSparklineShowFirst");
    sparklineSetting.showLast = getCheckValue("compatibleSparklineShowLast");
    sparklineSetting.showHigh = getCheckValue("compatibleSparklineShowHigh");
    sparklineSetting.showLow = getCheckValue("compatibleSparklineShowLow");
    sparklineSetting.showNegative = getCheckValue("compatibleSparklineShowNegative");
    sparklineSetting.showMarkers = getCheckValue("compatibleSparklineShowMarkers");
    minAxisType = getDropDownValue("minAxisType");
    sparklineSetting.minAxisType = spreadNS.Sparklines.SparklineAxisMinMax[minAxisType];
    sparklineSetting.manualMin = getTextValue("manualMin");
    maxAxisType = getDropDownValue("maxAxisType");
    sparklineSetting.maxAxisType = spreadNS.Sparklines.SparklineAxisMinMax[maxAxisType];
    sparklineSetting.manualMax = getTextValue("manualMax");
    sparklineSetting.rightToLeft = getCheckValue("rightToLeft");
    sparklineSetting.displayXAxis = getCheckValue("displayXAxis");

    sparklineSetting.negativeColor = getBackgroundColor("compatibleSparklineNegativeColor");
    sparklineSetting.markersColor = getBackgroundColor("compatibleSparklineMarkersColor");
    sparklineSetting.axisColor = getBackgroundColor("compatibleSparklineAxisColor");
    sparklineSetting.seriesColor = getBackgroundColor("compatibleSparklineSeriesColor");
    sparklineSetting.highMarkerColor = getBackgroundColor("compatibleSparklineHighMarkerColor");
    sparklineSetting.lowMarkerColor = getBackgroundColor("compatibleSparklineLowMarkerColor");
    sparklineSetting.firstMarkerColor = getBackgroundColor("compatibleSparklineFirstMarkerColor");
    sparklineSetting.lastMarkerColor = getBackgroundColor("compatibleSparklineLastMarkerColor");
    sparklineSetting.lineWeight = getTextValue("compatibleSparklineLastLineWeight");

    var settingArray = [];
    for (var item in sparklineSetting) {
        if (sparklineSetting[item] !== undefined && sparklineSetting[item] !== "") {
            settingArray.push(item + ":" + sparklineSetting[item]);
        }
    }
    var settingString = "";
    if (settingArray.length > 0) {
        settingString = "\"{" + settingArray.join(",") + "}\"";
    }

    var formula = "";
    if (settingString !== "") {
        formula = "=" + sparklineName + "(" + data + "," + dataOrientation +
            "," + dateAxisData + "," + dateAxisOrientation + "," + settingString + ")";
    }
    else {
        if (dateAxisOrientation !== "") {
            formula = "=" + sparklineName + "(" + data + "," + dataOrientation +
                "," + dateAxisData + "," + dateAxisOrientation + ")";
        }
        else {
            if (dateAxisData !== "") {
                formula = "=" + sparklineName + "(" + data + "," + dataOrientation +
                    "," + dateAxisData + ")";
            }
            else {
                formula = "=" + sparklineName + "(" + data + "," + dataOrientation + ")";
            }
        }
    }

    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyScatterSparklineSetting() {
    var paraPool = [];
    var inputList = ["scatterSparklinePoints1", "scatterSparklinePoints2", "scatterSparklineMinX", "scatterSparklineMaxX",
        "scatterSparklineMinY", "scatterSparklineMaxY", "scatterSparklineHLine", "scatterSparklineVLine",
        "scatterSparklineXMinZone", "scatterSparklineXMaxZone", "scatterSparklineYMinZone", "scatterSparklineYMaxZone"];
    for (var i = 0; i < inputList.length; i++) {
        var textValue = getTextValue(inputList[i]);
        paraPool.push(textValue);
    }
    var tags = getCheckValue("scatterSparklineTags");
    var drawSymbol = getCheckValue("scatterSparklineDrawSymbol");
    var drawLines = getCheckValue("scatterSparklineDrawLines");
    var color1 = getBackgroundColor("scatterSparklineColor1");
    var color2 = getBackgroundColor("scatterSparklineColor2");
    var dashLine = getCheckValue("scatterSparklineDashLine");

    color1 = color1 ? "\"" + color1 + "\"" : null;
    color2 = color2 ? "\"" + color2 + "\"" : null;

    paraPool.push(tags);
    paraPool.push(drawSymbol);
    paraPool.push(drawLines);
    paraPool.push(color1);
    paraPool.push(color2);
    paraPool.push(dashLine);

    var params = formatFormula(paraPool);
    var formula = "=SCATTERSPARKLINE(" + params + ")";

    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyHbarSparklineSetting() {
    var paraPool = [];
    var value = getTextValue("hbarSparklineValue");
    var colorScheme = getBackgroundColor("hbarSparklineColorScheme");

    colorScheme = "\"" + colorScheme + "\"";
    paraPool.push(value);
    paraPool.push(colorScheme);

    var params = formatFormula(paraPool);
    var formula = "=HBARSPARKLINE(" + params + ")";

    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyVbarSparklineSetting() {
    var paraPool = [];
    var value = getTextValue("vbarSparklineValue");
    var colorScheme = getBackgroundColor("vbarSparklineColorScheme");

    colorScheme = "\"" + colorScheme + "\"";
    paraPool.push(value);
    paraPool.push(colorScheme);

    var params = formatFormula(paraPool);
    var formula = "=VBARSPARKLINE(" + params + ")";

    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyParetoSparklineSetting() {
    var pointsRangeValue = getTextValue("paretoSparklinePoints");
    var pointIndexValue = getTextValue("paretoSparklinePointIndex");
    var colorRangeValue = getTextValue("paretoSparklineColorRange");
    var targetValue = getTextValue("paretoSparklineTarget");
    var target2Value = getTextValue("paretoSparklineTarget2");
    var highlightPositionValue = getTextValue("paretoSparklineHighlightPosition");
    var labelValue = getDropDownValue("paretoLabelType");
    var verticalValue = getCheckValue("paretoSparklineVertical");
    var paraPool = [
        pointsRangeValue,
        pointIndexValue,
        colorRangeValue,
        targetValue,
        target2Value,
        highlightPositionValue,
        labelValue,
        verticalValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=PARETOSPARKLINE(" + params + ")";

    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applySpreadSparklineSetting() {
    var pointsValue = getTextValue("spreadSparklinePoints");
    var showAverageValue = getCheckValue("spreadSparklineShowAverage");
    var scaleStartValue = getTextValue("spreadSparklineScaleStart");
    var scaleEndValue = getTextValue("spreadSparklineScaleEnd");
    var styleValue = getDropDownValue("spreadSparklineStyleType");
    var colorSchemeValue = getBackgroundColor("spreadSparklineColorScheme");
    var verticalValue = getCheckValue("spreadSparklineVertical");
    var colorSchemeString = colorSchemeValue ? "\"" + colorSchemeValue + "\"" : null;
    var paraPool = [
        pointsValue,
        showAverageValue,
        scaleStartValue,
        scaleEndValue,
        styleValue,
        colorSchemeString,
        verticalValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=SPREADSPARKLINE(" + params + ")";

    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyStackedSparklineSetting() {
    var pointsValue = getTextValue("stackedSparklinePoints");
    var colorRangeValue = getTextValue("stackedSparklineColorRange");
    var labelRangeValue = getTextValue("stackedSparklineLabelRange");
    var maximumValue = getNumberValue("stackedSparklineMaximum");
    var targetRedValue = getNumberValue("stackedSparklineTargetRed");
    var targetGreenValue = getNumberValue("stackedSparklineTargetGreen");
    var targetBlueValue = getNumberValue("stackedSparklineTargetBlue");
    var targetYellowValue = getNumberValue("stackedSparklineTargetYellow");
    var colorValue = getBackgroundColor("stackedSparklineColor");
    var highlightPositionValue = getNumberValue("stackedSparklineHighlightPosition");
    var verticalValue = getCheckValue("stackedSparklineVertical");
    var textOrientationValue = getDropDownValue("stackedSparklineTextOrientation");
    var textSizeValue = getNumberValue("stackedSparklineTextSize");
    var colorString = colorValue ? "\"" + colorValue + "\"" : null;
    var paraPool = [
        pointsValue,
        colorRangeValue,
        labelRangeValue,
        maximumValue,
        targetRedValue,
        targetGreenValue,
        targetBlueValue,
        targetYellowValue,
        colorString,
        highlightPositionValue,
        verticalValue,
        textOrientationValue,
        textSizeValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=STACKEDSPARKLINE(" + params + ")";

    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyVariSparklineSetting() {
    var varianceValue = getTextValue("variSparklineVariance");
    var referenceValue = getTextValue("variSparklineReference");
    var miniValue = getTextValue("variSparklineMini");
    var maxiValue = getTextValue("variSparklineMaxi");
    var markValue = getTextValue("variSparklineMark");
    var tickunitValue = getTextValue("variSparklineTickUnit");
    var colorPositiveValue = getBackgroundColor("variSparklineColorPositive");
    var colorNegativeValue = getBackgroundColor("variSparklineColorNegative");
    var legendValue = getCheckValue("variSparklineLegend");
    var verticalValue = getCheckValue("variSparklineVertical");
    var colorPositiveStr = colorPositiveValue ? "\"" + colorPositiveValue + "\"" : null;
    var colorNegativeStr = colorNegativeValue ? "\"" + colorNegativeValue + "\"" : null;
    var paraPool = [
        varianceValue,
        referenceValue,
        miniValue,
        maxiValue,
        markValue,
        tickunitValue,
        legendValue,
        colorPositiveStr,
        colorNegativeStr,
        verticalValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=VARISPARKLINE(" + params + ")";

    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyPieSparklineSetting() {
    var paraPool = [];
    var range = getTextValue("pieSparklinePercentage");
    paraPool.push(range);

    $("#pieSparklineColorContainer").find(".color-picker").each(function () {
        var color = "\"" + $(this).css("background-color") + "\"";
        paraPool.push(color);
    });

    var params = formatFormula(paraPool);
    var formula = "=PIESPARKLINE(" + params + ")";

    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyQRCodeSparklineSetting(){
    var dataValue = getTextValue("qrCodeData");
    var colorValue = getBackgroundColor("qrCodeColor");
    var backgroundColorValue = getBackgroundColor("qrCodeBackgroundColor");
    var levelValue = getDropDownValue("qrCodeLevel");
    var modelValue = getDropDownValue("qrCodeModel");
    var versionValue = getDropDownValue("qrCodeVersion");
    var maskValue = getDropDownValue("qrCodeMask");
    var connectionValue = getCheckValue("qrCodeConnection");
    var connectionNoValue = getDropDownValue("qrCodeConnectionNo");
    var charCodeValue = getTextValue("qrCodeCharCode");
    var charsetValue = getDropDownValue("qrCodeCharset");
    var quietZoneLeftValue = getNumberValue("qrCodeLeft");
    var quietZoneRightValue = getNumberValue("qrCodeRight");
    var quietZoneTopValue = getNumberValue("qrCodeTop");
    var quietZoneBottomValue = getNumberValue("qrCodeBottom");


    var versionStr = versionValue === "auto" ? versionValue ? "\"" + versionValue + "\"" : null : versionValue;
    var maskStr = maskValue === "auto" ? maskValue ? "\"" + maskValue + "\"" : null : maskValue;
    var levelStr = levelValue ? "\"" + levelValue + "\"" : null;
    var colorStr = colorValue ? "\"" + colorValue + "\"" : null;
    var backgroundColorStr = backgroundColorValue ? "\"" + backgroundColorValue + "\"" : null;
    var charCodeStr = charCodeValue ? "{" + charCodeValue + "}" : null;
    var charsetStr = charsetValue ? "\"" + charsetValue + "\"" : null;
    var paraPool = [
        dataValue,
        colorStr,
        backgroundColorStr,
        levelStr,
        modelValue,
        versionStr,
        maskStr,
        connectionValue,
        connectionNoValue,
        charCodeStr,
        charsetStr,
        quietZoneLeftValue,
        quietZoneRightValue,
        quietZoneTopValue,
        quietZoneBottomValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=BC_QRCODE(" + params + ")";
    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyEAN8SparklineSetting(){
    var dataValue =  getTextValue("ean8Data");
    var colorValue = getBackgroundColor("ean8Color");
    var backgroundColorValue = getBackgroundColor("ean8BackgroundColor");
    var showLabelValue = getNumberValue("ean8ShowLabel");
    var labelPositionValue = getDropDownValue("ean8LabelPosition");
    var fontFamilyValue = getDropDownValue("ean8FontFamily");
    var fontStyleValue = getDropDownValue("ean8FontStyle" );
    var fontWeightValue = getDropDownValue("ean8FontWeight");
    var textDecorationValue = getDropDownValue("ean8FontTextDecoration");
    var textAlignValue = getDropDownValue("ean8FontTextAlign");
    var fontSizeValue = getDropDownValue("ean8FontSize");
    var leftValue = getNumberValue("ean8Left");
    var rightValue = getNumberValue("ean8Right");
    var topValue = getNumberValue("ean8Top");
    var bottomValue = getNumberValue("ean8Bottom");

    var fontFamilyStr = fontFamilyValue ? "\"" + fontFamilyValue + "\"" : null;
    var fontStyleStr = fontStyleValue ? "\"" + fontStyleValue + "\"" : null;
    var fontWeightStr = fontWeightValue ? "\"" + fontWeightValue + "\"" : null;
    var textDecorationStr = textDecorationValue ? "\"" + textDecorationValue + "\"" : null;
    var textAlignStr = textAlignValue ? "\"" + textAlignValue + "\"" : null;
    var labelPositionStr = labelPositionValue ? "\"" + labelPositionValue + "\"" : null;
    var colorStr = colorValue ? "\"" + colorValue + "\"" : null;
    var backgroundColorStr = backgroundColorValue ? "\"" + backgroundColorValue + "\"" : null;
    var paraPool = [
        dataValue,
        colorStr,
        backgroundColorStr,
        showLabelValue,
        labelPositionStr,
        fontFamilyStr,
        fontStyleStr,
        fontWeightStr,
        textDecorationStr,
        textAlignStr,
        fontSizeValue,
        leftValue,
        rightValue,
        topValue,
        bottomValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=BC_EAN8(" + params + ")";
    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyEAN13SparklineSetting(){
    var dataValue =  getTextValue("ean13Data");
    var colorValue = getBackgroundColor("ean13Color");
    var backgroundColorValue = getBackgroundColor("ean13BackgroundColor");
    var showLabelValue = getNumberValue("ean13ShowLabel");
    var labelPositionValue = getDropDownValue("ean13LabelPosition");
    var addOnValue = getTextValue("ean13AddOn");
    var addOnLabelPositionValue = getDropDownValue("ean13AddOnLabelPosition");
    var fontFamilyValue = getDropDownValue("ean13FontFamily");
    var fontStyleValue = getDropDownValue("ean13FontStyle" );
    var fontWeightValue = getDropDownValue("ean13FontWeight");
    var textDecorationValue = getDropDownValue("ean13FontTextDecoration");
    var textAlignValue = getDropDownValue("ean13FontTextAlign");
    var fontSizeValue = getDropDownValue("ean13FontSize");
    var leftValue = getNumberValue("ean13Left");
    var rightValue = getNumberValue("ean13Right");
    var topValue = getNumberValue("ean13Top");
    var bottomValue = getNumberValue("ean13Bottom");

    var fontFamilyStr = fontFamilyValue ? "\"" + fontFamilyValue + "\"" : null;
    var fontStyleStr = fontStyleValue ? "\"" + fontStyleValue + "\"" : null;
    var fontWeightStr = fontWeightValue ? "\"" + fontWeightValue + "\"" : null;
    var textDecorationStr = textDecorationValue ? "\"" + textDecorationValue + "\"" : null;
    var textAlignStr = textAlignValue ? "\"" + textAlignValue + "\"" : null;
    var labelPositionStr = labelPositionValue ? "\"" + labelPositionValue + "\"" : null;
    var addOnStr = addOnValue ? "\"" + addOnValue + "\"" : null;
    var addOnLabelPositionStr = addOnLabelPositionValue ? "\"" + addOnLabelPositionValue + "\"" : null;
    var colorStr = colorValue ? "\"" + colorValue + "\"" : null;
    var backgroundColorStr = backgroundColorValue ? "\"" + backgroundColorValue + "\"" : null;
    var paraPool = [
        dataValue,
        colorStr,
        backgroundColorStr,
        showLabelValue,
        labelPositionStr,
        addOnStr,
        addOnLabelPositionStr,
        fontFamilyStr,
        fontStyleStr,
        fontWeightStr,
        textDecorationStr,
        textAlignStr,
        fontSizeValue,
        leftValue,
        rightValue,
        topValue,
        bottomValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=BC_EAN13(" + params + ")";
    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyGS1SparklineSetting(){
    var dataValue =  getTextValue("gsData");
    var colorValue = getBackgroundColor("gsColor");
    var backgroundColorValue = getBackgroundColor("gsBackgroundColor");
    var showLabelValue = getNumberValue("gsShowLabel");
    var labelPositionValue = getDropDownValue("gsLabelPosition");
    var fontFamilyValue = getDropDownValue("gsFontFamily");
    var fontStyleValue = getDropDownValue("gsFontStyle" );
    var fontWeightValue = getDropDownValue("gsFontWeight");
    var textDecorationValue = getDropDownValue("gsFontTextDecoration");
    var textAlignValue = getDropDownValue("gsFontTextAlign");
    var fontSizeValue = getDropDownValue("gsFontSize");
    var leftValue = getNumberValue("gsLeft");
    var rightValue = getNumberValue("gsRight");
    var topValue = getNumberValue("gsTop");
    var bottomValue = getNumberValue("gsBottom");

    var fontFamilyStr = fontFamilyValue ? "\"" + fontFamilyValue + "\"" : null;
    var fontStyleStr = fontStyleValue ? "\"" + fontStyleValue + "\"" : null;
    var fontWeightStr = fontWeightValue ? "\"" + fontWeightValue + "\"" : null;
    var textDecorationStr = textDecorationValue ? "\"" + textDecorationValue + "\"" : null;
    var textAlignStr = textAlignValue ? "\"" + textAlignValue + "\"" : null;
    var labelPositionStr = labelPositionValue ? "\"" + labelPositionValue + "\"" : null;
    var colorStr = colorValue ? "\"" + colorValue + "\"" : null;
    var backgroundColorStr = backgroundColorValue ? "\"" + backgroundColorValue + "\"" : null;
    var paraPool = [
        dataValue,
        colorStr,
        backgroundColorStr,
        showLabelValue,
        labelPositionStr,
        fontFamilyStr,
        fontStyleStr,
        fontWeightStr,
        textDecorationStr,
        textAlignStr,
        fontSizeValue,
        leftValue,
        rightValue,
        topValue,
        bottomValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=BC_GS1_128(" + params + ")";
    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyCodabarSparklineSetting(){
    var dataValue =  getTextValue("codabarData");
    var colorValue =  getBackgroundColor("codabarColor");
    var backgroundColorValue = getBackgroundColor("codabarBackgroundColor");
    var showLabelValue = getNumberValue("codabarShowLabel");
    var labelPositionValue = getDropDownValue("codabarLabelPosition");
    var checkDigitValue = getCheckValue("codabarCheckDigit");
    var nwRatioValue = getDropDownValue("codabarNwRatio");
    var fontFamilyValue = getDropDownValue("codabarFontFamily");
    var fontStyleValue = getDropDownValue("codabarFontStyle" );
    var fontWeightValue = getDropDownValue("codabarFontWeight");
    var textDecorationValue = getDropDownValue("codabarFontTextDecoration");
    var textAlignValue = getDropDownValue("codabarFontTextAlign");
    var fontSizeValue = getDropDownValue("codabarFontSize");
    var leftValue = getNumberValue("codabarLeft");
    var rightValue = getNumberValue("codabarRight");
    var topValue = getNumberValue("codabarTop");
    var bottomValue = getNumberValue("codabarBottom");

    var fontFamilyStr = fontFamilyValue ? "\"" + fontFamilyValue + "\"" : null;
    var fontStyleStr = fontStyleValue ? "\"" + fontStyleValue + "\"" : null;
    var fontWeightStr = fontWeightValue ? "\"" + fontWeightValue + "\"" : null;
    var textDecorationStr = textDecorationValue ? "\"" + textDecorationValue + "\"" : null;
    var textAlignStr = textAlignValue ? "\"" + textAlignValue + "\"" : null;
    var labelPositionStr = labelPositionValue ? "\"" + labelPositionValue + "\"" : null;
    var colorStr = colorValue ? "\"" + colorValue + "\"" : null;
    var backgroundColorStr = backgroundColorValue ? "\"" + backgroundColorValue + "\"" : null;
    var paraPool = [
        dataValue,
        colorStr,
        backgroundColorStr,
        showLabelValue,
        labelPositionStr,
        checkDigitValue,
        nwRatioValue,
        fontFamilyStr,
        fontStyleStr,
        fontWeightStr,
        textDecorationStr,
        textAlignStr,
        fontSizeValue,
        leftValue,
        rightValue,
        topValue,
        bottomValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=BC_CODABAR(" + params + ")";
    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyCode93SparklineSetting(){
    var dataValue =  getTextValue("code93Data");
    var colorValue =  getBackgroundColor("code93Color");
    var backgroundColorValue = getBackgroundColor("code93BackgroundColor");
    var showLabelValue = getNumberValue("code93ShowLabel");
    var labelPositionValue = getDropDownValue("code93LabelPosition");
    var checkDigitValue = getCheckValue("code93CheckDigit");
    var fullASCIIValue = getCheckValue("code93FullASCII");
    var fontFamilyValue = getDropDownValue("code93FontFamily");
    var fontStyleValue = getDropDownValue("code93FontStyle" );
    var fontWeightValue = getDropDownValue("code93FontWeight");
    var textDecorationValue = getDropDownValue("code93FontTextDecoration");
    var textAlignValue = getDropDownValue("code93FontTextAlign");
    var fontSizeValue = getDropDownValue("code93FontSize");
    var leftValue = getNumberValue("code93Left");
    var rightValue = getNumberValue("code93Right");
    var topValue = getNumberValue("code93Top");
    var bottomValue = getNumberValue("code93Bottom");

    var fontFamilyStr = fontFamilyValue ? "\"" + fontFamilyValue + "\"" : null;
    var fontStyleStr = fontStyleValue ? "\"" + fontStyleValue + "\"" : null;
    var fontWeightStr = fontWeightValue ? "\"" + fontWeightValue + "\"" : null;
    var textDecorationStr = textDecorationValue ? "\"" + textDecorationValue + "\"" : null;
    var textAlignStr = textAlignValue ? "\"" + textAlignValue + "\"" : null;
    var labelPositionStr = labelPositionValue ? "\"" + labelPositionValue + "\"" : null;
    var colorStr = colorValue ? "\"" + colorValue + "\"" : null;
    var backgroundColorStr = backgroundColorValue ? "\"" + backgroundColorValue + "\"" : null;
    var paraPool = [
        dataValue,
        colorStr,
        backgroundColorStr,
        showLabelValue,
        labelPositionStr,
        checkDigitValue,
        fullASCIIValue,
        fontFamilyStr,
        fontStyleStr,
        fontWeightStr,
        textDecorationStr,
        textAlignStr,
        fontSizeValue,
        leftValue,
        rightValue,
        topValue,
        bottomValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=BC_CODE93(" + params + ")";
    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyCode39SparklineSetting(){
    var dataValue =  getTextValue("code39Data");
    var colorValue =  getBackgroundColor("code39Color");
    var backgroundColorValue = getBackgroundColor("code39BackgroundColor");
    var showLabelValue = getNumberValue("code39ShowLabel");
    var labelPositionValue = getDropDownValue("code39LabelPosition");
    var checkDigitValue = getCheckValue("code39CheckDigit");
    var fullASCIIValue = getCheckValue("code39FullASCII");
    var charaterValue = getCheckValue("Code39Character");
    var nwRatioValue = getDropDownValue("code39NWRatio");
    var fontFamilyValue = getDropDownValue("code39FontFamily");
    var fontStyleValue = getDropDownValue("code39FontStyle" );
    var fontWeightValue = getDropDownValue("code39FontWeight");
    var textDecorationValue = getDropDownValue("code39FontTextDecoration");
    var textAlignValue = getDropDownValue("code39FontTextAlign");
    var fontSizeValue = getDropDownValue("code39FontSize");
    var leftValue = getNumberValue("code39Left");
    var rightValue = getNumberValue("code39Right");
    var topValue = getNumberValue("code39Top");
    var bottomValue = getNumberValue("code39Bottom");

    var fontFamilyStr = fontFamilyValue ? "\"" + fontFamilyValue + "\"" : null;
    var fontStyleStr = fontStyleValue ? "\"" + fontStyleValue + "\"" : null;
    var fontWeightStr = fontWeightValue ? "\"" + fontWeightValue + "\"" : null;
    var textDecorationStr = textDecorationValue ? "\"" + textDecorationValue + "\"" : null;
    var textAlignStr = textAlignValue ? "\"" + textAlignValue + "\"" : null;
    var labelPositionStr = labelPositionValue ? "\"" + labelPositionValue + "\"" : null;
    var colorStr = colorValue ? "\"" + colorValue + "\"" : null;
    var backgroundColorStr = backgroundColorValue ? "\"" + backgroundColorValue + "\"" : null;
    var paraPool = [
        dataValue,
        colorStr,
        backgroundColorStr,
        showLabelValue,
        labelPositionStr,
        charaterValue,
        checkDigitValue,
        nwRatioValue,
        fullASCIIValue,
        fontFamilyStr,
        fontStyleStr,
        fontWeightStr,
        textDecorationStr,
        textAlignStr,
        fontSizeValue,
        leftValue,
        rightValue,
        topValue,
        bottomValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=BC_CODE39(" + params + ")";
    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyCode49SparklineSetting(){
    var dataValue =  getTextValue("code49Data");
    var colorValue =  getBackgroundColor("code49Color");
    var backgroundColorValue = getBackgroundColor("code49BackgroundColor");
    var showLabelValue = getNumberValue("code49ShowLabel");
    var labelPositionValue = getDropDownValue("code49LabelPosition");
    var groupValue = getCheckValue("code49Grouping");
    var groupNoValue = getNumberValue("code49GroupNo");
    var fontFamilyValue = getDropDownValue("code49FontFamily");
    var fontStyleValue = getDropDownValue("code49FontStyle" );
    var fontWeightValue = getDropDownValue("code49FontWeight");
    var textDecorationValue = getDropDownValue("code49FontTextDecoration");
    var textAlignValue = getDropDownValue("code49FontTextAlign");
    var fontSizeValue = getDropDownValue("code49FontSize");
    var leftValue = getNumberValue("code49Left");
    var rightValue = getNumberValue("code49Right");
    var topValue = getNumberValue("code49Top");
    var bottomValue = getNumberValue("code49Bottom");

    var fontFamilyStr = fontFamilyValue ? "\"" + fontFamilyValue + "\"" : null;
    var fontStyleStr = fontStyleValue ? "\"" + fontStyleValue + "\"" : null;
    var fontWeightStr = fontWeightValue ? "\"" + fontWeightValue + "\"" : null;
    var textDecorationStr = textDecorationValue ? "\"" + textDecorationValue + "\"" : null;
    var textAlignStr = textAlignValue ? "\"" + textAlignValue + "\"" : null;
    var labelPositionStr = labelPositionValue ? "\"" + labelPositionValue + "\"" : null;
    var colorStr = colorValue ? "\"" + colorValue + "\"" : null;
    var backgroundColorStr = backgroundColorValue ? "\"" + backgroundColorValue + "\"" : null;
    var paraPool = [
        dataValue,
        colorStr,
        backgroundColorStr,
        showLabelValue,
        labelPositionStr,
        groupValue,
        groupNoValue,
        fontFamilyStr,
        fontStyleStr,
        fontWeightStr,
        textDecorationStr,
        textAlignStr,
        fontSizeValue,
        leftValue,
        rightValue,
        topValue,
        bottomValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=BC_CODE49(" + params + ")";
    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyCode128SparklineSetting(){
    var dataValue =  getTextValue("code128Data");
    var colorValue =  getBackgroundColor("code128Color");
    var backgroundColorValue = getBackgroundColor("code128BackgroundColor");
    var showLabelValue = getNumberValue("code128ShowLabel");
    var labelPositionValue = getDropDownValue("code128LabelPosition");
    var codesetValue = getDropDownValue("code128CodeSet");
    var fontFamilyValue = getDropDownValue("code128FontFamily");
    var fontStyleValue = getDropDownValue("code128FontStyle" );
    var fontWeightValue = getDropDownValue("code128FontWeight");
    var textDecorationValue = getDropDownValue("code128FontTextDecoration");
    var textAlignValue = getDropDownValue("code128FontTextAlign");
    var fontSizeValue = getDropDownValue("code128FontSize");
    var leftValue = getNumberValue("code128Left");
    var rightValue = getNumberValue("code128Right");
    var topValue = getNumberValue("code128Top");
    var bottomValue = getNumberValue("code128Bottom");

    var fontFamilyStr = fontFamilyValue ? "\"" + fontFamilyValue + "\"" : null;
    var fontStyleStr = fontStyleValue ? "\"" + fontStyleValue + "\"" : null;
    var fontWeightStr = fontWeightValue ? "\"" + fontWeightValue + "\"" : null;
    var textDecorationStr = textDecorationValue ? "\"" + textDecorationValue + "\"" : null;
    var textAlignStr = textAlignValue ? "\"" + textAlignValue + "\"" : null;
    var codesetStr = codesetValue ? "\"" + codesetValue + "\"" : null;
    var labelPositionStr = labelPositionValue ? "\"" + labelPositionValue + "\"" : null;
    var colorStr = colorValue ? "\"" + colorValue + "\"" : null;
    var backgroundColorStr = backgroundColorValue ? "\"" + backgroundColorValue + "\"" : null;
    var paraPool = [
        dataValue,
        colorStr,
        backgroundColorStr,
        showLabelValue,
        labelPositionStr,
        codesetStr,
        fontFamilyStr,
        fontStyleStr,
        fontWeightStr,
        textDecorationStr,
        textAlignStr,
        fontSizeValue,
        leftValue,
        rightValue,
        topValue,
        bottomValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=BC_CODE128(" + params + ")";
    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyPDFSparklineSetting(){
    var dataValue =  getTextValue("pdfData");
    var colorValue =  getBackgroundColor("pdfColor");
    var backgroundColorValue = getBackgroundColor("pdfBackgroundColor");
    var errorCorrectionLevelValue = getDropDownValue("pdfLevel");
    var rowsValue = getDropDownValue("pdfRows");
    var columnsValue = getDropDownValue("pdfColumns");
    var compactValue = getCheckValue("pdfCompact");
    var leftValue = getNumberValue("pdfLeft");
    var rightValue = getNumberValue("pdfRight");
    var topValue = getNumberValue("pdfTop");
    var bottomValue = getNumberValue("pdfBottom");

    var errorCorrectionLevelStr = errorCorrectionLevelValue === "auto" ? (errorCorrectionLevelValue ? "\"" + errorCorrectionLevelValue + "\"" : null) : errorCorrectionLevelValue;
    var rowsStr = rowsValue === "auto" ? (rowsValue ? "\"" + rowsValue + "\"" : null) : rowsValue ;
    var columnsStr = columnsValue === "auto" ? (columnsValue ? "\"" + columnsValue + "\"" : null) : columnsValue ;
    var colorStr = colorValue ? "\"" + colorValue + "\"" : null;
    var backgroundColorStr = backgroundColorValue ? "\"" + backgroundColorValue + "\"" : null;
    var paraPool = [
        dataValue,
        colorStr,
        backgroundColorStr,
        errorCorrectionLevelStr,
        rowsStr,
        columnsStr,
        compactValue,
        leftValue,
        rightValue,
        topValue,
        bottomValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=BC_PDF417(" + params + ")";
    setFormulaSparkline(formula);
    updateFormulaBar();
}

function applyDataMatrixSparklineSetting(){
    var dataValue = getTextValue("dataMatrixData");
    var colorValue = getBackgroundColor("dataMatrixColor");
    var backgroundColorValue = getBackgroundColor("dataMatrixBackgroundColor");
    var eccModeValue = getDropDownValue("dataMatrixEccMode");
    var ecc200SymbolSizeValue = getTextValue("dataMatrixSymbolSize");
    var ecc200EndcodingModeValue = getTextValue("dataMatrixEndcodingMode");
    var ecc00140SymboleValue = getTextValue("dataMatrixSymbole");
    var structureNumberValue = getDropDownValue("dataMatrixStructureNumber");
    var fileIdentifierValue =getNumberValue("dataMatrixFileIdentifier");
    var structureAppendValue = getCheckValue("dataMatrixStructureAppend");
    var leftValue = getNumberValue("dataMatrixLeft");
    var rightValue = getNumberValue("dataMatrixRight");
    var topValue = getNumberValue("dataMatrixTop");
    var bottomValue = getNumberValue("dataMatrixBottom");

    var eccModeStr = eccModeValue ? "\"" + eccModeValue + "\"" : null;
    var ecc200SymbolSizeStr = ecc200SymbolSizeValue ? "\"" + ecc200SymbolSizeValue + "\"" : null;
    var ecc200EndcodingModeStr = ecc200EndcodingModeValue ? "\"" + ecc200EndcodingModeValue + "\"" : null;
    var ecc00140SymboleStr = ecc00140SymboleValue ? "\"" + ecc00140SymboleValue + "\"" : null;
    var colorStr = colorValue ? "\"" + colorValue + "\"" : null;
    var backgroundColorStr = backgroundColorValue ? "\"" + backgroundColorValue + "\"" : null;
    var paraPool = [
        dataValue,
        colorStr,
        backgroundColorStr,
        eccModeStr,
        ecc200SymbolSizeStr,
        ecc200EndcodingModeStr,
        ecc00140SymboleStr,
        structureAppendValue,
        structureNumberValue,
        fileIdentifierValue,
        leftValue,
        rightValue,
        topValue,
        bottomValue
    ];
    var params = formatFormula(paraPool);
    var formula = "=BC_DataMatrix(" + params + ")";
    setFormulaSparkline(formula);
    updateFormulaBar();
}

// Sparkline related items (end)

// Zoom related items
function processZoomSetting(value, title) {
    if (typeof value === 'number') {
        spread.getActiveSheet().zoom(value);
    }
    else {
        console.log("processZoomSetting not process with ", value, title);
    }
}
// Zoom related items (end)

function getResource(key) {
    key = key.replace(/\./g, "_");

    return resourceMap[key];
}

function getResourceMap(src) {
    function isObject(item) {
        return typeof item === "object";
    }

    function addResourceMap(map, obj, keys) {
        if (isObject(obj)) {
            for (var p in obj) {
                var cur = obj[p];

                addResourceMap(map, cur, keys.concat(p));
            }
        } else {
            var key = keys.join("_");
            map[key] = obj;
        }
    }

    addResourceMap(resourceMap, src, []);
}

$(document).ready(function () {

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (searchString, position) {
            position = position || 0;
            return this.substr(position, searchString.length) === searchString;
        };
    }

    function localizeUI() {
        function getLocalizeString(text) {
            var matchs = text.match(/(?:(@[\w\d\.]*@))/g);

            if (matchs) {
                matchs.forEach(function (item) {
                    var s = getResource(item.replace(/[@]/g, ""));
                    text = text.replace(item, s);
                });
            }

            return text;
        }

        $(".localize").each(function () {
            var text = $(this).text();

            $(this).text(getLocalizeString(text));
        });

        $(".localize-tooltip").each(function () {
            var text = $(this).prop("title");

            $(this).prop("title", getLocalizeString(text));
        });

        $(".localize-value").each(function () {
            var text = $(this).attr("value");

            $(this).attr("value", getLocalizeString(text));
        });
    }

    function setDropdownDefault() {
        $('.btn-group ul.dropdown-menu li.default').each(function () {
            var $a = $('a', this),
                $group = $(this).parents('.btn-group');
            $span = $('span.content', $group);

            $group.attr('data-value', $a.attr('data-value'));
            $span.text($a.text());
            $(this).addClass('selected');
        });
    }

    getResourceMap(uiResource);

    localizeUI();
    $colorPickerContainer = $("#colorPicker");
    $(".themeColorsLabel", $colorPickerContainer).text(uiResource.colorPicker.themeColors);
    $(".standardColorsLabel", $colorPickerContainer).text(uiResource.colorPicker.standardColors);

    $colorPickerContainer.on("click", ignoreEvent);

    spread = new spreadNS.Workbook($("#ss")[0]);
    colorPicker = new ColorPicker($colorPickerContainer);

    var chartColors = ChartHelper.chartColors;

    var $chartColorPicker = $("#chart-color-picker");
    chartColorPicker = new ChartColorPicker($chartColorPicker, getColorsForChartColorPicker(chartColors));
    chartColorPicker.onSelectedColorChanged = function (selectedColorItem) {
        var group = selectedColorItem.group, index = selectedColorItem.index;
        Actions.changeChartSeriesColor(spread, {
            group: group,
            index: index
        });
    };

    function getColorsForChartColorPicker(chartColors) {
        var newColors = {};
        var sheet = spread.getActiveSheet();
        for (var group in chartColors) {
            if (chartColors.hasOwnProperty(group)) {
                var chartColorGroup = chartColors[group];
                var colorGroup = {};
                colorGroup.name = chartColorGroup.name;
                colorGroup.colors = processChartGroupColors(chartColorGroup.colors, 6, sheet);
                newColors[group] = colorGroup;
            }
        }
        return newColors;
    }

    function processChartGroupColors(chartGroupColors, count, sheet) {
        var colors = [];
        chartGroupColors.forEach(function (chartGroupColor) {
            var groupColor = {};
            groupColor.tip = chartGroupColor.tip;
            var chartGroupColorItem = chartGroupColor.items;
            if (!(chartGroupColorItem instanceof Array)) {
                chartGroupColorItem = ChartHelper.getGradientThemeColor(chartGroupColorItem.startColor, chartGroupColorItem.stopColor, count);
            }
            groupColor.items = processGroupColorItems(chartGroupColorItem, sheet);
            colors.push(groupColor);
        });
        return colors;
    }

    function processGroupColorItems(chartGroupColorItem, sheet) {
        var theme = sheet.currentTheme();
        return chartGroupColorItem.map(function (item) {
            return theme.getColor(item);
        });
    }

    addMenu();

    initRibbon(colorPicker);

    prepareFunctionBuilder($("#functionBuiilder"));
    prepareCellFormatSetting($("#cellFormatSetting"));

    setDropdownDefault();

    //spread = new spreadNS.Spread($("#ss")[0]);
    // spread = new spreadNS.Workbook($("#ss")[0]);
    excelIO = new GC.Spread.Excel.IO();
    //formulabox
    //fbx = new spreadNS.FormulaTextBox(document.getElementById('formulabox'));
    fbx = new spreadNS.FormulaTextBox.FormulaTextBox(document.getElementById('formulabox'));
    fbx.workbook(spread);
    initSpread();

    //window resize adjust
    var resizeTimeout = null;
    $(window).bind("resize", function () {
        if (resizeTimeout === null) {
            resizeTimeout = setTimeout(function () {
                screenAdoption();
                clearTimeout(resizeTimeout);
                resizeTimeout = null;
            }, 100);
        }
    });

    doPrepareWork();

    var toolbarHeight = $("#toolbar").height(),
        formulaboxDefaultHeight = $("#formulabox").outerHeight(true),
        verticalSplitterOriginalTop = formulaboxDefaultHeight - $("#verticalSplitter").height();
    $("#verticalSplitter").draggable({
        axis: "y",              // vertical only
        containment: "#inner-content-container",  // limit in specified range
        scroll: false,          // not allow container scroll
        zIndex: 100,            // set to move on top
        stop: function (event, ui) {
            var $this = $(this),
                top = $this.offset().top,
                offset = top - toolbarHeight - verticalSplitterOriginalTop;

            // limit min size
            if (offset < 0) {
                offset = 0;
            }
            // adjust size of related items
            $("#formulabox").css({height: formulaboxDefaultHeight + offset});
            var height = $("#inner-content-container").height() - $("#formulabox").outerHeight(true);
            $("#controlPanel").height(height);
            $("#ss").height(height);
            spread.refresh();
            // reset
            $(this).css({top: 0});
        }
    });

    attachEvents();
    $("#downloadlink").on("click", function (e) {
        e.preventDefault();
        return false;
    });
    $(window).resize();

    spread.focus();

    syncSheetPropertyValues();

    onCellSelected();

    updatePositionBox(spread.getActiveSheet());
    //fix bug 220484
    if (isIE) {
        $("#formulabox").css('padding', 0);
    }

    window.richEditor.init({
        element: document.getElementById('richEditor'),
        defaultParagraphSeparator: defaultParagraphSeparator,
        styleWithCSS: false,
        onChange:function () {
            document.getElementById('richTextResult').innerText = JSON.stringify(getRichText());
        }
    });
});

function ignoreEvent(event) {
    if (!$(event.target).data('contextmenu')) {
        event.preventDefault();
        return false;
    }
}

// context menu related items
function getCellInSelections(selections, row, col) {
    var count = selections.length, range;
    for (var i = 0; i < count; i++) {
        range = selections[i];
        if (range.contains(row, col)) {
            return range;
        }
    }
    return null;
}
function getHitTest(pageX, pageY, sheet) {
    var offset = $("#ss").offset(),
        x = pageX - offset.left,
        y = pageY - offset.top;
    return sheet.hitTest(x, y);
}

// import / export related items
function importFile(file) {
    var fileName = file.name;
    var index = fileName.lastIndexOf('.');
    var fileExt = fileName.substr(index + 1).toLowerCase();
    if (fileExt === 'json' || fileExt === 'ssjson') {
        importSpreadFromJSON(file);
    } else if (fileExt === 'xlsx') {
        importSpreadFromExcel(file);
    } else {
        alert(getResource("messages.invalidImportFile"));
    }
}

function importSpreadFromExcel(file) {
    var password = $("#openPassword").val();
    excelIO.open(file, function (json) {
        importJson(json);
    }, function (e) {
        if (e.errorCode === 0 || e.errorCode === 1) {
            alert(getResource("messages.invalidImportFile"));
        } else if (e.errorCode === 2) {
            alert(e.errorMessage);
            $("#openPassword").val('');
            $("#openPassword").select();
        } else if (e.errorCode === 3) {
            alert(e.errorMessage);
            $("#openPassword").val('');
            $("#openPassword").select();
        }
    }, {password: password});
}

function importSpreadFromJSON(file, fileContent) {
    function importSuccessCallback(responseText) {
        var spreadJson = JSON.parse(responseText);
        importJson(spreadJson);
    }

    if (file) {
        var reader = new FileReader();
        reader.onload = function () {
            importSuccessCallback(this.result);
        };
        reader.readAsText(file);
    } else if (fileContent) {
        importSuccessCallback(fileContent)
    }
    return true;
}
function importJson(spreadJson) {
    function updateActiveCells() {
        for (var i = 0; i < spread.getSheetCount(); i++) {
            var sheet = spread.getSheet(i),
                columnIndex = sheet.getActiveColumnIndex(),
                rowIndex = sheet.getActiveRowIndex();
            if (columnIndex !== undefined && rowIndex !== undefined) {
                spread.getSheet(i).setActiveCell(rowIndex, columnIndex);
            } else {
                spread.getSheet(i).setActiveCell(0, 0);
            }
        }
    }

    if (spreadJson.version && spreadJson.sheets) {
        spread.unbindAll();
        spread.fromJSON(spreadJson);
        app.reset(true);
        updateActiveCells();
        spread.focus();
        onCellSelected();
        syncSpreadPropertyValues();
        syncSheetPropertyValues();
        app.fileMenu.closeFileScreen();
    } else {
        alert(getResource("messages.invalidImportFile"));
    }
}

function getFileName() {
    function to2DigitsString(num) {
        return ("0" + num).substr(-2);
    }

    var date = new Date();
    return [
        "export",
        date.getFullYear(), to2DigitsString(date.getMonth() + 1), to2DigitsString(date.getDate()),
        to2DigitsString(date.getHours()), to2DigitsString(date.getMinutes()), to2DigitsString(date.getSeconds())
    ].join("");
}

function exportFile(fileName) {
    if ($("#saveJson")[0].checked) {
        exportToJSON(fileName);
    } else if ($("#saveExcel")[0].checked) {
        exportToExcel(fileName);
    } else if ($("#savePdf")[0].checked) {
        exportToPdf(fileName);
    }
}

function exportToJSON(fileName) {
    var json = spread.toJSON({includeBindingSource: true}),
        text = JSON.stringify(json);
    if (isSafari) {
        $("#download").show();
        var link = $("#downloadlink");
        link[0].href = "data:text/plain;" + text;
    } else {
        saveAs(new Blob([text], {type: "text/plain;charset=utf-8"}), fileName + ".ssjson");
    }
}

function exportToExcel(fileName) {
    var json = spread.toJSON({includeBindingSource: true});
    var password = $("#savePassword").val();
    excelIO.save(json, function (blob) {
        if (isSafari) {
            var reader = new FileReader();
            reader.onloadend = function () {
                $("#download").show();
                var link = $("#downloadlink");
                link[0].href = reader.result;
            };
            reader.readAsDataURL(blob);
        } else {
            saveAs(blob, fileName + ".xlsx");
        }
    }, function (e) {
        alert(e);
    }, {password: password});
}

function exportToPdf(fileName) {
    spread.savePDF(function (blob) {
        if (isSafari) {
            var reader = new FileReader();
            reader.onloadend = function () {
                $("#download").show();
                var link = $("#downloadlink");
                link[0].href = reader.result;
            };
            reader.readAsDataURL(blob);
        } else {
            saveAs(blob, fileName + ".pdf");
        }
    }, function (e) {
        alert(e);
    })
}
app.saveBrowserFile = exportFile;

// import / export related items (end)

// positionbox related items
function getSelectedRangeString(sheet, range) {
    var selectionInfo = "",
        rowCount = range.rowCount,
        columnCount = range.colCount,
        startRow = range.row + 1,
        startColumn = range.col + 1;

    if (rowCount == 1 && columnCount == 1) {
        selectionInfo = getCellPositionString(sheet, startRow, startColumn);
    }
    else {
        if (rowCount < 0 && columnCount > 0) {
            selectionInfo = columnCount + "C";
        }
        else if (columnCount < 0 && rowCount > 0) {
            selectionInfo = rowCount + "R";
        }
        else if (rowCount < 0 && columnCount < 0) {
            selectionInfo = sheet.getRowCount() + "R x " + sheet.getColumnCount() + "C";
        }
        else {
            selectionInfo = rowCount + "R x " + columnCount + "C";
        }
    }
    return selectionInfo;
}

function getColumnName(column) {
    var letters = "";
    while (column > 0) {
        var num = column % 26;
        if (num === 0) {
            letters = "Z" + letters;
            column--;
        }
        else {
            letters = String.fromCharCode('A'.charCodeAt(0) + num - 1) + letters;
        }
        column = parseInt((column / 26).toString());
    }
    return letters;
}

function getCellPositionString(sheet, row, column) {
    if (row < 1 || column < 1) {
        return null;
    }
    else {
        var letters = "";
        switch (spread.options.referenceStyle) {
            case spreadNS.ReferenceStyle.a1: // 0
                letters = getColumnName(column) + row.toString();
                break;
            case spreadNS.ReferenceStyle.r1c1: // 1
                letters = "R" + row.toString() + "C" + column.toString();
                break;
            default:
                break;
        }
        return letters;
    }
}
// positionbox related items (end)

// slicer related items
function syncSlicerPropertyValues(sheet) {
    var selectedSlicers = getSelectedSlicers(sheet);
    if (!selectedSlicers || selectedSlicers.length === 0) {
        return false;
    }
    else if (selectedSlicers.length > 1) {
        getMultiSlicerSetting(selectedSlicers);
        setTextDisabled("slicerName", true);
    }
    else if (selectedSlicers.length === 1) {
        getSingleSlicerSetting(selectedSlicers[0]);
        setTextDisabled("slicerName", false);
    }

    return true;
}

function getSingleSlicerSetting(slicer) {
    if (!slicer) {
        return;
    }
    setTextValue("slicerName", slicer.name());
    setTextValue("slicerCaptionName", slicer.captionName());
    setDropDown("slicerItemSorting", slicer.sortState());
    setCheckValue("displaySlicerHeader", slicer.showHeader());
    setNumberValue("slicerColumnNumber", slicer.columnCount());
    setNumberValue("slicerButtonWidth", getSlicerItemWidth(slicer.columnCount(), slicer.width()));
    setNumberValue("slicerButtonHeight", slicer.itemHeight());
    if (slicer.dynamicMove()) {
        if (slicer.dynamicSize()) {
            setRadioItemChecked("slicerMoveAndSize", "slicer-move-size");
        }
        else {
            setRadioItemChecked("slicerMoveAndSize", "slicer-move-nosize");
        }
    }
    else {
        setRadioItemChecked("slicerMoveAndSize", "slicer-nomove-size");
    }
    setCheckValue("lockSlicer", slicer.isLocked());

    var styleName = getSlicerStyleName(slicer);
    markSlicerStyleSelected(styleName);

    setNoDataRelatedValue(!slicer.showNoDataItems(), slicer.visuallyNoDataItems(), slicer.showNoDataItemsInLast());
}

function getMultiSlicerSetting(selectedSlicers) {
    if (!selectedSlicers || selectedSlicers.length === 0) {
        return;
    }
    var slicer = selectedSlicers[0];
    var isDisplayHeader = false,
        isSameSortState = true,
        isSameCaptionName = true,
        isSameColumnCount = true,
        isSameItemHeight = true,
        isSameItemWidth = true,
        isSameLocked = true,
        isSameDynamicMove = true,
        isSameDynamicSize = true,
        isHideItem = false,
        isVisuallyItem = false,
        isShowItemLast = false;

    var sortState = slicer.sortState(),
        captionName = slicer.captionName(),
        columnCount = slicer.columnCount(),
        itemHeight = slicer.itemHeight(),
        itemWidth = getSlicerItemWidth(columnCount, slicer.width()),
        dynamicMove = slicer.dynamicMove(),
        dynamicSize = slicer.dynamicSize();

    var styleName = getSlicerStyleName(slicer);

    for (var item in selectedSlicers) {
        var slicer = selectedSlicers[item];
        isDisplayHeader = isDisplayHeader || slicer.showHeader();
        isSameLocked = isSameLocked && slicer.isLocked();
        if (slicer.sortState() !== sortState) {
            isSameSortState = false;
        }
        if (slicer.captionName() !== captionName) {
            isSameCaptionName = false;
        }
        if (slicer.columnCount() !== columnCount) {
            isSameColumnCount = false;
        }
        if (slicer.itemHeight() !== itemHeight) {
            isSameItemHeight = false;
        }
        if (getSlicerItemWidth(slicer.columnCount(), slicer.width()) !== itemWidth) {
            isSameItemWidth = false;
        }
        if (slicer.dynamicMove() !== dynamicMove) {
            isSameDynamicMove = false;
        }
        if (slicer.dynamicSize() !== dynamicSize) {
            isSameDynamicSize = false;
        }
        if (styleName && (styleName !== getSlicerStyleName(slicer))) {
            styleName = "";
        }
        isHideItem = isHideItem || !slicer.showNoDataItems();
        isVisuallyItem = isVisuallyItem || slicer.visuallyNoDataItems();
        isShowItemLast = isShowItemLast || slicer.showNoDataItemsInLast();
    }

    markSlicerStyleSelected(styleName);

    setTextValue("slicerName", "");
    if (isSameCaptionName) {
        setTextValue("slicerCaptionName", captionName);
    }
    else {
        setTextValue("slicerCaptionName", "");
    }
    if (isSameSortState) {
        setDropDown("slicerItemSorting", sortState);
    }
    else {
        setDropDown("slicerItemSorting", "");
    }
    setCheckValue("displaySlicerHeader", isDisplayHeader);
    if (isSameDynamicMove && isSameDynamicSize && dynamicMove) {
        if (dynamicSize) {
            setRadioItemChecked("slicerMoveAndSize", "slicer-move-size");
        }
        else {
            setRadioItemChecked("slicerMoveAndSize", "slicer-move-nosize");
        }
    }
    else {
        setRadioItemChecked("slicerMoveAndSize", "slicer-nomove-size");
    }
    if (isSameColumnCount) {
        setNumberValue("slicerColumnNumber", columnCount);
    }
    else {
        setNumberValue("slicerColumnNumber", "");
    }
    if (isSameItemHeight) {
        setNumberValue("slicerButtonHeight", Math.round(itemHeight));
    }
    else {
        setNumberValue("slicerButtonHeight", "");
    }
    if (isSameItemWidth) {
        setNumberValue("slicerButtonWidth", itemWidth);
    }
    else {
        setNumberValue("slicerButtonWidth", "");
    }
    setCheckValue("lockSlicer", isSameLocked);
    setNoDataRelatedValue(isHideItem, isVisuallyItem, isShowItemLast);
}

function getSlicerStyleName(slicer) {
    var slicerStyle = slicer.style(),
        styleName = slicerStyle && slicerStyle.name();

    return styleName;
}

var selectedStyleClassName = "slicer-format-item-selected";

function markSlicerStyleSelected(styleName) {
    $(".slicer-format-2013 div." + selectedStyleClassName).removeClass(selectedStyleClassName);
    if (styleName) {
        var name = styleName.split("SlicerStyle")[1];
        if (name) {
            $(".slicer-format-2013 div[data-name='" + name.toLowerCase() + "']").parent().addClass(selectedStyleClassName);
        }
    }
}

function setNoDataRelatedValue(isHideItem, isVisuallyItem, isShowItemLast) {
    setCheckValue("hide-no-data", isHideItem);
    setCheckValue("mark-no-data", isVisuallyItem);
    setCheckValue("show-no-data-last", isShowItemLast);
    enableRelatedItems(["mark-no-data"], !isHideItem);
    enableRelatedItems(["show-no-data-last"], !isHideItem || isVisuallyItem);
}

function changeSlicerInfo(slicer, propertyName) {
    if (!slicer) {
        return;
    }
    switch (propertyName) {
        case "width":
            setNumberValue("slicerButtonWidth", getSlicerItemWidth(slicer.columnCount(), slicer.width()));
            break;
    }
}

function setSlicerSetting(property, value) {
    var sheet = spread.getActiveSheet();
    var selectedSlicers = getSelectedSlicers(sheet);
    if (!selectedSlicers || selectedSlicers.length === 0) {
        return;
    }
    else {
        for (var item in selectedSlicers) {
            setSlicerProperty(selectedSlicers[item], property, value);
        }
    }
}

function setSlicerProperty(slicer, property, value) {
    switch (property) {
        case "name":
            var sheet = spread.getActiveSheet();
            var slicerPreName = slicer.name();
            if (!value) {
                alert(getResource("messages.invalidSlicerName"));
                setTextValue("slicerName", slicerPreName);
            }
            else if (value && value !== slicerPreName) {
                if (sheet.slicers.get(value)) {
                    alert(getResource("messages.duplicatedSlicerName"));
                    setTextValue("slicerName", slicerPreName);
                }
                else {
                    slicer.name(value);
                }
            }
            break;
        case "captionName":
            slicer.captionName(value);
            break;
        case "sortState":
            slicer.sortState(value);
            break;
        case "showHeader":
            slicer.showHeader(value);
            break;
        case "columnCount":
            slicer.columnCount(value);
            break;
        case "itemHeight":
            slicer.itemHeight(value);
            break;
        case "itemWidth":
            slicer.width(getSlicerWidthFromItem(slicer.columnCount(), value));
            break;
        case "moveSize":
            if (value === "slicer-move-size") {
                slicer.dynamicMove(true);
                slicer.dynamicSize(true);
            }
            if (value === "slicer-move-nosize") {
                slicer.dynamicMove(true);
                slicer.dynamicSize(false);
            }
            if (value === "slicer-nomove-size") {
                slicer.dynamicMove(false);
                slicer.dynamicSize(false);
            }
            break;
        case "lock":
            slicer.isLocked(value);
            break;
        case "style":
            slicer.style(value);
            break;

        case "showNoDataItems":
            slicer.showNoDataItems(value);
            break;

        case "visuallyNoDataItems":
            slicer.visuallyNoDataItems(value);
            break;

        case "showNoDataItemsInLast":
            slicer.showNoDataItemsInLast(value);
            break;

        default:
            console.log("Slicer doesn't have property:", property);
            break;
    }
}

function setTextDisabled(name, isDisabled) {
    var $input = $("inpu[data-name='" + name + "']");
    $input.attr("disabled", isDisabled);
}

function setRadioItemChecked(groupName, value) {
    var groupSelector = "input[name='" + groupName + "']";
    $(groupSelector).removeClass("checked");
    $(groupSelector + "[data-value='" + value + "']").addClass("checked");
}

function getSlicerItemWidth(count, slicerWidth) {
    if (count <= 0) {
        count = 1; //Column count will be converted to 1 if it is set to 0 or negative number.
    }
    var SLICER_PADDING = 6;
    var SLICER_ITEM_SPACE = 2;
    var itemWidth = Math.round((slicerWidth - SLICER_PADDING * 2 - (count - 1) * SLICER_ITEM_SPACE) / count);
    if (itemWidth < 0) {
        return 0;
    }
    else {
        return itemWidth;
    }
}

function getSlicerWidthFromItem(count, itemWidth) {
    if (count <= 0) {
        count = 1; //Column count will be converted to 1 if it is set to 0 or negative number.
    }
    var SLICER_PADDING = 6;
    var SLICER_ITEM_SPACE = 2;
    return Math.round(itemWidth * count + (count - 1) * SLICER_ITEM_SPACE + SLICER_PADDING * 2);
}

function getSelectedSlicers(sheet) {
    if (!sheet) {
        return null;
    }
    // var slicers = sheet.getSlicers();
    var slicers = sheet.slicers.all();
    if (!slicers || slicers.length === 0) {
        return null;
    }
    var selectedSlicers = [];
    for (var item in slicers) {
        if (slicers[item].isSelected()) {
            selectedSlicers.push(slicers[item]);
        }
    }
    return selectedSlicers;
}

function processSlicerItemSorting(sortValue) {
    switch (sortValue) {
        case 0:
        case 1:
        case 2:
            setSlicerSetting("sortState", sortValue);
            break;

        default:
            console.log("processSlicerItemSorting not process with ", name);
            return;
    }
}

function changeSlicerStyle() {
    spread.suspendPaint();

    var styleName = $(">div", this).data("name");
    var slicerStyle;
    // setSlicerSetting("style", spreadNS.SlicerStyles[styleName]());
    switch (styleName) {
        case "light1":
            slicerStyle = GC.Spread.Sheets.Slicers.SlicerStyles.light1();
            break;
        case "light2":
            slicerStyle = GC.Spread.Sheets.Slicers.SlicerStyles.light2();
            break;
        case "light3":
            slicerStyle = GC.Spread.Sheets.Slicers.SlicerStyles.light3();
            break;
        case "light4":
            slicerStyle = GC.Spread.Sheets.Slicers.SlicerStyles.light4();
            break;
        case "light5":
            slicerStyle = GC.Spread.Sheets.Slicers.SlicerStyles.light5();
            break;
        case "light6":
            slicerStyle = GC.Spread.Sheets.Slicers.SlicerStyles.light6();
            break;
        case "other1":
            slicerStyle = GC.Spread.Sheets.Slicers.SlicerStyles.other1();
            break;
        case "other2":
            slicerStyle = GC.Spread.Sheets.Slicers.SlicerStyles.other2();
            break;
        case "dark1":
            slicerStyle = GC.Spread.Sheets.Slicers.SlicerStyles.dark1();
            break;
        case "dark2":
            slicerStyle = GC.Spread.Sheets.Slicers.SlicerStyles.dark2();
            break;
        case "dark3":
            slicerStyle = GC.Spread.Sheets.Slicers.SlicerStyles.dark3();
            break;
        case "dark4":
            slicerStyle = GC.Spread.Sheets.Slicers.SlicerStyles.dark4();
            break;
        case "dark5":
            slicerStyle = GC.Spread.Sheets.Slicers.SlicerStyles.dark5();
            break;
        case "dark6":
            slicerStyle = GC.Spread.Sheets.Slicers.SlicerStyles.dark6();
            break;
    }
    setSlicerSetting("style", slicerStyle);
    markSlicerStyleSelected("SlicerStyle" + styleName);

    spread.resumePaint();
}
// slicer related items (end)

// spread theme related items
function processChangeSpreadTheme(value) {
    $("link[title='spread-theme']").attr("href", value);

    setTimeout(
        function () {
            spread.refresh();
        }, 300);
}
// spread theme related items (end)

// ribbon related items
function initRibbon(colorPicker) {
    ribbon = new Ribbon(data,
        document.getElementById('toolbar'),
        colorPicker);

    $tableStyleDropdown = $("#table div[data-name='tableStyles'] > ul");

    // prepare table style drop down
    $("<li></li>").append($("#tableStyles")).appendTo($tableStyleDropdown);

    // set tooltips for dropdown and icon
    var tooltip = $tableStyleDropdown.parent().parent().attr("title");
    $tableStyleDropdown.parent().attr("title", tooltip);
    // icon set to default table style (medium2), will update to last selected table style for quick set
    $tableStyleDropdown.parent().prev().attr("title", uiResource.tableTab.tableStyle.medium.medium2);

    $(ribbon).on('click', processRibbonClick);
    $(ribbon).on('dropdown', processRibbonDropDown);
    $(ribbon).on('dropdownShown', processRibbonDropDownShown);
    $(ribbon).on('textChanged', processTextChanged);

    $('a[href="#file"]').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        app.fileMenu.showFileScreen();
    });
}

function processRibbonClick(e, data) {
    var name = data.name,
        value = data.value,
        title = data.header || data.text || name,
        list = data.children;
    var sheet = spread.getActiveSheet();

    spread.suspendPaint();

    switch (name) {
        // Font and Formatting Group (Home Tab)
        case "fontFamily":
            Actions.setFontFamily(spread, value);
            break;

        case "fontSize":
            Actions.setFontSize(spread, value + "pt");
            break;

        case "bold":
            Actions.setFontWeight(spread, value ? "bold" : "normal");
            break;

        case "italic":
            Actions.setFontStyle(spread, value ? "italic" : "normal");
            break;

        case "underline":
            Actions.setUnderline(spread, value);
            var doubleUnderlineElem = $('#home [data-name=doubleUnderline]');
            if (value && doubleUnderlineElem.hasClass('on')) {
                doubleUnderlineElem.click();
            }
            break;
        
        case "doubleUnderline":
            Actions.setDoubleUnderline(spread, value);
            var underlineElem = $('#home [data-name=underline]');
            if (value && underlineElem.hasClass('on')) {
                underlineElem.click();
            }
            break;

        case "overline":
            Actions.setOverline(spread, value);
            break;

        case "strikethrough":
            Actions.setStrikethroughLine(spread, value);
            break;

        case "border":
            if (value === "SET" || value === "more") {
                displaySettingPane(title, $('#borderSetting'));
            } else {
                setCellsBorder(value);
            }
            break;

        case "backColor":
            Actions.setBackColor(spread, settingCache[name]);
            break;

        case "foreColor":
            Actions.setForeColor(spread, settingCache[name]);
            break;

        // Alignment Group (Home Tab)
        case "valign-top":
        case "valign-center":
        case "valign-bottom":
        case "halign-left":
        case "halign-center":
        case "halign-right":
            var aligns = name.split('-');
            if (aligns[0] === 'halign') {
                Actions.setHAlign(spread, GC.Spread.Sheets.HorizontalAlign[aligns[1]]);
            } else {
                Actions.setVAlign(spread, GC.Spread.Sheets.VerticalAlign[aligns[1]]);
            }
            break;

        case "cellmerge":
            if (value) {
                Actions.mergeCenter(spread);
            } else {
                Actions.unmergeCells(spread);
            }
            break;

        case "wordwrap":
            Actions.setWordWrap(spread, value);
            break;

        case "verticalText":
            Actions.setVerticalText(spread, value);
            break;

        case "indent":
        case "outdent":
            Actions.setIndent(spread, name === 'indent' ? 1 : -1);
            break;

        // CellType Group (Home Tab)
        case "celltype":
            var $groups = $('#cellTypeSetting .group-celltype');
            $groups.addClass('hidden');
            $groups.filter('[data-name="' + value + '"]').removeClass('hidden');

            displaySettingPane(title, $('#cellTypeSetting'));
            break;

        // Cell Format Group (Home Tab)
        case "cellformat":
            if (value === "custom") {
                displaySettingPane(title, $('#cellFormatSetting'), syncCellFormat);
            } else {
                Actions.setFormatter(spread, value === 'nullValue' ? null : value);
            }
            break;

        case "numberformat":
            switch (value) {
                case "percentStyle":
                case "commaStyle":
                    Actions.setFormatter(spread, value === 'percentStyle' ? uiResource.cellTab.format.percentValue : uiResource.cellTab.format.commaValue);
                    break;

                case "increaseDecimal":
                    Actions.increaseDecimal(spread);
                    break;

                case "decreaseDecimal":
                    Actions.decreaseDecimal(spread);
                    break;
            }
            break;

        // Protect Group (Home Tab)
        case "protectsheet":
            Actions.protectSheet(spread, value);
            break;

        case "unlockcells":
            Actions.LockCells(spread, value);
            break;

        // Cells Group (Home Tab)
        case "cellsgroup":
            processInsertDeleteCells(value);
            break;

        case "clearformat":
            processClearCells(value);
            break;

        // Condition Format (Home Tab)
        case "conditionalformat":
            alert('TODO items, please wait.');
            break;

        case "find":
            var $container = $("#findOptions");
            displaySettingPane(title, $container, function () {
                // clear input and set default checked items
                setTextValue("findwhat", "");
                $("input[name='findin']", $container).first().prop("checked", true);
                $("input[name='searchby']", $container).first().prop("checked", true);
                $("input[name='lookin']", $container).first().prop("checked", true);
                setCheckValue("findMatchCase", false);
                setCheckValue("findMatchExactly", false);
                setCheckValue("findUseWildcards", false);
                $(".resultcount", $container).text("");
                $(".findoutput", $container).hide();
                findCache = {
                    activeSheetIndex: spread.getActiveSheetIndex(),
                    activeCellRowIndex: sheet.getActiveRowIndex(),
                    activeCellColumnIndex: sheet.getActiveColumnIndex()
                };
            });
            break;

        // Insert Tab
        case "insertTable":
            Actions.createDefaultTable(spread, spread.getActiveSheet().getSelections()[0]);
            onCellSelected();
            break;

        case "insertPicture":
            if (app && app.isNative) {
                app.showOpenFileDialog(
                    [{name: 'Images', extensions: ['jpg', 'png', 'gif']}],    // filters
                    function (err, data) {
                        if (!err && data) {
                            var dataUrl = 'data:image/jpeg;base64,' + new Buffer(data).toString('base64');
                            Actions.addPicture(spread, {name: "Picture" + pictureIndex++, url: dataUrl});
                        }
                    }
                );
            } else {
                $("#fileSelector").data("action", "addpicture");
                $("#fileSelector").attr("accept", "image/*");
                $("#fileSelector").click();
            }
            break;

        case "insertLink":
            var typeName = 'hyperlink';
            var $groups = $('#cellTypeSetting .group-celltype');
            $groups.addClass('hidden');
            $groups.filter('[data-name="' + typeName + '"]').removeClass('hidden');

            displaySettingPane(title, $('#cellTypeSetting'));
            break;

        case "insertComment":
            Actions.insertComment(spread);
            break;

        case "insertSparkline":
            processAddSparklineEx(value);
            break;

        case "insertBarCode":
            processAddBarCodeEx(value);
            break;

        case "switchRowCol":
            app.doAction("switchChartRowCol");
            break;
        case "insertChart":
        case "typeChart":
            title = title.split(' ');
            title[0] = title[0].toLocaleLowerCase();
            title = title.join('');
            var singleLevelMenuChartMap = {
                "sunburst": "sunburst",
                "treemap": "treemap"
            }
            if(singleLevelMenuChartMap[title]) {
                Actions.insertChart(spread, {
                    chartType: GC.Spread.Sheets.Charts.ChartType[singleLevelMenuChartMap[title]],
                    dataRange: spread.getActiveSheet().getSelections()[0]
                });
                var $target = $(data.element);
                $target.parents('div.open').data({ keepopen: false });
                onCellSelected();
            } else {
                var $element;
                switch (title) {
                    case "columnChart":
                    case "lineChart":
                    case "pieChart":
                    case "barChart":
                    case "areaChart":
                    case "radarChart":
                    case "radarChartTypeChanged":
                    case "columnChartTypeChanged":
                    case "lineChartTypeChanged":
                    case "pieChartTypeChanged":
                    case "barChartTypeChanged":
                    case "areaChartTypeChanged":
                        $element = $(document.body).find("ul.dropdown-menu." + title);
                        break;
                    case "xy(scatter)Chart":
                        $element = $(document.body).find("ul.dropdown-menu" + ".xyScatterChart");
                        break;
                    case "xyscatterChartTypeChanged":
                        $element = $(document.body).find("ul.dropdown-menu" + ".xyScatterChartTypeChanged");
                        break;
                }
                $element.is(':visible') ? $element.hide() : $element.show();
                $element.parent().attr('data-name', 'open');
                var chartTypes = [
                    "columnChart", "lineChart", "pieChart", "barChart", "areaChart", "xy(scatter)Chart", "radarChart",
                    "columnChartTypeChanged", "lineChartTypeChanged", "pieChartTypeChanged", "barChartTypeChanged",
                    "areaChartTypeChanged", "xyscatterChartTypeChanged", "radarChartTypeChanged"];

                chartTypes.forEach(function(chartType) {
                    if(chartType !== title) {
                        if(chartType === 'xy(scatter)Chart') {
                            chartType = 'xyScatterChart';
                        } else if (chartType === 'xyscatterChartTypeChanged') {
                            chartType = 'xyScatterChartTypeChanged';
                        }
                        $(document.body).find("ul.dropdown-menu" + "." + chartType).hide();
                        $(document.body).find("ul.dropdown-menu" + "." + chartType).parent().attr('data-name', 'close');
                    }
                })
                var $target = $(data.element);
                $target.parents('div.open').data({ keepopen: true });
            }
            break;
        case "columnChart":
        case "columnChartTypeChanged":
            title = title.split(' ');
            title[0] = title[0].toLocaleLowerCase();
            title = title.join('');
            switch (title) {
                case "clusteredColumn":
                    name === "columnChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.columnClustered, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.columnClustered});
                    break;
                case "stackedColumn":
                    name === "columnChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.columnStacked, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.columnStacked});
                    break;
                case "100%stackedColumn":
                    name === "columnChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.columnStacked100, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.columnStacked100});
                    break;
            }
            $(document.body).find("ul.dropdown-menu" + "." + name).hide();
            var $target = $(data.element);
            $target.parents('div.open').data({ keepopen: false });
            onCellSelected();
            break;
        case "lineChart":
        case "lineChartTypeChanged":
            title = title.split(' ');
            title[0] = title[0].toLocaleLowerCase();
            title = title.join('');
            switch (title) {
                case "line":
                    name === "lineChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.line, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.line});
                    break;
                case "stackedLine":
                    name === "lineChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.lineStacked, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.lineStacked});
                    break;
                case "100%stackedLine":
                    name === "lineChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.lineStacked100, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.lineStacked100});
                    break;
                case "lineWithMarkers":
                    name === "lineChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.lineMarkers, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.lineMarkers});
                    break;
                case "stackedLineWithMarkers":
                    name === "lineChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.lineMarkersStacked, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.lineMarkersStacked});
                    break;
                case "100%stackedLineWithMarkers":
                    name === "lineChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.lineMarkersStacked100, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.lineMarkersStacked100});
                    break;
            }
            $(document.body).find("ul.dropdown-menu" + "." + name).hide();
            var $target = $(data.element);
            $target.parents('div.open').data({ keepopen: false });
            onCellSelected();
            break;
        case "pieChart":
        case "pieChartTypeChanged":
            title = title.split(' ');
            title[0] = title[0].toLocaleLowerCase();
            title = title.join('');
            switch (title) {
                case "pie":
                    name === "pieChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.pie, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.pie});
                    break;
                case "doughnut":
                    name === "pieChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.doughnut, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.doughnut});
                    break;
            }
            $(document.body).find("ul.dropdown-menu" + "." + name).hide();
            var $target = $(data.element);
            $target.parents('div.open').data({ keepopen: false });
            onCellSelected();
            break;
        case "barChart":
        case "barChartTypeChanged":
            title = title.split(' ');
            title[0] = title[0].toLocaleLowerCase();
            title = title.join('');
            switch (title) {
                case "clusteredBar":
                    name === "barChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.barClustered, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.barClustered});
                    break;
                case "stackedBar":
                    name === "barChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.barStacked, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.barStacked});
                    break;
                case "100%stackedBar":
                    name === "barChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.barStacked100, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.barStacked100});
                    break;
            }
            $(document.body).find("ul.dropdown-menu" + "." + name).hide();
            var $target = $(data.element);
            $target.parents('div.open').data({ keepopen: false });
            onCellSelected();
            break;
        case "xyScatterChart":
        case "xyScatterChartTypeChanged":
            title = title.split(' ');
            title[0] = title[0].toLocaleLowerCase();
            title = title.join('');
            switch (title) {
                case "xy(scatter)":
                    name === "xyScatterChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.xyScatter, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.xyScatter});
                            break;
                case "xy(scatter)Lines":
                    name === "xyScatterChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.xyScatterLines, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.xyScatterLines});
                    break;
                case "xy(scatter)LinesNoMarkers":
                    name === "xyScatterChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.xyScatterLinesNoMarkers, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.xyScatterLinesNoMarkers});
                    break;
                case "xy(scatter)Smooth":
                    name === "xyScatterChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.xyScatterSmooth, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.xyScatterSmooth});
                    break;
                case "xy(scatter)SmoothNoMarkers":
                    name === "xyScatterChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.xyScatterSmoothNoMarkers, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.xyScatterSmoothNoMarkers});
                    break;
                case "bubble":
                    name === "xyScatterChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.bubble, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.bubble});
                    break;
            }
            $(document.body).find("ul.dropdown-menu" + "." + name).hide();
            var $target = $(data.element);
            $target.parents('div.open').data({ keepopen: false });
            onCellSelected();
            break;
        case "areaChart":
        case "areaChartTypeChanged":
            title = title.split(' ');
            title[0] = title[0].toLocaleLowerCase();
            title = title.join('');
            switch (title) {
                case "area":
                    name === "areaChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.area, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.area});
                    break;
                case "stackedArea":
                    name === "areaChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.areaStacked, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.areaStacked});
                    break;
                case "100%stackedArea":
                    name === "areaChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.areaStacked100, dataRange: spread.getActiveSheet().getSelections()[0]})
                    :
                    Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.areaStacked100});
                    break;
            }
            $(document.body).find("ul.dropdown-menu" + "." + name).hide();
            var $target = $(data.element);
            $target.parents('div.open').data({ keepopen: false });
            onCellSelected();
            break;
        case "radarChart":
        case "radarChartTypeChanged":
            switch (value) {
                case "radar":
                    name === "radarChart" ?
                        Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.radar, dataRange: spread.getActiveSheet().getSelections()[0]})
                        : Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.radar});
                    break;
                case "radarFilled":
                    name === "radarChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.radarFilled, dataRange: spread.getActiveSheet().getSelections()[0]})
                    : Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.radarFilled});
                    break;
                case "radarMarkers":
                    name === "radarChart" ?
                    Actions.insertChart(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.radarMarkers, dataRange: spread.getActiveSheet().getSelections()[0]})
                    : Actions.changedChartType(spread, {chartType: GC.Spread.Sheets.Charts.ChartType.radarMarkers});
                    break;
            }
            $('div.open').removeClass('open')
            onCellSelected();
            break;
        // Formulas Tab
        case "autoSum":
            // SET works like dropdown' sum item
            processAutoSum(sheet, value === "SET" ? "sum" : value);
            break;

        case "insertFormula":
            displaySettingPane(title, $('#functionBuiilder'));
            break;

        case "calculateNow":
            sheet.recalcAll();
            break;

        // Sort & Filter
        case "sortAZ":
        case "sortZA":
            sortData(sheet, name === "sortAZ");
            break;

        case "filter":
            updateFilter(sheet);
            break;

        // Group
        case "group":
            addGroup(sheet);
            break;

        case "ungroup":
            removeGroup(sheet);
            break;

        case "showDetail":
            toggleGroupDetail(true);
            break;

        case "hideDetail":
            toggleGroupDetail(false);
            break;

        case "summaryBelow":
            sheet.rowOutlines.direction(value ? 1 /* Forward */ : 0 /* Backward */);
            break;

        case "summaryRight":
            sheet.columnOutlines.direction(value ? 1 /* Forward */ : 0 /* Backward */);
            break;

        case "circleInvalidData":
            spread.options.highlightInvalidData = value;
            break;

        case "selectValidator":
            displaySettingPane(title, $('#dataValidationSetting'));
            break;

        // Show / Hide Group (View Tab)
        case "showFormulaBar":
            $("#formulaBar")[value ? "show" : "hide"]();
            adjustSpreadSize();


            spread.resumePaint();


            break;


        case "showGridlines":
            sheet.options.gridline.showVerticalGridline = value;
            sheet.options.gridline.showHorizontalGridline = value;
            break;

        case "showHeadings":
            sheet.options.rowHeaderVisible = value;
            sheet.options.colHeaderVisible = value;
            break;

        case "showSheetTabs":
            spread.options.tabStripVisible = value;
            break;

        // Freeze Panes Group (View Tab)
        case "freezePanes":
            processFreezePane(sheet, value);
            break;

        // Table Tab
        case "tableOption":
            setTableOption(value, data.checked);
            break;

        case "tableStyles":
            setTableStyle(_activeTable, settingCache.tableStyles);
            break;

        case "shape":
            createShape(data);
            break;
        case "shapeLineStyle":
            updateShapeLineStyle(value);
            break;
        case "shapeGroup":
            setShapeGroup();
            break;
        case "shapeColorPreset":
            applyPresetShapeColor(value);
            break;
        default:
            console.log("ribbon-click", name, value);
            break;
    }
    spread.resumePaint();
    spread.focus();
}

function applyPresetShapeColor(value) {
    var shapes = [],
        connectors = [];
    function splitShapesByType(_shapes) {
        _shapes.forEach(function(_shape) {

            var shapeType = ShapeHelper.getShapeType(_shape);
            switch(ShapeHelper.getShapeType(_shape)) {
                case "shape": shapes.push(_shape); break;
                case "connector": connectors.push(_shape);break;
                case "shapeGroup": splitShapesByType(_shape.all()); break;
            }
        })
    }
    splitShapesByType(ShapeHelper.getSelectedShapes(spread.getActiveSheet()));
    setShapeColor(shapes, value, 'shapeFillColor');
    setShapeColor(connectors, value, 'shapeOutlineColor');
}

function setShapeGroup() {
    var sheet = spread.getActiveSheet();

    var shapes = ShapeHelper.getSelectedShapes(sheet);
    if(shapes.length === 1 && ShapeHelper.getShapeType(shapes[0]) === 'shapeGroup') {
        var childrens = shapes[0].all();
        sheet.shapes.ungroup(shapes[0]);
        childrens.forEach(function(children) {
            children.isSelected(true);
        });
    } else if (shapes.length > 1) {
        var groupShape = sheet.shapes.group(shapes);
        groupShape.isSelected(true);
    }
}

function updateShapeLineStyle(lineStyle) {
    function _applyShapeLineStyle(_shapes) {
        _shapes.forEach(function(_shape) {
            var shapeType = ShapeHelper.getShapeType(_shape);
            if(shapeType === 'shapeGroup'){
                _applyShapeLineStyle(_shape.all());
            } else {
                var style = _shape.style();
                style.line.lineStyle = spreadNS.Shapes.PresetLineDashStyle[lineStyle]
                _shape.style(style);
            }
        });
    }

    var shapes = ShapeHelper.getSelectedShapes(spread.getActiveSheet());
    _applyShapeLineStyle(shapes)
}

function createNormalShape(sheet, data, left, top, shapeSize, newShapeName) {
    var shapeWidth = shapeSize;
    var shapeHeight = shapeSize;
    var shapeType = data.value;
    var longShapes = ['leftRightArrow', 'leftRightArrowCallout'];
    var heightShapes = ['upDownArrow', 'upDownArrowCallout'];
    if(longShapes.indexOf(shapeType) >= 0) {
        shapeWidth = 180;
    }
    if(heightShapes.indexOf(shapeType) >= 0) {
        shapeHeight = 180;
    }
    var shapeType = GC.Spread.Sheets.Shapes.AutoShapeType[shapeType];

    var shape = sheet.shapes.add(newShapeName, shapeType, left, top, shapeWidth, shapeHeight);

    return shape;
}

function createConnectorShape(sheet, data, beginX, endY, shapeSize, newShapeName) {
    var connectorValue = data.value.toLowerCase();
    var shapeType = 'straight';
    if(connectorValue.indexOf('elbow')>=0) {
        shapeType = 'elbow';
    }
    connectorShapeType = GC.Spread.Sheets.Shapes.ConnectorType[shapeType];

    var connectorShape = sheet.shapes.addConnector(newShapeName, connectorShapeType, beginX, endY - shapeSize, beginX + shapeSize, endY);

    var style = connectorShape.style();
    var arrowheadStyle = GC.Spread.Sheets.Shapes.ArrowheadStyle.triangle;
    if(connectorValue.indexOf('begin') >= 0) {
        style.line.beginArrowheadStyle = arrowheadStyle;
    }
    if(connectorValue.indexOf('end') >= 0) {
        style.line.endArrowheadStyle = arrowheadStyle;
    }
    connectorShape.style(style);
    return connectorShape;
}

function createShape(data) {
    var sheet = spread.getActiveSheet();
    var $container = document.getElementById("ss");
    var containerWidth = $container.offsetWidth,
        containerHeight = $container.offsetHeight;

    var currentShapes = sheet.shapes.all();

    var shapeSize = 120,
        left = (containerWidth-  shapeSize)/4,
        top = (containerHeight - shapeSize)/4,
        targetFunction = createNormalShape;

    if(data.group === 'connector') {
        targetFunction = createConnectorShape;
    }
    var newShapeName = data.name + "-" + data.value + currentShapes.length;
    var shape = targetFunction(sheet, data, left, top, shapeSize, newShapeName);
    currentShapes.forEach(function(_shape){
        _shape.isSelected(false);
    });
    shape.isSelected(true);
}

function processFreezePane(sheet, typeName) {
    var freezeOptionMap = {
        row: "frozenRowCount",
        col: "frozenColumnCount",
        trailingRow: "frozenTrailingRowCount",
        trailingCol: "frozenTrailingColumnCount"
    };

    function freeze(sheet, options) {
        for (var propertyName in options) {
            var value = +options[propertyName];
            if (!isNaN(value)) {
                sheet[freezeOptionMap[propertyName]](value);
            }
        }
    }

    var options;
    switch (typeName) {
        case "freezePanes":
            options = {row: sheet.getActiveRowIndex(), col: sheet.getActiveColumnIndex()};
            break;

        case "freezeTopRow":
            options = {row: 1, col: 0, trailingRow: 0, trailingCol: 0};
            break;

        case "freezeFirstColumn":
            options = {row: 0, col: 1, trailingRow: 0, trailingCol: 0};
            break;

        case "freezeBottomRow":
            options = {row: 0, col: 0, trailingRow: 1, trailingCol: 0};
            break;

        case "freezeLastColumn":
            options = {row: 0, col: 0, trailingRow: 0, trailingCol: 1};
            break;

        case "unfreeze":
            options = {row: 0, col: 0, trailingRow: 0, trailingCol: 0};
            break;

        default:
            return;
    }

    if (options) {
        freeze(sheet, options);
    }
}

function setTableOption(name, value) {
    switch (name) {
        case "tableFilterButton":
            Actions.setTableFilterButton(spread, value)
            break;

        case "tableHeaderRow":
            Actions.setTableHeaderRow(spread, value);
            break;

        case "tableTotalRow":
            Actions.setTableTotalRow(spread, value);
            break;

        case "tableBandedRows":
            Actions.setTableBandedRows(spread, value);
            break;

        case "tableBandedColumns":
            Actions.setTableBandedColumns(spread, value)
            break;

        case "tableFirstColumn":
            Actions.setTableFirstColumn(spread, value)
            break;

        case "tableLastColumn":
            Actions.setTableLastColumn(spread, value)
            break;
    }
}

function setCellsBorder(borderType) {
    var res = selectionBorderType(borderType,
        $('#borderSetting .border-line-color .color-picker').css('background-color'),
        getBorderLineType('line-style-' + $('#borderSetting .border-line-style li.selected').data('value'))
    );
    Actions.setBorder(spread, res[0]);
}

function selectionBorderType(borderType, color, lineStyle) {
    var lineBorder = new GC.Spread.Sheets.LineBorder(color, lineStyle);
    var result = [];
    switch (borderType) {
        case 'inside':
            result.push({lineborder: lineBorder, options: {innerHorizontal: true, innerVertical: true}});
            break;
        case 'innerVertical':
            result.push({lineborder: lineBorder, options: {innerVertical: true}});
            break;
        case 'innerHorizontal':
            result.push({lineborder: lineBorder, options: {innerHorizontal: true}});
            break;
        case 'bottom':
            result.push({lineborder: lineBorder, options: {bottom: true}});
            break;
        case 'top':
            result.push({lineborder: lineBorder, options: {top: true}});
            break;
        case 'left':
            result.push({lineborder: lineBorder, options: {left: true}});
            break;
        case 'right':
            result.push({lineborder: lineBorder, options: {right: true}});
            break;
        case 'all':
            result.push({lineborder: lineBorder, options: {all: true}});
            break;
        case 'none':
            result.push({
                lineborder: new GC.Spread.Sheets.LineBorder(color, GC.Spread.Sheets.LineStyle.empty),
                options: {all: true}
            });
            break;
        case 'outside':
            result.push({lineborder: lineBorder, options: {outline: true}});
            break;
        case 'thick':
            result.push({
                lineborder: new GC.Spread.Sheets.LineBorder(color, GC.Spread.Sheets.LineStyle.thick),
                options: {outline: true}
            });
            break;
        case "doublebottom":
            result.push({
                lineborder: new GC.Spread.Sheets.LineBorder(color, GC.Spread.Sheets.LineStyle.double),
                options: {bottom: true}
            });
            break;
        case "thickbottom":
            result.push({
                lineborder: new GC.Spread.Sheets.LineBorder(color, GC.Spread.Sheets.LineStyle.thick),
                options: {bottom: true}
            });
            break;
        case "top-bottom":
            result.push({
                lineborder: new GC.Spread.Sheets.LineBorder(color, GC.Spread.Sheets.LineStyle.thin),
                options: {bottom: true, top: true}
            });
            break;
        case "top-thickbottom":
            result.push({
                lineborder: new GC.Spread.Sheets.LineBorder(color, GC.Spread.Sheets.LineStyle.thin),
                options: {top: true}
            });
            result.push({
                lineborder: new GC.Spread.Sheets.LineBorder(color, GC.Spread.Sheets.LineStyle.thick),
                options: {bottom: true}
            });
            break;
        case "top-doublebottom":
            result.push({
                lineborder: new GC.Spread.Sheets.LineBorder(color, GC.Spread.Sheets.LineStyle.thin),
                options: {top: true}
            });
            result.push({
                lineborder: new GC.Spread.Sheets.LineBorder(color, GC.Spread.Sheets.LineStyle.double),
                options: {bottom: true}
            });
            break;
        case "borderDiagonalUp":
            result.push({lineborder: lineBorder, options: {diagonalUp: true}});
            break;
        case "borderDiagonalDown":
            result.push({lineborder: lineBorder, options: {diagonalDown: true}});
            break;
    }
    return result;
}

function processInsertDeleteCells(name) {
    switch (name) {
        case "insertRows":
            Actions.insertRows(spread);
            break;

        case "insertColumns":
            Actions.insertColumns(spread);
            break;

        case "insert-shiftCellsRight":
            Actions.insertRightCells(spread);
            break;

        case "insert-shiftCellsDown":
            Actions.insertDownCells(spread);
            break;

        case "deleteRows":
            Actions.deleteRows(spread);
            break;

        case "deleteColumns":
            Actions.deleteColumns(spread);
            break;

        case "delete-shiftCellsLeft":
            Actions.deleteLeftCells(spread);
            break;

        case "delete-shiftCellsUp":
            Actions.deleteUpCells(spread);
            break;
    }
}

function processClearCells(name) {
    switch (name) {
        case "clearAll":
            Actions.clearAll(spread);
            break;

        case "clearFormatting":
            Actions.clearFormat(spread);
            break;

        case "clear":
            Actions.clearContent(spread);
            break;
    }
}


function getCellFormatter() {
    var sheet = spread.getActiveSheet();
    var style = sheet.getActualStyle(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex());

    return style && style.formatter || 'nullValue';
}


function processAutoSum(sheet, funcName) {
    /*jshint eqnull:true */

    var ResultPosition = {Bottom: 1, Right: 2};

    // check range to decide where to add:
    //      position:   bottom (1), right (2) or both (3)
    //      rowOffset:  -1 if last row is empty, otherwise 0
    //      colOffset:  -1 if last column is empty, otherwise 0
    function getFormulaPosition(range) {
        var r, c, result = {rowOffset: 0, colOffset: 0}, position = 0,
            rowCount = range.rowCount, colCount = range.colCount,
            startRow = range.row, startCol = range.col,
            endRow = startRow + rowCount - 1, endCol = startCol + colCount - 1;

        if (rowCount === 1 || colCount === 1) {
            position = (rowCount > 1) ? ResultPosition.Bottom : ((colCount > 1) ? ResultPosition.Right : 0);
        }
        // check last row for empty cells
        var hasValue = false;
        if (rowCount > 1) {
            for (c = startCol; c <= endCol; c++) {
                if ((sheet.getValue(endRow, c) != null)) {
                    hasValue = true;
                    break;
                }
            }
            if (!hasValue) {
                position |= ResultPosition.Bottom;
                result.rowOffset = -1;
            }
        }

        if (colCount > 1) {
            hasValue = false;
            // check last col for empty cells
            for (r = startRow; r <= endRow; r++) {
                if ((sheet.getValue(r, endCol) != null)) {
                    hasValue = true;
                    break;
                }
            }
            if (!hasValue) {
                position |= ResultPosition.Right;
                result.colOffset = -1;
            }
        }

        // both the last row / column of range is not empty, return bottom
        if (!position) {
            position = ResultPosition.Bottom;
        }

        result.position = position;

        return result;
    }

    function getFormulaTemplateForRow(range) {
        // TODO: process w/ A1 & R1C1 style
        // funcName(@1:@2)
        var row = range.row;
        return [funcName.toUpperCase(), "(@", row + 1, ":@", row + range.rowCount, ")"].join("");
    }

    function getFormulaTemplateForColumn(range) {
        // TODO: process w/ A1 & R1C1 style
        // funcName(1@:2@)
        var col = range.col;
        return [funcName.toUpperCase(), "(", getColumnName(col + 1), "@:", getColumnName(col + range.colCount), "@)"].join("");
    }

    function setFormulas(range, value, isRow) {
        var i, r, c, count, row, col, template;

        if (isRow) {
            count = sel.colCount;
            r = value;
            col = sel.col;
            template = getFormulaTemplateForRow(sel);
            for (i = 0; i < count; i++) {
                c = col + i;
                // TODO: skip empty column
                sheet.setFormula(r, c, template.replace(/@/g, getColumnName(c + 1)));
            }
        } else {
            count = sel.rowCount;
            c = value;
            row = sel.row;
            template = getFormulaTemplateForColumn(sel);
            for (i = 0; i < count; i++) {
                r = row + i;
                // TODO: skip empty row
                sheet.setFormula(r, c, template.replace(/@/g, r + 1));
            }
        }
    }

    var sels = sheet.getSelections();
    var rowCount = sheet.getRowCount(),
        columnCount = sheet.getColumnCount();

    sheet.suspendPaint();
    for (var n = 0; n < sels.length; n++) {
        var sel = getActualCellRange(sels[n], rowCount, columnCount),
            formulaPosition = getFormulaPosition(sel), resultPosition = formulaPosition.position,
            targetRow, targetCol;

        if (resultPosition) {
            if (resultPosition & ResultPosition.Bottom) {
                targetRow = sel.row + sel.rowCount + formulaPosition.rowOffset;
                // TODO: skip row with value
                setFormulas(sel, targetRow, true);
            }
            if (resultPosition & ResultPosition.Right) {
                targetCol = sel.col + sel.colCount + formulaPosition.colOffset;
                // TODO: skip col with value
                setFormulas(sel, targetCol, false);
            }
        }
    }
    sheet.resumePaint();
}

function processRibbonDropDown(e, data) {
    function selectCellFormatDropDownItem(dropdown) {
        var $ul = $('ul.dropdown-menu', dropdown);

        if ($ul.length > 0) {
            $('li.selected', $ul).removeClass('selected');
            var formatter = getCellFormatter();
            $('li', $ul)
                .filter(function () {
                    return $(this).data('value') == Ribbon.getDataAttributeString(formatter);
                })
                .addClass('selected');
        }
    }

    // function insertTableSlicer(tableName, columnNames) {
    //     function getAutoSlicerName() {
    //         return "slicer" + Date.now();
    //     }
    //
    //     spread.suspendPaint();
    //     var sheet = spread.getActiveSheet();
    //     var posX = 100, posY = 200;
    //     var slicer;
    //     columnNames.forEach(function(columnName) {
    //         // var slicerName = getAutoSlicerName();
    //         // slicer = sheet.slicers.add(slicerName, tableName, columnName);
    //         // slicer.position(new GC.Spread.Sheets.Point(posX, posY));
    //         // posX += 30;
    //         // posY += 30;
    //         var slicerName = getAutoSlicerName();
    //         slicer = sheet.slicers.add(slicerName, tableName, columnName);
    //         slicer.position(new GC.Spread.Sheets.Point(posX, posY));
    //         posX = posX + 30;
    //         posY = posY + 30;
    //
    //     });
    //     spread.resumePaint();
    //     if (slicer) {
    //         slicer.isSelected(true);
    //     }
    // }


    function insertTableSlicer(tableName, columnNames) {
        function getAutoSlicerName() {
            return "slicer" + Date.now() + Math.random().toString(36).substr(3,10);
        }

        spread.suspendPaint();
        var sheet = spread.getActiveSheet();
        var posX = 100, posY = 200;
        for (var i = 0; i < columnNames.length; i++) {
            var slicerName = getAutoSlicerName();
            var slicer = sheet.slicers.add(slicerName, tableName, columnNames[i]);
            slicer.position(new GC.Spread.Sheets.Point(posX, posY));
            posX = posX + 30;
            posY = posY + 30;
        }
        spread.resumePaint();
        if (slicer) {
            slicer.isSelected(true);
        }
    }


    function fillInsertSlicerDropdownList($ul) {
        function processDropdownButtonClick(element) {
            var $this = $(element), tableName = _activeTable.name();

            if ($this.data("name") === "insert-slicer") {
                var columnNames = [];
                $this.closest('ul.dropdown-menu')
                    .find('li.item input:checked')
                    .each(function () {
                        columnNames.push($(this).data("name") + '');
                    });

                insertTableSlicer(tableName, columnNames);
            }
        }

        if (_activeTable && $ul.length) {
            // remove old items
            $("li.item", $ul).remove();

            // prepare submit buttons & bind event
            if ($ul.children().length === 0) {
                $(document).on('click', '.btn-dropdown', function () {
                    processDropdownButtonClick(this);
                });
                $ul.append($('<li class="divider"></li>'));
                $ul.append($('<li><div class="text-right"><button data-name="insert-slicer" class="btn btn-default btn-dropdown">OK</button><button class="btn btn-default btn-dropdown">Cancel</button></div></li>'));
            }
            // add new items
            var table = _activeTable, items = [];
            for (var i = 0, count = table.range().colCount; i < count; i++) {
                var name = table.getColumnName(i);
                items.push($('<li class="item"' +
                    '><label class="checkbox-inline"> <input type="checkbox" data-name="' + name + '"><span>' +
                    name + '</span></label></li>'));
            }
            $ul.prepend(items);
        }
    }

    var name = data.name, open = data.open;
    var sheet = spread.getActiveSheet();

    switch (name) {
        case 'cellformat':
            if (open && data.dropdown) {
                selectCellFormatDropDownItem(data.dropdown);
            }
            break;

        case 'cellsgroup':
            var selectionType = getSelectionType(spread.getActiveSheet().getSelections());

            switch (selectionType) {
                case SelectionRangeType.Mixture:
                    alert('Mixed selection not supported!');

                    if (open && data.dropdown && data.originalEvent) {
                        //$(data.dropdown).removeClass('open');
                        data.originalEvent.preventDefault();
                        data.originalEvent.stopPropagation();
                    }
                    break;

                // TODO: disable items (add 'disabled' class to li) base on selectiontype

                default:
                    var found;
                    for (var key in SelectionRangeType) {
                        if (SelectionRangeType[key] === selectionType) {
                            found = key;
                            break;
                        }
                    }
                    //console.log('others', found || selectionType);
                    break;
            }
            break;

        case 'tableStyles':
            if (open) {
                var left = $("#inner-content-container").width() - ($tableStyleDropdown.parent().offset().left + $tableStyleDropdown.width()) - 10;

                // adjust drop down position to avoid out of view
                $tableStyleDropdown.css({left: left < 0 ? left : 0});
            }
            break;

        case 'insertSlicer':
            if (open) {
                // fill sclier
                fillInsertSlicerDropdownList($("ul.dropdown-menu", data.dropdown));
            }
            break;
        case 'typeChart':
            var chart = ChartHelper.getSelectedChart(spread.getActiveSheet());
            var chartType = ChartHelper.getChartTypeString(chart.chartType());
            var elements = $('ul.typeChart', $(data.dropdown)).children('li');
            for(var i = 0; i < elements.length; i++) {
                var $element = $($(elements[i]).children()[0]);
                if($element.hasClass('toggle on')) {
                    $element.removeClass('toggle on');
                    var elements1 = $($(elements[i]).children()[1]).children();
                    for(var j = 0; j < elements1.length; j++) {
                        var $element1 = $($(elements1[j]).children()[0]);
                        if($element1.hasClass('toggle on')) {
                            $element1.removeClass('toggle on');
                        }
                    }
                }
            }
            var $element = $($("[data-value='" + chartType + "']", $(data.dropdown)).parent()[0].previousElementSibling);
            $element.addClass('toggle on');
            $element = $("[data-value='" + chartType + "']", $(data.dropdown)).children();
            $element.addClass('toggle on');
            break;
        case 'addChartElement':
            var sheet = spread.getActiveSheet();
            if (open) {
                data.addChartElement._beforeShow(sheet);
            } else {
                data.addChartElement._beforeHide(sheet);
            }
            break;
        case 'chartQuickLayout':
            var selectedChartType;
            var selectedChart = ChartHelper.getSelectedChart(sheet);
            if (ChartHelper.getChartGroupString(selectedChart.chartType()) === ChartHelper.chartTypeDict["50"].chartGroup) {
                selectedChartType = ChartHelper.chartTypeDict["50"].chartGroup;
            } else if (selectedChart.series().get(0)) {
                selectedChartType = ChartHelper.getChartGroupString(selectedChart.series().get(0).chartType);
            }
            if (open) {
                data.chartLayoutPicker._setOption(selectedChartType);
            }
            break;
    }
}

function processRibbonDropDownShown(e, data) {
    var name = data.name;

    switch (name) {
        case 'tableStyles':
            // make selected items visible by scroll
            $("#tableStyles .table-format-item-selected")[0].scrollIntoView();
            break;
    }
}

function processTextChanged(e, data) {
    var name = data.name, value = data.value, $element = data.$element;
    var sheet = spread.getActiveSheet();

    switch (name) {
        case "tableName":
            if (value && _activeTable && value !== _activeTable.name()) {
                if (!sheet.tables.findByName(value)) {
                    _activeTable.name(value);
                } else {
                    alert(getResource("messages.duplicatedTableName"));
                    $element.val(_activeTable.name());
                }
            }
            break;

        default:
            console.log("processTextChanged not process with ", name, value);
            break;
    }
}
// ribbon related items (end)

// setting pane related items
function displaySettingPane(title, $element, showCallback) {
    var $active = $("#setting-pane .pane-content > div:not(.hidden)");

    // same content do not need switch seeting pane
    if ($active[0] !== $element[0]) {
        $("#setting-pane .pane-title").text(title);
        $active.addClass("hidden");
        $element.removeClass("hidden");
    } else {
        // always update title since one setting content may have multi sub type such as celltype
        $("#setting-pane .pane-title").text(title);
    }

    if (showCallback) {
        showCallback();
    }

    showSettingPane();
}

function showSettingPane() {
    $("#setting-pane").show();
}

function hideSettingPane() {
    colorPicker.hide();
    $("#setting-pane").hide();
}

function attachSettingPaneEvents() {
    // checkbox
    $(".setting-container input[type='checkbox']")
        .click(checkedChanged);

    $(".setting-container input[type='radio']")
        .click(radioButtonClicked);

    // number input
    $(".setting-container input[type='number']")
        .blur(updateNumberProperty);

    // text input
    $(".setting-container input[type='text']")
        .blur(updateStringProperty);

    $("#setting-pane button.close").on('click', function () {
        hideSettingPane();
    });
    var self = this;
    $("#highlighticon").on('change', function () {
        var file = this.files[0];
        var reader = new FileReader();
        if(file){
            reader.readAsDataURL(file);
            reader.onloadend = function (e) {
                self.imageBase64 = this.result;
            };
        }
    });

    $(document).on('click', "#setting-pane button.dropdown-toggle", function () {
        colorPicker.hide();
    });

    // dropdown
    $(document).on('click', ".pane-row .dropdown-menu>li>a", function () {
        var $this = $(this), $group = $this.closest('.btn-group');

        var name = $group.data("name"),
            $text = $(this),
            dataValue = $text.data("value"),    // data-value includes both number value and string value, should pay attention when use it
            numberValue = +dataValue,
            text = $text.text(),
            value = text,
            nameValue = dataValue === 0 ? dataValue : ( dataValue || text );

        var $li = $this.parent(), $ul = $li.parent();

        // change undefined to null for value to be replaced, otherwise old value will be kept without change!!!
        $group.data({value: dataValue || null, index: $(">li", $ul).index($li), $element: $this});
        $('span.content', $group).text(text);

        $('li', $ul).removeClass('selected');
        $li.addClass('selected');

        switch(name){
            case "qrCodeModel":
                if(dataValue === 1){
                    $("#qrCodeSetting ul.dropdown-menu .no-common").hide();
                }else{
                    $("#qrCodeSetting ul.dropdown-menu .no-common").show();
                }
                break;
            default:
                break;
        }

        processDropDownClicked(name, numberValue, value, nameValue, $this, $group);
    });

    // comment decoration buttons
    $("#setting-pane button.btn-comment-decoration").on('click', function () {
        var $element = $(this);

        $element.toggleClass('toggle on');

        _activeComment.textDecoration(value);
    });

    $("#setSparklineButton").on('click', addSparklineEvent);
    $("#setBarCodeButton").on('click', addBarCodeEvent);
    $("#setCustomFormat").on('click', setCustomFormat);

    var category = $("#fill-custom-lists");
    var viewTxt = $("#fill-custom-list-view");
    var addBtn = $("#fill-custom-list-add");
    var delBtn = $("#fill-custom-list-delete");
    delBtn.attr("disabled", true);

    category.on('change', function (evt) {
        var srcElement = evt.target || evt.srcElement;
        var index = parseInt(srcElement.value);
        var str = "", list = [];
        spread._selectCustomListIndex = index;
        if (index < 0) {
            list = spread._fillBuildinList[-1-index];
            viewTxt.attr("disabled", true);
            addBtn.attr("disabled",true);
            delBtn.attr("disabled",true);
        } else if (index === 0) {
            viewTxt.attr("disabled", false);
            addBtn.attr("disabled",false);
            delBtn.attr("disabled",true);
        } else {
            list = spread._fillCustomList[index-1];
            viewTxt.attr("disabled", false);
            addBtn.attr("disabled",false);
            delBtn.attr("disabled",false);
        }
        str = list && list[0];
        for (i = 1; i < list.length; i++) {
            str += "\r\n" + list[i];
        }
        viewTxt.val(str);
    });

    addBtn.on('click', function () {
        var v = viewTxt.val();
        var arr = v.split("\n");
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === "") {
                arr.splice(i, 1);
                i--;
            }
        }
        var str = arr.toString();
        if (str === ""){
            return;
        }
        for (var i = 0; i < spread._fillBuildinList.length; i++) {
            if(str === spread._fillBuildinList[i].toString()){ //check the list wether have same list
                return;
            }
        }
        for (var i = 0; i < spread._fillCustomList.length; i++) {
            if(str === spread._fillCustomList[i].toString()){
                return;
            }
        }

        var index = spread._selectCustomListIndex;
        if(index === 0){
            spread._fillCustomList.push(arr);
            spread.options.customList = spread._fillCustomList;
        } else if (index > 0) {
            spread._fillCustomList[index - 1] = arr;
            spread.options.customList = spread._fillCustomList;
        }

        syncDragFillCustomList();
    });

    delBtn.on('click', function () {
        if(spread._selectCustomListIndex > 0){
            var index = spread._selectCustomListIndex;
            if (index > 0) {
                spread._fillCustomList.splice(index - 1, 1);
                spread.options.customList = spread._fillCustomList;
            }
            syncDragFillCustomList();
        }
    });
}

function setDropDown(name, value) {
    var $container = $(".setting-container div[data-name='" + name + "']"),
        $items = $("ul>li>a", $container),
        $item = $items.filter(function () {
            // use == since string and number should be considered
            return $(this).data("value") == value || $(this).text() == value;
        });

    var text = $item.text() || value;

    $("span.content", $container).text(text);
    $container.data('value', value);

    $('li.selected', $container).removeClass('selected');
    if ($item.length > 0) {
        $($item[0]).parent().addClass('selected');
    }
}

function prepareFunctionBuilder($container) {
    function filterFunctions($ul, s) {
        // restore all
        $ul.children().removeClass("hidden");
        // do filter when filter string provided
        if (s) {
            // to upper for match with function name
            s = s.toUpperCase();
            // filter functions by name, hide not matched items
            $("li.function-item", $ul).filter(function () {
                var funcName = $(this).text();
                return !funcName.startsWith(s);  // or don't use startsWith:  funcName.indexOf(s) != 0;
            }).addClass("hidden");

            // hide category without visible funtion items
            $("li.function-category", $ul).filter(function () {
                var name = $(this).data("name");
                return $("li.function-item[data-category='" + name + "']:visible", $ul).length === 0;
            }).addClass("hidden");
        }
    }

    function showFunctionDesctiption(name) {
        var fun = GC.Spread.CalcEngine.Functions.findGlobalFunction(name);
        if (fun) {
            var params = fun.description().parameters.map(function (item) { return item.name }).join(',');
            var description = fun.description().description;
            var html = "<div class='function-description-container'><strong>" + [name, "(", params, ")"].join("") + "</strong></div> " + description;

            $("#functionBuiilder .function-description").html(html);
        }
    }

    function startEditWithFormula(sheet, rowIndex, colIndex, formula) {
        var oldGetFormulaInfoFun = sheet.getFormulaInformation;
        sheet.getFormulaInformation = function (row, col) {
            return {hasFormula: true};
        };
        sheet.startEdit(false, formula);
        sheet.getFormulaInformation = oldGetFormulaInfoFun;
        var editor = sheet.getCellType(rowIndex, colIndex).getEditingElement();
        editor.selectionStart = formula.length - 1;
        editor.selectionEnd = formula.length - 1;
    }

    function insertFormulaForEdit(funcName) {
        var sheet = spread.getActiveSheet();
        var activeRowIndex = sheet.getActiveRowIndex();
        var activeColumnIndex = sheet.getActiveColumnIndex();

        startEditWithFormula(sheet, activeRowIndex, activeColumnIndex, "=" + funcName + "()");
    }

    function getFunctionItem(funcName, index, array) {
        var $li = $("<li class='function-item'></li>");
        $li.attr('data-category', array.name);
        $li.text(funcName);

        return $li;
    }

    $ul = $(".function-list", $container);
    var categories = uiResource.functions.categories;

    for (var name in categories) {
        var cat = categories[name], text = cat.text, items = cat.items;
        var $li = $("<li class='function-category'></li>");
        $li.attr('data-name', name);
        $li.text(text);
        $ul.append($li);
        items.name = name;  // used to provide addtional information for array operator later
        $ul.append(items.map(getFunctionItem));
    }

    $("li.function-item", $ul).click(function () {
        var name = $(this).text();
        $('li.selected', $ul).removeClass("selected");
        $(this).addClass("selected");
        showFunctionDesctiption(name);
    });

    $("li.function-item", $ul).dblclick(function () {
        var name = $(this).text();

        insertFormulaForEdit(name);
    });

    $("input", $container)
        .attr("placeholder", uiResource.functions.setting.filterPlaceHolder)
        .keyup(function () {
            filterFunctions($ul, $(this).val());
        });
}

var _commonFormatters = [], _customFormatInput;
function prepareCellFormatSetting($container) {
    var $ul = $('div[data-name=commonFormat] ul.dropdown-menu', $container),
        $items = $("#home div[data-name=cellformat] ul.dropdown-menu>li");

    // copy dropdown builtin items
    var skip = false;
    $items.each(function () {
        if (skip) return;

        var $src = $(this),
            value = $src.attr("data-value"),
            text = $('button>label', $src).text();

        if (!value) {
            skip = true;
            return;
        }
        _commonFormatters.push(value);
        var $li = $("<li><a></a></li>"),
            $a = $("a", $li);
        $a.attr("data-value", value).text(text);

        $ul.append($li);
    });
    // add custom
    $ul.append($('<li><a data-value="custom">' + uiResource.cellTab.format.custom + '</a></li>'));
    $('li:first', $ul).addClass('default');

    _customFormatInput = $("#cellFormatSetting input[data-name=customFormat]");
}

function syncCellFormat() {
    var formatter = getCellFormatter(), value = Ribbon.getDataAttributeString(formatter);

    if (formatter === "nullValue") {
        formatter = "";
    } else {
        if (_commonFormatters.indexOf(value) === -1) {
            value = 'custom';
        }
    }
    setDropDown('commonFormat', value);
    _customFormatInput.val(formatter);
}

function setCustomFormat() {
    var format = $('#cellFormatSetting input[data-name=customFormat]').val();

    Actions.setFormatter(spread, format || null);    // map empty string to null (General)
}

// find related items
var findCache;

function attachFindEvents() {
    var SearchFlags = spreadNS.Search.SearchFlags;
    var SearchOrder = spreadNS.Search.SearchOrder;
    var SearchFoundFlags = spreadNS.Search.SearchFoundFlags;
    var SearchCondition = spreadNS.Search.SearchCondition;
    var VerticalPosition = spreadNS.Search.VerticalPosition;
    var HorizontalPosition = spreadNS.Search.HorizontalPosition;

    function getSearchInformation() {
        var searchString = getTextValue("findwhat");
        if (searchString === "")
            return null;

        var withinWorksheet = $findin.first().is(":checked");
        var searchOrder = $searchby.first().is(":checked") ? SearchOrder.zOrder : SearchOrder.nOrder;
        var searchFoundFlags;
        var searchFlags = 0;

        if (!getCheckValue("findMatchCase")) {
            searchFlags |= SearchFlags.ignoreCase;
        }
        if (getCheckValue("findMatchExactly")) {
            searchFlags |= SearchFlags.exactMatch;
        }
        if (getCheckValue("findUseWildcards")) {
            searchFlags |= SearchFlags.useWildCards;
        }

        if ($lookin.first().is(":checked")) {
            searchFoundFlags = SearchFoundFlags.cellText;
        }
        else {
            searchFoundFlags = SearchFoundFlags.cellFormula;
            searchString = searchString.charAt(0) === "=" ? searchString.substr(1, searchString.length) : searchString;
        }

        return {
            WithinWorksheet: withinWorksheet,
            SearchString: searchString,
            SearchFlags: searchFlags,
            SearchOrder: searchOrder,
            SearchFoundFlags: searchFoundFlags
        };
    }

    function unparse(source, expr, row, col) {
        // return spread.calcService.unparse(source, expr, row, col);
        var sheet = spread.getActiveSheet();
        var calcService = sheet.getCalcService();
        return calcService.unparse(source, expr, row, col);
    }

    // modify specified SearchCondition for next search instead of recreate and reduce duplicted code
    // Modify as:
    //      1. reset findBegin* as the default value for new instance of SearchCondition;
    //      2. Use options to provide key-value pair for need updated items
    function modifySearchCondition(searchCondition, options) {
        if (searchCondition) {
            // reset findBegin*
            searchCondition.findBeginColumn = -1;
            searchCondition.findBeginRow = -1;
            // modify use options provided key-value pair when provided
            if (options) {
                for (var key in options) {
                    searchCondition[key] = options[key];
                }
            }
        }
    }

    function doFindAll(searchInformation) {
        function findAllInSheet(searchInformation, sheet) {
            var result = [];

            var startRow = 0, startColumn = 0,
                rowCount = sheet.getRowCount(), columnCount = sheet.getColumnCount(),
                endRow = rowCount - 1, endColumn = columnCount - 1;

            var searchCondition = new SearchCondition();

            searchCondition.searchString = searchInformation.SearchString;
            searchCondition.searchFlags = searchInformation.SearchFlags;
            searchCondition.searchOrder = searchInformation.SearchOrder;
            searchCondition.searchTarget = searchInformation.SearchFoundFlags;
            searchCondition.sheetArea = spreadNS.SheetArea.viewport;
            searchCondition.rowStart = startRow;
            searchCondition.columnStart = startColumn;
            searchCondition.rowEnd = endRow;
            searchCondition.columnEnd = endColumn;

            var res = sheet.search(searchCondition);

            var findRow = res.foundRowIndex,
                findColumn = res.foundColumnIndex;

            while (findRow != -1 && findColumn != -1) {
                var cell = sheet.getCell(findRow, findColumn);
                var range = new spreadNS.Range(cell.row, cell.col, 1, 1);
                var cellName = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, 0);
                var item = {
                    sheetName: sheet.name(),
                    cellName: cellName,
                    value: cell.text(),
                    formula: cell.formula(),
                    cellData: cell
                };

                result.push(item);

                if (searchInformation.SearchOrder == SearchOrder.zOrder) {
                    startRow = findRow;
                    startColumn = findColumn + 1;
                    if (startColumn >= columnCount && startRow < rowCount) {
                        startRow = findRow + 1;
                        startColumn = 0;
                    }
                }
                else {
                    startRow = findRow + 1;
                    startColumn = findColumn;
                    if (startRow >= rowCount && startColumn < sheet.columnCount) {
                        startRow = 0;
                        startColumn = findColumn + 1;
                    }
                }

                modifySearchCondition(searchCondition, {rowStart: startRow, columnStart: startColumn});

                res = sheet.search(searchCondition);

                findRow = res.foundRowIndex;
                findColumn = res.foundColumnIndex;
            }
            return result;
        }

        function findAllInWorkbook(searchInformation, workbook) {
            var result = [];

            var startRow = 0,
                startColumn = 0,
                sheetCount = workbook.getSheetCount();

            var searchCondition = new SearchCondition();

            searchCondition.startSheetIndex = 0;
            searchCondition.endSheetIndex = sheetCount - 1;
            searchCondition.searchString = searchInformation.SearchString;
            searchCondition.searchFlags = searchInformation.SearchFlags;
            searchCondition.searchOrder = searchInformation.SearchOrder;
            searchCondition.searchTarget = searchInformation.SearchFoundFlags;
            searchCondition.sheetArea = spreadNS.SheetArea.viewport;

            var res = workbook.search(searchCondition);

            var findRow = res.foundRowIndex,
                findColumn = res.foundColumnIndex,
                findSheet = res.foundSheetIndex;

            while (findRow != -1 && findColumn != -1 ||
            (findSheet < sheetCount && findSheet != -1)) {
                modifySearchCondition(searchCondition);

                var sheet = workbook.sheets[findSheet];
                var rowCount = sheet.getRowCount(), columnCount = sheet.getColumnCount();

                if (findRow != -1 && findColumn != -1) {


                    var cell = sheet.getCell(findRow, findColumn);

                    var range = new spreadNS.Range(cell.row, cell.col, 1, 1);
                    var cellName = GC.Spread.Sheets.CalcEngine.rangeToFormula(range, 0, 0, 0);

                    var item = {
                        sheetName: sheet.name(),
                        cellName: cellName,
                        value: cell.text(),
                        formula: cell.formula(),
                        cellData: cell
                    };

                    result.push(item);

                    if (searchInformation.SearchOrder == SearchOrder.zOrder) {
                        startRow = findRow;
                        startColumn = findColumn + 1;
                        if (startColumn >= columnCount &&
                            startRow < sheet.rowCount) {
                            startRow = findRow + 1;
                            startColumn = 0;
                        }
                    }
                    else {
                        startRow = findRow + 1;
                        startColumn = findColumn;
                        if (startRow >= rowCount &&
                            startColumn < columnCount) {
                            startRow = 0;
                            startColumn = findColumn + 1;
                        }
                    }
                    searchCondition.rowStart = startRow;
                    searchCondition.columnStart = startColumn;
                }
                else {
                    searchCondition.rowStart = 0;
                    searchCondition.columnStart = 0;
                    searchCondition.rowEnd = rowCount - 1;
                    searchCondition.columnEnd = columnCount - 1;
                }
                searchCondition.startSheetIndex = findSheet;
                searchCondition.endSheetIndex = findSheet;
                res = workbook.search(searchCondition);

                findRow = res.foundRowIndex;
                findColumn = res.foundColumnIndex;
                if (res.foundSheetIndex != -1) {
                    findSheet = res.foundSheetIndex;
                }
                else {
                    findSheet++;
                }
            }
            return result;
        }

        if (searchInformation.WithinWorksheet) {
            return findAllInSheet(searchInformation, spread.getActiveSheet());
        } else {
            return findAllInWorkbook(searchInformation, spread);
        }
    }

    function fillFindResult(results) {
        $resultContainer.empty();
        results.forEach(function (item) {
            var formula = item.formula;
            // add prefix "=" for formula
            if (formula) {
                item.formula = "=" + formula;
            }
            $("<tr></tr>")
                .html(["sheetName", "cellName", "value", "formula"].map(function (name) {
                    return ["<td>", item[name], "</td>"].join("");
                }).join(""))
                .data("cell", item.cellData)
                .appendTo($resultContainer);
        });
        $resultCount.text(results.length + uiResource.find.result.countssuffix);
        if (results.length === 0) {
            // add an empty row to table when no matched items found
            $resultContainer.append($("<tr />"));
        }
        $('.findoutput', $container).show();
    }

    function findall() {
        var searchInformation = getSearchInformation();

        if (!searchInformation || !searchInformation.SearchString) {
            return;
        }

        var results = doFindAll(searchInformation);

        fillFindResult(results);
    }

    function doFindNext(searchInformation) {
        function getStartPosition(searchOrder, cellRange) {
            if (!cellRange) {
                return;
            }
            var row = cellRange.row, firstRow = row,
                col = cellRange.col, firstColumn = col,
                lastRow = row + cellRange.rowCount - 1;
            lastColummn = col + cellRange.colCount - 1;

            if (searchOrder == SearchOrder.zOrder) {
                if (findCache.activeCellColumnIndex == -1 && findCache.activeCellRowIndex == -1) {
                    findCache.rowStart = 0;
                    findCache.columnStart = 0;
                }
                else if (findCache.activeCellColumnIndex < lastColummn) {
                    findCache.rowStart = findCache.activeCellRowIndex;
                    findCache.columnStart = findCache.activeCellColumnIndex + 1;//to do
                }
                else if (findCache.activeCellColumnIndex == lastColummn) {
                    findCache.rowStart = findCache.activeCellRowIndex + 1;
                    findCache.columnStart = 0;
                }
                else {
                    findCache.rowStart = firstRow;
                    findCache.columnStart = firstColumn;
                }
            }
            else // by columns
            {
                if (findCache.activeCellColumnIndex == -1 && findCache.activeCellRowIndex == -1) {
                    findCache.rowStart = 0;
                    findCache.columnStart = 0;
                }
                else if (findCache.activeCellRowIndex < lastRow) {
                    findCache.rowStart = findCache.activeCellRowIndex + 1;
                    findCache.columnStart = findCache.activeCellColumnIndex;
                }
                else if (findCache.activeCellRowIndex == lastRow) {
                    findCache.rowStart = 0;
                    findCache.columnStart = findCache.activeCellColumnIndex + 1;
                }
                else {
                    findCache.rowStart = firstRow;
                    findCache.columnStart = firstColumn;
                }
            }
        }

        function findWithinWorksheet(searchInformation, sheet) {
            var rowCount = sheet.getRowCount(), columnCount = sheet.getColumnCount(),
                endRow = rowCount - 1, endColumn = columnCount - 1;

            getStartPosition(searchInformation.SearchOrder, new spreadNS.Range(0, 0, rowCount, columnCount));

            var searchCondition = new SearchCondition();

            searchCondition.searchString = searchInformation.SearchString;
            searchCondition.searchFlags = searchInformation.SearchFlags;
            searchCondition.searchOrder = searchInformation.SearchOrder;
            searchCondition.searchTarget = searchInformation.SearchFoundFlags;
            searchCondition.sheetArea = spreadNS.SheetArea.viewport;
            searchCondition.rowStart = findCache.rowStart;
            searchCondition.columnStart = findCache.columnStart;
            searchCondition.rowEnd = endRow;
            searchCondition.columnEnd = endColumn;

            var result = sheet.search(searchCondition);

            var row = result.foundRowIndex,
                col = result.foundColumnIndex;

            findCache.findRowIndex = row;
            findCache.findColumnIndex = col;

            return row != -1 && col != -1;
        }

        function isWorksheetContains(searchInformation, sheet) {
            var findRow, findColumn;
            var searchCondition = new SearchCondition();

            searchCondition.searchString = searchInformation.SearchString;
            searchCondition.searchFlags = searchInformation.SearchFlags | SearchFlags.BlockRange;
            searchCondition.searchOrder = searchInformation.SearchOrder;
            searchCondition.searchTarget = searchInformation.SearchFoundFlags;
            searchCondition.sheetArea = spreadNS.SheetArea.viewport;

            var result = sheet.search(searchCondition);

            findRow = result.foundRowIndex;
            findColumn = result.foundColumnIndex;
            if (findRow != -1 && findColumn != -1) {
                return true;
            }

            return false;
        }

        function findNextWithinWorksheet(searchInformation, sheet) {
            findCache.findRowIndex = -1;
            findCache.findColumnIndex = -1;

            var found = findWithinWorksheet(searchInformation, sheet);

            if (found) {
                findCache.activeCellRowIndex = findCache.findRowIndex;
                findCache.activeCellColumnIndex = findCache.findColumnIndex;

                spread.getActiveSheet().addSelection(findCache.findRowIndex, findCache.findColumnIndex, 1, 1);
                spread.getActiveSheet().showCell(findCache.findRowIndex, findCache.findColumnIndex, 3/*nearest*/, 3/*nearest*/);

                return true;
            }
            else {
                findCache.activeCellRowIndex = -1;
                findCache.activeCellColumnIndex = -1;

                return findWithinWorksheet(searchInformation, sheet);
            }
        }

        function getFindWorksheetList(withWorksheet) {
            var worksheetList = [];

            var startFindSheetIndex = findCache.activeSheetIndex,
                sheets = spread.sheets, sheetCount = sheets.length;
            for (var i = startFindSheetIndex; i < sheetCount; i++) {
                worksheetList.push(spread.sheets[i]);
            }

            for (var j = 0; j < startFindSheetIndex; j++) {
                worksheetList.push(sheets[j]);
            }

            return worksheetList;
        }

        function markFindCell(sheet, row, col) {
            sheet.setSelection(row, col, 1, 1);
            sheet.setActiveCell(row, col);
            spread.getActiveSheet().showCell(row, col, 3, 3);
            processSelectionChanged();
            fbx.text(sheet.getValue(row, col));     // TODO: need product support sync of formulabox
        }

        function findNextWithinWorksheets(searchInformation) {
            var worksheetList = getFindWorksheetList(searchInformation.WithinWorksheet);

            findCache.findRowIndex = -1;
            findCache.findColumnIndex = -1;
            findCache.findSheetIndex = -1;

            for (var i = 0; i < worksheetList.length; i++) {
                var worksheet = worksheetList[i];

                var sheetIndex = spread.sheets.indexOf(worksheet);

                if (sheetIndex != spread.getActiveSheetIndex()) {
                    findCache.activeCellRowIndex = -1;
                    findCache.activeCellColumnIndex = -1;
                }

                var found = findWithinWorksheet(searchInformation, worksheet);

                if (found) {
                    findCache.findSheetIndex = sheetIndex;
                    break;
                }
            }

            if (findCache.findSheetIndex != -1) {
                findCache.activeSheetIndex = findCache.findSheetIndex;
                var row = findCache.activeCellRowIndex = findCache.findRowIndex,
                    col = findCache.activeCellColumnIndex = findCache.findColumnIndex;

                spread.setActiveSheetIndex(findCache.findSheetIndex);
                markFindCell(spread.getActiveSheet(), row, col);

                return true;
            }
            else {
                return false;
            }
        }

        var found;
        if (searchInformation.WithinWorksheet) {
            var sheet = spread.getActiveSheet();

            if (!isWorksheetContains(searchInformation, sheet)) {
                findCache.findRowIndex = -1;
                findCache.findColumnIndex = -1;
                findCache.findSheetIndex = -1;

                return false;
            }

            found = findNextWithinWorksheet(searchInformation, sheet);
            if (found) {
                var col = findCache.activeCellColumnIndex = findCache.findColumnIndex,
                    row = findCache.activeCellRowIndex = findCache.findRowIndex;

                markFindCell(sheet, row, col);
            }
            findCache.findSheetIndex = spread.getActiveSheetIndex();
        }
        else {
            found = findNextWithinWorksheets(searchInformation);
        }

        return found;
    }

    function findnext() {
        var searchInformation = getSearchInformation();

        if (!searchInformation || !searchInformation.SearchString) {
            return;
        }

        var found = doFindNext(searchInformation);

        if (!found) {
            alert(uiResource.find.result.nomatch);
        }
    }

    var $container = $("#findOptions"),
        $findin = $("input[name='findin']", $container),
        $searchby = $("input[name='searchby']", $container),
        $lookin = $("input[name='lookin']", $container),
        $resultContainer = $(".resultlist tbody", $container),
        $resultCount = $(".resultcount", $container);

    $("#findall").click(findall);
    $("#findnext").click(findnext);
    $(document).on("click", ".resultlist tbody tr", function () {
        var cell = $(this).data("cell");
        var sheet = spread.getSheetFromName(cell.sheet.name());
        spread.setActiveSheetIndex(spread.sheets.indexOf(sheet));
        spread.getActiveSheet().setActiveCell(cell.row, cell.col);
        spread.getActiveSheet().showCell(cell.row, cell.col, 3/*nearest*/, 3/*nearest*/);
    });
}
// find related items (end)

// print setting related items
var printFormatStringMapping = {
    currentPage: {value: "&P", text: "1"},
    totalPage: {value: "&N", text: "?"},
    currentDate: {
        value: "&D", getText: function () {
            var now = new Date(), text = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
            return text;
        }
    },
    currentTime: {
        value: "&T", getText: function () {
            var now = new Date(), text = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
            return text;
        }
    },
    workbookName: {
        value: "&F", getText: function () {
            return spread && spread.name || document && document.title;
        }
    },
    sheetName: {
        value: "&A", getText: function () {
            return spread && spread.getActiveSheet() && spread.getActiveSheet().name() || "Sheet1";
        }
    }
};
var printPairFormatPatterns = ["&B", "&I", "&U"];
var printSettingSectionNames = ["left", "center", "right"];
var printImageFormat = "&G";

app.printSettingSectionNames = printSettingSectionNames;

function getPreviewHTML(formatedText, imageName) {
    function addImageData(formatedText, imageName) {
        var ss = formatedText.split(printImageFormat);
        if (ss.length > 1) {
            if (imageName) {
                var url = app.uploadImages[imageName];
                ss[0] += '<img src="' + url + '" class="preview" />';
            }

            formatedText = ss.join("");
        }

        return formatedText;
    }

    if (!formatedText) {
        return "";
    }

    var htmlClasses = ["text-bold", "text-italic", "text-underline"];

    printPairFormatPatterns.forEach(function (pattern, index) {
        var ss = formatedText.split(pattern), length = ss.length;
        if (length > 1) {
            for (var i = 1, process = true; i < length - 1; i++) {
                if (process) {
                    ss[i] = '<span class="' + htmlClasses[index] + '">' + ss[i] + '</span>';
                }
                process = !process;
            }
            formatedText = ss.join("");
        }
    });

    // add image
    formatedText = addImageData(formatedText, imageName);

    return "<span>" + formatedText + "</span>";
}

function insertText(input, text) {
    if (input.setRangeText) {
        input.setRangeText(text);
    }
    else if (input.selectionStart || input.selectionStart === 0) {
        var startPos = input.selectionStart, endPos = input.selectionEnd, value = input.value;

        input.value = value.substring(0, startPos) + text + value.substring(endPos, value.length);
        input.focus();
        input.selectionStart = startPos + text.length;
        input.selectionEnd = input.selectionStart;
    } else {
        input.value += text;
        input.focus();
    }
    input.blur();
}

app.insertText = insertText;

function updatePreview(options) {
    function updateCellsContent(cells, item) {
        printSettingSectionNames.forEach(function (name, index) {
            $(cells[index]).html(getPreviewHTML(item[name], item[getWithImageSuffix(name)]));
        });
    }

    if (options) {
        var item, cells,
            map = {header: "first", footer: "last"};

        for (var propertyName in map) {
            item = options[propertyName];
            if (item) {
                cells = $("#print-setting-preview table>tbody>tr:" + map[propertyName] + ">td");
                updateCellsContent(cells, item);
            }
        }
    }
}

app.updatePreview = updatePreview;

function getPreviewDisplayString(text) {
    function getDisplayText(map, value) {
        if (!value || !map.value) {
            return "";
        }

        if (!map.reg) {
            map.reg = new RegExp(map.value, "g");
        }

        return value.replace(map.reg, map.text || map.getText());
    }

    if (!text) {
        return "";
    }
    for (var propertyName in printFormatStringMapping) {
        var map = printFormatStringMapping[propertyName];
        text = getDisplayText(map, text);
    }

    return text;
}

app.getPreviewDisplayString = getPreviewDisplayString;

function getWithImageSuffix(name) {
    return name + "Image";
}


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


function createListItem(item, isBuiltin) {
    function removePairFormat(text) {
        printPairFormatPatterns.forEach(function (pattern) {
            text = text.split(pattern).join("");
        });

        return text;
    }

    var value = item.value, text, sections = {};

    if (value) {
        var values = [];
        printSettingSectionNames.forEach(function (name) {
            var format = value[name];
            if (format) {
                format = getPreviewDisplayString(format);

                sections[name] = format;
                var imageName = getWithImageSuffix(name);
                sections[imageName] = value[imageName];
                values.push(removePairFormat(format));
            }
        });
        text = values.join(", ");
    } else {
        text = item.text;
    }

    var $li = $("<li></li>"), $a = $("<a></a>");

    $a.text(text).data({value: value, sections: sections}).appendTo($li);

    if (isBuiltin) {
        $li.addClass("builtin");
    }

    return $li;
}

app.initPrintSetting = function () {
    if ($("#printHeaderList").children().length === 0) {
        app.isInit = true;
        fillItems($("#printHeaderList"), uiResource.printSetting.options.headerAndFooter.header.items);
        fillItems($("#printFooterList"), uiResource.printSetting.options.headerAndFooter.footer.items);
        fillDropdownList($("#textContentList"), uiResource.printSetting.options.headerAndFooter.custom.items);
        fillDropdownList($("#imageContentList"), [{text: uiResource.printSetting.options.headerAndFooter.custom.image.emptylist}]);
        app.isInit = false;
    }

    function fillItems($ul, items) {
        items.forEach(function (item) {
            $ul.append(createListItem(item, true));
        });
        $("li:first>a", $ul).click();
    }

    function fillDropdownList($ul, items) {
        function createListItem(item) {
            var $li = $("<li></li>"), $a = $("<a></a>");

            $a.text(item.text).data("value", item.value).appendTo($li);

            return $li;
        }

        items.forEach(function (item) {
            $ul.append(createListItem(item));
        });
        $("li:first>a", $ul).click();
    }
};

app.printSpread = function (printRange, printInfo) {
    if (printRange === 2) {
        // same printInfo for all sheets, you can set one by one with different setting
        var sheet = spread.getActiveSheet();
        var selection = sheet.getSelections()[0];
        printInfo.rowStart(selection.row);
        printInfo.rowEnd(selection.row + selection.rowCount - 1)
        printInfo.columnStart(selection.col);
        printInfo.columnEnd(selection.col + selection.colCount - 1);
        sheet.printInfo(printInfo);
        spread.print(spread.getActiveSheetIndex());
    } else if (printRange === 1) {
        // same printInfo for all sheets, you can set one by one with different setting
        spread.sheets.forEach(function (sheet) {
            sheet.printInfo(printInfo);
        });
        spread.print();
    } else {
        var sheet = spread.getActiveSheet();
        sheet.printInfo(printInfo);
        spread.print(spread.getActiveSheetIndex());
    }
};
// print setting related items (end)

// setting pane related items (end)

app.reset = function (noDestroy) {
    if (!noDestroy && spread) {
        spread.destroy();
        spread = null;
        GC.Spread.Sheets.designer.spreadActions.clearRegisteredCommands();

        spread = new GC.Spread.Sheets.Workbook($("#ss")[0]);
    }

    attachSpreadEvents(true);

    fbx.workbook(spread);

    hideSettingPane();
};

app.doAction = function (actionName, options) {
    spread.suspendPaint();
    Actions[actionName](spread, options);
    spread.resumePaint();
};
