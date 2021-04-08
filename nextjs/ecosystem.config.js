module.exports = {
  apps : [{
    name: "nextjs",
    script: "npm start",
    watch: true,
    exec_mode: "fork",
    cwd: "/app/nextjs", //the directory from which your app will be launched
    args: "", //string containing all arguments passed via CLI to script
  }],
};
