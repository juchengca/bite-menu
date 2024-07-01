// MENU VALIDATION FUNCTIONS

// function to validate type - data type must be of type undefined, null, or specified type
const validateType = (value, type) => {
  return value === undefined || value === null || typeof value === type;
};

// SECTION
const validateSection = (section) => {
  if (!section.id || !section.name) {
    throw new Error('Invalid section data');
  }
};

// ITEM
const validateItem = (item) => {
  if (!item.id || !item.name || item.price === undefined) {
    throw new Error('Invalid item data');
  }
};

// MODGROUP
const validateModGroup = (modGroup) => {
  if (!modGroup.id || !modGroup.name) {
    throw new Error('Invalid modifier group data');
  }
  // if minMod and maxMod fields exist, verify type is number
  if (!validateType(modGroup.maxMods, 'number')) {
    throw new Error('Invalid maxMods data');
  }
  if (!validateType(modGroup.minMods, 'number')) {
    throw new Error('Invalid minMods data');
  }
};

// MODIFIERS
const validateMod = (mod) => {
  if (!mod.id || !mod.name || mod.price === undefined) {
    throw new Error('Invalid modifier data');
  }
};

// DISCOUNTS
const validateDiscount = (discount) => {
  if (!discount.id || !discount.name) {
    throw new Error('Invalid discount data');
  }
  // if amount, rate, or coupon code fields exist, verify type is number, number, string respectively
  if (!validateType(discount.amount, 'number')) {
    throw new Error('Invalid amount data');
  }
  if (!validateType(discount.rate, 'number')) {
    throw new Error('Invalid rate data');
  }
  if (!validateType(discount.couponCode, 'string')) {
    throw new Error('Invalid couponCode data');
  }
};

// ORDER TYPES
const validateOrderType = (orderType) => {
  if (!orderType.id || !orderType.name) {
    throw new Error('Invalid order type data');
  }
};

module.exports = { validateSection, validateItem, validateModGroup, validateMod, validateDiscount, validateOrderType };