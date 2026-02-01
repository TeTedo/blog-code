use anyhow;
use thiserror;

use std::error::Error;
use std::fmt::{Formatter, Display};

#[derive(Debug)]
enum CompanyError {
    CouldntConnect,
    NotEnoughData,
    UserTimeOut
}

impl CompanyError {
    fn print_extra_detail(&self) {
        println!("Here is all the extra detail: blah blah blah");
    }
}

impl Display for CompanyError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "CompanyError")
    }
}

impl Error for CompanyError {

}

#[derive(Debug)]
struct BaseError;

fn give_error(is_company_error: bool) -> Result<(), Box<dyn Error>> {
    if is_company_error {
        Err(Box::new(CompanyError::CouldntConnect))
    } else {
        Err(Box::new(BaseError))
    }
}

impl Display for BaseError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "BaseError")
    }
}

impl Error for BaseError {
}

fn main() {
    let error_1 = give_error(true);
    let error_2 = give_error(false);

    if let Some(company_error) = error_1.downcast_ref::<CompanyError>() {
        company_error.print_extra_detail();
    } else {
        println!("{error_1}")
    }
}