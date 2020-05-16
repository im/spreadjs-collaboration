(function () {
    'use strict';
    var designer = GC.Spread.Sheets.Designer;

    function ChartTypePicker(container, valueChanged) {
        this._container = container;
        this._valueChanged = valueChanged;
        this.options = {
            chartTypeData: {
                columnType: {
                    icon: "select-series-type-column",
                    text: designer.res.selectChartDialog.column,
                    items: [
                        {
                            icon: "clustered-column-icon",
                            tag: designer.res.selectChartDialog.columnClustered,
                            value: "columnClustered"
                        }, {
                            icon: "stacked-column-icon",
                            tag: designer.res.selectChartDialog.columnStacked,
                            value: "columnStacked"
                        }, {
                            icon: "stacked100-column-icon",
                            tag: designer.res.selectChartDialog.columnClustered,
                            value: "columnStacked100"
                        }
                    ]
                },
                barType: {
                    icon: "select-series-type-bar",
                    text: designer.res.selectChartDialog.bar,
                    items: [
                        {
                            icon: "clustered-bar-icon",
                            tag: designer.res.selectChartDialog.barClustered,
                            value: "barClustered"
                        }, {
                            icon: "stacked-bar-icon",
                            tag: designer.res.selectChartDialog.barStacked,
                            value: "barStacked"
                        }, {
                            icon: "stacked100-bar-icon",
                            tag: designer.res.selectChartDialog.barStacked100,
                            value: "barStacked100"
                        }
                    ]
                },
                lineType: {
                    icon: "select-series-type-line",
                    text: designer.res.selectChartDialog.line,
                    items: [
                        {
                            icon: "line-icon",
                            tag: designer.res.selectChartDialog.line,
                            value: "line"
                        }, {
                            icon: "stacked-line-icon",
                            tag: designer.res.selectChartDialog.lineStacked,
                            value: "lineStacked"
                        }, {
                            icon: "stacked100-line-icon",
                            tag: designer.res.selectChartDialog.lineStacked100,
                            value: "lineStacked100"
                        }, {
                            icon: "line-with-markers-icon",
                            tag: designer.res.selectChartDialog.lineMarkers,
                            value: "lineMarkers"
                        }, {
                            icon: "stacked-line-with-markers-icon",
                            tag: designer.res.selectChartDialog.lineMarkersStacked,
                            value: "lineMarkersStacked"
                        }, {
                            icon: "stacked100-line-with-markers-icon",
                            tag: designer.res.selectChartDialog.lineMarkersStacked100,
                            value: "lineMarkersStacked100"
                        }
                    ]
                },
                areaType: {
                    icon: "select-series-type-area",
                    text: designer.res.selectChartDialog.area,
                    items: [
                        {
                            icon: "area-icon",
                            tag: designer.res.selectChartDialog.area,
                            value: "area"
                        }, {
                            icon: "stacked-area-icon",
                            tag: designer.res.selectChartDialog.areaStacked,
                            value: "areaStacked"
                        }, {
                            icon: "stacked100-area-icon",
                            tag: designer.res.selectChartDialog.areaStacked100,
                            value: "areaStacked100"
                        }
                    ]
                },
                scatterType: {
                    icon: "select-series-type-scatter",
                    text: designer.res.selectChartDialog.xyScatter,
                    items: [
                        {
                            icon: "scatter-icon",
                            tag: designer.res.selectChartDialog.xyScatter,
                            value: "xyScatter"
                        }, {
                            icon: "scatter-with-smooth-lines-and-markers-icon",
                            tag: designer.res.selectChartDialog.xyScatterSmooth,
                            value: "xyScatterSmooth"
                        }, {
                            icon: "scatter-with-smooth-lines-icon",
                            tag: designer.res.selectChartDialog.xyScatterSmoothNoMarkers,
                            value: "xyScatterSmoothNoMarkers"
                        }, {
                            icon: "scatter-with-straight-lines-and-markers-icon",
                            tag: designer.res.selectChartDialog.xyScatterLines,
                            value: "xyScatterLines"
                        }, {
                            icon: "scatter-with-straight-lines-icon",
                            tag: designer.res.selectChartDialog.xyScatterLinesNoMarkers,
                            value: "xyScatterLinesNoMarkers"
                        }
                    ]
                }
            }
        };
        this._createChartTypePicker();
    }

    ChartTypePicker.prototype._createChartTypePicker = function () {
        var self = this;
        var list = self._createHtmlElements();
        list.appendTo(self._container);
        self.updateSelectedStatus(GC.Spread.Sheets.Charts.ChartType.columnClustered);
        self._container.bind("selectstart", function () {
            return false;
        });
        self._addEventsListener();
    };

    ChartTypePicker.prototype._createHtmlElements = function () {
        var options = this.options;
        var list = $("<ul class='series-chart-types-list'></ul>");
        for (var chartTypes in options.chartTypeData) {
            if (options.chartTypeData.hasOwnProperty(chartTypes)) {
                var chartTypeList = this._createChartTypeList(options.chartTypeData[chartTypes]);
                chartTypeList.appendTo(list);
            }
        }
        return list;
    };

    ChartTypePicker.prototype._createChartTypeList = function (chartTypeListData) {
        var chartTypeList = $("<li class='series-chart-types-list-item column-type'></li>");
        var listTitle = $("<div class='series-chart-types-list-item-title'></div>");
        var listTitleIcon = $("<span class='series-chart-types-list-item-title-icon'></span>");
        listTitleIcon.addClass(chartTypeListData.icon);
        listTitleIcon.appendTo(listTitle);
        var listTitleText = $("<span class='series-chart-types-list-item-title-text'></span>");
        listTitleText.text(chartTypeListData.text);
        listTitleText.appendTo(listTitle);
        listTitle.appendTo(chartTypeList);
        for (var i = 0; i < chartTypeListData.items.length; i++) {
            var chartTypeListItem = this._createChartTypeListItem(chartTypeListData.items[i]);
            chartTypeListItem.appendTo(chartTypeList);
        }
        return chartTypeList;
    };

    ChartTypePicker.prototype._createChartTypeListItem = function (chartTypeListItemData) {
        var chartTypeListItem = $("<div class='series-chart-type-item'></div>");
        chartTypeListItem.attr("data-name", chartTypeListItemData.value);
        chartTypeListItem.attr("data-bind", chartTypeListItemData.tag);
        var chartTypeListItemIcon = $("<span class='chart-type-subtype-icon'></span>");
        chartTypeListItemIcon.addClass(chartTypeListItemData.icon);
        chartTypeListItemIcon.appendTo(chartTypeListItem);
        return chartTypeListItem;
    };

    ChartTypePicker.prototype._addEventsListener = function () {
        var _this = this;
        _this._container.find(".series-chart-type-item").on('mouseover.chartTypePicker', function (evt) {
            _this._container.find(".series-chart-type-item").removeClass("chart-type-hover");
            $(evt.currentTarget).addClass("chart-type-hover");
        });
        _this._container.find(".series-chart-type-item").click(function (evt) {
            _this._container.find(".series-chart-type-item").removeClass("chart-type-selected");
            $(evt.currentTarget).addClass("chart-type-selected");
            var seriesChartType = $(evt.currentTarget).data('name');
            _this._raiseValueChanged(evt, seriesChartType);
        });
    };

    ChartTypePicker.prototype._raiseValueChanged = function (evt, seriesChartType) {
        var self = this;
        if (self._valueChanged && self._valueChanged instanceof Function) {
            self._valueChanged.call(self, evt, seriesChartType);
        }
    };

    ChartTypePicker.prototype.updateSelectedStatus = function (selectedType) {
        this._container.find(".series-chart-type-item").removeClass("chart-ui-selected");
        this._container.find(".series-chart-type-item").removeClass("chart-type-hover");
        this._container.find(".series-chart-type-item").removeClass("chart-type-selected");
        this._container.find('[data-name=' + selectedType + ']').addClass("chart-ui-selected");
    };

    ChartTypePicker.prototype.dispose = function () {
        this._detachEvent();
        this._container = null;
        this._valueChanged = null;
        this._options = null;
    };

    ChartTypePicker.prototype._detachEvent = function () {
        this._container.find(".series-chart-type-item").off("chartTypePicker");
    };

    designer.ChartTypePicker = ChartTypePicker;
})();
