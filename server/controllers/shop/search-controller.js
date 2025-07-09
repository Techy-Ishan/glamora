const Product = require("../../models/Product");
const natural = require("natural");
const TfIdf = natural.TfIdf;

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        succes: false,
        message: "Keyword is required and must be in string format",
      });
    }

    const regEx = new RegExp(keyword, "i");

    const createSearchQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
        { brand: regEx },
      ],
    };

    const searchResults = await Product.find(createSearchQuery);

    // TF-IDF ranking
    const tfidf = new TfIdf();
    // Add each product's combined text to the TF-IDF model
    searchResults.forEach((product) => {
      tfidf.addDocument(
        [product.title, product.description, product.category, product.brand]
          .filter(Boolean)
          .join(" ")
      );
    });

    // Compute similarity scores for the keyword
    const scores = [];
    tfidf.tfidfs(keyword, function (i, measure) {
      scores.push({ product: searchResults[i], score: measure });
    });

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);

    // Only return products with a positive score (relevant)
    const rankedResults = scores
      .filter((s) => s.score > 0)
      .map((s) => s.product);

    res.status(200).json({
      success: true,
      data: rankedResults,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { searchProducts };
