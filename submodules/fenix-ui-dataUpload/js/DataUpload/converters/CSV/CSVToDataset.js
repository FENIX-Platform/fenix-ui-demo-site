define([
'jquery',
 ],
function ($, fx_column) {
    function CSVToDataset() {
    };

    CSVToDataset.prototype.parseColumns = function (data, langCode) {
        if (!langCode)
            langCode = "EN";
        if (!data)
            throw new Error("Nothing to parse");
        if (!data[0])
            if (!data)
                throw new Error("Nothing to parse");
        
        var toRet = [];
        for (var i = 0; i < data[0].length; i++) {
            var toAdd = {};
            var colName = data[0][i].trim();
            if (!colName)
                throw new Error("Column name cannot be empty");
            toAdd.id = colName;
            toAdd.title = {};
            toAdd.title[langCode] = colName;
            toRet.push(toAdd);
        }
        return toRet;
    }

    CSVToDataset.prototype.parseData = function (data) {
        var toRet = [];
        for (i = 1; i < data.length; i++)
            toRet.push(data[i]);
        //cleanNumbers(columns, toRet, decimalSeparator, thousandsSeparator);
        return toRet;
    }

    var cleanNumbers = function (columns, rows, decimalSeparator, thousandsSeparator) {
        if (!columns)
            return;
        if (!rows)
            return;
        for (var i = 0; i < rows.length; i++)
            cleanRow(columns, rows[i], decimalSeparator, thousandsSeparator);
    }

    var cleanRow = function (columns, row, decimalSep, thousandsSep) {
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].dataType == 'number' || columns[i].dataType == 'year' || columns[i].dataType == 'percentage') {
                row[i].replace(thousandsSep, '');
                row[i].replace(decimalSep, '.');
            }
        }
    }

    return CSVToDataset;
});