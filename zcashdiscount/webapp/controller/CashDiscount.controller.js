sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/BusyDialog",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, BusyDialog, MessageBox) {
        "use strict";

        return Controller.extend("zcashdiscount.controller.CashDiscount", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableItemModel");
                this.getView().getModel('oTableItemModel').setProperty("/aTableItem", []);

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZAPI_CASH_DIS")
                var aTableArr = this.getView().getModel('oTableItemModel').getProperty("/aTableItem");
                oModel.read("/Cash_Discount", {
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var obj = {
                                "SalesGroup": items.SalesGrp,
                                "CustomerDistrict": items.District,
                                "CircularNumber": items.CircularNo,
                                "PaymentTerms": items.PaymentTerm,
                                "MaterialCode": items.Material,
                                "Amount": items.Amount
                            }
                            aTableArr.push(obj);
                        })
                        this.getView().getModel('oTableItemModel').setProperty("/aTableItem", aTableArr)
                    }.bind(this)
                })

                var obj = {
                    District: [
                        {
                            "Key": "1",
                            "Description": "Dhar"
                        },
                        {
                            "Key": "2",
                            "Description": "Rampur"
                        }
                    ]
                }
                this.getView().setModel(new sap.ui.model.json.JSONModel(obj), "DistrictObject")
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
                var aNewArr = [];
                var aNewArr1 = []
                var oDistrict = this.getView().getModel("DistrictObject").getData();

                data.map(function (items) {
                    aNewArr.push(items.CustomerDistrict)
                })

                oDistrict.District.map(function (items) {
                    aNewArr1.push(items.Description)
                })


                const compareArrays = (a, b) => {
                    return JSON.stringify(a) === JSON.stringify(b);
                };

                var district = compareArrays(aNewArr.sort(), aNewArr1)
                if (district === false) {
                    oBusyDialog.close();
                    MessageBox.error("Wrong district added")
                } else {
                    oTableModel.setProperty("/aTableItem", data);
                    oBusyDialog.close();
                }

                // data.map(function (items) {
                //     var district = items.CustomerDistrict
                //     oDistrict.District.map(function (item) {
                //         if (district === item.Description) {
                //             aNewArr.push(items)
                //             // oTableModel.setProperty("/aTableItem", data);
                //             // this.getView().byId('table1').setVisibleRowCount(data);
                //             // oBusyDialog.close();
                //         } else {
                //             oBusyDialog.close();
                //             MessageToast.show("Please check the district you have entered")
                //         }
                //     }.bind(this))
                // }.bind(this))
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
                    text: "Saving data"
                });

                oBusyDialog.open();
                var oModel = this.getView().getModel();
                var tabledata = this.getView().getModel("oTableItemModel").getProperty("/aTableItem")

                tabledata.map(function (items) {
                    var oFilter = new sap.ui.model.Filter("SalesGrp", "EQ", items.SalesGroup)
                    var oFilter1 = new sap.ui.model.Filter("District", "EQ", items.CustomerDistrict)
                    var oFilter2 = new sap.ui.model.Filter("CircularNo", "EQ", items.CircularNumber)
                    var oFilter3 = new sap.ui.model.Filter("PaymentTerm", "EQ", items.PaymentTerms)
                    var oFilter4 = new sap.ui.model.Filter("Material", "EQ", items.MaterialCode)

                    oModel.read("/Cash_Discount", {
                        filters: [oFilter, oFilter1, oFilter2, oFilter3, oFilter4],
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {

                                var obj = {
                                    "SalesGrp": items.SalesGroup,
                                    "District": items.CustomerDistrict,
                                    "CircularNo": items.CircularNumber,
                                    "PaymentTerm": items.PaymentTerms,
                                    "Material": items.MaterialCode,
                                    "Amount": items.Amount
                                }

                                oModel.update("/Cash_Discount(SalesGrp='" + items.SalesGroup + "',District='" + items.CustomerDistrict + "',CircularNo='" + encodeURIComponent(items.CircularNumber) + "',PaymentTerm='" + items.PaymentTerms + "',Material='" + items.MaterialCode + "')", obj, {
                                    success: function (oresponse) {
                                        oBusyDialog.close();
                                        MessageToast.show("Data updated")
                                    },
                                    error: function () {
                                        oBusyDialog.close()
                                    }
                                })
                            } else {
                                var obj = {
                                    "SalesGrp": items.SalesGroup,
                                    "District": items.CustomerDistrict,
                                    "CircularNo": items.CircularNumber,
                                    "PaymentTerm": items.PaymentTerms,
                                    "Material": items.MaterialCode,
                                    "Amount": items.Amount
                                }
                                oModel.create("/Cash_Discount", obj, {
                                    success: function (oresponse) {
                                        oBusyDialog.close();
                                        MessageToast.show("Data saved")
                                    },
                                    error: function () {
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

            deleteRow: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZAPI_CASH_DIS")
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oTableItemModel");
                var aTableArr = oTableModel.getProperty("/aTableItem");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    oModel.remove("/Cash_Discount(SalesGrp='" + aTableArr[aSelectedIndex[i]].SalesGroup + "',District='" + aTableArr[aSelectedIndex[i]].CustomerDistrict + "',CircularNo='" + encodeURIComponent(aTableArr[aSelectedIndex[i]].CircularNumber) + "',PaymentTerm='" + aTableArr[aSelectedIndex[i]].PaymentTerms + "',Material='" + aTableArr[aSelectedIndex[i]].MaterialCode + "')", {
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
