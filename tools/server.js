const express = require('express');
const path = require('path');
const {exec} = require('child_process');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'dist')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});
const server = app.listen(8080, () => {
    console.log('server started');
    const percyProcess = exec('yarn percy', () => {
        server.close();
    });
    percyProcess.stderr.pipe(process.stderr);
    percyProcess.stdout.pipe(process.stdout);
});