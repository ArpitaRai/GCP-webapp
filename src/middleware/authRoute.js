import User from "../models/user.js";
import auth from "basic-auth";
import { comparePassword } from "../utils/passwordUtils.js";

export const authRoute = async (req, res) => {
  console.log("Validating user authentication and access to the API");
  let status = 200;
  const user = await auth(req);
  console.log("user ::", user);
  const dbuser = await User.findOne({where: {userName: user.name}})
  if(dbuser){
    const passwordMatches = await comparePassword(dbuser.password, user.pass);
    //const userId = req.params.id;
    if(! passwordMatches){
      console.log("User authentication failed due to password mismatch");
      status = 401;
    }
    // else if(userId && userId != dbuser.id){
    //   logger.info("User doesn't have access to this API");
    //   status = 403;
    // }
  }
  else{
    console.log("User doesn't exists");
    status = 401;
    return status;
  }
  if(status === 200)
  console.log("User authenticated and validated the access to this API");
  return status;
};

export default authRoute;