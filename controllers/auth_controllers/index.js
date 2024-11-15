const { JOI_Validations } = require("../../services/joi_services");
const { Bcrypt_Service } = require("../../services/bcrypt_services");
const { User_Auth_Schema } = require("../../models/user_auth_model");
const User_DTO = require("../../dto/user_dto");
const { JWT_Generate_Token_Handle } = require("../../services/jwt_services");
const Auth_Token_DTO = require("../../dto/auth_tokens_dto");
const { User_Tokens_Schema } = require("../../models/user_tokens_model");
const { generateOtp } = require("../../utils/generate_OTP");
const {sendverficationCode, forgotOtp} = require("../../utils/email");
const verifyEmailSchema = require("../../models/verification/verifyEmailTokenSchema");
const { Verifications } = require("../../models/verification")
const twilioClient = require('../../config/twilioConfig');
// const googleClient = require('../../config/googleConfig');

//test


const register_user = async (req, res, next) => {
  const { body} = req;
  try {
    const {
      email,
      password,
      phonenumber,
      first_name,
      last_name,
      role,
      status,
      send_promotions
    } = body;

      if(!email || !password || !phonenumber || !role || !first_name || !last_name || !status)
      {
        console.log(email,password,phonenumber,role,first_name,last_name,status)
        return res.status(401).json({message:'Fill the required fields'})
      }
      
    const codes = {emcode: Math.floor(100 + Math.random() * 900), mocode: Math.floor(100 + Math.random() * 900) }
 

    const is_email_exist = await User_Auth_Schema.exists({ email });
    if (is_email_exist) {
      const error = {
        status: 409,
        message: "User is already exist with this email!",
      };
      return next(error);
    }
    const secure_password = await Bcrypt_Service.bcrypt_hash_password(password);
    const store_user_data = {
      email,
      password: secure_password,
      phonenumber,
      first_name,
      last_name,
      send_promotions,
      role,
      status
    };
    // return res.json({msg:true})
    const save_user = await User_Auth_Schema.create({
      ...store_user_data,
    });
    if(save_user)
    {
      let sv_email_code = await Verifications.create({
        user_id:save_user._id, type:'Email',code:codes.emcode
      })
      let sv_mobile_code = await Verifications.create({
        user_id:save_user._id, type:'Number',code:codes.mocode
      })
      let send_email_code = await sendverficationCode(save_user.email, codes.emcode,codes.mocode)
      // let verificationCodeStatus = await twilioClient.messages.create({
      //   body: `Your verification code is ${codes.mocode}`,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: save_user.phonenumber
      // });

    }
    const user_dto = new User_DTO(save_user);

    const generate_tokens = await JWT_Generate_Token_Handle.save_user_tokens(
      user_dto._id
    );

    const save_tokens = await User_Tokens_Schema.create({
      ...generate_tokens,
      user_id: user_dto._id,
    });

    const tokens_dto = new Auth_Token_DTO(save_tokens);

    const send_data = {
      ...user_dto
    };

    return res.json({
      message: "Registered successfully!",
      data: send_data,
      tokens: tokens_dto,
      codes:codes
    });
  } catch (error) {
    return next(error);
  }
};
// ============= Verfi User ============ //

const verfiyUser = async (req, res) => {
  const { emcode,mocode } = req.body
  const {user_id} = req
  if(!emcode || !mocode)
  {
    return res.json({message:"No code found",status:401})
  }

  let emailVer = await Verifications.findOne({user_id:user_id, type:'Email', code:emcode})
  let numVer = await Verifications.findOne({user_id:user_id,type:'Number',code:mocode})
  if(emailVer && numVer)
  {
    var user = await User_Auth_Schema.findById(user_id)
    user.number_verified = true
    user.email_verified = true
    user.save()
    await Verifications.deleteMany({ user_id: user_id });
    return res.status(200).json({message:"Verified Successfully!"})
  }
  else
  {
    return res.status(401).json({message:"Verification Failed!"})
  }

}
//============ Resend Verifications ===========//

const resendCodes = async (req,res,next)=>{
  const {user_id, user_data} = req
  try {
    const codes = {emcode: Math.floor(100 + Math.random() * 900), mocode: Math.floor(100 + Math.random() * 900) }
    let sv_email_code = await Verifications.create({
      user_id:user_id, type:'Email',code:codes.emcode
    })
    let sv_mobile_code = await Verifications.create({
      user_id:user_id, type:'Number',code:codes.mocode
    })
    let send_email_code = await sendverficationCode(user_data.email, codes.emcode)
    // let verificationCodeStatus = await twilioClient.messages.create({
    //   body: `Your verification code is ${codes.mocode}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: save_user.phonenumber
    // });
    return res.status(200).json({
      message: "Code Sent successfully!",
      codes:codes
    });
  } catch (error) {
    return next(error);
  }
}
// ============= Login   ================ //
const login_user = async (req, res, next) => {
  const { body } = req;
  // console.log(body)
  // return res.status(200).json(body)
  try {
    const { email, password , role} = body;
    // 2. if error in validation -> return error via middleware
    const validation_error = JOI_Validations.user_login_joi_validation(body);
    if (validation_error) {
      return next(validation_error);
    }
    const find_user = await User_Auth_Schema.findOne({ email , role});
    if (!find_user) {
      const error = {
        status: 401,
        message: "Invalid credentials!",
      };
      return next(error);
    }

 
    const compare_password = await Bcrypt_Service.bcrypt_compare_password(
      password,
      find_user.password
    );

    if (!compare_password) {
      const error = {
        status: 401,
        message: "Invalid credentials!",
      };
      return next(error);
    }

    const user_dto = new User_DTO(find_user);

    const generate_tokens = await JWT_Generate_Token_Handle.save_user_tokens(
      user_dto._id
    );

    const save_tokens = await User_Tokens_Schema.create({
      ...generate_tokens,
      user_id: user_dto._id,

    });
    const obj = {
      ...find_user

    };

    const tokens_dto = new Auth_Token_DTO(save_tokens);

    return res.json({
      message: "logged in successfully!",
      data: find_user,
      tokens: tokens_dto,
    });
  } catch (error) {
    return next(error);
  }
};

const check_auth_controller = async (req, res, next) => {
  const { body, user_data, user_id, token_id } = req;
  try {
    const nuser = await User_Auth_Schema.findOne({ _id: user_id }).select('-password');
    if(!nuser)
    {
      return res.status(200).json({ success: false, message: 'No User Found' });
    }
    return res.status(200).json({ success: true, data: nuser });
  } catch (error) {
    return next(error);
  }
};


// ============= Reset Password Section Start   ================ //

const reset_user_password_request = async (req, res, next) => {
  const { email } = req.body;

  try {
    const find_user = await User_Auth_Schema.findOne({ email }).select(
      "-password"
    );

    if (!find_user) {
      return res
        .status(401)
        .send({ success: false, message: "No user found!" });
    }
    const OTP = generateOtp();
    console.log(OTP);
    await forgotOtp(email, OTP);
    const varificationtoken = await verifyEmailSchema.create({
      user: find_user._id,
      OTP: OTP,
    });

    return res.json({
      success: true,
      message: "Email successfully sent with verification OTP!",
      data: email,
      otp:OTP
    });
  } catch (error) {
    return next(error);
  }
};

const verify_reset_password_OTP = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const find_user = await User_Auth_Schema.findOne({ email }).select(
      "-password"
    );

    if (!find_user) {
      return res
        .status(401)
        .send({ success: false, message: "No user found!" });
    }

    const find_token = await verifyEmailSchema.findOne({
      user: find_user._id,
      OTP: otp.toString(),
    });

    if (!find_token) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid OTP or email!" });
    }

    let obj = {
      email,
      otp,
    };
    // await verifyEmailModel.findByIdAndDelete(find_token.id)
    return res.json({
      success: true,
      message: "OTP Successfully verified!",
      data: obj,
    });
  } catch (error) {
    return next(error);
  }
};

const verify_OTP_and_create_password = async (req, res, next) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  try {
    const find_user = await User_Auth_Schema.findOne({ email }).select(
      "-password"
    );

    if (!find_user) {
      return res
        .status(401)
        .send({ success: false, message: "No user found!" });
    }

    if (!newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }
    const find_token = await verifyEmailSchema.findOne({
      user: find_user._id,
      OTP: otp.toString(),
    });

    if (!find_token) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid OTP or email!" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "new password and confirm password are not same!",
      });
    }

    // const salt = await bcrypt.genSalt(10)
    // const secPass = await bcrypt.hash(newPassword, salt)

    const updated_password = await Bcrypt_Service.bcrypt_hash_password(
      newPassword
    );

    const updated_pass = await User_Auth_Schema.findByIdAndUpdate(
      find_user.id,
      { password: updated_password },
      { new: true }
    );
    await verifyEmailSchema.findByIdAndDelete(find_token.id);

    return res.json({
      success: true,
      message: "Password successfully updated!",
    });
  } catch (error) {
    return next(error);
  }
};

const renew_token_controller = async (req, res) => {
  const { user_data, user_id, token_id } = req;

  const generate_tokens = await JWT_Generate_Token_Handle.save_user_tokens(
    user_id
  );

  const update_token_record = await User_Tokens_Schema.findByIdAndUpdate(
    token_id,
    { ...generate_tokens },
    { new: true }
  );

  const tokens_dto = new Auth_Token_DTO(update_token_record);

  return res.status(200).json({ success: true, tokens: tokens_dto });
};



const logout_controller = async (req, res, next) => {
  const { body, user_data, user_id, token_id } = req;

  try {
    await User_Tokens_Schema.findByIdAndDelete(token_id);
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req,res) => {
  const { user_id,body } = req;
  const { current_password,new_password } = req.body;
  const user = await User_Auth_Schema.findById(user_id);
  if(!user){
    return res.status(400).json({success:false,message:"User not found"})
    }
  if(!user.password)
  {
    return res.status(400).json({success:false,message:"User current password is not set. Either you've signed up from google kindly secure your account by setting up a password"})
  }
  const compare_password = await Bcrypt_Service.bcrypt_compare_password(
    current_password,
    user.password
  );

  if (!compare_password) {
    return res.status(401).json({success:false,message:"Current Password is not correct"})
  }

  const secure_password = await Bcrypt_Service.bcrypt_hash_password(new_password);
  user.password = secure_password;
  await user.save();
  return res.status(200).json({success:true,message:"Password reset successfully"})
}


const kycVerification = async (req, res, next) => {
  const { user_id } = req; // Extract user_id from request
  const {
    avatar,
    email_notifications,
    number_notifications,
    transmission,
    driving_license,
    id_card,
    insurance_card,
    registration_card
  } = req.body; // Extract fields from the body

  if(!avatar || !driving_license)
  {
    return res.status(400).json({message:'Avatar and Driving License are required for KYC verification',success:false})

  }

  try {
    // Find the user by ID
    var user = await User_Auth_Schema.findById(user_id);

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the fields if they exist in the request body
    user.avatar = avatar || user.avatar;
    user.email_notifications = email_notifications || user.email_notifications;
    user.number_notifications = number_notifications || user.number_notifications;
    user.transmission = transmission || user.transmission;
    user.driving_license = driving_license || user.driving_license;
    user.id_card = id_card || user.id_card;
    user.insurance_card = insurance_card || user.insurance_card;
    user.registration_card = registration_card || user.registration_card;

    // Check if any required field is missing and set the KYC status accordingly
    if (
      !user.avatar ||
      !user.transmission ||
      !user.driving_license ||
      !user.id_card ||
      !user.insurance_card ||
      !user.registration_card
    ) {
      user.kyc = 'Pending';
    } else {
      user.kyc = 'Completed';
    }

    // Save the updated user data to the database
    await user.save();

    // Return the updated user data
    return res.status(200).json({ message: "KYC updated successfully", user });
  } catch (error) {
    // Pass any error to the error handler middleware
    return next(error);
  }
};

const getProfile = async(req,res)=>{
  const {user_id} = req
  try {
    const user = await User_Auth_Schema.findById(user_id).select('-password')
    if (!user) {
      return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "User profile retrieved successfully", user });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
    
  }
}

module.exports = {
  register_user,
  login_user,
  check_auth_controller,
  renew_token_controller,
  logout_controller,
  reset_user_password_request,
  verify_OTP_and_create_password,
  verify_reset_password_OTP,
  verfiyUser,
  resetPassword,
  resendCodes,
  kycVerification,
  getProfile

};
