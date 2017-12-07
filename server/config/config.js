// Created a local env variable called NODE_ENV and set to local

var env = process.env.NODE_ENV || 'Local';
if ( env === 'Local') {
    process.env.MONGOURI='mongodb://localhost:27017/NewTodoApp';
} else {
    process.env.MONGOURI='mongodb://todouser:todouser58@ds129966.mlab.com:29966/newtodoapp';    
}
