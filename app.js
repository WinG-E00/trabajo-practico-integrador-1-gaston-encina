//Importaciones
import express from 'sequelize';
import 'dotenv/config';

//Variables de dotenv
const PORT = process.env.PORT;


//App
const app = express();


//configuracion del app
app.use(express.json())


//Configuracion de las rutas


// endpoint de testeo del servidor de express
app.get('/test', (req, res) => {
  res.send('Ok')
})

//Iniciar servidor
app.listen('PORT', () => {
  console.log(`El servidor se ha iniciado en el puerto ${PORT}`);3
})
