// External code
mod client {
    pub struct InternetClient {
        pub client_id: u32,
    }
}

use client::InternetClient;

struct Customer<'a> {
    money: u32,
    name: &'a str,
    client: &'a InternetClient
}

use std::fmt;

impl fmt::Debug for Customer<'_> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Customer")
            .field("money", &self.money)
            .field("name", &self.name)
            .field("client", &self.client.client_id)
            .finish()
    }
}

fn main() {
    let client = client::InternetClient {
        client_id: 1,
    };
    let customer1 = Customer {
        money: 100,
        name: "David",
        client: &client,
    };

    println!("customer1: {:?}", customer1);
}