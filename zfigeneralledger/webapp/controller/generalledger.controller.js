sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "zfigeneralledger/js/xlsx.min",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, MessageBox, MessageToast, Spreadsheet, Export, ExportTypeCSV, Fragment, Filter, FilterOperator) {
        "use strict";
        return Controller.extend("zfigeneralledger.controller.generalledger", {
            onInit: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel");
                this.getView().getModel('oTableDataModel').setProperty("/aTableData", []);
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZTESTING_REPORT_BINDING");
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oGlDescriptionModel");
                oModel.read("/zgl_description", {
                    // filters: [oFilter],
                    urlParameters: { "$top": "100000" },
                    success: function (oresponse) {
                        this.getView().getModel("oGlDescriptionModel").setProperty("/aGlDescriptionData", oresponse.results)
                    }.bind(this)
                })
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oSupplierNameData");
                oModel.read("/zSupp_description", {
                    // filters: [oFilter],
                    urlParameters: { "$top": "100000" },
                    success: function (oresponse) {
                        oBusyDialog.close();
                        this.getView().getModel("oSupplierNameData").setProperty("/aSupplierName", oresponse.results)
                    }.bind(this)
                })
            },
            ExcelDataUpload: function () {
                var that = this;
                var SupplierData = this.getView().getModel("oSupplierNameData").getProperty("/aSupplierName");
                var GLData = this.getView().getModel("oGlDescriptionModel").getProperty("/aGlDescriptionData");
                var excelData = {};
                var oTableModel = this.getView().getModel("oTableDataModel");
                var aTableArr = oTableModel.getProperty("/aTableData");
                var dialog = new sap.m.Dialog({
                    title: 'Upload',
                    type: 'Message',
                    icon: 'sap-icon://upload',
                    content: [
                        new sap.ui.unified.FileUploader({
                            width: '100%',
                            uploadUrl: 'upload/',
                            change: function (oEvent) {
                                var file = oEvent.getParameter('files')[0];
                                if (file && window.FileReader) {
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        var data = e.target.result;
                                        var workbook = XLSX.read(data, {
                                            type: 'binary',
                                            cellDates: true,
                                        });
                                        workbook.SheetNames.forEach(function (sheetName) {
                                            excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                                        });
                                        for (var D = 0; D < excelData.length; D++) {
                                            const PostingDate = new Date(excelData[D].PostingDate);
                                            PostingDate.setDate(PostingDate.getDate() + 1);
                                            const DocumentDate = new Date(excelData[D].DocumentDate);
                                            DocumentDate.setDate(DocumentDate.getDate() + 1);

                                            var obj = {
                                                "SrNo": excelData[D].SrNo,
                                                "PostingDate": `${PostingDate.getFullYear()}-${PostingDate.getMonth() + 1 < 10 ? '0' : ''}${PostingDate.getMonth() + 1}-${PostingDate.getDate() < 10 ? '0' : ''}${PostingDate.getDate()}`,
                                                "DocumentDate": `${DocumentDate.getFullYear()}-${DocumentDate.getMonth() + 1 < 10 ? '0' : ''}${DocumentDate.getMonth() + 1}-${DocumentDate.getDate() < 10 ? '0' : ''}${DocumentDate.getDate()}`,
                                                "CompanyCode": excelData[D].CompanyCode,
                                                "DocumentReferenceID": excelData[D].DocumentReferenceID,
                                                "AcountDocumentType": excelData[D].AcountDocumentType,
                                                "AcountDocumentHeaderText": excelData[D].AcountDocumentHeaderText,
                                                "GL_AccountLineItem": excelData[D].GL_AccountLineItem,
                                                "Customer": excelData[D].Customer,
                                                "Supplier": excelData[D].Supplier,
                                                // "SupplierName": excelData[D].SupplierName,
                                                "SpecialGl": excelData[D].SpecialGl,
                                                "BusinessPlace": excelData[D].BusinessPlace,
                                                "CurrencyRole": excelData[D].CurrencyRole,
                                                "JournalEntryItemAmount": excelData[D].JournalEntryItemAmount,
                                                "TaxType": excelData[D].TaxType,
                                                "TaxCode": excelData[D].TaxCode,
                                                "TDSBase": excelData[D].TDSBase,
                                                "TDSAmount": excelData[D].TDSAmount,
                                                "Currency": excelData[D].Currency,
                                                "GL_Account": excelData[D].GL_Account,
                                                // "GL_Description": excelData[D].GL_Description,
                                                "CostCenter": excelData[D].CostCenter,
                                                "ProfitCenter": excelData[D].ProfitCenter,
                                                "HouseBank": excelData[D].HouseBank,
                                                "HouseBankAccount": excelData[D].HouseBankAccount,
                                                "WBSelement": excelData[D].WBSelement,
                                                "AssignmentReference": excelData[D].Assignment,
                                                "DocumentItemText": excelData[D].ItemText,

                                            }
                                            for (var i = 0; i < SupplierData.length; i++) {
                                                if (SupplierData[i].Supplier == excelData[D].Supplier) {
                                                    obj["SupplierName"] = SupplierData[i].SupplierFullName;
                                                    break;
                                                }
                                            }
                                            for (var i = 0; i < GLData.length; i++) {
                                                if (GLData[i].GLAccount == excelData[D].GL_Account) {
                                                    obj["GL_Description"] = GLData[i].GLAccountLongName;
                                                    break;
                                                }
                                            }
                                            aTableArr.push(obj);
                                        }
                                        oTableModel.setProperty("/aTableData", aTableArr)
                                    };
                                    reader.readAsArrayBuffer(file);
                                }
                                dialog.close();
                            },
                        }),
                    ],

                    endButton: new sap.m.Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        },
                    }),
                });
                dialog.open();
            },
            ExcelTemplateDownload: function () {
                var rows = [{
                    "SrNo": "",
                    "PostingDate": "",
                    "DocumentDate": "",
                    "CompanyCode": "",
                    "DocumentReferenceID": "",
                    "AcountDocumentType": "",
                    "AcountDocumentHeaderText": "",
                    "GL_AccountLineItem": "",
                    "Customer": "",
                    "Supplier": "",
                    "SupplierName": "",
                    "SpecialGl": "",
                    "BusinessPlace": "",
                    "CurrencyRole": "",
                    "JournalEntryItemAmount": "",
                    "TaxType": "",
                    "TaxCode": "",
                    "TDSBase": "",
                    "TDSAmount": "",
                    "Currency": "",
                    "GL_Account": "",
                    "GL_Description": "",
                    "CostCenter": "",
                    "ProfitCenter": "",
                    "HouseBank": "",
                    "HouseBankAccount": "",
                    "WBSelement": "",
                    "Assignment": "",
                    "ItemText": "",

                }]  
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.writeFile(workbook, "JV Post.xlsx");
            },
            AddSingleEmptyRow: function () {
                var oTableModel = this.getView().getModel("oTableDataModel");
                var aTableArr = oTableModel.getProperty("/aTableData");
                aTableArr.push({
                    "SrNo": "",
                    "PostingDate": "",
                    "DocumentDate": "",
                    "CompanyCode": "",
                    "DocumentReferenceID": "",
                    "AcountDocumentType": "",
                    "AcountDocumentHeaderText": "",
                    "GL_AccountLineItem": "",
                    "Customer": "",
                    "Supplier": "",
                    "SupplierName": "",
                    "SpecialGl": "",
                    "BusinessPlace": "",
                    "CurrencyRole": "",
                    "JournalEntryItemAmount": "",
                    "TaxType": "",
                    "TaxCode": "",
                    "TDSBase": "",
                    "TDSAmount": "",
                    "Currency": "",
                    "GL_Account": "",
                    "GL_Description": "",
                    "CostCenter": "",
                    "ProfitCenter": "",
                    "HouseBank": "",
                    "HouseBankAccount": "",
                    "WBSelement": "",
                    "Assignment": "",
                    "ItemText": "",
                    
                })
                oTableModel.setProperty("/aTableData", aTableArr)

            },
            DeleteTables_SelectedRow: function () {
                var aTableArr = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                let newArray = aTableArr.filter((element, index) => !this.getView().byId("FirstTable").getSelectedIndices().includes(index));
                this.getView().getModel("oTableDataModel").setProperty("/aTableData", newArray)
            },

            SaveTableData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                var tabledata = this.getView().getModel("oTableDataModel").getProperty("/aTableData")
                var aNewArr = [];
                tabledata.map(function (items) {
                    var obj = {
                        "SrNo": items.SrNo,
                        "PostingDate": items.PostingDate,
                        "DocumentDate": items.DocumentDate,
                        "CompanyCode": items.CompanyCode,
                        "DocumentReferenceID": items.DocumentReferenceID,
                        "AcountDocumentType": items.AcountDocumentType,
                        "AcountDocumentHeaderText": items.AcountDocumentHeaderText,
                        "GL_AccountLineItem": items.GL_AccountLineItem,
                        "Customer": items.Customer,
                        "Supplier": items.Supplier,
                        "SupplierName": items.SupplierName,
                        "SpecialGl": items.SpecialGl,
                        "BusinessPlace": items.BusinessPlace,
                        "CurrencyRole": items.CurrencyRole,
                        "JournalEntryItemAmount": items.JournalEntryItemAmount,
                        "TaxType": items.TaxType,
                        "TaxCode": items.TaxCode,
                        "TDSBase": items.TDSBase,
                        "TDSAmount": items.TDSAmount,
                        "Currency": items.Currency,
                        "GL_Account": items.GL_Account,
                        "GL_Description": items.GL_Description,
                        "CostCenter": items.CostCenter,
                        "ProfitCenter": items.ProfitCenter,
                        "HouseBank": items.HouseBank,
                        "HouseBankAccount": items.HouseBankAccount,
                        "WBSelement": items.WBSelement,
                        "AssignmentReference":items.AssignmentReference,
                        "DocumentItemText":items.DocumentItemText,

                    }
                    aNewArr.push(obj);

                })
                // var aTableArr = oTableModel.getProperty("/aTableData")

                var data = aNewArr;
                $.ajax({
                    type: "POST",
                    // https://my405122.s4hana.cloud.sap:443/sap/bc/http/sap/zjv_post_bapi?sap-client=080
                    url: "/sap/bc/http/sap/zjv_post_bapi?sap-client=080",
                    data: JSON.stringify(aNewArr),
                    contentType: "application/json; charset=utf-8",
                    traditional: true,
                    success: function (oresponse) {
                        oBusyDialog.close();

                        var data = oresponse.split("$$$$")
                        var str = ""
                        for (var i = 0; i < data.length; i++) {
                            str = str + data[i] + "\n\n"
                        }

                        MessageBox.success(str, {
                            onClose: function (oAction) {
                                if (oAction === MessageBox.Action.OK) {
                                    window.location.reload();
                                }
                            }
                        })
                    },
                    error: function (error) {
                        oBusyDialog.close();
                        console.log(error);
                        MessageBox.error(error, {
                            onClose: function (oAction) {
                                if (oAction === MessageBox.Action.OK) {
                                    window.location.reload();
                                }
                            }
                        });

                    }
                });

            },
            onValueHelpRequest: function (oEvent) {
                var oView = this.getView();
                this.oSource = oEvent.getSource();
                this.sPath = oEvent.getSource().getBindingContext('oTableDataModel').getPath();
                this.sKey = this.oSource.getCustomData()[0].getKey();
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zfigeneralledger.fragment.ValueHelp",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    // this._configValueHelpDialog(this.oSource);
                    if (this.sKey === 'GL_Account') {
                        var oTemplate = new sap.m.StandardListItem({
                            title: "{oGlDescriptionModel>GLAccount}",
                            description: "{oGlDescriptionModel>GLAccountLongName}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: 'oGlDescriptionModel>/aGlDescriptionData',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Material");
                    } else if (this.sKey === 'SupplierCode') {
                        var oTemplate = new sap.m.StandardListItem({
                            title: "{oSupplierNameData>Supplier}",
                            description: "{oSupplierNameData>SupplierFullName}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: 'oSupplierNameData>/aSupplierName',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Supplier Code");
                    }
                    oValueHelpDialog.open();
                }.bind(this));
            },
            onValueHelpDialogClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sPath = oEvent.getParameter("selectedContexts")[0].getPath();
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                //this.oSource = this.byId("productInput");
                if (!oSelectedItem) {
                    this.oSource.resetProperty("value");
                    return;
                }
                if (this.sKey === 'SupplierCode') {
                    this.getView().getModel('oTableDataModel').getProperty(this.sPath).Supplier = oObject.Supplier;
                    this.getView().getModel('oTableDataModel').getProperty(this.sPath).SupplierName = oObject.SupplierFullName;
                    this.getView().getModel('oTableDataModel').setProperty(this.sPath, this.getView().getModel('oTableDataModel').getProperty(this.sPath));
                } else if (this.sKey === 'GL_Account') {
                    this.getView().getModel('oTableDataModel').getProperty(this.sPath).GL_Account = oObject.GLAccount;
                    this.getView().getModel('oTableDataModel').getProperty(this.sPath).GL_Description = oObject.GLAccountLongName;
                    this.getView().getModel('oTableDataModel').setProperty(this.sPath, this.getView().getModel('oTableDataModel').getProperty(this.sPath));
                }
            },
            onSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                if (this.sKey === 'SupplierCode') {
                    var oFilter = new Filter([
                        new Filter("Supplier", FilterOperator.Contains, sValue),
                        new Filter("SupplierFullName", FilterOperator.Contains, sValue)
                    ])
                } else if (this.sKey === 'GL_Account') {
                    var oFilter = new Filter([
                        new Filter("GLAccount", FilterOperator.Contains, sValue),
                        new Filter("GLAccountLongName", FilterOperator.Contains, sValue)
                    ])
                }
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
        });
    });
