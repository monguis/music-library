export const environment = {
  production: true,
  songsApiUrl: (window as any)['config']?.songsApiUrl || '',
};
