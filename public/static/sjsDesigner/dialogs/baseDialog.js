(function () {
    'use strict';

    var designer = GC.Spread.Sheets.Designer;
    var DefaultDialogViewModel = (function () {
        function DefaultDialogViewModel() {
            this.res = designer.res;
        }

        DefaultDialogViewModel.Instance = new DefaultDialogViewModel();
        return DefaultDialogViewModel;
    })();
    var BaseDialog = (function () {
        function BaseDialog(url, selector) {
            this._options = this._initOptions();
            if (this._options.autoOpen) {
                throw "AutoOpen is not support.";
            }
            this.updateOptions();

            this._element = $('<div></div>');
            if (url !== undefined) {
                this._element.load(url + ' ' + selector, this.onLoad.bind(this));
            } else {
                this._isReady = true;
            }
        }

        BaseDialog.prototype._initOptions = function () {
            //The derived dialog must overwrite this function to provide options.
            return null;
        };

        BaseDialog.prototype.open = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            if (this._isShown) {
                return;
            }

            this._openArgs = args;

            this._isShown = true;
            if (this._isReady) {
                this.openReally();
            }
        };
        BaseDialog.prototype.close = function () {
            if (!this._isShown) {
                return;
            }

            this._isShown = false;
            if (this._isReady) {
                this._element.dialog('close');
            }
        };
        BaseDialog.prototype.destroy = function () {
            if (this._isReady) {
                this._element.dialog('destroy');
            }
        };

        /**
         * Calling before the dialog open.
         *
         * @overridable
         */
        BaseDialog.prototype._beforeOpen = function (args) {  // NOSONAR  unusedArguments
        };

        /**
         * Calling after the dialog closed.
         *
         * You can use it to do some clear actions after the dialog close.
         *
         * @overridable
         */
        BaseDialog.prototype._afterClose = function () {
        };

        /**
         * Create and initialize viewModel that is used by Knockout to binding into html page.
         *
         * @returns An object that is the binding context for current page. By default, it return
         * a instance that include a 'res' reference to global resource object.
         *
         * @overrideable
         */
        BaseDialog.prototype._createViewModel = function () {
            return DefaultDialogViewModel.Instance;
        };

        /**
         * Calling before the first time dialog showing.
         *
         * The _element variable was be initialized, and the content is loaded if you set
         * 'url' parameter in constructor.
         *
         * You can override this method to initialize the _element
         */
        BaseDialog.prototype._init = function () {
        };

        BaseDialog.prototype.openReally = function () {
            if (!this._isInited) {
                this.onInit();
            }
            this._beforeOpen.call(this, this._openArgs);
            this._element.dialog('open');
        };
        BaseDialog.prototype.onLoad = function () {
            this._isReady = true;
            if (this._isShown) {
                this.openReally();
            }
        };
        BaseDialog.prototype.onInit = function () {
            var self = this;
            this._isInited = true;
            this._viewModel = this._createViewModel();
            this._element.dialog(this._options);
            this._parent = this._element.parent();
            this._init();
            if (this._viewModel !== undefined) {
                //                setTimeout(function() {
                // For an unknown reason, if we call KO directly after
                // init, some events attached in _init method will be
                // lost.
                // So, I delay applyBinding.
                ko.applyBindings(self._viewModel, self._element[0]);
                //                }, 0);
            }

            if (!this._options.preventDefaultOkButton) {
                this._element.parent().on('keypress', function (e) {
                    if (e.keyCode === 13) {
                        var isButtonFocus = self._element.parent().find("button:focus").length > 0;
                        var buttonElement = self._element.parent().find("button[dialogToBeFocused='true']");
                        if (!isButtonFocus) {
                            var defaultButton = self._getDefaultButton();
                            if (defaultButton && defaultButton.click && !buttonElement.is(":focus")) {
                                defaultButton.click.call(self);
                            }
                        }
                    }
                });
            }

            this._element.dialog({
                open: function () {
                    self._element.parent().trigger("mousedown");
                    self._element.parent().find("button[dialogToBeFocused='true']").focus();
                }
            });
        };
        BaseDialog.prototype._getDefaultButton = function () {
            var self = this;
            var buttons = self._options.buttons;
            for (var i = 0; i < buttons.length; i++) {
                var button = buttons[i];
                if (button.isDefault) {
                    return button;
                }
            }
            return buttons[0];
        };
        BaseDialog.prototype.onClose = function (event, ui) {
            this._isShown = false;
            if (this._closeCallback !== undefined) {
                this._closeCallback.call(this._element, event, ui);
            }
            this._afterClose();
        };
        BaseDialog.prototype.updateOptions = function () {
            this._options.autoOpen = false;
            this._options.closeText = designer.res.close;
            this._options.resizable = false;
            this._closeCallback = this._options.close;
            this._options.close = this.onClose.bind(this);

            if (this._options.buttons && this._options.buttons[0]) {
                this._options.buttons[0].dialogToBeFocused = 'true';
            }
        };

        BaseDialog.prototype.getActiveSelection = function (activeSheet) {
            // should be case by case for operation (like Excel ?!)
            return activeSheet.getSelections()[0];
        };

        BaseDialog.prototype._unparse = function (source, expr, row, col) {
            // prevent old _calcService
            this._calcService = designer.wrapper.spread.getActiveSheet().getCalcService();
            return this._calcService.unparse(source, expr, row, col);
        };
        BaseDialog.prototype._parse = function (source, formula, row, col, ignoreError, forceA1) {
            if (!this._calcService) {
                this._calcService = designer.wrapper.spread.calcService;
            }
            return this._calcService.parse(source, formula, row, col, ignoreError, forceA1);
        };

        BaseDialog.prototype._isFormula = function (val) {
            if (val && (typeof val === "string")) {
                return val.toString().charAt(0) == "=";
            }
            return false;
        };

        // In designer, when set the DataValidator and ConditionalFormat, the formula displays base on the activeRow and activeColumn
        // But when set to runtime, it's need base on the topRow and leftColumn of the selections.
        BaseDialog.prototype._adjustFormula = function (val) {
            if (this._isFormula(val)) {
                var activeSheet = designer.wrapper.spread.getActiveSheet();
                var activeRow = activeSheet.getActiveRowIndex();
                var activeColumn = activeSheet.getActiveColumnIndex();
                var selections = activeSheet.getSelections();
                if (!selections || !selections.length) {
                    return val;
                }
                var topRow = selections[0].row, leftColumn = selections[0].col;
                for (var i = 1; i < selections.length; i++) {
                    var range = selections[i];
                    topRow = topRow <= range.row ? topRow : range.row;
                    leftColumn = leftColumn <= range.col ? leftColumn : range.col;
                }
                topRow = topRow < 0 ? 0 : topRow;
                leftColumn = leftColumn < 0 ? 0 : leftColumn;
                var expr = GC.Spread.Sheets.CalcEngine.formulaToExpression(activeSheet, val, activeRow, activeColumn);
                return '=' + GC.Spread.Sheets.CalcEngine.expressionToFormula(activeSheet, expr, topRow, leftColumn);
            }
            return val;
        };


        BaseDialog.prototype._getOneValueOrReference = function (element, index) {
            var value1 = this._element.find(".textBox-cell" + index).val();
            var value1UpperCase = (value1 || "").toString().toUpperCase();
            if (value1UpperCase === "TRUE") {
                value1 = true;
            } else if (value1UpperCase === "FALSE") {
                value1 = false;
            } else {
                value1 = this._adjustFormula(value1);
            }
            return value1;
        };

        BaseDialog.prototype.hide = function () {
            var modalDiv = $(".ui-widget-overlay");
            this._parent.hide();
            //for modal dialog
            if (modalDiv) {
                modalDiv.hide();
            }
        };
        BaseDialog.prototype.show = function () {
            //for modal dialog
            var modalDiv = $(".ui-widget-overlay");
            if (modalDiv) {
                modalDiv.show();
            }
            this._parent.show();
        };
        return BaseDialog;
    })();
    designer.BaseDialog = BaseDialog;
})();