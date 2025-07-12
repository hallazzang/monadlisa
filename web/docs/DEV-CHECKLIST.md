Developer Checklist: Monad-lisa
Version: 1.0
Date: July 12, 2024

This checklist breaks down the development work for the Monad-lisa dApp into phases and specific tasks.

Phase 0: Project Setup & Configuration
[ ] Initialize Project:

[ ] Create a new Next.js application: npx create-next-app@latest monad-lisa --typescript --tailwind --eslint

[ ] Install Dependencies:

[ ] Install wagmi, viem (or ethers).

[ ] Install any UI/utility libraries (e.g., headlessui for modals, clsx for classnames).

[ ] Wagmi Configuration:

[ ] Set up WagmiConfig provider in \_app.tsx or a layout component.

[ ] Configure required chains (e.g., mainnet, sepolia) and providers (e.g., Infura, Alchemy).

[ ] Smart Contract Integration:

[ ] Obtain the smart contract ABI and deployment address.

[ ] Create a typed contract configuration file using the ABI.

[ ] Component Structure:

[ ] Create a basic file structure for components (/components/canvas, /components/ui, /components/layout, etc.).

[ ] Implement the main layout component (Header with Connect Button, main content area).

Phase 1: Canvas Implementation
[ ] Canvas Component (Canvas.tsx):

[ ] Create a component that renders a 64x64 grid of div or svg elements.

[ ] Implement CSS Grid or Flexbox for the layout.

[ ] Create a Pixel.tsx sub-component.

[ ] Blockchain Data Fetching:

[ ] Implement a useReadContract hook from wagmi to call the contract's getCanvasState() function (or equivalent) on initial load.

[ ] Create a state management solution (e.g., useState, useReducer, or a state management library) to hold the canvas color data.

[ ] Map the fetched array of colors to the pixel components.

[ ] Real-time Event Listener:

[ ] Implement the useWatchContractEvent hook from wagmi to listen for the PixelUpdated event from the contract.

[ ] On event, update the local canvas state with the new pixel color, coordinates, and owner. This will re-render the specific pixel that changed.

[ ] Responsive Sizing:

[ ] Use CSS aspect-ratio and viewport units (vw, vh) or a custom hook (useWindowSize) to ensure the canvas scales correctly while maintaining its square shape.

Phase 2: User Interaction & Wallet
[ ] Wallet Connection (ConnectButton.tsx):

[ ] Implement the UI for the "Connect Wallet" button.

[ ] Use a library like web3modal or build custom logic using wagmi's useConnect hook to handle the wallet connection flow.

[ ] Display the user's ENS name or truncated address when connected.

[ ] Implement the "Disconnect" functionality.

[ ] Color Picker (ColorPicker.tsx):

[ ] Build the color picker UI as shown in the mockup.

[ ] Manage the currently selected color in a global or parent component state.

[ ] Pixel Coloring Logic:

[ ] Add an onClick handler to the Pixel.tsx component.

[ ] The handler should only fire if a user is connected.

[ ] Use wagmi's useWriteContract hook to prepare and fire the transaction to the setPixelColor(x, y, color) function on the smart contract.

[ ] UI Feedback for Transactions:

[ ] Use the isLoading state from the useWriteContract hook to show a pending state on the clicked pixel (e.g., a loading spinner or a pulsing animation).

[ ] Use useWaitForTransactionReceipt to get the final status of the transaction.

[ ] Display toast notifications (or similar UI feedback) for transaction submission, success, and failure.

Phase 3: Ancillary Features
[ ] Transaction History Panel (TxHistory.tsx):

[ ] Create a new component for the history panel.

[ ] Add a button to toggle its visibility.

[ ] Fetch past PixelUpdated events from the blockchain to populate the initial list.

[ ] Prepend new transactions to the list as they are confirmed.

[ ] Each item should link to the transaction on a block explorer.

[ ] Live Users Component (LiveUsers.tsx):

[ ] Option A (Simple): Display a counter based on active WebSocket connections if using a backend.

[ ] Option B (Decentralized-ish): This is more complex. Could involve users signing a message to announce presence, but a simple WebSocket approach is recommended for V1.

[ ] Implement the chosen solution and display the live user count.

Phase 4: Testing & Deployment
[ ] Testing:

[ ] Test all wallet interactions on a testnet (e.g., Sepolia).

[ ] Verify that canvas state loads correctly.

[ ] Verify that real-time updates work as expected for multiple browser windows.

[ ] Test UI responsiveness across different screen sizes (desktop, tablet, mobile).

[ ] Deployment:

[ ] Configure environment variables for RPC URLs, contract addresses, etc.

[ ] Deploy the Next.js application to a hosting provider like Vercel.

[ ] If using a WebSocket server, deploy it to a service like Fly.io or Render.
