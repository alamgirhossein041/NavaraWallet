import InpageBridgeWeb3 from "./InpageBridgeWeb3";

const EntryScriptWeb3 = {
  entryScriptWeb3: null,
  entryScriptVConsole: null,
  // Cache InpageBridgeWeb3 so that it is immediately available
  async init() {
    this.entryScriptWeb3 = InpageBridgeWeb3;
    return this.entryScriptWeb3;
  },
  async get() {
    // Return from cache

    if (!this.entryScriptWeb3) {
      await this.init();
    }

    return this.entryScriptWeb3;
  },
};

export default EntryScriptWeb3;
