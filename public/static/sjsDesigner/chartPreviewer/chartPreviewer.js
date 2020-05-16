(function () {
    'use strict';

    var designer = GC.Spread.Sheets.Designer;
    var Sheets = GC.Spread.Sheets;
    var Charts = Sheets.Charts;
    var rangeToFormula = Sheets.CalcEngine.rangeToFormula;
    var chartHelper = designer.util.chartHelper;
    var chartPreviewer = {};
    var spreadForPreview;
    var sheetForPreview;

    function initChartPreviewer() {
        spreadForPreview = new GC.Spread.Sheets.Workbook(document.getElementById("chartPreviewer"), { sheetCount: 1 });
    }
    chartPreviewer.initChartPreviewer = initChartPreviewer;

    function synchronizeData(spread) {
        spreadForPreview.fromJSON(JSON.parse(JSON.stringify(spread.toJSON({ ignoreStyle: true, ignoreFormula: true }))));
    }

    chartPreviewer.synchronizeData = synchronizeData;

    function getActiveSheet() {
        return spreadForPreview.getActiveSheet();
    }

    function createChart(option) {
        var category = option.category;
        try {
            var chart;
            sheetForPreview = getActiveSheet();
            var chartType = Charts.ChartType[option.chartType];
            var dataFormula = option.dataFormula;
            var rowCol = option.dataOrientation;
            var i;
            if (category === chartHelper.chartTypeDict["52"].chartGroup) {
                chart = sheetForPreview.charts.add("", chartType, 20, 20, 480, 288, dataFormula);
            } else if (chartType === Charts.ChartType.pie) {
                if (!dataFormula) {
                    var series0 = option.series[0];
                    dataFormula = series0.yValues;
                }
                if (dataFormula) {
                    chart = sheetForPreview.charts.add("", chartType, 20, 20, 480, 288, dataFormula, rowCol);
                }
            } else {
                if (dataFormula && category !== chartHelper.chartTypeDict["0"].chartGroup) {
                    chart = sheetForPreview.charts.add("", chartType, 20, 20, 480, 288, dataFormula, rowCol);
                } else {
                    chart = sheetForPreview.charts.add('', chartType, 20, 20, 480, 288);
                    var seriesCollection = chart.series();
                    seriesCollection.add(option.series);
                }
            }
            if (!chart) {
                return;
            }
            if (option.axes && chartHelper.getChartGroupString(chart.chartType()) !== chartHelper.chartTypeDict["3"].chartGroup) {
                chart.axes(option.axes);
            }
            if (option.dataLabels) {
                chart.dataLabels(option.dataLabels);
            }
            if (option.legend) {
                chart.legend(option.legend);
            }
            if (option.title) {
                chart.title(option.title);
            }
            if (option.chartArea) {
                chart.chartArea(option.chartArea);
            }

            if (category === chartHelper.chartTypeDict["3"].chartGroup && option.series.length > 0) {
                var series = chart.series();
                for (i = 0; i < series.length; i++) {
                    series.set(i, option.series[i]);
                }
            }
            if (option.colorAndStyle && option.colorAndStyle.color) {
                chartHelper.applyChartSeriesTheme(chart, option.colorAndStyle.color);
                chart.colorAndStyle = { color: option.colorAndStyle.color };
            }
            return chart;
        } catch (e) {
            var message;
            if (category === chartHelper.chartTypeDict["52"].chartGroup) {
                message = e.message;
            } else {
                message = "Chart are not available for the data you selected";
            }
            return message;
        }
    }

    function getChartPreviewCharts(chartOptions) {
        sheetForPreview = getActiveSheet();
        sheetForPreview.charts.clear();
        spreadForPreview.suspendPaint();
        var charts = [], i, chart;
        for (i = 0; i < chartOptions.length; i++) {
            chart = createChart(chartOptions[i]);
            charts.push(chart);
        }
        spreadForPreview.resumePaint();
        return charts;
    }

    chartPreviewer.getChartPreviewCharts = getChartPreviewCharts;

    function getPreviewCharts(defaultChartStyle, templatesChartStyle) {
        sheetForPreview = getActiveSheet();
        sheetForPreview.charts.clear();
        spreadForPreview.suspendPaint();
        var charts = [], i, chart;
        for (i = 0; i < templatesChartStyle.length; i++) {
            chart = createChart(defaultChartStyle);
            chartHelper.SetChartStyle(chart, templatesChartStyle[i], 'templetes', true);
            charts.push(chart);
        }
        spreadForPreview.resumePaint();
        return charts;
    }
    chartPreviewer.getPreviewCharts = getPreviewCharts;
    //#region Loader.Ready
    designer.loader.ready(function () {
        if (!designer.wrapper.spread.notWorking) {
            initChartPreviewer();
        }
    });
    designer.chartPreviewer = chartPreviewer;
})();