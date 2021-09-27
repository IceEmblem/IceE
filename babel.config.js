module.exports = {
  presets: [
    // 必须的
    "@babel/env", 
    // jsx 必须的
    "@babel/preset-react", 
    // ts 必须的
    "@babel/preset-typescript"
  ],
  "plugins": [
    [
      "module-resolver",
      {
        "root": [
          "static"
        ]
      }
    ]
  ]
};
