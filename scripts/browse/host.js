define([
    'jquery',
    'underscore',
    'jquery.rangeSlider',
    'fx-menu/start',
    'text!config/browse/domain_tree_config.json',
    'text!config/browse/ranking_tree_config.json',
    'text!config/browse/olap_afo_filter.json',
    'highcharts',
    'jqwidgets',
    'jstree',
    'pivot'
], function ($, _, rangeSlider, Menu, domain_config, ranking_config, olap_config) {

    var s = {
        TRADE_COMM: '#trade_commodity',
        TRADE_TIME_FROM: '#trade_time_from',
        TRADE_TIME_TO: '#trade_time_to',
        TRADE_ELEMENT: '#trade_element',
        TRADE_BTN: '#trade_search',
        TRADE_CHART: '#trade_chart',
        TRADE_GRID: '#trade_grid',

        PROD_COMM: '#prod_commodity',
        PROD_GEO: '#prod_geo',
        PROD_TIME_FROM: '#prod_time_from',
        PROD_TIME_TO: '#prod_time_to',
        PROD_TYPE: '#prod_type',
        PROD_ELEMENT: '#prod_element',
        PROD_BTN: '#prod_search',
        PROD_CHART: '#prod_chart',
        PROD_GRID: '#prod_grid',

        COMBINED_TYPE: '#combined_type',

        TAB_DOMAIN: '#by_domain',
        TREE_CONTAINER: '#tree_container',
        CHARTS_CONTAINER: '#charts_container',
        COUNTRY_CONTAINER: '#country_container',
        COUNTRY_DETAILS_CONTAINER: '#country_details_container',
        TREE_RANK_CONTAINER: '#rank_tree'
    };

    function Host() {
        this.datasets = {};
        this.columnsCodeMapping = {};
    }

    Host.prototype.initFenixComponent = function () {

        new Menu({
            url: 'json/fenix-ui-topmenu_config.json',
            active: 'browse'
        });

        this.bindEventListeners();

        this.initDomainTab();

    };

    Host.prototype.bindEventListeners = function () {

        var self = this;

        $('a[data-toggle="tab"]').on('shown.bs.tab', $.proxy(function (e) {

            //e.target // newly activated tab
            //e.relatedTarget // previous active tab

            switch ($(e.target).data('tab')) {
                case 'domain' :

                    if (this.contentDomain !== true) {
                        this.contentDomain = true;
                        self.initDomainTab();
                    }

                    break;
                case 'region' :
                    $(s.COUNTRY_CONTAINER).show();
                    $(s.COUNTRY_DETAILS_CONTAINER).hide();

                    if (this.contentCountry !== true) {
                        this.contentCountry = true;
                        self.initCountryTab();
                    }

                    break;
                case 'ranking' :

                    if (this.contentRanking !== true) {
                        this.contentRanking = true;
                        self.initRankingTab();
                    }
                    break;
            }
        }, this));

    };

    Host.prototype.initDomainTree = function () {

        var self = this;

        $(s.TREE_CONTAINER).jstree({
            core: {
                data: JSON.parse(domain_config),
                themes: {
                    icons: false
                }
            },
            "plugins": ["wholerow"]
        }).on('changed.jstree', function (e, data) {

            e.preventDefault();
            $(s.TAB_DOMAIN).find('[data-content]').hide();

            $(s.TAB_DOMAIN).find('[data-content="' + data.selected + '"]').show();

            var c = 'initDomain_' + data.selected,
                callback = $.proxy(self[c], self);

            if (this['domain' + data.selected] !== true) {
                this['domain' + data.selected] = true;
                callback();
            }

        });
    };

    Host.prototype.initDomain_olap = function () {
        
    	olap_config = JSON.parse(olap_config);

        function getWDS(queryTmpl, queryVars, callback) {

            var sqltmpl, sql;

            if(queryVars) {
                sqltmpl = _.template(queryTmpl);
                sql = sqltmpl(queryVars);
            }
            else
                sql = queryTmpl;

            var	data = {
                datasource: olap_config.dbName,
                thousandSeparator: ',',
                decimalSeparator: '.',
                decimalNumbers: 2,
                cssFilename: '',
                nowrap: false,
                valuesIndex: 0,
                json: JSON.stringify({query: sql})
            };

            $.ajax({
                url: olap_config.wdsUrl,
                data: data,
                type: 'POST',
                dataType: 'JSON',
                success: callback
            });
        }


		var F3DWLD = {
		    CONFIG: {
		        wdsPayload: {
		            showCodes: false
		        }
		    }
		};
		FAOSTATNEWOLAP.showUnits = "false";
		FAOSTATNEWOLAP.showFlags = "false";
		/*function init() {
			$('#country').checkboxTree({initializeUnchecked: 'collapsed'});
			$('#partner').checkboxTree({initializeUnchecked: 'collapsed'});
			$('#commodity').checkboxTree({initializeUnchecked: 'collapsed'});
		}*/

		function returnTreeview(id) {
			var ret=[];
			var checkedCheckboxes = $('#'+id+' input[type="checkbox"]:checked');
			for(var i=0;i< checkedCheckboxes.length ; i++){
			ret.push(checkedCheckboxes[i].getAttribute("value"));
			//console.log(checkedCheckboxes[i].getAttribute("value"));
			}
			return ret.join(",");
		}

		function returnSelect(id) {
			var ret=[];
			checkedCheckboxes=$("#"+id+" :selected");
			for(var i=0;i< checkedCheckboxes.length ; i++){
				ret.push(checkedCheckboxes[i].getAttribute("value"));
			}
			return ret.join(",");
		}

		function loadOlapData(sqlFilter) {

			getWDS(olap_config.queries.prices_national_filter, sqlFilter, function(data) {

				data = [["Area","Item","Year","Month2","Value","Unit","Flag","FertCode"]].concat(data);

				console.log('PASS DATA TO OLAP')
				console.log(sqlFilter,data);

				FAOSTATNEWOLAP.originalData = data;

				$("#fx-olap-ui").pivotUI(data, {
					derivedAttributes: {
						"Month": function(mp){
							return "<span class=\"ordre\">" +matchMonth[ mp["Month2"]] + "</span>"+mp["Month2"];
						},"Indicator":function(mp){return "<span class=\"ordre\">" + mp["FertCode"] + "</span>"+mp["Item"]+" ("+mp["Unit"]+")";}
					},
					rows: ["Area", "Indicator", "Month"],
					cols: ["Year"],
					vals: ["Value", "Flag"],
					hiddenAttributes:["Month2","Unit","Item","Value","Flag","FertCode"],
					linkedAttributes:[]
				},true);

				$("#pivot_download").show();

				$("#pivot_download").on('click', function(e) {

					my_exportNew();
					//decolrowspanNEW();
				});
			});
		}        
    	/* ================================== SELECTORS */

        $('#search-btn').on('click', function () {

            var inputs = {
                fertilizer_code: $('#product-s').jstree(true).get_selected().join("', '"),
                country_code: $('#country-s').jstree(true).get_selected().join("', '"),
                month_from_yyyymm: minDate,
                month_to_yyyymm: maxDate
            };

            //Validate inputs
            if (inputs.fertilizer_code === '' || inputs.country_code === '' ||!inputs.month_from_yyyymm || !inputs.month_to_yyyymm){
                alert("Please select Countries and Fertilizers");
                return;
            }

            loadOlapData(inputs);

        });

        // Fertilizers
        getWDS(olap_config.queries.prices_national_products, null,function(res) {

            var data = [],
                list,
                s_product = '#product-s',
                s_product_search = '#product-search-s',
                s_product_sel_all = '#product-sel-all-s';

            if (Array.isArray(res)) {

                list = res.sort(function (a, b) {
                    if (a[1] < b[1]) return -1;
                    if (a[1] > b[1]) return 1;
                    return 0;
                });

                _.each(list, function (n) {
                    data.push(createNode(n));
                });

                // Place ureas as first element and selected
                var urea = _.findWhere(data, {id: '3102100000' });
                data = _.without(data, urea);
                urea['state'] = {};
                urea.state.selected = true;
                data.unshift(urea);

            }

            createTree(data);
            initSearch();
            initBtns();

            function initBtns () {
                var allChecked = false;
                $(s_product_sel_all).on('click', function () {

                    if (!allChecked){
                        $(s_product).jstree("check_all");
                        allChecked = true
                    } else {
                        $(s_product).jstree("uncheck_all");
                        allChecked = false
                    }
                })
            }

            function createTree(data) {
                $(s_product).jstree({
                    "core": {
                        "multiple": true,
                        "animation": 0,
                        "themes": {"stripes": true},
                        'data': data
                    },
                    "plugins": ["search", "wholerow", "ui", "checkbox"],
                    "search": {
                        show_only_matches: true
                    },
                    "ui": {"initially_select": ['2814200000']}
                });

                $(s_product).jstree(true).select_node('ul > li:first');
            }

            function initSearch() {
                var to = false;
                $(s_product_search).keyup(function () {
                    if (to) {
                        clearTimeout(to);
                    }
                    to = setTimeout(function () {
                        var v = $(s_product_search).val();
                        $(s_product).jstree(true).search(v);
                    }, 250);
                });
            }

            function createNode(item) {
                var config = {
                    id: item[0], // will be autogenerated if omitted
                    text: item[1] + " ["+item[0]+"]" // node text
                };
                return config;
            }
        });

        // Country
        getWDS(olap_config.queries.prices_national_countries, null,function(res) {

            var data = [],
                list,
                s_product = '#country-s',
                s_product_search = '#country-search-s',
                s_product_sel_all = '#country-sel-all-s';;

            if (Array.isArray(res)) {

                list = res.sort(function (a, b) {
                    if (a[1] < b[1]) return -1;
                    if (a[1] > b[1]) return 1;
                    return 0;
                });

                _.each(list, function (n) {
                    data.push(createNode(n));
                });

            }

            createTree(data);
            initSearch();
            initBtns();

            function initBtns () {

                var allChecked = false;

                $(s_product_sel_all).on('click', function () {

                   if (!allChecked){
                       $(s_product).jstree("check_all");
                       allChecked = true
                   } else {
                       $(s_product).jstree("uncheck_all");
                       allChecked = false
                   }
                })
            }

            function createTree(data) {

                $(s_product).jstree({
                    "core": {
                        "multiple": true,
                        "animation": 0,
                        "themes": {"stripes": true},
                        'data': data
                    },
                    "plugins": ["search", "wholerow", "ui", "checkbox"],
                    "search": {
                        show_only_matches: true
                    },
                    "ui": {"initially_select": ['2814200000']}
                });

                $(s_product).jstree(true).select_node('ul > li:first');
            }

            function initSearch() {
                var to = false;
                $(s_product_search).keyup(function () {
                    if (to) {
                        clearTimeout(to);
                    }
                    to = setTimeout(function () {
                        var v = $(s_product_search).val();
                        $(s_product).jstree(true).search(v);
                    }, 250);
                });
            }

            function createNode(item) {

                // Expected format of the node (there are no required fields)
                var config = {
                    id: item[0], // will be autogenerated if omitted
                    text: item[1] // node text
                    //icon: "string", // string for custom
                    /* state: {
                     opened: boolean,  // is the node open
                     disabled: boolean,  // is the node disabled
                     selected: boolean  // is the node selected
                     },*/
                    //children    : [],  // array of strings or objects
                    //li_attr: {},  // attributes for the generated LI node
                    //a_attr: {}  // attributes for the generated A node
                };

                return config;
            }
        });

        // Time
        var rangeMonths$ = $('#prices_rangeMonths');
        rangeMonths$.dateRangeSlider({
        	defaultValues: {
	            min: new Date(2014, 2, 0),
	            max: new Date(2015, 1, 0)        		
        	},
        	bounds: {
            	min: new Date(2010, 2, 0),
            	max: new Date(2015, 1, 0)
            }
        });

        var minD = new Date(2014, 2, 0),
            maxD = new Date(2015, 1, 0);
        var minMonth=minD.getMonth()+1;
        var maxMonth=maxD.getMonth()+1;
        
        if(minMonth<10){ minMonth="0"+minMonth; }
        if(maxMonth<10){ maxMonth="0"+maxMonth; }

        minDate = ""+minD.getFullYear()+minMonth;
        maxDate = ""+maxD.getFullYear()+maxMonth;

        rangeMonths$.on('valuesChanged', function(e, data) {

            var minD = new Date(data.values.min),
                maxD = new Date(data.values.max);
            var minMonth=minD.getMonth()+1;
            var maxMonth=maxD.getMonth()+1;
            if(minMonth<10){ minMonth="0"+minMonth; }

            if(maxMonth<10){ maxMonth="0"+maxMonth; }

            minDate = ""+minD.getFullYear()+minMonth;
            maxDate = ""+maxD.getFullYear()+maxMonth;

        });

        ///////TODO OLAP config

		$("#olap_container").pivotUI(FAOSTATOLAPV3.datatest,FAOSTATOLAPV3.datatestolap_config,true);

        // il div contenitore ha id: #olap_container
    };

    Host.prototype.initDomain_trade = function () {

        var self = this;

        $.get('http://fenix.fao.org/d3s_fenix/msd/resources/uid/UAE_Trade?dsd=true&full=true', function (dataset) {

            self.datasets.trade = dataset;
			console.log(self.datasets.trade)
			self.datasets.trade.data=[];
			console.log("iji");
			for(var i=0;i<5000;i++)
			{
			
			self.datasets.trade.data.push(
			[dataset.metadata.dsd.columns[0].values.codes[0].codes[Math.floor(Math.random()*dataset.metadata.dsd.columns[0].values.codes[0].codes.length)].code,
			dataset.metadata.dsd.columns[1].values.codes[0].codes[Math.floor(Math.random()*dataset.metadata.dsd.columns[1].values.codes[0].codes.length)].code,
			dataset.metadata.dsd.columns[2].values.codes[0].codes[Math.floor(Math.random()*dataset.metadata.dsd.columns[2].values.codes[0].codes.length)].code,
			dataset.metadata.dsd.columns[3].values.timeList[Math.floor(Math.random()*dataset.metadata.dsd.columns[3].values.timeList.length)],
dataset.metadata.dsd.columns[4].values.codes[0].codes[Math.floor(Math.random()*dataset.metadata.dsd.columns[4].values.codes[0].codes.length)].code,			Math.floor(Math.random()*100)
			]);
			}
            //selectors
            var domainCommodities = dataset.metadata.dsd.columns[2].values.codes[0].codes;
            var domainElements = dataset.metadata.dsd.columns[1].values.codes[0].codes;
            //var domainTime = dataset.metadata.dsd.columns[3].values.timeList;

            var columns = dataset.metadata.dsd.columns;

            for (var i = 0; i < columns.length; i++) {
                if (columns[i].dataType === "code") {
                    self.columnsCodeMapping[columns[i]['id'] + '-trade'] = self.createMapCode(columns[i].values.codes[0].codes);
                }
            }

            var source =
            {
                datatype: "array",
                "datafields": [
                    {
                        "name": "label",
                        "map": "label>EN"
                    },
                    {
                        "name": "value",
                        "map": "code"
                    }
                ],
                localdata: domainCommodities
            };
            var dataAdapter = new $.jqx.dataAdapter(source);

            $(s.TRADE_COMM).jqxDropDownList({
                source: dataAdapter,
                displayMember: "label",
                valueMember: "value",
                width: '200', height: '25',
                selectedIndex: 0
            }).on('select', $.proxy(function () {
                    self.renderTradeChart();
                    self.renderTradeGrid();
                }, self
            ));

            var source =
            {
                datatype: "array",
                "datafields": [
                    {
                        "name": "label",
                        "map": "label>EN"
                    },
                    {
                        "name": "value",
                        "map": "code"
                    }
                ],
                localdata: domainElements
            };
            var dataAdapter = new $.jqx.dataAdapter(source);

            $(s.TRADE_ELEMENT).jqxDropDownList({
                source: dataAdapter,
                displayMember: "label",
                valueMember: "value",
                width: '200', height: '25',
                selectedIndex: 0
            }).on('select', $.proxy(function () {
                    self.renderTradeChart();
                    self.renderTradeGrid();
                }, self
            ));

            //chart
            self.renderTradeChart();

            //grid
            self.renderTradeGrid();

        });
    };

    Host.prototype.renderTradeGrid = function () {

        var dataGrid = [],
            dataset = this.datasets.trade,
            d = this.datasets.trade.data,
            comm = $(s.TRADE_COMM).jqxDropDownList('val'),
            elem = $(s.TRADE_ELEMENT).jqxDropDownList('val');

        for (var i = 0; i < d.length; i++) {

            if (d[i][1] === elem && d[i][2] === comm) {
                dataGrid.push({
                    area: this.columnsCodeMapping['Area' + '-trade'][dataset.data[i][0]],
                    elements: this.columnsCodeMapping['Element' + '-trade'][dataset.data[i][1]],
                    item: this.columnsCodeMapping['Item' + '-trade'][dataset.data[i][2]],
                    year: dataset.data[i][3],
                    unit: this.columnsCodeMapping['Unit' + '-trade'][dataset.data[i][4]],
                    value: dataset.data[i][5]
                })
            }

        }

        var source =
        {
            datafields: [
                {name: 'area', type: 'string'},
                {name: 'elements', type: 'string'},
                {name: 'item', type: 'string'},
                {name: 'year', type: 'string'},
                {name: 'unit', type: 'string'},
                {name: 'value', type: 'string'}
            ],
            localdata: dataGrid
        };

        // initialize jqxGrid
        $(s.TRADE_GRID).jqxGrid(
            {
                source: source,
                width: '100%',
                pageable: true,
                columnsresize: true,
                autoheight: true,
                sortable: true,
                altrows: true,
                columns: [
                    {text: 'Area', datafield: 'area'},
                    {text: 'Elements', datafield: 'elements'},
                    {text: 'Item', datafield: 'item'},
                    {text: 'Year', datafield: 'year'},
                    {text: 'Unit', datafield: 'unit'},
                    {text: 'Value', datafield: 'value'}
                ]
            });

    };

    Host.prototype.renderTradeChart = function () {

        var domainTime = ['2007', '2008', '2009', '2010', '2011'],
            temp = {},
            data = [],
            d = this.datasets.trade.data,
            comm = $(s.TRADE_COMM).jqxDropDownList('val'),
            elem = $(s.TRADE_ELEMENT).jqxDropDownList('val');
console.log(this.datasets.trade);
        for (var i = 0; i < d.length; i++) {

            if (d[i][1] === elem && d[i][2] === comm) {
                temp[d[i][3]] = d[i][5];
            }
        }


        var o = Object.keys(temp).sort();

        for (i = 0; i < o.length; i++) {
            if (temp.hasOwnProperty(o[i])) {
                data.push(temp[o[i]])
            }
        }

        $(s.TRADE_CHART).highcharts({
            title: {
                text: 'Trade - ' + this.columnsCodeMapping['Element' + '-trade'][elem],
                x: -20 //center
            },
            subtitle: {
                text: 'Source: www.uaestatistics.gov.ae/',
                x: -20
            },
            xAxis: {
                categories: domainTime
            },
            yAxis: {
                title: {
                    text: 'Tonnes (TN)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: 'Tonnes'
            },
            series: [{
                name: this.columnsCodeMapping['Item' + '-trade'][comm],
                data: data
            }]
        });

    };

    Host.prototype.initDomain_production = function () {

        var self = this;

        $.get('http://fenix.fao.org/d3s_fenix/msd/resources/uid/UAE_CropProduction10?dsd=true&full=true', function (dataset) {

            self.datasets.production = dataset;
			
			console.log("test");
			console.log(self.datasets.production);
			self.datasets.production.data=[];
			for(var i=0;i<5000;i++)
			{
			var yr=Math.floor(Math.random()*20);
		yr+=1990;
			//dataset.metadata.dsd.columns[1].values.timeList[Math.floor(Math.random()*dataset.metadata.dsd.columns[1].values.timeList.length)],

			self.datasets.production.data.push(
			[dataset.metadata.dsd.columns[0].values.codes[0].codes[Math.floor(Math.random()*dataset.metadata.dsd.columns[0].values.codes[0].codes.length)].code,
			dataset.metadata.dsd.columns[1].values.timeList[Math.floor(Math.random()*dataset.metadata.dsd.columns[1].values.timeList.length)],

			dataset.metadata.dsd.columns[2].values.codes[0].codes[Math.floor(Math.random()*dataset.metadata.dsd.columns[2].values.codes[0].codes.length)].code,
			dataset.metadata.dsd.columns[3].values.codes[0].codes[Math.floor(Math.random()*dataset.metadata.dsd.columns[3].values.codes[0].codes.length)].code,

			dataset.metadata.dsd.columns[4].values.codes[0].codes[Math.floor(Math.random()*dataset.metadata.dsd.columns[4].values.codes[0].codes.length)].code,
			Math.floor(Math.random()*100)
			]);
			}
			
            //selectors
            var domainCommodities = dataset.metadata.dsd.columns[3].values.codes[0].codes;
            var domainElements = dataset.metadata.dsd.columns[2].values.codes[0].codes;

            var columns = dataset.metadata.dsd.columns;

            for (var i = 0; i < columns.length; i++) {
                if (columns[i].dataType === "code") {
                    self.columnsCodeMapping[columns[i]['id'] + '-prod'] = self.createMapCode(columns[i].values.codes[0].codes);
                }
            }

            //////////////////////////////////

            var source =
            {
                datatype: "array",
                "datafields": [
                    {
                        "name": "label",
                        "map": "label>EN"
                    },
                    {
                        "name": "value",
                        "map": "code"
                    }
                ],
                localdata: domainCommodities
            };
            var dataAdapter = new $.jqx.dataAdapter(source);

            $(s.PROD_COMM).jqxDropDownList({
                source: dataAdapter,
                displayMember: "label",
                valueMember: "value",
                width: '200', height: '25',
                selectedIndex: 0
            }).on('select', $.proxy(function () {
                    self.renderProductionChart();
                    self.renderProductionGrid();
                }, self
            ));

            var source =
            {
                datatype: "array",
                "datafields": [
                    {
                        "name": "label",
                        "map": "label>EN"
                    },
                    {
                        "name": "value",
                        "map": "code"
                    }
                ],
                localdata: domainElements
            };
            var dataAdapter = new $.jqx.dataAdapter(source);

            $(s.PROD_ELEMENT).jqxDropDownList({
                source: dataAdapter,
                displayMember: "label",
                valueMember: "value",
                width: '200', height: '25',
                selectedIndex: 0
            }).on('select', $.proxy(function () {
                    self.renderProductionChart();
                    self.renderProductionGrid();
                }, self
            ));

            //chart
            self.renderProductionChart();

            //grid
            self.renderProductionGrid();

        });
    };

    Host.prototype.renderProductionGrid = function () {

        var dataGrid = [],
            dataset = this.datasets.production,
            d = dataset.data,
            comm = $(s.PROD_COMM).jqxDropDownList('val'),
            elem = $(s.PROD_ELEMENT).jqxDropDownList('val');


        for (var i = 0; i < d.length; i++) {

            if (d[i][2] === elem && d[i][3] === comm) {

                dataGrid.push({
                    area: this.columnsCodeMapping['Area' + '-prod'][dataset.data[i][0]],
                    year: dataset.data[i][1],
                    element: this.columnsCodeMapping['Element' + '-prod'][dataset.data[i][2]],
                    commodity: this.columnsCodeMapping['Commodity' + '-prod'][dataset.data[i][3]],
                    unit: this.columnsCodeMapping['UM' + '-prod'][dataset.data[i][4]],
                    value: dataset.data[i][5]
                })
            }

        }

        var source =
        {
            datafields: [
                {name: 'area', type: 'string'},
                {name: 'year', type: 'string'},
                {name: 'element', type: 'string'},
                {name: 'commodity', type: 'string'},
                {name: 'unit', type: 'string'},
                {name: 'value', type: 'string'}
            ],
            localdata: dataGrid
        };

        // initialize jqxGrid
        $(s.PROD_GRID).jqxGrid(
            {
                source: source,
                width: '100%',
                pageable: true,
                columnsresize: true,
                autoheight: true,
                sortable: true,
                altrows: true,
                columns: [
                    {text: 'Area', datafield: 'area'},
                    {text: 'Year', datafield: 'year'},
                    {text: 'Elements', datafield: 'element'},
                    {text: 'Commodity', datafield: 'commodity'},
                    {text: 'Unit', datafield: 'unit'},
                    {text: 'Value', datafield: 'value'}
                ]
            });

    };

    Host.prototype.renderProductionChart = function () {

        var temp = {},
            data = [],
            d = this.datasets.production.data,
            comm = $(s.PROD_COMM).jqxDropDownList('val'),
            elem = $(s.PROD_ELEMENT).jqxDropDownList('val');

        var x = [];
        for (var key in this.columnsCodeMapping['Commodity' + '-prod']) {
            if (this.columnsCodeMapping['Commodity' + '-prod'].hasOwnProperty(key)) {
                x.push(this.columnsCodeMapping['Commodity' + '-prod'][key]);
            }
        }

        //TODO sua x per confronto on tutte le commodity


        for (var i = 0; i < d.length; i++) {

            if (d[i][2] === elem && d[i][3] === comm) {

                var emirate = this.columnsCodeMapping['Area' + '-prod'][d[i][0]];

                if (!temp[emirate]) {
                    temp[emirate] = [];
                }
                temp[emirate].push(d[i][5]);
            }
        }

        var o = Object.keys(temp).sort();

        for (i = 0; i < o.length; i++) {
            if (temp.hasOwnProperty(o[i])) {
                data.push({name: o[i], data: temp[o[i]]})
            }
        }

        $(s.PROD_CHART).highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Production - ' + this.columnsCodeMapping['Element' + '-prod'][elem],
                x: -20 //center
            },
            subtitle: {
                text: 'Source: www.uaestatistics.gov.ae/',
                x: -20
            },
            xAxis: {
                categories: [this.columnsCodeMapping['Commodity' + '-prod'][comm]]
            },
            yAxis: {
                title: {
                    text: 'Tonnes (TN)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: 'Tonnes'
            },
            series: data
        });

    };

    Host.prototype.initDomain_combined = function () {
        var source = [
            "Input",
            "Export"
        ];
        // Create a jqxDropDownList
        $(s.COMBINED_TYPE).jqxDropDownList({source: source, selectedIndex: 1, width: '200', height: '25'});

    };

    Host.prototype.initDomainTab = function () {

        if (this.domainTabInit !== true) {
            this.domainTabInit = true;
            this.initDomainTree();
        }

    };

    Host.prototype.initCountryTab = function () {

        if (this.countryTabInit !== true) {
            this.countryTabInit = true;
            this.initCountry();
        }

    };

    Host.prototype.initCountry = function () {

        var self = this;

        $('td').on('click', function () {
            $(s.COUNTRY_CONTAINER).fadeOut('fast', function () {
                $(s.COUNTRY_DETAILS_CONTAINER).fadeIn('fast');

                var id = ['c-chart-1', 'c-chart-2', 'c-chart-3', 'c-chart-4'];

                self.initChats(id);
            });

        })
    };

    Host.prototype.initRankingTab = function () {

        if (this.rankingTabInit !== true) {
            this.rankingTabInit = true;
            this.initRankingTree();
        }

    };

    Host.prototype.initRankingTree = function () {

        var self = this;

        $(s.TREE_RANK_CONTAINER).jstree({
            core: {
                data: JSON.parse(ranking_config),
                themes: {
                    icons: false
                }
            },
            "plugins": ["wholerow"]
        }).on('changed.jstree', function (e, data) {

            e.preventDefault();

            $(s.CHARTS_CONTAINER).fadeOut("fast", function () {
                var id = ['r-chart-1'];

                self.initChats(id);
                $(s.CHARTS_CONTAINER).fadeIn("fast");
            });

        });
    };

    Host.prototype.createMapCode = function (values) {

        var map = {};
        for (var i = 0; i < values.length; i++) {
            //TODO throw error if the code is not well-formed
            map[values[i].code] = this.getLabel(values[i], 'label');
        }

        return map;
    };

    Host.prototype.getLabel = function (obj, attribute) {

        var label,
            keys;

        if (obj.hasOwnProperty(attribute) && obj.title !== null) {

            if (obj[attribute].hasOwnProperty('EN')) {
                label = obj[attribute]['EN'];
            } else {

                keys = Object.keys(obj[attribute]);

                if (keys.length > 0) {
                    label = obj[attribute][keys[0]];
                }
            }
        }

        return label;
    };


    return Host;

});