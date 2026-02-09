use thiserror::Error;
use anyhow::{Error as AnyhowError, anyhow};
use serde::{Deserialize, Serialize};
use serde_json;

#[derive(Debug, Serialize, Deserialize)]
struct User {
    points: u32,
    age: u8
}

#[derive(Debug, Serialize, Deserialize)]
struct UserRequest {
    points: u32,
    age: u8
}

impl User {
    fn try_new(age: u8, points: u32) -> Result<Self, CompanyError> {
        use CompanyError::*;
        match (age, points) {
            (age, points) if age > 120 && points > 5000 => {
                Err(TooBigAndTooOld(age, points))
            },
            (_, p) if p > 10000 => {
                Err(TooBig(p))
            },
            (age, _) if age > 120 => {
                Err(TooOld(age))
            },
            _ => Ok(Self { age, points })
        }
    }

    fn from_request(request: UserRequest) -> Result<User, AnyhowError> {
        if request.age < 120 && request.points < 5000 {
            Ok(User {
                age: request.age,
                points: request.points,
            })
        } else {
            Err(anyhow!("Invalid user request"))
        }
    }
}

#[derive(Error, Debug)]
enum CompanyError {
    #[error("Not enough data")]
    NotEnoughData,
    #[error("Too old: {0} Can't be over 120")]
    TooOld(u8),
    #[error("Too big: {0} Can't have more than 5000 points")]
    TooBig(u32),
    #[error("Must be under 120 and 5000 points: got {0:?} instead")]
    TooBigAndTooOld(u8, u32),
}

#[derive(Error, Debug)]
#[error("I couldn't care less")]
struct DontCareError;

fn do_some_stuff(number: &str, age: u8, points: u32) -> Result<(), AnyhowError> {
    let my_number = number.parse::<i32>().map_err(|e| {
        println!("Failed to parse number: {e}");
        DontCareError
    })?;
    let my_user = User::try_new(age, points).map_err(|e| {
        println!("Failed to create user: {e}");
        DontCareError
    })?;
    println!("User created: {my_user:?} with number {my_number}");
    Ok(())

}

fn main() {
    // let user_requests = vec![
    //     User::try_new(120, 20000),
    //     User::try_new(130, 4000),
    //     User::try_new(130, 6000),
    //     User::try_new(25, 3000),
    // ];

    // let users = user_requests
    //     .into_iter()
    //     .filter_map(|user_request| match user_request {
    //         Ok(user) => Some(user),
    //         Err(message) => {
    //             println!("{message}");
    //             None
    //         }
    //     })
    //     .collect::<Vec<User>>();

    // let try_1 = do_some_stuff("34", 25, 3000);
    // let try_2 = do_some_stuff("not a number", 25, 3000);
    // let try_3 = do_some_stuff("45", 130, 6000);
    // let try_4 = do_some_stuff("56", 25, 3000);
    // println!("try_1: {try_1:?}");
    // println!("try_2: {try_2:?}");
    // println!("try_3: {try_3:?}");
    // println!("try_4: {try_4:?}");

    let request = r#"
    {
        "points": 20000,
        "age": 29
    }"#;
    let user_request: UserRequest = serde_json::from_str(request).unwrap();
    let user_try = User::from_request(user_request);
    println!("Deserialized user: {:?}", user_try);
}