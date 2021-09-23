/*-------------------------------------------*\
    Scroll To Top
\*-------------------------------------------*/

$("#ScrollToTop").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1000);
});
//Animación Botón Subir , aparecer y desaparecer botón según scroll top+200px
$(function () {
    var header = $(".scroll-top");
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll >= 200) header.removeClass("scroll-top").addClass("go-up");
        else header.removeClass("go-up").addClass("scroll-top");
    });
});

/*Configuración del toast*/
toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: "toast-bottom-left",
    preventDuplicates: true,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
};

$(document).ready(function () {
    //Event clic on button
    $("#signin_submit").click(function () {
        //Show menu
        console.log("Sign in submit button");

        //Get data
        var nickname = $("#signin_nickname").val(), 
            username = $("#signin_username").val(),
            password = $("#signin_password").val(),
            email    = $("#signin_email").val();

        //Validate data
        if (nickname == "" || username == "" || password == "" || email == "") {
            // alert("Please, fill all fields");
            toastr["info"]("Por favor, rellene todos los campos", "Intento de registro");
        } else {
            // alert("Perfect!");
            toastr["success"]("Usted ha sido registrado con éxito", "Satisfactorio");
        }
    });

    $("#login_submit").click(function () {
        //Show menu
        console.log("Login submit button");

        //Get data
        var username = $("#login_username").val(),
            password = $("#login_password").val();

        //Validate data
        if (username == "" || password == "") {
            // alert("Please, fill all fields");
            toastr["info"]("Por favor, rellene todos los campos", "Intento de login");
        } else {
            // alert("Perfect!");
            toastr["success"]("Usted ha iniciado sesión con éxito", "Satisfactorio");
        }

    });
});