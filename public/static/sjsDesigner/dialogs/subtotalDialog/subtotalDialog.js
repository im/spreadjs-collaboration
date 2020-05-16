var designer = GC.Spread.Sheets.Designer;
var colHeader = GC.Spread.Sheets.SheetArea.colHeader;
var SJRange = GC.Spread.Sheets.Range;
var SUBTOTAL_HTML_PATH = '../dialogs/subtotalDialog';
var SUBTOTAL_HTML_FILE_NAME = 'subtotalDialog.html';

var SubtotalDialog = (function (_super) {
    designer.extends(SubtotalDialog, _super);

    function SubtotalDialog() {
        _super.call(this, designer.util.resolveHtmlPath(SUBTOTAL_HTML_PATH, SUBTOTAL_HTML_FILE_NAME), '.subtotal-dialog');
    }

    SubtotalDialog.prototype._initOptions = function () {
        var self = this;
        var options = {};
        return {
            resizable: false,
            width: 'auto',
            modal: true,
            title: designer.res.subtotalDialog.title,
            buttons: [
                {
                    text: designer.res.subtotalDialog.remove,
                    click: function () {
                        designer.actions.doAction("removeSubtotal", designer.wrapper.spread, { range: self.range });
                        self.close();
                        designer.wrapper.setFocusToSpread();
                    }
                },
                {
                    text: designer.res.ok,
                    click: function () {
                        options.groupColIndex = Number(self._element.find('#groupNameSelection')[0].value);

                        // formulaNumber represent the calc category of formula subtotal
                        options.formulaNumber = self._element.find('#subtotalFormulaItem')[0].value;
                        options.isReplace = self._element.find('#replaceCurrent')[0].checked;
                        options.breakPageByGroups = self._element.find('#breakPageByGroups')[0].checked;
                        options.summaryBelowData = self._element.find('#summaryBelowData')[0].checked;

                        options.subtotalItem = [];
                        self._element.find('#subtotalGroupNames').children('input').each(function (index, item) {
                            options.subtotalItem.push({
                                index: item.id.split('-')[1],
                                isChecked: item.checked
                            });
                        });

                        options.range = self.range;
                        designer.actions.doAction("addSubtotal", designer.wrapper.spread, options);
                        self.close();
                        designer.wrapper.setFocusToSpread();
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

    SubtotalDialog.prototype._beforeOpen = function () {
        this.sheet = designer.wrapper.spread.getActiveSheet();
        var selection = this.sheet.getSelections()[0];
        this.range = new SJRange(selection.row, selection.col, selection.rowCount, selection.colCount);
        this.titles = [];
        this._formatTitleLabel();
        this._insertItemsToDialog();
    };

    SubtotalDialog.prototype._insertItemsToDialog = function () {
        var groupNameSelectionInnerHTML = '';
        var subtotalItemSelectionInnerHTML = '';
        var subtotalItemSelectionSnippet;
        var titleArrLength = this.titles.length;

        for (var i = 0, colIndex = this.range.col; i < titleArrLength; colIndex++ , i++) {
            groupNameSelectionInnerHTML += '<option value=' + colIndex + '>' + this.titles[i] + '</option>';
            subtotalItemSelectionSnippet = i === titleArrLength - 1
                ? '<input type="checkbox" id="subtotalItem-' + colIndex + '" checked>'
                : '<input type="checkbox" id="subtotalItem-' + colIndex + '">';
            subtotalItemSelectionInnerHTML += subtotalItemSelectionSnippet +
                '<label for="subtotalItem-' + colIndex + '">' + this.titles[i] + '</label>';
        }

        this._element.find('#groupNameSelection').html(groupNameSelectionInnerHTML);
        this._element.find('#subtotalGroupNames').html(subtotalItemSelectionInnerHTML);
    };

    SubtotalDialog.prototype._formatTitleLabel = function () {
        var dialogDisplayTitles = [];
        var cellValue;
        var colTitleValue;
        for (var i = 0; i < this.range.colCount; i++) {
            colTitleValue = this.sheet.getValue(this.range.row, this.range.col + i);
            cellValue = colTitleValue ? colTitleValue : '(Column ' + this.sheet.getValue(0, this.range.col + i, colHeader) + ')';
            dialogDisplayTitles.push(cellValue);
        }

        // If only exists one column, there has no duplicate title
        this.titles = dialogDisplayTitles.length > 1 ? this._markDuplicateTitle(dialogDisplayTitles) : dialogDisplayTitles;
    };

    SubtotalDialog.prototype._markDuplicateTitle = function (arr) {
        var duplicatedItems = {};
        for (var i = 0, key, len = arr.length; i < len; i++) {
            key = arr[i];
            if (!duplicatedItems[key]) {
                duplicatedItems[key] = { currentNumber: 1, firstAppearedIndex: i };
            } else {
                if (duplicatedItems[key].currentNumber === 1) {
                    arr[duplicatedItems[key].firstAppearedIndex] = '(1) ' + key;
                }
                duplicatedItems[key].currentNumber += 1;
                arr[i] = '(' + duplicatedItems[key].currentNumber + ') ' + key;
            }
        }

        return arr;
    };
    return SubtotalDialog;
})(designer.BaseDialog);
designer.SubtotalDialog = SubtotalDialog;