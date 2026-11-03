# Magento2-Luxury

Custom Magento 2 theme (`frontend/Delgraf/luxury`) based on Swissup Argento Luxury.

## Requirements

- Magento 2.4.x
- PHP 8.3, 8.4 or 8.5
- Swissup Argento Luxury (`swissup/theme-frontend-argento-luxury`)

All commands below are run from the Magento root directory.
Check the current mode with:

```bash
php bin/magento deploy:mode:show
```

## Install

1. Install the theme from [Packagist](https://packagist.org/packages/delgraf/theme-frontend-luxury):

   ```bash
   composer require delgraf/theme-frontend-luxury:dev-master
   ```

2. Register the theme:

   **Developer mode**

   ```bash
   php bin/magento setup:upgrade
   php bin/magento cache:flush
   ```

   **Production mode**

   ```bash
   php bin/magento maintenance:enable
   php bin/magento setup:upgrade --keep-generated
   php bin/magento setup:di:compile
   php bin/magento setup:static-content:deploy -f it_IT en_US
   php bin/magento cache:flush
   php bin/magento maintenance:disable
   ```

3. Apply the theme in the admin: **Content → Design → Configuration**, edit the store view,
   set **Applied Theme** to **Delgraf Luxury** and save.

4. Flush the cache again:

   ```bash
   php bin/magento cache:flush
   ```

## Update

1. Get the latest version:

   ```bash
   composer update delgraf/theme-frontend-luxury
   ```

2. Refresh static files and cache:

   **Developer mode**

   Static files are generated on demand, so you only need to remove the ones already generated
   for this theme. No static content deploy and no compilation are needed.

   ```bash
   rm -rf pub/static/frontend/Delgraf/luxury/*
   rm -rf var/view_preprocessed/pub/static/frontend/Delgraf/luxury
   php bin/magento cache:flush
   ```

   Then reload the page bypassing the browser cache (Cmd+Shift+R on Mac, Ctrl+F5 on Windows).
   The first load is slower while Magento compiles the LESS files.

   **Production mode**

   ```bash
   php bin/magento maintenance:enable
   php bin/magento setup:static-content:deploy -f it_IT en_US
   php bin/magento cache:flush
   php bin/magento maintenance:disable
   ```

   The theme contains no PHP code, so `setup:upgrade` and `setup:di:compile` are not needed for
   theme updates.

## Uninstall

1. In the admin, switch every store view that uses **Delgraf Luxury** to another theme
   (for example **Argento Luxury**) in **Content → Design → Configuration**.
   A theme that is still applied cannot be removed.

2. Remove the theme. This also runs `composer remove`, deletes the theme from the database and,
   with `--clear-static-content`, removes the generated static files:

   ```bash
   php bin/magento theme:uninstall --clear-static-content frontend/Delgraf/luxury
   ```

3. Remove the generated files and refresh:

   **Developer mode**

   ```bash
   rm -rf pub/static/frontend/Delgraf
   rm -rf var/view_preprocessed/pub/static/frontend/Delgraf
   php bin/magento cache:flush
   ```

   **Production mode**

   ```bash
   php bin/magento maintenance:enable
   rm -rf pub/static/frontend/Delgraf
   php bin/magento setup:upgrade --keep-generated
   php bin/magento setup:di:compile
   php bin/magento setup:static-content:deploy -f it_IT en_US
   php bin/magento cache:flush
   php bin/magento maintenance:disable
   ```

## Notes

- Change the locales in `setup:static-content:deploy` (`it_IT en_US`) to match your store views.
- Custom LESS goes in `web/css/source/_argento_custom.less`, the override file loaded by Argento.
- CSS saved in the Swissup Theme Editor (`pub/media/swissup/argento/luxury/css/admin_backend.css`)
  is loaded after the theme CSS and can override it.
