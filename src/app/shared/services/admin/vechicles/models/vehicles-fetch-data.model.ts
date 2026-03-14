import {VehiclesDTO} from './vehiclesDTO';

export interface VehiclesFetchDataModel {
  code: number;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  filtersUsed: string[];
  items: VehiclesDTO[];
}
