import { MemoryStorage } from "./memoryStorage.js";
import { WebStorage } from "./webStorage.js";

const _global = (typeof window !== 'undefined' ? window : global || {});

/**
 * @type {{install: (function(Object, Object): WebStorage)}}
 */
const VueStorage = {
  /**
   * Install plugin
   *
   * @param {Object} Vue
   * @param {Object} options
   * @returns {WebStorage}
   */
  install(Vue, options = {}) {
    const _options = Object.assign({}, options, {
      storage: options.storage || "local",
      name: options.name || "ls"
    });

    let storage = createStorage(_options);
    Vue[_options.name] = storage; //  使用示例： Vue.ls
    Object.defineProperty(Vue.prototype, `$${_options.name}`, {
      //Define $ls property
      get() {
        return storage;
      }
    });
  }

};

function createStorage(_options) {
  if (_options.storage && ["memory", "local", "session"].indexOf(_options.storage) === -1 ) {
    throw new Error(`Vue-ls: Storage "${_options.storage}" is not supported`);
  }

  let store = null;

  // eslint-disable-line
  switch (_options.storage) {
    case "local":
      store = "localStorage" in _global ? _global.localStorage : null;
      break;
    case "session":
      store = "sessionStorage" in _global ? _global.sessionStorage : null;
      break;
    case "memory":
      store = MemoryStorage;
      break;
  }

  if (!store) {
    store = MemoryStorage;
    console.error(`Vue-ls: Storage "${_options.storage}" is not supported your system, use memory storage`);
  }

  const ls = new WebStorage(store);
  ls.setOptions(Object.assign(ls.options, { namespace: "" }, _options || {}));
  return ls;
}

_global.VueStorage = VueStorage;

export default VueStorage;
