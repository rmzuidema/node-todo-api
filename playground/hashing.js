const SHA256 = require('crypto-js/sha256');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

// there are only two methods
// jwt.sign
// jwt.verify

// var data = {
//     id: 10
// };

// var token = jwt.sign(data, 'saltSecret');
// console.log(token);

// var decoded = jwt.verify(token, 'saltSecret');
// console.log('Decoded ', decoded);



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

// bcrypt uses callbacks to generate the salt and to hash the data
var theHash;

// bcrypt.genSalt(10, (err, salt, theHash) => {
//     console.log(salt);
//     bcrypt.hash("password1!", salt, (err, hash, theHash) => {
//         // Store hash in your password DB. 
//         console.log("Hash for password! is ", hash);
//         theHash= hash;
//     });
// });

// console.log("Hash for password! is ", theHash);
// // As of bcryptjs 2.4.0, compare returns a promise if callback is omitted: 
// bcrypt.compare('password1!', theHash).then((res) => {
//     // res === true 
//     if (res) {
//         console.log('Passwords match');
//     } else {
//         console.log('Passwords match');
//     }
// }).catch((e) => {
//     console.log('Something failed ', e);
// });

bcrypt.genSalt(10, function (err, salt, theHash) {
    console.log(salt);
    console.log(theHash);
    bcrypt.hash("password1!", salt, function (err, hash, theHash) {
        // Store hash in your password DB. 
        console.log("Inside ", hash);
        theHash= hash;
        console.log(theHash);
    });
});

//Had to do this
theHash = '$2a$10$NEyuciiIP.5zrLne92Y7uuhOnbxZdI7B3iPHyrKpVnhk3dl0J1ZKe';


bcrypt.compare('password1!', theHash).then((res) => {
    console.log("Hash for password! is ", theHash);
    // res === true 
    if (res) {
        console.log('Passwords match');
    } else {
        console.log('Passwords match');
    }
}).catch((e) => {
    console.log('Something failed ', e);
});
