const checkAdmin = (req, res, next) => {
    const {user_data} = req
    // Assuming req.user is already populated (e.g., from an authentication middleware)
    if (user_data.role === 'Admin') {
        return next(); // Allow access if the user is an Admin
    }
    return res.status(403).json({ message: 'Access forbidden: Admins only' });
};

const checkHost = (req, res, next) => {
    const {user_data} = req
    if (user_data.role === 'Host') {
        return next(); // Allow access if the user is a Host
    }
    return res.status(403).json({ message: 'Access forbidden: Hosts only' });
};

module.exports = {
    checkAdmin,
    checkHost
};