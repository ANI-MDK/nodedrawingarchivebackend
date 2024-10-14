const express       = require("express")
const cors          = require("cors")
const bodyParser    = require("body-parser")

const config        = require("./config/config")
const pool          = require("./config/database")

const login         = require("./routes/login")
const verify        = require("./app/api/middlewares/verification")
const location      = require("./routes/locations")
const project       = require("./routes/projects")
const category      = require("./routes/categories")
const role          = require("./routes/roles")
const user          = require("./routes/users")

global.user_info = null

const app   = express()

app.use(cors({
    origin: ["http://192.168.1.81:4000"],
    exposedHeaders: ["Authorization"],
    credentials: true,
    methods: ["GET","POST","PUT"]
}))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: true
}))

const PORT  = config.PORT || 3000
const ENV   = config.ENV

app.listen(PORT, () => {
    console.log(ENV + " server is up and running on " + PORT + " port.")
})

pool.getConnection((err, connection) => {
    connection.release()
    if(err) {
        throw err;
    }
    else {
        console.log("Connected to MySQL 8.0 Server!")

        // connection.query("SELECT u.id as user_id, u.name as user_name, u.email as user_email, u.password as user_password, u.is_admin as is_admin_user, u.can_view_drawings as user_can_view_drawings, u.can_add_drawings as user_can_add_drawings, u.can_modify_drawings as user_can_modify_drawings, u.can_download_drawings as user_can_download_drawings, r.name as user_role_name FROM tbl_users u LEFT JOIN tbl_mst_roles r ON u.role_id=r.id WHERE u.email='admin@dril.net.in' AND u.is_active='Y' AND u.is_delete='N'", (err, userInfo) => {
        //     if(err) {
        //         throw err;
        //     }
        //     else {
        //         console.log(userInfo)
        //         console.log(userInfo[0])
        //     }
        // })
    }
})

app.get("/", (req , res) => {
    res.send('Welcome to the Drawing Archive REST API server')
})

app.use("/login", login)

app.use("/location", verify.tokenAuth, location)

app.use("/project", verify.tokenAuth, project)

app.use("/category", verify.tokenAuth, category)

app.use("/role", verify.tokenAuth, role)

app.use("/user", verify.tokenAuth, user)

app.use((req, res, next) => {
    let err = new Error('Not found')
    err.status = 404
    next(err)
})

app.use((err, req, res) => {
    if(err.status === 404)
        res.status(404).json({message:err})
    else
        res.status(500).json({message:'Something looks wrong - '+err})
})