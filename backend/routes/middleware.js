const axios = require('axios');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.middleware = (req, res, next) => {
    
    if(!req.headers.authorization) {
        return res.status(401).json({ error: "Dont have token" })
    }
    
    const profileOptions = {
        headers: {
            Authorization: req.headers.authorization,
        },
    };
    axios.get("https://www.mycourseville.com/api/v1/public/users/me", profileOptions).then(profileRes => {
        console.log(req.user_id = profileRes.data.user.id)
        next()
    }).catch((err) => {
        console.log(err);
        res.status(401).json({ error: "Unauthorize" })
    })
}
