const { http } = require("./http/http");
require("./api/api");
require("./socket/socket");

http.listen(8080, (req, res) => {
  console.log(`서버를 요청 받을 준비가 되었습니다 👩`);
});
