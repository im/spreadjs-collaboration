(function () {
    'use strict';
    var designer = GC.Spread.Sheets.Designer;
    var shapeStyleTemplates = designer.shapeStyleTemplates;
    var shapeHelper = designer.shapeHelper;

    function mergeStyle(baseStyle, style) {
        var newStyle = {};
        for (var baseStylePropertyName in baseStyle) {
            newStyle[baseStylePropertyName] = baseStyle[baseStylePropertyName];
        }
        for (var stylePropertyName in style) {
            newStyle[stylePropertyName] = style[stylePropertyName];
        }
        return newStyle;
    }

    function shapeStylePreview(host, allStyleFlag, shapeTypeFlag) {
        var self = this;
        self.host = host;
        self.shapeTypeFlag = shapeTypeFlag;
        switch (self.shapeTypeFlag) {
            case 'autoShapeType': {
                self.dataSource = shapeStyleTemplates.autoShapeStyle;
                break;
            }
            case 'connectorShapeType': {
                self.dataSource = shapeStyleTemplates.connectorShapeStyle;
                break;
            }
        }
        self.dataIndex = 0;

        if (allStyleFlag) {
            self._createAllShapeItem();
        } else {
            self._createPartShapeStyle();
        }
    }

    shapeStylePreview.prototype._createPartShapeStyle = function () {
        var self = this;
        self.host.empty();
        self._createShapePreviewCon();
        self._createShapePreviewButton();
    };

    shapeStylePreview.prototype._createShapePreviewCon = function () {
        var self = this, dataIndex = self.dataIndex;
        var con = $("<div class='shape-style-preview-shape-host'></div>");
        var container = $("<div class='shape-style-preview-con'></div>");
        con.appendTo(container);
        container.appendTo(self.host);
        if (dataIndex < self.dataSource.length) {
            var shapeGroup = self.dataSource[dataIndex];
            self._createShapeGroup(con, shapeGroup);
        }
    };

    shapeStylePreview.prototype._createShapeGroup = function (host, shapeGroup) {
        var baseStyle = shapeGroup.baseStyle, shapes = shapeGroup.shapes;
        for (var i = 0; i < shapes.length; i++) {
            var style = mergeStyle(baseStyle, shapes[i]);
            this._createShapeItem(host, style);
        }
    };

    shapeStylePreview.prototype._createShapeItem = function (host, style, createAllShapeItemFlag) {
        var self = this;
        var shape;
        var colorCompar = shapeStyleTemplates.colorCompar;
        var shapeBackDiv = $("<div class='shape-style-preview-backGround-item'></div>");
        if (createAllShapeItemFlag) {
            shapeBackDiv.css({
                "background-color": "#ffffff",
                "border": "6px solid #ffffff"
            });
        }
        switch (self.shapeTypeFlag) {
            case 'autoShapeType': {
                shape = $("<div class='shape-style-preview-autoshape-item'>Abc</div>");
                shape.css(style);
                shape.appendTo(shapeBackDiv);
                shapeBackDiv.appendTo(host);
                break;
            }
            case 'connectorShapeType': {
                shape = $("<div class='shape-style-preview-line-item'></div>");
                var borderWidth = style.borderWidth || 0.5;
                var borderColor = style.borderColor;
                var borderStyle = style.lineStyle || 'solid';
                shape.css("border", borderWidth + 'px' + ' ' + borderStyle + ' ' + borderColor);
                shape.appendTo(shapeBackDiv);
                shapeBackDiv.appendTo(host);
                var arrowStyle = style.Arrow;
                var newBorder = borderWidth + 'px' + ' ' + borderStyle + ' ' + borderColor;
                if (arrowStyle && arrowStyle === 'end') {
                    shape.addClass("shape-style-preview-connectorshape-item");
                    shape.addClass("shape-style-preview-connectorshape-item-" + colorCompar[borderColor]);
                }
                if (arrowStyle && arrowStyle === 'beginend') {
                    shape.addClass("shape-style-preview-connectorshape-item");
                    shape.addClass("shape-style-preview-connectorshape-item-" + colorCompar[borderColor]);

                    var tool = $("<div class='tool-b'></div>");
                    tool.css({ 'border': newBorder });
                    tool.addClass("tool-b-" + colorCompar[borderColor]);
                    tool.appendTo(shape);
                }
                break;
            }
        }
        shapeBackDiv.click(style, function (event) {
            var style = event.data;      //NOSONAR
            var options = { line: {}, fill: {}, textEffect: {} };
            if (style.borderColor !== undefined) {
                options.line.color = style.borderColor;
            }
            if (style.borderWidth !== undefined) {
                options.line.width = style.borderWidth;
            }
            if (style.lineStyle !== undefined) {
                if (style.lineStyle === 'dashed') {
                    options.line.lineStyle = 2;
                } else {
                    options.line.lineStyle = style.lineStyle;
                }
            }
            if (style.Arrow !== undefined) {
                if (style.Arrow === 'end') {
                    options.line.beginArrowheadStyle = 0;
                    options.line.endArrowheadStyle = style.arrowHeadStyle;
                    options.line.endArrowheadWidth = style.width;
                    options.line.endArrowheadLength = style.length;
                }
                if (style.Arrow === 'beginend') {
                    options.line.endArrowheadStyle = style.arrowHeadStyle;
                    options.line.endArrowheadWidth = style.width;
                    options.line.endArrowheadLength = style.length;

                    options.line.beginArrowheadStyle = style.arrowHeadStyle;
                    options.line.beginArrowheadWidth = style.width;
                    options.line.beginArrowheadLength = style.length;
                }
            } else {
                options.line.beginArrowheadStyle = 0;
                options.line.endArrowheadStyle = 0;
            }
            if (style.backgroundColor !== undefined) {
                options.fill.color = style.backgroundColor;
            }
            if (style.textColor !== undefined) {
                options.textEffect.color = style.textColor;
            }
            self._applySetting(options);
            if (createAllShapeItemFlag) {
                $("#ribbon-shape-all-style-list-popup").gcuipopup("hide");
            }
        });
    };
    shapeStylePreview.prototype._createShapePreviewButton = function () {
        var self = this;
        var buttonHost = $("<div class='shape-style-preview-button-host'></div>");
        buttonHost.appendTo($(".shape-style-preview-con"));
        var upButton = $("<div class='shape-style-preview-up-button'></div>");
        var upButtonIcon = $("<div class='shape-style-preview-up-button-icon'></div>");
        upButtonIcon.appendTo(upButton);
        upButton.click(function () {
            if (self.dataIndex > 0) {
                self.dataIndex--;
                self._createPartShapeStyle();
            }
        });
        var downButton = $("<div class='shape-style-preview-down-button'></div>");
        var downButtonIcon = $("<div class='shape-style-preview-down-button-icon'></div>");
        downButtonIcon.appendTo(downButton);
        downButton.click(function () {
            if (self.dataIndex < (self.dataSource.length - 1)) {
                self.dataIndex++;
                self._createPartShapeStyle();
            }
        });
        var showALlButton = $("<div class='shape-style-preview-Show-all-button' name='change-shape-styles'  id='change-shape-styles'></div>");
        showALlButton.click(function () {
            if (!self.allShapeStylePreview) {
                self.allShapeStylePreview = $("#ribbon-shape-all-style-list-popup").gcuipopup({
                    autoHide: true,
                    position: {
                        of: $(".shape-preview"),
                        my: 'right top',
                        at: 'right top'
                    }
                });
                var shapeStyleContainer = $(".shape-all-style-list-container");
                new shapeStylePreview(shapeStyleContainer, true, self.shapeTypeFlag);   //NOSONAR
            }
            self.allShapeStylePreview.gcuipopup("show");
        });
        var showALlButtonIconTop = $("<div class='shape-style-preview-Show-all-button-icontop'></div>");
        var showALlButtonIconBottom = $("<div class='shape-style-preview-Show-all-button-iconbottom'></div>");
        showALlButtonIconTop.appendTo(showALlButton);
        showALlButtonIconBottom.appendTo(showALlButton);
        upButton.appendTo(buttonHost);
        downButton.appendTo(buttonHost);
        showALlButton.appendTo(buttonHost);
    };
    shapeStylePreview.prototype._createAllShapeItem = function () {
        var self = this;
        $(".shape-all-style-list-container").empty();
        var con = $("<div class='shape-style-preview-all-shape-con'></div>");
        var header = $("<div class='shape-style-preview-all-shape-header1'></div>");
        var content = $("<div class='shape-style-preview-all-shape-content'></div>");
        header.html(designer.res.ribbon.shapeDesign.themeStyle).appendTo(con);
        for (var dataGroupIndex = 0; dataGroupIndex < self.dataSource.length; dataGroupIndex++) {
            var baseStyle = self.dataSource[dataGroupIndex].baseStyle;

            for (var shapeStyleIndex = 0; shapeStyleIndex < self.dataSource[dataGroupIndex].shapes.length; shapeStyleIndex++) {
                var style = mergeStyle(baseStyle, self.dataSource[dataGroupIndex].shapes[shapeStyleIndex]);
                self._createShapeItem(content, style, true);
            }
        }
        content.appendTo(con);
        con.appendTo(self.host);
    };
    shapeStylePreview.prototype._applySetting = function (style) {
        var sheet = designer.wrapper.spread.getActiveSheet();
        var selectShape = shapeHelper.getActiveShapes(sheet);
        designer.actions.doAction('changeShapeStyle', designer.wrapper.spread, {
            selectShape: selectShape,
            style: style
        });
    };
    designer.shapeStylePreview = shapeStylePreview;
}());