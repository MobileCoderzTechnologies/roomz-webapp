import { HOSTING_ROUTE } from 'src/app/constants/route.constants';

export const LISTING_HOME_ROUTE = {
  path: 'list-property',
  get url(): string {
    return `${HOSTING_ROUTE.url}/${this.path}`;
  }
};

export const START_ROUTE = {
  path: 'start',
  get url(): string {
    return `${LISTING_HOME_ROUTE.url}/${this.path}`;
  }
};

export const STEP_1_ROUTE = {
  path: 'kind-of-place',
  get url(): string {
    return `${LISTING_HOME_ROUTE.url}/${this.path}`;
  }
};
