// Empty JS for your own code to be here
var eventOutputContainer = document.getElementById("event");
var evtSrc = new EventSource("/sus");

evtSrc.onmessage = function(e) {
    console.log(e.data);
    var datos = JSON.parse(e.data);
    console.log("Los datos son:", datos)

    // Find a <table> element with id="myTable":
    var table = document.getElementById("body-solicitud");
    var arrdatos = [datos.user, datos.urladdress, datos.commentary, datos.initial_time, datos.tiempohasta]

    var tr = document.createElement("tr");



    arrdatos.forEach(element => {
        var txt = document.createTextNode(element);
        var td = document.createElement("td");

        td.appendChild(txt);
        // td.classList.add("col-md-2");
        // td.classList.add("border_cell");

        tr.appendChild(td);

    });
    tr.datos = datos;
    tr.addEventListener('click', function(value) {
        console.log('------------------------------------');
        console.log(this.datos.urladdress);
        console.log('------------------------------------');
        callModal();
    });
    table.appendChild(tr);

    var modal = document.getElementById('myModal');

    var callModal = function() {
        console.log("Se llamo el metodo del modal ")
            // Get the modal
        var inputs = modal.querySelectorAll("input");
        var textarea = modal.querySelector("textarea");
        textarea.value = datos.commentary;
        inputs[0].value = datos.user;
        inputs[1].value = datos.urladdress;
        inputs[2].value = datos.initial_time;
        inputs[3].value = datos.tiempohasta;

        console.log(inputs)

        modal.style.display = "block";

    }

    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 

    var close = document.getElementById("botoncerrarmodal");

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    close.onclick = function() {
        console.log("Se mando a cerrar");
        modal.style.display = "none";
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

    var comentarios = {
        // // // Add some text to the new cells:
        // // cell1.innerHTML = datos.user;
        // // cell2.innerHTML = datos.pagina;
        // // cell3.innerHTML = datos.commentary;
        // // cell4.innerHTML = initial_time;
        // // cell5.innerHTML = tiempohasta;
        // var txt = document.createTextNode(datos.user);
        // var td = document.createElement("td");


        // td.appendChild(txt);
        // tr.appendChild(td);
        // table.appendChild(tr)
        // // Create an empty <tr> element and add it to the 1st position of the table:
        // var row = table.insertRow(1);

        // // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        // var cell1 = row.insertCell(0);
        // var cell2 = row.insertCell(1);
        // var cell3 = row.insertCell(2);
        // var cell4 = row.insertCell(3);
        // var cell5 = row.insertCell(4);


        // // cell1.classList.add("add_user_addedlist");
        // // cell2.classList.add("add_user_addedlist");
        // // cell3.classList.add("add_user_addedlist");
        // // cell3.classList.add("add_user_addedlist");
        // // cell4.classList.add("add_user_addedlist");

        // cell1.classList.add("col-md-2");
        // cell2.classList.add("col-md-2");
        // cell3.classList.add("col-md-2");
        // cell4.classList.add("col-md-2");
        // cell5.classList.add("col-md-2");

        // initial_time = new Date(datos.initial_time);
        // tiempohasta = new Date(datos.tiempohasta);

        // // Add some text to the new cells:
        // cell1.innerHTML = datos.user;
        // cell2.innerHTML = datos.pagina;
        // cell3.innerHTML = datos.commentary;
        // cell4.innerHTML = initial_time;
        // cell5.innerHTML = tiempohasta;

        // // cell4.innerHTML = '<button type="button" class="btn btn-outline-success">Aceptar</button>' + '<button type="button" class="btn btn-danger">Danger</button>'

    }


};
console.log("Escuchando los clientes");

// $(document).ready(function() {
//     $('#request_table').bind("click", console.log("Se pusldsd"));
//     $('#request_table').DataTable({
//         responsive: {
//             details: {
//                 display: $.fn.dataTable.Responsive.display.modal({
//                     header: function(row) {
//                         var data = row.data();
//                         return 'Details for ' + data[0] + ' ' + data[1];
//                     }
//                 }),
//                 renderer: $.fn.dataTable.Responsive.renderer.tableAll({
//                     tableClass: 'table'
//                 })
//             }
//         }
//     });
// });