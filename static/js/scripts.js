// Empty JS for your own code to be here

//sbtn is id of submit button
var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];

var close = document.getElementById("botoncerrarmodal");

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}
close.onclick = function() {
    console.log("Se mando a cerrar");
    modal.style.display = "none";
}
$('#boton_aceptar').click(function(event) {
    /* Act on the event */
    console.log("Se preciono boron aceptar")
    modal.style.display = "none";

    $.ajax({
        url: 'set_status', //server url
        type: 'POST', //passing data as post method
        dataType: 'json', // returning data as json
        data: { user: $('#user').val(), commentary: $('#commentary').val(), 'urladdress': $('#urladdress').val(), initial_time: $('#initial_time').val(), evict_time_hasta: $('#evict_time_hasta').val(), status: "acceptet" }, //form values
        success: function(json) {
            console.log("He aqui mi respuesta")
            console.log(json.result); //response from the server given as alert message
        }

    });

});


$('#boton_rechazar').click(function(event) {
    /* Act on the event */
    console.log("Se preciono boron rechazar")
    modal.style.display = "none";

    $.ajax({
        url: 'set_status', //server url
        type: 'POST', //passing data as post method
        dataType: 'json', // returning data as json
        data: { user: $('#user').val(), commentary: $('#commentary').val(), 'urladdress': $('#urladdress').val(), initial_time: $('#initial_time').val(), evict_time_hasta: $('#evict_time_hasta').val(), status: "rejected" }, //form values
        success: function(json) {
            console.log("He aqui mi respuesta")
            console.log(json.result); //response from the server given as alert message

        }

    });



});

var eventOutputContainer = document.getElementById("event");
var evtSrc = new EventSource("/sus");

evtSrc.onmessage = function(e) {
    console.log(e.data);
    var datos = JSON.parse(e.data);
    console.log("Los datos son:", datos)

    // Find a <table> element with id="myTable":
    var table = document.getElementById("body-solicitud");
    var arrdatos = [datos.user, datos.urladdress, datos.commentary, datos.initial_time, datos.tiempohasta, datos.status]

    var tr = document.createElement("tr");

    arrdatos.forEach(element => {
        var txt = document.createTextNode(element);
        var td = document.createElement("td");

        td.appendChild(txt);
        // td.classList.add("col-md-2");
        // td.classList.add("border_cell");

        tr.appendChild(td);

    });
    tr.data = datos;
    tr.addEventListener('click', function(value) {

        callModal(this);
    });
    table.appendChild(tr);

    // var modal = document.getElementById('myModal');

    var callModal = function(self) {
            console.log("Se llamo el metodo del modal ")
                // Get the modal
            var inputs = modal.querySelectorAll("input");
            var textarea = modal.querySelector("textarea");
            textarea.value = self.data.commentary;
            inputs[0].value = self.data.user;
            inputs[1].value = self.data.urladdress;
            inputs[2].value = self.data.initial_time;
            inputs[3].value = self.data.tiempohasta;

            console.log(inputs)

            modal.style.display = "block";

        }
        // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
        //.srcElement.childNodes[0].nodeValue
    console.log('------------------------------------');
    console.log();
    console.log('------------------------------------');

};
console.log("Escuchando los clientes");