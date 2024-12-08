import { useState, useEffect,useCallback } from 'react';
import useStore from '../store';
import { apiLink } from './config';

const useRecommendationFetcher = (query) => {
  const {Tracklist: {setTracks,tracks}, Genres: {setGenreTracks,setTracksLoading,selectedGenre}} = useStore()

  const fetchRecommendationData = useCallback(async (trackQuery,artistQuery) => {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await fetch(apiLink + '/recommendation/input', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
          
          body: JSON.stringify({
                "track": trackQuery,
                "artist" : artistQuery
           })
        });
        const data = await resp.json();
        let NewTracklist;
  
        if (tracks !== null) {
          NewTracklist = [...Object.values(tracks), ...Object.values(data.data)];
        } else {
          NewTracklist = Object.values(data.data);
        }
  
        const uniqueTracks = [];
        const trackIDs = new Set();
  
        NewTracklist.forEach(track => {
          if (!trackIDs.has(track.trackID)) {
            uniqueTracks.push(track);
            trackIDs.add(track.trackID);
          } else {
            console.log(`Duplicate track found: ${track.trackName}`);
          }
        });
  
        console.log(uniqueTracks);
        setTracks(uniqueTracks);
  
        resolve();
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }, [tracks]);

    const fetchGenreRecommendationData = useCallback(async (query) => {
      try {
        if(selectedGenre == query) return;
        setTracksLoading(true)
        setGenreTracks(null)
        const resp = await fetch(apiLink + '/recommendation/genre', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
          
          body: JSON.stringify({
                "genre" : query
           })
        });
        const data = await resp.json();
        console.log(data);
        setGenreTracks(data.data)
        setTracksLoading(false)
      } catch (err) {
        console.log(err);
      }
    }, [query]);


  return { fetchRecommendationData,fetchGenreRecommendationData };
};

export default useRecommendationFetcher;