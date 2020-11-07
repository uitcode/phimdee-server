const connection = require('./index');

const findOne = async (table, field, value, listField = []) => {
  return new Promise(function(resolve, reject) {
    connection.acquire( async function(errConnection, con) {
      if (errConnection) {
        resolve({
          status: false,
          message: 'Database: Ket noi database that bai'
        });
      } else {
        await con.query(`SELECT ${listField.length > 0 ? listField : '*'} FROM ${table} WHERE ${field}='${value}'`, function(err, result) {
          if (err) {
            resolve({
              status: false,
              message: 'Database: Kiem tra ton tai that bai'
            });
          } else {
            con.release();
            if (result.length > 0) {
              resolve({
                status: true,
                exist: true,
                data: result[0],
                message: `${field} voi gia tri ${value} da ton tai`
              });
            } else {
              resolve({
                status: true,
                exist: false,
                message: `${field} voi gia tri ${value} chua ton tai`
              });
            }
          }
        });
      }
    });
  });
}

const idOfTable = {
  admin: 'id'
}

const findById = async (table, id) => {
  return new Promise(function(resolve, reject) {
    connection.acquire( async function(errConnection, con) {
      if (errConnection) {
        resolve({
          status: false,
          message: 'Database: Ket noi database that bai'
        });
      } else {
        await con.query(`SELECT * FROM ${table} WHERE ${idOfTable[table]}='${id}'`, function(err, result) {
          if (err) {
            resolve({
              status: false,
              message: 'Database: Lay du lieu that bai'
            });
          } else {
            con.release();
            if (result.length > 0) {
              resolve({
                status: true,
                exist: true,
                data: result[0]
              });
            } else {
              resolve({
                status: true,
                exist: false
              });
            }
          }
        });
      }
    });
  });
}

const updateOne = async (table, field, value, listUpdate) => {
  return new Promise(function(resolve, reject) {
    connection.acquire( async function(errConnection, con) {
      if (errConnection) {
        resolve({
          status: false,
          message: 'Database: Ket noi database that bai'
        });
      } else {
        let querySQL = `UPDATE ?? SET `;
        let arrayValue = [table];
        let i = 1;
        for (const [key, valueUpdate] of Object.entries(listUpdate)) {
          if (i < Object.keys(listUpdate).length) {
            querySQL += `${key}=?, `
          } else {
            querySQL += `${key}=? `
          }
          arrayValue.push(valueUpdate);
          i++;
        }
        querySQL += `WHERE ??=?`;
        arrayValue.push(field);
        arrayValue.push(value);

        await con.query(querySQL, arrayValue, function(err, result) {
          con.release();
          if (err) {
            resolve({
              status: false,
              message: `Database: Update thong tin ${table} that bai ==> ${err}`
            });
          } else {
            resolve({
              status: true,
              message: `Database: Update thong tin ${table} thanh cong`
            });
          }
        });
      }
    });
  });
}

module.exports = {
  findOne,
  findById,
  updateOne
}