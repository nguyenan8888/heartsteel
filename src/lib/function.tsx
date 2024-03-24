import storage from 'src/@core/utils/storage'

export const CheckPermissionEnter = (dataPer: any) => {
  if (typeof window !== 'undefined') {
    const profile = storage.getProfile();
    const found = dataPer.find((e: any) => e === profile?.role);
    if (!found) {
      window.location.href = '/401';
    }
  } else {
    console.warn('CheckPermissionEnter is being executed in a non-browser environment.');
  }
}

export const CheckRole = (dataPer: any) => {
    if (typeof window !== 'undefined') {
      const profile = storage.getProfile();
      const found = dataPer.find((e: any) => e === profile?.role);
      if (found) {
        return true;
      } else {
        return false;
      }
    } else {
      console.warn('CheckPermissionEnter is being executed in a non-browser environment.');
    }
  }