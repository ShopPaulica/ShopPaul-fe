import { Observable } from 'rxjs';

export type PartsState = {
  sectionFiltersPage$: Observable<string[] | null>;
  subsectionFiltersPage$: Observable<string[] | null>;
  titleFiltersPage$: Observable<string[] | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
};
