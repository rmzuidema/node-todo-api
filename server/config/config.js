// Created a local env variable called NODE_ENV and set to local
// export the data to a ignored json file

var env = process.env.NODE_ENV || 'Local';
if (env === 'Local') {

    var config = require('./config.json');
    var envConfig = config[env];
//    console.log('Env config', envConfig);
    
    Object.keys(envConfig).forEach((key) => {
//        console.log('Key ', key);
        process.env[key]=envConfig[key];
 //       console.log('Process env ', process.env[key]);
    });
}
// if ( env === 'Local') {
//     process.env.MONGOURI='mongodb://localhost:27017/NewTodoApp';
// } else {
//     process.env.MONGOURI='mongodb://todouser:todouser58@ds129966.mlab.com:29966/newtodoapp';    
// }
