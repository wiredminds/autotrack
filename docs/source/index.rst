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

* Schritt 1: Vergewissern Sie sich, dass der wiredminds Tracking Code verbaut ist
* Schritt 2: Inkludieren Sie die Datei wm_autotrack.min.js
* Schritt 3: Starten Sie Autotrack

**a. Installation über Bower**

.. code-block:: bash

  bower install wm_autotrack

.. code-block:: html

  <!-- Make sure that the wiredminds tracking code is added to your page as well -->
  <script type="text/javascript" src="bower_components/wm_autotrack/dist/wm_autotrack.min.js"></script>
  <script>
      var wmAutoTrackObj = new wmAutoTrack({
            /* Options */
            trackDownloadsWithPath: false
      });

      /* do not change below this line */
      if (window.addEventListener) {
          window.addEventListener('load', wmAutoTrackObj.init, false);
      } else if (window.attachEvent) {
          window.attachEvent('onload', wmAutoTrackObj.init);
      }
  </script>

**b. Manuelle Installation**

`wm_autotrack.min.js <https://raw.githubusercontent.com/wiredminds/autotrack/master/dist/wm_autotrack.min.js>`_
Datei auf dem Webserver hochladen und im auf jede Seite einbinden.

.. code-block:: html

    <!-- Make sure that the wiredminds tracking code is added to your page as well -->
    <script type="text/javascript" src="wm_autotrack.min.js"></script>
    <script>
        var wmAutoTrackObj = new wmAutoTrack({
              /* Options */
              trackDownloadsWithPath: false
        });

        /* do not change below this line */
        if (window.addEventListener) {
            window.addEventListener('load', wmAutoTrackObj.init, false);
        } else if (window.attachEvent) {
            window.attachEvent('onload', wmAutoTrackObj.init);
        }
    </script>


**Optionen**

    *File Downloads*

    - ``trackDownloadsWithPath: true``
    - ``pathPageDownloads: "DL"``
    - ``pathEventDownloads: "DL"``
    - ``milestoneDownloads: "Downloads"``

    *Externe Links*

    - ``trackExternalLinksAsEvents: false``
    - ``trackExternalLinksWithPath: false``
    - ``trackExternalLinksFullUrl: false``
    - ``pathPageExternalLinks: "ExternalLink"``
    - ``pathEventExternalLinks: "ExternalLink"``
    - ``milestoneExternalLinks: ""``

    *MailTo*

    - ``trackMailtoWithPath: false``
    - ``trackMailLinkAsEvents: false``
    - ``pathPageMailto: "MailTo"``
    - ``pathEventMailto: "MailTo"``
    - ``milestoneMailto: ""``

    *Debug*

    - ``debug: false``

Beispiele
---------
`Autotrack einbauen <../../../examples/index.html>`_

Meilensteine
------------

Das Download Tracking Script beinhaltet auch das automatische Setzen von Meilensteinen,
die das ausführen des Script in LeadLab Sales dokumentieren.

Es werden folgende Meilensteine gesetzt:

- beim Klick auf eine Datei oder ein Dokument wird der Meilenstein „Downloads“ gesetzt
- beim Klick auf eine E-Mail Adresse wird der Meilenstein „MailTo“ gesetzt


Disclaimer
----------

Bitte testen Sie abschließend mit unterschiedlichen Browsern, ob das Tracking tatsächlich überall funktioniert.

wiredminds übernimmt keine Haftung dafür, dass das Skript in Ihrer Umgebung funktioniert.


Konflikte mit anderen JavaScripts auf Ihren Seiten sind möglich, da das Download-Tracking-Script mit DOM Manipulation arbeitet.
Sie können die angehängte Datei beliebig auf Ihre Umgebung anpassen, wir können jedoch kein Support dafür leisten, wenn die Einbindung nicht oder nicht wie gewünscht funktionieren sollte.
Eine Anpassung des Scripts auf Ihre Umgebung/Wünsche können wir nicht vornehmen.

.. toctree::
   :maxdepth: 2
