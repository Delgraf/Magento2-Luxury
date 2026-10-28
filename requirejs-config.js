var config = {
    deps: [
        'js/mageworx-overlay-fullscreen', // MageWorx overlays in fullscreen gallery
        'js/magnifier-zoom-unlock'        // Magento magnifier "-" lock fix (all products)
    ],
    config: {
        mixins: {
            'mage/gallery/gallery': {
                'js/gallery-fluid-height-mixin': true
            }
        }
    }
};
