let tab:  ext.tabs.Tab | null = null;
let window: ext.windows.Window | null = null;
let webview: ext.webviews.Webview | null = null;

// Extension clicked
ext.runtime.onExtensionClick.addListener(async () => {
    //Creatte Tab
    if(!tab) {
        tab = await ext.tabs.create({
            icon: 'icons/extension-tutorial-icon.png',
            text: `NEW EXT APP`,
            closable: true,
        })

        window = await ext.windows.create();
        	// we need to grab our window's size, so we can use it when sizing our webview...
        const windowSize = await ext.windows.getSize(window.id)

        	// create the webview
            webview = await ext.webviews.create({
            // attach it to our window
            window: window,
            // set our webview properties:
            // we want it to start from the top-left (so x-coord = 0, y-coord = 0)
            // we want it to have the same width and height as our window
            bounds: { x: 0, y: 0, width: windowSize.width, height: windowSize.height },
            // we want to set our webview to automatically resize as our
            // window size changes, so we should set autoResize for both width and
            // height to true
            autoResize: { width: true, height: true }
        })

        // after creating our webivew, we should load a website! :)
		// note: this could also be a local HTML file... (like index.html)
		// all filepaths are loaded realtive to the manifest.json file in
		// your extension's directory...
		// example: ext.webviews.loadURL(webviewOne.id, 'file://index.html')
		// and
		// example: ext.webviews.loadFile(webviewOne.id, 'index.html')
		// should both work...
        // await ext.webviews.loadURL(window.id, 'https://www.ext.store')
        await ext.webviews.loadFile(webview.id, 'index.html');
    }

})

// listen for tab click event
ext.tabs.onClicked.addListener(async () => {
    if (window && window.id) {  // safety check
      await ext.windows.restore(window.id) // un-minimize the window
      await ext.windows.focus(window.id) // bring window to front and focus it
    }
}) 


ext.tabs.onClickedClose.addListener(async () => {
    // safety check, make sure tab exists
    if(tab && tab.id) {
        await ext.tabs.remove(tab.id)
        tab = null;
    }

    // safety check, make sure window exists
    if(window && window.id) {
        ext.windows.remove(window.id);
        window = null;
    }
})

ext.windows.onClosed.addListener(async () => {
    if (tab && tab.id) {
      await ext.tabs.remove(tab.id)
      tab = null
    }
})
