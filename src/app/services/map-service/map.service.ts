import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import * as proj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import {BehaviorSubject} from "rxjs";
import {Apartment} from "../../models/Apartment";
import {MarkerService} from "../marker-service/marker.service";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map: BehaviorSubject<Map> = new BehaviorSubject(undefined);

  constructor(private markerService: MarkerService) { }

  public prepareMap(mapId: string) {
    const createdMap = new Map({
      target: mapId,
      projection: 'EPSG:4326',
      controls: [],
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: proj.fromLonLat([19.4709102, 52.1900607]),
        zoom: 6.45
      })
    });
    this.map.next(createdMap);
    return this.map.asObservable();
  }

  public addMarkers(apartments: Apartment[]) {
    const markers = this.markerService.translateToMarkers(apartments);
    let currentMap: Map = this.map.getValue()
    currentMap.addLayer(markers);
    this.map.next(currentMap);
  }

}
