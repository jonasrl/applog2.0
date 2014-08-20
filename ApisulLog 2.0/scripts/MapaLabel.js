function MapaLabel(options, title, detail, x, y, backgroundColor, border, buttons)
{
    this.setValues(options);

    this.title_ = title;
    this.detail_ = detail;
    this.x_ = x;
    this.y_ = y;
    this.buttons_ = buttons;

    var span = this.span_ = document.createElement('span');
    span.style.cssText = 'border:' + border + '; background-color:' + backgroundColor;
    span.className = "mapa_label";

    var div = this.div_ = document.createElement('div');
    div.appendChild(span);
    div.style.cssText = 'position: absolute; display: none';

    MapaLabel.Labels.push(this);
};
MapaLabel.prototype = new google.maps.OverlayView;

MapaLabel.Labels = [];

MapaLabel.ClearLabels = function ()
{
    for (var i = 0; i < MapaLabel.Labels.length; i++)
    {
        MapaLabel.Labels[i].setMap(null);
    }
};

MapaLabel.prototype.changeColor = function (newColor)
{
    this.span_.style.color = newColor;
};

MapaLabel.prototype.onAdd = function ()
{
    var pane = this.getPanes().overlayImage;
    pane.appendChild(this.div_);

    var me = this;
    this.listeners_ = [
    google.maps.event.addListener(this, 'position_changed', function () { me.draw(); }),
    google.maps.event.addListener(this, 'visible_changed', function () { me.draw(); }),
    google.maps.event.addListener(this, 'clickable_changed', function () { me.draw(); }),
    google.maps.event.addListener(this, 'text_changed', function () { me.draw(); }),
    google.maps.event.addListener(this, 'zindex_changed', function () { me.draw(); }),
    google.maps.event.addDomListener(this.div_, 'click', function ()
    {
        if (me.get('clickable'))
        {
            google.maps.event.trigger(me, 'click');
        }
    })
    ];
};

MapaLabel.prototype.bindEvents = function (marker)
{
    this.bindTo('position', marker);
    this.bindTo('text', marker, 'position');
    this.bindTo('visible', marker);
    this.bindTo('clickable', marker);
    this.bindTo('zIndex', marker);
}

MapaLabel.prototype.onRemove = function ()
{
    this.div_.parentNode.removeChild(this.div_);

    for (var i = 0, I = this.listeners_.length; i < I; ++i)
    {
        google.maps.event.removeListener(this.listeners_[i]);
    }
};

MapaLabel.prototype.zIndex = function (zindex)
{
    div.style.zIndex = zindex;
}

MapaLabel.prototype.draw = function ()
{
    var btn;
    var latlng = this.get('position');
    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.get('position'));

    var div = this.div_;
    div.style.left = (position.x + this.x_) + 'px';
    div.style.top = position.y + 'px';

    var visible = this.get('visible');
    div.style.display = visible ? 'block' : 'none';

    var clickable = this.get('clickable');
    this.span_.style.cursor = clickable ? 'pointer' : '';

    var zIndex = this.get('zIndex');
    div.style.zIndex = zIndex == null ? Math.round(latlng.lat() * -100000) : zIndex;

    this.span_.innerHTML = "<b>" + this.title_ + "</b>&nbsp;" + this.detail_ + "</b>&nbsp;";

    if (this.buttons_ != null)
    {
        for (var i = 0; i < this.buttons_.length; i++)
        {
            btn = $(this.buttons_[i]);
            $(div).children('span').append(btn);
        }
    }
};