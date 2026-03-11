import jwt from "jsonwebtoken";

//Function to generate a token for a user
const generateToken = (userID) => {
    const token = jwt.sign( //so amra userId ta ke type of "encode" kore ekta token banabo using jwt secret
        {userID},
        process.env.JWT_SECRET
    );
    return token;
}

export default generateToken