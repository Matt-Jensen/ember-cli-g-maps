import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('g-autocomplete', 'Integration | Component | g autocomplete', {
  integration: true
});

test('should apply classes and a placeholder property as an input element', function(assert) {
  const placeholder = 'test placeholder';
  this.set('testPlaceholder', placeholder);

  const className = 'test-class';
  this.set('testClass', className);

  this.render(hbs`{{g-autocomplete class=testClass placeholder=testPlaceholder}}`);

  assert.ok(this.$('input').hasClass(className), 'applies class to input element');
  assert.equal(this.$('input').prop('placeholder'), placeholder, 'supports placeholder property');
});
