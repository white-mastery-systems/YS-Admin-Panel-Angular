import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient) { }

  // AUTH
  SIGNUP_LOG(x) { return this.http.post<any>(environment.ws_url+'/others/signup_log', x); }
  VALIDATE_EMAIL(x) { return this.http.post<any>(environment.ws_url+'/others/check_email', x); }
  SIGNUP(x) { return this.http.post<any>(environment.ws_url+'/others/create_store', x); }
  ENQUIRY(x) { return this.http.post<any>(environment.ws_url+'/others/enquiry', x); }
  IOS_TOKEN(x) { return this.http.post<any>(environment.ws_url+'/others/ios_token', x); }
  
  LOGIN(x) { return this.http.post<any>(environment.ws_url+'/auth/store/login_v2', x); }
  FORGOT_REQUEST(x) { return this.http.post<any>(environment.ws_url+'/auth/store/forgot_request', x); }
  VALIDATE_FORGOT_REQUEST(x) { return this.http.post<any>(environment.ws_url+'/auth/store/validate_forgot_request', x); }
  UPDATE_PWD(x) { return this.http.post<any>(environment.ws_url+'/auth/store/update_pwd', x); }

  BRANCH_LOGIN(x) { return this.http.post<any>(environment.ws_url+'/auth/store/branch_login', x); }

  VENDOR_LOGIN(x) { return this.http.post<any>(environment.ws_url+'/auth/store/vendor_login', x); }
  VENDOR_FORGOT_REQUEST(x) { return this.http.post<any>(environment.ws_url+'/auth/store/vendor_forgot_request', x); }
  VALIDATE_VENDOR_FORGOT_REQUEST(x) { return this.http.post<any>(environment.ws_url+'/auth/store/validate_vendor_forgot_request', x); }
  UPDATE_VENDOR_PWD(x) { return this.http.post<any>(environment.ws_url+'/auth/store/update_vendor_pwd', x); }

  MASTER_LOGIN(x) { return this.http.post<any>(environment.ws_url+'/auth/admin/login', x); }

  // common
  COUNTRIES_LIST() { return this.http.get<any>(environment.ws_url+'/store_details/country_list'); }
  DOMAIN_INFO(x) { return this.http.get<any>(environment.ws_url+'/store_details/domain_details?dom_id='+x); }
  IP_INFO(url) { return this.http.get<any>(url); }

  NOTIFICATIONS() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/notifications', httpOptions);
  }
  UPDATE_NOTIFICATIONS(x, type) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/notifications?id='+x+'&type='+type, httpOptions);
  }
  ADD_FEEDBACK(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/store_feedback', x, httpOptions);
  }

  ANNOUNCE_BAR() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/announce_bar', httpOptions);
  }

  CREATE_CHAT_USERS(x) {
    return this.http.post<any>(environment.ws_url+'/auth/chat/auth_chat', x);
  }
  MESSAGE_LIST(skip: number, limit: number, userID: any) {
    if(userID) {
      return this.http.get<any>(environment.ws_url+'/auth/chat/auth_chat?skip='+skip+'&limit='+limit+'&userId='+userID);
    }
    else {
      let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
      return this.http.get<any>(environment.ws_url+'/store/chat?skip='+skip+'&limit='+limit, httpOptions);
    }
  }
  SEND_MESSAGE(x: any) {
    let httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/chat', x, httpOptions);
  }
  MESSAGE_READ() {
    let httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/chat', {}, httpOptions);
  }
  MESSAGE_COUNT() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/chat', httpOptions);
  }

}