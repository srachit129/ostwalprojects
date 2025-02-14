sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, MessageToast, UIComponent) {
        "use strict";

        return Controller.extend("zpaymentrequest.controller.paymentrequest", {
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

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z_VENDOR_BI")
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oVendorDataModel")
                this.getView().getModel("oVendorDataModel").setProperty("/aVendorData", [])
                oModel.read("/pay_res", {
                    success: function (oresponse) {
                        this.getView().getModel("oVendorDataModel").setProperty("/aVendorData", oresponse.results)
                    }.bind(this)
                })

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z_VENDOR_BI")
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oAccountGroupModel")
                this.getView().getModel("oAccountGroupModel").setProperty("/aAccountGroupData", [])
                oModel.read("/Account_group_tot", {
                    success: function (oresponse) {
                        this.getView().getModel("oAccountGroupModel").setProperty("/aAccountGroupData", oresponse.results)
                    }.bind(this)
                })

                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(), "oSupplierModel")
                this.getOwnerComponent().getModel("oSupplierModel").setProperty("/aSupplierData", [])
            },

            GetTableData1: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPAYMENT_WORKFLOW_BIN");
                var TableModel = this.getView().getModel("oTableDataModel");
                var aTableArr = TableModel.getProperty("/aTableData")
                var companycode = this.getView().byId("idCompanyCode").getValue();
                var fiscalyear = this.getView().byId("idFiscalYear").getValue();
                var keyDate = this.getView().byId("idPostingDateTo").getValue();
                // var postingdatefrom = this.getView().byId("idPostingDateFrom").getValue();
                var postingdateto = this.getView().byId("idPostingDateTo").getValue();
                // var supplier = this.getView().byId("idSupplier").getValue();
                // var Account_Group = this.getView().byId("idAccntGrp").getValue();
                var oFilter = new sap.ui.model.Filter("companycode", "EQ", companycode)
                var oFilter1 = new sap.ui.model.Filter("fiscalyear", "EQ", fiscalyear)
                var oFilter2 = new sap.ui.model.Filter("postingdate", "LE", postingdateto)
                // var oFilter3 = new sap.ui.model.Filter("supplier", "EQ", supplier)
                var oFilter4 = new sap.ui.model.Filter("FLAG", "EQ", "Group")
                var aFilters = [];

                if (companycode != "") {
                    aFilters.push(oFilter)
                }
                if (fiscalyear != "") {
                    aFilters.push(oFilter1)
                }
                if (postingdateto != "") {
                    aFilters.push(oFilter2)
                }
                aFilters.push(oFilter4)
                // if (supplier != "") {
                //     aFilters.push(oFilter3)
                // }
                // if (Account_Group != "") {
                //     aFilters.push(oFilter4)
                // }

                if (aTableArr.length > 0) {
                    var aTableArr = [];
                    TableModel.setProperty("/aTableData", aTableArr)
                    oModel.read("/pay_res", {
                        filters: [aFilters],
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {

                                oresponse.results.map(function (items) {
                                    // if (items.request != "X") {
                                    var PostingDate = new Date(items.postingdate)
                                    var dt = Number(PostingDate.getDate());
                                    var DT = dt < 10 ? "0" + dt : dt;
                                    var mm = Number(PostingDate.getMonth() + 1);
                                    var MM = mm < 10 ? "0" + mm : mm;
                                    var PostingDate1 = PostingDate.getFullYear() + '-' + MM + '-' + DT;

                                    // var NetDueDate = new Date(items.netduedate)
                                    // var dt = Number(NetDueDate.getDate());
                                    // var DT = dt < 10 ? "0" + dt : dt;
                                    // var mm = Number(NetDueDate.getMonth() + 1);
                                    // var MM = mm < 10 ? "0" + mm : mm;
                                    // var NetDueDate1 = NetDueDate.getFullYear() + '-' + MM + '-' + DT;

                                    // var RefDate = new Date(items.documentdate)
                                    // var dt = Number(RefDate.getDate());
                                    // var DT = dt < 10 ? "0" + dt : dt;
                                    // var mm = Number(RefDate.getMonth() + 1);
                                    // var MM = mm < 10 ? "0" + mm : mm;
                                    // var RefDate1 = RefDate.getFullYear() + '-' + MM + '-' + DT;

                                    // var netDueDate = items.NetDueDate;

                                    // const date1 = new Date(keyDate);
                                    // const date2 = new Date(netDueDate);
                                    // const diffTime = Math.abs(date1 - date2);
                                    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                    // if (date1 < date2) {
                                    //     var days = "-" + diffDays
                                    // } else {
                                    //     days = diffDays
                                    // }

                                    // var grid1 = labeltype.split("-")
                                    // var grid2 = labeltype1.split("-")
                                    // var grid3 = labeltype2.split("-")
                                    // var grid4 = labeltype3.split(" ")

                                    var oTableData = {
                                        CompanyCode: items.companycode,
                                        AccountingDocument: items.accountingdocument,
                                        FinYear: items.fiscalyear,
                                        // ClearingJournalEntry: items.ClearingJournalEntry,
                                        // AmountInTransactionCurrency: parseFloat(items.amountinbalancetransaccrcy).toFixed(2),
                                        PostingDate: PostingDate1,
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
                                        "MSME": "",
                                        "HBANK": "",
                                        "BusinessPlace": "",
                                        "IFSCCode": "",
                                        "BANKAccount": "",
                                        "Priroty": "",
                                    }
                                    if (items.request === "X") {
                                        oTableData["Requested"] = "Requested";
                                        oTableData["Request_Button"] = false;
                                    } else if (items.rejected === "X" && (items.amountinbalancetransaccrcy).indexOf('-') != -1) {
                                        oTableData["Requested"] = "Rejected";
                                        oTableData["Request_Button"] = true;
                                    } else if (((items.amountinbalancetransaccrcy).indexOf('-') != -1) || (items.paymentblockingreason == "A")) {
                                        oTableData["Request_Button"] = true;
                                    } else {
                                        oTableData["Request_Button"] = false;
                                    }
                                    if (items.paymentblockingreason == "A") {
                                        oTableData["paymentblockingreason"] = false;
                                    } else {
                                        oTableData["paymentblockingreason"] = true;
                                    }
                                    aTableArr.push(oTableData);
                                    // }
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                            }
                            oBusyDialog.close();

                        }.bind(this)
                    })
                }
                else {
                    oModel.read("/pay_res", {
                        filters: [aFilters],
                        success: function (oresponse) {
                            if (oresponse.results.length > 0) {

                                oresponse.results.map(function (items) {
                                    // if (items.request != "X") {
                                    var PostingDate = new Date(items.postingdate)
                                    var dt = Number(PostingDate.getDate());
                                    var DT = dt < 10 ? "0" + dt : dt;
                                    var mm = Number(PostingDate.getMonth() + 1);
                                    var MM = mm < 10 ? "0" + mm : mm;
                                    var PostingDate1 = PostingDate.getFullYear() + '-' + MM + '-' + DT;

                                    // var NetDueDate = new Date(items.netduedate)
                                    // var dt = Number(NetDueDate.getDate());
                                    // var DT = dt < 10 ? "0" + dt : dt;
                                    // var mm = Number(NetDueDate.getMonth() + 1);
                                    // var MM = mm < 10 ? "0" + mm : mm;
                                    // var NetDueDate1 = NetDueDate.getFullYear() + '-' + MM + '-' + DT;

                                    // var RefDate = new Date(items.documentdate)
                                    // var dt = Number(RefDate.getDate());
                                    // var DT = dt < 10 ? "0" + dt : dt;
                                    // var mm = Number(RefDate.getMonth() + 1);
                                    // var MM = mm < 10 ? "0" + mm : mm;
                                    // var RefDate1 = RefDate.getFullYear() + '-' + MM + '-' + DT;

                                    // var netDueDate = items.NetDueDate;

                                    // const date1 = new Date(keyDate);
                                    // const date2 = new Date(netDueDate);
                                    // const diffTime = Math.abs(date1 - date2);
                                    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                    // if (date1 < date2) {
                                    //     var days = "-" + diffDays
                                    // } else {
                                    //     days = diffDays
                                    // }

                                    // var grid1 = labeltype.split("-")
                                    // var grid2 = labeltype1.split("-")
                                    // var grid3 = labeltype2.split("-")
                                    // var grid4 = labeltype3.split(" ")

                                    var oTableData = {
                                        CompanyCode: items.companycode,
                                        AccountingDocument: items.accountingdocument,
                                        FinYear: items.fiscalyear,
                                        // ClearingJournalEntry: items.ClearingJournalEntry,
                                        // AmountInTransactionCurrency: parseFloat(items.amountinbalancetransaccrcy).toFixed(2),
                                        PostingDate: PostingDate1,
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
                                        "MSME": "",
                                        "HBANK": "",
                                        "BusinessPlace": "",
                                        "IFSCCode": "",
                                        "BANKAccount": "",
                                        "Priroty": "",
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
                                    aTableArr.push(oTableData);
                                    // }
                                })
                                this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                            }
                            oBusyDialog.close();

                        }.bind(this)
                    })
                }


            },

            supplierDetails1: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPAYMENT_WORKFLOW_BIN/")
                var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
                var SupplierDataModel = this.getOwnerComponent().getModel("oSupplierModel")
                var SupplierData = SupplierDataModel.getProperty("/aSupplierData")
                var comcode = this.getView().byId("idCompanyCode").getValue();
                var fiscalyear = this.getView().byId("idFiscalYear").getValue();
                var oFilter = new sap.ui.model.Filter("supplieraccountgroup", "EQ", oContext.SupplierAccountGroup)
                var oFilter1 = new sap.ui.model.Filter("companycode", "EQ", comcode)
                var oFilter2 = new sap.ui.model.Filter("fiscalyear", "EQ", fiscalyear)

                if (SupplierData.length > 0) {
                    var SupplierData = [];
                    SupplierDataModel.setProperty("/aSupplierData", SupplierData)
                    oModel.read("/pay_res", {
                        filters: [oFilter, oFilter1, oFilter2],
                        success: function (oresponse) {
                            oresponse.results.map(function (items) {
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
                                    "MSME": "",
                                    "HBANK": "",
                                    "BusinessPlace": "",
                                    "IFSCCode": "",
                                    "BANKAccount": "",
                                    "Priroty": "",
                                }
                                SupplierData.push(obj)
                            })
                            SupplierDataModel.setProperty("/aSupplierData", SupplierData)
                            UIComponent.getRouterFor(this).navTo("supplierdetails");
                        }.bind(this)
                    })
                } else {
                    oModel.read("/pay_res", {
                        filters: [oFilter, oFilter1, oFilter2],
                        success: function (oresponse) {
                            oresponse.results.map(function (items) {
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
                                    "MSME": "",
                                    "HBANK": "",
                                    "BusinessPlace": "",
                                    "IFSCCode": "",
                                    "BANKAccount": "",
                                    "Priroty": "",
                                }
                                SupplierData.push(obj)
                            })
                            SupplierDataModel.setProperty("/aSupplierData", SupplierData)
                            UIComponent.getRouterFor(this).navTo("supplierdetails");
                        }.bind(this)
                    })
                }

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

            GetTableData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Loading"
                });
                // oBusyDialog.open();
                var labeltype = this.getView().getModel("oGenericModel").getProperty("/labeltype")
                var labeltype1 = this.getView().getModel("oGenericModel").getProperty("/labeltype1")
                var labeltype2 = this.getView().getModel("oGenericModel").getProperty("/labeltype2")
                var labeltype3 = this.getView().getModel("oGenericModel").getProperty("/labeltype3")

                var vendorDataModel = this.getView().getModel("oVendorDataModel").getProperty("/aVendorData")
                var accountDataModel = this.getView().getModel("oAccountGroupModel").getProperty("/aAccountGroupData")

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPAYMENT_WORKFLOW_BIN");
                var TableModel = this.getView().getModel("oTableDataModel");
                var aTableArr = TableModel.getProperty("/aTableData")
                var companycode = this.getView().byId("idCompanyCode").getValue();
                var fiscalyear = this.getView().byId("idFiscalYear").getValue();
                var keyDate = this.getView().byId("idPostingDateTo").getValue();
                // var postingdatefrom = this.getView().byId("idPostingDateFrom").getValue();
                var postingdateto = this.getView().byId("idPostingDateTo").getValue();
                // var supplier = this.getView().byId("idSupplier").getValue();
                // var Account_Group = this.getView().byId("idAccntGrp").getValue();
                var oFilter = new sap.ui.model.Filter("CompanyCode", "EQ", companycode)
                var oFilter1 = new sap.ui.model.Filter("FiscalYear", "EQ", fiscalyear)
                var arr = [];

                // var oFilter2 = new sap.ui.model.Filter({
                //     path: "PostingDate",
                //     operator: FilterOperator.BT,
                //     value1: postingdatefrom,
                //     value2: postingdateto
                // })
                var oFilter2 = new sap.ui.model.Filter("PostingDate", "LE", postingdateto)
                var oFilter3 = new sap.ui.model.Filter("Supplier", "EQ", supplier)
                var oFilter4 = new sap.ui.model.Filter("SupplierAccountGroup", "EQ", Account_Group)

                if (aTableArr.length > 0) {
                    var aTableArr = [];
                    TableModel.setProperty("/aTableData", aTableArr)
                    if (companycode === "" || fiscalyear === "" || postingdateto === "") {
                        MessageBox.error("Fields marked mandatory can't be left empty")
                    } else {
                        if (companycode != "" && fiscalyear != "" && postingdateto != "" && supplier === "" && Account_Group == "") {
                            oModel.read("/pay_res", {
                                filters: [oFilter, oFilter1, oFilter2],
                                success: function (oresponse) {
                                    if (oresponse.results.length > 0) {
                                        oresponse.results.map(function (items) {
                                            if (items.Request != "X") {
                                                var PostingDate = new Date(items.PostingDate)
                                                var dt = Number(PostingDate.getDate());
                                                var DT = dt < 10 ? "0" + dt : dt;
                                                var mm = Number(PostingDate.getMonth() + 1);
                                                var MM = mm < 10 ? "0" + mm : mm;
                                                var PostingDate1 = PostingDate.getFullYear() + '-' + MM + '-' + DT;

                                                var NetDueDate = new Date(items.NetDueDate)
                                                var dt = Number(NetDueDate.getDate());
                                                var DT = dt < 10 ? "0" + dt : dt;
                                                var mm = Number(NetDueDate.getMonth() + 1);
                                                var MM = mm < 10 ? "0" + mm : mm;
                                                var NetDueDate1 = NetDueDate.getFullYear() + '-' + MM + '-' + DT;

                                                var RefDate = new Date(items.DocumentDate)
                                                var dt = Number(RefDate.getDate());
                                                var DT = dt < 10 ? "0" + dt : dt;
                                                var mm = Number(RefDate.getMonth() + 1);
                                                var MM = mm < 10 ? "0" + mm : mm;
                                                var RefDate1 = RefDate.getFullYear() + '-' + MM + '-' + DT;

                                                var netDueDate = items.NetDueDate;

                                                const date1 = new Date(keyDate);
                                                const date2 = new Date(netDueDate);
                                                const diffTime = Math.abs(date1 - date2);
                                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                                if (date1 < date2) {
                                                    var days = "-" + diffDays
                                                } else {
                                                    days = diffDays
                                                }

                                                var grid1 = labeltype.split("-")
                                                var grid2 = labeltype1.split("-")
                                                var grid3 = labeltype2.split("-")
                                                var grid4 = labeltype3.split(" ")

                                                var oTableData = {
                                                    CompanyCode: items.CompanyCode,
                                                    AccountingDocument: items.AccountingDocument,
                                                    FinYear: items.FiscalYear,
                                                    ClearingJournalEntry: items.ClearingJournalEntry,
                                                    AmountInTransactionCurrency: parseFloat(items.AmountInBalanceTransacCrcy).toFixed(2),
                                                    PostingDate: PostingDate1,
                                                    Supplier: items.Supplier,
                                                    SupplierName: items.SupplierName,
                                                    RefDate: RefDate1,
                                                    PaymentTerms: items.PaymentTerms,
                                                    NetDueDate: NetDueDate1,
                                                    DocumentReference: items.DocumentReferenceID,
                                                    NotDueAmt: days < 0 ? items.AmountInBalanceTransacCrcy : "",
                                                    PendingAmount: items.AmountInBalanceTransacCrcy,
                                                    AdditionalCurrency1: items.AdditionalCurrency1,
                                                    AssignmentReference: items.AssignmentReference,
                                                    FiscalYear: items.FiscalYear,
                                                    SupplierAccountGroup: items.SupplierAccountGroup,
                                                    AccountGroupText: items.AccountGroupName,
                                                    OverDueDays: days,
                                                    GLBalance: items.SupplierAmounttot,
                                                    GLBalanceAfterAdvice: items.SupplierAmounttot - items.AmountInBalanceTransacCrcy,
                                                    AdviceAmount: "",
                                                    Partialpayment: "",
                                                    Labeltype: days >= grid1[0] && days <= grid1[1] ? items.AmountInBalanceTransacCrcy : "",
                                                    Labeltype1: days >= grid2[0] && days <= grid2[1] ? items.AmountInBalanceTransacCrcy : "",
                                                    Labeltype2: days >= grid3[0] && days <= grid3[1] ? items.AmountInBalanceTransacCrcy : "",
                                                    Labeltype3: days >= grid4[1] ? items.AmountInBalanceTransacCrcy : "",
                                                }
                                                aTableArr.push(oTableData);
                                            }
                                        })
                                        this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                                    }
                                    oBusyDialog.close();

                                }.bind(this)
                            })
                        }
                        else if (companycode != "" && fiscalyear != "" && postingdateto != "" && supplier != "" && Account_Group == "") {

                            oModel.read("/pay_res", {
                                filters: [oFilter, oFilter1, oFilter2, oFilter3],
                                success: function (oresponse) {
                                    oBusyDialog.close();
                                    oresponse.results.map(function (items) {
                                        if (items.Request != "X") {
                                            var PostingDate = new Date(items.PostingDate)
                                            var dt = Number(PostingDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(PostingDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var PostingDate1 = PostingDate.getFullYear() + '-' + MM + '-' + DT;

                                            var NetDueDate = new Date(items.NetDueDate)
                                            var dt = Number(NetDueDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(NetDueDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var NetDueDate1 = NetDueDate.getFullYear() + '-' + MM + '-' + DT;

                                            var RefDate = new Date(items.DocumentDate)
                                            var dt = Number(RefDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(RefDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var RefDate1 = RefDate.getFullYear() + '-' + MM + '-' + DT;

                                            var netDueDate = items.NetDueDate;

                                            const date1 = new Date(keyDate);
                                            const date2 = new Date(netDueDate);
                                            const diffTime = Math.abs(date1 - date2);
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                            if (date1 < date2) {
                                                var days = "-" + diffDays
                                            } else {
                                                days = diffDays
                                            }

                                            var grid1 = labeltype.split("-")
                                            var grid2 = labeltype1.split("-")
                                            var grid3 = labeltype2.split("-")
                                            var grid4 = labeltype3.split(" ")

                                            var oTableData = {
                                                CompanyCode: items.CompanyCode,
                                                AccountingDocument: items.AccountingDocument,
                                                FinYear: items.FiscalYear,
                                                ClearingJournalEntry: items.ClearingJournalEntry,
                                                AmountInTransactionCurrency: parseFloat(items.AmountInBalanceTransacCrcy).toFixed(2),
                                                PostingDate: PostingDate1,
                                                Supplier: items.Supplier,
                                                SupplierName: items.SupplierName,
                                                RefDate: RefDate1,
                                                SupplierAccountGroup: items.SupplierAccountGroup,
                                                AccountGroupText: items.AccountGroupName,
                                                DocumentReference: items.DocumentReferenceID,
                                                NotDueAmt: days < 0 ? items.AmountInBalanceTransacCrcy : "",
                                                PendingAmount: items.AmountInBalanceTransacCrcy,
                                                PaymentTerms: items.PaymentTerms,
                                                NetDueDate: NetDueDate1,
                                                AdditionalCurrency1: items.AdditionalCurrency1,
                                                AssignmentReference: items.AssignmentReference,
                                                FiscalYear: items.FiscalYear,
                                                OverDueDays: days,
                                                GLBalance: items.SupplierAmounttot,
                                                GLBalanceAfterAdvice: items.SupplierAmounttot - items.AmountInBalanceTransacCrcy,
                                                AdviceAmount: "",
                                                Partialpayment: "",
                                                Labeltype: days >= grid1[0] && days <= grid1[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype1: days >= grid2[0] && days <= grid2[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype2: days >= grid3[0] && days <= grid3[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype3: days >= grid4[1] ? items.AmountInBalanceTransacCrcy : "",
                                            }
                                            aTableArr.push(oTableData);
                                        }
                                    })
                                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                                }.bind(this), error: function () {
                                    oBusyDialog.close();
                                }
                            })
                        }
                        else if (companycode != "" && fiscalyear != "" && postingdateto != "" && supplier != "" && Account_Group != "") {

                            oModel.read("/pay_res", {
                                filters: [oFilter, oFilter1, oFilter2, oFilter3, oFilter4],
                                success: function (oresponse) {
                                    oBusyDialog.close();
                                    oresponse.results.map(function (items) {
                                        if (items.Request != "X") {
                                            var PostingDate = new Date(items.PostingDate)
                                            var dt = Number(PostingDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(PostingDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var PostingDate1 = PostingDate.getFullYear() + '-' + MM + '-' + DT;

                                            var NetDueDate = new Date(items.NetDueDate)
                                            var dt = Number(NetDueDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(NetDueDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var NetDueDate1 = NetDueDate.getFullYear() + '-' + MM + '-' + DT;

                                            var RefDate = new Date(items.DocumentDate)
                                            var dt = Number(RefDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(RefDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var RefDate1 = RefDate.getFullYear() + '-' + MM + '-' + DT;

                                            var netDueDate = items.NetDueDate;

                                            const date1 = new Date(keyDate);
                                            const date2 = new Date(netDueDate);
                                            const diffTime = Math.abs(date1 - date2);
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                            if (date1 < date2) {
                                                var days = "-" + diffDays
                                            } else {
                                                days = diffDays
                                            }

                                            var grid1 = labeltype.split("-")
                                            var grid2 = labeltype1.split("-")
                                            var grid3 = labeltype2.split("-")
                                            var grid4 = labeltype3.split(" ")

                                            var oTableData = {
                                                CompanyCode: items.CompanyCode,
                                                AccountingDocument: items.AccountingDocument,
                                                FinYear: items.FiscalYear,
                                                ClearingJournalEntry: items.ClearingJournalEntry,
                                                AmountInTransactionCurrency: parseFloat(items.AmountInBalanceTransacCrcy).toFixed(2),
                                                PostingDate: PostingDate1,
                                                Supplier: items.Supplier,
                                                SupplierName: items.SupplierName,
                                                RefDate: RefDate1,
                                                SupplierAccountGroup: items.SupplierAccountGroup,
                                                AccountGroupText: items.AccountGroupName,
                                                DocumentReference: items.DocumentReferenceID,
                                                NotDueAmt: days < 0 ? items.AmountInBalanceTransacCrcy : "",
                                                PendingAmount: items.AmountInBalanceTransacCrcy,
                                                PaymentTerms: items.PaymentTerms,
                                                NetDueDate: NetDueDate1,
                                                AdditionalCurrency1: items.AdditionalCurrency1,
                                                AssignmentReference: items.AssignmentReference,
                                                FiscalYear: items.FiscalYear,
                                                OverDueDays: days,
                                                GLBalance: items.SupplierAmounttot,
                                                GLBalanceAfterAdvice: items.SupplierAmounttot - items.AmountInBalanceTransacCrcy,
                                                AdviceAmount: "",
                                                Partialpayment: "",
                                                Labeltype: days >= grid1[0] && days <= grid1[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype1: days >= grid2[0] && days <= grid2[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype2: days >= grid3[0] && days <= grid3[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype3: days >= grid4[1] ? items.AmountInBalanceTransacCrcy : "",
                                            }
                                            aTableArr.push(oTableData);
                                        }
                                    })
                                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                                }.bind(this), error: function () {
                                    oBusyDialog.close();
                                }
                            })
                        }
                        else if (companycode != "" && fiscalyear != "" && postingdateto != "" && supplier == "" && Account_Group != "") {

                            oModel.read("/pay_res", {
                                filters: [oFilter, oFilter1, oFilter2, oFilter4],
                                success: function (oresponse) {
                                    oBusyDialog.close();
                                    oresponse.results.map(function (items) {
                                        if (items.Request != "X") {
                                            var PostingDate = new Date(items.PostingDate)
                                            var dt = Number(PostingDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(PostingDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var PostingDate1 = PostingDate.getFullYear() + '-' + MM + '-' + DT;

                                            var NetDueDate = new Date(items.NetDueDate)
                                            var dt = Number(NetDueDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(NetDueDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var NetDueDate1 = NetDueDate.getFullYear() + '-' + MM + '-' + DT;

                                            var RefDate = new Date(items.DocumentDate)
                                            var dt = Number(RefDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(RefDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var RefDate1 = RefDate.getFullYear() + '-' + MM + '-' + DT;

                                            var netDueDate = items.NetDueDate;

                                            const date1 = new Date(keyDate);
                                            const date2 = new Date(netDueDate);
                                            const diffTime = Math.abs(date1 - date2);
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                            if (date1 < date2) {
                                                var days = "-" + diffDays
                                            } else {
                                                days = diffDays
                                            }

                                            var grid1 = labeltype.split("-")
                                            var grid2 = labeltype1.split("-")
                                            var grid3 = labeltype2.split("-")
                                            var grid4 = labeltype3.split(" ")

                                            var oTableData = {
                                                CompanyCode: items.CompanyCode,
                                                AccountingDocument: items.AccountingDocument,
                                                FinYear: items.FiscalYear,
                                                ClearingJournalEntry: items.ClearingJournalEntry,
                                                AmountInTransactionCurrency: parseFloat(items.AmountInBalanceTransacCrcy).toFixed(2),
                                                PostingDate: PostingDate1,
                                                Supplier: items.Supplier,
                                                SupplierName: items.SupplierName,
                                                RefDate: RefDate1,
                                                SupplierAccountGroup: items.SupplierAccountGroup,
                                                AccountGroupText: items.AccountGroupName,
                                                DocumentReference: items.DocumentReferenceID,
                                                NotDueAmt: days < 0 ? items.AmountInBalanceTransacCrcy : "",
                                                PendingAmount: items.AmountInBalanceTransacCrcy,
                                                PaymentTerms: items.PaymentTerms,
                                                NetDueDate: NetDueDate1,
                                                AdditionalCurrency1: items.AdditionalCurrency1,
                                                AssignmentReference: items.AssignmentReference,
                                                FiscalYear: items.FiscalYear,
                                                OverDueDays: days,
                                                GLBalance: items.SupplierAmounttot,
                                                GLBalanceAfterAdvice: items.SupplierAmounttot - items.AmountInBalanceTransacCrcy,
                                                AdviceAmount: "",
                                                Partialpayment: "",
                                                Labeltype: days >= grid1[0] && days <= grid1[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype1: days >= grid2[0] && days <= grid2[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype2: days >= grid3[0] && days <= grid3[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype3: days >= grid4[1] ? items.AmountInBalanceTransacCrcy : "",
                                            }
                                            aTableArr.push(oTableData);
                                        }
                                    })
                                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                                }.bind(this), error: function () {
                                    oBusyDialog.close();
                                }
                            })
                        }
                    }
                } else {
                    if (companycode === "" || fiscalyear === "" || postingdateto === "") {
                        oBusyDialog.close();
                        MessageBox.error("Fields marked mandatory can't be left empty")
                    } else {
                        if (companycode != "" && fiscalyear != "" && postingdateto != "" && supplier === "" && Account_Group == "") {

                            // vendorDataModel.map(function (items) {
                            //     if (items.CompanyCode === companycode && items.FiscalYear === fiscalyear && items.PostingDate <= new Date(postingdateto)) {
                            //         arr.push(items)
                            //     }
                            // })

                            // accountDataModel.map(function (items) {
                            //     var accountgroup = items.SupplierAccountGroup
                            //     arr.map(function (item) {
                            //         if (accountgroup === item.SupplierAccountGroup) {
                            //             var oTableData = {
                            //                 AccountingDocument: item.AccountingDocument,
                            //                 NetDueDate: item.NetDueDate,
                            //                 AmountInBalanceTransacCrcy: item.AmountInBalanceTransacCrcy,
                            //                 SupplierAccountGroup: items.SupplierAccountGroup,
                            //                 GLBalance: items.totamt,
                            //                 AccountGroupText: items.SupplierAccountGroup,
                            //             }
                            //         }
                            //         aTableArr.push(oTableData)
                            //     }.bind(this))
                            // }.bind(this))

                            // var aNewArr = []
                            // for (var i = 0; i < aTableArr.length; i++) {
                            //     if (aTableArr[i] != undefined) {
                            //         aNewArr.push(aTableArr[i])
                            //     }
                            // }

                            // var result = [];
                            // var map = new Map();
                            // for (var item of aNewArr) {  // Array is the array of data here.
                            //     if (!map.has(item.SupplierAccountGroup)) {
                            //         map.set(item.SupplierAccountGroup, true);
                            //         result.push(item);
                            //     }
                            // }
                            // var aNewArr1 = []
                            // result.map(function (items) {
                            //     var NetDueDate = new Date(items.NetDueDate)
                            //     var dt = Number(NetDueDate.getDate());
                            //     var DT = dt < 10 ? "0" + dt : dt;
                            //     var mm = Number(NetDueDate.getMonth() + 1);
                            //     var MM = mm < 10 ? "0" + mm : mm;
                            //     var NetDueDate1 = NetDueDate.getFullYear() + '-' + MM + '-' + DT;

                            //     const date1 = new Date(keyDate);
                            //     const date2 = new Date(items.NetDueDate);
                            //     const diffTime = Math.abs(date1 - date2);
                            //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                            //     if (date1 < date2) {
                            //         var days = "-" + diffDays
                            //     } else {
                            //         days = diffDays
                            //     }

                            //     var grid1 = labeltype.split("-")
                            //     var grid2 = labeltype1.split("-")
                            //     var grid3 = labeltype2.split("-")
                            //     var grid4 = labeltype3.split(" ")

                            //     var oTableData = {
                            //         AccountingDocument: items.AccountingDocument,
                            //         SupplierAccountGroup: items.SupplierAccountGroup,
                            //         NetDueDate: NetDueDate1,
                            //         GLBalance: items.GLBalance,
                            //         AccountGroupText: items.AccountGroupText,
                            //         GLBalanceAfterAdvice: items.GLBalance - items.AmountInBalanceTransacCrcy,
                            //         OverDueDays: days,
                            //         Labeltype: days >= grid1[0] && days <= grid1[1] ? items.AmountInBalanceTransacCrcy : "",
                            //         Labeltype1: days >= grid2[0] && days <= grid2[1] ? items.AmountInBalanceTransacCrcy : "",
                            //         Labeltype2: days >= grid3[0] && days <= grid3[1] ? items.AmountInBalanceTransacCrcy : "",
                            //         Labeltype3: days >= grid4[1] ? items.AmountInBalanceTransacCrcy : "",
                            //     }


                            //     aNewArr1.push(oTableData)
                            // })

                            // this.getView().getModel("oTableDataModel").setProperty("/aTableData", aNewArr1)
                            // arr.map(function (items) {
                            //     accountDataModel.map(function (item) {
                            //         if (items.SupplierAccountGroup === item.SupplierAccountGroup) {

                            //             var NetDueDate = new Date(items.NetDueDate)
                            //             var dt = Number(NetDueDate.getDate());
                            //             var DT = dt < 10 ? "0" + dt : dt;
                            //             var mm = Number(NetDueDate.getMonth() + 1);
                            //             var MM = mm < 10 ? "0" + mm : mm;
                            //             var NetDueDate1 = NetDueDate.getFullYear() + '-' + MM + '-' + DT;

                            //             const date1 = new Date(keyDate);
                            //             const date2 = new Date(items.NetDueDate);
                            //             const diffTime = Math.abs(date1 - date2);
                            //             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                            //             if (date1 < date2) {
                            //                 var days = "-" + diffDays
                            //             } else {
                            //                 days = diffDays
                            //             }

                            //             var grid1 = labeltype.split("-")
                            //             var grid2 = labeltype1.split("-")
                            //             var grid3 = labeltype2.split("-")
                            //             var grid4 = labeltype3.split(" ")

                            //             var oTableData = {
                            //                 AccountingDocument: items.AccountingDocument,
                            //                 SupplierAccountGroup: item.SupplierAccountGroup,
                            //                 NetDueDate: NetDueDate1,
                            //                 GLBalance: item.totamt,
                            //                 AccountGroupText: items.AccountGroupName,
                            //                 GLBalanceAfterAdvice: item.totamt - items.AmountInBalanceTransacCrcy,
                            //                 OverDueDays: days,
                            //                 Labeltype: days >= grid1[0] && days <= grid1[1] ? items.AmountInBalanceTransacCrcy : "",
                            //                 Labeltype1: days >= grid2[0] && days <= grid2[1] ? items.AmountInBalanceTransacCrcy : "",
                            //                 Labeltype2: days >= grid3[0] && days <= grid3[1] ? items.AmountInBalanceTransacCrcy : "",
                            //                 Labeltype3: days >= grid4[1] ? items.AmountInBalanceTransacCrcy : "",
                            //             }

                            //             aTableArr.push(oTableData)
                            //         }
                            //     }.bind(this))

                            //     var filtered = aTableArr.filter(function (el) {
                            //         return el != "";
                            //     });

                            //     this.getView().getModel("oTableDataModel").setProperty("/aTableData", filtered)
                            // }.bind(this))



                            oModel.read("/pay_res", {
                                filters: [oFilter, oFilter1, oFilter2],
                                success: function (oresponse) {
                                    if (oresponse.results.length > 0) {

                                        // oresponse.results.map(function (items) {
                                        //     var oTableData = {
                                        //         SupplierAccountGroup: items.SupplierAccountGroup,
                                        //         CompanyCodeCurrency: items.CompanyCodeCurrency,
                                        //         GLBalance: items.totamt,
                                        //         GLBalanceAfterAdvice: items.SupplierAmounttot - items.AmountInBalanceTransacCrcy,

                                        //         AccountGroupText: items.AccountGroupName,
                                        //         AdviceAmount: "",
                                        //         Partialpayment: "",
                                        //         // Labeltype: days >= grid1[0] && days <= grid1[1] ? items.AmountInBalanceTransacCrcy : "",
                                        //         // Labeltype1: days >= grid2[0] && days <= grid2[1] ? items.AmountInBalanceTransacCrcy : "",
                                        //         // Labeltype2: days >= grid3[0] && days <= grid3[1] ? items.AmountInBalanceTransacCrcy : "",
                                        //         // Labeltype3: days >= grid4[1] ? items.AmountInBalanceTransacCrcy : "",
                                        //     }
                                        //     aTableArr.push(oTableData);
                                        // })

                                        oresponse.results.map(function (items) {
                                            // if (items.Request != "X") {
                                            var PostingDate = new Date(items.PostingDate)
                                            var dt = Number(PostingDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(PostingDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var PostingDate1 = PostingDate.getFullYear() + '-' + MM + '-' + DT;

                                            var NetDueDate = new Date(items.NetDueDate)
                                            var dt = Number(NetDueDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(NetDueDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var NetDueDate1 = NetDueDate.getFullYear() + '-' + MM + '-' + DT;

                                            var RefDate = new Date(items.DocumentDate)
                                            var dt = Number(RefDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(RefDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var RefDate1 = RefDate.getFullYear() + '-' + MM + '-' + DT;

                                            var netDueDate = items.NetDueDate;

                                            const date1 = new Date(keyDate);
                                            const date2 = new Date(netDueDate);
                                            const diffTime = Math.abs(date1 - date2);
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                            if (date1 < date2) {
                                                var days = "-" + diffDays
                                            } else {
                                                days = diffDays
                                            }

                                            var grid1 = labeltype.split("-")
                                            var grid2 = labeltype1.split("-")
                                            var grid3 = labeltype2.split("-")
                                            var grid4 = labeltype3.split(" ")

                                            var oTableData = {
                                                CompanyCode: items.CompanyCode,
                                                AccountingDocument: items.AccountingDocument,
                                                FinYear: items.FiscalYear,
                                                ClearingJournalEntry: items.ClearingJournalEntry,
                                                AmountInTransactionCurrency: parseFloat(items.AmountInBalanceTransacCrcy).toFixed(2),
                                                PostingDate: PostingDate1,
                                                Supplier: items.Supplier,
                                                SupplierName: items.SupplierName,
                                                RefDate: RefDate1,
                                                PaymentTerms: items.PaymentTerms,
                                                NetDueDate: NetDueDate1,
                                                DocumentReference: items.DocumentReferenceID,
                                                NotDueAmt: days < 0 ? items.AmountInBalanceTransacCrcy : "",
                                                PendingAmount: items.AmountInBalanceTransacCrcy,
                                                AdditionalCurrency1: items.AdditionalCurrency1,
                                                AssignmentReference: items.AssignmentReference,
                                                FiscalYear: items.FiscalYear,
                                                SupplierAccountGroup: items.SupplierAccountGroup,
                                                AccountGroupText: items.AccountGroupName,
                                                OverDueDays: days,
                                                GLBalance: items.SupplierAmounttot,
                                                GLBalanceAfterAdvice: items.SupplierAmounttot - items.AmountInBalanceTransacCrcy,
                                                AdviceAmount: "",
                                                Partialpayment: "",
                                                Labeltype: days >= grid1[0] && days <= grid1[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype1: days >= grid2[0] && days <= grid2[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype2: days >= grid3[0] && days <= grid3[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype3: days >= grid4[1] ? items.AmountInBalanceTransacCrcy : "",
                                            }
                                            aTableArr.push(oTableData);
                                            // }
                                        })

                                        // var result = aTableArr.sort((a, b) =>
                                        //     a.SupplierAccountGroup.localeCompare(b.SupplierAccountGroup));
                                        var result = aTableArr.sort((a, b) => a.SupplierAccountGroup.localeCompare(b.SupplierAccountGroup));

                                        // const groupedData = {};
                                        // for (const item of result) {
                                        //     const SupplierAccountGroup = item.SupplierAccountGroup;

                                        //     if (!groupedData[SupplierAccountGroup]) {
                                        //         groupedData[SupplierAccountGroup] = [];
                                        //     }

                                        //     groupedData[SupplierAccountGroup].push(item);
                                        // }

                                        // Sum up GLBalance for each group within the same array
                                        // for (const group in groupedData) {
                                        //     const groupItems = groupedData[group];
                                        //     const totalGLBalance = groupItems.reduce((sum, item) => sum + Number(item.AmountInTransactionCurrency), 0);

                                        //     groupItems.forEach((item) => {
                                        //         item.GLBalance = parseFloat(totalGLBalance).toFixed(2);
                                        //     });
                                        // }
                                        //line item 697 to 705 is created by me
                                        // for (const group in groupedData) {
                                        //     const groupItems = groupedData[group];
                                        //     const totalLabeltype1 = groupItems.reduce((sum, item) => sum + Number(item.Labeltype1), 0);

                                        //     groupItems.forEach((item) => {
                                        //         item.Labeltype1 = parseFloat(totalLabeltype1).toFixed(2);
                                        //     });
                                        // }

                                        //line item 707 to 715 is created by me
                                        // for (const group in groupedData) {
                                        //     const groupItems = groupedData[group];
                                        //     const totalLabeltype2 = groupItems.reduce((sum, item) => sum + Number(item.Labeltype2), 0);

                                        //     groupItems.forEach((item) => {
                                        //         item.Labeltype2 = parseFloat(totalLabeltype2).toFixed(2);
                                        //     });
                                        // }

                                        //line item 717 to 725 is created by me
                                        // for (const group in groupedData) {
                                        //     const groupItems = groupedData[group];
                                        //     const totalLabeltype3 = groupItems.reduce((sum, item) => sum + Number(item.Labeltype3), 0);

                                        //     groupItems.forEach((item) => {
                                        //         item.Labeltype3 = parseFloat(totalLabeltype3).toFixed(2);
                                        //     });
                                        // }

                                        // for (const group in groupedData) {
                                        //     const groupItems = groupedData[group];
                                        //     const totalLabeltype = groupItems.reduce((sum, item) => sum + Number(item.Labeltype), 0);

                                        //     groupItems.forEach((item) => {
                                        //         item.Labeltype = parseFloat(totalLabeltype).toFixed(2);
                                        //     });
                                        // }

                                        // Create an object to store the grouped and summed data
                                        const groupedData = {};

                                        // Loop through the dummyDataArray to group and sum by SupplierAccountGroup
                                        result.forEach((data) => {
                                            const group = data.SupplierAccountGroup;
                                            const amount = Number(data.AmountInTransactionCurrency);

                                            if (groupedData[group] === undefined) {
                                                groupedData[group] = 0;
                                            }

                                            groupedData[group] += amount;
                                        });

                                        console.log(groupedData)

                                        var result1 = [];
                                        var map = new Map();

                                        for (var item of result) {
                                            if (!map.has(item.SupplierAccountGroup)) {
                                                map.set(item.SupplierAccountGroup, true)
                                                result1.push(item)
                                            }
                                        }


                                        // const groupArrayObject = aTableArr.reduce((group, arr) => {
                                        //     const { SupplierAccountGroup } = arr;
                                        //     group[SupplierAccountGroup] = group[SupplierAccountGroup] ?? [];
                                        //     group[SupplierAccountGroup].push(arr);
                                        //     return group;
                                        // }, {});

                                        // console.log(groupArrayObject);
                                        this.getView().getModel("oTableDataModel").setProperty("/aTableData", result1)
                                    }
                                    oBusyDialog.close();

                                }.bind(this)
                            })
                        }
                        else if (companycode != "" && fiscalyear != "" && postingdateto != "" && supplier != "" && Account_Group == "") {

                            oModel.read("/pay_res", {
                                filters: [oFilter, oFilter1, oFilter2, oFilter3],
                                success: function (oresponse) {
                                    oBusyDialog.close();
                                    oresponse.results.map(function (items) {
                                        if (items.Request != "X") {
                                            var PostingDate = new Date(items.PostingDate)
                                            var dt = Number(PostingDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(PostingDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var PostingDate1 = PostingDate.getFullYear() + '-' + MM + '-' + DT;

                                            var NetDueDate = new Date(items.NetDueDate)
                                            var dt = Number(NetDueDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(NetDueDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var NetDueDate1 = NetDueDate.getFullYear() + '-' + MM + '-' + DT;

                                            var RefDate = new Date(items.DocumentDate)
                                            var dt = Number(RefDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(RefDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var RefDate1 = RefDate.getFullYear() + '-' + MM + '-' + DT;

                                            var netDueDate = items.NetDueDate;

                                            const date1 = new Date(keyDate);
                                            const date2 = new Date(netDueDate);
                                            const diffTime = Math.abs(date1 - date2);
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                            if (date1 < date2) {
                                                var days = "-" + diffDays
                                            } else {
                                                days = diffDays
                                            }

                                            var grid1 = labeltype.split("-")
                                            var grid2 = labeltype1.split("-")
                                            var grid3 = labeltype2.split("-")
                                            var grid4 = labeltype3.split(" ")

                                            var oTableData = {
                                                CompanyCode: items.CompanyCode,
                                                AccountingDocument: items.AccountingDocument,
                                                FinYear: items.FiscalYear,
                                                ClearingJournalEntry: items.ClearingJournalEntry,
                                                AmountInTransactionCurrency: parseFloat(items.AmountInBalanceTransacCrcy).toFixed(2),
                                                PostingDate: PostingDate1,
                                                Supplier: items.Supplier,
                                                SupplierName: items.SupplierName,
                                                RefDate: RefDate1,
                                                SupplierAccountGroup: items.SupplierAccountGroup,
                                                AccountGroupText: items.AccountGroupName,
                                                DocumentReference: items.DocumentReferenceID,
                                                NotDueAmt: days < 0 ? items.AmountInBalanceTransacCrcy : "",
                                                PendingAmount: items.AmountInBalanceTransacCrcy,
                                                PaymentTerms: items.PaymentTerms,
                                                NetDueDate: NetDueDate1,
                                                AdditionalCurrency1: items.AdditionalCurrency1,
                                                AssignmentReference: items.AssignmentReference,
                                                FiscalYear: items.FiscalYear,
                                                OverDueDays: days,
                                                GLBalance: items.SupplierAmounttot,
                                                GLBalanceAfterAdvice: items.SupplierAmounttot - items.AmountInBalanceTransacCrcy,
                                                AdviceAmount: "",
                                                Partialpayment: "",
                                                Labeltype: days >= grid1[0] && days <= grid1[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype1: days >= grid2[0] && days <= grid2[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype2: days >= grid3[0] && days <= grid3[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype3: days >= grid4[1] ? items.AmountInBalanceTransacCrcy : "",
                                            }
                                            aTableArr.push(oTableData);
                                        }
                                    })
                                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                                }.bind(this), error: function () {
                                    oBusyDialog.close();
                                }
                            })
                        }
                        else if (companycode != "" && fiscalyear != "" && postingdateto != "" && supplier != "" && Account_Group != "") {

                            oModel.read("/pay_res", {
                                filters: [oFilter, oFilter1, oFilter2, oFilter3, oFilter4],
                                success: function (oresponse) {
                                    oBusyDialog.close();

                                    oresponse.results.map(function (items) {
                                        if (items.Request != "X") {
                                            var PostingDate = new Date(items.PostingDate)
                                            var dt = Number(PostingDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(PostingDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var PostingDate1 = PostingDate.getFullYear() + '-' + MM + '-' + DT;

                                            var NetDueDate = new Date(items.NetDueDate)
                                            var dt = Number(NetDueDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(NetDueDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var NetDueDate1 = NetDueDate.getFullYear() + '-' + MM + '-' + DT;

                                            var RefDate = new Date(items.DocumentDate)
                                            var dt = Number(RefDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(RefDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var RefDate1 = RefDate.getFullYear() + '-' + MM + '-' + DT;

                                            var netDueDate = items.NetDueDate;

                                            const date1 = new Date(keyDate);
                                            const date2 = new Date(netDueDate);
                                            const diffTime = Math.abs(date1 - date2);
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                            if (date1 < date2) {
                                                var days = "-" + diffDays
                                            } else {
                                                days = diffDays
                                            }

                                            var grid1 = labeltype.split("-")
                                            var grid2 = labeltype1.split("-")
                                            var grid3 = labeltype2.split("-")
                                            var grid4 = labeltype3.split(" ")

                                            var oTableData = {
                                                CompanyCode: items.CompanyCode,
                                                AccountingDocument: items.AccountingDocument,
                                                FinYear: items.FiscalYear,
                                                ClearingJournalEntry: items.ClearingJournalEntry,
                                                AmountInTransactionCurrency: parseFloat(items.AmountInBalanceTransacCrcy).toFixed(2),
                                                PostingDate: PostingDate1,
                                                Supplier: items.Supplier,
                                                SupplierName: items.SupplierName,
                                                RefDate: RefDate1,
                                                SupplierAccountGroup: items.SupplierAccountGroup,
                                                AccountGroupText: items.AccountGroupName,
                                                DocumentReference: items.DocumentReferenceID,
                                                NotDueAmt: days < 0 ? items.AmountInBalanceTransacCrcy : "",
                                                PendingAmount: items.AmountInBalanceTransacCrcy,
                                                PaymentTerms: items.PaymentTerms,
                                                NetDueDate: NetDueDate1,
                                                AdditionalCurrency1: items.AdditionalCurrency1,
                                                AssignmentReference: items.AssignmentReference,
                                                FiscalYear: items.FiscalYear,
                                                OverDueDays: days,
                                                GLBalance: items.SupplierAmounttot,
                                                GLBalanceAfterAdvice: items.SupplierAmounttot - items.AmountInBalanceTransacCrcy,
                                                AdviceAmount: "",
                                                Partialpayment: "",
                                                Labeltype: days >= grid1[0] && days <= grid1[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype1: days >= grid2[0] && days <= grid2[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype2: days >= grid3[0] && days <= grid3[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype3: days >= grid4[1] ? items.AmountInBalanceTransacCrcy : "",
                                            }
                                            aTableArr.push(oTableData);
                                        }
                                    })
                                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                                }.bind(this), error: function () {
                                    oBusyDialog.close();
                                }
                            })
                        }
                        else if (companycode != "" && fiscalyear != "" && postingdateto != "" && supplier == "" && Account_Group != "") {

                            oModel.read("/pay_res", {
                                filters: [oFilter, oFilter1, oFilter2, oFilter4],
                                success: function (oresponse) {
                                    oBusyDialog.close();
                                    oresponse.results.map(function (items) {
                                        if (items.Request != "X") {
                                            var PostingDate = new Date(items.PostingDate)
                                            var dt = Number(PostingDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(PostingDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var PostingDate1 = PostingDate.getFullYear() + '-' + MM + '-' + DT;

                                            var NetDueDate = new Date(items.NetDueDate)
                                            var dt = Number(NetDueDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(NetDueDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var NetDueDate1 = NetDueDate.getFullYear() + '-' + MM + '-' + DT;

                                            var RefDate = new Date(items.DocumentDate)
                                            var dt = Number(RefDate.getDate());
                                            var DT = dt < 10 ? "0" + dt : dt;
                                            var mm = Number(RefDate.getMonth() + 1);
                                            var MM = mm < 10 ? "0" + mm : mm;
                                            var RefDate1 = RefDate.getFullYear() + '-' + MM + '-' + DT;

                                            var netDueDate = items.NetDueDate;

                                            const date1 = new Date(keyDate);
                                            const date2 = new Date(netDueDate);
                                            const diffTime = Math.abs(date1 - date2);
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                            if (date1 < date2) {
                                                var days = "-" + diffDays
                                            } else {
                                                days = diffDays
                                            }

                                            var grid1 = labeltype.split("-")
                                            var grid2 = labeltype1.split("-")
                                            var grid3 = labeltype2.split("-")
                                            var grid4 = labeltype3.split(" ")

                                            var oTableData = {
                                                CompanyCode: items.CompanyCode,
                                                AccountingDocument: items.AccountingDocument,
                                                FinYear: items.FiscalYear,
                                                ClearingJournalEntry: items.ClearingJournalEntry,
                                                AmountInTransactionCurrency: parseFloat(items.AmountInBalanceTransacCrcy).toFixed(2),
                                                PostingDate: PostingDate1,
                                                Supplier: items.Supplier,
                                                SupplierName: items.SupplierName,
                                                RefDate: RefDate1,
                                                SupplierAccountGroup: items.SupplierAccountGroup,
                                                AccountGroupText: items.AccountGroupName,
                                                DocumentReference: items.DocumentReferenceID,
                                                NotDueAmt: days < 0 ? items.AmountInBalanceTransacCrcy : "",
                                                PendingAmount: items.AmountInBalanceTransacCrcy,
                                                PaymentTerms: items.PaymentTerms,
                                                NetDueDate: NetDueDate1,
                                                AdditionalCurrency1: items.AdditionalCurrency1,
                                                AssignmentReference: items.AssignmentReference,
                                                FiscalYear: items.FiscalYear,
                                                OverDueDays: days,
                                                GLBalance: items.SupplierAmounttot,
                                                GLBalanceAfterAdvice: items.SupplierAmounttot - items.AmountInBalanceTransacCrcy,
                                                AdviceAmount: "",
                                                Partialpayment: "",
                                                Labeltype: days >= grid1[0] && days <= grid1[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype1: days >= grid2[0] && days <= grid2[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype2: days >= grid3[0] && days <= grid3[1] ? items.AmountInBalanceTransacCrcy : "",
                                                Labeltype3: days >= grid4[1] ? items.AmountInBalanceTransacCrcy : "",
                                            }
                                            aTableArr.push(oTableData);
                                        }
                                    })
                                    this.getView().getModel("oTableDataModel").setProperty("/aTableData", aTableArr)
                                }.bind(this), error: function () {
                                    oBusyDialog.close();
                                }
                            })
                        }
                    }
                }
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

                // if (grid4 != "") {
                //     if (grid1 === "") {
                //         MessageBox.error("Grid1 can't be left empty")
                //     } else if (grid2 === "") {
                //         MessageBox.error("Grid2 can't be left empty")
                //     } else if (grid3 === "") {
                //         MessageBox.error("Grid3 can't be left empty")
                //     }
                //     else {
                //         this.getView().getModel("oGenericModel").setProperty("/labeltype3", "Above " + grid3)
                //     }
                // } else {
                //     this.getView().getModel("oGenericModel").setProperty("/labeltype3", "Above 90")
                // }
            },

            onSelect: function (oEvent) {
                // var oContext = oEvent.getParameter("rowContext").getObject();

                var cellvalue = oEvent.getParameters('rowBindingContext').cellControl.getValue()

                var dialog = new sap.m.Dialog({
                    title: 'GL Account Details',
                    contentWidth: "550px",
                    contentHeight: "300px",
                    resizable: true,

                    content: [new sap.ui.table({

                    })],

                    // content: [new sap.m.Label({ text: "GL Account Number" }),
                    // new sap.m.Label({ text: "GL Account Description" })


                    // ],

                    endButton: new sap.m.Button({


                        text: "Ok",
                        press: function () {
                            dialog.close();
                            return false;
                        }
                    }),

                    beginButton: new sap.m.Button({
                        text: "Cancel",
                        press: function () {
                            dialog.close();
                            return false;
                        }
                    }),
                    afterClose: function () {
                        dialog.destroy();
                    }
                });

                dialog.open();

                var oTableModel = this.getView().getModel("oTableDataModel")
                var aTableArr = oTableModel.getProperty("/aTableData")

                aTableArr.map(function (items) {
                    if (items.AccountingDocument === oContext.AccountingDocument) {
                        items.AdviceAmount = oContext.PendingAmount
                    }
                })
                oTableModel.setProperty("/aTableItem", aTableArr)
            },

            onRequest: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Saving"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFIPAYMENT_PROGRAM")
                var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
                var companycode = this.getView().byId("idCompanyCode").getValue();
                var oComanModel = this.getView().getModel('oTableDataModel')
                var sPath = oEvent.getSource().getBindingContext('oTableDataModel').getPath();
                // var postingdate = new Date(oContext.PostingDate);
                // var postingdate1 = new Date(postingdate.getTime() - postingdate.getTimezoneOffset() * 60000);
                // var postingdate2 = postingdate1.toISOString().slice(0, 16);

                // var netDueDate = new Date(oContext.NetDueDate);
                // var netDueDate1 = new Date(netDueDate.getTime() - netDueDate.getTimezoneOffset() * 60000);
                // var netDueDate2 = netDueDate1.toISOString().slice(0, 16);

                // var refDate = new Date(oContext.RefDate);
                // var refDate1 = new Date(refDate.getTime() - refDate.getTimezoneOffset() * 60000);
                // var refDate2 = refDate1.toISOString().slice(0, 16);

                var obj = {
                    "Accountingdocument": oContext.AccountingDocument,
                    "Partialpayment": oContext.Partialpayment === "" ? "0.00" : parseFloat(oContext.Partialpayment).toFixed(2),
                    "Companycode": companycode,
                    "Finyear": oContext.FiscalYear,
                    "Accgroup": oContext.SupplierAccountGroup,
                    "Supplier": oContext.Supplier,
                    // "Reffdate": refDate2,
                    "Reffdoc": oContext.DocumentReference,
                    "glbalance": oContext.GLBalance,
                    // "Notdueamonnt": oContext.NotDueAmt === "" ? "0.00" : parseFloat(oContext.NotDueAmt).toFixed(2),
                    // "Pandingamount": oContext.PendingAmount === "" ? "0.00" : parseFloat(oContext.PendingAmount).toFixed(2),
                    // "Netduedate": netDueDate2,
                    // "Glbalanceafteradv": oContext.GLBalanceAfterAdvice === "" ? "0.00" : parseFloat(oContext.GLBalanceAfterAdvice).toFixed(2),
                    "Remark": oContext.Remark,
                    // "Postingdate": postingdate2,
                    "Request": "X",
                    "Rejected": "",
                }

                var oFilter = new sap.ui.model.Filter("Accountingdocument", "EQ", oContext.AccountingDocument)
                var oFilter1 = new sap.ui.model.Filter("Finyear", "EQ", oContext.FiscalYear)
                var oFilter2 = new sap.ui.model.Filter("Companycode", "EQ", companycode)

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
                                }, error: function () {
                                    oBusyDialog.close();
                                }
                            })
                        } else {
                            oModel.update("/ZFIPAYMENT_PROGRAM(Accountingdocument='" + oContext.AccountingDocument + "',Finyear='" + oContext.FiscalYear + "',Companycode='" + companycode + "')", obj, {
                                success: function (oresponse) {
                                    oBusyDialog.close();
                                    MessageToast.show("Requested")
                                }, error: function () {
                                    oBusyDialog.close();
                                }
                            })
                        }
                    }
                })


            }
        });
    });
