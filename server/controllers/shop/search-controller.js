const Product = require("../../models/Product");

// --- Vanilla JS TF-IDF helpers ---
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function termFrequency(term, docTokens) {
  const count = docTokens.filter((t) => t === term).length;
  return docTokens.length ? count / docTokens.length : 0;
}

function inverseDocumentFrequency(term, allDocsTokens) {
  const docsWithTerm = allDocsTokens.filter((tokens) =>
    tokens.includes(term)
  ).length;
  if (docsWithTerm === 0) return 0;
  return Math.log(allDocsTokens.length / docsWithTerm);
}

function tfidfScore(query, docTokens, allDocsTokens) {
  const queryTokens = tokenize(query);
  let score = 0;
  for (const term of queryTokens) {
    const tf = termFrequency(term, docTokens);
    const idf = inverseDocumentFrequency(term, allDocsTokens);
    score += tf * idf;
  }
  return score;
}
// --- End helpers ---

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be in string format",
      });
    }

    // Remove regex search: fetch all products for pure TF-IDF ranking
    const searchResults = await Product.find({});

    // Manual TF-IDF
    const allDocsTokens = searchResults.map((product) =>
      tokenize(
        [product.title, product.description, product.category, product.brand]
          .filter(Boolean)
          .join(" ")
      )
    );

    const scores = searchResults.map((product, i) => {
      const docTokens = allDocsTokens[i];
      const score = tfidfScore(keyword, docTokens, allDocsTokens);
      return { product, score };
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
