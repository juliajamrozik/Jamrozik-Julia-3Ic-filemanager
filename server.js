var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000;
var path = require("path")
var hbs = require('express-handlebars');
app.use(express.static('static'))
const formidable = require('formidable');
var saved_files = []
indexPliku = 1;
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultView: 'main',
    helpers: {
        ext: function (type) {
            return type.split('.')[1]
        }
    }

}))

app.set('view engine', 'hbs');                           // określenie nazwy silnika szablonów
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
app.get("/upload", function (req, res) {
    res.render('upload.hbs');   // nie podajemy ścieżki tylko nazwę pliku
})
app.get("/", function (req, res) {
    res.render('upload.hbs');
})
app.get("/filemanager", function (req, res) {
    res.render('filemanager.hbs', { files: saved_files })
})

app.get("/info", function (req, res) {
    res.render('info.hbs');

})
app.post('/handleUpload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/static/upload/'       // folder do zapisu zdjęcia
    form.keepExtensions = true                           // zapis z rozszerzeniem pliku
    form.multiples = true                                // zapis wielu plików                          
    form.parse(req, function (err, fields, files) {
        if (!Array.isArray(files.imagetoupload)) {
            files.imagetoupload = [files.imagetoupload]
        }
        files.imagetoupload.forEach(plik => {
            saved_files.push({
                id: indexPliku,
                name: plik.name,
                size: plik.size,
                type: plik.type,
                path: plik.path,
                savedate: Date.now()

            })
            indexPliku++;
            console.log(saved_files)
        });
        res.redirect('/filemanager')
    });


    // if (files.imagetoupload.length != undefined) {
    //     saved_files = [...saved_files, ...files.imagetoupload]
    // } else {
    //     saved_files.push(files.imagetoupload)
    // }
    // res.redirect('/filemanager')

});

app.get("/delete", function (req, res) {
    saved_files = []
    indexPliku = 1;
    res.render('filemanager.hbs');
})

app.get("/delete/:id", function (req, res) {
    a = req.params.id
    saved_files.forEach(plik => {
        if (plik.id == a) {
            liczba = saved_files.indexOf(plik)
            saved_files.splice(liczba, 1)
        }

    })
    res.redirect('/filemanager')
})

app.get("/info/:id", function (req, res) {
    a = req.params.id
    saved_files.forEach(plik => {
        if (plik.id == a) {
            liczba = saved_files.indexOf(plik)
        }
    })
    file = saved_files[liczba]
    res.render('info.hbs', file);
})

