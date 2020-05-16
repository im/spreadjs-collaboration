(function () {
    'use strict';
    var designer = GC.Spread.Sheets.Designer;
    var chartHelper = designer.util.chartHelper;
    var Sheets = GC.Spread.Sheets;
    var shapeHelper = designer.shapeHelper;
    var keyword_undefined = void 0;
    var ColorHelper = designer.ColorHelper;

    var fontFamiliesText = designer.res.ribbon.fontFamilies;
    var shapeSliderPanel = designer.res.shapeSliderPanel;
    var lineCapMap = {
        0: shapeSliderPanel.round,
        1: shapeSliderPanel.square,
        2: shapeSliderPanel.flat
    };
    var lineJoinMap = {
        0: shapeSliderPanel.round,
        1: shapeSliderPanel.miter,
        2: shapeSliderPanel.bevel
    };
    var vAlignMap = { 0: shapeSliderPanel.top, 1: shapeSliderPanel.center, 2: shapeSliderPanel.bottom };
    var hAlignMap = { 0: shapeSliderPanel.left, 1: shapeSliderPanel.center, 2: shapeSliderPanel.right };
    var moveSizeRelationship = ["movesizewithcells", "movenosizewithcells", "nomovenosizewithcells"];
    var fontSizeCollection = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 36, 48, 72];
    var fontFamilyCollection = [
        fontFamiliesText.ff1.name,
        fontFamiliesText.ff2.name,
        fontFamiliesText.ff3.name,
        fontFamiliesText.ff4.name,
        fontFamiliesText.ff5.name,
        fontFamiliesText.ff6.name,
        fontFamiliesText.ff7.name,
        fontFamiliesText.ff8.name,
        fontFamiliesText.ff9.name,
        fontFamiliesText.ff10.name,
        fontFamiliesText.ff11.name,
        fontFamiliesText.ff12.name,
        fontFamiliesText.ff13.name,
        fontFamiliesText.ff14.name,
        fontFamiliesText.ff15.name,
        fontFamiliesText.ff16.name,
        fontFamiliesText.ff17.name,
        fontFamiliesText.ff18.name,
        fontFamiliesText.ff19.name,
        fontFamiliesText.ff20.name,
        fontFamiliesText.ff21.name,
        fontFamiliesText.ff22.name,
        fontFamiliesText.ff23.name
    ];
    var fontStyleMap = {
        normal: shapeSliderPanel.normal,
        italic: shapeSliderPanel.italic,
    };
    var fontWeightMap = {
        normal: shapeSliderPanel.normal,
        bold: shapeSliderPanel.bold,
        lighter: shapeSliderPanel.lighter
    };
    var defaultColor = 'rgba(91,155,213,1)';
    var shapeSliderPanelElement = {
        SHAPEOPTIONS: 'shapeOptions',
        TEXTOPTIONS: 'textOptions'
    };
    var isHasAppointedShapeType = shapeHelper.isHasAppointedShapeType;
    var getShapeType = shapeHelper.getShapeType;
    var getAppointedShape = shapeHelper.getAppointedShape;
    var isNullOrUndefined = shapeHelper.isNullOrUndefined;
    var getDataInValueArray = shapeHelper.getDataInValueArray;

    function _isEmptyObject(obj) {
        return obj ? (typeof obj === 'object') && (Object.keys(obj).length === 0) : true;
    }

    function closeSlidePanel() {
        var sliderPanel = $(".slider-panel");
        sliderPanel.sliderpanel("close", "panel2");
    }

    function creatFontStyleObj(font) {
        var span = document.createElement('span');
        span.style.font = font;
        var cssStyle = span.style;
        return {
            fontFamily: cssStyle.fontFamily,
            fontSize: cssStyle.fontSize,
            fontStyle: cssStyle.fontStyle,
            fontWeight: cssStyle.fontWeight
        };
    }

    function _buildDataName(name) {
        var cssContent = name.split(' ');
        if (cssContent.length > 0) {
            name = cssContent[0].toLocaleLowerCase();
            for (var i = 1; i < cssContent.length; i++) {
                name = name + ' ' + cssContent[i].toLocaleLowerCase();
            }
        }
        return name;
    }

    // function _buildPanelContentCss(title) {
    //     if (title) {
    //         var cssName = title.replace(/&/, '');
    //         return cssName.toLocaleLowerCase().split(' ').join('-');
    //     }
    // }

    var editorTypeMapping = {
        fill: FillColorEditor,
        line: LineEditor,
        size: SizeEditor,
        textFill: FontColorEditor,
        textBox: TextBoxEditor,
        textEditor: TextElementEditor,
        properties: PropertiesEditor
    };

    //#region FillColorEditor
    function FillColorEditor(container, data, name, resources, colorChangedCallback) {
        this.colorChanged = colorChangedCallback;
        var self = this;
        this.colorEditor = new ColorEditor(container, data.backgroundColor, data.backgroundTransparency, name, {
            noColorText: resources.noColorText,
            solidColorText: resources.solidColorText,
        }, function (color) {
            return self.colorChanged('backgroundColor', color);
        }, function (transparency) {
            return self.colorChanged('backgroundTransparency', transparency);
        });
    }

    //#endregion FillColorEditor
    //#region LineEditor
    function LineEditor(container, data, name, resources, borderChangedCallback) {
        this.lineChanged = borderChangedCallback;
        var self = this, selectCapTypeVal, selectJoinTypeVal;
        this.colorEditor = new ColorEditor(container, data.borderColor, data.borderTransparency, name, {
            noColorText: resources.noColorText,
            solidColorText: resources.solidColorText,
        }, function (color) {
            return self.lineChanged('borderColor', color);
        }, function (transparency) {
            return self.lineChanged('borderTransparency', transparency);
        }, function (hasColor) {
            self.updateUI(null, !hasColor);
        });
        if (isNullOrUndefined(data.borderWidth)) {
            return;
        }
        this.widthEditor = new InputNumberEditor(container, resources.widthText, function (width) {
            var result = self.lineChanged('borderWidth', width);
            if (result) {
                self.updateUI(result);
            }
        }, {
                min: 0
            });
        //[0, 8, 7, 2, 4, 3, 5, 6] is line style index
        this.dashTypeDropEditor = new ImgDropEditor(container, data.dashType, {
            normal: '../images/dashLine.png',
            hover: '../images/dashLineHover.png',
            active: '../images/dashLineActive.png'
        }, {
                cssName: 'dashType',
                resName: resources.dashTypeText
            }, '../images/line.png', [0, 8, 7, 2, 4, 3, 5, 6], function (value) {
                return self.lineChanged('dashType', parseInt(value));
            }, self);
        selectCapTypeVal = lineCapMap[data.capType];
        this.capTypeDropEditor = new DropEditor(container, selectCapTypeVal, 'capType', resources.capTypeText, lineCapMap, function (value) {
            return lineCapMap[self.lineChanged('capType', value)];
        }, data.dashType);
        selectJoinTypeVal = lineJoinMap[data.joinType];
        this.joinTypeDropEditor = new DropEditor(container, selectJoinTypeVal, 'joinType', resources.joinTypeText, lineJoinMap, function (value) {
            return lineJoinMap[self.lineChanged('joinType', value)];
        });

        this.beginArrowTypeEditor = new ImgDropEditor(container, data.beginArrowheadStyle, {
            normal: '../images/arrowTypeIcon.png',
            hover: '../images/arrowTypeHover.png',
            active: '../images/arrowTypeActive.png'
        }, {
                cssName: 'beginArrowType',
                resName: resources.beginArrowTypeText
            }, '../images/arrowTypeLeft.png', [0, 1, 5, 2, 3, 4], function (value) {
                return self.lineChanged('beginArrowheadStyle', parseInt(value));
            });
        //00 include Arrow width is 0 and Arrow length is 0; 01 include Arrow width is 0 and Arrow length is 1...;
        this.beginArrowSizeEditor = new ImgDropEditor(container, data.beginArrowheadSize, {
            normal: '../images/arrowSizeIcon.png',
            hover: '../images/arrowSizeHover.png',
            active: '../images/arrowSizeActive.png'
        }, {
                cssName: 'beginArrowSize',
                resName: resources.beginArrowSizeText
            }, '../images/leftArrowSize.png', ['00', '01', '02', '10', '11', '12', '20', '21', '22'], function (value) {
                return self.lineChanged('beginArrowheadSize', {
                    width: parseInt(value.substr(0, 1)),
                    height: parseInt(value.substr(1, 1))
                });
            });
        this.endArrowTypeEditor = new ImgDropEditor(container, data.endArrowheadStyle, {
            normal: '../images/arrowTypeIcon.png',
            hover: '../images/arrowTypeHover.png',
            active: '../images/arrowTypeActive.png'
        }, {
                cssName: 'endArrowType',
                resName: resources.endArrowTypeText
            }, '../images/arrowTypeRight.png', [0, 1, 5, 2, 3, 4], function (value) {
                return self.lineChanged('endArrowheadStyle', parseInt(value));
            });
        this.endArrowSizeEditor = new ImgDropEditor(container, data.endArrowheadSize, {
            normal: '../images/arrowSizeIcon.png',
            hover: '../images/arrowSizeHover.png',
            active: '../images/arrowSizeActive.png'
        }, {
                cssName: 'endArrowSize',
                resName: resources.endArrowSizeText
            }, '../images/rightArrowSize.png', ['00', '01', '02', '10', '11', '12', '20', '21', '22'], function (value) {
                return self.lineChanged('endArrowheadSize', {
                    width: parseInt(value.substr(0, 1)),
                    height: parseInt(value.substr(1, 1))
                });
            });
        this.updateUI(data.borderWidth, this.colorEditor.noColor);
    }

    LineEditor.prototype.updateUI = function (width, noLine) {
        if (width !== null) {
            this.widthEditor.value = width;
            this.widthEditor.updateValue();
        }
        if (noLine) {
            this.widthEditor && this.widthEditor.hide();
            this.dashTypeDropEditor && this.dashTypeDropEditor.hide();
            this.capTypeDropEditor && this.capTypeDropEditor.hide();
            this.joinTypeDropEditor && this.joinTypeDropEditor.hide();
        } else {
            this.widthEditor && this.widthEditor.show();
            this.dashTypeDropEditor && this.dashTypeDropEditor.show();
            this.capTypeDropEditor && this.capTypeDropEditor.show();
            this.joinTypeDropEditor && this.joinTypeDropEditor.show();
        }
    };
    //#endregion LineEditor
    //#region SizeEditor
    function SizeEditor(container, data, name, resources, sizeChangeCallback) {
        var self = this;
        self.sizeChanged = sizeChangeCallback;
        self.heightEditor = new InputNumberEditor(container, resources.heightText, function (height) {
            if (self.sizeChanged('height', height)) {
                self.updateHeightUI(data.height);
            }
        }, {
                min: 0
            });

        self.widthEditor = new InputNumberEditor(container, resources.widthText, function (width) {
            if (self.sizeChanged('width', width)) {
                self.updateWidthUI(data.width);
            }
        }, {
                min: 0
            });

        if (!isNullOrUndefined(data.angle)) {
            this.rotateEditor = new InputNumberEditor(container, resources.rotateText, function (angle) {
                if (self.sizeChanged('angle', angle)) {
                    self.updateRotationUI(data.angle);
                }
            }, {
                    descString: '°'
                });
            self.updateRotationUI(data.angle);
        }
        self.updateWidthUI(data.width);
        self.updateHeightUI(data.height);

        var updataSizeUI = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            self.widthEditor.value = shapeHelper.updataSize(sheet)[0];
            self.widthEditor.updateValue();
            self.heightEditor.value = shapeHelper.updataSize(sheet)[1];
            self.heightEditor.updateValue();
            if (!isNullOrUndefined(data.angle)) {
                self.rotateEditor.value = shapeHelper.updataSize(sheet)[2];
                self.rotateEditor.updateValue();
            }
        };
        designer.wrapper.spread.getActiveSheet().bind(GC.Spread.Sheets.Events.ShapeChanged, updataSizeUI);
    }

    SizeEditor.prototype.updateWidthUI = function (value) {
        this.widthEditor.value = value;
        this.widthEditor.updateValue();
    };
    SizeEditor.prototype.updateHeightUI = function (value) {
        this.heightEditor.value = value;
        this.heightEditor.updateValue();
    };
    SizeEditor.prototype.updateRotationUI = function (value) {
        if (isNullOrUndefined(value)) {
            value = '';
        }
        value = Math.round(value);
        this.rotateEditor.value = value;
        this.rotateEditor.updateValue();
    };
    //#endregion SizeEditor

    //#region FontColorEditor
    function FontColorEditor(container, data, name, resources, colorChangedCallback) {
        this.valueChanged = colorChangedCallback;
        var self = this;
        this.colorEditor = new ColorEditor(container, data.fontColor, data.textTransparency, name, {
            noColorText: resources.noColorText,
            solidColorText: resources.solidColorText,
        }, function (color) {
            return self.valueChanged('fontColor', color);
        }, function (transparency) {
            return self.valueChanged('textTransparency', transparency);
        }, function (hasColor) {
            self.updateUI(!hasColor);
        });

        this.fontSizeEditor = new DropEditor(container, data.fontSize, 'fontSize', resources.fontSize, fontSizeCollection, function (value) {
            return self.valueChanged('fontSize', value);
        });
        this.fontFamiliesEditor = new DropEditor(container, data.fontFamily, 'fontFamily', resources.fontFamily, fontFamilyCollection, function (value) {
            return self.valueChanged('fontFamily', value);
        });
        var selectfontStyleVal = fontStyleMap[data.fontStyle];
        this.fontStyleEditor = new DropEditor(container, selectfontStyleVal, 'fontStyle', resources.fontStyle, fontStyleMap, function (value) {
            return fontStyleMap[self.valueChanged('fontStyle', value)];
        });
        var selectfontWeightVal = fontWeightMap[data.fontWeight];
        this.fontWeightEditor = new DropEditor(container, selectfontWeightVal, 'fontWeight', resources.fontWeight, fontWeightMap, function (value) {
            return fontWeightMap[self.valueChanged('fontWeight', value)];
        });

        this.updateUI(this.colorEditor.noColor);
    }

    FontColorEditor.prototype.updateUI = function (noLine) {
        if (noLine) {
            this.fontSizeEditor && this.fontSizeEditor.hide();
            this.fontFamiliesEditor && this.fontFamiliesEditor.hide();
            this.fontStyleEditor && this.fontStyleEditor.hide();
            this.fontWeightEditor && this.fontWeightEditor.hide();
        } else {
            this.fontSizeEditor && this.fontSizeEditor.show();
            this.fontFamiliesEditor && this.fontFamiliesEditor.show();
            this.fontStyleEditor && this.fontStyleEditor.show();
            this.fontWeightEditor && this.fontWeightEditor.show();
        }
    };
    //#endregion FontColorEditor

    //#region TextBoxEditor
    function TextBoxEditor(container, data, name, resources, alignChangedCallback) {
        this.alignChanged = alignChangedCallback;
        var self = this, selectvAlignVal, selecthAlignVal;
        selectvAlignVal = vAlignMap[data.vAlign];
        this.vAlignDropEditor = new DropEditor(container, selectvAlignVal, 'vAlign', resources.vAlignText, vAlignMap, function (value) {
            return vAlignMap[self.alignChanged('vAlign', value)];
        });
        selecthAlignVal = hAlignMap[data.hAlign];
        this.hAlignDropEditor = new DropEditor(container, selecthAlignVal, 'hAlign', resources.hAlignText, hAlignMap, function (value) {
            return hAlignMap[self.alignChanged('hAlign', value)];
        });
    }

    //#endregion TextBoxEditor
    //#region PropertiesEditor
    function PropertiesEditor(container, data, name, resources, propertiesChangedCallbck) {
        this.propertiesChanged = propertiesChangedCallbck;
        var self = this, optionDisableFlag = false;
        if (isNullOrUndefined(data)) {
            optionDisableFlag = true;
        }
        self.moveSizeWithCells = 'moveSizeWithCells';
        self.moveNoSizeWithCells = 'moveNoSizeWithCells';
        self.noMoveNoSizeWithCells = 'noMoveNoSizeWithCells';
        self.radiogroup = new RadioGroup(container, optionDisableFlag, {
            moveSizeWithCells: resources.moveSizeWithCells,
            moveNoSizeWithCells: resources.moveNoSizeWithCells,
            noMoveNoSizeWithCells: resources.noMoveNoSizeWithCells
        }, name, function (element) {
            return self.radioGroupSelectionChanged(element);
        });
        self.updaterRadioGroupUI(data.moveSizeRelationship);

        self.checkboxGroup = new CheckboxGroup(container, [resources.locked, resources.printObject], ['locked', 'printObject'], name, function (property, value) {
            return self.CheckgroupSelectionChanged(property, value);
        });
        self.updaterCheckGroupUI(3, data.locked);
        self.updaterCheckGroupUI(4, data.printObject);
    }

    PropertiesEditor.prototype.radioGroupSelectionChanged = function (value) {
        var result = this.propertiesChanged('moveSizeRelationship', moveSizeRelationship.indexOf(value));
        if (!isNullOrUndefined(result)) {
            this.updaterRadioGroupUI(result);
        }
    };
    PropertiesEditor.prototype.updaterRadioGroupUI = function (index) {
        var selectedItems = [this.moveSizeWithCells, this.moveNoSizeWithCells, this.noMoveNoSizeWithCells];
        if (index === '') {   //getDataInValueArray function  will return "" when the property values are different. so set index default is 0
            index = 0;
        }
        this.radiogroup.setSelectedItem(selectedItems[index]);
    };
    PropertiesEditor.prototype.CheckgroupSelectionChanged = function (property, value) {
        var result = this.propertiesChanged(property, value);
        if (result) {
            if (property === 'locked') {
                //'3' is dom locked option index
                this.updaterCheckGroupUI(3, result);
            }
            if (property === 'printObject') {
                //'4' is dom locked option index
                this.updaterCheckGroupUI(4, result);
            }
        }
    };
    PropertiesEditor.prototype.updaterCheckGroupUI = function (index, property) {
        this.checkboxGroup.setCheckboxSelected(index, property);
    };
    //#endregion PropertiesEditor

    //#region ColorEditor
    function ColorEditor(container, color, transparency, name, resources, changedValueCallback, changedOpacityCallBack, changedRadioGroupCallBack) {
        var self = this, optionDisableFlag = false;
        if (isNullOrUndefined(color)) {
            optionDisableFlag = true;
        }
        var numTransparency = transparency || 0;
        self.changedValue = changedValueCallback;
        self.changedOpacity = changedOpacityCallBack;
        self.changedRadioGroup = changedRadioGroupCallBack;
        self.noColorText = 'noColorText';
        self.solidColorText = 'solidColorText';
        self.radiogroup = new RadioGroup(container, optionDisableFlag, {
            noColorText: resources.noColorText,
            solidColorText: resources.solidColorText
        }, name, function (element) {
            if (self.changedRadioGroup) {
                self.changedRadioGroup(element === self.solidColorText.toLocaleLowerCase());
            }
            return self.radioGroupSelectionChanged(element);
        }
        );
        self.colorpicker = new ColorPicker(container, function (value) {
            self.colorPicked(value);
        });
        self.opacityEditor = new InputNumberEditor(container, designer.res.chartSliderPanel.transparency, function (transparent) {
            self.changedOpacity(transparent / 100);
        }, { min: 0, max: 100, descString: '%' });
        self.updateUI(color, numTransparency * 100);
    }

    ColorEditor.prototype.radioGroupSelectionChanged = function (selectedItem) {
        var color, transparent;
        if (selectedItem === (this.noColorText && this.noColorText.toLocaleLowerCase())) {
            color = this.changedValue('');
            if (color || color === '') {
                this.updateUI(color, this.opacityEditor.value);
            }
        } else {
            color = this.changedValue(this.colorpicker.color);
            transparent = this.changedOpacity(this.opacityEditor.value / 100);
            if (color || color === '') {
                this.updateUI(color, transparent * 100);
            }
        }
    };
    ColorEditor.prototype.colorPicked = function (color) {
        var result = this.changedValue(color);
        if (result || result === '') {
            this.updateUI(result, this.opacityEditor.value);
        }
    };
    ColorEditor.prototype.updateUI = function (color, transparency) {
        if (color) {
            this.updateRadiogroup(color.text || color.color || color);
            this.updateColorPicker(color.color || color);
            if (!isNullOrUndefined(transparency)) {
                this.updateOpacityInputNum(transparency);
            }
        } else if (color === '') {
            this.updateRadiogroup(color);
            this.updateColorPicker(color);
            if (!isNullOrUndefined(transparency)) {
                this.updateOpacityInputNum(transparency);
            }
        } else {
            this.updateRadiogroup(keyword_undefined);
            this.updateColorPicker(keyword_undefined);
            this.updateOpacityInputNum(0);
        }
    };
    ColorEditor.prototype.updateRadiogroup = function (color) {
        var selectedItem;
        if (!color) {
            selectedItem = this.noColorText;
            this.noColor = true;
        } else {
            var convertColor = colorIsNotEqual(color);
            var judgeColorString = color;
            var judgeConvertColorString = convertColor;
            while (judgeColorString.indexOf(' ') !== -1) {
                judgeColorString = judgeColorString.replace(' ', '');
            }
            while (judgeConvertColorString.indexOf(' ') !== -1) {
                judgeConvertColorString = judgeConvertColorString.replace(' ', '');
            }
            if (color === 'rgba(0,0,0,0)' || judgeConvertColorString === 'rgba(0,0,0,0)') {
                selectedItem = this.noColorText;
                this.noColor = true;
            } else {
                selectedItem = this.solidColorText;
                this.noColor = false;
            }
        }

        this.radiogroup.setSelectedItem(selectedItem);
    };
    ColorEditor.prototype.updateColorPicker = function (color) {
        if (!color) {
            this.colorpicker.hideColorPicker();
            this.opacityEditor.hide();
        } else {
            var convertColor = colorIsNotEqual(color);
            var judgeColorString = color;
            var judgeConvertColorString = convertColor;
            while (judgeColorString.indexOf(' ') !== -1) {
                judgeColorString = judgeColorString.replace(' ', '');
            }
            while (judgeConvertColorString !== true && judgeConvertColorString.indexOf(' ') !== -1) {
                judgeConvertColorString = judgeConvertColorString.replace(' ', '');
            }
            if (judgeColorString && judgeColorString !== 'rgba(0,0,0,0)' && judgeConvertColorString !== true && judgeConvertColorString !== 'rgba(0,0,0,0)') {
                this.colorpicker.showColorPicker();
                this.opacityEditor.show();
                this.colorpicker.color = convertColor || color;
                this.colorpicker.updateColor();
            } else {
                this.colorpicker.hideColorPicker();
                this.opacityEditor.hide();
            }
        }
    };
    ColorEditor.prototype.updateOpacityInputNum = function (transparency) {
        this.opacityEditor.value = parseInt(transparency);
        this.opacityEditor.updateValue();
    };

    function colorIsNotEqual(color) {
        var colorArray = chartHelper.getPieColorArray(color);
        var color1 = ColorHelper.parse(colorArray[0], designer.wrapper.spread.getActiveSheet().currentTheme()).color;

        if (colorArray.length > 1) {
            var colorNext, colorPreview;
            for (var i = 1; i < colorArray.length - 1; i++) {
                colorNext = ColorHelper.parse(colorArray[i], designer.wrapper.spread.getActiveSheet().currentTheme()).color;
                colorPreview = ColorHelper.parse(colorArray[i - 1], designer.wrapper.spread.getActiveSheet().currentTheme()).color;
                if (colorNext !== colorPreview) {
                    return true;
                }
            }
            colorNext = ColorHelper.parse(colorArray[colorArray.length - 1], designer.wrapper.spread.getActiveSheet().currentTheme()).color;
            colorPreview = ColorHelper.parse(colorArray[colorArray.length - 2], designer.wrapper.spread.getActiveSheet().currentTheme()).color;
            if (colorNext !== colorPreview) {
                return true;
            }
            return color1;
        }
        return color1;
    }

    //#endregion ColorEditor
    //#region ColorPicker
    function ColorPicker(container, colorChangedCallback) {
        this.colorChanged = colorChangedCallback;
        this.domColor = this.createColorElement();
        container.append(this.domColor);
    }

    ColorPicker.prototype.createColorElement = function (name) {
        var self = this;
        self.color = defaultColor || 'transparent';

        var container = $('<div></div>').css({
            "width": "143px",
            "margin": "3px 9px 3px 3px",
            "float": "right",
            "display": "inline-block"
        });
        var content = $('<span></span>').appendTo(container);
        $('<span></span>').addClass('color-picker-span').appendTo(content);
        var popup = $('<div></div>').appendTo(container);
        if (!self._colorPicker) {
            self._colorPicker = $('<div></div>').addClass('forecolor-picker').colorpicker({
                valueChanged: function (es, value) {
                    self.colorChanged(value.name || value.color);
                },
                choosedColor: function (es, value) {
                    container.comboframe('close');
                },
                openColorDialog: function (es, value) {
                    container.comboframe('close');
                },
                showNoFill: false,
                themeColors: designer.wrapper.getThemeColors()
            }).appendTo(popup);
        }
        popup.gcuipopup({
            autoHide: true,
            showing: function (e, args) {
                var colorPicker = self._colorPicker;
                colorPicker.colorpicker("option", "value", self.color);
                colorPicker.colorpicker("option", "themeColors", designer.wrapper.getThemeColors());
            }
        });

        container.comboframe().click(function () {
            container.comboframe('open');
        });
        var label = $('<label></label>').css({ "margin-left": "6px" }).text(designer.res.chartSliderPanel.color);
        return $('<li></li>').append(label).append(container).addClass('format-chart-panel-color').hide();
    };
    ColorPicker.prototype.colorChanged = function (e, value) {
        this.colorChanged(e.target, value); //color
    };
    ColorPicker.prototype.showColorPicker = function () {
        this.domColor.show();
    };
    ColorPicker.prototype.hideColorPicker = function () {
        this.domColor.hide();
    };
    ColorPicker.prototype.updateColor = function () {
        $('.color-picker-span', this.domColor).css({ 'background-color': this.color });
    };
    //#endregion ColorPicker
    //#region RadioGroup
    function RadioGroup(container, optionDisableFlag, items, name, radioGroupSelectedItemCallback) {
        var self = this;
        self.updateRaidoSelectedItem = radioGroupSelectedItemCallback;
        self.domRadio = container;
        Object.keys(items).forEach(function (key) {
            container.append(self.addRadioItem(optionDisableFlag, name, key, items[key]));
        });
    }

    RadioGroup.prototype.addRadioItem = function (optionDisableFlag, name, title, titleRes) {
        var self = this;
        var radioItem = _createRadioItem(optionDisableFlag, name, title, titleRes);
        $(radioItem.children()[0]).click(function (event) {
            self.updateRaidoSelectedItem($(event.currentTarget).data('name'));
        });
        return radioItem;
    };
    RadioGroup.prototype.setSelectedItem = function (selectedElement) {
        var dataName = selectedElement.toLocaleLowerCase();
        $("[data-name='" + dataName + "']", this.domRadio).prop('checked', true);
    };

    function _createRadioItem(optionDisableFlag, name, title, titleRes) {
        var radio = $('<input />', {
            type: 'radio',
            name: name
        }).attr('data-name', _buildDataName(title)).attr('id', _buildDataName(title));
        if (optionDisableFlag) {
            radio.attr("disabled", true);
        }
        var label = $('<label></label>').text(titleRes).attr('for', _buildDataName(title));

        var span = $('<span></span>').append(radio).append(label).attr('data-name', _buildDataName(title)).attr('id', _buildDataName(title));
        return $('<li></li>').append(span).css({
            "list-style-type": "none",
            "line-height": "25px"
        });
    }

    //#endregion RadioGroup
    //#region CheckboxGroup
    function CheckboxGroup(container, items, propertypeName, name, checkboxSelectedCallback) {
        var self = this;
        self.updateCheckboxSelected = checkboxSelectedCallback;
        self.domRadio = container;
        for (var i = 0; i < items.length; i++) {
            container.append(self.addCheckItem(name, items[i], propertypeName[i]));
        }
    }

    CheckboxGroup.prototype.addCheckItem = function (name, title, propertypeName) {
        var self = this;
        var checkboxItem = _createCheckboxItem(name, title);
        $(checkboxItem.children()[0]).find('input[type]').click(function (event) {
            self.updateCheckboxSelected(propertypeName, $(event.currentTarget).prop("checked"));
        });
        return checkboxItem;
    };
    CheckboxGroup.prototype.setCheckboxSelected = function (index, isSelected) {
        $(this.domRadio.children().get(index)).find('input[type]').prop('checked', isSelected);

    };

    function _createCheckboxItem(name, title) {
        var checkbox = $('<input />', {
            type: 'checkbox',
            name: name
        }).attr('data-name', _buildDataName(title)).attr('id', _buildDataName(title));
        var label = $('<label></label>').text(title).attr('for', _buildDataName(title));

        var span = $('<span></span>').append(checkbox).append(label).attr('data-name', _buildDataName(title)).attr('id', _buildDataName(title));
        return $('<li></li>').append(span).css({
            "list-style-type": "none",
            "line-height": "25px"
        });
    }

    //#endregion CheckboxGroup
    //#region ImgDropEditor
    function ImgDropEditor(container, data, defaultImgUrlObj, text, ImgListUrl, value, listChangedCallback, lineEditor) {
        if (isNullOrUndefined(data)) {
            return;
        }
        var self = this;
        self.listChanged = listChangedCallback;
        var li = $('<li></li>').css({
            'margin': '4px 1px',
            "list-style-type": 'none',
            "line-height": "28px"
        }).append($('<lable></lable>').css({ 'margin-left': '6px' }).text(text.resName));
        this.defauleItem = this._createDefaultElement(defaultImgUrlObj);
        li.append(this.defauleItem).appendTo(container);
        this.itemsImgList = new ItemsImgList(ImgListUrl, data, value, text.cssName, function (itemList, element) {
            self.changedValue(itemList, element, lineEditor);
        });
        li.append(this.itemsImgList);
    }

    ImgDropEditor.prototype._createDefaultElement = function (defaultImgUrlObj) {
        var self = this;
        self.buttonClickFlag = false;
        var button = $('<button></button>').addClass('ui-button ui-widget ui-state-default ui-button-text-icon-secondary ui-corner-left');
        button.css({
            "background-image": "url(" + defaultImgUrlObj.normal + ")",
            "width": "45px",
            "height": "25px",
            "float": "right",
            "margin-right": "10px"
        });
        button.mouseover(function () {
            if (!self.buttonClickFlag) {
                $(this).css({
                    "background-image": "url(" + defaultImgUrlObj.hover + ")",
                });
            }
        });
        button.mouseout(function () {
            if (!self.buttonClickFlag) {
                $(this).css({
                    "background-image": "url(" + defaultImgUrlObj.normal + ")",
                });
            }
        });
        button.click(function () {
            if (!self.itemsImgList) {
                return;
            }
            self.buttonClickFlag = true;
            $(this).css({
                "background-image": "url(" + defaultImgUrlObj.active + ")",
            });
            self.itemsImgList.gcuipopup("show", {
                of: $(this),
                my: 'left+' + '0' + ' top+' + '22',
                at: 'left top'
            });
        });
        return button;
    };
    ImgDropEditor.prototype.changedValue = function (itemList, value, lineEditor) {
        var result = this.listChanged(value);
        this.buttonClickFlag = false;
        this.defauleItem.trigger("mouseout");
        if (!isNullOrUndefined(result)) {
            itemList.selectItem = result;
            if (lineEditor) {
                if (result !== 0) // NOSONAR
                    lineEditor.capTypeDropEditor.defauleItem.parent().hide();
                else {
                    lineEditor.capTypeDropEditor.defauleItem.parent().show();
                }
            }
        }
    };
    ImgDropEditor.prototype.hide = function () {
        this.defauleItem.parent().hide();
    };
    ImgDropEditor.prototype.show = function () {
        this.defauleItem.parent().show();
    };
    //#endregion DropEditor
    //#region ItemsImgList
    function ItemsImgList(ImgListUrl, data, value, text, updateSelectedElementCallback) {
        var self = this;
        self.selectItem = data;
        self.updateSelectedElement = updateSelectedElementCallback;
        self.selectedElementListDom = self.addItems(ImgListUrl, text, value);
        return self.selectedElementListDom;
    }

    ItemsImgList.prototype.addItems = function (ImgListUrl, text, value) {
        var self = this;
        var divContainerName = text.replace(/\s*/g, "");
        var contentDiv = $('<div></div>').addClass("shape-imageList-content-" + divContainerName);
        value.forEach(function (item) {
            var div = $('<div></div>').attr('data', item).addClass('shape-imageList-item-base-' + divContainerName + '  ' + 'shape-imageList-item-' + item).css("background-image", 'url("' + ImgListUrl + '")');
            div.click(function (event) {
                $(".shape-imageList-item-" + self.selectItem).removeClass("shape-imageList-item-hover");
                self.changedSelectedElement($(event.currentTarget).attr('data'));
            });
            contentDiv.append(div);
        });
        contentDiv.gcuipopup({
            autoHide: true,
            showing: function (e, args) {
                $(".shape-imageList-item-" + self.selectItem).addClass("shape-imageList-item-hover");
            },
            hiding: function (e, args) {
                $(".shape-imageList-item-" + self.selectItem).removeClass("shape-imageList-item-hover");
            }
        });
        return contentDiv;
    };
    ItemsImgList.prototype.changedSelectedElement = function (value) {
        this.updateSelectedElement(this, value);
        this.selectedElementListDom.hide();
    };
    //#endregion ItemsList
    //#region InputNumberEditor
    function InputNumberEditor(container, title, valueChangedCallback, option) {
        this.valueChanged = valueChangedCallback;
        this.domInput = this.addInputNumberEditor(title);
        this.maxValue = option && !isNullOrUndefined(option.max) ? option.max : Number.MAX_VALUE;
        this.minValue = option && !isNullOrUndefined(option.min) ? option.min : -Number.MAX_VALUE;
        this.descString = (option && option.descString) || '';
        container.append(this.domInput);
    }

    InputNumberEditor.prototype.addInputNumberEditor = function (title) {
        var self = this;
        this.value = 0;

        var span = $('<span></span>').addClass('ui-spinner ui-widget ui-widget-content ui-corner-all').css({
            "width": "85px",
            "float": "right",
            "margin-right": "9px",
            "height": "23px"
        });
        var input = $('<input />', { type: 'input' }).addClass('label-top-padding numeric column1 ui-spinner-input').css({
            "position": "absolute",
            "left": "1px",
            "top": "1px"
        }).change(function () {
            var value = parseInt($(input).val());
            self.value = self.adjustValue(value);
            self.updateValue();
            self.valueChanged(self.value);
        });
        var aTop = $('<a />').addClass('ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default ui-button-text-only').append($('<div></div>').css({
            width: "0",
            height: "0",
            "margin-left": "-1px",
            "margin-bottom": "3px",
            "border-left": "4px solid transparent",
            "border-right": "4px solid transparent",
            "border-bottom": "6px solid rgba(0, 0, 0, 0.4)",
            display: "inline-block"
        })).click(function () {
            var value = self.value;
            value = value + 1;
            self.value = self.adjustValue(value);
            self.updateValue();
            self.valueChanged(self.value);
        });

        var aBottom = $('<a />').addClass('ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default ui-button-text-only').append($('<div></div>').css({
            width: "0",
            height: "0",
            "margin-left": "-1px",
            "margin-top": "3px",
            "border-width": "6px 4px 6px",
            "border-style": "solid",
            "border-color": "rgba(0, 0, 0, 0.4) transparent transparent",
            display: "inline-block"
        })).click(function () {
            var value = self.value;
            value = value - 1;
            self.value = self.adjustValue(value);
            self.updateValue();
            self.valueChanged(self.value);
        });
        span.append(input).append(aTop).append(aBottom);

        var label = $('<label></label>').css({ "margin-left": "6px" }).text(title);
        return $('<li></li>').append(label).append(span).css({
            "margin": "1px",
            "list-style-type": "none",
            "line-height": "25px"
        });
    };
    InputNumberEditor.prototype.adjustValue = function (value) {
        if (isNaN(value)) {
            value = this.value;
        }
        if (!isNullOrUndefined(value)) {
            if (!isNullOrUndefined(this.minValue)) {
                value = Math.max(value, this.minValue);
            }
            if (!isNullOrUndefined(this.maxValue)) {
                value = Math.min(value, this.maxValue);
            }
        }
        return Math.round(value);
    };
    InputNumberEditor.prototype.updateValue = function () {
        if (this.value === undefined || this.value === '') {
            $('input', this.domInput).val('');
        } else {
            this.value = Math.round(this.value);
            $('input', this.domInput).val(this.value + this.descString);
        }
    };
    InputNumberEditor.prototype.hide = function () {
        this.domInput.hide();
    };
    InputNumberEditor.prototype.show = function () {
        this.domInput.show();
    };
    //#endregion InputNumberEditor
    //#region InputTextEditor
    function InputTextEditor(container, title, valueChangedCallback) {
        this.valueChanged = valueChangedCallback;
        this.domInput = this.addInputTextEditor(title);
        container.append(this.domInput);
    }

    InputTextEditor.prototype.addInputTextEditor = function (title) {
        var self = this;
        this.text = '';
        var input = $('<input />', { type: 'input' }).addClass('shape-input-number-editor').change(function (event) {
            self.valueChanged($(event.target).val());
        });
        var label = $('<label></label>').css({ "margin-left": "6px", "float": "left", "width": "40px" }).text(title);
        return $('<li></li>').append(label).append(input).css({
            "margin": "1px",
            "list-style-type": "none",
            "line-height": "28px",
            "height": "28px"
        });
    };
    InputTextEditor.prototype.updateValue = function () {
        $('input', this.domInput).val(this.text);
    };
    //#endregion InputTextEditor
    //#region TextElementEditor
    function TextElementEditor(container, data, name, resources, textChangedCallback) {
        this.textChanged = textChangedCallback;
        var self = this;
        this.textEditor = new InputTextEditor(container, resources.text, function (text) {
            var result = self.textChanged('text', text);
            if (result) {
                self.updateUI(result);
            }
        });
        this.updateUI(data.text);
    }

    TextElementEditor.prototype.updateUI = function (text) {
        this.textEditor.text = text;
        this.textEditor.updateValue();
    };
    //#endregion TextElementEditor
    //#region DropEditor
    function DropEditor(container, data, name, text, collection, listChangedCallback, dashTypeValue) {
        var self = this;
        self.listChanged = listChangedCallback;

        var li = $('<li></li>').css({
            'margin': '4px 1px',
            "list-style-type": 'none',
            "line-height": "28px",
            "white-space": "nowrap"
        }).append($('<lable></lable>').css({ 'margin-left': '6px' }).text(text));
        this.defauleItem = this._createDefaultElement(name);
        li.append(this.defauleItem).appendTo(container);
        this.itemsList = new ItemsList(collection, name, function (element) {
            self.changedValue(element);
        });
        if (!isNullOrUndefined(dashTypeValue) && dashTypeValue !== 0) {
            li.hide();
        }
        li.append(this.itemsList);
        this.updateUI(data);
    }

    DropEditor.prototype._createDefaultElement = function (name) {
        var self = this;
        var button = $('<button></button>').addClass('ui-button ui-widget ui-state-default ui-button-text-icon-secondary ui-corner-left').addClass('format-panel-drop-default-button-' + name);
        var span1 = $('<span></span>').addClass('panel-button-text').addClass('format-panel-drop-default-span-' + name);
        var span2 = $('<span></span>').addClass('ui-button-icon-secondary ui-icon ui-icon-triangle-1-s');
        button.append(span1).append(span2);
        button.click(function () {
            if (!self.itemsList) {
                return;
            }
            self.itemsList.gcuipopup("show", {
                of: $(this),
                my: 'left+' + '0' + ' top+' + '22',
                at: 'left top'
            });
        });
        return button;
    };
    DropEditor.prototype.changedValue = function (value) {
        var result = this.listChanged(value);
        if (result) {
            this.updateUI(result);
        }
    };
    DropEditor.prototype.updateUI = function (value) {
        var valueTemp = value.toString().replace(/\"/g, "");
        $('span:first', this.defauleItem).text(valueTemp);
    };
    DropEditor.prototype.hide = function () {
        this.defauleItem.parent().hide();
    };
    DropEditor.prototype.show = function () {
        this.defauleItem.parent().show();
    };
    //#endregion DropEditor
    //#region ItemsList
    function ItemsList(items, name, updateSelectedElementCallback) {
        var self = this;
        self.updateSelectedElement = updateSelectedElementCallback;
        self.selectedElementListDom = self.addItems(items, name);
        return self.selectedElementListDom;
    }

    ItemsList.prototype.addItems = function (items, name) {
        var self = this;
        var ul = $('<ul></ul>').css({
            background: "white",
            "z-index": "10",
            "padding-left": "0px",
        });
        if (name === 'fontFamily') {
            ul.css({
                "width": "210px"
            });
        }
        if (items && typeof (items) === 'object' && items.constructor === Array) {
            items.forEach(function (item) {
                var li = $('<li></li>').attr('name', item).append($('<label></label>').text(item).css({ "margin-left": "2px" })).css({
                    "list-style-type": 'none',
                    "line-height": "25px"
                });
                li.click(function (event) {
                    var name1 = $(event.currentTarget).attr('name');
                    self.changedSelectedElement(name1);
                }).mouseenter(function () {
                    $(this).css("background", "#DBDBDB");
                }).mouseleave(function () {
                    $(this).css("background", "white");
                });
                ul.append(li);
            });
        } else {
            Object.keys(items).forEach(function (key) {
                var li = $('<li></li>').attr('name', key).append($('<label></label>').text(items[key]).css({ "margin-left": "2px" })).css({
                    "list-style-type": 'none',
                    "line-height": "25px"
                });
                li.click(function (event) {
                    var name1 = $(event.currentTarget).attr('name');
                    self.changedSelectedElement(name1);
                }).mouseenter(function () {
                    $(this).css("background", "#DBDBDB");
                }).mouseleave(function () {
                    $(this).css("background", "white");
                });
                ul.append(li);
            });
        }
        var dropListPopup = $('<div></div>').addClass('format-panel-drop-list-common format-panel-drop-list-' + name).append(ul);
        dropListPopup.gcuipopup({
            autoHide: true
        });
        return dropListPopup;
    };
    ItemsList.prototype.changedSelectedElement = function (name) {
        this.updateSelectedElement(name);
        this.selectedElementListDom.hide();
    };
    //#endregion ItemsList

    //#region PropertyEditorTitle
    function PropertyEditorTitle(name, changedEditorStatusCallback) {
        this.changedEditorStatus = changedEditorStatusCallback;
        return this.addEditorTitle(name);
    }

    PropertyEditorTitle.prototype.addEditorTitle = function (name) {
        var self = this;
        var label = $("<label>").text(name).css({
            font: "Bold 12pt Calibri,Arial"
        });
        self.triangleExtend = $("<div><div").css({
            width: "0",
            height: "0",
            "margin-right": "6px",
            "margin-bottom": "3px",
            "border-right": "8px solid rgba(0, 0, 0, 0.8)",
            "border-top": "8px solid transparent",
            display: "inline-block"
        }).attr('name', 'extend').click(function (event) {
            self.triangleCollapse.show();
            $(this).hide();
            var name1 = $(event.target).attr('name');
            self.changedEditorStatus(name1);
        });
        self.triangleCollapse = $("<div><div").css({
            width: "0",
            height: "0",
            "margin-right": "6px",
            "border-top": "5px solid transparent",
            "border-left": "8px solid rgba(0, 0, 0, 0.8)",
            "border-bottom": "5px solid transparent",
            display: "inline-block"
        }).attr('name', 'collapse').hide().click(function (event) {
            self.triangleExtend.show();
            $(this).hide();
            var name1 = $(event.target).attr('name');
            self.changedEditorStatus(name1);
        });
        return $('<p></p>').css({ margin: "2px 0px 0px 15px" }).append(self.triangleExtend).append(self.triangleCollapse).append(label);
    };
    PropertyEditorTitle.prototype.changedEditorStatus = function (name) {
        this.changedEditorStatus(name);
    };
    //#endregion PropertyEditorTitle

    //#region PropertyEditorContainer
    function PropertyEditorContainer(property, changedValueCallback) {
        var self = this;
        this.changedValue = changedValueCallback;
        var ul = $('<ul></ul>').css('padding-left', '30px');
        var EditorType = editorTypeMapping[property.type];
        this.editorType = new EditorType(ul, property.data, property.name, property.resources, function (propertyName, value) {
            return self.editorValueChanged(propertyName, value);
        });
        return ul;
    }

    PropertyEditorContainer.prototype.editorValueChanged = function (propertyName, value) {
        return this.changedValue('data' + '.' + propertyName, value);
    };
    //#endregion PropertyEditorContainer

    //#region PropertyTabHeader
    function PropertyTabHeader(container, headers, tabChangedCallback) {
        var self = this;
        this.tabChanged = tabChangedCallback;
        var categoryGroup = $('<div></div>').addClass('panel-content-header');
        headers.forEach(function (header) {
            categoryGroup.append(self.addTabHeader(header.type, header.name));
        });
        this.activePropertyTabHeader = $(categoryGroup.children()[0]);
        this.activePropertyTabHeader.children().remove();
        this.activePropertyTabHeader.append($('<span></span>').addClass('selected-' + this.activePropertyTabHeader.attr('cssName')).addClass('format-shape-panel'));
        this.propertyTabHeaders = categoryGroup;
        container.append(categoryGroup);
    }

    PropertyTabHeader.prototype.addTabHeader = function (type, name/*, icon*/) {
        var self = this;
        var categorySpan = $('<span></span>').addClass(type).addClass('format-shape-panel');
        var div = $('<div></div>').append(categorySpan).attr('title', name).attr('cssName', type).addClass('format-shape-panel-background');
        div.click(function (event) {
            self.tabChanged($(event.currentTarget).attr('cssName'));
        });
        return div;
    };
    //#endregion PropertyTabHeader

    //#region PropertyGroupPanels
    function PropertyGroupPanels(type, properties, changedValueCallback) {
        this.changedValue = changedValueCallback;
        var self = this;
        self.type = type;
        var div = $('<div></div>').hide();
        var j = 0;
        while (j < properties.length) {
            for (var i = 0; i < properties[j].editors.length; i++) {
                div.append(new PropertyGroupContainer(properties[j].editors[i], properties[j].aggregate, j, i, function (dataPath, propertyName, value) {
                    return self.groupContainerValueChanged(dataPath, propertyName, value);
                }));
            }
            j++;
        }
        return div;
    }

    PropertyGroupPanels.prototype.groupContainerValueChanged = function (dataPath, propertyName, value) {
        return this.changedValue(this.type, dataPath, propertyName, value);
    };
    //#endregion PropertyGroupPanels

    //#region PropertyGroupContainer
    function PropertyGroupContainer(property, aggregate, contentIndex, index, changedValueCallback) {
        var self = this;
        self.aggregate = aggregate;
        self.contentIndex = contentIndex;
        self.index = index;
        this.changedValue = changedValueCallback;
        var div = $('<div></div>');
        var editorTitle = new PropertyEditorTitle(property.name, function (name) {
            self.updateEditorContainer(name);
        });
        div.append(editorTitle);
        this.editorContainer = new PropertyEditorContainer(property, function (propertyName, value) {
            return self.editorContainerValueChanged(propertyName, value);
        });
        div.append(this.editorContainer);
        return div;
    }

    PropertyGroupContainer.prototype.editorContainerValueChanged = function (propertyName, value) {
        return this.changedValue(['content', this.contentIndex, this.aggregate, this.index], propertyName, value);
    };
    PropertyGroupContainer.prototype.updateEditorContainer = function (name) {
        name === 'extend' ? this.editorContainer.hide() : this.editorContainer.show();
    };
    //#endregion PropertyGroupContainer

    //#region PropertyTabPanel
    function PropertyTabPanel(datas, owner) {
        var self = this;
        self.owner = owner;
        self.propertyHeaderData = [];
        self.propertyGroupPanels = [];
        var tabPanel = $('<div></div>');
        for (var i = 0; i < datas.length; i++) {
            this.propertyHeaderData.push({ name: datas[i].name, type: datas[i].type });
        }
        self.propertyHeaderPanel = new PropertyTabHeader(tabPanel, this.propertyHeaderData, function (name) {
            self.activeTabChanged(name);
        });

        for (var j = 0; j < datas.length; j++) {
            var groupPanel = new PropertyGroupPanels(datas[j].type, datas[j].properties, function (namePath, dataPath, propertyName, value) {
                return self.activePanelValueChanged(namePath, dataPath, propertyName, value);
            });
            tabPanel.append(groupPanel);
            this.propertyGroupPanels.push({
                name: datas[j].name,
                type: datas[j].type,
                propertyGroupPanel: groupPanel
            });
        }
        self.activePropertyGroupPanel = this.propertyGroupPanels[0].propertyGroupPanel;
        self.showPropertyGroupPanel(this.activePropertyGroupPanel);
        return tabPanel;
    }

    PropertyTabPanel.prototype.activePanelValueChanged = function (namePath, dataPath, propertyName, value) {
        return this.owner.updateData(namePath, dataPath, propertyName, value);
    };
    PropertyTabPanel.prototype.activeTabChanged = function (name) {
        for (var i = 0; i < this.propertyGroupPanels.length; i++) {
            if (this.propertyGroupPanels[i].type === name) {
                this.hidePropertyGroupPanel(this.activePropertyGroupPanel);
                this.activePropertyGroupPanel = this.propertyGroupPanels[i].propertyGroupPanel;
                this.showPropertyGroupPanel(this.activePropertyGroupPanel, name);
            }
        }
    };
    PropertyTabPanel.prototype.hidePropertyGroupPanel = function (oldPropertyGroupPanel) {
        oldPropertyGroupPanel.hide();
        this.propertyHeaderPanel.activePropertyTabHeader.children().remove();
        this.propertyHeaderPanel.activePropertyTabHeader.append($('<span></span>').addClass(this.propertyHeaderPanel.activePropertyTabHeader.attr('cssName')).addClass('format-shape-panel'));
    };
    PropertyTabPanel.prototype.showPropertyGroupPanel = function (newPropertyGroupPanel, name) {
        newPropertyGroupPanel.show();
        var headerElements = this.propertyHeaderPanel.propertyTabHeaders.children();
        for (var i = 0; i < headerElements.length; i++) {
            if ($(headerElements[i]).attr("cssName") === name) {
                this.propertyHeaderPanel.activePropertyTabHeader = $(headerElements[i]);
                this.propertyHeaderPanel.activePropertyTabHeader.children().remove();
                this.propertyHeaderPanel.activePropertyTabHeader.append($('<span></span>').addClass('selected-' + this.propertyHeaderPanel.activePropertyTabHeader.attr('cssName')).addClass('format-shape-panel'));
            }
        }
    };
    //#endregion PropertyTabPanel

    //#region InitSelectedShapeElement
    function InitSelectedShapeElement(dataManager, updateSelectedShapeElementCallback) {
        var self = this;
        self.updateSelectedShapeElement = updateSelectedShapeElementCallback;
        self.selectedElement = self.createSelectedShapeElement(dataManager);
        return self.selectedElement;
    }

    InitSelectedShapeElement.prototype.createSelectedShapeElement = function (dataManager) {
        var self = this;
        var shapeOrTextElement = $('<div></div>').css({
            "color": "rgba(0, 0, 0, 0.7)",
            "height": '25px'
        });
        var shapeOptionsDiv = $("<div>").addClass('this-class').css({
            padding: "2px 15px",
            "white-space": "nowrap"
        });
        var shapeOptionsText = $("<label>").attr('id', 'shapeSliderPanel-shapeOptions-text').text(designer.res.shapeSliderPanel.shapeOptions).addClass("shape-SliderPanel-headers-text").css(
            {
                "font-weight": "bold"
            }
        );
        shapeOptionsText.click(function () {
            $('#shapeSliderPanel-textOptions-text').css({
                "font-weight": "normal"
            });
            $(this).css({
                "font-weight": "bold",
                "color": "rgb(0,0,0)"
            });
            self.updateSelectedShapeElement(shapeSliderPanelElement.SHAPEOPTIONS);
        });
        shapeOptionsText.hover(function () {
            if ($(this).css('font-weight') === '400') {
                $(this).css({ "color": "rgb(8, 137, 44)" });
            }
        },
            function () {
                $(this).css({ "color": "rgb(0,0,0)" });
            }
        );

        shapeOptionsDiv.append(shapeOptionsText);
        if (!_isEmptyObject(dataManager._data.textOptions)) {
            var divideText = $("<label>").text(" | ").addClass("shape-SliderPanel-headers-text");
            var textOptionsText = $("<label>").attr('id', 'shapeSliderPanel-textOptions-text').text(designer.res.shapeSliderPanel.textOptions).addClass("shape-SliderPanel-headers-text");
            textOptionsText.click(function () {
                $('#shapeSliderPanel-shapeOptions-text').css({ "font-weight": "normal" });
                $(this).css({ "font-weight": "bold", "color": "rgb(0,0,0)" });
                self.updateSelectedShapeElement(shapeSliderPanelElement.TEXTOPTIONS);
            });
            textOptionsText.hover(function (e) {
                if ($(this).css('font-weight') === '400') {
                    $(this).css({ "color": "rgb(8, 137, 44)" });
                }
            }, function () {
                $(this).css({ "color": "rgb(0,0,0)" });
            }
            );
            shapeOptionsDiv.append(divideText).append(textOptionsText);
        }
        shapeOrTextElement.append(shapeOptionsDiv);
        $('#shapeSliderPanel-shapeOptions-text').trigger("click");
        return shapeOrTextElement;

    }
        ;
    //#endregion InitSelectedShapeElement

    //#region ShapePanelContainer
    function ShapePanelContainer(container, dataManager, updateSlideCallBack) {
        var self = this;
        self.owner = dataManager;
        self.container = container;
        self.updateSlideCallBack = updateSlideCallBack;
        self.container.append(new InitSelectedShapeElement(dataManager, function (currentSelectElement) {
            self.updateShapePanelTab(currentSelectElement);
            // self.updateSlideCallBack();
        }));
        self.initShapePanelContent();
    }

    ShapePanelContainer.prototype.initShapePanelContent = function () {
        var self = this;
        var datas = self.owner.getDatas();
        self.shapePanelContentDom = new PropertyTabPanel(datas, self.owner);
        self.container.append(this.shapePanelContentDom);
    };
    ShapePanelContainer.prototype.updateShapePanelTab = function (selectedElement) {
        var self = this;
        self.owner._selectedElement = selectedElement;
        self.shapePanelContentDom.remove();
        self.initShapePanelContent();
    };

    //#endregion ShapePanelContainer

    function initSliderPanelHeader(sliderPanelContainer) {
        var sliderPanelHeader = $("<div>").css({
            "color": "rgba(0, 0, 0, 0.8)",
            "height": "40px"
        }).appendTo(sliderPanelContainer);
        sliderPanelHeader.children().remove();
        var mainHeader = $("<div>").css({
            padding: "0px 10px",
            "padding-top": "10px"
        }).appendTo(sliderPanelHeader);
        $("<label>").text(designer.res.shapeSliderPanel.formatShape).css({
            "font-size": "17pt",
            "font-weight": "lighter",
            color: "#08892c"
        }).appendTo(mainHeader);
        $("<span>").addClass('slider-panel-close-button').appendTo(mainHeader).click(closeSlidePanel);
    }

    function initSliderPanelContent(sliderPanelContainer, dataManager, updateSlideCallBack) {
        var sliderPanelContent = $("<div>").css({
            "width": "100%",
            "position": "absolute",
            "top": "40px",
            "bottom": "0"
        }).addClass("slider-panel-content").appendTo(sliderPanelContainer);
        return new ShapePanelContainer(sliderPanelContent, dataManager, updateSlideCallBack); // NOSONAR
    }

    function updateSliderPanelUI(sliderPanel, dataManager) {
        sliderPanel.sliderpanel();
        var sliderPanelContainer = sliderPanel.sliderpanel("getContainer", "panel2");
        sliderPanelContainer.children().remove();
        initSliderPanelHeader(sliderPanelContainer);
        initSliderPanelContent(sliderPanelContainer, dataManager, function () {
            updateSliderPanelUI(sliderPanel, dataManager);
        });
    }

    //#region sliderPanel DataManager
    function SliderPanelDataManager(shapes) {
        this._shape = shapes;
        this._selectedElement = shapeSliderPanelElement.SHAPEOPTIONS;
        this.makeShapeData(shapes);
    }

    SliderPanelDataManager.prototype.getDatas = function () {
        var datas = [];
        var selectedData = this._data[this._selectedElement];
        for (var i in selectedData) { /* NOSONAR: Forin*/
            var data = { name: selectedData[i].name, type: selectedData[i].type, properties: [] };
            for (var j in selectedData[i]) {
                if (j !== 'type' && j !== 'name') {
                    selectedData[i][j].forEach(function (elementData) {
                        var property = {};
                        for (var k in elementData) {    //NOSONAR
                            property.aggregate = k;
                            var editors = property.editors = [];
                            elementData[k].forEach(function (subElementData) {
                                editors.push({
                                    name: subElementData.name,
                                    data: subElementData.data,
                                    type: subElementData.type,
                                    resources: subElementData.resources
                                });
                            });
                        }
                        data.properties.push(property);
                    });
                }
            }
            datas.push(data);
        }
        return datas;
    };
    SliderPanelDataManager.prototype.updateData = function (namePath, dataPath, pathName, value) {
        var selectedElement = this._selectedElement;
        var datas = this._data;
        var data = datas[selectedElement];
        var names = pathName.split('.');
        var self = this;
        var spread = designer.wrapper.spread;
        var shapes = self._shape;
        var result, option, property;
        var j, names1, names2;
        var appointedShape;
        property = names[names.length - 1];
        option = {
            selectShape: shapes,
        };
        switch (property) {
            case 'width':
            case 'height':
            case 'angle':
            case 'locked':
            case 'printObject':
            case 'moveSizeRelationship':
                option[property] = value;
                option.ignoreEvent = true;
                designer.actions.doAction('changeShapeSizeAndProperties', spread, option);
                appointedShape = getAppointedShape(shapes, ['Shape']);
                var newOption = {
                    width: shapes[0].width(),
                    height: shapes[0].height(),
                    angle: appointedShape && appointedShape.rotate(),
                    locked: shapes[0].isLocked(),
                    printObject: shapes[0].canPrint(),
                };
                if (shapes[0].dynamicMove() && shapes[0].dynamicSize()) {
                    newOption.moveSizeRelationship = 0;
                }
                if (shapes[0].dynamicMove() && !shapes[0].dynamicSize()) {
                    newOption.moveSizeRelationship = 1;
                }
                if (!shapes[0].dynamicMove() && !shapes[0].dynamicSize()) {
                    newOption.moveSizeRelationship = 2;
                }
                value = newOption[property];
                break;
            case 'backgroundTransparency':
            case 'backgroundColor':
                if (property === 'backgroundColor') {
                    property = 'color';
                }
                if (property === 'backgroundTransparency') {
                    property = 'transparency';
                }
                option.style = { fill: {} };
                option.style.fill[property] = value;
                option.ignoreEvent = true;
                designer.actions.doAction('changeShapeStyle', spread, option);
                appointedShape = getAppointedShape(shapes, ['Shape']);
                value = appointedShape && appointedShape.style().fill[property];
                break;
            case 'borderTransparency':
            case 'borderColor':
            case 'borderWidth':
            case 'dashType':
            case 'joinType':
            case 'capType':
                if (property === 'borderColor') {
                    property = 'color';
                }
                if (property === 'borderWidth') {
                    property = 'width';
                }
                if (property === 'dashType') {
                    property = 'lineStyle';
                }
                if (property === 'borderTransparency') {
                    property = 'transparency';
                }
                option.style = { line: {} };
                option.style.line[property] = value;
                option.ignoreEvent = true;
                designer.actions.doAction('changeShapeStyle', spread, option);
                appointedShape = getAppointedShape(shapes, ['Shape', 'ConnectorShape']);
                var lineStyle = appointedShape && appointedShape.style().line;
                var borderOption = {
                    color: lineStyle.color,
                    transparency: lineStyle.transparency,
                    width: lineStyle.width,
                    lineStyle: lineStyle.lineStyle,
                    joinType: lineStyle.joinType,
                    capType: lineStyle.capType,
                };
                value = borderOption[property];
                break;
            case 'beginArrowheadStyle':
            case 'endArrowheadStyle':
                option.style = { line: {} };
                option.style.line[property] = value;
                option.ignoreEvent = true;
                designer.actions.doAction('changeShapeStyle', spread, option);
                appointedShape = getAppointedShape(shapes, ['ConnectorShape']);
                value = appointedShape && appointedShape.style().line[property];
                break;
            case 'beginArrowheadSize':
                option.style = { line: {} };
                option.style.line.beginArrowheadWidth = value.width;
                option.style.line.beginArrowheadLength = value.height;
                option.ignoreEvent = true;
                designer.actions.doAction('changeShapeStyle', spread, option);
                appointedShape = getAppointedShape(shapes, ['ConnectorShape']);
                value = appointedShape && String(appointedShape.style().line.beginArrowheadWidth) + String(appointedShape.style().line.beginArrowheadLength);
                break;
            case 'endArrowheadSize':
                option.style = { line: {} };
                option.style.line.endArrowheadWidth = value.width;
                option.style.line.endArrowheadLength = value.height;
                option.ignoreEvent = true;
                designer.actions.doAction('changeShapeStyle', spread, option);
                appointedShape = getAppointedShape(shapes, ['ConnectorShape']);
                value = appointedShape && String(appointedShape.style().line.endArrowheadWidth) + String(appointedShape.style().line.endArrowheadLength);
                break;
            case 'fontColor':
            case 'textTransparency':
            case 'fontSize':
            case 'fontFamily':
            case 'fontStyle':
            case 'fontWeight':
                appointedShape = getAppointedShape(shapes, ['Shape']);
                option.style = { textEffect: {} };
                if (property === 'fontColor') {
                    property = 'color';
                }
                if (property === 'textTransparency') {
                    property = 'transparency';
                }
                if (property === 'fontWeight' || property === 'fontSize' || property === 'fontFamily' || property === 'fontStyle') {
                    var fontStyles = appointedShape.style().textEffect.font;
                    var span = document.createElement('span');
                    span.style.font = fontStyles;
                    var cssStyle = span.style;
                    if (property === 'fontSize') {
                        cssStyle.fontSize = value + 'px';
                    }
                    if (property === 'fontFamily') {
                        cssStyle.fontFamily = value;
                    }
                    if (property === 'fontWeight') {
                        cssStyle.fontWeight = value;
                    }
                    if (property === 'fontStyle') {
                        cssStyle.fontStyle = value;
                    }
                    var fontValue = cssStyle.fontStyle + ' ' + cssStyle.fontWeight + ' ' + cssStyle.fontSize + ' ' + cssStyle.fontFamily;
                    option.style.textEffect.font = fontValue;
                } else {
                    option.style.textEffect[property] = value;
                }
                option.ignoreEvent = true;
                designer.actions.doAction('changeShapeStyle', spread, option);
                var fontOption = {
                    color: appointedShape && appointedShape.style().textEffect.color,
                    transparency: appointedShape && appointedShape.style().textEffect.transparency,
                    fontSize: appointedShape && parseInt(creatFontStyleObj(appointedShape.style().textEffect.font).fontSize),
                    fontFamily: appointedShape && creatFontStyleObj(appointedShape.style().textEffect.font).fontFamily,
                    fontStyle: appointedShape && creatFontStyleObj(appointedShape.style().textEffect.font).fontStyle,
                    fontWeight: appointedShape && creatFontStyleObj(appointedShape.style().textEffect.font).fontWeight
                };
                value = fontOption[property];
                break;
            case 'text':
                appointedShape = getAppointedShape(shapes, ['Shape']);
                option[property] = value;
                designer.actions.doAction('setShapeText', spread, option);
                value = appointedShape && appointedShape.text();
                break;
            case 'vAlign':
            case 'hAlign':
                appointedShape = getAppointedShape(shapes, ['Shape']);
                option.style = { textFrame: {} };
                option.style.textFrame[property] = parseInt(value);
                option.ignoreEvent = true;
                designer.actions.doAction('changeShapeStyle', spread, option);
                var textAlign = {
                    vAlign: appointedShape && appointedShape.style().textFrame.vAlign,
                    hAlign: appointedShape && appointedShape.style().textFrame.hAlign,
                };
                value = textAlign[property];
                break;
        }
        names1 = namePath.replace(/&/, "and").split(' ').join('').toLowerCase();
        data = data[names1];
        names2 = dataPath;
        for (j = 0; j < names2.length;) {
            data = data[names2[j]][names2[j + 1]];
            j += 2;
        }
        for (j = 0; j < names.length - 1; j++) {
            data = data[names[j]];
        }
        result = data[property] = value;
        return result;
    };
    SliderPanelDataManager.prototype.makeShapeData = function (shapes) {
        var self = this, fillAndLineData, sizeData, textFillData, textBoxData;
        var data = { shapeOptions: {}, textOptions: {} };
        self._shape = shapes;
        fillAndLineData = self.getFillAndLineData(shapes);
        if (!isNullOrUndefined(fillAndLineData) && !_isEmptyObject(fillAndLineData)) {
            data.shapeOptions.fillandline = fillAndLineData;
        }
        sizeData = self.getSizeData(shapes);
        if (!isNullOrUndefined(sizeData) && !_isEmptyObject(sizeData)) {
            data.shapeOptions.size = sizeData;
        }
        if (isHasAppointedShapeType(shapes, 'autoShapeType')) {
            textFillData = self.getTextFillData(shapes);
            if (!isNullOrUndefined(textFillData) && !_isEmptyObject(textFillData)) {
                data.textOptions.textfill = textFillData;
            }
            textBoxData = self.getTextBoxData(shapes);
            if (!isNullOrUndefined(textBoxData) && !_isEmptyObject(textBoxData)) {
                data.textOptions.textbox = textBoxData;
            }
        }

        self._data = data;
    };
    SliderPanelDataManager.prototype.getPropertyData = function (shapes, property) {
        var valueCollection = [], groupShape;
        for (var i = 0; i < shapes.length; i++) {
            if (getShapeType(shapes[i]) === 'groupShapeType') {
                if (property === 'shapeWidth') {
                    valueCollection.push(shapes[i].width());
                    continue;
                }
                if (property === 'shapeHeight') {
                    valueCollection.push(shapes[i].height());
                    continue;
                }
                if (property === 'rotate') {
                    valueCollection.push(shapes[i].rotate());
                    continue;
                }
                groupShape = this.getPropertyData(shapes[i].all(), property);
                valueCollection.push(groupShape);
            } else {
                var style = shapes[i].style();
                switch (property) {
                    case 'backgroundColor':
                        valueCollection.push(style.fill && style.fill.color);
                        break;
                    case 'backgroundTransparency':
                        valueCollection.push(style.fill && style.fill.transparency);
                        break;
                    case 'borderColor':
                        valueCollection.push(style.line.color);
                        break;
                    case 'borderTransparency':
                        valueCollection.push(style.line.transparency);
                        break;
                    case 'borderWidth':
                        valueCollection.push(style.line.width);
                        break;
                    case 'dashType':
                        valueCollection.push(style.line.lineStyle);
                        break;
                    case 'capType':
                        valueCollection.push(style.line.capType);
                        break;
                    case 'joinType':
                        valueCollection.push(style.line.joinType);
                        break;
                    case 'beginArrowheadStyle':
                        valueCollection.push(style.line.beginArrowheadStyle);
                        break;
                    case 'beginArrowheadSize':
                        if (!isNullOrUndefined(style.line.beginArrowheadWidth) && !isNullOrUndefined(style.line.beginArrowheadLength)) {
                            valueCollection.push(String(style.line.beginArrowheadWidth) + String(style.line.beginArrowheadLength));
                        }
                        break;
                    case 'endArrowheadStyle':
                        valueCollection.push(style.line.endArrowheadStyle);
                        break;
                    case 'endArrowheadSize':
                        if (!isNullOrUndefined(style.line.endArrowheadWidth) && !isNullOrUndefined(style.line.endArrowheadLength)) {
                            valueCollection.push(String(style.line.endArrowheadWidth) + String(style.line.endArrowheadLength));
                        }
                        break;
                    case 'shapeWidth':
                        valueCollection.push(shapes[i].width());
                        break;
                    case 'shapeHeight':
                        valueCollection.push(shapes[i].height());
                        break;
                    case 'rotate':
                        valueCollection.push(shapes[i].rotate && shapes[i].rotate());
                        break;
                    case 'printObject':
                        valueCollection.push(shapes[i].canPrint());
                        break;
                    case 'locked':
                        valueCollection.push(shapes[i].isLocked());
                        break;
                    case 'moveSizeRelationship':
                        var moveSizeRelationshipValue;
                        if (shapes[i].dynamicMove() && shapes[i].dynamicSize()) {
                            moveSizeRelationshipValue = 0;
                        }
                        if (shapes[i].dynamicMove() && !shapes[i].dynamicSize()) {
                            moveSizeRelationshipValue = 1;
                        }
                        if (!shapes[i].dynamicMove() && !shapes[i].dynamicSize()) {
                            moveSizeRelationshipValue = 2;
                        }
                        valueCollection.push(moveSizeRelationshipValue);
                        break;
                    case 'text':
                        valueCollection.push(shapes[i].text && shapes[i].text());
                        break;
                    case 'fontColor':
                        valueCollection.push(style.textEffect && style.textEffect.color);
                        break;
                    case 'textTransparency':
                        valueCollection.push(style.textEffect && style.textEffect.transparency);
                        break;
                    case 'fontSize':
                        valueCollection.push(parseInt(style.textEffect && creatFontStyleObj(style.textEffect.font).fontSize));
                        break;
                    case 'fontFamily':
                        valueCollection.push(style.textEffect && creatFontStyleObj(style.textEffect.font).fontFamily);
                        break;
                    case 'fontStyle':
                        valueCollection.push(style.textEffect && creatFontStyleObj(style.textEffect.font).fontStyle);
                        break;
                    case 'fontWeight':
                        valueCollection.push(style.textEffect && creatFontStyleObj(style.textEffect.font).fontWeight);
                        break;
                    case 'hAlign':
                        valueCollection.push(style.textFrame && style.textFrame.hAlign);
                        break;
                    case 'vAlign':
                        valueCollection.push(style.textFrame && style.textFrame.vAlign);
                        break;
                }
            }
        }
        return getDataInValueArray(valueCollection);
    };
    SliderPanelDataManager.prototype.getFillAndLineData = function (shapes) {
        var data = {
            name: designer.res.shapeSliderPanel.fillAndLine,
            type: 'fillandline',
            content: [{ Fill: [] }, { Line: [] }],
        };
        var filldata = {
            name: designer.res.shapeSliderPanel.fill,
            data: {
                backgroundColor: this.getPropertyData(shapes, 'backgroundColor'),
                backgroundTransparency: this.getPropertyData(shapes, 'backgroundTransparency')
            },
            type: 'fill',
            resources: {
                noColorText: designer.res.shapeSliderPanel.noFill,
                solidColorText: designer.res.shapeSliderPanel.solidFill
            }
        };
        var lineData = {
            name: designer.res.shapeSliderPanel.line,
            data: {
                borderColor: this.getPropertyData(shapes, 'borderColor'),
                borderTransparency: this.getPropertyData(shapes, 'borderTransparency'),
                borderWidth: this.getPropertyData(shapes, 'borderWidth'),
                dashType: this.getPropertyData(shapes, 'dashType'),
                capType: this.getPropertyData(shapes, 'capType'),
                joinType: this.getPropertyData(shapes, 'joinType'),
                beginArrowheadStyle: this.getPropertyData(shapes, 'beginArrowheadStyle'),
                beginArrowheadSize: this.getPropertyData(shapes, 'beginArrowheadSize'),
                endArrowheadStyle: this.getPropertyData(shapes, 'endArrowheadStyle'),
                endArrowheadSize: this.getPropertyData(shapes, 'endArrowheadSize'),

            },
            type: 'line',
            resources: {
                noColorText: designer.res.shapeSliderPanel.noLine,
                solidColorText: designer.res.shapeSliderPanel.solidLine,
                widthText: designer.res.shapeSliderPanel.width,
                dashTypeText: designer.res.shapeSliderPanel.dashType,
                capTypeText: designer.res.shapeSliderPanel.capType,
                joinTypeText: designer.res.shapeSliderPanel.joinType,
                beginArrowTypeText: designer.res.shapeSliderPanel.beginArrowType,
                beginArrowSizeText: designer.res.shapeSliderPanel.beginArrowSize,
                endArrowTypeText: designer.res.shapeSliderPanel.endArrowType,
                endArrowSizeText: designer.res.shapeSliderPanel.endArrowSize,
            }
        };
        data.content[0].Fill.push(filldata);
        data.content[1].Line.push(lineData);
        return data;

    };
    SliderPanelDataManager.prototype.getSizeData = function (shapes) {
        var data = {
            name: designer.res.shapeSliderPanel.size,
            type: "size",
            content: [{ Size: [] }, { Properties: [] }],
        };
        var sizeData = {
            name: designer.res.shapeSliderPanel.size,
            data: {
                width: this.getPropertyData(shapes, 'shapeWidth'),
                height: this.getPropertyData(shapes, 'shapeHeight'),
                angle: this.getPropertyData(shapes, 'rotate'),
            },
            type: 'size',
            resources: {
                widthText: designer.res.shapeSliderPanel.width,
                heightText: designer.res.shapeSliderPanel.height,
                rotateText: designer.res.shapeSliderPanel.rotation,
            }
        };
        var propertiesData = {
            name: designer.res.shapeSliderPanel.properties,
            data: {
                printObject: this.getPropertyData(shapes, 'printObject'),
                locked: this.getPropertyData(shapes, 'locked'),
                moveSizeRelationship: this.getPropertyData(shapes, 'moveSizeRelationship'),
            },
            type: 'properties',
            resources: {
                printObject: designer.res.shapeSliderPanel.printObject,
                locked: designer.res.shapeSliderPanel.locked,
                moveSizeWithCells: designer.res.shapeSliderPanel.moveSizeWithCells,
                moveNoSizeWithCells: designer.res.shapeSliderPanel.moveNoSizeWithCells,
                noMoveNoSizeWithCells: designer.res.shapeSliderPanel.noMoveNoSizeWithCells,
            }
        };
        data.content[0].Size.push(sizeData);
        data.content[1].Properties.push(propertiesData);
        return data;
    };
    SliderPanelDataManager.prototype.getTextFillData = function (shapes) {
        var data = {
            name: designer.res.shapeSliderPanel.textFill,
            type: 'textfill',
            content: [{ TextEditor: [] }, { TextFill: [] }],
        };
        var textEditorData = {
            name: designer.res.shapeSliderPanel.textEditor,
            data: {
                text: this.getPropertyData(shapes, 'text'),
            },
            type: 'textEditor',
            resources: {
                text: designer.res.shapeSliderPanel.text,
            }
        };
        var textFillData = {
            name: designer.res.shapeSliderPanel.textFill,
            data: {
                fontColor: this.getPropertyData(shapes, 'fontColor'),
                textTransparency: this.getPropertyData(shapes, 'textTransparency'),
                fontSize: this.getPropertyData(shapes, 'fontSize'),
                fontFamily: this.getPropertyData(shapes, 'fontFamily'),
                fontStyle: this.getPropertyData(shapes, 'fontStyle'),
                fontWeight: this.getPropertyData(shapes, 'fontWeight'),
            },
            type: 'textFill',
            resources: {
                noColorText: designer.res.shapeSliderPanel.noFill,
                solidColorText: designer.res.shapeSliderPanel.solidFill,
                fontColor: designer.res.shapeSliderPanel.color,
                textTransparency: designer.res.shapeSliderPanel.transparency,
                fontSize: designer.res.shapeSliderPanel.fontSize,
                fontFamily: designer.res.shapeSliderPanel.fontFamily,
                fontStyle: designer.res.shapeSliderPanel.fontStyle,
                fontWeight: designer.res.shapeSliderPanel.fontWeight,
            }
        };
        data.content[0].TextEditor.push(textEditorData);
        data.content[1].TextFill.push(textFillData);
        return data;
    };
    SliderPanelDataManager.prototype.getTextBoxData = function (shapes) {
        var data = {
            name: designer.res.shapeSliderPanel.textbox,
            type: 'textbox',
            content: [{ TextBox: [] }],
        };
        var sizeData = {
            name: designer.res.shapeSliderPanel.textbox,
            data: {
                vAlign: this.getPropertyData(shapes, 'vAlign'),
                hAlign: this.getPropertyData(shapes, 'hAlign'),
            },
            type: 'textBox',
            resources: {
                vAlignText: designer.res.shapeSliderPanel.vAlign,
                hAlignText: designer.res.shapeSliderPanel.hAlign,
            }
        };
        data.content[0].TextBox.push(sizeData);
        return data;
    };

    //#endregion sliderPanel DataManager

    var SlidePanel = {
        sliderPanelDataManager: {},
        initShapeSliderPanel: function (shapes) {
            var sliderPanel = $(".slider-panel");
            SlidePanel.sliderPanelDataManager = new SliderPanelDataManager(shapes);
            updateSliderPanelUI(sliderPanel, SlidePanel.sliderPanelDataManager);
            sliderPanel.sliderpanel("open", "panel2");
        },
        refreshSliderPanel: function (shapes) {
            var sliderPanelDataManager = SlidePanel.sliderPanelDataManager;
            var sliderPanel = $(".slider-panel");
            if (_isEmptyObject(sliderPanelDataManager) || !(sliderPanel.is(':visible'))) {
                return;
            }
            sliderPanelDataManager._selectedElement = shapeSliderPanelElement.SHAPEOPTIONS;
            sliderPanelDataManager.makeShapeData(shapes);
            updateSliderPanelUI(sliderPanel, sliderPanelDataManager);
        }
    };
    designer.shapeSliderPanel = SlidePanel;
})();
