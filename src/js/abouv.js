/*global chrome */

(function () {

    'use strict';
    var gsUtils = chrome.extension.getBackgroundPage().gsUtils;

    var readyStateCheckInterval = window.setInterval(function () {
        if (document.readyState === 'complete') {

            window.clearInterval(readyStateCheckInterval);

            var versionEl = document.getElementById('aboutVersion');
            versionEl.innerHTML = 'Esta extens�o foi atualizada para a vers�o ' + chrome.runtime.getManifest().version + ', mas pode ficar tranquilo, tudo est� no mesmo lugar no qual voc� deixou. ';

           
        }
    }, 50);

}());
