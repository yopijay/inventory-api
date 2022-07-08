// Getall
class GetAll {

    category = () => {
        return `SELECT * FROM tbl_category ORDER BY date_created DESC`;
    }
    
    brand = () => {
        return `SELECT tbl_brand.id, tbl_brand.series_no, tbl_brand.name, tbl_brand.description, tbl_brand.status, tbl_brand.date_created, tbl_category.name as category_name FROM tbl_brand 
                    LEFT JOIN tbl_category ON tbl_brand.category_id = tbl_category.id ORDER BY date_created DESC`;
    }
    
    assets = () => {
        return `SELECT tbl_assets.id, tbl_assets.series_no, tbl_category.name as category_name, tbl_brand.name as brand_name, tbl_assets.name, tbl_assets.quantity, 
                    tbl_assets.status, tbl_assets.date_created FROM tbl_assets LEFT JOIN tbl_category ON tbl_assets.category_id = tbl_category.id
                    LEFT JOIN tbl_brand ON tbl_assets.brand_id = tbl_brand.id ORDER BY tbl_assets.date_created DESC`;
    }
    
    users = () => {
        return `SELECT * FROM tbl_users ORDER BY date_created DESC`;
    }
    
    assigned_asset = () => {
        return `SELECT tbl_assigned_asset.id, tbl_assigned_asset.series_no, tbl_assigned_asset.quantity, tbl_assigned_asset.status, tbl_assigned_asset.date_created, tbl_users.id as user_id, 
                    CONCAT(tbl_users.lname, ', ', tbl_users.fname, ' ', tbl_users.mname) as user_fullname,
                    tbl_assets.id as asset_id, tbl_assets.brand_id, tbl_assets.name as asset_name, tbl_brand.name as brand_name FROM tbl_assigned_asset 
                    LEFT JOIN tbl_users ON tbl_assigned_asset.user_id = tbl_users.id LEFT JOIN tbl_assets ON tbl_assigned_asset.asset_id = tbl_assets.id 
                    LEFT JOIN tbl_brand ON tbl_assets.brand_id = tbl_brand.id ORDER BY tbl_assigned_asset.date_created DESC`;
    }

    customer = () => {
        return `SELECT * FROM tbl_customer ORDER BY date_created DESC`;
    }

    test_report = () => {
        return `SELECT tbl_test_report.id, tbl_basic_information.serial_no, tbl_basic_information.project, tbl_customer.name AS customer, 
                    CONCAT(users.lname, ', ', users.fname, ' ', users.mname) AS tested_by, tbl_test_report.date_created FROM tbl_test_report
                    LEFT JOIN tbl_basic_information ON tbl_test_report.basic_information_id = tbl_basic_information.id
                    LEFT JOIN tbl_customer ON tbl_basic_information.customer_id = tbl_customer.id
                    LEFT JOIN tbl_users as users ON tbl_test_report.created_by = users.id
                    ORDER BY tbl_test_report.date_created ASC`;
    }

    department = () => {
        return `SELECT * FROM tbl_department ORDER BY date_created DESC`;
    }

    position = () => {
        return `SELECT * FROM tbl_position ORDER BY date_created DESC`;
    }
}

module.exports = GetAll;