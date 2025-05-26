const Product = require("../models/Product");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const path = require("path");
const fs = require("fs");
const OrderItem = require("../models/OrderItem");
const sequelize = require("../config/db");
const { Op } = require("sequelize");
const Order = require("../models/Order");
const User = require("../models/User");
const Contact = require("../models/ContactUs");
const Rating = require("../models/Ratings");

// Dashboard Counter
exports.dashboardCounter = async (req, res) => {
  try {
    const category = await Category.count();
    const subcat = await SubCategory.count();
    const products = await Product.count();
    const orders = await Order.count();
    const users = await User.count();
    const contact = await Contact.count();
    const reviews = await Rating.count();

    const counters = {
      category,
      subcat,
      products,
      orders,
      users,
      contact,
      reviews,
    };

    return res.status(200).json(counters);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      sub_cate_id,
      price,
      shortDescription,
      longDescription,
      originalQty,
      features,
      howToUse,
      suitableSurfaces,
      volume,
      ingredients,
      scent,
      phLevel,
      shelfLife,
      madeIn,
      packaging,
      combos,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !categoryId ||
      !sub_cate_id ||
      !price ||
      !shortDescription ||
      !longDescription ||
      !originalQty ||
      !suitableSurfaces ||
      !ingredients
    ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Parse features
    let parsedFeatures = [];
    try {
      parsedFeatures = JSON.parse(features);
      if (!Array.isArray(parsedFeatures)) {
        throw new Error("Features must be an array");
      }
    } catch (e) {
      return res.status(400).json({ message: "Invalid features format" });
    }

    // Parse howToUse
    let parsedHowToUse = [];
    try {
      parsedHowToUse = JSON.parse(howToUse);
      if (!Array.isArray(parsedHowToUse)) {
        throw new Error("How to Use must be an array");
      }
    } catch (e) {
      return res.status(400).json({ message: "Invalid how to use format" });
    }

    // Handle uploaded images
    const imagePaths = req.files
      ? req.files.map((file) =>
          path.join("uploads", file.filename).replace(/\\/g, "/")
        )
      : [];

    // Validate category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = await SubCategory.findByPk(sub_cate_id);
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    // Validate numeric fields
    const parsedVolume = volume ? parseFloat(volume) : null;
    if (parsedVolume !== null && parsedVolume < 0) {
      return res.status(400).json({ message: "Volume cannot be negative" });
    }

    const parsedPhLevel = phLevel ? parseFloat(phLevel) : null;
    if (parsedPhLevel !== null && (parsedPhLevel < 0 || parsedPhLevel > 14)) {
      return res
        .status(400)
        .json({ message: "pH Level must be between 0 and 14" });
    }

    const parsedShelfLife = shelfLife ? parseInt(shelfLife) : null;
    if (parsedShelfLife !== null && parsedShelfLife < 0) {
      return res.status(400).json({ message: "Shelf Life cannot be negative" });
    }

    const parsedOriginalQty = parseInt(originalQty);
    if (parsedOriginalQty < 0) {
      return res.status(400).json({ message: "Original quantity cannot be negative" });
    }

    // Convert combos to boolean
    const parsedCombos = combos === "true" || combos === true;

    // Create product with originalQty, purchaseQty, and remainingQty
    const product = await Product.create({
      name,
      categoryId,
      sub_cate_id,
      price: parseFloat(price),
      shortDescription,
      longDescription,
      originalQty: parsedOriginalQty,
      purchaseQty: 0, // Set to 0 as per requirement
      remainingQty: parsedOriginalQty, // remainingQty = originalQty - purchaseQty
      features: parsedFeatures,
      howToUse: parsedHowToUse,
      suitableSurfaces,
      images: imagePaths,
      volume: parsedVolume,
      ingredients,
      scent,
      phLevel: parsedPhLevel,
      shelfLife: parsedShelfLife,
      madeIn,
      packaging,
      averageRatings: 0,
      totalReviews: 0,
      combos: parsedCombos,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      categoryId,
      sub_cate_id,
      price,
      shortDescription,
      longDescription,
      originalQty,
      features,
      howToUse,
      suitableSurfaces,
      volume,
      ingredients,
      scent,
      phLevel,
      shelfLife,
      madeIn,
      packaging,
      combos,
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Parse features
    let parsedFeatures = product.features;
    if (features) {
      try {
        parsedFeatures = JSON.parse(features);
        if (!Array.isArray(parsedFeatures)) {
          throw new Error("Features must be an array");
        }
      } catch (e) {
        return res.status(400).json({ message: "Invalid features format" });
      }
    }

    // Parse howToUse
    let parsedHowToUse = product.howToUse;
    if (howToUse) {
      try {
        parsedHowToUse = JSON.parse(howToUse);
        if (!Array.isArray(parsedHowToUse)) {
          throw new Error("How to Use must be an array");
        }
      } catch (e) {
        return res.status(400).json({ message: "Invalid how to use format" });
      }
    }

    // Handle images
    let imagePaths = product.images;
    if (req.files && req.files.length > 0) {
      if (Array.isArray(product.images)) {
        product.images.forEach((imagePath) => {
          const fullPath = path.join(__dirname, "../", imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }
      imagePaths = req.files.map((file) =>
        path.join("uploads", file.filename).replace(/\\/g, "/")
      );
    }

    // Validate category if provided
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    if (sub_cate_id) {
      const subCategory = await SubCategory.findByPk(sub_cate_id);
      if (!subCategory) {
        return res.status(404).json({ message: "SubCategory not found" });
      }
    }

    // Validate numeric fields
    const parsedVolume =
      volume !== undefined ? parseFloat(volume) : product.volume;
    if (parsedVolume !== null && parsedVolume < 0) {
      return res.status(400).json({ message: "Volume cannot be negative" });
    }

    const parsedPhLevel =
      phLevel !== undefined ? parseFloat(phLevel) : product.phLevel;
    if (parsedPhLevel !== null && (parsedPhLevel < 0 || parsedPhLevel > 14)) {
      return res
        .status(400)
        .json({ message: "pH Level must be between 0 and 14" });
    }

    const parsedShelfLife =
      shelfLife !== undefined ? parseInt(shelfLife) : product.shelfLife;
    if (parsedShelfLife !== null && parsedShelfLife < 0) {
      return res.status(400).json({ message: "Shelf Life cannot be negative" });
    }

    const parsedOriginalQty =
      originalQty !== undefined ? parseInt(originalQty) : product.originalQty;
    if (parsedOriginalQty < 0) {
      return res.status(400).json({ message: "Original quantity cannot be negative" });
    }

    // Convert combos to boolean
    const parsedCombos =
      combos !== undefined
        ? combos === "true" || combos === true
        : product.combos;

    // Calculate remainingQty
    const updatedRemainingQty = parsedOriginalQty - product.purchaseQty;

    // Update product
    await product.update({
      name: name || product.name,
      categoryId: categoryId || product.categoryId,
      sub_cate_id: sub_cate_id || product.sub_cate_id,
      price: price ? parseFloat(price) : product.price,
      shortDescription: shortDescription || product.shortDescription,
      longDescription: longDescription || product.longDescription,
      originalQty: parsedOriginalQty,
      purchaseQty: product.purchaseQty, // Remains unchanged (0 in this controller)
      remainingQty: updatedRemainingQty,
      features: parsedFeatures,
      howToUse: parsedHowToUse,
      suitableSurfaces: suitableSurfaces || product.suitableSurfaces,
      images: imagePaths,
      volume: parsedVolume,
      ingredients: ingredients || product.ingredients,
      scent: scent || product.scent,
      phLevel: parsedPhLevel,
      shelfLife: parsedShelfLife,
      madeIn: madeIn || product.madeIn,
      packaging: packaging || product.packaging,
      combos: parsedCombos,
    });

    res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Get all products with category data
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ["name"],
          as: "Category",
        },
        {
          model: SubCategory,
          attributes: ["sub_cate_name"],
          as: "subcategory",
        },
      ],
    });

    // Transform the response to flatten the category name and include new fields
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
      sub_cate_id: product.sub_cate_id,
      category: product.Category ? product.Category.name : "-",
      sub_category: product.subcategory
        ? product.subcategory.sub_cate_name
        : "-",
      price: product.price,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      originalQty: product.originalQty,
      purchaseQty: product.purchaseQty,
      remainingQty: product.remainingQty,
      features: product.features,
      howToUse: product.howToUse,
      suitableSurfaces: product.suitableSurfaces,
      images: product.images,
      volume: product.volume,
      ingredients: product.ingredients,
      scent: product.scent,
      phLevel: product.phLevel,
      shelfLife: product.shelfLife,
      madeIn: product.madeIn,
      packaging: product.packaging,
      averageRatings: product.averageRatings,
      totalReviews: product.totalReviews,
      combos: product.combos,
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single product by ID
exports.getProducts = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get products for AllProductPage
exports.getProductsForAllProductPage = async (req, res) => {
  try {
    const { page, perPage, filter } = req.body;

    const offset = (page - 1) * perPage;

    const whereClause = {};

    if (filter.category.length > 0) {
      whereClause.categoryId = { [Op.in]: filter.category };
    }

    if (filter.subcat.length > 0) {
      whereClause.sub_cate_id = { [Op.in]: filter.subcat };
    }

    if (filter.price.min !== null || filter.price.max !== null) {
      whereClause.price = {};
      if (filter.price.min !== null) {
        whereClause.price[Op.gte] = filter.price.min;
      }
      if (filter.price.max !== null) {
        whereClause.price[Op.lte] = filter.price.max;
      }
    }

    if (filter.rating.length > 0) {
      whereClause.averageRatings = {
        [Op.or]: filter.rating.map((rating) => ({
          [Op.gte]: rating,
        })),
      };
    }

    const products = await Product.findAll({
      where: whereClause,
      attributes: [
        "id",
        "name",
        "price",
        "images",
        "categoryId",
        "sub_cate_id",
        "averageRatings",
        "combos",
        "originalQty",
        "purchaseQty",
        "remainingQty",
      ],
      include: [
        {
          model: Category,
          attributes: ["name"],
          as: "Category",
        },
        {
          model: SubCategory,
          attributes: ["sub_cate_name"],
          as: "subcategory",
        },
      ],
      limit: perPage,
      offset,
    });

    const totalProducts = await Product.count({
      where: whereClause,
    });

    const formattedProducts = products.map((item) => {
      const productData = item.toJSON();
      return {
        ...productData,
        images:
          typeof productData.images === "string"
            ? JSON.parse(productData.images)
            : productData.images,
      };
    });

    const datas = {
      products: formattedProducts,
      totalProducts: totalProducts,
    };

    res.status(200).json(datas);
  } catch (error) {
    console.error("Error fetching products for AllProductPage:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get new arrivals (sorted by createdAt, limited to 4)
exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: [
        "id",
        "name",
        "price",
        "images",
        "categoryId",
        "sub_cate_id",
        "averageRatings",
        "combos",
        "createdAt",
        "originalQty",
        "purchaseQty",
        "remainingQty",
      ],
      include: [
        {
          model: Category,
          attributes: ["name"],
          as: "Category",
        },
        {
          model: SubCategory,
          attributes: ["sub_cate_name"],
          as: "subcategory",
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 4,
    });

    // Transform the response to match frontend expectations
    const formattedProducts = products.map((item) => {
      const productData = item.toJSON();
      return {
        ...productData,
        images:
          typeof productData.images === "string"
            ? JSON.parse(productData.images)
            : productData.images,
        category: productData.Category ? productData.Category.name : "-",
      };
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Parse images if it's a string
    let images = product.images;
    if (typeof product.images === "string") {
      try {
        images = JSON.parse(product.images);
      } catch (error) {
        console.error("Error parsing images:", error);
        images = [];
      }
    }

    // Ensure images is an array before using forEach
    if (Array.isArray(images) && images.length > 0) {
      images.forEach((imagePath) => {
        const fullPath = path.join(__dirname, "../", imagePath);
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
          } catch (err) {
            console.error(`Error deleting image ${imagePath}:`, err);
          }
        }
      });
    }

    // Delete the product
    await product.destroy();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

exports.getSubCategoryByCategory = async (req, res) => {
  try {
    const { cate_id } = req.params;

    const subCategory = await SubCategory.findAll({
      where: { cate_id: cate_id },
      attributes: ["sub_cate_id", "cate_id", "sub_cate_name", "image"],
      include: [
        {
          model: Category,
          attributes: ["name"],
          as: "Category",
        },
      ],
    });

    res.status(200).json(subCategory);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProductsBySubCategory = async (req, res) => {
  try {
    const { sub_cate_id } = req.params;

    const products = await Product.findAll({
      where: { sub_cate_id: sub_cate_id },
      attributes: [
        "id",
        "name",
        "price",
        "images",
        "categoryId",
        "sub_cate_id",
        "averageRatings",
        "combos",
        "originalQty",
        "purchaseQty",
        "remainingQty",
      ],
      include: [
        {
          model: Category,
          attributes: ["name"],
          as: "Category",
        },
        {
          model: SubCategory,
          attributes: ["sub_cate_name"],
          as: "subcategory",
        },
      ],
    });

    // Transform the response
    const formattedProducts = products.map((item) => {
      const productData = item.toJSON();
      return {
        ...productData,
        images:
          typeof productData.images === "string"
            ? JSON.parse(productData.images)
            : productData.images,
        category: productData.Category ? productData.Category.name : "-",
      };
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Best Sellers
exports.getBestSellers = async (req, res) => {
  try {
    const bestSellers = await Product.findAll({
      attributes: [
        "id",
        "name",
        "price",
        "images",
        "categoryId",
        "sub_cate_id",
        "averageRatings",
        "combos",
        "originalQty",
        "purchaseQty",
        "remainingQty",
      ],
      include: [
        {
          model: Category,
          attributes: ["name"],
          as: "Category",
        },
        {
          model: SubCategory,
          attributes: ["sub_cate_name"],
          as: "subcategory",
        },
        {
          model: OrderItem,
          attributes: [],
          as: "OrderItems",
          required: true,
        },
      ],
      group: ["Product.id", "Category.id"],
      order: [
        [sequelize.fn("SUM", sequelize.col("OrderItems.quantity")), "DESC"],
      ],
      limit: 4,
      raw: true,
      subQuery: false,
    });

    // Transform the response to match frontend expectations
    const formattedProducts = bestSellers.map((item) => {
      // Parse images if it's a string
      let parsedImages = item.images;
      if (typeof item.images === "string") {
        try {
          parsedImages = JSON.parse(item.images);
        } catch (e) {
          console.error("Error parsing images:", e);
          parsedImages = [];
        }
      }

      return {
        id: item.id,
        name: item.name,
        price: item.price,
        image: parsedImages && parsedImages.length > 0 ? parsedImages[0] : "",
        category: item["Category.name"] || "-",
        averageRatings: item.averageRatings,
        combos: item.combos,
        originalQty: item.originalQty,
        purchaseQty: item.purchaseQty,
        remainingQty: item.remainingQty,
      };
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};