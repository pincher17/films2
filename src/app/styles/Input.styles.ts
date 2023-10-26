import styled from 'styled-components'

export const InputWrapper = styled.div`
  position: relative;
  & > label {
    font-style: normal;
    line-height: 24px;
    color: #a2a5b6;
    display: block;
  }
  & > input,
  textarea {
    display: block;
    position: relative;
    width: 100%;
    margin-top: 14px;
    border-radius: 5px;
    height: 33px;
    border: 1px solid rgb(52 52 52);
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    box-sizing: border-box;
    padding-left: 16px;
    background-color: #0e0e0e;
    color: white;
    &:hover {
      border-color: #747474;
    }
    &:focus {
      border-color: #747474;
    }
    &:focus-visible {
      outline: none;
    }
  }
  & > textarea {
    height: 406px;
  }
  & > span {
    display: inline-block;
    cursor: pointer;
    width: 22px;
    height: 19px;
    position: absolute;
    right: 33px;
    top: 57px;
    color: #21bdcb;
  }
`

