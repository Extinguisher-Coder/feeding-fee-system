// utils/distributeWeeks.js
function distributeWeeks(totalAmount) {
    const weekFields = {};
    let remaining = totalAmount;
  
    for (let i = 1; i <= 18; i++) {
      const weekKey = `Week${i}`;
      const value = Math.min(50, remaining);
      weekFields[weekKey] = value;
      remaining -= value;
      if (remaining <= 0) break;
    }
  
    // Fill remaining weeks with 0
    for (let i = 1; i <= 18; i++) {
      const weekKey = `Week${i}`;
      if (!(weekKey in weekFields)) {
        weekFields[weekKey] = 0;
      }
    }
  
    return weekFields;
  }
  
  module.exports = distributeWeeks;
  