const express       = require("express")
const cors          = require("cors")
const bodyParser    = require("body-parser")
const fs            = require("fs")

const config        = require("./config/config")
const login         = require("./routes/login")
const verify        = require("./app/api/middlewares/verification")
const project       = require("./routes/projects")
const category      = require("./routes/categories")
const role          = require("./routes/roles")
const user          = require("./routes/users")
const drawing       = require("./routes/drawings")

global.user_info = null

const app   = express()

app.use(cors({
    origin: ["http://192.168.1.81:4000","http://192.168.1.128:4000"],
    exposedHeaders: ["Authorization"],
    credentials: true,
    methods: ["GET","POST","PUT"]
}))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: true
}))

// app.use('/uploads', express.static('uploads'))

const PORT  = config.PORT || 3000
const ENV   = config.ENV

app.listen(PORT, () => {
    console.log(ENV + " server is up and running on " + PORT + " port.")
})

app.get("/", (req , res) => {
    res.send('Welcome to the Drawing Archive REST API server')
})

app.use("/login", login)

app.use("/project", verify.tokenAuth, project)

app.use("/category", verify.tokenAuth, category)

app.use("/role", verify.tokenAuth, role)

app.use("/user", verify.tokenAuth, user)

app.use("/drawing", verify.tokenAuth, drawing)

app.use((err, req, res, next) => {
    const logErrorMessage = `
    Error: ${err.message}
    Method: ${req.method}
    URL: ${req.originalUrl}
    Date & Time: ${new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString()}
    Stack: ${err.stack}

    ------------------------------------------------------------------------------------------------------------`
    fs.appendFile(__dirname+"/logs/"+config.ERROR_LOG_FILE, logErrorMessage, (fsErr) => {
        if(fsErr) {
            console.error("Failed to write to log file: ", fsErr)
        }
    })
    res.json({status: "error", message: "Internal server error"})
})