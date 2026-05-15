import { expect } from "chai";

import Server from "./server";

describe("online/server.ts", () => {
  describe("construction", () => {
    it("default construction", () => {
      expect(new Server());
      expect(new Server("token123").token).to.equal("token123");
    });
  });
});
