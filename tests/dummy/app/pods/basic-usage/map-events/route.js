import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller) {
    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 5,

      isclick: false,
      isbounds_changed: false,
      iscenter_changed: false,
      isdblclick: false,
      isdrag: false,
      isdragend: false,
      isdragstart: false,
      isheading_changed: false,
      isidle: false,
      ismaptypeid_changed: false,
      ismousemove: false,
      ismouseout: false,
      ismouseover: false,
      isprojection_changed: false,
      isresize: false,
      isrightclick: false,
      istilesloaded: false,
      istilt_changed: false,
      iszoom_changed: false,
      isloaded: false,
    });
  },

  click_to: null,
  bounds_changed_to: null,
  center_changed_to: null,
  dblclick_to: null,
  drag_to: null,
  dragend_to: null,
  dragstart_to: null,
  heading_changed_to: null,
  idle_to: null,
  maptypeid_changed_to: null,
  mousemove_to: null,
  mouseout_to: null,
  mouseover_to: null,
  projection_changed_to: null,
  resize_to: null,
  rightclick_to: null,
  tilesloaded_to: null,
  tilt_changed_to: null,
  zoom_changed_to: null,
  loaded_to: null,

  actions: {
    click: function() {
      console.log(...arguments);
      this.controller.set('isclick', true);
      if(this.get('click_to')) {
        window.clearTimeout(this.get('click_to'));
      }
      this.set(
        'click_to',
        window.setTimeout(() => this._debounceRemove('isclick'), 300)
      );
    },
    bounds_changed: function() {
      this.controller.set('isbounds_changed',true);
      if(this.get('bounds_changed_to')) {
        window.clearTimeout(this.get('bounds_changed_to'));
      }
      this.set(
        'bounds_changed_to',
        window.setTimeout(() => this._debounceRemove('isbounds_changed'), 300)
      );
    },
    center_changed: function() {
      this.controller.set('iscenter_changed', true);
      if(this.get('center_changed_to')) {
        window.clearTimeout(this.get('center_changed_to'));
      }
      this.set(
        'center_changed_to',
        window.setTimeout(() => this._debounceRemove('iscenter_changed'), 300)
      );
    },
    dblclick: function() {
      this.controller.set('isdblclick', true);
      if(this.get('dblclick_to')) {
        window.clearTimeout(this.get('dblclick_to'));
      }
      this.set(
        'dblclick_to',
        window.setTimeout(() => this._debounceRemove('isdblclick'), 300)
      );
    },
    drag: function() {
      this.controller.set('isdrag', true);
      if(this.get('drag_to')) {
        window.clearTimeout(this.get('drag_to'));
      }
      this.set(
        'drag_to',
        window.setTimeout(() => this._debounceRemove('isdrag'), 300)
      );
    },
    dragend: function() {
      this.controller.set('isdragend', true);
      if(this.get('dragend_to')) {
        window.clearTimeout(this.get('dragend_to'));
      }
      this.set(
        'dragend_to',
        window.setTimeout(() => this._debounceRemove('isdragend'), 300)
      );
    },
    dragstart: function() {
      this.controller.set('isdragstart', true);
      if(this.get('dragstart_to')) {
        window.clearTimeout(this.get('dragstart_to'));
      }
      this.set(
        'dragstart_to',
        window.setTimeout(() => this._debounceRemove('isdragstart'), 300)
      );
    },
    heading_changed: function() {
      this.controller.set('isheading_changed', true);
      if(this.get('heading_changed_to')) {
        window.clearTimeout(this.get('heading_changed_to'));
      }
      this.set(
        'heading_changed_to',
        window.setTimeout(() => this._debounceRemove('isheading_changed'), 300)
      );
    },
    idle: function() {
      this.controller.set('isidle', true);
      if(this.get('idle_to')) {
        window.clearTimeout(this.get('idle_to'));
      }
      this.set(
        'idle_to',
        window.setTimeout(() => this._debounceRemove('isidle'), 300)
      );
    },
    maptypeid_changed: function() {
      this.controller.set('ismaptypeid_changed', true);
      if(this.get('maptypeid_changed_to')) {
        window.clearTimeout(this.get('maptypeid_changed_to'));
      }
      this.set(
        'maptypeid_changed_to',
        window.setTimeout(() => this._debounceRemove('ismaptypeid_changed'), 300)
      );
    },
    mousemove: function() {
      this.controller.set('ismousemove', true);
      if(this.get('mousemove_to')) {
        window.clearTimeout(this.get('mousemove_to'));
      }
      this.set(
        'mousemove_to',
        window.setTimeout(() => this._debounceRemove('ismousemove'), 300)
      );
    },
    mouseout: function() {
      this.controller.set('ismouseout', true);
      if(this.get('mouseout_to')) {
        window.clearTimeout(this.get('mouseout_to'));
      }
      this.set(
        'mouseout_to',
        window.setTimeout(() => this._debounceRemove('ismouseout'), 300)
      );
    },
    mouseover: function() {
      this.controller.set('ismouseover', true);
      if(this.get('mouseover_to')) {
        window.clearTimeout(this.get('mouseover_to'));
      }
      this.set(
        'mouseover_to',
        window.setTimeout(() => this._debounceRemove('ismouseover'), 300)
      );
    },
    projection_changed: function() {
      this.controller.set('isprojection_changed', true);
      if(this.get('projection_changed_to')) {
        window.clearTimeout(this.get('projection_changed_to'));
      }
      this.set(
        'projection_changed_to',
        window.setTimeout(() => this._debounceRemove('isprojection_changed'), 300)
      );
    },
    resize: function() {
      this.controller.set('isresize', true);
      if(this.get('resize_to')) {
        window.clearTimeout(this.get('resize_to'));
      }
      this.set(
        'resize_to',
        window.setTimeout(() => this._debounceRemove('isresize'), 300)
      );
    },
    rightclick: function() {
      this.controller.set('isrightclick', true);
      if(this.get('rightclick_to')) {
        window.clearTimeout(this.get('rightclick_to'));
      }
      this.set(
        'rightclick_to',
        window.setTimeout(() => this._debounceRemove('isrightclick'), 300)
      );
    },
    tilesloaded: function() {
      this.controller.set('istilesloaded', true);
      if(this.get('tilesloaded_to')) {
        window.clearTimeout(this.get('tilesloaded_to'));
      }
      this.set(
        'tilesloaded_to',
        window.setTimeout(() => this._debounceRemove('istilesloaded'), 300)
      );
    },
    tilt_changed: function() {
      this.controller.set('istilt_changed', true);
      if(this.get('tilt_changed_to')) {
        window.clearTimeout(this.get('tilt_changed_to'));
      }
      this.set(
        'tilt_changed_to',
        window.setTimeout(() => this._debounceRemove('istilt_changed'), 300)
      );
    },
    zoom_changed: function() {
      this.controller.set('iszoom_changed', true);
      if(this.get('zoom_changed_to')) {
        window.clearTimeout(this.get('zoom_changed_to'));
      }
      this.set(
        'zoom_changed_to',
        window.setTimeout(() => this._debounceRemove('iszoom_changed'), 300)
      );
    },
    loaded: function() {
      this.controller.set('isloaded', true);
      if(this.get('loaded_to')) {
        window.clearTimeout(this.get('loaded_to'));
      }
      this.set(
        'loaded_to',
        window.setTimeout(() => this._debounceRemove('isloaded'), 300)
      );
    }
  },

  _debounceRemove(event) {
    this.controller.set(event, false);
  }
});