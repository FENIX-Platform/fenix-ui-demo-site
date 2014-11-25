define([],
function () {
    function JSonToCSV() {
        this.separator = ",";
        this.quotes = "\"";
        this.colIds;
    };

    JSonToCSV.prototype.toCSV = function (colIds, data) {
        if (!data)
            return "";
        if (data.length == 0)
            return "";

        this.colIds = colIds;

        var toRet = "";
        for (var i = 0; i < colIds.length; i++) {
            toRet += this.quotes + colIds[i] + this.quotes;
            if (i != colIds.length - 1)
                toRet += this.separator;
        }
        toRet += "\r\n";
        var len = data.length - 1;
        for (var i = 0; i < data.length; i++) {
            toRet += this.objectToLine(data[i]);
            if (i != len)
                toRet += "\r\n";
        }
        return toRet;
    }

    JSonToCSV.prototype.objectToLine = function (obj) {
        var toRet = "";
        var len = this.colIds.length - 1;
        for (var i = 0; i < this.colIds.length; i++) {
            if (this.colIds[i] in obj)
                toRet += this.quotes + obj[this.colIds[i]] + this.quotes;
            if (i != len)
                toRet += this.separator;
        }
        return toRet;
    }
    return JSonToCSV;
});