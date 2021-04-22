class UserManager {
    static setUser (user) {localStorage.setItem("user", JSON.stringify(user));};
    static getUser () { return JSON.parse(localStorage.getItem("user"));};
    static clearUser () { localStorage.removeItem("user");}
    static isUserLoggedIn () { return localStorage.getItem("user") !== null; }
}
  
export default UserManager;