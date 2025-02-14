/*global QUnit*/

sap.ui.define([
	"zmaintaincirculartmg/controller/maintaincircularnum.controller"
], function (Controller) {
	"use strict";

	QUnit.module("maintaincircularnum Controller");

	QUnit.test("I should test the maintaincircularnum controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
