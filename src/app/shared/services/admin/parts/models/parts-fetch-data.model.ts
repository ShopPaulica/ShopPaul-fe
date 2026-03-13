import { PartsDTO } from './partsDTO';

export interface PartFetchDataModel {
  code: number;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  filtersUsed: string[];
  items: PartsDTO[];
}
