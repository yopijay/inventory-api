class Get {
    constructor(id) {
        this.id = id
    }

    category = () => {
        return `SELECT * FROM tbl_category WHERE id= ${this.id}`;
    }

    department = () => {
        return `SELECT * FROM tbl_department WHERE id= ${this.id}`;
    }

    brand = () => {
        return `SELECT * FROM tbl_brand WHERE id= ${this.id}`;
    }

    users = () => {
        return `SELECT * FROM tbl_users WHERE id= ${this.id}`;
    }

    assets = () => {
        return `SELECT * FROM tbl_assets WHERE id= ${this.id}`;
    }

    customer = () => {
        return `SELECT * FROM tbl_customer WHERE id= ${this.id}`;
    }

    assigned_asset = () => {
        return `SELECT tbl_assigned_asset.*, tbl_category.id AS category_id, tbl_brand.id AS brand_id FROM tbl_assigned_asset 
                    LEFT JOIN tbl_assets ON tbl_assigned_asset.asset_id = tbl_assets.id
                    LEFT JOIN tbl_category ON tbl_category.id = tbl_assets.category_id 
                    LEFT JOIN tbl_brand ON tbl_brand.id = tbl_assets.brand_id WHERE tbl_assigned_asset.id = ${this.id}`;
    }

    test_report = () => {
        return `SELECT * FROM tbl_test_report WHERE id= ${this.id}`;
    }

    basic_information = () => {
        return `SELECT tbl_basic_information.* FROM tbl_test_report
                    LEFT JOIN tbl_basic_information ON tbl_test_report.basic_information_id = tbl_basic_information.id
                    WHERE tbl_test_report.id = ${this.id}`;
    }

    general_specification = () => {
        return `SELECT tbl_general_specification.* FROM tbl_test_report
                    LEFT JOIN tbl_general_specification ON tbl_test_report.general_specification_id = tbl_general_specification.id
                    WHERE tbl_test_report.id = ${this.id}`;
    }

    component = () => {
        return `SELECT tbl_component.* FROM tbl_test_report
                    LEFT JOIN tbl_component ON tbl_test_report.component_id = tbl_component.id
                    WHERE tbl_test_report.id = ${this.id}`;
    }

    component_items = () => {
        return `SELECT tbl_component_items.* FROM tbl_test_report
                    LEFT JOIN tbl_component_items ON tbl_test_report.component_id = tbl_component_items.component_id
                    WHERE tbl_test_report.id = ${this.id}`;
    }

    construction_inspection = () => {
        return `SELECT tbl_construction_inspection.* FROM tbl_test_report
                    LEFT JOIN tbl_construction_inspection ON tbl_test_report.construction_inspection_id = tbl_construction_inspection.id
                    WHERE tbl_test_report.id = ${this.id}`;
    }

    mechanical_operation = () => {
        return `SELECT tbl_mechanical_operation.* FROM tbl_test_report
                    LEFT JOIN tbl_mechanical_operation ON tbl_test_report.mechanical_operation_id = tbl_mechanical_operation.id
                    WHERE tbl_test_report.id = ${this.id}`;
    }

    electrical_operation = () => {
        return `SELECT tbl_electrical_operation.* FROM tbl_test_report
                    LEFT JOIN tbl_electrical_operation ON tbl_test_report.electrical_operation_id = tbl_electrical_operation.id
                    WHERE tbl_test_report.id = ${this.id}`;
    }
}

module.exports = Get;