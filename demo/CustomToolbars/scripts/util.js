function getThemeColorTint(color) {
    return color.split(' ')[2] || 0;
}

function generateNewThemeColor(color, tint) {
    var colorItem = color.split(' ');
    colorItem[2] = tint;
    return colorItem.join(' ');
}
var ChartHelper = {
    chartColors: {
        "colorful": {
            "name": 'Colorful', "colors": [
                {
                    tip: 'Blue, Orange, Gray, Gold, Blue, Green',
                    items: ['accent 1', 'accent 2', 'accent 3', 'accent 4', 'accent 5', 'accent 6']
                },
                {
                    tip: 'Blue, Orange, Gray, Gold, Blue, Green',
                    items: ['accent 1', 'accent 3', 'accent 5', 'accent 1 -40', 'accent 3 -40', 'accent 5 -40']
                },
                {
                    tip: 'Blue, Orange, Gray, Gold, Blue, Green',
                    items: ['accent 2', 'accent 4', 'accent 6', 'accent 2 -40', 'accent 4 -40', 'accent 6 -40']
                },
                {
                    tip: 'Blue, Orange, Gray, Gold, Blue, Green',
                    items: ['accent 6', 'accent 5', 'accent 4', 'accent 6 -40', 'accent 5 -40', 'accent 4 -40']
                }
            ]
        },
        "monochromatic": {
            "name": 'Monochromatic', "colors": [
                {
                    tip: 'Blue gradient, dark to light',
                    items: {startColor: 'accent 1 -50', stopColor: 'accent 1 50'}
                },
                {
                    tip: 'Orange gradient, dark to light',
                    items: {startColor: 'accent 2 -50', stopColor: 'accent 2 50'}
                },
                {
                    tip: 'Gray gradient, dark to light',
                    items: {startColor: 'accent 3 -50', stopColor: 'accent 3 50'}
                },
                {
                    tip: 'Gold gradient, dark to light',
                    items: {startColor: 'accent 4 -50', stopColor: 'accent 4 50'}
                },
                {
                    tip: 'Blue gradient, dark to light',
                    items: {startColor: 'accent 5 -50', stopColor: 'accent 5 50'}
                },
                {
                    tip: 'Green gradient, dark to light',
                    items: {startColor: 'accent 6 -50', stopColor: 'accent 6 50'}
                },
                {
                    tip: 'Dark Gray, Light Gray, Gray, Dark Gray, Light Gray, Gray',
                    items: ['text 1 11.5', 'text 1 45', 'text 1 25', 'text 1 1.5', 'text 1 70', 'text 1 40']
                },
                {
                    tip: 'Blue gradient, light to dark',
                    items: {startColor: 'accent 1 50', stopColor: 'accent 1 -50'}
                },
                {
                    tip: 'Orange gradient, light to dark',
                    items: {startColor: 'accent 2 50', stopColor: 'accent 2 -50'}
                },
                {
                    tip: 'Gray gradient, light to dark',
                    items: {startColor: 'accent 3 50', stopColor: 'accent 3 -50'}
                },
                {
                    tip: 'Gold gradient, light to dark',
                    items: {startColor: 'accent 4 50', stopColor: 'accent 4 -50'}
                },
                {
                    tip: 'Blue gradient, light to dark',
                    items: {startColor: 'accent 5 50', stopColor: 'accent 5 -50'}
                },
                {
                    tip: 'Green gradient, light to dark',
                    items: {startColor: 'accent 6 50', stopColor: 'accent 6 -50'}
                }
            ]
        }
    },
    chartTypeDict: {
        "0": {
            chartType: "combo",
            chartGroup: "ComboGroup"
        },
        "1": {
            chartType: "xyScatter",
            chartGroup: "ScatterGroup"
        },
        "2": {
            chartType: "radar",
            chartGroup: "RadarGroup"
        },
        "3": {
            chartType: "doughnut",
            chartGroup: "PieGroup"
        },
        "8": {
            chartType: "area",
            chartGroup: "AreaGroup"
        },
        "9": {
            chartType: "line",
            chartGroup: "LineGroup"
        },
        "10": {
            chartType: "pie",
            chartGroup: "PieGroup"
        },
        "11": {
            chartType: "bubble",
            chartGroup: "ScatterGroup"
        },
        "12": {
            chartType: "columnClustered",
            chartGroup: "ColumnGroup"
        },
        "13": {
            chartType: "columnStacked",
            chartGroup: "ColumnGroup"
        },
        "14": {
            chartType: "columnStacked100",
            chartGroup: "ColumnGroup"
        },
        "18": {
            chartType: "barClustered",
            chartGroup: "BarGroup"
        },
        "19": {
            chartType: "barStacked",
            chartGroup: "BarGroup"
        },
        "20": {
            chartType: "barStacked100",
            chartGroup: "BarGroup"
        },
        "24": {
            chartType: "lineStacked",
            chartGroup: "LineGroup"
        },
        "25": {
            chartType: "lineStacked100",
            chartGroup: "LineGroup"
        },
        "26": {
            chartType: "lineMarkers",
            chartGroup: "LineGroup"
        },
        "27": {
            chartType: "lineMarkersStacked",
            chartGroup: "LineGroup"
        },
        "28": {
            chartType: "lineMarkersStacked100",
            chartGroup: "LineGroup"
        },
        "33": {
            chartType: "xyScatterSmooth",
            chartGroup: "ScatterGroup"
        },
        "34": {
            chartType: "xyScatterSmoothNoMarkers",
            chartGroup: "ScatterGroup"
        },
        "35": {
            chartType: "xyScatterLines",
            chartGroup: "ScatterGroup"
        },
        "36": {
            chartType: "xyScatterLinesNoMarkers",
            chartGroup: "ScatterGroup"
        },
        "37": {
            chartType: "areaStacked",
            chartGroup: "AreaGroup"
        },
        "38": {
            chartType: "areaStacked100",
            chartGroup: "AreaGroup"
        },
        "42": {
            chartType: "radarMarkers",
            chartGroup: "RadarGroup"
        },
        "43": {
            chartType: "radarFilled",
            chartGroup: "RadarGroup"
        },
        "49": {
            chartType: "stockHLC",
            chartGroup: "StockGroup"
        },
        "50": {
            chartType: "stockOHLC",
            chartGroup: "StockGroup"
        },
        "51": {
            chartType: "stockVHLC",
            chartGroup: "StockGroup"
        },
        "52": {
            chartType: "stockVOHLC",
            chartGroup: "StockGroup"
        },
        "57": {
            chartType: "sunburst",
            chartGroup: "TreeGroup"
        },
        "58": {
            chartType: "treemap",
            chartGroup: "TreeGroup"
        }
    },
    getChartGroupString: function (typeValue) {
        var chartTypeInfo = this.chartTypeDict[typeValue];
        if (chartTypeInfo && chartTypeInfo.chartGroup) {
            return chartTypeInfo.chartGroup;
        }
    },
    getChartTypeString: function (typeValue) {
        var chartTypeInfo = this.chartTypeDict[typeValue];
        if (chartTypeInfo && chartTypeInfo.chartType) {
            return chartTypeInfo.chartType;
        }
    },
    getSelectedChart: function (sheet) {
        var chartCollection = sheet.charts;
        var allCharts = chartCollection.all();
        for (var i = 0; i < allCharts.length; i++) {
            var chart = allCharts[i];
            if (chart.isSelected()) {
                return chart;
            }
        }
    },
    getPieColorArray: function (colorString) {
        return colorString.match(/transparent|rgba\(\d+, *\d+, *\d+, *\d+\.?\d?\)|\w+ \d ?-?\d*/g);
    },
    generateColor: function (colors, colorCount, index) {
        var self = this;
        if (colors instanceof Array) {
            var totalColor = colors.length;
            if (index !== undefined) {
                return colors[index % totalColor];
            }
            var returnColors = [];
            for (var i = 0; i < colorCount; i++) {
                returnColors.push(colors[i % totalColor]);
            }
            return returnColors;
        } else if (colors instanceof Object) {
            return self.getGradientThemeColor(colors.startColor, colors.stopColor, colorCount, index);
        }
    },
    getGradientThemeColor: function (startColor, stopColor, count, index) {
        if (index === 0) {
            return startColor;
        }
        if (index === (count - 1)) {
            return stopColor;
        }
        var startValue = parseFloat(getThemeColorTint(startColor));
        var stopValue = parseFloat(getThemeColorTint(stopColor));
        var gap = (stopValue - startValue) / (count - 1);
        var colorTint = 0;
        if (index !== undefined) {
            colorTint = startValue + gap * index;
            return generateNewThemeColor(startColor, colorTint);
        }
        var colors = [];
        colors.push(startColor);
        for (index = 1; index < count - 1; index++) {
            colorTint = startValue + gap * index;
            colors.push(generateNewThemeColor(startColor, colorTint));
        }
        colors.push(stopColor);
        return colors;
    },
    applyChartSeriesTheme: function (chart, options) {
        var self = this;
        var group = options.group || 'colorful';
        var index = options.index || 0;
        var chartColors = ChartHelper.chartColors;
        var colors = chartColors[group].colors[index].items;
        var chartGroupString = this.getChartGroupString(chart.chartType())
        if(chartGroupString === "TreeGroup"){
            var dataPoints = chart.series().dataPoints();
            var pointArray = dataPoints.get();
            pointArray.forEach(function(point, index) {
                var color = self.generateColor(colors, pointArray.length, index);
                point.fillColor = color;
                dataPoints.set(index, point);
            });
        } else {
            var seriesCollection = chart.series();
            var allSeries = seriesCollection.get();
            var seriesItemCount = allSeries.length;
            for (var i = 0; i < seriesItemCount; i++) {
                var seriesItem = allSeries[i];
                var color;
                var ChartType = GC.Spread.Sheets.Charts.ChartType;
                if (chart.chartType() === ChartType.pie || chart.chartType() === ChartType.doughnut) {
                    var oldColors = self.getPieColorArray(seriesItem.backColor);
                    if (oldColors && oldColors.length > 0) {
                        var count = oldColors.length;
                        color = self.generateColor(colors, count).join(',');
                    }
                } else {
                    color = self.generateColor(colors, seriesItemCount, i);
                }
                if(!options.type) {
                    if (seriesItem.backColor) {
                        seriesItem.backColor = color;
                    }
                    if (seriesItem.border) {
                        seriesItem.border.color = color;
                    }
                } else if(options.type === 'backColor' && seriesItem.backColor) {
                    seriesItem.backColor = color;
                } else if(options.type === 'borderColor' && seriesItem.border) {
                    seriesItem.border.color = color;
                }
                seriesCollection.set(i, seriesItem);
            }
        }
    }
};

var ShapeHelper = {
    getSelectedShapes: function (sheet) {
        var shapes = sheet.shapes.all();
        var results = [];
        shapes.forEach(function(shape) {
            if(shape.isSelected()) {
                results.push(shape);
            }
        });
        return results;
    },
    getShapeType: function (shape) {
        var result = 'shape';
        if(shape instanceof GC.Spread.Sheets.Shapes.GroupShape) {
            result = 'shapeGroup';
        }
        if(shape instanceof GC.Spread.Sheets.Shapes.ConnectorShape) {
            result = 'connector';
        }

        return result;
    }
};
