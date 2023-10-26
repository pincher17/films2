import { Box, Skeleton } from '@mui/material'
import React from 'react'
import styled from 'styled-components';

const SkeletonCustom = styled(Skeleton)`
  border-radius: 15px;
  height: 20.2em !important;
   @media (max-width: 829px){
    height: 15em !important;
  }
  
  @media (max-width: 766px){
    height: 17em !important;
  }
  
  @media (max-width: 738px){
    height: 28em !important;
  }
  
  @media (max-width: 628px){
    height: 24em !important;
  }
  
  @media (max-width: 565px){
    height: 23.3em !important;
  }
  
  @media (max-width: 530px){
    height: 21.3em !important;
  } 
  @media (max-width: 440px){
    height: 14em !important;
  } 
  @media (max-width: 370px){
    height: 14em !important;
  } 
`;

/* const WrapperSkeletonReactangular = styled(Skeleton)`
  border-radius: 15px;
  height: 330px;
  @media (max-width: 1300px){
    height: 100%;
  }
`; */

const SkeletonCard: React.FC = (props) => {

  return (
    <>
    <Box sx={{ width: '100%', transform: 'none' }}>
      <SkeletonCustom animation="wave" sx={{ bgcolor: 'grey.800' }} variant='rectangular'/>
      <Skeleton animation='wave' variant='text' height={30} sx={{ bgcolor: 'grey.800' }} width={'75%'} />
      <Skeleton animation='wave' variant='text' height={30} sx={{ bgcolor: 'grey.800' }} width={50}  />
      </Box>
    </>
  )
}

export default SkeletonCard
