//import library
import express from 'express';
import mysql from 'mysql';
import urlencoded  from 'body-parser';
import session from 'express-session';
import path from 'path';
import crypto from 'crypto';





//import {cookieParser} from 'cookie-parser';
import {check, validationResult} from 'express-validator';

const app = express();
const staticPath = path.resolve('public');
app.use(express.static(staticPath));
app.use(session({
    secret: 'kelompok7',
    resave: false,
    saveUninitialized: true
  })); 

  
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


//login
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login', currentPage: 'login' });
}
);

//signup
app.get('/camil/datadiri', (req, res) => {
    res.render('camil/datadiri', { title: 'Signup', currentPage: 'signup' });
}
);
let data = [];
app.post('/camil/datadiri', (req, res) => {

    
    data.push({
        nik: req.body.nik,
        lahir: req.body.lahir,
        kota: req.body.kota,
        kecamatan: req.body.kecamatan,
        kelurahan: req.body.kelurahan,
        RWRT: req.body.RWRT,
        HP: req.body.HP

    })
    console.log(data);
    res.redirect('/camil/ktp');
   




}
);



app.get('/camil/ktp', (req, res) => {
    res.render('camil/ktp', { title: 'ktp', currentPage: 'signup' });
}
);
app.post('/camil/ktp', (req, res) => {
    res.redirect('/camil/signup');
}
);
    

app.get('/camil/signup', (req, res) => {
    res.render('camil/signup', { title: 'signup', currentPage: 'signup' });
}
);
app.post('/camil/signup', (req, res) => {
    const password = req.body.password;
    const hashed_pass = crypto.createHash('sha256').update(password).digest('base64');
    data.push({
        nama: req.body.nama,
        email: req.body.email,
        password: hashed_pass,


    })
    console.log(data);
    res.redirect('/login');
   
    
}
);








app.listen(8080, () => {
    console.log('Server started on port 8080');
  });
