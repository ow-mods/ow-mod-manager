import { app, BrowserWindow } from 'electron';
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 850,
    minWidth: 900,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      enableRemoteModule: true,
    },
    backgroundColor: '#212121',
    title: `Outer Wilds Mod Manager ${app.getVersion()}`,
  });

  // Load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (process.env.NODE_ENV === 'production') {
    mainWindow.setMenu(null);
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
