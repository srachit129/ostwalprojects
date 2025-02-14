sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    'sap/m/SearchField',
    "sap/m/Token",
    "zinvoice/libs/jszip.min",
    "zinvoice/libs/FileSaver.min",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, Fragment, JSONModel, MessageBox, SearchField, Token, FilterOperator, Filter) {
        "use strict";

        return Controller.extend("zinvoice.controller.Invoice", {
            onInit: function () {
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel")
                this.getOwnerComponent().getModel('oTableDataModel').setProperty("/aTableData", [])


                this.getOwnerComponent().setModel(new JSONModel(), "oFetchModel");
                this.getOwnerComponent().getModel("oFetchModel").setProperty("/oFetchData", []);

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oCustomerCodeModel")
                this.OnCustomerCodeCall();
                var companycode = {
                    comcode: "1000"
                };
                var oModel = new JSONModel({
                    dDefaultDate: new Date()
                });
                this.getView().setModel(oModel, "view");
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(companycode), "oCommonModel");
                UIComponent.getRouterFor(this).getRoute('Invoice').attachPatternMatched(this._onRouteMatch, this);
                this.getOwnerComponent().setModel(new JSONModel(), "dataModel");

                var oInvoicetype = {
                    invoiceType: [
                        {
                            Key: 1,
                            Description: "Sales Invoice"
                        },
                        {
                            Key: 2,
                            Description: "Finance Invoice"
                        }
                    ]
                }
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(oInvoicetype), "oInvoiceModel")

                var oObject = {
                    "visible": false,
                    "docnumvisible": true,
                    "invoicenumvisible": false,
                    "MultiInvoiceVisible": false
                }
                this.getView().setModel(new JSONModel(oObject), "oVisibleObject")

                // var oView = this.getView();
                // var oMultiInput1 = oView.byId("Orderfr");
                // var fnValidator = function (args) {
                //     var text = args.text;

                //     return new Token({ key: text, text: text });
                // };
                // oMultiInput1.addValidator(fnValidator);

                var oView = this.getView();
                var oMultiInput1 = oView.byId("idInvoiceNo");
                var fnValidator = function (args) {
                    var text = args.text.toUpperCase();
                    return new Token({ key: text, text: text });
                };
                oMultiInput1.addValidator(fnValidator);

                // var oMultiInput2 = oView.byId("idDocno");
                // var fnValidator1 = function (args) {
                //     var text = args.text.toUpperCase();

                //     return new Token({ key: text, text: text });
                // };
                // oMultiInput2.addValidator(fnValidator1);

                var oMultiInput3 = oView.byId("MultipleDocumentNumber");
                var fnValidator3 = function (args) {
                    var text = args.text.toUpperCase();

                    return new Token({ key: text, text: text });
                };
                oMultiInput3.addValidator(fnValidator3);
            },

            OnCustomerCodeCall: function () {
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YINVOICE_DATA_BILLING");
                var aNewArr = [];
                oModel.read("/YEINVOICE_CDSS", {
                    // filters: [oFilter],
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        if (oresponse.results.length > 0) {

                            oresponse.results.map(function (items) {
                                var obj = {
                                    "BillingDocument": items.BillingDocument,
                                    "BillingDocumentItem": items.BillingDocumentItem,
                                }
                                aNewArr.push(obj);

                            })
                            this.getView().getModel("oCustomerCodeModel").setProperty("/aCustomerCodeData", aNewArr);
                        }
                    }.bind(this)
                })
            },

            _onRouteMatch: function (oEvent) {

            },

            handleRefresh: function () {
                setTimeout(function () {
                    this.byId("pullToRefresh").hide();
                }.bind(this), 1000);
            },

            onChangeAction: function () {
                var radiobutton = this.getView().byId("idActionRadioBtnGroup").getSelectedButton().getText();
                if (radiobutton === "Multiple Print") {
                    this.getView().getModel("oVisibleObject").setProperty("/docnumvisible", false)
                    this.getView().getModel("oVisibleObject").setProperty("/MultiInvoiceVisible", false)
                    this.getView().getModel("oVisibleObject").setProperty("/invoicenumvisible", true)
                } else if (radiobutton === "Multiple Invoice") {
                    this.getView().getModel("oVisibleObject").setProperty("/docnumvisible", false)
                    this.getView().getModel("oVisibleObject").setProperty("/invoicenumvisible", false)
                    this.getView().getModel("oVisibleObject").setProperty("/MultiInvoiceVisible", true)
                } else {
                    this.getView().getModel("oVisibleObject").setProperty("/docnumvisible", true)
                    this.getView().getModel("oVisibleObject").setProperty("/MultiInvoiceVisible", false)
                    this.getView().getModel("oVisibleObject").setProperty("/invoicenumvisible", false)
                }
            },

            onSelect: function () {
                var value = this.getView().byId("idComboBox").getValue();

                if (value === "Finance") {
                    this.getView().getModel("oVisibleObject").setProperty("/visible", true)
                } else {
                    this.getView().getModel("oVisibleObject").setProperty("/visible", false)
                }
            },

            next: function () {
                var FiscalYear = this.getView().byId("idDate").getValue();
                var billdoc = this.getView().byId("Orderfr").getValue();
                var idcode = this.getView().byId("idCode").getValue();
                var radiobutton = this.getView().byId("idActionRadioBtnGroup").getSelectedButton().getText();
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var oComboBox = this.getView().byId("idComboBox").getValue();

                // change by umesh singh
                // var aFilter = [];
                // var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZEWAYBILL_UPDATE_BIND_WEB")
                // var invoice =  this.getView().byId("Orderfr").getValue();

                // var docnum = this.getView().byId("idDocno").getTokens();

                // var documentnumber = docnum.map(function (oToken) {
                //     return oToken.getText();
                // });

                // var docnumber = billdoc.map(function (oToken) {
                //     return oToken.getText();
                // });
                var oInvoiceType = {
                    BillDoc: billdoc,
                    InvoiceType: oComboBox,
                    idCode: idcode
                }
                oCommonModel.setProperty("/invoiceObject", oInvoiceType)
                var oDisplay = {
                    idCode: idcode,
                    Action: radiobutton,
                    FiscalYear: FiscalYear

                };
                oCommonModel.setProperty('/displayObject', oDisplay);

                if (radiobutton == "Generate" && oComboBox === "Sales") {
                    UIComponent.getRouterFor(this).navTo("InvoiceDetails");
                }
                if (radiobutton === "Generate" && oComboBox === "Finance") {
                    UIComponent.getRouterFor(this).navTo("FinanceInvoice");
                } if (radiobutton === "Display" && oComboBox === "Finance") {
                    UIComponent.getRouterFor(this).navTo("FinanceInvoice");
                } else if (radiobutton == "Display") {
                    UIComponent.getRouterFor(this).navTo("InvoiceDetails");
                } else if (oComboBox === "Sales" && radiobutton == "Cancel") {
                    UIComponent.getRouterFor(this).navTo("Cancel");
                } else if (oComboBox === "Finance" && radiobutton === "Cancel") {
                    UIComponent.getRouterFor(this).navTo("FiCancelInvoice");
                } else if (radiobutton == "Print") {
                    this.pdfPrint();
                    // UIComponent.getRouterFor(this).navTo("Print");
                } else if (radiobutton == "Json") {
                    UIComponent.getRouterFor(this).navTo("json");
                }
                // else if (oComboBox === "Finance" && radiobutton === "Generate") {

                // }
                else if (radiobutton === "EwayBill Print") {
                    this.EwayBillprint();
                }

                //  changes by umesh singh   //

                else if (radiobutton == "Update E-way Bill" && oComboBox === "Sales") {
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZEWAYBILL_UPDATE_BIND_WEB")
                    var invoicenum = this.getView().byId("Orderfr").getValue();
                    var oFilter = new sap.ui.model.Filter("Invoice", "EQ", invoicenum)
                    oModel.read("/zvehicle_status_cds", {
                        filters: [oFilter],
                        urlParameters: { "$top": "5000" },
                        success: function (oresponse) {
                            var aNewArr = [];
                            oresponse.results.map(function (items) {
                                var CurrentDate = new Date(items.lrdate)
                                var dt1 = Number(CurrentDate.getDate());
                                var DT1 = dt1 < 10 ? "0" + dt1 : dt1;
                                var mm1 = Number(CurrentDate.getMonth() + 1);
                                var MM1 = mm1 < 10 ? "0" + mm1 : mm1;
                                var CurrentDate1 = CurrentDate.getFullYear() + '-' + MM1 + '-' + DT1;
                                var obj = {
                                    "VehicleNo": items.Vehicleno,
                                    "DocumentNumber": items.lrno,
                                    "DocumentDate": CurrentDate1,
                                    "Quantity": items.vehicleqty,
                                    "Status": items.Status,
                                    "Edit": false,
                                }
                                aNewArr.push(obj);
                            })

                            this.getOwnerComponent().getModel('oTableDataModel').setProperty("/aTableData", aNewArr)
                            this.fetchEwayBill().then(() => {
                                UIComponent.getRouterFor(this).navTo("Ewaypart");
                            }).catch((oError) => {
                                console.error("Error fetching Eway Bill data: ", oError);
                            });

                        }.bind(this)
                    })

                }

            
                

                else if (oComboBox === "Sales" && radiobutton === "Multiple Print") {
                    this.MultiplePrint();
                }
                else if (oComboBox === "Finance" && radiobutton === "Multiple Print") {
                    this.FiMultiplePrint();
                } else if (radiobutton === "Multiple Invoice") {
                    var MultipleDocumentNumber = this.getView().byId("MultipleDocumentNumber").getTokens();

                    var MultipleDocumentNum = MultipleDocumentNumber.map(function (oToken) {
                        return oToken.getText();
                    });
                    MultipleDocumentNum.sort(function (a, b) {
                        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                    });
                    var obj = {
                        "CompanyCode": idcode,
                        "DocumentNo": MultipleDocumentNum,
                        "DocumentType": oComboBox,
                        "FiscalYear": oComboBox == "Finance" ? FiscalYear : "",
                    }
                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(obj), "oMultipleInvoiceModel")

                    UIComponent.getRouterFor(this).navTo("MultipleInvoice");
                }
                //     UIComponent.getRouterFor(this).navTo("second");

                //     var oObject = {
                //         invoiceFrom: this.getView().byId("Orderfr").getValue()
                //     };

                //     this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(), "oCommonModel");
                //     this.getView().getModel("oCommonModel").setProperty("/oObject");
                //    },

            },

            // pdfPrint: function () {
            //     var oBusyDialog = new sap.m.BusyDialog({
            //         title: "Loading",
            //         text: "Please wait"

            //     });
            //     oBusyDialog.open();
            //     var oModel = this.getView().getModel();
            //     var ProductionPlant = this.getView().byId("Plant").getValue();
            //     var oFilter = new sap.ui.model.Filter("Plant", "EQ", ProductionPlant);
            //     var BillingDocument = this.getView().byId("Orderfr").getValue();
            //     var oFilter1 = new sap.ui.model.Filter("BillingDocument", "EQ", BillingDocument);
            //     oModel.read("/Ycds_invoice_data", {
            //         filters: [oFilter, oFilter1],
            //         success: function (data) {
            //             var len = data.results.length;
            //             const head = "<form1>";
            //             const address = "<AddressNode><frmBillToAddress><txtLine1>" + data.results[0].CustomerName + "</txtLine1><txtLine2>" + data.results[0].CustomerFullName + "</txtLine2><txtLine3>" + data.results[0].CityName + "</txtLine3><txtLine4>" + data.results[0].PostalCode + "</txtLine4><txtLine5>" + "" + "</txtLine5><txtLine6>" + "" + "</txtLine6><txtLine7>" + "" + "</txtLine7><txtLine8>" + "" + "</txtLine8><txtRegion>" + data.results[0].Region + "</txtRegion><BillToPartyGSTIN>" + data.results[0].billinggstin + "</BillToPartyGSTIN></frmBillToAddress><frmShipToAddress><txtLine1>" + data.results[0].SHIPTONAME + "</txtLine1><txtLine2>" + data.results[0].SHIPTOFULLNAME + "</txtLine2><txtLine3>" + data.results[0].SHIPTOCITY + "</txtLine3><txtLine4>" + data.results[0].SHIPTOPO + "</txtLine4><txtLine5>" + "" + "</txtLine5><txtLine6>" + "" + "</txtLine6><txtLine7>" + "" + "</txtLine7><txtLine8>" + "" + "</txtLine8><txtRegion>" + "" + "</txtRegion><ShipToPartyGSTIN>" + data.results[0].SHIPPINGPARTNRgstin + "</ShipToPartyGSTIN></frmShipToAddress><QrCode><QRCodeBarcode1>" + data.results[0].SignedQrcode + "</QRCodeBarcode1></QrCode></AddressNode><IRN><IRN>" + data.results[0].Irn + "</IRN><AckNo>" + data.results[0].AckNo + "</AckNo><AckDate>" + data.results[0].AckDate + "</AckDate><Ebillno>" + data.results[0].Ebillno + "</Ebillno></IRN>";
            //             const subform = "<Subform2><DocNo><BillingDocument>" + 10000001 + "</BillingDocument><BillingDocumentdate>" + 12122022 + "</BillingDocumentdate><txtReferenceNumber>" + data.results[0].DELIVERY_NUMBER + "</txtReferenceNumber><txtSalesDocument>" + data.results[0].BillingDocument + "</txtSalesDocument><DeliveryNo>" + data.results[0].DELIVERY_NUMBER + "</DeliveryNo></DocNo><Transporter><LrNo.>" + "" + "</LrNo.><TruckNo.>" + "" + "</TruckNo.><Transporter>" + "" + "</Transporter></Transporter></Subform2>";

            //             const terms = "<Terms><Terms><DeliveryTerms>" + "" + "</DeliveryTerms><PaymentTerms>" + "" + "</PaymentTerms></Terms><PricingConditions><Gst>" + data.results[0].IGST + "</Gst><Amount>" + "" + "</Amount></PricingConditions></Terms>";
            //             const remarks = "<Remarks><Remark>" + "" + "</Remark><Subform6/></Remarks>";
            //             const end = "</form1>";
            //             const x = "<Subform3><Table1><HeaderRow/>";
            //             const y = "</Table1></Subform3>"
            //             var finxml = "";
            //             for (var i = 0; i < len; i++) {
            //                 finxml = finxml + "<Row1><Cell1>" + "" + "</Cell1><MaterialDis.>" + data.results[i].MaterialDescription + "</MaterialDis.><HSN>" + data.results[i].Hsncode + "</HSN><Lot>" + "" + "</Lot><NoOfPackages>" + "" + "</NoOfPackages><PackageQty>" + "" + "</PackageQty><Qty.>" + data.results[i].BillingQuantity + "</Qty.><UOM>" + data.results[i].BillingQuantityUnit + "</UOM><Rate>" + data.results[i].BASICRATE + "</Rate><TotalAmount>" + data.results[i].Basic_Amount + "</TotalAmount></Row1>";
            //             };

            //             finxml = head + address + subform + x + finxml + y + terms + remarks + end;
            //             // var xmlData = "<form1><Page1><Subform1><text1>"+111+"</text1><ROLLNO>"+222+"</ROLLNO><DIAGG>"+333+"</DIAGG><FABRICLOT>"+444+"</FABRICLOT><FABRICTYPE>"+oresponse.results[0].ProductDescription+"</FABRICTYPE><SLmm>"+666+"</SLmm><PARTYNAME>"+777+"</PARTYNAME><barcode>"+888+"</barcode></Subform1></Page1></form1>";
            //             var encdata = btoa(finxml);
            //             //prepare the render API call. Pick up the template from template store
            //             var jsondata = "{  " + "\"xdpTemplate\": \"" + "SD_INVOICE/INVOICE" + "\", " + "\"xmlData\": \"" + encdata + "\"}";
            //             // link render
            //             var url_render = "v1/adsRender/pdf?templateSource=storageName";
            //             //make the API call
            //             $.ajax({
            //                 url: url_render,
            //                 type: "post",
            //                 contentType: "application/json",
            //                 data: jsondata,
            //                 success: function (data, textStatus, jqXHR) {
            //                     //once the API call is successfull, Display PDF on screen
            //                     var decodedPdfContent = atob(data.fileContent);
            //                     var byteArray = new Uint8Array(decodedPdfContent.length);
            //                     for (var i = 0; i < decodedPdfContent.length; i++) {
            //                         byteArray[i] = decodedPdfContent.charCodeAt(i);
            //                     }
            //                     var blob = new Blob([byteArray.buffer], {
            //                         type: 'application/pdf'
            //                     });
            //                     var _pdfurl = URL.createObjectURL(blob);
            //                     if (!this._PDFViewer) {
            //                         this._PDFViewer = new sap.m.PDFViewer({
            //                             width: "auto",
            //                             source: _pdfurl
            //                         });
            //                         jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
            //                     }
            //                     oBusyDialog.close();
            //                     this._PDFViewer.open();
            //                 }.bind(this),
            //                 error: function (data) {
            //                 }
            //             });
            //         }.bind(this)
            //     })
            // }

            pdfPrint: function () {
                var oInvoiceType = this.getView().byId("idComboBox").getValue();
                if (oInvoiceType === "Finance") {
                    this.pdfPrint1();
                } else {
                    this.pdfPrint2();
                }
            },

            pdfPrint1: function () {
                var oModel = this.getView().getModel();
                var oInvoiceType = "Finance Invoice";
                // var oInvoiceType = this.getView().byId("idComboBox").getValue();
                var FiscalYear = this.getView().byId("idDate").getValue();
                var comcode = this.getView().byId("idCode").getValue();

                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var invoice = this.getView().byId("Orderfr").getValue();
                invoice = invoice.toUpperCase();
                console.log(invoice);
                // var url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?form=X&invoice=90000004";

                var url1 = "/sap/bc/http/sap/zcl_yeinv_http?";
                var url2 = "form=X&";
                var url3 = "invoice=";
                var url4 = "&invoicetype="
                var url5 = "&year="
                var url6 = "&comcode="

                var url7 = url3 + invoice;
                var url8 = url4 + oInvoiceType;
                var url9 = url5 + FiscalYear;
                var url10 = url6 + comcode

                var url = url1 + url2 + url7 + url8 + url9 + url10;

                var username = "ZEINV_USER";
                var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
                $.ajax({
                    url: url,
                    cache: false,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {
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
                            // this._PDFViewer.removeAllPopupButtons();
                        } else {
                            this._PDFViewer = new sap.m.PDFViewer({
                                width: "auto",
                                source: _pdfurl
                            });
                        }
                        oBusyDialog.close();

                        this._PDFViewer.open();
                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }

                });
            },
            pdfPrint2new: function () {
                var oModel = this.getView().getModel();
                var oInvoiceType = "Sales Invoice";
                // var oInvoiceType = this.getView().byId("idComboBox").getValue();
                var FiscalYear = this.getView().byId("idDate").getValue();

                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                // var invoice = this.getView().byId("Orderfr").getValue();
                var invoice = this.getView().byId("idDocno").getTokens();
                var invoice = invoice.map(function (oToken) {
                    return (oToken.getText()).toUpperCase();
                });
                invoice.sort(function (a, b) {
                    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                });
                // var url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?form=X&invoice=90000004";

                var url1 = "/sap/bc/http/sap/zcl_yeinv_http?";
                var url2 = "form=X&";
                var url3 = "invoice=";
                var url4 = "&invoicetype="

                var url5 = url3 + invoice;
                var url6 = url4 + oInvoiceType;

                var url = url1 + url2 + url5 + url6;

                var username = "ZEINV_USER";
                var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
                $.ajax({
                    url: url,
                    cache: false,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {
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
                            // this._PDFViewer.removeAllPopupButtons();
                        } else {
                            this._PDFViewer = new sap.m.PDFViewer({
                                width: "auto",
                                source: _pdfurl
                            });
                        }
                        oBusyDialog.close();

                        this._PDFViewer.open();
                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }

                });
            },
            //Old Print Function
            pdfPrint2: function () {
                var oModel = this.getView().getModel();
                var oInvoiceType = "Sales Invoice";
                // var oInvoiceType = this.getView().byId("idComboBox").getValue();
                var FiscalYear = this.getView().byId("idDate").getValue();

                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var invoice = this.getView().byId("Orderfr").getValue();
                invoice = invoice.toUpperCase();
                console.log(invoice);
                // var url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?form=X&invoice=90000004";

                var url1 = "/sap/bc/http/sap/zcl_yeinv_http?";
                var url2 = "form=X&";
                var url3 = "invoice=";
                var url4 = "&invoicetype="

                var url5 = url3 + invoice;
                var url6 = url4 + oInvoiceType;

                var url = url1 + url2 + url5 + url6;

                var username = "ZEINV_USER";
                var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
                $.ajax({
                    url: url,
                    cache: false,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {
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
                            // this._PDFViewer.removeAllPopupButtons();
                        } else {
                            this._PDFViewer = new sap.m.PDFViewer({
                                width: "auto",
                                source: _pdfurl
                            });
                        }
                        oBusyDialog.close();

                        this._PDFViewer.open();
                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }

                });
            },

            MultiplePrint: function () {
                var oModel = this.getView().getModel();
                var zip = new JSZip();



                // var oInvoiceType = this.getView().byId("idComboBox").getValue();
                var FiscalYear = this.getView().byId("idDate").getValue();

                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var invoice = this.getView().byId("idInvoiceNo").getTokens();

                var invoicenum = invoice.map(function (oToken) {
                    return oToken.getText();
                });

                invoicenum.sort(function (a, b) {
                    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                });

                // var url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?form=X&invoice=90000004";

                var url1 = "/sap/bc/http/sap/zcl_yeinv_http?";
                var url2 = "form=X";
                var url3 = "&invoice=";
                var url4 = "&invoicetype="

                var url5 = url3 + invoicenum
                var url6 = url4 + "multipleprint"

                var url = url1 + url2 + url5 + url6;

                var username = "ZEINV_USER";
                var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
                $.ajax({
                    url: url,
                    cache: false,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {
                        // console.log(result)
                        oBusyDialog.close();

                        var base64 = result.split(",");
                        var arr = []
                        for (var i = 0; i < base64.length; i++) {
                            if (base64[i] != "") {
                                arr.push(base64[i])
                            }
                        }

                        arr.forEach(function (base64String, index) {
                            // Decode base64 string
                            var decodedData = atob(base64String);

                            // Convert the binary data to base64
                            var combinedBase64 = btoa(decodedData);

                            // Add the combined base64 string to the zip file
                            zip.file(`document_${invoicenum[index]}.pdf`, combinedBase64, { base64: true });
                        }.bind(this));

                        zip.generateAsync({ type: "blob" }).then(function (blob) {
                            // Create a data URL for the zip file
                            var dataUrl = URL.createObjectURL(blob);

                            // Create a link element and trigger the download
                            var link = document.createElement("a");
                            link.href = dataUrl;
                            link.download = "Invoices.zip" || "Invoices.zip";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        });
                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }

                });
            },

            FiMultiplePrint: function () {
                var oModel = this.getView().getModel();
                var zip = new JSZip();
                var FiscalYear = this.getView().byId("idDate").getValue();
                var comcode = this.getView().byId("idCode").getValue();


                // var oInvoiceType = this.getView().byId("idComboBox").getValue();
                var FiscalYear = this.getView().byId("idDate").getValue();

                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var invoice = this.getView().byId("idInvoiceNo").getTokens();

                var invoicenum = invoice.map(function (oToken) {
                    return oToken.getText();
                });

                invoicenum.sort(function (a, b) {
                    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                });

                // var url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?form=X&invoice=90000004";

                var url1 = "/sap/bc/http/sap/zcl_yeinv_http?";
                var url2 = "form=X";
                var url3 = "&invoice=";
                var url4 = "&invoicetype="
                var url5 = "&year="
                var url6 = "&comcode="

                var url7 = url3 + invoicenum
                var url8 = url4 + "fimultipleprint"
                var url9 = url5 + FiscalYear;
                var url10 = url6 + comcode

                var url = url1 + url2 + url7 + url8 + url9 + url10;

                var username = "ZEINV_USER";
                var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
                $.ajax({
                    url: url,
                    cache: false,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {
                        // console.log(result)
                        oBusyDialog.close();

                        var base64 = result.split(",");
                        var arr = []
                        for (var i = 0; i < base64.length; i++) {
                            if (base64[i] != "") {
                                arr.push(base64[i])
                            }
                        }

                        arr.forEach(function (base64String, index) {
                            // Decode base64 string
                            var decodedData = atob(base64String);

                            // Convert the binary data to base64
                            var combinedBase64 = btoa(decodedData);

                            // Add the combined base64 string to the zip file
                            zip.file(`document_${invoicenum[index]}.pdf`, combinedBase64, { base64: true });
                        }.bind(this));

                        zip.generateAsync({ type: "blob" }).then(function (blob) {
                            // Create a data URL for the zip file
                            var dataUrl = URL.createObjectURL(blob);

                            // Create a link element and trigger the download
                            var link = document.createElement("a");
                            link.href = dataUrl;
                            link.download = "Invoices.zip" || "Invoices.zip";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        });
                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }

                });
            },

            EwayBillprint11: function () {
                var zip = new JSZip()
                var oReader = new FileReader();
                var invoice = this.getView().byId("Orderfr").getValue();
                var oFilter = new sap.ui.model.Filter("BillingDocument", "EQ", invoice)
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YINVOICE_DATA_BILLING")
                var server = sap.ushell.Container.getLogonSystem()._oData.system;
                var token = "b0ccac78-7537-4820-9fb8-59bd7cfb0b1c_ff7de3c8579122f6502f17b117fac5618f273fc40c473293654a13294a8163d5"

                if (server === "XND") {
                    var url = "https://api-sandbox.clear.in/einv/v2/eInvoice/ewaybill/print"
                } else if (server === "XU6") {
                    url = "https://api.clear.in/einv/v2/eInvoice/ewaybill/print"
                } else {
                    url = "https://api.clear.in/einv/v2/eInvoice/ewaybill/print"
                }
                console.log(server)

                oModel.read("/YEINVOICE_CDSS", {
                    filters: [oFilter],
                    success: function (oresponse) {
                        $.ajax({
                            url: url,
                            cache: false,
                            type: "GET",
                            headers: function (xhr) {
                                'X-Cleartax-Auth-Token' == token;
                                'gstin' == '08AAFCD5862R018';
                                'Access-Control-Allow-Origin' == '*'
                                // xhr.withCredentials = true;
                                // xhr.username = username;
                                // xhr.password = password;
                            },
                            data: JSON.stringify({
                                'ewb_numbers': oresponse.results[0].Ebillno,
                                'print_type': "DETAILED",
                            }),
                            contentType: "application/json; charset=utf-8",
                            traditional: true,
                            success: function (result) {
                                var oBusyDialog = new sap.m.BusyDialog({
                                    title: "Loading",
                                    text: "Please wait"
                                });
                                oBusyDialog.open();
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
                                    // this._PDFViewer.removeAllPopupButtons();
                                } else {
                                    this._PDFViewer = new sap.m.PDFViewer({
                                        width: "auto",
                                        source: _pdfurl
                                    });
                                }
                                oBusyDialog.close();

                                this._PDFViewer.open();
                            }.bind(this)

                        });
                    }.bind(this)
                })





                // invoice = invoice.toUpperCase();
                // console.log(invoice);
                // // var url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?form=X&invoice=90000004";

                // var url1 = "/sap/bc/http/sap/yeinv_http?";
                // var url2 = "form=X&";
                // var url3 = "invoice=";
                // var url4 = "&invoicetype="
                // var url5 = "&year="

                // var url6 = url3 + invoice;
                // var url7 = url4 + oInvoiceType;
                // var url8 = url5 + FiscalYear;

                // var url = url1 + url2 + url6 + url7 + url8;

                // var username = "ZEINV_USER";
                // var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";


            },


            EwayBillprint: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Please Wait...",
                    text: "Loading Data"
                });
                oBusyDialog.open();
                var companycode = this.getView().byId("idCode").getValue();
                var invoice = this.getView().byId("Orderfr").getValue();
                var oInvoiceType = "Sales Invoice";

                //https://my405122.s4hana.cloud.sap:443/sap/bc/http/sap/ZEWAY_BILL_PRINT_HTTP?sap-client=080

                var url1 = "/sap/bc/http/sap/ZEWAY_BILL_PRINT_HTTP?sap-client=080";
                var url2 = "&companycode=";
                var url3 = "&invoice=";
                var url4 = "&oInvoiceType=";

                var url5 = url2 + companycode;
                var url6 = url3 + invoice;
                var url7 = url4 + oInvoiceType;

                var url = url1 + url5 + url6 + url7;
                $.ajax({
                    url: url,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        // xhr.username = username;
                        // xhr.password = password;
                    },
                    success: function (result) {
                        if (result === "Error" || result === "ERROR") {
                            oBusyDialog.close();
                            MessageBox.show(result);
                            oBusyDialog.close();
                        }
                        else {
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
                            }
                            else {
                                this._PDFViewer = new sap.m.PDFViewer({
                                    width: "auto",
                                    source: _pdfurl
                                });
                                jQuery.sap.addUrlWhitelist("blob");
                            }
                            oBusyDialog.close();
                            this._PDFViewer.open();
                        }
                    }.bind(this)
                });



            },





            pdfPrint3: function () {
                var oModel = this.getView().getModel();
                var oInvoiceType = "Sales Invoice";
                // var oInvoiceType = this.getView().byId("idComboBox").getValue();
                var FiscalYear = this.getView().byId("idDate").getValue();

                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var invoice = this.getView().byId("Orderfr").getValue();
                invoice = invoice.toUpperCase();
                console.log(invoice);
                // var url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?form=X&invoice=90000004";

                var url1 = "/sap/bc/http/sap/zcl_yeinv_http?";
                var url2 = "form=X&";
                var url3 = "&invoice=";
                var url4 = "&invoicetype=";
                var url5 = "&ewaybillprint=X"

                var url6 = url3 + invoice;
                var url7 = url4 + oInvoiceType;

                var url = url1 + url2 + url5 + url6 + url7;

                var username = "ZEINV_USER";
                var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
                $.ajax({
                    url: url,
                    cache: false,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {
                        console.log(result)
                        var decodedPdfContent = atob(result);
                        var byteArray = new Uint8Array(decodedPdfContent.length);
                        for (var i = 0; i < decodedPdfContent.length; i++) {
                            byteArray[i] = decodedPdfContent.charCodeAt(i);
                        }
                        var blob = new Blob([byteArray.buffer], {
                            type: 'application/pdf'
                        });
                        var _pdfurl = URL.createObjectURL(blob);
                        var _pdfurl = result;
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
                        }
                        oBusyDialog.close();

                        this._PDFViewer.open();
                    }.bind(this)

                });
            },

            handlef4: function () {

                var idComboBox = this.getView().byId("idComboBox").getValue();

                if (idComboBox === 'Sales') {
                    this.SDINVOICE();
                }
                else {
                    this.FIINVOICE();
                }



            },


            SDINVOICE: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                var dataModel = this.getOwnerComponent().getModel('dataModel');
                var oInput = sap.ui.getCore().byId("packingtype");

                if (!this._oValueHelpDialog) {
                    this._oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog("Orderfr", {
                        supportMultiselect: false,
                        supportRangesOnly: false,
                        stretch: sap.ui.Device.system.phone,
                        keys: "Orderid",
                        descriptionKey: "Orderid",
                        filtermode: "true",
                        enableBasicSearch: "true",
                        ok: function (oEvent) {
                            var valueset = oEvent.mParameters.tokens[0].mAggregations.customData[0].mProperties.value.BillingDocument;
                            dataModel.setProperty("/value", valueset);
                            //  var ansh = this.byId("packingtype").setValue(valueset);
                            // that.getView().byId("packingtype").setText(valueset);
                            this.close();
                        },
                        cancel: function () {
                            this.close();
                        }
                    });
                }


                var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
                    advancedMode: true,
                    filterBarExpanded: false,
                    filterBarExpanded: true,
                    enableBasicSearch: true,
                    showGoOnFB: !sap.ui.Device.system.phone,
                    filterGroupItems: [new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n1", label: "BillingDocument", control: new sap.m.Input() }),
                    new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n2", label: "BillingDocumentItem", control: new sap.m.Input() }),
                    new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n3", label: "CustomerName", control: new sap.m.Input() })],




                    search: function (oEvt) {
                        oBusyDialog.open();
                        //  var oParams = oEvt.getParameter("YY1_PACKINGTYPE");
                        var BillingDocument = oEvt.mParameters.selectionSet[0].mProperties.value;
                        var BillingDocumentItem = oEvt.mParameters.selectionSet[1].mProperties.value;
                        var CustomerName = oEvt.mParameters.selectionSet[2].mProperties.value;
                        //  sap.m.MessageToast.show("Search pressed '");

                        // if threee no  values 
                        if (BillingDocument === "" && BillingDocumentItem === "" && CustomerName === "") {
                            oTable.bindRows({
                                path: "/YEINVOICE_CDSS"
                            });
                        }

                        //    if BillingDocument  value is insert then search  under block
                        else if (BillingDocumentItem === "" && CustomerName === "") {
                            oTable.bindRows({
                                path: "/YEINVOICE_CDSS", filters: [
                                    new sap.ui.model.Filter("BillingDocument", sap.ui.model.FilterOperator.EQ, BillingDocument)]
                            });
                        }

                        //    if BillingDocumentItem  value is insert then search under block
                        else if (BillingDocument === "" && CustomerName === "") {
                            oTable.bindRows({
                                path: "/YEINVOICE_CDSS", filters: [
                                    new sap.ui.model.Filter("BillingDocumentItem", sap.ui.model.FilterOperator.EQ, BillingDocumentItem)]
                            });
                        }
                        //    if CustomerName  value is insert then search under block
                        else if (BillingDocumentItem === "" && BillingDocument === "") {
                            oTable.bindRows({
                                path: "/YEINVOICE_CDSS", filters: [
                                    new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.EQ, CustomerName)]
                            });
                        }
                        //    if CustomerName is blank only
                        else if (CustomerName === "") {
                            oTable.bindRows({
                                path: "/YEINVOICE_CDSS", filters: [
                                    new sap.ui.model.Filter("BillingDocument", sap.ui.model.FilterOperator.EQ, BillingDocument),
                                    new sap.ui.model.Filter("BillingDocumentItem", sap.ui.model.FilterOperator.EQ, BillingDocumentItem)]
                            });
                        }
                        //    if BillingDocumentItem is blank only 
                        else if (BillingDocumentItem === "") {
                            oTable.bindRows({
                                path: "/YEINVOICE_CDSS", filters: [
                                    new sap.ui.model.Filter("BillingDocument", sap.ui.model.FilterOperator.EQ, BillingDocument),
                                    new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.EQ, CustomerName)]
                            });
                        }
                        //    if BillingDocument is blank only 
                        else if (BillingDocumentItem === "") {
                            oTable.bindRows({
                                path: "/YEINVOICE_CDSS", filters: [
                                    new sap.ui.model.Filter("BillingDocumentItem", sap.ui.model.FilterOperator.EQ, BillingDocumentItem),
                                    new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.EQ, CustomerName)]
                            });
                        }
                        oBusyDialog.close();
                    }
                });

                this._oValueHelpDialog.setFilterBar(oFilterBar);
                var oColModel = new sap.ui.model.json.JSONModel();
                oColModel.setData({
                    cols: [
                        { label: "BillingDocument", template: "BillingDocument" },
                        { label: "BillingDocumentItem", template: "BillingDocumentItem" },
                        { label: "CustomerName", template: "CustomerName" }
                    ]
                });
                var oTable = this._oValueHelpDialog.getTable();
                oTable.setModel(oColModel, "columns");
                var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/YINVOICE_DATA_BILLING");
                oTable.setModel(oModel);
                oBusyDialog.close();
                this._oValueHelpDialog.open();
            },
            FIINVOICE: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                var dataModel = this.getOwnerComponent().getModel('dataModel');
                var oInput = sap.ui.getCore().byId("packingtype");
                if (!this._oValueHelpDialog) {
                    this._oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog("Orderfr", {
                        supportMultiselect: false,
                        supportRangesOnly: false,
                        stretch: sap.ui.Device.system.phone,
                        keys: "Orderid",
                        descriptionKey: "Orderid",
                        filtermode: "true",
                        ok: function (oEvent) {
                            var valueset = oEvent.mParameters.tokens[0].mAggregations.customData[0].mProperties.value.AccountingDocument;
                            dataModel.setProperty("/value", valueset);
                            this.close();
                        },
                        cancel: function () {
                            this.close();
                        }
                    });
                }


                var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
                    advancedMode: true,
                    // filterBarExpanded: false,
                    filterBarExpanded: true,
                    showGoOnFB: !sap.ui.Device.system.phone,
                    filterGroupItems: [new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n1", label: "AccountingDocument", control: new sap.m.Input() }),
                    new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n2", label: "AccountingDocumentItem", control: new sap.m.Input() }),
                    ],

                    search: function (oEvt) {
                        oBusyDialog.open();
                        // var oParams = oEvt.getParameter("YY1_PACKINGTYPE");
                        var AccountingDocument = oEvt.mParameters.selectionSet[0].mProperties.value;
                        var AccountingDocumentItem = oEvt.mParameters.selectionSet[1].mProperties.value;

                        // sap.m.MessageToast.show("Search pressed '");
                        // if two no  values 
                        if (AccountingDocument === "" && AccountingDocumentItem === "") {
                            oTable.bindRows({
                                path: "/Financeinvoicedata"
                            });
                        }

                        //    if AccountingDocumentItem  value is insert then search  under block
                        else if (AccountingDocument === "") {
                            oTable.bindRows({
                                path: "/Financeinvoicedata", filters: [
                                    new sap.ui.model.Filter("AccountingDocumentItem", sap.ui.model.FilterOperator.Contains, AccountingDocumentItem)]
                            });
                        }

                        //    if AccountingDocument value is insert then search  under block
                        else if (AccountingDocumentItem === "") {
                            oTable.bindRows({
                                path: "/Financeinvoicedata", filters: [
                                    new sap.ui.model.Filter("AccountingDocument", sap.ui.model.FilterOperator.Contains, AccountingDocument)]
                            });
                        }

                        oBusyDialog.close();
                    }
                });

                this._oValueHelpDialog.setFilterBar(oFilterBar);
                var oColModel = new sap.ui.model.json.JSONModel();
                oColModel.setData({
                    cols: [
                        { label: "AccountingDocument", template: "AccountingDocument" },
                        { label: "AccountingDocumentItem", template: "AccountingDocumentItem" },

                    ]
                });
                var oTable = this._oValueHelpDialog.getTable();
                oTable.setModel(oColModel, "columns");
                var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/YINVOICE");
                oTable.setModel(oModel);
                oBusyDialog.close();
                this._oValueHelpDialog.open();
            },

            onBack: function () {
                var sPreviousHash = History.getInstance().getPreviousHash();
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.getOwnerComponent().getRouter().navTo("page1", null, true);
                }
            },

            handleValueHelp: function (oEvent) {

                var oView = this.getView();
                this._sInputId = oEvent.getSource().getId();
                // create value help dialog
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zinvoice.fragments.Dialog",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }

                // open value help dialog
                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    var oTemplate = new sap.m.StandardListItem({
                        title: "{oCustomerCodeModel>BillingDocument}",
                        info: "{oCustomerCodeModel>BillingDocumentItem}",
                        type: "Active"
                    });
                    oValueHelpDialog.bindAggregation("items", {
                        path: 'oCustomerCodeModel>/aCustomerCodeData',
                        template: oTemplate
                    });
                    oValueHelpDialog.setTitle("Select Document");
                    oValueHelpDialog.setResizable(true);
                    oValueHelpDialog.setMultiSelect(true);
                    oValueHelpDialog.open();
                });
            },

            _handleValueHelpClose: function (oEvent) {
                var aContexts = oEvent.getParameter("selectedContexts");
                var oMultiInput = this.getView().byId("idDocno");
                var Selected_Value = [];
                aContexts.map(function (items) {
                    Selected_Value.push(items.getObject().BillingDocument);
                })
                if (aContexts && aContexts.length > 0) {
                    aContexts.map(function (oItem) {
                        oMultiInput.addToken(new Token({
                            text: oItem.getObject().BillingDocument
                        }));
                    });
                }
            },

            onSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                console.log(sValue)
                var oFilter = new Filter([
                    new Filter("BillingDocument", FilterOperator.EQ, sValue),
                    new Filter("BillingDocumentItem", FilterOperator.EQ, sValue)
                ])
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },



            fetchEwayBill: function () {
                return new Promise((resolve, reject) => {
                    var oComponent = this.getOwnerComponent();
                    var ofetchModel = oComponent.getModel("oFetchModel");

                    if (!ofetchModel) {
                        ofetchModel = new sap.ui.model.json.JSONModel();
                        oComponent.setModel(ofetchModel, "oFetchModel");
                    } else {
                        // Clear existing data
                        ofetchModel.setData({ oFetchData: [] });
                    }

                    var ofetch_blankArr = [];
                    var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZEWAYBILL_UPDATE_BIND");
                    var invoicenum = this.getView().byId("Orderfr").getValue();
                    var oFilter = new sap.ui.model.Filter("INVOICENO", "EQ", invoicenum);

                    oModel.read("/ZEWAY_UPDATE_CDS2", {
                        filters: [oFilter],
                        success: function (oresponse) {
                            oresponse.results.forEach(function (item) {
                                var obj = {
                                    "INVOICENO": item.INVOICENO,
                                    "FROMPLACE": item.FROMPLACE,
                                    "FROMSTATE": item.FROMSTATE,
                                    "BaseUnit": item.BaseUnit,
                                    "ewbnumber": item.ewbnumber,
                                    "TOPLACE": item.TOPLACE,
                                    "TOSTATE": item.TOSTATE,
                                    "BillingQuantity": item.BillingQuantity
                                };
                                ofetch_blankArr.push(obj);
                            });

                            ofetchModel.setProperty("/oFetchData", ofetch_blankArr);
                            resolve();
                        }.bind(this),
                        error: function (oError) {
                            sap.m.MessageToast.show("Failed to fetch data.");
                            reject(oError);
                        }
                    });
                });
            },

         
            

        });
    });
