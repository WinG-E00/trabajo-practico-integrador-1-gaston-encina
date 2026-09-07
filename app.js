  //Importaciones
import express from 'express';
import 'dotenv/config';
  //Import funcion para sincronizar base de datos
import { initModels } from './src/config/database.sync.js'


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




async function initServer() {

  try {

    //sincronizar los modelos
    await initModels();

    //Iniciar servidor
    app.listen(PORT, () => {
      console.log(`El servidor se ha iniciado en el puerto ${PORT}`);3
    })

  }catch(err){

    console.error('Error al conetar con la base de datos', err)

  }

};

initServer()
