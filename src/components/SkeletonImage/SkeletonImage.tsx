import { Box, Skeleton } from '@mui/material'
import React from 'react'
import styled from 'styled-components';

const SkeletonCustom = styled(Skeleton)`
  /* border-radius: 15px; */
  height: 533.27px !important;
  width: 360px !important;
   @media (max-width: 849px){
    height: 414.77px !important;
    width: 280px !important;
    margin: 0 auto;
  }
`;

/* const WrapperSkeletonReactangular = styled(Skeleton)`
  border-radius: 15px;
  height: 330px;
  @media (max-width: 1300px){
    height: 100%;
  }
`; */

const SkeletonImage: React.FC = (props) => {

  return (
    <>
    <Box sx={{ transform: 'none' }}>
      <SkeletonCustom animation="wave" sx={{ bgcolor: 'grey.800' }} variant='rectangular'/>
      </Box>
    </>
  )
}

export default SkeletonImage
