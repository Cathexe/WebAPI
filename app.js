const express = require("express")
const path = require("path")

const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const app = express();
const port = process.env.port||3000;

const Songs = require("./models/Songs")
const User = require("./models/Users")

const session = require("express-session")
const bcrypt = require("bcrypt")

app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, "public")))

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false}
}));

function isAuthenticated(req,res, next){
    if(req.session.user)return next();
    return res.redirect("/login");
}

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", ()=>{
    console.log("Connected to MongoDB Database");
});

app.get("/register", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "html/register.html"));
})

app.post("/register", async (req, res) => {
    try{
        const {username, password, email} = req.body;

        const existingUser = await User.findOne({username});

        if(existingUser){
            return res.send("Username already taken. Try a different one")
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({username, password:hashedPassword, email});
        await newUser.save();

        res.redirect("/login");

    }catch(err){
        res.status(500).send("Error registering new user.");
    }
});


app.get("/songs", async (req, res)=>{
    try{
        const songs = await Songs.find();
        res.json(songs);
        console.log(songs);
    }catch(err){
        res.status(500).json({error:"Failed to get songs."});
    }
});

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "html/mainReg.html"))
})

app.get("/songList", isAuthenticated,(req,res)=>{
    res.sendFile(path.join(__dirname, "public", "html/main.html"))
})

app.get("/logIn", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "html/logIn.html"))
})

app.get("/addtolist", (req,res)=>{
    res.sendFile(path.join(__dirname,"public", "html/addList.html"))
})

app.post("/addtolist", async (req,res)=>{
    try{
        const newSong = new Songs(req.body)
        const saveSong = await newSong.save()
        res.redirect("/")
        console.log(saveSong)
    }catch(err){
        res.status(501).json({error:"Failed to add new Song."});
    }
})

app.delete("/songs/:id", async (req, res) => {
    try {
        const deleteSong = await Songs.findOneAndDelete({ _id: req.params.id });
        if (!deleteSong) {
            return res.status(404).json({ error: "Song not found" });
        }

        res.json({ message: "Song deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/songs/:id", async (req, res) => {
    try {
        const song = await Songs.findById(req.params.id);
        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }
        res.json(song);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch song" });
    }
});

app.put("/updatesongs/:id", async (req, res) => {
    try {
        const updatedSong = await Songs.findByIdAndUpdate(
            req.params.id, 
            { songName: req.body.songName, artist: req.body.artist }, 
            { new: true } 
        );

        if (!updatedSong) {
            return res.status(404).json({ error: "Song not found" });
        }

        res.json(updatedSong);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update song" });
    }
});

app.get("/edit/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "edit.html"));
});

app.post("/login", async (req,res)=>{
    const {username, password} = req.body;
    console.log(req.body);

    const user = await User.findOne({username});

    if(user && bcrypt.compareSync(password, user.password)){
        req.session.user = username;
        return res.redirect("/songList");
    }
    req.session.error = "Invalid User";
    return res.redirect("/login")
});

app.get("/logout", (req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/login");
    })
});


app.listen(port, function(){
    console.log(`Server is running on port: ${port}`)
});