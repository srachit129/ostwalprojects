sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/Token"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, Token) {
        "use strict";

        return Controller.extend("zqualityassurance.controller.View1", {
            onInit: function () {
                var obj = {
                    "visible": false,
                    "rawmaterialvisible": true
                }
                this.getView().setModel(new sap.ui.model.json.JSONModel(obj), "oMaterialModel")

                var oView = this.getView();
                var oMultiInput1 = oView.byId("idMaterial");
                var fnValidator = function (args) {
                    var text = args.text;

                    return new Token({ key: text, text: text });
                };
                oMultiInput1.addValidator(fnValidator)

                var oMultiInput2 = oView.byId("idRawMaterial");
                var fnValidator1 = function (args) {
                    var text1 = args.text;

                    return new Token({ key: text1, text: text1 });
                };
                oMultiInput2.addValidator(fnValidator1)

            },
            ChangePlantAcoordingCompanyCode: function () {
                var combobox1 = this.getView().byId("companycode").getValue();
                if (combobox1 != "1000" && combobox1 != "2000" && combobox1 != "3000" && combobox1 != "4000") {
                    MessageBox.error("Please Select Valid Company Code")
                } else {

                    if (combobox1 === "1000") {
                        this.getView().byId("plant").setValue("1001");
                        var oCompCode = {
                            CompanyCode: [
                                {
                                    Key: 1,
                                    Description: "1001"
                                },
                                {
                                    Key: 2,
                                    Description: "1002"
                                }
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oCompCode), "oCompanyCode");

                    } else if (combobox1 === "2000") {
                        this.getView().byId("plant").setValue("2001");
                        var oCompCode = {
                            CompanyCode: [
                                {
                                    Key: 3,
                                    Description: "2001"
                                },
                                {
                                    Key: 4,
                                    Description: "2002"
                                },
                                {
                                    Key: 5,
                                    Description: "2003"
                                },
                                {
                                    Key: 6,
                                    Description: "2004"
                                },
                                {
                                    Key: 7,
                                    Description: "2005"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oCompCode), "oCompanyCode");
                    } else if (combobox1 === "3000") {
                        this.getView().byId("plant").setValue("3001");
                        var oCompCode = {
                            CompanyCode: [
                                {
                                    Key: 8,
                                    Description: "3001"
                                },
                                {
                                    Key: 9,
                                    Description: "3002"
                                },
                                {
                                    Key: 10,
                                    Description: "3003"
                                },
                                {
                                    Key: 11,
                                    Description: "3004"
                                },
                                {
                                    Key: 12,
                                    Description: "3005"
                                },
                                {
                                    Key: 13,
                                    Description: "3006"
                                },
                                {
                                    Key: 14,
                                    Description: "3007"
                                },
                                {
                                    Key: 15,
                                    Description: "3008"
                                },
                                {
                                    Key: 16,
                                    Description: "3009"
                                },
                                {
                                    Key: 17,
                                    Description: "3010"
                                },
                                {
                                    Key: 18,
                                    Description: "3011"
                                },
                                {
                                    Key: 19,
                                    Description: "3012"
                                },
                                {
                                    Key: 20,
                                    Description: "3013"
                                },
                                {
                                    Key: 21,
                                    Description: "3014"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oCompCode), "oCompanyCode");
                    } else if (combobox1 === "4000") {
                        this.getView().byId("plant").setValue("4001");
                        var oCompCode = {
                            CompanyCode: [
                                {
                                    Key: 22,
                                    Description: "4001"
                                },
                                {
                                    Key: 23,
                                    Description: "4002"
                                },
                                {
                                    Key: 24,
                                    Description: "4003"
                                },
                                {
                                    Key: 25,
                                    Description: "4004"
                                },
                                {
                                    Key: 26,
                                    Description: "4005"
                                },
                                {
                                    Key: 27,
                                    Description: "4006"
                                },
                                {
                                    Key: 28,
                                    Description: "4007"
                                },
                                {
                                    Key: 29,
                                    Description: "4008"
                                },
                            ]
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oCompCode), "oCompanyCode");
                    }
                }
            },

            onSelect: function () {
                var radioButton = this.getView().byId("radioButton").getSelectedIndex();
                if (radioButton === 1) {
                    this.getView().getModel("oMaterialModel").setProperty("/visible", false)
                    this.getView().getModel("oMaterialModel").setProperty("/rawmaterialvisible", true)
                } else {
                    this.getView().getModel("oMaterialModel").setProperty("/visible", true)
                    this.getView().getModel("oMaterialModel").setProperty("/rawmaterialvisible", false)
                }
            },

            PrintForm: function () {
                var plant = this.getView().byId("plant").getValue();
                var postdateFrom = this.getView().byId("postdateFrom").getValue();
                var postdateTo = this.getView().byId("postdateTo").getValue();
                var companycode = this.getView().byId("companycode").getValue();
                var radioButton = this.getView().byId("radioButton").getSelectedIndex();

                var material = this.getView().byId("idMaterial").getTokens();
                var rawmaterial = this.getView().byId("idRawMaterial").getTokens();

                var materialcode = material.map(function (oToken) {
                    return oToken.getText();
                });

                var rawmaterial = rawmaterial.map(function (oToken) {
                    return oToken.getText();
                });


                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                if (plant != "" && postdateFrom != "" && postdateTo != "" && companycode != "") {

                    oBusyDialog.open();
                    if (radioButton === 0) {
                        var RadioButton = "Raw";
                        var materialdata = ""
                        var rawmaterialdata = rawmaterial
                    }
                    else {
                        RadioButton = "FG";
                        materialdata = materialcode
                        rawmaterialdata = ""
                    }
                    // else if (radioButton === 1) {
                    //     var RadioButton = "";
                    // }
                    // var postdateFrom1 = postdateFrom.split("-")
                    // if (postdateFrom1[1].length != 2) {
                    //     var postdateFrom2 = postdateFrom1[2] + 0 + postdateFrom1[1] + postdateFrom1[0]
                    // } else {
                    //     postdateFrom2 = postdateFrom1[2] + postdateFrom1[1] + postdateFrom1[0]
                    // }
                    // var postdateTo1 = postdateTo.split("-")
                    // if (postdateTo1[1].length != 2) {
                    //     var postdateTo2 = postdateTo1[2] + 0 + postdateTo1[1] + postdateTo1[0]
                    // } else {
                    //     postdateTo2 = postdateTo1[2] + postdateTo1[1] + postdateTo1[0]
                    // }
                    var url1 = "/sap/bc/http/sap/ZPP_QUALITY_ASSURANCE?sap-client=080";
                    var url2 = "&plant=" + plant + "&date1=" + postdateFrom +
                        "&date2=" + postdateTo + "&radiobutton=" + RadioButton +
                        "&companycode=" + companycode + "&material=" + materialdata + "&rawmaterial=" + rawmaterialdata;

                    var url = url1 + url2;

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
