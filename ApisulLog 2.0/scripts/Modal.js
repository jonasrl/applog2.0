function enviarMensagem(){
    $.ajax({
        type: "POST",
        url: url + "Mensagem",
        data: {
            NumeroSMP: parseInt(numeroSMPAtual),
            Texto: $('#mensagem').val()
        },
        dataType: "json",
        success: function (result) {
            navigator.notification.alert("Mensagem enviada!");
            fecharModalMensagem();
        },
        error: function (e) {
            navigator.notification.alert('Erro ao enviar a mensagem');
        }
    });
}