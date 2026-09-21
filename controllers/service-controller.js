const Service = require("../models/service.js");
const uploadImage = require("../uploadImage.js");
const cloudinary = uploadImage.cloudinary || require("cloudinary").v2;

const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(201).json(services);
  } catch (error) {
    res.status(500).json({ error: "problem" });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: "problem" });
  }
};

const addService = async (req, res) => {
  try {
    const { title, details, image } = req.body;
    const url = await uploadImage(image);
    const service = await Service.create({ title, details, image: url });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: "problem" });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve the image URL from the database
    const serviceItem = await Service.findById(id);
    const imageUrl = serviceItem?.image;

    // Delete the document from MongoDB
    await Service.findByIdAndDelete(id);

    // Delete the image from Cloudinary
    if (imageUrl) {
      const publicId = imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    res.status(201).json({ message: "ok" });
  } catch (error) {
    res.status(500).json({ error: "problem" });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, details, image } = req.body;

    let updateData = { title, details };

    if (image && image.startsWith("data:image")) {
      const url = await uploadImage(image);
      updateData.image = url;
    } else if (image) {
      updateData.image = image;
    }

    const updated = await Service.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({ error: "problem" });
  }
};

module.exports = {
  getServices,
  getServiceById,
  addService,
  deleteService,
  updateService,
};
