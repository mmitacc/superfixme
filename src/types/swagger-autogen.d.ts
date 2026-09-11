declare module "swagger-autogen" {
  type SwaggerAutogenOptions = Record<string, unknown>;
  type SwaggerAutogenFn = (
    outputFile: string,
    endpointsFiles: string[],
    doc?: Record<string, unknown>
  ) => Promise<unknown>;

  export default function swaggerAutogen(options?: SwaggerAutogenOptions): SwaggerAutogenFn;
}
