var stars = 0;

$(document).ready(function() {
    /*Capture event button submit for Login*/
    $('#update_book_submit').click(() => {
        sendFormUpdateBook();
    });

    $('#add_review_submit').click(() => {
        sendFormAddReview();
    });


});

function getMyBooks() {

    $("#main_dashboard").html("" +
        '<div class="card">' +
        '    <div class="card-header">' +
        '        Mis libros' +
        '    </div>' +
        '    <div class="card-body">' +
        '        <table id="example" class="table table-hover table-striped table-bordered" width="100%"></table>' +
        '        <div class="d-flex justify-content-center">' +
        '           <div class="spinner-border text-primary" role="status" id="spinner_status_loading_my_books">' +
        '               <span class="sr-only">Cargando datos...</span>' +
        '           </div>' +
        '        </div>' +
        '    </div>' +
        '</div>' 
    );


    $.ajax({
        url: "/get_my_books",
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        success: function (datos) {
            if (datos == 'there_is_not_records') {
                console.log("No hay registros");
            } else {
                console.log(datos);
                $('#spinner_status_loading_my_books').remove();
                $('#example').DataTable({
                    data: datos,
                    autoWidth: true,
                    'iDisplayLength': 25,
                    columns: [
                        { title: "ISBN" },
                        { title: "Título" },
                        { title: "Autor" },
                        { title: "Año de publicación" },
                        { 'data': null, 
                            title: 'Gestión', 
                            wrap: true, 
                            "render": function (item) { 
                                return '' +
                                '<div class="dropdown show">' +
                                '    <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="actions_list_'+ item[0] +'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                '        <i class="fas fa-tools"></i> Acciones' +
                                '    </a>' +
                                '    <div class="dropdown-menu" aria-labelledby="actions_list_'+ item[0] +'">' +
                                    '        <a class="dropdown-item" href="#" onclick="javascript: UpdateMyBooks(\'' + item[0] + '\', \'' + item[1] + '\', \'' + item[2] + '\', \'' + item[3] + '\')"><i class="fas fa-edit"></i> Actualizar</a>' +
                                    '        <a class="dropdown-item" href="#" onclick="javascript: GetReviewsMyBooks(\'' + item[0] + '\', \'' + item[1] + '\', \'' + item[2] + '\', \'' + item[3] + '\')"><i class="fas fa-quote-right"></i> Reviews</a>' +
                                '        <a class="dropdown-item" href="#" onclick="javascript: DeleteMyBooks(\'' + item[0] + '\')"><i class="fas fa-trash-alt"></i> Eliminar</a>' +
                                '    </div>' +
                                '</div>' +
                                '' 
                            } 
                        },
                    ],
                    responsive: true,
                    language: {
                        "lengthMenu": "Mostrar _MENU_ registros",
                        "zeroRecords": "No se encontraron resultados",
                        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                        "sSearch": "Buscar:",
                        "oPaginate": {
                            "sFirst": "Primero",
                            "sLast": "Último",
                            "sNext": "Siguiente",
                            "sPrevious": "Anterior"
                        },
                        "sProcessing": "Procesando...",
                    },
                    "searching": true,
                    dom: 'Bfrtilp',
                    buttons: [
                        {
                            extend: 'excelHtml5',
                            text: '<i class="fas fa-file-excel"></i> ',
                            titleAttr: 'Exportar a Excel',
                            className: 'btn btn-success',
                            messageTop: 'Todas mis libros',
                            exportOptions: {
                                columns: [0, 1, 2, 3]
                            }
                        },
                        {
                            extend: 'pdfHtml5',
                            text: '<i class="fas fa-file-pdf"></i> ',
                            titleAttr: 'Exportar a PDF',
                            className: 'btn btn-danger',
                            messageTop: 'Todas mis libros',
                            exportOptions: {
                                columns: [0, 1, 2, 3]
                            }
                        },
                        {
                            extend: 'print',
                            text: '<i class="fa fa-print"></i> ',
                            titleAttr: 'Imprimir',
                            className: 'btn btn-info',
                            messageTop: 'Todas mis libros',
                            exportOptions: {
                                columns: [0, 1, 2, 3]
                            }
                        },
                    ],
                    "order": [[3, "desc"]],
                });
            }
        }
    });
}

function UpdateMyBooks(isbn, title, author, year) {
    $('#update_data_isbn').html('<i class="fas fa-key"></i> <b>ISBN: </b>' + isbn);
    
    $('#panel_review_book_title').val(isbn);
    $('#update_data_isbn_value').val(isbn);
    $('#update_book_title').val(title);
    $('#update_book_author').val(author);
    $('#update_book_year').val(year);

    openModal('btnUpdateMyBooks');
}

function GetReviewsMyBooks(isbn, title, author, year) {
    $('#panel_review_book_isbn').html('<i class="fas fa-key"></i> <b>ISBN: </b>' + isbn);
    $('#panel_review_book_isbn_value').val(isbn);

    $('#panel_review_book_title').html(title);
    $('#panel_review_book_author').html(author);
    $('#panel_review_book_year').html('<small class="text-muted"><i class="fas fa-clock"></i> ' + year + ' </small>');

    openModal('btnPanelReviews');
    $("#PanelReviewsShowData").html("No hay reseñas para este libro.");

    // Cargar reviews
    GetAllReviewsByBook(isbn);

}

function GetAllReviewsByBook(isbn){
    var InfoPanelReviewsShowData = '';

    $.ajax({
        url: "/get_all_reviews_by_book",
        data: { 'isbn': isbn },
        type: "post",
        success: function (datos) {
            if (datos == 'there_is_not_records') {
                // console.log("No hay registros");
            }  else {
                var data = JSON.parse(datos);
                
                for (i = 0; i < data.length; i++) {
                    InfoPanelReviewsShowData += "" +
                    '<div class="col-md-12 mb-3">' +
                    '    <div class="card">' +
                    '        <div class="card-body">' +
                    '            <h5 class="card-title"> '

                    for (j = 0; j < data[i][2]; j++) {
                        InfoPanelReviewsShowData += '<i class="fas fa-star"></i>';
                    }
                    
                    for (x = 0; x < (5 - data[i][2]); x++) {
                        InfoPanelReviewsShowData += '<i class="far fa-star"></i>';
                    }
                    InfoPanelReviewsShowData += "" +
                    '            </h5>' +
                    '            <p class="card-text">' +
                    '                <i class="fas fa-user"></i> Escrito por: ' + data[i][1] + ' ' +
                    '            </p>' +
                    '            <p class="card-text">' + data[i][3] + '</p>' +
                    '        </div>' +
                    '    </div>' +
                    '</div>'

                    console.log("Nombre de usuario: " + data[i][1]);
                }

                $("#PanelReviewsShowData").html(InfoPanelReviewsShowData);
            }
        }
    });
}

function sendFormAddReview(){
    var review = $('#panel_review_book_comment').val(),
        isbn = $('#panel_review_book_isbn_value').val();

    if (stars == 0)
        stars = 1;

    if (review == '') {
        toastr["info"]("Escriba una reseña", "No tan rápido");
    } else {
        $.ajax({
            data: { 'isbn': isbn, 'stars': stars, 'review': review },
            url: "/add_review",
            type: "post",
            success: function (datos) {
                if (datos == "Ok") {
                    toastr["success"]("La reseña ha sido agregada", "Satisfactorio");
                    $('#panel_review_book_comment').val('');
                    GetAllReviewsByBook(isbn);
                } else {
                    toastr["info"]("Intente más tarde", "Oops");
                }
            }
        });
    }
}

function DeleteMyBooks(isbn) {
    $.ajax({
        data: { 'isbn': isbn },
        url: "/delete_book",
        type: "post",
        success: function (datos) {
            if (datos == "Ok") {
                toastr["success"]("El libro ha sido eliminado", "Satisfactorio");
                setTimeout(function () {
                    $('#option_header_mis_libros').click();
                }, 500);
            } else {
                toastr["info"]("Intente más tarde", "Oops");
            }
        }
    });
}

function sendFormUpdateBook() {
    var isbn    = $('#update_data_isbn_value').val(),
        title   = $('#update_book_title').val(),
        author  = $('#update_book_author').val(),
        year    = $('#update_book_year').val();

    $.ajax({
        data: { 'isbn': isbn, 'title': title, 'author': author, 'year': year },
        url: "/update_book",
        type: "post",
        success: function (datos) {
            if (datos == "Ok") {
                toastr["success"]("El libro ha sido actualizado", "Satisfactorio");
                setTimeout(function () {
                    $('#UpdateMyBooks').modal('toggle');
                }, 1000);
                setTimeout(function () {
                    $('#option_header_mis_libros').click();
                }, 2000);
            } else {
                toastr["info"]("Intente más tarde", "Oops");
            }
        }
    });
}

function change_stars(value) {
    stars = value;
}