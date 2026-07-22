function daysUntil(dateText) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(`${dateText}T00:00:00`);
  return Math.ceil((expiry - today) / 86400000);
}

function enrichProduct(product) {
  const daysLeft = daysUntil(product.expiryDate);
  const status = daysLeft < 0 ? 'expired' : daysLeft <= 7 ? 'expiring' : 'normal';
  const discount = daysLeft < 0 ? 0 : daysLeft <= 3 ? 30 : daysLeft <= 7 ? 10 : 0;

  return {
    ...product,
    daysLeft,
    status,
    discount,
    riskValue: status === 'normal' ? 0 : product.quantity * product.price
  };
}

module.exports = { enrichProduct };
