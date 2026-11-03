import React from 'react';
import Search from '../search/Search';
import s from '../../app/styles/Header.module.css';
import Logo from '../../../public/assets/img/logo1.svg'
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AllFilmsIcon, NavigationItem, StyledLink } from '../MobileNavigation';
import { TelegramIcon } from '@/app/styles/Header.styles';
import HeaderAuth from '../HeaderAuth/HeaderAuth';

const Header: React.FC = () =>{

  const pathname = usePathname();

    return (
        <header className={s.header}>
        <div className={s.header_wrapper}>
        {/* <NavLink to={'/'} className={s.logo}>FILMS</NavLink> */}
        <Link
          href={'/'}
          className={s.logo}
          onClick={() => {
            // уже на главной — переход не пересоздаст компонент, поэтому просим
            // страницу обновить ряды вручную
            if (pathname === '/') window.dispatchEvent(new Event('fh:refresh-home'));
          }}
        >
          <Logo className={s.logo} alt='filmhub' />
        </Link>
        <Search />
        <nav className={s.nav}>
        {/* Разделы каталога — прямыми ссылками: выпадающие меню плохо замечают */}
        <Link href={'/films'} className={`${s.nav_item} ${pathname == "/films" ? s.active : ""}`}>Фильмы</Link>
        <Link href={'/series'} className={`${s.nav_item} ${pathname == "/series" ? s.active : ""}`}>Сериалы</Link>
        <Link href={'/cartoons'} className={`${s.nav_item} ${pathname == "/cartoons" ? s.active : ""}`}>Мультфильмы</Link>
        {/* Разделитель: разделы каталога отделены от «Сохранённого» */}
        <span className={s.nav_divider} aria-hidden="true" />
        {/* «Сохранённое» иконкой: так поиск получает больше места */}
        <Link
          href={'/saved'}
          className={`${s.nav_icon} ${pathname == "/saved" ? s.active : ""}`}
          aria-label="Сохранённое"
          title="Сохранённое"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 3.5h12a1 1 0 0 1 1 1v16l-7-4.2-7 4.2v-16a1 1 0 0 1 1-1z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        {/* вход внутри nav — так шапка на компьютере стоит как раньше */}
        <HeaderAuth />
        <NavigationItem $active={(+(pathname === '/films'))}>
{/*         <StyledLink href="https://t.me/filmhub_lol">
        <TelegramIcon />
        </StyledLink> */}
      </NavigationItem>
        </nav>
        {/* На телефоне nav скрыт целиком, поэтому вход дублируется рядом */}
        <div className={s.auth_mobile}>
          <HeaderAuth />
        </div>
        </div>
      </header>
    )
}

export default Header;