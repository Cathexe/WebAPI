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
            `;

            

            songContainer.appendChild(songDiv);
        });
    }catch(error){
        console.error("Error: ", error);
        songContainer.innerHTML = "<p style='color:red'>Failed to get users</p>";
    }
    
    
}

fetchSongs();