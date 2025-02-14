sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    'sap/m/SearchField',
    "sap/m/Token",
    "recipts/zrecipts/libs/jszip.min",
    "recipts/zrecipts/libs/FileSaver.min"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, JSONModel, MessageBox, SearchField, Token) {
        "use strict";

        return Controller.extend("recipts.zrecipts.controller.PrGr", {
            onInit: function () {
                var oView = this.getView();
                var oMultiInput1 = oView.byId("GoodsReceiptNo");
                var fnValidator = function (args) {
                    var text = args.text.toUpperCase();

                    return new Token({ key: text, text: text });
                };
                oMultiInput1.addValidator(fnValidator);
            },
            next: function () {

                var radiobutton = this.getView().byId("idActionRadioBtnGroup").getSelectedButton().getText();

                if (radiobutton == "Purchase Requistions") {
                    this.PrPrint();
                } else if (radiobutton == "Goods Recipts") {
                    this.GRPrint();
                }
            }, 

            onPrint: function (){
                var GoodsReceiptNo = this.getView().byId("GoodsReceiptNo").getTokens();
                var year = this.getView().byId("ye").getValue();
                var GoodsReceiptNo = GoodsReceiptNo.map(function (oToken) {
                    return oToken.getText();
                });
                GoodsReceiptNo.sort(function (a, b) {
                    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                });
                if(GoodsReceiptNo.length == 1){
                    this.onSinglePrint();
                } else if(GoodsReceiptNo.length > 1){
                    this.onMultiplePrint();
                } else if(GoodsReceiptNo.length == 0){
                    MessageBox.error("Please Enter AtLeast One Goods Receipt No")
                }
            },
            onSinglePrint: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var GoodsReceiptNo = this.getView().byId("GoodsReceiptNo").getTokens();
                var year = this.getView().byId("ye").getValue();
                var GoodsReceiptNo = GoodsReceiptNo.map(function (oToken) {
                    return oToken.getText();
                });
                GoodsReceiptNo.sort(function (a, b) {
                    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                });
                // https://my402099.s4hana.cloud.sap/sap/bc/http/sap/zmm_gr_link?sap-client=080&matdoc=5000000236&Year=2022
                // /sap/bc/http/sap/zmm_gr_link?sap-client=080&matdoc=&Year=

                var url1 = "/sap/bc/http/sap/zmm_gr_link?sap-client=100";
                var url2 = "&matdoc=";
                var url3 = "&Year=";
                var url6 = "&PrintType=Single";

                var url4 = url2 + GoodsReceiptNo;
                var url5 = url3 + year;

                var url = url1 + url4 + url5 + url6;

                // var username = "nvlabap3";
                // var password = "Mike$1245";
                $.ajax({
                    url: url,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        // xhr.username = username;
                        // xhr.password = password;
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
                    }.bind(this)
                });

            },



            onMultiplePrint: function () {
                var oModel = this.getView().getModel();
                var zip = new JSZip();
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var GoodsReceiptNo = this.getView().byId("GoodsReceiptNo").getTokens();
                var year = this.getView().byId("ye").getValue();
                var GoodsReceiptNo = GoodsReceiptNo.map(function (oToken) {
                    return oToken.getText();
                });
                GoodsReceiptNo.sort(function (a, b) {
                    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                });
                var url1 = "/sap/bc/http/sap/zmm_gr_link?sap-client=100";
                var url2 = "&matdoc=";
                var url3 = "&Year=";
                var url6 = "&PrintType=Multiple";

                var url4 = url2 + GoodsReceiptNo;
                var url5 = url3 + year;

                var url = url1 + url4 + url5 + url6;
                $.ajax({
                    url: url,
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
                            zip.file(`document_${GoodsReceiptNo[index]}.pdf`, combinedBase64, { base64: true });
                        }.bind(this));

                        zip.generateAsync({ type: "blob" }).then(function (blob) {
                            // Create a data URL for the zip file
                            var dataUrl = URL.createObjectURL(blob);

                            // Create a link element and trigger the download
                            var link = document.createElement("a");
                            link.href = dataUrl;
                            link.download = "GoodsReceiptNo.zip" || "GoodsReceiptNo.zip";
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



        });
    });
