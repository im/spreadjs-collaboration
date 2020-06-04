function AddChartElement(host) {

    this._host = host;
    this.container = document.createElement('div');
    this.container.className = 'add-chart-element-container';
    this._host.appendChild(this.container);
    this._itemObj = {
        axes: {
            title: uiResource.addChartElement.axes.axes,
            key: 'axes',
            subTitle: {
                axesPrimaryHorizontal: {
                    title: uiResource.addChartElement.primaryHorizontal,
                    key: 'axesPrimaryHorizontal'
                },
                axesPrimaryVertical: {
                    title: uiResource.addChartElement.primaryVertical,
                    key: 'axesPrimaryVertical'
                },
                axesSecondaryHorizontal: {
                    title: uiResource.addChartElement.secondaryHorizontal,
                    key: 'axesSecondaryHorizontal'
                },
                axesSecondaryVertical: {
                    title: uiResource.addChartElement.secondaryVertical,
                    key: 'axesSecondaryVertical'
                }
            },
            openPanel: {
                title: uiResource.addChartElement.axes.moreAxisOption,
                key: 'AxesOpenPanel'
            }
        }
        ,
        axisTitles: {
            title: uiResource.addChartElement.axisTitles.axisTitles,
            key: 'axisTitles',
            subTitle: {
                axesTitlesPrimaryHorizontal: {
                    title: uiResource.addChartElement.primaryHorizontal,
                    key: 'axesTitlesPrimaryHorizontal'
                },
                axesTitlesPrimaryVertical: {
                    title: uiResource.addChartElement.primaryVertical,
                    key: 'axesTitlesPrimaryVertical'
                },
                axesTitlesSecondaryHorizontal: {
                    title: uiResource.addChartElement.secondaryHorizontal,
                    key: 'axesTitlesSecondaryHorizontal'
                },
                axesTitlesSecondaryVertical: {
                    title: uiResource.addChartElement.secondaryVertical,
                    key: 'axesTitlesSecondaryVertical'
                }
            },
            openPanel: {
                title: uiResource.addChartElement.axisTitles.moreAxisTitlesOption,
                key: 'axisTitlesOpenPanel'
            }
        }
        ,
        chartTitle: {
            title: uiResource.addChartElement.chartTitle.chartTitle,
            key: 'chartTitle',
            subTitle: {
                chartTitleNone: {title: uiResource.addChartElement.none, key: 'chartTitleNone'},
                chartTitleAboveChart: {title: uiResource.addChartElement.aboveChart, key: 'chartTitleAboveChart'}
            },
            openPanel: {
                title: uiResource.addChartElement.chartTitle.moreChartTitleOption,
                key: 'chartTitleOpenPanel'
            }
        }
        ,
        gridLines: {
            title: uiResource.addChartElement.gridLines.gridLines,
            key: 'gridLines',
            subTitle: {
                gridLinesPrimaryMajorHorizontal: {
                    title: uiResource.addChartElement.primaryMajorHorizontal,
                    key: 'gridLinesPrimaryMajorHorizontal'
                },
                gridLinesPrimaryMajorVertical: {
                    title: uiResource.addChartElement.primaryMajorVertical,
                    key: 'gridLinesPrimaryMajorVertical'
                },
                gridLinesPrimaryMinorHorizontal: {
                    title: uiResource.addChartElement.primaryMinorHorizontal,
                    key: 'gridLinesPrimaryMinorHorizontal'
                },
                gridLinesPrimaryMinorVertical: {
                    title: uiResource.addChartElement.primaryMinorVertical,
                    key: 'gridLinesPrimaryMinorVertical'
                },
                gridLinesSecondaryMajorHorizontal: {
                    title: uiResource.addChartElement.secondaryMajorHorizontal,
                    key: 'gridLinesSecondaryMajorHorizontal'
                },
                gridLinesSecondaryMajorVertical: {
                    title: uiResource.addChartElement.secondaryMajorVertical,
                    key: 'gridLinesSecondaryMajorVertical'
                },
                gridLinesSecondaryMinorHorizontal: {
                    title: uiResource.addChartElement.secondaryMinorHorizontal,
                    key: 'gridLinesSecondaryMinorHorizontal'
                },
                gridLinesSecondaryMinorVertical: {
                    title: uiResource.addChartElement.secondaryMinorVertical,
                    key: 'gridLinesSecondaryMinorVertical'
                }
            },
            openPanel: {
                title: uiResource.addChartElement.gridLines.moreGridLinesOption,
                key: 'gridLinesOpenPanel'
            }
        }
        ,
        dataLabels: {
            title: uiResource.addChartElement.dataLabels.dataLabels,
            key: 'dataLabels',
            subTitle: {
                dataLabelsNone: {title: uiResource.addChartElement.none, key: 'dataLabelsNone'},
                dataLabelsCenter: {title: uiResource.addChartElement.center, key: 'dataLabelsCenter'},
                dataLabelsInsideEnd: {title: uiResource.addChartElement.insideEnd, key: 'dataLabelsInsideEnd'},
                dataLabelsOutsideEnd: {title: uiResource.addChartElement.outsideEnd, key: 'dataLabelsOutsideEnd'},
                dataLabelsBestFit: {title: uiResource.addChartElement.bestFit, key: 'dataLabelsBestFit'},
                dataLabelsAbove: {title: uiResource.addChartElement.above, key: 'dataLabelsAbove'},
                dataLabelsBelow: {title: uiResource.addChartElement.below, key: 'dataLabelsBelow'},
                dataLabelsShow: {title: uiResource.addChartElement.show, key: 'dataLabelsShow'}
            },
            openPanel: {
                title: uiResource.addChartElement.dataLabels.moreDataLabelsOption,
                key: 'dataLabelsOpenPanel'
            }
        }
        ,
        legend: {
            title: uiResource.addChartElement.legend.legend,
            key: 'legend',
            subTitle: {
                legendNone: {title: uiResource.addChartElement.none, key: 'legendNone'},
                legendRight: {title: uiResource.addChartElement.right, key: 'legendRight'},
                legendTop: {title: uiResource.addChartElement.top, key: 'legendTop'},
                legendLeft: {title: uiResource.addChartElement.left, key: 'legendLeft'},
                legendBottom: {title: uiResource.addChartElement.bottom, key: 'legendBottom'}
            },
            openPanel: {
                title: uiResource.addChartElement.legend.moreLegendOption,
                key: 'legendOpenPanel'
            }
        }
    };
    this._chartGroupItemObj = {
        ColumnGroup: {
            dataLabels: {
                needShow: true,
                subTitle: {
                    dataLabelsBestFit: {needShow: false},
                    dataLabelsAbove: {needShow: false},
                    dataLabelsBelow: {needShow: false},
                    dataLabelsShow: {needShow: false}
                }
            }
        },
        LineGroup: {
            dataLabels: {
                needShow: true,
                subTitle: {
                    dataLabelsInsideEnd: {needShow: false},
                    dataLabelsOutsideEnd: {needShow: false},
                    dataLabelsBestFit: {needShow: false},
                    dataLabelsShow: {needShow: false}
                }
            }
        },
        PieGroup: {
            axes: {needShow: false},
            axisTitles: {needShow: false},
            dataLabels: {
                needShow: true,
                subTitle: {
                    dataLabelsAbove: {needShow: false},
                    dataLabelsBelow: {needShow: false},
                    dataLabelsShow: {needShow: false}
                }
            },
            gridLines: {needShow: false}
        },
        BarGroup: {
            dataLabels: {
                needShow: true,
                subTitle: {
                    dataLabelsBestFit: {needShow: false},
                    dataLabelsAbove: {needShow: false},
                    dataLabelsBelow: {needShow: false},
                    dataLabelsShow: {needShow: false}
                }
            }
        },
        AreaGroup: {
            dataLabels: {
                needShow: true,
                subTitle: {
                    dataLabelsCenter: {needShow: false},
                    dataLabelsInsideEnd: {needShow: false},
                    dataLabelsOutsideEnd: {needShow: false},
                    dataLabelsBestFit: {needShow: false},
                    dataLabelsAbove: {needShow: false},
                    dataLabelsBelow: {needShow: false}
                }
            }
        },
        ScatterGroup: {
            dataLabels: {
                needShow: true,
                subTitle: {
                    dataLabelsInsideEnd: {needShow: false},
                    dataLabelsOutsideEnd: {needShow: false},
                    dataLabelsBestFit: {needShow: false},
                    dataLabelsShow: {needShow: false}
                }
            }
        },
        StockGroup: {
            dataLabels: {
                needShow: true,
                subTitle: {
                    dataLabelsCenter: {needShow: false},
                    dataLabelsInsideEnd: {needShow: false},
                    dataLabelsOutsideEnd: {needShow: false},
                    dataLabelsBestFit: {needShow: false},
                    dataLabelsAbove: {needShow: false},
                    dataLabelsBelow: {needShow: false},
                    dataLabelsShow: {needShow: false}
                }
            }
        },
        ComboGroup: {},
        TreeGroup: {
            axes: {needShow: false},
            axisTitles: {needShow: false},
            dataLabels: {needShow: false},
            gridLines: {needShow: false},
            legend: {needShow: false}
        }

    };

}

AddChartElement.prototype._beforeShow = function (sheet) {
    this._activeChart = ChartHelper.getSelectedChart(sheet);
    this._chartGroupNameArray = this._getChartGroupName();
    this._subMenu = null;
    this._updateAllMenuItem();
    this._addEventListener();
};

AddChartElement.prototype._updateAllMenuItem = function () {
    this.container.innerHTML = '';
    for (var objKey in this._itemObj) {
        if (this._needShowMenuItemWithObjKey(objKey)) {
            this.container.appendChild(this._createMainItem(this._itemObj[objKey]));
        }
    }
};

AddChartElement.prototype._getChartGroupName = function () {
    var chartTypeNameArray = [];
    var chartType = ChartHelper.getChartGroupString(this._activeChart.chartType());
    if (chartType === 'ComboGroup') {
        var series = this._activeChart.series().get();
        //To prevent repetition, all chartTypeNames are stored in the obj
        var chartTypeNameObj = {};
        for (var i = 0; i < series.length; i++) {
            var seriesItem = series[i];
            var seriesChartType = ChartHelper.getChartGroupString(seriesItem.chartType);
            chartTypeNameObj[seriesChartType] = true;
        }
        //get chartTypeNames to array from obj
        for (var chartTypeName in chartTypeNameObj) {
            if (chartTypeNameObj.hasOwnProperty(chartTypeName)) {
                chartTypeNameArray.push(chartTypeName);
            }
        }
        return chartTypeNameArray;
    } else {
        chartTypeNameArray.push(chartType);
        return chartTypeNameArray;
    }
};

AddChartElement.prototype._createMainItem = function (obj) {
    var dom = document.createElement('div');
    var imgDomContainer = document.createElement('div');
    var imgDom = document.createElement('div');
    var textDom = document.createElement('div');
    var trangleDom = document.createElement('div');
    dom.dataset.seriesKey = obj.key;
    dom.className = 'add-chart-element-item';
    imgDomContainer.className = 'imgItemContainer';
    imgDom.className = 'imgItem';
    $(imgDom).addClass(obj.key);
    textDom.className = 'textItem';
    textDom.innerHTML = obj.title;
    trangleDom.className = 'trangleItem';
    imgDomContainer.appendChild(imgDom);
    dom.appendChild(imgDomContainer);
    dom.appendChild(textDom);
    dom.appendChild(trangleDom);
    return dom;
};

AddChartElement.prototype._createSubMenu = function (objKey, offsetTop) {
    var subMenuItem = document.getElementById('add-chart-element-submenu');
    $(subMenuItem).css({top: offsetTop + "px"});
    subMenuItem.innerHTML = '';
    var container = document.createElement('div');
    container.className = 'add-chart-element-container-subMenu';
    var subMenu = this._itemObj[objKey].subTitle;
    var parentKey = this._itemObj[objKey].key;
    for (var subMenuKey in subMenu) {
        //judge isNeedShow by chartGroupe
        if (this._needShowSubMenuItemWithObjKeyAndSubMenuKey(objKey, subMenuKey)) {
            var activeChartType = this._activeChart.chartType();
            var subMenuItemKey = subMenu[subMenuKey].key;
            var needShow = false;
            //When subMenuItemKey is Secondary, we need to decide whether or not to show this menuItem through whether the chart contains secondary series
            if (subMenuItemKey === 'gridLinesSecondaryMajorHorizontal' || subMenuItemKey === 'gridLinesSecondaryMajorVertical' ||
                subMenuItemKey === 'gridLinesSecondaryMinorHorizontal' || subMenuItemKey === 'gridLinesSecondaryMinorVertical' ||
                subMenuItemKey === 'axesSecondaryHorizontal' || subMenuItemKey === 'axesSecondaryVertical' ||
                subMenuItemKey === 'axesTitlesSecondaryHorizontal' || subMenuItemKey === 'axesTitlesSecondaryVertical') {
                var axes = this._activeChart.axes();
                if (axes.secondaryCategory && axes.secondaryValue && (activeChartType !== 0)) {
                    needShow = this._judgeMenuItemNeedChoose(parentKey, subMenuItemKey);
                    container.appendChild(this._createSubMenuItem(subMenu[subMenuKey].title, parentKey, subMenu[subMenuKey].key, needShow));
                }
            } else {

                var chartTypes = GC.Spread.Sheets.Charts.ChartType;
                var radarTypes = [chartTypes.radar, chartTypes.radarFilled, chartTypes.radarMarkers];
                var isRadarChart = radarTypes.indexOf(activeChartType) >= 0;
                var isComboChart = activeChartType === 0;
                var verticalLine = ['gridLinesPrimaryMajorVertical', 'gridLinesPrimaryMinorVertical'];
                var isVerticalLine = verticalLine.indexOf(subMenuItemKey) >= 0;
                if(!((isRadarChart || isComboChart) && isVerticalLine)) {
                    needShow = this._judgeMenuItemNeedChoose(parentKey, subMenuItemKey);
                    container.appendChild(this._createSubMenuItem(subMenu[subMenuKey].title, parentKey, subMenu[subMenuKey].key, needShow));
                }
            }
        }
    }
    subMenuItem.appendChild(container);
    this._subMenuAddEvenListener();
    return subMenuItem;
};

AddChartElement.prototype._createSubMenuItem = function (text, parentKey, selfKey, needChoose) {
    var chartType = this._activeChart.chartType();
    var dom = document.createElement('div');
    var imgDomContainer = document.createElement('div');
    var textDom = document.createElement('div');
    var imgDom = document.createElement('div');
    dom.className = 'add-chart-element-subItem';
    dom.dataset.parentKey = parentKey;
    dom.dataset.selfKey = selfKey;
    imgDomContainer.className = 'imgItemContainer';
    $(imgDomContainer).addClass(needChoose ? 'img-item-choosed' : 'img-item-no-choose');
    imgDom.className = 'imgItem';
    var className = selfKey;
    var chartGroupString = ChartHelper.getChartGroupString(chartType);
    if( parentKey === 'dataLabels' && chartType !== null && chartType !== undefined && (chartGroupString ==='ScatterGroup' || chartGroupString ==='LineGroup' || chartGroupString ==='PieGroup')){
        className = className + '-' + chartGroupString;
    }
    $(imgDom).addClass(className);
    textDom.className = 'textItem';
    textDom.innerHTML = text;
    imgDomContainer.appendChild(imgDom);
    dom.appendChild(imgDomContainer);
    dom.appendChild(textDom);
    return dom;
};

AddChartElement.prototype._judgeMenuItemNeedChoose = function (parentKey, selfKey) {
    var needChoose = false, self = this;
    switch (parentKey) {
        case 'axes':
            var axes = self._activeChart.axes();
            switch (selfKey) {
                case 'axesPrimaryHorizontal':
                    needChoose = axes.primaryCategory.visible;
                    break;
                case 'axesPrimaryVertical':
                    needChoose = axes.primaryValue.visible;
                    break;
                case 'axesSecondaryHorizontal':
                    needChoose = axes.secondaryCategory.visible;
                    break;
                case 'axesSecondaryVertical':
                    needChoose = axes.secondaryValue.visible;
                    break;
            }
            break;
        case 'axisTitles':
            var axisTitlesAxes = self._activeChart.axes();
            switch (selfKey) {
                case 'axesTitlesPrimaryHorizontal':
                    needChoose = axisTitlesAxes.primaryCategory.title.text !== '';
                    break;
                case 'axesTitlesPrimaryVertical':
                    needChoose = axisTitlesAxes.primaryValue.title.text !== '';
                    break;
                case 'axesTitlesSecondaryHorizontal':
                    needChoose = axisTitlesAxes.secondaryCategory.title.text !== '';
                    break;
                case 'axesTitlesSecondaryVertical':
                    needChoose = axisTitlesAxes.secondaryValue.title.text !== '';
                    break;
            }
            break;
        case 'chartTitle':
            var chartTitle = self._activeChart.title();
            switch (selfKey) {
                case 'chartTitleNone' :
                    if (chartTitle) {
                        needChoose = chartTitle.text === '';
                    } else {
                        needChoose = true;
                    }
                    break;
                case 'chartTitleAboveChart' :
                    if (chartTitle) {
                        needChoose = chartTitle.text !== '';
                    } else {
                        needChoose = false;
                    }
                    break;
            }
            break;
        case 'dataLabels':
            var dataLabels = self._activeChart.dataLabels();
            var dataLabelPosition = GC.Spread.Sheets.Charts.DataLabelPosition;
            //when dataLabels.showValue == false, then others is false;
            if (selfKey !== 'dataLabelsNone' && dataLabels.showValue === false) {
                needChoose = false;
                break;
            }
            switch (selfKey) {
                case 'dataLabelsNone':
                    needChoose = dataLabels.showValue === false;
                    break;
                case 'dataLabelsCenter':
                    needChoose = dataLabels.position === dataLabelPosition.center;
                    break;
                case 'dataLabelsInsideEnd':
                    needChoose = dataLabels.position === dataLabelPosition.insideEnd;
                    break;
                case 'dataLabelsOutsideEnd':
                    needChoose = dataLabels.position === dataLabelPosition.outsideEnd;
                    break;
                case 'dataLabelsBestFit':
                    needChoose = dataLabels.position === dataLabelPosition.bestFit;
                    break;
                case 'dataLabelsLeft':
                    needChoose = dataLabels.position === dataLabelPosition.left;
                    break;
                case 'dataLabelsRight':
                    needChoose = dataLabels.position === dataLabelPosition.right;
                    break;
                case 'dataLabelsAbove':
                    needChoose = dataLabels.position === dataLabelPosition.above;
                    break;
                case 'dataLabelsBelow':
                    needChoose = dataLabels.position === dataLabelPosition.below;
                    break;
                case 'dataLabelsShow':
                    needChoose = dataLabels.showValue === true;
                    break;
            }
            break;
        case 'gridLines':
            var gridLinesAxes = self._activeChart.axes();
            switch (selfKey) {
                case 'gridLinesPrimaryMajorHorizontal':
                    needChoose = gridLinesAxes.primaryValue.majorGridLine.visible === true;
                    break;
                case 'gridLinesPrimaryMajorVertical' :
                    needChoose = gridLinesAxes.primaryCategory.majorGridLine.visible === true;
                    break;
                case 'gridLinesPrimaryMinorHorizontal' :
                    needChoose = gridLinesAxes.primaryValue.minorGridLine.visible === true;
                    break;
                case 'gridLinesPrimaryMinorVertical' :
                    needChoose = gridLinesAxes.primaryCategory.minorGridLine.visible === true;
                    break;
                case 'gridLinesSecondaryMajorHorizontal':
                    needChoose = gridLinesAxes.secondaryValue.majorGridLine.visible === true;
                    break;
                case 'gridLinesSecondaryMajorVertical' :
                    needChoose = gridLinesAxes.secondaryCategory.majorGridLine.visible === true;
                    break;
                case 'gridLinesSecondaryMinorHorizontal' :
                    needChoose = gridLinesAxes.secondaryValue.minorGridLine.visible === true;
                    break;
                case 'gridLinesSecondaryMinorVertical' :
                    needChoose = gridLinesAxes.secondaryCategory.minorGridLine.visible === true;
                    break;
            }
            break;
        case 'legend':
            var legend = self._activeChart.legend();
            var legendPosition = GC.Spread.Sheets.Charts.LegendPosition;
            if (selfKey !== 'legendNone' && legend.visible === false) {
                needChoose = false;
                break;
            }
            switch (selfKey) {
                case 'legendNone':
                    needChoose = legend.visible === false;
                    break;
                case 'legendRight':
                    needChoose = legend.position === legendPosition.right;
                    break;
                case 'legendTop':
                    needChoose = legend.position === legendPosition.top;
                    break;
                case 'legendLeft':
                    needChoose = legend.position === legendPosition.left;
                    break;
                case 'legendBottom':
                    needChoose = legend.position === legendPosition.bottom;
                    break;
            }
            break;
        default:
            break;
    }

    return needChoose;
};

AddChartElement.prototype._changeItemActiveState = function (allItem, changeItem, className) {
    if (allItem) {
        allItem.removeClass(className);
    }
    if (changeItem) {
        changeItem.addClass(className);
    }
};

AddChartElement.prototype._beforeHide = function () {
    //cancel selected state
    var menuItem = $(this._host).find(".add-chart-element-item");
    this._changeItemActiveState(menuItem, null, 'add-chart-element-item-active');
    //cancel selected state
    var $subMenuItemAll = $(this._host).find(".add-chart-element-subItem");
    this._changeItemActiveState($subMenuItemAll, null, 'add-chart-element-subItem-active');

    if (this._subMenu) {
        this._subMenu.gcuipopup('hide');
    }
};

AddChartElement.prototype._showSubItem = function (e) {
    //change ui state
    var menuItem = $(this._host).find(".add-chart-element-item");
    this._changeItemActiveState(menuItem, $(e.currentTarget), 'add-chart-element-item-active');
    //show subitem
    var key = $(e.currentTarget).data('seriesKey');
    this._createSubMenu(key, e.currentTarget.offsetTop);
};

AddChartElement.prototype._addEventListener = function () {
    var self = this;
    var menuItem = $(this._host).find(".add-chart-element-item");
    menuItem.click(function (e) {
        self._showSubItem(e);
    });
    menuItem.mouseenter(function (e) {
        self._showSubItem(e);
    });
};

AddChartElement.prototype._closePopup = function () {

};

AddChartElement.prototype._subMenuAddEvenListener = function () {
    var $subMenuItemAll = $(this._host).find(".add-chart-element-subItem");
    var self = this;
    $subMenuItemAll.mouseenter(function (e) {
        self._changeItemActiveState($subMenuItemAll, $(e.currentTarget), 'add-chart-element-subItem-active');
    });
    $subMenuItemAll.click(function (e) {
        var parentKey = $(e.currentTarget).data('parentKey');
        var selfKey = $(e.currentTarget).data('selfKey');
        var type = $(e.currentTarget).data('type');
        // when subMenuItem is openPanelMenuItem ,then don't do anything, because openPanelMenuItem will do openPanel by themSelf;
        if (type === 'openPanelMenuItem') {
            return;
        }
        switch (parentKey) {
            case 'axes':
                var axes = self._activeChart.axes();
                switch (selfKey) {
                    case 'axesPrimaryHorizontal':
                        axes.primaryCategory.visible = !axes.primaryCategory.visible;
                        break;
                    case 'axesPrimaryVertical':
                        axes.primaryValue.visible = !axes.primaryValue.visible;
                        break;
                    case 'axesSecondaryHorizontal':
                        axes.secondaryCategory.visible = !axes.secondaryCategory.visible;
                        break;
                    case 'axesSecondaryVertical':
                        axes.secondaryValue.visible = !axes.secondaryValue.visible;
                        break;
                }
                app.doAction("changeChartElement", {axes: axes});
                break;
            case 'axisTitles':
                var axisTitlesAxes = self._activeChart.axes();
                var titleText = 'Axis Title';
                if (axisTitlesAxes.primaryCategory.title.text) {
                    titleText = axisTitlesAxes.primaryCategory.title.text;
                } else if (axisTitlesAxes.primaryValue.title.text) {
                    titleText = axisTitlesAxes.primaryValue.title.text;
                }
                switch (selfKey) {
                    case 'axesTitlesPrimaryHorizontal':
                        if (axisTitlesAxes.primaryCategory.title.text !== '') {
                            axisTitlesAxes.primaryCategory.title.text = '';
                        } else {
                            axisTitlesAxes.primaryCategory.title.text = titleText;
                        }
                        axisTitlesAxes.primaryCategory.title.fontSize = 14;
                        break;
                    case 'axesTitlesPrimaryVertical':
                        if (axisTitlesAxes.primaryValue.title.text !== '') {
                            axisTitlesAxes.primaryValue.title.text = '';
                        } else {
                            axisTitlesAxes.primaryValue.title.text = titleText;
                        }
                        axisTitlesAxes.primaryValue.title.fontSize = 14;
                        break;
                    case 'axesTitlesSecondaryHorizontal':
                        if (axisTitlesAxes.secondaryCategory.title.text !== '') {
                            axisTitlesAxes.secondaryCategory.title.text = '';
                        } else {
                            axisTitlesAxes.secondaryCategory.title.text = titleText;
                        }
                        axisTitlesAxes.secondaryCategory.title.fontSize = 14;
                        break;
                    case 'axesTitlesSecondaryVertical':
                        if (axisTitlesAxes.secondaryValue.title.text !== '') {
                            axisTitlesAxes.secondaryValue.title.text = '';
                        } else {
                            axisTitlesAxes.secondaryValue.title.text = titleText;
                        }
                        axisTitlesAxes.secondaryValue.title.fontSize = 14;
                        break;
                }
                app.doAction("changeChartElement", {axes: axisTitlesAxes});
                break;
            case 'chartTitle':
                var chartTitle = self._activeChart.title();
                switch (selfKey) {
                    case 'chartTitleNone' :
                        if (chartTitle && chartTitle.text) {
                            chartTitle.text = '';
                        }
                        break;
                    case 'chartTitleAboveChart' :
                        if (chartTitle && chartTitle.text) {
                            chartTitle.text = chartTitle.text === '' ? 'Chart Title' : chartTitle.text;
                        } else {
                            chartTitle = {text: 'Chart Title'};
                        }
                        break;
                }
                app.doAction("changeChartElement", {title: chartTitle});
                break;
            case 'dataLabels':
                var dataLabels = self._activeChart.dataLabels();
                dataLabels.showValue = true;
                dataLabels.showSeriesName = false;
                dataLabels.showCategoryName = false;
                var dataLabelPosition = GC.Spread.Sheets.Charts.DataLabelPosition;
                switch (selfKey) {
                    case 'dataLabelsNone':
                        dataLabels.showValue = false;
                        break;
                    case 'dataLabelsCenter':
                        dataLabels.position = dataLabelPosition.center;
                        break;
                    case 'dataLabelsInsideEnd':
                        dataLabels.position = dataLabelPosition.insideEnd;
                        break;
                    case 'dataLabelsOutsideEnd':
                        dataLabels.position = dataLabelPosition.outsideEnd;
                        break;
                    case 'dataLabelsBestFit':
                        dataLabels.position = dataLabelPosition.bestFit;
                        break;
                    case 'dataLabelsLeft':
                        dataLabels.position = dataLabelPosition.left;
                        break;
                    case 'dataLabelsRight':
                        dataLabels.position = dataLabelPosition.right;
                        break;
                    case 'dataLabelsAbove':
                        dataLabels.position = dataLabelPosition.above;
                        break;
                    case 'dataLabelsBelow':
                        dataLabels.position = dataLabelPosition.below;
                        break;
                    case 'dataLabelsShow':
                        dataLabels.showValue = true;
                        break;
                }
                app.doAction("changeChartElement", {dataLabels: dataLabels});
                break;
            case 'gridLines':
                var gridLinesAxes = self._activeChart.axes();
                switch (selfKey) {
                    case 'gridLinesPrimaryMajorHorizontal':
                        gridLinesAxes.primaryValue.majorGridLine.visible = !gridLinesAxes.primaryValue.majorGridLine.visible;
                        break;
                    case 'gridLinesPrimaryMajorVertical' :
                        gridLinesAxes.primaryCategory.majorGridLine.visible = !gridLinesAxes.primaryCategory.majorGridLine.visible;
                        break;
                    case 'gridLinesPrimaryMinorHorizontal' :
                        gridLinesAxes.primaryValue.minorGridLine.visible = !gridLinesAxes.primaryValue.minorGridLine.visible;
                        break;
                    case 'gridLinesPrimaryMinorVertical' :
                        gridLinesAxes.primaryCategory.minorGridLine.visible = !gridLinesAxes.primaryCategory.minorGridLine.visible;
                        break;
                    case 'gridLinesSecondaryMajorHorizontal':
                        gridLinesAxes.secondaryValue.majorGridLine.visible = !gridLinesAxes.secondaryValue.majorGridLine.visible;
                        break;
                    case 'gridLinesSecondaryMajorVertical' :
                        gridLinesAxes.secondaryCategory.majorGridLine.visible = !gridLinesAxes.secondaryCategory.majorGridLine.visible;
                        break;
                    case 'gridLinesSecondaryMinorHorizontal' :
                        gridLinesAxes.secondaryValue.minorGridLine.visible = !gridLinesAxes.secondaryValue.minorGridLine.visible;
                        break;
                    case 'gridLinesSecondaryMinorVertical' :
                        gridLinesAxes.secondaryCategory.minorGridLine.visible = !gridLinesAxes.secondaryCategory.minorGridLine.visible;
                        break;
                }
                app.doAction("changeChartElement", {axes: gridLinesAxes});
                break;
            case 'legend':
                var legend = self._activeChart.legend();
                legend.visible = true;
                var legendPosition = GC.Spread.Sheets.Charts.LegendPosition;
                switch (selfKey) {
                    case 'legendNone':
                        legend.visible = false;
                        break;
                    case 'legendRight':
                        legend.position = legendPosition.right;
                        break;
                    case 'legendTop':
                        legend.position = legendPosition.top;
                        break;
                    case 'legendLeft':
                        legend.position = legendPosition.left;
                        break;
                    case 'legendBottom':
                        legend.position = legendPosition.bottom;
                        break;
                }
                app.doAction("changeChartElement", {legend: legend});
                break;
            default:
                break;
        }
        self._closePopup();
    });
};

AddChartElement.prototype._needShowMenuItemWithObjKey = function (objKey) {
    //use union of set with every chartGroupName
    for (var i = 0; i < this._chartGroupNameArray.length; i++) {
        var chartName = this._chartGroupNameArray[i];
        var chartGroupItem = this._chartGroupItemObj[chartName] || {};
        if (!(chartGroupItem[objKey] && !chartGroupItem[objKey].needShow)) {
            return true;    // need show
        }
    }
    return false;
};

AddChartElement.prototype._needShowSubMenuItemWithObjKeyAndSubMenuKey = function (objKey, subMenuKey) {

    //user first chartGroupName
    if (this._chartGroupNameArray.length > 0) {
        var chartName = this._chartGroupNameArray[0];
        var chartGroupItem = this._chartGroupItemObj[chartName] || {};
        var chartType = ChartHelper.getChartTypeString(this._activeChart.chartType());
        //Determine whether chartGroupItem[objKey] exists and does not exist use {}
        var menuItem = chartGroupItem[objKey] || {};
        //Determine whether menuItem.subTitle exists and does not exist use {}
        var subTitle = menuItem.subTitle || {};
        // doughnut is very special with pieGroup, so do this ,
        //when chart type is doughnut ,that we need to show dataLabelsShow and dataLabelsNone,don't need to show dataLabelsCenter、dataLabelsInsideEnd、dataLabelsOutsideEnd、dataLabelsBestFit
        if (chartType === 'doughnut' && objKey === 'dataLabels') {
            if (subMenuKey === 'dataLabelsCenter' || subMenuKey === 'dataLabelsInsideEnd'
                || subMenuKey === 'dataLabelsOutsideEnd' || subMenuKey === 'dataLabelsBestFit') {
                return false;
            } else if (subMenuKey === 'dataLabelsShow') {
                return true;
            }
        }
        if ((subTitle[subMenuKey] && !subTitle[subMenuKey].needShow)) {
            return false;
        }
    }
    return true;
};
