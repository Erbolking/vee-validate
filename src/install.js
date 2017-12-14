import mixin from './mixin';
import directive from './directive';
import Config from './config';
import Validator from './core/validator';
import { warn, isCallable } from './core/utils';

let Vue;

function install (_Vue, options = {}) {
  if (Vue) {
    warn('already installed, Vue.use(VeeValidate) should only be called once.');
    return;
  }

  Vue = _Vue;
  Config.merge(options);
  const { locale, dictionary, i18n } = Config.current;

  if (dictionary) {
    Validator.localize(dictionary); // merge the dictionary.
  }

  // try to watch locale changes.
  if (i18n && i18n._vm && isCallable(i18n._vm.$watch)) {
    i18n._vm.$watch('locale', () => {
      Validator.regenerate();
    });
  }

  if (!i18n) {
    Validator.localize(locale); // set the locale
  }

  Validator.setStrictMode(Config.current.strict);

  Vue.mixin(mixin);
  Vue.directive('validate', directive);
};

function uninstall () {
  Vue = null;
}

export {
  install,
  uninstall
};

export default {
  install,
  uninstall
};
