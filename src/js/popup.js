/*global chrome */

(function () {

    'use strict';

    function setStatus(status) {
        var statusDetail = '',
            statusIconClass = '',
            message;

        if (status === 'normal') {
            statusDetail = 'Esta aba será suspensa automaticamente.';
            statusIconClass = 'fa fa-clock-o';

        } else if (status === 'special') {
            statusDetail = 'Esta aba não pode ser suspensa.';
            statusIconClass = 'fa fa-remove';

        } else if (status === 'suspended') {
            statusDetail = 'Aba suspensa. <a href="#">Restaurar</a>';
            statusIconClass = 'fa fa-pause';
            message = 'unsuspendOne';

        } else if (status === 'whitelisted') {
            statusDetail = 'Aba com exceção. <a href="#">Remover da lista</a>';
            statusIconClass = 'fa fa-check';
            message = 'removeWhitelist';

        } else if (status === 'formInput') {
            statusDetail = 'Esta aba está tem texto não salvo. <a href="#">Suspender mesmo assim</a>';
            statusIconClass = 'fa fa-edit';
            message = 'undoTempWhitelist';

        } else if (status === 'pinned') {
            statusDetail = 'Esta é uma aba fixa.';
            statusIconClass = 'fa fa-thumb-tack';

        } else if (status === 'tempWhitelist') {
            statusDetail = 'Suspensão de aba pausada. <a href="#">Restaurar</a>';
            statusIconClass = 'fa fa-pause';
            message = 'undoTempWhitelist';

        } else if (status === 'never') {
            statusDetail = 'Suspensão automatica de aba desativada.';
            statusIconClass = 'fa fa-ban';

        } else if (status === 'noConnectivity') {
            statusDetail = 'Sem conexão com a internet.';
            statusIconClass = 'fa fa-pause';

        } else if (status === 'charging') {
            statusDetail = 'Conectado ao carregador.';
            statusIconClass = 'fa fa-pause';
        }

        if (document.getElementsByTagName('a')[0]) {
            document.getElementsByTagName('a')[0].removeEventListener('click');
        }

        document.getElementById('header').style.display = 'block';
        document.getElementById('statusDetail').innerHTML = statusDetail;
        document.getElementById('statusIcon').className = statusIconClass;

        if (message) {
            document.getElementsByTagName('a')[0].addEventListener('click', function (e) {
                chrome.runtime.sendMessage({ action: message });
                chrome.extension.getBackgroundPage().tgs.updateIcon('normal');
                window.close();
            });
        }
    }

    function setWhitelistVisibility(visible) {
        if (visible) {
            document.getElementById('whitelist').style.display = 'block';
        } else {
            document.getElementById('whitelist').style.display = 'none';
        }
    }

    function setPauseVisibility(visible) {
        if (visible) {
            document.getElementById('tempWhitelist').style.display = 'block';
        } else {
            document.getElementById('tempWhitelist').style.display = 'none';
        }
    }

    function setSuspendOneVisibility(visible) {
        if (visible) {
            document.getElementById('suspendOne').style.display = 'block';
        } else {
            document.getElementById('suspendOne').style.display = 'none';
        }
    }

    function setSuspendSelectedVisibility() {
        chrome.tabs.query({highlighted: true, lastFocusedWindow: true}, function (tabs) {
            if (tabs && tabs.length > 1) {
                document.getElementById('suspendSelectedGroup').style.display = 'block';
            } else {
                document.getElementById('suspendSelectedGroup').style.display = 'none';
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('suspendOne').addEventListener('click', function (e) {
            chrome.runtime.sendMessage({ action: 'suspendOne' });
            window.close();
        });
        document.getElementById('suspendAll').addEventListener('click', function (e) {
            chrome.runtime.sendMessage({ action: 'suspendAll' });
            window.close();
        });
        document.getElementById('unsuspendAll').addEventListener('click', function (e) {
            chrome.runtime.sendMessage({ action: 'unsuspendAll' });
            window.close();
        });
        document.getElementById('suspendSelected').addEventListener('click', function (e) {
            chrome.runtime.sendMessage({ action: 'suspendSelected' });
            window.close();
        });
        document.getElementById('unsuspendSelected').addEventListener('click', function (e) {
            chrome.runtime.sendMessage({ action: 'unsuspendSelected' });
            window.close();
        });
        document.getElementById('whitelist').addEventListener('click', function (e) {
            chrome.runtime.sendMessage({ action: 'whitelist' });
            chrome.extension.getBackgroundPage().tgs.updateIcon(false);
            window.close();
        });
        document.getElementById('tempWhitelist').addEventListener('click', function (e) {
            chrome.runtime.sendMessage({ action: 'tempWhitelist' });
            chrome.extension.getBackgroundPage().tgs.updateIcon(false);
            window.close();
        });
        document.getElementById('settingsLink').addEventListener('click', function (e) {
            chrome.tabs.create({
                url: chrome.extension.getURL('options.html')
            });
            window.close();
        });

        chrome.extension.getBackgroundPage().tgs.requestTabInfo(false, function (info) {

            var status = info.status,
                //timeLeft = info.timerUp, // unused
                suspendOneVisible = (status === 'suspended' || status === 'special' || status === 'unknown') ? false : true,
                whitelistVisible = (status !== 'whitelisted' && status !== 'special') ? true : false,
                pauseVisible = (status === 'normal') ? true : false;

            setSuspendSelectedVisibility();
            setSuspendOneVisibility(suspendOneVisible);
            setWhitelistVisibility(whitelistVisible);
            setPauseVisibility(pauseVisible);
            setStatus(status);
        });
    });
}());
