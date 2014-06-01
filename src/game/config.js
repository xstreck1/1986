pandaConfig = {
    sourceFolder: 'src',
    mediaFolder: 'media',
    outputFile: 'game.min.js',
    system: {
        orientation: 'landscape',
        rotateMsg: 'Please rotate your device',
        bgColorRotate: '#FFFFFF',
        bgColor: '#000000',
        width: 640,
        height: 480,
        center: false,
    },
    storage: {
        id: 'justaconcept.games.1968'
    }
};

pandaConfig.android = {
    system: {
        center: true
    }
};

pandaConfig.iOS = {
    system: {
        center: true
    }
};

pandaConfig.wp = {
    system: {
        center: true
    }
};