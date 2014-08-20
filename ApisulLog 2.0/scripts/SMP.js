var intervaloMensagem;
var numeroSMPAtual;
var rotaAtual;

function buscaRotaSMP(){
    var numeroSMP = $('#numeroSMP').val();
    if (numeroSMP != '')
    {
        mapa.ClearMap();
        
        $.ajax({
            type: "POST",
            url: url + "BuscaSMP",
            data: {
                NumeroSMP: parseInt(numeroSMP)
            },
            dataType: "json",
            success: function (result) {
                if (result)
                {
                    var list = result;
                    var rota = new Array();
                    var lista = list.LatLng;
                    for (var i = 0; i < lista.length; i++) {
                        rota.push(Mapa.NewLatLng(lista[i][0], lista[i][1]));
                    }
                    
                    $('#buttonMensagem').show();
                    setIntervaloMensagem(numeroSMP);                    
        
                    rotaAtual = rota;
                    mapa.NewPolylineByPaths(rota, true);
        
                    $.ajax({
                        type: "GET",
                        url: url + 'BuscaHistoricoPosicao/' + list.IdSMP,
                        success: function (result) {
                            mostrarIconesCaminhao(result);
                        },
                        error: function (e) {
                            navigator.notification.alert('Erro ao pesquisar histórico de posições');
                        },
                    });
        
                    $.ajax({
                        type: "GET",
                        url: url + 'BuscaPontos/' + list.IdSMP,
                        success: function (result) {
                            var label, smpPontoModelo;
                            var list = result;
        
                            MapaLabel.ClearLabels();
                            mapa.ClearCircles();
                            mapa.ClearPolygons();
        
                            for (var j = 0; j < list.length; j++) {
                                smpPontoModelo = list[j];
        
                                var marker = mapa.NewMarkerAtPoint(Mapa.NewLatLng(smpPontoModelo.Lats[0], smpPontoModelo.Lngs[0]));
                                marker.setTitle(smpPontoModelo.Nome);
                                marker.setOptions({ dataItem: smpPontoModelo });
        
                                if (j == 0) {
                                    marker.setIcon("img/MarcadorPontoinicial_35.png");
                                } else if (j == list.length - 1) {
                                    marker.setIcon("img/MarcadorPontofinal_35.png");
                                } else {
                                    marker.setIcon("img/MarcadorPontodeentrega_35.png");
                                }
        
                                label = new MapaLabel({ map: mapa.Mapa }, smpPontoModelo.Nome, "", 0, 0, "#FFFFFF", "Solid 1px #27408B");
                                label.bindEvents(marker);
        
                                if (smpPontoModelo.Raio != null)
                                    mapa.NewCircleByRadius(smpPontoModelo.Raio, Mapa.NewLatLng(smpPontoModelo.Lats[0], smpPontoModelo.Lngs[0]));
                                else {
                                    var pol = new Array();
                                    for (var i = 0; i < smpPontoModelo.Lats.length; i++)
                                        pol.push(Mapa.NewLatLng(smpPontoModelo.Lats[i], smpPontoModelo.Lngs[i]));
                                    mapa.NewPolygonByPaths(pol, false);
                                }
        
                                google.maps.event.addListener(marker, 'click', function () {
                                    buildInfoWindowSMPPonto(this, this.dataItem);
                                });
                            }
                        }
                    });
                }
                else
                {
                    $('.button_mensagem').hide();
                	navigator.notification.alert('SMP não encontrada');
                }
            },
            error: function (e) {
                $('.button_mensagem').hide();
                navigator.notification.alert('Erro ao pesquisar SMP');
            }
        });        
    }
    else
        navigator.notification.alert('Informe o número da SMP');
}

function buildInfoWindowSMPPonto(marker, smpPontoModelo) {
    $('#divInfoWindowSMPPonto #txtEndereco').text(smpPontoModelo.Endereco);
    $('#divInfoWindowSMPPonto #txtIdentificadorPonto').text(smpPontoModelo.Nome);
    $('#divInfoWindowSMPPonto #txtCNPJPonto').text(smpPontoModelo.CNPJ ? smpPontoModelo.CNPJ : "");
    $('#divInfoWindowSMPPonto #txtTelefone').text(smpPontoModelo.Telefone ? smpPontoModelo.Telefone : "");
    mapa.OpenInfoWindow($("#divInfoWindowSMPPonto").html(), marker);
}

function mostrarIconesCaminhao(listRastreadorPosicao) {
    var linhas = $.map(mapa.Polylines, function (polyline) {
        if (polyline.opcional)
            return { linha: polyline }
    });

    for (var i = 0; i < linhas.length; i++) {
        linhas[i].linha.setMap(null);
    }

    for (var i = 0; i < listRastreadorPosicao.length; i++) {
        var rastreadorPosicaoModelo = listRastreadorPosicao[i];

        var location = Mapa.NewLatLng(rastreadorPosicaoModelo.Lats[0], rastreadorPosicaoModelo.Lngs[0]);
        var marker = mapa.NewMarkerAtPoint(location);
        marker.setIcon("/Images/Ponto/MarcadorCaminhao_35.png");
        marker.setOptions({
            dataItem: rastreadorPosicaoModelo,
            opcional: true
        });
    }
}

function setIntervaloMensagem(numeroSMP){
    if (numeroSMPAtual != numeroSMP)
    {
        clearInterval(intervaloMensagem);
        numeroSMPAtual = numeroSMP;
    }
    
    if (!intervaloMensagem)
    {
        intervaloMensagem = setInterval(function(){
            $.ajax({
                type: "GET",
                url: url + "Mensagem/" + numeroSMPAtual,
                success: function (result) {
                    if (result != '')
                    {
                        navigator.notification.beep(1);
                        navigator.notification.vibrate(2000);
                        navigator.notification.alert(result);
                    }
                }
            });
        }, 30000);
    }
}