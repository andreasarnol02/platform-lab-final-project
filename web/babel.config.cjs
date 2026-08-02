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

module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: ["babel-plugin-transform-import-meta", transformImportMetaHot],
};
