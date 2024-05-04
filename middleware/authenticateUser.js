const authenticateUser = (req, res, next) => {
    // Your authentication logic here
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/');
    }
};

module.exports = authenticateUser;
