const express = require('express');
const mustacheExpress = require('mustache-express');

const app = express();
const mustache = mustacheExpress();
const bodyparser = require('body-parser');
const { Client } = require('pg');




mustache.cache = null;
app.engine('mustache',mustache);
app.set('view engine','mustache');



app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:false}));

app.get('/add',(req,res)=>{
    res.render('med-form');
});

app.post('/meds/add',(req,res)=>{
    console.log('post body',req.body);

    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: 'asad123$',
        port: 5432,
    }); 
    client.connect()
        .then(()=>{
            console.log('Connection Complete');
            const sql = 'Insert Into meds (name,count,brand) Values ($1,$2,$3)';
            const params = [req.body.name,req.body.count,req.body.brand];
            return client.query(sql,params);
    }).then((result)=>{
        console.log('results?',result);
        res.redirect('/meds');
    });
});

app.get('/meds',(req,res)=>{
    res.render('meds');
});

app.listen('5001',()=>{
    console.log('Listening to port 5001');
})