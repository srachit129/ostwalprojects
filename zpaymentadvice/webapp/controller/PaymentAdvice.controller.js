sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("zpaymentadvice.controller.PaymentAdvice", {
            onInit: function () {
                var oCompanyCode = {
                    ComCode: "1000"
                };
                this.getView().setModel(new sap.ui.model.json.JSONModel(oCompanyCode), "CompanyCode")
            },

            onPrint: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();

                // var url = "https://my402116.s4hana.cloud.sap:443/sap/bc/http/sap/ypayment_advice_http?sap-client=080";
                var fromDate = this.getView().byId("idFrom").getValue();
                var toDate = this.getView().byId("idTo").getValue();
                // var toDate = this.getView().byId("idTo").getValue();
                // var vendor = this.getView().byId("idVendor").getValue();
                var document = this.getView().byId("idDocNo").getValue();
                var comcode = this.getView().byId("idCode").getValue();
                var remark = this.getView().byId("idRemark").getValue();
                var checkBoxValue = this.getView().byId("idCheckBox").getSelected();

                if(fromDate === "" || toDate === "" || document === "" || comcode === ""){
                    oBusyDialog.close();
                    MessageBox.show("Fields marked mandatory can't be left empty", {
                        title: "Warning",
                        icon: MessageBox.Icon.ERROR
                    });
                }
                else{

                    if(checkBoxValue === true){
                        var checkBox = "X"
                    }else{
                        var checkBox = "";
                    }
    
                    // var oFromDate = fromDate.replace(/-/g, "");
                    // var oToDate = toDate.replace(/-/g, "");
    
                    // var oDate = new Date(fromDate);
                    // var fromdate = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                    // var oFromDate = fromdate.toISOString().slice(0, 16);
    
                    // var oDate1 = new Date(toDate);
                    // var todate = new Date(oDate1.getTime() - oDate1.getTimezoneOffset() * 60000);
                    // var oToDate = todate.toISOString().slice(0, 16);
    
                    // var dateObject = new Date(fromDate);
                    // var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYYMMdd" });
                    // var fromdateFormatted = dateFormat.format(dateObject);
    
                    // var dateObject1 = new Date(toDate);
                    // var dateFormat1 = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYYMMdd" });
                    // var todateFormatted = dateFormat1.format(dateObject1);
    
                    var date = fromDate;
                    var ToDate = toDate;
    
                    var url1 = "/sap/bc/http/sap/ypayment_advice_http?sap-client=080";
                    var url2 = "&fromdate=";
                    var url3 = "&todate=";
                    // var url4 = "&vendor=";
                    var url5 = "&document=";
                    var url6 = "&comcode=";
                    var url7 = "&remark=";
                    var url8 = "&clearingDocument=";
    
                    var url9 = url2 + date;
                    var url10 = url3 + ToDate;
                    // var url11 = url4 + vendor;
                    var url12 = url5 + document;
                    var url13 = url6 + comcode;
                    var url14 = url7 + remark;
                    var url15 = url8 + checkBox;
                    
    
                    var url = url1 + url9 + url10 + url12 + url13 + url14 + url15;
    
                    $.ajax({
                        url: url,
                        type: "GET",
    
                        success: function (response) {
                            if (response.slice(0, 5) === "ERROR") {
                                oBusyDialog.close();
                                MessageBox.error(response);
                            } else {
                                var decodedPdfContent = atob(response);
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
                        error: function () {
                            oBusyDialog.close();
                        }
                    })
                }

            },
            onMail: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();

                var fromDate = this.getView().byId("idFrom").getValue();
                var toDate = this.getView().byId("idTo").getValue();

                var document = this.getView().byId("idDocNo").getValue();
                var comcode = this.getView().byId("idCode").getValue();
                var remark = this.getView().byId("idRemark").getValue();
                var checkBoxValue = this.getView().byId("idCheckBox").getSelected();

                if (!toDate) {
                    oBusyDialog.close();
                    return MessageBox.error("Clear Fiscal Year Field is Mandatory...");
                }
                if (checkBoxValue === true) {
                    var checkBox = "X"
                } else {
                    var checkBox = "";
                }
                

                var date = fromDate;
                var ToDate = toDate;
                var url1 = "/sap/bc/http/sap/ypayment_advice_http?sap-client=080&printType=X";

                var url2 = "&fromdate=";
                var url3 = "&todate=";
                var url5 = "&document=";
                var url6 = "&comcode=";
                var url7 = "&remark=";
                var url8 = "&clearingDocument=";

                var url9 = url2 + date;
                var url10 = url3 + ToDate;
                var url12 = url5 + document;
                var url13 = url6 + comcode;
                var url14 = url7 + remark;
                var url15 = url8 + checkBox;

                var url = url1 + url9 + url10 + url12 + url13 + url14 + url15;

                $.ajax({
                    url: url,
                    type: "GET",
                    success: function (response) {
                       new MessageBox.success(response);
                       oBusyDialog.close();

                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }
                })
            },
        });
    });
