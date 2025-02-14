sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, FilterOperator, MessageToast, MessageBox, JSONModel, UIComponent) {
        "use strict";

        return Controller.extend("zpaymentapproval.controller.paymentapproval", {
            onInit: function () {
                var CurrentDate = new Date()
                var dt1 = Number(CurrentDate.getDate());
                var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                var mm1 = Number(CurrentDate.getMonth() + 1);
                var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                var yyyy = CurrentDate.getFullYear();
                var CurrentDate1 = yyyy + '-' + MM1 + '-' + DT1;
                this.getView().byId("idFiscalYear").setValue(yyyy)
                this.getView().byId("idPostingDateTo").setValue(CurrentDate1)
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel");
                this.getView().getModel("oTableDataModel").setProperty("/aTableData", []);

                var oSettingObject = {
                    "labeltype": "0-30",
                    "labeltype1": "30-60",
                    "labeltype2": "60-90",
                    "labeltype3": "Above 90"
                }
                this.getView().setModel(new JSONModel(oSettingObject), "oGenericModel")

                var obj = {
                    "authorized": false
                }
                this.getView().setModel(new sap.ui.model.json.JSONModel(obj), "AuthorizationModel")

                var id = sap.ushell.Container.getService("UserInfo").getId();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZACCOUNT_AND_USERID")
                oModel.read("/Account_Group_And_UserId", {
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            // if (items.Userid === id) {
                            //     this.getView().getModel("AuthorizationModel").setProperty("/authorized", true)
                            // } else {
                            //     this.getView().getModel("AuthorizationModel").setProperty("/authorized", false)
                            // }
                        }.bind(this))
                        this.getView().setModel(new sap.ui.model.json.JSONModel(), "oUserIdModel")
                        this.getView().getModel("oUserIdModel").setProperty("/UserId", oresponse.results)
                    }.bind(this)
                })
            },
            GetTableData1: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Loading"
                });
                oBusyDialog.open();
                var userid = this.getView().getModel("oUserIdModel").getProperty("/UserId")
                var id = sap.ushell.Container.getService("UserInfo").getId();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPAYMENT_WORKFLOW_BIN");
                var TableModel = this.getView().getModel("oTableDataModel");
                var aTableArr = TableModel.getProperty("/aTableData")
                var companycode = this.getView().byId("idCompanyCode").getValue();
                var fiscalyear = this.getView().byId("idFiscalYear").getValue();
                var postingdateto = this.getView().byId("idPostingDateTo").getValue();
                var oFilter = new sap.ui.model.Filter("companycode", "EQ", companycode)
                var oFilter1 = new sap.ui.model.Filter("fiscalyear", "EQ", fiscalyear)
                var oFilter2 = new sap.ui.model.Filter("postingdate", "LE", postingdateto)
                var oFilter3 = new sap.ui.model.Filter("FLAG", "EQ", "Group")
                var aFilters = []

                if (companycode != "") {
                    aFilters.push(oFilter)
                }
                if (fiscalyear != "") {
                    aFilters.push(oFilter1)
                }
                if (postingdateto != "") {
                    aFilters.push(oFilter2)
                }
                aFilters.push(oFilter3)

                if (aTableArr.length > 0) {
                    var aTableArr = [];
                    TableModel.setProperty("/aTableData", aTableArr)
                    oModel.read("/pay_res", {
                        filters: [aFilters],
                        success: function (oresponse) {
                            oBusyDialog.close();
                            oresponse.results.map(function (items) {
                                userid.map(function (item) {
                                    if (items.request === "X" && items.Request2 === "X") {
                                        if (items.supplieraccountgroup === item.Accountinggrp && id === item.Userid) {
                                            var oTableData = {
                                                CompanyCode: items.companycode,
                                                AccountingDocument: items.accountingdocument,
                                                FinYear: items.fiscalyear,

                                                // PostingDate: PostingDate1,
                                                Supplier: items.supplier,
                                                SupplierName: items.suppliername,

                                                PaymentTerms: items.paymentterms,

                                                DocumentReference: items.documentreferenceid,

                                                AdditionalCurrency1: items.additionalcurrency1,
                                                AssignmentReference: items.assignmentreference,
                                                FiscalYear: items.fiscalyear,
                                                SupplierAccountGroup: items.supplieraccountgroup,
                                                AccountGroupText: items.accountgroupname,
                                                Remark: item.Remark,
                                                GLBalance: items.amountinbalancetransaccrcy,

                                                AdviceAmount: "",
                                                Partialpayment: "",
                                                Labeltype: items.amt_0_30,
                                                Labeltype1: items.amt_30_60,
                                                Labeltype2: items.amt_60_90,
                                                Labeltype3: items.amt_above_90,
                                            }
                                            if (items.Approve === "X") {
                                                oTableData["Approved"] = "Approved";
                                                oTableData["Approv_Button"] = false;
                                            } else {
                                                oTableData["Approved"] = "";
                                                oTableData["Approv_Button"] = true;
                                            }                              
                                            if (items.paymentblockingreason == "X") {
                                                obj["paymentblockingreason"] = false;
                                            } else {
                                                obj["paymentblockingreason"] = true;
                                            }
                                            aTableArr.push(oTableData);
                                        }
                                    }
                                }.bind(this))

                            }.bind(this))
                            TableModel.setProperty("/aTableData", aTableArr)
                        }, error: function () {
                            oBusyDialog.close();
                        }
                    })
                } else {
                    oModel.read("/pay_res", {
                        filters: [aFilters],
                        success: function (oresponse) {
                            oBusyDialog.close();
                            oresponse.results.map(function (items) {
                                userid.map(function (item) {
                                    if (items.request === "X" && items.Request2 === "X") {
                                        if (items.supplieraccountgroup === item.Accountinggrp && id === item.Userid) {
                                            var oTableData = {
                                                CompanyCode: items.companycode,
                                                AccountingDocument: items.accountingdocument,
                                                FinYear: items.fiscalyear,

                                                // PostingDate: PostingDate1,
                                                Supplier: items.supplier,
                                                SupplierName: items.suppliername,

                                                PaymentTerms: items.paymentterms,

                                                DocumentReference: items.documentreferenceid,

                                                AdditionalCurrency1: items.additionalcurrency1,
                                                AssignmentReference: items.assignmentreference,
                                                FiscalYear: items.fiscalyear,
                                                SupplierAccountGroup: items.supplieraccountgroup,
                                                AccountGroupText: items.accountgroupname,

                                                GLBalance: items.amountinbalancetransaccrcy,

                                                AdviceAmount: "",
                                                Partialpayment: "",
                                                Labeltype: items.amt_0_30,
                                                Labeltype1: items.amt_30_60,
                                                Labeltype2: items.amt_60_90,
                                                Labeltype3: items.amt_above_90,
                                            }
                                            if (items.Approve === "X") {
                                                oTableData["Approved"] = "Approved";
                                                oTableData["Approv_Button"] = false;
                                            } else {
                                                oTableData["Approved"] = "";
                                                oTableData["Approv_Button"] = true;
                                            }                              
                                            if (items.paymentblockingreason == "X") {
                                                obj["paymentblockingreason"] = false;
                                            } else {
                                                obj["paymentblockingreason"] = true;
                                            }
                                            aTableArr.push(oTableData);
                                        }
                                    }
                                }.bind(this))

                            }.bind(this))
                            TableModel.setProperty("/aTableData", aTableArr)
                        }, error: function () {
                            oBusyDialog.close();
                        }
                    })
                }
            },
            onApprov: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIPAYMENT_PROGRAM")
                var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Approving"
                });
                oBusyDialog.open();
                var oComanModel = this.getView().getModel('oTableDataModel')
                var sPath = oEvent.getSource().getBindingContext('oTableDataModel').getPath();
                var oFilter = new sap.ui.model.Filter("Accountingdocument", "EQ", oContext.AccountingDocument)
                var oFilter1 = new sap.ui.model.Filter("Finyear", "EQ", oContext.FiscalYear)
                var oFilter3 = new sap.ui.model.Filter("Companycode", "EQ", oContext.CompanyCode)

                // var refDate = new Date(oContext.RefDate);
                // var refDate1 = new Date(refDate.getTime() - refDate.getTimezoneOffset() * 60000);
                // var refDate2 = refDate1.toISOString().slice(0, 16);

                // var netDueDate = new Date(oContext.NetDueDate);
                // var netDueDate1 = new Date(netDueDate.getTime() - netDueDate.getTimezoneOffset() * 60000);
                // var netDueDate2 = netDueDate1.toISOString().slice(0, 16);

                var obj = {
                    // "Tokennum": oContext.Tokennum,
                    "Companycode": oContext.CompanyCode,
                    "Accountingdocument": oContext.AccountingDocument,
                    "Finyear": oContext.FiscalYear,
                    "Accgroup": oContext.SupplierAccountGroup,
                    "Accgrptext": oContext.AccountGroupText,
                    "Supplier": oContext.Supplier,
                    // "Reffdate": refDate2,
                    "Reffdoc": oContext.DocumentReferences,
                    "glbalance": oContext.GLBalance,
                    "Partialpayment": oContext.PartialPayment,
                    // "Notdueamonnt": oContext.NotDueAmt === "" ? "0.00" : parseFloat(oContext.NotDueAmt).toFixed(2),
                    // "Pandingamount": oContext.PendingAmount === "" ? "0.00" : parseFloat(oContext.PendingAmount).toFixed(2),
                    // "Netduedate": netDueDate2,
                    // "OverDueDays": oContext.OverDueDays,
                    // "AdviceAmount": oContext.AdviceAmount,
                    // "AdvanceAdvice": oContext.AdvanceAdvice,
                    // "Glbalanceafteradv": oContext.GLBalanceAfterAdvice === "" ? "0.00" : parseFloat(oContext.GLBalanceAfterAdvice).toFixed(2),
                    "Remark": oContext.Remark,
                    "Request": "X",
                    "Request2": "X",
                    "Approve": "X",
                }

                oModel.read("/ZFIPAYMENT_PROGRAM", {
                    filters: [oFilter, oFilter1, oFilter3],
                    success: function (oresponse) {
                        if (oresponse.results.length === 0) {
                            oModel.create("/ZFIPAYMENT_PROGRAM", obj, {
                                success: function (oresponse) {
                                    oBusyDialog.close();
                                    // MessageToast.show("Approved")
                                    MessageBox.success("Approved", {
                                        onClose: function (oAction) {
                                            if (oAction === MessageBox.Action.OK) {
                                                oComanModel.getProperty(sPath).Approved = "Approved";
                                                oComanModel.setProperty(sPath, oComanModel.getProperty(sPath))
                                            }
                                        }.bind(this)
                                    });
                                }, error: function () {
                                    oBusyDialog.close();
                                    MessageBox.error("Data wasn't saved.")
                                }
                            })
                        } else {
                            oModel.update("/ZFIPAYMENT_PROGRAM(Accountingdocument='" + oContext.AccountingDocument + "',Finyear='" + oContext.FiscalYear + "',Companycode='" + oContext.CompanyCode + "')", obj, {
                                success: function (oresponse) {
                                    oBusyDialog.close();
                                    // MessageToast.show("Approved")
                                    MessageBox.success("Approved", {
                                        onClose: function (oAction) {
                                            if (oAction === MessageBox.Action.OK) {
                                                oComanModel.getProperty(sPath).Approved = "Approved";
                                                oComanModel.setProperty(sPath, oComanModel.getProperty(sPath))
                                            }
                                        }.bind(this)
                                    });
                                }, error: function () {
                                    oBusyDialog.close();
                                    MessageBox.error("Data wasn't saved")
                                }
                            })
                        }
                    }
                })
            },
            onReject: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIPAYMENT_PROGRAM")
                var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
                
                var TableModel = this.getView().getModel("oTableDataModel");
                var aTableArr = TableModel.getProperty("/aTableData")
                var RejectedRow_Index = aTableArr.indexOf(oContext);
                MessageBox.warning("Are you Sure You Went to Reject", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (sAction) {
                        if (sAction === "YES") {
                            var oBusyDialog = new sap.m.BusyDialog({
                                text: "Rejecting..."
                            });
                            oBusyDialog.open();
                            var oFilter = new sap.ui.model.Filter("Accountingdocument", "EQ", oContext.AccountingDocument)
                            var oFilter1 = new sap.ui.model.Filter("Finyear", "EQ", oContext.FiscalYear)
                            var oFilter3 = new sap.ui.model.Filter("Companycode", "EQ", oContext.CompanyCode)
                            var obj = {
                                "Companycode": oContext.CompanyCode,
                                "Accountingdocument": oContext.AccountingDocument,
                                "Finyear": oContext.FiscalYear,
                                "Accgroup": oContext.SupplierAccountGroup,
                                "Accgrptext": oContext.AccountGroupText,
                                "Supplier": oContext.Supplier,
                                "Reffdoc": oContext.DocumentReferences,
                                "glbalance": oContext.GLBalance,
                                "Remark": oContext.Remark,
                                "Request": "",
                                "Request2": "",
                                "Rejected": "X",
                            }
                            oModel.read("/ZFIPAYMENT_PROGRAM", {
                                filters: [oFilter, oFilter1, oFilter3],
                                success: function (oresponse) {
                                    if (oresponse.results.length === 0) {
                                        oModel.create("/ZFIPAYMENT_PROGRAM", obj, {
                                            success: function (oresponse) {
                                                oBusyDialog.close();
                                                MessageToast.show("Rejected")
                                                var newArray = [];
                                                for (var D = 0; D < aTableArr.length; D++) {
                                                    if(D != RejectedRow_Index){
                                                        newArray.push(aTableArr[D])
                                                    }
                                                }
                                                TableModel.setProperty("/aTableData", newArray)
                                            }, error: function () {
                                                oBusyDialog.close();
                                                MessageBox.error("Data wasn't saved.")
                                            }
                                        })
                                    } else {
                                        oModel.update("/ZFIPAYMENT_PROGRAM(Accountingdocument='" + oContext.AccountingDocument + "',Finyear='" + oContext.FiscalYear + "',Companycode='" + oContext.CompanyCode + "')", obj, {
                                            success: function (oresponse) {
                                                oBusyDialog.close();
                                                MessageToast.show("Rejected")
                                                var newArray = [];
                                                for (var D = 0; D < aTableArr.length; D++) {
                                                    if(D != RejectedRow_Index){
                                                        newArray.push(aTableArr[D])
                                                    }
                                                }
                                                TableModel.setProperty("/aTableData", newArray)
                                            }, error: function () {
                                                oBusyDialog.close();
                                                MessageBox.error("Data wasn't saved")
                                            }
                                        })
                                    }
                                }
                            })

                        }
                    }
                });
            },

            supplierDetails: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
                var comcode = this.getView().byId("idCompanyCode").getValue();
                var fiscalyear = this.getView().byId("idFiscalYear").getValue();
                var object = {
                    "aSecondScreenDat": oContext.SupplierAccountGroup,
                    "CompanyCode": comcode,
                    "FiscalYear": fiscalyear
                }
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(object), "oSecondScreenDataModel")
                UIComponent.getRouterFor(this).navTo("supplierdetails");
            },
        });
    });
