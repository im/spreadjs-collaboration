var designer = GC.Spread.Sheets.Designer;
(function (statusBar) {
    'use strict';
    if (!designer.dialog) {
        designer.dialog = {};
    }

    var ITEM_STYLE_DISPLAY_NONE = 'none', ITEM_STYLE_DISPLAY_INLINE = 'inline';
    var SPAN_ELEMENT = 'span';
    var ZOOM_DEFAULT_VALUE = '100', ZOOM_PERCENT_SIGN = '%';
    var GC_STATUSBAR = 'gc-statusbar-', ZOOM_PANEL_CLASS = GC_STATUSBAR + 'zoom-panel';
    var GC_STATUSBAR_ZOOM_PANEL = 'statusbar-zoom-panel';
    var STATUSBAR_NS = '.statusbar';
    var Events = GC.Spread.Sheets.Events;
    var keyword_null = null;
    var designerStatusBar;

    var StatusItem = GC.Spread.Sheets.StatusBar.StatusItem;
    designer.extends(ZoomPanelItem, StatusItem);
    function ZoomPanelItem(name, options) {
        StatusItem.call(this, name, options);
        this._eventNs = STATUSBAR_NS + this.name;
    }

    ZoomPanelItem.prototype.onCreateItemView = function (container) {
        this._zoomPanel = container;
        container.style.display = this.visible ? ITEM_STYLE_DISPLAY_INLINE : ITEM_STYLE_DISPLAY_NONE;

        var zoomValueControl = this._zoomValueControl;
        if (!zoomValueControl) {
            zoomValueControl = this._zoomValueControl = document.createElement(SPAN_ELEMENT);
        }
        $(zoomValueControl).addClass(ZOOM_PANEL_CLASS);
        zoomValueControl.innerText = ZOOM_DEFAULT_VALUE + ZOOM_PERCENT_SIGN;
        container.appendChild(zoomValueControl);
        this.addZoomPanelClickStyle();
        this.addZoomPanelClickEvent();
    };
    ZoomPanelItem.prototype.onBind = function (context) {
        var self = this;
        self._context = context;
        context.bind(Events.UserZooming + self._eventNs, function (e, info) {
            var zoomFactor = info.newZoomFactor;
            self._onValueChanged(zoomFactor);
        });
        context.bind(Events.ActiveSheetChanged + self._eventNs, function () {
            self.onUpdate();
        });
    };
    ZoomPanelItem.prototype.onUpdate = function () {
        StatusItem.prototype.onUpdate.call(this);
        if (this._context && this._context.getActiveSheet && this._context.getActiveSheet()) {
            var zoomFactor = this._context.getActiveSheet().zoom();
            this._onValueChanged(zoomFactor);
        }
    };
    ZoomPanelItem.prototype._onValueChanged = function (zoomFactor) {
        var value;
        if (zoomFactor) {
            value = getValueFromZoomFactor(zoomFactor);
        }
        if (value !== parseInt(this.value, 10)) {
            value = parseInt(value, 10);
            this.value = value + ZOOM_PERCENT_SIGN;
            this._updateZoomValueControl(value);
        }
    };
    ZoomPanelItem.prototype._updateZoomValueControl = function (value) {
        var zoomValueControl = this._zoomValueControl;
        if (zoomValueControl) {
            zoomValueControl.innerText = value + ZOOM_PERCENT_SIGN;
        }
    };
    ZoomPanelItem.prototype.onUnbind = function () {
        if (this._context) {
            this._context.unbind(this._eventNs);
            this._context = keyword_null;
        }
    };
    ZoomPanelItem.prototype.dispose = function () {
        this.unbind();
        this._contextMenu = keyword_null;
        if (this._baseStatusBar) {
            this._baseStatusBar._dispose();
            this._baseStatusBar = keyword_null;
        }
        if (this._host) {
            this._host = keyword_null;
        }
        $(this._zoomValueControl).unbind('click');
    };
    ZoomPanelItem.prototype.addZoomPanelClickStyle = function () {
        $(this._zoomValueControl).addClass(GC_STATUSBAR_ZOOM_PANEL);
    };
    ZoomPanelItem.prototype.addZoomPanelClickEvent = function () {
        if (!designer.wrapper.spread.notWorking) {
            var self = this;
            $(this._zoomValueControl).click(function () {
                if (!designer.dialog.zoomDialog) {
                    designer.dialog.zoomDialog = new designer.ZoomDialog();
                }
                self.zoomDialog = designer.dialog.zoomDialog;
                self.zoomDialog.open();
            });
        }
    };
    function getValueFromZoomFactor(zoomFactor) {
        var value = zoomFactor;
        if (zoomFactor > 0 && zoomFactor <= 4) { // zoom factor to [25, 400]
            value = convertToIntegerPercent(zoomFactor);
        }
        return value;
    }
    function convertToIntegerPercent(value) {
        var precision = 12; // empirical value look https://github.com/camsong/blog/issues/9
        return Math.floor(+parseFloat((value * 100).toPrecision(precision)));
    }
    function initStatusBar() {
        designerStatusBar = new GC.Spread.Sheets.StatusBar.StatusBar(document.getElementsByClassName('statusBar')[0]);
        if (!designer.wrapper.spread || (designer.wrapper.spread && designer.wrapper.spread.notWorking)) {
            return;
        }
        designerStatusBar.bind(designer.wrapper.spread);
        designerStatusBar.remove('zoomPanel');
        designerStatusBar.add(new ZoomPanelItem('zoomPanel',
            {
                menuContent: designer.res.statusBar.zoom,
                value: ZOOM_DEFAULT_VALUE + ZOOM_PERCENT_SIGN,
                align: 'right',
                tipText: designer.res.statusBar.toolTipZoomPanel
            }));
    }
    statusBar.initStatusBar = initStatusBar;
    function bindContext() {
        designerStatusBar.bind(designer.wrapper.spread);
    }
    function update() {
        designerStatusBar.update();
    }
    statusBar.bindContext = bindContext;
    statusBar.update = update;
    designer.loader.ready(function () {
        initStatusBar();
    });
    designer.statusBar = statusBar;
})(designer.statusBar || ({}));
