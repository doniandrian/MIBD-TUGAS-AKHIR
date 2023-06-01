//import library
import express from 'express';
import mysql from 'mysql';
import { urlencoded } from 'body-parser';
import session from 'express-session';
import {cookieParser} from 'cookie-parser';
import {check, validationResult} from 'express-validator';





const app = express();

app.set('view engine', 'ejs');
app.use(urlencoded({extended : true}));
