import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv"; 
import express from "express";

dotenv.config();

// เชื่อมต่อ PostgreSQL ใน Docker โดยดึงค่าจาก .env
const sequelize = new Sequelize(
  "product_db",
  "dev_user",
  "dev_password",
  {
    host: "postgres_db",
    port: 5432,
    dialect: "postgres",
    logging: false,
  }
);

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL Database via Docker!");
    await sequelize.sync();
    console.log("Table synchronized!");
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
};

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || process.env.BACKEND_PORT || 5000;

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});

export { sequelize, Product, connectDB, app };