import React, { Component } from 'react'

export default class Nav extends Component {
  render () {
    const user = this.props
    return (
      <div>
        <h3 id='User'>
          Welcome {user.display_name}
          {/* {console.log(this.state.user)} */}
        </h3>

        <h5 id='Followers'>{user.followers.total} followers</h5>
      </div>
    )
  }
}
