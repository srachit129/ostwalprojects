/*global QUnit*/

sap.ui.define([
	"zcreditnotegl/controller/creditnotegl.controller"
], function (Controller) {
	"use strict";

	QUnit.module("creditnotegl Controller");

	QUnit.test("I should test the creditnotegl controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
