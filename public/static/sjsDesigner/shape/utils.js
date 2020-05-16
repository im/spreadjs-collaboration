(function () {
    'use strict';
    var designer = GC.Spread.Sheets.Designer;
    var utils = {};

    function isNullOrUndefined(value) {
        return value === undefined || value === null;
    }

    utils.isNullOrUndefined = isNullOrUndefined;

    function getActiveShapes(sheet) {
        var shapes = sheet.shapes.all(), activeShapes = [];
        for (var i = 0; i < shapes.length; i++) {
            var shape = shapes[i];
            if (shape.isSelected()) {
                activeShapes.push(shape);
            }
        }
        return activeShapes;
    }

    utils.getActiveShapes = getActiveShapes;

    function isHasAppointedShapeType(shapes, shapeType) {
        if (isNullOrUndefined(shapes)) {
            return false;
        }
        for (var i = 0; i < shapes.length; i++) {
            if (getShapeType(shapes[i]) === 'groupShapeType') {
                return isHasAppointedShapeType(shapes[i].all(), shapeType);
            } else if (getShapeType(shapes[i]) === shapeType) {
                return true;
            }
        }
        return false;
    }

    utils.isHasAppointedShapeType = isHasAppointedShapeType;

    function isAllIsAppointedShapeType(shapes, shapeType) {
        if (shapes && shapes.length < 0) {
            return;
        }
        for (var i = 0; i < shapes.length; i++) {
            if (getShapeType(shapes[i]) === 'groupShapeType') {
                return isAllIsAppointedShapeType(shapes[i].all(), shapeType);
            } else if (getShapeType(shapes[i]) !== shapeType) {
                return false;
            }
        }
        return true;
    }

    utils.isAllIsAppointedShapeType = isAllIsAppointedShapeType;


    function getShapeType(shape) {
        if (shape instanceof GC.Spread.Sheets.Shapes.Shape) {
            return 'autoShapeType';
        }
        if (shape instanceof GC.Spread.Sheets.Shapes.ConnectorShape) {
            return 'connectorShapeType';
        }
        if (shape instanceof GC.Spread.Sheets.Shapes.GroupShape) {
            return 'groupShapeType';
        }
    }

    utils.getShapeType = getShapeType;

    function getAppointedShape(shapeArray, shapeTypeArray) {
        if (isNullOrUndefined(shapeArray)) {
            return;
        }
        for (var i = 0; i < shapeArray.length; i++) {
            var shape = shapeArray[i];
            if (shape instanceof GC.Spread.Sheets.Shapes.GroupShape) {
                return getAppointedShape(shape.all(), shapeTypeArray);
            } else {
                for (var j = 0; j < shapeTypeArray.length; j++) {
                    var shapeType = shapeTypeArray[j];
                    if (shape instanceof GC.Spread.Sheets.Shapes[shapeType]) {
                        return shape;
                    }
                }
            }
        }
    }

    utils.getAppointedShape = getAppointedShape;

    function updataSize(sheet) {
        var selectShape = getActiveShapes(sheet);
        var sizeValueCollection = [[], [], []];
        selectShape.forEach(function (shape) {
            sizeValueCollection[0].push(shape.width());
            sizeValueCollection[1].push(shape.height());
            if (shape.rotate) {
                sizeValueCollection[2].push(shape.rotate());
            }
        });
        sizeValueCollection[0] = getDataInValueArray(sizeValueCollection[0]);
        sizeValueCollection[1] = getDataInValueArray(sizeValueCollection[1]);
        sizeValueCollection[2] = getDataInValueArray(sizeValueCollection[2]);
        return sizeValueCollection;
    }

    utils.updataSize = updataSize;


    function getDataInValueArray(propertyValueArray) {
        var isSameValue = true;
        if (!propertyValueArray) {
            return;
        }
        for (var i = 1; i < propertyValueArray.length; i++) {
            //Exclude non-existent and empty values
            if (propertyValueArray[i] !== undefined && propertyValueArray[i] !== '' && propertyValueArray[i] !== propertyValueArray[0]) {
                isSameValue = false;
                break;
            }
        }
        if (isSameValue) {
            return propertyValueArray[0];
        } else {
            return '';
        }
    }

    utils.getDataInValueArray = getDataInValueArray;

    function getShapePosition(sheet) {
        var row, col;
        var activeRowIndex = sheet.getActiveRowIndex();
        var activeColumnIndex = sheet.getActiveColumnIndex();
        var viewportBottomRow = sheet.getViewportBottomRow(1);
        var viewportTopRow = sheet.getViewportTopRow(1);
        var viewportLeftColumn = sheet.getViewportLeftColumn(1);
        var viewportRightColumn = sheet.getViewportRightColumn(1);
        if (activeRowIndex <= viewportTopRow) {
            row = viewportTopRow;
        } else if (activeRowIndex >= viewportBottomRow) {
            row = viewportBottomRow;
        } else {
            row = activeRowIndex;
        }
        if (activeColumnIndex <= viewportLeftColumn) {
            col = viewportLeftColumn;
        } else if (activeColumnIndex >= viewportRightColumn) {
            col = viewportRightColumn;
        } else {
            col = activeColumnIndex;
        }
        return getShapePositionInXY(sheet, row, col);
    }
    utils.getShapePosition = getShapePosition;
    function getShapePositionInXY(sheet, row, col) {
        var x = 20, y = 20; // default offset
        for (var c = 0; c < col; c++) {
            x += sheet.getColumnWidth(c);
        }
        for (var r = 0; r < row; r++) {
            y += sheet.getRowHeight(r);
        }
        return { x: x, y: y };
    }
    utils.getShapePositionInXY = getShapePositionInXY;
    designer.shapeHelper = utils;
}());