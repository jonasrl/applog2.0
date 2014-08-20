var app;
var mapa;
var validator;
var url = 'http://192.168.0.20/webapi/api/';

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    app = new kendo.mobile.Application(document.body);
    
    mapa = new Mapa(null, null, null, false);
    mapa.DrawingManager.setMap(null);
	mapa.Mapa.controls[google.maps.ControlPosition.TOP_LEFT].push($('#filtroMapa')[0]);
    
    navigator.geolocation.getCurrentPosition(function (position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);        
        mapa.NewMarkerAtPoint(pos);
    });        
    
    setInterval(function(){
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);        
            mapa.NewMarkerAtPoint(pos);
        });        
    }, 120000);
}

function exibirModalMensagem(){
    $("#modal").data("kendoMobileModalView").open()    
}

function fecharModalMensagem(){
    $("#modal").data("kendoMobileModalView").close()
}