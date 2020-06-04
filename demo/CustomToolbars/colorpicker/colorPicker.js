function ColorPicker($container) {
    this.$colorPicker = $container;
    this.$header = $(".header", $container);
    this.$themeColorsContainer = $(".themeColorsContainer", $container);
    this.$standardColorsContainer = $(".standardColorsContainer", $container);
    this.$nofill = $(".nofill", $container);
    this.$autoColorPane = $(".autocolor", $container);
    this.$nofillColor = $(".nofill-Color", $container);
    this.$nofillText = $(".nofill-Text", $container);
    this.$autoColor = $(".auto-Color", $container);
    this.$autoText = $(".auto-Text", $container);
    this.defaultThemeColorNames = ["Background 1", "Text 1", "Background 2", "Text 2", "Accent 1", "Accent 2", "Accent 3", "Accent 4", "Accent 5", "Accent 6",
        "Background 1 80", "Text 1 80", "Background 2 80", "Text 2 80", "Accent 1 80", "Accent 2 80", "Accent 3 80", "Accent 4 80", "Accent 5 80", "Accent 6 80",
        "Background 1 60", "Text 1 60", "Background 2 60", "Text 2 60", "Accent 1 60", "Accent 2 60", "Accent 3 60", "Accent 4 60", "Accent 5 60", "Accent 6 60",
        "Background 1 40", "Text 1 40", "Background 2 40", "Text 2 40", "Accent 1 40", "Accent 2 40", "Accent 3 40", "Accent 4 40", "Accent 5 40", "Accent 6 40",
        "Background 1 -25", "Text 1 -25", "Background 2 -25", "Text 2 -25", "Accent 1 -25", "Accent 2 -25", "Accent 3 -25", "Accent 4 -25", "Accent 5 -25", "Accent 6 -25",
        "Background 1 -50", "Text 1 -50", "Background 2 -50", "Text 2 -50", "Accent 1 -50", "Accent 2 -50", "Accent 3 -50", "Accent 4 -50", "Accent 5 -50", "Accent 6 -50"];
    this.defaultStandColors = ["#C00000", "#FF0000", "#FFC000", "#FFFF00", "#92D050", "#00B050", "#00B0F0", "#0070C0", "#002060", "#7030A0"];
    this.defaultThemeColors = ["#FFFFFF", "#000000", "#E7E6E6", "#44546A", "#5B9BD5", "#ED7D31", "#A5A5A5", "#FFC000", "#4472C4", "#70AD47",
        "#F2F2F2", "#7F7F7F", "#D0CECE", "#D6DCE4", "#DEEBF6", "#FDF2EA", "#EDEDED", "#FFF8E5", "#D9E2F3", "#E2EFD9",
        "#D8D8D8", "#595959", "#AEABAB", "#ADB9CA", "#BDD7EE", "#FADECB", "#DBDBDB", "#FFEFBF", "#B4C6E7", "#C5E0B3",
        "#BFBFBF", "#3F3F3F", "#757070", "#8496B0", "#9CC3E5", "#F6BE97", "#C9C9C9", "#FFDF7F", "#8EAADB", "#A8D08D",
        "#A5A5A5", "#262626", "#3A3838", "#323F4F", "#2E75B5", "#F19D64", "#7B7B7B", "#FFCF3F", "#2F5496", "#538135",
        "#7F7F7F", "#0C0C0C", "#171616", "#222A35", "#1E4E79", "#EE8A45", "#525252", "#FEC619", "#1F3864", "#375623"];

    this.init();
}

ColorPicker.prototype.setHeader = function (headerText) {
    headerText = headerText || this.defaultHeader;
    this.$header.text(headerText);
}

ColorPicker.prototype.setNoFill = function (color, text) {
    if (color && text) {
        this.$nofillText.text(text);
        this.$nofillColor.css("background-color", color);
        this.$nofill.show();
    }
}

ColorPicker.prototype.setAutoColor = function (color, text) {
    if (color && text) {
        this.$autoText.text(text);
        this.$autoColor.css("background-color", color);
        this.$autoColor.show();
    }
}

ColorPicker.prototype.setStandColors = function (standColors) {
    standColors = standColors || this.defaultStandColors;
    var $cells = $(".color-cell", this.$standardColorsContainer);
    standColors.forEach(function (e, i) {
        var cell = $cells[i];
        $(cell).css("background-color", standColors[i]);
    });
}

ColorPicker.prototype.setThemeColors = function (themeColors) {
    themeColors = themeColors || this.defaultThemeColors;
    var $cells = $(".color-cell", this.$themeColorsContainer);
    themeColors.forEach(function (e, i) {
        var cell = $cells[i];
        $(cell).css("background-color", themeColors[i]);
    });
}


ColorPicker.prototype.setThemeColorNames = function (themeColorNames) {
    themeColorNames = themeColorNames || this.defaultThemeColorNames;
    var $items = this.$themeColorsContainer.children();
    themeColorNames.forEach(function (e, i) {
        var cell = $items[i];
        $(cell).attr("data-name", themeColorNames[i]);
    });
}

ColorPicker.prototype.init = function () {
    this.setHeader();
    this.setStandColors();
    this.setThemeColors();
    this.setThemeColorNames();

    $("div.colorPicker")
        .click(this.onClick)
        .mouseover(this.onMouseOver)
        .mouseleave(this.onMouseLeave);
}

ColorPicker.prototype.getContainer = function () {
    return this.$colorPicker;
}

ColorPicker.prototype.onClick = function (event) {
    var type;
    var $this = $(event.target);
    if ($(event.currentTarget).hasClass("nofill")) {
        type = "nofill";
    }
    if ($(event.currentTarget).hasClass("autocolor")) {
        type = "autocolor";
    }
    // TODO, uncomment if get when shouldn't tirgger event  
    //if (event.target == event.currentTarget) {
    //    return;
    //}
    if ($this.hasClass("color-cell")) {
        $this.addClass("selected");
    }
    var eventData = { type: type, color: $this.css("background-color"), themeColor: $this.data('name') };
    $this.trigger("colorSelected", eventData);
}

ColorPicker.prototype.setCellSelected = function (target) {
    $(target).addClass("selected");
}

ColorPicker.prototype.show = function (position, options, selectedColor) {
    var $colorPicker = this.$colorPicker;
    
    if (position) {
        var value = +position.top;
        if (!isNaN(value)) {
            $colorPicker.css("top", value);
        }
        
        value = +position.left;
        if (!isNaN(value)) {
            $colorPicker.css("left", value);
        }
    }
    
    options = options || {};
    
    var $header = this.$header,
        header = options.header;
    if (header) {
        this.setHeader(header);
        $header.show();
    }
    else {
        $header.hide();
    }

    var color = options.nofillColor, text = options.nofillText;
    
    var $nofill = this.$nofill;
    if (color && text) {
        this.setNoFill(color, text);
        $nofill.show();
    }
    else {
        $nofill.hide();
    }

    color = options.autoColor, text = options.autoText;
    
    var $autoColorPane = this.$autoColorPane;
    
    if (color && text) {
        this.setAutoColor(color, text);
        $autoColorPane.show();
    }
    else {
        $autoColorPane.hide();
    }
    
    $colorPicker.show();
    
    if (selectedColor) {
        var $items = $(".color-cell", this.$themeColorsContainer)
            .filter(function () {
                return $(this).attr("data-name") === selectedColor;
            });

        if ($items.length === 0) {
            $items = $(".color-cell", this.$standardColorsContainer)
                .filter(function () {
                    return $(this).css('background-color') === selectedColor;
                });
        }

        if ($items.length > 0) {
            this.setCellSelected($items[0]);
        }
    }
}

ColorPicker.prototype.hide = function () {
    var $colorPicker = this.$colorPicker;
    
    $colorPicker.hide();
    $(".color-cell.selected", $colorPicker).removeClass("selected");
}

ColorPicker.prototype.isVisible = function () {
    return this.$colorPicker.is(":visible");
}

var namesForCheckTheme = ["Accent 4", "Accent 5", "Accent 6"];
// Get information for check same theme: name and some colors for check
function getThemeInfo(theme, fnGetColor) {
    var result = namesForCheckTheme.map(function(name) {
        return fnGetColor(name);
    });
    result.unshift(theme.name());
    return result;
}

// Check if the current theme is same as specified one, if not update current one
ColorPicker.prototype.isThemeChanged = function (theme, fnGetColor) {
    var currentThemeInfo = this.currentThemeInfo;
    var newThemeInfo = getThemeInfo(theme, fnGetColor);
    if (!currentThemeInfo || currentThemeInfo[0] !== newThemeInfo[0]) {
        this.currentThemeInfo = newThemeInfo;
        return true;
    }
    for(var i = 1, len = newThemeInfo.length; i < len; i++) {
        if (newThemeInfo[i] !== currentThemeInfo[i]) {
            this.currentThemeInfo = newThemeInfo;
            return true;
        }
    }
    return false;
};

// Update theme colors if the current theme is not same as the one used by the specified sheet
ColorPicker.prototype.updateThemeColors = function (sheet) {
    var theme = sheet && sheet.currentTheme && sheet.currentTheme();
    if (theme) {
        var themeColors = theme.colors(), getColor = themeColors.getColor.bind(themeColors);
        if (this.isThemeChanged(theme, getColor)) {
            var colors = this.defaultThemeColorNames.map(function(name) {
                return getColor(name);
            });
            this.setThemeColors(colors);
        }
    }
};