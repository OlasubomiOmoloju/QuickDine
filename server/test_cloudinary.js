import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log(
    "API key:",
    process.env.CLOUDINARY_API_KEY ? "Present" : "Missing"
);
console.log(
    "API secret:",
    process.env.CLOUDINARY_API_SECRET ? "Present" : "Missing"
);

const testGif = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
);

cloudinary.uploader
    .upload_stream(
        { folder: "QuickDine_test" },
        (error, result) => {
            if (error) {
                console.error("Cloudinary upload failed:");
                console.error(error);
            } else {
                console.log("Cloudinary upload succeeded!");
                console.log(result);
            }
        }
    )
    .end(testGif);