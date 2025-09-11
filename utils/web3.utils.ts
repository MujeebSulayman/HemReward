import { ethers } from "ethers";

export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const formatTokenAmount = (value: string): string => {
  const parts = value.split('.');
  const integerPart = parts[0];
  const groups = [];
  
  for (let i = integerPart.length; i > 0; i -= 3) {
    groups.unshift(integerPart.slice(Math.max(0, i - 3), i));
  }
  
  const formattedInteger = groups.join(',');
  if (parts[1]) {
    return `${formattedInteger}.${parts[1]} NECTR`;
  }
  return `${formattedInteger} NECTR`;
};

export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const parseTokenAmount = (amount: string): number => {
  try {
    const cleanAmount = amount.replace(/,/g, '').replace(' NECTR', '');
    return parseFloat(cleanAmount);
  } catch (error) {
    console.error('Error parsing token amount:', error);
    return 0;
  }
};

export const reportError = (error: any): string => {
  if (typeof error === "string") return error;
  if (error?.reason) return error.reason;
  if (error?.message) return error.message;
  return "An unknown error occurred";
};

export const validateTokenAmount = (amount: string): boolean => {
  const parsedAmount = parseTokenAmount(amount);
  return !isNaN(parsedAmount) && parsedAmount > 0;
};

export const formatTransactionHash = (hash: string): string => {
  if (!hash) return '';
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

export const getExplorerUrl = (hash: string): string => {
  const network = process.env.NEXT_PUBLIC_NETWORK || 'sepolia';
  return `https://${network}.etherscan.io/tx/${hash}`;
};

export const calculatePercentage = (part: string, total: string): number => {
  const parsedPart = parseTokenAmount(part);
  const parsedTotal = parseTokenAmount(total);
  if (parsedTotal === 0) return 0;
  return (parsedPart / parsedTotal) * 100;
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(2)}%`;
};
