export default {
  isMarkerRemoved: function(id, markers) { 
    for(let i = 0, l = markers.length; i < l; i++ ) {
      if(markers[i].id === id) { return false; }
    }
    return true;
  }
}