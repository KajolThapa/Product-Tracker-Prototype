const express = require('express');
const app = express();
const routes = require('./routes')
const os = require('os');
const cors = require('cors');

const port = process.env.PORT || 8080;

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.static('dist'));
app.use('/', routes)

app.listen(port, () => {
    const hostname = os.hostname();
    console.warn(`Server running at ${hostname} on port ${port}`)
})