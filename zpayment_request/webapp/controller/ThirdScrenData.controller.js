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
        return Controller.extend("zpaymentrequest.controller.ThirdScrenData", {
            onInit: function () {
                UIComponent.getRouterFor(this).getRoute('ThirdScrenData').attachPatternMatched(this.ThirdScrenDataCall, this);
            },

            ThirdScrenDataCall: function () {
                oBusy.open();
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oThirdScreenModel")
                this.getView().getModel("oThirdScreenModel").setProperty("/aThirdScreenData", [])
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPAYMENT_WORKFLOW_BIN")
                var SupplierNumber = this.getOwnerComponent().getModel("oSupplierNumberModel").getProperty("/SupplierNumber");
                var CompanyCode = this.getOwnerComponent().getModel("oSecondScreenDataModel").getProperty("/CompanyCode")
                var FiscalYear = this.getOwnerComponent().getModel("oSecondScreenDataModel").getProperty("/FiscalYear")
                var oFilter1 = new sap.ui.model.Filter("companycode", "EQ", CompanyCode)
                var oFilter2 = new sap.ui.model.Filter("fiscalyear", "EQ", FiscalYear)
                var oTableModel = this.getView().getModel("oThirdScreenModel");
                var oFilter = new sap.ui.model.Filter("supplier", "EQ", SupplierNumber)
                var oFilter4 = new sap.ui.model.Filter("FLAG", "EQ", "Details")
                var aTableArr = [];
                oModel.read("/pay_res", {
                    filters: [oFilter, oFilter1, oFilter2, oFilter4],
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            var DocumentDate = new Date(items.documentdate)
                            var dt1 = Number(DocumentDate.getDate());
                            var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                            var mm1 = Number(DocumentDate.getMonth() + 1);
                            var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                            var DocumentDate1 = DocumentDate.getFullYear() + '-' + MM1 + '-' + DT1;
                            var obj = {
                                "CompanyCode": items.companycode,
                                "JournalEntryNumber": items.accountingdocument,
                                "JournalEntryDate": DocumentDate1,
                                "JournalEntryType": items.accountingdocumenttype,
                                "Over_Due_Days": items.overdue_by_days,
                                "SpecialJournalIndicator": items.SpecialGLCode,
                                "Amount": items.amountinbalancetransaccrcy,
                                "RefText": items.documentreferenceid,
                                "FinYear": items.fiscalyear,
                                "TDS": items.TDS,
                                "profitcenter": items.profitcenter,
                                "PartialPayment": "",
                                "AccountingDocument": items.accountingdocument,
                                "MSME": items.MinorityGroup,
                                "HBANK": "",
                                "BusinessPlace": items.BUSINESSPLACE,
                                "IFSCCode": items.BankNumber,
                                "BANKAccount": items.BankAccount,
                                "Priroty": "",
                            }
                            if (items.request === "X") {
                                obj["Requested"] = "Requested";
                                obj["Request_Button"] = false;
                            } else if (items.rejected === "X" && (items.amountinbalancetransaccrcy).indexOf('-') != -1) {
                                obj["Requested"] = "Rejected";
                                obj["Request_Button"] = true;
                            } else if (((items.amountinbalancetransaccrcy).indexOf('-') != -1) || (items.paymentblockingreason == "A")) {
                                obj["Request_Button"] = true;
                            } else {
                                obj["Request_Button"] = false;
                            }
                            if (items.paymentblockingreason == "A") {
                                obj["paymentblockingreason"] = false;
                            } else {
                                obj["paymentblockingreason"] = true;
                            }
                            aTableArr.push(obj)
                        })
                        oTableModel.setProperty("/aThirdScreenData", aTableArr)
                        oBusy.close();
                    }.bind(this)
                })
            },
            onRequest: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Requested"
                });
                oBusyDialog.open();
                var oComanModel = this.getView().getModel('oThirdScreenModel')
                var sPath = oEvent.getSource().getBindingContext('oThirdScreenModel').getPath();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIPAYMENT_PROGRAM")
                var oContext = oEvent.getSource().getBindingContext("oThirdScreenModel").getObject();
                var netDueDate = new Date(oContext.Over_Due_Days);
                var netDueDate1 = new Date(netDueDate.getTime() - netDueDate.getTimezoneOffset() * 60000);
                var netDueDate2 = netDueDate1.toISOString().slice(0, 16);
                var SupplierNumber = this.getOwnerComponent().getModel("oSupplierNumberModel").getProperty("/SupplierNumber");
                var obj = {
                    "Companycode": encodeURIComponent(oContext.CompanyCode),
                    "Accountingdocument": encodeURIComponent(oContext.JournalEntryNumber),
                    "Finyear": oContext.FinYear,
                    // "": oContext.JournalEntryDate,
                    // "": oContext.JournalEntryType,
                    "Netduedate": netDueDate2,
                    "Supplier": SupplierNumber,
                    // "": oContext.SpecialJournalIndicator,
                    // "": oContext.Amount,
                    // "": oContext.RefText,
                    "Partialpayment": oContext.PartialPayment,
                    "Request": "X",
                    "rejected": "",
                    "Msme": oContext.MSME,
                    "Housebank": oContext.HBANK,
                    "Businessplace": oContext.BusinessPlace,
                    "Ifsccode": oContext.IFSCCode,
                    "Bankaccount": oContext.BANKAccount,
                    // "":oContext.Priroty,
                }

                var oFilter = new sap.ui.model.Filter("Accountingdocument", "EQ", oContext.AccountingDocument)
                var oFilter1 = new sap.ui.model.Filter("Finyear", "EQ", oContext.FinYear)
                var oFilter2 = new sap.ui.model.Filter("Companycode", "EQ", oContext.CompanyCode)

                oModel.read("/ZFIPAYMENT_PROGRAM", {
                    filters: [oFilter, oFilter1, oFilter2],
                    success: function (oresponse) {
                        oBusyDialog.close();
                        if (oresponse.results.length === 0) {
                            oModel.create("/ZFIPAYMENT_PROGRAM", obj, {
                                success: function (oresponse) {
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
                            oModel.update("/ZFIPAYMENT_PROGRAM(Accountingdocument='" + encodeURIComponent(oContext.AccountingDocument) + "',Finyear='" + oContext.FinYear + "',Companycode='" + oContext.CompanyCode + "')", obj, {
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
        });
    });
