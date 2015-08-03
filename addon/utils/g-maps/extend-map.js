import Ember from 'ember';

const { isArray }   = Ember;
const { pluralize } = Ember.String;

export default function gMapsExtendMap(gmap) {
  
  /* Method to test if the id is listed in the give map's model Array */
  gmap.hasChild = gmap.hasChild || function gmapHasChild(id, type) {
    const model = this[ pluralize(type) ];

    if( !isArray(model) ) {
      throw new Error('hasChild requires a name to valid GMap model array');
    }

    for(let i = 0, l = model.length; i < l; i++ ) {
      if(model[i].details.id === id) {
        return true;
      }
    }
    return false;
  };

  return gmap;
}
