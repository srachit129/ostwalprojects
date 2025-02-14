/*global QUnit*/

sap.ui.define([
	"zcustomer_vender_statement/controller/Customer_Vender_Statement.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Customer_Vender_Statement Controller");

	QUnit.test("I should test the Customer_Vender_Statement controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
