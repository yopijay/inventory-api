class Options {
    constructor(columns) {
        this.columns = columns
    }

    category = () => {
        return `SELECT ${this.columns} FROM tbl_category WHERE status= 1 ORDER BY id ASC`;
    }

    users = () => {
        return `SELECT ${this.columns} FROM tbl_users WHERE status= 1 ORDER BY id ASC`;
    }

    customer = () => {
        return `SELECT ${this.columns} FROM tbl_customer WHERE status= 1 ORDER BY id ASC`;
    }
}

module.exports = Options;