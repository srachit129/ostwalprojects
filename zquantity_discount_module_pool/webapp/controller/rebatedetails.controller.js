sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, FilterOperator, MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("zquantitydiscountmodulepool.controller.rebatedetails", {
            onInit: function () {

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "ReturnQuantityModel")
                var oModel10 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZRETURN_QTY_BINDING")
                oModel10.read("/Returnquantity", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("ReturnQuantityModel").setProperty("/ReturnQuantityData", oresponse.results)
                    }.bind(this)
                })

                UIComponent.getRouterFor(this).getRoute("rebatedetails").attachPatternMatched(this._CallEntityData, this)
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableItemModel")
                this.getView().getModel("oTableItemModel").setProperty("/aTableItem", [])

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oRejectButtonModel")
                this.getView().getModel("oRejectButtonModel").setProperty("/RejectButton", true)


                UIComponent.getRouterFor(this).getRoute("rebatedetails").attachPatternMatched(this._onRouteMatch1, this)
                UIComponent.getRouterFor(this).getRoute("rebatedetails").attachPatternMatched(this._oncalculateGD, this)
                // UIComponent.getRouterFor(this).getRoute("rebatedetails").attachPatternMatched(this.GeneralDiscountvalueChange, this)

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

            _onRouteMatch1: function () {
                var QuantDiscValidData = this.getOwnerComponent().getModel("QuantDiscValid").getProperty("/aQuantDisc")
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZINVOICE_DATA")
                var InvoiceData = this.getOwnerComponent().getModel("oInvoiceObject").getProperty("/aInvoiceData")
                var returnqty = this.getOwnerComponent().getModel("ReturnQuantityModel").getProperty("/ReturnQuantityData")
                var circularNum = InvoiceData.CircularNumber;
                var customerCode = InvoiceData.customerCode;
                var materialpricinggroup = InvoiceData.materialpricinggroup;
                var oFilter = new sap.ui.model.Filter("Circularnumber", "EQ", circularNum)
                var oFilter1 = new sap.ui.model.Filter("BILLTOPARTY", "EQ", customerCode)

                var arr = [];
                QuantDiscValidData.map(function (data) {
                    if (data.Circularnumber === circularNum) {
                        arr.push(data)
                    }
                })

                var oTableModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTableModel.getProperty("/aTableItem")

                if (aTableArr.length > 0) {
                    var aTableArr = []
                    oTableModel.setProperty("/aTableItem", aTableArr)

                    oModel.read("/Ycds_invoice_data", {
                        filters: [oFilter1],
                        urlParameters: {
                            "$top": "5000"
                        },
                        success: function (oresponse) {
                            oresponse.results.map(function (item) {
                                if (item.Qty_Flag_save != "X") {
                                    var BillingDocumentDate = new Date(item.BillingDocumentDate)
                                    var BillingDocumentDate1 = new Date(BillingDocumentDate.getTime() - BillingDocumentDate.getTimezoneOffset() * 60000);
                                    var BillingDocumentDate2 = BillingDocumentDate1.toISOString().slice(0, 16);

                                    var invoicedate = item.BillingDocumentDate
                                    var oDate = new Date(invoicedate)
                                    var dt = Number(oDate.getDate());
                                    var Dt = dt < 10 ? "0" + dt : dt;
                                    var mm = Number(oDate.getMonth() + 1);
                                    var MM = mm < 10 ? "0" + mm : mm;

                                    arr.map(function (items) {
                                        var FromDate = items.DisValdFom;
                                        var dt = new Date(FromDate);
                                        var fdt = Number(dt.getDate());
                                        var FDt = fdt < 10 ? "0" + fdt : fdt;
                                        var mm = Number(dt.getMonth() + 1);
                                        var MM = mm < 10 ? "0" + mm : mm;

                                        var ToDate = items.DisValidTo;
                                        var dt1 = new Date(ToDate);
                                        var tdt = Number(dt1.getDate());
                                        var TDt = tdt < 10 ? "0" + tdt : tdt;
                                        var mm1 = Number(dt1.getMonth() + 1);
                                        var MM1 = mm1 < 10 ? "0" + mm1 : mm1;

                                        var FromDt = dt.getFullYear() + '-' + MM + '-' + FDt
                                        var ToDt = dt1.getFullYear() + '-' + MM1 + '-' + TDt


                                        if (BillingDocumentDate >= FromDate && BillingDocumentDate <= ToDate && materialpricinggroup == item.MaterialPricingGroup) {
                                            var obj = {
                                                "BillingDocumentItem": item.BillingDocumentItem,
                                                "InvoiceDate": oDate.getFullYear() + '-' + MM + '-' + Dt,
                                                "BILLTOPARTY": item.BILLTOPARTY,
                                                "CustomerName": item.CustomerName,
                                                "InvoiceNo": item.BillingDocument,
                                                "CircularNo": item.CR_no,
                                                "Material": item.Material,
                                                "District": item.DistrictName,
                                                "SalesGroup": item.SalesGroup,
                                                "Quantity": item.BillingQuantity,
                                                "ReturnQuantity": "",
                                                "ActualQuantity": item.GIV_Amount,
                                                "Amount": "",
                                                "Rate": parseFloat(item.BASICRATE).toFixed(2),
                                                "BillingAmount": parseFloat(item.GIV_Amount).toFixed(2),
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

                                        aTableArr.map(function (items) {
                                            returnqty.map(function (item) {
                                                if (items.InvoiceNo === item.ReferenceSDDocument) {
                                                    items.ReturnQuantity = item.OrderQuantity
                                                    items.ActualQuantity = parseFloat(Number(items.Quantity) - Number(item.OrderQuantity)).toFixed(3)
                                                } else {
                                                    items.ActualQuantity = parseFloat(Number(items.Quantity) - Number(items.ReturnQuantity)).toFixed(3)
                                                    items.ReturnQuantity = "0.000"
                                                }
                                            })
                                        })

                                        oTableModel.setProperty("/aTableItem", aTableArr)
                                    }.bind(this))
                                }
                            }.bind(this))
                            this.Quantity_TotelingFun();
                        }.bind(this)
                    })
                } else {
                    oModel.read("/Ycds_invoice_data", {
                        filters: [oFilter1],
                        urlParameters: {
                            "$top": "5000"
                        },
                        success: function (oresponse) {
                            oresponse.results.map(function (item) {
                                if (item.Qty_Flag_save != "X") {
                                    var BillingDocumentDate = new Date(item.BillingDocumentDate)
                                    var BillingDocumentDate1 = new Date(BillingDocumentDate.getTime() - BillingDocumentDate.getTimezoneOffset() * 60000);
                                    var BillingDocumentDate2 = BillingDocumentDate1.toISOString().slice(0, 16);

                                    var invoicedate = item.BillingDocumentDate
                                    var oDate = new Date(invoicedate)
                                    var dt = Number(oDate.getDate());
                                    var Dt = dt < 10 ? "0" + dt : dt;
                                    var mm = Number(oDate.getMonth() + 1);
                                    var MM = mm < 10 ? "0" + mm : mm;

                                    arr.map(function (items) {
                                        var FromDate = items.DisValdFom;
                                        var dt = new Date(FromDate);
                                        var fdt = Number(dt.getDate());
                                        var FDt = fdt < 10 ? "0" + fdt : fdt;
                                        var mm = Number(dt.getMonth() + 1);
                                        var MM = mm < 10 ? "0" + mm : mm;

                                        var ToDate = items.DisValidTo;
                                        var dt1 = new Date(ToDate);
                                        var tdt = Number(dt1.getDate());
                                        var TDt = tdt < 10 ? "0" + tdt : tdt;
                                        var mm1 = Number(dt1.getMonth() + 1);
                                        var MM1 = mm1 < 10 ? "0" + mm1 : mm1;

                                        var FromDt = dt.getFullYear() + '-' + MM + '-' + FDt
                                        var ToDt = dt1.getFullYear() + '-' + MM1 + '-' + TDt


                                        if (BillingDocumentDate >= FromDate && BillingDocumentDate <= ToDate && materialpricinggroup == item.MaterialPricingGroup) {
                                            var obj = {
                                                "BillingDocumentItem": item.BillingDocumentItem,
                                                "InvoiceDate": oDate.getFullYear() + '-' + MM + '-' + Dt,
                                                "BILLTOPARTY": item.BILLTOPARTY,
                                                "CustomerName": item.CustomerName,
                                                "InvoiceNo": item.BillingDocument,
                                                "CircularNo": item.CR_no,
                                                "Material": item.Material,
                                                "District": item.DistrictName,
                                                "SalesGroup": item.SalesGroup,
                                                "Quantity": item.BillingQuantity,
                                                "ReturnQuantity": "",
                                                "ActualQuantity": "",
                                                "Amount": "",
                                                "Rate": parseFloat(item.BASICRATE).toFixed(2),
                                                "BillingAmount": parseFloat(item.GIV_Amount).toFixed(2),
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

                                        aTableArr.map(function (items) {
                                            returnqty.map(function (item) {
                                                if (items.InvoiceNo === item.ReferenceSDDocument) {
                                                    items.ReturnQuantity = item.OrderQuantity
                                                    items.ActualQuantity = parseFloat(Number(items.Quantity) - Number(item.OrderQuantity)).toFixed(3)
                                                } else {
                                                    items.ActualQuantity = parseFloat(Number(items.Quantity) - Number(items.ReturnQuantity)).toFixed(3)
                                                    items.ReturnQuantity = "0.000"
                                                }
                                            })
                                        })

                                        oTableModel.setProperty("/aTableItem", aTableArr)
                                    }.bind(this))
                                }
                            }.bind(this))
                            this.Quantity_TotelingFun();
                        }.bind(this)
                    })
                }


            },

            _onRouteMatch: function () {
                setTimeout(function () {
                    var TableModel = this.getView().getModel("oTableItemModel").getProperty("/aTableItem")
                    var returnqty = this.getView().getModel("ReturnQuantityModel").getProperty("/ReturnQuantityData")
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
                                                var obj = {
                                                    "BillingDocumentItem": items.BillingDocumentItem,
                                                    "InvoiceDate": oDate.getFullYear() + '-' + MM + '-' + Dt,
                                                    "CircularNo": items.CR_no,
                                                    "InvoiceNo": items.BillingDocument,
                                                    "SalesGroup": items.SalesGroup,
                                                    "District": items.DistrictName,
                                                    "Material": items.Material,
                                                    "Quantity": items.BillingQuantity,
                                                    "ReturnQuantity": "",
                                                    "ActualQuantity": "",
                                                    "Amount": "",
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
                                    })

                                    aTableArr.map(function (items) {
                                        returnqty.map(function (item) {
                                            if (items.InvoiceNo === item.ReferenceSDDocument) {
                                                items.ReturnQuantity = item.OrderQuantity
                                                items.ActualQuantity = parseFloat(Number(items.Quantity) - Number(item.OrderQuantity)).toFixed(3)
                                            } else {
                                                items.ActualQuantity = parseFloat(Number(items.Quantity) - Number(items.ReturnQuantity)).toFixed(3)
                                                items.ReturnQuantity = "0.000"
                                            }
                                        })
                                    })

                                    oTableModel.setProperty("/aTableItem", aTableArr)
                                    this.Quantity_TotelingFun();
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
                                urlParameters: {
                                    "$top": "5000"
                                },
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
                                                    "ReturnQuantity": "",
                                                    "ActualQuantity": "",
                                                    "Amount": "",
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

                                    aTableArr.map(function (items) {
                                        returnqty.map(function (item) {
                                            if (items.InvoiceNo === item.ReferenceSDDocument) {
                                                items.ReturnQuantity = item.OrderQuantity
                                                items.ActualQuantity = parseFloat(Number(items.Quantity) - Number(item.OrderQuantity)).toFixed(3)
                                            } else {
                                                items.ActualQuantity = parseFloat(Number(items.Quantity) - Number(items.ReturnQuantity)).toFixed(3)
                                                items.ReturnQuantity = "0.000"
                                            }
                                        })
                                    })

                                    oTableModel.setProperty("/aTableItem", aTableArr)
                                    this.Quantity_TotelingFun();
                                    // this.GeneralDiscountvalueChange();
                                }.bind(this)
                            })
                        }
                    }
                }.bind(this), 1500)
            },

            SpecialDiscount: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext("oTableItemModel").getObject();
                var quantitydiscount = Number(oContext.GeneralDiscount);
                var otherdiscount = Number(oContext.OtherDiscount)

                var specialdiscount = quantitydiscount + otherdiscount + Number(oEvent.getSource().getBindingContext("oTableItemModel").getObject().SpecialDiscount)
                oEvent.getSource().getBindingContext("oTableItemModel").getObject().TotalDiscount = specialdiscount
                oEvent.getSource().getBindingContext("oTableItemModel").getObject().Amount = oEvent.getSource().getBindingContext("oTableItemModel").getObject().ActualQuantity * oEvent.getSource().getBindingContext("oTableItemModel").getObject().TotalDiscount
            },

            OtherDiscount: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext("oTableItemModel").getObject();
                var quantitydiscount = Number(oContext.GeneralDiscount);
                var specialdiscount = Number(oContext.SpecialDiscount)

                var otherdiscount = quantitydiscount + specialdiscount + Number(oEvent.getSource().getBindingContext("oTableItemModel").getObject().OtherDiscount)
                oEvent.getSource().getBindingContext("oTableItemModel").getObject().TotalDiscount = otherdiscount
                oEvent.getSource().getBindingContext("oTableItemModel").getObject().Amount = oEvent.getSource().getBindingContext("oTableItemModel").getObject().ActualQuantity * oEvent.getSource().getBindingContext("oTableItemModel").getObject().TotalDiscount
            },

            Quantity_TotelingFun: function () {
                var TableModel = this.getView().getModel("oTableItemModel");
                var aTableArr = TableModel.getProperty("/aTableItem");
                var TableData = this.getView().getModel("oTableItemModel").getProperty("/aTableItem");
                if (aTableArr.length != 0) {

                    var aNewArrForQuantity = [];


                    for (var i = 0; i < aTableArr.length; i++) {
                        aNewArrForQuantity.push(parseFloat(TableData[i].ActualQuantity));
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
                        "Quantity": "",
                        "Rate": "",
                        "BillingAmount": "",
                        "ReturnQuantity": "",
                        "ActualQuantity": TotalQuantity,
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
                var GeneralDiscountvalue = this.getView().getModel("oTableItemModel").getProperty("/aTableItem");
                var InvoiceData = this.getOwnerComponent().getModel("oInvoiceObject").getProperty("/aInvoiceData")
                var circularNum = InvoiceData.CircularNumber;
                var customerCode = InvoiceData.customerCode;
                var invoiceNo = InvoiceData.invoiceNo;
                var invoiceDateFrom = InvoiceData.invoiceDateFrom;
                var materialpricinggroup = InvoiceData.materialpricinggroup;
                var oTableModel = this.getView().getModel("oTableItemModel");
                var aTableArr = oTableModel.getProperty("/aTableItem");
                var Length = GeneralDiscountvalue.length;
                var len = Length - 1;
                var TotalQuantity = GeneralDiscountvalue[len].ActualQuantity;
                var amountArr = [];
                var QuantityDiscountData2 = this.getView().getModel("oQuantityDiscTmgModel").getProperty("/oQuantityDiscTmgData");

                for (var i = 0; i < len; i++) {
                    QuantityDiscountData2.map(function (item) {
                        if (Number(TotalQuantity) >= Number(item.QuantitySlabFrom) && Number(TotalQuantity) <= Number(item.QuantitySlabTo) && materialpricinggroup == item.Materialpricinggroup) {
                            aTableArr[i].GeneralDiscount = item.Amount
                            aTableArr[i].TotalDiscount = item.Amount
                            aTableArr[i].Amount = aTableArr[i].ActualQuantity * aTableArr[i].TotalDiscount
                        }
                    })
                }

                oTableModel.setProperty("/aTableItem", aTableArr)

                // for (var i = 0; i < len; i++) {
                //     QuantityDiscountData2.map(function (items) {
                //         if (items.QuantitySlabFrom <= TotalQuantity && items.QuantitySlabTo >= TotalQuantity) {
                //             amountArr.push(items.Amount);
                //         }
                //     })
                //     var amount = amountArr[0];
                //     GeneralDiscountvalue[i].GeneralDiscount = amount; // Change 'New Value' to the desired new value
                //     GeneralDiscountvalue[i].TotalDiscount = amount; // Change 'New Value' to the desired new value
                // }
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
            },

            onSave: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Saving",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oTabelItemDataModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTabelItemDataModel.getProperty("/aTableItem")
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQTY_DIS_IN_NO")

                // aTableArr.map(function (items) {
                //     var oFilter = new sap.ui.model.Filter("InvItem", "EQ", items.BillingDocumentItem)
                //     var oFilter1 = new sap.ui.model.Filter("OldInv", "EQ", items.InvoiceNo)

                //     var invoiceDate = items.InvoiceDate
                //     var oDate = new Date(invoiceDate);
                //     var invoiceDate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                //     var invoiceDate2 = invoiceDate1.toISOString().slice(0, 16);

                //     var obj = {
                //         "InvItem": items.BillingDocumentItem,
                //         "Invoicedate": invoiceDate2,
                //         "Customer": items.BILLTOPARTY,
                //         "Customername": items.CustomerName,
                //         "Circularno": items.CircularNo,
                //         "Salesgroup": items.SalesGroup,
                //         "District": items.District,
                //         "OldInv": items.InvoiceNo,
                //         "Material": items.Material,
                //         "Quantity": items.Quantity,
                //         "Rate": items.Rate,
                //         "Billingamount": items.BillingAmount,
                //         // "Gst": items.GST,
                //         "Generaldiscount": items.GeneralDiscount === "" ? "0.00" : items.GeneralDiscount,
                //         "Cashdiscount": items.CashDiscount === "" ? "0.00" : items.CashDiscount,
                //         "Liftingdiscount": items.LiftingDiscount === "" ? "0.00" : items.LiftingDiscount,
                //         "Pricedifference": items.PriceDifference === "" ? "0.00" : items.PriceDifference,
                //         "Specialdiscount": items.SpecialDiscount === "" ? "0.00" : items.SpecialDiscount,
                //         "Otherdiscount": items.OtherDiscount === "" ? "0.00" : items.OtherDiscount,
                //         "TotalAmount": items.TotalAmount === "" ? "0.00" : items.TotalAmount,
                //         "CreditMemo": items.CreditNoteNo

                //     }

                //     oModel.read("/ZCREATED_IN_NO1_PRJ", {
                //         filters: [oFilter, oFilter1],
                //         success: function (oresponse) {
                //             if (oresponse.results.length > 0) {
                //                 oModel.update("/ZCREATED_IN_NO1_PRJ(OldInv='" + items.InvoiceNo + "',InvItem='" + items.BillingDocumentItem + "')", obj, {
                //                     success: function () {
                //                         oBusyDialog.close();
                //                     }.bind(this),
                //                     error: function () {
                //                         oBusyDialog.close();
                //                     }
                //                 })
                //             } else {
                //                 oModel.create("/ZCREATED_IN_NO1_PRJ", obj, {
                //                     success: function (oresponse) {
                //                         oBusyDialog.close();
                //                     }.bind(this),
                //                     error: function () {
                //                         oBusyDialog.close();
                //                     }
                //                 })
                //             }
                //         }.bind(this),
                //         error: function () {
                //             oBusyDialog.close();
                //         }
                //     })
                // })

                var result = [];
                // var map = new Map();

                // for (var item of aTableArr) {
                //     if (!map.has(item.InvoiceNo && item.BillingDocumentItem)) {
                //         map.set(item.InvoiceNo && item.BillingDocumentItem, true)
                //         result.push(item)
                //     }
                // }

                MessageBox.confirm("Are you sure you want to save?", {
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            for (var i = 0; i < aTableArr.length - 1; i++) {
                                if (aTableArr[i].InvoiceNo === aTableArr[i + 1].InvoiceNo && aTableArr[i].BillingDocumentItem === aTableArr[i + 1].BillingDocumentItem) {
                                    delete aTableArr[i]
                                }
                            }

                            delete aTableArr[aTableArr.length - 1]

                            aTableArr.map(function (items) {
                                var invoiceDate = items.InvoiceDate
                                var oDate = new Date(invoiceDate);
                                var invoiceDate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                                var invoiceDate2 = invoiceDate1.toISOString().slice(0, 16);

                                var oFilter = new sap.ui.model.Filter("InvItem", "EQ", items.BillingDocumentItem)
                                var oFilter1 = new sap.ui.model.Filter("OldInv", "EQ", items.InvoiceNo)
                                var oFilter2 = new sap.ui.model.Filter("Material", "EQ", items.Material)
                                var oFilter3 = new sap.ui.model.Filter("Customer", "EQ", items.BILLTOPARTY)

                                var obj = {
                                    "InvItem": items.BillingDocumentItem,
                                    "Invoicedate": invoiceDate2,
                                    "Customercode": items.BILLTOPARTY,
                                    "Customername": items.CustomerName,
                                    "OldInv": items.InvoiceNo,
                                    "Circularno": items.CircularNo,
                                    "Material": items.Material,
                                    "District": items.District,
                                    "Salesgroup": items.SalesGroup,
                                    "Quantity": items.Quantity,
                                    "Returnquantity": items.ReturnQuantity === "" ? "0.00" : parseFloat(items.ReturnQuantity).toFixed(0),
                                    "Actualquantity": items.ActualQuantity === "" ? "0.00" : parseFloat(items.ActualQuantity).toFixed(0),
                                    "Totalamount": items.Amount === "" ? "0.00" : parseFloat(items.Amount).toFixed(0),
                                    "Rate": parseFloat(items.Rate).toFixed(2),
                                    "Billingamount": items.BillingAmount === "" ? "0.00" : parseFloat(items.BillingAmount).toFixed(0),
                                    "Gst": items.GST === "" ? "0.00" : parseFloat(items.GST).toFixed(0),
                                    "Quantitydiscount": items.GeneralDiscount === "" ? "0.00" : parseFloat(items.GeneralDiscount).toFixed(0),
                                    "Specialdiscount": items.SpecialDiscount === "" ? "0.00" : parseFloat(items.SpecialDiscount).toFixed(0),
                                    "Otherdiscount": items.OtherDiscount === "" ? "0.00" : parseFloat(items.OtherDiscount).toFixed(0),
                                    "Totaldiscount": items.TotalDiscount === "" ? "0.00" : parseFloat(items.TotalDiscount).toFixed(0),
                                    "Invsave": "X"
                                }

                                oModel.read("/ZQTY_DIS_IN_NO_PJ", {
                                    filters: [oFilter, oFilter1],
                                    success: function (oresponse) {
                                        if (oresponse.results.length > 0) {
                                            oModel.update("/ZQTY_DIS_IN_NO_PJ(OldInv='" + items.InvoiceNo + "',InvItem='" + items.BillingDocumentItem + "')", obj, {
                                                success: function () {
                                                    oBusyDialog.close();
                                                    MessageToast.show("Data updated")
                                                    var aTableArr = []
                                                    oTabelItemDataModel.setProperty("/aTableItem", aTableArr)
                                                }.bind(this),
                                                error: function () {
                                                    oBusyDialog.close();
                                                }
                                            })
                                        } else {
                                            oModel.create("/ZQTY_DIS_IN_NO_PJ", obj, {
                                                success: function (oresponse) {
                                                    oBusyDialog.close();
                                                    MessageToast.show("Data saved")
                                                    var aTableArr = []
                                                    oTabelItemDataModel.setProperty("/aTableItem", aTableArr)
                                                }.bind(this),
                                                error: function () {
                                                    oBusyDialog.close();
                                                }
                                            })
                                        }
                                    }.bind(this),
                                    error: function () {
                                        oBusyDialog.close();
                                    }
                                })
                            })
                        } else {
                            oBusyDialog.close();
                        }
                    }.bind(this)
                })
            },

            saveSingle: function (oEvent) {
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();

                // if (aSelectedIndex.length === 0) {
                //     MessageBox.error("Please select the row before saving")
                // } else {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Saving",
                    text: "Please wait"
                });
                oBusyDialog.open();

                var oTableData = oEvent.getSource().getBindingContext("oTableItemModel").getObject();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQTY_DIS_IN_NO")
                var oFilter = new sap.ui.model.Filter("InvItem", "EQ", oTableData.BillingDocumentItem)
                var oFilter1 = new sap.ui.model.Filter("OldInv", "EQ", oTableData.InvoiceNo)
                var oFilter2 = new sap.ui.model.Filter("Material", "EQ", oTableData.Material)
                var oFilter3 = new sap.ui.model.Filter("Customer", "EQ", oTableData.BILLTOPARTY)
                var id = "";
                var path = ""
                var idx = ""

                var oTabelItemDataModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTabelItemDataModel.getProperty("/aTableItem")

                var invoiceDate = oTableData.InvoiceDate
                var oDate = new Date(invoiceDate);
                var invoiceDate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                var invoiceDate2 = invoiceDate1.toISOString().slice(0, 16);

                MessageBox.confirm("Are you sure you want to save?", {

                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            var obj = {
                                "InvItem": oTableData.BillingDocumentItem,
                                "Invoicedate": invoiceDate2,
                                "Customercode": oTableData.BILLTOPARTY,
                                "Customername": oTableData.CustomerName,
                                "OldInv": oTableData.InvoiceNo,
                                "Circularno": oTableData.CircularNo,
                                "Material": oTableData.Material,
                                "District": oTableData.District,
                                "Salesgroup": oTableData.SalesGroup,
                                "Quantity": oTableData.Quantity,
                                "Returnquantity": oTableData.ReturnQuantity === "" ? "0.00" : parseFloat(oTableData.ReturnQuantity).toFixed(0),
                                "Actualquantity": oTableData.ActualQuantity === "" ? "0.00" : parseFloat(oTableData.ActualQuantity).toFixed(0),
                                "Totalamount": oTableData.Amount === "" ? "0.00" : parseFloat(oTableData.Amount).toFixed(0),
                                "Rate": parseFloat(oTableData.Rate).toFixed(2),
                                "Billingamount": oTableData.BillingAmount === "" ? "0.00" : parseFloat(oTableData.BillingAmount).toFixed(0),
                                "Gst": oTableData.GST === "" ? "0.00" : parseFloat(oTableData.GST).toFixed(0),
                                "Quantitydiscount": oTableData.GeneralDiscount === "" ? "0.00" : parseFloat(oTableData.GeneralDiscount).toFixed(0),
                                "Specialdiscount": oTableData.SpecialDiscount === "" ? "0.00" : parseFloat(oTableData.SpecialDiscount).toFixed(0),
                                "Otherdiscount": oTableData.OtherDiscount === "" ? "0.00" : parseFloat(oTableData.OtherDiscount).toFixed(0),
                                "Totaldiscount": oTableData.TotalDiscount === "" ? "0.00" : parseFloat(oTableData.TotalDiscount).toFixed(0),
                                "Invsave": "X"
                            }
                            oModel.read("/ZQTY_DIS_IN_NO_PJ", {
                                filters: [oFilter, oFilter1],
                                success: function (oresponse) {
                                    if (oresponse.results.length > 0) {
                                        oModel.update("/ZQTY_DIS_IN_NO_PJ(OldInv='" + oTableData.InvoiceNo + "',InvItem='" + oTableData.BillingDocumentItem + "')", obj, {
                                            success: function () {
                                                var arr = [];
                                                oBusyDialog.close();
                                                MessageToast.show("Data updated")

                                                aTableArr.map(function (items) {
                                                    if (items.InvoiceNo != oTableData.InvoiceNo) {
                                                        arr.push(items)
                                                    }
                                                })

                                                oTabelItemDataModel.setProperty("/aTableItem", arr)
                                            }.bind(this),
                                            error: function () {
                                                oBusyDialog.close();
                                            }
                                        })
                                    } else {
                                        oModel.create("/ZQTY_DIS_IN_NO_PJ", obj, {
                                            success: function (oresponse) {
                                                var arr = [];
                                                oBusyDialog.close();
                                                MessageToast.show("Data saved")

                                                aTableArr.map(function (items) {
                                                    if (items.InvoiceNo != oTableData.InvoiceNo) {
                                                        arr.push(items)
                                                    }
                                                })

                                                oTabelItemDataModel.setProperty("/aTableItem", arr)

                                            }.bind(this),
                                            error: function () {
                                                oBusyDialog.close();
                                            }
                                        })
                                    }
                                }.bind(this),
                                error: function () {
                                    oBusyDialog.close();
                                }
                            })
                        } else {
                            oBusyDialog.close();
                        }
                    }.bind(this)
                })

                // }

            },

            rejectSingle: function (oEvent) {
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();

                // if (aSelectedIndex.length === 0) {
                //     MessageBox.error("Please select the row before saving")
                // } else {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Saving",
                    text: "Please wait"
                });
                oBusyDialog.open();

                var oTableData = oEvent.getSource().getBindingContext("oTableItemModel").getObject();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQTY_DIS_IN_NO")
                var oFilter = new sap.ui.model.Filter("InvItem", "EQ", oTableData.BillingDocumentItem)
                var oFilter1 = new sap.ui.model.Filter("OldInv", "EQ", oTableData.InvoiceNo)
                var oFilter2 = new sap.ui.model.Filter("Material", "EQ", oTableData.Material)
                var oFilter3 = new sap.ui.model.Filter("Customer", "EQ", oTableData.BILLTOPARTY)
                var id = "";
                var path = ""
                var idx = ""

                var oTabelItemDataModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTabelItemDataModel.getProperty("/aTableItem")

                var invoiceDate = oTableData.InvoiceDate
                var oDate = new Date(invoiceDate);
                var invoiceDate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                var invoiceDate2 = invoiceDate1.toISOString().slice(0, 16);

                MessageBox.confirm("Are you sure you want to save?", {

                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            var obj = {
                                "InvItem": oTableData.BillingDocumentItem,
                                "Invoicedate": invoiceDate2,
                                "Customercode": oTableData.BILLTOPARTY,
                                "Customername": oTableData.CustomerName,
                                "OldInv": oTableData.InvoiceNo,
                                "Circularno": oTableData.CircularNo,
                                "Material": oTableData.Material,
                                "District": oTableData.District,
                                "Salesgroup": oTableData.SalesGroup,
                                "Quantity": oTableData.Quantity,
                                "Returnquantity": oTableData.ReturnQuantity === "" ? "0.00" : parseFloat(oTableData.ReturnQuantity).toFixed(0),
                                "Actualquantity": oTableData.ActualQuantity === "" ? "0.00" : parseFloat(oTableData.ActualQuantity).toFixed(0),
                                "Totalamount": oTableData.Amount === "" ? "0.00" : parseFloat(oTableData.Amount).toFixed(0),
                                "Rate": parseFloat(oTableData.Rate).toFixed(2),
                                "Billingamount": oTableData.BillingAmount === "" ? "0.00" : parseFloat(oTableData.BillingAmount).toFixed(0),
                                "Gst": oTableData.GST === "" ? "0.00" : parseFloat(oTableData.GST).toFixed(0),
                                "Quantitydiscount": oTableData.GeneralDiscount === "" ? "0.00" : parseFloat(oTableData.GeneralDiscount).toFixed(0),
                                "Specialdiscount": oTableData.SpecialDiscount === "" ? "0.00" : parseFloat(items.SpecialDiscount).toFixed(0),
                                "Otherdiscount": oTableData.OtherDiscount === "" ? "0.00" : parseFloat(items.OtherDiscount).toFixed(0),
                                "Totaldiscount": oTableData.TotalDiscount === "" ? "0.00" : parseFloat(oTableData.TotalDiscount).toFixed(0),
                                "Reject": "X"
                            }
                            oModel.read("/ZQTY_DIS_IN_NO_PJ", {
                                filters: [oFilter, oFilter1],
                                success: function (oresponse) {
                                    if (oresponse.results.length > 0) {
                                        oModel.update("/ZQTY_DIS_IN_NO_PJ(OldInv='" + oTableData.InvoiceNo + "',InvItem='" + oTableData.BillingDocumentItem + "')", obj, {
                                            success: function () {
                                                var arr = [];
                                                oBusyDialog.close();
                                                MessageToast.show("Data updated")

                                                aTableArr.map(function (items) {
                                                    if (items.InvoiceNo != oTableData.InvoiceNo) {
                                                        arr.push(items)
                                                    }
                                                })

                                                oTabelItemDataModel.setProperty("/aTableItem", arr)
                                            }.bind(this),
                                            error: function () {
                                                oBusyDialog.close();
                                            }
                                        })
                                    } else {
                                        oModel.create("/ZQTY_DIS_IN_NO_PJ", obj, {
                                            success: function (oresponse) {
                                                var arr = [];
                                                oBusyDialog.close();
                                                MessageToast.show("Data saved")

                                                aTableArr.map(function (items) {
                                                    if (items.InvoiceNo != oTableData.InvoiceNo) {
                                                        arr.push(items)
                                                    }
                                                })

                                                oTabelItemDataModel.setProperty("/aTableItem", arr)

                                            }.bind(this),
                                            error: function () {
                                                oBusyDialog.close();
                                            }
                                        })
                                    }
                                }.bind(this),
                                error: function () {
                                    oBusyDialog.close();
                                }
                            })
                        } else {
                            oBusyDialog.close();
                        }
                    }.bind(this)
                })

                // }

            }
        });
    });