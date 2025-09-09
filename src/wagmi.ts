import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
	appName: 'NECTR Token Ecosystem',
	projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
	chains: [sepolia],
	ssr: true,
});
