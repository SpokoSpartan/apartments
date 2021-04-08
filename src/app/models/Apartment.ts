import {GeoPoint} from "./GeoPoint";

export class Apartment {
  id: string;
  fixedCostInCents: number;
  additionalCostInCents: number;
  location: GeoPoint;
  iconUrl: string;
}
