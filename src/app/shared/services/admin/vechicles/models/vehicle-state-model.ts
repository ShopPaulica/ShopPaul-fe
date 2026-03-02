import { Observable } from 'rxjs';

export type VehicleState = {
  brandFiltersPage$: Observable<string[] | null>;
  modelFiltersPage$: Observable<string[] | null>;
  fuelFiltersPage$: Observable<string[] | null>;
  engineFiltersPage$: Observable<string[] | null>;
  powerFiltersPage$: Observable<string[] | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
};
