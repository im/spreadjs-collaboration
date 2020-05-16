(function () {
    'use strict';

    var designer = GC.Spread.Sheets.Designer;
    var ComboFrame = (function (_super) {
        designer.extends(ComboFrame, _super);
        function ComboFrame() {
            _super.apply(this, arguments);
        }

        ComboFrame.prototype._create = function () {
            var self = this;
            this._id = ComboFrame._currentId++;
            this.element.addClass('gcui-comboframe').addClass('ui-state-default');

            var content = $(this.element.children()[0]).addClass('gcui-comboframe-content');

            this._popup = $(this.element.children()[1]).addClass('gcui-comboframe-dropdown');
            this._popup.gcuipopup({
                autoHide: true,
                ensureOutermost: true,
                hidden: function () {
                    self.element.removeClass('ui-state-active');
                    self._button.removeClass('ui-state-active');
                }
            });

            this._button = $('<button></button>').addClass('gcui-comboframe-button').appendTo(this.element).button({
                icons: {
                    secondary: "ui-icon-triangle-1-s"
                }
            });

            this.element.on('mouseenter.gcui-comboframe', function () {
                self.element.addClass('ui-state-hover');
            }).on('mouseleave.gcui-comboframe', function () {
                self.element.removeClass('ui-state-hover');
            });
            this._button.on('click.gcui-comboframe', function () {
                self._button.addClass('ui-state-active');
                self.open();
            });
            content.on('focus.gcui-comboframe', function () {
                self.element.addClass('ui-state-focus');
            }).on('blur.gcui-comboframe', function () {
                self.element.removeClass('ui-state-focus');
            });
        };

        ComboFrame.prototype.open = function () {
            this._popup.gcuipopup('show', {
                of: this.element,
                my: 'left top',
                at: 'left bottom'
            });
            this.element.addClass('ui-state-active');
        };
        ComboFrame.prototype.close = function () {
            this._popup.gcuipopup('hide');
        };
        ComboFrame.widgetName = "comboframe";
        ComboFrame.defaultOptions = {};

        ComboFrame._currentId = 0;
        return ComboFrame;
    })(designer.gcui.gcuiWidget);
    designer.ComboFrame = ComboFrame;

    ComboFrame.prototype.options = $.extend(true, {}, designer.gcui.gcuiWidget.prototype.options, ComboFrame.defaultOptions);
    $.gcui.registerWidget(ComboFrame.widgetName, ComboFrame.prototype);

})();