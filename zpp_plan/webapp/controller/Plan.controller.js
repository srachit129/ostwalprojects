sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    'sap/m/MessageToast',
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, MessageToast, MessageBox) {
        "use strict";

        return Controller.extend("zppplan.controller.Plan", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableItemModel");
                this.getView().getModel('oTableItemModel').setProperty("/aTableItem", []);
                this.CallTableBackEndData();
            },
            CallTableBackEndData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    customIcon: '/controller/preloader1.gif',
                    text: "Loading"
                });
                oBusyDialog.open();
                var OMODEL = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPP_PLANT_BINDING");
                // var OMODEL = this.getView().getModel();
                var oTableModel = this.getView().getModel('oTableItemModel');
                var aTableData = oTableModel.getProperty("/aTableItem");
                OMODEL.read("/ZPP_PLANT_CDS", {
                    success: function (orres) {
                        orres.results.map(function (items) {
                            var obj = {
                                "CompanyCode": items.CompanyCode,
                                "MaterialCode": items.MaterialCode,
                                "MonthName": items.MonthName,
                                "SalesQty": items.SalesQty,

                            }
                            aTableData.push(obj);
                        })
                        this.getView().getModel('oTableItemModel').setProperty("/aTableItem", aTableData);
                        oBusyDialog.close();
                    }.bind(this),
                })

            },
            AddSingleRowData: function () {
                var oTableModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTableModel.getProperty("/aTableItem")

                var obj = {
                    "CompanyCode": "",
                    "MonthName": "",
                    "MaterialCode": "",
                    "SalesQty": ""
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aTableItem", aTableArr)

            },
            SaveTableData: function () {
                // var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMMREQUISITIONCODE");
                var oModel = this.getView().getModel();
                var OnScreenPP_PlanTableData = this.getView().getModel("oTableItemModel").getProperty("/aTableItem");
                var aNewArr = [];
                if (OnScreenPP_PlanTableData.length > 0) {
                    var busydialog = new sap.m.BusyDialog({
                        customIcon: '/css/preloader1.gif',
                        title: "Saving Record",
                        text: "Please wait"
                    });
                    busydialog.open();

                    OnScreenPP_PlanTableData.map(function (items) {

                        var oTableData = {
                            CompanyCode: items.CompanyCode,
                            MaterialCode: items.MaterialCode,
                            MonthName: items.MonthName,
                            SalesQty: items.SalesQty,
                        }
                        aNewArr.push(oTableData);
                    }.bind(this))

                    aNewArr.map(function (items) {
                        var CompanyCode = items.CompanyCode;
                        var MaterialCode = items.MaterialCode;
                        var MonthName = items.MonthName;
                        var oFilter1 = new sap.ui.model.Filter("CompanyCode", "EQ", CompanyCode)
                        var oFilter2 = new sap.ui.model.Filter("MaterialCode", "EQ", MaterialCode)
                        var oFilter3 = new sap.ui.model.Filter("MonthName", "EQ", MonthName)

                        oModel.read("/ZPP_PLANT_CDS", {
                            filters: [oFilter1, oFilter2, oFilter3],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {
                                    var oTableData2 = {
                                        CompanyCode: items.CompanyCode,
                                        MaterialCode: items.MaterialCode,
                                        MonthName: items.MonthName,
                                        SalesQty: items.SalesQty,
                                    }
                                    oModel.update("/ZPP_PLANT_CDS(CompanyCode='" + encodeURIComponent(CompanyCode) + "',MaterialCode='" + encodeURIComponent(MaterialCode) + "',MonthName='" + encodeURIComponent(MonthName) + "')", oTableData2, {
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
                                    oModel.create("/ZPP_PLANT_CDS", items, {
                                        method: "POST",
                                        success: function (ores) {
                                            MessageToast.show("Data Saved Succesfully")
                                            busydialog.close();
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
                    customIcon: '/css/preloader1.gif',
                    title: "Deleting Record",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oModel = this.getView().getModel();
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                if (aSelectedIndex.length > 0 && aSelectedIndex.length < 2) {
                    var oTableModel = this.getView().getModel("oTableItemModel");
                    var aTableArr = oTableModel.getProperty("/aTableItem");
                    var aNewArr = [];

                    var tb = this.getView().byId("PP_PlanTable");

                    var rowid = tb.getSelectedIndices();
                    var data = aTableArr[rowid];

                    for (var i = 0; i < aSelectedIndex.length; i++) {
                        // var No1 = aSelectedIndex[i].No1;
                        // var Usercode = aSelectedIndex[i].Usercode;
                        oModel.remove("/ZPP_PLANT_CDS(CompanyCode='" + data.CompanyCode + "',MaterialCode='" + data.MaterialCode + "',MonthName='" + data.MonthName + "')", {
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
                        var CompanyCode = item.CompanyCode;
                        var MaterialCode = item.MaterialCode;
                        var MonthName = item.MonthName;
                        var iIndex = "";
                        aTableArr.map(function (item, index) {
                            if (CompanyCode === item.CompanyCode && MaterialCode === item.MaterialCode && MonthName === item.MonthName) {
                                iIndex = index;
                            }
                        })
                        aTableArr.splice(iIndex, 1);
                    })

                    oTableModel.setProperty("/aTableItem", aTableArr)
                } else if (aSelectedIndex.length < 1) {

                    oBusyDialog.close();
                    MessageBox.error("Please Select Atleast One Row")
                } else {
                    oBusyDialog.close();
                    MessageBox.error("You can delete by selecting only one row")
                }
            },
            onPrintTable: function () {
                var oTable = this.getView().byId("PP_PlanTable");
                var sTableHTML = oTable.getDomRef().outerHTML;

                var sWindowSettings = "toolbar=yes,location=no,directories=yes,menubar=yes,scrollbars=yes,resizable=yes";
                var oPrintWindow = window.open('', '', sWindowSettings);
                oPrintWindow.document.write('<table:columns>');
                oPrintWindow.document.write(sTableHTML);
                oPrintWindow.document.write('</table:columns>');
                oPrintWindow.document.close();
                oPrintWindow.print();
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
                this.getView().byId('PP_PlanTable').setVisibleRowCount(data);
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
        });
    });
