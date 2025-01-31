const express = require("express")
const path = require("path")

const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const app = express();
const port = 3000

const Songs = require("./models/Songs")

app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")))

const mongoURI = "mongodb://localhost:27017/webAPI";
mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", ()=>{
    console.log("Connected to MongoDB Database");
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

app.listen(port, function(){
    console.log(`Server is running on port: ${port}`)
});