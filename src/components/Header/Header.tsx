import React from 'react';
import HeaderCatalogMenu from './HeaderCatalogMenu';
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
        <HeaderCatalogMenu />
        <Link href={'/saved'} className={`${s.nav_item} ${pathname == "/saved" ? s.active : ""}`}>Сохранённое</Link>
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