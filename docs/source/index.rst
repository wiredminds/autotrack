.. autotrack documentation master file, created by
   sphinx-quickstart on Tue Dec  1 15:42:49 2015.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Automatisches Download Tracking
=====================================

Das Download Tracking Script für LeadLab Sales ermöglicht es Ihnen Dokumente oder
Dateien mit bestimmten Endungen (wie zum Beispiel *.pdf *.doc, *.zip, *.exe und weitere) automatisiert zu erfassen.
Weiterhin werden Links, die von Ihrer Website abgehen (Outbound Links) und „mail to“ - Verweise (E-Mail Adressen) automatisiert getrackt.
Durch den Einsatz des Scripts wird vermieden, dass jedes der beschriebenen Elemente mit einer separaten wiredminds Codezeile erfasst werden muss.

**Voraussetzungen**

- der wiredminds Tracking Code ist auf der Seite der Webpräsenz eingebaut
- die Dateien sind direkt verlinkt (nicht über eine Weiterleitung oder JavaScript)
- die zu erfassenden Dateien öffnen sich in einem neuen Fenster

Installation
------------

Schritt 1: Vergewissern Sie sich, dass der wiredminds Tracking Code verbaut ist
Schritt 2: Inkludieren Sie die Datei wm_autotrack.min.js
Schritt 3: Starten Sie Autotrack

**a. Installation über Bower**

.. code-block:: bash

  bower install wm_autotrack

.. code-block:: html

  <!-- Make sure that the wiredminds tracking code is added to your page as well -->
  <script type="text/javascript" src="bower_components/wm_autotrack/dist/wm_autotrack.min.js"></script>
  <script>
      var wmAutoTrackObj = new wmAutoTrack({
            // add options here
            trackDownloadsWithPath: false
      });

      // no not modify below this line
      // init autotrack
      if (window.addEventListener) {
          window.addEventListener('load', wmAutoTrackObj.init, false);
      } else if (window.attachEvent) {
          window.attachEvent('onload', wmAutoTrackObj.init);
      }
  </script>

*Default Einstellungen*

- trackDownloadsWithPath: true
- pathPageDownloads: 'DL|'
- pathEventDownloads: 'DL/'
- milestoneDownloads: 'Downloads'
- trackExtLinksAsEvents: false
- trackExtlinksWithPath: false
- trackExtlinksFullUrl: false
- pathPageExtlinks: 'ExtLink|'
- pathEventExtlinks: 'ExtLinks/'
- milestoneExtlinks: ''
- trackMailtoWithPath: false
- trackMailLinkAsEvents: false
- pathPageMailto: 'MailTo|'
- pathEventMailto: 'MailTo/'
- milestoneMailto: ''
- debug: false

**b. Manuelle Installation**

`wm_autotrack.min.js <https://raw.githubusercontent.com/wiredminds/autotrack/master/dist/wm_autotrack.min.js>`_
Datei auf dem Webserver hochladen und im auf jede Seite einbinden.

.. code-block:: html

    <!-- Make sure that the wiredminds tracking code is added to your page as well -->
    <script type="text/javascript" src="wm_autotrack.min.js"></script>
    <script>
        var wmAutoTrackObj = new wmAutoTrack({
              // add options here
              trackDownloadsWithPath: false
        });

        // no not modify below this line
        // init autotrack
        if (window.addEventListener) {
            window.addEventListener('load', wmAutoTrackObj.init, false);
        } else if (window.attachEvent) {
            window.attachEvent('onload', wmAutoTrackObj.init);
        }
    </script>

Optionen
--------

.. code-block:: javascript

    // every download name will include the path to it, defaults is "Downloads|"
    trackDownloadsWithPath: false,

    // wm_page_name prefix
    pathPageDownloads: 'DL',

    // event prefix
    pathEventDownloads: 'DL',

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
    pathPageExtlinks: 'ExtLink',

    // event prefix
    pathEventExtlinks: 'ExtLinks',

    // milestone name: if empty, no milestone will be set
    milestoneExtlinks: '',

    // true for every external link to include the path to it, default path is "MailTo|"
    trackMailtoWithPath: false,

    // track mailto links as events, if false, they will be tracked as pages
    trackMailLinkAsEvents: false,

    // wm_page_name prefix
    pathPageMailto: 'MailTo',

    // events prefix
    pathEventMailto: 'MailTo',

    // milestone name: if empty string no milestone will be set
    milestoneMailto: '',

    // toggle console debug
    debug: false

Meilensteine
------------

Das Download Tracking Script beinhaltet auch das automatische Setzen von Meilensteinen,
die das ausführen des Script in LeadLab Sales dokumentieren.

Es werden folgende Meilensteine gesetzt:

- beim Klick auf eine Datei oder ein Dokument wird der Meilenstein „Downloads“ gesetzt
- beim Klick auf eine E-Mail Adresse wird der Meilenstein „MailTo“ gesetzt


Bitte testen Sie abschließend mit unterschiedlichen Browsern, ob das Tracking tatsächlich überall funktioniert.

wiredminds übernimmt keine Haftung dafür, dass das Skript in Ihrer Umgebung funktioniert.


Konflikte mit anderen JavaScripts auf Ihren Seiten sind möglich, da das Download-Tracking-Script mit DOM Manipulation arbeitet.
Sie können die angehängte Datei beliebig auf Ihre Umgebung anpassen, wir können jedoch kein Support dafür leisten, wenn die Einbindung nicht oder nicht wie gewünscht funktionieren sollte.
Eine Anpassung des Scripts auf Ihre Umgebung/Wünsche können wir nicht vornehmen.

.. toctree::
   :maxdepth: 2
