/*global QUnit*/

sap.ui.define([
	"ztmg_for_quantity_discount/controller/Tmg_For_Quantity_Discount.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Tmg_For_Quantity_Discount Controller");

	QUnit.test("I should test the Tmg_For_Quantity_Discount controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
