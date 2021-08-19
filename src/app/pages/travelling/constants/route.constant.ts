import { TRAVELLING_ROUTE } from 'src/app/constants/route.constants';

export const SEARCH_PAGE_ROUTE = {
  path: 'search',
  get url(): string {
    return `${TRAVELLING_ROUTE.url}/${this.path}`;
  }
};

export const PROPERTY_DETAIL_ROUTE = {
  path: 'property-details',
  get url(): string{
    return `${TRAVELLING_ROUTE.url}/${this.path}`;
  }
};