/*global QUnit*/

sap.ui.define([
	"zmm_requisition_code/controller/RequisitionCode.controller"
], function (Controller) {
	"use strict";

	QUnit.module("RequisitionCode Controller");

	QUnit.test("I should test the RequisitionCode controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
