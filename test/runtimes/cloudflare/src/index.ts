import { testServer } from "./server";

export default {
  async fetch(request: Request): Promise<Response> {
    return await testServer(request);
  },
};
