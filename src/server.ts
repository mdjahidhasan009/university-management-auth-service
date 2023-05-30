import mongoose from 'mongoose';
import app from "./app";
import config from "./config";

const PORT = process.env.PORT || 3010;
const boostrap = async () => {
    try {
        await mongoose.connect(config.database_url as string);
        console.log("Database is connected successfully")
        app.listen(config.port, () => console.log(`Server is running on port = `, config.port));
    } catch(e) {
        console.error("Failed to connect database", e);
    }
}

boostrap();