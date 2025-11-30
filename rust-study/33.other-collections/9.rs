use std::collections::VecDeque;

fn main() {
    // VecDeque 생성
    let mut my_vecdeque = VecDeque::new();
    
    // 뒤쪽에 추가 (push_back)
    my_vecdeque.push_back(1);
    my_vecdeque.push_back(2);
    my_vecdeque.push_back(3);
    println!("뒤쪽에 추가 후: {:?}", my_vecdeque);
    
    // 앞쪽에 추가 (push_front) - Vec와 달리 효율적!
    my_vecdeque.push_front(0);
    my_vecdeque.push_front(-1);
    println!("앞쪽에 추가 후: {:?}", my_vecdeque);
    
    // 뒤쪽에서 제거 (pop_back)
    if let Some(value) = my_vecdeque.pop_back() {
        println!("뒤쪽에서 제거: {}", value);
    }
    println!("현재 상태: {:?}", my_vecdeque);
    
    // 앞쪽에서 제거 (pop_front)
    if let Some(value) = my_vecdeque.pop_front() {
        println!("앞쪽에서 제거: {}", value);
    }
    println!("최종 상태: {:?}", my_vecdeque);
    
    // 큐(Queue)로 사용하기
    println!("\n=== 큐(Queue) 예시 ===");
    let mut queue = VecDeque::new();
    queue.push_back("첫 번째");
    queue.push_back("두 번째");
    queue.push_back("세 번째");
    
    while let Some(item) = queue.pop_front() {
        println!("처리 중: {}", item);
    }
    
    // 스택(Stack)으로 사용하기
    println!("\n=== 스택(Stack) 예시 ===");
    let mut stack = VecDeque::new();
    stack.push_back("하나");
    stack.push_back("둘");
    stack.push_back("셋");
    
    while let Some(item) = stack.pop_back() {
        println!("꺼내기: {}", item);
    }
}
