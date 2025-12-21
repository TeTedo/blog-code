fn main() {
    let first_try = vec![Some("success!1"), None, Some("success!1"), Some("success!1"), None];
    let second_try = vec![None, Some("success!2"), Some("success!2"), Some("success!2"), Some("success!2")];
    let third_try = vec![Some("success!3"), Some("success!3"), Some("success!3"), Some("success!3"), None];

    for i in 0..first_try.len() {
        println!("{:?}", first_try[i].and(second_try[i]).and(third_try[i]));
    }
}