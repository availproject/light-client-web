pub mod proof;
pub mod types;

use crate::proof::public_params;
use crate::proof::verify;
use crate::types::{Cell, Position};

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    // #[wasm_bindgen(js_namespace = console)]
    // fn log(s: u16);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_vec(s: Vec<u8>);

}

#[wasm_bindgen]
pub fn check(proof: Vec<u8>, commitment: Vec<u8>, width: usize, row: u32, col: u16) -> bool {
    //let commitments = from_slice(&commitment).unwrap();
    // log("running");
    // log_vec(commitment.clone());
    // log_vec(proof.clone());
    // log("running");
    let cell = Cell {
        position: Position { row, col },
        content: proof.try_into().unwrap(),
    };
    let kate_commitment = commitment.try_into().unwrap();

    log("running");
    let pp = public_params();
    return verify(&pp, width, &kate_commitment, &cell).unwrap();
}
