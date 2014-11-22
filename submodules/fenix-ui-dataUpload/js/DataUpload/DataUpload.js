define([
        'jquery',
        'fx-DataUpload/js/DataUpload/TextFileUpload',
        'text!fx-DataUpload/templates/DataUpload/DataUpload.htm',
        'fx-DataUpload/js/DataUpload/converters/CSV/CSVToStringArray',
        'fx-DataUpload/js/DataUpload/converters/CSV/CSVToDataset'
],
    function ($, TextFileUpload, DataUploadHTML, CSVToStringArray, CSVToDataset) {

        var widgetName = "DataUpload";
        var evtCSVUploaded = "csvUploaded." + widgetName + ".fenix";

        var DataUpload = function (config) {
            //this.config = {};
            //$.extend(true, this.config, defConfig, config);
            this.$container;
            this.txtUpload;
        };

        //Render - creation
        DataUpload.prototype.render = function (container, config) {
            $.extend(true, this.config, config);
            this.$container = container;
            this.$container.html(DataUploadHTML);

            this.$upload = this.$container.find('#cntDataUpload');
            this.txtUpload = new TextFileUpload();
            this.txtUpload.render(this.$upload);
            var me = this;
            this.$upload.on('textFileUploaded.TextFileUpload.fenix', function (evt, csvData) {
                var toArr = new CSVToStringArray();
                var arrData = toArr.toArray(csvData);

                var csvToDataset = new CSVToDataset();
                var cols = csvToDataset.parseColumns(arrData);
                var data = csvToDataset.parseData(arrData);

                var contents = {columns:cols, data:data};
                me.$container.trigger(evtCSVUploaded, contents);
            });
        }

        return DataUpload;
    });