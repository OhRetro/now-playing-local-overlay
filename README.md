# "Now Playing" Local Overlay
Detects music playback and sends it to a local server so the HTML overlay read it and display on OBS

- Chromium based browser only (Brave/Chrome/Edge/Opera)
- Supported sites
    - **Apple Music** *(theoretical)*
    - **Spotify** *(also theoretical, don't want to create an account)*
    - **Soundcloud**
    - **YT Music**

## How to use it
To make this work we'll need a way to read and send the track that is playing,  
using a extension, to send to a server, so the overlay page can comunicate with the server to get the track info and display it.

### Loading the "unpacked" extension in the browser
In your browser go to `chrome://extensions/` and activate "Developer mode",  
after enabling it, 3 buttons will appear, click on the "Load unpacked" button,  
a window will appear asking to select a folder, go to the project's folder and select the `extension` folder.  
Now the extension is load and working and wanting for the server.

### Server
You'll need Python 3.12 installed, maybe later versions will work, and download the source code.  
After installing Python and downloading the source code and extracted it, on the terminal (aka. cmd on windows)
go to the path where the project is,  
then execute `pip install -r requirements.txt`, after installing the packages just execute or double click `start.bat`.  

### Using the overlay on OBS
Go to OBS and create a new Browser source, put `http://127.0.0.1:49210/overlay`, adjust the width depeding of your scene and click OK.  

There's params that customize the overlay such as:
| Param | Description |
|---|---|
| **noArt** | Hide the art box|
| **rightSide** | The track box appear on the right side|
| **inline** | Make the title and artist text to be side by side|

To use them, put as shown here: `http://127.0.0.1:49210/overlay/?noArt=1`  
To use multiple of them, put as shown here: `http://127.0.0.1:49210/overlay/?noArt=1&rightSide=1`  

### Seeing it in action
Hopefully after following the steps you can start playing music and your viewers will be able to see what music you're listening.  
Just remember to close the server when not in use and start it again for streaming.
