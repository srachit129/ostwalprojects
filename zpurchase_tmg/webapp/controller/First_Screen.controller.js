sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/m/MessageBox",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, MessageBox, Spreadsheet, Export, ExportTypeCSV) {
        "use strict";

        return Controller.extend("zpurchasetmg.controller.First_Screen", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel");
                this.getView().getModel("oTableDataModel").setProperty("/aTableData", []);
                this.CallTableBackEndData();
            },
            CallTableBackEndData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Data Calling",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPURCHASE_BINDING");
                // var oModel = this.getView().getModel();
                var aTable_BackendData = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                oModel.read("/ZPURCHASE_CDS", {
                    success: function (orres) {
                        orres.results.map(function (items) {
                            var obj = {
                                "VendorCode": items.VendorCode,
                                "MaterialCode": items.MaterialCode,
                                "Editable": false,
                            }
                            aTable_BackendData.push(obj);
                        })
                        this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTable_BackendData);
                        oBusyDialog.close();
                    }.bind(this),
                })

            },
            Add_Single_RowTableData: function () {
                var aEmptyRow_Data = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                var obj = {
                    "MaterialCode": "",
                    "VendorCode": "",
                    "Editable": true,
                }
                aEmptyRow_Data.push(obj);
                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aEmptyRow_Data);
            },
            SaveTableData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPURCHASE_BINDING");
                // var oModel = this.getView().getModel();
                var OnScreenMM_PurchaseTableData = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                var aNewArr = [];
                if (OnScreenMM_PurchaseTableData.length > 0) {
                    var busydialog = new sap.m.BusyDialog({
                        title: "Saving Record",
                        text: "Please wait"
                    });
                    busydialog.open();

                    OnScreenMM_PurchaseTableData.map(function (items) {

                        var oTableData = {
                            MaterialCode: items.MaterialCode,
                            VendorCode: items.VendorCode,
                        }
                        aNewArr.push(oTableData);
                    }.bind(this))

                    aNewArr.map(function (items) {
                        var MaterialCode = items.MaterialCode;
                        var VendorCode = items.VendorCode;
                        var oFilter1 = new sap.ui.model.Filter("MaterialCode", "EQ", MaterialCode)
                        var oFilter2 = new sap.ui.model.Filter("VendorCode", "EQ", VendorCode)

                        oModel.read("/ZPURCHASE_CDS", {
                            filters: [oFilter1, oFilter2],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {
                                    var oTableData2 = {
                                        MaterialCode: items.MaterialCode,
                                        VendorCode: items.VendorCode,
                                    }
                                    oModel.update("/ZPURCHASE_CDS(MaterialCode='" + encodeURIComponent(MaterialCode) + "',VendorCode='" + encodeURIComponent(VendorCode) + "')", oTableData2, {
                                        success: function (response) {
                                            busydialog.close();
                                            MessageToast.show("Data Updated Succesfully")
                                        }.bind(this),
                                        error: function () {
                                            busydialog.close();
                                            MessageToast.show("Data Not Updated Succesfully")
                                        }.bind(this)
                                    })
                                } else {
                                    oModel.create("/ZPURCHASE_CDS", items, {
                                        method: "POST",
                                        success: function (ores) {
                                            busydialog.close();
                                            MessageToast.show("Data Saved Succesfully")
                                        }.bind(this),
                                        error: function () {
                                            busydialog.close();
                                            MessageToast.show("Data Not Saved Succesfully")
                                        }.bind(this)
                                    })
                                }
                            }
                        })
                    }.bind(this))
                }
                else {
                    MessageBox.error("Table is Empty")

                }
            },
            DeleteTableData: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Deleting Record",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oModel = this.getView().getModel();
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                if (aSelectedIndex.length > 0 && aSelectedIndex.length < 2) {
                    var oTableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = oTableModel.getProperty("/aTableData");
                    var aNewArr = [];

                    var tb = this.getView().byId("MM_PurchaseTable");

                    var rowid = tb.getSelectedIndices();
                    var data = aTableArr[rowid];

                    for (var i = 0; i < aSelectedIndex.length; i++) {
                        // var No1 = aSelectedIndex[i].No1;
                        // var Usercode = aSelectedIndex[i].Usercode;
                        oModel.remove("/ZPURCHASE_CDS(VendorCode='" + data.VendorCode + "',MaterialCode='" + data.MaterialCode + "')", {
                            method: "DELETE",
                            success: function (oresponse) {
                                MessageToast.show("Data Delete Succesfully")
                                oBusyDialog.close();
                            },
                            error: function () {
                                MessageToast.show("Data is Just Deleted From the Screen")
                                oBusyDialog.close();
                            }
                        })
                    }

                    for (var i = 0; i < aSelectedIndex.length; i++) {
                        aNewArr.push(aTableArr[aSelectedIndex[i]]);
                    }

                    aNewArr.map(function (item) {
                        var VendorCode = item.VendorCode;
                        var MaterialCode = item.MaterialCode;
                        var iIndex = "";
                        aTableArr.map(function (item, index) {
                            if (VendorCode === item.VendorCode && MaterialCode === item.MaterialCode) {
                                iIndex = index;
                            }
                        })
                        aTableArr.splice(iIndex, 1);
                    })

                    oTableModel.setProperty("/aTableData", aTableArr)
                } else if (aSelectedIndex.length < 1) {

                    oBusyDialog.close();
                    MessageBox.error("Please Select Atleast One Row")
                } else {
                    oBusyDialog.close();
                    MessageBox.error("You can delete by selecting only one row")
                }
            },
            csvJSON: function (csv) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();

                var oTableModel = this.getView().getModel('oTableDataModel');
                // var oContext = csv.getSource().getBindingContext('oTableDataModel').getObject();
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
                oTableModel.setProperty("/aTableData", data);
                this.getView().byId('MM_PurchaseTable').setVisibleRowCount(data);
                oBusyDialog.close();

            },
            ExcelDataUpload: function () {
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
                                var file_Name = file.name;
                                var slice_file_Name = file_Name.slice((file_Name.length) - 4)
                                if (slice_file_Name == ".csv") {

                                    if (file && window.FileReader) {
                                        var reader = new FileReader();
                                        reader.onload = function (evn) {
                                            var strCSV = evn.target.result; //string in CSV
                                            that.csvJSON(strCSV);
                                        };
                                        reader.readAsText(file);
                                    }
                                    dialog.close();
                                }
                                else {
                                    dialog.close();
                                    MessageBox.error("You can upload only Excel file with .csv extension")
                                }
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
            onDataExport: sap.m.Table.prototype.exportData || function () {
                // var FileName = prompt("Enter the name under which you want to download excel", "Purchase");
                // if (FileName != "") {
                var oModel = this.getView().getModel("oTableDataModel");
                var oExport = new Export({

                    exportType: new ExportTypeCSV({
                        fileName: 'Dev',
                        fileExtension: "csv",
                        separatorChar: ","
                    }),

                    models: oModel,

                    rows: {
                        path: "/aTableData"
                    },
                    columns: [{
                        name: "MaterialCode",
                        template: {
                            content: "",
                        }
                    }, {
                        name: "VendorCode",
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
                // }
                // else {
                //     MessageBox.error("Please Enter File Name")
                // }
            },
        });
    });
