import bcrypt from 'bcrypt';


export const comparePassword = (hashedPassword, password) => {
    let comparisonResult = bcrypt.compare(password, hashedPassword)
    console.log("Comparing passwords:"+ comparisonResult);
    return comparisonResult;
}