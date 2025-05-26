const InstaSection = require('../models/InstaSection');
const path = require('path');
const fs = require('fs').promises;

// Upload InstaSection image
exports.createInstaSection = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const instaSection = await InstaSection.create({
      imageUrl
    });

    res.status(201).json({ message: 'InstaSection created successfully', instaSection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during InstaSection creation' });
  }
};

// Get all InstaSections
exports.getAllInstaSections = async (req, res) => {
  try {
    const instaSections = await InstaSection.findAll();
    res.status(200).json(instaSections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching InstaSections' });
  }
};

// Get InstaSection by ID
exports.getInstaSectionById = async (req, res) => {
  try {
    const instaSection = await InstaSection.findByPk(req.params.id);
    if (!instaSection) {
      return res.status(404).json({ error: 'InstaSection not found' });
    }
    res.status(200).json(instaSection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching InstaSection' });
  }
};

// Update InstaSection
exports.updateInstaSection = async (req, res) => {
  try {
    const instaSection = await InstaSection.findByPk(req.params.id);
    if (!instaSection) {
      return res.status(404).json({ error: 'InstaSection not found' });
    }

    const updateData = {};
    if (req.file) {
      // Delete old image if a new one is uploaded
      if (instaSection.imageUrl) {
        const oldFilePath = path.join(__dirname, '..', instaSection.imageUrl);
        try {
          await fs.unlink(oldFilePath);
        } catch (fileError) {
          console.error('Error deleting old file:', fileError);
        }
      }
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    await instaSection.update(updateData);
    res.status(200).json({ message: 'InstaSection updated successfully', instaSection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating InstaSection' });
  }
};

// Delete InstaSection
exports.deleteInstaSection = async (req, res) => {
  try {
    const { id } = req.params;
    const instaSection = await InstaSection.findByPk(id);

    if (!instaSection) {
      return res.status(404).json({ error: 'InstaSection not found' });
    }

    // Delete the image file from the server
    if (instaSection.imageUrl) {
      const filePath = path.join(__dirname, '..', instaSection.imageUrl);
      try {
        await fs.unlink(filePath);
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete the InstaSection from the database
    await instaSection.destroy();
    res.status(200).json({ message: 'InstaSection deleted successfully' });
  } catch (error) {
    console.error('Error deleting InstaSection:', error);
    res.status(500).json({ error: 'Server error while deleting InstaSection' });
  }
};