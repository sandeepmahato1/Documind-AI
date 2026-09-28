const { sendSuccess } = require('../middleware/errorHandler');

const getPaperComparison = async (req, res, next) => {
  try {
    const mockMatrix = [
      {
        metric: "Critical Current Density (CCD)",
        paperA: "4.2 mA/cm² (LiF Interlayer)",
        paperB: "2.8 mA/cm² (Polymer Binder)",
        verdict: "Paper A achieves higher CCD"
      }
    ];

    return sendSuccess(res, 200, mockMatrix, 'Paper comparison matrix retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPaperComparison
};
