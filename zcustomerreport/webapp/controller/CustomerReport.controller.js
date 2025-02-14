sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/Token",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, Token, FilterOperator, Filter, Fragment) {
        "use strict";

        return Controller.extend("zcustomerreport.controller.CustomerReport", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oCustomerCodeModel")
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCUST_F4")
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oCustomerModel")
                oModel.read("/ZCust_f4", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("oCustomerModel").setProperty("/aCustomerData", oresponse.results)
                    }.bind(this)
                })

                var oMultiInput = this.byId("idCompanyCode");

                // Set default values as tokens
                var oDefaultToken1 = new sap.m.Token({ text: "1000" });
                var oDefaultToken2 = new sap.m.Token({ text: "2000" });
                var oDefaultToken3 = new sap.m.Token({ text: "3000" });
                var oDefaultToken4 = new sap.m.Token({ text: "4000" });

                // Set the default tokens to the MultiInput control
                oMultiInput.setTokens([oDefaultToken1, oDefaultToken2, oDefaultToken3, oDefaultToken4]);

                var oView = this.getView();
                var oMultiInput1 = oView.byId("idCompanyCode");
                var fnValidator = function (args) {
                    var text = args.text;

                    return new Token({ key: text, text: text });
                };
                oMultiInput1.addValidator(fnValidator);

                var date = this.getView().byId("postdateFrom")
                date.addDelegate({
                    onAfterRendering: function () {
                        date.$().find('INPUT').attr('disabled', true);
                    }
                }, date);

                var todate = this.getView().byId("postdateTo")
                todate.addDelegate({
                    onAfterRendering: function () {
                        todate.$().find('INPUT').attr('disabled', true);
                    }
                }, todate);

                var oView = this.getView();
                var oMultiInput2 = oView.byId("idCustomerCode");
                var fnValidator = function (args) {
                    var text = args.text;

                    return new Token({ key: text, text: text });
                };
                oMultiInput2.addValidator(fnValidator);

                this.OnCustomerCodeCall();
            },

            OnCustomerCodeCall: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZSUPPLIER_F4");
                var aNewArr = [];
                oModel.read("/Zsupplier_f4", {
                    // filters: [oFilter],
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        if (oresponse.results.length > 0) {

                            oresponse.results.map(function (items) {
                                var obj = {
                                    "Supplier": items.Supplier,
                                    "SupplierFullName": items.SupplierFullName,
                                }
                                aNewArr.push(obj);

                            })
                            this.getView().getModel("oCustomerCodeModel").setProperty("/aCustomerCodeData", aNewArr);
                        }
                    }.bind(this)
                })
            },

            handleValueHelp: function (oEvent) {
                var that = this;
                var customer = that.getView().byId("Supplier_Customer").getValue();
                var ocustomer_Filter = new sap.ui.model.Filter("Custmercode", "EQ", customer);
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCUSTOMER_BINDING")
                oModel.read("/ZCUSTOMER_CDS", {
                    filters: [ocustomer_Filter],
                    success: function (oresponse) {
                        if (oresponse.results.length != 0) {
                            var oView = that.getView();
                            var oFilter = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.EQ, oresponse.results[0].Mo);
                            var oFilter1 = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.EQ, oresponse.results[0].Rm);
                            var oFilter2 = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.EQ, oresponse.results[0].Zm);

                            that._sInputId = oEvent.getSource().getId();
                            // create value help dialog
                            if (!that._pValueHelpDialog1) {
                                that._pValueHelpDialog1 = Fragment.load({
                                    id: oView.getId(),
                                    name: "zcustomerreport.fragments.CustomerValueHelp",
                                    controller: that
                                }).then(function (oValueHelpDialog1) {
                                    oView.addDependent(oValueHelpDialog1);
                                    return oValueHelpDialog1;
                                });
                            }

                            // open value help dialog
                            that._pValueHelpDialog1.then(function (oValueHelpDialog1) {
                                var oTemplate = new sap.m.StandardListItem({
                                    title: "{oCustomerCodeModel>Supplier}",
                                    info: "{oCustomerCodeModel>SupplierFullName}",
                                    type: "Active"
                                });
                                oValueHelpDialog1.bindAggregation("items", {
                                    path: 'oCustomerCodeModel>/aCustomerCodeData',
                                    template: oTemplate,
                                    filters: [oFilter, oFilter1, oFilter2]
                                });
                                oValueHelpDialog1.setTitle("Select Customer");
                                oValueHelpDialog1.setResizable(true);
                                oValueHelpDialog1.setMultiSelect(true);
                                oValueHelpDialog1.open();
                            });
                        }
                    }.bind(that)
                })
            },

            _handleValueHelpClose: function (oEvent) {
                var aContexts = oEvent.getParameter("selectedContexts");
                var oMultiInput = this.getView().byId("idCustomerCode");
                var Selected_Value = [];
                aContexts.map(function (items) {
                    Selected_Value.push(items.getObject().Supplier);
                })
                if (aContexts && aContexts.length > 0) {
                    aContexts.map(function (oItem) {
                        oMultiInput.addToken(new Token({
                            text: oItem.getObject().Supplier
                        }));
                    });
                }
            },

            onSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter([
                    new Filter("Supplier", FilterOperator.Contains, sValue),
                    new Filter("SupplierFullName", FilterOperator.Contains, sValue)
                ])
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },

            PrintForm: function () {
                // var companycode = this.getView().byId("idCompanyCode").getSelectedItems();
                var companycode = this.getView().byId("idCompanyCode").getTokens();
                var customerData = companycode.map(function (oToken) {
                    return oToken.mProperties.text;
                });
                console.log(customerData)
                var Supplier_Customer = this.getView().byId("Supplier_Customer").getValue();
                var FiscalYear = this.getView().byId("FiscalYear").getValue();
                var postdateFrom = this.getView().byId("postdateFrom").getValue();
                var postdateTo = this.getView().byId("postdateTo").getValue();
                // var radioButton = this.getView().byId("radioButton").getSelectedIndex();

                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                if (companycode != "" && Supplier_Customer != "" && FiscalYear != "" && postdateFrom != "" && postdateTo != "") {

                    oBusyDialog.open();
                    var postdateFrom1 = postdateFrom.split("-")

                    var url1 = "/sap/bc/http/sap/zcustomer_statement?sap-client=080";
                    // var url1 = "/sap/bc/http/sap/ystatement?sap-client=080";
                    var url2 = "&CompanyCode=";
                    var url3 = "&Supplier_Customer=";
                    var url4 = "&FiscalYear=";
                    var url5 = "&postdateFrom=";
                    var url6 = "&postdateTo=";
                    // var url7 = "&RadioButton=";

                    var url8 = url2 + customerData;
                    var url9 = url3 + Supplier_Customer;
                    var url10 = url4 + FiscalYear;
                    var url11 = url5 + postdateFrom;
                    var url12 = url6 + postdateTo;
                    // var url13 = url7 + RadioButton;

                    var url = url1 + url8 + url9 + url10 + url11 + url12;
                    $.ajax({
                        url: url,
                        type: "GET",
                        success: function (result) {
                            if (result.slice(0, 5) === "ERROR") {
                                oBusyDialog.close();
                                MessageBox.error(result);
                            } else {
                                var decodedPdfContent = atob(result);
                                var byteArray = new Uint8Array(decodedPdfContent.length);
                                for (var i = 0; i < decodedPdfContent.length; i++) {
                                    byteArray[i] = decodedPdfContent.charCodeAt(i);
                                }
                                var blob = new Blob([byteArray.buffer], {
                                    type: 'application/pdf'
                                });
                                var _pdfurl = URL.createObjectURL(blob);

                                if (!this._PDFViewer) {
                                    this._PDFViewer = new sap.m.PDFViewer({
                                        width: "auto",
                                        source: _pdfurl
                                    });
                                    jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
                                } else {
                                    this._PDFViewer = new sap.m.PDFViewer({
                                        width: "auto",
                                        source: _pdfurl
                                    });
                                    jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
                                }
                                oBusyDialog.close();
                                this._PDFViewer.open();
                            }

                        }.bind(this),
                        error() {
                            oBusyDialog.close();
                        }
                    });
                }
                else {
                    MessageBox.show("All Fields Are Mandatory", {
                        title: "Warning!!!",
                        icon: MessageBox.Icon.ERROR
                    });
                }
            },
            handleValueHelpforCustomer: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                // var dataModel = this.getOwnerComponent().getModel('dataModel'); // here 'dataModel' need to defined in OnInit function without set any property
                var oInput1 = this.getView().byId("Supplier_Customer");

                if (!this._oValueHelpDialog) {
                    this._oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog("CustomerState_Code", { // input id "idsupplier"
                        supportMultiselect: false,
                        supportRangesOnly: false,
                        stretch: sap.ui.Device.system.phone,
                        keys: "Orderid",  // fixed
                        descriptionKey: "Orderid", // fixed
                        filtermode: "true",
                        enableBasicSearch: "true",
                        contentWidth: "700px",

                        ok: function (oEvent) {

                            // here below ".Supplier" will be your entity set property

                            var valueset = oEvent.mParameters.tokens[0].mAggregations.customData[0].mProperties.value.Customer;

                            // dataModel.setProperty("/value", valueset);

                            oInput1.setValue(valueset)  // here fetching from input id otherwise comment and use dataModel.setProperty

                            this.close();
                        },
                        cancel: function () {
                            this.close();
                        }
                    });
                }


                //spath is entity path 

                var sPath = "/ZCust_f4"

                var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
                    advancedMode: true,
                    filterBarExpanded: false,
                    filterBarExpanded: true,
                    enableBasicSearch: true,
                    showGoOnFB: !sap.ui.Device.system.phone,
                    filterGroupItems: [new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n1", label: "Customer", control: new sap.m.Input() }),
                    new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n2", label: "CustomerName", control: new sap.m.Input() })],




                    search: function (oEvt) {
                        oBusyDialog.open();

                        var SupplierData = oEvt.mParameters.selectionSet[0].mProperties.value;
                        var customerData = oEvt.mParameters.selectionSet[1].mProperties.value



                        // if threee no  values 

                        if (SupplierData === "" && customerData === "") {
                            oTable.bindRows({
                                path: sPath // entity set name
                            })
                        } else if (SupplierData != "" && customerData === "") {
                            oTable.bindRows({
                                path: sPath, filters: [
                                    new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, SupplierData)],
                                // new sap.ui.model.Filter("ProductManufacturerNumber", sap.ui.model.FilterOperator.Contains, SupplierData)],

                            })
                        } else if (customerData != "" && SupplierData === "") {
                            oTable.bindRows({
                                path: sPath, filters: [
                                    new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, customerData)],
                            })
                        } else if (SupplierData != "" && customerData != "") {
                            oTable.bindRows({
                                path: sPath, filters: [
                                    new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, SupplierData),
                                    new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, customerData)]

                            })
                        }


                        oBusyDialog.close();
                    }
                });

                this._oValueHelpDialog.setFilterBar(oFilterBar);
                var oColModel = new sap.ui.model.json.JSONModel();
                oColModel.setData({
                    cols: [
                        { label: "Customer", template: "Customer" },
                        { label: "CustomerName", template: "CustomerName" },
                        { label: "CustomerFullName", template: "CustomerFullName" },


                    ]
                });
                var oTable = this._oValueHelpDialog.getTable();
                oTable.setModel(oColModel, "columns");

                // here oDataModel("/oData Service")

                // /V2/Northwind/Northwind.svc
                var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUST_F4");
                oTable.setModel(oModel);
                oBusyDialog.close();
                this._oValueHelpDialog.open();
            },

            MailShoot: function () {
                var companycode = this.getView().byId("idCompanyCode").getTokens();
                var customerData = companycode.map(function (oToken) {
                    return oToken.mProperties.text;
                });
                var supplier = this.getView().byId("idCustomerCode").getTokens();
                var suppliercode = supplier.map(function (oToken) {
                    return oToken.mProperties.text;
                });
                console.log(customerData)
                var Supplier_Customer = this.getView().byId("Supplier_Customer").getValue();
                var FiscalYear = this.getView().byId("FiscalYear").getValue();
                var postdateFrom = this.getView().byId("postdateFrom").getValue();
                var postdateTo = this.getView().byId("postdateTo").getValue();

                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                if (companycode != "" && Supplier_Customer != "" && FiscalYear != "" && postdateFrom != "" && postdateTo != "") {

                    oBusyDialog.open();
                    var postdateFrom1 = postdateFrom.split("-")

                    var url1 = "/sap/bc/http/sap/zcustomer_statement?sap-client=080";
                    // var url1 = "/sap/bc/http/sap/ystatement?sap-client=080";
                    var url2 = "&CompanyCode=";
                    var url3 = "&Supplier_Customer=";
                    var url4 = "&FiscalYear=";
                    var url5 = "&postdateFrom=";
                    var url6 = "&postdateTo=";
                    var url7 = "&mail=x";
                    var url8 = "&ccmail_id="
                    // var url7 = "&RadioButton=";
                     
                    var url9 = url2 + customerData;
                    var url10 = url3 + Supplier_Customer;
                    var url11 = url4 + FiscalYear;
                    var url12 = url5 + postdateFrom;
                    var url13 = url6 + postdateTo;
                    var url14 = url8 + suppliercode

                    // var url13 = url7 + RadioButton;

                    var url = url1 + url7 + url9 + url10 + url11 + url12 + url13 + url14;
                    $.ajax({
                        url: url,
                        type: "GET",
                        beforeSend: function (xhr) {
                            xhr.withCredentials = true;
                            // xhr.username = username;
                            // xhr.password = password;
                        },
                        success: function (result) {
                            MessageBox.success("Mail sent successfully!!");
                            // MessageBox.alert(result);
                            oBusyDialog.close();
                        }.bind(this)
                    });
                }
            }
        });
    });
