create table pengguna(
 idPengguna char(16) not null,
 namaPengguna varchar(50) not null,
 passPengguna varchar(50) not null,
 primary key (idPengguna)
);

create table admin(
 idAdmin char(16) not null,
 namaAdmin varchar(50) not null,
 primary key (idAdmin)
);

create table lurah(
 idLurah char(16) not null,
 namaLurah varchar(50) not null,
 idKelurahan char(3),
 primary key (idLurah)
);

create table camil(
 idCamil char(16) not null,
 namaCamil char(50) not null,
 emailCamil varchar(50) not null,
 noHP varchar(12) not null,
 tptlahir varchar(50) not null,
 tgllahir date not null,
 idRT char(3) not null,
 idRW char(3) not null,
 idTPS char(3),
 primary key (idCamil)
);

create table data(
 id char(16) not null,
 alamat varchar(5) not null,
 statuscamil char(1) not null,
 primary key (id)
);

create table dataCamil(
 idData char(4) not null, 
 NIK char(16) not null,
 tglUp date not null,
 primary key (idData)
);

create table saksi(
 idSaksi char(1) not null,
 NIK char(16) not null,
 namaSaksi varchar(50) not null,
 partai varchar(50) not null,
 primary key (idSaksi),
 foreign key(NIK) references camil(idCamil)
);

create table kota(
 idKota char(3) not null,
 ket varchar(150),
 primary key(idKota)
);

create table kecamatan(
 idKecamatan char(3) not null,
 ket varchar(150),
 idKota char(3) not null,
 primary key(idKecamatan),
 foreign key(idKota) references kota(idKota)
);

create table kelurahan(
 idKelurahan char(3) not null,
 ket varchar(150),
 idKecamatan char(3) not null,
 primary key(idKelurahan),
 foreign key(idKecamatan) references kecamatan(idKecamatan)
);

create table rw(
 idRW char(3) not null,
 ket varchar(150),
 idKelurahan char(3),
 primary key(idRW),
 foreign key(idKelurahan) references kelurahan(idKelurahan)
);

create table rt(
 idRT char(3) not null,
 ket varchar(150),
 idRW char(3) not null,
 primary key(idRT),
 foreign key(idRW) references rw(idRW)
);

create table tps(
 idTPS char(3) not null,
 ket varchar(150),
 lokasi varchar(150),
 idRT char(3),
 primary key(idTPS),
 foreign key(idRT) references rt(idRT)
);

insert into pengguna
(6969696969696969, 'Mak Kimak' , duar)

insert into pengguna
(6666666699999999, 'Kejol Gepeng' , cibay)
insert into pengguna
(9999999966666666, 'Vettel' , cbal)

insert into admin
(6969696969696969, 'Mak')
insert into admin
(6666666699999999, 'Kejol Gepeng')
insert into admin
(9999999966666666, 'Vettel')


insert into pengguna
(1111111111111111, 'Yog Doyog' , 123)

insert into lurah
(1111111111111111, 'Yog Doyog')

insert into pengguna
(2222222222222222, 'Arisyami Munisa' , 123)

insert into camil
(2222222222222222, 'Arisyami munisa')



