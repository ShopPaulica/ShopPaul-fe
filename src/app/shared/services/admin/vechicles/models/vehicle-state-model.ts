import { Observable } from 'rxjs';
import {VehiclesFetchDataModel} from './vehicles-fetch-data.model';

export type VehicleState = {
  vehicles$: Observable<VehiclesFetchDataModel | null>;
  brandFiltersPage$: Observable<string[] | null>;
  modelFiltersPage$: Observable<string[] | null>;
  fuelFiltersPage$: Observable<string[] | null>;
  engineFiltersPage$: Observable<string[] | null>;
  powerFiltersPage$: Observable<string[] | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  fetchFilter: (
    brand?: string,
    model?: string,
    fuel?: string,
    engine?: string,
    power?: string
  ) => void;
};
