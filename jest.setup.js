// For async tests, catch all errors here so we don't have to try/catch everywhere for safety
process.on('unhandledRejection', (err) => console.log(err));
