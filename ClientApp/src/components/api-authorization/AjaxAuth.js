import React, { useEffect, useState } from 'react';
import authService, { AuthenticationResultStatus } from './AuthorizeService';
import Cookies from 'js-cookie';


export default function AjaxAuth() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [token, setToken] = useState();

  useEffect(() => {
    console.log('isLogging effect');
    if(!isLogging) {
      setLoading(true);
      (async () => {
        const isLoggedIn = await authService.isAuthenticated();

        const user = await authService.getUser();
        console.log('Got user', user);

        const accessToken = await authService.getAccessToken();
        setToken(accessToken);

        console.log('isLogging effect:isLoggedIn', isLoggedIn, `"${accessToken}"`);

        setLoggedIn(isLoggedIn);
        setLoading(false);
      })();
    }
  }, [isLogging]);

  const handleAuth = async () => {
    // console.log('X-CSRF-TOKEN', Cookies.get());

    setIsLogging(true);

    if(loggedIn) {

      const resp = await fetch('/api/Auth/Logout', {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin'
      });

      console.log('logout resp', resp);

      if(resp.ok) {
        console.log('calling ajaxSignOut');
        await authService.ajaxSignOut();
      }

      setIsLogging(false);

    } else {
      const formData = new FormData();

      // formData.append('Input.Email', 'christos.lytras@gmail.com');
      // formData.append('Input.Password', 'Christos2020$');
      // formData.append('Input.RememberMe', 'false');
      // formData.append('__RequestVerificationToken', 'CfDJ8Oj1XssAVlVGlLlxk_2fOr9y5ZD6FA3BNhHJP9Jgm5oU2dqXhvoe6qk4jGYry4MNBn5kVbqpqLjjNkzyQKjFX3pk7f4PTPmFCQsP1RbqFpT_KXWJ9ueJG7Npon77uY2IBl73Mhn8g25YLoNGiSSWWvA');

      // const resp = await fetch('/Identity/Account/Login?ReturnUrl=%2F', {
      //   method: 'POST',
      //   credentials: 'include',
      //   body: formData
      // });

      formData.append('Email', 'christos.lytras@gmail.com');
      // formData.append('Password', 'Christos2020$');

      const resp = await fetch('/api/Auth/Login', {
      // const resp = await fetch('/api/Auth/TestParams', {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        // body: formData
        body: JSON.stringify({
          Email: 'christos.lytras@gmail.com',
          Password: 'Christos2020$'
        })
      });

      console.log('login resp', resp);

      if(resp.ok) {
        const loginResult = await authService.ajaxSignIn();
        console.log('ajaxSignIn', loginResult);
      }

      // try {

      //   const body = await resp.text();

      //   console.log('resp data', body);

      // } catch(error) {
      //   console.log('resp data err', error);
      // }

      setIsLogging(false);

    }


  }

  if(loading) {
    return <div>Loading status...</div>;
  }

  return (
    <>
      <div>{loggedIn ? "User is logged in" : "User is NOT logged in"}</div>
      <div>Access Token: ({token})</div>
      <div>
        <button disabled={isLogging} onClick={handleAuth}>{loggedIn ? "Logout" : "Login"}</button>
      </div>
      {isLogging && <div>Logging in/out user</div>}
    </>
  );
}
