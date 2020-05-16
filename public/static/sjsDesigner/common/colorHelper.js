(function () {
    'use strict';
    var designer = GC.Spread.Sheets.Designer;
    var ColorHelper = (function () {
        function ColorHelper() {
        }

        ColorHelper.isThemeColor = function (theme, colorString) {
            return theme.getColor(colorString) !== colorString;
        };
        ColorHelper.hexToRgb = function (hex) {
            var color = [], rgb = [];
            hex = hex.replace(/#/, "");
            var i;
            if (hex.length === 3) { // transform "#abc" to "#aabbcc"
                var tmp = [];
                for (i = 0; i < 3; i++) {
                    tmp.push(hex.charAt(i) + hex.charAt(i));
                }
                hex = tmp.join("");
            }
            for (i = 0; i < 3; i++) {
                color[i] = "0x" + hex.substr(i * 2, 2);
                rgb.push(parseInt(Number(color[i])));
            }
            return "rgb(" + rgb.join(",") + ")";
        };

        ColorHelper.hexToRgba = function (hex) {
            var color = [], rgb = [];

            hex = hex.replace(/#/, "");
            var i;
            if (hex.length === 3) { // transform "#abc" to "#aabbcc"
                var tmp = [];
                for (i = 0; i < 3; i++) {
                    tmp.push(hex.charAt(i) + hex.charAt(i));
                }
                hex = tmp.join("");
            }

            for (i = 0; i < 3; i++) {
                color[i] = "0x" + hex.substr(i * 2, 2);
                rgb.push(parseInt(Number(color[i])));
            }
            return "rgba(" + rgb.join(",") + ",1)";
        };

        ColorHelper.parse = function (color, theme) {
            if (!color) {
                return null;
            }

            if (ColorHelper.rrggbbPattern.test(color) || ColorHelper.rgbPattern.test(color) || ColorHelper.rgbFunctionPattern.test(color) || ColorHelper.rgbaFunctionPattern.test(color) || ColorHelper.standardColorNames.indexOf(color.toLowerCase()) > -1) { //NOSONAR complexExpression
                return {
                    baseColor: color,
                    color: color
                };
            }

            var baseColorName;

            var index = -1;
            var t = color.split(' ');
            if (t) {
                if (t.length > 1) {
                    if (t[0] === undefined || t[0] === null) {
                        throw 'invalid color name.';
                    }
                    var cn1 = t[0].toLowerCase();
                    if (cn1 === "background") {
                        index = parseInt(t[1], 10) - 1;
                    } else if (cn1 === "text") {
                        index = parseInt(t[1], 10) + 1;
                    } else if (cn1 === "accent") {
                        index = parseInt(t[1], 10) + 3;
                    } else {
                        throw 'invalid color name.';
                    }
                    baseColorName = t[0] + ' ' + t[1];
                } else if (t.length === 1) {
                    if (t[0] === undefined || t[0] === null) {
                        throw 'invalid color name.';
                    }
                    var cn2 = t[0].toLowerCase();
                    if (cn2 === 'transparent') {
                        return {
                            color: 'rgba(0,0,0,0)'
                        };
                    }
                    if (cn2 !== "hyperlink" && cn2 !== "followedHyperlink") {
                        throw 'invalid color name.';
                    }
                    baseColorName = t[0];
                }
                var tint = 0;
                if (t.length > 2) {
                    tint = parseInt(t[2], 10);
                }

                if (index >= 0 && index <= 11) {
                    return {
                        name: color,
                        baseColor: theme.getColor(baseColorName),
                        tint: tint,
                        color: theme.getColor(color)
                    };
                }
            }
            throw 'invalid color name.';
        };
        ColorHelper.rrggbbPattern = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
        ColorHelper.rgbPattern = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;
        ColorHelper.rgbFunctionPattern = /^rgb\(([\s\d]*),([\s\d]*),([\s\d]*)\)$/i;
        ColorHelper.rgbaFunctionPattern = /^rgba\(\d+, *\d+, *\d+, *\d+\.?\d*\)$/i;
        ColorHelper.standardColorNames = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred?", "indigo?", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"];
        return ColorHelper;
    })();
    designer.ColorHelper = ColorHelper;
})();