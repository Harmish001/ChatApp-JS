class LoggedInUser {
  username: string | undefined;
  id: string | undefined;
  online: boolean | undefined;
  profile_picture?: string | undefined;
  constructor(username: string, _id: string, profile_picture: string) {
    this.username = username || "";
    this.id = _id || "";
    this.online = false;
    this.profile_picture = profile_picture;
  }
  isOnline() {
    return this.online;
  }

  getInfo() {
    return this;
  }

  setOnline(value: boolean) {
    this.online = value;
    return this;
  }
}
export default LoggedInUser;
