'use client'

import { AllFilmsIcon, HomeIcon, NavigationContainer, NavigationItem, SearchIcon, StyledLink } from '../../app/styles/MobileNavigation.styles';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setMobileSearch } from '@/redux/searchSlice';
import { usePathname } from 'next/navigation';

const MobileNavigation = () => {
  const mobileSearch = useAppSelector(state => state.search.mobileSearch);
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const switchMobileSearch = (value: boolean) => dispatch(setMobileSearch(value))

  return (
    <NavigationContainer>
      <NavigationItem $active={(+(pathname === '/'))}>
        <StyledLink href="/">
        <HomeIcon $active={(+(pathname === '/'))} />
        <span>Главная</span>
        </StyledLink>
      </NavigationItem>
      <NavigationItem $active={(+(pathname === '/films'))}>
        <StyledLink href="/films">
        <AllFilmsIcon $active={(+(pathname === '/films'))} />
        <span>Все фильмы</span>
        </StyledLink>
      </NavigationItem>
      {/* сохранённое: отдельный пункт меню, иконка — закладка */}
      <NavigationItem $active={(+(pathname === '/saved'))}>
        <StyledLink href="/saved">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        <span>Сохранённое</span>
        </StyledLink>
      </NavigationItem>
      <NavigationItem
        $active={(+mobileSearch)}
        onClick={() => switchMobileSearch(true)}
      >
        <SearchIcon />
        <span>Поиск</span>
      </NavigationItem>
    </NavigationContainer>
  );
};

export default MobileNavigation;
