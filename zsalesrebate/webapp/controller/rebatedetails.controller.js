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

        return Controller.extend("zsalesrebate.controller.rebatedetails", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableItemModel")
                this.getView().getModel("oTableItemModel").setProperty("/aTableItem", [])

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oGeneralDataModel")
                this.getView().getModel("oGeneralDataModel").setProperty("/aGeneralModelData", [])

                UIComponent.getRouterFor(this).getRoute("rebatedetails").attachPatternMatched(this._onRouteMatch, this)

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "GeneralDiscount")
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGD_SERVICE_BINDING")
                oModel.read("/GENERAL_DISCOUNT", {
                    success: function (oresponse) {
                        this.getView().getModel("GeneralDiscount").setProperty("/aGeneralData", oresponse.results)
                    }.bind(this)
                })

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "GeneralDiscountState")
                var oModel2 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGDT_STATE_BINDING")
                oModel2.read("/zgdt_state_prcds", {
                    success: function (oresponse) {
                        this.getView().getModel("GeneralDiscountState").setProperty("/aGeneralStateData", oresponse.results)
                    }.bind(this)
                })

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "LiftingDiscountModel")
                var oModel3 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLDT_CDS")
                oModel3.read("/Lifting_Discount", {
                    success: function (response) {
                        this.getView().getModel("LiftingDiscountModel").setProperty("/aLiftingData", response.results)
                    }.bind(this)
                })

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "CashDiscountModel")
                var oModel4 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZAPI_CASH_DIS")
                oModel4.read("/Cash_Discount", {
                    success: function (oresponse) {
                        this.getView().getModel("CashDiscountModel").setProperty("/aCashData", oresponse.results)
                    }.bind(this)
                })

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "PriceGroupModel")
                var oModel5 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YY1_MATERIALPRICEGROUP_CDS")
                oModel5.read("/YY1_MATERIALPRICEGROUP", {
                    success: function (oresponse) {
                        this.getView().getModel("PriceGroupModel").setProperty("/aMaterialGroup", oresponse.results)
                    }.bind(this)
                })

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "SalesGroupModel")
                var oModel6 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGD_SALES_GROUP")
                oModel6.read("/ZGD_SALES_GROUP_PRJ", {
                    success: function (oresponse) {
                        this.getView().getModel("SalesGroupModel").setProperty("/aSalesGroup", oresponse.results)
                    }.bind(this)
                })

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "PriceServiceModel")
                var oModel7 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPRICE_SERVICE_BINDING")
                oModel7.read("/ZPRC_DIFF_CDS", {
                    success: function (oresponse) {
                        this.getView().getModel("PriceServiceModel").setProperty("/aPriceModel", oresponse.results)
                    }.bind(this)
                })

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "LDInvoiceModel")
                var oModel8 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLFD_INV")
                oModel8.read("/ZLFD_CDS", {
                    success: function (oresponse) {
                        this.getView().getModel("LDInvoiceModel").setProperty("/aLiftingInvoiceData", oresponse.results)
                    }.bind(this)
                })

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "PriceDifferenceDistrictModel")
                var oModel9 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPRICEDEFF_BINDING")
                oModel9.read("/ZPRICEDEFF_CDS", {
                    success: function (oresponse) {
                        this.getView().getModel("PriceDifferenceDistrictModel").setProperty("/PriceDifferenceDistrictData", oresponse.results)
                    }.bind(this)
                })

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


            },

            // _oncalculateGD: function () {
            //     var oModel = this.getView().getModel();
            //     var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGD_SERVICE_BINDING")
            //     var InvoiceData = this.getOwnerComponent().getModel("oInvoiceObject").getProperty("/aInvoiceData")
            //     var customerCode = InvoiceData.customerCode;
            //     var oFilter = new sap.ui.model.Filter("BILLTOPARTY", "EQ", customerCode)
            //     var aNewArr = [];
            //     var aNewArr1 = [];
            //     var aNewArr2 = [];
            //     var obj = {
            //         "amount": ""
            //     }
            //     oModel.read("/Ycds_invoice_data", {
            //         filters: [oFilter],
            //         success: function (oresponse) {
            //             for (var i = 0; i < oresponse.results.length; i++) {
            //                 aNewArr.push(oresponse.results[i])
            //             }

            //             oModel1.read("/GENERAL_DISCOUNT", {
            //                 success: function (response) {
            //                     for (var i = 0; i < response.results.length; i++) {
            //                         aNewArr1.push(response.results[i])
            //                     }

            //                     aNewArr.map(function (items) {
            //                         var salesgroup = items.SalesGrp;
            //                         var circularnumber = items.CR_no;
            //                         var material = items.Material;
            //                         var district = items.SHIPTOCITY;
            //                         aNewArr1.map(function (item) {
            //                             if (salesgroup === item.SalesGrp && circularnumber === item.CircularNo && material === item.Material && district === item.District) {
            //                                 obj.amount = item.Amount
            //                             }
            //                         })
            //                     })
            //                     this.getView().getModel("amountValue").setProperty("/amount", obj.amount)
            //                 }.bind(this)
            //             })
            //         }.bind(this)
            //     })
            // },

            onReject: function (oEvent) {
                this.sPath = oEvent.getSource().getBindingContext("oTableItemModel").getObject();
                if (this.sPath.CreditNoteNo === "" || this.sPath.CreditNoteNo === undefined) {
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
                                var TotalAmount = Number(generaldiscount) + Number(cashdiscount) + Number(liftingdiscount) + Number(specialdiscount) + Number(otherdiscount)

                                var url = "/sap/bc/http/sap/zsalesorder_creation_bapi";

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
                    MessageBox.error("Invoice has already been rejected")
                }
            },

            SpecialDiscount: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext("oTableItemModel").getObject();
                var generaldiscount = Number(oContext.GeneralDiscount);
                var cashdiscount = Number(oContext.CashDiscount);
                var liftingdiscount = Number(oContext.LiftingDiscount);
                var otherdiscount = Number(oContext.OtherDiscount)
                var specialdiscount = generaldiscount + cashdiscount + liftingdiscount + otherdiscount + Number(oContext.PriceDifference) + Number(oEvent.getSource().getValue())
                oEvent.getSource().getBindingContext("oTableItemModel").getObject().TotalAmount = specialdiscount
                oEvent.getSource().getBindingContext("oTableItemModel").getObject().Amount = oEvent.getSource().getBindingContext("oTableItemModel").getObject().ActualQuantity * oEvent.getSource().getBindingContext("oTableItemModel").getObject().TotalAmount
            },

            OtherDiscount: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext("oTableItemModel").getObject();
                var generaldiscount = Number(oContext.GeneralDiscount);
                var cashdiscount = Number(oContext.CashDiscount);
                var liftingdiscount = Number(oContext.LiftingDiscount);
                var specialdiscount = Number(oContext.SpecialDiscount)
                var otherdiscount = generaldiscount + cashdiscount + liftingdiscount + specialdiscount + Number(oContext.PriceDifference) + Number(oEvent.getSource().getValue())
                oEvent.getSource().getBindingContext("oTableItemModel").getObject().TotalAmount = otherdiscount
                oEvent.getSource().getBindingContext("oTableItemModel").getObject().Amount = oEvent.getSource().getBindingContext("oTableItemModel").getObject().ActualQuantity * oEvent.getSource().getBindingContext("oTableItemModel").getObject().TotalAmount
            },

            onGenerate: function (oEvent) {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZINVOICE_DATA")
                var oContext = oEvent.getSource().getBindingContext("oTableItemModel").getObject();
                var invoice = oContext.InvoiceNo;
                var rate = Number(oContext.Rate);
                var circularnumber = oContext.CircularNo
                var generaldiscount = oContext.GeneralDiscount
                var cashdiscount = oContext.CashDiscount
                var liftingdiscount = oContext.LiftingDiscount
                var specialdiscount = oContext.SpecialDiscount
                var otherdiscount = oContext.OtherDiscount
                var TotalAmount = Number(generaldiscount) + Number(cashdiscount) + Number(liftingdiscount) + Number(specialdiscount) + Number(otherdiscount)

                var invoicedate = oContext.InvoiceDate
                var oDate = new Date(invoicedate)
                var invoicedate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                var invoicedate2 = invoicedate1.toISOString().slice(0, 10);

                var oFilter = new sap.ui.model.Filter("BillingDocument", "EQ", invoice)
                if (oContext.CreditNoteNo === "" || oContext.CreditNoteNo === undefined) {
                    oModel.read("/Ycds_invoice_data", {
                        filters: [oFilter],
                        success: function (oresponse) {
                            if (oresponse.results[0].reject === "") {
                                if (TotalAmount > rate) {
                                    MessageBox.error("Total amount cannot be greater than Rate")
                                } else if (TotalAmount === "" || TotalAmount === 0) {
                                    MessageBox.error("Total amount cannot be left empty")
                                } else {
                                    var oBusyDialog = new sap.m.BusyDialog({
                                        title: "Generating Credit Note",
                                        text: "Please wait"
                                    });
                                    oBusyDialog.open();
                                    var oTableModel = this.getView().getModel("oTableItemModel")
                                    var aTableArr = oTableModel.getProperty("/aTableItem")

                                    var url = "/sap/bc/http/sap/zsalesorder_creation_bapi";

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
                                            "GeneralDiscount": generaldiscount,
                                            "CashDiscount": cashdiscount,
                                            "LiftingDiscount": liftingdiscount,
                                            "SpecialDiscount": specialdiscount,
                                            "OtherDiscount": otherdiscount,
                                            "TotalAmount": TotalAmount,
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
                        }.bind(this)
                    })
                } else {
                    MessageBox.error("Credit Note has already been generated")
                }

            },

            onSave: function (oEvent) {
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();

                if (aSelectedIndex.length === 0) {
                    MessageBox.error("Please select atleast one line item.")
                } else {
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Saving",
                        text: "Please wait"
                    });
                    oBusyDialog.open();

                    var oTabelItemDataModel = this.getView().getModel("oTableItemModel")
                    var aTableArr = oTabelItemDataModel.getProperty("/aTableItem")
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCREATED_IN_NO")

                    var arr = []

                    for (var i = 0; i < aSelectedIndex.length; i++) {
                        arr.push(aTableArr[aSelectedIndex[i]])
                    }

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
                                // for (var i = 0; i < aTableArr.length - 1; i++) {
                                //     if (aTableArr[i].InvoiceNo === aTableArr[i + 1].InvoiceNo && aTableArr[i].BillingDocumentItem === aTableArr[i + 1].BillingDocumentItem) {
                                //         delete aTableArr[i]
                                //     }
                                // }

                                arr.map(function (items) {
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
                                        "Customer": items.BILLTOPARTY,
                                        "Customername": items.CustomerName,
                                        "Circularno": items.CircularNo,
                                        "Salesgroup": items.SalesGroup,
                                        "District": items.District,
                                        "OldInv": items.InvoiceNo,
                                        "Material": items.Material,
                                        "Quantity": items.Quantity,
                                        "ReturnQuantity": items.ReturnQuantity === "" ? "0.000" : parseFloat(items.ReturnQuantity).toFixed(3),
                                        "ActualQuantity": items.ActualQuantity === "" ? "0.000" : parseFloat(items.ActualQuantity).toFixed(3),
                                        "Rate": items.Rate,
                                        "Billingamount": items.BillingAmount,
                                        // "Gst": items.GST,
                                        "Generaldiscount": items.GeneralDiscount === "" ? "0.00" : items.GeneralDiscount,
                                        "Cashdiscount": items.CashDiscount === "" ? "0.00" : items.CashDiscount,
                                        "Liftingdiscount": items.LiftingDiscount === "" ? "0.00" : items.LiftingDiscount,
                                        "Pricedifference": items.PriceDifference === "" ? "0.00" : parseFloat(items.PriceDifference).toFixed(0),
                                        "Specialdiscount": items.SpecialDiscount === "" ? "0.00" : items.SpecialDiscount,
                                        "Otherdiscount": items.OtherDiscount === "" ? "0.00" : items.OtherDiscount,
                                        "Totalamountpmt": items.TotalAmount === "" ? "0.00" : parseFloat(items.TotalAmount).toFixed(0),
                                        "Totalamount": items.Amount === "" ? "0.00" : parseFloat(items.Amount).toFixed(0),
                                        "CreditMemo": items.CreditNoteNo,
                                        "Inv_save": "X"
                                    }

                                    oModel.read("/ZCREATED_IN_NO1_PRJ", {
                                        filters: [oFilter, oFilter1, oFilter2, oFilter3],
                                        success: function (oresponse) {
                                            if (oresponse.results.length > 0) {
                                                oModel.update("/ZCREATED_IN_NO1_PRJ(OldInv='" + items.InvoiceNo + "',InvItem='" + items.BillingDocumentItem + "',Material='" + items.Material + "',Customer='" + items.BILLTOPARTY + "')", obj, {
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
                                                oModel.create("/ZCREATED_IN_NO1_PRJ", obj, {
                                                    success: function (oresponse) {
                                                        oBusyDialog.close();
                                                        MessageToast.show("Data saved")
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
                }


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
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCREATED_IN_NO")
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
                                "Customer": oTableData.BILLTOPARTY,
                                "Customername": oTableData.CustomerName,
                                "Circularno": oTableData.CircularNo,
                                "Salesgroup": oTableData.SalesGroup,
                                "District": oTableData.District,
                                "OldInv": oTableData.InvoiceNo,
                                "Material": oTableData.Material,
                                "Quantity": oTableData.Quantity,
                                "ReturnQuantity": oTableData.ReturnQuantity === "" ? "0.000" : parseFloat(oTableData.ReturnQuantity).toFixed(3),
                                "ActualQuantity": oTableData.ActualQuantity === "" ? "0.000" : parseFloat(oTableData.ActualQuantity).toFixed(3),
                                "Rate": oTableData.Rate,
                                "Billingamount": oTableData.BillingAmount,
                                // "Gst": items.GST,
                                "Generaldiscount": oTableData.GeneralDiscount === "" ? "0.00" : oTableData.GeneralDiscount,
                                "Cashdiscount": oTableData.CashDiscount === "" ? "0.00" : oTableData.CashDiscount,
                                "Liftingdiscount": oTableData.LiftingDiscount === "" ? "0.00" : oTableData.LiftingDiscount,
                                "Pricedifference": oTableData.PriceDifference === "" ? "0.00" : parseFloat(oTableData.PriceDifference).toFixed(0),
                                "Specialdiscount": oTableData.SpecialDiscount === "" ? "0.00" : oTableData.SpecialDiscount,
                                "Otherdiscount": oTableData.OtherDiscount === "" ? "0.00" : oTableData.OtherDiscount,
                                "Totalamountpmt": oTableData.TotalAmount === "" ? "0.00" : parseFloat(oTableData.TotalAmount).toFixed(0),
                                "Totalamount": oTableData.Amount === "" ? "0.00" : parseFloat(oTableData.Amount).toFixed(0),
                                "CreditMemo": oTableData.CreditNoteNo,
                                "Inv_save": "X"
                            }

                            oModel.read("/ZCREATED_IN_NO1_PRJ", {
                                filters: [oFilter, oFilter1, oFilter2, oFilter3],
                                success: function (oresponse) {
                                    if (oresponse.results.length > 0) {
                                        oModel.update("/ZCREATED_IN_NO1_PRJ(OldInv='" + oTableData.InvoiceNo + "',InvItem='" + oTableData.BillingDocumentItem + "',Material='" + oTableData.Material + "',Customer='" + oTableData.BILLTOPARTY + "')", obj, {
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
                                        oModel.create("/ZCREATED_IN_NO1_PRJ", obj, {
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
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Rejecting",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oTableData = oEvent.getSource().getBindingContext("oTableItemModel").getObject();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCREATED_IN_NO")
                var oFilter = new sap.ui.model.Filter("InvItem", "EQ", oTableData.BillingDocumentItem)
                var oFilter1 = new sap.ui.model.Filter("OldInv", "EQ", oTableData.InvoiceNo)
                var oFilter2 = new sap.ui.model.Filter("Material", "EQ", oTableData.Material)
                var oFilter3 = new sap.ui.model.Filter("Customer", "EQ", oTableData.BILLTOPARTY)

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
                                "Customer": oTableData.BILLTOPARTY,
                                "Customername": oTableData.CustomerName,
                                "Circularno": oTableData.CircularNo,
                                "Salesgroup": oTableData.SalesGroup,
                                "District": oTableData.District,
                                "OldInv": oTableData.InvoiceNo,
                                "Material": oTableData.Material,
                                "Quantity": oTableData.Quantity,
                                "ReturnQuantity": oTableData.ReturnQuantity === "" ? "0.00" : parseFloat(oTableData.ReturnQuantity).toFixed(0),
                                "ActualQuantity": oTableData.ActualQuantity === "" ? "0.00" : parseFloat(oTableData.ActualQuantity).toFixed(0),
                                "Rate": oTableData.Rate,
                                "Billingamount": oTableData.BillingAmount,
                                // "Gst": items.GST,
                                "Generaldiscount": oTableData.GeneralDiscount === "" ? "0.00" : oTableData.GeneralDiscount,
                                "Cashdiscount": oTableData.CashDiscount === "" ? "0.00" : oTableData.CashDiscount,
                                "Liftingdiscount": oTableData.LiftingDiscount === "" ? "0.00" : oTableData.LiftingDiscount,
                                "Pricedifference": oTableData.PriceDifference === "" ? "0.00" : oTableData.PriceDifference,
                                "Specialdiscount": oTableData.SpecialDiscount === "" ? "0.00" : oTableData.SpecialDiscount,
                                "Otherdiscount": oTableData.OtherDiscount === "" ? "0.00" : oTableData.OtherDiscount,
                                "Totalamountpmt": oTableData.TotalAmount === "" ? "0.00" : parseFloat(oTableData.TotalAmount).toFixed(0),
                                "Totalamount": oTableData.Amount === "" ? "0.00" : oTableData.Amount,
                                "CreditMemo": oTableData.CreditNoteNo,
                                "Reject": "X"
                            }

                            oModel.read("/ZCREATED_IN_NO1_PRJ", {
                                filters: [oFilter, oFilter1, oFilter2, oFilter3],
                                success: function (oresponse) {
                                    if (oresponse.results.length > 0) {
                                        oModel.update("/ZCREATED_IN_NO1_PRJ(OldInv='" + oTableData.InvoiceNo + "',InvItem='" + oTableData.BillingDocumentItem + "',Material='" + oTableData.Material + "',Customer='" + oTableData.BILLTOPARTY + "')", obj, {
                                            success: function () {
                                                oBusyDialog.close();
                                                MessageToast.show("Rejected")

                                                aTableArr.map(function (items) {
                                                    if (items.InvoiceNo != oTableData.InvoiceNo) {
                                                        arr.push(items)
                                                    }
                                                })

                                            }.bind(this),
                                            error: function () {
                                                oBusyDialog.close();
                                            }
                                        })
                                    } else {
                                        oModel.create("/ZCREATED_IN_NO1_PRJ", obj, {
                                            success: function (oresponse) {
                                                oBusyDialog.close();
                                                MessageToast.show("Rejected")

                                                aTableArr.map(function (items) {
                                                    if (items.InvoiceNo != oTableData.InvoiceNo) {
                                                        arr.push(items)
                                                    }
                                                })

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
            },

            calculateGD2: function () {
                var oTabelItemDataModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTabelItemDataModel.getProperty("/aTableItem")

                var GeneralDiscount = this.getView().getModel("GeneralDiscount")
                var aGeneralArr = GeneralDiscount.getProperty("/aGeneralData")

                var GeneralDiscountState = this.getView().getModel("GeneralDiscountState")
                var aGeneralStateArr = GeneralDiscountState.getProperty("/aGeneralStateData")

                var PriceGroupData = this.getView().getModel("PriceGroupModel")
                var aPriceGroupArr = PriceGroupData.setProperty("/aMaterialGroup")

                var SalesGroupData = this.getView().getModel("SalesGroupModel")
                var aSalesGroupArr = SalesGroupData.getProperty("/aSalesGroup")

                var returnqty = this.getView().getModel("ReturnQuantityModel").getProperty("/ReturnQuantityData")

                var amount = 0;

                aTableArr.map(function (items) {
                    // var salesgroup = items.SalesGroup;
                    var regioncode = items.Shiptoregion
                    var circularnumber = items.CircularNo;
                    var salesgroup = items.SalesGroup;
                    var material = items.Material;
                    var district = (items.District).toLowerCase();
                    aGeneralArr.map(function (item) {
                        if (circularnumber === item.CircularNo && material === item.materialpricegroup && district === (item.District).toLowerCase()) {
                            if (item.Amount != "") {
                                if (items.GeneralDiscount === "") {
                                    items.GeneralDiscount = item.Amount
                                    items.TotalAmount = amount + Number(item.Amount) + Number(items.CashDiscount) + Number(items.LiftingDiscount) + Number(items.PriceDifference) + Number(items.SpecialDiscount) + Number(items.OtherDiscount)
                                    items.Amount = items.ActualQuantity * items.TotalAmount
                                }
                            }
                            // else {
                            //     aGeneralStateArr.map(function (stateItem) {
                            //         if (regioncode === stateItem.Custstcode && circularnumber === stateItem.CircularNo && material === stateItem.Materialpricegrp) {
                            //             items.GeneralDiscount = stateItem.Amount
                            //             items.TotalAmount = amount + Number(item.Amount)
                            //         }
                            //     })
                            // }
                        }
                        // else {
                        //     aGeneralStateArr.map(function (stateItem) {
                        //         if (stateItem.Custstcode.length < 2) {
                        //             var customerCode = "0" + stateItem.Custstcode
                        //         } else {
                        //             customerCode = stateItem.Custstcode
                        //         }
                        //         if (regioncode === customerCode && circularnumber === stateItem.CircularNo && material === stateItem.Materialpricegrp) {
                        //             items.GeneralDiscount = stateItem.Amount
                        //             items.TotalAmount = amount + Number(item.Amount)
                        //         } else {
                        //             aSalesGroupArr.map(function (salesGroupItem) {
                        //                 if (circularnumber === salesGroupItem.Circularnumber && salesgroup === salesGroupItem.Salesgroup && material === salesGroupItem.Materialpricegroup) {
                        //                     items.GeneralDiscount = salesGroupItem.Amount
                        //                     items.TotalAmount = amount + Number(salesGroupItem.Amount)
                        //                 }
                        //             })
                        //         }
                        //     })
                        // }
                    })
                    // oTabelItemDataModel.setProperty("/aTableItem", aTableArr)
                })

                aTableArr.map(function (items) {
                    var regioncode = items.Shiptoregion
                    var circularnumber = items.CircularNo;
                    var salesgroup = items.SalesGroup;
                    var material = items.Material;
                    var district = items.District;
                    aGeneralStateArr.map(function (stateItem) {
                        var statecode;
                        if (stateItem.Custstcode.length < 2) {
                            statecode = "0" + stateItem.Custstcode
                        } else {
                            statecode = stateItem.Custstcode
                        }

                        if (items.GeneralDiscount === "") {
                            if (regioncode === statecode && circularnumber === stateItem.CircularNo && material === stateItem.Materialpricegrp) {
                                if (items.GeneralDiscount === "") {
                                    items.GeneralDiscount = stateItem.Amount
                                    items.TotalAmount = amount + Number(stateItem.Amount) + Number(items.CashDiscount) + Number(items.LiftingDiscount) + Number(items.PriceDifference) + Number(items.SpecialDiscount) + Number(items.OtherDiscount)
                                    items.Amount = items.ActualQuantity * items.TotalAmount
                                }
                            }
                        }
                    })
                })

                aTableArr.map(function (items) {
                    var regioncode = items.Shiptoregion
                    var circularnumber = items.CircularNo;
                    var salesgroup = items.SalesGroup;
                    var material = items.Material;
                    var district = items.District;
                    aSalesGroupArr.map(function (salesGroupItem) {
                        if (items.GeneralDiscount === "") {
                            if (circularnumber === salesGroupItem.Circularnumber && salesgroup === salesGroupItem.Salesgroup && material === salesGroupItem.Materialpricegroup) {
                                if (items.GeneralDiscount === "") {
                                    items.GeneralDiscount = salesGroupItem.Amount
                                    items.TotalAmount = amount + Number(salesGroupItem.Amount) + Number(items.CashDiscount) + Number(items.LiftingDiscount) + Number(items.PriceDifference) + Number(items.SpecialDiscount) + Number(items.OtherDiscount)
                                    items.Amount = items.ActualQuantity * items.TotalAmount
                                }
                            }
                        }
                    })

                })

                // oTabelItemDataModel.setProperty("/aTableItem", aTableArr)

                aTableArr.map(function (items) {
                    returnqty.map(function (item) {
                        if (items.InvoiceNo === item.ReferenceSDDocument) {
                            items.ReturnQuantity = item.OrderQuantity
                            items.ActualQuantity = Number(items.Quantity) - Number(item.OrderQuantity)
                        }
                    })
                })

                oTabelItemDataModel.setProperty("/aTableItem", aTableArr)

                // aTableArr.map(function (items) {
                //     // var salesgroup = items.SalesGroup;
                //     var circularnumber = items.CircularNo;
                //     var material = items.Material;
                //     var district = items.District;
                //     aGeneralArr.map(function (item) {
                //         if (circularnumber === item.CircularNo && material === item.materialpricegroup && district === item.District) {
                //             items.GeneralDiscount = item.Amount
                //             items.TotalAmount = amount + Number(item.Amount)
                //         }
                //     })
                //     oTabelItemDataModel.setProperty("/aTableItem", aTableArr)
                // })
            },

            calculatePD2: function () {
                var oTabelItemDataModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTabelItemDataModel.getProperty("/aTableItem")

                var pricediffstatemodel = this.getView().getModel("PriceDifferenceDistrictModel")
                var pricediffdata = pricediffstatemodel.getProperty("/PriceDifferenceDistrictData")

                var priceservicemodel = this.getView().getModel("PriceServiceModel")
                var aPriceArr = priceservicemodel.getProperty("/aPriceModel")

                var amount = 0;

                aTableArr.map(function (items) {
                    var circularno = items.CircularNo
                    var district = (items.District).toLowerCase()
                    var material = items.MaterialCode
                    pricediffdata.map(function (item) {
                        if (circularno === item.Circularnumber && district === (item.District).toLowerCase() && material === item.Materialcode) {
                            items.PriceDifference = Number(items.Rate) - Number(item.Amount)
                            var pricediff = Number(items.Rate) - Number(item.Amount)
                            items.TotalAmount = amount + Number(items.GeneralDiscount) + Number(items.CashDiscount) + Number(items.LiftingDiscount) + pricediff + Number(items.SpecialDiscount) + Number(items.OtherDiscount)
                            items.Amount = items.ActualQuantity * items.TotalAmount
                        }
                    })
                })

                aTableArr.map(function (items) {
                    var materialcode = items.MaterialCode;
                    var circularno = items.CircularNo
                    aPriceArr.map(function (item) {
                        if (items.PriceDifference === "") {
                            if (materialcode === item.Materialcode && circularno === item.CircularNo) {
                                items.PriceDifference = Number(items.Rate) - Number(item.Agreedamount)
                                var pricediff = Number(items.Rate) - Number(item.Agreedamount)
                                items.TotalAmount = amount + Number(items.GeneralDiscount) + Number(items.CashDiscount) + Number(items.LiftingDiscount) + pricediff + Number(items.SpecialDiscount) + Number(items.OtherDiscount)
                                items.Amount = items.ActualQuantity * items.TotalAmount
                            }
                        }
                    })
                })
                oTabelItemDataModel.setProperty("/aTableItem", aTableArr)
            },

            calculateGD1: function () {
                var oTabelItemDataModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTabelItemDataModel.getProperty("/aTableItem")

                var GeneralDiscount = this.getView().getModel("GeneralDiscount")
                var aGeneralArr = GeneralDiscount.getProperty("/aGeneralData")

                var aNewArr = [];
                var aNewArr2 = [];
                var aNewArr3 = [];
                var amount = 0;

                for (var i = 0; i < aTableArr.length; i++) {
                    var salesgroup = aTableArr[i].SalesGroup;
                    var circularnumber = aTableArr[i].CircularNo;
                    var material = aTableArr[i].Material;
                    var district = aTableArr[i].District;

                    for (var j = 0; j < aGeneralArr.length; j++) {
                        var General_salesgroup = aGeneralArr[j].SalesGrp;
                        var General_circularnumber = aGeneralArr[j].CircularNo;
                        var General_material = aGeneralArr[j].Material;
                        var General_district = aGeneralArr[j].District;
                        var Amount = aGeneralArr[j].Amount

                        if (aTableArr[i].SalesGroup === General_salesgroup && aTableArr[i].CircularNo === General_circularnumber && aTableArr[i].Material === General_material && aTableArr[i].District === General_district) {
                            var obj = {
                                "InvoiceDate": aTableArr[i].InvoiceDate,
                                "SalesGroup": aTableArr[i].SalesGroup,
                                "CircularNo": aTableArr[i].CircularNo,
                                "District": aTableArr[i].District,
                                "InvoiceNo": aTableArr[i].InvoiceNo,
                                "Material": aTableArr[i].Material,
                                "Quantity": aTableArr[i].Quantity,
                                "Rate": aTableArr[i].Rate,
                                "BillingAmount": aTableArr[i].BillingAmount,
                                "GST": "",
                                "GeneralDiscount": Amount,
                                "CashDiscount": "",
                                "LiftingDiscount": "",
                                "SpecialDiscount": "",
                                "OtherDiscount": "",
                                "CreditNoteNo": "",
                                "SODate": aTableArr[i].SODate,
                                "TotalAmount": amount + Number(Amount)
                            }
                            aNewArr.push(obj);
                        }
                    }

                }

                for (var i = 0; i < aTableArr.length; i++) {
                    if (aTableArr[i].CircularNo === "" || aTableArr[i].SalesGroup === "") {
                        aNewArr2.push(aTableArr[i])
                    }
                }

                for (var i = 0; i < aTableArr.length; i++) {
                    if (aTableArr[i].CircularNo != "" && aTableArr[i].SalesGroup != "") {
                        aNewArr3.push(aTableArr[i])
                    }
                }

                aNewArr.map(function (items) {
                    aNewArr2.push(items)
                })

                var arr = [];
                oTabelItemDataModel.setProperty("/aTableItem", arr)
                // oBusyDialog.close();
                oTabelItemDataModel.setProperty("/aTableItem", aNewArr2)


            },

            calculateGD: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Calculating",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oTableModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTableModel.getProperty("/aTableItem")

                var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGD_SERVICE_BINDING")

                var aNewArr = [];
                var aNewArr1 = [];
                var aNewArr2 = []
                var amount = 0;
                oModel1.read("/GENERAL_DISCOUNT", {
                    success: function (response) {
                        for (var i = 0; i < response.results.length; i++) {
                            aNewArr1.push(response.results[i])
                        }

                        aTableArr.map(function (items) {
                            var salesgroup = items.SalesGroup;
                            var circularnumber = items.CircularNo;
                            var material = items.Material;
                            var district = items.District;

                            aNewArr1.map(function (item) {
                                var Amount = item.Amount
                                if (salesgroup === item.SalesGrp && circularnumber === item.CircularNo && material === item.Material && district === item.District) {
                                    var obj = {
                                        "InvoiceDate": items.InvoiceDate,
                                        "SalesGroup": items.SalesGroup,
                                        "CircularNo": items.CircularNo,
                                        "District": items.District,
                                        "InvoiceNo": items.InvoiceNo,
                                        "Material": items.Material,
                                        "Quantity": items.Quantity,
                                        "Rate": items.Rate,
                                        "BillingAmount": items.BillingAmount,
                                        "GST": "",
                                        "GeneralDiscount": Amount,
                                        "CashDiscount": "",
                                        "LiftingDiscount": "",
                                        "SpecialDiscount": "",
                                        "OtherDiscount": "",
                                        "CreditNoteNo": "",
                                        "SODate": items.SODate,
                                        "TotalAmount": amount + Number(Amount)
                                    }
                                    aNewArr.push(obj)
                                }
                            })
                        })

                        aTableArr.map(function (tabledata) {
                            var salesgroup = tabledata.SalesGroup;
                            var circularnumber = tabledata.CircularNo;
                            var material = tabledata.Material;
                            var district = tabledata.District;
                            aNewArr.map(function (data) {
                                if (circularnumber != data.CircularNo || salesgroup != data.SalesGroup) {
                                    aNewArr2.push(tabledata)
                                }
                            })
                        })

                        var result = [];
                        var map = new Map();

                        for (var item of aNewArr2) {
                            if (!map.has(item.InvoiceNo)) {
                                map.set(item.InvoiceNo, true)
                                result.push(item)
                            }
                        }
                        // result.push(aNewArr)

                        aNewArr.map(function (data1) {
                            result.push(data1)
                        })

                        var arr = [];
                        oTableModel.setProperty("/aTableItem", arr)
                        oBusyDialog.close();
                        oTableModel.setProperty("/aTableItem", result)

                    }.bind(this)
                })

            },

            calculateCD2: function () {
                var oTabelItemDataModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTabelItemDataModel.getProperty("/aTableItem")

                var oCashDiscountModel = this.getView().getModel("CashDiscountModel")
                var aCashArr = oCashDiscountModel.getProperty("/aCashData")

                var amount = 0;

                aTableArr.map(function (items) {
                    var paymentterms = items.PaymentTerms;
                    var salesgroup = items.SalesGroup;
                    var circularnumber = items.CircularNo;
                    var material = items.Material;
                    var district = items.District;
                    aCashArr.map(function (item) {
                        if (paymentterms === item.PaymentTerm && circularnumber === item.CircularNo && material === item.materialpricegroup) {
                            if (items.CashDiscount === "") {
                                items.CashDiscount = item.Amount
                                items.TotalAmount = amount + Number(items.GeneralDiscount) + Number(item.Amount) + Number(items.LiftingDiscount) + Number(items.PriceDifference) + Number(items.SpecialDiscount) + Number(items.OtherDiscount)
                                items.Amount = items.ActualQuantity * items.TotalAmount
                            }
                        }
                    })
                })

                oTabelItemDataModel.setProperty("/aTableItem", aTableArr)
            },

            calculateCD1: function () {
                var oTabelItemDataModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTabelItemDataModel.getProperty("/aTableItem")

                var oCashDiscountModel = this.getView().getModel("CashDiscountModel")
                var aCashArr = oCashDiscountModel.getProperty("/aCashData")

                var aNewArr = []
                var aNewArr2 = []
                var aNewArr3 = [];
                var amount = 0;

                for (var i = 0; i < aTableArr.length; i++) {
                    var salesgroup = aTableArr[i].SalesGroup;
                    var circularnumber = aTableArr[i].CircularNo;
                    var material = aTableArr[i].Material;
                    var district = aTableArr[i].District;

                    for (var j = 0; j < aCashArr.length; j++) {
                        var General_salesgroup = aCashArr[j].SalesGrp;
                        var General_circularnumber = aCashArr[j].CircularNo;
                        var General_material = aCashArr[j].Material;
                        var General_district = aCashArr[j].District;
                        var Amount = aCashArr[j].Amount

                        if (aTableArr[i].SalesGroup === General_salesgroup && aTableArr[i].CircularNo === General_circularnumber && aTableArr[i].Material === General_material && aTableArr[i].District === aCashArr[j].District) {
                            var obj = {
                                "InvoiceDate": aTableArr[i].InvoiceDate,
                                "SalesGroup": aTableArr[i].SalesGroup,
                                "CircularNo": aTableArr[i].CircularNo,
                                "District": aTableArr[i].District,
                                "InvoiceNo": aTableArr[i].InvoiceNo,
                                "Material": aTableArr[i].Material,
                                "Quantity": aTableArr[i].Quantity,
                                "Rate": aTableArr[i].Rate,
                                "BillingAmount": aTableArr[i].BillingAmount,
                                "GST": "",
                                "GeneralDiscount": aTableArr[i].GeneralDiscount,
                                "CashDiscount": Amount,
                                "LiftingDiscount": "",
                                "SpecialDiscount": "",
                                "OtherDiscount": "",
                                "CreditNoteNo": "",
                                "SODate": aTableArr[i].SODate,
                                "TotalAmount": amount + Number(Amount) + Number(aTableArr[i].GeneralDiscount)
                            }
                            aNewArr.push(obj);
                        }
                    }

                }

                for (var i = 0; i < aTableArr.length; i++) {
                    if (aTableArr[i].CircularNo === "" || aTableArr[i].SalesGroup === "") {
                        aNewArr2.push(aTableArr[i])
                    }
                }

                aNewArr.map(function (items) {
                    aNewArr2.push(items)
                })

                var arr = [];
                oTabelItemDataModel.setProperty("/aTableItem", arr)
                // oBusyDialog.close();
                oTabelItemDataModel.setProperty("/aTableItem", aNewArr2)


            },

            calculateCD: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Calculating",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oTableModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTableModel.getProperty("/aTableItem")

                var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZAPI_CASH_DIS")

                var aNewArr = [];
                var aNewArr1 = [];
                var aNewArr2 = [];
                var amount = 0;

                oModel1.read("/Cash_Discount", {
                    success: function (response) {
                        for (var i = 0; i < response.results.length; i++) {
                            aNewArr1.push(response.results[i])
                        }

                        aTableArr.map(function (items) {
                            var salesgroup = items.SalesGroup;
                            var circularnumber = items.CircularNo;
                            var material = items.Material;
                            var district = items.District;

                            aNewArr1.map(function (item) {
                                var Amount = item.Amount
                                if (salesgroup === item.SalesGrp && circularnumber === item.CircularNo && material === item.Material && district === item.District) {
                                    var obj = {
                                        "InvoiceDate": items.InvoiceDate,
                                        "SalesGroup": items.SalesGroup,
                                        "CircularNo": items.CircularNo,
                                        "District": items.District,
                                        "InvoiceNo": items.InvoiceNo,
                                        "Material": items.Material,
                                        "Quantity": items.Quantity,
                                        "Rate": items.Rate,
                                        "BillingAmount": items.BillingAmount,
                                        "GST": "",
                                        "GeneralDiscount": items.GeneralDiscount,
                                        "CashDiscount": Amount,
                                        "LiftingDiscount": "",
                                        "SpecialDiscount": "",
                                        "OtherDiscount": "",
                                        "CreditNoteNo": "",
                                        "SODate": items.SODate,
                                        "TotalAmount": amount + Number(Amount) + Number(items.GeneralDiscount)

                                    }
                                    aNewArr.push(obj)
                                }
                            })
                        })

                        aTableArr.map(function (tabledata) {
                            var salesgroup = tabledata.SalesGroup;
                            var circularnumber = tabledata.CircularNo;
                            var material = tabledata.Material;
                            var district = tabledata.District;
                            aNewArr.map(function (data) {
                                if (circularnumber != data.CircularNo || salesgroup != data.SalesGroup) {
                                    aNewArr2.push(tabledata)
                                }
                            })
                        })

                        var result = [];
                        var map = new Map();

                        for (var item of aNewArr2) {
                            if (!map.has(item.InvoiceNo)) {
                                map.set(item.InvoiceNo, true)
                                result.push(item)
                            }
                        }
                        // result.push(aNewArr)

                        aNewArr.map(function (data1) {
                            result.push(data1)
                        })

                        var arr = [];
                        oTableModel.setProperty("/aTableItem", arr)
                        oBusyDialog.close();
                        oTableModel.setProperty("/aTableItem", result)

                    }.bind(this)
                })
            },

            calculateLD2: function () {
                var aTableArr = this.getView().getModel("oTableItemModel").getProperty("/aTableItem")
                var aLiftingArr = this.getView().getModel("LiftingDiscountModel").getProperty("/aLiftingData")
                var aLiftingInvoiceArr = this.getView().getModel("LDInvoiceModel").getProperty("/aLiftingInvoiceData")
                var oTabelItemDataModel = this.getView().getModel("oTableItemModel")

                var amount = 0;
                var flag = "";

                for (var i = 0; i < aTableArr.length; i++) {
                    for (var j = 0; j < aLiftingArr.length; j++) {
                        if (aTableArr[i].CircularNo === aLiftingArr[j].CircularNo && aTableArr[i].Material === aLiftingArr[j].Materialprgrp && aTableArr[i].SODate >= aLiftingArr[j].DeliveryDate && aTableArr[i].SODate <= aLiftingArr[j].DeliveryNdDate) {

                            aTableArr[i].LiftingDiscount = aLiftingArr[j].Amount
                            aTableArr[i].TotalAmount = amount + Number(aTableArr[i].GeneralDiscount) + Number(aTableArr[i].CashDiscount) + Number(aLiftingArr[j].Amount) + Number(aTableArr[i].PriceDifference) + Number(aTableArr[i].SpecialDiscount) + Number(aTableArr[i].OtherDiscount)
                            aTableArr[i].Amount = aTableArr[i].ActualQuantity * aTableArr[i].TotalAmount
                        }
                    }
                }


                for (var i = 0; i < aTableArr.length; i++) {
                    for (var j = 0; j < aLiftingInvoiceArr.length; j++) {
                        if (aTableArr[i].LiftingDiscount === "") {

                            var invoicedate = aLiftingInvoiceArr[j].InvoiceDateFrom
                            var oDate = new Date(invoicedate)
                            var invoicedate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                            var invoicedatefrom = invoicedate1.toISOString().slice(0, 10);

                            var invoicedateto = aLiftingInvoiceArr[j].InvoiceDateTo
                            var oDate1 = new Date(invoicedateto)
                            var invoicedate3 = new Date(oDate1.getTime() - oDate1.getTimezoneOffset() * 60000);
                            var invoicedateto1 = invoicedate3.toISOString().slice(0, 10);

                            if (aTableArr[i].CircularNo === aLiftingInvoiceArr[j].CircularNo && aTableArr[i].InvoiceDate >= invoicedatefrom && aTableArr[i].InvoiceDate <= invoicedateto1) {
                                aTableArr[i].LiftingDiscount = aLiftingInvoiceArr[j].Amount
                                aTableArr[i].TotalAmount = amount + Number(aTableArr[i].GeneralDiscount) + Number(aTableArr[i].CashDiscount) + Number(aLiftingInvoiceArr[j].Amount) + Number(aTableArr[i].PriceDifference) + Number(aTableArr[i].SpecialDiscount) + Number(aTableArr[i].OtherDiscount)
                                aTableArr[i].Amount = aTableArr[i].ActualQuantity * aTableArr[i].TotalAmount
                            }
                        }
                    }
                }


                // aTableArr.map(function (items) {
                //     var salesgroup = items.SalesGroup;
                //     var circularnumber = items.CircularNo;
                //     var material = items.Material;
                //     var district = items.District;
                //     aLiftingArr.map(function (item) {
                //         if (circularnumber === item.CircularNo && material === item.Materialprgrp && items.SODate >= item.DeliveryDate && items.SODate <= item.DeliveryNdDate) {
                //             items.LiftingDiscount = item.Amount
                //             items.TotalAmount = amount + Number(items.GeneralDiscount) + Number(items.CashDiscount) + Number(item.Amount)
                //         } else {
                //             aLiftingInvoiceArr.map(function (aLiftingItem) {
                //                 var invoicedate = aLiftingItem.InvoiceDateFrom
                //                 var oDate = new Date(invoicedate)
                //                 var invoicedate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                //                 var invoicedatefrom = invoicedate1.toISOString().slice(0, 10);

                //                 var invoicedateto = aLiftingItem.InvoiceDateTo
                //                 var oDate1 = new Date(invoicedateto)
                //                 var invoicedate3 = new Date(oDate1.getTime() - oDate1.getTimezoneOffset() * 60000);
                //                 var invoicedateto1 = invoicedate3.toISOString().slice(0, 10);

                //                 if (circularnumber === aLiftingItem.CircularNo && items.InvoiceDate >= invoicedatefrom && items.InvoiceDate <= invoicedateto1) {
                //                     items.LiftingDiscount = aLiftingItem.Amount
                //                     items.TotalAmount = amount + Number(items.GeneralDiscount) + Number(items.CashDiscount) + Number(aLiftingItem.Amount)
                //                 }

                //             })
                //         }
                //     })
                // })

                // aTableArr.map(function (items) {
                //     var salesgroup = items.SalesGroup;
                //     var circularnumber = items.CircularNo;
                //     var material = items.Material;
                //     var district = items.District;
                //     aLiftingInvoiceArr.map(function (aLiftingItem) {
                //         if (flag === "X") {
                //             if (circularnumber === aLiftingItem.CircularNo && items.InvoiceDate >= aLiftingItem.InvoiceDateFrom && items.InvoiceDate <= aLiftingItem.InvoiceDateTo) {
                //                 items.LiftingDiscount = aLiftingItem.Amount
                //                 items.TotalAmount = amount + Number(items.GeneralDiscount) + Number(items.CashDiscount) + Number(aLiftingItem.Amount)
                //             }
                //         }
                //     })
                // })

                oTabelItemDataModel.setProperty("/aTableItem", aTableArr)

            },

            calculateLD1: function () {
                var oTabelItemDataModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTabelItemDataModel.getProperty("/aTableItem")

                var oLiftingModel = this.getView().getModel("LiftingDiscountModel")
                var aLiftingArr = oLiftingModel.getProperty("/aLiftingData")

                var aNewArr = []
                var aNewArr2 = []
                var aNewArr3 = [];
                var amount = 0;

                for (var i = 0; i < aTableArr.length; i++) {
                    var salesgroup = aTableArr[i].SalesGroup;
                    var circularnumber = aTableArr[i].CircularNo;
                    var material = aTableArr[i].Material;
                    var district = aTableArr[i].District;

                    for (var j = 0; j < aLiftingArr.length; j++) {
                        var General_salesgroup = aLiftingArr[j].SalesGrp;
                        var General_circularnumber = aLiftingArr[j].CircularNo;
                        var General_material = aLiftingArr[j].Material;
                        var General_district = aLiftingArr[j].District;
                        var Amount = aLiftingArr[j].Amount

                        if (aTableArr[i].SalesGroup === General_salesgroup && aTableArr[i].CircularNo === General_circularnumber && aTableArr[i].Material === General_material && aTableArr[i].SODate >= aLiftingArr[j].DeliveryDate && aTableArr[i].SODate <= aLiftingArr[j].DeliveryNdDate) {
                            var obj = {
                                "InvoiceDate": aTableArr[i].InvoiceDate,
                                "SalesGroup": aTableArr[i].SalesGroup,
                                "CircularNo": aTableArr[i].CircularNo,
                                "District": aTableArr[i].District,
                                "InvoiceNo": aTableArr[i].InvoiceNo,
                                "Material": aTableArr[i].Material,
                                "Quantity": aTableArr[i].Quantity,
                                "Rate": aTableArr[i].Rate,
                                "BillingAmount": aTableArr[i].BillingAmount,
                                "GST": "",
                                "GeneralDiscount": aTableArr[i].GeneralDiscount,
                                "CashDiscount": aTableArr[i].CashDiscount,
                                "LiftingDiscount": Amount,
                                "SpecialDiscount": "",
                                "OtherDiscount": "",
                                "CreditNoteNo": "",
                                "SODate": aTableArr[i].SODate,
                                "TotalAmount": amount + Number(Amount) + Number(aTableArr[i].GeneralDiscount) + Number(aTableArr[i].CashDiscount)
                            }
                            aNewArr.push(obj);
                        }
                    }

                }

                var merge = [...aTableArr, ...aNewArr]

                // for (var i = 0; i < aTableArr.length; i++) {
                //     if (aTableArr[i].CircularNo === "" || aTableArr[i].SalesGroup === "") {
                //         aNewArr2.push(aTableArr[i])
                //     }
                // }

                // for (var i = 0; i < aTableArr.length; i++) {
                //     if (aTableArr[i].CircularNo != "" && aTableArr[i].SalesGroup != "") {
                //         aNewArr3.push(aTableArr[i])
                //     }
                // }

                // aNewArr3.map(function (items) {
                //     aNewArr.push(items)
                // })

                // for (var i = 0; i < aNewArr.length; i++) {
                //     if (aNewArr[i].LiftingDiscount === "") {
                //         delete aNewArr[i]
                //     }
                // }

                // var merged = [...aNewArr, ...aNewArr3]

                // var result = [];
                // var map = new Map();

                // for (var item of merged) {
                //     if (!map.has(item.InvoiceNo)) {
                //         map.set(item.InvoiceNo, true)
                //         result.unshift(item)
                //     }
                // }

                // result.map(function (items) {
                //     aNewArr2.push(items)
                // })

                var arr = [];
                oTabelItemDataModel.setProperty("/aTableItem", arr)
                // oBusyDialog.close();
                oTabelItemDataModel.setProperty("/aTableItem", merge)

            },

            calculateLD: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Calculating",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oTableModel = this.getView().getModel("oTableItemModel")
                var aTableArr = oTableModel.getProperty("/aTableItem")

                var InvoiceData = this.getOwnerComponent().getModel("oInvoiceObject").getProperty("/aInvoiceData")
                var customerCode = InvoiceData.customerCode;
                var oFilter = new sap.ui.model.Filter("BILLTOPARTY", "EQ", customerCode)

                var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLDT_CDS")
                var oModel2 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZINVOICE_DATA")

                var aNewArr = [];
                var aNewArr1 = [];
                var aNewArr2 = [];
                var aInvoiceData = [];
                var amount = 0;



                oModel1.read("/Lifting_Discount", {
                    success: function (response) {
                        for (var i = 0; i < response.results.length; i++) {
                            aNewArr1.push(response.results[i])
                        }

                        aTableArr.map(function (items) {
                            var salesgroup = items.SalesGroup;
                            var circularnumber = items.CircularNo;
                            var material = items.Material;
                            var district = items.District;
                            var sodate = items.SODate;

                            aNewArr1.map(function (item) {
                                var Amount = item.Amount
                                if (salesgroup === item.SalesGrp && circularnumber === item.CircularNo && material === item.Material && sodate >= item.DeliveryDate && sodate <= item.DeliveryNdDate) {
                                    var obj = {
                                        "InvoiceDate": items.InvoiceDate,
                                        "SalesGroup": items.SalesGroup,
                                        "CircularNo": items.CircularNo,
                                        "District": items.District,
                                        "InvoiceNo": items.InvoiceNo,
                                        "Material": items.Material,
                                        "Quantity": items.Quantity,
                                        "Rate": items.Rate,
                                        "BillingAmount": "",
                                        "GST": "",
                                        "GeneralDiscount": items.GeneralDiscount,
                                        "CashDiscount": items.CashDiscount,
                                        "LiftingDiscount": Amount,
                                        "SpecialDiscount": "",
                                        "OtherDiscount": "",
                                        "CreditNoteNo": "",
                                        "SODate": items.SODate,
                                        "TotalAmount": amount + Number(Amount) + Number(items.GeneralDiscount) + Number(items.CashDiscount)
                                    }
                                    aNewArr.push(obj)
                                } else {
                                    aNewArr.push(items)
                                }
                            })
                        })

                        aTableArr.map(function (tabledata) {
                            var salesgroup = tabledata.SalesGroup;
                            var circularnumber = tabledata.CircularNo;
                            var material = tabledata.Material;
                            var district = tabledata.District;
                            aNewArr.map(function (data) {
                                if (circularnumber != data.CircularNo || salesgroup != data.SalesGroup) {
                                    aNewArr2.push(tabledata)
                                }
                            })
                        })

                        var result = [];
                        var map = new Map();

                        for (var item of aNewArr) {
                            if (!map.has(item.InvoiceNo)) {
                                map.set(item.InvoiceNo, true)
                                result.push(item)
                            }
                        }
                        // result.push(aNewArr)

                        aNewArr.map(function (data1) {
                            result.push(data1)
                        })

                        var arr = [];
                        oTableModel.setProperty("/aTableItem", arr)
                        oBusyDialog.close();
                        oTableModel.setProperty("/aTableItem", result)

                    }.bind(this)
                })

            },

            _onRouteMatch: function () {
                setTimeout(function () {


                    var TableModel = this.getView().getModel("oTableItemModel").getProperty("/aTableItem")
                    var customerCode = this.getOwnerComponent().getModel("oInvoiceObject").getProperty("/aInvoiceData").customerCode;
                    var circularNumber = this.getOwnerComponent().getModel("oInvoiceObject").getProperty("/aInvoiceData").circularNumber;
                    var radioButton = this.getOwnerComponent().getModel("oInvoiceObject").getProperty("/aInvoiceData").radioButton;
                    var pricingData = this.getView().getModel("PriceGroupModel").getProperty("/aMaterialGroup")
                    var returnqty = this.getView().getModel("ReturnQuantityModel").getProperty("/ReturnQuantityData")

                    var customerData = customerCode.map(function (oToken) {
                        return oToken.getText();
                    });

                    var aFilters = customerData.map(function (value) {
                        return new sap.ui.model.Filter("BILLTOPARTY", "EQ", value)
                    })

                    var oFilter4 = new sap.ui.model.Filter({
                        filters: aFilters,
                        and: false
                    });

                    var CicularNumberData = circularNumber.map(function (oToken) {
                        return oToken.getText();
                    });

                    var aFilters_CicularNumberData = CicularNumberData.map(function (value) {
                        return new sap.ui.model.Filter("CR_no", "EQ", value)
                    })

                    var oFilter5 = new sap.ui.model.Filter({
                        filters: aFilters_CicularNumberData,
                        and: false
                    });

                    // var oFilter4 = new sap.ui.model.Filter(aFilters, true)

                    var aNewArr = [];
                    if (TableModel.length > 0) {
                        aTableArr = []
                        this.getView().getModel("oTableItemModel").setProperty("/aTableItem", aTableArr)
                        var oModel = this.getView().getModel();
                        var InvoiceData = this.getOwnerComponent().getModel("oInvoiceObject").getProperty("/aInvoiceData")
                        var customercode = InvoiceData.customerCode;
                        var circularnumber = InvoiceData.circularNumber;
                        var invoiceDateFrom = InvoiceData.invoiceDateFrom;
                        var invoiceDateTo = InvoiceData.invoiceDateTo;
                        var salesoffice = InvoiceData.SalesOffice;
                        var salesgroup = InvoiceData.SalesGroup;
                        var statecode = InvoiceData.StateCode;
                        var salesorg = InvoiceData.SalesOrg;
                        // var invoiceNo = InvoiceData.invoiceNo;



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

                        var salesOff = salesoffice.map(function (oToken) {
                            return oToken.getText();
                        });

                        var salesOffData = salesOff.map(function (value) {
                            return new sap.ui.model.Filter("SalesOffice", "EQ", value)
                        })

                        var oFilter6 = new sap.ui.model.Filter({
                            filters: salesOffData,
                            and: false
                        });

                        var salesgrp = salesgroup.map(function (oToken) {
                            return oToken.getText();
                        });

                        var salesgrpdata = salesgrp.map(function (value) {
                            return new sap.ui.model.Filter("SalesGroup", "EQ", value)
                        })

                        var oFilter7 = new sap.ui.model.Filter({
                            filters: salesgrpdata,
                            and: false
                        });

                        var stateCode = statecode.map(function (oToken) {
                            return oToken.getText();
                        });

                        var statecodedata = stateCode.map(function (value) {
                            return new sap.ui.model.Filter("Region", "EQ", value)
                        })

                        var oFilter8 = new sap.ui.model.Filter({
                            filters: statecodedata,
                            and: false
                        });


                        var salesOrg = salesorg.map(function (oToken) {
                            return oToken.getText();
                        });

                        var salesOrgData = salesOrg.map(function (value) {
                            return new sap.ui.model.Filter("SalesOrganization", "EQ", value)
                        })

                        var oFilter9 = new sap.ui.model.Filter({
                            filters: salesOrgData,
                            and: false
                        });

                        var Filters = []

                        if (customercode.length != 0) {
                            Filters.push(oFilter4)
                        }
                        if (circularNumber.length != 0) {
                            Filters.push(oFilter5)
                        }
                        if (invoiceDateFrom.length != 0) {
                            Filters.push(oFilter1)
                        }
                        if (invoiceDateTo.length != 0) {
                            Filters.push(oFilter2)
                        }
                        if (invoiceDateFrom.length != 0 && invoiceDateTo.length != 0) {
                            Filters.push(oFilter3)
                        }
                        if (salesorg.length != 0) {
                            Filters.push(oFilter9)
                        }
                        if (salesoffice.length != 0) {
                            Filters.push(oFilter6)
                        }
                        if (salesgroup.length != 0) {
                            Filters.push(oFilter7)
                        }
                        if (statecode.length != 0) {
                            Filters.push(oFilter8)
                        }

                        // var oFilter4 = new sap.ui.model.Filter("soldtopart", "EQ", customerCode)

                        oModel.read("/Ycds_invoice_data", {
                            filters: [Filters],
                            success: function (oresponse) {
                                this.getView().setModel(new sap.ui.model.json.JSONModel(oresponse.results[0]), "oHeaderModel")
                                oresponse.results.map(function (items) {
                                    if (items.reject === "" && items.new_inv === "") {
                                        pricingData.map(function (item) {
                                            if (items.MaterialPricingGroup === item.PriceGroupCode) {
                                                var invoicedate = items.BillingDocumentDate
                                                var oDate = new Date(invoicedate)
                                                var invoicedate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                                                var invoicedate2 = invoicedate1.toISOString().slice(0, 10);
                                                var obj = {
                                                    "BillingDocumentItem": items.BillingDocumentItem,
                                                    "BILLTOPARTY": items.BILLTOPARTY,
                                                    "CustomerName": items.CustomerName,
                                                    "InvoiceDate": invoicedate2,
                                                    "CircularNo": items.CR_no,
                                                    "SalesGroup": items.SalesGroup,
                                                    "District": items.DistrictName,
                                                    "InvoiceNo": items.BillingDocument,
                                                    "Material": items.MaterialPricingGroup,
                                                    "MaterialCode": items.Material,
                                                    "Quantity": items.BillingQuantity,
                                                    "ReturnQuantity": "",
                                                    "ActualQuantity": "",
                                                    "Amount": "",
                                                    "Rate": parseFloat(items.ZAPRRATE).toFixed(2),
                                                    "BillingAmount": parseFloat(items.GIV_Amount).toFixed(2),
                                                    "GST": "",
                                                    "GeneralDiscount": "",
                                                    "CashDiscount": "",
                                                    "LiftingDiscount": "",
                                                    "PriceDifference": "",
                                                    "SpecialDiscount": "",
                                                    "OtherDiscount": "",
                                                    "CreditNoteNo": "",
                                                    "SODate": items.SO_date,
                                                    "PaymentTerms": items.CustomerPaymentTerms,
                                                    "Shiptoregion": items.Region,
                                                    //its Rachit Code
                                                    // "Shiptoregion": items.SHIPTOREGION,
                                                    "TotalAmount": ""
                                                }
                                                aTableArr.push(obj)
                                            }
                                        })
                                    }
                                })

                                aTableArr.map(function (items) {
                                    returnqty.map(function (item) {
                                        if (items.InvoiceNo === item.ReferenceSDDocument) {
                                            items.ReturnQuantity = item.OrderQuantity
                                            items.ActualQuantity = parseFloat(Number(items.Quantity) - Number(item.OrderQuantity)).toFixed(3)
                                            items.Amount = Number(items.TotalAmount) * Number(items.Quantity - item.OrderQuantity)
                                        } else {
                                            items.ActualQuantity = parseFloat(Number(items.Quantity) - Number(items.ReturnQuantity)).toFixed(3)
                                        }
                                    })
                                })

                                oTableModel.setProperty("/aTableItem", aTableArr)
                            }.bind(this)
                        })

                        // if (customerCode != "" && invoiceNo != "") {
                        //     oModel.read("/Ycds_invoice_data", {
                        //         filters: [oFilter, oFilter4],
                        //         success: function (oresponse) {
                        //             this.getView().setModel(new sap.ui.model.json.JSONModel(oresponse.results[0]), "oHeaderModel")
                        //             oresponse.results.map(function (items) {
                        //                 if (items.reject === "") {
                        //                     var invoicedate = items.BillingDocumentDate
                        //                     var oDate = new Date(invoicedate)
                        //                     var invoicedate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                        //                     var invoicedate2 = invoicedate1.toISOString().slice(0, 10);
                        //                     var obj = {
                        //                         "BillingDocumentItem": items.BillingDocumentItem,
                        //                         "BILLTOPARTY": items.BILLTOPARTY,
                        //                         "CustomerName": items.CustomerName,
                        //                         "InvoiceDate": invoicedate2,
                        //                         "CircularNo": items.CR_no,
                        //                         "SalesGroup": items.SalesGroup,
                        //                         "District": items.DistrictName,
                        //                         "InvoiceNo": items.BillingDocument,
                        //                         "Material": items.MaterialPricingGroup,
                        //                         "MaterialCode": items.Material,
                        //                         "Quantity": items.BillingQuantity,
                        //                         "Rate": parseFloat(items.ZAPRRATE).toFixed(2),
                        //                         "BillingAmount": parseFloat(items.GIV_Amount).toFixed(2),
                        //                         "GST": "",
                        //                         "GeneralDiscount": "",
                        //                         "CashDiscount": "",
                        //                         "LiftingDiscount": "",
                        //                         "SpecialDiscount": "",
                        //                         "PriceDifference": "",
                        //                         "OtherDiscount": "",
                        //                         "CreditNoteNo": "",
                        //                         "SODate": items.SO_date,
                        //                         "PaymentTerms": items.CustomerPaymentTerms,
                        //                         "Shiptoregion": items.SHIPTOREGION
                        //                     }
                        //                     aTableArr.push(obj)
                        //                 }
                        //             })
                        //             oTableModel.setProperty("/aTableItem", aTableArr)
                        //         }.bind(this)
                        //     })
                        // } else if (customerCode != "" && invoiceNo === "") {
                        //     oModel.read("/Ycds_invoice_data", {
                        //         filters: [oFilter4],
                        //         success: function (oresponse) {
                        //             this.getView().setModel(new sap.ui.model.json.JSONModel(oresponse.results[0]), "oHeaderModel")
                        //             oresponse.results.map(function (items) {
                        //                 if (items.reject === "" && items.new_inv === "") {
                        //                     pricingData.map(function (item) {
                        //                         if (items.MaterialPricingGroup === item.PriceGroupCode) {
                        //                             var invoicedate = items.BillingDocumentDate
                        //                             var oDate = new Date(invoicedate)
                        //                             var invoicedate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                        //                             var invoicedate2 = invoicedate1.toISOString().slice(0, 10);
                        //                             var obj = {
                        //                                 "BillingDocumentItem": items.BillingDocumentItem,
                        //                                 "BILLTOPARTY": items.BILLTOPARTY,
                        //                                 "CustomerName": items.CustomerName,
                        //                                 "InvoiceDate": invoicedate2,
                        //                                 "CircularNo": items.CR_no,
                        //                                 "SalesGroup": items.SalesGroup,
                        //                                 "District": items.DistrictName,
                        //                                 "InvoiceNo": items.BillingDocument,
                        //                                 "Material": items.MaterialPricingGroup,
                        //                                 "MaterialCode": items.Material,
                        //                                 "Quantity": items.BillingQuantity,
                        //                                 "ReturnQuantity": "",
                        //                                 "ActualQuantity": "",
                        //                                 "Amount": "",
                        //                                 "Rate": parseFloat(items.ZAPRRATE).toFixed(2),
                        //                                 "BillingAmount": parseFloat(items.GIV_Amount).toFixed(2),
                        //                                 "GST": "",
                        //                                 "GeneralDiscount": "",
                        //                                 "CashDiscount": "",
                        //                                 "LiftingDiscount": "",
                        //                                 "PriceDifference": "",
                        //                                 "SpecialDiscount": "",
                        //                                 "OtherDiscount": "",
                        //                                 "CreditNoteNo": "",
                        //                                 "SODate": items.SO_date,
                        //                                 "PaymentTerms": items.CustomerPaymentTerms,
                        //                                 "Shiptoregion": items.SHIPTOREGION,
                        //                                 "TotalAmount": ""
                        //                             }
                        //                             aTableArr.push(obj)
                        //                         }
                        //                     })
                        //                 }
                        //             })

                        //             aTableArr.map(function (items) {
                        //                 returnqty.map(function (item) {
                        //                     if (items.InvoiceNo === item.ReferenceSDDocument) {
                        //                         items.ReturnQuantity = item.OrderQuantity
                        //                         items.ActualQuantity = parseFloat(Number(items.Quantity) - Number(item.OrderQuantity)).toFixed(3)
                        //                         items.Amount = Number(items.TotalAmount) * Number(items.Quantity - item.OrderQuantity)
                        //                     } else {
                        //                         items.ActualQuantity = parseFloat(Number(items.Quantity) - Number(items.ReturnQuantity)).toFixed(3)
                        //                     }
                        //                 })
                        //             })

                        //             oTableModel.setProperty("/aTableItem", aTableArr)
                        //         }.bind(this)
                        //     })
                        // } else if (customerCode === "" && invoiceNo != "") {
                        //     oModel.read("/Ycds_invoice_data", {
                        //         filters: [oFilter],
                        //         success: function (oresponse) {
                        //             this.getView().setModel(new sap.ui.model.json.JSONModel(oresponse.results[0]), "oHeaderModel")
                        //             oresponse.results.map(function (items) {
                        //                 var invoicedate = items.BillingDocumentDate
                        //                 var oDate = new Date(invoicedate)
                        //                 var invoicedate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                        //                 var invoicedate2 = invoicedate1.toISOString().slice(0, 10);
                        //                 var obj = {
                        //                     "BillingDocumentItem": items.BillingDocumentItem,
                        //                     "BILLTOPARTY": items.BILLTOPARTY,
                        //                     "CustomerName": items.CustomerName,
                        //                     "InvoiceDate": invoicedate2,
                        //                     "CircularNo": items.CR_no,
                        //                     "SalesGroup": items.SalesGroup,
                        //                     "District": items.DistrictName,
                        //                     "InvoiceNo": items.BillingDocument,
                        //                     "Material": items.MaterialPricingGroup,
                        //                     "MaterialCode": items.Material,
                        //                     "Quantity": items.BillingQuantity,
                        //                     "Rate": parseFloat(items.ZAPRRATE).toFixed(2),
                        //                     "BillingAmount": parseFloat(items.GIV_Amount).toFixed(2),
                        //                     "GST": "",
                        //                     "GeneralDiscount": "",
                        //                     "CashDiscount": "",
                        //                     "LiftingDiscount": "",
                        //                     "SpecialDiscount": "",
                        //                     "PriceDifference": "",
                        //                     "OtherDiscount": "",
                        //                     "CreditNoteNo": "",
                        //                     "SODate": items.SO_date,
                        //                     "PaymentTerms": items.CustomerPaymentTerms,
                        //                     "Shiptoregion": items.SHIPTOREGION
                        //                 }
                        //                 aTableArr.push(obj)
                        //             })
                        //             oTableModel.setProperty("/aTableItem", aTableArr)
                        //         }.bind(this)
                        //     })
                        // }

                    } else {
                        var oModel = this.getView().getModel();
                        var InvoiceData = this.getOwnerComponent().getModel("oInvoiceObject").getProperty("/aInvoiceData")
                        var customercode = InvoiceData.customerCode;
                        var circularnumber = InvoiceData.circularNumber;
                        var invoiceDateFrom = InvoiceData.invoiceDateFrom;
                        var invoiceDateTo = InvoiceData.invoiceDateTo;
                        var salesoffice = InvoiceData.SalesOffice;
                        var salesgroup = InvoiceData.SalesGroup;
                        var statecode = InvoiceData.StateCode;
                        var salesorg = InvoiceData.SalesOrg;
                        // var invoiceNo = InvoiceData.invoiceNo;



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

                        var salesOff = salesoffice.map(function (oToken) {
                            return oToken.getText();
                        });

                        var salesOffData = salesOff.map(function (value) {
                            return new sap.ui.model.Filter("SalesOffice", "EQ", value)
                        })

                        var oFilter6 = new sap.ui.model.Filter({
                            filters: salesOffData,
                            and: false
                        });

                        var salesgrp = salesgroup.map(function (oToken) {
                            return oToken.getText();
                        });

                        var salesgrpdata = salesgrp.map(function (value) {
                            return new sap.ui.model.Filter("SalesGroup", "EQ", value)
                        })

                        var oFilter7 = new sap.ui.model.Filter({
                            filters: salesgrpdata,
                            and: false
                        });

                        var stateCode = statecode.map(function (oToken) {
                            return oToken.getText();
                        });

                        var statecodedata = stateCode.map(function (value) {
                            return new sap.ui.model.Filter("Region", "EQ", value)
                        })

                        var oFilter8 = new sap.ui.model.Filter({
                            filters: statecodedata,
                            and: false
                        });


                        var salesOrg = salesorg.map(function (oToken) {
                            return oToken.getText();
                        });

                        var salesOrgData = salesOrg.map(function (value) {
                            return new sap.ui.model.Filter("SalesOrganization", "EQ", value)
                        })

                        var oFilter9 = new sap.ui.model.Filter({
                            filters: salesOrgData,
                            and: false
                        });

                        var Filters = []

                        if (customercode.length != 0) {
                            Filters.push(oFilter4)
                        }
                        if (circularNumber.length != 0) {
                            Filters.push(oFilter5)
                        }
                        if (invoiceDateFrom.length != 0) {
                            Filters.push(oFilter1)
                        }
                        if (invoiceDateTo.length != 0) {
                            Filters.push(oFilter2)
                        }
                        if (invoiceDateFrom.length != 0 && invoiceDateTo.length != 0) {
                            Filters.push(oFilter3)
                        }
                        if (salesorg.length != 0) {
                            Filters.push(oFilter9)
                        }
                        if (salesoffice.length != 0) {
                            Filters.push(oFilter6)
                        }
                        if (salesgroup.length != 0) {
                            Filters.push(oFilter7)
                        }
                        if (statecode.length != 0) {
                            Filters.push(oFilter8)
                        }

                        // var oFilter4 = new sap.ui.model.Filter("soldtopart", "EQ", customerCode)

                        oModel.read("/Ycds_invoice_data", {
                            filters: [Filters],
                            success: function (oresponse) {
                                this.getView().setModel(new sap.ui.model.json.JSONModel(oresponse.results[0]), "oHeaderModel")
                                oresponse.results.map(function (items) {
                                    if (items.reject === "" && items.new_inv === "") {
                                        pricingData.map(function (item) {
                                            if (items.MaterialPricingGroup === item.PriceGroupCode) {
                                                var invoicedate = items.BillingDocumentDate
                                                var oDate = new Date(invoicedate)
                                                var invoicedate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                                                var invoicedate2 = invoicedate1.toISOString().slice(0, 10);
                                                var obj = {
                                                    "BillingDocumentItem": items.BillingDocumentItem,
                                                    "BILLTOPARTY": items.BILLTOPARTY,
                                                    "CustomerName": items.CustomerName,
                                                    "InvoiceDate": invoicedate2,
                                                    "CircularNo": items.CR_no,
                                                    "SalesGroup": items.SalesGroup,
                                                    "District": items.DistrictName,
                                                    "InvoiceNo": items.BillingDocument,
                                                    "Material": items.MaterialPricingGroup,
                                                    "MaterialCode": items.Material,
                                                    "Quantity": items.BillingQuantity,
                                                    "ReturnQuantity": "",
                                                    "ActualQuantity": "",
                                                    "Amount": "",
                                                    "Rate": parseFloat(items.ZAPRRATE).toFixed(2),
                                                    "BillingAmount": parseFloat(items.GIV_Amount).toFixed(2),
                                                    "GST": "",
                                                    "GeneralDiscount": "",
                                                    "CashDiscount": "",
                                                    "LiftingDiscount": "",
                                                    "PriceDifference": "",
                                                    "SpecialDiscount": "",
                                                    "OtherDiscount": "",
                                                    "CreditNoteNo": "",
                                                    "SODate": items.SO_date,
                                                    "PaymentTerms": items.CustomerPaymentTerms,
                                                    "Shiptoregion": items.Region,
                                                    "TotalAmount": ""
                                                }
                                                aTableArr.push(obj)
                                            }
                                        })
                                    }
                                })

                                aTableArr.map(function (items) {
                                    returnqty.map(function (item) {
                                        if (items.InvoiceNo === item.ReferenceSDDocument) {
                                            items.ReturnQuantity = item.OrderQuantity
                                            items.ActualQuantity = parseFloat(Number(items.Quantity) - Number(item.OrderQuantity)).toFixed(3)
                                            items.Amount = Number(items.TotalAmount) * Number(items.Quantity - item.OrderQuantity)
                                        } else {
                                            items.ActualQuantity = parseFloat(Number(items.Quantity) - Number(items.ReturnQuantity)).toFixed(3)
                                        }
                                    })
                                })

                                oTableModel.setProperty("/aTableItem", aTableArr)
                            }.bind(this)
                        })

                        // if (customerCode != "" && invoiceNo != "") {
                        //     oModel.read("/Ycds_invoice_data", {
                        //         filters: [oFilter, oFilter4],
                        //         success: function (oresponse) {
                        //             this.getView().setModel(new sap.ui.model.json.JSONModel(oresponse.results[0]), "oHeaderModel")
                        //             oresponse.results.map(function (items) {
                        //                 if (items.reject === "") {
                        //                     var invoicedate = items.BillingDocumentDate
                        //                     var oDate = new Date(invoicedate)
                        //                     var invoicedate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                        //                     var invoicedate2 = invoicedate1.toISOString().slice(0, 10);
                        //                     var obj = {
                        //                         "BillingDocumentItem": items.BillingDocumentItem,
                        //                         "BILLTOPARTY": items.BILLTOPARTY,
                        //                         "CustomerName": items.CustomerName,
                        //                         "InvoiceDate": invoicedate2,
                        //                         "CircularNo": items.CR_no,
                        //                         "SalesGroup": items.SalesGroup,
                        //                         "District": items.DistrictName,
                        //                         "InvoiceNo": items.BillingDocument,
                        //                         "Material": items.MaterialPricingGroup,
                        //                         "MaterialCode": items.Material,
                        //                         "Quantity": items.BillingQuantity,
                        //                         "Rate": parseFloat(items.ZAPRRATE).toFixed(2),
                        //                         "BillingAmount": parseFloat(items.GIV_Amount).toFixed(2),
                        //                         "GST": "",
                        //                         "GeneralDiscount": "",
                        //                         "CashDiscount": "",
                        //                         "LiftingDiscount": "",
                        //                         "SpecialDiscount": "",
                        //                         "PriceDifference": "",
                        //                         "OtherDiscount": "",
                        //                         "CreditNoteNo": "",
                        //                         "SODate": items.SO_date,
                        //                         "PaymentTerms": items.CustomerPaymentTerms,
                        //                         "Shiptoregion": items.SHIPTOREGION
                        //                     }
                        //                     aTableArr.push(obj)
                        //                 }
                        //             })
                        //             oTableModel.setProperty("/aTableItem", aTableArr)
                        //         }.bind(this)
                        //     })
                        // } else if (customerCode != "" && invoiceNo === "") {
                        //     oModel.read("/Ycds_invoice_data", {
                        //         filters: [oFilter4],
                        //         success: function (oresponse) {
                        //             this.getView().setModel(new sap.ui.model.json.JSONModel(oresponse.results[0]), "oHeaderModel")
                        //             oresponse.results.map(function (items) {
                        //                 if (items.reject === "" && items.new_inv === "") {
                        //                     pricingData.map(function (item) {
                        //                         if (items.MaterialPricingGroup === item.PriceGroupCode) {
                        //                             var invoicedate = items.BillingDocumentDate
                        //                             var oDate = new Date(invoicedate)
                        //                             var invoicedate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                        //                             var invoicedate2 = invoicedate1.toISOString().slice(0, 10);
                        //                             var obj = {
                        //                                 "BillingDocumentItem": items.BillingDocumentItem,
                        //                                 "BILLTOPARTY": items.BILLTOPARTY,
                        //                                 "CustomerName": items.CustomerName,
                        //                                 "InvoiceDate": invoicedate2,
                        //                                 "CircularNo": items.CR_no,
                        //                                 "SalesGroup": items.SalesGroup,
                        //                                 "District": items.DistrictName,
                        //                                 "InvoiceNo": items.BillingDocument,
                        //                                 "Material": items.MaterialPricingGroup,
                        //                                 "MaterialCode": items.Material,
                        //                                 "Quantity": items.BillingQuantity,
                        //                                 "ReturnQuantity": "",
                        //                                 "ActualQuantity": "",
                        //                                 "Amount": "",
                        //                                 "Rate": parseFloat(items.ZAPRRATE).toFixed(2),
                        //                                 "BillingAmount": parseFloat(items.GIV_Amount).toFixed(2),
                        //                                 "GST": "",
                        //                                 "GeneralDiscount": "",
                        //                                 "CashDiscount": "",
                        //                                 "LiftingDiscount": "",
                        //                                 "PriceDifference": "",
                        //                                 "SpecialDiscount": "",
                        //                                 "OtherDiscount": "",
                        //                                 "CreditNoteNo": "",
                        //                                 "SODate": items.SO_date,
                        //                                 "PaymentTerms": items.CustomerPaymentTerms,
                        //                                 "Shiptoregion": items.SHIPTOREGION,
                        //                                 "TotalAmount": ""
                        //                             }
                        //                             aTableArr.push(obj)
                        //                         }
                        //                     })
                        //                 }
                        //             })

                        //             aTableArr.map(function (items) {
                        //                 returnqty.map(function (item) {
                        //                     if (items.InvoiceNo === item.ReferenceSDDocument) {
                        //                         items.ReturnQuantity = item.OrderQuantity
                        //                         items.ActualQuantity = parseFloat(Number(items.Quantity) - Number(item.OrderQuantity)).toFixed(3)
                        //                         items.Amount = Number(items.TotalAmount) * Number(items.Quantity - item.OrderQuantity)
                        //                     } else {
                        //                         items.ActualQuantity = parseFloat(Number(items.Quantity) - Number(items.ReturnQuantity)).toFixed(3)
                        //                     }
                        //                 })
                        //             })

                        //             oTableModel.setProperty("/aTableItem", aTableArr)
                        //         }.bind(this)
                        //     })
                        // } else if (customerCode === "" && invoiceNo != "") {
                        //     oModel.read("/Ycds_invoice_data", {
                        //         filters: [oFilter],
                        //         success: function (oresponse) {
                        //             this.getView().setModel(new sap.ui.model.json.JSONModel(oresponse.results[0]), "oHeaderModel")
                        //             oresponse.results.map(function (items) {
                        //                 var invoicedate = items.BillingDocumentDate
                        //                 var oDate = new Date(invoicedate)
                        //                 var invoicedate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                        //                 var invoicedate2 = invoicedate1.toISOString().slice(0, 10);
                        //                 var obj = {
                        //                     "BillingDocumentItem": items.BillingDocumentItem,
                        //                     "BILLTOPARTY": items.BILLTOPARTY,
                        //                     "CustomerName": items.CustomerName,
                        //                     "InvoiceDate": invoicedate2,
                        //                     "CircularNo": items.CR_no,
                        //                     "SalesGroup": items.SalesGroup,
                        //                     "District": items.DistrictName,
                        //                     "InvoiceNo": items.BillingDocument,
                        //                     "Material": items.MaterialPricingGroup,
                        //                     "MaterialCode": items.Material,
                        //                     "Quantity": items.BillingQuantity,
                        //                     "Rate": parseFloat(items.ZAPRRATE).toFixed(2),
                        //                     "BillingAmount": parseFloat(items.GIV_Amount).toFixed(2),
                        //                     "GST": "",
                        //                     "GeneralDiscount": "",
                        //                     "CashDiscount": "",
                        //                     "LiftingDiscount": "",
                        //                     "SpecialDiscount": "",
                        //                     "PriceDifference": "",
                        //                     "OtherDiscount": "",
                        //                     "CreditNoteNo": "",
                        //                     "SODate": items.SO_date,
                        //                     "PaymentTerms": items.CustomerPaymentTerms,
                        //                     "Shiptoregion": items.SHIPTOREGION
                        //                 }
                        //                 aTableArr.push(obj)
                        //             })
                        //             oTableModel.setProperty("/aTableItem", aTableArr)
                        //         }.bind(this)
                        //     })
                        // }

                    }

                    // oModel.read("/Ycds_invoice_data", {
                    //     filters: [oFilter],
                    //     success: function (oresponse) {
                    //         this.getView().setModel(new sap.ui.model.json.JSONModel(oresponse.results[0]), "oHeaderModel")
                    //         oresponse.results.map(function (items) {
                    //             var obj = {
                    //                 "InvoiceDate": items.BillingDocumentDate,
                    //                 "InvoiceNo": items.BillingDocument,
                    //                 "Material": items.Material,
                    //                 "Quantity": items.BillingQuantity,
                    //                 "Rate": "",
                    //                 "BillingAmount": "",
                    //                 "GST": "",
                    //                 "GeneralDiscount": "",
                    //                 "CashDiscount": "",
                    //                 "LiftingDiscount": "",
                    //                 "SpecialDiscount": "",
                    //                 "OtherDiscount": "",
                    //                 "CreditNoteNo": ""
                    //             }
                    //             aTableArr.push(obj)
                    //         })
                    //         oTableModel.setProperty("/aTableItem", aTableArr)
                    //     }.bind(this)
                    // })
                }.bind(this), 2000);
            },

            removeRow: function (oEvent) {
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oTableItemModel");
                var aTableArr = oTableModel.getProperty("/aTableItem");
                var id = "";
                var path = ""
                var idx = ""

                for (var i = aSelectedIndex.length - 1; i >= 0; --i) {
                    id = aSelectedIndex[i]
                    path = oTable.getContextByIndex(id).sPath;
                    idx = parseInt(path.substring(path.lastIndexOf('/') + 1))
                    aTableArr.splice(idx, 1)
                }
                oTableModel.setProperty("/aTableItem", aTableArr)
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

            GeneralDiscountFunction: function () {
                var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGD_SERVICE_BINDING")
                var aGeneralArr = [];
                oModel1.read("/GENERAL_DISCOUNT", {
                    success: function (response) {
                        if (response.results.length > 0) {
                            response.results.map(function (Generalitems) {
                                var GeneralDataobj = {
                                    "SalesGroup": Generalitems.SalesGrp,
                                    "CustomerDistrict": Generalitems.District,
                                    "CircularNumber": Generalitems.CircularNo,
                                    "MaterialCode": Generalitems.Material,
                                    "Amount": Generalitems.Amount
                                }
                                aGeneralArr.push(GeneralDataobj);
                            })
                            this.getView().getModel("oGeneralDataModel").setProperty("/aGeneralModelData", aGeneralArr)
                        }


                    }.bind(this)
                })
            },

            // calculateGD767676: function (oEvent) {

            //     var oBusyDialog = new sap.m.BusyDialog({
            //         title: "Calculating",
            //         text: "Please wait"
            //     });
            //     oBusyDialog.open();
            //     var oTableModel = this.getView().getModel("oTableItemModel")
            //     var aNewArr = oTableModel.getProperty("/aTableItem")
            //     var amount = 0;

            //     var oGeneralDataModel = this.getView().getModel("oGeneralDataModel").getProperty("/aGeneralModelData")
            //     var oTabelItemDataModel = this.getView().getModel("oTableItemModel").getProperty("/aTableItem")
            //     for (i = 0; i < oTabelItemDataModel.length; i++) {
            //         var salesgroup = oTabelItemDataModel[i].SalesGroup;
            //         var circularnumber = oTabelItemDataModel[i].CircularNo;
            //         var material = oTabelItemDataModel[i].Material;
            //         var district = oTabelItemDataModel[i].District;
            //         for (j = 0; j < oGeneralDataModel.length; j++) {
            //             var General_salesgroup = oGeneralDataModel[j].SalesGrp;
            //             var General_circularnumber = oGeneralDataModel[j].CircularNo;
            //             var General_material = oGeneralDataModel[j].Material;
            //             var General_district = oGeneralDataModel[j].District;
            //             var Amount = oGeneralDataModel[j].Amount
            //             if (salesgroup === General_salesgroup && circularnumber === General_circularnumber && material === General_material && district === General_district) {
            //                 var obj = {
            //                     "InvoiceDate": items.InvoiceDate,
            //                     "SalesGroup": items.SalesGroup,
            //                     "CircularNo": items.CircularNo,
            //                     "District": items.District,
            //                     "InvoiceNo": items.InvoiceNo,
            //                     "Material": items.Material,
            //                     "Quantity": items.Quantity,
            //                     "Rate": items.Rate,
            //                     "BillingAmount": "",
            //                     "GST": "",
            //                     "GeneralDiscount": Amount,
            //                     "CashDiscount": "",
            //                     "LiftingDiscount": "",
            //                     "SpecialDiscount": "",
            //                     "OtherDiscount": "",
            //                     "CreditNoteNo": "",
            //                     "SODate": items.SODate,
            //                     "
            //                     ": amount + Number(Amount)
            //                 }
            //                 aNewArr.push(obj)
            //                 oTableModel.setProperty("/aTableItem", aNewArr)

            //             }
            //             else {
            //                 var obj1 = {
            //                     "InvoiceDate": items.InvoiceDate,
            //                     "SalesGroup": items.SalesGroup,
            //                     "CircularNo": items.CircularNo,
            //                     "District": items.District,
            //                     "InvoiceNo": items.InvoiceNo,
            //                     "Material": items.Material,
            //                     "Quantity": items.Quantity,
            //                     "Rate": items.Rate,
            //                     "BillingAmount": "",
            //                     "GST": "",
            //                     "GeneralDiscount": "",
            //                     "CashDiscount": "",
            //                     "LiftingDiscount": "",
            //                     "SpecialDiscount": "",
            //                     "OtherDiscount": "",
            //                     "CreditNoteNo": "",
            //                     "SODate": items.SODate,
            //                     "TotalAmount": amount + Number(Amount)
            //                 }
            //                 aNewArr.push(obj1)
            //                 oTableModel.setProperty("/aTableItem", aNewArr)
            //                 break;
            //             }
            //         }
            //     }




            // },
        });
    });
