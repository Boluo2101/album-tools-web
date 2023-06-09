// app 控制应用程序的事件生命周期（相当于应用程序）
// BrowserWindow 创建并控制浏览器窗口（相当于打开桌面弹框）
import { app, BrowserWindow, screen, Notification, ipcMain } from "electron"
import path from "path"

// 定义全局变量，获取窗口实例
let win: BrowserWindow

// 创建一个窗口
const createWindow = () => {
	win = new BrowserWindow({
		webPreferences: {
			// 是否开启调试工具
			devTools: true,
			// 集成网页和 Node.js，也就是在渲染进程中，可以调用 Node.js 方法
			nodeIntegration: true,
			contextIsolation: false,
			// 允许html页面上的javascipt代码访问nodejs 环境api代码的能力（与node集成的意思）
			experimentalFeatures: true,
		},

		// 隐藏菜单栏
		autoHideMenuBar: true,

		// 隐藏标题栏
		frame: false,

		// 窗口宽高
		width: getScreenWidth(0.7),
		height: getScreenHeight(0.7),

		// 窗口最小宽高
		minWidth: 1000,
		minHeight: 660,

		// 默认背景色
		backgroundColor: "#000",

		// 是否可以改变窗口大小
		resizable: true,

		// 是否可以最大化
		maximizable: true,

		// 是否可以最小化
		minimizable: true,

		// 是否可以全屏
		fullscreenable: true,

		// 是否可以关闭
		closable: true,

		// 是否可以聚焦
		focusable: true,

		// 是否置顶
		alwaysOnTop: false,

		// 是否透明
		transparent: false,

		// 是否模态窗口
		modal: false,

		// 是否不显示在任务栏
		skipTaskbar: false,

		// 是否有阴影
		hasShadow: true,

		// 是否显示右下角
	})

	// 生产环境、开发环境，访问的路径不同
	// 开发环境下，我们访问的是 Vite 本地服务
	// 打包之后，我们访问的是 dist 静态文件
	// 所以这里要加个判断
	if (app.isPackaged) {
		win.loadFile(path.join(__dirname, "../dist/index.html"))
	} else {
		// 集成网页和 Node.js 后，需要加载
		// 这里接收的网址是指：Vite 启动后，会在本地运行一个服务，把这个服务网址丢进去就行
		// 使用 Vite 自带的环境变量 VITE_DEV_SERVER_HOST
		// 如果是 undefined，就换成 VITE_DEV_SERVER_HOSTNAME

		const url: string = process.env["VITE_DEV_SERVER_URL"] || ""
		console.log(url)
		win.loadURL(url)
	}

	win.on("unmaximize", () => {
		// 重置窗口到最小宽高
		win.setSize(1000, 660)
	})
}

// 初始化app（在 Electron 完成初始化时触发）
app
	.whenReady()
	.then(createWindow)
	.then(() => {})

// isPackage 无效，可以换下面的
// 注意：这个环境变量，需要安装 cross-env，在 package.json 中指定下，在 3.5 中写了
// if (process.env.NODE_ENV != 'development') {
// win.loadFile(path.join(__dirname, "../index.html"));
// } else {
// win.loadURL(`http://${process.env['VITE_DEV_SERVER_HOSTNAME']}:${process.env['VITE_DEV_SE//RVER_PORT']}`)
// }

// 当所有窗口都被关闭时退出
app.on("window-all-closed", () => {
	// 在 macOS 上，除非用户用 Cmd + Q 确定地退出，否则绝大部分应用及其菜单栏会保持激活
	if (process.platform !== "darwin") {
		app.quit()
	}
})

// 当应用程序激活时，没有打开的窗口时触发
app.on("activate", () => {
	// 在macOS上，当单击dock图标并且没有其他窗口打开时，通常在应用程序中重新创建一个窗口
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

// 退出时，关闭窗口
app.on("before-quit", () => {
	win.close()
})

// 获取系统宽度
const getScreenWidth = (num = 1) => {
	const returnNumber = parseInt(String(screen.getPrimaryDisplay().workAreaSize.width * num))
	return returnNumber
}

// 获取系统高度
const getScreenHeight = (num = 1) => {
	const returnNumber = parseInt(String(screen.getPrimaryDisplay().workAreaSize.height * num))
	return returnNumber
}

ipcMain.on("hideWindow", () => {
	win.minimize()
})

ipcMain.on("fullScreenToggle", () => {
	win.isMaximized() ? win.unmaximize() : win.maximize()
})

ipcMain.on("fullScreen", () => {
	win.maximize()
})

ipcMain.on("closeWindow", () => {
	win.close()
})
