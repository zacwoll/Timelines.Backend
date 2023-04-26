import esbuild from "esbuild";

async function build(options = {}) {
  // Define input and output paths
  const input = "server.ts";
  const output = "built/backend.js";

  try {
    // Merge default and custom configuration options
    const mergedOptions = {
      sourcemap: true,
      minify: true,
      platform: "node",
      target: "node14",
      verbose: true, // enable verbose logging
      logLevel: "verbose",
      ...options,
    };

    console.log("Starting build process...");

    // Run esbuild to build the project
    await esbuild.build({
      entryPoints: [input],
      outfile: output,
      bundle: true,
      ...mergedOptions,
    });
    
    console.log("Build process complete.");
    
  } catch (error) {
    console.error("Build failed!", error);
    process.exit(1);
  }
}

export default build;
