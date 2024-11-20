import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ContractItem = {
  id: string;
  number: string;
  name: string;
  contractNumber: string;
};

type ContractState = {
  items: ContractItem[];
  selectedContract: ContractItem | null; // Add a new state for selected contract
};

const initialState: ContractState = {
  items: [
    { id: "1", number: "", name: "Manna Machines", contractNumber: "9855097195" },
    { id: "2", number: "", name: "Pub Sohna", contractNumber: "8360042904" },
    { id: "3", number: "", name: "Test", contractNumber: "8872420478" },
  ],
  selectedContract: null, // Initial state is null
};

const contractSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    updateContractNumber: (
      state,
      action: PayloadAction<{ id: string; contractNumber: string }>
    ) => {
      const { id, contractNumber } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.contractNumber = contractNumber;
      }
    },
    setSelectedContract: (state, action: PayloadAction<ContractItem>) => {
      state.selectedContract = action.payload; // Set the selected contract
    },
  },
});

export const { updateContractNumber, setSelectedContract } = contractSlice.actions;
export default contractSlice.reducer;
