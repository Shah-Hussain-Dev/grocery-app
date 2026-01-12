import "dotenv/config";
import mongoose from "mongoose";
import { Category, Product } from "../models/index.js";
import { categories, products } from "./seedData.js";
import { MONGO_URI } from "../config/config.js";

async function seedDatabase(params) {
    try {
        await mongoose.connect(MONGO_URI)
        await Product.deleteMany({});
        await Category.deleteMany({});

        const categoryDoc = await Category.insertMany(categories);
        const categoryMap = categoryDoc.reduce((map,category)=>{
            map[category.name] = category._id;
            return map
            
        },{})
        const productWithCategoryIds = products.map((product) => ({
            ...product,
            category: categoryMap[product.category]
        }));
        await Product.insertMany(productWithCategoryIds);
        console.log("Database Seed Successfully!")
    } catch (error) {
        console.log("Error",error)
    }finally{
        mongoose.connection.close()
    }
}

seedDatabase();