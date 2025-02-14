sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("zfiusertmg.controller.zfiusername", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableItemModel")
                this.getView().getModel("oTableItemModel").setProperty("/aTableItem", [])

                var oTableModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTableModel.getProperty("/aTableItem")
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZACCOUNT_AND_USERID")
                oModel.read("/Account_Group_And_UserId", {
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var obj = {
                                "User": items.Userid,
                                "AccountGroup": items.Accountinggrp
                            }
                            aTableArr.push(obj)
                        })
                        this.getView().getModel('oTableItemModel').setProperty("/aTableItem", aTableArr)
                    }.bind(this)
                })
            },

            addRow: function () {
                var oTableModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTableModel.getProperty("/aTableItem")

                var obj = {
                    "User": "",
                    "AccountGroup": ""
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

            saveData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZACCOUNT_AND_USERID");
                var oTableModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTableModel.getProperty("/aTableItem")

                aTableArr.map(function (items) {
                    var obj = {
                        "Userid": items.User,
                        "Accountinggrp": items.AccountGroup
                    }

                    var oFilter = new sap.ui.model.Filter("Userid", "EQ", items.User)
                    var oFilter1 = new sap.ui.model.Filter("Accountinggrp", "EQ", items.AccountGroup)

                    oModel.read("/Account_Group_And_UserId", {
                        filters: [oFilter, oFilter1],
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {
                                oModel.update("/Account_Group_And_UserId(Userid='" + items.User + "',Accountinggrp='" + items.AccountGroup + "')", obj, {
                                    success: function (oresponse) {
                                        MessageToast.show("Data updated successfully");
                                    }
                                })
                            } else {
                                oModel.create("/Account_Group_And_UserId", obj, {
                                    success: function (oresponse) {
                                        MessageToast.show("Data saved successfully")
                                    }
                                })
                            }
                        }
                    })
                })
            }
        });
    });
