import styled from 'styled-components'

export const ButtonWrapper = styled.div`
  background-color: rgb(184, 22, 22);
  color:rgb(235, 235, 235);
  font-weight:500;
  font-size: 18px;
  cursor: pointer;
  text-decoration: none;
  border: 1px solid rgb(184, 22, 22);
  border-radius: 5px;
  display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
;
  &:active {
          background: rgb(147 14 14);
          border: 1px solid rgb(147 14 14);
        }
`
