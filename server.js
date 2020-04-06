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

// dashboard

app.get('/dashboard',(req,res)=>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: 'asad123$',
        port: 5432,
    });
    client.connect().then(()=>{
        return client.query('Select SUM(count) FROM meds; Select DISTINCT COUNT(brand) FROM meds')
    }).then((results)=>{
        console.log('?results',results[0]);
        console.log('?results',results[1]);
        res.render('dashboard',{n1:results[0].rows,n2:results[1].rows})
    }); 
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
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: 'asad123$',
        port: 5432,
    });
    client.connect()
        .then(()=>{
            return client.query('Select * From meds');
    }).then((results)=>{
        console.log('results?',results);
        res.render('meds',results);
    });
});

app.post('/meds/delete/:id',(req,res)=>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: 'asad123$',
        port: 5432,
    });
    client.connect()
    .then(()=>{
        const sql = 'Delete From meds WHERE mid=$1';
        const params = [req.params.id];
        return client.query(sql,params);
    }).then((results)=>{
        res.redirect('/meds');
    });
});

app.get('/meds/edit/:id',(req,res)=>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: 'asad123$',
        port: 5432,
    });
    client.connect()
    .then(()=>{
        const sql = 'Select * From meds WHERE mid=$1';
        const params = [req.params.id];
        return client.query(sql,params);
    }).then((results)=>{
        console.log('results?',results);
        res.render('med-edit',{med:results.rows[0]});
    });
});

app.post('/meds/edit/:id',(req,res)=>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: 'asad123$',
        port: 5432,
    });
    client.connect()
    .then(()=>{
        const sql = 'Update meds set name=$1, count=$2, brand = $3  WHERE mid=$4';
        const params = [req.body.name,req.body.count,req.body.brand,req.params.id];
        return client.query(sql,params);
    }).then((results)=>{
        console.log('results?',results);
        res.redirect('/meds');
    });
});

app.listen('5001',()=>{
    console.log('Listening to port 5001');
})