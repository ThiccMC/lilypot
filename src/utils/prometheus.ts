export interface Metric {
  name: string;
  labels?: { [key: string]: string };
  value: number;
}

/**
 *
 * @param metrics yea a list of metrics
 * @returns very raw data should be return
 */
export default function makeMetrics(metrics: Metric[]): string {
  return (
    metrics
      .map(
        ({ name, labels, value }) =>
          `${name}${
            labels && Object.entries(labels).length > 0
              ? `{${Object.entries(labels)
                  .map(([k, v]) => `${k}="${v}"`)
                  .join(",")}}`
              : ""
          } ${value}`
      )
      .join("\n") + "\n"
  );
}
