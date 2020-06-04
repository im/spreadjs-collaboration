var uiResource = {
    toolBar: {
        zoom: {
            title: "Zoom",
            zoomOption: {
                twentyFivePercentSize: "25%",
                fiftyPercentSize: "50%",
                seventyFivePercentSize: "75%",
                defaultSize: "100%",
                oneHundredTwentyFivePercentSize: "125%",
                oneHundredFiftyPercentSize: "150%",
                twoHundredPercentSize: "200%",
                threeHundredPercentSize: "300%",
                fourHundredPercentSize: "400%"
            }
        },
        clear: {
            title: "Clear",
            clearActions: {
                clearAll: "Clear All",
                clearFormat: "Clear Format"
            }
        },
        showInspector: "Show Inspector",
        hideInspector: "Hide Inspector",
        importJson: "Import JSON",
        exportJson: "Export JSON",
        insertTable: "Insert Table",
        insertPicture: "Insert Picture",
        insertComment: "Insert Comment",
        insertSparkline: "Insert Sparkline",
        insertSlicer: "Insert Slicer"
    },
    tabs: {
        spread: "Spread",
        sheet: "Sheet",
        cell: "Cell",
        table: "Table",
        data: "Data",
        comment: "Comment",
        picture: "Picture",
        sparklineEx: "Sparkline",
        barCodeEx: "barCode",
        slicer: "Slicer",
        chart: "Chart"
    },
    spreadTab: {
        general: {
            title: "General",
            allowDragDrop: "Allow Drag and Drop",
            allowDragFill: "Allow Drag and Fill",
            allowZoom: "Allow Zoom",
            allowOverflow: "Allow Overflow",
            showDragFillSmartTag: "Show Drag Fill Smart Tag",
            allowUserDeselect: "Allow User Deselect"
        },
        calculation: {
            title: "Calculation",
            referenceStyle: {
                title: "Reference style",
                R1C1: "R1C1",
                A1: "A1"
            }
        },
        scrollBar: {
            title: "Scroll Bar",
            showVertical: "Vertical ScrollBar",
            showHorizontal: "Horizontal ScrollBar",
            maxAlign: "Scrollbar Max Align",
            showMax: "Scrollbar Show Max",
            scrollIgnoreHidden: "Scroll Ignore Hidden Row or Column"
        },
        tabStip: {
            title: "TabStrip",
            visible: "TabStrip Visible",
            newTabVisible: "New Tab Visible",
            editable: "Tabstrip Editable",
            showTabNavigation: "Show Tab Navigation"
        },
        color: {
            title: "Color",
            spreadBackcolor: "Spread Backcolor",
            grayAreaBackcolor: "Gray Area Backcolor"
        },
        tip: {
            title: "Tip",
            showDragDropTip: "Show Drag Drop Tip",
            showDragFillTip: "Show Drag Fill Tip",
            scrollTip: {
                title: "Scroll Tip",
                values: {
                    none: "None",
                    horizontal: "Horizontal",
                    vertical: "Vertical",
                    both: "Both"
                }
            },
            resizeTip: {
                title: "Resize Tip",
                values: {
                    none: "None",
                    column: "Column",
                    row: "Row",
                    both: "Both"
                }
            }
        },
        sheets: {
            title: "Sheets",
            sheetName: "Sheet name",
            sheetVisible: "Sheet Visible"
        },
        cutCopyIndicator: {
            title: "Cut / Copy Indicator",
            visible: "Show Indicator",
            borderColor: "Border Color"
        },
        dragDropFill: {
            title: "Drag Drop / Drag Fill",
            canUserDragDrop: "Can User Drag Drop",
            canUserDragFill: "Can User Drag Fill",
            showDragFillSmartTag: "Show Drag Fill Smart Tag",
            dragFillType: {
                title: "Default Drag Fill Type",
                values: {
                    auto: "Auto",
                    copyCells: "Copy Cells",
                    fillSeries: "Fill Series",
                    fillFormattingOnly: "Fill Formatting Only",
                    fillWithoutFormatting: "Fill Without Formatting"
                }
            }
        },
        spreadTheme: {
            title: "Spread Theme",
            theme: {
                title: "Theme",
                option: {
                    spreadJS: "SpreadJS",
                    excel2013White: "Excel2013 White",
                    excel2013LightGray: "Excel2013 Light Gray",
                    excel2013DarkGray: "Excel2013 Dark Gray",
                    excel2016Colorful: "Excel2016 Colorful",
                    excel2016DarkGray: "Excel2016 Dark Gray"
                }
            }
        },
        resizeZeroIndicator: {
            title: "ResizeZeroIndicator",
            option: {
                defaultValue: "Default",
                enhanced: "Enhanced"
            }
        },
        customList: {
            title: "Custom Lists",
			customLists: "Custom lists:",
			listEntries: "List entries:",
			add: "Add",
			del: "Delete",
			newList: "NEW LIST"
        }
    },
    sheetTab: {
        general: {
            title: "General",
            rowCount: "Row",
            columnCount: "Column",
            name: "Name",
            tabColor: "Tab Color"
        },
        freeze: {
            title: "Freeze",
            frozenRowCount: "Header Rows",
            frozenColumnCount: "Header Columns",
            trailingFrozenRowCount: "Footer Rows",
            trailingFrozenColumnCount: "Footer Columns",
            frozenLineColor: "Color",
            freezePane: "Freeze",
            unfreeze: "Unfreeze"
        },
        gridLine: {
            title: "Grid Line",
            showVertical: "Vertical Visible",
            showHorizontal: "Horizontal Visible",
            color: "Color"
        },
        header: {
            title: "Header",
            showRowHeader: "Row Header Visible",
            showColumnHeader: "Column Header Visible"
        },
        selection: {
            title: "Selection",
            borderColor: "Border Color",
            backColor: "Backcolor",
            hide: "Hide Selection",
            policy: {
                title: "Policy",
                values: {
                    single: "Single",
                    range: "Range",
                    multiRange: "MultiRange"
                }
            },
            unit: {
                title: "Unit",
                values: {
                    cell: "Cell",
                    row: "Row",
                    column: "Column"
                }
            }
        },
        protection: {
            title: "Protection",
            protectSheet: "Protect Sheet",
            selectLockCells: "Select locked cells",
            selectUnlockedCells: "Select unlocked cells",
            sort: "Sort",
            useAutoFilter: "Use AutoFilter",
            resizeRows: "Resize rows",
            resizeColumns: "Resize columns",
            editObjects: "Edit objects"
        }
    },
    cellTab: {
        style: {
            title: "Style",
            fontFamily: "Font",
            fontSize: "Size",
            foreColor: "Forecolor",
            backColor: "Backcolor",
            borders: {
                title: "Border",
                values: {
                    bottom: "Bottom Border",
                    top: "Top Border",
                    left: "Left Border",
                    right: "Right Border",
                    none: "No Border",
                    all: "All Border",
                    outside: "Outside Border",
                    thick: "Thick Box Border",
                    doubleBottom: "Bottom Double Border",
                    thickBottom: "Thick Bottom Border",
                    topBottom: "Top and Bottom Border",
                    topThickBottom: "Top and Thick Bottom Border",
                    topDoubleBottom: "Top and Double Bottom Border"
                }
            }
        },
        border: {
            title: "Border",
            label: "Border",
            rangeBorderLine: "Line Style",
            rangeBorderColor: "Line Color",
            noBorder: "None",
            outsideBorder: "Outside Border",
            insideBorder: "Inside Border",
            allBorder: "All Border",
            leftBorder: "Left Border",
            innerVertical: "Inner Vertical",
            rightBorder: "Right Border",
            topBorder: "Top Border",
            innerHorizontal: "Inner Horizontal",
            bottomBorder: "Bottom Border"
        },
        alignment: {
            title: "Alignment",
            top: "Top",
            middle: "Middle",
            bottom: "Bottom",
            left: "Left",
            center: "Center",
            right: "Right",
            wrapText: "Wrap Text",
            decreaseIndent: "Decrease Indent",
            increaseIndent: "Increase Indent"
        },
        format: {
            title: "Format",
            commonFormat: {
                option: {
                    general: "General",
                    number: "Number",
                    currency: "Currency",
                    accounting: "Accounting",
                    shortDate: "Short Date",
                    longDate: "Long Date",
                    time: "Time",
                    percentage: "Percentage",
                    fraction: "Fraction",
                    scientific: "Scientific",
                    text: "Text"
                }
            },
            percentValue: "0%",
            commaValue: "#,##0.00; (#,##0.00); \"-\"??;@",
            custom: "Custom",
            setButton: "Set"
        },
        merge: {
            title: "Merge Cells",
            mergeCells: "Merge",
            unmergeCells: "Unmerge"
        },
        cellType: {
            title: "Cell Type"
        },
        conditionalFormat: {
            title: "Conditional Formatting",
            useConditionalFormats: "Conditional Formats"
        },
        protection: {
            title: "Protection",
            lock: "Locked",
            sheetIsProtected: "Sheet is protected",
            sheetIsUnprotected: "Sheet is unprotected"
        }
    },
    tableTab: {
        tableStyle: {
            title: "Table Style",
            groupTitle: {
                light: "Light",
                medium: "Medium",
                dark: "Dark"
            },
            light: {
                none: "None",
                light1: "Table Style Light 1",
                light2: "Table Style Light 2",
                light3: "Table Style Light 3",
                light4: "Table Style Light 4",
                light5: "Table Style Light 5",
                light6: "Table Style Light 6",
                light7: "Table Style Light 7",
                light8: "Table Style Light 8",
                light9: "Table Style Light 9",
                light10: "Table Style Light 10",
                light11: "Table Style Light 11",
                light12: "Table Style Light 12",
                light13: "Table Style Light 13",
                light14: "Table Style Light 14",
                light15: "Table Style Light 15",
                light16: "Table Style Light 16",
                light17: "Table Style Light 17",
                light18: "Table Style Light 18",
                light19: "Table Style Light 19",
                light20: "Table Style Light 20",
                light21: "Table Style Light 21"
            },
            medium: {
                medium1: "Table Style Medium 1",
                medium2: "Table Style Medium 2",
                medium3: "Table Style Medium 3",
                medium4: "Table Style Medium 4",
                medium5: "Table Style Medium 5",
                medium6: "Table Style Medium 6",
                medium7: "Table Style Medium 7",
                medium8: "Table Style Medium 8",
                medium9: "Table Style Medium 9",
                medium10: "Table Style Medium 10",
                medium11: "Table Style Medium 11",
                medium12: "Table Style Medium 12",
                medium13: "Table Style Medium 13",
                medium14: "Table Style Medium 14",
                medium15: "Table Style Medium 15",
                medium16: "Table Style Medium 16",
                medium17: "Table Style Medium 17",
                medium18: "Table Style Medium 18",
                medium19: "Table Style Medium 19",
                medium20: "Table Style Medium 20",
                medium21: "Table Style Medium 21",
                medium22: "Table Style Medium 22",
                medium23: "Table Style Medium 23",
                medium24: "Table Style Medium 24",
                medium25: "Table Style Medium 25",
                medium26: "Table Style Medium 26",
                medium27: "Table Style Medium 27",
                medium28: "Table Style Medium 28"
            },
            dark: {
                dark1: "Table Style Dark 1",
                dark2: "Table Style Dark 2",
                dark3: "Table Style Dark 3",
                dark4: "Table Style Dark 4",
                dark5: "Table Style Dark 5",
                dark6: "Table Style Dark 6",
                dark7: "Table Style Dark 7",
                dark8: "Table Style Dark 8",
                dark9: "Table Style Dark 9",
                dark10: "Table Style Dark 10",
                dark11: "Table Style Dark 11"
            }
        },
        general: {
            title: "General",
            tableName: "Name"
        },
        options: {
            title: "Options",
            filterButton: "Filter Button",
            headerRow: "Header Row",
            totalRow: "Total Row",
            bandedRows: "Banded Rows",
            bandedColumns: "Banded Columns",
            firstColumn: "First Column",
            lastColumn: "Last Column"
        }
    },
    dataTab: {
        sort: {
            title: "Sort & Filter",
            asc: "Sort A-Z",
            desc: "Sort Z-A",
            filter: "Filter"
        },
        group: {
            title: "Group",
            group: "Group",
            ungroup: "Ungroup",
            showDetail: "Show Detail",
            hideDetail: "Hide Detail",
            showRowRangeGroup: "Show Row Range Group",
            showColumnRangeGroup: "Show Column Range Group"
        },
        dataValidation: {
            title: "Data Validation",
            setButton: "Set",
            clearAllButton: "Clear All",
            circleInvalidData: "Circle Invalid Data",
            setting: {
                title: "Setting",
                values: {
                    validatorType: {
                        title: "Validator Type",
                        option: {
                            anyValue: "Any Value",
                            number: "Number",
                            list: "List",
                            formulaList: "FormulaList",
                            date: "Date",
                            textLength: "Text Length",
                            custom: "Custom"
                        }
                    },
                    ignoreBlank: "IgnoreBlank",
                    validatorComparisonOperator: {
                        title: "Operator",
                        option: {
                            between: "Between",
                            notBetween: "NotBetween",
                            equalTo: "EqualTo",
                            notEqualTo: "NotEqualTo",
                            greaterThan: ">",
                            lessThan: "<",
                            greaterThanOrEqualTo: ">=",
                            lessThanOrEqualTo: "<="
                        }
                    },
                    number: {
                        minimum: "Minimum",
                        maximum: "Maximum",
                        value: "Value",
                        isInteger: "Is Integer"
                    },
                    source: "Source",
                    date: {
                        startDate: "Start Date",
                        endDate: "End Date",
                        value: "Value",
                        isTime: "Is Time"
                    },
                    formula: "Formula"
                }
            },
            inputMessage: {
                title: "Input Message",
                values: {
                    showInputMessage: "Show when cell is selected",
                    title: "Title",
                    message: "Message"
                }
            },
            errorAlert: {
                title: "Error Alert",
                values: {
                    showErrorAlert: "Show after invalid data is entered",
                    alertType: {
                        title: "Alert Type",
                        option: {
                            stop: "Stop",
                            warning: "Warning",
                            information: "Information"
                        }
                    },
                    title: "Title",
                    message: "Message"
                }
            },
            highlightStyle:{
                highType:"Type",
                title:"Highlight Style",
                color:"Color",
                type:{
                    circle:"Circle",
                    dogear:"Dogear",
                    icon:"Icon"
                },
                position:"Position",
                dogearPosition:{
                    tl:"Top Left",
                    tr:"Top Right",
                    bl:"Bottom Left",
                    br:"Bottom Right"
                },
                iconPosition:{
                   ol:"Outside Left",
                   or:"Outside Right" 
                }
            }
        }
    },
    commentTab: {
        general: {
            title: "General",
            dynamicSize: "Dynamic Size",
            dynamicMove: "Dynamic Move",
            lockText: "Lock Text",
            showShadow: "Show Shadow"
        },
        font: {
            title: "Font",
            fontFamily: "Font",
            fontSize: "Size",
            fontStyle: {
                title: "Style",
                values: {
                    normal: "normal",
                    italic: "italic",
                    oblique: "oblique",
                    inherit: "inherit"
                }
            },
            fontWeight: {
                title: "Weight",
                values: {
                    normal: "normal",
                    bold: "bold",
                    bolder: "bolder",
                    lighter: "lighter"
                }
            },
            textDecoration: {
                title: "Decoration",
                values: {
                    none: "none",
                    underline: "underline",
                    overline: "overline",
                    linethrough: "linethrough"
                }
            }
        },
        border: {
            title: "Border",
            width: "Width",
            style: {
                title: "Style",
                values: {
                    none: "none",
                    hidden: "hidden",
                    dotted: "dotted",
                    dashed: "dashed",
                    solid: "solid",
                    double: "double",
                    groove: "groove",
                    ridge: "ridge",
                    inset: "inset",
                    outset: "outset"
                }
            },
            color: "Color"
        },
        appearance: {
            title: "Appearance",
            horizontalAlign: {
                title: "Horizontal",
                values: {
                    left: "left",
                    center: "center",
                    right: "right",
                    general: "general"
                }
            },
            displayMode: {
                title: "Display Mode",
                values: {
                    alwaysShown: "AlwaysShown",
                    hoverShown: "HoverShown"
                }
            },
            foreColor: "Forecolor",
            backColor: "Backcolor",
            padding: "Padding",
            zIndex: "Z-Index",
            opacity: "Opacity"
        }
    },
    pictureTab: {
        general: {
            title: "General",
            moveAndSize: "Move and size with cells",
            moveAndNoSize: "Move and don't size with cells",
            noMoveAndSize: "Don't move and size with cells",
            fixedPosition: "Fixed Position"
        },
        border: {
            title: "Border",
            width: "Width",
            radius: "Radius",
            style: {
                title: "Style",
                values: {
                    solid: "solid",
                    dotted: "dotted",
                    dashed: "dashed",
                    double: "double",
                    groove: "groove",
                    ridge: "ridge",
                    inset: "inset",
                    outset: "outset"
                }
            },
            color: "Color"
        },
        appearance: {
            title: "Appearance",
            stretch: {
                title: "Stretch",
                values: {
                    stretch: "Stretch",
                    center: "Center",
                    zoom: "Zoom",
                    none: "None"
                }
            },
            backColor: "Backcolor"
        }
    },
    sparklineExTab: {
        pieSparkline: {
            title: "PieSparkline Setting",
            values: {
                percentage: "Percentage",
                color: "Color ",
                setButton: "Set"
            }
        },
        areaSparkline: {
            title: "AreaSparkline Setting",
            values: {
                line1: "Line 1",
                line2: "Line 2",
                minimumValue: "Minimum Value",
                maximumValue: "Maximum Value",
                points: "Points",
                positiveColor: "Positive Color",
                negativeColor: "Negative Color",
                setButton: "Set"
            }
        },
        boxplotSparkline: {
            title: "BoxPlotSparkline Setting",
            values: {
                points: "Points",
                boxplotClass: "BoxPlotClass",
                scaleStart: "ScaleStart",
                scaleEnd: "ScaleEnd",
                acceptableStart: "AcceptableStart",
                acceptableEnd: "AcceptableEnd",
                colorScheme: "ColorScheme",
                style: "Style",
                showAverage: "Show Average",
                vertical: "Vertical",
                setButton: "Set"
            }
        },
        bulletSparkline: {
            title: "BulletSparkline Setting",
            values: {
                measure: "Measure",
                target: "Target",
                maxi: "Maxi",
                forecast: "Forecast",
                good: "Good",
                bad: "Bad",
                tickunit: "Tickunit",
                colorScheme: "ColorScheme",
                vertical: "Vertical",
                setButton: "Set"
            }
        },
        cascadeSparkline: {
            title: "CascadeSparkline Setting",
            values: {
                pointsRange: "PointsRange",
                pointIndex: "PointIndex",
                minimum: "Minimum",
                maximum: "Maximum",
                positiveColor: "ColorPositive",
                negativeColor: "ColorNegative",
                labelsRange: "LabelsRange",
                vertical: "Vertical",
                setButton: "Set"
            }
        },
        compatibleSparkline: {
            title: "CompatibleSparkline Setting",
            values: {
                data: {
                    title: "Data",
                    dataOrientation: "DataOrientation",
                    dateAxisData: "DateAxisData",
                    dateAxisOrientation: "DateAxisOrientation",
                    displayEmptyCellAs: "DisplayEmptyCellAs",
                    showDataInHiddenRowOrColumn: "Show data in hidden rows and columns"
                },
                show: {
                    title: "Show",
                    showFirst: "Show First",
                    showLast: "Show Last",
                    showHigh: "Show High",
                    showLow: "Show Low",
                    showNegative: "Show Negative",
                    showMarkers: "Show Markers"
                },
                group: {
                    title: "Group",
                    minAxisType: "MinAxisType",
                    maxAxisType: "MaxAxisType",
                    manualMin: "ManualMin",
                    manualMax: "ManualMax",
                    rightToLeft: "RightToLeft",
                    displayXAxis: "Display XAxis"
                },
                style: {
                    title: "Style",
                    negative: "Negative",
                    markers: "Markers",
                    axis: "Axis",
                    series: "Series",
                    highMarker: "High Marker",
                    lowMarker: "Low Marker",
                    firstMarker: "First Marker",
                    lastMarker: "Last Marker",
                    lineWeight: "Line Weight"
                },
                setButton: "Set"
            }
        },
        hbarSparkline: {
            title: "HbarSparkline Setting",
            values: {
                value: "Value",
                colorScheme: "ColorScheme",
                setButton: "Set"
            }
        },
        vbarSparkline: {
            title: "VarSparkline Setting",
            values: {
                value: "Value",
                colorScheme: "ColorScheme",
                setButton: "Set"
            }
        },
        paretoSparkline: {
            title: "ParetoSparkline Setting",
            values: {
                points: "Points",
                pointIndex: "PointIndex",
                colorRange: "ColorRange",
                highlightPosition: "HighlightPosition",
                target: "Target",
                target2: "Target2",
                label: "Label",
                vertical: "Vertical",
                setButton: "Set"
            }
        },
        scatterSparkline: {
            title: "ScatterSparkline Setting",
            values: {
                points1: "Points1",
                points2: "Points2",
                minX: "MinX",
                maxX: "MaxX",
                minY: "MinY",
                maxY: "MaxY",
                hLine: "HLine",
                vLine: "VLine",
                xMinZone: "XMinZone",
                xMaxZone: "XMaxZone",
                yMinZone: "YMinZone",
                yMaxZone: "YMaxZone",
                color1: "Color1",
                color2: "Color2",
                tags: "Tags",
                drawSymbol: "Draw Symbol",
                drawLines: "Draw Lines",
                dashLine: "Dash Line",
                setButton: "Set"
            }
        },
        spreadSparkline: {
            title: "SpreadSparkline Setting",
            values: {
                points: "Points",
                scaleStart: "ScaleStart",
                scaleEnd: "ScaleEnd",
                style: "Style",
                colorScheme: "ColorScheme",
                showAverage: "Show Average",
                vertical: "Vertical",
                setButton: "Set"
            }
        },
        stackedSparkline: {
            title: "StackedSparkline Setting",
            values: {
                points: "Points",
                colorRange: "ColorRange",
                labelRange: "LabelRange",
                maximum: "Maximum",
                targetRed: "TargetRed",
                targetGreen: "TargetGreen",
                targetBlue: "TargetBlue",
                targetYellow: "TargetYellow",
                color: "Color",
                highlightPosition: "HighlightPosition",
                textOrientation: "TextOrientation",
                textSize: "TextSize",
                vertical: "Vertical",
                setButton: "Set"
            }
        },
        variSparkline: {
            title: "VariSparkline Setting",
            values: {
                variance: "Variance",
                reference: "Reference",
                mini: "Mini",
                maxi: "Maxi",
                mark: "Mark",
                tickunit: "TickUnit",
                colorPositive: "ColorPositive",
                colorNegative: "ColorNegative",
                legend: "Legend",
                vertical: "Vertical",
                setButton: "Set"
            }
        },
        orientation: {
            vertical: "Vertical",
            horizontal: "Horizontal"
        },
        axisType: {
            individual: "Individual",
            group: "Group",
            custom: "Custom"
        },
        emptyCellDisplayType: {
            gaps: "Gaps",
            zero: "Zero",
            connect: "Connect"
        },
        boxplotClass: {
            fiveNS: "5NS",
            sevenNS: "7NS",
            tukey: "Tukey",
            bowley: "Bowley",
            sigma: "Sigma3"
        },
        boxplotStyle: {
            classical: "Classical",
            neo: "Neo"
        },
        paretoLabel: {
            none: "None",
            single: "Single",
            cumulated: "Cumulated"
        },
        spreadStyle: {
            stacked: "Stacked",
            spread: "Spread",
            jitter: "Jitter",
            poles: "Poles",
            stackedDots: "StackedDots",
            stripe: "Stripe"
        },
        setButton: "Set"
    },
    barCodeTab: {
        qrCode: {
            title: "QRCode Setting",
            values: {
                data: "Data",
                color: "Color",
                backgroundColor: "Background Color",
                errorCorrectionLevel: "Error Correction Level",
                model: "Model",
                version: "Version",
                mask: "Mask",
                connection: "Connection",
                connectionNo: "Connection No",
                charCode: "Charcode",
                charset: "Charset"
            }
        },
        ean8: {
            title: "EAN8 Setting"
        },
        ean13: {
            title: "EAN13 Setting",
            values: {
                addOn: "Add Text",
                addOnLabelPosition: "Add Text Position"
            }
        },
        gs1128: {
            title: "GS1_128 Setting"
        },
        codabar: {
            title: "Codabar Setting",
            values: {
                checkDigit: "Check Digit",
                nwRatio: "The Wide And Narrow Bar Ratio"
            }
        },
        pdf417:{
            title: "PDF417 Setting",
            values: {
                errorCorrectionLevel: "Error Correction Level",
                rows: "Rows",
                columns: "Columns",
                compact: "Compact"
            }
        },
        dataMatrix:{
            title: "DataMatrix Setting",
            values: {
                eccMode: "Ecc Mode",
                ecc200SymbolSize: "Ecc200 Symbol Size",
                ecc200EndcodingMode: "Ecc200 Endcoding Mode",
                ecc00_140Symbole: "Ecc00_140 Symbole",
                structureAppend: "Structure Append",
                structureNumber: "Structure Number",
                fileIdentifier: "File Identifier"
            }
        },
        code39:{
            title: "Code39 Setting",
            values: {
                labelWithStartAndStopCharacter: "Label With Start And Stop Character",
                nwRatio: "The Wide And Narrow Bar Ratio",
                checkDigit: "Check Digit",
                fullASCII: "Full ASCII"
            }
        },
        code49:{
            title: "Code49 Setting",
            values: {
                grouping: "Grouping",
                groupNo: "Group No"
            }
        },
        code93:{
            title: "Code93 Setting",
            values: {
                checkDigit: "Check Digit",
                fullASCII: "Full ASCII"
            }
        },
        code128:{
            title: "Code128 Setting",
            values: {
                codeSet: "Code Set"
            }
        },
        commonParams: {
            data: "Data",
            color: "Color",
            backgroundColor: "Background Color",
            showLabel: "Show Label",
            labelPosition: "Label Position",
            fontFamily: "Font Family",
            fontStyle: "Font Style",
            fontWeight: "Font Weight",
            fontTextDecoration: "Text Decoration",
            fontTextAlign: "Font Text Align",
            fontSize: "Font Size",
            quietZoneLeft: "Left Quiet Zone Size",
            quietZoneRight: "Right Quiet Zone Size",
            quietZoneTop: "Top Quiet Zone Size",
            quietZoneBottom: "Bottom Quiet Zone Size",
            setButton: "Set"
        },
        labelPosition: {
            top: "top",
            bottom: "bottom"
        },
        addOnLabelPosition:{
            top: "top",
            bottom: "bottom"
        },
        horizontalAlign: {
            left: "left",
            center: "center",
            right: "right",
            general: "general"
        },
        nwRatio: {
            two: "2",
            three: "3"
        },
        codeset: {
            auto: "auto",
            a: "A",
            b: "B",
            c: "C"
        },
        eccMode: {
            ecc000: "ECC000",
            ecc050: "ECC050",
            ecc080: "ECC080",
            ecc100: "ECC100",
            ecc140: "ECC140",
            ecc200: "ECC200"
        },
        structureNumber: {
            zero: "0",
            one: "1",
            two: "2",
            three: "3",
            four: "4",
            five: "5",
            six: "6",
            seven: "7",
            eight: "8",
            nine: "9",
            ten: "10",
            eleven: "11",
            twelve: "12",
            thirteen: "13",
            fourteen: "14",
            fifteen: "15"
        },
        errorCorrectionLevel: {
            l: "L",
            m: "M",
            q: "Q",
            h: "H"
        },
        model: {
            one: "1",
            two: "2"
        },
        version: {
            auto: "auto",
            one: "1",
            two: "2",
            three: "3",
            four: "4",
            five: "5",
            six: "6",
            seven: "7",
            eight: "8",
            nine: "9",
            ten: "10",
            eleven: "11",
            twelve: "12",
            thirteen: "13",
            fourteen: "14",
            fifteen: "15",
            sixteen: "16",
            seventeen: "17",
            eighteen: "18",
            nineteen: "19",
            twenty: "20",
            twentyOne: "21",
            twentyTwo: "22",
            twentyThree: "23",
            twentyFour: "24",
            twentyFive: "25",
            twentySix: "26",
            twentySeven: "27",
            twentyEight: "28",
            twentyNine: "29",
            thirty: "30",
            thirtyOne: "31",
            thirtyTwo: "32",
            thirtyThree: "33",
            thirtyFour: "34",
            thirtyFive: "35",
            thirtySix: "36",
            thirtySeven: "37",
            thirtyEight: "38",
            thirtyNine: "39",
            forty: "40"
        },
        mask: {
            auto: "auto",
            one: "1",
            two: "2",
            three: "3",
            four: "4",
            five: "5",
            six: "6",
            seven: "7"
        },
        connectionNo: {
            zero: "0",
            one: "1",
            two: "2",
            three: "3",
            four: "4",
            five: "5",
            six: "6",
            seven: "7",
            eight: "8",
            nine: "9",
            ten: "10",
            eleven: "11",
            twelve: "12",
            thirteen: "13",
            fourteen: "14",
            fifteen: "15"
        },
        structureNumber: {
            zero: "0",
            one: "1",
            two: "2",
            three: "3",
            four: "4",
            five: "5",
            six: "6",
            seven: "7",
            eight: "8",
            nine: "9",
            ten: "10",
            eleven: "11",
            twelve: "12",
            thirteen: "13",
            fourteen: "14",
            fifteen: "15"
        },
        charset: {
            uft8: "UTF-8",
            shiftJIS: "Shift-JIS"
        },
        pdfErrorCorrectionLevel: {
            auto: "auto",
            zero: "0",
            one: "1",
            two: "2",
            three: "3",
            four: "4",
            five: "5",
            six: "6",
            seven: "7",
            eight: "8"
        },
        rows: {
            auto: "auto",
            three: "3",
            four: "4",
            five: "5",
            six: "6",
            seven: "7",
            eight: "8",
            nine: "9",
            ten: "10",
            eleven: "11",
            twelve: "12",
            thirteen: "13",
            fourteen: "14",
            fifteen: "15",
            sixteen: "16",
            seventeen: "17",
            eighteen: "18",
            nineteen: "19",
            twenty: "20",
            twentyOne: "21",
            twentyTwo: "22",
            twentyThree: "23",
            twentyFour: "24",
            twentyFive: "25",
            twentySix: "26",
            twentySeven: "27",
            twentyEight: "28",
            twentyNine: "29",
            thirty: "30",
            thirtyOne: "31",
            thirtyTwo: "32",
            thirtyThree: "33",
            thirtyFour: "34",
            thirtyFive: "35",
            thirtySix: "36",
            thirtySeven: "37",
            thirtyEight: "38",
            thirtyNine: "39",
            forty: "40",
            fortyOne: "41",
            fortyTwo: "42",
            fortyThree: "43",
            fortyFour: "44",
            fortyFive: "45",
            fortySix: "46",
            fortySeven: "47",
            fortyEight: "48",
            fortyNine: "49",
            fifty: "50",
            fiftyOne: "51",
            fiftyTwo: "52",
            fiftyThree: "53",
            fiftyFour: "54",
            fiftyFive: "55",
            fiftySix: "56",
            fiftySeven: "57",
            fiftyEight: "58",
            fiftyNine: "59",
            sixty: "60",
            sixtyOne: "61",
            sixtyTwo: "62",
            sixtyThree: "63",
            sixtyFour: "64",
            sixtyFive: "65",
            sixtySix: "66",
            sixtySeven: "67",
            sixtyEight: "68",
            sixtyNine: "69",
            seventy: "70",
            seventyOne: "71",
            seventyTwo: "72",
            seventyThree: "73",
            seventyFour: "74",
            seventyFive: "75",
            seventySix: "76",
            seventySeven: "77",
            seventyEight: "78",
            seventyNine: "79",
            eighty: "80",
            eightyOne: "81",
            eightyTwo: "82",
            eightyThree: "83",
            eightyFour: "84",
            eightyFive: "85",
            eightySix: "86",
            eightySeven: "87",
            eightyEight: "88",
            eightyNine: "89",
            ninety: "90"

        },
        columns: {
            auto: "auto",
            one: "1",
            two: "2",
            three: "3",
            four: "4",
            five: "5",
            six: "6",
            seven: "7",
            eight: "8",
            nine: "9",
            ten: "10",
            eleven: "11",
            twelve: "12",
            thirteen: "13",
            fourteen: "14",
            fifteen: "15",
            sixteen: "16",
            seventeen: "17",
            eighteen: "18",
            nineteen: "19",
            twenty: "20",
            twentyOne: "21",
            twentyTwo: "22",
            twentyThree: "23",
            twentyFour: "24",
            twentyFive: "25",
            twentySix: "26",
            twentySeven: "27",
            twentyEight: "28",
            twentyNine: "29",
            thirty: "30"
        },
        fontWeight: {
            normal: "normal",
            bold: "bold"
        },
        textDecoration: {
            none: "none",
            underline: "underline",
            overline: "overline",
            linethrough: "line-through"
        },
        setButton: "Set"
    },
    slicerTab: {
        slicerStyle: {
            title: "Slicer Style",
            groupTitle: {
                light: "Light",
                dark: "Dark"
            },
            light: {
                light1: "Slicer Style Light 1",
                light2: "Slicer Style Light 2",
                light3: "Slicer Style Light 3",
                light4: "Slicer Style Light 4",
                light5: "Slicer Style Light 5",
                light6: "Slicer Style Light 6"
            },
            other: {
                other1: "Slicer Style Other 1",
                other2: "Slicer Style Other 2"
            },
            dark: {
                dark1: "Slicer Style Dark 1",
                dark2: "Slicer Style Dark 2",
                dark3: "Slicer Style Dark 3",
                dark4: "Slicer Style Dark 4",
                dark5: "Slicer Style Dark 5",
                dark6: "Slicer Style Dark 6"
            }
        },
        general: {
            title: "General",
            name: "Name",
            captionName: "Caption Name",
            itemSorting: {
                title: "Item Sorting",
                option: {
                    none: "None",
                    ascending: "Ascending",
                    descending: "Descending"
                }
            },
            displayHeader: "Display Header"
        },
        layout: {
            title: "Layout",
            columnNumber: "Column Number",
            buttonHeight: "Button Height",
            buttonWidth: "Button Width"
        },
        property: {
            title: "Property",
            moveAndSize: "Move and size with cells",
            moveAndNoSize: "Move and don't size with cells",
            noMoveAndSize: "Don't move and size with cells",
            locked: "Locked"
        },
        filter: {
            title: "Filtering",
            hideItemsWithNoData: "Hide items with no data",
            markNoData: "Visually indicate items with no data",
            showNoDataLast: "Show items with no data last"
        }
    },
    colorPicker: {
        themeColors: "Theme Colors",
        standardColors: "Standard Colors",
        noFills: "No Fills"
    },
    conditionalFormat: {
        setButton: "Set",
        ruleTypes: {
            title: "Type",
            highlightCells: {
                title: "Highlight Cells Rules",
                values: {
                    cellValue: "Cell Value",
                    specificText: "Specific Text",
                    dateOccurring: "Date Occurring",
                    unique: "Unique",
                    duplicate: "Duplicate"
                }
            },
            topBottom: {
                title: "Top/Bottom Rules",
                values: {
                    top10: "Top10",
                    average: "Average"
                }
            },
            dataBars: {
                title: "Data Bars",
                labels: {
                    minimum: "Minimum",
                    maximum: "Maximum",
                    type: "Type",
                    value: "Value",
                    appearance: "Appearance",
                    showBarOnly: "Show Bar Only",
                    useGradient: "Use Gradien",
                    showBorder: "Show Border",
                    barDirection: "Bar Direction",
                    negativeFillColor: "Negative Color",
                    negativeBorderColor: "Negative Border",
                    axis: "Axis",
                    axisPosition: "Position",
                    axisColor: "Color"
                },
                valueTypes: {
                    number: "Number",
                    lowestValue: "LowestValue",
                    highestValue: "HighestValue",
                    percent: "Percent",
                    percentile: "Percentile",
                    automin: "Automin",
                    automax: "Automax",
                    formula: "Formula"
                },
                directions: {
                    leftToRight: "Left-to-Right",
                    rightToLeft: "Right-to-Left"
                },
                axisPositions: {
                    automatic: "Automatic",
                    cellMidPoint: "CellMidPoint",
                    none: "None"
                }
            },
            colorScales: {
                title: "Color Scales",
                labels: {
                    minimum: "Minimum",
                    midpoint: "Midpoint",
                    maximum: "Maximum",
                    type: "Type",
                    value: "Value",
                    color: "Color"
                },
                values: {
                    twoColors: "2-Color Scale",
                    threeColors: "3-Color Scale"
                },
                valueTypes: {
                    number: "Number",
                    lowestValue: "LowestValue",
                    highestValue: "HighestValue",
                    percent: "Percent",
                    percentile: "Percentile",
                    formula: "Formula"
                }
            },
            iconSets: {
                title: "Icon Sets",
                labels: {
                    style: "Style",
                    showIconOnly: "Show Icon Only",
                    reverseIconOrder: "Reverse Icon Order",

                },
                types: {
                    threeArrowsColored: "ThreeArrowsColored",
                    threeArrowsGray: "ThreeArrowsGray",
                    threeTriangles: "ThreeTriangles",
                    threeStars: "ThreeStars",
                    threeFlags: "ThreeFlags",
                    threeTrafficLightsUnrimmed: "ThreeTrafficLightsUnrimmed",
                    threeTrafficLightsRimmed: "ThreeTrafficLightsRimmed",
                    threeSigns: "ThreeSigns",
                    threeSymbolsCircled: "ThreeSymbolsCircled",
                    threeSymbolsUncircled: "ThreeSymbolsUncircled",
                    fourArrowsColored: "FourArrowsColored",
                    fourArrowsGray: "FourArrowsGray",
                    fourRedToBlack: "FourRedToBlack",
                    fourRatings: "FourRatings",
                    fourTrafficLights: "FourTrafficLights",
                    fiveArrowsColored: "FiveArrowsColored",
                    fiveArrowsGray: "FiveArrowsGray",
                    fiveRatings: "FiveRatings",
                    fiveQuarters: "FiveQuarters",
                    fiveBoxes: "FiveBoxes"
                },
                valueTypes: {
                    number: "Number",
                    percent: "Percent",
                    percentile: "Percentile",
                    formula: "Formula"
                }
            },
            removeConditionalFormat: {
                title: "None"
            }
        },
        operators: {
            cellValue: {
                types: {
                    equalsTo: "EqualsTo",
                    notEqualsTo: "NotEqualsTo",
                    greaterThan: "GreaterThan",
                    greaterThanOrEqualsTo: "GreaterThanOrEqualsTo",
                    lessThan: "LessThan",
                    lessThanOrEqualsTo: "LessThanOrEqualsTo",
                    between: "Between",
                    notBetween: "NotBetween"
                }
            },
            specificText: {
                types: {
                    contains: "Contains",
                    doesNotContain: "DoesNotContain",
                    beginsWith: "BeginsWith",
                    endsWith: "EndsWith"
                }
            },
            dateOccurring: {
                types: {
                    today: "Today",
                    yesterday: "Yesterday",
                    tomorrow: "Tomorrow",
                    last7Days: "Last7Days",
                    thisMonth: "ThisMonth",
                    lastMonth: "LastMonth",
                    nextMonth: "NextMonth",
                    thisWeek: "ThisWeek",
                    lastWeek: "LastWeek",
                    nextWeek: "NextWeek"
                }
            },
            top10: {
                types: {
                    top: "Top",
                    bottom: "Bottom"
                }
            },
            average: {
                types: {
                    above: "Above",
                    below: "Below",
                    equalOrAbove: "EqualOrAbove",
                    equalOrBelow: "EqualOrBelow",
                    above1StdDev: "Above1StdDev",
                    below1StdDev: "Below1StdDev",
                    above2StdDev: "Above2StdDev",
                    below2StdDev: "Below2StdDev",
                    above3StdDev: "Above3StdDev",
                    below3StdDev: "Below3StdDev"
                }
            }
        },
        texts: {
            cells: "Format only cells with:",
            rankIn: "Format values that rank in the:",
            inRange: "values in the selected range.",
            values: "Format values that are:",
            average: "the average for selected range.",
            allValuesBased: "Format all cells based on their values:",
            all: "Format all:",
            and: "and",
            formatStyle: "use style",
            showIconWithRules: "Display each icon according to these rules:"
        },
        formatSetting: {
            formatUseBackColor: "BackColor",
            formatUseForeColor: "ForeColor",
            formatUseBorder: "Border"
        }
    },
    cellTypes: {
        title: "Cell Types",
        buttonCellType: {
            title: "ButtonCellType",
            values: {
                marginTop: "Margin-Top",
                marginRight: "Margin-Right",
                marginBottom: "Margin-Bottom",
                marginLeft: "Margin-Left",
                text: "Text",
                backColor: "BackColor"
            }
        },
        checkBoxCellType: {
            title: "CheckBoxCellType",
            values: {
                caption: "Caption",
                textTrue: "TextTrue",
                textIndeterminate: "TextIndeterminate",
                textFalse: "TextFalse",
                textAlign: {
                    title: "TextAlign",
                    values: {
                        top: "Top",
                        bottom: "Bottom",
                        left: "Left",
                        right: "Right"
                    }
                },
                isThreeState: "IsThreeState"
            }
        },
        comboBoxCellType: {
            title: "ComboBoxCellType",
            values: {
                editorValueType: {
                    title: "EditorValueType",
                    values: {
                        text: "Text",
                        index: "Index",
                        value: "Value"
                    }
                },
                itemsText: "Items Text",
                itemsValue: "Items Value"
            }
        },
        hyperlinkCellType: {
            title: "HyperlinkCellType",
            values: {
                linkColor: "LinkColor",
                visitedLinkColor: "VisitedLinkColor",
                text: "Text",
                linkToolTip: "LinkToolTip",
                address: "Address"
            }
        },
        clearCellType: {
            title: "None"
        },
        setButton: "Set",
        insertButton: "Insert"
    },
    sparklineDialog: {
        title: "SparklineEx Setting",
        detail: "SparklineEx Detail Setting",
        sparklineExType: {
            title: "Type",
            values: {
                line: "Line",
                column: "Column",
                winLoss: "Win/Loss",
                pie: "Pie",
                area: "Area",
                scatter: "Scatter",
                spread: "Spread",
                stacked: "Stacked",
                bullet: "Bullet",
                hbar: "Hbar",
                vbar: "Vbar",
                variance: "Variance",
                boxplot: "BoxPlot",
                cascade: "Cascade",
                pareto: "Pareto"
            }
        },
        lineSparkline: {
            dataRange: "Data Range",
            locationRange: "Location Range",
            dataRangeError: "Data range is invalid!",
            singleDataRange: "Data range should be in a single row or column.",
            locationRangeError: "Location range is invalid!"
        },
        bulletSparkline: {
            measure: "Measure",
            target: "Target",
            maxi: "Maxi",
            forecast: "Forecast",
            good: "Good",
            bad: "Bad",
            tickunit: "Tickunit",
            colorScheme: "ColorScheme",
            vertical: "Vertical"
        },
        hbarSparkline: {
            value: "Value",
            colorScheme: "ColorScheme"
        },
        varianceSparkline: {
            variance: "Variance",
            reference: "Reference",
            mini: "Mini",
            maxi: "Maxi",
            mark: "Mark",
            tickunit: "TickUnit",
            colorPositive: "ColorPositive",
            colorNegative: "ColorNegative",
            legend: "Legend",
            vertical: "Vertical"
        }
    },
    barCodeDialog: {
        title: "BarCode Setting",
        detail: "BarCode Detail Setting",
        barCodeType: {
            title: "Type",
            values: {
                qrCode:"QRcode",
                dataMatrix:"DataMatrix",
                pdf417:"PDF417",
                ean13:"EAN13",
                ean8:"EAN8",
                codaBar:"Codabar",
                code39:"Code39",
                code93:"Code93",
                code128:"Code128",
                code49:"Code49",
                gs1_128:"GS1_128"
            }
        },
        ean8:{
            dataRange: "Data Range",
            locationRange: "Location Range",
            dataRangeError: "Data range is invalid!",
            singleDataRange: "Data range should be in a single row or column.",
            locationRangeError: "Location range is invalid!",
            color: "Color",
            backgroundColor: "Background Color",
        },
        gs1_128:{
            showLabel: "Show Label",
            labelPosition: "Label Position"
        },
        ean13:{
            addOn: "Add Text Of QRCode",
            addOnLabelPosition: "Add On Label Position"
        },
        codaBar:{
            checkDigit: "Check Digit",
            nwRatio: "The Wide And Narrow Bar Ratio"
        },
        code39:{
            labelWithStartAndStopCharacter: "Label With Character",
            nwRatio: "The Wide And Narrow Bar Ratio",
        },
        code49:{
            grouping: "Grouping",
            groupNo: "Group No"
        },
        code93:{
            checkDigit: "Check Digit",
            fullASCII: "Full ASCII"
        },
        code128:{
            codeSet: "Code Set"
        },
        pdf417:{
            errorCorrectionLevel: "Error Correction Level",
            rows: "Rows",
            columns: "Columns",
            compact: "Compact"
        },
        dataMatrix:{
            eccMode: "Ecc Mode",
            ecc200SymbolSize: "Ecc200 Symbol Size",
            ecc200EndcodingMode: "Ecc200 Endcoding Mode",
            ecc00_140Symbole: "Ecc00_140 Symbole",
            structureAppend: "Structure Append",
            structureNumber: "Structure Number",
            fileIdentifier: "File Identifier"
        },
        qrCode:{
            errorCorrectionLevel: "Error Correction Level",
            model: "Model",
            version: "Version",
            mask: "Mask",
            connection: "Connection",
            connectionNo: "ConnectionNo",
            charCode: "Char Code",
            charset: "Charset"
        },
        setButton: "Set"
    },
    slicerDialog: {
        insertSlicer: "Insert Slicer"
    },
    tooltips: {
        style: {
            fontBold: "Mark text bold.",
            fontItalic: "Mark text italic",
            fontUnderline: "Underline text.",
            fontDoubleUnderline: "Double Underline text.",
            fontOverline: "Overline text.",
            fontLinethrough: "Strikethrough text."
        },
        alignment: {
            leftAlign: "Align text to the left.",
            centerAlign: "Center text.",
            rightAlign: "Align text to the right.",
            topAlign: "Align text to the top.",
            middleAlign: "Align text to the middle.",
            bottomAlign: "Align text to the bottom.",
            decreaseIndent: "Decrease the indent level.",
            increaseIndent: "Increase the indent level."
        },
        border: {
            outsideBorder: "Outside Border",
            insideBorder: "Inside Border",
            allBorder: "All Border",
            leftBorder: "Left Border",
            innerVertical: "Inner Vertical",
            rightBorder: "Right Border",
            topBorder: "Top Border",
            innerHorizontal: "Inner Horizontal",
            bottomBorder: "Bottom Border",
            noBorder: "None",
            diagonalUpLine: "Diagonal Up Line",
            diagonalDownLine: "Diagonal Down Line",
        },
        format: {
            percentStyle: "Percent Style",
            commaStyle: "Comma Style",
            increaseDecimal: "Increase Decimal",
            decreaseDecimal: "Decrease Decimal"
        }
    },
    defaultTexts: {
        buttonText: "Button",
        checkCaption: "Check",
        comboText: "United States,China,Japan",
        comboValue: "US,CN,JP",
        hyperlinkText: "SpreadJS",
        hyperlinkToolTip: "SpreadJS Web Site",
        hyperlinkAddress: "http://www.grapecity.com/en/spreadjs"
    },
    messages: {
        invalidImportFile: "Invalid file, import failed.",
        duplicatedSheetName: "Duplicated sheet name.",
        duplicatedTableName: "Duplicated table name.",
        rowColumnRangeRequired: "Please select a range of row or column.",
        imageFileRequired: "The file muse be image!",
        duplicatedSlicerName: "Duplicated slicer name.",
        invalidSlicerName: "Slicer name is not valid."
    },
    contextMenu: {
        cutItem: "Cut",
        copyItem: "Copy",
        pasteItem: "Paste",
        insertItem: "Insert",
        deleteItem: "Delete",
        mergeItem: "Merge",
        unmergeItem: "Unmerge"
    },
    dialog: {
        ok: "OK",
        cancel: "Cancel"
    },
    find: {
        title: "Find",
        options: "Options",
        findwhat: "Find what",
        within: { title: "Within", worksheet: "Worksheet", workbook: "Workbook" },
        searchby: { title: "Search by", rows: "Rows", columns: "Columns" },
        lookin: { title: "Look in", values: "Values", formulas: "Formulas" },
        matchcase: "Match case",
        matchexactly: "Match exactly",
        usewildcards: "Use wildcards",
        findall: "Find All",
        findnext: "Find Next",
        result: {
            header: {
                sheet: "Sheet",
                cell: "Cell",
                value: "Value",
                formula: "Formula"
            },
            countssuffix: " cell(s) found",
            nomatch: "Spread cannot find the data you are looking for."
        }
    },
    printSetting: {
        printButton: "Print",
        options: {
            title: "Options",
            range: {
                title: "Print Range",
                items: {
                    activeSheet: "Active Sheet",
                    selection: "Selection",
                    workbook: "Entire Workbook"
                }
            },
            showPrintLine: "Show Print Line",
            showBorder: "Show Border",
            showGridline: "Show Gridline",
            waterMark: "Water Mark",
            headerAndFooter: {
                title: "Header / Footer",
                header: {
                    title: "Header",
                    items: [
                        { text: "(none)" },
                        { value: { center: "Page &P" } },
                        { value: { right: "&A" } },
                        { value: { center: "Page &P", right: "&A" } }
                    ],
                    custom: "Custom Header"
                },
                footer: {
                    title: "Footer",
                    items: [
                        { text: "(none)" },
                        { value: { center: "Page &P of &N" }  },
                        { value: { left: "&BConfidential&B", center: "&D", right: "Page &P" }}
                    ],
                    custom: "Custom Footer"
                },
                custom: {
                  left: "Left section",
                  center: "Center section",
                  right: "Right section",
                  items: [
                      { text: "(none)" },
                      { text: "Page Number", value: "&P" },
                      { text: "Total Pages", value: "&N" },
                      { text: "Sheet Name", value: "&A" },
                      { text: "Workbook Name", value: "&F" },
                      { text: "Current Date", value: "&D" },
                      { text: "Current Date and Time", value: "&D &T"}
                    ],
                    insert: "Insert",
                    image: {
                        value: "&G",
                        emptylist: "(browse...)"
                    },
                    insertPicture: "Insert Picture",
                    tooltips: {
                        insert: "Select the section and position the insertion point, then choose item to insert.",
                        insertPicture: "Select the section and position the insertion point, then choose one uploaded image to insert.",
                        imageList: "Browse and select the image to be uploaded for header / footer.\nWe suggest that the image should be not bigger than 200px x 200px."
                    }
                },
                preview: "Preview"
            }

        }
    },
    fileMenu: {
      items: {
          new: "New",
          save: "Save",
            password: "Password:",
            browse:"Browse",
            close: "Close",
            filename:"File Name:",
          open: {
              title: "Open"
          },
          print: {
              title: "Print"
          },
          settings: {
              title: "Settings"
          }
      }
    },
    settingPane: {
      title: {
          comment: "Comment",
          slicer: "Slicer",
      }
    },
    functions: {
        setting: {
            defaultDescription: "Select a function and get its description.",
            filterPlaceHolder: "Search function"
        },
        categories: {
            datebase: {
                text: "Database",
                items: [
                    "DAVERAGE",
                    "DCOUNT",
                    "DCOUNTA",
                    "DGET",
                    "DMAX",
                    "DMIN",
                    "DPRODUCT",
                    "DSTDEV",
                    "DSTDEVP",
                    "DSUM",
                    "DVAR",
                    "DVARP"
                ]
            },
            dateandtime: {
                text: "Date & Time",
                items: [
                    "DATE",
                    "DATEDIF",
                    "DATEVALUE",
                    "DAY",
                    "DAYS360",
                    "EDATE",
                    "EOMONTH",
                    "HOUR",
                    "MINUTE",
                    "MONTH",
                    "NETWORKDAYS",
                    "NOW",
                    "SECOND",
                    "TIME",
                    "TIMEVALUE",
                    "TODAY",
                    "WEEKDAY",
                    "WEEKNUM",
                    "WORKDAY",
                    "YEAR",
                    "YEARFRAC"
                ]
            },
            engineering: {
                text: "Engineering",
                items: [
                    "BESSELI",
                    "BESSELJ",
                    "BESSELK",
                    "BESSELY",
                    "BIN2DEC",
                    "BIN2HEX",
                    "BIN2OCT",
                    "COMPLEX",
                    "CONVERT",
                    "DEC2BIN",
                    "DEC2HEX",
                    "DEC2OCT",
                    "DELTA",
                    "ERF",
                    "ERFC",
                    "GESTEP",
                    "HEX2BIN",
                    "HEX2DEC",
                    "HEX2OCT",
                    "IMABS",
                    "IMAGINARY",
                    "IMARGUMENT",
                    "IMCONJUGATE",
                    "IMCOS",
                    "IMDIV",
                    "IMEXP",
                    "IMLN",
                    "IMLOG10",
                    "IMLOG2",
                    "IMPOWER",
                    "IMPRODUCT",
                    "IMREAL",
                    "IMSIN",
                    "IMSQRT",
                    "IMSUB",
                    "IMSUM",
                    "OCT2BIN",
                    "OCT2DEC",
                    "OCT2HEX"
                ]
            },
            financial: {
                text: "Financial",
                items: [
                    "ACCRINT",
                    "ACCRINTM",
                    "AMORDEGRC",
                    "AMORLINC",
                    "COUPDAYBS",
                    "COUPDAYS",
                    "COUPDAYSNC",
                    "COUPNCD",
                    "COUPNUM",
                    "COUPPCD",
                    "CUMIPMT",
                    "CUMPRINC",
                    "DB",
                    "DDB",
                    "DISC",
                    "DOLLARDE",
                    "DOLLARFR",
                    "DURATION",
                    "EFFECT",
                    "FV",
                    "FVSCHEDULE",
                    "INTRATE",
                    "IPMT",
                    "IRR",
                    "ISPMT",
                    "MDURATION",
                    "MIRR",
                    "NOMINAL",
                    "NPER",
                    "NPV",
                    "ODDFPRICE",
                    "ODDFYIELD",
                    "ODDLPRICE",
                    "ODDLYIELD",
                    "EURO",
                    "EUROCONVERT",
                    "PMT",
                    "PPMT",
                    "PRICE",
                    "PRICEDISC",
                    "PRICEMAT",
                    "PV",
                    "RATE",
                    "RECEIVED",
                    "SLN",
                    "SYD",
                    "TBILLEQ",
                    "TBILLPRICE",
                    "TBILLYIELD",
                    "VDB",
                    "XIRR",
                    "XNPV",
                    "YIELD",
                    "YIELDDISC",
                    "YIELDMAT"
                ]
            },
            information: {
                text: "Information",
                items: [
                    "ERROR.TYPE",
                    "ISBLANK",
                    "ISERR",
                    "ISERROR",
                    "ISEVEN",
                    "ISLOGICAL",
                    "ISNA",
                    "ISNONTEXT",
                    "ISNUMBER",
                    "ISODD",
                    "ISREF",
                    "ISTEXT",
                    "N",
                    "NA",
                    "TYPE"
                ]
            },
            logical: {
                text: "Logical",
                items: [
                    "AND",
                    "FALSE",
                    "IF",
                    "IFERROR",
                    "NOT",
                    "OR",
                    "TRUE"
                ]
            },
            lookupAndReference: {
                text: "Lookup & Reference",
                items: [
                    "ADDRESS",
                    "CHOOSE",
                    "COLUMN",
                    "COLUMNS",
                    "HLOOKUP",
                    "INDEX",
                    "LOOKUP",
                    "MATCH",
                    "OFFSET",
                    "ROW",
                    "ROWS",
                    "TRANSPOSE",
                    "VLOOKUP"
                ]
            },
            mathAndTrigonometry: {
                text: "Math & Trig",
                items: [
                    "ABS",
                    "ACOS",
                    "ACOSH",
                    "ASIN",
                    "ASINH",
                    "ATAN",
                    "ATAN2",
                    "ATANH",
                    "CEILING",
                    "COMBIN",
                    "COS",
                    "COSH",
                    "DEGREES",
                    "EVEN",
                    "EXP",
                    "FACT",
                    "FACTDOUBLE",
                    "FLOOR",
                    "GCD",
                    "INT",
                    "LCM",
                    "LN",
                    "LOG",
                    "LOG10",
                    "MDETERM",
                    "MINVERSE",
                    "MMULT",
                    "MOD",
                    "MROUND",
                    "MULTINOMIAL",
                    "ODD",
                    "PI",
                    "POWER",
                    "PRODUCT",
                    "QUOTIENT",
                    "RADIANS",
                    "RAND",
                    "RANDBETWEEN",
                    "ROMAN",
                    "ROUND",
                    "ROUNDDOWN",
                    "ROUNDUP",
                    "SERIESSUM",
                    "SIGN",
                    "SIN",
                    "SINH",
                    "SQRT",
                    "SQRTPI",
                    "SUBTOTAL",
                    "SUM",
                    "SUMIF",
                    "SUMIFS",
                    "SUMPRODUCT",
                    "SUMSQ",
                    "SUMX2MY2",
                    "SUMX2PY2",
                    "SUMXMY2",
                    "TAN",
                    "TANH",
                    "TRUNC"
                ]
            },
            statistical: {
                text: "Statistical",
                items: [
                    "AVEDEV",
                    "AVERAGE",
                    "AVERAGEA",
                    "AVERAGEIF",
                    "AVERAGEIFS",
                    "BETADIST",
                    "BETAINV",
                    "BINOMDIST",
                    "CHIDIST",
                    "CHIINV",
                    "CHITEST",
                    "CONFIDENCE",
                    "CORREL",
                    "COUNT",
                    "COUNTA",
                    "COUNTBLANK",
                    "COUNTIF",
                    "COUNTIFS",
                    "COVAR",
                    "CRITBINOM",
                    "DEVSQ",
                    "EXPONDIST",
                    "FDIST",
                    "FINV",
                    "FISHER",
                    "FISHERINV",
                    "FORECAST",
                    "FREQUENCY",
                    "FTEST",
                    "GAMMADIST",
                    "GAMMAINV",
                    "GAMMALN",
                    "GEOMEAN",
                    "GROWTH",
                    "HARMEAN",
                    "HYPGEOMDIST",
                    "INTERCEPT",
                    "KURT",
                    "LARGE",
                    "LINEST",
                    "LOGEST",
                    "LOGINV",
                    "LOGNORMDIST",
                    "MAX",
                    "MAXA",
                    "MEDIAN",
                    "MIN",
                    "MINA",
                    "MODE",
                    "NEGBINOMDIST",
                    "NORMDIST",
                    "NORMINV",
                    "NORMSDIST",
                    "NORMSINV",
                    "PEARSON",
                    "PERCENTILE",
                    "PERCENTRANK",
                    "PERMUT",
                    "POISSON",
                    "PROB",
                    "QUARTILE",
                    "RANK",
                    "RSQ",
                    "SKEW",
                    "SLOPE",
                    "SMALL",
                    "STANDARDIZE",
                    "STDEV",
                    "STDEVA",
                    "STDEVP",
                    "STDEVPA",
                    "STEYX",
                    "TDIST",
                    "TINV",
                    "TREND",
                    "TRIMMEAN",
                    "TTEST",
                    "VAR",
                    "VARA",
                    "VARP",
                    "VARPA",
                    "WEIBULL",
                    "ZTEST"
                ]
            },
            text: {
                text: "Text",
                items: [
                    "CHAR",
                    "CLEAN",
                    "CODE",
                    "CONCATENATE",
                    "DOLLAR",
                    "EXACT",
                    "FIND",
                    "FIXED",
                    "LEFT",
                    "LEN",
                    "LOWER",
                    "MID",
                    "PROPER",
                    "REPLACE",
                    "REPT",
                    "RIGHT",
                    "SEARCH",
                    "SUBSTITUTE",
                    "T",
                    "TEXT",
                    "TRIM",
                    "UPPER",
                    "VALUE"
                ]
            }
        }
    },
    addChartElement: {
        axes:{
            axes:'Axes',
            moreAxisOption:'More Axis Option'
        },
        axisTitles:{
            axisTitles:'Axis Titles',
            moreAxisTitlesOption:'More Axis Titles Option'
        },
        chartTitle:{
            chartTitle:'Chart Title',
            moreChartTitleOption:'More Chart Title Option'
        },
        gridLines:{
            gridLines:'GridLines',
            moreGridLinesOption:'More GridLines Option'
        },
        dataLabels:{
            dataLabels:'Data Labels',
            moreDataLabelsOption:'More Data Labels Option'
        },
        legend:{
            legend:'Legend',
            moreLegendOption:'More Legend Option'
        },
        primaryHorizontal:'Primary Horizontal',
        primaryVertical:'Primary Vertical',
        secondaryHorizontal:'Secondary Horizontal',
        secondaryVertical:'Secondary Vertical',
        none:'None',
        aboveChart:'Above Chart',
        primaryMajorHorizontal:'Primary Major Horizontal',
        primaryMajorVertical:'Primary Major Vertical',
        primaryMinorHorizontal:'Primary Minor Horizontal',
        primaryMinorVertical:'Primary Minor Vertical',
        secondaryMajorHorizontal:'Secondary Major Horizontal',
        secondaryMajorVertical:'Secondary Major Vertical',
        secondaryMinorHorizontal:'Secondary Minor Horizontal',
        secondaryMinorVertical:'Secondary Minor Vertical',
        center:'Center',
        insideEnd:'Inside End',
        outsideEnd:'Outside End',
        bestFit:'Best Fit',
        above:'Above',
        below:'Below',
        show:'Show',
        right:'Right',
        top:'Top',
        left:'Left',
        bottom:'Bottom'
    },
    richTextDialog: {
        editRichText: "Edit Rich Text",
        title:"Rich Text"
    },
    shape: {
        connector: 'Line',
        blockArrows: 'Block Arrows',
        flowchart: 'Flowchart',
        callouts: 'Callouts',
        rectangles: 'Rectangles',
        equationShapes:'Equation Shapes',
        basicShapes: 'Basic Shapes',
        starsAndBanners: 'Stars And Banners'
    }
};
