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

    customer = () => {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM tbl_customer WHERE name= '${(this.data).name}'`, (error, result) => {
                if(error) reject(error);
                const err = [];

                if(result.rowCount !== 0) {
                    err.push({ name: 'name', message: 'Customer name already exist!' });
                    resolve({ result: 'error', error: err });
                }
                else {
                    pool.query(`INSERT INTO tbl_customer(${this.field}created_by, date_created) VALUES(${this.val} 1, CURRENT_TIMESTAMP)`, this.values, (error) => {
                        if(error) reject(error);
                        resolve({ result: 'success', message: 'Successfully saved!' });
                    });
                }
            });
        });
    }

    test_report = () => {
        return new Promise((resolve, reject) => {
            const bi = (this.data).basic_information;
            const gs = (this.data).general_specification;
            const c = (this.data).component;
            const i = (this.data).items;
            const ci = (this.data).construction_inspection;
            const mo = (this.data).mechanical_operation;
            const eo = (this.data).electrical_operation;

            // Insert to tbl_test_report
            pool.query(`INSERT INTO tbl_test_report(created_by, date_created) VALUES(1, CURRENT_TIMESTAMP) RETURNING id`, (error, tr) => {
                if(error) reject(error);

                // Insert to tbl_basic_information
                pool.query(`INSERT INTO tbl_basic_information(serial_no, project, customer_id, date_performed) 
                                    VALUES('${bi.serial_no}', '${bi.project}', ${bi.customer_id}, CURRENT_TIMESTAMP) RETURNING id`, (error, bi) => {
                    if(error) reject(error);
                    pool.query(`UPDATE tbl_test_report SET basic_information_id = ${bi.rows[0].id} WHERE id= ${tr.rows[0].id}`);

                    // Insert to tbl_general_specification
                    pool.query(`INSERT INTO tbl_general_specification(panel_name, voltage, enclosure_type, wire, color)
                                        VALUES('${gs.panel_name}', '${gs.voltage}', '${gs.enclosure_type}', '${gs.wire}', '${gs.color}') RETURNING id`, (error, gs) => {
                        if(error) reject(error);
                        pool.query(`UPDATE tbl_test_report SET general_specification_id = ${gs.rows[0].id} WHERE id= ${tr.rows[0].id}`);

                        // Insert to component
                        pool.query(`INSERT INTO tbl_component(draw, circuit_breaker, lbs, magnetic_switch, capacitor, auxillary, other, jo_number, hnn, lrn, quantity, remarks) 
                                            VALUES('${JSON.stringify(c.draw)}', '${JSON.stringify(c.circuit_breaker)}', '${JSON.stringify(c.lbs)}', '${JSON.stringify(c.magnetic_switch)}', 
                                            '${JSON.stringify(c.capacitor)}', '${JSON.stringify(c.auxillary)}', '${c.other}', '${c.jo_number}', '${JSON.stringify(c.hnn)}', '${JSON.stringify(c.lrn)}', 
                                            ${c.quantity === '' ? 0 : c.quantity}, '${c.remarks}') RETURNING id`, (error, c) => {
                            if(error) reject(error);
                            
                            for(let count = 0; count < i.length; count++) {
                                pool.query(`INSERT INTO tbl_component_items(component_id, device, symbol, description, quantity) 
                                                    VALUES(${c.rows[0].id}, '${i[count].device}', '${i[count].symbol}', '${i[count].description}', ${i[count].quantity === '' ? 0 : i[count].quantity})`);
                            }
                            pool.query(`UPDATE tbl_test_report SET component_id = ${c.rows[0].id} WHERE id= ${tr.rows[0].id}`);

                            // Insert to tbl_construction_inspection
                            pool.query(`INSERT INTO tbl_construction_inspection(draw, paint, busbar, powercable, nameplate, devicenos, remarks)
                                                VALUES('${JSON.stringify(ci.draw)}', '${JSON.stringify(ci.paint)}', '${JSON.stringify(ci.busbar)}', '${JSON.stringify(ci.powercable)}', 
                                                ${ci.nameplate === true ? 1 : 0}, ${ci.devicenos === true ? 1 : 0}, 
                                                '${ci.remarks}') RETURNING id`, (error, ci) => {
                                if(error) reject(error);
                                pool.query(`UPDATE tbl_test_report SET construction_inspection_id = ${ci.rows[0].id} WHERE id= ${tr.rows[0].id}`);

                                // Insert to tbl_mechanical_operation
                                pool.query(`INSERT INTO tbl_mechanical_operation(circuit_breaker, load_breaker, magnetic_switch, screw_tightening, remarks)
                                                    VALUES('${JSON.stringify(mo.circuit_breaker)}', '${JSON.stringify(mo.load_breaker)}', '${JSON.stringify(mo.magnetic_switch)}', 
                                                    '${JSON.stringify(mo.screw_tightening)}', '${mo.remarks}') RETURNING id`, (error, mo) => {
                                    if(error) reject(error);
                                    pool.query(`UPDATE tbl_test_report SET mechanical_operation_id = ${mo.rows[0].id} WHERE id= ${tr.rows[0].id}`);

                                    // Insert to tbl_electrical_operation
                                    pool.query(`INSERT INTO tbl_electrical_operation(irt, ccirt, ds, ccds, polarity, simulation, pst, remarks, et, ct)
                                                        VALUES('${JSON.stringify(eo.irt)}', '${JSON.stringify(eo.ccirt)}', '${JSON.stringify(eo.ds)}', '${JSON.stringify(eo.ccds)}', 
                                                        '${JSON.stringify(eo.polarity)}', '${JSON.stringify(eo.simulation)}', '${JSON.stringify(eo.pst)}', '${eo.remarks}',
                                                        ${eo.et === true ? 1 : 0}, ${eo.ct === true ? 1 : 0}) RETURNING id`, (error, eo) => {
                                        if(error) reject(error);
                                        pool.query(`UPDATE tbl_test_report SET electrical_operation_id = ${eo.rows[0].id} WHERE id= ${tr.rows[0].id}`);
                                        resolve({ result: 'success', message: 'Successfully saved!' });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }
}

module.exports = Save;