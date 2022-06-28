// Reports
class Reports {
     category = () => {
        return `SELECT tbl_category.id, tbl_category.series_no, tbl_category.name, COUNT(tbl_brand.*) as total, tbl_category.status,
                    CONCAT(user1.lname, ', ', user1.fname, ' ', user1.mname) as created_by, tbl_category.date_created,
                    CONCAT(user2.lname, ', ', user2.fname, ' ', user2.mname) as updated_by, tbl_category.date_updated FROM tbl_category
                    LEFT JOIN tbl_users AS user1 ON tbl_category.created_by = user1.id 
                    LEFT JOIN tbl_users AS user2 ON tbl_category.updated_by = user2.id
                    LEFT JOIN tbl_brand ON tbl_category.id = tbl_brand.category_id WHERE tbl_brand.category_id = tbl_category.id
                    GROUP BY tbl_category.id, tbl_category.series_no, tbl_category.name, tbl_category.status, tbl_category.date_created, tbl_category.date_updated,
                    user1.lname, user1.fname, user1.mname, user2.lname, user2.fname, user2.mname ORDER BY tbl_category.date_created ASC`;
    }
}

module.exports = Reports;