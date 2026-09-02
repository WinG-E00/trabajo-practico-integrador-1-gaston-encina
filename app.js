//Importaciones
import sequelize from 'sequelize';



const app = express();


//configuracion del app
app.use(express.json())


//Configuracion de las rutas


// endpoint de testeo del servidor de express
app.get('/test', (req, res) => {
  res.send('Ok')
})


