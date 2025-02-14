sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/Dialog",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Text",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, JSONModel, Fragment, Dialog, List, StandardListItem, Text, Button, library, MessageBox) {
        "use strict";

        return Controller.extend("zgateentry.controller.Gate", {
            onInit: function () {
                var oModel = new JSONModel({
                    dDefaultDate: new Date()
                });
                this.getView().setModel(oModel, "view");

                var cal = this.byId("idComCode");
                cal.addDelegate({
                    onAfterRendering: function () {
                        cal.$().find('INPUT').attr('disabled', true);
                    }
                }, cal);

                var cal1 = this.byId("idPlantCombo");
                cal1.addDelegate({
                    onAfterRendering: function () {
                        cal1.$().find('INPUT').attr('disabled', true);
                    }
                }, cal1);

                var oGateType = {
                    GateType: [{
                        Key: "1",
                        Ddescription: "Sales",
                        Domain: "DEL"
                    }, {
                        Key: "2",
                        Ddescription: "Sales Return",
                        Domain: "RDEL"
                    },
                    {
                        Key: "3",
                        Ddescription: "Returnable",
                        Domain: "RGP"
                    },
                    {
                        Key: "4",
                        Ddescription: "Non Returnable",
                        Domain: "NRGP"
                    },
                    {
                        Key: "5",
                        Ddescription: "Purchase",
                        Domain: "WPO"
                    },
                    {
                        Key: "6",
                        Ddescription: "Purchase Return",
                        Domain: "WPOR"
                    },
                        // {
                        //     Key: "7",
                        //     Ddescription: "Sub Contracting"
                        // },
                        // {
                        //     Key: "8",
                        //     Ddescription: "Outside Job"
                        // },
                        // {
                        //     Key: "9",
                        //     Ddescription: "Challan"
                        // },
                        // {
                        //     Key: "10",
                        //     Ddescription: "Inter Unit Transfer"
                        // },
                        // {
                        //     Key: "11",
                        //     Ddescription: "Inter Unit Receipt"
                        // }
                    ],
                    gateInOut: [{
                        Key: "In",
                        Ddescription: "Gate In"
                    }, {
                        Key: "Out",
                        Ddescription: "Gate Out"
                    }],
                    gateNumEditable: false,
                    gateInOutVisible: false,
                    gatePNumVisible: false,
                    plantVisible: true,
                    plantListData: ""
                };
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(oGateType), "oCommonModel");

                var oDate = new Date();
                this.getView().byId('idCreatedOn').setDateValue(oDate);
                this.onReadPlantData();
            },

            onSelect: function () {
                var id = sap.ushell.Container.getService("UserInfo").getId()
                console.log(id)
                var cal1 = this.byId("idPlantCombo");
                cal1.setValue("")
                var combobox = this.getView().byId("idComCode").getSelectedItem().getText();
                if (combobox === "1000") {
                    var oPlant = {
                        Plant: [
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
                    this.getView().setModel(new sap.ui.model.json.JSONModel(oPlant), "oPlantModel")
                }
                else if (combobox === "2000") {
                    var oPlant = {
                        Plant: [
                            {
                                Key: 1,
                                Description: "2001"
                            },
                            {
                                Key: 2,
                                Description: "2002"
                            },
                            {
                                Key: 3,
                                Description: "2003"
                            },
                            {
                                Key: 4,
                                Description: "2004"
                            },
                            {
                                Key: 5,
                                Description: "2005"
                            }
                        ]
                    }
                    this.getView().setModel(new sap.ui.model.json.JSONModel(oPlant), "oPlantModel")
                }
                else if (combobox === "3000") {
                    if (id === "CB9980000108") {
                        var oPlant = {
                            Plant: [
                                {
                                    Key: 1,
                                    Description: "3001"
                                },
                                {
                                    Key: 2,
                                    Description: "3002"
                                }
                            ]
                        }
                    }
                    else if (id === "CB9980000085") {
                        var oPlant = {
                            Plant: [
                                {
                                    Key: 3,
                                    Description: "3003"
                                },
                                {
                                    Key: 4,
                                    Description: "3004"
                                },
                                {
                                    Key: 5,
                                    Description: "3005"
                                },
                                {
                                    Key: 6,
                                    Description: "3006"
                                },
                                {
                                    Key: 7,
                                    Description: "3007"
                                },
                                {
                                    Key: 8,
                                    Description: "3008"
                                },
                                {
                                    Key: 9,
                                    Description: "3009"
                                },
                                {
                                    Key: 10,
                                    Description: "3010"
                                },
                                {
                                    Key: 11,
                                    Description: "3011"
                                },
                                {
                                    Key: 12,
                                    Description: "3012"
                                },
                                {
                                    Key: 13,
                                    Description: "3013"
                                }
                            ]
                        }
                    } else {
                        var oPlant = {
                            Plant: [
                                {
                                    Key: 1,
                                    Description: "3001"
                                },
                                {
                                    Key: 2,
                                    Description: "3002"
                                },
                                {
                                    Key: 3,
                                    Description: "3003"
                                },
                                {
                                    Key: 4,
                                    Description: "3004"
                                },
                                {
                                    Key: 5,
                                    Description: "3005"
                                },
                                {
                                    Key: 6,
                                    Description: "3006"
                                },
                                {
                                    Key: 7,
                                    Description: "3007"
                                },
                                {
                                    Key: 8,
                                    Description: "3008"
                                },
                                {
                                    Key: 9,
                                    Description: "3009"
                                },
                                {
                                    Key: 10,
                                    Description: "3010"
                                },
                                {
                                    Key: 11,
                                    Description: "3011"
                                },
                                {
                                    Key: 12,
                                    Description: "3012"
                                },
                                {
                                    Key: 13,
                                    Description: "3013"
                                },
                                {
                                    Key: 14,
                                    Description: "3014"
                                },
                                {
                                    Key: 15,
                                    Description: "3408"
                                },
                                {
                                    Key: 16,
                                    Description: "3412"
                                },
                                {
                                    Key: 17,
                                    Description: "3413"
                                }
                            ]
                        }
                    }
                    this.getView().setModel(new sap.ui.model.json.JSONModel(oPlant), "oPlantModel")
                }
                else if (combobox === "4000") {
                    var oPlant = {
                        Plant: [
                            {
                                Key: 1,
                                Description: "4001"
                            },
                            {
                                Key: 2,
                                Description: "4002"
                            },
                            {
                                Key: 3,
                                Description: "4003"
                            },
                            {
                                Key: 4,
                                Description: "4004"
                            },
                            {
                                Key: 5,
                                Description: "4005"
                            },
                            {
                                Key: 6,
                                Description: "4006"
                            },
                            {
                                Key: 7,
                                Description: "4007"
                            },
                            {
                                Key: 8,
                                Description: "4008"
                            },
                            {
                                Key: 9,
                                Description: "4409"
                            }
                            
                        ]
                    }
                    this.getView().setModel(new sap.ui.model.json.JSONModel(oPlant), "oPlantModel")
                }

            },

            onReadPlantData: function () {
                var oModel = this.getOwnerComponent().getModel();
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                oModel.read("/zpalnt_data", {
                    urlParameters: {
                        "$top": "5000"
                    },
                    success: function (response) {
                        oCommonModel.setProperty("/plantListData", response.results);
                        oBusyDialog.close();
                    }.bind(this),
                    error: function (oerror) {
                        oBusyDialog.close();
                    }.bind(this)
                });
            },
            onChangeAction: function (oEvent) {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                if (oEvent.getSource().getSelectedButton().getText() !== 'Create') {
                    oCommonModel.setProperty("/gateNumEditable", true);
                }
                else {
                    oCommonModel.setProperty("/gateNumEditable", false);
                    this.getView().byId('idGateEntryNum').setValue("");
                }

                // if (oEvent.getSource().getSelectedButton().getText() !== 'Display') {
                //     oCommonModel.setProperty("/plantVisible", true);
                // }else{
                //     oCommonModel.setProperty("/plantVisible", false);
                // }
            },
            onChangeGateEntryType: function (oEvent) {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                this.getView().byId('idGateInOut').setSelectedKey('');
                if (oEvent.getSource().getSelectedItem().getKey() === '1' || oEvent.getSource().getSelectedItem().getKey() === '2') {
                    oCommonModel.setProperty("/gateInOutVisible", false);
                    oCommonModel.setProperty("/gatePNumVisible", false);
                } else if (oEvent.getSource().getSelectedItem().getKey() === '3') {
                    oCommonModel.setProperty("/gateInOutVisible", true);
                    oCommonModel.setProperty("/gatePNumVisible", false);
                } else if (oEvent.getSource().getSelectedItem().getKey() === '4') {
                    oCommonModel.setProperty("/gateInOutVisible", false);
                    oCommonModel.setProperty("/gatePNumVisible", false);
                } else if (oEvent.getSource().getSelectedItem().getKey() === '5') {
                    oCommonModel.setProperty("/gateInOutVisible", false);
                    oCommonModel.setProperty("/gatePNumVisible", false);
                } else if (oEvent.getSource().getSelectedItem().getKey() === '6') {
                    oCommonModel.setProperty("/gateInOutVisible", false);
                    oCommonModel.setProperty("/gatePNumVisible", false);
                } else if (oEvent.getSource().getSelectedItem().getKey() === '7') {
                    oCommonModel.setProperty("/gateInOutVisible", true);
                    oCommonModel.setProperty("/gatePNumVisible", false);
                } else if (oEvent.getSource().getSelectedItem().getKey() === '8') {
                    oCommonModel.setProperty("/gateInOutVisible", false);
                    oCommonModel.setProperty("/gatePNumVisible", false);
                } else if (oEvent.getSource().getSelectedItem().getKey() === '9') {
                    oCommonModel.setProperty("/gateInOutVisible", false);
                    oCommonModel.setProperty("/gatePNumVisible", false);
                } else if (oEvent.getSource().getSelectedItem().getKey() === '10' || oEvent.getSource().getSelectedItem().getKey() === '11') {
                    oCommonModel.setProperty("/gateInOutVisible", true);
                    oCommonModel.setProperty("/gatePNumVisible", false);
                }
            },
            onPress: function (e) {
                var oModel = this.getView().getModel();
                var gateno = this.getView().byId("idGateEntryNum").getValue();
                var gateinout = this.getView().byId("idGateInOut").getSelectedKey();
                var combobox = this.getView().byId("idGateEntryType").getSelectedItem().getText();
                var radiobutton = this.getView().byId("idActionRadioBtnGroup").getSelectedButton().getText();
                var oPlantCombo = this.getView().byId('idPlantCombo');
                var gatetype = this.getView().byId("idGateEntryType");
                var GateType = this.getView().byId("idGateEntryType").getSelectedItem().getKey();
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var companycode = this.getView().byId("idComCode").getValue();
                var oFilter = new sap.ui.model.Filter("Gateno", "EQ", gateno);
                var oFilter1 = new sap.ui.model.Filter("EntryType", "EQ", GateType);
                var oDisplay = {
                    GateNum: gateno,
                    GateType: this.getView().byId("idGateEntryType").getSelectedItem().getKey(),
                    Action: radiobutton,
                    gatInOutKey: gateinout,
                    companyCode: companycode
                };
                oCommonModel.setProperty('/displayObject', oDisplay);
                // if (oPlantCombo.getSelectedItem()) {
                //     oCommonModel.setProperty('/plantObject', oPlantCombo.getSelectedItem().getBindingContext('oCommonModel').getObject());
                // } else {
                //     oPlantCombo.setValueState('Error');
                // }

                oCommonModel.setProperty('/plantObject', oPlantCombo.getValue())

                if (gatetype.getSelectedItem()) {
                    oCommonModel.setProperty('/typeobject', gatetype.getSelectedItem().getBindingContext('oCommonModel').getObject());
                }
                if (radiobutton == "Create") {
                    UIComponent.getRouterFor(this).navTo("GateEntryDetails");
                } else if (radiobutton == "Display") {
                    if (gateno === "") {
                        MessageBox.error("Enter Gate Entry Number")
                    } else {
                        UIComponent.getRouterFor(this).navTo("GateEntryDetails");
                    }
                } else if (radiobutton == "Gate Out") {
                    oModel.read("/zgat", {
                        filters: [oFilter],
                        success: function (oresponse) {
                            if (oresponse.results[0].Cancelled === "X") {
                                MessageBox.error("Document has already been cancelled")
                            } else {
                                if (gateno === "") {
                                    MessageBox.error("Enter Gate Entry Number")
                                } else {
                                    UIComponent.getRouterFor(this).navTo("GateEntryDetails");
                                }
                            }
                        }.bind(this)
                    })
                } else if (radiobutton == "Change") {
                    oModel.read("/zgat", {
                        filters: [oFilter],
                        success: function (oresponse) {
                            if (oresponse.results[0].Cancelled === "X") {
                                MessageBox.error("Document has already been cancelled")
                            } else {
                                if (gateno === "") {
                                    MessageBox.error("Enter Gate Entry Number")
                                } else {
                                    UIComponent.getRouterFor(this).navTo("GateEntryDetails");
                                }
                            }
                        }.bind(this)
                    })
                } else if (radiobutton == "Print") {
                    if (gateno === "") {
                        MessageBox.error("Enter Gate Entry Number")
                    }
                    else {
                        this.pdfPrint();
                    }
                }
            },

            // selectType: function (e) {
            //     var gateno = sap.ui.getCore().byId(this.createId("idGate")).getValue();
            //     this.getView().getModel("TempDataModel").setProperty("/",{"GateNo":gateno})
            //     var gate = this.getView().byId("idGate");
            //     var idx = e.getParameter("selectedIndex");
            //     var button = e.getSource().getButtons()[idx];
            //     var txt = button.getText();
            //     console.log(txt);

            //     if(txt=="Create"){
            //         gate.setEditable(false);
            //     }else if(txt=="Display"){

            //         UIComponent.getRouterFor(this).navTo("Display");
            //     }
            //     else if(txt=="Gate Out"){
            //         UIComponent.getRouterFor(this).navTo("GateOut");
            //     }
            //     else{
            //         gate.setEditable(true);
            //     }
            // }.bind(this),

            selectType: function (e) {
                var gate = this.getView().byId("idGate");
                var idx = e.getParameter("selectedIndex");
                var button = e.getSource().getButtons()[idx];
                var txt = button.getText();
                console.log(txt);

                if (txt == "Create") {
                    gate.setEditable(false);
                } else {
                    gate.setEditable(true);
                }
            },

            // onCreate: function () {
            //     var oModel = this.getView().getModel();
            //     var oEntry = {};

            //     oEntry.Gateno = this.getView().byId("idGate").getValue();

            //     oModel.create("/Zgate_head1d", oEntry, {
            //         method: "POST",
            //         success: function (data) {
            //             alert("success");
            //         },
            //         error: function (e) {
            //             alert(error)
            //         }
            //     });
            //     UIComponent.getRouterFor(this).navTo("Create");

            // }

            printPDF: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                // var gatenum = this.getView().byId("idGateEntryNum").getValue();
                // var url = "/sap/bc/http/sap/zprint_4m?sap-client=080&f=1000000005";
                // // var url2 = url + gatenum;
                // var username = "ZSAP_4MUSER";
                // var password = "LECapyZCfBppljSuk}TVWLSAUpS7RgmNLLaoFrAS";
                // $.ajax({
                //     url: url,
                //     type: "GET",
                //     beforeSend: function (xhr) {
                //         xhr.withCredentials = true;
                //         xhr.username = username;
                //         xhr.password = password;
                //     },
                //     success: function (result) {
                //         var decodedPdfContent = atob(result);
                //            var byteArray = new Uint8Array(decodedPdfContent.length);
                //            for (var i = 0; i < decodedPdfContent.length; i++) {
                //                byteArray[i] = decodedPdfContent.charCodeAt(i);
                //            }
                //            var blob = new Blob([byteArray.buffer], {
                //                type: 'application/pdf'
                //            });
                //            var _pdfurl = URL.createObjectURL(blob);

                //            if (!this._PDFViewer) {
                //                this._PDFViewer = new sap.m.PDFViewer({
                //                    width: "auto",
                //                    source: _pdfurl
                //                });
                //                jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
                //            }
                //            oBusyDialog.close();
                //            this._PDFViewer.open();
                //     }.bind(this)
                // });

            },

            // onCreate: function () {
            //     var oModel = this.getOwnerComponent().getModel();
            //     var gatenum = this.getView().byId("idGateEntryNum").getValue();
            //     var oFilter = new sap.ui.model.Filter("Gateno", "EQ", gatenum);
            //     oModel.read("/zgateitem_ent", {
            //         filters: [oFilter],
            //         success: function (data) {

            //         }
            //     });
            //     const head = "<form1>";
            //     const address = "<AddressNode><frmBillToAddress><txtLine1>" + +"</txtLine1><txtLine2>" + +"</txtLine2><txtLine3>" + +"</txtLine3><txtLine4>" + +"</txtLine4><txtLine5>" + +"</txtLine5><txtLine6>" + +"</txtLine6><txtLine7>" + +"</txtLine7><txtLine8>" + +"</txtLine8><txtRegion>" + +"</txtRegion><BillToPartyGSTIN>" + +"</BillToPartyGSTIN></frmBillToAddress><frmShipToAddress><txtLine1>" + +"</txtLine1><txtLine2>" + +"</txtLine2><txtLine3>" + +"</txtLine3><txtLine4>" + +"</txtLine4><txtLine5>" + +"</txtLine5><txtLine6>" + +"</txtLine6><txtLine7>" + +"</txtLine7><txtLine8>" + +"</txtLine8><txtRegion>" + +"</txtRegion><ShipToPartyGSTIN>" + +"</ShipToPartyGSTIN></frmShipToAddress><QrCode><QRCodeBarcode1>" + +"</QRCodeBarcode1></QrCode></AddressNode>";
            //     const subform = "<Subform2><DocNo><txtReferenceNumber>" + +"</txtReferenceNumber><txtSalesDocument>" + +"</txtSalesDocument><DeliveryNo>" + +"</DeliveryNo></DocNo><Transporter><LrNo.>" + +"</LrNo.><TruckNo.>" + +"</TruckNo.><Transporter>" + +"</Transporter></Transporter></Subform2>";
            //     const terms = "<Terms><Terms><DeliveryTerms>" + +"</DeliveryTerms><PaymentTerms>" + +"</PaymentTerms></Terms><PricingConditions><Gst>" + +"</Gst><Amount>" + +"</Amount></PricingConditions></Terms>";
            //     const remarks = "<Remarks><Remark>" + +"</Remark><Subform6/></Remarks>";
            //     const end = "</form1>"
            //     var finxml = "";
            //     for (var i = rollsfr; i <= rollsto; i++) {
            //         finxml = finxml + "<Subform3><Table1><HeaderRow/><Row1><Cell1>" + +"</Cell1><MaterialDis.>" + +"</MaterialDis.><HSN>" + +"</HSN><Lot>" + +"</Lot><NoOfPackages>" + +"</NoOfPackages><PackageQty>" + +"</PackageQty><Qty.>" + +"</Qty.><UOM>" + +"</UOM><Rate>" + +"</Rate><TotalAmount>" + +"</TotalAmount></Row1><Row1><Cell1>" + +"</Cell1><MaterialDis.>" + +"</MaterialDis.><HSN>" + +"</HSN><Lot>" + +"</Lot><NoOfPackages>" + +"</NoOfPackages><PackageQty>" + +"</PackageQty><Qty.>" + +"</Qty.><UOM>" + +"</UOM><Rate>" + +"</Rate><TotalAmount>" + +"</TotalAmount></Row1><Row2/></Table1></Subform3>";
            //     };

            //     finxml = head + finxml + end;

            //     var encdata = btoa(finxml);
            //     //prepare the render API call. Pick up the template from template store
            //     var jsondata = "{  " + "\"xdpTemplate\": \"" + "PP_BATCHPRINT/PP_BATCHPRINT" + "\", " + "\"xmlData\": \"" + encdata + "\"}";
            //     // link render
            //     var url_render = "v1/adsRender/pdf?templateSource=storageName";
            //     //make the API call
            //     $.ajax({
            //         url: url_render,
            //         type: "post",
            //         contentType: "application/json",
            //         data: jsondata,
            //         success: function (data, textStatus, jqXHR) {
            //             //once the API call is successfull, Display PDF on screen
            //             var decodedPdfContent = atob(data.fileContent);
            //             var byteArray = new Uint8Array(decodedPdfContent.length);
            //             for (var i = 0; i < decodedPdfContent.length; i++) {
            //                 byteArray[i] = decodedPdfContent.charCodeAt(i);
            //             }
            //             var blob = new Blob([byteArray.buffer], {
            //                 type: 'application/pdf'
            //             });
            //             var _pdfurl = URL.createObjectURL(blob);
            //             if (!this._PDFViewer) {
            //                 this._PDFViewer = new sap.m.PDFViewer({
            //                     width: "auto",
            //                     source: _pdfurl
            //                 });
            //                 jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
            //             }
            //             this._PDFViewer.open();
            //         }.bind(this),
            //         error: function (data) {
            //         }
            //     });
            // }.bind(this)

            // onRead: function () {
            //     var oModel = this.getView().getModel();
            //     var gatenum = this.getView().byId("idGateEntryNum").getValue();
            //     var oFilter = new sap.ui.model.Filter("Gateno", "EQ", gatenum);
            //     var oFilter1 = new sap.ui.model.Filter("Gateno", "EQ", gatenum);
            //     var filters = [];
            //     filters.push(oFilter);
            //     filters.push(oFilter1);

            //     oModel.read("/zgateitem_ent", "/zgat", {
            //         filters: [filters],
            //         success: function (data) {
            //             alert("success");
            //             console.log(data);
            //             var values = data.results;
            //             var len = values.length;
            //             console.log(len);

            //             const head = "<form1>";
            //             const header = "<HaderDate><LeftSide><GateEntryNo>" + data.results[0].Delievery + "</GateEntryNo><OwnVehicle>" + 2 + "</OwnVehicle><GateInDateTime>" + 3 + "</GateInDateTime><GateOutDateTime>" + 4 + "</GateOutDateTime><VehicleName>" + 5 + "</VehicleName><TransporterName>" + 6 + "</TransporterName><DriverName>" + 7 + "</DriverName><DriverLicenseNo>" + 8 + "</DriverLicenseNo></LeftSide><RightSide><OperatorName>" + 9 + "</OperatorName><E-wayBillNoDate>" + 10 + "</E-wayBillNoDate><LRNo.Date>" + 11 + "</LRNo.Date><WeighBridge>" + 12 + "</WeighBridge><VehicleName>" + 13 + "</VehicleName><GrossWeight>" + 14 + "</GrossWeight><TareWeight>" + 15 + "</TareWeight><NetWeight>" + 16 + "</NetWeight><Remarks>" + 17 + "</Remarks></RightSide></HaderDate>";
            //             const subformstart = "<Subform1><Table1><HeaderRow/>";
            //             // const row = "<Row1><Cell1>"+ +"</Cell1><InvoiceNo>"+ +"</InvoiceNo><UOM>"+ +"</UOM><Qty>"+ +"</Qty><Package>"+ +"</Package><Remark>"+ +"</Remark></Row1>";
            //             const subformend = "</Table1></Subform1>";
            //             const end = "</form1>";
            //             var finxml = "";
            //             for (var i = 0; i <= len; i++) {
            //                 finxml = finxml + "<Row1><Cell1>" + 18 + "</Cell1><InvoiceNo>" + 19 + "</InvoiceNo><UOM>" + 20 + "</UOM><Qty>" + 21 + "</Qty><Package>" + 22 + "</Package><Remark>" + 23 + "</Remark></Row1>";
            //             };

            //             finxml = head + header + subformstart + finxml + subformend + end;

            //             var encdata = btoa(finxml);
            //             //prepare the render API call. Pick up the template from template store
            //             var jsondata = "{  " + "\"xdpTemplate\": \"" + "GatePass/GatePass" + "\", " + "\"xmlData\": \"" + encdata + "\"}";
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
            //                     this._PDFViewer.open();
            //                 }.bind(this),
            //                 error: function (data) {
            //                     alert("error");
            //                 }
            //             });
            //         }.bind(this)
            //     });
            // },

            // onRead1: function () {
            //     var oBusyDialog = new sap.m.BusyDialog({
            //         title: "Loading",
            //         text: "Please wait"
            //     });
            //     oBusyDialog.open();
            //     var oModel = this.getView().getModel();
            //     var gatenum = this.getView().byId("idGateEntryNum").getValue();
            //     var oFilter = new sap.ui.model.Filter("Gateno", "EQ", gatenum);
            //     oModel.read("/zgat", {
            //         filters: [oFilter],
            //         success: function (data) {
            //             console.log(data);

            //             oModel.read("/gate_item", {
            //                 filters: [oFilter],
            //                 success: function (result) {
            //                     console.log(result);

            //                     var values = result.results;
            //                     var len = values.length;
            //                     console.log(len);

            //                     const head = "<form1>";
            //                     const header = "<HaderDate><LeftSide><GateEntryNo>" + data.results[0].Gateno + "</GateEntryNo><OwnVehicle>" + data.results[0].VehicalNo + "</OwnVehicle><GateInDateTime>" + data.results.GateInDt + "</GateInDateTime><GateOutDateTime>" + data.results[0].GateOutDt + "</GateOutDateTime><VehicleName>" + 5 + "</VehicleName><TransporterName>" + 6 + "</TransporterName><DriverName>" + data.results[0].Driver + "</DriverName><DriverLicenseNo>" + data.results[0].DrLisc + "</DriverLicenseNo></LeftSide><RightSide><OperatorName>" + data.results[0].Operator + "</OperatorName><E-wayBillNoDate>" + 10 + "</E-wayBillNoDate><LRNo.Date>" + data.results[0].LrNo + "</LRNo.Date><WeighBridge>" + 12 + "</WeighBridge><VehicleName>" + 13 + "</VehicleName><GrossWeight>" + 14 + "</GrossWeight><TareWeight>" + 15 + "</TareWeight><NetWeight>" + 16 + "</NetWeight><Remarks>" + data.results.Remark + "</Remarks></RightSide></HaderDate>";
            //                     const subformstart = "<Subform1><Table1><HeaderRow/>";
            //                     // const row = "<Row1><Cell1>"+ +"</Cell1><InvoiceNo>"+ +"</InvoiceNo><UOM>"+ +"</UOM><Qty>"+ +"</Qty><Package>"+ +"</Package><Remark>"+ +"</Remark></Row1>";
            //                     const subformend = "</Table1></Subform1>";
            //                     const end = "</form1>";
            //                     var finxml = "";
            //                     for (var i = 0; i < len; i++) {
            //                         finxml = finxml + "<Row1><Cell1>" + 18 + "</Cell1><InvoiceNo>" + result.results[i].Zinvoice + "</InvoiceNo><UOM>" + result.results[i].Uom + "</UOM><Qty>" + 21 + "</Qty><Package>" + 22 + "</Package><Remark>" + result.results[i].Remark + "</Remark></Row1>";
            //                     };

            //                     finxml = head + header + subformstart + finxml + subformend + end;

            //                     var encdata = btoa(finxml);
            //                     //prepare the render API call. Pick up the template from template store
            //                     var jsondata = "{  " + "\"xdpTemplate\": \"" + "GatePass/GatePass" + "\", " + "\"xmlData\": \"" + encdata + "\"}";
            //                     // link render
            //                     var url_render = "v1/adsRender/pdf?templateSource=storageName";
            //                     //make the API call
            //                     $.ajax({
            //                         url: url_render,
            //                         type: "post",
            //                         contentType: "application/json",
            //                         data: jsondata,
            //                         success: function (data, textStatus, jqXHR) {
            //                             //once the API call is successfull, Display PDF on screen
            //                             var decodedPdfContent = atob(data.fileContent);
            //                             var byteArray = new Uint8Array(decodedPdfContent.length);
            //                             for (var i = 0; i < decodedPdfContent.length; i++) {
            //                                 byteArray[i] = decodedPdfContent.charCodeAt(i);
            //                             }
            //                             var blob = new Blob([byteArray.buffer], {
            //                                 type: 'application/pdf'
            //                             });
            //                             var _pdfurl = URL.createObjectURL(blob);
            //                             if (!this._PDFViewer) {
            //                                 this._PDFViewer = new sap.m.PDFViewer({
            //                                     width: "auto",
            //                                     source: _pdfurl
            //                                 });
            //                                 jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
            //                             }
            //                             this._PDFViewer.open();
            //                             oBusyDialog.close();
            //                         }.bind(this),
            //                         error: function (data) {
            //                             alert("error");
            //                         }
            //                     })

            //                 }.bind(this)
            //             })


            //         }.bind(this)
            //     })
            // },

            pdfPrint: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var gatenum = this.getView().byId("idGateEntryNum").getValue();
                var url = "/sap/bc/http/sap/zgatehttp_2022?sap-client=080&f=";
                var url2 = url + gatenum;
                var username = "ZSAP_4MUSER";
                var password = "LECapyZCfBppljSuk}TVWLSAUpS7RgmNLLaoFrAS";
                $.ajax({
                    url: url2,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {
                        console.log(result);
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

            getReport: function () {

                // if (!this.oDefaultDialog) {
                //     this.oDefaultDialog = new sap.m.Dialog({
                //         title: "Gate Entry Number",
                //         content: new List({
                //             items: {
                //                 path: "/zgat",
                //                 template: new StandardListItem({
                //                     title: "{Gateno}"
                //                 })
                //             }
                //         }),
                //         endButton: new Button({
                //             text: "Close",
                //             press: function () {
                //                 this.oDefaultDialog.close();
                //             }.bind(this)
                //         })
                //     });

                //     // to get access to the controller's model
                //     this.getView().addDependent(this.oDefaultDialog);
                // }

                // this.oDefaultDialog.open();

                // if (!this.pDialog) {
                //     this.pDialog = this.loadFragment({
                //         name: "zgateentry.fragments.Report"
                //     });
                // }
                // this.pDialog.then(function (oDialog) {
                //     oDialog.open();
                // });
                var oView = this.getView();
                // create dialog lazily
                if (!this.byId("idDialog")) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name: "zgateentry.fragments.Report",
                        controller: this
                    }).then(function (oDialog) {
                        // connect dialog to the root view 
                        //of this component (models, lifecycle)
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                } else {
                    this.byId("idDialog").open();
                }
            },

            onClose: function () {
                if (this.byId("idDialog")) {
                    var oDialogS = this.byId("idDialog");
                    oDialogS.close();
                }
                // sap.ui.getCore().byId("idDialog").close();

            }

        });
    });
