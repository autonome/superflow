function save(key, value) {
  localStorage.setItem(key, value);
}

function remove(key) {
  localStorage.removeItem(key);
}

function get(key) {
  return localStorage.getItem(key);
}

function clear() {
  return localStorage.clear();
}

function getTags() {
  return get("favourites") == null || get("favourites") == ""
    ? []
    : get("favourites").split(",");
}

function getLastTag() {
  return get("lastTag") == null || get("lastTag") == ""
    ? null
    : get("lastTag");
}

module.exports = {
  save,
  remove,
  get,
  clear,
  getTags,
  getLastTag,
};
