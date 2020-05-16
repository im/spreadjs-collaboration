var designer = GC.Spread.Sheets.Designer;
var shapeHelper = designer.shapeHelper;
var InsertShapePopup = designer.InsertShapePopup;
var nameResource = designer.res.shapeType;

(function () {
    'use strict';
    var compar = [
        [
            {
                type: 'straight',
                className: 'noHeadStraight',
                name: nameResource.line,
                isConnectorType: true
            },
            {
                type: 'straight',
                className: 'endArrowHeadStraight',
                isConnectorType: true,
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
                isConnectorType: true,
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
                className: 'Elbow',
                name: nameResource.elbow,
                isConnectorType: true,
            },
            {
                type: 'elbow',
                name: nameResource.elbowArrow,
                className: 'endArrowHeadElbow',
                isConnectorType: true,
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
                isConnectorType: true,
                name: nameResource.elbowArrowDouble,
                endArrowhead: {
                    endArrowheadStyle: "open",
                    endArrowheadWidth: 'medium',
                    endArrowheadLength: 'medium',
                },
            },
        ],
        [
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
            }
        ],
        [
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
            }
        ],
        [
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
            }],
        [
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
            }],
        [
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
            }],
        [
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
            }],
        [
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
            }],
        [
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
            }],
        [
            {
                type: 'leftBrace',
                name: nameResource.leftBrace
            },
            {
                type: 'rightBrace',
                name: nameResource.rightBrace
            },
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
            }],
        [
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
            }],
        [
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
            }],
        [
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
            }],
        [
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
            }],
        [
            {
                type: 'plaqueTabs',
                name: nameResource.plaqueTabs
            },
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
            }],
        [
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
                name: nameResource.leftRightupArrow
            },
            {
                type: 'bentArrow',
                name: nameResource.bentArrow
            },
            {
                type: 'uTurnArrow',
                name: nameResource.uturnArrow
            },
            {
                type: 'leftUpArrow',
                name: nameResource.leftupArrow
            }],
        [
            {
                type: 'bentUpArrow',
                name: nameResource.bentupArrow
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
            }],
        [
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
            }],
        [
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
            {
                type: 'mathPlus',
                name: nameResource.mathPlus
            },
            {
                type: 'mathMinus',
                name: nameResource.mathMinus
            }],
        [
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
            {
                type: 'flowchartProcess',
                name: nameResource.flowchartProcess
            },
            {
                type: 'flowchartAlternateProcess',
                name: nameResource.flowchartAlternateProcess
            }],
        [
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
            }],
        [
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
            }],
        [
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
            }],
        [
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
            }],
        [
            {
                type: 'flowchartDirectAccessStorage',
                name: nameResource.flowchartDirectAccessStorage
            },
            {
                type: 'flowchartDisplay',
                name: nameResource.flowchartDisplay
            },
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
            }],
        [
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
            }],
        [
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
            }],
        [
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
            {
                type: 'rectangularCallout',
                name: nameResource.rectangularCallout
            },
            {
                type: 'roundedRectangularCallout',
                name: nameResource.roundedRectangularCallout
            }],
        [
            {
                type: 'ovalCallout',
                name: nameResource.ovalCallout
            },
            {
                type: 'cloudCallout',
                name: nameResource.cloudCallout
            },
            {
                type: 'LineCallout2',
                name: nameResource.LineCallout2
            },
            {
                type: 'LineCallout3',
                name: nameResource.LineCallout3
            },
            {
                type: 'LineCallout4',
                name: nameResource.LineCallout4
            },
            {
                type: 'lineCallout2AccentBar',
                name: nameResource.lineCallout2AccentBar
            }],
        [
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
            }],
        [
            {
                type: 'lineCallout3BorderandAccentBar',
                name: nameResource.lineCallout3BorderandAccentBar
            },
            {
                type: 'lineCallout4BorderandAccentBar',
                name: nameResource.lineCallout4BorderandAccentBar
            }
        ]
    ];

    function insertShapePreview(host) {
        var self = this;
        self.host = host;
        self._createContent();
        self._createControlButton();
        self.reInsertShapesPopup = null;
    }

    insertShapePreview.prototype._createContent = function () {
        var self = this;
        var contentHost = $("<div class='insert-shape-preview-content-host'></div>");
        var shadowBox = $("<div class='insert-shape-preview-shadowBox'></div>");
        var imgShape = $("<img id='insert-shape-preview-imgShape' src='../images/allShapes.png'>");
        contentHost.mouseleave(function () {
            $(".insert-shape-preview-shadowBox").css('display', 'none');
        });
        var getShapeInfo = function (e, comparDom) {
            var offsetX = e.pageX - comparDom.offset().left;
            var offsetY = e.pageY - comparDom.offset().top;
            var xPosition = Math.floor(offsetX / 20);
            var yPosition = Math.floor(offsetY / 20);
            if (yPosition >= 0 && xPosition >= 0) {
                return {
                    shapeInfo: compar[yPosition][xPosition],
                    x: xPosition,
                    y: yPosition
                };
            }
        };
        imgShape.mousemove(function (e) {
            var shapeNameAndType = getShapeInfo(e, imgShape);
            if (shapeNameAndType) {
                shadowBox.attr('title', shapeNameAndType.shapeInfo.name);
            }
            var shapeData = getShapeInfo(e, $('.insert-shape-preview-content-host'));
            if (shapeData) {
                shadowBox.css('display', 'block');
                shadowBox.css('top', (shapeData.y) * 20 + 'px');
                shadowBox.css('left', (shapeData.x) * 20 + 'px');
            }
        });
        shadowBox.click(function (e) {
            var shapeInfo = getShapeInfo(e, imgShape).shapeInfo;
            var isConnectorType = shapeInfo.isConnectorType;
            var sheet = designer.wrapper.spread.getActiveSheet();
            var position = shapeHelper.getShapePosition(sheet);
            designer.actions.doAction('insertShape', designer.wrapper.spread, {
                shapeName: null,
                shapeInfo: shapeInfo,
                isConnectorType: isConnectorType,
                position: position
            });
        });


        imgShape.appendTo(contentHost);
        shadowBox.appendTo(contentHost);
        contentHost.appendTo(self.host);
    };
    insertShapePreview.prototype._createControlButton = function () {
        var self = this;
        var buttonHost = $("<div class='insert-shape-preview-control-host'></div>");
        var upButton = $("<div class='insert-shape-preview-up-button'></div>");
        var upButtonIcon = $("<div class='insert-shape-preview-up-button-icon'></div>");
        upButtonIcon.appendTo(upButton);
        upButton.click(function () {
            var img = document.querySelector('#insert-shape-preview-imgShape');
            var top = document.defaultView.getComputedStyle(img, null).top;
            top = parseInt(top);
            img.style.top = top + 20 <= 0 ? top + 20 + "px" : '0px';
        });
        var downButton = $("<div class='insert-shape-preview-down-button'></div>");
        var downButtonIcon = $("<div class='insert-shape-preview-down-button-icon'></div>");
        downButtonIcon.appendTo(downButton);
        downButton.click(function () {
            var img = document.querySelector('#insert-shape-preview-imgShape');
            var top = document.defaultView.getComputedStyle(img, null).top;
            top = parseInt(top);
            img.style.top = top - 20 > -560 ? top - 20 + "px" : "-560px";
        });
        var showALlButton = $("<div class='insert-shape-preview-Show-all-button'></div>");
        var showALlButtonIconTop = $("<div class='insert-shape-preview-Show-all-button-icontop'></div>");
        var showALlButtonIconBottom = $("<div class='insert-shape-preview-Show-all-button-iconbottom'></div>");
        showALlButton.click(function () {
            if (!self.reInsertShapesPopup) {
                self.reInsertShapesPopup = $("#ribbon-shape-type-list-popup").gcuipopup({
                    autoHide: true,
                    position: {
                        of: $("#reInsert-shape-preview"),
                        my: 'left top',
                        at: 'left bottom'
                    }
                });

                if ($("#ribbon-shape-type-list-popup").children.length !== 0) {
                    $("#ribbon-shape-type-list-popup").empty();
                }
                var reInsertShapesContainer = $("<div class='shape-type-list-container'>");
                $("#ribbon-shape-type-list-popup").append(reInsertShapesContainer);
                new InsertShapePopup(reInsertShapesContainer, 'insert', function () {  //NOSONAR
                    $("#ribbon-shape-type-list-popup").gcuipopup("hide");
                });
            }
            self.reInsertShapesPopup.gcuipopup("show");
        });
        showALlButtonIconTop.appendTo(showALlButton);
        showALlButtonIconBottom.appendTo(showALlButton);
        upButton.appendTo(buttonHost);
        downButton.appendTo(buttonHost);
        showALlButton.appendTo(buttonHost);
        buttonHost.appendTo(self.host);
    };
    designer.InsertShapePreview = insertShapePreview;
}());