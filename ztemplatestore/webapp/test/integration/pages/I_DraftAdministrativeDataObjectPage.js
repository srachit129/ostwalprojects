sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'ztemplatestore',
            componentId: 'I_DraftAdministrativeDataObjectPage',
            contextPath: '/I_DraftAdministrativeData'
        },
        CustomPageDefinitions
    );
});