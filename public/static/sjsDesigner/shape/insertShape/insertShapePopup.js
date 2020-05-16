var designer = GC.Spread.Sheets.Designer;
var shapeHelper = designer.shapeHelper;

(function () {
    'use strict';
    function InsertShapePopup(host, isChangeShapeType, closeCallBack) {
        var self = this, insertContainer;
        self.closeCallBack = closeCallBack;
        self._host = host;
        self.container = insertContainer = $("<div class='shape-insert-container'></div>");
        insertContainer.addClass("shape-insert-container-scroll");
        host.unbind();
        host.resizable();
        host.resize(function () {
            if (parseInt($(this).height()) <= 539) {
                insertContainer.removeClass("shape-insert-container-scroll");
            } else {
                insertContainer.addClass("shape-insert-container-scroll");
            }
        });

        self.container.appendTo(self._host);
        self.isChangeShapeType = isChangeShapeType;
        var nameResource = designer.res.shapeType;
        self.UIDataSource = [
            {
                resource: designer.res.insertShapeDialog.lines,
                isConnectorType: true,
                shapes: [
                    {
                        type: 'straight',
                        className: 'noHeadStraight',
                        name: nameResource.line
                    },
                    {
                        type: 'straight',
                        className: 'endArrowHeadStraight',
                        name: nameResource.lineArrow,
                        endArrowhead: {
                            endArrowheadStyle: "open",
                            endArrowheadWidth: 'medium',
                            endArrowheadLength: 'medium',
                        }
                    },
                    {
                        beginArrowhead: {
                            beginArrowheadStyle: "open",
                            beginArrowheadWidth: 'medium',
                            beginArrowheadLength: 'medium',
                        },
                        type: 'straight',
                        className: 'beginEndArrowHeadStraight',
                        name: nameResource.lineArrowDouble,
                        endArrowhead: {
                            endArrowheadStyle: "open",
                            endArrowheadWidth: 'medium',
                            endArrowheadLength: 'medium',
                        }
                    },

                    {
                        type: 'elbow',
                        name: nameResource.elbow,
                        className: 'Elbow',
                    },
                    {
                        type: 'elbow',
                        name: nameResource.elbowArrow,
                        className: 'endArrowHeadElbow',
                        endArrowhead: {
                            endArrowheadStyle: "open",
                            endArrowheadWidth: 'medium',
                            endArrowheadLength: 'medium',
                        },
                    },
                    {
                        beginArrowhead: {
                            beginArrowheadStyle: "open",
                            beginArrowheadWidth: 'medium',
                            beginArrowheadLength: 'medium',
                        },
                        type: 'elbow',
                        className: 'beginEndArrowHeadElbow',
                        name: nameResource.elbowArrowDouble,
                        endArrowhead: {
                            endArrowheadStyle: "open",
                            endArrowheadWidth: 'medium',
                            endArrowheadLength: 'medium',
                        },
                    },

                ]
            },
            {
                resource: designer.res.insertShapeDialog.rectangles,
                shapes: [
                    {
                        type: 'rectangle',
                        name: nameResource.rectangle
                    },
                    {
                        type: 'roundedRectangle',
                        name: nameResource.roundedRectangle
                    },
                    {
                        type: 'snip1Rectangle',
                        name: nameResource.snip1Rectangle
                    },
                    {
                        type: 'snip2SameRectangle',
                        name: nameResource.snip2SameRectangle
                    },
                    {
                        type: 'snip2DiagRectangle',
                        name: nameResource.snip2DiagRectangle
                    },
                    {
                        type: 'snipRoundRectangle',
                        name: nameResource.snipRoundRectangle
                    },
                    {
                        type: 'round1Rectangle',
                        name: nameResource.round1Rectangle
                    },
                    {
                        type: 'round2SameRectangle',
                        name: nameResource.round2SameRectangle
                    },
                    {
                        type: 'round2DiagRectangle',
                        name: nameResource.round2DiagRectangle
                    },

                ]
            },
            {
                resource: designer.res.insertShapeDialog.basicShapes,
                shapes: [
                    {
                        type: 'oval',
                        name: nameResource.oval
                    },
                    {
                        type: 'isoscelesTriangle',
                        name: nameResource.isoscelesTriangle
                    },
                    {
                        type: 'rightTriangle',
                        name: nameResource.rightTriangle
                    },
                    {
                        type: 'parallelogram',
                        name: nameResource.parallelogram
                    },
                    {
                        type: 'trapezoid',
                        name: nameResource.trapezoid
                    },
                    {
                        type: 'diamond',
                        name: nameResource.diamond
                    },
                    {
                        type: 'regularPentagon',
                        name: nameResource.regularPentagon
                    },
                    {
                        type: 'hexagon',
                        name: nameResource.hexagon
                    },
                    {
                        type: 'heptagon',
                        name: nameResource.heptagon
                    },
                    {
                        type: 'octagon',
                        name: nameResource.octagon
                    },
                    {
                        type: 'decagon',
                        name: nameResource.decagon
                    },
                    {
                        type: 'dodecagon',
                        name: nameResource.dodecagon
                    },
                    {
                        type: 'pie',
                        name: nameResource.pie
                    },
                    {
                        type: 'chord',
                        name: nameResource.chord
                    },
                    {
                        type: 'tear',
                        name: nameResource.tear
                    },
                    {
                        type: 'frame',
                        name: nameResource.frame
                    },
                    {
                        type: 'halfFrame',
                        name: nameResource.halfFrame
                    },
                    {
                        type: 'corner',
                        name: nameResource.corner
                    },
                    {
                        type: 'diagonalStripe',
                        name: nameResource.diagonalStripe
                    },
                    {
                        type: 'cross',
                        name: nameResource.cross
                    },
                    {
                        type: 'plaque',
                        name: nameResource.plaque
                    },
                    {
                        type: 'can',
                        name: nameResource.can
                    },
                    {
                        type: 'cube',
                        name: nameResource.cube
                    },
                    {
                        type: 'bevel',
                        name: nameResource.bevel
                    },
                    {
                        type: 'donut',
                        name: nameResource.donut
                    },
                    {
                        type: 'noSymbol',
                        name: nameResource.noSymbol
                    },
                    {
                        type: 'blockArc',
                        name: nameResource.blockArc
                    },
                    {
                        type: 'foldedCorner',
                        name: nameResource.foldedCorner
                    },
                    {
                        type: 'smileyFace',
                        name: nameResource.smileyFace
                    },
                    {
                        type: 'heart',
                        name: nameResource.heart
                    },
                    {
                        type: 'lightningBolt',
                        name: nameResource.lightningBolt
                    },
                    {
                        type: 'sun',
                        name: nameResource.sun
                    },
                    {
                        type: 'moon',
                        name: nameResource.moon
                    },
                    {
                        type: 'cloud',
                        name: nameResource.cloud
                    },
                    {
                        type: 'arc',
                        name: nameResource.arc
                    },
                    {
                        type: 'doubleBracket',
                        name: nameResource.doubleBracket
                    },
                    {
                        type: 'doubleBrace',
                        name: nameResource.doubleBrace
                    },
                    {
                        type: 'leftBracket',
                        name: nameResource.leftBracket
                    },
                    {
                        type: 'rightBracket',
                        name: nameResource.rightBracket
                    },
                    {
                        type: 'leftBrace',
                        name: nameResource.leftBrace
                    },
                    {
                        type: 'rightBrace',
                        name: nameResource.rightBrace
                    },
                    //add
                    {
                        type: 'upDownArrowCallout',
                        name: nameResource.upDownArrowCallout
                    },
                    {
                        type: 'actionButtonHome',
                        name: nameResource.actionButtonHome
                    },

                    {
                        type: 'actionButtonHelp',
                        name: nameResource.actionButtonHelp
                    },
                    {
                        type: 'actionButtonInformation',
                        name: nameResource.actionButtonInformation
                    },
                    {
                        type: 'actionButtonBackorPrevious',
                        name: nameResource.actionButtonBackorPrevious
                    },
                    {
                        type: 'actionButtonForwardorNext',
                        name: nameResource.actionButtonForwardorNext
                    },
                    {
                        type: 'actionButtonBeginning',
                        name: nameResource.actionButtonBeginning
                    },
                    {
                        type: 'actionButtonEnd',
                        name: nameResource.actionButtonEnd
                    },
                    {
                        type: 'actionButtonReturn',
                        name: nameResource.actionButtonReturn
                    },
                    {
                        type: 'actionButtonDocument',
                        name: nameResource.actionButtonDocument
                    },
                    {
                        type: 'actionButtonSound',
                        name: nameResource.actionButtonSound
                    },
                    {
                        type: 'actionButtonMovie',
                        name: nameResource.actionButtonMovie
                    },
                    {
                        type: 'flowchartOfflineStorage',
                        name: nameResource.flowchartOfflineStorage
                    },
                    {
                        type: 'leftRightRibbon',
                        name: nameResource.leftRightRibbon
                    },
                    {
                        type: 'chartStar',
                        name: nameResource.chartStar
                    },
                    {
                        type: 'chartPlus',
                        name: nameResource.chartPlus
                    },
                    {
                        type: 'lineInverse',
                        name: nameResource.lineInverse
                    },
                    {
                        type: 'leftCircularArrow',
                        name: nameResource.leftCircularArrow
                    },
                    {
                        type: 'leftRightCircularArrow',
                        name: nameResource.leftRightCircularArrow
                    },
                    {
                        type: 'swooshArrow',
                        name: nameResource.swooshArrow
                    },
                    {
                        type: 'chartX',
                        name: nameResource.chartX
                    },
                    {
                        type: 'gear6',
                        name: nameResource.gear6
                    },
                    {
                        type: 'gear9',
                        name: nameResource.gear9
                    },
                    {
                        type: 'funnel',
                        name: nameResource.funnel
                    },
                    {
                        type: 'pieWedge',
                        name: nameResource.pieWedge
                    },
                    {
                        type: 'nonIsoscelesTrapezoid',
                        name: nameResource.nonIsoscelesTrapezoid
                    },
                    {
                        type: 'cornerTabs',
                        name: nameResource.cornerTabs
                    },
                    {
                        type: 'squareTabs',
                        name: nameResource.squareTabs
                    },
                    {
                        type: 'plaqueTabs',
                        name: nameResource.plaqueTabs
                    },
                ]
            },
            {
                resource: designer.res.insertShapeDialog.blockArrows,
                shapes: [
                    {
                        type: 'rightArrow',
                        name: nameResource.rightArrow
                    },
                    {
                        type: 'leftArrow',
                        name: nameResource.leftArrow
                    },
                    {
                        type: 'upArrow',
                        name: nameResource.upArrow
                    },
                    {
                        type: 'downArrow',
                        name: nameResource.downArrow
                    },
                    {
                        type: 'leftRightArrow',
                        name: nameResource.leftRightArrow
                    },
                    {
                        type: 'upDownArrow',
                        name: nameResource.upDownArrow
                    },
                    {
                        type: 'quadArrow',
                        name: nameResource.quadArrow
                    },
                    {
                        type: 'leftRightUpArrow',
                        name: nameResource.leftRightUpArrow
                    },
                    {
                        type: 'bentArrow',
                        name: nameResource.bentArrow
                    },
                    {
                        type: 'uTurnArrow',
                        name: nameResource.uTurnArrow
                    },
                    {
                        type: 'leftUpArrow',
                        name: nameResource.leftUpArrow
                    },
                    {
                        type: 'bentUpArrow',
                        name: nameResource.bentUpArrow
                    },
                    {
                        type: 'curvedRightArrow',
                        name: nameResource.curvedRightArrow
                    },
                    {
                        type: 'curvedLeftArrow',
                        name: nameResource.curvedLeftArrow
                    },
                    {
                        type: 'curvedUpArrow',
                        name: nameResource.curvedUpArrow
                    },
                    {
                        type: 'curvedDownArrow',
                        name: nameResource.curvedDownArrow
                    },
                    {
                        type: 'stripedRightArrow',
                        name: nameResource.stripedRightArrow
                    },
                    {
                        type: 'notchedRightArrow',
                        name: nameResource.notchedRightArrow
                    },
                    {
                        type: 'pentagon',
                        name: nameResource.pentagon
                    },
                    {
                        type: 'chevron',
                        name: nameResource.chevron
                    },
                    {
                        type: 'rightArrowCallout',
                        name: nameResource.rightArrowCallout
                    },
                    {
                        type: 'downArrowCallout',
                        name: nameResource.downArrowCallout
                    },
                    {
                        type: 'leftArrowCallout',
                        name: nameResource.leftArrowCallout
                    },
                    {
                        type: 'upArrowCallout',
                        name: nameResource.upArrowCallout
                    },
                    {
                        type: 'leftRightArrowCallout',
                        name: nameResource.leftRightArrowCallout
                    },
                    {
                        type: 'quadArrowCallout',
                        name: nameResource.quadArrowCallout
                    },
                    {
                        type: 'circularArrow',
                        name: nameResource.circularArrow
                    },
                ]
            },
            {
                resource: designer.res.insertShapeDialog.equationShapes,
                shapes: [
                    {
                        type: 'mathPlus',
                        name: nameResource.mathPlus
                    },
                    {
                        type: 'mathMinus',
                        name: nameResource.mathMinus
                    },
                    {
                        type: 'mathMultiply',
                        name: nameResource.mathMultiply
                    },
                    {
                        type: 'mathDivide',
                        name: nameResource.mathDivide
                    },
                    {
                        type: 'mathEqual',
                        name: nameResource.mathEqual
                    },
                    {
                        type: 'mathNotEqual',
                        name: nameResource.mathNotEqual
                    },
                ]
            },
            {
                resource: designer.res.insertShapeDialog.flowChart,
                shapes: [
                    {
                        type: 'flowchartProcess',
                        name: nameResource.flowchartProcess
                    },
                    {
                        type: 'flowchartAlternateProcess',
                        name: nameResource.flowchartAlternateProcess
                    },
                    {
                        type: 'flowchartDecision',
                        name: nameResource.flowchartDecision
                    },
                    {
                        type: 'flowchartData',
                        name: nameResource.flowchartData
                    },
                    {
                        type: 'flowchartPredefinedProcess',
                        name: nameResource.flowchartPredefinedProcess
                    },
                    {
                        type: 'flowchartInternalStorage',
                        name: nameResource.flowchartInternalStorage
                    },
                    {
                        type: 'flowchartDocument',
                        name: nameResource.flowchartDocument
                    },
                    {
                        type: 'flowchartMultidocument',
                        name: nameResource.flowchartMultidocument
                    },
                    {
                        type: 'flowchartTerminator',
                        name: nameResource.flowchartTerminator
                    },
                    {
                        type: 'flowchartPreparation',
                        name: nameResource.flowchartPreparation
                    },
                    {
                        type: 'flowchartManualInput',
                        name: nameResource.flowchartManualInput
                    },
                    {
                        type: 'flowchartManualOperation',
                        name: nameResource.flowchartManualOperation
                    },
                    {
                        type: 'flowchartConnector',
                        name: nameResource.flowchartConnector
                    },
                    {
                        type: 'flowchartOffpageConnector',
                        name: nameResource.flowchartOffpageConnector
                    },
                    {
                        type: 'flowchartCard',
                        name: nameResource.flowchartCard
                    },
                    {
                        type: 'flowchartPunchedTape',
                        name: nameResource.flowchartPunchedTape
                    },
                    {
                        type: 'flowchartSummingJunction',
                        name: nameResource.flowchartSummingJunction
                    },
                    {
                        type: 'flowchartOr',
                        name: nameResource.flowchartOr
                    },
                    {
                        type: 'flowchartCollate',
                        name: nameResource.flowchartCollate
                    },
                    {
                        type: 'flowchartSort',
                        name: nameResource.flowchartSort
                    },
                    {
                        type: 'flowchartExtract',
                        name: nameResource.flowchartExtract
                    },
                    {
                        type: 'flowchartMerge',
                        name: nameResource.flowchartMerge
                    },
                    {
                        type: 'flowchartStoredData',
                        name: nameResource.flowchartStoredData
                    },
                    {
                        type: 'flowchartDelay',
                        name: nameResource.flowchartDelay
                    },
                    {
                        type: 'flowchartSequentialAccessStorage',
                        name: nameResource.flowchartSequentialAccessStorage
                    },
                    {
                        type: 'flowchartMagneticDisk',
                        name: nameResource.flowchartMagneticDisk
                    },
                    {
                        type: 'flowchartDirectAccessStorage',
                        name: nameResource.flowchartDirectAccessStorage
                    },
                    {
                        type: 'flowchartDisplay',
                        name: nameResource.flowchartDisplay
                    },
                ]
            },
            {
                resource: designer.res.insertShapeDialog.starsAndBanners,
                shapes: [
                    {
                        type: 'explosion1',
                        name: nameResource.explosion1
                    },
                    {
                        type: 'explosion2',
                        name: nameResource.explosion2
                    },
                    {
                        type: 'shape4pointStar',
                        name: nameResource.shape4pointStar
                    },
                    {
                        type: 'shape5pointStar',
                        name: nameResource.shape5pointStar
                    },
                    {
                        type: 'star6Point',
                        name: nameResource.star6Point
                    },
                    {
                        type: 'star7Point',
                        name: nameResource.star7Point
                    },
                    {
                        type: 'shape8pointStar',
                        name: nameResource.shape8pointStar
                    },
                    {
                        type: 'star10Point',
                        name: nameResource.star10Point
                    },
                    {
                        type: 'star12Point',
                        name: nameResource.star12Point
                    },
                    {
                        type: 'shape16pointStar',
                        name: nameResource.shape16pointStar
                    },
                    {
                        type: 'shape24pointStar',
                        name: nameResource.shape24pointStar
                    },
                    {
                        type: 'shape32pointStar',
                        name: nameResource.shape32pointStar
                    },
                    {
                        type: 'upRibbon',
                        name: nameResource.upRibbon
                    },
                    {
                        type: 'downRibbon',
                        name: nameResource.downRibbon
                    },
                    {
                        type: 'curvedUpRibbon',
                        name: nameResource.curvedUpRibbon
                    },
                    {
                        type: 'curvedDownRibbon',
                        name: nameResource.curvedDownRibbon
                    },
                    {
                        type: 'verticalScroll',
                        name: nameResource.verticalScroll
                    },
                    {
                        type: 'horizontalScroll',
                        name: nameResource.horizontalScroll
                    },
                    {
                        type: 'wave',
                        name: nameResource.wave
                    },
                    {
                        type: 'doubleWave',
                        name: nameResource.doubleWave
                    },
                ]
            },
            {
                resource: designer.res.insertShapeDialog.callouts,
                shapes: [
                    {
                        type: 'rectangularCallout',
                        name: nameResource.rectangularCallout
                    },
                    {
                        type: 'roundedRectangularCallout',
                        name: nameResource.roundedRectangularCallout
                    },
                    {
                        type: 'ovalCallout',
                        name: nameResource.ovalCallout
                    },
                    {
                        type: 'cloudCallout',
                        name: nameResource.cloudCallout
                    },
                    {
                        type: 'lineCallout2',
                        name: nameResource.lineCallout2
                    },
                    {
                        type: 'lineCallout3',
                        name: nameResource.lineCallout3
                    },
                    {
                        type: 'lineCallout4',
                        name: nameResource.lineCallout4
                    },
                    {
                        type: 'lineCallout2AccentBar',
                        name: nameResource.lineCallout2AccentBar
                    },
                    {
                        type: 'lineCallout3AccentBar',
                        name: nameResource.lineCallout3AccentBar
                    },
                    {
                        type: 'lineCallout4AccentBar',
                        name: nameResource.lineCallout4AccentBar
                    },
                    {
                        type: 'lineCallout2NoBorder',
                        name: nameResource.lineCallout2NoBorder
                    },
                    {
                        type: 'lineCallout3NoBorder',
                        name: nameResource.lineCallout3NoBorder
                    },
                    {
                        type: 'lineCallout4NoBorder',
                        name: nameResource.lineCallout4NoBorder
                    },
                    {
                        type: 'lineCallout2BorderandAccentBar',
                        name: nameResource.lineCallout2BorderandAccentBar
                    },
                    {
                        type: 'lineCallout3BorderandAccentBar',
                        name: nameResource.lineCallout3BorderandAccentBar
                    },
                    {
                        type: 'lineCallout4BorderandAccentBar',
                        name: nameResource.lineCallout4BorderandAccentBar
                    }
                ]
            }
        ];
        if (isChangeShapeType === 'change') {
            self.UIDataSource.shift();
        }
        self._createUI();
    }

    InsertShapePopup.prototype._createUI = function () {
        var self = this, UIDataSource = this.UIDataSource;
        for (var i = 0; i < UIDataSource.length; i++) {
            var item = UIDataSource[i];
            self._createItemHeader(item.resource);
            self._createItemCon(item.shapes, item.isConnectorType);
        }
    };
    InsertShapePopup.prototype._createItemHeader = function (text) {
        var self = this,
            itemHeader = $("<div class='shape-insert-item-header'></div>");
        itemHeader.html(text);
        itemHeader.appendTo(self.container);
    };
    InsertShapePopup.prototype._createItemCon = function (itemArray, isConnectorType) {
        var self = this,
            item = $("<div class='shape-insert-item-con'></div>");
        for (var i = 0; i < itemArray.length; i++) {
            var shape = itemArray[i];
            self._createItemShape(item, shape, isConnectorType);
        }
        item.appendTo(self.container);
    };
    InsertShapePopup.prototype._createItemShape = function (host, shape, isConnectorType) {
        var self = this;
        var item = $("<div class='shape-insert-item'></div>");
        var classname = shape.className || shape.type;
        item.addClass('insert-shape-item-' + classname);
        item.attr("title", shape.name);
        item.click(function () {
            switch (self.isChangeShapeType) {
                case "insert": {
                    self._applyInsertShape(shape, isConnectorType);
                    break;
                }
                case "change": {
                    self._applyChangeShapeType(shape);
                    break;
                }
            }
        });
        item.appendTo(host);
    };
    InsertShapePopup.prototype._applyInsertShape = function (shapeType, isConnectorType) {
        var self = this;
        var sheet = designer.wrapper.spread.getActiveSheet();
        var position = shapeHelper.getShapePosition(sheet);
        designer.actions.doAction('insertShape', designer.wrapper.spread, {
            shapeInfo: shapeType,
            isConnectorType: isConnectorType,
            position: position
        });
        self.closeCallBack();

    };
    InsertShapePopup.prototype._applyChangeShapeType = function (shapeType) {
        var self = this;
        var sheet = designer.wrapper.spread.getActiveSheet();
        var selectedShapes = shapeHelper.getActiveShapes(sheet);
        designer.actions.doAction('changeShapeType', designer.wrapper.spread, {
            selectShapes: selectedShapes,
            newShapeType: shapeType,
        });
        self.closeCallBack();
    };
    designer.InsertShapePopup = InsertShapePopup;
}());