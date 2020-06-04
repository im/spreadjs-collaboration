
    function ChartColorPicker(host, colors) {
        this._colors = colors;
        this._$host = $(host);
        this._init();
    }

    ChartColorPicker.prototype._init = function () {
        var self = this, colors = self._colors, host = self._$host;
        var container = $('<div>').addClass('chart-colorpicker-container');
        container.appendTo(host);
        self._container = container;
        for (var colorGroup in colors) {
            if (colors.hasOwnProperty(colorGroup)) {
                self._initColorGroup(colorGroup);
            }
        }
    };

    ChartColorPicker.prototype._initColorGroup = function (colorGroup) {
        var self = this, container = self._container, colors = self._colors, group = colors[colorGroup];
        var groupName = group.name, groupColors = group.colors;

        // group header
        var headerContainer = $('<div>').addClass('header-container').appendTo(container);
        $('<span>').text(groupName).appendTo(headerContainer);
        // group content
        var groupContent = $('<div>').addClass('group-content').appendTo(container);

        for (var i = 0; i < groupColors.length; i++) {
            var color = groupColors[i];
            var colorItemsContainer = $('<div>').addClass('color-items-container' + ' ' + colorGroup).attr('title', color.tip).appendTo(groupContent).data('index', i);

            colorItemsContainer.click(function (e) {
                self._colorItemsClicked(colorGroup, $(e.currentTarget).data('index'));
            });

            var colorItems = color.items;
            colorItems.forEach(function (colorItem) {
                $('<div>').addClass('color-item').css({'background-color': colorItem}).appendTo(colorItemsContainer);
            });
        }
    };

    ChartColorPicker.prototype._colorItemsClicked = function (group, index) {
        var self = this;
        self._selectedGroup = group;
        self._selectedItemIndex = index;
        self.onSelectedColorChanged({group: group, index: index});
        self._updateSelectedStatus();
    };

    ChartColorPicker.prototype.onSelectedColorChanged = function (selectedItem) {

    };

    ChartColorPicker.prototype.setSelectedItem = function (group, index) {
        var self = this;
        self._selectedGroup = group;
        self._selectedItemIndex = index;
        self._updateSelectedStatus();
    };

    ChartColorPicker.prototype._updateSelectedStatus = function () {
        var self = this, host = self._$host;
        var group = self._selectedGroup, index = self._selectedItemIndex;
        host.find('.color-items-container').removeClass('selected');
        var selectedDom = host.find('.' + group)[index];
        $(selectedDom).addClass('selected');
        selectedDom.scrollIntoView();
    };