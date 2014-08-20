$(function(){
    var url = 'http://192.168.0.16/webapi/api/';
    
    setInterval(function(){
        $.ajax({
            type: "GET",
            url: url + "Mensagem/" + $('#numeroSMPMotorista').val(),
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
})

function enviarMensagem(){
    var url = 'http://192.168.0.16/webapi/api/';
    
    $.ajax({
        type: "POST",
        url: url + "Mensagem",
        data: {
            NumeroSMP: parseInt($('#numeroSMPMotorista').val()),
            Texto: $('#mensagem').val()
        },
        dataType: "json",
        success: function (result) {
            navigator.notification.alert("Mensagem enviada!");
        },
        error: function (e) {
            navigator.notification.alert('Erro ao enviar a mensagem');
        }
    });
}