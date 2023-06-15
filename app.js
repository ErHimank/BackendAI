const express = require('express');
const app = express();

const  BodyPar = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');


require('dotenv').config();
const authJwt = require('./helper/jwt');
const errorHandler = require('./helper/error-Handler');
app.use(cors());
app.options('*',cors())



//middileware library
app.use(BodyPar.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

//Router
const  productsRouter = require('./routers/products');
const usersRouter = require('./routers/users');
const ordersRouter = require('./routers/orders');
const categoriesRouter = require('./routers/categories');
const jdRouter = require('./routers/Jds')
const newcandidateRouter = require('./routers/NewCandidates')


const api = process.env.API_URL;


app.use(`${api}/Products`, productsRouter);
app.use(`${api}/Users`, usersRouter);
app.use(`${api}/Orders`, ordersRouter);
app.use(`${api}/Categories`, categoriesRouter);
app.use(`${api}/Jds` , jdRouter);
app.use(`${api}/NewCandidates` , newcandidateRouter);



//Database  
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://AifetchSona:SonaAifetch1@cluster0.xj5ztzg.mongodb.net/?retryWrites=true&w=majority',
    {
        dbName: 'AifetchDatab'
    } 
)
.then(()=> {
    console.log("Databse Connection is Ready !!!");
})
.catch((err)=>{
    console.log(err);
})

app.listen(3000 , ()=>{
    console.log(api);
    console.log('Server is Started in http://localhost:8080');
})



 