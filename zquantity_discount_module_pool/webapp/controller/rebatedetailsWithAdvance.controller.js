sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, FilterOperator, MessageBox) {
        "use strict";

        return Controller.extend("zquantitydiscountmodulepool.controller.rebatedetailsWithAdvance", {
            onInit: function () {
                UIComponent.getRouterFor(this).getRoute("rebatedetailsWithAdvance").attachPatternMatched(this._CallEntityData, this)
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableItemModel")
                this.getView().getModel("oTableItemModel").setProperty("/aTableItem", [])

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oRejectButtonModel")
                this.getView().getModel("oRejectButtonModel").setProperty("/RejectButton", true)


                UIComponent.getRouterFor(this).getRoute("rebatedetailsWithAdvance").attachPatternMatched(this._onRouteMatch, this)
                UIComponent.getRouterFor(this).getRoute("rebatedetailsWithAdvance").attachPatternMatched(this._oncalculateGD, this)
                // UIComponent.getRouterFor(this).getRoute("rebatedetailsWithAdvance").attachPatternMatched(this.GeneralDiscountvalueChange, this)

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "amountValue")
                this.getView().getModel("amountValue").setProperty("/amount")
                var ButtonObj = {
                    "RejectButton": true,
                    "GenerateButton": true,
                }
                this.getView().setModel(new sap.ui.model.json.JSONModel(ButtonObj), "oButtonVisibleModel")
                this.getView().getModel("oButtonVisibleModel").setProperty("/RejectButton", true)
                this.getView().getModel("oButtonVisibleModel").setProperty("/GenerateButton", true)



            },
            _CallEntityData: function () {

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQDT_SERVICE_BINDING");
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oQuantityDiscTmgModel");

                oModel.read("/Quantity_Discount", {
                    urlParameters: { "$top": "100000" },
                    success: function (oresponse) {
                        this.getView().getModel("oQuantityDiscTmgModel").setProperty("/oQuantityDiscTmgData", oresponse.results)
                    }.bind(this)
                })
            },

            _onRouteMatch: function () {
                var TableModel = this.getView().getModel("oTableItemModel").getProperty("/aTableItem")
                var aNewArr = [];
                if (TableModel.length > 0) {
                    this.getView().getModel("oTableItemModel").setProperty("/aTableItem", aNewArr)
                    var oModel = this.getView().getModel();
                    var InvoiceData = this.getOwnerComponent().getModel("oInvoiceObject").getProperty("/aInvoiceData")
                    var customerCode = InvoiceData.customerCode;
                    // var CompanyCode = InvoiceData.CompanyCode;
                    var circularNum = InvoiceData.CircularNumber;
                    var invoiceDateFrom = InvoiceData.invoiceDateFrom;
                    var invoiceDateTo = InvoiceData.invoiceDateTo;
                    var materialpricinggroup = InvoiceData.materialpricinggroup;
                    var oTableModel = this.getView().getModel("oTableItemModel")
                    var aTableArr = oTableModel.getProperty("/aTableItem")

                    var oFilter = new sap.ui.model.Filter("BillingDocument", "EQ", InvoiceData.invoiceNo)
                    var oFilter1 = new sap.ui.model.Filter("BillingDocumentDate", "EQ", invoiceDateFrom)
                    var oFilter2 = new sap.ui.model.Filter("BillingDocumentDate", "EQ", invoiceDateTo)

                    var oFilter3 = new sap.ui.model.Filter({
                        path: "BillingDocumentDate",
                        operator: FilterOperator.BT,
                        value1: invoiceDateFrom,
                        value2: invoiceDateTo
                    })

                    var oFilter4 = new sap.ui.model.Filter("BILLTOPARTY", "EQ", customerCode)
                    var oFilter5 = new sap.ui.model.Filter("CR_no", "EQ", circularNum)
                    // var oFilter6 = new sap.ui.model.Filter("CompanyCode", "EQ", CompanyCode)

                    if (customerCode != "" && circularNum != "") {
                        var QuantityDiscountData = this.getView().getModel("oQuantityDiscTmgModel").getProperty("/oQuantityDiscTmgData");
                        oModel.read("/Ycds_invoice_data", {
                            filters: [oFilter4, oFilter5],
                            success: function (oresponse) {
                                this.getView().setModel(new sap.ui.model.json.JSONModel(oresponse.results[0]), "oHeaderModel")
                                var QuantityDiscountData2 = this.getView().getModel("oQuantityDiscTmgModel").getProperty("/oQuantityDiscTmgData");
                                oresponse.results.map(function (items) {
                                    if (items.new_invqty === "" && items.rejectqty === "") {
                                        var invoicedate = items.BillingDocumentDate
                                        var oDate = new Date(invoicedate)
                                        var dt = Number(oDate.getDate());
                                        var Dt = dt < 10 ? "0" + dt : dt;
                                        var mm = Number(oDate.getMonth() + 1);
                                        var MM = mm < 10 ? "0" + mm : mm;

                                        var oDate1 = new Date(invoiceDateFrom)
                                        var oDate2 = new Date(invoiceDateTo)
                                        if (oDate >= oDate1 && oDate <= oDate2 && materialpricinggroup == items.MaterialPricingGroup) {
                                            if (items.CustomerPaymentTerms == "ZS01") {
                                                var obj = {
                                                    "BillingDocumentItem": items.BillingDocumentItem,
                                                    "InvoiceDate": oDate.getFullYear() + '-' + MM + '-' + Dt,
                                                    "CircularNo": items.CR_no,
                                                    "InvoiceNo": items.BillingDocument,
                                                    "SalesGroup": items.SalesGroup,
                                                    "District": items.DistrictName,
                                                    "Material": items.Material,
                                                    "Quantity": items.BillingQuantity,
                                                    "Rate": parseFloat(items.BASICRATE).toFixed(2),
                                                    "BillingAmount": "",
                                                    "GST": "",
                                                    "TotalDiscount": "",
                                                    "GeneralDiscount": "",
                                                    "CashDiscount": "",
                                                    "LiftingDiscount": "",
                                                    "SpecialDiscount": "",
                                                    "OtherDiscount": "",
                                                    "CreditNoteNo": ""
                                                }
                                                aTableArr.push(obj)
                                            }
                                        }
                                    }
                                })
                                oTableModel.setProperty("/aTableItem", aTableArr)
                                // this.GeneralDiscountvalueChange();
                            }.bind(this)
                        })
                    }
                }
                else {
                    var oModel = this.getView().getModel();
                    var InvoiceData = this.getOwnerComponent().getModel("oInvoiceObject").getProperty("/aInvoiceData")
                    var circularNum = InvoiceData.CircularNumber;
                    var customerCode = InvoiceData.customerCode;
                    // var CompanyCode = InvoiceData.CompanyCode;
                    var invoiceNo = InvoiceData.invoiceNo;
                    var invoiceDateFrom = InvoiceData.invoiceDateFrom;
                    var materialpricinggroup = InvoiceData.materialpricinggroup;
                    var invoiceDateTo = InvoiceData.invoiceDateTo;
                    var oTableModel = this.getView().getModel("oTableItemModel")
                    var aTableArr = oTableModel.getProperty("/aTableItem")

                    var oFilter = new sap.ui.model.Filter("BillingDocument", "EQ", InvoiceData.invoiceNo)
                    var oFilter1 = new sap.ui.model.Filter("BillingDocumentDate", "EQ", invoiceDateFrom)
                    var oFilter2 = new sap.ui.model.Filter("BillingDocumentDate", "EQ", invoiceDateTo)

                    var oFilter3 = new sap.ui.model.Filter({
                        path: "BillingDocumentDate",
                        operator: FilterOperator.BT,
                        value1: invoiceDateFrom,
                        value2: invoiceDateTo
                    })

                    var oFilter4 = new sap.ui.model.Filter("BILLTOPARTY", "EQ", customerCode)
                    var oFilter5 = new sap.ui.model.Filter("CR_no", "EQ", circularNum)
                    // var oFilter6 = new sap.ui.model.Filter("CompanyCode", "EQ", CompanyCode)

                    if (customerCode != "" && circularNum != "") {
                        oModel.read("/Ycds_invoice_data", {
                            filters: [oFilter4, oFilter5],
                            success: function (oresponse) {
                                var QuantityDiscountData = this.getView().getModel("oQuantityDiscTmgModel").getProperty("/oQuantityDiscTmgData");
                                this.getView().setModel(new sap.ui.model.json.JSONModel(oresponse.results[0]), "oHeaderModel")
                                oresponse.results.map(function (items) {
                                    if (items.new_invqty === "" && items.rejectqty === "") {
                                        var invoicedate = items.BillingDocumentDate
                                        var oDate = new Date(invoicedate)
                                        var oDate1 = new Date(invoiceDateFrom)
                                        var oDate2 = new Date(invoiceDateTo)
                                        var dt = Number(oDate.getDate());
                                        var Dt = dt < 10 ? "0" + dt : dt;
                                        var mm = Number(oDate.getMonth() + 1);
                                        var MM = mm < 10 ? "0" + mm : mm;
                                        if (oDate >= oDate1 && oDate <= oDate2 && materialpricinggroup == items.MaterialPricingGroup) {

                                            var obj = {
                                                "BillingDocumentItem": items.BillingDocumentItem,
                                                "InvoiceDate": oDate.getFullYear() + '-' + MM + '-' + Dt,
                                                "InvoiceNo": items.BillingDocument,
                                                "CircularNo": items.CR_no,
                                                "Material": items.Material,
                                                "District": items.DistrictName,
                                                "SalesGroup": items.SalesGroup,
                                                "Quantity": items.BillingQuantity,
                                                "Rate": parseFloat(items.BASICRATE).toFixed(2),
                                                "BillingAmount": "",
                                                "GST": "",
                                                "GeneralDiscount": "",
                                                "TotalDiscount": "",
                                                "CashDiscount": "",
                                                "LiftingDiscount": "",
                                                "SpecialDiscount": "",
                                                "OtherDiscount": "",
                                                "CreditNoteNo": ""
                                            }
                                            aTableArr.push(obj)
                                        }
                                    }

                                })
                                oTableModel.setProperty("/aTableItem", aTableArr)

                            }.bind(this)
                        })
                    }
                }


            },
            Quantity_TotelingFun: function () {
                var TableModel = this.getView().getModel("oTableItemModel");
                var aTableArr = TableModel.getProperty("/aTableItem");
                var TableData = this.getView().getModel("oTableItemModel").getProperty("/aTableItem");
                if (aTableArr.length != 0) {

                    var aNewArrForQuantity = [];


                    for (var i = 0; i < aTableArr.length; i++) {
                        aNewArrForQuantity.push(parseFloat(TableData[i].Quantity));
                    }
                    var totalSumForQuantity = 0;
                    var arrayLen1 = aNewArrForQuantity.length;
                    for (var i = 0; i < arrayLen1; i++) {
                        totalSumForQuantity += aNewArrForQuantity[i];
                    }
                    var totalQuantity = totalSumForQuantity.toFixed(3);
                    var TotalQuantity = totalQuantity.toString();

                    var TableModel = this.getView().getModel("oTableItemModel");
                    var aTableArr = TableModel.getProperty("/aTableItem")

                    var obj12 = {
                        "InvoiceDate": "",
                        "InvoiceNo": "",
                        "Material": "",
                        "CircularNo": "Total Quantity",
                        "Quantity": TotalQuantity,
                        "Rate": "",
                        "BillingAmount": "",
                        "GST": "",
                        "TotalDiscount": "",
                        "GeneralDiscount": "",
                        "CashDiscount": "",
                        "LiftingDiscount": "",
                        "SpecialDiscount": "",
                        "OtherDiscount": "",
                        "CreditNoteNo": "",
                        "ButtonReject": false,
                        "ButtonGenerate": false
                    }
                    aTableArr.push(obj12);
                    TableModel.setProperty("/aTableItem", aTableArr);
                    this.getView().getModel("oRejectButtonModel").setProperty("/RejectButton", false)
                }
            },


            GeneralDiscountvalueChange: function () {
                var aTableArr = this.getView().getModel("oTableItemModel").getProperty("/aTableItem");
                var BookingQuantity = this.getView().byId("BookingQuantity").getValue();
                for (var i = 0; i < aTableArr.length; i++) {
                    if (Number(TotalQuantity) == Number(BookingQuantity)) {
                        aTableArr[i].GeneralDiscount = item.Amount
                        aTableArr[i].TotalDiscount = item.Amount
                    }
                }
                this.getView().getModel("oTableItemModel").setProperty("/aTableItem", aTableArr)
            },
            addRow: function () {
                var oTableModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTableModel.getProperty("/aTableItem")

                var obj = {
                    "InvoiceDate": "",
                    "InvoiceNo": "",
                    "Material": "",
                    "Quantity": "",
                    "Rate": "",
                    "BillingAmount": "",
                    "GST": "",
                    "TotalDiscount": "",
                    "GeneralDiscount": "",
                    "CashDiscount": "",
                    "LiftingDiscount": "",
                    "SpecialDiscount": "",
                    "OtherDiscount": "",
                    "CreditNoteNo": ""
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aTableItem", aTableArr)
            },


            GenerateNote: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZINVOICE_DATA")
                var oContext = oEvent.getSource().getBindingContext("oTableItemModel").getObject();
                var invoice = oContext.InvoiceNo;
                var rate = Number(oContext.Rate);
                var circularnumber = oContext.CircularNo
                var TotalDiscount = Number(oContext.TotalDiscount)
                // var TotalAmount = Number(generaldiscount) + Number(cashdiscount) + Number(liftingdiscount) + Number(specialdiscount) + Number(otherdiscount)

                var invoicedate = oContext.InvoiceDate
                var oDate = new Date(invoicedate)
                var invoicedate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                var invoicedate2 = invoicedate1.toISOString().slice(0, 10);

                var oFilter = new sap.ui.model.Filter("BillingDocument", "EQ", invoice)
                if (oContext.CreditNoteNo === "" || oContext.CreditNoteNo === undefined || oContext.CreditNoteNo === "X") {
                    oModel.read("/Ycds_invoice_data", {
                        filters: [oFilter],
                        success: function (oresponse) {
                            if (oContext.CreditNoteNo === "X") {
                                MessageBox.error("Invoice has already been rejected.")
                            } else if (oContext.CreditNoteNo != "X" && oContext.CreditNoteNo != "") {
                                MessageBox.error("Invoice has already been generated.")
                            } else if (oContext.CreditNoteNo === "") {
                                if (oresponse.results[0].rejectqty === "") {
                                    if (TotalDiscount > rate) {
                                        MessageBox.error("Total amount cannot be greater than Rate")
                                    } else {
                                        var oBusyDialog = new sap.m.BusyDialog({
                                            title: "Generating Credit Note",
                                            text: "Please wait"
                                        });
                                        oBusyDialog.open();
                                        var oTableModel = this.getView().getModel("oTableItemModel")
                                        var aTableArr = oTableModel.getProperty("/aTableItem")

                                        var url = "/sap/bc/http/sap/zqty_discount_md";

                                        $.ajax({
                                            type: "post",
                                            url: url,
                                            data: JSON.stringify({
                                                "BillingDocumentItem": oContext.BillingDocumentItem,
                                                "InvoiceDate": invoicedate2,
                                                "CircularNumber": circularnumber,
                                                "SalesGroup": oContext.SalesGroup,
                                                "Invoice": invoice,
                                                "Material": oContext.Material,
                                                "Quantity": oContext.Quantity,
                                                "Rate": oContext.Rate,
                                                "BillingAmount": oContext.BillingAmount,
                                                "GST": oContext.GST,
                                                "GeneralDiscount": "0",
                                                "CashDiscount": "0",
                                                "LiftingDiscount": "0",
                                                "SpecialDiscount": "0",
                                                "OtherDiscount": "0",
                                                "TotalAmount": TotalDiscount,
                                                "CreditNoteNo": oContext.CreditNoteNo,
                                                "District": oContext.District

                                            }),
                                            contentType: "application/json; charset=utf-8",
                                            traditional: true,
                                            success: function (oresponse) {
                                                var message = oresponse.split('MESSAGE')
                                                if (message[0].includes("S")) {
                                                    var message1 = oresponse.split('DOCUMENT')
                                                    var obj = message1[1].replace(/"[:}]/g, '')
                                                    var obj1 = obj.split(",")
                                                    var obj2 = obj1[0].replace(/["']/g, "")
                                                    MessageBox.success("Document No. " + obj2)
                                                } else if (message[0].includes("E")) {
                                                    var message = oresponse.split('MESSAGE')
                                                    var obj = message[1].replace(/"[:}]/g, '')
                                                    MessageBox.error("Error: " + obj)
                                                }

                                                oBusyDialog.close();

                                                aTableArr.map(function (items) {
                                                    if (items.InvoiceNo === oContext.InvoiceNo && items.Material === oContext.Material && items.BillingDocumentItem === oContext.BillingDocumentItem) {
                                                        items.CreditNoteNo = obj2
                                                    }
                                                })

                                                var arr = [];
                                                oTableModel.setProperty("/aTableItem", arr)
                                                oTableModel.setProperty("/aTableItem", aTableArr)

                                            }.bind(this),
                                            error: function () {

                                            }
                                        })
                                    }
                                } else {
                                    MessageBox.error("Invoice has already been rejected.")
                                }
                            }
                        }.bind(this)
                    })
                } else {
                    MessageBox.error("Credit Note has already been generated")
                }

            },

            RejectNote: function (oEvent) {
                this.sPath = oEvent.getSource().getBindingContext("oTableItemModel").getObject();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZINVOICE_DATA")
                var oContext = oEvent.getSource().getBindingContext("oTableItemModel").getObject();
                var invoice = oContext.InvoiceNo;
                var oFilter = new sap.ui.model.Filter("BillingDocument", "EQ", invoice)

                if (this.sPath.CreditNoteNo === "" || oContext.CreditNoteNo != undefined) {
                    oModel.read("/Ycds_invoice_data", {
                        filters: [oFilter],
                        success: function (oresponse) {
                            if (oContext.CreditNoteNo != "" && oContext.CreditNoteNo != undefined) {
                                MessageBox.error("Invoice has already been generated can't be rejected.");
                            } else if (oContext.CreditNoteNo === "" || oContext.CreditNoteNo === undefined) {
                                if (oresponse.results[0].rejectqty === "") {
                                    MessageBox.confirm("Are you sure you want to reject?", {
                                        onClose: function (oAction) {
                                            if (oAction === MessageBox.Action.OK) {
                                                var oBusyDialog = new sap.m.BusyDialog({
                                                    title: "Rejecting",
                                                    text: "Please wait"
                                                });
                                                oBusyDialog.open();
                                                var oContext = this.sPath;
                                                var invoice = oContext.InvoiceNo;
                                                var circularnumber = oContext.CircularNo
                                                var generaldiscount = oContext.GeneralDiscount
                                                var cashdiscount = oContext.CashDiscount
                                                var liftingdiscount = oContext.LiftingDiscount
                                                var specialdiscount = oContext.SpecialDiscount
                                                var otherdiscount = oContext.OtherDiscount
                                                var lineitem = oContext.BillingDocumentItem
                                                var TotalAmount = oContext.TotalDiscount
                                                // var TotalAmount = Number(generaldiscount) + Number(cashdiscount) + Number(liftingdiscount) + Number(specialdiscount) + Number(otherdiscount)

                                                var url = "/sap/bc/http/sap/zqty_discount_md";

                                                var oTableModel = this.getView().getModel("oTableItemModel")
                                                var aTableArr = oTableModel.getProperty("/aTableItem")

                                                $.ajax({
                                                    type: "post",
                                                    url: url,
                                                    data: JSON.stringify({
                                                        "Invoice": invoice,
                                                        "CircularNumber": circularnumber,
                                                        "TotalAmount": TotalAmount,
                                                        "Reject": "X",
                                                        "BillingDocumentItem": lineitem,
                                                    }),
                                                    contentType: "application/json; charset=utf-8",
                                                    traditional: true,
                                                    success: function (oresponse) {
                                                        var message = oresponse.split(',')
                                                        if (message[0].includes("S")) {
                                                            var obj1 = message[2].split(":")
                                                            obj1 = obj1[1]
                                                            var obj2 = obj1.replace(/"/g, '')
                                                            MessageBox.success(obj2)
                                                        }
                                                        oBusyDialog.close();

                                                        aTableArr.map(function (items) {
                                                            if (items.InvoiceNo === oContext.InvoiceNo && items.Material === oContext.Material && items.BillingDocumentItem === oContext.BillingDocumentItem) {
                                                                items.CreditNoteNo = "X"
                                                            }
                                                        })

                                                        var arr = [];
                                                        oTableModel.setProperty("/aTableItem", arr)
                                                        oTableModel.setProperty("/aTableItem", aTableArr)

                                                    }.bind(this),
                                                    error: function () {
                                                        oBusyDialog.close();
                                                    }
                                                })
                                            }
                                        }.bind(this)
                                    })
                                } else {
                                    MessageBox.error("Invoice has already been rejected.")
                                }
                            }

                        }.bind(this)
                    })
                } else {
                    MessageBox.error("Credit note has already been generated")
                }
            }
        });
    });