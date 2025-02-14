sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zsalesorder.controller.SalesOrder", {
            onInit: function () {

            },

            onPress: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var salesordernum = this.getView().byId("idSalesOrder").getValue();

                var url1 = "/sap/bc/http/sap/zsalesorder?"
                var url2 = "&salesorder="

                var url3 = url2 + salesordernum;
                var url = url1 + url3

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
        });
    });
