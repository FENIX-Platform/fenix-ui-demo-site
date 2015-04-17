/*global define*/
define([], function () {

    'use strict';

    //Use the following example to override properties:
    //services.SERVICES_BASE_ADDRESS = "http://fenix.fao.org/d3s_dev2/msd";

    var services = {

        TOP_MENU : {
            url: 'json/fenix-ui-topmenu_config.json',
            active: "createdataset"
        }

    };

    return services;
});