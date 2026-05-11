export const getFormattedCurrency = (priceString: string) => {
  const price = parseFloat(priceString.replace('$', ''));
  return formatCurrency(price);
};

const formatCurrency = (price: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return formatter.format(price);
};
