import React, { Component } from 'react';
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import {Switch} from '@mui/material';

// import { GoogleLogout, logout } from 'react-google-login'; used later on for logout button

// Actions => Post a comment, REActions => Erase it if it contains certain words, reply to it

class WordsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            words: '',
            list: []
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(value) {
        this.setState({value: value.target.value});
    }
    
    handleClick() {
        this.setState({words: ''});
    }

    handleKey(event) {
        console.log("yes, inside key");
        if (event.key === 'Enter' && this.state.value) {
            var tmp = this.state.words.split(", ");
            this.setState({words: this.state.value});
            this.setState({value: '', list: tmp});
            console.log(this.state.list);
        }
    }

    getWordsList() {
        return Promise.resolve(this.state.list);
    }

    render() {
        return (
            <div>
                <div>Please respect format "word, word, word"</div>
                <input value = {this.state.value} onKeyDown ={event => this.handleKey(event)} onChange={value => this.handleChange(value)}/>
                <button onClick={this.handleClick}>Clear List</button>
            </div>
        );
    }
}

class UrlList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            urls: []
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(value) {
        this.setState({value: value.target.value});
    }

    handleClick() {
        var tmp = this.state.urls;
        tmp.push(this.state.value);
        this.setState({urls: tmp});
        this.setState({value: ''});
        console.log(this.state.urls);
    }

    render() {
        return (
            <div>
                <input value = {this.state.value} onChange={value => this.handleChange(value)}/>
                <button onClick={this.handleClick}>Add</button>
            </div>
        );
    }
}

class Youtube extends Component {

    // givenName set, only used to display
    constructor(props) {
        super(props);
        this.state = {replyVideoId: "", replyTo: -1,
        eraseVideoId: "", eraseTo: -1, words: "",
        givenName: "", isSigned: false }
    }
    // API_KEY, clientId can be found and created from console.cloud.google.com, from library section
    API_KEY = "AIzaSyCVezk-6KLK58SmzTEW09F5Vr4J7xZoRF0";
    clientId = "461523189560-rbe23sv5tklm2natu8rdm3qfol4t35gc.apps.googleusercontent.com";
    accessToken = "";

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

    // Reply to every comments on a specified video videoId is the Id of the video, it can be found in the video's url
    replyToComments(videoId) {
        var reply = "Thank you for the comment";

        // Get every comments on a specific video
        if (this.state.replyVideoId != videoId)
            this.setState({replyTo: -1, replyVideoId: videoId});
        else {
            axios.get(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${this.API_KEY}`
            ).then((res) => {
                console.log(res);
                console.log(this.state.replyTo);
                if (this.state.replyTo != -1)
                    for (var i = 0; i < (res.data.items.length - this.state.replyTo); i++) {
                        console.log("Number ", i, " is ", res.data.items[i].snippet.topLevelComment.snippet.authorDisplayName, " id is ", res.data.items[i].id);
                        // Reply to every comments, parentId is the id of the main comment
                        axios.post(`https://youtube.googleapis.com/youtube/v3/comments?part=snippet&key=${this.API_KEY}&access_token=${this.accessToken}`, {
                            snippet: {
                                parentId: res.data.items[i].id,
                                textOriginal: reply
                            }
                        }).then((res) => {
                            console.log(res);
                        }, (error) => {
                            console.error("[FAILED]", error);
                        });
                    }
                else
                    this.setState({replyTo: res.data.items.length});
            }, (error) => {
                console.error("[FAILED]", error);
            });
        }
    }

    // Finds every comments in a video comment section, and deletes if the words are found in the comments, words is a list to make it better
    eraseCommentsIncluding(videoId, words) {
    if (this.state.eraseVideoId != videoId)
        this.setState({eraseTo: -1, eraseVideoId: videoId});
    else {
        axios.get(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${this.API_KEY}&access_token=${this.accessToken}`
        ).then((res) => {
            if (this.state.eraseTo != -1)
                for (var i = 0; i < (res.data.items.length - this.state.eraseTo); i++) {
                    // console.log(res.data.items[i].snippet.topLevelComment.snippet.textOriginal); print every comments
                    for (var o = 0; o < words.length; o++) {
                        // console.log(words[o]); print the word looked for
                        if (res.data.items[i].snippet.topLevelComment.snippet.textOriginal.includes(words[o])) {
                            console.log("Found :", words[o], "in", res.data.items[i].snippet.topLevelComment.snippet.textOriginal); // Show comments
                            axios.delete(`https://youtube.googleapis.com/youtube/v3/comments?part=snippet&id=${res.data.items[i].id}&key=${this.API_KEY}&access_token=${this.accessToken}`
                            ).then((res) => {
                                console.log(res);
                            }, (error) => {
                                console.error("[FAILED]", error);
                            });
                        }
                    }
                }
            }, (error) => {
                console.error("[FAILED]", error);
            });
        }
    }

    render() {
        return (
            <div>
                {/* If button is clicked, it searches a specific word */}
                {/* {this.state.isSigned && "Reply to some comments using this button"}
                {this.state.isSigned && < button onClick={() => { this.replyToComments("0GdO95eZROE") }} />} */}
                {/* Google oauth2 for Youtube, clientId can be found in credentials on console.cloud.google.com */}
                <GoogleLogin
                    clientId={this.clientId}
                    buttonText='Login with Google'
                    onSuccess={this.onSuccess}
                    onFailure={this.onFailure}
                    // cookiePolicy={'single_host_origin'}
                    style={{ marginTop: '100px' }}
                    // Scopes required for youtube v3
                    scope='https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtubepartner'
                    />
                <div>
                    {this.state.givenName}
                </div>
                <div>
                    {this.state.isSigned && "Activate Auto Erase and Reply To new comments "}
                    {this.state.isSigned && <Switch/>}
                </div>
                <UrlList/>
                <WordsList/>
                {/* <GoogleLogout
                    clientId='461523189560-rbe23sv5tklm2natu8rdm3qfol4t35gc.apps.googleusercontent.com' buttonText="Logout"
                    onLogoutSuccess={logout}
                /> */}
            </div >)
    }
}

export default Youtube;