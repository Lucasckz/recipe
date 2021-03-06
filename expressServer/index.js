/*
File: index.js
?: This contains express js code that allows access to UserBase and serves react files
Utilizes ports:
4001: Front End React
4003: Back End Involving UserBase
*/ 
const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const { connect } = require('http2');

//Initialize express apps
//app1 serves front end, app2 serves results from UserBase
const app1 = express();
const app2 = express();

//Connect app1 to port 4001
const server = app1.listen(4001, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Express listening to host ${host} @ port ${port}`);
});

//Connect app2 to port 4003
const backend = app2.listen(4003, () => {
  const host = backend.address().address;
  const port = backend.address().port;

  console.log(`Express listening to host ${host} @ port ${port}`);
});

//SQL Commands
const SELECT_USERS = 'SELECT Email, Password FROM UserBase';
const SELECT_LOGIN = 'SELECT Email, LoginStatus FROM UserBase';
const SELECT_PREF = 'SELECT Email, UserPreferences FROM UserBase';
const SELECT_NAMES = 'SELECT Email, Name FROM UserBase';

//Using mySQL to connect to UserBase
const connection = mysql.createConnection({
  host: 'mydb.clpczhezhvi1.us-west-2.rds.amazonaws.com',
  user: 'admin',
  password: 'password',
  database: 'Recipe'
});


//Use cors
app1.use(cors());
app2.use(cors());

//Serve files through app1
app1.use(express.static(path.join(__dirname, 'public')));

//This says to use file path for files
app1.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//App2 (backend) sends email and (hashed) password to UserBase
app2.get('/signup', (req, res) => {
  const { email, password } = req.query;
  
  const hashedPass = hash(password);

  //connection.query allows us to send SQL commands to UserBase 
  //res.send will actually send stuff to the page and render, so we can send boolean to see if we successfully signed up or not
  const INSERT_USER = `INSERT INTO UserBase (Password, Email) VALUES('${hashedPass}', '${email}')`;
  connection.query(INSERT_USER, (err, results) => {
    if(err) {
      return res.send(false);
    }
    else {
      connection.query(`UPDATE UserBase SET LoginStatus = 1 WHERE Email = '${email}'`);
      return res.send(true);
    }
  });
});

//authenticate email and password by comparing with userBase
app2.get('/authenticate', (req, res) => {
  const { email, password } = req.query;
  connection.query(SELECT_USERS, (err, results) => {
    if(err) {
      //return err
      return res.send(err);
    }
    else {
      
      //Find user
      const grabUser = results.find(ele => ele['Email']===email);
      
      if(grabUser!==undefined) {

        //If user does exist, compare password with hash using bcrypt's compare method
        const comparison = bcrypt.compareSync(password, grabUser['Password']);
        if(comparison) {
          connection.query(`UPDATE UserBase SET LoginStatus = 1 WHERE Email = '${grabUser['Email']}'`);
          return res.send(true);
        }
        
      }
      return res.send(false);
      
    }
  });
});

//Get loginstatus of specficied email
app2.get('/loginstatus', (req, res) => {
  const { email } = req.query;

  connection.query(SELECT_LOGIN, (err, results) => {
    if(err) {
      res.send(err);
    }
    const grabUser = results.find(ele => ele['Email']===email);
    if(grabUser !== undefined) {
      if(grabUser['LoginStatus'] === null) {
        return res.send(false);
      }
      else if(grabUser['LoginStatus'] === true) {
        return res.send(true);
      } 
    } else {
      return res.send(false);
    }
  });
  // return res.send(false);
});

//Sign out of website
//AKA, set loginStatus in UserBase to 0 (false)
app2.get('/signout', (req, res) => {
  const { email } = req.query;

  connection.query(SELECT_USERS, (err, results) => {
    if(err) {
      return res.send(err);
    } else {
      // const grabUser = results.find(ele => ele['Email']===email);
      connection.query(`UPDATE UserBase SET LoginStatus = 0 WHERE Email = '${email}'`);
      return res.send(email);
    }
  });
  // return res.send("GOODBYE!");
  
});

//Save, Delete, Retrieve

app2.get('/savePref', (req, res) => {
  //query recipe title and href
  const { email, title, href } = req.query;

  const jsonPref = { title: title, href: href };

  connection.query(SELECT_PREF, (err, results) => {
    if(err) {
      return res.send(err);
    } else {
      const grabUser = results.find(ele => ele['Email']===email);

      let userPref = JSON.parse(grabUser["UserPreferences"]);
      if(userPref === null || userPref === undefined) {
        userPref = [];
        connection.query(`UPDATE UserBase SET UserPreferences = '[]' WHERE Email = '${email}'`);
      }
      userPref.push(jsonPref);

      // const INSERT_PREF = `INSERT INTO UserBase (UserPreferences) VALUES('${JSON.stringify(userPref)}')`;
      const UPDATE_PREF = `UPDATE UserBase SET UserPreferences = '${JSON.stringify(userPref)}' WHERE Email = '${email}'`;
      connection.query(UPDATE_PREF);
      // connection.query(INSERT_PREF);
      return res.send("Success");
    }
  });

});

app2.get('/getPref', (req, res) => {
  //query recipe title and href
  const { email } = req.query;

  connection.query(SELECT_PREF, (err, results) => {
    if(err) {
      return res.send(err);
    } else {
      const grabUser = results.find(ele => ele['Email']===email);
      
      if(grabUser === undefined || grabUser === null) {
        return res.send([]); 
      }
      
      return res.send(grabUser["UserPreferences"]);
    }
  });

});

app2.get('/getName', (req, res) => {
    const { email } = req.query;

    connection.query(SELECT_NAMES, (err, results) => {
        
        if (err) {
            return res.send(err);
        }

        const grabUser = results.find(ele => ele['Email']===email);

        if (grabUser === undefined || grabUser === null) {
            return res.send("FAILED");
        }

        return res.send(grabUser["Name"]);
    });
});

app2.get('/removePref', (req, res) => {
  const { email, href } = req.query;

  connection.query(SELECT_PREF, (err, results) => {
    if(err) {
      return res.send(err);
    } else {
      const grabUser = results.find(ele => ele['Email'] === email);
      if(grabUser === null || grabUser === undefined) return res.send("Failure to find UserPref");

      let userPref = JSON.parse(grabUser["UserPreferences"]); 

      userPref = userPref.filter(ele => ele["href"] !== href);
    
      const UPDATE_PREF = `UPDATE UserBase SET UserPreferences = '${JSON.stringify(userPref)}' WHERE Email = '${email}'`;
      connection.query(UPDATE_PREF);

      return res.send("Success!");
    }
  });

});

//setName
app2.get('/setName', (req, res) => {
    const { email, name } = req.query;

    const UPDATE_EMAIL = `UPDATE UserBase SET Name = '${name}' WHERE Email = '${email}'`;

    connection.query(UPDATE_EMAIL, (err, results) => {
        if (err) {
            return res.send(false);
        }
        return res.send(true);
    });

});

//setEmail
app2.get('/setEmail', (req, res) => {
    const { email, prevEmail } = req.query;

    const UPDATE_EMAIL = `UPDATE UserBase SET Email = '${email}' WHERE Email = '${prevEmail}'`;

    connection.query(SELECT_USERS, (err, results) => {
        
        const grabUser = results.find(ele => ele['Email']===email);

        if (err || grabUser !== undefined) {
            return res.send(false);
        }

        connection.query(UPDATE_EMAIL);

        return res.send(true);
    });

});

//setPassword
app2.get('/setPassword', (req, res) => {
    const { email, oldPassword, newPassword } = req.query;

    const hashedNew = hash(newPassword);
    // const hashedOld = hash(oldPassword);

    const GET_PASSWORD = '';
    const UPDATE_PASSWORD = `UPDATE UserBase SET Password = '${hashedNew}' WHERE Email = '${email}'`;

    connection.query(SELECT_USERS, (err, results) => {
        if (err) {
            return res.send(err);
        }

        const grabUser = results.find(ele => ele['Email']===email);

        if (grabUser !== undefined) {
            const comparison = bcrypt.compareSync(oldPassword, grabUser['Password']);
            //true
            if (comparison) {
                connection.query(UPDATE_PASSWORD);
                return res.send(true);
            }

        }

        return res.send(false);
    });

});


//Hash password using bcrypt 
const hash = (password, saltRounds = 10) => {
  try {
      // create salt
      const salt = bcrypt.genSaltSync(saltRounds);

      // Hash
      return bcrypt.hashSync(password, salt);
  } catch (error) {
      console.log(error);
  }
  
  return null;
}


connection.connect(err => {
  if(err) {
    return err;
  }
});