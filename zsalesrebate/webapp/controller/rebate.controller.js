sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    'sap/m/Token',
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, MessageBox, Token, FilterOperator, Filter, Fragment) {
        "use strict";

        return Controller.extend("zsalesrebate.controller.rebate", {
            onInit: function () {
                UIComponent.getRouterFor(this).getRoute("Routerebate").attachPatternMatched(this.OnCircularNumberCall, this)
                UIComponent.getRouterFor(this).getRoute("Routerebate").attachPatternMatched(this.OnCustomerCodeCall, this)
                UIComponent.getRouterFor(this).getRoute("Routerebate").attachPatternMatched(this.OnCallInvoiceData, this)
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(), "oInvoiceObject")
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oCustomerCodeModel")
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oInvoiceDataModel")

                var oView = this.getView();

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZLDT_CDS");
                oView.setModel(oModel);

                var oView = this.getView();
                var oMultiInput1 = oView.byId("idCustomerCode");
                var fnValidator = function (args) {
                    var text = args.text;

                    return new Token({ key: text, text: text });
                };
                oMultiInput1.addValidator(fnValidator);





                var oView1 = this.getView();

                var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YY1_SD_CIRCULARNUMBER_CDS", "DELEAR_PORTAL", "ZuiehfdzCaFrYTAE6EijwpPFlg]gbZEGnwdNUYHc")
                oView1.setModel(oModel1);

                var oView1 = this.getView();
                var oMultiInput2 = oView1.byId("idCicularNumber");
                var fnValidator2 = function (args) {
                    var text2 = args.text;

                    return new Token({ key: text2, text: text2 });
                };
                oMultiInput2.addValidator(fnValidator2);

                var oMultiInput3 = oView1.byId("idSalesOrg");
                var fnValidator3 = function (args) {
                    var text2 = args.text;

                    return new Token({ key: text2, text: text2 });
                };
                oMultiInput3.addValidator(fnValidator3);

                var oMultiInput4 = oView1.byId("idSalesOffice");
                var fnValidator4 = function (args) {
                    var text2 = args.text;

                    return new Token({ key: text2, text: text2 });
                };
                oMultiInput4.addValidator(fnValidator4);

                var oMultiInput5 = oView1.byId("idSalesGroup");
                var fnValidator5 = function (args) {
                    var text2 = args.text;

                    return new Token({ key: text2, text: text2 });
                };
                oMultiInput5.addValidator(fnValidator5);

                var oMultiInput6 = oView1.byId("idStateCode");
                var fnValidator6 = function (args) {
                    var text2 = args.text;

                    return new Token({ key: text2, text: text2 });
                };
                oMultiInput6.addValidator(fnValidator6);
            },

            onPress: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZINVOICE_DATA");
                var customerCode = this.getView().byId("idCustomerCode").getTokens();
                var CicularNumber = this.getView().byId("idCicularNumber").getTokens();
                var salesorg = this.getView().byId("idSalesOrg").getTokens();
                var billingDateFrom = this.getView().byId("idInvDateFrom").getValue();
                var billingDateTo = this.getView().byId("idInvDateTo").getValue();
                var salesoffice = this.getView().byId("idSalesOffice").getTokens();
                var salesgroup = this.getView().byId("idSalesGroup").getTokens();
                var statecode = this.getView().byId("idStateCode").getTokens();

                if (customerCode.length === 0 && CicularNumber.length === 0 && salesorg.length === 0 && billingDateFrom === "" && billingDateTo === "" && salesoffice.length === 0 && salesgroup.length === 0 && statecode.length === 0) {
                    MessageBox.error("Please enter atleast one value")
                } else {
                    var radioButtonValue = this.getView().byId("idRadioButton").getSelectedButton().getText();

                    var customerData = customerCode.map(function (oToken) {
                        return oToken.getText();
                    });

                    var aFilters = customerData.map(function (value) {
                        return new sap.ui.model.Filter("BILLTOPARTY", "EQ", value)
                    })

                    var oFilter = new sap.ui.model.Filter({
                        filters: aFilters,
                        and: false
                    });

                    var CicularNumberData = CicularNumber.map(function (oToken) {
                        return oToken.getText();
                    });

                    var aFilters_CicularNumberData = CicularNumberData.map(function (value) {
                        return new sap.ui.model.Filter("CR_no", "EQ", value)
                    })

                    var oFilter2 = new sap.ui.model.Filter({
                        filters: aFilters_CicularNumberData,
                        and: false
                    });

                    // var invoiceNo = this.getView().byId("idInvoice").getValue();
                    // var oFilter = new sap.ui.model.Filter("BILLTOPARTY", "EQ", customerCode)
                    // var oFilter1 = new sap.ui.model.Filter("BillingDocument", "EQ", invoiceNo)

                    var salesOrg = salesorg.map(function (oToken) {
                        return oToken.getText();
                    });

                    var salesOrgData = salesOrg.map(function (value) {
                        return new sap.ui.model.Filter("SalesOrganization", "EQ", value)
                    })

                    var oFilter3 = new sap.ui.model.Filter({
                        filters: salesOrgData,
                        and: false
                    });

                    // var oFilter4 = new sap.ui.model.Filter("BillingDocumentDate", "EQ", billingDateFrom)

                    var oFilter5 = new sap.ui.model.Filter("BillingDocumentDate", "EQ", billingDateTo)

                    var oFilter4 = new sap.ui.model.Filter({
                        path: "BillingDocumentDate",
                        operator: FilterOperator.BT,
                        value1: billingDateFrom,
                        value2: billingDateTo
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

                    var Filters = []
                    if (customerData.length != 0) {
                        Filters.push(oFilter)
                    }
                    // if (invoiceNo.length != 0) {
                    //     Filters.push(oFilter1)
                    // }
                    if (CicularNumberData.length != 0) {
                        Filters.push(oFilter2)
                    }
                    if (salesorg != 0) {
                        Filters.push(oFilter3)
                    }

                    if (billingDateFrom != 0) {
                        Filters.push(oFilter4)
                    }
                    else if (billingDateTo != 0) {
                        Filters.push(oFilter5)
                    }
                    else if (billingDateFrom != 0 && billingDateTo != 0) {
                        Filters.push(oFilter4)
                    }

                    if (salesoffice != 0) {
                        Filters.push(oFilter6)
                    }
                    if (salesgroup != 0) {
                        Filters.push(oFilter7)
                    }
                    if (statecode != 0) {
                        Filters.push(oFilter8)
                    }

                    // if (customerCode.length === 0) {
                    //     MessageBox.error("Please enter customer code.")
                    // } else {
                    oModel.read("/Ycds_invoice_data", {
                        filters: [Filters],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                MessageBox.error("Data not available for this customer")
                            } else {
                                var invoiceData = {
                                    customerCode: customerCode,
                                    circularNumber: CicularNumber,
                                    radioButton: radioButtonValue,
                                    invoiceDateFrom: billingDateFrom,
                                    invoiceDateTo: billingDateTo,
                                    SalesOrg: salesorg,
                                    SalesGroup: salesgroup,
                                    SalesOffice: salesoffice,
                                    StateCode: statecode
                                }
                                this.getOwnerComponent().getModel("oInvoiceObject").setProperty("/aInvoiceData", invoiceData)

                                UIComponent.getRouterFor(this).navTo("rebatedetails")
                            }
                        }.bind(this)
                    })
                }


                // }

                // if (customerCode.length === 0) {
                //     MessageBox.error("Please enter customer code.")
                // } else {
                //     if (customerCode != "" && invoiceNo != "" && CicularNumber == "") {
                //         oModel.read("/Ycds_invoice_data", {
                //             filters: [oFilter, oFilter1],
                //             success: function (oresponse) {
                //                 if (oresponse.results.length === 0) {
                //                     MessageBox.error("Data not available for this customer")
                //                 } else {
                //                     var invoiceData = {
                //                         customerCode: customerData,
                //                         invoiceNo: invoiceNo,
                //                         radioButton: radioButtonValue
                //                         // invoiceDateFrom: invoiceDateFrom,
                //                         // invoiceDateTo: invoiceDateTo
                //                     }
                //                     this.getOwnerComponent().getModel("oInvoiceObject").setProperty("/aInvoiceData", invoiceData)

                //                     UIComponent.getRouterFor(this).navTo("rebatedetails")
                //                 }
                //             }.bind(this)
                //         })
                //     } else if (customerCode != "" && invoiceNo === "" && CicularNumber != "") {
                //         oModel.read("/Ycds_invoice_data", {
                //             filters: [oFilter, oFilter2],
                //             success: function (oresponse) {
                //                 // if (oresponse.results.length === 0) {
                //                 //     MessageBox.error("Data not available for this customer")
                //                 // } else {
                //                 var invoiceData = {
                //                     customerCode: customerCode,
                //                     invoiceNo: invoiceNo,
                //                     radioButton: radioButtonValue
                //                     // invoiceDateFrom: invoiceDateFrom,
                //                     // invoiceDateTo: invoiceDateTo
                //                 }
                //                 this.getOwnerComponent().getModel("oInvoiceObject").setProperty("/aInvoiceData", invoiceData)

                //                 UIComponent.getRouterFor(this).navTo("rebatedetails")
                //                 // }
                //             }.bind(this)
                //         })
                //     } else if (customerCode != "" && invoiceNo === "" && CicularNumber == "") {
                //         oModel.read("/Ycds_invoice_data", {
                //             filters: [oFilter],
                //             success: function (oresponse) {
                //                 // if (oresponse.results.length === 0) {
                //                 //     MessageBox.error("Data not available for this customer")
                //                 // } else {
                //                 var invoiceData = {
                //                     customerCode: customerCode,
                //                     invoiceNo: invoiceNo,
                //                     radioButton: radioButtonValue
                //                     // invoiceDateFrom: invoiceDateFrom,
                //                     // invoiceDateTo: invoiceDateTo
                //                 }
                //                 this.getOwnerComponent().getModel("oInvoiceObject").setProperty("/aInvoiceData", invoiceData)

                //                 UIComponent.getRouterFor(this).navTo("rebatedetails")
                //                 // }
                //             }.bind(this)
                //         })
                //     } else if (customerCode != "" && invoiceNo != "" && CicularNumber != "") {
                //         oModel.read("/Ycds_invoice_data", {
                //             filters: [oFilter, oFilter1, oFilter2],
                //             success: function (oresponse) {
                //                 // if (oresponse.results.length === 0) {
                //                 //     MessageBox.error("Data not available for this customer")
                //                 // } else {
                //                 var invoiceData = {
                //                     customerCode: customerCode,
                //                     invoiceNo: invoiceNo,
                //                     radioButton: radioButtonValue
                //                     // invoiceDateFrom: invoiceDateFrom,
                //                     // invoiceDateTo: invoiceDateTo
                //                 }
                //                 this.getOwnerComponent().getModel("oInvoiceObject").setProperty("/aInvoiceData", invoiceData)

                //                 UIComponent.getRouterFor(this).navTo("rebatedetails")
                //                 // }
                //             }.bind(this)
                //         })
                //     }
                // }

                // var invoiceDateFrom = this.getView().byId("idInvDateFrom").getValue();
                // var invoiceDateTo = this.getView().byId("idInvDateTo").getValue();
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

            OnCallInvoiceData: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZINVOICE_DATA");
                var aNewArr = [];
                oModel.read("/Ycds_invoice_data", {
                    // filters: [oFilter],
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        if (oresponse.results.length > 0) {

                            oresponse.results.map(function (items) {
                                var obj = {
                                    "SalesOrg": items.SalesOrganization,
                                }
                                aNewArr.push(obj);

                            })
                            this.getView().getModel("oInvoiceDataModel").setProperty("/InvoiceData", aNewArr);
                        }
                    }.bind(this)
                })
            },

            OnCircularNumberCall: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YY1_SD_CIRCULARNUMBER_CDS", "DELEAR_PORTAL", "ZuiehfdzCaFrYTAE6EijwpPFlg]gbZEGnwdNUYHc")
                var aNewArr = [];
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oCircularNumberCall")
                oModel.read("/YY1_SD_CIRCULARNUMBER", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("oCircularNumberCall").setProperty("/aCircularNumberData", oresponse.results)
                    }.bind(this)
                })
            },

            handleValueHelp: function (oEvent) {

                var oView = this.getView();
                this._sInputId = oEvent.getSource().getId();
                // create value help dialog
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zsalesrebate.fragment.Dialog",
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
                    oValueHelpDialog.setMultiSelect(true);
                    oValueHelpDialog.open();
                });
            },

            _handleValueHelpClose1: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    var productInput = this.byId(this._sInputId);
                    productInput.setValue(oSelectedItem.getTitle());
                }
                oEvent.getSource().getBinding("items").filter([]);
            },

            _handleValueHelpClose: function (oEvent) {
                var aContexts = oEvent.getParameter("selectedContexts");
                var oMultiInput = this.getView().byId("idCustomerCode");
                var Selected_Value = [];
                aContexts.map(function (items) {
                    Selected_Value.push(items.getObject().Customer);
                })
                if (aContexts && aContexts.length > 0) {
                    aContexts.map(function (oItem) {
                        oMultiInput.addToken(new Token({
                            text: oItem.getObject().Customer
                        }));
                    });
                }
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

            SalesOrgValueHelp: function (oEvent) {

                var oView = this.getView();
                this._sInputId = oEvent.getSource().getId();
                // create value help dialog
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zsalesrebate.fragment.SalesOrg",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }

                // open value help dialog
                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    var oTemplate = new sap.m.StandardListItem({
                        title: "{oInvoiceDataModel>SalesOrg}",
                        info: "{oInvoiceDataModel>SalesOrg}",
                        type: "Active"
                    });
                    oValueHelpDialog.bindAggregation("items", {
                        path: 'oInvoiceDataModel>/InvoiceData',
                        template: oTemplate
                    });
                    oValueHelpDialog.setTitle("Select Customer");
                    oValueHelpDialog.setResizable(true);
                    oValueHelpDialog.setMultiSelect(true);
                    oValueHelpDialog.open();
                });
            },

            _SalesOrgValueHelpClose: function (oEvent) {
                var aContexts = oEvent.getParameter("selectedContexts");
                var oMultiInput = this.getView().byId("idSalesOrg");
                var Selected_Value = [];
                aContexts.map(function (items) {
                    Selected_Value.push(items.getObject().Customer);
                })
                if (aContexts && aContexts.length > 0) {
                    aContexts.map(function (oItem) {
                        oMultiInput.addToken(new Token({
                            text: oItem.getObject().SalesOrg
                        }));
                    });
                }
            },

            SalesOrgSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter([
                    new Filter("SalesOrg", FilterOperator.Contains, sValue)
                ])
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },

            handleValueHelp_Circular: function (oEvent) {

                var oView = this.getView();
                this._sInputId = oEvent.getSource().getId();
                // create value help dialog
                if (!this._pValueHelpDialog_Circular) {
                    this._pValueHelpDialog_Circular = Fragment.load({
                        id: oView.getId(),
                        name: "zsalesrebate.fragment.CircularDialog",
                        controller: this
                    }).then(function (oValueHelpDialog_Circular) {
                        oView.addDependent(oValueHelpDialog_Circular);
                        return oValueHelpDialog_Circular;
                    });
                }

                // open value help dialog
                this._pValueHelpDialog_Circular.then(function (oValueHelpDialog_Circular) {
                    var oTemplate = new sap.m.StandardListItem({
                        title: "{oCircularNumberCall>circular_no}",
                        info: "{oCircularNumberCall>SAP_Description}",
                        type: "Active"
                    });
                    oValueHelpDialog_Circular.bindAggregation("items", {
                        path: 'oCircularNumberCall>/aCircularNumberData',
                        template: oTemplate
                    });
                    oValueHelpDialog_Circular.setTitle("Select Circular Number");
                    oValueHelpDialog_Circular.setResizable(true);
                    oValueHelpDialog_Circular.setMultiSelect(true);
                    oValueHelpDialog_Circular.open();
                });

            },
            handleCircularValueHelpClose: function (oEvent) {
                var aContexts = oEvent.getParameter("selectedContexts");
                var oMultiInput1 = this.getView().byId("idCicularNumber");
                var Selected_Value = [];
                aContexts.map(function (items) {
                    Selected_Value.push(items.getObject().Customer);
                })
                if (aContexts && aContexts.length > 0) {
                    aContexts.map(function (oItem) {
                        oMultiInput1.addToken(new Token({
                            text: oItem.getObject().circular_no
                        }));
                    });
                }
            },
            onSearch_CircularValue: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter([
                    new Filter("circular_no", FilterOperator.Contains, sValue),
                    new Filter("SAP_Description", FilterOperator.Contains, sValue)
                ])
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
        });
    });
