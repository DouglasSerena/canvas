const { app, BrowserWindow, Tray, globalShortcut, Menu } = require('electron');
const path = require('path');

if (process.platform === 'linux') {
  app.commandLine.appendSwitch('enable-transparent-visuals');
  app.commandLine.appendSwitch('disable-gpu');
}

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.maximize();
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  let isOpen = true;
  const toggleWid = () => {
    isOpen ? mainWindow.hide() : mainWindow.show();
    isOpen = !isOpen;
  };
  const exit = () => mainWindow.close();

  const tray = new Tray(path.join(__dirname, 'img', 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Abrir/Esconder (F7)', type: 'normal', click: toggleWid },
    { type: 'separator' },
    { label: 'Fechar', type: 'normal', click: exit },
  ]);
  tray.setToolTip('Application.');
  tray.setContextMenu(contextMenu);

  // Key global
  globalShortcut.register('F7', () => {
    toggleWid();
  });
};

app.on('ready', () => setTimeout(createWindow, 500));

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
