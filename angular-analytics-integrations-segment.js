angular.module('l42y.analytics.integrations.segment', [
  'l42y.analytics'
]).provider('AnalyticsSegment', function () {
  var writeKey = '';
  var provider = {
    key: function (key) {
      if (key) {
        writeKey = key;

        return provider;
      } else {
        return writeKey;
      }
    },
    $get: function (
      $window,
      Analytics
    ) {
      // Copied from https://segment.com/docs/libraries/analytics.js/quickstart/
      // Non-minified version
      (function(){
        // Create a queue, but don't obliterate an existing one!
        var analytics = $window.analytics = $window.analytics || [];

        // If the real analytics.js is already on the page return.
        if (analytics.initialize) return;

        // If the snippet was invoked already show an error.
        if (analytics.invoked) {
          if ($window.console && console.error) {
            console.error('Segment snippet included twice.');
          }
          return;
        }

        // Invoked flag, to make sure the snippet
        // is never invoked twice.
        analytics.invoked = true;

        // A list of the methods in Analytics.js to stub.
        analytics.methods = [
          'trackSubmit',
          'trackClick',
          'trackLink',
          'trackForm',
          'pageview',
          'identify',
          'group',
          'track',
          'ready',
          'alias',
          'page',
          'once',
          'off',
          'on'
        ];

        // Define a factory to create stubs. These are placeholders
        // for methods in Analytics.js so that you never have to wait
        // for it to load to actually record data. The `method` is
        // stored as the first argument, so we can replay the data.
        analytics.factory = function(method){
          return function(){
            var args = Array.prototype.slice.call(arguments);
            args.unshift(method);
            analytics.push(args);
            return analytics;
          };
        };

        // For each of our methods, generate a queueing stub.
        for (var i = 0; i < analytics.methods.length; i++) {
          var key = analytics.methods[i];
          analytics[key] = analytics.factory(key);
        }

        // Define a method to load Analytics.js from our CDN,
        // and that will be sure to only ever load it once.
        analytics.load = function(key){
          // Create an async script element based on your key.
          var script = $window.document.createElement('script');
          script.type = 'text/javascript';
          script.async = true;
          script.src = ('https:' === $window.document.location.protocol
                        ? 'https://' : 'http://')
            + 'cdn.segment.com/analytics.js/v1/'
            + key + '/analytics.min.js';

          // Insert our script next to the first script element.
          var first = $window.document.getElementsByTagName('script')[0];
          first.parentNode.insertBefore(script, first);
        };

        // Add a version to keep track of what's in the wild.
        analytics.SNIPPET_VERSION = '3.0.1';

        // Load Analytics.js with your key, which will automatically
        // load the tools you've enabled for your account. Boosh!
        analytics.load(writeKey);
      })();

      var service = {
        page: function (current) {
          $window.analytics.page({
            path: current
          });
        },
        track: function (event, prop) {
          $window.analytics.track(event, prop);
        }
      };

      Analytics.integrate('Segment', service);

      return service;
    }
  };

  return provider;
});
