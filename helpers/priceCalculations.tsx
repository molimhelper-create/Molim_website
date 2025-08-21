export interface Product {
  id: string;
  name: string;
  price: number; // Price in SAR
}

export interface CartItem extends Product {
  quantity: 1; // For this use case, quantity is always 1
}

export const BASE_DEVICE: Product = {
  id: 'base-device',
  name: 'جهاز ملم الأساسي',
  price: 2999,
};

export const ADDONS: Product[] = [
  { id: 'addon-fat-scale', name: 'ميزان الدهون والوزن', price: 65 },
  { id: 'addon-urine-analysis', name: 'تحليل البول (11 عنصرًا + 100 شريط)', price: 540 },
  { id: 'addon-uric-acid-strips', name: 'شرائط فحص حمض اليوريك في الدم (25 قطعة)', price: 151 },
  { id: 'addon-lipid-analyzer', name: 'جهاز تحليل دهون الدم (الكوليسترول/ HDL / LDL / الدهون الثلاثية)', price: 1944 },
  { id: 'addon-lipid-strips', name: 'شرائط فحص دهون الدم (20 قطعة)', price: 151 },
  { id: 'addon-hemoglobin-sensor', name: 'حساس الهيموغلوبين', price: 251 },
  { id: 'addon-hemoglobin-strips', name: 'شرائط فحص الهيموغلوبين', price: 100 },
  { id: 'addon-ir-thermometer', name: 'ميزان حرارة بالأشعة تحت الحمراء', price: 100 },
  { id: 'addon-digital-stethoscope', name: 'سماعة طبية رقمية', price: 1511 },
  { id: 'addon-spirometer', name: 'جهاز قياس التنفس (سبيرومتر)', price: 993 },
];

export const ALL_PRODUCTS: Product[] = [BASE_DEVICE, ...ADDONS];

export const TAX_RATE = 0.15; // 15%
export const SHIPPING_COST = 33; // 33 SAR

/**
 * Calculates the subtotal of all items in the cart.
 * @param items - An array of cart items.
 * @returns The total price before tax and shipping.
 */
export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price, 0);
};

/**
 * Calculates the tax amount based on the subtotal.
 * @param subtotal - The subtotal amount.
 * @returns The calculated tax amount.
 */
export const calculateTax = (subtotal: number): number => {
  return subtotal * TAX_RATE;
};

/**
 * Formats a number as a currency string for SAR.
 * @param amount - The number to format.
 * @returns A string representing the amount in SAR (e.g., "1,999.00 ر.س").
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SAR',
  }).format(amount);
};