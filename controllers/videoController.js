const Video = require('../models/Video');
const fs = require('fs');
const path = require('path');

const getVideos = async (req, res) => {
  try {
    const videos = await Video.findAll();
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createVideo = async (req, res) => {
  try {
    const videoFile = req.file;
    if (!videoFile) {
      return res.status(400).json({ message: 'No video uploaded' });
    }

    const videoUrl = `/uploads/${videoFile.filename}`;
    const video = await Video.create({ videoUrl });

    res.status(201).json(video);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const videoFile = req.file;
    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (videoFile) {
      // Delete old video file
      const oldVideoPath = path.join(__dirname, '..', video.videoUrl);
      if (fs.existsSync(oldVideoPath)) {
        fs.unlinkSync(oldVideoPath);
      }

      // Update with new video
      video.videoUrl = `/uploads/${videoFile.filename}`;
      await video.save();
    }

    res.status(200).json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Delete video file
    const videoPath = path.join(__dirname, '..', video.videoUrl);
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }

    await video.destroy();
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
};