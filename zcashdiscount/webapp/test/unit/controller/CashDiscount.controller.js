/*global QUnit*/

sap.ui.define([
	"zcashdiscount/controller/CashDiscount.controller"
], function (Controller) {
	"use strict";

	QUnit.module("CashDiscount Controller");

	QUnit.test("I should test the CashDiscount controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
