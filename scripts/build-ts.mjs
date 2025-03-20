import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/assets/main.ts"],
  outfile: "src/assets/build/main.js",
  bundle: true,
  minify: true,
  target: ["es2020"]
});
