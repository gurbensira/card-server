import jwt from "jsonwebtoken";

const secretWord = "";

export const generateToken = (user) => {
    const token = jwt.sign(
        {
            _id: user._id,
            isBusiness: user.isBusiness,
            isAdmin: user.isAdmin,
        },
        secretWord,
        { expiresIn: '24h' }
    );
    return token;
};

export const verifyToken = (tokenFromClient) => {
    try {
        const userDataFromPayload = jwt.verify(tokenFromClient, secretWord);
        return userDataFromPayload;
    } catch (error) {
        return null;
    }
};




