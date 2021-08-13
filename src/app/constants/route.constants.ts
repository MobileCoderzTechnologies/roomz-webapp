export const TRAVELLING_ROUTE = {
  path: 'travelling',
  get url(): string {
    return `/${this.path}`;
  }
};

export const HOSTING_ROUTE = {
  path: 'hosting',
  get url(): string {
    return `/${this.path}`;
  }
};

// export const LISTING_ROUTE = {
//   path: 'list-property',
//   get url(): string {
//     return `${HOSTING_ROUTE.url}/${this.path}`;
//   }
// };


export const FORGOT_PASSWORD_ROUTE = {
  path: 'forgot-password',
  get url(): string {
    return `/${this.path}`;
  }
};
