const express = require('express');
const app = express();
const port =3001;

const query = require('./queries');

app.use(express.json());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});

app.get('/', (req, res) => {
    res.send("WORKING!");
});

app.get('/getall/:tbl', (req, res) => {
    query.getAll(req.params.tbl).then(response => {
        res.status(200).send(response);
    }).catch(error => {
        res.status(200).send(error);
    });
});

app.get('/option/:tbl/:cols', (req, res) => {
    query.options(req.params.tbl, req.params.cols).then(response => {
        res.status(200).send(response);
    }).catch(error => {
        res.status(200).send(error);
    });
});

app.get('/sum/:tbl/:col', (req, res) => {
    query.sum(req.params.tbl, req.params.col).then(response => {
        res.status(200).send(response);
    }).catch(error => {
        res.status(200).send(error);
    });
});

app.get('/get/:tbl/:id', (req, res) => {
    query.get(req.params.id, req.params.tbl).then(response => {
        res.status(200).send(response);
    }).catch(error => {
        res.status(200).send(error);
    });
})

app.get('/count/:tbl', (req, res) => {
    query.count(req.params.tbl).then(response => {
        res.status(200).send(response);
    }).catch(error => {
        res.status(200).send(error);
    })
});

app.post('/:type/:tbl/:id', (req, res) => {
    query.save(req.body, req.params.type, req.params.tbl, req.params.id).then(response => {
        res.status(200).send(response);
    }).catch(error => {
        res.status(200).send(error)
    });
});

app.listen(process.env.PORT || port, () => {
    console.log(`App running on port ${port}.`);
});