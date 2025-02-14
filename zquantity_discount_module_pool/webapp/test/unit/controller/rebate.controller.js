/*global QUnit*/

sap.ui.define([
	"zquantity_discount_module_pool/controller/rebate.controller"
], function (Controller) {
	"use strict";

	QUnit.module("rebate Controller");

	QUnit.test("I should test the rebate controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
