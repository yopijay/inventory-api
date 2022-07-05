// Imports
const { query } = require('express');
const db = require('../connection/conn');

// CRUD
const GetAll = require('./crud/getall'); // Get all data for listing
const Get = require('./crud/get'); // Get all data for listing
const Save = require('./crud/save'); // Saving of data
const Update = require('./crud/update'); // Updating of data
const Options = require('./crud/options'); // Dropdown items
const OptionsPer = require('./crud/optionsPer'); // Dropdown items per id
const Reports = require('./crud/reports'); // Generate Reports;
const Excel = require('./crud/excel'); // Excel

// Getall data
const getAll = (tbl) => {
    return new Promise(function(resolve, reject) {
        db.query(new GetAll()[`${tbl}`](), (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    });
}

// Getall reports
const reports = (tbl) => {
    return new Promise(function(resolve, reject) {
        db.query(new Reports()[`${tbl}`](), (error, results) => {
            if (error) reject(error);
            resolve(results.rows);
        });
    });
}

// Options
const options = (tbl, columns) => {
    return new Promise((resolve, reject) => {
        db.query(new Options(columns)[`${tbl}`](), (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    });
}

// Options per items
const optionPer = (tbl, columns, id) => {
    return new Promise((resolve, reject) => {
        db.query(new OptionsPer(columns, id)[`${tbl}`](), (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    })
}

// Saving
const save = (data, table) => {

    if(table === 'assigned_asset') {
        delete data['brand_id'];
        delete data['category_id'];
    }
    else if(table === 'users') {
        delete data['department_id'];
        delete data['position_id'];
    }

    return new Save(data)[`${table}`]();
}

// Updating
const update = (data, table, id) => {
    let field = '';
    let values = [];

    delete data.date_created;
    delete data.date_updated;
    delete data.date_deleted;
    delete data.created_by;
    delete data.updated_by;
    delete data.deleted_by;
    delete data.id;

    if(table === 'assigned_asset') {
        delete data['brand_id'];
        delete data['category_id'];
    }

    for (let count = 0; count < Object.keys(data).length; count++) {
        field += Object.keys(data)[count] + '= $' + (count + 1) + ', ';
        values.push(Object.keys(data)[count] === 'status' ? data[Object.keys(data)[count]] === true || data[Object.keys(data)[count]] === 1 ? 1 : 0 : data[Object.keys(data)[count]]);
    }

    values.push(id);
    return new Update(data, field, values, id)[`${table}`]();
}

// Get specific item
const get = (id, tbl) => {
    return new Promise((resolve, reject) => {
        db.query(new Get(id)[`${tbl}`](), (error, result) => {
            if(error) reject(error);
            resolve(result.rows);
        });
    });
}

const excel = (tbl) => {
    return new Promise((resolve, reject) => {
        db.query(new Excel()[`${tbl}`](), (error, results) => {
            if (error) reject(error);
            resolve(results.rows);
        });
    });
}

const testreport = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM tbl_test_report WHERE id= ${id}`, (error, tr) => {
            if(error) reject(error);
            let data = {};
            
            db.query(`SELECT *, tbl_customer.name FROM tbl_basic_information
                            LEFT JOIN tbl_customer ON tbl_basic_information.customer_id = tbl_customer.id 
                            WHERE tbl_basic_information.id= ${tr.rows[0].basic_information_id}`, (err, bi) => { 
                if(err) reject(err);
                data['basic_information'] = bi.rows[0];

                db.query(`SELECT * FROM tbl_general_specification WHERE id= ${tr.rows[0].general_specification_id}`, (err, gs) => {
                    if(err) reject(err);
                    data['general_specification'] = gs.rows[0];

                    db.query(`SELECT * FROM tbl_component WHERE id= ${tr.rows[0].component_id}`, (err, c) => {
                        if(err) reject(err);
                        data['component'] = c.rows[0];

                        db.query(`SELECT id, device, symbol, description, quantity FROM tbl_component_items WHERE component_id = ${tr.rows[0].component_id}`, (err, items) => {
                            if(err) reject(err);
                            data['items'] = items.rows;
                            
                            db.query(`SELECT * FROM tbl_construction_inspection WHERE id= ${tr.rows[0].construction_inspection_id}`, (err, ci) => {
                                if(err) reject(err);
                                data['construction_inspection'] = ci.rows[0];

                                db.query(`SELECT * FROM tbl_mechanical_operation WHERE id= ${tr.rows[0].mechanical_operation_id}`, (err, mo) => {
                                    if(err) reject(err);
                                    data['mechanical_operation'] = mo.rows[0];

                                    db.query(`SELECT * FROM tbl_electrical_operation WHERE id= ${tr.rows[0].electrical_operation_id}`, (err, eo) => {
                                        if(err) reject(err);
                                        data['electrical_operation'] = eo.rows[0];
                                        resolve(data);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

module.exports = {
    getAll,
    save,
    get,
    options,
    update,
    optionPer,
    reports,
    excel,
    testreport
}