
'use strict';

var absolutePath =  /*System.baseURL +*/ './node_modules/';


System.config({
    paths: {
        can: absolutePath + 'can/dist/amd/*.js',
        'can/*': absolutePath + 'can/dist/amd/can/*.js',
        'can-connect': absolutePath + 'can-connect/src/can-connect.js',
        'can-connect/*': absolutePath + 'can-connect/src/*.js',
        'can-fixture': absolutePath + 'can-fixture/fixture.js',
        'can-set': absolutePath + 'can-set/src/set.js',
        'when/es6-shim/Promise': absolutePath + 'when/es6-shim/Promise.js',
        jquery: absolutePath + 'jquery/dist/jquery.js',
        'stmodal': absolutePath + 'stmodal/src/index.js',
        'stmodal/*': absolutePath + 'stmodal/src/js/*.js',

        'stmodal-less': absolutePath + 'stmodal/src/less/main.less',
        'stform': absolutePath + 'stform/src/js/stForm.js',
        'stform/src/js/*': absolutePath + 'stform/src/js/*.js',
        stloader: absolutePath + 'stloader/src/js/index.js',
        'lodash/*': absolutePath + 'lodash/*.js',
        'can/view/*': absolutePath + 'can/dist/amd/can/view/*.js',
        'bootstrap-js/*': absolutePath + 'bootstrap/js/*.js',
        'bootstrap-select-js': absolutePath + 'bootstrap-select/js/bootstrap-select.js',
        'bootstrap-select-less/*': absolutePath + 'bootstrap-select/less/*',
       // 'bootstrap-select-css/*': absolutePath + 'bootstrap-select/dist/css/*',
        'jquery.scrollto': absolutePath + 'jquery.scrollto/jquery.scrollTo.js',
        'visible-element': absolutePath + 'visible-element/index.js',
        'responsive-bootstrap-toolkit': absolutePath + 'responsive-bootstrap-toolkit/bootstrap-toolkit.js',
        'jquery-validation': absolutePath + 'jquery-validation/dist/jquery.validate.js',
        retinajs: absolutePath + 'retinajs/src/retina.js'
    },

    map: {
        'can-fixture': {
            'core': absolutePath + 'can-fixture/core',
            'helpers/helpers': absolutePath + 'can-fixture/helpers/helpers',
            'xhr': absolutePath + 'can-fixture/xhr',
            'store': absolutePath + 'can-fixture/store'
        },
        'can-set': {
            'set-core': absolutePath + 'can-set/src/set-core',
            'comparators': absolutePath + 'can-set/src/comparators',
            'helpers': absolutePath + 'can-set/src/helpers'
        },
        'can-connect': {
            'helpers/helpers': absolutePath + 'can-connect/src/helpers/helpers'
        },
        'stmodal': {
            'js/modal': absolutePath +  'stmodal/src/js/modal',
            'js/templates': absolutePath +  'stmodal/src/js/templates',
            'js/utils/templates': absolutePath +  'stmodal/src/js/utils/templates',
            'less/main.less': 'stmodal-less'
        },
       'stform': {
           // 'stform/src/less/main.less': absolutePath +  'stform/src/less/main.less!',
            //'node_modules/stform/src/js/node_modules/stform/src/less/main.less': absolutePath +  'stform/src/less/main.less!'
        },
        'when': {
            'when/lib/Promise': absolutePath + 'when/lib/Promise',
            'when/lib/decorators/unhandledRejection': absolutePath + 'when/lib/decorators/unhandledRejection',
            'when/env': absolutePath + 'when/lib/env',
            'when/es6-shim/makePromise': absolutePath + 'when/lib/makePromise',
            'when/es6-shim/Scheduler': absolutePath + 'when/lib/Scheduler',
            'when/es6-shim/env': absolutePath + 'when/lib/env',
            'when/format': absolutePath + 'when/lib/format'
        }
    },

    lessOptions: {
        paths: [
           '/node_modules/stmodal/src/less/main.less'
           // '/node_modules/stmodal/src/less/',
           // '/node_modules/stform/src/less/'
        ]
    }
   // packageConfigPaths: ['./node_modules/*/package.json']
});
