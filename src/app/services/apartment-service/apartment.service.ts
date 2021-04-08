import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {APARTMENT_API_URL} from "../../config";
import {BehaviorSubject} from "rxjs";
import {Apartment} from "../../models/Apartment";

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {

  private url = APARTMENT_API_URL + 'apartments/';

  private apartments: BehaviorSubject<Apartment[]> = new BehaviorSubject([]);

  constructor(private client: HttpClient) { }

  async getAllApartments() {
    await this.client.get(this.url + 'all')
      .toPromise()
      .catch(error => console.log('ERROR: Couldn\'t fetch data'))
      .then((response: Apartment[]) => this.apartments.next(response));
    return this.apartments.asObservable();
  }

}
