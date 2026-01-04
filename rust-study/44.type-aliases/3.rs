type MyString = String;
struct MyOtherString(String);


fn main() {
    let my_string = MyString::from("Hello, world!");
    let my_other_string = MyOtherString(String::from("Hello, world!"));
}