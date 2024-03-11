
![](https://github.com/atulraj11/Music-Controller/blob/main/Project.gif)

# Music Controller

Create party rooms and control music that is played on your Spotify account.

Integrated with Spotify API lets you control music at your spotify account, play next song, pause. Create rooms, let guest vote to skip song. Songs are played in Spotify app (browser, phone, tv, ...) not in app itself.
App created with Django on the backend and React on frontend. Styling with Material UI.

*Note: Only premium users can access controls (play/pause/skip) through API. Regular users won't be able to enjoy these functions.*

# Features

- Authenticate Spotify user
- Create room (host)
- Join room (guest)
- Enable voting (host)
- Settings control (host)
- Vote for song to skip (guest)
- Skip song (host)
- Pause song (host)
- Display song's progress
- Display album cover
- Display Artist image
- Set required votes to skip (guest can vote)

  
![spotify api workflow](https://github.com/atulraj11/Music-Controller/assets/68856282/c886cbda-6d5f-462b-9394-8a81c1fc4027)



## Spotify developer account

In order to run this app you need Spotify Developer account!

- Create account for free at [spotify](https://developer.spotify.com/).
- Register app and get Client ID and Secret Key.

For detailed information, check out the documentation on <a href="https://developer.spotify.com/documentation/general/guides/authorization-guide/">Spotify API</a>
