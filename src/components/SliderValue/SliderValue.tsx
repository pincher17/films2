import { Box, createTheme, Slider, ThemeProvider } from '@mui/material';
import React from 'react';
import Input from '../Input';
import { Title, Wrapper, WrapperInputs } from '../../app/styles/SliderValue.styles';
import { SliderValueProps } from './SliderValue.types';

const theme = createTheme({
    palette: {
      secondary: {
        main: '#d32929',
      },
    },
  });

const SliderValue: React.FC<SliderValueProps> = (props) =>{

  const {
    defaulFirstValue,
    defaulSecondValue,
    integer,
    max,
    min,
    step,
    title,
    onChangeValue,
  } = props
 
  const [value, setValue] = React.useState<number[]>([defaulFirstValue, defaulSecondValue]);
  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
    onChangeValue(newValue as number[]);
  };

  const ChangeInputFirst = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue
    if(integer){
      newValue = parseInt(e.target.value)
    }else{
      newValue = e.target.value
    }
    if(+newValue <= max){
      let newArrValue = [newValue, value[1]]
      setValue(newArrValue as number[])
    }else{
      return
    }
  }

  const ChangeInputSecond = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue
    if(integer){
      newValue = parseInt(e.target.value)
    }else{
      newValue = e.target.value
    }
    if(+newValue <= max){
      let newArrValue = [value[0], newValue]
      setValue(newArrValue as number[])
    }else{
      return
    }
  }

    return (
    <Wrapper>
    <Title>{title}</Title>
    <WrapperInputs>
      <Input 
        id='firstValue'
        name=''
        onChange={ChangeInputFirst} 
        type='number'
        value={value[0]}
      />
      <Input 
        id='secondValue'
        name=''
        onChange={ChangeInputSecond} 
        type='number'
        value={value[1]}
      />
    </WrapperInputs>
    
    <ThemeProvider theme={theme}>
    <Box>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        step={step}
        min={min}
        max={max}
        color="secondary"
      />
    </Box>
    </ThemeProvider>
    </Wrapper>
    )
}

export default SliderValue;