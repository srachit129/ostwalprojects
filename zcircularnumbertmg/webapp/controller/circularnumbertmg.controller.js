sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    "zcircularnumbertmg/libs/xlsx.min"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, MessageToast, Spreadsheet, Export, ExportTypeCSV) {
        "use strict";

        return Controller.extend("zcircularnumbertmg.controller.circularnumbertmg", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableItemModel");
                this.getView().getModel('oTableItemModel').setProperty("/aTableItem", []);
            },

            createGuid: function () {
                var dt = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (dt + Math.random() * 16) % 16 | 0;
                    dt = Math.floor(dt / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                return uuid;
            },

            onConfirmDialog: function () {
                var that = this;
                var dialog = new sap.m.Dialog({
                    title: 'Upload',
                    type: 'Message',
                    icon: 'sap-icon://upload',
                    content: [
                        new sap.ui.unified.FileUploader({
                            width: '100%',
                            uploadUrl: 'upload/',
                            change: function (oEvent) {
                                var file = oEvent.getParameter('files')[0];
                                if (file && window.FileReader) {
                                    var reader = new FileReader();
                                    reader.onload = function (evn) {
                                        var strCSV = evn.target.result; //string in CSV
                                        that.csvJSON(strCSV);
                                    };
                                    reader.readAsText(file);
                                }
                                dialog.close();
                            },
                        }),
                    ],

                    endButton: new sap.m.Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        },
                    }),
                });
                dialog.open();
            },

            csvJSON: function (csv) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();

                var oTableModel = this.getView().getModel('oTableItemModel');
                // var oContext = csv.getSource().getBindingContext('oTableItemModel').getObject();
                var lines = csv.split('\n');
                var result = [];
                var headers = lines[0].split(',');
                for (var i = 1; i < lines.length; i++) {
                    var obj = {};
                    var currentline = lines[i].split(',');
                    for (var j = 0; j < headers.length; j++) {
                        obj[headers[j]] = currentline[j];
                    }
                    result.push(obj);
                }
                var oStringResult = JSON.stringify(result);
                var oFinalResult = JSON.parse(oStringResult.replace(/\\r/g, ''));
                var len = oFinalResult.length - 1;
                var data = [];
                for (var j = 0; j < len; j++) {
                    var ata = {};
                    ata = oFinalResult[j];
                    data.push(ata);
                }


                //return result; //JavaScript object
                oTableModel.setProperty("/aTableItem", data);
                this.getView().byId('table1').setVisibleRowCount(data);
                oBusyDialog.close();

            },

            onUpload: function (e) {
                this._import(e.getParameter("files") && e.getParameter("files")[0]);
            },

            _import: function (file) {
                var that = this;
                var excelData = {};
                if (file && window.FileReader) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var data = e.target.result;
                        var workbook = XLSX.read(data, {
                            type: 'binary',
                            cellDates: true
                        });
                        workbook.SheetNames.forEach(function (sheetName) {
                            // Here is your object for every sheet in workbook
                            excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

                        });

                        var oTableModel = this.getView().getModel('oTableItemModel');
                        var tableData = oTableModel.getProperty("/aTableItem");

                        excelData.map(function (items) {
                            var validto = new Date(items.ValidTo)
                            var ValidTo = new Date(items.ValidTo)
                            var dt1 = (Number(ValidTo.getDate())) + 1;
                            var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                            var mm1 = Number(ValidTo.getMonth() + 1);
                            var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                            var ValidTo1 = ValidTo.getFullYear() + '-' + MM1 + '-' + DT1;
                            // validto = validto.toISOString().split('T')[0]

                            var ValidFrom = new Date(items.ValidFrom)
                            var dt1 = (Number(ValidFrom.getDate())) + 1;
                            var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                            var mm1 = Number(ValidFrom.getMonth() + 1);
                            var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                            var ValidFrom1 = ValidFrom.getFullYear() + '-' + MM1 + '-' + DT1;
                            // validfrom = validfrom.toISOString().split('T')[0]

                            
                            var ReleasedOn = new Date(items.ReleasedOn)
                            var dt1 = (Number(ReleasedOn.getDate())) + 1;
                            var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                            var mm1 = Number(ReleasedOn.getMonth() + 1);
                            var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                            var ReleasedOn1 = ReleasedOn.getFullYear() + '-' + MM1 + '-' + DT1;
                            // releasedon = releasedon.toISOString().split('T')[0]

                            var obj = {
                                "CircularNumber": items.CircularNumber,
                                "StateCode": items.StateCode,
                                "CircularStatus": items.CircularStatus,
                                "CircularDescription": items.CircularDescription,
                                "ValidTo": ValidTo1,
                                "ValidFrom": ValidFrom1,
                                "ReleasedOn": ReleasedOn1,
                            }
                            tableData.push(obj)
                        }.bind(this))

                        // Setting the data to the local model 


                        oTableModel.setProperty("/aTableItem", tableData);
                    }.bind(this);
                    reader.onerror = function (ex) {
                        console.log(ex);
                    };
                    reader.readAsBinaryString(file);
                }
            },

            createColumnConfig: function () {
                return [
                    {
                        label: 'CircularNumber',
                        property: '',

                    },
                    {
                        label: 'CircularDescription',
                        property: '',
                    },
                    {
                        label: 'StateCode',
                        property: '',
                    },
                    {
                        label: 'CircularStatus',
                        property: '',
                    },
                    {
                        label: 'ValidTo',
                        property: '',
                    },
                    {
                        label: 'ValidFrom',
                        property: '',
                    },
                    {
                        label: 'ReleasedOn',
                        property: '',
                    },
                    {
                        label: 'Notused',
                        property: '',
                    }
                ];
            },

            onExport: function () {
                var aCols, oBinding, oSettings, oSheet, oTable;

                oTable = this.byId('table1');
                oBinding = oTable.getBinding('rows');
                aCols = this.createColumnConfig();

                oSettings = {
                    workbook: { columns: aCols },
                    dataSource: oBinding
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build()
                    .then(function () {
                        MessageToast.show('Spreadsheet export has finished');
                    }).finally(function () {
                        oSheet.destroy();
                    });
            },

            onSave: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving data"
                });

                oBusyDialog.open();


                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YY1_SD_CIRCULARNUMBER_CDS")
                var tabledata = this.getView().getModel("oTableItemModel").getProperty("/aTableItem");
                tabledata.map(function (items) {
                    var uuid = this.createGuid();
                    
                    if (items.ValidTo.includes("-")) {
                        var validdate = items.ValidTo.split("-")
                        if (validdate[0].length < 4) {
                            var validtodate = items.ValidTo.split("-").reverse().join("-");
                            var validtodate1 = new Date(validtodate);
                            var validtodate2 = new Date(validtodate1.getTime() - validtodate1.getTimezoneOffset() * 60000);
                            var validtodate3 = validtodate2.toISOString().slice(0, 16);
                        } else {
                            var validtodate4 = new Date(items.ValidTo);
                            var validtodate5 = new Date(validtodate4.getTime() - validtodate4.getTimezoneOffset() * 60000);
                            validtodate3 = validtodate5.toISOString().slice(0, 16);
                        }
                    } else if (items.ValidTo.includes("/")) {
                        var validto = items.ValidTo.split("/")
                        if (validto[0].length < 4) {
                            var validtodate = items.ValidTo.split("/").reverse().join("/");
                            var validtodate1 = new Date(validtodate);
                            var validtodate2 = new Date(validtodate1.getTime() - validtodate1.getTimezoneOffset() * 60000);
                            var validtodate3 = validtodate2.toISOString().slice(0, 16);
                        } else {
                            validtodate1 = new Date(items.ValidTo);
                            validtodate2 = new Date(validtodate1.getTime() - validtodate1.getTimezoneOffset() * 60000);
                            validtodate3 = validtodate2.toISOString().slice(0, 16);
                        }
                    }

                    if (items.ValidFrom.includes("-")) {
                        var validfrom = items.ValidFrom.split("-")
                        if (validfrom[0].length < 4) {
                            var validfromdate = items.ValidFrom.split("-").reverse().join("-");
                            var validfromdate1 = new Date(validfromdate);
                            var validfromdate2 = new Date(validfromdate1.getTime() - validfromdate1.getTimezoneOffset() * 60000);
                            var validfromdate3 = validfromdate2.toISOString().slice(0, 16);
                        } else {
                            var validfromdate1 = new Date(items.ValidFrom);
                            var validfromdate2 = new Date(validfromdate1.getTime() - validfromdate1.getTimezoneOffset() * 60000);
                            var validfromdate3 = validfromdate2.toISOString().slice(0, 16);
                        }
                    } else if (items.ValidFrom.includes("/")) {
                        var validfrom = items.ValidFrom.split("/")
                        if (validfrom[0].length < 4) {
                            var validfromdate = items.ValidFrom.split("/").reverse().join("/");
                            var validfromdate1 = new Date(validfromdate);
                            var validfromdate2 = new Date(validfromdate1.getTime() - validfromdate1.getTimezoneOffset() * 60000);
                            var validfromdate3 = validfromdate2.toISOString().slice(0, 16);
                        } else {
                            var validfromdate1 = new Date(items.ValidFrom);
                            var validfromdate2 = new Date(validfromdate1.getTime() - validfromdate1.getTimezoneOffset() * 60000);
                            var validfromdate3 = validfromdate2.toISOString().slice(0, 16);
                        }
                    }

                    if (items.ReleasedOn.includes("-")) {
                        var releasedon = items.ReleasedOn.split("-")
                        if (releasedon[0].length < 4) {
                            var releasedon = items.ReleasedOn.split("-").reverse().join("-");
                            var releasedon1 = new Date(releasedon);
                            var releasedon2 = new Date(releasedon1.getTime() - releasedon1.getTimezoneOffset() * 60000);
                            var releasedon3 = releasedon2.toISOString().slice(0, 16);
                        } else {
                            var releasedon1 = new Date(items.ReleasedOn);
                            var releasedon2 = new Date(releasedon1.getTime() - releasedon1.getTimezoneOffset() * 60000);
                            var releasedon3 = releasedon2.toISOString().slice(0, 16);
                        }
                    } else if (items.ReleasedOn.includes("/")) {
                        var releasedon = items.ReleasedOn.split("/")
                        if (releasedon[0].length < 4) {
                            var releasedondate = items.ReleasedOn.split("/").reverse().join("/");
                            var releasedon1 = new Date(releasedondate);
                            var releasedon2 = new Date(releasedon1.getTime() - releasedon1.getTimezoneOffset() * 60000);
                            var releasedon3 = releasedon2.toISOString().slice(0, 16);
                        } else {
                            var releasedon1 = new Date(items.ReleasedOn);
                            var releasedon2 = new Date(releasedon1.getTime() - releasedon1.getTimezoneOffset() * 60000);
                            var releasedon3 = releasedon2.toISOString().slice(0, 16);
                        }
                    }



                    // var validto = new Date(items.ValidTo);
                    // var validto1 = new Date(validto.getTime() - validto.getTimezoneOffset() * 60000);
                    // var validto2 = validto1.toISOString().slice(0, 16);

                    // var validfrom = new Date(items.ValidFrom);
                    // var validfrom1 = new Date(validfrom.getTime() - validfrom.getTimezoneOffset() * 60000);
                    // var validfrom2 = validfrom1.toISOString().slice(0, 16);

                    // var releasedon = new Date(items.ReleasedOn);
                    // var releasedon1 = new Date(releasedon.getTime() - releasedon.getTimezoneOffset() * 60000);
                    // var releasedon2 = releasedon1.toISOString().slice(0, 16);

                    var obj = {
                        "SAP_UUID": uuid,
                        "circular_no": items.CircularNumber,
                        "StateCode": String(items.StateCode),
                        "Circular_Status": items.CircularStatus,
                        "SAP_Description": items.CircularDescription,
                        "valid_to": validtodate3,
                        "valid_from": validfromdate3,
                        "released_on": releasedon3
                    }
                    oModel.create("/YY1_SD_CIRCULARNUMBER", obj, {
                        success: function (oresponse) {
                            oBusyDialog.close();
                            MessageToast.show("Data saved")
                        }, error: function (oresponse) {
                            oBusyDialog.close();
                            MessageToast.show(oresponse.responseText.split(":")[5].slice(1, 42))
                        }
                    })
                }.bind(this))

                // tabledata.map(function (items) {
                //     var oFilter = new sap.ui.model.Filter("SalesGrp", "EQ", items.SalesGroup)
                //     var oFilter1 = new sap.ui.model.Filter("Material", "EQ", items.MaterialCode)
                //     var oFilter2 = new sap.ui.model.Filter("CircularNo", "EQ", items.CircularNumber)
                //     var oFilter3 = new sap.ui.model.Filter("DeliveryDate", "EQ", items.OrderDateFrom)
                //     var oFilter4 = new sap.ui.model.Filter("DeliveryNdDate", "EQ", items.OrderDateTo)

                //     var orderDateFrom = items.OrderDateFrom;
                //     var oDate = new Date(orderDateFrom);
                //     var orderDateFrom1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                //     var orderDateFrom2 = orderDateFrom1.toISOString().slice(0, 16);

                //     var orderDateFrom3 = orderDateFrom1.toISOString().slice(0, 10);

                //     var orderDateTo = items.OrderDateTo;
                //     var oDate1 = new Date(orderDateTo);
                //     var orderDateTo1 = new Date(oDate1.getTime() - oDate1.getTimezoneOffset() * 60000);
                //     var orderDateTo2 = orderDateTo1.toISOString().slice(0, 16);

                //     var orderDateTo3 = orderDateTo1.toISOString().slice(0, 10);


                //     oModel.read("/Lifting_Discount", {
                //         filters: [oFilter, oFilter1, oFilter2, oFilter3, oFilter4],
                //         success: function (oresponse) {
                //             if (oresponse.results.length > 0) {

                //                 var obj = {
                //                     "SalesGrp": items.SalesGroup,
                //                     "Material": items.MaterialCode,
                //                     "CircularNo": items.CircularNumber,
                //                     "DeliveryDate": orderDateFrom2,
                //                     "DeliveryNdDate": orderDateTo2,
                //                     "Amount": items.Amount
                //                 }

                //                 oModel.update("/Lifting_Discount(SalesGrp='" + items.SalesGroup + "',Material='" + items.MaterialCode + "',CircularNo='" + encodeURIComponent(items.CircularNumber) + "',DeliveryDate=datetime'" + ((orderDateFrom3 + "T00:00:00")) + "',DeliveryNdDate=datetime'" + encodeURIComponent((orderDateTo3 + "T00:00:00")) + "')", obj, {
                //                     success: function (oresponse) {
                //                         oBusyDialog.close();
                //                         MessageToast.show("Data updated")
                //                     },
                //                     error: function () {
                //                         oBusyDialog.close();
                //                     }
                //                 })
                //             } else {
                //                 var obj = {
                //                     "SalesGrp": items.SalesGroup,
                //                     "Material": items.MaterialCode,
                //                     "CircularNo": items.CircularNumber,
                //                     "DeliveryDate": orderDateFrom2,
                //                     "DeliveryNdDate": orderDateTo2,
                //                     "Amount": items.Amount
                //                 }

                //                 oModel.create("/Lifting_Discount", obj, {
                //                     success: function (oresponse) {
                //                         oBusyDialog.close();
                //                         MessageToast.show("Data saved")
                //                     },
                //                     error(oresponse) {
                //                         oBusyDialog.close();
                //                     }
                //                 })
                //             }
                //         }
                //     })
                // })
            },

            addRow: function () {
                var oTableModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTableModel.getProperty("/aTableItem")

                var obj = {
                    "CircularNumber": "",
                    "CircularDescription": "",
                    "StateCode": "",
                    "CircularStatus": "",
                    "ValidTo": "",
                    "ValidFrom": "",
                    "ReleasedOn": "",
                    "Notused": ""
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aTableItem", aTableArr)
            },

            deleteRow: function (oEvent) {
                // var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZAPI_CASH_DIS")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oTableItemModel");
                var aTableArr = oTableModel.getProperty("/aTableItem");
                var id = "";
                var path = ""
                var idx = ""

                // for (var i = 0; i < aSelectedIndex.length; i++) {
                //     oModel.remove("/Cash_Discount(SalesGrp='" + aTableArr[aSelectedIndex[i]].SalesGroup + "',District='" + aTableArr[aSelectedIndex[i]].CustomerDistrict + "',CircularNo='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].CircularNumber) + "',PaymentTerm='" + aTableArr[aSelectedIndex[i]].PaymentTerms + "',Material='" + aTableArr[aSelectedIndex[i]].MaterialCode + "')", {
                //         success: function (oresponse) {

                //         }
                //     })
                // }

                for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                    id = aSelectedIndex[i]
                    path = oTable.getContextByIndex(id).sPath;
                    idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                    aTableArr.splice(idx, 1)
                }
                oTableModel.setProperty("/aTableItem", aTableArr)
            },

            onDataExport: sap.m.Table.prototype.exportData || function () {

                var oModel = this.getView().getModel("oTableItemModel");
                var oExport = new Export({

                    exportType: new ExportTypeCSV({
                        fileExtension: "csv",
                        separatorChar: ","
                    }),

                    models: oModel,

                    rows: {
                        path: "/aTableItem"
                    },
                    columns: [{
                        name: "CircularNumber",
                        template: {
                            content: "",
                        }
                    }, {
                        name: "CircularDescription",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "StateCode",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "CircularStatus",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "ValidTo",
                        template: {
                            content: ""
                        }
                    },
                    {
                        name: "ValidFrom",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "ReleasedOn",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "Notused",
                        template: {
                            content: ""
                        }
                    }]
                });
                console.log(oExport);
                oExport.saveFile().catch(function (oError) {

                }).then(function () {
                    oExport.destroy();
                });
            }
        });
    });
