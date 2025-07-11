use core::poseidon::PoseidonTrait;
use core::hash::HashStateTrait;

pub fn create_commitment(age: u32, nonce: felt252) -> felt252 {
    let mut state = PoseidonTrait::new();
    state = state.update(age.into());
    state = state.update(nonce);
    let commitment = state.finalize();
    
    commitment
}

pub fn generate_zk_proof(age: u32, nonce: felt252, min_age: u32, commitment: felt252) -> felt252 {
    if age < min_age {
        panic!("Age condition not satisfied");
    }
    
    let mut proof_state = PoseidonTrait::new();
    proof_state = proof_state.update(commitment);
    proof_state = proof_state.update(min_age.into());
    let zk_proof = proof_state.finalize();
    
    zk_proof
}

#[executable]
fn main(age: u32, min_age: u32, nonce: felt252) -> (felt252, felt252) {
    let commitment = create_commitment(age, nonce);
    let zk_proof = generate_zk_proof(age, nonce, min_age, commitment);
    
    println!("commitment: {}", commitment);
    println!("zk_proof: {}", zk_proof);
    
    (commitment, zk_proof)
}