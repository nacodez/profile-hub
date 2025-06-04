const mongoose = require("mongoose");

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

const createIndexes = async () => {
  const User = require("./User");
  const Profile = require("./Profile");

  await User.collection.createIndex({ userId: 1 }, { unique: true });
  await User.collection.createIndex({ createdAt: -1 });
  await User.collection.createIndex({ email: 1 }, { sparse: true });

  await Profile.collection.createIndex({ userId: 1 }, { unique: true });
  await Profile.collection.createIndex(
    { "basicDetails.email": 1 },
    { sparse: true }
  );
  await Profile.collection.createIndex({ updatedAt: -1 });

  console.log("Database indexes created successfully");
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    await createIndexes();

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
