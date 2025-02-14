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

        return Controller.extend("zpaymentprogram.controller.SalectionScreen", {
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

                var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIPAYMENT_PROGRAM")
                oModel1.read("/ZFIPAYMENT_PROGRAM", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        oresponse.results.map(function (items) {
                            // if (items.Userid === id) {
                            //     this.getView().getModel("AuthorizationModel").setProperty("/authorized", true)
                            // } else {
                            //     this.getView().getModel("AuthorizationModel").setProperty("/authorized", false)
                            // }
                        }.bind(this))
                        this.getView().setModel(new sap.ui.model.json.JSONModel(), "oPartialPayment")
                        this.getView().getModel("oPartialPayment").setProperty("/Partial", oresponse.results)
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
                var PartialPayment = this.getView().getModel("oPartialPayment").getProperty("/Partial")
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
                                    if (items.request === "X") {
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
                                            if (items.request === "X") {
                                                oTableData["Requested"] = "Requested";
                                                oTableData["Request_Button"] = false;
                                            } else if (items.rejected === "X" && (items.amountinbalancetransaccrcy).indexOf('-') != -1) {
                                                oTableData["Requested"] = "Rejected";
                                                oTableData["Request_Button"] = true;
                                            } else if ((items.amountinbalancetransaccrcy).indexOf('-') != -1) {
                                                oTableData["Request_Button"] = true;
                                            } else {
                                                oTableData["Request_Button"] = false;
                                            }
                                            if (items.paymentblockingreason == "X") {
                                                oTableData["paymentblockingreason"] = false;
                                            } else {
                                                oTableData["paymentblockingreason"] = true;
                                            }
                                            aTableArr.push(oTableData);
                                        }
                                    }
                                }.bind(this))

                            }.bind(this))

                            aTableArr.map(function (items) {
                                PartialPayment.map(function (item) {
                                    if (items.AccountingDocument === item.Accountingdocument) {
                                        items.PartialPayment === item.Partialpayment
                                    }
                                })
                            })

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
                                    if (items.request === "X") {
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
                                            if (items.Request2 === "X") {
                                                oTableData["Requested"] = "Requested";
                                                oTableData["Request_Button"] = false;
                                            } else {
                                                oTableData["Requested"] = "";
                                                oTableData["Request_Button"] = true;
                                            }

                                            aTableArr.map(function (items) {
                                                PartialPayment.map(function (item) {
                                                    if (items.AccountingDocument === item.Accountingdocument) {
                                                        items.PartialPayment === item.Partialpayment
                                                    }
                                                })
                                            })

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
            onRequest: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIPAYMENT_PROGRAM")
                var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Requesting"
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
                }

                oModel.read("/ZFIPAYMENT_PROGRAM", {
                    filters: [oFilter, oFilter1, oFilter3],
                    success: function (oresponse) {
                        if (oresponse.results.length === 0) {
                            oModel.create("/ZFIPAYMENT_PROGRAM", obj, {
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
                                }, error: function () {
                                    oBusyDialog.close();
                                    MessageBox.error("Data wasn't saved.")
                                }
                            })
                        } else {
                            oModel.update("/ZFIPAYMENT_PROGRAM(Accountingdocument='" + oContext.AccountingDocument + "',Finyear='" + oContext.FiscalYear + "',Companycode='" + oContext.CompanyCode + "')", obj, {
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
                                                    if (D != RejectedRow_Index) {
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
                                                    if (D != RejectedRow_Index) {
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















            NextView: function () {
                UIComponent.getRouterFor(this).navTo("LineItemData");
            },

            changeColumnName: function () {
                var grid1 = this.getView().byId("grid1").getValue();
                var grid2 = this.getView().byId("grid2").getValue();
                var grid3 = this.getView().byId("grid3").getValue();
                var grid4 = this.getView().byId("grid4").getValue();

                if (grid1 != "") {
                    this.getView().getModel("oGenericModel").setProperty("/labeltype", "0-" + grid1)
                } else {
                    this.getView().getModel("oGenericModel").setProperty("/labeltype", "0-30")
                }

                if (grid2 != "") {
                    if (grid1 === "") {
                        MessageBox.error("Grid1 can't be left empty")
                    } else {
                        this.getView().getModel("oGenericModel").setProperty("/labeltype1", grid1 + "-" + grid2)
                    }
                } else {
                    this.getView().getModel("oGenericModel").setProperty("/labeltype1", "30-60")
                }

                if (grid3 != "") {
                    if (grid1 === "") {
                        MessageBox.error("Grid1 can't be left empty")
                    } else if (grid2 === "") {
                        MessageBox.error("Grid2 can't be left empty")
                    } else {
                        this.getView().getModel("oGenericModel").setProperty("/labeltype2", grid2 + "-" + grid3)
                        this.getView().getModel("oGenericModel").setProperty("/labeltype3", "Above " + grid3)
                    }
                } else {
                    this.getView().getModel("oGenericModel").setProperty("/labeltype2", "60-90")
                    this.getView().getModel("oGenericModel").setProperty("/labeltype3", "Above 90")
                }

            },

            onSelect: function (oEvent) {
                var oContext = oEvent.getParameter("rowContext").getObject();

                var oTableModel = this.getView().getModel("oTableDataModel")
                var aTableArr = oTableModel.getProperty("/aTableData")

                aTableArr.map(function (items) {
                    if (items.AccountingDocument === oContext.AccountingDocument) {
                        items.AdviceAmount = oContext.PendingAmount
                    }
                })
                oTableModel.setProperty("/aTableItem", aTableArr)
            },

            saveTableData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving data"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIPAYMENT_PROGRAM")
                var oTableModel = this.getView().getModel("oTableDataModel")
                var aTableArr = oTableModel.getProperty("/aTableData")

                aTableArr.map(function (items) {
                    var postingdate = new Date(items.PostingDate);
                    var postingdate1 = new Date(postingdate.getTime() - postingdate.getTimezoneOffset() * 60000);
                    var postingdate2 = postingdate1.toISOString().slice(0, 16);

                    var netDueDate = new Date(items.NetDueDate);
                    var netDueDate1 = new Date(netDueDate.getTime() - netDueDate.getTimezoneOffset() * 60000);
                    var netDueDate2 = netDueDate1.toISOString().slice(0, 16);

                    var oFilter = new sap.ui.model.Filter("Accountingdocument", "EQ", items.AccountingDocument)
                    var oFilter1 = new sap.ui.model.Filter("Finyear", "EQ", items.FiscalYear)

                    var obj = {
                        "Accountingdocument": items.AccountingDocument,
                        "Companycode": items.CompanyCode,
                        "Finyear": items.FiscalYear,
                        "Transactioncurrency": items.AmountInTransactionCurrency,
                        "Postingdate": postingdate2,
                        "Supplier": items.Supplier,
                        "Suppliername": items.SupplierName,
                        "Paymentterms": items.PaymentTerms,
                        "Netduedate": netDueDate2,
                        "Additionalcurrency1": items.AdditionalCurrency1,
                        "Assignmentreference": items.Assignmentreference,
                        "Remark": items.Remark
                    }

                    oModel.read("/ZFIPAYMENT_PROGRAM", {
                        filters: [oFilter, oFilter1],
                        success: function (oresponse) {
                            oBusyDialog.close();
                            if (oresponse.results.length === 0) {
                                oModel.create("/ZFIPAYMENT_PROGRAM", obj, {
                                    success: function (oresponse) {
                                        MessageToast.show("Data saved")
                                    }
                                })
                            } else {
                                oModel.update("/ZFIPAYMENT_PROGRAM(Accountingdocument='" + items.AccountingDocument + "',Finyear='" + items.FiscalYear + "')", obj, {
                                    success: function (oresponse) {
                                        oBusyDialog.close();
                                        MessageToast.show("Data updated")
                                    }
                                })
                            }
                        }, error: function () {
                            oBusyDialog.close();
                        }
                    })
                })
            },

            getToken: function (oEvent) {
                var userid = this.getView().getModel("oUserIdModel").getProperty("/UserId")
                var id = sap.ushell.Container.getService("UserInfo").getId();
                var authorizationModel = this.getView().getModel("AuthorizationModel")

                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oTableDataModel")
                var aTableArr = oTableModel.getProperty("/aTableData")
                var aNewArr = []

                var url = "/sap/bc/http/sap/zpayment_work_flow"

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    aNewArr.push(aTableArr[aSelectedIndex[i]])
                }

                if (aSelectedIndex.length === 0) {
                    MessageBox.error("Please select atleast one row item.")
                } else {

                    $.ajax({
                        url: url,
                        type: "GET",
                        success: function (oresponse) {
                            aNewArr.map(function (items) {
                                var accountingDoc = items.AccountingDocument;
                                aTableArr.map(function (item) {
                                    if (accountingDoc === item.AccountingDocument && items.Tokennum === "") {
                                        item.Tokennum = oresponse
                                    }
                                })
                            })
                            oTableModel.setProperty("/aTableData", aTableArr)
                        }.bind(this)
                    })

                    // for (var i = 0; i < aSelectedIndex.length; i++) {
                    //     aNewArr.push(aTableArr[aSelectedIndex[i]])
                    // }

                    // aNewArr.map(function (items) {
                    //     var accountGroup = items.SupplierAccountGroup
                    //     userid.map(function (item) {
                    //         if (accountGroup === item.Accountinggrp && id === item.Userid) {
                    //             authorizationModel.setProperty("/authorized", true)
                    //         } else {
                    //             authorizationModel.setProperty("/authorized", false)
                    //         }
                    //     })
                    // })

                    // if (authorizationModel.getProperty("/authorized") === true) {
                    //     $.ajax({
                    //         url: url,
                    //         type: "GET",
                    //         success: function (oresponse) {
                    //             aNewArr.map(function (items) {
                    //                 var accountingDoc = items.AccountingDocument;
                    //                 aTableArr.map(function (item) {
                    //                     if (accountingDoc === item.AccountingDocument && items.Tokennum === "") {
                    //                         item.Tokennum = oresponse
                    //                     }
                    //                 })
                    //             })
                    //             oTableModel.setProperty("/aTableData", aTableArr)
                    //         }.bind(this)
                    //     })
                    // } else {
                    //     MessageToast.show("No authorization")
                    // }


                }

            },
            //Old Function Created
            onRequest_OLD: function (oEvent) {
                var userid = this.getView().getModel("oUserIdModel").getProperty("/UserId")
                var useridmodel = this.getView().getModel("AuthorizationModel").getProperty("/authorized")
                var id = sap.ushell.Container.getService("UserInfo").getId();


                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIPAYMENT_PROGRAM")
                var oTableModel = this.getView().getModel("oTableDataModel")
                var aTableArr = oTableModel.getProperty("/aTableData")

                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var aNewArr = []
                var id = "";
                var path = ""
                var idx = ""

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    aNewArr.push(aTableArr[aSelectedIndex[i]])
                }

                if (aSelectedIndex.length === 0) {
                    MessageBox.error("Please select atleast one row item.")
                } else {
                    if (aNewArr[0].Tokennum === "") {
                        MessageBox.error("Please generate token first")
                    } else {
                        var oBusyDialog = new sap.m.BusyDialog({
                            text: "Requesting"
                        });
                        oBusyDialog.open();
                        aNewArr.map(function (items) {

                            var oFilter = new sap.ui.model.Filter("Accountingdocument", "EQ", items.AccountingDocument)
                            var oFilter1 = new sap.ui.model.Filter("Finyear", "EQ", items.FiscalYear)
                            var oFilter2 = new sap.ui.model.Filter("Tokennum", "EQ", items.Tokennum)

                            var refDate = new Date(items.RefDate);
                            var refDate1 = new Date(refDate.getTime() - refDate.getTimezoneOffset() * 60000);
                            var refDate2 = refDate1.toISOString().slice(0, 16);

                            var netDueDate = new Date(items.NetDueDate);
                            var netDueDate1 = new Date(netDueDate.getTime() - netDueDate.getTimezoneOffset() * 60000);
                            var netDueDate2 = netDueDate1.toISOString().slice(0, 16);

                            var obj = {
                                "Tokennum": items.Tokennum,
                                "Companycode": items.CompanyCode,
                                "Accountingdocument": items.AccountingDocument,
                                "Finyear": items.FiscalYear,
                                "Accgroup": items.SupplierAccountGroup,
                                // "AccountGroupText": items.AccountGroupText,
                                "Supplier": items.Supplier,
                                "Reffdate": refDate2,
                                "Reffdoc": items.DocumentReferences,
                                "glbalance": items.GLBalance,
                                "Notdueamonnt": items.NotDueAmt === "" ? "0.00" : parseFloat(items.NotDueAmt).toFixed(2),
                                "Pandingamount": items.PendingAmount === "" ? "0.00" : parseFloat(items.PendingAmount).toFixed(2),
                                "Netduedate": netDueDate2,
                                // "OverDueDays": items.OverDueDays,
                                // "AdviceAmount": items.AdviceAmount,
                                // "AdvanceAdvice": items.AdvanceAdvice,
                                "Glbalanceafteradv": items.GLBalanceAfterAdvice === "" ? "0.00" : parseFloat(items.GLBalanceAfterAdvice).toFixed(2),
                                "Remark": items.Remark,
                                "Request": "X"
                            }

                            oModel.read("/ZFIPAYMENT_PROGRAM", {
                                filters: [oFilter, oFilter1],
                                success: function (oresponse) {
                                    if (oresponse.results.length === 0) {
                                        oModel.create("/ZFIPAYMENT_PROGRAM", obj, {
                                            success: function (oresponse) {
                                                oBusyDialog.close();
                                                MessageToast.show("Requested")
                                                // for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                                                //     id = aSelectedIndex[i]
                                                //     path = oTable.getContextByIndex(id).sPath;
                                                //     idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                                                //     aTableArr.splice(idx, 1)
                                                // }
                                                // oTableModel.setProperty("/aTableItem", aTableArr)
                                            }, error: function () {
                                                MessageBox.error("Data wasn't saved.")
                                            }
                                        })
                                    } else {
                                        oModel.update("/ZFIPAYMENT_PROGRAM(Accountingdocument='" + items.AccountingDocument + "',Finyear='" + items.FiscalYear + "')", obj, {
                                            success: function (oresponse) {
                                                oBusyDialog.close();
                                                MessageToast.show("Requested")
                                                // for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                                                //     id = aSelectedIndex[i]
                                                //     path = oTable.getContextByIndex(id).sPath;
                                                //     idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                                                //     aTableArr.splice(idx, 1)
                                                // }
                                                // oTableModel.setProperty("/aTableItem", aTableArr)
                                            }, error: function () {
                                                MessageBox.error("Data wasn't saved")
                                            }
                                        })
                                    }
                                }
                            })

                        })
                    }

                    // aNewArr.map(function (items) {
                    //     var oFilter = new sap.ui.model.Filter("Accountingdocument", "EQ", items.AccountingDocument)
                    //     var oFilter1 = new sap.ui.model.Filter("Finyear", "EQ", items.FiscalYear)
                    //     var oFilter2 = new sap.ui.model.Filter("Tokennum", "EQ", items.Tokennum)

                    //     var refDate = new Date(items.RefDate);
                    //     var refDate1 = new Date(refDate.getTime() - refDate.getTimezoneOffset() * 60000);
                    //     var refDate2 = refDate1.toISOString().slice(0, 16);

                    //     var netDueDate = new Date(items.NetDueDate);
                    //     var netDueDate1 = new Date(netDueDate.getTime() - netDueDate.getTimezoneOffset() * 60000);
                    //     var netDueDate2 = netDueDate1.toISOString().slice(0, 16);

                    //     var obj = {
                    //         "Tokennum": items.Tokennum,
                    //         "Companycode": items.CompanyCode,
                    //         "Accountingdocument": items.AccountingDocument,
                    //         "Finyear": items.FiscalYear,
                    //         "Accgroup": items.SupplierAccountGroup,
                    //         // "AccountGroupText": items.AccountGroupText,
                    //         "Supplier": items.Supplier,
                    //         "Reffdate": refDate2,
                    //         "Reffdoc": items.DocumentReferences,
                    //         "glbalance": items.GLBalance,
                    //         "Notdueamonnt": items.NotDueAmt === "" ? "0.00" : parseFloat(items.NotDueAmt).toFixed(2),
                    //         "Pandingamount": items.PendingAmount === "" ? "0.00" : parseFloat(items.PendingAmount).toFixed(2),
                    //         "Netduedate": netDueDate2,
                    //         // "OverDueDays": items.OverDueDays,
                    //         // "AdviceAmount": items.AdviceAmount,
                    //         // "AdvanceAdvice": items.AdvanceAdvice,
                    //         "Glbalanceafteradv": items.GLBalanceAfterAdvice === "" ? "0.00" : parseFloat(items.GLBalanceAfterAdvice).toFixed(2),
                    //         "Remark": items.Remark,
                    //         "Request": "X"
                    //     }

                    //     oModel.read("/ZFIPAYMENT_PROGRAM", {
                    //         filters: [oFilter, oFilter1, oFilter2],
                    //         success: function (oresponse) {
                    //             if (oresponse.results.length === 0) {
                    //                 oModel.create("/ZFIPAYMENT_PROGRAM", obj, {
                    //                     success: function (oresponse) {
                    //                         oBusyDialog.close();
                    //                         MessageToast.show("Requested")
                    //                     }, error: function () {
                    //                         MessageBox.error("Data wasn't saved.")
                    //                     }
                    //                 })
                    //             } else {
                    //                 oModel.update("/ZFIPAYMENT_PROGRAM(Accountingdocument='" + items.AccountingDocument + "',Finyear='" + items.FiscalYear + "',Tokennum='" + items.Tokennum + "')", obj, {
                    //                     success: function (oresponse) {
                    //                         oBusyDialog.close();
                    //                         MessageToast.show("Requested")
                    //                     }, error: function () {
                    //                         MessageBox.error("Data wasn't saved")
                    //                     }
                    //                 })
                    //             }
                    //         }
                    //     })
                    // })
                }



            },
            AddTableData: function () {
                var TableModel = this.getView().getModel("oTableDataModel");
                var aTableArr = TableModel.getProperty("/aTableData")

                var obj = {
                    CompanyCode: "",
                    AccountingDocument: "",
                    ClearingJournalEntry: "",
                    AmountInTransactionCurrency: "",
                    PostingDate: "",
                    Supplier: "",
                    SupplierName: "",
                    PaymentTerms: "",
                    NetDueDate: "",
                    AdditionalCurrency1: "",
                    AssignmentReference: "",
                }
                aTableArr.push(obj);
                TableModel.setProperty("/aTableData", aTableArr);
            },

        });
    });
