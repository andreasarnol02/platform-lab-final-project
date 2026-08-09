const transformImportMetaHot = () => ({
  name: "transform-import-meta-hot",
  visitor: {
    MemberExpression(path) {
      const { object, property } = path.node;
      if (
        object.type === "MetaProperty" &&
        object.meta.name === "import" &&
        object.property.name === "meta" &&
        property.type === "Identifier" &&
        property.name === "hot"
      ) {
        path.replaceWith({ type: "Identifier", name: "undefined" });
      }
    },
  },
});

// Jest runs in CommonJS, where `import.meta` is a syntax error. Vite replaces
// `import.meta.env` natively at build time, so this rewrite is test-only.
const transformImportMetaEnv = () => ({
  name: "transform-import-meta-env",
  visitor: {
    MemberExpression(path) {
      if (process.env.NODE_ENV !== "test") return;
      const { object, property } = path.node;
      if (
        object.type === "MetaProperty" &&
        object.meta.name === "import" &&
        object.property.name === "meta" &&
        property.type === "Identifier" &&
        property.name === "env"
      ) {
        path.replaceWithSourceString("process.env");
      }
    },
  },
});

module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: ["babel-plugin-transform-import-meta", transformImportMetaHot, transformImportMetaEnv],
};
