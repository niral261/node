const express = require('express');
const cors = require('cors');
const path = require("path");
const { connectToDB } = require('./connect');
const { restrictToLoggedInUserOnly, checkAuth } =  require("./middleware/auth");
const urlRouter = require('./routes/url');
const URL = require("./models/url");
const userRoute = require("./routes/user");
const cookieParser = require("cookie-parser");

const app = express();

// Connect to MongoDB
connectToDB("mongodb://0.0.0.0:27017/shortURL")
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get("/test", checkAuth, async (req, res) => {
    if(!req.user) return res.redirect('/login')
    const allurls = await URL.find({ createdBy: req.user._id});
    return res.render('home', { urls: allurls, user: req.user }); 
});

app.get('/signup', (req, res) => {
    return res.render("signup");
});

app.get('/login', (req, res) => {
    return res.render("login");
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
        email,
        password
    });
    if(!user) return res.render('login',{
        error: "Invalid username or password",
    })

    const token = setUser(user);
    res.cookie("uid", token);
    return res.redirect('/test');
});

app.use('/url', restrictToLoggedInUserOnly, urlRouter);
app.use("/user", userRoute);

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    try {
        const entry = await URL.findOneAndUpdate(
            { shortID: shortId },
            {
                $push: {
                    visitHistory: { timestamp: Date.now() }
                }
            },
            { new: true }
        );
        if (entry) {
            res.redirect(entry.redirectURL);
        } else {
            res.status(404).send("URL not found");
        }
    } catch (error) {
        console.error("Error redirecting:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Start the server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
