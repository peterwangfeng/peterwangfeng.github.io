/*
 * @Author: peternodejs 1692655013@qq.com
 * @Date: 2022-11-24 15:08:47
 * @LastEditors: peternodejs 1692655013@qq.com
 * @LastEditTime: 2022-11-29 17:24:57
 * @FilePath: \zxuqian.cn\build\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Application,
  helpers,
  isHttpError,
  Router,
  Status,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { CORS } from "https://deno.land/x/oak_cors@v0.1.1/mod.ts";

const PORT = 8888;
const app = new Application();
app.use(CORS());
app.use(async (context, next) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/.`,
      index: "index.html",
    });
  } catch {
    await next();
  }
});
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      switch (err.status) {
        case Status.NotFound:
          ctx.response.body = { code: Status.NotFound, message: err.message };
          break;
        default:
          ctx.response.body = {
            code: Status.InternalServerError,
            message: err.message,
          };
          break;
      }
    } else {
      // rethrow if you can't handle the error
      ctx.response.body = { code: -1, message: err.message };
    }
  }
});

app.addEventListener("listen", ({ hostname, port, serverType }) => {
  console.log(`${serverType} server running at http://${hostname}:${port}`);
});

app.addEventListener("error", (evt) => {
  // Will log the thrown error to the console.
  // ctx.response.body = {code: -1, message: evt.message}
  console.log(evt.error);
});

// const cert = Deno.readTextFileSync('www.test.com.pem')
// const key = Deno.readTextFileSync('www.test.com-key.pem')

await app.listen({
  // hostname: 'www.test.com',
  port: PORT,
  secure: true,
  // cert,
  // key,
  // alpnProtocols: ["h2", "http/1.1"],
});
