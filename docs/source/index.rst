.. autotrack documentation master file, created by
   sphinx-quickstart on Tue Dec  1 15:42:49 2015.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Automatisches Download Tracking
=====================================

Downloads (bspw. pdf, zip, doc Dateien) lassen sich daraufhin automatisch tracken ohne dass jeder Datei-Link manuell mit einem extra Tracking Code versehen werden muss.

Voraussetzungen hierfür sind:

- die Dateien werden direkt verlinkt (nicht über eine Weiterleitung oder JavaScript)
- die Dateien öffnen sich in einem neuen Fenster.

Installation
------------

Via Bower

.. code-block:: bash

  bower install wm_autotrack

.. code-block:: html

  <script type="text/javascript" src="bower_components/wm_autotrack/dist/wm_autotrack.min.js"></script>

Manuell

Bite die wm_autotrack.min.js JavaScript Datei auf dem Webserver hochladen und im auf jede Seite einbinden.

.. code-block:: html

    <!-- Make sure that the wiredminds tracking code is added to your page as well -->
    <script type="text/javascript" src="../dist/wm_autotrack.min.js"></script>

    <script>
        var wmAutoTrackObj = new wmAutoTrack({
              // add options here
              trackDownlodsWithPath: false
        });

        // no not modify below this line
        // init autotrack
        if (window.addEventListener) {
            window.addEventListener('load', wmAutoTrackObj.init, false);
        } else if (window.attachEvent) {
            window.attachEvent('onload', wmAutoTrackObj.init);
        }
    </script>

Funktionen des Skriptes:

- autom. Tracking von Dokumenten/Dateien
- autom. Tracking von externen Links (Outbound Links)
- autom. Tracking von "mailto" links (E-Mail Adressen)

Optionen
--------

.. code-block:: javascript

    // every download name will include the path to it, defaults is "Downloads|"
    trackDownlodsWithPath: false,

    // wm_page_name prefix
    pathPageDownloads: 'DL|',

    // event prefix
    pathEventDownloads: 'DL/',

    // milestone name: if empty string no milestone will be set
    milestoneDownloads: 'Downloads',

    /** external link tracking configuration **/
    // track external links as events (false to be tracked as pages)
    trackExtLinksAsEvents: false,

    // true for every external link to include the path to it, defaut is "ExtLink|"
    trackExtlinksWithPath: false,

    // true for every external link to include the full url instead of only the domain.
    trackExtlinksFullUrl: false,

    // wm_page_name prefix
    pathPageExtlinks: 'ExtLink|',

    // event prefix
    pathEventExtlinks: 'ExtLinks/',

    // milestone name: if empty, no milestone will be set
    milestoneExtlinks: '',

    // true for every external link to include the path to it, default path is "MailTo|"
    trackMailtoWithPath: false,

    // track mailto links as events, if false, they will be tracked as pages
    trackMailLinkAsEvents: false,

    // wm_page_name prefix
    pathPageMailto: 'MailTo|',

    // events prefix
    pathEventMailto: 'MailTo/',

    // milestone name: if empty string no milestone will be set
    milestoneMailto: '',ö

    // toggle console debug
    debug: false

Meilensteine
------------

Es werden automatisch folgende Meilensteine gesetzt (kann in de JS Datei angepasst werden):

- „Downloads“ - wenn eine Datei/Dokument angeklickt wird
- „E-Mail Angeklickt“ - wenn eine E-Mail Adresse angeklickt wird

Bitte testen Sie abschließend mit unterschiedlichen Browsern, ob das Tracking tatsächlich überall funktioniert.

wiredminds übernimmt keine Haftung dafür, dass das Skript in Ihrer Umgebung funktioniert.


Konflikte mit anderen JavaScripts auf Ihren Seiten sind möglich, da das Download-Tracking-Script mit DOM Manipulation arbeitet.
Sie können die angehängte Datei beliebig auf Ihre Umgebung anpassen, wir können jedoch kein Support dafür leisten, wenn die Einbindung nicht oder nicht wie gewünscht funktionieren sollte.
Eine Anpassung des Scripts auf Ihre Umgebung/Wünsche können wir nicht vornehmen.

.. toctree::
   :maxdepth: 2
