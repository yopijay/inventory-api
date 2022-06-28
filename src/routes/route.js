// Imports
const { Router } = require('express');
const query = require('../queries/queries');

// Variables
const router = Router();

// Get all
router.get('/getall/:tbl', (req, res) => {
    query.getAll(req.params.tbl).then(response => {
        res.status(200).send(response);
    }).catch(error => { res.status(200).send(error); });
});

// Reports
router.get('/report/:tbl', (req, res) => {
    query.reports(req.params.tbl).then(response => {
        res.status(200).send(response);
    }).catch(error => { res.status(200).send(error); });
});

// Options/Select dropdowns values
router.get('/option/:tbl/:cols', (req, res) => {
    query.options(req.params.tbl, req.params.cols).then(response => {
        res.status(200).send(response); 
    }).catch(error => { res.status(200).send(error); });
});

router.get('/option/per/:tbl/:cols/:id', (req, res) => {
    query.optionPer(req.params.tbl, req.params.cols, req.params.id).then(response => {
        res.status(200).send(response);
    }).catch(error => { res.status(200).send(error); });
});

// Sum per column
router.get('/sum/:tbl/:col', (req, res) => {
    query.sum(req.params.tbl, req.params.col).then(response => {
        res.status(200).send(response);
    }).catch(error => {
        res.status(200).send(error);
    });
});

// Get specific data
router.get('/get/:tbl/:id', (req, res) =>{
    query.get(req.params.id, req.params.tbl).then(response => {
        res.status(200).send(response);
    }).catch(error => {
        res.status(200).send(error);
    });
});

// Count
router.get('/count/:tbl', (req, res) => {
    query.count(req.params.tbl).then(response => {
        res.status(200).send(response);
    }).catch(error => {
        res.status(200).send(error);
    });
});

// Save
router.post('/new/:tbl', (req, res) => {
    query.save(req.body, req.params.tbl).then(response => {
        res.status(200).send(response);
    }).catch(error => {
        res.status(200).send(error);
    });
});

// Update
router.post('/update/:tbl/:id', (req, res) => {
    query.update(req.body, req.params.tbl, req.params.id).then(response => {
        res.status(200).send(response);
    }).catch(error => {
        res.status(200).send(error);
    });
});

module.exports = router;