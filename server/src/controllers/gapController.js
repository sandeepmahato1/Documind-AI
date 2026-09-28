const { sendSuccess } = require('../middleware/errorHandler');

const getResearchGaps = async (req, res, next) => {
  try {
    const mockGaps = [
      {
        id: "gap-1",
        topic: "High-Temperature Thermal Runaway in Sulfide Electrolytes",
        confidence: "High Priority (94%)",
        description: "No current indexed papers evaluate dendrite growth mechanics above 60°C under continuous 5C rapid charging conditions."
      }
    ];

    return sendSuccess(res, 200, mockGaps, 'Research gaps retrieved successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getResearchGaps
};
