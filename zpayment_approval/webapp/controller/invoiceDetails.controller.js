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
            text: "Approving"
        });
        return Controller.extend("zpaymentapproval.controller.invoiceDetails", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oThirdScreenModel")
                UIComponent.getRouterFor(this).getRoute('invoiceDetails').attachPatternMatched(this.ThirdScrenDataCall, this);
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
                            if (items.Approve === "X") {
                                obj["Approved"] = "Approved";
                                obj["Approv_Button"] = false;
                            } else {
                                obj["Approved"] = "";
                                obj["Approv_Button"] = true;
                            }                              
                            if (items.paymentblockingreason == "X") {
                                obj["paymentblockingreason"] = false;
                            } else {
                                obj["paymentblockingreason"] = true;
                            }
                            aTableArr.push(obj)
                            oBusy.close();
                        })
                        oTableModel.setProperty("/aThirdScreenData", aTableArr)

                    }.bind(this)
                })
            },
            onApprove: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Approving"
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
                    "Approve": "X",
                    "Request2": "X",
                    // "":oContext.Priroty,
                }

                oModel.update("/ZFIPAYMENT_PROGRAM(Accountingdocument='" + oContext.AccountingDocument + "',Finyear='" + FiscalYear + "',Companycode='" + CompanyCode + "')", obj, {
                    success: function (oresponse) {
                        oBusyDialog.close();
                        // MessageToast.show("Requested")
                        MessageBox.success("Approved", {
                            onClose: function (oAction) {
                                if (oAction === MessageBox.Action.OK) {
                                    oComanModel.getProperty(sPath).Approved = "Approved";
                                    oComanModel.setProperty(sPath, oComanModel.getProperty(sPath))
                                }
                            }.bind(this)
                        });
                    }
                })

            },
            onReject: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIPAYMENT_PROGRAM")
                var oContext = oEvent.getSource().getBindingContext("oThirdScreenModel").getObject();

                var TableModel = this.getView().getModel("oThirdScreenModel");
                var aTableArr = TableModel.getProperty("/aThirdScreenData")
                var RejectedRow_Index = aTableArr.indexOf(oContext);
                var CompanyCode = this.getOwnerComponent().getModel("oSecondScreenDataModel").getProperty("/CompanyCode")
                var SupplierNumber = this.getOwnerComponent().getModel("oSupplierNumberModel").getProperty("/SupplierNumber");
                var FiscalYear = this.getOwnerComponent().getModel("oSecondScreenDataModel").getProperty("/FiscalYear")
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
                                "Companycode": CompanyCode,
                                "Accountingdocument": oContext.JournalEntryNumber,
                                "Finyear": FiscalYear,
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















            onInit11: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel");
                this.getView().getModel("oTableDataModel").setProperty("/aTableData", []);
                UIComponent.getRouterFor(this).getRoute('invoiceDetails').attachPatternMatched(this.ThirdScrenDataCall, this);
            },

            CallSecondScreenData11: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please Wait"
                });
                oBusyDialog.open();
                var CompanyCode = this.getOwnerComponent().getModel("oSecondScreenDataModel").getProperty("/CompanyCode");
                var FiscalYear = this.getOwnerComponent().getModel("oSecondScreenDataModel").getProperty("/FiscalYear");
                var Supplier = this.getOwnerComponent().getModel("oSecondScreenDataModel").getProperty("/Supplier");
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIPAYMENT_PROGRAM")
                var oFilter = new sap.ui.model.Filter("Companycode", "EQ", CompanyCode)
                var oFilter1 = new sap.ui.model.Filter("Finyear", "EQ", FiscalYear)
                var oFilter2 = new sap.ui.model.Filter("Supplier", "EQ", Supplier)
                var aTableArr = [];
                oModel.read("/ZFIPAYMENT_PROGRAM", {
                    filters: [oFilter, oFilter1, oFilter2],
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            if (items.Request === "X" && items.Approve === "") {
                                var obj = {
                                    "Supplier": items.Supplier,
                                    "SupplierName": items.Suppliername,
                                    "FiscalYear": items.Finyear,
                                    "CompanyCode": items.Companycode,
                                    "TotalPendingAmount": items.Pandingamount,
                                    "glbalance": items.glbalance,
                                    "Partialpayment": items.Partialpayment,
                                    "Remark": items.Remark,

                                    "AccountGroup": items.Accgroup,
                                    "Accountingdocument": items.Accountingdocument,
                                    "Tokennum": items.Tokennum,
                                    "Clearingjournalentry": items.Clearingjournalentry,
                                    "Transactioncurrency": items.Transactioncurrency,
                                    "Reffdate": items.Reffdate,
                                    "Reffdoc": items.Reffdoc,
                                    "Notdueamonnt": items.Notdueamonnt,
                                    "Pandingamount": items.Pandingamount,
                                    "Glbalanceafteradv": items.Glbalanceafteradv,
                                    "Gstinput": items.Gstinput,
                                    "Postingdate": items.Postingdate,
                                    "Paymentterms": items.Paymentterms,
                                    "Netduedate": items.Netduedate,
                                    "Additionalcurrency1": items.Additionalcurrency1,
                                    "Assignmentreference": items.Assignmentreference,
                                }
                                aTableArr.push(obj);
                            }
                        })
                        this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                        oBusyDialog.close();
                    }.bind(this)
                })
            },

            ThirdScrenDataCall11: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please Wait"
                });
                oBusyDialog.open();

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPAYMENT_WORKFLOW_BIN")
                var SupplierNumber = this.getOwnerComponent().getModel("oSecondScreenDataModel").getProperty("/Supplier");
                var CompanyCode = this.getOwnerComponent().getModel("oSecondScreenDataModel").getProperty("/CompanyCode")
                var FiscalYear = this.getOwnerComponent().getModel("oSecondScreenDataModel").getProperty("/FiscalYear")
                var oFilter1 = new sap.ui.model.Filter("companycode", "EQ", CompanyCode)
                var oFilter2 = new sap.ui.model.Filter("fiscalyear", "EQ", FiscalYear)
                var oTableModel = this.getView().getModel("oTableDataModel");
                var oFilter = new sap.ui.model.Filter("supplier", "EQ", SupplierNumber)
                var oFilter4 = new sap.ui.model.Filter("FLAG", "EQ", "Details")
                var aTableArr = [];
                oModel.read("/pay_res", {
                    filters: [oFilter, oFilter1, oFilter2, oFilter4],
                    success: function (oresponse) {
                        oBusyDialog.close();
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
                                "PartialPayment": "",
                                "MSME": "",
                                "HBANK": "",
                                "BusinessPlace": "",
                                "IFSCCode": "",
                                "BANKAccount": "",
                                "Priroty": "",
                            }
                            if (items.accountingdocumenttype == "RE" || items.accountingdocumenttype == "KR") {
                                obj["RequestButtonVisible"] = true;
                            }
                            else {
                                obj["RequestButtonVisible"] = false;
                            }
                            aTableArr.push(obj)

                            oBusyDialog.close();
                            // this.getView().getModel("oThirdScreenModel").setProperty("/aThirdScreenData", aTableArr);

                        })
                        oTableModel.setProperty("/aTableData", aTableArr)

                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }
                })
            },

            onApprove11: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Approving"
                });
                oBusyDialog.open();

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIPAYMENT_PROGRAM")
                var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();

                var oFilter = new sap.ui.model.Filter("Accountingdocument", "EQ", oContext.Accountingdocument)
                var oFilter1 = new sap.ui.model.Filter("Finyear", "EQ", oContext.Finyear)

                var obj = {
                    "Companycode": encodeURIComponent(oContext.CompanyCode),
                    "Accountingdocument": encodeURIComponent(oContext.JournalEntryNumber),
                    "Approve": "X"
                }

                oModel.update("/ZFIPAYMENT_PROGRAM(Accountingdocument='" + oContext.Accountingdocument + "',Finyear='" + oContext.FiscalYear + "',Companycode='" + oContext.CompanyCode + "')", obj, {
                    success: function (oresponse) {
                        oBusyDialog.close();
                        MessageToast.show("Approved")
                    }, error: function () {
                        oBusyDialog.close();
                        MessageBox.error("Data was not saved.")
                    }
                })
            },

        });
    });
