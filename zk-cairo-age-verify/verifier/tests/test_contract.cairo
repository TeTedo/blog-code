use starknet::ContractAddress;

use snforge_std::{declare_contract_with_syscall};
use verifier::AgeVerifierDispatcher;
use verifier::AgeVerifierDispatcherTrait;

#[test]
fn test_age_verification_success() {
    // 컨트랙트 배포 (constructor로 min_age 설정)
    let contract_address = declare_contract_with_syscall!("AgeVerifier");
    let mut dispatcher = AgeVerifierDispatcher { contract_address };
    
    // 최소 나이 설정 (20세)
    dispatcher.set_min_age(20);
    
    // 25세 사용자의 proof 생성 (오프체인)
    let user_age = 25;
    let min_age = 20;
    let age_difference = user_age - min_age; // 5
    
    // Commitment 계산 (실제로는 prover에서 생성)
    let mut state = core::poseidon::PoseidonTrait::new();
    state = state.update(user_age.into());
    state = state.update(min_age.into());
    let commitment = state.finalize();
    
    // Verifier에서 검증 (실제 나이는 전송하지 않음)
    dispatcher.verify_age_proof(commitment, age_difference.into());
    
    // 최소 나이 확인
    let contract_min_age = dispatcher.get_min_age();
    assert(contract_min_age == 20, 'Min age should be 20');
}

#[test]
fn test_age_verification_failure_young_age() {
    let contract_address = declare_contract_with_syscall!("AgeVerifier");
    let mut dispatcher = AgeVerifierDispatcher { contract_address };
    dispatcher.set_min_age(20);
    // 18세 사용자의 proof 생성 (실패해야 함)
    let user_age = 18;
    let min_age = 20;
    let age_difference = user_age - min_age; // -2 (음수)
    
    // Commitment 계산
    let mut state = core::poseidon::PoseidonTrait::new();
    state = state.update(user_age.into());
    state = state.update(min_age.into());
    let commitment = state.finalize();
    
    // 검증 실패 예상
    let mut success = false;
    match dispatcher.verify_age_proof(commitment, age_difference.into()) {
        _ => { success = true; }
    }
    assert(!success, 'Verification should fail for underage user');
}

#[test]
fn test_age_verification_failure_invalid_commitment() {
    let contract_address = declare_contract_with_syscall!("AgeVerifier");
    let mut dispatcher = AgeVerifierDispatcher { contract_address };
    dispatcher.set_min_age(20);
    // 유효한 proof이지만 잘못된 commitment
    let valid_proof = 5; // 25세 - 20세
    let invalid_commitment = 12345;
    let mut success = false;
    match dispatcher.verify_age_proof(invalid_commitment, valid_proof.into()) {
        _ => { success = true; }
    }
    assert(!success, 'Verification should fail for invalid commitment');
}

#[test]
fn test_cairo_proof_verification_success() {
    // 컨트랙트 배포
    let contract_address = declare_contract_with_syscall!("AgeVerifier");
    let mut dispatcher = AgeVerifierDispatcher { contract_address };
    
    // 최소 나이 설정 (20세)
    dispatcher.set_min_age(20);
    
    // 가상의 proof와 public inputs 생성
    let proof = 12345; // 실제로는 scarb prove로 생성된 proof
    let mut public_inputs = ArrayTrait::new();
    public_inputs.append(98765); // commitment
    public_inputs.append(1);     // age_valid = 1 (Pass)
    public_inputs.append(20);    // min_age = 20
    
    // Proof 검증
    dispatcher.verify_cairo_proof(proof, public_inputs);
    
    // 검증 결과 확인
    let is_verified = dispatcher.is_proof_verified(proof);
    assert(is_verified == true, 'Proof should be verified');
}

#[test]
fn test_cairo_proof_verification_failure_underage() {
    let contract_address = declare_contract_with_syscall!("AgeVerifier");
    let mut dispatcher = AgeVerifierDispatcher { contract_address };
    dispatcher.set_min_age(20);
    
    // 미성년자 proof (age_valid = 0)
    let proof = 12345;
    let mut public_inputs = ArrayTrait::new();
    public_inputs.append(98765); // commitment
    public_inputs.append(0);     // age_valid = 0 (Non-Pass)
    public_inputs.append(20);    // min_age = 20
    
    // 검증 실패 예상
    let mut success = false;
    match dispatcher.verify_cairo_proof(proof, public_inputs) {
        _ => { success = true; }
    }
    assert(!success, 'Verification should fail for underage user');
}

#[test]
fn test_cairo_proof_verification_failure_low_min_age() {
    let contract_address = declare_contract_with_syscall!("AgeVerifier");
    let mut dispatcher = AgeVerifierDispatcher { contract_address };
    dispatcher.set_min_age(20);
    
    // 최소 나이가 너무 낮은 경우
    let proof = 12345;
    let mut public_inputs = ArrayTrait::new();
    public_inputs.append(98765); // commitment
    public_inputs.append(1);     // age_valid = 1
    public_inputs.append(15);    // min_age = 15 (너무 낮음)
    
    // 검증 실패 예상
    let mut success = false;
    match dispatcher.verify_cairo_proof(proof, public_inputs) {
        _ => { success = true; }
    }
    assert(!success, 'Verification should fail for low min age');
}
