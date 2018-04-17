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

## Commonds

Common commands are list in ``package.json``'s ``scripts`` param.

### Build
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

## About Project

path | desc
-|-
/resources | native icon/splash settings
/src | project source code
/www | web outputs
/platforms | native outputs
/plugins | native plugins(cordova)

## About icon

* icon for android/ios config at ``/resources``
```
ionic cordova resources android/ios -f
```

* icon for web config at ``/assets/icon`` and ``/assets/imgs``
* splash for wpa config at ``/config.xml`` - ``SplashScreen``