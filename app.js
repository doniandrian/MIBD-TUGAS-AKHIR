//import library
import express from 'express';
import mysql from 'mysql';
import urlencoded  from 'body-parser';
import session from 'express-session';
import path from 'path';





//import {cookieParser} from 'cookie-parser';
import {check, validationResult} from 'express-validator';

const app = express();
const staticPath = path.resolve('public');
app.use(express.static(staticPath));
  

  
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

//login


//routing admin
app.get('/admin/dashboard', (req, res) => {
    res.render('admin/dashboard', { title: 'Dashboard', currentPage: 'dashboard' });
}
);

app.get('/admin/cetakkartu', (req, res) => {
    res.render('admin/cetakkartu', {title: 'CetakKartu',currentPage: 'cetakkartu' });
}
);


app.get('/admin/profile', (req, res) => {
    res.render('admin/profile', {title: 'Profile', currentPage: 'profile' });
}
);


app.get('/admin/daftarpengalokasian', (req, res) => {
    res.render('admin/daftarpengalokasian', { title: 'DaftarPengalokasian',currentPage: 'daftarpengalokasian' });
}
);
app.get('/admin/verifikasi', (req, res) => {
    res.render('admin/verifikasi', { title: 'Verifikasi',currentPage: 'verifikasi' });
}
);

//routing camil
app.get('/camil/home', (req, res) => {
    res.render('camil/home', {currentPage: 'home' });
}
);
app.get('/camil/lihat-tps', (req, res) => {
    res.render('camil/lihat-tps', {currentPage: 'lihat-tps' });
}
);
app.get('/camil/profile', (req, res) => {
    res.render('camil/profile', {currentPage: 'profile' });
}
);


//routing lurah





app.listen(8080, () => {
    console.log('Server started on port 8080');
  });
