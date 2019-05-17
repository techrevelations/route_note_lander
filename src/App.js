import React, { Component } from 'react'
import queryString from 'query-string'
import millisToMinutesAndSeconds from './components/index'
import axios from 'axios'
import './App.css'

class App extends Component {
  constructor () {
    super()
    this.state = {
      // user: '',
      tracks: [],
      album: []
    }
  }
  render () {
    const { artist, followers, imageUrl, tracks, user } = this.state
    console.log(artist, followers, imageUrl, tracks, user)
    console.log(this.state.user, '<<<<<<<')

    return (
      <div className='App'>
        {this.state.user && this.state.album.length > 0 && this.state.tracks.length > 0 ? (
          <div id='All'>
            <h3 id='User'>
              Welcome {this.state.user.display_name} {console.log(this.state.user)}
            </h3>
            <h5 id='Followers'>{this.state.user.followers.total} followers</h5>

            <button id='Follow_Us' onClick={() => this.handleClick('0Q5FNNZ8ieJV9q0YR9boTY', this.state.user.id)}>
              Follow On Spotify
            </button>
            <h1 id='Title'>{artist}</h1>
            <h5 id='Followed_By'>{followers} followers</h5>
            <img id='band_image' src={imageUrl} alt='band' />
            <div id='Song'>
              {tracks.map(track => {
                let popular = track.rating * 20
                return (
                  <div id='SongCard'>
                    <input
                      type='button'
                      id='Song_Title'
                      value={track.song}
                      title='Listen Now'
                      onClick={function () {
                        window.open(`${track.audio}`)
                      }}
                    />
                    <div id='Length' title='Duration'>
                      {millisToMinutesAndSeconds(track.length)}
                    </div>
                    <div id='bar'>
                      <div id='popularity' title='Popularity' style={{ width: popular }}>
                        {/* {track.rating * 10}%{' '} */}
                      </div>
                    </div>
                    <img id='albumPic' title={`Release Date ${track.released}`} src={track.album} alt='pic' />
                  </div>
                )
              })}
            </div>
            <h5 id='about'>
              Boat to Row are: (L-R) Dan Cippico, Ben Gilchrist, Lydia Glanville, Michael King “a band to get your ears
              involved with” - THIS IS FAKE DIY ​ “simply wonderful” - JANICE LONG BBC RADIO 2 ​ “one of the West
              Midlands most exquisitely talented folk acts” - BRUMNOTES MAGAZINE ​<br /> <br /> Following the release of
              their debut album ‘I Found You Here’ in 2015, Boat to Row have found themselves overcoming many different
              obstacles record their second album. From line up changes and corrupted hard drives, to losing their
              practice space when the legendary Highbury Studios closed, the creative flow has not been easily followed.
              <br />
              <br />​ Despite all of this, ‘Rivers That Flow in Circles’ is an album that sees the band pushing their
              horizons. Self-produced and recorded in a variety of rehearsal rooms, bedrooms and kitchens, the record
              showcases the bands most ambitious songs yet. Drawing on band members both past and present, as well as
              many other musicians from the Birmingham scene, this is an album which works from a diverse musical
              pallet.
              <br />
              <br />
              The first single from the record, ‘Spanish Moss’ is a fantastic example of the band’s growth as African
              percussion meets wirey electric guitars over the top of a hypnotic bass line. Just as the song reaches a
              crescendo it dissolves into a spacious instrumental, where a soaring violin twists and turns over a sea of
              guitars and synthesisers. Freeing themselves from the constraints of hourly studio rates has been a gift
              which has allowed the band to turn in an album that is more adventurous and expansive than its
              predecessor.
              <br /> <br />
              Boat to Row have previously been supported by BBC 6 Music and Radio 2 and many local stations, and
              received glowing reviews from websites as diverse as DIY, The 405, Counteract, Folk Radio UK and Gold
              Flake Paint. They have toured extensively appearing with acts including Slow Club, Johnny Flynn, Willy
              Mason, Ryley Walker, Kate Rusby, Sweet Baboo and graced stages at many of the country’s favourite
              festivals including Glastonbury, Cambridge Folk, Green Man, Truck, Wood, Moseley Folk, Y Not and No
              Direction Home. Look out for more of their enrapturing live show throughout 2019.
            </h5>
            <h1 id='Albums'>Albums</h1>
            <div id='Album'>
              {this.state.album.map(album => {
                let year = album.released
                let newYear = year.slice(0, 4)
                return (
                  <div id='AlbumCard'>
                    <img id='AlbumPics' title={`Release Date ${album.released}`} src={album.cover.url} alt='pic' />
                    <h5 id='AlbumName'>{album.album_Name}</h5>
                    <h5 id='AlbumReleased'>Released in {newYear} </h5>
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
            style={{ padding: '10px', fontSize: '15px', marginTop: '20px' }}
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
    console.log(accessToken)
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
              album: track.album.images[0].url,
              audio: track.external_urls.spotify
            }
          })
        })
      )
    fetch('https://api.spotify.com/v1/artists/0Q5FNNZ8ieJV9q0YR9boTY/albums?country=GB', {
      headers: { Authorization: 'Bearer ' + accessToken }
    })
      .then(response => response.json())
      .then(data =>
        this.setState({
          album: data.items.map(album => {
            console.log(data.items)
            return {
              album_Name: album.name,
              released: album.release_date,
              cover: album.images[0]
            }
          })
        })
      )
  }

  handleClick = async (band_Id, userId) => {
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token
    console.log(band_Id, userId)
    axios({
      method: 'PUT',
      url: `https://api.spotify.com/v1/me/following?type=artist&ids=${band_Id}`,
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    }).then(data => console.log('done'))
  }
}

export default App
