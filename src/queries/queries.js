// Imports
const { query } = require('express');
const pool = require('../connection/conn');

const getAll = (tbl) => {
    return new Promise(function(resolve, reject) {
        let query = '';
       
        switch(tbl) {
            case 'brand':
                query = `SELECT tbl_${tbl}.id, tbl_${tbl}.series_no, tbl_${tbl}.name, tbl_${tbl}.description, tbl_${tbl}.status, tbl_${tbl}.date_created, tbl_category.id as category_id, 
                                tbl_category.name as category_name FROM tbl_${tbl} 
                                LEFT JOIN tbl_category ON tbl_${tbl}.category_id = tbl_category.id ORDER BY date_created DESC`;
                break;
            case 'assets':
                query = `SELECT tbl_${tbl}.id, tbl_${tbl}.series_no, tbl_${tbl}.name, tbl_${tbl}.quantity, tbl_${tbl}.status, tbl_${tbl}.date_created, 
                                tbl_category.id as category_id, tbl_category.name as category_name,
                                tbl_brand.id as brand_id, tbl_brand.name as brand_name FROM tbl_${tbl} LEFT JOIN tbl_category ON tbl_${tbl}.category_id = tbl_category.id
                                LEFT JOIN tbl_brand ON tbl_${tbl}.brand_id = tbl_brand.id ORDER BY tbl_${tbl}.date_created DESC`;
                break;
            case 'assigned_asset':
                query = `SELECT tbl_${tbl}.id, tbl_${tbl}.series_no, tbl_${tbl}.quantity, tbl_${tbl}.status, tbl_${tbl}.date_created, tbl_users.id as user_id, 
                                CONCAT(lname, ', ', fname, ' ', mname) as user_fullname,
                                tbl_assets.id as asset_id, tbl_assets.brand_id, tbl_assets.name as asset_name, brand.name as brand_name FROM tbl_${tbl} LEFT JOIN users ON tbl_${tbl}.user_id = tbl_users.id
                                LEFT JOIN tbl_assets ON tbl_${tbl}.asset_id = tbl_assets.id LEFT JOIN tbl_brand ON tbl_assets.brand_id = tbl_brand.id ORDER BY tbl_${tbl}.date_created DESC`;
                break;
            case 'logs':
                query = `SELECT tbl_${tbl}.log_no, tbl_${tbl}.table_name, tbl_${tbl}.label, tbl_${tbl}.date, CONCAT(tbl_users.lname, ', ', tbl_users.fname, ' ', tbl_users.mname) AS responsible FROM tbl_${tbl}
                                LEFT JOIN tbl_users ON tbl_${tbl}.user_id = tbl_users.id ORDER BY date DESC`;
                break;
            default:
                query = `SELECT * FROM tbl_${tbl} ORDER BY date_created DESC`;
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
        pool.query(`SELECT ${columns} FROM tbl_${tbl} WHERE status= 1 ORDER BY id ASC`, (error, results) => {
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
                query = `SELECT ${columns} FROM tbl_${tbl} WHERE category_id = ${id} AND status = 1 ORDER BY date_created ASC`;
                break;
            case 'assets':
                query = `SELECT ${columns} FROM tbl_${tbl} WHERE brand_id = ${id} AND status = 1 ORDER BY date_created ASC`;
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

        switch(table) {
            case 'category':
                    pool.query(`SELECT * FROM tbl_${table} WHERE name= $1`,[ data.name ], (error, result) => {
                        if(error) reject(error);
                        
                        if(((result.rows).length !== 0)) {
                            resolve({ result: 'error',  message: 'Name already exist' });
                        }
                        else {
                            pool.query(`INSERT INTO tbl_${table}(${field}created_by, date_created) VALUES(${val} 1, CURRENT_TIMESTAMP)`, values, (error) => {
                                if(error) reject(error);
                                resolve({ result: 'success', message: "Successfully saved!" });
                            });
                        }
                    });
                break;
            case 'brand':
                    pool.query(`SELECT * FROM tbl_${table} WHERE name= $1 AND category_id= $2`,[ data.name, data.category_id ], (error, result) => {
                        if(error) reject(error);
                        
                        if(((result.rows).length !== 0)) {
                            resolve({ result: 'error',  message: 'Name already exist' });
                        }
                        else {
                            pool.query(`INSERT INTO tbl_${table}(${field}created_by, date_created) VALUES(${val} 1, CURRENT_TIMESTAMP)`, values, (error) => {
                                if(error) reject(error);
                                resolve({ result: 'success', message: "Successfully saved!" });
                            });
                        }
                    });
                break;
            case 'assets':
                    pool.query(`SELECT * FROM tbl_${table} WHERE name= $1 AND category_id= $2 AND brand_id= $3`,[ data.name, data.category_id, data.brand_id ], (error, result) => {
                        if(error) reject(error);
                        
                        if(((result.rows).length !== 0)) {
                            resolve({ result: 'error',  message: 'Name already exist' });
                        }
                        else {
                            pool.query(`INSERT INTO tbl_${table}(${field}created_by, date_created) VALUES(${val} 1, CURRENT_TIMESTAMP)`, values, (error) => {
                                if(error) reject(error);
                                resolve({ result: 'success', message: "Successfully saved!" });
                            });
                        }
                    });
                break;
            case 'assigned_asset':
                    pool.query(`SELECT * FROM tbl_${table}`, (error, result) => {
                        if(error) reject(error);
                        
                        if(((result.rows).length !== 0)) {
                            resolve({ result: 'error',  message: 'Name already exist' });
                        }
                        else {
                            pool.query(`INSERT INTO tbl_${table}(${field}created_by, date_created) VALUES(${val} 1, CURRENT_TIMESTAMP)`, values, (error) => {
                                if(error) reject(error);

                                pool.query(`SELECT quantity FROM tbl_assets WHERE id= ${data.asset_id}`, (error, result) => {
                                    if(error) reject(error);
                                    let quantity = parseInt(result.rows[0].quantity) - parseInt(data.quantity);
                                    pool.query(`UPDATE tbl_assets SET quantity= $1 WHERE id= $2`, [quantity, data.asset_id], (error) => {
                                        if(error) eject(error);
                                        resolve({ result: 'success', message: "Successfully saved!" });
                                    });
                                });
                            });
                        }
                    });
                break;
        }
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
        query = `UPDATE tbl_${table} SET ${field}updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= $${values.length}`;
        
        pool.query(query, values, (error, result) => {
            if(error) reject(error);
            let log_no = Math.floor(100000 + Math.random() * 900000);

            pool.query(`INSERT INTO tbl_logs(log_no, table_name, item_id, label, user_id, date) VALUES($1, $2, $3, $4, 1, CURRENT_TIMESTAMP)`, [`#${log_no}`, table, id, 'update'], (error, result) => {
                if(error) reject(error);
                resolve('success');
            });
        });
    });
}

const get = (id, table) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_${table} WHERE id = $1`;

        if(table === 'assigned_asset') {
            query = `SELECT tbl_${table}.*, tbl_category.id AS category_id, tbl_brand.id AS brand_id FROM ${table} LEFT JOIN tbl_assets ON tbl_${table}.asset_id = tbl_assets.id
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