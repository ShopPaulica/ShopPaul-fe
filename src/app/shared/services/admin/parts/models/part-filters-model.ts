export interface IPartsFilters {
  page?: string;
  section?: string;
  subsection?: string;
  title?: string;
}

export type PartArgs = [params?: IPartsFilters];
