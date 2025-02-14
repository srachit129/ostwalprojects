/*global QUnit*/

sap.ui.define([
	"recipts/zrecipts/controller/PrGr.controller"
], function (Controller) {
	"use strict";

	QUnit.module("PrGr Controller");

	QUnit.test("I should test the PrGr controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
