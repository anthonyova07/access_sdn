// Empty JS for your own code to be here

//sbtn is id of submit button
var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];

var close = document.getElementById("botoncerrarmodal");

// When the username clicks on <span> (x), close the modal
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
        data: { id: $('#id').val(), username: $('#username').val(), commentary: $('#commentary').val(), 'urladdress': $('#urladdress').val(), initial_time: $('#initial_time').val(), final_time: $('#final_time').val(), status: "acceptet" }, //form values
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
        data: { id: $('#id').val(), username: $('#username').val(), commentary: $('#commentary').val(), 'urladdress': $('#urladdress').val(), initial_time: $('#initial_time').val(), final_time: $('#final_time').val(), status: "rejected" }, //form values
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
    var table = document.getElementById("body-solicitud");
    if (datos.erase) {
        console.log("Se mando a borrar", e.erase);
        table.innerHTML = "";
        return
    } else {
        console.log("No vino nada en borrr", e.erase)
    }
    // Find a <table> element with id="myTable":
    var arrdatos = [datos.username, datos.urladdress, datos.commentary, datos.initial_time, datos.final_time, datos.status]

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
            inputs[0].value = self.data.username;
            inputs[1].value = self.data.urladdress;
            inputs[2].value = self.data.initial_time;
            inputs[3].value = self.data.final_time;
            inputs[4].value = self.data.id;

            console.log("El status es:", self.data.status)

            var restante = document.getElementById("restante");

            var inicio = new Date(self.data.initial_time)
            var fin = new Date(self.data.final_time)
            var distance = new Date(fin.getTime() - inicio.getTime()); //+ 10800000);
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));

            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);


            restante.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
            console.log("El tiempo restante es:", restante.innerHTML);

            var botones = document.getElementById("botones");

            if (self.data.status != "registered") {
                botones.style.display = "none"

            } else {
                botones.style.display = "block"

            }
            modal.style.display = "block";

        }
        // When the username clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
        //.srcElement.childNodes[0].nodeValue
    console.log("_______________________________________________________________");
    console.log('------------------------------------');

};
console.log("Escuchando los clientes");