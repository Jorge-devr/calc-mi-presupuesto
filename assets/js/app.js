document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias a los elementos del DOM
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const addButton = document.getElementById('addButton');
    const ingresoList = document.getElementById('ingresoList');
    const egresoList = document.getElementById('egresoList');
    const disponibleElement = document.getElementById('disponible');
    const resetButton = document.getElementById('resetButton');

    // Cargar los objetos guardados del local storage al cargar la página
    let objects = JSON.parse(localStorage.getItem('objects')) || [];
    updateDisponible(); // Actualizar el saldo disponible al cargar la página

    // Evento click para el botón "Agregar"
    addButton.addEventListener('click', () => {
        // Obtener los valores de los campos de entrada
        const description = descriptionInput.value;
        const amount = parseInt(amountInput.value);
        const type = document.querySelector('input[name="type"]:checked').value;

        // Validar que la descripción no esté vacía y que la cantidad sea un número válido
        if (description && !isNaN(amount)) {
            // Crear un nuevo objeto con los valores obtenidos
            const newObject = { description, amount, type };

            // Añadir el nuevo objeto al DOM
            addObjectToDOM(newObject);

            // Guardar el nuevo objeto en el local storage
            objects.push(newObject);
            saveObjectsToLocalStorage();

            // Actualizar el saldo disponible
            updateDisponible();

            // Limpiar los campos de entrada después de agregar el objeto
            clearInputs();
        } else {
            // Mostrar una alerta si los campos no son válidos
            alert('Por favor, complete todos los campos correctamente.');
        }
    });
    // Evento click para el botón "Reset"
    resetButton.addEventListener('click', () => {
        // Eliminar todos los datos del almacenamiento local
        localStorage.removeItem('objects');

        // Limpiar el contenido de las listas en el DOM
        ingresoList.innerHTML = '';
        egresoList.innerHTML = '';

        // Actualizar el saldo disponible después de eliminar todos los datos
        updateDisponible();
        // Recargar la página
        window.location.reload();
    });

    // Función para añadir un objeto al DOM
    function addObjectToDOM(obj) {
        // Crear un nuevo elemento de lista (li)
        const listItem = document.createElement('li');

        // Establecer el contenido del elemento de lista
        listItem.innerHTML = `${obj.description}<br>$${obj.amount}`;

        // Añadir el elemento de lista a la lista correspondiente (ingreso o egreso) en el DOM
        if (obj.type === 'ingreso') {
            ingresoList.appendChild(listItem);
        } else {
            egresoList.appendChild(listItem);
        }

        // Agregar evento de clic para cambiar el color y eliminar el elemento al hacer clic
        listItem.addEventListener('click', () => {
            // Eliminar el objeto del array de objetos
            const index = objects.indexOf(obj);
            if (index !== -1) {
                objects.splice(index, 1);
                saveObjectsToLocalStorage();
            }
// Cambiar el color del elemento al hacer clic
listItem.style.backgroundColor = 'red'; // Cambiar a tu color deseado
setTimeout(() => {
    listItem.remove();
    
    // Actualizar el saldo disponible después de eliminar el elemento
    updateDisponible();
}, 500);
        });

    }

    // Función para guardar los objetos en el local storage
    function saveObjectsToLocalStorage() {
        localStorage.setItem('objects', JSON.stringify(objects));
    }

    // Función para limpiar los campos de entrada
    function clearInputs() {
        descriptionInput.value = '';  // Limpiar el campo de descripción
        amountInput.value = '';  // Limpiar el campo de cantidad
    }

    // Función para calcular y actualizar el saldo disponible
    function updateDisponible() {
        // Calcular la suma de ingresos y la suma de egresos
        let ingresos = 0;
        let egresos = 0;
        objects.forEach(obj => {
            if (obj.type === 'ingreso') {
                ingresos += obj.amount;
            } else {
                egresos += obj.amount;
            }
        });

        // Calcular el saldo disponible
        const disponible = ingresos - egresos;

        // Actualizar el HTML con el saldo disponible
        disponibleElement.innerHTML = `<span><p>Disponible:&nbsp;</p></span><span class="green"><p>$ ${disponible}</p></span>`;
    }
});
