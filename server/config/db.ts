import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => console.log("MongoDB connected successfully"));
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error("MONGODB_URI is not set. Add it to your .env or environment variables.");
            process.exit(1);
        }
        await mongoose.connect(uri);
    } catch (err) {
        console.error("Failed to connect to MongoDB. Check MONGODB_URI, username/password, and Atlas IP whitelist.");
        console.error(err);
        process.exit(1);
    }
}

export default connectDB;