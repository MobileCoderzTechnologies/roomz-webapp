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

export const STEP_2_ROUTE = {
  path: 'spaces',
  get url(): string {
    return `${LISTING_HOME_ROUTE}/${this.path}`;
  }
};

export const STEP_3_ROUTE = {
  path: '',
  get url(): string {
    return `${LISTING_HOME_ROUTE}/${this.path}`;
  }
};

export const STEP_4_ROUTE = {
  path: '',
  get url(): string {
    return `${LISTING_HOME_ROUTE}/${this.path}`;
  }
};
export const STEP_5_ROUTE = {
  path: '',
  get url(): string {
    return `${LISTING_HOME_ROUTE}/${this.path}`;
  }
};
export const STEP_6_ROUTE = {
  path: '',
  get url(): string {
    return `${LISTING_HOME_ROUTE}/${this.path}`;
  }
};
export const STEP_7_ROUTE = {
  path: '',
  get url(): string {
    return `${LISTING_HOME_ROUTE}/${this.path}`;
  }
};
export const STEP_8_ROUTE = {
  path: '',
  get url(): string {
    return `${LISTING_HOME_ROUTE}/${this.path}`;
  }
};
export const STEP_9_ROUTE = {
  path: '',
  get url(): string {
    return `${LISTING_HOME_ROUTE}/${this.path}`;
  }
};
export const STEP_10_ROUTE = {
  path: '',
  get url(): string {
    return `${LISTING_HOME_ROUTE}/${this.path}`;
  }
};
export const STEP_11_ROUTE = {
  path: '',
  get url(): string {
    return `${LISTING_HOME_ROUTE}/${this.path}`;
  }
};

export const STEP_12_ROUTE = {
  path: '',
  get url(): string {
    return `${LISTING_HOME_ROUTE}/${this.path}`;
  }
};

export const STEP_13_ROUTE = {
  path: '',
  get url(): string {
    return `${LISTING_HOME_ROUTE}/${this.path}`;
  }
};

