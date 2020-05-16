(function () {
    'use strict';

    var designer = GC.Spread.Sheets.Designer;
    var cn_res = {};

    cn_res.title = "SpreadJS 设计器";
    cn_res.defaultFont = "11pt Calibri";
    cn_res.ok = "确定";
    cn_res.yes = "是";
    cn_res.no = "否";
    cn_res.apply = "适用";
    cn_res.cancel = "取消";
    cn_res.close = "关闭";

    cn_res.fileAPINotSupported = "当前浏览器不提供API读取本地文件，请用其他现代浏览器来使用读取本地文件相关功能。";
    cn_res.blobNotSupported = "当前浏览器不支持Blob，无法保存本地文件，请用其他现代浏览器/格式来完成保存本地文件相关功能。";
    cn_res.saveFileDialogTitle = "另存为";
    cn_res.openFileDialogTitle = "打开";
    cn_res.allSpreadFileFilter = '所有 Spreadsheet 文件(*.ssjson *.xlsx)';
    cn_res.spreadFileFilter = 'SpreadJS 文件(*.ssjson)';
    cn_res.ssJSONToJSFilter = 'Javascript 文件(*.js)';
    cn_res.allExcelFilter = "所有 Excel 文件(*.xlsx)";
    cn_res.excelFileFilter = 'Excel 工作薄 (*.xlsx)';
    cn_res.csvFileFilter = "CSV 文件 (*.csv)";
    cn_res.pdfFileFilter = "PDF 文件 (*.pdf)";
    cn_res.allFileFilter = '所有文件 (*.*)';
    cn_res.importFileDialogTitle = "导入";
    cn_res.exportFileDialogTitle = "导出";

    cn_res.insertCellInSheet = "无法移动整个工作表的单元格";
    cn_res.insertCellInMixtureRange = "不能对同时包含整行或整列和其他单元格的选择区域使用此命令。请尝试只选择整行或整列或一组单元格。";
    cn_res.NotExecInMultiRanges = "不能对多重选择区域使用此命令。请选择单个区域再次尝试此命令。";
    cn_res.unsavedWarning = "此文件未保存，是否保存？ ";
    cn_res.errorGroup = "表单包含分组列 , 是否继续操作?";

    cn_res.requestTempalteFail = "模板文件请求错误。";
    cn_res.requestTemplateConfigFail = "模板配置文件请求错误。";
    cn_res.openFileFormatError = "文件格式不正确。";

    cn_res.closingNotification = "警告:当前文件已经被修改。\n是否保存对此文件的更改？";


    cn_res.sameSlicerName = "切片器名称已经被使用。请输入一个唯一的名称。 ";
    cn_res.nullSlicerName = "切片器名称不合法。";

    cn_res.changePartOfArrayWarning = "数组公式不允许更改部分内容！";
    cn_res.changePartOfTableWarning = "不允许此操作，因为它会移动工作表上表格中的单元格。";
    cn_res.exportCsvSheetIndexError = "无效的工作表索引。";

    cn_res.fontPicker = {
        familyLabelText: '字体:',
        styleLabelText: '字形:',
        sizeLabelText: '字号:',
        weightLabelText: '字体粗细:',
        colorLabelText: '颜色:',
        normalFontLabelText: '常规字体',
        previewLabelText: '预览',
        previewText: 'AaBbCcYyZz',
        effects: "特殊效果",
        underline: "下划线",
        doubleUnderline: "双下划线",
        strikethrough: "删除线",
        //
        // Fonts shown in font selector.
        //
        // the property's name means the font family name.
        // the property's value means the text shown in drop down list.
        //
        fontFamilies: {
            "宋体": "宋体",
            "楷体": "楷体",
            "仿宋": "仿宋",
            "黑体": "黑体",
            "新宋体": "新宋体",
            "SimSun": "SimSun",
            "KaiTi": "KaiTi",
            "FangSong": "FangSong",
            "SimHei": "SimHei",
            "NSimSun": "NSimSun",
            "Arial": "Arial",
            "'Arial Black'": "Arial Black",
            "Calibri": "Calibri",
            "Cambria": "Cambria",
            "Candara": "Candara",
            "Century": "Century",
            "'Courier New'": "Courier New",
            "'Comic Sans MS'": "Comic Sans MS",
            "Garamond": "Garamond",
            "Georgia": "Georgia",
            "'Malgun Gothic'": "Malgun Gothic",
            "Mangal": "Mangal",
            "Tahoma": "Tahoma",
            "Times": "Times",
            "'Times New Roman'": "Times New Roman",
            "'Trebuchet MS'": "Trebuchet MS",
            "Verdana": "Verdana",
            "Wingdings": "Wingdings",
            "Meiryo": "Meiryo",
            "'MS Gothic'": "MS Gothic",
            "'MS Mincho'": "MS Mincho",
            "'MS PGothic'": "MS PGothic",
            "'MS PMincho'": "MS PMincho"
        },
        fontStyles: {
            'normal': '常规',
            'italic': '斜体',
            'oblique': '倾斜'
        },
        fontWeights: {
            'normal': '常规',
            'bold': '加粗',
            'bolder': '更粗',
            'lighter': '更细'
        },
        alternativeFonts: "'Microsoft Yahei UI', 'Microsoft Yahei', 微软雅黑, SimSun, 宋体, sans-serif",
        defaultSize: '10'
    };

    cn_res.commonFormats = {
        Number: {
            format: "0.00",
            label: "数值"
        },
        Currency: {
            format: "$#,##0.00",
            label: "货币"
        },
        Accounting: {
            format: "$ #,##0.00;$ (#,##0.00);$ \"-\"??;@",
            label: "会计专用"
        },
        ShortDate: {
            format: "m/d/yyyy",
            label: "短日期"
        },
        LongDate: {
            format: "dddd, mmmm dd, yyyy",
            label: "长日期"
        },
        Time: {
            format: "h:mm:ss AM/PM",
            label: "时间"
        },
        Percentage: {
            format: "0.00%",
            label: "百分比"
        },
        Fraction: {
            format: "# ?/?",
            label: "分数"
        },
        Scientific: {
            format: "0.00E+00",
            label: "科学记数"
        },
        Text: {
            format: "@",
            label: "文本"
        },
        Comma: {
            format: " #,##0.00; (#,##0.00); \"-\"??;@",
            label: "千分符"
        }
    };
    cn_res.customFormat = "自定义";
    cn_res.generalFormat = "常规";

    cn_res.colorPicker = {
        themeColorsTitle: "自定义",
        standardColorsTitle: "标准",
        noFillText: "无颜色",
        moreColorsText: "其他颜色...",
        colorDialogTitle: "颜色",
        red: "红色: ",
        green: "绿色: ",
        blue: "蓝色: ",
        newLabel: "新增",
        currentLabel: "当前"
    };

    cn_res.formatDialog = {
        title: "设置单元格格式",
        number: '数字',
        alignment: '对齐',
        fonts: "字体",
        font: '字体',
        border: '边框',
        padding: '内边距',
        label: '标签',
        cellContent: "单元格内容",
        labelContent: "标签内容",
        text: "文本",
        margin: "外边距",
        fill: '填充',
        protection: '保护',
        category: '分类:',
        backColor: '背景色',
        textAlignment: '文本对齐方式',
        horizontalAlignment: '水平对齐:',
        verticalAlignment: '垂直对齐:',
        indent: '缩进:',
        degrees: '度',
        rotateText: "文本 ———",
        orientation: "方向",
        textControl: '文本控制',
        wrapText: '自动换行',
        shrink: '缩小字体填充',
        merge: '合并单元格',
        top: '靠上',
        bottom: '靠下',
        left: '靠左',
        right: '靠右',
        center: '居中',
        general: '常规',
        sampleText: '文本',
        cantMergeMessage: '重叠范围无法合并。',
        lock: "锁定",
        lockComments: "只有在工作表被保护时，锁定单元格才有效（在“主页”选项卡上“单元格”区域中的“格式”下拉列表中点击“保护工作表”）。",
        backGroundColor: "背景色:",
        moreColorsText: "其他颜色",
        sample: "示例",
        preview: "预览",
        paddingPreviewText: "预览内容",
        visibility: "可见",
        labelVisibility: {
            visible: "可见",
            hidden: "隐藏",
            auto: "自动"
        },
        vertical: "竖排文字",
        cellButton: "单元格按钮",
        addButton: "添加",
        deleteButton: "删除",
        cellButtonImageType: "图片类型",
        cellButtonCommand: "命令",
        cellButtonUserButtonStyle: "使用按钮样式",
        cellButtonVisibility: "可见",
        cellButtonPosition: "位置",
        cellButtonEnable: "可用",
        cellButtonWidth: "宽度",
        cellButtonCaption: "标题",

        cellButtonImageSrc: "图片源",
        cellButtonImageLoad: "导入",
        cellButtonCaptionAlign: "标题排列",
        cellButtonImageWidth: "图片宽度",
        cellButtonImageHeight: "图片高度",

        cellButtonCommands: {
            openColorPicker: "取色器",
            openDateTimePicker: "日期选择器",
            openTimePicker: "时间选择器",
            openCalculator: "计算器",
            openMonthPicker: "月选择器",
            openList: "列表",
            openSlider: "滑块",
            openWorkflowList: "工作流列表",
        },
        cellButtonImageTypes: {
            custom: "自定义",
            clear: "清除",
            cancel: "取消",
            ok: "确定",
            dropdown: "下拉菜单",
            ellipsis: "省略符",
            left: "左",
            right: "右",
            plus: "加",
            minus: "减",
            undo: "撤销",
            redo: "重做",
            search: "查询",
            separator: "分隔线",
            spinLeft: "向左",
            spinRight: "向右",
        },
        cellButtonVisibilitys: {
            always: "始终显示",
            onseleciton: "当选中时",
            onedit: "当编辑时"
        },
    };

    cn_res.dropdownDialog = {
        width: "宽",
        height: "高",
        value: "值",
        text: "字",
        min: "最小",
        max: "最大",
        step: "步进值",
        direction: "方向",
        horizontal: "水平",
        vertical: "竖直",
        list: {
            title: "下拉列表",
            hasChild: "拥有子节点",
            wrap: "折行",
            displayAs: "显示模式",
            inline: "内嵌",
            popup: "弹出",
            tree: "树形",
            collapsible: "可折叠",
            icon: "图标",
            isBigIcon: "使用大图标",
        },
        datetimepicker: {
            title: "日期选择器",
            startDay: "开始日期",
            monday: "星期一",
            tuesday: "星期二",
            wednesday: "星期三",
            thursday: "星期四",
            friday: "星期五",
            saturday: "星期六",
            sunday: "星期天",

            calendarPage: "日历页",
            day: "日",
            year: "年",
            month: "月",
            showTime: "显示时间"
        },
        timepicker: {
            title: "时间选择器",
            hour: "小时",
            minute: "分钟",
            second: "秒",
            format: "格式",
            formatters: [
                "[$-409]h:mm:ss AM/PM",
                "h:mm;@",
                "[$-409]h:mm AM/PM;@",
                "h:mm:ss;@",
                "[$-409]h:mm:ss AM/PM;@",
                "mm:ss.0;@",
                "[h]:mm:ss;@",
                "[$-409]m/d/yy h:mm AM/PM;@",
                "m/d/yy h:mm;@",

                'h"时"mm"分";@',
                'h"时"mm"分"ss"秒";@',
                '[$-804]AM/PM h"时"mm"分";;@',
                '[$-804]AM/PM h"时"mm"分"ss"秒";@',
                '[DBNum1][$-804]h"时"mm"分";@',
                '[DBNum1][$-804]AM/PM h"时"mm"分";@',

                'h"時"mm"分";@',
                'h"時"mm"分"ss"秒";@',

                "[$-412]AM/PM h:mm;@",
                "[$-412]AM/PM h:mm:ss;@",
                "[$-409]h:mm AM/PM;@",
                "[$-409]h:mm:ss AM/PM;@",
                'yyyy"-"m"-"d h:mm;@',
                '[$-412]yyyy"-"m"-"d AM/PM h:mm;@',
                '[$-409]yyyy"-"m"-"d h:mm AM/PM;@',
                'h"시" mm"분";@',
                'h"시" mm"분" ss"초";@',
                '[$-412]AM/PM h"시" mm"분";@',
                '[$-412]AM/PM h"시" mm"분" ss"초";@'
            ]
        },
        monthpicker: {
            title: "月份选择器",
            startYear: "开始年份",
            stopYear: "结束年份",
        },
        slider: {
            title: "滑块",

            scaleVisible: "显示刻度",
            tooltipVisible: "显示提示",
            marks: "标记",
            formatter: "格式",
            formatters: [
                "0",
                "0.00",
                "#,##0",
                "#,##0.00",
                "#,##0;(#,##0)",
                "#,##0.00;(#,##0.00)",
                "$#,##0;($#,##0)",
                "$#,##0.00;($#,##0.00)",
                "0%",
                "0.00%",
                "0.00E+00",
                "##0.0E+0",

                ' $* #,##0.00 ; $* #,##0.00 ; $* "-" ; @ ',
                '_-[$¥-804]* #,##0.00_-;-[$¥-804]* #,##0.00_-;_-[$¥-804]* "-"_-;_-@_-',
                '_-[$¥-411]* #,##0.00_-;-[$¥-411]* #,##0.00_-;_-[$¥-411]* "-"_-;_-@_-',
                '_-[$₩-412]* #,##0.00_-;-[$₩-412]* #,##0.00_-;_-[$₩-412]* "-"_-;_-@_-'
            ]
        },
        workflowlist: {
            title: "工作流列表",
            transitions: "转换项",
            statusSetting: "状态设置",
            processFlow: "工作流"
        },
        colorpicker: {
            title: "取色器",
            colorWidth: "色块宽度",
            themeColor: "主题色",
            stardardColor: "标准色"
        }
    };

    cn_res.formatComment = {
        title: "格式",
        protection: "保护",
        commentLocked: "锁定",
        commentLockText: "锁定文本",
        commentLockComments: "只有在工作表被保护时，锁定对象才有效。要保护工作表，可以在“主页”选项卡上“单元格”区域中的“格式”下拉列表中点击“保护工作表”。",
        properties: "属性",
        positioning: "对象位置",
        internalMargin: "内边距",
        moveSize: "大小和位置随单元格而变",
        moveNoSize: "大小固定，位置随单元格而变",
        noMoveSize: "大小和位置均固定",
        automatic: "自动",
        autoSize: "自动调整大小",
        colors: "颜色和线条",
        size: "大小",
        fill: "填充",
        line: "线条",
        height: "高度",
        width: "宽度",
        lockRatio: "锁定纵横比",
        color: "颜色",
        transparency: "透明度",
        style: "样式",
        dotted: "点线",
        dashed: "虚线",
        solid: "实线",
        double: "双线",
        none: "无线条",
        groove: "常规",
        ridge: "脊线",
        inset: "内凹",
        outset: "外凸",
        px: "px"
    };

    cn_res.categories = {
        general: "常规",
        numbers: "数值",
        currency: "货币",
        accounting: "会计专用",
        date: "日期",
        time: "时间",
        percentage: "百分比",
        fraction: "分数",
        scientific: "科学记数",
        text: "文本",
        special: "特殊",
        custom: "自定义"
    };

    cn_res.formatNumberComments = {
        generalComments: "常规单元格格式不包含任何特定的数字格式。",
        numberComments: "数值格式用于一般数字的表示。货币和会计格式则提供货币值计算的专用格式。",
        currencyComments: "货币格式用于表示一般货币数值。会计格式可以对一列数值进行小数点对齐。",
        accountingComments: "会计格式可对一列数值进行货币符号和小数点对齐。",
        dateComments: "日期格式将日期和时间系列数值显示为日期值。",
        timeComments: "时间格式将日期和时间系列数值显示为时间值。",
        percentageComments: "百分比格式将单元格中数值乘以100，并以百分数形式显示。",
        textComments: "在文本单元格格式中，数字作为文本处理。单元格显示的内容与输入的内容完全一致。",
        specialComments: "特殊格式可用于跟踪数据列表及数据库的值。",
        customComments: "以现有格式为基础，生成自定义的数字格式。"
    };

    cn_res.formatNumberPickerSetting = {
        type: "类型:",
        decimalPlaces: "小数位数:",
        symbol: "货币符号:",
        negativeNumber: "负数:",
        separator: "使用千位分隔符(,)",
        deleted: "删除",
        locale: "区域设置（国家/地区）:",
        calendar: "日历类型:"
    };

    cn_res.localeType = {
        en_us: "英语(美国)",
        ja_jp: "日语",
        zh_cn: "中文",
        ko_kr: "韩文"
    };

    cn_res.calendarType = {
        western: "公历",
        JER: "日本年号"
    };

    cn_res.fractionFormats = [
        "# ?/?",
        "# ??/??",
        "# ???/???",
        "# ?/2",
        "# ?/4",
        "# ?/8",
        "# ??/16",
        "# ?/10",
        "# ??/100"
    ];

    cn_res.numberFormats = [
        "0",
        "0;[Red]0",
        "0_);(0)",
        "0_);[Red](0)",
        "#,##0",
        "#,##0;[Red]#,##0",
        "#,##0_);(#,##0)",
        "#,##0_);[Red](#,##0)"
    ];

    cn_res.dateFormats = [
        "m/d/yyyy",
        "[$-409]dddd, mmmm dd, yyyy",
        "m/d;@",
        "m/d/yy;@",
        "mm/dd/yy;@",
        "[$-409]d-mmm;@",
        "[$-409]d-mmm-yy;@",
        "[$-409]dd-mmm-yy;@",
        "[$-409]mmm-yy;@",
        "[$-409]mmmm-yy;@",
        "[$-409]mmmm d, yyyy;@",
        "[$-409]m/d/yy h:mm AM/PM;@",
        "m/d/yy h:mm;@",
        "[$-409]mmmmm;@",
        "[$-409]mmmmm-yy;@",
        "m/d/yyyy;@",
        "[$-409]d-mmm-yyyy;@"
    ];

    cn_res.chinaDateFormat = [
        "yyyy-mm-dd;@",
        '[DBNum1][$-804]yyyy"年"m"月"d"日";@',
        '[DBNum1][$-804]yyyy"年"m"月";@',
        '[DBNum1][$-804]m"月"d"日";@',
        "[$-409]yyyy/m/d h:mm AM/PM;@",
        'yyyy"年"m"月"d"日";@',
        'yyyy"年"m"月";@',
        'm"月"d"日";@',
        "mm/dd/yy;@",
        "m/d/yy;@",
        "yyyy/m/d h:mm AM/PM;@",
        "yyyy/m/d h:mm;@",
        "[$-409]d-mmm;@",
        "[$-409]d-mmm-yy;@",
        "[$-409]dd-mmm-yy;@",
        "[$-409]mmm-yy;@",
        "[$-409]m",
        "[$-409]m-d;@"
    ];
    cn_res.koreanDateFormat = [
        "yyyy-mm-dd;@",
        'yyyy"년" m"월" d"일";@',
        'yy"年" m"月" d"日";@',
        'yyyy"년" m"월";@',
        'm"월" d"일";@',
        "yy-m-d;@",
        "yy-m-d h:mm;@",
        'm"月"d"日";@',
        "[$-412]yy-m-d AM/PM h:mm;@",
        "yy/m/d;@",
        "yyyy/m/d h:mm;@",
        "m/d;@",
        "m/d/yy;@",
        "mm/dd/yy;@",
        "[$-409]d-mmm;@",
        "[$-409]d-mmm-yy;@",
        "[$-409]dd-mmm-yy;@",
        "[$-409]mmm-yy;@",
        "[$-409]m",
        "[$-409]m-d;@"
    ];
    cn_res.japanWesternDateFormat = [
        'yyyy"年"m"月"d"日";@',
        'yyyy"年"m"月";@',
        'm"月"d"日";@',
        "yyyy/m/d;@",
        "[$-409]yyyy/m/d h:mm AM/PM;@",
        "yyyy/m/d h:mm;@",
        "m/d;@",
        "m/d/yy;@",
        "mm/dd/yy;@",
        "[$-409]d-mmm;@",
        "[$-409]d-mmm-yy;@",
        "[$-409]dd-mmm-yy;@",
        "[$-409]mmm-yy;@",
        "[$-409]mmmm-yy;@",
        "[$-409]mmmmm;@",
        "[$-409]mmmmm-yy;@"
    ];

    cn_res.japanEmperorReignDateFormat = [
        "[$-411]ge.m.d;@",
        '[$-411]ggge"年"m"月"d"日";@'
    ];

    cn_res.timeFormats = [
        "[$-409]h:mm:ss AM/PM",
        "h:mm;@",
        "[$-409]h:mm AM/PM;@",
        "h:mm:ss;@",
        "[$-409]h:mm:ss AM/PM;@",
        "mm:ss.0;@",
        "[h]:mm:ss;@",
        "[$-409]m/d/yy h:mm AM/PM;@",
        "m/d/yy h:mm;@"
    ];

    cn_res.chinaTimeFormats = [
        "h:mm;@",
        "[$-409]h:mm AM/PM;@",
        "h:mm:ss;@",
        'h"时"mm"分";@',
        'h"时"mm"分"ss"秒";@',
        '[$-804]AM/PM h"时"mm"分";;@',
        '[$-804]AM/PM h"时"mm"分"ss"秒";@',
        '[DBNum1][$-804]h"时"mm"分";@',
        '[DBNum1][$-804]AM/PM h"时"mm"分";@'
    ];
    cn_res.koreanTimeFormats = [
        "h:mm;@",
        "h:mm:ss;@",
        "[$-412]AM/PM h:mm;@",
        "[$-412]AM/PM h:mm:ss;@",
        "[$-409]h:mm AM/PM;@",
        "[$-409]h:mm:ss AM/PM;@",
        'yyyy"-"m"-"d h:mm;@',
        '[$-412]yyyy"-"m"-"d AM/PM h:mm;@',
        '[$-409]yyyy"-"m"-"d h:mm AM/PM;@',
        'h"시" mm"분";@',
        'h"시" mm"분" ss"초";@',
        '[$-412]AM/PM h"시" mm"분";@',
        '[$-412]AM/PM h"시" mm"분" ss"초";@'
    ];
    cn_res.japanTimeFormats = [
        "h:mm;@",
        "[$-409]h:mm AM/PM;@",
        "h:mm:ss;@",
        "[$-409]h:mm:ss AM/PM;@",
        "[$-409]yyyy/m/d h:mm AM/PM;@",
        "yyyy/m/d h:mm;@",
        'h"時"mm"分";@',
        'h"時"mm"分"ss"秒";@'
    ];

    cn_res.textFormats = [
        "@"
    ];

    cn_res.specialFormats = [
        "00000",
        "00000-0000",
        "[<=9999999]###-####;(###) ###-####",
        "000-00-0000"
    ];

    cn_res.specialJapanFormats = [
        "[<=999]000;[<=9999]000-00;000-0000",
        "[<=99999999]####-####;(00) ####-####",
        "'△' #,##0;'▲' #,##0",
        "[DBNum1][$-411]General",
        "[DBNum2][$-411]General",
        "[DBNum3][$-411]0",
        "[DBNum3][$-411]#,##0"
    ];

    cn_res.specialKoreanFormats = [
        "000-000",
        "[<=999999]####-####;(0##) ####-####",
        "[<=9999999]###-####;(0##) ###-####",
        "000000-0000000",
        "[DBNum1][$-412]General",
        "[DBNum2][$-412]General",
        "[$-412]General"
    ];
    cn_res.specialChinaFormats = [
        "000000",
        "[DBNum1][$-804]General",
        "[DBNum2][$-804]General"
    ];
    cn_res.currencyFormats = [
        "#,##0",
        "#,##0;[Red]#,##0",
        "#,##0;-#,##0",
        "#,##0;[Red]-#,##0"
    ];

    cn_res.percentageFormats = [
        "0%"
    ];

    cn_res.scientificFormats = [
        "0E+00"
    ];

    cn_res.accountingFormats = [
        "_(* #,##0_);_(* (#,##0);_(* \"-\"_);_(@_)",
        '_(* #,##0.00_);_(* (#,##0.00);_(* "-"_);_(@_)',
        ' $* #,##0.00 ; $* #,##0.00 ; $* "-" ; @ ',
        '_-[$¥-804]* #,##0.00_-;-[$¥-804]* #,##0.00_-;_-[$¥-804]* "-"_-;_-@_-',
        '_-[$¥-411]* #,##0.00_-;-[$¥-411]* #,##0.00_-;_-[$¥-411]* "-"_-;_-@_-',
        '_-[$₩-412]* #,##0.00_-;-[$₩-412]* #,##0.00_-;_-[$₩-412]* "-"_-;_-@_-'
    ];

    cn_res.customFormats = [
        "General",
        "0",
        "0.00",
        "#,##0",
        "#,##0.00",
        "#,##0;(#,##0)",
        "#,##0;[Red](#,##0)",
        "#,##0.00;(#,##0.00)",
        "#,##0.00;[Red](#,##0.00)",
        "$#,##0;($#,##0)",
        "$#,##0;[Red]($#,##0)",
        "$#,##0.00;($#,##0.00)",
        "$#,##0.00;[Red]($#,##0.00)",
        "0%",
        "0.00%",
        "0.00E+00",
        "##0.0E+0",
        "# ?/?",
        "# ??/??",
        "m/d/yyyy",
        "d-mmm-yy",
        "d-mmm",
        "mmm-yy",
        "h:mm AM/PM",
        "h:mm:ss AM/PM",
        "hh:mm",
        "hh:mm:ss",
        "m/d/yyyy hh:mm",
        "mm:ss",
        "mm:ss.0",
        "@",
        "[h]:mm:ss",
        "$ #,##0;$ (#,##0);$ \"-\";@",
        " #,##0; (#,##0); \"-\";@",
        "$ #,##0.00;$ (#,##0.00);$ \"-\"??;@",
        " #,##0.00; (#,##0.00); \"-\"??;@",
        "hh:mm:ss",
        "00000",
        "# ???/???",
        "000-00-0000",
        "dddd, mmmm dd, yyyy",
        "m/d;@",
        "[<=9999999]###-####;(###) ###-####",
        "# ?/8"
    ];

    cn_res.accountingSymbol = [
        ["无", null, null],
        ["$", "$", "en-US"],
        ["¥(Chinese)", "¥", "zh-cn"],
        ["¥(Japanese)", "¥", "ja-jp"],
        ["₩(Korean)", "₩", "ko-kr"]
    ];

    cn_res.specialType = [
        "Zip Code",
        "Zip Code + 4",
        "Phone Number",
        "Social Security Number"
    ];

    cn_res.specialJapanType = [
        "郵便番号",
        "電話番号（東京)",
        "正負記号 （+ = △; - = ▲)",
        "漢数字（十二万三千四百）",
        "大字 (壱拾弐萬参阡四百)",
        "全角 (１２３４５)",
        "全角 桁区切り（１２,３４５）"
    ];
    cn_res.specialKoreanType = [
        "우편 번호",
        "전화 번호 (국번 4자리)",
        "전화 번호 (국번 3자리)",
        "주민등록번호",
        "숫자(한자)",
        "숫자(한자-갖은자)",
        "숫자(한글)"
    ];
    cn_res.specialChinaType = [
        "邮政编码",
        "中文小写字母",
        "中文大写字母"
    ];

    cn_res.fractionType = [
        "分母为一位数(1/4)",
        "分母为两位数(21/25)",
        "分母为三位数(312/943)",
        "以2为分母(1/2)",
        "以4为分母(2/4)",
        "以8为分母(4/8)",
        "以16为分母(8/16)",
        "以10为分母(3/10)",
        "百分之几(30/100)"
    ];

    cn_res.negativeNumbers = {
        "-1234.10": "-1234.10",
        "red:1234.10": "1234.10",
        "(1234.10)": "(1234.10)",
        "red:(1234.10)": "(1234.10)"
    };

    cn_res.currencyNegativeNumbers = {
        "number1": "-1,234.10",
        "red:number2": "1,234.10",
        "number3": "-1,234.10",
        "red:number4": "-1,234.10"
    };

    cn_res.passwordDialog = {
        title: "密码",
        passwordLabel: "密码:"
    };
    cn_res.rowHeightDialog = {
        title: "行高",
        rowHeight: "行高:",
        exception: "行高必须为数字，或者是动态行高（“数字+*”，比如3*）。",
        exception2: "行高必须在0至9999999之间。"
    };

    cn_res.chart = {
        formatChartArea: "设置",
        properties: '属性',
        moveAndSizeWithCells: '大小和位置随单元格而变',
        moveButDoNotSizeWithCells: '大小固定，位置随单元格而变',
        locked: '锁定',
        color: '颜色',
        transparency: '透明',
        selectedOption: {
            series: '系列选项',
            dataPoints: "系列选项",
            chartArea: '图表选项',
            chartTitle: '标题选项',
            legend: '图例选项',
            label: '标签选项',
            plotArea: '绘图区选项',
            dataLabels: '标签选项',
            trendline: '趋势线选项',
            errorBar: '误差线选项',
            primaryCategory: '坐标轴选项',
            primaryValue: '坐标轴选项',
            primaryCategoryTitle: '标题选项',
            primaryValueTitle: '标题选项',
            primaryCategoryMajorGridLine: '主要网格线选项',
            primaryValueMajorGridLine: '主要网格线选项',
            primaryCategoryMinorGridLine: '次要网格线选项',
            primaryValueMinorGridLine: '次要网格线选项',
            primaryValueUnitsLabel: '标签选项',
            secondaryCategory: '坐标轴选项',
            secondaryValue: '坐标轴选项',
            secondaryCategoryTitle: '标题选项',
            secondaryValueTitle: '标题选项',
            secondaryCategoryMajorGridLine: '主要网格线选项',
            secondaryValueMajorGridLine: '主要网格线选项',
            secondaryCategoryMinorGridLine: '次要网格线选项',
            secondaryValueMinorGridLine: '次要网格线选项',
            secondaryValueUnitsLabel: '标签选项'
        },
        selectedText: {
            series: '系列',
            errorBar: '误差线',
            trendline: '趋势线',
            dataPoints: '数据点',
            chartArea: '图表区',
            chartTitle: '图表标题',
            legend: '图例',
            dataLabels: '数据标签',
            plotArea: '绘图区',
            primaryCategory: '水平（类别）轴',
            primaryValue: '垂直（值）轴',
            primaryCategoryTitle: '水平（类别）轴 标题',
            primaryValueTitle: '垂直（值）轴 标题',
            primaryCategoryMajorGridLine: '水平（类别）轴 主要网格线',
            primaryValueMajorGridLine: '垂直（值）轴 主要网格线',
            primaryCategoryMinorGridLine: '水平（类别）轴 次要网格线',
            primaryValueMinorGridLine: '垂直（值）轴 次要网格线',
            primaryValueUnitsLabel: '垂直 (值) 轴显示单位标签',
            secondaryCategory: '次坐标轴 水平（类别）轴',
            secondaryValue: '次坐标轴 垂直（值）轴',
            secondaryCategoryTitle: '次坐标轴 水平（类别）轴 标题',
            secondaryValueTitle: '次坐标轴 垂直（值）轴 标题',
            secondaryCategoryMajorGridLine: '次坐标轴 水平（类别）轴 主要网格线',
            secondaryValueMajorGridLine: '次坐标轴 垂直（值）轴 主要网格线',
            secondaryCategoryMinorGridLine: '次坐标轴 水平（类别）轴 次要网格线',
            secondaryValueMinorGridLine: '次坐标轴 垂直（值）轴 次要网格线',
            secondaryValueUnitsLabel: '次坐标轴 垂直(值)轴显示单位标签'
        },
        selectedRadarChartText: {
            primaryCategory: '雷达轴（值）轴',
        },
        selectedBarChartText: {
            primaryCategory: '垂直（类别）轴',
            primaryValue: '水平（值）轴',
            primaryCategoryTitle: '垂直（类别）轴 标题',
            primaryValueTitle: '水平（值）轴 标题',
            primaryCategoryMajorGridLine: '垂直（类别）轴 主要网格线',
            primaryValueMajorGridLine: '水平（值）轴 主要网格线',
            primaryCategoryMinorGridLine: '垂直（类别）轴 次要网格线',
            primaryValueMinorGridLine: '水平（值）轴 次要网格线',
            primaryValueUnitsLabel: '水平 (值) 轴显示单位标签',
            secondaryCategory: '次坐标轴 垂直（类别）轴',
            secondaryValue: '次坐标轴 水平（值）轴',
            secondaryCategoryTitle: '次坐标轴 垂直（类别）轴 标题',
            secondaryValueTitle: '次坐标轴 水平（值）轴 标题',
            secondaryCategoryMajorGridLine: '次坐标轴 垂直（类别）轴 主要网格线',
            secondaryValueMajorGridLine: '次坐标轴 水平（值）轴 主要网格线',
            secondaryCategoryMinorGridLine: '次坐标轴 垂直（类别）轴 次要网格线',
            secondaryValueMinorGridLine: '次坐标轴 水平（值）轴 次要网格线',
            secondaryValueUnitsLabel: '次坐标轴 水平(值) 轴显示单位标签'
        },
        formatChart: {
            dataSeries: ' 数据系列格式',
            errorBar: ' 误差线',
            trendline: ' 趋势线',
            dataPoints: ' 数据点',
            axis: ' 坐标轴格式',
            legend: ' 图例格式',
            dataLable: ' 数据标签格式',
            chartTitle: ' 图表标题格式',
            plotArea: ' 绘图区格式',
            chartArea: ' 图表区格式',
            unitsLabel: ' 显示单位标签'
        }
    };

    cn_res.chartSliderPanel = {
        tick: {
            cross: "交叉",
            inside: '内部',
            none: '无',
            outSide: '外部'
        },
        axisFormat: {
            General: "常规",
            Number: "数字",
            Currency: "货币",
            Accounting: "会计专用",
            Date: "日期",
            Time: "时间",
            Percentage: "百分比",
            Fraction: "分数",
            Scientific: "科学技术",
            Text: "文本",
            Special: "特殊格式",
            Custom: "自定义",
            Add: "添加",
            formatCode: "格式代码",
            category: "类别"
        },
        noLine: '无线条',
        solidLine: "实线",
        width: "宽度",
        fontFamily: "字体",
        fontSize: "字号",
        noFill: '无填充',
        solidFill: "纯色填充",
        auto: '自动',
        reset: '重置',
        automatic: '自动',
        custom: '自定义',
        color: '颜色',
        text: '文本',
        majorType: '主刻度线类型',
        minorType: '次刻度线类型',
        textAxis: '文本轴',
        dateAxis: '日期轴',
        unitsMajor: '单位（大）',
        unitsMinor: '单位（小）',
        maximum: '最大值',
        minimum: '最小值',
        height: '高度',
        top: '靠上',
        bottom: '靠下',
        left: '靠左',
        right: '靠右',
        topRight: '右上',
        primaryAxis: '主坐标轴',
        secondaryAxis: '次坐标轴',
        tickMarks: '刻度线',
        axisOptions: '坐标轴选项',
        line: '线条',
        font: '字体',
        textFill: '文本填充',
        textEditor: '文本编辑',
        size: '大小',
        fill: '填充',
        legendPosition: '图例位置',
        seriesOptions: '系列选项',
        border: '边框',
        transparency: '透明度',
        none: '无',
        builtIn: '内置',
        shape: '形状',
        lintType: '短划线类型',
        markOptions: '标记选项',
        markFill: '标记填充',
        markBorder: '标记边框',
        logarithmicScale: '对数刻度',
        logBase: '底数',
        dashStyle: '短划线类型',

        exponential: '指数',
        linear: '线性',
        logarithmic: '对数',
        polynomial: '多项式',
        power: '乘幂',
        movingAverage: '移动平均',
        verticalErroeBar: '垂直误差线',
        horizontalErrorBar: '水平误差线',
        both: '正负偏差',
        minus: '负偏差',
        plus: '正偏差',
        noCap: '无线端',
        cap: '线端',
        fixed: '固定值',
        percentage: '百分比',
        standardDev: '标准偏差',
        standardErr: '标准误差',
        specifyValue: '指定值',
        direction: '方向',
        endStyle: '末端样式',
        errorAmount: '误差量',

        bounds: "边界",
        units: "单位",

        displayUnits: "显示单位",
        displayUnit: {
            none: "无",
            hundreds: "百",
            thousands: "千",
            tenThousands: "10,000",
            hundredThousands: "100,000",
            millions: "百万",
            tenMillions: "10,000,000",
            hundredMillions: "100,000,000",
            billions: "十亿",
            trillions: "兆",
        },
        showDisplayUnitsLabel: "在图标上显示单位标签",

        trendline: {
            exponential: '指数',
            linear: '线形',
            logarithmic: '对数',
            polynomial: '多项式',
            power: '乘幂',
            movingAverage: '移动平均',
            name: "趋势线名称",
            forecast: "趋势预测",
            forward: "前推",
            backward: "后推",
            intercept: "设置截距",
            displayEquation: "显示公式",
            displayRSquared: "显示R平方",
        }
    };

    cn_res.moveChartDialog = {
        title: "移动图表",
        description: "选择放置图表的位置:",
        newSheet: "新工作表:",
        existingSheet: "对象位于:",
        errorPrompt: {
            sameSheetNameError: "此工作表已存在，您的图表就内嵌其中。请指定不同的工作表名称。"
        }
    };

    cn_res.selectChartDialog = {
        title: "插入图表",
        insertChart: "插入图表",
        changeChartType: "更改图表类型",
        defaultRowColumn: "默认行列布局",
        switchedRowColumn: "切换行列布局",
        column: "柱形图",
        columnClustered: "簇状柱形图",
        columnStacked: "堆积柱形图",
        columnStacked100: "百分比堆积柱形图",
        line: "折线图",
        lineStacked: "堆积折线图",
        lineStacked100: '百分比堆积折线图',
        lineMarkers: "带数据标记的折线图",
        lineMarkersStacked: "带标记的堆积折线图",
        lineMarkersStacked100: "带数据标记的百分比堆积折线图",
        pie: "饼图",
        doughnut: "圆环图",
        bar: "条形图",
        area: "面积图",
        XYScatter: "X Y散点图",
        stock: "股价图",
        combo: "组合",
        radar: "雷达图",
        sunburst: "旭日图",
        treemap: "树状图",
        barClustered: "簇状条形图",
        barStacked: "堆积条形图",
        barStacked100: "百分比堆积条形图",
        areaStacked: "堆积面积图",
        areaStacked100: "百分比堆积面积图",
        xyScatter: "散点图",
        xyScatterSmooth: "带平滑线和数据标记的散点图",
        xyScatterSmoothNoMarkers: "带平滑线的散点图",
        xyScatterLines: "带直线和数据标记的散点图",
        xyScatterLinesNoMarkers: "带直线的散点图",
        bubble: "气泡图",
        stockHLC: "盘高-盘低-收盘图",
        stockOHLC: "开盘-盘高-盘低-收盘图",
        stockVHLC: "成交量-盘高-盘低-收盘图",
        stockVOHLC: "成交量-开盘-盘高-盘低-收盘图",
        columnClusteredAndLine: "簇状柱形图 - 折线图",
        columnClusteredAndLineOnSecondaryAxis: "簇状柱形图 - 次坐标轴上的折线图",
        stackedAreaAndColumnClustered: "堆积面积图 - 簇状柱形图",
        customCombination: "自定义组合",
        radarMarkers: "带数据标记的雷达图",
        radarFilled: "填充雷达图",
        seriesModifyDescription: "为您的数据系列选择图标类型和轴:",
        seriesName: "系列名称",
        chartType: "图表类型",
        secondaryAxis: "次坐标轴",
        errorPrompt: {
            stockHLCErrorMsg: "若要创建此股价图，请按如下顺序安排工作表中的数据:最高价-盘低-收盘价。使用日期作为标签。",
            stockOHLCErrorMsg: "若要创建此股价图，请按如下顺序安排工作表中的数据:开盘价-盘高-盘低-收盘价。使用日期作为标签。",
            stockVHLCErrorMsg: "若要创建此股价图，请按如下顺序安排工作表中的数据:成交量-盘高-盘低-收盘价。使用日期作为标签。",
            stockVOHLCErrorMsg: "若要创建此股价图，请按如下顺序安排工作表中的数据:成交量-开盘价-盘高-盘低-收盘价。使用日期作为标签。",
            emptyDataErrorMsg: "要创建图表，请选择包含您想要使用的数据的单元格。如果行和列具有名称，并且您想要将它们用做标签，请将它们包含在所选内容中。",
            unexpectedErrorMsg: "发生了未知错误，请您重试一次。如果还不能成功，请联系我们的售后部门。"
        }
    };

    cn_res.columnWidthDialog = {
        title: "列宽",
        columnWidth: "列宽:",
        exception: "列宽必须为数字，或者是动态行高（“数字+*”，比如3*）。",
        exception2: "列宽必须在0至9999999之间。"
    };
    cn_res.standardWidthDialog = {
        title: "标准列宽",
        columnWidth: "标准列宽:",
        exception: "输入不正确。要求输入内容为整数或小数。"
    };
    cn_res.standardHeightDialog = {
        title: "标准行高",
        rowHeight: "标准行高:",
        exception: "输入不正确。要求输入内容为整数或小数。"
    };
    cn_res.insertCellsDialog = {
        title: "插入",
        shiftcellsright: "活动单元格右移",
        shiftcellsdown: "活动单元格下移",
        entirerow: "整行",
        entirecolumn: "整列"
    };
    cn_res.deleteCellsDialog = {
        title: "删除",
        shiftcellsleft: "右侧单元格左移",
        shiftcellsup: "下方单元格上移",
        entirerow: "整行",
        entirecolumn: "整列"
    };
    cn_res.groupDialog = {
        title: "创建组",
        rows: "行",
        columns: "列"
    };
    cn_res.ungroupDialog = {
        title: "取消组合"
    };
    cn_res.subtotalDialog = {
        title: "分类汇总",
        remove: "删除",
        groupNameSelectionLabel: "分类字段：",
        subtotalFormulaItemLabel: "汇总方式：",
        subtotalFormulaSum: "求和",
        subtotalFormulaCount: "计数",
        subtotalFormulaAverage: "平均值",
        subtotalFormulaMax: "最大值",
        subtotalFormulaMin: "最小值",
        subtotalFormulaProduct: "乘积",
        addSubtotalColumnItem: "选定汇总项：",
        replaceCurrent: "替换当前分类汇总",
        breakPageByGroups: "每组数据分页",
        summaryBelowData: "汇总结果显示在数据下方"
    };
    cn_res.findDialog = {
        title: "查找",
        findwhat: "查找内容:",
        within: "范围:",
        matchcase: "区分大小写",
        search: "搜索:",
        matchexactly: "单元格匹配",
        lookin: "查找范围:",
        usewildcards: "使用通配符",
        option: "选项",
        findall: "查找全部",
        findnext: "查找下一个",
        exception: "无法找到您所查找的内容。"
    };
    cn_res.gotoDialog = {
        title: "定位",
        goto: "定位:",
        reference: "引用位置:",
        exception: "您输入的引用无效或名称为定义。",
        wrongName: "操作执行失败。"
    };
    cn_res.richTextDialog = {
        title: '富文本编辑框',
        fontFamilyTitle: '字体',
        fontSizeTitle: '字号',
        boldTitle: '粗体',
        italicTitle: '斜体',
        underlineTitle: '下划线',
        strikethroughTitle: '删除线',
        colorPickerTitle: '字体颜色',
        superScriptTitle: '上标',
        subScriptTitle: '下标'
    };
    cn_res.nameManagerDialog = {
        title: "名称管理器",
        newName: "新建...",
        edit: "编辑...",
        deleteName: "删除",
        filterWith: {
            title: "筛选:",
            clearFilter: "清除筛选",
            nameScopedToWorkbook: "名称扩展到工作簿范围",
            nameScopedToWorksheet: "名称扩展到工作表范围",
            nameWithErrors: "有错误的名称",
            nameWithoutErrors: "没有错误的名称"
        },
        nameColumn: "名称",
        valueColumn: "数值",
        refersToColumn: "引用位置",
        scopeColumn: "范围",
        commentColumn: "批注",
        exception1: "输入的名称无效。",
        exception2: "输入的名称已经存在。请输入唯一的名称。",
        deleteAlert: "是否确实删除名称{0}?"
    };
    cn_res.newNameDialog = {
        titleNew: "新建名称",
        titleEdit: "编辑名称",
        name: "名称:",
        scope: {
            title: "范围:",
            workbook: "工作薄"
        },
        referTo: "引用位置:",
        comment: "批注:",
        wrongName: "输入的名称无效（非法名称或者与其他名称冲突）"
    };
    cn_res.insertFunctionDialog = {
        title: "插入函数",
        functionCategory: "函数类别:",
        functionList: "选择函数:",
        formula: "公式:",
        functionCategorys: "全部,数据库,日期与时间,工程,财务,信息,逻辑,查找与引用,数学与三角函数,统计,文本"
    };
    cn_res.buttonCellTypeDialog = {
        title: "按钮",
        marginGroup: "边距:",
        left: "左:",
        top: "上:",
        right: "右:",
        bottom: "下:",
        text: "文本:",
        backcolor: "背景色:",
        other: "其他:"
    };
    cn_res.checkBoxCellTypeDialog = {
        title: "复选框",
        textGroup: "文字:",
        "true": "已选择:",
        indeterminate: "不确定:",
        "false": "未选择:",
        align: "对齐:",
        other: "其他:",
        caption: "标题:",
        isThreeState: "三态",
        checkBoxTextAlign: {
            top: "靠上",
            bottom: "靠下",
            left: "靠左",
            right: "靠右"
        }
    };
    cn_res.comboBoxCellTypeDialog = {
        title: "组合框",
        editorValueTypes: "编辑值类型:",
        items: "项目:",
        itemProperties: "项目属性:",
        text: "文本:",
        value: "值:",
        add: "添加",
        remove: "删除",
        editorValueType: {
            text: "文本",
            index: "索引",
            value: "值"
        },
        editable: "可编辑",
        itemHeight: "项目高度"
    };
    cn_res.hyperLinkCellTypeDialog = {
        title: "超链接",
        link: "链接:",
        visitedlink: "已访问:",
        text: "文本:",
        linktooltip: "屏幕提示:",
        color: "颜色:",
        other: "其他:"
    };
    cn_res.checkListCellTypeDialog = {
        title1: "复选框列表单元格类型",
        title2: "单选框列表单元格类型",
        direction: "方向:",
        horizontal: "横向",
        vertical: "竖向",
        items: "项目:",
        itemProperties: "项目属性:",
        text: "文字:",
        value: "值:",
        add: "添加",
        remove: "删除",
        isWrap: "使用流式布局",
        rowCount: "行数:",
        colCount: "列数:",
        vSpace: "竖向间距:",
        hSpace: "横向间距:",
        textAlign: "文本对齐:",
        checkBoxTextAlign: {
            left: "靠左",
            right: "靠右"
        },
        exception: "请向单元格类型添加项目。"
    };
    cn_res.buttonListCellTypeDialog = {
        title: "按钮列表单元格类型",
        backColor: "背景色:",
        foreColor: "前景色:",
        marginGroup: "外边距:",
        left: "左:",
        top: "上:",
        right: "右:",
        bottom: "下:",
        selectMode: "选择模式:",
        singleSelect: "单选",
        multiSelect: "多选",
        exception: "请向单元格类型添加项目。"
    };
    cn_res.headerCellsDialog = {
        title: "标题单元格",
        rowHeader: "行标题",
        columnHeader: "列标题",
        backColor: "背景色",
        borderBottom: "下边框",
        borderLeft: "左边框",
        borderRight: "右边框",
        borderTop: "上边框",
        diagonalUp: "向上对角线",
        diagonalDown: "向下对角线",
        font: "字体",
        foreColor: "前景色",
        formatter: "格式",
        hAlign: "垂直对齐方式",
        height: "高度",
        locked: "锁定",
        resizable: "可调整大小",
        shrinkToFit: "缩小字体填充",
        value: "值",
        textIndent: "缩进",
        vAlign: "垂直对齐",
        visible: "可见",
        width: "宽度",
        wordWrap: "自动换行",
        popUp: "...",
        merge: "合并单元格",
        unmerge: "取消单元格合并",
        insertRows: "插入行",
        addRows: "添加行",
        deleteRows: "删除行",
        insertColumns: "插入列",
        addColumns: "添加列",
        deleteColumns: "删除列",
        clear: "清除",
        top: '靠上',
        bottom: '靠下',
        left: '靠左',
        right: '靠右',
        center: '居中',
        general: '常规',
        verticalText: "竖排文字",
        exception: "设定不合法。请检查红色区域。"
    };
    cn_res.fontPickerDialog = {
        title: "字体"
    };
    cn_res.fillDialog = {
        title: "系列"
    };

    cn_res.zoomDialog = {
        title: "缩放",
        double: "200%",
        normal: "100%",
        threeFourths: "75%",
        half: "50%",
        quarter: "25%",
        fitSelection: "调整为合适大小",
        custom: "自定义:",
        exception: "输入不正确。要求输入内容为整数或小数。",
        magnification: "放大",
        percent: "%"
    };
    cn_res.contextMenu = {
        cut: "剪切",
        copy: "复制",
        paste: "粘贴选项:",
        pasteAll: '全部粘贴',
        pasteFormula: '仅粘贴公式',
        pasteValue: '仅粘贴值',
        pasteFormatting: '仅粘贴格式',
        insertDialog: "插入...",
        deleteDialog: "删除...",
        clearcontents: "清除内容",
        filter: "筛选",
        sort: "排序",
        table: "表",
        totalRow: "汇总行",
        toTange: "转换为区域",
        sortAToZ: "升序",
        sortZToA: "降序",
        customSort: "自定排序...",
        formatCells: "设置单元格格式...",
        editCellType: "设置单元格类型...",
        editCellDropdows: "设置单元格下拉框...",
        richText: "编辑富文本...",
        defineName: "定义名称...",
        tag: "标签...",
        rowHeight: "行高...",
        columnWidth: "列宽...",
        hide: "隐藏",
        unhide: "取消隐藏",
        headers: "标题...",
        insert: "插入",
        "delete": "删除",
        tableInsert: "插入",
        tableInsertRowsAbove: "在上方插入表行(A)",
        tableInsertRowsBelow: "在下方插入表行(B)",
        tableInsertColumnsLeft: "在左侧插入表列(L)",
        tableInsertColumnsRight: "在右侧插入表列(R)",
        tableDelete: "删除",
        tableDeleteRows: "表行(R)",
        tableDeleteColumns: "表列(C)",
        protectsheet: "保护工作表...",
        unprotectsheet: "取消工作表保护...",
        comments: "工作簿内至少含一张可视工作表。",
        insertComment: "插入批注",
        editComment: "编辑批注",
        deleteComment: "删除批注",
        hideComment: "隐藏批注",
        editText: "编辑文字",
        exitEditText: "退出文本编辑",
        formatComment: "格式化批注...",
        unHideComment: "显示/隐藏批注",
        sheetTabColor: "工作表标签颜色",
        remove: "删除",
        slicerProperty: "大小和属性...",
        slicerSetting: "切片器设置...",
        changeChartType: "更改图表类型...",
        selectData: "选择数据...",
        moveChart: "移动图表...",
        resetChartColor: "重设以匹配样式",
        formatChart: {
            chartArea: "设置绘图区格式...",
            series: "设置数据系列格式...",
            axis: "设置坐标轴格式...",
            legend: "设置图例格式...",
            dataLabels: "设置数据标签格式...",
            chartTitle: "设置图表标题格式...",
            trendline: "设置趋势线...",
            errorBar: "设置误差线...",
            unitsLabel: "设置显示单元...",
        },
        groupShapes: '组合',
        ungroupShapes: '取消组合',
        pasteShape: '粘贴',
        formatShapes: '设置形状格式...',
        pasteValuesFormatting: '粘贴值和格式',
        pasteFormulaFormatting: '粘贴公式和格式',
        outlineColumn: '分组列...'
    };
    cn_res.tagDialog = {
        cellTagTitle: "单元格标签",
        rowTagTitle: "行标签",
        columnTagTitle: "列标签",
        sheetTagTitle: "表单标签",
        tag: "Tag:"
    };
    cn_res.borderPicker = {
        lineStyleTitle: "线条:",
        borderColorTitle: "颜色:",
        none: "无"
    };
    cn_res.borderDialog = {
        border: "边框",
        presets: "预置",
        none: "无",
        outline: "外边框",
        inside: "内部",
        line: "边框",
        text: "文本",
        comments: "单击预置选项，预览草图及上面的按钮可以添加边框样式。"
    };

    cn_res.conditionalFormat = {
        highlightCellsRules: "突出显示单元格规则",
        topBottomRules: "项目选取规则",
        dataBars: "数据条",
        colorScales: "色阶",
        iconSets: "图标集",
        newRule: "新建规则...",
        clearRules: "清除规则...",
        manageRules: "管理规则...",
        greaterThan: "大于...",
        lessThan: "小于...",
        between: "介于...",
        equalTo: "等于...",
        textThatContains: "文本包含...",
        aDateOccurring: "发生日期...",
        duplicateValues: "重复值...",
        moreRules: "其他规则...",
        top10Items: "值最大的10项...",
        bottom10Items: "值最小的10项...",
        aboveAverage: "高于平均值...",
        belowAverage: "低于平均值...",
        gradientFill: "渐变填充",
        solidFill: "实心填充",
        directional: "方向",
        shapes: "形状",
        indicators: "标记",
        ratings: "等级",
        clearRulesFromSelectedCells: "清除所选单元格的规则",
        clearRulesFromEntireSheet: "清除整个工作表的规则"
    };

    cn_res.fileMenu = {
        new: "新建",
        open: "打开",
        save: "保存",
        saveAs: "另存为",
        export: "导出",
        import: "导入",
        exit: "关闭",
        recentWorkbooks: "最近使用的工作薄",
        computer: "计算机",
        currentFolder: "当前文件夹",
        recentFolders: "最近使用的文件夹",
        browse: "浏览",
        spreadSheetJsonFile: "SpreadSheet 文件(JSON)",
        excelFile: "Excel文件",
        csvFile: "CSV文件",
        pdfFile: "PDF文件",
        importSpreadSheetFile: "导入 SSJSON 文件",
        importExcelFile: "导入 Excel 文件",
        importCsvFile: "导入 CSV 文件",
        exportSpreadSheetFile: "导出 SSJSON 文件",
        exportExcelFile: "导出 Excel 文件",
        exportCsvFile: "导出 CSV 文件",
        exportPdfFile: "导出 PDF 文件",
        exportJSFile: "导出 Javascript 文件",
        openFlags: "打开选项",
        importIgnoreStyle: '只导入数据',
        importIgnoreFormula: '不导入公式',
        importDoNotRecalculateAfterLoad: "导入后不自动计算公式",
        importRowAndColumnHeaders: "导入作为标题的冻结列和行",
        importRowHeaders: "导入作为列标题的冻结行",
        importColumnHeaders: "导入作为行标题的冻结列",
        importPassword: "密码",
        importIncludeRowHeader: "导入行标题",
        importIncludeColumnHeader: "导入列标题",
        importUnformatted: "保留没有格式化的数据",
        importImportFormula: "导入单元格公式",
        importRowDelimiter: "行分隔符",
        importColumnDelimiter: "列分隔符",
        importCellDelimiter: "单元格分隔符",
        importEncoding: "文件编码",
        saveFlags: "保存选项",
        exportIgnoreStyle: "只导出数据",
        exportIgnoreFormulas: "不导出公式",
        exportAutoRowHeight: "行高自动调整",
        exportSaveAsFiltered: "作为过滤导出",
        exportSaveAsViewed: "作为预览导出",
        exportSaveBothCustomRowAndColumnHeaders: "将行标题和列标题作为Excel的冻结列和冻结行导出",
        exportSaveCustomRowHeaders: "将行标题作为Excel的冻结列导出",
        exportSaveCustomColumnHeaders: "将列标题作为Excel的冻结行导出",
        exportPassword: "密码",
        exportIncludeRowHeader: "包含行标题",
        exportIncludeColumnHeader: "包含列标题",
        exportUnFormatted: "不包含任何样式信息",
        exportFormula: "包含公式",
        exportAsViewed: "作为预览导出",
        exportSheetIndex: "工作表索引",
        exportEncoding: "编码",
        exportRow: "行索引",
        exportColumn: "列索引",
        exportRowCount: "行数",
        exportColumnCount: "列数",
        exportRowDelimiter: "行分隔符",
        exportColumnDelimiter: "列分隔符",
        exportCellDelimiter: "单元格分隔符",
        exportVisibleRowCol: "只包含可见行和可见列",
        pdfBasicSetting: "基本设定",
        pdfTitle: "标题:",
        pdfAuthor: "作者:",
        pdfApplication: "应用程序:",
        pdfSubject: "主题:",
        pdfKeyWords: "关键字:",
        pdfExportSetting: "导出设定",
        exportSheetLabel: "选择要导出的工作表:",
        allSheet: "全部",
        pdfDisplaySetting: "显示设定",
        centerWindowLabel: "置于窗口中心",
        showTitleLabel: "显示标题",
        showToolBarLabel: "显示工具条",
        fitWindowLabel: "最适化窗口",
        showMenuBarLabel: "显示菜单栏",
        showWindowUILabel: "显示窗口界面",
        destinationTypeLabel: "目标类型:",
        destinationType: {
            autoDestination: "自动",
            fitPageDestination: "页面自适应",
            fitWidthDestination: "宽度自适应",
            fitHeightDestination: "高度自适应",
            fitBoxDestination: "盒子自适应"
        },
        openTypeLabel: "打开类型:",
        openType: {
            autoOpen: "自动",
            useNoneOpen: "未使用",
            useOutlinesOpen: "使用目录",
            useThumbsOpen: "使用缩图",
            fullScreenOpen: "全屏",
            useOCOpen: "使用 OC",
            useAttachmentsOpen: "使用附件"
        },
        pdfPageSetting: "页面设定",
        openPageNumberLabel: "打开页码:",
        pageLayoutLabel: "页面布局:",
        pageLayout: {
            autoLayout: "自动",
            singlePageLayout: "单页",
            oneColumnLayout: "单栏",
            twoColumnLeftLayout: "左侧两列",
            twoColumnRightLayout: "右侧两列",
            twoPageLeftLayout: "左侧两页",
            twoPageRight: "右侧两页"
        },
        pageDurationLabel: "页面范围:",
        pageTransitionLabel: "页面过渡:",
        pageTransition: {
            defaultTransition: "默认",
            splitTransition: "劈裂",
            blindsTransition: "百叶窗",
            boxTransition: "方格",
            wipeTransition: "掀开",
            dissolveTransition: "融化",
            glitterTransition: "闪烁",
            flyTransition: "飞入",
            pushTransition: "推入",
            coverTransition: "盖上",
            uncoverTransition: "揭开",
            fadeTransition: "淡出"
        },
        printerSetting: "打印机设定...",
        printerSettingDialogTitle: "打印机设定",
        copiesLabel: "份数:",
        scalingTypeLabel: "缩放类型:",
        scalingType: {
            appDefaultScaling: "程序默认",
            noneScaling: "无"
        },
        duplexModeLabel: "双面模式:",
        duplexMode: {
            defaultDuplex: "默认",
            simplexDuplex: "简单",
            duplexFlipShortEdge: "翻转短边",
            duplexFlipLongEdge: "翻转长边"
        },
        choosePaperSource: "通过pdf页面大小选择纸张源",
        printRanges: "打印范围",
        indexLabel: "索引",
        countLabel: "数量",
        addRange: "添加",
        removeRange: "删除",
        addRangeException: "值不合法，索引必须大于等于0，数量必须大于0。",
        noRecentWorkbooks: "最近没有打开任何工作薄。请先打开一个浏览工作薄。",
        noRecentFolders: "最近没有打开任何文件夹。请先打开一个浏览工作薄。"
    };

    cn_res.formatTableStyle = {
        name: "名称:",
        tableElement: "表元素:",
        preview: "预览",
        format: "格式",
        tableStyle: "表样式",
        clear: "清除",
        stripeSize: "条纹大小",
        light: "浅色",
        medium: "中等深浅",
        dark: "深色",
        newTableStyle: "新建表格样式...",
        clearTableStyle: "清除",
        custom: "自定义",
        exception: "此样式名已经存在。",
        title: "SpreadJS 设计器"
    };
    cn_res.tableElement = {
        wholeTableStyle: "整个表",
        firstColumnStripStyle: "第一列条纹",
        secondColumnStripStyle: "第二列条纹",
        firstRowStripStyle: "第一行条纹",
        secondRowStripStyle: "第二行条纹",
        highlightLastColumnStyle: "最后一列",
        highlightFirstColumnStyle: "第一列",
        headerRowStyle: "标题行",
        footerRowStyle: "汇总行",
        firstHeaderCellStyle: "第一个标题单元格",
        lastHeaderCellStyle: "最后一个标题单元格",
        firstFooterCellStyle: "第一个汇总单元格",
        lastFooterCellStyle: "最后一个汇总单元格"
    };
    cn_res.conditionalFormatting = {
        common: {
            'with': "设置为",
            selectedRangeWith: "针对选定区域，设置为",
            and: "与"
        },
        greaterThan: {
            title: "大于",
            description: "为大于以下值的单元格设置格式:"
        },
        lessThan: {
            title: "小于",
            description: "为小于以下值的单元格设置格式:"
        },
        between: {
            title: "介于",
            description: "为介于以下值之间的单元格设置格式:"
        },
        equalTo: {
            title: "等于",
            description: "为等于以下值的单元格设置格式:"
        },
        textThatCotains: {
            title: "文本中包含",
            description: "为包含以下文本的单元格设置格式:"
        },
        dateOccurringFormat: {
            title: "发生日期",
            description: "为包含以下日期的单元格设置格式:",
            date: {
                yesterday: "昨天",
                today: "今天",
                tomorrow: "明天",
                last7days: "最近7天",
                lastweek: "上周",
                thisweek: "本周",
                nextweek: "下周",
                lastmonth: "上个月",
                thismonth: "本月",
                nextmonth: "下个月"
            }
        },
        duplicateValuesFormat: {
            title: "重复值",
            description: "为包含以下类型值的单元格设置格式:",
            type: {
                duplicate: "重复",
                unique: "唯一"
            },
            valueswith: "值"
        },
        top10items: {
            title: "前10项",
            description: "为值最大的那些单元格设置单元格:"
        },
        bottom10items: {
            title: "最后10项",
            description: "为值最小的那些单元格设置格式:"
        },
        aboveAverage: {
            title: "高于平均值",
            description: "为高于平均值的单元格设置格式:"
        },
        belowAverage: {
            title: "低于平均值",
            description: "为低于平均值的单元格设置格式:"
        },
        newFormattingRule: {
            title: "新建格式规则",
            title2: "编辑格式规则",
            description1: "选择规则类型:",
            description2: "编辑规则说明:",
            ruleType: {
                formatOnValue: "►基于各自值设置所有单元格的格式",
                formatContain: "►只为包含以下内容的单元格设置格式",
                formatRankedValue: "►仅对排名靠前或靠后的数值设置格式",
                formatAbove: "►仅对高于或低于平均值的数值设置格式",
                formatUnique: "►仅对唯一值或重复值设置格式",
                useFormula: "►使用公式确定要设置格式的单元格"
            },
            formatOnValue: {
                description: "基于各自值设置所有单元格的格式:",
                formatStyle: "格式样式:",
                formatStyleSelector: {
                    color2: "双色刻度",
                    color3: "三色刻度",
                    dataBar: "数据条",
                    iconSets: "图标集"
                },
                color2: {
                    min: "最小值",
                    max: "最大值",
                    type: "类型:",
                    value: "值:",
                    color: "颜色:",
                    preview: "预览",
                    minSelector: {
                        lowest: "最低值"
                    },
                    maxSelector: {
                        highest: "最高值"
                    }
                },
                color3: {
                    mid: "中间值"
                },
                dataBar: {
                    showBarOnly: "仅显示数据条",
                    auto: "自动",
                    description2: "条形图外观:",
                    fill: "填充",
                    color: "颜色",
                    border: "边框",
                    fillSelector: {
                        solidFill: "实心填充",
                        gradientFill: "渐变填充"
                    },
                    borderSelector: {
                        noBorder: "无边框",
                        solidBorder: "实心边框"
                    },
                    negativeBtn: "负值和坐标轴...",
                    barDirection: "条形图方向:",
                    barDirectionSelector: {
                        l2r: "从左到右",
                        r2l: "从右到左"
                    },
                    preview: "预览",
                    negativeDialog: {
                        title: "负值和坐标轴设置",
                        group1: {
                            title: "负值条形图填充颜色",
                            fillColor: "填充颜色:",
                            apply: "应用与正值条形图相同的填充颜色"
                        },
                        group2: {
                            title: "负值条形图边框颜色",
                            borderColor: "边框颜色:",
                            apply: "应用与正值条形图相同的边框颜色"
                        },
                        group3: {
                            title: "坐标轴设置",
                            description: "选择单元格的坐标轴位置可更改负值条形图的外观",
                            radio: {
                                auto: "自动(基于负值显示在可变位置)",
                                cell: "单元格中点值",
                                none: "无(按正值条形图的相同方向显示负值条形图)"
                            },
                            axisColor: "坐标轴颜色:"
                        }
                    }
                },
                iconSets: {
                    iconStyle: "图标样式:",
                    showIconOnly: "仅显示图标",
                    reverseIconOrder: "反转图标次序",
                    display: "根据以下规则显示各个图标:",
                    icon: "图标",
                    value: "值",
                    type: "类型",
                    description1: "当值是",
                    description2: "当 < ",
                    operator: {
                        largeOrEqu: "> =",
                        large: ">"
                    },
                    customIconSet: "自定义",
                    noCellIcon: "无单元格图标"
                },
                commonSelector: {
                    num: "数字",
                    percent: "百分比",
                    formula: "公式",
                    percentile: "百分点值"
                }
            },
            formatContain: {
                description: "只为满足以下条件的单元格设置格式:",
                type: {
                    cellValue: "单元格值",
                    specificText: "特定文本",
                    dateOccurring: "发生日期",
                    blanks: "空值",
                    noBlanks: "无空值",
                    errors: "错误",
                    noErrors: "无错误"
                },
                operator_cellValue: {
                    between: "介于",
                    notBetween: "未介于",
                    equalTo: "等于",
                    notEqualTo: "不等于",
                    greaterThan: "大于",
                    lessThan: "小于",
                    greaterThanOrEqu: "大于或等于",
                    lessThanOrEqu: "小于或等于"
                },
                operator_specificText: {
                    containing: "包含",
                    notContaining: "不包含",
                    beginningWith: "始于",
                    endingWith: "止于"
                }
            },
            formatRankedValue: {
                description: "为以下排名内的值设置格式:",
                type: {
                    top: "前",
                    bottom: "后"
                }
            },
            formatAbove: {
                description: "为满足以下条件的值设置格式:",
                type: {
                    above: "高于",
                    below: "低于",
                    equalOrAbove: "等于或高于",
                    equalOrBelow: "等于或低于",
                    std1Above: "标准偏差高于 1",
                    std1Below: "标准偏差低于 1",
                    std2Above: "标准偏差高于 2",
                    std2Below: "标准偏差低于 2",
                    std3Above: "标准偏差高于 3",
                    std3Below: "标准偏差低于 3"
                },
                description2: "选定范围的平均值"
            },
            formatUnique: {
                description: "全部设置格式:",
                type: {
                    duplicate: "重复",
                    unique: "唯一"
                },
                description2: "选定范围中的数值"
            },
            useFormula: {
                description: "为符合此公式的值设置格式:"
            },
            preview: {
                description: "预览:",
                buttonText: "格式...",
                noFormat: "未设定格式",
                hasFormat: "AaBbCcYyZz"
            }
        },
        withStyle: {
            lightRedFill_DarkRedText: "浅红填充色深红色文本",
            yellowFill_DrakYellowText: "黄填充色深黄色文本",
            greenFill_DarkGreenText: "绿填充色深绿色文本",
            lightRedFill: "浅红色填充",
            redText: "红色文本",
            redBorder: "红色边框",
            customFormat: "自定义格式..."
        },
        exceptions: {
            e1: "输入值不是有效的数字、日期、时间或字符串。",
            e2: "输入值。",
            e3: "输入在1和1000之间的整数。",
            e4: "输入值不能为空。",
            e5: "不能在条件格式公式中直接引用工作表区域。\n请将引用更改为对单个单元格的引用，或使用工作表函数进行引用，如 = SUM(A1:E5)。",
            e6: "公式规则的源范围只能是单一范围!"
        }
    };

    cn_res.formattingRulesManagerDialog = {
        title: "条件格式规则管理器",
        rulesScopeLabel: "显示其格式规则: ",
        rulesScopeForSelection: "当前选择",
        rulesScopeForWorksheet: "当前工作表",
        newRule: "新建规则...",
        editRule: "编辑规则...",
        deleteRule: "删除规则...",
        gridTitleRule: "规则(按所示顺序应用)",
        gridTitleFormat: "格式",
        gridTitleAppliesTo: "应用于",
        gridTitleStopIfTrue: "如果为真则停止",
        ruleDescriptions: {
            valueBetween: '单元格值介于{0}和{1}之间',
            valueNotBetween: '单元格值不介于{0}和{1}之间',
            valueEquals: '单元格值 = {0}',
            valueNotEquals: '单元格值 <> {0}',
            valueGreateThan: '单元格值 > {0}',
            valueGreateThanOrEquals: '单元格值 >= {0}',
            valueLessThan: '单元格值 < {0}',
            valueLessThanOrEquals: '单元格值 <= {0}',
            valueContains: '单元格值包含 "{0}"',
            valueNotContains: '单元格值不包含 "{0}"',
            valueBeginsWith: '单元格值开头是 "{0}"',
            valueEndsWith: '单元格值结尾是 "{0}"',
            last7Days: '最近 7 天',
            lastMonth: '上月',
            lastWeek: '上周',
            nextMonth: '下月',
            nextWeek: '下周N',
            thisMonth: '本月',
            thisWeek: '本周',
            today: '今天',
            tomorrow: '明天',
            yesterday: '昨天',
            duplicateValues: '重复值',
            uniqueValues: '唯一值',
            top: '前 {0}个',
            bottom: '后 {0}个',
            above: '高于平均值',
            above1StdDev: '标准偏差高于平均值1',
            above2StdDev: '标准偏差高于平均值2',
            above3StdDev: '标准偏差高于平均值3',
            below: '低于平均值',
            below1StdDev: '标准偏差低于平均值1',
            below2StdDev: '标准偏差低于平均值2',
            below3StdDev: '标准偏差低于平均值3',
            equalOrAbove: '等于或高于平均值',
            equalOrBelow: '等于或低于平均值',
            dataBar: '数据条',
            twoScale: '渐变颜色刻度',
            threeScale: '渐变颜色刻度',
            iconSet: '图标集',
            formula: '公式: {0}'
        },
        previewText: 'AaBbCcYyZz'
    };

    cn_res.cellStylesDialog = {
        cellStyles: "单元格样式",
        custom: "自定义",
        cellButtonStyleTitle: "颜色，日期以及其他单元格样式",
        goodBadAndNeutral: "好、差和适中",
        dataAndModel: "数据和模型",
        titlesAndHeadings: "标题",
        themedCellStyle: "主题单元格样式",
        numberFormat: "数字格式",
        cellButtonsStyles: {
            "colorpicker-cellbutton": "颜色",
            "datetimepicker-cellbutton": "日期",
            "timepicker-cellbutton": "时间",
            "calculator-cellbutton": "计算器",
            "monthpicker-cellbutton": "月份",
            "slider-cellbutton": "滑块",
            "okcancel-cellbutton": "确定取消",
            "clear-cellbutton": "清除"
        },
        goodBadAndNeutralContent: {
            "Normal": "常规",
            "Bad": "差",
            "Good": "好",
            "Neutral": "适中"
        },
        dataAndModelContent: {
            "Calculation": "计算",
            "Check Cell": "检查单元格",
            "Explanatory Text": "解释性文本...",
            "Input": "输入",
            "Linked Cell": "链接单元格",
            "Note": "注释",
            "Output": "输出",
            "Warning Text": "警告文本"
        },
        titlesAndHeadingsContent: {
            "Heading 1": "标题 1",
            "Heading 2": "标题 2",
            "Heading 3": "标题 3",
            "Heading 4": "标题 4",
            "Title": "标题",
            "Total": "汇总"
        },
        themedCellStyleContent: {
            "20% - Accent1": "20% - 强调文字颜色 1",
            "20% - Accent2": "20% - 强调文字颜色 2",
            "20% - Accent3": "20% - 强调文字颜色 3",
            "20% - Accent4": "20% - 强调文字颜色 4",
            "20% - Accent5": "20% - 强调文字颜色 5",
            "20% - Accent6": "20% - 强调文字颜色 6",
            "40% - Accent1": "40% - 强调文字颜色 1",
            "40% - Accent2": "40% - 强调文字颜色 2",
            "40% - Accent3": "40% - 强调文字颜色 3",
            "40% - Accent4": "40% - 强调文字颜色 4",
            "40% - Accent5": "40% - 强调文字颜色 5",
            "40% - Accent6": "40% - 强调文字颜色 6",
            "60% - Accent1": "60% - 强调文字颜色 1",
            "60% - Accent2": "60% - 强调文字颜色 2",
            "60% - Accent3": "60% - 强调文字颜色 3",
            "60% - Accent4": "60% - 强调文字颜色 4",
            "60% - Accent5": "60% - 强调文字颜色 5",
            "60% - Accent6": "60% - 强调文字颜色 6",
            "Accent1": "强调文字颜色 1",
            "Accent2": "强调文字颜色 2",
            "Accent3": "强调文字颜色 3",
            "Accent4": "强调文字颜色 4",
            "Accent5": "强调文字颜色 5",
            "Accent6": "强调文字颜色 6"
        },
        numberFormatContent: {
            "Comma": "千位分隔",
            "Comma [0]": "千位分隔 [0]",
            "Currency": "货币",
            "Currency [0]": "货币 [0]",
            "Percent": "百分比"
        },
        newCellStyle: "新建单元格样式..."
    };

    cn_res.newCellStyleDialog = {
        style: "样式",
        styleName: "样式名:",
        defaultStyleName: "样式 1",
        format: "格式...",
        message: "此样式名已存在。"
    };

    cn_res.cellStyleContextMenu = {
        "delete": "删除",
        modify: "修改"
    };

    cn_res.insertPictureDialogTitle = "插入图片";
    cn_res.pictureFormatFilter = {
        jpeg: "JPEG 文件交换格式(*.jpg;*.jpeg)",
        png: "可移植网络图形(*.png)",
        bmp: "Windows 位图(*.bmp)",
        allFiles: "所有文件(*.*)"
    };

    cn_res.ribbon = {
        accessBar: {
            undo: "撤销",
            redo: "恢复",
            save: "保存",
            New: "新建",
            open: "打开",
            active: "激活",
            tipWidth: 660
        },
        home: {
            file: "文件",
            home: "开始",
            clipboard: "剪贴板",
            fonts: "字体",
            alignment: "对齐方式",
            numbers: "数字",
            cellType: "单元格类型",
            styles: "样式",
            cells: "单元格",
            editing: "编辑",
            paste: "粘贴",
            all: "全部",
            formulas: "公式",
            values: "值",
            formatting: "格式",
            valuesAndFormatting: "值和格式",
            formulasAndFormatting: "公式和格式",
            cut: "剪切",
            copy: "复制",
            fontFamily: "字体",
            fontSize: "字号",
            increaseFontSize: "增大字号",
            decreaseFontSize: "减小字号",
            bold: "加粗",
            italic: "倾斜",
            underline: "下划线",
            doubleUnderline: "双下划线",
            border: "边框",
            bottomBorder: "下边框",
            topBorder: "上边框",
            leftBorder: "左边框",
            rightBorder: "右边框",
            noBorder: "无框线",
            allBorder: "所有框线",
            outsideBorder: "外侧框线",
            thickBoxBorder: "粗匣框线",
            bottomDoubleBorder: "双底框线",
            thickBottomBorder: "粗底框线",
            topBottomBorder: "上下框线",
            topThickBottomBorder: "上框线和粗下框线",
            topDoubleBottomBorder: "上框线和双下框线",
            moreBorders: "其他边框...",
            backColor: "填充颜色",
            fontColor: "字体颜色",
            topAlign: "顶端对齐",
            middleAlign: "垂直居中",
            bottomAlign: "底端对齐",
            leftAlign: "文本左对齐",
            centerAlign: "居中",
            rightAlign: "文本右对齐",
            increaseIndent: "增加缩进量",
            decreaseIndent: "减少缩进量",
            wrapText: "自动换行",
            mergeCenter: "合并后居中",
            mergeAcross: "跨越合并",
            mergeCells: "合并单元格",
            unMergeCells: "取消单元格合并",
            numberFormat: "数字格式",
            general: "常规",
            Number: "数字",
            currency: "货币",
            accounting: "会计专用",
            shortDate: "短日期",
            longDate: "长日期",
            time: "时间",
            percentage: "百分比",
            fraction: "分数",
            scientific: "科学记数",
            text: "文本",
            moreNumberFormat: "其他数字格式...",
            percentStyle: "百分比样式",
            commaStyle: "千分分隔样式",
            increaseDecimal: "增加小数位数",
            decreaseDecimal: "减少小数位数",
            buttonCellType: "按钮",
            checkboxCellType: "复选框",
            comboBoxCellType: "组合框",
            hyperlinkCellType: "超链接",
            checkboxListCellType: "复选框列表",
            radioListCellType: "单选框列表",
            buttonList: "按钮列表",
            list: "列表",
            buttonListCellType: "按钮列表",
            clearCellType: "清除单元格类型",
            clearCellType1: "清除单元格类型",
            cellDropdowns: "单元格下拉框",
            conditionFormat: "条件格式",
            conditionFormat1: "条件格式",
            formatTable: "套用<br>表格样式",
            formatTable1: "套用表格样式",
            insert: "插入",
            insertCells: "插入单元格...",
            insertSheetRows: "插入工作表行",
            insertSheetColumns: "插入工作表列",
            insertSheet: "插入工作表",
            Delete: "删除",
            deleteCells: "删除单元格...",
            deleteSheetRows: "删除工作表行",
            deleteSheetColumns: "删除工作表列",
            deleteSheet: "删除工作表",
            format: "格式",
            rowHeight: "行高...",
            autofitRowHeight: "自动调整行高",
            defaultHeight: "默认行高...",
            columnWidth: "列宽...",
            autofitColumnWidth: "自动调整列宽",
            defaultWidth: "默认列宽...",
            hideRows: "隐藏行",
            hideColumns: "隐藏列",
            unHideRows: "取消隐藏行",
            unHideColumns: "取消隐藏列",
            protectSheet: "保护工作表...",
            unProtectSheet: "撤销工作表保护...",
            lockCells: "锁定单元格",
            unLockCells: "撤销单元格锁定",
            autoSum: "自动求和",
            sum: "求和",
            average: "平均值",
            countNumbers: "计数",
            max: "最大值",
            min: "最小值",
            fill: "填充",
            down: "向下",
            right: "向右",
            up: "向上",
            left: "向左",
            series: "系列...",
            clear: "清除",
            clearAll: "全部清除",
            clearFormat: "清除格式",
            clearContent: "清除内容",
            clearComments: "清除批注",
            sortFilter: "排序和<br>筛选",
            sortFilter1: "排序和筛选",
            sortAtoZ: "升序",
            sortZtoA: "降序",
            customSort: "自定义排序...",
            filter: "筛选",
            clearFilter: "清除筛选",
            reapply: "重新应用",
            find: "查找",
            find1: "查找...",
            goto: "转到...",
            rotateText: "文字旋转",
            orientation: "方向",
            angleCounterclockwise: "逆时针角度",
            angleClockwise: "顺时针角度",
            verticalText: "竖排文字",
            rotateTextUp: "向上旋转文字",
            rotateTextDown: "向下旋转文字",
            formatCellAlignment: "设置单元格对齐方式",
        },
        insert: {
            insert: "插入",
            table: "表格",
            chart: "图表",
            sparklines: "迷你图",
            line: "折线图",
            column: "柱形图",
            winloss: "盈亏图",
            insertTable: "插入表",
            insertChart: "插入图表",
            insertShapes: "插入形状",
            insertBarcode: "插入条形码",
            insertPicture: "插入图片",
            insertLineSparkline: "插入折线图",
            insertColumnSparkline: "插入柱形图",
            insertWinlossSparkline: "插入盈亏图",
            picture: "图片",
            illustrations: "插图",
            shapes: "形状",
            barcode: "条形码",
            insertPieSparkline: "插入饼图",
            insertAreaSparkline: "插入面积图",
            insertScatterSparkline: "插入散点图",
            pie: "饼图",
            area: "面积图",
            scatter: "散点图",
            insertBulletSparkline: "插入子弹图",
            bullet: "子弹图",
            insertSpreadSparkline: "插入散布图",
            spread: "散布图",
            insertStackedSparkline: "插入堆积图",
            stacked: "堆积图",
            insertHbarSparkline: "插入水平条形图",
            hbar: "水平<br>条形图",
            insertVbarSparkline: "插入垂直条形图",
            vbar: "垂直<br>条形图",
            insertVariSparkline: "插入方差图",
            variance: "方差图",
            insertBoxPlotSparkline: "插入箱线图",
            boxplot: "箱线图",
            insertCascadeSparkline: "插入组成瀑布图",
            cascade: "组成<br>瀑布图",
            insertParetoSparkline: "插入阶梯瀑布图",
            pareto: "阶梯<br>瀑布图",
            insertMonthSparkline: "插入月度图",
            month: "月",
            insertYearSparkline: "插入年度图",
            year: "年",
        },
        formulas: {
            formulas: "公式",
            insertFunction: "插入<br>函数",
            insertFunction1: "插入函数",
            functions: "函数库",
            names: "定义的名称",
            nameManager: "名称<br>管理器",
            nameManager1: "名称管理器",
            text: "文本",
            financial: "财务",
            logical: "逻辑",
            datetime: "日期和时间",
            lookupreference: "查找与引用",
            mathtrig: "数学和三角函数",
            more: "其他函数",
            statistical: "统计",
            engineering: "工程",
            information: "信息",
            database: "多维数据集",
            autoSum: "自动求和",
            functionsLibrary: "函数库"
        },
        data: {
            data: "数据",
            sortFilter: "排序和筛选",
            dataTools: "数据工具",
            outline: "分级显示",
            sortAtoZ: "升序",
            sortZtoA: "降序",
            sort: "排序",
            customSort: "排序...",
            filter: "筛选",
            clear: "清除",
            clearFilter: "清除筛选",
            reapply: "重新应用",
            dataValidation: "数据验证",
            dataValidation1: "数据验证",
            circleInvalidData: "圈释无效数据",
            clearInvalidCircles: "清除无效数据标识圈",
            group: "创建组",
            unGroup: "取消组合",
            subtotal: "分类汇总",
            showDetail: "显示明细数据",
            hideDetail: "隐藏明细数据",
            designMode: "设计模式",
            enterTemplate: "输入设计模式模板",
            template: "模板",
            bindingPath: "绑定路径",
            loadSchemaTitle: "加载模板结构获取树图",
            loadSchema: "加载模板结构",
            loadDataSourceFilter: {
                json: "JSON 文件(*.json)",
                txt: "文本文件(*.txt)"
            },
            saveDataSourceFilter: {
                json: "JSON 文件(*.json)"
            },
            saveSchemaTitle: "保存模板结构信息到 JSON 文件",
            saveSchema: "保存模板结构",
            autoGenerateColumns: "自动生成列",
            columns: "列",
            name: "名称",
            details: "明细数据",
            ok: "确定",
            cancel: "取消",
            loadDataError: "请加载 json 文件。",
            addNode: "添加节点",
            remove: "删除",
            rename: "重命名",
            table: "表格",
            selectOptions: "选择选项",
            clearBindingPath: "清除绑定路径",
            dataField: "数据字段",
            warningTable: "表的列数将发生变化。是否继续执行?",
            warningDataField: "是否无论如何都要将自动生成列设置为否和设置数据字段？",
            checkbox: "复选框",
            hyperlink: "超链接",
            combox: "组合框",
            button: "按钮",
            text: "文本",
            autoGenerateLabel: "自动生成标签",
            autoGenerateLabelTip: "自动生成数据标签",
            unallowableTableBindingTip: "数据字段只能设置在表上，请选择一个表。",
            overwriteCellTypeWarning: "工作表上的某些单元格类型将被覆盖或修改，是否继续执行？",
            removeNodeWarning: "删除的节点包含子节点，是否要删除？",
            unallowComboxBindingTip: "组合框的集合只能在组合框中设置，请选择一个组合框。",
            rowOutline: "行分组",
            unallowOneRowSubtotal: "这无法应用于所选区域。请选择多于一行的单元格区域，然后再试。",
            unallowTableSubtotal: "分类汇总不支持表格。",
            canNotAppliedRange: "这无法应用于所选区域。请重新选择单元格然后再试。"
        },
        view: {
            view: "视图",
            showHide: "显示/隐藏",
            zoom: "显示比例",
            viewport: "窗口",
            rowHeader: "行标题",
            columnHeader: "列标题",
            verticalGridline: "垂直网格线",
            horizontalGridline: "水平网格线",
            tabStrip: "工作表选项卡",
            newTab: "新建工作表",
            rowHeaderTip: "显示/隐藏行标题",
            columnHeaderTip: "显示/隐藏列标题",
            verticalGridlineTip: "显示/隐藏垂直网格线",
            horizontalGridlineTip: "显示/隐藏水平网格线",
            tabStripTip: "显示/隐藏工作表选项卡",
            newTabTip: "显示/隐藏新建工作表",
            zoomToSelection: "缩放到选定区域",
            zoomToSelection1: "缩放到选定区域",
            freezePane: "冻结窗格",
            freezePane1: "冻结窗格",
            freezeTopRow: "冻结首行",
            freezeFirstColumn: "冻结首列",
            freezeBottomRow: "冻结底端行",
            freezeLastColumn: "冻结最后列",
            unFreezePane: "取消<br>冻结窗格",
            unFreezePane1: "取消冻结窗格"
        },
        setting: {
            setting: "设置",
            spreadSetting: "Spread 设置",
            sheetSetting: "工作表设置",
            general: "常规",
            generalTip: "常规设置",
            scrollBars: "滚动条",
            tabStrip: "选项卡",
            gridLines: "网格线",
            calculation: "计算",
            headers: "标题"
        },
        sparkLineDesign: {
            design: "设计",
            type: "类型",
            show: "显示",
            style: "样式",
            groups: "分组",
            line: "线条",
            column: "柱形图",
            winLoss: "盈亏",
            lineTip: "折线图",
            columnTip: "柱形图",
            winLossTip: "盈亏迷你图",
            highPoint: "高点",
            lowPoint: "低点",
            negativePoint: "负点",
            firstPoint: "首点",
            lastPoint: "尾点",
            markers: "标记",
            highPointTip: "切换迷你图高点",
            lowPointTip: "切换迷你图低点",
            negativePointTip: "切换迷你图负点",
            firstPointTip: "切换迷你图首点",
            lastPointTip: "切换迷你图尾点",
            markersTip: "切换迷你图标记",
            sparklineColor: "迷你图颜色",
            markerColor: "标记颜色",
            sparklineWeight: "迷你图粗细",
            customWeight: "自定义粗细...",
            group: "组合",
            groupTip: "组合所选迷你图",
            unGroupTip: "取消组合所选迷你图",
            unGroup: "取消组合",
            clear: "清除",
            clearSparkline: "清除所选的迷你图",
            clearSparklineGroup: "清除所选的迷你图组"
        },
        formulaSparklineDesign: {
            design: "设计",
            argument: "参数",
            settings: "设置"
        },
        tableDesign: {
            design: "设计",
            tableName: "表名称",
            resizeTable: "调整表格大小",
            reszieHandler: '调整表句柄',
            tableOption: "表式样选项",
            property: "属性",
            headerRow: "标题行",
            totalRow: "汇总行",
            bandedRows: "镶边行",
            firstColumn: "第一列",
            lastColumn: "最后一列",
            bandedColumns: "镶边列",
            filterButton: "筛选按钮",
            tableStyle: "表式样",
            style: "式样",
            tools: "工具",
            insertSlicer: "插入切片器",
            toRange: "转换为区域",
            totalRowList: "汇总函数列表",
            moreFunctions: "其他函数..."
        },
        chartDesign: {
            design: "设计",
            chartLayouts: "图表布局",
            addChartElement: "添加图表<br>元素",
            addChartElement1: "添加图表元素",
            quickLayout: "快速布局",
            changeColors: "更改颜色",
            axes: "轴",
            chartStyles: "图表样式",
            switchRowColumn: "切换行/列",
            selectData: "选择数据",
            data: "数据",
            changeChartType: "更改图表<br>类型",
            changeChartType1: "更改图表类型",
            type: "类型",
            moveChart: "移动图表",
            location: "位置",
            chartTemplate: "图表模板"
        },
        shapeDesign: {
            design: "格式",
            shape: "形状",
            changeShapeStyle: "改变形状样式",
            changeShapeType: "改变形状",
            insertShape: "插入形状",
            backColor: "形状填充",
            fontColor: "文本填充",
            color: "颜色",
            themeStyle: "主题样式",
            presets: "预设",
            size: "大小",
            width: "宽度",
            height: "高度",
            rotate: "旋转",
            arrange: "对齐",
            group: "组合",
            regroup: "重新组合",
            ungroup: "取消组合",
            rotateright90: "向右旋转 90°",
            rotateleft90: "向左旋转 90°"
        },
        insertShapeDialog: {
            errorPrompt: {
                unexpectedErrorMsg: "发生了未知错误，请您重试一次。如果还不能成功，请联系我们的售后部门。",
            }
        },
        fontFamilies: {
            cnff1: { name: "宋体", text: "宋体" },
            cnff2: { name: "楷体", text: "楷体" },
            cnff3: { name: "仿宋", text: "仿宋" },
            cnff4: { name: "黑体", text: "黑体" },
            cnff5: { name: "新宋体", text: "新宋体" },
            cnff6: { name: "SimSun", text: "SimSun" },
            cnff7: { name: "KaiTi", text: "KaiTi" },
            cnff8: { name: "FangSong", text: "FangSong" },
            cnff9: { name: "SimHei", text: "SimHei" },
            cnff10: { name: "NSimSun", text: "NSimSun" },
            ff1: { name: "Arial", text: "Arial" },
            ff2: { name: "Arial Black", text: "Arial Black" },
            ff3: { name: "Calibri", text: "Calibri" },
            ff4: { name: "Cambria", text: "Cambria" },
            ff5: { name: "Candara", text: "Candara" },
            ff6: { name: "Century", text: "Century" },
            ff7: { name: "Courier New", text: "Courier New" },
            ff8: { name: "Comic Sans MS", text: "Comic Sans MS" },
            ff9: { name: "Garamond", text: "Garamond" },
            ff10: { name: "Georgia", text: "Georgia" },
            ff11: { name: "Malgun Gothic", text: "Malgun Gothic" },
            ff12: { name: "Mangal", text: "Mangal" },
            ff13: { name: "Meiryo", text: "Meiryo" },
            ff14: { name: "MS Gothic", text: "MS Gothic" },
            ff15: { name: "MS Mincho", text: "MS Mincho" },
            ff16: { name: "MS PGothic", text: "MS PGothic" },
            ff17: { name: "MS PMincho", text: "MS PMincho" },
            ff18: { name: "Tahoma", text: "Tahoma" },
            ff19: { name: "Times", text: "Times" },
            ff20: { name: "Times New Roman", text: "Times New Roman" },
            ff21: { name: "Trebuchet MS", text: "Trebuchet MS" },
            ff22: { name: "Verdana", text: "Verdana" },
            ff23: { name: "Wingdings", text: "Wingdings" }
        },
        slicerOptions: {
            options: "选项",
            slicerCaptionShow: "切片器标题:",
            slicerCaption: "切片器标题",
            slicerSettings: "切片器设置",
            slicer: "切片器",
            styles: "样式",
            slicerStyles: "切片器样式",
            columnsShow: "列:",
            heightShow: "高度:",
            widthShow: "宽度:",
            columns: "列",
            height: "高度",
            width: "宽度",
            buttons: "按钮",
            size: "大小",
            shapeHeight: "形状高度",
            shapeWidth: "形状宽度"
        }
    };
    cn_res.shapeSliderPanel = {
        fillAndLine: "填充&线条",
        formatShape: "设置形状格式",
        shapeOptions: "形状选项",
        textOptions: "文本选项",
        textFill: "文本填充",
        textbox: "文本框",
        fill: "填充",
        noFill: "无填充",
        solidFill: "纯色填充",
        color: "颜色",
        transparency: "透明度",
        line: "线条",
        noLine: "无线条",
        solidLine: "实线",
        dashType: "短划线类型",
        capType: "线端类型",
        joinType: "连接类型",
        beginArrowType: "开始箭头类型",
        beginArrowSize: "开始箭头粗细",
        endArrowType: "结尾箭头类型",
        endArrowSize: "结尾箭头粗细",
        width: "宽度",
        height: "高度",
        size: "大小",
        rotation: "旋转",
        moveSizeWithCells: "随单元格改变位置和大小",
        moveNoSizeWithCells: "随单元格改变位置，但不改变大小",
        noMoveNoSizeWithCells: "不随单元格改变位置和大小",
        printObject: "打印对象",
        locked: "锁定",
        vAlign: "垂直对齐方向",
        hAlign: "水平对齐方向",
        flat: "平",
        square: "方",
        round: "圆",
        miter: "斜角",
        bevel: "棱角",
        solid: "实线",
        squareDot: "方点",
        dash: "划线",
        longDash: "长划线",
        dashDot: "划线-点",
        longDashDot: "长划线-点",
        longDashDotDot: "长划线-点-点",
        sysDash: "Sys划线",
        sysDot: "Sys点",
        sysDashDot: "Sys划线-点",
        dashDotDot: "划线-点-点",
        roundDot: "圆点",
        center: "居中",
        bottom: "底部对齐",
        top: "顶部对齐",
        left: "居左对齐",
        right: "居右对齐",
        textEditor: "文本编辑",
        text: "文本",
        font: "字体",
        properties: "属性",
        normal: "常规",
        italic: "斜体",
        oblique: "倾斜",
        bold: "粗体",
        bolder: "加粗",
        lighter: '细体',
        fontSize: '字号',
        fontFamily: '字体',
        fontStyle: '字体风格',
        fontWeight: '字体粗细',
    };
    cn_res.insertShapeDialog = {
        lines: "线条",
        rectangles: "矩形",
        basicShapes: "基本形状",
        blockArrows: "箭头总汇",
        equationShapes: "公式形状",
        flowChart: "流程图",
        starsAndBanners: "星与旗帜",
        callouts: "标注"
    };
    cn_res.shapeType = {
        actionButtonBackorPrevious: "上一个",
        actionButtonBeginning: "开始",
        actionButtonCustom: "自定义",
        actionButtonDocument: "文档",
        actionButtonEnd: "结束",
        actionButtonForwardorNext: "下一个",
        actionButtonHelp: "帮助",
        actionButtonHome: "主页",
        actionButtonInformation: "信息",
        actionButtonMovie: "电影",
        actionButtonReturn: "返回",
        actionButtonSound: "声音",
        arc: "弧形",
        balloon: "气泡图",
        bentArrow: "箭头:圆角右",
        bentUpArrow: "箭头:直角上",
        bevel: "矩形:棱台",
        blockArc: "空心弧",
        can: "圆柱形",
        chartPlus: "田字格",
        chartStar: "米字格",
        chartX: "对角线格",
        chevron: "箭头:V型",
        chord: "弦形",
        circularArrow: "箭头:环形",
        cloud: "云形",
        cloudCallout: "思想气泡:云",
        corner: "L形",
        cornerTabs: "直三角镜框",
        cross: "十字形",
        cube: "立方体",
        curvedDownArrow: "箭头:上弧形",
        curvedDownRibbon: "带形:前凸弯",
        curvedLeftArrow: "箭头:左弧形",
        curvedRightArrow: "箭头:右弧形",
        curvedUpArrow: "箭头:下弧形",
        curvedUpRibbon: "带形:上凸弯",
        decagon: "十边形",
        diagonalStripe: "斜纹",
        diamond: "菱形",
        dodecagon: "十二边形",
        donut: "圆:空心",
        doubleBrace: "双大括号",
        doubleBracket: "双括号",
        doubleWave: "双波形",
        downArrow: "箭头:下",
        downArrowCallout: "标注:下箭头",
        downRibbon: "带形:前凸",
        explosion1: "爆炸性:14pt 1",
        explosion2: "爆炸性:14pt 2",
        flowchartAlternateProcess: "流程图:可选过程",
        flowchartCard: "流程图:卡片",
        flowchartCollate: "流程图:对照",
        flowchartConnector: "流程图:接点",
        flowchartData: "流程图:数据",
        flowchartDecision: "流程图:决策",
        flowchartDelay: "流程图:延期",
        flowchartDirectAccessStorage: "流程图:直接访问存储器",
        flowchartDisplay: "流程图:显示",
        flowchartDocument: "流程图:文档",
        flowchartExtract: "流程图:摘录",
        flowchartInternalStorage: "流程图:内部贮存",
        flowchartMagneticDisk: "流程图:磁盘",
        flowchartManualInput: "流程图:手动输入",
        flowchartManualOperation: "流程图:手动操作",
        flowchartMerge: "流程图:合并",
        flowchartMultidocument: "流程图:多文档",
        flowchartOfflineStorage: "流程图:离线存储器",
        flowchartOffpageConnector: "流程图:离页连接符",
        flowchartOr: "流程图:或者",
        flowchartPredefinedProcess: "流程图:预定义过程",
        flowchartPreparation: "流程图:准备",
        flowchartProcess: "流程图:过程",
        flowchartPunchedTape: "流程图:资料带",
        flowchartSequentialAccessStorage: "流程图:顺序访问存储器",
        flowchartSort: "流程图:排序",
        flowchartStoredData: "流程图:存储数据",
        flowchartSummingJunction: "流程图:汇总连接",
        flowchartTerminator: "流程图:终止",
        foldedCorner: "矩形:折角",
        frame: "图文框",
        funnel: "漏斗形",
        gear6: "六角齿轮",
        gear9: "九角齿轮",
        halfFrame: "半闭框",
        heart: "心形",
        heptagon: "七边形",
        hexagon: "六边形",
        horizontalScroll: "卷形:水平",
        isoscelesTriangle: "等腰三角形",
        leftArrow: "箭头:左",
        leftArrowCallout: "标注:左箭头",
        leftBrace: "左大括号",
        leftBracket: "左中框号",
        leftCircularArrow: "左循环箭头",
        leftRightArrow: "箭头:左右",
        leftRightArrowCallout: "标注:左右箭头",
        leftRightCircularArrow: "左右循环箭头",
        leftRightRibbon: "缎带:左右",
        leftRightUpArrow: "箭头:丁字",
        leftUpArrow: "箭头:直角双向",
        lightningBolt: "闪电形",
        lineCallout1: "标注:线形",
        lineCallout1AccentBar: "标注:线形(带强调线)",
        lineCallout1BorderandAccentBar: "标注:线形(带边框和强调线)",
        lineCallout1NoBorder: "标注:线形(无边框)",
        lineCallout2: "标注:线形",
        lineCallout2AccentBar: "标注:线形(带强调线)",
        lineCallout2BorderandAccentBar: "标注:线形(带边框和强调线)",
        lineCallout2NoBorder: "标注:线形(无边框)",
        lineCallout3: "标注:弯曲线形",
        lineCallout3AccentBar: "标注:弯曲线形(带强调线)",
        lineCallout3BorderandAccentBar: "标注:弯曲线形(带边框和强调线)",
        lineCallout3NoBorder: "标注:弯曲线形(无边框)",
        lineCallout4: "标注:双弯曲线形",
        lineCallout4AccentBar: "标注:双弯曲线形(带强调线)",
        lineCallout4BorderandAccentBar: "标注:双弯曲线形(带边框和强调线)",
        lineCallout4NoBorder: "标注:双弯曲线形(无边框)",
        lineInverse: "反斜线",
        mathDivide: "除号",
        mathEqual: "等号",
        mathMinus: "减号",
        mathMultiply: "乘号",
        mathNotEqual: "不等号",
        mathPlus: "加号",
        moon: "新月形",
        noSymbol: "禁止符",
        nonIsoscelesTrapezoid: "非等腰梯形",
        notchedRightArrow: "箭头:燕尾形",
        octagon: "八边形",
        oval: "椭圆",
        ovalCallout: "对话气泡:圆形",
        parallelogram: "平行四边形",
        pentagon: "五边形",
        pie: "不完整圆",
        pieWedge: "圆楔形",
        plaque: "缺角矩形",
        plaqueTabs: "四角斑形镜框",
        quadArrow: "箭头:十字",
        quadArrowCallout: "标注:十字箭头",
        rectangle: "矩形",
        rectangularCallout: "对话气泡:矩形",
        regularPentagon: "五边形",
        rightArrow: "箭头:右",
        rightArrowCallout: "标注:右箭头",
        rightBrace: "右大括号",
        rightBracket: "右中括号",
        rightTriangle: "直角三角形",
        round1Rectangle: "矩形:单圆角",
        round2DiagRectangle: "矩形:对角圆角",
        round2SameRectangle: "矩形:圆顶角",
        roundedRectangle: "矩形:圆角",
        roundedRectangularCallout: "对话气泡:圆角矩形",
        shape4pointStar: "星形:四角",
        shape5pointStar: "星形:五角",
        shape8pointStar: "星形:八角",
        shape16pointStar: "星形:十六角",
        shape24pointStar: "星形:二十四角",
        shape32pointStar: "星形:三十二角",
        smileyFace: "笑脸",
        snip1Rectangle: "矩形:剪去单角",
        snip2DiagRectangle: "矩形:剪去对角",
        snip2SameRectangle: "矩形:剪去顶角",
        snipRoundRectangle: "矩形:一个圆顶角，剪去另一个顶角",
        squareTabs: "四角方形镜框",
        star6Point: "星形:六角",
        star7Point: "星形:七角",
        star10Point: "星形:十角",
        star12Point: "星形:十二角",
        stripedRightArrow: "箭头:虚尾",
        sun: "太阳形",
        swooshArrow: "箭头:发射",
        tear: "泪滴形",
        trapezoid: "梯形",
        uTurnArrow: "箭头:手杖形",
        upArrow: "箭头:上",
        upArrowCallout: "标注:上箭头",
        upDownArrow: "箭头:上下",
        upDownArrowCallout: "对话气泡:上下箭头",
        upRibbon: "带形:上凸",
        verticalScroll: "卷形:垂直",
        wave: "波形",
        line: "直线",
        lineArrow: "直线箭头",
        lineArrowDouble: "双箭头直线",
        elbow: "连接符:肘形",
        elbowArrow: "连接符:肘形箭头",
        elbowArrowDouble: "连接符:肘形双箭头"
    };
    cn_res.seriesDialog = {
        series: "序列",
        seriesIn: "序列产生在",
        rows: "行",
        columns: "列",
        type: "类型",
        linear: "等差序列",
        growth: "等比序列",
        date: "日期",
        autoFill: "自动填充",
        dateUnit: "日期单位",
        day: "日",
        weekday: "工作日",
        month: "月",
        year: "年",
        trend: "预测趋势",
        stepValue: "步长值",
        stopValue: "终止值"
    };

    cn_res.customSortDialog = {
        sort: "排序",
        addLevel: "添加条件",
        deleteLevel: "删除条件",
        copyLevel: "复制条件",
        options: "选项...",
        sortBy: "列",
        sortBy2: "主要关键字",
        thenBy: "次要关键字",
        sortOn: "排序依据",
        sortOrder: "次序",
        sortOptions: "排序选项",
        orientation: "方向",
        sortTopToBottom: "按列排序",
        sortLeftToRight: "按行排序",
        column: "列 ",
        row: "行 ",
        values: "数值",
        ascending: "升序",
        descending: "降序"
    };

    cn_res.createTableDialog = {
        createTable: "创建表",
        whereYourTable: "表数据的来源"
    };

    cn_res.createSparklineDialog = {
        createSparkline: "创建图表",
        dataRange: "图表数据区域",
        locationRange: "图表位置区域",
        chooseData: "选择数据源",
        chooseWhere: "选择放置图表的位置",
        warningText: "位置不合法因为单元格没有在同一列或者同一行上。请选择同一列的单元格或者同一行。",
        notSingleCell: "无效引用范围，请选择单一单元格引用"
    };

    cn_res.dataValidationDialog = {
        dataValidation: "数据有效性",
        settings: "设置",
        validationCriteria: "有效性条件",
        allow: "允许",
        anyValue: "任何值",
        wholeNumber: "整数",
        decimal: "小数",
        list: "序列",
        date: "日期",
        textLength: "文本长度",
        custom: "自定义",
        data: "数据",
        dataLabel: "数据:",
        between: "介于",
        notBetween: "未介于",
        equalTo: "等于",
        notEqualTo: "不等于",
        greaterThan: "大于",
        lessThan: "小于",
        greaterEqual: "大于或等于",
        lessEqual: "小于或等于",
        minimum: "最小值:",
        maximum: "最大值:",
        value: "数值:",
        startDate: "开始日期:",
        endDate: "结束日期:",
        dateLabel: "日期:",
        length: "长度:",
        source: "来源:",
        formula: "公式:",
        ignoreBlank: "忽略空值",
        inCellDropDown: "提供下拉箭头",
        inputMessage: "输入信息",
        highlightStyle: "高亮样式",
        errorAlert: "出错警告",
        showMessage: "选定单元格时显示输入信息",
        showMessage2: "选定单元格时显示下列输入信息: ",
        title: "标题",
        showError: "输入无效数据时显示出错警告",
        showError2: "输入无效数据时显示下列出错警告:",
        style: "样式:",
        stop: "停止",
        warning: "警告",
        information: "信息",
        errorMessage: "错误信息",
        clearAll: "全部清除",
        valueEmptyMessage: "必须输入数值。",
        minimumMaximumMessage: "最大值必须大于或等于最小值.",
        errorMessage1: "输入值不合法。\r\n 用户已经限制了此单元格输入值。",
        errorMessage2: "输入值不合法。\r\n 用户已经限制了次单元格输入值。\r\n是否继续?",
        circle: "圆形",
        dogear: "折角",
        icon: "图标",
        topLeft: "左上",
        topRight: "右上",
        bottomRight: "右下",
        bottomLeft: "左下",
        outsideRight: "右翼",
        outsideLeft: "左翼",
        color: "颜色",
        position: "位置",
        selectIcon: "选择图标",
        selectIcons: "添加图标"
    };
    cn_res.outlineColumnDialog = {
        collapsed: "收起",
        expanded: "展开",
        custom: "自定义",
        maxLevel: "最大分组数",
        showIndicator: "显示分组标记",
        customImage: "自定义分组标记",
        showImage: "显示分组图片",
        showCheckBox: "显示分组复选框",
        title: "分组列",
        indicatorImage: "分组标记图片:",
        itemImages: "分组图片:",
        icon: "图片"
    };

    cn_res.spreadSettingDialog = {
        spreadSetting: "Spread 设置",
        general: "常规",
        settings: "设置",
        allowDragMerge: "允许拖拽合并单元格",
        allowDragDrop: "允许拖拽",
        allowFormula: "允许用户输入公式",
        allowDragFill: "运行拖动和填充",
        allowZoom: "允许缩放",
        allowUndo: "允许撤销",
        allowOverflow: "允许溢出",
        scrollBars: "滚动条",
        visibility: "可见性",
        verticalScrollBar: "垂直滚动条",
        horizontalScrollBar: "水平滚动条",
        scrollbarShowMax: "滚动条最大显示",
        scrollbarMaxAlign: "滚动条最大对齐",
        tabStrip: "工作表标签",
        tabStripVisible: "工作表标签可见",
        tabStripEditable: "工作表标签可编辑",
        newTabVisible: "新建工作表可见",
        tabStripRatio: "工作表标签比例(百分比)",
        clipboard: "剪贴板",
        allowCopyPasteExcelStyle: "允许复制粘贴Excel样式",
        allowExtendPasteRange: "允许扩展粘贴区域",
        headerOptions: "复制粘贴行列头选项",
        noHeaders: "不包含行列头",
        rowHeaders: " 包含行头",
        columnHeaders: "包含列头",
        allHeaders: "包含行头列头",
        customListsTitle: "自定义列表",
        customLists: "自定义列表:",
        listEntries: "自定义序列:",
        add: "添加",
        delete: "删除",
        newList: "新序列",
        deleteNotification: "选定序列将永远删除.",
        scrollByPixel: "像素滚动",
        scrollPixel: "滚动单位 <像素> ",
        allowDynamicArray: "允许动态数组",
        normalResizeMode: "普通模式",
        splitResizeMode: "分离模式",
        rowResizeMode: "行调整模式",
        columnResizeMode: "列调整模式"
    };

    cn_res.sheetSettingDialog = {
        sheetSetting: "工作表设置",
        general: "常规",
        columnCount: "列数",
        rowCount: "行数",
        frozenColumnCount: "冻结列数",
        frozenRowCount: "冻结行数",
        trailingFrozenColumnCount: "最后面冻结列数",
        trailingFrozenRowCount: "最后面冻结行数",
        selectionPolicy: "选择策略",
        singleSelection: "单选",
        rangeSelection: "区域选择",
        multiRangeSelection: "多区域选择",
        protect: "保护",
        gridlines: "网格线",
        horizontalGridline: "水平网格线",
        verticalGridline: "垂直网格线",
        gridlineColor: "网格线颜色",
        calculation: "计算",
        referenceStyle: "引用样式",
        a1: "A1",
        r1c1: "R1C1",
        headers: "标题",
        columnHeaders: "列标题",
        rowHeaders: "行标题",
        columnHeaderRowCount: "列标题行数",
        columnHeaderAutoText: "列标题自动生成文本",
        columnHeaderAutoIndex: "列标题自动索引",
        defaultRowHeight: "默认行高",
        columnHeaderVisible: "列标题可见",
        blank: "空白",
        numbers: "数字",
        letters: "字母",
        rowHeaderColumnCount: "行标题列数",
        rowHeaderAutoText: "行标题自动生成文本",
        rowHeaderAutoIndex: "行标题自动索引",
        defaultColumnWidth: "默认列宽",
        rowHeaderVisible: "行标题可见",
        sheetTab: "工作表标签",
        sheetTabColor: "工作表标签颜色:"
    };

    cn_res.groupDirectionDialog = {
        settings: "设置",
        direction: "方向",
        rowDirection: "明细数据的下方",
        columnDirection: "明细数据的右侧",
        showrow: "显示行分组",
        showcol: "显示列分组"
    };

    cn_res.insertSparklineDialog = {
        createSparklines: "插入图表",
        dataRange: "图表数据区域:",
        dataRangeTitle: "选择数据源",
        locationRange: "放置图表的位置",
        locationRangeTitle: "选择放置图表的位置",
        errorDataRangeMessage: "请输入合法的区域",
        isFormulaSparkline: "公式图表"
    };
    cn_res.cellStates = {
        cellStates: "单元格状态",
        add: "添加单元格状态",
        remove: "删除单元格状态",
        manage: "管理单元格状态",
        selectStateType: "选择一个单元格状态类型",
        normal: "normal",
        hover: "hover",
        invalid: "invalid",
        edit: "edit",
        readonly: "readonly",
        active: "active",
        selected: "selected",
        selectRange: "选择区域",
        range: "区域:",
        selectStyle: "设置样式",
        formatStyle: "格式...",
        headRange: "区域",
        headStyle: "样式",
        headState: "状态类型",
        title: "创建单元格状态",
        list: "单元格状态列表:",
        forbidCorssSheet: "请在当前的工作表选择单元格",
        errorStateType: "请选择一个合法的单元格状态",
        errorStyle: "请为选定区域设置合法样式",
        errorDataRangeMessage: "请输入一个合法的区域"
    };

    cn_res.sparklineWeightDialog = {
        sparklineWeight: "图表线宽",
        inputWeight: "输入图表线宽(pt)",
        errorMessage: "请输入合法的线宽。"
    };

    cn_res.sparklineMarkerColorDialog = {
        sparklineMarkerColor: "图表标记颜色:",
        negativePoints: "负数:",
        markers: "标记:",
        highPoint: "最大值:",
        lowPoint: "最小值:",
        firstPoint: "第一个值:",
        lastPoint: "最后一个值:"
    };

    cn_res.resizeTableDialog = {
        title: "调整表格大小",
        dataRangeTitle: "为表选择新的数据区域:",
        note: "注释:  标题必须保留在同一行上，\r\n结果表区域必须重叠原始表区域。"
    };

    cn_res.saveAsDialog = {
        title: "保存文件",
        fileNameLabel: "文件名:"
    };

    cn_res.statusBar = {
        zoom: '缩放',
        toolTipZoomPanel: '缩放级别。单击可打开“显示比例对话框”。'
    };

    cn_res.calendarSparklineDialog = {
        calendarSparklineDialog: "日历迷你图",
        monthSparklineDialog: "月度迷你图",
        yearSparklineDialog: "年度迷你图",
        emptyColor: "空值颜色",
        startColor: "起始值颜色",
        middleColor: "中间值颜色",
        endColor: "结束值颜色",
        rangeColor: "区间颜色",
        year: "年",
        month: "月"
    };
    cn_res.barcodeDialog = {
        barcodeDialog: "条形码对话框",
        locationReference: "位置引用",
        showLabel: "显示条码标识",
        barcodetype: "条形码类型",
        value: "值",
        color: "颜色",
        errorCorrectionLevel: "错误校验等级",
        backgroudColor: "背景色",
        version: "编码版本",
        model: "编码模式",
        mask: "编码掩码",
        connection: "连接模式",
        charCode: "字符集",
        connectionNo: "连接模式索引",
        charset: "编码集",
        quietZoneLeft: "左侧静默区",
        quietZoneRight: "右侧静默区",
        quietZoneTop: "上部静默区",
        quietZoneBottom: "底部静默区",
        labelPosition: "条码标识位置",
        addOn: "附加码",
        addOnLabelPosition: "附加码标识位置",
        fontFamily: "字体",
        fontStyle: "字体样式",
        fontWeight: "字体粗细",
        fontTextDecoration: "字体装饰线",
        fontTextAlign: "字体排列",
        fontSize: "字体大小",
        fileIdentifier: "文件位置标识",
        structureNumber: "连接模式索引",
        structureAppend: "连接模式",
        ecc00_140Symbole: "Ecc000_140 符号大小",
        ecc200EndcodingMode: "Ecc200 编码模式",
        ecc200SymbolSize: "Ecc200 符号大小",
        eccMode: "Ecc 模式",
        compact: "紧凑模式",
        columns: "列",
        rows: "行",
        groupNo: "分组索引",
        grouping: "分组",
        codeSet: "编码集",
        fullASCII: "ASCII全集",
        checkDigit: "校验位",
        nwRatio: "宽窄条比例",
        labelWithStartAndStopCharacter: "带开始和结束字符的标识"
    };
    cn_res.pieSparklineDialog = {
        percentage: "百分比",
        color: "颜色",
        addColor: "添加颜色",
        pieSparklineSetting: "饼图设置"
    };

    cn_res.areaSparklineDialog = {
        title: "面积图公式",
        points: "点",
        min: "最小值",
        max: "最大值",
        line1: "线条 1",
        line2: "线条 2",
        positiveColor: "正数颜色",
        negativeColor: "负数颜色",
        areaSparklineSetting: "面积图设置"
    };

    cn_res.scatterSparklineDialog = {
        points1: "点1",
        points2: "点2",
        minX: "X轴最小值",
        maxX: "X轴最大值",
        minY: "Y轴最小值",
        maxY: "Y轴最大值",
        hLine: "水平轴",
        vLine: "垂直轴",
        xMinZone: "X轴最小区域",
        yMinZone: "Y轴最小区域",
        xMaxZone: "X轴最大区域",
        yMaxZone: "Y轴最大区域",
        tags: "标签",
        drawSymbol: "绘制符号",
        drawLines: "绘制线",
        color1: "颜色 1",
        color2: "颜色 2",
        dash: "划线",
        scatterSparklineSetting: "散点图设置"
    };

    cn_res.compatibleSparklineDialog = {
        title: "CompatibleSparkline公式",
        style: "样式",
        show: "显示",
        group: "分组",
        data: "数据",
        dataOrientation: "数据方向",
        dateAxisData: "日期轴数据",
        dateAxisOrientation: "日期轴方向",
        settting: "设置",
        axisColor: "轴",
        firstMarkerColor: "首标记",
        highMarkerColor: "最高标记",
        lastMarkerColor: "尾标记",
        lowMarkerColor: "最低标记",
        markersColor: "标记",
        negativeColor: "负数",
        seriesColor: "系列",
        displayXAxis: "显示X轴",
        showFirst: "显示首",
        showHigh: "显示最高",
        showLast: "显示尾",
        showLow: "显示最低",
        showNegative: "显示负数",
        showMarkers: "显示标记",
        lineWeight: "线粗细",
        displayHidden: "在隐藏行和列中显示数据",
        displayEmptyCellsAs: "空单元格显示为",
        rightToLeft: "从右到左",
        minAxisType: "最小轴类型",
        maxAxisType: "最大轴类型",
        manualMax: "手动最大",
        manualMin: "手动最小",
        gaps: "空白",
        zero: "0",
        connect: "连接",
        vertical: "垂直",
        horizontal: "水平",
        stylesetting: "样式设置",
        individual: "个别的",
        custom: "自定义",
        compatibleSparklineSetting: "CompatibleSparkline设置",
        styleSetting: "样式设置",
        errorMessage: "请输入合法区域。"
    };

    cn_res.bulletSparklineDialog = {
        bulletSparklineSetting: "子弹图设置",
        measure: "测量",
        target: "目标",
        maxi: "Maxi",
        good: "好",
        bad: "坏",
        forecast: "预测",
        tickunit: "单位",
        colorScheme: "主题颜色",
        vertical: "垂直"
    };

    cn_res.spreadSparklineDialog = {
        spreadSparklineSetting: "SpreadSparkline配置",
        points: "点",
        showAverage: "显示平均值",
        scaleStart: "刻度起始",
        scaleEnd: "刻度终止",
        style: "样式",
        colorScheme: "主题颜色",
        vertical: "垂直",
        stacked: "堆叠",
        spread: "分散",
        jitter: "抖动",
        poles: "极点",
        stackedDots: "堆积点",
        stripe: "条纹"
    };

    cn_res.stackedSparklineDialog = {
        stackedSparklineSetting: "StackedSparkline设置",
        points: "点",
        colorRange: "颜色范围",
        labelRange: "标签范围",
        maximum: "最大值",
        targetRed: "目标红色",
        targetGreen: "目标绿色",
        targetBlue: "目标蓝色",
        targetYellow: "目标黄色",
        color: "颜色",
        highlightPosition: "高亮位置",
        vertical: "垂直",
        textOrientation: "文本方向",
        textSize: "文本大小",
        textHorizontal: "水平",
        textVertical: "垂直",
        px: "px"
    };

    cn_res.barbaseSparklineDialog = {
        hbarSparklineSetting: "HbarSparkline设置",
        vbarSparklineSetting: "VbarSparkline设置",
        value: "值",
        colorScheme: "主题颜色"
    };

    cn_res.variSparklineDialog = {
        variSparklineSetting: "VariSparkline设置",
        variance: "方差",
        reference: "参考",
        mini: "最小",
        maxi: "最大",
        mark: "标记",
        tickunit: "刻度单位",
        legend: "图例",
        colorPositive: "正数颜色",
        colorNegative: "负数颜色",
        vertical: "垂直"
    };
    cn_res.boxplotSparklineDialog = {
        boxplotSparklineSetting: "BoxPlotSparkline设置",
        points: "点",
        boxPlotClass: "方块图类",
        showAverage: "显示平均",
        scaleStart: "刻度起始",
        scaleEnd: "刻度终止",
        acceptableStart: "可接受起始",
        acceptableEnd: "可接受终止",
        colorScheme: "主题颜色",
        style: "样式",
        vertical: "垂直",
        fiveNS: "5NS",
        sevenNS: "7NS",
        tukey: "Tukey",
        bowley: "Bowley",
        sigma: "西格玛3",
        classical: "传统",
        neo: "新"
    };
    cn_res.cascadeSparklineDialog = {
        cascadeSparklineSetting: "CascadeSparkline设置",
        pointsRange: "点范围",
        pointIndex: "点指数",
        labelsRange: "标签范围",
        minimum: "最小值",
        maximum: "最大值",
        colorPositive: "正数颜色",
        colorNegative: "负数颜色",
        vertical: "垂直"
    };

    cn_res.multiCellFormula = {
        warningText: "选择区域中可能包含不同的公式类别。请选择一个新区域。"
    };

    cn_res.paretoSparklineDialog = {
        paretoSparklineSetting: "ParetoSparkline设置",
        points: "点",
        pointIndex: "点指数",
        colorRange: "颜色范围",
        target: "目标",
        target2: "目标2",
        highlightPosition: "高亮位置",
        label: "标签",
        vertical: "垂直",
        none: "无",
        cumulated: "堆叠",
        single: "单个"
    };

    cn_res.sliderPanel = {
        title: "字段列表"
    };

    cn_res.protectionOptionDialog = {
        title: "包含工作表",
        label: "允许此工作表的所有用户进行:",
        allowSelectLockedCells: "选择锁定单元格",
        allowSelectUnlockedCells: "选择未锁定的单元格",
        allowSort: "排序",
        allowFilter: "使用自动筛选",
        allowResizeRows: "调整行大小",
        allowResizeColumns: "调整列大小",
        allowEditObjects: "编辑对象",
        allowDragInsertRows: "拖拽插入行",
        allowDragInsertColumns: "拖拽插入列",
        allowInsertRows: "插入行",
        allowInsertColumns: "插入列",
        allowDeleteRows: "删除行",
        allowDeleteColumns: "删除列"
    };

    cn_res.insertSlicerDialog = {
        insertSlicer: "插入切片器"
    };

    cn_res.formatSlicerStyle = {
        custom: "自定义",
        light: "浅色",
        dark: "深色",
        other: "其他",
        newSlicerStyle: "新建切片器样式...",
        slicerStyle: "切片器样式",
        name: "名称",
        slicerElement: "切片器元素",
        format: "格式",
        clear: "清除",
        preview: "预览",
        exception: "此样式名已存在。"
    };

    cn_res.slicerElement = {
        wholeSlicer: "整个切片器",
        header: "页眉",
        selectedItemWithData: "已选择带有数据的项目",
        selectedItemWithNoData: "已选择无数据的项目",
        unselectedItemWithData: "已取消选择带有数据的项目",
        unselectedItemWithNoData: "已取消选择无数据的项目",
        hoveredSelectedItemWithData: "悬停已选择的带有数据的项目",
        hoveredSelectedItemWithNoData: "悬停已选择的无数据的项目",
        hoveredUnselectedItemWithData: "悬停已取消选择的带有数据的项目",
        hoveredUnselectedItemWithNoData: "悬停已取消选择的无数据的项目"
    };

    cn_res.slicerSettingDialog = {
        slicerSetting: "切片器设置",
        sourceName: "源名称:",
        name: "名称:",
        header: "页眉",
        display: "显示页眉",
        caption: "标题:",
        items: "项目排序和筛选",
        ascending: "升序(最小到最大)",
        descending: "降序(最大到最小)",
        customList: "排序时使用自定义列表",
        hideItem: "隐藏没有数据的项",
        visuallyItem: "直观地指示空数据项",
        showItem: "最后显示空数据项"
    };

    cn_res.slicerPropertyDialog = {
        formatSlicer: "格式切片器",
        position: "位置和布局",
        size: "大小",
        properties: "属性",
        pos: "位置",
        horizontal: "水平:",
        vertial: "垂直:",
        disableResizingMoving: "禁用调整大小和移动",
        layout: "框架",
        numberColumn: "列数:",
        buttonHeight: "按钮高度:",
        buttonWidth: "按钮宽度:",
        height: "高度:",
        width: "宽度:",
        scaleHeight: "缩放高度:",
        scaleWidth: "缩放宽度:",
        moveSize: "大小和位置随单元格而变",
        moveNoSize: "大小固定，位置随单元格而变",
        noMoveSize: "大小和位置均固定",
        locked: "锁定"
    };
    cn_res.errorGroupDialog = {
        errorGroup: "错误的组合/取消组合",
        errorGroupMessage: "表单包含分组列，是否继续操作?"
    };
    cn_res.tableErrDialog = {
        tableToRange: "是否将表转换为普通区域?",
        insertTableInArrayFormula: "表中不允许存在多个单元格数组公式"
    };
    
    cn_res.chartErrorBar = {
        title: "自定义错误栏"
    };

    cn_res.chartErrorBarsDialog = {
        title: "添加误差线",
        label: "添加基于系列的误差线:"
    };

    cn_res.chartTrendlineDialog = {
        title: "添加趋势线",
        label: "添加基于系列的趋势线:"
    };

    cn_res.selectData = {
        changeDataRange: '图表数据区域:',
        switchRowColumn: '切换行/列',
        legendEntries: '图例项（系列）',
        moveUp: '上移',
        moveDown: '下移',
        horizontalAxisLabels: '水平（分类）轴标签',
        add: '添加',
        edit: '编辑',
        remove: '删除',
        selectDataSource: '选择数据源',
        addSeries: '编辑数据系列',
        editSeries: '编辑数据系列',
        editSeriesName: '编辑数据系列',
        editSeriesValue: '编辑数据系列',
        seriesName: '系列名称',
        seriesYValue: 'Y 轴系列值',
        seriesXValue: 'X 轴系列值',
        seriesSize: '系列气泡大小',
        errorPrompt: {
            cantRemoveLastSeries: "如果您想使用图表，请保证图表至少有一个系列。",
            seriesValueIsIllegal: '暂不支持的系列引用',
            cantSwitchRowColumn: "当前的数据区域不支持切换行/列",
            categoryValueIsIllegal: "暂不支持的分类引用",
            connectorShapeChangeShapeType: "不能改变线形类型"
        },
        noDataRange: '数据区域因太复杂而无法显示。如果选择新的数据区域，则将替换系列窗格中的所有系列。',
        hiddenEmptyButton: "隐藏和空单元格",
        gaps: "空距",
        zero: "零值",
        connectData: "用直线连接数据点",
        showEmptyCell: "空单元格显示为:",
        chartHiddenEmptyCell: "隐藏和空单元格设置",
        positive: "正误差值",
        negative: "负误差值"
    };

    cn_res.addChartElement = {
        axes: {
            axes: '坐标轴',
            moreAxisOption: '更多坐标轴选项'
        },
        axisTitles: {
            axisTitles: '坐标轴标题',
            moreAxisTitlesOption: '更多坐标轴标题选项'
        },
        chartTitle: {
            chartTitle: '图表标题',
            moreChartTitleOption: '更多图表标题选项'
        },
        gridLines: {
            gridLines: '网格线',
            moreGridLinesOption: '更多网格线选项'
        },
        dataLabels: {
            dataLabels: '数据标签',
            moreDataLabelsOption: '更多数据标签选项'
        },
        legend: {
            legend: '图例',
            moreLegendOption: '更多图例选项'
        },
        trendline: {
            trendline: '趋势线',
            moreTrendlineOption: '更多趋势线选项'
        },
        errorBar: {
            errorBar: '误差线'
        },
        primaryHorizontal: '主要横坐标轴',
        primaryVertical: '主要纵坐标轴',
        secondaryHorizontal: '次要横坐标轴',
        secondaryVertical: '次要纵坐标轴',
        none: '无',
        aboveChart: '图表上方',
        primaryMajorHorizontal: '主轴主要水平网格线',
        primaryMajorVertical: '主轴主要垂直网格线',
        primaryMinorHorizontal: '主轴次要水平网格线',
        primaryMinorVertical: '主轴次要垂直网格线',
        secondaryMajorHorizontal: '次轴主要水平网格线',
        secondaryMajorVertical: '次轴主要垂直网格线',
        secondaryMinorHorizontal: '次轴次要水平网格线',
        secondaryMinorVertical: '次轴次要垂直网格线',
        center: '居中',
        insideEnd: '数据标签内',
        outsideEnd: '数据标签外',
        bestFit: '最佳匹配',
        above: '上方',
        below: '下方',
        show: '显示',
        right: '右侧',
        top: '顶部',
        left: '左侧',
        bottom: '底部',
        errorBarStandardError: '标准误差',
        errorBarPercentage: '百分比',
        errorBarStandardDeviation: '标准偏差',
        moreErrorBarOption: '更多误差线设置...',
        trendlineLinear: '线形',
        trendlineExponential: '指数',
        trendlineLinearForecast: '线形预测',
        trendlineMovingAverage: '移动平均'
    };
    cn_res.InsertFunctionsChildrenDialog = {
        title: "函数参数"
    };
    cn_res.selectionError = {
        selectEmptyArea: "选择区域错误"
    };

    cn_res.name = "cn";

    designer.res = cn_res;

})();
