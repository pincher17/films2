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
        <HomeIcon active={(+(pathname === '/'))} />
        <span>Главная</span>
        </StyledLink>
      </NavigationItem>
      <NavigationItem $active={(+(pathname === '/films'))}>
        <StyledLink href="/films">
        <AllFilmsIcon active={(+(pathname === '/films'))} />
        <span>Все фильмы</span>
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
