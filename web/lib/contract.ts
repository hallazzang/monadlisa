export const MONAD_LISA_CONTRACT = {
  address: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  abi: [
    {
      "inputs": [],
      "name": "getCanvasState",
      "outputs": [
        {
          "internalType": "uint24[]",
          "name": "",
          "type": "uint24[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "x",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "y",
          "type": "uint8"
        },
        {
          "internalType": "uint24",
          "name": "color",
          "type": "uint24"
        }
      ],
      "name": "setPixelColor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "x",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "y",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint24",
          "name": "color",
          "type": "uint24"
        }
      ],
      "name": "PixelUpdated",
      "type": "event"
    }
  ] as const
}

export function hexToColorInt(hex: string): number {
  return parseInt(hex.replace('#', ''), 16)
}

export function colorIntToHex(colorInt: number): string {
  return `#${colorInt.toString(16).padStart(6, '0')}`
}