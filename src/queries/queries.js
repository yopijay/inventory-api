// Imports
const { query } = require('express');
const pool = require('../connection/conn');

// CRUD
const GetAll = require('./crud/getall'); // Get all data for listing
const Save = require('./crud/save'); // Saving of data
const Update = require('./crud/update'); // Updating of data
const Options = require('./crud/options'); // Dropdown items
const OptionsPer = require('./crud/optionsper'); // Dropdown items per id

const getAll = (tbl) => {
    return new Promise(function(resolve, reject) {
        pool.query(new GetAll()[`${tbl}`](), (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    });
}

const reports = (tbl) => {
    return new Promise(function(resolve, reject) {
        let query = '';

        switch(tbl) {
            case 'category':
                query = `SELECT ${tbl}.series_no, ${tbl}.name, COUNT(brand.*) AS total, ${tbl}.status, CONCAT(user1.lname, ', ', user1.fname, ' ', user1.mname) as created_by, ${tbl}.date_created, 
                                CONCAT(user2.lname, ', ', user2.fname, ' ', user2.mname) as updated_by, ${tbl}.date_updated FROM ${tbl} 
                                LEFT JOIN users as user1 ON ${tbl}.created_by = user1.id LEFT JOIN users as user2 ON ${tbl}.updated_by = user2.id LEFT JOIN brand ON category.id = brand.category_id 
                                WHERE brand.category_id = category.id GROUP BY ${tbl}.series_no, ${tbl}.name, ${tbl}.status, ${tbl}.date_created, ${tbl}.date_updated, user1.lname, user1.fname, 
                                user1.mname, user2.lname, user2.fname, user2.mname ORDER BY ${tbl}.date_created ASC`;
                break;
            case 'brand':
                query = `SELECT ${tbl}.series_no, category.name as category_name, ${tbl}.name, COUNT(assets.*) AS total, ${tbl}.status, ${tbl}.date_created, ${tbl}.date_updated, 
                                CONCAT(user1.lname, ', ', user1.fname, ' ', user1.mname) as created_by, CONCAT(user2.lname, ', ', user2.fname, ' ', user2.mname) as updated_by
                                FROM ${tbl} LEFT JOIN users as user1 ON ${tbl}.created_by = user1.id LEFT JOIN users as user2 ON ${tbl}.updated_by = user2.id 
                                LEFT JOIN category ON brand.category_id = category.id LEFT JOIN assets ON brand.id = assets.brand_id WHERE assets.brand_id = brand.id
                                GROUP BY ${tbl}.series_no, ${tbl}.name, ${tbl}.status, ${tbl}.date_created, ${tbl}.date_updated, user1.lname, user1.fname, user1.mname, user2.lname, 
                                user2.fname, user2.mname, category.name ORDER BY ${tbl}.date_created ASC`;
                break;
            case 'users':
                query = `SELECT ${tbl}.series_no, CONCAT(${tbl}.lname, ', ', ${tbl}.fname, ' ', ${tbl}.mname) as fullname, COUNT(assigned_asset.*) AS total_asset, ${tbl}.civil_status, ${tbl}.address, 
                                CONCAT(${tbl}.bmonth, '/', ${tbl}.bday, '/', ${tbl}.byear) as birthdate, ${tbl}.status, ${tbl}.date_created, ${tbl}.date_updated, department.name as department_name, 
                                position.name as position_name, CONCAT(user1.lname, ', ', user1.fname, ' ', user1.mname) as created_by, 
                                CONCAT(user2.lname, ', ', user2.fname, ' ', user2.mname) as updated_by FROM ${tbl} LEFT JOIN users as user1 ON ${tbl}.created_by = user1.id 
                                LEFT JOIN users as user2 ON ${tbl}.updated_by = user2.id LEFT JOIN department ON ${tbl}.department_id = department.id 
                                LEFT JOIN position ON ${tbl}.position_id = position.id LEFT JOIN assigned_asset ON assigned_asset.user_id = users.id WHERE users.id = assigned_asset.user_id
                                GROUP BY ${tbl}.series_no, ${tbl}.lname, ${tbl}.fname, ${tbl}.mname, ${tbl}.civil_status, ${tbl}.address, ${tbl}.bmonth, ${tbl}.bday, ${tbl}.byear,
                                ${tbl}.status, ${tbl}.date_created, ${tbl}.date_updated, department.name, position.name, user1.lname, user1.fname, user1.mname, user2.lname, user2.fname, user2.mname
                                ORDER BY ${tbl}.date_created ASC`;
                break;
            case 'assets':
                query = `SELECT ${tbl}.series_no, ${tbl}.name, (${tbl}.quantity + SUM(assigned_asset.quantity)) AS total_asset, SUM(assigned_asset.quantity) AS assigned_quantity, 
                                ${tbl}.quantity as unassigned_quantity, ${tbl}.date_created, ${tbl}.date_updated, CONCAT(user1.lname, ', ', user1.fname, ' ', user1.mname) as created_by, 
                                CONCAT(user2.lname, ', ', user2.fname, ' ', user2.mname) as updated_by FROM ${tbl}
                                LEFT JOIN users as user1 ON ${tbl}.created_by = user1.id LEFT JOIN users as user2 ON ${tbl}.updated_by = user2.id
                                LEFT JOIN assigned_asset ON assigned_asset.asset_id = ${tbl}.id WHERE assigned_asset.asset_id = ${tbl}.id
                                GROUP BY ${tbl}.series_no, ${tbl}.name, ${tbl}.quantity, ${tbl}.date_created, ${tbl}.date_updated, user1.lname, user1.fname, user1.mname, user2.lname, user2.fname, 
                                user2.mname, assigned_asset.quantity ORDER BY ${tbl}.date_created ASC`;
                break;
        }

        pool.query(query, (error, results) => {
            if (error) reject(error);
            resolve(results.rows);
        });
    });
}

const options = (tbl, columns) => {
    return new Promise((resolve, reject) => {
        pool.query(new Options(columns)[`${tbl}`](), (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    });
}

const optionPer = (tbl, columns, id) => {
    return new Promise((resolve, reject) => {

        pool.query(new OptionsPer(columns, id)[`${tbl}`](), (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    })
}

const count = (tbl) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT COUNT(*) FROM tbl_${ tbl }`, (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    });
}

const sum = (tbl, col) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT SUM(${col}) as total FROM tbl_${tbl}`, (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    });
}

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

const get = (id, table) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_${table} WHERE id = $1`;

        if(table === 'assigned_asset') {
            query = `SELECT tbl_${table}.*, tbl_category.id AS category_id, tbl_brand.id AS brand_id FROM tbl_${table} LEFT JOIN tbl_assets ON tbl_${table}.asset_id = tbl_assets.id
                            LEFT JOIN tbl_category ON tbl_category.id = tbl_assets.category_id LEFT JOIN tbl_brand ON tbl_brand.id = tbl_assets.brand_id WHERE tbl_${table}.id = $1`;
        }
        
        pool.query(query, [parseInt(id)], (error, result) => {
            if(error) reject(error);
            resolve(result.rows);
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
    reports
}