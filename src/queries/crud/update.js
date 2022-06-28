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

    assigned_asset = () => {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM tbl_assigned_asset WHERE id= ${this.id}`, (error, assgn) => {
                if(error) reject(error);
                let err = [];
                
                pool.query(`SELECT * FROM tbl_assigned_asset WHERE asset_id= ${(this.data).asset_id} AND user_id= ${(this.data).user_id} AND id= ${this.id}`, (error, same) => {
                    if(error) reject(error);

                    if(same.rowCount === 0) {
                        pool.query(`SELECT * FROM tbl_assigned_asset WHERE asset_id= ${(this.data).asset_id} AND user_id= ${(this.data).user_id}`, (error, exist) => {
                            if(error) reject(error);

                            if(exist.rowCount === 0) {
                                pool.query(`SELECT * FROM tbl_assets WHERE id= ${(this.data).asset_id}`, (error, _new) => {
                                    if(error) reject(error);
                                    
                                    if((parseInt(_new.rows[0].quantity) - parseInt((this.data).quantity)) < 0) {
                                        err.push({ name: 'quantity', message: 'Quantity must be lower than or equal to asset`s total quantity!' });
                                        resolve({ result: 'error', message: err });
                                    }
                                    else {
                                        pool.query(`UPDATE tbl_assigned_asset SET ${this.field}updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, 
                                            this.values, error => {
                                            if(error) reject(error);
                                            
                                            pool.query(`UPDATE tbl_assets SET quantity= ${parseInt(_new.rows[0].quantity) - parseInt((this.data).quantity)}, 
                                            updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= ${(this.data).asset_id}`, (error) => {
                                                if(error) reject(error);

                                                pool.query(`SELECT * FROM tbl_assets WHERE id= ${assgn.rows[0].asset_id}`, (error, _old) => {
                                                    if(error) reject(error);

                                                    pool.query(`UPDATE tbl_assets SET quantity= ${parseInt(_old.rows[0].quantity) + parseInt(assgn.rows[0].quantity)},
                                                                        updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= ${assgn.rows[0].asset_id}`, error => {
                                                        if(error) reject(error);
                                                        resolve({ result: 'success', message: 'Successfully updated!' });
                                                    })
                                                })
                                            });
                                        });
                                    }
                                });
                            }
                            else {
                                err.push({ name: 'user_id', message: 'Asset already assigned to this user!' });
                                resolve({ result: 'error', message: err });
                            }
                        })
                    }
                    else {
                        pool.query(`SELECT * FROM tbl_assets WHERE id= ${assgn.rows[0].asset_id}`, (error, count) => {
                            if(error) reject(error);

                            if(((parseInt(count.rows[0].quantity) + parseInt(assgn.rows[0].quantity)) - parseInt((this.data).quantity)) < 0) {
                                err.push({ name: 'quantity', message: 'Quantity must be lower than or equal to asset`s total quantity!' });
                                resolve({ result: 'error', message: err });
                            }
                            else {
                                pool.query(`UPDATE tbl_assigned_asset SET ${this.field}updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, error => {
                                    if(error) reject(error);
                                    pool.query(`UPDATE tbl_assets SET quantity= ${(parseInt(count.rows[0].quantity) + parseInt(assgn.rows[0].quantity)) - parseInt((this.data).quantity)}, 
                                                        updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= ${(this.data).asset_id}`, error => {
                                        if(error) reject(error);
                                        resolve({ result: 'success', message: 'Successfully updated!' });
                                    });
                                });
                            }
                        });
                    }
                })
            });
        });
    }
}

module.exports = Update;