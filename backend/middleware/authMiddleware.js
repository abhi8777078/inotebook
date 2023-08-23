const jwt = require('jsonwebtoken');// for token
const jwt_secure = 'mynameisabhi'; //for token 

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('auth-token');
        if (!token) {
            return res.send({
                success: false,
                message: 'Invalide token !'
            })
        }
        const data = jwt.verify(token, jwt_secure);
        req.user = data.user
        next()
    }
    catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Error in auth middleware'
        })
    }

}
module.exports = authMiddleware;