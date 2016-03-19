var wmAutoTrack = function(options) {

  var options = options || {};

  // track downloads as events (false to be tracked as pages)
  this.trackDownlodsAsEvents = options.trackDownlodsAsEvents || false;

  // every download name will include the path to it, defaults is "Downloads|"
  this.trackDownloadsWithPath = options.trackDownloadsWithPath || false;

  // wm_page_name prefix
  this.pathPageDownloads = options.pathPageDownloads || 'Download';

  // event prefix
  this.pathEventDownloads = options.pathEventDownloads || 'Download';

  // milestone name: if empty string no milestone will be set
  this.milestoneDownloads = options.milestoneDownloads || 'Download';

  /** external link tracking configuration **/
  // track external links as events (false to be tracked as pages)
  this.trackExternalLinksAsEvents = options.trackExternalLinksAsEvents || false;

  // true for every external link to include the path to it, defaut is "ExtLink|"
  this.trackExternalLinksWithPath = options.trackExternalLinksWithPath || false;

  // true for every external link to include the full url instead of only the domain.
  this.trackExternalLinksFullUrl = options.trackExternalLinksFullUrl || false;

  // wm_page_name prefix
  this.pathPageExternalLinks = options.pathPageExternalLinks || 'ExternalLink';

  // event prefix
  this.pathEventExternalLinks = options.pathEventExternalLinks || 'ExternalLink';

  // milestone name: if empty, no milestone will be set

  this.milestoneExternalLinks = options.milestoneExternalLinks || '';
  /** mailto link tracking configuration **/
  // true for every external link to include the path to it, default path is "MailTo|"
  this.trackMailtoWithPath = options.trackMailtoWithPath || false;

  // track mailto links as events, if false, they will be tracked as pages
  this.trackMailLinkAsEvents = options.trackMailLinkAsEvents || false;

  // wm_page_name prefix
  this.pathPageMailto = options.pathPageMailto || 'mailto';

  // events prefix
  this.pathEventMailto = options.pathEventMailto || 'mailto';

  // milestone name: if empty string no milestone will be set
  this.milestoneMailto = options.milestoneMailto || '';

  // toggle console debug
  this.debug = options.debug || false;

  // wm_page_name separator
  this._pageSeparator = '|';

  // wm_group_name seaparator
  this._groupSeparator = '/';

  // wm_event seaparator
  this._eventSeparator = '/';

  // wm_milestone separator
  this._milestoneSeparator = '/';

  this._extensions = /\.(pdf|txt|doc|docx|xls|xlsx|ppt|pptx|js|vsd|vxd|css|rar|zip|tar|gz|dmg|exe|wma|mov|avi|wmv|mp3|mp4|vcf)$/i;

  // Revert the values changed by autotrack script to its original ones.
  // NOTE: Requires the wiredminds tracking object to be already loaded, otherwise nothing will be reverted!
  // If disabled, it can lead to unforeseen results in tracked strings.
  this.revertChangedValues = options.revertChangedValues || true;

  this._mailto = 'mailto';
  this._download = 'download';
  this._extlink = 'extlink';

  // Save the scope
  var scope = this;

  /**
   * Initiliaze the download tracking and add the event handler to the "a" elements
   */
  this.init = function() {

    var links = document.getElementsByTagName('a');
    var sourceURL = window.location.hostname;

    // For each link in the page, add corresponding tracking event
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      // add tracking
      try {
        var currentDestinURL = link.hostname;
        // check each type of link: 1. mailTo
        if (scope.isMailTo(link) === true) {
          // mailto
          scope.addMailToListener(link);
        } else if (scope.compareDomains(currentDestinURL, sourceURL)) {
          // downloads
          scope.addDownloadListener(link);
        } else {
          // external links
          scope.addExternalLinkListener(link);
        }
      } catch (err) {
        scope.writeLog('Tracking error: ' + err);
      }
    }
  };

  /**
   * Check if mailto
   *
   * @param {Object} link
   */
  this.isMailTo = function(link) {
    return (link.href.match(/^mailto:/i) !== null);
  };

  /**
   * @param {Object} currentLink
   */
  this.addMailToListener = function(currentLink) {
    var linkURL = currentLink.href;
    scope.writeLog('Tracking ' + linkURL + ' as MailTo');

    var tmpEmail = linkURL.split('mailto:');
    var eMail = tmpEmail[1]; // remove 'mailto:' from the string and leave only the e-mail address
    var wmElemType = 'mailto';

    // Add an event listener to the current link with an anonymous function as handler to keep the current
    // params captured in a closure.
    scope.addListener(currentLink, function(wmElemType, eMail) {
      // Return the function to be called on event
      return function() {
        scope.writeLog('mailto click');
        //scope.wiredmindsTrack(wmElemType, eMail);
        scope.wiredmindsTrack(function() {
          scope.wiredmindsTrackAction(
            scope.trackMailLinkAsEvents,
            scope.trackMailtoWithPath,
            scope.pathPageMailto,
            scope.pathEventMailto,
            scope.milestoneMailto,
            eMail);
        });
      };
    }(wmElemType, eMail));
  };

  /**
   * @param {Object} currentLink
   */
  this.addDownloadListener = function(currentLink) {

    var linkURL = currentLink.href;
    var linkPathname = currentLink.pathname;

    if (linkPathname.match(this._extensions)) {
      scope.writeLog('Tracking ' + linkURL + ' as DOC');
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
          scope.writeLog('file click');
          scope.wiredmindsTrackAction(
            scope.trackDownlodsAsEvents,
            scope.trackDownloadsWithPath,
            scope.pathPageDownloads,
            scope.pathEventDownloads,
            scope.milestoneDownloads,
            fileFullname);
        };
      }(wmElemType, fileFullname));
    }
  };

  /**
   * @param {string} currentLink
   */
  this.addExternalLinkListener = function(currentLink) {
    var linkURL = currentLink.href;
    var currentDestinURL = currentLink.hostname;
    // check each type of link: 3. ExernalLink
    this.writeLog('Tracking ' + linkURL + ' as EXTLINK');
    // Track an external link
    var fileFullname = currentDestinURL;
    // Use the full URL
    if (scope.trackExternalLinksFullUrl === true) {
      fileFullname = linkURL;
    }
    var wmElemType = 'extlink';

    // Add an event listener to the current link with an anonymous function as handler to keep the current
    // params captured in a closure.
    scope.addListener(currentLink, function(wmElemType, fileFullname) {
      // Return the function to be called on event
      return function() {
        scope.writeLog('external link click');
        //scope.wiredmindsTrack(wmElemType, fileFullname);
        scope.wiredmindsTrackAction(
          scope.trackExternalLinksAsEvents,
          scope.trackExternalLinksWithPath,
          scope.pathPageExternalLinks,
          scope.pathEventExternalLinks,
          scope.milestoneExternalLinks,
          fileFullname);
      };
    }(wmElemType, fileFullname));
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
   * @param {fuction} callbackFn
   */
  this.wiredmindsTrack = function(callbackFn) {

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
          scope.writeLog('Unable to fetch original values for reset, disabling revert.');
          scope.revertChangedValues = false;
        }
      } catch (ex) {
        scope.writeLog('Unable to fetch original values for reset, disabling revert.');
        scope.revertChangedValues = false;
      }
    }

    callbackFn();

    // Reset to the original values
    if (scope.revertChangedValues === true) {
      wiredminds.push(['setTrackParam', 'wm_page_name', origPageName]);
      wiredminds.push(['setTrackParam', 'wm_milestone', origMilestone]);
    }
  };

  /**
   * Do count
   *
   * @param {boolean} asEvent Track as event
   * @param {boolean} trackPath Track with path
   * @param {string} prefixPage Page prefix
   * @param {string} prefixEvent Event prefix
   * @param {string} milestone Milestone
   * @param {string} value tracked value
   */
  this.wiredmindsTrackAction = function(asEvent, trackPath, prefixPage, prefixEvent, milestone, value) {

    // If wiredminds is not defined, just return
    if (asEvent === true) {
      var eventVal = [prefixEvent, value].join(scope._eventSeparator);
      wiredminds.push(['trackEvent', eventVal]);
    } else {
      // track milestone
      if (milestone !== '') {
        wiredminds.push(['setTrackParam', 'wm_milestone', milestone]);
      }

      if (trackPath === true) {
        // track full page path ans use type as suffix
        wiredminds.push(['count', value]);
      } else {
        var pageName = [prefixPage, value].join(scope._pageSeparator);
        wiredminds.push(['setTrackParam', 'wm_page_name', pageName]);
        wiredminds.push(['count']);
      }
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
   * @param {string} msg
   */
  this.writeLog = function(msg) {
    if ((scope.debug == true) && console) {
      console.log(msg);
    }
  };
};
