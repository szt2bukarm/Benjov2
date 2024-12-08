import styled from "styled-components";
import NowPlayingIndicator from "../Player/NowPlayingIndicator";
import useStore from "../../store";
import { forwardRef } from "react";
import { FaRegHeart,FaHeart } from "react-icons/fa";
import useFavoritesFetcher from "../../services/favoritesFetcher";
import { BiAddToQueue } from "react-icons/bi";
import { RiPlayListAddLine } from "react-icons/ri";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem;
    width: 100%;
    /* height: 7rem; */
    background-color: #161a1d;
    border-radius: .5rem;
    /* margin-block: 1rem; */
    cursor: pointer;

    &:hover {
        background-color: #222a2d;
    }
`

const Image = styled.img`
  width: 5rem;
  height: 5rem;
  margin-right: 1rem;
`;

const Title = styled.p`
  font-size: 1.8rem;
  color: white;
  font-weight: 600;
  margin-bottom: .2rem;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 2rem;
`;

const ArtistWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  line-height: .7;
`;

const Artist = styled.p`
  font-size: 1.2rem;
  color: #c6c6c6;
`;

const Duration = styled.p`
  font-size: 1.6rem;
  min-width: 5rem;
  color: #c6c6c6;
  /* margin-left: auto; */
`;

const Action = styled.div`
  /* margin-left: auto; */
  position: relative;
  margin-right: 2rem;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
  transform: translateY(2px);

  &:hover {
    color: #c6c6c6;
  }

  &:hover .text {
    opacity: 1;
  }
`

// const Action = styled.div`
//   position: relative;
//   margin-right: 2rem;
//   font-size: 2rem;
//   color: #fff;
//   cursor: pointer;
//   transform: translateY(2px);

//   &:hover {
//     color: #c6c6c6;
//   }

//   &:hover .text {
//     opacity: 1;
//   }
// `

const TextWrapper = styled.div`
    position: absolute;
    opacity: 0;
    top: -3rem;
    left: 50%;
    transform: translateX(-50%);
    /* width: 9rem; */
    white-space: nowrap;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background-color: #5f5f5f;
    border-radius: 1rem;
    pointer-events: none;
    transition: all .1s;
`

const Actions = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
`

const Text = styled.p`
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
`

const Track = forwardRef(({ index,trackToSet,fromSearch = false, image, id, title, artists, duration, albumID, albumName, artistID }, ref) => {
    const { Music: { spotifyID,setImage,setArtist,setTitle,setDuration,setAlbum,setAlbumID,setSpotifyID,setArtistID, }
    , Favorites: { trackIDs,setChangedTracks }, Tracklist: {tracks,setTracks},Lyrics: {setLyrics}, Player: {setLyricsScrolled},
    User: {guest},
    Playlists: {setShowAddToPlaylist,setAddToPlaylistID,setAddToPlaylistTitle} } = useStore();
    const { addFavoriteTrack } = useFavoritesFetcher();

    const handleClick = () => {
      if (spotifyID == id) return;
  
      setImage(image);
      setArtist(artists.length > 1 ? artists[0].name : artists.name);
      setTitle(title);
      setDuration(duration);
      setAlbum(albumName);
      setAlbumID(albumID)
      setSpotifyID(id)
      setArtistID(artistID)
      setLyrics(null)
      setLyricsScrolled(false)
      setTracks(null)
      setTracks(trackToSet)

      if (fromSearch) {

        const trackToAdd = {
          albumID: albumID,
          albumName: albumName,
          artists: artists,
          duration: duration,
          image: image,
          trackID: id,
          trackName: title,
          artistsID: artistID,
        };
        
        setTracks({ 0: trackToAdd });
      }
    };

    const handleFavorite = (e,id) => {
        e.stopPropagation();
        setChangedTracks(true)
        addFavoriteTrack(id);
    }

    const handlePlaylist = (e, id, name) => {
        e.stopPropagation();
        setShowAddToPlaylist(true);
        setAddToPlaylistID(id);
        setAddToPlaylistTitle(name);
    }

    const handleQueue = (e, id) => {
      e.stopPropagation();
      if (id === spotifyID) return;
      const currentIndex = Array.from(Object.values(tracks)).findIndex((track) => track.trackID === spotifyID);
  
      if (currentIndex === -1) {
          console.error("Currently playing track not found");
          return;
      }
  
      const trackToAdd = {
          albumID: albumID,
          albumName: albumName,
          artists: artists,
          duration: duration,
          image: image,
          trackID: id,
          trackName: title,
          artistsID: artistID,
      };

      const tracksArray = Object.values(tracks);
      if (tracksArray.map(track => track.trackID).includes(id)) {
          tracksArray.splice(tracksArray.map(track => track.trackID).indexOf(id), 1);
      };
      const updatedTracksArray = [
          ...tracksArray.slice(0, currentIndex + 1), 
          trackToAdd, 
          ...tracksArray.slice(currentIndex + 1) 
      ];
  
      const newTracksObject = updatedTracksArray.reduce((acc, track, index) => {
          acc[index] = track; 
          return acc;
      }, {});
  
      setTracks(newTracksObject); 
  };
    
    return (
      <Wrapper key={index} onClick={handleClick} ref={ref}>
        <Image src={image ? image : ""} />
        {id === spotifyID && <NowPlayingIndicator />}
        <InfoWrapper style={{ marginLeft: id === spotifyID ? "1rem" : "0" }}>
          <Title>{title}</Title>
          <ArtistWrapper>
            {artists.length > 1 ? (
              artists.map((artist, artistIndex) => (
                <Artist key={artistIndex}>{artist.name}</Artist>
              ))
            ) : (
              <Artist>{artists.name}</Artist>
            )}
          </ArtistWrapper>
        </InfoWrapper>
        
        <Actions>
          {!guest &&
            <Action onClick={(e) => {handlePlaylist(e,id,title)}}>
                <RiPlayListAddLine />
                <TextWrapper className="text"><Text>Add To Playlist</Text></TextWrapper>
            </Action>
            }


        {tracks &&         
        <Action onClick={(e) => {handleQueue(e,id)}}>
          <BiAddToQueue />
          <TextWrapper className="text"><Text>Add To Queue</Text></TextWrapper>
        </Action>}


        {!guest && 
            <Action onClick={(e) => {handleFavorite(e,id)}}>
            {trackIDs?.includes(id) ? <FaHeart /> : <FaRegHeart />}
            <TextWrapper className="text"><Text>{trackIDs?.includes(id) ? "Remove From Favorites" : "Add To Favorites"}</Text></TextWrapper>
            </Action>
      }

        <Duration>{new Date(duration).toISOString().slice(14, 19)}</Duration>
        </Actions>
      </Wrapper>
    );
  });
  

export default Track
