sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("zliftingdiscounttmg.controller.liftingdiscount", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableItemModel");
                this.getView().getModel('oTableItemModel').setProperty("/aTableItem", []);

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLDT_CDS")
                var aTableArr = this.getView().getModel('oTableItemModel').getProperty("/aTableItem");
                oModel.read("/Lifting_Discount", {
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var orderDateFrom = items.DeliveryDate
                            var oDate = new Date(orderDateFrom)
                            var orderDateFrom1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                            var orderDateFrom2 = orderDateFrom1.toISOString().slice(0, 10);

                            var orderDateTo = items.DeliveryNdDate
                            var oDate1 = new Date(orderDateTo)
                            var orderDateTo1 = new Date(oDate1.getTime() - oDate1.getTimezoneOffset() * 60000);
                            var orderDateTo2 = orderDateTo1.toISOString().slice(0, 10);

                            var obj = {
                                "SalesGroup": items.SalesGrp,
                                "MaterialCode": items.Material,
                                "CircularNumber": items.CircularNo,
                                "OrderDateFrom": orderDateFrom2,
                                "OrderDateTo": orderDateTo2,
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
                    var oFilter1 = new sap.ui.model.Filter("Material", "EQ", items.MaterialCode)
                    var oFilter2 = new sap.ui.model.Filter("CircularNo", "EQ", items.CircularNumber)
                    var oFilter3 = new sap.ui.model.Filter("DeliveryDate", "EQ", items.OrderDateFrom)
                    var oFilter4 = new sap.ui.model.Filter("DeliveryNdDate", "EQ", items.OrderDateTo)

                    var orderDateFrom = items.OrderDateFrom;
                    var oDate = new Date(orderDateFrom);
                    var orderDateFrom1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                    var orderDateFrom2 = orderDateFrom1.toISOString().slice(0, 16);

                    var orderDateFrom3 = orderDateFrom1.toISOString().slice(0, 10);

                    var orderDateTo = items.OrderDateTo;
                    var oDate1 = new Date(orderDateTo);
                    var orderDateTo1 = new Date(oDate1.getTime() - oDate1.getTimezoneOffset() * 60000);
                    var orderDateTo2 = orderDateTo1.toISOString().slice(0, 16);

                    var orderDateTo3 = orderDateTo1.toISOString().slice(0, 10);


                    oModel.read("/Lifting_Discount", {
                        filters: [oFilter, oFilter1, oFilter2, oFilter3, oFilter4],
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {

                                var obj = {
                                    "SalesGrp": items.SalesGroup,
                                    "Material": items.MaterialCode,
                                    "CircularNo": items.CircularNumber,
                                    "DeliveryDate": orderDateFrom2,
                                    "DeliveryNdDate": orderDateTo2,
                                    "Amount": items.Amount
                                }

                                oModel.update("/Lifting_Discount(SalesGrp='" + items.SalesGroup + "',Material='" + items.MaterialCode + "',CircularNo='" + encodeURIComponent(items.CircularNumber) + "',DeliveryDate=datetime'" +  ((orderDateFrom3 + "T00:00:00")) + "',DeliveryNdDate=datetime'" + encodeURIComponent((orderDateTo3 + "T00:00:00")) + "')", obj, {
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
                                    "Material": items.MaterialCode,
                                    "CircularNo": items.CircularNumber,
                                    "DeliveryDate": orderDateFrom2,
                                    "DeliveryNdDate": orderDateTo2,
                                    "Amount": items.Amount
                                }

                                oModel.create("/Lifting_Discount", obj, {
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
                    "OrderDateFrom": "",
                    "OrderDateTo": "",
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
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLDT_CDS")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oTableItemModel");
                var aTableArr = oTableModel.getProperty("/aTableItem");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/Lifting_Discount(SalesGrp='" + aTableArr[aSelectedIndex[i]].SalesGroup + "',DeliveryDate=datetime'" + encodeURIComponent((aTableArr[aSelectedIndex[i]].OrderDateFrom + "T00:00:00")) + "',DeliveryNdDate=datetime'" + encodeURIComponent((aTableArr[aSelectedIndex[i]].OrderDateTo + "T00:00:00")) + "',CircularNo='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].CircularNumber) + "',Material='" + aTableArr[aSelectedIndex[i]].MaterialCode + "')", {
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
