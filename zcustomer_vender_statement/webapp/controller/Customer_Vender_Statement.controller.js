sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("zcustomervenderstatement.controller.Customer_Vender_Statement", {
            onInit: function () {
                var oSupplier_CustomerLabObject = {
                    "Supplier_CustomerLabName": "Supplier"
                }
                this.getView().setModel(new sap.ui.model.json.JSONModel(oSupplier_CustomerLabObject), "oSupplier_CustomerLabModel");
                this.getView().getModel('oSupplier_CustomerLabModel').setProperty("/Supplier_CustomerLabName", "Supplier");
            },
            LabelNameChange: function () {
                var radioButton = this.getView().byId("radioButton").getSelectedIndex();
                if (radioButton === 0) {
                    var oSupplier_CustomerLabObject = {
                        "Supplier_CustomerLabName": "Supplier"
                    }
                    this.getView().setModel(new sap.ui.model.json.JSONModel(oSupplier_CustomerLabObject), "oSupplier_CustomerLabModel");
                    this.getView().getModel('oSupplier_CustomerLabModel').setProperty("/Supplier_CustomerLabName", "Supplier");
                }
                else if (radioButton === 1) {
                    var oSupplier_CustomerLabObject = {
                        "Supplier_CustomerLabName": "Customer"
                    }
                    this.getView().setModel(new sap.ui.model.json.JSONModel(oSupplier_CustomerLabObject), "oSupplier_CustomerLabModel");
                    this.getView().getModel('oSupplier_CustomerLabModel').setProperty("/Supplier_CustomerLabName", "Customer");
                }
            },
            PrintForm: function () {
                var CompanyCode = this.getView().byId("CompanyCode").getValue();
                var Supplier_Customer = this.getView().byId("Supplier_Customer").getValue();
                var FiscalYear = this.getView().byId("FiscalYear").getValue();
                var postdateFrom = this.getView().byId("postdateFrom").getValue();
                var postdateTo = this.getView().byId("postdateTo").getValue();
                var radioButton = this.getView().byId("radioButton").getSelectedIndex();

                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                if (CompanyCode != "" && Supplier_Customer != "" && FiscalYear != "" && postdateFrom != "" && postdateTo != "") {

                    oBusyDialog.open();
                    if (radioButton === 0) {
                        var RadioButton = "X";
                    }
                    else if (radioButton === 1) {
                        var RadioButton = "";
                    }
                    var postdateFrom1 = postdateFrom.split("-")
                    if (postdateFrom1[1].length != 2) {
                        var postdateFrom2 = postdateFrom1[2] + 0 + postdateFrom1[1] + postdateFrom1[0]
                    } else {
                        postdateFrom2 = postdateFrom1[2] + postdateFrom1[1] + postdateFrom1[0]
                    }
                    var postdateTo1 = postdateTo.split("-")
                    if (postdateTo1[1].length != 2) {
                        var postdateTo2 = postdateTo1[2] + 0 + postdateTo1[1] + postdateTo1[0]
                    } else {
                        postdateTo2 = postdateTo1[2] + postdateTo1[1] + postdateTo1[0]
                    }
                    var url1 = "/sap/bc/http/sap/ystatement?sap-client=080";
                    var url2 = "&CompanyCode=";
                    var url3 = "&Supplier_Customer=";
                    var url4 = "&FiscalYear=";
                    var url5 = "&postdateFrom=";
                    var url6 = "&postdateTo=";
                    var url7 = "&RadioButton=";

                    var url8 = url2 + CompanyCode;
                    var url9 = url3 + Supplier_Customer;
                    var url10 = url4 + FiscalYear;
                    var url11 = url5 + postdateFrom;
                    var url12 = url6 + postdateTo;
                    var url13 = url7 + RadioButton;

                    var url = url1 + url8 + url9 + url10 + url11 + url12 + url13;
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
        });
    });
