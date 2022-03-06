import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Header from '../components/Header';
import Weather from '../components/Weather';
import Global from '../global';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const navigation = useNavigate();

  const getConnection = async (e) => {
    e.preventDefault();
    Global.loadData();

    axios.post("http://onearea.online:3000/login", {
      username: username,
      password: password
    }).then((res) => {
      console.log(res.data[0]);
      if (res.status === 200) {
        sessionStorage.setItem("IsLoggedIn", true);
        sessionStorage.setItem("Username", username)
        sessionStorage.setItem("id", res.data[0].id)
        Global.loadUserData()

        navigation("/", { replace: true });
        window.location.reload(false);
      }
    })
      .catch((error) => {
        setLoginFailed(true)
      })
  }


  return (
    <body>
      <div className="menu">
        <header>
          <h1 className="title">AREA</h1>
        </header >
        <form onSubmit={getConnection} >
          <div className='login'>
            <h2>LOGIN</h2>
            <label htmlFor='username'>Username</label>
            <input
              // required='true'
              name='username'
              type='text'
              value={username}
              placeholder='Enter your username'
              onChange={(e) => setUsername(e.target.value)} />
            <label htmlFor='password'>Password</label>
            <input type='password'
              // required='true'
              name='password'
              value={password}
              placeholder='Enter your password'
              onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">LOGIN</button>
            <button type="submit">Google</button>
            <div className='register'>
              Don't have an account ?
              <a href="http://localhost:3000/register">REGISTER</a>
            </div>
            <div className='error'>
              {loginFailed ? "No user found. Please try again" : ""}
            </div>
          </div>
        </form >
      </div >
    </body>
  )
}

export default Login;