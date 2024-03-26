import crypto from 'crypto';

// Function to generate a random verification token
function generateVerificationToken() {
  return crypto.randomBytes(20).toString('hex'); // Generates a random token of length 40 characters
}

export default generateVerificationToken;

