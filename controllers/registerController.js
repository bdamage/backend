const User = require('../model/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const handleNewUser = async (req, res) => {
    const {user, pwd } = req.body;

    if(!user || !pwd)
        return res.status(400).json({message:"Username and password are required"});

    //check duplicate username in the db
    const duplicate = await User.findOne({username: user}).exec();

    if(duplicate) 
        return res.sendStatus(409); //conflict

    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, saltRounds);

        //store the new user
        const result = await User.create({
            "username": user, 
            "password":hashedPwd
        });
        
/* Alt methods
const newUser = new User();
newUser.username = ...

or
const newUser = new User({
            "username": user, 
            "password":hashedPwd
        });

const result = await newUser.save()
*/

        console.log(result);

        res.status(201).json({'success': `New user ${user} created`});

    } catch (error) {
        res.status(500).json({'message': error.message});
    }

}

module.exports = {handleNewUser}; 