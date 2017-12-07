const SHA256 = require('crypto-js/sha256');
const jwt = require('jsonwebtoken');

// there are only two methods
// jwt.sign
// jwt.verify

var data = {
    id: 10
};

var token = jwt.sign(data, 'saltSecret');
console.log(token);

var decoded = jwt.verify(token, 'saltSecret');
console.log('Decoded ', decoded);



// Doing the token manually
// var message = 'This is my message';
// var hash = SHA256(message).toString();

// console.log(`Message ${message}`);
// console.log(`Hash ${hash}`);


// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()

// }

// var resultHash = SHA256(JSON.stringify(data)+ 'somesecret').toString();

// if (resultHash === token.hash ) {
//     console.log("Results are safe");
// } else {
//     console.log('Result was manipulated');
// }
