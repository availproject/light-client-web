use crate::types::{Cell, COMMITMENT_SIZE};
use dusk_bytes::Serializable;
use dusk_plonk::{
    bls12_381::G1Affine,
    commitment_scheme::kzg10::{commitment::Commitment, proof::Proof, PublicParameters},
    fft::EvaluationDomain,
    prelude::BlsScalar,
};
use thiserror_no_std::Error;
impl std::error::Error for Error {}

impl From<dusk_bytes::Error> for Error {
    fn from(_: dusk_bytes::Error) -> Self {
        Error::InvalidData
    }
}

#[derive(Error, Debug)]
pub enum Error {
    #[error("Proof, data or commitment is not valid")]
    InvalidData,
    #[error("Evaluation domain is not valid for given dimensions")]
    InvalidDomain,
    #[error("Public parameters degree is to small for given dimensions")]
    InvalidDegree,
    #[error("Position isn't in domain")]
    InvalidPositionInDomain,
}

//Parallelized proof verification
pub fn verify(
    public_parameters: &PublicParameters,
    width: usize,
    commitment: &[u8; COMMITMENT_SIZE],
    cell: &Cell,
) -> Result<bool, Error> {
    let commitment_to_witness = G1Affine::from_bytes(&cell.proof()).map(Commitment::from)?;

    let evaluated_point = BlsScalar::from_bytes(&cell.data())?;

    let commitment_to_polynomial = G1Affine::from_bytes(commitment).map(Commitment::from)?;

    let proof = Proof {
        commitment_to_witness,
        evaluated_point,
        commitment_to_polynomial,
    };

    let point = EvaluationDomain::new(width)
        .map_err(|_| Error::InvalidDomain)?
        .elements()
        .nth(cell.position.col.into())
        .ok_or(Error::InvalidPositionInDomain)?;

    Ok(public_parameters.opening_key().check(point, proof))
}

pub fn public_params() -> PublicParameters {
    let pp_bytes = include_bytes!("pp_1024.data");
    PublicParameters::from_slice(pp_bytes)
        .expect("Deserialising of public parameters should work for serialised pp")
}

#[cfg(test)]
mod tests {

    use crate::{
        proof::{public_params, verify},
        types::{Cell, Position},
    };

    #[test]
    fn test_cell_verification() {
        let kate_commitment: [u8; 48] = [
            175, 189, 214, 233, 33, 17, 138, 97, 163, 71, 113, 192, 236, 246, 43, 178, 218, 211, 0,
            160, 88, 107, 7, 49, 208, 0, 206, 106, 233, 135, 184, 88, 230, 98, 146, 175, 169, 167,
            115, 213, 185, 172, 249, 228, 137, 205, 212, 194,
        ];

        let cell = Cell {
            position: Position { row: 15, col: 15 },
            content: [
                173, 112, 104, 9, 25, 225, 235, 137, 75, 21, 89, 150, 129, 233, 95, 232, 103, 210,
                53, 66, 91, 154, 189, 112, 70, 164, 33, 6, 255, 200, 36, 136, 18, 235, 135, 177,
                63, 202, 180, 210, 49, 47, 186, 1, 141, 13, 136, 111, 147, 241, 236, 133, 223, 18,
                38, 66, 81, 42, 103, 79, 236, 83, 147, 176, 46, 178, 181, 67, 141, 151, 155, 255,
                234, 46, 71, 197, 165, 87, 115, 71,
            ],
        };
        //let pp = public_params2(16);
        let width = 16;
        let pp = public_params();
        assert!(verify(&pp, width, &kate_commitment, &cell).unwrap())
    }
}
