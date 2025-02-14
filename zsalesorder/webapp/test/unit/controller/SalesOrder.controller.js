/*global QUnit*/

sap.ui.define([
	"zsalesorder/controller/SalesOrder.controller"
], function (Controller) {
	"use strict";

	QUnit.module("SalesOrder Controller");

	QUnit.test("I should test the SalesOrder controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
