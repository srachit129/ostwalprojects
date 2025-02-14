sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    'sap/m/MessageToast',
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/core/syncStyleClass",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, MessageToast, MessageBox, Fragment, syncStyleClass, FilterOperator, Filter) {
        "use strict";

        return Controller.extend("zquantitydiscountmodulepool.controller.rebate", {
            onInit: function () {
                UIComponent.getRouterFor(this).getRoute("Routerebate").attachPatternMatched(this.OnCustomerCodeCall, this)
                UIComponent.getRouterFor(this).getRoute("Routerebate").attachPatternMatched(this.OnCircularNumberCall, this)
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(), "oInvoiceObject")
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oCircularNumberModel")
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oCircularNumModel")
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oCustomerCodeModel")

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "CircularNumber")

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YY1_SD_CIRCULARNUMBER_CDS", "DELEAR_PORTAL", "ZuiehfdzCaFrYTAE6EijwpPFlg]gbZEGnwdNUYHc")

                oModel.read("/YY1_SD_CIRCULARNUMBER", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("CircularNumber").setProperty("/aData", oresponse.results)
                    }.bind(this)
                })

                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(), "QuantDiscValid")
                var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQUANTITY_DISCOUNT_VALID")

                oModel1.read("/dis", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getOwnerComponent().getModel("QuantDiscValid").setProperty("/aQuantDisc", oresponse.results)
                    }.bind(this)
                })

                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(), "ReturnQuantityModel")
                var oModel10 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZRETURN_QTY_BINDING")
                oModel10.read("/Returnquantity", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getOwnerComponent().getModel("ReturnQuantityModel").setProperty("/ReturnQuantityData", oresponse.results)
                    }.bind(this)
                })

            },
            OnCustomerCodeCall: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCUSTOMERCODE");
                var aNewArr = [];
                oModel.read("/ZCUST_CODE_CDS", {
                    // filters: [oFilter],
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        if (oresponse.results.length > 0) {

                            oresponse.results.map(function (items) {
                                var obj = {
                                    "Customer": items.Customer,
                                    "CustomerName": items.CustomerName,
                                }
                                aNewArr.push(obj);

                            })
                            this.getView().getModel("oCustomerCodeModel").setProperty("/aCustomerCodeData", aNewArr);
                        }
                    }.bind(this)
                })
            },
            OnCircularNumberCall: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQUANTITY_DISCOUNT_VALID");
                var aNewArr = [];
                oModel.read("/dis", {
                    // filters: [oFilter],
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        if (oresponse.results.length > 0) {

                            oresponse.results.map(function (items) {
                                var validDate = items.DisValidTo;
                                var CurrentDate = new Date();
                                if (items.Status === "A" && validDate < CurrentDate) {
                                    var obj = {
                                        "Circular": items.Circularnumber,
                                    }
                                    aNewArr.push(obj);
                                }
                            })
                            this.getView().getModel("oCircularNumModel").setProperty("/aCircularNumData", aNewArr);
                        }
                    }.bind(this)
                })
            },
            OCircularNumberfUN: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZQUANTITY_DISCOUNT_VALID");
                var CircularNumber = this.getView().byId("idCircularNumber").getValue();
                var oFilter = new sap.ui.model.Filter("Circularnumber", "EQ", CircularNumber)
                var aNewArr = [];
                oModel.read("/dis", {
                    // filters: [oFilter],
                    success: function (oresponse) {
                        if (oresponse.results.length > 0) {

                            oresponse.results.map(function (items) {
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
                                var obj = {
                                    "FromDt": dt.getFullYear() + '-' + MM + '-' + FDt,
                                    "ToDt": dt1.getFullYear() + '-' + MM1 + '-' + TDt,
                                    "materialpricinggroup": items.Materialpricinggroup,
                                }
                                aNewArr.push(obj);
                            })
                            this.getView().getModel("oCircularNumberModel").setProperty("/aCircularNumberData", aNewArr);
                        }
                        else {
                            MessageToast.show("From and To Date is not Available in backend")
                        }
                    }.bind(this)
                })
            },

            onPress: function () {
                // var radioButton = this.getView().byId("radioButton").getSelectedButton().getText();
                var customerCode = this.getView().byId("idCustomerCode").getValue();
                // var CompanyCode = this.getView().byId("idCompanyCode").getValue();
                var CircularNumber = this.getView().byId("idCircularNumber").getValue();
                // var invoiceNo = this.getView().byId("idInvoice").getValue();

                // var invoiceDateFrom = this.getView().byId("idInvDateFrom").getValue();
                // var invoiceDateTo = this.getView().byId("idInvDateTo").getValue();

                if (customerCode === "") {
                    MessageBox.error("Please enter customer code.")
                } else if (CircularNumber === "") {
                    MessageBox.error("Please enter circular number.")
                } else {
                    var CircularNumberData = this.getView().getModel("oCircularNumberModel").getProperty("/aCircularNumberData")
                    var FromDt = CircularNumberData[0].FromDt;
                    var ToDt = CircularNumberData[0].ToDt;
                    var materialpricinggroup = CircularNumberData[0].materialpricinggroup;
                    var invoiceData = {
                        customerCode: customerCode,
                        // invoiceNo: invoiceNo,
                        CircularNumber: CircularNumber,
                        // RadioButtonValue: radioButton,
                        invoiceDateFrom: FromDt,
                        invoiceDateTo: ToDt,
                        materialpricinggroup: materialpricinggroup,
                        // CompanyCode: CompanyCode,
                    }
                    this.getOwnerComponent().getModel("oInvoiceObject").setProperty("/aInvoiceData", invoiceData)
                    // if(radioButton == "Without Advance"){
                    UIComponent.getRouterFor(this).navTo("rebatedetails")
                    // }
                    // else{
                    //     UIComponent.getRouterFor(this).navTo("rebatedetailsWithAdvance")
                    // }
                }
            },

            handleValueHelp: function (oEvent) {

                var oView = this.getView();
                this._sInputId = oEvent.getSource().getId();
                // create value help dialog
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zquantitydiscountmodulepool.fragment.Dialog",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }

                // open value help dialog
                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    var oTemplate = new sap.m.StandardListItem({
                        title: "{oCustomerCodeModel>Customer}",
                        info: "{oCustomerCodeModel>CustomerName}",
                        type: "Active"
                    });
                    oValueHelpDialog.bindAggregation("items", {
                        path: 'oCustomerCodeModel>/aCustomerCodeData',
                        template: oTemplate
                    });
                    oValueHelpDialog.setTitle("Select Customer");
                    oValueHelpDialog.setResizable(true);
                    oValueHelpDialog.open();
                });
            },
            _handleValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    var productInput = this.byId(this._sInputId);
                    productInput.setValue(oSelectedItem.getTitle());
                }
                oEvent.getSource().getBinding("items").filter([]);
            },

            onSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter([
                    new Filter("Customer", FilterOperator.Contains, sValue),
                    new Filter("CustomerName", FilterOperator.Contains, sValue)
                ])
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },






















        });
    });
