// src/utils/checkAuth.js
import { jwtDecode } from "jwt-decode"; // Corrected the import to use the named export

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decodedToken = jwtDecode(token); // Decode the token
    const expiryTime = decodedToken.exp * 1000; // Token expiry is usually in seconds, convert to ms
    return expiryTime < Date.now(); // Return true if token is expired
  } catch (error) {
    console.error("Error decoding token", error);
    return true; // Return true in case of error (e.g., invalid token)
  }
};
