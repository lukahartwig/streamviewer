import "@testing-library/jest-dom";

// @ts-ignore
global.Twitch = {
  Embed: class {
    destroy() {}
  },
};
