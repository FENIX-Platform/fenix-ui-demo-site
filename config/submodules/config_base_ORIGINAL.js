/*global define*/
define([], function () {

    'use strict';

    //Use the following example to override properties:
    //services.SERVICE_BASE_ADDRESS = "http://fenix.fao.org/d3s_dev2/msd";
    var services = {
        //Dev
        SERVICE_BASE_ADDRESS: "http://fenix.fao.org/d3s_dev/msd"
        //Demo
        //SERVICE_BASE_ADDRESS: 'http://fenix.fao.org/d3s_fenix/msd'
        //prod
        //SERVICE_BASE_ADDRESS: "http://fenixservices.fao.org/d3s/msd"
    };

    return services;
});