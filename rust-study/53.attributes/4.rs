#[test]
fn test_something() {
    assert!(true);
}

#[test]
#[should_panic]
fn test_something_should_panic() {
    assert!(false);
}

fn main() {
}