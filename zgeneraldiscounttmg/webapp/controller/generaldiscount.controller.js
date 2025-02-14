sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("zgeneraldiscounttmg.controller.generaldiscount", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableItemModel");
                this.getView().getModel('oTableItemModel').setProperty("/aTableItem", []);

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGD_SERVICE_BINDING")
                var aTableArr = this.getView().getModel('oTableItemModel').getProperty("/aTableItem");
                oModel.read("/GENERAL_DISCOUNT", {
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var obj = {
                                "SalesGroup": items.SalesGrp,
                                "CustomerDistrict": items.District,
                                "CircularNumber": items.CircularNo,
                                "MaterialCode": items.Material,
                                "Amount": items.Amount
                            }
                            aTableArr.push(obj);
                        })
                        this.getView().getModel('oTableItemModel').setProperty("/aTableItem", aTableArr)
                    }.bind(this)
                })
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
                    var oFilter = new sap.ui.model.Filter("SalesGrp", "EQ", items.SalesGroup)
                    var oFilter1 = new sap.ui.model.Filter("District", "EQ", items.CustomerDistrict)
                    var oFilter2 = new sap.ui.model.Filter("CircularNo", "EQ", items.CircularNumber)
                    var oFilter3 = new sap.ui.model.Filter("Material", "EQ", items.MaterialCode)

                    oModel.read("/GENERAL_DISCOUNT", {
                        filters: [oFilter, oFilter1, oFilter2, oFilter3],
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {

                                var obj = {
                                    "SalesGrp": items.SalesGroup,
                                    "District": items.CustomerDistrict,
                                    "CircularNo": items.CircularNumber,
                                    "Material": items.MaterialCode,
                                    "SalesGrp": items.SalesGroup,
                                    "Amount": items.Amount
                                }

                                oModel.update("/GENERAL_DISCOUNT(SalesGrp='" + items.SalesGroup + "',District='" + items.CustomerDistrict + "',CircularNo='" + encodeURIComponent(items.CircularNumber) + "',Material='" + items.MaterialCode + "')", obj, {
                                    success: function (oresponse) {
                                        oBusyDialog.close();
                                        MessageToast.show("Data updated")
                                    },
                                    error: function () {
                                        oBusyDialog.close();
                                    }
                                })
                            } else {
                                var obj = {
                                    "SalesGrp": items.SalesGroup,
                                    "District": items.CustomerDistrict,
                                    "CircularNo": items.CircularNumber,
                                    "Material": items.MaterialCode,
                                    "SalesGrp": items.SalesGroup,
                                    "Amount": items.Amount
                                }

                                oModel.create("/GENERAL_DISCOUNT", obj, {
                                    success: function (oresponse) {
                                        oBusyDialog.close();
                                        MessageToast.show("Data saved")
                                    },
                                    error(oresponse) {
                                        oBusyDialog.close();
                                    }
                                })
                            }
                        }
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
                    // "Created By": "",
                    // "Created On": "",
                    // "Changed By": "",
                    // "Changed On": ""
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aTableItem", aTableArr)

            },

            removeRow: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGD_SERVICE_BINDING")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oTableItemModel");
                var aTableArr = oTableModel.getProperty("/aTableItem");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/GENERAL_DISCOUNT(SalesGrp='" + aTableArr[aSelectedIndex[i]].SalesGroup + "',District='" + aTableArr[aSelectedIndex[i]].CustomerDistrict + "',CircularNo='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].CircularNumber) + "',Material='" + aTableArr[aSelectedIndex[i]].MaterialCode + "')", {
                        success: function (oresponse) {

                        }
                    })
                }

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
