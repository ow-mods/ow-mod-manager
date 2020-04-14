# Outer Wilds Mod Manager

For all your modding needs! With access to features such as:

* Downloading mods;
* Updating mods;
* Enabling / disabling mods.
* Looking at all the great mods you have;
* Running the game with mods enabled.

It also lets you install / update the [Outer Wilds Mod Loader](https://github.com/amazingalek/owml) from within the app, so you don't need to deal with that yourself.

## How do I use this?

* [Download the latest release](https://github.com/Raicuparta/ow-mod-manager/releases/latest);
* Extract it anywhere;
* Install OWML;
* Install any mods you want;
* Press the big green button that says "Start Game";
* You won't believe what happens next.

## It doesn't work / I found a bug / I have a request

Please [open an issue](https://github.com/Raicuparta/ow-mod-manager/issues) describing your bug / request.

## I made a mod! How do I submit it?

* Fork this repository;

* Edit [src/mod-db.json](https://github.com/Raicuparta/ow-mod-manager/blob/master/src/mod-db.json), adding your mod at the end of the list;

* Create a [pull request](https://github.com/Raicuparta/ow-mod-manager/pulls) (from your fork to this repo's master branch);

* The maintainers of this repository will review it and merge it to the list.

## I feel a deep emotional connection with you, can we chat?

Sure! You can find us in the [Outer Wilds unofficial Discord server](https://discord.gg/wkttTG), over at the `#modding` channel.

## Development setup

* Make sure you have [Node](https://nodejs.org/) installed (for `npm`);
* Clone the repo and `cd` to it;
* Install dependencies with `npm install`;
* Start development app `npm run start`;
* Wait a few seconds for the app to draw;
* Changes to components should automatically update the app.

## Building for production

* Run `npm make`;
* Check the output in the `out` directory for the app's executable.

## Authors

* [Raicuparta](https://github.com/Raicuparta)
* [AmazingAlek](https://github.com/amazingalek)
