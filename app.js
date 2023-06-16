//import library
import express from 'express';
import mysql from 'mysql';
import bodyParser  from 'body-parser';
import session from 'express-session';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';





//import {cookieParser} from 'cookie-parser';
import validator from 'validator';

const app = express();
const staticPath = path.resolve('public');
app.use(express.static(staticPath));
app.use('/KTP_data', express.static('KTP_data'));



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
    res.render('login', { title: 'Login', currentPage: 'login', error: null});
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
                req.session.idKelurahan = lurahResult[0].idKelurahan;
                req.session.role = 'lurah';
                res.redirect('/lurah/home');
              } else {
                db.query('SELECT * FROM camil join pengguna on camil.idCamil = pengguna.idPengguna WHERE idCamil = ?', [idPengguna], (err, camilResult) => {
                  if (err) {
                    throw err;
                  }
                  
                  if (camilResult.length > 0) {
                    // Pengguna adalah seorang camil
                    console.log(camilResult);
                    
                    req.session.camilid = camilResult[0].idCamil;
                    req.session.nik = camilResult[0].namaPengguna;
                    console.log(req.session.nik);
                    
                    req.session.role = 'camil';
                    res.redirect('/camil/home');
                  } else {
                    // Pengguna tidak memiliki peran yang valid
                    res.render('login', { nik, password, error: 'NIK atau Password salah' });
                  }
                });
              }
            });
          }
        });
      } else {
        // Pengguna tidak ditemukan dalam tabel pengguna
        
        res.render('login', { nik, password,error: 'NIK atau Password salah' });
      }
    });
  } else {
    // Data login tidak lengkap
    res.render('login', { nik: null, password: null, login: null,error: 'NIK atau Password salah'  });
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



//camil register

//signup
app.get('/camil/datadiri', async (req, res) => {

  res.render('camil/datadiri', { title: 'Signup', currentPage: 'signup' });
}
);
let data = [];

app.post('/camil/datadiri', async (req, res) => {
  data.push({
    nik: req.body.nik,
    lahir: req.body.lahir,
    tempat: req.body.tempat,
    kota: req.body.kota,
    kecamatan: req.body.kecamatan,
    kelurahan: req.body.kelurahan,
    RW: req.body.RW,
    RT: req.body.RT,
    Alamat: req.body.Alamat,
    HP: req.body.HP
  });

  console.log(data);

  if (true) {
    const kota = `SELECT idKota FROM kota WHERE ket = ?`;
    let tempkota = await executeQuery(kota, [data[data.length - 1].kota]);

    const kecamatan = 'SELECT idKecamatan FROM kecamatan WHERE ket = ?';
    let tempkecamatan = await executeQuery(kecamatan, [data[data.length - 1].kecamatan]);

    const kelurahan = 'SELECT idKelurahan FROM kelurahan WHERE ket = ?';
    let tempkelurahan = await executeQuery(kelurahan, [data[data.length - 1].kelurahan]);

    const query = 'INSERT INTO camil(idCamil, tptlahir, tgllahir, idRT, idRW, idKota, idKecamatan, idKelurahan, alamat, noHp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)';

    try {
      await executeQuery(query, [
        data[data.length - 1].nik,
        data[data.length - 1].tempat,
        data[data.length - 1].lahir,
        data[data.length - 1].RT,
        data[data.length - 1].RW,
        tempkota[0].idKota,
        tempkecamatan[0].idKecamatan,
        tempkelurahan[0].idKelurahan,
        data[data.length - 1].Alamat,
        data[data.length - 1].HP
      ]);

      res.redirect('/camil/ktp');
    } catch (err) {
      throw err;
    }
  } else {
    alert('Data tidak valid');
    res.redirect('/camil/ktp');
  }
});


function executeQuery(query, params) {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}


// let data = [];
// app.post('/camil/datadiri', async(req, res) => {

  
//   data.push({
//       nik: req.body.nik,
//       lahir: req.body.lahir,
//       tempat : req.body.tempat,
//       kota: req.body.kota,
//       kecamatan: req.body.kecamatan,
//       kelurahan: req.body.kelurahan,
//       RW: req.body.RW,
//       RT : req.body.RT,
//       Alamat: req.body.Alamat,
//       HP: req.body.HP

//   })
//   console.log(data);

  
//   if(true){
//     const kota = `SELECT idKota FROM kota WHERE ket = ?`;
   

//     let tempkota;
//      await db.query(kota, [data[data.length - 1].kota], (err, result) => {
//       if (err) {
//         throw err;
//       }

//       tempkota = result[0].idKota;
//     });
//     const kecamatan = 'SELECT idKecamatan FROM kecamatan WHERE ket = ?';
//     let tempkecamatan = "";
//     await db.query (kecamatan, [data[data.length - 1].kecamatan], (err,result) => {
//       if (err) {
//         throw err;
//       }
      
//       tempkecamatan = result[0].idKecamatan;
//     });
//     const kelurahan = 'SELECT idKelurahan FROM kelurahan WHERE ket = ?';
//     let tempkelurahan = "";
//     await db.query (kelurahan, [data[data.length - 1].kelurahan], (err,result) => {
//       if (err) {
//         throw err;
//       }
      
//       tempkelurahan = result[0].idKelurahan;
//     });
    
    
//     const query = 'INSERT INTO camil(idCamil, tptlahir, tgllahir, idRT, idRW, idKota, idKecamatan, idKelurahan, alamat, noHp) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)';
//     await db.query(query, [data[data.length - 1].nik, data[data.length - 1].tempat, data[data.length - 1].lahir, data[data.length - 1].RT, data[data.length - 1].RW, tempkota, tempkecamatan, tempkelurahan,data[data.length - 1].Alamat,data[data.length - 1].HP], (err, result) => {
  
//       if (err) {
//         throw err;
//       }
      
//       res.redirect('/camil/ktp');
//     });
//   }else{
//     alert('Data tidak valid');
//     res.redirect('/camil/ktp');
//   }
  
 




// }
// );

//multer
const filestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './KTP_data');
  },
  filename: (req, file, cb) => {
    //ganti nama filenya ke nik dari session
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: filestorage });



app.get('/camil/ktp', (req, res) => {
  res.render('camil/ktp', { title: 'ktp', currentPage: 'signup' });
}
);
app.post('/camil/ktp', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.redirect('/camil/signup');
}
);
  

app.get('/camil/signup', (req, res) => {
  res.render('camil/signup', { title: 'signup', currentPage: 'signup' });
}
);
let signup = [];
app.post('/camil/signup', (req, res) => {
  const password = req.body.password;
  const hashed_pass = crypto.createHash('sha256').update(password).digest('base64');
  signup.push({
      nama: req.body.nama,
      email: req.body.email,
      password: hashed_pass,


  })
  if(validator.isEmail(signup[signup.length-1].email)){
    const query = 'INSERT INTO pengguna(idPengguna, namaPengguna, email,  passPengguna) VALUES (?, ?, ?,?)';
    db.query(query, [data[data.length-1].nik, signup[signup.length-1].nama, signup[signup.length-1].email, signup[signup.length-1].password], (err, result) => {
      if (err) {
        throw err;
      }
      res.redirect('/login');
    });
  }else{
    alert('Email tidak valid');
    res.redirect('/camil/signup');
  }
 
  
}
);
//routing camil
app.get('/camil/home', auth, (req, res,next) => {
  if (req.session.role === 'camil') {
    
     const query = 'select idTPS from camil where idCamil = ?';
      db.query(query, [req.session.camilid], (err, result) => {
        if (err) {
          throw err;
        }
        if(result[0].idTPS == null){
          res.render('camil/home', {title: 'home', currentPage: 'home',login: req.session.nik, result});

        }else{
          db.query('select * from camil join tps on camil.idTPS = tps.idTPS where idCamil = ?', [req.session.camilid], (err, result) => {
            if (err) {
              throw err;
            }
            console.log(result);
            res.render('camil/home', {title: 'home', currentPage: 'home',login: req.session.nik, result});
            });
            

        
      }
    });
    
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
app.get('/camil/profile', auth, (req, res,next) => {
  if (req.session.role === 'camil') {
    db.query('select idCamil, noHP, tptlahir, tgllahir, alamat, kecamatan.ket as kecamatan, kelurahan.ket as kelurahan, kota.ket as kota ,idRT, idRW from camil join kota on camil.idKota = kota.idKota join kecamatan on kecamatan.idKecamatan = camil.idKecamatan join kelurahan on kelurahan.idKelurahan = camil.idKelurahan where idCamil = ?', [req.session.camilid], (err, result) => {
      if (err) {
        throw err;
      }
      console.log(result);
      db.query('select statuscamil from data join camil on data.id = camil.idCamil where idCamil = ?', [req.session.camilid], (err, statusresult) => {
        if (err) {
          throw err;
        }
        console.log(statusresult[0].statuscamil);
        res.render('camil/profile', {title: 'profile',currentPage: 'profile',login: req.session.nik , result, statusresult});
      });
      
      
      
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
    res.render('lurah/home', {title: 'home', currentPage: 'home', login: req.session.nik });
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
app.get('/lurah/lihat-camil', auth, (req, res, next) => {
  if (req.session.role === 'lurah') {
    const searchNama = req.query.filter || '';
    const start = parseInt(req.query.start) || 0;
    const show = 5;

    db.query('SELECT COUNT(*) AS totalRecords FROM camil', (err, countResult) => {
      if (err) {
        throw err;
      }
      const totalRecords = countResult[0].totalRecords;

      const query = `SELECT pengguna.namaPengguna, camil.idCamil, camil.alamat, tps.ket 
                     FROM camil 
                     JOIN pengguna ON camil.idCamil = pengguna.idPengguna 
                     JOIN kelurahan ON kelurahan.idKelurahan = camil.idKelurahan 
                     JOIN kecamatan ON kecamatan.idKecamatan = camil.idKecamatan 
                     Join Lurah on kelurahan.idKelurahan = lurah.idKelurahan
                     LEFT JOIN tps ON tps.idTPS = camil.idTPS 
                     WHERE pengguna.namaPengguna LIKE ? AND camil.idKelurahan = ?
                     LIMIT ?, ?`;

      db.query(query, [`%${searchNama}%`, req.session.idKelurahan, start, show], (err, result) => {
        if (err) {
          throw err;
        }
        
        res.render('lurah/lihat-camil', {
          title: 'lihat-camil',
          currentPage: 'lihat-camil',
          result,
          name: searchNama,
          totalRecords: totalRecords,
          start: start,
          show: show,
        });

        console.log(result);
      });
    });
  } else {
    next();
  }
});

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





// app.use('/', (req, res, next) => {
//   res.redirect('/login');
// });
//middleware untuk menangani error 404 kalau halaman tidak ditemukan
// app.use((req, res, next) => {
//   res.status(404).send('404 - Halaman Tidak Ditemukan');
// });

app.listen(8080, () => {
    console.log('Server started on port 8080');
  });
