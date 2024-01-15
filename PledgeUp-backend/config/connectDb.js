import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const MONGO_URI =
      process.env.MONGO_URI ||
      "mongodb+srv://{USERNAME}:{PASSWORD}@cluster0.v2loj.mongodb.net/pledgeup?retryWrites=true&w=majority";
    console.log(MONGO_URI);
    const conn = await mongoose.connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`MongoDB Successfully Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`DB-Error:${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
