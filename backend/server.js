import "dotenv/config";
import app from "./src/app.js";
import connectDb from "./src/config/db.js";
import seedAdmin from "./src/seed/admin.seed.js";
const PORT = process.env.PORT || 3000;

connectDb()
  .then(async() => {
    console.log("Database Connected");
    await seedAdmin()
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database Connection Failed:", err.message);
  });
  