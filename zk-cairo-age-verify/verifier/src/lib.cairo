#[starknet::interface]
pub trait IAgeVerifier<TContractState> {
    fn verify_zk_proof(
        ref self: TContractState,
        commitment: felt252,
        zk_proof: felt252,
        min_age: u32
    ) -> bool;
}

#[starknet::contract]
mod AgeVerifier {
    use core::poseidon::PoseidonTrait;
    use core::hash::HashStateTrait;

    #[storage]
    struct Storage {
    }

    #[abi(embed_v0)]
    impl AgeVerifierImpl of super::IAgeVerifier<ContractState> {
        fn verify_zk_proof(
            ref self: ContractState,
            commitment: felt252,
            zk_proof: felt252,
            min_age: u32
        ) -> bool {
            let mut proof_state = PoseidonTrait::new();
            proof_state = proof_state.update(commitment);
            proof_state = proof_state.update(min_age.into());
            let calculated_proof = proof_state.finalize();
            
            zk_proof == calculated_proof
        }
    }
}