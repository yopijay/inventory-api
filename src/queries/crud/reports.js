// Reports
class Reports {
     category = () => {
        return `SELECT tbl_category.id, tbl_category.series_no, tbl_category.name, COUNT(tbl_brand.*) AS total_no_of_brands, tbl_category.status FROM tbl_category
                    LEFT JOIN tbl_brand ON tbl_category.id = tbl_brand.category_id WHERE tbl_brand.category_id = tbl_category.id
                    GROUP BY tbl_category.id, tbl_category.series_no, tbl_category.name ORDER BY tbl_category.date_created ASC`;
    }

    brand = () => {
        return `SELECT tbl_brand.id, tbl_brand.series_no, tbl_category.name AS category_name, tbl_brand.name, COUNT(tbl_assets.*) AS total_no_of_assets, tbl_brand.status FROM tbl_brand
                    LEFT JOIN tbl_category ON tbl_brand.category_id = tbl_category.id
                    LEFT JOIN tbl_assets ON tbl_brand.id = tbl_assets.brand_id WHERE tbl_assets.brand_id = tbl_brand.id
                    GROUP BY tbl_brand.id, tbl_brand.series_no, tbl_brand.name, tbl_category.name ORDER BY tbl_brand.date_created ASC`;
    }

    users = () => {
        return `SELECT tbl_users.id, tbl_users.series_no, CONCAT(tbl_users.lname, ', ', tbl_users.fname, ' ', tbl_users.mname) AS fullname, COUNT(tbl_assigned_asset.*) AS total_asset,
                    tbl_users.civil_status, tbl_users.address, CONCAT(tbl_users.bmonth, '/', tbl_users.bday, '/', tbl_users.byear) AS birthdate,
                    tbl_department.name AS department, tbl_position.name AS position, tbl_users.status FROM tbl_users
                    LEFT JOIN tbl_department ON tbl_users.department_id = tbl_department.id
                    LEFT JOIN tbl_position ON tbl_users.position_id = tbl_position.id
                    LEFT JOIN tbl_assigned_asset ON tbl_assigned_asset.user_id = tbl_users.id WHERE tbl_users.id = tbl_assigned_asset.user_id
                    GROUP BY tbl_users.id, tbl_users.series_no, tbl_users.lname, tbl_users.fname, tbl_users.mname, tbl_users.civil_status, tbl_users.address,
                    tbl_users.bmonth, tbl_users.bday, tbl_users.byear, department, position ORDER BY tbl_users.date_created ASC`;
    }

    assets = () => {
        return `SELECT tbl_assets.id, tbl_assets.series_no, tbl_assets.name, (tbl_assets.quantity + SUM(tbl_assigned_asset.quantity)) AS total_asset, 
                    SUM(tbl_assigned_asset.quantity) AS assigned_assets, tbl_assets.quantity as unassigned_assets, tbl_assets.status FROM tbl_assets
                    LEFT JOIN tbl_assigned_asset ON tbl_assigned_asset.asset_id = tbl_assets.id WHERE tbl_assigned_asset.asset_id = tbl_assets.id
                    GROUP BY tbl_assets.id, tbl_assets.series_no, tbl_assets.name ORDER BY tbl_assets.date_created ASC`;
    }
}

module.exports = Reports;