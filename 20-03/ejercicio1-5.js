let x =10;
{
    let y = 20;
    console.log("x dentro :");
    console.log(x);
    console.log("y dentro :");
    console.log(y);
}
console.log("x fuera :");
console.log(x);
//la variable y no es accesible fuera del bloque, por lo que esta lineaa generara un error
console.log("y fuera :");
console.log(y);