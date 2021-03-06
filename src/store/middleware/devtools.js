// Copied from zustand devtools, create issue/open MR when time
export const devtools = function devtools(fn, prefix) {
  return function (set, get, api) {
    var extension;

    try {
      extension =
        window.__REDUX_DEVTOOLS_EXTENSION__ ||
        window.top.__REDUX_DEVTOOLS_EXTENSION__;
    } catch (_unused) {}

    if (!extension) {
      if (
        process.env.NODE_ENV === "development" &&
        typeof window !== "undefined"
      ) {
        console.warn("Please install/enable Redux devtools extension");
      }

      api.devtools = null;
      return fn(set, get, api);
    }

    var namedSet = function namedSet(state, replace, name) {
      set(state, replace);

      if (!api.dispatch) {
        api.devtools.send(api.devtools.prefix + (name || "action"), get());
      }
    };

    var initialState = fn(namedSet, get, api);

    if (!api.devtools) {
      var savedSetState = api.setState;

      api.setState = function (state, replace) {
        savedSetState(state, replace);
        api.devtools.send(api.devtools.prefix + "setState", api.getState());
      };

      api.devtools = extension.connect({
        serialize: true,
        name: prefix,
      });
      api.devtools.prefix = prefix ? prefix + " > " : "";
      api.devtools.subscribe(function (message) {
        var _message$payload;

        if (message.type === "DISPATCH" && message.state) {
          var ignoreState =
            message.payload.type === "JUMP_TO_ACTION" ||
            message.payload.type === "JUMP_TO_STATE";

          if (!api.dispatch && !ignoreState) {
            api.setState(JSON.parse(message.state));
          } else {
            savedSetState(JSON.parse(message.state));
          }
        } else if (
          message.type === "DISPATCH" &&
          ((_message$payload = message.payload) == null
            ? void 0
            : _message$payload.type) === "COMMIT"
        ) {
          api.devtools.init(api.getState());
        }
      });
      api.devtools.init(initialState);
    }

    return initialState;
  };
};
