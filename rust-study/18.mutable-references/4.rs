fn main() {
    let country = "대한민국";
    let country_ref = &country;
    let country = 8;
    println!("{}, {}", country_ref, country);
}