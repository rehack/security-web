import Cookies from 'js-cookie';

const sidebarStatusKey = 'sidebar_status';
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey);
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus);

const sizeKey = 'size';
export const getSize = () => Cookies.get(sizeKey);
export const setSize = (size: string) => Cookies.set(sizeKey, size);

const accessTokenKey = 'access_token';
const refreshTokenKey = 'refresh_token';
export const getAccessToken = () => Cookies.get(accessTokenKey);
export const setAccessToken = (access_token: string, expires: number) => Cookies.set(accessTokenKey, access_token, {expires: getTime(expires)});
export const getRefreshToken = () => Cookies.get(refreshTokenKey);
export const setRefreshToken = (refresh_token: string, expires: number) => Cookies.set(refreshTokenKey, refresh_token, {expires: getTime(expires)});
export const removeToken = () => {
    Cookies.remove(accessTokenKey);
    Cookies.remove(refreshTokenKey);
};

const getTime = (seconds: number) => {
    return new Date(new Date().getTime() + seconds * 1000);
};

export const hasAccessToken = (): boolean => {
    return Cookies.get(accessTokenKey) != '' && Cookies.get(accessTokenKey) != undefined;
};
export const hasRefreshToken = (): boolean => {
    return Cookies.get(refreshTokenKey) != '' && Cookies.get(refreshTokenKey) != undefined;
}
