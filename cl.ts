import { edenTreaty } from "@elysiajs/eden";
import type { App } from "./src/index";

export default function connect(url: string) {
  return edenTreaty<App>(url, {
    
  });
}
