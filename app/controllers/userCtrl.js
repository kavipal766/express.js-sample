var User = require('../models/user.js');
var Provider = require('../models/provider.js');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const request = require('request');
const saltRounds = 10;
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var async = require('async');
var common = require('../../config/common');
var cloudinary = require('cloudinary');
var config = require('../../config/config');
var dataob = config.db;


// var supportEmailIdService = common.supportEmailIdService;
// console.log("emailidservices"+supportEmailIdService);
var transporter = nodemailer.createTransport({
  service: common.supportEmailIdService,
  auth: {
    user: common.supportEmailId,
    pass: common.supportEmailIdpass
  }
});
cloudinary.config({
  cloud_name: common.cloud_name,
  api_key: common.api_key,
  api_secret: common.api_secret
});

module.exports = {
  registrationUser: (req,res)=>{
  if(!req.body.name || !req.body.password || !req.body.confirmpassword || !req.body.email)
    {
    return  res.json({status:400,responseMessage:"please fill all fields."});
    }
  if(req.body.password != req.body.confirmpassword )
  {
  return  res.json({status:400,responseMessage:"password and confirmpassword are not match"});
    }
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.confirmpassword, salt,null, function(err, hash) {
                if(err){
        console.log("error||||"+err);
        return res.json({
          "message": "Error to create New Trader",
          statusCode: 400
        });
      }
      else  {
        var hash12 = hash;
        console.log("hashcode"+hash);
          }
          console.log("hashcode|||||||||||||||||||||||||"+hash12);

  console.log("hashcode12344141414414"+hash12);
  var obj = req.body;
console.log("body part"+JSON.stringify(obj));
User.create(obj,(err,result)=> {
  console.log("error|||||||||||"+err);
               if (err) {
                 console.log("Error to Create New trader !!!",err);
                 return res.json({
                   "message": "Error to create New Trader",
                   statusCode: 400
                 });
               }
               else if (result) {
          console.log("USEr Create Succesfully...........");
               return res.json({
                 "message": "user create successfully!!!",
                 statusCode: 200
               })
             }

})
  });
  });
},
  functionupdate: (req,res,)=>{
    if(!req.body._id || !req.body.oldpassword || !req.body.newpassword || !req.body.confirmnewpassword){
    return res.status(400).send({msg:"Please provide the complete details"})
    } else if(newpassword !== confirmnewpassword) {
      return  res.status(400).send({msg:"Password and confirm password do not match"})
    } else {
      console.log("find||||||||||||||||||||||||");
        User.findOne({ _id :req.body._id}, function (err,data) {
          console.log("data"+data);
            if(err){
              console.log("error||||||||"+err);
              return   res.status(400).send({msg:err});
            }else if(data){
              // console.log("password||||"+data.password;);
              var hashpass = data.password;
              console.log("password||||"+hashpass+oldPassword);
              bcrypt.compare(req.body.oldpassword, hashpass, function(err,res) {
                console.log("error is"+err);
                if(err){
                  console.log("error is ||||"+err);
                  if(err == undefined ){
                    return res.json({
                      "message": "error",
                      statusCode: 200
                    })                }
                }
                else
                {
                if(res){
                  console.log("response||||||"+res);
                  bcrypt.genSalt(saltRounds, function(err, salt) {
                      bcrypt.hash(req.body.confirmnewpassword, salt,null, function(err, hash){
                                           if (err){
console.log("error is"+err);
                return   res.status(400).send({msg:'22222'+err});
}
else if (hash) {
  console.log("new encrypt password"+hash);
                    var password = hash;
                    console.log("password||||"+password);
                    User.update({
                        _id:_id
                      }, {
                        password: password
                      })
                      .exec(function(err, updatedUser) {
                        if (err) {
                          return res.json({
                            "message": "Error to update passoword!",
                            statusCode: 401
                          });
                        }
                        console.log("Update current passoword succesfully!!!"+JSON.stringify(updatedUser));
                        return res.json({
                          "message": "Your passoword updated succesfully",
                          statusCode: 200
                        });
                      });
                  }
                });
              });
    }
}
});
}
});
}
},
providerUser: (req,res)=>{
  console.log("provider is creating|||||||||||||||");
  if(!req.body.name || !req.body.password || !req.body.confirmpassword || !req.body.email || !req.body.userid)
  {
  return  res.json({status:400,responseMessage:"please fill all fields."});
  }
if(req.body.password !=req.body.confirmpassword )
{
return  res.json({status:400,responseMessage:"password and confirmpassword are not match"});
  }
  bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.confirmpassword , salt,null, function(err, hash) {
              if(err){
      console.log("error||||"+err);
      return res.handler({
        "message": "Error to create New Trader",
        statusCode: 400
      });
    }
    else  {
      console.log("hashcode"+hash);
      var hash12 = hash;
        }
var obj = req.body;
console.log("login detail"+obj);
Provider.create(obj,(err,result)=> {
               if (err) {
                 console.log("Error to Create New trader !!!",err);
                 return res.json({
                   "message": "Error to create New Trader"+err,
                   statusCode: 400
                 });
               }
               else if(result){
               console.log("USEr Create Succesfully...........");
               return res.json({
                 "message": "We sent OTP on your email address please verify email!!!",
                 statusCode: 200
               })
             }

})
});
});
},
find: (req,res)=>{
async.concat([User,Provider],function(model,callback) {
  // Get the last 10 results from each collection
  var query = model.find({}).sort({ "creationDate": -1 }).limit(10);
  query.exec(function(err,docs) {
    if (err) throw err;
    callback(err,docs);
  });
},
function(err,result) {
  if (err) throw err;
  // results are merged, now sort by date
  result = result.sort(function(a,b) {
    return (a.creationDate < b.creationDate)
      ? 1 : (a.creationDate > b.creationDate) ? -1 : 0;
  });
  console.log(result);

});
},
finduserid: (req,res)=>{
  console.log("finding||||||||||||||||||||||||||||");
  Provider.find().
  populate('userid').
  exec(function(error,docs) {
    console.log("error"+error);
    if(error){
  console.log("error|||||||"+error)
  res.json({
    "msg":"error to find a data",
    statusCode:400
  })
}
else if (docs) {
  console.log(docs);
  res.json({
    "msg":"data find",
    statusCode:200
  })

}
   });

},
email: (req,res)=>{
  console.log("sending email");
  var mailOptions = {
            from:  common.supportEmailIdService,
            to: req.body.userEmailAddress,
            subject: 'Please verify email !!!',
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
              <html xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
              <head>
                <meta name="viewport" content="width=device-width" />
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>Actionable emails e.g. reset password</title>
                <style type="text/css">
                  img {
                    max-width: 100%;
                  }
                  body {
                    -webkit-font-smoothing: antialiased;
                    -webkit-text-size-adjust: none;
                    width: 100% !important;
                    height: 100%;
                    line-height: 1.6em;
                  }
                  body {
                    background-color: #f6f6f6;
                  }
                  @media only screen and (max-width: 640px) {
                    body {
                      padding: 0 !important;
                    }
                    h1 {
                      font-weight: 800 !important;
                      margin: 20px 0 5px !important;
                    }
                    h2 {
                      font-weight: 800 !important;
                      margin: 20px 0 5px !important;
                    }
                    h3 {
                      font-weight: 800 !important;
                      margin: 20px 0 5px !important;
                    }
                    h4 {
                      font-weight: 800 !important;
                      margin: 20px 0 5px !important;
                    }
                    h1 {
                      font-size: 22px !important;
                    }
                    h2 {
                      font-size: 18px !important;
                    }
                    h3 {
                      font-size: 16px !important;
                    }
                    .container {
                      padding: 0 !important;
                      width: 100% !important;
                    }
                    .content {
                      padding: 0 !important;
                    }
                    .content-wrap {
                      padding: 10px !important;
                    }
                    .invoice {
                      width: 100% !important;
                    }
                  }
                </style>
              </head>
              <body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;"
                bgcolor="#f6f6f6">
                <table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">
                  <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                    <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
                    <td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;"
                      valign="top">
                      <div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
                        <table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;"
                          bgcolor="#fff">
                          <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">
                              <meta itemprop="name" content="Confirm Email" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" />
                              <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                  <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                  </td>
                                </tr>
                                <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                  <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                    Dear trader,
                                  </td>
                                </tr>
                                <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                  <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                    Thank you for signing up with us. Please enter this otp to verify your Email.
                                  </td>
                                </tr>
                                <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                  <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                    Your OTP is : 12345
                                  </td>
                                </tr>
                                <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                  <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                    Kind Regards,
                                  </td>
                                </tr>
                                <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                  <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                    The BitWireMe Team
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">
                          <table width="100%" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                              <td class="aligncenter content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;" align="center"
                                valign="top">Follow <a href="http://twitter.com/bitwireme" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; color: #999; text-decoration: underline; margin: 0;">@Mail_Gun</a> on Twitter.</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </td>
                    <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
                  </tr>
                </table>
              </body>
              </html>`
          };
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.log("error|||||||||||"+error);
                res.json({
                  "msg":"error to send a email",
                  statusCode:400
                })
                }
                else if (info) {
                  console.log("info"+info);
                  res.json({
                    "msg":"info is send",
                    statusCode:200
                  })

                }
              });
            },
sendotp: (req,res)=>{
    var createNewOTP = Math.floor(100000 + Math.random() * 900000);
console.log("createNewOTP :: " + createNewOTP);
var mailOptions = {
  from: 'common.supportEmailIdService',
  to: req.body.email,
  subject: 'Please verify your email',
  text: 'Your otp to verify email ' + createNewOTP
};
transporter.sendMail(mailOptions, function(error, info) {
  if (error) {
    console.log(error);
    res.json({
      "msg":"error to send otp",
      statusCode:400
    })
  } else if (info) {
    console.log("info"+info);
    res.json({
      "msg":"otp is send",
      statusCode:200
    })
  }
});
},
uploadimage: (req,res)=>{
  let filePaths = req.body.filePaths;
cloudinary.v2.uploader.upload(filePaths).then((succes)=>res.json({responseCode:200,responseMessage:"image upload successfully"+JSON.stringify(succes)})
)
.catch((err)=>{
  console.log(err)
   res.json({responseCode:400,responseMessage:"Something went wrong."});
})

},
twilioVerify: (req,res)=>{
  var createNewOTP = Math.floor(100000 + Math.random() * 900000);
  console.log("otp"+createNewOTP);
client.messages
   .create({
      body: 'your otp is'+createNewOTP,
      from: '+14159410965',
      to: req.body.number
    })
   .then(message => console.log("msg send"+message.sid))
   .catch((error)=>console.log(error))
},
dynamicSChema: (req,res)=>
{
  var schema = req.body.Schemaname;
mongoose.connection.db.listCollections({"name":schema})
    .toArray(function(err, collinfo) {
        if (collinfo) {
        var data = collinfo[0];
         name = data.name;
        console.log("name"+name);
        delete req.body.Schemaname;
        var obj = req.body;
        var collectionName = db.collection(data.name);
        collectionName.save(obj).then((message) =>{ console.log("msg send"+message);
        return res.json({
          "msg":"your data is saved",
          statusCode:200
        })
      })
        .catch((error)=>console.log(error))

}
else if (err) {
  console.log("qqqq"+err);

}
})

}
}
