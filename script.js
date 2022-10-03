// Peticion de los usuarios que hay en el backend para mostrarlos en el front
try{
    fetch("http://localhost:3000/mostrarUsuarios")
        .then(res=>res.json())
        .then(res=>
            res.forEach(usuario =>{
                const tablaDeUsuarios = document.querySelector(".tbody");
                tablaDeUsuarios.innerHTML += `
                    <tr class="row" id="rowUsuario-${usuario.id}">
                        <td><button class="modificar">Modificar</button></td>
                        <td>${usuario.nombre}</td>
                        <td>${usuario.apellido}</td>
                        <td>${usuario.email}</td>
                    <td><button class="delete">Eliminar</button></td>
                </tr>
                `;
        
                const btnDelete = document.querySelectorAll(".delete")
                    
                btnDelete.forEach((btn)=>{
                    btn.addEventListener("click",()=>{ 
                        let idUsuarioBorrado = btn.parentNode.parentNode.getAttribute("id").slice(-1);
                        btn.parentNode.parentNode.remove();
                        
                        fetch(`http://localhost:3000/deleteItem/${idUsuarioBorrado}`,{
                            method:"DELETE"
                        })
                    })
                }) 

                const btnModificar = document.querySelectorAll(".modificar")
                modificarUsuario(btnModificar)
            }
        )
    )
}
catch(e){
    console.log(e)
}

// Obtencion de los datos del formulario para generar un nuevo usuario para mostrarlo en la tabla y enviarlo al backend
const form = document.querySelector("form");
form.addEventListener("submit",(event)=>{
    event.preventDefault();
    nuevoUsuarioEnTabla();
    form.reset();
})

// Registro de nuevo usuario, se agrega a la tabla y al backend. Ademas tambien esta la funcion de eliminar al usuario de la tabla y del backend
async function nuevoUsuarioEnTabla (){
    let datosForm = new FormData(form);

    let nombreNuevoUsuario = datosForm.get("nombre");
    let apellidoNuevoUsuario = datosForm.get("apellido");
    let emailNuevoUsuario = datosForm.get("email");

    let peticion = await fetch("http://localhost:3000/mostrarUsuarios");
    let resp = await peticion.json();

    let validacionEmail;
    // Validacion de mail
    resp.forEach(usu=>{
        validacionEmail += usu.email;
    })

    let regexValidacionEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

    let alertas = document.querySelector(".alertas");

    // Validacion que no esten vacios los inputs y que el mail sea uno distinto a uno ya registrado
    if(nombreNuevoUsuario != "" && apellidoNuevoUsuario != "" && emailNuevoUsuario != "" && validacionEmail.includes(emailNuevoUsuario) == false && nombreNuevoUsuario.length >= 3 && apellidoNuevoUsuario.length >= 3 && regexValidacionEmail.test(emailNuevoUsuario)){
        let tablaForm = document.querySelector(".table");

        // Agrega un nuevo id al nuevo usuario
        let id = await fetch("http://localhost:3000/mostrarUsuarios");
        usuarios = await id.json();
        ultimoId = await usuarios[usuarios.length - 1].id;
        idNuevoUsuario = ultimoId + 1;

        tablaForm.innerHTML += `
            <tr class="row" id="rowUsuario-${idNuevoUsuario}">
                <td><button class="editar">Modificar</button></td>
                <td>${nombreNuevoUsuario}</td>
                <td>${apellidoNuevoUsuario}</td>
                <td>${emailNuevoUsuario}</td>
                <td><button class="delete">Eliminar</button></td>
            </tr>
        `;
        
        const btnDelete = document.querySelectorAll(".delete")
                    
        btnDelete.forEach((btn)=>{
            btn.addEventListener("click",()=>{ 
                let idUsuarioBorrado = btn.parentNode.parentNode.getAttribute("id").slice(-1);
                btn.parentNode.parentNode.remove();
                        
                fetch(`http://localhost:3000/deleteItem/${idUsuarioBorrado}`,{
                    method:"DELETE"
                })
            })
        }) 
        
    
        const nuevoUsuarioJson = {
            id: idNuevoUsuario,
            nombre: nombreNuevoUsuario,
            apellido: apellidoNuevoUsuario,
            email: emailNuevoUsuario
        }
        

        console.log(nuevoUsuarioJson)
    
        try{
            fetch("http://localhost:3000/agregarNuevoUsuario",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoUsuarioJson)
        })
        }
        catch(e){
            console.log(e)
        }


        let btnModificar = document.querySelectorAll(".editar")
        modificarUsuario(btnModificar)

        alertas.innerText = ""
    } else if (nombreNuevoUsuario == "" && apellidoNuevoUsuario == "" && emailNuevoUsuario == "") {
        alertas.innerText = "Hay campos sin rellenar."
    } else if (nombreNuevoUsuario != "" && apellidoNuevoUsuario != "" && emailNuevoUsuario != "" && validacionEmail.includes(emailNuevoUsuario)) {
        alertas.innerText = "Hay un usuario ya registrado con ese email."
    }
}

// Lo que hace es que al darle click al boton actualizar abre un modal con un formulario para actualizar los datos del usuario
function modificarUsuario(btnModificar) {

  btnModificar.forEach((btn) => {
    btn.addEventListener("click", () => {

        const main = document.querySelector(".main")

        let divFormularioActualizar = document.createElement("div")
        divFormularioActualizar.classList.add("div-formulario-actualizar");
        divFormularioActualizar.innerHTML = `
            <form  method="put" class="form-actualizar" id="form-actualizar">
                <button type="button" class="cerrar-formulario-actualizar">X</button>
                <label for="nameAct">Nombre: </label>
                <input id="nameAct" type="text" name="nombre" autocomplete="off" placeholder="Introduzca su nombre">
                <br>
                <label for="surnameAct">Apellido: </label>
                <input id="surnameAct" type="text" name="apellido" autocomplete="off" placeholder="Introduzca su apellido">
                <br>
                <label for="emailAct">Correo Electronico: </label>
                <input id="emailAct" type="email" name="email" autocomplete="off" placeholder="Introduzca su email">
                <br>
                <button type="submit" class="btnModUsu" id="btnModUsu">Modificar usuario</button>
                <p class="alertasModUsu"></p>
            </form>
         `
        let formAct = document.querySelectorAll(".form-actualizar")



        // Cerrar formulario actualizar usuario
        divFormularioActualizar.addEventListener("click",(e)=>{
            if(e.target && e.target.classList.contains("cerrar-formulario-actualizar")){
                divFormularioActualizar.remove()
            }

            if(e.target && e.target.classList.contains("btnModUsu")){
                const form = document.querySelector("#form-actualizar")
                form.addEventListener("submit",(e)=>{
                    e.preventDefault()
                })
                let dataFormAct = new FormData(form)

                let nuevoNombre = dataFormAct.get("nombre");
                let nuevoApellido = dataFormAct.get("apellido");
                let nuevoEmail = dataFormAct.get("email")

                let nombreAModificar = btn.parentNode.parentNode.getElementsByTagName("td")[1];
                let apellidoAModificar = btn.parentNode.parentNode.getElementsByTagName("td")[2];
                let emailAModificar = btn.parentNode.parentNode.getElementsByTagName("td")[3];

                fetch("http://localhost:3000/mostrarUsuarios")
                    .then(resp=>resp.json())
                    .then(data=>{
                        let validacionEmail;
                        // Validacion de mail
                        data.forEach(usu=>{
                            validacionEmail += usu.email;
                        })

                        let regexValidacionEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

                        let alertas = document.querySelector(".alertasModUsu");


                        if (nuevoNombre != "" && nuevoApellido != "" && nuevoEmail != "" && validacionEmail.includes(nuevoEmail) == false && nuevoNombre.length >= 3 && nuevoApellido.length >= 3 && regexValidacionEmail.test(nuevoEmail)) {
                            nombreAModificar.innerText = nuevoNombre;
                            apellidoAModificar.innerText = nuevoApellido;
                            emailAModificar.innerText = nuevoEmail;

                            let usuarioActualizado = {
                                nombre: dataFormAct.get("nombre"),
                                apellido: dataFormAct.get("apellido"),
                                email: dataFormAct.get("email")
                            }
                            
                            console.log(usuarioActualizado)

                            idUsuarioAModificar = btn.parentNode.parentNode.getAttribute("id").slice(-1);

                            console.log(idUsuarioAModificar)

                            fetch(`http://localhost:3000/actualizarUsuario/${idUsuarioAModificar}`,{
                                method:"PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body:JSON.stringify(usuarioActualizado)
                            })

                            alertas.innerText = ""
                        } else if (nuevoNombre == "" && nuevoApellido == "" && nuevoEmail == "") {
                            alertas.innerText = "Hay campos sin rellenar."
                        } else if (nuevoNombre != "" && nuevoApellido != "" && nuevoEmail != "" && validacionEmail.includes(nuevoEmail)) {
                            alertas.innerText = "Hay un usuario ya registrado con ese email."
                        }
                    })                
            }
        })
        // Integra el modal del nuevo formulario al documento HTML
        main.appendChild(divFormularioActualizar)   
    });
  });
}
