'use client'

import Link from "next/link";
import { H1Error, NotFoundAllWrapper, NotFoundWrapper, TextError } from "./styles/NotFoundPage.styles";
import Header from "@/components/Header/Header";

export default function NotFound(){
    return(
        <>
        <Header />
        <NotFoundAllWrapper>
        <NotFoundWrapper>
          <div>
          <H1Error>Ошибка 404. Страница не найдена</H1Error>
          </div>
          <div>
          <TextError>Возможно Вы неверно указали адрес страницы.</TextError>
          </div>
          <Link href='/' style={{ textDecoration: 'underline' }}>На главную</Link>
        </NotFoundWrapper>
        </NotFoundAllWrapper>
        </>
    )
}