/*global define*/
define(['jquery', 'fx-submodules/config/baseConfig'],
    function ($, config_base) {

        'use strict';

        //Use the following example to override properties:
        //services.SERVICE_BASE_ADDRESS = "http://fenix.fao.org/d3s_dev2/msd";

        /*var services = {
    
            TOP_MENU: {
                url: 'json/fenix-ui-topmenu_config.json',
                active: "createdataset"
            },
            SERVICE_BASE_ADDRESS: "http://fenix.fao.org/d3s_dev/msd"
        };*/

        var cfg = {};
        $.extend(cfg, config_base);

        cfg.TOP_MENU = {
            url: 'json/fenix-ui-topmenu_config.json',
            active: "createdataset"
        };

        /*cfg.DEFAULT_META = {
            "contextSystem" : "RLM",
            "datasources" : ["RLM"],
            "columns" : [
                {
                    "id" : "COUNTRY",
                    "subject" : "geo",
                    "title" : { "EN" : "Country" },
                    "dataType" : "code",
                    "domain" : { "codes" : [ { "idCodeList" : "GAUL", "version" : "2014" } ] }
                },
                {
                    "id" : "YEAR",
                    "subject" : "time",
                    "title" : { "EN" : "Year" },
                    "dataType" : "year",
                    "domain" : { "period" : { "from" : 2000, "to" : 2015 } }
                },
                {
                    "id" : "YEAR_LABEL",
                    "title" : { "EN" : "Year" },
                    "dataType" : "text"
                },
                {
                    "id" : "QUALIFIER",
                    "title" : { "EN" : "Qualifier" },
                    "dataType" : "code",
                    "domain" : { "codes" : [ { "idCodeList" : "RLM_QualifierCodeList" } ] }
                },
                {
                    "id" : "SOURCE",
                    "title" : { "EN" : "Source" },
                    "dataType" : "code",
                    "domain" : { "codes" : [ { "idCodeList" : "RLM_SourceCodeList" } ] }
                },
                {
                    "id" : "UM",
                    "title" : { "EN" : "Unit of measure" },
                    "dataType" : "text"
                },

                {
                    "id" : "VALUE",
                    "subject" : "value",
                    "title" : { "EN" : "Production (Tonnes)" },
                    "dataType" : "text"
                }
            ]
        };
*/


        cfg.DSD_EDITOR_CONTEXT_SYSTEM = "demo1";
        cfg.DSD_EDITOR_DATASOURCES = ["D3S"];

        //cfg.METADATA_EDITOR_AJAX_EVENT_CALL = "config/submodules/metadataEditor/fx-editor-ajax-config_PROD.json";
        cfg.METADATA_EDITOR_AJAX_EVENT_CALL = "config/submodules/metadataEditor/fx-editor-ajax-config_DEMO.json";



        return cfg;
    });