const songContainer = document.getElementById("song-container");

const fetchSongs = async ()=>{
    try{
        //fetch data from server
        const response = await fetch("/songs");
        if(!response.ok){
            throw new Error("Failed to get songs");
        }

        //Parse json
        const song = await response.json();
        console.log(song);
        //Format the data to html
        songContainer.innerHTML = "";

        song.forEach((song) => {
            const songDiv = document.createElement("div");
            songDiv.className = "song";
            songDiv.innerHTML = `
            <li>${song.songName}  <i>Artist:</i> ${song.artist}</li> 
            <button onclick="Update('${song._id}')">Update</button>
            <button onclick="Delete('${song._id}')">Delete</button>
            `;

            

            songContainer.appendChild(songDiv);
        });
    }catch(error){
        console.error("Error: ", error);
        songContainer.innerHTML = "<p style='color:red'>Failed to get users</p>";
    }
    
    
}

const Delete = async (id)=>{
    if(!confirm("Are you sure you want to delete this Song?")) return;

    try{
        const response = await fetch(`/songs/${id}`,{
            method: "DELETE"
        })

        if(!response.ok)
        {
            throw new Error("failed to delete song")
        }

        fetchSongs()
    }catch(err){
        console.error("error deleting song",err)
    }
}

const Update = async (id) => {
    window.location.href = `/edit/${id}`;
};


fetchSongs();