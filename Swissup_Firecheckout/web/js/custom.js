define([
    'Swissup_Firecheckout/js/utils/form-field/manager',
    'Swissup_Firecheckout/js/utils/form-field/classname',
    'mage/translate',
    'Magento_Ui/js/lib/view/utils/async'
], function (manager, classname, $t, $) {
    'use strict';

    
    // Resize company to take the whole row
    classname('[name="company"]', 'fc-col-12');

    
    // `Street Address: Line 1` - rename to `Street Address`
    manager('[name="street[0]"]', {
        label: $t('Street Address'),
        placeholder: $t('Street Address *'),
    });

    
    $.async('.content.minicart-items .details-qty', function (el) {     // add an icon to the each item content
        $(el).after(
            '<div class="remove item">' +
                '<a href="#" title="Remove Item" class="remove-item">' +
                    '<i class="icon-trash"></i>' +
                '</a>' +
            '</div>'
        );

        $(el).siblings('.remove.item').find('.remove-item').click(function (event){
            var item = event.currentTarget;
            $(item).parents(".product-item-details").find("input[type='number']").val(0).change(); // change the quantity to "0"
        });
    });
});
