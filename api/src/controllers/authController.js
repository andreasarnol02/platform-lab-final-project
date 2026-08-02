const bcrypt = require("bcrypt");
const Customer = require("../models/customer");
const Seller = require("../models/seller");
const generateToken = require("../utils/generateToken");
const { sendServerError, sendWriteError } = require("../utils/httpError");

const customerData = (customer) => ({
    id: customer._id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
});

const sellerData = (seller) => ({
    id: seller._id,
    storeName: seller.storeName,
    ownerName: seller.ownerName,
    email: seller.email,
    phone: seller.phone,
});

const registerCustomer = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        const existingCustomer = await Customer.findOne({ email });

        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        const customer = await Customer.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            phone,
            address,
        });

        return res.status(201).json({
            success: true,
            message: "Customer registered successfully",
            token: generateToken(customer._id, "customer"),
            data: customerData(customer),
        });
    } catch (error) {
        return sendWriteError(res, error);
    }
};

const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;
        const customer = await Customer.findOne({ email });

        if (!customer || !(await bcrypt.compare(password, customer.password))) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login berhasil",
            token: generateToken(customer._id, "customer"),
            data: customerData(customer),
        });
    } catch (error) {
        return sendServerError(res, error);
    }
};

const registerSeller = async (req, res) => {
    try {
        const { storeName, ownerName, email, password, phone } = req.body;
        const existingSeller = await Seller.findOne({ email });

        if (existingSeller) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        const seller = await Seller.create({
            storeName,
            ownerName,
            email,
            password: await bcrypt.hash(password, 10),
            phone,
        });

        return res.status(201).json({
            success: true,
            message: "Seller registered successfully",
            token: generateToken(seller._id, "seller"),
            data: sellerData(seller),
        });
    } catch (error) {
        return sendWriteError(res, error);
    }
};

const loginSeller = async (req, res) => {
    try {
        const { email, password } = req.body;
        const seller = await Seller.findOne({ email });

        if (!seller || !(await bcrypt.compare(password, seller.password))) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login berhasil",
            token: generateToken(seller._id, "seller"),
            data: sellerData(seller),
        });
    } catch (error) {
        return sendServerError(res, error);
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const Model = req.user.type === "seller" ? Seller : Customer;
        const user = await Model.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: req.user.type === "seller" ? sellerData(user) : customerData(user),
        });
    } catch (error) {
        return sendServerError(res, error);
    }
};

module.exports = {
    registerCustomer,
    loginCustomer,
    getCurrentUser,
    registerSeller,
    loginSeller,
};
