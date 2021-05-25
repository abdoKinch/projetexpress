const path = require('path');
const express = require('express');
const ejs = require('ejs');
fileUpload = require('express-fileupload'),
    app = express(),

    bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(fileUpload());

//connect to db
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'expressdb'
});

connection.connect(function (error) {
    if (!!error) console.log(error);
    else console.log('Database Connected!');
});

//definir moteur de template
//set views file
app.set('views', path.join(__dirname, 'views'));

//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//ajouter le chemin d'accueil et définir la page d'index des etudiants
app.get('/', (req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM etudiant";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('etudiants/index', {
            title: 'gestion etudiants',
            etudiant: rows
        });
    });
});
app.get('/monuments', (req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM monuments";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('monuments/index', {
            title: 'gestion monuments',
            etudiant: rows
        });
    });
});
app.get('/AnassMap', (req, res) => {
    let sql = "SELECT * FROM monuments";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('AnassMap', {
            title: 'gestion MAPS',
            donnes: rows
        });
    });
})

    app.get('/add', (req, res) => {
        res.render('etudiants/add', {
            title: 'gestion etudiants'
        });
    });

    app.post('/save', (req, res) => {
        let data = { id: req.body.id, nom: req.body.nom };
        let sql = "INSERT INTO etudiant SET ?";
        let query = connection.query(sql, data, (err, results) => {
            if (err) throw err;
            res.redirect('/');
        });
    });


    app.get('/monuments/add', (req, res) => {
        res.render('monuments/add', {
            title: 'gestion monuments'
        });
    });

    app.post('/monuments/save', (req, res) => {

        var teswira = req.files.image;
        var tof = teswira.data;
        if (teswira.mimetype == "image/jpeg" || teswira.mimetype == "image/png" || teswira.mimetype == "image/gif") {

            teswira.mv('views/monuments/images/' + teswira.name)
        }

        let data = { id: req.body.id, nom: req.body.nom, latitude: req.body.latitude, longitude: req.body.longitude, ville: req.body.ville, img: 'images/' + teswira.name };
        let sql = "INSERT INTO monuments SET ?";
        let query = connection.query(sql, data, (err, results) => {
            if (err) throw err;
            res.redirect('/monuments');
        });
    });
    app.get('/edit/:Id', (req, res) => {
        const Id = req.params.Id;
        let sql = `Select * from etudiant where id = ${Id}`;
        let query = connection.query(sql, (err, result) => {
            if (err) throw err;
            res.render('etudiants/edit', {
                title: 'gestion etudiants',
                e: result[0]
            });
        });
    });


    app.post('/update', (req, res) => {
        const Id = req.body.id;
        let sql = "update etudiant SET id='" + req.body.id + "',  nom='" + req.body.nom + "' where id =" + Id;
        let query = connection.query(sql, (err, results) => {
            if (err) throw err;
            res.redirect('/');
        });
    });
    app.get('/monuments/edit/:Id', (req, res) => {
        const Id = req.params.Id;
        let sql = `Select * from monuments where id = ${Id}`;
        let query = connection.query(sql, (err, result) => {
            if (err) throw err;
            res.render('monuments/edit', {
                title: 'gestion monuments',
                e: result[0]
            });
        });
    });


    app.post('/monuments/update', (req, res) => {
        const Id = req.body.id;
        let sql = "update monuments SET id='" + req.body.id + "',  nom='" + req.body.nom + "',  latitude='" + req.body.latitude + "',  longitude='" + req.body.longitude + "',  ville='" + req.body.ville + "' where id =" + Id;
        let query = connection.query(sql, (err, results) => {
            if (err) throw err;
            res.redirect('/monuments');
        });
    });

    app.get('/delete/:Id', (req, res) => {
        const Id = req.params.Id;
        let sql = `DELETE from etudiant where id = ${Id}`;
        let query = connection.query(sql, (err, result) => {
            if (err) throw err;
            res.redirect('/');
        });
    });
    app.get('/monuments/delete/:Id', (req, res) => {
        const Id = req.params.Id;
        let sql = `DELETE from monuments where id = ${Id}`;
        let query = connection.query(sql, (err, result) => {
            if (err) throw err;
            res.redirect('/monuments');
        });
    });

    // Server Listening
    app.listen(3000, () => {
        console.log('Server is running at port 3000');
    });