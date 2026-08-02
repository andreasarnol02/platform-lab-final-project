const bcrypt = require("bcrypt");
const Customer = require("../models/Customer");
const generateToken = require("../utils/generateToken");
const Seller = require("../models/Seller");

// Register Customer
const registerCustomer = async (req, res) => {
    try {

        const { name, email, password, phone, address } = req.body;

        // cek email
        const existingCustomer = await Customer.findOne({ email });

        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const customer = await Customer.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address
        });

        res.status(201).json({
            success: true,
            message: "Customer registered successfully",
            token: generateToken(customer._id, "customer"),
            data: customer
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Login Customer
const loginCustomer = async (req, res) => {
  try {

    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah"
      });
    }

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah"
      });
    }

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      token: generateToken(customer._id, "customer"),
      data: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

//Get Profile
const getProfile = async (req, res) => {
    try {

        const customer = await Customer.findById(req.user.id).select("-password");

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer tidak ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile berhasil diambil",
            data: customer
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

//Register Seller
const registerSeller = async (req, res) => {
    try {

        const { storeName, ownerName, email, password, phone } = req.body;

        const existingSeller = await Seller.findOne({ email });

        if (existingSeller) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const seller = await Seller.create({
            storeName,
            ownerName,
            email,
            password: hashedPassword,
            phone
        });

        res.status(201).json({
            success: true,
            message: "Seller registered successfully",
            token: generateToken(seller._id, "seller"),
            data: {
                id: seller._id,
                storeName: seller.storeName,
                ownerName: seller.ownerName,
                email: seller.email,
                phone: seller.phone
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const loginSeller = async (req, res) => {
    try {

        const { email, password } = req.body;

        const seller = await Seller.findOne({ email });

        if (!seller) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah"
            });
        }

        const isMatch = await bcrypt.compare(password, seller.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah"
            });
        }

        res.status(200).json({
            success: true,
            message: "Login berhasil",
            token: generateToken(seller._id, "seller"),
            data: {
                id: seller._id,
                storeName: seller.storeName,
                ownerName: seller.ownerName,
                email: seller.email,
                phone: seller.phone
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    registerCustomer,
    loginCustomer,
    getProfile,
    registerSeller,
    loginSeller
};
    
    