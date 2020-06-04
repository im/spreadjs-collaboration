var data = {
    "selected": 1,
    "tabs": [
        {
            "title": "File",
            "name": "file"
        },
        {
            "title": "Home",
            "name": "home",
            "collapse": ["groupStyle2", "groupFont", "groupAlignment", "*groupStyle3", "groupStyle1"],
            "groupCollapseItems": ["groupStyle1"],
            "groups": [
                {
                    "tools": [
                        {
                            "type": "group",
                            "collapseGroup": "groupFont",
                            "centerAlign": true,
                            "items": [
                                {
                                    "type": "input-group",
                                    "name": "fontFamily",
                                    "width": 70,
                                    "dropdown": ["Arial", "Arial Black", "Calibri", "Cambria", "Century", "Courier New", "Comic Sans MS", "Garamond", "Georgia", "Malgun Gothic", "Mangal", "Meiryo", "MS Gothic", "MS Mincho", "MS PGothic", "MS PMincho", "Roboto", "Tahoma", "Times", "Times New Roman", "Trebuchet MS", "Verdana", "Wingdings"]
                                },
                                {
                                    "type": "input-group",
                                    "name": "fontSize",
                                    "width": 40,
                                    "dropdown": [8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]
                                },
                            ]
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite Bold",
                            "name": "bold",
                            "text": "Bold",
                            "tooltip": "Bold",
                            "collapseGroup": "groupStyle1",
                            "toggle": true,
                            "nolabel": true
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite Italic",
                            "name": "italic",
                            "text": "Italic",
                            "tooltip": "Italic",
                            "collapseGroup": "groupStyle1",
                            "toggle": true,
                            "nolabel": true
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite Underline",
                            "name": "underline",
                            "text": "Underline",
                            "tooltip": "Underline",
                            "collapseGroup": "groupStyle1",
                            "toggle": true,
                            "nolabel": true
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite UnderlineDouble",
                            "name": "doubleUnderline",
                            "text": "Double Underline",
                            "tooltip": "Double Underline",
                            "collapseGroup": "groupStyle1",
                            "toggle": true,
                            "nolabel": true
                        },
                        {
                            "type": "group",
                            "collapseGroup": "groupStyle3",
                            "tooltip": "Borders",
                            "items": [
                                {
                                    "type": "icon-group",
                                    "iconClass": "sprite BorderBottomNoToggle",
                                    "name": "border",
                                    "text": "Borders",
                                    "header": "Borders",
                                    "minWidth": 280,
                                    "dropdown": [
                                        { "value": "bottom", "text": "Bottom Border", "iconClass": "sprite BorderBottom" },
                                        { "value": "top", "text": "Top Border", "iconClass": "sprite BorderTop" },
                                        { "value": "left", "text": "Left Border", "iconClass": "sprite BorderLeft" },
                                        { "value": "right", "text": "Right Border", "iconClass": "sprite BorderRight" },
                                        "",
                                        { "value": "none", "text": "No Border", "iconClass": "sprite BorderNone" },
                                        { "value": "all", "text": "All Borders", "iconClass": "sprite BordersAll" },
                                        { "value": "outside", "text": "Outside Borders", "iconClass": "sprite BorderOutside" },
                                        { "value": "thick", "text": "Thick Box Border", "iconClass": "sprite BorderThickOutside" },
                                        "",
                                        { "value": "doublebottom", "text": "Bottom Double Border", "iconClass": "sprite BorderDoubleBottom" },
                                        { "value": "thickbottom", "text": "Thick Bottom Border", "iconClass": "sprite BorderThickBottom" },
                                        { "value": "top-bottom", "text": "Top and Bottom Border", "iconClass": "sprite BorderTopAndBottom" },
                                        { "value": "top-thickbottom", "text": "Top and Thick Bottom Border", "iconClass": "sprite BorderTopAndThickBottom" },
                                        { "value": "top-doublebottom", "text": "Top and Double Bottom Border", "iconClass": "sprite BorderTopAndDoubleBottom" },
                                        "",
                                        { "value": "more", "text": "More Borders...", "iconClass": "sprite BordersMoreDialog" }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "group",
                            "collapseGroup": "groupStyle3",
                            "tooltip": "Fill Color",
                            "items": [
                                {
                                    "type": "setcolor-group",
                                    "iconClass": "sprite FillBackColorSplitDropdown",
                                    "name": "backColor",
                                    "text": "Fill Color",
                                    "colorPickerOptions": { "nofill": { "show": true, "text": "No Fill", "color": "white" }, "header": "Fill Color" }
                                }
                            ]
                        },
                        {
                            "type": "group",
                            "collapseGroup": "groupStyle3",
                            "tooltip": "Font Color",
                            "items": [
                                {
                                    "type": "setcolor-group",
                                    "iconClass": "sprite GroupBasicText",
                                    "name": "foreColor",
                                    "text": "Font Color",
                                    "colorPickerOptions": { "autocolor": { "show": false, "text": "Automatic", "color": "black" }, "header": "Font Color" }
                                }
                            ]
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite Overline",
                            "name": "overline",
                            "text": "Overline",
                            "tooltip": "Overline",
                            "collapseGroup": "groupStyle2",
                            "toggle": true
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite Strikethrough",
                            "name": "strikethrough",
                            "text": "Strikethrough",
                            "tooltip": "Strikethrough",
                            "collapseGroup": "groupStyle2",
                            "toggle": true
                        },
                        {
                            "type": "dropdown",
                            "minWidth": 210,
                            "iconClass": "glyphicon glyphicon-menu-down",
                            "name": "font",
                            "header": "Font",
                            "items": []
                        }
                    ]
                },
                {
                    "tools": [
                        {
                            "type": "dropdown",
                            "iconClass": "sprite AlignCenter",
                            "name": "align",
                            "tooltip": "Alignment",
                            "header": "Alignment",
                            "items": ["indent", "outdent"],
                            "rows": [
                                {
                                    "type": "icon-group",
                                    "items": [
                                        {
                                            "iconClass": "sprite AlignTopExcel",
                                            "name": "valign-top",
                                            "text": "Top",
                                            "toggle": true,
                                            "nolabel": true,
                                            "toggleGroup": "valign"
                                        },
                                        {
                                            "iconClass": "sprite AlignMiddleExcel",
                                            "name": "valign-center",
                                            "text": "Middle",
                                            "toggle": true,
                                            "nolabel": true,
                                            "toggleGroup": "valign"
                                        },
                                        {
                                            "iconClass": "sprite AlignBottomExcel",
                                            "name": "valign-bottom",
                                            "text": "Bottom",
                                            "toggle": true,
                                            "nolabel": true,
                                            "toggleGroup": "valign"
                                        }
                                    ]
                                },
                                {
                                    "type": "icon-group",
                                    "items": [
                                        {
                                            "iconClass": "sprite AlignLeft",
                                            "name": "halign-left",
                                            "text": "Left",
                                            "toggle": true,
                                            "nolabel": true,
                                            "toggleGroup": "halign"
                                        },
                                        {
                                            "iconClass": "sprite AlignCenter",
                                            "name": "halign-center",
                                            "text": "Center",
                                            "toggle": true,
                                            "nolabel": true,
                                            "toggleGroup": "halign"
                                        },
                                        {
                                            "iconClass": "sprite AlignRight",
                                            "name": "halign-right",
                                            "text": "Right",
                                            "toggle": true,
                                            "nolabel": true,
                                            "toggleGroup": "halign"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite MergeCenter",
                            "name": "cellmerge",
                            "text": "Merge & Center",
                            "collapseGroup": "groupAlignment",
                            "toggle": true
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite WrapText",
                            "name": "wordwrap",
                            "text": "Wrap Text",
                            "collapseGroup": "groupAlignment",
                            "toggle": true
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite CellAlignmentOptions",
                            "name": "verticalText",
                            "text": "Vertical Text",
                            "collapseGroup": "groupAlignment",
                            "toggle": true
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite IndentIncrease",
                            "name": "indent",
                            "text": "Increase Indent",
                            "collapseGroup": "groupIndent"
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite IndentDecrease",
                            "name": "outdent",
                            "text": "Decrease Indent",
                            "collapseGroup": "groupIndent"
                        }
                    ]
                },
                {
                    "tools": [
                        {
                            "type": "group",
                            "tooltip": "Cell Format",
                            "items": [
                                {
                                    "type": "dropdown-only",
                                    "iconClass": "sprite DollarSign",
                                    "name": "cellformat",
                                    "text": "Cell Format",
                                    "dropdown": [
                                        { "value": "nullValue", "text": "General", "iconClass": "sprite DataTypeGeneral" },
                                        { "value": "0.00", "text": "Number", "iconClass": "sprite DataTypeNumber" },
                                        { "value": "$#,##0.00", "text": "Currency", "iconClass": "sprite DataTypeCurrency" },
                                        { "value": "$ #,##0.00;$ (#,##0.00);$ \"-\"??;@", "text": "Accounting", "iconClass": "sprite DataTypeCurrencyBasic" },
                                        { "value": "m/d/yyyy", "text": "Short Date", "iconClass": "sprite DataTypeShortDate" },
                                        { "value": "dddd, mmmm dd, yyyy", "text": "Long Date", "iconClass": "sprite DataTypeLongDate" },
                                        { "value": "h:mm:ss AM/PM", "text": "Time", "iconClass": "sprite DataTypeTime" },
                                        { "value": "0%", "text": "Percentage", "iconClass": "sprite PercentStyle" },
                                        { "value": "# ?/?", "text": "Fraction", "iconClass": "sprite DataTypeStandard" },
                                        { "value": "0.00E+00", "text": "Scientific", "iconClass": "sprite DataTypeScientific" },
                                        { "value": "@", "text": "Text", "iconClass": "sprite DataTypeText" },
                                        "",
                                        { "value": "custom", "text": "Custom Format" }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "group",
                            "tooltip": "Number Format",
                            "items": [
                                {
                                    "type": "dropdown-only",
                                    "iconClass": "sprite PercentStyle",
                                    "name": "numberformat",
                                    "text": "Number Format",
                                    "dropdown": [
                                        { "value": "percentStyle", "text": "Percent Style", "iconClass": "sprite PercentStyle" },
                                        { "value": "commaStyle", "text": "Comma Style", "iconClass": "sprite CommaStyle" },
                                        { "value": "increaseDecimal", "text": "Increase Decimal", "iconClass": "sprite DecimalsIncrease" },
                                        { "value": "decreaseDecimal", "text": "Decrease Decimal", "iconClass": "sprite DecimalsDecrease" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "tools": [
                        {
                            "type": "group",
                            "tooltip": "Cell Type",
                            "items": [
                                {
                                    "type": "dropdown-only",
                                    "iconClass": "sprite CellProperties",
                                    "name": "celltype",
                                    "text": "Cell Type",
                                    "dropdown": [
                                        { "value": "button", "text": "Button CellType" },
                                        { "value": "checkbox", "text": "Checkbox CellType" },
                                        { "value": "combobox", "text": "Combobox CellType" },
                                        { "value": "hyperlink", "text": "Hyperlink CellType" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "tools": [
                        {
                            "type": "icon",
                            "iconClass": "sprite Lock",
                            "name": "protectsheet",
                            "text": "Protect Sheet",
                            "tooltips": ["Protect Sheet", "Unprotect Sheet"],
                            "toggle": true
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite Lock",
                            "name": "unlockcells",
                            "text": "Unlock Cells",
                            "tooltips": ["Lock Cells", "Unlock Cells"],
                            "toggle": true,
                            "checked": true
                        }
                    ]
                },
                {
                    "tools": [
                        {
                            "type": "group",
                            "tooltip": "Insert & Delete",
                            "items": [
                                {
                                    "type": "dropdown-only",
                                    "iconClass": "sprite InsertCellMenu",
                                    "name": "cellsgroup",
                                    "text": "Insert & Delete",
                                    "dropdown": [
                                        { "value": "insertRows", "text": "Insert Rows", "iconClass": "sprite InsertRow" },
                                        { "value": "insertColumns", "text": "Insert Columns", "iconClass": "sprite InsertColumns" },
                                        { "value": "insert-shiftCellsRight", "text": "Insert Cells and Shift Right", "iconClass": "sprite InsertColumnLeft" },
                                        { "value": "insert-shiftCellsDown", "text": "Insert Cells and Shift Down", "iconClass": "sprite InsertRowAbove" },
                                        { "value": "deleteRows", "text": "Delete Rows", "iconClass": "sprite CellsDelete" },
                                        { "value": "deleteColumns", "text": "Delete Columns", "iconClass": "sprite CellsDeleteSmart" },
                                        { "value": "delete-shiftCellsLeft", "text": "Delete Cells and Shift Left", "iconClass": "sprite CellsDelete" },
                                        { "value": "delete-shiftCellsUp", "text": "Delete Cells and Shift Up", "iconClass": "sprite CellsDeleteSmart" }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "group",
                            "tooltip": "Clear",
                            "items": [
                                {
                                    "type": "dropdown-only",
                                    "iconClass": "sprite ClearMenu",
                                    "name": "clearformat",
                                    "text": "Clear",
                                    "dropdown": [
                                        { "value": "clearAll", "text": "Clear All", "iconClass": "sprite ClearAll" },
                                        { "value": "clearFormatting", "text": "Clear Formatting", "iconClass": "sprite ClearAllFormatting" },
                                        { "value": "clear", "text": "Clear", "iconClass": "sprite Clear" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "tools": [
                        {
                            "ignore": true,
                            "type": "icon",
                            "iconClass": "sprite Clear",
                            "name": "conditionalformat",
                            "text": "Conditional Formatting"
                        }
                    ]
                },
                {
                    "tools": [
                        {
                            "type": "icon",
                            "iconClass": "sprite SearchUI",
                            "name": "find",
                            "text": "Find"
                        }
                    ]
                }
            ]
        },
        {
            "title": "Insert",
            "name": "insert",
            "collapse": ["*groupInsert"],
            "groups": [
                {
                    "tooltip": "Insert",
                    "tools": [
                        {
                            "type": "icon",
                            "iconClass": "sprite InsertTable icon-text",
                            "name": "insertTable",
                            "text": "Table",
                            "collapseGroup": "groupInsert"
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite InsertPictureDialog icon-text",
                            "name": "insertPicture",
                            "text": "Pictures",
                            "collapseGroup": "groupInsert"
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite InsertLink icon-text",
                            "name": "insertLink",
                            "text": "Link",
                            "header": "Insert Link",
                            "collapseGroup": "groupInsert"
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite InsertNewComment icon-text",
                            "name": "insertComment",
                            "text": "Comment",
                            "collapseGroup": "groupInsert"
                        },
                        {
                            "type": "group",
                            "tooltip": "Sparklines",
                            "collapseGroup": "groupInsert",
                            "items": [
                                {
                                    "type": "dropdown-only",
                                    "iconClass": "sprite SparklineLineInsert icon-text",
                                    "name": "insertSparkline",
                                    "haslabel": true,
                                    "text": "Sparklines",
                                    "dropdown": [
                                        { "value": "line", "text": "Line Sparkline" },
                                        { "value": "column", "text": "Column Sparkline" },
                                        { "value": "winloss", "text": "Win/Loss Sparkline" },
                                        { "value": "pie", "text": "Pie Sparkline" },
                                        { "value": "area", "text": "Area Sparkline" },
                                        { "value": "scatter", "text": "Scatter Sparkline" },
                                        { "value": "spread", "text": "Spread Sparkline" },
                                        { "value": "stacked", "text": "Stacked Sparkline" },
                                        { "value": "boxplot", "text": "BoxPlot Sparkline" },
                                        { "value": "cascade", "text": "Cascade Sparkline" },
                                        { "value": "pareto", "text": "Pareto Sparkline" },
                                        { "value": "bullet", "text": "Bullet Sparkline" },
                                        { "value": "hbar", "text": "Hbar Sparkline" },
                                        { "value": "vbar", "text": "Vbar Sparkline" },
                                        { "value": "vari", "text": "Variance Sparkline" }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "group",
                            "tooltip": "BarCode",
                            "collapseGroup": "groupInsert",
                            "items": [
                                {
                                    "type": "dropdown-only",
                                    "iconClass": "barcode icon-text",
                                    "name": "insertBarCode",
                                    "haslabel": true,
                                    "text": "BarCode",
                                    "dropdown": [
                                        { "value": "qrCode", "text": "QRCode" },
                                        { "value": "dataMatrix", "text": "DataMatrix" },
                                        { "value": "codabar", "text": "Codabar" },
                                        { "value": "pdf417", "text": "PDF417" },
                                        { "value": "ean8", "text": "EAN8" },
                                        { "value": "ean13", "text": "EAN13" },
                                        { "value": "gs1_128", "text": "GS1_128" },
                                        { "value": "code39", "text": "Code39" },
                                        { "value": "code49", "text": "Code49" },
                                        { "value": "code93", "text": "Code93" },
                                        { "value": "code128", "text": "Code128" }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "group",
                            "tooltip": "Chart",
                            "collapseGroup": "groupInsert",
                            "items": [
                                {
                                    "type": "dropdown-only",
                                    "iconClass": "chartIconBase ChartInsert icon-text",
                                    "name": "insertChart",
                                    "haslabel": true,
                                    "text": "Chart",
                                    "dropdown": [
                                        {
                                            "value": "column1",
                                            "text": "Column Chart",
                                            "header": "Column Chart",
                                            "iconClass": "chartIcon ColumnChart",
                                            "childrenList": [
                                                {
                                                    "type": "dropdown-only",
                                                    "name": "columnChart",
                                                    "haslabel": true,
                                                    "text": "Column Chart",
                                                    "dropdown": [
                                                        { "value": "clusteredColumn", "text": "Clustered Column", "iconClass": "chartIconBase clustered-column-icon" },
                                                        { "value": "stackedColumn", "text": "Stacked Column", "iconClass": "chartIconBase stacked-column-icon" },
                                                        { "value": "100%StackedColumn", "text": "100%Stacked Column", "iconClass": "chartIconBase stacked100-column-icon" }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "value": "line1", "text": "Line Chart", "iconClass": "chartIcon LineChart", "childrenList": [
                                                {
                                                    "type": "dropdown-only",
                                                    "name": "lineChart",
                                                    "haslabel": true,
                                                    "text": "Line Chart",
                                                    "dropdown": [
                                                        { "value": "line", "text": "Line", "iconClass": "chartIconBase line-icon" },
                                                        { "value": "StackedLine", "text": "Stacked Line", "iconClass": "chartIconBase stacked-line-icon" },
                                                        { "value": "100%StackedLine", "text": "100%Stacked Line", "iconClass": "chartIconBase stacked100-line-icon" },
                                                        { "value": "lineWithMarkers", "text": "Line With Markers", "iconClass": "chartIconBase line-markers-icon" },
                                                        { "value": "stackedLineWithMarkers", "text": "Stacked Line With Markers", "iconClass": "chartIconBase stacked-line-markers-icon" },
                                                        { "value": "100%StackedLineWithMarkers", "text": "100%Stacked Line With Markers", "iconClass": "chartIconBase stacked100-line-markers-icon" }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "value": "pie1", "text": "Pie Chart", "iconClass": "chartIcon PieChart", "childrenList": [
                                                {
                                                    "type": "dropdown-only",
                                                    "name": "pieChart",
                                                    "haslabel": true,
                                                    "text": "Pie Chart",
                                                    "dropdown": [
                                                        { "value": "pie", "text": "Pie", "iconClass": "chartIconBase pie-icon" },
                                                        { "value": "doughnut", "text": "Doughnut", "iconClass": "chartIconBase doughnut-icon" }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "value": "bar1", "text": "Bar Chart", "iconClass": "chartIcon BarChart", "childrenList": [
                                                {
                                                    "type": "dropdown-only",
                                                    "name": "barChart",
                                                    "haslabel": true,
                                                    "text": "Bar Chart",
                                                    "dropdown": [
                                                        { "value": "clusteredBar", "text": "Clustered Bar", "iconClass": "chartIconBase clustered-bar-icon" },
                                                        { "value": "stackedBar", "text": "Stacked Bar", "iconClass": "chartIconBase stacked-bar-icon" },
                                                        { "value": "100%StackedBar", "text": "100%Stacked Bar", "iconClass": "chartIconBase stacked100-bar-icon" }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "value": "area1", "text": "Area Chart", "iconClass": "chartIcon AreaChart", "childrenList": [
                                                {
                                                    "type": "dropdown-only",
                                                    "name": "areaChart",
                                                    "haslabel": true,
                                                    "text": "Area Chart",
                                                    "dropdown": [
                                                        { "value": "area", "text": "Area", "iconClass": "chartIconBase area-icon" },
                                                        { "value": "stackedArea", "text": "Stacked Area", "iconClass": "chartIconBase stacked-area-icon" },
                                                        { "value": "100%StackedArea", "text": "100%Stacked Area", "iconClass": "chartIconBase stacked100-area-icon" }
                                                    ]
                                                },
                                            ]
                                        },
                                        {
                                            "value": "xyScatter1", "text": "XY(Scatter) Chart", "iconClass": "chartIcon XyScatterChart", "childrenList": [
                                                {
                                                    "type": "dropdown-only",
                                                    "name": "xyScatterChart",
                                                    "haslabel": true,
                                                    "text": "XY(Scatter) Chart",
                                                    "dropdown": [
                                                        { "value": "xyScatter", "text": "XY(Scatter)", "iconClass": "chartIconBase XYScatter-icon" },
                                                        { "value": "xyScatterLines", "text": "XY(Scatter) Lines", "iconClass": "chartIconBase XYScatter-line-icon" },
                                                        { "value": "xyScatterLinesNoMarkers", "text": "XY(Scatter) Lines No Markers", "iconClass": "chartIconBase XYScatter-line-noMarkers-icon" },
                                                        { "value": "xyScatterSmooth", "text": "xy(Scatter) Smooth", "iconClass": "chartIconBase XYScatter-smooth-icon" },
                                                        { "value": "xyScatterSmoothNoMarkers", "text": "XY(Scatter) Smooth No Markers", "iconClass": "chartIconBase XYScatter-smooth-noMarkers-icon" },
                                                        { "value": "bubble", "text": "Bubble", "iconClass": "chartIconBase bubble-icon" }
                                                    ]
                                                },
                                            ]
                                        },
                                        {
                                            "value": "radar", "text": "Radar Chart", "iconClass": "radarChartContainer ", "childrenList": [
                                                {
                                                    "type": "dropdown-only",
                                                    "name": "radarChart",
                                                    "haslabel": true,
                                                    "text": "Radar Chart",
                                                    "dropdown": [
                                                        { "value": "radar", "text": "Radar", "iconClass": "chartIconBase radar-icon" },
                                                        { "value": "radarFilled", "text": "Radar Filled", "iconClass": "chartIconBase radarFilled-icon" },
                                                        { "value": "radarMarkers", "text": "Radar Markers", "iconClass": "chartIconBase radarMarkers-icon" },
                                                    ]
                                                },
                                            ]
                                        },
                                        { "value": "sunburst", "text": "Sunburst", "iconClass": "sunburst-icon" },
                                        { "value": "treemap", "text": "Treemap", "iconClass": "treemap-icon" }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "group",
                            "collapseGroup": "groupInsert",
                            "items": [{
                                "value": "shape",
                                "name": "Shape",
                                "iconClass": "shape icon-text",
                                "type": "shape-panel",
                                "haslabel": true
                            }]
                        },
                        {
                            "type": "dropdown",
                            "iconClass": "glyphicon glyphicon-menu-down",
                            "name": "insertDropdown",
                            "header": "Insert",
                            "items": []
                        }
                    ]
                }
            ]
        },
        {
            "title": "Formulas",
            "name": "formulas",
            "collapse": ["*groupFormula"],
            "groups": [
                {
                    "tooltip": "Formulas",
                    "tools": [
                        {
                            "ignore": true,
                            "type": "group",
                            "tooltip": "Sum",
                            "collapseGroup": "groupFormula",
                            "items": [
                                {
                                    "type": "icon-group",
                                    "iconClass": "glyphicon glyphicon-usd icon-text",
                                    "name": "autoSum",
                                    "haslabel": true,
                                    "text": "AutoSum",
                                    "header": "AutoSum",
                                    "dropdown": [
                                        { "value": "sum", "text": "Sum" },
                                        { "value": "average", "text": "Average" },
                                        { "value": "count", "text": "Count Numbers" },
                                        { "value": "max", "text": "Max" },
                                        { "value": "min", "text": "Min" }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite Formula icon-text",
                            "name": "insertFormula",
                            "text": "Insert Formula",
                            "collapseGroup": "groupFormula"
                        },
                        {
                            "ignore": true,
                            "type": "icon",
                            "iconClass": "glyphicon glyphicon-paperclip icon-text",
                            "name": "nameManager",
                            "text": "Name Manager",
                            "collapseGroup": "groupFormula"
                        },
                        {
                            "type": "dropdown",
                            "iconClass": "glyphicon glyphicon-menu-down",
                            "name": "setFormula",
                            "header": "Formulas",
                            "items": []
                        }
                    ]
                }, {
                    "tooltip": "Calculate Now",
                    "tools": [
                        {
                            "type": "icon",
                            "iconClass": "sprite CalculationOptionsMenu icon-text",
                            "name": "calculateNow",
                            "text": "Calculate Now"
                        }
                    ]
                }
            ]
        },
        {
            "title": "Data",
            "name": "data",
            "collapse": ["groupDetail", "groupSort", "groupGroup"],
            "groups": [
                {
                    "tooltip": "Sort / Filter",
                    "tools": [
                        {
                            "type": "icon",
                            "iconClass": "sprite SortAscendingWord",
                            "name": "sortAZ",
                            "text": "Sort Ascending",
                            "collapseGroup": "groupSort"
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite SortDescendingWord",
                            "name": "sortZA",
                            "text": "Sort Descending",
                            "collapseGroup": "groupSort"
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite FiltersMenu",
                            "name": "filter",
                            "text": "Show Filter Buttons",
                            "collapseGroup": "groupSort"
                        },
                        {
                            "type": "dropdown",
                            "iconClass": "sprite SortFilterMenu",
                            "name": "sortAndFilter",
                            "text": "Sort & Fiter",
                            "header": "Sort & Fiter",
                            "items": []
                        }
                    ]
                },
                {
                    "tooltip": "Group",
                    "tools": [
                        {
                            "type": "icon",
                            "iconClass": "sprite OutlineGroup",
                            "name": "group",
                            "text": "Group",
                            "collapseGroup": "groupGroup"
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite OutlineUngroup",
                            "name": "ungroup",
                            "text": "Ungroup",
                            "collapseGroup": "groupGroup"
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite ShowDetailsPage",
                            "name": "showDetail",
                            "text": "Show Detail",
                            "collapseGroup": "groupDetail"
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite HideDetails",
                            "name": "hideDetail",
                            "text": "Hide Detail",
                            "collapseGroup": "groupDetail"
                        },
                        {
                            "type": "checkbox",
                            "checked": true,
                            "text": "Summary rows below detail",
                            "name": "summaryBelow",
                            "collapseGroup": "groupDetailSummary"
                        },
                        {
                            "type": "checkbox",
                            "checked": true,
                            "text": "Summary columns to the right of detail",
                            "name": "summaryRight",
                            "collapseGroup": "groupDetailSummary"
                        },
                        {
                            "type": "dropdown",
                            "iconClass": "sprite GroupTableStyleOptions",
                            "altIconClass": "glyphicon glyphicon-menu-right",
                            "name": "groupSetting",
                            "text": "Group Setting",
                            "header": "Group Setting",
                            "minWidth": "300px",
                            "items": ["summaryBelow", "summaryRight"]
                        }
                    ]
                },
                {
                    "tooltip": "Data Validation",
                    "tools": [
                        {
                            "type": "icon",
                            "iconClass": "sprite DataValidationCircleInvalid icon-text",
                            "name": "circleInvalidData",
                            "text": "Circle Invalid Data",
                            "toggle": true
                        },
                        {
                            "type": "icon",
                            "iconClass": "sprite DataValidation icon-text",
                            "name": "selectValidator",
                            "text": "Select Validator",
                            "header": "Data Validator"
                        }
                    ]
                }
            ]
        },
        {
            "title": "View",
            "name": "view",
            "collapse": ["*groupShow"],
            "groups": [
                {
                    "tooltip": "Show / Hide",
                    "tools": [
                        {
                            "type": "checkbox",
                            "checked": true,
                            "text": "Formula Bar",
                            "tooltip": "Show Formula Bar",
                            "collapseGroup": "groupShow",
                            "name": "showFormulaBar"
                        },
                        {
                            "type": "checkbox",
                            "checked": true,
                            "text": "Gridlines",
                            "tooltip": "View Gridlines",
                            "collapseGroup": "groupShow",
                            "name": "showGridlines"
                        },
                        {
                            "type": "checkbox",
                            "checked": true,
                            "text": "Headings",
                            "tooltip": "View Headings",
                            "collapseGroup": "groupShow",
                            "name": "showHeadings"
                        },
                        {
                            "type": "checkbox",
                            "checked": true,
                            "text": "Sheet Tabs",
                            "tooltip": "Show Sheet Tabs",
                            "collapseGroup": "groupShow",
                            "name": "showSheetTabs"
                        },
                        {
                            "type": "dropdown",
                            "iconClass": "glyphicon glyphicon-menu-down",
                            "name": "showHideDropdown",
                            "header": "Show / Hide",
                            "items": []
                        }
                    ]
                },
                {
                    "tools": [
                        {
                            "type": "group",
                            "items": [
                                {
                                    "type": "dropdown-only",
                                    "iconClass": "sprite FreezePanes icon-text",
                                    "name": "freezePanes",
                                    "haslabel": true,
                                    "text": "Freeze Panes",
                                    "dropdown": [
                                        { "value": "freezePanes", "text": "Freeze Panes" },
                                        { "value": "freezeTopRow", "text": "Freeze Top Row" },
                                        { "value": "freezeFirstColumn", "text": "Freeze First Column" },
                                        { "value": "freezeBottomRow", "text": "Freeze Bottom Row" },
                                        { "value": "freezeLastColumn", "text": "Freeze Last Column" },
                                        "",
                                        { "value": "unfreeze", "text": "Unfreeze Panes" }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "title": "Table",
            "hidden": false,
            "name": "table",
            "groups": [
                {
                    tools: [
                        {
                            "type": "input",
                            "name": "tableName",
                            "text": "Name"
                        }
                    ]
                },
                {
                    "tools": [
                        {
                            "type": "group",
                            "tooltip": "Insert Slicer",
                            "items": [
                                {
                                    "type": "dropdown-only",
                                    "iconClass": "glyphicon glyphicon-filter icon-text",
                                    "name": "insertSlicer",
                                    "text": "Insert Slicer",
                                    "haslabel": true,
                                    "dropdown": [
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "tools": [
                        {
                            "type": "group",
                            "tooltip": "Style Options",
                            "items": [
                                {
                                    "type": "dropdown-only",
                                    "iconClass": "glyphicon glyphicon-info-sign icon-text",
                                    "name": "tableOption",
                                    "text": "Style Options",
                                    "haslabel": true,
                                    "dropdown": [
                                        { "value": "tableHeaderRow", "text": "Header Row", "toggle": true, "checked": true },
                                        { "value": "tableTotalRow", "text": "Total Row", "toggle": true },
                                        { "value": "tableFirstColumn", "text": "First Column", "toggle": true },
                                        { "value": "tableLastColumn", "text": "Last Column", "toggle": true },
                                        { "value": "tableBandedRows", "text": "Banded Rows", "toggle": true, "checked": true },
                                        { "value": "tableBandedColumns", "text": "Banded Columns", "toggle": true },
                                        { "value": "tableFilterButton", "text": "Filter Button", "toggle": true }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "tools": [
                        {
                            "type": "group",
                            "tooltip": "Table Styles",
                            "items": [
                                {
                                    "type": "icon-group",
                                    "iconClass": "glyphicon glyphicon-th",
                                    "name": "tableStyles",
                                    "text": "Table Styles",
                                    "header": "Table Styles",
                                    "dropdown": [
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "title": "Chart",
            "hidden": false,
            "name": "chart",
            "groups": [
                {
                    "tools": [
                        {
                            "type": "group",
                            "tooltip": "Type",
                            "collapseGroup": "groupInsert",
                            "items": [
                                {
                                    "type": "dropdown-only",
                                    "iconClass": "chartIconBase ChartInsert icon-text",
                                    "name": "typeChart",
                                    "haslabel": true,
                                    "text": "Type",
                                    "dropdown": [
                                        {
                                            "value": "column1", "text": "Column Chart", "findCss": "Column Chart Type Changed", "iconClass": "chartIcon ColumnChart", "childrenList": [
                                                {
                                                    "type": "dropdown-only",
                                                    "name": "columnChartTypeChanged",
                                                    "haslabel": true,
                                                    "text": "Column Chart Type Changed",
                                                    "dropdown": [
                                                        { "value": "columnClustered", "text": "Clustered Column", "iconClass": "chartIconBase clustered-column-icon" },
                                                        { "value": "columnStacked", "text": "Stacked Column", "iconClass": "chartIconBase stacked-column-icon" },
                                                        { "value": "columnStacked100", "text": "100%Stacked Column", "iconClass": "chartIconBase stacked100-column-icon" }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "value": "line1", "text": "Line Chart", "findCss": "Line Chart Type Changed", "iconClass": "chartIcon LineChart", "childrenList": [
                                                {
                                                    "type": "dropdown-only",
                                                    "name": "lineChartTypeChanged",
                                                    "haslabel": true,
                                                    "text": "Line Chart Type Changed",
                                                    "dropdown": [
                                                        { "value": "line", "text": "Line", "iconClass": "chartIconBase line-icon" },
                                                        { "value": "lineStacked", "text": "Stacked Line", "iconClass": "chartIconBase stacked-line-icon" },
                                                        { "value": "lineStacked100", "text": "100%Stacked Line", "iconClass": "chartIconBase stacked100-line-icon" },
                                                        { "value": "lineMarkers", "text": "Line With Markers", "iconClass": "chartIconBase line-markers-icon" },
                                                        { "value": "lineMarkersStacked", "text": "Stacked Line With Markers", "iconClass": "chartIconBase stacked-line-markers-icon" },
                                                        { "value": "lineMarkersStacked100", "text": "100%Stacked Line With Markers", "iconClass": "chartIconBase stacked100-line-markers-icon" }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "value": "pie1", "text": "Pie Chart", "findCss": "Pie Chart Type Changed", "iconClass": "chartIcon PieChart", "childrenList": [
                                                {
                                                    "type": "dropdown-only",
                                                    "name": "pieChartTypeChanged",
                                                    "haslabel": true,
                                                    "text": "Pie Chart Type Changed",
                                                    "dropdown": [
                                                        { "value": "pie", "text": "Pie", "iconClass": "chartIconBase pie-icon" },
                                                        { "value": "doughnut", "text": "Doughnut", "iconClass": "chartIconBase doughnut-icon" }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "value": "bar1", "text": "Bar Chart", "findCss": "Bar Chart Type Changed", "iconClass": "chartIcon BarChart", "childrenList": [
                                                {
                                                    "type": "dropdown-only",
                                                    "name": "barChartTypeChanged",
                                                    "haslabel": true,
                                                    "text": "Bar Chart Type Changed",
                                                    "dropdown": [
                                                        { "value": "barClustered", "text": "Clustered Bar", "iconClass": "chartIconBase clustered-bar-icon" },
                                                        { "value": "barStacked", "text": "Stacked Bar", "iconClass": "chartIconBase stacked-bar-icon" },
                                                        { "value": "barStacked100", "text": "100%Stacked Bar", "iconClass": "chartIconBase stacked100-bar-icon" }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "value": "area1", "text": "Area Chart", "findCss": "Area Chart Type Changed", "iconClass": "chartIcon AreaChart", "childrenList": [
                                                {
                                                    "type": "dropdown-only",
                                                    "name": "areaChartTypeChanged",
                                                    "haslabel": true,
                                                    "text": "Area Chart Type Changed",
                                                    "dropdown": [
                                                        { "value": "area", "text": "Area", "iconClass": "chartIconBase area-icon" },
                                                        { "value": "areaStacked", "text": "Stacked Area", "iconClass": "chartIconBase stacked-area-icon" },
                                                        { "value": "areaStacked100", "text": "100%Stacked Area", "iconClass": "chartIconBase stacked100-area-icon" }
                                                    ]
                                                },
                                            ]
                                        },
                                        {
                                            "value": "xyScatter1", "text": "XY(Scatter) Chart", "findCss": "xyScatter Chart Type Changed", "iconClass": "chartIcon XyScatterChart", "childrenList": [
                                                {
                                                    "type": "dropdown-only",
                                                    "name": "xyScatterChartTypeChanged",
                                                    "haslabel": true,
                                                    "text": "xyScatter Chart Type Changed",
                                                    "dropdown": [
                                                        { "value": "xyScatter", "text": "XY(Scatter)", "iconClass": "chartIconBase XYScatter-icon" },
                                                        { "value": "xyScatterLines", "text": "XY(Scatter) Lines", "iconClass": "chartIconBase XYScatter-line-icon" },
                                                        { "value": "xyScatterLinesNoMarkers", "text": "XY(Scatter) Lines No Markers", "iconClass": "chartIconBase XYScatter-line-noMarkers-icon" },
                                                        { "value": "xyScatterSmooth", "text": "xy(Scatter) Smooth", "iconClass": "chartIconBase XYScatter-smooth-icon" },
                                                        { "value": "xyScatterSmoothNoMarkers", "text": "XY(Scatter) Smooth No Markers", "iconClass": "chartIconBase XYScatter-smooth-noMarkers-icon" },
                                                        { "value": "bubble", "text": "Bubble", "iconClass": "chartIconBase bubble-icon" }
                                                    ]
                                                },
                                            ]
                                        },
                                        {
                                            "value": "radar1", "text": "Radar Chart", "findCss": "Radar Chart Type Changed", "iconClass": "radarChartContainer ", "childrenList": [
                                                {
                                                    "type": "dropdown-only",
                                                    "name": "radarChartTypeChanged",
                                                    "haslabel": true,
                                                    "text": "Radar Chart Changed",
                                                    "dropdown": [
                                                        { "value": "radar", "text": "Radar", "iconClass": "radar-icon" },
                                                        { "value": "radarFilled", "text": "Radar Filled", "iconClass": "radarFilled-icon" },
                                                        { "value": "radarMarkers", "text": "Radar Markers", "iconClass": "radarMarkers-icon" },
                                                    ]
                                                },
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "tools": [
                        {
                            "type": "group",
                            "tooltip": "Quick Layout",
                            "items": [
                                {
                                    "type": "dropdown-quickLayout",
                                    "iconClass": "icon-chart-base-middle icon-chart-quick-layout icon-text",
                                    "name": "chartQuickLayout",
                                    "text": "QuickLayout",
                                    "haslabel": true
                                }
                            ]
                        }
                    ]
                },
                {
                    "tools": [
                        {
                            "type": "group",
                            "tooltip": "Add Element",
                            "items": [
                                {
                                    "type": "dropdown-addChartElement",
                                    "iconClass": "icon-chart-base-middle icon-chart-add-element icon-text",
                                    "name": "addChartElement",
                                    "text": "Elements",
                                    "haslabel": true
                                }
                            ]
                        }
                    ]
                },
                {
                    "tools": [
                        {
                            "type": "group",
                            "tooltip": "Color",
                            "items": [
                                {
                                    "type": "dropdown-colorTemplate",
                                    "iconClass": "icon-chart-base-middle icon-chart-change-color icon-text",
                                    "name": "chart-color",
                                    "text": "Color",
                                    "haslabel": true,
                                    "chartColors": {
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
                                                    items: { startColor: 'accent 1 -50', stopColor: 'accent 1 50' }
                                                },
                                                {
                                                    tip: 'Orange gradient, dark to light',
                                                    items: { startColor: 'accent 2 -50', stopColor: 'accent 2 50' }
                                                },
                                                {
                                                    tip: 'Gray gradient, dark to light',
                                                    items: { startColor: 'accent 3 -50', stopColor: 'accent 3 50' }
                                                },
                                                {
                                                    tip: 'Gold gradient, dark to light',
                                                    items: { startColor: 'accent 4 -50', stopColor: 'accent 4 50' }
                                                },
                                                {
                                                    tip: 'Blue gradient, dark to light',
                                                    items: { startColor: 'accent 5 -50', stopColor: 'accent 5 50' }
                                                },
                                                {
                                                    tip: 'Green gradient, dark to light',
                                                    items: { startColor: 'accent 6 -50', stopColor: 'accent 6 50' }
                                                },
                                                {
                                                    tip: 'Dark Gray, Light Gray, Gray, Dark Gray, Light Gray, Gray',
                                                    items: ['text 1 11.5', 'text 1 45', 'text 1 25', 'text 1 1.5', 'text 1 70', 'text 1 40']
                                                },
                                                {
                                                    tip: 'Blue gradient, light to dark',
                                                    items: { startColor: 'accent 1 50', stopColor: 'accent 1 -50' }
                                                },
                                                {
                                                    tip: 'Orange gradient, light to dark',
                                                    items: { startColor: 'accent 2 50', stopColor: 'accent 2 -50' }
                                                },
                                                {
                                                    tip: 'Gray gradient, light to dark',
                                                    items: { startColor: 'accent 3 50', stopColor: 'accent 3 -50' }
                                                },
                                                {
                                                    tip: 'Gold gradient, light to dark',
                                                    items: { startColor: 'accent 4 50', stopColor: 'accent 4 -50' }
                                                },
                                                {
                                                    tip: 'Blue gradient, light to dark',
                                                    items: { startColor: 'accent 5 50', stopColor: 'accent 5 -50' }
                                                },
                                                {
                                                    tip: 'Green gradient, light to dark',
                                                    items: { startColor: 'accent 6 50', stopColor: 'accent 6 -50' }
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "tools": [
                        {
                            "type": "icon",
                            "iconClass": "icon-chart-base-middle switchRowColumn icon-text",
                            "name": "switchRowCol",
                            "text": "Switch Row/Column",
                        },
                    ]
                },
            ]
        },
        {
            "title": "Shape",
            "hidden": true,
            "name": "shape",
            "groups": [{
                "tools": [{
                    "type": "shape-color-preset",
                    "name": "shapeColorPreset",
                    "type": "shapeColorPreset",
                    "text": "Group Shapes",
                    "items": [{
                        "type": "icon-group",
                        "value": "rgb(68, 114, 194)",
                        "text": "Blue"
                    }, {
                        "type": "icon-group",
                        "value": "rgb(255, 215, 0)",
                        "text": "Gold"
                    }, {
                        "type": "icon-group",
                        "value": "rgb(163, 163, 163)",
                        "text": "Gray"
                    }, {
                        "type": "icon-group",
                        "value": "rgb(113, 171, 72)",
                        "text": "Green"
                    }, {
                        "type": "icon-group",
                        "value": "rgb(255, 165, 0)",
                        "text": "Orange"
                    }]
                }, {
                    "type": "group",
                    "tooltip": "shape color setting",
                    "items": [{
                        "type": "setcolor-group",
                        "iconClass": "sprite FillBackColorSplitDropdown",
                        "name": "shapeFillColor",
                        "text": "Fill Color",
                        "colorPickerOptions": { "nofill": { "show": false, "text": "No Fill", "color": "white" }, "header": "Fill Color" }
                    }, {
                        "type": "setcolor-group",
                        "iconClass": "glyphicon glyphicon-pencil",
                        "name": "shapeOutlineColor",
                        "text": "Fill Color",
                        "colorPickerOptions": { "nofill": { "show": false, "text": "No Fill", "color": "white" }, "header": "Outline Color" }
                    }, {
                        "type": "dropdown-only",
                        "iconClass": "glyphicon glyphicon-minus icon-text",
                        "name": "shapeLineStyle",
                        "haslabel": true,
                        "text": "Line Style",
                        "header": "Line Style",
                        "dropdown": [
                            { "value": "solid", "iconClass": "line-style-thin", "hiddenLabel": true },
                            { "value": "squareDot", "iconClass": "line-style-dotted", "hiddenLabel": true },
                            { "value": "dash", "iconClass": "line-style-dashed", "hiddenLabel": true },
                            { "value": "longDash", "iconClass": "line-style-medium-dashed", "hiddenLabel": true },
                            { "value": "dashDot", "iconClass": "line-style-dash-dot", "hiddenLabel": true },
                            { "value": "longDashDot", "iconClass": "line-style-medium-dash-dot", "hiddenLabel": true },
                            { "value": "longDashDotDot", "iconClass": "line-style-medium-dash-dot-dot", "hiddenLabel": true },
                            { "value": "sysDash", "iconClass": "line-style-slanted-dashed", "hiddenLabel": true },
                            { "value": "sysDot", "iconClass": "line-style-medium-dotted", "hiddenLabel": true },
                            { "value": "sysDashDot", "iconClass": "line-style-medium-dashed-dot", "hiddenLabel": true },
                            { "value": "dashDotDot", "iconClass": "line-style-dash-dot-dot", "hiddenLabel": true },
                            { "value": "roundDot", "iconClass": "line-style-dotted", "hiddenLabel": true }
                        ]
                    }]
                }, {
                    "type": "icon",
                    "iconClass": "icon-text shape-group",
                    "name": "shapeGroup",
                    "text": "Group Shapes",
                }]
            }]
        }
    ]
};
