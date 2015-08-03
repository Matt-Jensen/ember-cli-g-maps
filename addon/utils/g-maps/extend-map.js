export default function gMapsExtendMap(gmap) {
  
  /* Method to test if the id is listed in the map's markers Array */
  gmap.hasMarker = gmap.hasMarker || function gmapHasMarker(marker_id) {
    const markers = this.markers;
    for(let i = 0, l = markers.length; i < l; i++ ) {
      if(markers[i].details.id === marker_id) {
        return true;
      }
    }
    return false;
  };

  return gmap;
}
