import express,{json ,urlencoded } from 'express';
import { connectDB } from './config/db.js';
import routeruser from './routers/user.router.js';
import routeroption from './routers/option.router.js'
import { errorHandler, urlNotFound } from './middlewares/errors.middleware.js';
import { config } from 'dotenv';
import cors from "cors";
config();
const app = express();

connectDB('eventDB3');  

app.use(cors());
app.use(json());
app.use(urlencoded({extended:true }));

//app.use(express.static('public'));

app.use('/public', express.static('public'));



app.get('/',(req,res) =>{
    res.send('welcome!!');
});

app.use('/user',routeruser);
app.use('/option',routeroption);


app.use(urlNotFound);
app.use(errorHandler);

const port = 8000; // כתובת שבה השרת מורץ
app.listen(port, () => {
    console.log(`Event app listening http://localhost:${port}`);
});