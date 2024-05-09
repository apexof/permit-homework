'use client'

import { PermitParams, useSignPermit } from '@/shared/hooks/useSignPermit'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useCallPermit } from '@/shared/hooks/useCallPermit'
import { useEffect, useMemo } from 'react'
import { useAllowance } from '@/shared/hooks/useAllowance'
import { useAccount } from 'wagmi'

const today = new Date()
const spender = '0xd4da9d6cD72cEDC68ed253312a035a934954BbB8'
const tomorrow = new Date(today).setDate(today.getDate() + 1)

function Home() {
  const { address } = useAccount()

  const permitParams: PermitParams = useMemo(() => {
    return {
      verifyingContract: '0xCd777A747c9e48DB72092238e02eB1d00CAd098F', // token contract
      spender,
      deadline: BigInt(tomorrow),
      amount: BigInt(184),
    }
  }, [address, tomorrow])

  const { signPermit, signature, signPermitError, signPermitPending } = useSignPermit(permitParams)
  const { callPermit, permitTxHash, callPermitError, callPermitPending } = useCallPermit(permitParams)

  useEffect(() => {
    if (signature) {
      callPermit(signature)
    }
  }, [signature])

  const { allowedAmount, allowanceError, allowanceLoading } = useAllowance({
    tokenAddress: permitParams.verifyingContract,
    spender: permitParams.spender,
    enabled: true,
  })
  // console.log('signPermitPending', signPermitPending)
  // console.log('callPermitPending', callPermitPending)
  // console.log('allowanceLoading', allowanceLoading)
  const error = signPermitError || callPermitError || allowanceError
  const isPending = signPermitPending || callPermitPending || allowanceLoading

  return (
    <main className="">
      {!address ? (
        <ConnectButton />
      ) : (
        <>
          <div>
            <div className="text-4xl">You must approve spending tokens for the address: {spender}</div>
            <div className="text-4xl">You have currently approved {Number(allowedAmount)} tokens</div>
          </div>

          <div>
            {permitTxHash && callPermitPending ? (
              <div className="text-4xl">
                <div>Permit TX sended</div>
                <a target="_blank" href={`https://sepolia.etherscan.io/tx/${permitTxHash}`}>
                  Show on SepoliaScan
                </a>
              </div>
            ) : isPending ? (
              <div className="text-4xl">isPending</div>
            ) : !!error ? (
              <div className="text-4xl">{error.message}</div>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={signPermit}
              >
                Sign typed data
              </button>
            )}
          </div>
        </>
      )}
    </main>
  )
}

export default Home
