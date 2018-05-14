# iwallic

NEO thin wallet by ExChain teams.

## Package manage

Currently use npm to install only. Or errors will occur when ``cordova build``.

## How to run

```
ionic serve
```

To run in an emulator:

```
yarn emulator
```

To run in a native device(connect by usb or wifi by adb):

```
yarn native
```

To just build web outputs:

```
yarn build (--prod)
```

Add ``--prod`` to enable minify bundle.

To build debug apk installer:

```
yarn build:apk
```

### Use npm to install only

* Use ``npm install`` only. It means do not use ``yarn`` when install packages.
* For running commands(run, build and publish e.g), ``yarn`` is recommended.

## About Modules

* Wallet
* * Create
* * Import
* * Import from NEP-6
* * Backup
* Asset
* * List
* * History for single asset
* Transaction
* * Transfer
* * History
* System
* * Language switch
* * Theme switch (to do)
* * Helpers (to do)
* * Version control (to do)

## Tips

### When will assets/transaction data refresh
* Enter new wallet
* New block comes
* Pull down to refresh
