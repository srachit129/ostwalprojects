sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("zmaintaincirculartmg.controller.maintaincircularnum", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableItemModel");
                this.getView().getModel('oTableItemModel').setProperty("/aTableItem", []);
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

            saveData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving"
                });
                oBusyDialog.open();

                var oModel = this.getView().getModel();
                var tabledata = this.getView().getModel("oTableItemModel").getProperty("/aTableItem");

                tabledata.map(function (items) {
                    var oFilter = new sap.ui.model.Filter("CircularNo", "EQ", items.CircularNumber)

                    var validFrom = items.ValidFrom;
                    var oDate = new Date(validFrom);
                    var validFrom1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                    var validFrom2 = validFrom1.toISOString().slice(0, 16);

                    var validTo = items.ValidTo
                    var oDate1 = new Date(validTo);
                    var validTo1 = new Date(oDate1.getTime() - oDate1.getTimezoneOffset() * 60000);
                    var validTo2 = validTo1.toISOString().slice(0, 16);

                    var releasedOn = items.ReleasedOn
                    var oDate2 = new Date(releasedOn);
                    var releasedOn1 = new Date(oDate2.getTime() - oDate2.getTimezoneOffset() * 60000);
                    var releasedOn2 = releasedOn1.toISOString().slice(0, 16);


                    oModel.read("/MCN", {
                        filters: [oFilter],
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {

                                var obj = {
                                    "CircularNo": items.CircularNumber,
                                    "ValidFrom": validFrom2,
                                    "ValidTo": validTo2,
                                    "ReleasedOn": releasedOn2,
                                    "SalesZone": items.SalesZone
                                }

                                oModel.update("/MCN(CircularNo='" + items.CircularNumber + "')", obj, {
                                    success: function (oresponse) {
                                        oBusyDialog.close();
                                        MessageToast.show("Data updated")
                                    },
                                    error(oresponse) {
                                        oBusyDialog.close();
                                        MessageToast.show("Data was not updated")
                                    }
                                })
                            } else {
                                var obj = {
                                    "CircularNo": items.CircularNumber,
                                    "ValidFrom": validFrom2,
                                    "ValidTo": validTo2,
                                    "ReleasedOn": releasedOn2,
                                    "SalesZone": items.SalesZone
                                }

                                oModel.create("/MCN", obj, {
                                    success: function (oresponse) {
                                        oBusyDialog.close();
                                        MessageToast.show("Data saved")
                                    },
                                    error(oresponse) {
                                        oBusyDialog.close();
                                        MessageToast.show("Data was not updated")
                                    }
                                })
                            }
                        }.bind(this)
                    })
                })



            },

            addRow: function () {
                var oTableModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTableModel.getProperty("/aTableItem")

                var obj = {
                    "Sales Group": "",
                    "Customer District": "",
                    "Circular Number": "",
                    "Material Code": "",
                    "Amount": "",
                    "Created By": "",
                    "Created On": "",
                    "Changed By": "",
                    "Changed On": ""
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aTableItem", aTableArr)

            },

            removeRow: function (oEvent) {
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oTableItemModel");
                var aTableArr = oTableModel.getProperty("/aTableItem");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                    id = aSelectedIndex[i]
                    path = oTable.getContextByIndex(id).sPath;
                    idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                    aTableArr.splice(idx, 1)
                }
                oTableModel.setProperty("/aTableItem", aTableArr)
            }
        });
    });
