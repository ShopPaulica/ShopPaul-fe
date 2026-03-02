import {DataProviderModel} from '../model/data-provider-facade.model';
import {InjectionToken} from '@angular/core';

export const DATA_PROVIDER_TOKEN: InjectionToken<DataProviderModel<unknown>> =
  new InjectionToken<DataProviderModel<unknown>>('DataProvider')
