import { useAccount, useReadContract } from 'wagmi'
import { ERC20_ABI } from '@/app/const/abi/erc20'

type UseAllowance = {
  tokenAddress: `0x${string}`
  spender?: `0x${string}`
  enabled: boolean
}

export const useAllowance = (params: UseAllowance) => {
  const { tokenAddress, spender, enabled } = params
  const { address: account, chainId } = useAccount()

  const { data, error, isLoading } = useReadContract({
    abi: ERC20_ABI,
    address: tokenAddress as `0x${string}`,
    args: [account as `0x${string}`, spender as `0x${string}`],
    chainId,
    functionName: 'allowance',
    query: {
      enabled: !!spender && !!account && enabled,
      retryOnMount: true,
    },
  })

  return {
    allowanceError: error,
    allowanceLoading: isLoading,
    allowedAmount: data,
  }
}
