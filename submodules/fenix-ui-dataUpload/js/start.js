define([
    'jquery',
    'fx-DataUpload/js/DataUpload/DataUpload',
    'bootstrap',
    'domReady!'
], function ($, DataUpload) {

    function DataUpload_starter(containerID, config) {
        DataUpload = new DataUpload(config);
        DataUpload.render($(containerID), null);
    }

    return {
        init: DataUpload_starter
    }
});