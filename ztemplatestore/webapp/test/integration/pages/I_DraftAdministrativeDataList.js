sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'ztemplatestore',
            componentId: 'I_DraftAdministrativeDataList',
            contextPath: '/I_DraftAdministrativeData'
        },
        CustomPageDefinitions
    );
});