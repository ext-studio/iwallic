# iWallic

NEO thin wallet by iWallic Team.

## Package manage

Currently use npm to install only. Or errors will occur when ``cordova build``.

## How to run

```
ionic serve // local dev
yarn apk // build apk output
yarn ios // build XCode project output
```

### Use npm to install only

* Use ``npm install`` only. It means do not use ``yarn`` when install packages.
* For running commands(run, build and publish e.g), ``yarn`` is recommended.

## About Modules

* Wallet
* * Create
* * Import
* * Import from JSON file(NEP-6)
* * Backup
* Asset
* * List
* * Detail of single asset
* * Claim GAS
* Transaction
* * Transfer
* * History
* System
* * Language switch
* * Theme switch
* * Helpers
