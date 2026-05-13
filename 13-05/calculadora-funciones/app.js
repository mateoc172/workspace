// =====================================
// CALCULADORA CON FUNCIONES
// =====================================

// Función suma
function sumar(a, b) {
    return a + b;
}

// Función resta
function restar(a, b) {
    return a - b;
}

// Función multiplicación
function multiplicar(a, b) {
    return a * b;
}

// Función división
function dividir(a, b) {
    if (b === 0) {
        return "Error: no se puede dividir entre 0";
    }

    return a / b;
}
// Función potencia
function potencia(a, b) {
    return a ** b;
}
{
// Ejemplo
console.log(potencia(a, b));

}
// =====================================
// LLAMADO DE FUNCIONES
// =====================================

console.log("Resultado suma:");
console.log(sumar(10, 5));

console.log("----------------");

console.log("Resultado resta:");
console.log(restar(10, 5));

console.log("----------------");

console.log("Resultado multiplicación:");
console.log(multiplicar(10, 5));

console.log("----------------");

console.log("Resultado división:");
console.log(dividir(10, 5));
