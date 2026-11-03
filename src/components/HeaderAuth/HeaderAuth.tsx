"use client";

/**
 * Вход в шапке: кнопка «Войти» для гостя и аватар с меню для вошедшего.
 * Пока сессия загружается, ничего не показываем — иначе кнопка «Войти»
 * мигала бы у авторизованного пользователя.
 */

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  // отступ от «Все фильмы»: без него на узких экранах они слипаются
  margin-left: 28px;

  @media (max-width: 700px) {
    margin-left: 14px;
  }
`;

const SignIn = styled(Link)`
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 18px;
  border-radius: 8px;
  background: #b81616;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background: #d21c1c;
  }
`;

const Avatar = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
`;

const AvatarImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: #2a2a2a;
`;

const AvatarFallback = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #b81616;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.25);
`;

const Menu = styled.div`
  position: absolute;
  top: 46px;
  right: 0;
  min-width: 230px;
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 8px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65);
  z-index: 50;
`;

const MenuHead = styled.div`
  padding: 10px 12px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 6px;
`;

const MenuName = styled.div`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MenuMail = styled.div`
  color: rgba(255, 255, 255, 0.45);
  font-size: 12px;
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MenuItem = styled(Link)`
  display: block;
  padding: 10px 12px;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }
`;

const MenuButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }
`;

const HeaderAuth: React.FC = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  // если картинка Google не загрузилась — показываем букву, а не «сломанную» иконку
  const [imageFailed, setImageFailed] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  if (status === "loading") return null;

  if (status !== "authenticated") {
    return (
      <Wrapper>
        <SignIn href="/login">Войти</SignIn>
      </Wrapper>
    );
  }

  const user = session?.user;
  const letter = (user?.name || user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <Wrapper ref={ref}>
      <Avatar type="button" onClick={() => setOpen((value) => !value)} aria-label="Меню профиля">
        {user?.image && !imageFailed ? (
          <AvatarImage
            src={user.image}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <AvatarFallback>{letter}</AvatarFallback>
        )}
      </Avatar>

      {open && (
        <Menu>
          <MenuHead>
            <MenuName>{user?.name || "Профиль"}</MenuName>
            {user?.email && <MenuMail>{user.email}</MenuMail>}
          </MenuHead>
          <MenuItem href="/continue" onClick={() => setOpen(false)}>
            Продолжить просмотр
          </MenuItem>
          <MenuItem href="/films" onClick={() => setOpen(false)}>
            Все фильмы
          </MenuItem>
          <MenuButton type="button" onClick={() => signOut({ callbackUrl: "/" })}>
            Выйти
          </MenuButton>
        </Menu>
      )}
    </Wrapper>
  );
};

export default HeaderAuth;
