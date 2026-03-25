import { Observable } from 'rxjs';
import { PartFetchDataModel } from './parts-fetch-data.model';
import { PartsDTO } from './partsDTO';
import { ApiItemResponse, ApiMessageResponse } from '../../../../interfaces/api/api-respons';

export type PartsState = {
  parts$: Observable<PartFetchDataModel | null>;
  sectionFiltersPage$: Observable<string[] | null>;
  subsectionFiltersPage$: Observable<string[] | null>;
  titleFiltersPage$: Observable<string[] | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  fetchData: (params?: any) => void;
  fetchFiltersData: (section?: string, subsection?: string, title?: string) => void;
  saveData: (data: PartsDTO) => Observable<ApiItemResponse<PartsDTO>>;
  updateData: (id: string, data: Partial<PartsDTO>) => Observable<ApiItemResponse<PartsDTO>>;
  deleteData: (id: string) => Observable<ApiMessageResponse>;
};
