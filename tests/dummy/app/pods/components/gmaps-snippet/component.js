import Component from 'ember-component';

export default Component.extend({
  header: 'text',
  type: 'handlebars',
  didInsertElement() {
    // Fix disappearing text
    this.$('.file .blob-wrapper').css({overflow: 'visible'});
  }
});
