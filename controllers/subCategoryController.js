const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

exports.createSubCategory = async (req, res) => {
  try {
    const { cate_id, sub_cate_name } = req.body;
    const image = req.file ? req.file.filename : null;

    const category = await SubCategory.create({
      cate_id,
      sub_cate_name,
      image,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubCategory = async (req, res) => {
  try {
    const categories = await SubCategory.findAll({
      include: [
        {
          model: Category,
          attributes: ["name"],
          as: "Category",
        },
      ],
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubCategoryPagination = async (req, res) => {
  try {
    const { page, perPage, search = "" } = req.body;

    const offset = (page - 1) * perPage;

    const whereCondition = search
      ? {
          sub_cate_name: {
            [Op.like]: `%${search}%`,
          },
        }
      : {};

    const subCategories = await SubCategory.findAll({
      where: whereCondition,
      include: [
        {
          model: Category,
          attributes: ["name"],
          as: "Category",
        },
      ],
      limit: perPage,
      offset,
    });

    const totalCategory = await SubCategory.count({
      where: whereCondition,
    });

    const datas = {
      category: subCategories,
      totalCategory: totalCategory,
    };

    res.status(200).json(datas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const { sub_cate_id } = req.params;
    const { cate_id, sub_cate_name } = req.body;
    const newImage = req.file ? req.file.filename : null;

    const subCategory = await SubCategory.findByPk(sub_cate_id);

    if (!subCategory) {
      return res.status(404).json({ error: "SubCategory not found" });
    }

    if (newImage && subCategory.image) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "public",
        subCategory.image
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    subCategory.cate_id = cate_id || subCategory.cate_id;
    subCategory.sub_cate_name = sub_cate_name || subCategory.sub_cate_name;
    subCategory.image = newImage || subCategory.image;

    await subCategory.save();

    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const { sub_cate_id } = req.params;

    const category = await SubCategory.findByPk(sub_cate_id);

    if (!category) {
      return res.status(404).json({ error: "SubCategory not found" });
    }

    await category.destroy();

    res.status(200).json({ message: "SubCategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
