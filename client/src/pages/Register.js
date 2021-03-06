import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Header from '../components/Header';

const Register = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();

  const getConnection = async (e) => {
    e.preventDefault();

    axios.post("https://onearea.online:3000/register", {
      username: username,
      password: password,
    }).then((res) => {
      console.log(res)
      if (res.status === 200) {
        console.log("login success")
        sessionStorage.setItem("isLoggedIn", true);
        sessionStorage.setItem("id", res.data[0].id);
        sessionStorage.setItem("username", username);

        axios.post("https://onearea.online:3000/active/getall", {
          id: res.data[0].id
        }).then((resa) => {
          if (resa.status === 200) {
            sessionStorage.setItem("weather", resa.data.weather.is_active);
            sessionStorage.setItem("google", resa.data.google.is_active);
            sessionStorage.setItem("news", resa.data.news.is_active);
            sessionStorage.setItem("crypto", resa.data.crypto.is_active);
            sessionStorage.setItem("intra", resa.data.intra.is_active);
            sessionStorage.setItem("area", resa.data.area.is_active);
            sessionStorage.setItem("covid", resa.data.covid.is_active);
          }
        })
        navigation("/", { replace: true });
        window.location.reload(false);
      }
    });
  }

  return (
    <div className="menu">
      <header>
        <h1 className="title">AREA</h1>
      </header >
      <form onSubmit={getConnection} >
        <div className='login'>
          <h2>REGISTER</h2>
          <label htmlFor='username'>Username</label>
          <input
            name='username'
            type='text'
            value={username}
            placeholder='Enter your username'
            onChange={(e) => setUsername(e.target.value)} />
          <label htmlFor='password'>Password</label>
          <input type='password'
            name='password'
            value={password}
            placeholder='Enter your password'
            onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">REGISTER</button>
          <div className='register'>
            Already have an account ?
            <a href="http://onearea.online/login">LOGIN</a>
          </div>
        </div>
      </form >
    </div >
  )
}

export default Register;