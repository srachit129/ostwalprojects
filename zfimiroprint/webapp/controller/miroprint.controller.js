sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("zfimiroprint.controller.miroprint", {
            onInit: function () {

            },

            onPrint: function () {
                var companycode = this.getView().byId("idCompanyCode").getValue();
                var documentno = this.getView().byId("idDocno").getValue();
                var fiscalyear = this.getView().byId("idFiscal").getValue();

                if (companycode === "" || documentno === "" || fiscalyear === "") {
                    MessageBox.error("Fields marked mandatory can't be left empty")
                } else {
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Loading",
                        text: "Please wait"
                    });
                    oBusyDialog.open();
                    var url1 = "/sap/bc/http/sap/zmiro_handler?";
                    var url2 = "&companycode=";
                    var url3 = "&documentno=";
                    var url4 = "&fiscalyear=";

                    var url5 = url2 + companycode;
                    var url6 = url3 + documentno;
                    var url7 = url4 + fiscalyear

                    var url = url1 + url5 + url6 + url7;

                    var username = "MM_PR";
                    var password = "StnzyHzCtneS3ZBP/deJbUjPbLFlUdmNhrPzcPDX";
                    $.ajax({
                        url: url,
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
                            } else {
                                this._PDFViewer = new sap.m.PDFViewer({
                                    width: "auto",
                                    source: _pdfurl
                                });
                                jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
                            }
                            oBusyDialog.close();
                            this._PDFViewer.open();
                        }.bind(this),
                        error: function (oresponse) {
                            oBusyDialog.close();
                        }
                    });
                }
            }
        });
    });
