/*global QUnit*/

sap.ui.define([
	"zmaintenance_plan/controller/First_Screen.controller"
], function (Controller) {
	"use strict";

	QUnit.module("First_Screen Controller");

	QUnit.test("I should test the First_Screen controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
