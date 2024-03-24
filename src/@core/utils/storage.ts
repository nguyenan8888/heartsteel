const storagePrefix = 'FLM_';

const storage = {
  getToken: () => {
    return JSON.parse(window.localStorage.getItem(`accessToken`) as string);
  },
  setToken: (token: any) => {
    window.localStorage.setItem(`accessToken`, JSON.stringify(token));
  },
  getRefreshToken: () => {
    return JSON.parse(window.localStorage.getItem(`refreshToken`) as string);
  },
  setRefreshToken: (token: any) => {
    window.localStorage.setItem(`refreshToken`, JSON.stringify(token));
  },
  clearToken: () => {
    window.localStorage.removeItem(`${storagePrefix}refreshToken`);
    window.localStorage.removeItem(`${storagePrefix}accessToken`);
  },
  getLang: () => {
    return JSON.parse(window.localStorage.getItem(`${storagePrefix}lang`) as string);
  },
  setLang: (token: any) => {
    window.localStorage.setItem(`${storagePrefix}lang`, JSON.stringify(token));
  },
  getShowMenu: () => {
    return JSON.parse(window.localStorage.getItem(`${storagePrefix}showMenu`) as string);
  },
  setShowMenu: (token: any) => {
    window.localStorage.setItem(`${storagePrefix}showMenu`, JSON.stringify(token));
  },

  // getLoaiTaiKhoan: () => {
  //   console.log();
  //   return JSON.parse(window.localStorage.getItem(`${storagePrefix}LoaiTaiKhoan`) as string);
  // },
  setLoaiTaiKhoan: (token: any) => {
    window.localStorage.setItem(`${storagePrefix}LoaiTaiKhoan`, JSON.stringify(token));
  },
  getProfile: () => {
    return JSON.parse(window.localStorage.getItem(`userData`) as string);
  },
  setProfile: (token: any) => {
    window.localStorage.setItem(`${storagePrefix}Profile`, JSON.stringify(token));
  },
  getLichSuChuyenTrang: () => {
    return JSON.parse(window.localStorage.getItem(`${storagePrefix}lichSuChuyenTrang`) as string);
  },
  setLichSuChuyenTrang: (token: any) => {
    window.localStorage.setItem(`${storagePrefix}lichSuChuyenTrang`, JSON.stringify(token));
  },
  clearLichSuChuyenTrang: () => {
    window.localStorage.removeItem(`${storagePrefix}lichSuChuyenTrang`);
  },
};

export default storage;
