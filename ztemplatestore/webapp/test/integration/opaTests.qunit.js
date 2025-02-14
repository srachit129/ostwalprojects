sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'ztemplatestore/test/integration/FirstJourney',
		'ztemplatestore/test/integration/pages/I_DraftAdministrativeDataList',
		'ztemplatestore/test/integration/pages/I_DraftAdministrativeDataObjectPage'
    ],
    function(JourneyRunner, opaJourney, I_DraftAdministrativeDataList, I_DraftAdministrativeDataObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('ztemplatestore') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheI_DraftAdministrativeDataList: I_DraftAdministrativeDataList,
					onTheI_DraftAdministrativeDataObjectPage: I_DraftAdministrativeDataObjectPage
                }
            },
            opaJourney.run
        );
    }
);