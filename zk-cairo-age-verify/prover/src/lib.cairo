use core::hash::HashStateTrait;
use core::poseidon::PoseidonTrait;

fn hash_age(age: u32, min_age: u32) -> felt252 {
    // Poseidon 해시 상태 생성
    let mut state = PoseidonTrait::new();

    // 입력값 업데이트 (여러 값도 가능)
    state = state.update(age.into());
    state = state.update(min_age.into());
    // 해시 결과 반환
    let hash = state.finalize();
    hash
}

#[executable]
fn main(age: u32, min_age: u32) -> felt252 {
    let commitment = hash_age(age, min_age);
    commitment
}