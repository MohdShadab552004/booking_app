const PromoCode = require('../models/promoCode.model');

exports.validateAndApplyPromo = async (code, totalAmount) => {
  const promoCode = await PromoCode.findOne({
    code: code.toUpperCase(),
    isActive: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gt: new Date() }
  });

  if (!promoCode) {
    return { valid: false, message: 'Invalid or expired promo code' };
  }

  if (promoCode.minAmount > totalAmount) {
    return {
      valid: false,
      message: `Minimum amount of ₹${promoCode.minAmount} required`
    };
  }

  if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
    return { valid: false, message: 'Promo code usage limit reached' };
  }

  let discountAmount = 0;
  if (promoCode.discountType === 'percentage') {
    discountAmount = (totalAmount * promoCode.discountValue) / 100;
    if (promoCode.maxDiscount) {
      discountAmount = Math.min(discountAmount, promoCode.maxDiscount);
    }
  } else {
    discountAmount = Math.min(promoCode.discountValue, totalAmount);
  }

  // Increment usage count
  await PromoCode.findByIdAndUpdate(promoCode._id, {
    $inc: { usedCount: 1 }
  });

  return {
    valid: true,
    discountAmount,
    finalAmount: totalAmount - discountAmount,
    discountType: promoCode.discountType,
    discountValue: promoCode.discountValue
  };
}