import BrowserWinHandler from './BrowserWinHandler'


const winHandler = new BrowserWinHandler({
  width:1440,
  height:800
})

winHandler.onCreated(_browserWindow => {
  winHandler.loadPage('/')
  // _browserWindow.webContents.openDevTools()
  // Or load custom url
  // _browserWindow.loadURL('https://google.com')
})

export default winHandler
