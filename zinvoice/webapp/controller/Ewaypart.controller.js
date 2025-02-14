sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/util/Export",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",

],
    function (Controller,UIComponent, MessageBox, MessageToast, Spreadsheet, Export, FilterOperator, Filter, ExportTypeCSV) {
        "use strict";

        return Controller.extend("zinvoice.controller.Ewaypart", {
            onInit: function () {
                UIComponent.getRouterFor(this).getRoute('Ewaypart').attachPatternMatched(this.setHeaderData, this);
               
                // this.setHeaderData();
            },

            OnAdd: function () {
                var oTableModel = this.getOwnerComponent().getModel("oTableDataModel")
                var aTableArr = oTableModel.getProperty("/aTableData")
                var obj = {

                    "Edit": true,
                    "Vehicle": "",
                    "VehicleQuantity": "",
                    "LRNumber": "",
                    "LRDate": "",
                }
                aTableArr.push(obj);
                oTableModel.setProperty("/aTableData", aTableArr)
            },

            DeleteRow: function () {
                var aTableArr = this.getOwnerComponent().getModel("oTableDataModel").getProperty("/aTableData");
                let newArray = aTableArr.filter((element, index) => !this.getView().byId("table").getSelectedIndices().includes(index));
                this.getOwnerComponent().getModel("oTableDataModel").setProperty("/aTableData", newArray)
            },


            UpdateEWay_old: function () {
                var oTableModel = this.getOwnerComponent().getModel("oTableDataModel")
                var aTableArr = oTableModel.getProperty("/aTableData")

                var oTable = this.getView().byId("table")
                var SelectedIndex = oTable.getSelectedIndices()

                // var aNewArr = []
                // for (var i = 0; i < SelectedIndex.length; i++) {
                //     aNewArr.push(aTableArr[SelectedIndex[i]])
                // }
                var table1 = this.getOwnerComponent().getModel("oTableDataModel").getProperty("/aTableData");
                var VehicleListDetails = []
                // table1.map(function (items) {
                    SelectedIndex.forEach(function (iIndex) {
                        var oContext = oTable.getContextByIndex(iIndex);
                        var oData = oContext.getObject();
                        var obj = {
                            "VehicleNo": oData.VehicleNo,
                            "DocumentNumber": oData.DocumentNumber,
                            "DocumentDate": oData.DocumentDate,
                            "Quantity": oData.Quantity,
                            "Status": oData.Status,
                        }
                        VehicleListDetails.push(obj)
                    })
                // })


                this.getView().byId("idEwayBill").getValue()
                this.getView().byId("idToState").getValue()
                this.getView().byId("idBillingQuant").getValue()

                // https://my405122.s4hana.cloud.sap:443/sap/bc/http/sap/ZEWAYBILLUPDATE_HTTP?sap-client=080

                var url = "/sap/bc/http/sap/ZEWAYBILLUPDATE_HTTP?";
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify({
                        // "EwbNumber": customer,
                        // "FromPlace": this.getView().byId("idFromPlace").getValue(),
                        // "FromState": this.getView().byId("idFromState").getValue(),
                        // "ToPlace": this.getView().byId("idToPlace").getValue(),
                        // "ToState": amount,
                        // "ReasonCode": businessplace,
                        // "ReasonRemark": paymentterm,
                        // "TransMode": baseline,
                        // "TotalQuantity": assignment,
                        // "UnitofMeasurement": this.getView().byId("idBaseUnit").getValue(),
                        // "GroupNumber": spgl,
                        // "VehicleListDetails": ""
                        "EwbNumber": this.getView().byId("idEwayBill").getValue(),
                        "FromPlace": this.getView().byId("idFromPlace").getValue(),
                        "FromState": this.getView().byId("idFromState").getValue(),
                        "ToPlace": this.getView().byId("idToPlace").getValue(),
                        "ToState": this.getView().byId("idToState").getValue(),
                        // "ReasonCode":
                        // "ReasonRemark":
                        // "TransMode":
                        "TotalQuantity": this.getView().byId("idBillingQuant").getValue(),
                        // "UnitofMeasurement":
                        // "GroupNumber":
                        // "VehicleListDetails":
                        "INVOICENO": this.getView().byId("INVOICE").getValue(),
                        "UnitofMeasurement": this.getView().byId("idBaseUnit").getValue(),
                        VehicleListDetails

                    }),
                    contentType: "application/json; charset=utf-8",
                    traditional: true,
                    success: function (oresponse) {

                        // oBusyDialog.close();
                        MessageBox.show(oresponse, {
                            onClose: function (oAction) {
                                if (oAction === MessageBox.Action.OK) {

                                }
                            }.bind(this)
                        })
                    }.bind(this),
                    error: function (error) {
                        // oBusyDialog.close();
                        MessageBox.show(error)
                    }
                });

            },           

            UpdateEWay: function () {
                // Step 1: Get the existing data from the model
                var oTableModel = this.getOwnerComponent().getModel("oTableDataModel");
                var aTableArr = oTableModel.getProperty("/aTableData"); // Existing table data
            
                // Step 2: Get the selected row index
                var oTable = this.getView().byId("table");
                var SelectedIndex = oTable.getSelectedIndices(); // Get selected row indices
            
                if (SelectedIndex.length === 0) {
                    MessageBox.error("Please select a row to update.");
                    return; // Exit if no row is selected
                }
            
                // Assuming you want to check the DocumentNumber from the first selected row
                var iIndex = SelectedIndex[0]; // Get the first selected index
                var documentNumberFromInput = oTable.getRows()[iIndex].getCells()[2].getValue(); // Get DocumentNumber from the selected row
            
                // Step 3: Initialize a flag to check for duplicates
                var isDuplicate = false;
            
                // Step 4: Check if the new DocumentNumber already exists in the table
                aTableArr.forEach(function (item) {
                    // Skip duplicate check if item is editable
                    if (item.Edit === true) {
                        return; // Skip this iteration
                    }
                    if (item.DocumentNumber === documentNumberFromInput) {
                        isDuplicate = true; // Duplicate found
                    }
                });
            
                // Step 5: Handle duplicate case
                if (isDuplicate) {
                    MessageBox.error("LRN Number already exists");
                    return; // Exit if a duplicate is found
                }
            
                // If no duplicate, proceed with the rest of your logic
                var VehicleListDetails = [];
                SelectedIndex.forEach(function (iIndex) {
                    var oContext = oTable.getContextByIndex(iIndex);
                    var oData = oContext.getObject();
                    var obj = {
                        "VehicleNo": oData.VehicleNo,
                        "DocumentNumber": oData.DocumentNumber,
                        "DocumentDate": oData.DocumentDate,
                        "Quantity": oData.Quantity,
                        "Status": oData.Status,
                    };
                    VehicleListDetails.push(obj);
                });
            
                // Gather other input values for your request
                var url = "/sap/bc/http/sap/ZEWAYBILLUPDATE_HTTP?";
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify({
                        "EwbNumber": this.getView().byId("idEwayBill").getValue(),
                        "FromPlace": this.getView().byId("idFromPlace").getValue(),
                        "FromState": this.getView().byId("idFromState").getValue(),
                        "ToPlace": this.getView().byId("idToPlace").getValue(),
                        "ToState": this.getView().byId("idToState").getValue(),
                        "TotalQuantity": this.getView().byId("idBillingQuant").getValue(),
                        "INVOICENO": this.getView().byId("INVOICE").getValue(),
                        "UnitofMeasurement": this.getView().byId("idBaseUnit").getValue(),
                        VehicleListDetails
                    }),
                    contentType: "application/json; charset=utf-8",
                    traditional: true,
                    success: function (oresponse) {
                        MessageBox.show(oresponse, {
                            onClose: function (oAction) {
                                if (oAction === MessageBox.Action.OK) {
                                    // Handle OK action if needed
                                }
                            }.bind(this)
                        });
                    }.bind(this),
                    error: function (error) {
                        MessageBox.show(error);
                    }
                });
            },           
            

            setHeaderData: function () {
                var oFetchModel = this.getOwnerComponent().getModel("oFetchModel");
                var ofetchArr = oFetchModel.getProperty("/oFetchData");

                if (ofetchArr && ofetchArr.length > 0) {
                    var data = ofetchArr[0]; // Assuming you need the first item from the array

                    this.getView().byId("INVOICE").setValue(data.INVOICENO);
                    this.getView().byId("idFromPlace").setValue(data.FROMPLACE);
                    this.getView().byId("idFromState").setValue(data.FROMSTATE);
                    this.getView().byId("idBaseUnit").setValue(data.BaseUnit);
                    this.getView().byId("idEwayBill").setValue(data.ewbnumber);
                    this.getView().byId("idToPlace").setValue(data.TOPLACE);
                    this.getView().byId("idToState").setValue(data.TOSTATE);
                    this.getView().byId("idBillingQuant").setValue(data.BillingQuantity);
                }
            }

        });
    });
