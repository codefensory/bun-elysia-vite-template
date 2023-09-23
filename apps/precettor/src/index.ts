import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";

const isProd = Bun.env.NODE_ENV === "production";

const htmlReact = Bun.file(
  import.meta.dir +
    (isProd ? "/../../visivo/dist/index.html" : "/../develop/appDev.html")
);

const app = new Elysia().use(html()).use(
  staticPlugin({
    assets: `${import.meta.dir}${
      isProd ? "/../../visivo/dist" : "/../../visivo/public"
    }`,
    prefix: "/",
  })
);

if (!isProd) {
  app.use(
    staticPlugin({
      assets: `${import.meta.dir}/../../visivo/src`,
      prefix: "/src",
    })
  );
}

app.get("/", ({ set }) => {
  set.redirect = "/app";
});

app.group("/app", (app) =>
  app.get("/", () => htmlReact.text()).get("/*", () => htmlReact.text())
);

app.group("/api", (app) => app.get("/", () => "Hola mundo"));

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
