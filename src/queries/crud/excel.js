class Excel {

    category = () => {
        return `SELECT tbl_category.id, tbl_category.series_no, tbl_category.name, tbl_category.description, CASE WHEN tbl_category.status > 0 THEN 'Active' ELSE 'Inactive' END AS status,
                    CONCAT(cb.lname, ', ', cb.fname, ' ', cb.mname) AS created_by, tbl_category.date_created,
                    CONCAT(ub.lname, ', ', ub.fname, ' ', ub.mname) AS updated_by, tbl_category.date_updated FROM tbl_category
                    LEFT JOIN tbl_users AS cb ON tbl_category.created_by = cb.id
                    LEFT JOIN tbl_users AS ub ON tbl_category.updated_by = ub.id
                    ORDER BY tbl_category.date_created ASC`;
    }

    department = () => {
        return `SELECT tbl_department.id, tbl_department.series_no, tbl_department.name, tbl_department.description, CASE WHEN tbl_department.status > 0 THEN 'Active' ELSE 'Inactive' END AS status,
                    CONCAT(cb.lname, ', ', cb.fname, ' ', cb.mname) AS created_by, tbl_department.date_created,
                    CONCAT(ub.lname, ', ', ub.fname, ' ', ub.mname) AS updated_by, tbl_department.date_updated FROM tbl_department
                    LEFT JOIN tbl_users AS cb ON tbl_department.created_by = cb.id
                    LEFT JOIN tbl_users AS ub ON tbl_department.updated_by = ub.id
                    ORDER BY tbl_department.date_created ASC`;
    }

    brand = () => {
        return `SELECT tbl_brand.id, tbl_brand.series_no, tbl_category.name AS category, tbl_brand.name, tbl_brand.description, CASE WHEN tbl_brand.status > 0 THEN 'Active' ELSE 'Inactive' END AS status,
                    CONCAT(cb.lname, ', ', cb.fname, ' ', cb.mname) AS created_by, tbl_brand.date_created,
                    CONCAT(ub.lname, ', ', ub.fname, ' ', ub.mname) AS updated_by, tbl_brand.date_updated FROM tbl_brand
                    LEFT JOIN tbl_category ON tbl_brand.category_id = tbl_category.id
                    LEFT JOIN tbl_users AS cb ON tbl_brand.created_by = cb.id
                    LEFT JOIN tbl_users AS ub ON tbl_brand.updated_by = ub.id
                    ORDER BY tbl_brand.date_created ASC`;
    }

    users = () => {
        return `SELECT tbl_users.id, tbl_users.series_no, CONCAT(tbl_users.lname, ', ', tbl_users.fname, ' ', tbl_users.mname) AS fullname, tbl_users.civil_status, tbl_users.address,
                    CONCAT(tbl_users.bmonth, ' ', tbl_users.bday, ', ', tbl_users.byear) AS birthdate, tbl_department.name AS department, tbl_position.name AS position,
                    CASE WHEN tbl_users.status > 0 THEN 'Active' ELSE 'Inactive' END AS status,
                    CONCAT(cb.lname, ', ', cb.fname, ' ', cb.mname) AS created_by, tbl_users.date_created,
                    CONCAT(ub.lname, ', ', ub.fname, ' ', ub.mname) AS updated_by, tbl_users.date_updated FROM tbl_users
                    LEFT JOIN tbl_users AS cb ON tbl_users.created_by = cb.id
                    LEFT JOIN tbl_users AS ub ON tbl_users.updated_by = ub.id
                    LEFT JOIN tbl_department ON tbl_users.department_id = tbl_department.id
                    LEFT JOIN tbl_position ON tbl_users.position_id = tbl_position.id
                    ORDER BY tbl_users.date_created ASC`;
    }

    assets = () => {
        return `SELECT tbl_assets.id, tbl_assets.series_no, tbl_category.name AS category, tbl_brand.name AS brand, tbl_assets.name, tbl_assets.description, tbl_assets.quantity,
                    CASE WHEN tbl_assets.status > 0 THEN 'Active' ELSE 'Inactive' END AS status,
                    CONCAT(cb.lname, ', ', cb.fname, ' ', cb.mname) AS created_by, tbl_assets.date_created,
                    CONCAT(ub.lname, ', ', ub.fname, ' ', ub.mname) AS updated_by, tbl_assets.date_updated FROM tbl_assets
                    LEFT JOIN tbl_users AS cb ON tbl_assets.created_by = cb.id
                    LEFT JOIN tbl_users AS ub ON tbl_assets.updated_by = ub.id
                    LEFT JOIN tbl_category ON tbl_assets.category_id = tbl_category.id
                    LEFT JOIN tbl_brand ON tbl_assets.brand_id = tbl_brand.id
                    ORDER BY tbl_assets.date_created ASC`;
    }

    customer = () => {
        return `SELECT tbl_customer.id, tbl_customer.series_no, tbl_customer.name, tbl_customer.description, CASE WHEN tbl_customer.status > 0 THEN 'Active' ELSE 'Inactive' END AS status,
                    CONCAT(cb.lname, ', ', cb.fname, ' ', cb.mname) AS created_by, tbl_customer.date_created,
                    CONCAT(ub.lname, ', ', ub.fname, ' ', ub.mname) AS updated_by, tbl_customer.date_updated FROM tbl_customer
                    LEFT JOIN tbl_users AS cb ON tbl_customer.created_by = cb.id
                    LEFT JOIN tbl_users AS ub ON tbl_customer.updated_by = ub.id
                    ORDER BY tbl_customer.date_created ASC`;
    }

    assigned_asset = () => {
        return `SELECT tbl_assigned_asset.id, tbl_assigned_asset.series_no, CONCAT(issued_to.lname, ', ', issued_to.fname, ' ', issued_to.mname) AS issued_to,
                    tbl_assets.name AS asset, tbl_assigned_asset.quantity, CASE WHEN tbl_assigned_asset.status > 0 THEN 'Active' ELSE 'Inactive' END AS status,
                    CONCAT(cb.lname, ', ', cb.fname, ' ', cb.mname) AS created_by, tbl_assigned_asset.date_created,
                    CONCAT(ub.lname, ', ', ub.fname, ' ', ub.mname) AS updated_by, tbl_assigned_asset.date_updated FROM tbl_assigned_asset
                    LEFT JOIN tbl_users AS issued_to ON tbl_assigned_asset.created_by = issued_to.id
                    LEFT JOIN tbl_users AS cb ON tbl_assigned_asset.created_by = cb.id
                    LEFT JOIN tbl_users AS ub ON tbl_assigned_asset.updated_by = ub.id
                    LEFT JOIN tbl_assets ON tbl_assigned_asset.asset_id = tbl_assets.id
                    ORDER BY tbl_assigned_asset.date_created ASC`;
    }
}

module.exports = Excel;