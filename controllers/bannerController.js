const Banner = require('../models/Banner');
const path = require('path');
const fs = require('fs').promises; // For file system operations

// Upload banner image
exports.uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const banner = await Banner.create({
      imageUrl
    });

    res.status(201).json({ message: 'Banner uploaded successfully', banner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during banner upload' });
  }
};

// Get all banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll();
    res.status(200).json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching banners' });
  }
};

// Delete banner
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);

    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    // Delete the image file from the server
    if (banner.imageUrl) {
      const filePath = path.join(__dirname, '..', banner.imageUrl);
      try {
        await fs.unlink(filePath);
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete the banner from the database
    await banner.destroy();
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ error: 'Server error while deleting banner' });
  }
};