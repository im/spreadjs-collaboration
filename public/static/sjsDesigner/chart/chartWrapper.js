(function () {
    'use strict';

    //#region overwrite chart's to json and from json
    var oldToJSON = GC.Spread.Sheets.Charts.Chart.prototype.toJSON;
    GC.Spread.Sheets.Charts.Chart.prototype.toJSON = function () {
        var _this = this;
        var returnValue = oldToJSON.call(_this);
        var colorAndStyle = this.colorAndStyle;
        if (colorAndStyle) {
            returnValue.colorAndStyle = colorAndStyle;
        }
        return returnValue;
    };

    var oldFromJSON = GC.Spread.Sheets.Charts.Chart.prototype.fromJSON;
    GC.Spread.Sheets.Charts.Chart.prototype.fromJSON = function (chartData, noSchame) {
        var _this = this;
        oldFromJSON.call(_this, chartData, noSchame);
        var colorAndStyleJSON = chartData.colorAndStyle;
        if (colorAndStyleJSON) {
            _this.colorAndStyle = colorAndStyleJSON;
        }
    };
    //#endregion
})();