const nodeMailer = require('nodemailer');


const sendCredentials = async (email, password) => {
    
    const transporter = nodeMailer.createTransport({
        service: 'hotmail',
        // port: 456,
        // secure: true,
        auth: {
            user: 'HrSystemSeProject@outlook.com',
            pass: 'HrSystem123!'
        }
    })

    const html = '<h1>Welcome Onboard!</h1> <h2>Below are your Hr app login credentials</h2> <p>Email: '
                 + email + '<br>Password: ' + password + '</p>';

    const options = {
        from: 'HrSystemSeProject@outlook.com',
        to : email,
        subject: 'Account Credential HR System',
        html: html
    }

    transporter.sendMail(options, function (err, info) {
        if(err){
            console.log(err);
        }
        console.log('Response = ',info.response);
    })
}

module.exports = {
    sendCredentials
}