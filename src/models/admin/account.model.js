const connection = require('../index');
const bcrypt = require('bcryptjs');
const methodDB = require('../../models/method');

const signUp = async (objData) => {
  return new Promise(function(resolve, reject) {
    connection.acquire( async function(errConnection, con) {
      if (errConnection) {
        resolve({
          status: false,
          message: 'Database: Ket noi database that bai'
        });
      } else {
        if (!!objData.password) {
          const salt = await bcrypt.genSalt(10);
          objData.password = await bcrypt.hash(objData.password, salt);
        }
        await con.query('insert into admin set ?', objData, function(errInsert, result) {
          if (errInsert) {
            resolve({
              status: false,
              message: 'Database: Them tai khoan vao database that bai ==> ' + errInsert
            });
          } else {
            con.release();
            resolve({
              status: true,
              insertId: result.insertId,
              message: 'success'
            });
          }
        });
      }
    });
  });
}

const isValidPassword = async (password, passwordEncode) => {
  try {
    return await bcrypt.compare(password, passwordEncode);
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  signUp,
  isValidPassword
}