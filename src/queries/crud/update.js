// Libraries
const { query } = require('express');
const pool = require('../../connection/conn');

class Update {
    constructor(data, field, values, id) {
        this.data = data;
        this. field = field;
        this.values = values;
        this.id = id;
    }

    category = () => {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM tbl_category WHERE name= '${(this.data).name}' AND id= ${this.id}`, (error, result) => {
                if(error) reject(error);
                const err = [];
                if(result.rowCount === 0) {
                    pool.query(`SELECT * FROM tbl_category WHERE name= '${(this.data).name}'`, (error, result) => {
                        if(error) reject(error);
                        if(result.rowCount !== 0) {
                            err.push({ name: 'name', message: 'Category name already exist!' });
                            resolve({ result: 'error', error: err });
                        }
                        else {
                            pool.query(`UPDATE tbl_category SET ${this.field}updated_by=1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                                if(error) reject(error);
                                resolve({ result: 'success', message: 'Successfully Updated!' });
                            });
                        }
                    });
                }
                else {
                    pool.query(`UPDATE tbl_category SET ${this.field}updated_by=1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                        if(error) reject(error);
                        resolve({ result: 'success', message: 'Successfully Updated!' });
                    });
                }
            });
        });
    }

    brand = () => {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM tbl_brand WHERE name= '${(this.data).name}' AND category_id= ${(this.data).category_id} AND id= ${this.id}`, (error, result) => {
                if(error) reject(error);
                const err = [];
                if(result.rowCount === 0) {
                    pool.query(`SELECT * FROM tbl_brand WHERE name= '${(this.data).name}' AND category_id= ${(this.data).category_id}`, (error, result) => {
                        if(error) reject(error);
                        if(result.rowCount !== 0) {
                            err.push({ name: 'name', message: 'Brand name already exist!' });
                            resolve({ result: 'error', error: err });
                        }
                        else {
                            pool.query(`UPDATE tbl_brand SET ${this.field}updated_by=1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                                if(error) reject(error);
                                resolve({ result: 'success', message: 'Successfully Updated!' });
                            });
                        }
                    });
                }
                else {
                    pool.query(`UPDATE tbl_brand SET ${this.field}updated_by=1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                        if(error) reject(error);
                        resolve({ result: 'success', message: 'Successfully Updated!' });
                    });
                }
            });
        });
    }

    assets = () => {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM tbl_assets WHERE name= '${(this.data).name}' AND category_id= ${(this.data).category_id} AND brand_id= ${(this.data).brand_id}
                                AND id= ${this.id}`, (error, result) => {
                if(error) reject(error);
                const err = [];
                if(result.rowCount === 0) {
                    pool.query(`SELECT * FROM tbl_assets WHERE name= '${(this.data).name}' AND category_id= ${(this.data).category_id} AND brand_id= ${(this.data).brand_id}`, (error, result) => {
                        if(error) reject(error);
                        if(result.rowCount !== 0) {
                            err.push({ name: 'name', message: 'Asset name already exist!' });
                            resolve({ result: 'error', error: err });
                        }
                        else {
                            pool.query(`UPDATE tbl_assets SET ${this.field}updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                                if(error) reject(error);
                                resolve({ result: 'success', message: 'Successfully updated!' });
                            });
                        }
                    })
                }
                else {
                    pool.query(`UPDATE tbl_assets SET ${this.field}updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                        if(error) reject(error);
                        resolve({ result: 'success', message: 'Successfully updated!' });
                    });
                }
            });
        });
    }
}

module.exports = Update;