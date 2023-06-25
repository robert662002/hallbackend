const User = require('../model/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const { GMAIL, PASS } = require('../env.js')

const handleNewUser = async (req, res) => {
    const { mail,user, pwd } = req.body;
    if (!mail||!user||!pwd) return res.status(400).json({ 'message': ' all fields are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    const duplicate1 = await User.findOne({ email: mail }).exec();
    if (duplicate||duplicate1) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user
        const result = await User.create({
            
            "email":mail,
            "username": user,
            "password": hashedPwd
        });

        let config = {
            service: 'gmail',
            auth: {
                user: GMAIL,
                pass: PASS
            }
        }
        
        let transporter = nodemailer.createTransport(config);
        
        let MailGenerator = new Mailgen({
            theme: "cerberus",
            product: {
                name: "MITS HALLS.",
                link: 'https://mitshalls.onrender.com/' //site of our link
            }
        })
        let response = {
            body: {
                name: req.body.user,
                greeting:'Welcome',
                intro: 'You are successfully registered with MITS HALLS!',
                table: {
                    data: [
                        {
                            username:req.body.user,
                            email: req.body.mail,
                            password:req.body.pwd,
                        }
                    ],
                    columns: {
                        // Optionally, customize the column widths
                        customWidth: {
                            username: '30%',
                            email: '40%'
                        }
                    }
                },
                outro: "Use Email and Password for Login",
                signature: 'Thank you for choosing us:)'
            }
        }

        let email = MailGenerator.generate(response)

        let message = {
            from: GMAIL,
            to: req.body.mail,
            subject: "SignIn confirmation!",
            html: email
        }

        transporter.sendMail(message).then(() => {
            return res.status(201).json({
                msg: "you should receive an email", result
            })
        }).catch(error => {
            return res.status(500).json({ error })
        })
 
        console.log(result);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };