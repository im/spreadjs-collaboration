(function () {
    'use strict';

    var designer = GC.Spread.Sheets.Designer;
    designer.spreadMeta = {
        style: {
            properties: {
                formatter: {
                    type: designer.PrimitiveTypes.STRING
                },
                backColor: {
                    type: designer.PrimitiveTypes.STRING
                },
                foreColor: {
                    type: designer.PrimitiveTypes.STRING
                },
                font: {
                    type: designer.PrimitiveTypes.STRING
                },
                hAlign: {
                    type: designer.PrimitiveTypes.NUMBER,
                    defaultValue: 3 /* general */
                },
                vAlign: {
                    type: designer.PrimitiveTypes.NUMBER,
                    defaultValue: 1 /* center */
                },
                textIndent: {
                    type: designer.PrimitiveTypes.NUMBER,
                    defaultValue: 0
                },
                textOrientation: {
                    type: designer.PrimitiveTypes.NUMBER,
                    defaultValue: 0
                },
                wordWrap: {
                    type: designer.PrimitiveTypes.BOOLEAN,
                    defaultValue: false
                },
                shrinkToFit: {
                    type: designer.PrimitiveTypes.BOOLEAN,
                    defaultValue: false
                },
                isVerticalText: {
                    type: designer.PrimitiveTypes.BOOLEAN,
                    defaultValue: false
                },
                locked: {
                    type: designer.PrimitiveTypes.BOOLEAN,
                    defaultValue: true
                },
                borderTop: {
                    type: designer.PrimitiveTypes.OBJECT
                },
                borderLeft: {
                    type: designer.PrimitiveTypes.OBJECT
                },
                borderRight: {
                    type: designer.PrimitiveTypes.OBJECT
                },
                borderBottom: {
                    type: designer.PrimitiveTypes.OBJECT
                },
                borderVertical: {
                    type: designer.PrimitiveTypes.OBJECT
                },
                borderHorizontal: {
                    type: designer.PrimitiveTypes.OBJECT
                },
                diagonalUp: {
                    type: designer.PrimitiveTypes.OBJECT
                },
                diagonalDown: {
                    type: designer.PrimitiveTypes.OBJECT
                },
                textDecoration: {
                    type: designer.PrimitiveTypes.NUMBER,
                    defaultValue: true
                },
                watermark: {
                    type: designer.PrimitiveTypes.STRING
                },
                cellPadding: {
                    type: designer.PrimitiveTypes.STRING
                },
                labelOptions: {
                    type: designer.PrimitiveTypes.OBJECT
                },
                cellButtons: {
                    type: designer.PrimitiveTypes.OBJECT
                },
                dropDowns: {
                    type: designer.PrimitiveTypes.OBJECT
                },
            }
        }
    };
    var Sheets = GC.Spread.Sheets;

    var StyleShadowObjectBase = (function (_super) {
        designer.extends(StyleShadowObjectBase, _super);
        function StyleShadowObjectBase(source) {
            _super.call(this, source, designer.spreadMeta.style, designer.spreadMeta);
            this._values = {};
        }

        StyleShadowObjectBase.prototype._genProperty = function (propName) {
            var self = this;
            var propMeta = this._meta.properties[propName];
            return ko.computed({
                read: function () {
                    var value = self._values[propName];
                    if (value === undefined) {
                        this._values[propName] = self._getValue(propName);
                        return this._values[propName];
                    } else if (value === designer.BaseMetaObject.undefinedValue) {
                        return undefined;
                    } else {
                        return value;
                    }
                },
                write: function (newValue) {
                    var value = newValue;
                    if (value === undefined) {
                        value = designer.BaseMetaObject.undefinedValue;
                    } else if (typeof value !== propMeta.type) {
                        value = designer.BaseMetaObject._convert(value, propMeta.type);
                    }
                    self._values[propName] = value;
                },
                owner: this
            });
        };
        StyleShadowObjectBase.prototype.result = function () {
            var self = this;
            var style = new Sheets.Style();
            function isIndeterminateValue(propName, value) {
                if (propName === 'cellPadding' && value.indexOf('*') !== -1) {
                    return true;
                }
                if (propName === 'watermark' && value === '') {
                    return true;
                }
                return false;
            }
            Object.getOwnPropertyNames(this._values).forEach(function (propName) {
                var value = self._values[propName];
                if (value !== undefined && value !== designer.BaseMetaObject.indeterminateValue && !isIndeterminateValue(propName, value)) {
                    if (value === designer.BaseMetaObject.undefinedValue) {
                        value = void 0;
                    }

                    style[propName] = value;
                }
            });

            return style;
        };
        StyleShadowObjectBase.prototype._getValue = function (propName) { };
        return StyleShadowObjectBase;
    })(designer.BaseMetaObject);
    designer.StyleShadowObjectBase = StyleShadowObjectBase;
    var StyleShadowObject = (function (_super) {
        designer.extends(StyleShadowObject, _super);
        function StyleShadowObject(style) {
            _super.call(this, style);
            this._style = style;
            this._genProperties();
        }

        StyleShadowObject.prototype._getValue = function (propName) {
            if (this._style === undefined || this._style === null) {
                return undefined;
            }
            return this._style[propName];
        };
        return StyleShadowObject;
    })(StyleShadowObjectBase);
    designer.StyleShadowObject = StyleShadowObject;

    var SpreadStyleShadowObject = (function (_super) {
        designer.extends(SpreadStyleShadowObject, _super);
        function SpreadStyleShadowObject(spread, ranges) {
            _super.call(this, spread);
            this._sheet = spread.getActiveSheet();
            if (ranges === undefined) {
                ranges = this._sheet.getSelections();
            }
            this._ranges = ranges;
            this._genProperties();
        }

        SpreadStyleShadowObject.prototype._getValue = function (propName) {
            var value = designer.BaseMetaObject.undefinedValue;
            for (var k = 0; k < this._ranges.length; k++) {
                var selection = this._ranges[k];

                // Adjust range for whole rows / columns / sheet selection
                if (selection.col === -1) {
                    selection.col = 0;
                }
                if (selection.row === -1) {
                    selection.row = 0;
                }

                for (var i = 0; i < selection.rowCount; i++) {
                    for (var j = 0; j < selection.colCount; j++) {
                        var v = this._getValueCore(selection.row + i, selection.col + j, propName);
                        if (value === designer.BaseMetaObject.undefinedValue) {
                            value = v;
                        } else if (JSON.stringify(value) !== JSON.stringify(v)) {
                            return designer.BaseMetaObject.indeterminateValue;
                        }
                    }
                }
            }
            return value;
        };
        SpreadStyleShadowObject.prototype._getValueCore = function (row, col, propName) {
            // Fixed bug 152190 (Cells with conditional formatting applied always remain locked even on unlocking), delete rule' style.locked if present
            function adjustConditionalFormatRuleStyle(sheet) {
                if (propName === 'locked') {
                    //var rules = sheet.getConditionalFormats().getRules(row, col);
                    var cfs = sheet.conditionalFormats;
                    var rules = cfs.getRules(row, col);
                    rules.forEach(function (rule) {
                        if (rule.style.locked !== undefined) {
                            delete rule.style.locked;
                        }
                    });
                }
            }

            adjustConditionalFormatRuleStyle(this._sheet);
            var style = this._sheet.getActualStyle(row, col, undefined, undefined, undefined, true);
            if (style === undefined || style === null) {
                return undefined;
            }
            if (propName === 'font' && style['font']) {
                var defaultFont = designer.util.getFromCache("defaultFont", function () {
                    return designer.util.parseFont(designer.res.defaultFont);
                });
                var f = designer.util.parseFont(style['font']);
                if (f.fontFamily === defaultFont.fontFamily && f.fontSize === defaultFont.fontSize && f.fontStyle === defaultFont.fontStyle && f.fontWeight === defaultFont.fontWeight) {
                    return undefined;
                }
            }
            if (propName === 'foreColor' && style['foreColor'] === 'Text 1') {
                return undefined;
            }

            return style[propName];
        };
        return SpreadStyleShadowObject;
    })(StyleShadowObjectBase);
    designer.SpreadStyleShadowObject = SpreadStyleShadowObject;
})();