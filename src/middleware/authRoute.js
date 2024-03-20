import User from "../models/user.js";
import auth from "basic-auth";
import { comparePassword } from "../utils/passwordUtils.js";
import logger from "../config/logger.js";

export const authRoute = async (req, res) => {
  logger.info("Validating user authentication and access to the API");
  let status = 200;
  const user = await auth(req);
  const dbuser = await User.findOne({where: {username: user.name}})
  if(dbuser){
    const passwordMatches = await comparePassword(dbuser.password, user.pass);
    if(! passwordMatches){
      logger.error("User authentication failed due to password mismatch");
      status = 401;
    }
    // else if(userId && userId != dbuser.id){
    //   logger.info("User doesn't have access to this API");
    //   status = 403;
    // }
  }
  else{
    logger.error("User doesn't exist");
    status = 401;
    return status;
  }
  if(status === 200)
  logger.info("User authenticated and validated access to this API");
  return status;
};

export default authRoute;