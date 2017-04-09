/**
 * @param  {Array} properties list of properties to select
 * Click first of each property marked with applicable `data-test-update=...`
 */
export function updateAllMapControls(properties) {
  properties.forEach((property) =>
    click(`[data-test-update=${property}]:not(.active):first`));
}
