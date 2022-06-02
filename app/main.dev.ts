/* eslint global-require: off, no-console: off */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { updateText } from './helpers/static-text';
import { debugConsole } from './helpers/console-log';

const protocolSchema = 'outer-wilds-mod';

app.commandLine.appendSwitch('disable-http-cache');

let mainWindow: BrowserWindow | undefined;
let protocolModUniqueName = '';

const isProduction = process.env.NODE_ENV === 'production';

const checkForUpdates = () => {
  log.transports.file.level = 'debug';
  autoUpdater.logger = log;
  autoUpdater.autoDownload = true;
  autoUpdater.checkForUpdates();
};

const sendProtocolMessage = () => {
  debugConsole.log('sending mod protocol message...');
  if (!mainWindow) {
    throw new Error(
      'tried to send protocol message but main window is not defined'
    );
  }

  if (!protocolModUniqueName) return;

  mainWindow.webContents.send('mod-protocol', protocolModUniqueName);
  debugConsole.log('sent mod protocol message', protocolModUniqueName);
};

const setUpProtocolMessage = (args: string[]) => {
  const lastArg = args[args.length - 1];
  const schemaUrlPrefix = `${protocolSchema}://`;

  if (!lastArg || !lastArg.startsWith(schemaUrlPrefix)) return;

  protocolModUniqueName = args[args.length - 1].slice(
    schemaUrlPrefix.length,
    -1
  );

  debugConsole.log('setUpProtocolMessage', protocolModUniqueName);

  sendProtocolMessage();
};

ipcMain.on('mod-protocol-ready', sendProtocolMessage);

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 850,
    minWidth: 750,
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
    mainWindow.setMenu(null);
  }

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.setTitle(`Outer Wilds Mod Manager ${app.getVersion()}`);
  });

  setUpProtocolMessage(process.argv);

  checkForUpdates();
};

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(protocolSchema, process.execPath, [
      process.argv[1],
      path.resolve(process.argv[2]),
      path.resolve(process.argv[3]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient(protocolSchema);
}
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      setUpProtocolMessage(commandLine);
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // Create mainWindow, load the rest of the app, etc...
  app
    .whenReady()
    .then(() => createWindow())
    .catch((error) =>
      console.error(`app.whenReady failed with error ${error}`)
    );
}

app.on('window-all-closed', () => {
  app.quit();
});

autoUpdater.signals.updateDownloaded(({ version }) => {
  log.info('CALLED update-available');

  const response = dialog.showMessageBoxSync({
    type: 'info',
    buttons: [updateText.dialogYes, updateText.dialogNo],
    title: updateText.dialogTitle,
    message: updateText.dialogMessage,
    detail: updateText.dialogDetail(version),
  });

  if (response === 0) autoUpdater.quitAndInstall();
});
