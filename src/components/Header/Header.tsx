import React from 'react';
import Search from '../search/Search';
import s from '../../app/styles/Header.module.css';
import Logo from '../../../public/assets/img/logo1.svg'
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Header: React.FC = () =>{

  const pathname = usePathname();

    return (
        <header className={s.header}>
        <div className={s.header_wrapper}>
        {/* <NavLink to={'/'} className={s.logo}>FILMS</NavLink> */}
        <Link href={'/'} className={s.logo}>
          <Logo className={s.logo} alt='filmhub' />
        </Link>
        <Search />
        <nav className={s.nav}>
        <Link href={'/films'} className={`${s.nav_item} ${pathname == "/films" ? s.active : ""}`}>Все фильмы</Link>
        </nav>
        </div>
      </header>
    )
}

export default Header;