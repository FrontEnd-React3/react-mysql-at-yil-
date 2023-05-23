
// Our dependecies
const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const jwt = require('jsonwebtoken')

app.use(express.json())
app.use(cors())

// Let us run the server. SO its running,
app.listen(3002, () => {
    console.log('Server is running on port 3002')
})

// Let us create our database (mysql)
const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '', //If you have set xampp password please enter it here
    database: 'plantdb',
})


db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Let us now create a route to the server that will register a user.

app.get('/users', (req, res) => {
    const SQL = 'SELECT * FROM users'
    db.query(SQL, (err, results) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send(results)
        }
    })
})

app.post('/register', (req, res) => {
    // We need to get variables sent from the form
    const { username, password, email } = req.body;

    // Execute the SQL query
    db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email], (error, results) => {
        if (error) {
            console.error('Error executing the register query: ' + error);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send('Registration successful');
        }
    });

})
// Now we need to login with these credentials from a registered User
// Lets create another route
app.post('/login', (req, res) => {
    // We need to get variables sent from the form
    const { username, password } = req.body

    // Execute the SQL query
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
        if (error) {
            console.error('Error executing the login query: ' + error);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.length > 0) {
                // User found, authentication successful
                jwt.sign({
                    username: results[0].username,
                    password: results[0].password,
                },'secret',(err,token)=>{
                    res.status(200).json({
                        message: 'Authentication successful',
                        payload:results[0],
                        token:token
                    })
                })
            
            } else {
                // User not found or invalid credentials
                res.status(401).send('Invalid credentials');
            }
        }
    });
})

