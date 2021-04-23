const bcrypt = require('bcrypt');
const saltRounds = 10;

function bCrypt() {
    
   function enCrypt(password) {
    return bcrypt.hash(password, saltRounds)   
        
}

  function checkUser( password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
    }

return {
    checkUser,
    enCrypt
}

}


module.exports = bCrypt;