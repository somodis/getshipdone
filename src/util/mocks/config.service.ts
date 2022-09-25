export const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'JWT_SECRET':
        return 'VerySecretKey';
    }
  },
};
