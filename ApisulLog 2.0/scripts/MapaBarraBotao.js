MapaBarraBotao.prototype = new google.maps.OverlayView;

function MapaBarraBotao(map, coordenada, shape, functionSalvar)
{
    this.Coordenada = coordenada;
    this.setMap(map);

    var div = this.div_ = document.createElement('div');
    div.style.cssText = 'position: absolute; display: none';

    var divContainer = document.createElement('div');
    divContainer.className = "ml_container";
    $(div).append(divContainer);

    var btnSalvar = this.btnSalvar = document.createElement('div');
    btnSalvar.className = "btn_ml btn_ml_margin btn_ml_editar";
    btnSalvar.style.cssText = 'overflow-x: hidden; overflow-y: hidden; top:21px;';
    btnSalvar.title = "Editar dados";
    
    $(divContainer).append(btnSalvar);
    $(btnSalvar).click(function ()
    {
        functionSalvar(shape);
    });

    var btnCancelar = this.btnCancelar = document.createElement('div');
    btnCancelar.className = "btn_ml btn_ml_margin btn_ml_cancelar";
    btnCancelar.style.cssText = 'overflow-x: hidden; overflow-y: hidden; top:21px; left:30px';
    btnCancelar.title = "Desfazer";

    $(divContainer).append(btnCancelar);
    $(btnCancelar).click({ overlayView: this }, function (e)
    {
        e.data.overlayView.setMap(null);
        shape.setMap(null);
    });
}

MapaBarraBotao.prototype.onAdd = function ()
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

MapaBarraBotao.prototype.onRemove = function ()
{
    this.div_.parentNode.removeChild(this.div_);

    for (var i = 0, I = this.listeners_.length; i < I; ++i)
    {
        google.maps.event.removeListener(this.listeners_[i]);
    }
};

MapaBarraBotao.prototype.draw = function (coordenada)
{
    var projection = this.getProjection();
    var coord = coordenada ? coordenada : this.Coordenada;
    var position = projection.fromLatLngToDivPixel(coord);
    this.Coordenada = coord;

    var div = this.div_;
    div.style.left = position.x + 'px';
    div.style.top = position.y + 'px';

    div.style.display = 'block';
};

MapaBarraBotao.prototype.ocultaBotaoSalvarCancelar = function ()
{
    $(this.btnSalvar).hide();
    $(this.btnCancelar).hide();
}
