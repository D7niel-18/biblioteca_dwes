import express from 'express';
import {libros} from './libros.js';

const app = express();
const PORT = 3000;
app.set('view engine', 'ejs'); // Define EJS como motor de vistas


/* Servir carpeta Public */
app.use(express.static('public'));

/* Rutas - GET - POST */
app.get('/', (req, res) => {
  res.send('200, todo ok');
});

/* GET /api/libros, GET /api/libros/:id y POST /api/libros.  */

app.get('/api/libros', (req, res) => {
    return res.json(libros);
});

/* Ej3 - GET /api/libros/:id convierte el parámetro a número,
devuelve 400 si no es válido y 404 si no existe. */

app.get('/api/libros/:id', (req, res) => {
    const id = Number(req.params.id);
    
    console.log(id);
    
    /* Comprobar si el ID es válido */
    if (!Number.isInteger(id)) {
        return res.status(400).send('ID no válido'); /* Error 400 no es valido */
    }
    
    /* Buscar el libro */
    for (let i = 0; i < libros.length; i++) {
        const libro = libros[i];
        
        if (libro.id == id) {
            return res.json(libro);
        }
    }
    
    /* Si no existe la ID devolvemos 404 */
    return res.status(404).send('Libro no encontrado');
});




app.get('/libros', (req, res) => {
    const busqueda = req.query.busqueda || '';

    const librosFiltrados = libros.filter(libro =>
        libro.titulo.toLowerCase().includes(busqueda.trim().toLowerCase()) ||
        libro.autor.toLowerCase().includes(busqueda.trim().toLowerCase())
    );

    res.render('ficha-libro', {
        libros: librosFiltrados,
        busqueda
    });
});




app.get('/libros/:id', (req, res) => {
    const id = Number(req.params.id);

    // 1. Validar si el ID es un número entero válido (Error 400)
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).send('<h1>400 - Identificador no válido</h1>');
        // También podrías renderizar una vista de error: res.status(400).render('error', { mensaje: 'ID no válido' });
    }

    // 2. El servidor busca el libro (la vista NO debe buscar nada)
    const libro = libros.find(l => l.id === id);

    // 3. Si no existe el libro con ese ID (Error 404)
    if (!libro) {
        return res.status(404).render('404', { mensaje: 'El libro solicitado no existe' });
    }

    // 4. Si todo es correcto, renderizar la vista pasando ÚNICAMENTE el libro encontrado
    res.render('detalle', { libro });
});

app.use((req,res)=>{
    res.status(404).send('<h1>404 - Recurso no encontrado</h1>');
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});