import { MutableRefObject } from "react"

export interface InputProps {
  id: string
  label?: string
  type: string
  name: string
  value: string | number
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  readOnly?: boolean
  children?: React.ReactNode
/*   ref?: MutableRefObject<HTMLInputElement | null> */
 /*  myRef?: any */
  /* setRef?: React.RefObject<HTMLInputElement>; */
}

