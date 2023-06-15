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

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tubes'
})
db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to the database');
  });
//middleware
const auth = (req, res, next) => {
    if (req.session.nik) {
      next();
    } else {
      res.redirect('/login');
    }
  };
  //login
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login', currentPage: 'login' });
}
);

    
app.post('/login', (req, res) => {
  const nik = req.body.nik;
  const password = req.body.password;
  const hashed_pass = crypto.createHash('sha256').update(password).digest('base64');
  
  if (nik && password) {
    db.query('SELECT idPengguna FROM pengguna WHERE idPengguna = ? AND passPengguna = ?', [nik, password], (err, penggunaResult) => {
      if (err) {
        throw err;
      }
      
      if (penggunaResult.length > 0) {
        const idPengguna = penggunaResult[0].idPengguna;
        
        db.query('SELECT * FROM admin WHERE idAdmin = ?', [idPengguna], (err, adminResult) => {
          if (err) {
            throw err;
          }
          
          if (adminResult.length > 0) {
            // Pengguna adalah seorang admin
            req.session.nik = adminResult[0].namaAdmin;
            req.session.adminid = adminResult[0].idAdmin;
            req.session.role = 'admin';
           
            res.redirect('/admin/dashboard');
          } else {
            db.query('SELECT * FROM lurah WHERE idLurah = ?', [idPengguna], (err, lurahResult) => {
              if (err) {
                throw err;
              }
              
              if (lurahResult.length > 0) {
                // Pengguna adalah seorang lurah
                req.session.nik = lurahResult[0].namaLurah;
                req.session.lurahid = lurahResult[0].idLurah;
                req.session.role = 'lurah';
                res.redirect('/lurah/home');
              } else {
                db.query('SELECT * FROM camil WHERE idCamil = ?', [idPengguna], (err, camilResult) => {
                  if (err) {
                    throw err;
                  }
                  
                  if (camilResult.length > 0) {
                    // Pengguna adalah seorang camil
                    req.session.nik = camilResult[0].namaCamil;
                    
                    req.session.camilid = camilResult[0].idCamil;
                    req.session.role = 'camil';
                    res.redirect('/camil/home');
                  } else {
                    // Pengguna tidak memiliki peran yang valid
                    res.render('login', { nik, password });
                  }
                });
              }
            });
          }
        });
      } else {
        // Pengguna tidak ditemukan dalam tabel pengguna
        res.render('login', { nik, password });
      }
    });
  } else {
    // Data login tidak lengkap
    res.render('login', { nik: null, password: null, login: null });
  }
});

//logout
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
  });
// Menambahkan route untuk logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
  });
});


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
//routing camil
app.get('/camil/home', auth, (req, res,next) => {
  if (req.session.role === 'camil') {
    
      res.render('camil/home', {title: 'home', currentPage: 'home',login: req.session.nik});
    
    
  } else {
    next();
  }
}
);
app.get('/camil/lihat-tps', auth, (req, res,next) => {
  if (req.session.role === 'camil') {
    res.render('camil/lihat-tps', {title: 'lihat-tps',currentPage: 'lihat-tps',login: req.session.nik });
  } else {
    next();
  }
}
);
app.get('/camil/profile',auth, (req, res,next) => {
  if (req.session.role === 'camil') {
    db.query('select * from camil where idCamil = ?', [req.session.camilid], (err, result) => {
      if (err) {
        throw err;
      }
      
      console.log(result);
      res.render('camil/profile', {title: 'profile',currentPage: 'profile',login: req.session.nik , result});
    });

   
  } else {
    next();
  }
}
);



//routing admin
app.get('/admin/dashboard',auth, (req, res,next) => {
    if (req.session.role === 'admin') {
    res.render('admin/dashboard', { title: 'Dashboard', currentPage: 'dashboard' });
  } else {
    next();
  }
}
);

app.get('/admin/cetakkartu',auth, (req, res,next) => {
  if (req.session.role === 'admin') {
    res.render('admin/cetakkartu', {title: 'CetakKartu',currentPage: 'cetakkartu' });
  } else {
    next();
  }
}
);


app.get('/admin/profile',auth, (req, res,next) => {
  if (req.session.role === 'admin') {
    res.render('admin/profile', {title: 'Profile', currentPage: 'profile' });
  } else {
    next();
  }
}
);


app.get('/admin/daftarpengalokasian', auth,(req, res,next) => {
  if (req.session.role === 'admin') {
    res.render('admin/daftarpengalokasian', { title: 'Daftar Pengalokasian',currentPage: 'daftarpengalokasian' });

  } else {
    next();
  }
}
);
app.get('/admin/verifikasi',auth, (req, res,next) => {
  if (req.session.role === 'admin') {
    res.render('admin/verifikasi', { title: 'Verifikasi',currentPage: 'verifikasi' });
  } else {
    next();
  }
}
);




//routing lurah
app.get('/lurah/home',auth, (req, res,next) => {
  if (req.session.role === 'lurah') {
    res.render('lurah/home', {title: 'home', currentPage: 'home' });
  } else {
    next();
  }
    
}
);
app.get('/lurah/profile',auth, (req, res,next) => {
  if (req.session.role === 'lurah') {
    db.query('select * from lurah where idLurah = ?', [req.session.lurahid], (err, result) => {
      if (err) {
        throw err;
      }
      res.render('lurah/profile', {title: 'profile', currentPage: 'profile',result });
    });
    
  } else {
    next();
  }
}
);
app.get('/lurah/lihat-camil',auth, (req, res,next) => {
  if (req.session.role === 'lurah') {
    res.render('lurah/lihat-camil', {title: 'lihat camil', currentPage: 'lihat-camil' });
  } else {
    next();
  }
}
);
app.get('/lurah/lihat-tps',auth, (req, res,next) => {
  if (req.session.role === 'lurah') {
    res.render('lurah/lihat-tps', {title: 'Lihat TPS', currentPage: 'lihat-tps' });
  } else {
    next();
  }
}
);
app.get('/lurah/pilih-saksi',auth, (req, res,next) => {
  if (req.session.role === 'lurah') {
    res.render('lurah/pilih-saksi', {title: 'Pilih Saksi', currentPage: 'pilih-saksi' });
  } else {
    next();
  }
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
