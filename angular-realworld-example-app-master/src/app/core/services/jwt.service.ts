import { Injectable } from '@angular/core';


@Injectable()
export class JwtService {

  getToken(): String {
    //debugger
    console.log("getToken=" + window.localStorage['jwtToken']);
    return window.localStorage['jwtToken'];
  } 

  saveToken(token: String) {
    //debugger
    console.log("saveToken=" + window.localStorage['jwtToken']);
    window.localStorage['jwtToken'] = token;
  }
  

  destroyToken() {
    //debugger
    console.log("destroyToken=" + window.localStorage['jwtToken']);
    window.localStorage.removeItem('jwtToken');
  }

}
