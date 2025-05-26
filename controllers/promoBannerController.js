const PromoBanner = require('../models/PromoBanner');
const path = require('path');
const fs = require('fs').promises; // For file system operations

// Create a new promo banner with image upload
exports.createPromoBanner = async (req, res) => {
  try {
    const { title, description, buttonText } = req.body;

    // Validate required fields
    if (!title || !description || !req.file) {
      return res.status(400).json({ error: 'Title, description, and image are required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const promoBanner = await PromoBanner.create({
      title,
      description,
      buttonText,
      imageUrl
    });

    res.status(201).json({ message: 'Promo banner uploaded successfully', promoBanner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during promo banner upload', details: error.message });
  }
};

// Get all promo banners
exports.getAllPromoBanners = async (req, res) => {
  try {
    const promoBanners = await PromoBanner.findAll();
    res.status(200).json(promoBanners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching promo banners', details: error.message });
  }
};

// Get a single promo banner by ID
exports.getPromoBannerById = async (req, res) => {
  try {
    const promoBanner = await PromoBanner.findByPk(req.params.id);
    if (!promoBanner) {
      return res.status(404).json({ error: 'Promo banner not found' });
    }
    res.status(200).json(promoBanner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching promo banner', details: error.message });
  }
};

// Update a promo banner
exports.updatePromoBanner = async (req, res) => {
  try {
    const promoBanner = await PromoBanner.findByPk(req.params.id);
    if (!promoBanner) {
      return res.status(404).json({ error: 'Promo banner not found' });
    }

    const { title, description, buttonText } = req.body;
    let imageUrl = promoBanner.imageUrl;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // If a new image is uploaded, delete the old one and update the imageUrl
    if (req.file) {
      if (promoBanner.imageUrl) {
        const oldFilePath = path.join(__dirname, '..', promoBanner.imageUrl);
        try {
          await fs.unlink(oldFilePath);
        } catch (fileError) {
          console.error('Error deleting old file:', fileError);
          // Continue even if file deletion fails
        }
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }

    await promoBanner.update({
      title,
      description,
      buttonText,
      imageUrl
    });

    res.status(200).json({ message: 'Promo banner updated successfully', promoBanner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating promo banner', details: error.message });
  }
};

// Delete a promo banner
exports.deletePromoBanner = async (req, res) => {
  try {
    const promoBanner = await PromoBanner.findByPk(req.params.id);
    if (!promoBanner) {
      return res.status(404).json({ error: 'Promo banner not found' });
    }

    // Delete the image file from the server
    if (promoBanner.imageUrl) {
      const filePath = path.join(__dirname, '..', promoBanner.imageUrl);
      try {
        await fs.unlink(filePath);
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete the promo banner from the database
    await promoBanner.destroy();
    res.status(200).json({ message: 'Promo banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting promo banner:', error);
    res.status(500).json({ error: 'Server error while deleting promo banner', details: error.message });
  }
};