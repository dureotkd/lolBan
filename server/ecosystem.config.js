module.exports = {
  apps: [
    {
      name: "myapp",
      script: "./server.js", // 시작할 프로그램
      instances: 1, // CPU 코어 수만큼 프로세스 생성
      exec_mode: "cluster", // 클러스터 모드
      autorestart: false,
      watch: false,
    },
  ],
};
