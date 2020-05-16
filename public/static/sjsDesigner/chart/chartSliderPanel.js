(function () {
    'use strict';

    var designer = GC.Spread.Sheets.Designer;
    var util = designer.util;
    var chartHelper = designer.util.chartHelper;
    var keyword_undefined = void 0;
    var ColorHelper = designer.ColorHelper;
    var chartTemplates = designer.chartTemplates;
    var chartErrorBarDialog = null;
    var defaultColor = 'rgba(91,155,213,1)';
    var chartDescription = {
        'baseChart': {
            series: {
                fillAndLine: { Line: ['fill', 'border'] },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
            trendline: {
                fillAndLine: { Line: ['fill'] },
                seriesOptions: { SeriesOptions: ['trendlineOptions'] } //todo
            },
            errorBar: {
                fillAndLine: { Line: ['fill'] },
                seriesOptions: { ErrorBarOptions: ['errorBarOptions'] }
            },
            chartArea: {
                fillAndLine: { Line: ['fill', 'border'] },
                sizeAndProperties: { Size: ['size'] },
                textFill: { Text: ['textFill', 'font'] }
            },
            chartTitle: {
                textFill: { Text: ['textFill', 'font', 'textElement'] }
            },
            legend: {
                fillAndLine: { Line: ['fill', 'border'] },
                legendPosition: { Legend: ['position'] },
                textFill: { Text: ['textFill', 'font'] }
            },
            dataLabels: {
                textFill: { Text: ['textFill'] }
            },
            primaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick', 'number'] },
            },
            primaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick', 'number'] },
            },
            primaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            primaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            primaryValueUnitsLabel: {
                textFill: { Text: ['unitsLabelTextFill', 'unitsLabelFont'] }
            },
            secondaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick', 'number'] }
            },
            secondaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick', 'number'] }
            },
            secondaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryValueUnitsLabel: {
                textFill: { Text: ['unitsLabelTextFill', 'unitsLabelFont'] }
            }
        },
        'columnClustered': {},
        'columnStacked': {},
        'columnStacked100': {},
        'line': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            }
        },
        'lineStacked': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
        },
        'lineStacked100': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
            chartArea: {
                fillAndLine: { Line: ['fill', 'border'] },
                sizeAndProperties: { Size: ['size'] },
                textFill: { Text: ['textFill', 'font'] }
            },
            chartTitle: {
                textFill: { Text: ['textFill', 'font', 'textElement'] }
            },
            dataLabels: {
                textFill: { Text: ['textFill'] }
            },
            primaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick', 'number'] },
            },
            primaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick', 'number'] },
            },
            primaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            primaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick', 'number'] },
            },
            secondaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick', 'number'] },
            },
            secondaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            }
        },
        'lineMarkers': {
            series: {
                fillAndLine: { Line: ['line', 'markerOptions', 'markerFill', 'markerBorder'] },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
            chartArea: {
                fillAndLine: { Line: ['fill', 'border'] },
                sizeAndProperties: { Size: ['size'] },
                textFill: { Text: ['textFill', 'font'] }
            },
            chartTitle: {
                textFill: { Text: ['textFill', 'font', 'textElement'] }
            },
            dataLabels: {
                textFill: { Text: ['textFill'] }
            },
            primaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick', 'number'] },
            },
            primaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick', 'number'] },
            },
            primaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            primaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick', 'number'] },
            },
            secondaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick', 'number'] },
            },
            secondaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            }
        },
        'lineMarkersStacked': {
            series: {
                fillAndLine: { Line: ['line', 'markerOptions', 'markerFill', 'markerBorder'] },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
            chartArea: {
                fillAndLine: { Line: ['fill', 'border'] },
                sizeAndProperties: { Size: ['size'] },
                textFill: { Text: ['textFill', 'font'] }
            },
            chartTitle: {
                textFill: { Text: ['textFill', 'font', 'textElement'] }
            },
            dataLabels: {
                textFill: { Text: ['textFill'] }
            },
            primaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick', 'number'] },
            },
            primaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick', 'number'] },
            },
            primaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            primaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick', 'number'] },
            },
            secondaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick', 'number'] },
            },
            secondaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            }
        },
        'lineMarkersStacked100': {
            series: {
                fillAndLine: { Line: ['line', 'markerOptions', 'markerFill', 'markerBorder'] },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
            chartArea: {
                fillAndLine: { Line: ['fill', 'border'] },
                sizeAndProperties: { Size: ['size'] },
                textFill: { Text: ['textFill', 'font'] }
            },
            chartTitle: {
                textFill: { Text: ['textFill', 'font', 'textElement'] }
            },
            dataLabels: {
                textFill: { Text: ['textFill'] }
            },
            primaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick', 'number'] },
            },
            primaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick', 'number'] },
            },
            primaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            primaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            primaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            primaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryCategory: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisCategory', 'tick', 'number'] },
            },
            secondaryValue: {
                fillAndLine: { Line: ['line'] },
                textFill: { Text: ['textFill', 'font'] },
                axisOptions: { Axis: ['axisValue', 'tick', 'number'] },
            },
            secondaryCategoryTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryValueTitle: {
                textFill: { Text: ['titleTextFill', 'titleFont', 'titleTextElement'] }
            },
            secondaryCategoryMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryValueMajorGridLine: {
                fillAndLine: { MajorLine: ['majorLine'] }
            },
            secondaryCategoryMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            },
            secondaryValueMinorGridLine: {
                fillAndLine: { MinorLine: ['minorLine'] }
            }
        },
        'pie': {
            series: {
                fillAndLine: { Line: ['fillPie', 'border'] },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
        },
        'doughnut': {
            series: {
                fillAndLine: { Line: ['fillPie', 'border'] },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            }
        },
        'barClustered': {},
        'barStacked': {},
        'barStacked100': {},
        'area': {},
        'areaStacked': {},
        'areaStacked100': {},
        'xyScatter': {
            series: {
                fillAndLine: { Line: ['fill']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            }
        },
        'xyScatterSmooth': {
            series: {
                fillAndLine: { Line: ['line', 'markerOptions', 'markerFill', 'markerBorder'] },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            }
        },
        'xyScatterSmoothNoMarkers': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            }
        },
        'xyScatterLines': {
            series: {
                fillAndLine: { Line: ['line', 'markerOptions', 'markerFill', 'markerBorder'] },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            }
        },
        'xyScatterLinesNoMarkers': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            }
        },
        'bubble': {
            series: {
                fillAndLine: { Line: ['line']/*, Marker: ['markerOptions', 'fill', 'border']*/ },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            }
        },
        'combo': {},
        'stockHLC': {},
        'stockOHLC': {},
        'stockVHLC': {},
        'stockVOHLC': {},
        'radar': {
            series: {
                fillAndLine: { Line: ['border'] },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
            primaryCategory: {
                textFill: { Text: ['textFill', 'font'] }
            },
            primaryCategoryTitle: {},
            primaryCategoryMajorGridLine: {},
            primaryCategoryMinorGridLine: {},
        },
        'radarMarkers': {
            series: {
                fillAndLine: { Line: ['border', 'markerOptions', 'markerFill', 'markerBorder'] },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
            primaryCategory: {
                textFill: { Text: ['textFill', 'font'] }
            },
            primaryCategoryTitle: {},
            primaryCategoryMajorGridLine: {},
            primaryCategoryMinorGridLine: {},
        },
        'radarFilled': {
            series: {
                fillAndLine: { Line: ['fill', 'border'] },
                seriesOptions: { SeriesOptions: ['seriesOptions'] }
            },
            primaryCategory: {
                textFill: { Text: ['textFill', 'font'] }
            },
            primaryCategoryTitle: {},
            primaryCategoryMajorGridLine: {},
            primaryCategoryMinorGridLine: {},
        },
        'sunburst': {
            series: {
                fillAndLine: { Line: ['fill', 'border'] }
            },
            dataPoints: {
                fillAndLine: { Line: ['fill'] }
            },
            legend: {
                fillAndLine: { Line: ['fill', 'border'] },
                legendPosition: { Legend: ['position'] }
            },
            primaryCategory: {},
            primaryValue: {},
            primaryCategoryTitle: {},
            primaryValueTitle: {},
            primaryCategoryMajorGridLine: {},
            primaryValueMajorGridLine: {},
            primaryCategoryMinorGridLine: {},
            primaryValueMinorGridLine: {},
            secondaryCategory: {},
            secondaryValue: {},
            secondaryCategoryTitle: {},
            secondaryValueTitle: {},
            secondaryCategoryMajorGridLine: {},
            secondaryValueMajorGridLine: {},
            secondaryCategoryMinorGridLine: {},
            secondaryValueMinorGridLine: {}
        },
        'treemap': {
            series: {
                fillAndLine: { Line: ['fill', 'border'] }
            },
            dataPoints: {
                fillAndLine: { Line: ['fill'] }
            },
            legend: {
                fillAndLine: { Line: ['fill', 'border'] },
                legendPosition: { Legend: ['position'] }
            },
            primaryCategory: {},
            primaryValue: {},
            primaryCategoryTitle: {},
            primaryValueTitle: {},
            primaryCategoryMajorGridLine: {},
            primaryValueMajorGridLine: {},
            primaryCategoryMinorGridLine: {},
            primaryValueMinorGridLine: {},
            secondaryCategory: {},
            secondaryValue: {},
            secondaryCategoryTitle: {},
            secondaryValueTitle: {},
            secondaryCategoryMajorGridLine: {},
            secondaryValueMajorGridLine: {},
            secondaryCategoryMinorGridLine: {},
            secondaryValueMinorGridLine: {}
        }
    };
    var fontFamiliesText = designer.res.ribbon.fontFamilies;
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
    var fontSizeCollection = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 26, 28, 36, 48, 72];
    var markerShapeCollection = [
        "circle",
        "dash",
        "diamond",
        "dot",
        "plus",
        "square",
        "star",
        "triangle",
        "x"
    ];

    function isNullOrUndefined(value) {
        return value === undefined || value === null;
    }
    function _buildRadioDataName(name) {
        var cssContent = name.split(' ');
        if (cssContent.length > 0) {
            name = cssContent[0].toLocaleLowerCase();
            for (var i = 1; i < cssContent.length; i++) {
                name = name + ' ' + cssContent[i].toLocaleLowerCase();
            }
        }
        return name;
    }
    function _buildPanelContentCss(title) {
        var cssContent = title.split('And');
        var css = '';
        if (cssContent.length > 0) {
            css = cssContent[0].toLocaleLowerCase();
            for (var i = 1; i < cssContent.length; i++) {
                css = css + '-' + cssContent[i].toLocaleLowerCase();
            }
        }
        return css;
    }
    function closeSlidePanel() {
        var sliderPanel = $(".slider-panel");
        sliderPanel.sliderpanel("close", "panel2");
    }
    function _isEmptyObject(obj) {
        return obj ? (typeof obj === 'object') && (Object.keys(obj).length === 0) : true;
    }
    function getSpecialColorWithSeries(oneSeries, seriesCount, seriesIndex, isPie) {
        var chart = getActiveChart();
        var color = oneSeries.backColor;
        var ChartType = GC.Spread.Sheets.Charts.ChartType;
        if (oneSeries && seriesCount && seriesIndex !== null) {
            if (isPie === true) {
                var pieColorIsAuto = judgePieColorIsAuto(oneSeries.backColor);
                if (pieColorIsAuto) {
                    color = designer.res.chartSliderPanel.automatic;
                }
            } else if (chart.chartType() === ChartType.sunburst || chart.chartType() === ChartType.treemap) {
                if (treemapAndSunburstColorsIsAuto(chart)) {
                    color = designer.res.chartSliderPanel.automatic;
                }
            } else {
                color = judgeChartColorIsAuto(oneSeries.backColor, seriesCount, seriesIndex, chart);
            }
        }
        return color ? { text: color, color: oneSeries.backColor } : oneSeries.backColor;
    }

    function getActiveChart() {
        var sheet = designer.wrapper.spread.getActiveSheet();
        var activeChart = null;
        sheet.charts.all().forEach(function (chart) {
            if (chart.isSelected()) {
                activeChart = chart;
            }
        });
        return activeChart;
    }

    function judgePieColorIsAuto(colorString) {
        var colorArray = chartHelper.getPieColorArray(colorString);
        for (var i = 1; i < colorArray.length; i++) {
            if (colorArray[i] !== colorArray[i - 1]) {
                return true;
            }
        }
        return false;
    }

    function treemapAndSunburstColorsIsAuto(activeChart) {
        var seriesCollection = activeChart.series();
        var dataPoints = seriesCollection.dataPoints();
        var dataPointsCount = dataPoints.get().length;
        var themeColors = getThemeColors(activeChart);
        for (var i = 0; i < dataPointsCount; i++) {
            if (!getDataPointColorIsAutoImp(themeColors, dataPoints, i)) {
                return false;
            }
        }
        return true;
    }
    function getDataPointColorIsAutoImp(themeColors, dataPoints, dataPointIndex) {
        var dataPointsCount = dataPoints.get().length;
        var color = chartHelper.generateColor(themeColors, dataPointsCount, dataPointIndex);
        if (isNullOrUndefined(color) || color === '') {
            return false;
        }
        var color1 = ColorHelper.hexToRgb(ColorHelper.parse(color, designer.wrapper.spread.getActiveSheet().currentTheme()).color);
        var dataPoint = dataPoints.get()[dataPointIndex];
        var fillColor = dataPoint.fillColor;
        if (isNullOrUndefined(fillColor) || fillColor === '') {
            return false;
        }
        var fillColorRGB = ColorHelper.hexToRgb(ColorHelper.parse(fillColor, designer.wrapper.spread.getActiveSheet().currentTheme()).color);
        return fillColor === color1 || fillColorRGB === color1;
    }

    function getThemeColors(activeChart) {
        var themeColors = chartTemplates.chartColors.colorful.colors[0].items;
        if (activeChart && activeChart.colorAndStyle && activeChart.colorAndStyle.color && activeChart.colorAndStyle.color.group && activeChart.colorAndStyle.color.index) {
            var themeColoOptions = activeChart.colorAndStyle.color;
            var group = themeColoOptions.group;
            var colorOptionIndex = themeColoOptions.index;
            themeColors = chartTemplates.chartColors[group].colors[colorOptionIndex].items;
        }
        return themeColors;
    }
    function judgeChartColorIsAuto(color, count, index, activeChart) {
        if (color === null || color === undefined) {
            return color;
        } else {
            var themeColors = getThemeColors(activeChart);
            var themeColor = chartHelper.generateColor(themeColors, count, index);
            var colorArray = color.split(' ');
            if (colorArray[colorArray.length - 1] === '0') {
                colorArray.pop();
                color = colorArray.join(' ');
            }
            if (themeColor === color) {
                return designer.res.chartSliderPanel.automatic;
            }
        }
    }
    function getDataPoints(chart, dataPointIndex) {
        var chartType = designer.util.chartHelper.getChartTypeString(chart.chartType());
        var chartDataPointsOptions = (chartDescription[chartType] && chartDescription[chartType]['dataPoints']) || chartDescription['baseChart']['dataPoints'];
        var allSeries = chart.series(), dataPoints;
        var getProperty = {
            'fill': getFill
        };
        var dataObj = {};
        if (!isNullOrUndefined(dataPointIndex) && allSeries && allSeries.dataPoints()) {
            dataPoints = chart.series().dataPoints().get(dataPointIndex);
        } else {
            return;
        }
        for (var i in chartDataPointsOptions) { /* NOSONAR: Forin*/
            var data = dataObj[i] = { type: i };
            for (var j in chartDataPointsOptions[i]) { /* NOSONAR: Forin*/
                var editors = [];
                chartDataPointsOptions[i][j].forEach(function (k) {
                    var editor = getProperty[k](dataPoints);
                    editors.push(editor);
                });
                var content = {};
                content[j] = editors;
                data['content'] = [];
                data['content'].push(content);
            }
        }
        return dataObj;
        function getFill(dataPoint) {
            return {
                name: designer.res.chartSliderPanel.fill,
                data: { backColor: dataPoint.fillColor, transparency: dataPoint.transparency },
                type: 'fill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill
                }
            };
        }
    }

    function getErrorBarData(chart, outDataObj, category) {
        var seriesCollection = chart.series(), seriesCount = seriesCollection.Count;
        var seriesOfchart;
        var getProperty = {
            'fill': getLine,
            'errorBarOptions': getErrorBarOptions,
        };
        for (var index = 0; index < seriesCount; index++) {
            var series = seriesCollection.get(index);
            if (series.errorBars) {
                var errorBarObj = {};
                var vertical = series.errorBars.vertical;
                if (vertical) {
                    errorBarObj.Y = getErrorBarObj(vertical, true, category, index);
                }
                var horizontal = series.errorBars.horizontal;
                if (horizontal) {
                    errorBarObj.X = getErrorBarObj(horizontal, false, category, index);
                }
                var chartType = chartHelper.getChartGroupString(chart.chartType());
                if (chartType === "BarGroup") {
                    errorBarObj.Y = errorBarObj.X;
                    errorBarObj.X = null;
                }
                outDataObj.series[index]['errorBar'] = errorBarObj;
            }
        }
        function getErrorBarObj(errorBar, isVertical, category, index) {
            var dataObj = { name: category[index], index: index };
            series = seriesCollection.get(index);
            seriesOfchart = chartDescription['baseChart']['errorBar'];
            for (var i in seriesOfchart) {
                var data = dataObj[i] = { type: i };
                var content = {};
                for (var j in seriesOfchart[i]) { /* NOSONAR: Forin*/
                    var editors = content[j] = [];
                    seriesOfchart[i][j].forEach(function (k) {
                        var editor = getProperty[k](errorBar, isVertical);
                        editors.push(editor);
                    });
                    data['content'] = [content];
                }
            }
            return dataObj;
        }
        function getErrorBarOptions(errorBar, isVertical) {
            return {
                name: isVertical ? designer.res.chartSliderPanel.verticalErroeBar : designer.res.chartSliderPanel.horizontalErrorBar,
                data: { errBar: errorBar },
                type: 'seriesErrorBar',
                resources: {
                    both: designer.res.chartSliderPanel.both,
                    minus: designer.res.chartSliderPanel.minus,
                    plus: designer.res.chartSliderPanel.plus,
                    noCap: designer.res.chartSliderPanel.noCap,
                    cap: designer.res.chartSliderPanel.cap,
                    fixed: designer.res.chartSliderPanel.fixed,
                    percentage: designer.res.chartSliderPanel.percentage,
                    standardDev: designer.res.chartSliderPanel.standardDev,
                    standardErr: designer.res.chartSliderPanel.standardErr,
                    custom: designer.res.chartSliderPanel.custom,
                    direction: designer.res.chartSliderPanel.direction,
                    endStyle: designer.res.chartSliderPanel.endStyle,
                    errorAmount: designer.res.chartSliderPanel.errorAmount,
                    specifyValue: designer.res.chartSliderPanel.specifyValue
                }
            };
        }
        function getLine(errorBar) {
            return {
                name: designer.res.chartSliderPanel.line,
                data: {
                    color: errorBar.style.color,
                    transparency: (errorBar.style && errorBar.style.transparency) || 0,
                    width: errorBar.style.width,
                    lineType: errorBar.style.dashStyle,
                    colorStr: "color",
                    widthStr: "width",
                    transparentStr: "transparency",
                    lineTypeStr: "dashStyle",
                },
                type: 'border',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noLine,
                    solidColorText: designer.res.chartSliderPanel.solidLine,
                    widthText: designer.res.chartSliderPanel.width,
                    lineTypeText: designer.res.chartSliderPanel.lintType
                }
            };
        }
    }
    function getTrendlineData(chart, outDataObj, category) {
        var seriesCollection = chart.series(), seriesCount = seriesCollection.Count;
        var seriesOfchart;
        var getProperty = {
            'fill': getLine,
            'trendlineOptions': getTrendlineOption,
        };
        for (var index = 0; index < seriesCount; index++) {
            if (seriesCollection.get(index).trendlines) {
                var trendlineObj = outDataObj["series"][index].trendline = [];
                var trendlines = seriesCollection.get(index).trendlines;
                for (var i = 0; i < trendlines.length; i++) {
                    var dataObj = getEditorData(trendlines[i], chart, index, i);
                    dataObj["name"] = category[index];
                    dataObj["index"] = index;
                    trendlineObj.push(dataObj);
                }
            }
        }
        function getEditorData(trendline, chart, seriesIndex, trendlineIndex) {
            var dataObj = {};
            seriesOfchart = chartDescription['baseChart']['trendline'];
            for (var i in seriesOfchart) {
                var data = dataObj[i] = { type: i };
                var content = {};
                for (var j in seriesOfchart[i]) { /* NOSONAR: Forin*/
                    var editors = content[j] = [];
                    seriesOfchart[i][j].forEach(function (k) {
                        var editor = getProperty[k](trendline, seriesIndex, trendlineIndex, chart);
                        editors.push(editor);
                    });
                }
                data['content'] = [content];
            }
            return dataObj;
        }
        function getLine(trendline, seriesIndex, count) {
            return {
                name: designer.res.chartSliderPanel.line,
                data: {
                    color: trendline.style.color,
                    transparency: (trendline.style && trendline.style.transparency) || 0,
                    width: trendline.style.width,
                    lineType: trendline.style.dashStyle,
                    colorStr: "color",
                    widthStr: "width",
                    transparentStr: "transparency",
                    lineTypeStr: "dashStyle",
                },
                type: 'border',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noLine,
                    solidColorText: designer.res.chartSliderPanel.solidLine,
                    widthText: designer.res.chartSliderPanel.width,
                    lineTypeText: designer.res.chartSliderPanel.lintType //todo
                }
            };
        }
        function getTrendlineOption(trendline, seriesIndex, trendlineIndex, chart) {
            return {
                name: designer.res.chartSliderPanel.line,
                data: {
                    "trendline": trendline,
                    "isCustomName": chart.series().GetTrendlineNameIsCustomOrNotInternal(seriesIndex, trendlineIndex),
                    "dataSet": chartHelper.getDataSet(chart, seriesIndex),
                    "displayBlanksAsZero": chart.displayBlanksAs() === GC.Spread.Sheets.Charts.DisplayBlanksAs.zero
                },
                type: 'trendlineOptions',
                resources: {
                }
            };
        }
    }
    function getSeriesData(chart, outDataObj, category) {
        outDataObj["series"] = [];
        var seriesCollection = chart.series(), seriesCount = seriesCollection.Count,
            chartType = chartHelper.getChartTypeString(chart.chartType());
        if (chartType === 'stockHLC' || chartType === 'stockOHLC' || chartType === 'stockVHLC' || chartType === 'stockVOHLC') {
            return;
        }
        var seriesOfchart;
        if (chartType === 'pie' || chartType === 'doughnut') {
            seriesCount = 1;
        }
        var getProperty = {
            'fill': getFill,
            'fillPie': getFillPie,
            'border': getBorder,
            'seriesOptions': getSeriesOptions,
            'line': getLine,
            'markerOptions': getMarkerOptions,
            'markerFill': getMarkerFill,
            'markerBorder': getMarkerBorder
        };
        for (var index = 0; index < seriesCount; index++) {
            var dataObj = {};
            dataObj["name"] = category[index];
            dataObj["index"] = index;
            outDataObj["series"][index] = dataObj;
            var series = seriesCollection.get(index);
            if (series.chartType === 1 || series.chartType === 33 || series.chartType === 34 || series.chartType === 35 || series.chartType === 36) {
                series.border.width = null;
            }
            chartType = chartHelper.getChartTypeString(series.chartType);
            seriesOfchart = (chartDescription[chartType] && chartDescription[chartType]['series']) || chartDescription['baseChart']['series'];
            for (var i in seriesOfchart) {
                dataObj[i] = { type: i };
                var data = dataObj[i];
                for (var j in seriesOfchart[i]) { /* NOSONAR: Forin*/
                    var editors = [];
                    seriesOfchart[i][j].forEach(function (k) {
                        var editor = getProperty[k](series, index, seriesCount);
                        editors.push(editor);
                    });
                    var content = {};
                    content[j] = editors;
                    data['content'] = [];
                    data['content'].push(content);
                }
            }
        }

        function getFillPie(series1, seriesIndex, count) {
            var color = getSpecialColorWithSeries(series1, count, seriesIndex, true);
            return {
                name: designer.res.chartSliderPanel.fill,
                data: { backColor: color, transparency: series1.backColorTransparency },
                type: 'fill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill,
                    automaticColorText: designer.res.chartSliderPanel.automatic
                }
            };
        }

        function getFill(series1, seriesIndex, count) {
            var color = getSpecialColorWithSeries(series1, count, seriesIndex, false);
            return {
                name: designer.res.chartSliderPanel.fill,
                data: { backColor: color, transparency: series1.backColorTransparency },
                type: 'fill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill,
                    automaticColorText: designer.res.chartSliderPanel.automatic
                }
            };
        }

        function getMarkerOptions(series1, seriesIndex, count) {
            return {
                name: designer.res.chartSliderPanel.markOptions,
                data: {
                    shape: series1.symbol.shape,
                    size: series1.symbol.size
                },
                type: 'markerOptions',
                resources: {
                    none: designer.res.chartSliderPanel.none,
                    builtIn: designer.res.chartSliderPanel.builtIn,
                    shapeText: designer.res.chartSliderPanel.shape,
                    widthText: designer.res.chartSliderPanel.size
                }
            };
        }
        function getMarkerFill(series1, seriesIndex, count) {
            return {
                name: designer.res.chartSliderPanel.markFill,
                data: {
                    color: series1.symbol.fill,
                    transparency: series1.symbol.fillColorTransparency,
                    colorStr: "markerFillColor",
                    transparentStr: "markerFillTransparency",
                },
                type: 'line',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill,
                }
            };
        }
        function getMarkerBorder(series1, seriesIndex, count) {
            return {
                name: designer.res.chartSliderPanel.markBorder,
                data: {
                    color: series1.symbol.border.color,
                    transparency: series1.symbol.border.colorTransparency,
                    width: series1.symbol.border.width,
                    lineType: series1.symbol.border.lineType,
                    colorStr: "markerBorderColor",
                    widthStr: "markerBorderWidth",
                    transparentStr: "markerBorderTransparency",
                    lineTypeStr: "markerBorderLineType",
                },
                type: 'border',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noLine,
                    solidColorText: designer.res.chartSliderPanel.solidLine,
                    widthText: designer.res.chartSliderPanel.width,
                    lineTypeText: designer.res.chartSliderPanel.lintType
                }
            };
        }
        function getBorder(series1) {
            return {
                name: designer.res.chartSliderPanel.border,
                data: {
                    width: series1.border.width,
                    color: series1.border.color || 'rgba(0, 0, 0, 0)',
                    transparency: (series1.border && series1.border.transparency) || 0,
                    colorStr: "borderColor",
                    widthStr: "borderWidth",
                    transparentStr: "borderTransparency",
                },
                type: 'border',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noLine,
                    solidColorText: designer.res.chartSliderPanel.solidLine,
                    widthText: designer.res.chartSliderPanel.width
                }
            };
        }

        function getSeriesOptions(series1) {
            return {
                name: designer.res.chartSliderPanel.seriesOptions,
                data: { axisGroup: series1.axisGroup },
                type: 'series',
                resources: {
                    primaryAxisText: designer.res.chartSliderPanel.primaryAxis,
                    secondaryAxisText: designer.res.chartSliderPanel.secondaryAxis
                }
            };
        }

        function getLine(series1, seriesIndex, count) {
            var themeColors = chartTemplates.chartColors.colorful.colors[0].items;
            var themeColor = chartHelper.generateColor(themeColors, count, seriesIndex);
            if (series1.border.color === keyword_undefined) {
                series1.border.color = themeColor;
            }
            return {
                name: designer.res.chartSliderPanel.line,
                data: {
                    width: series1.border.width,
                    color: series1.border.color,
                    transparency: (series1.border && series1.border.transparency) || 0,
                    colorStr: "borderColor",
                    widthStr: "borderWidth",
                    transparentStr: "borderTransparency",
                },
                type: 'line',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noLine,
                    solidColorText: designer.res.chartSliderPanel.solidLine,
                    widthText: designer.res.chartSliderPanel.width
                }
            };
        }
    }

    function getLegendData(chart) {
        var chartType = designer.util.chartHelper.getChartTypeString(chart.chartType());
        var chartLegendOptions = (chartDescription[chartType] && chartDescription[chartType]['legend']) || chartDescription['baseChart']['legend'];
        var getProperty = {
            'fill': getFill,
            'border': getBorder,
            'position': getPosition,
            'textFill': getTextFill,
            'font': getFontOptions
        };
        if (chartType === 'stockHLC' || chartType === 'stockOHLC' || chartType === 'stockVHLC' || chartType === 'stockVOHLC') {
            return;
        }
        var dataObj = {};
        var legend = chart.legend();

        for (var i in chartLegendOptions) {
            var data = dataObj[i] = { type: i };
            for (var j in chartLegendOptions[i]) { /* NOSONAR: Forin*/
                var editors = [];
                chartLegendOptions[i][j].forEach(function (k) {
                    var editor = getProperty[k](legend);
                    editors.push(editor);
                });
                var content = {};
                content[j] = editors;
                data['content'] = [];
                data['content'].push(content);
            }
        }
        return dataObj;

        function getPosition(legend1) {
            return {
                name: designer.res.chartSliderPanel.legendPosition,
                data: { position: legend1.position },
                type: 'legend',
                resources: {
                    topText: designer.res.chartSliderPanel.top,
                    bottomText: designer.res.chartSliderPanel.bottom,
                    leftText: designer.res.chartSliderPanel.left,
                    rightText: designer.res.chartSliderPanel.right,
                    topRightText: designer.res.chartSliderPanel.topRight
                }
            };
        }
        function getFill(legend1) {
            return {
                name: designer.res.chartSliderPanel.fill,
                data: { backColor: legend1.backColor, transparency: legend1.backColorTransparency },
                type: 'fill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill
                }
            };
        }
        function getBorder(legend1) {
            return {
                name: designer.res.chartSliderPanel.border,
                data: {
                    width: (legend1.borderStyle && legend1.borderStyle.width) || 0,
                    color: (legend1.borderStyle && legend1.borderStyle.color) || 'rgba(0, 0, 0, 0)',
                    transparency: (legend1.borderStyle && legend1.borderStyle.transparency) || 0,
                    colorStr: "borderColor",
                    widthStr: "borderWidth",
                    transparentStr: "borderTransparency",
                },
                type: 'border',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noLine,
                    solidColorText: designer.res.chartSliderPanel.solidLine,
                    widthText: designer.res.chartSliderPanel.width
                }
            };
        }
        function getTextFill(legend1) {
            return {
                name: designer.res.chartSliderPanel.textFill,
                data: { color: legend1.color }, //legend text transparency is not API, keep it undefined.
                type: 'textFill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill
                }
            };
        }
        function getFontOptions(legend1) {
            return {
                name: designer.res.chartSliderPanel.font,
                data: { fontFamily: legend1.fontFamily || 'Calibri', fontSize: legend1.fontSize || '10' },
                type: 'font',
                resources: {
                    fontFamily: designer.res.chartSliderPanel.fontFamily,
                    fontSize: designer.res.chartSliderPanel.fontSize
                }
            };
        }
    }

    function getLabelData(chart) {
        var chartType = designer.util.chartHelper.getChartTypeString(chart.chartType());
        var chartTitleOptions = (chartDescription[chartType] && chartDescription[chartType]['dataLabels']) || chartDescription['baseChart']['dataLabels'];
        var getProperty = { 'textFill': getTextFill };
        var dataLabels = chart.dataLabels();
        if (_isEmptyObject(dataLabels) || (dataLabels.showValue === false && dataLabels.showSeriesName === false && dataLabels.showCategoryName === false)) {
            return;
        }
        var dataObj = {};
        for (var i in chartTitleOptions) {
            dataObj[i] = { type: i };
            var data = dataObj[i];
            for (var j in chartTitleOptions[i]) { /* NOSONAR: Forin*/
                var editors = [];
                chartTitleOptions[i][j].forEach(function (k) {
                    var editor = getProperty[k](dataLabels);
                    editors.push(editor);
                });
                var content = {};
                content[j] = editors;
                data['content'] = [];
                data['content'].push(content);
            }
        }
        return dataObj;
        function getTextFill(dataLabels1) {
            return {
                name: designer.res.chartSliderPanel.textFill,
                data: { color: dataLabels1.color, transparency: dataLabels1.transparency },
                type: 'textFill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill
                }
            };
        }
    }

    function getChartTitleData(chart) {
        var chartType = designer.util.chartHelper.getChartTypeString(chart.chartType());
        var chartTitleOptions = (chartDescription[chartType] && chartDescription[chartType]['chartTitle']) || chartDescription['baseChart']['chartTitle'];
        var getProperty = { 'textFill': getTextFill, 'font': getFontOptions, 'textElement': getTextElement };

        var chartTitle = chart.title();
        if (_isEmptyObject(chartTitle)) {
            return;
        }
        var dataObj = {};

        for (var i in chartTitleOptions) {
            dataObj[i] = { type: i };
            var data = dataObj[i];
            for (var j in chartTitleOptions[i]) { /* NOSONAR: Forin*/
                var editors = [];
                chartTitleOptions[i][j].forEach(function (k) {
                    var editor = getProperty[k](chartTitle);
                    editors.push(editor);
                });
                var content = {};
                content[j] = editors;
                data['content'] = [];
                data['content'].push(content);
            }
        }
        return dataObj;

        function getTextFill(chartTitle1) {
            return {
                name: designer.res.chartSliderPanel.textFill,
                data: { color: chartTitle1.color, transparency: chartTitle1.transparency },
                type: 'textFill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill
                }
            };
        }

        function getFontOptions(chartTitle1) {
            return {
                name: designer.res.chartSliderPanel.font,
                data: { fontFamily: chartTitle1.fontFamily, fontSize: chartTitle1.fontSize },
                type: 'font',
                resources: {
                    fontFamily: designer.res.chartSliderPanel.fontFamily,
                    fontSize: designer.res.chartSliderPanel.fontSize
                }
            };
        }

        function getTextElement(chartTitle1) {
            return {
                name: designer.res.chartSliderPanel.textEditor,
                data: { text: chartTitle1.text },
                type: 'textElement',
                resources: { textElement: designer.res.chartSliderPanel.text }
            };
        }
    }

    function getChartAreaData(chart) {
        var chartType = designer.util.chartHelper.getChartTypeString(chart.chartType());
        var chartAreaOptions = (chartDescription[chartType] && chartDescription[chartType]['chartArea']) || chartDescription['baseChart']['chartArea'];
        var getProperty = {
            'fill': getFill,
            'size': getSize,
            'border': getBorder,
            'textFill': getTextFill,
            'font': getFontOptions
        };

        var dataObj = {};
        var chartArea = chart.chartArea();

        for (var i in chartAreaOptions) {
            dataObj[i] = { type: i };
            var data = dataObj[i];
            for (var j in chartAreaOptions[i]) { /* NOSONAR: Forin*/
                var editors = [];
                chartAreaOptions[i][j].forEach(function (k) {
                    var editor = getProperty[k](k === 'size' ? chart : chartArea);
                    editors.push(editor);
                });
                var content = {};
                content[j] = editors;
                data['content'] = [];
                data['content'].push(content);
            }
        }

        return dataObj;
        function getFill(chartArea1) {
            return {
                name: designer.res.chartSliderPanel.fill,
                data: { backColor: chartArea1.backColor, transparency: chartArea1.backColorTransparency },
                type: 'fill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill
                }
            };
        }
        function getBorder(series1) {
            return {
                name: designer.res.chartSliderPanel.border,
                data: {
                    width: series1.border && series1.border.width,
                    color: series1.border && series1.border.color || 'rgba(0, 0, 0, 0)',
                    transparency: (series1.border && series1.border.transparency) || 0,
                    lineType: series1.border && series1.border.dashStyle,
                    colorStr: "borderColor",
                    widthStr: "borderWidth",
                    transparentStr: "borderTransparency",
                    lineTypeStr: "borderDashStyle"
                },
                type: 'border',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noLine,
                    solidColorText: designer.res.chartSliderPanel.solidLine,
                    widthText: designer.res.chartSliderPanel.width,
                    lineTypeText: designer.res.chartSliderPanel.dashStyle
                }
            };
        }

        function getSize(chart1) {
            return {
                name: designer.res.chartSliderPanel.size,
                data: { xOffset: chart1.x(), yOffset: chart1.y(), width: chart1.width(), height: chart1.height() },
                type: 'size',
                resources: {
                    widthText: designer.res.chartSliderPanel.width,
                    heightText: designer.res.chartSliderPanel.height
                }
            };
        }

        function getTextFill(chartArea1) {
            return {
                name: designer.res.chartSliderPanel.textFill,
                data: { color: chartArea1.color, transparency: chartArea1.transparency },
                type: 'textFill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill
                }
            };
        }

        function getFontOptions(chartArea1) {
            return {
                name: designer.res.chartSliderPanel.font,
                data: { fontFamily: chartArea1.fontFamily || 'Calibri', fontSize: chartArea1.fontSize || '10' },
                type: 'font',
                resources: {
                    fontFamily: designer.res.chartSliderPanel.fontFamily,
                    fontSize: designer.res.chartSliderPanel.fontSize
                }
            };
        }
    }

    function getAxisData(chart, outDataObj) {
        var axes = chart.axes();
        if (_isEmptyObject(axes)) {
            return;
        }
        var chartType = designer.util.chartHelper.getChartTypeString(chart.chartType());
        var chartAxisOptions;
        var getProperty = {
            'line': getLine,
            'textFill': getTextFill,
            'font': getFontOptions,
            'tick': getTickPosition,
            'axisCategory': getAxisCategoryOptions,
            'axisValue': getAxisValueOptions,
            'titleTextFill': getTitleTextFill,
            'titleFont': getTitleFontOptions,
            'titleTextElement': getTitleTextElement,
            'majorLine': getMajorGridLine,
            'minorLine': getMinorGridLine,
            'number': getAxisFormat,
            'unitsLabelTextFill': getUnitsLabelTextFill,
            'unitsLabelFont': getUnitsLabelFont
        };
        for (var index in axes) {
            if (axes[index].visible === true) {
                chartAxisOptions = (chartDescription[chartType] && chartDescription[chartType][index]) || chartDescription['baseChart'][index];
                if (isNullOrUndefined(chartAxisOptions) || _isEmptyObject(chartAxisOptions)) {
                    continue;
                }
                getData(chartAxisOptions, index);
                if (axes[index]['title']['text'] !== '') {
                    chartAxisOptions = (chartDescription[chartType] && chartDescription[chartType][index + 'Title']) || chartDescription['baseChart'][index + 'Title'];
                    getData(chartAxisOptions, index + 'Title');
                }
                if (axes[index]['majorGridLine']['visible'] === true) {
                    chartAxisOptions = (chartDescription[chartType] && chartDescription[chartType][index + 'MajorGridLine']) || chartDescription['baseChart'][index + 'MajorGridLine'];
                    getData(chartAxisOptions, index + 'MajorGridLine');
                }
                if (axes[index]['minorGridLine']['visible'] === true) {
                    chartAxisOptions = (chartDescription[chartType] && chartDescription[chartType][index + 'MinorGridLine']) || chartDescription['baseChart'][index + 'MinorGridLine'];
                    getData(chartAxisOptions, index + 'MinorGridLine');
                }
                if (axes[index].displayUnit && axes[index].displayUnit.visible) {
                    chartAxisOptions = chartDescription['baseChart'][index + 'UnitsLabel'];
                    if (!isNullOrUndefined(chartAxisOptions)) {
                        getData(chartAxisOptions, index + 'UnitsLabel');
                    }
                }
            }
        }
        function getData(chartAxisOptions1, name) {
            if (isNullOrUndefined(chartAxisOptions1) || _isEmptyObject(chartAxisOptions1)) {
                return;
            }
            var dataObj = outDataObj[name] = {};
            var axis = axes[index];
            for (var i in chartAxisOptions1) {
                dataObj[i] = { type: i };
                var data = dataObj[i];
                for (var j in chartAxisOptions1[i]) { /* NOSONAR: Forin*/
                    var editors = [];
                    chartAxisOptions1[i][j].forEach(function (k) {
                        var editor = getProperty[k](axis);
                        editors.push(editor);
                    });
                    var content = {};
                    content[j] = editors;
                    data['content'] = [];
                    data['content'].push(content);
                }
            }
        }

        function getMajorGridLine(axes1) {
            return {
                name: designer.res.chartSliderPanel.line,
                data: {
                    width: axes1.majorGridLine.width,
                    color: axes1.majorGridLine.color,
                    transparency: axes1.majorGridLine.transparency,
                    colorStr: "majorGridLineColor",
                    widthStr: "majorGridLineWidth",
                    transparentStr: "transparency",
                },
                type: 'line',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noLine,
                    solidColorText: designer.res.chartSliderPanel.solidLine,
                    widthText: designer.res.chartSliderPanel.width
                }
            };
        }

        function getMinorGridLine(axes1) {
            return {
                name: designer.res.chartSliderPanel.line,
                data: {
                    width: axes1.minorGridLine.width,
                    color: axes1.minorGridLine.color,
                    transparency: axes1.minorGridLine.transparency,
                    colorStr: "minorGridLineColor",
                    widthStr: "minorGridLineWidth",
                    transparentStr: "minorGridLineTransparency",
                },
                type: 'line',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noLine,
                    solidColorText: designer.res.chartSliderPanel.solidLine,
                    widthText: designer.res.chartSliderPanel.width
                }
            };
        }

        function getTitleFontOptions(axes1) {
            return {
                name: designer.res.chartSliderPanel.font,
                data: { fontFamilyTitle: axes1.title.fontFamily, fontSizeTitle: axes1.title.fontSize },
                type: 'font',
                resources: {
                    fontFamily: designer.res.chartSliderPanel.fontFamily,
                    fontSize: designer.res.chartSliderPanel.fontSize
                }
            };
        }

        function getTitleTextFill(axes1) {
            return {
                name: designer.res.chartSliderPanel.textFill,
                data: { colorTitle: axes1.title.color, transparency: axes1.title.transparency },
                type: 'textFill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill
                }
            };
        }

        function getTitleTextElement(axes1) {
            return {
                name: designer.res.chartSliderPanel.textEditor,
                data: { textTitle: axes1.title.text },
                type: 'textElement',
                resources: { textElement: designer.res.chartSliderPanel.text }
            };
        }

        function getTextFill(axes1) {
            return {
                name: designer.res.chartSliderPanel.textFill,
                data: { color: axes1.style.color, transparency: axes1.style.transparency },
                type: 'textFill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill
                }
            };
        }

        function getFontOptions(axes1) {
            return {
                name: designer.res.chartSliderPanel.font,
                data: { fontFamily: axes1.style.fontFamily, fontSize: axes1.style.fontSize },
                type: 'font',
                resources: {
                    fontFamily: designer.res.chartSliderPanel.fontFamily,
                    fontSize: designer.res.chartSliderPanel.fontSize
                }
            };
        }

        function getLine(axes1) {
            return {
                name: designer.res.chartSliderPanel.line,
                data: {
                    width: axes1.lineStyle.width,
                    color: axes1.lineStyle.color,
                    transparency: axes1.lineStyle.transparency,
                    colorStr: "borderColor",
                    widthStr: "borderWidth",
                    transparentStr: "borderTransparency",
                },
                type: 'line',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noLine,
                    solidColorText: designer.res.chartSliderPanel.solidLine,
                    widthText: designer.res.chartSliderPanel.width
                }
            };
        }

        function getTickPosition(axes1) {
            return {
                name: designer.res.chartSliderPanel.tickMarks,
                data: { majorTickPosition: axes1.majorTickPosition, minorTickPosition: axes1.minorTickPosition },
                type: 'tick',
                resources: {
                    majorText: designer.res.chartSliderPanel.majorType,
                    minorText: designer.res.chartSliderPanel.minorType
                }
            };
        }

        function getAxisCategoryOptions(axes1) {
            if (axes1.categoryType === 3) {
                var data = {
                    majorUnit: axes1.majorUnit,
                    minorUnit: axes1.minorUnit,
                    maxValue: axes1.max,
                    minValue: axes1.min
                };
                if (axes1.scaling && typeof axes1.scaling.logBase === 'number') {
                    data.logBase = axes1.scaling.logBase;
                }
                return {
                    name: designer.res.chartSliderPanel.axisOptions,
                    data: data,
                    type: 'axisValue',
                    resources: {
                        majorUnitText: designer.res.chartSliderPanel.unitsMajor,
                        minorUnitText: designer.res.chartSliderPanel.unitsMinor,
                        maxValueText: designer.res.chartSliderPanel.maximum,
                        minValueText: designer.res.chartSliderPanel.minimum,
                        logarithmicScaleText: designer.res.chartSliderPanel.logarithmicScale,
                        logBaseText: designer.res.chartSliderPanel.logBase
                    }
                };
            }
            return {
                name: designer.res.chartSliderPanel.axisOptions,
                data: {
                    categoryType: axes1.categoryType,
                    maxValue: axes1.categoryType === 2 ? (axes1.max && axes1.max.toLocaleDateString()) : axes1.max,
                    minValue: axes1.categoryType === 2 ? (axes1.min && axes1.min.toLocaleDateString()) : axes1.min
                },
                type: 'axisCategory',
                resources: {
                    textText: designer.res.chartSliderPanel.textAxis,
                    dateText: designer.res.chartSliderPanel.dateAxis,
                    maxValueText: designer.res.chartSliderPanel.maximum,
                    minValueText: designer.res.chartSliderPanel.minimum
                }
            };
        }

        function getAxisValueOptions(axes1) {
            var data = {
                majorUnit: axes1.majorUnit,
                minorUnit: axes1.minorUnit,
                maxValue: axes1.max,
                minValue: axes1.min,
                displayUnit: axes1.displayUnit
            };
            if (axes1.scaling && typeof axes1.scaling.logBase === 'number') {
                data.logBase = axes1.scaling.logBase;
            }
            return {
                name: designer.res.chartSliderPanel.axisOptions,
                data: data,
                type: 'axisValue',
                resources: {
                    majorUnitText: designer.res.chartSliderPanel.unitsMajor,
                    minorUnitText: designer.res.chartSliderPanel.unitsMinor,
                    maxValueText: designer.res.chartSliderPanel.maximum,
                    minValueText: designer.res.chartSliderPanel.minimum,
                    logarithmicScaleText: designer.res.chartSliderPanel.logarithmicScale,
                    logBaseText: designer.res.chartSliderPanel.logBase
                }
            };
        }
        function getAxisFormat(axes1) {
            return {
                name: designer.res.chartSliderPanel.axisFormat.Number,
                data: { formatCode: axes1.format },
                type: 'format',
                resources: {
                    formatText: designer.res.chartSliderPanel.axisFormat.category
                }
            };
        }
        function getUnitsLabelTextFill(axes1) {
            var style = axes1.displayUnit.style;
            return {
                name: designer.res.chartSliderPanel.textFill,
                data: { color: style.color, transparency: style.transparency },
                type: 'textFill',
                resources: {
                    noColorText: designer.res.chartSliderPanel.noFill,
                    solidColorText: designer.res.chartSliderPanel.solidFill
                }
            };
        }
        function getUnitsLabelFont(axes1) {
            var style = axes1.displayUnit.style;
            return {
                name: designer.res.chartSliderPanel.font,
                data: { fontFamily: style.fontFamily, fontSize: style.fontSize },
                type: 'font',
                resources: {
                    fontFamily: designer.res.chartSliderPanel.fontFamily,
                    fontSize: designer.res.chartSliderPanel.fontSize
                }
            };
        }
    }

    function PropertyTabHeader(container, headers, tabChangedCallback) {
        var self = this;
        this.tabChanged = tabChangedCallback;
        var categoryGroup = $('<div></div>').addClass('panel-content-header');
        headers.forEach(function (header) {
            categoryGroup.append(self.addTabHeader(header.name/*, header.icon*/));
        });
        this.activePropertyTabHeader = $(categoryGroup.children()[0]);
        this.activePropertyTabHeader.children().remove();
        this.activePropertyTabHeader.append($('<span></span>').addClass('selected-' + _buildPanelContentCss(this.activePropertyTabHeader.attr('title'))).addClass('format-chart-panel'));
        this.propertyTabHeaders = categoryGroup;
        container.append(categoryGroup);
    }
    PropertyTabHeader.prototype.addTabHeader = function (name/*, icon*/) {
        var self = this;
        var categorySpan = $('<span></span>').addClass(_buildPanelContentCss(name)).addClass('format-chart-panel');
        var div = $('<div></div>').append(categorySpan).attr('title', name).addClass('format-chart-panel-background');
        div.click(function (event) {
            self.tabChanged($(event.currentTarget).attr('title'));
        });
        return div;
    };
    var editorTypeMapping = {
        fill: FillColorEditor,
        border: BorderEditor,
        markerOptions: MarkerEditor,
        trendlineOptions: TrendlineOptionEditor,
        radioEx: RadioGroupEx,
        series: SeriesEditor,
        line: LineEditor,
        size: SizeEditor,
        textFill: TextFillEditor,
        legend: LegendPositionEditor,
        font: FontEditor,
        tick: TickEditor,
        format: FormatEditor,
        axisValue: AxisValueEditor,
        axisCategory: AxisCategoryEditor,
        textElement: TextElementEditor,
        seriesErrorBar: ErrorBarEditor
    };
    //#region sliderPanel DataManager
    function PropertyTabPanel(datas, owner) { // [{name:"fillAndLine", icon:'', properties:[{name: 'Fill', data: "red", type: "fillEditor"}, {name: 'Border', data: {}, type: 'border'}]}]}, {name:"seriesOptions", icon: '', properties: [{name: "seriesOptions", data: primary, type: 'seriesOptions']
        var self = this;
        this.owner = owner;
        this.propertyHeaderData = [];
        this.propertyGroupPanels = [];
        var tabPanel = $('<div></div>');
        for (var i = 0; i < datas.length; i++) {
            this.propertyHeaderData.push({ name: datas[i].name/*, icon: datas[i].icon*/ });
        }
        this.propertyHeaderPanel = new PropertyTabHeader(tabPanel, this.propertyHeaderData, function (name) {
            self.activeTabChanged(name);
        });
        self.groupPanelArray = [];

        for (var j = 0; j < datas.length; j++) {
            var GroupPanelItem = new PropertyGroupPanels(datas[j].name, datas[j].properties, function (namePath, dataPath, propertyName, value) {
                return self.activePanelValueChanged(namePath, dataPath, propertyName, value);
            });
            self.groupPanelArray.push(GroupPanelItem);
            var groupPanel = GroupPanelItem.div;
            tabPanel.append(groupPanel);
            this.propertyGroupPanels.push({ name: datas[j].name, propertyGroupPanel: groupPanel });
        }
        this.activePropertyGroupPanel = this.propertyGroupPanels[0].propertyGroupPanel;
        this.showPropertyGroupPanel(this.activePropertyGroupPanel);
        self.dom = tabPanel;
    }

    PropertyTabPanel.prototype.activePanelValueChanged = function (namePath, dataPath, propertyName, value) {
        return this.owner.updateData(namePath, dataPath, propertyName, value);
    };
    PropertyTabPanel.prototype.activeTabChanged = function (name) {
        for (var i = 0; i < this.propertyGroupPanels.length; i++) {
            if (this.propertyGroupPanels[i].name === name) {
                this.hidePropertyGroupPanel(this.activePropertyGroupPanel);
                this.activePropertyGroupPanel = this.propertyGroupPanels[i].propertyGroupPanel;
                this.showPropertyGroupPanel(this.activePropertyGroupPanel, name);
            }
        }
    };
    PropertyTabPanel.prototype.hidePropertyGroupPanel = function (oldPropertyGroupPanel) {
        oldPropertyGroupPanel.hide();
        this.propertyHeaderPanel.activePropertyTabHeader.children().remove();
        this.propertyHeaderPanel.activePropertyTabHeader.append($('<span></span>').addClass(_buildPanelContentCss(this.propertyHeaderPanel.activePropertyTabHeader.attr('title'))).addClass('format-chart-panel'));
    };
    PropertyTabPanel.prototype.showPropertyGroupPanel = function (newPropertyGroupPanel, name) {
        newPropertyGroupPanel.show();
        var headerElements = this.propertyHeaderPanel.propertyTabHeaders.children();
        for (var i = 0; i < headerElements.length; i++) {
            if ($(headerElements[i]).attr("title") === name) {
                this.propertyHeaderPanel.activePropertyTabHeader = $(headerElements[i]);
                this.propertyHeaderPanel.activePropertyTabHeader.children().remove();
                this.propertyHeaderPanel.activePropertyTabHeader.append($('<span></span>').addClass('selected-' + _buildPanelContentCss(this.propertyHeaderPanel.activePropertyTabHeader.attr('title'))).addClass('format-chart-panel'));
            }
        }
    };
    PropertyTabPanel.prototype.destroy = function () {
        this.groupPanelArray.forEach(function (item) {
            if (item && item.destroy) {
                item.destroy();
            }
        });
        this.groupPanelArray = null;
    };

    function PropertyGroupPanels(name, properties, changedValueCallback) { //[{name: 'Fill', data: "red", type: "color", noColorText: "No Fill", solidColorText: "Solid Fill"}, {name: 'Border', data: {}, type: 'border', noColorText: "No Line", solidColorText: "Solid Line"}]
        if (properties.length > 1) {
        }
        this.changedValue = changedValueCallback;
        var self = this;
        self.name = name;
        self.div = $('<div></div>').hide();
        var j = 0;
        self.groupContainer = [];
        while (j < properties.length) {
            for (var i = 0; i < properties[j].editors.length; i++) {
                var groupContainer = new PropertyGroupContainer(properties[j].editors[i], properties[j].aggregate, j, i, function (dataPath, propertyName, value) {
                    return self.groupContainerValueChanged(dataPath, propertyName, value);
                });
                self.groupContainer.push(groupContainer);
                self.div.append(groupContainer.div);
            }
            j++;
        }
    }
    PropertyGroupPanels.prototype.groupContainerValueChanged = function (dataPath, propertyName, value) {
        return this.changedValue(this.name, dataPath, propertyName, value);
    };
    PropertyGroupPanels.prototype.destroy = function () {
        this.groupContainer.forEach(function (item) {
            if (item && item.destroy) {
                item.destroy();
            }
        });
        this.groupContainer = null;
    };

    function PropertyGroupContainer(property, aggregate, contentIndex, index, changedValueCallback) {
        var self = this;
        self.aggregate = aggregate;
        self.contentIndex = contentIndex;
        self.index = index;
        this.changedValue = changedValueCallback;
        var div = $('<div></div>');
        this.editorTitle = new PropertyEditorTitle(property.name, function (name) {
            self.updateEditorContainer(name);
        });
        div.append(this.editorTitle.dom);
        this.editorContainer = new PropertyEditorContainer(property, function (propertyName, value) {
            return self.editorContainerValueChanged(propertyName, value);
        });
        this.editorContainerDom = this.editorContainer.dom;
        div.append(this.editorContainerDom);
        self.div = div;
    }
    PropertyGroupContainer.prototype.editorContainerValueChanged = function (propertyName, value) {
        return this.changedValue(['content', this.contentIndex, this.aggregate, this.index], propertyName, value);
    };
    PropertyGroupContainer.prototype.updateEditorContainer = function (name) {
        name === 'extend' ? this.editorContainerDom.hide() : this.editorContainerDom.show();
    };
    PropertyGroupContainer.prototype.destroy = function () {
        if (this.editorContainer && this.editorContainer.destroy) {
            this.changedValue = null;
            this.editorContainer.destroy();
            this.editorContainer = null;
        }
        if (this.editorTitle && this.editorTitle.destroy) {
            this.editorTitle.destroy();
        }
    };
    function PropertyEditorTitle(name, changedEditorStatusCallback) {
        this.changedEditorStatus = changedEditorStatusCallback;
        this.dom = this.addEditorTitle(name);
    }
    PropertyEditorTitle.prototype.addEditorTitle = function (name) {
        var self = this;
        var label = $("<label>").text(name).css({
            font: "Bold 12pt Calibri"
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
    function PropertyEditorContainer(property, changedValueCallback) {
        var self = this;
        this.changedValue = changedValueCallback;
        var ul = $('<ul></ul>').css('padding-left', '20px');
        var EditorType = editorTypeMapping[property.type];
        this.editorType = new EditorType(ul, property.data, property.name, property.resources, function (propertyName, value) {
            return self.editorValueChanged(propertyName, value);
        });
        self.dom = ul;
    }
    PropertyEditorContainer.prototype.editorValueChanged = function (propertyName, value) {
        return this.changedValue('data' + '.' + propertyName, value);
    };
    PropertyEditorContainer.prototype.destroy = function () {
        if (this.editorType && this.editorType.destroy) {
            this.editorType.destroy();
            this.changedValue = null;
            this.editorType = null;
        }
    };
    function TextElementEditor(container, data, name, resources, textChangedCallback) {
        this.textChanged = textChangedCallback;
        var self = this;
        this.textEditor = new InputTextEditor(container, resources.textElement, function (text) {
            var result = self.textChanged(data.textTitle ? 'textTitle' : 'text', text);
            if (result) {
                self.updateUI(result);
            }
        });
        this.updateUI(data.textTitle || data.text);
    }
    TextElementEditor.prototype.updateUI = function (text) {
        this.textEditor.text = text;
        this.textEditor.updateValue();
    };
    function AxisCategoryEditor(container, data, name, resources, categoryTypeChangedCallback) {
        this.categoryTypeChanged = categoryTypeChangedCallback;
        var self = this;
        this.textText = resources.textText;
        this.dateText = resources.dateText;
        this.radiogroup = new RadioGroup(container, [this.textText, this.dateText], name, function (element) {
            return self.radioGroupSelectionChanged(element);
        });
        this.settingValueEditor = new AxisValueEditor(container, {
            maxValue: data.maxValue,
            minValue: data.minValue,
            logBase: data.logBase
        }, name, {
            maxValueText: resources.maxValueText,
            minValueText: resources.minValueText,
            logarithmicScaleText: resources.logarithmicScaleText
        }, function (property, value) {
            return self.categoryTypeChanged(property, value);
        });
        this.updateUI(data);
    }
    AxisCategoryEditor.prototype.radioGroupSelectionChanged = function (value) {
        var result = this.categoryTypeChanged('categoryType', value.toLocaleLowerCase() === this.textText.toLocaleLowerCase() ? 1 : 2);
        if (result) {
            this.updateUI(result);
        }
    };
    AxisCategoryEditor.prototype.updateUI = function (data) {
        if (data.categoryType) {
            this.updateRadiogroup(data.categoryType);
        }
        this.updateSettingValueEditor(data);
    };
    AxisCategoryEditor.prototype.updateRadiogroup = function (categoryType) {
        var selectedItem;
        if (categoryType === 1) {
            selectedItem = this.textText;
        } else {
            selectedItem = this.dateText;
        }
        this.radiogroup.setSelectedItem(selectedItem);
    };
    AxisCategoryEditor.prototype.updateSettingValueEditor = function (data) {
        if (data.categoryType !== 1) {
            this.settingValueEditor.showEditor();
        } else {
            this.settingValueEditor.hideEditor();
        }
    };
    function AxisValueEditor(container, data, name, resources, valueChangedCallback) {
        this.valueChanged = valueChangedCallback;
        var self = this;
        var isShowAuto = true;
        var inCategory = resources.majorUnitText || resources.minorUnitText;
        if (inCategory) {
            new ParagraphText(container, designer.res.chartSliderPanel.bounds);
        }
        self.maxValueEditor = new InputTextEditor(container, resources.maxValueText, function (num) {
            var majorNum = self.valueChanged('max', num);
            self.updateMaxUI(majorNum);
        }, isShowAuto);
        self.minValueEditor = new InputTextEditor(container, resources.minValueText, function (num) {
            var minorNum = self.valueChanged('min', num);
            self.updateMinUI(minorNum);
        }, isShowAuto);
        self.updateMaxUI(data.maxValue);
        self.updateMinUI(data.minValue);
        if (inCategory) {
            new ParagraphText(container, designer.res.chartSliderPanel.units);
            self.majorUnitEditor = new InputTextEditor(container, resources.majorUnitText, function (num) {
                if (num !== null && num !== undefined) {
                    num = Number(num);
                }
                var majorNum = self.valueChanged('majorUnit', num);
                self.updateMajorUI(majorNum);
            }, isShowAuto);
            self.minorUnitEditor = new InputTextEditor(container, resources.minorUnitText, function (num) {
                if (num !== null && num !== undefined) {
                    num = Number(num);
                }
                var minorNum = self.valueChanged('minorUnit', num);
                self.updateMinorUI(minorNum);
            }, isShowAuto);
            self.updateMajorUI(data.majorUnit);
            self.updateMinorUI(data.minorUnit);
            var displayUnitMap = designer.res.chartSliderPanel.displayUnit;
            var para = {
                title: designer.res.chartSliderPanel.displayUnits,
                items: Object.values(displayUnitMap),
            };
            self.displayUnitsEditor = new InputSelectEditor(container, para, function (value) {
                for (var i in displayUnitMap) {
                    if (displayUnitMap[i] === value) {
                        var result;
                        result = self.valueChanged('displayUnit', i);
                        self.updateDisplayUnit(result);
                        return;
                    }
                }
                if (!isNullOrUndefined(value)) {
                    result = self.valueChanged('displayUnit', value);
                    self.updateDisplayUnit(result);
                }
            });
            self.displayUnitCheckbox = new Checkbox(container, { text: designer.res.chartSliderPanel.showDisplayUnitsLabel, }, "displayEquation", function (checked) {
                self.valueChanged("displayUnitVisible", checked);
            });
            if (data.displayUnit && data.displayUnit.unit) {
                var unitValue = displayUnitMap[data.displayUnit.unit];
                if (!unitValue) {
                    unitValue = data.displayUnit.unit;
                }
                self.displayUnitsEditor.setValue(unitValue);
            } else {
                self.displayUnitsEditor.setValue(designer.res.chartSliderPanel.displayUnit.none);
                self.displayUnitCheckbox.disable();
            }
            self.displayUnitCheckbox.setSelected(data.displayUnit && data.displayUnit.visible);

            self.logInput = new InputNumberEditor(null, null, function (value) {
                self.valueChanged('logAxis', value);
            }, { min: 2, max: 1000 });
            if (data.logBase) {
                self.logInput.setValue(data.logBase)
            }
            self.logAxisCheckBox = new Checkbox(container, { text: resources.logarithmicScaleText, appendSpan: this.logInput.inputSpan }, 'logAxis', function (checked) {
                if (checked) {
                    self.valueChanged('logAxis', self.logInput.value);
                } else {
                    self.valueChanged('logAxis', false);
                }
            });
            self.logAxisCheckBox.setSelected(data.logBase);
        }
    }

    AxisValueEditor.prototype.updateDisplayUnit = function (displayUnit) {
        var displayUnitMap = designer.res.chartSliderPanel.displayUnit;
        var self = this;
        if (displayUnit && displayUnit.unit !== "none") {
            var unitValue = displayUnitMap[displayUnit.unit];
            if (!unitValue) {
                unitValue = displayUnit.unit;
            }
            self.displayUnitsEditor.setValue(unitValue);
            self.displayUnitCheckbox.enable();
        } else {
            self.displayUnitsEditor.setValue(designer.res.chartSliderPanel.displayUnit.none);
            self.displayUnitCheckbox.disable();
        }
        self.displayUnitCheckbox.setSelected(displayUnit && displayUnit.visible);
    };
    AxisValueEditor.prototype.updateMajorUI = function (value) {
        this.majorUnitEditor.text = value;
        this.majorUnitEditor.updateValue();
    };
    AxisValueEditor.prototype.updateMinorUI = function (value) {
        this.minorUnitEditor.text = value;
        this.minorUnitEditor.updateValue();
    };
    AxisValueEditor.prototype.updateMaxUI = function (value) {
        this.maxValueEditor.text = value;
        this.maxValueEditor.updateValue();
    };
    AxisValueEditor.prototype.updateMinUI = function (value) {
        this.minValueEditor.text = value;
        this.minValueEditor.updateValue();
    };
    AxisValueEditor.prototype.showEditor = function () {
        this.minValueEditor.domInput.show();
        this.maxValueEditor.domInput.show();
    };
    AxisValueEditor.prototype.hideEditor = function () {
        this.minValueEditor.domInput.hide();
        this.maxValueEditor.domInput.hide();
    };

    //#region TickEditor
    function TickEditor(container, data, name, resources, tickChangedCallback) {
        this.changedTickOption = tickChangedCallback;
        var self = this;
        this.majorText = resources.majorText;
        this.minorText = resources.minorText;
        var tickCollection1 = [
            designer.res.chartSliderPanel.tick.cross,
            designer.res.chartSliderPanel.tick.inside,
            designer.res.chartSliderPanel.tick.none,
            designer.res.chartSliderPanel.tick.outSide
        ];
        var tickCollection2 = {};
        tickCollection2[designer.res.chartSliderPanel.tick.cross] = 0;
        tickCollection2[designer.res.chartSliderPanel.tick.inside] = 1;
        tickCollection2[designer.res.chartSliderPanel.tick.none] = 2;
        tickCollection2[designer.res.chartSliderPanel.tick.outSide] = 3;
        this.tickCollection1 = tickCollection1;

        this.dropEditor1 = new DropEditor(container, tickCollection1[data.majorTickPosition], 'majorTickPosition', this.majorText, tickCollection1, function (value) {
            return self.tickCollection1[self.changedTickOption('majorTickPosition', tickCollection2[value])];
        });

        this.dropEditor2 = new DropEditor(container, tickCollection1[data.minorTickPosition], 'minorTickPosition', this.minorText, tickCollection1, function (value) {
            return self.tickCollection1[self.changedTickOption('minorTickPosition', tickCollection2[value])];
        });
    }

    //#endregion TickEditor

    function FormatEditor(container, data, name, resources, callBack) {
        var self = this;
        var formatString = data.formatCode;
        self.callBack = callBack;
        self.formatTypeList = [
            "General", "Number", "Currency", "Accounting", "Date", "Time", "Percentage", "Fraction", "Scientific", "Text", "Special", "Custom"
        ];
        self.formatTypeToRes = {
            General: designer.res.chartSliderPanel.axisFormat.General,
            Number: designer.res.chartSliderPanel.axisFormat.Number,
            Currency: designer.res.chartSliderPanel.axisFormat.Currency,
            Accounting: designer.res.chartSliderPanel.axisFormat.Accounting,
            Date: designer.res.chartSliderPanel.axisFormat.Date,
            Time: designer.res.chartSliderPanel.axisFormat.Time,
            Percentage: designer.res.chartSliderPanel.axisFormat.Percentage,
            Fraction: designer.res.chartSliderPanel.axisFormat.Fraction,
            Scientific: designer.res.chartSliderPanel.axisFormat.Scientific,
            Text: designer.res.chartSliderPanel.axisFormat.Text,
            Special: designer.res.chartSliderPanel.axisFormat.Special,
            Custom: designer.res.chartSliderPanel.axisFormat.Custom,
        };
        self.formatTypeToString = {
            General: "General",
            Number: "#,##0.00",
            Currency: "$#,##0.00",
            Accounting: "_($* #,##0.00_);_($* (#,##0.00);_($* \"-\"??_);_(@_)",
            Date: "[$]m/d/yyyy",
            Time: "[$-x-systime]h:mm:ss AM/PM",
            Percentage: "0.00%",
            Fraction: "# ?/?",
            Scientific: "0.00E+00",
            Text: "@",
            Special: "00000",
            Custom: "#,##0;-#,##0"
        };
        var formatStringType = self.getFormatTypeFromFormatString(formatString) || "Custom";
        self.dropEditor1 = new DropEditor(container, self.formatTypeToRes[formatStringType], 'fontFamily', resources.formatText, self.formatTypeList, function (formatStringRes) {
            var formatString = self.getFormatStringFromFormatType(self.getFormatTypeFromRes(formatStringRes));
            self.inputtextEditor.updateData(formatString);
            self.dropEditor1.updateUI(formatStringRes);
        });
        self.inputtextEditor = new FormatStringEditor(container, formatString, designer.res.chartSliderPanel.axisFormat.formatCode, designer.res.chartSliderPanel.axisFormat.Add, function (value) {
            self.callBack('format', value);
        });
    }
    FormatEditor.prototype.getFormatTypeFromFormatString = function (formatString) {
        for (var key in this.formatTypeToString) {
            if (this.formatTypeToString[key] === formatString) {
                return key;
            }
        }
        return null;
    };
    FormatEditor.prototype.getFormatTypeFromRes = function (res) {
        for (var key in this.formatTypeToRes) {
            if (this.formatTypeToRes[key] === res) {
                return key;
            }
        }
        return null;
    };
    FormatEditor.prototype.getFormatStringFromFormatType = function (formatType) {
        return this.formatTypeToString[formatType];
    };
    function FormatStringEditor(container, formatCode, name, buttonName, callBack) {
        this.valueChanged = callBack;
        this.addContent(container, name, buttonName);
        this.updateData(formatCode);
    }
    FormatStringEditor.prototype.addContent = function (container, name, buttonName) {
        var self = this;
        self.button = $('<div></div>').addClass('input-reset-btn').text(buttonName).click(function () {
            self.valueChanged(self.input.val());
        });
        self.button.css({ "display": "inline-block" });
        self.input = $('<input />', { type: 'input' }).addClass('input-number-editor-auto').css({ "width": "65%" });
        if (container) {
            var label = $('<label></label>').css({ "margin-left": "6px", "width": "100%" }).text(name);
            this.domInput = $('<li></li>').append(label).append(self.input).append(this.button).css({
                "margin": "1px",
                "list-style-type": "none",
                "line-height": "28px",
                "height": "28px"
            });
            container.append(this.domInput);
        }
    };
    FormatStringEditor.prototype.updateData = function (data) {
        this.input.val(data);
    };
    //#region FontEditor
    function FontEditor(container, data, name, resources, fontChangedCallback) {
        this.changedFontOption = fontChangedCallback;
        var self = this;
        this.fontFamily = resources.fontFamily;
        this.fontSize = resources.fontSize;
        var fontSize = Math.round(Number(data.fontSize) * 3 / 4) || Math.round(Number(data.fontSizeTitle) * 3 / 4);
        this.dropEditor1 = new DropEditor(container, fontSize, 'fontSize', this.fontSize, fontSizeCollection, function (value) {
            return self.changedFontOption(data.fontSize ? 'fontSize' : 'fontSizeTitle', value * 4 / 3) * 3 / 4;
        });
        this.dropEditor2 = new DropEditor(container, data.fontFamily || data.fontFamilyTitle, 'fontFamily', this.fontFamily, fontFamilyCollection, function (value) {
            return self.changedFontOption(data.fontFamily ? 'fontFamily' : 'fontFamilyTitle', value);
        });
    }

    //#endregion FontEditor

    //#region DropEditor
    function DropEditor(container, data, name, text, collection, listChangedCallback) {
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
        li.append(this.itemsList.selectedElementListDom);
        this.dom = li;
        this.updateUI(data);
    }

    DropEditor.prototype._createDefaultElement = function (name) {
        var self = this;
        var button = $('<button></button>').addClass('ui-button ui-widget ui-state-default ui-button-text-icon-secondary ui-corner-left').addClass('format-panel-drop-default-button-' + name);
        var span1 = $('<span></span>').addClass('panel-button-text').addClass('format-panel-drop-default-span-' + name);
        var span2 = $('<span></span>').addClass('ui-button-icon-secondary ui-icon ui-icon-triangle-1-s');
        button.append(span1).append(span2);
        button.click(function () {
            if (!self.itemsList || !self.itemsList.selectedElementListDom) {
                return;
            }
            self.itemsList.selectedElementListDom.gcuipopup("show", {
                of: $(this),
                my: 'left+' + '0' + ' top+' + '22',
                at: 'left top'
            });
        });
        return button;
    };
    DropEditor.prototype.changedValue = function (value) {
        var result = this.listChanged(value);
        this.value = result;
        if (result) {
            this.updateUI(result);
        }
    };
    DropEditor.prototype.updateUI = function (value) {
        $('span:first', this.defauleItem).text(value);
    };
    DropEditor.prototype.show = function () {
        this.dom.show();
    };
    DropEditor.prototype.hide = function () {
        this.dom.hide();
    };
    //#endregion DropEditor

    //#region ItemsList
    function ItemsList(items, name, updateSelectedElementCallback) {
        var self = this;
        self.updateSelectedElement = updateSelectedElementCallback;
        self.selectedElementListDom = self.addItems(items, name);
    }

    ItemsList.prototype.addItems = function (items, name) {
        var self = this;
        var ul = $('<ul></ul>').css({
            background: "white",
            "z-index": "10",
            "padding-left": "0px"
        });
        if (name === 'fontFamily') {
            ul.css({
                "width": "210px"
            });
        }
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

    //#region LegendPositionEditor
    function LegendPositionEditor(container, data, name, resources, legendPositionChangedCallbck) {
        this.changedPosition = legendPositionChangedCallbck;
        var self = this;
        this.topText = resources.topText;
        this.bottomText = resources.bottomText;
        this.leftText = resources.leftText;
        this.rightText = resources.rightText;
        this.topRightText = resources.topRightText;
        this.radiogroup = new RadioGroup(container, [this.topText, this.bottomText, this.leftText, this.rightText, this.topRightText], name, function (element) {
            self.radioGroupSelectionChanged(element);
        });
        this.updateUI(data.position);
    }

    LegendPositionEditor.prototype.radioGroupSelectionChanged = function (value) {
        var result = this.changedPosition('position', value);
        if (result) {
            this.updateUI(result);
        }
    };
    LegendPositionEditor.prototype.updateUI = function (position) {
        var selectedItems = [, this.topText, this.rightText, this.leftText, this.bottomText, this.topRightText];
        this.radiogroup.setSelectedItem(selectedItems[position]);
    };
    //#endregion LegendPositionEditor

    //#region TextFillEditor
    function TextFillEditor(container, data, name, resources, textColorChangedCallback) {
        this.colorChanged = textColorChangedCallback;
        var self = this;
        this.colorEditor = new ColorEditor(container, data.color !== keyword_undefined ? data.color : data.colorTitle, data.transparency, name, {
            noColorText: resources.noColorText,
            solidColorText: resources.solidColorText
        }, function (color) {
            return self.colorChanged(data.color !== keyword_undefined ? 'color' : 'colorTitle', color);
        }, function (transparency) {
            return self.colorChanged(data.transparency !== keyword_undefined ? 'transparency' : 'titleTransparency', transparency);
        });
    }

    TextFillEditor.prototype.destroy = function () {
        if (this.colorEditor) {
            this.colorChanged = null;
            this.colorEditor.destroy();
            this.colorEditor = null;
        }
    };
    //#endregion TextFillEditor

    //#region SizeEditor
    function SizeEditor(container, data, name, resources, sizeChangeCallback) {
        var self = this;
        self.sheetName = designer.wrapper.spread.getActiveSheet().name();
        self.sizeChanged = sizeChangeCallback;
        this.widthEditor = new InputNumberEditor(container, resources.widthText, /*{min: 0, max: 3, type: int}, data.borderWidth, */function (width) {
            if (self.sizeChanged('width', width)) {
                self.updateWidthUI(data.width);
            }
        });

        this.heightEditor = new InputNumberEditor(container, resources.heightText, /*{min: 0, max: 3, type: int}, data.borderWidth, */function (height) {
            if (self.sizeChanged('height', height)) {
                self.updateHeightUI(data.height);
            }
        });
        self.updateWidthUI(data.width);
        self.updateHeightUI(data.height);
        self.floatingObjectChanged = function (e, info) {
            var width = info.floatingObject.width();
            var height = info.floatingObject.height();
            if (data.width !== width || data.height !== height) {
                self.updateWidthUI(width);
                self.updateHeightUI(height);
            }
        };
        designer.wrapper.spread.getActiveSheet().bind(GC.Spread.Sheets.Events.FloatingObjectChanged, self.floatingObjectChanged);
    }

    SizeEditor.prototype.updateWidthUI = function (value) {
        this.widthEditor.value = value;
        this.widthEditor.updateValue();
    };
    SizeEditor.prototype.updateHeightUI = function (value) {
        this.heightEditor.value = value;
        this.heightEditor.updateValue();
    };
    SizeEditor.prototype.destroy = function () {
        var self = this;
        if (self.widthEditor) {
            self.widthEditor = null;
        }
        if (self.heightEditor) {
            self.heightEditor = null;
        }
        var sheet = designer.wrapper.spread.getSheetFromName(self.sheetName);
        sheet.unbind(GC.Spread.Sheets.Events.FloatingObjectChanged, self.floatingObjectChanged);
        self.sheetName = null;
    };
    //#endregion SizeEditor

    function TrendlineOptionEditor(container, data, name, resources, optionsChangedCallback) {
        var res = designer.res.chartSliderPanel;
        var self = this;
        self.optionsChanged = optionsChangedCallback;
        this.orderEditor = new InputNumberEditor(null, "order", function (value) {
            self.optionsChanged("order", value)
        }, { min: 2, max: 6 });
        this.periodEditor = new InputNumberEditor(null, "period", function (value) {
            self.optionsChanged("period", value)
        }, { min: 2, max: data.dataSet.length - 1 });
        var hasNegativeNumber = false;
        for (var i = 0; i < data.dataSet.length; i++) {
            if (data.dataSet[i] !== null && data.dataSet[i] <= 0) {
                hasNegativeNumber = true;
                break;
            }
            if (data.displayBlanksAsZero && data.dataSet[i] === null) {
                hasNegativeNumber = true;
                break;
            }
        }
        var para = [
            {
                text: res.trendline.exponential,
                imgClass: "chart-slider-panel-radio-image chart-slider-panel-trendline-type-exponential",
                value: GC.Spread.Sheets.Charts.TrendlineType.exponential,
                disabled: hasNegativeNumber
            },
            {
                text: res.trendline.linear,
                imgClass: "chart-slider-panel-radio-image chart-slider-panel-trendline-type-linear",
                value: GC.Spread.Sheets.Charts.TrendlineType.linear
            },
            {
                text: res.trendline.logarithmic,
                imgClass: "chart-slider-panel-radio-image chart-slider-panel-trendline-type-logarithmic",
                value: GC.Spread.Sheets.Charts.TrendlineType.logarithmic
            },
            {
                text: res.trendline.polynomial,
                imgClass: "chart-slider-panel-radio-image chart-slider-panel-trendline-type-polynomial",
                value: GC.Spread.Sheets.Charts.TrendlineType.polynomial,
                appendSpan: this.orderEditor.inputSpan
            },
            {
                text: res.trendline.power,
                imgClass: "chart-slider-panel-radio-image chart-slider-panel-trendline-type-power",
                value: GC.Spread.Sheets.Charts.TrendlineType.power,
                disabled: hasNegativeNumber
            },
            {
                text: res.trendline.movingAverage,
                imgClass: "chart-slider-panel-radio-image chart-slider-panel-trendline-type-movingAverage",
                value: GC.Spread.Sheets.Charts.TrendlineType.movingAverage,
                appendSpan: this.periodEditor.inputSpan,
                disabled: data.dataSet.length <= 2,
            }
        ];
        this.typeEditor = new RadioGroupEx(container, para, "type", function (value) {
            var obj = self.optionsChanged("type", parseInt(value));
            self.updateUI(obj);
        });
        new ParagraphText(container, res.trendline.name);
        this.autoName = $('<label></label>').css({
            "float": "right",
            "width": "86px",
            "line-height": "100%",
            "font-size": "11px"
        });
        this.nameEditor = new InputTextEditor(null, "name", function (value) {
            var obj = self.optionsChanged("name", value);
            self.updateUI(obj);
        });
        para = [
            { text: res.automatic, value: "automatic", appendSpan: this.autoName },
            { text: res.custom, value: "custom", appendSpan: this.nameEditor.inputSpan }
        ];
        this.nameRadioEditor = new RadioGroupEx(container, para, "nameRadio", function (value) {
            var name;
            if (value === "custom") {
                name = self.nameEditor.text;
            } else {
                name = null;
            }
            var obj = self.optionsChanged("name", name);
            self.updateUI(obj);
        });
        if (data.isCustomName) {
            this.nameRadioEditor.setSelectedItem("custom");
        } else {
            this.nameRadioEditor.setSelectedItem("automatic");
        }
        new ParagraphText(container, res.trendline.forecast);
        this.forwardEditor = new InputNumberEditor(container, res.trendline.forward, function (value) {
            self.optionsChanged("forward", value)
        }, { min: 0, noArrow: true, float: true });
        this.backwardEditor = new InputNumberEditor(container, res.trendline.backward, function (value) {
            self.optionsChanged("backward", value)
        }, { min: 0, max: 100, noArrow: true, float: true });
        this.interceptInput = new InputNumberEditor(null, "intercept", function (value) {
            if (value === 0 && self.typeEditor.value === GC.Spread.Sheets.Charts.TrendlineType.exponential) {
                value = 1;
                self.interceptInput.setValue(1.0);
            }
            self.optionsChanged("intercept", value)
        }, { min: 0, noArrow: true, float: true }); //todo
        this.interceptCheckbox = new Checkbox(container, { text: res.trendline.intercept, appendSpan: this.interceptInput.inputSpan }, "interceptCheckbox", function (checked) {
            if (checked) {
                if (self.interceptInput.value === 0 && self.typeEditor.value === GC.Spread.Sheets.Charts.TrendlineType.exponential) {
                    self.interceptInput.setValue(1.0);
                }
                self.optionsChanged("intercept", self.interceptInput.value);
            } else {
                self.optionsChanged("intercept", null);
            }
        });
        this.displayEquationCheckbox = new Checkbox(container, { text: res.trendline.displayEquation, }, "displayEquation", function (checked) {
            self.optionsChanged("displayEquation", checked);
        });
        this.displayEquationCheckbox.setSelected(data.trendline.displayEquation);
        this.displayRSquaredCheckbox = new Checkbox(container, { text: res.trendline.displayRSquared, }, "displayRSquared", function (checked) {
            self.optionsChanged("displayRSquared", checked);
        });
        this.displayRSquaredCheckbox.setSelected(data.trendline.displayRSquared);
        this.updateUI(data.trendline);
    }
    TrendlineOptionEditor.prototype.updateUI = function (trendline) {
        this.orderEditor.setValue(trendline.order);
        this.periodEditor.setValue(trendline.period);
        this.typeEditor.setSelectedItem(trendline.type);
        if (this.nameRadioEditor.value === "custom") {
            this.nameEditor.text = trendline.name;
            this.nameEditor.updateValue();
        } else {
            this.autoName.text(trendline.name);
        }
        if (isNullOrUndefined(trendline.intercept)) {
            this.interceptInput.setValue(1);
            this.interceptCheckbox.setSelected(false);
        } else {
            this.interceptInput.setValue(trendline.intercept);
            this.interceptCheckbox.setSelected(true);
        }
        this.forwardEditor.setValue(trendline.forward);
        this.backwardEditor.setValue(trendline.backward);
        switch (trendline.type) {
            case GC.Spread.Sheets.Charts.TrendlineType.movingAverage:
                this.forwardEditor.disable();
                this.backwardEditor.disable();
                this.interceptCheckbox.disable();
                this.displayEquationCheckbox.disable();
                this.displayRSquaredCheckbox.disable();
                break;
            case GC.Spread.Sheets.Charts.TrendlineType.logarithmic:
            case GC.Spread.Sheets.Charts.TrendlineType.power:
                this.forwardEditor.enable();
                this.backwardEditor.enable();
                this.interceptCheckbox.disable();
                this.displayEquationCheckbox.enable();
                this.displayRSquaredCheckbox.enable();
                break;
            default:
                this.forwardEditor.enable();
                this.backwardEditor.enable();
                this.interceptCheckbox.enable();
                this.displayEquationCheckbox.enable();
                this.displayRSquaredCheckbox.enable();
        }
    };
    //#region LineEditor
    function LineEditor(container, data, name, resources, borderChangedCallback) {
        BorderEditor.call(this, container, data, name, resources, borderChangedCallback);
    }

    LineEditor.prototype = BorderEditor.prototype;
    LineEditor.prototype.constructor = BorderEditor;
    //#endregion LineEditor
    function ErrorBarEditor(container, data, name, resources, seriesOptionsChangedCallback) {
        var self = this;
        self.seriesOptionsChanged = seriesOptionsChangedCallback;
        this.both = resources.both;
        this.minus = resources.minus;
        this.plus = resources.plus;
        this.cap = resources.cap;
        this.noCap = resources.noCap;
        this.fixed = resources.fixed;
        this.percentage = resources.percentage;
        this.standardDev = resources.standardDev;
        this.standardErr = resources.standardErr;
        this.custom = resources.custom;
        container.append("<p>" + resources.direction + "</p>");
        var para = [
            {
                text: this.both,
                value: "both",
                imgClass: "chart-slider-panel-radio-image chart-slider-panel-errorBar-direction-both"
            },
            {
                text: this.minus,
                value: "minus",
                imgClass: "chart-slider-panel-radio-image chart-slider-panel-errorBar-direction-minus"
            },
            {
                text: this.plus,
                value: "plus",
                imgClass: "chart-slider-panel-radio-image chart-slider-panel-errorBar-direction-plus"
            },
        ];
        this.direRadiogroup = new RadioGroupEx(container, para, "direction", function (element) {
            self.radioGroupSelectionChanged(element);
        });
        container.append("<p>" + resources.endStyle + "</p>");
        para = [
            {
                text: this.noCap,
                value: "no cap",
                imgClass: "chart-slider-panel-radio-image chart-slider-panel-errorBar-endStyle-noCap"
            },
            {
                text: this.cap,
                value: "cap",
                imgClass: "chart-slider-panel-radio-image chart-slider-panel-errorBar-endStyle-cap"
            },
        ];
        this.endStyleRadiogroup = new RadioGroupEx(container, para, "endStyle", function (element) {
            self.radioGroupSelectionChanged(element);
        });
        this.fixedValueEditor = new InputNumberEditor(null, "fixedvalueinput", function (element) {
            self.radioGroupSelectionChanged("fixedvalueinput", element);
        }, { min: 0, noArrow: true, float: true });
        this.fixedValueEditor.setValue(0.1);
        this.percentageEditor = new InputNumberEditor(null, "percentageinput", function (element) {
            self.radioGroupSelectionChanged("percentageinput", element);
        }, { min: 0, max: 100, descString: '%', noArrow: true, float: true });
        this.percentageEditor.setValue(5);
        this.standardEditor = new InputNumberEditor(null, "standardEInput", function (element) {
            self.radioGroupSelectionChanged("standardEInput", element);
        }, { min: 0, noArrow: true, float: true });
        this.standardEditor.setValue(1);
        this.customEditer = new ButtonEditor(null, resources.specifyValue, function () {
            self.radioGroupSelectionChanged("Specify Value");
        });
        para = [
            { text: this.fixed, value: "Fixed value", appendSpan: this.fixedValueEditor.inputSpan },
            { text: this.percentage, value: "Percentage", appendSpan: this.percentageEditor.inputSpan },
            { text: this.standardDev, value: "Standard deviations", appendSpan: this.standardEditor.inputSpan },
            { text: this.standardErr, value: "Standard error", appendSpan: null },
            { text: this.custom, value: "Custom", appendSpan: this.customEditer.inputSpan }
        ];
        container.append("<p>" + resources.errorAmount + "</p>");
        var errorAmountContainer = $("<div class='gc-errorAmount-container'></div>")
        container.append(errorAmountContainer);
        this.errorAmount = new RadioGroupEx(errorAmountContainer, para, "errorAmount", function (element) {
            var value = 0;
            if (element === "Fixed value") {
                value = self.fixedValueEditor.value;
            } else if (element === "Percentage") {
                value = self.percentageEditor.value;
            } else if (element === "Standard deviations") {
                value = self.standardEditor.value;
            }
            self.radioGroupExSelectionChanged(element, value);
        });
        this.updateUI(data.errBar);
    }
    ErrorBarEditor.prototype.radioGroupSelectionChanged = function (value, elementValue) {
        var result = this.seriesOptionsChanged(value, elementValue ? elementValue : value.toLocaleLowerCase() === designer.res.chartSliderPanel.secondaryAxis.toLocaleLowerCase() ? 1 : 0);
        if (result === 0 || result === 1) {
            this.updateUI(result);
        }
    };
    ErrorBarEditor.prototype.radioGroupExSelectionChanged = function (element, value) {
        this.radioGroupSelectionChanged(element, value);
    };
    ErrorBarEditor.prototype.updateUI = function (axis) {
        var selectedItem = axis.type === 0 ? "both" : (axis.type === 1 ? "minus" : "plus");
        this.direRadiogroup.setSelectedItem(selectedItem);
        selectedItem = axis.noEndCap ? "no cap" : "cap";
        this.endStyleRadiogroup.setSelectedItem(selectedItem);
        selectedItem = axis.valueType === 0 ? "Custom" : (axis.valueType === 1 ? "Fixed value" : (axis.valueType === 2 ? "Percentage" : axis.valueType === 3 ? "Standard deviations" : "Standard error"));
        this.errorAmount.setSelectedItem(selectedItem);
        var value = axis.value;
        if (selectedItem === "Fixed value") {
            this.fixedValueEditor.setValue(value);
        } else if (selectedItem === "Percentage") {
            this.percentageEditor.setValue(value);
        } else if (selectedItem === "Standard deviations") {
            this.standardEditor.setValue(value);
        }
    };

    //#region SeriesEditor
    function SeriesEditor(container, data, name, resources, seriesOptionsChangedCallback) {
        var self = this;
        self.seriesOptionsChanged = seriesOptionsChangedCallback;
        this.primaryAxisText = resources.primaryAxisText;
        this.secondaryAxisText = resources.secondaryAxisText;
        this.radiogroup = new RadioGroup(container, [this.primaryAxisText, this.secondaryAxisText], name, function (element) {
            self.radioGroupSelectionChanged(element);
        });
        this.updateUI(data.axisGroup);
    }

    SeriesEditor.prototype.radioGroupSelectionChanged = function (value) {
        var result = this.seriesOptionsChanged('axisGroup', value.toLocaleLowerCase() === designer.res.chartSliderPanel.secondaryAxis.toLocaleLowerCase() ? 1 : 0);
        if (result === 0 || result === 1) {
            this.updateUI(result);
        }
    };
    SeriesEditor.prototype.updateUI = function (axis) {
        var selectedItem = axis ? this.secondaryAxisText : this.primaryAxisText;
        this.radiogroup.setSelectedItem(selectedItem);
    };
    //#endregion SeriesEditor

    //#region FillColorEditor
    function FillColorEditor(container, data, name, resources, colorChangedCallback) {
        this.colorChanged = colorChangedCallback;
        var self = this;
        this.colorEditor = new ColorEditor(container, data.backColor, data.transparency || 0, name, {
            noColorText: resources.noColorText,
            solidColorText: resources.solidColorText,
            automaticColorText: resources.automaticColorText
        }, function (color) {
            return self.colorChanged('backColor', color);
        }, function (transparency) {
            return self.colorChanged('backColorTransparency', transparency);
        });
    }

    FillColorEditor.prototype.destroy = function () {
        if (this.colorEditor) {
            this.colorChanged = null;
            this.colorEditor.destroy();
            this.colorEditor = null;
        }
    };
    //#endregion FillColorEditor

    //#region ColorEditor
    function ColorEditor(container, color, transparency, name, resources, changedValueCallback, changeOpacityCallBack, changedRadioGroupCallBack) {
        var self = this;
        var numTransparency = transparency || 0;
        self.noTransparency = isNullOrUndefined(transparency); //Add this for legend text transparency is hide. (No have Api)
        self.changedValue = changedValueCallback;
        self.changedOpacity = changeOpacityCallBack;
        self.changedRadioGroup = changedRadioGroupCallBack;
        self.noColorText = resources.noColorText;
        self.solidColorText = resources.solidColorText;
        self.automaticColorText = resources.automaticColorText;
        self.radiogroup = new RadioGroup(container, [this.noColorText, this.solidColorText, this.automaticColorText], name, function (element) {
            if (self.changedRadioGroup) {
                self.changedRadioGroup(element);
            }
            return self.radioGroupSelectionChanged(element);
        });
        self.colorpicker = new ColorPicker(container, function (value) {
            self.colorPicked(value);
        });
        self.opacityEditor = new InputNumberEditor(container, designer.res.chartSliderPanel.transparency, function (transparent) {
            self.changedOpacity(transparent / 100);
        }, { min: 0, max: 100, descString: '%' });//TODO
        self.updateUI(color, numTransparency * 100);
    }

    ColorEditor.prototype.radioGroupSelectionChanged = function (selectedItem) {
        var color, transparent;
        if (selectedItem === (this.noColorText && this.noColorText.toLocaleLowerCase())) {
            color = this.changedValue('');
            if (color || color === '') {
                this.updateUI(color, this.opacityEditor.value);
            }
        } else if (selectedItem === (this.automaticColorText && this.automaticColorText.toLocaleLowerCase())) {
            color = this.changedValue(designer.res.chartSliderPanel.automatic);
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
        this.color = color;
        if (color) {
            var colorString = color.text || (isNullOrUndefined(color.color) ? color : color.color);
            this.updateRadiogroup(colorString);
            if (colorString.toLocaleLowerCase() === designer.res.chartSliderPanel.automatic.toLocaleLowerCase()) {
                this.updateColorPicker(keyword_undefined);
                this.updateOpacityInputNum(0);
            } else {
                this.updateColorPicker(isNullOrUndefined(color.color) ? color : color.color);
                if (!isNullOrUndefined(transparency)) {
                    this.updateOpacityInputNum(transparency);
                }
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
        if (color !== keyword_undefined && color.toLocaleLowerCase() === designer.res.chartSliderPanel.automatic.toLocaleLowerCase()) {
            selectedItem = this.automaticColorText;
        } else {
            if (!color) {
                selectedItem = this.noColorText;
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
                if (judgeConvertColorString === true) {
                    selectedItem = this.automaticColorText;
                } else if (color === 'rgba(0,0,0,0)' || judgeConvertColorString === 'rgba(0,0,0,0)') {
                    selectedItem = this.noColorText;
                } else {
                    selectedItem = this.solidColorText;
                }
            }
        }
        this.radiogroup.setSelectedItem(selectedItem);
        this.selectedItem = selectedItem;
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
        if (this.noTransparency) {
            this.opacityEditor.hide();
        }
    };
    ColorEditor.prototype.updateOpacityInputNum = function (transparency) {
        this.opacityEditor.value = parseInt(transparency);
        this.opacityEditor.updateValue();
    };
    ColorEditor.prototype.destroy = function () {
        if (this.colorpicker) {
            this.changedValue = null;
            this.colorpicker.destroy();
            this.colorpicker = null;
        }
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

    //#region BorderEditor
    var markerFillEditor = null;        /*** Use this and below value to store the marker setting object  */
    var markerBorderEditor = null;      /*** When the marker shape changes to star/x/plus , it will read the color and may set the marker border fill to no fill*/
    function BorderEditor(container, data, name, resources, borderChangedCallback) {
        this.borderChanged = borderChangedCallback;
        var self = this;

        if (data.colorStr === 'markerFillColor') {
            markerFillEditor = self;
        } else if (data.colorStr === 'markerBorderColor') {
            markerBorderEditor = self;
        }
        self.colorStr = data.colorStr;
        self.transparentStr = data.transparentStr;
        self.widthStr = data.widthStr;
        self.lineTypeStr = data.lineTypeStr;

        this.colorEditor = new ColorEditor(container, data.color,
            data.transparency, name, {
            noColorText: resources.noColorText,
            solidColorText: resources.solidColorText,
            automaticColorText: resources.automaticColorText
        }, function (color) {
            return self.borderChanged(self.colorStr, color);
        }, function (transparency) {
            return self.borderChanged(self.transparentStr, transparency);
        }, function (element) {
            self.updateUI(self.widthEditor && self.widthEditor.value, self.dropEditor && self.dropEditor.value, element.toLocaleLowerCase() === resources.noColorText.toLocaleLowerCase());
        });
        if (self.widthStr) {
            this.widthEditor = new InputNumberEditor(container, resources.widthText, /*{min: 0, max: 3, type: int}, data.borderWidth, */function (width) {
                var result = self.borderChanged(self.widthStr, width);
                if (result) {
                    self.updateUI(result);
                }
            }, { min: 0 });
        }
        if (self.lineTypeStr) {
            this.dropEditor = new ImgDropEditor(container, data.lineType, {
                normal: '../images/dashLine.png',
                hover: '../images/dashLineHover.png',
                active: '../images/dashLineActive.png'
            }, {
                cssName: 'dashType',
                resName: resources.lineTypeText
            }, '../images/line.png', [0, 8, 7, 2, 4, 3, 5, 6], function (value) {
                return self.borderChanged(self.lineTypeStr, parseInt(value));
            });
        }
        this.updateUI(data.width, data.lineType, this.colorEditor.selectedItem.toLocaleLowerCase() === resources.noColorText.toLocaleLowerCase());
    }

    BorderEditor.prototype.updateUI = function (width, lineType, noColor) {
        if (noColor) {
            this.widthEditor && this.widthEditor.hide();
            this.dropEditor && this.dropEditor.hide();
        } else {
            this.widthEditor && this.widthEditor.show();
            this.dropEditor && this.dropEditor.show();
        }
        if (width !== keyword_undefined) {
            this.widthEditor.value = width;
            this.widthEditor.updateValue();
        }
        if (lineType !== keyword_undefined) {
            //this.dropEditor.value = lineType;
            //this.dropEditor.changedValue(lineType);
        }
    };
    BorderEditor.prototype.destroy = function () {
        if (this.colorEditor) {
            this.borderChanged = null;
            this.colorEditor.destroy();
            this.colorEditor = null;
        }
    };
    //#endregion BorderEditor
    function MarkerEditor(container, data, name, resources, markerChangedCallback) {
        var self = this;
        self.markerChangedCallback = markerChangedCallback;
        self.noMarkerText = resources.none;
        self.BuildInMarkerText = resources.builtIn;
        self.radiogroup = new RadioGroup(container, [self.noMarkerText, self.BuildInMarkerText], name, function (element) {
            self.radioGroupSelectionChanged(element);
        });
        self.dropEditor = new DropEditor(container, 0, "marker"/** Use the css */, resources.shapeText, markerShapeCollection, function (value) {
            self.markerChangedCallback("markerType", GC.Spread.Sheets.Charts.SymbolShape[value]);
            if (value === "star" || value === "plus" || value === "x") { /*** The marker shape changes to  star/x/plus When the markerBorder color and markerFill color same, set the marker border fill to no fill*/
                if (markerBorderEditor && markerFillEditor && markerBorderEditor.colorEditor && markerFillEditor.colorEditor && markerBorderEditor.colorEditor.color && markerFillEditor.colorEditor.color) {
                    var color1 = ColorHelper.parse(markerBorderEditor.colorEditor.color, designer.wrapper.spread.getActiveSheet().currentTheme()).color;
                    var color2 = ColorHelper.parse(markerFillEditor.colorEditor.color, designer.wrapper.spread.getActiveSheet().currentTheme()).color;
                    if (util.StringHelper_startsWith(color1, "#")) {
                        color1 = ColorHelper.hexToRgb(color1)
                    }
                    if (util.StringHelper_startsWith(color2, "#")) {
                        color2 = ColorHelper.hexToRgb(color2)
                    }
                    if (color1 === color2) {
                        markerFillEditor.colorEditor.radioGroupSelectionChanged(designer.res.chartSliderPanel.noFill.toLocaleLowerCase());
                    }
                }
            }
            return value;
        });
        self.widthEditor = new InputNumberEditor(container, resources.widthText, /*{min: 0, max: 3, type: int}, data.borderWidth, */function (value) {
            return self.markerChangedCallback("markerSize", value);
        }, { min: 0 });
        self.updateUI(data.shape, data.size);
    }
    MarkerEditor.prototype.radioGroupSelectionChanged = function (selectedItem) {
        if (selectedItem === (this.noMarkerText && this.noMarkerText.toLocaleLowerCase())) {
            this.markerChangedCallback("markerType", 4);
            this.updateUI(4, this.widthEditor.value);
        } else {
            this.updateUI(GC.Spread.Sheets.Charts.SymbolShape[this.dropEditor.value], this.widthEditor.value);
        }
    };
    MarkerEditor.prototype.updateUI = function (markerType, size) {
        if (markerType === 5 /** picture */) { //For bug sjs-881. Don't support picture current.
            markerType = 0;
        }
        if (markerType === 4 /** none */) {
            this.dropEditor.hide();
            this.widthEditor.hide();
            this.radiogroup.setSelectedItem(this.noMarkerText);
        } else {
            markerType = markerType || 0 /* circle */;
            this.dropEditor.show();
            this.dropEditor.changedValue(GC.Spread.Sheets.Charts.SymbolShape[markerType]);
            this.widthEditor.show();
            this.widthEditor.value = parseInt(size);
            this.widthEditor.updateValue();
            this.radiogroup.setSelectedItem(this.BuildInMarkerText);
        }
    };

    //#region InputNumberEditor
    function ButtonEditor(container, title, buttonClickCallback, option) {
        this.buttonClick = buttonClickCallback;
        this.addButtonEditor(title, container);
        this.descString = (option && option.descString) || '';
    }
    ButtonEditor.prototype.addButtonEditor = function (title, container) {
        var self = this;
        var span = $('<span></span>').addClass('ui-spinner ui-widget ui-widget-content ui-corner-all').css({
            "width": "85px",
            "float": "right",
            "margin-right": "3px",
            "height": "23px"
        });
        var button = $('<button>' + title + '</button>').addClass("inputEditor" + title).css({
            "position": "absolute",
            "border": "0",
            "height": "100%",
            "width": "100%",
            "white-space": "nowrap",
            "text-overflow": "ellipsis",
            "overflow": "hidden"
        }).click(function () {
            self.buttonClick();
        });
        span.append(button);
        if (container) {
            var label = $('<label></label>').css({ "margin-left": "6px" }).text(title);
            this.domInput = $('<li></li>').append(label).append(span).css({
                "margin": "1px",
                "list-style-type": "none",
                "line-height": "25px"
            });
            container.append(this.domInput);
        } else {
            self.inputSpan = span;
            this.domInput = span;
        }
    };
    function InputSelectEditor(container, data, valueChangedCallback, option) {
        this.valueChanged = valueChangedCallback;
        this.addInputSelectEditor(data, container, option);
    }

    InputSelectEditor.prototype.addInputSelectEditor = function (data, container, option) {
        var self = this;
        this.value = 0;

        var span = $('<span></span>').addClass('ui-spinner ui-widget ui-widget-content ui-corner-all').css({
            "width": "85px",
            "float": "right",
            "margin-right": "3px",
            "height": "23px"
        });
        var input = $('<input />', { type: 'input' }).addClass('label-top-padding numeric column1 ui-spinner-input').css({
            "position": "absolute",
            "left": "1px",
            "top": "1px"
        }).change(function () {
            self.valueChanged($(input).val());
        });
        var aTop = $('<a />').addClass('ui-spinner-button ui-spinner-down ui-corner-tr ui-button ui-widget ui-state-default ui-button-text-only').css("height", "100%").append($('<div></div>').css({
            "width": "0",
            "height": "0",
            "margin-top": "8px",
            "border-width": "6px 4px",
            "border-style": "solid",
            "border-color": "rgba(0, 0, 0, 0.4) transparent transparent",
            "display": "inline-block"
        })).click(function () {
            if (!self.itemsList || !self.itemsList.selectedElementListDom) {
                return;
            }
            self.itemsList.selectedElementListDom.gcuipopup("show", {
                of: $(this),
                my: 'left+' + '0' + ' top+' + '22',
                at: 'left top'
            });
        });
        this.itemsList = new ItemsList(data.items, "aaaa", function (element) {
            $(input).val(element);
            self.valueChanged($(input).val());
        });
        span.append(input).append(aTop);
        if (container) {
            var label = $('<label></label>').css({ "margin-left": "6px" }).text(data.title);
            this.domInput = $('<li></li>').append(label).append(span).css({
                "margin": "1px",
                "list-style-type": "none",
                "line-height": "25px"
            }).append(this.itemsList.selectedElementListDom);
            this.input = input;
            container.append(this.domInput);
        } else {
            this.input = input;
            this.domInput = span;
        }
    };
    InputSelectEditor.prototype.setValue = function (value) {
        $(this.input).val(value);
    };
    InputSelectEditor.prototype.hide = function () {
        this.domInput.hide();
    };
    InputSelectEditor.prototype.show = function () {
        this.domInput.show();
    };
    function InputNumberEditor(container, title, valueChangedCallback, option) {
        this.valueChanged = valueChangedCallback;
        this.addInputNumberEditor(title, container, option);
        this.maxValue = option && !isNullOrUndefined(option.max) ? option.max : Number.MAX_VALUE;
        this.minValue = option && !isNullOrUndefined(option.min) ? option.min : -Number.MAX_VALUE;
        this.descString = (option && option.descString) || '';
    }
    InputNumberEditor.prototype.addInputNumberEditor = function (title, container, option) {
        var self = this;
        this.value = 0;
        var span = $('<span></span>').addClass('ui-spinner ui-widget ui-widget-content ui-corner-all').css({
            "width": "85px",
            "float": "right",
            "margin-right": "3px",
            "height": "23px",
            "margin-top": "5px"
        });
        var input = $('<input />', { type: 'input' }).addClass('label-top-padding numeric column1 ui-spinner-input').css({
            "position": "absolute",
            "left": "1px",
            "top": "1px"
        }).change(function () {
            var value;
            if (option.float) {
                value = parseFloat($(input).val());
            } else {
                value = parseInt($(input).val());
            }
            self.value = self.adjustValue(value);
            self.updateValue(option.float);
            self.valueChanged(self.value);
        });
        if (!option || !option.noArrow) {
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
                if ($("input", self.domInput).prop("disabled")) {
                    return;
                }
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
                if ($("input", self.domInput).prop("disabled")) {
                    return;
                }
                var value = self.value;
                value = value - 1;
                self.value = self.adjustValue(value);
                self.updateValue();
                self.valueChanged(self.value);
            });
            span.append(input).append(aTop).append(aBottom);
        } else {
            span.append(input);
        }
        if (container) {
            var label = $('<label></label>').css({ "margin-left": "6px" }).text(title);
            this.domInput = $('<li></li>').append(label).append(span).css({
                "margin": "1px",
                "list-style-type": "none",
                "line-height": "30px"
            });
            container.append(this.domInput);
            this.inputSpan = span;
        } else {
            this.inputSpan = span;
            this.domInput = span;
        }
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
        return value;
    };
    InputNumberEditor.prototype.updateValue = function (needFloat) {
        $('input', this.domInput).val((needFloat ? parseFloat(this.value) : Math.round(this.value)) + this.descString);
    };
    InputNumberEditor.prototype.setValue = function (value) {
        var val = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        this.value = value;
        $(this.inputSpan[0]).find(".ui-spinner-input").val(val + this.descString);
    };
    InputNumberEditor.prototype.hide = function () {
        this.domInput.hide();
    };
    InputNumberEditor.prototype.show = function () {
        this.domInput.show();
    };
    InputNumberEditor.prototype.disable = function () {
        this.domInput.addClass("disabled");
        $("input", this.domInput).attr("disabled", true);
    };
    InputNumberEditor.prototype.enable = function () {
        this.domInput.removeClass("disabled");
        $("input", this.domInput).attr("disabled", false);
    };
    //#endregion InputNumberEditor
    function ImgDropEditor(container, data, defaultImgUrlObj, text, ImgListUrl, value, listChangedCallback, lineEditor) {
        if (isNullOrUndefined(data)) {
            data = 0;
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

    //#region InputTextEditor
    function InputTextEditor(container, title, valueChangedCallback, isShowAuto) {
        this.valueChanged = valueChangedCallback;
        this.isShowAuto = isShowAuto || false;
        this.addInputTextEditor(title, container);
    }

    InputTextEditor.prototype.addInputTextEditor = function (title, container) {
        var self = this;
        this.text = '';
        var input;
        if (this.isShowAuto) {
            this.autoDescLabel = $('<div></div>').addClass('input-auto-desc').text(designer.res.chartSliderPanel.auto);
            this.resetBtn = $('<div></div>').addClass('input-reset-btn').text(designer.res.chartSliderPanel.reset).click(function () {
                this.text = null;
                self.valueChanged(this.text);
            });
            input = $('<input />', { type: 'input' }).addClass('input-number-editor-auto').change(function (event) {
                this.text = $(event.target).val();
                self.valueChanged(this.text);
            });
        } else {
            input = $('<input />', { type: 'input' }).addClass('input-number-editor').change(function (event) {
                this.text = $(event.target).val();
                self.valueChanged(this.text);
            });
        }
        if (container) {
            var label = $('<label></label>').css({ "margin-left": "6px", "float": "left", "width": "70px" }).text(title);
            self.inputSpan = input;
            self.domInput = $('<li></li>').append(label).append(input).append(this.resetBtn).append(this.autoDescLabel).css({
                "margin": "1px",
                "list-style-type": "none",
                "line-height": "28px",
                "height": "28px"
            });
            container.append(this.domInput);
        } else {
            input.css("width", "80px");
            self.inputSpan = input;
            self.domInput = input;
        }
    };
    InputTextEditor.prototype.updateValue = function () {
        if (this.isShowAuto) {
            if (this.text === undefined || this.text === null) {
                this.resetBtn.css({ "display": "none" });
                this.autoDescLabel.css({ "display": "inline-block" });
            } else {
                this.autoDescLabel.css({ "display": "none" });
                this.resetBtn.css({ "display": "inline-block" });
            }
        }
        this.inputSpan.val(this.text);
    };
    //#endregion InputTextEditor

    //#region RadioGroup
    function RadioGroup(container, items, name, radioGroupSelectedItemCallback) {
        var self = this;
        self.updateRaidoSelectedItem = radioGroupSelectedItemCallback;
        self.domRadio = container;
        items.forEach(function (item) {
            if (item) {
                container.append(self.addRadioItem(name, item));
            }
        });
    }

    RadioGroup.prototype.addRadioItem = function (name, title) {
        var self = this;
        var radioItem = _createRadioItem(name, title);
        $(radioItem.children()[0]).click(function (event) {
            self.updateRaidoSelectedItem($(event.currentTarget).data('name'));
        });
        return radioItem;
    };
    RadioGroup.prototype.setSelectedItem = function (selectedElement) {
        var dataName = selectedElement.toLocaleLowerCase();
        $("[data-name='" + dataName + "']", this.domRadio).prop('checked', true);
    };

    function _createRadioItem(name, title) {
        var radio = $('<input />', {
            type: 'radio',
            name: name
        }).attr('data-name', _buildRadioDataName(title)).attr('id', _buildRadioDataName(title));
        var label = $('<label></label>').text(title).attr('for', _buildRadioDataName(title));

        var span = $('<span></span>').append(radio).append(label).attr('data-name', _buildRadioDataName(title)).attr('id', _buildRadioDataName(title));
        return $('<li></li>').append(span).css({
            "list-style-type": "none",
            "line-height": "30px"
        });
    }
    function ParagraphText(container, text) {
        var self = this;
        self.dom = $('<p></p>').append(text);
        container.append(self.dom);
    }
    function Checkbox(container, item, name, checkboxSelectedItemCallback) {
        var self = this;
        self.updateSelected = checkboxSelectedItemCallback;
        self.container = container;
        self.item = item;
        self.contentDom = self._createCheckbox(name, item.text, item.appendSpan);
        container.append(self.contentDom);
    }
    Checkbox.prototype.setSelected = function (value) {
        this.checkbox[0].checked = value;
        this.updateAppendInput(value);
    };
    Checkbox.prototype.updateAppendInput = function (value) {
        if (this.item.appendSpan) {
            if (value) {
                this.item.appendSpan.removeClass("disabled");
                $("input", this.item.appendSpan).attr("disabled", false);
            } else {
                this.item.appendSpan.addClass("disabled");
                $("input", this.item.appendSpan).attr("disabled", true);
            }
        }
    };
    Checkbox.prototype._createCheckbox = function (name, text, append) {
        var self = this;
        var id = name + "_";
        var input = $('<input />', {
            type: 'checkbox',
            name: name
        }).attr('id', id);
        self.checkbox = input;
        $(input).change(function (event) {
            var value = input[0].checked;
            self.updateSelected(value);
            self.updateAppendInput(value);
        });
        var label = $('<label></label>').text(text).attr('for', id);
        var span = $('<span></span>').append(input).append(label).append(append);
        return $('<li></li>').append(span).css({
            "list-style-type": "none",
            "line-height": "25px"
        });
    };
    Checkbox.prototype.show = function () {
        this.contentDom.show();
    };
    Checkbox.prototype.hide = function () {
        this.contentDom.hide();
    };
    Checkbox.prototype.disable = function () {
        this.contentDom.addClass("disabled");
        this.checkbox.attr("disabled", true);
    };
    Checkbox.prototype.enable = function () {
        this.contentDom.removeClass("disabled");
        this.checkbox.attr("disabled", false);
    };
    function RadioGroupEx(container, items, name, radioGroupSelectedItemCallback) {
        var self = this;
        self.updateRaidoSelectedItem = radioGroupSelectedItemCallback;
        self.domRadio = container;
        self.items = items;
        self.value = null;
        items.forEach(function (item) {
            if (item) {
                container.append(self.addRadioItem(name, item));
            }
        });
    }
    RadioGroupEx.prototype.addRadioItem = function (name, item) {
        var self = this;
        var radioItem = self._createRadioExItem(name, item.text, item.value, item.appendSpan, item.imgClass, item.disabled);
        return radioItem;
    };
    RadioGroupEx.prototype.setSelectedItem = function (value) {
        $("[data-value='" + value + "']", this.domRadio).prop('checked', true);
        this.value = value;
        this.updateAppendInput(value);
    };
    RadioGroupEx.prototype.updateAppendInput = function (value) {
        this.items.forEach(function (item) {
            if (item.appendSpan) {
                if (item.value == value) {
                    $("input", item.appendSpan).attr("disabled", false);
                    item.appendSpan.removeClass("disabled");
                    item.appendSpan.attr("disabled", false);
                } else {
                    $("input", item.appendSpan).attr("disabled", true);
                    item.appendSpan.addClass("disabled");
                    item.appendSpan.attr("disabled", true);
                }
            }
        });
    };
    RadioGroupEx.prototype._createRadioExItem = function (name, text, value, append, imgClass, disabled) {
        var self = this;
        var id = name + "_" + value;
        var radio = $('<input />', {
            type: 'radio',
            name: name
        }).attr('data-value', value).attr('id', id);
        $(radio).change(function (event) {
            var value = $(event.currentTarget).attr('data-value');
            self.value = value;
            self.updateRaidoSelectedItem(value);
            self.updateAppendInput(value);
        });
        var label = $('<label></label>').text(text).attr('for', id).attr('data-value', value);
        if (disabled) {
            $(radio).attr("disabled", true);
            if (append) {
                $('input', append).attr("disabled", true);
            }
        }
        var span = $('<span></span>').attr('data-value', value).append(radio).append(label).append(append);
        if (imgClass) {
            if (disabled) {
                imgClass = imgClass + "-disable";
            }
            var imgSpan = $('<span></span>').addClass(imgClass);
            return $('<li></li>').append(imgSpan).append(span).css({
                "list-style-type": "none",
                "line-height": "35px"
            });
        } else {
            return $('<li></li>').append(span).css({
                "list-style-type": "none",
                "line-height": "25px"
            });
        }
    }

    //#region ColorPicker
    function ColorPicker(container, colorChangedCallback) {
        this.colorChangedCallBack = colorChangedCallback;
        this.domColor = this.createColorElement();
        container.append(this.domColor);
    }

    ColorPicker.prototype.createColorElement = function (name) {
        var self = this;
        self.color = defaultColor || 'transparent';

        var container = $('<div></div>').css({
            "width": "143px",
            "margin": "3px",
            "float": "right",
            "display": "inline-block"
        });
        var content = $('<span></span>').appendTo(container);
        $('<span></span>').addClass('color-picker-span').appendTo(content);
        self.popupDom = $('<div></div>').appendTo(container);
        if (!self._colorPicker) {
            self._colorPicker = $('<div></div>').addClass('forecolor-picker').colorpicker({
                valueChanged: function (es, value) {
                    self.colorChangedCallBack(value.name || value.color);
                },
                choosedColor: function (es, value) {
                    container.comboframe('close');
                },
                openColorDialog: function (es, value) {
                    container.comboframe('close');
                },
                showNoFill: false,
                themeColors: designer.wrapper.getThemeColors()
            }).appendTo(self.popupDom);
        }
        self.popupDom.gcuipopup({
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
    ColorPicker.prototype.showColorPicker = function () {
        this.domColor.show();
    };
    ColorPicker.prototype.hideColorPicker = function () {
        this.domColor.hide();
    };
    ColorPicker.prototype.updateColor = function () {
        $('.color-picker-span', this.domColor).css({ 'background-color': this.color });
    };
    ColorPicker.prototype.destroy = function () {
        if (this.popupDom) {
            this.popupDom.gcuipopup('destroy');
            this._colorPicker.colorpicker('destroy');
            this.colorChangedCallBack = null;
            this._colorPicker = null;
            this.popupDom = null;
        }
    };
    //#endregion ColorPicker

    //#region InitSelectedElementEditor
    function InitSelectedElementEditor(elements, updateSelectedElementCallback) {
        this.updateSelectedElement = updateSelectedElementCallback;
        this.selectedElementListDom = this.createSlectedElementEditor(elements);
    }

    InitSelectedElementEditor.prototype.createSlectedElementEditor = function (elements) {
        var self = this;
        var ul = $('<ul></ul>').addClass('chart-selected-element');

        var ulpopup = $('<div>').addClass("select-element-popup").append(ul);
        ulpopup.gcuipopup({
            autoHide: true
        });

        for (var i = 0; i < elements.elements.length; i++) {
            var ele = elements.elements[i];
            var li = $('<li></li>').attr('data-index', i).append($('<label></label>').text(ele.text).css({ "margin-left": "2px" })).css({
                "list-style-type": 'none',
                "line-height": "25px",
                "text-overflow": "ellipsis",
                "white-space": "nowrap",
                "overflow": "hidden",
                "width": "220px"
            });

            if (ele.item === elements.currentElement.item && (isNullOrUndefined(ele.seriesIndex) || ele.seriesIndex === elements.currentElement.seriesIndex)) {
                li.addClass("selected");
            }

            li.click(function (event) {
                var selectIndex = $(event.currentTarget).attr('data-index');
                self.changedSlectedElement(selectIndex);
            }).mouseenter(function () {
                $(this).css("background", "#cfeadb");
            }).mouseleave(function () {
                $(this).css("background", "");
                var nodes = this.parentElement.childNodes;
                for (var i = 0; i < nodes.length; i++) {
                    $(nodes[i]).css('background', '');
                }
            });
            ul.append(li);
        }
        return ulpopup;
    };
    InitSelectedElementEditor.prototype.changedSlectedElement = function (selectIndex) {
        this.updateSelectedElement(selectIndex);
        this.selectedElementListDom.hide();
    };
    //#endregion InitSelectedElementEditor

    //#region InitSelectedChartElement
    function InitSelectedChartElement(elements, updateSelectedChartElementCallback) {
        var self = this;
        this.updateSelectedChartElement = updateSelectedChartElementCallback;
        this.selectedElement = this.createSelectedChartElement(elements);
        self.elements = elements;
    }

    InitSelectedChartElement.prototype.createSelectedChartElement = function (elements) {
        var self = this;
        var triangle = $("<div><div").addClass('triangle-chart-selected-element').attr('name', 'triangle-chart').click(function (event) {

            if (event.target === event.currentTarget) {
                if (!($(event.target).children()[0])) {
                    return;
                }
                var element = self.selectedItem || self.elements.currentElement.item;
                if (self.element === element) {
                    self.element = keyword_undefined;
                    return;
                } else {
                    $('.select-element-popup', $(event.target)).gcuipopup("show", {
                        of: $(".this-class"),
                        my: 'left+' + '6' + ' top+' + '22',
                        at: 'left top'
                    });
                    self.element = element;
                }
            }
        });

        var initSelectedElementEditor = new InitSelectedElementEditor(elements, function (selectedIndex) {
            self.selectedIndex = selectedIndex;
            self.changedSelectedChartElement(selectedIndex);
        });
        triangle.append(initSelectedElementEditor.selectedElementListDom);

        return $('<div></div>').css({
            "color": "rgba(0, 0, 0, 0.7)",
            "height": '25px'
        }).append($("<div>").addClass('this-class').css({
            padding: "2px 15px"
        }).append($("<label>").text(elements.currentElement.element).css({
            "font-weight": "bold",
            "font-size": "10pt"
        })).append(triangle));
    };
    InitSelectedChartElement.prototype.changedSelectedChartElement = function (selectedIndex) {
        var elements = this.elements.elements;
        this.updateSelectedChartElementText(elements[selectedIndex].text);
        this.updateSelectedChartElement(elements[selectedIndex]);
    };
    InitSelectedChartElement.prototype.updateSelectedChartElementText = function (text) {
        $('label:first', this.selectedElement).text(text);
    };

    //#endregion InitSelectedChartElement

    function initSliderPanelHeader(sliderPanelContainer, title) {
        var sliderPanelHeader = $("<div>").css({
            "color": "rgba(0, 0, 0, 0.8)",
            "height": "40px"
        }).appendTo(sliderPanelContainer);
        sliderPanelHeader.children().remove();
        var mainHeader = $("<div>").css({
            padding: "0px 10px",
            "padding-top": "10px"
        }).appendTo(sliderPanelHeader);
        $("<label>").text(title).css({
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
        return new ChartPanelContainer(sliderPanelContent, dataManager, updateSlideCallBack); // NOSONAR
    }

    function updateSliderPanelUI(sliderPanel, dataManager, updateCallBack) {
        sliderPanel.sliderpanel();
        var sliderPanelContainer = sliderPanel.sliderpanel("getContainer", "panel2");
        sliderPanelContainer.children().remove();

        var title = dataManager.getHeaderData().title;
        initSliderPanelHeader(sliderPanelContainer, title);
        return initSliderPanelContent(sliderPanelContainer, dataManager, updateCallBack);
    }

    //#region ChartPanelContainer
    function ChartPanelContainer(container, dataManager, updateSlideCallBack) {
        var self = this;
        self.owner = dataManager;
        self.container = container;
        self.updateSlideCallBack = updateSlideCallBack;
        var initSelectedChartElement = new InitSelectedChartElement(this.owner.getElements(), function (selectedElement) {
            self.updateChartPanelTab(selectedElement);
            self.updateSlideCallBack();
        });
        self.container.append(initSelectedChartElement.selectedElement);
        self.initChartPanelContent();
        self._selectedElement = initSelectedChartElement.selectedElement;
    }
    ChartPanelContainer.prototype.refreshSelectedChartElement = function () {
        var self = this;
        var initSelectedChartElement = new InitSelectedChartElement(this.owner.getElements(), function (selectedElement) {
            self.updateChartPanelTab(selectedElement);
            self.updateSlideCallBack();
        });
        self.container.get(0).replaceChild(initSelectedChartElement.selectedElement.get(0), self._selectedElement.get(0));
        self._selectedElement = initSelectedChartElement.selectedElement;
    }

    ChartPanelContainer.prototype.initChartPanelContent = function () {
        var datas = this.owner.getDatas();
        this.chartPanelContent = new PropertyTabPanel(datas, this.owner);
        this.chartPanelContentDom = this.chartPanelContent.dom;
        this.container.append(this.chartPanelContentDom);
    };
    ChartPanelContainer.prototype.updateChartPanelTab = function (selectedElement) {
        this.owner._selectedItem = selectedElement.item;
        this.owner._selectedSeries = selectedElement.seriesIndex;
        this.chartPanelContentDom.remove();
        this.initChartPanelContent();
    };
    ChartPanelContainer.prototype.destroy = function () {
        if (this.chartPanelContent && this.chartPanelContent.destroy) {
            this.updateSlideCallBack = null;
            this.chartPanelContent.destroy();
            this.chartPanelContent = null;
        }
    };
    //#endregion ChartPanelContainer

    //#region sliderPanel DataManager
    function SliderPanelDataManager(chart, chartElement, selectedItem, selectedSeries, category, dataPointIndex) {
        this._chart = chart;
        this._selectedElement = chartElement;
        this._selectedItem = selectedItem;
        this._selectedSeries = selectedSeries;
        this._categories = category;
        this._dataPointIndex = dataPointIndex;
        if (!isNullOrUndefined(dataPointIndex)) {
            this._selectedElement = 'dataPoints';
            this._selectedItem = 'dataPoints';
        }
        this.makeChartData(chart);
    }

    SliderPanelDataManager.prototype.getHeaderData = function () {
        var selectedElement = this._selectedElement;
        switch (selectedElement) {
            case "series":
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.dataSeries };
            case "errorBar":
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.errorBar };
            case "trendline":
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.trendline };
            case "dataPoints":
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.dataPoints };
            case "axis":
                if (this._selectedItem === 'primaryValueUnitsLabel' || this._selectedItem === 'secondaryValueUnitsLabel') {
                    return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.unitsLabel };
                }
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.axis };
            case "legend":
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.legend };
            case "dataLabels":
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.dataLable };
            case "chartTitle":
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.chartTitle };
            case "plotArea":
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.plotArea };
            case "chartArea":
                return { title: designer.res.chart.formatChartArea + designer.res.chart.formatChart.chartArea };
            default:
                return { title: designer.res.chart.formatChartArea };
        }
    };
    SliderPanelDataManager.prototype.updateData = function (namePath, dataPath, pathName, value) {
        var selectedElement = this._selectedElement;
        var tempSelectedForAxis = this._tempSelectedForAxis;
        var datas = this._data;
        var data = this.getSelectedData();
        var names = pathName.split('.');
        var self = this;
        var spread = designer.wrapper.spread;
        var chart = self._chart;
        var result, option, property;
        var loop, newData, j, names1, names2;
        switch (selectedElement) {
            case "series":
                var tempResult, i = self._selectedSeries;
                if (chart && !isNullOrUndefined(i)) {
                    property = names[names.length - 1];
                    option = chart.series().get(i);
                    var isFillSetting = false;
                    if (property === 'borderColor') {
                        option.border.color = value;
                    } else if (property === 'borderWidth') {
                        option.border.width = value;
                    } else if (property === 'borderTransparency') {
                        option.border.transparency = value;
                    } else if (property === 'markerType') {
                        option.symbol = option.symbol || {};
                        option.symbol.shape = value;
                    } else if (property === 'markerSize') {
                        option.symbol = option.symbol || {};
                        option.symbol.size = value;
                    } else if (property === 'markerFillColor') {
                        option.symbol = option.symbol || {};
                        option.symbol.fill = value;
                    } else if (property === 'markerFillTransparency') {
                        option.symbol = option.symbol || {};
                        option.symbol.fillColorTransparency = value;
                    } else if (property === 'markerBorderColor') {
                        option.symbol = option.symbol || {};
                        option.symbol.border = option.symbol.border || {};
                        option.symbol.border.color = value;
                    } else if (property === 'markerBorderTransparency') {
                        option.symbol = option.symbol || {};
                        option.symbol.border = option.symbol.border || {};
                        option.symbol.border.colorTransparency = value;
                    } else if (property === 'markerBorderWidth') {
                        option.symbol = option.symbol || {};
                        option.symbol.border = option.symbol.border || {};
                        option.symbol.border.width = value;
                    } else if (property === 'markerBorderLineType') {
                        option.symbol = option.symbol || {};
                        option.symbol.border = option.symbol.border || {};
                        option.symbol.border.lineType = value;
                    } else {
                        isFillSetting = true;
                        if (value === designer.res.chartSliderPanel.automatic) {
                            var group = (chart.colorAndStyle && chart.colorAndStyle.color) && (chart.colorAndStyle && chart.colorAndStyle.color)['group'];
                            var index = (chart.colorAndStyle && chart.colorAndStyle.color) && (chart.colorAndStyle && chart.colorAndStyle.color)['index'];
                            designer.actions.doAction('changeChartSeriesColor', designer.wrapper.spread, {
                                group: group,
                                index: index,
                                type: property,
                                ignoreEvent: true
                            }, chart);
                            tempResult = { text: designer.res.chartSliderPanel.automatic };
                        } else if ((chartHelper.getChartTypeString(chart.chartType()) === 'pie' || chartHelper.getChartTypeString(chart.chartType()) === 'doughnut') && property === 'backColor') {
                            var pieBackColor = chartHelper.getPieColorArray(option[property]);
                            loop = 1;
                            option[property] = value;
                            while (loop < pieBackColor.length) {
                                option[property] += ',' + value;
                                loop++;
                            }
                        } else {
                            option[property] = value;
                        }
                    }
                    if (value !== designer.res.chartSliderPanel.automatic) {
                        option.isFillSetting = isFillSetting;
                        designer.actions.doAction("updateChartSeries", spread, {
                            chart: chart, element: {
                                index: i,
                                value: option
                            }
                        });
                    }
                    newData = chart.series().get(i);
                    names1 = namePath.split('.');
                    for (j = 0; j < names1.length; j++) {
                        data = data[names1[j]];
                    }
                    names2 = dataPath;
                    for (j = 0; j < names2.length;) {
                        data = data[names2[j]][names2[j + 1]];
                        j += 2;
                    }
                    for (j = 0; j < names.length - 1; j++) {
                        data = data[names[j]];
                    }
                    if (property === 'borderColor') {
                        value = newData.border.color;
                    } else if (property === 'borderWidth') {
                        value = newData.border.width;
                    } else if (property === 'borderTransparency') {
                        value = newData.border.transparency;
                    } else if (property === 'markerType') {
                        value = newData.symbol.shape;
                    } else if (property === 'markerSize') {
                        value = newData.symbol.size;
                    } else if (property === 'markerFillColor') {
                        value = newData.symbol.fill;
                    } else if (property === 'markerFillTransparency') {
                        value = newData.symbol.fillColorTransparency;
                    } else if (property === 'markerBorderColor') {
                        value = newData.symbol.border.color;
                    } else if (property === 'markerBorderTransparency') {
                        value = newData.symbol.border.colorTransparency;
                    } else if (property === 'markerBorderWidth') {
                        value = newData.symbol.border.width;
                    } else if (property === 'markerBorderLineType') {
                        value = newData.symbol.border.lineType;
                    } else {
                        value = newData[property];
                    }
                    result = data[property] = value;
                }
                if (tempResult) {
                    tempResult['color'] = result;
                    return tempResult;
                }
                return result;
            case "dataPoints":
                property = names[names.length - 1];
                var dataPointIndex = self._dataPointIndex, dataPointOption, nameString = property;
                if (!isNullOrUndefined(dataPointIndex) && !isNullOrUndefined(value) && chart.series() && chart.series().dataPoints()) {
                    property = names[names.length - 1];
                    switch (property) {
                        case 'backColor':
                            dataPointOption = { fillColor: value };
                            nameString = 'fillColor';
                            break;
                        case 'backColorTransparency':
                            dataPointOption = { transparency: value };
                            nameString = 'transparency';
                            break;
                        default:
                            dataPointOption = null;
                            break;
                    }
                    if (dataPointOption) {
                        designer.actions.doAction("changeDataPointProperty", spread, {
                            chart: chart,
                            dataPointIndex: dataPointIndex,
                            dataPointOption: dataPointOption
                        });
                    }
                }
                var dataPoint = chart.series().dataPoints().get(dataPointIndex);
                value = dataPoint[nameString];
                result = data[property] = value;
                return result;
            case "trendline":
                i = self._selectedSeries;
                if (chart && !isNullOrUndefined(i)) {
                    property = names[names.length - 1];
                    var series = chart.series().get(i);
                    var trendlineIndex = parseInt(self._selectedItem.substr("trendline ".length));
                    var trendline = series.trendlines[trendlineIndex];
                    if (property === 'color') {
                        trendline.style.color = value;
                    } else if (property === 'transparency') {
                        trendline.style.transparency = value;
                    } else if (property === 'width') {
                        trendline.style.width = value;
                    } else if (property === 'dashStyle') {
                        trendline.style.dashStyle = value;
                    } else {
                        trendline[property] = value;
                    }
                    var isCustomName = chart.series().GetTrendlineNameIsCustomOrNotInternal(i, trendlineIndex);
                    if (!isCustomName && property !== 'name') {
                        trendline.name = null;
                    }

                    designer.actions.doAction("updateChartSeries", spread, {
                        chart: chart, element: {
                            index: i,
                            value: series
                        }
                    });
                    newData = chart.series().get(i).trendlines[trendlineIndex];
                    if (property === 'color') {
                        value = newData.style.color;
                    } else if (property === 'borderWidth') {
                        value = newData.style.color;
                    } else if (property === 'transparency') {
                        value = newData.style.transparency;
                    } else if (property === 'width') {
                        value = newData.style.width;
                    } else if (property === 'dashStyle') {
                        value = newData.style.dashStyle;
                    } else {
                        value = newData; // return the whole trendline object.
                    }
                    result = value;
                }
                return result;
            case "errorBar":
                i = self._selectedSeries;
                if (chart && !isNullOrUndefined(i)) {
                    property = names[names.length - 1];
                    option = chart.series().get(i);
                    var direction = null;
                    if (self._selectedItem === "errorBarX") {
                        direction = "horizontal";
                    } else if (self._selectedItem === "errorBarY") {
                        direction = "vertical";
                    } else {
                        return;
                    }
                    var chartType = chartHelper.getChartGroupString(chart.chartType());
                    if (chartType === "BarGroup" && direction === "vertical") {
                        direction = "horizontal";
                    }
                    var errorBar = null;
                    errorBar = option.errorBars[direction];
                    if (property === 'color') {
                        errorBar.style.color = value;
                    } else if (property === 'transparency') {
                        errorBar.style.transparency = value;
                    } else if (property === 'width') {
                        errorBar.style.width = value;
                    } else if (property === 'dashStyle') {
                        errorBar.style.dashStyle = value;
                    } else if (property === 'markerBorderLineType') {
                        option.symbol = option.symbol || {};
                        option.symbol.border = option.symbol.border || {};
                        option.symbol.border.lineType = value;
                    } else if (property === "both") {
                        errorBar.type = 0;
                    } else if (property === "minus") {
                        errorBar.type = 1;
                    } else if (property === "plus") {
                        errorBar.type = 2;
                    } else if (property === "cap") {
                        errorBar.noEndCap = false;
                    } else if (property === "no cap") {
                        errorBar.noEndCap = true;
                    } else if (property === "Fixed value") {
                        errorBar.valueType = 1;
                        errorBar.value = value;
                    } else if (property === "Percentage") {
                        errorBar.valueType = 2;
                        errorBar.value = value;
                    } else if (property === "Standard deviations") {
                        errorBar.valueType = 3;
                        errorBar.value = value;
                    } else if (property === "Standard error") {
                        errorBar.valueType = 4;
                    } else if (property === "Custom") {
                        errorBar.valueType = 0;
                    } else if (property === "fixedvalueinput" || property === "standardEInput" || property === "percentageinput") {
                        errorBar.value = value;
                    } else if (property === "Specify Value" && errorBar.valueType === 0) {
                        if (!chartErrorBarDialog) {
                            chartErrorBarDialog = new designer.chartErrorBar(errorBar, direction, i, chart.series(), chart, option);
                        }
                        chartErrorBarDialog.setErrorBar(errorBar);
                        chartErrorBarDialog.open();
                    }
                    if (value !== designer.res.chartSliderPanel.automatic) {
                        option.isFillSetting = isFillSetting;
                        designer.actions.doAction("updateChartSeries", spread, {
                            chart: chart, element: {
                                index: i,
                                value: option
                            }
                        });
                    }
                    newData = chart.series().get(i).errorBars[direction];
                    names1 = namePath.split('.');
                    for (j = 0; j < names1.length; j++) {
                        data = data[names1[j]];
                    }
                    names2 = dataPath;
                    for (j = 0; j < names2.length;) {
                        data = data[names2[j]][names2[j + 1]];
                        j += 2;
                    }
                    for (j = 0; j < names.length - 1; j++) {
                        data = data[names[j]];
                    }
                    if (property === 'color') {
                        value = newData.style.color;
                    } else if (property === 'borderWidth') {
                        value = newData.style.color;
                    } else if (property === 'transparency') {
                        value = newData.style.transparency;
                    } else if (property === 'width') {
                        value = newData.style.width;
                    } else if (property === 'dashStyle') {
                        value = newData.style.dashStyle;
                    } else if (property === "Custom") {
                        value = newData[property];
                        chartErrorBarDialog && chartErrorBarDialog.setErrorBar(newData.custom);
                    } else {
                        value = newData[property];
                    }
                    result = data[property] = value;
                }
                return result;
            case "axis":
                if (chart) {
                    property = names[names.length - 1];
                    var axesType = tempSelectedForAxis || (selectedElement && self._selectedItem);
                    var optionBak = option = chart.axes()[axesType];
                    if (this._selectedItem === 'primaryValueUnitsLabel' || this._selectedItem === 'secondaryValueUnitsLabel') {
                        option = option.displayUnit;
                    }
                    if (property === 'fontSize') {
                        option.style.fontSize = value;
                    } else if (property === 'fontFamily') {
                        option.style.fontFamily = value;
                    } else if (property === 'color') {
                        option.style.color = value;
                    } else if (property === 'transparency') {
                        option.style.transparency = value;
                    } else if (property === 'borderColor') {
                        option.lineStyle.color = value;
                    } else if (property === 'borderTransparency') {
                        option.lineStyle.transparency = value;
                    } else if (property === 'borderWidth') {
                        option.lineStyle.width = value;
                    } else if (property === 'colorTitle') {
                        option.title.color = value;
                    } else if (property === 'titleTransparency') {
                        option.title.transparency = value;
                    } else if (property === 'fontSizeTitle') {
                        option.title.fontSize = value;
                    } else if (property === 'fontFamilyTitle') {
                        option.title.fontFamily = value;
                    } else if (property === 'textTitle') {
                        option.title.text = value;
                    } else if (property === 'majorGridLineColor') {
                        option.majorGridLine.color = value;
                    } else if (property === 'minorGridLineColor') {
                        option.minorGridLine.color = value;
                    } else if (property === 'majorGridLineTransparency') {
                        option.majorGridLine.transparency = value;
                    } else if (property === 'minorGridLineTransparency') {
                        option.minorGridLine.transparency = value;
                    } else if (property === 'majorGridLineWidth') {
                        option.majorGridLine.width = value;
                    } else if (property === 'minorGridLineWidth') {
                        option.minorGridLine.width = value;
                    } else if (property === 'format') {
                        option.format = value;
                    } else if (property === 'logAxis') {
                        option.scaling = option.scaling || {};
                        option.scaling.logBase = value;
                    } else if (property === 'displayUnit') {
                        if (!option.displayUnit) {
                            option.displayUnit = {};
                        }
                        if (value === 'none') {
                            option.displayUnit = null;
                        } else {
                            option.displayUnit.unit = value;
                        }
                    } else if (property === 'displayUnitVisible') {
                        if (!option.displayUnit) {
                            option.displayUnit = {};
                        }
                        option.displayUnit.visible = value;
                    } else {
                        if (option.categoryType === 2 && (property === 'max' || property === 'min')) {
                            if (value === null || value === keyword_undefined) {
                                value = (value && new Date(value).getTime());
                            } else {
                                value = (value && new Date(value).getTime()) || (option[property] && new Date(option[property]).getTime());
                            }
                        } else if (!option.categoryType || (option.categoryType === 3 && (property === 'max' || property === 'min'))) {
                            value = value && Number(value);
                        }
                        option[property] = value;
                    }
                    var obj = {};
                    obj[axesType] = optionBak;
                    designer.actions.doAction("changeChartFormatProperty", spread, {
                        chart: chart,
                        element: { axes: obj }
                    });
                    newData = chart.axes()[tempSelectedForAxis || (selectedElement && self._selectedItem)];
                    if (this._selectedItem === 'primaryValueUnitsLabel' || this._selectedItem === 'secondaryValueUnitsLabel') {
                        newData = newData.displayUnit;
                    }
                    names1 = namePath.split('.');
                    for (j = 0; j < names1.length; j++) {
                        data = data[names1[j]];
                    }
                    names2 = dataPath;
                    for (j = 0; j < names2.length;) {
                        data = data[names2[j]][names2[j + 1]];
                        j += 2;
                    }
                    for (j = 0; j < names.length - 1; j++) {
                        data = data[names[j]];
                    }
                    if (property === 'fontSize') {
                        value = newData.style.fontSize;
                    } else if (property === 'fontFamily') {
                        value = newData.style.fontFamily;
                    } else if (property === 'color') {
                        value = newData.style.color;
                    } else if (property === 'transparency') {
                        value = newData.style.transparency;
                    } else if (property === 'borderColor') {
                        value = newData.lineStyle.color;
                    } else if (property === 'borderTransparency') {
                        value = newData.lineStyle.transparency;
                    } else if (property === 'borderWidth') {
                        value = newData.lineStyle.width;
                    } else if (property === 'colorTitle') {
                        value = newData.title.color;
                    } else if (property === 'titleTransparency') {
                        value = newData.title.transparency;
                    } else if (property === 'fontSizeTitle') {
                        value = newData.title.fontSize;
                    } else if (property === 'fontFamilyTitle') {
                        value = newData.title.fontFamily;
                    } else if (property === 'textTitle') {
                        value = newData.title.text;
                    } else if (property === 'majorGridLineColor') {
                        value = newData.majorGridLine.color;
                    } else if (property === 'minorGridLineColor') {
                        value = newData.minorGridLine.color;
                    } else if (property === 'majorGridLineTransparency') {
                        value = newData.majorGridLine.transparency;
                    } else if (property === 'minorGridLineTransparency') {
                        value = newData.minorGridLine.transparency;
                    } else if (property === 'majorGridLineWidth') {
                        value = newData.majorGridLine.width;
                    } else if (property === 'minorGridLineWidth') {
                        value = newData.minorGridLine.width;
                    } else if (property === 'categoryType') {
                        value = {
                            categoryType: newData.categoryType,
                            minValue: newData.minValue,
                            maxValue: newData.maxValue
                        };
                    } else if (property === 'displayUnit' || property === 'displayUnitVisible') {
                        value = newData.displayUnit;
                        SlidePanel.refreshSliderPanelSelectedItemsPopup(chart);
                    } else {
                        if (option.categoryType === 2 && (property === 'max' || property === 'min')) {
                            value = newData[property] && newData[property].toLocaleDateString();
                        } else {
                            value = newData[property];
                        }
                    }
                    result = data[property] = value;
                }
                return result;
            case "legend":
                if (chart) {
                    option = chart.legend();
                    property = names[names.length - 1];
                    if (property === 'borderColor') {
                        option.borderStyle.color = value;
                    } else if (property === 'borderWidth') {
                        option.borderStyle.width = value;
                    } else if (property === 'borderTransparency') {
                        option.borderStyle.transparency = value;
                    } else if (property === 'backColor') {
                        option[property] = value;
                    } else if (property === 'backColorTransparency') {
                        option[property] = value;
                    } else if (property === 'color') {
                        option[property] = value;
                    } else if (property === 'fontSize') {
                        option[property] = value;
                    } else if (property === 'fontFamily') {
                        option[property] = value;
                    } else if (property === 'transparency') {
                        option[property] = value;
                    } else {//change legendPosition
                        var legendPositionMap = {};
                        legendPositionMap[designer.res.chartSliderPanel.top.toLocaleLowerCase()] = 1;
                        legendPositionMap[designer.res.chartSliderPanel.right.toLocaleLowerCase()] = 2;
                        legendPositionMap[designer.res.chartSliderPanel.left.toLocaleLowerCase()] = 3;
                        legendPositionMap[designer.res.chartSliderPanel.bottom.toLocaleLowerCase()] = 4;
                        legendPositionMap[designer.res.chartSliderPanel.topRight.toLocaleLowerCase()] = 5;
                        option[property] = legendPositionMap[value];
                    }
                    designer.actions.doAction("changeChartFormatProperty", spread, {
                        chart: chart,
                        element: { legend: option }
                    });
                    newData = chart.legend();
                    if (property === 'borderColor') {
                        value = newData.borderStyle.color;
                    } else if (property === 'borderWidth') {
                        value = newData.borderStyle.width;
                    } else if (property === 'borderTransparency') {
                        value = newData.borderStyle.transparency;
                    } else if (property === 'transparency') {
                        value = 0;
                    } else {
                        value = newData[property];
                    }
                    names1 = namePath.split('.');
                    for (j = 0; j < names1.length; j++) {
                        data = data[names1[j]];
                    }
                    names2 = dataPath;
                    for (j = 0; j < names2.length;) {
                        data = data[names2[j]][names2[j + 1]];
                        j += 2;
                    }
                    for (j = 0; j < names.length - 1; j++) {
                        data = data[names[j]];
                    }
                    result = data[property] = value;
                }
                return result;
            case "dataLabels":
                if (chart) {
                    property = names[names.length - 1];
                    option = chart.dataLabels();
                    option[property] = value;
                    designer.actions.doAction("changeChartFormatProperty", spread, {
                        chart: chart,
                        element: { dataLabels: option }
                    });
                    newData = chart.dataLabels();
                    value = newData[property];
                    names1 = namePath.split('.');
                    for (j = 0; j < names1.length; j++) {
                        data = data[names1[j]];
                    }
                    names2 = dataPath;
                    for (j = 0; j < names2.length;) {
                        data = data[names2[j]][names2[j + 1]];
                        j += 2;
                    }
                    for (j = 0; j < names.length - 1; j++) {
                        data = data[names[j]];
                    }
                    result = data[property] = value;
                }
                return result;
            case "chartTitle":
                if (chart) {
                    property = names[names.length - 1];
                    option = chart.title();
                    if (!option) {
                        option = { text: '' };
                    }
                    option[property] = value;
                    designer.actions.doAction("changeChartFormatProperty", spread, {
                        chart: chart,
                        element: { title: option }
                    });
                    newData = chart.title();
                    if (!newData) {
                        newData = { text: '' };
                    }
                    value = newData[property];
                    names1 = namePath.split('.');
                    for (j = 0; j < names1.length; j++) {
                        data = data[names1[j]];
                    }
                    names2 = dataPath;
                    for (j = 0; j < names2.length;) {
                        data = data[names2[j]][names2[j + 1]];
                        j += 2;
                    }
                    for (j = 0; j < names.length - 1; j++) {
                        data = data[names[j]];
                    }
                    result = data[property] = value;
                }
                return result;
            case "plotArea":
                break;
            case "chartArea":
                if (chart) {
                    if (namePath === 'sizeAndProperties') {
                        option = {
                            name: [chart.name()],
                            x: 0,
                            y: 0,
                            width: 0,
                            height: 0
                        };
                        property = names[names.length - 1];
                        option[property] = property === 'width' ? Number(value) - chart.width() : Number(value) - chart.height();
                        designer.actions.doAction("updateChartSize", spread, option);
                        var newOption = {
                            name: [chart.name()],
                            x: chart.x(),
                            y: chart.y(),
                            width: chart.width(),
                            height: chart.height()
                        };
                        value = newOption[property];
                    } else {
                        property = names[names.length - 1];
                        option = {};
                        if (property === "borderColor") {
                            option = {
                                border: {
                                    color: value
                                }
                            }
                        } else if (property === "borderTransparency") {
                            option = {
                                border: {
                                    transparency: value
                                }
                            }
                        } else if (property === "borderWidth") {
                            option = {
                                border: {
                                    width: value
                                }
                            }
                        } else if (property === "borderDashStyle") {
                            option = {
                                border: {
                                    dashStyle: value
                                }
                            }
                        }
                        option[property] = value;
                        designer.actions.doAction("changeChartFormatProperty", spread, {
                            chart: chart,
                            element: { chartArea: option }
                        });
                        newData = chart.chartArea();
                        if (property === "borderColor") {
                            value = newData["border"]["color"];
                        }
                        if (property === "backColor") {
                            value = newData["backColor"];
                        }
                        if (property === 'color') {
                            for (loop in datas) {
                                if (datas[loop]['textFill']) {
                                    datas[loop]['textFill']['content'][0]['Text'][0]['data']['color'] = value;
                                }
                            }
                        }
                    }
                    names1 = namePath.split('.');
                    for (j = 0; j < names1.length; j++) {
                        data = data[names1[j]];
                    }
                    names2 = dataPath;
                    for (j = 0; j < names2.length;) {
                        data = data[names2[j]][names2[j + 1]];
                        j += 2;
                    }
                    for (j = 0; j < names.length - 1; j++) {
                        data = data[names[j]];
                    }
                    result = data[property] = value;
                }
                return result;
            default:
                return null;
        }
    };
    SliderPanelDataManager.prototype.getDatas = function () {
        var self = this, datas = [];
        self.makeChartImp(self._chart, self._categories, self._dataPointIndex);
        var selectedData = self.getSelectedData();
        this.syncSelectedElement();

        for (var i in selectedData) { /* NOSONAR: Forin*/
            if (i !== "errorBar" && i !== "trendline" && selectedData[i] instanceof Object) {
                var data = { name: selectedData[i].type, properties: [] };
                for (var j in selectedData[i]) {
                    if (j !== 'type') {
                        selectedData[i][j].forEach(function (elementData) {
                            var property = {};
                            for (var k in elementData) {
                                property['aggregate'] = k;
                                var editors = property['editors'] = [];
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
        }

        return datas;
    };
    SliderPanelDataManager.prototype.getSelectedData = function () {
        var self = this;
        var item = this._selectedItem || this._selectedElement;
        if (item === "series") {
            return self._data["series"][self._selectedSeries];
        } else if (item === "errorBarX") {
            var chartType = chartHelper.getChartGroupString(self._chart.chartType());
            if (chartType === "BarGroup") {
                return self._data["series"][self._selectedSeries].errorBar.Y;
            }
            return self._data["series"][self._selectedSeries].errorBar.X;
        } else if (item === "errorBarY") {
            return self._data["series"][self._selectedSeries].errorBar.Y;
        } else if (util.StringHelper_startsWith(item, "trendline ")) {
            var index = parseInt(item.substr("trendline ".length));
            return self._data["series"][self._selectedSeries].trendline[index];
        }
        return self._data[item];
    };
    SliderPanelDataManager.prototype.getElements = function () {
        var data = this._data;
        var selectedItem = this._selectedItem;
        var selectedElement = this._selectedElement;
        var element = designer.res.chart.selectedOption[selectedElement] || designer.res.chart.selectedOption[selectedItem];
        var selectedCollection = { currentElement: { element: element, item: selectedItem || selectedElement, seriesIndex: this._selectedSeries } };
        selectedCollection.elements = [];
        for (var i in data) {
            if (i === "series") {
                for (var j = 0; j < data[i].length; j++) {
                    var series = data[i][j];

                    selectedCollection.elements.push({
                        element: designer.res.chart.selectedOption.series,
                        text: designer.res.chart.selectedText.series + ' "' + series.name + '"',
                        item: "series",
                        seriesIndex: series.index
                    });
                    var errorBars = series.errorBar;
                    if (errorBars && errorBars["X"]) {
                        var errorBar = errorBars["X"];
                        selectedCollection.elements.push({
                            element: designer.res.chart.selectedOption.errorBar,
                            text: designer.res.chart.selectedText.series + ' "' + errorBar.name + '" X ' + designer.res.chart.selectedText.errorBar,
                            item: "errorBarX",
                            seriesIndex: errorBar.index
                        });
                    }
                    if (errorBars && errorBars["Y"]) {
                        errorBar = errorBars["Y"];
                        selectedCollection.elements.push({
                            element: designer.res.chart.selectedOption.errorBar,
                            text: designer.res.chart.selectedText.series + ' "' + errorBar.name + '" Y ' + designer.res.chart.selectedText.errorBar,
                            item: "errorBarY",
                            seriesIndex: errorBar.index
                        });
                    }
                    var trendlines = series.trendline;
                    if (trendlines) {
                        for (var k = 0; k < trendlines.length; k++) {
                            var trendline = trendlines[k];
                            selectedCollection.elements.push({
                                element: designer.res.chart.selectedOption.trendline,
                                text: designer.res.chart.selectedText.series + ' "' + trendline.name + '" ' + designer.res.chart.selectedText.trendline + ' ' + (k + 1),
                                item: "trendline " + k,
                                seriesIndex: trendline.index
                            });
                        }
                    }
                }
            } else {
                var text = designer.res.chart.selectedText[i];
                if (chartHelper.isBarGroup(this._chart)) {
                    text = designer.res.chart.selectedBarChartText[i] || text;
                }
                if (chartHelper.isRadarGroup(this._chart)) {
                    text = designer.res.chart.selectedRadarChartText[i] || text;
                }
                selectedCollection.elements.push({
                    element: designer.res.chart.selectedOption[i],
                    text: text,
                    item: i
                });
            }
        }
        return selectedCollection;
    };
    SliderPanelDataManager.prototype.syncSelectedElement = function () {
        this._tempSelectedForAxis = void 0;
        if (this._selectedItem === 'errorBarX' || this._selectedItem === 'errorBarY') {
            this._selectedElement = 'errorBar';
        } else if (util.StringHelper_startsWith(this._selectedItem, "trendline ")) {
            this._selectedElement = 'trendline';
        } else if (this._selectedItem === 'primaryCategory' || this._selectedItem === 'primaryValue' || this._selectedItem === 'secondaryCategory' || this._selectedItem === 'secondaryValue') {
            this._selectedElement = 'axis';
        } else if (this._selectedItem === 'primaryCategoryTitle' || this._selectedItem === 'primaryCategoryMajorGridLine' || this._selectedItem === 'primaryCategoryMinorGridLine') {
            this._selectedElement = 'axis';
            this._tempSelectedForAxis = 'primaryCategory';
        } else if (this._selectedItem === 'secondaryCategoryTitle' || this._selectedItem === 'secondaryCategoryMajorGridLine' || this._selectedItem === 'secondaryCategoryMinorGridLine') {
            this._selectedElement = 'axis';
            this._tempSelectedForAxis = 'secondaryCategory';
        } else if (this._selectedItem === 'secondaryValueTitle' || this._selectedItem === 'secondaryValueUnitsLabel' || this._selectedItem === 'secondaryValueMajorGridLine' || this._selectedItem === 'secondaryValueMinorGridLine') {
            this._selectedElement = 'axis';
            this._tempSelectedForAxis = 'secondaryValue';
        } else if (this._selectedItem === 'primaryValueTitle' || this._selectedItem === 'primaryValueUnitsLabel' || this._selectedItem === 'primaryValueMajorGridLine' || this._selectedItem === 'primaryValueMinorGridLine') {
            this._selectedElement = 'axis';
            this._tempSelectedForAxis = 'primaryValue';
        } else {
            this._selectedElement = this._selectedItem;
        }
    };
    SliderPanelDataManager.prototype.makeChartData = function (chart) {
        var self = this, categories = self._categories,
            selectedElement = { selectedItem: self._selectedItem, chartElement: self._selectedElement };
        var chartDataObject = {
            chart: chart,
            selectedElement: selectedElement,
            data: null,
            categories: categories
        };

        self.makeChartImp(chart, categories, self._dataPointIndex);
        chartDataObject.data = self._data;
        chartDataObject = self.updateSelectedElement(chartDataObject);
        self._selectedElement = chartDataObject.selectedElement.chartElement;
        self._selectedItem = chartDataObject.selectedElement.selectedItem;
    };
    SliderPanelDataManager.prototype.makeChartImp = function (chart, categories, dataPointIndex) {
        var data = {}, legend, dataLabels, chartTitle, chartArea, dataPoints;
        getSeriesData(chart, data, categories);
        getErrorBarData(chart, data, categories);
        getTrendlineData(chart, data, categories);
        // getPlotAreaData(chart, chartDataObject.data);
        legend = getLegendData(chart);
        if (!isNullOrUndefined(legend) && !_isEmptyObject(legend)) {
            data['legend'] = legend;
        }
        dataPoints = getDataPoints(chart, dataPointIndex);
        if (!isNullOrUndefined(dataPoints) && !_isEmptyObject(dataPoints)) {
            data['dataPoints'] = dataPoints;
        }
        dataLabels = getLabelData(chart);
        if (!isNullOrUndefined(dataLabels) && !_isEmptyObject(dataLabels)) {
            data['dataLabels'] = dataLabels;
        }
        chartTitle = getChartTitleData(chart);
        if (!isNullOrUndefined(chartTitle) && !_isEmptyObject(chartTitle)) {
            data['chartTitle'] = chartTitle;
        }
        chartArea = getChartAreaData(chart);
        if (!isNullOrUndefined(chartArea) && !_isEmptyObject(chartArea)) {
            data['chartArea'] = chartArea;
        }
        getAxisData(chart, data);
        this._data = data;
    };
    SliderPanelDataManager.prototype.updateSelectedElement = function (chartData) {
        for (var i in chartData.data) {
            if (i.toString() === chartData.selectedElement.selectedItem) {
                return chartData;
            }
        }
        var seriesCollection = chartData.data.series;
        for (var j = 0; j < seriesCollection.length; j++) {
            for (var k in seriesCollection[j]) {
                if (k.toString() === chartData.selectedElement.chartElement) { // chartElement is used to check the "errorBar" "trendline"
                    return chartData;
                }
            }
        }
        chartData.selectedElement.selectedItem = 'chartArea';
        chartData.selectedElement.chartElement = 'chartArea'; // if seletectedItem exist, it's is display, if not, will select ''
        return chartData;
    };

    //#endregion sliderPanel DataManager

    var SlidePanel = {
        sliderPanelDataManager: {},
        initChartSliderPanel: function (chart, chartElement, selectedItem, selectedSeriesIndex, category, dataPointIndex) {
            var sliderPanel = $(".slider-panel");
            SlidePanel.sliderPanelDataManager = new SliderPanelDataManager(chart, chartElement, selectedItem, selectedSeriesIndex, category || chartHelper.getChartSeriesNames(chart), dataPointIndex);
            if (SlidePanel.slidePanel && SlidePanel.slidePanel.destroy) {
                SlidePanel.slidePanel.destroy();
            }
            function updateCallBack() {
                SlidePanel.slidePanel = updateSliderPanelUI(sliderPanel, SlidePanel.sliderPanelDataManager, updateCallBack);
            }
            SlidePanel.slidePanel = updateSliderPanelUI(sliderPanel, SlidePanel.sliderPanelDataManager, updateCallBack);
            sliderPanel.sliderpanel("open", "panel2");
        },
        refreshSliderPanel: function (chart) {
            var sliderPanelDataManager = SlidePanel.sliderPanelDataManager;
            var sliderPanel = $(".slider-panel");
            if (_isEmptyObject(sliderPanelDataManager) || !(sliderPanel.is(':visible'))) {
                return;
            }
            sliderPanelDataManager.makeChartData(chart);
            if (SlidePanel.slidePanel && SlidePanel.slidePanel.destroy) {
                SlidePanel.slidePanel.destroy();
            }
            function updateCallBack() {
                SlidePanel.slidePanel = updateSliderPanelUI(sliderPanel, SlidePanel.sliderPanelDataManager, updateCallBack);
            }
            SlidePanel.slidePanel = updateSliderPanelUI(sliderPanel, sliderPanelDataManager, updateCallBack);
        },
        refreshSliderPanelSelectedItemsPopup: function (chart) {
            setTimeout(function () {
                var sliderPanelDataManager = SlidePanel.sliderPanelDataManager;
                sliderPanelDataManager.makeChartData(chart);
                SlidePanel.slidePanel.refreshSelectedChartElement();
            }, 0);
        }
    };
    designer.chartSliderPanel = SlidePanel;
})();
