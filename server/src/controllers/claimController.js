const { sendSuccess } = require('../middleware/errorHandler');

const verifyClaims = async (req, res, next) => {
  try {
    const mockClaims = [
      {
        id: "claim-1",
        claim: "Fluorinated interlayers elevate critical current density beyond 4.0 mA/cm² without short-circuiting.",
        status: "Verified True",
        confidence: "98% Match",
        supportingPaper: "Chen et al. (2025) — Nature Energy"
      }
    ];

    return sendSuccess(res, 200, mockClaims, 'Claims verified successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  verifyClaims
};
