// relative or absolute path of Components' main.js
require([
    '../../submodules/fenix-ui-menu/js/paths',
    '../../submodules/fenix-ui-common/js/Compiler'
], function (Menu, Compiler) {

    var menuConfig = Menu;
    menuConfig['baseUrl'] = '../../submodules/fenix-ui-menu/js';

    Compiler.resolve([menuConfig],
        {
            placeholders: {"FENIX_CDN": "//fenixapps.fao.org/repository"},
            config: {
                paths: {
                    host: '../browse/host',
                    config: "../../config",
                    'jqwidgets': '{FENIX_CDN}/js/jqwidgets/3.2.2/jqx-all',
                    'modernizr': '{FENIX_CDN}/js/modernizr/2.8.3/dist/Modernizr.min',
                    'smoothScroll': '{FENIX_CDN}/js/smoothscroll/4.8.3/smoothScroll',
                    'jquery.history': '{FENIX_CDN}/js/jquery.history/jquery.history',
                    highstocks: '//code.highcharts.com/stock/highstock',
                    "highcharts.export": '//code.highcharts.com/modules/exporting',
                    'domReady': '{FENIX_CDN}/js/requirejs/plugins/domready/2.0.1/domReady',
                    'highcharts': "{FENIX_CDN}/js/highcharts/4.0.4/js/highcharts",
                    i18n: '//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min',
                    jstree: '{FENIX_CDN}/js/jstree/3.0.8/dist/jstree.min',
                    'underscore': "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
                    'jquery.rangeSlider': '{FENIX_CDN}/js/jquery.rangeslider/5.7.0/jQDateRangeSlider-min',
                    //OLAP
                    'pivot': '../../submodules/fenix-ui-olap/js/pivot',
                    'jquery-ui': "//fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min",
                    'jquery.i18n.properties': "//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min",
                   // 'countriesAgg': '//faostat3.fao.org/faostat-download-js/pivotAgg/countriesAgg',
                    'olap-config': '../browse/configuration',
                    'gt_msg_en': "../../submodules/fenix-ui-olap/lib/grid/gt_msg_en",
                    //'gt_const': 'submodules/fenix-ui-olap/grid/gt_const',
                    'gt_grid_all': '../../submodules/fenix-ui-olap/lib/grid/gt_grid_all',
                    'fusionchart': '../../submodules/fenix-ui-olap/lib/grid/flashchart/fusioncharts/FusionCharts'
                },

                shim: {
                    i18n: {
                        deps: ['jquery']
                    },
                    "jquery.history": {
                        deps: ['jquery']
                    },
                    "highcharts": {
                        "exports": "Highcharts",
                        "deps": ["jquery"]
                    },
                    "highcharts.export": {
                        "exports": "Highcharts",
                        "deps": ["jquery", "highcharts"]
                    },
                    'underscore': {
			            exports: '_'
			        },
                    "highstocks": {
                        "exports": "StockChart",
                        "deps": ["jquery"]
                    },
                    'jqwidgets': {
                        deps: ['jquery']
                    },
                    'jstree': {
                        deps: ['jquery']
                    },
                    'jquery.rangeSlider': ['jquery', 'jquery-ui'],
                    'jquery-ui': {
                        deps: ['jquery']
                    },
                    'jquery.i18n.properties': [ 'jquery-ui'],
                    'pivot': [
                        'jquery',
                        'jquery-ui',
                        'jquery.i18n.properties',
                        //'countriesAgg',
                        'olap-config',
                        'gt_msg_en',
                        //'gtgetWDS_const',
                        'gt_grid_all',
                        'fusionchart'
                    ]

                }
            }
        });

    require(['host', 'domReady!', 'bootstrap'], function (Host) {

        var host = new Host();
        host.initFenixComponent();
    });
});