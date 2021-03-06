'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

export default async function logOut() {
  try {
    const response = await fetch(url + '/auth/logout');
    const json = await response.json();

    // remove token
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    alert('You have logged out');
    location.href = '../front/index.html';
  } catch (e) {
    console.log(e.message);
  }
};


