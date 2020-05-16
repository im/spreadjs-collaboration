(function () {
    'use strict';

    var designer = GC.Spread.Sheets.Designer;

    function isNullOrUndefined(value) {
        return value === undefined || value === null;
    }
    function setShapeWidthAndHeight(container, title, valueChangedCallback, option) {
        this.valueChanged = valueChangedCallback;
        this.descString = (option && option.descString) || '';
        this.maxValue = (option && option.max) || Number.MAX_VALUE;
        this.minValue = (option && option.min) || -Number.MAX_VALUE;
        this.domInput = this.addInputNumberEditor(title);
        container.append(this.domInput);
    }

    setShapeWidthAndHeight.prototype.addInputNumberEditor = function (title) {
        var self = this;
        this.value = 0;
        var span = $('<span></span>').addClass('ui-spinner ui-widget ui-widget-content ui-corner-all ').css({
            "width": "65px",
            "float": "right",
            "margin-right": "3px",
            "height": "23px"
        });
        var input = $('<input />', { type: 'input' }).addClass('label-top-padding numeric column1 ui-spinner-input').css({
            "position": "absolute",
            "left": "1px",
            "top": "1px",
            "width": "50px"
        }).val(self.value + self.descString).change(function () {
            var value = parseFloat($(input).val());
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

        var label = $('<label></label>').addClass('gcui-ribbon-size-' + title.toLowerCase()).css({ "margin-right": "8px" }).text(title);
        return $('<div></div>').append(label).append(span).css({
            "list-style-type": "none",
            "line-height": "25px",
            "margin-bottom": "5px"
        });
    };
    setShapeWidthAndHeight.prototype.adjustValue = function (value) {
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
    setShapeWidthAndHeight.prototype.updateValue = function () {
        if (this.value === undefined || isNaN(this.value)) {
            $('input', this.domInput).val('');
        } else {
            this.value = Math.round(this.value);
            $('input', this.domInput).val(this.value + this.descString);
        }
    };
    designer.setShapeWidthAndHeight = setShapeWidthAndHeight;
}());