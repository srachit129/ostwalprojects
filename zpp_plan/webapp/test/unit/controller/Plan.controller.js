/*global QUnit*/

sap.ui.define([
	"zpp_plan/controller/Plan.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Plan Controller");

	QUnit.test("I should test the Plan controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
