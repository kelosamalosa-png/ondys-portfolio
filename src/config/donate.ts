export const donateLinks = {
  buyMeACoffee: {
    url: '#', // Replace with your Buy Me a Coffee link
    enabled: true,
  },
  kofi: {
    url: '#', // Replace with your Ko-fi link
    enabled: true,
  },
  paypal: {
    url: '#',
    enabled: false,
  },
  bankTransfer: {
    // Bank transfer details
    iban: 'CZ87 5500 0000 0068 3317 8003',
    bankName: 'Your Bank Name',
    accountHolder: 'Your Name',
    enabled: true,
  },
} as const;
