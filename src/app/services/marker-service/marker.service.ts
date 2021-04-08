import { Injectable } from '@angular/core';
import {Apartment} from "../../models/Apartment";
import {Style, Icon} from 'ol/style'
import Feature from 'ol/Feature';
import * as layers from 'ol/layer'
import * as proj from 'ol/proj';
import * as source from 'ol/source';
import Point from 'ol/geom/Point';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  private icons: Map<string, Style> = new Map();

  constructor() { }

  translateToMarkers(apartments: Apartment[]) {
    let iconFeatures: Feature[] = [];
    apartments.forEach(apartment => {
      let iconStyle = this.getIcon(apartment.iconUrl);
      let feature: Feature = new Feature({
        geometry: new Point(proj.fromLonLat([apartment.location.lat, apartment.location.lon])),
        name: apartment.location,
        type: 'Point',
        desc: '<pre> <b>Waypoint Details </b> ' + '<br>' + 'Latitude : ' + 1.1 + '<br>Longitude: ' + 1.1 + '</pre>',
      });
      feature.setId(apartment.id);
      feature.set('price', apartment.fixedCostInCents + ' ' + apartment.additionalCostInCents)
      feature.setStyle(iconStyle);
      iconFeatures.push(feature);
    });
    let vectorSource = new source.Vector({
      features: iconFeatures
    });
    return new layers.Vector({
      source: vectorSource
    });
  }

  private getIcon(srcUrl: string) {
    let iconStyle = this.icons.get(srcUrl);
    if (!iconStyle) {
      iconStyle = new Style({
        image: new Icon({
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.9,
          src: srcUrl
        })
      });
      this.icons.set(srcUrl, iconStyle);
    }
    return iconStyle;
  }

}
