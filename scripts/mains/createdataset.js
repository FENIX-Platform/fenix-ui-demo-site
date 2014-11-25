/*global require*/


// relative or absolute path of Components' main.js

define(['module'], function (module) {

    var userConfig = module.config();

    var override = {

        "fenix-ui-topmenu": '../components/fenix-ui-topmenu',
        'jqxall': "http://fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-all",
        'jquery': '../../node_modules/jquery/dist/jquery.min',
        'bootstrap': '../../node_modules/bootstrap/dist/js/bootstrap.min'
    };

    require(['../../submodules/fenix-ui-metadata-editor/js/paths',
        '../../submodules/fenix-ui-DSDEditor/js/paths',
        '../../submodules/fenix-ui-DataEditor/js/paths',
        '../../submodules/fenix-ui-dataUpload/js/paths',
    ], function (MetadataEditor, Editor, DataEditor, DataUpload) {

        // NOTE: This setTimeout() call is used because, for whatever reason, if you make
        //       a 'require' call in here or in the Cart without it, it will just hang
        //       and never actually go fetch the files in the browser. There's probably a
        //       better way to handle this, but I don't know what it is.
        setTimeout(function () {

            /*
             @param: prefix of Components paths to reference them also in absolute mode
             @param: paths to override
             @param: options passed in to override defaults
             @param: callback function
             */
            MetadataEditor.initialize('../../submodules/fenix-ui-metadata-editor/js', override, userConfig, function () {

                Editor.initialize('../../submodules/fenix-ui-DSDEditor/js', override, function () {

                    DataEditor.initialize('../../submodules/fenix-ui-DataEditor/js', null, function () {
                        DataUpload.initialize('../../submodules/fenix-ui-dataUpload/js', null, function () {


                            require([
                                'fx-editor/start',
                                'fenix-ui-topmenu/main',
                                'fx-DSDEditor/start',
                                'fx-DataEditor/start',
                                'fx-DataUpload/start'
                            ], function (StartUp, TopMenu, E, DE, DUpload) {

                                new StartUp().init(userConfig);

                                new TopMenu({
                                    url: 'json/fenix-ui-topmenu_config.json', active: "createdataset"
                                });


                                //TEST
                                /*$('#hh').click(function () {
                                    $('#metadataEditorContainer').hide();
                                    $('#DSDEditorContainer').show();
                                });*/
                                //END TEST

                                E.init({
                                    subjects: "submodules/fenix-ui-DSDEditor/config/DSDEditor/Subjects.json",
                                    datatypes: "submodules/fenix-ui-DSDEditor/config/DSDEditor/Datatypes.json",
                                    codelists: "submodules/fenix-ui-DSDEditor/config/DSDEditor/Codelists_UNECA.json"
                                }, function () {
                                    $('#DSDEditorContainer').hide();
                                });

                                DUpload.init('#divUplaodCSV');
                                $('body').on("csvUploaded.DataUpload.fenix", function (evt,contents)
                                {
                                    var existingCols = E.getColumns();
                                    var over = true;
                                    if (existingCols && existingCols.length > 0)
                                       over= confirm("Overwrite?");
                                    if (over)
                                    {
                                        E.setColumns(contents.columns);
                                    }
                                });



                                $('body').on("columnEditDone.DSDEditor.fenix", function (e, p) {
                                    var newDSD = { "columns": p.payload };
                                    E.updateDSD(uid, version, newDSD, datasource, contextSys);

                                    $('#DSDEditorContainer').hide();
                                    $('#DataEditorContainer').show();

                                    DE.set({ "dsd": newDSD });
                                })

                               /* $('body').on("columnEditDone.DSDEditor.fenix", function (e, p) {
                                    var newDSD = { "columns": p.payload };
                                    E.updateDSD(uid, version, newDSD, datasource, contextSys);

                                    $('#DSDEditorContainer').hide();
                                    $('#DataEditorContainer').show();

                                    DE.set({ "dsd": newDSD });
                                    DE.setData();
                                })*/

                                var datasource = "CountrySTAT";
                                var contextSys = "CountrySTAT";

                                DE.init();

                                var uid = "";
                                var version = "";

                                window.setTimeout(function () {
                                    //E.setColumns([{ "id": "CODE", "title": { "EN": "Item" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "UNECA_AgeRange" }] }, "subject": "item", "supplemental": null }, { "id": "YEAR", "title": { "EN": "Year" }, "key": true, "dataType": "year", "domain": null, "subject": "time", "supplemental": null }, { "id": "NUMBER", "title": { "EN": "Val" }, "key": false, "dataType": "number", "subject": "value", "supplemental": null }]);

                                    //DE.set({ dsd: { columns: [{ "id": "CODE", "title": { "EN": "Item" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "UNECA_AgeRange" }] }, "subject": "item", "supplemental": null }, { "id": "YEAR", "title": { "EN": "Year" }, "key": true, "dataType": "year", "domain": null, "subject": "time", "supplemental": null }, { "id": "NUMBER", "title": { "EN": "Val" }, "key": false, "dataType": "number", "subject": "value", "supplemental": null }] } });
                                    //DE.setData([[1,2,3]]);
                                   $('#DataEditorContainer').hide();

                                }, 2000);

                                document.body.addEventListener("fx.editor.finish", function (e) {
                                    console.log(e.detail.data);
                                    uid = e.detail.data.uid;

                                    $('#metadataEditorContainer').hide();
                                    $('#DSDEditorContainer').show();

                                }, false);



                                $('#createDatasetEnd').on('click', function () {

                                    var data = DE.getData();
                                    var meta = DE.getMeta();
                                    var distincts = DE.getDistincts();

                                    if (distincts) {
                                        for (var colI = 0; colI < meta.dsd.columns.length; colI++) {
                                            var colId = meta.dsd.columns[colI].id;
                                            var colType = meta.dsd.columns[colI].dataType;

                                            if (distincts.hasOwnProperty(colId)) {
                                                var col = meta.dsd.columns[colI];
                                                if (colType == "code") {
                                                    var idCL = col.domain.codes[0].idCodeList;
                                                    var verCL = col.domain.codes[0].version;

                                                    if (verCL)
                                                        col.values = {
                                                            codes: [
                                                                { idCodeList: idCL, version: verCL }
                                                            ]
                                                        };
                                                    else
                                                        col.values = {
                                                            codes: [
                                                                { idCodeList: idCL }
                                                            ]
                                                        };
                                                    col.values.codes[0].codes = [];
                                                    for (var i = 0; i < distincts[colId].length; i++) {
                                                        col.values.codes[0].codes.push({ code: distincts[colId][i] });
                                                    }
                                                }
                                                else {
                                                    col.values = { timeList: distincts[colId] };
                                                }
                                            }
                                        }

                                    }
                                    //console.log(meta.dsd);
                                    /*console.log("data");
                                    console.log(data);*/


                                    DE.updateData(uid, null, data, function () {
                                        DE.updateDSD(uid, null, meta.dsd, datasource, contextSys, function () {
                                            window.location.reload();
                                        });
                                    });



                                })

                            });


                        });

                    });

                });

            }, 0);
        });
    });

});
