"use strict";const e=require("electron"),i=require("path");let t;const n=()=>{if(t=new e.BrowserWindow({webPreferences:{devTools:!0,nodeIntegration:!0,contextIsolation:!1},autoHideMenuBar:!0,frame:!1,width:o(.7),height:s(.7),minWidth:800,minHeight:495,backgroundColor:"#000",resizable:!0,maximizable:!0,minimizable:!0,fullscreenable:!0,closable:!0,focusable:!0,alwaysOnTop:!1,transparent:!1,modal:!1,skipTaskbar:!1,hasShadow:!0}),e.app.isPackaged)t.loadFile(i.join(__dirname,"../dist/index.html"));else{const r=process.env.VITE_DEV_SERVER_URL||"";console.log(r),t.loadURL(r)}};e.app.whenReady().then(n).then(()=>{});e.app.on("window-all-closed",()=>{process.platform!=="darwin"&&e.app.quit()});e.app.on("activate",()=>{e.BrowserWindow.getAllWindows().length===0&&n()});e.app.on("before-quit",()=>{t.close()});const o=(r=1)=>parseInt(String(e.screen.getPrimaryDisplay().workAreaSize.width*r)),s=(r=1)=>parseInt(String(e.screen.getPrimaryDisplay().workAreaSize.height*r));