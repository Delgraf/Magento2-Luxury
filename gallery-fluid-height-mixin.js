/**
 * Keeps the product gallery stage height in sync with its width.
 *
 * By default mage/gallery/gallery freezes the Fotorama height to the
 * placeholder height measured at page load (unless "whiteBorders" is set).
 * When the window gets narrower the image shrinks but the stage keeps the
 * old height, leaving an empty band between the image and the thumbnails.
 *
 * Setting whiteBorders makes the core gallery pass height = null to
 * Fotorama, so the height is computed from the width/height ratio
 * (view.xml gallery width/height) on every resize.
 */
define(function () {
    'use strict';

    return function (Gallery) {
        return Gallery.extend({
            /**
             * @param {Object} config
             * @param {HTMLElement} element
             */
            initialize: function (config, element) {
                if (config && config.options) {
                    config.options.whiteBorders = 1;
                }

                return this._super(config, element);
            }
        });
    };
});
