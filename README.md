# "Now Playing" Local Overlay
Detects music playback in the browser, sends it to a local server, and displays it in an OBS browser source.

- Chromium based browser only (Brave/Chrome/Edge/Opera)
- Supported sites (Web only)
    - **Apple Music** *(untested)*
    - **Spotify** *(untested, don't want to create an account)*
    - **Soundcloud**
    - **YT Music**

## How it works
1. To make this work we'll need a way to read and send the track that is playing using an **Extension**;  
2. The extension will need to send to a **Server** to relay the data;  
3. Also within the server, it host an **Overlay page** that talks to itself to retrive the data and displays it.

## How to use it
First you'll need to [download the source code](https://github.com/OhRetro/now-playing-local-overlay/archive/refs/heads/main.zip) and extract it to somewhere that you'll remember, we'll need the path of it later.

### Starting the Server
There's two ways of starting it, either with Python (3.12, maybe later versions will work) running `main.py` or;  
**(Windows only)** By downloading in the [releases page](https://github.com/OhRetro/now-playing-local-overlay/releases) an standalone exe.  

#### Running with Python
To start the server with Python, you'll need to open the Terminal/Console and execute:  
```sh
cd <path-of-the-extracted-source-code> # goes to the source code diretory
pip install -r requirements.txt # install required packages to run
python3 main.py # starts the server
```

#### Running with the standalone exe
After downloading it from the [releases page](https://github.com/OhRetro/now-playing-local-overlay/releases) move the exe to the extracted source code folder;  
Then just like any other program just double click to execute it, a windows defender popup will/may appear due to the python code being compiled with Nuitka.

### Installing the extension in the browser
In your browser go to `chrome://extensions/` and activate "Developer mode";  
After enabling it, click on the "Load unpacked" button;  
A window will appear asking to select a folder, go to the extracted source code directory and select the `extension` folder;  
Now the extension is installed and wanting for the server.

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
