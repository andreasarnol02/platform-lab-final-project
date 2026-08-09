require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const connectDB = require("./config/db");
const Customer = require("./models/customer");
const Seller = require("./models/seller");
const Product = require("./models/product");
const Cart = require("./models/cart");
const Order = require("./models/order");

const seedData = async () => {
    try {
        await connectDB();

        console.log("🧹 Clearing existing database collections...");
        await Promise.all([
            Customer.deleteMany({}),
            Seller.deleteMany({}),
            Product.deleteMany({}),
            Cart.deleteMany({}),
            Order.deleteMany({}),
        ]);

        console.log("🔑 Hashing passwords...");
        const defaultPassword = await bcrypt.hash("password123", 10);

        console.log("👤 Creating Customer & Sellers...");
        const customer = await Customer.create({
            name: "John Doe",
            email: "customer@example.com",
            password: defaultPassword,
            phone: "+62 812 3456 7890",
            address: "Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta 12190",
        });

        const seller1 = await Seller.create({
            storeName: "TechPro Store",
            ownerName: "Alice Tech",
            email: "seller@example.com",
            password: defaultPassword,
            phone: "+62 811 9876 5432",
        });

        const seller2 = await Seller.create({
            storeName: "Fashion Hub",
            ownerName: "Bob Style",
            email: "seller2@example.com",
            password: defaultPassword,
            phone: "+62 813 1122 3344",
        });

        console.log("📦 Creating Sample Products...");
        const products = await Product.create([
            {
                seller: seller1._id,
                sellerStoreName: seller1.storeName,
                name: "Wireless Noise-Canceling Headphones",
                description: "Premium over-ear wireless headphones with active noise cancellation and 30-hour battery life.",
                price: 1499000,
                stock: 25,
                category: "Electronics",
                imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
                isActive: true,
            },
            {
                seller: seller1._id,
                sellerStoreName: seller1.storeName,
                name: "Smart Watch Ultra Series",
                description: "Advanced fitness tracker with AMOLED display, heart rate sensor, GPS, and water resistance.",
                price: 2299000,
                stock: 15,
                category: "Electronics",
                imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
                isActive: true,
            },
            {
                seller: seller1._id,
                sellerStoreName: seller1.storeName,
                name: "Ergonomic Mechanical Keyboard",
                description: "Custom RGB mechanical keyboard with tactile switches and durable PBT keycaps.",
                price: 899000,
                stock: 30,
                category: "Electronics",
                imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
                isActive: true,
            },
            {
                seller: seller2._id,
                sellerStoreName: seller2.storeName,
                name: "Classic Denim Jacket",
                description: "Timeless vintage wash denim jacket made from 100% premium cotton.",
                price: 450000,
                stock: 50,
                category: "Fashion",
                imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
                isActive: true,
            },
            {
                seller: seller2._id,
                sellerStoreName: seller2.storeName,
                name: "Minimalist Leather Backpack",
                description: "Sleek and spacious genuine leather backpack for laptops up to 15 inches.",
                price: 750000,
                stock: 20,
                category: "Fashion",
                imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
                isActive: true,
            },
            {
                seller: seller2._id,
                sellerStoreName: seller2.storeName,
                name: "Stainless Steel Insulated Water Bottle",
                description: "Keep cold drinks cold for 24h and hot drinks hot for 12h. BPA-free 750ml bottle.",
                price: 185000,
                stock: 40,
                category: "Home & Living",
                imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
                isActive: true,
            },
        ]);

        console.log("🛒 Creating Initial Cart...");
        await Cart.create({
            customer: customer._id,
            items: [
                {
                    product: products[0]._id,
                    quantity: 1,
                },
                {
                    product: products[3]._id,
                    quantity: 2,
                },
            ],
        });

        console.log("📜 Creating Initial Sample Order...");
        await Order.create({
            customer: customer._id,
            seller: seller1._id,
            items: [
                {
                    product: products[1]._id,
                    name: products[1].name,
                    quantity: 1,
                    price: products[1].price,
                },
            ],
            totalPrice: products[1].price,
            shippingAddress: customer.address,
            paymentMethod: "Transfer",
            status: "PAID",
        });

        console.log("✅ Seed completed successfully!");
        console.log("\n--- TEST ACCOUNTS ---");
        console.log("Customer Account : customer@example.com / password123");
        console.log("Seller Account 1 : seller@example.com / password123 (TechPro Store)");
        console.log("Seller Account 2 : seller2@example.com / password123 (Fashion Hub)");
        console.log("---------------------\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedData();
