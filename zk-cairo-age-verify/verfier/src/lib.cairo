#[starknet::interface]
pub trait IAgeVerifier<TContractState> {
    fn verify_age(ref self: TContractState, commitment: felt252, min_age: u32);
}

#[starknet::contract]
mod AgeVerifier {
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    #[storage]
    struct Storage {
        commitment: felt252,
        min_age: u32,
    }

    #[abi(embed_v0)]
    impl AgeVerifierImpl of super::IAgeVerifier<ContractState> {
        fn verify_age(ref self: ContractState, commitment: felt252, min_age: u32) {   
            assert(commitment == self.commitment.read(), 'Commitment mismatch');
            assert(min_age <= self.min_age.read(), 'Min age mismatch');
        }
    }
}
