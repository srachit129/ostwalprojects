sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/Token",
    "zcreditdebitnote/libs/jszip.min",
    "zcreditdebitnote/libs/FileSaver.min"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, Token) {
        "use strict";

        return Controller.extend("zcreditdebitnote.controller.CreditDebitNote", {
            onInit: function () {
                var oView = this.getView();
                var oMultiInput1 = oView.byId("idDocNum");
                var fnValidator = function (args) {
                    var text = args.text.toUpperCase();

                    return new Token({ key: text, text: text });
                };
                oMultiInput1.addValidator(fnValidator);

            },


            onSinglePrint: function () {
                var date = this.getView().byId("idDate").getValue();
                var oDate = new Date();
                var date1 = oDate.toLocaleDateString().split("/")

                if (date > date1[2]) {
                    MessageBox.error("Incorrect year");
                }
                else {
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Loading",
                        text: "Please wait"
                    });
                    oBusyDialog.open();
                    var Company = this.getView().byId("idComCode").getValue();
                    var DocNumberFrom = this.getView().byId("idDocNum").getTokens();
                    // var DocNumberTo = this.getView().byId("idDocNum1").getValue();
                    var Year = this.getView().byId("idDate").getValue();
                    // var Plant = this.getView().byId("idPlant").getValue();
                    var DocNumberFrom = DocNumberFrom.map(function (oToken) {
                        return oToken.getText();
                    });
                    DocNumberFrom.sort(function (a, b) {
                        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                    });



                    var url1 = "/sap/bc/http/sap/zfi_debitnote?sap-client=080";
                    var url2 = "&comcode=";
                    var url3 = "&docnum=";
                    // var url4 = "&docnumto=";
                    var url5 = "&year=";

                    var url6 = url2 + Company;
                    var url7 = url3 + DocNumberFrom;
                    // var url8 = url4 + DocNumberTo;
                    var url9 = url5 + Year;


                    var url = url1 + url6 + url7 + url9;

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
                        error() {
                            oBusyDialog.close();
                        }
                    });
                }
            },

            // onMultiplePrint: function () {
            //     var oModel = this.getView().getModel();
            //     var zip = new JSZip();
            //     var date = this.getView().byId("idDate").getValue();
            //     var oDate = new Date();
            //     var date1 = oDate.toLocaleDateString().split("/")

            //     if (date > date1[2]) {
            //         MessageBox.error("Incorrect year");
            //     }
            //     else {
            //         var oBusyDialog = new sap.m.BusyDialog({
            //             title: "Loading",
            //             text: "Please wait"
            //         });
            //         oBusyDialog.open();
            //         var Company = this.getView().byId("idComCode").getValue();
            //         var DocNumber = this.getView().byId("idDocNum").getTokens();
            //         var Year = this.getView().byId("idDate").getValue();
            //         // var Plant = this.getView().byId("idPlant").getValue();

            //         var DocNumber = DocNumber.map(function (oToken) {
            //             return oToken.getText();
            //         });
            //         DocNumber.sort(function (a, b) {
            //             return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
            //         });

            //         var url1 = "/sap/bc/http/sap/zfi_debitnote?sap-client=080";
            //         var url2 = "&comcode=";
            //         var url3 = "&docnum=";
            //         var url4 = "&year=";
            //         // var url5 = "&plant="
            //         var url10 = "&PrintType=Multiple="

            //         var url6 = url2 + Company;
            //         var url7 = url3 + DocNumber;
            //         var url8 = url4 + Year;
            //         // var url9 = url5 + Plant;

            //         var url = url1 + url6 + url7 + url8  + url10;

            //         $.ajax({
            //             url: url,
            //             type: "GET",
            //             beforeSend: function (xhr) {
            //                 xhr.withCredentials = true;
            //                 // xhr.username = username;
            //                 // xhr.password = password;
            //             },
            //             success: function (result) {
            //                 // console.log(result)
            //                 oBusyDialog.close();

            //                 var base64 = result.split(",");
            //                 var arr = []
            //                 for (var i = 0; i < base64.length; i++) {
            //                     if (base64[i] != "") {
            //                         arr.push(base64[i])
            //                     }
            //                 }

            //                 arr.forEach(function (base64String, index) {
            //                     // Decode base64 string
            //                     var decodedData = atob(base64String);

            //                     // Convert the binary data to base64
            //                     var combinedBase64 = btoa(decodedData);

            //                     // Add the combined base64 string to the zip file
            //                     zip.file(`document_${companycode[index]}.pdf`, combinedBase64, { base64: true });
            //                 }.bind(this));

            //                 zip.generateAsync({ type: "blob" }).then(function (blob) {
            //                     // Create a data URL for the zip file
            //                     var dataUrl = URL.createObjectURL(blob);

            //                     // Create a link element and trigger the download
            //                     var link = document.createElement("a");
            //                     link.href = dataUrl;
            //                     link.download = "FinancePrint.zip" || "FinancePrint.zip";
            //                     document.body.appendChild(link);
            //                     link.click();
            //                     document.body.removeChild(link);
            //                 });
            //             }.bind(this),
            //             error: function () {
            //                 oBusyDialog.close();
            //             }
            //         });
            //     }

            // },




            onSinglePrint: function () {
                var oModel = this.getView().getModel();
                var zip = new JSZip();

                var date = this.getView().byId("idDate").getValue();
                var oDate = new Date();
                var date1 = oDate.toLocaleDateString().split("/")

                if (date > date1[2]) {
                    MessageBox.error("Incorrect year");
                }
                else {
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Loading",
                        text: "Please wait"
                    });
                    oBusyDialog.open();
                    var Company = this.getView().byId("idComCode").getValue();
                    var DocNumberFrom = this.getView().byId("idDocNum").getTokens();
                    // var DocNumberTo = this.getView().byId("idDocNum1").getValue();
                    var Year = this.getView().byId("idDate").getValue();
                    // var Plant = this.getView().byId("idPlant").getValue();
                    var DocNumberFrom = DocNumberFrom.map(function (oToken) {
                        return oToken.getText();
                    });
                    DocNumberFrom.sort(function (a, b) {
                        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                    });


                    var url1 = "/sap/bc/http/sap/zfi_debitnote?sap-client=080";
                    var url2 = "&comcode=";
                    var url3 = "&docnum=";
                    // var url4 = "&docnumto=";
                    var url5 = "&year=";

                    var url6 = url2 + Company;
                    var url7 = url3 + DocNumberFrom;
                    // var url8 = url4 + DocNumberTo;
                    var url9 = url5 + Year;


                    var url = url1 + url6 + url7 + url9;

                    // var username = "ZEINV_USER";
                    // var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
                    $.ajax({
                        url: url,
                        cache: false,
                        type: "GET",
                        beforeSend: function (xhr) {
                            xhr.withCredentials = true;
                            // xhr.username = username;
                            // xhr.password = password;
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
                                zip.file(`document_${DocNumberFrom[index]}.pdf`, combinedBase64, { base64: true });
                            }.bind(this));

                            zip.generateAsync({ type: "blob" }).then(function (blob) {
                                // Create a data URL for the zip file
                                var dataUrl = URL.createObjectURL(blob);

                                // Create a link element and trigger the download
                                var link = document.createElement("a");
                                link.href = dataUrl;
                                link.download = "Financeprint.zip" || "Financeprint.zip";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            });
                        }.bind(this),
                        error: function () {
                            oBusyDialog.close();
                        }

                    });

                }
            }

        });

    });
