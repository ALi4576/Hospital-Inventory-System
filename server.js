const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyparser = require('body-parser');

const app = express();
const mustache = mustacheExpress();
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
     res.redirect('/meds');
});

app.get('/meds',(req,res)=>{
    res.render('meds');
});



app.listen('5001',()=>{
    console.log('Listening to port 5001');
})