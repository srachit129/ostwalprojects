/*global QUnit*/

sap.ui.define([
	"zcircularnumbertmg/controller/circularnumbertmg.controller"
], function (Controller) {
	"use strict";

	QUnit.module("circularnumbertmg Controller");

	QUnit.test("I should test the circularnumbertmg controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
