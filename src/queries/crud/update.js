// Libraries
const { query } = require('express');
const db = require('../../connection/conn');

class Update {
    constructor(data, field, values, id) {
        this.data = data;
        this. field = field;
        this.values = values;
        this.id = id;
    }

    category = () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM tbl_category WHERE name= '${(this.data).name}' AND id= ${this.id}`, (error, result) => {
                if(error) reject(error);
                const err = [];
                if(result.rowCount === 0) {
                    db.query(`SELECT * FROM tbl_category WHERE name= '${(this.data).name}'`, (error, result) => {
                        if(error) reject(error);
                        if(result.rowCount !== 0) {
                            err.push({ name: 'name', message: 'Category name already exist!' });
                            resolve({ result: 'error', error: err });
                        }
                        else {
                            db.query(`UPDATE tbl_category SET ${this.field}updated_by=1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                                if(error) reject(error);
                                resolve({ result: 'success', message: 'Successfully Updated!' });
                            });
                        }
                    });
                }
                else {
                    db.query(`UPDATE tbl_category SET ${this.field}updated_by=1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                        if(error) reject(error);
                        resolve({ result: 'success', message: 'Successfully Updated!' });
                    });
                }
            });
        });
    }

    department = () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM tbl_department WHERE name= '${(this.data).name}' AND id= ${this.id}`, (error, result) => {
                if(error) reject(error);
                const err = [];
                if(result.rowCount === 0) {
                    db.query(`SELECT * FROM tbl_department WHERE name= '${(this.data).name}'`, (error, result) => {
                        if(error) reject(error);
                        if(result.rowCount !== 0) {
                            err.push({ name: 'name', message: 'Department name already exist!' });
                            resolve({ result: 'error', error: err });
                        }
                        else {
                            db.query(`UPDATE tbl_department SET ${this.field}updated_by=1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                                if(error) reject(error);
                                resolve({ result: 'success', message: 'Successfully Updated!' });
                            });
                        }
                    });
                }
                else {
                    db.query(`UPDATE tbl_department SET ${this.field}updated_by=1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                        if(error) reject(error);
                        resolve({ result: 'success', message: 'Successfully Updated!' });
                    });
                }
            });
        });
    }

    brand = () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM tbl_brand WHERE name= '${(this.data).name}' AND category_id= ${(this.data).category_id} AND id= ${this.id}`, (error, result) => {
                if(error) reject(error);
                const err = [];
                if(result.rowCount === 0) {
                    db.query(`SELECT * FROM tbl_brand WHERE name= '${(this.data).name}' AND category_id= ${(this.data).category_id}`, (error, result) => {
                        if(error) reject(error);
                        if(result.rowCount !== 0) {
                            err.push({ name: 'name', message: 'Brand name already exist!' });
                            resolve({ result: 'error', error: err });
                        }
                        else {
                            db.query(`UPDATE tbl_brand SET ${this.field}updated_by=1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                                if(error) reject(error);
                                resolve({ result: 'success', message: 'Successfully Updated!' });
                            });
                        }
                    });
                }
                else {
                    db.query(`UPDATE tbl_brand SET ${this.field}updated_by=1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                        if(error) reject(error);
                        resolve({ result: 'success', message: 'Successfully Updated!' });
                    });
                }
            });
        });
    }

    assets = () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM tbl_assets WHERE name= '${(this.data).name}' AND category_id= ${(this.data).category_id} AND brand_id= ${(this.data).brand_id}
                                AND id= ${this.id}`, (error, result) => {
                if(error) reject(error);
                const err = [];
                if(result.rowCount === 0) {
                    db.query(`SELECT * FROM tbl_assets WHERE name= '${(this.data).name}' AND category_id= ${(this.data).category_id} AND brand_id= ${(this.data).brand_id}`, (error, result) => {
                        if(error) reject(error);
                        if(result.rowCount !== 0) {
                            err.push({ name: 'name', message: 'Asset name already exist!' });
                            resolve({ result: 'error', error: err });
                        }
                        else {
                            db.query(`UPDATE tbl_assets SET ${this.field}updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                                if(error) reject(error);
                                resolve({ result: 'success', message: 'Successfully updated!' });
                            });
                        }
                    })
                }
                else {
                    db.query(`UPDATE tbl_assets SET ${this.field}updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                        if(error) reject(error);
                        resolve({ result: 'success', message: 'Successfully updated!' });
                    });
                }
            });
        });
    }

    assigned_asset = () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM tbl_assigned_asset WHERE id= ${this.id}`, (error, assgn) => {
                if(error) reject(error);
                let err = [];
                
                db.query(`SELECT * FROM tbl_assigned_asset WHERE asset_id= ${(this.data).asset_id} AND user_id= ${(this.data).user_id} AND id= ${this.id}`, (error, same) => {
                    if(error) reject(error);

                    if(same.rowCount === 0) {
                        db.query(`SELECT * FROM tbl_assigned_asset WHERE asset_id= ${(this.data).asset_id} AND user_id= ${(this.data).user_id}`, (error, exist) => {
                            if(error) reject(error);

                            if(exist.rowCount === 0) {
                                db.query(`SELECT * FROM tbl_assets WHERE id= ${(this.data).asset_id}`, (error, _new) => {
                                    if(error) reject(error);
                                    
                                    if((parseInt(_new.rows[0].quantity) - parseInt((this.data).quantity)) < 0) {
                                        err.push({ name: 'quantity', message: 'Quantity must be lower than or equal to asset`s total quantity!' });
                                        resolve({ result: 'error', message: err });
                                    }
                                    else {
                                        db.query(`UPDATE tbl_assigned_asset SET ${this.field}updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, 
                                            this.values, error => {
                                            if(error) reject(error);
                                            
                                            db.query(`UPDATE tbl_assets SET quantity= ${parseInt(_new.rows[0].quantity) - parseInt((this.data).quantity)}, 
                                            updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= ${(this.data).asset_id}`, (error) => {
                                                if(error) reject(error);

                                                db.query(`SELECT * FROM tbl_assets WHERE id= ${assgn.rows[0].asset_id}`, (error, _old) => {
                                                    if(error) reject(error);

                                                    db.query(`UPDATE tbl_assets SET quantity= ${parseInt(_old.rows[0].quantity) + parseInt(assgn.rows[0].quantity)},
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
                        db.query(`SELECT * FROM tbl_assets WHERE id= ${assgn.rows[0].asset_id}`, (error, count) => {
                            if(error) reject(error);

                            if(((parseInt(count.rows[0].quantity) + parseInt(assgn.rows[0].quantity)) - parseInt((this.data).quantity)) < 0) {
                                err.push({ name: 'quantity', message: 'Quantity must be lower than or equal to asset`s total quantity!' });
                                resolve({ result: 'error', message: err });
                            }
                            else {
                                db.query(`UPDATE tbl_assigned_asset SET ${this.field}updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, error => {
                                    if(error) reject(error);
                                    db.query(`UPDATE tbl_assets SET quantity= ${(parseInt(count.rows[0].quantity) + parseInt(assgn.rows[0].quantity)) - parseInt((this.data).quantity)}, 
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

    customer = () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM tbl_customer WHERE name= '${(this.data).name}' AND id= ${this.id}`, (error, result) => {
                if(error) reject(error);
                const err = [];
                if(result.rowCount === 0) {
                    db.query(`SELECT * FROM tbl_customer WHERE name= '${(this.data).name}'`, (error, result) => {
                        if(error) reject(error);
                        if(result.rowCount !== 0) {
                            err.push({ name: 'name', message: 'Customer name already exist!' });
                            resolve({ result: 'error', error: err });
                        }
                        else {
                            db.query(`UPDATE tbl_customer SET ${this.field}updated_by=1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                                if(error) reject(error);
                                resolve({ result: 'success', message: 'Successfully Updated!' });
                            });
                        }
                    });
                }
                else {
                    db.query(`UPDATE tbl_customer SET ${this.field}updated_by=1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                        if(error) reject(error);
                        resolve({ result: 'success', message: 'Successfully Updated!' });
                    });
                }
            });
        });
    }

    users = () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM tbl_users WHERE fname= '${(this.data).fname}' AND mname= '${(this.data).mname}' 
                                AND lname= '${(this.data).lname}' AND id= ${this.id}`, (error, exist) => {
                if(error) reject(error);
                const err = [];

                if(exist.rowCount === 0) {
                    db.query(`SELECT * FROM tbl_users WHERE fname= '${(this.data).fname}' AND mname= '${(this.data).mname}' 
                                        AND lname= '${(this.data).lname}'`, (error, result) => {
                        if(error) reject(error);
                        if(result.rowCount !== 0) {
                            err.push({ name: 'fname', message: `"${(this.data).fname}" is already exist with your last name: "${(this.data).lname}"!` });
                            err.push({ name: 'lname', message: 'Kindly change your last name!' });
                            resolve({ result: 'error', error: err });
                        }
                        else {
                            db.query(`UPDATE tbl_users SET ${this.field}updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                                if(error) reject(error);
                                resolve({ result: 'success', message: 'Successfully updated!' });
                            });
                        }
                    })
                }
                else {
                    db.query(`UPDATE tbl_users SET ${this.field}updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= $${(this.values).length}`, this.values, (error) => {
                        if(error) reject(error);
                        resolve({ result: 'success', message: 'Successfully updated!' });
                    });
                }
            })
        });
    }

    test_report = () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM tbl_test_report WHERE id= ${this.id}`, (error, tr) => {
                if(error) reject(error);
                
                db.query(`UPDATE tbl_basic_information SET serial_no= '${(this.data).basic_information.serial_no}', project= '${(this.data).basic_information.project}',
                                    customer_id= ${(this.data).basic_information.customer_id} WHERE id= ${tr.rows[0].basic_information_id}`, error => {
                    if(error) reject(error);

                    db.query(`UPDATE tbl_general_specification SET panel_name= '${(this.data).general_specification.panel_name}', voltage= '${(this.data).general_specification.voltage}', 
                                        enclosure_type= '${(this.data).general_specification.enclosure_type}', wire= '${(this.data).general_specification.wire}', 
                                        color= '${(this.data).general_specification.color}' WHERE id= ${tr.rows[0].general_specification_id}`, error => {
                        if(error) reject(error);
                        
                        db.query(`UPDATE tbl_component SET draw= '${JSON.stringify((this.data).component.draw)}', circuit_breaker= '${JSON.stringify((this.data).component.circuit_breaker)}', 
                                            lbs= '${JSON.stringify((this.data).component.lbs)}', magnetic_switch= '${JSON.stringify((this.data).component.magnetic_switch)}', 
                                            capacitor= '${JSON.stringify((this.data).component.capacitor)}', auxillary= '${JSON.stringify((this.data).component.auxillary)}', 
                                            other= '${(this.data).component.other}', jo_number= '${(this.data).component.jo_number}', 
                                            hnn= '${JSON.stringify((this.data).component.hnn)}', lrn= '${JSON.stringify((this.data).component.lrn)}', 
                                            quantity= ${(this.data).component.quantity === '' ? 0 : (this.data).component.quantity}, remarks= '${(this.data).component.remarks}' 
                                            WHERE id= ${tr.rows[0].component_id}`, error => {
                            if(error) reject(error);
                            
                            for(let count = 0; count < ((this.data).items).length; count++) {
                                let row = (this.data).items[count];

                                if(row.id !== '') {
                                    db.query(`UPDATE tbl_component_items SET device= '${row.device}', symbol= '${row.symbol}', description= '${row.description}', 
                                                        quantity=${row.quantity} WHERE id= ${row.id}`);
                                }
                                else {
                                    db.query(`INSERT INTO tbl_component_items(component_id, device, symbol, description, quantity)
                                                        VALUES(${tr.rows[0].component_id}, '${row.device}', '${row.symbol}', '${row.description}', ${row.quantity})`);
                                }
                            }

                            db.query(`UPDATE tbl_construction_inspection SET draw= '${JSON.stringify((this.data).construction_inspection.draw)}', 
                                                paint= '${JSON.stringify((this.data).construction_inspection.paint)}', busbar= '${JSON.stringify((this.data).construction_inspection.busbar)}', 
                                                powercable= '${JSON.stringify((this.data).construction_inspection.powercable)}', 
                                                nameplate= ${(this.data).construction_inspection.nameplate === '' ? 0 : (this.data).construction_inspection.nameplate}, 
                                                devicenos= ${(this.data).construction_inspection.devicenos === '' ? 0 : (this.data).construction_inspection.devicenos}, 
                                                remarks= '${(this.data).construction_inspection.remarks}' WHERE id= ${tr.rows[0].construction_inspection_id}`, error => {
                                if(error) reject(error);

                                db.query(`UPDATE tbl_mechanical_operation SET circuit_breaker= '${JSON.stringify((this.data).mechanical_operation.circuit_breaker)}', 
                                                    load_breaker= '${JSON.stringify((this.data).mechanical_operation.load_breaker)}', 
                                                    magnetic_switch= '${JSON.stringify((this.data).mechanical_operation.magnetic_switch)}', 
                                                    screw_tightening= '${JSON.stringify((this.data).mechanical_operation.screw_tightening)}', 
                                                    remarks= '${(this.data).mechanical_operation.remarks}' 
                                                    WHERE id= ${tr.rows[0].mechanical_operation_id}`, error => {
                                    if(error) reject(error);
                                    
                                    db.query(`UPDATE tbl_electrical_operation SET irt= '${JSON.stringify((this.data).electrical_operation.irt)}', 
                                                        ccirt= '${JSON.stringify((this.data).electrical_operation.ccirt)}', ds= '${JSON.stringify((this.data).electrical_operation.ds)}', 
                                                        ccds= '${JSON.stringify((this.data).electrical_operation.ccds)}', polarity= '${JSON.stringify((this.data).electrical_operation.polarity)}', 
                                                        simulation= '${JSON.stringify((this.data).electrical_operation.simulation)}', pst= '${JSON.stringify((this.data).electrical_operation.pst)}', 
                                                        remarks= '${(this.data).electrical_operation.remarks}', 
                                                        et= ${(this.data).electrical_operation.et === true ? 1 : 0}, 
                                                        ct= ${(this.data).electrical_operation.ct === true ? 1 : 0} WHERE id= ${tr.rows[0].electrical_operation_id}`, error => {
                                        if(error) reject(error);

                                        db.query(`UPDATE tbl_test_report SET updated_by= 1, date_updated= CURRENT_TIMESTAMP WHERE id= ${this.id}`);
                                        resolve({ result: 'success', message: 'Successfully updated!' });
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

module.exports = Update;