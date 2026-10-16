import React from 'react'
import { InputWrapper } from '../../app/styles/Input.styles'
import { InputProps } from './Input.types'

const Input: React.FC<InputProps> = (props) => {
  const {
    id,
    label,
    type,
    name,
    placeholder,
    value,
    onChange,
    readOnly,
    children,
  } = props



  return (
    <InputWrapper>
      <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type={type}
          /* inputMode="numeric" — на телефоне открывается клавиатура только
             с цифрами, а не полная с буквами */
          inputMode={type === "number" ? "numeric" : undefined}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          readOnly={readOnly}
        />
        {children}
    </InputWrapper>
  )
}

export default Input
