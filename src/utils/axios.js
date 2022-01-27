import axios from "axios";

axios.defaults.baseURL = "https://api.stackexchange.com/2.3/";

axios.defaults.params = {
  site: "stackoverflow",
};

export default axios;