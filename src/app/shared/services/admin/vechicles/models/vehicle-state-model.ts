import { Observable } from 'rxjs';
import { VehiclesFetchDataModel } from './vehicles-fetch-data.model';
import { VehiclesDTO } from './vehiclesDTO';
import { ApiItemResponse, ApiMessageResponse } from '../../../../interfaces/api/api-respons';

export type VehicleState = {
  vehicles$: Observable<VehiclesFetchDataModel | null>;
  brandFiltersPage$: Observable<string[] | null>;
  modelFiltersPage$: Observable<string[] | null>;
  fuelFiltersPage$: Observable<string[] | null>;
  engineFiltersPage$: Observable<string[] | null>;
  powerFiltersPage$: Observable<string[] | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  fetchFilterData: (
    brand?: string,
    model?: string,
    fuel?: string,
    engine?: string,
    power?: string
  ) => void;
  fetchData: (params?: any) => void;
  saveData: (data: VehiclesDTO) => Observable<ApiItemResponse<VehiclesDTO>>;
  updateData: (id: string, data: Partial<VehiclesDTO>) => Observable<ApiItemResponse<VehiclesDTO>>;
  deleteData: (id: string) => Observable<ApiMessageResponse>;
};
