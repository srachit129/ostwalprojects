sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent",
        "sap/ui/model/json/JSONModel",
        'sap/m/MessageToast',
        "sap/m/MessageBox",
    ],
    function (BaseController, UIComponent, JSONModel, MessageToast, MessageBox) {
        "use strict";

        return BaseController.extend("zinvoice.controller.MultipleInvoice", {
            onInit() {

                // this.getView().setModel(oModel, "view1");
                this.getView().setModel(new JSONModel(), "oFicoTableModel");
                this.getView().getModel('oFicoTableModel').setProperty("/aFicoTableItem", []);

                this.getView().setModel(new JSONModel(), "oSdTableModel");
                this.getView().getModel('oSdTableModel').setProperty("/aSDTableItem", []);

                UIComponent.getRouterFor(this).getRoute('MultipleInvoice').attachPatternMatched(this.onReadData, this);
            },

            onReadData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                // oBusyDialog.open();
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var oFirstScreenModel = this.getOwnerComponent().getModel('oMultipleInvoiceModel');

                var documentNo = oFirstScreenModel.getProperty("/DocumentNo")

                var DocumentType = oFirstScreenModel.getProperty("/DocumentType")
                if (DocumentType == "Finance") {
                    this.byId("idButton").setVisible(false);
                    var oTable = this.byId("FiTable");
                    oTable.setVisible(true);
                    var oTable = this.byId("SDTable");
                    oTable.setVisible(false);
                    var oTableModel = this.getView().getModel('oFicoTableModel');
                    var aTableArr = [];
                    var CompanyCode = oFirstScreenModel.getProperty("/CompanyCode")
                    var FiscalYear = oFirstScreenModel.getProperty("/FiscalYear")
                    var aFilter = [];
                    documentNo.map(function (item) {
                        aFilter.push(new sap.ui.model.Filter("DocumentReferenceID", "EQ", item))
                    })
                    aFilter.push(new sap.ui.model.Filter("FiscalYear", "EQ", FiscalYear))
                    aFilter.push(new sap.ui.model.Filter("CompanyCode", "EQ", CompanyCode))
                    var oModel_Finance = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZFI_INVOICE_DATA")
                    oModel_Finance.read("/Fi_Invoice", {
                        filters: [aFilter],
                        success: function (oresponse) {
                            oBusyDialog.close();

                            oresponse.results.map(function (item) {
                                var oGrossAmount = Number(item.IGST) + Number(item.CGST) + Number(item.SGST);
                                var obj = {
                                    Fiscalyear: FiscalYear,
                                    Companycode: CompanyCode,
                                    AccountingDocument: item.AccountingDocument,
                                    AccountingDocumentItem: item.AccountingDocumentItem,
                                    AccountingDocumentItemType: item.AccountingDocumentItemType,
                                    IrnStatus: item.Irn,
                                    AccountingDocumentItemRef: "",
                                    "Ebillno": "",
                                    "Ebillno": "",
                                    AccountingDocumentType: item.AccountDocumentType,
                                    TaxItemAcctgDocItemRef: item.TaxItemAcctgDocItemRef,
                                    TransactionCurrency: item.TransactionCurrency,
                                    HSNCODE: item.HSNCODE,
                                    AckNo: item.AckNo,
                                    AckDate: item.AckDate,
                                    Irn: item.Irn,
                                    BASEAMT: item.BASEAMT,
                                    BITEM: item.BITEM,
                                    TransactionTypeDetermination: item.TransactionTypeDetermination,
                                    IGST: item.IGST,
                                    CGST: item.CGST,
                                    SGST: item.SGST,
                                    Customer: item.Customer,
                                    CustomerName: item.CustomerName,
                                    GST: item.GST,
                                    TOTAL_AMT: item.TOTAL_AMT,
                                    GrossAmount: oGrossAmount,
                                    DocumentReferenceID: item.DocumentReferenceID,
                                    "TransDocNo": "",
                                    "TRANSPORTERNAME": "",
                                    "TRANSID": "",
                                    "Distance": "",
                                    "VEHICLENUMBER": "",
                                }
                                aTableArr.push(obj);
                                oTableModel.setProperty("/aFicoTableItem", aTableArr);

                            })
                        }.bind(this)
                    })

                }
                else if (DocumentType == "Sales") {
                    this.byId("idButton").setVisible(true);
                    var oTable = this.byId("FiTable");
                    oTable.setVisible(false);
                    var oTable = this.byId("SDTable");
                    oTable.setVisible(true);
                    var oTableModel = this.getView().getModel('oSdTableModel');
                    var aTableArr = [];
                    var aFilter = [];
                    documentNo.map(function (item) {
                        aFilter.push(new sap.ui.model.Filter("BillingDocument", "EQ", item))
                    })
                    var oModel_Sales = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/YINVOICE_DATA_BILLING");
                    oModel_Sales.read("/YEINVOICE_CDSS", {
                        filters: [aFilter],
                        success: function (oresponse) {
                            oBusyDialog.close();
                            var oNewResponseArr = [];

                            // this.getView().setModel(new JSONModel(oresponse.results[0]), "oGateEntryHeadModel");
                            console.log(oresponse);
                            if (oresponse.results.length > 0) {

                                oresponse.results.map(function (items) {

                                    if (items.ShippingType === "01") {
                                        var shippingType = "Road"
                                    } else if (items.ShippingType === "03") {
                                        shippingType = "Rail"
                                    } else if (items.ShippingType === "04") {
                                        shippingType = "Sea"
                                    } else if (items.ShippingType === "05") {
                                        shippingType = "Air"
                                    }

                                    var obj = {
                                        "AckNo": items.AckNo,
                                        "AckDate": items.AckDate,
                                        "IrnStatus": items.IrnStatus,
                                        "Irn": items.Irn,
                                        "Ebillno": items.Ebillno,
                                        "EgenDat": items.EgenDat,
                                        "Status": items.Status,
                                        "BillingDocument": items.BillingDocument,
                                        "BillingDocumentItem": items.BillingDocumentItem,
                                        "BILLTOPARTY": items.BILLTOPARTY,
                                        "CustomerName": items.CustomerName,
                                        "billinggstin": items.billinggstin,
                                        "Region": items.Region,
                                        "CityName": items.CityName,
                                        "PostalCode": items.PostalCode,
                                        "SHIPTONAME": items.SHIPTONAME,
                                        "SHIPTOCITY": items.SHIPTOCITY,
                                        "SHIPTOREGION": items.SHIPTOREGION,
                                        "BillingQuantity": items.BillingQuantity,
                                        "BillingQuantityUnit": items.BillingQuantityUnit,
                                        "Assesmentvalue_inGst": items.Assesmentvalue_inGst,
                                        "Assesmentvalue_inIgst": parseFloat(items.Assesmentvalue_inIgst).toFixed(2),
                                        "TaxAmount": items.TaxAmount,
                                        "PostalCode": items.PostalCode,
                                        "billinggstin": items.billinggstin,
                                        "Material": items.Material,
                                        "MaterialDescription": items.MaterialDescription,
                                        "Hsncode": items.Hsncode,
                                        "BillingQuantityUnit": items.BillingQuantityUnit,
                                        "vehicle_no": items.vehicle_no,
                                        "transportdoc_no": items.transportdoc_no,
                                        "TRANSPORTERNAME": items.TRANSPORTERNAME_new,
                                        "TRANSID": items.TRANSID_new,
                                        "Distance": "0",
                                        "Shippingtype": shippingType
                                    }
                                    aTableArr.push(obj)
                                })

                                oTableModel.setProperty("/aSDTableItem", aTableArr);

                                if (oresponse.results[0].Assesmentvalue_inGst === "0.000000000") {
                                    oTableModel.setProperty('/buttonVisible', false);
                                }
                            }
                        }.bind(this),
                        error: function () {
                            oBusyDialog.close();
                        }.bind(this),
                    })
                }

            },

            // Its alredy working without irn Status
            generateEwayBillIrn: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oFirstScreenModel = this.getOwnerComponent().getModel('oMultipleInvoiceModel');
                var DocumentType = oFirstScreenModel.getProperty("/DocumentType")
                var FiTable = this.getView().getModel('oFicoTableModel').getProperty("/aFicoTableItem");
                var SDTable = this.getView().getModel('oSdTableModel').getProperty("/aSDTableItem");

                var oCommonModel = this.getOwnerComponent().getModel("oCommonModel");
                var invoiceValue = oCommonModel.getProperty("/invoiceObject").InvoiceType;
                var companycode = oCommonModel.getProperty("/invoiceObject").idCode;
                var documentnumber = oCommonModel.getProperty("/invoiceObject").BillDoc
                var FiscalYear = oCommonModel.getProperty('/displayObject').FiscalYear;

                var aNewArr = []
                if (DocumentType == "Sales") {
                    for (var D = 0; D < SDTable.length; D++) {
                        var obj = {
                            "invoice": SDTable[D].BillingDocument,
                            "transporter": SDTable[0].TRANSPORTERNAME,
                            "DISTANCE": SDTable[0].Distance,
                            "transportdoc": SDTable[0].TransDocNo,
                            "transportid": SDTable[0].TRANSID,
                            "vehiclenumber": SDTable[0].VEHICLENUMBER,
                            "invoiceType": "Sales",
                        }
                        aNewArr.push(obj)
                    }
                } else if (DocumentType == "Finance") {
                    for (var D = 0; D < FiTable.length; D++) {
                        var obj = {
                            "invoice": FiTable[D].AccountingDocument,
                            "transporter": FiTable[D].TRANSPORTERNAME,
                            "DISTANCE": FiTable[D].Distance,
                            "transportdoc": FiTable[D].TransDocNo,
                            "transportid": FiTable[D].TRANSID,
                            "vehiclenumber": FiTable[D].VEHICLENUMBER,
                            "invoiceType": "Finance",
                            "year": FiscalYear,
                            "comcode": companycode,
                        }
                        aNewArr.push(obj)
                    }
                    console.log(aNewArr)
                }
                var url = "/sap/bc/http/sap/zcl_yeinv_http?Irn=X";
                var username = "ZEINV_USER";
                var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
                $.ajax({
                    url: url,
                    type: "post",
                    data: JSON.stringify({
                        data: aNewArr
                    }),
                    contentType: "application/json; charset=utf-8",
                    traditional: true,
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {
                        oBusyDialog.close();

                        var data = result.split("$$$$")
                        var str = ""
                        for (var i = 0; i < data.length; i++) {
                            str = str + data[i] + "\n\n"
                        }
                        MessageBox.show(str);
                        // MessageBox.success(str, {
                        //     onClose: function (oAction) {
                        //         if (oAction === MessageBox.Action.OK) {
                        //             window.location.reload();
                        //         }
                        //     }
                        // })

                        console.log(result)

                        // MessageBox.show(result, {
                        //     title: "Message",
                        //     emphasizedAction: MessageBox.Action.YES
                        // });

                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }
                });


            },

            generateEwayBillIrn1: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oFirstScreenModel = this.getOwnerComponent().getModel('oMultipleInvoiceModel');
                var DocumentType = oFirstScreenModel.getProperty("/DocumentType")
                var FiTable = this.getView().getModel('oFicoTableModel').getProperty("/aFicoTableItem");
                var SDTable = this.getView().getModel('oSdTableModel').getProperty("/aSDTableItem");

                var oCommonModel = this.getOwnerComponent().getModel("oCommonModel");
                var invoiceValue = oCommonModel.getProperty("/invoiceObject").InvoiceType;
                var companycode = oCommonModel.getProperty("/invoiceObject").idCode;
                var documentnumber = oCommonModel.getProperty("/invoiceObject").BillDoc
                var FiscalYear = oCommonModel.getProperty('/displayObject').FiscalYear;
                var oTableModel = this.getView().getModel('oFicoTableModel');
                var aNewArr = []
                if (DocumentType == "Sales") {
                    for (var D = 0; D < SDTable.length; D++) {
                        var obj = {
                            "invoice": SDTable[D].BillingDocument,
                            "transporter": SDTable[0].TRANSPORTERNAME,
                            "DISTANCE": SDTable[0].Distance,
                            "transportdoc": SDTable[0].TransDocNo,
                            "transportid": SDTable[0].TRANSID,
                            "vehiclenumber": SDTable[0].VEHICLENUMBER,
                            "invoiceType": "Sales",
                        }
                        aNewArr.push(obj)
                    }
                } else if (DocumentType == "Finance") {
                    for (var D = 0; D < FiTable.length; D++) {
                        var obj = {
                            "invoice": FiTable[D].AccountingDocument,
                            "transporter": FiTable[D].TRANSPORTERNAME,
                            "DISTANCE": FiTable[D].Distance,
                            "transportdoc": FiTable[D].TransDocNo,
                            "transportid": FiTable[D].TRANSID,
                            "vehiclenumber": FiTable[D].VEHICLENUMBER,
                            "invoiceType": "Finance",
                            "year": FiscalYear,
                            "comcode": companycode,
                        }
                        aNewArr.push(obj)
                    }
                    // console.log(aNewArr)
                }
                var url = "/sap/bc/http/sap/zcl_yeinv_http?Irn=X";
                var username = "ZEINV_USER";
                var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
                $.ajax({
                    url: url,
                    type: "post",
                    data: JSON.stringify({
                        data: aNewArr
                    }),
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {
                        oBusyDialog.close();

                        var data = result.split("$$$$")
                        console.log(data)

                        var str = ""
                        var newData = [];
                        for (var i = 0; i < data.length; i++) {
                            str = str + data[i] + "\n\n"
                            //new
                            let originalString = data[i];
                            let cleanedString = originalString.trim().replace(/\s+/g, ' ');
                            newData.push(cleanedString)
                        }
                        for (var D = 0; D < FiTable.length; D++) {
                            var docu = FiTable[D].AccountingDocument + " IRN Generated";
                            console.log(docu)
                            if (newData.includes(docu) == true) {
                                FiTable[D].IrnStatus = docu;
                            }
                        }
                        oTableModel.setProperty("/aFicoTableItem", FiTable)
                        MessageBox.show(str);
                        // MessageBox.success(str, {
                        //     onClose: function (oAction) {
                        //         if (oAction === MessageBox.Action.OK) {
                        //             window.location.reload();
                        //         }
                        //     }
                        // })

                        console.log(result)

                        // MessageBox.show(result, {
                        //     title: "Message",
                        //     emphasizedAction: MessageBox.Action.YES
                        // });

                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }
                });


            },
            generateEwayBill1: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Generating",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oTableModel = this.getView().getModel('oTableItemModel');
                var tableModel = oTableModel.getProperty('/aTableItem');

                var oCommonModel = this.getOwnerComponent().getModel("oCommonModel");
                var invoiceValue = oCommonModel.getProperty("/invoiceObject").InvoiceType;


                var billingdoc = tableModel[0].BillingDocument;
                var eway = tableModel[0].Ebillno;
                var transportname = tableModel[0].TRANSPORTERNAME;
                var transdoc = tableModel[0].transportdoc_no;
                var vehiclenum = tableModel[0].vehicle_no;
                var transid = tableModel[0].TRANSID;
                var distance = tableModel[0].Distance;

                // url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?Irn=X&eway=X&invoice=90000001&transporter=3556667&DISTANCE=600";
                // https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?Irn=X&eway=X&invoice=90000001&transporter=3556667&DISTANCE=600&transportdoc=&transportid=&vehiclenumber=
                var irn = "x";

                var url1 = "/sap/bc/http/sap/zcl_yeinv_http?Eway=X";
                var url2 = "&eway=";
                var url3 = "&invoice=";
                var url4 = "&transporter=";
                var url5 = "&DISTANCE=";
                var url6 = "&transportdoc=";
                var url7 = "&transportid=";
                var url8 = "&vehiclenumber=";
                var url9 = "&invoiceType="


                var url10 = url2 + eway;
                var url11 = url3 + billingdoc;
                var url12 = url4 + transportname;
                var url13 = url5 + distance;
                var url14 = url6 + transdoc;
                var url15 = url7 + transid;
                var url16 = url8 + vehiclenum;
                var url17 = url9 + invoiceValue;



                var url = url1 + url10 + url11 + url12 + url13 + url14 + url15 + url16 + url17;

                var username = "ZEINV_USER";
                var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
                $.ajax({
                    url: url,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {

                        console.log(result)
                        oBusyDialog.close();
                        MessageBox.show(result, {
                            title: "Message",
                            emphasizedAction: MessageBox.Action.YES
                        });

                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }
                });

            },
            generateEwayBill: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Generating",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oFirstScreenModel = this.getOwnerComponent().getModel('oMultipleInvoiceModel');
                var DocumentType = oFirstScreenModel.getProperty("/DocumentType")
                var FiTable = this.getView().getModel('oFicoTableModel').getProperty("/aFicoTableItem");
                var SDTable = this.getView().getModel('oSdTableModel').getProperty("/aSDTableItem");

                var oCommonModel = this.getOwnerComponent().getModel("oCommonModel");
                var invoiceValue = oCommonModel.getProperty("/invoiceObject").InvoiceType;
                var companycode = oCommonModel.getProperty("/invoiceObject").idCode;
                var documentnumber = oCommonModel.getProperty("/invoiceObject").BillDoc
                var FiscalYear = oCommonModel.getProperty('/displayObject').FiscalYear;

                var aNewArr = []
                if (DocumentType == "Sales") {
                    // for (var D = 0; D < SDTable.length; D++) {
                    aNewArr.push({
                        "invoice": SDTable[0].BillingDocument,
                        "transporter": SDTable[0].TRANSPORTERNAME,
                        "DISTANCE": SDTable[0].Distance,
                        "transportdoc": SDTable[0].TransDocNo,
                        "transportid": SDTable[0].TRANSID,
                        "vehiclenumber": SDTable[0].VEHICLENUMBER,
                        "invoiceType": "Sales",
                    })
                    // }
                } else if (DocumentType == "Finance") {
                    for (var D = 0; D < FiTable.length; D++) {
                        aNewArr.push({
                            "invoice": FiTable[D].AccountingDocument,
                            "transporter": FiTable[0].TRANSPORTERNAME,
                            "DISTANCE": FiTable[0].Distance,
                            "transportdoc": FiTable[0].TransDocNo,
                            "transportid": FiTable[0].TRANSID,
                            "vehiclenumber": FiTable[0].VEHICLENUMBER,
                            "invoiceType": "Finance",
                            "year": FiscalYear,
                            "comcode": companycode,
                        })
                    }
                }

                var url = "/sap/bc/http/sap/zcl_yeinv_http?Eway=X";

                var username = "ZEINV_USER";
                var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
                $.ajax({
                    url: url,
                    type: "GET",
                    data: JSON.stringify(aNewArr),
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {
                        oBusyDialog.close();

                        var data = result.split("$$$$")
                        var str = ""
                        for (var i = 0; i < data.length; i++) {
                            str = str + data[i] + "\n\n"
                        }
                        MessageBox.show(str);

                        // MessageBox.success(str, {
                        //     onClose: function (oAction) {
                        //         if (oAction === MessageBox.Action.OK) {
                        //             window.location.reload();
                        //         }
                        //     }
                        // })

                        console.log(result)

                        // oBusyDialog.close();
                        // MessageBox.show(result, {
                        //     title: "Message",
                        //     emphasizedAction: MessageBox.Action.YES
                        // });

                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }
                });

            },
        });
    }
);
