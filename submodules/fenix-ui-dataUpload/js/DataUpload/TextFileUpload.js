define(['jquery',
    'text!fx-DataUpload/templates/DataUpload/FileUpload.htm',
    'i18n!fx-DataUpload/multiLang/DataUpload/nls/ML_DataUpload'
],
function ($, FileUploadHTML, mlRes) {
    var widgetName = 'TextFileUpload';
    var evtTextFileUploaded = 'textFileUploaded.' + widgetName + '.fenix';
    var defConfig = { accept: ['csv'] };

    function TextFileUpload(config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);
        for (var i = 0; i < this.config.accept.length; i++)
            this.config.accept[i] = this.config.accept[i].toLowerCase();
        this.$container;
        this.$uploadInput;
    };

    TextFileUpload.prototype.render = function (container) {
        this.$container = container;
        this.$container.html(FileUploadHTML);
        this.initUploadInput();
    }

    TextFileUpload.prototype.initUploadInput = function () {
        this.$uploadInput = this.$container.find('#fName');
        var me = this;

        
        this.$uploadInput.change(function (e) {
            var ext = me.$uploadInput.val().split(".").pop().toLowerCase();
            if ($.inArray(ext, me.config.accept) == -1) {
                alert(mlRes.wrongFileType);
                return false;
            }

            if (e.target.files != undefined) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var str = e.target.result;
                    me.$container.trigger(evtTextFileUploaded, str);
                };
                reader.readAsText(e.target.files.item(0));
            }
            return false;
        });
    }

    return TextFileUpload;
});