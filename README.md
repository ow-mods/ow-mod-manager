# Outer Wilds Mod Manager

For all your modding needs! With access to features such as:

* Downloading mods;
* Updating mods;
* Enabling / disabling mods.
* Looking at all the great mods you have;
* Running the game with mods enabled.

It also lets you install / update the [Outer Wilds Mod Loader](https://github.com/amazingalek/owml) from within the app, so you don't need to deal with that yourself.

## How do I use this?

* [Download the Outer Wilds Mod Manager installer](https://outerwildsmods.com/);
* Run the downloaded .exe (you might need to ignore some Chrome / Windows warnings);
* The Mod Manager should start automatically;
* Shortcuts are added to desktop and start menu, use them next time you want to run the manager;
* Install OWML;
* Install any mods you want;
* Press the big green button that says "Start Game";
* You won't believe what happens next.

## How do I uninstall it?

First, remember that uninstalling the Mod Manager won't uninstall your mods. Make sure to remove all mods and run the game once before uninstalling.

You can uninstall the Mod Manager by searching for "Add or remove programs" in the start menu (or in the control panel), and then finding OuterWildsModManager in the list.

## It doesn't work / I found a bug / I have a request

Please [open an issue](https://github.com/Raicuparta/ow-mod-manager/issues) describing your bug / request.

## I made a mod! How do I submit it?

The mod database is stored in a separate repository. [Go here to find out how to add your mod to the list](https://github.com/Raicuparta/outer-wilds-mod-db#adding-your-mod-to-the-list).

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
