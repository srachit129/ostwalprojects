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
        return Controller.extend("zpaymentprogram.controller.ThirdScrenData", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oThirdScreenModel")
                UIComponent.getRouterFor(this).getRoute('ThirdScrenData').attachPatternMatched(this.ThirdScrenDataCall, this);
            },

            ThirdScrenDataCall: function () {
                oBusy.open();
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
                                "RefText": items.InvoiceReference,
                                "FinYear": items.fiscalyear,
                                "AccountingDocument": items.accountingdocument,
                                "TDS": items.TDS,
                                "profitcenter": items.profitcenter,
                                "MSME": items.MinorityGroup,
                                "HBANK": "",
                                "BusinessPlace": items.BUSINESSPLACE,
                                "IFSCCode": items.BankNumber,
                                "BANKAccount": items.BankAccount,
                                "Priroty": "",
                                "PartialPayment": "",
                            }
                            if (items.request === "X") {
                                obj["Requested"] = "Requested";
                                obj["Request_Button"] = false;
                            } else if (items.rejected === "X" && (items.amountinbalancetransaccrcy).indexOf('-') != -1) {
                                oTableData["Requested"] = "Rejected";
                                obj["Request_Button"] = true;
                            } else if ((items.amountinbalancetransaccrcy).indexOf('-') != -1) {
                                obj["Request_Button"] = true;
                            } else {
                                obj["Request_Button"] = false;
                            }
                            if (items.paymentblockingreason == "X") {
                                obj["paymentblockingreason"] = false;
                            } else {
                                ooj["paymentblockingreason"] = true;
                            }
                            aTableArr.push(obj)
                            oTableModel.setProperty("/aThirdScreenData", aTableArr)
                            oBusy.close();
                            // this.getView().getModel("oThirdScreenModel").setProperty("/aThirdScreenData", aTableArr);

                        })

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
                var CompanyCode = this.getOwnerComponent().getModel("oSecondScreenDataModel").getProperty("/CompanyCode")
                var SupplierNumber = this.getOwnerComponent().getModel("oSupplierNumberModel").getProperty("/SupplierNumber");
                var FiscalYear = this.getOwnerComponent().getModel("oSecondScreenDataModel").getProperty("/FiscalYear")
                var obj = {
                    "Companycode": CompanyCode,
                    "Accountingdocument": oContext.JournalEntryNumber,
                    "Finyear": FiscalYear,
                    // "": oContext.JournalEntryDate,
                    // "": oContext.JournalEntryType,
                    "Partialpayment": oContext.PartialPayment,
                    "Netduedate": netDueDate2,
                    // "": oContext.SpecialJournalIndicator,
                    // "": oContext.Amount,
                    // "": oContext.RefText,
                    "Supplier": SupplierNumber,
                    "Msme": oContext.MSME,
                    "Housebank": oContext.HBANK,
                    "Businessplace": oContext.BusinessPlace,
                    "Ifsccode": oContext.IFSCCode,
                    "Bankaccount": oContext.BANKAccount,
                    "Request": "X",
                    "Request2": "X",
                    // "":oContext.Priroty,
                }

                var oFilter = new sap.ui.model.Filter("Accountingdocument", "EQ", oContext.AccountingDocument)
                var oFilter1 = new sap.ui.model.Filter("Finyear", "EQ", FiscalYear)
                var oFilter2 = new sap.ui.model.Filter("Companycode", "EQ", oContext.CompanyCode)

                oModel.read("/ZFIPAYMENT_PROGRAM", {
                    filters: [oFilter, oFilter1, oFilter2],
                    success: function (oresponse) {
                        if (oresponse.results.length === 0) {
                            oModel.create("/ZFIPAYMENT_PROGRAM", obj, {
                                success: function (oresponse) {
                                    // MessageToast.show("Requested")
                                    oBusyDialog.close();
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
                            oModel.update("/ZFIPAYMENT_PROGRAM(Accountingdocument='" + oContext.AccountingDocument + "',Finyear='" + FiscalYear + "',Companycode='" + CompanyCode + "')", obj, {
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
                var oContext = oEvent.getSource().getBindingContext("oThirdScreenModel").getObject();
                var TableModel = this.getView().getModel("oThirdScreenModel");
                var aTableArr = TableModel.getProperty("/aThirdScreenData")
                var RejectedRow_Index = aTableArr.indexOf(oContext);
                MessageBox.warning("Are you Sure You Went to Reject", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (sAction) {
                        var oBusyDialog = new sap.m.BusyDialog({
                            text: "Rejecting..."
                        });
                        oBusyDialog.open();
                        if (sAction === "YES") {
                            var oFilter = new sap.ui.model.Filter("Accountingdocument", "EQ", oContext.AccountingDocument)
                            var oFilter1 = new sap.ui.model.Filter("Finyear", "EQ", oContext.FinYear)
                            var oFilter3 = new sap.ui.model.Filter("Companycode", "EQ", oContext.CompanyCode)
                            var obj = {
                                "Companycode": oContext.CompanyCode,
                                "Accountingdocument": oContext.JournalEntryNumber,
                                "Finyear": oContext.FinYear,
                                // "Netduedate": netDueDate2,
                                "Supplier": SupplierNumber,
                                "Msme": oContext.MSME,
                                "Housebank": oContext.HBANK,
                                "Businessplace": oContext.BusinessPlace,
                                "Ifsccode": oContext.IFSCCode,
                                "Bankaccount": oContext.BANKAccount,
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
                                                TableModel.setProperty("/aThirdScreenData", newArray)
                                            }, error: function () {
                                                oBusyDialog.close();
                                                MessageBox.error("Data wasn't saved.")
                                            }
                                        })
                                    } else {
                                        oModel.update("/ZFIPAYMENT_PROGRAM(Accountingdocument='" + oContext.AccountingDocument + "',Finyear='" + FiscalYear + "',Companycode='" + CompanyCode + "')", obj, {
                                            success: function (oresponse) {
                                                oBusyDialog.close();
                                                MessageToast.show("Rejected")
                                                var newArray = [];
                                                for (var D = 0; D < aTableArr.length; D++) {
                                                    if (D != RejectedRow_Index) {
                                                        newArray.push(aTableArr[D])
                                                    }
                                                }
                                                TableModel.setProperty("/aThirdScreenData", newArray)
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
