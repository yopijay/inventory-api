const Pool = require('pg').Pool;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true
    }
    // user: 'pkvlqsfxmtlcii',
    // host: 'ec2-3-234-131-8.compute-1.amazonaws.com',
    // database: 'ddt6n0mj96ovss',
    // password: '45a131b713a6815084a0cba2e9ec231ada5991b3ad755271852f7749500248dc',
    // port: 5432
});

const getAll = (tbl) => {
    return new Promise(function(resolve, reject) {
        query = '';
        switch(tbl) {
            case 'brand' :
                query = `SELECT ${tbl}.id, ${tbl}.name, ${tbl}.description, ${tbl}.status, category.id as category_id, category.name as category_name 
                                FROM ${tbl} LEFT JOIN category ON ${tbl}.category_id = category.id ORDER BY ${tbl}.date_created DESC`;
                break;
            case 'assets' :
                query = `SELECT ${tbl}.id, ${tbl}.name, ${tbl}.quantity, ${tbl}.status, ${tbl}.date_created, category.id as category_id, category.name as category_name,
                                brand.id as brand_id, brand.name as brand_name FROM ${tbl} LEFT JOIN category ON ${tbl}.category_id = category.id
                                LEFT JOIN brand ON ${tbl}.brand_id = brand.id ORDER BY ${tbl}.date_created DESC`;
                break;
            case 'assigned_asset':
                query = `SELECT ${tbl}.id, ${tbl}.quantity, ${tbl}.status, ${tbl}.date_created, assets.id as asset_id, assets.name as asset_name, brand.name as brand_name,
                                users.id as user_id, users.fname, users.mname, users.lname FROM ${tbl} LEFT JOIN assets ON ${tbl}.asset_id = assets.id LEFT JOIN brand ON
                                assets.brand_id = brand.id LEFT JOIN users ON ${tbl}.user_id = users.id ORDER BY ${tbl}.date_created DESC`;
                break;
            default: 
                query = `SELECT * FROM ${ tbl } ORDER BY date_created DESC`;
        }

        pool.query(query, (error, results) => {
            if(error) reject(error);
            resolve(results);
            // resolve(results.rows);
        });
    });
}

const options = (tbl, columns) => {
    return new Promise(function(resolve, reject) {
        pool.query(`SELECT ${columns} FROM ${tbl} WHERE status= 1 ORDER BY id ASC`, (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    });
}

const count = (tbl) => {
    return new Promise(function(resolve, reject) {
        pool.query(`SELECT COUNT(*) FROM ${ tbl }`, (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    });
}

const sum = (tbl, col) => {
    return new Promise(function(resolve, reject) {
        pool.query(`SELECT SUM(${col}) as total FROM ${tbl}`, (error, results) => {
            if(error) reject(error);
            resolve(results.rows);
        });
    });
}

const save = (data, type, table, id) => {
    return new Promise(function(resolve, reject) {
        let field = '';
        let val = '';
        let values = [];

        
        if(type === 'new') {

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
        }
        else {
            delete data['date_created'];
            delete data['date_updated'];
            delete data['date_deleted'];
            delete data['id'];

            for (let count = 0; count < Object.keys(data).length; count++) {
                field += Object.keys(data)[count] + '= $' + (count + 1) + ', ';
                values.push(Object.keys(data)[count] === 'status' ? data[Object.keys(data)[count]] === true ? 1 : 0 : data[Object.keys(data)[count]]);
            }

            values.push(id);
            pool.query(`UPDATE ${table} SET ${field}date_updated= now() WHERE id= $${values.length}`, values, (error, result) => {
                if(error) reject(error);
                resolve('success');
            });
        }
    });
}

const get = (id, table) => {
    return new Promise(function(resolve, reject) {
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
    sum
}