/*--------------------Middleware--------------------*/
// Authenticate User
app.set("superSecret", config.secret); // Secret variable

const authenticate = (req, res, next) => {

    // Check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    // Decode token
    if (token) {

        // Verifies secret and checks exp
        jwt.verify(token, app.get("superSecret"), (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: "Unauthorised"
                });

            } else {
                // If everything is good, save to request for use in other routes
                req.decoded = decoded;
                return next();
            }
        });

    } else {

        // If there is no token
        // Return an error
        return res.status(401).send({
            success: false,
            message: "Unauthorised"
        });

    }
};

// Logging
// Create a rotating write stream 
const accessLogStream = rfs("access.log", {
  interval: "7d", // Rotate weekly 
  path: __dirname,
  compress: true
});

// Don't show the log when it is test
if (config.util.getEnv("NODE_ENV") !== "test") {
  // Use morgan to log requests to the log file
  app.use(morgan("combined", { stream: accessLogStream }));
  // Use morgan to log requests to the console
  app.use(morgan("dev"));
}

// Body parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/json" }));

// Use compression middleware
app.use(compression());

// CORS (for browser issues)
const cors = require("cors");
app.use(cors({
    methods: ["POST", "GET", "PUT"],
    allowedHeaders: ["Content-Type", "x-access-token"]
}));
