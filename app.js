var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

const { Client } = require('pg');

const client = new Client({
    user: 'user',
    host: 'host.com',
    database: 'db',
    password: 'password',
    port: 5432,
});

console.log(process.env.PWD);

//uncomment run locally
/*const { Pool } = require('pg');
const pool = new Pool({
    user: 'user',
    host: 'localhost',
    database: 'localdb',
    password: '',
    port: 5432,
});*/

client.connect();

//main page, display posts
app.get('/', (req, res) => {
    query = 'SELECT * FROM posts;';
    client.query(query, (err, pgres) => {
        if (err) {
            console.error(err);
            return;
        }
        //sort by likes
        sorted = pgres.rows.slice().sort(function(a, b) {return a.likes - b.likes}).reverse();
        res.render('index', { posts: sorted });

    });
})

//display posts in /post
app.get('/post', (req, res) => {
    query = 'SELECT * FROM posts;';

    client.query(query, (err, pgres) => {
        if (err) {
            console.error(err);
            return;
        }
        res.render('post');

    });
})

function like(id, action) {
    query = `SELECT * FROM posts WHERE id=${id}`;
    console.log(query);
    client.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        pglikes = res.rows[0]['likes'];
        if(action) {
            pglikes += 1;
        } else {
            pglikes -= 1;
        }
        query = `
            UPDATE posts
            SET likes = ${pglikes}
            WHERE id=${id}
        `;
        console.log(query);
        client.query(query, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Data update successful');
        });
    });
};

//create new posts
app.post('/post', urlencodedParser, function(req, res){
    response = {
        usr : req.body.usr,
        content : req.body.content,
        date: new Date(),
    };
    const query = `
        INSERT INTO posts (usr, content, date, likes)
        VALUES ('${response['usr']}', '${response['content']}', '${response['date']}', 0)
    `;
    client.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Data insert successful');
    });

    res.redirect("/");
});

//like or dislike
app.post('/vote', urlencodedParser, function(req, res){
    response = {
        id : req.body.id,
        action : req.body.action
    };
    if(response['action'] == 1) {
        like(response['id'], 1);
    } else {
        like(response['id'], 0);
    }
    res.redirect("/");
});

//run locally
/*app.listen(8080)
console.log('listening on http://localhost:8080')*/

var server = app.listen(process.env.PORT, function(){
    var host = '0.0.0.0';
    var port = process.env.PORT || 8888;
});
