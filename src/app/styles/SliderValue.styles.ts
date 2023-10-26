import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 222px;
  @media (max-width: 850px){
  width: 85%;
 }
`

export const Title = styled.div`
  font-size: 18px;
`

export const WrapperInputs = styled.div`
 display: flex;
 margin-bottom: 12px;
 & > :first-child{
  margin-right: 30px;
 }
 @media (max-width: 850px){
  & .input{
  height: 50px;
 }
  }

`