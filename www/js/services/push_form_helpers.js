/**
 * Push form helper functions.
 */

var angular = require('angular');


var pushFormHelpers = function (notificationFormatting) {

  return {

    /**
     * Clean up the notification object prior to passing it to validation.
     *
     * This is required as Joi has issues with validating empty strings vs. undefined values for
     * required fields, whereas ng binds an empty <input> as an empty string.
     *
     * @param rawNotification
     * @returns {{}}
     */
    cleanNotificationForValidation: function(rawNotification) {

      var cleanNotification = {};

      angular.forEach(rawNotification, function(value, key) {
        if (angular.isString(value) && value === '') {
          cleanNotification[key] = undefined;
        } else {
          cleanNotification[key] = value;
        }
      }, rawNotification);

      return cleanNotification;
    },

    /**
     * Converts the raw \n delimited deviceIds string to an array of individual deviceIds.
     */
    formatDeviceIds: function(newValue) {
      var deviceIds = [];
      var rawDeviceIds = newValue.split('\n');

      for (var i = 0, rawDeviceId; i < rawDeviceIds.length; ++i) {
        rawDeviceId = rawDeviceIds[i].trim();
        if (angular.isString(rawDeviceId) && rawDeviceId !== '') {
          deviceIds.push(rawDeviceId);
        }
      }

      return deviceIds;
    },

    /**
     * Creates an empty notification object.
     * @returns {{}}
     */
    makeEmptyNotification: function() {
      return {
        title: undefined,
        message: undefined,
        sound: undefined,
        data: {},

        // admin variables
        channels: [],
        deviceIds: []
      };
    },

    /**
     * Creates the working model for the push form.
     *
     * @param {{}} notification
     * @param {boolean} lastPageWasNotificationPreview
     * @param {Array.<string>} supportedChannels
     * @returns {{}}
     */
    getWorkingModel: function(notification, lastPageWasNotificationPreview, supportedChannels) {
      var uri = notificationFormatting.getBaseURI(
        lastPageWasNotificationPreview, notification.data.url);

      return {
        notification: angular.copy(notification),
        deviceIds: notification.deviceIds.join('\n'),
        channels: angular.copy(supportedChannels),
        uri: uri,
        url: {
          scheme: uri.scheme() + '://',
          urlStringMinusScheme: notificationFormatting.urlStringMinusScheme(uri)
        },
        urlSchemes: ['http://', 'https://']
      };
    }

  };

};


module.exports = pushFormHelpers;
