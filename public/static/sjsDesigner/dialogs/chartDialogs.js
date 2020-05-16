
(function () {
    'use strict';

    var designer = GC.Spread.Sheets.Designer;
    var dialogHtmlPath = designer.util.resolveHtmlPath('../dialogs', 'chartDialogs.html');
    var chartTemplates = designer.chartTemplates;
    var ChartTypePicker = designer.ChartTypePicker;
    var Sheets = GC.Spread.Sheets;
    var Charts = Sheets.Charts;
    var Chart = Charts.Chart;
    var rangeToFormula = GC.Spread.Sheets.CalcEngine.rangeToFormula;
    var formulaToRange = GC.Spread.Sheets.CalcEngine.formulaToRange;
    var formulaToRanges = GC.Spread.Sheets.CalcEngine.formulaToRanges;
    var chartHelper = designer.util.chartHelper;
    var isNullOrUndefined = chartHelper.isNullOrUndefined;
    var ColorHelper = designer.ColorHelper;

    var SelectChartDialog = (function (_super) {
        designer.extends(SelectChartDialog, _super);

        var orientationDict = {
            "1": 1 /* RowCol.rows */,
            "0": 0 /* RowCol.columns */
        };

        //this function will return whether these two series can be in the same chart
        var seriesCompatibleCheck = function (series1ChartType, series2ChartType) {
            if ((series1ChartType === Charts.ChartType.columnClustered ||
                series1ChartType === Charts.ChartType.columnStacked ||
                series1ChartType === Charts.ChartType.columnStacked100) &&
                (series2ChartType === Charts.ChartType.columnClustered ||
                    series2ChartType === Charts.ChartType.columnStacked ||
                    series2ChartType === Charts.ChartType.columnStacked100)) {
                return false;
            }
            if ((series1ChartType === Charts.ChartType.line ||
                series1ChartType === Charts.ChartType.lineStacked ||
                series1ChartType === Charts.ChartType.lineStacked100) &&
                (series2ChartType === Charts.ChartType.line ||
                    series2ChartType === Charts.ChartType.lineStacked ||
                    series2ChartType === Charts.ChartType.lineStacked100)) {
                return false;
            }
            if ((series1ChartType === Charts.ChartType.lineMarkers ||
                series1ChartType === Charts.ChartType.lineMarkersStacked ||
                series1ChartType === Charts.ChartType.lineMarkersStacked100) &&
                (series2ChartType === Charts.ChartType.lineMarkers ||
                    series2ChartType === Charts.ChartType.lineMarkersStacked ||
                    series2ChartType === Charts.ChartType.lineMarkersStacked100)) {
                return false;
            }
            if ((series1ChartType === Charts.ChartType.barClustered ||
                series1ChartType === Charts.ChartType.barStacked ||
                series1ChartType === Charts.ChartType.barStacked100) &&
                (series2ChartType === Charts.ChartType.barClustered ||
                    series2ChartType === Charts.ChartType.barStacked ||
                    series2ChartType === Charts.ChartType.barStacked100)) {
                return false;
            }
            if ((series1ChartType === Charts.ChartType.area ||
                series1ChartType === Charts.ChartType.areaStacked ||
                series1ChartType === Charts.ChartType.areaStacked100) &&
                (series2ChartType === Charts.ChartType.area ||
                    series2ChartType === Charts.ChartType.areaStacked ||
                    series2ChartType === Charts.ChartType.areaStacked100)) {
                return false;
            }
            return true;
        };
        function isEmptyCell(sheet, row, col) {
            var value = sheet.getValue(row, col);
            if (!isNullOrUndefined(value) &&
                value.toString().length > 0) {
                return false;
            }
            return true;
        }

        function SelectChartDialog() {
            _super.call(this, (dialogHtmlPath), '.select-chart-dialog');
            this._selectedItem = {
                category: null,
                chartType: null,
                dataOrientation: null
            };
            this._series = [];
            this._dialogType = SelectChartDialog.dialogType.insertChart;
            this._chart = null;
            this._chartTypePicker = null;
            this._dataFormula = null;
            //like stock chart,if data is incorrect,do nothing
            this._enableToApplySetting = true;
        }

        SelectChartDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: '655px',
                resizable: false,
                modal: true,
                title: designer.res.selectChartDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
                            self.close();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };
        SelectChartDialog.prototype._init = function () {
            this._addEventListener();
        };
        SelectChartDialog.prototype._afterClose = function () {
            this._selectedItem = {
                category: null,
                chartType: null,
                dataOrientation: null
            };
            this._series = [];
            this._dialogType = SelectChartDialog.dialogType.insertChart;
            this._chart = null;
            this._dataFormula = null;
            //like stock chart,if data is incorrect,do nothing
            this._enableToApplySetting = true;
        };
        //get dialog type and chart(option) from args,init dialog by dialog type,then refresh ui
        SelectChartDialog.prototype._beforeOpen = function (args) {
            var self = this;
            self._dialogType = args[0];
            self._series = [];
            designer.chartPreviewer.synchronizeData(designer.wrapper.spread);
            if (self._dialogType === SelectChartDialog.dialogType.insertChart) {
                self._initInsertChartDialog();
            } else {
                self._initChangeChartTypeDialog(args[1]);
            }

            self._refreshPreviewsImage();
            self._updateSelectedStatus();
        };
        //insert chart dialog default select column clustered chart type rowBase
        //init chart series by selected range
        SelectChartDialog.prototype._initInsertChartDialog = function () {
            var self = this;
            var element = self._element;
            element.dialog('option', 'title', designer.res.selectChartDialog.insertChart);
            self._selectedItem = {
                category: "ColumnGroup",
                chartType: "columnClustered",
                dataOrientation: Charts.RowCol.rows
            };
            self._initSeries();
        };
        SelectChartDialog.prototype._getActualRange = function (range) {
            var row = range.row, column = range.col, rowCount = range.rowCount, columnCount = range.colCount;
            var setRow = row < 0 ? 0 : row, setColumn = column < 0 ? 0 : column;
            var spread = designer.wrapper.spread;
            var sheet = spread.getActiveSheet();
            var isEmpty, r, c, endC, endR;
            var svRowCount = sheet.getRowCount();
            var svColumnCount = sheet.getColumnCount();
            if (row === -1 || (row === 0 && rowCount === svRowCount)) {
                var restoreNegativeColumn = column === -1;
                if (restoreNegativeColumn) {
                    column = 0;
                    columnCount = svColumnCount;
                }
                row = 0;
                rowCount = svRowCount;
                //Implement Excel's policy: Trimming
                isEmpty = true;
                do {
                    for (c = column, endC = column + columnCount; c < endC; c++) {
                        if (!isEmptyCell(sheet, row, c)) {
                            isEmpty = false;
                            break;
                        }
                    }
                    if (isEmpty) {
                        row++;
                        rowCount--;
                        if (rowCount === 0) {
                            return new Sheets.Range(setRow, setColumn, 1, 1);
                        }
                    }
                } while (isEmpty);
                r = row + rowCount - 1;
                isEmpty = true;
                do {
                    for (c = column, endC = column + columnCount; c < endC; c++) {
                        if (!isEmptyCell(sheet, r, c)) {
                            isEmpty = false;
                            break;
                        }
                    }
                    if (isEmpty) {
                        rowCount--;
                        r--;
                        if (rowCount === 0) {
                            return new Sheets.Range(setRow, setColumn, 1, 1);
                        }
                    }
                } while (isEmpty);
                if (restoreNegativeColumn) {
                    column = -1;
                }
            }
            if (column === -1 || (column === 0 && columnCount === svColumnCount)) {
                column = 0;
                columnCount = svColumnCount;
                //Implement Excel's policy: Trimming
                isEmpty = true;
                do {
                    for (r = row, endR = row + rowCount; r < endR; r++) {
                        if (!isEmptyCell(sheet, r, column)) {
                            isEmpty = false;
                            break;
                        }
                    }
                    if (isEmpty) {
                        column++;
                        columnCount--;
                        if (columnCount === 0) {
                            return new Sheets.Range(setRow, setColumn, 1, 1);
                        }
                    }
                } while (isEmpty);
                c = column + columnCount - 1;
                isEmpty = true;
                do {
                    for (r = row, endR = row + rowCount; r < endR; r++) {
                        if (!isEmptyCell(sheet, r, c)) {
                            isEmpty = false;
                            break;
                        }
                    }
                    if (isEmpty) {
                        columnCount--;
                        c--;
                        if (columnCount === 0) {
                            return new Sheets.Range(setRow, setColumn, 1, 1);
                        }
                    }
                } while (isEmpty);
            }
            return new Sheets.Range(row, column, rowCount, columnCount);
        };
        //unSupport multiple range
        SelectChartDialog.prototype._initSeries = function () {
            var self = this;
            var spread = designer.wrapper.spread;
            var activeSheet = spread.getActiveSheet();
            var dataRange = activeSheet.getSelections()[0];
            var reallRange = self._getActualRange(dataRange);
            var useR1C1 = designer.wrapper.spread.options.referenceStyle === 1;
            self._dataFormula = rangeToFormula(reallRange, 0, 0, false, useR1C1);
            var rowBaseSeries = self._getClusteredColumnChartSeriesFromDataFormula(self._dataFormula, Charts.RowCol.rows);
            var colBaseSeries = self._getClusteredColumnChartSeriesFromDataFormula(self._dataFormula, Charts.RowCol.columns);
            var rowBaseSeriesWithoutStyle = chartHelper.getSeriesWithoutStyle(rowBaseSeries);
            var colBaseSeriesWithoutStyle = chartHelper.getSeriesWithoutStyle(colBaseSeries);
            self._series.push(rowBaseSeriesWithoutStyle);
            self._series.push(colBaseSeriesWithoutStyle);
        };
        //organized series by dataRange and orientation
        SelectChartDialog.prototype._getClusteredColumnChartSeriesFromDataFormula = function (dataFormula, orientation) {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var chart = new Chart(sheet, '', Charts.ChartType.columnClustered, 20, 20, 480, 288, dataFormula, orientation);
            return chart.series().get();
        };
        SelectChartDialog.prototype._initChangeChartTypeDialog = function (chart) {
            var self = this, element = self._element;
            self._chart = chart;
            element.dialog('option', 'title', designer.res.selectChartDialog.changeChartType);
            var chartType = chart.chartType();
            var category = chartHelper.getChartGroupString(chartType);
            var dataOrientation;
            var currentSeries = chart.series().get();
            self._dataFormula = chart.dataRange();
            dataOrientation = chart.getDataOrientation();
            if (chartType === Charts.ChartType.combo) {
                chartType = "customCombination";
            } else {
                chartType = chartHelper.getChartTypeString(chartType);
            }
            self._selectedItem = {
                category: category,
                chartType: chartType,
                dataOrientation: dataOrientation
            };
            var currentSeriesWithoutStyle = chartHelper.getSeriesWithoutStyle(currentSeries);
            self._series.push(currentSeriesWithoutStyle);
            var switchedSeries = self._getSwitchedOrientationSeries(currentSeries);
            if (switchedSeries) {
                var switchedSeriesWithoutStyle = chartHelper.getSeriesWithoutStyle(switchedSeries);
                self._series.push(switchedSeriesWithoutStyle);
            }
            //_getSeriesFromDataRange function use clustered column type to get series,
            //switched series chart type are all so clustered column.so synchronize series chart type here
            // self._updateAllSeriesType();
        };
        SelectChartDialog.prototype._getSwitchedOrientationSeries = function (series) {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var chart = new Charts.Chart(sheet, 'chartForGetSwitchedSeries', undefined, 20, 20, 480, 288, null);
            chart.series().add(series);
            var result = chart.switchDataOrientation();
            if (result) {
                return chart.series().get();
            } else {
                return null;
            }
        };
        SelectChartDialog.prototype._applySetting = function () {
            var self = this;
            if (!self._enableToApplySetting) {
                return;
            }
            if (self._dialogType === SelectChartDialog.dialogType.insertChart) {
                designer.actions.doAction('insertChart', designer.wrapper.spread, {
                    chartType: self._selectedItem.chartType,
                    dataOrientation: self._selectedItem.dataOrientation,
                    dataFormula: self._dataFormula,
                    category: self._selectedItem.category,
                    series: self._series[orientationDict[self._selectedItem.dataOrientation]]
                });
            } else {
                var isSwitchDataOrientation = self._selectedItem.dataOrientation === Charts.RowCol.rows ? false : true;
                var dataOri = self._selectedItem.dataOrientation === 0 ? 1 : 0;
                designer.actions.doAction('changeChartType', designer.wrapper.spread, {
                    chartType: self._selectedItem.chartType,
                    isSwitchDataOrientation: isSwitchDataOrientation,
                    dataFormula: self._dataFormula,
                    category: self._selectedItem.category,
                    series: self._series[isSwitchDataOrientation ? orientationDict[dataOri] : orientationDict[self._selectedItem.dataOrientation]],
                    chart: self._chart
                });
            }

            var activeSheet = designer.wrapper.spread.getActiveSheet();
            activeSheet.clearSelection();
        };
        SelectChartDialog.prototype._addEventListener = function () {
            var self = this, element = self._element;
            var $categories = element.find('.chart-type-category');
            $categories.on("click", function (e) {
                var $selectedCategory = $(e.currentTarget);
                var selectedCategory = $selectedCategory.data('name');
                var $selectedChartTypes = element.find('[data-group=' + selectedCategory + ']');
                var selectedChartType = $($selectedChartTypes[0]).data('name');
                self._selectedItem.category = selectedCategory;
                self._selectedItem.chartType = selectedChartType;
                self._selectedItem.dataOrientation = Charts.RowCol.rows;
                self._updateAllSeriesType();
                self._updateSelectedStatus();
                self._refreshPreviewsImage();
            });
            var $chartTypes = element.find('.select-chart-type-subtype-item');
            $chartTypes.on("click", function (e) {
                var $selectedChartType = $(e.currentTarget);
                var selectedChartType = $selectedChartType.data('name');
                self._selectedItem.chartType = selectedChartType;
                self._selectedItem.dataOrientation = Charts.RowCol.rows;
                self._updateAllSeriesType();
                self._updateSelectedStatus();
                self._refreshPreviewsImage();
            });
            var chartPreviews = element.find('.select-chart-type-preview-item');
            chartPreviews.on("click", function (e) {
                //update this._selectedItem,ui
                //because of two different orientation preview image have been created already,
                //no need to refresh preview image here 
                var $dataOrientation = $(e.currentTarget);
                var dataOrientation = $dataOrientation.data('name');
                self._selectedItem.dataOrientation = Charts.RowCol[dataOrientation];
                self._updatePreSelected();
            });
            var seriesTypeContainer = element.find(".series-content-items");
            seriesTypeContainer.on("click", function (e) {
                var target = $(e.target);
                //reset all series item's status
                var seriesItems = $(".series-item");
                seriesItems.removeClass("series-item-modifying");
                seriesItems.removeClass("series-item-selected");
                //handle click event by click area of series item and add class to identify status
                var selectedSeriesItem;
                for (var i = 0; i < seriesItems.length; i++) {
                    if ($(seriesItems[i]).find(target).length > 0) {
                        selectedSeriesItem = $(seriesItems[i]);
                        self._currentSelectedSeriesIndex = i;
                    }
                }
                if (!selectedSeriesItem) {
                    return;
                }
                if (target.attr("class") === "series-chart-type-container" ||
                    target.parent().attr("class") === "series-chart-type-container") {
                    //click on series type area,popup chart type picker
                    var chartTypeListContainer = $(".series-chart-type-list-container");
                    if (!self._chartTypePicker) {
                        self._chartTypePicker = new ChartTypePicker(chartTypeListContainer, function (e, value) { // NOSONAR  noUseArguments
                            //if series item's type have been changed,chart type should change to "customCombination"
                            //update this.series's type,there are some limitation rules here,invoke _updateComboSeriesType
                            //close popup
                            //update ui,change series items is enough,refresh preview image 
                            if (self._series[0][self._currentSelectedSeriesIndex].chartType !== Charts.ChartType[value]) {
                                self._selectedItem.chartType = "customCombination";
                                self._updateComboSeriesType(self._currentSelectedSeriesIndex, Charts.ChartType[value]);
                                self._seriesTypePickerPopup.gcuipopup("hide");
                                self._updateSeriesStatus();
                                self._refreshPreviewsImage();
                            }

                        });
                    }
                    var selectedType = chartHelper.getChartTypeString(self._series[0][self._currentSelectedSeriesIndex].chartType);
                    self._chartTypePicker.updateSelectedStatus(selectedType);
                    self._seriesTypePickerPopup = $(".series-chart-type-list-popup").gcuipopup({
                        autoHide: true,
                        position: {
                            of: target,
                            my: 'left bottom',
                            at: 'left top'
                        }
                    });
                    self._seriesTypePickerPopup.gcuipopup("show");
                    selectedSeriesItem.addClass("series-item-modifying");
                } else if (target.attr("class") === "series-secondary-axis-checkbox") {
                    //click on series secondary area
                    selectedSeriesItem.addClass("series-item-modifying");
                    // update this.series's type,there are some limitation rules here,invoke _updateComboSeriesAxisGroup
                    //update ui,change series items is enough,refresh preview image 
                    var checked = target[0].checked;
                    self._updateComboSeriesAxisGroup(checked);
                    self._updateSeriesStatus();
                    self._refreshPreviewsImage();
                } else {
                    selectedSeriesItem.addClass("series-item-selected");
                }
            });
        };

        SelectChartDialog.prototype._updateComboSeriesAxisGroup = function (checked) {
            var self = this;
            var series = self._series[0];
            if (!checked) {
                series[self._currentSelectedSeriesIndex].axisGroup = Charts.AxisGroup.primary;
                return;
            }
            var i, count = series.length;
            for (i = 0; i < count; i++) {
                if (series[i].axisGroup === Charts.AxisGroup.primary) {
                    if (i === self._currentSelectedSeriesIndex) {
                        var j = i + 1;
                        for (; j < count; j++) {
                            if (series[j].axisGroup === Charts.AxisGroup.primary) {
                                series[self._currentSelectedSeriesIndex].axisGroup = Charts.AxisGroup.secondary;
                                return;
                            }
                        }
                    } else {
                        series[self._currentSelectedSeriesIndex].axisGroup = Charts.AxisGroup.secondary;
                        return;
                    }
                }
            }
            var seriesAxisGroup = $(".series-secondary-axis-checkbox");
            for (i = 0; i < count; i++) {
                series[i].axisGroup = Charts.AxisGroup.primary;
                seriesAxisGroup[i].checked = false;
            }
        };

        //update ui based on this._selectedItem
        SelectChartDialog.prototype._updateSelectedStatus = function () {
            var self = this, element = self._element;
            var category = self._selectedItem.category;
            var chartType = self._selectedItem.chartType;

            var $categories = element.find('.chart-type-category');
            var $selectedCategory = element.find('[data-name=' + category + ']');
            self._processSelectedUI($categories, $selectedCategory);

            var $chartTypes = element.find('.select-chart-type-subtype-item');
            var $selectedChartType = element.find('[data-name=' + chartType + ']');
            self._processSelectedUI($chartTypes, $selectedChartType);

            var $dataOrientations = element.find('.select-chart-type-preview-item');
            var $selectedDataOrientation = element.find('[data-name= rows]');
            self._processSelectedUI($dataOrientations, $selectedDataOrientation);
            self._updatePreviewDescription(chartType);
            self._update$ChartTypes(category);
        };
        SelectChartDialog.prototype._updatePreSelected = function () {
            var self = this, element = self._element;
            var category = self._selectedItem.category;
            var chartType = self._selectedItem.chartType;
            var dataOrientation = self._selectedItem.dataOrientation === Charts.RowCol.rows ? "rows" : "columns";
            var $dataOrientations = element.find('.select-chart-type-preview-item');
            var $selectedDataOrientation = element.find('[data-name=' + dataOrientation + ']');
            self._processSelectedUI($dataOrientations, $selectedDataOrientation);

            self._updatePreviewDescription(chartType);

            self._update$ChartTypes(category);
        };
        //update series items in series modify container by self._series
        SelectChartDialog.prototype._updateSeriesStatus = function () {
            var self = this, element = self._element;
            var chartType = self._selectedItem.chartType;
            var $chartTypes = element.find('.select-chart-type-subtype-item');
            var $selectedChartType = element.find('[data-name=' + chartType + ']');
            self._processSelectedUI($chartTypes, $selectedChartType);
            var dataOrientation = self._selectedItem.dataOrientation === Charts.RowCol.rows ? "rows" : "columns";
            var $dataOrientations = element.find('.select-chart-type-preview-item');
            var $selectedDataOrientation = element.find('[data-name=' + dataOrientation + ']');
            self._processSelectedUI($dataOrientations, $selectedDataOrientation);
            self._updatePreviewDescription(chartType);
            element.find('.select-chart-type-preview-item').addClass('hidden');
            var selectedPreviews = element.find('[data-group=' + chartType + ']');
            selectedPreviews.removeClass('hidden');

            var seriesItems = $(".series-item");
            var seriesArray = self._series[0];
            var i = 0, count = seriesArray.length;
            for (; i < count; i++) {
                var seriesItemElem = seriesItems[i];
                var seriesItemData = seriesArray[i];
                var seriesItemTypeElem = $(seriesItemElem).find(".series-chart-type-selected");
                seriesItemTypeElem.text(designer.res.selectChartDialog[chartHelper.getChartTypeString(seriesItemData.chartType)]);
                var seriesItemAxisElem = $(seriesItemElem).find(".series-secondary-axis-checkbox");
                seriesItemAxisElem[0].checked = seriesItemData.axisGroup === Charts.AxisGroup.primary ? "" : "checked";
            }
        };
        //there is a span describe which chart type user selected,update it by this function
        SelectChartDialog.prototype._updatePreviewDescription = function (chartType) {
            $(".select-chart-type-title").text(designer.res.selectChartDialog[chartType]);
        };
        //reset all item's selected class,only add selected class to item which be selected
        SelectChartDialog.prototype._processSelectedUI = function (allItem, selectedItem) {
            allItem.removeClass('chart-ui-selected');
            selectedItem.addClass('chart-ui-selected');
        };
        SelectChartDialog.prototype._update$ChartTypes = function (category) {
            var self = this, element = self._element;
            element.find('.select-chart-type-subtype-item').addClass('hidden');
            var selectedChartTypes = element.find('[data-group=' + category + ']');
            selectedChartTypes.removeClass('hidden');
        };
        SelectChartDialog.prototype._showSeriesModifyContainer = function () {
            $(".series-container").show();
            this._createSeriesItems();
        };
        SelectChartDialog.prototype._hideSeriesModifyContainer = function () {
            $(".series-container").hide();
        };

        SelectChartDialog.prototype._refreshPreviewsImage = function () {
            var self = this, element = self._element, i;
            element.find('.select-chart-type-preview-item').addClass('hidden');
            if (self._isSelectComboChartType()) {
                self._showSeriesModifyContainer();
            } else {
                self._hideSeriesModifyContainer();
            }
            var chartType = self._selectedItem.chartType;
            var chartOptions = self._createChartOptions();
            var charts = designer.chartPreviewer.getChartPreviewCharts(chartOptions);
            var selectedPreviews = element.find('[data-group=' + self._selectedItem.chartType + ']');
            var errorMsgContainer = $(".select-chart-type-error-message");
            for (i = 0; i < selectedPreviews.length; i++) {
                var chart = charts[i];
                if (chart) {
                    if (chart instanceof Charts.Chart) {
                        errorMsgContainer.hide();
                        $(selectedPreviews[i]).removeClass("hidden");
                        var base64Image = chartHelper.getImageFromChart(chart);
                        var targetSpan = $($(selectedPreviews[i]).find('.chart-type-preview-icon'));
                        if (self._isSelectComboChartType()) {
                            targetSpan.css("background-size", "330px");
                        } else {
                            targetSpan.css("background-size", "190px");
                        }
                        targetSpan.css("background-image", "url('" + base64Image + "')");
                    } else {
                        var errorMessage = designer.res.selectChartDialog.errorPrompt[chartType + "ErrorMsg"];
                        errorMsgContainer.text(errorMessage);
                        errorMsgContainer.show();
                        selectedPreviews.addClass("hidden");
                        self._enableToApplySetting = false;
                        return;
                    }
                }
                self._enableToApplySetting = true;
            }
        };
        SelectChartDialog.prototype._updateAllSeriesType = function () {
            var self = this;
            if (self._isSelectComboChartType()) {
                self._updateSeriesForComboType();
            } else {
                var chartType = self._selectedItem.chartType;
                for (var i = 0; i < self._series.length; i++) {
                    for (var j = 0; j < self._series[i].length; j++) {
                        self._updateSeriesType(i, j, Charts.ChartType[chartType]);
                    }
                }
            }
        };
        SelectChartDialog.prototype._updateSeriesForComboType = function () {
            var self = this;
            var chartType1, chartType2, axisGroup1, axisGroup2;
            var selectedChartType = self._selectedItem.chartType;
            if (selectedChartType === "columnClusteredAndLine") {
                chartType1 = Charts.ChartType.columnClustered;
                chartType2 = Charts.ChartType.line;
                axisGroup1 = axisGroup2 = Charts.AxisGroup.primary;
            } else if (selectedChartType === "columnClusteredAndLineOnSecondaryAxis") {
                chartType1 = Charts.ChartType.columnClustered;
                chartType2 = Charts.ChartType.lineMarkers;
                axisGroup1 = Charts.AxisGroup.primary;
                axisGroup2 = Charts.AxisGroup.secondary;
            } else if (selectedChartType === "stackedAreaAndColumnClustered") {
                chartType1 = Charts.ChartType.areaStacked;
                chartType2 = Charts.ChartType.columnClustered;
                axisGroup1 = axisGroup2 = Charts.AxisGroup.primary;
            } else {
                return;
            }
            var i, count, half;
            count = self._series[0].length;
            half = count / 2;
            for (i = 0; i < count; i++) {
                if (i < half) {
                    self._series[0][i].chartType = chartType1;
                    self._series[0][i].axisGroup = axisGroup1;
                } else {
                    self._series[0][i].chartType = chartType2;
                    self._series[0][i].axisGroup = axisGroup2;
                }
            }
        };
        SelectChartDialog.prototype._updateSeriesType = function (seriesIndex, seriesItemIndex, chartType) {
            this._series[seriesIndex][seriesItemIndex].chartType = chartType;
        };
        SelectChartDialog.prototype._updateComboSeriesType = function (seriesItemIndex, chartType) {
            var self = this;
            var series = self._series[0];
            series[seriesItemIndex].chartType = chartType;
            var count = series.length, i;
            for (i = 0; i < count; i++) {
                if (!seriesCompatibleCheck(chartType, series[i].chartType)) {
                    series[i].chartType = chartType;
                }
            }
        };
        SelectChartDialog.prototype._createChartOptions = function () {
            var self = this;
            var chartOptions = [];
            var colorAndStyle;
            var seriesCount;
            if (self._dialogType === SelectChartDialog.dialogType.changeChartType
                && self._chart.colorAndStyle && self._chart.colorAndStyle.color) {
                colorAndStyle = self._chart.colorAndStyle;
            }
            if (self._isSelectComboChartType() ||
                self._isSelectStockGroupChartType() ||
                self._isSelectPieChartType() ||
                self._isSelectSunburstChartType() ||
                self._isSelectTreemapChartType()) {
                seriesCount = 1;
            } else {
                seriesCount = self._series.length;
            }
            var axes, dataLabels, chartArea, legend, dataOrientation, title;
            if (self._chart) {
                axes = self._chart.axes();
                dataLabels = self._chart.dataLabels();
                chartArea = self._chart.chartArea();
                legend = self._chart.legend();
                dataOrientation = self._chart.getDataOrientation();
                title = self._chart.title();
            }
            for (var i = 0; i < seriesCount; i++) {
                if (dataOrientation !== undefined && dataOrientation !== null) {
                    dataOrientation = i === 0 ? dataOrientation : Math.abs(dataOrientation - 1);
                } else {
                    dataOrientation = i === 0 ? Charts.RowCol.rows : Charts.RowCol.columns;
                }
                if (self._dialogType === SelectChartDialog.dialogType.insertChart && self._isSelectPieChartType()) {
                    dataOrientation = null;
                }
                chartOptions.push({
                    chartType: self._selectedItem.chartType,
                    dataFormula: self._dataFormula,
                    colorAndStyle: colorAndStyle,
                    series: self._series[i],
                    category: self._selectedItem.category,
                    dataOrientation: dataOrientation,
                    axes: axes,
                    dataLabels: dataLabels,
                    chartArea: chartArea,
                    legend: legend,
                    title: title
                });
            }
            //     if(self._selectedItem.category === chartHelper.chartTypeDict["52"].chartGroup){
            //     chartOptions.push({
            //         chartType: self._selectedItem.chartType,
            //         dataRange:self._chartData.dataRange,
            //         colorAndStyle: colorAndStyle,
            //         category:self._selectedItem.category,
            //         dataOrientation:self._selectedItem.dataOrientation
            //     });
            // } else {
            //     for (var i = 0; i < self._series.length; i++) {
            //         chartOptions.push({
            //             chartType: self._selectedItem.chartType,
            //
            //             colorAndStyle: colorAndStyle
            //         });
            //     }
            // }
            return chartOptions;
        };
        SelectChartDialog.prototype._isSelectComboChartType = function () {
            if (this._selectedItem.category === chartHelper.chartTypeDict["0"].chartGroup) {
                return true;
            }
        };
        SelectChartDialog.prototype._isSelectSunburstChartType = function () {
            if (this._selectedItem.category === chartHelper.chartTypeDict["57"].chartGroup) {
                return true;
            }
        };
        SelectChartDialog.prototype._isSelectTreemapChartType = function () {
            if (this._selectedItem.category === chartHelper.chartTypeDict["58"].chartGroup) {
                return true;
            }
        };
        SelectChartDialog.prototype._isSelectStockGroupChartType = function () {
            if (this._selectedItem.category === chartHelper.chartTypeDict["50"].chartGroup) {
                return true;
            }
        };
        SelectChartDialog.prototype._isSelectPieChartType = function () {
            if (this._selectedItem.chartType === chartHelper.chartTypeDict["10"].chartType) {
                return true;
            }
        };
        SelectChartDialog.prototype._createSeriesItems = function () {
            var self = this;
            var element = self._element;
            var sheet = designer.wrapper.spread.getActiveSheet();
            var container = element.find(".series-content-items");
            container.empty();
            var colorAndStyle;
            if (self._chart) {
                colorAndStyle = self._chart.colorAndStyle;
            }
            var series = self._series[0];
            var count = series.length;
            for (var i = 0; i < count; i++) {
                var seriesItem = series[i];
                var seriesNameRef = seriesItem.name;
                var seriesName = "";
                if (seriesNameRef) {
                    var seriesNameRange = formulaToRange(sheet, seriesNameRef.substring(seriesNameRef.indexOf("!") + 1));
                    if (seriesNameRange) {
                        seriesName = sheet.getCell(seriesNameRange.row, seriesNameRange.col).text();
                    } else {
                        seriesName = seriesNameRef;
                    }
                }
                var checked = seriesItem.axisGroup === Charts.AxisGroup.primary ? "" : "checked";
                var chartType = chartHelper.getChartTypeString(seriesItem.chartType);
                var chartTypeText = designer.res.selectChartDialog[chartType];
                var seriesColor = chartHelper.getSeriesColor(colorAndStyle, count, i);
                var seriesItemContainer = $("<div class='series-item'></div>");
                var seriesItemName = $("<div class='series-name'>" +
                    "<span class='series-item-color' style='background-color:" +
                    seriesColor +
                    "'></span>" +
                    "<span class='series-item-name'>" +
                    seriesName +
                    "</span>" +
                    "</div>");
                var seriesItemType = $("<div class='series-chart-type-container'>" +
                    "<div class='series-chart-type-selected'>" +
                    chartTypeText +
                    "</div>" +
                    "</div>");
                var seriesItemAxis = $("<div class='series-secondary-axis'>" +
                    "<input type='checkbox' class='series-secondary-axis-checkbox'" +
                    checked +
                    "/>" +
                    "</div>");
                seriesItemName.appendTo(seriesItemContainer);
                seriesItemType.appendTo(seriesItemContainer);
                seriesItemAxis.appendTo(seriesItemContainer);
                seriesItemContainer.appendTo(container);
            }
        };
        return SelectChartDialog;
    })(designer.BaseDialog);
    SelectChartDialog.dialogType = {
        insertChart: 0,
        changeChartType: 1
    };
    designer.SelectChartDialog = SelectChartDialog;

    var MoveChartDialog = (function (_super) {
        designer.extends(MoveChartDialog, _super);

        function MoveChartDialog() {
            _super.call(this, (dialogHtmlPath), '.move-chart-dialog');
            this._activeOptionType = MoveChartDialog.sheetType.existingSheets;
        }

        MoveChartDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: '655px',
                resizable: false,
                modal: true,
                title: designer.res.moveChartDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
                            self.close();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        MoveChartDialog.prototype._init = function () {
            var self = this;
            self._addEventListener();
        };

        MoveChartDialog.prototype._beforeOpen = function (args) {
            var self = this;
            var spread = designer.wrapper.spread;
            var sheets = spread.sheets;
            var chart = chartHelper.getSelectedChart(spread.getActiveSheet());
            self._initNewChartSheetOptions(chart, sheets);
            self._initExistingSheetsOptions(sheets);
            self._setActiveSheetType();
        };

        MoveChartDialog.prototype._initExistingSheetsOptions = function (sheets) {
            var optionsContainer = $("#existingSheetName");
            optionsContainer.empty();
            for (var i = 0; i < sheets.length; i++) {
                var sheetName = sheets[i].name();
                var optionElem = $("<option></option>");
                optionElem.attr("value", sheetName);
                optionElem.text(sheetName);
                optionElem.appendTo(optionsContainer);
            }
        };

        MoveChartDialog.prototype._initNewChartSheetOptions = function (chart, sheets) {
            var newSheetName = chart.name();
            var num = 1;
            while (!this._judgeNewChartNameIsVisible(newSheetName, sheets)) {
                newSheetName = 'Chart ' + num;
                num++;
            }
            $("#chartSheetName").val(newSheetName);
        };

        MoveChartDialog.prototype._judgeNewChartNameIsVisible = function (name, sheets) {
            for (var i = 0; i < sheets.length; i++) {
                var sheet = sheets[i];
                if (name === sheet.name()) {
                    return false;
                }
            }
            return true;
        };

        MoveChartDialog.prototype._setActiveSheetType = function () {
            if (this._activeOptionType === MoveChartDialog.sheetType.newSheet) {
                $("#moveToNewSheet").prop("checked", true);
            } else {
                $("#moveToExistingSheet").prop("checked", true);
            }
        };

        MoveChartDialog.prototype._applySetting = function () {
            var option = {};
            if (this._activeOptionType === MoveChartDialog.sheetType.newSheet) {
                option.targetSheetName = $("#chartSheetName").val();
                option.type = "newSheet";
            } else {
                option.targetSheetName = $("#existingSheetName").val();
                option.type = "existingSheet";
            }
            designer.actions.doAction('moveChart', designer.wrapper.spread, option);
        };

        MoveChartDialog.prototype._addEventListener = function () {
            var self = this;
            $("#chartSheetName").on("click", function () {
                self._activeOptionType = MoveChartDialog.sheetType.newSheet;
                self._setActiveSheetType();
            });

            $("#existingSheetName").on("click", function () {
                self._activeOptionType = MoveChartDialog.sheetType.existingSheets;
                self._setActiveSheetType();
            });

            $('input:radio[name=moveToSheetType]').change(function () {
                self._activeOptionType = MoveChartDialog.sheetType[this.value];
            });
        };

        return MoveChartDialog;
    })(designer.BaseDialog);
    designer.MoveChartDialog = MoveChartDialog;
    MoveChartDialog.sheetType = {
        newSheet: 0,
        existingSheets: 1
    };

    var CHANGESELECTEDTYPE = {
        RECHOOSE: 0,
        EDIT: 1,
        REMOVE: 2,
        REORDER: 3,
        ADD: 4
    };
    var chartSelectDataDialog = (function (_super) {
        designer.extends(ChartSelectDataDialog, _super);

        function ChartSelectDataDialog() {
            _super.call(this, (dialogHtmlPath), '.chart-select-data');
            this._selectedSeries = null;
            this._middleChartSeriesModel = null;
            this.series = null;
        }

        ChartSelectDataDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: '655px',
                resizable: false,
                modal: true,
                title: designer.res.selectData.selectDataSource,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var isChanged = self._judgeModelIsChanged();
                            self.close();
                            designer.wrapper.setFocusToSpread();
                            if (isChanged) {
                                designer.actions.doAction("updateChartAllSeries", designer.wrapper.spread, {
                                    seriesArray: self._middleChartSeriesModel,
                                    chart: self._activeChart
                                });
                            }
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };

        ChartSelectDataDialog.prototype._init = function () {
            var self = this;
            this._addEventListener();
            $(".hidden-empty-button").on('click', function () {
                self.close();
                if (!self._hiddenEmpty) {
                    self._hiddenEmpty = new designer.chartHiddenEmptyCellDialog();
                }
                self._hiddenEmpty._acChart = self._activeChart;
                self._hiddenEmpty.open();
            })
            //create rangeSelect
            if (!self._rangeSelect) {
                self._rangeSelect = new designer.RangeSelectDialog(self, { absoluteReference: true });
            }
        };

        ChartSelectDataDialog.prototype._beforeOpen = function (args) {
            this._activeChart = args[0];
            this._series = this._activeChart.series();
            this._middleChartSeriesModel = this._series.get();
            this._middleDataRangeFormula = this._activeChart.dataRange();
            this._chart = this._createChartWithSeries(this._middleChartSeriesModel);
            this._selectedSeries = null;
            this._selectedCategory = null;
            this._seriesDomArray = [];
            this._updateDataRangeInput();
            this._updateSeriesItem();
            this._updateSelectedSeries(CHANGESELECTEDTYPE.RECHOOSE);
            this._updateCategoryItem();
            this._updateUpAndDownBtnStyle();
        };
        //create all tableCell
        ChartSelectDataDialog.prototype._createChooseDom = function (name, className, checkIsChoose) {
            var dom = document.createElement('div');
            dom.className = className;
            var checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            var nameDom = document.createElement('span');
            nameDom.className = 'chart-select-data-select-text';
            if (name === null || name === undefined) {
                name = '';
            }
            name = name.toString();
            nameDom.innerHTML = name.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, "&quot;").replace(/'/g, "&#039;");
            /*        dom.appendChild(checkBox);*/
            dom.appendChild(nameDom);
            return dom;
        };
        //create chart with series
        ChartSelectDataDialog.prototype._createChartWithSeries = function (series) {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var chart = new GC.Spread.Sheets.Charts.Chart(sheet, 'middleChart', undefined, 0, 0, 100, 100, null);
            // seriesCollection is able to handle a series array, and this way has a better performance. 
            chart.series().add(series);
            return chart;
        };
        //edit seriesModel
        ChartSelectDataDialog.prototype._editSeriesModel = function (index, item) {
            if (index < this._middleChartSeriesModel.length) {
                var series = this._middleChartSeriesModel[index];
                var beforeYValueRange = this._getRangeByFormula(series.yValues);
                var afterYValueRange = this._getRangeByFormula(item.yValues);

                //when the chartGroupe is ScatterGroup, need to show xValues and Size(the type is 'bubble') when click edit and add
                var chartGroupe = chartHelper.getChartGroupString(this._activeChart.chartType());
                var chartType = chartHelper.getChartTypeString(this._activeChart.chartType());
                if (chartGroupe === 'ScatterGroup') {
                    var beforeXValueRange = this._getRangeByFormula(series.xValues);
                    var afterXValueRange = this._getRangeByFormula(item.xValues);
                    if ((isNullOrUndefined(beforeXValueRange) && !isNullOrUndefined(afterXValueRange)) ||
                        (!isNullOrUndefined(afterXValueRange) && !isNullOrUndefined(beforeXValueRange))) {
                        series.xValues = item.xValues;
                    }
                    if (isNullOrUndefined(beforeXValueRange) && isNullOrUndefined(afterXValueRange)) {
                        designer.MessageBox.show(designer.res.selectData.errorPrompt.seriesValueIsIllegal, 'Error', 2);
                        return;
                    }
                    if (chartType === 'bubble') {
                        var beforeSizeRange = this._getRangeByFormula(series.bubbleSizes);
                        var afterSizeRange = this._getRangeByFormula(item.bubbleSizes);
                        if ((isNullOrUndefined(beforeSizeRange) && !isNullOrUndefined(afterSizeRange)) ||
                            (!isNullOrUndefined(beforeSizeRange) && !isNullOrUndefined(afterSizeRange))) {
                            series.bubbleSizes = item.bubbleSizes;
                        }
                        if (isNullOrUndefined(beforeSizeRange) && isNullOrUndefined(afterSizeRange)) {
                            designer.MessageBox.show(designer.res.selectData.errorPrompt.seriesValueIsIllegal, 'Error', 2);
                            return;
                        }
                    }
                }

                if (isNullOrUndefined(beforeYValueRange) && isNullOrUndefined(afterYValueRange)) {
                    designer.MessageBox.show(designer.res.selectData.errorPrompt.seriesValueIsIllegal, 'Error', 2);
                    return;
                } else {
                    series.name = item.name;
                    series.yValues = item.yValues;
                    this._chart.series().set(index, series);
                }
            }
            this._updateAllDialogModelAndView(CHANGESELECTEDTYPE.EDIT);
        };
        //add seriesModel
        ChartSelectDataDialog.prototype._addSeriesModel = function (item) {
            var series = {};
            if (this._middleChartSeriesModel.length > 0) {
                series = this._middleChartSeriesModel[0];
            } else if (this._series.get().length > 0) {
                series = this._series.get()[0];
            }
            if (series.yValues) {
                var beforeRange = this._getRangeByFormula(series.yValues);
                var afterRange = this._getRangeByFormula(item.yValues);
                if (beforeRange.rowCount === afterRange.rowCount && beforeRange.colCount === afterRange.colCount) {
                    item.xValues = series.xValues;
                    this._chart.series().add(item);
                    this._updateAllDialogModelAndView(CHANGESELECTEDTYPE.ADD);
                } else {
                    designer.MessageBox.show(designer.res.selectData.errorPrompt.seriesValueIsIllegal, 'Error', 2);
                    return;
                }
            }

        };
        //delete seriesModel
        ChartSelectDataDialog.prototype._deleteSeriesModel = function (index) {
            this._chart.series().remove(index);
            this._updateAllDialogModelAndView(CHANGESELECTEDTYPE.REMOVE);
        };
        //reOrder seriesModel
        ChartSelectDataDialog.prototype._reOrderSeriesModel = function (beforeIndex, afterIndex) {
            if (beforeIndex < this._middleChartSeriesModel.length && afterIndex < this._middleChartSeriesModel.length) {
                var item = this._middleChartSeriesModel[beforeIndex];
                this._chart.series().set(beforeIndex, this._middleChartSeriesModel[afterIndex]);
                this._chart.series().set(afterIndex, item);
                this._updateAllDialogModelAndView(CHANGESELECTEDTYPE.REORDER);
            }
        };
        //reSet category seriesModel
        ChartSelectDataDialog.prototype._reSetCategorySeriesModel = function (index, categoryFormula) {
            var seriesItem = this._middleChartSeriesModel[index];
            seriesItem.xValues = categoryFormula;
            this._chart.series().set(index, seriesItem);
        };
        //reSet seriesModel
        ChartSelectDataDialog.prototype._reSetSeriesModelByRangeFormula = function (rangeFormula) {
            this._chart.dataRange(rangeFormula);
            this._updateAllDialogModelAndView(CHANGESELECTEDTYPE.RECHOOSE);
        };
        //update all model and dialog ui
        ChartSelectDataDialog.prototype._updateAllDialogModelAndView = function (changeSelectedType) {
            this._getMiddleChartSeriesModel();
            this._getMiddleSeriesDataRange();
            this._updateSeriesItem();
            this._updateSelectedSeries(changeSelectedType);
            this._updateCategoryItem();
            this._updateDataRangeInput();
            this._updateUpAndDownBtnStyle();
        };
        //update series model
        ChartSelectDataDialog.prototype._getMiddleChartSeriesModel = function () {
            this._middleChartSeriesModel = this._chart.series().get();
        };
        //update dataRange
        ChartSelectDataDialog.prototype._getMiddleSeriesDataRange = function () {
            this._middleDataRangeFormula = this._chart.dataRange();
        };
        //update dataRange input ui
        ChartSelectDataDialog.prototype._updateDataRangeInput = function () {
            var formula = this._middleDataRangeFormula || '';
            if (formula === '') {
                this._element.find('.chart-select-data-range-noShow-desc').css({ visibility: 'visible' });
            } else {
                this._element.find('.chart-select-data-range-noShow-desc').css({ visibility: 'hidden' });
            }
            this._element.find('.chart-select-data-range-input').val(formula);
        };
        //update all series items ui
        ChartSelectDataDialog.prototype._updateSeriesItem = function () {
            var itemBox = document.getElementById('itemBox0');
            itemBox.innerHTML = '';
            this._seriesDomArray = [];
            for (var i = 0; i < this._middleChartSeriesModel.length; i++) {
                var series = this._middleChartSeriesModel[i];
                if (series.name) {
                    var seriesName = '';
                    //series.name not a formula is a nameString
                    var range = this._getRangeByFormula(series.name);
                    //serries.name could be a formula or a name string;
                    if (range) {
                        var sheet = chartHelper.getSheetFromFormula(series.name);
                        var cell = sheet.getCell(range.row, range.col);
                        seriesName = cell.text();
                    } else {
                        seriesName = series.name;
                    }
                    var dom = this._createChooseDom(seriesName, 'chart-select-data-select-series', false);
                    dom.dataset.seriesIndex = i;
                    itemBox.appendChild(dom);
                    this._seriesDomArray.push($(dom));
                }
            }

            this._addChooseCellEventListener();
        };
        //update Selected series
        ChartSelectDataDialog.prototype._updateSelectedSeries = function (changeSelectedType) {
            switch (changeSelectedType) {
                case CHANGESELECTEDTYPE.RECHOOSE:
                    this._selectedSeries = this._seriesDomArray[0];
                    break;
                case CHANGESELECTEDTYPE.EDIT:
                    this._selectedSeries = this._seriesDomArray[this._selectedSeries.data('seriesIndex')];
                    break;
                case CHANGESELECTEDTYPE.REMOVE:
                    if (this._selectedSeries.data('seriesIndex') === 0) {
                        this._selectedSeries = this._seriesDomArray[0];
                    } else if (this._seriesDomArray.length > (this._selectedSeries.data('seriesIndex') - 1)) {
                        this._selectedSeries = this._seriesDomArray[this._selectedSeries.data('seriesIndex') - 1];
                    } else {
                        this._selectedSeries = null;
                    }
                    break;
                case CHANGESELECTEDTYPE.ADD:
                    this._selectedSeries = this._seriesDomArray[this._seriesDomArray.length - 1];
                    break;
                case CHANGESELECTEDTYPE.REORDER:
                    for (var i = 0; i < this._seriesDomArray.length; i++) {
                        var dom = this._seriesDomArray[i];
                        if (dom.context.innerText === this._selectedSeries.context.innerText) {
                            this._selectedSeries = dom;
                            break;
                        }
                    }
                    break;
            }
            this._updateSelectedUI(null, this._selectedSeries, 'chart-select-data-cell-selected');
        };
        //update all Category items ui
        ChartSelectDataDialog.prototype._updateCategoryItem = function () {
            var itemBox = document.getElementById('itemBox1');
            itemBox.innerHTML = '';
            var valuesArray = [];
            //get values array
            if (this._selectedSeries && this._middleChartSeriesModel) {
                var index = this._selectedSeries.data('seriesIndex');
                if (this._middleChartSeriesModel.length > index) {
                    var xValues = this._middleChartSeriesModel[index].xValues;
                    //when series don't have xValues,that use 0,1,2,3,4,5,6,7,8,9 replace xValues.
                    if (!xValues) {
                        var yValues = this._middleChartSeriesModel[index].yValues;
                        var yValuesRange = this._getRangeByFormula(yValues);
                        if (yValuesRange) {
                            var yValuesCount = yValuesRange.rowCount > yValuesRange.colCount ? yValuesRange.rowCount : yValuesRange.colCount;
                            for (var j = 0; j < yValuesCount; j++) {
                                valuesArray.push(j + 1);
                            }
                        }
                    } else {
                        var range = this._getRangeByFormula(xValues);
                        var rangeSheet = chartHelper.getSheetFromFormula(xValues);
                        if (range) {
                            valuesArray = this._getValuesByRange(range, rangeSheet);
                        }
                    }
                }
            }
            //create Dom
            if (valuesArray) {
                for (var i = 0; i < valuesArray.length; i++) {
                    var value = valuesArray[i];
                    var dom = this._createChooseDom(value, 'chart-select-data-select-category', false);
                    dom.dataset.categoryIndex = i;
                    itemBox.appendChild(dom);
                }
            }
            this._addChooseCategoryEventListener();
        };
        //update selected tableCell  ui
        ChartSelectDataDialog.prototype._updateSelectedUI = function (allItem, changeItem, className) {
            if (allItem) {
                allItem.removeClass(className);
            }
            if (changeItem) {
                changeItem.addClass(className);
            }
        };
        //update UpAndDownBtnStyle
        ChartSelectDataDialog.prototype._updateUpAndDownBtnStyle = function () {
            if (this._selectedSeries) {
                var index = this._selectedSeries.data('seriesIndex');
                var upTrangleDom = document.getElementById('upBtnTrangle');
                var downTrangleDom = document.getElementById('downBtnTrangle');
                upTrangleDom.className = 'chart-select-data-option-upBtn-normal-trangle';
                downTrangleDom.className = 'chart-select-data-option-downBtn-normal-trangle';
                if (index === 0) {
                    upTrangleDom.className = 'chart-select-data-option-upBtn-UnClick-trangle';
                } else if (index === (this._middleChartSeriesModel.length - 1)) {
                    downTrangleDom.className = 'chart-select-data-option-downBtn-unclick-trangle';
                }
            }
        };
        //
        ChartSelectDataDialog.prototype._getRangeByFormula = function (formula) {
            if (formula) {
                var sheet = chartHelper.getSheetFromFormula(formula);
                var dataFormula = formulaToRanges(sheet, formula, 0, 0)[0];
                if (dataFormula) {
                    return dataFormula.ranges[0];
                }
            }
        };

        ChartSelectDataDialog.prototype._getValuesByRange = function (range, sheet) {
            var valuesArray = [];
            var chartGroupString = chartHelper.getChartGroupString(this._activeChart.chartType());
            if (range) {
                if ((chartGroupString === chartHelper.chartTypeDict["57"].chartGroup || chartGroupString === chartHelper.chartTypeDict["58"].chartGroup)) {
                    var formualX = this._series.get(0).xValues;
                    var formualY = this._series.get(0).yValues;
                    if (!isNullOrUndefined(formualX) && !isNullOrUndefined(formualY)) {
                        var rangeX = this._getRangeByFormula(formualX);
                        var rangeY = this._getRangeByFormula(formualY);
                        var catDataArray = sheet.getArray(rangeX.row, rangeX.col, rangeX.rowCount, rangeX.colCount);
                        var valueArray = sheet.getArray(rangeY.row, rangeY.col, rangeY.rowCount, rangeY.colCount);
                        var datasource = chartHelper.getDataSourceByCatArray(this, this._makeSingleDimensionArray(catDataArray), this._makeSingleDimensionArray(valueArray));
                        valuesArray = chartHelper.getCatString(datasource);
                    }
                } else {
                    if (range.rowCount === 1) {
                        for (var i = 0; i < range.colCount; i++) {
                            valuesArray.push(sheet.getCell(range.row, range.col + i).text());
                        }
                    } else if (range.colCount === 1) {
                        for (var j = 0; j < range.rowCount; j++) {
                            valuesArray.push(sheet.getCell(range.row + j, range.col).text());
                        }
                    }
                }
            }
            return valuesArray;
        };
        ChartSelectDataDialog.prototype._makeSingleDimensionArray = function (doubleDimensionArray) {
            var singleDimensionArray = [];
            for (var i = 0; i < doubleDimensionArray.length; i++) {
                singleDimensionArray = singleDimensionArray.concat(doubleDimensionArray[i]);
            }
            return singleDimensionArray;
        };

        ChartSelectDataDialog.prototype._addEventListener = function () {
            var self = this, element = self._element;
            var $rangeSelectInput = $('.chart-select-data-range-input');
            var rangeSelectedBtn = element.find(".rangeSelectButton");
            var switchBtn = element.find(".chart-select-data-switch-box-middle");
            var changeBtns = element.find(".chart-select-data-option-one-btn-box");
            var upDownBtn = element.find(".chart-select-data-option-upDown-btn");
            $rangeSelectInput.focusout(function () {
                self._rangeSelectCallBack($rangeSelectInput[0].value);
            });
            rangeSelectedBtn.click(function () {
                var formula = self._middleDataRangeFormula || '';
                self.hide();
                self._rangeSelect.open(designer.res.selectData.selectDataSource, self._rangeSelectCallBack, formula);
            });
            switchBtn.click(function (e) {
                if (chartHelper.getChartGroupString(self._activeChart.chartType()) !== chartHelper.chartTypeDict["50"].chartGroup) {
                    var isSwitched = self._chart.switchDataOrientation();
                    if (isSwitched) {
                        var themeOptions = self._activeChart.colorAndStyle && self._activeChart.colorAndStyle.color;
                        if (themeOptions) {
                            chartHelper.applyChartSeriesTheme(self._chart, themeOptions);
                        }
                        self._updateAllDialogModelAndView(CHANGESELECTEDTYPE.RECHOOSE);
                    } else {
                        designer.MessageBox.show(designer.res.selectData.errorPrompt.cantSwitchRowColumn, designer.res.title, 2);
                    }
                } else {
                    designer.MessageBox.show(designer.res.selectData.errorPrompt.cantSwitchRowColumn, designer.res.title, 2);
                }
            });
            upDownBtn.click(function (e) {
                if (self._selectedSeries) {
                    var $btn = $(e.currentTarget);
                    var index = self._selectedSeries.data('seriesIndex');
                    if ($btn.data('name') === 'Up') {
                        if (index > 0) {
                            self._reOrderSeriesModel(index, index - 1);
                        }
                    } else if (($btn.data('name') === 'Down') && ((index + 1) < self._middleChartSeriesModel.length)) {
                        self._reOrderSeriesModel(index, index + 1);
                    }
                }
            });
            changeBtns.click(function (e) {
                var $changeBtn = $(e.currentTarget);
                var chooseSeries = self._middleChartSeriesModel[self._selectedSeries.data('seriesIndex')];
                var chartType = self._activeChart.chartType();
                if ($changeBtn.data('name') === 'Remove') {
                    if (self._selectedSeries && self._middleChartSeriesModel) {
                        if (self._middleChartSeriesModel.length === 1) {
                            designer.MessageBox.show(designer.res.selectData.errorPrompt.cantRemoveLastSeries, 'Error', 2);
                        } else {
                            var index = self._selectedSeries.data('seriesIndex');
                            if (index !== null && index !== undefined) {
                                self._deleteSeriesModel(index);
                            }
                        }
                    }
                } else if ($changeBtn.data('name') === 'Add') {
                    var addSeries = new designer.ChartEditSeries(self, self._addCallBack, {}, true, chartType);
                    self.hide();
                    addSeries.open();
                } else if ($changeBtn.data('name') === 'Edit') {
                    var editSeries = new designer.ChartEditSeries(self, self._editCallBack, {
                        name: chooseSeries.name,
                        yValue: chooseSeries.yValues,
                        xValue: chooseSeries.xValues,
                        size: chooseSeries.bubbleSizes || null
                    }, false, chartType);
                    self.hide();
                    editSeries.open();
                } else if ($changeBtn.data('name') === 'EditCategory') {
                    self.hide();
                    self._rangeSelect.open(designer.res.selectData.selectDataSource, self._editCategoryCallBack, chooseSeries.xValues);
                }
            });
        };

        ChartSelectDataDialog.prototype._addChooseCellEventListener = function () {
            var self = this, element = self._element;
            var seriesCells = element.find(".chart-select-data-select-series");
            seriesCells.click(function (e) {
                self._selectedSeries = $(e.currentTarget);
                self._updateSelectedUI(seriesCells, self._selectedSeries, 'chart-select-data-cell-selected');
                self._selectedCategory = null;
                self._updateCategoryItem();
                self._updateUpAndDownBtnStyle();
            });

        };

        ChartSelectDataDialog.prototype._addChooseCategoryEventListener = function () {
            var self = this, element = self._element;
            var categoryCells = element.find(".chart-select-data-select-category");
            categoryCells.click(function (e) {
                self._selectedCategory = $(e.currentTarget);
                self._updateSelectedUI(categoryCells, self._selectedCategory, 'chart-select-data-cell-selected');
            });
        };
        //select range callBack
        ChartSelectDataDialog.prototype._rangeSelectCallBack = function (newFormula) {
            var oldFormula = this._middleDataRangeFormula || '';
            newFormula = this._changeAllFormulaToNormallFormula(newFormula);
            if (newFormula === '' || newFormula === '=' || oldFormula === newFormula || ('=' + oldFormula) === newFormula) {
                return;
            }
            this._reSetSeriesModelByRangeFormula(newFormula);
        };
        //add series callBack
        ChartSelectDataDialog.prototype._addCallBack = function (addResult) {
            if (addResult) {
                var result = {};
                for (var key in addResult) {
                    result[key] = this._changeAllFormulaToNormallFormula(addResult[key]);
                }
                this._addSeriesModel(result);
            }
        };
        //edit category callBack
        ChartSelectDataDialog.prototype._editCategoryCallBack = function (categoryFormula) {
            if (categoryFormula && categoryFormula !== '=') {
                var self = this;
                categoryFormula = this._changeAllFormulaToNormallFormula(categoryFormula);
                var newSheet = chartHelper.getSheetFromFormula(categoryFormula);
                var range = formulaToRange(newSheet, categoryFormula);
                var oldSeries = self._middleChartSeriesModel[self._selectedSeries.data('seriesIndex')];
                var oldSheet = chartHelper.getSheetFromFormula(oldSeries.xValues);
                var oldXValueRange = formulaToRange(oldSheet, oldSeries.xValues);
                var oldYValuesRange = formulaToRange(oldSheet, oldSeries.yValues);
                var isOldRangeAndEqual = oldXValueRange && range.rowCount === oldXValueRange.rowCount && range.colCount === oldXValueRange.colCount;
                var isNotOldRangeAndEqual = !oldXValueRange && oldYValuesRange && range.rowCount === oldYValuesRange.rowCount && range.colCount === oldYValuesRange.colCount;
                if (isOldRangeAndEqual || isNotOldRangeAndEqual) {
                    this._middleChartSeriesModel.forEach(function (series, index) {
                        self._reSetCategorySeriesModel(index, categoryFormula);
                    });
                    this._updateAllDialogModelAndView(CHANGESELECTEDTYPE.EDIT);
                } else {
                    designer.MessageBox.show(designer.res.selectData.errorPrompt.categoryValueIsIllegal, 'Error', 2);
                }
            } else {
                designer.MessageBox.show(designer.res.selectData.errorPrompt.categoryValueIsIllegal, 'Error', 2);
            }
        };
        //edit series dallBack
        ChartSelectDataDialog.prototype._editCallBack = function (editResult) {
            if (this._selectedSeries) {
                var result = {};
                for (var key in editResult) {
                    result[key] = this._changeAllFormulaToNormallFormula(editResult[key]);
                }
                this._editSeriesModel(this._selectedSeries.data('seriesIndex'), result);
            }
        };
        //judge model is changed
        ChartSelectDataDialog.prototype._judgeModelIsChanged = function () {
            var model0 = this._middleChartSeriesModel;
            var model1 = this._activeChart.series().get();
            if (model0.length === model1.length) {
                for (var i = 0; i < model0.length; i++) {
                    var item0 = model0[i];
                    var item1 = model1[i];
                    if (item0.name !== item1.name || item0.xValues !== item1.xValues || item0.yValues !== item1.yValues || item0.bubbleSizes !== item1.bubbleSizes) {
                        return true;
                    }
                }
                return false;
            } else {
                return true;
            }
        };

        //formula maybe a tableFormula,need to change to normal formula
        ChartSelectDataDialog.prototype._changeAllFormulaToNormallFormula = function (beforeFormula) {
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            var expr = {};
            var afterFormula = beforeFormula;
            if (beforeFormula && beforeFormula !== '=') {
                expr = GC.Spread.Sheets.CalcEngine.formulaToExpression(activeSheet, beforeFormula);
                afterFormula = GC.Spread.Sheets.CalcEngine.expressionToFormula(activeSheet, expr, 0, 0, false, true);
            }
            return afterFormula;
        };

        /*    ChartSelectDataDialog.prototype._updateDataRangeItem = function () {
    
         var sheet = designer.wrapper.spread.getActiveSheet();
         var smallRangeArray = [];
         /!*        if(this._middleChartSeriesModel.length>0){
         var range = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet,this._middleChartSeriesModel[0].xValues);
         smallRangeArray.push(range);
         }*!/
         this._middleChartSeriesModel.forEach(function (serie) {
         var range = GC.Spread.Sheets.CalcEngine.formulaToRange(sheet,serie.yValues);
         smallRangeArray.push(range);
         });
         var bigRangeArray = this._changeSmallRangeToBigRange(smallRangeArray);
         var formulsString = '';
         bigRangeArray.forEach(function (rangeItem) {
         var formula = GC.Spread.Sheets.CalcEngine.rangeToFormula(rangeItem);
         if(formulsString === ''){
         formulsString = formula;
         }else {
         formulsString = formulsString + ' , ' + formula;
         }
         });
         this._element.find('.chart-select-data-range-input').val(formulsString);
         };*/

        return ChartSelectDataDialog;
    })(designer.BaseDialog);
    designer.ChartSelectDataDialog = chartSelectDataDialog;

    var chartEditSeries = (function (_super) {
        designer.extends(ChartEditSeries, _super);

        function ChartEditSeries(_parentDialog, callBack, value, isAdd, chartType) {
            this._parentDialog = _parentDialog;
            this._callBack = callBack;
            this._name = value ? (value.name || '') : '';
            this._yValue = value ? (value.yValue || '') : '';
            this._xValue = value ? (value.xValue || '') : '';
            this._size = value ? (value.size || '') : '';
            this._isAdd = isAdd;
            this._chartGroupe = chartHelper.getChartGroupString(chartType);
            this._chartType = chartHelper.getChartTypeString(chartType);
            _super.call(this, (dialogHtmlPath), '.chart-edit-series');
        }

        ChartEditSeries.prototype._initOptions = function () {
            var self = this;
            return {
                width: '350px',
                resizable: false,
                modal: true,
                title: self._isAdd ? designer.res.selectData.addSeries : designer.res.selectData.editSeries,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            if (self._callBack) {
                                var args = {};
                                if (self._size === '' || self._size === '=' || self._size === undefined || self._size === null) {
                                    args = {
                                        name: self._name,
                                        yValues: self._yValue,
                                        xValues: self._xValue
                                    };
                                } else {
                                    args = {
                                        name: self._name,
                                        yValues: self._yValue,
                                        xValues: self._xValue,
                                        bubbleSizes: self._size
                                    };
                                }
                                self._callBack.apply(self._parentDialog, [args]);
                            }
                            self.close();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                            /*designer.wrapper.setFocusToSpread();*/
                        }
                    }
                ]
            };
        };

        ChartEditSeries.prototype._addEventListener = function () {
            var self = this, element = self._element;
            var $nameBtn = element.find('#nameRangeSelectBtn');
            var $valueBtn = element.find('#valueRangeSelectBtn');
            var $xValueBtn = element.find('#xValueRangeSelectBtn');
            var $sizeBtn = element.find('#sizeRangeSelectBtn');
            self._nameDom.focusout(function () {
                self._changeName(self._nameDom[0].value);
            });
            self._valueDom.focusout(function () {
                self._changeValue(self._valueDom[0].value);
            });
            self._xValueDom.focusout(function () {
                self._changeXValue(self._xValueDom[0].value);
            });
            self._sizeDom.focusout(function () {
                self._changeSize(self._sizeDom[0].value);
            });
            $nameBtn.click(function () {
                self.hide();
                self._rangeSelect.open(designer.res.selectData.editSeriesName, self._changeName, self._name);
            });
            $valueBtn.click(function () {
                self.hide();
                self._rangeSelect.open(designer.res.selectData.editSeriesValue, self._changeValue, self._yValue);
            });
            $xValueBtn.click(function () {
                self.hide();
                self._rangeSelect.open(designer.res.selectData.editSeriesName, self._changeXValue, self._xValue);
            });
            $sizeBtn.click(function () {
                self.hide();
                self._rangeSelect.open(designer.res.selectData.editSeriesValue, self._changeSize, self._size);
            });
        };

        ChartEditSeries.prototype._init = function () {
            var self = this, element = self._element;
            if (this._chartGroupe !== 'ScatterGroup') {
                element.find("#xValueContainer").hide();
                element.find("#xValueDesc").hide();
                element.find("#sizeContainer").hide();
                element.find("#sizeDesc").hide();
            } else if (this._chartType !== 'bubble') {
                element.find("#sizeContainer").hide();
                element.find("#sizeDesc").hide();
            }
            this._nameDom = element.find("#name");
            this._valueDom = element.find("#value");
            this._xValueDom = element.find("#xValue");
            this._sizeDom = element.find("#seriesSize");
            this._nameDom.val(this._name);
            this._valueDom.val(this._yValue);
            this._xValueDom.val(this._xValue);
            this._sizeDom.val(this._size);
            this._addEventListener();
            //create rangeSelect
            if (!self._rangeSelect) {
                self._rangeSelect = new designer.RangeSelectDialog(self, { absoluteReference: true });
            }
        };

        ChartEditSeries.prototype._changeName = function (formula) {
            this._name = formula;
            this._nameDom.val(this._name);
        };

        ChartEditSeries.prototype._changeValue = function (formula) {
            this._yValue = formula;
            this._valueDom.val(this._yValue);
        };

        ChartEditSeries.prototype._changeXValue = function (formula) {
            this._xValue = formula;
            this._xValueDom.val(this._xValue);
        };

        ChartEditSeries.prototype._changeSize = function (formula) {
            this._size = formula;
            this._sizeDom.val(this._size);
        };

        ChartEditSeries.prototype._afterClose = function () {
            if (this._parentDialog) {
                this._parentDialog.show();
            }
        };

        return ChartEditSeries;

    })(designer.BaseDialog);
    designer.ChartEditSeries = chartEditSeries;
    // This is the js file for chart dialog
})();