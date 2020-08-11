import Cookie from 'cookie-universal';

const cookies = Cookie();

const setOptions = (option) => {
    // default
    return { ...option,
        Secure: false
    }
}
const setCookie = (name, value, option = {}) => cookies.set(name, value, setOptions(option));

const getCookie = (name, option = {}) => cookies.get(name, setOptions(option));

const removeCookie = (name, option = {}) => cookies.remove(name, setOptions(option));

export {
    setCookie,
    getCookie,
    removeCookie,
};