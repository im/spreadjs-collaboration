    function Ribbon(options, element, colorPicker) {
        this.options = options;
        this.$target = $(element);
        this.colorPicker = colorPicker;
        this.$colorPickerContainer = colorPicker.getContainer();
        this.$colorPicker = $(colorPicker);
        this.create();
    }

    Ribbon.prototype.trigger = function (name, value) {
        $(this).trigger(name, value);
    };

    // process string will set to data-value attribute
    function getDataAttributeString(value) {
        if (value && typeof value == "string" && value.indexOf('"') !== -1) {
            value = value.replace(/"/g, '\\"');
        }
        return value;
    }
    Ribbon.getDataAttributeString = getDataAttributeString;     // TODO, move to util module

    Ribbon.prototype.create = function () {
        var self = this,
            result = [],
            data = self.options,
            $target = self.$target;

        result.push(createTabs(data));

        result.push(createTabItems(data));

        $(result).appendTo($target);

        $target.data('ribbon', self);

        $target.on('shown.bs.tab', function () {
            self.resize();
        });

        var $nav = $('ul.nav', $target);

        $('#tabDropdown ul.dropdown-menu').on('click', 'li', function () {
            var index = $(this).closest('li').data('index'),
                $lis = $('#tabDropdown').prevAll('li:visible'),
                $last = $lis.first(),
                navHeight = $nav.height();

            $last.hide();
            $target.data('skiptab', true);
            var $new = $($('li', $nav)[index]);
            $new.show();
            $('a', $new).tab('show');

            $(this).remove();
            addTabDropdownItem($last);

            // new item is too wide to replace last tab, hide the previous tab too
            if ($nav.height() !== navHeight) {
                var $next = $last.prev('li:visible');
                $next.hide();
                addTabDropdownItem($next);
            }
        });

        function createTabLink(href, title) {
            return $('<a data-toggle="tab"></a>').attr('href', '#' + href).text(title);
        }

        function createTabs(options) {
            var selected = options.selected,
                $ul = $('<ul class="nav nav-tabs"></ul>');

            options.tabs.forEach(function (tab, index) {
                var title = tab.title,
                  href = tab.name;

                var $li = $('<li></li>');
                if (selected === index) {
                    $li.addClass('active');
                }
                if (tab.hidden) {
                    $li.addClass('hidden');
                }
                $li.append(createTabLink(href, title)).appendTo($ul);
            });

            $ul.append($('<li class="hidden" id="tabDropdown"><button class="btn-icon dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-menu-down icon-tab-dropdown"></span> </button><ul class="dropdown-menu"></ul></li>'));

            return $ul[0];
        }

        function createTabItems(options) {
            var result = [],
              selected = options.selected;

            var $div = $('<div class="tab-content"></div>');

            options.tabs.forEach(function (tab, index) {
                var title = tab.title,
                  href = tab.name,
                  groups = tab.groups;

                var $divPane = $('<div class="tab-pane"></div>');
                if (selected === index) {
                    $divPane.addClass('in active');
                }

                $divPane.attr('id', href);

                if (tab.collapse) {
                    $divPane.data('collapse', tab.collapse);
                    if (tab.groupCollapseItems) {
                        $divPane.data('groupCollapseItems', tab.groupCollapseItems);
                    }
                }

                if (groups && groups.length) {
                    groups.forEach(function (g, i) {
                        var $divGroup = $('<div class="group"></div>');
                        if (i > 0) {
                            $divGroup.addClass('h-divider');
                        }

                        var tools = g.tools;
                        var dropdowns = [];
                        if (tools && tools.length) {
                            tools.forEach(function (item, index) {
                                if(!item.ignore) {
                                    createGroupItem(item, $divGroup, index);
                                    // dropdown with merged items need process after group done
                                    if(item.type === "dropdown" && item.items && item.items.length) {
                                        dropdowns.push(item);
                                    }
                                }
                            });
                        }

                        if($divGroup.children().length > 0) {
                            dropdowns.container = $divGroup;
                            dropdowns.forEach(prepareDropdownItems);
                            $divPane.append($divGroup);
                        }
                    });
                }

                $div.append($divPane);
            });

            return $div[0];
        }

        function createCheckBox(options, $parent) {
            var $label = $('<label class="checkbox-inline"></label>'),
                $checkbox = $('<input type="checkbox">'),
                name = options.name;

            $label.append($checkbox);

            if (options.checked) {
                $checkbox.prop('checked', true);
            }

            if (options.collapseGroup) {
                $label.addClass(options.collapseGroup);
            }

            $label.append($('<span />').text(options.text))
              .attr('data-name', name)
              .attr('title', options.tooltip)
              .appendTo($parent);

            $checkbox.on('click', function (e) {
                var eventData = { name: name, value: $checkbox.prop('checked'), checkbox: true };
                self.trigger('click', eventData);
            });
        }

        function createInput(options, $parent) {
            var $label = $('<label class="input-label"></label>'),
                $input = $('<input type="text">'),
                name = options.name;

            $label.append($('<span />').text(options.text))
                        .appendTo($parent);

           $input.attr('data-name', name).appendTo($label);

            $input.on('blur', function (e) {
                var eventData = { name: name, value: $input.val(), $element: $input };
                self.trigger('textChanged', eventData);
            });
        }

        function createIconButton(options, $parent, index) {
            var $btn = $('<button><span></span><label></label></button>'),
              name = options.name,
              text = options.text || name.toUpperCase(),
              title = options.tooltip || text,
              header = options.header || text,
                toggle = options.toggle;

            $btn.attr('data-name', name).attr('title', title).addClass('btn btn-icon ' + (options.collapseGroup || '') + (options.nolabel ? ' nolabel ' : '') +  (options.toggle ? ' toggle ' + (options.checked ? ' on ' : '') : ''));
            $btn.data('order', index);
            $('span', $btn).addClass(options.iconClass);
            $('label', $btn).text(text);

            if (options.toggle && options.tooltips) {
                // save tooltips ([off, on]) need change when toggle state
                var tooltips = options.tooltips;
                $btn.data('tooltips', options.tooltips);
                $btn.attr('title', tooltips[options.checked ? 1 : 0]);
            }

            if (options.toggleGroup) {
                $btn.attr('data-toggle-group', options.toggleGroup);
            }

            $btn.data('header', header);
            $btn.appendTo($parent);

            $btn.on('click', function (e) {
                $(this).parents('div.dropdown.open').data('keepopen', false);

                var eventData = { name: name, header: header };
                if ($btn.hasClass('toggle')) {
                    processToggleGroup($btn);

                    $btn.toggleClass('on');
                    eventData.toggle = true;
                    eventData.value = $btn.hasClass('on');

                    var tooltips = $btn.data('tooltips');
                    if (tooltips) {
                        $btn.attr('title', tooltips[eventData.value ? 1 : 0]);
                    }
                }
                self.trigger('click', eventData);
            });
        }

        function createDropdownButton(options, $parent, index) {
            var $div = $('<div class="group dropdown"><button class="btn-icon dropdown-toggle" data-toggle="dropdown"><span></span></button></div>'),
                $button = $('button', $div),
                $span = $('span', $button).addClass(options.iconClass),
                name = options.name;

                // save data for change icon when all items merged into the dropdown
                if(options.altIconClass) {
                    $span.data('classes', [options.iconClass, options.altIconClass]);
                    $div.addClass('alt-icon');
                }

            $div.data('order', index);

            $button.addClass(options.collapseGroup || '')
              .attr('data-name', name)
              .attr('title', options.tooltip || options.text);

            createDropdownMenu(options, $parent, $div);

            $parent.append($div);
            $parent.data('dropdown', $div);

            $div.on('hide.bs.dropdown', function (e) {
                var data = $div.data();

                if (data.keepopen) {
                    // do as default when click on itself for close
                    if ($div[0] === e.target) { return false; }

                    // prevent close
                    e.stopPropagation();
                    e.preventDefault();

                    // delay close
                    if (data.dropdownClosed || $(e.target).hasClass("open")) {
                        $div.data({ keepopen: false, dropdownClosed: true });
                    }
                } else {
                    // delay close
                    if (data.dropdownClosed) {
                        $div.data({ dropdownClosed: false });
                        return false;
                    }
                    self.colorPicker.hide();
                }
            });

            $div.on('shown.bs.dropdown', function (e) {
                adjustDropdownPosition($div);
            });
        }

        function createButtonGroup(options, $parent, index) {
            var $div = $('<div class="btn-group group-container"></div>');

            $div.data('order', index);
            $div.attr('title', options.tooltip || options.text);

            if (options.collapseGroup) {
                $div.addClass(options.collapseGroup);
            }

            if (options.centerAlign) {
                $div.addClass('center-align');
            }

            if (options.items && options.items.length > 0) {
                options.items.forEach(function (item, i) {
                    switch (item.type) {
                        case 'input-group':
                            createInputGroup(item, $div);
                            break;

                        case 'icon-group':
                            createIconGroup(item, $div);
                            break;

                        case 'setcolor-group':
                            createSetColorGroup(item, $div);
                            break;

                        case 'dropdown-only':
                            createDropdownOnly(item, $div);
                            break;
                        case 'dropdown-colorTemplate':
                            createDropdownColorTemplate(item, $div);
                            break;
                        case 'dropdown-addChartElement':
                            createDropdownChartElement(item, $div);
                            break;
                        case 'dropdown-quickLayout':
                            createDropdownChartQuickLayout(item, $div);
                            break;
                        case 'shape-panel':
                            createShapePanel(item, $div);
                            break;
                    }
                });
            }

            $parent.append($div);
        }

        function createShapePresetColor(options, $parent) {
            var $container = $('<div class="btn-group" style="border-right: 1px solid #a3a3a3"></div>');
            $parent.append($container);
            options.items.forEach(function(item) {
                var inlineStyle = 'background-color: '+ item.value;
                var $button = $('<button class="btn btn-icon" title="' + item.text + '">'
                + '<span class="shape-preset-color" style="' + inlineStyle + '">Abc</span>'
                + '</button>');
                $button.on('click' ,function(e) {
                    self.trigger('click', {
                        name: options.name,
                        value: item.value,
                        element: this
                    });
                });
                $container.append($button);
            });
        }

        function createShapePanel(options, $parent) {
            var name = options.name;

            var $dropdownGroup = $(
                '<div class="btn-group"> '
                + '<button type="button" class="btn btn-default dropdown-toggle btn-dropdown-only" data-toggle="dropdown"> '
                + '<span class="' + options.iconClass + '"/>'
                + '<label>' + name + '</label>'
                + '</button> '
                + '</div>');

            $dropdownGroup.attr('data-name', name);

            $parent.append($dropdownGroup);

            var $shapeContainer = $('<div class="dropdown-menu"></div>')
                .css({
                    'position': 'absolute',
                    'top': '45px',
                    'left': '0px'
                });


            // var hiddenShapes = [
            //     'lineCallout1',
            //     'lineCallout1AccentBar',
            //     'lineCallout1NoBorder',
            //     'lineCallout1BorderandAccentBar',
            //     'actionButtonCustom', 'balloon',
            //     'none'
            // ];
            var connectorShapes = ['noHeadStraight', 'endArrowHeadStraight', 'beginEndArrowHeadStraight', 'Elbow', 'endArrowHeadElbow', 'beginEndArrowHeadElbow']
            var basicShapes = [ 'parallelogram', 'trapezoid', 'diamond', 'octagon', 'isoscelesTriangle',
                'rightTriangle', 'oval', 'hexagon', 'cross', 'regularPentagon', 'can', 'cube', 'bevel', 'foldedCorner', 'smileyFace',
                'donut', 'noSymbol', 'blockArc', 'heart', 'lightningBolt', 'sun', 'moon', 'arc', 'doubleBracket', 'doubleBrace', 'plaque',
                'leftBracket', 'rightBracket', 'leftBrace', 'rightBrace', 'actionButtonHome', 'actionButtonHelp', 'actionButtonInformation',
                'actionButtonBackorPrevious', 'actionButtonForwardorNext', 'actionButtonBeginning', 'actionButtonEnd', 'actionButtonReturn',
                'actionButtonDocument', 'actionButtonSound', 'actionButtonMovie', 'diagonalStripe', 'pie', 'nonIsoscelesTrapezoid', 'decagon',
                'heptagon', 'dodecagon', 'star6Point', 'star7Point', 'star10Point', 'star12Point', 'frame', 'halfFrame', 'tear', 'chord', 'corner',
                'cornerTabs', 'squareTabs', 'plaqueTabs', 'gear6', 'gear9', 'funnel', 'pieWedge', 'cloud', 'chartX', 'chartStar', 'chartPlus', 'lineInverse'];
            var blockArrows = ['rightArrow', 'leftArrow', 'upArrow', 'downArrow', 'leftRightArrow', 'upDownArrow', 'quadArrow',
                'leftRightUpArrow', 'bentArrow', 'uTurnArrow', 'leftUpArrow', 'bentUpArrow', 'curvedRightArrow',
                'curvedLeftArrow', 'curvedUpArrow', 'curvedDownArrow', 'stripedRightArrow', 'notchedRightArrow',
                'pentagon', 'chevron', 'rightArrowCallout', 'leftArrowCallout', 'upArrowCallout', 'downArrowCallout',
                'leftRightArrowCallout', 'upDownArrowCallout', 'quadArrowCallout', 'circularArrow', 'leftCircularArrow',
                'leftRightCircularArrow', 'swooshArrow'];
            var flowchart = ['flowchartProcess',
                'flowchartAlternateProcess', 'flowchartDecision', 'flowchartData', 'flowchartPredefinedProcess', 'flowchartInternalStorage',
                'flowchartDocument', 'flowchartMultidocument', 'flowchartTerminator', 'flowchartPreparation', 'flowchartManualInput',
                'flowchartManualOperation', 'flowchartConnector', 'flowchartOffpageConnector', 'flowchartCard', 'flowchartPunchedTape',
                'flowchartSummingJunction', 'flowchartOr', 'flowchartCollate', 'flowchartSort', 'flowchartExtract', 'flowchartMerge',
                'flowchartStoredData','flowchartDelay', 'flowchartSequentialAccessStorage', 'flowchartMagneticDisk', 'flowchartDirectAccessStorage',
                'flowchartDisplay', 'flowchartOfflineStorage'];
            var callOuts = ['rectangularCallout', 'roundedRectangularCallout', 'ovalCallout', 'cloudCallout', 'lineCallout2','lineCallout3',
                'lineCallout4', 'lineCallout2AccentBar', 'lineCallout3AccentBar', 'lineCallout4AccentBar', 'lineCallout2NoBorder',
                'lineCallout3NoBorder', 'lineCallout4NoBorder', 'lineCallout2BorderandAccentBar', 'lineCallout3BorderandAccentBar', 'lineCallout4BorderandAccentBar'];
            var rectangles = ['roundedRectangle', 'rectangle', 'round1Rectangle', 'round2SameRectangle', 'round2DiagRectangle', 'snipRoundRectangle',
                'snip1Rectangle', 'snip2SameRectangle', 'snip2DiagRectangle'];
            var equation = ['mathPlus', 'mathMinus', 'mathMultiply', 'mathDivide', 'mathEqual', 'mathNotEqual'];
            var starsAndBanners = ['explosion1', 'explosion2', 'shape4pointStar', 'shape5pointStar', 'shape8pointStar', 'shape16pointStar', 'shape24pointStar',
                'shape32pointStar', 'upRibbon', 'downRibbon', 'curvedUpRibbon', 'curvedDownRibbon', 'leftRightRibbon', 'verticalScroll', 'horizontalScroll', 'wave',
                'doubleWave']

            var panelGroups = [
                {name: 'connector', value: 'connector', items: connectorShapes},
                {name: 'rectangles', value: 'shape', items: rectangles},
                {name: 'basicShapes', value: 'shape', items: basicShapes},
                {name: 'blockArrows', value: 'shape', items: blockArrows},
                {name: 'equationShapes', value: 'shape', items: equation},
                {name: 'flowchart', value: 'shape', items: flowchart},
                {name: 'starsAndBanners', value: 'shape', items: starsAndBanners},
                {name: 'callouts', value: 'shape', items: callOuts}
            ];


            panelGroups.forEach(function(_group){
                var $groupContainer = $('<div class="shape-group-container">'
                    +'<h5>' + uiResource.shape[_group.name] + '</h3>'
                    +'<div class="shape-items-container"></div>'
                    +'</div>');
                var $itemsContainer = $groupContainer.find('.shape-items-container');
                _group.items.forEach(function(item){
                    var $button = $('<button class="btn btn-icon"><span class="shape-icon shape-' + item + '"></span></button>')

                    $button.on('click' ,function(e) {
                        self.trigger('click', {
                            name: options.value,
                            value: item,
                            group: _group.value,
                            element: this
                        });
                    });
                    $itemsContainer.append($button);
                });
                $shapeContainer.append($groupContainer);
            });

            $dropdownGroup.append($shapeContainer);

            $dropdownGroup.on('show.bs.dropdown', function (e) {
                self.trigger('dropdown', { name: name, open: true, dropdown: this, originalEvent: e});
            });

            $dropdownGroup.on('shown.bs.dropdown', function (e) {
                adjustDropdownPosition($dropdownGroup);
            });
        }

        function createDropdownColorTemplate(options, $parent) {
            var $dropdownGroup = $('<div class="btn-group"> <button type="button" class="btn btn-default dropdown-toggle btn-dropdown-only icon-group" data-toggle="dropdown"> <span /> </button> </div>');

            var name = options.name;

            $('span', $dropdownGroup).addClass(options.iconClass);
            $dropdownGroup.attr('data-name', name);

            if (options.haslabel && options.text) {
                $dropdownGroup.addClass('group');
                $('<label></label>').text(options.text).appendTo($('button', $dropdownGroup));
            }

            $parent.append($dropdownGroup);

            $dropdownGroup.append($("#chart-color-picker").css({
                'position': 'absolute',
                'top': '45px',
                'left': '0px'
            }).addClass("dropdown-menu"));

            $dropdownGroup.on('show.bs.dropdown', function (e) {
                self.trigger('dropdown', { name: name, open: true, dropdown: this, originalEvent: e });
            });

            $dropdownGroup.on('shown.bs.dropdown', function (e) {
                adjustDropdownPosition($dropdownGroup);
            });

        }

        function createDropdownChartElement(options, $parent) {
            var $dropdownGroup = $('<div class="btn-group"> <button type="button" class="btn btn-default dropdown-toggle btn-dropdown-only icon-group" data-toggle="dropdown"> <span /> </button> </div>');

            var name = options.name;

            $('span', $dropdownGroup).addClass(options.iconClass);
            $dropdownGroup.attr('data-name', name);

            if (options.haslabel && options.text) {
                $dropdownGroup.addClass('group');
                $('<label></label>').text(options.text).appendTo($('button', $dropdownGroup));
            }

            $parent.append($dropdownGroup);

            var $addChartElementContainer = $("#chart-add-element").css({
                'position': 'absolute',
                'top': '45px',
                'left': '0px'
            }).addClass("dropdown-menu");

            var addChartElement = new AddChartElement($addChartElementContainer[0]);

            $dropdownGroup.append($addChartElementContainer);


            $dropdownGroup.on('show.bs.dropdown', function (e) {
                self.trigger('dropdown', { name: name, open: true, dropdown: this, originalEvent: e, addChartElement: addChartElement});
            });

            $dropdownGroup.on('shown.bs.dropdown', function (e) {
                adjustDropdownPosition($dropdownGroup);
            });
        }

        function createDropdownChartQuickLayout(options, $parent) {
            var $dropdownGroup = $('<div class="btn-group"> <button type="button" class="btn btn-default dropdown-toggle btn-dropdown-only icon-group" data-toggle="dropdown"> <span /> </button> </div>');

            var name = options.name;

            $('span', $dropdownGroup).addClass(options.iconClass);
            $dropdownGroup.attr('data-name', name);

            if (options.haslabel && options.text) {
                $dropdownGroup.addClass('group');
                $('<label></label>').text(options.text).appendTo($('button', $dropdownGroup));
            }

            $parent.append($dropdownGroup);

            var $chartLayoutListContainer = $(".chart-layout-list-container").css({
                'position': 'absolute',
                'top': '45px',
                'left': '0px'
            }).addClass("dropdown-menu");

            var chartLayoutPicker = new ChartLayoutPicker($chartLayoutListContainer, undefined, function (e, value) {
                app.doAction('setChartLayout', {
                    layouts: value
                });
            });

            $dropdownGroup.append($chartLayoutListContainer);


            $dropdownGroup.on('show.bs.dropdown', function (e) {
                self.trigger('dropdown', { name: name, open: true, dropdown: this, originalEvent: e, chartLayoutPicker: chartLayoutPicker});
            });

            $dropdownGroup.on('shown.bs.dropdown', function (e) {
                adjustDropdownPosition($dropdownGroup);
            });
        }

        function createInputGroup(options, $parent) {
            // TODO: remove readonly from inupt when support autocomplete input
            var $button = $('<button type="button" class="btn btn-default input-group"> <input type="text" class="input-group" readonly> </button>'),
                $input = $('input', $button),
                $dropdownGroup = $('<div class="btn-group"> <button type="button" class="btn btn-default dropdown-toggle btn-dropdown-only" data-toggle="dropdown"> <span class="caret" /> </button> </div>');

            var name = options.name;

            $input.attr('data-name', name).css({ width: options.width });
            $dropdownGroup.attr('data-name', name);

            $parent.append($button);
            $parent.append($dropdownGroup);

            createDropdownListMenu(options, $dropdownGroup, name, $input);

            $dropdownGroup.on('click', function (e) {
                var $target = $(e.target);

                if ($target.is('button') || $target.parent().is('button')) {
                    if ($(this).parents('li.item').length > 0) {
                        $(this).parents('div.dropdown.open').data({ keepopen: true });
                    }
                } else {
                    if ($target.is('div.dropdown-backdrop')) {
                        $dropdownGroup.removeClass('open');
                        $(this).parents('div.dropdown.open').data({ dropdownClosed: true });
                        return;
                    }
                }
            });

            // select menu item with matched input
            $dropdownGroup.on('show.bs.dropdown', function (e) {
                var value = $input.val();

                $('li', $dropdownGroup).removeClass('selected');

                if (value) {
                    var items = $('li>a', $dropdownGroup).filter(function () { return $(this).text() === value; });

                    if (items.length > 0) {
                        $(items[0]).parent().addClass('selected');
                    }
                }
            });

            $dropdownGroup.on('shown.bs.dropdown', function (e) {
                // make selected dropdown item visible by scroll
                var items = $('li.selected', $dropdownGroup);
                if (items.length > 0) {
                    items[0].scrollIntoView();
                }

                adjustDropdownPosition($dropdownGroup);
            });
        }

        function createDropdownListMenu(options, $parent, header, $input) {
            function addIconTextItem(settings, $parent) {
                var $btn = $('<button class="btn btn-icon"><span></span></button>'),
                    text = settings.text;

                $('span', $btn).addClass(settings.iconClass);
                if(!settings.hiddenLabel) {
                    $btn.append('<label>' + text + '</label>')
                }

                $btn.appendTo($parent);
            }

            var $ul = $('<ul class="dropdown-menu"></ul>'), hasIconTextItem;

            if(options.name === 'insertChart' || options.name === 'typeChart') {
                $ul.addClass(options.name);
            }

            if(options && options.item !== undefined) {
                $ul.css({"top": (8 + options.index * 45) + "px"});
                options = options.item;
                $ul.addClass(options.name);
            }


            options.dropdown.forEach(function (v, i) {
                var $li;

                if (v) {
                    $li = $('<li></li>');
                    var $a = $('<a></a>');

                    var text = v.text || v,
                        value = v.value || v,
                        iconClass = v.iconClass;
                    $li.attr('data-value', getDataAttributeString(value));

                    var $btn;
                    if (iconClass) {
                        hasIconTextItem = true;
                        addIconTextItem({iconClass: iconClass, text: v.header||text, hiddenLabel: v.hiddenLabel}, $li);
                     } else {
                        if (v.toggle) {
                            $btn = $('<button class="toggle toggle-item"> <label></label> </button>');

                            $('label', $btn).text(text);
                            $btn.attr('data-name', value);

                            if (v.checked) {
                                $btn.addClass('on');
                            }

                            $btn.appendTo($li);
                        } else {
                            $a.text(text).appendTo($li);
                        }
                    }

                    // if(children) {
                    //     children.forEach(function (node) {
                    //
                    //     })
                    //     $li = $('<li></li>');
                    //     var $a = $('<a></a>');
                    //
                    //     var text = v.text || v,
                    //         value = v.value || v,
                    //         children = v.childrenList || v;
                    //     iconClass = v.iconClass;
                    // }

                    $li.on('click', function (e) {
                        var $tempLi = $($(e.target).parent()).is('li') ? $($(e.target).parent()) : $($(e.target).parent().parent());
                        var subTempValue = $tempLi.data().value;
                        if(options.name === 'insertChart' || options.name === 'typeChart') {
                            var result = adjustSubMenu(subTempValue);
                            if(result === true) {
                                return;
                            }
                        }
                        // ignore disalbed items
                        var $li = $(this);
                        if ($li.hasClass('disabled')) {
                            return;
                        }

                        var checked;

                        if ($btn && $btn.hasClass('toggle')) {
                            $btn.toggleClass('on');
                            checked = $btn.hasClass('on');
                        }

                        text = $('a', this).text() || text;
                        if ($input) {
                            $input.val(text);
                        }
                        self.trigger('click', { name: options.name, value: value, text: v.findCss || text, checked: checked, header: header, element: this });
                    });
                } else {
                    $li = $('<li class="divider"></li>');
                }

                $ul.append($li);
            });

            if (hasIconTextItem) {
                $ul.addClass("icon-text");
            }

            if (options.minWidth) {
                $ul.css({"min-width": options.minWidth});
            }

            $parent.append($ul);
        }

        function adjustSubMenu(value) {
            switch(value) {
                case "clusteredColumn":
                case "stackedColumn":
                case "100%StackedColumn":
                case "line":
                case "stackedLine":
                case "100%StackedLine":
                case "lineWithMarkers":
                case "stackedLineWithMarkers":
                case "100%StackedLineWithMarkers":
                case "columnClustered":
                case "columnStacked":
                case "columnStacked100":
                case "lineStacked":
                case "lineStacked100":
                case "lineMarkers":
                case "lineMarkersStacked":
                case "lineMarkersStacked100":
                case "pie":
                case "doughnut":
                case "clusteredBar":
                case "stackedBar":
                case "100%StackedBar":
                case "area":
                case "stackedArea":
                case "100%StackedArea":
                case "barClustered":
                case "barStacked":
                case "barStacked100":
                case "areaClustered":
                case "areaStacked":
                case "xyScatter":
                case "xyScatterLines":
                case "xyScatterLinesNoMarkers":
                case "xyScatterSmooth":
                case "xyScatterSmoothNoMarkers":
                case "bubble":
                    return true;
                default:
                    return false;

            }
        }

        function createIconGroup(options, $parent) {
            var $button = $('<button class="btn btn-icon icon-group"><span></span><label></label></button>'),
                $dropdownGroup = $('<div class="btn-group"> <button type="button" class="btn btn-default dropdown-toggle btn-dropdown-only icon-group" data-toggle="dropdown"> <span class="caret" /> </button> </div>');

            var name = options.name,
                text = options.text || name.toUpperCase(),
                header = options.header || text;

            $('label', $button).text(options.text || name.toUpperCase());
            $('span', $button).addClass(options.iconClass);
            $button.attr('data-name', name);
            $dropdownGroup.attr('data-name', name);

            if (options.haslabel) {
                $parent.addClass('group');
                $dropdownGroup.addClass('fullheight');
                $("button", $dropdownGroup).addClass('fullheight');
            }

            $parent.append($button);
            $parent.append($dropdownGroup);

            createDropdownListMenu(options, $dropdownGroup, header);

            $button.on('click', function (e) {
                self.trigger('click', { name: name, value: 'SET', text: options.text, header: header });
            });

            $dropdownGroup.on('click', function (e) {
                var $target = $(e.target);

                if ($target.is('button') || $target.parent().is('button')) {
                    if ($(this).parents('li.item').length > 0) {
                        $(this).parents('div.dropdown.open').data('keepopen', true);
                    }
                } else {
                    $(this).parents('div.dropdown.open').data('keepopen', false);
                    if ($target.is('div.dropdown-backdrop')) {
                        // close drop down menu
                        $dropdownGroup.removeClass('open');
                    } else {
                        if ($target.closest('li').length > 0) {
                            $li = $target.closest('li').first();

                            if ($target.is('li')) {
                                self.trigger('click', { name: name, value: $li.data('name'), header: header });
                            }
                        }
                    }
                }
            });

            $dropdownGroup.on('show.bs.dropdown', function (e) {
                //console.log('show.bs.dropdown', name);
                self.trigger('dropdown', {name: name, open: true});
            });

            $dropdownGroup.on('shown.bs.dropdown', function (e) {
                //console.log('show.bs.dropdown', name);
                self.trigger('dropdownShown', {name: name});
                adjustDropdownPosition($dropdownGroup);
            });

            $dropdownGroup.on('hidden.bs.dropdown', function (e) {
                //console.log('hidden.bs.dropdown', name);
                self.trigger('dropdown', { name: name, open: false });
            });
        }

        function adjustDropdownPosition($dropdownGroup, borderWidth) {
            var $target = self.$target,
                fullWidth = $('.tab-content', $target).innerWidth(),
                $ul = $(">ul", $dropdownGroup),
                offset = $dropdownGroup.offset(),
                width = $ul.width();

                var SPACE = 2 + (borderWidth || 0);  // border width

            if (offset.left + width > fullWidth - SPACE) {
                $ul.css({left: fullWidth - width - SPACE - offset.left });
            } else {
                $ul.css({left: 0});
            }
        }

        function createDropdownOnly(options, $parent) {
            var $dropdownGroup = $('<div class="btn-group"> <button type="button" class="btn btn-default dropdown-toggle btn-dropdown-only icon-group" data-toggle="dropdown"> <span /> </button> </div>');
            var name = options.name;

            $('span', $dropdownGroup).addClass(options.iconClass);
            $dropdownGroup.attr('data-name', name);

            if(options.name === 'shapeLineStyle'){
                $dropdownGroup.addClass('shapeLineStyle');
            }
            if (options.haslabel && options.text) {
                $dropdownGroup.addClass('group');
                $('<label></label>').text(options.text).appendTo($('button', $dropdownGroup));
            }

            $parent.append($dropdownGroup);

            createDropdownListMenu(options, $dropdownGroup);

            $dropdownGroup.on('show.bs.dropdown', function (e) {
                self.trigger('dropdown', { name: name, open: true, dropdown: this, originalEvent: e });
            });

            $dropdownGroup.on('shown.bs.dropdown', function (e) {
                adjustDropdownPosition($dropdownGroup);
            });

            $dropdownGroup.on('hide.bs.dropdown', function (e) {
                var $div = $(this);
                var data = $div.data();
                if (data.keepopen) {
                    if($("[data-name='" + 'open' + "']", $($div.children()[1]))[0]) {
                        if (data.dropdownClosed || $(e.target).hasClass("open")) {
                            $div.data({ keepopen: false, dropdownClosed: true });
                        }
                        if (data.dropdownClosed) {
                            $div.data({ dropdownClosed: false });
                            return false;
                        }
                        self.colorPicker.hide();
                    }

                    // do as default when click on itself for close
                    if ($div[0] === e.target) { return false; }
                    // prevent close
                    e.stopPropagation();
                    e.preventDefault();

                    // delay close
                    if (data.dropdownClosed || $(e.target).hasClass("open")) {
                        $div.data({ keepopen: false, dropdownClosed: true });
                    }
                } else {
                    // delay close
                    // if($($("[data-name='" + 'open' + "']", $($div.children()[1])).children()[1]).is(':visible')) {
                        $($("[data-name='" + 'open' + "']", $($div.children()[1])).children()[1]).hide();
                    // }
                    if (data.dropdownClosed) {
                        $div.data({ dropdownClosed: false });
                        return false;
                    }
                    self.colorPicker.hide();
                }
            });

            for(var i = 0; i < options.dropdown.length; i++) {
                var option = options.dropdown[i];
                if(option.childrenList && Array.isArray(option.childrenList)) {
                    option.childrenList.forEach(function (item) {
                        if(item.type === "dropdiv-only") {
                            createPreviewForChart({item: item, index: i}, $($('ul:first' ,$dropdownGroup[0]).children()[i]));
                        } else {
                            createDropdownListMenu({item: item, index: i}, $($('ul:first' ,$dropdownGroup[0]).children()[i]));
                        }
                    })
                }
            }
        }

        function createPreviewForChart(options, $parent) {
            function addIconTextItem(options, $parent) {
                var $btn = $('<button class="btn btn-icon"><span></span><label></label></button>'),
                    text = options.text;

                $('span', $btn).addClass(options.iconClass);
                $('label', $btn).text(text);
                $btn.attr('title', text);
                $btn.appendTo($parent);
            }

            var $div = $('<div></div>').addClass(options.name), hasIconTextItem;
            if(options && options.item !== undefined) {
                $div.css({"top": (8 + options.index * 45) + "px"});
                options = options.item;
                $div.addClass(options.name);
            }
            options.dropdown.forEach(function (v, i) {
                var $subDiv;
                if (v) {
                    // $subDiv = $('<div></div>');
                    var text = v.text || v,
                        value = v.value || v,
                        iconClass = v.iconClass;
                    // $subDiv.attr('data-value', getDataAttributeString(value));
                    var $span = $('<span></span>');

                    var css = value.split('%').join('');
                    $span.addClass("chart-preview-type " + "chart-type-" + css);
                    $span.attr('title', text);

                    // if (iconClass) {
                    //     hasIconTextItem = true;
                    //     addIconTextItem({iconClass: iconClass, text: text}, $li);
                    // } else {
                    //     if (v.toggle) {
                    //         $btn = $('<button class="toggle toggle-item"> <label></label> </button>');
                    //
                    //         $('label', $btn).text(text);
                    //         $btn.attr('data-name', value);
                    //
                    //         if (v.checked) {
                    //             $btn.addClass('on');
                    //         }
                    //
                    //         $btn.appendTo($li);
                    //     } else {
                    //         $a.text(text).appendTo($li);
                    //     }
                    // }


                    // $li.on('click', function (e) {
                    //     // ignore disalbed items
                    //     var $li = $(this);
                    //     if ($li.hasClass('disabled')) {
                    //         return;
                    //     }
                    //
                    //     var checked;
                    //
                    //     if ($btn && $btn.hasClass('toggle')) {
                    //         $btn.toggleClass('on');
                    //         checked = $btn.hasClass('on');
                    //     }
                    //
                    //     text = $('a', this).text() || text;
                    //     if ($input) {
                    //         $input.val(text);
                    //     }
                    //     self.trigger('click', { name: options.name, value: value, text: text, checked: checked, header: header });
                    // });

                }
                $div.append($span);
            });

            if (hasIconTextItem) {
                $div.addClass("icon-text");
            }

            if (options.minWidth) {
                $div.css({"min-width": options.minWidth});
            }

            $parent.append($div);
        }

        function createDropdownMenu(options, $container, $parent) {
            function addDropDownItem($ul, options) {
                var $li = $('<li></li>');
                switch (options.type) {
                    case 'icon-group':
                        $li.addClass('center-align');
                        if (options.items && options.items.length > 0) {
                            $divGroup = $('<div class="btn-group"></div>');
                            options.items.forEach(function (item, i) {
                                createIconButton(item, $divGroup, i);
                            });
                            $li.append($divGroup).appendTo($ul);
                        }
                        break;
                }
            }

            var $ul = $('<ul class="dropdown-menu"><li class="dropdown-header"></li><li class="divider"></li></ul>');

            if (options.minWidth) {
                $ul.css({"min-width": options.minWidth});
            }

            // header
            $('li.dropdown-header', $ul).append($('<span />').text(options.header));

            // built-in items
            if (options.rows && options.rows.length > 0) {
                options.rows.forEach(function (row, i) {
                    addDropDownItem($ul, row);
                });
                $('<li class="divider"></li>').appendTo($ul);
                $ul.addClass('builtin');
            }

            $parent.append($ul);
        }

        function prepareDropdownItems(options, index, array) {
            var $container = array.container,
                name = options.name,
                $parent = $('button[data-name="' + name + '"]', $container).parent(),
                $ul = $('ul.dropdown-menu', $parent);

            // default merge items
            options.items.forEach(function(n, i) {
                $('<li class="default-merged"></li>')
                    .append($container.find('*[data-name="' + n + '"]'))
                    .appendTo($ul);
            });
            $ul.addClass('builtin');
        }


        function createSetColorGroup(options, $parent) {
            var $dropdownGroup = $(
                    '<div class="btn-group"> '
                    +'  <button type="button" class="btn btn-default dropdown-toggle btn-dropdown-only icon-group" data-toggle="dropdown"> '
                    +'      <span class="' + options.iconClass + '"></span>'
                    +'  </button>'
                    +'  <ul class="dropdown-menu colorPicker">'
                    +'      <li></li>'
                    +'  </ul>'
                    +'</div>');

            var name = options.name;

            $dropdownGroup.attr('data-name', name);

            $parent.append($dropdownGroup);

            $dropdownGroup.on('click', function (e) {
                var colorpicker = self.colorPicker,
                    $colorpicker = self.$colorPicker;

                var $dropdown = $(this).parents('div.dropdown.open'),
                    keepopen = $dropdown.data('keepopen');

                $dropdown.data('keepopen', true);

                var position = { left: 0, top: 0 };
                var lastName = $colorpicker.data('name');
                if (lastName != name) {
                    colorpicker.hide();
                }
                $colorpicker.data({ name: name, dropdown: $dropdownGroup });

                if (!colorpicker.isVisible()) {
                    colorpicker.show(position, options);
                }
                else {
                    colorpicker.hide();
                    $dropdownGroup.className = "btn-group";
                    $dropdown.data('keepopen', false);
                }
            });

            $dropdownGroup.on('show.bs.dropdown', function (e) {
                var $target = $('ul.dropdown-menu>li', $dropdownGroup);
                if ($target.children().length === 0) {
                    $target.append(self.$colorPickerContainer);
                    $target.parent().width(self.$colorPickerContainer.width());
                }
            });

            $dropdownGroup.on('shown.bs.dropdown', function (e) {
                adjustDropdownPosition($dropdownGroup, 1);
            });
        }

        function createGroupItem(options, $parent, index) {
            var type = options.type;
            switch (type) {
                case 'checkbox':
                    createCheckBox(options, $parent);
                    break;

                case 'icon':
                    createIconButton(options, $parent, index);
                    break;

                case 'dropdown':
                    createDropdownButton(options, $parent, index);
                    break;

                case 'group':
                    createButtonGroup(options, $parent, index);
                    break;

                case 'input':
                    createInput(options, $parent);
                    break;
                case 'shapeColorPreset':
                    createShapePresetColor(options,$parent);
                default:
                    break;
            }
        }
    };

    function adjustTab($target) {
        var $ul = $('ul.nav', $target),
            fullWidth = $ul.width(),
            dropdownWidth = $("#tabDropdown").width();

            fullWidth -= dropdownWidth; // conside dropdown from start

        if (($('#tabDropdown:visible').length > 0)) {
            $("#tabDropdown").addClass('hidden');
            $("#tabDropdown ul.dropdown-menu").children().remove();
        }

        var $activeItem = $('li.active', $ul),
            $items = $('li', $ul),
            count = $items.length;
        var width = $activeItem.outerWidth(true),
            needHidden = false;

        for (var i = 0; i < count - 1; i++) {
            var $current = $($items[i]);
            if (!$current.hasClass('hidden')) {
                if (!needHidden && $current[0] !== $activeItem[0]) {
                    width += $current.outerWidth(true);
                    if (width >= fullWidth) {
                        needHidden = true;

                        // process when all items can be shown without dropdown
                        if ((i === count - 2) && (width < fullWidth + dropdownWidth)) {
                            needHidden = false;
                        }
                    }
                }

                if (needHidden) {
                    $current.hide();
                    addTabDropdownItem($current);
                } else {
                    $current.show();
                }
            }
        }

        if (needHidden) {
            $("#tabDropdown").removeClass('hidden');
        } else {
            $("#tabDropdown").addClass('hidden');
        }
    }

    function addTabDropdownItem($item) {
        var $li = $('<li><a></a></li>'), index = $item.index();
        $li.data('index', index);

        var $a = $('a', $item);
        $('a', $li).text($a.text()).attr('data-href', $a.attr('href'));

        var found = false;
        $("#tabDropdown li").each(function (i, item) {
            if (!found) {
                if ($(item).data('index') > index) {
                    $li.insertBefore(item);
                    found = true;
                }
            }
        });
        if (!found) {
            $("#tabDropdown ul.dropdown-menu").append($li);
        }
    }

    function processToggleGroup($btn) {
        var toggleGroup = $btn.attr('data-toggle-group');

        if (toggleGroup) {
            // remove on of other items
            $('button[data-toggle-group="' + toggleGroup + '"]', $btn.closest('.dropdown-menu')).removeClass('on');
        }
    }

    Ribbon.prototype.resize = function () {
        var $target = this.$target,
            fullWidth = $('.tab-content', $target).innerWidth();

        if ($target.data('skiptab')) {
            $target.data('skiptab', false);
        }
        else {
            adjustTab($target);
        }

        var tab = $target.find('.tab-pane.active')[0];

        if (tab) {
            var  $tab = $(tab),
              collapse = $tab.data('collapse'),
              groupCollapseItems = $tab.data('groupCollapseItems'),
              width = 0;

            if (collapse && collapse.length > 0) {
                $tab.find('>.group').each(function (i, g) {
                    restoreItems(g);
                    width += getFullWidth($(g));
                });

                if (fullWidth < width) {
                    var count = collapse.length;
                    for (var i = 0; i < count; i++) {
                        var name = collapse[i];

                        if (name.substr(0, 1) === '*') {
                            var items = $($tab.find('.' + name.substr(1))).toArray();
                            do {
                                var item = items.pop();
                                width -= $(item).outerWidth(true);

                                width += movetoDropdown(item, $(item).parent());

                                if (width < fullWidth) {
                                    break;
                                }
                            } while (items.length > 0);
                        } else {
                            var $items = $($tab.find('.' + name));
                            var needGroupItems = groupCollapseItems && groupCollapseItems.indexOf(name) !== -1;

                            width = adjustRibonItemSize(width, $items, needGroupItems);

                            if (needGroupItems) {
                                width += movetoDropdown($items, $($items[0]).parent(), true);
                            }
                        }
                        if (width < fullWidth) {
                            break;
                        }
                    }

                    //  adjust dropdown item's appearance
                    var $ul = $('.tab-pane.active > .group > .dropdown > .dropdown-menu', $target);

                    $('.icon-group span.caret', $ul).addClass('glyphicon glyphicon-menu-right _caret').removeClass('caret');
                }

                // process dropdown with all merged items
                $('.group > .dropdown.alt-icon', $target)
                    .each(function() {
                        var $span = $('>button>span', this),
                            iconClasses = $span.data('classes'),
                            mergedAll = $(this).parent().children().length === 1;

                        $span.removeClass().addClass(iconClasses[mergedAll ? 1 : 0]);
                    });
            }
        }

        function adjustRibonItemSize(width, $items, needGroupItems) {
            $items.each(function (i, item) {
                width -= $(item).outerWidth(true);

                if (!needGroupItems) {
                    width += movetoDropdown(item, $(item).parent());
                }
            });

            return width;
        }

        function getFullWidth($element) {
            var w = 0;
            $element.children().each(function() {
                w += $(this).is(":visible") ? $(this).outerWidth(true) : 0;
            });

            return w;
        }

        function restoreItems(group) {
            var $ul = $(group).find('>.dropdown>.dropdown-menu'),
                hasBuiltinItems = $ul.hasClass('builtin'),
                $temp;

            if ($ul && $ul.length) {
                if (hasBuiltinItems) {
                    // temp used item for insertBefore
                    $temp = $('<span></span>');
                    $(group).append($temp);
                }
                $ul.find(">li.item").each(function (i, li) {
                    var $container = $(li);

                    if ($(li).hasClass('group')) {
                        $container = $('>div', li);
                    }

                    var item = $container.children().first(), order = item.data('order');

                    $container.children().insertBefore(getInsertPosition(order, $(group), $temp || $ul.parent(), false));

                    $(li).remove();
                });

                // shouldn't hide item' with built-in dropdown menus
                if (hasBuiltinItems) {
                    // remove temp used item
                    $temp.remove();
                } else {
                    $ul.parent().hide();
                }
            } else {
                $(group).children(':not(.dropdown)').show();
            }
            $('span._caret', $(group)).removeClass().addClass('caret');
        }

        function movetoDropdown(item, parent, groupItems) {
            var div = $(parent).data('dropdown');

            if (div) {
                var $div = $(div),
                    $ul = $div.find('>.dropdown-menu');

                var $temp = $('<li></li>');     // temp used item for insertBefore
                $temp.appendTo($ul);

                var $defaultPosition = $('li.default-merged', $ul)[0] || $temp;

                if (groupItems) {
                    $('<li class="item center-align group"></li>')
                        .append($('<div class="btn-group"></div>').append(item))
                        .insertBefore(getInsertPosition($(item ||item[0]).data('order'), $ul, $defaultPosition, true));
                } else {
                    var $li = $('<li class="item"></li>');

                    if ($(item).hasClass('center-align')) {
                        $li.addClass('center-align');
                    }

                    $li.append(item)
                      .insertBefore(getInsertPosition($(item).data('order'), $ul, $defaultPosition, true));
                }

                $temp.remove();     // remove temp used item

                if (!$div.is(':visible')) {
                    $div.show();
                    return $div.outerWidth(true);
                }
            } else {
                $(item).hide();
            }

            return 0;
        }

        function getInsertPosition(order, $container, $default, intoDropdown) {
            var target;

            if (order !== null) {
                if (intoDropdown) {
                    target = $('li.item', $container).filter(function () {
                        return $(this).children().data('order') > order;
                    })[0];
                } else {
                    target = $container.children().filter(function () {
                        return $(this).data('order') > order;
                    })[0];
                }
            }

            return target || $default;
        }
    };

    Ribbon.prototype.setToggleButton = function(name, selected) {
        var $buttons = $('button[data-name="' + name + '"]', this.$target);

        if ($buttons.length > 0) {
            var $btn = $($buttons[0]);

            processToggleGroup($btn);
            $btn[selected ? 'addClass' : 'removeClass']('on');
        } else {
            console.log('container not found, named:', name);
        }
    };

    Ribbon.prototype.setCheckboxButton = function (name, checked) {
        var container = $('label[data-name="' + name + '"]', this.$target);

        if (container.length > 0) {
            $('input[type="chckbox"]', container).prop('checked', checked);
        } else {
            console.log('container not found, named:', name);
        }
    };

    Ribbon.prototype.setInputValue = function (name, value) {
        var $input = $('input[data-name="' + name + '"]', this.$target);

        if ($input.length > 0) {
            $input.val(value);
        } else {
            console.log('input not found, named:', name);
        }
    };

    // show the specified $tab, isSpecial tells whether the tab is shown ondemand
    Ribbon.prototype.showTab = function ($tab, isSpecial) {
        var self = this;

        if (isSpecial) {
            $tab.removeClass('hidden');
            self.resize();
        }

        // check if it's in the dropdown
        var index = $tab.index(),
            $li = $('#tabDropdown li').filter(function() { return $(this).data('index') === index; });

        if ($li.length > 0) {
            // simulate a click and let the onclick event handle it
            $li[0].click();
        } else {
            // normal tab, just switch to it
            $('a', $tab).tab('show');
        }
    };

    // hide the specified $items [tab, dropdown]
    // isSpecial tells whether it's a special one
    // $toBeShownTab provides the tab to be shown (optional)
    Ribbon.prototype.hideTab = function ($items, isSpecial, $toBeShownTab) {
        var self = this;

        var $tab = $items[0], $dropdown = $items[1];

        // hidden special tab and let resize handle the display and dropdown
        if (isSpecial) {
            if ($tab.length > 0) {
                $tab.addClass('hidden');
                self.resize();
            } else {
                if ($dropdown && $dropdown.length > 0) {
                    $dropdown.each(function() { $(this).remove(); });
                }
            }
        }

        if ($toBeShownTab) {
            $('a', $toBeShownTab).tab('show');
        }
    };
