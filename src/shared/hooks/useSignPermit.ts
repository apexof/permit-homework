import { useCallback } from 'react'
import { permitAbi } from '../../app/const/abi/permit'
import { useAccount, useReadContract, useSignTypedData } from 'wagmi'

export type PermitParams = {
  verifyingContract: `0x${string}`
  spender?: `0x${string}`
  deadline: bigint
  amount: bigint
}

export const useSignPermit = (params: PermitParams) => {
  const { amount, verifyingContract, spender, deadline } = params
  const { signTypedData, data, error, isPending } = useSignTypedData()
  const { address: owner, chainId } = useAccount()

  const { data: nonce } = useReadContract({
    abi: permitAbi,
    address: verifyingContract,
    functionName: 'nonces',
    args: [owner as `0x${string}`],
    query: { enabled: !!owner },
  })

  const { data: name } = useReadContract({
    abi: permitAbi,
    address: verifyingContract,
    functionName: 'name',
  })

  const signPermit = useCallback(() => {
    if (!owner || nonce === undefined || !name || !spender) {
      return
    }

    signTypedData({
      types: {
        Permit: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
      domain: {
        name,
        version: '1',
        chainId,
        verifyingContract,
      },
      message: {
        owner,
        spender,
        value: amount,
        nonce,
        deadline,
      },
      primaryType: 'Permit',
    })
  }, [nonce, amount, owner, verifyingContract, signTypedData])

  return {
    signPermit,
    signature: data,
    signPermitError: error,
    signPermitPending: isPending,
  }
}
