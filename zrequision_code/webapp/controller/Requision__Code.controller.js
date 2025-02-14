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

        return Controller.extend("zrequisioncode.controller.Requision__Code", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableItemModel");
                this.getView().getModel('oTableItemModel').setProperty("/aTableItem", []);
                this.CallTableBackEndData();
            },

            CallTableBackEndData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Loading"
                });
                oBusyDialog.open();
                var OMODEL = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMMREQUISITIONCODE");
                // var OMODEL = this.getView().getModel();
                var oTableModel = this.getView().getModel('oTableItemModel');
                var aTableData = oTableModel.getProperty("/aTableItem");
                OMODEL.read("/ZMMREQUISITIONCODE_cds", {
                    success: function (orres) {
                        orres.results.map(function (items) {
                            var obj = {
                                "Usercode": items.Usercode,
                                "Username": items.Username,

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
                    "Username": "",
                    "Usercode": ""
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aTableItem", aTableArr)

            },

            SaveTableData: function () {
                // var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMMREQUISITIONCODE");
                var oModel = this.getView().getModel();
                var OnScreenRequisitionTableData = this.getView().getModel("oTableItemModel").getProperty("/aTableItem");
                var aNewArr = [];
                if (OnScreenRequisitionTableData.length > 0) {
                    var busydialog = new sap.m.BusyDialog({
                        title: "Saving Record",
                        text: "Please wait"
                    });
                    busydialog.open();

                    OnScreenRequisitionTableData.map(function (items) {

                        var oTableData = {
                            Usercode: items.Usercode,
                            Username: items.Username,
                        }
                        aNewArr.push(oTableData);
                    }.bind(this))

                    aNewArr.map(function (items) {
                        var Usercode = items.Usercode;
                        var oFilter1 = new sap.ui.model.Filter("Usercode", "EQ", Usercode)

                        oModel.read("/ZMMREQUISITIONCODE_cds", {
                            filters: [oFilter1],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {
                                    var oTableData2 = {
                                        Usercode: items.Usercode,
                                        Username: items.Username,
                                    }
                                    oModel.update("/ZMMREQUISITIONCODE_cds(Usercode='" + encodeURIComponent(Usercode) + "')", oTableData2, {
                                        success: function (response) {
                                            busydialog.close();
                                            MessageToast.show("Data Updated Succesfully")
                                        }.bind(this),
                                        error: function () {
                                            busydialog.close();
                                            MessageToast.show("Data Not Saved Succesfully")
                                        }.bind(this)
                                    })
                                } else {
                                    oModel.create("/ZMMREQUISITIONCODE_cds", items, {
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
                // var plant = this.getView().byId("plant1").getValue();

                // var oModel = this.getView().getModel();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMMREQUISITIONCODE");
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                if (aSelectedIndex.length > 0 && aSelectedIndex.length < 2) {
                    var oTableModel = this.getView().getModel("oTableItemModel");
                    var aTableArr = oTableModel.getProperty("/aTableItem");
                    var aNewArr = [];

                    var tb = this.getView().byId("RequisitionTable");

                    var rowid = tb.getSelectedIndices();
                    var data = aTableArr[rowid];

                    for (var i = 0; i < aSelectedIndex.length; i++) {
                        // var No1 = aSelectedIndex[i].No1;
                        // var Usercode = aSelectedIndex[i].Usercode;
                        oModel.remove("/ZMMREQUISITIONCODE_cds(Usercode='" + data.Usercode + "')", {
                            method: "DELETE",
                            success: function (oresponse) {
                                MessageToast.show("Data Delete Succesfully")
                                oBusyDialog.close();
                            },
                            error: function () {
                                MessageToast.show("Data Not Delete Succesfully")
                                oBusyDialog.close();
                            }
                        })
                    }

                    for (var i = 0; i < aSelectedIndex.length; i++) {
                        aNewArr.push(aTableArr[aSelectedIndex[i]]);
                    }

                    aNewArr.map(function (item) {
                        var Usercode = item.Usercode;
                        var iIndex = "";
                        aTableArr.map(function (item, index) {
                            if (Usercode === item.Usercode) {
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
        });
    });
