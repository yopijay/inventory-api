// Imports
const { query } = require('express');
const pool = require('../connection/conn');

const getAll = (tbl) => {
    return new Promise(function(resolve, reject) {
        let query = '';
       
        switch(tbl) {
            case 'brand':
                query = `SELECT ${tbl}.id, ${tbl}.series_no, ${tbl}.name, ${tbl}.description, ${tbl}.status, ${tbl}.date_created, category.id as category_id, category.name as category_name FROM ${tbl} 
                                LEFT JOIN category ON ${tbl}.category_id = category.id ORDER BY date_created DESC`;
                break;

            case 'assets':
                query = `SELECT ${tbl}.id, ${tbl}.series_no, ${tbl}.name, ${tbl}.quantity, ${tbl}.status, ${tbl}.date_created, category.id as category_id, category.name as category_name,
                                brand.id as brand_id, brand.name as brand_name FROM ${tbl} LEFT JOIN category ON ${tbl}.category_id = category.id
                                LEFT JOIN brand ON ${tbl}.brand_id = brand.id ORDER BY ${tbl}.date_created DESC`;
                break;

            case 'assigned_asset':
                query = `SELECT ${tbl}.id, ${tbl}.series_no, ${tbl}.quantity, ${tbl}.status, ${tbl}.date_created, users.id as user_id, CONCAT(lname, ', ', fname, ' ', mname) as user_fullname,
                                assets.id as asset_id, assets.brand_id, assets.name as asset_name, brand.name as brand_name FROM ${tbl} LEFT JOIN users ON ${tbl}.user_id = users.id
                                LEFT JOIN assets ON ${tbl}.asset_id = assets.id LEFT JOIN brand ON assets.brand_id = brand.id ORDER BY ${tbl}.date_created DESC`;
                break;
            
            case 'logs':
                query = `SELECT ${tbl}.log_no, ${tbl}.table_name, ${tbl}.label, ${tbl}.date, CONCAT(users.lname, ', ', users.fname, ' ', users.mname) AS responsible FROM ${tbl}
                                LEFT JOIN users ON ${tbl}.user_id = users.id ORDER BY date DESC`;
                break;

            default:
                query = `SELECT * FROM ${tbl} ORDER BY date_created DESC`;
                break;
        }
        
        pool.query(query, (error, results) => {
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
                query = `SELECT ${tbl}.series_no, ${tbl}.name, ${tbl}.status, ${tbl}.date_created, ${tbl}.date_updated, CONCAT(user1.lname, ', ', user1.fname, ' ', user1.mname) as created_by,
                                CONCAT(user2.lname, ', ', user2.fname, ' ', user2.mname) as updated_by, COUNT(brand.*) AS total FROM ${tbl} LEFT JOIN users as user1 ON ${tbl}.created_by = user1.id
                                LEFT JOIN users as user2 ON ${tbl}.updated_by = user2.id LEFT JOIN brand ON category.id = brand.category_id WHERE brand.category_id = category.id 
                                GROUP BY ${tbl}.series_no, ${tbl}.name, ${tbl}.status, ${tbl}.date_created, ${tbl}.date_updated, user1.lname, user1.fname, user1.mname, user2.lname, 
                                user2.fname, user2.mname ORDER BY ${tbl}.date_created ASC`;
                break;
            case 'brand':
                query = `SELECT ${tbl}.series_no, ${tbl}.name, ${tbl}.status, ${tbl}.date_created, ${tbl}.date_updated, CONCAT(user1.lname, ', ', user1.fname, ' ', user1.mname) as created_by,
                                CONCAT(user2.lname, ', ', user2.fname, ' ', user2.mname) as updated_by, COUNT(assets.*) AS total, category.name as category_name FROM ${tbl} 
                                LEFT JOIN users as user1 ON ${tbl}.created_by = user1.id LEFT JOIN users as user2 ON ${tbl}.updated_by = user2.id 
                                LEFT JOIN category ON brand.category_id = category.id LEFT JOIN assets ON brand.id = assets.brand_id WHERE assets.brand_id = brand.id
                                GROUP BY ${tbl}.series_no, ${tbl}.name, ${tbl}.status, ${tbl}.date_created, ${tbl}.date_updated, user1.lname, user1.fname, user1.mname, user2.lname, 
                                user2.fname, user2.mname, category.name ORDER BY ${tbl}.date_created ASC`;
                break;
            case 'users':
                query= `SELECT ${tbl}.series_no, CONCAT(${tbl}.lname, ', ', ${tbl}.fname, ' ', ${tbl}.mname) as fullname, ${tbl}.civil_status, ${tbl}.address, 
                                CONCAT(${tbl}.bmonth, '/', ${tbl}.bday, '/', ${tbl}.byear) as birthdate, ${tbl}.status, ${tbl}.date_created, ${tbl}.date_updated, department.name as department_name, 
                                position.name as position_name, CONCAT(user1.lname, ', ', user1.fname, ' ', user1.mname) as created_by, CONCAT(user2.lname, ', ', user2.fname, ' ', 
                                user2.mname) as updated_by, COUNT(assigned_asset.*) AS total FROM ${tbl} LEFT JOIN users as user1 ON ${tbl}.created_by = user1.id 
                                LEFT JOIN users as user2 ON ${tbl}.updated_by = user2.id LEFT JOIN department ON ${tbl}.department_id = department.id 
                                LEFT JOIN position ON ${tbl}.position_id = position.id LEFT JOIN assigned_asset ON assigned_asset.user_id = users.id WHERE users.id = assigned_asset.user_id
                                GROUP BY ${tbl}.series_no, ${tbl}.lname, ${tbl}.fname, ${tbl}.mname, ${tbl}.civil_status, ${tbl}.address, ${tbl}.bmonth, ${tbl}.bday, ${tbl}.byear,
                                ${tbl}.status, ${tbl}.date_created, ${tbl}.date_updated, department.name, position.name, user1.lname, user1.fname, user1.mname, user2.lname, user2.fname, user2.mname
                                ORDER BY ${tbl}.date_created ASC`;
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
        pool.query(`SELECT ${columns} FROM ${tbl} WHERE status= 1 ORDER BY id ASC`, (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    });
}

const optionPer = (tbl, columns, id) => {
    return new Promise((resolve, reject) => {
        let query = '';

        switch(tbl) {
            case 'brand':
                query = `SELECT ${columns} FROM ${tbl} WHERE category_id = ${id} AND status = 1 ORDER BY date_created ASC`;
                break;
            case 'assets':
                query = `SELECT ${columns} FROM ${tbl} WHERE brand_id = ${id} AND status = 1 ORDER BY date_created ASC`;
                break;
        }

        pool.query(query, (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    })
}

const count = (tbl) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT COUNT(*) FROM ${ tbl }`, (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    });
}

const sum = (tbl, col) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT SUM(${col}) as total FROM ${tbl}`, (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    });
}

const save = (data, table) => {
    return new Promise((resolve, reject) => {
        let field = '';
        let val = '';
        let values = [];

        if(table === 'assigned_asset') {
            delete data['brand_id'];
            delete data['category_id'];
        }
        
        for (let count = 0; count < Object.keys(data).length; count++) {
            field += Object.keys(data)[count] + ', ';
            val += '$' + (count + 1) + ', ';
            values.push(Object.keys(data)[count] === 'status' ? data[Object.keys(data)[count]] === true ? 1 : 0 : data[Object.keys(data)[count]]);
        }
        
        pool.query(`INSERT INTO ${table}(${field}created_by, date_created) VALUES(${val} 1, CURRENT_TIMESTAMP) RETURNING id`, values, (error, result) => {
            if(error) reject(error);
            let id = result.rows[0].id;
            let log_no = Math.floor(100000 + Math.random() * 900000);
            
            if(table === 'assigned_asset') {
                pool.query(`SELECT quantity FROM assets WHERE id= ${data.asset_id}`, (error, result) => {
                    if(error) reject(error);
                    let quantity = parseInt(result.rows[0].quantity) - parseInt(data.quantity);
                    pool.query(`UPDATE assets SET quantity= $1 WHERE id= $2`, [quantity, data.asset_id]);
                });
            }

            pool.query(`INSERT INTO logs(log_no, table_name, item_id, label, user_id, date) VALUES($1, $2, $3, $4, 1, CURRENT_TIMESTAMP)`, [`#${log_no}`, table, id, 'new'], (error, result) => {
                if(error) reject(error);
                resolve('success');
            });
        });
    });
}

const update = (data, table, id) => {
    return new Promise((resolve, reject) => {
        let field = '';
        let values = [];
        let query = '';

        delete data.date_created;
        delete data.date_updated;
        delete data.date_deleted;
        delete data.created_by;
        delete data.updated_by;
        delete data.deleted_by;
        delete data.id;

        for (let count = 0; count < Object.keys(data).length; count++) {
            field += Object.keys(data)[count] + '= $' + (count + 1) + ', ';
            values.push(Object.keys(data)[count] === 'status' ? data[Object.keys(data)[count]] === true || data[Object.keys(data)[count]] === 1 ? 1 : 0 : data[Object.keys(data)[count]]);
        }

        values.push(id);
        query = `UPDATE ${table} SET ${field}updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= $${values.length}`;
        
        pool.query(query, values, (error, result) => {
            if(error) reject(error);
            let log_no = Math.floor(100000 + Math.random() * 900000);

            pool.query(`INSERT INTO logs(log_no, table_name, item_id, label, user_id, date) VALUES($1, $2, $3, $4, 1, CURRENT_TIMESTAMP)`, [`#${log_no}`, table, id, 'update'], (error, result) => {
                if(error) reject(error);
                resolve('success');
            });
        });
    });
}

const get = (id, table) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM ${table} WHERE id = $1`, [parseInt(id)], (error, result) => {
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