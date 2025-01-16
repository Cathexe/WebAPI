const express = require("express")
const path = require("path")

const app = express();
const port = 3000

app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "html/main.html"))
})
app.get("/logIn", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "html/logIn.html"))
})
app.get("/addtolist", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "html/addList.html"))
})

app.listen(port, function(){
    console.log(`Server is running on port: ${port}`)
});