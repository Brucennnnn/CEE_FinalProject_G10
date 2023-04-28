const axios = require('axios');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.middleware = async (req, res, next) => {
    // if(!req.headers.authorization) {
    //     return res.status(401).json({ error: "Dont have token" })
    // }
    try {
        const profileOptions = {
            headers: {
                Authorization: `Bearer ${req.session.token.access_token}`,
            },
        };
        const user = await axios.get("https://www.mycourseville.com/api/v1/public/users/me", profileOptions)
        if (user !== null) {
            req.user_id = user.data.user.id
            next();
        }
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" })
    }
}
