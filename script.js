// Arreglo para almacenar los gastos
let gastos = [];

// Manejar el envío del formulario
document.getElementById('gastoForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Obtener los valores de los inputs
    const concepto = document.getElementById('concepto').value;
    const cantidad = parseFloat(document.getElementById('cantidad').value);
    const fecha = document.getElementById('fecha').value;

    // Añadir gasto al arreglo
    gastos.push({ concepto, cantidad, fecha });

    // Limpiar los campos
    document.getElementById('gastoForm').reset();

    // Actualizar tabla de gastos
    actualizarTabla();
});

// Función para actualizar la tabla de gastos
function actualizarTabla() {
    const tableBody = document.getElementById('gastosTable');
    tableBody.innerHTML = '';  // Limpiar contenido previo

    gastos.forEach(gasto => {
        const row = document.createElement('tr');

        const conceptoCell = document.createElement('td');
        conceptoCell.textContent = gasto.concepto;
        row.appendChild(conceptoCell);

        const cantidadCell = document.createElement('td');
        cantidadCell.textContent = gasto.cantidad.toFixed(2);
        row.appendChild(cantidadCell);

        const fechaCell = document.createElement('td');
        fechaCell.textContent = gasto.fecha;
        row.appendChild(fechaCell);

        tableBody.appendChild(row);
    });
}

// Función para calcular el total de gastos quincenal o mensual
function calcularTotal(tipo) {
    const resumenElement = document.getElementById('resumenTotal');
    let total = 0;
    const hoy = new Date();
    
    gastos.forEach(gasto => {
        const fechaGasto = new Date(gasto.fecha);
        const diffTime = hoy - fechaGasto;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (tipo === 'quincenal' && diffDays <= 15) {
            total += gasto.cantidad;
        } else if (tipo === 'mensual' && diffDays <= 30) {
            total += gasto.cantidad;
        }
    });

    resumenElement.textContent = `Total de gastos ${tipo}: $${total.toFixed(2)}`;
}

// Función para descargar el balance en Excel
function descargarExcel(tipo) {
    // Crear una nueva hoja de cálculo
    const wb = XLSX.utils.book_new();

    // Preparar los datos para el archivo Excel
    const datos = [
        ["Concepto", "Cantidad", "Fecha"]
    ];

    // Filtrar gastos según el tipo (quincenal o mensual)
    const hoy = new Date();
    let total = 0;
    const gastosFiltrados = gastos.filter(gasto => {
        const fechaGasto = new Date(gasto.fecha);
        const diffTime = hoy - fechaGasto;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (tipo === 'quincenal' && diffDays <= 15) {
            total += gasto.cantidad;
            return true;
        } else if (tipo === 'mensual' && diffDays <= 30) {
            total += gasto.cantidad;
            return true;
        }
        return false;
    });

    // Añadir los gastos al arreglo de datos
    gastosFiltrados.forEach(gasto => {
        datos.push([gasto.concepto, gasto.cantidad, gasto.fecha]);
    });

    // Añadir el resumen final
    datos.push([]);
    datos.push(["Total de gastos", total.toFixed(2)]);
    datos.push(["Tipo de resumen", tipo === 'quincenal' ? "Quincenal" : "Mensual"]);

    // Crear una hoja de cálculo con los datos
    const ws = XLSX.utils.aoa_to_sheet(datos);

    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, "Gastos");

    // Descargar el archivo Excel
    XLSX.writeFile(wb, `Balance_Gastos_${tipo}.xlsx`);
}
