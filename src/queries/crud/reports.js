// Reports
class Reports {
     category = () => {
        return `SELECT tbl_category.id, tbl_category.series_no, tbl_category.name, COUNT(tbl_brand.*) AS total, tbl_category.status,
                    CONCAT(user1.lname, ', ', user1.fname, ' ', user1.mname) AS created_by, tbl_category.date_created,
                    CONCAT(user2.lname, ', ', user2.fname, ' ', user2.mname) AS updated_by, tbl_category.date_updated FROM tbl_category
                    LEFT JOIN tbl_users AS user1 ON tbl_category.created_by = user1.id 
                    LEFT JOIN tbl_users AS user2 ON tbl_category.updated_by = user2.id
                    LEFT JOIN tbl_brand ON tbl_category.id = tbl_brand.category_id WHERE tbl_brand.category_id = tbl_category.id
                    GROUP BY tbl_category.id, tbl_category.series_no, tbl_category.name, tbl_category.status, tbl_category.date_created, tbl_category.date_updated,
                    user1.lname, user1.fname, user1.mname, user2.lname, user2.fname, user2.mname ORDER BY tbl_category.date_created ASC`;
    }

    brand = () => {
        return `SELECT tbl_brand.id, tbl_brand.series_no, tbl_category.name AS category_name, tbl_brand.name, COUNT(tbl_assets.*) AS total, tbl_brand.status,
                    CONCAT(user1.lname, ', ', user1.fname, ' ', user1.mname) AS created_by, tbL_brand.date_created,
                    CONCAT(user2.lname, ', ', user2.fname, ' ', user2.mname) AS updated_by, tbL_brand.date_updated FROM tbl_brand
                    LEFT JOIN tbl_users AS user1 ON tbl_brand.created_by = user1.id 
                    LEFT JOIN tbl_users AS user2 ON tbl_brand.updated_by = user2.id
                    LEFT JOIN tbl_category ON tbl_brand.category_id = tbl_category.id
                    LEFT JOIN tbl_assets ON tbl_brand.id = tbl_assets.brand_id WHERE tbl_assets.brand_id = tbl_brand.id
                    GROUP BY tbl_brand.id, tbl_brand.series_no, tbl_brand.name, tbl_brand.status, tbl_brand.date_created, tbl_brand.date_updated, tbl_category.name,
                    user1.lname, user1.fname, user1.mname, user2.lname, user2.fname, user2.mname ORDER BY tbl_brand.date_created ASC`;
    }

    users = () => {
        return `SELECT tbl_users.id, tbl_users.series_no, CONCAT(tbl_users.lname, ', ', tbl_users.fname, ' ', tbl_users.mname) AS fullname, COUNT(tbl_assigned_asset.*) AS total_asset,
                    tbl_users.civil_status, tbl_users.address, CONCAT(tbl_users.bmonth, '/', tbl_users.bday, '/', tbl_users.byear) AS birthdate, tbl_users.status,
                    tbl_department.name AS department_name, tbl_position.name AS position_name,
                    CONCAT(user1.lname, ', ', user1.fname, ' ', user1.mname) AS created_by, tbl_users.date_created,
                    CONCAT(user2.lname, ', ', user2.fname, ' ', user2.mname) AS updated_by, tbl_users.date_updated FROM tbl_users
                    LEFT JOIN tbl_users AS user1 ON tbl_users.created_by = user1.id 
                    LEFT JOIN tbl_users AS user2 ON tbl_users.updated_by = user2.id
                    LEFT JOIN tbl_department ON tbl_users.department_id = tbl_department.id
                    LEFT JOIN tbl_position ON tbl_users.position_id = tbl_position.id
                    LEFT JOIN tbl_assigned_asset ON tbl_assigned_asset.user_id = tbl_users.id WHERE tbl_users.id = tbl_assigned_asset.user_id
                    GROUP BY tbl_users.id, tbl_users.series_no, tbl_users.lname, tbl_users.fname, tbl_users.mname, tbl_users.civil_status, tbl_users.address,
                    tbl_users.bmonth, tbl_users.bday, tbl_users.byear, tbl_users.status, department_name, position_name, user1.lname, user1.fname, user1.mname,
                    user2.lname, user2.fname, user2.mname, tbl_users.date_created, tbl_users.date_updated ORDER BY tbl_users.date_created ASC`
    }

    assets = () => {
        return `SELECT tbl_assets.id, tbl_assets.series_no, tbl_assets.name, (tbl_assets.quantity + SUM(tbl_assigned_asset.quantity)) AS total_asset, 
                    SUM(tbl_assigned_asset.quantity) AS assigned_quantity, tbl_assets.quantity as unassigned_quantity, 
                    CONCAT(user1.lname, ', ', user1.fname, ' ', user1.mname) AS created_by, tbl_assets.date_created,
                    CONCAT(user2.lname, ', ', user2.fname, ' ', user2.mname) AS updated_by, tbl_assets.date_updated FROM tbl_assets
                    LEFT JOIN tbl_users AS user1 ON tbl_assets.created_by = user1.id 
                    LEFT JOIN tbl_users AS user2 ON tbl_assets.updated_by = user2.id
                    LEFT JOIN tbl_assigned_asset ON tbl_assigned_asset.asset_id = tbl_assets.id WHERE tbl_assigned_asset.asset_id = tbl_assets.id
                    GROUP BY tbl_assets.id, tbl_assets.series_no, tbl_assets.name, tbl_assets.quantity, tbl_assigned_asset.quantity, user1.lname, user1.fname, user1.mname,
                    user2.lname, user2.fname, user2.mname ORDER BY tbl_assets.date_created ASC`
    }
}

module.exports = Reports;