(function () {
    'use strict';

    var widgetName = "sliderpanel", SPREADMINWIDTH = 30;
    var designer = GC.Spread.Sheets.Designer;
    var SliderPanel = (function (_super) {
        designer.extends(SliderPanel, _super);

        function SliderPanel() {
            _super.apply(this, arguments);
        }

        SliderPanel.prototype._create = function () {
            this._spreadPanel = designer.wrapper.spreadElement;
            this._sliderHandleDOM = $(".slider-panel-handler");
            this._spreadResizeStartEvent = "mousedown.resizeStart";
            this._spreadResizeEndEvent = "mouseup.resizeEnd";
            this._spreadContinueResizeEvent = "mousemove.continueResize";
            this._isCapture = false;
            this._gap = 0;
            this._xOffset = 0;
            var container = this.element;

            // sub panel
            this._panel1 = $("<div>").addClass("slider-panel-subPanel slider-panel-panel1").appendTo(container);
            this._panelSpliter = $("<div>").addClass("slider-panel-subPanel-spliter").appendTo(container);
            this._panel2 = $("<div>").addClass("slider-panel-subPanel slider-panel-panel2").appendTo(container);
            //guides line
            this._guidesLine = $("<div>").addClass("slider-panel-guidesline").appendTo(container);

            //event
            this._addEvents();
            this._panel1.hide();
            this._panelSpliter.hide();
            this._panel2.hide();
        };

        SliderPanel.prototype._setOption = function (key, value) {
        };

        SliderPanel.prototype._addEvents = function () {
            var self = this;
            this._sliderHandleDOM.bind(this._spreadResizeStartEvent, function (evt) {
                self._xOffset = evt.pageX;
                if (!self._isCapture) {
                    $(document).bind(self._spreadContinueResizeEvent, function (event) {
                        var canvasOffset = $(designer.util.getCanvas(designer.wrapper.spread)).offset();
                        self._guidesLine.css("display", "inline-block");
                        self._guidesLine.offset({
                            left: event.pageX,
                            top: canvasOffset.top
                        });
                    }).bind(self._spreadResizeEndEvent, function (event) {
                        $(document).unbind(self._spreadContinueResizeEvent);
                        $(document).unbind(self._spreadResizeEndEvent);
                        self._guidesLine.css("display", "none");
                        self._xOffset = event.pageX - self._xOffset;
                        self._refreshSize(self._xOffset);
                        self._isCapture = false;
                    });
                    self._isCapture = true;
                }
            });

            $(designer).bind('layoutChanged', function () {
                self._refreshSize();
            });
        };

        SliderPanel.prototype._refreshSize = function (xOffset) {
            var content = $(".content");
            var sliderPanel = this.element;
            var spreadHeight = $(".content").children('.fill-spread-content').height();
            var panel1 = this._panel1, panel2 = this._panel2, panelSpliter = this._panelSpliter;
            var sliderPanelVisible = sliderPanel.is(":visible"), panel1Visible = panel1.is(":visible"), panel2Visible = panel2.is(":visible"), panelSpliterVisible = panelSpliter.is(":visible");
            if (sliderPanelVisible) {
                if (!xOffset) {
                    xOffset = 0;
                }
                var sliderPanelWidth = parseInt(sliderPanel.css("width"));
                if (isNaN(sliderPanelWidth)) {
                    return;
                }
                sliderPanelWidth = sliderPanelWidth - xOffset;
                var minSliderPanelWidth = 0;
                if (panel2Visible) {
                    minSliderPanelWidth = panel2.width();
                }
                if (sliderPanelWidth < minSliderPanelWidth) {
                    sliderPanelWidth = minSliderPanelWidth;
                }
                var spreadTargetWidth = $(window).width() - sliderPanelWidth - this._gap;
                if (spreadTargetWidth < SPREADMINWIDTH) {
                    spreadTargetWidth = SPREADMINWIDTH;
                    sliderPanelWidth = $(window).width() - spreadTargetWidth - this._gap;
                }
                content.css("width", spreadTargetWidth);
                designer.wrapper.spreadElement.css("width", spreadTargetWidth);
                sliderPanel.css("width", sliderPanelWidth);
                var spliterWidth = 0;
                if (panelSpliterVisible) {
                    spliterWidth = 2 * parseInt(panelSpliter.css("border-left-width"));
                }
                if (panel2Visible && panel1Visible) {
                    panel1.width(sliderPanelWidth - panel2.width() - spliterWidth);
                } else if (panel1Visible) {
                    panel1.width(sliderPanelWidth);
                }
                designer.wrapper.spread.refresh();
            }
            content.css('height', spreadHeight);
        };

        SliderPanel.prototype._resetSliderWidth = function () {
            var sliderWidth = 0;
            var panel1 = this._panel1, panel2 = this._panel2, sliderHandleDOM = this._sliderHandleDOM,
                panelSpliter = this._panelSpliter;
            if (panel1.is(":visible")) {
                sliderWidth += panel1.width();
            }
            if (panel2.is(":visible")) {
                sliderWidth += panel2.width();
            }
            if (panelSpliter.is(":visible")) {
                sliderWidth += 2 * parseInt(panelSpliter.css("border-left-width"));
            }
            var totalWidth = $(window).width();
            if (!totalWidth || isNaN(totalWidth)) {
                return;
            }
            this._gap = 0;
            if (sliderHandleDOM.is(":visible")) {
                var sliderHandleDOMBorderWidth = parseInt(sliderHandleDOM.css("border-width"));
                if (!isNaN(sliderHandleDOMBorderWidth)) {
                    this._gap += 2 * sliderHandleDOMBorderWidth;
                }
            }
            var sliderPanelBorderWidth = 1;
            this._gap += 2 * sliderPanelBorderWidth;
            this._spreadPanel.css({
                "display": "inline-block",
                "width": totalWidth - this._gap - sliderWidth + "px"
            });
            designer.wrapper.spread.refresh();
            this.element.css({
                "display": "inline-block",
                "width": sliderWidth + "px",
                "border": sliderPanelBorderWidth + "px solid lightgray"
            });
        };

        SliderPanel.prototype.open = function (panelName) {
            var panel1 = this._panel1, panel2 = this._panel2;
            if (panelName === 'panel1') {
                panel1.show();
                this._sliderHandleDOM.show();
            } else if (panelName === 'panel2') {
                panel2.show();
                this._panelSpliter.show();
            }
            this.element.show();
            this._resetSliderWidth();
        };

        SliderPanel.prototype.close = function (panelName) {
            var panel1 = this._panel1, panel2 = this._panel2;
            if (panelName === "panel1") {
                panel1.hide();
                this._sliderHandleDOM.hide();
            } else if (panelName === "panel2") {
                panel2.hide();
                this._panelSpliter.hide();
            }
            this._resetSliderWidth();
            if (!panel1.is(":visible") && !panel2.is(":visible")) {
                this.element.hide();
                var content = $(".content");
                content.css("width", "100%");
                this._spreadPanel.css("width", "100%");
            }
            designer.wrapper.spread.refresh();
        };
        SliderPanel.prototype.getContainer = function (panelName) {
            if (panelName === 'panel1') {
                return this._panel1;
            } else if (panelName === 'panel2') {
                return this._panel2;
            }
        };
        return SliderPanel;
    })(designer.gcui.gcuiWidget);
    designer.SliderPanel = SliderPanel;

    SliderPanel.prototype.options = $.extend(true, {}, designer.gcui.gcuiWidget.prototype.options, SliderPanel.DefaultOptions);
    $.gcui.registerWidget(widgetName, SliderPanel.prototype);

})();