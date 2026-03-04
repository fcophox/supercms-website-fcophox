import translate from 'google-translate-api-x';

async function test() {
    try {
        const res = await translate(["Hola", "¿Cómo estás?", "Esto es una prueba"], { to: 'en' });
        console.log("Array response:");
        console.dir(res, { depth: null });
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
