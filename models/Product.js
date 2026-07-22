const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, default: 'อื่น ๆ', trim: true },
  sku: { type: String, required: true, trim: true, unique: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  expiryDate: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  image: { type: String, default: '📦' }
}, { timestamps: true, versionKey: false });

productSchema.set('toJSON', {
  transform(doc, value) {
    value.id = value._id.toString();
    delete value._id;
    return value;
  }
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
