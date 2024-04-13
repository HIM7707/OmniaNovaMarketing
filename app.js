// app.js
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


// Access environment variables
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
// Body parser middleware
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Serve static files from the 'dist' directory for Tailwind CSS
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// Serve static files from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Render the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Handle form submission
app.post('/submit', (req, res) => {
    console.log('Received form data:', req.body);
    const { name ,email, query } = req.body;

    //console.log(name , email , query);
    // Create transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: smtpUser, // Your Gmail email address
            pass: smtpPass // Your Gmail password
        }
    });

    // Setup email data
    let mailOptions = {
        from: smtpUser, // Sender address
        to: smtpUser, // Receiver address
        subject: 'Query from Website', // Subject line
        text: `You received a query from: \n Name:${name} \n Email: ${email} \n\nQuery Details:\n${query}` // Plain text body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('Failed to submit your query. Please try again later.');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Your query has been submitted successfully!');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});