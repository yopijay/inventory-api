// Libraries
const { query } = require('express');
const pool = require('../../connection/conn');

class Save {
    constructor(data, field, values, val) {
        this.data = data;
        this.field = field;
        this.values = values;
        this.val = val;
    }

    category = () => {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM tbl_category WHERE name= '${(this.data).name}'`, (error, result) => {
                if(error) reject(error);
                const err = [];

                if(result.rowCount !== 0) {
                    err.push({ name: 'name', message: 'Category name already exist!' });
                    resolve({ result: 'error', error: err });
                }
                else {
                    pool.query(`INSERT INTO tbl_category(${this.field}created_by, date_created) VALUES(${this.val} 1, CURRENT_TIMESTAMP)`, this.values, (error) => {
                        if(error) reject(error);
                        resolve({ result: 'success', message: 'Successfully saved!' });
                    });
                }
            });
        });
    }

    brand = () => {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM tbl_brand WHERE name= $1 AND category_id= $2`,[ (this.data).name, (this.data).category_id ], (error, result) => {
                if(error) reject(error);
                const err = [];
                
                if(result.rowCount !== 0) {
                    err.push({ name: 'name', message: 'Brand name already exist!' });
                    resolve({ result: 'error', error: err });
                }
                else {
                    pool.query(`INSERT INTO tbl_brand(${this.field}created_by, date_created) VALUES(${this.val} 1, CURRENT_TIMESTAMP)`, this.values, (error) => {
                        if(error) reject(error);
                        resolve({ result: 'success', message: "Successfully saved!" });
                    });
                }
            });
        });
    }
    
    assets = () => {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM tbl_assets WHERE name= $1 AND category_id= $2 AND brand_id= $3`,[ (this.data).name, (this.data).category_id, (this.data).brand_id ], (error, result) => {
                if(error) reject(error);
                const err = [];
                
                if(result.rowCount !== 0) {
                    err.push({ name: 'name', message: 'Assets name already exist!' });
                    resolve({ result: 'error', error: err });
                }
                else {
                    pool.query(`INSERT INTO tbl_assets(${this.field}created_by, date_created) VALUES(${this.val} 1, CURRENT_TIMESTAMP)`, this.values, (error) => {
                        if(error) reject(error);
                        resolve({ result: 'success', message: "Successfully saved!" });
                    });
                }
            });
        });
    }
    
    assigned_asset = () => {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM tbl_assigned_asset WHERE asset_id= ${(this.data).asset_id} AND user_id= ${(this.data).user_id}`, (error, assgn) => {
                if(error) reject(error);
                const err = [];
                let quantity = 0;

                if(assgn.rowCount === 0) {
                    pool.query(`SELECT quantity FROM tbl_assets WHERE id= ${(this.data).asset_id}`, (error, asst) => {
                        if(error) reject(error);

                        if((this.data).quantity > asst.rows[0].quantity) {
                            err.push({ name: 'quantity', message: 'Quantity must be lower than or equal to your total assets!' });
                            resolve({ result: 'error', error: err });
                        }
                        else {
                            pool.query(`INSERT INTO tbl_assigned_asset(${this.field}created_by, date_created) VALUES(${this.val}1, CURRENT_TIMESTAMP)`, this.values, error => {
                                if(error) reject(error);
                                quantity = parseInt(asst.rows[0].quantity) - parseInt((this.data).quantity);
                                pool.query(`UPDATE tbl_assets SET quantity= ${quantity}, updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= ${(this.data).asset_id}`, error=> {
                                    if(error) reject(error);
                                    resolve({ result: 'success', message: 'Successfully saved!' });
                                });
                            });
                        }
                    });
                }
                else {
                    pool.query(`SELECT quantity FROM tbl_assets WHERE id= ${(this.data).asset_id}`, (error, asst) => {
                        if(error) reject(error);

                        if((this.data).quantity > asst.rows[0].quantity) {
                            err.push({ name: 'quantity', message: 'Quantity must be lower than or equal to your total assets!' });
                            resolve({ result: 'error', error: err });
                        }
                        else {
                            quantity = parseInt(assgn.rows[0].quantity) + parseInt((this.data).quantity);
                            if(pool.query(`UPDATE tbl_assigned_asset SET quantity= ${quantity}, updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= ${assgn.rows[0].id}`)) {
                                quantity = parseInt(asst.rows[0].quantity) - parseInt((this.data).quantity);
                                pool.query(`UPDATE tbl_assets SET quantity= ${quantity}, updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= ${(this.data).asset_id}`, error => {
                                    if(error) reject(error);
                                    resolve({ result: 'success', message: 'Successfully saved!' });
                                });
                            }
                        }
                    });
                }
            });
        });
    }

    users = () => {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM tbl_users WHERE fname= $1 AND mname= $2 AND lname= $3`, [ (this.data).fname, (this.data).mname, (this.data).lname ], (error, result) => {
                if(error) reject(error);
                const err = [];

                if(result.rowCount !== 0) {
                    err.push({ name: 'lname', message: 'User already exist!' });
                    resolve({ result: 'error', error: err });
                }
                else {
                    pool.query(`INSERT INTO tbl_users(${this.field}created_by, date_created) VALUES(${this.val} 1, CURRENT_TIMESTAMP)`, this.values, (error) => {
                        if(error) reject(error);
                        resolve({ result: 'success', message: 'Successfully saved!' });
                    });
                }
            });
        })
    }
}

module.exports = Save;