import { defineConfig } from "astro/config";
import { resumePdf } from "./src/integrations/resume-pdf";

export default defineConfig({
  site: "https://portfolio.mamahoos.ir",
  integrations: [resumePdf()],
});
