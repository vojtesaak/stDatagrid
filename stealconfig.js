
'use strict';

var absolutePath = System.baseURL.replace(/\/$/, '');

System.paths.can = absolutePath + '/node_modules/can/dist/amd/*.js';
System.paths.jquery = absolutePath + '/node_modules/jquery/dist/jquery.js';
System.paths['stmodal/*'] = absolutePath + '/node_modules/stmodal/src/*.js';
System.paths['stform/*'] = absolutePath + '/node_modules/stform/*.js';
System.paths.stloader = absolutePath + '/node_modules/stloader/src/js/index.js';
System.paths['can/*'] = absolutePath + '/node_modules/can/dist/amd/can/*.js';
System.paths['lodash/*'] = absolutePath + '/node_modules/lodash/*.js';
System.paths['can/view/*'] = absolutePath + '/node_modules/can/dist/amd/can/view/*.js';
System.paths['bootstrap/*'] = absolutePath + '/node_modules/bootstrap/js/*.js';
//System.paths['bootstrap-select-js'] = absolutePath + '/node_modules/bootstrap-select/dist/js/bootstrap-select.js';
System.paths['bootstrap-select-css/*'] = absolutePath + '/node_modules/bootstrap-select/dist/css/*';
System.paths['jquery.scrollto'] = absolutePath + '/node_modules/jquery.scrollto/jquery.scrollTo.js';
System.paths['visible-element'] = absolutePath + '/node_modules/visible-element/index.js';
System.paths['responsive-bootstrap-toolkit'] = absolutePath + '/node_modules/responsive-bootstrap-toolkit/bootstrap-toolkit.js';
System.paths['jquery-validation'] = absolutePath + '/node_modules/jquery-validation/dist/jquery.validate.js';
System.paths.retinajs = absolutePath + '/node_modules/retinajs/src/retina.js';



System.lessOptions = {};
System.lessOptions.paths = [];
System.lessOptions.paths.push('/node_modules/bootstrap/less/');
System.lessOptions.paths.push('/node_modules/bootstrap-select/less/');
System.lessOptions.paths.push('/node_modules/');

//System.config({
//    paths: {
//        '*': 'node_modules/*',
//        'app/*': 'app/*'
//    },
//    packageConfigPaths: ['node_modules/*/package.json'],
//    packages: {
//        'some-node-package': {
//            meta: {
//                '*.json': { loader: 'json-plugin' }
//            },
//            map: {
//                './dir-require/' : './dir-require/index' // etc etc
//            }
//        }
//    }
//});