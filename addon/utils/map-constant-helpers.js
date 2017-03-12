/**
 * Get a name of an animation from its' id value
 * @param  {Number} id Animation id
 * @return {String}    Animation
 */
export function getAnimation(id) {
  id = parseInt(id, 10);
  return Object.keys(google.maps.Animation).filter((path) =>
    google.maps.Animation[path] === id)[0];
}

/**
 * Get the id of an animation by name
 * @param  {String} animation  Animation
 * @return {Number}            Animation id
 */
export function getAnimationId(animation) {
  animation = `${animation}`;
  return google.maps.Animation[animation];
}

/**
 * Get a name of a preconfigured symbol path from its' id value
 * @param  {Number} id Symbol path id
 * @return {String}    Symbol path
 */
export function getSymbolPath(id) {
  id = parseInt(id, 10);
  return Object.keys(google.maps.SymbolPath).filter((path) =>
    google.maps.SymbolPath[path] === id)[0];
}

/**
 * Get the id of a preconfigured symbol path by name
 * @param  {String} path   Symbol path
 * @return {Number}        Symbol path id
 */
export function getSymbolPathId(path) {
  path = `${path}`.toUpperCase();
  return google.maps.SymbolPath[path];
}
