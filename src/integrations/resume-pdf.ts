import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { compileResumePdf } from "../lib/resume-pdf";

export function resumePdf(): AstroIntegration {
  return {
    name: "resume-pdf",
    hooks: {
      "astro:server:setup": ({ server, logger }) => {
        const tmpPdf = join(tmpdir(), "portfolio-resume-dev.pdf");
        let cache: Buffer | undefined;
        const pdf = () => {
          cache ??= compileResumePdf(tmpPdf);
          return cache;
        };

        server.middlewares.use((request, response, next) => {
          if (request.url?.split("?")[0] !== "/resume.pdf") {
            next();
            return;
          }

          try {
            const body = pdf();
            response.statusCode = 200;
            response.setHeader("Content-Type", "application/pdf");
            response.setHeader("Content-Length", String(body.length));
            response.end(body);
          } catch (error) {
            logger.error(String(error));
            response.statusCode = 500;
            response.end("Failed to render resume PDF");
          }
        });
      },
      "astro:build:done": ({ dir, logger }) => {
        const outPath = fileURLToPath(new URL("resume.pdf", dir));
        const body = compileResumePdf(outPath);
        logger.info(`Wrote resume.pdf (${body.length} bytes)`);
      },
    },
  };
}
