sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("zquantitydiscounttmg.controller.quantitydiscount", {
            onInit: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableItemModel");
                this.getView().getModel('oTableItemModel').setProperty("/aTableItem", []);

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQDT_SERVICE_BINDING")
                var aTableArr = this.getView().getModel('oTableItemModel').getProperty("/aTableItem")
                oModel.read("/Quantity_Discount", {
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var obj = {
                                // "SalesGroup": items.SalesGrp,
                                "CircularNumber": items.CircularNo,
                                "QuantitySlabFrom": items.QuantitySlabFrom,
                                "QuantitySlabTo": items.QuantitySlabTo,
                                "MaterialCode": items.Materialpricinggroup,
                                "Amount": items.Amount
                            }
                            aTableArr.push(obj);
                        })
                        this.getView().getModel('oTableItemModel').setProperty("/aTableItem", aTableArr)
                        oBusyDialog.close();
                    
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
                    // var oFilter = new sap.ui.model.Filter("SalesGrp", "EQ", items.SalesGroup)
                    var oFilter1 = new sap.ui.model.Filter("CircularNo", "EQ", items.CircularNumber)
                    var oFilter2 = new sap.ui.model.Filter("QuantitySlabFrom", "EQ", items.QuantitySlabFrom)
                    var oFilter3 = new sap.ui.model.Filter("QuantitySlabTo", "EQ", items.QuantitySlabTo)
                    var oFilter4 = new sap.ui.model.Filter("Materialpricinggroup", "EQ", items.MaterialCode)

                    // var circulationDateFrom = items.CalculationDateFrom
                    // var oDate = new Date(circulationDateFrom);
                    // var circulationDateFrom1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                    // var circulationDateFrom2 = circulationDateFrom1.toISOString().slice(0, 16);

                    // var circulationDateTo = items.CalculationDateTo
                    // var oDate1 = new Date(circulationDateTo);
                    // var circulationDateTo1 = new Date(oDate1.getTime() - oDate1.getTimezoneOffset() * 60000);
                    // var circulationDateTo2 = circulationDateTo1.toISOString().slice(0, 16);

                    oModel.read("/Quantity_Discount", {
                        filters: [oFilter1, oFilter2, oFilter3, oFilter4],
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {

                                var obj = {
                                    // "SalesGrp": items.SalesGroup,
                                    // "CirculationDateFrom": circulationDateFrom2,
                                    // "CirculationDateTo": circulationDateTo2,
                                    "CircularNo": items.CircularNumber,
                                    "QuantitySlabFrom": items.QuantitySlabFrom,
                                    "QuantitySlabTo": items.QuantitySlabTo,
                                    "Materialpricinggroup": items.MaterialCode,
                                    "Amount": items.Amount
                                }

                                oModel.update("/Quantity_Discount(CircularNo='" + encodeURIComponent(items.CircularNumber) + "',QuantitySlabFrom='" + items.QuantitySlabFrom + "',QuantitySlabTo='" + items.QuantitySlabTo + "',Materialpricinggroup='" + items.MaterialCode + "')", obj, {
                                    success: function (oresponse) {
                                        oBusyDialog.close();
                                        MessageToast.show("Data updated")
                                    },
                                    error(oresponse) {
                                        oBusyDialog.close();
                                    }
                                })
                            } else {
                                var obj = {
                                    // "CirculationDateFrom": circulationDateFrom2,
                                    // "CirculationDateTo": circulationDateTo2,
                                    "CircularNo": items.CircularNumber,
                                    "QuantitySlabFrom": items.QuantitySlabFrom,
                                    "QuantitySlabTo": items.QuantitySlabTo,
                                    "Materialpricinggroup": items.MaterialCode,
                                    "Amount": items.Amount
                                }

                                oModel.create("/Quantity_Discount", obj, {
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
                    "Created By": "",
                    "Created On": "",
                    "Changed By": "",
                    "Changed On": ""
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aTableItem", aTableArr)

            },

            removeRow: function (oEvent) {
                var oModel = this.getView().getModel();
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oTableItemModel");
                var aTableArr = oTableModel.getProperty("/aTableItem");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/Quantity_Discount(CircularNo='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].CircularNumber) + "',QuantitySlabFrom='" + aTableArr[aSelectedIndex[i]].QuantitySlabFrom + "',QuantitySlabTo='" + aTableArr[aSelectedIndex[i]].QuantitySlabTo + "',Materialpricinggroup='" + aTableArr[aSelectedIndex[i]].MaterialCode + "')", {
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
