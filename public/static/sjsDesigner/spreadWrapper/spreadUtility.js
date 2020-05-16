(function () {
    'use strict';

    var designer = GC.Spread.Sheets.Designer;
    var SpreadUtility = (function () {
        function SpreadUtility() {
        }

        SpreadUtility.getRangeType = function (range) {
            if (!range) {
                return -1;
            }
            if (range.col === -1 && range.row === -1) {
                return 3 /* Sheet */;
            } else if (range.col === -1) {
                return 1 /* Row */;
            } else if (range.row === -1) {
                return 0 /* Column */;
            } else {
                return 2 /* Cell */;
            }
        };
        return SpreadUtility;
    })();
    designer.SpreadUtility = SpreadUtility;

    (function (RangeType) {
        RangeType[RangeType["Column"] = 0] = "Column"; /* NOSONAR: AssignmentWithinCondition */
        RangeType[RangeType["Row"] = 1] = "Row"; /* NOSONAR: AssignmentWithinCondition */
        RangeType[RangeType["Cell"] = 2] = "Cell"; /* NOSONAR: AssignmentWithinCondition */
        RangeType[RangeType["Sheet"] = 3] = "Sheet"; /* NOSONAR: AssignmentWithinCondition */
        designer.RangeType = RangeType;
    })(designer.RangeType || ({}));

})();