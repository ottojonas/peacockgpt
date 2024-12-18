const tsNode = require("ts-node");
const path = require("path");

tsNode.register({
  transpileOnly: true,
  compilerOptions: {
    module: "commonjs",
  },
});

const testOpenAIPath = path.resolve(__dirname, "testOpenAI.ts");

require(testOpenAIPath);
