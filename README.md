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

## "Installation Aborted" error

If you're trying to reinstall the Mod Manager, you might get an error saying "Installation aborted: Setup was not completed succesfully". If that happens, follow these steps:

* Open the Start menu;
* Search for "Control Panel" and open it;
* Under "Programs", click "Uninstall a program";
* Search for "Outer Wilds Mod Manager" in the list;
* Double click it;
* Windows should show you an error message saying it failed to uninstall, and asking if you want to remove the program from the list. Say yes;
* Try installing the Mod Manager again.

**Note**: This is not possible to do via the modern Windows 10 settings panel. You need to use the old ugly Control Panel.

## How do I uninstall it?

You can uninstall the Mod Manager by searching for "Add or remove programs" in the start menu (or in the control panel), and then finding "Outer Wilds Mod Manager" in the list. However, this won't uninstall your mods.

To revert the game to its original state, verify the game files integrity:
  - **Steam**: Library > Right-click Outer Wilds > Properties > Local Files > Verify integrity of game files.
  - **Epic**: Library > Click three dots under Outer Wilds > Verify.

## It doesn't work / I found a bug / I have a request

Please [open an issue](https://github.com/Raicuparta/ow-mod-manager/issues) describing your bug / request.

## I made a mod! How do I submit it?

The mod database is stored in a separate repository. [Go here to find out how to add your mod to the list](https://github.com/Raicuparta/outer-wilds-mod-db#readme).

## I feel a deep emotional connection with you, can we chat?

Sure! You can find us in the [Outer Wilds Modding Discord server](https://discord.gg/9vE5aHxcF9).

## Development setup

[Install Node](https://nodejs.org/en/download/).

[Install Yarn](https://yarnpkg.com/getting-started/install).

* Clone the repo and `cd` to it;
* Install dependencies with `yarn install`;
* Start development app `yarn run dev`;
* Wait a few seconds for the app to draw;
* Changes to components should automatically update the app.

## Building for production

* Run `yarn run package`;
* Check the output in the `release` directory for the app's executable.
