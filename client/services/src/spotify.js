import React, { Component } from 'react';
import axios from 'axios';

class Spotify extends Component {

    constructor(props) {
        super(props);
        this.state = { clientID: 'c40a1d26beec4da4b630082bec424ac3', accessToken: "", givenName: "", isSigned: false }
    }

    // Printing response from GoogleLogin, accessToken, scopes and setting givenName
    onSuccess = (response) => {
        console.log("[Login SUCCESSFUL] access_token:", response.accessToken);
        console.log("[Scopes GRANTED] : ", response.tokenObj.scope);
        this.accessToken = response.accessToken;
        this.setState({ givenName: "Hello " + response.profileObj.givenName, isSigned: true })
    }
    onFailure = (error) => {
        console.error("[Login Failed] reason:", error.errors);
    }

    getSpotifyCodeUrl() {
        const authEndPoint = 'https://accounts.spotify.com/authorize'
        const clientId = this.state.clientID;
        const responseType = 'code';
        const redirectUrl = 'http://localhost:3000/';
        const scope = 'user-read-private user-read-email';
        return(
          authEndPoint +
          '?response_type=' + responseType +
          '&client_id=' + clientId +
          (scope ? '&scope=' + encodeURIComponent(scope) : '') +
          '&redirect_uri=' + encodeURIComponent(redirectUrl)
        )
      }
    
    componentDidMount() {
        this.setState({code: new URLSearchParams(window.location.search).get('code')});
      }
      
    render() {
        return (
          <div>
              {!this.state.token ? <a className="btn btn--loginApp-link" href={this.getSpotifyCodeUrl()}>
  Login to Spotify
</a> : ""}
          </div>)
    }
}

export default Spotify;