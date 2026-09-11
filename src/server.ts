import "dotenv/config";
import { app } from "./app.ts";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Tienda API escuchando en http://localhost:${PORT}`);
  console.log(`Documentacion Swagger en http://localhost:${PORT}/api-docs`);
});
