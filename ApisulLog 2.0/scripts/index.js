var app;

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    app = new kendo.mobile.Application(document.body, {
    
    // comment out the following line to get a UI which matches the look
    // and feel of the operating system
    skin: 'flat',
    
    // the application needs to know which view to load first
    initial: 'views/splash.html'
    });
}