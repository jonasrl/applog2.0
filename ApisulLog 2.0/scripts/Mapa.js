function Mapa(height, width, container, locationDefault) {
    if (height) this.Height = height;
    if (width) this.Width = width;

    this.Polygons = [];
    this.Circles = [];
    this.Markers = [];
    this.MarkersDirections = [];
    this.Polylines = [];
    this.PolylinesDirection = [];
    this.InfoWindow = null;

    if (container)
        this.DivMapa = container
    else {
        this.DivMapa = $("<div'></div>");
        $("body").append(this.DivMapa);
    }

    this.CarregaMapa(locationDefault == null ? true : locationDefault);
}

Mapa.prototype.CarregaMapa = function (locationDefault) {
    var divMapaPlota;

    var mapOptions = {
        zoom: 6,
        //mapTypeId: google.maps.MapTypeId.HYBRID,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(-30.0278, -51.2310)
    };

    if (this.Height)
        this.DivMapa.css("height", this.Height + "px");
    else
        this.DivMapa.css("height", "100%");

    if (this.Width)
        this.DivMapa.css("width", this.Width + "px");
    else
        this.DivMapa.css("width", "100%");

    divMapaPlota = this.DivMapa.get()[0];

    var map = new google.maps.Map(divMapaPlota, mapOptions);

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON, google.maps.drawing.OverlayType.CIRCLE]
        }
    });
    drawingManager.setMap(map);

    this.DrawingManager = drawingManager;

    this.Geocoder = new google.maps.Geocoder();

    if (locationDefault) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = new google.maps.LatLng(position.coords.latitude,
                                                 position.coords.longitude);
                
                map.setCenter(pos);
            });
        }
    }

    this.Mapa = map;
}

Mapa.prototype.AddMarker = function (marker) {
    this.Markers.push(marker);
}

Mapa.prototype.AddMarkerDirection = function (marker) {
    this.MarkersDirections.push(marker);
}

Mapa.prototype.ClearPolygons = function () {
    for (var i = 0; i < this.Polygons.length; i++) {
        this.Polygons[i].setMap(null);
    }

    this.Polygons.length = 0;
}

Mapa.prototype.ClearCircles = function () {
    for (var i = 0; i < this.Circles.length; i++) {
        this.Circles[i].setMap(null);
    }

    this.Circles.length = 0;
}

Mapa.prototype.AddPolyline = function (polyline) {
    this.Polylines.push(polyline);
}

Mapa.prototype.AddPolylineDirection = function (polyline) {
    this.PolylinesDirection.push(polyline);
}

Mapa.prototype.ClearMarkers = function () {
    for (var i = 0; i < this.Markers.length; i++) {
        this.Markers[i].setMap(null);
    }

    this.Markers.length = 0;
}

Mapa.prototype.ClearMarkersDirections = function () {
    for (var i = 0; i < this.MarkersDirections.length; i++) {
        this.MarkersDirections[i].setMap(null);
    }

    this.MarkersDirections.length = 0;
}

Mapa.prototype.ClearPolylines = function () {
    for (var i = 0; i < this.Polylines.length; i++) {
        this.Polylines[i].setMap(null);
    }

    this.Polylines.length = 0;
}

Mapa.prototype.ClearPolylinesDirection = function () {
    for (var i = 0; i < this.PolylinesDirection.length; i++) {
        this.PolylinesDirection[i].setMap(null);
    }

    this.PolylinesDirection.length = 0;
}

Mapa.prototype.ClearMap = function () {
    this.ClearCircles();
    this.ClearPolygons();
    this.ClearMarkers();
    this.ClearPolylines();
    this.ClearMarkersDirections();
    this.ClearPolylinesDirection();
}

Mapa.prototype.ClearDirections = function () {
    this.ClearPolylinesDirection();
    this.ClearMarkersDirections();
}

Mapa.prototype.SetCenterMap = function (location) {
    this.Mapa.setCenter(location);
}

Mapa.prototype.SearchAddress = function (address, success, error) {
    var mapaLocal = this;
    this.Geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results.length == 1) {
                mapaLocal.SetCenterMap(results[0].geometry.location);
                mapaLocal.Mapa.setZoom(14);
            }
            if (success) success(results);
        } else {
            AbreNotificacao("Não foi possível encontrar o endereço informado na pesquisa", 3);
            if (error) error();
        }
    });
}

Mapa.prototype.SearchLatLng = function (coord, success, error) {
    this.Geocoder.geocode({ 'latLng': coord }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (success) success(results);
        } else {
            AbreNotificacao("Não foi possível encontrar o endereço a partir das coordenadas informadas na pesquisa", 3);
            if (error) error();
        }
    });
}

Mapa.prototype.NewCircleByRadius = function (radius, location) {
    var circle = new google.maps.Circle({
        center: location,
        radius: radius,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: this.Mapa
    });

    this.Circles.push(circle);

    return circle;
}

Mapa.prototype.NewCircleByShape = function (shape) {
    this.Circles.push(shape);
}

Mapa.prototype.SetBounds = function (bounds) {
    var latlngBounds = new google.maps.LatLngBounds();
    for (var i = 0; i < bounds.length; i++) {
        latlngBounds.extend(bounds[i]);
    }
    this.Mapa.fitBounds(latlngBounds);
}

Mapa.prototype.SetBoundsCircle = function (bounds) {
    this.Mapa.fitBounds(bounds);
}

Mapa.prototype.NewPolygonByPaths = function (coordenadas, setBounds) {
    var polygon = new google.maps.Polygon({
        paths: coordenadas,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.15,
        map: this.Mapa
    });

    if (setBounds)
        this.SetBounds(coordenadas);

    this.Polygons.push(polygon);
    return polygon;
}

Mapa.prototype.NewPolygonByShape = function (shape) {
    this.Polygons.push(shape);
}

Mapa.NewLatLng = function (lat, lng) {
    return new google.maps.LatLng(lat, lng);
}

Mapa.prototype.NewMarkerByShape = function (shape) {
    this.AddMarker(shape);
}

Mapa.prototype.NewMarker = function () {
    var marker = new google.maps.Marker({
        map: this.Mapa
    });
    this.AddMarker(marker);
    return marker;
}

Mapa.prototype.NewMarkerToCircle = function (circle) {
    var marker = new google.maps.Marker({
        position: circle.getCenter(),
        map: this.Mapa,
        draggable: true
    });
    marker.bindTo('position', circle, 'center');
    this.AddMarker(marker);
    return marker;
}

Mapa.prototype.NewMarkerAtPoint = function (location) {
    var marker = new google.maps.Marker({
        position: location,
        map: this.Mapa
    });

    this.AddMarker(marker);

    return marker;
}

Mapa.prototype.NewMarkerDirectionAtPoint = function (location) {
    var marker = new google.maps.Marker({
        position: location,
        map: this.Mapa
    });

    this.AddMarkerDirection(marker);

    return marker;
}

Mapa.prototype.DeleteMarkerByPoint = function (ponto) {
    for (var i = 0; i < this.Markers.length; i++) {
        if (this.Markers[i].ponto && this.Markers[i].ponto == ponto)
            this.Markers[i].setMap(null);
    }
}

Mapa.prototype.NewPolylineByPaths = function (coordenadas, setBounds) {
    var polyline = new google.maps.Polyline({
        path: coordenadas,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        map: this.Mapa
    });

    if (setBounds)
        this.SetBounds(coordenadas);

    this.AddPolyline(polyline);
    return polyline;
}

Mapa.prototype.NewPolylineDirectionByPaths = function (coordenadas, setBounds) {
    var polyline = new google.maps.Polyline({
        path: coordenadas,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        map: this.Mapa
    });

    if (setBounds)
        this.SetBounds(coordenadas);

    this.AddPolylineDirection(polyline);
    return polyline;
}

Mapa.prototype.Resize = function () {
    google.maps.event.trigger(this.Mapa, 'resize');
}

Mapa.prototype.OpenInfoWindow = function (content, relativeObject) {
    if (!this.InfoWindow)
        this.InfoWindow = new google.maps.InfoWindow({ maxWidth: 300 });
    else
        this.InfoWindow.close();

    this.InfoWindow.setContent(content);
    this.InfoWindow.open(this.Mapa, relativeObject);
}