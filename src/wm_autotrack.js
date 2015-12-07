var wmAutoTrack = function(options) {

  var options = options || {};

  // track downloads as events (false to be tracked as pages)
  this.trackDownlodsAsEvents = options.trackDownlodsAsEvents || false;

  // every download name will include the path to it, defaults is "Downloads|"
  this.trackDownlodsWithPath = options.trackDownlodsWithPath || false;

  // wm_page_name prefix
  this.pathPageDownloads = options.pathPageDownloads || 'DL|';

  // event prefix
  this.pathEventDownloads = options.pathEventDownloads || 'DL/';

  // milestone name: if empty string no milestone will be set
  this.milestoneDownloads = options.milestoneDownloads || 'Downloads';

  /** external link tracking configuration **/
  // track external links as events (false to be tracked as pages)
  this.trackExtLinksAsEvents = options.trackExtLinksAsEvents || false;

  // true for every external link to include the path to it, defaut is "ExtLink|"
  this.trackExtlinksWithPath = options.trackExtlinksWithPath || false;

  // true for every external link to include the full url instead of only the domain.
  this.trackExtlinksFullUrl = options.trackExtlinksFullUrl || false;

  // wm_page_name prefix
  this.pathPageExtlinks = options.pathPageExtlinks || 'ExtLink|';

  // event prefix
  this.pathEventExtlinks = options.pathEventExtlinks || 'ExtLinks/';

  // milestone name: if empty, no milestone will be set
  this.milestoneExtlinks = options.milestoneExtlinks || '';

  /** mailto link tracking configuration **/
  // true for every external link to include the path to it, default path is "MailTo|"
  this.trackMailtoWithPath = options.trackMailtoWithPath || false;

  // track mailto links as events, if false, they will be tracked as pages
  this.trackMailLinkAsEvents = options.trackMailLinkAsEvents || false;

  // wm_page_name prefix
  this.pathPageMailto = options.pathPageMailto || 'MailTo|';

  // events prefix
  this.pathEventMailto = options.pathEventMailto || 'MailTo/';

  // milestone name: if empty string no milestone will be set
  this.milestoneMailto = options.milestoneMailto || '';

  // toggle console debug
  this.debug = options.debug || false;

  // Revert the values changed by autotrack script to its original ones.
  // NOTE: Requires the wiredminds tracking object to be already loaded, otherwise nothing will be reverted!
  // If disabled, it can lead to unforeseen results in tracked strings.
  this.revertChangedValues = options.revertChangedValues || true;

  // Save the scope
  var scope = this;

  /**
   * Initiliaze the download tracking and add the event handler to the "a" elements
   */
  this.init = function() {

    var links = document.getElementsByTagName('a');
    var linkPathname = '';
    var sourceURL = window.location.hostname;

    // For each link in the page, add corresponding tracking event
    for (var i = 0; i < links.length; i++) {
      var currentLink = links[i];
      // add tracking
      try {
        var linkURL = currentLink.href;
        var currentDestinURL = currentLink.hostname;
        linkPathname = currentLink.pathname;

        // check each type of link: 1. mailTo
        if (linkURL.match(/^mailto:/i)) {
          scope.logme('Tracking ' + i + ' ' + linkURL + ' as MailTo');
          var tmpEmail = linkURL.split('mailto:');
          var eMail = tmpEmail[1]; // remove 'mailto:' from the string and leave only the e-mail address
          var wmElemType = 'mailto';

          // Add an event listener to the current link with an anonymous function as handler to keep the current
          // params captured in a closure.
          scope.addListener(currentLink, function(wmElemType, eMail) {
            // Return the function to be called on event
            return function() {
              scope.logme('A MAILTO was clicked!');
              scope.wiredmindsTrack(wmElemType, eMail);
            };
          }(wmElemType, eMail));

        } else if (scope.compareDomains(currentDestinURL, sourceURL)) {
          // check each type of link: 2. Document
          if (linkPathname.match(/\.(pdf|txt|doc|docx|xls|xlsx|ppt|pptx|js|vsd|vxd|css|rar|zip|tar|gz|dmg|exe|wma|mov|avi|wmv|mp3|mp4|vcf)$/i)) {
            scope.logme('Tracking ' + i + ' ' + linkURL + ' as DOC');
            // Track an internal link (a file)
            var filePath = '/' + linkPathname;
            var fileDetails = filePath.split('/');
            var fileFullname = fileDetails[(fileDetails.length - 1)];
            var wmElemType = 'download';
            // Add an event listener to the current link with an anonymous function as handler to keep the current
            // params captured in a closure.
            scope.addListener(currentLink, function(wmElemType, fileFullname) {
              //Return the function to be called on event
              return function() {
                scope.logme('A FILE was clicked!');
                scope.wiredmindsTrack(wmElemType, fileFullname);
              };
            }(wmElemType, fileFullname));
          }

        } else {
          // check each type of link: 3. ExernalLink
          scope.logme('Tracking ' + i + ' ' + linkURL + ' as EXTLINK');
          // Track an external link
          var fileFullname = currentDestinURL;
          // Use the full URL
          if (scope.trackExtlinksFullUrl === true) {
            fileFullname = linkURL;
          }
          var wmElemType = 'extlink';

          // Add an event listener to the current link with an anonymous function as handler to keep the current
          // params captured in a closure.
          scope.addListener(currentLink, function(wmElemType, fileFullname) {
            // Return the function to be called on event
            return function() {
              scope.logme('An ExtLink was clicked!');
              scope.wiredmindsTrack(wmElemType, fileFullname);
            };
          }(wmElemType, fileFullname));
        }
      } catch (err) {
        scope.logme('Tracking error: ' + err);
      }
    }
  };

  /**
   * Adds the passed handler function to the passed link for mousedown event
   *
   * @param {Object} link
   * @param {Function} handler
   */
  this.addListener = function(link, handler) {
    if (link.addEventListener) {
      link.addEventListener('mousedown', handler, true);
    } else if (link.attachEvent) {
      link.attachEvent('on' + 'mousedown', handler);
    };
  };

  /**
   * Reqister the tracking request
   *
   * @param {string} elementType
   * @param {string} eventname
   */
  this.wiredmindsTrack = function(elementType, eventname) {

    // If wiredminds is not defined, just return
    if (typeof wiredminds == 'undefined') {
      return;
    }

    // If value changes should be reverted after the tracking request got send
    if (scope.revertChangedValues === true) {
      try {
        if (typeof wiredminds.getTrackParam === 'function') {
          // Fetch the original values to be able to reset them again after autotrack tracking
          var origPageName = wiredminds.getTrackParam('wm_page_name');
          var origMilestone = wiredminds.getTrackParam('wm_milestone');
        } else {
          scope.logme('Unable to fetch original values for reset, disabling revert.');
          scope.revertChangedValues = false;
        }
      } catch (ex) {
        scope.logme('Unable to fetch original values for reset, disabling revert.');
        scope.revertChangedValues = false;
      }
    }

    //Track Downloads
    if (elementType == 'download') {
      if (scope.trackDownlodsAsEvents) {
        wiredminds.push(['trackEvent', scope.pathEventDownloads + eventname]);
      } else {
        if (scope.trackDownlodsWithPath) {
          if (scope.milestoneDownloads !== '') {
            wiredminds.push(['setTrackParam', 'wm_milestone', scope.milestoneDownloads]);
          }
          wiredminds.push(['count', eventname]);
        } else {
          wiredminds.push(['setTrackParam', 'wm_page_name', scope.pathPageDownloads + eventname]);
          if (scope.milestoneDownloads !== '') {
            wiredminds.push(['setTrackParam', 'wm_milestone', scope.milestoneDownloads]);
          }
          wiredminds.push(['count']);
        }
      }
    }
    //Track External Links
    if (elementType == 'extlink') {
      if (scope.trackExtLinksAsEvents) {
        wiredminds.push(['trackEvent', scope.pathEventExtlinks + eventname]);

      } else {
        if (scope.trackExtlinksWithPath) {
          if (scope.milestoneExtlinks !== '') {
            wiredminds.push(['setTrackParam', 'wm_milestone', scope.milestoneExtlinks]);
          }
          wiredminds.push(['count', eventname]);
        } else {
          wiredminds.push(['setTrackParam', 'wm_page_name', scope.pathPageExtlinks + eventname]);
          if (scope.milestoneExtlinks !== '') {
            wiredminds.push(['setTrackParam', 'wm_milestone', scope.milestoneExtlinks]);
          }
          wiredminds.push(['count']);
        }
      }
    }
    //Track Mailtos
    if (elementType == 'mailto') {
      if (scope.trackMailLinkAsEvents) {
        wiredminds.push(['trackEvent', scope.pathEventMailto + eventname]);

      } else {
        if (scope.trackMailtoWithPath) {
          if (scope.milestoneMailto !== '') {
            wiredminds.push(['setTrackParam', 'wm_milestone', scope.milestoneMailto]);
          }
          wiredminds.push(['count', eventname]);
        } else {
          wiredminds.push(['setTrackParam', 'wm_page_name', scope.pathPageMailto + eventname]);
          if (scope.milestoneMailto !== '') {
            wiredminds.push(['setTrackParam', 'wm_milestone', scope.milestoneMailto]);
          }
          wiredminds.push(['count']);
        }
      }
    }

    // Reset to the original values
    if (scope.revertChangedValues === true) {
      wiredminds.push(['setTrackParam', 'wm_page_name', origPageName]);
      wiredminds.push(['setTrackParam', 'wm_milestone', origMilestone]);
    }
  };

  /**
   * If passed urls have the same domain
   *
   * @param {string} url1
   * @param {string} url2
   * @return {boolean}
   */
  this.compareDomains = function(url1, url2) {
    return scope.getDomain(url1) == scope.getDomain(url2);
  };

  /**
   * Get domain from passed URL
   *
   * @param {string} strURL
   * @returns {string}
   */
  this.getDomain = function(strURL) {
    var index = strURL.lastIndexOf('.');
    index = strURL.lastIndexOf('.', index - 1);

    var topDomain = strURL.substring(index + 1);
    return topDomain;
  };

  /**
   * Do a console.log if in debug mode and available
   *
   * @param {string} myString
   */
  this.logme = function(myString) {
    if ((scope.debug == true) && (typeof (console) !== 'undefined') && (console !== null)) {
      console.log(myString);
    }
  };
};
