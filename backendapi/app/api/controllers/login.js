const pool      = require("../../../config/database")
const config    = require("../../../config/config")
const bcrypt    = require("bcrypt")
const jwt       = require("jsonwebtoken")

module.exports = {
    authenticate: (req, res, next) => {
        pool.getConnection((err, connection) => {
            if(err) {
                next(err)
            }
            
            connection.query("SELECT u.id as user_id, u.name as user_name, u.email as user_email, u.password as user_password, u.is_admin as is_admin_user, u.can_view_drawings as user_can_view_drawings, u.can_add_drawings as user_can_add_drawings, u.can_modify_drawings as user_can_modify_drawings, u.can_download_drawings as user_can_download_drawings, r.name as user_role_name FROM tbl_users u LEFT JOIN tbl_mst_roles r ON u.role_id=r.id WHERE u.email="+connection.escape(req.body.username)+" AND u.is_active='Y' AND u.is_delete='N'", (err, userInfo) => {
                connection.release()
                if(err) {
                    next(err)
                }
                else if(userInfo.length) {
                    userInfo = userInfo[0]
                    if(bcrypt.compareSync(req.body.password, userInfo.user_password)) {
                        const accessToken = jwt.sign({ id: userInfo.user_id }, config.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: config.ACCESS_TOKEN_EXPIRES_IN })
                        res.header('Authorization', accessToken).json({
                            status: 'success',
                            message: 'Valid user',
                            data: {
                                user_name: userInfo.user_name,
                                user_email: userInfo.user_email,
                                is_admin_user: userInfo.is_admin_user,
                                user_can_view_drawings: userInfo.user_can_view_drawings,
                                user_can_add_drawings: userInfo.user_can_add_drawings,
                                user_can_modify_drawings: userInfo.user_can_modify_drawings,
                                user_can_download_drawings: userInfo.user_can_download_drawings,
                                user_role_name: userInfo.user_role_name || "Admin"
                            }
                        })
                    }
                    else {
                        res.json({status: 'error', message: 'Invalid user'})
                    }
                }
                else {
                    res.json({status: 'error', message: 'Invalid user'})
                }
            })
        })
    }
}