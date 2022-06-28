class OptionsPer {
    constructor(columns, id) {
        this.columns = columns;
        this.id = id
    }

    brand = () => {
        return `SELECT ${this.columns} FROM tbl_brand WHERE category_id= ${this.id} AND status= 1 ORDER BY id ASC`;
    }

    assets = () => {
        return `SELECT ${this.columns} FROM tbl_assets WHERE brand_id= ${this.id} AND status= 1 ORDER BY id ASC`;
    }
}

module.exports = OptionsPer;