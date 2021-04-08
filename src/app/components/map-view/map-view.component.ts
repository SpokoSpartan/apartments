import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import * as proj from 'ol/proj';
import Overlay from 'ol/Overlay';
import TileLayer from 'ol/layer/Tile';
import {ApartmentService} from "../../services/apartment-service/apartment.service";
import {Apartment} from "../../models/Apartment";
import {MarkerService} from "../../services/marker-service/marker.service";
import {trigger, state, style, animate, transition} from '@angular/animations';
import {MapService} from "../../services/map-service/map.service";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
  animations: [
    trigger('mapNavbarActive', [
      state('true', style({opacity: '1'})),
      state('false', style({ opacity: '0'})),
      transition('0 <=> 1', animate('1000ms ease'))
    ]),
    trigger('mapFilterActive', [
      state('true', style({opacity: '1'})),
      state('false', style({ opacity: '0'})),
      transition('0 <=> 1', animate('1000ms ease'))
    ])
  ]
})
export class MapViewComponent implements OnInit {

  map: Map;
  apartments: Apartment[];

  public mapNavbarActive = true;
  public mapFilterActive = false;

  constructor(private apartmentService: ApartmentService,
              private markerService: MarkerService,
              private mapService: MapService) {
  }

  ngOnInit(): void {
    this.mapService.prepareMap('apartments_map')
      .subscribe(createdMap => {this.map = createdMap; console.log('Map assigned');});

    this.apartmentService.getAllApartments()
      .then(response => {
        response.subscribe(apartments => this.apartments = apartments);
        this.mapService.addMarkers(this.apartments);
      })
      .catch( error => {
        console.log("UPS");
      });

    this.map.on("pointermove", (e) => {
      this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
        console.log(feature.getId());
        console.log(feature.get('price'));
      })
    });


  }

  // addMarkers(apartments: Apartment[]) {
  //   const markersLayer = this.markerService.translateToMarkers(apartments);
  //   this.map.addLayer(markersLayer);
  // }



  doSmtg() {
    var container = document.getElementById('popup');
    console.log(container);
    var popup = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    this.map.addOverlay(popup);

    this.map.on('pointermove', (evt) => {
      var feature = this.map.forEachFeatureAtPixel(evt.pixel, (feat, layer) => {
          return feat;
        }
      );

      if (feature && feature.get('type') == 'Point') {
        var content = document.getElementById('popup-content');
        var coordinate = evt.coordinate;    //default projection is EPSG:3857 you may want to use ol.proj.transform
        // content.innerHTML = feature.get('desc');
        popup.setPosition(coordinate);
      }
      else {
        popup.setPosition(undefined);
      }
    });

  }


  getNameById(id: string) {
    this.apartments.forEach(ap => {if (ap.id === id) return ap;});
    return '';
  }



  increaseSize() {
    this.map.getView().setZoom(this.map.getView().getZoom() + 1);
  }



  onMouseOnNavbarEnter() {
    this.mapNavbarActive = true;
  }

  onMouseOnNavbarLeave() {
    this.mapNavbarActive = false;
  }

  onMouseOnFilterEnter() {
    this.mapFilterActive = true;
  }

  onMouseOnFilterLeave() {
    this.mapFilterActive = false;
  }

}
