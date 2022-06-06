// Imports
const pool = require('../connection/conn');

const getAll = (tbl) => {
    return new Promise(function(resolve, reject) {
        query = '';
       
        switch(tbl) {
            case 'brand':
                query = `SELECT ${tbl}.id, ${tbl}.name, ${tbl}.description, ${tbl}.status, ${tbl}.date_created, category.id as category_id, category.name as category_name FROM ${tbl} 
                                LEFT JOIN category ON ${tbl}.category_id = category.id ORDER BY date_created DESC`;
                break;

            case 'assets':
                query = `SELECT ${tbl}.id, ${tbl}.name, ${tbl}.quantity, ${tbl}.status, ${tbl}.date_created, category.id as category_id, category.name as category_name,
                                brand.id as brand_id, brand.name as brand_name FROM ${tbl} LEFT JOIN category ON ${tbl}.category_id = category.id
                                LEFT JOIN brand ON ${tbl}.brand_id = brand.id ORDER BY ${tbl}.date_created DESC`
                break;

            case 'assigned_asset':
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
        query = '';

        switch(tbl) {
            case 'brand':
                query = `SELECT ${columns} FROM ${tbl} WHERE category_id = ${ id } AND status = 1 ORDER BY date_created DESC`;
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
        pool.query(`INSERT INTO ${table}(${field}date_created) VALUES(${val}now())`, values, (error, result) => {
            if(error) reject(error);
            resolve('success');
        });
    });
}

const update = (data, table, id) => {
    return new Promise((resolve, reject) => {
        let field = '';
        let values = [];
        let query = '';

        delete data['date_created'];
        delete data['date_updated'];
        delete data['date_deleted'];
        delete data['id'];

        for (let count = 0; count < Object.keys(data).length; count++) {
            field += Object.keys(data)[count] + '= $' + (count + 1) + ', ';
            values.push(Object.keys(data)[count] === 'status' ? data[Object.keys(data)[count]] === true || data[Object.keys(data)[count]] === 1 ? 1 : 0 : data[Object.keys(data)[count]]);
        }

        values.push(id);
        query = `UPDATE ${table} SET ${field}date_updated= now() WHERE id= $${values.length}`;
        
        pool.query(query, values, (error, result) => {
            if(error) reject(error);
            resolve('success');
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
    optionPer
}