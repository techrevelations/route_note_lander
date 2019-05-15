import React, { Component } from 'react'
import queryString from 'query-string'
import millisToMinutesAndSeconds from './components/index'

import './App.css'

class App extends Component {
  constructor () {
    super()
    this.state = {
      // user: '',
      tracks: []
    }
  }
  render () {
    const { artist, followers, imageUrl, tracks, user } = this.state
    console.log(artist, followers, imageUrl, tracks, user)
    console.log(this.state.user, '<<<<<<<')

    return (
      <div className='App'>
        {this.state.user ? (
          <div id='All'>
            <h3 id='User'>Welcome {this.state.user.display_name}</h3>
            <h3 id='Followers'>{this.state.user.followers.total} followers</h3>
            <h1 id='Title'>{artist}</h1>
            <img id='band_image' src={imageUrl} alt='band' />
            <div id='Song'>
              {tracks.map(track => {
                let popular = track.rating * 20
                return (
                  <div>
                    <h2>{track.song} </h2>
                    {millisToMinutesAndSeconds(track.length)}
                    {` `}
                    <div id='bar'>
                      <div id='popularity' style={{ width: popular }}>
                        {track.rating * 10}%{' '}
                      </div>
                    </div>
                    <img id='albumPic' title={`Release Date ${track.released}`} src={track.album} alt='pic' />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <button
            id='signIn'
            onClick={() => {
              window.location = window.location.href.includes('localhost')
                ? 'http://localhost:8888/login'
                : 'https://route-note-lander-be.herokuapp.com/login'
            }}
            style={{ padding: '20px', fontSize: '30px', marginTop: '20px' }}
          >
            Login To Spotify
          </button>
        )}
      </div>
    )
  }
  componentDidMount () {
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token
    // console.log(accessToken)
    if (!accessToken) return
    else {
      fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: 'Bearer ' + accessToken }
      })
        .then(response => response.json())
        .then(data =>
          this.setState({
            user: data
          })
        )
    }

    fetch('https://api.spotify.com/v1/artists/0Q5FNNZ8ieJV9q0YR9boTY', {
      headers: { Authorization: 'Bearer ' + accessToken }
    })
      .then(response => response.json())
      .then(data =>
        this.setState({
          artist: data.name,
          followers: data.followers.total,
          imageUrl: data.images[0].url
        })
      )

    fetch('https://api.spotify.com/v1/artists/0Q5FNNZ8ieJV9q0YR9boTY/top-tracks?country=GB', {
      headers: { Authorization: 'Bearer ' + accessToken }
    })
      .then(response => response.json())
      .then(data =>
        this.setState({
          tracks: data.tracks.map(track => {
            console.log(data.tracks)
            return {
              song: track.name,
              released: track.album.release_date,
              length: track.duration_ms,
              rating: track.popularity,
              album: track.album.images[0].url
            }
          })
        })
      )
  }
}

export default App
