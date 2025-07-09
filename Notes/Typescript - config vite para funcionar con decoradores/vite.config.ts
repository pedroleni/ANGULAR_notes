// vite.config.ts
import { defineConfig } from "vite";
import { transformAsync } from "@babel/core";

export default defineConfig({
  plugins: [
    {
      name: "babel-decorators",
      async transform(code, id) {
        if (!id.endsWith(".ts")) return;

        const result = await transformAsync(code, {
          filename: id,
          babelrc: true,
          configFile: true,
        });

        if (result && result.code) {
          return {
            code: result.code,
            map: result.map,
          };
        }
      },
    },
  ],
});
