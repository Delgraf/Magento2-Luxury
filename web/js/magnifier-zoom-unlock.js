/**
 * Workaround for a Magento magnifier bug (lib/web/magnifier/magnify.js).
 * Independent from MageWorx overlays: applies to every Fotorama fullscreen gallery.
 *
 * Every zoom step sets an internal `transitionActive` lock that is released only by the
 * full image `transitionend` event. When "-" is pressed while the image already fits the
 * screen (same for mouse wheel / keyboard), its size does not change, no transition runs,
 * `transitionend` never fires and both zoom buttons stay locked until fullscreen is closed.
 *
 * Right after a zoom interaction we check whether the full image is really animating:
 * - no animation running  -> release the lock almost immediately (50 ms);
 * - animation running     -> do nothing, Magento releases it on `transitionend`;
 * - animation cancelled   -> release the lock (`transitionend` would never come).
 * `triggerHandler` runs only the magnifier handler on the image: the event does not bubble.
 */
define(['jquery'], function ($) {
    'use strict';

    var FULLSCREEN_SELECTOR = '.fotorama--fullscreen',
        FULL_IMAGE_SELECTOR = '.fotorama--fullscreen .fotorama__active .fotorama__img--full',
        CHECK_DELAY = 50,     // ms after the interaction: is the full image animating?
        FALLBACK_DELAY = 350, // browsers without Element.getAnimations()
        pending = false;

    function getFullImage() {
        return document.querySelector(FULL_IMAGE_SELECTOR);
    }

    function releaseZoomLock() {
        var fullImage = getFullImage();

        if (fullImage) {
            $(fullImage).triggerHandler('transitionend');
        }
    }

    /**
     * @param {HTMLElement} fullImage
     * @returns {Boolean}
     */
    function isAnimating(fullImage) {
        return fullImage.getAnimations().some(function (animation) {
            return animation.playState === 'running' || animation.playState === 'pending';
        });
    }

    function checkAndRelease() {
        var fullImage = getFullImage();

        pending = false;

        if (fullImage && !isAnimating(fullImage)) {
            releaseZoomLock();
        }
    }

    function scheduleCheck() {
        // Only while the gallery is in fullscreen (keyboard events may target <body>).
        if (!document.querySelector(FULLSCREEN_SELECTOR)) {
            return;
        }

        if (typeof Element.prototype.getAnimations !== 'function') {
            window.setTimeout(releaseZoomLock, FALLBACK_DELAY);

            return;
        }

        if (pending) {
            return;
        }

        pending = true;

        // The magnifier applies the new size synchronously in its handler, so any transition
        // is already registered after a short delay (setTimeout, unlike requestAnimationFrame,
        // also runs when the tab is in background).
        window.setTimeout(checkAndRelease, CHECK_DELAY);
    }

    // Capture phase: the zoom buttons stop event propagation.
    ['click', 'dblclick', 'wheel', 'keyup', 'touchend'].forEach(function (type) {
        document.addEventListener(type, scheduleCheck, true);
    });

    // An interrupted transition never fires `transitionend`: release the lock.
    document.addEventListener('transitioncancel', function (event) {
        if (event.target && event.target.matches && event.target.matches(FULL_IMAGE_SELECTOR)) {
            releaseZoomLock();
        }
    }, true);
});
