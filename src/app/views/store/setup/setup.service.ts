import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class SetupService {

  constructor(private http: HttpClient) { }

  // contact page
  CONTACT_PAGE_DETAILS() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/contact_page', httpOptions);
  }
  UPDATE_CONTACT_PAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/contact_page', x, httpOptions);
  }

  // CURRENCY TYPES
  YS_CURRENCY_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/others/ys_currency_list', httpOptions);
  }
  STORE_CURRENCY_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/currency', httpOptions);
  }
  ADD_STORE_CURRENCY(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/currency', x, httpOptions);
  }
  UPDATE_STORE_CURRENCY(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/currency', x, httpOptions); 
  }
  DELETE_STORE_CURRENCY(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/currency', x, httpOptions);
  }

  // extra pages
  EXTRA_PAGE_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/extra_page', httpOptions);
  }
  EXTRA_PAGE_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/extra_page?_id='+x, httpOptions);
  }
  ADD_EXTRA_PAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/extra_page', x, httpOptions);
  }
  UPDATE_EXTRA_PAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/extra_page', x, httpOptions);
  }
  DELETE_EXTRA_PAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/extra_page', x, httpOptions);
  }

  ADD_SEGMENT_EXTRA_PAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/extra_page/segment', x, httpOptions);
  }
  UPDATE_SEGMENT_EXTRA_PAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/extra_page/segment', x, httpOptions);
  }
  REMOVE_SEGMENT_EXTRA_PAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/extra_page/segment', x, httpOptions);
  }
  GET_SEGMENT_EXTRA_PAGE(pageId, segId) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/extra_page/segment?page_id='+pageId+'&_id='+segId, httpOptions);
  }
  SEGMENT_IMAGE_EXTRA_PAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/extra_page/image_list',x, httpOptions);
  }

  // catalog page
  CATALOG_PAGE_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/catalog_page', httpOptions);
  }
  CATALOG_PAGE_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/catalog_page?_id='+x, httpOptions);
  }
  ADD_CATALOG_PAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/catalog_page', x, httpOptions);
  }
  UPDATE_CATALOG_PAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/catalog_page', x, httpOptions);
  }
  DELETE_CATALOG_PAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/catalog_page', x, httpOptions);
  }
  ADD_SEGMENT_CATALOG_PAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/catalog_page/segment', x, httpOptions);
  }
  UPDATE_SEGMENT_CATALOG_PAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/catalog_page/segment', x, httpOptions);
  }
  REMOVE_SEGMENT_CATALOG_PAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/catalog_page/segment', x, httpOptions);
  }
  GET_SEGMENT_CATALOG_PAGE(pageId, segId) {
    let httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/catalog_page/segment?page_id='+pageId+'&_id='+segId, httpOptions);
  }
  SEGMENT_IMAGE_CATALOG_PAGE(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/catalog_page/image_list', x, httpOptions);
  }

  // payment types
  PAYMENT_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/payment_types', httpOptions);
  }
  ADD_PAYMENT(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/payment_types', x, httpOptions);
  }
  UPDATE_PAYMENT(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/payment_types', x, httpOptions); 
  }
  DELETE_PAYMENT(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/payment_types', x, httpOptions);
  }

  // policies
  POLICY_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/policies?type='+x, httpOptions);
  }
  UPDATE_POLICY(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/policies', x, httpOptions);
  }

  // locations
  LOCATION_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/locations', httpOptions);
  }
  ADD_LOCATION(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/locations', x, httpOptions);
  }
  UPDATE_LOCATION(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/locations', x, httpOptions); 
  }
  UPDATE_LOCATION_CONFIG(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/locations_config', x, httpOptions); 
  }
  DELETE_LOCATION(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/locations', x, httpOptions);
  }

  // footer links
  FSEO_LINK_LIST() {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/footer_seo_links', httpOptions);
  }
  FSEO_LINK_DETAILS(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.get<any>(environment.ws_url+'/store/footer_seo_links?id='+x, httpOptions); 
  }
  ADD_FSEO_LINK(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.post<any>(environment.ws_url+'/store/footer_seo_links', x, httpOptions);
  }
  UPDATE_FSEO_LINK(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.put<any>(environment.ws_url+'/store/footer_seo_links', x, httpOptions); 
  }
  DELETE_FSEO_LINK(x) {
    let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('store_token') }) };
    return this.http.patch<any>(environment.ws_url+'/store/footer_seo_links', x, httpOptions);
  }

}