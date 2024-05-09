import { useCallback } from 'react'
import { permitAbi } from '../../app/const/abi/permit'
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { hexToSignature } from 'viem'
import { PermitParams } from './useSignPermit'
import { sepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

export const useCallPermit = (hookProps: PermitParams) => {
  const { deadline, verifyingContract, spender, amount } = hookProps
  const { writeContract, data: txHash, error: sendPermitError, isPending: sendPermitPending } = useWriteContract()
  const { address: owner } = useAccount()

  const callPermit = useCallback(
    (signature: `0x${string}`) => {
      if (!owner || !spender) {
        return
      }
      const { v, r, s } = hexToSignature(signature)

      writeContract({
        account: privateKeyToAccount(process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`),
        abi: permitAbi,
        address: verifyingContract,
        functionName: 'permit',
        args: [owner, spender, amount, deadline, Number(v), r, s],
      })
    },
    [verifyingContract, amount, owner, spender, deadline],
  )

  const {
    data: permitTx,
    isLoading: waitTxLoading,
    isPending: waitTxPending,
    error: waitTxError,
  } = useWaitForTransactionReceipt({ hash: txHash, chainId: sepolia.id })
  return {
    callPermit,
    permitTxHash: txHash,
    callPermitError: sendPermitError || waitTxError,
    callPermitPending: sendPermitPending || waitTxLoading,
  }
}
