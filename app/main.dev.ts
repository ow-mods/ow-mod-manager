/* eslint global-require: off, no-console: off */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

app.commandLine.appendSwitch('disable-http-cache');

const isProduction = process.env.NODE_ENV === 'production';

const checkForUpdates = () => {
  log.transports.file.level = 'debug';
  autoUpdater.logger = log;
  autoUpdater.autoDownload = true;
  autoUpdater.checkForUpdates();
};

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 850,
    minWidth: 900,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: !isProduction,
      enableRemoteModule: true,
      preload: isProduction
        ? path.join(__dirname, 'dist/renderer.prod.js')
        : undefined,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  if (isProduction) {
    // mainWindow.setMenu(null);
  }

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.setTitle(`Outer Wilds Mod Manager ${app.getVersion()}`);
  });

  checkForUpdates();
};

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', createWindow);

autoUpdater.on('update-downloaded', () => {
  log.info('CALLED update-available');

  const response = dialog.showMessageBoxSync({
    type: 'info',
    buttons: ['Update', 'Not now'],
    title: 'App update',
    message: 'Update available',
    detail: 'New update available. Restart the app to install this update.',
  });

  if (response === 0) autoUpdater.quitAndInstall();
});
