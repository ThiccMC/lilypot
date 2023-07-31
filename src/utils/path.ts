import { normalize } from "path/posix";

export default (version: number) => (url: string) =>
  normalize(`/api/v${version}/${url}`);
