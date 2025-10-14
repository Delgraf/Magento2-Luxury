define([
    'Swissup_Firecheckout/js/utils/form-field/manager',
    'Swissup_Firecheckout/js/utils/form-field/classname',
    'mage/translate'
], function (manager, classname, $t, $) {
    'use strict';

    
    // Resize company to take the whole row
    classname('[name="company"]', 'fc-col-12');

    
    // `Street Address: Line 1` - rename to `Street Address`
    manager('[name="street[0]"]', {
        label: $t('Street Address'),
        placeholder: $t('Street Address *'),
    });

    
});
