function distributeWeeks(totalAmount, currentPayment) {
  const weekFields = {};
  let remaining = totalAmount;

  for (let i = 1; i <= 18; i++) {
    const weekKey = `Week${i}`;

    // Check current value from currentPayment
    const currentValue = currentPayment?.[weekKey];

    // ✅ If marked as 'Absent' or 'Omitted', preserve it
    if (typeof currentValue === 'string' && (currentValue === 'Absent' || currentValue === 'Omitted')) {
      weekFields[weekKey] = currentValue;
      continue; // skip to next week
    }

    // ✅ Assign up to 50 (or whatever remains), skip if nothing left
    if (remaining > 0) {
      const value = Math.min(50, remaining);
      weekFields[weekKey] = value;
      remaining -= value;
    } else {
      weekFields[weekKey] = 0;
    }
  }

  return weekFields;
}

module.exports = distributeWeeks;
