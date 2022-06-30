// Imports
const { query } = require('express');
const pool = require('../connection/conn');

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
        pool.query(new GetAll()[`${tbl}`](), (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    });
}

// Getall reports
const reports = (tbl) => {
    return new Promise(function(resolve, reject) {
        pool.query(new Reports()[`${tbl}`](), (error, results) => {
            if (error) reject(error);
            resolve(results.rows);
        });
    });
}

// Options
const options = (tbl, columns) => {
    return new Promise((resolve, reject) => {
        pool.query(new Options(columns)[`${tbl}`](), (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    });
}

// Options per items
const optionPer = (tbl, columns, id) => {
    return new Promise((resolve, reject) => {
        pool.query(new OptionsPer(columns, id)[`${tbl}`](), (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    })
}

// Count
const count = (tbl) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT COUNT(*) FROM tbl_${ tbl }`, (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    });
}

// Sum
const sum = (tbl, col) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT SUM(${col}) as total FROM tbl_${tbl}`, (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    });
}

// Saving
const save = (data, table) => {
    let field = '';
    let val = '';
    let values = [];

    if(table === 'assigned_asset') {
        delete data['brand_id'];
        delete data['category_id'];
    }
    else if(table === 'users') {
        delete data['department_id'];
        delete data['position_id'];
    }
        
    for (let count = 0; count < Object.keys(data).length; count++) {
        field += Object.keys(data)[count] + ', ';
        val += '$' + (count + 1) + ', ';
        values.push(Object.keys(data)[count] === 'status' ? data[Object.keys(data)[count]] === true ? 1 : 0 : data[Object.keys(data)[count]]);
    }

    return new Save(data, field, values, val)[`${table}`]();
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
        pool.query(new Get(id)[`${tbl}`](), (error, result) => {
            if(error) reject(error);
            resolve(result.rows);
        });
    });
}

const excel = (tbl) => {
    return new Promise((resolve, reject) => {
        pool.query(new Excel()[`${tbl}`](), (error, results) => {
            if (error) reject(error);
            resolve(results.rows);
        });
    });
}

module.exports = {
    getAll,
    count,
    save,
    get,
    options,
    sum,
    update,
    optionPer,
    reports,
    excel
}