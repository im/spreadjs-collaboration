/**
* Spread
* @author im <81195314@qq.com>
* @date 2020-05-16 10:05:15
* @since 0.1.0
*/

import Vue from 'components/base'
import { Component, Prop, Watch } from 'vue-property-decorator'
import template from './spread.vue'
import Excel from 'collaboration/excel'

const $ = window.$
const GC = window.GC
const designer = window.designer

@Component({
    name: 'view-spread',
    mixins: [template]
})

export default class Spread extends Vue {
    fileName = ""
    excelIo = {}
    spread = null
    needSuspend = false
    _windowResizeTimer: any = null
    designer = GC.Spread.Sheets.Designer

    mounted() {
        const _this = this;

        $(window).resize(_this._doWindowResize);
        $(window).resize();
        _this.updateLayout();

        designer.loader.reBindingApplied = true;
        // console.time('loadContent')
        designer.loader.loadContent();
        // console.timeEnd('loadContent')

        designer.loader.ready(function () {
            if (designer.loader.bindingApplied) {
                //warper
                // console.time('resetElement')
                designer.wrapper.resetElement();
                designer.wrapper.reset(true);
                // console.timeEnd('resetElement')
                // chartPreviewer
                designer.chartPreviewer.initChartPreviewer();
                // // contextMenu already in reset
                // designer.contextMenu.initContextMenu();
                // fileMenu
                designer.fileMenu = new designer.FileMenu();
                $("#file-menu-tab").on("click", function () {
                    designer.fileMenu.showFileScreen();
                    designer.fileMenu._initPDFExportSheetSelect();
                });
                designer.fileMenu.initPage();
                // spreadActions
                designer.spreadActions.initDesignerCommands(designer.wrapper.spread.commandManager());
                // statusBar
                // console.time('initStatusBar')
                designer.statusBar.initStatusBar();
                // console.timeEnd('initStatusBar')
                // ribbon
                designer.ribbon.eventAttached = false;

                // console.time('initRibbonBar')
                designer.ribbon.initRibbonBar();
                // console.timeEnd('initRibbonBar')

                // console.time('attachEvent')
                designer.ribbon.attachEvent();
                // console.timeEnd('attachEvent')
                console.log(111)

            }

            _this.spread = designer.wrapper.spread
            // console.timeEnd('start')
        });
        new Excel(designer)
    }

    updateLayout() {
        const _this = this;
        $(".spreadWrapper").css("height", ($(window).height() - 50 - $(".header").height()) + "px")
        $(".header").css("width", ($(".container").width() - 10) + "px");
        $("#ss").css("width", ($(".container").width() - 2) + "px");

        if ($(".ribbon-bar").data("gcui-gcuiribbon")) {
            $(".ribbon-bar").data("gcui-gcuiribbon").updateRibbonSize();
        }
        const spread = _this.designer.wrapper.spread;
        if (spread && spread.isPaintSuspended()) {
            spread.resumePaint();
            spread.refresh();
            _this.needSuspend = true;
        }
    }
    _doWindowResize() {
        const _this = this;

        if (_this._windowResizeTimer) {
            window.clearTimeout(_this._windowResizeTimer);
        }
        _this._windowResizeTimer = window.setTimeout(function () {
            _this.updateLayout();
            _this._windowResizeTimer = null;
            if (_this.needSuspend) {
                _this.needSuspend = false;
                window.setTimeout(function () {
                    _this.designer.wrapper.spread.suspendPaint();
                }, 300);
            }
        }, 100)
    }
}