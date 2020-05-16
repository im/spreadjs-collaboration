(function () {
    'use strict';

    var keyword_undefined = void 0;

    var Spread = GC.Spread;
    var Sheets = Spread.Sheets;
    var designer = Sheets.Designer;

    var dialog2HtmlPath = designer.util.resolveHtmlPath('../dialogs', 'dialogs2.html');
    var formulaToRanges = Spread.Sheets.CalcEngine.formulaToRanges;
    function _isUseR1C1() {
        return designer.wrapper.spread.options.referenceStyle === 1;
    }
    function getRangeInfo(sheet, formula, baseRow, baseCol) {
        var result = Sheets.CalcEngine.formulaToRanges(sheet, formula, baseRow, baseCol);
        return result[0];
    }
    function getBuildInCustomList(cultureInfo, buildinlist) {
        var dateTimeFormat = cultureInfo.DateTimeFormat;
        var names, containMonth;
        var buildinKey = ['abbreviatedDayNames', 'dayNames', 'abbreviatedMonthNames', 'monthNames'];
        buildinKey.forEach(function (key) {
            names = dateTimeFormat[key];
            if (names instanceof Array && names.length > 0) {
                containMonth = key.indexOf('month') > -1 || key.indexOf('Month') > -1;
                names = containMonth ? names.slice(0, 12) : names;
                buildinlist.push(names);
            }
        });
        return buildinlist;
    }
    function _checkRangeOfSparkline(sheet, rangeStr, isOneRange, isSingleCell) {  //check the range string has the right value.
        var exRanges = designer.CEUtility.parseExpStringToRanges(rangeStr, sheet);
        var ranges = exRanges && exRanges.length !== 0 && exRanges[0].ranges;
        if (!exRanges
            || (isOneRange && exRanges.length !== 1 && ranges.length !== 1)
            || (isSingleCell && !(ranges[0].rowCount === 1 && ranges[0].colCount === 1)) /* check range is one cell */) {
            designer.MessageBox.show(designer.res.insertSparklineDialog.errorDataRangeMessage, designer.res.title, 3 /* error */, 0 /* ok */);
            return false;
        }
        return true;
    }

    var SparklineDialogHelper = (function () {
        function SparklineDialogHelper() {
        }

        SparklineDialogHelper.parseColorExpression = function (colorExpression, row, col) {
            if (!colorExpression) {
                return null;
            }

            var sheet = designer.wrapper.spread.getActiveSheet();
            if (colorExpression.type === Spread.CalcEngine.ExpressionType.string) {
                return colorExpression.value;
            } else if (colorExpression.type === Spread.CalcEngine.ExpressionType.missingArgument) {
                return null;
            } else {
                var formula = null;
                try {
                    formula = designer.util.unParseFormula(colorExpression, row, col);
                } catch (ex) {
                }
                return Sheets.CalcEngine.evaluateFormula(sheet, formula, row, col);
            }
        };
        return SparklineDialogHelper;
    })();

    var FillDialog = (function (_super) {
        designer.extends(FillDialog, _super);
        function FillDialog() {
            _super.call(this, (dialog2HtmlPath), '.fill-dialog');
        }

        FillDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                title: designer.res.seriesDialog.series,
                modal: true,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.fill();
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

        FillDialog.prototype._init = function () {
            this._seriesColumns = this._element.find("#series-columns");
            this._seriesRows = this._element.find("#series-rows");
            this._typeLinear = this._element.find("#type-linear");
            this._typeGrowth = this._element.find("#type-growth");
            this._typeDate = this._element.find("#type-date");
            this._typeAutofill = this._element.find("#type-autofill");
            this._dateDay = this._element.find("#date-day");
            this._dateWeekDay = this._element.find("#date-weekday");
            this._dateMonth = this._element.find("#date-month");
            this._dateYear = this._element.find("#date-year");
            this._seriesTrend = this._element.find("#series-trend");
            this._stepValue = this._element.find("#step-value");
            this._stopValue = this._element.find("#stop-value");

            this._fillSeries = 0 /* Column */;
            this._fillType = 1 /* Linear */;
            this._fillDateUnit = 0 /* Day */;

            this._seriesColumns.prop("checked", true);
            this._typeLinear.prop("checked", true);
            this._dateDay.prop("checked", true);
            this._stepValue.val(1);
            this._disableDate();

            var self = this;
            this._seriesColumns.on("click", function () {
                self._fillSeries = 0 /* Column */;
            });
            this._seriesRows.on("click", function () {
                self._fillSeries = 1 /* Row */;
            });
            this._typeLinear.on("click", function () {
                if (!self._seriesTrend.prop("checked")) {
                    self._disableDate();
                    self._enableStepStop();
                }
                self._fillType = 1 /* Linear */;
            });
            this._typeGrowth.on("click", function () {
                if (!self._seriesTrend.prop("checked")) {
                    self._disableDate();
                    self._enableStepStop();
                }
                self._fillType = 2 /* Growth */;
            });
            this._typeAutofill.on("click", function () {
                self._disableDate();
                self._disableStepStop();
                self._fillType = 4 /* Auto */;
            });
            this._typeDate.on("click", function () {
                self._enableDate();
                self._enableStepStop();
                self._fillType = 3 /* Date */;
            });
            this._seriesTrend.on("change", function () {
                if ($(this).prop("checked")) {
                    self._enableTrend();
                    self._fillType = 1 /* Linear */;
                } else {
                    self._disableTrend();
                }
            });
            this._dateDay.on("click", function () {
                self._fillDateUnit = 0 /* Day */;
            });
            this._dateWeekDay.on("click", function () {
                self._fillDateUnit = 1 /* Weekday */;
            });
            this._dateMonth.on("click", function () {
                self._fillDateUnit = 2 /* Month */;
            });
            this._dateYear.on("click", function () {
                self._fillDateUnit = 3 /* Year */;
            });
        };

        FillDialog.prototype._disableDate = function () {
            this._dateDay.attr("disabled", "disabled");
            this._dateWeekDay.attr("disabled", "disabled");
            this._dateMonth.attr("disabled", "disabled");
            this._dateYear.attr("disabled", "disabled");
        };
        FillDialog.prototype._enableDate = function () {
            this._dateDay.removeAttr("disabled");
            this._dateWeekDay.removeAttr("disabled");
            this._dateMonth.removeAttr("disabled");
            this._dateYear.removeAttr("disabled");
        };
        FillDialog.prototype._disableStepStop = function () {
            this._stepValue.attr("disabled", "disabled");
            this._stopValue.attr("disabled", "disabled");
        };
        FillDialog.prototype._enableStepStop = function () {
            this._stepValue.removeAttr("disabled");
            this._stopValue.removeAttr("disabled");
        };
        FillDialog.prototype._disableTrend = function () {
            this._typeDate.removeAttr("disabled");
            this._typeAutofill.removeAttr("disabled");
            this._enableStepStop();
        };
        FillDialog.prototype._enableTrend = function () {
            this._typeLinear.prop("checked", true);
            this._typeLinear.removeAttr("disabled");
            this._typeGrowth.removeAttr("disabled");
            this._typeDate.attr("disabled", "disabled");
            this._typeAutofill.attr("disabled", "disabled");
            this._disableDate();
            this._disableStepStop();
        };

        FillDialog.prototype._getStartRange = function (sheet, isColumnSeries, wholeRange) {
            var r = wholeRange.row, c = wholeRange.col, rc = wholeRange.rowCount, cc = wholeRange.colCount;
            var count = 0, nonNullCount, startRange;
            if (isColumnSeries) {
                while (count < rc) {
                    nonNullCount = rc - count;
                    var rowIndex = r + nonNullCount - 1;
                    if (sheet.getValue(rowIndex, c)) {
                        break;
                    }
                    count++;
                }
                startRange = new Sheets.Range(r, c, nonNullCount, cc);
            } else {
                while (count < cc) {
                    nonNullCount = cc - count;
                    var colIndex = c + nonNullCount - 1;
                    if (sheet.getValue(r, colIndex)) {
                        break;
                    }
                    count++;
                }
                startRange = new Sheets.Range(r, c, rc, nonNullCount);
            }
            return startRange;
        };
        FillDialog.prototype.fill = function () {
            var spread = designer.wrapper.spread;
            var sheet = spread.getActiveSheet();
            sheet.suspendPaint();
            sheet.suspendCalcService();
            var selections = sheet.getSelections(), actionOptionList = [];
            for (var i = 0; i < selections.length; i++) {
                var wholeRange = selections[i];
                var startRange = this._getStartRange(sheet, this._fillSeries === 0 /* Column */, wholeRange);

                var fillAutoOptions;

                if (this._seriesTrend.prop("checked")) {
                    switch (this._fillType) {
                        case 1 /* Linear */
                            :
                            fillAutoOptions = {
                                fillType: 1 /* liner*/,
                                series: this._fillSeries
                            };
                            break;
                        case 2 /* Growth */
                            :
                            fillAutoOptions = {
                                fillType: 2 /* growth*/,
                                series: this._fillSeries
                            };
                            break;
                    }
                } else {
                    var stepValue = Number(this._stepValue.val());
                    var stopValue = this._stopValue.val();
                    switch (this._fillType) {
                        case 1 /* Linear */
                            :
                            if (!stopValue) {
                                fillAutoOptions = {
                                    fillType: 1 /*liner*/,
                                    series: this._fillSeries,
                                    step: stepValue
                                };
                            } else {
                                stopValue = Number(this._stopValue.val());
                                fillAutoOptions = {
                                    fillType: 1 /*liner*/,
                                    series: this._fillSeries,
                                    step: stepValue,
                                    stop: stopValue
                                };
                            }
                            break;
                        case 2 /* Growth */
                            :
                            if (!stopValue) {
                                fillAutoOptions = {
                                    fillType: 2 /*growth*/,
                                    series: this._fillSeries,
                                    step: stepValue
                                };
                            } else {
                                stopValue = Number(this._stopValue.val());
                                fillAutoOptions = {
                                    fillType: 2 /*growth*/,
                                    series: this._fillSeries,
                                    step: stepValue,
                                    stop: stopValue
                                };
                            }
                            break;
                        case 4 /* Auto */
                            :
                            fillAutoOptions = {
                                fillType: 4/*auto*/,
                                series: this._fillSeries
                            };
                            break;
                        case 3 /* Date */
                            :
                            if (!stopValue) {
                                fillAutoOptions = {
                                    fillType: 3 /*date*/,
                                    series: this._fillSeries,
                                    step: stepValue,
                                    unit: this._fillDateUnit
                                };
                            } else {
                                stopValue = new Date(this._stopValue.val());
                                fillAutoOptions = {
                                    fillType: 3 /*date*/,
                                    series: this._fillSeries,
                                    step: stepValue,
                                    stop: stopValue,
                                    unit: this._fillDateUnit
                                };
                            }
                            break;
                    }
                }
                var actionOption = {
                    startRange: startRange,
                    wholeRange: wholeRange,
                    fillAutoOptions: fillAutoOptions
                };
                actionOptionList.push(actionOption);
            }
            designer.actions.doAction("autoFillByDirection", spread, actionOptionList);
            sheet.resumePaint();
            sheet.resumeCalcService();
        };
        return FillDialog;
    })(designer.BaseDialog);
    designer.FillDialog = FillDialog;

    var SortOptionDialog = (function (_super) {
        designer.extends(SortOptionDialog, _super);
        function SortOptionDialog(caller) {
            _super.call(this, (dialog2HtmlPath), '.sort-option-dialog');
            this._caller = caller;
        }

        SortOptionDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                modal: true,
                title: designer.res.customSortDialog.sortOptions,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._caller._setByRows(self._byRows);
                            self.close();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                        }
                    }
                ]
            };
        };

        SortOptionDialog.prototype._init = function () {
            var self = this;
            this._byRows = true;
            this._element.find("#sort-byrows").prop("checked", true).click(function () {
                self._byRows = true;
            });
            this._element.find("#sort-bycols").click(function () {
                self._byRows = false;
            });
        };
        return SortOptionDialog;
    })(designer.BaseDialog);
    designer.SortOptionDialog = SortOptionDialog;

    var SortDialog = (function (_super) {
        designer.extends(SortDialog, _super);
        function SortDialog() {
            _super.call(this, (dialog2HtmlPath), '.sort-dialog');
        }

        SortDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                modal: true,
                title: designer.res.customSortDialog.sort,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.sort();
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

        SortDialog.prototype._beforeOpen = function () {
            this._sortByOptions = this._getSortByOptions();
            this._element.find(".sort-infolist").empty();
            this._addLevel();
        };

        SortDialog.prototype._getSortByOptions = function () {
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            var activeSelection = this.getActiveSelection(activeSheet);
            if (!activeSelection) {
                return null;
            }
            var res = designer.res.customSortDialog;
            var sortBy = $("<select><select>");
            var i, option;
            sortBy.addClass("sort-row-sortby");
            if (this._byRows) {
                var startCol = activeSelection.col;
                startCol = startCol === -1 ? 0 : startCol;
                for (i = 0; i < activeSelection.colCount; i++) {
                    option = $("<option></option>");
                    option.text(res.column + activeSheet.getCell(activeSheet.getRowCount(1 /* colHeader */) - 1, startCol + i, 1 /* colHeader */).text());
                    option.val(startCol + i);
                    sortBy.append(option);
                }
            } else {
                var startRow = activeSelection.row;
                startRow = startRow === -1 ? 0 : startRow;
                for (i = 0; i < activeSelection.rowCount; i++) {
                    option = $("<option></option>");
                    option.text(res.row + (startRow + i + 1).toString());
                    option.val(startRow + i);
                    sortBy.append(option);
                }
            }
            return sortBy;
        };

        SortDialog.prototype._init = function () {
            var self = this;
            this._byRows = true;
            this._ascending = true;
            this._element.find("#add-level").on("click", function () {
                self._addLevel();
            });
            this._element.find("#delete-level").on("click", function () {
                self._deleteLevel();
            });
            this._element.find("#copy-level").on("click", function () {
                self._copyLevel();
            });
            this._element.find("#move-up").on("click", function () {
                self._moveUp();
            });
            this._element.find("#move-down").on("click", function () {
                self._moveDown();
            });
            this._element.find("#sort-options").on("click", function () {
                self._sortOption();
            });
        };

        SortDialog.prototype._addLevel = function () {
            var sortInfoDIV = $("<Div></Div>").addClass("sort-info").appendTo(this._element.find(".sort-infolist"));
            var res = designer.res.customSortDialog;

            //Apppend row header label
            if (sortInfoDIV.parent().children().length === 1) {
                this._activeSortInfo = sortInfoDIV;
                this._activeSortInfo.addClass("ui-state-default-special ui-state-default");
                sortInfoDIV.append($("<label></label>").addClass("sort-row-header").text(res.sortBy2));
            } else {
                sortInfoDIV.append($("<label></label>").addClass("sort-row-header").text(res.thenBy));
            }

            //Append sort by
            if (this._sortByOptions) {
                sortInfoDIV.append(this._sortByOptions.clone(true));
            }

            //Append sort on
            sortInfoDIV.append($("<select></select>").addClass("sort-column").append($("<option>Values</option>")));

            //Append sort order
            sortInfoDIV.append($("<select></select>").addClass("sort-column sort-order").append($("<option>A to Z</option><option>Z to A</option>")));

            //Append clear-both
            sortInfoDIV.append($("<div></div>").addClass("clear-float"));
            var self = this;
            sortInfoDIV.click(function () {
                self._activeSortInfo.removeClass("ui-state-default");
                self._activeSortInfo = $(this);
                self._activeSortInfo.addClass("ui-state-default");
            });
        };

        SortDialog.prototype._deleteLevel = function () {
            var temp = this._activeSortInfo;
            this._activeSortInfo = temp.prev();
            if (this._activeSortInfo.length === 0) {
                this._activeSortInfo = temp.next();
                this._activeSortInfo.find(".sort-row-header").text(designer.res.customSortDialog.sortBy2);
            }
            this._activeSortInfo.addClass("ui-state-default");
            temp.remove();
        };

        SortDialog.prototype._copyLevel = function () {
            var copy = this._activeSortInfo.clone(true);
            if (this._activeSortInfo.prev().length === 0) {
                copy.find(".sort-row-header").text(designer.res.customSortDialog.thenBy);
            }

            //Here, JQuery has a bug, it doesn't close Select's value.
            copy.find(".sort-row-sortby").val(this._activeSortInfo.find(".sort-row-sortby").val());
            copy.find(".sort-order").val(this._activeSortInfo.find(".sort-order").val());

            this._activeSortInfo.after(copy);
            this._activeSortInfo.removeClass("ui-state-default");
            this._activeSortInfo = this._activeSortInfo.next();
        };

        SortDialog.prototype._moveUp = function () {
            this._activeSortInfo.prev().before(this._activeSortInfo);
            this._updateSortHeader();
        };

        SortDialog.prototype._moveDown = function () {
            this._activeSortInfo.next().after(this._activeSortInfo);
            this._updateSortHeader();
        };

        SortDialog.prototype._sortOption = function () {
            var self = this;
            if (!this._sortOptionDialog) {
                this._sortOptionDialog = new SortOptionDialog(self);
            }
            this._sortOptionDialog.open();
        };

        SortDialog.prototype._setByRows = function (value) {
            if (this._byRows === value) {
                return;
            } else {
                this._byRows = value;
                this._sortByOptions = this._getSortByOptions();
                this._element.find(".sort-infolist").empty();
                this._addLevel();
            }
        };

        SortDialog.prototype._updateSortHeader = function () {
            this._element.find(".sort-infolist").children().each(function (index, elem) {
                if (index === 0) {
                    $(elem).find(".sort-row-header").text(designer.res.customSortDialog.sortBy2);
                } else {
                    $(elem).find(".sort-row-header").text(designer.res.customSortDialog.thenBy);
                }
            });
        };

        SortDialog.prototype.sort = function () {
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            var activeSelection = this.getActiveSelection(activeSheet);
            var sortInfoList = this._element.find(".sort-infolist");
            var sortInfos = [];
            if (sortInfoList.length === 0) {
                return;
            }
            sortInfoList.children().each(function (i, ele) {
                var asc = true;
                if ($(ele).find(".sort-order").val() === "Z to A") {
                    asc = false;
                }
                var index = $(ele).find(".sort-row-sortby").val();
                var info = { index: index, ascending: asc };
                sortInfos.push(info);
            });

            if (activeSelection) {
                designer.actions.doAction('sortCustomRange', designer.wrapper.spread, {
                    byRows: this._byRows,
                    sortInfos: sortInfos
                });
            }
        };
        return SortDialog;
    })(designer.BaseDialog);
    designer.SortDialog = SortDialog;

    var SpreadSettingDialog = (function (_super) {
        designer.extends(SpreadSettingDialog, _super);
        function SpreadSettingDialog() {
            _super.call(this, (dialog2HtmlPath), '.spread-setting-dialog');
        }

        SpreadSettingDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                modal: true,
                resizable: false,
                title: designer.res.spreadSettingDialog.spreadSetting,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
                            designer.actions.isFileModified = true;
                            self.close();
                            designer.wrapper.setFocusToSpread();
                            designer.ribbon.updateShowHide();
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

        SpreadSettingDialog.prototype._init = function () {
            var self = this;
            self.settingTab = self._element.find(".spread-setting-tab").tabs();
            var category = self._element.find("#fill-custom-lists");
            var viewTxt = self._element.find("#fill-custom-list-view");
            var addBtn = self._element.find("#fill-custom-list-add");
            var delBtn = self._element.find("#fill-custom-list-delete");
            delBtn.attr("disabled", true);
            category.change(function (evt) {
                var srcElement = evt.target || evt.srcElement;
                var index = parseInt(srcElement.value);
                var str = "", list = [];
                self._selectCustomListIndex = index;
                if (index < 0) {
                    list = self._fillBuildinList[-1 - index];
                    viewTxt.attr("disabled", true);
                    addBtn.attr("disabled", true);
                    delBtn.attr("disabled", true);
                } else if (index === 0) {
                    viewTxt.attr("disabled", false);
                    addBtn.attr("disabled", false);
                    delBtn.attr("disabled", true);
                } else {
                    list = self._fillCustomList[index - 1];
                    viewTxt.attr("disabled", false);
                    addBtn.attr("disabled", false);
                    delBtn.attr("disabled", false);
                }
                str = list && list[0];
                for (var i = 1; i < list.length; i++) {
                    str += "\r\n" + list[i];
                }
                viewTxt.val(str);
            });
            addBtn.click(function () {
                var v = viewTxt.val();
                var arr = v.split(/(,|,\n|\n)/);
                for (var i = 0; i < arr.length;) {
                    arr[i] = arr[i].trim();
                    if (arr[i] === "" || arr[i] === ",") {
                        arr.splice(i, 1);
                    } else {
                        i++;
                    }
                }
                var str = arr.toString();
                if (str === "") {
                    return;
                }
                for (var k = 0; k < self._fillBuildinList.length; k++) {
                    if (str === self._fillBuildinList[k].toString()) { //check the list wether have same list
                        return;
                    }
                }
                for (var j = 0; j < self._fillCustomList.length; j++) {
                    if (str === self._fillCustomList[j].toString()) {
                        return;
                    }
                }
                var index = self._selectCustomListIndex;
                if (index === 0) {
                    self._fillCustomList.push(arr);
                    designer.wrapper.spread.options.customList = self._fillCustomList;
                } else if (index > 0) {
                    self._fillCustomList[index - 1] = arr;
                    designer.wrapper.spread.options.customList = self._fillCustomList;
                }
                self._refreshCustomLists();
            });
            delBtn.click(function () {
                if (self._selectCustomListIndex > 0) {
                    designer.MessageBox.show(designer.res.spreadSettingDialog.deleteNotification, designer.res.title, 2 /* warning */, 1 /* yesNo */, function (evt, result) {
                        if (result === 1 /* OK */) {
                            var index = self._selectCustomListIndex;
                            if (index > 0) {
                                self._fillCustomList.splice(index - 1, 1);
                                designer.wrapper.spread.options.customList = self._fillCustomList;
                            }
                            self._refreshCustomLists();
                        }
                    });
                }
            });
            addBtn.hover(function () {
                $(this).addClass("ui-state-hover");
            }, function () {
                $(this).removeClass("ui-state-hover");
            });
            delBtn.hover(function () {
                $(this).addClass("ui-state-hover");
            }, function () {
                $(this).removeClass("ui-state-hover");
            });
            viewTxt.on('keypress', function (e) {
                if (e.keyCode === 13) {
                    e.stopPropagation();
                }
            });
        };
        SpreadSettingDialog.prototype._refreshCustomLists = function () {
            //get buildin custom lists
            var cm = GC.Spread.Common.CultureManager;
            var buildinlist = [];
            var en = cm.getCultureInfo('en-US'), setting = cm.getCultureInfo();
            getBuildInCustomList(en, buildinlist);
            if (setting && en !== setting) {
                getBuildInCustomList(setting, buildinlist);
            }
            this._fillBuildinList = buildinlist;
            var list = this._element.find("#fill-custom-lists");
            var listOptions = list[0].options;
            list.empty();
            listOptions.add(new Option(designer.res.spreadSettingDialog.newList, 0, true, true));
            for (var i = 0; i < buildinlist.length; i++) {
                listOptions.add(new Option(buildinlist[i].toString(), -1 - i)); // the buildin options value is -1,-2,...
            }
            var customList = designer.wrapper.spread.options.customList || [];
            this._fillCustomList = customList;
            for (var j = 0; j < customList.length; j++) {
                listOptions.add(new Option(customList[j].toString(), j + 1)); // the buildin custom list value 1,2,3...
            }
            this._selectCustomListIndex = 0;
            var viewTxt = this._element.find("#fill-custom-list-view");
            viewTxt.val("");
        };
        SpreadSettingDialog.prototype._beforeOpen = function (args) {
            var headerOptions = ['noHeaders', 'rowHeaders', 'columnHeaders', 'allHeaders'];
            var tabIndex;
            switch (args[0]) {
                case "general":
                    tabIndex = 0;
                    break;
                case "scrollbar":
                    tabIndex = 1;
                    break;
                case "calculation":
                    tabIndex = 2;
                    break;
                case "tabstrip":
                    tabIndex = 3;
                    break;
            }
            this.settingTab.tabs("option", "active", tabIndex);
            this._element.find("#setting-dragmerge").prop("checked", designer.wrapper.spread.options.allowUserDragMerge);
            this._element.find("#setting-dropdrop").prop("checked", designer.wrapper.spread.options.allowUserDragDrop);
            this._element.find("#setting-dragfill").prop("checked", designer.wrapper.spread.options.allowUserDragFill);
            this._element.find("#setting-undo").prop("checked", designer.wrapper.spread.options.allowUndo);
            this._element.find("#setting-formula").prop("checked", designer.wrapper.spread.options.allowUserEditFormula);
            this._element.find("#setting-zoom").prop("checked", designer.wrapper.spread.options.allowUserZoom);
            this._element.find("#setting-dynamicarray").prop("checked", designer.wrapper.spread.options.allowDynamicArray);
            this._element.find("#setting-overflow").prop("checked", designer.wrapper.spread.getActiveSheet().options.allowCellOverflow);
            this._element.find("#setting-scrollByPixel").prop("checked", designer.wrapper.spread.options.scrollByPixel);
            var settingScrollPixel = this._element.find("#setting-scrollPixel");
            settingScrollPixel.spinner({ min: 1 });
            settingScrollPixel.val(designer.wrapper.spread.options.scrollPixel);
            this._element.find("#setting-rowResizeMode").val(designer.wrapper.spread.options.rowResizeMode);
            this._element.find("#setting-columnResizeMode").val(designer.wrapper.spread.options.columnResizeMode);

            this._element.find("#setting-vertical-scrollbar").prop("checked", designer.wrapper.spread.options.showVerticalScrollbar);
            this._element.find("#setting-horizontal-scrollbar").prop("checked", designer.wrapper.spread.options.showHorizontalScrollbar);
            this._element.find("#setting-scrollbar-showmax").prop("checked", designer.wrapper.spread.options.scrollbarShowMax);
            this._element.find("#setting-scrollbar-maxalign").prop("checked", designer.wrapper.spread.options.scrollbarMaxAlign);

            this._element.find("#setting-tab-visible").prop("checked", designer.wrapper.spread.options.tabStripVisible);
            this._element.find("#setting-new-tab").prop("checked", designer.wrapper.spread.options.newTabVisible);
            this._element.find("#setting-tab-edit").prop("checked", designer.wrapper.spread.options.tabEditable);
            var settingTabRatio = this._element.find("#setting-tab-ratio");
            settingTabRatio.spinner();
            settingTabRatio.val(Math.round(designer.wrapper.spread.options.tabStripRatio * 100));

            this._element.find("#setting-copyExcelStyle").prop("checked", designer.wrapper.spread.options.allowCopyPasteExcelStyle);
            this._element.find("#setting-copyExtendRange").prop("checked", designer.wrapper.spread.options.allowExtendPasteRange);
            var headerOption = headerOptions[designer.wrapper.spread.options.copyPasteHeaderOptions];
            this._element.find('input[type="radio"][name="headerOptions"]').each(function (index, radio) {
                if ($(radio).val() === headerOption) {
                    $(radio).attr("checked", "checked");
                }
            });
            this._refreshCustomLists();
            this._element.find("input[name='reference-style']").each(function (i, ele) {
                if ($(ele).val() === designer.wrapper.spread.options.referenceStyle.toString()) {
                    $(ele).prop("checked", true);
                }
            });
        };
        SpreadSettingDialog.prototype._applySetting = function () {
            designer.wrapper.spread.options.allowUserDragMerge = this._element.find("#setting-dragmerge").prop("checked");
            designer.wrapper.spread.options.allowUserDragDrop = this._element.find("#setting-dropdrop").prop("checked");
            designer.wrapper.spread.options.allowUserDragFill = this._element.find("#setting-dragfill").prop("checked");
            designer.wrapper.spread.options.allowUndo = this._element.find("#setting-undo").prop("checked");
            designer.wrapper.spread.options.allowUserEditFormula = this._element.find("#setting-formula").prop("checked");
            designer.wrapper.spread.options.allowUserZoom = this._element.find("#setting-zoom").prop("checked");
            for (var i = 0; i < designer.wrapper.spread.sheets.length; i++) {
                designer.wrapper.spread.sheets[i].options.allowCellOverflow = this._element.find("#setting-overflow").prop("checked");
            }
            designer.wrapper.spread.options.allowDynamicArray = this._element.find("#setting-dynamicarray").prop("checked");
            designer.wrapper.spread.options.scrollByPixel = this._element.find("#setting-scrollByPixel").prop("checked");
            designer.wrapper.spread.options.scrollPixel = Math.max(1, parseInt(this._element.find("#setting-scrollPixel").val()));
            designer.wrapper.spread.options.rowResizeMode = parseInt(this._element.find("#setting-rowResizeMode").val());
            designer.wrapper.spread.options.columnResizeMode = parseInt(this._element.find("#setting-columnResizeMode").val());

            designer.wrapper.spread.options.showVerticalScrollbar = this._element.find("#setting-vertical-scrollbar").prop("checked");
            designer.wrapper.spread.options.showHorizontalScrollbar = this._element.find("#setting-horizontal-scrollbar").prop("checked");
            designer.wrapper.spread.options.scrollbarShowMax = this._element.find("#setting-scrollbar-showmax").prop("checked");
            designer.wrapper.spread.options.scrollbarMaxAlign = this._element.find("#setting-scrollbar-maxalign").prop("checked");

            designer.wrapper.spread.options.tabStripVisible = this._element.find("#setting-tab-visible").prop("checked");
            designer.wrapper.spread.options.newTabVisible = this._element.find("#setting-new-tab").prop("checked");
            designer.wrapper.spread.options.tabEditable = this._element.find("#setting-tab-edit").prop("checked");
            var ratio = this._element.find("#setting-tab-ratio").val();
            if ($.isNumeric(ratio)) {
                designer.wrapper.spread.options.tabStripRatio = ratio / 100;
            }
            designer.wrapper.spread.options.allowCopyPasteExcelStyle = this._element.find("#setting-copyExcelStyle").prop("checked");
            designer.wrapper.spread.options.allowExtendPasteRange = this._element.find("#setting-copyExtendRange").prop("checked");
            designer.wrapper.spread.options.copyPasteHeaderOptions = GC.Spread.Sheets.CopyPasteHeaderOptions[this._element.find('input[type="radio"][name="headerOptions"]:checked').val()];
            designer.wrapper.spread.options.referenceStyle = Number(this._element.find("input[name='reference-style']:checked").val());
        };
        return SpreadSettingDialog;
    })(designer.BaseDialog);
    designer.SpreadSettingDialog = SpreadSettingDialog;

    var SheetSettingDialog = (function (_super) {
        designer.extends(SheetSettingDialog, _super);
        function SheetSettingDialog() {
            _super.call(this, (dialog2HtmlPath), '.sheet-setting-dialog');
        }

        SheetSettingDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                modal: true,
                resizable: false,
                title: designer.res.sheetSettingDialog.sheetSetting,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.close();
                            self._applySetting();
                            designer.actions.isFileModified = true;
                            designer.wrapper.setFocusToSpread();
                            designer.ribbon.updateShowHide();
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

        SheetSettingDialog.prototype._init = function () {
            var self = this;
            this._element.find(".sheet-setting-tab").tabs();
            this._element.find(".header-setting-tab").tabs();

            this._element.find("#sheet-column-count").spinner();
            this._element.find("#sheet-row-count").spinner();
            this._element.find("#frozen-column-count").spinner();
            this._element.find("#frozen-row-count").spinner();
            this._element.find("#trailing-column-count").spinner();
            this._element.find("#trailing-row-count").spinner();
            this._element.find("#header-row-count").spinner();
            this._element.find("#header-row-autoindex").spinner();
            this._element.find("#header-row-default-width").spinner();
            this._element.find("#header-column-count").spinner();
            this._element.find("#header-column-autoindex").spinner();
            this._element.find("#header-column-default-height").spinner();

            //Grid line Color
            this._element.find("#gridline-color-picker").colorpicker({
                valueChanged: function (e, value) {
                    if (value.color === undefined) {
                        self._element.find('#gridline-color-span').css('background-color', "");
                    } else {
                        self._element.find('#gridline-color-span').css('background-color', value.color);
                    }
                },
                choosedColor: function (e, value) {
                    self._element.find('#gridline-color-frame').comboframe('close');
                },
                openColorDialog: function (e, value) {
                    self._element.find('#gridline-color-frame').comboframe('close');
                },
                showNoFill: false
            });
            this._element.find("#gridline-color-frame").comboframe();

            //Sheet Tab Color
            this._element.find("#sheettab-color-picker").colorpicker({
                valueChanged: function (e, value) {
                    if (value.color === undefined) {
                        self._element.find('#sheettab-color-span').css('background-color', "");
                    } else {
                        self._element.find('#sheettab-color-span').css('background-color', value.color);
                    }
                },
                choosedColor: function (e, value) {
                    self._element.find('#sheettab-color-frame').comboframe('close');
                },
                openColorDialog: function (e, value) {
                    self._element.find('#sheettab-color-frame').comboframe('close');
                },
                showNoFill: false
            });
            this._element.find("#sheettab-color-frame").comboframe();

            this._element.find("#reference-A1").on("click", function () {
                self._element.find("#header-column-autotext-letters").prop("checked", true);
            });
            this._element.find("#reference-R1C1").on("click", function () {
                self._element.find("#header-column-autotext-numbers").prop("checked", true);
            });
        };


        SheetSettingDialog.prototype._beforeOpen = function (args) {
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            var colorItem;
            $("#gridline-color-picker").colorpicker({ themeColors: designer.wrapper.getThemeColors() });
            $("#sheettab-color-picker").colorpicker({ themeColors: designer.wrapper.getThemeColors() });
            var tabIndex;
            switch (args[0]) {
                case "general":
                    tabIndex = 0;
                    break;
                case "gridline":
                    tabIndex = 1;
                    break;
                case "calculation":
                    tabIndex = 2;
                    break;
                case "headers":
                    tabIndex = 3;
                    break;
                case "sheettab":
                    tabIndex = 4;
                    break;
            }
            this._element.find(".sheet-setting-tab").tabs("option", "active", tabIndex);

            //Load Column/Row/Frozen/TrailingFrozen count
            this._element.find("#sheet-column-count").val(activeSheet.getColumnCount());
            this._element.find("#sheet-row-count").val(activeSheet.getRowCount());
            this._element.find("#frozen-column-count").val(activeSheet.frozenColumnCount());
            this._element.find("#frozen-row-count").val(activeSheet.frozenRowCount());
            this._element.find("#trailing-column-count").val(activeSheet.frozenTrailingColumnCount());
            this._element.find("#trailing-row-count").val(activeSheet.frozenTrailingRowCount());

            //Load Selection Mode
            this._element.find("input[name='selection-policy']").each(function (i, ele) {
                if ($(ele).val() === activeSheet.selectionPolicy().toString()) {
                    $(ele).prop("checked", true);
                }
            });

            //Load Protect
            this._element.find("#sheet-protect").prop("checked", activeSheet.options.isProtected);

            //Load Gridline
            this._element.find("#gridline-horizontal").prop("checked", activeSheet.options.gridline.showHorizontalGridline);
            this._element.find("#gridline-vertical").prop("checked", activeSheet.options.gridline.showVerticalGridline);
            if (activeSheet.options.gridline.color) {
                colorItem = designer.ColorHelper.parse(activeSheet.options.gridline.color, activeSheet.currentTheme().colors());
                $('#gridline-color-picker').colorpicker('option', 'selectedItem', colorItem);
                this._element.find("#gridline-color-span").css("background-color", colorItem.color);
            } else {
                this._element.find("#gridline-color-span").css("background-color", "transparent");
                $("#gridline-color-picker").colorpicker('option', 'selectedItem', null);
            }

            //Load A1/R1C1

            //Load ColumnHeader setting
            this._element.find("#header-column-count").val(activeSheet.getRowCount(1 /* colHeader */));
            this._element.find("input[name='column-autotext']").each(function (i, ele) {
                if ($(ele).val() === activeSheet.options.colHeaderAutoText.toString()) {
                    $(ele).prop("checked", true);
                }
            });
            this._element.find("#header-column-autoindex").val(activeSheet.options.colHeaderAutoTextIndex);
            this._element.find("#header-column-default-height").val(activeSheet.defaults.colHeaderRowHeight);
            this._element.find("#header-column-visible").prop("checked", activeSheet.options.colHeaderVisible);

            //Load RowHeader setting
            this._element.find("#header-row-count").val(activeSheet.getColumnCount(2 /* rowHeader */));
            this._element.find("input[name='row-autotext']").each(function (i, ele) {
                if ($(ele).val() === activeSheet.options.rowHeaderAutoText.toString()) {
                    $(ele).prop("checked", true);
                }
            });
            this._element.find("#header-row-autoindex").val(activeSheet.options.rowHeaderAutoTextIndex);
            this._element.find("#header-row-default-width").val(activeSheet.defaults.rowHeaderColWidth);
            this._element.find("#header-row-visible").prop("checked", activeSheet.options.rowHeaderVisible);

            //Load Sheet Tab color
            if (activeSheet.options.sheetTabColor) {
                colorItem = designer.ColorHelper.parse(activeSheet.options.sheetTabColor, activeSheet.currentTheme().colors());
                $('#sheettab-color-picker').colorpicker('option', 'selectedItem', colorItem);
                this._element.find("#sheettab-color-span").css("background-color", colorItem.color);
            } else {
                this._element.find("#sheettab-color-span").css("background-color", "transparent");
                $("#sheettab-color-picker").colorpicker('option', 'selectedItem', null);
            }
        };

        SheetSettingDialog.prototype._applySetting = function () {
            var activeSheet = designer.wrapper.spread.getActiveSheet();

            //Suspend layout
            activeSheet.suspendPaint();
            activeSheet.suspendCalcService();

            //Save Column/Row/Frozen/TrailingFrozen count
            activeSheet.setColumnCount(Number(this._element.find("#sheet-column-count").val()));
            activeSheet.setRowCount(Number(this._element.find("#sheet-row-count").val()));
            activeSheet.frozenRowCount(Number(this._element.find("#frozen-row-count").val()));
            activeSheet.frozenColumnCount(Number(this._element.find("#frozen-column-count").val()));
            activeSheet.frozenTrailingRowCount(Number(this._element.find("#trailing-row-count").val()));
            activeSheet.frozenTrailingColumnCount(Number(this._element.find("#trailing-column-count").val()));

            //Save Selection Mode
            activeSheet.selectionPolicy(Number(this._element.find("input[name='selection-policy']:checked").val()));

            //Save Protect
            activeSheet.options.isProtected = this._element.find("#sheet-protect").prop("checked");

            //Save GridLine
            var gridLineColor = $("#gridline-color-picker").colorpicker('option', 'selectedItem');
            if (gridLineColor) {
                activeSheet.options.gridline = {
                    showHorizontalGridline: this._element.find("#gridline-horizontal").prop("checked"),
                    showVerticalGridline: this._element.find("#gridline-vertical").prop("checked"),
                    color: gridLineColor.color
                };
            }

            //Save ReferenceStyle

            //Save ColumnHeader setting
            activeSheet.setRowCount(Number(this._element.find("#header-column-count").val()), 1 /* colHeader */);
            activeSheet.options.colHeaderAutoText = Number(this._element.find("input[name='column-autotext']:checked").val());
            activeSheet.options.colHeaderAutoTextIndex = Number(this._element.find("#header-column-autoindex").val());
            activeSheet.defaults.colHeaderRowHeight = Math.max(Number(this._element.find("#header-column-default-height").val()), 0 /* minHeight */);
            activeSheet.options.colHeaderVisible = this._element.find("#header-column-visible").prop("checked");

            //Save RowHeader setting
            activeSheet.setColumnCount(Number(this._element.find("#header-row-count").val()), 2 /* rowHeader */);
            activeSheet.options.rowHeaderAutoText = Number(this._element.find("input[name='row-autotext']:checked").val());
            activeSheet.options.rowHeaderAutoTextIndex = Number(this._element.find("#header-row-autoindex").val());
            activeSheet.defaults.rowHeaderColWidth = Math.max(Number(this._element.find("#header-row-default-width").val()), 0 /* minWidth */);
            activeSheet.options.rowHeaderVisible = this._element.find("#header-row-visible").prop("checked");

            //Save sheettab color
            var tabColor = $("#sheettab-color-picker").colorpicker('option', 'selectedItem');
            if (tabColor) {
                if (tabColor.name) {
                    activeSheet.options.sheetTabColor = tabColor.name;
                } else {
                    activeSheet.options.sheetTabColor = tabColor.color;
                }
            }

            //Resume layout
            activeSheet.resumeCalcService();
            activeSheet.resumePaint();
        };
        return SheetSettingDialog;
    })(designer.BaseDialog);
    designer.SheetSettingDialog = SheetSettingDialog;

    var DataValidationDialog = (function (_super) {
        designer.extends(DataValidationDialog, _super);
        function DataValidationDialog() {
            _super.call(this, (dialog2HtmlPath), '.data-validation-dialog');
        }

        DataValidationDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                modal: true,
                title: designer.res.dataValidationDialog.dataValidation,
                buttons: [
                    {
                        text: designer.res.dataValidationDialog.clearAll,
                        click: function () {
                            self._clearAll();
                        }
                    },
                    {
                        text: designer.res.ok,
                        click: function () {
                            if (self._ValidValues()) {
                                self._applySetting();
                                self.close();
                                designer.wrapper.setFocusToSpread();
                            }
                        },
                        isDefault: true
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
        DataValidationDialog.prototype._init = function () {
            var self = this;

            //Init tabs
            this._element.find(".data-validation-tab").tabs();

            //Init Validations
            this._criteriaType = this._element.find(".validation-criteria-type");
            this._ignoreBlank = this._element.find(".validation-ignore-blank").prop("disabled", true).prop("checked", true);
            this._comparisonOperator = this._element.find(".validation-comparison-operator").prop("disabled", true);
            this._inCellDropDown = this._element.find(".validation-incell-dropdown").prop("checked", true);
            this._value1 = this._element.find(".validation-value1");
            this._value2 = this._element.find(".validation-value2");
            this._value1Container = this._element.find(".validation-value1-container");
            this._value2Container = this._element.find(".validation-value2-container");
            this._value1Label = this._element.find(".validation-value1-label");
            this._value2Label = this._element.find(".validation-value2-label");

            this._showInputMessage = this._element.find(".show-input-message").prop("checked", true);
            this._inputTitle = this._element.find(".input-title");
            this._inputMessage = this._element.find(".input-message");
            this._showErrorMessage = this._element.find(".show-error-message").prop("checked", true);
            this._errorTitle = this._element.find(".error-title");
            this._errorMessage = this._element.find(".error-message");
            this._errorStyle = this._element.find(".error-style");
            this._highlightStyle = this._element.find(".validation-hignlight-type");
            this._dogearPosition = this._element.find("#dogear-position");
            this._iconPosition = this._element.find("#icon-position");
            this._fileSelect = this._element.find("#fileselect");
            this._colorSelect = this._element.find(".color-select");
            this._fileSelector = this._element.find("#highlighticon");
            this._fileSelectorDiv = this._element.find("#fileselect");
            self._highlightStyleColor = "red";
            this._iconImg = this._element.find("#datavali-icon-img");
            this._deleteIcon = this._element.find("#datavali-dialog-deleteicon");
            this._selectColorPicker = null;
            this.dogearPosition = $(".dogearPositionValue");
            this.iconPosition = $(".iconPositionValue");
            //Handle Events
            this._criteriaType.on("change", function () {
                self._criteriaTypeChanged();
            });
            this._comparisonOperator.on("change", function () {
                self._comparisonOperatorChanged();
            });
            this._showInputMessage.on("change", function () {
                self._showInputMessageChanged();
            });
            this._showErrorMessage.on("change", function () {
                self._showErrorMessageChanged();
            });
            this._errorStyle.on("change", function () {
                self._errorStyleChanged();
            });
            this._highlightStyle.on("change", function () {
                self._highlightStyleChanged();
            });
            this._colorSelect.on("click", function () {
                self._colorSelectClick();
            });
            this._fileSelector.on("change", function () {
                self._deleteIcon.css("display", "inline-block");
                self._fileSelectorChanged();
            });
            this._deleteIcon.on("click", function () {
                self.imageBase64 = "";
                self._iconImg.hide();
                self._iconImg[0].src = "";
                self._deleteIcon.hide();
                self._fileSelector.val("");
            });
            self._element.find(".rangeSelectButton").click(function () {
                self._getRangeSelectDialog();
                if ($(this).attr('disabled') === 'disabled') {
                    return;
                }
                self.hide();
                var title = self._element.dialog('option', 'title'), callback = self._setValueFromRangeSelect, existFormula;
                switch ($(this).data('name')) {
                    case "validation-value1":
                        existFormula = self._value1.val();
                        self._rangeSelectDialog.open(title, callback, existFormula, ['.validation-value1']);
                        break;
                    case "validation-value2":
                        existFormula = self._value2.val();
                        self._rangeSelectDialog.open(title, callback, existFormula, ['.validation-value2']);
                        break;
                    default:
                        self.show();
                }
            });
        };

        DataValidationDialog.prototype._getRangeSelectDialog = function () {
            if (Sheets.DataValidation.CriteriaType[this._criteriaType.val()] === 3 /* List */) {
                if (!this._absRefRangeSelectDialog) {
                    this._absRefRangeSelectDialog = new designer.RangeSelectDialog(this, {
                        needSheetName: false,
                        absoluteReference: true
                    });
                }
                this._rangeSelectDialog = this._absRefRangeSelectDialog;
            } else {
                if (!this._relRefRangeSelectDialog) {
                    this._relRefRangeSelectDialog = new designer.RangeSelectDialog(this, {
                        needSheetName: false,
                        absoluteReference: false
                    });
                }
                this._rangeSelectDialog = this._relRefRangeSelectDialog;
            }
        };
        DataValidationDialog.prototype._fileSelectorChanged = function () {
            var file = this._fileSelector[0].files[0];
            var reader = new FileReader();
            var self = this;
            if (file) {
                reader.readAsDataURL(file);
                reader.onloadend = function (e) {
                    self.imageBase64 = this.result;
                    self._iconImg.show();
                    self._iconImg[0].src = this.result;
                };
            }
        };
        DataValidationDialog.prototype._colorSelectClick = function () {
            var self = this;
            if (!this._selectColorPicker) {
                $("#highlight-picker").colorpicker({
                    valueChanged: function (e, value) {
                        if (value.color) {
                            self._highlightStyleColor = value.color;
                        } else {
                            self._highlightStyleColor = "rgba(0,0,0,0)";
                        }
                        $(".sparkline-ex-colorspan").css("background-color", self._highlightStyleColor);
                    },
                    choosedColor: function (e, value) {
                        self._selectColorPicker.gcuipopup("hide");
                    },
                    openColorDialog: function () {
                        self._selectColorPicker.gcuipopup("hide");
                    }
                });
                this._selectColorPicker = $("#highlight-picker").gcuipopup({
                    autoHide: true,
                    position: {
                        of: $('.datavalColor'),
                        my: 'right top',
                        at: 'right bottom'
                    },
                    showing: function (e, args) {
                        $("#highlight-picker").colorpicker("option", "themeColors", designer.wrapper.getThemeColors());
                    }
                });
            }
            this._selectColorPicker.gcuipopup("show");
        };
        DataValidationDialog.prototype._highlightStyleChanged = function () {
            var value = this._highlightStyle.val();
            switch (value) {
                case "dogear": {
                    this._dogearPosition.css('visibility', 'visible');
                    this._dogearPosition.css('display', '');
                    this._iconPosition.css('visibility', 'hidden');
                    this._fileSelect.css('visibility', 'hidden');
                    break;
                }
                case "circle": {
                    this._dogearPosition.css('visibility', 'hidden');
                    this._iconPosition.css('visibility', 'hidden');
                    this._fileSelect.css('visibility', 'hidden');
                    break;
                }
                case "icon": {
                    this._dogearPosition.css('display', 'none');
                    this._iconPosition.css('visibility', 'visible');
                    this._fileSelect.css('visibility', 'visible');
                    break;
                }
                default:
                    break;
            }
        };
        DataValidationDialog.prototype._setValueFromRangeSelect = function (selector, value) {
            this._element.find(selector).val(value);
        };
        DataValidationDialog.prototype._beforeOpen = function () {
            this._element.find(".data-validation-tab").tabs("option", "active", 0);
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            $("#highlighticon")[0].value = "";
            //Get active selection area's validator
            var selection = this.getActiveSelection(activeSheet);
            if (!selection) {
                return;
            }
            var dv = activeSheet.getDataValidator(selection.row, selection.col);

            //Apply validation to dialog
            if (dv) {
                this._loadValidatorSetting(dv);

                //update status
                this._UpdateCriteriaStatus(dv.type(), dv.comparisonOperator());
                this._updateErrorIcon();
                this._updateHighlight(dv);
            } else {
                //If dv doesn't exist, clear the dialogs.
                this._clearAll();
            }
        };

        // criteriaType number to string
        var CriteriaType = {
            0: "anyValue",
            0x1: "wholeNumber",
            0x2: "decimalValues",
            0x3: "list",
            0x4: "date",
            0x5: "time",
            0x6: "textLength",
            0x7: "custom"
        };
        // ComparisonOperator number to string
        var ComparisonOperator = {
            0: "equalsTo",
            1: "notEqualsTo",
            2: "greaterThan",
            3: "greaterThanOrEqualsTo",
            4: "lessThan",
            5: "lessThanOrEqualsTo",
            6: "between",
            7: "notBetween"
        };

        var ErrorStyle = {
            0: "stop",
            1: "warning",
            2: "information"
        };

        function getValueAsString(value) {
            if (value === null || value === keyword_undefined) {
                return "";
            } else if (value && value.getDate) {   // simple to check Date value
                return [value.getMonth() + 1, value.getDate(), value.getFullYear()].join('/');   // format date like Excel: M/d/yyyy
            }
            return value + "";
        }
        DataValidationDialog.prototype._updateHighlight = function (dv) {
            var hightStyle = dv.highlightStyle();
            var type = hightStyle.type;
            var color = hightStyle.color;
            var position = hightStyle.position;
            if (type === GC.Spread.Sheets.DataValidation.HighlightType.circle) {
                this._highlightStyle.val("circle");
                this._dogearPosition.css('visibility', 'hidden');
                this._iconPosition.css('visibility', 'hidden');
                this._fileSelect.css('visibility', 'hidden');
            } else if (type === GC.Spread.Sheets.DataValidation.HighlightType.dogEar) {
                this._highlightStyle.val("dogear");
                this._dogearPosition.css('visibility', 'visible');
                this._dogearPosition.css('display', '');
            } else if (type === GC.Spread.Sheets.DataValidation.HighlightType.icon) {
                this._highlightStyle.val("icon");
                this._dogearPosition.css('display', 'none');
                this._iconPosition.css('visibility', 'visible');
                this._fileSelect.css('visibility', 'visible');
                if (hightStyle.image) {
                    this.imageBase64 = hightStyle.image;
                    this._iconImg.show();
                    this._iconImg[0].src = hightStyle.image;
                    this._deleteIcon.css("display", "inline-block");
                } else {
                    this._iconImg.hide();
                }
            }
            switch (position) {
                case GC.Spread.Sheets.DataValidation.HighlightPosition.topLeft: {
                    this.dogearPosition.val("Top Left");
                    break;
                }
                case GC.Spread.Sheets.DataValidation.HighlightPosition.topRight: {
                    this.dogearPosition.val("Top Right");
                    break;
                }
                case GC.Spread.Sheets.DataValidation.HighlightPosition.bottomRight: {
                    this.dogearPosition.val("Bottom Right");
                    break;
                }
                case GC.Spread.Sheets.DataValidation.HighlightPosition.bottomLeft: {
                    this.dogearPosition.val("Bottom Left");
                    break;
                }
                case GC.Spread.Sheets.DataValidation.HighlightPosition.outsideLeft: {
                    this.iconPosition.val("Outside Left");
                    break;
                }
                case GC.Spread.Sheets.DataValidation.HighlightPosition.outsideRight: {
                    this.iconPosition.val("Outside Right");
                    break;
                }
                default:
                    break;
            }
            this._highlightStyleColor = color;
            $(".sparkline-ex-colorspan").css("background-color", this._highlightStyleColor);
        };
        DataValidationDialog.prototype._loadValidatorSetting = function (dv) {
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            var activeRow = activeSheet.getActiveRowIndex();
            var activeColumn = activeSheet.getActiveColumnIndex();
            this._criteriaType.val(CriteriaType[dv.type()]);
            this._comparisonOperator.val(ComparisonOperator[dv.comparisonOperator()]);
            this._value1.val(getValueAsString(dv.value1(activeRow, activeColumn)));
            this._value2.val(getValueAsString(dv.value2(activeRow, activeColumn)));
            this._ignoreBlank.prop("checked", dv.ignoreBlank());
            this._inCellDropDown.prop("checked", dv.inCellDropdown());
            this._showInputMessage.prop("checked", dv.showInputMessage());
            this._inputTitle.val(dv.inputTitle());
            this._inputMessage.val(dv.inputMessage());
            this._showErrorMessage.prop("checked", dv.showErrorMessage());
            this._errorStyle.val(ErrorStyle[dv.errorStyle()]);
            this._errorTitle.val(dv.errorTitle());
            this._errorMessage.val(dv.errorMessage());
        };

        DataValidationDialog.prototype._clearAll = function () {
            //Reset criteria to default status
            this._resetCriteriaToDefaultStatus();

            //Clear others value
            this._criteriaType.find("option:first-child").prop("selected", true);
            this._comparisonOperator.find("option:first-child").prop("selected", true);
            this._value1.val(null);
            this._value2.val(null);
            this._showInputMessage.prop("checked", true);
            this._inputTitle.val(null).prop("disabled", false);
            this._inputMessage.val(null).prop("disabled", false);
            this._showErrorMessage.prop("checked", true);
            this._errorStyle.prop("disabled", false).find("option:first-child").prop("selected", true);
            this._errorTitle.val(null).prop("disabled", false);
            this._errorMessage.val(null).prop("disabled", false);
            this._updateErrorIcon();
        };

        DataValidationDialog.prototype._resetCriteriaToDefaultStatus = function () {
            this._comparisonOperator.prop("disabled", true);
            this._ignoreBlank.prop("disabled", true);
            this._inCellDropDown.parent().css('visibility', "hidden");
            this._value1Container.css('visibility', 'hidden');
            this._value1Label.css('visibility', 'hidden');
            this._value2Container.css('visibility', 'hidden');
            this._value2Label.css('visibility', 'hidden');
            this._dogearPosition.css('visibility', 'hidden');
            this._iconPosition.css('visibility', 'hidden');
            this._fileSelect.css('visibility', 'hidden');
            this._highlightStyle.val("circle");
            this._highlightStyleColor = "red";
            $(".sparkline-ex-colorspan").css("background-color", this._highlightStyleColor);
        };

        DataValidationDialog.prototype._disableIgnoreBlank = function (value) {
            this._ignoreBlank.prop("disabled", value);
        };

        DataValidationDialog.prototype._disableComparisonOperator = function (value) {
            this._comparisonOperator.prop("disabled", value);
        };

        DataValidationDialog.prototype._showCellDropDown = function (value) {
            this._inCellDropDown.parent().css('visibility', value ? "visible" : "hidden");
        };

        DataValidationDialog.prototype._updateValue1 = function (show, label) {
            this._value1Container.css('visibility', show ? "visible" : "hidden");
            this._value1Label.css('visibility', show ? "visible" : "hidden");
            this._value1Label.text(label);
        };

        DataValidationDialog.prototype._updateValue2 = function (show, label) {
            this._value2Container.css('visibility', show ? "visible" : "hidden");
            this._value2Label.css('visibility', show ? "visible" : "hidden");
            this._value2Label.text(label);
        };

        DataValidationDialog.prototype._UpdateCriteriaStatus = function (criteriaType, operator) {
            this._resetCriteriaToDefaultStatus();
            if (criteriaType === 0 /* AnyValue */) {
                return;
            } else if (criteriaType === 1 /* WholeNumber */ || criteriaType === 2 /* DecimalValues */ || criteriaType === 4 /* Date */ || criteriaType === 6 /* TextLength */) {
                var startLabel;
                var endLabel;
                var equalLabel;
                switch (criteriaType) {
                    case 1 /* WholeNumber */
                        :
                    case 2 /* DecimalValues */
                        :
                        startLabel = designer.res.dataValidationDialog.minimum;
                        endLabel = designer.res.dataValidationDialog.maximum;
                        equalLabel = designer.res.dataValidationDialog.value;
                        break;
                    case 4 /* Date */
                        :
                        startLabel = designer.res.dataValidationDialog.startDate;
                        endLabel = designer.res.dataValidationDialog.endDate;
                        equalLabel = designer.res.dataValidationDialog.dateLabel;
                        break;
                    case 6 /* TextLength */
                        :
                        startLabel = designer.res.dataValidationDialog.minimum;
                        endLabel = designer.res.dataValidationDialog.maximum;
                        equalLabel = designer.res.dataValidationDialog.length;
                        break;
                }
                switch (operator) {
                    case 6 /* Between */
                        :
                    case 7 /* NotBetween */
                        :
                        this._disableIgnoreBlank(false);
                        this._disableComparisonOperator(false);
                        this._showCellDropDown(false);
                        this._updateValue1(true, startLabel);
                        this._updateValue2(true, endLabel);
                        break;
                    case 0 /* EqualsTo */
                        :
                    case 1 /* NotEqualsTo */
                        :
                        this._disableIgnoreBlank(false);
                        this._disableComparisonOperator(false);
                        this._showCellDropDown(false);
                        this._updateValue1(true, equalLabel);
                        this._updateValue2(false, "");
                        break;
                    case 2 /* GreaterThan */
                        :
                    case 3 /* GreaterThanOrEqualsTo */
                        :
                        this._disableIgnoreBlank(false);
                        this._disableComparisonOperator(false);
                        this._showCellDropDown(false);
                        this._updateValue1(true, startLabel);
                        this._updateValue2(false, "");
                        break;
                    case 4 /* LessThan */
                        :
                    case 5 /* LessThanOrEqualsTo */
                        :
                        this._disableIgnoreBlank(false);
                        this._disableComparisonOperator(false);
                        this._showCellDropDown(false);
                        this._updateValue1(true, endLabel);
                        this._updateValue2(false, "");
                        break;
                }
            } else if (criteriaType === 3 /* List */) {
                this._disableIgnoreBlank(false);
                this._disableComparisonOperator(true);
                this._showCellDropDown(true);
                this._updateValue1(true, designer.res.dataValidationDialog.source);
                this._updateValue2(false, "");
            } else if (criteriaType === 7 /* Custom */) {
                this._disableIgnoreBlank(false);
                this._disableComparisonOperator(true);
                this._showCellDropDown(false);
                this._updateValue1(true, designer.res.dataValidationDialog.formula);
                this._updateValue2(false, "");
            }
        };

        DataValidationDialog.prototype._criteriaTypeChanged = function () {
            this._UpdateCriteriaStatus(Sheets.DataValidation.CriteriaType[this._criteriaType.val()], Sheets.ConditionalFormatting.ComparisonOperators[this._comparisonOperator.val()]);
        };

        DataValidationDialog.prototype._comparisonOperatorChanged = function () {
            this._UpdateCriteriaStatus(Sheets.DataValidation.CriteriaType[this._criteriaType.val()], Sheets.ConditionalFormatting.ComparisonOperators[this._comparisonOperator.val()]);
        };

        DataValidationDialog.prototype._showInputMessageChanged = function () {
            this._inputTitle.prop("disabled", !this._showInputMessage.prop("checked"));
            this._inputMessage.prop("disabled", !this._showInputMessage.prop("checked"));
        };

        DataValidationDialog.prototype._showErrorMessageChanged = function () {
            this._errorTitle.prop("disabled", !this._showErrorMessage.prop("checked"));
            this._errorMessage.prop("disabled", !this._showErrorMessage.prop("checked"));
            this._errorStyle.prop("disabled", !this._showErrorMessage.prop("checked"));
        };

        DataValidationDialog.prototype._updateErrorIcon = function () {
            var errorIcon = this._element.find(".error-icon");
            switch (this._errorStyle.val()) {
                case "stop":
                    errorIcon.removeClass("error-icon-warning").removeClass("error-icon-info").addClass("error-icon-stop");
                    break;
                case "warning":
                    errorIcon.removeClass("error-icon-stop").removeClass("error-icon-info").addClass("error-icon-warning");
                    break;
                case "information":
                    errorIcon.removeClass("error-icon-warning").removeClass("error-icon-stop").addClass("error-icon-info");
                    break;
            }
        };

        DataValidationDialog.prototype._errorStyleChanged = function () {
            this._updateErrorIcon();
        };

        DataValidationDialog.prototype._applySetting = function () {
            var dv;
            var operator = Sheets.ConditionalFormatting.ComparisonOperators[this._comparisonOperator.val()];
            var v1 = this._value1.val();
            var v2 = this._value2.val();
            v1 = this._adjustFormula(v1);
            v2 = this._adjustFormula(v2);
            var highLightStyle = this._highlightStyle.val();
            var dogearPosition = this.dogearPosition.val();
            var iconPosition = this.iconPosition.val();
            switch (this._criteriaType.val()) {
                case "anyValue":
                    dv = new Sheets.DataValidation.DefaultDataValidator();
                    dv.type(0) /* AnyValue */;
                    break;
                case "wholeNumber":
                    if ($.isNumeric(v1)) {
                        v1 = Number(v1);
                    }
                    if ($.isNumeric(v2)) {
                        v2 = Number(v2);
                    }
                    dv = Sheets.DataValidation.createNumberValidator(operator, v1, v2, true);
                    break;
                case "decimalValues":
                    if ($.isNumeric(v1)) {
                        v1 = Number(v1);
                    }
                    if ($.isNumeric(v2)) {
                        v2 = Number(v2);
                    }
                    dv = Sheets.DataValidation.createNumberValidator(operator, v1, v2, false);
                    break;
                case "list":
                    if (this._isFormula(v1)) {
                        dv = Sheets.DataValidation.createFormulaListValidator(v1);
                    } else {
                        dv = Sheets.DataValidation.createListValidator(v1);
                    }
                    break;
                case "date":
                    if (v1 && !this._isFormula(v1)) {
                        v1 = new Date(v1);
                    }
                    if (v2 && !this._isFormula(v2)) {
                        v2 = new Date(v2);
                    }
                    dv = Sheets.DataValidation.createDateValidator(operator, v1, v2);
                    break;
                case "textLength":
                    dv = Sheets.DataValidation.createTextLengthValidator(operator, v1, v2);
                    break;
                case "custom":
                    dv = Sheets.DataValidation.createFormulaValidator(v1);
                    break;
            }
            if (dv) {
                dv.showInputMessage(this._showInputMessage.prop("checked"));
                dv.inputTitle(this._inputTitle.val());
                dv.inputMessage(this._inputMessage.val());
                dv.showErrorMessage(this._showErrorMessage.prop("checked"));
                dv.errorTitle(this._errorTitle.val());
                dv.errorMessage(this._errorMessage.val());
                dv.errorStyle(Sheets.DataValidation.ErrorStyle[this._errorStyle.val()]);
                dv.ignoreBlank(this._ignoreBlank.prop("checked"));
                dv.inCellDropdown(this._inCellDropDown.prop("checked"));
                dv.comparisonOperator(Sheets.ConditionalFormatting.ComparisonOperators[this._comparisonOperator.val()]);
                if (highLightStyle === "circle") {
                    dv.highlightStyle({
                        type: GC.Spread.Sheets.DataValidation.HighlightType.circle,
                        color: this._highlightStyleColor
                    });
                } else if (highLightStyle === "dogear" && dogearPosition === "Top Left") {
                    dv.highlightStyle({
                        type: GC.Spread.Sheets.DataValidation.HighlightType.dogEar,
                        color: this._highlightStyleColor,
                        position: GC.Spread.Sheets.DataValidation.HighlightPosition.topLeft
                    });
                } else if (highLightStyle === "dogear" && dogearPosition === "Top Right") {
                    dv.highlightStyle({
                        type: GC.Spread.Sheets.DataValidation.HighlightType.dogEar,
                        color: this._highlightStyleColor,
                        position: GC.Spread.Sheets.DataValidation.HighlightPosition.topRight
                    });
                } else if (highLightStyle === "dogear" && dogearPosition === "Bottom Left") {
                    dv.highlightStyle({
                        type: GC.Spread.Sheets.DataValidation.HighlightType.dogEar,
                        color: this._highlightStyleColor,
                        position: GC.Spread.Sheets.DataValidation.HighlightPosition.bottomLeft
                    });
                } else if (highLightStyle === "dogear" && dogearPosition === "Bottom Right") {
                    dv.highlightStyle({
                        type: GC.Spread.Sheets.DataValidation.HighlightType.dogEar,
                        color: this._highlightStyleColor,
                        position: GC.Spread.Sheets.DataValidation.HighlightPosition.bottomRight
                    });
                } else if (highLightStyle === "icon" && iconPosition === "Outside Left") {
                    dv.highlightStyle({
                        type: GC.Spread.Sheets.DataValidation.HighlightType.icon,
                        color: this._highlightStyleColor,
                        position: GC.Spread.Sheets.DataValidation.HighlightPosition.outsideLeft,
                        image: this.imageBase64
                    });
                } else if (highLightStyle === "icon" && iconPosition === "Outside Right") {
                    dv.highlightStyle({
                        type: GC.Spread.Sheets.DataValidation.HighlightType.icon,
                        color: this._highlightStyleColor,
                        position: GC.Spread.Sheets.DataValidation.HighlightPosition.outsideRight,
                        image: this.imageBase64
                    });
                }
            }
            this._deleteIcon.hide();
            this.imageBase64 = null;
            this._iconImg[0].src = "";
            this._iconImg.hide();
            designer.actions.doAction("setDataValidation", designer.wrapper.spread, dv);
        };

        DataValidationDialog.prototype._ValidValues = function () {
            var value1 = this._value1.val();
            var value2 = this._value2.val();
            if (this._value1.css("visibility") === "visible" && this._value2.css("visibility") === "hidden" && !value1) {
                designer.MessageBox.show(designer.res.dataValidationDialog.valueEmptyMessage, designer.res.title, 1 /* info */, 0 /* ok */);
                return false;
            }
            if (this._value1.css("visibility") === "visible" && this._value2.css("visibility") === "visible") {
                if (!value1 || !value2) {
                    designer.MessageBox.show(designer.res.dataValidationDialog.valueEmptyMessage, designer.res.title, 1 /* info */, 0 /* ok */);
                    return false;
                } else if ($.isNumeric(value1) && $.isNumeric(value2) && (Number(value1) > Number(value2))) {
                    designer.MessageBox.show(designer.res.dataValidationDialog.minimumMaximumMessage, designer.res.title, 1 /* info */, 0 /* ok */);
                    return false;
                }
            }
            return true;
        };
        return DataValidationDialog;
    })(designer.BaseDialog);
    designer.DataValidationDialog = DataValidationDialog;

    var GroupDirectionDialog = (function (_super) {
        designer.extends(GroupDirectionDialog, _super);
        function GroupDirectionDialog() {
            _super.call(this, (dialog2HtmlPath), '.group-direction-dialog');
        }

        GroupDirectionDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                modal: true,
                title: designer.res.groupDirectionDialog.settings,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
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
        GroupDirectionDialog.prototype._beforeOpen = function () {
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            this._element.find("#showcolumn-group-direction").prop("checked", activeSheet.showColumnOutline());
            this._element.find("#showrow-group-direction").prop("checked", activeSheet.showRowOutline());
            this._element.find("#row-group-direction").prop("checked", activeSheet.rowOutlines.direction() === 1 /* Forward */ ? true : false);
            this._element.find("#column-group-direction").prop("checked", activeSheet.columnOutlines.direction() === 1 /* Forward */ ? true : false);
        };
        GroupDirectionDialog.prototype._applySetting = function () {
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            activeSheet.suspendPaint();
            activeSheet.showRowOutline(this._element.find("#showrow-group-direction")[0].checked);
            activeSheet.showColumnOutline(this._element.find("#showcolumn-group-direction")[0].checked);
            activeSheet.rowOutlines.direction(this._element.find("#row-group-direction").prop("checked") ? 1 /* Forward */ : 0 /* Backward */);
            activeSheet.columnOutlines.direction(this._element.find("#column-group-direction").prop("checked") ? 1 /* Forward */ : 0 /* Backward */);
            activeSheet.resumePaint();
        };
        return GroupDirectionDialog;
    })(designer.BaseDialog);
    designer.GroupDirectionDialog = GroupDirectionDialog;

    var ZoomDialog = (function (_super) {
        designer.extends(ZoomDialog, _super);
        function ZoomDialog() {
            _super.call(this, (dialog2HtmlPath), '.zoom-dialog');
            this.fitSelection = 'Fit selection';
            this.custom = 'Custom:';
        }

        ZoomDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                modal: true,
                title: designer.res.zoomDialog.title,
                width: 230,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var ratio = self._element.find("input[name='zoom-ratio']:checked").val();
                            if (ratio === self.fitSelection) {
                                designer.actions.doAction('zoomSelection', designer.wrapper.spread);
                            } else {
                                var txt = self._element.find("input[name='zoom-custom-ratio']").val();
                                var value = Math.floor(txt);
                                value = value / 100;
                                if (value) {
                                    designer.actions.doAction('zoom', designer.wrapper.spread, value);
                                } else {
                                    designer.MessageBox.show(designer.res.zoomDialog.exception, designer.res.title, 2 /* warning */);
                                }
                            }
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

        ZoomDialog.prototype._beforeOpen = function () {
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            var zoomFactor = activeSheet.zoom();
            var zoomFactorPercent = this._convertToIntegerPercent(zoomFactor);
            this._element.find("input[type='text']").val(zoomFactorPercent);
            this._findFitRatio(zoomFactor);
        };
        ZoomDialog.prototype._init = function () {
            var self = this;
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            var zoomFactor = activeSheet.zoom();
            var maxZoomRatio = 4;
            var zoomFactorPercent = this._convertToIntegerPercent(zoomFactor);
            this._element.find("input[type='text']").val(zoomFactorPercent);
            this._findFitRatio(zoomFactor);
            this._element.find("input[name='zoom-ratio']").bind("change", function () {
                var value = self._element.find("input[name='zoom-ratio']:checked").val();
                if (value === self.custom) {
                    //to do nothing
                } else if (value === self.fitSelection) {
                    var zoomInfo = designer.actions._getPreferredZoomInfo();
                    if (zoomInfo) {
                        if (zoomInfo.zoom > maxZoomRatio) {
                            zoomInfo.zoom = maxZoomRatio;
                        }
                        self._element.find("input[type='text']").val(self._convertToIntegerPercent(zoomInfo.zoom));
                    }
                } else {
                    self._element.find("input[type='text']").val(value);
                }
            });
            this._element.find("input[name='zoom-custom-ratio']").bind("focus", function () {
                self._element.find("input[class='custom-ratio']").prop("checked", true);
            });
        };
        ZoomDialog.prototype._updateRatio = function () {
            var value = this._element.find("input[name='zoom-ratio']:checked").val();
            this._element.find("input[type='text']").val(value);
        };
        ZoomDialog.prototype._convertToIntegerPercent = function (value) {
            var precision = 12; // empirical value look https://github.com/camsong/blog/issues/9
            return Math.floor(+parseFloat((value * 100).toPrecision(precision)));
        };
        ZoomDialog.prototype._findFitRatio = function (value) {
            switch (value) {
                case 2:
                    this._element.find("input[id='zoom-ratio1']").prop("checked", true);
                    break;
                case 1:
                    this._element.find("input[id='zoom-ratio2']").prop("checked", true);
                    break;
                case 0.75:
                    this._element.find("input[id='zoom-ratio3']").prop("checked", true);
                    break;
                case 0.5:
                    this._element.find("input[id='zoom-ratio4']").prop("checked", true);
                    break;
                case 0.25:
                    this._element.find("input[id='zoom-ratio5']").prop("checked", true);
                    break;
                default:
                    this._element.find("input[class='custom-ratio']").prop("checked", true);
            }
        };
        return ZoomDialog;
    })(designer.BaseDialog);
    designer.ZoomDialog = ZoomDialog;

    (function (FormulaSparklineType) {
        FormulaSparklineType[FormulaSparklineType["pie"] = 0] = "pie"; /* NOSONAR: AssignmentWithinCondition */
        FormulaSparklineType[FormulaSparklineType["area"] = 1] = "area"; /* NOSONAR: AssignmentWithinCondition */
        FormulaSparklineType[FormulaSparklineType["scatter"] = 2] = "scatter"; /* NOSONAR: AssignmentWithinCondition */
        FormulaSparklineType[FormulaSparklineType["compatible"] = 3] = "compatible"; /* NOSONAR: AssignmentWithinCondition */
        FormulaSparklineType[FormulaSparklineType["bullet"] = 4] = "bullet"; /* NOSONAR: AssignmentWithinCondition */
        FormulaSparklineType[FormulaSparklineType["spread"] = 5] = "spread"; /* NOSONAR: AssignmentWithinCondition */
        FormulaSparklineType[FormulaSparklineType["stacked"] = 6] = "stacked"; /* NOSONAR: AssignmentWithinCondition */
        FormulaSparklineType[FormulaSparklineType["hbar"] = 7] = "hbar"; /* NOSONAR: AssignmentWithinCondition */
        FormulaSparklineType[FormulaSparklineType["vbar"] = 8] = "vbar"; /* NOSONAR: AssignmentWithinCondition */
        FormulaSparklineType[FormulaSparklineType["variance"] = 9] = "variance"; /* NOSONAR: AssignmentWithinCondition */
        FormulaSparklineType[FormulaSparklineType["boxplot"] = 10] = "boxplot"; /* NOSONAR: AssignmentWithinCondition */
        FormulaSparklineType[FormulaSparklineType["cascade"] = 11] = "cascade"; /* NOSONAR: AssignmentWithinCondition */
        FormulaSparklineType[FormulaSparklineType["pareto"] = 12] = "pareto"; /* NOSONAR: AssignmentWithinCondition */
        designer.FormulaSparklineType = FormulaSparklineType;
    })(designer.FormulaSparklineType || ({}));

    (function (MultiRangeFormulaType) {
        MultiRangeFormulaType[MultiRangeFormulaType["cascade"] = 0] = "cascade"; /* NOSONAR: AssignmentWithinCondition */
        MultiRangeFormulaType[MultiRangeFormulaType["pareto"] = 1] = "pareto"; /* NOSONAR: AssignmentWithinCondition */
        designer.MultiRangeFormulaType = MultiRangeFormulaType;
    })(designer.MultiRangeFormulaType || ({}));

    var InsertSparkLineDialog = (function (_super) {
        designer.extends(InsertSparkLineDialog, _super);
        function InsertSparkLineDialog() {
            _super.call(this, (dialog2HtmlPath), '.insert-sparkline-dialog');
        }

        InsertSparkLineDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                modal: true,
                title: designer.res.insertSparklineDialog.createSparklines,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
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

        InsertSparkLineDialog.prototype._init = function () {
            var self = this;
            self._element.find(".rangeSelectButton").click(function () {
                if (!self._rangeSelectDialogAbsolute) {
                    self._rangeSelectDialogAbsolute = new designer.RangeSelectDialog(self, {
                        absoluteReference: true,
                        needSheetName: false
                    });
                }
                if (!self._rangeSelectDialog) {
                    self._rangeSelectDialog = new designer.RangeSelectDialog(self, {
                        absoluteReference: false,
                        needSheetName: false
                    });
                }
                if ($(this).attr('disabled') === 'disabled') {
                    return;
                }
                self.hide();
                var title = self._element.dialog('option', 'title'), callback = self._setValueFromRangeSelect, existFormula;
                switch ($(this).data('name')) {
                    case "sparkline-data-range":
                        existFormula = self._element.find(".sparkline-data-range").val();
                        self._rangeSelectDialog.open(title, callback, existFormula, ['.sparkline-data-range']);
                        break;
                    case "sparkline-location-range":
                        existFormula = self._element.find(".sparkline-location-range").val();
                        self._rangeSelectDialogAbsolute.open(title, callback, existFormula, ['.sparkline-location-range']);
                        break;
                    default:
                        self.show();
                }
            });

        };

        InsertSparkLineDialog.prototype._setValueFromRangeSelect = function (selector, value) {
            var formula = value;
            if (value.indexOf('=') === 0) {
                formula = value.substr(1);
            }
            this._element.find(selector).val(formula);
        };
        InsertSparkLineDialog.prototype._beforeOpen = function (args) {
            this._activeSheet = designer.wrapper.spread.getActiveSheet();
            this._formulaSparklineType = keyword_undefined;
            this._sparklineType = keyword_undefined;
            var formulaCheck = this._element.find("#is-formula-sparkline");
            var formulaCheckParent = formulaCheck.parent();

            //args[0] indicate sparkline type
            var type = args[0];

            //args[1] indicate whether is formular sparkline
            if (args[1] !== undefined) {
                this._formulaSparklineType = type;
                formulaCheck.prop("checked", true).attr("disabled", "disabled");
                formulaCheckParent.addClass("element-disabled");
            } else {
                this._sparklineType = type;
                formulaCheck.prop("checked", true).removeAttr("disabled");
                formulaCheckParent.removeClass("element-disabled");
            }
            var sheet = this._activeSheet;
            var referenceStyle = designer.wrapper.spread.options.referenceStyle;
            this._element.find(".sparkline-data-range").val(designer.CEUtility.parseRangeToExpString(sheet.getSelections()[0],
                null, sheet.getActiveRowIndex(), sheet.getActiveColumnIndex(), referenceStyle));
            this._element.find(".sparkline-location-range").val("");
        };

        InsertSparkLineDialog.prototype._applySetting = function () {
            var self = this, sheet = self._activeSheet, element = self._element;
            var dataRangeStr = element.find(".sparkline-data-range").val();
            var locationRangeStr = element.find(".sparkline-location-range").val();
            var exRanges = designer.CEUtility.parseExpStringToRanges(locationRangeStr, sheet);
            if (!_checkRangeOfSparkline(sheet, dataRangeStr, true, false) || !_checkRangeOfSparkline(sheet, locationRangeStr, true, true)) {
                return;
            }
            var isFormula = element.find("#is-formula-sparkline").prop("checked");
            if (isFormula) {
                var compatibleType = "";
                if (this._sparklineType !== undefined) {
                    switch (self._sparklineType) {
                        case 0 /* line */
                            :
                            self._formulaSparklineType = 3 /* compatible */;
                            compatibleType = "line";
                            break;
                        case 1 /* column */
                            :
                            self._formulaSparklineType = 3 /* compatible */;
                            compatibleType = "column";
                            break;
                        case 2 /* winloss */
                            :
                            self._formulaSparklineType = 3 /* compatible */;
                            compatibleType = "winloss";
                            break;
                        default:
                            break;
                    }
                }

                designer.actions.doAction("setFormulaSparkline", designer.wrapper.spread, {
                    type: self._formulaSparklineType,
                    compatibleType: compatibleType,
                    dataRange: dataRangeStr,
                    locationRange: exRanges[0].ranges[0],
                    locationSheet: exRanges[0].sheetName
                });
            } else {
                designer.actions.doAction("setDefaultSparkline", designer.wrapper.spread, {
                    dataRange: dataRangeStr,
                    locationRange: exRanges[0].ranges[0],
                    locationSheet: exRanges[0].sheetName,
                    sparklineType: self._sparklineType,
                    setting: self._sparklineType === 2 ? { 'showNegative': true } : {}
                });
            }
            designer.ribbon.updateSparkline();
            self.close();
            self._updateFormulaBar();
            designer.wrapper.setFocusToSpread();
        };

        InsertSparkLineDialog.prototype._updateFormulaBar = function () {
            var formulaBar = $("#formulaBarText"), sheet = this._activeSheet;
            if (formulaBar.length > 0) {
                var formula = sheet.getFormula(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex());
                if (formula) {
                    formula = "=" + formula;
                    formulaBar.text(formula);
                }
            }
        };
        return InsertSparkLineDialog;
    })(designer.BaseDialog);
    designer.InsertSparkLineDialog = InsertSparkLineDialog;

    var InsertCellStatesDialog = (function (_super) {
        designer.extends(InsertCellStatesDialog, _super);
        function InsertCellStatesDialog() {
            _super.call(this, (dialog2HtmlPath), '.insert-cellstates-dialog');
        }
        InsertCellStatesDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 380,
                modal: true,
                title: designer.res.cellStates.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self._closeDialog();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ],
                close: function () {
                    if (self._isFromManager) {
                        $(self).trigger("insertCellStatesDialogClose");
                    }
                    self._isFromManager = false;
                }
            };
        };
        InsertCellStatesDialog.prototype._closeDialog = function () {
            this.close();
        };
        InsertCellStatesDialog.prototype._init = function () {
            var self = this;
            if (self.formatCellDialog === undefined) {
                self.formatCellDialog = new designer.FormatDialog();
                self.formatCellDialog.setFormatDirectly(false);
            }
            self._element.find(".rangeSelectButton").click(function () {
                if (!self._rangeSelectDialog) {
                    self._rangeSelectDialog = new designer.RangeSelectDialog(self, {
                        absoluteReference: false,
                        needSheetName: false
                    });
                }
                if ($(this).attr('disabled') === 'disabled') {
                    return;
                }
                self.hide();
                var title = self._element.dialog('option', 'title'), callback = self._setValueFromRangeSelect, existFormula;
                if ($(this).data('name') === "cellstates-data-range") {
                    existFormula = self._element.find(".cellstates-data-range").val();
                    self._rangeSelectDialog.open(title, callback, existFormula, ['.cellstates-data-range']);
                } else {
                    self.show();
                }
            });
            self._element.find("#cellstates-style-selectbtn").bind("click", function () {
                self.formatCellDialog.open('fill', {}, self._style, true);
            });
            $(self.formatCellDialog).on('okClicked', function (evt, args) {
                self._style = self._getStyle(args);
                self._applySylyeToFormatBox(self._style);
            });
        };
        InsertCellStatesDialog.prototype._getStyle = function (style) {
            var sheetStyle = new GC.Spread.Sheets.Style();
            for (var prop in style) {
                if (style.hasOwnProperty(prop)) {
                    sheetStyle[prop] = style[prop];
                }
            }
            return sheetStyle;
        };
        InsertCellStatesDialog.prototype._formatColor = function (style, prop, subProp) {
            var colorString = null;
            if (!style) {
                return null;
            }
            if (style[prop]) {
                if (subProp) {
                    colorString = style[prop] ? style[prop][subProp] : style[prop];
                } else {
                    colorString = style[prop];
                }
            } else {
                return colorString;
            }
            if (!colorString) {
                return colorString;
            }
            var spread = designer.wrapper.spread;
            var sheet = spread.getActiveSheet();
            var theme = sheet.currentTheme();
            if (theme) {
                return theme.getColor(colorString);
            }
            return null;
        };
        InsertCellStatesDialog.prototype._applySylyeToFormatBox = function (style) {
            var self = this;
            designer.RuleFormatHelper._drawPreviewControl(self._element.find(".preview-common"), style);
        };
        InsertCellStatesDialog.prototype._setValueFromRangeSelect = function (selector, value) {
            var formula = value;
            if (value.indexOf('=') === 0) {
                formula = value.substr(1);
            }
            this._element.find(selector).val(formula);
        };
        InsertCellStatesDialog.prototype._beforeOpen = function (args) {
            var self = this, $element = self._element;
            if (args && args.length > 0) {
                self._isFromManager = args[0];
            }
            self._activeSheet = designer.wrapper.spread.getActiveSheet();
            $element.find("#cellstates-type").val(-1);
            var ranges = self._activeSheet.getSelections();
            if (ranges && ranges.length > 0) {
                $element.find(".cellstates-data-range").val(designer.CEUtility.parseRangeToExpString(ranges[0]));
            } else {
                $element.find(".cellstates-data-range").val("");
            }
            self._style = null;
            self._applySylyeToFormatBox(null);
        };
        InsertCellStatesDialog.prototype._validFormData = function (cellStatesType, style, ranges, sheetName, sheet) {
            var msg = '';
            if (sheetName && sheetName !== sheet.name()) {
                msg = designer.res.cellStates.forbidCorssSheet;
                return msg;
            }
            if (cellStatesType === -1) {
                msg = designer.res.cellStates.errorStateType;
                return msg;
            }
            if (!(ranges && ranges.length > 0)) {
                msg = designer.res.cellStates.errorDataRangeMessage;
                return msg;
            }
            if (!style) {
                msg = designer.res.cellStates.errorStyle;
                return msg;
            }
            return msg;
        };
        InsertCellStatesDialog.prototype._applySetting = function () {
            var self = this, sheet = self._activeSheet, element = self._element;
            var dataRangeStr = element.find(".cellstates-data-range").val();
            var cellStatesType = parseInt(element.find("#cellstates-type").val(), 10);
            var style = self._style;
            var rangeInfo = designer.CEUtility.parseExpStringToRanges(dataRangeStr, sheet);
            var selectRanges = (rangeInfo && rangeInfo.length > 0) ? rangeInfo[0].ranges : [];
            var sheetName = (rangeInfo && rangeInfo.length > 0) ? rangeInfo[0].sheetName : [];
            var errorMsg = self._validFormData(cellStatesType, style, selectRanges, sheetName, sheet);
            if (errorMsg) {
                designer.MessageBox.show(errorMsg, designer.res.title, 3 /* error */, 0 /* ok */);
                return;
            }
            designer.actions.doAction("addorRemoveCellStates", designer.wrapper.spread, {
                selectRanges: selectRanges,
                cellStatesType: cellStatesType,
                style: style,
                type: "add"
            });
            self._closeDialog();
            designer.wrapper.setFocusToSpread();
        };
        return InsertCellStatesDialog;
    })(designer.BaseDialog);
    designer.InsertCellStatesDialog = InsertCellStatesDialog;
    var ManageCellStatesDialog = (function (_super) {
        designer.extends(ManageCellStatesDialog, _super);
        function ManageCellStatesDialog() {
            _super.call(this, (dialog2HtmlPath), '.manage-cellstates-dialog');
        }
        function renderHelper(template, context) {
            return template.replace(/\{\{(.*?)\}\}/g, function (match, key) {
                return context[key.trim()];
            });
        }
        ManageCellStatesDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 450,
                modal: true,
                title: designer.res.cellStates.manage,
                buttons: [
                    {
                        text: designer.res.close,
                        click: function () {
                            self.close();
                            designer.wrapper.setFocusToSpread();
                        }
                    }
                ]
            };
        };
        ManageCellStatesDialog.prototype._init = function () {
            var self = this, $element = self._element;
            if (!self._InsertCellStatesDialogInstance) {
                self._InsertCellStatesDialogInstance = new designer.InsertCellStatesDialog();
            }
            $element.on("click", ".cellstate-row", function (e) {
                $element.find(".active-row").removeClass("active-row");
                $(this).addClass("active-row");
            });
            $element.find("#add-cellstate").bind("click", function () {
                self.hide();
                self._InsertCellStatesDialogInstance.open(true);
            });
            $element.find("#remove-cellstate").bind("click", function () {
                var item = $element.find(".active-row");
                var range = item.attr("data-range"), state = item.attr("data-state");
                if (range && state) {
                    var spread = designer.wrapper.spread;
                    var sheet = spread.getActiveSheet();
                    var ranges = designer.CEUtility.parseExpStringToRanges("=" + range, sheet);
                    if (ranges && ranges.length > 0) {
                        range = ranges[0].ranges;
                        state = GC.Spread.Sheets.CellStatesType[state];
                        designer.actions.doAction("addorRemoveCellStates", designer.wrapper.spread, {
                            selectRanges: range,
                            cellStatesType: state,
                            type: "remove"
                        });
                        self._refresh();
                    }
                }
            });
            $(self._InsertCellStatesDialogInstance).on("insertCellStatesDialogClose", function () {
                self._refresh();
                self.show();
            });
        };
        ManageCellStatesDialog.prototype._applyCellStateInfo = function (list) {
            var self = this, html = "";
            for (var i = 0, len = list.length; i < len; i++) {
                html += this._renderItem(list[i]);
            }
            $("#cellstates-manage-template").html(html);
            self._element.find(".cellstates-style-perview").each(function (index, element) {
                designer.RuleFormatHelper._drawPreviewControl($(element), list[index].style);
            });
        };
        ManageCellStatesDialog.prototype._renderItem = function (item) {
            var template = "<tr class='cellstate-row' data-range='{{range}}' data-state='{{type}}'><td>{{range}}</td><td>{{formatHtml}}</td><td>{{type}}</td></tr>";
            return renderHelper(template, this._prepareItem(item));
        };
        ManageCellStatesDialog.prototype._prepareItem = function (item) {
            return {
                range: designer.CEUtility.parseRangeToExpString(item.range),
                formatHtml: '<div class="cellstates-style-perview"></div>',
                type: GC.Spread.Sheets.CellStatesType[item.state]
            };
        };
        ManageCellStatesDialog.prototype._refresh = function () {
            var spread = designer.wrapper.spread;
            var sheet = spread.getActiveSheet();
            var list = sheet.cellStates.all();
            this._applyCellStateInfo(list);
        };
        ManageCellStatesDialog.prototype._beforeOpen = function () {
            this._refresh();
        };
        return ManageCellStatesDialog;
    })(designer.BaseDialog);
    designer.ManageCellStatesDialog = ManageCellStatesDialog;
    var SparklineWeightDialog = (function (_super) {
        designer.extends(SparklineWeightDialog, _super);
        function SparklineWeightDialog() {
            _super.call(this, (dialog2HtmlPath), '.sparkline-weight-dialog');
        }

        SparklineWeightDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: '200',
                modal: true,
                title: designer.res.sparklineWeightDialog.sparklineWeight,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
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

        SparklineWeightDialog.prototype._beforeOpen = function () {
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            var sparkline = activeSheet.getSparkline(activeSheet.getActiveRowIndex(), activeSheet.getActiveColumnIndex());
            if (sparkline) {
                this._element.find(".sparkline-weight").val(sparkline.setting().options.lineWeight);
            }
        };

        SparklineWeightDialog.prototype._applySetting = function () {
            var weight = this._element.find(".sparkline-weight").val();
            var self = this;
            if ($.isNumeric(weight)) {
                designer.actions.doAction("setSparklineSetting", designer.wrapper.spread, [weight, "lineWeight"]);
                self.close();
                designer.wrapper.setFocusToSpread();
            } else {
                designer.MessageBox.show(designer.res.sparklineWeightDialog.errorMessage, designer.res.title, 2 /* warning */, 0 /* ok */);
            }
        };
        return SparklineWeightDialog;
    })(designer.BaseDialog);
    designer.SparklineWeightDialog = SparklineWeightDialog;

    var SparklineMarkerColorDialog = (function (_super) {
        designer.extends(SparklineMarkerColorDialog, _super);
        function SparklineMarkerColorDialog() {
            _super.call(this, (dialog2HtmlPath), '.sparkline-marker-color-dialog');
        }

        SparklineMarkerColorDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                modal: true,
                title: designer.res.sparklineMarkerColorDialog.sparklineMarkerColor,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
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

        SparklineMarkerColorDialog.prototype._init = function () {
            this._createColorPicker('sparkline-negative-point-color-frame', 'sparkline-negative-point-color-span', 'sparkline-negative-point-color-picker');
            this._createColorPicker('sparkline-marker-point-color-frame', 'sparkline-marker-point-color-span', 'sparkline-marker-point-color-picker');
            this._createColorPicker('sparkline-high-point-color-frame', 'sparkline-high-point-color-span', 'sparkline-high-point-color-picker');
            this._createColorPicker('sparkline-low-point-color-frame', 'sparkline-low-point-color-span', 'sparkline-low-point-color-picker');
            this._createColorPicker('sparkline-first-point-color-frame', 'sparkline-first-point-color-span', 'sparkline-first-point-color-picker');
            this._createColorPicker('sparkline-last-point-color-frame', 'sparkline-last-point-color-span', 'sparkline-last-point-color-picker');
        };

        SparklineMarkerColorDialog.prototype._createColorPicker = function (frame, span, picker) {
            var self = this;
            this._element.find('.' + picker).colorpicker({
                valueChanged: function (e, value) {
                    if (value.color === undefined) {
                        self._element.find('.' + span).css('background-color', "");
                    } else {
                        self._element.find('.' + span).css('background-color', value.color);
                    }
                },
                choosedColor: function (e, value) {
                    self._element.find('.' + frame).comboframe('close');
                },
                openColorDialog: function (e, value) {
                    self._element.find('.' + frame).comboframe('close');
                }
            });
            this._element.find('.' + frame).comboframe();
        };

        SparklineMarkerColorDialog.prototype._loadColor = function (color, span, picker) {
            $('.' + picker).colorpicker({ themeColors: designer.wrapper.getThemeColors() });
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            if (color) {
                var colorItem = designer.ColorHelper.parse(color, activeSheet.currentTheme().colors());
                $('.' + picker).colorpicker('option', 'selectedItem', colorItem);
                this._element.find('.' + span).css("background-color", colorItem.color);
            } else {
                this._element.find('.' + span).css("background-color", "transparent");
                $('.' + picker).colorpicker('option', 'selectedItem', null);
            }
        };

        SparklineMarkerColorDialog.prototype._saveColor = function (colorItem, actionName, property) {
            if (colorItem) {
                if (colorItem.name) {
                    designer.actions.doAction(actionName, designer.wrapper.spread, [colorItem.name, property]);
                } else {
                    designer.actions.doAction(actionName, designer.wrapper.spread, [colorItem.color, property]);
                }
            }
        };

        SparklineMarkerColorDialog.prototype._beforeOpen = function () {
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            var sparklineSetting = activeSheet.getSparkline(activeSheet.getActiveRowIndex(), activeSheet.getActiveColumnIndex()).setting();
            this._loadColor(sparklineSetting.options.negativeColor, 'sparkline-negative-point-color-span', 'sparkline-negative-point-color-picker');
            this._loadColor(sparklineSetting.options.markersColor, 'sparkline-marker-point-color-span', 'sparkline-marker-point-color-picker');
            this._loadColor(sparklineSetting.options.highMarkerColor, 'sparkline-high-point-color-span', 'sparkline-high-point-color-picker');
            this._loadColor(sparklineSetting.options.lowMarkerColor, 'sparkline-low-point-color-span', 'sparkline-low-point-color-picker');
            this._loadColor(sparklineSetting.options.firstMarkerColor, 'sparkline-first-point-color-span', 'sparkline-first-point-color-picker');
            this._loadColor(sparklineSetting.options.lastMarkerColor, 'sparkline-last-point-color-span', 'sparkline-last-point-color-picker');
        };

        SparklineMarkerColorDialog.prototype._applySetting = function () {
            this._saveColor($(".sparkline-negative-point-color-picker").colorpicker('option', 'selectedItem'), "setSparklineSetting", "negativeColor");
            this._saveColor($(".sparkline-marker-point-color-picker").colorpicker('option', 'selectedItem'), "setSparklineSetting", "markersColor");
            this._saveColor($(".sparkline-high-point-color-picker").colorpicker('option', 'selectedItem'), "setSparklineSetting", "highMarkerColor");
            this._saveColor($(".sparkline-low-point-color-picker").colorpicker('option', 'selectedItem'), "setSparklineSetting", "lowMarkerColor");
            this._saveColor($(".sparkline-first-point-color-picker").colorpicker('option', 'selectedItem'), "setSparklineSetting", "firstMarkerColor");
            this._saveColor($(".sparkline-last-point-color-picker").colorpicker('option', 'selectedItem'), "setSparklineSetting", "lastMarkerColor");
        };
        return SparklineMarkerColorDialog;
    })(designer.BaseDialog);
    designer.SparklineMarkerColorDialog = SparklineMarkerColorDialog;

    var CreateTableDialog = (function (_super) {
        designer.extends(CreateTableDialog, _super);
        function CreateTableDialog() {
            _super.call(this, (dialog2HtmlPath), '.create-table-dialog');
        }

        CreateTableDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                modal: true,
                title: designer.res.createTableDialog.createTable,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
                            self.close();
                            designer.wrapper.setFocusToSpread();
                            designer.ribbon.updateTable();
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

        CreateTableDialog.prototype._init = function () {
            var self = this;
            self._element.find('.rangeSelectButton').click(function () {
                if (!self._rangeSelectDialog) {
                    self._rangeSelectDialog = new designer.RangeSelectDialog(self, {
                        absoluteReference: true,
                        needSheetName: false
                    });
                }
                self.hide();
                var title = self._element.dialog('option', 'title'), callback = self._setValueFromRangeSelect;
                var existFormula = self._element.find(".table-source-range").val();
                self._rangeSelectDialog.open(title, callback, existFormula, ['.table-source-range']);
            });
        };
        CreateTableDialog.prototype._setValueFromRangeSelect = function (selector, value) {
            this._element.find(selector).val(value);
        };
        CreateTableDialog.prototype._beforeOpen = function () {
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            this._sheet = activeSheet;
            var useR1C1 = designer.wrapper.spread.options.referenceStyle === 1;
            this._element.find(".table-source-range").val(designer.CEUtility.parseRangeToExpString(activeSheet.getSelections()[0], true, 0, 0, useR1C1));
        };

        CreateTableDialog.prototype._applySetting = function () {
            var ranges = designer.CEUtility.parseExpStringToRanges(this._element.find(".table-source-range").val(), this._sheet);
            if (ranges && ranges.length >= 1) {
                var sheet = designer.wrapper.spread.getActiveSheet();
                var range = ranges[0] && ranges[0].ranges[0];
                if (range && sheet.isintersectWithArrayFormula(range)) {
                    designer.MessageBox.show(designer.res.tableErrDialog.insertTableInArrayFormula, designer.res.title, 3 /* error */, 0 /* ok */);
                    return;
                }
                designer.actions.doAction("createDefaultTable", designer.wrapper.spread, ranges[0]);
                var table = sheet.tables.find(range.row, range.col);
                table && table.showResizeHandle(true);
            }
        };
        return CreateTableDialog;
    })(designer.BaseDialog);
    designer.CreateTableDialog = CreateTableDialog;

    var FormatTableDialog = (function (_super) {
        designer.extends(FormatTableDialog, _super);
        function FormatTableDialog() {
            _super.call(this, (dialog2HtmlPath), '.format-table-dialog');
        }

        FormatTableDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 600,
                modal: true,
                title: designer.res.formatTableStyle.tableStyle,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            if (self._existTableStyleName()) {
                                designer.MessageBox.show(designer.res.formatTableStyle.exception, designer.res.title, 2 /* warning */);
                            } else {
                                FormatTableDialog.currentId++;
                                self._storageStyle();
                                designer.actions.isFileModified = true; //remind user add new table style.
                                self.close();
                                designer.wrapper.setFocusToSpread();
                            }
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

        FormatTableDialog.prototype._init = function () {
            this._tableStyle = null;
            this._firstColumnStripStyle = null;
            this._secondColumnStripStyle = null;
            this._firstRowStripStyle = null;
            this._secondRowStripStyle = null;

            this._createTableStyleName();
            this._createTableElement();
            this._createTablePreview();
            this._createStripeSize();
            this._attachEvent();
        };

        FormatTableDialog.prototype._createTableElement = function () {
            var eles = designer.res.tableElement;
            for (var name in eles) { /* NOSONAR: ForIn */
                $('<option></option>').attr('strip-size', 1).val(name).text(eles[name]).appendTo(this._element.find('.table-element-select'));
            }
            this._element.find('.table-element-select').attr('size', 8);
            this._element.find('.table-element-select').get(0).selectedIndex = 0;
            this._tableStyleElement = this._element.find('.table-element-select').find('option:selected').val();
        };

        FormatTableDialog.prototype._createTableStyleName = function () {
            var name = designer.res.formatTableStyle.tableStyle + " " + FormatTableDialog.currentId;
            this._element.find('.table-style-input').val(name);
        };

        FormatTableDialog.prototype._createTablePreview = function () {
            var _this = this;
            this._tableFormatSpread = new Sheets.Workbook(this._element.find('.pre-spread')[0]);
            var sheet = this._tableFormatSpread.getActiveSheet();
            this._tableFormatSpread.options.showHorizontalScrollbar = false;
            this._tableFormatSpread.options.showVerticalScrollbar = false;
            this._tableFormatSpread.options.tabStripVisible = false;
            this._tableFormatSpread.options.allowUserResize = false;
            this._tableFormatSpread.options.allowUserDragDrop = false;
            this._tableFormatSpread.options.allowUserDragFill = false;
            this._tableFormatSpread.options.allowContextMenu = false;
            sheet.suspendPaint();
            $(designer.util.getCanvas(this._tableFormatSpread)).unbind("gcmousewheel.gcSheet");
            sheet.currentTheme(designer.wrapper.spread.getActiveSheet().currentTheme());
            sheet.options.gridline = { showVerticalGridline: false, showHorizontalGridline: false };
            sheet.options.colHeaderVisible = false;
            sheet.options.rowHeaderVisible = false;
            sheet.options.selectionBackColor = "transparent";
            sheet.options.selectionBorderColor = "transparent";
            sheet.options.isProtected = true;
            sheet.setColumnCount(8);
            sheet.setRowCount(9);
            var style = new Sheets.Style();
            style.vAlign = 1 /* center */;
            style.hAlign = 1 /* center */;

            var row, col;
            for (row = 1; row < 8; row++) {
                for (col = 1; col < 7; col++) {
                    sheet.setValue(row, col, '-');
                    sheet.setStyle(row, col, style);
                }
            }
            sheet.setRowHeight(0, 1);
            sheet.setRowHeight(8, 10);
            sheet.setColumnWidth(0, 3);
            sheet.setColumnWidth(7, 10);
            for (row = 1; row < 8; row++) {
                sheet.setRowHeight(row, 14);
            }
            for (col = 1; col < 7; col++) {
                sheet.setColumnWidth(col, 17);
            }

            if (sheet.tables.all().length === 0) {
                var table;
                var tableStyle = new Sheets.Tables.TableTheme();
                table = sheet.tables.add('table1', 1, 1, 6, 6, tableStyle);
                table.filterButtonVisible(true);
                for (var i = 0; i < 7; i++) {
                    table.setColumnName(i, "c" + i);
                }
            }

            sheet.resumePaint();
            setTimeout(function () {
                _this._tableFormatSpread.refresh();
            }, 0);
        };

        FormatTableDialog.prototype._createStripeSize = function () {
            var maxSize = 8;
            for (var i = 1; i <= maxSize; i++) {
                $('<option></option>').val(i).text(i).appendTo(this._element.find('.stripe-size-select'));
            }
            this._element.find('.stripe-size-select').attr('size', 1);
            this._element.find('.stripe-size-select').get(0).selectedIndex = 0;
            this._element.find('.stripe-size-block').css('display', 'none');
        };

        FormatTableDialog.prototype._attachEvent = function () {
            var self = this;
            this._element.find('.table-element-select').change(function () {
                var stripeSizeBlock = self._element.find('.stripe-size-block');
                self._tableStyleElement = self._element.find('.table-element-select').find('option:selected').val();
                if (self._tableStyleElement.indexOf('Strip') === -1) {
                    stripeSizeBlock.css('display', 'none');
                } else {
                    stripeSizeBlock.css('display', 'block');
                }
                self._syncStripSize();
            });
            this._element.find('.stripe-size-select').change(function () {
                var stripSize = self._element.find('.stripe-size-select').find('option:selected').val();
                self._element.find('.table-element-select').find('option:selected').attr('strip-size', stripSize);
                self._updatePreview();
            });
            this._element.find('.format-table-element').click(function () {
                var sheet = self._tableFormatSpread.getActiveSheet();
                var style = new Sheets.Style();
                if (sheet.tables.all().length !== 0) {
                    var table = sheet.tables.find(2, 2);
                    var selectElementMethod = self._element.find('.table-element-select').find('option:selected').val();
                    var tableStyle = table.style();
                    var tableStyleInfo = tableStyle[selectElementMethod]();
                    if (tableStyleInfo) {
                        style.backColor = tableStyleInfo.backColor;
                        style.foreColor = tableStyleInfo.foreColor;
                        style.font = tableStyleInfo.font;
                        style.borderLeft = tableStyleInfo.borderLeft;
                        style.borderTop = tableStyleInfo.borderTop;
                        style.borderRight = tableStyleInfo.borderRight;
                        style.borderBottom = tableStyleInfo.borderBottom;
                        style.borderVertical = tableStyleInfo.borderVertical;
                        style.borderHorizontal = tableStyleInfo.borderHorizontal;
                        style.textDecoration = tableStyleInfo.textDecoration;
                    }
                }
                if (this._formatDialog === undefined) {
                    this._formatDialog = new designer.FormatDialog();
                }
                this._formatDialog.open('font', undefined, style, true, true);
                this._formatDialog.selectTabOptions = { font: true, border: true, fill: true };
                this._formatDialog.setFormatDirectly(false);

                $(this._formatDialog).on('okClicked', function (evt, args) {
                    var selectElement = self._element.find('.table-element-select').find('option:selected').val();
                    switch (selectElement) {
                        case 'firstRowStripStyle':
                            self._firstRowStripStyle = args;
                            break;
                        case 'secondRowStripStyle':
                            self._secondRowStripStyle = args;
                            break;
                        case 'firstColumnStripStyle':
                            self._firstColumnStripStyle = args;
                            break;
                        case 'secondColumnStripStyle':
                            self._secondColumnStripStyle = args;
                            break;
                        default:
                            self._tableStyle = args;
                            break;
                    }

                    self._updatePreview();
                });
            });
            this._element.find('.clear-table-element').click(function () {
                var sheet = self._tableFormatSpread.getActiveSheet();
                if (sheet.tables.all().length !== 0) {
                    sheet.suspendPaint();
                    var table = sheet.tables.find(2, 2);
                    var selectElementMethod = self._element.find('.table-element-select').find('option:selected').val();
                    var style = table.style();
                    switch (selectElementMethod) {
                        case 'firstRowStripStyle':
                            self._firstRowStripStyle = null;
                            break;
                        case 'secondRowStripStyle':
                            self._secondRowStripStyle = null;
                            break;
                        case 'firstColumnStripStyle':
                            self._firstColumnStripStyle = null;
                            break;
                        case 'secondColumnStripStyle':
                            self._secondColumnStripStyle = null;
                            break;
                        default:
                            self._tableStyle = null;
                            break;
                    }
                    style[selectElementMethod](null);
                    table.style(style);
                    sheet.resumePaint();
                }
            });
        };

        FormatTableDialog.prototype._removeEvent = function () {
            this._element.find('.format-table-element').unbind('click');
            this._element.find('.clear-table-element').unbind('click');
            this._element.find('.table-element-select').unbind('change');
            this._element.find('.stripe-size-select').unbind('change');
        };

        FormatTableDialog.prototype._syncStripSize = function () {
            var size;
            var sheet = this._tableFormatSpread.getActiveSheet();
            var table = sheet.tables.find(2, 2);
            var stripSize = parseInt(this._element.find('.stripe-size-select').find('option:selected').val());
            var selectElementMethod = this._element.find('.table-element-select').find('option:selected').val();
            if (table !== null && this._element.find('.stripe-size-block').css('display') === 'block') {
                var tableStyle = table.style();
                switch (selectElementMethod) {
                    case 'firstRowStripStyle':
                        size = tableStyle.firstRowStripSize();
                        break;
                    case 'secondRowStripStyle':
                        size = tableStyle.secondRowStripSize();
                        break;
                    case 'firstColumnStripStyle':
                        size = tableStyle.firstColumnStripSize();
                        break;
                    case 'secondColumnStripStyle':
                        size = tableStyle.secondColumnStripSize();
                        break;
                    default:
                        break;
                }
                if (size !== stripSize) {
                    this._element.find('.stripe-size-select').val(size);
                }
            }
        };

        FormatTableDialog.prototype._updatePreview = function () {
            var table;
            var style;
            var tableStyle = new Sheets.Tables.TableTheme();
            var stripSizeBlock = this._element.find('.stripe-size-block');
            var sheet = this._tableFormatSpread.getActiveSheet();
            sheet.suspendPaint();
            if (sheet.tables.all().length !== 0) {
                table = sheet.tables.find(2, 2);
            } else {
                table = sheet.tables.add('table1', 1, 1, 6, 6, tableStyle);
                table.filterButtonVisible(false);
                for (var i = 0; i < 7; i++) {
                    table.setColumnName(i, '-');
                }
            }
            table.bandColumns(true);
            table.bandRows(true);
            table.showHeader(true);
            table.showFooter(true);
            table.highlightFirstColumn(true);
            table.highlightLastColumn(true);

            var selectElementMethod = this._element.find('.table-element-select').find('option:selected').val();

            if (stripSizeBlock.css('display') === 'block') {
                var stripSize = parseInt(this._element.find('.stripe-size-select').find('option:selected').val());
                switch (selectElementMethod) {
                    case 'firstRowStripStyle':
                        if (this._firstRowStripStyle) {
                            style = this._getStyle(table, selectElementMethod, this._firstRowStripStyle);
                            style.firstRowStripSize(stripSize);
                        }
                        break;
                    case 'secondRowStripStyle':
                        if (this._secondRowStripStyle) {
                            style = this._getStyle(table, selectElementMethod, this._secondRowStripStyle);
                            style.secondRowStripSize(stripSize);
                        }
                        break;
                    case 'firstColumnStripStyle':
                        if (this._firstColumnStripStyle) {
                            style = this._getStyle(table, selectElementMethod, this._firstColumnStripStyle);
                            style.firstColumnStripSize(stripSize);
                        }
                        break;
                    case 'secondColumnStripStyle':
                        if (this._secondColumnStripStyle) {
                            style = this._getStyle(table, selectElementMethod, this._secondColumnStripStyle);
                            style.secondColumnStripSize(stripSize);
                        }
                        break;
                    default:
                        break;
                }
            } else {
                if (this._tableStyle) {
                    style = this._getStyle(table, selectElementMethod, this._tableStyle);
                }
            }
            if (style) {
                table.style(style);
            }

            sheet.resumePaint();
        };

        FormatTableDialog.prototype._getStyle = function (table, method, source) {
            if (source) {
                var style = table.style();
                var tableStyleInfo = new Sheets.Tables.TableStyle();
                tableStyleInfo.backColor = source.backColor;
                tableStyleInfo.foreColor = source.foreColor;
                tableStyleInfo.font = source.font;
                tableStyleInfo.borderLeft = source.borderLeft;
                tableStyleInfo.borderTop = source.borderTop;
                tableStyleInfo.borderRight = source.borderRight;
                tableStyleInfo.borderBottom = source.borderBottom;
                tableStyleInfo.borderVertical = source.borderVertical;
                tableStyleInfo.borderHorizontal = source.borderHorizontal;
                tableStyleInfo.textDecoration = source.textDecoration;
                style[method](tableStyleInfo);
                return style;
            } else {
                return null;
            }
        };

        FormatTableDialog.prototype._storageStyle = function () {
            var sheet = this._tableFormatSpread.getActiveSheet();
            var customPrefix = 'custom';
            var customTableStyleID = 1;
            var table = sheet.tables.find(1, 1);
            if (table) {
                var tableName = this._element.find('.table-style-input').val();
                var args = table.style();
                args.name(tableName);
                for (var name in FormatTableDialog.customTableStyle) { /* NOSONAR: ForIn */
                    customTableStyleID++;
                }
                tableName = customPrefix + customTableStyleID.toString() + '-' + tableName;
                FormatTableDialog.customTableStyle[tableName] = args;
            }
        };

        FormatTableDialog.prototype._existTableStyleName = function () {
            var tableStyleName = this._element.find('.table-style-input').val();
            for (var name in FormatTableDialog.customTableStyle) { /* NOSONAR: ForIn */
                name = name.substring(name.indexOf('-') + 1);
                if (name === tableStyleName) {
                    return true;
                }
            }
            return false;
        };

        FormatTableDialog.prototype.refresh = function () {
            this._removeEvent();
            if (this._element.find('.table-element-select').children().length !== 0) {
                this._element.find('.table-element-select').empty();
            }
            if (this._element.find('.pre-spread').children().length !== 0) {
                this._element.find('.pre-spread').empty();
            }
            if (this._element.find('.stripe-size-select').children().length !== 0) {
                this._element.find('.stripe-size-select').empty();
            }
            this._init();
        };
        FormatTableDialog.currentId = 1;

        FormatTableDialog.customTableStyle = {};
        return FormatTableDialog;
    })(designer.BaseDialog);
    designer.FormatTableDialog = FormatTableDialog;

    var ResizeTableDialog = (function (_super) {
        designer.extends(ResizeTableDialog, _super);
        function ResizeTableDialog() {
            _super.call(this, (dialog2HtmlPath), '.resize-table-dialog');
        }

        ResizeTableDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 300,
                modal: true,
                title: designer.res.resizeTableDialog.title,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
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

        ResizeTableDialog.prototype._init = function () {
            var self = this;
            self._element.find('.rangeSelectButton').click(function () {
                if (!self._rangeSelectDialog) {
                    self._rangeSelectDialog = new designer.RangeSelectDialog(self, {
                        absoluteReference: true,
                        needSheetName: false
                    });
                }
                self.hide();
                var title = self._element.dialog('option', 'title'), callback = self._setValueFromRangeSelect;
                var existFormula = self._element.find(".table-source-range").val();
                self._rangeSelectDialog.open(title, callback, existFormula, ['.table-source-range']);
            });
        };
        ResizeTableDialog.prototype._setValueFromRangeSelect = function (selector, value) {
            this._element.find(selector).val(value);
        };
        ResizeTableDialog.prototype._beforeOpen = function () {
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            this._sheet = activeSheet;
            var table = activeSheet.tables.find(activeSheet.getActiveRowIndex(), activeSheet.getActiveColumnIndex());
            if (table instanceof Sheets.Tables.Table) {
                var useR1C1 = designer.wrapper.spread.options.referenceStyle === 1;
                this._element.find(".table-source-range").val(designer.CEUtility.parseRangeToExpString(table.range(), true, 0, 0, useR1C1));
            }
        };

        ResizeTableDialog.prototype._applySetting = function () {
            var ranges = designer.CEUtility.parseExpStringToRanges(this._element.find(".table-source-range").val(), this._sheet)[0].ranges;
            if (ranges && ranges.length >= 1) {
                designer.actions.doAction("resizeTable", designer.wrapper.spread, ranges[0]);
            }
        };
        return ResizeTableDialog;
    })(designer.BaseDialog);
    designer.ResizeTableDialog = ResizeTableDialog;

    var CellStyleDialog = (function (_super) {
        designer.extends(CellStyleDialog, _super);
        function CellStyleDialog() {
            _super.call(this, (dialog2HtmlPath), '.cell-style-dialog');
        }

        CellStyleDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                modal: true,
                title: "Style",
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.ok();
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

        CellStyleDialog.prototype._init = function () {
            this._element.find(".cell-style-format-setting").button();
            this._attchEvent();
        };

        CellStyleDialog.prototype._beforeOpen = function () {
            this._setNameForStyle();
            this._style = new Sheets.Style();
        };

        CellStyleDialog.prototype._setNameForStyle = function () {
            var name = "Style " + CellStyleDialog._currentID;
            this._element.find(".cell-style-name").val(name);
        };

        CellStyleDialog.prototype.ok = function () {
            var name = this._element.find(".cell-style-name").val();
            if (this._isExisted(name)) {
                designer.MessageBox.show(designer.res.newCellStyleDialog.message, designer.res.title, 2 /* warning */);
            } else {
                this._style.name = name;
                CellStyleDialog.existedCustomCellStyle[name.toLowerCase()] = this._style;
                CellStyleDialog._currentID++;
                designer.actions.isFileModified = true;
                this.close();
                designer.wrapper.setFocusToSpread();
            }
        };

        CellStyleDialog.prototype._isExisted = function (name) {
            if (name) {
                name = name.toLowerCase();
                if (CellStyleDialog.existedCustomCellStyle.hasOwnProperty(name) || CellStyleDialog.buildInCellStyle.hasOwnProperty(name)) {
                    return true;
                }
            }
            return false;
        };

        CellStyleDialog.prototype._attchEvent = function () {
            var self = this;
            this._element.find(".cell-style-format-setting").click(function () {
                if (self._formatDialog === undefined) {
                    self._formatDialog = new designer.FormatDialog();
                }
                self._formatDialog.open("numbers", undefined, self._style, true);
                self._formatDialog.setFormatDirectly(false);

                $(self._formatDialog).on('okClicked', function (evt, args) {
                    self._style = args;
                });
            });
        };
        CellStyleDialog.buildInCellStyle = {};
        CellStyleDialog.existedCustomCellStyle = {};
        CellStyleDialog._currentID = 1;
        return CellStyleDialog;
    })(designer.BaseDialog);
    designer.CellStyleDialog = CellStyleDialog;

    var PDFPrinterDialog = (function (_super) {
        designer.extends(PDFPrinterDialog, _super);
        function PDFPrinterDialog() {
            _super.call(this, (dialog2HtmlPath), '.pdf-printer-setting-dialog');
        }

        PDFPrinterDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: '450px',
                modal: true,
                title: designer.res.fileMenu.printerSettingDialogTitle,
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.ok();
                            self.close();
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

        PDFPrinterDialog.prototype._init = function () {
            this._printerRanges = [];
            this._element.find(".printer-range-setting-button").button();
            this._initScalingSelect();
            this._initDuplexSelect();
            this._attachEvent();
        };

        PDFPrinterDialog.prototype._initScalingSelect = function () {
            var scalingType = designer.res.fileMenu.scalingType;
            var scalingSelect = this._element.find(".scaling-type");
            for (var item in scalingType) { /* NOSONAR: ForIn */
                $("<option></option>").val(item).text(scalingType[item]).appendTo(scalingSelect);
            }
        };

        PDFPrinterDialog.prototype._initDuplexSelect = function () {
            var duplexMode = designer.res.fileMenu.duplexMode;
            var duplexSelect = this._element.find(".duplex-mode");
            for (var item in duplexMode) { /* NOSONAR: ForIn */
                $("<option></option>").val(item).text(duplexMode[item]).appendTo(duplexSelect);
            }
        };

        PDFPrinterDialog.prototype._changeActiveRow = function (row) {
            if (this._currentActiveRow) {
                $(this._currentActiveRow).css("background-color", "");
            }
            this._currentActiveRow = row;
            $(this._currentActiveRow).css("background-color", "#98DDFB");
        };

        PDFPrinterDialog.prototype._attachEvent = function () {
            var self = this;
            var table = this._element.find(".printer-range-table");
            $(".add-print-range").on("click", function () {
                var rangeIndex = parseInt(self._element.find(".page-range-index").val(), 10);
                var rangeCount = parseInt(self._element.find(".page-range-count").val(), 10);

                if (isNaN(rangeIndex) || isNaN(rangeCount) || rangeIndex < 0 || rangeCount <= 0) {
                    designer.MessageBox.show(designer.res.fileMenu.addRangeException, designer.res.title, 3 /* error */, 0 /* ok */);
                    return;
                }

                var tr = $("<tr></tr>");
                $("<td></td>").text(rangeIndex).appendTo(tr);
                $("<td></td>").text(rangeCount).appendTo(tr);
                tr.appendTo(table);
                $(tr).on("click", function () {
                    self._changeActiveRow(this);
                });

                self._printerRanges.push({ "index": rangeIndex, "count": rangeCount });
            });

            $(".remove-print-range").on("click", function () {
                if (self._currentActiveRow) {
                    var tds = $(self._currentActiveRow).find("td");
                    if ($(tds).length !== 2) {
                        return;
                    }
                    var index = $(tds[0]).text();
                    var count = $(tds[1]).text();
                    var ranges = self._printerRanges;
                    var len = ranges.length;
                    for (var i = 0; i < len; i++) {
                        var item = ranges[i];
                        if (item["index"] === parseInt(index, 10) && item["count"] === parseInt(count, 10)) {
                            ranges.splice(i, 1);
                            break;
                        }
                    }
                    $(self._currentActiveRow).remove();
                }
            });
        };

        PDFPrinterDialog.prototype.ok = function () {
            var copyNumber = $(".copies-number").find("option:selected").text();
            var scalingType = $(".scaling-type").get(0).selectedIndex;
            var duplexMode = $(".duplex-mode").get(0).selectedIndex;
            var checkPageSource = $(".papersource-by-pagesize").prop("checked");

            PDFPrinterDialog.printerSettings = {
                scalingType: scalingType,
                duplexMode: duplexMode,
                isPageSourceByPageSize: checkPageSource,
                numberOfCopies: parseInt(copyNumber, 10),
                printRanges: this._printerRanges
            };
        };
        PDFPrinterDialog.printerSettings = {};
        return PDFPrinterDialog;
    })(designer.BaseDialog);
    designer.PDFPrinterDialog = PDFPrinterDialog;


    var FormatCommentDialog = (function (_super) {
        designer.extends(FormatCommentDialog, _super);
        function FormatCommentDialog() {
            _super.call(this, (dialog2HtmlPath), '.format-comment');
        }

        FormatCommentDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                modal: true,
                title: designer.res.formatComment.title,
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.ok();
                            self.close();
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

        FormatCommentDialog.prototype._init = function () {
            this._tabs = ["font", "alignment", "colors", "size", "protection", "properties"];
            this._defaultFontFamily = "Arial";
            this._defaultFontSize = "9pt";

            this._fillColorPicker = this._createColorPicker(this._element.find(".fill-color-picker"), { type: "comment-fill" });
            this._lineColorPicker = this._createColorPicker(this._element.find(".line-color-picker"), { type: "comment-line" });
            this._element.find(".color-transparent-slider").slider({
                range: "min",
                min: 0,
                max: 100
            });

            this._attachEvent();
        };

        FormatCommentDialog.prototype._beforeOpen = function (args) {
            this._spread = designer.wrapper.spread;
            var activeSheet = this._spread.getActiveSheet();
            if (!activeSheet) {
                return;
            }
            if (args.length > 0) {
                this._comment = activeSheet.comments.get(args[0].row, args[0].col);
            }

            if (!this._comment) {
                return;
            }
            this._element.find(".main-comment-tab").tabs();
            this._element.find(".comment-tab-container li").removeClass("hidden");

            //set dialog open options
            if (args.length > 0) {
                var paras = args[0];
                if (paras.showTabs) {
                    this._showTabs(paras.showTabs);
                }
                if (paras.activeTab) {
                    this._getTabIndexById(paras.activeTab);
                }
            }

            this._font = {};
            this._alignment = {};
            this._autoMaticSize = keyword_undefined;
            if (!this._autoMaticPadding) {
                this._autoMaticPadding = false;
                this._padding = this._getPadding();
            } else {
                this._padding = { left: 0, right: 0, top: 0, bottom: 0 };
            }
            this._lineStyle = {};
            this._fillStyle = {};
            this._size = {};

            this._updateFont();
            this._updateAlignment();
            this._updateColorsAndLines();
            this._updateSize();
            this._updateProtection();
            this._updateDynamic();
        };

        FormatCommentDialog.prototype._getPadding = function () {
            var left = parseFloat(this._element.find("#padding-left").val());
            var right = parseFloat(this._element.find("#padding-right").val());
            var top = parseFloat(this._element.find("#padding-top").val());
            var bottom = parseFloat(this._element.find("#padding-bottom").val());
            left = isNaN(left) ? 0 : left;
            right = isNaN(right) ? 0 : right;
            top = isNaN(top) ? 0 : top;
            bottom = isNaN(bottom) ? 0 : bottom;
            return {
                left: left,
                right: right,
                top: top,
                bottom: bottom
            };
        };

        FormatCommentDialog.prototype._attachEvent = function () {
            var self = this;
            this._element.find(".comment-font-picker").fontpicker({
                changed: function (e, args) {
                    switch (args.name) {
                        case "family":
                            self._font["family"] = args.value;
                            break;
                        case "style":
                            self._font["style"] = args.value;
                            break;
                        case "size":
                            self._font["size"] = args.value;
                            break;
                        case "weight":
                            self._font["weight"] = args.value;
                            break;
                        case "color":
                            self._font["foreColor"] = args.value;
                            break;
                        case "underline":
                            if (args.value) {
                                self._font["textDecoration"] |= 1 /* Underline */;
                            } else {
                                self._font["textDecoration"] &= 0xfe;
                            }
                            break;
                        case "strikethrough":
                            if (args.value) {
                                self._font["textDecoration"] |= 2 /* LineThrough */;
                            } else {
                                self._font["textDecoration"] &= 0xfd;
                            }
                            break;
                    }
                }
            });

            this._element.find(".hAlign-select").change(function () {
                self._alignment["hAlign"] = $(this).val().toLowerCase();
            });

            this._element.find("#auto-size").change(function () {
                self._autoMaticSize = $(this).prop("checked");
            });

            this._element.find("#automatic-padding").change(function () {
                self._autoMaticPadding = $(this).prop("checked");
                if (self._autoMaticPadding) {
                    self._element.find(".padding-box").val("");
                } else {
                    self._element.find(".padding-box").val("0");
                }
                self._padding = { left: 0, right: 0, top: 0, bottom: 0 };
            });

            this._element.find("#padding-left").spinner({
                min: 0,
                change: function () {
                    self._padding["left"] = parseInt($(this).val());
                    self._autoMaticPadding = false;
                    self._updateCheckBoxValue(self._element.find("#automatic-padding"), self._autoMaticPadding);
                }
            });
            this._element.find("#padding-right").spinner({
                min: 0,
                change: function () {
                    self._padding["right"] = parseInt($(this).val());
                    self._autoMaticPadding = false;
                    self._updateCheckBoxValue(self._element.find("#automatic-padding"), self._autoMaticPadding);
                }
            });
            this._element.find("#padding-top").spinner({
                min: 0,
                change: function () {
                    self._padding["top"] = parseInt($(this).val());
                    self._autoMaticPadding = false;
                    self._updateCheckBoxValue(self._element.find("#automatic-padding"), self._autoMaticPadding);
                }
            });
            this._element.find("#padding-bottom").spinner({
                min: 0,
                change: function () {
                    self._padding["bottom"] = parseInt($(this).val());
                    self._autoMaticPadding = false;
                    self._updateCheckBoxValue(self._element.find("#automatic-padding"), self._autoMaticPadding);
                }
            });

            this._element.find(".color-transparent-slider").slider({
                slide: function (event, ui) {
                    self._element.find("#colors-transparent-input").val(ui.value);
                    var transparency = parseFloat((ui.value / 100).toFixed(2));
                    self._fillStyle["transparency"] = transparency;
                    self._element.find(".comment-fill").css("opacity", 1 - transparency);
                }
            });

            this._element.find("#colors-transparent-input").spinner({
                min: 0,
                max: 100,
                change: function () {
                    var value = parseInt($(this).val());
                    if (isNaN(value)) {
                        return;
                    }
                    if (value < 0) {
                        value = 0;
                        $(this).val(value);
                    } else if (value > 100) {
                        value = 100;
                        $(this).val(value);
                    }
                    self._element.find(".color-transparent-slider").slider({ value: value });
                    var transparency = parseFloat((value / 100).toFixed(2));
                    self._fillStyle["transparency"] = transparency;
                    self._element.find(".comment-fill").css("opacity", 1 - transparency);
                }
            });

            this._element.find(".lines-style-select").change(function () {
                self._lineStyle["style"] = $(this).val();
            });

            this._element.find(".lines-width").spinner({
                min: 0,
                change: function () {
                    var width = parseFloat($(this).val());
                    if (!isNaN(width)) {
                        self._lineStyle["width"] = width;
                    }
                }
            });

            this._element.find("#comment-size-height").spinner({
                min: 0,
                change: function () {
                    var height = parseFloat($(this).val());
                    if (!isNaN(height)) {
                        self._size["height"] = height;
                    }
                    self._autoMaticSize = false;
                }
            });

            this._element.find("#comment-size-width").spinner({
                min: 0,
                change: function () {
                    var width = parseFloat($(this).val());
                    if (!isNaN(width)) {
                        self._size["width"] = width;
                    }
                    self._autoMaticSize = false;
                }
            });

            this._element.find("#comment-locked").change(function () {
                self._locked = $(this).prop("checked");
            });

            this._element.find("#comment-lock-text").change(function () {
                self._lockText = $(this).prop("checked");
            });

            this._element.find("input[type='radio'][name='dynamic-ratio']").change(function () {
                var checkedRatio = self._element.find("input[type='radio'][name='dynamic-ratio']:checked");
                switch (checkedRatio.attr("id")) {
                    case "move-size":
                        self._dynamicMove = true;
                        self._dynamicSize = true;
                        break;
                    case "move-no-size":
                        self._dynamicMove = true;
                        self._dynamicSize = false;
                        break;
                    case "no-move-size":
                        self._dynamicMove = false;
                        self._dynamicSize = false;
                        break;
                }
            });
        };

        FormatCommentDialog.prototype.ok = function () {
            this._setFont();
            this._setAlignment();
            this._setColorsAndLines();
            this._setSize();
            this._setProtection();
            this._setDynamic();
        };

        //#region font
        FormatCommentDialog.prototype._setFont = function () {
            if (!this._comment) {
                return;
            }
            var oldValue, newValue;
            if (!$.isEmptyObject(this._font)) {
                if (this._font.family) {
                    oldValue = this._comment.fontFamily();
                    if (oldValue !== this._font.family) {
                        designer.actions.doAction("setCommentProperty", this._spread, {
                            propertyName: "fontFamily",
                            oldValue: oldValue,
                            newValue: this._font.family
                        });
                    }
                }
                if (this._font.size) {
                    oldValue = parseFloat(this._comment.fontSize());
                    newValue = parseFloat(this._font.size);
                    if (oldValue !== newValue) {
                        designer.actions.doAction("setCommentProperty", this._spread, {
                            propertyName: "fontSize",
                            oldValue: oldValue + "pt",
                            newValue: this._font.size + "pt"
                        });
                    }
                }
                if (this._font.weight) {
                    oldValue = this._comment.fontWeight();
                    if (this._font.weight !== oldValue) {
                        designer.actions.doAction("setCommentProperty", this._spread, {
                            propertyName: "fontWeight",
                            oldValue: oldValue,
                            newValue: this._font.weight
                        });
                    }
                }
                if (this._font.style) {
                    oldValue = this._comment.fontStyle();
                    if (this._font.style !== oldValue) {
                        designer.actions.doAction("setCommentProperty", this._spread, {
                            propertyName: "fontStyle",
                            oldValue: oldValue,
                            newValue: this._font.style
                        });
                    }
                }
                if (this._font.foreColor) {
                    oldValue = this._comment.foreColor();
                    var foreColor = this._font.foreColor;
                    if (typeof foreColor === "string") {
                        if (foreColor !== oldValue) {
                            designer.actions.doAction("setCommentProperty", this._spread, {
                                propertyName: "foreColor",
                                oldValue: oldValue,
                                newValue: foreColor
                            });
                        }
                    } else {
                        if (foreColor.color !== oldValue) {
                            designer.actions.doAction("setCommentProperty", this._spread, {
                                propertyName: "foreColor",
                                oldValue: oldValue,
                                newValue: foreColor.color
                            });
                        }
                    }
                }
                if (this._font.textDecoration !== undefined) {
                    oldValue = this._comment.textDecoration();
                    newValue = this._font.textDecoration;
                    if (newValue !== oldValue) {
                        designer.actions.doAction("setCommentProperty", this._spread, {
                            propertyName: "textDecoration",
                            oldValue: oldValue,
                            newValue: this._font.textDecoration
                        });
                    }
                }
            }
        };
        FormatCommentDialog.prototype._updateFont = function () {
            if (!this._comment) {
                return;
            }

            //updata data
            var fontFamily = this._comment.fontFamily();
            var fontSize = this._comment.fontSize();
            var fontWeight = this._comment.fontWeight();
            var fontStyle = this._comment.fontStyle();
            var foreColor = this._comment.foreColor();
            var textDecoration = this._comment.textDecoration();
            this._font["family"] = fontFamily ? fontFamily : this._defaultFontFamily;
            this._font["size"] = fontSize ? fontSize : this._defaultFontSize;
            this._font["weight"] = fontWeight ? fontWeight : undefined;
            this._font["style"] = fontStyle ? fontStyle : undefined;
            this._font["foreColor"] = foreColor ? foreColor : undefined;
            this._font["textDecoration"] = textDecoration ? textDecoration : 0;

            //updata UI
            var $element = this._element.find(".comment-font-picker");
            $element.fontpicker("family", this._font["family"]);
            $element.fontpicker("style", this._font["style"] ? this._font["style"] : "normal");
            var size = this._font["size"];
            if (size.indexOf("px") !== -1) {
                size = designer.util.px2pt(parseInt(size));
            }
            $element.fontpicker("size", parseInt(size));
            $element.fontpicker("weight", this._font["weight"] ? this._font["weight"] : "normal");
            if (this._font["foreColor"]) {
                $element.fontpicker("color", designer.ColorHelper.parse(this._font["foreColor"], designer.wrapper.spread.getActiveSheet().currentTheme().colors()));
            } else {
                $element.fontpicker("color", null);
            }
            if (this._font["textDecoration"] & 1 /* Underline */) {
                $element.fontpicker("underline", true);
            } else {
                $element.fontpicker("underline", false);
            }
            if (this._font["textDecoration"] & 2 /* LineThrough */) {
                $element.fontpicker("strikethrough", true);
            } else {
                $element.fontpicker("strikethrough", false);
            }
        };

        //#enregion
        //#region alignment
        FormatCommentDialog.prototype._setAlignment = function () {
            if (!this._comment) {
                return;
            }
            var oldValue;
            if (this._alignment.hAlign !== undefined) {
                oldValue = this._comment.horizontalAlign();
                var newValue = Sheets.HorizontalAlign[this._alignment.hAlign];
                if (newValue !== oldValue) {
                    designer.actions.doAction("setCommentProperty", this._spread, {
                        propertyName: "horizontalAlign",
                        oldValue: oldValue,
                        newValue: newValue
                    });
                }
            }
            if (this._autoMaticSize !== undefined) {
                oldValue = this._comment.autoSize();
                if (this._autoMaticSize !== oldValue) {
                    designer.actions.doAction("setCommentProperty", this._spread, {
                        propertyName: "autoSize",
                        oldValue: oldValue,
                        newValue: this._autoMaticSize
                    });
                }
            }
            if (this._autoMaticPadding !== undefined) {
                oldValue = this._comment.padding();
                var commentPadding;
                if (this._autoMaticPadding) {
                    commentPadding = null;
                } else {
                    if (!$.isEmptyObject(this._padding)) {
                        commentPadding = new Sheets.Comments.Padding(this._padding.top, this._padding.right, this._padding.bottom, this._padding.left);
                    } else {
                        commentPadding = null;
                    }
                }
                if (!this._isEqualPadding(oldValue, commentPadding)) {
                    designer.actions.doAction("setCommentProperty", this._spread, {
                        propertyName: "padding",
                        oldValue: oldValue,
                        newValue: commentPadding
                    });
                }
            }
        };
        FormatCommentDialog.prototype._isEqualPadding = function (oldValue, newValue) {
            if (!oldValue && !newValue) {
                return true;
            }
            if ((oldValue && newValue) && oldValue.left === newValue.left && oldValue.right === newValue.right && oldValue.top === newValue.top && oldValue.bottom === newValue.bottom) {
                return true;
            }
            return false;
        };

        FormatCommentDialog.prototype._updateAlignment = function () {
            if (!this._comment) {
                return;
            }
            var autoMaticSize = this._comment.autoSize();
            var hAlign = this._comment.horizontalAlign();
            if (hAlign !== undefined) {
                this._updateComboBoxValue(this._element.find(".hAlign-select"), Sheets.HorizontalAlign[hAlign]);
            }
            if (autoMaticSize !== undefined) {
                this._updateCheckBoxValue(this._element.find("#auto-size"), autoMaticSize);
            }
            var padding = this._comment.padding();
            if (!padding) {
                this._autoMaticPadding = true;
                this._element.find(".padding-box").val("");
            } else {
                if (padding.left !== undefined) {
                    this._updateTextBoxValue(this._element.find("#padding-left"), padding.left);
                    this._autoMaticPadding = false;
                }
                if (padding.right !== undefined) {
                    this._updateTextBoxValue(this._element.find("#padding-right"), padding.right);
                    this._autoMaticPadding = false;
                }
                if (padding.top !== undefined) {
                    this._updateTextBoxValue(this._element.find("#padding-top"), padding.top);
                    this._autoMaticPadding = false;
                }
                if (padding.bottom !== undefined) {
                    this._updateTextBoxValue(this._element.find("#padding-bottom"), padding.bottom);
                    this._autoMaticPadding = false;
                }
            }
            this._updateCheckBoxValue(this._element.find("#automatic-padding"), this._autoMaticPadding);
        };

        //#endregion
        //#region Colors and Lines
        FormatCommentDialog.prototype._setColorsAndLines = function () {
            var self = this, comment = this._comment;

            if (!comment) {
                return;
            }
            var fillStyle = self._fillStyle;
            if (fillStyle.color !== comment.backColor()) {
                designer.actions.doAction("setCommentProperty", this._spread, {
                    propertyName: "backColor",
                    oldValue: comment.backColor(),
                    newValue: fillStyle.color
                });
            }
            if (fillStyle.transparency !== 1 - comment.opacity()) {
                designer.actions.doAction("setCommentProperty", this._spread, {
                    propertyName: "opacity",
                    oldValue: comment.opacity(),
                    newValue: 1 - fillStyle.transparency
                });
            }

            if (!$.isEmptyObject(this._lineStyle)) {
                var oldColorValue = this._comment.borderColor();
                if (this._lineStyle.colorItem) {
                    var lineStyleColor = this._lineStyle.colorItem.color;
                    if (lineStyleColor !== oldColorValue) {
                        designer.actions.doAction("setCommentProperty", this._spread, {
                            propertyName: "borderColor",
                            oldValue: oldColorValue,
                            newValue: this._lineStyle.colorItem.color
                        });
                    }
                }
                var oldStyleValue = this._comment.borderStyle();
                if (this._lineStyle.style && this._lineStyle.style !== oldStyleValue) {
                    designer.actions.doAction("setCommentProperty", this._spread, {
                        propertyName: "borderStyle",
                        oldValue: oldStyleValue,
                        newValue: this._lineStyle.style
                    });
                }
                var oldWidthValue = this._comment.borderWidth();
                if (this._lineStyle.width && this._lineStyle.width !== oldWidthValue) {
                    designer.actions.doAction("setCommentProperty", this._spread, {
                        propertyName: "borderWidth",
                        oldValue: oldWidthValue,
                        newValue: this._lineStyle.width
                    });
                }
            }
        };
        FormatCommentDialog.prototype._updateColorsAndLines = function () {
            if (!this._comment) {
                return;
            }

            //Fill
            var fillColor = this._comment.backColor();
            var transparency = parseFloat((1 - this._comment.opacity()).toFixed(2));
            this._fillStyle["color"] = fillColor;
            this._fillStyle["transparency"] = transparency;

            //fillcolor
            this._fillColorPicker.colorpicker('option', 'value', fillColor);
            this._element.find(".comment-fill").css("background-color", fillColor);

            //opacity
            var percent = transparency * 100;
            this._element.find(".color-transparent-slider").slider("option", "value", percent);
            this._element.find("#colors-transparent-input").val(percent);

            //Line
            var lineColor = this._comment.borderColor();
            if (lineColor) {
                this._lineColorPicker.colorpicker('option', 'value', lineColor);
                this._element.find(".comment-line").css("background-color", lineColor);
            }
            var lineWidth = parseFloat(this._comment.borderWidth().toFixed(2));
            if (!isNaN(lineWidth)) {
                this._element.find(".lines-width").val(lineWidth);
            }
            var style = this._comment.borderStyle();
            if (style) {
                this._element.find(".lines-style-select").val(style);
            }
        };

        //#endregion
        //#region size
        FormatCommentDialog.prototype._setSize = function () {
            if (!this._comment) {
                return;
            }
            if (this._size.height !== undefined && !this._autoMaticSize) {
                var oldHeightValue = this._comment.height();
                if (this._size.height !== oldHeightValue) {
                    designer.actions.doAction("setCommentProperty", this._spread, {
                        propertyName: "height",
                        oldValue: oldHeightValue,
                        newValue: this._size.height
                    });
                }
            }
            if (this._size.width !== undefined && !this._autoMaticSize) {
                var oldWidthValue = this._comment.width();
                if (this._size.width !== oldWidthValue) {
                    designer.actions.doAction("setCommentProperty", this._spread, {
                        propertyName: "width",
                        oldValue: oldWidthValue,
                        newValue: this._size.width
                    });
                }
            }
        };
        FormatCommentDialog.prototype._updateSize = function () {
            if (!this._comment) {
                return;
            }
            var height = this._comment.height();
            var width = this._comment.width();
            if (height !== undefined) {
                this._element.find("#comment-size-height").val(height);
            }
            if (width !== undefined) {
                this._element.find("#comment-size-width").val(width);
            }
        };

        //#endregion size
        //#region protection
        FormatCommentDialog.prototype._setProtection = function () {
            if (!this._comment) {
                return;
            }
            var oldValue;
            if (this._locked !== undefined) {
                oldValue = this._comment.locked();
                if (this._locked !== oldValue) {
                    designer.actions.doAction("setCommentProperty", this._spread, {
                        propertyName: "locked",
                        oldValue: oldValue,
                        newValue: this._locked
                    });
                }
            }
            if (this._lockText !== undefined) {
                oldValue = this._comment.lockText();
                if (this._lockText !== oldValue) {
                    designer.actions.doAction("setCommentProperty", this._spread, {
                        propertyName: "lockText",
                        oldValue: oldValue,
                        newValue: this._lockText
                    });
                }
            }
        };
        FormatCommentDialog.prototype._updateProtection = function () {
            if (!this._comment) {
                return;
            }
            var locked = this._comment.locked();
            var lockText = this._comment.lockText();
            if (locked !== undefined) {
                this._element.find("#comment-locked").prop("checked", locked);
            }
            if (lockText !== undefined) {
                this._element.find("#comment-lock-text").prop("checked", lockText);
            }
        };

        //#endregion protection
        //#region properties
        FormatCommentDialog.prototype._setDynamic = function () {
            if (!this._comment) {
                return;
            }
            var oldValue;
            if (this._dynamicMove !== undefined) {
                oldValue = this._comment.dynamicMove();
                if (this._dynamicMove !== oldValue) {
                    designer.actions.doAction("setCommentProperty", this._spread, {
                        propertyName: "dynamicMove",
                        oldValue: oldValue,
                        newValue: this._dynamicMove
                    });
                }
            }
            if (this._dynamicSize !== undefined) {
                oldValue = this._comment.dynamicSize();
                if (this._dynamicSize !== oldValue) {
                    designer.actions.doAction("setCommentProperty", this._spread, {
                        propertyName: "dynamicSize",
                        oldValue: oldValue,
                        newValue: this._dynamicSize
                    });
                }
            }
        };
        FormatCommentDialog.prototype._updateDynamic = function () {
            if (!this._comment) {
                return;
            }
            var dynamicMove = this._comment.dynamicMove();
            var dynamicSize = this._comment.dynamicSize();
            if (dynamicMove && dynamicSize) {
                this._element.find("#move-size").prop("checked", true);
            } else if (dynamicMove && !dynamicSize) { /* NOSONAR: S2589, Boolean expressions should not be gratuitous */
                this._element.find("#move-no-size").prop("checked", true);
            } else {
                this._element.find("#no-move-size").prop("checked", true);
            }
        };

        //#enregion properties
        FormatCommentDialog.prototype._showTabs = function (obj) {
            //obj is an object, it is like {font:true,colors:true}
            var tabDoms = this._element.find(".comment-tab-container li");
            tabDoms.addClass("hidden");
            for (var item in obj) {
                if (obj.hasOwnProperty(item)) {
                    var index = $.inArray(item, this._tabs);
                    if (index !== -1 && obj[item]) {
                        $(tabDoms[index]).removeClass("hidden");
                    }
                }
            }
        };

        FormatCommentDialog.prototype._createColorPicker = function (parent, option) {
            if (!option.type) {
                return;
            }
            var self = this;
            var container = $('<div></div>').addClass('colorpicker-container');
            var content = $('<span></span>').appendTo(container);
            $('<span></span>').addClass("colorpicker-preview " + option.type).appendTo(content);
            var popup = $('<div></div>').addClass('colorpicker-popup').appendTo(container);
            var colorPicker = $('<div></div>').colorpicker({
                valueChanged: function (e, value) {
                    var previewColor = value.color === undefined ? "transparent" : value.color;
                    self._element.find('.' + option.type).css('background-color', previewColor);
                    switch (option.type) {
                        case "comment-fill":
                            self._fillStyle["color"] = value.color;
                            break;
                        case "comment-line":
                            self._lineStyle["colorItem"] = value;
                            break;
                    }
                },
                choosedColor: function (e, value) {
                    container.comboframe('close');
                },
                openColorDialog: function (e, value) {
                    container.comboframe('close');
                }
            }).appendTo(popup);
            container.comboframe().click(function () {
                container.comboframe('open');
            });

            parent.append(container);
            return colorPicker;
        };

        FormatCommentDialog.prototype._getTabIndexById = function (tabName) {
            switch (tabName) {
                case 'font':
                    return 0;
                case 'alignment':
                    return 1;
                case 'colors':
                    return 2;
                case 'size':
                    return 3;
                case 'protection':
                    return 4;
                case 'properties':
                    return 5;
            }
            return 0;
        };

        FormatCommentDialog.prototype._updateCheckBoxValue = function (selector, value) {
            var $element = this._element.find(selector);
            if (value === true) {
                $element.prop('indeterminate', false);
                $element.prop('checked', true);
            } else if (value === false) {
                $element.prop('indeterminate', false);
                $element.prop('checked', false);
            } else {
                $element.prop('indeterminate', true);
                $element.prop('checked', false);
            }
        };

        FormatCommentDialog.prototype._updateComboBoxValue = function (selector, value) {
            var $element = this._element.find(selector);
            if (value !== designer.BaseMetaObject.indeterminateValue) {
                $element.val(value);
            } else {
                $element.val(null);
            }
        };

        FormatCommentDialog.prototype._updateTextBoxValue = function (selector, value) {
            var $element = this._element.find(selector);
            if (value !== undefined && value !== null) {
                $element.val(value);
            } else {
                $element.val(null);
            }
        };

        FormatCommentDialog.prototype._parseRGB = function (color) {
            var colorLowerCase = color.toLowerCase();
            if (colorLowerCase.indexOf("rgb") === -1 && colorLowerCase.indexOf("rgba") === -1) {
                return null;
            }
            var arr = color.split(",");
            var a, r, g, b;
            if (arr.length === 4) {
                r = arr[0].substr(arr[0].indexOf("(") + 1);
                g = arr[1];
                b = arr[2];
                a = arr[3].substr(0, arr[3].indexOf(")"));
                return [parseFloat(r), parseFloat(g), parseFloat(b), parseFloat(a)];
            } else if (arr.length === 3) {
                r = arr[0].substr(arr[0].indexOf("(") + 1);
                g = arr[1];
                b = arr[2].substr(0, arr[2].indexOf(")"));
                return [parseFloat(r), parseFloat(g), parseFloat(b)];
            } else {
                return null;
            }
        };
        return FormatCommentDialog;
    })(designer.BaseDialog);
    designer.FormatCommentDialog = FormatCommentDialog;

    var PieSparklineDialog = (function (_super) {
        designer.extends(PieSparklineDialog, _super);
        function PieSparklineDialog() {
            _super.call(this, (dialog2HtmlPath), '.pie-sparkline-dialog');
        }

        PieSparklineDialog.prototype._initOptions = function () {
            var self = this;
            return {
                modal: true,
                title: designer.res.pieSparklineDialog.pieSparklineSetting,
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
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

        PieSparklineDialog.prototype._init = function () {
            this._commonWidgetClass = "pie-color-picker-widget";
            this._addPieColor(true);
            this._defaultValue = { color: "#A9A9A9" };
        };

        PieSparklineDialog.prototype._beforeOpen = function (args) {
            this._sheet = designer.wrapper.spread.getActiveSheet();
            if (!this._sheet) {
                return;
            }
            if (!args[0]) {
                return;
            }
            var row = args[0].row;
            var col = args[0].col;
            var expr = designer.util.parseFormulaSparkline(row, col);
            if (expr.arguments) {
                var args0 = expr.arguments[0];

                //update range text
                var range = designer.util.unParseFormula(args0, row, col);
                this._element.find(".pie-percentage").val(range);

                //udpate color
                var currentLen = this._element.find(".pie-colors-list").children().length;
                var actualLen = expr.arguments.length - 1;
                var i;
                if (actualLen > currentLen) {
                    for (i = 0; i < actualLen - currentLen; i++) {
                        this._element.find(".add-pie-color").trigger("click");
                    }
                } else if (actualLen < currentLen) {
                    for (i = 0; i < currentLen - actualLen; i++) {
                        var removePieColors = this._element.find(".remove-pie-color");
                        if (removePieColors.length > 0) {
                            $(removePieColors[0]).trigger("click");
                        }
                    }
                }

                if (actualLen === 0) {
                    var item = designer.ColorHelper.parse(this._defaultValue.color, this._sheet.currentTheme().colors());
                    $(".pie-color-picker1-widget").colorpicker('option', 'selectedItem', item);
                    this._element.find('.pie-color-picker1').css('background-color', item.color);
                } else {
                    for (i = 1; i <= actualLen; i++) {
                        var colorItem = null;
                        var color = SparklineDialogHelper.parseColorExpression(expr.arguments[i], row, col);
                        try {
                            colorItem = designer.ColorHelper.parse(color, this._sheet.currentTheme().colors());
                        } catch (ex) {
                        }
                        $(".pie-color-picker" + i + "-widget").colorpicker('option', 'selectedItem', colorItem);
                        this._element.find('.pie-color-picker' + i).css('background-color', (colorItem && colorItem.color) ? colorItem.color : "transparent");
                    }
                }
            }
        };

        PieSparklineDialog.prototype._updateFormulaBar = function () {
            var formulaBar = $("#formulaBarText");
            if (formulaBar.length > 0) {
                var formula = this._sheet.getFormula(this._sheet.getActiveRowIndex(), this._sheet.getActiveColumnIndex());
                if (formula) {
                    formula = "=" + formula;
                    formulaBar.text(formula);
                }
            }
        };

        PieSparklineDialog.prototype._applySetting = function () {
            var range = this._element.find(".pie-percentage").val();
            var colorlistLen = this._element.find(".pie-colors-list").children().length;
            var params = [], i;
            params.push(range);
            for (i = 0; i < colorlistLen; i++) {
                var index = i + 1;
                var selectedItem = $(".pie-color-picker" + index + "-widget").colorpicker('option').selectedItem;
                if (colorlistLen === 1 && selectedItem.baseColor === this._defaultValue.color) {
                    //do nothing.
                } else {
                    if (selectedItem && selectedItem.color) {
                        params.push(selectedItem.color);
                    }
                }
            }
            var formula = "=PIESPARKLINE(" + params[0];
            for (i = 1; i < params.length; i++) {
                formula += ",\"" + params[i] + "\"";
            }
            formula += ")";
            designer.actions.doAction("setFormulaSparkline", designer.wrapper.spread, {
                formula: formula,
                dataRange: range,
                type: 0 /* pie */
            });

            this._updateFormulaBar();
            this.close();
            designer.wrapper.setFocusToSpread();
        };

        PieSparklineDialog.prototype._attachEvent = function () {
            var self = this;
            this._element.find(".add-pie-color").bind("click", function () {
                self._addPieColor();
            });
        };

        PieSparklineDialog.prototype._addPieColor = function (isFirst) {
            var editPieColorIcons = this._element.find(".add-pie-color");
            if (isFirst) {
                editPieColorIcons.addClass("add-pie-color");
            } else {
                editPieColorIcons.addClass("remove-pie-color").removeClass("add-pie-color");
            }

            var parent = this._element.find(".pie-colors-list");
            var colorIndex = this._getColorIndex();
            var container = $("<div>").addClass("pie-color").data("value", colorIndex).appendTo(parent);
            $("<label>").text(designer.res.pieSparklineDialog.color + " " + colorIndex).addClass("pie-color-column").appendTo(container);
            var specialClass = "pie-color-picker" + colorIndex;
            var colorPickerContainer = $("<div>").addClass("pie-color-picker").appendTo(container);
            this._createColorPicker(colorPickerContainer, specialClass);

            var editIconContainer = $("<div>").addClass("add-pie-color").appendTo(container);
            $("<span>").addClass("ui-icon ui-icon-plus").appendTo(editIconContainer);

            var self = this;
            $(editIconContainer).bind("click", function () {
                self._addPieColor();
            });

            this._element.find(".remove-pie-color").unbind();
            this._element.find(".remove-pie-color").bind("click", function (evt) {
                self._removePieColor(evt);
            });
        };

        PieSparklineDialog.prototype._removePieColor = function (evt) {
            var self = this;
            var parent = $(evt.target).parents("div.pie-color");
            var index = parent.data('value');
            var temp = $(".pie-color-picker" + index + "-widget");
            if (temp.length > 0) {
                temp.colorpicker("destroy");
                temp.parents("div.color-picker-popup").remove();
            }
            if (parent && parent.length !== 0) {
                $(evt.target).parents("div.pie-color").remove();
            }

            self._resetColorPicker();
        };

        PieSparklineDialog.prototype._resetColorPicker = function () {
            var prefix = designer.res.pieSparklineDialog.color;
            var labels = this._element.find(".pie-colors-list label");
            var len = labels.length;
            for (var i = 1; i <= len; i++) {
                //reset label text
                $(labels[i - 1]).text(prefix + " " + i);

                //reset preview span class
                var pieColor = $(labels[i - 1]).parents("div.pie-color");
                var newSpanClass = "pie-color-picker" + i;
                var colorSpan = pieColor.find("span.color-picker-preview");
                if (colorSpan.length > 0) {
                    colorSpan.removeClass(colorSpan.attr("class")).addClass("color-picker-preview" + " " + newSpanClass);
                }

                //reset color picker widget class
                var newWidgetClass = "pie-color-picker" + i + "-widget";
                var widgets = $("." + this._commonWidgetClass);
                if (widgets.length > 0 && widgets[i - 1]) {
                    $(widgets[i - 1]).removeClass($(widgets[i - 1]).attr("class")).addClass(this._commonWidgetClass + " " + newWidgetClass);
                }

                //reset color picker index
                pieColor.data("value", i);
            }
        };

        PieSparklineDialog.prototype._createColorPicker = function (parent, special) {
            var self = this;
            var widgetClass = special + "-widget";
            var container = $('<div></div>').addClass('color-picker-container');
            var content = $('<span></span>').appendTo(container);
            $('<span></span>').addClass("color-picker-preview" + " " + special).appendTo(content);
            var popup = $('<div></div>').addClass('color-picker-popup').appendTo(container);
            var picker = $('<div></div>').colorpicker({
                valueChanged: function (e, value) {
                    var previewColor = value.color === undefined ? "transparent" : value.color;
                    self._element.find('.pie-color-picker' + self._colorPickerIndex).css('background-color', previewColor);
                },
                choosedColor: function (e, value) {
                    container.comboframe('close');
                },
                openColorDialog: function (e, value) {
                    container.comboframe('close');
                }
            }).addClass(this._commonWidgetClass + " " + widgetClass).appendTo(popup);
            picker.colorpicker("option", "themeColors", designer.wrapper.getThemeColors());
            container.comboframe().click(function (e) {
                container.comboframe('open');

                //get picker index
                var pieColor = $(e.target).parents("div.pie-color");
                self._colorPickerIndex = pieColor.data('value');
            });

            parent.append(container);
            return picker;
        };

        PieSparklineDialog.prototype._getColorIndex = function () {
            //"Color 1" always exist. All color name sort ascend.
            var prefix = designer.res.pieSparklineDialog.color;
            var labels = this._element.find(".pie-colors-list label");
            for (var i = labels.length; i > 0; i--) {
                var labelText = $(labels[i - 1]).text();
                if (labelText === prefix + " " + i) {
                    return i + 1;
                }
            }
            return 1;
        };
        return PieSparklineDialog;
    })(designer.BaseDialog);
    designer.PieSparklineDialog = PieSparklineDialog;

    var AreaSparklineDialog = (function (_super) {
        designer.extends(AreaSparklineDialog, _super);
        function AreaSparklineDialog() {
            _super.call(this, (dialog2HtmlPath), '.area-sparkline-dialog');
        }

        AreaSparklineDialog.prototype._initOptions = function () {
            var self = this;
            return {
                modal: true,
                title: designer.res.areaSparklineDialog.areaSparklineSetting,
                width: "500px",
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
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

        AreaSparklineDialog.prototype._applySetting = function () {
            var points = this._element.find(".area-data-range").val();
            var mini = this._element.find(".area-min-value").val();
            var maxi = this._element.find(".area-max-value").val();
            var line1 = this._element.find(".area-line1-value").val();
            var line2 = this._element.find(".area-line2-value").val();

            var positiveSelectedItem = $(".positive-color-picker").colorpicker('option').selectedItem;
            var colorPositive = "";
            if (positiveSelectedItem && positiveSelectedItem.color && positiveSelectedItem.baseColor !== this._defaultValue.colorPositive) {
                colorPositive = "\"" + positiveSelectedItem.color + "\"";
            }

            var negativeSelectedItem = $(".negative-color-picker").colorpicker('option').selectedItem;
            var colorNegative = "";
            if (negativeSelectedItem && negativeSelectedItem.color && negativeSelectedItem.baseColor !== this._defaultValue.colorNegative) {
                colorNegative = "\"" + negativeSelectedItem.color + "\"";
            }
            var paramArr = [points, mini, maxi, line1, line2, colorPositive, colorNegative];
            var formula = this._getFormula(paramArr);
            designer.actions.doAction("setFormulaSparkline", designer.wrapper.spread, {
                formula: formula,
                dataRange: points,
                type: 1 /* area */
            });

            this._updateFormulaBar();
            this.close();
            designer.wrapper.setFocusToSpread();
        };

        AreaSparklineDialog.prototype._getFormula = function (params) {
            var len = params.length;
            while (len > 0 && params[len - 1] === "") {
                len--;
            }
            var temp = "";
            for (var i = 0; i < len; i++) {
                temp += params[i];
                if (i !== len - 1) {
                    temp += ",";
                }
            }
            return "=AREASPARKLINE(" + temp + ")";
        };

        AreaSparklineDialog.prototype._beforeOpen = function (args) {
            this._sheet = designer.wrapper.spread.getActiveSheet();
            if (!this._sheet) {
                return;
            }
            if (!args[0]) {
                return;
            }
            var list = this._inputList;
            var row = args[0].row;
            var col = args[0].col;
            var expr = designer.util.parseFormulaSparkline(row, col);
            if (expr.arguments) {
                var formulaArgs = expr.arguments;
                var len = list.length;
                for (var i = 0; i < len; i++) {
                    if (formulaArgs[i]) {
                        this._element.find(list[i]).val(designer.util.unParseFormula(formulaArgs[i], row, col));
                    } else {
                        this._element.find(list[i]).val("");
                    }
                }
                var colorItem = null;
                var positiveColor = SparklineDialogHelper.parseColorExpression(formulaArgs[5], row, col);
                if (!positiveColor) {
                    positiveColor = this._defaultValue.colorPositive;
                }
                try {
                    colorItem = designer.ColorHelper.parse(positiveColor, this._sheet.currentTheme().colors());
                } catch (ex) {
                }
                $(".positive-color-picker").colorpicker('option', 'selectedItem', colorItem);
                this._element.find(".positive-color-span").css('background-color', colorItem.color);

                var negativeColor = SparklineDialogHelper.parseColorExpression(formulaArgs[6], row, col);
                if (!negativeColor) {
                    negativeColor = this._defaultValue.colorNegative;
                }
                try {
                    colorItem = designer.ColorHelper.parse(negativeColor, this._sheet.currentTheme().colors());
                } catch (ex) {
                }
                $(".negative-color-picker").colorpicker('option', 'selectedItem', colorItem);
                this._element.find(".negative-color-span").css("background-color", colorItem.color);
            }
        };

        AreaSparklineDialog.prototype._init = function () {
            this._inputList = [".area-data-range", ".area-min-value", ".area-max-value", ".area-line1-value", ".area-line2-value"];
            this._createColorPicker(this._element.find(".positive-color"), "positive-color");
            this._createColorPicker(this._element.find(".negative-color"), "negative-color");
            this._defaultValue = { colorPositive: "#787878", colorNegative: "#CB0000" };
        };

        AreaSparklineDialog.prototype._updateFormulaBar = function () {
            var formulaBar = $("#formulaBarText");
            if (formulaBar.length > 0) {
                var formula = this._sheet.getFormula(this._sheet.getActiveRowIndex(), this._sheet.getActiveColumnIndex());
                if (formula) {
                    formula = "=" + formula;
                    formulaBar.text(formula);
                }
            }
        };

        AreaSparklineDialog.prototype._createColorPicker = function (parent, special) {
            var self = this;
            var newPreviewSpanClass = special + "-span";
            var container = $('<div></div>').addClass('area-color-picker-container');
            var content = $('<span></span>').appendTo(container);
            $('<span></span>').addClass("area-color-picker-preview" + " " + newPreviewSpanClass).appendTo(content);
            var popup = $('<div></div>').addClass('area-color-picker-popup').appendTo(container);
            var newColorPickerClass = special + "-picker";
            var picker = $('<div></div>').colorpicker({
                valueChanged: function (e, value) {
                    var previewColor = value.color === undefined ? "transparent" : value.color;
                    self._element.find('.' + newPreviewSpanClass).css('background-color', previewColor);
                },
                choosedColor: function (e, value) {
                    container.comboframe('close');
                },
                openColorDialog: function (e, value) {
                    container.comboframe('close');
                }
            }).addClass(newColorPickerClass).appendTo(popup);
            picker.colorpicker("option", "themeColors", designer.wrapper.getThemeColors());
            container.comboframe().click(function (e) {
                container.comboframe('open');
            });

            parent.append(container);
        };
        return AreaSparklineDialog;
    })(designer.BaseDialog);
    designer.AreaSparklineDialog = AreaSparklineDialog;

    var ScatterSparklineDialog = (function (_super) {
        designer.extends(ScatterSparklineDialog, _super);
        function ScatterSparklineDialog() {
            _super.call(this, (dialog2HtmlPath), '.scatter-sparkline-dialog');
            this._colorValueChanged = "ColorValueChanged";
        }

        ScatterSparklineDialog.prototype._initOptions = function () {
            var self = this;
            return {
                modal: true,
                title: designer.res.scatterSparklineDialog.scatterSparklineSetting,
                width: "600px",
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
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

        ScatterSparklineDialog.prototype._init = function () {
            this._inputList = [
                ".scatter-points1", ".scatter-points2", ".scatter-minx", ".scatter-maxx",
                ".scatter-miny", ".scatter-maxy", ".scatter-hline", ".scatter-vline", ".scatter-xmin-zone",
                ".scatter-xmax-zone", ".scatter-ymin-zone", ".scatter-ymax-zone"];
            this._createColorPicker(this._element.find(".scatter-color1"), "scatter-color1");
            this._createColorPicker(this._element.find(".scatter-color2"), "scatter-color2");
            this._defaultValue = {
                tags: false,
                drawSymbol: true,
                drawLines: false,
                dash: false,
                color1: "#969696",
                color2: "#CB0000"
            };
            this._attachEvent();
        };

        ScatterSparklineDialog.prototype._applySetting = function () {
            var paraCache = this._paraPool;
            var params = "";
            for (var i = 0; i < paraCache.length; i++) {
                var item = paraCache[i];
                if (item !== undefined && item !== null) {
                    params += item + ",";
                } else {
                    params += ",";
                }
            }
            params = this._removeContinuousComma(params);
            var formula = "=SCATTERSPARKLINE(" + params + ")";
            designer.actions.doAction("setFormulaSparkline", designer.wrapper.spread, {
                formula: formula,
                dataRange: this._paraPool[0],
                type: 2 /* scatter */
            });

            this._updateFormulaBar();
            this.close();
            designer.wrapper.setFocusToSpread();
        };

        ScatterSparklineDialog.prototype._removeContinuousComma = function (parameter) {
            var len = parameter.length;
            while (len > 0 && parameter[len - 1] === ",") {
                len--;
            }
            return parameter.substr(0, len);
        };

        ScatterSparklineDialog.prototype._attachEvent = function () {
            var self = this, element = self._element;
            element.find(".scatter-points1").keyup(function () {
                self._paraPool[0] = $(this).val();
            });
            element.find(".scatter-points2").keyup(function () {
                self._paraPool[1] = $(this).val();
            });
            element.find(".scatter-minx").keyup(function () {
                self._paraPool[2] = $(this).val();
            });
            element.find(".scatter-maxx").keyup(function () {
                self._paraPool[3] = $(this).val();
            });
            element.find(".scatter-miny").keyup(function () {
                self._paraPool[4] = $(this).val();
            });
            element.find(".scatter-maxy").keyup(function () {
                self._paraPool[5] = $(this).val();
            });
            element.find(".scatter-hline").keyup(function () {
                self._paraPool[6] = $(this).val();
            });
            element.find(".scatter-vline").keyup(function () {
                self._paraPool[7] = $(this).val();
            });
            element.find(".scatter-xmin-zone").keyup(function () {
                self._paraPool[8] = $(this).val();
            });
            element.find(".scatter-xmax-zone").keyup(function () {
                self._paraPool[9] = $(this).val();
            });
            element.find(".scatter-ymin-zone").keyup(function () {
                self._paraPool[10] = $(this).val();
            });
            element.find(".scatter-ymax-zone").keyup(function () {
                self._paraPool[11] = $(this).val();
            });

            element.find(".scatter-tags").change(function () {
                self._paraPool[12] = $(this).prop("checked");
            });
            element.find(".scatter-drawsymbol").change(function () {
                self._paraPool[13] = $(this).prop("checked");
            });
            element.find(".scatter-drawlines").change(function () {
                self._paraPool[14] = $(this).prop("checked");
            });
            $(".scatter-point1").bind(this._colorValueChanged, function (e, args) {
                var previewColor = args.value && args.value.color ? args.value.color : "transparent";
                self._paraPool[15] = "\"" + previewColor + "\"";
            });
            $(".scatter-point2").bind(this._colorValueChanged, function (e, args) {
                var previewColor = args.value && args.value.color ? args.value.color : "tranparent";
                self._paraPool[16] = "\"" + previewColor + "\"";
            });
            element.find(".scatter-dash").change(function () {
                self._paraPool[17] = $(this).prop("checked");
            });
        };

        ScatterSparklineDialog.prototype._beforeOpen = function (args) {
            this._paraPool = [];
            this._sheet = designer.wrapper.spread.getActiveSheet();
            if (!this._sheet) {
                return;
            }
            if (!args[0]) {
                return;
            }
            var row = args[0].row;
            var col = args[0].col;
            var expr = designer.util.parseFormulaSparkline(row, col);
            if (expr.arguments) {
                var formulaArgs = expr.arguments;
                var inputList = this._inputList;
                var inputlength = inputList.length;
                for (var i = 0; i < inputlength; i++) {
                    var formula = "";
                    if (formulaArgs[i]) {
                        formula = designer.util.unParseFormula(formulaArgs[i], row, col);
                    }
                    this._element.find(inputList[i]).val(formula);
                    this._paraPool.push(formula);
                }
                var tags = null;
                var drawSymbol = null;
                var drawLines = null;
                var dashLine = null;

                if (formulaArgs[12]) {
                    tags = formulaArgs[12].type === Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[12].value : null;
                }
                if (formulaArgs[13]) {
                    drawSymbol = formulaArgs[13].type === Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[13].value : null;
                }
                if (formulaArgs[14]) {
                    drawLines = formulaArgs[14].type === Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[14].value : null;
                }
                var color1 = SparklineDialogHelper.parseColorExpression(formulaArgs[15], row, col);
                var color2 = SparklineDialogHelper.parseColorExpression(formulaArgs[16], row, col);
                if (formulaArgs[17]) {
                    dashLine = formulaArgs[17].type === Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[17].value : null;
                }

                var color1Str = color1 ? "\"" + color1 + "\"" : null;
                var color2Str = color2 ? "\"" + color2 + "\"" : null;

                this._updateCheckBox("scatter-tags", tags !== null ? tags : this._defaultValue.tags); //tags
                this._updateCheckBox("scatter-drawsymbol", drawSymbol !== null ? drawSymbol : this._defaultValue.drawSymbol); //draw symbol
                this._updateCheckBox("scatter-drawlines", drawLines !== null ? drawLines : this._defaultValue.drawLines); //draw lines
                this._updateCheckBox("scatter-dash", dashLine !== null ? dashLine : this._defaultValue.dash); //dash
                this._updateColorPicker("scatter-color1", (color1 !== null) ? color1 : this._defaultValue.color1);
                this._updateColorPicker("scatter-color2", (color2 !== null) ? color2 : this._defaultValue.color2);
                this._paraPool.push(tags, drawSymbol, drawLines, color1Str, color2Str, dashLine);
            }
        };

        ScatterSparklineDialog.prototype._updateColorPicker = function (ele, value) {
            var colorPicker = $("." + ele + "-picker");
            if (colorPicker.length === 0) {
                return;
            }
            if (value) {
                var colorItem = null;
                try {
                    colorItem = designer.ColorHelper.parse(value, this._sheet.currentTheme().colors());
                } catch (ex) {
                }
                if (colorItem && colorItem.color) {
                    colorPicker.colorpicker('option', 'selectedItem', colorItem);
                    this._element.find("." + ele + "-span").css("background-color", colorItem.color);
                }
            } else {
                colorPicker.colorpicker('option', 'selectedItem', null);
                this._element.find("." + ele + "-span").css("background-color", "transparent");
            }
        };

        ScatterSparklineDialog.prototype._createColorPicker = function (parent, special) {
            var self = this;
            var newPreviewSpanClass = special + "-span";
            var container = $('<div></div>').addClass('scatter-color-picker-container');
            var content = $('<span></span>').appendTo(container);
            $('<span></span>').addClass("scatter-color-picker-preview" + " " + newPreviewSpanClass).appendTo(content);
            var popup = $('<div></div>').addClass('scatter-color-picker-popup').appendTo(container);
            var newColorPickerClass = special + "-picker";
            var picker = $('<div></div>').colorpicker({
                valueChanged: function (e, value) {
                    var previewColor = value.color === undefined ? "transparent" : value.color;
                    if (e.target.className === "scatter-color1-picker") {
                        self._paraPool[15] = "\"" + previewColor + "\"";
                    } else {
                        self._paraPool[16] = "\"" + previewColor + "\"";
                    }

                    self._element.find('.' + newPreviewSpanClass).css('background-color', previewColor);
                    $(this).trigger(self._colorValueChanged, { value: value });
                },
                choosedColor: function (e, value) {
                    container.comboframe('close');
                },
                openColorDialog: function (e, value) {
                    container.comboframe('close');
                }
            }).addClass(newColorPickerClass).appendTo(popup);
            picker.colorpicker("option", "themeColors", designer.wrapper.getThemeColors());
            container.comboframe().click(function (e) {
                container.comboframe('open');
            });

            parent.append(container);
        };

        ScatterSparklineDialog.prototype._updateFormulaBar = function () {
            var formulaBar = $("#formulaBarText");
            if (formulaBar.length > 0) {
                var formula = this._sheet.getFormula(this._sheet.getActiveRowIndex(), this._sheet.getActiveColumnIndex());
                if (formula) {
                    formula = "=" + formula;
                    formulaBar.text(formula);
                }
            }
        };

        ScatterSparklineDialog.prototype._updateTextBox = function (ele, value) {
            var element = this._element.find("." + ele);
            if (value !== undefined) {
                element.val(value);
            } else {
                element.val("");
            }
        };

        ScatterSparklineDialog.prototype._updateCheckBox = function (ele, value, defaultValue) {
            if (value !== undefined) {
                this._element.find("." + ele).prop("checked", value);
            } else {
                this._element.find("." + ele).prop("checked", defaultValue);
            }
        };
        return ScatterSparklineDialog;
    })(designer.BaseDialog);
    designer.ScatterSparklineDialog = ScatterSparklineDialog;

    var CompatibleStyleSettingDialog = (function (_super) {
        designer.extends(CompatibleStyleSettingDialog, _super);
        function CompatibleStyleSettingDialog() {
            _super.call(this, (dialog2HtmlPath), '.compatible-style-setting');
        }

        CompatibleStyleSettingDialog.prototype._initOptions = function () {
            var self = this;
            return {
                modal: true,
                title: designer.res.compatibleSparklineDialog.styleSetting,
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
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

        CompatibleStyleSettingDialog.prototype._beforeOpen = function (args) {
            this._colorSets = {};
            this._sheet = designer.wrapper.spread.getActiveSheet();
            if (args[0] !== undefined) {
                var settings = args[0];
                this._setting = args[0];
                this._updateColorPicker("axis", (settings.axisColor ? settings.axisColor : settings.ac) || this._defaultValue.axis);
                this._updateColorPicker("series", (settings.seriesColor ? settings.seriesColor : settings.sc) || this._defaultValue.series);
                this._updateColorPicker("markers", (settings.markersColor ? settings.markersColor : settings.mc) || this._defaultValue.markers);
                this._updateColorPicker("negative", (settings.negativeColor ? settings.negativeColor : settings.nc) || this._defaultValue.negativePoints);
                this._updateColorPicker("first-marker", (settings.firstMarkerColor ? settings.firstMarkerColor : settings.fmc) || this._defaultValue.firstPoint);
                this._updateColorPicker("high-marker", (settings.highMarkerColor ? settings.highMarkerColor : settings.hmc) || this._defaultValue.highPoint);
                this._updateColorPicker("last-marker", (settings.lastMarkerColor ? settings.lastMarkerColor : settings.lastmc) || this._defaultValue.lastPoint);
                this._updateColorPicker("low-marker", (settings.lowMarkerColor ? settings.lowMarkerColor : settings.lowmc) || this._defaultValue.lowPoint);
                this._updateTextBox("compatible-line-weight", settings.lineWeight || settings.lw);
            }
        };

        CompatibleStyleSettingDialog.prototype._init = function () {
            this._defaultValue = {
                negativePoints: "#A52A2A",
                markers: "#244062",
                highPoint: "#0000FF",
                lowPoint: "#0000FF",
                firstPoint: "#95B3D7",
                lastPoint: "#95B3D7",
                series: "#244062",
                axis: "#000000"
            };
            this._shortDic = {
                "axiscolor": "ac",
                "firstmarkercolor": "fmc",
                "highmarkercolor": "hmc",
                "lastmarkercolor": "lastmc",
                "lowmarkercolor": "lowmc",
                "markerscolor": "mc",
                "negativecolor": "nc",
                "seriescolor": "sc",
                "lineweight": "lw"
            };
            this._createColorPicker(this._element.find(".compatible-axis"), "axis", "axisColor");
            this._createColorPicker(this._element.find(".compatible-series"), "series", "seriesColor");
            this._createColorPicker(this._element.find(".compatible-markers"), "markers", "markersColor");
            this._createColorPicker(this._element.find(".compatible-negative"), "negative", "negativeColor");
            this._createColorPicker(this._element.find(".compatible-first-marker"), "first-marker", "firstMarkerColor");
            this._createColorPicker(this._element.find(".compatible-high-marker"), "high-marker", "highMarkerColor");
            this._createColorPicker(this._element.find(".compatible-last-marker"), "last-marker", "lastMarkerColor");
            this._createColorPicker(this._element.find(".compatible-low-marker"), "low-marker", "lowMarkerColor");
            this._attachEvent();
        };

        CompatibleStyleSettingDialog.prototype._updateColorPicker = function (ele, value) {
            var colorPicker = $("." + ele + "-picker");
            if (colorPicker.length === 0) {
                return;
            }
            if (value) {
                var colorItem = null;
                try {
                    colorItem = designer.ColorHelper.parse(value, this._sheet.currentTheme().colors());
                } catch (ex) {
                }
                if (colorItem && colorItem.color) {
                    colorPicker.colorpicker('option', 'selectedItem', colorItem);
                    this._element.find("." + ele + "-span").css("background-color", colorItem.color);
                }
            } else {
                colorPicker.colorpicker('option', 'selectedItem', null);
                this._element.find("." + ele + "-span").css("background-color", "transparent");
            }
        };

        CompatibleStyleSettingDialog.prototype._updateTextBox = function (ele, value) {
            if (value !== undefined) {
                this._element.find("." + ele).val(value);
            } else {
                this._element.find("." + ele).val("");
            }
        };

        CompatibleStyleSettingDialog.prototype._attachEvent = function () {
            var self = this;
            this._element.find(".compatible-line-weight").keyup(function () {
                var value = self._element.find(".compatible-line-weight").val();
                self._colorSets["lineWeight"] = value;
            });
        };

        CompatibleStyleSettingDialog.prototype._reset = function () {
            this._updateColorPicker("axis", this._defaultValue.axis);
            this._updateColorPicker("series", this._defaultValue.series);
            this._updateColorPicker("markers", this._defaultValue.markers);
            this._updateColorPicker("negative", this._defaultValue.negativePoints);
            this._updateColorPicker("first-marker", this._defaultValue.firstPoint);
            this._updateColorPicker("high-marker", this._defaultValue.highPoint);
            this._updateColorPicker("last-marker", this._defaultValue.lastPoint);
            this._updateColorPicker("low-marker", this._defaultValue.lowPoint);
            this._updateTextBox("compatible-line-weight");
        };

        CompatibleStyleSettingDialog.prototype._applySetting = function () {
            $(this).trigger("compatibleStyleOkClick", this._colorSets);
            this._reset();
            this.close();
        };

        CompatibleStyleSettingDialog.prototype._createColorPicker = function (parent, special, property) {
            var self = this;
            var newPreviewSpanClass = special + "-span";
            var container = $('<div></div>').addClass('compatible-color-picker-container');
            var content = $('<span></span>').appendTo(container);
            $('<span></span>').addClass("compatible-color-picker-preview" + " " + newPreviewSpanClass).appendTo(content);
            var popup = $('<div></div>').addClass('compatible-color-picker-popup').appendTo(container);
            var newColorPickerClass = special + "-picker";
            var picker = $('<div></div>').colorpicker({
                valueChanged: function (e, value) {
                    var previewColor = value.color === undefined ? "transparent" : value.color;
                    self._element.find('.' + newPreviewSpanClass).css('background-color', previewColor);
                    var shortenName = self._shortDic[property.toLowerCase()];
                    if (self._setting[shortenName] !== undefined) {
                        self._colorSets[shortenName] = previewColor;
                    } else {
                        self._colorSets[property] = previewColor;
                    }
                },
                choosedColor: function (e, value) {
                    container.comboframe('close');
                },
                openColorDialog: function (e, value) {
                    container.comboframe('close');
                }
            }).addClass(newColorPickerClass).appendTo(popup);
            picker.colorpicker("option", "themeColors", designer.wrapper.getThemeColors());
            container.comboframe().click(function (e) {
                container.comboframe('open');
            });

            parent.append(container);
        };
        return CompatibleStyleSettingDialog;
    })(designer.BaseDialog);
    designer.CompatibleStyleSettingDialog = CompatibleStyleSettingDialog;

    var CompatibleSparklineDialog = (function (_super) {
        designer.extends(CompatibleSparklineDialog, _super);
        function CompatibleSparklineDialog() {
            _super.call(this, (dialog2HtmlPath), '.compatible-sparkline-dialog');
        }

        CompatibleSparklineDialog.prototype._initOptions = function () {
            var self = this;
            return {
                modal: true,
                title: designer.res.compatibleSparklineDialog.compatibleSparklineSetting,
                width: "580px",
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
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

        CompatibleSparklineDialog.prototype._beforeOpen = function (args) {
            this._sparklineName = "";
            this._sparklineSetting = {};
            this._sheet = designer.wrapper.spread.getActiveSheet();
            if (!this._sheet) {
                return;
            }
            if (!args[0]) {
                return;
            }
            var row = args[0].row;
            var col = args[0].col;
            var expr = designer.util.parseFormulaSparkline(row, col);
            if (expr) {
                if (expr.function.name) {
                    this._sparklineName = expr.function.name;
                }
                if (expr.arguments && expr.arguments.length > 0) {
                    var formulaArgs = expr.arguments;
                    this._updateTextBox("com-data", designer.util.unParseFormula(formulaArgs[0], row, col));
                    this._updateSelect("com-data-orientation", formulaArgs[1].value);
                    if (formulaArgs[2]) {
                        this._updateTextBox("com-date-axis-data", designer.util.unParseFormula(formulaArgs[2], row, col));
                    } else {
                        this._updateTextBox("com-date-axis-data");
                    }
                    if (formulaArgs[3]) {
                        this._updateSelect("com-date-axis-orientation", formulaArgs[3].value);
                    } else {
                        this._updateSelect("com-date-axis-orientation");
                    }
                    var colorExpression = SparklineDialogHelper.parseColorExpression(formulaArgs[4], row, col);
                    if (colorExpression) {
                        this._sparklineSetting = this._parseSetting(colorExpression);
                    }
                    this._updateSparklineSetting(this._sparklineSetting);
                }
            }
        };

        CompatibleSparklineDialog.prototype._parseSetting = function (jsonSetting) {
            var setting = {}, inBracket = false, inProperty = true, property = "", value = "";
            if (jsonSetting) {
                jsonSetting = jsonSetting.substr(1, jsonSetting.length - 2); //remove brace at the start and end of jsonSetting
                for (var i = 0, len = jsonSetting.length; i < len; i++) {
                    var char = jsonSetting.charAt(i);
                    if (char === ":") {
                        inProperty = false;
                    } else if (char === "," && !inBracket) {
                        setting[property] = value;
                        property = "";
                        value = "";
                        inProperty = true;
                    } else if (char === "\'" || char === "\"") {
                        //discard
                    } else {
                        if (char === "(") {
                            inBracket = true;
                        } else if (char === ")") {
                            inBracket = false;
                        }
                        if (inProperty) {
                            property += char;
                        } else {
                            value += char;
                        }
                    }
                }
                if (property) {
                    setting[property] = value;
                }
                for (var p in setting) { /* NOSONAR: ForIn */
                    var v = setting[p];
                    if (v !== null && typeof (v) !== "undefined") {
                        if (v.toUpperCase() === "TRUE") {
                            setting[p] = true;
                        } else if (v.toUpperCase() === "FALSE") {
                            setting[p] = false;
                        } else if (!isNaN(v) && isFinite(v)) {
                            setting[p] = parseFloat(v);
                        }
                    }
                }
            }
            return setting;
        };

        CompatibleSparklineDialog.prototype._reset = function () {
            this._updateSelect("com-display-emptycell-as", -1);
            this._updateCheckBox("com-display-hidden", this._defaultSetting.displayHidden);
            this._updateCheckBox("com-show-first", this._defaultSetting.showFirst);
            this._updateCheckBox("com-show-last", this._defaultSetting.showLast);
            this._updateCheckBox("com-show-high", this._defaultSetting.showHigh);
            this._updateCheckBox("com-show-low", this._defaultSetting.showLow);
            this._updateCheckBox("com-show-negative", this._defaultSetting.showNegative);
            this._updateCheckBox("com-show-markers", this._defaultSetting.showMarkers);
            this._updateCheckBox("com-show-markers", this._defaultSetting.showMarkers);
            this._updateCheckBox("com-right-to-left", this._defaultSetting.rightToLeft);
            this._updateCheckBox("com-display-xaxis", this._defaultSetting.displayXAxis);
            this._updateSelect("com-min-axis-type", -1);
            this._updateSelect("com-max-axis-type", -1);
            this._updateTextBox("com-manual-max", "");
            this._updateTextBox("com-manual-min", "");
        };

        CompatibleSparklineDialog.prototype._updateSparklineSetting = function (setting) {
            if (!setting) {
                return;
            }
            this._updateSelect("com-display-emptycell-as", setting.displayEmptyCellsAs !== undefined ? setting.displayEmptyCellsAs : setting.deca);
            this._updateCheckBox("com-display-hidden", setting.displayHidden !== undefined ? setting.displayHidden : setting.dh, this._defaultSetting.displayHidden);
            this._updateCheckBox("com-show-first", setting.showFirst !== undefined ? setting.showFirst : setting.sf, this._defaultSetting.showFirst);
            this._updateCheckBox("com-show-last", setting.showLast !== undefined ? setting.showLast : setting.slast, this._defaultSetting.showLast);
            this._updateCheckBox("com-show-high", setting.showHigh !== undefined ? setting.showHigh : setting.sh, this._defaultSetting.showHigh);
            this._updateCheckBox("com-show-low", setting.showLow !== undefined ? setting.showLow : setting.slow, this._defaultSetting.showLow);
            this._updateCheckBox("com-show-negative", setting.showNegative !== undefined ? setting.showNegative : setting.sn, this._defaultSetting.showNegative);
            this._updateCheckBox("com-show-markers", setting.showMarkers !== undefined ? setting.showMarkers : setting.sm, this._defaultSetting.showMarkers);
            this._updateCheckBox("com-right-to-left", setting.rightToLeft !== undefined ? setting.rightToLeft : setting.rtl, this._defaultSetting.rightToLeft);
            this._updateCheckBox("com-display-xaxis", setting.displayXAxis !== undefined ? setting.displayXAxis : setting.dxa, this._defaultSetting.displayXAxis);
            this._updateSelect("com-min-axis-type", setting.minAxisType !== undefined ? setting.minAxisType : setting.minat);
            this._updateSelect("com-max-axis-type", setting.maxAxisType !== undefined ? setting.maxAxisType : setting.maxat);
            this._updateTextBox("com-manual-max", setting.manualMax !== undefined ? setting.manualMax : setting.mmax);
            this._updateTextBox("com-manual-min", setting.manualMin !== undefined ? setting.manualMin : setting.mmin);

            var type = this._element.find(".com-min-axis-type").val();
            this._updateManual(type, "com-manual-min-label", "com-manual-min");
            type = this._element.find(".com-max-axis-type").val();
            this._updateManual(type, "com-manual-max-label", "com-manual-max");
        };

        CompatibleSparklineDialog.prototype._updateSelect = function (ele, value) {
            var element = this._element.find("." + ele).get(0);
            if (value !== undefined) {
                if (value >= element.length) {
                    value = element.length - 1;
                }
                element.selectedIndex = value;
            } else {
                element.selectedIndex = -1;
            }
        };

        CompatibleSparklineDialog.prototype._updateTextBox = function (ele, value) {
            var element = this._element.find("." + ele);
            if (value !== undefined) {
                element.val(value);
            } else {
                element.val("");
            }
        };

        CompatibleSparklineDialog.prototype._updateCheckBox = function (ele, value, defaultValue) {
            if (value !== undefined) {
                if (!!value) {
                    value = true;
                } else {
                    value = false;
                }
                this._element.find("." + ele).prop("checked", value);
            } else {
                this._element.find("." + ele).prop("checked", defaultValue);
            }
        };

        CompatibleSparklineDialog.prototype._updateManual = function (type, labelClass, inputClass) {
            var manualInput = this._element.find("." + inputClass);
            var manualLabel = this._element.find("." + labelClass);
            if (type !== "custom") {
                manualInput.addClass("manual-disable").attr("disabled", "disabled");
                manualLabel.addClass("manual-disable");
            } else {
                manualInput.removeClass("manual-disable").removeAttr("disabled");
                manualLabel.removeClass("manual-disable");
            }
        };

        CompatibleSparklineDialog.prototype._init = function () {
            this._element.find(".com-color-setting").button();
            this._defaultSetting = {
                displayEmptyCellsAs: 0 /* Gaps */,
                rightToLeft: false,
                displayHidden: false,
                displayXAxis: false,
                showFirst: false,
                showHigh: false,
                showLast: false,
                showLow: false,
                showNegative: false,
                showMarkers: false,
                manualMax: 0.0,
                manualMin: 0.0,
                maxAxisType: 0 /* individual */,
                minAxisType: 0 /* individual */
            };
            this._shortDic = {
                "axiscolor": "ac",
                "firstmarkercolor": "fmc",
                "highmarkercolor": "hmc",
                "lastmarkercolor": "lastmc",
                "lowmarkercolor": "lowmc",
                "markerscolor": "mc",
                "negativecolor": "nc",
                "seriescolor": "sc",
                "displayemptycellsas": "deca",
                "righttoleft": "rtl",
                "displayhidden": "dh",
                "displayxaxis": "dxa",
                "showfirst": "sf",
                "showhigh": "sh",
                "showlast": "slast",
                "showlow": "slow",
                "shownegative": "sn",
                "showmarkers": "sm",
                "manualmax": "mmax",
                "manualmin": "mmin",
                "maxaxistype": "maxat",
                "minaxistype": "minat",
                "lineweight": "lw"
            };
            if (!this._styleSettingDialog) {
                this._styleSettingDialog = new CompatibleStyleSettingDialog();
            }
            this._attachEvent();
        };

        CompatibleSparklineDialog.prototype._attachEvent = function () {
            var self = this, element = self._element;
            element.find(".com-color-setting").bind("click", function () {
                self._styleSettingDialog.open(self._sparklineSetting);
            });
            $(this._styleSettingDialog).bind("compatibleStyleOkClick", function (evt, args) {
                self._sparklineSetting = $.extend({}, self._sparklineSetting, args);
            });
            element.find(".com-display-emptycell-as").change(function () {
                var setting = self._sparklineSetting;
                var value = Sheets.Sparklines.EmptyValueStyle[self._element.find(".com-display-emptycell-as").val()];
                if (setting.deca !== undefined) {
                    setting.deca = value;
                } else {
                    setting.displayEmptyCellsAs = value;
                }
            });
            element.find(".com-display-hidden").change(function () {
                var setting = self._sparklineSetting;
                var value = self._element.find(".com-display-hidden").prop("checked");
                if (setting.dh !== undefined) {
                    setting.dh = value;
                } else {
                    setting.displayHidden = value;
                }
            });

            //show
            element.find(".com-show-first").change(function () {
                var setting = self._sparklineSetting;
                var value = self._element.find(".com-show-first").prop("checked");
                if (setting.sf !== undefined) {
                    setting.sf = value;
                } else {
                    setting.showFirst = value;
                }
            });
            element.find(".com-show-last").change(function () {
                var setting = self._sparklineSetting;
                var value = self._element.find(".com-show-last").prop("checked");
                if (setting.slast !== undefined) {
                    setting.slast = value;
                } else {
                    setting.showLast = value;
                }
            });
            element.find(".com-show-high").change(function () {
                var setting = self._sparklineSetting;
                var value = self._element.find(".com-show-high").prop("checked");
                if (setting.sh !== undefined) {
                    setting.sh = value;
                } else {
                    setting.showHigh = value;
                }
            });
            element.find(".com-show-low").change(function () {
                var setting = self._sparklineSetting;
                var value = self._element.find(".com-show-low").prop("checked");
                if (setting.slow) {
                    setting.slow = value;
                } else {
                    setting.showLow = value;
                }
            });
            element.find(".com-show-negative").change(function () {
                var setting = self._sparklineSetting;
                var value = self._element.find(".com-show-negative").prop("checked");
                if (setting.sn !== undefined) {
                    setting.sn = value;
                } else {
                    setting.showNegative = value;
                }
            });
            element.find(".com-show-markers").change(function () {
                var setting = self._sparklineSetting;
                var value = self._element.find(".com-show-markers").prop("checked");
                if (setting.sm !== undefined) {
                    setting.sm = value;
                } else {
                    setting.showMarkers = value;
                }
            });

            //group
            element.find(".com-min-axis-type").change(function () {
                var setting = self._sparklineSetting;
                var type = self._element.find(".com-min-axis-type").val();
                if (setting.minat !== undefined) {
                    setting.minat = Sheets.Sparklines.SparklineAxisMinMax[type];
                } else {
                    setting.minAxisType = Sheets.Sparklines.SparklineAxisMinMax[type];
                }
                self._updateManual(type, "com-manual-min-label", "com-manual-min");
            });
            element.find(".com-max-axis-type").change(function () {
                var setting = self._sparklineSetting;
                var type = self._element.find(".com-max-axis-type").val();
                if (setting.maxat !== undefined) {
                    setting.maxat = Sheets.Sparklines.SparklineAxisMinMax[type];
                } else {
                    setting.maxAxisType = Sheets.Sparklines.SparklineAxisMinMax[type];
                }
                self._updateManual(type, "com-manual-max-label", "com-manual-max");
            });
            element.find(".com-manual-max").keyup(function () {
                var setting = self._sparklineSetting;
                var value = self._element.find(".com-manual-max").val();
                if (setting.mmax !== undefined) {
                    setting.mmax = value;
                } else {
                    setting.manualMax = value;
                }
            });
            element.find(".com-manual-min").keyup(function () {
                var setting = self._sparklineSetting;
                var value = self._element.find(".com-manual-min").val();
                if (setting.mmin !== undefined) {
                    setting.mmin = value;
                } else {
                    setting.manualMin = value;
                }
            });
            element.find(".com-right-to-left").change(function () {
                var setting = self._sparklineSetting;
                var value = self._element.find(".com-right-to-left").prop("checked");
                if (setting.rtl !== undefined) {
                    setting.rtl = value;
                } else {
                    setting.rightToLeft = value;
                }
            });
            element.find(".com-display-xaxis").change(function () {
                var setting = self._sparklineSetting;
                var value = self._element.find(".com-display-xaxis").prop("checked");
                if (setting.dxa !== undefined) {
                    setting.dxa = value;
                } else {
                    setting.displayXAxis = value;
                }
            });
        };

        CompatibleSparklineDialog.prototype._applySetting = function () {
            //data
            var data = this._element.find(".com-data").val();
            var dataOrientation = Sheets.Sparklines.DataOrientation[this._element.find(".com-data-orientation").val()];
            var dateAxisData = this._element.find(".com-date-axis-data").val();
            var dateAxisOrientation = Sheets.Sparklines.DataOrientation[this._element.find(".com-date-axis-orientation").val()];
            if (dateAxisOrientation === undefined) {
                dateAxisOrientation = "";
            }
            var settingArray = [];
            var item;
            for (item in this._sparklineSetting) {
                if (this._sparklineSetting[item] !== undefined && this._sparklineSetting[item] !== "") {
                    settingArray.push(item + ":" + this._sparklineSetting[item]);
                }
            }
            var settingString = "";
            if (settingArray.length > 0) {
                settingString = "\"{" + settingArray.join(",") + "}\"";
            }

            var formula = "";
            if (settingString !== "") {
                formula = "=" + this._sparklineName + "(" + data + "," + dataOrientation + "," + dateAxisData + "," + dateAxisOrientation + "," + settingString + ")";
            } else {
                if (dateAxisOrientation !== "") {
                    formula = "=" + this._sparklineName + "(" + data + "," + dataOrientation + "," + dateAxisData + "," + dateAxisOrientation + ")";
                } else {
                    if (dateAxisData !== "") {
                        formula = "=" + this._sparklineName + "(" + data + "," + dataOrientation + "," + dateAxisData + ")";
                    } else {
                        formula = "=" + this._sparklineName + "(" + data + "," + dataOrientation + ")";
                    }
                }
            }
            if (formula.length >= 250) {
                settingArray = [];
                for (item in this._sparklineSetting) {
                    if (this._sparklineSetting[item] !== undefined && this._sparklineSetting[item] !== "") {
                        settingArray.push(this._shortenFormula(item, true) + ":" + this._shortenFormula(this._sparklineSetting[item]));
                    }
                    settingString = "\"{" + settingArray.join(",") + "}\"";
                    formula = "=" + this._sparklineName + "(" + data + "," + dataOrientation + "," + dateAxisData + "," + dateAxisOrientation + "," + settingString + ")";
                }
            }
            designer.actions.doAction("setFormulaSparkline", designer.wrapper.spread, {
                formula: formula,
                type: 3 /* compatible */,
                dataRange: data
            });

            this._updateFormulaBar();
            this._reset();
            this.close();
            designer.wrapper.setFocusToSpread();
        };

        CompatibleSparklineDialog.prototype._shortenFormula = function (value, isKey) {
            if (isKey) {
                var key = this._shortDic[value.toLowerCase()];
                if (key) {
                    return key;
                } else {
                    return value;
                }
            } else {
                if (value.length > 9) {
                    value = value.toLowerCase();
                    if (value.indexOf("rgb") !== -1) {
                        var arr = designer.util.parseColorString(value);
                        if (arr && arr.length > 0) {
                            var result = "#";
                            for (var i = 0; i < arr.length; i++) {
                                var temp = arr[i].toString(16);
                                if (temp.length === 1) {
                                    temp = "0" + temp;
                                }
                                result += temp;
                            }
                        }
                        if (result !== "#") {
                            return result;
                        }
                    }
                }
            }
            return value;
        };

        CompatibleSparklineDialog.prototype._updateFormulaBar = function () {
            var formulaBar = $("#formulaBarText");
            if (formulaBar.length > 0) {
                var formula = this._sheet.getFormula(this._sheet.getActiveRowIndex(), this._sheet.getActiveColumnIndex());
                if (formula) {
                    formula = "=" + formula;
                    formulaBar.text(formula);
                }
            }
        };
        return CompatibleSparklineDialog;
    })(designer.BaseDialog);
    designer.CompatibleSparklineDialog = CompatibleSparklineDialog;


    var SparklineExBaseDialog = (function (_super) {
        designer.extends(SparklineExBaseDialog, _super);
        function SparklineExBaseDialog(url, selector) {
            _super.call(this, url, selector);
            this.sheet = designer.wrapper.spread.getActiveSheet();
            this.colorValueChanged = "ColorValueChanged";
        }

        SparklineExBaseDialog.prototype.updateTextBox = function (ele, value) {
            var element = this._element.find("." + ele);
            if (value !== undefined) {
                element.val(value);
            } else {
                element.val("");
            }
        };

        SparklineExBaseDialog.prototype.updateColorPicker = function (picker, span, value) {
            var colorPicker = $("." + picker);
            if (colorPicker.length === 0) {
                return;
            }
            if (value) {
                var colorItem = null;
                try {
                    colorItem = designer.ColorHelper.parse(value, this.sheet.currentTheme().colors());
                } catch (ex) {
                }
                if (colorItem && colorItem.color) {
                    colorPicker.colorpicker('option', 'selectedItem', colorItem);
                    this._element.find("." + span).css("background-color", colorItem.color);
                }
            } else {
                colorPicker.colorpicker('option', 'selectedItem', null);
                this._element.find("." + span).css("background-color", "transparent");
            }
        };

        SparklineExBaseDialog.prototype.updateCheckBox = function (ele, value, defaultValue) {
            var val = value || defaultValue;
            this._element.find("." + ele).attr("value", val);
            this._element.find("." + ele).prop("checked", val).change();
        };

        SparklineExBaseDialog.prototype.updateSelect = function (ele, value) {
            var $ele = this._element.find("." + ele);
            if (value !== undefined) {
                $ele.val(value).change();
            }
        };

        SparklineExBaseDialog.prototype.removeContinuousComma = function (parameter) {
            var len = parameter.length;
            while (len > 0 && parameter[len - 1] === ",") {
                len--;
            }
            return parameter.substr(0, len);
        };

        SparklineExBaseDialog.prototype.updateFormulaBar = function () {
            var formulaBar = $("#formulaBarText");
            if (formulaBar.length > 0) {
                var formula = this.sheet.getFormula(this.sheet.getActiveRowIndex(), this.sheet.getActiveColumnIndex());
                if (formula) {
                    formula = "=" + formula;
                    formulaBar.text(formula);
                }
            }
        };
        SparklineExBaseDialog.prototype._setValueFromRangeSelect = function (selector, value) {
            var formula = value;
            if (value.indexOf('=') === 0) {
                formula = value.substr(1);
            }
            this._element.find(selector).val(formula);
        };
        SparklineExBaseDialog.prototype.createColorPicker = function (frame, span, picker) {
            var self = this;
            this._element.find('.' + picker).colorpicker({
                valueChanged: function (e, value) {
                    if (value.color === undefined) {
                        self._element.find('.' + span).css('background-color', "transparent");
                    } else {
                        self._element.find('.' + span).css('background-color', value.color);
                    }
                    $(this).trigger(self.colorValueChanged, { value: value });
                },
                choosedColor: function (e, value) {
                    self._element.find('.' + frame).comboframe('close');
                },
                openColorDialog: function (e, value) {
                    self._element.find('.' + frame).comboframe('close');
                }
            });
            this._element.find('.' + picker).colorpicker("option", "themeColors", designer.wrapper.getThemeColors());
            this._element.find('.' + frame).comboframe();
        };
        return SparklineExBaseDialog;
    })(designer.BaseDialog);
    designer.SparklineExBaseDialog = SparklineExBaseDialog;
    var CreateBarcodeDialog = (function (_super) {
        designer.extends(CreateBarcodeDialog, _super);
        function CreateBarcodeDialog() {
            _super.call(this, (dialog2HtmlPath), '.barcode-dialog');
        }
        var barcodeTempletes = {
            barcodePrivate: {
                QRCODE: [
                    {
                        name: 'errorCorrectionLevel',
                        type: 'select',
                        option: ['L', 'M', 'Q', 'H'],
                        defaultValue: 'L'
                    },
                    {
                        name: 'model',
                        type: 'select',
                        option: [2, 1],
                        defaultValue: '2'
                    },
                    {
                        name: 'version',
                        type: 'select',
                        dependency: 1,
                        option: [
                            creatNumArray(1, 14, true),
                            creatNumArray(1, 40, true)
                        ],
                        defaultValue: 'auto'
                    },
                    {
                        name: 'mask',
                        type: 'select',
                        option: ['auto', 0, 1, 2, 3, 4, 5, 6, 7],
                        defaultValue: 'auto'
                    },
                    {
                        name: 'connection',
                        type: 'checkbox',
                        defaultValue: false
                    },
                    {
                        name: 'connectionNo',
                        type: 'select',
                        option: creatNumArray(0, 15),
                        defaultValue: 0
                    },
                    {
                        name: 'charCode',
                        type: 'input',
                        defaultValue: ""
                    },
                    {
                        name: 'charset',
                        type: 'select',
                        option: ['UTF-8', 'Shift_JIS'],
                        defaultValue: "UTF-8"
                    },
                ],
                EAN13: [
                    {
                        name: 'showLabel',
                        type: 'checkbox',
                        defaultValue: true
                    },
                    {
                        name: 'labelPosition',
                        type: 'select',
                        option: ['top', 'bottom'],
                        dependency: 0,
                        defaultValue: 'bottom',
                    },
                    {
                        name: 'addOn',
                        type: 'input',
                        defaultValue: ''
                    },
                    {
                        name: 'addOnLabelPosition',
                        type: 'select',
                        option: ['top', 'bottom'],
                        defaultValue: 'bottom'
                    },
                    {
                        name: 'fontFamily',
                        type: 'select',
                        option: ['sans-serif', 'serif', 'monospace', 'Arial', 'Verdana', 'Times'],
                        dependency: 0,
                        defaultValue: 'sans-serif'
                    },
                    {
                        name: 'fontStyle',
                        type: 'select',
                        option: ['normal', 'italic'],
                        dependency: 0,
                        defaultValue: 'normal'

                    },
                    {
                        name: 'fontWeight',
                        type: 'select',
                        option: ['normal', 'bold'],
                        dependency: 0,
                        defaultValue: 'normal'
                    },
                    {
                        name: 'fontTextDecoration',
                        type: 'select',
                        option: ['none', 'underline', 'overline', 'line-through'],
                        dependency: 0,
                        defaultValue: 'none'
                    },
                    {
                        name: 'fontTextAlign',
                        type: 'select',
                        option: ['center', 'left', 'right', 'group'],
                        dependency: 0,
                        defaultValue: 'center'
                    },
                    {
                        name: 'fontSize',
                        type: 'select',
                        option: ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'],
                        dependency: 0,
                        defaultValue: '12'
                    }],
                EAN8: [
                    {
                        name: 'showLabel',
                        type: 'checkbox',
                        defaultValue: true
                    },
                    {
                        name: 'labelPosition',
                        type: 'select',
                        option: ['bottom', 'top'],
                        dependency: 0,
                        defaultValue: 'bottom'
                    },
                    {
                        name: 'fontFamily',
                        type: 'select',
                        option: ['sans-serif', 'serif', 'monospace', 'Arial', 'Verdana', 'Times'],
                        dependency: 0,
                        defaultValue: 'sans-serif'
                    },
                    {
                        name: 'fontStyle',
                        type: 'select',
                        option: ['normal', 'italic'],
                        dependency: 0,
                        defaultValue: 'normal'
                    },
                    {
                        name: 'fontWeight',
                        type: 'select',
                        option: ['normal', 'bold'],
                        dependency: 0,
                        defaultValue: 'normal'
                    },
                    {
                        name: 'fontTextDecoration',
                        type: 'select',
                        option: ['none', 'underline', 'overline', 'line-through'],
                        dependency: 0,
                        defaultValue: 'none'
                    },
                    {
                        name: 'fontTextAlign',
                        type: 'select',
                        option: ['center', 'left', 'right', 'group'],
                        dependency: 0,
                        defaultValue: 'center'
                    },
                    {
                        name: 'fontSize',
                        type: 'select',
                        option: ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'],
                        dependency: 0,
                        defaultValue: '12'
                    }],
                CODABAR: [
                    {
                        name: 'showLabel',
                        type: 'checkbox',
                        defaultValue: true
                    },
                    {
                        name: 'labelPosition',
                        type: 'select',
                        option: ['bottom', 'top'],
                        dependency: 0,
                        defaultValue: 'bottom'
                    },
                    {
                        name: 'checkDigit',
                        type: 'checkbox',
                        defaultValue: false
                    },
                    {
                        name: 'nwRatio',
                        type: 'select',
                        option: [3, 2],
                        defaultValue: 3
                    },
                    {
                        name: 'fontFamily',
                        type: 'select',
                        option: ['sans-serif', 'serif', 'monospace', 'Arial', 'Verdana', 'Times'],
                        dependency: 0,
                        defaultValue: 'sans-serif'
                    },
                    {
                        name: 'fontStyle',
                        type: 'select',
                        option: ['normal', 'italic'],
                        dependency: 0,
                        defaultValue: 'normal'
                    },
                    {
                        name: 'fontWeight',
                        type: 'select',
                        option: ['normal', 'bold'],
                        dependency: 0,
                        defaultValue: 'normal'
                    },
                    {
                        name: 'fontTextDecoration',
                        type: 'select',
                        option: ['none', 'underline', 'overline', 'line-through'],
                        dependency: 0,
                        defaultValue: 'none'
                    },
                    {
                        name: 'fontTextAlign',
                        type: 'select',
                        option: ['center', 'left', 'right', 'group'],
                        dependency: 0,
                        defaultValue: 'center'
                    },
                    {
                        name: 'fontSize',
                        type: 'select',
                        option: ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'],
                        dependency: 0,
                        defaultValue: '12'
                    }],
                CODE39: [
                    {
                        name: 'showLabel',
                        type: 'checkbox',
                        defaultValue: true
                    },
                    {
                        name: 'labelPosition',
                        type: 'select',
                        option: ['top', 'bottom'],
                        dependency: 0,
                        defaultValue: 'bottom'
                    },
                    {
                        name: 'labelWithStartAndStopCharacter',
                        type: 'checkbox',
                        defaultValue: false
                    },
                    {
                        name: 'checkDigit',
                        type: 'checkbox',
                        defaultValue: false
                    },
                    {
                        name: 'nwRatio',
                        type: 'select',
                        option: [3, 2],
                        defaultValue: 3
                    },
                    {
                        name: 'fullASCII',
                        type: 'checkbox',
                        defaultValue: false
                    },
                    {
                        name: 'fontFamily',
                        type: 'select',
                        option: ['sans-serif', 'serif', 'monospace', 'Arial', 'Verdana', 'Times'],
                        dependency: 0,
                        defaultValue: 'sans-serif'
                    },
                    {
                        name: 'fontStyle',
                        type: 'select',
                        option: ['normal', 'italic'],
                        dependency: 0,
                        defaultValue: 'normal'
                    },
                    {
                        name: 'fontWeight',
                        type: 'select',
                        option: ['normal', 'bold'],
                        dependency: 0,
                        defaultValue: 'normal'
                    },
                    {
                        name: 'fontTextDecoration',
                        type: 'select',
                        option: ['none', 'underline', 'overline', 'line-through'],
                        dependency: 0,
                        defaultValue: 'none'
                    },
                    {
                        name: 'fontTextAlign',
                        type: 'select',
                        option: ['center', 'left', 'right', 'group'],
                        dependency: 0,
                        defaultValue: 'center'
                    },
                    {
                        name: 'fontSize',
                        type: 'select',
                        option: ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'],
                        dependency: 0,
                        defaultValue: '12'
                    }],
                CODE93: [
                    {
                        name: 'showLabel',
                        type: 'checkbox',
                        defaultValue: true
                    },
                    {
                        name: 'labelPosition',
                        type: 'select',
                        option: ['bottom', 'top'],
                        dependency: 0,
                        defaultValue: 'bottom'
                    },
                    {
                        name: 'checkDigit',
                        type: 'checkbox',
                        defaultValue: false
                    },
                    {
                        name: 'fullASCII',
                        type: 'checkbox',
                        defaultValue: false
                    },
                    {
                        name: 'fontFamily',
                        type: 'select',
                        option: ['sans-serif', 'serif', 'monospace', 'Arial', 'Verdana', 'Times'],
                        dependency: 0,
                        defaultValue: "sans-serif"
                    },
                    {
                        name: 'fontStyle',
                        type: 'select',
                        option: ['normal', 'italic'],
                        dependency: 0,
                        defaultValue: 'normal'
                    },
                    {
                        name: 'fontWeight',
                        type: 'select',
                        option: ['normal', 'bold'],
                        dependency: 0,
                        defaultValue: 'normal'
                    },
                    {
                        name: 'fontTextDecoration',
                        type: 'select',
                        option: ['none', 'underline', 'overline', 'line-through'],
                        dependency: 0,
                        defaultValue: 'none'
                    },
                    {
                        name: 'fontTextAlign',
                        type: 'select',
                        option: ['center', 'left', 'right', 'group'],
                        dependency: 0,
                        defaultValue: 'center'
                    },
                    {
                        name: 'fontSize',
                        type: 'select',
                        option: ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'],
                        dependency: 0,
                        defaultValue: '12'
                    }],
                CODE128: [
                    {
                        name: 'showLabel',
                        type: 'checkbox',
                        defaultValue: true
                    },
                    {
                        name: 'labelPosition',
                        type: 'select',
                        option: ['top', 'bottom'],
                        dependency: 0,
                        defaultValue: 'bottom'
                    },
                    {
                        name: 'codeSet',
                        type: 'select',
                        option: ['auto', 'A', 'B', 'C'],
                        defaultValue: 'auto'
                    },
                    {
                        name: 'fontFamily',
                        type: 'select',
                        option: ['sans-serif', 'serif', 'monospace', 'Arial', 'Verdana', 'Times'],
                        dependency: 0,
                        defaultValue: 'sans-serif'
                    },
                    {
                        name: 'fontStyle',
                        type: 'select',
                        option: ['normal', 'italic'],
                        dependency: 0,
                        defaultValue: 'normal'
                    },
                    {
                        name: 'fontWeight',
                        type: 'select',
                        option: ['normal', 'bold'],
                        dependency: 0,
                        defaultValue: 'normal'
                    },
                    {
                        name: 'fontTextDecoration',
                        type: 'select',
                        option: ['none', 'underline', 'overline', 'line-through'],
                        dependency: 0,
                        defaultValue: 'none'
                    },
                    {
                        name: 'fontTextAlign',
                        type: 'select',
                        option: ['center', 'left', 'right', 'group'],
                        dependency: 0,
                        defaultValue: 'center'
                    },
                    {
                        name: 'fontSize',
                        type: 'select',
                        option: ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'],
                        dependency: 0,
                        defaultValue: '12'
                    }],
                GS1_128: [
                    {
                        name: 'showLabel',
                        type: 'checkbox',
                        defaultValue: true
                    },
                    {
                        name: 'labelPosition',
                        type: 'select',
                        option: ['top', 'bottom'],
                        dependency: 0,
                        defaultValue: 'bottom'
                    },
                    {
                        name: 'fontFamily',
                        type: 'select',
                        option: ['sans-serif', 'serif', 'monospace', 'Arial', 'Verdana', 'Times'],
                        dependency: 0,
                        defaultValue: 'sans-serif'
                    },
                    {
                        name: 'fontStyle',
                        type: 'select',
                        option: ['normal', 'italic'],
                        dependency: 0,
                        defaultValue: 'normal'
                    },
                    {
                        name: 'fontWeight',
                        type: 'select',
                        option: ['normal', 'bold'],
                        dependency: 0,
                        defaultValue: 'normal'
                    },
                    {
                        name: 'fontTextDecoration',
                        type: 'select',
                        option: ['none', 'underline', 'overline', 'line-through'],
                        dependency: 0,
                        defaultValue: 'none'
                    },
                    {
                        name: 'fontTextAlign',
                        type: 'select',
                        option: ['center', 'left', 'right', 'group'],
                        dependency: 0,
                        defaultValue: 'center'
                    },
                    {
                        name: 'fontSize',
                        type: 'select',
                        option: ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'],
                        dependency: 0,
                        defaultValue: '12'
                    }],
                CODE49: [
                    {
                        name: 'showLabel',
                        type: 'checkbox',
                        defaultValue: true
                    },
                    {
                        name: 'labelPosition',
                        type: 'select',
                        option: ['bottom', 'top'],
                        dependency: 0,
                        defaultValue: 'bottom'
                    },
                    {
                        name: 'grouping',
                        type: 'checkbox',
                        defaultValue: false
                    },
                    {
                        name: 'groupNo',
                        type: 'input',
                        defaultValue: 0
                    },
                    {
                        name: 'fontFamily',
                        type: 'select',
                        option: ['sans-serif', 'serif', 'monospace', 'Arial', 'Verdana', 'Times'],
                        dependency: 0,
                        defaultValue: 'sans-serif'
                    },
                    {
                        name: 'fontStyle',
                        type: 'select',
                        option: ['normal', 'italic'],
                        dependency: 0,
                        defaultValue: 'normal'
                    },
                    {
                        name: 'fontWeight',
                        type: 'select',
                        option: ['normal', 'bold'],
                        dependency: 0,
                        defaultValue: 'normal'
                    },
                    {
                        name: 'fontTextDecoration',
                        type: 'select',
                        option: ['none', 'underline', 'overline', 'line-through'],
                        dependency: 0,
                        defaultValue: 'none'
                    },
                    {
                        name: 'fontTextAlign',
                        type: 'select',
                        option: ['center', 'left', 'right', 'group'],
                        dependency: 0,
                        defaultValue: 'center'
                    },
                    {
                        name: 'fontSize',
                        type: 'select',
                        option: ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'],
                        dependency: 0,
                        defaultValue: '12'
                    }],
                PDF417: [
                    {
                        name: 'errorCorrectionLevel',
                        type: 'select',
                        option: ['auto', 0, 1, 2, 3, 4, 5, 6, 7, 8],
                        defaultValue: 'auto'
                    },
                    {
                        name: 'rows',
                        type: 'select',
                        option: creatNumArray(3, 90, true),
                        defaultValue: 'auto'
                    },
                    {
                        name: 'columns',
                        type: 'select',
                        option: creatNumArray(1, 30, true),
                        defaultValue: 'auto'
                    },
                    {
                        name: 'compact',
                        type: 'checkbox',
                        defaultValue: false
                    }
                ],
                DATAMATRIX: [
                    {
                        name: 'eccMode',
                        type: 'select',
                        option: ['ECC000', 'ECC050', 'ECC080', 'ECC100', 'ECC140', 'ECC200'],
                        defaultValue: 'ECC200'
                    },
                    {
                        name: 'ecc200SymbolSize',
                        type: 'select',
                        dependency: 0,
                        dependencyOrder: 5,
                        option: ['squareAuto', 'rectangularAuto', 'square10', 'square12', 'square14', 'square16',
                            'square18square20', 'square22', 'square24', 'square26', 'square32', 'square36', 'square40', 'square44', 'square48', 'square52',
                            'square64', 'square72', 'square80', 'square88', 'square96', 'square104', 'square120', 'square132', 'square144', 'rectangular8x18',
                            'rectangular8x32', 'rectangular12x26', 'rectangular12x36', 'rectangular16x36', 'rectangular16x48'],
                        defaultValue: 'squareAuto'
                    },
                    {
                        name: 'ecc200EndcodingMode',
                        type: 'select',
                        dependency: 0,
                        dependencyOrder: 5,
                        option: ['auto', 'ASCII', 'C40', 'Text', 'X12', 'EDIFACT', 'Base256'],
                        defaultValue: 'auto'
                    },
                    {
                        name: 'ecc00_140Symbole',
                        type: 'select',
                        dependency: 0,
                        dependencyOrder: 4,
                        option: ['auto', 'square9', 'square11', 'square13', 'square15', 'square17', 'square19', 'square21',
                            'square23', 'square25', 'square27', 'square29', 'square31', 'square33', 'square35', 'square37',
                            'square39', 'square41', 'square43', 'square45', 'square47', 'square49'],
                        defaultValue: 'auto'
                    },
                    {
                        name: 'structureAppend',
                        type: 'checkbox',
                        dependency: 0,
                        dependencyOrder: 5,
                        defaultValue: false
                    },
                    {
                        name: 'structureNumber',
                        type: 'select',
                        option: creatNumArray(0, 15),
                        dependency: 0,
                        dependencyOrder: 5,
                        defaultValue: 0
                    },
                    {
                        name: 'fileIdentifier',
                        type: 'select',
                        option: creatNumArray(0, 254),
                        dependency: 0,
                        dependencyOrder: 5,
                        defaultValue: 0
                    }
                ]
            }
        };

        function creatNumArray(start, end, flag) {
            var numArray = [];
            if (flag) {
                numArray.push("auto");
            }
            for (var i = start; i <= end; i++) {
                numArray.push(i);
            }
            return numArray;
        }
        CreateBarcodeDialog.prototype._createChooseDom = function (barcodeType) {
            var self = this;
            var dom;
            var chooseBarcode = barcodeTempletes.barcodePrivate[barcodeType];
            var len = chooseBarcode.length;
            if ($(".barcode-content").children().length === 0) {
                $(".barcode-content").append("<div class = 'barcode-content-left'></div><div class = 'barcode-content-right'></div>");
            }
            for (var i = 0; i < len; i++) {
                dom = $('.barcode-content-left');
                if (i >= len / 2) {
                    dom = $('.barcode-content-right');
                }
                var domObject = chooseBarcode[i];
                var labelName = domObject.name;
                var domType = domObject.type;
                var databind = designer.res.barcodeDialog[labelName];
                var label = $("<label>");
                label.html(databind);
                label.addClass('barcode-label');
                dom.append(label);
                if (domObject.dependency !== undefined) {
                    var dependencyOption = chooseBarcode[domObject.dependency];
                    var dependencyDom = $('.barcode-' + dependencyOption.name);
                    var dependencyType = dependencyOption.type;
                    if (domObject.dependencyOrder !== undefined) {
                        var dependencyOrder = dependencyOption.option[domObject.dependencyOrder];
                    }
                    var dependencyVal = dependencyDom.val();
                }
                switch (domType) {
                    case 'input':
                        var input = $("<input>");
                        input.addClass('barcode-' + labelName);
                        input.addClass('barcode-option');
                        dom.append(input);
                        break;
                    case 'checkbox':
                        var checkbox = $("<input type = 'checkbox'>");
                        checkbox.prop("checked", false);
                        checkbox.addClass('barcode-' + labelName);
                        checkbox.addClass('barcode-option');
                        checkbox.attr("value", false);
                        checkbox.click(function () {
                            $(this).attr("value", $(this).prop("checked"));
                        });
                        if (domObject.dependency !== undefined && dependencyType === 'select' && self._selectBarcodeType === 'DATAMATRIX' && dependencyVal !== 'ECC140' && dependencyVal !== 'ECC200') {
                            checkbox.prop("disabled", "disabled");
                            this._addChangeEvent(domObject, dependencyType, dependencyDom, dependencyOrder, checkbox);
                        }
                        dom.append(checkbox);
                        break;
                    case 'select':
                        var select = $("<select>");
                        select.addClass('barcode-' + labelName);
                        select.addClass('barcode-option');
                        var option = domObject.option;
                        if (domObject.dependency !== undefined) {
                            if (dependencyType === 'checkbox') {
                                if (dependencyVal === "false") {
                                    select.attr("disabled", "disabled");
                                }
                                for (var m = 0; m < option.length; m++) {
                                    select.append($('<option></option>').val(option[m]).text(option[m]));
                                }
                            }
                            else if (dependencyType === 'select') {
                                if (self._selectBarcodeType === 'DATAMATRIX' && dependencyVal !== 'ECC140' && dependencyVal !== 'ECC200') {
                                    select.attr("disabled", "disabled");
                                }
                                if (Array.isArray(option[1])) {
                                    option = option[0];
                                    for (var t = 0; t < option.length; t++) {
                                        select.append($('<option></option>').val(option[t]).text(option[t]));
                                    }
                                }
                            }
                            this._addChangeEvent(domObject, dependencyType, dependencyDom, dependencyOrder, select);
                        } else {
                            for (var f = 0; f < option.length; f++) {
                                select.append($('<option></option>').val(option[f]).text(option[f]));
                            }
                        }
                        dom.append(select);
                        break;
                }
            }
        };
        CreateBarcodeDialog.prototype._addChangeEvent = function (domObject, dependencyType, dependencyDom, dependencyOrder, selectDom) {
            if (dependencyType === 'checkbox') {
                dependencyDom.bind("change", function () {
                    var dependencyVal = dependencyDom.val();
                    selectDom.attr("disabled", (dependencyVal === "false"));
                });
            } else if (dependencyType === 'select') {
                dependencyDom.bind("change", function () {
                    var dependencyVal = dependencyDom.val();
                    if (domObject.type === 'select' && Array.isArray(domObject.option[1]) && dependencyVal) {
                        var array = domObject.option[parseInt(dependencyVal) - 1];
                        selectDom.empty();
                        for (var i = 0; i < array.length; i++) {
                            selectDom.append($('<option></option>').val(array[i]).text(array[i]));
                        }
                    } else {
                        if (dependencyOrder !== undefined) {
                            selectDom.attr("disabled", (dependencyOrder !== dependencyVal));
                        }
                    }
                });
            }
        };
        CreateBarcodeDialog.prototype._initOptions = function () {
            var self = this;
            return {
                modal: true,
                title: designer.res.barcodeDialog.barcodeDialog,
                width: 620,
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.applySetting();
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
        CreateBarcodeDialog.prototype._resetDefaultData = function () {
            var selectBarcodeType = $('.barcode-type option:selected');
            this._selectBarcodeType = selectBarcodeType.val();
            this.color = null;
            this.backgroundColor = null;
            this.updateColorPicker('barcode-color-picker', 'barcode-color-span', 'rgb(0,0,0)');
            this.updateColorPicker('barcode-backgroundcolor-picker', 'barcode-backgroundcolor-span', 'rgb(255,255,255)');

            var sheet = designer.wrapper.spread.getActiveSheet();
            var firstSel = sheet.getSelections()[0];
            this.updateTextBox('barcode-locationReference', designer.CEUtility.parseRangeToExpString(new GC.Spread.Sheets.Range(firstSel.row, firstSel.col, 1, 1), true, 0, 0, _isUseR1C1()));
            this.updateTextBox('barcode-value', '');
            this.updateTextBox('barcode-quietZoneLeft', '');
            this.updateTextBox('barcode-quietZoneRight', '');
            this.updateTextBox('barcode-quietZoneTop', '');
            this.updateTextBox('barcode-quietZoneBottom', '');
            if ($(".barcode-content-left").children().length !== 0) {
                $(".barcode-content-left").remove();
                $(".barcode-content-right").remove();
                $(".barcode-content").append('<div class = "barcode-content-left"></div><div class = "barcode-content-right"></div>');
            }
            this._createChooseDom(this._selectBarcodeType);
        };
        CreateBarcodeDialog.prototype._init = function () {
            var self = this;
            self.createColorPicker('barcode-color-frame', 'barcode-color-span', 'barcode-color-picker');
            self.createColorPicker('barcode-backgroundcolor-frame', 'barcode-backgroundcolor-span', 'barcode-backgroundcolor-picker');
            self._element.dialog('option', 'title', designer.res.barcodeDialog.barcodeDialog);
            var BarcodeType = $('.barcode-type');
            var selectBarcodeType = $('.barcode-type option:selected');
            self._selectBarcodeType = selectBarcodeType.val();
            BarcodeType.change(function () {
                self._resetDefaultData();
            });
            self._attachEvent();
            self._defaultColor = 'rgb(0,0,0)';
            self._defaultBackgroundColor = 'rgb(255,255,255)';
        };
        CreateBarcodeDialog.prototype._attachEvent = function () {
            var self = this;
            var previewColor;
            self._attachRangeSelectEvent();
            $(".barcode-color-picker").bind(self.colorValueChanged, function (e, args) {
                previewColor = args.value && args.value.color ? args.value.color : "transparent";
                self.color = previewColor;
            });
            $(".barcode-backgroundcolor-picker").bind(self.colorValueChanged, function (e, args) {
                previewColor = args.value && args.value.color ? args.value.color : "transparent";
                self.backgroundColor = previewColor;
            });
        };
        CreateBarcodeDialog.prototype._attachRangeSelectEvent = function () {
            var self = this;
            self._element.find(".rangeSelectButton").click(function () {
                if (!self._rangeSelectDialogAbsolute) {
                    self._rangeSelectDialogAbsolute = new designer.RangeSelectDialog(self, {
                        absoluteReference: true,
                        needSheetName: false
                    });
                }
                if (!self._rangeSelectDialog) {
                    self._rangeSelectDialog = new designer.RangeSelectDialog(self, {
                        absoluteReference: false,
                        needSheetName: false
                    });
                }
                if ($(this).attr('disabled') === 'disabled') {
                    return;
                }
                self.hide();
                var title = self._element.dialog('option', 'title'), callback = self._setValueFromRangeSelect,
                    existFormula;
                existFormula = self._element.find(".barcode-locationReference").val();
                self._rangeSelectDialogAbsolute.open(title, callback, existFormula, ['.barcode-locationReference']);
            });
        };
        CreateBarcodeDialog.prototype._setValueFromRangeSelect = function (selector, value) {
            var formula = value, sheet = designer.wrapper.spread.getActiveSheet();
            if (value.indexOf('=') === 0) {
                formula = value.substr(1);
            }
            var exRanges = designer.CEUtility.parseExpStringToRanges(formula, sheet)[0];
            var singleCellRange = new GC.Spread.Sheets.Range(exRanges.ranges[0].row, exRanges.ranges[0].col, 1, 1);
            formula = designer.CEUtility.parseRangeToExpString(singleCellRange, true, 0, 0, _isUseR1C1());
            if (exRanges.sheetName !== sheet.name()) {
                formula = exRanges.sheetName + "!" + formula;
            }
            this._element.find(selector).val(formula);
        };
        CreateBarcodeDialog.prototype._beforeOpen = function (args) {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var isSetting = args[0];
            var row = sheet.getActiveRowIndex();
            var col = sheet.getActiveColumnIndex();
            var expr = designer.util.parseFormulaSparkline(row, col);
            if (isSetting && expr && expr.arguments) {
                var formulaArgs = expr.arguments;
                for (var i = 0; i < formulaArgs.length; i++) {
                    if (formulaArgs[i].type === 1 /* Reference */) {
                        var formulaValue = designer.util.unParseFormula(formulaArgs[i], row, col);
                        formulaArgs[i] = {};
                        formulaArgs[i].value = formulaValue;
                        formulaArgs[i].type = 'referenceValue';
                    }
                }
                if (formulaArgs.length > 0) {
                    this._updateDialog(formulaArgs, expr.functionName);
                    return;
                }
            }
            this._resetDefaultData();
        };
        CreateBarcodeDialog.prototype._updateDialog = function (args, functionName) {
            var self = this;
            var sheet = designer.wrapper.spread.getActiveSheet();
            var argsLen = args.length;
            var barcodeDom = barcodeTempletes.barcodePrivate;
            var barcodetype = functionName.substr(3);
            if ($(".barcode-content").children().length !== 0) {
                $(".barcode-content-left").remove();
                $(".barcode-content-right").remove();
            }
            $(".barcode-content").append('<div class = "barcode-content-left"></div><div class = "barcode-content-right"></div>');
            self._createChooseDom(barcodetype);
            var correctOptionLen = barcodeDom[barcodetype].length + 7;
            if (argsLen < correctOptionLen) {
                for (var f = argsLen; f < correctOptionLen; f++) {
                    args[f] = {};
                    args[f].value = '';
                }
            }
            argsLen = args.length;
            self.updateSelect('barcode-type', barcodetype);
            self.color = args[1].value || self._defaultColor;
            self.backgroundColor = args[2].value || self._defaultBackgroundColor;
            self.updateColorPicker('barcode-color-picker', 'barcode-color-span', self.color);
            self.updateColorPicker('barcode-backgroundcolor-picker', 'barcode-backgroundcolor-span', self.backgroundColor);
            self.updateTextBox('barcode-value', args[0].value || '');
            for (var i = 3; i < argsLen - 4; i++) {
                var ele = barcodeDom[barcodetype][i - 3];
                var eleClass = 'barcode-' + ele.name;
                var eleType = ele.type;
                if (eleType === 'checkbox') {
                    self.updateCheckBox(eleClass, args[i].value === "" ? ele.defaultValue : args[i].value, false);
                }
                else if (eleType === 'input') {
                    if (typeof args[i].value === 'object' && args[i].value.array) {
                        self.updateTextBox(eleClass, '{' + args[i].value.array.toString() + '}');
                    } else {
                        self.updateTextBox(eleClass, args[i].value);
                    }

                } else {
                    self.updateSelect(eleClass, args[i].value || ele.defaultValue);
                }
            }
            self.updateTextBox('barcode-quietZoneLeft', args[argsLen - 4].value);
            self.updateTextBox('barcode-quietZoneRight', args[argsLen - 3].value);
            self.updateTextBox('barcode-quietZoneTop', args[argsLen - 2].value);
            self.updateTextBox('barcode-quietZoneBottom', args[argsLen - 1].value);
            var firstSel = sheet.getSelections()[0];
            self.updateTextBox('barcode-locationReference', designer.CEUtility.parseRangeToExpString(new GC.Spread.Sheets.Range(firstSel.row, firstSel.col, 1, 1), true, 0, 0, _isUseR1C1()));
        };
        CreateBarcodeDialog.prototype.applySetting = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var locationRefStr = this._element.find('.barcode-locationReference').val();
            if (!_checkRangeOfSparkline(sheet, locationRefStr, true, true)) {
                return;
            }
            var exRanges = designer.CEUtility.parseExpStringToRanges(locationRefStr, sheet);
            var formula = this._createFormula(sheet), locationReference = exRanges[0].ranges[0];
            designer.actions.doAction("setFormulaSparklineWithoutDatarange", designer.wrapper.spread, {
                formula: formula,
                locationRange: new GC.Spread.Sheets.Range(locationReference.row, locationReference.col, 1, 1),
                locationSheet: exRanges[0].sheetName
            });
            this.close();
        };
        CreateBarcodeDialog.prototype._createFormula = function (sheet) {
            var formula = '';
            var paraPool = [];
            var ranges = [];
            var selectBarcodeType = $('.barcode-type option:selected');
            this._selectBarcodeType = selectBarcodeType.val();
            var barcodeDom = barcodeTempletes.barcodePrivate[this._selectBarcodeType];
            var row = sheet.getActiveRowIndex();
            var col = sheet.getActiveColumnIndex();
            var valueStr = this._element.find('.barcode-value').val();
            try {
                if (this._isFormula(valueStr)) {
                    ranges = formulaToRanges(sheet, valueStr, row, col);
                    if (ranges.length > 0) {
                        paraPool.push(valueStr);
                    }
                } else {
                    if (isNaN(valueStr)) { // string
                        paraPool.push('"' + valueStr + '"');
                    } else { // number
                        paraPool.push(valueStr);
                    }
                }
            } catch (ex) {
                paraPool.push('"' + valueStr + '"');
            }
            paraPool.push('"' + (this.color || this._defaultColor) + '"');
            paraPool.push('"' + (this.backgroundColor || this._defaultBackgroundColor) + '"');
            for (var i = 0; i < barcodeDom.length; i++) {
                var str = '.barcode-' + barcodeDom[i].name;
                var value;
                if (this._element.find(str).prop("disabled")) {
                    value = '';
                } else {
                    value = this._element.find(str).val();
                }
                if (!(/^[0-9]+.?[0-9]*$/.test(value)) && value !== null && value !== '' && value !== 'true' && value !== 'false' && (value.indexOf('{') === -1)) {
                    value = '"' + value + '"';
                }
                paraPool.push(value);
            }
            paraPool.push(this._element.find('.barcode-quietZoneLeft').val());
            paraPool.push(this._element.find('.barcode-quietZoneRight').val());
            paraPool.push(this._element.find('.barcode-quietZoneTop').val());
            paraPool.push(this._element.find('.barcode-quietZoneBottom').val());
            var params = paraPool.join(',');
            formula += '=BC_' + this._selectBarcodeType.toUpperCase();
            formula += '(';
            formula += params;
            formula += ')';
            return formula;
        };
        return CreateBarcodeDialog;
    })(SparklineExBaseDialog);
    designer.CreateBarcodeDialog = CreateBarcodeDialog;
    var BulletSparklineDialog = (function (_super) {
        designer.extends(BulletSparklineDialog, _super);
        function BulletSparklineDialog() {
            _super.call(this, (dialog2HtmlPath), '.bullet-sparkline-dialog');
        }

        BulletSparklineDialog.prototype._initOptions = function () {
            var self = this;
            return {
                modal: true,
                title: designer.res.bulletSparklineDialog.bulletSparklineSetting,
                minWidth: 500,
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.applySetting();
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

        BulletSparklineDialog.prototype._beforeOpen = function () {
            this._paraPool = [];
            this._updateBulletDialog(this.sheet.getActiveRowIndex(), this.sheet.getActiveColumnIndex());
        };

        BulletSparklineDialog.prototype._updateBulletDialog = function (row, col) {
            var expr = designer.util.parseFormulaSparkline(row, col);
            if (expr && expr.arguments) {
                var formulaArgs = expr.arguments;
                if (formulaArgs && formulaArgs.length > 0) {
                    var measureValue = designer.util.unParseFormula(formulaArgs[0], row, col);

                    var targetValue = formulaArgs[1] ? designer.util.unParseFormula(formulaArgs[1], row, col) : undefined;
                    var maxiValue = formulaArgs[2] ? designer.util.unParseFormula(formulaArgs[2], row, col) : undefined;
                    var goodValue = formulaArgs[3] ? designer.util.unParseFormula(formulaArgs[3], row, col) : undefined;
                    var badValue = formulaArgs[4] ? designer.util.unParseFormula(formulaArgs[4], row, col) : undefined;
                    var forecastValue = formulaArgs[5] ? designer.util.unParseFormula(formulaArgs[5], row, col) : undefined;
                    var tickunitValue = formulaArgs[6] ? designer.util.unParseFormula(formulaArgs[6], row, col) : undefined;
                    var colorSchemeValue = formulaArgs[7] ? SparklineDialogHelper.parseColorExpression(formulaArgs[7], row, col) : undefined;
                    if (formulaArgs[8]) {
                        var verticalValue = formulaArgs[8].type === Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[8].value : null;
                    }
                    this.updateTextBox("bullet-measure", measureValue);
                    this.updateTextBox("bullet-target", targetValue);
                    this.updateTextBox("bullet-maxi", maxiValue);
                    this.updateTextBox("bullet-good", goodValue);
                    this.updateTextBox("bullet-bad", badValue);
                    this.updateTextBox("bullet-forecast", forecastValue);
                    this.updateTextBox("bullet-tickunit", tickunitValue);
                    this.updateColorPicker("bullet-color-picker", "bullet-color-span", colorSchemeValue ? colorSchemeValue : this._defaultValue.colorScheme);
                    this.updateCheckBox("bullet-vertical", verticalValue, this._defaultValue.vertical);

                    var colorSchemeString = colorSchemeValue ? "\"" + colorSchemeValue + "\"" : null;
                    this._paraPool = [
                        measureValue,
                        targetValue,
                        maxiValue,
                        goodValue,
                        badValue,
                        forecastValue,
                        tickunitValue,
                        colorSchemeString,
                        verticalValue
                    ];
                }
            } else {
                this._reset();
            }
        };

        BulletSparklineDialog.prototype._reset = function () {
            this.updateTextBox("bullet-measure", "");
            this.updateTextBox("bullet-target", "");
            this.updateTextBox("bullet-maxi", "");
            this.updateTextBox("bullet-good", "");
            this.updateTextBox("bullet-bad", "");
            this.updateTextBox("bullet-forecast", "");
            this.updateTextBox("bullet-tickunit", "");
            this.updateColorPicker("bullet-color-picker", "bullet-color-span", this._defaultValue.colorScheme);
            this.updateCheckBox("bullet-vertical", this._defaultValue.vertical);
        };

        BulletSparklineDialog.prototype._init = function () {
            this._defaultValue = { vertical: false, colorScheme: "#A0A0A0" };
            this.createColorPicker("bullet-color-frame", "bullet-color-span", "bullet-color-picker");
            this._attchEvent();
        };

        BulletSparklineDialog.prototype._attchEvent = function () {
            var self = this, element = this._element;
            element.find(".bullet-measure").keyup(function () {
                self._paraPool[0] = $(this).val();
            });
            element.find(".bullet-target").keyup(function () {
                self._paraPool[1] = $(this).val();
            });
            element.find(".bullet-maxi").keyup(function () {
                self._paraPool[2] = $(this).val();
            });
            element.find(".bullet-forecast").keyup(function () {
                self._paraPool[5] = $(this).val();
            });
            element.find(".bullet-good").keyup(function () {
                self._paraPool[3] = $(this).val();
            });
            element.find(".bullet-bad").keyup(function () {
                self._paraPool[4] = $(this).val();
            });
            element.find(".bullet-tickunit").keyup(function () {
                self._paraPool[6] = $(this).val();
            });
            $(".bullet-color-picker").bind(this.colorValueChanged, function (e, args) {
                var previewColor = args.value && args.value.color ? args.value.color : "transparent";
                self._paraPool[7] = "\"" + previewColor + "\"";
            });
            element.find(".bullet-vertical").change(function () {
                self._paraPool[8] = $(this).prop("checked");
            });
        };

        BulletSparklineDialog.prototype.applySetting = function () {
            var paraCache = this._paraPool;
            var params = "";
            for (var i = 0; i < paraCache.length; i++) {
                var item = paraCache[i];
                if (item !== undefined && item !== null) {
                    params += item + ",";
                } else {
                    params += ",";
                }
            }
            params = this.removeContinuousComma(params);
            var formula = "=BULLETSPARKLINE(" + params + ")";
            var sels = this.sheet.getSelections();
            designer.actions.doAction("setFormulaSparklineWithoutDatarange", designer.wrapper.spread, {
                formula: formula,
                type: 4 /* bullet */,
                locationRange: sels.length > 0 ? sels[0] : new Sheets.Range(0, 0, 1, 1)
            });

            designer.ribbon.updateSparkline();
            this.updateFormulaBar();
            this.close();
            designer.wrapper.setFocusToSpread();
        };
        return BulletSparklineDialog;
    })(SparklineExBaseDialog);
    designer.BulletSparklineDialog = BulletSparklineDialog;

    var SpreadSparklineDialog = (function (_super) {
        designer.extends(SpreadSparklineDialog, _super);
        function SpreadSparklineDialog() {
            _super.call(this, (dialog2HtmlPath), '.spread-sparkline-dialog');
        }

        SpreadSparklineDialog.prototype._initOptions = function () {
            var self = this;
            return {
                modal: true,
                title: designer.res.spreadSparklineDialog.spreadSparklineSetting,
                minWidth: 500,
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.applySetting();
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

        SpreadSparklineDialog.prototype._init = function () {
            this._defaultValue = {
                showAverage: false,
                style: 4 /* SpreadSparklineStyle.Poles */,
                colorScheme: "#646464",
                vertical: false
            };
            this.createColorPicker("spread-color-frame", "spread-color-span", "spread-color-picker");
            this._attachEvent();
        };

        SpreadSparklineDialog.prototype._beforeOpen = function () {
            this._paraPool = [];
            this._updateSpreadDialog(this.sheet.getActiveRowIndex(), this.sheet.getActiveColumnIndex());
        };

        SpreadSparklineDialog.prototype._attachEvent = function () {
            var self = this, element = self._element;
            element.find(".spread-points").keyup(function () {
                self._paraPool[0] = $(this).val();
            });
            element.find(".spread-style").change(function () {
                self._paraPool[4] = $(this).val();
            });
            element.find(".spread-scale-start").keyup(function () {
                self._paraPool[2] = $(this).val();
            });
            element.find(".spread-scale-end").keyup(function () {
                self._paraPool[3] = $(this).val();
            });
            $(".spread-color-picker").bind(this.colorValueChanged, function (e, args) {
                var previewColor = args.value && args.value.color ? args.value.color : "transparent";
                self._paraPool[5] = "\"" + previewColor + "\"";
            });
            element.find(".spread-show-average").change(function () {
                self._paraPool[1] = $(this).prop("checked");
            });
            element.find(".spread-vertical").change(function () {
                self._paraPool[6] = $(this).prop("checked");
            });
        };

        SpreadSparklineDialog.prototype._updateSpreadDialog = function (row, col) {
            var expr = designer.util.parseFormulaSparkline(row, col);
            if (expr && expr.arguments) {
                var formulaArgs = expr.arguments;
                if (formulaArgs && formulaArgs.length > 0) {
                    var pointsValue = designer.util.unParseFormula(formulaArgs[0], row, col);
                    if (formulaArgs[1]) {
                        var showAverageValue = formulaArgs[1].type === Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[1].value : null;
                    }
                    if (formulaArgs[2]) {
                        var scaleStartValue = designer.util.unParseFormula(formulaArgs[2], row, col);
                    }
                    if (formulaArgs[3]) {
                        var scaleEndValue = designer.util.unParseFormula(formulaArgs[3], row, col);
                    }
                    var styleValue = formulaArgs[4] ? designer.util.unParseFormula(formulaArgs[4], row, col) : null;
                    if (formulaArgs[5]) {
                        var colorSchemeValue = SparklineDialogHelper.parseColorExpression(formulaArgs[5], row, col);
                    }
                    if (formulaArgs[6]) {
                        var verticalValue = formulaArgs[6].type === Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[6].value : null;
                    }

                    this.updateTextBox("spread-points", pointsValue);
                    this.updateTextBox("spread-scale-start", scaleStartValue);
                    this.updateTextBox("spread-scale-end", scaleEndValue);
                    this.updateColorPicker("spread-color-picker", "spread-color-span", colorSchemeValue ? colorSchemeValue : this._defaultValue.colorScheme);
                    this.updateCheckBox("spread-show-average", showAverageValue, this._defaultValue.showAverage);
                    this.updateCheckBox("spread-vertical", verticalValue, this._defaultValue.vertical);
                    this.updateSelect("spread-style", styleValue ? styleValue : this._defaultValue.style);

                    var colorSchemeString = colorSchemeValue ? "\"" + colorSchemeValue + "\"" : null;
                    this._paraPool = [
                        pointsValue,
                        showAverageValue,
                        scaleStartValue,
                        scaleEndValue,
                        styleValue,
                        colorSchemeString,
                        verticalValue
                    ];
                } else {
                    this._reset();
                }
            }
        };

        SpreadSparklineDialog.prototype.applySetting = function () {
            var paraCache = this._paraPool;
            var params = "";
            for (var i = 0; i < paraCache.length; i++) {
                var item = paraCache[i];
                if (item !== undefined && item !== null) {
                    params += item + ",";
                } else {
                    params += ",";
                }
            }
            params = this.removeContinuousComma(params);
            var formula = "=SPREADSPARKLINE(" + params + ")";
            designer.actions.doAction("setFormulaSparkline", designer.wrapper.spread, {
                formula: formula,
                type: 5 /* spread */,
                dataRange: this._paraPool[0]
            });
            this.updateFormulaBar();
            this.close();
            designer.wrapper.setFocusToSpread();
        };

        SpreadSparklineDialog.prototype._reset = function () {
            this.updateTextBox("spread-points", "");
            this.updateTextBox("spread-scale-start", "");
            this.updateTextBox("spread-scale-end", "");
            this.updateColorPicker("spread-color-picker", "spread-color-span", this._defaultValue.colorScheme);
            this.updateCheckBox("spread-show-average", this._defaultValue.showAverage);
            this.updateCheckBox("spread-vertical", this._defaultValue.vertical);
            this.updateSelect("spread-style", this._defaultValue.style);
        };
        return SpreadSparklineDialog;
    })(SparklineExBaseDialog);
    designer.SpreadSparklineDialog = SpreadSparklineDialog;

    var StackedSparklineDialog = (function (_super) {
        designer.extends(StackedSparklineDialog, _super);
        function StackedSparklineDialog() {
            _super.call(this, (dialog2HtmlPath), '.stacked-sparkline-dialog');
        }

        StackedSparklineDialog.prototype._initOptions = function () {
            var self = this;
            return {
                modal: true,
                title: designer.res.stackedSparklineDialog.stackedSparklineSetting,
                minWidth: 500,
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.applySetting();
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

        StackedSparklineDialog.prototype._init = function () {
            this._defaultValue = {
                color: "#646464",
                vertical: false,
                textOrientation: 0 /* TextOrientation.Horizontal */
            };
            this.createColorPicker("stacked-color-frame", "stacked-color-span", "stacked-color-picker");
            this._attachEvent();
        };

        StackedSparklineDialog.prototype._attachEvent = function () {
            var self = this, element = this._element;
            element.find(".stacked-points").keyup(function () {
                self._paraPool[0] = $(this).val();
            });
            element.find(".stacked-color-range").keyup(function () {
                self._paraPool[1] = $(this).val();
            });
            element.find(".stacked-label-range").keyup(function () {
                self._paraPool[2] = $(this).val();
            });
            element.find(".stacked-maximum").keyup(function () {
                self._paraPool[3] = $(this).val();
            });
            element.find(".stacked-target-red").keyup(function () {
                self._paraPool[4] = $(this).val();
            });
            element.find(".stacked-target-green").keyup(function () {
                self._paraPool[5] = $(this).val();
            });
            element.find(".stacked-target-blue").keyup(function () {
                self._paraPool[6] = $(this).val();
            });
            element.find(".stacked-target-yellow").keyup(function () {
                self._paraPool[7] = $(this).val();
            });
            element.find(".stacked-highlight-position").keyup(function () {
                self._paraPool[9] = $(this).val();
            });
            element.find(".stacked-vertical").change(function () {
                self._paraPool[10] = $(this).prop("checked");
            });
            element.find(".stacked-text-orientation").change(function () {
                self._paraPool[11] = $(this).val();
            });
            element.find(".stacked-text-size").keyup(function () {
                self._paraPool[12] = $(this).val();
            });
            $(".stacked-color-picker").bind(self.colorValueChanged, function (e, args) {
                var previewColor = args.value && args.value.color ? args.value.color : "transparent";
                self._paraPool[8] = "\"" + previewColor + "\"";
            });
        };

        StackedSparklineDialog.prototype._beforeOpen = function () {
            this._paraPool = [];
            this.sheet = designer.wrapper.spread.getActiveSheet();
            this._updateStackedDialog(this.sheet.getActiveRowIndex(), this.sheet.getActiveColumnIndex());
        };

        StackedSparklineDialog.prototype.applySetting = function () {
            var paraCache = this._paraPool;
            var params = "";
            for (var i = 0; i < paraCache.length; i++) {
                var item = paraCache[i];
                if (item !== undefined && item !== null) {
                    params += item + ",";
                } else {
                    params += ",";
                }
            }
            params = this.removeContinuousComma(params);
            var formula = "=STACKEDSPARKLINE(" + params + ")";
            designer.actions.doAction("setFormulaSparkline", designer.wrapper.spread, {
                formula: formula,
                type: 6 /* stacked */,
                dataRange: this._paraPool[0]
            });
            this.updateFormulaBar();
            this.close();
            designer.wrapper.setFocusToSpread();
        };

        StackedSparklineDialog.prototype._updateStackedDialog = function (row, col) {
            var expr = designer.util.parseFormulaSparkline(row, col);
            if (expr && expr.arguments) {
                var formulaArgs = expr.arguments;
                if (formulaArgs && formulaArgs.length > 0) {
                    var pointsValue = designer.util.unParseFormula(formulaArgs[0], row, col);
                    var colorRangeValue = formulaArgs[1] ? designer.util.unParseFormula(formulaArgs[1], row, col) : undefined;
                    var labelRangeValue = formulaArgs[2] ? designer.util.unParseFormula(formulaArgs[2], row, col) : undefined;
                    var maximumValue = formulaArgs[3] ? designer.util.unParseFormula(formulaArgs[3], row, col) : undefined;
                    var targetRedValue = formulaArgs[4] ? designer.util.unParseFormula(formulaArgs[4], row, col) : undefined;
                    var targetGreenValue = formulaArgs[5] ? designer.util.unParseFormula(formulaArgs[5], row, col) : undefined;
                    var targetBlueValue = formulaArgs[6] ? designer.util.unParseFormula(formulaArgs[6], row, col) : undefined;
                    var targetYellowValue = formulaArgs[7] ? designer.util.unParseFormula(formulaArgs[7], row, col) : undefined;
                    var colorValue = formulaArgs[8] ? SparklineDialogHelper.parseColorExpression(formulaArgs[8], row, col) : undefined;
                    var highlightPositionValue = formulaArgs[9] ? designer.util.unParseFormula(formulaArgs[9], row, col) : undefined;
                    if (formulaArgs[10]) {
                        var verticalValue = formulaArgs[10].type === Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[10].value : null;
                    }
                    var textOrientationValue = formulaArgs[11] ? designer.util.unParseFormula(formulaArgs[11], row, col) : undefined;
                    var textSizeValue = formulaArgs[12] ? designer.util.unParseFormula(formulaArgs[12], row, col) : undefined;
                    this.updateTextBox("stacked-points", pointsValue);
                    this.updateTextBox("stacked-color-range", colorRangeValue);
                    this.updateTextBox("stacked-label-range", labelRangeValue);
                    this.updateTextBox("stacked-maximum", maximumValue);
                    this.updateTextBox("stacked-target-red", targetRedValue);
                    this.updateTextBox("stacked-target-green", targetGreenValue);
                    this.updateTextBox("stacked-target-blue", targetBlueValue);
                    this.updateTextBox("stacked-target-yellow", targetYellowValue);
                    this.updateColorPicker("stacked-color-picker", "stacked-color-span", colorValue ? colorValue : this._defaultValue.color);
                    this.updateTextBox("stacked-highlight-position", highlightPositionValue);
                    this.updateCheckBox("stacked-vertical", verticalValue, this._defaultValue.vertical);
                    this.updateSelect("stacked-text-orientation", textOrientationValue ? textOrientationValue : this._defaultValue.textOrientation);
                    this.updateTextBox("stacked-text-size", textSizeValue);

                    var colorString = colorValue ? "\"" + colorValue + "\"" : null;
                    this._paraPool = [
                        pointsValue,
                        colorRangeValue,
                        labelRangeValue,
                        maximumValue,
                        targetRedValue,
                        targetGreenValue,
                        targetBlueValue,
                        targetYellowValue,
                        colorString,
                        highlightPositionValue,
                        verticalValue,
                        textOrientationValue,
                        textSizeValue
                    ];
                }
            } else {
                this._reset();
            }
        };

        StackedSparklineDialog.prototype._reset = function () {
            this.updateTextBox("stacked-points", "");
            this.updateTextBox("stacked-color-range", "");
            this.updateTextBox("stacked-label-range", "");
            this.updateTextBox("stacked-maximum", "");
            this.updateTextBox("stacked-target-red", "");
            this.updateTextBox("stacked-target-green", "");
            this.updateTextBox("stacked-target-blue", "");
            this.updateTextBox("stacked-target-yellow", "");
            this.updateColorPicker("stacked-color-picker", "stacked-color-span", this._defaultValue.color);
            this.updateTextBox("stacked-highlight-position", "");
            this.updateCheckBox("stacked-vertical", this._defaultValue.vertical);
            this.updateTextBox("stacked-text-orientation", this._defaultValue.textOrientation);
            this.updateTextBox("stacked-text-size", "");
        };
        return StackedSparklineDialog;
    })(SparklineExBaseDialog);
    designer.StackedSparklineDialog = StackedSparklineDialog;

    var BarBaseSparklineDialog = (function (_super) {
        designer.extends(BarBaseSparklineDialog, _super);
        function BarBaseSparklineDialog(url, selector) {
            _super.call(this, url, selector);
        }

        BarBaseSparklineDialog.prototype._init = function () {
            this._defaultColor = "gray";
            this.createColorPicker("barbase-color-frame", "barbase-color-span", "barbase-color-picker");
            this._attachEvent();
        };

        BarBaseSparklineDialog.prototype._beforeOpen = function () {
            this._paraPool = [];
            this.sheet = designer.wrapper.spread.getActiveSheet();
            this._updateBarBaseSparklineDialog(this.sheet.getActiveRowIndex(), this.sheet.getActiveColumnIndex());
        };

        BarBaseSparklineDialog.prototype._updateBarBaseSparklineDialog = function (row, col) {
            var expr = designer.util.parseFormulaSparkline(row, col);
            if (expr && expr.arguments) {
                var formulaArgs = expr.arguments;
                if (formulaArgs && formulaArgs.length > 0) {
                    var value = designer.util.unParseFormula(formulaArgs[0], row, col);
                    var color = formulaArgs[1] ? SparklineDialogHelper.parseColorExpression(formulaArgs[1], row, col) : undefined;

                    this.updateTextBox("barbase-value", value);
                    this.updateColorPicker("barbase-color-picker", "barbase-color-span", color === null ? this._defaultColor : color);

                    var colorString = color ? "\"" + color + "\"" : null;
                    this._paraPool = [value, colorString];
                }
            } else {
                this._reset();
            }
        };

        BarBaseSparklineDialog.prototype._attachEvent = function () {
            var self = this, element = this._element;
            element.find(".barbase-value").keyup(function () {
                self._paraPool[0] = $(this).val();
            });
            $(".barbase-color-picker").bind(self.colorValueChanged, function (e, args) {
                var previewColor = args.value && args.value.color ? args.value.color : "transparent";
                self._paraPool[1] = "\"" + previewColor + "\"";
            });
        };

        BarBaseSparklineDialog.prototype._reset = function () {
            this.updateTextBox("barbase-value", "");
            this.updateColorPicker("barbase-color-picker", "barbase-color-span", this._defaultColor);
        };

        BarBaseSparklineDialog.prototype.applySetting = function (type) {
            var paraCache = this._paraPool;
            var params = "";
            for (var i = 0; i < paraCache.length; i++) {
                var item = paraCache[i];
                if (item !== undefined && item !== null) {
                    params += item + ",";
                } else {
                    params += ",";
                }
            }
            params = this.removeContinuousComma(params);
            var formula;
            if (type === 7 /* hbar */) {
                formula = "=HBARSPARKLINE(" + params + ")";
            } else if (type === 8 /* vbar */) {
                formula = "=VBARSPARKLINE(" + params + ")";
            }
            var sels = this.sheet.getSelections();
            designer.actions.doAction("setFormulaSparklineWithoutDatarange", designer.wrapper.spread, {
                formula: formula,
                type: type,
                locationRange: sels.length > 0 ? sels[0] : new Sheets.Range(0, 0, 1, 1)
            });
            designer.ribbon.updateSparkline();
            this.updateFormulaBar();
            this.close();
            designer.wrapper.setFocusToSpread();
        };
        return BarBaseSparklineDialog;
    })(SparklineExBaseDialog);
    designer.BarBaseSparklineDialog = BarBaseSparklineDialog;

    var HbarSparklineDialog = (function (_super) {
        designer.extends(HbarSparklineDialog, _super);
        function HbarSparklineDialog() {
            _super.call(this, (dialog2HtmlPath), '.barbase-sparkline-dialog');
        }

        HbarSparklineDialog.prototype._initOptions = function () {
            var self = this;
            return {
                modal: true,
                title: designer.res.barbaseSparklineDialog.hbarSparklineSetting,
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.applySetting(7 /* hbar */);
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
        return HbarSparklineDialog;
    })(BarBaseSparklineDialog);
    designer.HbarSparklineDialog = HbarSparklineDialog;

    var VbarSparklineDialog = (function (_super) {
        designer.extends(VbarSparklineDialog, _super);
        function VbarSparklineDialog() {
            _super.call(this, (dialog2HtmlPath), '.barbase-sparkline-dialog');
        }

        VbarSparklineDialog.prototype._initOptions = function () {
            var self = this;
            return {
                modal: true,
                title: designer.res.barbaseSparklineDialog.vbarSparklineSetting,
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.applySetting(8 /* vbar */);
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
        return VbarSparklineDialog;
    })(BarBaseSparklineDialog);
    designer.VbarSparklineDialog = VbarSparklineDialog;

    var VariSparklineDialog = (function (_super) {
        designer.extends(VariSparklineDialog, _super);
        function VariSparklineDialog() {
            _super.call(this, (dialog2HtmlPath), '.vari-sparkline-dialog');
        }

        VariSparklineDialog.prototype._initOptions = function () {
            var self = this;
            return {
                modal: true,
                title: designer.res.variSparklineDialog.variSparklineSetting,
                minWidth: 500,
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.applySetting();
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

        VariSparklineDialog.prototype._init = function () {
            this._defaultValue = {
                legend: false,
                colorPositive: "green",
                colorNegative: "red",
                vertical: false
            };
            this.createColorPicker("vari-negative-color-frame", "vari-negative-color-span", "vari-negative-color-picker");
            this.createColorPicker("vari-positive-color-frame", "vari-positive-color-span", "vari-positive-color-picker");
            this._attachEvent();
        };

        VariSparklineDialog.prototype._beforeOpen = function () {
            this._paraPool = [];
            this.sheet = designer.wrapper.spread.getActiveSheet();
            this._updateVariSparklineDialog(this.sheet.getActiveRowIndex(), this.sheet.getActiveColumnIndex());
        };

        VariSparklineDialog.prototype._updateVariSparklineDialog = function (row, col) {
            var expr = designer.util.parseFormulaSparkline(row, col);
            if (expr && expr.arguments) {
                var formulaArgs = expr.arguments;
                if (formulaArgs && formulaArgs.length > 0) {
                    var varianceValue = designer.util.unParseFormula(formulaArgs[0], row, col);
                    var referenceValue = formulaArgs[1] ? designer.util.unParseFormula(formulaArgs[1], row, col) : undefined;
                    var miniValue = formulaArgs[2] ? designer.util.unParseFormula(formulaArgs[2], row, col) : undefined;
                    var maxiValue = formulaArgs[3] ? designer.util.unParseFormula(formulaArgs[3], row, col) : undefined;
                    var markValue = formulaArgs[4] ? designer.util.unParseFormula(formulaArgs[4], row, col) : undefined;
                    var tickunitValue = formulaArgs[5] ? designer.util.unParseFormula(formulaArgs[5], row, col) : undefined;
                    if (formulaArgs[6]) {
                        var legendValue = formulaArgs[6].type === Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[6].value : null;
                    }
                    var colorPositiveValue = formulaArgs[7] ? SparklineDialogHelper.parseColorExpression(formulaArgs[7], row, col) : undefined;
                    var colorNegativeValue = formulaArgs[8] ? SparklineDialogHelper.parseColorExpression(formulaArgs[8], row, col) : undefined;
                    if (formulaArgs[9]) {
                        var verticalValue = formulaArgs[9].type === Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[9].value : null;
                    }
                    this.updateTextBox("vari-variance", varianceValue);
                    this.updateTextBox("vari-reference", referenceValue);
                    this.updateTextBox("vari-mini", miniValue);
                    this.updateTextBox("vari-maxi", maxiValue);
                    this.updateTextBox("vari-mark", markValue);
                    this.updateTextBox("vari-tickunit", tickunitValue);
                    this.updateColorPicker("vari-positive-color-picker", "vari-positive-color-span", colorPositiveValue ? colorPositiveValue : this._defaultValue.colorPositive);
                    this.updateColorPicker("vari-negative-color-picker", "vari-negative-color-span", colorNegativeValue ? colorNegativeValue : this._defaultValue.colorNegative);
                    this.updateCheckBox("vari-legend", legendValue);
                    this.updateCheckBox("vari-vertical", verticalValue);

                    var colorPositiveStr = colorPositiveValue ? "\"" + colorPositiveValue + "\"" : null;
                    var colorNegativeStr = colorNegativeValue ? "\"" + colorNegativeValue + "\"" : null;
                    this._paraPool = [
                        varianceValue,
                        referenceValue,
                        miniValue,
                        maxiValue,
                        markValue,
                        tickunitValue,
                        legendValue,
                        colorPositiveStr,
                        colorNegativeStr,
                        verticalValue
                    ];
                }
            } else {
                this._reset();
            }
        };

        VariSparklineDialog.prototype._reset = function () {
            this.updateTextBox("vari-variance", "");
            this.updateTextBox("vari-reference", "");
            this.updateTextBox("vari-mini", "");
            this.updateTextBox("vari-maxi", "");
            this.updateTextBox("vari-mark", "");
            this.updateTextBox("vari-tickunit", "");
            this.updateColorPicker("vari-positive-color-picker", "vari-positive-color-span", this._defaultValue.colorPositive);
            this.updateColorPicker("vari-negative-color-picker", "vari-negative-color-span", this._defaultValue.colorNegative);
            this.updateCheckBox("vari-legend", this._defaultValue.legend);
            this.updateCheckBox("vari-vertical", this._defaultValue.vertical);
        };

        VariSparklineDialog.prototype.applySetting = function () {
            var paraCache = this._paraPool;
            var params = "";
            for (var i = 0; i < paraCache.length; i++) {
                var item = paraCache[i];
                if (item !== undefined && item !== null) {
                    params += item + ",";
                } else {
                    params += ",";
                }
            }
            params = this.removeContinuousComma(params);
            var formula = "=VARISPARKLINE(" + params + ")";
            var sels = this.sheet.getSelections();
            designer.actions.doAction("setFormulaSparklineWithoutDatarange", designer.wrapper.spread, {
                formula: formula,
                type: 4 /* bullet */,
                locationRange: sels.length > 0 ? sels[0] : new Sheets.Range(0, 0, 1, 1)
            });

            designer.ribbon.updateSparkline();
            this.updateFormulaBar();
            this.close();
            designer.wrapper.setFocusToSpread();
        };

        VariSparklineDialog.prototype._attachEvent = function () {
            var self = this, element = self._element;
            element.find(".vari-variance").keyup(function () {
                self._paraPool[0] = $(this).val();
            });
            element.find(".vari-reference").keyup(function () {
                self._paraPool[1] = $(this).val();
            });
            element.find(".vari-mini").keyup(function () {
                self._paraPool[2] = $(this).val();
            });
            element.find(".vari-maxi").keyup(function () {
                self._paraPool[3] = $(this).val();
            });
            element.find(".vari-mark").keyup(function () {
                self._paraPool[4] = $(this).val();
            });
            element.find(".vari-tickunit").keyup(function () {
                self._paraPool[5] = $(this).val();
            });
            $(".vari-positive-color-picker").bind(this.colorValueChanged, function (e, args) {
                var previewColor = args.value && args.value.color ? args.value.color : "transparent";
                self._paraPool[7] = "\"" + previewColor + "\"";
            });
            $(".vari-negative-color-picker").bind(this.colorValueChanged, function (e, args) {
                var previewColor = args.value && args.value.color ? args.value.color : "transparent";
                self._paraPool[8] = "\"" + previewColor + "\"";
            });
            element.find(".vari-legend").change(function () {
                self._paraPool[6] = $(this).prop("checked");
            });
            element.find(".vari-vertical").change(function () {
                self._paraPool[9] = $(this).prop("checked");
            });
        };
        return VariSparklineDialog;
    })(SparklineExBaseDialog);
    designer.VariSparklineDialog = VariSparklineDialog;

    var CalendarSparklineDialog = (function (_super) {
        designer.extends(CalendarSparklineDialog, _super);

        function CalendarSparklineDialog(type) {
            _super.call(this, (dialog2HtmlPath), '.calendar-sparkline-dialog');
            this._type = type;
        }

        CalendarSparklineDialog.prototype._initOptions = function () {
            var self = this;
            return {
                modal: true,
                title: designer.res.calendarSparklineDialog.calendarSparklineDialog,
                width: 535,
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.applySetting();
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
        CalendarSparklineDialog.prototype._init = function () {
            this.createColorPicker('calendar-emptyColor-frame', 'calendar-emptyColor-span', 'calendar-emptyColor-picker');
            this.createColorPicker('calendar-startColor-frame', 'calendar-startColor-span', 'calendar-startColor-picker');
            this.createColorPicker('calendar-middleColor-frame', 'calendar-middleColor-span', 'calendar-middleColor-picker');
            this.createColorPicker('calendar-endColor-frame', 'calendar-endColor-span', 'calendar-endColor-picker');
            var monthSelect = this._element.find('.calendar-sparkline-month');
            if (this._type === 0) {
                for (var i = 1; i < 13; i++) {
                    monthSelect.append($('<option></option>').val(i).text(i));
                }
            } else {
                monthSelect.attr('disabled', 'disabled');
                monthSelect.addClass('disabled');
            }
            this._attachEvent();
            this._changeColorRangeState(true);
            if (this._type === 0 /*month*/) {
                this._element.dialog('option', 'title', designer.res.calendarSparklineDialog.monthSparklineDialog);
            } else if (this._type === 1 /*year*/) {
                this._element.dialog('option', 'title', designer.res.calendarSparklineDialog.yearSparklineDialog);
            }
            this._defaultEmptyColor = 'lightgray';
            this._defaultStartColor = 'lightgreen';
            this._defaultMiddleColor = 'green';
            this._defaultEndColor = 'darkgreen';
        };
        CalendarSparklineDialog.prototype._attachEvent = function () {
            var self = this;
            self._attachRangeSelectEvent();
            self._element.find('.calendar-sparkline-checkbox').change(function () {
                self._changeColorRangeState(!$(this).prop('checked'));
            });
            $(".calendar-emptyColor-picker").bind(self.colorValueChanged, function (e, args) {
                var previewColor = args.value && args.value.color ? args.value.color : "transparent";
                self._emptyColor = previewColor;
            });
            $(".calendar-startColor-picker").bind(self.colorValueChanged, function (e, args) {
                var previewColor = args.value && args.value.color ? args.value.color : "transparent";
                self._startColor = previewColor;
            });
            $(".calendar-middleColor-picker").bind(self.colorValueChanged, function (e, args) {
                var previewColor = args.value && args.value.color ? args.value.color : "transparent";
                self._middleColor = previewColor;
            });
            $(".calendar-endColor-picker").bind(self.colorValueChanged, function (e, args) {
                var previewColor = args.value && args.value.color ? args.value.color : "transparent";
                self._endColor = previewColor;
            });
            self._element.find('.calendar-sparkline-year').keyup(function () {
                this.value = this.value.replace(/\D+/g, '');
            });
            self._element.find('.color-picker-container').comboframe().click(function (e) {
                $(this).comboframe('open');
            });
        };
        CalendarSparklineDialog.prototype._attachRangeSelectEvent = function () {
            var self = this;
            self._element.find(".rangeSelectButton").click(function () {
                if (!self._rangeSelectDialogAbsolute) {
                    self._rangeSelectDialogAbsolute = new designer.RangeSelectDialog(self, {
                        absoluteReference: true,
                        needSheetName: false
                    });
                }
                if (!self._rangeSelectDialog) {
                    self._rangeSelectDialog = new designer.RangeSelectDialog(self, {
                        absoluteReference: false,
                        needSheetName: false
                    });
                }
                if ($(this).attr('disabled') === 'disabled') {
                    return;
                }
                self.hide();
                var title = self._element.dialog('option', 'title'), callback = self._setValueFromRangeSelect, existFormula;
                switch ($(this).data('name')) {
                    case "data-range":
                        existFormula = self._element.find(".calendar-sparkline-data").val();
                        self._rangeSelectDialog.open(title, callback, existFormula, ['.calendar-sparkline-data']);
                        break;
                    case "location-range":
                        existFormula = self._element.find(".calendar-sparkline-location").val();
                        self._rangeSelectDialogAbsolute.open(title, callback, existFormula, ['.calendar-sparkline-location']);
                        break;
                    case "color-range":
                        existFormula = self._element.find(".calendar-sparkline-color").val();
                        self._rangeSelectDialog.open(title, callback, existFormula, ['.calendar-sparkline-color']);
                        break;
                    default:
                        self.show();
                }
            });
        };
        CalendarSparklineDialog.prototype._beforeOpen = function (args) {
            //args : [isSetting]
            var year, month, dataRange, emptyColor, startColor, middleColor, endColor, colorRange, isRangeColor,
                locationRange;
            var self = this;
            var sheet = designer.wrapper.spread.getActiveSheet();
            var row = sheet.getActiveRowIndex();
            var col = sheet.getActiveColumnIndex();
            var selectionRange = sheet.getSelections()[0];
            self._sheet = sheet;
            self._activeRowIndex = row;
            self._activeColIndex = col;

            function resetToDefault() {
                year = '';
                month = 1;
                emptyColor = self._defaultEmptyColor;
                startColor = self._defaultStartColor;
                middleColor = self._defaultMiddleColor;
                endColor = self._defaultEndColor;
                isRangeColor = false;
                dataRange = designer.CEUtility.parseRangeToExpString(selectionRange, null, row, col);
                locationRange = '';
                colorRange = '';
            }

            var isSetting = args[0];
            if (isSetting) {
                var expr = designer.util.parseFormulaSparkline(row, col);
                if (expr && expr.arguments) {
                    var formulaArgs = expr.arguments;
                    if (formulaArgs.length > 0) {
                        year = designer.util.unParseFormula(formulaArgs[0], row, col);
                        if (this._type === 0 /*month*/) {
                            isRangeColor = formulaArgs.length === 4;
                            month = designer.util.unParseFormula(formulaArgs[1], row, col);
                            dataRange = designer.util.unParseFormula(formulaArgs[2], row, col);
                            if (isRangeColor) {
                                colorRange = designer.util.unParseFormula(formulaArgs[3], row, col);
                            } else {
                                this._emptyColor = emptyColor = formulaArgs[3] && designer.util.unParseFormula(formulaArgs[3], row, col).replace(/"/g, '');
                                this._startColor = startColor = formulaArgs[4] && designer.util.unParseFormula(formulaArgs[4], row, col).replace(/"/g, '');
                                this._middleColor = middleColor = formulaArgs[5] && designer.util.unParseFormula(formulaArgs[5], row, col).replace(/"/g, '');
                                this._endColor = endColor = formulaArgs[6] && designer.util.unParseFormula(formulaArgs[6], row, col).replace(/"/g, '');
                            }
                        } else if (this._type === 1 /*year*/) {
                            isRangeColor = formulaArgs.length === 3;
                            dataRange = designer.util.unParseFormula(formulaArgs[1], row, col);
                            if (isRangeColor) {
                                colorRange = designer.util.unParseFormula(formulaArgs[2], row, col);
                            } else {
                                this._emptyColor = emptyColor = formulaArgs[2] && designer.util.unParseFormula(formulaArgs[2], row, col).replace(/"/g, '');
                                this._startColor = startColor = formulaArgs[3] && designer.util.unParseFormula(formulaArgs[3], row, col).replace(/"/g, '');
                                this._middleColor = middleColor = formulaArgs[4] && designer.util.unParseFormula(formulaArgs[4], row, col).replace(/"/g, '');
                                this._endColor = endColor = formulaArgs[5] && designer.util.unParseFormula(formulaArgs[5], row, col).replace(/"/g, '');
                            }
                        }
                        locationRange = designer.CEUtility.parseRangeToExpString(new Sheets.Range(row, col, 1, 1), true);
                    } else {
                        resetToDefault();
                    }
                } else {
                    resetToDefault();
                }
            } else {
                resetToDefault();
            }

            this._updateDialog({
                dataRange: dataRange,
                locationRange: locationRange,
                year: year,
                month: month,
                emptyColor: emptyColor,
                startColor: startColor,
                middleColor: middleColor,
                endColor: endColor,
                isRangeColor: isRangeColor,
                colorRange: colorRange
            });
        };
        CalendarSparklineDialog.prototype._updateDialog = function (args) {
            this.updateTextBox('calendar-sparkline-data', args.dataRange);
            this.updateTextBox('calendar-sparkline-location', args.locationRange);
            this.updateTextBox('calendar-sparkline-year', args.year);
            this.updateTextBox('calendar-sparkline-color', args.colorRange);
            if (this._type === 0/*month*/) {
                this.updateSelect('calendar-sparkline-month', args.month);
            }
            this.updateColorPicker('calendar-emptyColor-picker', 'calendar-emptyColor-span', args.emptyColor);
            this.updateColorPicker('calendar-startColor-picker', 'calendar-startColor-span', args.startColor);
            this.updateColorPicker('calendar-middleColor-picker', 'calendar-middleColor-span', args.middleColor);
            this.updateColorPicker('calendar-endColor-picker', 'calendar-endColor-span', args.endColor);
            this._changeColorRangeState(!args.isRangeColor);
        };
        CalendarSparklineDialog.prototype.applySetting = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var dataRangeStr = this._element.find(".calendar-sparkline-data").val();
            var locationRangeStr = this._element.find('.calendar-sparkline-location').val();
            var colorRangeStr = this._element.find('.calendar-sparkline-color').val();
            var isRangeColor = this._element.find('.calendar-sparkline-checkbox').prop('checked');
            if (!_checkRangeOfSparkline(sheet, dataRangeStr, true, false)
                || !_checkRangeOfSparkline(sheet, locationRangeStr, true, true)
                || (isRangeColor && !_checkRangeOfSparkline(sheet, colorRangeStr, true, false))) {
                return;
            }
            var exRanges = designer.CEUtility.parseExpStringToRanges(locationRangeStr, sheet)[0];
            var locationRange = exRanges.ranges[0], formula = this._createFormula(locationRange, exRanges.sheetName);
            designer.actions.doAction("setFormulaSparklineWithoutDatarange", designer.wrapper.spread, {
                formula: formula,
                locationRange: locationRange,
                locationSheet: exRanges.sheetName
            });
            this.close();
        };
        CalendarSparklineDialog.prototype._createFormula = function (locationRange, locationSheet) {
            var formula = '';
            var dataRangeStr = this._element.find('.calendar-sparkline-data').val();
            var year = this._element.find('.calendar-sparkline-year').val();
            var month = this._element.find('.calendar-sparkline-month').val();
            var emptyColor = this._emptyColor || this._defaultEmptyColor;
            var startColor = this._startColor || this._defaultStartColor;
            var middleColor = this._middleColor || this._defaultMiddleColor;
            var endColor = this._endColor || this._defaultEndColor;
            var isRangeColor = this._element.find('.calendar-sparkline-checkbox').prop('checked');
            var colorRangeStr = this._element.find('.calendar-sparkline-color').val();
            var sheet = designer.wrapper.spread.getSheetFromName(locationSheet);

            var dataRange = getRangeInfo(this._sheet, dataRangeStr, this._activeRowIndex, this._activeColIndex);
            dataRangeStr = designer.CEUtility.parseExternalRangeToString({ "range": dataRange.ranges[0] }, locationRange.row, locationRange.col);
            if (dataRange.sheetName !== sheet.name()) {
                dataRangeStr = dataRange.sheetName + "!" + dataRangeStr;
            }
            if (isRangeColor) {
                var colorRange = getRangeInfo(this._sheet, colorRangeStr, this._activeRowIndex, this._activeColIndex);
                colorRangeStr = designer.CEUtility.parseExternalRangeToString({ "range": colorRange.ranges[0] }, locationRange.row, locationRange.col);
                if (colorRange.sheetName !== sheet.name()) {
                    colorRangeStr = colorRange.sheetName + "!" + colorRangeStr;
                }
            }
            var paraPool = [];
            paraPool.push(year);
            if (this._type === 0) {
                paraPool.push(month);
            }
            paraPool.push(dataRangeStr);
            if (isRangeColor) {
                paraPool.push(colorRangeStr);
            } else {
                paraPool.push('"' + emptyColor + '"');
                paraPool.push('"' + startColor + '"');
                paraPool.push('"' + middleColor + '"');
                paraPool.push('"' + endColor + '"');
            }

            var params = paraPool.join(',');
            if (this._type === 0 /*month sparkline*/) {
                formula = formula + '=MONTHSPARKLINE';
            } else if (this._type === 1 /*year sparkline*/) {
                formula = formula + '=YEARSPARKLINE';
            }
            formula = formula + '(';
            formula = formula + params;
            formula = formula + ')';
            return formula;
        };
        CalendarSparklineDialog.prototype._changeColorRangeState = function (isDisable) {
            if (isDisable) {
                this._element.find('.calendar-sparkline-checkbox').prop("checked", false);
                this._element.find('.calendar-sparkline-color').attr("disabled", "disabled");
                this._element.find('.color-range-button').attr("disabled", "disabled");
            } else {
                this._element.find('.calendar-sparkline-checkbox').prop("checked", true);
                this._element.find('.calendar-sparkline-color').removeAttr("disabled", "disabled");
                this._element.find('.color-range-button').removeAttr("disabled", "disabled");
            }
        };
        return CalendarSparklineDialog;
    })(SparklineExBaseDialog);
    designer.CalendarSparklineDialog = CalendarSparklineDialog;

    var BoxPlotSparklineDialog = (function (_super) {
        designer.extends(BoxPlotSparklineDialog, _super);
        function BoxPlotSparklineDialog() {
            _super.call(this, (dialog2HtmlPath), '.boxplot-sparkline-dialog');
        }

        BoxPlotSparklineDialog.prototype._initOptions = function () {
            var self = this;
            return {
                modal: true,
                title: designer.res.boxplotSparklineDialog.boxplotSparklineSetting,
                minWidth: 500,
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.applySetting();
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

        BoxPlotSparklineDialog.prototype._init = function () {
            this._defaultValue = {
                boxplotClass: "5ns",
                style: 0,
                colorScheme: "#D2D2D2",
                vertical: false,
                showAverage: false
            };
            this.createColorPicker("boxplot-color-frame", "boxplot-color-span", "boxplot-color-picker");
            this._attachEvent();
        };

        BoxPlotSparklineDialog.prototype._beforeOpen = function () {
            this._paraPool = [];
            this.sheet = designer.wrapper.spread.getActiveSheet();
            this._updateBoxPlotSparklineDialog(this.sheet.getActiveRowIndex(), this.sheet.getActiveColumnIndex());
        };

        BoxPlotSparklineDialog.prototype._updateBoxPlotSparklineDialog = function (row, col) {
            var expr = designer.util.parseFormulaSparkline(row, col);
            if (expr && expr.arguments) {
                var formulaArgs = expr.arguments;
                if (formulaArgs && formulaArgs.length > 0) {
                    var defValue = this._defaultValue;
                    var pointsValue = designer.util.unParseFormula(formulaArgs[0], row, col);
                    if (formulaArgs[1]) {
                        var boxPlotClassValue = formulaArgs[1].type === Spread.CalcEngine.ExpressionType.string ? formulaArgs[1].value : null;
                    }
                    if (formulaArgs[2]) {
                        var showAverageValue = formulaArgs[2].type === Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[2].value : null;
                    }
                    var scaleStartValue = formulaArgs[3] ? designer.util.unParseFormula(formulaArgs[3], row, col) : undefined;
                    var scaleEndValue = formulaArgs[4] ? designer.util.unParseFormula(formulaArgs[4], row, col) : undefined;
                    var acceptableStartValue = formulaArgs[5] ? designer.util.unParseFormula(formulaArgs[5], row, col) : undefined;
                    var acceptableEndValue = formulaArgs[6] ? designer.util.unParseFormula(formulaArgs[6], row, col) : undefined;
                    var colorValue = formulaArgs[7] ? SparklineDialogHelper.parseColorExpression(formulaArgs[7], row, col) : undefined;
                    var styleValue = formulaArgs[8] ? designer.util.unParseFormula(formulaArgs[8], row, col) : undefined;
                    if (formulaArgs[9]) {
                        var verticalValue = formulaArgs[9].type === Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[9].value : null;
                    }
                    this.updateTextBox("boxplot-points", pointsValue);
                    this.updateSelect("boxplot-class", boxPlotClassValue === null ? defValue.boxplotClass : boxPlotClassValue);
                    this.updateTextBox("boxplot-scale-start", scaleStartValue);
                    this.updateTextBox("boxplot-scale-end", scaleEndValue);
                    this.updateTextBox("boxplot-acceptable-start", acceptableStartValue);
                    this.updateTextBox("boxplot-acceptable-end", acceptableEndValue);
                    this.updateColorPicker("boxplot-color-picker", "boxplot-color-span", colorValue === null ? defValue.colorScheme : colorValue);
                    this.updateSelect("boxplot-style", styleValue === null ? defValue.style : styleValue);
                    this.updateCheckBox("boxplot-vertical", verticalValue === null ? defValue.vertical : verticalValue);
                    this.updateCheckBox("boxplot-show-average", showAverageValue === null ? defValue.showAverage : showAverageValue);

                    var boxplotClassStr = boxPlotClassValue ? "\"" + boxPlotClassValue + "\"" : null;
                    var colorStr = colorValue ? "\"" + colorValue + "\"" : null;
                    this._paraPool = [
                        pointsValue,
                        boxplotClassStr,
                        showAverageValue,
                        scaleStartValue,
                        scaleEndValue,
                        acceptableStartValue,
                        acceptableEndValue,
                        colorStr,
                        styleValue,
                        verticalValue
                    ];
                } else {
                    this._reset();
                }
            }
        };

        BoxPlotSparklineDialog.prototype._reset = function () {
            this.updateTextBox("boxplot-points", "");
            this.updateSelect("boxplot-class", this._defaultValue.boxplotClass);
            this.updateTextBox("boxplot-scale-start", "");
            this.updateTextBox("boxplot-scale-end", "");
            this.updateTextBox("boxplot-acceptable-start", "");
            this.updateTextBox("boxplot-acceptable-end", "");
            this.updateColorPicker("boxplot-color-picker", "boxplot-color-span", this._defaultValue.colorScheme);
            this.updateSelect("boxplot-style", this._defaultValue.style);
            this.updateCheckBox("boxplot-vertical", this._defaultValue.vertical);
            this.updateCheckBox("boxplot-show-average", this._defaultValue.showAverage);
        };

        BoxPlotSparklineDialog.prototype._attachEvent = function () {
            var self = this, element = self._element;
            element.find(".boxplot-points").keyup(function () {
                self._paraPool[0] = $(this).val();
            });
            element.find(".boxplot-class").change(function () {
                self._paraPool[1] = "\"" + $(this).val() + "\"";
            });
            element.find(".boxplot-scale-start").keyup(function () {
                self._paraPool[3] = $(this).val();
            });
            element.find(".boxplot-scale-end").keyup(function () {
                self._paraPool[4] = $(this).val();
            });
            element.find(".boxplot-acceptable-start").keyup(function () {
                self._paraPool[5] = $(this).val();
            });
            element.find(".boxplot-acceptable-end").keyup(function () {
                self._paraPool[6] = $(this).val();
            });
            $(".boxplot-color-picker").bind(this.colorValueChanged, function (e, args) {
                var previewColor = args.value && args.value.color ? args.value.color : "transparent";
                self._paraPool[7] = "\"" + previewColor + "\"";
            });
            element.find(".boxplot-style").change(function () {
                self._paraPool[8] = $(this).val();
            });
            element.find(".boxplot-show-average").change(function () {
                self._paraPool[2] = $(this).prop("checked");
            });
            element.find(".boxplot-vertical").change(function () {
                self._paraPool[9] = $(this).prop("checked");
            });
        };

        BoxPlotSparklineDialog.prototype.applySetting = function () {
            var paraCache = this._paraPool;
            var params = "";
            for (var i = 0; i < paraCache.length; i++) {
                var item = paraCache[i];
                if (item !== undefined && item !== null) {
                    params += item + ",";
                } else {
                    params += ",";
                }
            }
            params = this.removeContinuousComma(params);
            var formula = "=BOXPLOTSPARKLINE(" + params + ")";
            designer.actions.doAction("setFormulaSparkline", designer.wrapper.spread, {
                formula: formula,
                type: 10 /* boxplot */,
                dataRange: this._paraPool[0]
            });
            this.updateFormulaBar();
            this.close();
            designer.wrapper.setFocusToSpread();
        };
        return BoxPlotSparklineDialog;
    })(SparklineExBaseDialog);
    designer.BoxPlotSparklineDialog = BoxPlotSparklineDialog;

    var CascadeSparklineDialog = (function (_super) {
        designer.extends(CascadeSparklineDialog, _super);
        function CascadeSparklineDialog() {
            _super.call(this, (dialog2HtmlPath), '.cascade-sparkline-dialog');
        }

        CascadeSparklineDialog.prototype._initOptions = function () {
            var self = this;
            return {
                modal: true,
                title: designer.res.cascadeSparklineDialog.cascadeSparklineSetting,
                minWidth: 500,
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.applySetting();
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

        CascadeSparklineDialog.prototype._init = function () {
            this._defaultValue = { colorPositive: "#8CBF64", colorNegative: "#D6604D", vertical: false };
            this.createColorPicker("cascade-positive-color-frame", "cascade-positive-color-span", "cascade-positive-color-picker");
            this.createColorPicker("cascade-negative-color-frame", "cascade-negative-color-span", "cascade-negative-color-picker");
            this._attachEvent();
        };

        CascadeSparklineDialog.prototype.applySetting = function () {
            var paraCache = this._paraPool;
            var params = "";
            for (var i = 0; i < paraCache.length; i++) {
                var item = paraCache[i];
                if (item !== undefined && item !== null) {
                    params += item + ",";
                } else {
                    params += ",";
                }
            }
            params = this.removeContinuousComma(params);
            var formula = "=CASCADESPARKLINE(" + params + ")";
            designer.actions.doAction("setFormulaSparkline", designer.wrapper.spread, {
                formula: formula,
                type: 11 /* cascade */,
                dataRange: this._paraPool[0],
                parameterSets: this._paraPool
            });
            this.updateFormulaBar();
            this.close();
            designer.wrapper.setFocusToSpread();
        };

        CascadeSparklineDialog.prototype._attachEvent = function () {
            var self = this, element = self._element;
            element.find(".cascade-points-range").keyup(function () {
                self._paraPool[0] = $(this).val();
            });
            element.find(".cascade-point-index").keyup(function () {
                self._paraPool[1] = $(this).val();
            });
            element.find(".cascade-mini").keyup(function () {
                self._paraPool[3] = $(this).val();
            });
            element.find(".cascade-maxi").keyup(function () {
                self._paraPool[4] = $(this).val();
            });
            $(".cascade-positive-color-picker").bind(this.colorValueChanged, function (e, args) {
                var previewColor = args.value && args.value.color ? args.value.color : "transparent";
                self._paraPool[5] = "\"" + previewColor + "\"";
            });
            $(".cascade-negative-color-picker").bind(this.colorValueChanged, function (e, args) {
                var previewColor = args.value && args.value.color ? args.value.color : "transparent";
                self._paraPool[6] = "\"" + previewColor + "\"";
            });
            element.find(".cascade-labels-range").keyup(function () {
                self._paraPool[2] = $(this).val();
            });
            element.find(".cascade-vertical").change(function () {
                self._paraPool[7] = $(this).prop("checked");
            });
        };

        CascadeSparklineDialog.prototype._beforeOpen = function () {
            this._paraPool = [];
            this.sheet = designer.wrapper.spread.getActiveSheet();
            this._updateCascadeSparklineDialog(this.sheet.getActiveRowIndex(), this.sheet.getActiveColumnIndex());
            this._setPointIndexStatus();
        };

        CascadeSparklineDialog.prototype._setPointIndexStatus = function () {
            var selections = this.sheet.getSelections();
            if (selections && selections.length > 0) {
                var sel = selections[0];
                if (selections.length > 1 || sel.rowCount > 1 || sel.colCount > 1) {
                    this._element.find(".cascade-point-index").attr("disabled", "disabled");
                } else {
                    this._element.find(".cascade-point-index").removeAttr("disabled");
                }
            }
        };

        CascadeSparklineDialog.prototype._updateCascadeSparklineDialog = function (row, col) {
            var expr = designer.util.parseFormulaSparkline(row, col);
            if (expr && expr.arguments) {
                var formulaArgs = expr.arguments;
                if (formulaArgs && formulaArgs.length > 0) {
                    var defValue = this._defaultValue;
                    var pointsRangeValue = designer.util.unParseFormula(formulaArgs[0], row, col);
                    var pointIndexValue = formulaArgs[1] ? designer.util.unParseFormula(formulaArgs[1], row, col) : undefined;
                    var labelsRangeValue = formulaArgs[2] ? designer.util.unParseFormula(formulaArgs[2], row, col) : undefined;
                    var minimumValue = formulaArgs[3] ? designer.util.unParseFormula(formulaArgs[3], row, col) : undefined;
                    var maximumValue = formulaArgs[4] ? designer.util.unParseFormula(formulaArgs[4], row, col) : undefined;
                    var colorPositiveValue = formulaArgs[5] ? SparklineDialogHelper.parseColorExpression(formulaArgs[5], row, col) : undefined;
                    var colorNegativeValue = formulaArgs[6] ? SparklineDialogHelper.parseColorExpression(formulaArgs[6], row, col) : undefined;
                    if (formulaArgs[7]) {
                        var verticalValue = formulaArgs[7].type === Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[7].value : null;
                    }
                    this.updateTextBox("cascade-points-range", pointsRangeValue);
                    this.updateTextBox("cascade-point-index", pointIndexValue);
                    this.updateTextBox("cascade-maxi", maximumValue);
                    this.updateTextBox("cascade-mini", minimumValue);
                    this.updateTextBox("cascade-labels-range", labelsRangeValue);
                    this.updateColorPicker("cascade-positive-color-picker", "cascade-positive-color-span", colorPositiveValue === null ? defValue.colorPositive : colorPositiveValue);
                    this.updateColorPicker("cascade-negative-color-picker", "cascade-negative-color-span", colorNegativeValue === null ? defValue.colorNegative : colorNegativeValue);
                    this.updateCheckBox("cascade-vertical", verticalValue === null ? defValue.vertical : verticalValue);

                    var colorNegativeStr = colorNegativeValue ? "\"" + colorNegativeValue + "\"" : null;
                    var colorPositiveStr = colorPositiveValue ? "\"" + colorPositiveValue + "\"" : null;
                    this._paraPool = [
                        pointsRangeValue,
                        pointIndexValue,
                        labelsRangeValue,
                        minimumValue,
                        maximumValue,
                        colorPositiveStr,
                        colorNegativeStr,
                        verticalValue
                    ];
                } else {
                    this._reset();
                }
            }
        };

        CascadeSparklineDialog.prototype._reset = function () {
            this.updateTextBox("cascade-points-range", "");
            this.updateTextBox("cascade-point-index", "");
            this.updateTextBox("cascade-maxi", "");
            this.updateTextBox("cascade-mini", "");
            this.updateTextBox("cascade-labels-range", "");
            this.updateColorPicker("cascade-positive-color-picker", "cascade-positive-color-span", this._defaultValue.colorPositive);
            this.updateColorPicker("cascade-negative-color-picker", "cascade-negative-color-span", this._defaultValue.colorNegative);
            this.updateCheckBox("cascade-vertical", this._defaultValue.vertical);
        };
        return CascadeSparklineDialog;
    })(SparklineExBaseDialog);
    designer.CascadeSparklineDialog = CascadeSparklineDialog;

    var ParetoSparklineDialog = (function (_super) {
        designer.extends(ParetoSparklineDialog, _super);
        function ParetoSparklineDialog() {
            _super.call(this, (dialog2HtmlPath), '.pareto-sparkline-dialog');
        }

        ParetoSparklineDialog.prototype._initOptions = function () {
            var self = this;
            return {
                modal: true,
                title: designer.res.paretoSparklineDialog.paretoSparklineSetting,
                minWidth: 500,
                resizable: false,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.applySetting();
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

        ParetoSparklineDialog.prototype._init = function () {
            this._defaultValue = { label: 0, vertical: false };
            this._attachEvent();
        };

        ParetoSparklineDialog.prototype.applySetting = function () {
            var paraCache = this._paraPool;
            var params = "";
            for (var i = 0; i < paraCache.length; i++) {
                var item = paraCache[i];
                if (item !== undefined && item !== null) {
                    params += item + ",";
                } else {
                    params += ",";
                }
            }
            params = this.removeContinuousComma(params);
            var formula = "=PARETOSPARKLINE(" + params + ")";
            designer.actions.doAction("setFormulaSparkline", designer.wrapper.spread, {
                formula: formula,
                type: 12 /* pareto */,
                dataRange: this._paraPool[0],
                parameterSets: this._paraPool
            });
            this.updateFormulaBar();
            this.close();
            designer.wrapper.setFocusToSpread();
        };

        ParetoSparklineDialog.prototype._attachEvent = function () {
            var self = this, element = self._element;
            element.find(".pareto-points").keyup(function () {
                self._paraPool[0] = $(this).val();
            });
            element.find(".pareto-point-index").keyup(function () {
                self._paraPool[1] = $(this).val();
            });
            element.find(".pareto-color-range").keyup(function () {
                self._paraPool[2] = $(this).val();
            });
            element.find(".pareto-target").keyup(function () {
                self._paraPool[3] = $(this).val();
            });
            element.find(".pareto-target2").keyup(function () {
                self._paraPool[4] = $(this).val();
            });
            element.find(".pareto-highlightPosition").keyup(function () {
                self._paraPool[5] = $(this).val();
            });
            element.find(".pareto-label").change(function () {
                self._paraPool[6] = $(this).val();
            });
            element.find(".pareto-vertical").change(function () {
                self._paraPool[7] = $(this).prop("checked");
            });
        };

        ParetoSparklineDialog.prototype._beforeOpen = function () {
            this._paraPool = [];
            this.sheet = designer.wrapper.spread.getActiveSheet();
            this._updateParetoSparklineDialog(this.sheet.getActiveRowIndex(), this.sheet.getActiveColumnIndex());
            this._setPointIndexStatus();
        };

        ParetoSparklineDialog.prototype._setPointIndexStatus = function () {
            var selections = this.sheet.getSelections();
            if (selections && selections.length > 0) {
                var sel = selections[0];
                if (selections.length > 1 || sel.rowCount > 1 || sel.colCount > 1) {
                    this._element.find(".pareto-point-index").attr("disabled", "disabled");
                } else {
                    this._element.find(".pareto-point-index").removeAttr("disabled");
                }
            }
        };

        ParetoSparklineDialog.prototype._updateParetoSparklineDialog = function (row, col) {
            var expr = designer.util.parseFormulaSparkline(row, col);
            if (expr && expr.arguments) {
                var formulaArgs = expr.arguments;
                if (formulaArgs && formulaArgs.length > 0) {
                    var defValue = this._defaultValue;
                    var pointsRangeValue = designer.util.unParseFormula(formulaArgs[0], row, col);
                    var pointIndexValue = formulaArgs[1] ? designer.util.unParseFormula(formulaArgs[1], row, col) : undefined;
                    var colorRangeValue = formulaArgs[2] ? designer.util.unParseFormula(formulaArgs[2], row, col) : undefined;
                    var targetValue = formulaArgs[3] ? designer.util.unParseFormula(formulaArgs[3], row, col) : undefined;
                    var target2Value = formulaArgs[4] ? designer.util.unParseFormula(formulaArgs[4], row, col) : undefined;
                    var highlightPositionValue = formulaArgs[5] ? designer.util.unParseFormula(formulaArgs[5], row, col) : undefined;
                    if (formulaArgs[6]) {
                        var labelValue = formulaArgs[6].type === Spread.CalcEngine.ExpressionType.number ? formulaArgs[6].value : null;
                    }
                    if (formulaArgs[7]) {
                        var verticalValue = formulaArgs[7].type === Spread.CalcEngine.ExpressionType.boolean ? formulaArgs[7].value : null;
                    }
                    this.updateTextBox("pareto-points", pointsRangeValue);
                    this.updateTextBox("pareto-point-index", pointIndexValue);
                    this.updateTextBox("pareto-color-range", colorRangeValue);
                    this.updateTextBox("pareto-highlightPosition", highlightPositionValue);
                    this.updateTextBox("pareto-target", targetValue);
                    this.updateTextBox("pareto-target2", target2Value);
                    this.updateSelect("pareto-label", labelValue === null ? defValue.label : labelValue);
                    this.updateCheckBox("cascade-vertical", verticalValue === null ? defValue.vertical : verticalValue);

                    this._paraPool = [
                        pointsRangeValue,
                        pointIndexValue,
                        colorRangeValue,
                        targetValue,
                        target2Value,
                        highlightPositionValue,
                        labelValue,
                        verticalValue
                    ];
                } else {
                    this._reset();
                }
            }
        };

        ParetoSparklineDialog.prototype._reset = function () {
            this.updateTextBox("pareto-points", "");
            this.updateTextBox("pareto-point-index", "");
            this.updateTextBox("pareto-color-range", "");
            this.updateTextBox("pareto-highlightPosition", "");
            this.updateTextBox("pareto-target", "");
            this.updateTextBox("pareto-target2", "");
            this.updateSelect("pareto-label", this._defaultValue.label);
            this.updateCheckBox("cascade-vertical", this._defaultValue.vertical);
        };
        return ParetoSparklineDialog;
    })(SparklineExBaseDialog);
    designer.ParetoSparklineDialog = ParetoSparklineDialog;

    var ProtectionOptionDialog = (function (_super) {
        designer.extends(ProtectionOptionDialog, _super);
        function ProtectionOptionDialog() {
            _super.call(this, (dialog2HtmlPath), '.protection-option');
        }

        ProtectionOptionDialog.prototype._initOptions = function () {
            var self = this;
            return {
                resizable: false,
                modal: true,
                title: self._getResourceString("title"),
                width: 250,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            var protectionOption = {};
                            var items = self._element.find("div[class='protection-option-container']").children();
                            var preLength = ProtectionOptionDialog.itemIDPre.length;
                            for (var i = 0; i < items.length; i++) {
                                var id = items[i].id.substring(preLength);
                                self._setOptionValue(protectionOption, id, items[i].checked);
                            }
                            designer.actions.doAction("confirmProtectSheet", designer.wrapper.spread, protectionOption);
                            self.close();
                            self._applySetting();
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

        ProtectionOptionDialog.prototype._beforeOpen = function () {
            var activeSheet = designer.wrapper.spread.getActiveSheet();
            var protectionOption = activeSheet.options.protectionOptions;
            var items = this._element.find("div[class='protection-option-container']").children();
            var preLength = ProtectionOptionDialog.itemIDPre.length;
            for (var i = 0; i < items.length; i++) {
                var id = items[i].id.substring(preLength);
                items[i].checked = this._getOptionValue(protectionOption, id);
            }
        };

        ProtectionOptionDialog.prototype._getOptionValue = function (option, item) {
            var value = option[item];
            if (value === undefined) {
                return item === "allowSelectLockedCells" || item === "allowSelectUnlockedCells";
            }
            return value;
        };
        ProtectionOptionDialog.prototype._setOptionValue = function (option, item, value) {
            if (item === "allowSelectLockedCells" || item === "allowSelectUnlockedCells") {
                if (!value) {
                    option[item] = false;
                }
            } else if (value) {
                option[item] = true;
            }
        };

        ProtectionOptionDialog.prototype._getAllOptions = function () {
            return [
                "allowSelectLockedCells",
                "allowSelectUnlockedCells",
                "allowSort",
                "allowFilter",
                "allowResizeRows",
                "allowResizeColumns",
                "allowEditObjects",
                "allowDragInsertRows",
                "allowDragInsertColumns",
                "allowInsertRows",
                "allowInsertColumns",
                "allowDeleteRows",
                "allowDeleteColumns"
            ];
        };

        ProtectionOptionDialog.prototype._getResourceString = function (option) {
            if (!designer.res.protectionOptionDialog) {
                return option;
            }
            return designer.res.protectionOptionDialog[option];
        };

        ProtectionOptionDialog.prototype._init = function () {
            var self = this;
            var container = self._element.find("div[class='protection-option-container']");
            var options = self._getAllOptions();
            for (var i = 0; i < options.length; i++) {
                var text = self._getResourceString(options[i]);
                var id = ProtectionOptionDialog.itemIDPre + options[i];
                container.append($("<input id=\"" + id + "\" type=\"checkbox\"/>" + "<label for=\"" + id + "\">" + text + "</label></br>"));
            }
        };

        ProtectionOptionDialog.prototype._applySetting = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            if (this._isAllSelectedSlicersLocked() && !sheet.options.protectionOptions.allowEditObjects) {
                designer.ribbon.clearSlicerTab();
            }
        };

        ProtectionOptionDialog.prototype._isAllSelectedSlicersLocked = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var selectedSlicers = designer.util.getSelectedSlicers(sheet);
            if (!selectedSlicers || selectedSlicers.length === 0) {
                return;
            }
            var allLocked = true;
            for (var item in selectedSlicers) { /* NOSONAR: ForIn */
                allLocked = selectedSlicers[item].isLocked();
                if (!allLocked) {
                    break;
                }
            }
            return allLocked;
        };
        ProtectionOptionDialog.itemIDPre = "protectionOption-";
        return ProtectionOptionDialog;
    })(designer.BaseDialog);
    designer.ProtectionOptionDialog = ProtectionOptionDialog;

    var InsertSlicerDialog = (function (_super) {
        designer.extends(InsertSlicerDialog, _super);
        function InsertSlicerDialog() {
            _super.call(this, (dialog2HtmlPath), '.insert-slicer-dialog');
        }

        InsertSlicerDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                modal: true,
                title: designer.res.insertSlicerDialog.insertSlicer,
                buttons: [
                    {
                        text: designer.res.ok,
                        id: "slicerDialogOK",
                        click: function () {
                            self._applySetting();
                            self.close();
                            designer.actions.doAction('baseDialogCommand', designer.wrapper.spread, {
                                value: {
                                    tableName: self._table.name(),
                                    columnsChecked: self._columnsChecked
                                },
                                execute: designer.spreadActions.dialogAction.insertSlicerForDialog
                            });
                            designer.ribbon.insertTableSlicer(self._table, self._columnsChecked);
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

        InsertSlicerDialog.prototype._beforeOpen = function (args) {
            this._columnsChecked = [];
            this._disableOkButton();
            $(".insert-slicer-container").empty();
            this._table = args[0];
            this._setSlicerOptions(this._table);
        };

        InsertSlicerDialog.prototype._applySetting = function () {
            var self = this;
            this._slicerInput.each(function (index) {
                if ($(this).prop('checked')) {
                    self._columnsChecked.push(index);
                }
            });
            this._slicerBlockDiv.unbind();
            this._slicerInput.unbind();
        };

        InsertSlicerDialog.prototype._setSlicerOptions = function (table) {
            var self = this;
            var $insertSlicerContainer = $(".insert-slicer-container");
            for (var i = 0; i < this._table.range().colCount; i++) {
                var columnName = this._table.getColumnName(i);

                var $slicerDiv = $("<div class='insert-slicer-block'></div>");
                $slicerDiv.appendTo($insertSlicerContainer);
                var $slicerInput = $("<input type='checkbox' />");
                $slicerInput.appendTo($slicerDiv);
                var $slicerLabel = $("<label>" + columnName + "</label>");
                $slicerLabel.appendTo($slicerDiv);
            }
            this._slicerBlockDiv = $(".insert-slicer-block");
            this._slicerInput = $(this._slicerBlockDiv).find("input");
            this._slicerBlockDiv.bind("mousedown", function () {
                var $checkColumn = $(this).find("input");
                if ($checkColumn.prop("checked")) {
                    $checkColumn.prop("checked", false);
                } else {
                    $checkColumn.prop("checked", true);
                }
                self._disableOkButton();
            });
            this._slicerInput.bind("mousedown", function (event) {
                event.stopPropagation();
            });
            this._slicerInput.change(function () {
                self._disableOkButton();
            });
        };

        InsertSlicerDialog.prototype._disableOkButton = function () {
            var $dialogOK = $("#slicerDialogOK");
            if ($(this._slicerBlockDiv).find($("input:checked")).length > 0) {
                if ($dialogOK.hasClass("insert-slicer-ok")) {
                    $dialogOK.removeClass("insert-slicer-ok");
                    $dialogOK.addClass("ui-state-default");
                }
                $dialogOK.attr("disabled", false);
            } else {
                $dialogOK.removeClass("ui-state-default");
                $dialogOK.addClass("insert-slicer-ok");
                $dialogOK.attr("disabled", true);
            }
        };
        return InsertSlicerDialog;
    })(designer.BaseDialog);
    designer.InsertSlicerDialog = InsertSlicerDialog;

    var SlicerSettingDialog = (function (_super) {
        designer.extends(SlicerSettingDialog, _super);
        function SlicerSettingDialog() {
            _super.call(this, (dialog2HtmlPath), '.slicer-setting-dialog');
        }

        SlicerSettingDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                modal: true,
                title: designer.res.slicerSettingDialog.slicerSetting,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self._applySetting();
                        }
                    },
                    {
                        text: designer.res.cancel,
                        click: function () {
                            self.close();
                        }
                    }
                ]
            };
        };

        SlicerSettingDialog.prototype._init = function () {
            var self = this;
            $("#hide-item").change(function () {
                self._hideItemControl();
            });
            $("#visually-item").change(function () {
                self._visuallyItemControl();
            });
        };

        SlicerSettingDialog.prototype._hideItemControl = function () {
            if ($("#hide-item").prop("checked")) {
                $("#visually-item").attr("disabled", true);
                $("#show-item").attr("disabled", true);
            } else {
                $("#visually-item").attr("disabled", false);
                if ($("#visually-item").prop("checked")) {
                    $("#show-item").attr("disabled", false);
                }
            }
        };

        SlicerSettingDialog.prototype._visuallyItemControl = function () {
            if (!$("#hide-item").prop("checked")) {
                if (!$("#visually-item").prop("checked")) {
                    $("#show-item").attr("disabled", true);
                } else {
                    $("#show-item").attr("disabled", false);
                }
            }
        };

        SlicerSettingDialog.prototype._beforeOpen = function () {
            this._initSlicerSettingDialog();
            var sheet = designer.wrapper.spread.getActiveSheet();
            var selectedSlicers = designer.util.getSelectedSlicers(sheet);
            if (!selectedSlicers || selectedSlicers.length === 0) {
                return;
            } else if (selectedSlicers.length > 1) {
                $("#slicer-setting-name").css("color", "#9b6d84");
                $("#slicer-name").attr("disabled", true).css("background-color", "#f0f0f0");
                this._getMultiSlicerSetting(selectedSlicers);
            } else if (selectedSlicers.length === 1) {
                $("#slicer-setting-name").css("color", "#000000");
                $("#slicer-name").attr("disabled", false).css("background-color", "#ffffff");
                this._getSingleSlicerSetting(selectedSlicers[0]);
            }
            this._hideItemControl();
            this._visuallyItemControl();
        };

        SlicerSettingDialog.prototype._applySetting = function () {
            var slicerSettings = [];
            var slicerName = $("#slicer-name").val();
            slicerSettings.push(slicerName);
            slicerSettings.push($("#display-header").prop("checked"));
            slicerSettings.push($("#slicer-caption").val());
            slicerSettings.push($("input[name='item-sort']:checked").val());
            slicerSettings.push($("#hide-item").prop("checked"));
            slicerSettings.push($("#visually-item").prop("checked"));
            slicerSettings.push($("#show-item").prop("checked"));
            this._setSlicerSetting(slicerSettings);
        };

        SlicerSettingDialog.prototype._setSlicerSetting = function (slicerSettings) {
            var spread = designer.wrapper.spread;
            var sheet = spread.getActiveSheet();
            var selectedSlicers = designer.util.getSelectedSlicers(sheet);
            var slicer = selectedSlicers[0];
            var slicerName = slicerSettings[0];

            if (selectedSlicers && selectedSlicers.length === 1) {
                if (this._isUniqueSlicerName(spread, slicer.name(), slicerName)) {
                    designer.MessageBox.show(designer.res.sameSlicerName, designer.res.title, 2 /* warning */);
                    return false;
                }
                if (!slicerName || slicerName.length === 0) {
                    designer.MessageBox.show(designer.res.nullSlicerName, designer.res.title, 2 /* warning */);
                    return false;
                }
            }
            designer.actions.doAction('baseDialogCommand', designer.wrapper.spread, {
                value: {
                    slicerSettings: slicerSettings,
                    selectedSlicers: selectedSlicers
                },
                execute: designer.spreadActions.dialogAction.SlicerSettingForDialog
            });
            this.close();
        };

        SlicerSettingDialog.prototype._isUniqueSlicerName = function (spread, slicerName, rename) {
            var sheet;
            var sheetCount = spread.getSheetCount();
            slicerName = slicerName.toLowerCase();
            rename = rename.toLowerCase();
            for (var i = 0; i < sheetCount; i++) {
                sheet = spread.getSheet(i);
                var slicers = sheet.slicers.all();
                for (var item in slicers) { /* NOSONAR: ForIn */
                    var slicer = slicers[item];
                    var name = slicer.name();
                    name = name.toLowerCase();
                    if (name === rename && name !== slicerName) {
                        return true;
                    }
                }
            }
            return false;
        };

        SlicerSettingDialog.prototype._initSlicerSettingDialog = function () {
            $("#source-name").text("");
            $("#slicer-name").val("");
            $("#slicer-caption").val("");
            $("#display-header").prop("checked", true);
            $("#ascending").prop("checked", true);
            $("#hide-item").prop("checked", false);
            $("#visually-item").prop("checked", true);
            $("#show-item").prop("checked", true);
        };

        SlicerSettingDialog.prototype._getSingleSlicerSetting = function (slicerEx) {
            var slicer = slicerEx;
            $("#source-name").text(slicer.sourceName());
            $("#slicer-name").val(slicer.name());
            $("#slicer-caption").val(slicer.captionName());
            if (slicer.showHeader()) {
                $("#display-header").prop("checked", true);
            } else {
                $("#display-header").prop("checked", false);
            }
            if (slicer.sortState() === 1 /* Ascending */) {
                $("#ascending").prop("checked", true);
            } else {
                $("#descending").prop("checked", true);
            }
            if (!slicer.showNoDataItems()) {
                $("#hide-item").prop("checked", true);
            } else {
                $("#hide-item").prop("checked", false);
            }
            if (slicer.visuallyNoDataItems()) {
                $("#visually-item").prop("checked", true);
            } else {
                $("#visually-item").prop("checked", false);
            }
            if (slicer.showNoDataItemsInLast()) {
                $("#show-item").prop("checked", true);
            } else {
                $("#show-item").prop("checked", false);
            }
        };

        SlicerSettingDialog.prototype._getMultiSlicerSetting = function (selectedSlicers) {
            if (!selectedSlicers || selectedSlicers.length === 0) {
                return;
            }
            var isDisplayHeader = false, isHideItem = false, isVisuallyItem = false, isShowItemLast = false,
                isSameSortState = true, isSameCaptionName = true, sortState = selectedSlicers[0].sortState(),
                captionName = selectedSlicers[0].captionName();
            for (var item in selectedSlicers) { /* NOSONAR: ForIn */
                var slicer = selectedSlicers[item];
                isDisplayHeader = isDisplayHeader || slicer.showHeader();
                isHideItem = isHideItem || !slicer.showNoDataItems();
                isVisuallyItem = isVisuallyItem || slicer.visuallyNoDataItems();
                isShowItemLast = isShowItemLast || slicer.showNoDataItemsInLast();
                if (slicer.sortState() !== sortState) {
                    isSameSortState = false;
                }
                if (slicer.captionName() !== captionName) {
                    isSameCaptionName = false;
                }
            }
            if (isSameCaptionName) {
                $("#slicer-caption").val(captionName);
            } else {
                $("#slicer-caption").val("");
            }
            if (isDisplayHeader) {
                $("#display-header").prop("checked", true);
            } else {
                $("#display-header").prop("checked", false);
            }
            if (isHideItem) {
                $("#hide-item").prop("checked", true);
            } else {
                $("#hide-item").prop("checked", false);
            }
            if (isVisuallyItem) {
                $("#visually-item").prop("checked", true);
            } else {
                $("#visually-item").prop("checked", false);
            }
            if (isShowItemLast) {
                $("#show-item").prop("checked", true);
            } else {
                $("#show-item").prop("checked", false);
            }
            if (isSameSortState) {
                if (sortState === 1 /* Ascending */) {
                    $("#ascending").prop("checked", true);
                } else {
                    $("#descending").prop("checked", true);
                }
            } else {
                $("#ascending").prop("checked", false);
                $("#descending").prop("checked", false);
            }
        };
        return SlicerSettingDialog;
    })(designer.BaseDialog);
    designer.SlicerSettingDialog = SlicerSettingDialog;

    var SlicerStyleDialog = (function (_super) {
        designer.extends(SlicerStyleDialog, _super);
        function SlicerStyleDialog() {
            _super.call(this, (dialog2HtmlPath), '.slicer-style-dialog');
        }

        SlicerStyleDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 600,
                modal: true,
                title: designer.res.formatSlicerStyle.slicerStyle,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            if (self._existSlicerStyleName()) {
                                designer.MessageBox.show(designer.res.formatSlicerStyle.exception, designer.res.title, 2 /* warning */);
                            } else {
                                SlicerStyleDialog.currentId++;
                                self._storageStyle();
                                designer.actions.isFileModified = true;
                                self.close();
                                designer.wrapper.setFocusToSpread();
                            }
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

        SlicerStyleDialog.prototype._init = function () {
            var slicerContent = "- - - -";
            $(".slicer-pre-style").find("span").text(slicerContent);

            $(".slicer-pre-style").attr("style", "");
            $("#slicer-pre-header").attr("style", "");
            $("#selected-item-data").attr("style", "");
            $("#selected-item-no-data").attr("style", "");
            $("#unselected-item-data").attr("style", "");
            $("#unselected-item-no-data").attr("style", "");
            $("#hovered-selected-item-data").attr("style", "");
            $("#hovered-selected-item-no-data").attr("style", "");
            $("#hovered-unselected-item-data").attr("style", "");
            $("#hovered-unselected-item-no-data").attr("style", "");

            $(".slicer-pre-style").find("span").css("text-decoration", "none");

            this._slicerElementSelect = this._element.find('.slicer-element-select');
            this._formatSlicerElement = this._element.find('.format-slicer-element');
            this._clearSlicerElement = this._element.find('.clear-slicer-element');

            this._slicerStyle = new GC.Spread.Sheets.Slicers.SlicerStyle();
            this._wholeStyle = new GC.Spread.Sheets.Style();
            this._headerStyle = new GC.Spread.Sheets.Style();
            this._selectedItemWithDataStyle = new GC.Spread.Sheets.Style();
            this._selectedItemWithNoDataStyle = new GC.Spread.Sheets.Style();
            this._unselectedItemWithDataStyle = new GC.Spread.Sheets.Style();
            this._unselectedItemWithNoDataStyle = new GC.Spread.Sheets.Style();
            this._hoveredSelectedItemWithDataStyle = new GC.Spread.Sheets.Style();
            this._hoveredSelectedItemWithNoDataStyle = new GC.Spread.Sheets.Style();
            this._hoveredUnselectedItemWithDataStyle = new GC.Spread.Sheets.Style();
            this._hoveredUnselectedItemWithNoDataStyle = new GC.Spread.Sheets.Style();

            this._createSlicerStyleName();
            this._createSlicerElement();
            this._attachEvent();
        };

        SlicerStyleDialog.prototype._createSlicerStyleName = function () {
            var name = designer.res.formatSlicerStyle.slicerStyle + " " + SlicerStyleDialog.currentId;
            this._element.find('.slicer-style-input').val(name);
        };

        SlicerStyleDialog.prototype._createSlicerElement = function () {
            var eles = designer.res.slicerElement;
            for (var name in eles) { /* NOSONAR: ForIn */
                $('<option></option>').attr('strip-size', 1).val(name).text(eles[name]).appendTo(this._slicerElementSelect);
            }
            this._slicerElementSelect.attr('size', 8);
            this._slicerElementSelect.get(0).selectedIndex = 0;
        };

        var lineBorderWidth = {
            9 /* dashDot */: 1,
            1 /* thin */: 1,
            3 /* dashed */: 1,
            4 /* dotted */: 1,
            7 /* hair */: 1,
            11 /* dashDotDot */: 1,
            2 /* medium */: 2,
            10 /* mediumDashDot */: 2,
            12 /* mediumDashDotDot */: 2,
            8 /* mediumDashed */: 2,
            13 /* slantedDashDot */: 2,
            5 /* thick */: 3,
            6 /* double */: 3
        };

        SlicerStyleDialog.prototype._changeLineBorderToSlicerBorder = function (lineBorder) {
            var slicerBorder = new GC.Spread.Sheets.Slicers.SlicerBorder();
            if (!lineBorder) {
                return null;
            } else {
                slicerBorder.borderColor(lineBorder.color);
                slicerBorder.borderStyle(this._getWebBorderStyle(lineBorder.style));
                slicerBorder.borderWidth(lineBorderWidth[lineBorder.style]);
                return slicerBorder;
            }
        };

        SlicerStyleDialog.prototype._getWebBorderStyle = function (style) {
            if (style) {
                switch (style) {
                    case 6 /* double */
                        :
                        return "double";
                    case 9 /* dashDot */
                        :
                    case 11 /* dashDotDot */
                        :
                    case 4 /* dotted */
                        :
                    case 13 /* slantedDashDot */
                        :
                    case 10 /* mediumDashDot */
                        :
                    case 12 /* mediumDashDotDot */
                        :
                        return "dotted";
                    case 2 /* medium */
                        :
                    case 3 /* dashed */
                        :
                    case 8 /* mediumDashed */
                        :
                        return "dashed";
                    default:
                        return "solid";
                }
            }
            return "solid";
        };

        SlicerStyleDialog.prototype._attachEvent = function () {
            var self = this;
            this._formatSlicerElement.click(function () {
                var style = new Sheets.Style();
                style = self._recoverDialogStyle(style);
                if (self._formatDialog === undefined) {
                    self._formatDialog = new designer.FormatDialog();
                }
                self._formatDialog.open('font', undefined, style, true);
                self._formatDialog.selectTabOptions = { font: true, border: true, fill: true };
                self._formatDialog.setFormatDirectly(false);

                $(self._formatDialog).on('okClicked', function (evt, args) {
                    self._updatePreview(args);
                });
            });
            this._clearSlicerElement.click(function () {
                self._initSlicerStyle();
            });
        };

        SlicerStyleDialog.prototype._removeEvent = function () {
            this._formatSlicerElement.unbind('click');
            this._clearSlicerElement.unbind('click');
        };

        SlicerStyleDialog.prototype._initSlicerStyle = function () {
            var slicerStyleInfo = new GC.Spread.Sheets.Slicers.SlicerStyleInfo();
            var selectElementMethod = this._slicerElementSelect.find('option:selected').val();
            switch (selectElementMethod) {
                case "wholeSlicer":
                    this._wholeStyle = new GC.Spread.Sheets.Style();
                    this._initWholePreviewStyle();
                    this._slicerStyle.wholeSlicerStyle(slicerStyleInfo);
                    break;
                case "header":
                    this._headerStyle = new GC.Spread.Sheets.Style();
                    this._initPreviewStyle($("#slicer-pre-header"));
                    this._slicerStyle.headerStyle(slicerStyleInfo);
                    break;
                case "selectedItemWithData":
                    this._selectedItemWithDataStyle = new GC.Spread.Sheets.Style();
                    this._initPreviewStyle($("#selected-item-data"));
                    this._slicerStyle.selectedItemWithDataStyle(slicerStyleInfo);
                    break;
                case "selectedItemWithNoData":
                    this._selectedItemWithNoDataStyle = new GC.Spread.Sheets.Style();
                    this._initPreviewStyle($("#selected-item-no-data"));
                    this._slicerStyle.selectedItemWithNoDataStyle(slicerStyleInfo);
                    break;
                case "unselectedItemWithData":
                    this._unselectedItemWithDataStyle = new GC.Spread.Sheets.Style();
                    this._initPreviewStyle($("#unselected-item-data"));
                    this._slicerStyle.unSelectedItemWithDataStyle(slicerStyleInfo);
                    break;
                case "unselectedItemWithNoData":
                    this._unselectedItemWithNoDataStyle = new GC.Spread.Sheets.Style();
                    this._initPreviewStyle($("#unselected-item-no-data"));
                    this._slicerStyle.unSelectedItemWithNoDataStyle(slicerStyleInfo);
                    break;
                case "hoveredSelectedItemWithData":
                    this._hoveredSelectedItemWithDataStyle = new GC.Spread.Sheets.Style();
                    this._initPreviewStyle($("#hovered-selected-item-data"));
                    this._slicerStyle.hoveredSelectedItemWithDataStyle(slicerStyleInfo);
                    break;
                case "hoveredSelectedItemWithNoData":
                    this._hoveredSelectedItemWithNoDataStyle = new GC.Spread.Sheets.Style();
                    this._initPreviewStyle($("#hovered-selected-item-no-data"));
                    this._slicerStyle.hoveredSelectedItemWithNoDataStyle(slicerStyleInfo);
                    break;
                case "hoveredUnselectedItemWithData":
                    this._hoveredUnselectedItemWithDataStyle = new GC.Spread.Sheets.Style();
                    this._initPreviewStyle($("#hovered-unselected-item-data"));
                    this._slicerStyle.hoveredUnSelectedItemWithDataStyle(slicerStyleInfo);
                    break;
                case "hoveredUnselectedItemWithNoData":
                    this._hoveredUnselectedItemWithNoDataStyle = new GC.Spread.Sheets.Style();
                    this._initPreviewStyle($("#hovered-unselected-item-no-data"));
                    this._slicerStyle.hoveredUnSelectedItemWithNoDataStyle(slicerStyleInfo);
                    break;
            }
        };

        SlicerStyleDialog.prototype._initWholePreviewStyle = function () {
            var wholeSlicerStyleSelector = $(".slicer-pre-style");
            wholeSlicerStyleSelector.removeAttr("style");
            wholeSlicerStyleSelector.find("span").css("text-decoration", "none");

            var styleInfo = this._slicerStyle.headerStyle();
            styleInfo && this._setTextDecoration($("#slicer-pre-header"), styleInfo.textDecoration());
            styleInfo = this._slicerStyle.selectedItemWithDataStyle();
            styleInfo && this._setTextDecoration($("#selected-item-data"), styleInfo.textDecoration());
            styleInfo = this._slicerStyle.selectedItemWithNoDataStyle();
            styleInfo && this._setTextDecoration($("#selected-item-no-data"), styleInfo.textDecoration());
            styleInfo = this._slicerStyle.unSelectedItemWithDataStyle();
            styleInfo && this._setTextDecoration($("#unselected-item-data"), styleInfo.textDecoration());
            styleInfo = this._slicerStyle.unSelectedItemWithNoDataStyle();
            styleInfo && this._setTextDecoration($("#unselected-item-no-data"), styleInfo.textDecoration());
            styleInfo = this._slicerStyle.hoveredSelectedItemWithDataStyle();
            styleInfo && this._setTextDecoration($("#hovered-selected-item-data"), styleInfo.textDecoration());
            styleInfo = this._slicerStyle.hoveredSelectedItemWithNoDataStyle();
            styleInfo && this._setTextDecoration($("#hovered-selected-item-no-data"), styleInfo.textDecoration());
            styleInfo = this._slicerStyle.hoveredUnSelectedItemWithDataStyle();
            styleInfo && this._setTextDecoration($("#hovered-unselected-item-data"), styleInfo.textDecoration());
            styleInfo = this._slicerStyle.hoveredUnSelectedItemWithNoDataStyle();
            styleInfo && this._setTextDecoration($("#hovered-unselected-item-no-data"), styleInfo.textDecoration());
        };

        SlicerStyleDialog.prototype._initPreviewStyle = function (selector) {
            selector.removeAttr("style");
            var styleInfo = this._slicerStyle.wholeSlicerStyle();
            styleInfo && this._setTextDecoration(selector, styleInfo.textDecoration());
        };

        SlicerStyleDialog.prototype._recoverDialogStyle = function (style) {
            var selectElementMethod = this._slicerElementSelect.find('option:selected').val();
            switch (selectElementMethod) {
                case "wholeSlicer":
                    style = this._wholeStyle;
                    break;
                case "header":
                    style = this._headerStyle;
                    break;
                case "selectedItemWithData":
                    style = this._selectedItemWithDataStyle;
                    break;
                case "selectedItemWithNoData":
                    style = this._selectedItemWithNoDataStyle;
                    break;
                case "unselectedItemWithData":
                    style = this._unselectedItemWithDataStyle;
                    break;
                case "unselectedItemWithNoData":
                    style = this._unselectedItemWithNoDataStyle;
                    break;
                case "hoveredSelectedItemWithData":
                    style = this._hoveredSelectedItemWithDataStyle;
                    break;
                case "hoveredSelectedItemWithNoData":
                    style = this._hoveredSelectedItemWithNoDataStyle;
                    break;
                case "hoveredUnselectedItemWithData":
                    style = this._hoveredUnselectedItemWithDataStyle;
                    break;
                case "hoveredUnselectedItemWithNoData":
                    style = this._hoveredUnselectedItemWithNoDataStyle;
                    break;
            }
            return style;
        };

        SlicerStyleDialog.prototype._updatePreview = function (newStyle) {
            var slicerStyleInfo = new GC.Spread.Sheets.Slicers.SlicerStyleInfo();
            var selectElementMethod = this._slicerElementSelect.find('option:selected').val();
            if (newStyle) {
                slicerStyleInfo.backColor(newStyle.backColor);
                slicerStyleInfo.foreColor(newStyle.foreColor);
                slicerStyleInfo.font(newStyle.font);
                slicerStyleInfo.textDecoration(newStyle.textDecoration);
                var borderLeft = this._changeLineBorderToSlicerBorder(newStyle.borderLeft);
                var borderTop = this._changeLineBorderToSlicerBorder(newStyle.borderTop);
                var borderRight = this._changeLineBorderToSlicerBorder(newStyle.borderRight);
                var borderBottom = this._changeLineBorderToSlicerBorder(newStyle.borderBottom);
                borderLeft && slicerStyleInfo.borderLeft(borderLeft);
                borderTop && slicerStyleInfo.borderTop(borderTop);
                borderRight && slicerStyleInfo.borderRight(borderRight);
                borderBottom && slicerStyleInfo.borderBottom(borderBottom);
                switch (selectElementMethod) {
                    case "wholeSlicer":
                        this._wholeStyle = newStyle;
                        this._setPreviewStyle($(".slicer-pre-style"), newStyle);
                        this._slicerStyle.wholeSlicerStyle(slicerStyleInfo);
                        break;
                    case "header":
                        this._headerStyle = newStyle;
                        this._setPreviewStyle($("#slicer-pre-header"), newStyle);
                        this._slicerStyle.headerStyle(slicerStyleInfo);
                        break;
                    case "selectedItemWithData":
                        this._selectedItemWithDataStyle = newStyle;
                        this._setPreviewStyle($("#selected-item-data"), newStyle);
                        this._slicerStyle.selectedItemWithDataStyle(slicerStyleInfo);
                        break;
                    case "selectedItemWithNoData":
                        this._selectedItemWithNoDataStyle = newStyle;
                        this._setPreviewStyle($("#selected-item-no-data"), newStyle);
                        this._slicerStyle.selectedItemWithNoDataStyle(slicerStyleInfo);
                        break;
                    case "unselectedItemWithData":
                        this._unselectedItemWithDataStyle = newStyle;
                        this._setPreviewStyle($("#unselected-item-data"), newStyle);
                        this._slicerStyle.unSelectedItemWithDataStyle(slicerStyleInfo);
                        break;
                    case "unselectedItemWithNoData":
                        this._unselectedItemWithNoDataStyle = newStyle;
                        this._setPreviewStyle($("#unselected-item-no-data"), newStyle);
                        this._slicerStyle.unSelectedItemWithNoDataStyle(slicerStyleInfo);
                        break;
                    case "hoveredSelectedItemWithData":
                        this._hoveredSelectedItemWithDataStyle = newStyle;
                        this._setPreviewStyle($("#hovered-selected-item-data"), newStyle);
                        this._slicerStyle.hoveredSelectedItemWithDataStyle(slicerStyleInfo);
                        break;
                    case "hoveredSelectedItemWithNoData":
                        this._hoveredSelectedItemWithNoDataStyle = newStyle;
                        this._setPreviewStyle($("#hovered-selected-item-no-data"), newStyle);
                        this._slicerStyle.hoveredSelectedItemWithNoDataStyle(slicerStyleInfo);
                        break;
                    case "hoveredUnselectedItemWithData":
                        this._hoveredUnselectedItemWithDataStyle = newStyle;
                        this._setPreviewStyle($("#hovered-unselected-item-data"), newStyle);
                        this._slicerStyle.hoveredUnSelectedItemWithDataStyle(slicerStyleInfo);
                        break;
                    case "hoveredUnselectedItemWithNoData":
                        this._hoveredUnselectedItemWithNoDataStyle = newStyle;
                        this._setPreviewStyle($("#hovered-unselected-item-no-data"), newStyle);
                        this._slicerStyle.hoveredUnSelectedItemWithNoDataStyle(slicerStyleInfo);
                        break;
                }
            }
        };

        SlicerStyleDialog.prototype._setPreviewStyle = function (selector, source) {
            var backColor = this._formatColor(source.backColor);
            var foreColor = this._formatColor(source.foreColor);
            var borderLeft = source.borderLeft;
            var borderTop = source.borderTop;
            var borderRight = source.borderRight;
            var borderBottom = source.borderBottom;
            var textDecoration = source.textDecoration;
            if (backColor) {
                selector.css("background-color", backColor);
            }
            if (foreColor) {
                selector.css("color", foreColor);
            }
            if (borderLeft) {
                var borderLeftColor = this._formatColor(source.borderLeft.color);
                borderLeftColor && selector.css("border-left", "1px solid" + borderLeftColor);
            }
            if (borderTop) {
                var borderTopColor = this._formatColor(source.borderTop.color);
                borderTopColor && selector.css("border-top", "1px solid" + borderTopColor);
            }
            if (borderRight) {
                var borderRightColor = this._formatColor(source.borderRight.color);
                borderRightColor && selector.css("border-right", "1px solid" + borderRightColor);
            }
            if (borderBottom) {
                var borderBottomColor = this._formatColor(source.borderBottom.color);
                borderBottomColor && selector.css("border-bottom", "1px solid" + borderBottomColor);
            }
            this._setTextDecoration(selector, textDecoration);
        };

        SlicerStyleDialog.prototype._setTextDecoration = function (selector, textDecoration) {
            if (selector.find("span").length > 0) {
                selector = selector.find("span");
            }
            if (textDecoration === 2 /* LineThrough */) {
                selector.css("text-decoration", "line-through");
            } else if (textDecoration === 1 /* Underline */) {
                selector.css("text-decoration", "underline");
            } else if (textDecoration === (1 /* Underline */ | 2 /* LineThrough */)) {
                selector.css("text-decoration", "line-through underline");
            }
        };

        SlicerStyleDialog.prototype._formatColor = function (colorString) {
            if (!colorString || colorString.length === 0) {
                return null;
            }
            var spread = designer.wrapper.spread;
            var sheet = spread.getActiveSheet();
            var theme = sheet.currentTheme();
            if (theme) {
                return theme.getColor(colorString);
            }
            return null;
        };

        SlicerStyleDialog.prototype._existSlicerStyleName = function () {
            var tableSlicerName = this._element.find('.slicer-style-input').val();
            for (var name in SlicerStyleDialog.customSlicerStyle) { /* NOSONAR: ForIn */
                name = name.substring(name.indexOf('-') + 1);
                if (name === tableSlicerName) {
                    return true;
                }
            }
            return false;
        };

        SlicerStyleDialog.prototype._storageStyle = function () {
            var customPrefix = 'custom';
            var customSlicerStyleID = 1;
            var slicerStyleName = this._element.find('.slicer-style-input').val();
            this._slicerStyle.name(slicerStyleName);
            for (var name in SlicerStyleDialog.customSlicerStyle) { /* NOSONAR: ForIn */
                customSlicerStyleID++;
            }
            slicerStyleName = customPrefix + customSlicerStyleID.toString() + '-' + slicerStyleName;
            SlicerStyleDialog.customSlicerStyle[slicerStyleName] = this._slicerStyle;
        };

        SlicerStyleDialog.prototype.refresh = function () {
            this._removeEvent();
            if (this._slicerElementSelect.children().length !== 0) {
                this._slicerElementSelect.empty();
            }
            this._init();
        };
        SlicerStyleDialog.currentId = 1;

        SlicerStyleDialog.customSlicerStyle = {};
        return SlicerStyleDialog;
    })(designer.BaseDialog);
    designer.SlicerStyleDialog = SlicerStyleDialog;

    var FormatSlicerDialog = (function (_super) {
        designer.extends(FormatSlicerDialog, _super);
        function FormatSlicerDialog() {
            _super.call(this, (dialog2HtmlPath), '.format-slicer-dialog');
        }

        FormatSlicerDialog.prototype._initOptions = function () {
            var self = this;
            return {
                width: 'auto',
                modal: true,
                resizable: false,
                title: designer.res.slicerPropertyDialog.formatSlicer,
                buttons: [
                    {
                        text: designer.res.ok,
                        click: function () {
                            self.close();
                            self._applySetting();
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

        FormatSlicerDialog.prototype._init = function () {
            $(".slicer-property-tab > ul").css("margin-top", "0px");
            this._$itemWidth = this._element.find("#slicer-layout-item-width");
            this._$shapeWidth = this._element.find("#slicer-size-width");
            this._$shapeScaleWidth = this._element.find("#slicer-size-scale-width");
            this._$shapeHeight = this._element.find("#slicer-size-height");
            this._$shapeScaleHeight = this._element.find("#slicer-size-scale-height");
            this._$disableSlicer = this._element.find("#slicer-disable-resize");
            this._$columnCount = this._element.find("#slicer-layout-column-count");
        };

        FormatSlicerDialog.prototype._beforeOpen = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            this._isSameHeight = true;
            this._isSameItemWidth = true;
            this._isSameWidth = true;

            this._selectedSlicers = designer.util.getSelectedSlicers(sheet);
            if (!this._selectedSlicers || this._selectedSlicers.length === 0) {
                return;
            }
            this._bindValueChangedEvent();
            if (this._selectedSlicers.length > 1) {
                this._getMultiSlicerProperty(this._selectedSlicers);
            } else if (this._selectedSlicers.length === 1) {
                this._getSingleSlicerProperty(this._selectedSlicers[0]);
            }
            $("#slicer-size-scale-height").val("100");
            $("#slicer-size-scale-width").val("100");
        };

        FormatSlicerDialog.prototype._applySetting = function () {
            if (!this._selectedSlicers || this._selectedSlicers.length === 0) {
                return;
            } else if (this._selectedSlicers.length >= 1) {
                // this._setMultiSlicerProperty(this._selectedSlicers);
                if (!this._selectedSlicers || this._selectedSlicers.length === 0) {
                    return;
                }
                var horizontal = $("#slicer-position-horizontal").val();
                var vertical = $("#slicer-position-vertial").val();
                var columnCount = $("#slicer-layout-column-count").val();
                var itemHeight = $("#slicer-layout-item-height").val();
                var slicerHeight = $("#slicer-size-height").val();
                var slicerWidth = $("#slicer-size-width").val();
                var disableResizingAndMoving = $("#slicer-disable-resize").prop("checked");
                var locked = $("#slicer-locked").prop("checked");
                var noMoveSize = $("#no-move-size").prop("checked");
                var moveNoSize = $("#move-no-size").prop("checked");
                var moveSize = $("#move-size").prop("checked");
                var formatOption = {
                    horizontal: horizontal,
                    vertical: vertical,
                    columnCount: columnCount,
                    itemHeight: itemHeight,
                    slicerHeight: slicerHeight,
                    slicerWidth: slicerWidth,
                    disableResizingAndMoving: disableResizingAndMoving,
                    locked: locked,
                    noMoveSize: noMoveSize,
                    moveNoSize: moveNoSize,
                    moveSize: moveSize
                };
                designer.actions.doAction('baseDialogCommand', designer.wrapper.spread, {
                    value: {
                        formatOption: formatOption,
                        selectedSlicers: this._selectedSlicers
                    },
                    execute: designer.spreadActions.dialogAction.FormatSlicerForDialog
                });
            }
            this._unbindValueChangedEvent();
        };

        FormatSlicerDialog.prototype._bindValueChangedEvent = function () {
            var self = this;

            this._element.find(".slicer-property-tab").tabs();
            $("#position-layout").width(120);
            $("#size").width(60);
            $("#properties").width(80);

            this._element.find("#slicer-position-horizontal").spinner({
                min: 0
            });
            this._element.find("#slicer-position-vertial").spinner({
                min: 0
            });
            this._element.find("#slicer-layout-item-height").spinner({
                min: 0
            });
            this._$columnCount.spinner({
                min: 1,
                spin: function (event, ui) {
                    self._setColumnCount(ui.value);
                }
            });
            this._$shapeHeight.spinner({
                min: 0,
                spin: function (event, ui) {
                    self._setHeight(ui.value);
                }
            });
            this._$shapeScaleHeight.spinner({
                min: 0,
                spin: function (event, ui) {
                    self._setScaleHeight(ui.value);
                }
            });
            this._$itemWidth.spinner({
                min: 0,
                spin: function (event, ui) {
                    self._setItemWidth(ui.value);
                }
            });
            this._$shapeWidth.spinner({
                min: 0,
                spin: function (event, ui) {
                    self._setWidth(ui.value);
                }
            });
            this._$shapeScaleWidth.spinner({
                min: 0,
                spin: function (event, ui) {
                    self._setScaleWidth(ui.value);
                }
            });
            this._$columnCount.bind("input", function () {
                var columnCount = self._formatPropertyValue($(this).val());
                self._setColumnCount(columnCount);
            });
            this._$itemWidth.bind("input", function () {
                var width = self._formatPropertyValue($(this).val());
                self._setItemWidth(width);
            });
            this._$shapeWidth.bind("input", function () {
                var width = self._formatPropertyValue($(this).val());
                self._setWidth(width);
            });
            this._$shapeScaleWidth.bind("input", function () {
                var percent = self._formatPropertyValue($(this).val());
                self._setScaleWidth(percent);
            });
            this._$shapeHeight.bind("input", function () {
                var height = self._formatPropertyValue($(this).val());
                self._setHeight(height);
            });
            this._$shapeScaleHeight.bind("input", function () {
                var percent = self._formatPropertyValue($(this).val());
                self._setScaleHeight(percent);
            });
            this._$disableSlicer.bind("change", function () {
                if ($(this).prop("checked")) {
                    self._disableSpinner();
                } else {
                    self._enableSpinner();
                }
            });
        };

        FormatSlicerDialog.prototype._unbindValueChangedEvent = function () {
            this._$columnCount.unbind();
            this._$itemWidth.unbind();
            this._$shapeWidth.unbind();
            this._$shapeScaleWidth.unbind();
            this._$shapeHeight.unbind();
            this._$shapeScaleHeight.unbind();
            this._$disableSlicer.unbind();
        };

        FormatSlicerDialog.prototype._formatPropertyValue = function (propertyValue) {
            return designer.util.formatNumber(propertyValue);
        };

        FormatSlicerDialog.prototype._disableSpinner = function () {
            $("#slicer-position-horizontal").spinner("disable");
            $("#slicer-position-vertial").spinner("disable");
            $("#slicer-layout-column-count").spinner("disable");
            $("#slicer-layout-item-height").spinner("disable");
            $("#slicer-layout-item-width").spinner("disable");
            $("#slicer-size-height").spinner("disable");
            $("#slicer-size-width").spinner("disable");
            $("#slicer-size-scale-height").spinner("disable");
            $("#slicer-size-scale-width").spinner("disable");
        };

        FormatSlicerDialog.prototype._enableSpinner = function () {
            $("#slicer-position-horizontal").spinner("enable");
            $("#slicer-position-vertial").spinner("enable");
            $("#slicer-layout-column-count").spinner("enable");
            $("#slicer-layout-item-height").spinner("enable");
            $("#slicer-layout-item-width").spinner("enable");
            $("#slicer-size-height").spinner("enable");
            $("#slicer-size-width").spinner("enable");
            $("#slicer-size-scale-height").spinner("enable");
            $("#slicer-size-scale-width").spinner("enable");
        };



        FormatSlicerDialog.prototype._getSingleSlicerProperty = function (slicer) {
            if (!slicer) {
                return;
            }
            $("#slicer-position-horizontal").val(slicer.position().x);
            $("#slicer-position-vertial").val(slicer.position().y);
            $("#slicer-layout-column-count").val(slicer.columnCount());
            $("#slicer-layout-item-height").val(Math.round(slicer.itemHeight()));
            $("#slicer-layout-item-width").val(designer.util.getSlicerItemWidth(slicer.columnCount(), slicer.width()));
            $("#slicer-size-height").val(Math.round(slicer.height()));
            $("#slicer-size-width").val(Math.round(slicer.width()));
            if (slicer.disableResizingAndMoving()) {
                $("#slicer-disable-resize").prop("checked", true);
                this._disableSpinner();
            } else {
                $("#slicer-disable-resize").prop("checked", false);
                this._enableSpinner();
            }
            if (slicer.isLocked()) {
                $("#slicer-locked").prop("checked", true);
            } else {
                $("#slicer-locked").prop("checked", false);
            }
            if (slicer.dynamicMove()) {
                if (slicer.dynamicSize()) {
                    $("#move-size").prop("checked", true);
                } else {
                    $("#move-no-size").prop("checked", true);
                }
            } else {
                $("#no-move-size").prop("checked", true);
            }
        };

        FormatSlicerDialog.prototype._getMultiSlicerProperty = function (selectedSlicers) {
            if (!selectedSlicers || selectedSlicers.length === 0) {
                return;
            }
            var slicer = selectedSlicers[0], isSameDisableResizingMoving = true, isSameLocked = true,
                isSameColumnCount = true, isSameItemHeight = true, isSameDynamicMove = true, isSameDynamicSize = true,
                columnCount = selectedSlicers[0].columnCount(), itemHeight = selectedSlicers[0].itemHeight(),
                itemWidth = designer.util.getSlicerItemWidth(slicer.columnCount(), slicer.width()),
                height = selectedSlicers[0].height(), width = selectedSlicers[0].width(),
                dynamicMove = selectedSlicers[0].dynamicMove(), dynamicSize = selectedSlicers[0].dynamicSize();
            for (var item in selectedSlicers) { /* NOSONAR: ForIn */
                slicer = selectedSlicers[item];
                isSameDisableResizingMoving = isSameDisableResizingMoving && slicer.disableResizingAndMoving();
                isSameLocked = isSameLocked && slicer.isLocked();
                isSameDynamicMove = isSameDynamicMove && slicer.dynamicMove();
                isSameDynamicSize = isSameDynamicSize && slicer.dynamicSize();
                if (slicer.columnCount() !== columnCount) {
                    isSameColumnCount = false;
                }
                if (slicer.itemHeight() !== itemHeight) {
                    isSameItemHeight = false;
                }
                slicer = selectedSlicers[item];
                if (designer.util.getSlicerItemWidth(slicer.columnCount(), slicer.width()) !== itemWidth) {
                    this._isSameItemWidth = false;
                }
                if (slicer.height() !== height) {
                    this._isSameHeight = false;
                }
                if (slicer.width() !== width) {
                    this._isSameWidth = false;
                }
                if (slicer.dynamicMove() !== dynamicMove) {
                    isSameDynamicMove = false;
                }
                if (slicer.dynamicSize() !== dynamicSize) {
                    isSameDynamicSize = false;
                }
            }
            $("#slicer-position-horizontal").val("");
            $("#slicer-position-vertial").val("");
            if (isSameDynamicMove && isSameDynamicSize && dynamicMove) {
                if (dynamicSize) {
                    $("#move-size").prop("checked", true);
                } else {
                    $("#move-no-size").prop("checked", true);
                }
            } else {
                $("#no-move-size").prop("checked", true);
            }
            if (isSameColumnCount) {
                $("#slicer-layout-column-count").val(columnCount);
            } else {
                $("#slicer-layout-column-count").val("");
            }
            if (isSameItemHeight) {
                $("#slicer-layout-item-height").val(Math.round(itemHeight));
            } else {
                $("#slicer-layout-item-height").val("");
            }
            if (this._isSameItemWidth) {
                $("#slicer-layout-item-width").val(itemWidth);
            } else {
                $("#slicer-layout-item-width").val("");
            }
            if (this._isSameHeight) {
                $("#slicer-size-height").val(Math.round(height));
            } else {
                $("#slicer-size-height").val("");
            }
            if (this._isSameWidth) {
                $("#slicer-size-width").val(Math.round(width));
            } else {
                $("#slicer-size-width").val("");
            }
            if (isSameDisableResizingMoving) {
                $("#slicer-disable-resize").prop("checked", true);
                this._disableSpinner();
            } else {
                $("#slicer-disable-resize").prop("checked", false);
                this._enableSpinner();
            }
            if (isSameLocked) {
                $("#slicer-locked").prop("checked", true);
            } else {
                $("#slicer-locked").prop("checked", false);
            }
        };

        FormatSlicerDialog.prototype._getSelectedSlicerHeight = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var selectedSlicers = designer.util.getSelectedSlicers(sheet);
            if (!selectedSlicers || selectedSlicers.length === 0) {
                return;
            } else {
                return Math.round(selectedSlicers[0].height());
            }
        };

        FormatSlicerDialog.prototype._getSelectedSlicerWidth = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var selectedSlicers = designer.util.getSelectedSlicers(sheet);
            if (!selectedSlicers || selectedSlicers.length === 0) {
                return;
            } else {
                return Math.round(selectedSlicers[0].width());
            }
        };

        FormatSlicerDialog.prototype._getSelectedSlicerColumnCount = function () {
            var sheet = designer.wrapper.spread.getActiveSheet();
            var selectedSlicers = designer.util.getSelectedSlicers(sheet);
            if (!selectedSlicers || selectedSlicers.length === 0) {
                return;
            } else {
                return selectedSlicers[0].columnCount();
            }
        };

        FormatSlicerDialog.prototype._setColumnCount = function (columnCount) {
            if (columnCount <= 0) {
                return;
            }
            $("#slicer-layout-column-count").val(columnCount);
            var slicerWidth = this._getSelectedSlicerWidth();
            var itemWidth = designer.util.getSlicerItemWidth(columnCount, slicerWidth);
            $("#slicer-layout-item-width").val(itemWidth);
        };

        FormatSlicerDialog.prototype._setHeight = function (newHeight) {
            if (!this._isSameHeight) {
                $("#slicer-size-scale-height").val("");
                $("#slicer-size-scale-width").val("");
                return;
            }
            var slicerHeight = this._getSelectedSlicerHeight();
            var newPercent = Math.round((newHeight / slicerHeight) * 100);
            $("#slicer-size-scale-height").val(newPercent);
        };

        FormatSlicerDialog.prototype._setWidth = function (newWidth) {
            var slicerWidth = this._getSelectedSlicerWidth();
            var newPercent = Math.round((newWidth / slicerWidth) * 100);
            var columnCount = this._getSelectedSlicerColumnCount();
            var itemWidth = designer.util.getSlicerItemWidth(columnCount, newWidth);
            if (this._isSameItemWidth) {
                $("#slicer-layout-item-width").val(itemWidth);
            } else {
                $("#slicer-layout-item-width").val("");
            }
            if (this._isSameWidth) {
                $("#slicer-size-scale-width").val(newPercent);
            } else {
                $("#slicer-size-scale-width").val("");
            }
        };

        FormatSlicerDialog.prototype._setScaleHeight = function (newPercent) {
            if (!this._isSameHeight) {
                return;
            }
            var slicerHeight = this._getSelectedSlicerHeight();
            var newHeight = Math.round((newPercent * slicerHeight) / 100);
            $("#slicer-size-height").val(newHeight);
        };

        FormatSlicerDialog.prototype._setScaleWidth = function (newPercent) {
            if (!this._isSameWidth) {
                return;
            }
            var slicerWidth = this._getSelectedSlicerWidth();
            var newWidth = Math.round((newPercent * slicerWidth) / 100);
            var columnCount = this._getSelectedSlicerColumnCount();
            var itemWidth = designer.util.getSlicerItemWidth(columnCount, newWidth);
            $("#slicer-size-width").val(newWidth);
            $("#slicer-layout-item-width").val(itemWidth);
        };

        FormatSlicerDialog.prototype._setItemWidth = function (newItemWidth) {
            if (!this._isSameItemWidth) {
                $("#slicer-size-width").val("");
                $("#slicer-size-scale-width").val("100");
                return;
            }
            var oldSlicerWidth = this._getSelectedSlicerWidth();
            var columnCount = this._getSelectedSlicerColumnCount();
            var newSlicerWidth = designer.util.getSlicerWidthFromItem(columnCount, newItemWidth);
            var newPercent = Math.round((newSlicerWidth / oldSlicerWidth) * 100);
            $("#slicer-size-width").val(newSlicerWidth);
            $("#slicer-size-scale-width").val(newPercent);
        };
        return FormatSlicerDialog;
    })(designer.BaseDialog);
    designer.FormatSlicerDialog = FormatSlicerDialog;
})();