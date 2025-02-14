sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, FilterOperator, UIComponent, MessageToast, JSONModel, MessageBox) {
        "use strict";
        var oBusy = new sap.m.BusyDialog({
            text: "Please wait"
        });
        return Controller.extend("zpaymentprogram.controller.supplierdetails", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oSecondScreenModel")
                UIComponent.getRouterFor(this).getRoute('supplierdetails').attachPatternMatched(this.SecondScrenDataCall, this);
            },
            SecondScrenDataCall: function () {
                oBusy.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPAYMENT_WORKFLOW_BIN/")
                var AccountGroup = this.getOwnerComponent().getModel("oSecondScreenDataModel").getProperty("/aSecondScreenDat");
                var CompanyCode = this.getOwnerComponent().getModel("oSecondScreenDataModel").getProperty("/CompanyCode")
                var FiscalYear = this.getOwnerComponent().getModel("oSecondScreenDataModel").getProperty("/FiscalYear")
                var oFilter1 = new sap.ui.model.Filter("companycode", "EQ", CompanyCode)
                var oFilter2 = new sap.ui.model.Filter("fiscalyear", "EQ", FiscalYear)
                var oTableModel = this.getView().getModel("oSecondScreenModel");
                var oFilter = new sap.ui.model.Filter("supplieraccountgroup", "EQ", AccountGroup)
                var oFilter4 = new sap.ui.model.Filter("FLAG", "EQ", "Supplier")
                var aTableArr = [];
                oModel.read("/pay_res", {
                    filters: [oFilter, oFilter1, oFilter2, oFilter4],
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            if (items.request === "X") {
                                var obj = {
                                    CompanyCode: items.companycode,
                                    AccountingDocument: items.accountingdocument,
                                    FinYear: items.fiscalyear,
                                    // ClearingJournalEntry: items.ClearingJournalEntry,
                                    // AmountInTransactionCurrency: parseFloat(items.amountinbalancetransaccrcy).toFixed(2),
                                    // PostingDate: PostingDate1,
                                    Supplier: items.supplier,
                                    SupplierName: items.suppliername,
                                    // RefDate: RefDate1,
                                    PaymentTerms: items.paymentterms,
                                    // NetDueDate: NetDueDate1,
                                    DocumentReference: items.documentreferenceid,
                                    // NotDueAmt: days < 0 ? items.AmountInBalanceTransacCrcy : "",
                                    // PendingAmount: items.AmountInBalanceTransacCrcy,
                                    AdditionalCurrency1: items.additionalcurrency1,
                                    AssignmentReference: items.assignmentreference,
                                    FiscalYear: items.fiscalyear,
                                    SupplierAccountGroup: items.supplieraccountgroup,
                                    AccountGroupText: items.accountgroupname,
                                    // OverDueDays: days,
                                    GLBalance: items.amountinbalancetransaccrcy,
                                    // GLBalanceAfterAdvice: items.SupplierAmounttot - items.AmountInBalanceTransacCrcy,
                                    AdviceAmount: "",
                                    Partialpayment: "",
                                    Labeltype: items.amt_0_30,
                                    Labeltype1: items.amt_30_60,
                                    Labeltype2: items.amt_60_90,
                                    Labeltype3: items.amt_above_90,
                                }
                                if (items.request === "X") {
                                    obj["Requested"] = "Requested";
                                    obj["Request_Button"] = false;
                                } else if (items.rejected === "X" && (items.amountinbalancetransaccrcy).indexOf('-') != -1) {
                                    obj["Requested"] = "Rejected";
                                    obj["Request_Button"] = true;
                                } else if ((items.amountinbalancetransaccrcy).indexOf('-') != -1) {
                                    obj["Request_Button"] = true;
                                } else {
                                    obj["Request_Button"] = false;
                                }
                                if (items.paymentblockingreason == "X") {
                                    obj["paymentblockingreason"] = false;
                                } else {
                                    obj["paymentblockingreason"] = true;
                                }
                                aTableArr.push(obj)
                                oTableModel.setProperty("/aSecondScreenData", aTableArr)
                                oBusy.close();
                            }
                        })

                    }.bind(this)
                })
            },
            CallThirdScreen: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext("oSecondScreenModel").getObject();
                var object = {
                    "SupplierNumber": oContext.Supplier,
                }
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(object), "oSupplierNumberModel")
                UIComponent.getRouterFor(this).navTo("ThirdScrenData");

            },





            onRequest: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Requested"
                });
                oBusyDialog.open();
                var oComanModel = this.getView().getModel('oSecondScreenModel')
                var sPath = oEvent.getSource().getBindingContext('oSecondScreenModel').getPath();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIPAYMENT_PROGRAM")
                var oContext = oEvent.getSource().getBindingContext("oSecondScreenModel").getObject();

                var obj = {
                    "Companycode": oContext.CompanyCode,
                    "Accountingdocument": oContext.AccountingDocument,
                    "Finyear": oContext.FinYear,
                    "Supplier": oContext.Supplier,
                    "Suppliername": oContext.SupplierName,
                    "glbalance": oContext.GLBalance,
                    "Partialpayment": oContext.Partialpayment === "" ? "0.00" : parseFloat(oContext.Partialpayment).toFixed(2),
                    "Remark": oContext.Remark,
                    "Request": "X",
                    "Request2": "X",
                }
                var oFilter = new sap.ui.model.Filter("Accountingdocument", "EQ", oContext.AccountingDocument)
                var oFilter1 = new sap.ui.model.Filter("Finyear", "EQ", oContext.FinYear)
                var oFilter3 = new sap.ui.model.Filter("Companycode", "EQ", oContext.CompanyCode)

                oModel.read("/ZFIPAYMENT_PROGRAM", {
                    filters: [oFilter, oFilter1, oFilter3],
                    success: function (oresponse) {
                        oBusyDialog.close();
                        if (oresponse.results.length === 0) {
                            oModel.create("/ZFIPAYMENT_PROGRAM", obj, {
                                ssuccess: function (oresponse) {
                                    // MessageToast.show("Requested")
                                    MessageBox.success("Requested", {
                                        onClose: function (oAction) {
                                            if (oAction === MessageBox.Action.OK) {
                                                oComanModel.getProperty(sPath).Requested = "Requested";
                                                oComanModel.setProperty(sPath, oComanModel.getProperty(sPath))
                                            }
                                        }.bind(this)
                                    });
                                }
                            })
                        } else {
                            oModel.update("/ZFIPAYMENT_PROGRAM(Accountingdocument='" + oContext.AccountingDocument + "',Companycode='" + oContext.CompanyCode + "',Finyear='" + oContext.FinYear + "')", obj, {
                                success: function (oresponse) {
                                    oBusyDialog.close();
                                    // MessageToast.show("Requested")
                                    MessageBox.success("Requested", {
                                        onClose: function (oAction) {
                                            if (oAction === MessageBox.Action.OK) {
                                                oComanModel.getProperty(sPath).Requested = "Requested";
                                                oComanModel.setProperty(sPath, oComanModel.getProperty(sPath))
                                            }
                                        }.bind(this)
                                    });
                                }
                            })
                        }
                    }
                })

            },
            onReject: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIPAYMENT_PROGRAM")
                var oContext = oEvent.getSource().getBindingContext("oSecondScreenModel").getObject();
                
                var TableModel = this.getView().getModel("oSecondScreenModel");
                var aTableArr = TableModel.getProperty("/aSecondScreenData")
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
                            var oFilter1 = new sap.ui.model.Filter("Finyear", "EQ", oContext.FinYear)
                            var oFilter3 = new sap.ui.model.Filter("Companycode", "EQ", oContext.CompanyCode)
                            var obj = {
                                "Companycode": oContext.CompanyCode,
                                "Accountingdocument": oContext.AccountingDocument,
                                "Finyear": oContext.FinYear,
                                "Supplier": oContext.Supplier,
                                "Suppliername": oContext.SupplierName,
                                "glbalance": oContext.GLBalance,
                                "Partialpayment": oContext.Partialpayment === "" ? "0.00" : parseFloat(oContext.Partialpayment).toFixed(2),
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
                                                    if (D != RejectedRow_Index) {
                                                        newArray.push(aTableArr[D])
                                                    }
                                                }
                                                TableModel.setProperty("/aSecondScreenData", newArray)
                                            }, error: function () {
                                                oBusyDialog.close();
                                                MessageBox.error("Data wasn't saved.")
                                            }
                                        })
                                    } else {
                                        oModel.update("/ZFIPAYMENT_PROGRAM(Accountingdocument='" + oContext.AccountingDocument + "',Companycode='" + oContext.CompanyCode + "',Finyear='" + oContext.FinYear + "')", obj, {
                                            success: function (oresponse) {
                                                oBusyDialog.close();
                                                MessageToast.show("Rejected")
                                                var newArray = [];
                                                for (var D = 0; D < aTableArr.length; D++) {
                                                    if (D != RejectedRow_Index) {
                                                        newArray.push(aTableArr[D])
                                                    }
                                                }
                                                TableModel.setProperty("/aSecondScreenData", newArray)
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

        });
    });
