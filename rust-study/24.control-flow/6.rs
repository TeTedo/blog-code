fn match_colors(rbg: (i32, i32, i32)) {
    match rbg {
        (r, _, _) if r < 10 => println!("Not much red"),
        (_, g, _) if g < 10 => println!("Not much green"),
        (_, _, b) if b < 10 => println!("Not much blue"),
        _ => println!("A lot of color"),
    }
}

fn main() {
    let first_color = (10, 10, 10);
    let second_color = (1, 2, 3);
    match_colors(first_color);
    match_colors(second_color);
}