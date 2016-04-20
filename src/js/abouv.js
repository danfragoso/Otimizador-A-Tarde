/*global chrome */

(function () {

    'use strict';
    var gsUtils = chrome.extension.getBackgroundPage().gsUtils;

    var readyStateCheckInterval = window.setInterval(function () {
        if (document.readyState === 'complete') {

            window.clearInterval(readyStateCheckInterval);

            var versionEl = document.getElementById('aboutVersion');
            versionEl.innerHTML = 'Esta extensão foi atualizada para a versão ' + chrome.runtime.getManifest().version + ', mas pode ficar tranquilo, tudo está no mesmo lugar no qual você deixou. ';

           
        }
    }, 50);

}());
