export interface IVehicleFilters {
  page?: string;
  brand?: string,
  model?: string,
  fuel?: string,
  engine?: string,
  power?: string
}

export type VehicleArgs = [params?: IVehicleFilters];
