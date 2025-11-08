// slices
// vecs

fn main() {
    let seasons = ["Spring", "Summer", "Autumn", "Winter"];
    println!("seasons: {:?}", &seasons[0..2]);
    println!("seasons: {:?}", &seasons[0..=2]);
    println!("seasons: {:?}", &seasons[..]);
    println!("seasons: {:?}", &seasons[..2]);
    println!("seasons: {:?}", &seasons[2..]);
}
