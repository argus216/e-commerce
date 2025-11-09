import mongoose from "mongoose";

const connection = {
    isConnected: 0,
};

export const dbConn = async () => {
    if (connection.isConnected) return;
    try {
        const con = await mongoose.connect(process.env.DATABASE_URL!);
        connection.isConnected = con.connections[0].readyState;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};
