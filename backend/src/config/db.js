import mongoose from "mongoose"
import user from "../models/user.model.js"

const ensureUserIndexes = async () => {
    try {
        await user.collection.dropIndex("email_1")
    } catch (error) {
        if (!["IndexNotFound", "NamespaceNotFound"].includes(error.codeName)) {
            throw error
        }
    }

    await user.collection.createIndex(
        { email: 1 },
        {
            name: "email_1",
            unique: true,
            partialFilterExpression: { email: { $type: "string" } },
        }
    )
}

async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        await ensureUserIndexes()
    } catch (error) {
       console.log(error) 
       throw  error
    }
}
export default connectDb
