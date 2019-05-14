import React, { Component } from 'react'
import queryString from 'query-string'

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
          <div>
            <h1>A Webpage By Christopher Smith</h1>
          </div>
        ) : (
          <button
            id='signIn'
            onClick={() => {
              window.location = window.location.href.includes('localhost')
                ? 'http://localhost:8888/login'
                : 'https://route-note-lander-be.herokuapp.com/login'
            }}
            style={{ padding: '20px', fontSize: '50px', marginTop: '20px' }}
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
              rating: track.popularity
            }
          })
        })
      )
  }
}

export default App
