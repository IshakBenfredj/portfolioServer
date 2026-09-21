const Product = require('../models/product');
const { uploadImage, uploadMultipleImages } = require('../uploadImage');

// GET all products
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

// GET single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};

// POST add new product
const addProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      oldPrice,
      category,
      shortDesc,
      description,
      image,
      images,
      demoUrl,
      sections,
      tags,
      status,
    } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required" });
    }

    // Process gallery images first (avoids duplicate upload of primary image)
    let uploadedImages = [];
    if (Array.isArray(images) && images.length > 0) {
      uploadedImages = await uploadMultipleImages(images);
    } else if (image) {
      const singleUrl = await uploadImage(image);
      if (singleUrl) uploadedImages = [singleUrl];
    }

    let primaryImageUrl = uploadedImages[0] || "";
    if (!primaryImageUrl && image) {
      primaryImageUrl = await uploadImage(image);
      if (primaryImageUrl && uploadedImages.length === 0) {
        uploadedImages = [primaryImageUrl];
      }
    }

    // Format tags if string
    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    // Parse sections if string
    let parsedSections = sections;
    if (typeof sections === 'string') {
      try {
        parsedSections = JSON.parse(sections);
      } catch (e) {
        parsedSections = [];
      }
    }

    const newProduct = new Product({
      title,
      price,
      oldPrice: oldPrice || "",
      category: category || "templates",
      shortDesc: shortDesc || "",
      description: description || "",
      image: primaryImageUrl,
      images: uploadedImages,
      demoUrl: demoUrl || "",
      sections: Array.isArray(parsedSections) ? parsedSections : [],
      tags: Array.isArray(parsedTags) ? parsedTags : [],
      status: status || "ready",
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product", error: error.message });
  }
};

// PUT edit product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      price,
      oldPrice,
      category,
      shortDesc,
      description,
      image,
      images,
      demoUrl,
      sections,
      tags,
      status,
    } = req.body;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let uploadedImages = existingProduct.images || [];
    if (Array.isArray(images)) {
      uploadedImages = await uploadMultipleImages(images);
    }

    let primaryImageUrl = uploadedImages[0] || existingProduct.image;
    if (image && !uploadedImages.includes(image) && !image.startsWith('http')) {
      const newPrimary = await uploadImage(image);
      if (newPrimary) {
        primaryImageUrl = newPrimary;
        if (!uploadedImages.includes(newPrimary)) {
          uploadedImages.unshift(newPrimary);
        }
      }
    }

    let parsedTags = tags !== undefined ? tags : existingProduct.tags;
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    let parsedSections = sections !== undefined ? sections : existingProduct.sections;
    if (typeof sections === 'string') {
      try {
        parsedSections = JSON.parse(sections);
      } catch (e) {
        parsedSections = existingProduct.sections;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title: title !== undefined ? title : existingProduct.title,
        price: price !== undefined ? price : existingProduct.price,
        oldPrice: oldPrice !== undefined ? oldPrice : existingProduct.oldPrice,
        category: category !== undefined ? category : existingProduct.category,
        shortDesc: shortDesc !== undefined ? shortDesc : existingProduct.shortDesc,
        description: description !== undefined ? description : existingProduct.description,
        image: primaryImageUrl,
        images: uploadedImages,
        demoUrl: demoUrl !== undefined ? demoUrl : existingProduct.demoUrl,
        sections: parsedSections,
        tags: parsedTags,
        status: status !== undefined ? status : existingProduct.status,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error editing product:", error);
    res.status(500).json({ message: "Failed to edit product", error: error.message });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully", id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  editProduct,
  deleteProduct,
};
