const songId = window.location.pathname.split("/").pop();

const loadSong = async () => {
    try {
        const response = await fetch(`/songs/${songId}`);
        if (!response.ok) throw new Error("Failed to fetch song details");
        const song = await response.json();

        document.getElementById("songName").value = song.songName;
        document.getElementById("artist").value = song.artist;
    } catch (err) {
        console.error(err);
        alert("Failed to load song details");
    }
};

loadSong(); 

document.getElementById("editForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const updatedSong = {
        songName: document.getElementById("songName").value,
        artist: document.getElementById("artist").value,
    };

    try {
        const response = await fetch(`/updatesongs/${songId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedSong),
        });

        if (!response.ok) throw new Error("Failed to update song");

        alert("Song updated successfully!");
        window.location.href = "/"; 
    } catch (err) {
        console.error(err);
        alert("Failed to update song.");
    }
});