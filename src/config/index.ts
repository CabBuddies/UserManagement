if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
} 
  
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;


export {
    PORT,
    MONGO_URI,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
};