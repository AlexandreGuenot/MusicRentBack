const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const emailValidation = require('../helper/emailValidation')
const saltRounds = 10;


bcrypt.hash("admin", saltRounds, function (err, hash) {

  if (!err) {
    console.log(hash);
  }
})

bcrypt.compare("admin", "$2b$10$QV9qKGbmXsGTq9FniC/SNe41oNnyRgFaJLRKxzmi1CgoZK.ZHvjAC", function (err, result) {

  if (!err) {
    console.log(result);
  }
})
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', async (req, res) => {
  try {
    const { firstname, lastname, email, favInstruments, password } = req.body;
    if (!emailValidation(email)) {
      res.json({
        success: false,
        message: "Incorrect email syntax "
      })
      return
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    let user = new User({
      firstname,
      lastname,
      email,
      favInstruments,
      password: hashedPassword
    })
    const savedUser = await user.save()
    savedUser.password = null; // on cache le mdp avant de l'envoyer
    res.json({
      success: true,
      user: savedUser

    })
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
});

router.post('/login', async (req, res) => {



  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (user) {

      let result = await bcrypt.compare(password, user.password)
      if (result == true) {
        user.password = null;
        res.json({
          success: true,
          user
        })

      } else (
        res.json({
          success: false,
          message: "Email or Password incorrect"
        })
      )

    } else (
      res.json({
        success: false,
        message: "Email or Password incorrect"
      })
    )



  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }

})



module.exports = router;
