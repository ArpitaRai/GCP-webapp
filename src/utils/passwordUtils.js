import bcrypt from 'bcrypt';
import logger from '../config/logger.js';


export const comparePassword = (hashedPassword, password) => {
    let comparisonResult = bcrypt.compare(password, hashedPassword)
    logger.info("Comparing passwords:"+ comparisonResult);
    return comparisonResult;
}