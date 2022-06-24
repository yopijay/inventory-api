// Getall
class GetAll {

    category = () => {
        return `SELECT * FROM tbl_category ORDER BY date_created DESC`;
    }
    
    brand = () => {
        return `SELECT tbl_brand.id, tbl_brand.series_no, tbl_brand.name, tbl_brand.description, tbl_brand.status, tbl_brand.date_created, tbl_category.id as category_id, 
                    tbl_category.name as category_name FROM tbl_brand 
                    LEFT JOIN tbl_category ON tbl_brand.category_id = tbl_category.id ORDER BY date_created DESC`;
    }
    
    assets = () => {
        return `SELECT tbl_assets.id, tbl_assets.series_no, tbl_assets.name, tbl_assets.quantity, tbl_assets.status, tbl_assets.date_created, 
                    tbl_category.id as category_id, tbl_category.name as category_name,
                    tbl_brand.id as brand_id, tbl_brand.name as brand_name FROM tbl_assets LEFT JOIN tbl_category ON tbl_assets.category_id = tbl_category.id
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
}

module.exports = GetAll;