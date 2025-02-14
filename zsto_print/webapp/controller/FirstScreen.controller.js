sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("zstoprint.controller.FirstScreen", {
            onInit: function () {

            },
            Call_StoPrint: function(){
                var PO_Number = this.getView().byId("PO_Number").getValue();
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                
                // https://my405122.s4hana.cloud.sap:443/sap/bc/http/sap/ZSTOSERVICE?sap-client=080
                var url1 = "/sap/bc/http/sap/ZSTOSERVICE?sap-client=080";
                var url2 = "&PoNumber=";
                var url3 = url2 + PO_Number;
                var url = url1 + url3;
                $.ajax({
                    url: url,
                    type: "GET",
                    // beforeSend: function (xhr) {
                    //     xhr.withCredentials = true;
                    //     // xhr.username = username;
                    //     // xhr.password = password;
                    // },
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
                    error(){
                        oBusyDialog.close();
                        MessageBox.error("Print Is Not Call")
                    }
                });


            },
        });
    });
