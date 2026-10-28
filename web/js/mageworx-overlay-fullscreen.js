/**
 * Keeps MageWorx overlay images aligned with the full-size image
 * when the Fotorama gallery is opened in fullscreen (zoom, zoom out, drag, close).
 *
 * In fullscreen, Magento shows `.fotorama__img--full` and hides every `.fotorama__img`.
 * MageWorx overlays share the `.fotorama__img` class, so they disappear.
 * Custom CSS makes them visible again and mirrors the full image transitions;
 * this module mirrors the inline size/position that the magnifier applies to the full image.
 */
define(['jquery'], function ($) {
    'use strict';

    var OVERLAY_SELECTOR = 'img[class*="mageworx-overlay-images"]',
        FULL_IMAGE_SELECTOR = '.fotorama__img--full',
        FRAME_SELECTOR = '.fotorama__stage__frame',
        GALLERY_SELECTOR = '[data-gallery-role=gallery]',
        ORIGINAL_STYLE_KEY = 'mwOverlayStyle',
        observer = null,
        activeStage = null;

    /**
     * Copy the full image inline style to every overlay inside the frame.
     * The original overlay style is stored once so it can be restored on exit.
     *
     * @param {HTMLElement} frame
     */
    function syncFrame(frame) {
        var fullImage = frame.querySelector(FULL_IMAGE_SELECTOR),
            fullComputed;

        if (!fullImage) {
            return;
        }

        fullComputed = window.getComputedStyle(fullImage);

        frame.querySelectorAll(OVERLAY_SELECTOR).forEach(function (overlay) {
            var zIndex;

            if (overlay.dataset[ORIGINAL_STYLE_KEY] === undefined) {
                overlay.dataset[ORIGINAL_STYLE_KEY] = overlay.getAttribute('style') || '';
            }

            // Keep the z-index set by MageWorx (it defines the stacking order).
            zIndex = overlay.style.zIndex;

            // Inline style holds the magnifier target size/position,
            // so overlay and full image animate together.
            overlay.style.cssText = fullImage.style.cssText;
            overlay.style.position = 'absolute';
            overlay.style.zIndex = zIndex;

            // While zooming, `.fotorama__img--zoommable` removes the max-width/max-height
            // limits from the full image: mirror them, otherwise overlays stay capped at 100%.
            overlay.style.maxWidth = fullComputed.maxWidth;
            overlay.style.maxHeight = fullComputed.maxHeight;

            // Before the first zoom the full image has no inline size (it is "auto").
            // Browsers cannot animate from "auto", so give overlays an explicit start size.
            if (!fullImage.style.width) {
                overlay.style.width = fullComputed.width;
            }

            if (!fullImage.style.height) {
                overlay.style.height = fullComputed.height;
            }
        });
    }

    /**
     * @param {HTMLElement} root
     */
    function syncAll(root) {
        root.querySelectorAll(FRAME_SELECTOR).forEach(syncFrame);
    }

    /**
     * Restore the overlay inline style used by the normal (non-fullscreen) gallery.
     * The restore is done without transition: Fotorama animates width/height/top/left
     * on `.fotorama__img`, which would make overlays slide back from the zoomed position.
     *
     * @param {HTMLElement} root
     */
    function restoreAll(root) {
        root.querySelectorAll(OVERLAY_SELECTOR).forEach(function (overlay) {
            if (overlay.dataset[ORIGINAL_STYLE_KEY] === undefined) {
                return;
            }

            overlay.setAttribute('style', overlay.dataset[ORIGINAL_STYLE_KEY]);
            delete overlay.dataset[ORIGINAL_STYLE_KEY];

            overlay.style.transition = 'none';
            void overlay.offsetWidth; // force reflow so the new position applies instantly

            // Give back the default transition once the position has settled.
            window.requestAnimationFrame(function () {
                window.requestAnimationFrame(function () {
                    overlay.style.removeProperty('transition');
                });
            });
        });
    }

    /**
     * The explicit start size must follow viewport changes while in fullscreen.
     */
    function onResize() {
        if (activeStage) {
            syncAll(activeStage);
        }
    }

    function stopWatching() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        window.removeEventListener('resize', onResize);
        activeStage = null;
    }

    $(document).on('fotorama:fullscreenenter', GALLERY_SELECTOR, function () {
        var stage = this.querySelector('.fotorama__stage');

        if (!stage) {
            return;
        }

        stopWatching();
        activeStage = stage;
        syncAll(stage);

        // Re-sync when the magnifier changes the full image style/class,
        // or when MageWorx swaps overlays after an option change.
        observer = new MutationObserver(function (mutations) {
            var needsSync = mutations.some(function (mutation) {
                return mutation.type === 'childList' ||
                    (mutation.target.matches && mutation.target.matches(FULL_IMAGE_SELECTOR));
            });

            if (needsSync) {
                syncAll(stage);
            }
        });

        observer.observe(stage, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        window.addEventListener('resize', onResize);
    });

    $(document).on('fotorama:fullscreenexit', GALLERY_SELECTOR, function () {
        stopWatching();
        restoreAll(this);
    });
});
