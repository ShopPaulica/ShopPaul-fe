import { Observable } from 'rxjs';
import { PartFetchDataModel } from './parts-fetch-data.model';

export type PartsState = {
  parts$: Observable<PartFetchDataModel | null>;
  sectionFiltersPage$: Observable<string[] | null>;
  subsectionFiltersPage$: Observable<string[] | null>;
  titleFiltersPage$: Observable<string[] | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
};
